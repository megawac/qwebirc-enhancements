
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
    _.extend(lang, {
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

        

        loadingPage: "Loading . . .",
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
        disconnected: message("Client has been disconnected", types.INFO),

        uncontrolledFlood: message("ERROR: uncontrolled flood detected -- disconnected.", types.ERROR),
        connError: message("An error occured: {1}", types.ERROR),
        connTimeOut: message("Error: connection closed after {retryAttempts} requests failed.", types.ERROR),
        connectionFail: message("Couldn't connect to remote server.", types.ERROR),

        closeTab: "Close tab",
        detachWindow: "Detach Window",

        invalidNick: "Your nickname was invalid and has been corrected; please check your altered nickname and press Connect again.",
        missingNick: "You must supply a nickname",
        missingPass: "You must supply a password.",
        missingAuthInfo: "You must supply your username and password in auth mode.",


        //options
        DEDICATED_MSG_WINDOW: "Send privmsgs to dedicated messages window",
        DEDICATED_NOTICE_WINDOW: "Send notices to dedicated message window",
        NICK_OV_STATUS: "Show status (@/+) before nicknames in channel lines",
        ACCEPT_SERVICE_INVITES: "Automatically join channels when invited",
        USE_HIDDENHOST: "Hide your hostmask when authed (+x)",
        LASTPOS_LINE: "Show a last position indicator for each window",
        NICK_COLOURS: "Automatically colour nicknames",
        HIDE_JOINPARTS: "Hide JOINS/PARTS/QUITS",
        STYLE_HUE: "Adjust user interface hue",
        QUERY_ON_NICK_CLICK: "Query on nickname click in channel",
        // SHOW_NICKLIST: "Show nickname list in channels",
        SHOW_TIMESTAMPS: "Show timestamps",
        FONT_SIZE: "Set font size",


        NOTIFY_ON_MENTION: "When nick mentioned:",
        NOTIFY_ON_PM: "When private messaged:",
        NOTIFY_ON_NOTICE: "When channel notice:",
        AUTO_OPEN_PM: "Automatically select window on private message:",
        FLASH: "flash",
        BEEP: "beep",
        MESSAGE_PLACEHOLDER: ' something ... ',
        NICK_PLACEHOLDER: ' someone ... ',
        DELETE_NOTICE: 'remove',
        ADD_NOTICE: 'Add notifier',
        USER_NOTICE: 'User:',
        MESSAGE_NOTICE: 'Message:',
        AUTOESCAPE: 'Escape text',
        HIGHLIGHT: 'Highlight',
        MENTIONED: 'Mentioned',
        ESCAPE_HINT: 'This text is transformed into a regular expressions - autoescaping will check for the exact text you entered',
        DESKTOP_NOTICES: 'Allow us to send desktop notifications if supported (on any notice with flash):',

        ENABLE: 'Enable',
        DISABLE: 'Disable'
    });


    // lang.IRC_COMMAND_HELPERS = {
    //     "JOIN": "/JOIN <channel>",
    //     "NICK": "/NICK <new nickname>",
    //     "PART": "/PART <channel>",
    //     "QUIT": "/QUIT <message>",
    //     "TOPIC": "/TOPIC <channel> <topic>",
    //     "AWAY": "/AWAY <message>",
    //     "ME": "/ME <message>",
    //     "NOTICE": "/NOTICE <message>",
    //     "MODE": "/MODE <target(chan/user)> <mode>",
    //     "AUTHSERV": "/AUTHSERV AUTH <account> <password>"
    // };


ui.themes.ThemeControlCodeMap2 = {
    "C": irc.styles.colour.key,
    "B": util.getStyleByName('bold').key,
    "U": util.getStyleByName('underline').key,
    "O": irc.styles.colour.key,
    "D": irc.styles.normal.key,
    //little clever here
    "NN": templates.userlink({'userid':'{N}', 'username': '{N}'}),//nick name
    "CN": templates.userlink({'userid':'{w}', 'username': '{w}'}),// change nick
    "P": "{C}4=={O} "
    // "[": "qwebirc://whois/",
    // "]": "/"
};

