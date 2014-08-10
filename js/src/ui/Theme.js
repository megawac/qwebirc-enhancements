/**
 * Should migrate to utils wherever possible
 *
 * @depends [config/theme-templates, util/colourise]
 * @depends [util/constants, util/utils, util/urlifier]
 * @provides [ui/Theme]
 */
ui.Theme = new Class({
    initialize: function() {
        this._theme = Object.map(config.IRCTemplates, function(str) {
            // localize
            str = util.formatSafe(str, lang, /\{lang ([^{}]+)\}/g);
            // set controls
            return util.formatSafe(str, config.ThemeControlCodeMap);
        });

        this.highlightClasses.channels = {};
    },

    //I'm under the assumption i dont need to strip tags as handlebars should escape them for me
    formatMessage: function(/*$ele, */type, _data) {
        var self = this;
        var isobj = _.isObject(_data);
        var data = isobj ? _.clone(_data) : _data; //sometimes an internal reference

        if (isobj) {
            if ("n" in data) {
                //works slightly harder than it has too :/
                data.N = templates.userlink(data);
                data.nicktmpl = templates.ircnick(data);
            }
            //now all we have to do is format the data as desired and pass to theme
            ["m", "c"].each(function(key) {//urlerize message and nick
                var val = data[key];
                if (val) {
                    if (_.isArray(val)) { //modes are given as an array so we need to fold
                        val = val.join("");
                    }
                    data[key] = self.urlerize(val);
                }
            });
        }


        var themed = type ? self.formatText(type, data) : data;
        var result = util.colourise(themed);
        // $ele/*.addClass("colourline")*/
        //     .insertAdjacentHTML("beforeend", result);
        return result;
    },

    formatTopic: function(topic, $ele) {
        var result = util.colourise(this.urlerize(topic));
        $ele.addClass("colourline")
            .adopt(Elements.from(templates.topicText({
                title: topic,
                topic: result
            })));
        return result;
    },

    formatText: function(type, data) {
        return util.format(this._theme[type], data);//most formatting done on init
    },

    urlerize: function(text) {
        return util.urlifier.parse(text);
    },

    messageParsers: [],

    highlightClasses: ["highlight1", "highlight2"/*, "highlight3"*/],

    //Applies highlighting and gives user notice based on user settings from options/notices
    highlightAndNotice: function(data, type, win, $ele) {
        var self = this,
            tabHighlight = constants.hl.none,
            highlights = self.highlightClasses,
            nick = win.client.nickname,
            notus = data.n !== nick;

        if (data && type && /(NOTICE|ACTION|MSG)$/.test(type)) {
            if(data.m) {
                $ele.addClass("message");
            }
            /* jshint maxcomplexity:false */
            self.messageParsers.each(function(parser) {
                //sorry little crazy :)
                if ( (!parser.notus || notus) &&//implications - organized them by complexity
                    (!parser.types || parser.types.contains(win.type)) &&
                    (!parser.type || parser.type.test(type)) &&
                    (!parser.msg || parser.msg.test(data.m)) &&
                    (!parser.nick || parser.nick.test(data.n)) &&
                    (!parser.mentioned || util.containsWord(nick, data.m)) )
                {
                    if ((!win.active && win.id !== constants.brouhaha) || (!document.hasFocus()) ) {
                        if (parser.flash) {
                            win.parentObject.flash();
                        }
                        if (parser.beep) {
                            win.parentObject.beep();
                        }
                        if (parser.pm) {
                            win.parentObject.showNotice({
                                title: "IRC " + type + "!",
                                body: util.format("{nick}({channel}): {message}", data)
                            });
                        }
                    }
                    if (parser.highlight) {
                        if (!highlights.channels[win.name]) highlights.channels[win.name] = 0;
                        $ele.addClass(_.isBoolean(parser.highlight) ? util.nextItem(highlights, highlights.channels[win.name]++, 1) : parser.highlight);
                    }
                    if (parser.classes) {
                        $ele.addClass(parser.classes);
                    }
                    tabHighlight = Math.max(tabHighlight, parser.tabhl);
                }
            });
        }
        return tabHighlight;
    }
});
