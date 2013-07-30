


var whitespace = /\s/,
    notwhitespace = /\S+$/;

//my helper functions
//returns itself
var $identity = Functional.I,

    // notEqual = Functional.compose(Functional.not, Functional.eq),

    charAt = function(n, str) { return str.charAt(n); }.autoCurry(),

    splitBang = prelude.split("!"),

    joinEmpty = prelude.join(""),

    splitEmpty = prelude.split(""),

    joinComma = util.joinChans = prelude.join(","),

    splitComma = prelude.split(","),

    concatUnique = Functional.compose(prelude.uniq, prelude.concat),

    concatSep = function(sep, s1, s2) {
        if(Array.isArray(s1)) {
            s1 = s1.join(sep);
        }
        if(Array.isArray(s2)) {
            s2 = s2.join(sep);
        }
        if(s1 !== "" && s2 !== "") {
            return s1 + sep + s2;
        }
        else {
            return s1 + s2;
        }
    }.autoCurry(),

    concatSpace = concatSep(" "),

    startsWith = function(what, str) {
        return str.startsWith(what);
    }.autoCurry(),

    each = Array.each.flip().autoCurry(2);

//little formatter i wrote in 10 mins you can prob find a better one
//formatter("{test} a {wa} {repl} {test}",{test:1, repl:'replaced'})
// => "1 a {wa} replaced 1"
// http://jsperf.com/stringformat/3
util.formatter = String.substitute;
// function(str, hash) {
//     var curly = /{(.*?)}/g, //match all substrings wrapped in '{ }'
//         prop;

//     str.match(curly)
//         .each(function (propstr) {
//             prop = propstr.substring(1, propstr.length - 1); //remove curlys
//             if(typeof hash[prop] !== 'undefined') {
//                 str = str.replace(propstr, hash[prop]);
//             }
//         });
//     return str;
// };

//takes a string and escapes characters... not sure what for
// escape('w-d') => "w\-d"
//probably a little intense as its only used to escape a nick
// most useful for removing regex special chars
// RegExp.escape = prelude.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
RegExp.escape = String.escapeRegExp;

//String -> String
// megawac!~megawac@megawac.user.gamesurge -> megawac
util.hostToNick = Functional.compose(prelude.first, splitBang);
//megawac!~megawac@megawac.user.gamesurge -> ~megawac@megawac.user.gamesurge
util.hostToHost = Functional.compose(prelude.item(1), splitBang);


var isChannel = util.isChannel = Functional.and('.length > 1', startsWith('#')),

    formatChannel = util.formatChannel = function(chan) {
        if(chan.length >= 1 && !isChannel(chan)) {
            chan = '#' + chan;
        }
        return chan;
    },

    unformatChannel = util.unformatChannel = function(chan) {
        if(isChannel(chan)) {
            chan = chan.slice(1);
        }
        return chan;
    },

    appendChannel = function(chans,chan) {
        return $A(chans).concat(chan);
    },

    splitChan = util.splitChans = function(xs) {
        if(Array.isArray(xs))
            return xs.length > 0 ? xs : [""];
        return xs.split(",");
    },

    //function to determine if a string is one of the stock windows
    isBaseWindow = util.isBaseWindow = prelude.contains(BASE_WINDOWS),

    isChannelType = util.isChannelType = prelude.contains(CHANNEL_TYPES);


util.windowNeedsInput = prelude.contains(INPUT_TYPES);

//String -> String
//formatChannelStrings("test,test2,#test3,#tes#t4,test5,test6") => "#test,#test2,#test3,#tes#t4,#test5,#test6"
util.formatChannelString = Functional.compose(joinComma, prelude.uniq, Functional.map(formatChannel), splitChan);
util.unformatChannelString = Functional.compose(prelude.uniq, Functional.map(unformatChannel), splitChan);

//appends a channel to the end of the list of channels
//string -> string
//could just call Array.include?
util.addChannel = Functional.compose(/*joinComma, */prelude.uniq,/* splitChan, */appendChannel);
//adds channel to front of list of channels
util.prependChannel = Functional.compose(/*joinComma, */prelude.uniq,/* splitChan, */appendChannel.flip());


//filter an array to not contain main window or dubs then joins it
// util.arrayToChanString = Functional.compose(joinComma, prelude.uniq, Functional.filter.curry(Functional.not(isBaseWindow)));

//calls splits string by comma then calls array.erase on value
util.removeChannel = Array.erase;
// function(chans, chan) {
//     return joinComma( splitChan(chans).erase(chan) );
// };

util.formatCommand = function(cmdline) {
    if (cmdline.charAt(0) === "/") {
        cmdline = cmdline.slice(1);
    } else {
        cmdline = "SAY " + cmdline; //default just say the msg
    }
    return cmdline.splitMax(" ", 2); //split command from the params
};

util.nickChanComparitor = function(client, nickHash) {
    var _prefixes = client.prefixes,
        _prefixNone = _prefixes.length,
        prefixWeight = function(pre) { return pre.length !== 0 ? _prefixes.indexOf(pre) : _prefixNone ; },
        toLower = client.toIRCLower;
    //compares two nick names by channel status > lexigraphy
    return function(nick1, nick2) {
        var p1weight = prefixWeight(nickHash[nick1].prefixes),
            p2weight = prefixWeight(nickHash[nick2].prefixes);
        return (p1weight !== p2weight) ? (p1weight - p2weight) : toLower(nick1).localeCompare(toLower(nick2));
    };
};

util.nickPrefixer = function(nickHash) {
    return function(nick) {
        return nickHash[nick].prefixes + nick;
    };
    //return Functional.compose(prelude.concat, prelude.getProp(nickHash));
};

