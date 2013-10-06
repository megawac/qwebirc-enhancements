var options =  {
    DEBUG: true,
    IRCSERVER: 'irc.gamesurge.net', //irc server adress
    IRCPORT: 6667, //irc servers port
    USE_WEBSOCKETS: true, //whether to use websockets - some servers dont support the protocol. Fallbacks are done through socket.io
    MAX_CONNETIONS: 20, //max connection you can support inf by default
    APP_PORT: process.env.PORT || 8080,
    ROOT: __dirname,

    httpTimeout: 60000 //time in ms before we drop a clients socket
};

var Qwebirc = require('./qwebirc/server.js');

// run server
var server = new Qwebirc(options);
server.start();