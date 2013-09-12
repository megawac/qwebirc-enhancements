(function() {
    var cmd = config.IRC_COMMANDS;
    var format = function(command, data) {
        return util.format(command.command, data);
    };