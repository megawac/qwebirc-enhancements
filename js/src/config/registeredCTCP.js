/**
 * @depends [config, util/utils]
 * @provides [config/ctcp]
 */
irc.RegisteredCTCPs = {
    "VERSION": Function.from("qwebirc v" + qwebirc.VERSION),
    "USERINFO": Function.from("qwebirc"),
    "TIME": util.IRCDate,
    "PING": _.identity,
    "CLIENTINFO": Function.from("PING VERSION TIME USERINFO CLIENTINFO WEBSITE"),
    "WEBSITE": Function.from(((window == window.top) ? "direct" : document.referrer))
};
