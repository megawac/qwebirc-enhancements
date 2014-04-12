/**
 * ircclient non whois replies
 *
 * @depends [irc/Client]
 * @depends [util/utils]
 * @provides [irc/Error]
 */

function genericIRCError(data, target) {
    var message = _.last(data.args);

    if (!target) {
        target = util.isChannel(data.args[1]) ? data.args[1] : constants.status;
    }

    this.trigger("error", {
        target: target,
        channel: target,
        message: message,
        type: "genericError",
        colourClass: "warn"
    });
    return true;
}

irc.Client.implement({

    IRC_COMMAND_MAP: {
        "ERR_CANNOTSENDTOCHAN": "channelError",
        "ERR_CHANOPRIVSNEEDED": "channelError",
        "ERR_NOSUCHNICK": "channelError"
    },

    irc_ERR_NICKNAMEINUSE: function(data) {//add some number to the nick and resend
        if(!this.__signedOn) {
            var nick = data.args[1];
            var newnick = nick + Array.getRandom("_`-");

            this.writeMessages(lang.nickTaken, {
                oldnick: nick,
                nick: newnick
            }, {channels: constants.all});

            this.send(util.formatCommand("NICK", {nick: newnick}));
        }
        return true;
    },

    channelError: _.partial(genericIRCError, _, constants.active),

    IRC_ERROR: genericIRCError
});