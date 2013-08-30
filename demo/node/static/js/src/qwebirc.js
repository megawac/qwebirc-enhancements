


irc.RegisteredCTCPs = {
    "VERSION": $lambda("qwebirc v" + qwebirc.VERSION + ", copyright (C) 2008-2011 Chris Porter and the qwebirc project -- " + qwebirc.util.browserVersion()),
    "USERINFO": $lambda("qwebirc"),
    "TIME": function(x) {
        return util.IRCDate(new Date());
    },
    "PING": $lambda,
    "CLIENTINFO": $lambda("PING VERSION TIME USERINFO CLIENTINFO WEBSITE"),
    "WEBSITE": $lambda(((window == window.top) ? "direct" : document.referrer))
};

irc.DummyNicknameValidator = new Class({
    validate: $identity
});

irc.NicknameValidator = new Class({
    initialize: function(options) {
        this.options = options;
    },
    validate: function(nick, permitDot) {
        var self = this,
            generated = [],
            max = Math.min(self.options.maxLen, nick.length);

        max.times(function(indx) {
            var _char = nick[indx];

            var valid = (indx === 0) ? self.options.validFirstChar : self.options.validSubChars;

            if (valid.contains(_char) || permitDot && _char === ".") {
                generated.push(_char);
            } else {
                generated.push("_"); //yeah we assume this is valid... 
            }
        });

        while (generated.length < this.options.minLen) {
            generated.push("_"); // yeah we assume this is valid... 
        }
        return generated.join("");
    }
});
