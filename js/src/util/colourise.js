/*
 * Moved from ui.Theme - templates out the styles (bold/underline/italic/colour) in a irc message
 * @depends [util/utils, config/styles]
 * @provides [util/colourise]
 */
var styles = irc.styles;
var styleColour = styles.colour;
util.colourise = function(line) { //more like stylize
    //http://www.mirc.com/colors.html
    //http://www.aviran.org/2011/12/stripremove-irc-client-control-characters/
    //https://github.com/perl6/mu/blob/master/examples/rules/Grammar-IRC.pm
    //regexs are cruel to parse this thing

    if (line.contains(styles.close.key)) { //split up by the irc style break character ^O
        return line.split(styles.close.key).map(util.colourise).join("");
    }

    var result = line;

    var parseArr = _.compact(result.split(styleColour.key));
    
    var col_re = /^\d/;

    //crude mapper for matching the start of a colour string to its end token may be possible to do with reduce?
    //will be an array of subarrays for each coloured string
    var colouredarr = parseArr.reduce(function(memo, str) {
        if( col_re.test(str) ) { //^C...
            memo.getLast().push(str);
        } else { //^C1***
            memo.push([]);
        }
        return memo;
    }, [[]]);

    parseArr.each(function(str) {//help
        if( col_re.test(str) ) { //^C...
            colouredarr.getLast().push(str);
        } else { //^C1***
            colouredarr.push([]);
        }
    });

    colouredarr.each(function(colourarr) {
        colourarr.each(function(str) {
            var colourMatch = str.match(styleColour.fore_re),
                backgroundMatch = str.match(styleColour.back_re),
                colour = util.getColourByKey(_.item(colourMatch, 0)),
                background = util.getColourByKey(_.last(backgroundMatch));//num aft num + comma

            var html = templates.ircstyle({
                "colour": (colour ? colour.fore : ""),
                "background": (background ? background.back : ""),
                "text": str.slice(backgroundMatch ? backgroundMatch[0].length : colourMatch ? colourMatch[0].length : 0)
            });

            //would not be difficult to support nesting... just wouldnt be able to use templates but build in place (open when arr.length close on empty). The irc
            // colour "spec" is too whack to be bothered for now...
            result = result.replace(styleColour.key + str, html);
        });
    });
    //replace the colour terminations
    result = util.replaceAll(result, styleColour.key, "");

    //matching styles (italics bold under)
    styles.special.each(function(style) {//i wish colours were this easy
        result = result.replace(style.keyregex, function(match, text) {
            return templates.ircstyle({
                "style": style.style,
                "text": text
            });
        });
    });

    return result;
};