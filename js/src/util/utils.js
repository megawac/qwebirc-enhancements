/**
 * my bank of helper functions
 *
 * @depends [util/constants, config/styles]
 * @provides [util/utils]
 */

/* jshint boss:true */
/* jshint unused:true */

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
    joinComma = util.joinChans = _.partial(join, ","),

    // splitComma = split(","),
    concatUnique = util.concatUnique = _.compose(_.uniq, Array.concat);


var format = util.format = util.formatter = function(message, data) {
    return (message.message || message).substitute(data);
};
util.formatCommand = function(command, data) {
    if (_.isString(command)) command = config.IRC_COMMANDS[command];
    return format(command.command, data);
};

util.formatSafe = util.formatterSafe = function(str, object, regexp) { //if property not found string is not replaced
    return String(str).replace(regexp || (/\\?\{([^{}]+)\}/g), function(match, name) {
        if (match.charAt(0) === "\\") return match.slice(1);
        return (object[name] != null) ? object[name] : match;
    });
};

util.test = _.autoCurry(function(reg, str) {
    return str.test(reg);
});

//String -> String
// megawac!~megawac@megawac.user.gamesurge -> megawac
// util.hostToNick = _.compose(joinBang, restRight, splitBang);
//megawac!~megawac@megawac.user.gamesurge -> ~megawac@megawac.user.gamesurge
// util.hostToHost = _.compose(Array.getLast, splitBang);


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
    return "#!" + link;
};

util.unformatURL = function(link) {
    return link.replace(/^!/, "").replace(/^@/, "#");
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

/*
 * Adapted from https://github.com/martynsmith/node-irc - see http://jsperf.com/javascript-irc-parsers for dif implementations
 * parseMessage(line, stripColors)
 *
 * takes a raw "line" from the IRC server and turns it into an object with
 * useful keys
 * ":OCD!~OCD@76.72.16.142 PRIVMSG #tf2mix :mix servers are down. join mumble for an inhouse pug." => {"prefix":"OCD!~OCD@76.72.16.142","nick":"OCD","user":"~OCD","host":"76.72.16.142","command":"PRIVMSG","rawCommand":"PRIVMSG","commandType":"normal","args":["#tf2mix","mix servers are down. join mumble for an inhouse pug."]}
 */
var prefix_re = /^([_a-zA-Z0-9\[\]\/\\`^{}|-]*)(!([^@]+)@(.*))?$/,
    hasprefix_re = /^:([^ ]+) +/,
    colonrem_re = /^:[^ ]+ +/,
    command_re = /^([^ ]+) */,
    data_re = /^[^ ]+ +/,
    args_re = /^:|\s+:/,
    argsm_re = /(.*?)(?:^:|\s+:)(.*)/,
    args_split_re = / +/,
    NUMERICS = irc.Numerics;
util.parseIRCData = function(line/*, stripColors*/) {
    var message = {
        "raw": line,
        "prefix": "",
        "commandType": "normal"
    };
    var match;

    /*if (stripColors) {
        line = line.replace(/[\x02\x1f\x16\x0f]|\x03\d{0,2}(?:,\d{0,2})?/g, "");
    }*/

    // Parse prefix
    if (match = line.match(hasprefix_re)) {
        message.prefix = match[1];
        line = line.replace(colonrem_re, "");
        if (match = message.prefix.match(prefix_re)) {
            message.nick = match[1];
            message.user = match[3];
            message.host = match[4];
        } else {
            message.server = message.prefix;
        }
    }

    // Parse command
    match = line.match(command_re);
    message.command = match[1].toUpperCase();
    message.rawCommand = match[1];
    line = line.replace(data_re, "");

    if (NUMERICS[message.rawCommand]) {
        message.command = NUMERICS[message.rawCommand].name;
        message.commandType = NUMERICS[message.rawCommand].type;
    }

    message.args = [];
    var middle, trailing;

    // Parse parameters
    if (line.search(args_re) != -1) {
        match = line.match(argsm_re);
        middle = match[1].trimRight();
        trailing = match[2];
    } else {
        middle = line;
    }

    if (middle.length) message.args = middle.split(args_split_re);

    if (!_.isUndefined(trailing) && trailing.length) message.args.push(trailing);

    return message;
};
util.processTwistedData = function(data) {
    var message = {
        commandType: "normal",
        rawCommand: data[1],
        command: data[1],
        args: data[3],
        prefix: data[2]
    },
    match;
    if(NUMERICS[data[1]]) {
        message.command = NUMERICS[data[1]].name;
        message.commandType = NUMERICS[data[1]].type;
    }
    if (match = message.prefix.match(prefix_re)) {
        message.nick = match[1];
        message.user = match[3];
        message.host = match[4];
    } else {
        message.server = message.prefix;
    }
    return message;
};

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
    return nc.prefixes = nc.prefixes.replaceAll(pref, "");
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

util.toHSBColour = function(nick, client) {
    var lower = client.toIRCLower(util.stripPrefix(client.prefixes, nick));
    if (lower == client.lowerNickname) return null;

    var hash = 0;
    for (var i = 0; i < lower.length; i++){
        hash = 31 * hash + lower.charCodeAt(i);
    }
    var hue = Math.abs(hash) % 360;

    return new Color([hue, 70, 60], "hsb");
};


//helper functions
var charIRCLower = _.compose(_.partial(_.item, constants.IRCLowerTable), _.first);

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
    return "[" + util.padzero(date.getHours()) + ":" + util.padzero(date.getMinutes()) + "]";
};

util.IRCDate = function(date) {
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