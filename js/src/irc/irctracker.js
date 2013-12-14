
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
        if(nick !== ""/* || !/^[\w\/`\-\[\] ]+$/.test(nick)*/) {//sometimes given "" as a nick
            return this.getNick(nick) || (this.nicknames[nick] = {});
        } else {
            return {};
        }
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
        var self = this;
        var nickchan = self.nicknames[nick];
        if (nickchan){
            _.each(nickchan, function(data, chan) {
                var channel = self.getChannel(chan);
                if(channel) {
                    delete channel[nick];
                    if (_.isEmpty(channel)) {
                        delete self.channels[lchannel];
                    }
                }
                
            });
            delete self.nicknames[nick];
        }
    },

    removeChannel: function(channel) {
        var self = this;
        var chan = self.getChannel(channel);
        if (chan) {
            var lchannel = self.toIRCLower(channel);
            _.each(_.keys(chan), function(nick) {
                var nc = self.nicknames[nick];
                delete nc[lchannel];
                if (_.isEmpty(nc)) { //in no more channels
                    delete self.nicknames[nick];
                }
            });
            delete self.channels[lchannel];
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

    updateLastSpoke: function(nick, time) {
        var nc = this.getNick(nick);
        if (nc != null) {
            nc.lastSpoke = time || Date.now();
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
        var nickHash = channel ? this.getChannel(channel) : _.extend({}, this.nicknames, this.getChannel(BROUHAHA));//all - should I merge with getChanenl(BROUHAHA) to keep prefixes on brouhaha?
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
