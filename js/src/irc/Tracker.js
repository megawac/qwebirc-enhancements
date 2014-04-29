/**
 * This babe tracks users and some user information on each channel ya subscribe to
 *
 * @depends [irc, util/irc]
 * @provides [irc/Tracker]
 */

//models
irc.User = new Class({
    // Extends: [Events],
    nick: "",
    channels: [],
    prefixes: {},
    // lastSpoke: 0,
    initialize: function(user) {
        this.nick = user;
    },
    joinChannel: function(channel, prefix) {
        if (typeof channel === "object") {
            prefix = channel.prefix;
            channel = channel.channel;
        }
        this.prefixes[channel.name] = prefix || "";
        this.channels.include(channel);
        if (!channel.hasUser(this)) {
            channel.addUser(this);
        }
        return this;
    },
    partChannel: function(channel) {
        this.channels.erase(channel);
        if (channel.hasUser(this)) {
            channel.removeUser(this);
        }
        return this;
    },
    hasChannel: function(channel) {
        return this.channels.contains(channel);
    },
    updateNick: function(newnick) {
        this.nick = newnick;
        this.channels.invoke("update");
        return this;
    },
    getPrefix: function(channel) {
        return this.prefixes[channel.name];
    },
    updatePrefix: function(channel, prefixes, event) {
        this.prefixes[channel.name] = prefixes;
        if(event) channel.update();
        return this;
    },
    destroy: function() {
        var channel;
        while ((channel = this.channels.pop())) {
            channel.partChannel(this);
        }
        return this;
    }
});

irc.Channel = new Class({
    Implements: [Events],
    name: "",
    users: [],
    initialize: function(name, prefixes) {
        this.name = name;
        this.prefixes = prefixes; //for sorting
    },
    addUser: function(users) {
        var self = this;
        users = Array.from(users);
        self.users.combine(users);
        users.each(function(user) {
            if (!user.hasChannel(self)) {
                user.joinChannel(self);
            }
        });
        return self.update();
    },
    removeUser: function(user) {
        this.users.erase(user);
        if (user.hasChannel(this)) {
            user.partChannel(this);
        }
        return this.update();
    },
    hasUser: function(user) {
        return this.users.contains(user);
    },
    update: function() {
        return this.fireEvent("update", this.users);
    },
    destroy: function() {
        var user;
        while ((user = this.users.pop())) {
            user.partChannel(this);
        }
        return this.fireEvent("destroy");
    },
    sort: function() {
        var self = this;
        var prefixes = self.prefixes;
        var _prefixNone = prefixes.length;
        function getWeight(prefix) {
            return prefixes.indexOf(prefix);
        }
        function prefixWeight(prefixesOnUser) {
            //only use the most important prefix
            return prefixesOnUser ? _.min(prefixesOnUser, getWeight) : _prefixNone; //not undef/empty
        }
        //compares two nick names by channel status > lexigraphy
        return self.users.sort(function(user1, user2) {
            var p1weight = prefixWeight(user1.getPrefix(self)),
                p2weight = prefixWeight(user2.getPrefix(self));
            return (p1weight !== p2weight) ? (p1weight - p2weight) : user1.nick.toLowerCase().localeCompare(user2.nick.toLowerCase());
        });
    }
});

//Essentially just a MVC Collection...
irc.Tracker = new Class({
    channels: [],
    nicknames: [],
    prefixes: "",

    setPrefixes: function(prefixes) {
        this.prefixes = prefixes;
        return this;
    },

    getNick: function(nick, create) {
        if (nick.constructor === irc.User) return nick;
        var user = _.findWhere(this.nicknames, {
            nick: (typeof nick === "object" ? nick.nick : nick).toLowerCase()
        });
        if (!user && create && nick !== "") {
            user = new irc.User(nick);
            this.nicknames.push(user);
        }
        return user;
    },

    getChannel: function(channel, create) {
        if (channel.constructor === irc.Channel) return channel;
        var chan = _.findWhere(this.channels, {
            name: channel.toLowerCase()
        });
        if (!chan && create && channel !== "") {
            chan = new irc.Channel(channel);
            this.channels.push(chan);
        }
        return chan;
    },

    addNickToChannel: function(nick, channel) {
        var user = _.isArray(nick) ? nick.map(_.partial(this.getNick, _, true), this) : this.getNick(nick, true);
        this.getChannel(channel, true).addUser(user, nick.prefix);
        return this;
    },

    removeNick: function(nick) {
        var user = this.getNick(nick).destroy();
        this.users.erase(user);
        this._clean();
        return this;
    },

    removeChannel: function(channel) {
        var chan = this.getChannel(channel).destroy();
        
        this.channels.erase(chan);
        this._clean();
        return this;
    },

    partChannel: function(nick, channel) {
        var user = this.getNick(nick);
        var chan = this.getChannel(channel);

        chan.removeUser(user);
        this._clean();
        return this;
    },

    renameNick: function(oldnick, newnick) {
        this.getNick(oldnick).renameNick(newnick);
        return this;
    },

    //scheduled disconnect cleaning every once and a while
    _clean: _.throttle(function() {
        var self = this;
        self.users.each(function(user) {
            if (_.isEmpty(user.channels)) {
                self.users.erase(user);
            }
        });
        self.channels.each(function(chan) {
            if (_.isEmpty(chan.users)) {
                self.channels.erase(chan);
            }
        });
    }, 10000)
});
