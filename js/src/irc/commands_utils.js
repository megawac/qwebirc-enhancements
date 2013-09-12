
irc.Commands = new Class({
    Binds: ["dispatch"],
    initialize: function(parentObject) {
        this.parentObject = parentObject;
        this.send = parentObject.send;
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

    format: format,

    // routes all outputs with the server
    // this method will call functions in: Commands based on the this scope
    dispatch: function(line, chan) {
        var self = this,
            allargs = util.formatCommand(line),
            par = self.parentObject;

        //is it clearer to use a do-while? - anyway allargs var will change each loop
        for (var command, args, cmdopts, activewin, splitargs, minargs, fn, win; $defined(allargs); ) {
            command = allargs[0].toUpperCase();
            command = config.COMMAND_ALIAS[command] || command;
            args = allargs[1];

            cmdopts = self["cmd_" + command];//comand handler

            if (!cmdopts) {
                self.send(command + util.padspace(args));
                break;
            }

            //props from on of the command arrays
            // activewin = cmdopts[0];
            // splitargs = cmdopts[1];
            // minargs = cmdopts[2];
            // fn = cmdopts[3];

           /* //errors in command
            win = chan ? par.windows[chan] : self.getActiveWindow();
            if (activewin && win && !util.isChannelType(win.type)) { //win.type !== ui.WINDOW_CHANNEL) && (win.type !== ui.WINDOW_QUERY) 
                par.writeMessages(lang.invalidCommand);
                break;
            }
            else */if (cmdopts.minargs && cmdopts.minargs > _.size(args)) {
                par.writeMessages(lang.insufficentArgs, {}, {
                    channel: chan
                });
                break;
            }
            else if (cmdopts.splitargs && args) {
                args = args.splitMax(" ", cmdopts.splitargs);
            }

            allargs = cmdopts.fn.call(self, args, chan);
        }
    },


    automode: function(modes, mode, args, channel) {
        args.length.times(function() {
            modes += mode;
        });
        this.send(format(cmd.MODE, {
            nick: channel,
            mode: modes,
            args: args.join(" ")
        }));
    },

    /*****************commands ****************/

    /* [require_active_window, splitintoXargs, minargs, function] */
    cmd_ME: {
        fn: function(args, target) {
            args = args || "";

            var msg = format(cmd.ACTION, {
                target: target,
                text: args
            });

            if (this.send(msg)) {
                var nick = this.parentObject.nickname;
                this.trigger("privAction", {
                    'nick': nick,
                    'message': args,
                    'target': target,
                    'channel': target,
                    "@": this.parentObject.getNickStatus(target, nick)
                });
            }

        }
    },

    cmd_CTCP: {
        splitargs: 3,
        minargs: 2,
        fn: function(args, target) {
            target = args[0] || target
            var type = args[1].toUpperCase(),
                message = args[2] || "";

            var msg = format(cmd.CTCP, {
                target: target,
                type: type,
                text: message
            });

            if (this.send(msg)) {
                this.trigger("privCTCP", {
                    'nick': this.parentObject.nickname,
                    '_type': type,
                    'message': message,
                    'args': args,
                    'type': 'CTCPReply'
                });
            }
        }
    },

    cmd_SAY: {
        splitargs: 1,
        minargs: 1,
        fn: function(args, target) { //direct
            return ["PRIVMSG", target + " " + args.join(" ")];//purpose is different split args
        }
    },

    cmd_PRIVMSG: {
        splitargs: 2,
        minargs: 1,
        fn: function(args, target) {
            var message;
            if(args.length > 1) { //assume theyre meaning to target cur chan
                target = args[0];
                message = args[1];
            } else {
                message = args[0];
            }
            var parentObj = this.parentObject;
            var nick = parentObj.nickname;
            var msg = format(cmd.PRIVMSG, {
                target: target,
                message: message
            });

            if (this.send(msg)) {
                if (util.isChannel(target)) {
                    this.trigger("chanMessage", {
                        'nick': nick,
                        'channel': target,
                        'message': message,
                        'type': 'chanmsg',
                        "@": parentObj.getNickStatus(target, nick)
                    });
                } else {
                    return ["QUERY", target + " " + message];
                }
            }
        }
    },

    cmd_NOTICE: {
        splitargs: 2,
        minargs: 2,
        fn: function(args) {
            var target = args[0];
            var message = args[1];
            var msg = format(cmd.NOTICE, {
                target: target,
                message: message
            });

            if (this.send(msg)) {
                this.trigger("chanNotice", {
                    'nick': this.parentObject.nickname,
                    'channel': target,
                    'target': target,
                    'message': message
                });
            }
        }
    },

    cmd_QUERY: {
        splitargs: 2,
        minargs: 1,
        fn: function(args, target) {
            var target = args[0],
                message = args[1];
            if (util.isChannel(target)) {
                return this.writeMessages(lang.invalidChanTarget);
            }
            var msg = format(cmd.PRIVMSG, {
                target: target,
                message: message
            });

            // this.parentObject.newWindow(target, ui.WINDOW_QUERY, true);
            if(this.send(msg)) {
                this.trigger("query", {
                    'nick': this.parentObject.nickname,
                    'channel': target,
                    'message': message,
                    'type': 'privmsg'
                });
            }
        }
    },

    cmd_LOGOUT: {
        fn: function(args) {
            this.parentObject.ui.logout();
        }
    },

    cmd_OPTIONS: {
        fn: function(args) {
            this.trigger("openWindow", {
                'window': "optionsWindow",
                'type': ui.WINDOW.custom
            });
        }
    },

    // cmd_EMBED: {
    //     fn: function(args) {
    //         this.trigger("openWindow", {
    //             'window': "embeddedWindow",
    //             'type': ui.WINDOW.custom
    //         });
    //     }
    // },

    // cmd_PRIVACYPOLICY: {
    //     fn: function(args) {
    //         this.trigger("openWindow", {
    //             'window': "privacyWindow",
    //             'type': ui.WINDOW.custom
    //         });
    //     }
    // },

    // cmd_ABOUT: {
    //     fn: function(args) {
    //         this.trigger("openWindow", {
    //             'window': "aboutWindow",
    //             'type': ui.WINDOW.custom
    //         });
    //     }
    // },

    cmd_QUOTE: {
        splitargs: 1,
        minargs: 1,
        fn: function(args) {
            this.send(args[0]);
        }
    },

    cmd_KICK: {
        splitargs: 2,
        minargs: 1,
        fn: function(args, channel) {
            var target = args[0];
            var message = args.length >= 2 ? args[1] : "";
            var msg = format(cmd.KICK, {
                channel: channel,
                kickee: target,
                message: message
            })

            this.send(msg);
        }
    },

    cmd_OP: {
        splitargs: 6,
        minargs: 1, 
        fn: function(args) {
            this.automode("+", "o", args);
        }
    },
    cmd_DEOP: {
        splitargs: 6,
        minargs: 1,
        fn: function(args) {
            this.automode("-", "o", args);
        }
    },
    cmd_AUTH: {//must be configured per server in config.irc_commands
        splitargs: 2,
        minargs: 2,
        fn: function(args) {
            var msg = format(irc.AUTH, {
                username: args[0],
                password: args[1]
            });
            this.send(msg);
        }
    },
    cmd_VOICE: {
        splitargs: 6,
        minargs: 1,
        fn: function(args) {
            this.automode("+", "v", args);
        }
    },
    cmd_DEVOICE: {
        splitargs: 6,
        minargs: 1,
        fn: function(args) {
            this.automode("-", "v", args);
        }
    },
    cmd_TOPIC: {
        splitargs: 1,
        minargs: 1,
        fn: function(args, channel) {
            var topic;
            if(args.length > 1) {
                channel = args[0];
                topic = args[1];
            } else {
                topic = args[0];
            }
            var msg = format(cmd.TOPIC, {
                channel: channel,
                topic: topic
            });
            this.send(msg);
        }
    },
    cmd_AWAY: {
        splitargs: 1,
        minargs: 0,
        fn: function(args) {
            var msg = format(cmd.AWAY, {
                message: args ? args[0] : ""
            })
            this.send(msg);
        }
    },
    cmd_QUIT: {
        splitargs: 1,
        minargs: 0,
        fn: function(args) {
            this.parentObject.quit(args ? args[0] : "");
        }
    },
    // cmd_CYCLE: {
    //     splitargs: 1,
    //     minargs: 0,
    //     fn: function(args, channel) {
    //         channel = channel;

    //         this.send("PART " + channel + " :" + (args ? args[0] : "rejoining. . ."));
    //         this.send("JOIN " + channel);
    //     }
    // },
    cmd_FJOIN: {
        splitargs: 2,
        minargs: 1,
        fn: function(args) {
            if(_.isEmpty(args)) return;
            var channels = args.shift(),
                formatted = util.formatChannelString(channels);

            if (channels !== formatted) {
                this.parentObject.writeMessages(lang.poorJoinFormat);
            }
            if(formatted) {
                this.send(format(cmd.JOIN, {
                    channel: formatted,
                    args : args.join(" ")
                }));
            }
        }
    },
    cmd_JOIN: {
        splitargs: 2,
        minargs: 1,
        fn: function(args) {
            var channels = args.shift(),
                chans = util.splitChans(channels).filter(this.parentObject.canJoinChannel, this.parentObject);
            this.cmd_FJOIN.fn.call(this, Array.from(util.joinChans(chans)).concat(args));//join channels into a single comma sep string then join
        }
    },
    cmd_UMODE: {
        splitargs: 1,
        minargs: 0,
        fn: function(args) {
            var msg = format(cmd.MODE, {
                nick: this.parentObject.nickname,
                mode: args ? args[0] : ""
            })
            this.send(msg);
        }
    },
    cmd_BEEP: {
        fn: function() {
            this.parentObject.ui.beep();
        }
    },
    cmd_AUTOJOIN: {
        fn: function(args) {
            if(!auth.signedIn) {
                auth.signedIn = true;
                return ["JOIN", this.parentObject.options.autojoin.join(",")];
            }
        }
    },
    cmd_PART: {
        splitargs: 2,
        minargs: 0,
        fn: function(args, channel) {
            var msg = format(cmd.PART, {
                channel: args[0] || channel,
                message: args[1] || lang.partChan
            });

            this.send(msg);
        }
    }
});