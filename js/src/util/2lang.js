
(function() {

    var types = {
        ERROR: 0,
        INFO: 1,
        SERVER: 2,
        CHAN: 3,
        MISC: 4,

        MESSAGE: 5
    };

    var message = function(msg, type) {
        return {
            message: msg,
            type: type
        };
    };

    //language specific stuff. right now just an object
    // can either be a message or array of messages
    qwebirc.lang = lang = {
        TYPES: types,
        message: message,

        loginMessages: [message("Hint #1! When you close a channel this one will be deleted from your favorites and won't come back on the next connection.", types.INFO),
                        message("Hint #2! To join a new channel type this command in the chat box: /j #channel", types.INFO)],
        joinAfterAuth: message("Waiting for login before joining channels...", types.INFO),
        authFailed: [message("Could not auth with IRC network - waited 5 seconds.", types.ERROR),
                    message("Otherwise reattempt authing by typing: \"/authserv AUTH <your username> <your password>\"", types.ERROR),
                    message("To ignore the error and join channels, unauthed, type: \"/autojoin\".", types.ERROR)],
        signOn: message("SIGNON", types.SERVER),
        joinChans: message("Joining channels...", types.INFO),
        noTopic: message("(No topic set.)", types.INFO),

        needOp: message("Sorry, you need to be a channel operator to change the topic!", types.ERROR),
        changeTopicConfirm: message("Change topic of {channel} to:", types.MISC),

        poorJoinFormat: message("Channel names begin with # (corrected automatically).", types.INFO),
        waitToJoin: message("You recently tried to join {channel}. To prevent join-flooding, please wait {time} seconds before reattempting or type /fjoin {channel} to ignore this warning...", types.ERROR),
        invalidCommand: message("Can't use this command in this window", types.ERROR),
        invalidChanTarget: message("Can't target a channel with this command.", types.ERROR),
        insufficentArgs: message("Insufficient arguments for command.", types.ERROR),

        invalidNick: message("Your nickname was invalid and has been corrected; please check your altered nickname and press Connect again.", types.ERROR),
        missingNick: message("You must supply a nickname"),
        missingPass: message("You must supply a password.", types.ERROR),
        missingAuthInfo: message("You must supply your username and password in auth mode.", types.ERROR),


        loadingPage: message("Loading . . .", types.INFO),
        submittingPage: message("Submitting . . .", types.INFO),
        fishSlap: message("slaps {nick} with a large fishbot", types.MESSAGE),

        copyright: [message("qwebirc v" + qwebirc.VERSION, types.INFO),
                    message("Copyright (C) 2008-2011 Chris Porter and the qwebirc project.", types.INFO),
                    message("Current version by Emanuel \"megawac\" Jackstare"),
                    message("http://www.qwebirc.org", types.INFO),
                    message("Licensed under the GNU General Public License, Version 2.", types.INFO)],

        activityNotice: message("Activity!", types.MISC),
        partChan: message("Part", types.MESSAGE),
        logOut: message("Logged out", types.MESSAGE),
        quit: message("Page closed", types.MESSAGE),

        uncontrolledFlood: message("ERROR: uncontrolled flood detected -- disconnected.", types.ERROR),
        connError: message("An error occured: {1}", types.ERROR),
        connTimeOut: message("Error: connection closed after {retryAttempts} requests failed.", types.ERROR),
        connectionFail: message("Couldn't connect to remote server.", types.ERROR),

        closeTab: "Close tab",
        detachWindow: "Detach Window"

    };


    lang.IRC_COMMAND_HELPERS = {
        "JOIN": "/JOIN <channel>",
        "NICK": "/NICK <new nickname>",
        "PART": "/PART <channel>",
        "QUIT": "/QUIT <message>",
        "TOPIC": "/TOPIC <channel> <topic>",
        "AWAY": "/AWAY <message>",
        "ME": "/ME <message>",
        "NOTICE": "/NOTICE <message>",
        "MODE": "/MODE <target(chan/user)> <mode>",
        "AUTHSERV": "/AUTHSERV AUTH <account> <password>"
    };

    // lang.DaysOfWeek = [
    //     "Sun",
    //     "Mon",
    //     "Tue",
    //     "Wed",
    //     "Thu",
    //     "Fri",
    //     "Sat"
    // ];

    // lang.MonthsOfYear = [
    //     "Jan",
    //     "Feb",
    //     "Mar",
    //     "Apr",
    //     "May",
    //     "Jun",
    //     "Jul",
    //     "Aug",
    //     "Sep",
    //     "Oct",
    //     "Nov",
    //     "Dec"];


ui.themes.ThemeControlCodeMap2 = {
    "C": "\x03",
    "B": "\x02",
    "U": "\x1F",
    "O": "\x0F",
    "D": "\x00",
    "[": "qwebirc://whois/",
    "]": "/",
    "$": "$"
};

ui.themes.Default2 = {
    "PREFIX": ["{C}4=={O} "],
    "SIGNON": ["Signed on!", true],
    "CONNECT": ["Connected to server.", true],
    "RAW": ["{m}", true],
    "DISCONNECT": ["Disconnected from server: {m}", true],
    "ERROR": ["ERROR: {m}", true],
    "SERVERNOTICE": ["{m}", true],
    "JOIN": ["{D}{N}{D} [{h}] has joined {c}", true],
    "OURJOIN": ["{D}{N}{D} [{h}] has joined {c}", true],
    "PART": ["{D}{N}{D} [{h}] has left {c} [{m}]", true],
    "KICK": ["{D}{v}{D} was kicked from {c} by {D}{N}{D} [{m}]", true],
    "MODE": ["mode/{c} [{m}] by {D}{N}{D}", true],
    "QUIT": ["{D}{N}{D} [{h}] has quit [{m}]", true],
    "NICK": ["{D}{n}{D} has changed nick to {D}{[}{w}{]}{D}", true],
    "TOPIC": ["{D}{N}{D} changed the topic of {c} to: {m}", true],
    "UMODE": ["Usermode change: {m}", true],
    "INVITE": ["{N} invites you to join {c}", true],
    "HILIGHT": ["{C}4"],
    "HILIGHTEND": ["{O}"],
    "CHANMSG": ["<{D}{@}{(}{N}{)}{D}> {m}"],
    "PRIVMSG": ["<{(}{N}{)}> {m}"],
    "CHANNOTICE": ["-{D}{(}{N}{)}{D}:{c}- {m}"],
    "PRIVNOTICE": ["-{(}{N}{)}- {m}"],
    "OURCHANMSG": ["<{@}{N}> {m}"],
    "OURPRIVMSG": ["<{N}> {m}"],
    "OURTARGETEDMSG": ["*{[}{t}{]}* {m}"],
    "OURTARGETEDNOTICE": ["[notice({[}{t}{]})] {m}"],
    "OURCHANNOTICE": ["-{N}:{t}- {m}"],
    "OURPRIVNOTICE": ["-{N}- {m}"],
    "OURCHANACTION": [" * {N} {m}"],
    "OURPRIVACTION": [" * {N} {m}"],
    "CHANACTION": [" * {D}{(}{N}{)}{D} {m}"],
    "PRIVACTION": [" * {(}{N}{)} {m}"],
    "CHANCTCP": ["{N} [{h}] requested CTCP {x} from {c}: {m}"],
    "PRIVCTCP": ["{N} [{h}] requested CTCP {x} from {-}: {m}"],
    "CTCPREPLY": ["CTCP {x} reply from {N}: {m}"],
    "OURCHANCTCP": ["[ctcp({t})] {x} {m}"],
    "OURPRIVCTCP": ["[ctcp({t})] {x} {m}"],
    "OURTARGETEDCTCP": ["[ctcp({t})] {x} {m}"],
    "WHOISUSER": ["{B}{N}{B} [{h}]", true],
    "WHOISREALNAME": [" realname : {m}", true],
    "WHOISCHANNELS": [" channels : {m}", true],
    "WHOISSERVER": [" server   : {x} [{m}]", true],
    "WHOISACCOUNT": [" account  : qwebirc://qwhois/{m}", true],
    "WHOISIDLE": [" idle     : {x} [connected: {m}]", true],
    "WHOISAWAY": [" away     : {m}", true],
    "WHOISOPER": ["          : {B}IRC Operator{B}", true],
    "WHOISOPERNAME": [" operedas : {m}", true],
    "WHOISACTUALLY": [" realhost : {m} [ip: {x}]", true],
    "WHOISGENERICTEXT": ["          : {m}", true],
    "WHOISEND": ["End of WHOIS", true],
    "AWAY": ["{N} is away: {m}", true],
    "GENERICERROR": ["{m}: {t}", true],
    "GENERICMESSAGE": ["{m}", true],
    "WALLOPS": ["WALLOP {n}: {t}", true],
    "CHANNELCREATIONTIME": ["Channel {c} was created at: {m}", true],
    "CHANNELMODEIS": ["Channel modes on {c} are: {m}", true]
};

ui.UI_COMMANDS = [
    ["Options", "options"],
    ["Add webchat to your site", "embedded"],
    ["Privacy policy", "privacy"],
    ["Feedback", "feedback"],
    ["Frequently asked questions", "faq"],
    ["About qwebirc", "about"]
];


})();