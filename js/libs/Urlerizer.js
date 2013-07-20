
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
    function htmlescape(html) {
        return html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    }

    var trailing_punctuation_django = ['.', ',', ':', ';'];
    var trailing_punctuation_improved = ['.', ',', ':', ';', '.)'];
    var wrapping_punctuation_django = [
        ['(', ')'],
        ['<', '>'],
        ['&lt;', '&gt;']
    ];
    var wrapping_punctuation_improved = [
        ['(', ')'],
        ['<', '>'],
        ['&lt;', '&gt;'],
        ['“', '”'],
        ['‘', '’']
    ];
    var word_split_re_django = /(\s+)/;
    var word_split_re_improved = /([\s<>"]+)/;
    var simple_url_re = /^https?:\/\/\w/;
    var simple_url_2_re = /^www\.|^(?!http)\w[^@]+\.(com|edu|gov|int|mil|net|org)$/;
    var simple_email_re = /^\S+@\S+\.\S+$/;


    self.Urlerizer = new Class({
        Implements: [Options],
        options: {
            nofollow: false,
            autoescape: true,
            trim_url_limit: false, //length of a url before it is trimmed
            target: false,
            django_compatible: true
        },

        initialize: function(opts) {
            this.setOptions(opts);
        },

        urlerize: function(text) {
            var self = this,
                result = text.split(" "),
                funcs = self.patterns.filter(function(pat) {
                    return !pat.wholeWord || pat.pattern.test(text);
                });

            for (var i = result.length - 1, item; i >= 0; i--) {
                item = result[i];

                funcs.each(function(pattern) { //TODO: important optimization - split words and apply only one fn to each word
                    if(pattern.pattern.test(item)) {
                        result[i] = pattern.parse.call(self, item);
                    }
                });
            };
            self.patterns.each(function(pattern) {
                if(pattern.wholeWord && pattern.pattern.test(result)) {
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

        patterns: [{
            pattern: /[a-zA-Z]\.[a-zA-Z]{2,4}/i,//i think this should pass tests on all valid urls... will also pick up things like test.test
            wholeWord: false,
            parse: function (text) {
                var options = this.options;
                var safe_input = false;
                var word_split_re = options.django_compatible ? word_split_re_django : word_split_re_improved;
                var trailing_punctuation = options.django_compatible ? trailing_punctuation_django : trailing_punctuation_improved;
                var wrapping_punctuation = options.django_compatible ? wrapping_punctuation_django : wrapping_punctuation_improved;
                var words = text.split(word_split_re);
                for (var i = 0; i < words.length; i++) {
                    var word = words[i];
                    var match = undefined;
                    if (word.contains('.') || word.contains('@') || word.contains(':')) {
                        // Deal with punctuation.
                        var lead = '';
                        var middle = word;
                        var trail = '';
                        for (var j = 0; j < trailing_punctuation.length; j++) {
                            var punctuation = trailing_punctuation[j];
                            if (middle.endsWith(punctuation)) {
                                middle = middle.substr(0, middle.length - punctuation.length);
                                trail = punctuation + trail;
                            }
                        }
                        for (var j = 0; j < wrapping_punctuation.length; j++) {
                            var opening = wrapping_punctuation[j][0];
                            var closing = wrapping_punctuation[j][1];
                            if (middle.startsWith(opening)) {
                                middle = middle.substr(opening.length);
                                lead = lead + opening;
                            }
                            // Keep parentheses at the end only if they're balanced.
                            if (middle.endsWith(closing) && occurrences(middle, closing) == occurrences(middle, opening) + 1) {
                                middle = middle.substr(0, middle.length - closing.length);
                                trail = closing + trail;
                            }
                        }

                        // Make URL we want to point to.
                        var url = undefined;
                        var nofollow_attr = options.nofollow ? ' rel="nofollow"' : '';
                        var target_attr = options.target ? ' target="' + options.target + '"' : '';

                        if (middle.match(simple_url_re)) url = smart_urlquote(middle);
                        else if (middle.match(simple_url_2_re)) url = smart_urlquote('http://' + middle);
                        else if (middle.indexOf(':') == -1 && middle.match(simple_email_re)) {
                            // XXX: Not handling IDN.
                            url = 'mailto:' + middle;
                            nofollow_attr = '';
                        }

                        // Make link.
                        if (url) {
                            var trimmed = this.trimURL(middle);
                            if (options.autoescape) {
                                // XXX: Assuming autoscape == false
                                lead = htmlescape(lead);
                                trail = htmlescape(trail);
                                url = htmlescape(url);
                                trimmed = htmlescape(trimmed);
                            }
                            middle = '<a href="' + url + '"' + nofollow_attr + target_attr + '>' + trimmed + '</a>';
                            words[i] = lead + middle + trail;
                        } else {
                            if (safe_input) {
                                // Do nothing, as we have no mark_safe.
                            } else if (options.autoescape) {
                                words[i] = htmlescape(word);
                            }
                        }
                    } else if (safe_input) {
                        // Do nothing, as we have no mark_safe.
                    } else if (options.autoescape) {
                        words[i] = htmlescape(word);
                    }
                }
                return words.join('');
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
