
ui.BaseUI = new Class({
    Implements: [Options, Events],
    options: {

    },
    windows: {},
    customWindows: {},
    clients: {},
    windowArray: [],
    clientId: 0,

    initialize: function(parentElement, Window, uiName, options) {
        var self = this;
        self.setOptions(options);

        self.windows[ui.CUSTOM_CLIENT] = this.customWindows;
        self.Window = Window;
        self.parentElement = parentElement;
        parentElement.addClasses("qwebirc", "qwebirc-" + uiName);
        self.commandhistory = new irc.CommandHistory();

        getTemplate("topPane", function(template) {
            self.outerTabs = Element.from(template()).inject(parentElement);
        });
        getTemplate("windowsPane", function(template) {
            self.windowsPanel = Element.from(template()).inject(parentElement);
        });
    },
    newClient: function(client) {
        client.id = this.clientId++;

        var windows = this.windows[client.id] = {};
        this.clients[client.id] = client;
        var win = this.newWindow(client, ui.WINDOW.status, STATUS);
        this.selectWindow(win);

        this.clientEvents(client, windows);

        return win;
    },

    newWindow: function(client, type, name) {
        var win = this.getWindow(client, name);
        if (!$defined(win)) {
            if(util.windowNeedsInput(type)) {
                this.commandhistory.addChannel(name);
            }
            var wId = this.getWindowIdentifier(name);
            var $wrapper = new Element('div.hidden').inject(this.windowsPanel);//for delegation - this is not how i should do it
            win = this.windows[this.getClientId(client)][wId] = new this.Window(this, $wrapper, client, type, name, wId);
            this.windowArray.push(win);
        }

        return win;
    },

    clientEvents: function(client, windows) { // mi gusta xD
        if(! client instanceof irc.IRCClient) return;
        var self = this,
            broadcast_re = /MSG|TOPIC|(CHAN|PRIV)NOTICE/i;

        function formatChans(data) {
            var chans = data.channels;
            return chans && _.isObject(chans) ? _.keys(chans) : Array.from(chans || data.channel);
        }

        function formatData(type, _data) {
            var data = _.extend({
                c: _data.channel || STATUS,
                n: _data.nick,
                m: _data.message,
                h: _data.host,
                t: type,
                type: type
            }, _data);
            data.channel = data.c;
            if (!(self.uiOptions2.get("nick_ov_status"))){
                delete data["@"];
            }
            return data;
        }

        function lineParser(type, data) {
            data = formatData(type, data);
            
            _.each(formatChans(data), function(channel) {
                data.channel = data.c = channel;
                var win = (data.c === ACTIVE) ? self.getActiveWindow() : self.getWindow(client, channel);
                if(!win) return;
                if(_.isArray(data.message)) {
                    _.each(data.message, function(msg) {
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
            channel = data.channel || STATUS;

            win.addLine(data.type, data);

            if(!util.isBaseWindow(data.channel) && broadcast_re.test(type)) {
                var data2 = _.clone(data);
                var brouhaha = self.getWindow(client, BROUHAHA);
                data2.nick = data2.n = util.isChannel(data.c) ? data.n + data.c ://chanmsg
                                                                data.n + ">" + data.c;//pm
                brouhaha.addLine(data.type, data2);
            }
        }

        function updateTopic(type, data) {
            self.getWindow(client, data.channel).updateTopic(data.topic);
            if(!data.initial) {
                data.message = data.topic;
                lineParser("topic", data);
            }
        }

        function joinPart(type, data) {
            if ((data.thisclient && data.type != "PART" && data.type != "QUIT") ||
                    !(self.uiOptions2.get("hide_joinparts")) && !util.isBaseWindow(data.channel)) {
                lineParser(type, data);
            }
        }

        function partKick(type, data) {
            if(data.thisclient) {
                var win = self.getWindow(client, data.channel);
                if(win) win.close();
            } else {
                joinPart(type,data);
            }
        }

        client.addEvents({
            "connect": lineParser,
            "disconnect": lineParser,
            "error": lineParser,
            "info": lineParser,

            "chanAction": lineParser,
            "chanTopic": updateTopic,
            "chanMessage": lineParser,
            "chanNotice": lineParser,
            "chanCTCP": lineParser,

            "userJoined": function(type, data) {
                if(data.thisclient) {
                    var win = self.newWindow(client, ui.WINDOW.channel, data.channel);//this is client scope
                    if(data.select) {
                        win.select();
                    }
                }
                joinPart(data.thisclient ? "ourJoin" : "join", data);
            },

            openWindow: function(type, data) {//create? and select window
                var win = self.getWindow(data.window);
                if(!win) {
                    if(data.type === ui.WINDOW.custom) {
                        win = self[data.window]();
                    } else {
                        win = self.newWindow(client, data.type, data.window);
                    }
                }
                win.select();
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
                self.nickChange(data);
                lineParser(type, data);
            },
            "privNotice": lineParser,

            "query": function(type, data) {//queries
                data = formatData(type, data);
                var win = self.newWindow(client, ui.WINDOW.query, data.channel); //get or create
                if(self.uiOptions2.get("auto_open_pm")) {
                    self.selectWindow(win);
                }
                parser(type, data, win);
            },

            "awayStatus": lineParser,
            "mode": function(type, data) {
                var win = self.getWindow(data.channel);
                if(win) {
                    win.updatePrefix(data);
                }
                lineParser(type, data);
            },
            "serverMessage": lineParser,
            "serverNotice": lineParser,
            "whois": function(type, data) {
                _.each(data.msgs, function(msg) {
                    lineParser(type, _.extend({}, data, msg));
                });
            },
            "wallops": lineParser,
            "raw": function(type, args) {
                lineParser(type, args);
            }
        });
    },

    getClientId: function(client) {
        return client === ui.CUSTOM_CLIENT ? ui.CUSTOM_CLIENT : client.id;
    },
    getWindowIdentifier: function(name) {
        return name.toLowerCase();
    },
    nickChange: util.noop,

    getWindow: function(client, name) {
        // if(_.isNumber(name)) {
        //     return _.findWhere(this.windowArray, {
        //         type: name
        //     });
        // }
        if(_.isString(client)) name = client;
        var wins = this.windows[this.getClientId(client)] || this.customWindows;
        if (_.isObject(wins)) 
            return wins[this.getWindowIdentifier(name)];
    },
    getActiveWindow: function() {
        return this.active;
    },
    getActiveIRCWindow: function(client) {
        if (!this.active || this.active.type == ui.WINDOW.custom) {
            return this.windows[this.getClientId(client)][this.getWindowIdentifier(STATUS)];
        } else {
            return this.active;
        }
    },
    selectWindow: function(win) {
        if(_.isNumber(win))
            win = this.windowArray[win];
        else if(_.isString(win))
            win = this.getWindow(win);
        if(win !== this.active) {
            if (this.active) {
                this.active.deselect();
                this.last = this.active;
            }
            if(!win.active) win.select();
            this.setWindow(win);
            this.updateTitle(win.name + " - " + this.options.appTitle);
        }
        return win;
    },
    setWindow: function(win) {
        this.active = win;
    },
    nextWindow: function(direction, fromWin) {
        var windows = this.windowArray,
            win = _.nextItem(windows, windows.indexOf(fromWin || this.active), direction); //get window from array
        if(win) win.select();

        return win;
    },
    prevWindow: function() {
        this.nextWindow(-1);
    },
    __closed: function(win) {
        var winarr = this.windowArray;
        if (win.active) {
            if(this.last) {//select last active window
                this.last.select();
            }
            else if (winarr.length !== 1) {
                var index = winarr.indexOf(win);
                if(index === -1) {
                    return;
                } else if (index === (winarr.length - 1)) {
                    this.prevWindow();
                } else {
                    this.nextWindow();
                }
            }
        }

        this.commandhistory.removeChannel(win.name);
        this.tabs.disown(win.tab);
        winarr = this.windowArray.erase(win);
        delete this.windows[this.getClientId(win.client)][win.identifier];
    },
/*
      this shouldn't be called by overriding classes!
      they should implement their own!
      some form of user input MUST be received before an
      IRC connection is made, else users are going to get
      tricked into getting themselves glined
    */
    loginBox: function(callback, initialNickname, initialChannels, autoConnect, autoNick, storage) {
        ui.GenericLoginBox(this.parentElement, callback, initialNickname, initialChannels, autoConnect, autoNick, this.options.networkName, storage);
    }
});
