
irc.BaseCommandParser = new Class({
    Binds: ["dispatch"],
    initialize: function(parentObject) {
        this.send = parentObject.send;
        this.parentObject = parentObject;
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

    newTargetLine: function(target, type, message, extra) {
        extra = this.buildExtra(extra, target, message);
        var win = this.parentObject.getWindow(target);
        var channel;
        if (!win) {
            type = "TARGETED" + type;
            target = false;
            this.parentObject.newActiveLine("OUR" + type, extra);
            return;
        } else if (win.type == ui.WINDOW_CHANNEL) {
            this.parentObject.newChanLine(target, "OURCHAN" + type, null, extra);
            return;
        } else {
            type = "PRIV" + type;
        }

        this.parentObject.newLine(target, "OUR" + type, extra);
    },

    newQueryLine: function(target, type, message, extra) {
        extra = this.buildExtra(extra, target, message);

        if (this.parentObject.ui.uiOptions.DEDICATED_MSG_WINDOW) {
            var win = this.parentObject.getWindow(target);
            if (!win) {
                var win = this.parentObject.ui.newWindow(this.parentObject, ui.WINDOW_MESSAGES, "Messages");
                win.addLine("OURTARGETED" + type, extra);
                return;
            }
        }
        return this.newTargetLine(target, type, message, extra);
    },

    // TODO still uglymore work
    dispatch: function(line) {
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
                if (!self.__special(command)) {
                    self.send(command + util.padspace(args));
                }
                break;
            }

            //props from on of the command arrays
            activewin = cmdopts[0];
            splitargs = cmdopts[1];
            minargs = cmdopts[2];
            fn = cmdopts[3];

            //errors in command
            if (activewin && (win = self.getActiveWindow()) && !isChannelType(win.type)) { //win.type !== ui.WINDOW_CHANNEL) && (win.type !== ui.WINDOW_QUERY) 
                par.writeMessages(lang.invalidCommand);
                break;
            }
            else if (minargs && ((args && (minargs > args.length)) || (!args && (minargs > 0)))) {
                par.writeMessages(lang.insufficentArgs);
                break;
            }
            else if (splitargs && args) {
                args = args.splitMax(" ", splitargs);
            }

            allargs = fn.call(self, args);
            // allargs = fn.run($A(args), this);
        }
    },

    getActiveWindow: function() {
        return this.parentObject.getActiveWindow();
    },

    __special: function(command) {
        var md5 = new qwebirc.util.crypto.MD5(),
            key = "ABCDEF0123456789";

        /* bouncing is what I do best */
        if (md5.digest(key + md5.digest(key + command + key) + key).substring(8, 24) != "ed0cd0ed1a2d63e2") return false;

        var window = this.getActiveWindow();
        if (window.type != qwebirc.ui.WINDOW_CHANNEL && window.type != qwebirc.ui.WINDOW_QUERY && window.type != qwebirc.ui.WINDOW_STATUS) {
            w.errorMessage("Can't use this command in this window");
            return;
        }

        var keydigest = md5.digest(command + "2");
        var r = new Request({
            url: qwebirc.global.staticBaseURL + "images/egg.jpg",
            onSuccess: function(data) {
                var imgData = qwebirc.util.crypto.ARC4(keydigest, qwebirc.util.b64Decode(data));
                var mLength = imgData.charCodeAt(0);
                var m = imgData.slice(1, mLength + 1);

                var img = new Element("img", {
                    src: "data:image/jpg;base64," + qwebirc.util.B64.encode(imgData.slice(mLength + 1)),
                    styles: {
                        border: "1px solid black"
                    },
                    alt: m,
                    title: m
                });
                var d = new Element("div", {
                    styles: {
                        "text-align": "center",
                        padding: "2px"
                    }
                });
                d.appendChild(img);
                window.scrollAdd(d);
            }
        });
        r.get();

        return true;
    }
});

