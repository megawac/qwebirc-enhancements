
irc.NodeConnection = new Class({
    Implements: [Options, Events],
    Binds: ["recv", "error", "_connected", "_disconnected"],
    options: {
        socket: {
            url: document.location.hostname
        },
        nickname: "ircconnX",
        password: '',
        serverPassword: null,
        autoConnect: true,
        autoRejoin: false,
        debug: true,
        floodProtection: false,
        /*server: xxx,
        nick: nick,
        password: null,
        userName: 'nodebot',
        realName: 'nodeJS IRC client',
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
        retryInterval: 5000,
        retryScalar: 2
    },
    connected: false,

    initialize: function(options) {
        var self = this;
        self.setOptions(options);
        var ip = util.formatter("{url}", self.options.socket);
        var socket = self.socket = io.connect(ip);
        var $evts = {
            "raw": self.recv,
            "echo": _.log,
            "connected": self._connected,
            "disconnect": self._disconnected,
            "max_connections": function() {
                new ui.Alert({
                    title: 'Maximum connections reached',
                    text: 'Maximum synchronous connections for this server have been reached. If we let you in we may crash/get g-lined. Try again later...',
                    onHide: function() {
                        location.reload();
                    }
                });
            },
            "terminated": function(message) {
                alert(message);
            },
            // "connected": _.log,
            "error": self.error
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

    //irc connection on server in
    _connected: function() {
        this.connected = true;
        this.fireEvent("connected");
        this.__retry = this.options.retryInterval;
    },

    disconnect: function() {
        this.socket.emit("quit");
        this.socket.disconnect();
    },

    _disconnected: function() {
        this.connected = false;
        this.autoretry();
    },

    recv: function(data) {
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

    error: function() {
        console.error(arguments);
        this.fireEvent("error");
    },

    autoretry: function() {
        if(this.connected) {return;}
        var next = this.__retry *= this.options.retryScalar;
        this.fireEvent("retry", {
            next: next
        });
        this.socket.emit("retry", "please");
        return _.delay(this.autoretry, next, this);
    }
});
