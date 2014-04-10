/**
 * my bank of helper functions
 *
 * @depends [util/constants, config/styles, irc/LowerTable]
 * @provides [util/utils]
 */

/* jshint boss:true */

var join = function(by, xs) {
    return xs.join(by);
};

// replace = _.autoCurry(function(reg, rep, str) {
//     return str.replace(reg, rep);
// }),

var startsWith = function(what, str) {
    return str.startsWith(what);
};

var joinEmpty = _.partial(join, ""),

    // splitEmpty = split(""),
    joinComma = util.joinChans = _.partial(join, ",");

    // splitComma = split(","),
util.concatUnique = _.compose(_.uniq, Array.concat);


var format = util.format = function(message, data) {
    return (message.message || message).substitute(data);
};
util.formatCommand = function(command, data) {
    if (_.isString(command)) command = config.IRC_COMMANDS[command];
    return format(command.command, data);
};

util.formatSafe = function(str, object, regexp) { //if property not found string is not replaced
    return String(str.message || str).replace(regexp || (/\\?\{([^{}]+)\}/g), function(match, name) {
        if (match.charAt(0) === "\\") return match.slice(1);
        return (object[name] != null) ? object[name] : match;
    });
};

util.test = _.autoCurry(function(reg, str) {
    return str.test(reg);
});

//replaces all occurences of the tofind string in this string with
//alternatively call replace with a regex global
//http://jsperf.com/replaceall-escape/3
util.replaceAll = function(str, tofind, torep) {
    str = String(str);
    var temp;
    while ((temp = str.replace(tofind, torep)) !== str) { //using regex you end up having todo a bunch of escaping) {
        str = temp;
    }
    return str;
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
    // var items = this.split(by);
    // var newitems = items.slice(0, max - 1);
    // if (items.length >= max) {
    //     newitems.push(items.slice(max - 1).join(by));
    // }
    return newitems;
};

var isChannel = util.isChannel = _.partial(startsWith, "#");

var formatChannel = util.formatChannel = function(chan) {
    if (!isChannel(chan)) {
        chan = "#" + chan;
    }
    return chan;
};

var appendChannel = function(chans, chan) {
    return Array.from(chans).concat(chan).map(formatChannel);
};

var splitChan = util.splitChans = function(xs) {
    if (_.isString(xs)) xs = xs.split(",");
    return xs.map(String.clean);
};

//function to determine if a string is one of the stock windows
util.isBaseWindow = _.partial(_.contains, constants.BASE_WINDOWS);

util.isChannelType = _.partial(_.contains, constants.CHANNEL_TYPES);


util.unformatChannel = function(chan) {
    if (isChannel(chan)) {
        chan = chan.slice(1);
    }
    return chan;
};

util.windowNeedsInput = _.partial(_.contains, constants.INPUT_TYPES);

//String -> String
//formatChannelStrings("test,test2,#test3,#tes#t4,test5,test6") => "#test,#test2,#test3,#tes#t4,#test5,#test6"
util.formatChannelString = _.compose(joinComma, _.uniq, _.partial(_.func.map, formatChannel), splitChan);
util.unformatChannelString = _.compose(_.uniq, _.partial(_.func.map, formatChannel), splitChan);

util.formatURL = function(link) {
    link = util.isChannel(link) ? link.replace("#", "@") : link;
    return "#" + ("<%= config.qwebirc_config.router_prefix %>" || "!") + link;
};

util.unformatURL = function(link) {
    return link.replace(new RegExp("^" + ("<%= config.qwebirc_config.router_prefix %>" || "!")), "").replace(/^@/, "#");
};

//appends a channel to the end of the list of channels
//string -> string
//could just call Array.include?
util.addChannel = _.compose( /*joinComma,*/ _.uniq, /* splitChan, */ appendChannel);
//adds channel to front of list of channels
util.prependChannel = _.compose( /*joinComma,*/ _.uniq, /* splitChan, */ _.flip(appendChannel));

