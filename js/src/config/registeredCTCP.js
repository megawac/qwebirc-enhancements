/**
 * @depends [config, util/utils]
 * @provides [config/ctcp]
 */
irc.RegisteredCTCPs = {
    "VERSION": $lambda("qwebirc v" + qwebirc.VERSION),
    "USERINFO": $lambda("qwebirc"),
    "TIME": util.IRCDate,
    "PING": $lambda,
    "CLIENTINFO": $lambda("PING VERSION TIME USERINFO CLIENTINFO WEBSITE"),
    "WEBSITE": $lambda(((window == window.top) ? "direct" : document.referrer))
};