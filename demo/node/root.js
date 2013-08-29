
var server = 'irc.gamesurge.net:';
var base = './static/qui-enhanced.html';
var port = process.env.PORT || 3000;

var express = require('express');
var app = express();
// compress content
app.use(express.compress());
app.use(express.static(__dirname + '/static', { maxAge: 1 }));
app.listen(port);
console.log("listening to port: " + port);

//#idea: have a idle bot sit and listen to the rooms being chatted in and use socket.io rooms to broadcast to interested clients

var io = require('socket.io').listen(80);
io.sockets.on('connection', function (socket) {
    
    socket.once('irc', function(nick, opts) {//connect to the server
        var timers = {};
        var irc  = require('./irc.js');

        var client = new irc.Client(
            'irc.gamesurge.net',
            nick || 'testaccount',
            opts
        );

        client.addListener('raw', function(message) {
            console.log("emitting " + JSON.stringify(message));
            socket.emit("raw", {
                raw: message
            });
        });

        socket.on("send", function(data) {
            client.send(data, true);
        });

        socket.on("quit", function() {
            client.disconnect();
        });

        socket.on("disconnect", function() {//wait a bit for a reconnect
            timers.quitting = setTimeout(function() {
                client.disconnect();
                delete timers.quitting;
            }, 120 * 1000);
        });

        socket.on("retry", function() {
            if(timers.quitting) {
                socket.emit("connected");
                clearTimeout(timers.quitting);
            }
            else {
                client.connect();
            }
        });

        socket.emit("connected");
    });

});

