/**
 * ircclient whois handlers whippeee
 *
 * @depends [irc/Client]
 * @depends [util/utils]
 * @provides [irc/Whois]
 */

function whoisWrapper(type, fn) {
    type = "whois" + type.camelCase().capitalize();
    return _.compose(function(data) {
        data.type = type;
        data.msgs = Array.from(data.msgs || data.message).map(function(msg) {
            if(_.isString(msg)) return { message: msg };
            return msg;
        });
        this.trigger("whois", data);
        return true;
    }, fn);
}

var genericText = whoisWrapper("genericText", function(data) {
    return {
        nick: data.args[1],
        message: _.last(data.args) //w/e text
    };
});

irc.Client.implement({
    _whoisAway: whoisWrapper("away", _.identity),

    irc_RPL_WHOISUSER: whoisWrapper("user", function(data) {
        var nick = data.args[1];
        var ident = data.args[2];
        var hostname = data.args[3];
        this._whoisNick = nick;

        return {
            nick: nick,
            msgs: [{
                host: ident + "@" + hostname
            },
            {
                message: data.args[5],
                type: "whoisRealname"
            }]
        };
    }),

    irc_RPL_WHOISSERVER: whoisWrapper("server", function(data) {
        return {
            nick: data.args[1],
            server: data.args[2],
            message: _.last(data.args)
        };
    }),

    irc_RPL_WHOISOPERATOR: whoisWrapper("oper", function(data) {
        return {
            nick: data.args[1]
            // opertext: _.last(data.args)
        };
    }),

    irc_RPL_WHOISIDLE: whoisWrapper("idle", function(data) {
        return {
            nick: data.args[1],
            idle: data.args[2],
            message: data.args[3]
        };
    }),

    irc_RPL_WHOISCHANNELS: whoisWrapper("channels", function(data) {
        return {
            nick: data.args[1],
            message: _.last(data.args) //the channels
        };
    }),

    irc_RPL_WHOISACCOUNT: whoisWrapper("account", function(data) {
        return {
            nick: data.args[1],
            message: data.args[2] //the account
        };
    }),

    irc_RPL_WHOISACTUALLY: whoisWrapper("actually", function(data) {
        return {
            nick: data.args[1],
            message: data.args[2], //users hostmask
            ip: data.args[3]
        };
    }),

    irc_RPL_WHOISOPERNAME: whoisWrapper("opername", function(data) {
        return {
            nick: data.args[1],
            message: data.args[2] //opername
        };
    }),

    irc_RPL_WHOISGENERICTEXT: genericText,

    //whoiswebirc
    irc_RPL_UNIQOPIS: genericText,

    irc_RPL_WHOISSECURE: genericText,

    irc_RPL_ENDOFWHOIS: whoisWrapper("end", function(/*data*/) {
        this._whoisNick = null;
        return {};
    })
});
