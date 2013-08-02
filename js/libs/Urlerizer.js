//Spin off the js lib by lsjosa found here: https://github.com/ljosa/urlize.js
(function(self) {

    // http://stackoverflow.com/a/7924240/17498

    function occurrences(string, substring) {
        var n = 0;
        var pos = 0;
        while (true) {
            pos = string.indexOf(substring, pos);
            if (pos != -1) {
                n++;
                pos += substring.length;
            } else {
                break;
            }
        }
        return n;
    }

    var unquoted_percents_re = /%(?![0-9A-Fa-f]{2})/;

    // Quotes a URL if it isn't already quoted.

    function smart_urlquote(url) {
        // XXX: Not handling IDN.
        // 
        // An URL is considered unquoted if it contains no % characters or
        // contains a % not followed by two hexadecimal digits.
        if (url.indexOf('%') == -1 || url.match(unquoted_percents_re)) {
            return encodeURI(url);
        } else {
            return url;
        }
    }

    function getTrailing(text, punc) {
        if (Type.isRegExp(punc)) {
            var match = text.match(punc);
            if (match) {
                return match[0];
            }
        } else {
            if (text.endsWith(punc)) {
                return punc;
            }
        }
    }

    function getLeading(text, punc) {
        if (Type.isRegExp(punc)) {
            var match = text.match(punc);
            if (match) {
                return match[0];
            }
        } else {
            if (text.startsWith(punc)) {
                return punc;
            }
        }
    }
    // function htmlescape(html) {
    //     return html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    // }
    self.Urlerizer = new Class({
        Implements: [Options],
        options: {
            nofollow: false,
            autoescape: false,
            trim_url_limit: false,
            //length of a url before it is trimmed
            target: false
        },

        leading_punctuation: [],
        trailing_punctuation: [/[.,.)]$/],
        wrapping_punctuation: [
            ['(', ')'],
            ['<', '>'],
            ['&lt;', '&gt;'],
            ['“', '”'],
            ['‘', '’'],
            ["'", "'"],
            ['[', ']']
        ],

        word_split_re: /([\s<>"]+)/,
        simple_url_re: /^https?:\/\/\w/,
        simple_url_2_re: /^www\.|^(?!http)\w[^@]+\.(com|edu|gov|int|mil|net|org)$/,
        simple_email_re: /^\S+@\S+\.\S+$/,

        initialize: function(opts) {
            this.setOptions(opts);
        },

        htmlescape: Handlebars.Utils.escapeExpression,
        //shut up i know it exists and its better than what was here before
        urlerize: function(text) {
            var self = this,
                result = text.split(this.word_split_re),
                funcs = self.patterns.filter(function(pat) {
                    return !pat.wholeWord || pat.pattern.test(text);
                });

            function parseWord(pattern) { //TODO: important optimization - split words and apply only one fn to each word
                if (pattern.pattern.test(item)) {
                    result[i] = pattern.parse.call(self, item);
                }
            }

            for (var i = result.length - 1, item; i >= 0; i--) {
                item = result[i];
                funcs.each(parseWord);
            };
            self.patterns.each(function(pattern) {
                if (pattern.wholeWord && pattern.pattern.test(result)) {
                    result = pattern.parse.call(self, result);
                }
            })
            return result.join(" ");
        },


        trimURL: function(x, limit) {
            limit = limit || this.options.trim_url_limit;
            if (limit && x.length > limit) return x.substr(0, limit - 3) + '...';
            return x;
        },

        parsePunctuation: function(text) {
            var lead = '',
                mid = text,
                end = '';

            function leader(punc) {
                var lead = getLeading(mid, punc);
                if (lead) {
                    mid = mid.slice(lead.length);
                    lead += lead;
                }
            }

            function trailer(punc) {
                var trail = getTrailing(mid, punc);
                if (trail) {
                    mid = mid.slice(0, mid.length - trail.length);
                    end = trail + end;
                }
            }

            function wrapper(puncs) {
                var lead = getLeading(mid, puncs[0]),
                    trail;
                if (lead && (trail = getTrailing(mid, puncs[1]))) {
                    mid = mid.slice(lead.length, mid.length - trail.length);
                    lead += lead;
                    end = trail + end;
                    return true;
                }
            }

            //destructive calls
            while(this.leading_punctuation.some(leader)) {};

            while(this.trailing_punctuation.some(trailer)) {};

            while(this.wrapping_punctuation.some(wrapper)) {};

            return {
                lead: lead,
                mid: mid,
                end: end
            };
        },

        patterns: [{
            pattern: /[a-zA-Z]\.[a-zA-Z]{2,4}/i,
            //i think this should pass tests on all valid urls... will also pick up things like test.test
            wholeWord: false,
            parse: function(text) {
                var options = this.options;
                var word = text;
                if (word.contains('.') || word.contains('@') || word.contains(':')) {
                    // Deal with punctuation.
                    var parsed = this.parsePunctuation(word);
                    var middle = parsed.mid;

                    // Make URL we want to point to.
                    var url = undefined;
                    var nofollow_attr = options.nofollow ? ' rel="nofollow"' : '';
                    var target_attr = options.target ? ' target="' + options.target + '"' : '';

                    if (middle.match(this.simple_url_re)) url = smart_urlquote(middle);
                    else if (middle.match(this.simple_url_2_re)) url = smart_urlquote('http://' + middle);
                    else if (middle.indexOf(':') == -1 && middle.match(this.simple_email_re)) {
                        // XXX: Not handling IDN.
                        url = 'mailto:' + middle;
                        nofollow_attr = '';
                    }

                    // Make link.
                    if (url) {
                        var trimmed = this.trimURL(middle);
                        if (options.autoescape) {
                            // XXX: Assuming autoscape == false
                            parsed.lead = this.htmlescape(parsed.lead);
                            parsed.end = this.htmlescape(parsed.end);
                            url = this.htmlescape(url);
                            trimmed = this.htmlescape(trimmed);
                        }
                        middle = '<a href="' + url + '"' + nofollow_attr + target_attr + '>' + trimmed + '</a>';
                        word = parsed.lead + middle + parsed.end;
                    } else {
                        if (options.autoescape) {
                            word = this.htmlescape(word);
                        }
                    }
                } else if (options.autoescape) {
                    word = this.htmlescape(word);
                }
                return word;
            }
        }],

        addPattern: function(reg, action, whole) {
            this.patterns.push({
                'pattern': reg,
                'parse': action,
                'wholeWord': whole || false
            });
            return this;
        }
    });

})(this);
