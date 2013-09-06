
ui.Interface = new Class({
    Implements: [Options, Events],
    options: {
        node: false,//use the node implementation with socket.io
        debug: false,

        dynamicBaseURL: "/",
        staticBaseURL: "/",
        searchURL: true,

        appTitle: "Freenode.net Web IRC",
        networkName: "Freenode",
        networkServices: [],

        initialNickname: "",
        minRejoinTime: [5, 20, 300], //array - secs between consecutive joins

        hue: null,
        saturation: null,
        lightness: null,

        theme: undefined,
        uiOptionsArg: null,

        sounds: {
            minSoundRepeatInterval: 5000
        },

        icons: {
            empty_favicon: "images/empty_favicon.ico",
            menuicon: "images/icon.png"
        },

        loginRegex: /I recogni[sz]e you\./,
        nickValidation: null
    },
    clients: [],


    //Note removed option args to configure router. May support it later.
    initialize: function(element, UI, options) {
        this.setOptions(options);
        var self = this,
            opts = self.options;

        qwebirc.global = {
            baseURL: opts.dynamicBaseURL,
            staticURL: opts.staticBaseURL,
            nicknameValidator: opts.nickValidation ? new irc.NicknameValidator(opts.nickValidation) : new irc.DummyNicknameValidator()
        };

        opts.specialUserActions = [ //special actions to take when particular users speak
            function(user, msg, target, client) {
                var interested = opts.networkServices.contains(user);
                if(interested) {
                    if(opts.loginRegex.test(msg)) {
                        client.authEvent();
                    }
                    client.getActiveWindow().infoMessage(msg);
                }
                return interested;
            }
        ],

        window.addEvent("domready", function() {
            var inick = opts.initialNickname,
                ichans = storage.get(cookies.channels) || opts.initialChannels,
                autoConnect = false;

            self.element = document.id(element);

            self.ui = new UI(self.element, new ui.Theme(opts.theme), opts); //unconventional naming scheme

            var usingAutoNick = true; //!$defined(nick);//stupid used out of scope
            //if(usingAutoNick && autoConnect) {
            inick = opts.initialNickname;
            //}

            var details = self.ui.loginBox(inick, ichans, autoConnect, usingAutoNick, opts.networkName);
            //cleans up old properties
            if(storage.get(cookies.newb) !== false) {
                self.welcome();
                storage.set(cookies.newb, false);
            }

            self.ui.addEvent("login:once", function(loginopts) {
                var ircopts = _.extend(Object.subset(opts, ['initialChannels', 'specialUserActions', 'minRejoinTime', 'networkServices', 'node']),
                                        loginopts);

                var client = self.IRCClient = new irc.IRCClient(ircopts, self.ui);
                client.connect();


                window.onbeforeunload = function(e) {
                    if (client.isConnected()) {//ie has gotten passed the IRC gate
                        var message = "This action will close all active IRC connections.";
                        if ((e = e || window.event)) {
                            e.returnValue = message;
                        }
                        return message;
                    }
                };
                window.addEvent('unload', client.quit);

                if(!auth.enabled) {
                    self.ui.beep();
                }

                client.addEvent("auth:once", self.ui.beep);

                self.fireEvent("login", {
                    'IRCClient': client,
                    'parent': self
                });
            });
        });
    },
    welcome: function() {
        ui.WelcomePane.show(this.ui, {
            element: this.element,
            firstvisit: true
        });
    }
});
