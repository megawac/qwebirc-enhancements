/**
 * Should migrate to utils
 *
 * @depends [config/theme-templates, config/styles]
 * @depends [util/constants, util/utils, util/urlifier]
 * @provides [ui/Theme]
 */
ui.Theme = new Class({
    initialize: function(uiOptions, themeDict) {
        var self = this,
            defaults = _.extend({}, config.ThemeIRCTemplates, themeDict);
        
        var thememap = Object.map(config.ThemeControlCodeMap, function(str) {
            return util.formatSafe(str, config.ThemeControlCodeMap);
        });
        self._theme = Object.map(defaults, function(str) {
            return util.formatSafe(str, thememap);
        });

        self.highlightClasses.channels = {};
        self.config = uiOptions;
    },

    //I'm under the assumption i dont need to strip tags as handlebars should escape them for me
    formatMessage: function($ele, type, _data) {
        var self = this,
            isobj = _.isObject(_data),
            data = isobj ? _.clone(_data) : _data; //sometimes an internal reference

        if(isobj) {
            if ("n" in data) {
                //works slightly harder than it has too :/
                data.N = templates.userlink(data);
                data.nicktmpl = templates.ircnick(data);
            }
            //now all we have to do is format the data as desired and pass to theme
            ["m", "c"].each(function(key) {//urlerize message and nick
                var val = data[key];
                if(val) {
                    if(_.isArray(val)) { //modes are given as an array so we need to fold
                        val = val.join("");
                    }
                    data[key] = self.urlerize(val);
                }
            });
        }


        var themed = type ? self.formatText(type, data) : data;
        var result = self.colourise(themed);
        var timestamp = self.config && self.config.get("show_timestamps") ? templates.timestamp({time:util.IRCTimestamp(new Date())}) : "";
        $ele/*.addClass("colourline")*/
            .insertAdjacentHTML("beforeend", timestamp + result);
        return result;
    },

    formatTopic: function(topic, $ele) {
        var result = this.colourise(this.urlerize(topic));
        $ele.addClass("colourline")
            .adopt(Elements.from(templates.topicText({
                title: topic,
                topic: result
            })));
        return result;
    },

    formatText: function(type, data) {
        return util.formatter(this._theme[type], data);//most formatting done on init
    },

    colourise: function(line) {//http://www.mirc.com/colors.html http://www.aviran.org/2011/12/stripremove-irc-client-control-characters/
        //regexs are cruel to parse this thing

        var result = line;

        var styles = irc.styles;

        var parseArr = _.compact(result.split(styles.colour.key));

        //crude mapper for matching the start of a colour string to its end token may be possible to do with reduce?
        //will be an array of subarrays for each coloured string
        var colouredarr = parseArr.reduce(function(memo, str) {
            if( /^\d/.test(str) ) { //^C...
                _.last(memo).push(str);
            } else { //^C1***
                memo.push([]);
            }
            return memo;
        }, [[]]);

        parseArr.each(function(str) {//help
            if( /^\d/.test(str) ) { //^C...
                _.last(colouredarr).push(str);
            } else { //^C1***
                colouredarr.push([]);
            }
        });

        colouredarr.each(function(colourarr) {
            colourarr.each(function(str) {
                var colourMatch = str.match(styles.colour.fore_re),
                    backgroundMatch = str.match(styles.colour.back_re),
                    colour = util.getColourByKey(_.item(colourMatch, 0)),
                    background = util.getColourByKey(_.last(backgroundMatch));//num aft num + comma

                var html = templates.ircstyle({
                    "colour": (colour ? colour.fore : ""),
                    "background": (background ? background.back : ""),
                    "text": str.slice(backgroundMatch ? backgroundMatch[0].length : colourMatch ? colourMatch[0].length : 0)
                });

                //would not be difficult to support nesting... just wouldnt be able to use templates but build in place (open when arr.length close on empty). The irc
                // colour "spec" is too whack to be bothered for now...
                result = result.replace(styles.colour.key + str, html);
            });
        });

        //matching styles (italics bold under)
        _.each(styles.special, function(style) {//i wish colours were this easy
            result = result.replace(style.keyregex, function(match, text) {
                return templates.ircstyle({
                    "style": style.style,
                    "text": text
                });
            });
        });

        return result;
    },

    urlerize: function(text) {
        return util.urlifier.parse(text);
    },

    messageParsers: [],

    highlightClasses: ["highlight1", "highlight2"/*, "highlight3"*/],

    highlightAndNotice: function(data, type, win, $ele) {
        var self = this,
            tabHighlight = ui.HIGHLIGHT.none,
            highlights = self.highlightClasses,
            nick = win.client.nickname,
            notus = data.n !== nick;

        if(data && type && /(NOTICE|ACTION|MSG)$/.test(type)) {
            if(data.m) {
                $ele.addClass("message");
            }
            /* jshint maxcomplexity:false */
            self.messageParsers.each(function(parser) {
                //sorry little crazy :)
                if( (!parser.notus || notus) &&//implications - organized them by complexity
                    (!parser.types || parser.types.contains(win.type)) &&
                    (!parser.type || parser.type.test(type)) &&
                    (!parser.msg || parser.msg.test(data.m)) &&
                    (!parser.nick || parser.nick.test(data.n)) &&
                    (!parser.mentioned || util.testForNick(nick, data.m)) )
                {
                    if((!win.active && win.id !== constants.brouhaha) || (!document.hasFocus()) ) {
                        if(parser.flash) {
                            win.parentObject.flash();
                        }
                        if(parser.beep) {
                            win.parentObject.beep();
                        }
                        if(parser.pm) {
                            win.parentObject.showNotice({
                                title: "IRC " + type + "!",
                                body: util.format("{nick}({channel}): {message}", data)
                            });
                        }
                    }
                    if(parser.highlight) {
                        if(!highlights.channels[win.name]) highlights.channels[win.name] = 0;
                        $ele.addClass(_.isBoolean(parser.highlight) ? _.nextItem(highlights, highlights.channels[win.name]++, 1) : parser.highlight);
                    }
                    if(parser.classes) {
                        $ele.addClass(parser.classes);
                    }
                    tabHighlight = Math.max(tabHighlight, parser.tabhl);
                }
            });
        }
        return tabHighlight;
    }
});
