
ui.Theme = new Class({
    initialize: function(themeDict) {
        var self = this,
            defaults = _.extend({}, ui.themes.Default2, themeDict);
        
        var thememap = _.map(ui.themes.ThemeControlCodeMap2, function(str) {
            return util.formatterSafe(str, ui.themes.ThemeControlCodeMap2);
        });
        self.__theme = _.map(defaults, function(str) {
            return util.formatterSafe(str, thememap);
        });

        self.highlightClasses.channels = {};
    },

//I'm under the assumption i dont need to strip tags as handlebars should escape them for me

    formatMessage: function($ele, type, _data, highlight) {
        var self = this,
            isobj = _.isObject(_data),
            data = isobj ? _.clone(_data) : _data, //sometimes an internal reference
            val;

        if(isobj) {

            if (data["n"]){
                data["N"] = "qwebirc://whois/" + data.n + "/";
            }
            //now all we have to do is format the data as desired and pass to theme
            _.each(["N", "m", "c"], function(key) {//urlerize message and nick
                val = data[key];
                if(val) {
                    if(_.isArray(val)) { //modes are given as an array so we need to fold
                        val = val.join("");
                    }
                    data[key] = self.urlerize(val);
                }
            });
        }

        var themed = type ? self.formatText(type, data, highlight) : data;
        var result = self.colourise(themed);
        $ele.addClass('colourline')
            .adopt(Elements.from(result));//insertAdjacentHTML may render escaped chars incorrectly
        return result;
    },

    formatElement: function(line, $ele) {
        var result = this.colourise(this.urlerize(line));
        $ele.addClass('colourline')
            .adopt(Elements.from(result));
        return result;
    },

    formatText: function(type, data, highlight) {
        // if(highlight) data = _.extend({}, data, this.__ccmaph)
        return util.formatter(this.__theme[type], data);//most formatting done on init
    },

    colourise: function(line) {//http://www.mirc.com/colors.html http://www.aviran.org/2011/12/stripremove-irc-client-control-characters/
        //regexs are cruel to parse this thing

        var result = line;

        var styles = irc.styles;

        var parseArr = result.split(styles.colour.key).filter( $chk );

        //crude mapper for matching the start of a colour string to its end token may be possible to do with reduce?
        var colouredarr = [[]]; //will be an array of subarrays for each coloured string

        _.each(parseArr, function(str) {//help
            if( isNaN(str.slice(0, 2).toInt()) ) { //^C...
                colouredarr.push([]);
            } else { //^C1***
                _.last(colouredarr).push(str);
            }
        });

        _.each(colouredarr, function(colourarr) {
            _.each(colourarr, function(str) {
                var colourMatch = str.match(styles.colour.fore_re),
                    backgroundMatch = str.match(styles.colour.back_re),
                    colour = util.getColourByKey(_.item(colourMatch, 0)),
                    background = util.getColourByKey(_.last(backgroundMatch));//num aft num + comma

                var html = templates.ircstyle({
                    'colour': (colour ? colour.fore : ""),
                    'background': (background ? background.back : ""),
                    'text': str.slice(backgroundMatch ? backgroundMatch[0].length : colourMatch ? colourMatch[0].length : 0)
                });


                result = result.replace(styles.colour.key + str, html);
            });
        });

        //matching styles (italics bold under)
        _.each(styles.special, function(style) {//i wish colours were this easy
            result = result.replace(style.keyregex, function(match, text) {
                return templates.ircstyle({
                    'style': style.style,
                    'text': text
                });
            });
        });

        return result;
    },

    urlerize: function(text) {
        return util.urlifier.parse(text);
    },

    messageParsers: [
        {
            type: /NOTICE$/,
            classes: '',
            flash: true,
            beep: true,
            id: 'on_notice',
            highlight: ui.HILIGHT_SPEECH
        },
        {
            type: /PRIVMSG$/,
            flash: true,
            beep: true,
            id: 'on_pm',
            highlight: ui.HILIGHT_SPEECH
        },
        {
            type: /^OUR/,
            classes: 'our-msg'
        },
        {//match bots
            nick: /(^tf2)|((serv|bot)$)/i,
            classes: 'bot',
            types: [ui.WINDOW_CHANNEL]
        },
        {
            msg: /^\!/,
            classes: 'command',
            types: [ui.WINDOW_CHANNEL]
        },
        {
            mentioned: true,
            highlight: 'mentioned',
            notus: true,
            tabhl: ui.HILIGHT_US
        },
        {
            nick: /^((?!(^tf2|bot$|serv$)).)*$/i,
            mentioned: true,
            classes: '',
            beep: true,
            flash: true,
            notus: true,
            id: 'on_mention'//for filtering
        },
        {
            nick: /^((?!(^tf2|bot$|serv$)).)*$/i,
            msg: /^((?!(^\!)).)*$/, //dont hl commands
            classes: '',
            highlight: true,
            notus: true,
            id: 'highlighter',
            tabhl: ui.HILIGHT_ACTIVITY,
            types: [ui.WINDOW_CHANNEL]
        }
    ],

    highlightClasses: ['highlight1', 'highlight2'/*, 'highlight3'*/],

    highlightAndNotice: function(data, type, win, $ele) {
        var self = this,
            tabHighlight = ui.HILIGHT_NONE,
            highlights = self.highlightClasses,
            notus = !(/^OUR/.test(type)),
            parsers = _.clone(self.messageParsers).concat(self.customNotices);

        if(data && type && /(NOTICE|ACTION|MSG)$/.test(type)) {
            if(data.m)
                $ele.addClass('message');
            _.each( parsers , function(parser) {
                //sorry little crazy :)
                if( (!parser.notus || notus) &&//implications - organized them by complexity
                    (!parser.types || parser.types.contains(win.type)) &&
                    (!parser.type || parser.type.test(type)) && 
                    (!parser.msg || parser.msg.test(data.m)) &&
                    (!parser.nick || parser.nick.test(data.n)) &&
                    (!parser.mentioned || util.testForNick(win.client.nickname, data.m)) )
                {
                    if((!win.active && win.name !== BROUHAHA) || (!document.hasFocus()) ) {
                        if(parser.flash) {
                            win.parentObject.flash({
                                body: util.formatter("{nick}{channel}: {message}", data)
                            });
                        }
                        if(parser.beep) {
                            win.parentObject.beep();
                        }
                    }   
                    if(parser.highlight) {
                        if(!highlights.channels[win.name]) highlights.channels[win.name] = 0;
                        $ele.addClass(Type.isBoolean(parser.highlight) ? highlights.next(highlights.channels[win.name]++) : parser.highlight);
                    }
                    if($chk(parser.classes)) {
                        $ele.addClass(parser.classes);
                    }
                    tabHighlight = Math.max(tabHighlight, parser.tabhl);
                }
            });
        }
        return tabHighlight;
    }
});
