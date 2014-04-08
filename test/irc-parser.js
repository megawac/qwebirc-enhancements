// stole base tests from https://github.com/braddunbar/irc-parser

describe("Raw IRC Message Parsing", function() {
    
    it("simple command", function() {
        qwebirc.util.parseIRCData("PING").command.should.be.equal("PING");
    });

    it("prefix", function() {
        var msg = qwebirc.util.parseIRCData(":irc.example.com PING");
        msg.raw.should.be.equal(":irc.example.com PING");
        msg.prefix.should.be.equal("irc.example.com");
        msg.command.should.be.equal("PING");
    });

    it("args", function() {
        var msg = qwebirc.util.parseIRCData(":hitchcock.freenode.net NOTICE * :*** Looking up host...");
        msg.raw.should.be.equal(":hitchcock.freenode.net NOTICE * :*** Looking up host...");
        msg.prefix.should.be.equal("hitchcock.freenode.net");
        msg.command.should.be.equal("NOTICE");
        msg.args.should.match(["*", "*** Looking up host..."]);
    });

    it("nickname prefix", function() {
        var msg = qwebirc.util.parseIRCData(":frigg!~frigg@freenode/utility-bot PRIVMSG nick :VERSION");
        msg.prefix.should.be.equal("frigg!~frigg@freenode/utility-bot");
        msg.command.should.be.equal("PRIVMSG");
        msg.nick.should.be.equal("frigg");
        msg.host.should.be.equal("freenode/utility-bot");
        msg.args.should.match(["nick", "VERSION"]);
    });

    it("IRC Numerics are mapped", function() {
        var msg = qwebirc.util.parseIRCData(":irc.localhost.localdomain 433 Caleb :Nickname is already in use.");

        msg.command.should.be.equal("ERR_NICKNAMEINUSE");
        msg.rawCommand.should.be.equal("433");
        msg.args.should.match(["Caleb","Nickname is already in use."]);
    });

});

describe("Qwebirc IRC Message Parsing", function() {
    
    it("simple command", function() {
        qwebirc.util.processTwistedData(["c", "PING", ""]).command.should.be.equal("PING");
    });

    it("mode", function() {
        var msg = qwebirc.util.processTwistedData(["c", "MODE", "ChanServ!~cinch@TF2PugNABot-69618.Users.GeeksIRC.net", ["#tf2.pug.na", "+v", "ndust"]]);
        msg.command.should.be.equal("MODE");
        msg.nick.should.be.equal("ChanServ");
        msg.args.should.match(["#tf2.pug.na", "+v", "ndust"]);
    });

    it("nickname prefix", function() {
        var msg = qwebirc.util.processTwistedData(["c", "PRIVMSG", "frigg!~frigg@freenode/utility-bot", ["#channel", "\x0300,01 2 colours :)"]]);
        msg.prefix.should.be.equal("frigg!~frigg@freenode/utility-bot");
        msg.command.should.be.equal("PRIVMSG");
        msg.nick.should.equal("frigg");
        msg.args.should.match(["#channel", "\x0300,01 2 colours :)"]);
    });

    it("quit", function() {
        var msg = qwebirc.util.processTwistedData(["c", "QUIT", "megawac!~webchat@GeeksIRC-98ca35e1.compute-1.amazonaws.com", ["Ping timeout: 241 seconds"]]);
        msg.prefix.should.be.equal("megawac!~webchat@GeeksIRC-98ca35e1.compute-1.amazonaws.com");
        msg.command.should.be.equal("QUIT");
        msg.user.should.be.equal("~webchat");
        msg.nick.should.be.equal("megawac");
    });

    it("IRC Numerics are mapped", function() {
        var msg = qwebirc.util.processTwistedData(["c", "330", "Gateway.GeeksIRC.net"]);

        msg.command.should.be.equal("RPL_WHOISACCOUNT");
        msg.rawCommand.should.be.equal("330");
        msg.server.should.be.equal("Gateway.GeeksIRC.net");
    });

    it("IRC Numerics RPL_Topic", function() {
        var msg = qwebirc.util.processTwistedData(["c", "332", "Samsung.GeeksIRC.net", ["megawac`", "#some channel", "channel topic"]]);
        msg.command.should.be.equal("RPL_TOPIC");
        msg.rawCommand.should.be.equal("332");
        msg.server.should.be.equal("Samsung.GeeksIRC.net");
        msg.prefix.should.be.equal("Samsung.GeeksIRC.net");
        msg.args.should.match(["megawac`", "#some channel", "channel topic"]);
    });

});

