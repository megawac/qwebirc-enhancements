(function() {
    function genericError(prefix, params) {
        var target = params[1],
            message = params.getLast();

        this.genericError(target, message);
        return true;
    }
    function genericQueryError(prefix, params) {
        var target = params[1],
            message = params.getLast();

        this.genericQueryError(target, message);
        return true;
    }

//base client should know absolutely nothing about the outside world- client will dictate ui interactions via events
irc.BaseIRCClient = new Class({
    Implements: [Options, Events],
    Binds: ["lostConnection", "send", "connected", "retry", "ndispatch", "tdispatch"],

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
                "recv": self.ndispatch,
                "quit": self.quit,
                "retry": self.retry,
                "connected": self.connected,
                "lostConnection": self.lostConnection
            });
        } else {
            self.connection = new irc.TwistedConnection({
                account: options.account,
                initialNickname: self.nickname,
                password: options.password,
                serverPassword: options.serverPassword
            });
            self.connection.addEvent("recv", self.tdispatch);
        }
    },

    trigger: function(type, data) { //just a kind helper so i can get the type easily on the ui
        if(!data) data = {};
        data["-"] = this.nickname;
        return this.fireEvent(type, [type, data]);
    },

    isConnected: function() {
        return this.__signedOn && this.connection.connected;
    },

    retry: util.noop,

    lostConnection: function() {
    },

    send: function(data) {
        return this.connection.send(data);
    },

    ndispatch: function(data) {
        var fn = this["irc_" + data.command];

        if (!(fn && fn.call(this, data.prefix, data.args))) {//fn dne or does not return true
            this.rawNumeric(data.command, data.prefix, data.args);
        }
    },

    tdispatch: function(data) {
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
                var command = data[1].toUpperCase(),
                    prefix = data[2],
                    sl = data[3],

                    fn = this["irc_" + (irc.Numerics[command] || command)];

                if (fn) {
                    var result = fn.call(this, prefix, sl);
                    if (result) {
                        return;
                    }
                }
                this.rawNumeric(command, prefix, sl);
            break;
        }
    },


    supported: function(key, value) {
        var self = this;
        switch(key) {
            case "CASEMAPPING":
                if (value === "ascii") {
                    self.toIRCLower = irc.ASCIItoIRCLower;
                } else if (value === "rfc1459") {
                    //default
                } else {
                    // TODO: warn 
                    console.log('unsupported codec');
                }
                self.lowerNickname = self.toIRCLower(self.nickname); //why does self happen here
            break;
            case "CHANMODES":
                value.split(",").each(function(mode, inx) {
                    _.each(mode, function(letter) {
                        self.pmodes[letter] = inx;
                    });
                });
            break;
            case "PREFIX":
                var len = (value.length - 2) / 2,
                    modeprefixes = value.substr(1, len);
                _.each(modeprefixes, function(modeprefix) {
                    self.pmodes[modeprefix] = irc.PMODE_SET_UNSET;
                });
            break;
        }
    },

    __inChannel: function(name) {
        return this.channels.contains(name);
    },

    __killChannel: function(name) {
        return this.channels.erase(name);
    },

    processCTCP: function(message) {
        if (message.charAt(0) !== "\x01")
            return;

        if (Array.getLast(message) === "\x01") {
            message = message.substr(1, message.length - 2);
        } else {
            message = message.substr(1);
        }
        return message.splitMax(" ", 2);
    },

    //expected to be overriden
    getChannels: function() {
        return this.channels;
    },

    storeChannels: function(c) {
        this.channels = c;
        return c;
    },

    canJoinChannel: $lambda(true),

    irc_RPL_WELCOME: function(prefix, params) {
        var self = this;
        self.nickname = params[0];
        self.lowerNickname = self.toIRCLower(self.nickname);
        self.signedOn(self.nickname);
        _.delay(function() {
            self.__signedOn = true; //so auto join channels arent selected immediately - brouhaha window is
        }, 2000);
    },

    irc_ERR_NICKNAMEINUSE: function(prefix, params) {//add some number to the nick and resend
        this.genericError(params[1], params.getLast());

        if (this.__signedOn) {
            return true;
        }

        var nick = params[1],
            newnick = nick + Number.random(0, 9);

        this.send(format(cmd.NICK, {nick: newnick}));
        this.lastnick = newnick;
        return true;
    },

    irc_NICK: function(prefix, params) {
        var user = prefix,
            oldnick = util.hostToNick(user),
            newnick = params[0],
            wasus = this.nickname === oldnick;

        if (wasus) { //shouldnt this always be true?
            this.nickname = newnick;
            this.lowerNickname = this.toIRCLower(this.nickname);
        }

        this.nickChanged(user, newnick, wasus);

        return true;
    },

    irc_QUIT: function(prefix, params) {
        var user = prefix,
            message = params.getLast();

        this.userQuit(user, message);

        return true;
    },

    irc_PART: function(prefix, params) {
        var user = prefix,
            channel = params[0],
            message = params[1],

            nick = util.hostToNick(user);

        this.partHandler(nick, channel);
        this.userPart(user, channel, message);

        return true;
    },

    irc_KICK: function(prefix, params) {
        var kicker = prefix,
            channel = params[0],
            kickee = params[1],
            message = params[2];

        this.partHandler(kickee, channel);
        this.userKicked(kicker, channel, kickee, message);

        return true;
    },

    partHandler: function(nick, chan) {
        var wasus = nick === this.nickname;
        if(wasus && this.__inChannel(chan)) {
            this.__killChannel(chan);
        }
        return wasus;
    },

    irc_PING: function(prefix, params) {
        this.send("PONG :" + params.getLast());
        return true;
    },

    irc_JOIN: function(user, params) {
        var newchan = params[0],
            nick = util.hostToNick(user),
            wasus = (nick === this.nickname);

        if(wasus) {
            if(!isBaseWindow(newchan)) {
                this.storeChannels(util.addChannel(this.getChannels(), newchan));
            }
            if(this.__signedOn) {
                this.currentChannel = newchan;
            }
        }

        this.userJoined(user, newchan);

        return true;
    },


    irc_TOPIC: function(prefix, params) {
        var user = prefix,
            channel = params[0],
            topic = params.getLast();

        this.channelTopic(user, channel, topic);

        return true;
    },

    //todo buffer messages
    irc_PRIVMSG: function(prefix, params) {
        var user = prefix,
            target = params[0],
            message = params.getLast();

        var ctcp = this.processCTCP(message);
        if (ctcp) {
            var type = ctcp[0].toUpperCase();

            var replyfn = irc.RegisteredCTCPs[type];
            if (replyfn) {
                var t = Date.now() / 1000;
                if (t > this.nextctcp) { //too quick? why not just a buffer?
                    var repctcp = replyfn(ctcp[1]);
                    this.send(format(cmd.CTCP, {
                        target: util.hostToNick(user),
                        type: type,
                        text: repctcp
                    }));
                }
                this.nextctcp = t + 5;
            }

            if (target === this.nickname) {
                this.userCTCP(user, type, ctcp[1]);
            } else {
                this.channelCTCP(user, target, type, ctcp[1]);
            }
        } else {
            if (target === this.nickname) {
                this.userPrivmsg(user, message);
            } else {
                this.channelPrivmsg(user, target, message);
            }
        }
        return true;
    },

    irc_NOTICE: function(host, params) {
        var user = util.hostToNick(host),
            target = params[0],
            message = params.getLast(),
            options = this.options,
            isNetworkService = options.networkServices.contains(host);

        if(isNetworkService && options.loginRegex.test(message)) {
            this.authEvent();
        }

        if (isNetworkService || user == "" || user.contains("!")) {
            this.serverNotice(host, message, target);
        } else if (target === this.nickname) {
            var ctcp = this.processCTCP(message);
            if (ctcp) {
                this.userCTCPReply(host, ctcp[0], ctcp[1]);
            } else {
                this.userNotice(host, message);
            }
        } else {
            this.channelNotice(host, target, message);
        }

        return true;
    },

    irc_INVITE: function(prefix, params) {
        var user = prefix,
            channel = params.getLast();

        this.userInvite(user, channel);

        return true;
    },

    irc_ERROR: function(prefix, params) {
        var message = params.getLast();

        this.serverError(message);

        return true;
    },

    irc_MODE: function(prefix, params) {
        var user = prefix,
            target = params[0],
            args = params.slice(1);

        if (target == this.nickname) {
            this.userMode(args);

        } else {
            var modes = args[0].split(""),//dont really need to split here
                xargs = args.slice(1),

                argindx = 0, //go to hell
                cmode = OPED;

            var data = modes.filter(function(mode) { //alternatively just do the if in map and then clean()
                var dir = (mode === OPED) || (mode === DEOPED);
                if (dir) {
                    cmode = mode;
                }
                return !dir;
            }).map(function(mode) {
                var pmode = this.pmodes[mode],
                    m = (pmode === irc.PMODE_LIST || pmode === irc.PMODE_SET_UNSET/* || (cmode === OPED && pmode === irc.PMODE_SET_ONLY)*/) ?
                            [cmode, mode, xargs[argindx++]] :
                            [cmode, mode];
                return m;
            }, this);

            this.channelMode(user, target, data, args);
        }

        return true;
    },

    // irc_RPL_MOTD: function(prefix, params) {
    //     console.warn(arguments);
    // },

    irc_RPL_ISUPPORT: function(prefix, params) {
        var supported = params.slice(1, -1); //everything but nick and server msg
        var ms;

        if(supported.contains("CHANMODES") && supported.contains("PREFIX")) { //nasty hack - don't understand purpose 
            this.pmodes = {}; //evil might break things
        }

        supported.each(function(mode) {
            ms = mode.splitMax("=", 2);
            this.supported(ms[0], ms[1]);
        }, this);
    },

    irc_RPL_NAMREPLY: function(prefix, params) {
        var channel = params[2],
            names = params[3];

        this.channelNames(channel, names.split(" "));

        return true;
    },

    irc_RPL_ENDOFNAMES: function(prefix, params) {
        var channel = params[1];

        this.channelNames(channel, []);
        return true;
    },

    irc_RPL_NOTOPIC: function(prefix, params) {
        var channel = params[1];

        if (this.__inChannel(channel)) {
            this.initialTopic(channel, "");
            return true;
        }
    },

    irc_RPL_TOPIC: function(prefix, params) {
        var channel = params[1],
            topic = params.getLast();

        if (this.__inChannel(channel)) {
            this.initialTopic(channel, topic);
            return true;
        }
    },

    irc_RPL_TOPICWHOTIME: $lambda(true),

    irc_RPL_WHOISUSER: function(prefix, params) {
        var nick = params[1];
        this.whoisNick = nick;

        return this.whois(nick, "user", {
            ident: params[2],
            hostname: params[3],
            realname: params.getLast()
        });
    },

    irc_RPL_WHOISSERVER: function(prefix, params) {
        var nick = params[1],
            server = params[2],
            serverdesc = params.getLast();

        return this.whois(nick, "server", {
            server: params[2],
            serverdesc: params.getLast()
        });
    },

    irc_RPL_WHOISOPERATOR: function(prefix, params) {
        var nick = params[1],
            text = params.getLast();

        return this.whois(nick, "oper", {
            opertext: params.getLast()
        });
    },

    irc_RPL_WHOISIDLE: function(prefix, params) {
        var nick = params[1];

        return this.whois(nick, "idle", {
            idle: params[2],
            connected: params[3]
        });
    },

    irc_RPL_WHOISCHANNELS: function(prefix, params) {
        var nick = params[1];

        return this.whois(nick, "channels", {
            channels: params.getLast()
        });
    },

    irc_RPL_WHOISACCOUNT: function(prefix, params) {
        var nick = params[1];

        return this.whois(nick, "account", {
            account: params[2]
        });
    },

    irc_RPL_WHOISACTUALLY: function(prefix, params) {
        var nick = params[1];

        return this.whois(nick, "actually", {
            hostmask: params[2],
            ip: params[3]
        });
    },

    irc_RPL_WHOISOPERNAME: function(prefix, params) {
        var nick = params[1],
            opername = params[2];

        return this.whois(nick, "opername", {
            opername: params[2]
        });
    },

    irc_RPL_WHOISGENERICTEXT: function(prefix, params) {
        var nick = params[1],
            text = params.getLast();

        return this.whois(nick, "generictext", {
            text: text
        });
    },

    irc_RPL_WHOISWEBIRC: function(prefix, params) {
        var nick = params[1],
            text = params.getLast();

        return this.whois(nick, "generictext", {
            text: text
        });
    },

    irc_RPL_WHOISSECURE: function(prefix, params) {
        var nick = params[1],
            text = params.getLast();

        return this.whois(nick, "generictext", {
            text: text
        });
    },

    irc_RPL_ENDOFWHOIS: function(prefix, params) {
        var nick = params[1],
            text = params.getLast();
        this.whoisNick = null;

        return this.whois(nick, "end", {});
    },

    irc_genericError: genericError,
    irc_ERR_CHANOPPRIVSNEEDED: genericError,
    irc_ERR_CANNOTSENDTOCHAN: genericError,

    irc_genericQueryError: genericQueryError,

    irc_ERR_NOSUCHNICK: genericQueryError,

    irc_RPL_AWAY: function(prefix, params) {
        var nick = params[1],
            text = params.getLast();

        if (this.whoisNick && (this.whoisNick == nick)) return this.whois(nick, "away", {
            "away": text
        });

        this.awayMessage(nick, text);
        return true;
    },

    irc_RPL_NOWAWAY: function(prefix, params) {
        this.awayStatus(true, params.getLast());
        return true;
    },

    irc_RPL_UNAWAY: function(prefix, params) {
        this.awayStatus(false, params.getLast());
        return true;
    },

    irc_WALLOPS: function(prefix, params) {
        var user = prefix,
            text = params.getLast();

        this.wallops(user, text);
        return true;
    },

    irc_RPL_CREATIONTIME: function(prefix, params) {
        var channel = params[1],
            time = params[2];

        this.channelCreationTime(channel, time);
        return true;
    },

    irc_RPL_CHANNELMODEIS: function(prefix, params) {
        var channel = params[1],
            modes = params.slice(2);

        this.channelModeIs(channel, modes);
        return true;
    },


    irc_RPL_LISTSTART: function() {
        this.listedChans = [];
        return !this.hidelistout;
    },

    irc_RPL_LIST: function(bot, args) {
        this.listedChans.push({
            channel: args[1],
            users: _.toInt(args[2]),
            topic: args[3]
        });
        return !this.hidelistout;
    },

    irc_RPL_LISTEND: function() {
        this.trigger("listend", this.listedChans);
        return !this.hidelistout;
    }
})
})();