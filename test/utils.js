describe("Utilities", function() {
    var util = qwebirc.util;

    describe("misc", function() {
        it("Concat unique", function() {
            expect(util.concatUnique([1, 2, 3, 4], [5, 2, 1], [4, 5, 6]).sort()).to.eql([1, 2, 3, 4, 5, 6]);
        });

        it(".test()", function() {
            expect(util.test(/^alp/)("alpha")).to.be.ok();
            expect(util.test(/alp$/)("alpha")).to.not.be.ok();
        });

        it(".replaceAll()", function() {
            expect(util.replaceAll("$$testingmy:)replace$/$", "$", ":)")).to.be.equal(":):)testingmy:)replace:)/:)");
            expect(util.replaceAll("testing:)myreplace:)", "$", ":)")).to.be.equal("testing:)myreplace:)");
            expect(util.replaceAll("testingmyreplace$/$", "$", ":)")).to.be.equal("testingmyreplace:)/:)");
        });

        it(".splitMax()", function() {
            expect(util.splitMax("test!willsplit!into!1", "!")).to.be.eql(["test!willsplit!into!1"]);
            expect(util.splitMax("test!willsplit!into!1", "!", 1)).to.be.eql(["test!willsplit!into!1"]);
            expect(util.splitMax("test!willsplit!into!3", "!", 3)).to.be.eql(["test", "willsplit", "into!3"]);
            expect(util.splitMax("testwillsplitinto1", "!", 3)).to.be.eql(["testwillsplitinto1"]);
        });

        it(".nextItem()", function() {
            var col = _.range(-5, 4);//-5 -> 3
            expect(util.nextItem(col, 0)).to.be.equal(-4);
            expect(util.nextItem(col, 0, 0)).to.be.equal(-4);
            expect(util.nextItem(col, 4)).to.be.equal(0);
            expect(util.nextItem(col, 3)).to.be.equal(-1);
            expect(util.nextItem(col, 3, col.length)).to.be.equal(-2);
            expect(util.nextItem(col, 3, col.length * 5)).to.be.equal(-2);
            expect(util.nextItem(col, col.length * 5, 2)).to.be.equal(-3);
            //try reverse
            expect(util.nextItem(col, 0, -1)).to.be.equal(3);
            expect(util.nextItem(col, 3, -col.length * 5)).to.be.equal(-2);
        });

        it(".indexOfWord()", function() {
            expect(util.indexOfWord("megawac", "Some random sequence of characters with (megawac) in it")).to.be.equal(41);

            //handle random characters?
            expect(util.indexOfWord("meg_awac`", "Some random sequence of characters with (-meg_awac`) in it")).to.be.equal(42);
            expect(util.indexOfWord("megawac", "Some random sequence of characters w/o amegawac in it")).to.be.equal(-1);

            // multiple occurances
            expect(util.indexOfWord("megawac", "Some random sequence of characters w/o amegawac in it but then out of nowhere" +
                " megawac")).to.be.equal(78);
            expect(util.indexOfWord("megawac", "Some random sequence of characters w/o amegawac in it but then out of nowhere" +
                " megawacb")).to.be.equal(-1);

            // takes counter
            expect(util.indexOfWord("megawac", "megawac, megawac megawac, megawac, megawac")).to.be.equal(0);
            expect(util.indexOfWord("megawac", "megawac, megawac megawac, megawac, megawac", 0)).to.be.equal(0);
            expect(util.indexOfWord("megawac", "megawac, megawac megawac, megawac, megawac", 1)).to.be.equal(9);
            expect(util.indexOfWord("megawac", "megawac, megawac megawac, megawac, megawac", 10)).to.be.equal(17);
            expect(util.indexOfWord("megawac", "megawac, megawac megawac, megawac, megawac", 20), 26);
        });

        it(".containsWord()", function() {
            expect(util.containsWord("megawac", "Some random sequence of characters with (megawac) in it")).to.be.ok();
            expect(util.containsWord("megawac", "Some random sequence of characters w/ megawac.")).to.be.ok();
            expect(util.containsWord("megawac", "Some random sequence of characters w/o amegawac in it")).to.not.be.ok();

            //handle random characters?
            expect(util.containsWord("meg_awac`", "Some random sequence of characters with (-meg_awac`) in it")).to.be.ok();
            expect(util.containsWord("meg_awac`", "Some random sequence of characters w/ -meg_awac`.")).to.be.ok();
            expect(util.containsWord("meg_awac`", "Some random sequence of characters w/ -meg_awac`")).to.be.ok();
            expect(util.containsWord("megawac", "Some random sequence of characters w/o amegawac in it")).to.not.be.ok();

            // multiple occurances
            expect(util.containsWord("megawac", "Some random sequence of characters w/o amegawac in it but then out of nowhere" +
                " megawac")).to.be.ok();
        });

        it(".countWord()", function() {
            expect(util.countWord("megawac", "t t t t")).to.be.equal(0);
            expect(util.countWord("t", "t t t t")).to.be.equal(4);
            expect(util.countWord("t", "t at the t")).to.be.equal(2);
        });

        it(".randHexString()", function() {
            expect(/^[0-9a-f]+$/i.test(util.randHexString(2))).to.be.ok();
            expect(util.randHexString(2)).to.have.length(4);
        });
    });

    describe("format", function() {

        //just a rewrite of .substitute so use its tests adapted for the case
        describe(".formatSafe", function() {
            it("should substitute values from objects", function(){
                expect(util.formatSafe("This is {color}.", {"color": "blue"})).to.equal("This is blue.");
                expect(util.formatSafe("This is {color} and {size}.", {"color": "blue", "size": "small"})).to.equal("This is blue and small.");
            });
            it("should substitute values from arrays", function(){
                expect(util.formatSafe("This is {0}.", ["blue"])).to.equal("This is blue.");
                expect(util.formatSafe("This is {0} and {1}.", ["blue", "small"])).to.equal("This is blue and small.");
            });
            it("should ignore escaped placeholders", function(){
                expect(util.formatSafe("Ignore \\{this} but not {that}.", {"that": "the others"})).to.equal("Ignore {this} but not the others.");
            });
            it("should substitute with a custom regex", function(){
                var php = (/\$([\w-]+)/g);
                expect(util.formatSafe("I feel so $language.", {"language": "PHP"}, php)).to.equal("I feel so PHP.");
                var ror = (/#\{([^}]+)\}/g);
                expect(util.formatSafe("I feel so #{language}.", {"language": "RoR"}, ror)).to.equal("I feel so RoR.");
            });
            it("should substitute without goofing up nested curly braces", function(){
                expect(util.formatSafe("fred {is {not} very} cool", { "is {not":"BROKEN" })).not.to.equal("fred BROKEN very} cool");
                expect(util.formatSafe("this {should {break} mo} betta", { "break":"work" })).to.equal("this {should work mo} betta");
            });
            it("should not remove undefined values", function(done) {
                expect(util.formatSafe("Checking {0}, {1}, {2}, {3} and {4}.", [1, 0, undefined, null])).to.equal("Checking 1, 0, {2}, {3} and {4}.");
                expect(util.formatSafe("This is {not-set}.", {})).to.equal("This is {not-set}.");
                qwebirc.ready(function() {
                    expect(util.formatSafe("{authSuccess} {more-stuff}", qwebirc.lang)).to.equal(qwebirc.lang.authSuccess + " {more-stuff}");
                    done();
                });
            });
        });

        describe.skip(".format", function() {
            //to do
        });
    });

    describe("IRC utils", function() {
        var irc = qwebirc.irc;
        it(".isChannel()", function() {
            expect(util.isChannel("#testawac")).to.be.ok();
            expect(util.isChannel("#a")).to.be.ok();
            expect(util.isChannel("#")).to.be.ok();
            expect(util.isChannel("testawac")).to.not.be.ok();
            expect(util.isChannel("#test awac")).to.not.be.ok();
        });

        it(".formatChannel()", function() {
            expect(util.formatChannel("#test")).to.be.equal("#test");
            expect(util.formatChannel("test")).to.be.equal("#test");
            expect(util.formatChannel("")).to.equal("");
        });

        it(".formatChannelString()", function() {
            expect(util.formatChannelString("test,test2,#test3,#tes#t4,test5,test6")).to.be.equal("#test,#test2,#test3,#tes#t4,#test5,#test6");
            expect(util.formatChannelString(["test", "test2", "#test3", "#tes#t4", "test5", "test6"])).to.be.equal("#test,#test2,#test3,#tes#t4,#test5,#test6");
            expect(util.formatChannelString("")).to.equal("");
        });

        it(".unformatChannelString()", function() {
            expect(qwebirc.util.unformatChannelString("#test,#test2,test3,#tes#t4,test5,#test6")).to.eql(["#test", "#test2", "#test3", "#tes#t4", "#test5", "#test6"]);
        });


        it("prefixOnNick", function() {
            expect(util.prefixOnNick("~@+", "@megawac")).to.be.eql(["@", "megawac"]);
            expect(util.prefixOnNick("~@+", "~@+megawac")).to.be.eql(["~@+", "megawac"]);
            expect(util.prefixOnNick("~@+", "m@egawac")).to.be.eql(["", "m@egawac"]);

            expect(util.getPrefix("~@+", "megawac")).to.be.eql("");
            expect(util.getPrefix("~@+", "~@+megawac")).to.be.eql("~@+");

            expect(util.stripPrefix("~@+", "~@+megawac")).to.be.eql("megawac");
        });

        it("irc.RFC1459toIRCLower()", function() {
            expect(irc.RFC1459toIRCLower("5")).to.be.equal("5");
            expect(irc.RFC1459toIRCLower("Teta5sadaAs")).to.be.equal("teta5sadaas");
            expect(irc.RFC1459toIRCLower("Teta5sadaA\u0151s")).to.be.equal("teta5sadaas");
        });

        it("create nickChan", function() {
            var nc = irc.nickChanEntry("+");
            expect(irc.nickChanEntry().prefixes).to.be.equal("");
            expect(nc.prefixes).to.be.equal("+");
            expect(nc.lastSpoke).to.be.equal(0);
        });
    });
});