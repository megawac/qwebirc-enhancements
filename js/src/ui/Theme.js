
ui.Theme = new Class({
    initialize: function(themeDict) {
        var self = this,
            theme = self.__theme = Object.clone(ui.themes.Default2);

        if (themeDict) {
            // for (var k in themeDict) {
            //     theme[k] = themeDict[k];
            // }
            Object.append(theme, themeDict);
        }
        Object.each(theme, function(data, key) {
            if (key === "PREFIX")
                return;

            if (data[1]) {
                theme[key] = theme.PREFIX + data[0];
            } else {
                theme[key] = data[0];
            }
        });

        self.highlightClasses.channels = {};

        self.__ccmap = Object.clone(ui.themes.ThemeControlCodeMap2);
        self.__ccmaph = Object.clone(self.__ccmap);

        self.__ccmaph["("] = self.message("HILIGHT", {}, self.__ccmap);
        self.__ccmaph[")"] = self.message("HILIGHTEND", {}, self.__ccmap);
        self.__ccmaph["{"] = self.__ccmaph["}"] = "";
    },

    __dollarSubstitute: function(str, data, mapper) {
        return str.substitute(Object.append(data||{}, mapper||{}))
    },

    formatMessage: function($ele, type, _data, highlight) {
        var self = this,
            isobj = Type.isObject(_data),
            data = isobj ? Object.clone(_data) : _data, //sometimes an internal reference
            val;

        if(isobj) {

            if (data["n"]){
                data["N"] = "qwebirc://whois/" + data.n.stripScripts(false) + "/";
            }
            //now all we have to do is format the data as desired and pass to theme
            ["N", "m"].each(function(key) {//urlerize message and nick
                val = data[key];
                if(val) {
                    if(Array.isArray(val)) { //modes are given as an array so we need to fold
                        val = val.join("").stripScripts(false);
                    }
                    data[key] = self.urlerize(val);
                }
            });
        }


        var themed = type ? self.message(type, data, highlight) : data;
        var result = self.colourise(themed);
        $ele.addClass('colourline')
            .insertAdjacentHTML('beforeend', result);
        return result;
    },

    message: function(type, data, highlight) {
        var map = highlight ? this.__ccmaph : this.__ccmap;

        return this.__dollarSubstitute(this.__theme[type], data, map);
    },

    formatElement: function(line, $ele) {
        var result = this.colourise(this.urlerize(line.stripScripts(false)));
        $ele.addClass('colourline')
            .insertAdjacentHTML('beforeend', result);
        return result;
    },

    colourise: function(line) {//http://www.mirc.com/colors.html http://www.aviran.org/2011/12/stripremove-irc-client-control-characters/
        //regexs are cruel to parse this thing

        var result = line;

        var parseArr = result.split("\x03").filter( $chk );

        //crude mapper for matching the start of a colour string to its end token may be possible to do with reduce?
        var colouredarr = [[]]; //will be an array of subarrays for each coloured string

        parseArr.each(function(str) {
            if( isNaN(str.slice(0, 2).toInt()) ) { //^C...
                colouredarr.push([]);
            } else { //^C1***
                colouredarr.getLast().push(str);
            }
        });

        colouredarr.each(function(colourarr) {
            colourarr.each(function(str) {
                var colourMatch = str.match(/^(\d{1,2})/),
                    backgroundMatch = str.match(/^((\d{1,2})+,+(\d{1,2}))/),
                    colour = util.getColourByKey(Array.item(colourMatch, 0)),
                    background = util.getColourByKey(Array.getLast(backgroundMatch));//num aft num + comma

                var html = templates.ircstyle({
                    'colour': (colour ? colour.fore : ""),
                    'background': (background ? background.back : ""),
                    'text': str.slice(backgroundMatch ? backgroundMatch[0].length : colourMatch ? colourMatch[0].length : 0)
                });


                result = result.replace("\x03" + str, html);
            })
        });

        //matching styles (italics bold under)
        irc.styles.each(function(style) {
            parseArr = result.split(style.key);

            if(parseArr.length % 2 != 1) {
                console.log(parseArr);
            }

            //seems cleaner than filtering by index and then doing an each i think
            for (var i = 1, styled; i < parseArr.length; i+=2) {
                styled = parseArr[i];
                var html = templates.ircstyle({
                    'style': style.style,
                    'text': styled
                });
                result = result.replace(style.key + styled + style.key, html);
            };
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
            id: 'notify_on_notice',
            highlight: ui.HILIGHT_SPEECH
        },
        {
            type: /PRIVMSG$/,
            flash: true,
            beep: true,
            id: 'notify_on_pm',
            highlight: ui.HILIGHT_SPEECH
        },
        {
            type: /^OUR/,
            classes: 'our-msg'
        },
        {//match bots
            nic: /(^tf2)|((serv|bot)$)/i,
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
            classes: 'mentioned',
            notus: true,
            tabhl: ui.HILIGHT_US
        },
        {
            nic: /^((?!(^tf2|bot$|serv$)).)*$/i,
            mentioned: true,
            classes: '',
            beep: true,
            flash: true,
            notus: true,
            id: 'notify_on_mention'//for filtering
        },
        {
            nic: /^((?!(^tf2|bot$|serv$)).)*$/i,
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
            notus = !(/^OUR/.test(type));//wish we could just use not selector

        if(data && type && /(NOTICE|ACTION|MSG)$/.test(type)) {
            if(data.m)
                $ele.addClass('message');
            self.messageParsers.each(function(parser) {
                //sorry little crazy :)
                if( (!parser.notus || notus) &&//implications - organized them by complexity
                    (!parser.types || parser.types.contains(win.type)) &&
                    (!parser.type || parser.type.test(type)) && 
                    (!parser.msg || parser.msg.test(data.m)) &&
                    (!parser.nic || parser.nic.test(data.n)) &&
                    (!parser.mentioned || util.testForNick(win.client.nickname, data.m)) )
                {
                    if(win.active && win.name !== BROUHAHA) {
                        if(parser.flash) {
                            win.parentObject.flash();
                        }
                        if(parser.beep) {
                            win.parentObject.beep();
                        }
                    }   
                    if(parser.highlight) {
                        if(!highlights.channels[win.name]) highlights.channels[win.name] = 0;
                        $ele.addClass(highlights.next(highlights.channels[win.name]++));
                    }
                    if($chk(parser.classes)) {
                        $ele.addClass(parser.classes);
                    }
                    tabHighlight = Math.max(tabHighlight, parser.tabhl);
                }
            })
        }
        return tabHighlight;
    }
});
