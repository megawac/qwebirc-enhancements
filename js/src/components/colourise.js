/*
 * Moved from ui.Theme - templates out the styles (bold/underline/italic/colour) in a irc message
 * @depends [components]
 * @provides [util/colourise]
 *
 * MIRC compliant colour and style parser
 * Unfortuanately this is a non trivial operation
 * See https://github.com/megawac/irc-style-parser
 */

(function() {

    var styleCheck_Re = /[\x00-\x1F]/,
        back_re = /^(\d{1,2})(,(\d{1,2}))?/,
        colourKey = "\x03", colour_re = /\x03/g,
        // breaks all open styles ^O (\x0D)
        styleBreak = "\x0D";

    util.colourise = function stylize(line) { // more like stylize
        // http://www.mirc.com/colors.html
        // http://www.aviran.org/2011/12/stripremove-irc-client-control-characters/
        // https://github.com/perl6/mu/blob/master/examples/rules/Grammar-IRC.pm
        // regexs are cruel to parse this thing

        // already done?
        if (!styleCheck_Re.test(line)) return line;

        // split up by the irc style break character ^O
        if (line.indexOf(styleBreak) >= 0) {
            return _.map(line.split(styleBreak), stylize).join("");
        }

        var result = line;

        var parseArr = _.compact(result.split(colourKey));

        // Crude mapper for matching the start of a colour string to its end token
        // Groups each colours into subarrays until the next ^C or background colour
        var colouredarr = _.reduce(parseArr, function(memo, str) {
            var match = str.match(back_re);
            if (!match) { //^C1***
                memo.push([]);
            } else if (isFinite(match[3])) { // fore + background
                memo.push([str]);
            } else { // foreground only
                _.last(memo).push(str);
            }
            return memo;
        }, [[]]);

        _.each(colouredarr, function(colourarr) {
            _.each(colourarr, function(str, index) {
                var match = str.match(back_re);
                var colour = match[1];
                var background = match[3];

                // set the background colour
                // we set this seperate from the fore to allow for nesting
                if (irc.colours[+background]) {
                    var wrapStr = colourarr.slice(index).join(colourKey),
                        textIndex = colour.length + background.length + 1;
                    str = colour + str.slice(textIndex);
                    result = result.replace(colourKey + wrapStr, templates.ircstyle({
                        style: irc.colours[+background].back,
                        text: colourKey + colour + wrapStr.slice(textIndex)
                    }));
                }

                // set the fore colour
                if (irc.colours[+colour]) {
                    result = result.replace(colourKey + str, templates.ircstyle({
                        "style": irc.colours[+colour].fore,
                        "text": str.slice(colour.length)
                    }));
                }
            });
        });


        // Matching styles (italics/bold/underline)
        // if only colours were this easy...
        _.each(irc.styles.special, function(style) {
            if (result.indexOf(style.key) < 0) return;
            result = result.replace(style.keyregex, function(match, text) {
                return templates.ircstyle({
                    "style": style.style,
                    "text": text
                });
            });
        });

        //replace the reminent colour terminations and be done with it
        return result.replace(colour_re, "");
    };

    irc.styles = {
        colour: {
            name: "colour",
            key: colourKey,
            bbcode: ["[colour fore={f} back={b}]", "[/colour]"]
        }
    };

    irc.styles.special = _.map([["normal", "\x00", ""],
                                ["underline", "\x1F", ["[u]", "[/u]"]],
                                ["bold", "\x02", ["[b]", "[/b]"]],
                                ["italic", "\x1D", ["[i]", "[/i]"]]],
                                function(style) {
        var escaped = encodeURI(style[1]).replace("%", "\\x");
        var isArray = _.isArray(style[2]);
        return (irc.styles[style[0]] = {
            name: style[0],
            style: !isArray ? style[2] : "irc-" + style[0],
            key: style[1],
            keyregex: new RegExp(escaped + "(.*?)(" + escaped + "|$)"),
            bbcode: isArray ? style[2] : null
        });
    });

    //http://www.mirc.com/colors.html
    irc.colours = _.reduce(["white", "black", "navy", "green", "red", "brown",
                            "purple", "olive", "yellow", "lightgreen", "teal",
                            "cyan", "blue", "pink", "gray", "lightgrey"],
        function(memo, name, index) {
        memo[index] = {
            name: name,
            fore: "irc-fg" + index,
            back: "irc-bg" + index,
            key: index
        };
        return memo;
    }, {});

})();
