// stole base tests from https://github.com/braddunbar/irc-parser

describe("Hyperlink Parsing", function() {
    function getLinks(str) {
        var formatted = qwebirc.util.urlifier.parse(str);
        return Elements.from(formatted).filter(function(e) {
           return e.tagName === "A";
        });
    }

    it("Hyperlink-likes no match", function() {
        expect(getLinks("No url likes in here so this should be empty yo")).to.be.empty();
        expect(getLinks("Pi 3.14159265359 is not a url")).to.be.empty();
        expect(getLinks("Neither are sentences.where ppl fuck up")).to.be.empty();
        expect(getLinks("Domains have more than onecharacte.r")).to.be.empty();
    });

    it("External HTTP hyperlinks", function() {
        expect(getLinks("Go to google.ca")).to.have.length(1);
        expect(getLinks("Go to www.google.ca")).to.have.length(1);
        expect(getLinks("Go to http://google.ca")).to.have.length(1);
        expect(getLinks("Go to http://www.google.ca")).to.have.length(1);
        expect(getLinks("Go to https://google.ca")).to.have.length(1);
        expect(getLinks("Go to http://www.google.ca")).to.have.length(1);
        expect(getLinks("http://www.google.ca ya da ya da www.google.ca")).to.have.length(2);
        expect(getLinks("Go to https://www.google.ca/#q=lolerbears ^^ lolz")).to.have.length(1);
        expect(getLinks("Another test i mentioned www.a.google.ca/random?s=15#53 on that thread https://github.com/megawac/qwebirc-enhancements/issues/25")).to.have.length(2);
        expect(getLinks("Go to google.ca then check out this video https://www.youtube.com/watch?v=ojvTSRA-O-Y xD")).to.have.length(2);
    });

    it("Match Public (not local) Servers", function() {
        expect(getLinks("Go to google.com:510")).to.have.length(1);
        expect(getLinks("Go to 127.0.0.1:9090/#options")).to.have.length(0);
        expect(getLinks("Go to http://localhost:8080?test=true")).to.have.length(0);
        expect(getLinks("Go to http://google.com:510").get("href")).to.be.eql(["http://google.com:510"]);
    });

    it("Perserves https", function() {
        expect(getLinks("Go to https://google.com:510").get("href")).to.be.eql(["https://google.com:510"]);
        expect(getLinks("Go to https://amazon.ca/x/y/z?test=true").get("href")).to.be.eql(["https://amazon.ca/x/y/z?test=true"]);
    });

    it("Match Public (not local) Servers", function() {
        expect(getLinks("Go to google.com:510")).to.have.length(1);
        expect(getLinks("Go to 127.0.0.1:9090/#options")).to.have.length(0);
        expect(getLinks("Go to http://localhost:8080?test=true")).to.have.length(0);
    });

    it("Match Emails", function() {
        expect(getLinks("Match my email megawac@gmail.com there").get("href")).to.be.eql(["mailto:megawac@gmail.com"]);
        expect(getLinks("Match my email megawac@gmail.com there").get("text")).to.be.eql(["megawac@gmail.com"]);
    });

    it("Hyperlink IRC references", function() {
        expect(getLinks("Some message with a chan link to 51#qwebirc why not")).to.be.empty();
        expect(getLinks("Some message with a chan link to #qwebirc why not")).to.have.length(1);
    });

    it("Hyperlinks can be wrapped/prefixed/suffixed by select characters", function() {
        expect(getLinks("Go to (google.ca)").get("text")).to.be.eql(["google.ca"]);
        expect(getLinks("Go to [google.ca]").get("text")).to.be.eql(["google.ca"]);
        expect(getLinks("Go to 'google.ca'").get("text")).to.be.eql(["google.ca"]);
        expect(getLinks("Go to <google.ca>").get("text")).to.be.eql(["google.ca"]);
        expect(getLinks("Go to \x02google.ca").get("text")).to.be.eql(["google.ca"]);
        expect(getLinks("Go to google.ca\x03").get("text")).to.be.eql(["google.ca"]);
        expect(getLinks("Go to \x1Fgoogle.ca\x1D").get("text")).to.be.eql(["google.ca"]);
        expect(getLinks("Go to \x031,2google.ca\x03").get("text")).to.be.eql(["google.ca"]);
        expect(getLinks("Go to \x0311,12google.ca\x03").get("text")).to.be.eql(["google.ca"]);
        expect(getLinks("Go to \x0310google.ca\x03").get("text")).to.be.eql(["google.ca"]);
        expect(getLinks("\x00www.tragicservers.com\x00").html()).to.be.eql(["www.tragicservers.com"]);
    });

    it("Hyperlinks support different protocols", function() {
        expect(getLinks("Go to mumble://atf2.org:64738").get("text")).to.be.eql(["mumble://atf2.org:64738"]);
        expect(getLinks("Go to mumble://atf2.org:64738").get("href")).to.be.eql(["mumble://atf2.org:64738"]);
    });

    describe("Hyperlinks channels", function() {
        it("matches prefixed/wrapped/etc chans", function() {
            var chan = getLinks("Go to \x031,2#channel' stuff #chan2'").html();
            expect(chan).to.be.eql(["#channel", "#chan2"]);
            expect(getLinks("Go to #channel\x00").get("html")).to.be.eql(["#channel"]);
            expect(getLinks("Go to \x1F#channel\x1D").get("html")).to.be.eql(["#channel"]);
        });
    });
});


describe("BBCode Input Parsing", function() {


});
