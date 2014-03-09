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