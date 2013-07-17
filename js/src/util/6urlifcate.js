
//TODO cleanup
ui.urlificate = function(element, text, execfn, cmdfn, window, urlregex) {
    var punct_re = /[[\)|\]]?(\.*|[\,;])$/;
    var urlregex = /\b((https?|ftp|qwebirc):\/\/|([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*))[^ ]+|connect [a-zA-Z0-9_]*\..*[a-zA-Z0-9_]*.*;.*password [a-zA-Z0-9_]*/i; //matches links, qwebirc handlers, and steam connect info - sorry
    var addedText = [];

    var txtprocess = function(text, regex, appendfn, matchfn) {
        var processed = text;
        for (var index;(index = processed.search(regex)) !== -1;) {
            var match = processed.match(regex);

            var before = processed.slice(0, index);
            var matched = match[0];
            var after = processed.slice(index + matched.length);

            appendfn(before);
            var more = matchfn(matched, appendfn) || "";
            processed = more + after;
        }
        appendfn(processed);
    };

    var appendText = function(text) {
        addedText.push(text);
        util.NBSPCreate(text, element);
    };

    var appendChan = function(text) {
        var newtext = text.replace(punct_re, "");
        addedText.push(newtext);
        var punct = text.substring(newtext.length);

        var a = new Element("span");
        a.href = "#";
        a.addClass("hyperlink-channel")
            .addEvent("click", function(e) {
                new Event(e).stop();
                execfn("/JOIN " + newtext); //be more efficent and semantic to add this as a prop and have a listener on the element for the event
            })
            .appendChild(document.createTextNode(newtext));
        element.appendChild(a);

        return punct;
    };

    var appendURL = function(text, appendfn, regex) {
        var url = text.replace(punct_re, "");
        var punct = text.substring(url.length);

        var href = "";
        var fn = null;
        var target = "_blank";
        var disptext = url;
        var elementType = "a";
        var addClass;

        var ma = url.match(/^qwebirc:\/\/(.*)$/);
        if (ma) {
            var m = ma[1].match(/^([^\/]+)\/([^\/]+)\/?(.*)$/);
            if (!m) {
                appendfn(text);
                return;
            }

            var cmd = cmdfn(m[1], window);
            if (cmd) {
                addClass = m[1];
                elementType = cmd[0];
                if (cmd[0] != "a") {
                    url = null;
                } else {
                    url = "#";
                }
                fn = cmd[1];
                disptext = unescape(m[2]);
                target = null;
            } else {
                appendfn(text);
                return;
            }
            if (m[3])
                punct = m[3] + punct;
        } else {
            if (url.match(/^www\./))
                url = "http://" + url;
            else if (url.match(/^connect/)) {
                target = null;
                var info = url.split(';'),
                    server = info[0].split(' ')[1],
                    password = info[1].split(' ').getLast();
                url = 'steam://connect/' + server + '/' + password;
            }
        }

        var a = new Element(elementType);
        if (addClass)
            a.addClass("hyperlink-" + addClass);

        if (url) {
            a.href = url;
            a.onclick = function() {
                par.steamlink = Date.now();
            };

            if (target) {
                a.target = target;
            }
        }
        addedText.push(disptext);
        a.appendChild(document.createTextNode(disptext));

        element.appendChild(a);
        if ($defined(fn)){
            a.addEvent("click", function(e) {// Functional.compose(fn.bind(disptext), Event.stop)
                e.stop();
                fn(disptext);
            });
        }
        return punct;
    };

    txtprocess(text, urlregex, function(text) {
        txtprocess(text, /\B#[^ ,]+/, appendText, appendChan);
    }, appendURL);

    return addedText.join("");
};
