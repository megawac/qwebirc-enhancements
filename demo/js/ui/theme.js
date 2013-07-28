qwebirc.ui.Theme = new Class({
    initialize: function(themeDict) {
        this.__theme = qwebirc.util.dictCopy(qwebirc.ui.themes.Default);

        if (themeDict)
            for (var k in themeDict)
                this.__theme[k] = themeDict[k];

        for (var k in this.__theme) {
            if (k == "PREFIX")
                continue;

            var data = this.__theme[k];
            if (data[1]) {
                this.__theme[k] = this.__theme["PREFIX"] + data[0];
            } else {
                this.__theme[k] = data[0];
            }
        }

        this.__ccmap = qwebirc.util.dictCopy(qwebirc.ui.themes.ThemeControlCodeMap);
        this.__ccmaph = qwebirc.util.dictCopy(this.__ccmap);

        this.__ccmaph["("] = this.message("HILIGHT", {}, this.__ccmap);
        this.__ccmaph[")"] = this.message("HILIGHTEND", {}, this.__ccmap);
        this.__ccmaph["{"] = this.__ccmaph["}"] = "";
    },
    __dollarSubstitute: function(x, h, mapper) {
        if (x == '-${$($N$)$}:$c- $m' && h['c'] == '#brouhaha')
            x = '-${$($N$)$}- $m'
        var msg = [];

        var n = x.split("");
        for (var i = 0; i < n.length; i++) {
            var c = n[i];
            if (c == "$" && (i <= n.length - 1)) {
                var c2 = n[++i];

                var o = mapper[c2];
                if (!o)
                    o = h[c2];
                if (o)
                    msg.push(o);
            } else {
                msg.push(c);
            }
        }

        return msg.join("");
    },
    message: function(type, data, hilight) {
        var map;
        if (hilight) {
            map = this.__ccmaph;
        } else {
            map = this.__ccmap;
        }

        if (data && data["n"])
            data["N"] = "qwebirc://whois/" + data.n + "/";
        return this.__dollarSubstitute(this.__theme[type], data, map);
    },
    colourise: function(element, line,  window) {

    },
    urlerize: function(element, text) {
        var result = urlifier.urlerize(text);
        element.insertAdjacentHTML("BeforeEnd", result);
    }
});