ui.themes.Default2 = {
    "SIGNON": "{P}Signed on!",
    "CONNECT": "{P}Connected to server.",

    "RAW": "{P}{m}",
    "DISCONNECT": "{P}Disconnected from server: {m}",
    "ERROR": "{P}ERROR: {m}",

    "SERVERNOTICE": "{P}{m}",
    "OURTARGETEDNOTICE": "[notice({[}{t}{]})] {m}",
    "OURCHANNOTICE": "-{N}:{t}- {m}",
    "OURPRIVNOTICE": "-{N}- {m}",
    "CHANNOTICE": "-{D}{(}{N}{)}{D}:{c}- {m}",
    "PRIVNOTICE": "-{(}{N}{)}- {m}",

    "JOIN": "{P}{D}{N}{D} [{h}] has joined {c}",
    "OURJOIN": "{P}{D}{N}{D} [{h}] has joined {c}",
    "PART": "{P}{D}{N}{D} [{h}] has left {c} [{m}]",
    "KICK": "{P}{D}{v}{D} was kicked from {c} by {D}{N}{D} [{m}]",
    "MODE": "{P}mode/{c} gives [{m}] to {D}{N}{D}",
    "QUIT": "{P}{D}{N}{D} [{h}] has quit [{m}]",
    "NICK": "{P}{D}{n}{D} has changed nick to {CN}",
    "TOPIC": "{P}{D}{N}{D} changed the topic of {c} to: {m}",
    "UMODE": "Usermode change: {m}",
    "INVITE": "{N} invites you to join {c}",

    "HILIGHT": "{C}4",
    "HILIGHTEND": "{O}",

    "CHANMSG": "{D}&lt;{@}{(}{N}&gt;{)}{D} {m}",
    "PRIVMSG": "{(}&lt;{N}&gt;{)} {m}",

    "OURCHANMSG": "&lt;{@}{N}&gt; {m}",
    "OURPRIVMSG": "&lt;{N}&gt; {m}",
    "OURTARGETEDMSG": "*{[}{t}{]}* {m}",
    "OURCHANACTION": " * {N} {m}",
    "OURPRIVACTION": " * {N} {m}",

    "CHANACTION": " * {D}{(}{N}{)}{D} {m}",
    "PRIVACTION": " * {(}{N}{)} {m}",
    "CHANCTCP": "{N} [{h}] requested CTCP {x} from {c}: {m}",
    "PRIVCTCP": "{N} [{h}] requested CTCP {x} from {-}: {m}",
    "CTCPREPLY": "CTCP {x} reply from {N}: {m}",

    "OURCHANCTCP": "[ctcp({t})] {x} {m}",
    "OURPRIVCTCP": "[ctcp({t})] {x} {m}",
    "OURTARGETEDCTCP": "[ctcp({t})] {x} {m}",

    "WHOISUSER": "{P}{B}{N}{B} [{h}]",
    "WHOISREALNAME": "{P} realname : {m}",
    "WHOISCHANNELS": "{P} channels : {m}",
    "WHOISSERVER": "{P} server   : {x} [{m}]",
    "WHOISACCOUNT": "{P} account : m",
    "WHOISIDLE": "{P} idle     : {x} [connected: {m}]",
    "WHOISAWAY": "{P} away     : {m}",
    "WHOISOPER": "{P}          : {B}IRC Operator{B}",
    "WHOISOPERNAME": "{P} operedas : {m}",
    "WHOISACTUALLY": "{P} realhost : {m} [ip: {x}]",
    "WHOISGENERICTEXT": "{P} note  : {m}",
    "WHOISEND": "{P}End of WHOIS",

    "AWAY": "{P}{N} is away: {m}",
    "GENERICERROR": "{P}{m}: {t}",
    "GENERICMESSAGE": "{P}{m}",
    "WALLOPS": "{P}WALLOP {n}: {t}",
    "CHANNELCREATIONTIME": "{P}Channel {c} was created at: {m}",
    "CHANNELMODEIS": "{P}Channel modes on {c} are: {m}"
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