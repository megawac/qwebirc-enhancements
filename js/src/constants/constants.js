/**
 * @depends [ui, irc, constants]
 * @provides [util/constants]
 */
ui.WINDOW = {
    status: 1,
    query: 2,
    channel: 4,
    custom: 8,
    connect: 16,
    messages: 32,

    active: 9 //currently selected window
};


irc.pmodes = {
    LIST: 0,
    SET_UNSET: 1,
    SET_ONLY: 2,
    regular: 3
};


constants.hl = {
    none: 0,
    activity: 1,
    speech: 2,
    us: 3
};

//window names
constants.brouhaha = "brouhaha";
constants.status = "status";
constants.login = "login";


// constants.window = {
//     brouhaha: "#brouhaha",
//     connect: "Connection details",
//     status: "Status"
// };

constants.BASE_WINDOWS = [constants.brouhaha, constants.status, constants.login];
constants.CHANNEL_TYPES = [ui.WINDOW.channel, ui.WINDOW.query, ui.WINDOW.messages];
constants.INPUT_TYPES = [ui.WINDOW.status, ui.WINDOW.query, ui.WINDOW.channel, ui.WINDOW.messages];

constants.op = "+";
constants.deop = "-";
constants.prefixes = {
    op: "@",
    voice: "+"
};
