
irc.IRCTracker = new Class({
    channels: {},
    nicknames: {},
    initialize: function(owner) {
        this.owner = owner;
    },

    toIRCLower: function(value) {
        /* proxied because the method can change after we connect */

        return this.owner.toIRCLower(value);
    },

    getNick: function(nick) {
        return this.nicknames[nick];
    },

    getOrCreateNick: function(nick) {
        return this.getNick(nick) || (this.nicknames[nick] = {});
    },

    getChannel: function(channel) {
        return this.channels[this.toIRCLower(channel)];
    },

    getOrCreateChannel: function(channel) {
        return this.getChannel(channel) || (this.channels[this.toIRCLower(channel)] = {});
    },

    getOrCreateNickOnChannel: function(nick, channel) {
        var nc = this.getOrCreateNick(nick);

        return nc[this.toIRCLower(channel)] || this.addNickToChannel(nc, channel);
    },

    getNickOnChannel: function(nick, channel) {
        var nickchan = this.getNick(nick);
        if (!nickchan) {
            return;
        } else {
            return nickchan[this.toIRCLower(channel)];
        }
    },

    addNickToChannel: function(nick, channel) {
        var nc = irc.nickChanEntry();

        var nickchan = this.getOrCreateNick(nick);
        nickchan[this.toIRCLower(channel)] = nc;

        var chan = this.getOrCreateChannel(channel);
        chan[nick] = nc;

        return nc;
    },

    removeNick: function(nick) {
        var nickchan = this.getNick(nick);
        if (nickchan){
            _.each(nickchan, function(data, chan) {
                var lchannel = this.toIRCLower(chan),
                    channel = this.channels[lchannel];

                delete channel[nick];
                if (_.isEmpty(channel)) {
                    delete this.channels[lchannel];
                }
            }, this);
            delete this.nicknames[nick];
        }
    },

    removeChannel: function(channel) {
        var chan = this.getChannel(channel);
        if (chan) {
            var lchannel = this.toIRCLower(channel);
            _.each(_.keys(chan), function(nick) {
                var nc = this.nicknames[nick];
                delete nc[lchannel];
                if (_.isEmpty(nc)) { //in no more channels
                    delete this.nicknames[nick];
                }
            }, this);
            delete this.channels[lchannel];
        }
    },

    removeNickFromChannel: function(nick, channel) {
        var lchannel = this.toIRCLower(channel);

        var nickchan = this.getNick(nick);
        var chan = this.getChannel(lchannel);
        if (!nickchan || !chan) return;

        delete nickchan[lchannel];
        delete chan[nick];

        if (_.isEmpty(nickchan)) {
            delete this.nicknames[nick];
        }
        if (_.isEmpty(chan)) {
            delete this.channels[lchannel];
        }
    },

    renameNick: function(oldnick, newnick) {
        var nickchans = this.getNick(oldnick);
        if (!nickchans)
            return;

        _.each(_.keys(nickchans), function(channel) {
            var lchannel = this.toIRCLower(channel);
            this.channels[lchannel][newnick] = this.channels[lchannel][oldnick];
            delete this.channels[lchannel][oldnick];
        }, this);

        this.nicknames[newnick] = this.nicknames[oldnick];
        delete this.nicknames[oldnick];
    },

    updateLastSpoke: function(nick, channel, time) {
        var nc = this.getNickOnChannel(nick, channel);
        if ($defined(nc)) {
            nc.lastSpoke = time;
        }
    },

    getSortedByLastSpoke: function(channel) {
        var nickHash = this.getChannel(channel);
        if (!nickHash) return;

        return _.chain(nickHash)
                .values()
                .sortBy(function(nick) {
                    return -nick.lastSpoke;//reverse
                })
                .value();
    },

    getSortedNicksForChannel: function(channel, sorter) {
        var nickHash = this.getChannel(channel);
        if(_.isEmpty(nickHash)) return [];
        if(!sorter) {
            //sorts nicks by status > lexigraphy
            //then add the prefix in front of the name
            sorter = util.nickChanComparitor(this.owner, nickHash);
        }
        return _.keys(nickHash).sort(sorter).map(function(nick, index) {
            return {
                prefix: nickHash[nick].prefixes,
                nick: nick,
                index: index//in array
            };
        });
    }
});
