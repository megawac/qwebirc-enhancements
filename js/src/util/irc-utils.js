/**
 * my bank of helper functions
 *
 * @depends [util/constants, config/styles, irc/LowerTable, util/utils]
 * @provides [util/irc]
 */
/*jshint boss:true*/

//returns the lower case value of a RFC1459 string using the irc table
//called a fuck ton so memoization is incredible here

var join = function(by, xs) {
    return xs.join(by);
};
var joinComma = util.joinChans = _.partial(join, ",");
var _flipMap = _.flip(_.map);


var isChannel = util.isChannel = function(str) {
    return str.startsWith("#") && !str.contains(" ");
};

var formatChannel = util.formatChannel = function(chan) {
    if (!isChannel(chan)) {
        chan = "#" + chan;
    }
    return chan.replace(" ", "");
};

var appendChannel = function(chans, chan) {
    return _.uniq(Array.from(chans).concat(chan).map(formatChannel));
};

var splitChan = util.splitChans = function(xs) {
    if (_.isString(xs)) xs = xs.split(",");
    return xs.map(String.clean);
};

var mappedChannelFormat = _.partial(_flipMap, formatChannel);

var table = constants.IRCLowerTable;
irc.RFC1459toIRCLower = function(x) {
    for (var i = 0, code, lower = ""; i < x.length; i++) {
        code = x.charCodeAt(i);
        if(code < table.length) lower += table[code];
    }
    return lower;
};

irc.ASCIItoIRCLower = String.toLowerCase;

util.validPrefix = _.contains;

//appends a channel to the end of the list of channels
//string -> string
//could just call Array.include?
util.addChannel = appendChannel;
//adds channel to front of list of channels
util.prependChannel = _.flip(appendChannel);

util.removeChannel = _.compose(_.uniq, function(chans, chan) {
    return _.clone(chans).erase(chan);
});

util.unformatChannel = function(chan) {
    if (isChannel(chan)) {
        chan = chan.slice(1);
    }
    return chan;
};

//String -> String
//formatChannelStrings("test,test2,#test3,#tes#t4,test5,test6") => "#test,#test2,#test3,#tes#t4,#test5,#test6"
util.formatChannelString = _.compose(joinComma, _.uniq, mappedChannelFormat, splitChan);
util.unformatChannelString = _.compose(_.uniq, mappedChannelFormat, splitChan);


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
util.prefixOnNick = _.curry(function(prefixes, nick) {
    for (var i = 0; i < nick.length; i++) {
        if(!util.validPrefix(prefixes, nick.charAt(i))) break;
    }
    return [nick.slice(0, i), nick.slice(i)];
});

util.getPrefix = _.compose(_.first, util.prefixOnNick);

util.stripPrefix = _.compose(function(xs){return xs[1];}, util.prefixOnNick);

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

//Should I include a real date frameowkr (used to have Mootools version...)
util.IRCTimestamp = function(date) {
    if(!_.isDate(date)) date = new Date();
    return "[" + util.padzero(date.getHours()) + ":" + util.padzero(date.getMinutes()) + "]";
};

util.IRCDate = function(date) {
    if(!_.isDate(date)) date = new Date();
    if(date.toLocaleString) return date.toLocaleString();

    return util.format("{d}/{M}/{y} {h}:{m}", {
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