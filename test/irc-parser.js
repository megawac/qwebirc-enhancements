// stole base tests from https://github.com/braddunbar/irc-parser
describe("IRC Message Parsing", function() {
    describe("Raw IRC Message Parsing", function() {
        
        it("simple command", function() {
            var msg = qwebirc.util.parseIRCMessage("PING");
            expect(msg.command).to.be.equal("PING");
        });

        it("prefix", function() {
            var msg = qwebirc.util.parseIRCMessage(":irc.example.com PING");
            expect(msg.raw).to.be.equal(":irc.example.com PING");
            expect(msg.prefix).to.be.equal("irc.example.com");
            expect(msg.command).to.be.equal("PING");
        });

        it("args", function() {
            var msg = qwebirc.util.parseIRCMessage(":hitchcock.freenode.net NOTICE * :*** Looking up host...");
            expect(msg.raw).to.be.equal(":hitchcock.freenode.net NOTICE * :*** Looking up host...");
            expect(msg.prefix).to.be.equal("hitchcock.freenode.net");
            expect(msg.command).to.be.equal("NOTICE");
            expect(msg.args).to.eql(["*", "*** Looking up host..."]);
        });

        it("nickname prefix", function() {
            var msg = qwebirc.util.parseIRCMessage(":frigg!~frigg@freenode/utility-bot PRIVMSG nick :VERSION");
            expect(msg.prefix).to.be.equal("frigg!~frigg@freenode/utility-bot");
            expect(msg.command).to.be.equal("PRIVMSG");
            expect(msg.nick).to.be.equal("frigg");
            expect(msg.host).to.be.equal("freenode/utility-bot");
            expect(msg.args).to.eql(["nick", "VERSION"]);
        });

        it("IRC Numerics are mapped", function() {
            var msg = qwebirc.util.parseIRCMessage(":irc.localhost.localdomain 433 Caleb :Nickname is already in use.");
            expect(msg.command).to.be.equal("ERR_NICKNAMEINUSE");
            expect(msg.rawCommand).to.be.equal("433");
            expect(msg.args).to.eql(["Caleb","Nickname is already in use."]);
        });

    });

    describe("Qwebirc IRC Message Parsing", function() {
        
        it("simple command", function() {
            var msg = qwebirc.util.parseIRCMessage(["c", "PING", ""]);
            expect(msg.command).to.be.equal("PING");
        });

        it("mode", function() {
            var msg = qwebirc.util.parseIRCMessage(["c", "MODE", "ChanServ!~cinch@TF2PugNABot-69618.Users.GeeksIRC.net", ["#tf2.pug.na", "+v", "ndust"]]);
            expect(msg.command).to.be.equal("MODE");
            expect(msg.nick).to.be.equal("ChanServ");
            expect(msg.args).to.eql(["#tf2.pug.na", "+v", "ndust"]);
        });

        it("nickname prefix", function() {
            var msg = qwebirc.util.parseIRCMessage(["c", "PRIVMSG", "frigg!~frigg@freenode/utility-bot", ["#channel", "\x0300,01 2 colours :)"]]);
            expect(msg.prefix).to.be.equal("frigg!~frigg@freenode/utility-bot");
            expect(msg.command).to.be.equal("PRIVMSG");
            expect(msg.nick).to.equal("frigg");
            expect(msg.args).to.eql(["#channel", "\x0300,01 2 colours :)"]);
        });

        it("quit", function() {
            var msg = qwebirc.util.parseIRCMessage(["c", "QUIT", "megawac!~webchat@GeeksIRC-98ca35e1.compute-1.amazonaws.com", ["Ping timeout: 241 seconds"]]);
            expect(msg.prefix).to.be.equal("megawac!~webchat@GeeksIRC-98ca35e1.compute-1.amazonaws.com");
            expect(msg.command).to.be.equal("QUIT");
            expect(msg.user).to.be.equal("~webchat");
            expect(msg.nick).to.be.equal("megawac");
        });

        it("IRC Numerics are mapped", function() {
            var msg = qwebirc.util.parseIRCMessage(["c", "330", "Gateway.GeeksIRC.net"]);
            expect(msg.command).to.be.equal("RPL_WHOISACCOUNT");
            expect(msg.rawCommand).to.be.equal("330");
            expect(msg.server).to.be.equal("Gateway.GeeksIRC.net");
        });

        it("IRC Numerics RPL_Topic", function() {
            var msg = qwebirc.util.parseIRCMessage(["c", "332", "Samsung.GeeksIRC.net", ["megawac`", "#some channel", "channel topic"]]);
            expect(msg.command).to.be.equal("RPL_TOPIC");
            expect(msg.rawCommand).to.be.equal("332");
            expect(msg.server).to.be.equal("Samsung.GeeksIRC.net");
            expect(msg.prefix).to.be.equal("Samsung.GeeksIRC.net");
            expect(msg.args).to.eql(["megawac`", "#some channel", "channel topic"]);
        });

    });

});