util.removeChannel = _.compose(_.uniq, function(chans, chan) {
    return _.clone(chans).erase(chan);
});

util.nickChanComparitor = function(client, nickHash) {
    var _prefixes = client.prefixes,
        _prefixNone = _prefixes.length,
        prefixWeight = function(pre) {
            return pre ? _prefixes.indexOf(pre) : _prefixNone;//not undef/empty
        },
        toLower = client.toIRCLower;
    //compares two nick names by channel status > lexigraphy
    return function(nick1, nick2) {
        var p1weight = prefixWeight(nickHash[nick1].prefixes),
            p2weight = prefixWeight(nickHash[nick2].prefixes);
        return (p1weight !== p2weight) ? (p1weight - p2weight) : toLower(nick1).localeCompare(toLower(nick2));
    };
};

util.validPrefix = _.contains;

util.addPrefix = function(nc, pref, prefs) {
    if (prefs && !util.validPrefix(prefs, pref) || nc.prefixes.contains(pref)) return nc.prefixes;
    return nc.prefixes = _.sortBy( (pref + nc.prefixes).split(""), function(pref) {
        return prefs.indexOf(pref);
    }).join("");
};

util.removePrefix = function(nc, pref) {
    return nc.prefixes = util.replaceAll(nc.prefixes, pref, "");
};

//get prefixs on a nick
util.prefixOnNick = _.autoCurry(function(prefixes, nick) {
    for (var i = 0; i < nick.length; i++) {
        if(!util.validPrefix(prefixes, nick.charAt(i))) break;
    }
    return [nick.slice(0, i), nick.slice(i)];
});

util.getPrefix = _.compose(_.first, util.prefixOnNick);

util.stripPrefix = _.compose(function(xs){return xs[1]}, util.prefixOnNick);

util.createWordRegex = function(word) {
    return new RegExp("\\b" + String.escapeRegExp(word) + "\\b", "i");//=> /\bmegawac\b/i
};

util.testForNick = _.autoCurry(function(nick, text) {
    return util.createWordRegex(nick).test(text);
});

//helper functions
var charIRCLower = _.compose(_.partial(_.item, constants.IRCLowerTable), function(s) { return s.charCodeAt(0); });

//returns the lower case value of a RFC1459 string using the irc table
//called a fuck ton so memoization is incredible here
irc.RFC1459toIRCLower = _.memoize(_.compose(joinEmpty, _.partial(_.func.map, charIRCLower)));

irc.ASCIItoIRCLower = String.toLowerCase;

util.getStyleByName = function(name) {
    return _.findWhere(irc.styles, {
        name: name
    });
};

util.getStyleByKey = function(key) {
    return _.findWhere(irc.styles, {
        key: _.toInt(key)
    });
};

util.getColourByName = function(name) {
    return _.findWhere(irc.colours, {
        name: name
    });
};

util.getColourByKey = function(key) {
    return _.findWhere(irc.colours, {
        key: _.toInt(key)
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

//Should I include a real date frameowkr (used to have Mootools version...)
util.IRCTimestamp = function(date) {
    if(!_.isDate(date)) date = new Date();
    return "[" + util.padzero(date.getHours()) + ":" + util.padzero(date.getMinutes()) + "]";
};

util.IRCDate = function(date) {
    if(!_.isDate(date)) date = new Date();
    if(date.toLocaleString) return date.toLocaleString();

    return format("{d}/{M}/{y} {h}:{m}", {
        d: date.getDay(),
        M: date.getMonth() + 1,
        y: date.getYear(),
        h: date.getHours(),
        m: date.getMinutes()
    });
};

irc.nickChanEntry = function(p, l) {
    return {
        prefixes: p || "",
        lastSpoke: l || 0
    };
};

util.noop = function() {};

Browser.isMobile = !(Browser.Platform.win || Browser.Platform.mac || Browser.Platform.linux);

Browser.isDecent = !Browser.isMobile || !(!Browser.ie || Browser.version < 9);