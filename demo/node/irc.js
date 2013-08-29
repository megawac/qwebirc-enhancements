
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

exports.Client = Client;
var net  = require('net');
var util = require('util');
var tls  = require('tls');

// var colors = require('./colors');
// exports.colors = colors;

// var replyFor = require('./codes');

function Client(server, nick, opt) {
    var self = this;
    self.opt = {
        server: server,
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
    
    // Features supported by the server
    // (initial values are RFC 1459 defaults. Zeros signify
    // no default or unlimited value)
    self.supported = {
        channel: {
            idlength: [],
            length: 200,
            limit: [],
            modes: { a: '', b: '', c: '', d: ''},
            types: self.opt.channelPrefixes
        },
        kicklength: 0,
        maxlist: [],
        maxtargets: [],
        modes: 3,
        nicklength: 9,
        topiclength: 0,
        usermodes: ''
    };

    if (typeof arguments[2] == 'object') {
        var keys = Object.keys(self.opt);
        for (var i = 0; i < keys.length; i++) {
            var k = keys[i];
            if (arguments[2][k] !== undefined)
                self.opt[k] = arguments[2][k];
        }
    }

    if (self.opt.floodProtection) {
        self.activateFloodProtection();
    }

    // TODO - fail if nick or server missing
    // TODO - fail if username has a space in it
    if (self.opt.autoConnect === true) {
      self.connect();
    }

    process.EventEmitter.call(this);
}

util.inherits(Client, process.EventEmitter);

Client.prototype.conn = null;
Client.prototype.connect = function ( retryCount, callback ) { // {{{
    if ( typeof(retryCount) === 'function' ) {
        callback = retryCount;
        retryCount = undefined;
    }
    retryCount = retryCount || 0;
    if (typeof(callback) === 'function') {
      this.once('registered', callback);
    }
    var self = this;
    self.chans = {};
    // try to connect to the server
    if (self.opt.secure) {
        var creds = self.opt.secure;
        if (typeof self.opt.secure !== 'object') {
            creds = {};
        }

        self.conn = tls.connect(self.opt.port, self.opt.server, creds, function() {
           // callback called only after successful socket connection
           self.conn.connected = true;
           if (self.conn.authorized ||
                (self.opt.selfSigned &&
                   (self.conn.authorizationError === 'DEPTH_ZERO_SELF_SIGNED_CERT' ||
                      self.conn.authorizationError === 'UNABLE_TO_VERIFY_LEAF_SIGNATURE')) ||
                (self.opt.certExpired &&
                   self.conn.authorizationError === 'CERT_HAS_EXPIRED')) {
              // authorization successful
              self.conn.setEncoding('utf-8');
                if ( self.opt.certExpired &&
                   self.conn.authorizationError === 'CERT_HAS_EXPIRED' ) {
                     util.log('Connecting to server with expired certificate');
                }
                if ( self.opt.password !==  null ) {
                    self.send( "PASS", self.opt.password );
                }
                util.log('Sending irc NICK/USER');
                self.send("NICK", self.opt.nick);
                self.nick = self.opt.nick;
                self.send("USER", self.opt.userName, 8, "*", self.opt.realName);
                self.emit("connect");
           } else {
              // authorization failed
             util.log(self.conn.authorizationError);
           }
        });
    }else {
        self.conn = net.createConnection(self.opt.port, self.opt.server);
    }
    self.conn.requestedDisconnect = false;
    self.conn.setTimeout(0);
    self.conn.setEncoding('utf8');
    self.conn.addListener("connect", function () {
        if ( self.opt.password !==  null ) {
            self.send( "PASS", self.opt.password );
        }
        self.send("NICK", self.opt.nick);
        self.nick = self.opt.nick;
        self.send("USER", self.opt.userName, 8, "*", self.opt.realName);
        self.emit("connect");
    });
    var buffer = '';
    self.conn.addListener("data", function (chunk) {
        buffer += chunk;
        var lines = buffer.split("\r\n");
        buffer = lines.pop();
        lines.forEach(function (line) {
            var message = line;//parseMessage(line, self.opt.stripColors);
            try {
                self.emit('raw', message);
            } catch ( err ) {
                if ( !self.conn.requestedDisconnect ) {
                    throw err;
                }
            }
        });
    });
    self.conn.addListener("end", function() {
        if ( self.opt.debug )
            util.log('Connection got "end" event');
    });
    self.conn.addListener("close", function() {
        if ( self.opt.debug )
            util.log('Connection got "close" event');
        if ( self.conn.requestedDisconnect )
            return;
        if ( self.opt.debug )
            util.log('Disconnected: reconnecting');
        if ( self.opt.retryCount !== null && retryCount >= self.opt.retryCount ) {
            if ( self.opt.debug ) {
                util.log( 'Maximum retry count (' + self.opt.retryCount + ') reached. Aborting' );
            }
            self.emit( 'abort', self.opt.retryCount );
            return;
        }

        if ( self.opt.debug ) {
            util.log( 'Waiting ' + self.opt.retryDelay + 'ms before retrying' );
        }
        setTimeout( function() {
            self.connect( retryCount + 1 );
        }, self.opt.retryDelay );
    });
    self.conn.addListener("error", function(exception) {
        self.emit("netError", exception);
    });
}; // }}}
Client.prototype.disconnect = function ( message, callback ) { // {{{
    this.conn.requestedDisconnect = true;
    if (typeof(callback) === 'function') {
      this.conn.once('end', callback);
    }
    this.conn.end();
}; // }}}
Client.prototype.send = function(command, formatted) { // {{{
    var args = Array.prototype.slice.call(arguments);

    // Note that the command arg is included in the args array as the first element

    if (formatted !== true && (args[args.length-1].match(/\s/) || args[args.length-1].match(/^:/) || args[args.length-1] === "") ) {
        args[args.length-1] = ":" + args[args.length-1];
    }

    if ( this.opt.debug )
        util.log('SEND: ' + args.join(" "));

    if ( ! this.conn.requestedDisconnect ) {
        this.conn.write(args.join(" ") + "\r\n");
    }
}; // }}}
Client.prototype.activateFloodProtection = function(interval) { // {{{

    var cmdQueue = [],
        safeInterval = interval || this.opt.floodProtectionDelay,
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

