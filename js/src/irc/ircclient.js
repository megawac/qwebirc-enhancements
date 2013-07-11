// //ircclient with added event support
irc.IRCClient = new Class({
    Extends: irc.BaseIRCClient,
    Binds: ["writeMessages", "newTargetOrActiveLine"],
    options: {
        nickname: "qwebirc",
        autojoin: "",
        maxnicks: 10,
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

                        var chanName = $('channel-name-id').innerHTML;
                        if (!util.isChannel(chanName)) {
                            extra['f'] = '>';
                        }
                        extra["f"] = extra['f'] + irc.activeChannel; //hack active chan is on qwebirc.irc object
                    }
                    extra["n"] = util.hostToNick(user) + extra["f"];
                } else {
                    if (util.hostToNick(user) == this.nickname) {
                        extra['n'] = this.nickname + '>' + extra['f'];
                    } else {
                        extra['n'] = util.hostToNick(user) + '>' + extra['f'];
                    }
                }
            }
        }
        extra["c"] = channel;
        extra["-"] = this.nickname;

        if (!(this.ui.uiOptions.NICK_OV_STATUS))
            delete extra["@"];

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

        var names2 = $defined(nickHash) ? Object.keys(nickHash) : []; //just return?
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

    getWindow: function(name) {
        return this.windows[this.toIRCLower(name)];
    },

    newWindow: function(name, type, select) {
        //select
        var win = this.getWindow(name);
        if (!win) {
            win = this.windows[this.toIRCLower(name)] = this.ui.newWindow(this, type, name);
            if (util.isChannel(name))
                document.getElementById('channel-name-id').innerHTML = name;

            win.addEvent("close", function(win) {
                delete this.windows[this.toIRCLower(name)];
            }.bind(this));
        }

        if (select) {
            this.ui.selectWindow(win);
        }
        return win;
    },

    getQueryWindow: function(name) {
        return this.ui.getWindow(this, qwebirc.ui.WINDOW_QUERY, name);
    },

    newQueryWindow: function(name, privmsg) {
        if (!this.getQueryWindow(name))
            return privmsg ? this.newPrivmsgQueryWindow(name) : this.newNoticeQueryWindow(name);
    },

    newPrivmsgQueryWindow: function(name) {
        if (this.ui.uiOptions.DEDICATED_MSG_WINDOW) {
            if (!this.ui.getWindow(this, qwebirc.ui.WINDOW_MESSAGES)) return this.ui.newWindow(this, qwebirc.ui.WINDOW_MESSAGES, "Messages");
        } else {
            return this.newWindow(name, qwebirc.ui.WINDOW_QUERY, false);
        }
    },

    newNoticeQueryWindow: function(name) {
        if (this.ui.uiOptions.DEDICATED_NOTICE_WINDOW)
            if (!this.ui.getWindow(this, qwebirc.ui.WINDOW_MESSAGES))
                return this.ui.newWindow(this, qwebirc.ui.WINDOW_MESSAGES, "Messages");
    },

    newQueryLine: function(win, type, data, privmsg, active) {
        if (this.getQueryWindow(win))
            return this.newLine(win, type, data);

        var win = this.ui.getWindow(this, qwebirc.ui.WINDOW_MESSAGES);

        var e;
        if (privmsg) {
            e = this.ui.uiOptions.DEDICATED_MSG_WINDOW;
        } else {
            e = this.ui.uiOptions.DEDICATED_NOTICE_WINDOW;
        }
        if (e && win) {
            return win.addLine(type, data);
        } else {
            if (active) {
                return this.newActiveLine(type, data);
            } else {
                return this.newLine(win, type, data);
            }
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

        $A(messages).each(function(message) {
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
        });
    },

    getActiveWindow: function() {
        return this.ui.getActiveIRCWindow(this);
    },

    getNickname: function() {
        return this.nickname;
    },

    // addPrefix: function(nickchanentry, prefix) {
        // var ncp = nickchanentry.prefixes + prefix;
        // var prefixes = [];
        // /* O(n^2) */
        // for (var i = 0; i < this.prefixes.length; i++) {
        //     var pc = this.prefixes.charAt(i);
        //     var index = ncp.indexOf(pc);
        //     if (index != -1) {
        //         prefixes.push(pc);
        //     }
        // }
        // nickchanentry.prefixes = prefixes.join("");
    //     nickchanentry.prefixes = util.validPrefix(this.prefixes, prefix) ? util.addPrefix(nickchanentry.prefixes, prefix) : "";
    // },

    //moved to util
    // stripPrefix: function(nick) {
    //     var l = nick.charAt(0);
    //     if (!l) {
    //         return nick;
    //     }

    //     if (this.prefixes.indexOf(l) != -1) {
    //         return nick.substring(1);
    //     }    
    //     return nick;
    // },

    // removePrefix: function(nickchanentry, prefix) {
    //     nickchanentry.prefixes = nickchanentry.prefixes.replaceAll(prefix, "");
    // },

    /* from here down are events */
    rawNumeric: function(numeric, prefix, params) {
        this.newServerLine("RAW", {
            "n": "numeric",
            "m": params.slice(1).join(" ") //go fuck yourself
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

        this.fireEvent("logon", {
            'nickname': nickname,
            'channels': channels
        });
    },

    //probably a better way
    attemptAuth: function() {
        //only try to auth if its necessary
        if (!auth.authed && auth.enabled) {
            var test = this.send("authserv AUTH " + this.options.gamesurge + " " + this.options.password);

            // if the user is authed they will be set to +x... however as most users arent authed...
            //wait a hundreth of a second to see if the auth server authed you
            var win = this.ui.getActiveWindow();
            // (function() {
            //     win.infoMessage("Waiting for login before joining channels...");
            // }).delay(200);

            var writer = this.writeMessages;
            //this.writeMessages(lang.joinAfterAuth);
            writer.curry(lang.joinAfterAuth).delay(100);

            this.activeTimers.autojoin = (function() {
                if (!auth.authed) {
                    writer(lang.authFailed);
                }
            }).delay(5000);
        }
    },

    authEvent: function() {
        auth.authed = true;
        this.exec("/UMODE +x");
        this.writeMessages(lang.joinChans);
        if (!auth.signedIn) {
            this.exec("/AUTOJOIN");
        }

        this.fireEvent("auth", {

        });
    },

    userJoined: function(user, channel) { //todo determine way to get brouhaha selected at start
        var nick = util.hostToNick(user),
            host = util.hostToHost(user),
            wasus = (nick === this.nickname),
            type = wasus ? "OURJOIN" : "JOIN",
            windowSelected = (channel === this.currentChannel);

        if (wasus && !this.getWindow(channel)) {
            this.newWindow(channel, qwebirc.ui.WINDOW_CHANNEL, windowSelected); //true means channel is selected
        }


        this.tracker.addNickToChannel(nick, BROUHAHA);
        this.tracker.addNickToChannel(nick, channel);
        this.updateNickList(BROUHAHA);
        this.updateNickList(channel);

        //dont display login message if join msgs disabled or window is brouhaha or something
        if (!(this.ui.uiOptions.HIDE_JOINPARTS || isBaseWindow(channel))) {
            this.newChanLine(channel, type, user);
        }

        if (wasus && channel === BROUHAHA) { //initial login. TODO there should be a better way to do this (maybe an option or something)
            this.writeMessages(lang.loginMessages);
        }

        this.fireEvent("userJoined", {
            'user': user,
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
            if (!(this.ui.uiOptions.HIDE_JOINPARTS || isBaseWindow(channel))) {
                this.newChanLine(channel, "PART", user, {
                    "m": message
                });
            }
        }

        this.fireEvent("userPart", {
            'user': user,
            'channel': channel,
            'message': message,
            'thisclient': wasus
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

        this.fireEvent("userKicked", {
            'kicker': kicker,
            'channel': channel,
            'kickee': kickee,
            'message': message,
            'thisclient': wasus
        });
    },

    userPrivmsg: function(user, message) {
        var nick = util.hostToNick(user),
            host = util.hostToHost(user);
        this.newQueryWindow(nick, true);
        this.pushLastNick(nick);
        this.newQueryLine(nick, "PRIVMSG", {
            "m": message,
            "h": host,
            "n": nick
        }, true);

        this.fireEvent("userPrivmsg", {
            'user': user,
            'message': message
        });
    },

    userInvite: function(user, channel) {
        var nick = util.hostToNick(user),
            host = util.hostToHost(user),
            accept = this.ui.uiOptions.ACCEPT_SERVICE_INVITES && this.isNetworkService(user);

        this.newServerLine("INVITE", {
            "c": channel,
            "h": host,
            "n": nick
        });
        if (accept) {
            if (this.activeTimers.serviceInvite) {
                $clear(this.activeTimers.serviceInvite);
            }

            // we do this so we can batch the joins, i.e. instead of sending 5 JOIN comands we send 1 with 5 channels.
            this.activeTimers.serviceInvite = this.__joinInvited.delay(100, this);
            this.inviteChanList.push(channel);
        }

        this.fireEvent("userInvite", {
            'user': user,
            'channel': channel,
            'accept': accept
        });
    },

    userNotice: function(user, message) {
        var nick = util.hostToNick(user),
            host = util.hostToHost(user);

        if (this.ui.uiOptions.DEDICATED_NOTICE_WINDOW) {
            this.newQueryWindow(nick, false);
            this.newQueryOrActiveLine(nick, "PRIVNOTICE", {
                "m": message,
                "h": host,
                "n": nick
            }, false);
        } else {
            this.newTargetOrActiveLine(nick, "PRIVNOTICE", {
                "m": message,
                "h": host,
                "n": nick
            });
        }

        this.fireEvent("channelTopic", {
            'user': user,
            'message': message
        });
    },

    userQuit: function(user, message) {
        var self = this,
            nick = util.hostToNick(user),
            channels = self.tracker.getNick(nick);

        self.tracker.removeNick(nick);

        Object.keys(channels).each(function(chan) {
            if (!(self.ui.uiOptions.HIDE_JOINPARTS || isBaseWindow(chan))) {
                self.newChanLine(chan, "QUIT", user, {
                    "m": message
                });
            }
            self.updateNickList(chan);
        });

        self.fireEvent("userQuit", {
            'user': user,
            'channels': channels,
            'message': message
        });
    },

    userMode: function(modes) {
        this.newServerLine("UMODE", {
            "m": modes,
            "n": this.nickname
        });

        this.fireEvent("userMode", {
            'modes': modes
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
        var found = Object.getLength(channels) > 0;

        // for (var chan in channels) {
        //     found = true;

        //     self.newChanLine(chan, "NICK", user, {
        //         "w": newnick
        //     });
        //     // TODO: rename queries
        //     self.updateNickList(chan);
        // }
        Object.each(channels, function(obj, chan) {
            self.newChanLine(chan, "NICK", user, {
                "w": newnick
            });
            // TODO: rename queries
            self.updateNickList(chan);
        });

        if (!found) {
            self.newServerLine("NICK", {
                "w": newnick,
                n: util.hostToNick(user),
                h: util.hostToHost(user),
                "-": self.nickname
            });
        }

        self.fireEvent("nickChange", {
            'user': user,
            'newnick': newnick,
            'channels': channels,
            'thisclient': wasus,
            'client': self
        });
    },

    initialTopic: function(channel, topic) {
        this.getWindow(channel).updateTopic(topic);

        this.fireEvent("channelTopic", {
            'channel': channel,
            'topic': topic
        });
    },

    channelTopic: function(user, channel, topic) {
        this.newChanLine(channel, "TOPIC", user, {
            "m": topic
        });
        this.getWindow(channel).updateTopic(topic);

        this.fireEvent("channelTopic", {
            'user': user,
            'channel': channel,
            'topic': topic
        });
    },

    channelPrivmsg: function(user, channel, message) {
        var self = this,
            nick = util.hostToNick(user);

        self.tracker.updateLastSpoke(nick, channel, Date.now());
        self.newChanLine(channel, "CHANMSG", user, {
            "m": message,
            "@": self.getNickStatus(channel, nick)
        });

        self.fireEvent("channelMessage", {
            'user': user,
            'channel': channel,
            'message': message
        });
    },

    channelNotice: function(user, channel, message) {
        this.newChanLine(channel, "CHANNOTICE", user, {
            "m": message,
            "@": this.getNickStatus(channel, util.hostToNick(user))
        });

        this.fireEvent("channelNotice", {
            'user': user,
            'channel': channel,
            'type': type
        });
    },

    channelMode: function(user, channel, modes, raw) {
        modes.each(function(mo) {
            var self = this,
                direction = mo[0],
                mode = mo[1];

            var prefixindex = self.modeprefixes.indexOf(mode);
            if (prefixindex === -1) return;

            var nick = mo[2],
                prefixchar = self.prefixes.charAt(prefixindex),

                nc = self.tracker.getOrCreateNickOnChannel(nick, channel),
                oped = direction === OPED;

            if (oped) {
                util.addPrefix(nc, prefixchar, self.prefixes);
            } else {
                util.removePrefix(nc, prefixchar);
            }

            this.fireEvent("mode", {
                "added": oped,
                "prefix": prefixchar,
                "nick": nick,
                "thisclient": nick === this.nickname,
                "nickchan": nc
            });
        }, this);

        this.newChanLine(channel, "MODE", user, {
            "m": raw.join(" ")
        });

        this.updateNickList(channel);
    },

    channelCTCP: function(user, channel, type, args) {
        if (!args) {
            args = "";
        }

        var nick = util.hostToNick(user);
        if (type == "ACTION") {
            this.tracker.updateLastSpoke(nick, channel, Date.now());
            this.newChanLine(channel, "CHANACTION", user, {
                "m": args,
                "c": channel,
                "@": this.getNickStatus(channel, nick)
            });
            return;
        }

        this.newChanLine(channel, "CHANCTCP", user, {
            "x": type,
            "m": args,
            "c": channel,
            "@": this.getNickStatus(channel, nick)
        });

        this.fireEvent("channelCTCP", {
            'user': user,
            'channel': channel,
            'type': type,
            'args': args
        });
    },

    userCTCP: function(user, type, args) {
        var nick = util.hostToNick(user),
            host = util.hostToHost(user);

        if (!args) {
            args = "";
        }

        if (type == "ACTION") {
            this.newQueryWindow(nick, true);
            this.newQueryLine(nick, "PRIVACTION", {
                "m": args,
                "x": type,
                "h": host,
                "n": nick
            }, true);
            return;
        }

        this.newTargetOrActiveLine(nick, "PRIVCTCP", {
            "m": args,
            "x": type,
            "h": host,
            "n": nick,
            "-": this.nickname
        });

        this.fireEvent("userCTCP", {
            'user': user,
            'type': type,
            'args': args
        });
    },

    userCTCPReply: function(user, type, args) {
        var nick = util.hostToNick(user),
            host = util.hostToHost(user);

        if (!args) {
            args = "";
        }

        this.newTargetOrActiveLine(nick, "CTCPREPLY", {
            "m": args,
            "x": type,
            "h": host,
            "n": nick,
            "-": this.nickname
        });

        this.fireEvent("userCTCPReply", {
            'user': user,
            'type': type,
            'args': args
        });
    },

    serverNotice: function(user, message) {
        if (!user) {
            this.newServerLine("SERVERNOTICE", {
                "m": message
            });
        } else {
            this.newServerLine("PRIVNOTICE", {
                "m": message,
                "n": user
            });
        }
        this.fireEvent("serverNotice", {
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

    broadcast: function(user, channel, message, from, msgtype) {
        var nick = util.hostToNick(user);

        this.tracker.updateLastSpoke(nick, channel, Date.now());
        this.newChanLine(channel, msgtype, user, {
            "m": message,
            "@": this.getNickStatus(channel, nick),
            "f": from
        });
    },

    storeChannels: function(channels) {
        var store = prelude.uniq(channels);
        this.channels = channels;
        this.options.channels.set(store);
    },

    getChannels: function() {
        var chans = this.channels = this.options.channels.get() || [];
        // this.channels = chans ? chans.split(",") : [];
        return chans;
    },

    canJoinChannel: function(chan) {
        //TODO check if already on channel

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
            this.writeMessages(lang.waitToJoin, {channel: chan,
                                                time: maxTime});
        }

        return broken.length === 0;
    },


    isNetworkService: function(user) {
        return this.ui.options.networkServices.contains(user);
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
            //var splitnick = nick.split("");
            //var hasPrefix = Functional.compose(">0".lambda(), String.indexOf.curry("+@"), prelude.item(0));
            // splitnick.every(function(c, i) {
            //     if (this.prefixes.indexOf(c) == -1) {
            //         nick = nick.substr(i);
            //         return false;
            //     }
            //     prefixes.push(c);
            //     return true;
            // }, this);
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
        Object.each(this.windows, function(win) {
            if (util.isChannelType(win.type))
                win.close();
        });
        // for (var wid in this.windows) {
        //     var win = this.windows[wid];
        //     if (util.isChannelType(win.type))
        //         win.close();
        // }
        delete this.tracker;

        this.newServerLine("DISCONNECT", {
            "m": message
        });
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

        // var modehash = {};
        // this.prefixes.slice(0, pos + 1).split("").each(function(x) {
        //     modehash[x] = true;
        // });

        // var prefixes = entry.prefixes;
        // for (var i = 0; i < prefixes.length; i++){
        //     if (modehash[prefixes.charAt(i)])
        //         return true;
        // }

        var prefixes = this.prefixes.substring(0, pos + 1);

        //true if any of entry.prefix is part of prefixes string
        return Array.some(entry.prefixes, function(prefix) {
            return util.validPrefix(prefixes, prefix);
        });

        // return false;
    },

    supported: function(key, value) {
        if (key == "PREFIX") {
            var len = (value.length - 2) / 2;

            this.modeprefixes = value.substr(1, len);
            this.prefixes = value.substr(len + 2, len);
        }

        this.parent(key, value);
    },

    connected: function() {
        this.newServerLine("CONNECT");
    },

    serverError: function(message) {
        this.newServerLine("ERROR", {
            "m": message
        });
    },

    quit: function(message) {
        this.send("QUIT :" + message, true);
        this.disconnect();
    },

    disconnect: function() {
        // for (var k in this.activeTimers) {
        //     this.activeTimers[k].cancel();
        // }
        Object.each(this.activeTimers, function(timer) {
            timer.cancel();
        });
        this.activeTimers = {};

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
            "n": nick
        };
        var mtype = type.toUpperCase();

        var xsend = this.newTargetOrActiveLine.curry(nick, "WHOIS" + mtype, ndata);

        switch(type.toLowerCase()) {
            case "user":
                ndata.h = data.ident + "@" + data.hostname;
                xsend();
                mtype = "REALNAME";
                ndata.m = data.realname;
            break;
            case "server":
                ndata.x = data.server;
                ndata.m = data.serverdesc;
            break;
            // case "oper":
            // break;
            case "channels":
                ndata.m = data.channels;
            break;
            case "account":
                ndata.m = data.account;
            break;
            case "away":
                ndata.m = data.away;
            break;
            case "opername":
                ndata.m = data.opername;
            break;
            case "actually":
                ndata.m = data.hostname;
                ndata.x = data.ip;
            break;
            case "generictext":
                ndata.m = data.text;
            break;
            // case "end": 
            // break;
            default:
                return false;
        }

        xsend();
        return true;
    },

    genericError: function(target, message) {
        this.newTargetOrActiveLine(target, "GENERICERROR", {
            m: message,
            t: target
        });
    },

    genericQueryError: function(target, message) {
        this.newQueryOrActiveLine(target, "GENERICERROR", {
            m: message,
            t: target
        }, true);
    },

    awayStatus: function(state, message) {
        this.newActiveLine("GENERICMESSAGE", {
            m: message
        });
    },

    pushLastNick: function(nick) {
        var i = this.lastNicks.indexOf(nick);
        if (i != -1) {
            this.lastNicks.splice(i, 1);
        } else {
            if (this.lastNicks.length == this.options.maxnicks) this.lastNicks.pop();
        }
        this.lastNicks.unshift(nick);
    },

    wallops: function(user, text) {
        var nick = util.hostToNick(user);
        var host = util.hostToHost(user);

        this.newServerLine("WALLOPS", {
            t: text,
            n: nick,
            h: host
        });
    },

    channelModeIs: function(channel, modes) {
        this.newTargetOrActiveLine(channel, "CHANNELMODEIS", {
            c: channel,
            m: modes.join(" ")
        });
    },

    channelCreationTime: function(channel, time) {
        this.newTargetOrActiveLine(channel, "CHANNELCREATIONTIME", {
            c: channel,
            m: util.IRCDate(new Date(time * 1000))
        });
    },

    getPopularChannels: function() {
        this.exec('/list >75'); //request chans with more than 75 users
        return [{channel:'ToDo', users: 300}, {channel:'show pop channels', users: 186}];
    }
});