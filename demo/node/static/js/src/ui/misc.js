

ui.MENU_ITEMS = (function() {
    function isOpped(nick) {
        var channel = this.name; /* window name */
        var myNick = this.client.nickname;

        return this.client.nickOnChanHasAtLeastPrefix(myNick, channel, "@");
    }

    function isVoiced(nick) {
        var channel = this.name;
        var myNick = this.client.nickname;

        return this.client.nickOnChanHasPrefix(myNick, channel, "+");
    }

    function targetOpped(nick) {
        var channel = this.name;
        return this.client.nickOnChanHasPrefix(nick, channel, "@");
    }

    function targetVoiced(nick) {
        var channel = this.name;
        return this.client.nickOnChanHasPrefix(nick, channel, "+");
    }

    function command(cmd) {
        return function(nick) {
            this.client.exec("/" + cmd + " " + nick);
        };
    }

    return [{
        text: "whois",
        fn: command("whois"),
        predicate: true
    }, {
        text: "query",
        fn: command("query"),
        predicate: true
    }, {
        text: "slap",
        fn: function(nick) {
            this.client.exec("/ME " + util.formatter(lang.fishSlap, {
                'nick': nick
            }));
        },
        predicate: true
    }, {
        text: "kick",
        /* TODO: disappear when we're deopped */
        fn: function(nick) {
            this.client.exec("/KICK " + nick + " wibble");
        },
        predicate: isOpped
    }, {
        text: "op",
        fn: command("op"),
        predicate: _.and(isOpped, _.not(targetOpped))
    }, {
        text: "deop",
        fn: command("deop"),
        predicate: _.and(isOpped, targetOpped)
    }, {
        text: "voice",
        fn: command("voice"),
        predicate: _.and(isOpped, _.not(targetVoiced))
    }, {
        text: "devoice",
        fn: command("devoice"),
        predicate: _.and(isOpped, targetVoiced)
    }];
})();


ui.RequestTransformHTML = function(options) {
    var HREF_ELEMENTS = ["IMG"];

    var $update = options.update;
    var onSuccess = options.onSuccess;

    var fixUp = function(node) {
            if (node.nodeType !== Node.ELEMENT_NODE)
                return;

            if (HREF_ELEMENTS.contains(node.nodeName.toUpperCase())) {
                var attr = node.getAttribute("transform_attr");
                var value = node.getAttribute("transform_value");
                if ($defined(attr) && $defined(value)) {
                    node.removeProperties("transform_attr", "transform_value")
                        .setProperty(attr, qwebirc.global.staticBaseURL + value);
                }
            }

            Array.each(node.childNodes, fixUp);
        };

    delete options["update"];
    options.onSuccess = function(tree, elements, html, js) {
        var container = new Element("div", {'html': html});
        fixUp(container);
        $update.empty();

        Array.each(container.childNodes, function(node) {
            node.swapParent($update);
        });
        onSuccess();
    };

    return new Request.HTML(options);
};

