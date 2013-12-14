// <% if(pkg.build["node server"]) { %> only include this code if "node server" set in package.json
irc.NodeConnection = new Class({
    Implements: [Options, Events],
    Binds: ["_recv", "_error"],
    options: {
        socket_connect: document.location.hostname,
        nickname: "",
        password: "",
        serverPassword: null,
        autoConnect: true,
        debug: true,
        floodProtection: false,
        /*server: xxx,
        nick: nick,
        password: null,
        userName: "nodebot",
        realName: "nodeJS IRC client",
        port: 6667,
        debug: false,
        showErrors: false,
        autoRejoin: true,
        autoConnect: true,
        channels: [],
        retryCount: null,
        retryDelay: 2000,
        secure: false,
        selfSigned: false,
        certExpired: false,
        floodProtection: false,
        floodProtectionDelay: 1000,
        stripColors: false,
        channelPrefixes: "&#",
        messageSplit: 512*/
        autoretry: true,
        retryInterval: 5000,
        // retryAttempts: 30,//retry for 60 seconds

        clientID: util.randHexString(16)
    },
    connected: false,

    initialize: function(options) {
        var self = this;
        options = self.setOptions(options).options;

        var socket = self.socket = io.connect(options.socket_connect, {
          "reconnect": options.autoretry,
          "reconnection delay": options.retryInterval,
          "max reconnection attempts": options.retryAttempts
        });

        var $evts = {
            "raw": self._recv,

            "connected": function() {
                self.connected = true;
                self.attempts = 0;
                self.fireEvent("connected");
                // this.__retry = this.options.retryInterval;
            },
            "disconnect": function() {
                self.connected = false;
            },
            "reconnect": function() {
                console.log("reconnected");
                self.socket.emit("reconnect", options);
            },
            "reconnecting": function() {
                console.log("reattempt");
                self.fireEvent("retry", {
                    next: options.retryInterval
                });
            },

            "lostConnection": function() {
                self.fireEvent("lostConnection", self.attempts++);
                self.connected = false;
            },
            "abort": function() {
                new ui.Alert({
                    title: "Lost connection to IRC server",
                    text: "Server lost connection to the IRC server"
                });
                self.connected = false;
            },

            "max_connections": function() {
                new ui.Alert({
                    title: "Maximum connections reached",
                    text: "Maximum synchronous connections for this server have been reached. If we let you in we may crash/get g-lined. Try again later...",
                    onHide: function() {
                        location.reload();
                    }
                });
            },
            "echo": _.log,
            "error": self._error
        };

        _.each($evts, function(fn, key) {
            if(fn) {
                socket.on(key, fn);
            }
            else {
                socket.on(key, function() {//pass
                    self.fireEvent(key);
                });
            }
        });

        self.connect();
    },

    connect: function() {
        this.socket.emit("irc", this.options);
    },

    disconnect: function() {
        this.socket.emit("quit");
        this.socket.disconnect();
    },

    _recv: function(data) {
        var processed = util.parseIRCData(data.raw);
        this.fireEvent("recv", processed);
    },

    send: function(data) {
        if(this.connected) {
            this.socket.emit("send", data);
            return true;
        }
        else {
            console.error("disconnected dude");
        }
    },

    _error: function() {
        console.error(arguments);
        this.fireEvent("error", arguments);
    }/*,

    autoretry: function() {
        if(this.connected) {return;}
        var next = this.__retry *= this.options.retryScalar;
        this.fireEvent("retry", {
            next: next
        });
        this.socket.emit("retry", this.options);
        return _.delay(this.autoretry, next, this);
    }*/
});

// <% } %>