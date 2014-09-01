/**
 * Rewrite and simplification of the AJAX connection
 * Inspired by the upcoming websocket upgrades (http://hg.qwebirc.org/qwebirc/commits/b6c505fde3707943d3a3b05009ea28051716c808, https://github.com/ariscop/iris/commit/daa52ccefdb41d800959616b775ba6d2d1dee4c4)
 * URIs = dict(p=push, n=newConnection, s=subscribe)
 *
 * @depends [util/ircprocessor]
 * @depends [util/lang, util/utils]
 * @provides [irc/Connection]
 */
var serverPasswordFormat = "<%= config.qwebirc_config.password_format %>" || "{username} {password}";
irc.Connection = new Class({
    Implements: [Events, Options],

    options: {
        nickname: "",
        username: "",
        password: null,
        auth: false,

        retryInterval: 5000,
        retryIntervalScalar: 1.5, //retry after first attempt will be retryInterval * scalar
        maxRetries: 6 //retry for 30 secs
    },
    connected: false,
    password_format: "",

    initialize: function(options) {
        this.setOptions(options);
        this.cacheAvoidance = util.randHexString(16);
    },

    connect: function() {
        var self = this;
        self._connect();
        self.newRequest("n")
        .send({
            data: Object.filter({ //remove empty strings (e.g. if password isn't given)
                nick: self.options.nickname,
                password: self.options.auth ? util.format(serverPasswordFormat, self.options) : ""
            }, String.trim)
        })
        .then(function(stream) {
            self.sessionid = stream[1];
            self.subscribe();
        }, function(stream) { //couldnt connect
            if (qwebirc.DEBUG) console.error("Connection failed: ", stream);
            self.connected = false;
            self.fireEvent("connectionFail", lang.connectionFail);
        });

        return self;
    },

    disconnect: function(data) {
        this.connected = false;
        this.fireEvent("disconnect", data);
        this._sendQueue.empty();
        //cancel all active requests
        this._activeRequests.invoke("cancel").empty();
    },

    reconnect: function() {
        this._connect();
        this.fireEvent("reconnect")
            .subscribe();
    },

    _connect: function() { //connect init
        this.connected = true;
        this.retryInterval = this.options.retryInterval;
        this.retries = 0;
    },

    _sendQueue: [],
    send: function(message, synchronous) {
        if (synchronous) {
            this._send(message);
            return this;
        }
        this._sendQueue.push(message);
        this._processQueue(message);

        return this;
    },

    //creates a push request, sends it, then returns it
    _send: function(message, sync) {
        return this.newRequest("p", sync)
        .send({
            data: {
                s: this.sessionid,
                c: message
            }
        });
    },

    //Enqueue a dependent async request
    _processQueue: function() {
        var self = this, nextMessage;
        if (self._sending || self._sendQueue.length === 0) return;

        nextMessage = self._sendQueue.shift();

        //send the message
        self._send(nextMessage)
        .then(function() { //success
            self._sending = false;
            self._processQueue();
        }, function() { //error
            self.fireEvent("sendFail", {
                message: nextMessage
            });
            self._sending = false;
            self._processQueue();
        });
    },

    // set up a IRC subscription request
    subscribe: function() {
        var self = this;
        var request = self.newRequest("s");

        request
        .send("s=" + self.sessionid)
        .then(function(payload) {
            if(payload) self.processData(payload);
            self.subscribe();
        }, function(stream) { //errored out what do
            console.warn("Recieve error:", stream);
        });

        return request;
    },

    counter: 0,
    _activeRequests: [],
    newRequest: function(url, synchronous) {
        if (!this.connected) throw "Clients been disconnected";
        if(qwebirc.DEBUG && synchronous) console.log("Warning: sending synchronous command to", url);
        var self = this;
        var request = new Request.JSON({
            url: qwebirc.global.dynamicBaseURL + "e/" + url + "?r=" + self.cacheAvoidance + "&t=" + self.counter++,
            async: !synchronous,
            encoding: ""//let server assume utf-8
        });

        // try to minimise the amount of headers
        request.headers = {};
        //not sure if this is necessary
        if (Browser.ie && Browser.version < 8) {
            request.setHeader("If-Modified-Since", "Sat, 01 Jan 2000 00:00:00 GMT");
        }

        self._activeRequests.push(request);
        request.addEvent("complete", function() {
            self._activeRequests.erase(request);
        });

        return request;
    },

    processData: function(payload) {
        var self = this;
        if (payload[0] === false) { //Qwebirc server -> client level error
            this.fireEvent("error", payload[1]);
            return self.lostConnection(lang.connError, payload);
        }
        payload.each(function(data) {
            var type = data[0];
            if      (type === "connect")    self.fireEvent("connect", data);
            else if (type === "disconnect") self.disconnect(data);
            else if (type === "c")          self.fireEvent("recv", util.parseIRCMessage(data));
            else if (qwebirc.DEBUG)         console.warn("Unexpected type " + type, data);
        });
    },

    lostConnection: function(/*reason*/) {
        this.connected = false;
        if (this.retries < this.options.maxRetries) this.retry.delay(this.retryInterval, this);
        else this.disconnect();
    },

    retry: function() {
        this.retryInterval *= this.options.retryIntervalScalar;
        this.retries += 1;

        this.connected = true; //gonna fake it to make it
        this.subscribe()
        .then(function() { //Reconnected!!!
            this.reconnect();
        });
        this.connected = false;
    }
});
