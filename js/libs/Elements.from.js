//adapted version to use native parser if available

//Changes from Mootools spec: excludeScripts defaults to to false because fuck you

//http://jsperf.com/dom-create-vs-jquery/5
window.addEvent("domready", function(){

function tableFix(match, text) {
    var container = new Element('table');
    var tag = match[1].toLowerCase();
    if (['td', 'th', 'tr'].contains(tag)){
        container = new Element('tbody').inject(container);
        if (tag != 'tr') container = new Element('tr').inject(container);
    }
    return container.set('html', text).getChildren();
}

var range = document.createRange();
if(range.createContextualFragment) {//not supported on ie<9

    // make the parent of the first div in the document becomes the context node
    var reference = document.getElement("div");
    range.selectNode(reference);

    Elements.from = function(text, excludeScripts) {
        if (excludeScripts == true) text = text.stripScripts();

        var match = text.match(/^\s*<(t[dhr]|tbody|tfoot|thead)/i);
        if(match) return tableFix(match,text);

        var elements = range.createContextualFragment(text).childNodes;
        return new Elements(elements);
    };

} else {

/*
---

script: Elements.From.js

name: Elements.From

description: Returns a collection of elements from a string of html.

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - Core/String
  - Core/Element
  - /MooTools.More

provides: [Elements.from, Elements.From]

...
*/

Elements.from = function(text, excludeScripts){
    if (excludeScripts == true) text = text.stripScripts();

    var match = text.match(/^\s*<(t[dhr]|tbody|tfoot|thead)/i);
    if(match) return tableFix(match,text);

    return new Element('div').set('html', text).getChildren();
};

}


Element.extend({
    from: function(text, rs) {
        return Elements.from(text,rs)[0];
    }
});

});