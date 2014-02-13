/**
 * This babe tracks users and some user information on each channel ya subscribe to
 *
 * @depends ../util/constants.js
 * @depends ../util/utils.js
 */
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
        if (nickchan) {
            return nickchan[this.toIRCLower(channel)];
        }
    },

    addNickToChannel: function(nick, channel) {
        var nc = irc.nickChanEntry();

        if(nick) {
            var nickchan = this.getOrCreateNick(nick);
            var chan = this.getOrCreateChannel(channel);

            nickchan[this.toIRCLower(channel)] = nc;
            chan[nick] = nc;
        }

        return nc;
    },

    removeNick: function(nick) {
        var self = this;
        var nickchan = self.nicknames[nick];
        if (nickchan){
            _.each(nickchan, function(data, chan) {
                var lchannel = self.toIRCLower(chan);
                var channel = self.channels[lchannel];
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
        var lchannel = self.toIRCLower(channel);
        var chan = self.channels[lchannel];
        if (chan) {
            _.keys(chan).each(function(nick) {
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
        var self = this;
        var nicklist = self.nicknames;
        var nickchans = nicklist[oldnick];
        if (!nickchans){
            return;
        }

        _.keys(nickchans).each(function(chan) {
            var channel = self.getChannel(chan);
            if(channel) {
                channel[newnick] = channel[oldnick];
                delete channel[oldnick];
            }
        });

        nicklist[newnick] = nicklist[oldnick];
        delete nicklist[oldnick];
    },

    updateLastSpoke: function(nick, time) {
        var nc = this.getNick(nick);
        if (nc != null) {
            nc.lastSpoke = time || Date.now();
        }
    },

    getSortedByLastSpoke: function(channel) {
        return _.sortBy(_.values(this.getChannel(channel)), function(nick) {
            return -nick.lastSpoke;//reverse
        });
    },

    getSortedNicksForChannel: function(channel, sorter) {
        var nickHash = channel ? this.getChannel(channel) : _.extend({}, this.nicknames, this.getChannel("brouhaha"));//all - should I merge with getChanenl("brouhaha") to keep prefixes on brouhaha?
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