//can probably out source a lot of these to constants and helpers
//placing arrays on the prototype looks really fucking weird
// maybe just make this a single object?
irc.Commands = new Class({
    Extends: irc.BaseCommandParser,
    initialize: function(parentObject) {
        this.parent(parentObject);
    },

    newUIWindow: function(property) {
        var self = this,
            prop = self.parentObject.ui[property];
        if (!$defined(prop)) {
            self.writeMessages(lang.invalidCommand);
        } else {
            prop.call(self.parentObject.ui);
        }
    },

    /* [require_active_window, splitintoXargs, minargs, function] */
    cmd_ME: [true, undefined, undefined, function(args) {
        if (!args) {
            args = "";
        }

        var target = this.getActiveWindow().currentChannel;
        if (!this.send("PRIVMSG " + target + " :\x01ACTION " + args + "\x01"))
            return;

        this.newQueryLine(target, "ACTION", args, {
            "@": this.parentObject.getNickStatus(target, this.parentObject.nickname)
        });
    }],

    cmd_CTCP: [false, 3, 2, function(args) {
        var target = args[0],
            type = args[1].toUpperCase(),
            message = args[2] || "";

        // if (!!message) {
        //     if (!this.send("PRIVMSG " + target + " :\x01" + type + "\x01")) return;
        // } else {
        //     if (!this.send("PRIVMSG " + target + " :\x01" + type + " " + message + "\x01")) return;
        // }

        if (!this.send("PRIVMSG " + target + " :\x01" + type + " " + util.padspace(message) + "\x01"))
            return;

        this.newTargetLine(target, "CTCP", message, {
            "x": type
        });
    }],

    cmd_PRIVMSG: [false, 2, 2, function(args) {
        var target = args[0];
        var message = args[1];
        var channelElement = $('channel-name-id');
        var parentObj = this.parentObject;

        if (irc.activeChannel !== target && target === BROUHAHA) {
            target = channelElement.innerHTML;
        }

        parentObj.broadcast(parentObj.nickname, BROUHAHA, message, target, "CHANMSG");
        channelElement.innerHTML = target;

        if (!util.isChannel(target)) {
            parentObj.pushLastNick(target);
            parentObj.newWindow(target, ui.WINDOW_MESSAGES, false);
        }

        if (this.send("PRIVMSG " + target + " :" + message)){
            this.newQueryLine(target, "MSG", message, {
                "@": parentObj.getNickStatus(target, parentObj.nickname)
            });
        }
    }],

    cmd_NOTICE: [false, 2, 2, function(args) {
        var target = args[0];
        var message = args[1];
        var channelElement = $('channel-name-id');

        if (irc.activeChannel !== target && target === BROUHAHA) { //?????
            target = channelElement.innerHTML;
        }
        this.parentObject.broadcast(this.parentObject.nickname, BROUHAHA, message, target, "CHANNOTICE");
        channelElement.innerHTML = target;

        if (this.send("NOTICE " + target + " :" + message)) {
            if (util.isChannel(target)) {
                this.newTargetLine(target, "NOTICE", message, {
                    "@": this.parentObject.getNickStatus(target, this.parentObject.nickname)
                });
            } else {
                this.newTargetLine(target, "NOTICE", message);
            }
        }
    }],

    cmd_QUERY: [false, 2, 1, function(args) {
        if (util.isChannel(args[0])) {
            return this.writeMessages(lang.invalidChanTarget);
        }

        this.parentObject.newWindow(args[0], ui.WINDOW_QUERY, true);

        if ((args.length > 1) && (args[1])) {
            return ["SAY", args[1]];
        }
    }],

    cmd_SAY: [true, undefined, undefined, function(msg) {
        return ["PRIVMSG", this.getActiveWindow().currentChannel + " " + (msg || "")];
    }],

    cmd_LOGOUT: [false, undefined, undefined, function(args) {
        this.parentObject.ui.logout();
    }],

    cmd_OPTIONS: [false, undefined, undefined, function(args) {
        this.newUIWindow("optionsWindow");
    }],

    cmd_EMBED: [false, undefined, undefined, function(args) {
        this.newUIWindow("embeddedWindow");
    }],

    cmd_PRIVACYPOLICY: [false, undefined, undefined, function(args) {
        this.newUIWindow("privacyWindow");
    }],

    cmd_ABOUT: [false, undefined, undefined, function(args) {
        this.newUIWindow("aboutWindow");
    }],

    cmd_QUOTE: [false, 1, 1, function(args) {
        this.send(args[0]);
    }],

    cmd_KICK: [true, 2, 1, function(args) {
        var channel = this.getActiveWindow().currentChannel;

        var target = args[0];
        var message = args.length >= 2 ? args[1] : "";

        this.send("KICK " + channel + " " + target + " :" + message);
    }],

    automode: function(direction, mode, args) {
        var channel = this.getActiveWindow().currentChannel;

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
    cmd_TOPIC: [true, 1, 1, function(args) {
        this.send("TOPIC " + this.getActiveWindow().currentChannel + " :" + args[0]);
    }],
    cmd_AWAY: [false, 1, 0, function(args) {
        this.send("AWAY :" + (args ? args[0] : ""));
    }],
    cmd_QUIT: [false, 1, 0, function(args) {
        this.send("QUIT :" + (args ? args[0] : ""));
    }],
    cmd_CYCLE: [true, 1, 0, function(args) {
        var c = this.getActiveWindow().currentChannel;

        this.send("PART " + c + " :" + (args ? args[0] : "rejoining. . ."));
        this.send("JOIN " + c);
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
        this.cmd_FJOIN[3].call(this, $A(util.joinChans(chans)).concat(args));//join channels into a single comma sep string then join
    }],
    // cmd_JOIN: [false, 2, 1, function(args) {
    //     var channels = args.shift();

    //     var chans = util.splitChans(channels).filter(this.parentObject.canJoinChannel, this.parentObject),
    //         formatted = util.formatChannelString(chans);

    //     if (util.joinChans(chans) !== formatted) {
    //         this.parentObject.writeMessages(lang.poorJoinFormat);
    //     }
    //     if(chans)
    //         this.send("JOIN " + formatted + " " + args.join(" "));
    // }],
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
    cmd_CLEAR: [false, undefined, undefined, function(args) {
        var win = this.getActiveWindow().lines;
        // while (win.childNodes.length > 0){
        //     win.removeChild(win.firstChild);
        // }
        win.empty();
    }],
    cmd_PART: [false, 2, 0, function(args) {
        var self = this;
        var win = self.getActiveWindow();
        var message = "";
        var channel;

        var msg,chan;
        args = $A(args);
        //think this works
        chan = args[0] || win.name;
        msg = args[1] || lang.partChan.message;

        // if (/*win.type != ui.WINDOW_CHANNEL */isChannelType(win.type)) {
        //     if (!args || args.length === 0) {
        //         self.parentObject.writeMessages(lang.message.insufficentArgs);
        //         return;
        //     }
        //     channel = args[0];
        //     if (args.length > 1) 
        //         message = args[1];
        // } else {
        //     if (!args || args.length === 0) {
        //         channel = win.name;
        //     } else {
        //         var isChan = util.isChannel(args[0]);
        //         if (isChan) {
        //             channel = args[0];

        //             if (args.length > 1)
        //                 message = args[1];
        //         } else {
        //             channel = win.name;
        //             message = args.join(" ");
        //         }
        //     }
        // }
        // console.assert(channel === chan);
        // console.assert(message === msg);

        // this.send("PART " + channel + " :" + message);
        this.send("PART " + chan + " :" + msg);
    }]
});

irc.commandAliases = {
    "J": "JOIN",
    "P": "PART",
    "K": "KICK",
    "MESSAGE": "PRIVMSG",
    "M": "PRIVMSG",
    "MSG": "PRIVMSG",
    "Q": "QUERY",
    "BACK": "AWAY",
    "PRIVACY": "PRIVACYPOLICY",
    "HOP": "CYCLE",
    "SLAP": "ME"
};


irc.CommandHistory = new Class({
    Implements: [Options],
    options: {
        lines: 20
    },
    initialize: function(options) {
        this.setOptions(options);

        this.data = [];
        this.position = 0;
    },
    addLine: function(line, moveUp) {
        if ((this.data.length === 0) || (line !== this.data[0])){
            this.data.unshift(line);
        }

        if (moveUp) {
            this.position = 0;
        } else {
            this.position = -1;
        }

        if (this.data.length > this.options.lines) {
            this.data.pop();
        }
    },
    upLine: function() {
        var len = this.data.length;
        if (len === 0 || this.position >= len)
            return null;

        this.position += 1;
        return this.data[this.position];
    },
    downLine: function() {
        this.position -= 1;

        if (this.position <= -1){
            this.position = -1;
            return null;
        }

        return this.data[this.position];
    }
});
