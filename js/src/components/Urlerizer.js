/** 
 * Spin off the js lib by lsjosa found here: https://github.com/ljosa/urlize.js
 * @depends [components]
 * @provides [components/Urlerizer]
 */
(function() {

    function makeMatcher(strMethod) {
        return function getLeading(text, punc) {
            if (Type.isRegExp(punc)) {
                var match = text.match(punc);
                if (match) {
                    return match[0];
                }
            } else {
                if (text[strMethod](punc)) {
                    return punc;
                }
            }
        };
    }

    var getLeading = makeMatcher("startsWith");
    var getTrailing = makeMatcher("endsWith");

    var has_protocol = /^.*?:\/\/\w/;
    var url_improved = /^www\.|^(?!http)\w[^@]+\.[a-zA-Z]{2,4}/;//matches anything thats urlish- even bit.ly/a
    var simple_email = /^[\w-]+@\S+\.\S+$/;
    var unquoted_percents = /%(?![0-9A-Fa-f]{2})/;

    components.Urlerizer = new Class({
        Implements: [Options],
        options: {
            nofollow: false,
            autoescape: false,
            trim_url_limit: false,
            //length of a url before it is trimmed
            target: false,
            default_parser: true,
            hide_servers:true
        },

        //ignored punctuation
        //these regexps break jshint...
        leading_punctuation: [/^[“‘(\[<'"]/],
        trailing_punctuation: [/[”’)\]>.,.'"]$/],
        /* "' close the open quotes for my shitty syntax highlighter "' */

        initialize: function(opts) {
            this.setOptions(opts);

            if(this.options.default_parser) {
                this.patterns.push({
                    pattern: /[\w-]{2,}\.[a-z]{2,4}\b/,//i think this should pass tests on all valid urls... will also pick up things like test.test
                    entireStr: false,
                    /* jshint maxcomplexity:false */
                    parse: function(text) {
                        var options = this.options;
                        var word = text;
                        if ((word.contains(".") || word.contains("@") || word.contains(":")) ) {
                            // Deal with punctuation.
                            var parsed = this.parsePunctuation(word);
                            var middle = parsed.mid;

                            // Make URL we want to point to.
                            var url;
                            var nofollow_attr = options.nofollow ? " rel='nofollow'" : "";
                            var target_attr = options.target ? " target='" + options.target + "'" : "";

                            if (has_protocol.test(middle)) url = this.urlquote(middle);
                            else if (url_improved.test(middle)) url = this.urlquote("http://" + middle);
                            else if (simple_email.test(middle)) {
                                // XXX: Not handling IDN.
                                url = "mailto:" + middle;
                                nofollow_attr = "";
                            }

                            // Make link.
                            if (url) {
                                var trimmed = options.trim_url_limit ? String.truncate(middle, options.trim_url_limit) : middle;
                                middle = "<a href='" + url + "'" + nofollow_attr + target_attr + ">" + trimmed + "</a>";
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
            if (!url.contains("%") || unquoted_percents.test(url)) {
                return encodeURI(url);
            } else {
                return url;
            }
        },

        parse: function(text) {
            var self = this,
                result = (self.options.autoescape ? _.escape(text) : text).split(" "),
                funcs = self.patterns.filter(function(pat) {
                    return !pat.entireStr;
                }),

                i = result.length, item;

            function parseWord(pattern) {
                item = result[i];
                if (pattern.pattern.test(item)) {
                    result[i] = pattern.parse.call(self, item);
                    return result[i] !== item;
                }
            }

            while (i--) {
                funcs.some(parseWord); //one pattern per word or it gets too complicated
            }
            result = result.join(" ");
            self.patterns.each(function(pattern) {
                if (pattern.entireStr && pattern.pattern.test(result)) {
                    result = pattern.parse.call(self, result);
                }
            });
            return result;
        },

        parsePunctuation: function(text) {
            var lead = "",
                mid = text,
                end = "";

            function leader(punc) {
                var leadMatch = getLeading(mid, punc);
                if (leadMatch) {
                    mid = mid.slice(leadMatch.length);
                    lead += leadMatch;
                    return true;
                }
            }

            function trailer(punc) {
                var endMatch = getTrailing(mid, punc);
                if (endMatch) {
                    mid = mid.slice(0, mid.length - endMatch.length);
                    end = endMatch + end;
                    return true;
                }
            }

            // Note: destructive calls
            while (this.leading_punctuation.some(leader)) {}
            while (this.trailing_punctuation.some(trailer)) {}

            return {
                lead: lead,
                mid: mid,
                end: end
            };
        },

        patterns: [],

        addPattern: function(reg, action, whole) {
            this.patterns.push({
                pattern: reg,
                parse: action,
                entireStr: whole || false
            });
            return this;
        }
    });
})();
