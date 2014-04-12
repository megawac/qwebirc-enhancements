/* jshint boss:true */
var prefix_re = /^([_a-zA-Z0-9\[\]\/\\`^{}|-]*)(!([^@]+)@(.*))?$/,
    hasprefix_re = /^:([^ ]+) +/,
    colonrem_re = /^:[^ ]+ +/,
    command_re = /^([^ ]+) */,
    data_re = /^[^ ]+ +/,
    args_re = /^:|\s+:/,
    argsm_re = /(.*?)(?:^:|\s+:)(.*)/,
    args_split_re = / +/,
    NUMERICS = irc.Numerics;

/*
 * Adapted from https://github.com/martynsmith/node-irc - see http://jsperf.com/javascript-irc-parsers for dif implementations
 * parseMessage(line, stripColors)
 *
 * takes a raw "line" from the IRC server and turns it into an object with
 * useful keys
 * ":OCD!~OCD@76.72.16.142 PRIVMSG #tf2mix :mix servers are down. join mumble for an inhouse pug." => {"prefix":"OCD!~OCD@76.72.16.142","nick":"OCD","user":"~OCD","host":"76.72.16.142","command":"PRIVMSG","rawCommand":"PRIVMSG","commandType":"normal","args":["#tf2mix","mix servers are down. join mumble for an inhouse pug."]}
 *
 * @depends [irc/Numerics]
 * @provides [util/ircprocessor]
 */
function parseIRCMessage(line/*, stripColors*/) {
    var message = {
        "raw": line,
        "prefix": ""
        // "commandType": "normal"
    };
    var match;
    var middle, trailing;

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
    message.rawCommand = match[1];
    message.command = NUMERICS[message.rawCommand] || match[1].toUpperCase();
    line = line.replace(data_re, "");

    message.args = [];

    // Parse parameters
    if (args_re.test(line)) {
        match = line.match(argsm_re);
        middle = match[1].trimRight();
        trailing = match[2];
    } else {
        middle = line;
    }

    if (middle) message.args = middle.split(args_split_re);

    if (trailing) message.args.push(trailing);

    return message;
}

/**
 * Parses a preprocessed line from the Qwebirc twisted server
 */
function parseTwistedMessage(data) {
    var message = {
        // commandType: "normal",
        rawCommand: data[1],
        command: NUMERICS[data[1]] || data[1],
        args: data[3],
        prefix: data[2]
    },
    match;

    if (match = message.prefix.match(prefix_re)) {
        message.nick = match[1];
        message.user = match[3];
        message.host = match[4];
    } else {
        message.server = message.prefix;
    }
    return message;
}

util.parseIRCMessage = function(message) {
    return _.isString(message) ? parseIRCMessage(message) : parseTwistedMessage(message);
};