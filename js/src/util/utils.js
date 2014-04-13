/**
 * my bank of helper functions
 *
 * @depends [util/constants, config/styles, irc/LowerTable]
 * @provides [util/utils]
 */

/* jshint boss:true */

util.format = function(message, data) {
    return (message.message || message).substitute(data);
};
util.formatCommand = function(command, data) {
    if (_.isString(command)) command = config.IRC_COMMANDS[command];
    return util.format(command.command, data);
};

util.formatSafe = function(str, object, regexp) { //if property not found string is not replaced
    return String(str.message || str).replace(regexp || (/\\?\{([^{}]+)\}/g), function(match, name) {
        if (match.charAt(0) === "\\") return match.slice(1);
        return (object[name] != null) ? object[name] : match;
    });
};

util.test = function(reg) {
    return function(str) {
        return str.test(reg);
    };
};

util.concatUnique = _.compose(_.uniq, Array.concat);

//replaces all occurences of the tofind string in this string with
//alternatively call replace with a regex global
//http://jsperf.com/replaceall-escape/4
util.replaceAll = function(str, tofind, torep) {
    return String(str).split(tofind).join(torep);
};

//splits string into array of with a max length of max
// useful for seperating names from messages
// "test!willsplit!into!1".splitMax("!", 1) => ["test!willsplit!into!1"]
// "test!willsplit!into!3".splitMax("!", 3) => ["test", "willsplit", "into!3"]
// "testwillsplitinto1".splitMax("!", 3) => ["testwillsplitinto1"]"
//http://jsperf.com/string-splitmax-implementations
util.splitMax = function(str, by, max) {
    max = (max || 1) - 1;
    var items = String(str).split(by),
        newitems = items.slice(0, max);
    if (items.length > max) {
        newitems.push(items.slice(max).join(by));
    }
    return newitems;
};

//returns next item in array with overflow
//xs array
//pos start index
//dir ammount direction +/-
util.nextItem = function(xs, pos, dir) {//#note: will always returns an item
    pos = pos || _.size(xs);
    var index = pos + (dir || 1);
    if (index >= xs.length) {
        index %= xs.length;
    }
    if (index < 0) {
        index = xs.length + (index % xs.length);
    }
    return xs[index];
};

//function to determine if a string is one of the stock windows
util.isBaseWindow = _.partial(_.contains, constants.BASE_WINDOWS);

util.isChannelType = _.partial(_.contains, constants.CHANNEL_TYPES);

util.windowNeedsInput = _.partial(_.contains, constants.INPUT_TYPES);

util.formatURL = function(link) {
    link = util.isChannel(link) ? link.replace("#", "@") : link;
    return "#" + ("<%= config.qwebirc_config.router_prefix %>" || "!") + link;
};

util.unformatURL = function(link) {
    return link.replace(new RegExp("^" + ("<%= config.qwebirc_config.router_prefix %>" || "!")), "").replace(/^@/, "#");
};

//test if a string contains a word
util.containsWord = function(word, content) {
    var idx = content.indexOf(word);
    var wordRe = /\w+/;
    if (idx !== -1) {
        return !(wordRe.test(content.charAt(idx - 1)) || wordRe.test(content.charAt(idx + word.length)));
    }

    return false;
    //too naive?
    //return new RegExp("\\b" + String.escapeRegExp(word) + "\\b", "i");
};

util.getStyleByName = function(name) {
    return _.findWhere(irc.styles, {
        name: name
    });
};

util.getStyleByKey = function(key) {
    return _.findWhere(irc.styles, {
        key: Number.toInt(key)
    });
};

util.getColourByName = function(name) {
    return _.findWhere(irc.colours, {
        name: name
    });
};

util.getColourByKey = function(key) {
    return _.findWhere(irc.colours, {
        key: Number.toInt(key)
    });
};

//pads based on the ret of a condition
util.pad = function(cond, padding, str) {
    str = String(str);
    return cond(str) ? padding + str : str;
};

util.padzero = _.partial(util.pad, function(x) {return x.length <= 1;}, "0");
util.padspace = _.partial(util.pad, _.negate(_.isEmpty), " ");

// NOT cryptographically secure! 
//http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
util.randHexString = function(numBytes) {
    var id = "";
    for (; numBytes > 0; numBytes--) {
        id += (((1 + Math.random()) * 0x100) | 0).toString(16).slice(1);
    }
    return id;
};

Browser.isMobile = navigator.userAgent.contains("mobile") || !(Browser.Platform.win || Browser.Platform.mac || Browser.Platform.linux);

Browser.isDecent = !Browser.isMobile || !(!Browser.ie || Browser.version < 9);