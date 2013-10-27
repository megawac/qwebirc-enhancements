
irc.Commands = new Class({//sort of an abstract class but relies on irc.IRCClient so not really
    // Binds: ["exec"],

    __autojoined: false,

    // routes all outputs with the server
    // this method will call functions in: Commands based on the this scope
    exec: function(line, chan) {
        var self = this,
            allargs = util.formatCommand(line);

        //is it clearer to use a do-while? - anyway allargs var will change each loop
        for (var command, args, cmdopts, activewin, splitargs, minargs, fn, win, target; $defined(allargs); ) {
            command = allargs[0].toUpperCase();
            command = config.COMMAND_ALIAS[command] || command;
            args = allargs[1];
            target = chan;

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
            win = chan ? self.windows[chan] : self.getActiveWindow();
            if (activewin && win && !util.isChannelType(win.type)) { //win.type !== ui.WINDOW_CHANNEL) && (win.type !== ui.WINDOW_QUERY) 
                self.writeMessages(lang.invalidCommand);
                break;
            }
            else */if (cmdopts.minargs && cmdopts.minargs > _.size(args)) {
                self.writeMessages(lang.insufficentArgs, {}, {
                    channel: chan
                });
                break;
            }
            if (_.isNumber(cmdopts.splitargs) && _.isString(args)) {
                args = args.splitMax(" ", cmdopts.splitargs);
                if(cmdopts.target/* && util.isChannel(args[0])*/) {
                    target = args.shift();//so you can avoid checks for correct syntax
                }
            }

            allargs = cmdopts.fn.call(self, args, target);
        }
    },


    automode: function(modes, mode, args, channel) {
        args.length.times(function() {
            modes += mode;
        });
        this.send(format(cmd.MODE, {
            target: channel,
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
                var nick = this.nickname;
                this.trigger("privAction", {
                    'nick': nick,
                    'message': args,
                    'target': target,
                    'channel': target,
                    "prefix": this.getNickStatus(target, nick)
                });
            }

        }
    },

    cmd_CTCP: {
        target: true,
        splitargs: 3,
        minargs: 2,
        fn: function(args, target) {
            var type = args[0].toUpperCase(),
                message = args[1] || "";

            var msg = format(cmd.CTCP, {
                target: target,
                type: type,
                text: message
            });

            if (this.send(msg)) {
                this.trigger("privCTCP", {
                    'nick': this.nickname,
                    '_type': type,
                    'message': message,
                    'args': args,
                    'type': 'CTCPReply'
                });
            }
        }
    },

    cmd_SAY: {
        minargs: 1,
        fn: function(args, target) { //direct
            return ["PRIVMSG", target + " " + args || ""];//purpose is different split args
        }
    },

    cmd_PRIVMSG: {
        target: true,
        splitargs: 2,
        minargs: 1,
        fn: function(args, target) {
            var message = args[0];
            var nick = this.nickname;
            var msg = format(cmd.PRIVMSG, {
                target: target,
                message: message
            });

            if (util.isChannel(target)) {
                if (this.send(msg)) {
                    this.trigger("chanMessage", {
                        'nick': nick,
                        'channel': target,
                        'message': message,
                        'type': 'chanmsg',
                        "prefix": this.getNickStatus(target, nick)
                    });
                }
            } else {
                return ["QUERY", target + " " + message];
            }
        }
    },

    cmd_NOTICE: {
        target: true,
        splitargs: 2,
        minargs: 1,
        fn: function(args, target) {
            var message = args[0];
            var msg = format(cmd.NOTICE, {
                target: target,
                message: message
            });
            var noticeType = util.isChannel(target) ? "chanNotice" : "privNotice";

            if (this.send(msg)) {
                this.trigger(noticeType, {
                    'nick': this.nickname,
                    'channel': target,
                    'target': target,
                    'message': message
                });
            }
        }
    },

    cmd_QUERY: {
        target: true,
        splitargs: 2,
        minargs: 1,
        fn: function(args, target) {
            var message = args[0];
            if (util.isChannel(target)) {
                return this.writeMessages(lang.invalidChanTarget);
            }
            if(_.size(message) > 1) {
                var msg = format(cmd.PRIVMSG, {
                    target: target,
                    message: message
                });
                this.send(msg);
            }

            this.trigger("query", {
                'nick': this.nickname,
                'channel': target,
                'message': message,
                'type': 'privmsg'/*,
                'open': true*/
            });
        }
    },

    // cmd_OPTIONS: {
    //     fn: function(args) {
    //         this.trigger("openWindow", {
    //             'window': "optionsWindow",
    //             'type': ui.WINDOW.custom
    //         });
    //     }
    // },

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
        minargs: 1,
        fn: function(args) {
            this.send(args);
        }
    },

    cmd_KICK: {
        target: true,
        splitargs: 3,
        minargs: 1,
        fn: function(args, target) {
            this.send(format(cmd.KICK, {
                channel: target,
                kickee: args[0],
                message: args[1] || ""
            }));
        }
    },

    cmd_OP: {
        target: true,
        splitargs: 6,
        minargs: 1, 
        fn: function(args, target) {
            this.automode("+", "o", args, target);
        }
    },
    cmd_DEOP: {
        target: true,
        splitargs: 6,
        minargs: 1,
        fn: function(args, target) {
            this.automode("-", "o", args, target);
        }
    },
    cmd_AUTH: {//must be configured per server in config.irc_commands
        splitargs: 2,
        minargs: 2,
        fn: function(args) {
            var msg = format(cmd.AUTH, {
                username: args[0],
                password: args[1]
            });
            this.send(msg);
        }
    },
    cmd_VOICE: {
        target: true,
        splitargs: 6,
        minargs: 1,
        fn: function(args, target) {
            this.automode("+", "v", args, target);
        }
    },
    cmd_DEVOICE: {
        target: true,
        splitargs: 6,
        minargs: 1,
        fn: function(args, target) {
            this.automode("-", "v", args, target);
        }
    },
    cmd_TOPIC: {
        target: true,
        splitargs: 2,
        minargs: 1,
        fn: function(args, channel) {
            var msg = format(cmd.TOPIC, {
                channel: channel,
                topic: args[0]
            });
            this.send(msg);
        }
    },
    cmd_AWAY: {
        splitargs: 1,
        minargs: 0,
        fn: function(args) {
            var msg = format(cmd.AWAY, {
                message: args[0] || ""
            })
            this.send(msg);
        }
    },
    cmd_QUIT: {
        splitargs: 1,
        minargs: 0,
        fn: function(args) {
            this.quit(args[0] || "");
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
        splitargs: 1,
        minargs: 1,
        fn: function(args) {
            if(_.isEmpty(args)) return;
            var channels = Array.from(args).flatten(),
                formatted = util.formatChannelString(channels);

            if (!_.isEqual(channels, util.splitChans(formatted) )) {
                this.writeMessages(lang.poorJoinFormat);
            }
            if(formatted) {
                this.send(format(cmd.JOIN, {
                    channel: formatted/*,
                    args : args.join(" ")*/
                }));
            }
        }
    },
    cmd_JOIN: {
        splitargs: 1,
        minargs: 1,
        fn: function(args) {//accepts string or array
            var channels = Array.from(args).map(util.splitChans).flatten().filter(this.canJoinChannel, this);
            this.cmd_FJOIN.fn.call(this, channels);//join channels into a single comma sep string then join
        }
    },
    cmd_PART: {
        target: true,
        splitargs: 2,
        minargs: 0,
        fn: function(args, channel) {
            this.storeChannels(util.removeChannel(this.channels, channel));
            this.send(format(cmd.PART, {
                channel: args[0] || channel,
                message: args[1] || lang.partChan
            }));
        }
    },
    cmd_UMODE: {
        splitargs: 1,
        minargs: 0,
        fn: function(args) {
            this.send(format(cmd.MODE, {
                target: this.nickname,
                mode: args[0] || ""
            }));
        }
    },
    cmd_AUTOJOIN: {
        fn: function(args) {
            if(!this.__autojoined) {
                this.__autojoined = true;
                this.currentChannel = BROUHAHA;
                return ["JOIN", this.getChannels()];
            }
        }
    }
});