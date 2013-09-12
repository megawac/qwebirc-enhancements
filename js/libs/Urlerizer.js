//Spin off the js lib by lsjosa found here: https://github.com/ljosa/urlize.js
(function(self) {

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

    var urlerizer = self.Urlerizer = new Class({
        Implements: [Options],
        options: {
            nofollow: false,
            autoescape: true,
            trim_url_limit: false,
            //length of a url before it is trimmed
            target: false,
            default_parser: true,
            hide_servers:true
        },

        //ignored punctuation
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

        initialize: function(opts) {
            this.setOptions(opts);

            if(this.options.default_parser) {
                this.patterns.push({
                    pattern: /[a-z0-9]\.[a-z]{2,4}/i,//i think this should pass tests on all valid urls... will also pick up things like test.test
                    entireStr: false,
                    parse: function(text) {
                        var options = this.options;
                        var word = text;
                        if ((word.contains('.') || word.contains('@') || word.contains(':')) &&
                                (!options.hide_servers || !(urlerizer.regexs.server.test(word))) ) {//dont match google.com:510
                            // Deal with punctuation.
                            var parsed = this.parsePunctuation(word);
                            var middle = parsed.mid;

                            // Make URL we want to point to.
                            var url = undefined;
                            var nofollow_attr = options.nofollow ? ' rel="nofollow"' : '';
                            var target_attr = options.target ? ' target="' + options.target + '"' : '';

                            if (middle.match(urlerizer.regexs.simple_url)) url = this.urlquote(middle);
                            else if (middle.match(urlerizer.regexs.url_improved)) url = this.urlquote('http://' + middle);
                            else if (middle.contains(':') && middle.match(urlerizer.regexs.simple_email)) {
                                // XXX: Not handling IDN.
                                url = 'mailto:' + middle;
                                nofollow_attr = '';
                            }

                            // Make link.
                            if (url) {
                                var trimmed = options.trim_url_limit ? String.truncate(middle, options.trim_url_limit) : middle;
                                middle = '<a href="' + url + '"' + nofollow_attr + target_attr + '>' + trimmed + '</a>';
                                word = parsed.lead + middle + parsed.end;
                            }
                        }
                        return word;
                    }
                });
            }
        },

        // Quotes a URL if it isn't already quoted.
        urlquote: function(url) {
            // XXX: Not handling IDN.
            // An URL is considered unquoted if it contains no % characters or
            // contains a % not followed by two hexadecimal digits.
            if (url.indexOf('%') == -1 || url.match(urlerizer.regexs.unquoted_percents)) {
                return encodeURI(url);
            } else {
                return url;
            }
        },

        parse: function(text) {
            var self = this,
                result = (self.options.autoescape ? _.escape(text) : text).split(" "),
                funcs = _.filter(self.patterns, function(pat) {
                    return !pat.entireStr;
                }),

                i = result.length - 1, item;

            function parseWord(pattern) {
                item = result[i];
                if (pattern.pattern.test(item)) {
                    result[i] = pattern.parse.call(self, item);
                    return result[i] !== item;
                }
            }

            for (; i >= 0; i--) {
                funcs.some(parseWord);//one pattern per word or it gets too complicated
            };
            result = result.join(" ")
            self.patterns.each(function(pattern) {
                if (pattern.entireStr && pattern.pattern.test(result)) {
                    result = pattern.parse.call(self, result);
                }
            })
            return result;
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

        patterns: [],

        addPattern: function(reg, action, whole) {
            this.patterns.push({
                'pattern': reg,
                'parse': action,
                'entireStr': whole || false
            });
            return this;
        }
    });

    urlerizer.regexs = {
        simple_url: /^https?:\/\/\w/,
        url_improved: /^www\.|^(?!http)\w[^@]+\.[a-zA-Z]{2,4}/,//matches anything thats urlish- even bit.ly/a
        simple_email: /^\S+@\S+\.\S+$/,
        unquoted_percents: /%(?![0-9A-Fa-f]{2})/,
        server: /(\:(\d{2}))|(qwebirc\:\/)/
    }

})(this);
