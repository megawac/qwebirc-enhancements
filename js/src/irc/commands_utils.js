
irc.BaseCommandParser = new Class({
    Binds: ["dispatch"],
    initialize: function(parentObject) {
        this.parentObject = parentObject;
        this.send = this.parentObject.send;
    },

    buildExtra: function(extra, target, message) {
        if (!extra) {
            extra = {};
        }

        extra["n"] = this.parentObject.nickname;
        extra["m"] = message;
        extra["t"] = target;
        return extra;
    },

    trigger: function(type, data) {
        return this.parentObject.trigger(type, data);
    },

    // routes all outputs with the server
    // this method will call functions in: Commands based on the this scope
    dispatch: function(line, chan) {
        var self = this,
            allargs = util.formatCommand(line),
            par = self.parentObject;

        //is it clearer to use a do-while? - anyway allargs var will change each loop
        for (var command, args, cmdopts, activewin, splitargs, minargs, fn, win; $defined(allargs); ) {
            command = allargs[0].toUpperCase();
            command = irc.commandAliases[command] || command;
            args = allargs[1];

            cmdopts = self["cmd_" + command];//comand handler

            if (!cmdopts) {
                self.send(command + util.padspace(args));
                break;
            }

            //props from on of the command arrays
            activewin = cmdopts[0];
            splitargs = cmdopts[1];
            minargs = cmdopts[2];
            fn = cmdopts[3];

           /* //errors in command
            win = chan ? par.windows[chan] : self.getActiveWindow();
            if (activewin && win && !util.isChannelType(win.type)) { //win.type !== ui.WINDOW_CHANNEL) && (win.type !== ui.WINDOW_QUERY) 
                par.writeMessages(lang.invalidCommand);
                break;
            }
            else */if (minargs && ((args && (minargs > args.length)) || (!args && (minargs > 0)))) {
                par.writeMessages(lang.insufficentArgs);
                break;
            }
            else if (splitargs && args) {
                args = args.splitMax(" ", splitargs);
            }

            allargs = fn.call(self, args, chan);
            // allargs = fn.run(Array.from(args), this);
        }
    }
});

