var options =  {
    DEBUG: true,

    IRCSERVER: 'irc.gamesurge.net', //irc server adress
    IRCPORT: 6667, //irc servers port

    // OPTION: IDENT
    //        ident to use on irc, possible values include:
    //        - a string, e.g. IDENT = "webchat"
    //        - the literal value IDENT_HEX, this will set the ident to the
    //          a hexadecimal version of the users IP address, e.g
    //          IDENT = "HEX"
    //        - the literal value "NICKNAME", this will use the users
    //          supplied nickname as their ident.
    IDENT: "HEX",

    // OPTION: WEBIRC_MODE
    //         This option controls how the IP/hostname of the connecting
    //         browser will be sent to IRC.
    //
    //         Possible values include:
    //         - the string "webirc", i.e. WEBIRC_MODE = "webirc"
    //           Use WEBIRC type blocks, with a server configuration of
    //           the following style:
    //
    //           cgiirc {
    //             type webirc;
    //             hostname <qwebirc's ip address>;
    //             password <password>;
    //           };
    //
    //           Remember to set the WEBIRC_PASSWORD value to be the
    //           same as <password>.
    //         - the string "cgiirc", i.e. WEBIRC_MODE = "cgiirc"
    //           old style CGIIRC command, set CGIIRC_STRING to be the
    //           command used to set the ip/hostname, and set
    //           WEBIRC_PASSWORD to be the password used in the server's
    //           configuration file.
    //         - the literal value None, i.e. WEBIRC_MODE = false
    //           Send the IP and hostname in the realname field, overrides
    //          the REALNAME option.
    WEBIRC_MODE: false,

    //OPTION: WEBIRC_PASSWORD
    //        Used for WEBIRC_MODE webirc and cgiirc, see WEBIRC_MODE
    //        option documentation.
    WEBIRC_PASSWORD: "fish",

    // OPTION: CGIIRC_STRING
    //         Command sent to IRC server in for cgiirc WEBIRC_MODE.
    //         See WEBIRC_MODE option documentation.
    CGIIRC_STRING: "CGIIRC",

    //whether to use websockets - some servers dont support the protocol. Fallbacks are done through socket.io
    USE_WEBSOCKETS: true, 

    MAX_CONNETIONS: 20, //max connection you can support inf by default
    APP_PORT: process.env.PORT || 8080,
    ROOT: __dirname,

    httpTimeout: 30000 //time in ms before we drop a clients socket
};

var Qwebirc = require('./qwebirc/server.js');

// run server
var server = new Qwebirc(options);
server.start();