util.validPrefix = prelude.contains;

//equilvalent Functional.compose(joinEmpty, concatUnique)
util.addPrefix = function(nc, pref, prefs) {
    if(prefs && !util.validPrefix(prefs, pref))
        return nc.prefixes;
    return nc.prefixes = concatUnique(nc.prefixes, pref).join("");
};

util.removePrefix = function(nc, pref) {
    return nc.prefixes = nc.prefixes.replaceAll(pref, "");
};

//if theres a prefix it gets returned
//i dont think its possible to have multiple prefixes
util.prefixOnNick = function(prefixes, nick) {
    var c = nick.charAt(0);
    return util.validPrefix(prefixes, c) ? [c, nick.slice(1)] : ['', nick];
}.autoCurry();

util.getPrefix = Functional.compose(prelude.first, util.prefixOnNick);

util.stripPrefix = Functional.compose(prelude.item(1), util.prefixOnNick);

util.testForNick = function(nick, name) {
    return prelude.test(new RegExp('(^|[\\s\\.,;:])' + RegExp.escape(nick) + '([\\s\\.,;:]|$)', "i"), name);
};

util.toHSBColour = function(nick, client) {
    var lower = client.toIRCLower(util.stripPrefix(client.prefixes, nick));
    if (lower == client.lowerNickname)
        return null;

    var hash = 0;
    for (var i = 0; i < lower.length; i++)
        hash = 31 * hash + lower.charCodeAt(i);

    var hue = Math.abs(hash) % 360;

    return new Color([hue, 70, 60], "hsb");
};


//helper functions
var charIRCLower = Functional.compose(Array.item.curry(irc.IRCLowercaseTable), String.charCodeAt.partial(_, 0));

//returns the lower case value of a RFC1459 string using the irc table
//called a fuck ton so memoization is incredible here
irc.RFC1459toIRCLower = Functional.memoize(Functional.compose(prelude.join(""), Functional.map(charIRCLower)));

//not really sure
//takes a irc client object and string and returns something
irc.toIRCCompletion = Functional.compose(prelude.replace(/[^\w]+/g, ""), Functional.invoke("toIRCLower"));

irc.ASCIItoIRCLower = String.toLowerCase;

util.getStyleByName = function(name) {
    return irc.styles.filter(function(style) {
        return style.name === name;
    })[0];
}

util.getStyleByKey = function(key) {
    return irc.styles.filter(function(style) {
        return style.key === key;
    })[0];
}

util.getColourByName = function(name) {
    return irc.colours.filter(function(colour) {
        return colour.name == name;
    })[0];
}

util.getColourByKey = function(key) {
    return irc.colours.filter(function(colour) {
        return colour.key == key;
    })[0];
}

// returns the arguments 
util.parseURI = function(uri) {
    var result = {};

    var start = uri.indexOf('?');
    if (start === -1) {
        return result;
    }

    var querystring = uri.substring(start + 1);

    var args = querystring.split("&");

    for (var i = 0; i < args.length; i++) {
        var part = args[i].splitMax("=", 2);
        if (part.length > 1)
            result[unescape(part[0])] = unescape(part[1]);
    }

    return result;
};

util.longtoduration = function(l) {
    var seconds = l % 60;
    var minutes = Math.floor((l % 3600) / 60);
    var hours = Math.floor((l % (3600 * 24)) / 3600);
    var days = Math.floor(l / (24 * 3600));

    return days + " days " + hours + " hours " + minutes + " minutes " + seconds + " seconds";
};

//pads based on the ret of a condition
var pad = util.pad = function(cond, padding, str) {
    str = String(str);
    return cond(str) ? padding + str : str;
}.autoCurry();

util.padzero = pad('.length<=1'.lambda(), "0");
util.padspace = pad('.length!==0'.lambda(), " ");


util.browserVersion = $lambda(navigator.userAgent);

util.getEnclosedWord = function(str, pos) {
    pos = pos >>> 0; //type safety coerce int
    // Search for the word's beginning and end.
    var left = str.slice(0, pos + 1).search(notwhitespace),
        right = str.slice(pos).search(whitespace),

        // The last word in the string is a special case.
        // Return the word, using the located bounds to extract it from the string.
        word = right < 0 ? str.slice(left) : str.slice(left, right + pos);

    return [left, word];
};

// NOT cryptographically secure! 
util.randHexString = function(numBytes) {
    var getByte = function() {
            return (((1 + Math.random()) * 0x100) | 0).toString(16).substring(1);
        };

    var l = [];
    for (var i = 0; i < numBytes; i++) {
        l.push(getByte());
    }
    return l.join("");
};


util.IRCTimestamp = function(date) {
    // return "[" + util.padzero(date.getHours()) + ":" + util.padzero(date.getMinutes()) + "]";
    return date.format("[%H:%M]");
};

util.IRCDate = function(date) {
    // return lang.DaysOfWeek[date.getDay()] + " " + lang.MonthsOfYear[date.getMonth()] + " " + util.padzero(date.getDate()) + " " + util.padzero(date.getHours()) + ":" + util.padzero(date.getMinutes()) + ":" + util.padzero(date.getSeconds()) + " " + date.getFullYear();
    return date.format("%c");
};

//silly fn
util.wasKicked = function() {
    return Date.now() - window.lastkick.last <= 100;
};


irc.nickChanEntry = function() {
    // this.prefixes = "";
    // this.lastSpoke = 0;
    return {
        prefixes: "",
        lastSpoke: 0
    };
};


Browser.isMobile = !(Browser.Platform.win || Browser.Platform.mac || Browser.Platform.linux);

util.generateID = (function() {
    var id = 0;
    return function() {
        return "qqa-" + id++;
    };
})();

