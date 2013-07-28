

//not a class?
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
            this.client.exec("/ME " + util.formatter(lang.fishbot, {
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
        predicate: prelude.andand(isOpped, Functional.not(targetOpped))
    }, {
        text: "deop",
        fn: command("deop"),
        predicate: prelude.andand(isOpped, targetOpped)
    }, {
        text: "voice",
        fn: command("voice"),
        predicate: prelude.andand(isOpped, Functional.not(targetVoiced))
    }, {
        text: "devoice",
        fn: command("devoice"),
        predicate: prelude.andand(isOpped, targetVoiced)
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


// ui.HilightController = new Class({
//     initialize: function(parent) {
//         this.parent = parent;
//         this.regex = null;
//         this.prevnick = null;
//     },
//     match: function(text) {
//         var nick = this.parent.nickname;
//         if (nick !== this.prevnick) {
//             var classes = '[\\s\\.,;:]';
//             this.regex = new RegExp('(^|' + classes + ')' + RegExp.escape(nick) + '(' + classes + '|$)', "i");
//         }
//         return this.regex.test(text);
//     }
// });


ui.TabCompleterFactory = new Class({
    initialize: function(ui) {
        this.ui = ui;
        this.reset();
    },
    tabComplete: function(textBox) {
        var text = textBox.value;

        if (!$defined(this.obj)) {
            this.incr = 1;

            var win = this.ui.getActiveWindow();
            if (!win)
                return;

            var startingWord = util.getEnclosedWord(text, util.getCaretPos(textBox));
            var preword = "",
                word = "",
                postword = "";
            if ($defined(startingWord)) {
                preword = text.substring(0, startingWord[0]);
                word = startingWord[1];
                postword = text.substring(startingWord[0] + word.length);
            }

            var ltext = text.toLowerCase(),
                obj;
            if (!text) {
                preword = "/msg ";
                obj = ui.QueryTabCompleter;
            } else if (util.isChannel(word)) {
                obj = ui.ChannelNameTabCompleter;
            } /*else if (false //ltext.match(/^\/(q|query|msg) /i) ) {
                obj = ui.QueryTabCompleter;
            }*/ else if (win.type === ui.WINDOW_QUERY) {
                obj = ui.QueryNickTabCompleter;
            } else if (win.type === ui.WINDOW_CHANNEL) { /* "slug[TAB]" == "slug: " */
                if (!preword) {
                    // if ( !! postword && postword.charAt(0) === " ") {
                    //     postword = ":" + postword; //should i call util.padcolon here?
                    // } else {
                    //     postword = ": " + postword;
                    // }
                    postword = ": " + postword.trimLeft();

                    this.incr++;
                }
                obj = ui.ChannelUsersTabCompleter;
            } else {
                return;
            }

            if (postword === "")
                postword = " ";

            this.obj = new obj(preword, word, postword, win);
            if (!$defined(this.obj))
                return;
        }

        var ret = this.obj.get();
        if (!$defined(ret))
            return;

        textBox.value = ret[1];
        util.setCaretPos(textBox, ret[0] + this.incr);
    },
    reset: function() {
        this.obj = null;
    }
});

ui.TabIterator = new Class({
    initialize: function(client, prefix, list) {
        this.prefix = prefix;
        if (!$defined(list) || list.length === 0) {
            this.list = null;
        } else {
            var prefixes = irc.toIRCCompletion(client, prefix);

            /* convert the nick list to IRC lower case, stripping all non letters
             * before comparisions */
            // for (var i = 0; i < list.length; i++) {
            //     var l2 = irc.toIRCCompletion(client, list[i]);

            //     if (l2.startsWith(prefixes))
            //         l.push(list[i]);
            // }
            var listf = list.filter(Functional.compose(util.prefixOnNick(prefixes), irc.toIRCCompletion.curry(client)));

            this.list = listf;
        }

        this.pos = -1;
    },
    next: function() {
        /*
         * ideally next would do the list gubbins recursively, but no JS engine currently
         * support tail recursion :(
         */
        if (!$defined(this.list))
            return null;

        this.pos = this.pos + 1;
        if (this.pos >= this.list.length)
            this.pos = 0;

        return this.list[this.pos];
    }
});

ui.BaseTabCompleter = new Class({
    initialize: function(client, prefix, existingNick, suffix, list) {
        this.existingNick = existingNick;
        this.prefix = prefix;
        this.suffix = suffix;
        this.iterator = new ui.TabIterator(client, existingNick, list);
    },
    get: function() {
        var n = this.iterator.next();
        if (!$defined(n))
            return null;

        var p = this.prefix + n;
        return [p.length, p + this.suffix];
    }
});

ui.QueryTabCompleter = new Class({
    Extends: ui.BaseTabCompleter,
    initialize: function(prefix, existingNick, suffix, win) {
        this.parent(win.client, prefix, existingNick, suffix, win.client.lastNicks);
    }
});

ui.QueryNickTabCompleter = new Class({
    Extends: ui.BaseTabCompleter,
    initialize: function(prefix, existingText, suffix, win) {
        var chan = win.name;
        this.parent(win.client, prefix, existingText, suffix, [chan]);
    }
});

ui.ChannelNameTabCompleter = new Class({
    Extends: ui.BaseTabCompleter,
    initialize: function(prefix, existingText, suffix, window) {

        var l = [];
        Object.each(window.client.channels, function(chan, name) {
            if($defined(chan)) {
                chan = chan.lastSelected;
            }
            l.push([chan, name]);
        });

        var l2 = l.sort(function(a, b) {
            return b[0] - a[0];
        }).map(prelude.item(1));

        this.parent(window.client, prefix, existingText, suffix, l2);
        // this.parent.apply(this, Array.concat(window.client, arguments, l2));
    }
});

ui.ChannelUsersTabCompleter = new Class({
    Extends: ui.BaseTabCompleter,
    initialize: function(prefix, existingText, suffix, window) {
        var nc = window.client.tracker.getSortedByLastSpoke(irc.activeChannel);

        this.parent(window.client, prefix, existingText, suffix, nc);
    }
});

