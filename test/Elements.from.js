/*
---
name: Elements.From Tests
requires: [More/Elements.From]
provides: [Elements.From.Tests]
...
*/
describe("Elements.From", function() {

    it("should return a group of elements", function() {
        var str = "<p><b>foo</b></p><i>bar</i>";
        var div = new Element("div");
        expect(div.adopt(Elements.from(str)).get("html").toLowerCase().trim()).to.equal(str);
    });

    it("should return a text nodes as well as elements", function() {
        var str = "<p><b>foo</b></p> some text <i>bar</i> more text";
        var div = new Element("div");
        expect(div.adopt(Elements.from(str)).get("html").toLowerCase().trim()).to.equal(str);
    });

    // it("should return a group of table elements", function() {
    //     var str = "<tr><td>foo</td></tr>";
    //     var tbody = new Element("tbody").inject(new Element("table")).adopt(Elements.from(str));
    //     expect(tbody.get("html").toLowerCase().replace(/\s+/g, "").trim()).to.equal(str);
    // });

    it("should also process commented out html", function() {
        var str = "<p><span>foo</span></p> stuff";
        var commented = " <!-- comments --> " + str;
        var div = new Element("div").adopt(Elements.from(commented));
        expect(div.get("html").toLowerCase().trim()).to.equal(str);
    });

});