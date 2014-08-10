/**
  * ircclient new and improved
  *
  * @depends [irc/Client]
  * @depends [util/utils]
  * @provides [irc/ReplyHandlers]
  */
function partHandler(client, nick, chan) {
    var wasus = nick === client.nickname;
    if(wasus && client.inChannel(chan)) {
        client.channels.erase(chan);
    }
    return wasus;
}

function replyCTCP(client, data, ctcp) {
    var replyfn = irc.RegisteredCTCPs[ctcp[0]];
    var t = _.now() / 1000; //prevent flood
    if (replyfn && t > client.nextctcp) {
        client.send(util.formatCommand("CTCP", {
            target: data.nick,
            type: ctcp[0],
            text: replyfn(ctcp[1])
        }));
        client.nextctcp = t + 2;
    }
}

irc.Client.implement({
    nextctcp: 0,
    /*********************************************************************
    *                                                                    *
    *                Implements the IRC HANDLERS                         *
    *                                                                    *
    **********************************************************************/
    irc_PING: function(data) {
        this.send("PONG :" + _.last(data.args));
        return true;
    },

    irc_NICK: function(data) {
        var self = this;
        var newnick = data.args[0];
        var oldnick = data.nick;
        var wasus = this.nickname === oldnick;
        var channels = self.tracker.getNick(oldnick); //null/array

        if (wasus) {
            self.nickname = newnick;
            self.options.settings.set("nickname", newnick);
        }

        self.tracker.renameNick(oldnick, newnick);

        // _.each(channels, function(obj, chan) {
        //     self.updateNickList(chan);
        // });
        _.keys(channels).each(self.updateNickList, self);

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

        if (wasus) {
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
        var self = this;
        var message = _.last(data.args);
        var nick = data.nick;
        var channels = self.tracker.getNick(nick);

        self.tracker.removeNick(nick);
        // _.each(channels, function(nick, chan) {
        //     self.updateNickList(chan);
        // });
        _.keys(channels).each(self.updateNickList, self);

        self.trigger("quit", {
            "host": data.host,
            "nick": nick,
            "channels": channels,
            "message": message
        });

        return true;
    },

    irc_PART: function(data) {
        var channel = data.args[0];
        var message = data.args[1];
        var nick = data.nick;

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
        var kicker = data.prefix;
        var channel = data.args[0];
        var kickee = data.args[1];
        var message = data.args[2];

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
        var channel = data.args[0];
        var topic = _.last(data.args);

        this.trigger("chanTopic", {
            "nick": data.nick,
            "channel": channel,
            "topic": topic
        });

        return true;
    },

    //todo buffer messages
    irc_PRIVMSG: function(data) {
        var nick = data.nick;
        var target = data.args[0];
        var message = _.last(data.args);

        var ctcp = util.processCTCP(message);
        if (ctcp) {
            //http://www.irchelp.org/irchelp/rfc/ctcpspec.html
            var type = ctcp[0];
            replyCTCP(this, data, ctcp);

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
        var target = data.args[0];
        var message = _.last(data.args);
        var nick = data.nick;
        var options = this.options;


        if (this.isNetworkService(data.host)) {
            if (options.loginRegex.test(message)) {
                this.onAuthenticated(data);
            }
            this.trigger("serverNotice", {
                "nick": nick,
                "message": message,
                "channel": _.find(this.channels, _.partial(String.contains, message, _, null)) || constants.active
            });
        } else if (target === this.nickname) {
            var ctcp = util.processCTCP(message);
            if (ctcp) {
                replyCTCP(this, data, ctcp);
                this.trigger("ctcpReply", {
                    "nick": nick,
                    "host": data.host,
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

    //http://tools.ietf.org/html/rfc1459.html#section-4.2.3
    irc_MODE: function(data) {
        var self = this;
        var target = data.args[0];
        var args = data.args.slice(1);

        if (target == this.nickname) {
            this.trigger("userMode", {
                "modes": args,
                "message": args.join(""),
                "type": "UMODE",
                "n": this.nickname
            });
        } else { //target is channel
            var modes = args[0].split("");
            var nick = _.last(args); //note: not bothering for ban mask case
            var cmode = constants.op;

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

    irc_WALLOPS: function(data) {
        this.trigger("wallops", {
            message: data.message,
            nick: data.nick,
            host: data.host
        });
        return true;
    }

});
