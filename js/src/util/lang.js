/**
 * Home of future localization.... Its gonna be a rough road...
 * todo request local.json and ready qwebirc only after its loaded
 *
 * @depend [qwebirc]
 * @provides [lang, util/lang]
 */

var types = {
    ERROR: 0,
    INFO: 1,
    SERVER: 2,
    CHAN: 3,
    MESSAGE: 4
};

//language specific stuff. right now just an object
// can either be a message or array of messages
_.merge(lang, {
    TYPES: types,

    windowNames: {
        "brouhaha": "brouhaha", //empty string so no channel name but custom icon
        "login":    "Connection Details",
        "status":   "Status",
        "options":  "Options",
        "faq":      "FAQ",
        "privacy":  "Privacy Policy",
        "embed":    "Add qwebirc to your site",
        "feedback": "Feedback",
        "about":    "About",
        "channels": "Channel List"
    },

    loginMessages: ["Hint #1! When you close a channel this one will be deleted from your favorites and won't come back on the next connection.",
                    "Hint #2! To join a new channel type this command in the chat box: /j #channel"],
    joinAfterAuth: {message: "Waiting for login before joining channels...", type: 1},
    authFailed: ["Could not auth with IRC network - waited 5 seconds.",
                "Otherwise reattempt authing by sending: \"/AUTH <your username> <your password>\"",
                "To ignore the error and join channels, unauthed, type: \"/autojoin\"."],
    
    authSuccess: "Authenticated with network!",
    signOn: "SIGNON",
    joinChans: "Joining channels...",
    noTopic: "(No topic set.)",

    changeTopicNeedsOp: "Sorry, you need to be a channel operator to change the topic!",
    changeTopicConfirm: "Change topic of {channel} to:",

    poorJoinFormat: "Channel names begin with # (corrected automatically).",
    // waitToJoin: "You recently tried to join {channel}. To prevent join-flooding, please wait {time} seconds before reattempting or type /fjoin {channel} to ignore this warning...", types.ERROR),
    invalidCommand: "Can't use this command in this window",
    invalidChanTarget: "Can't target a channel with this command.",
    insufficentArgs: "Insufficient arguments for command.",

    loadingPage: "Loading . . .",
    fishSlap: "slaps {nick} with a large fishbot",

    copyright: ["qwebirc v-{qwebirc.version}",
                "Copyright (C) 2008-2011 Chris Porter and the qwebirc project.",
                "Current version by Emanuel \"megawac\" Jackstare",
                "http://www.qwebirc.org",
                "Licensed under the GNU General Public License, Version 2."],

    ircAlert: "IRC Alert",
    alertNotice: "Alert!",
    activityNotice: "Activity!",
    partChan: "Part",
    quit: "Page closed",
    disconnected: "Client has been disconnected",

    uncontrolledFlood: "ERROR: uncontrolled flood detected -- disconnected.",
    connLost: "Connection Lost",
    connError: "An error occured: {1}",
    // connRetry: "Connection lost: retrying in {next} secs",
    connTimeOut: "Error: connection closed after {retryAttempts} requests failed.",
    connFail: "Couldn't connect to remote server.",

    dropdownHint: "Click the icon for the main menu.",
    closeTab: "Close tab",
    detachWindow: "Detach Window",
    attachWindow: "Redock Window",

    missingNick: "You must supply a nickname",
    missingPass: "You must supply a password",
    nickWrongLen: "Nick must be between {min} and {max} characters",
    setNick: "Set nickname",
    setNickDesc: "Enter a new nickname",

    setChanTitle: "Set Channels",
    setChanDialog: "Set initial channels (comma seperated)",

    //Login
    connectWelcome: "Connect to {{network}} IRC",
    nickname: "Nickname",
    username: "Username",
    password: "Password",
    enableAuth: "Authenticate (optional)",

    //options
    DEDICATED_MSG_WINDOW: "Send privmsgs to dedicated messages window",
    DEDICATED_NOTICE_WINDOW: "Send notices to dedicated message window",
    NICK_OV_STATUS: "Show status (@/+) before nicknames in channel lines",
    ACCEPT_SERVICE_INVITES: "Automatically join channels when invited",
    USE_HIDDENHOST: "Hide your hostmask when authed (+x)",
    LASTPOS_LINE: "Show a last position indicator for each window",
    NICK_COLOURS: "Automatically colour nicknames",
    HIDE_JOINPARTS: "Hide JOINS/PARTS/QUITS",
    BACKGROUND: "Background colour",
    FONT_COLOUR: "Font colour",
    SHOW_NICKLIST: "Show nickname list in channels",
    SHOW_TIMESTAMPS: "Show timestamps",
    FONT_SIZE: "Font size (px)",
    VOLUME: "Volume",


    AUTO_OPEN_PM: "Automatically select window on private message",
    FLASH: "flash",
    BEEP: "beep",
    PM: "pm",
    MENTION: "mentioned",
    ENABLE_BROUHAHA: "Enable channel message aggregator (brouhaha)",
    MESSAGE_PLACEHOLDER: " something ... ",
    NICK_PLACEHOLDER: " someone ... ",
    TYPE_PLACEHOLDER: "type test",
    DELETE_NOTICE: "remove",
    ADD_NOTICE: "Add notifier",
    USER_NOTICE: "User:",
    TYPE_NOTICE: "Type:",
    MESSAGE_NOTICE: "Message:",
    AUTOESCAPE: "Escape text",
    MENTIONED: "Mentioned",
    ESCAPE_HINT: "This text is transformed into a regular expressions - autoescaping will check for the exact text you entered",
    DESKTOP_NOTICES: "Allow us to send desktop notifications if supported (on any notice with flash)",
    IGNORE_CASE: "Case insensitive",
    NOTUS: "Not us",
    NOTUS_HINT: "Not our message",
    HIGHLIGHT: "hl",
    HIGHLIGHT_HINT: "highlight",
    QUIT_MSG: "Set quit message: ",

    ENABLE: "Enable",
    DISABLE: "Disable"
});

[
    "poorJoinFormat"
].each(function(item) {
    lang[item] = {
        message: lang[item],
        type: types.INFO
    };
});

[
    "invalidCommand", "invalidChanTarget", "insufficentArgs",
    "uncontrolledFlood", "connError", "connTimeOut", "connFail"
].each(function(item) {
    lang[item] = {
        message: lang[item],
        type: types.ERROR
    };
});