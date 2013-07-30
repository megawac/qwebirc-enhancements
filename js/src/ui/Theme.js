
ui.Theme = new Class({
    initialize: function(themeDict) {
        var self = this,
            theme = self.__theme = Object.clone(ui.themes.Default2);

        if (themeDict) {
            // for (var k in themeDict) {
            //     theme[k] = themeDict[k];
            // }
            $extend(theme, themeDict);
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

        self.__ccmap = Object.clone(ui.themes.ThemeControlCodeMap2);
        self.__ccmaph = Object.clone(self.__ccmap);

        self.__ccmaph["("] = self.message("HILIGHT", {}, self.__ccmap);
        self.__ccmaph[")"] = self.message("HILIGHTEND", {}, self.__ccmap);
        self.__ccmaph["{"] = self.__ccmaph["}"] = "";
    },

    __dollarSubstitute: function(x, h, mapper) {
        return x.substitute(Object.append(h||{}, mapper||{}))
    },

    formatMessage: function($ele, type, _data, highlight) {
        var self = this,
            isobj = $type(_data) == "object",
            data = isobj ? Object.clone(_data) : _data,
            val;

        if(isobj) {

            if (data["n"]){
                data["N"] = "qwebirc://whois/" + data.n + "/";
            }
            //now all we have to do is format the data as desired and pass to theme
            ["N", "m"].each(function(key) {//urlerize message and nick
                val = data[key];
                if(val) {
                    if(Array.isArray(val)) { //modes are given as an array so we need to fold
                        val = val.join("");
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
        var result = this.colourise(this.urlerize(line));
        $ele.addClass('colourline')
            .insertAdjacentHTML('beforeend', result);
        return result;
    },

    colourise: function(line) {//http://www.mirc.com/colors.html http://www.aviran.org/2011/12/stripremove-irc-client-control-characters/
        //regexs are cruel to parse this thing

        // if($type(data) === "string")
        //     return line;

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
                    'text': styled[0]
                });
                result.replace(style.key + styled[0] + style.key, html);
            };
        });

        return result;
    },

    urlerize: function(text) {
        return urlifier.urlerize(text);
    }
});
