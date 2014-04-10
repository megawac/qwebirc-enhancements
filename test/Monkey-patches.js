//test random mootools extensions that are not obviously correct

describe("Element Methods", function() {
    describe("Element.maxChildren", function() {
        var element = new Element("div");
        var children = 100;
        for (var i = children; i--;) {
            new Element("span", {
                value: i
            }).inject(element);
        }

        it("Doesn't remove when .length < n", function() {
            expect(element.maxChildren(children * 100).childNodes).to.have.length(children);
            expect(element.maxChildren(children + 1).childNodes).to.have.length(children);
            expect(element.maxChildren(children).childNodes).to.have.length(children);
        });

        it("Removes excess children", function() {
            var n = children - 1;
            expect(element.maxChildren(n).childNodes).to.have.length(n);
            n = Math.floor(children / 2);
            expect(element.maxChildren(n).childNodes).to.have.length(n);
            expect(element.maxChildren(n).childNodes).to.have.length(n);

            n = 1;
            expect(element.maxChildren(n).childNodes).to.have.length(n);
            expect(element.maxChildren(0).childNodes).to.have.length(0);
        });
    });

    describe("Element.insertAt", function() {
        var parent = new Element("div");
        var children = 100;
        for (var i = children; i--;) {
            new Element("span", {
                value: i
            }).inject(parent);
        }

        function getIndex(item) {
            return Array.indexOf(parent.childNodes, item);
        }

        it("Inserts at proper location when possible", function() {
            var $e = new Element("a");
            var idx = 0;
            parent.insertAt($e, idx);
            expect(getIndex($e)).to.equal(idx);

            $e = new Element("strong");
            idx = Number.random(1, parent.childNodes.length - 2);
            parent.insertAt($e, idx);
            expect(getIndex($e)).to.equal(idx);

            $e = new Element("strong");
            idx = parent.childNodes.length - 1;
            parent.insertAt($e, idx);
            expect(getIndex($e)).to.equal(idx);
        });

        it("Handles being out of bounds", function() {
            var $e = new Element("a");
            parent.insertAt($e, parent.childNodes.length * 2);
            expect(parent.getLast()).to.equal($e);

            expect(new Element("div").insertAt(new Element("a"), 50).childNodes).to.not.have.length(0);
        });
    });

    describe("Element html(), .text(), .val()", function() {
        var chkTrue = Element.from("<input type='checkbox' name='checkbox' id='checkbox_id' checked>");
        var chkFalse = Element.from("<input type='checkbox' name='checkbox' id='checkbox_id'>");

        it("Get/Set on checkboxs `check` work with booleans", function() {
            expect(chkTrue.val()).to.be.ok();
            expect(chkFalse.val()).to.not.be.ok();

            chkTrue.val(false);
            chkFalse.val(true);
            expect(chkTrue.val()).to.not.be.ok();
            expect(chkFalse.val()).to.be.ok();
        });

        it(".html()", function() {
            //necessary ? just wrapper around .set and get
        });

        it(".text()", function() {
            //necessary ? just wrapper around .set and get
        });
    });

    describe("adopt + disown events", function() {
        var ele = Element.from("<div><span class='target'><a href='' class='kill'></a><strong></strong></span></div>");
        var target = ele.getElement(".target");

        var parentAdoptListener = sinon.spy();
        var parentDisownListener = sinon.spy();
        var childAdoptListener = sinon.spy();
        var childDisownListener = sinon.spy();
        ele.addEvents({
            "adopt": parentAdoptListener,
            "disown": parentDisownListener
        });
        target.addEvents({
            "adopt": childAdoptListener,
            "disown": childDisownListener
        });

        target.disown(target.getElement(".kill"));
        target.adopt(new Element("span"), new Element("div"));
        new Element("a").inject(target);

        it("Event", function() {
            expect(childAdoptListener.callCount).to.be.equal(2);
            expect(childDisownListener.callCount).to.be.equal(1);
        });
        it("Does not propogate", function() {
            expect(parentAdoptListener.callCount).to.be.equal(0);
            expect(parentDisownListener.callCount).to.be.equal(0);
        });
    });
});


describe("String methods", function() {
    //tests from sugarjs https://github.com/andrewplummer/Sugar/blob/master/test/environments/sugar/string.js
    it("startsWith", function() {
        expect("hello".startsWith("hell", 0)).to.be.ok();
        expect("HELLO".startsWith("HELL", 0)).to.be.ok();
        expect("HELLO".startsWith("hell", 0)).to.not.be.ok();
        expect("HELLO".startsWith("hell", 0)).to.not.be.ok();
        expect("HELLO".startsWith()).to.not.be.ok();
        expect("hello".startsWith("hell", -20)).to.be.ok();
        expect("hello".startsWith("hell", 1)).to.not.be.ok();
        expect("hello".startsWith("hell", 2)).to.not.be.ok();
        expect("hello".startsWith("hell", 3)).to.not.be.ok();
        expect("hello".startsWith("hell", 4)).to.not.be.ok();
        expect("hello".startsWith("hell", 5)).to.not.be.ok();
        expect("hello".startsWith("hell", 20)).to.not.be.ok();
    });
    
    it("endsWith", function() {
        expect("vader".endsWith("der", 5)).to.be.ok();
        expect("VADER".endsWith("DER", 5)).to.be.ok();
        expect("VADER".endsWith("der", 5)).to.not.be.ok();
        expect("VADER".endsWith("DER", 5)).to.be.ok();
        expect("VADER".endsWith("der", 5)).to.not.be.ok();
        expect("vader".endsWith("der", -20)).to.not.be.ok();
        expect("vader".endsWith("der", 0)).to.not.be.ok();
        expect("vader".endsWith("der", 1)).to.not.be.ok();
        expect("vader".endsWith("der", 2)).to.not.be.ok();
        expect("vader".endsWith("der", 3)).to.not.be.ok();
        expect("vader".endsWith("der", 4)).to.not.be.ok();
    });
    
    it("trimLeft", function() {
        expect("".trimLeft()).to.be.equal("");
        expect(" wasabi ".trimLeft()).to.be.equal("wasabi ");
    });

    it("trimRight", function() {
        expect("".trimRight()).to.be.equal("");
        expect(" wasabi ".trimRight()).to.be.equal(" wasabi");
    });
    
});