/**
  * ircclient new and improved
  *
  * @depends [irc/Client]
  * @depends [irc/Numerics, util/utils]
  * @provides [irc/ResponseHandlers]
  */
var partHandler = function(client, nick, chan) {
    var wasus = nick === client.nickname;
    if(wasus && client.inChannel(chan)) {
        client.channels.erase(chan);
    }
    return wasus;
};

var initTopic = function(client, channel, topic) {
    client.trigger("chanTopic", {
        "channel": channel,
        "topic": topic,
        "initial": true
    });
};

var initChanUsers = function(client, channel, names) {
    if (names.length === 0) { //occurs on channel join
        client.updateNickList(channel);
        return;
    }
    var getPrefixes = util.prefixOnNick(client.prefixes);
    _.each(names, function(prenick) {
        var prefixNick = getPrefixes(prenick),
            prefixes = prefixNick[0],
            nick = prefixNick[1];

        var nc = client.tracker.addNickToChannel(nick, channel);

        _.each(prefixes, function(p) {
            util.addPrefix(nc, p, client.prefixes);
        });
    });
};

irc.Client.implement({
    /*********************************************************************
    *                                                                    *
    *                Implements the IRC HANDLERS                         *
    *                                                                    *
    **********************************************************************/
    IRC_COMMAND_MAP: {// function router see dispatch
        // "ERROR": "",
        // "INVITE": "",
        // "JOIN": "",
        // "KICK": "",
        // "MODE": "",
        // "NICK": "",
        // "NOTICE": "",
        // "PART": "",
        // "PING": "",
        // "TOPIC": "",
        // "PRIVMSG": "",
        // "QUIT": "",
        // "WALLOPS": "",

        "ERR_CANNOTSENDTOCHAN": "genericError",
        "ERR_CHANOPPRIVSNEEDED": "genericError",
        // "ERR_NICKNAMEINUSE": "",
        "ERR_NOSUCHNICK": "genericError"//,

        // "RPL_AWAY": "",
        // "RPL_CHANNELMODEIS": "",
        // "RPL_CREATIONTIME": "",
        // "RPL_ENDOFNAMES": "",
        // "RPL_ISUPPORT": "",
        // "RPL_LIST": "",
        // "RPL_LISTSTART": "",
        // "RPL_LISTEND": "",
        // "RPL_NAMREPLY": "",
        // "RPL_NOTOPIC": "",
        // "RPL_NOWAWAY": "",
        // "RPL_TOPIC": "",
        // "RPL_TOPICWHOTIME": "",
        // "RPL_UNAWAY": "",
        // "RPL_WELCOME": "",

        // "RPL_WHOISACCOUNT": "",
        // "RPL_WHOISACTUALLY": "",
        // "RPL_WHOISCHANNELS": "",
        // "RPL_WHOISGENERICTEXT": "",
        // "RPL_WHOISIDLE": "",
        // "RPL_WHOISOPERATOR": "",
        // "RPL_WHOISOPERNAME": "",
        // "RPL_WHOISSECURE": "",
        // "RPL_WHOISSERVER": "",
        // "RPL_WHOISUSER": "",
        // "RPL_WHOISWEBIRC": "",
        // "RPL_ENDOFWHOIS": "",
    },

    irc_PING: function(data) {
        this.send("PONG :" + _.last(data.args));
        return true;
    },

    irc_RPL_WELCOME: function(data) {
        var self = this;
        self.nickname = data.args[0];
        data.message = data.args[1];
        self._signOn(data);
        _.delay(function() {
            self.__signedOn = true; //so auto join channels arent selected immediately - brouhaha window is
        }, 2000);
    },

    irc_NICK: function(data) {
        var self = this,
            newnick = data.args[0],
            oldnick = data.nick,
            wasus = this.nickname === oldnick;

        if (wasus) {
            self.nickname = newnick;
            self.options.settings.set("nickname", newnick);
        }

        self.tracker.renameNick(oldnick, newnick);

        var channels = self.tracker.getNick(newnick);

        channels.each(function(obj, chan) {
            self.updateNickList(chan);
        });
        //_.keys(channels).each(self.updateNickList, self);

        self.trigger("nickChange", {
            "nick": oldnick,
            "newnick": newnick,
            "channels": channels,
            "thisclient": wasus,
            "type": "nick"
        });

        return true;
    },

    irc_JOIN: function(data) {
        var channel = data.args[0];
        var nick = data.nick;
        var wasus = (nick === this.nickname);

        if(wasus) {
            this.storeChannels(util.addChannel(this.getChannels(), channel));
        }

        this.tracker.addNickToChannel(nick, channel);
        this.updateNickList(channel);

        this.trigger("userJoined", {
            "nick": nick,
            "host": data.host,
            "channel": channel,
            "thisclient": wasus,
            "select": wasus && this.__signedOn
        });

        return true;
    },

    irc_QUIT: function(data) {
        var self = this,
            message = _.last(data.args),
            nick = data.nick,
            channels = self.tracker.getNick(nick);

        self.tracker.removeNick(nick);
        _.each(channels, function(nick, chan) {
            self.updateNickList(chan);
        });
        //_.keys(channels).each(self.updateNickList, self);

        self.trigger("quit", {
            "host": data.host,
            "nick": nick,
            "channels": channels,
            "message": message
        });

        return true;
    },

    irc_PART: function(data) {
        var channel = data.args[0],
            message = data.args[1],
            nick = data.nick;

        var wasus = partHandler(this, nick, channel);
        if (wasus) {
            this.tracker.removeChannel(channel);
        } else {
            this.tracker.removeNickFromChannel(nick, channel);
            this.updateNickList(channel);
        }

        this.trigger("part", {
            "nick": nick,
            "host": data.host,
            "channel": channel,
            "message": message,
            "thisclient": wasus
        });

        return true;
    },

    irc_KICK: function(data) {
        var kicker = data.prefix,
            channel = data.args[0],
            kickee = data.args[1],
            message = data.args[2];

        var wasus = partHandler(this, kickee, channel);
        if (wasus) {
            this.tracker.removeChannel(channel);
        } else {
            this.tracker.removeNickFromChannel(kickee, channel);
            this.updateNickList(channel);
        }

        this.trigger("kick", {
            "kicker": kicker,
            "channel": channel,
            "kickee": kickee,
            "message": message,
            "thisclient": wasus
        });

        return true;
    },

    irc_TOPIC: function(data) {
        var channel = data.args[0],
            topic = _.last(data.args);

        this.trigger("chanTopic", {
            "nick": data.nick,
            "channel": channel,
            "topic": topic
        });

        return true;
    },

    //todo buffer messages
    irc_PRIVMSG: function(data) {
        var nick = data.nick,
            target = data.args[0],
            message = _.last(data.args);

        var ctcp = this.processCTCP(message);
        if (ctcp) {
            var type = ctcp[0].toUpperCase();
            var replyfn = irc.RegisteredCTCPs[type];
            if (replyfn) {
                var t = Date.now() / 1000;//prevent flood
                if (t > this.nextctcp) {
                    this.send(util.formatCommand("CTCP", {
                        target: data.user,
                        type: type,
                        text: replyfn(ctcp[1])
                    }));
                }
                this.nextctcp = t + 5;
            }

            if (target === this.nickname) {
                var ctcptype = type === "ACTION" ? "privAction" : "privCTCP";
                this.trigger(ctcptype, {
                    "nick": nick,
                    "host": data.host,
                    "message": ctcp[1] || "",
                    "data": type
                });
            } else {
                var context = {
                    "nick": nick,
                    "channel": target,
                    "message": ctcp[1] || "",
                    "prefix": this.getNickStatus(target, nick)
                };
                if (type === "ACTION") {
                    this.tracker.updateLastSpoke(nick);
                    this.trigger("chanAction", context);
                }
                else {
                    this.trigger("chanCTCP", context);
                }
            }
        } else {
            this.tracker.updateLastSpoke(nick);
            if (target === this.nickname) {//private messages
                this.trigger("query", {
                    "nick": nick,
                    "host": data.host,
                    "channel": nick,
                    "message": message,
                    "type": "privmsg"
                });
            } else {
                this.trigger("chanMessage", {
                    "nick": nick,
                    "channel": target,
                    "message": message,
                    "type": "chanmsg",
                    "prefix": this.getNickStatus(target, nick)
                });
            }
        }
        return true;
    },

    irc_NOTICE: function(data) {
        var target = data.args[0],
            message = _.last(data.args),
        nick = data.nick,
            options = this.options;


        if (this.isNetworkService(data.host) || data.nick) {
            if(options.loginRegex.test(message)){
                this.onAuthenticated(data);
            }
            this.trigger("serverNotice", {
                "nick": nick,
                "message": message,
                "channel": constants.status
            });
        } else if (target === this.nickname) {
            var ctcp = this.processCTCP(message);
            if (ctcp) {
                this.trigger("ctcpReply", {
                    "nick": data.nick,
                    "host": data.host,
                    "ctcptype": ctcp[0],
                    "args": ctcp[1] || ""
                });
            } else {
                this.trigger("privNotice", {
                    "message": message,
                    "host": data.host,
                    "nick": nick,
                    "channel": nick
                });
            }
        } else {
            this.tracker.updateLastSpoke(nick);
            this.trigger("chanNotice", {
                "nick": nick,
                "channel": target,
                "message": message,
                "prefix": this.getNickStatus(target, nick)
            });
        }

        return true;
    },

    irc_INVITE: function(data) {
        var channel = _.last(data.args);
        var accept = this.getOption("accept_service_invites") && this.isNetworkService(data.host);

        if (accept) {
            this._joinInvited();
            this.inviteChanList.push(channel);
        }

        this.trigger("invite", {
            "channel": channel,
            "accept": accept,
            "nick": data.nick,
            "host": data.host
        });

        return true;
    },


    irc_ERR_NICKNAMEINUSE: function(data) {//add some number to the nick and resend
        if(!this.__signedOn) {
            var nick = data.args[1];
            var newnick = nick + Array.getRandom("_`-");

            data.args[data.args.length-1] = _.last(data.args) + " Retrying with nick: " + newnick;
            this.genericError(data);

            this.send(util.formatCommand("NICK", {nick: newnick}));
        }
        return true;
    },

    irc_ERROR: function(data) {
        var message = _.last(data.args);

        this.trigger("error", {
            message: message,
            type: "genericError"
        });

        return true;
    },

    irc_MODE: function(data) {//http://tools.ietf.org/html/rfc1459.html#section-4.2.3
        var self = this,
            target = data.args[0],
            args = data.args.slice(1);

        if (target == this.nickname) {
            this.trigger("userMode", {
                "modes": args,
                "message": args.join(""),
                "type": "UMODE",
                "n": this.nickname
            });
        } else {//target is channel
            var modes = args[0].split(""),
                nick = _.last(args),//note: not bothering for ban mask case 

                cmode = constants.op;

            modes.filter(function(mode) {
                var dir = (mode === constants.op) || (mode === constants.deop);
                if (dir) {
                    cmode = mode;
                }
                return !dir;
            }).each(function(mode) {
                var pmode = self.pmodes[mode],
                    _nick = pmode === irc.pmodes.LIST || pmode === irc.pmodes.SET_UNSET ? nick : null;

                var prefixindex = self.modeprefixes.indexOf(mode);
                if (prefixindex === -1) return;

                var nc = self.tracker.getOrCreateNickOnChannel(nick, target),
                    added = cmode === constants.op;

                var prefix = self.prefixes.charAt(self.modeprefixes.indexOf(mode));

                var prefixchar = added ? util.addPrefix(nc, prefix, self.prefixes) :
                                        util.removePrefix(nc, prefix);

                self.trigger("mode", {
                    "added": added,
                    "prefix": prefixchar,
                    "message": prefixchar,
                    "nick": _nick,
                    "channel": target,
                    "thisclient": _nick === self.nickname,
                    "nickchan": nc
                });
            });

            self.updateNickList(target);
        }

        return true;
    },

    irc_RPL_ISUPPORT: function(data) {
        var supported = data.args.slice(1, -1); //everything but nick and server msg
        var ms;

        if(supported.contains("CHANMODES") && supported.contains("PREFIX")) { //nasty hack - don"t understand purpose 
            this.pmodes = {}; //might invalidate things
        }

        supported.each(function(mode) {
            ms = util.splitMax(mode, "=", 2);
            this._supported(ms[0], ms[1]);
        }, this);
    },

    irc_RPL_NAMREPLY: function(data) {
        var channel = data.args[2],
            names = data.args[3];

        initChanUsers(this, channel, names.split(" "));

        return true;
    },

    irc_RPL_ENDOFNAMES: function(data) {
        var channel = data.args[1];

        initChanUsers(this, channel, []);
        return true;
    },

    irc_RPL_NOTOPIC: function(data) {
        var channel = data.args[1];

        if (this.inChannel(channel)) {
            initTopic(this, channel, "");
            return true;
        }
    },

    irc_RPL_TOPIC: function(data) {
        var channel = data.args[1],
            topic = _.last(data.args);

        if (this.inChannel(channel)) {
            initTopic(this, channel, topic);
            return true;
        }
    },

    irc_RPL_TOPICWHOTIME: Function.from(true),

    irc_RPL_WHOISUSER: function(data) {
        var nick = data.args[1];
        this._whoisNick = nick;

        return this._whois(nick, "user", {
            ident: data.args[2],
            hostname: data.args[3],
            realname: _.last(data.args)
        });
    },

    irc_RPL_WHOISSERVER: function(data) {
        var nick = data.args[1];

        return this._whois(nick, "server", {
            server: data.args[2],
            serverdesc: _.last(data.args)
        });
    },

    irc_RPL_WHOISOPERATOR: function(data) {
        var nick = data.args[1];

        return this._whois(nick, "oper", {
            opertext: _.last(data.args)
        });
    },

    irc_RPL_WHOISIDLE: function(data) {
        var nick = data.args[1];

        return this._whois(nick, "idle", {
            idle: data.args[2],
            connected: data.args[3]
        });
    },

    irc_RPL_WHOISCHANNELS: function(data) {
        var nick = data.args[1];

        return this._whois(nick, "channels", {
            channels: _.last(data.args)
        });
    },

    irc_RPL_WHOISACCOUNT: function(data) {
        var nick = data.args[1];

        return this._whois(nick, "account", {
            account: data.args[2]
        });
    },

    irc_RPL_WHOISACTUALLY: function(data) {
        var nick = data.args[1];

        return this._whois(nick, "actually", {
            hostmask: data.args[2],
            ip: data.args[3]
        });
    },

    irc_RPL_WHOISOPERNAME: function(data) {
        var nick = data.args[1];

        return this._whois(nick, "opername", {
            opername: data.args[2]
        });
    },

    irc_RPL_WHOISGENERICTEXT: function(data) {
        var nick = data.args[1],
            text = _.last(data.args);

        return this._whois(nick, "generictext", {
            text: text
        });
    },

    irc_RPL_WHOISWEBIRC: function(data) {
        var nick = data.args[1],
            text = _.last(data.args);

        return this._whois(nick, "generictext", {
            text: text
        });
    },

    irc_RPL_WHOISSECURE: function(data) {
        var nick = data.args[1];

        return this._whois(nick, "generictext", {
            text: _.last(data.args)
        });
    },

    irc_RPL_ENDOFWHOIS: function(data) {
        var nick = data.args[1];
        delete this._whoisNick;

        return this._whois(nick, "end", {});
    },

    irc_RPL_AWAY: function(data) {
        var nick = data.args[1],
            message = _.last(data.args);

        if (this._whoisNick == nick) {
            return this._whois(nick, "away", {
                "away": message
            });
        }
        this.trigger("away", {
            "nick": nick,
            "message": message
        });
        return true;
    },

    irc_RPL_NOWAWAY: function(data) {
        this.trigger("error", {
            state: true,
            message: _.last(data.args),
            type: "genericError"
        });
        return true;
    },

    irc_RPL_UNAWAY: function(data) {
        this.trigger("error", {
            state: false,
            message: _.last(data.args),
            type: "genericError"
        });
        return true;
    },

    irc_WALLOPS: function(data) {
        this.trigger("wallops", {
            message: data.message,
            nick: data.nick,
            host: data.host
        });
        return true;
    },

    irc_RPL_CREATIONTIME: function(data) {
        var channel = data.args[1],
            time = data.args[2];

        this.trigger("serverMessage", {
            channel: channel || ui.WINDOW.active,
            message: util.IRCDate(new Date(time * 1000)),
            type: "channelCreationTime"
        });
        return true;
    },

    irc_RPL_CHANNELMODEIS: function(data) {
        var channel = data.args[1],
            modes = data.args.slice(2);

        this.trigger("serverMessage", {
            channel: channel || ui.WINDOW.active,
            message: modes.join(" "),
            type: "channelModeIs"
        });
        return true;
    }

    // irc_RPL_LISTSTART: function() {
    //     this.listedChans = [];//should have a make list command in command utils
    //     return !this.hidelistout;
    // },

    // irc_RPL_LIST: function(data) {
    //     this.listedChans.push({
    //         channel: data.args[1],
    //         users: _.toInt(data.args[2]),
    //         topic: data.args[3]
    //     });
    //     return !this.hidelistout;
    // },

    // irc_RPL_LISTEND: function() {
    //     this.trigger("listend", this.listedChans);
    //     return !this.hidelistout;
    // }
});
