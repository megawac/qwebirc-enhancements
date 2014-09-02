/**
 * URL parser new and improved for easy extending
 * @depends [components/Urlerizer]
 * @provides [util/urlifier]
 */
(function() {
    //welcome to my dirty code corner.

    //Parses messages for url strings and creates hyperlinks
    var urlifier = util.urlifier = new components.Urlerizer({
        target: "_blank"
    });
    // var channame_re = /(#|>|&gt;)[\s\S]*(?=\/)/,
    //     chan_re = /#|\/|\\/;

    urlifier.leading_punctuation.push(/^([\x00-\x02]|\x1D|\x1F)/, /^(\x03+(\d{1,2})(?:,\d{1,2})?)/);
    urlifier.trailing_punctuation.push(/([\x00-\x03]|\x1D|\x1F)$/);

    // urlifier.addPattern(/qwebirc:\/\/(.*)/, function(word) {
    //     //given "qwebirc://whois/rushey#tf2mix/"
    //     if(word.contains("qwebirc://")) {
    //         var parsed = this.parsePunctuation(word),
    //             mid = parsed.mid;
    //         if(mid.startsWith("qwebirc://") && mid.endsWith("/") && mid.length > 11) {
    //             var cmd = mid.slice(10);//remove qwebirc://
    //             // if(cmd.startsWith("whois/")) {
    //             //     var chan_match = cmd.match(channame_re); //matches the chan or user to the dash
    //             //     var chan = chan_match ? chan_match[0] : "";
    //             //     var chanlen = chan_match ? chan_match.index : cmd.length - 1; //chan length or the len -1 to atleast remove the dash
    //             //     var user = cmd.slice(6, chanlen);//whois to channel
    //             //     cmd = templates.userlink({"userid": user, "username": user + chan});
    //             // }
    //             word = parsed.lead + cmd + parsed.end;
    //         }
    //     }
    //     return word;

    //     //generates something like <span class="hyperlink-whois">Tristan#tf2mix</span>
    // })
    urlifier.addPattern(/\B#+(?![\._#-+])/, function(word) {
        var parsed = this.parsePunctuation(word),
            res = parsed.mid;

        if(util.isChannel(res)) {
            res = templates.customlink({
                val: res,
                internal: true
            });
        }

        return parsed.lead + res + parsed.end;
    });

    var inputurl = util.inputParser = new components.Urlerizer({
        default_parser: false,
        autoescape: false
    });

    var bbmatch = /\[.+?\].+\[\/.+?\]/i;
    var colour_re = /\[colo(u)?r+(.*?)\](.*?)\[\/colo(u)?r\b\]/ig;
    inputurl.addPattern(bbmatch,//this pattern needs to be optimized
        function parsebb(_text) {//see http://patorjk.com/blog/2011/05/07/extendible-bbcode-parser-in-javascript/
            var stac = [],//for colours try somthing like "[b test=a]test[/b] test".match(/\[b+(.*?)\](.*?)\[\/b\b\]/)
                tag_re = /\[.+?\]/i,
                tag_m, tag,
                text = _text,

                bb, style, endTag_re, end_indx, inner;

            var matchBBCodeTag = function(sty) {
                return sty.bbcode[0] === tag;
            };

            var colours = irc.styles.colour; //replacing colours [colour fore=red back=2]ya[/colour] => \x034,2ya\x03
            text = text.replace(colour_re, function(match, zZz, attributes, text) {
                var attrs = attributes.clean().split(" "), //will split into cey value pairs ["te=a", "b=a"]
                    attrso = {},
                    fore, back;

                attrs.each(function(attr) { //map the obj
                    if(attr.contains("=")) {
                        attr = attr.split("=");
                        attrso[attr[0]] = attr[1];
                    }
                });

                if(attrso.fore || attrso.back){
                    fore = util.getColourByName(attrso.fore) || util.getColourByKey(attrso.fore) || util.getColourByName("black");
                    back = util.getColourByName(attrso.back) || util.getColourByKey(attrso.back) || util.getColourByName("white");
                    return colours.format.substitute({
                        f: fore.key,
                        b: back.key,
                        t: text
                    });
                }
                return match;
            });

            /* jshint boss: true */
            while(tag_m = text.match(tag_re)) { //todo do the matching as above
                tag = tag_m[0];
                //assume everything before has been processed
                stac.push(text.slice(0, tag_m.index));
                text = text.slice(tag_m.index);

                style = _.find(irc.styles.special, matchBBCodeTag);
                if(style) {
                    bb = style.bbcode;

                    endTag_re = new RegExp(String.escapeRegExp(bb[1]), "i");
                    end_indx = text.search(endTag_re);
                    if(end_indx !== -1) {
                        inner = text.slice(tag.length, end_indx);
                        if(bbmatch.test(inner)) {//recurse
                            inner = parsebb(inner);
                        }
                        stac.push(style.key + inner + style.key);
                        text = text.slice(end_indx + bb[1].length);
                        continue;
                    }
                }

                stac.push(tag);
                text = text.slice(tag.length);
            }

            return stac.join("") + text;
        }, true);

})();
