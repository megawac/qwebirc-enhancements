/**
 * Twisted IRCConnection Class... Still needs simplification
 * uris = dict(p=push, n=newConnection, s=subscribe)
 *
 * @depends [util/ircprocessor]
 * @depends [util/lang, util/utils, components/Alert]   --dirty alerts I didnt feel like propogating
 * @provides [irc/Connection]
 */
(function() {
    //http://blog.mibbit.com/?p=143
    // moved browser specific headers to be removed here so it doesnt have to be computed each connection.
    // header nullables are browser dependent
    var killBit = "";
    var killHeaders = {//http://www.w3.org/TR/XMLHttpRequest/#dom-xmlhttprequest-setrequestheader
        // "User-Agent": killBit,
        "Accept": killBit,
        "Accept-Language": killBit
        /*,
        "Content-Type": "M"*/
    };

    irc.Connection = new Class({
        Implements: [Events, Options],
        Binds: ["send"],
        options: {
            nickname: "",
            minTimeout: 45000,
            maxTimeout: 5 * 60000,
            timeoutIncrement: 10000,
            initialTimeout: 65000,
            floodInterval: 200,
            floodMax: 10,
            floodReset: 5000,
            errorAlert: true,
            maxRetries: 5,
            serverPassword: null
        },
        connected: false,
        counter: 0,

        __sendQueue: [],
        __lastActiveRequest: null,
        __activeRequest: null,
        __sendQueueActive: false,

        __floodLastRequest: 0,
        __retryAttempts: 0,
        __floodCounter: 0,
        __floodLastFlood: 0,
        __timeoutId: null,


        initialize: function(options) {
            this.setOptions(options);
            this.__timeout = this.options.initialTimeout;
            this.cacheAvoidance = util.randHexString(16);
        },

        connect: function() {
            var self = this;
            self.connected = true;

            self.newRequest("n")
                .addEvent("complete", function(stream) {
                    if (!stream) {
                        self.lostConnection(lang.connFail);
                        return;
                    } else if (!stream[0]) {
                        self.disconnect();
                        self.lostConnection(lang.connError, stream);
                        return;
                    }
                    self.sessionid = stream[1];
                    self.recv();
                }).send({
                    data: {
                        nick: self.options.nickname,
                        password: self.options.serverPassword
                    }
                });
        },

        disconnect: function() {
            this.connected = false;
            this.__cancelTimeout();
            this.__cancelRequests();
        },

        newRequest: function(url, floodProtection, synchronous, unmanaged) {
            var self = this;
            //check if request should proceed
            if (!self.connected) {
                return null;
            } else if (floodProtection && self.__isFlooding()) {
                self.disconnect();
                self.__error(lang.uncontrolledFlood);
            }
            var request = new Request.JSON({
                url: qwebirc.global.dynamicBaseURL + "e/" + url + "?r=" + self.cacheAvoidance + "&t=" + self.counter++,
                async: !synchronous,
                encoding: ""//let server assume utf-8
            });

            // try to minimise the amount of headers 
            request.headers = {};//{X-Requested-With: "XMLHttpRequest", Accept: "application/json", X-Request: "JSON"}
            
            if(!unmanaged) {
                request.addEvent("request", function() {
                    Object.each(killHeaders, function(val, key) {
                        try {
                            request.xhr.setRequestHeader(key, val);
                        } catch (o_O) {
                            delete killHeaders[key];//cant set header on this browser
                        }
                    });
                });
            }

            if (Browser.ie && Browser.version < 8) {
                request.setHeader("If-Modified-Since", "Sat, 01 Jan 2000 00:00:00 GMT");
            }
            return request;
        },

        recv: function() {
            var self = this;
            var request = self.newRequest("s", true);
            if (request == null) {
                return;
            }
            self.__activeRequest = request;
            request.__replaced = false;
            var onComplete = function(stream) {
                // replaced requests... 
                if (request.__replaced) {
                    self.__lastActiveRequest = null;
                    if (stream) {
                        self.__processData(stream);
                    }
                    return;
                }
                // the main request 
                self.__activeRequest = null;
                self.__cancelTimeout();
                if (!stream) {
                    if (self.connected && self.__checkRetries()) {
                        self.recv();
                    }
                    return;
                } else if (self.__processData(stream)) {
                    self.recv();
                }
            };
            request.addEvent("complete", onComplete);
            self.__scheduleTimeout();
            request.send("s=" + self.sessionid);//wish this could be omitted
        },

        send: function(data, synchronous) {
            if (!this.connected) {
                return false;
            }
            if (synchronous) {
                this.__send(data, false);
            } else {
                this.__sendQueue.push(data);
                this.__processSendQueue();
            }
            return true;
        },

        //send without queueing or waiting for response
        sendUnqueued: function(data, async) {
            this.newRequest("p", false, !!async, true)
                .send({
                    data: {
                        s: this.sessionid,
                        c: data
                    }
                });
        },

        __processSendQueue: function() {
            if (this.__sendQueueActive || this.__sendQueue.length === 0) {
                return;
            }
            this.sendQueueActive = true;
            this.__send(this.__sendQueue.shift(), true);
        },

        __send: function(data, async) {
            var request = this.newRequest("p", false, !async);
            if (request == null) {
                return;
            }
            request.addEvent("complete", this.__completeRequest.bind(this, async))
                .send({
                    data: {
                        s: this.sessionid,
                        c: data
                    }
                });
        },

        __completeRequest: function(async, stream) {
            if (async) {
                this.__sendQueueActive = false;
            }
            if (!stream || (!stream[0])) {
                this.__sendQueue = [];
                if (this.connected) {
                    this.lostConnection(lang.connError, stream);
                }
                return false;
            }
            this.__processSendQueue();
        },

        __isFlooding: function() {
            var t = Date.now(),
                floodt = t - this.__floodLastRequest;
            if (floodt < this.options.floodInterval) {
                if (this.__floodLastFlood !== 0 && (floodt > this.options.floodReset)) {
                    this.__floodCounter = 0;
                }
                this.__floodLastFlood = t;
                if (++this.__floodCounter > this.options.floodMax) {
                    return true;
                }
            }
            this.__floodLastRequest = t;
            return false;
        },

        __checkRetries: function() { /* hmm, something went wrong! */
            if (++this.__retryAttempts > this.options.maxRetries && this.connected) {
                this.disconnect();
                this.__error(lang.connTimeOut, {
                    retryAttempts: this.__retryAttempts
                });
                this.fireEvent("lostConnection", this.__retryAttempts);
                return false;
            }
            var to = this.__timeout - this.options.timeoutIncrement;
            if (to >= this.options.minTimeout) {
                this.__timeout = to;
            }
            return true;
        },

        __cancelRequests: function() {
            if (this.__lastActiveRequest != null) {
                this.__lastActiveRequest.cancel();
                this.__lastActiveRequest = null;
            }
            if (this.__activeRequest != null) {
                this.__activeRequest.cancel();
                this.__activeRequest = null;
            }
        },

        __processData: function(payload) {
            var self = this;
            if (payload[0] === false) {
                if (self.connected) {
                    self.lostConnection(lang.connError, payload);
                }
                return false;
            }

            self.__retryAttempts = 0;
            payload.each(function(data) {
                var type = data[0];

                if      (type === "connect")    self.fireEvent("connect", data);
                else if (type === "disconnect") self.fireEvent("disconnect", data);
                else if (type === "c")          self.fireEvent("recv", util.parseIRCMessage(data));
                else if (DEBUG)                 console.warn("Unexpected type " + type, data);
            });

            return true;
        },


        __scheduleTimeout: function() {
            this.__timeoutId = this.__timeoutEvent.delay(this.__timeout, this);
        },

        __cancelTimeout: function() {
            /* global $clear */
            if (this.__timeoutId != null) {
                $clear(this.__timeoutId);
                this.__timeoutId = null;
            }
        },

        __timeoutEvent: function() {
            this.__timeoutId = null;
            if (this.__activeRequest == null) {
                return;
            } else if (this.__lastActiveRequest) {
                this.__lastActiveRequest.cancel();
            }
            // this.fireEvent("retry", {
            //     duration: this.__timeout
            // });
            this.__activeRequest.__replaced = true;
            this.__lastActiveRequest = this.__activeRequest;
            var to = this.__timeout + this.options.timeoutIncrement;
            if (to <= this.options.maxTimeout) {
                this.__timeout = to;
            }
            this.recv();
        },

        lostConnection: function(/*reason*/) {
            this.connected = false;
            this.fireEvent("lostConnection", this.__retryAttempts);
            this.__error.apply(this, arguments);
        },

        __error: function(message, context) {
            var msg = context ? util.format(message.message, context) : message.message;
            this.fireEvent("error", msg);
            new components.Alert({
                title: lang.connLost,
                text: msg
            });
        }
    });
})();
