/**
  * ircclient new and improved
  *
  * @depends [irc/Commands, irc/Connection, irc/Tracker, config/ctcp]
  * @depends [irc/Numerics, util/constants, util/utils]
  * @provides [irc/Client]
  */
var LANGTYPE = lang.TYPES;
irc.Client = new Class({
    Implements: [Options, Events, irc.Commands],
    Binds: ["lostConnection", "send", "quit", "connected",  "retry", "dispatch"],
    options: {
        networkServices: [],
        loginRegex: /a^/ //always fail
    },
    inviteChanList: [],
    channels: [],
    activeTimers: {},
    prefixes: "~&@%+",//heirarchy of prefixes - ~owner @(operator), % half op +(voice) - will be overriden by server
    modeprefixes: "ov",
    __signedOn: false,
    authed: false,
    nextctcp: 0,
    pmodes: {
        b: irc.pmodes.LIST,
        l: irc.pmodes.SET_ONLY,
        k: irc.pmodes.SET_UNSET,
        o: irc.pmodes.SET_UNSET,
        v: irc.pmodes.SET_UNSET
    },
    toIRCLower: irc.RFC1459toIRCLower,//default text codec

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
        "ERR_CHANOPRIVSNEEDED": "genericError",
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
    
    initialize: function(options) {
        var self = this;
        options = self.setOptions(options).options;

        self.nickname = options.nickname;

        self.connection = new irc.Connection({
            nickname: self.nickname,
            serverPassword: options.serverPassword,
        })
        .addEvents({
            "recv": self.dispatch,
            "disconnect": function(data) {
                self.disconnect(data[1]);
            },
            "connect": self.connected,
            // "retry": self.retry,
            "lostConnection": self.lostConnection
        });

        // self.commandparser = new irc.Commands(self);
        // self.exec = self.commandparser.exec;
        self.tracker = new irc.Tracker(self);
    },

    getOption: function(opt) {
        return this.options.uiOptions.get(opt);
    },

    //connection methods
    connect: function() {
        this.writeMessages(lang.copyright, {qwebirc: qwebirc}, {type: LANGTYPE.INFO});
        this.connection.connect();
        return this;
    },

    connected: function() {
        this.trigger("connect", {});
    },

    send: function(data) {
        return this.connection.send(data);
    },

    disconnect: function(message) {
        delete this.tracker;
        this.writeMessages(message || lang.disconnected, {}, {channels: "ALL", type: LANGTYPE.INFO});
        this.connection.disconnect();
        return this.trigger("disconnect");
    },

    quit: function(message, notify) {
        if(this.isConnected()) {
            this.connection.send("QUIT :" + (message || this.getOption("quit_msg")), true);//this.connection.sendUnqueued("QUIT :" + (message || this.getOption("quit_msg")), false);//
            if(notify) {//time to go
                /* global $clear */
                _.each(this.activeTimers, $clear);
                this.activeTimers = {};
                this.disconnect();
                this.__signedOn = false;
            }
        }
        return this;
    },

    lostConnection: function(attempt) {
        this.writeMessages(lang.connTimeOut, {
            retryAttempts: attempt
        }, {
            channels: "ALL"
        });
    },

    // retry: function(data) {
    //     this.trigger("retry", data);
    //     this.writeMessages(lang.connRetry, {
    //         next: (data.next/1000).round(1)
    //     }, {
    //         channels: "ALL"
    //     });
    // },
    /***********************************************
    *           General helpers                    *
    ************************************************/
    trigger: function(type, data) { //just a kind helper so i can get the type easily on the ui
        if(!data) data = {};
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
        this.options.settings.set("channels", channels);
        return this;
    },

    getChannels: function() {
        var chans = this.channels = this.options.settings.get("channels") || [];
        return chans;
    },

    nickOnChanHasPrefix: function(nick, channel, prefix) {
        var entry = this.tracker.getNickOnChannel(nick, channel);
        return entry ? (entry.prefixes).contains(prefix) : false;
    },

    getNickStatus: function(channel, nick) {
        var nickchan = this.tracker.getNickOnChannel(nick, channel);
        if (!nickchan || nickchan.prefixes.length === 0) {
            return "";
        }
        return nickchan.prefixes.charAt(0);//prefix of highest order
    },

    nickOnChanHasAtLeastPrefix: function(nick, channel, prefix) {
        var entry = this.tracker.getNickOnChannel(nick, channel);
        if (!entry) return false; // shouldn't happen 

        /* this array is sorted */
        var pos = this.prefixes.indexOf(prefix);
        if (pos === -1) return false; // shouldn't happen 

        var prefixes = this.prefixes.slice(0, pos + 1);

        //true if any of entry.prefix is part of prefixes string
        return _.some(entry.prefixes, function(prefix) {
            return util.validPrefix(prefixes, prefix);
        });
    },

    // //needs a rewrite with a proper list implementation
    // getPopularChannels: function(cb, minUsers) {
    //     this.hidelistout = true;
    //     this.exec("/list >" + (minUsers || 75)); //request chans with more than 75 users
    //     this.addEvent("listend:once", function() {
    //         var chans = _.sortBy(this.listedChans.clone(), function(chan) {return -chan.users}); //neg to sort descending
    //         cb(chans);
    //         this.hidelistout = false;
    //     });
    // },

    canJoinChannel: function(chan) {//currently not implemented due to comments. Uncomment if desired
        //check if already on channel
        // if(chan === "brouhaha") return true;
        // else if(this.tracker.getChannel(chan)) return false;

        // var chansets = session.get(chan) || [], //oldest -> newest
        //     currTime = Date.now(),
        //     rejoinT = this.options.minRejoinTime,
        //     minTime = Math.max.apply(null, rejoinT.slice(0, chansets.length)) * 1000;//max min applicable time
        // chan = util.formatChannel(chan);

        // var broken = chansets.filter(function(time) {
        //     return currTime - time <= minTime;
        // });

        // if(broken.length === 0) {
        //     chansets.push(currTime);
        //     var n = (chansets.length - rejoinT.length).limit(0, chansets.length);
        //     session.set(chan, chansets.slice(n));
        // } else {
        //     var maxTime = Math.max.apply(null, chansets.map(function(time, i) {
        //         return ((minTime - (currTime - time))/1000).round(1); //to secs/10
        //     }));
        //     this.writeMessages(lang.waitToJoin, {channel: chan, time: maxTime});
        // }

        // return broken.length === 0;
        return chan === "brouhaha" || !this.tracker.getChannel(chan);
    },

    /*************************************************
    *   Process server/network data & call method    *
    **************************************************/
    dispatch: function(data) {
        var fn = this[this.IRC_COMMAND_MAP[data.command] || "irc_" + data.command];

        if (!(fn && fn.call(this, data))) {//fn dne or does not return true
            this.rawNumeric(data);
        }
    },
    
    rawNumeric: function(data) {
        this.trigger("raw", {
            "numeric": data.command,
            "message": data.args.slice(1).join(" ")
        });
    },

    /*************************************************
    *               message helpers                  *
    **************************************************/
    writeMessages: function(messages, args, idata) {
        var data = _.extend({
            type: LANGTYPE.INFO,
            colourClass: "",
            channel: constants.status,
            message: []
        }, idata);
        data.channels = data.channels === "ALL" ? [constants.status, "brouhaha"].concat(this.channels) : data.channels;

        function write(message) {
            var msg = args ? util.format(message, args) :
                            message.message || message; //replaces values like {replaceme} if args has a key like that
            data.message.push(msg);
        }

        if (_.isArray(messages)){
            messages.each(write);
        } else {
            write(messages);
        }
        switch (messages.type || data.type) {
            case LANGTYPE.ERROR:
                data.colourClass = "warn";
                break;
            case LANGTYPE.INFO:
                data.colourClass = "info";
                break;
        }
        data.type = "info";

        return this.trigger("info", data);
    },

    genericError: function(data) {
        var message = _.last(data.args),
            target = util.isChannel(data.args[1]) ? data.args[1] : constants.status;

        this.trigger("error", {
            target: target,
            channel: target,
            message: message,
            type: "genericError",
            colourClass: "warn"
        });
        return true;
    },
    /*genericQueryError: function(data) {
        var message = _.last(data.args),
            target = util.isChannel(data.args[1]) ? data.args[1] : constants.status;

        this.trigger("error", {
            target: target,
            channel: target,
            message: message,
            type: "genericError",
            colourClass: "warn"
        });
        return true;
    },*/

    /*************************************************
    *       private server event handlers             *
    **************************************************/
    _signOn: function(/*data*/) {
        var self = this;
        if(self.__signedOn) {//server/client crashed reconnect
            //console.log("REjoining " + util.formatChannelString(self.channels));
            return self.send(util.formatCommand("JOIN", {
                channel: util.formatChannelString(self.channels)
            }));
        }

        self.writeMessages(lang.signOn, {}, {type: LANGTYPE.SERVER})
            .writeMessages(lang.loginMessages, {}, {channel: "brouhaha", type: LANGTYPE.INFO});

        if (!self.authed && auth.enabled) {
            self.send(util.formatCommand("AUTH", self.options));
            // self.exec(format("/AUTH {username} {password}", self.options));

            // if the user is authed they will be set to +x... however as most users arent authed...
            //wait a hundreth of a second to see if the auth server authed you
            self.writeMessages.delay(100, self, lang.joinAfterAuth);

            self.activeTimers.autojoin = _.delay(function() {
                if (!self.authed) {
                    self.writeMessages(lang.authFailed, {}, {type: LANGTYPE.ERROR});
                }
            }, 5000);
        } else {
            self.exec("/AUTOJOIN");
        }

        self.trigger("logon", {
            "nickname": self.nickname,
            "channels": self.channels
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
                    // TODO: handle
                    console.warn("unsupported codec");
                }
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
                    modeprefixes = self.modeprefixes = value.substr(1, len);
                self.prefixes = value.substr(len + 2, len);
                _.each(modeprefixes, function(modeprefix) {
                    self.pmodes[modeprefix] = irc.pmodes.SET_UNSET;
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
        return util.splitMax(message, " ", 2);
    },

    updateNickList: function(channel) {
        this.trigger("updateNicklist", {
            nicks: this.tracker.getSortedNicksForChannel(channel),
            channel: channel
        });
    },

    onAuthenticated: function(data) {
        this.authed = true;
        this.exec("/UMODE +x");
        if (!this.__autojoined) {
            this.writeMessages(lang.joinChans, {}, {type: LANGTYPE.INFO});
            this.exec("/AUTOJOIN");
        }

        this.fireEvent("auth", {
            nick: data.nick,
            message: _.last(data.args),
            host: data.host,
            username: _.first(data.args)
        });
    }
});
