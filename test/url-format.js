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

    it("Hyperlink IRC references", function() {
        expect(getLinks("Some message with a chan link to 51#qwebirc why not")).to.be.empty();
        expect(getLinks("Some message with a chan link to #qwebirc why not")).to.have.length(1);
    });

    it("Hyperlinks can be wrapped by some characters", function() {
        expect(getLinks("Go to (google.ca)")).to.have.length(1);
        expect(getLinks("Go to [google.ca]")).to.have.length(1);
        expect(getLinks("Go to 'google.ca'")).to.have.length(1);
        expect(getLinks("Go to <google.ca>")).to.have.length(1);
        expect(getLinks("Go to #channel\x00")).to.have.length(1);
        expect(getLinks("Go to \x02google.ca")).to.have.length(1);
        expect(getLinks("Go to \x1D#channel")).to.have.length(1);
        expect(getLinks("Go to google.ca\x03")).to.have.length(1);
        expect(getLinks("Go to \x1Fgoogle.ca\x1D")).to.have.length(1);
        expect(getLinks("Go to \x1F#channel\x1D")).to.have.length(1);
    });

});

describe("BBCode Input Parsing", function() {
    
    

});

