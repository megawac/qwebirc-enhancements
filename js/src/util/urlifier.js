
(function() {

//welcome to my dirty corner. Here we welcome regexs and confusing loops

//Parses messages for url strings and creates hyperlinks
var urlifier = util.urlifier = new Urlerizer({
    target: '_blank'
});

urlifier.leading_punctuation.include(/^([\x00-\x02]|\x016|\x1F)/).include(/^(\x03+(\d{1,2})(?:,\d{1,2})?)/);
urlifier.trailing_punctuation.include(/([\x00-\x03]|\x016|\x1F)$/);

urlifier.addPattern(/qwebirc:\/\/(.*)/, function(word) {//breaks on names with dashs "qwebirc://whois/envision-#tf2mix/"
            //given "qwebirc://whois/rushey#tf2mix/"
            if(word.contains("qwebirc://")) {
                var parsed = this.parsePunctuation(word),
                    mid = parsed.mid;

                if(mid.startsWith("qwebirc://") && mid.endsWith("/") && mid.length > 11) {
                    var cmd = mid.slice(10);//remove qwebirc://
                    if(cmd.startsWith("whois/")) {
                        var chan_match = cmd.match(/(#|>)[\s\S]*(?=\/)/); //matches the chan or user to the dash
                        var chan = chan_match ? chan_match[0] : "";
                        var chanlen = chan_match ? chan_match.index : cmd.length - 1; //chan length or the len -1 to atleast remove the dash
                        var user = cmd.slice(6, chanlen);
                        cmd = templates.userlink({'userid': user, 'username': user + chan});
                    }
                    else if(cmd.contains("options") || cmd.contains("embedded")) {
                        console.log("called yo");
                        console.log(cmd);
                    }
                    word = parsed.lead + cmd + parsed.end;
                }
            }
            return word;

            //generates something like <span class="hyperlink-whois">Tristan#tf2mix</span>
        })
        .addPattern(/\B#+(?![\._#-+])/, function(word) {
            var parsed = this.parsePunctuation(word),
                res = parsed.mid;

            if(isChannel(res) && !res.startsWith("#mode") && !res.slice(1).test(/#|\/|\\/)) {
                res = templates.channellink({channel:util.formatChannel(res)});
            }

            return parsed.lead + res + parsed.end;
        })
        .addPattern(/connect [a-zA-Z0-9_]*\..*[a-zA-Z0-9_]*.*;.*password [a-zA-Z0-9_]*/i, function(word) {
            console.log("todo");
            return word;
        });

var inputurl = util.inputParser = new Urlerizer({
    default_parser: false
})

var bbmatch = /\[.+?\].+\[\/.+?\]/i;
inputurl.addPattern(bbmatch,//this pattern needs to be optimized
    function parsebb(_text) {
        var stac = [],
            tag_re = /\[.+?\]/i,
            tag_m,
            tag,
            text = _text,

            bb, style, endTag_re, end_indx, inner;

        while(tag_m = text.match(tag_re)) {
            tag = tag_m[0];
            //assume everything before has been processed
            stac.push(text.slice(0, tag_m.index));
            text = text.slice(tag_m.index);


            style = Array.item(irc.styles.filter(function(sty) {
                return sty.bbcode[0] === tag;
            }), 0);
            if(style) {
                bb = style.bbcode;

                endTag_re = new RegExp(RegExp.escape(bb[1]), "i");
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
    }, true)

})()
