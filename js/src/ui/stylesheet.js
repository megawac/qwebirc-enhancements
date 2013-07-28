
util.parseStylesheet = function(data) {
    var lines = data.replace(/\r/g, "") //irnore double breaks
                    .split("\n");

    var rules = {},
        line, inx,
        i;
    for (var i = 0; i < lines.length; i++) {
        line = lines[i];

        if (line.trim() !== "" && (inx = line.indexOf("=", 2)) !== -1)
            rules[line.slice(0, inx)] = line.slice(inx + 1);
        else
            break;
    }

    var cssLines = lines.slice(i);
    // for (; i < lines.length; i++) //note its using the same i as above
    //     cssLines.push(lines[i]);

    return {
        cssText: cssLines.join("\n"),
        rules: rules
    };
};

util.getSyncAsset = function(url) {
    var req = new Request({
        'url': url,//'http://atf2.org/css/qui-bbc577ad5cb78d946ac1.mcss',
        'async': false
    });
    req.headers = {};
    var result;
    req.addEvent("complete", function(x) {
            result = x;
        })
        .get();
    return result;
};

ui.style.ModifiableStylesheet = new Class({
    initialize: function(url) {
        var n = util.parseStylesheet(util.getSyncAsset(url));

        this.__cssText = n.cssText;
        this.rules = n.rules;

        this.__tag = new Element("style", {
                        type: "text/css",
                        media: "all"
                    }).inject(document.head, 'bottom');
    },
    __setStylesheet: function(stylesheet) {
        var node = this.__tag;

        if (node.styleSheet) { /* IE */
            node.styleSheet.cssText = stylesheet;
        } else {
            node.empty()
                .appendText(stylesheet);
        }
    },
    set: function(mutatorfn) {
        mutatorfn = mutatorfn || $identity;

        var text = this.__cssText;

        Object.each(this.rules, function(val, key) {
            var getVal = mutatorfn.pass(val.split(","));

            text = text.replaceAll("$(" + key + ")", getVal);
        });

        this.__setStylesheet(text);
    }
});