//can probably out source a lot of these to constants and helpers
//placing arrays on the prototype looks really fucking weird
// maybe just make this a single dictionary?
irc.Commands = new Class({
    Extends: irc.BaseCommandParser,

    /* [require_active_window, splitintoXargs, minargs, function] */
    cmd_ME: [true, undefined, undefined, function(args, target) {
        args = args || "";

        target = target || this.getActiveWindow().currentChannel;
        if (!this.send("PRIVMSG " + target + " :\x01ACTION " + args + "\x01"))
            return;

        var nick = this.parentObject.nickname;
        this.trigger("privAction", {
            'nick': nick,
            'message': args,
            'target': target,
            'channel': target,
            "@": this.parentObject.getNickStatus(target, nick)
        });
    }],

    cmd_CTCP: [false, 3, 2, function(args) {
        var target = args[0],
            type = args[1].toUpperCase(),
            message = args[2] || "";

        if (this.send("PRIVMSG " + target + " :\x01" + type + " " + util.padspace(message) + "\x01")) {
            this.trigger("privCTCP", {
                'nick': this.parentObject.nickname,
                '_type': type,
                'message': message,
                'args': args,
                'type': 'CTCPReply'
            });
        }
    }],

    cmd_PRIVMSG: [false, 2, 2, function(args) {
        var target = args[0];
        var message = args[1];
        var parentObj = this.parentObject;
        var nick = parentObj.nickname;

        if (!util.isChannel(target)) {
            parentObj.pushLastNick(target);

            this.trigger("query", {
                'nick': nick,
                'channel': target,
                'message': message,
                'type': 'ourprivmsg'
            });
        }

        if (this.send("PRIVMSG " + target + " :" + message)){
            this.trigger("chanMessage", {
                'nick': nick,
                'channel': target,
                'message': message,
                'type': 'chanmsg',
                "@": parentObj.getNickStatus(target, nick)
            });
        }
    }],

    cmd_NOTICE: [false, 2, 2, function(args) {
        var target = args[0];
        var message = args[1];

        if (this.send("NOTICE " + target + " :" + message)) {
            this.trigger("chanNotice", {
                'nick': this.parentObject.nickname,
                'channel': target,
                'target': target,
                'message': message
            });
        }
    }],

    cmd_QUERY: [false, 2, 1, function(args) {
        var target = args[0],
            message = args[1];
        if (util.isChannel(target)) {
            return this.writeMessages(lang.invalidChanTarget);
        }

        // this.parentObject.newWindow(target, ui.WINDOW_QUERY, true);
        if(this.send("PRIVMSG " + target + " :" + message)) {
            this.trigger("query", {
                'nick': this.parentObject.nickname,
                'channel': target,
                'message': message,
                'type': 'privmsg'
            });
        }
    }],

    cmd_SAY: [true, undefined, undefined, function(msg, target) {
        return ["PRIVMSG", (target || this.getActiveWindow().currentChannel) + " " + (msg || "")];
    }],

    cmd_LOGOUT: [false, undefined, undefined, function(args) {
        this.parentObject.ui.logout();
    }],

    cmd_OPTIONS: [false, undefined, undefined, function(args) {
        this.trigger("openWindow", {
            'window': "optionsWindow",
            'type': ui.WINDOW.custom
        });
    }],

    cmd_EMBED: [false, undefined, undefined, function(args) {
        this.trigger("openWindow", {
            'window': "embeddedWindow",
            'type': ui.WINDOW.custom
        });
    }],

    cmd_PRIVACYPOLICY: [false, undefined, undefined, function(args) {
        this.trigger("openWindow", {
            'window': "privacyWindow",
            'type': ui.WINDOW.custom
        });
    }],

    cmd_ABOUT: [false, undefined, undefined, function(args) {
        this.trigger("openWindow", {
            'window': "aboutWindow",
            'type': ui.WINDOW.custom
        });
    }],

    cmd_QUOTE: [false, 1, 1, function(args) {
        this.send(args[0]);
    }],

    cmd_KICK: [true, 2, 1, function(args, channel) {
        channel = channel || this.getActiveWindow().currentChannel;

        var target = args[0];
        var message = args.length >= 2 ? args[1] : "";

        this.send("KICK " + channel + " " + target + " :" + message);
    }],

    automode: function(direction, mode, args, channel) {
        channel = channel || this.getActiveWindow().currentChannel;

        var modes = direction;

        args.length.times(function() {
            modes += mode;
        });

        this.send("MODE " + channel + " " + modes + " " + args.join(" "));
    },

    cmd_OP: [true, 6, 1, function(args) {
        this.automode("+", "o", args);
    }],
    cmd_DEOP: [true, 6, 1, function(args) {
        this.automode("-", "o", args);
    }],
    cmd_VOICE: [true, 6, 1, function(args) {
        this.automode("+", "v", args);
    }],
    cmd_DEVOICE: [true, 6, 1, function(args) {
        this.automode("-", "v", args);
    }],
    cmd_TOPIC: [true, 1, 1, function(args, channel) {
        this.send("TOPIC " + (channel || this.getActiveWindow().currentChannel) + " :" + args[0]);
    }],
    cmd_AWAY: [false, 1, 0, function(args) {
        this.send("AWAY :" + (args ? args[0] : ""));
    }],
    cmd_QUIT: [false, 1, 0, function(args) {
        this.parentObject.quit(args ? args[0] : "");
    }],
    cmd_CYCLE: [true, 1, 0, function(args, channel) {
        channel = channel || this.getActiveWindow().currentChannel;

        this.send("PART " + channel + " :" + (args ? args[0] : "rejoining. . ."));
        this.send("JOIN " + channel);
    }],
    cmd_FJOIN: [false, 2, 1, function(args) {
        if(args.length === 0)
            return;
        var channels = args.shift(),
            formatted = util.formatChannelString(channels);

        if (channels !== formatted) {
            this.parentObject.writeMessages(lang.poorJoinFormat);
        }
        if(formatted)
            this.send("JOIN " + formatted + " " + args.join(" "));
    }],
    cmd_JOIN: [false, 2, 1, function(args) {
        var channels = args.shift(),
            chans = util.splitChans(channels).filter(this.parentObject.canJoinChannel, this.parentObject);
            // formatted = util.formatChannelString(chans);

            // this.send("JOIN " + formatted + " " + args.join(" "));
        this.cmd_FJOIN[3].call(this, Array.from(util.joinChans(chans)).concat(args));//join channels into a single comma sep string then join
    }],
    cmd_UMODE: [false, 1, 0, function(args) {
        this.send("MODE " + this.parentObject.nickname + (args ? (" " + args[0]) : ""));
    }],
    cmd_BEEP: [false, undefined, undefined, function(args) {
        this.parentObject.ui.beep();
    }],
    cmd_AUTOJOIN: [false, undefined, undefined, function(args) {
        if(!auth.signedIn) {
            auth.signedIn = true;
            return ["JOIN", this.parentObject.options.autojoin.join(",")];
        }
    }],
    cmd_PART: [false, 2, 0, function(args) {
        args = Array.from(args);

        var msg = args[1] || lang.partChan.message,
            channel = args[0] || this.getActiveWindow().currentChannel;

        this.send("PART " + channel + " :" + msg);
    }]
});

irc.commandAliases = {
    "J": "JOIN",
    "P": "PART",
    "MESSAGE": "PRIVMSG",
    "M": "PRIVMSG",
    "MSG": "PRIVMSG",
    "PM": "PRIVMSG",
    "Q": "QUERY",
    "BACK": "AWAY",
    "PRIVACY": "PRIVACYPOLICY",
    "HOP": "CYCLE",
    "SLAP": "ME"
};
