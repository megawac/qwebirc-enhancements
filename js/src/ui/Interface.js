
ui.Interface = new Class({
    Implements: [Options, Events],
    options: {
        node: false,//use the node implementation with socket.io
        debug: false,

        appTitle: ""/*Quake Net Web IRC*/,
        networkName: "" /* Quake Net */,
        networkServices: [],//registered hosts to treat as a server admin

        initialNickname: "",
        minRejoinTime: [5, 20, 300], //array - secs between consecutive joins to a single channel - see js/src/irc/ircclient@canjoinchan

        validators: {//test is a helper from ircutils
            nick: [{
                test: test(/^[\s\S]{1,9}$/),//max 9 by spec some servers implement different rules
                description: "Nick must be between 1 and 9 characters"
            }],
            password: [{
                test: function(pass, $ele) {
                    return pass.length > 0 || !$ele.isVisible();
                },
                description: "Missing password"
            }],
            username: [{
                test: function(pass, $ele) {
                    return pass.length > 0 || !$ele.isVisible();
                },
                description: "Missing username"
            }]
        },

        hue: null,
        saturation: null,
        lightness: null,

        theme: undefined,
        uiOptionsArg: null,

        socketio: "//cdnjs.cloudflare.com/ajax/libs/socket.io/0.9.16/socket.io.min.js",

        loginRegex: /I recogni[sz]e you\./
    },
    clients: [],


    //Note removed option args to configure router. May support it later.
    initialize: function(element, UI, options) {
        this.setOptions(options);
        var self = this,
            opts = self.options;

        window.addEvent("domready", function() {
            var ichans = storage.get(cookies.channels) || opts.initialChannels,
                autoConnect = false;

            self.element = document.id(element);

            self.ui = new UI(self.element, new ui.Theme(opts.theme), opts); //unconventional naming scheme

            var usingAutoNick = true; //!$defined(nick);//stupid used out of scope
            if(opts.node) { Asset.javascript(opts.socketio); }

            var details = self.ui.loginBox(opts.initialNickname, ichans, autoConnect, usingAutoNick, opts.networkName);
            //cleans up old properties
            if(storage.get(cookies.newb) !== false) {
                self.welcome();
                storage.set(cookies.newb, false);
            }

            self.ui.addEvent("login:once", function(loginopts) {
                var ircopts = _.extend(Object.subset(opts, ['initialChannels', 'specialUserActions', 'minRejoinTime', 'networkServices', 'loginRegex', 'node']),
                                        loginopts);

                var client = self.IRCClient = new irc.IRCClient(ircopts/*, self.ui*/);
                self.ui.newClient(client);
                client.writeMessages(lang.copyright);
                client.connect();
                client.addEvent("auth", function(data) {
                    self.ui.showNotice({
                        title: 'Authenticated with network!',
                        body: util.format("{nick}: {message}", data)
                    }, true);
                });

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
                window.onunload = client.quit;

                if(!auth.enabled) {
                    self.ui.beep();
                }

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
