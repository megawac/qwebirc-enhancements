// //ircclient with added event support
irc.IRCClient = new Class({
    Implements: [Options, Events, irc.Commands],
    Binds: ["lostConnection", "send", "quit", "connected","retry", "_ndispatch", "_tdispatch"],
    options: {
        minRejoinTime: [0],
        networkServices: [],
        loginRegex: /^$/ //always fail
    },
    lastNicks: [],
    inviteChanList: [],
    activeTimers: {},
    prefixes: "@+",//heirarchy of prefixes - "@"(operator), "+"(voice)
    modeprefixes: "ov",
    __signedOn: false,
    authed: false,
    channels: [],
    nextctcp: 0,
    pmodes: {
        b: irc.PMODE_LIST,
        l: irc.PMODE_SET_ONLY,
        k: irc.PMODE_SET_UNSET,
        o: irc.PMODE_SET_UNSET,
        v: irc.PMODE_SET_UNSET
    },
    toIRCLower: irc.RFC1459toIRCLower,//default text codec
    
    initialize: function(options) {
        var self = this;
        options = self.setOptions(options).options;

        self.nickname = options.nickname;
        self.lowerNickname = self.toIRCLower(self.nickname);

        if(options.node) {
            var conn = self.connection = new irc.NodeConnection({
                account: options.account,
                nickname: self.nickname,
                password: options.password,
                serverPassword: options.serverPassword
            });
            conn.addEvents({
                "recv": self._ndispatch,
                "quit": self.quit,
                "retry": self.retry,
                "connected": self.connected,
                "lostConnection": self.lostConnection
            });
        } else {
            self.connection = new irc.TwistedConnection({
                initialNickname: self.nickname,
                serverPassword: options.serverPassword
            });
            self.connection.addEvent("recv", self._tdispatch);
        }

        // self.commandparser = new irc.Commands(self);
        // self.exec = self.commandparser.exec;
        self.tracker = new irc.IRCTracker(self);
    },

    //connection methods
    connect: function() {
        return this.connection.connect();
    },

    connected: function() {
        this.trigger("connect", {});
    },

    send: function(data) {
        return this.connection.send(data);
    },

    disconnect: function() {
        this.connection.disconnect();
        return this;
    },

    disconnected: function(message) {
        delete this.tracker;
        this.trigger("disconnect", {
            message: message
        });
    },

    quit: function(message) {
        if(this.isConnected()) {    
            this.send("QUIT :" + (message || lang.quit), true);
            _.each(this.activeTimers, $clear);
            this.activeTimers = {};
            this.writeMessages(lang.disconnected, {}, {channels: "ALL"});
            this.disconnect();
            this.trigger("disconnect");
            this.__signedOn = false;
        }
        return this;
    },

    lostConnection: function() {
        console.log("todo");
        console.log(arguments);
    },

    retry: function(data) {
        this.trigger("retry", data);
        this.writeMessages(lang.connRetry, {
            next: (data.next/1000).round(1)
        }, {
            channels: "ALL"
        });
    },
    /***********************************************
    *           General helpers                    *
    ************************************************/
    trigger: function(type, data) { //just a kind helper so i can get the type easily on the ui
        if(!data) data = {};
        data["-"] = this.nickname;
        return this.fireEvent(type, [type, data]);
    },

    isConnected: function() {
        return this.__signedOn && this.connection.connected;
    },

    isNetworkService: function(host) {//is host registered network service
        return this.options.networkServices.contains(host);
    },

    inChannel: function(name) {
        return this.channels.contains(name);
    },

    storeChannels: function(channels) {
        this.channels = channels = channels || this.channels;
        var store = util.removeChannel(channels, BROUHAHA);
        this.options.settings.set("channels", store);
        return this;
    },

    getChannels: function() {
        var chans = this.channels = util.prependChannel(this.options.settings.get("channels") || [], BROUHAHA);
        return chans;
    },

    nickOnChanHasPrefix: function(nick, channel, prefix) {
        var entry = this.tracker.getNickOnChannel(nick, channel);
        if (!$defined(entry)) return false; /* shouldn't happen */

        return (entry.prefixes).contains(prefix);
    },

    getNickStatus: function(channel, nick) {
        var nickchan = this.tracker.getNickOnChannel(nick, channel);
        if (!$defined(nickchan) || nickchan.prefixes.length === 0)
            return "";

        return nickchan.prefixes.charAt(0);
    },

    nickOnChanHasAtLeastPrefix: function(nick, channel, prefix) {
        var entry = this.tracker.getNickOnChannel(nick, channel);
        if (!$defined(entry))
            return false; /* shouldn't happen */

        /* this array is sorted */
        var pos = this.prefixes.indexOf(prefix);
        if (pos === -1) return false; /* shouldn't happen */

        var prefixes = this.prefixes.slice(0, pos + 1);

        //true if any of entry.prefix is part of prefixes string
        return _.some(entry.prefixes, function(prefix) {
            return util.validPrefix(prefixes, prefix);
        });
    },

    //needs a rewrite with a proper list implementation
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
        });
    },

    canJoinChannel: function(chan) {
        //check if already on channel
        if(chan === BROUHAHA) return true;
        else if(this.tracker.getChannel(chan)) return false;

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

    /*************************************************
    *   Process server/network data & call method    *
    **************************************************/
    _ndispatch: function(data) {
        var fn = this[this.IRC_COMMAND_MAP[data.command] || "irc_" + data.command];

        if (!(fn && fn.call(this, data))) {//fn dne or does not return true
            this.rawNumeric(data);
        }
    },

    _tdispatch: function(data) {
        var message = data[0];
        switch(message) {
            case "connect":
                this.connected();
            break;
            case "disconnect":
                if (data.length === 0) {
                    this.disconnected("No error!");
                } else {
                    this.disconnected(data[1]);
                }
                this.disconnect();
            break;
            case "c":
                var _data = util.processTwistedData(data);
                this._ndispatch(_data);
            break;
        }
    },

    /*************************************************
    *               message helpers                  *
    **************************************************/
    writeMessages: function(messages, args, data) {
        data = _.extend({
            type: "info",
            colourClass: "",
            channel: STATUS,
            message: []
        }, data);
        data.channels = data.channels === "ALL" ? [STATUS, BROUHAHA].concat(this.channels) : data.channels;
        var client = this,
            types = lang.TYPES;

        function write(message) {
            var msg = args ? util.formatter(message.message, args) :
                            message.message; //replaces values like {replaceme} if args has a key like that
            data.message.push(msg);

            switch (message.type) {
            case types.ERROR:
                data.colourClass = "warn";
                break;
            case types.INFO:
                data.colourClass = "info";
                break;
            }
        }

        if(_.isArray(messages)){
            messages.each(write);
        }else {
            write(messages);
        }
        return this.trigger("info", data);
    },

    genericError: function(data) {
        var target = data.args[1],
            message = _.last(data.args);
        this.trigger("error", {
            target: target,
            channel: target,
            message: message,
            type: "genericError"
        });
        return true;
    },
    genericQueryError: function(data) {
        var target = data.args[1],
            message = _.last(data.args);

        this.trigger("error", {
            target: target,
            channel: target,
            message: message,
            type: "genericError"
        });
        return true;
    },

    /*************************************************
    *       private server event handlers             *
    **************************************************/
    _signOn: function(/*data*/) {
        var options = this.options,
            channels;

        this.writeMessages(lang.signOn);
        this.writeMessages(lang.loginMessages, {}, {channel: BROUHAHA});

        if (!this.authed && auth.enabled) {
            this.exec(util.format("/AUTH {username} {password}", this.options));

            // if the user is authed they will be set to +x... however as most users arent authed...
            //wait a hundreth of a second to see if the auth server authed you
            this.writeMessages.delay(100, this, lang.joinAfterAuth);

            this.activeTimers.autojoin = (function() {
                if (!this.authed) {
                    this.writeMessages(lang.authFailed);
                }
            }).delay(5000, this);
        } else {
            this.exec("/AUTOJOIN");
        }

        this.trigger("logon", {
            'nickname': this.nickname,
            'channels': channels
        });
    },

    _supported: function(key, value) {
        var self = this;
        switch(key) {
            case "CASEMAPPING":
                if (value === "ascii") {
                    self.toIRCLower = irc.ASCIItoIRCLower;
                } else if (value === "rfc1459") {
                    //default
                } else if(DEBUG) {
                    // TODO: warn 
                    console.log('unsupported codec');
                }
                self.lowerNickname = self.toIRCLower(self.nickname); //why does self happen here
            break;
            case "CHANMODES":
                _.each(value.split(","), function(mode, inx) {
                    _.each(mode, function(letter) {
                        self.pmodes[letter] = inx;
                    });
                });
            break;
            case "PREFIX":
                var len = (value.length - 2) / 2,
                    modeprefixes = self.modeprefixes = value.substr(1, len);
                self.prefixes = value.substr(len + 2, len);
                _.each(modeprefixes, function(modeprefix) {
                    self.pmodes[modeprefix] = irc.PMODE_SET_UNSET;
                });
            break;
        }
    },

    _joinInvited: _.debounce(function() {
        this.exec("/JOIN " + this.inviteChanList.join(","));
        this.inviteChanList.empty();
    }, 100),

    processCTCP: function(message) {
        if (message.charAt(0) !== "\x01") return;

        if (_.last(message) === "\x01") {
            message = message.slice(1, message.length - 2);
        } else {
            message = message.slice(1);
        }
        return message.splitMax(" ", 2);
    },

    rawNumeric: function(data) {
        this.trigger("raw", {
            "numeric": data.command,
            "message": data.args.slice(1).join(" ")
        });
    },

    updateNickList: function(channel) {
        this.trigger("updateNicklist", {
            nicks: this.tracker.getSortedNicksForChannel(channel),
            channel: channel
        });
    },

    _pushLastNick: function(nick) {
        var i = this.lastNicks.indexOf(nick);
        if (i != -1) {
            this.lastNicks.splice(i, 1);
        } /*else if (this.lastNicks.length == this.options.maxnicks) {
            this.lastNicks.pop();
        }*/
        this.lastNicks.unshift(nick);
    },

    _initChanTopic: function(channel, topic) {
        this.trigger("chanTopic", {
            'channel': channel,
            'topic': topic,
            'initial': true
        });
    },

    _initChanUsers: function(channel, names) {
        if (names.length === 0) { //occurs on channel join
            this.updateNickList(channel);
            return;
        }
        var getPrefixes = util.prefixOnNick(this.prefixes);
        _.each(names, function(prenick) {
            var prefixNick = getPrefixes(prenick),
                prefixes = prefixNick[0],
                nick = prefixNick[1];

            if (channel !== BROUHAHA) {
                this.tracker.addNickToChannel(nick, BROUHAHA);
            }
            var nc = this.tracker.addNickToChannel(nick, channel);

            _.each(prefixes, function(p) {
                util.addPrefix(nc, p, this.prefixes);
            }, this);
        }, this);
    },

    onAuthenticated: function(data) {
        this.authed = true;
        this.exec("/UMODE +x");
        if (!this.__autojoined) {
            this.writeMessages(lang.joinChans);
            this.exec("/AUTOJOIN");
        }

        this.fireEvent("auth", {
            nick: data.nick,
            message: _.last(data.args),
            host: data.host,
            username: _.first(data.args)
        });
    },

    _whois: function(nick, type, data) {
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
                    type: "whoisUser",
                    h: data.ident + "@" + data.hostname
                });

                msgs.push({
                    type: "whoisRealname",
                    m: data.realname
                });
            break;
            case "server":
                msgs.push({
                    x: data.server,
                    message: data.serverdesc,
                    type: "whoisServer"
                });
            break;
            case "channels":
                msgs.push({
                    message: data.channels,
                    type: "whoisChannels"
                });
            break;
            case "account":
                msgs.push({
                    message: data.account,
                    type: "whoisAccount"
                });
            break;
            case "away":
                msgs.push({
                    message: data.away,
                    type: "whoisAway"
                });
            break;
            case "opername":
                msgs.push({
                    message: data.opername,
                    type: "whoisOpername"
                });
            break;
            case "actually":
                msgs.push({
                    message: data.hostname,
                    x: data.ip,
                    type: "whoisActually"
                });
            break;
            case "generictext":
                msgs.push({
                    message: data.text,
                    type: "whoisGenericText"
                });
            break;
            default:
                msgs.push({
                    type: "whois" + type.toLowerCase().capitalize()
                });
        }

        this.trigger("whois", ndata);
        return true;
    },

    /*********************************************************************
    *                                                                    *
    *                BEGIN STANDARD IRC HANDLERS                         *
    *                                                                    *
    **********************************************************************/
    IRC_COMMAND_MAP: {// function router see _ndispatch
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
        "ERR_NOSUCHNICK": "genericQueryError"//,

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
        self.lowerNickname = self.toIRCLower(self.nickname);
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

        if (wasus) { //shouldnt this always be true?
            this.nickname = newnick;
            this.lowerNickname = this.toIRCLower(this.nickname);
        }

        if (wasus) {
            self.nickname = newnick;
            self.options.settings.set("nickname", newnick);
        }

        self.tracker.renameNick(oldnick, newnick);

        var channels = self.tracker.getNick(newnick);

        _.each(channels, function(obj, chan) {
            self.updateNickList(chan);
        });

        self.trigger("nickChange", {
            'nick': oldnick,
            'newnick': newnick,
            'channels': channels,
            'thisclient': wasus,
            'type': 'nick'
        });

        return true;
    },

    irc_JOIN: function(data) {
        var channel = data.args[0],
            nick = data.nick,
            wasus = (nick === this.nickname);

        if(wasus) {
            if(!isBaseWindow(channel)) {
                this.storeChannels(util.addChannel(this.getChannels(), channel));
            }
            if(this.__signedOn) {
                this.currentChannel = channel;
            }
        }

        var nick = data.nick,
            host = data.host,
            wasus = (nick === this.nickname),
            type = wasus ? "OURJOIN" : "JOIN",
            windowSelected = (channel === this.currentChannel || channel === BROUHAHA);

        this.tracker.addNickToChannel(nick, BROUHAHA);
        this.tracker.addNickToChannel(nick, channel);
        this.updateNickList(BROUHAHA);
        this.updateNickList(channel);

        this.trigger("userJoined", {
            'nick': nick,
            'host': host,
            'channel': channel,
            'thisclient': wasus,
            'select': windowSelected
        });

        return true;
    },

    irc_QUIT: function(data) {
        var self = this,
            message = _.last(data.args),
            nick = data.nick,
            channels = self.tracker.getNick(nick);

        self.tracker.removeNick(nick);
        _.keys(channels).each(function(chan) {
            self.updateNickList(chan);
        });

        self.trigger("quit", {
            'host': data.host,
            'nick': nick,
            'channels': channels,
            'message': message
        });

        return true;
    },

    irc_PART: function(data) {
        var channel = data.args[0],
            message = data.args[1],
            nick = data.nick,
            wasus = (nick === this.nickname);

        this.partHandler(nick, channel);

        if (wasus) {
            this.tracker.removeChannel(channel);
        } else {
            this.tracker.removeNickFromChannel(nick, BROUHAHA);
            this.tracker.removeNickFromChannel(nick, channel);
            this.updateNickList(BROUHAHA);
            this.updateNickList(channel);
        }

        this.trigger("part", {
            'nick': nick,
            'host': data.host,
            'channel': channel,
            'message': message,
            'thisclient': wasus
        });

        return true;
    },

    irc_KICK: function(data) {
        var kicker = data.prefix,
            channel = data.args[0],
            kickee = data.args[1],
            message = data.args[2],
            wasus = kickee === this.nickname;

        this.partHandler(kickee, channel);
        if (wasus) {
            this.tracker.removeChannel(channel);
        } else {
            this.tracker.removeNickFromChannel(kickee, channel);
            this.updateNickList(channel);
        }

        this.trigger("kick", {
            'kicker': kicker,
            'channel': channel,
            'kickee': kickee,
            'message': message,
            'thisclient': wasus
        });

        return true;
    },

    partHandler: function(nick, chan) {
        var wasus = nick === this.nickname;
        if(wasus && this.inChannel(chan)) {
            this.channels.erase(chan);
        }
        return wasus;
    },

    irc_TOPIC: function(data) {
        var channel = data.args[0],
            topic = _.last(data.args);

        this.trigger("chanTopic", {
            'nick': data.nick,
            'channel': channel,
            'topic': topic
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
                    this.send(format(cmd.CTCP, {
                        target: data.user,
                        type: type,
                        text: replyfn(ctcp[1])
                    }));
                }
                this.nextctcp = t + 5;
            }

            if (target === this.nickname) {
                var ctcptype = type == "ACTION" ? "privAction" : "privCTCP";
                this.trigger(ctcptype, {
                    'nick': nick,
                    'host': data.host,
                    'message': ctcp[1] || "",
                    'data': type
                });
            } else {
                var data = {
                        'nick': nick,
                        'channel': target,
                        'message': ctcp[1] || "",
                        "prefix": this.getNickStatus(target, nick)
                    };
                if (type == "ACTION") {
                    this.tracker.updateLastSpoke(nick, target, Date.now());
                    this.trigger("chanAction", data);
                }
                else {
                    this.trigger("chanCTCP", data);
                }
            }
        } else {
            if (target === this.nickname) {
                this._pushLastNick(nick);
                this.trigger("query", {
                    'nick': nick,
                    'host': data.host,
                    'channel': nick,
                    'message': message,
                    'type': 'privmsg'
                });
            } else {
                this.tracker.updateLastSpoke(nick, target, Date.now());
                this.trigger("chanMessage", {
                    'nick': nick,
                    'channel': target,
                    'message': message,
                    'type': 'chanmsg',
                    "prefix": this.getNickStatus(target, nick)
                });
            }
        }
        return true;
    },

    irc_NOTICE: function(data) {
        var target = data.args[0],
            message = _.last(data.args),
            options = this.options;


        if (this.isNetworkService(data.host) || !$chk(data.nick)) {
            if(options.loginRegex.test(message)){
                this.onAuthenticated(data);
            }
            this.trigger("serverNotice", {
                'nick': data.nick,
                'message': message,
                'channel': STATUS
            });
        } else if (target === this.nickname) {
            var ctcp = this.processCTCP(message);
            if (ctcp) {
                this.trigger("ctcpReply", {
                    'nick': data.nick,
                    'host': data.host,
                    'ctcptype': ctcp[0],
                    'args': ctcp[1] || ""
                });
            } else {
                this.trigger("privNotice", {
                    'message': message,
                    'host': data.host,
                    'nick': data.nick,
                    'channel': data.nick
                });
            }
        } else {
            this.trigger("chanNotice", {
                'nick': data.nick,
                'channel': target,
                'message': message,
                "prefix": this.getNickStatus(target, data.nick)
            });
        }

        return true;
    },

    irc_INVITE: function(data) {
        var channel = _.last(data.args);
        var accept = this.ui.uiOptions2.get("accept_service_invites") && this.isNetworkService(host);

        if (accept) {
            if (this.activeTimers.serviceInvite) {
                $clear(this.activeTimers.serviceInvite);
            }
            // we do this so we can batch the joins
            this.activeTimers.serviceInvite = this._joinInvited();
            this.inviteChanList.push(channel);
        }

        this.trigger("invite", {
            'channel': channel,
            'accept': accept,
            'nick': data.nick,
            'host': data.host
        });

        return true;
    },


    irc_ERR_NICKNAMEINUSE: function(data) {//add some number to the nick and resend
        this.genericError(data);

        if (this.__signedOn) {
            return true;
        }

        var nick = data.args[1],
            newnick = nick + Number.random(0, 9);

        this.send(format(cmd.NICK, {nick: newnick}));
        this.lastnick = newnick;
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
                'modes': args,
                'message': args.join(""),
                'type': "UMODE",
                'n': this.nickname
            });
        } else {//target is channel
            var modes = args[0].split(""),
                nick = _.last(args),//note: not bothering for ban mask case 

                cmode = OPED;

            var modes = modes.filter(function(mode) {
                var dir = (mode === OPED) || (mode === DEOPED);
                if (dir) {
                    cmode = mode;
                }
                return !dir;
            }).each(function(mode) {
                var pmode = self.pmodes[mode],
                    _nick = pmode === irc.PMODE_LIST || pmode === irc.PMODE_SET_UNSET ? nick : null;

                var prefixindex = self.modeprefixes.indexOf(mode);
                if (prefixindex === -1) return;

                var nc = self.tracker.getOrCreateNickOnChannel(nick, target),
                    added = cmode === OPED;

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

        if(supported.contains("CHANMODES") && supported.contains("PREFIX")) { //nasty hack - don't understand purpose 
            this.pmodes = {}; //might invalidate things
        }

        supported.each(function(mode) {
            ms = mode.splitMax("=", 2);
            this._supported(ms[0], ms[1]);
        }, this);
    },

    irc_RPL_NAMREPLY: function(data) {
        var channel = data.args[2],
            names = data.args[3];

        this._initChanUsers(channel, names.split(" "));

        return true;
    },

    irc_RPL_ENDOFNAMES: function(data) {
        var channel = data.args[1];

        this._initChanUsers(channel, []);
        return true;
    },

    irc_RPL_NOTOPIC: function(data) {
        var channel = data.args[1];

        if (this.inChannel(channel)) {
            this._initChanTopic(channel, "");
            return true;
        }
    },

    irc_RPL_TOPIC: function(data) {
        var channel = data.args[1],
            topic = _.last(data.args);

        if (this.inChannel(channel)) {
            this._initChanTopic(channel, topic);
            return true;
        }
    },

    irc_RPL_TOPICWHOTIME: $lambda(true),

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
        var nick = data.args[1],
            server = data.args[2],
            serverdesc = _.last(data.args);

        return this._whois(nick, "server", {
            server: data.args[2],
            serverdesc: _.last(data.args)
        });
    },

    irc_RPL_WHOISOPERATOR: function(data) {
        var nick = data.args[1],
            text = _.last(data.args);

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
        var nick = data.args[1],
            opername = data.args[2];

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
        var nick = data.args[1],
            text = _.last(data.args);

        return this._whois(nick, "generictext", {
            text: text
        });
    },

    irc_RPL_ENDOFWHOIS: function(data) {
        var nick = data.args[1],
            text = _.last(data.args);
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
        })
        return true;
    },

    irc_WALLOPS: function(data) {
        this.trigger("wallops", {
            message: message,
            nick: data.nick,
            host: data.host
        });
        return true;
    },

    irc_RPL_CREATIONTIME: function(data) {
        var channel = data.args[1],
            time = data.args[2];

        this.trigger("serverMessage", {
            channel: channel || ACTIVE,
            message: util.IRCDate(new Date(time * 1000)),
            type: "channelCreationTime"
        });
        return true;
    },

    irc_RPL_CHANNELMODEIS: function(data) {
        var channel = data.args[1],
            modes = data.args.slice(2);

        this.trigger("serverMessage", {
            channel: channel || ACTIVE,
            message: modes.join(" "),
            type: "channelModeIs"
        });
        return true;
    },


    irc_RPL_LISTSTART: function() {
        this.listedChans = [];//should have a make list command in command utils
        return !this.hidelistout;
    },

    irc_RPL_LIST: function(data) {
        this.listedChans.push({
            channel: data.args[1],
            users: _.toInt(data.args[2]),
            topic: data.args[3]
        });
        return !this.hidelistout;
    },

    irc_RPL_LISTEND: function() {
        this.trigger("listend", this.listedChans);
        return !this.hidelistout;
    }
});
/*************************
   Whewh.. end irc client
***************************/