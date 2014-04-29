describe("IRC Tracker", function() {
    var tracker = new qwebirc.irc.Tracker();
    var prefixes = "@+";

    it(".getNick()", function() {
        expect(tracker.getChannel("megawac") == null).to.be.ok();
        expect(tracker.getChannel("megawac", false) == null).to.be.ok();

        var megawac = tracker.getNick("megawac", true);
        var megaham = tracker.getNick({nick: "megaham", prefix: "+"}, true);

        expect(megawac.nick).to.be.equal("megawac");
        expect(tracker.getNick("megawac")).to.be.equal(megawac);
        expect(tracker.getNick("megawac", true)).to.be.equal(megawac);

        expect(megaham.nick).to.be.equal("megaham");
        expect(tracker.getNick("megaham")).to.be.equal(megaham);
        expect(tracker.getNick({nick: "megaham", prefix: "+"})).to.be.equal(megaham);
        expect(tracker.getNick({nick: "megaham", prefix: "+"}, true)).to.be.equal(megaham);
    });

    it(".getChannel()", function() {
        expect(tracker.getChannel("#testawac") == null).to.be.ok();
        expect(tracker.getChannel("#testawac", false) == null).to.be.ok();

        var testawac = tracker.getChannel("#testawac", true);
        expect(testawac.name).to.be.equal("#testawac");
        expect(tracker.getChannel("#testawac")).to.be.equal(testawac);
        expect(tracker.getChannel("#testawac", true)).to.be.equal(testawac);
    });

    it("setPrefixes", function() {
        var xxx = tracker.getNick("xxx", true);
        var testawac = tracker.getChannel("#testawac");
        tracker.addNickToChannel({nick: "xxx", prefix: "+"}, "#testawac");

        expect(xxx.getPrefix(testawac)).to.be.equal("+");
        xxx.setPrefixes(testawac, prefixes);
        expect(xxx.getPrefix(testawac)).to.be.equal(prefixes);
    });

    it(".addNickToChannel()", function() {
        //add existing
        var megawac = tracker.getNick("megawac");
        var testawac = tracker.getChannel("#testawac");
        expect(tracker.addNickToChannel("megawac", "#testawac")).to.be.equal(tracker);
        expect(megawac.hasChannel(testawac)).to.be.ok();
        expect(testawac.hasUser(megawac)).to.be.ok();

        expect(tracker.addNickToChannel("megawac2", "#testawac")).to.be.equal(tracker);
        megawac = tracker.getNick("megawac2");
        expect(megawac.hasChannel(testawac)).to.be.ok();
        expect(testawac.hasUser(megawac)).to.be.ok();

        expect(tracker.addNickToChannel("megawac2", "#testawac2")).to.be.equal(tracker);
        testawac = tracker.getChannel("#testawac2");
        expect(megawac.hasChannel(testawac)).to.be.ok();
        expect(testawac.hasUser(megawac)).to.be.ok();

        expect(tracker.addNickToChannel("megawac3", "#testawac3")).to.be.equal(tracker);
        megawac = tracker.getNick("megawac3");
        testawac = tracker.getChannel("#testawac3");
        expect(megawac.hasChannel(testawac)).to.be.ok();
        expect(testawac.hasUser(megawac)).to.be.ok();
        expect(testawac.hasUser(tracker.getNick("someone", true))).to.not.be.ok();
    });

    it("batch .addNickToChannel()", function() {
        var nicks = ["megawac", "petty", "testawac", {nick: "jim"}, {nick: "perry", prefix: "@"}];
        var chan = "#testawac4";
        expect(tracker.addNickToChannel(nicks, chan)).to.be.equal(tracker);
        var channel = tracker.getChannel(chan);
        expect(channel.name).to.be.equal(chan);

        expect(tracker.getNick("perry")).to.be.ok();
        expect(tracker.getNick("nick")).to.not.be.ok();
        expect(tracker.getNick("petty")).to.be.ok();
        expect(channel.hasUser(tracker.getNick("megawac"))).to.be.ok();
        expect(channel.hasUser(tracker.getNick("jim"))).to.be.ok();
        expect(channel.hasUser(tracker.getNick("perry"))).to.be.ok();
        expect(channel.hasUser(tracker.getNick("petty"))).to.be.ok();
        expect(channel.hasUser(tracker.getNick("nick"))).to.not.be.ok();
    });

    describe("User", function() {

    });
    describe("Channel", function() {

    });
});