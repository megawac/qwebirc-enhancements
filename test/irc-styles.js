// stole base tests from https://github.com/braddunbar/irc-parser

describe("IRC Styles/Colours", function() {
    //@Todo add tests to make sure the result contains the same string
    function colourise(msg) {
        return Elements.from(qwebirc.util.colourise(msg));
    }

    function filter(ele, selector) {
        return $$(ele).filter(Type.isElement).filter(selector);
    }

    function getText(ele) {
        return $$(ele).reduce(function(sofar, kid) {
            if(Type.isElement(kid)) return sofar + kid.text();
            return sofar + kid.textContent;
        }, "");
    }

    describe("Colours", function() {
        //based off examples http://www.mirc.com/colors.html
        var msg;

        it("No match", function() {
            msg = colourise("Some text \x03Keep space after\x03 ");
            expect(msg).to.have.length(1);
            expect(filter(msg)).to.have.length(0);

            //Ignore only giving background (^C,B) per spec
            msg = colourise("\x03,12colored text and background\x03");
            expect(msg).to.have.length(1);
        });

        it("Foreground", function() {
            msg = colourise("\x035colored text\x03");
            expect(filter(msg)).to.have.length(1);
            expect(filter(msg), ".col5").to.have.length(1);

            //shouldnt kill text outside
            msg = colourise("Some text \x035Keep space after\x03 ");
            expect(msg).to.have.length(3);
        });

        //background
        it("Foreground+background", function() {
            msg = colourise("\x035,12colored text and background\x03");
            expect(filter(msg, "span")).to.have.length(1);
            expect(filter(colourise("\x035,12colored text and background\x03"), ".col5")).to.have.length(1);
            expect(filter(colourise("\x035,12colored text and background\x03"), ".back12")).to.have.length(1);
        });

        it("Multi-match", function() {
            msg = colourise("\x033colored text \x035,2more colored text and background\x03");
            expect(filter(msg)).to.have.length(2);
            msg = colourise("\x033,5colored text and background \x038other colored text but same background\x03");
            expect(filter(msg)).to.have.length(2);
            msg = colourise("colored \x033,5text and background \x038,7other colored text and different\x03 background");
            expect(msg).to.have.length(4);

            expect(getText(msg)).to.be.equal("colored text and background other colored text and different background");
        });
    });

    describe("Styles", function() {
        it("normal", function() {
            var msg;

            msg = colourise("this is \x00some text\x00 and some more text");
            expect(getText(msg)).to.be.equal("this is some text and some more text");
        });

        it("italic", function() {
            var msg;

            msg = colourise("this is \x1Dsome text\x1D and some more text");
            expect(msg).to.have.length(3);
            expect(filter(msg, ".italic")).to.have.length(1);
            expect(getText(msg)).to.be.equal("this is some text and some more text");
        });

        it("bold", function() {
            var msg;

            msg = colourise("this is \x02some text\x02 and some more text");
            expect(msg).to.have.length(3);
            expect(filter(msg, ".bold")).to.have.length(1);
            expect(getText(msg)).to.be.equal("this is some text and some more text");
        });

        it("underline", function() {
            var msg;

            msg = colourise("this is \x1Fsome text\x1F and some more text");
            expect(msg).to.have.length(3);
            expect(filter(msg, ".underline")).to.have.length(1);
            expect(getText(msg)).to.be.equal("this is some text and some more text");
        });
    });

    it("Mixed", function() {
        var msg;

        msg = colourise("\x02this is \x1Fsome text\x1F and \x032,13Keep space after\x03 text\x02");
        expect(msg).to.have.length(1);
        expect(filter(msg, ".bold")).to.have.length(1);
        expect(msg[0].getElements(".underline")).to.have.length(1);
        expect(msg[0].getElements(".col2.back13")).to.have.length(1);
    });

    it("^O break styles", function() {
        var msg;

        msg = colourise("this is \x1Fsome text and\x0D some more\x1F text\x1F");
        expect(msg).to.have.length(4);
        expect(filter(msg, ".underline")).to.have.length(2);

        msg = colourise("\x02this is \x1Fsome text and\x0D\x032,13Keep space after\x03 text\x02");
        //NOTE: that bold at the end will count as a span
        expect(msg).to.have.length(4);
        expect(filter(msg, ".bold")).to.have.length(2);
        expect(msg[0].getElements(".underline")).to.have.length(1);
        expect(msg[0].text()).to.be.equal("this is some text and");
        expect(msg[0].getElements(".col2.back13")).to.have.length(0);
        expect(filter(msg, ".col2.back13")).to.have.length(1);
    });

    it("Don't require end signal", function() {
        var msg;

        //don't require end signal
        msg = colourise("Some text \x035keep on going ");
        expect(msg).to.have.length(2);
        expect(getText(msg)).to.be.equal("Some text keep on going ");

        msg = colourise("this is \x1Dsome text and some more text");
        expect(msg).to.have.length(2);
        expect(getText(msg)).to.be.equal("this is some text and some more text");

        msg = colourise("this is \x02some text and some more text");
        expect(msg).to.have.length(2);
        expect(getText(msg)).to.be.equal("this is some text and some more text");

        msg = colourise("this is \x1Fsome text and some more text");
        expect(msg).to.have.length(2);
        expect(getText(msg)).to.be.equal("this is some text and some more text");
    });
});

