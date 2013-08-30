/*
    irc.js - Node JS IRC client library

    (C) Copyright Martyn Smith 2010

    This library is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This library is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this library.  If not, see <http://www.gnu.org/licenses/>.
*/

var net = require('net');
var util = require('util');
var tls = require('tls');
var _ = require('underscore');

var DEFAULT_OPTIONS = {
    server: '',
    nickname: null,
    password: null,
    username: null,
    realname: "a",
    port: 6667,
    debug: false,
    showErrors: false,
    autoRejoin: true,
    autoConnect: true,
    channels: [],
    retryCount: 0,
    retryDelay: 2000,
    secure: false,
    selfSigned: false,
    certExpired: false,
    floodProtection: false,
    floodProtectionDelay: 1000,
    stripColors: false,
    channelPrefixes: "&#",
    messageSplit: 512
};

function Client(server, opts) {
    var self = this;
    var options = self.options = _.extend({}, DEFAULT_OPTIONS, opts);
    options.server = server;//client cant touch server for now

    if (options.floodProtection) {
        self.activateFloodProtection();
    }

    // TODO - fail if nick or server missing
    // TODO - fail if username has a space in it
    if (options.autoConnect === true) {
        self.connect();
    }

    process.EventEmitter.call(self);
}

util.inherits(Client, process.EventEmitter);

Client.setDefaults = function(opts) {
    _.extend(DEFAULT_OPTIONS, opts);
};

Client.prototype.conn = null;
Client.prototype.connect = function(retryCount, callback) { // {{{
    if (_.isFunction(retryCount)) {
        callback = retryCount;
        retryCount = null;
    }
    retryCount = retryCount || 0;
    if (_.isFunction(callback)) {
        this.once('registered', callback);
    }
    var self = this;
    var options = self.options;

    function connect() {
        if (options.password !== null) {
            self.send(util.format("PASS %s", options.password));
        }
        util.log('Sending irc NICK/USER');
        self.send(util.format("NICK %s", options.nickname));
        self.send(util.format("USER %s %d %s :%s", options.username, 8, "*", options.realname));
        self.emit("connect");
    }
    // try to connect to the server
    console.log("Secure connection: %s", options.secure);
    if (options.secure) {
        var creds = _.isObject(options.secure) ? options.secure : {};

        self.conn = tls.connect(options.port, options.server, creds, function() {
            // callback called only after successful socket connection
            self.conn.connected = true;
            if (self.conn.authorized || (options.selfSigned && (self.conn.authorizationError === 'DEPTH_ZERO_SELF_SIGNED_CERT' || self.conn.authorizationError === 'UNABLE_TO_VERIFY_LEAF_SIGNATURE')) || (options.certExpired && self.conn.authorizationError === 'CERT_HAS_EXPIRED')) {
                // authorization successful
                self.conn.setEncoding('utf-8');
                connect();
            } else {
                // authorization failed
                util.log(self.conn.authorizationError);
            }
        });
    } else {
        console.log("Connecting to %s:%d", options.server, options.port);
        self.conn = net.createConnection(options.port, options.server);
    }
    self.conn.requestedDisconnect = false;
    self.conn.setTimeout(0);
    self.conn.setEncoding('utf8');
    self.conn.addListener("connect", connect);
    var buffer = '';
    self.conn.addListener("data", function(chunk) {
        buffer += chunk;
        var lines = buffer.split("\r\n");
        buffer = lines.pop();
        lines.forEach(function(line) {
            var message = line; //parseMessage(line, options.stripColors);
            try {
                self.emit('raw', message);
            } catch (err) {
                if (!self.conn.requestedDisconnect) {
                    throw err;
                }
            }
        });
    });
    self.conn.addListener("end", function() {
        if (options.debug) util.log('Connection got "end" event');
    });
    self.conn.addListener("close", function() {
        if (options.debug) util.log('Connection got "close" event');
        if (self.conn.requestedDisconnect) return;
        if (options.debug) util.log('Disconnected: reconnecting');
        if (options.retryCount !== null && retryCount >= options.retryCount) {
            if (options.debug) {
                util.log('Maximum retry count (' + options.retryCount + ') reached. Aborting');
            }
            self.emit('abort', options.retryCount);
            return;
        }

        if (options.debug) {
            util.log('Waiting ' + options.retryDelay + 'ms before retrying');
        }
        setTimeout(function() {
            self.connect(retryCount + 1);
        }, options.retryDelay);

        self.emit("close");
    });
    self.conn.addListener("error", function(exception) {
        self.emit("netError", exception);
    });
}; // }}}
Client.prototype.disconnect = function(message, callback) { // {{{
    this.conn.requestedDisconnect = true;
    if (_.isFunction(callback)) {
        this.conn.once('end', callback);
    }
    this.conn.end();
}; // }}}
Client.prototype.quit = function(message) {
    this.send(util.format("QUIT :%s", message || "Leaving"));
    this.disconnect();
};
Client.prototype.send = function(command) {

    if (this.options.debug) util.log('SEND: ' + command);

    if (!this.conn.requestedDisconnect) {
        console.log("SENDING: " + command);
        this.conn.write(command + "\r\n");
    }
}; // }}}
Client.prototype.activateFloodProtection = function(interval) { // {{{
    var cmdQueue = [],
        safeInterval = interval || this.options.floodProtectionDelay,
        self = this,
        origSend = this.send,
        dequeue;

    // Wrapper for the original function. Just put everything to on central
    // queue.
    this.send = function() {
        cmdQueue.push(arguments);
    };

    dequeue = function() {
        var args = cmdQueue.shift();
        if (args) {
            origSend.apply(self, args);
        }
    };

    // Slowly unpack the queue without flooding.
    setInterval(dequeue, safeInterval);
    dequeue();

}; // }}}

exports.Client = Client;