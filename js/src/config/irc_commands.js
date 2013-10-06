
//commands are substituted by util.formatter. Please make sure they are the correct command for your server
//eg : https://www.quakenet.org/help/q-commands
config.IRC_COMMANDS = { //maybe make these templates?
    "ACTION": {
        command: "PRIVMSG {target} :\x01ACTION {text}\x01"
    },
    "CTCP": {
        command: "PRIVMSG {target} :\x01{type} {text} \x01"
    },
    "PRIVMSG": {
        command: "PRIVMSG {target} :{message}"
    },
    "JOIN": {
        command: "JOIN {channel} {args}"
    },
    "NICK": {
        command: "NICK {nick}"
    },
    "PART": {
        command: "PART {channel} :{message}"
    },
    "QUIT": {
        command: "QUIT :{message}"
    },
    "TOPIC": {
        command: "TOPIC {channel} :{topic}"
    },
    "AWAY": {
        command: "AWAY :{message}"
    },
    "NOTICE": {
        command: "NOTICE {target} :{message}"
    },
    "MODE": {
        command: "MODE {target} {mode} {args}"
    },
    "AUTH": {
        command: "AUTHSERV AUTH {username} {password}"
    },
    "KICK": {
        command: "KICK {channel} {kickee} :{message}"
    }
};

config.COMMAND_ALIAS = {
    "J": "JOIN",
    "P": "PART",
    "MESSAGE": "PRIVMSG",
    "M": "PRIVMSG",
    "MSG": "PRIVMSG",
    "PM": "PRIVMSG",
    "Q": "QUERY",
    "BACK": "AWAY",
    "PRIVACY": "PRIVACYPOLICY",
    "HOP": "CYCLE",
    "SLAP": "ME"
};