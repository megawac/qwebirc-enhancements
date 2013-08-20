// //ircclient with added event support
irc.IRCClient = new Class({
    Extends: irc.BaseIRCClient,
    Binds: ["quit", "writeMessages", "newTargetOrActiveLine"],
    options: {
        nickname: "qwebirc",
        autojoin: "",
        prefixes: "@+", //heirarchy of prefixes - "@"(operator), "+"(voice)
        minRejoinTime: [0]
    },
    initialize: function(options, ui) {
        var self = this;
        self.parent(options);

        self.ui = ui;

        self.prefixes = self.options.prefixes;
        self.modeprefixes = "ov";
        self.windows = {};

        self.commandparser = new irc.Commands(self);
        self.exec = self.commandparser.dispatch;

        self.statusWindow = self.ui.newClient(self);
        self.lastNicks = [];

        self.inviteChanList = [];
        self.activeTimers = {};

        self.loginRegex = new RegExp(self.ui.options.loginRegex);
        self.tracker = new irc.IRCTracker(self);

        self.writeMessages(lang.copyright);

        self.newWindow(BROUHAHA, qwebirc.ui.WINDOW_CHANNEL, false, false);
    },

    newLine: function(winID, type, data) {
        if (!data) data = {};

        var win = this.getWindow(winID);
        if (win) {
            win.addLine(type, data);
        } else {
            this.statusWindow.addLine(type, data);
        }
    },

    newChanLine: function(channel, type, user, extra) {
        if (!extra) extra = {};

        if ($defined(user)) {
            extra["h"] = util.hostToHost(user);
            extra['n'] = util.hostToNick(user);

            if ($defined(extra["f"]) && extra["f"].length > 0) {
                if (util.isChannel(extra["f"])) {
                    if (extra["f"] === BROUHAHA) {
                        extra['f'] = '';

                        if (!util.isChannel(channel)) {
                            extra['f'] = '>';
                        }
                        extra["f"] += irc.activeChannel; //hack active chan is on qwebirc.irc object
                    }
                    extra["n"] += extra["f"];
                } else {
                    if (extra['n'] == this.nickname) {
                        extra['n'] = this.nickname + '>' + extra['f'];
                    } else {
                        extra['n'] += '>' + extra['f'];
                    }
                }
            }
        }
        extra["c"] = channel;
        extra["-"] = this.nickname;

        if (!(this.ui.uiOptions2.get("nick_ov_status"))){
            delete extra["@"];
        }
        this.newLine(channel, type, extra);
    },

    newServerLine: function(type, data) {
        this.statusWindow.addLine(type, data);
    },

    newActiveLine: function(type, data) {
        this.getActiveWindow().addLine(type, data);
    },

    newTargetOrActiveLine: function(target, type, data) {
        if (this.getWindow(target)) {
            this.newLine(target, type, data);
        } else {
            this.newActiveLine(type, data);
        }
    },

    //you dont even want to know
    updateNickList: function(channel) {
        var nickHash = this.tracker.getChannel(channel); //of nickChanEntry

        var names2 = $defined(nickHash) ? _.keys(nickHash) : []; //just return?
        var comparitor = util.nickChanComparitor(this, nickHash),
            prefixer = util.nickPrefixer(nickHash);

        //sorts nicks by status > lexigraphy
        //then add the prefix in front of the name
        var sorted = names2.sort(comparitor).map(prefixer);

        var win = this.getWindow(channel);
        if (win) {
            win.updateNickList(sorted);
        }
    },

    // broadcast: function(user, channel, message, from, msgtype) {
    //     var nick = util.hostToNick(user);

    //     this.tracker.updateLastSpoke(nick, channel, Date.now());
    //     this.newChanLine(channel, msgtype, user, {
    //         "m": message,
    //         "@": this.getNickStatus(channel, nick),
    //         "f": from
    //     });
    // },

    getWindow: function(name) {
        return this.windows[this.toIRCLower(name)];
    },

    getActiveWindow: function() {
        return this.ui.getActiveIRCWindow(this);
    },

    newWindow: function(name, type, select, connected) {
        //select
        var win = this.getWindow(name);
        if (!win) {
            win = this.windows[this.toIRCLower(name)] = this.ui.newWindow(this, type, name);

            win.addEvent("close", function(win) {
                delete this.windows[this.toIRCLower(name)];
            }.bind(this));
        }

        if (select) {
            this.ui.selectWindow(win);
        }
        if(type === ui.WINDOW_CHANNEL) win.connected = connected || true;
        return win;
    },

    getQueryWindow: function(name) {
        return this.ui.getWindow(this, ui.WINDOW_QUERY, name);
    },

    newQueryWindow: function(name, privmsg) {
        return this.getQueryWindow(name) || this.newWindow(name, ui.WINDOW_QUERY, true);
    },

    newQueryLine: function(win, type, data, privmsg, active) {
        if (this.getQueryWindow(win))
            return this.newLine(win, type, data);

        if (e && win) {
            return win.addLine(type, data);
        } else {
            return active ? this.newActiveLine(type, data) :
                            this.newLine(win, type, data);
        }
    },

    newQueryOrActiveLine: function(win, type, data, privmsg) {
        this.newQueryLine(win, type, data, privmsg, true);
    },

    //writes messages from an array of lang.message items
    writeMessages: function(messages, args) {
        var client = this,
            win = client.getActiveWindow(),
            types = lang.TYPES;

        function write(message) {
            var msg = args ? util.formatter(message.message, args) :
                            message.message; //replaces values like {replaceme} if args has a key like that

            switch (message.type) {
            case types.SERVER:
            case types.MISC:
                return client.newServerLine("RAW", {'m': msg});
            case types.ERROR:
                return win.errorMessage(msg);
            case types.INFO:
                return win.infoMessage(msg);
            }
        }

        if(_.isArray(messages))
            messages.each(write);
        else
            write(messages);
    },

    /* from here down are events */
    rawNumeric: function(numeric, prefix, params) {
        this.newServerLine("RAW", {
            "n": "numeric",
            "m": params.slice(1).join(" ")
        });
    },

    signedOn: function(nickname) {
        var options = this.options,
            channels,
            hash = window.location.hash;

        this.tracker = new irc.IRCTracker(this); //this gets called twice......
        this.nickname = nickname;
        // this.newServerLine("SIGNON");
        this.writeMessages(lang.signOn);

        if (hash.length > 1) {
            options.autojoin = channels = hash.replace(/&/g, ',#');
            this.storeChannels(channels);
        } else {
            channels = this.getChannels();
            if (channels.length > 0) {
                options.autojoin = channels;
            } else { //if no stored channels join intial channels from interface options
                options.autojoin = channels = options.initialChannels;
                this.storeChannels(channels);
            }
        }
        // Sort the autojoin channels.
        channels = options.autojoin = util.prependChannel(channels, BROUHAHA);
        this.currentChannel = BROUHAHA;

        if (!auth.authed && auth.enabled) {
            this.attemptAuth();
        } else {
            this.exec("/AUTOJOIN");
        }

        this.trigger("logon", {
            'nickname': nickname,
            'channels': channels
        });
    },

    //probably a better way
    attemptAuth: function() {
        //only try to auth if its necessary
        if (!auth.authed && auth.enabled) {
            var test = this.send(util.formatter("AUTHSERV AUTH {account} {password}", this.options));

            // if the user is authed they will be set to +x... however as most users arent authed...
            //wait a hundreth of a second to see if the auth server authed you
            var win = this.ui.getActiveWindow();

            //this.writeMessages(lang.joinAfterAuth);
            this.writeMessages.delay(100, this, lang.joinAfterAuth);

            this.activeTimers.autojoin = (function() {
                if (!auth.authed) {
                    this.writeMessages(lang.authFailed);
                }
            }).delay(5000, this);
        }
    },

    authEvent: function() {
        auth.authed = true;
        this.exec("/UMODE +x");
        this.writeMessages(lang.joinChans);
        if (!auth.signedIn) {
            this.exec("/AUTOJOIN");
        }

        this.trigger("auth");
    },

    userJoined: function(user, channel) { //todo determine way to get brouhaha selected at start
        var nick = util.hostToNick(user),
            host = util.hostToHost(user),
            wasus = (nick === this.nickname),
            type = wasus ? "OURJOIN" : "JOIN",
            windowSelected = (channel === this.currentChannel || channel === BROUHAHA);

        if (wasus) {//create or select
            this.newWindow(channel, qwebirc.ui.WINDOW_CHANNEL, windowSelected);
        }


        this.tracker.addNickToChannel(nick, BROUHAHA);
        this.tracker.addNickToChannel(nick, channel);
        this.updateNickList(BROUHAHA);
        this.updateNickList(channel);

        // //dont display login message if join msgs disabled or window is brouhaha or something
        // if (!(self.uiOptions2.get("hide_joinparts") || isBaseWindow(channel))) {
        //     this.newChanLine(channel, type, user);
        // }

        if (wasus && channel === BROUHAHA) { //initial login. TODO there should be a better way to do this (maybe an option or something)
            this.writeMessages(lang.loginMessages);
        }

        this.trigger("userJoined", {
            'user': user,
            'nick': nick,
            'host': host,
            'channel': channel,
            'thisclient': wasus
        });
    },


    userPart: function(user, channel, message) {
        var nick = util.hostToNick(user),
            host = util.hostToHost(user),
            wasus = (nick === this.nickname);

        if (wasus) {
            this.tracker.removeChannel(channel);
            var win = this.getWindow(channel);
            if (win) {
                win.close();
            }
        } else {
            this.tracker.removeNickFromChannel(nick, BROUHAHA);
            this.tracker.removeNickFromChannel(nick, channel);
            this.updateNickList(BROUHAHA);
            this.updateNickList(channel);

            //hide disconnects in base windows or if option set
            // if (!(this.ui.uiOptions2.get("hide_joinparts") || isBaseWindow(channel))) {
            //     this.newChanLine(channel, "PART", user, {
            //         "m": message
            //     });
            // }
        }

        this.trigger("userPart", {
            'user': user,
            'nick': nick,
            'host': host,
            'channel': channel,
            'message': message,
            'thisclient': wasus,
            'type': 'part'
        });
    },


    userKicked: function(kicker, channel, kickee, message) {
        var wasus = kickee === this.nickname;
        if (wasus) {
            this.tracker.removeChannel(channel);
            this.getWindow(channel).close();
        } else {
            this.tracker.removeNickFromChannel(kickee, channel);
            this.updateNickList(channel);
        }

        this.newChanLine(channel, "KICK", kicker, {
            "v": kickee,
            "m": message
        });

        this.trigger("userKicked", {
            'kicker': kicker,
            'channel': channel,
            'kickee': kickee,
            'message': message,
            'thisclient': wasus,
            'type': "kick"
        });
    },

    userPrivmsg: function(user, message) {
        var nick = util.hostToNick(user),
            host = util.hostToHost(user);
        // this.newQueryWindow(nick, true);
        this.pushLastNick(nick);
        // this.newQueryLine(nick, "PRIVMSG", {
        //     "m": message,
        //     "h": host,
        //     "n": nick
        // }, true);

        this.trigger("query", {
            'user': user,
            'nick': nick,
            'host': host,
            'channel': nick,
            'message': message,
            'type': 'privmsg'
        });
    },

    userInvite: function(user, channel) {
        var nick = util.hostToNick(user),
            host = util.hostToHost(user),
            accept = this.ui.uiOptions2.get("accept_service_invites") && this.isNetworkService(user);

        // this.newServerLine("INVITE", {
        //     "c": channel,
        //     "h": host,
        //     "n": nick
        // });
        if (accept) {
            if (this.activeTimers.serviceInvite) {
                $clear(this.activeTimers.serviceInvite);
            }

            // we do this so we can batch the joins, i.e. instead of sending 5 JOIN comands we send 1 with 5 channels.
            this.activeTimers.serviceInvite = this.__joinInvited.delay(100, this);
            this.inviteChanList.push(channel);
        }

        this.trigger("userInvite", {
            'user': user,
            'channel': channel,
            'accept': accept,
            'nick': nick,
            'host': host
        });
    },

    userNotice: function(user, message) {
        var nick = util.hostToNick(user),
            host = util.hostToHost(user);

        if (this.ui.uiOptions2.get("dedicated_notice_window")) {
            this.newQueryWindow(nick, false);
            // this.newQueryOrActiveLine(nick, "PRIVNOTICE", {
            //     "m": message,
            //     "h": host,
            //     "n": nick
            // }, false);
        } /*else {
            this.newTargetOrActiveLine(nick, "PRIVNOTICE", {
                "m": message,
                "h": host,
                "n": nick
            });
        }*/

        this.trigger("privNotice", {
            'user': user,
            'message': message,
            'host': host,
            'nick': nick
        });
    },

    userQuit: function(user, message) {
        var self = this,
            nick = util.hostToNick(user),
            channels = self.tracker.getNick(nick);

        self.tracker.removeNick(nick);

        _.keys(channels).each(function(chan) {
            // if (!(self.ui.uiOptions2.get("hide_joinparts") || isBaseWindow(chan))) {
            //     self.newChanLine(chan, "QUIT", user, {
            //         "m": message
            //     });
            // }
            self.updateNickList(chan);
        });

        self.trigger("userQuit", {
            'user': user,
            'host': util.hostToHost(user),
            'nick': nick,
            'channels': channels,
            'message': message
        });
    },

    userMode: function(modes) {
        // this.newServerLine("UMODE", {
        //     "m": modes,
        //     "n": this.nickname
        // });

        this.trigger("userMode", {
            'modes': modes,
            'message': modes.join(""),
            'type': "UMODE",
            'n': this.nickname
        });
    },

    nickChanged: function(user, newnick, wasus) {
        var self = this,
            oldnick = util.hostToNick(user);

        if (wasus) {
            self.nickname = newnick;
            storage.set('nickname', newnick);
        }

        self.tracker.renameNick(oldnick, newnick);

        var channels = self.tracker.getNick(newnick);
        var found = _.size(channels) > 0;

        _.each(channels, function(obj, chan) {
            // self.newChanLine(chan, "NICK", user, {
            //     "w": newnick
            // });
            // TODO: rename queries
            self.updateNickList(chan);
        });

        // if (!found) {
        //     self.newServerLine("NICK", {
        //         "w": newnick,
        //         n: util.hostToNick(user),
        //         h: util.hostToHost(user),
        //         "-": self.nickname
        //     });
        // }

        self.trigger("nickChange", {
            'user': user,
            'nick': util.hostToNick(user),
            'newnick': newnick,
            'w': newnick,
            'channels': channels,
            'thisclient': wasus,
            'type': 'nick'
        });
    },

    initialTopic: function(channel, topic) {
        this.trigger("chanTopic", {
            'channel': channel,
            'topic': topic,
            'initial': true
        });
    },

    channelTopic: function(user, channel, topic) {
        // this.newChanLine(channel, "TOPIC", user, {
        //     "m": topic
        // });

        this.trigger("chanTopic", {
            'user': user,
            'nick': util.hostToNick(user),
            'channel': channel,
            'topic': topic
        });
    },

    channelPrivmsg: function(user, channel, message) {
        var self = this,
            nick = util.hostToNick(user);

        self.tracker.updateLastSpoke(nick, channel, Date.now());
        // self.newChanLine(channel, "CHANMSG", user, {
        //     "m": message,
        //     "@": self.getNickStatus(channel, nick)
        // });

        self.trigger("chanMessage", {
            'user': user,
            'nick': nick,
            'channel': channel,
            'message': message,
            'type': 'chanmsg',
            "@": self.getNickStatus(channel, nick)
        });
    },

    channelNotice: function(user, channel, message) {
        // this.newChanLine(channel, "CHANNOTICE", user, {
        //     "m": message,
        //     "@": this.getNickStatus(channel, util.hostToNick(user))
        // });
        var nick = util.hostToNick(user)
        this.trigger("chanNotice", {
            'user': user,
            'nick': nick,
            'channel': channel,
            'message': message,
            "@": this.getNickStatus(channel, nick)
        });
    },

    channelMode: function(user, channel, modes, raw) {
        var self = this;
        modes.each(function(mo) {
                var direction = mo[0],
                mode = mo[1];

            var prefixindex = self.modeprefixes.indexOf(mode);
            if (prefixindex === -1) return;

            var nick = mo[2],
                prefixchar = self.prefixes.charAt(prefixindex),

                nc = self.tracker.getOrCreateNickOnChannel(nick, channel),
                oped = direction === OPED;

            prefixchar = oped ? util.addPrefix(nc, prefixchar, self.prefixes) :
                                util.removePrefix(nc, prefixchar);

            self.trigger("mode", {
                "added": oped,
                "prefix": prefixchar,
                "message": prefixchar,
                "nick": nick,
                "channel": channel,
                "thisclient": nick === self.nickname,
                "nickchan": nc
            });
        });

        // self.newChanLine(channel, "MODE", user, {
        //     "m": raw.join(" ")
        // });

        self.updateNickList(channel);
    },

    channelCTCP: function(user, channel, type, args) {
        if (!args) {
            args = "";
        }

        var nick = util.hostToNick(user);
        if (type == "ACTION") {
            this.tracker.updateLastSpoke(nick, channel, Date.now());
            // this.newChanLine(channel, "CHANACTION", user, {
            //     "m": args,
            //     "c": channel,
            //     "@": this.getNickStatus(channel, nick)
            // });
            this.trigger("chanAction", {
                'user': user,
                'nick': nick,
                'channel': channel,
                'message': args,
                "@": this.getNickStatus(channel, nick)
            });
        }
        else {
            // this.newChanLine(channel, "CHANCTCP", user, {
            //     "x": type,
            //     "m": args,
            //     "c": channel,
            //     "@": this.getNickStatus(channel, nick)
            // });

            this.trigger("chanCTCP", {
                'user': user,
                'message': args,
                'channel': channel,
                'x': type,
                'args': args,
                "@": this.getNickStatus(channel, nick)
            });
        }

    },

    userCTCP: function(user, type, args) {
        var nick = util.hostToNick(user),
            host = util.hostToHost(user);

        if (!args) {
            args = "";
        }

        if (type == "ACTION") {
            this.newQueryWindow(nick, true);
            // this.newQueryLine(nick, "PRIVACTION", {
            //     "m": args,
            //     "x": type,
            //     "h": host,
            //     "n": nick
            // }, true);

            this.trigger("userAction", {
                'nick': nick,
                'host': host,
                'message': args,
                'x': type,
                'user': user
            });
        }
        else {
            // this.newTargetOrActiveLine(nick, "PRIVCTCP", {
            //     "m": args,
            //     "x": type,
            //     "h": host,
            //     "n": nick,
            //     "-": this.nickname
            // });

            this.trigger("privCTCP", {
                'user': user,
                'nick': nick,
                'type': type,
                'args': args,
                'x': type,
                'host': host
            });
        }

    },

    userCTCPReply: function(user, type, args) {
        var nick = util.hostToNick(user),
            host = util.hostToHost(user);

        if (!args) {
            args = "";
        }

        // this.newTargetOrActiveLine(nick, "CTCPREPLY", {
        //     "m": args,
        //     "x": type,
        //     "h": host,
        //     "n": nick,
        //     "-": this.nickname
        // });

        this.trigger("userCTCPReply", {
            'user': user,
            'nick': nick,
            'host': host,
            'type': type,
            'args': args
        });
    },

    serverNotice: function(user, message) {
        // if (!user) {
        //     this.newServerLine("SERVERNOTICE", {
        //         "m": message
        //     });
        // } else {
        //     this.newServerLine("PRIVNOTICE", {
        //         "m": message,
        //         "n": user
        //     });
        // }
        this.trigger("serverNotice", {
            'user': user,
            'message': message
        });
    },


    getNickStatus: function(channel, nick) {
        var nickchan = this.tracker.getNickOnChannel(nick, channel);
        if (!$defined(nickchan) || nickchan.prefixes.length === 0)
            return "";

        return nickchan.prefixes.charAt(0);
    },

    storeChannels: function(channels) {
        var store = _.uniq(channels);
        this.channels = channels;
        storage.set("channels", store);
    },

    getChannels: function() {
        var chans = this.channels = storage.get("channels") || [];
        // this.channels = chans ? chans.split(",") : [];
        return chans;
    },

    canJoinChannel: function(chan) {
        //check if already on channel
        var old = this.getWindow(chan);
        if(old && old.connected)
            return false;
        else if(chan === BROUHAHA)
            return true;

        var chansets = session.get(chan) || [], //oldest -> newest
            currTime = Date.now(),
            rejoinT = this.options.minRejoinTime,
            minTime = Math.max.apply(null, rejoinT.slice(0, chansets.length)) * 1000;//max min applicable time
        chan = util.formatChannel(chan);

        var broken = chansets.filter(function(time) {
            return currTime - time <= minTime;
        });

        if(broken.length === 0) {
            chansets.push(currTime);
            var n = (chansets.length - rejoinT.length).limit(0, chansets.length);
            session.set(chan, chansets.slice(n));
        } else {
            var maxTime = Math.max.apply(null, chansets.map(function(time, i) {
                return ((minTime - (currTime - time))/1000).round(1); //to secs/10
            }));
            this.writeMessages(lang.waitToJoin, {channel: chan, time: maxTime});
        }

        return broken.length === 0;
    },


    isNetworkService: function(x) {
        return this.options.networkServices.contains(x);
    },

    __joinInvited: function() {
        this.exec("/JOIN " + this.inviteChanList.join(","));
        this.inviteChanList = [];
        delete this.activeTimers["serviceInvite"];
    },

    channelNames: function(channel, names) {
        if (names.length === 0) { //occurs on channel join
            this.updateNickList(channel);
            return;
        }
        var getPrefixes = util.prefixOnNick(this.prefixes);
        names.each(function(prenick) {
            var prefixNick = getPrefixes(prenick),
                prefixes = prefixNick[0],
                nick = prefixNick[1];

            if (channel !== BROUHAHA) {
                this.tracker.addNickToChannel(nick, BROUHAHA);
            }
            var nc = this.tracker.addNickToChannel(nick, channel);


            Array.each(prefixes, function(p) {
                util.addPrefix(nc, p, this.prefixes);
            }, this);
        }, this);
    },

    disconnected: function(message) {
        _.each(this.windows, function(win) {
            if (util.isChannelType(win.type))
                win.close();
        });
        // for (var wid in this.windows) {
        //     var win = this.windows[wid];
        //     if (util.isChannelType(win.type))
        //         win.close();
        // }
        delete this.tracker;

        // this.newServerLine("DISCONNECT", {
        //     "m": message
        // });
        this.trigger("disconnect", {
            message: message
        })
    },

    nickOnChanHasPrefix: function(nick, channel, prefix) {
        var entry = this.tracker.getNickOnChannel(nick, channel);
        if (!$defined(entry)) return false; /* shouldn't happen */

        return (entry.prefixes).contains(prefix);
    },

    nickOnChanHasAtLeastPrefix: function(nick, channel, prefix) {
        var entry = this.tracker.getNickOnChannel(nick, channel);
        if (!$defined(entry))
            return false; /* shouldn't happen */

        /* this array is sorted */
        var pos = this.prefixes.indexOf(prefix);
        if (pos === -1)
            return false; /* shouldn't happen */

        var prefixes = this.prefixes.slice(0, pos + 1);

        //true if any of entry.prefix is part of prefixes string
        return Array.some(entry.prefixes, function(prefix) {
            return util.validPrefix(prefixes, prefix);
        });

        // return false;
    },

    //needs an update
    supported: function(key, value) {
        if (key == "PREFIX") {
            var len = (value.length - 2) / 2;

            //get rid of these they are confusing
            this.modeprefixes = value.substr(1, len);
            this.prefixes = value.substr(len + 2, len);
        }

        this.parent(key, value);
    },

    connected: function() {
        // this.newServerLine("CONNECT");
        this.trigger("connect", {});
    },

    serverError: function(message) {
        // this.newServerLine("ERROR", {
        //     "m": message
        // });
        this.trigger("error", {message:message})
    },

    quit: function(message) {
        this.send("QUIT :" + (message || lang.quit.message), true);
        this.disconnect();
        this.trigger("quit", {message: message});
    },

    disconnect: function() {
        // for (var k in this.activeTimers) {
        //     this.activeTimers[k].cancel();
        // }
        _.each(this.activeTimers, $clear);
        this.activeTimers = {};
        this.writeMessages(lang.disconnected);
        this.trigger("disconnect", {message: lang.disconnected});

        this.parent();
    },

    awayMessage: function(nick, message) {
        this.newQueryLine(nick, "AWAY", {
            "n": nick,
            "m": message
        }, true);
    },

    whois: function(nick, type, data) {
        var ndata = {
            "n": nick,
            channel: ACTIVE,
            msgs: []
        };
        var mtype = type.toUpperCase();
        var msgs = ndata.msgs;

        switch(type.toLowerCase()) {
            case "user":
                msgs.push({
                    type: "WHOISUSER",
                    h: data.ident + "@" + data.hostname
                })

                msgs.push({
                    type: "WHOISREALNAME",
                    m: data.realname
                })
            break;
            case "server":
                msgs.push({
                    x: data.server,
                    message: data.serverdesc,
                    type: "WHOISSERVER"
                })
            break;
            case "channels":
                msgs.push({
                    message: data.channels,
                    type: "WHOISCHANNELS"
                })
            break;
            case "account":
                msgs.push({
                    message: data.account,
                    type: "WHOISACCOUNT"
                })
            break;
            case "away":
                msgs.push({
                    message: data.away,
                    type: "WHOISAWAY"
                })
            break;
            case "opername":
                msgs.push({
                    message: data.opername,
                    type: "WHOISOPERNAME"
                })
            break;
            case "actually":
                msgs.push({
                    message: data.hostname,
                    x: data.ip,
                    type: "WHOISACTUALLY"
                })
            break;
            case "generictext":
                msgs.push({
                    message: data.text,
                    type: "WHOISGENERICTEXT"
                })
            break;
            default:
                return false;
        }

        this.trigger("whois", ndata);
        return true;
    },

    genericError: function(target, message) {
        // this.newTargetOrActiveLine(target, "GENERICERROR", {
        //     m: message,
        //     t: target
        // });
        this.trigger("error", {
            target: target,
            channel: target,
            message: message,
            type: "GENERICERROR"
        })
    },

    genericQueryError: function(target, message) {
        // this.newQueryOrActiveLine(target, "GENERICERROR", {
        //     m: message,
        //     t: target
        // }, true);
        // this.trigger("genericError", {
        //     target: target,
        //     message: message
        // })
        this.trigger("error", {
            target: target,
            channel: target,
            message: message,
            type: "GENERICERROR"
        })
    },

    awayStatus: function(state, message) {
        // this.newActiveLine("GENERICMESSAGE", {
        //     m: message
        // });
        this.trigger("error", {
            state: state,
            message: message,
            type: "GENERICERROR"
        })
    },

    pushLastNick: function(nick) {
        var i = this.lastNicks.indexOf(nick);
        if (i != -1) {
            this.lastNicks.splice(i, 1);
        } /*else if (this.lastNicks.length == this.options.maxnicks) {
            this.lastNicks.pop();
        }*/
        this.lastNicks.unshift(nick);
    },

    wallops: function(user, text) {
        var nick = util.hostToNick(user);
        var host = util.hostToHost(user);

        // this.newServerLine("WALLOPS", {
        //     t: text,
        //     n: nick,
        //     h: host
        // });
        this.trigger("wallops", {
            message: text,
            nick: nick,
            host: host
        });
    },

    channelModeIs: function(channel, modes) {
        // this.newTargetOrActiveLine(channel, "CHANNELMODEIS", {
        //     c: channel,
        //     m: modes.join(" ")
        // });
        this.trigger("serverMessage", {
            channel: channel || ACTIVE,
            message: modes.join(" "),
            type: "CHANNELMODEIS"
        });
    },

    channelCreationTime: function(channel, time) {
        // this.newTargetOrActiveLine(channel, "CHANNELCREATIONTIME", {
        //     c: channel,
        //     m: util.IRCDate(new Date(time * 1000))
        // });
        this.trigger("serverMessage", {
            channel: channel || ACTIVE,
            message: util.IRCDate(new Date(time * 1000)),
            type: "CHANNELCREATIONTIME"
        });
    },

    getPopularChannels: function(cb, minUsers) {
        this.hidelistout = true;
        this.exec('/list >' + (minUsers || 75)); //request chans with more than 75 users
        this.addEvent("listend:once", function() {
            var chans = _.chain(this.listedChans)
                        .clone()
                        .sortBy(function(chan) {return -chan.users})//neg to sort max -> min
                        .value();
            cb(chans);
            this.hidelistout = false;
        })
    }
});
