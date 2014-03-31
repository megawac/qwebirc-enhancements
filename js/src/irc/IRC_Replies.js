/**
 * ircclient non whois replies
 *
 * @depends [irc/Client]
 * @depends [util/utils]
 * @provides [irc/Replies]
 */

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
        var prefixNick = getPrefixes(prenick);
        var prefixes = prefixNick[0];
        var nick = prefixNick[1];

        var nc = client.tracker.addNickToChannel(nick, channel);

        _.each(prefixes, function(p) {
            util.addPrefix(nc, p, client.prefixes);
        });
    });
};

irc.Client.implement({

    irc_RPL_WELCOME: function(data) {
        var self = this;
        self.nickname = data.args[0];
        data.message = data.args[1];
        self._signOn(data);
        _.delay(function() {
            self.__signedOn = true; //so auto join channels arent selected immediately - brouhaha window is
        }, 2000);
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
        var channel = data.args[2];
        var names = data.args[3];

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
        var channel = data.args[1];
        var topic = _.last(data.args);

        if (this.inChannel(channel)) {
            initTopic(this, channel, topic);
            return true;
        }
    },

    irc_RPL_AWAY: function(data) {
        var nick = data.args[1];
        var message = _.last(data.args);

        if (this._whoisNick == nick) {
            return this._whoisAway({
                nick: nick,
                message: message
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

    irc_RPL_CHANNELMODEIS: function(data) {
        var channel = data.args[1];
        var modes = data.args.slice(2);

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
