/**
 * Proxies events from the irc client to the ui
 *
 * @depends [util/lang, util/constants, util/utils, util/uihelpers, ui/IWindows]
 * @provides [ui/IIRCClient]
 */
//expects to be implemented with windowsui
ui.IIRCClient = new Class({
    clients: {},
    clientId: 0,

    newClient: function(client) {
        client.id = this.clientId++;
        this.clients[client.id] = client;

        var windows = this.windows[client.id] = {};
        var win = this.newWindow(client, ui.WINDOW.status, lang.windowNames.status);
        this.selectWindow(win);

        addClientEvents.call(this, client, windows);

        return win;
    },
    nickChange: _.noop
});

function addClientEvents(client/*, windows*/) {
    var ui_ = this;
    var uiOptions = ui_.uiOptions;


    var broadcast_re = /MSG|TOPIC|(CHAN|PRIV)NOTICE/i;
    function formatChans(data) {
        var chans = data.channels;
        if (chans === constants.all) {
            chans = ui_.getWindows(client);
        }
        // don't use _.isObject here (true for arrays)
        return chans && Type.isObject(chans) ? _.keys(chans) : Array.from(chans || data.channel);
    }

    function formatData(type, _data) {
        var data = _.extend({
            c: _data.channel || constants.status,
            n: _data.nick,
            m: _data.message,
            h: _data.host,
            t: type,
            type: type,
            "@": _data.prefix
        }, _data);
        data.channel = data.c;
        if (!(uiOptions.get("nick_ov_status"))){
            delete data["@"];
        }
        return data;
    }

    function lineParser(type, data) {
        data = formatData(type, data);
        
        _.each(formatChans(data), function(channel) {
            data.channel = data.c = channel;
            var win = (data.c === constants.active) ? ui_.getActiveWindow() : ui_.getWindow(client, channel);
            if(!win) return;
            if(_.isArray(data.message)) {
                data.message.each(function(msg) {
                    data.message = data.m = msg;
                    parser(type, data, win);
                });
            }
            else {
                parser(type, data, win);
            }
        });
    }

    function parser(type, data, win, channel) {
        type = data.type || data.t || type;
        channel = data.channel || constants.status;

        win.addLine(data.type, data, data.colourClass);

        if(!util.isBaseWindow(data.channel) && broadcast_re.test(type)) {
            var data2 = _.clone(data);
            var nick = data2.nick;
            if(!util.isChannel(channel)) {//pm
                if(channel === nick) {//so it always shows speaker>target
                    channel = ">" + client.nickname;
                } else {
                    channel = ">" + channel;
                    data2.nick = nick;
                }
            }
            data2.linkedchannel = channel;

            if(uiOptions.get("brouhaha").enabled) ui_.windows.brouhaha.addLine(data2.type, data2, data.colourClass);
        }
    }

    function updateTopic(type, data) {
        ui_.getWindow(client, data.channel).updateTopic(data.topic);
        if(!data.initial) {
            data.message = data.topic;
            lineParser("topic", data);
        }
    }

    function joinPart(type, data) {
        if ((data.thisclient && data.type != "PART" && data.type != "QUIT") ||
                !(uiOptions.get("hide_joinparts"))) {
            data = _.clone(data);
            data.channels = _.reject(formatChans(data),  util.isBaseWindow);
            lineParser(type, data);
        }
    }

    function partKick(type, data) {
        if(data.thisclient) {
            var win = ui_.getWindow(client, data.channel);
            if(win) win.close();
        } else {
            joinPart(type,data);
        }
    }

    function queried(type, data) {//queries and private notices
        data = formatData(type, data);
        var win = ui_.newWindow(client, ui.WINDOW.query, data.channel); //get or create
        if(data.nick === client.nickname || uiOptions.get("auto_open_pm")) {
            ui_.selectWindow(win);
        }
        if(data.message) parser(type, data, win);
    }

    var updateBrouhahaNicklist = _.throttle(function() {//prevent getting spammed
        if(uiOptions.get("brouhaha").enabled) {//update brouhaha nicklist
            ui_.windows.brouhaha.updateNickList(client.tracker.getSortedNicksForChannel());
        }
    }, 100);

    client.addEvents({
        "connect": lineParser,
        // "disconnect": lineParser,
        "error": lineParser,
        "info": lineParser,

        "cantSend": function(type, reason) {
            lineParser("error", {
                message: reason,
                channel: constants.active
            });
        },

        "auth:once": function(data) {
            ui_.beep();
            ui_.showNotice({
                title: lang.authSuccess,
                body: util.format("{nick}: {message}", data)
            }, true);
        },

        "chanAction": lineParser,
        "chanTopic": updateTopic,
        "chanMessage": lineParser,
        "chanNotice": lineParser,
        "chanCTCP": lineParser,

        "userJoined": function(type, data) {
            if(data.thisclient) {
                var win = ui_.newWindow(client, ui.WINDOW.channel, data.channel);//this is client scope
                if(data.select) {
                    win.select();
                }
            }
            joinPart(data.thisclient ? "ourJoin" : "join", data);
        },

        "openWindow": function(type, data) {//create? and select window
            var win = ui_.getWindow(data.window);
            if(!win) {
                if(data.type === ui.WINDOW.custom) {
                    win = ui_[data.window]();
                } else {
                    win = ui_.newWindow(client, data.type, data.window);
                }
            }
            win.select();
        },

        "updateNicklist": function(type, data) {
            var win = ui_.getWindow(client, data.channel);
            if(win) win.updateNickList(data.nicks);
            updateBrouhahaNicklist();
        },

        "away": lineParser,
        "part": partKick,
        "quit": partKick,
        "kick": partKick,
        "invite": lineParser,
        "privAction": lineParser,
        "privCTCP": lineParser,
        "ctcpReply": lineParser,
        "userMode": lineParser,
        "nickChange": function(type, data) {
            ui_.nickChange(data, client);
            lineParser(type, data);
        },

        "privNotice": queried,
        "query": queried,

        "awayStatus": lineParser,
        "mode": function(type, data) {
            var win = ui_.getWindow(client, data.channel);
            if(win) {
                win.updatePrefix(data);
            }
            lineParser(type, data);
        },
        "serverMessage": lineParser,
        "serverNotice": lineParser,
        "whois": function(type, data) {
            _.each(data.msgs, function(msg) {
                lineParser(type, _.extend({c: constants.active}, data, msg));
            });
        },
        "wallops": lineParser,
        "raw": lineParser,

        "clear": function() {
            ui_.getActiveWindow().clear();
        }
    });
}