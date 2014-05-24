/**
 * Command parser interface
 *
 * @depends [util/lang, util/utils, config/commands]
 * @provides [irc/Commands]
 */
function formatMessage(cmdline) {
    if (_.isArray(cmdline)) return cmdline;
    if (cmdline.startsWith("/")) {
        cmdline = (cmdline.startsWith("//") ? "SAY " : "") + cmdline.slice(1); //qweb issue #349
    } else {
        cmdline = "SAY " + cmdline; //default just say the msg
    }
    return util.splitMax(cmdline, " ", 2); //split command from the params
}

irc.Commands = new Class({//sort of an abstract class but relies on irc.Client so not really
    __autojoined: false,

    // routes all outputs with the server
    // this method will call functions in: Commands based on the this scope
    exec: function(line, chan) {
        var self = this,
            allargs = line,
            command, args, cmdopts, target;
        //allargs var will change each loop over
        while (allargs != null) {
            allargs = formatMessage(allargs);
            command = allargs[0].toUpperCase();
            command = config.COMMAND_ALIAS[command] || command;
            args = allargs[1];
            target = chan;

            cmdopts = self["cmd_" + command];//comand handler

            if (!cmdopts) {
                self.send(command + util.padspace(args));
                break;
            }

            if (cmdopts.minargs && cmdopts.minargs > _.size(args)) {
                self.writeMessages(lang.insufficentArgs, {}, {
                    channel: chan
                });
                break;
            }
            if (_.isNumber(cmdopts.splitargs) && _.isString(args)) {
                args = util.splitMax(args, " ", cmdopts.splitargs);
                //only guess target if cmdopts.target less than eq length
                if(cmdopts.target && cmdopts.target <= args.length) {
                    target = args.shift();//so you can avoid checks for correct syntax
                }
            }

            allargs = cmdopts.fn.call(self, args || [], target);
        }
    },

    //ta7.de/txt/computer/computer001.htm
    automode: function(dir, modes, args, channel) {
        this.send(util.formatCommand("MODE", {
            target: channel,
            mode: dir + modes.join(""),
            args: args.join(" ")
        }));
    },

    /*****************commands ****************/

    /* [splitintoXargs, minargs, function] */
    cmd_ME: {
        fn: function(args, target) {
            args = args || "";

            var msg = util.formatCommand("ACTION", {
                target: target,
                text: args
            });

            if (this.send(msg)) {
                this.trigger("privAction", {
                    "nick": this.nickname,
                    "message": args,
                    "target": target,
                    "channel": target,
                    "prefix": this.getNickStatus(target, this.nickname)
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

            var msg = util.formatCommand("CTCP", {
                target: target,
                type: type,
                text: message
            });

            if (this.send(msg)) {
                this.trigger("privCTCP", {
                    "nick": this.nickname,
                    "_type": type,
                    "message": message,
                    "args": args,
                    "type": "CTCPReply"
                });
            }
        }
    },

    cmd_SAY: {
        minargs: 1,
        fn: function(args, target) { //direct
            return ["PRIVMSG", target + ((" " + args) || "")];//purpose is different split args
        }
    },

    cmd_PRIVMSG: {
        target: true,
        splitargs: 2,
        minargs: 1,
        fn: function(args, target) {
            var message = args[0];
            var nick = this.nickname;
            var msg = util.formatCommand("PRIVMSG", {
                target: target,
                message: message
            });

            if (util.isChannel(target)) {
                if (this.send(msg)) {
                    this.trigger("chanMessage", {
                        "nick": nick,
                        "channel": target,
                        "message": message,
                        "type": "chanmsg",
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
            var msg = util.formatCommand("NOTICE", {
                target: target,
                message: message
            });
            var noticeType = util.isChannel(target) ? "chanNotice" : "privNotice";

            if (this.send(msg)) {
                this.trigger(noticeType, {
                    "nick": this.nickname,
                    "channel": target,
                    "target": target,
                    "message": message
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
                this.writeMessages(lang.invalidChanTarget);
                return;
            }
            if(_.size(message) > 1) {
                var msg = util.formatCommand("PRIVMSG", {
                    target: target,
                    message: message
                });
                this.send(msg);
            }

            this.trigger("query", {
                "nick": this.nickname,
                "channel": target,
                "message": message,
                "type": "privmsg"/*,
                "open": true*/
            });
        }
    },

    cmd_QUOTE: {
        minargs: 1,
        fn: function(args) {
            this.send(args);
        }
    },

    cmd_AUTH: { //must be configured per server in config.irc_commands
        splitargs: 2,
        minargs: 2,
        fn: function(args) {
            return util.formatCommand("AUTH", {
                username: args[0],
                password: args[1]
            });
        }
    },

    cmd_KICK: {
        target: 2,
        splitargs: 3,
        minargs: 1,
        fn: function(args, target) {
            this.send(util.formatCommand("KICK", {
                channel: target,
                kickee: args[0],
                message: args[1] || ""
            }));
        }
    },

    cmd_OP: {
        target: 2,
        splitargs: 3,
        minargs: 1,
        fn: function(args, target) {
            this.automode(constants.op, "o", args, target);
        }
    },
    cmd_DEOP: {
        target: 2,
        splitargs: 3,
        minargs: 1,
        fn: function(args, target) {
            this.automode(constants.deop, "o", args, target);
        }
    },
    cmd_VOICE: {
        target: 2,
        splitargs: 3,
        minargs: 1,
        fn: function(args, target) {
            this.automode(constants.op, "v", args, target);
        }
    },
    cmd_DEVOICE: {
        target: 2,
        splitargs: 3,
        minargs: 1,
        fn: function(args, target) {
            this.automode(constants.deop, "v", args, target);
        }
    },
    cmd_TOPIC: {
        target: true,
        splitargs: 2,
        minargs: 1,
        fn: function(args, channel) {
            var msg = util.formatCommand("TOPIC", {
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
            var msg = util.formatCommand("AWAY", {
                message: args[0] || ""
            });
            this.send(msg);
        }
    },
    cmd_QUIT: {
        splitargs: 1,
        minargs: 0,
        fn: function(args) {
            this.quit(args[0] || "", true);
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
            var channels = args.flatten();
            var formatted = util.formatChannelString(channels);

            if (!_.isEqual(channels, util.splitChans(formatted) )) {
                this.writeMessages(lang.poorJoinFormat);
            }
            if(formatted) {
                this.send(util.formatCommand("JOIN", {
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
            var channels = args.map(util.splitChans).flatten().filter(this.canJoinChannel, this);
            this.cmd_FJOIN.fn.call(this, channels);//join channels into a single comma sep string then join
        }
    },
    cmd_PART: {
        target: true,
        splitargs: 2,
        minargs: 0,
        fn: function(args, channel) {
            this.storeChannels(util.removeChannel(this.channels, channel));
            this.send(util.formatCommand("PART", {
                channel: args[0] || channel,
                message: args[1] || lang.partChan
            }));
        }
    },
    cmd_UMODE: {
        splitargs: 1,
        minargs: 0,
        fn: function(args) {
            this.send(util.formatCommand("MODE", {
                target: this.nickname,
                mode: args[0] || ""
            }));
        }
    },
    cmd_AUTOJOIN: {
        fn: function() {
            if(!this.__autojoined) {
                this.__autojoined = true;
                return ["JOIN", this.getChannels()];
            }
        }
    },

    cmd_CLEAR: {
        fn: function() {
            this.trigger("clear");
        }
    }
});