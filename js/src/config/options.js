
config.OptionModel = new Class({
    Extends: Epitome.Model.Storage,
    options: {
        defaults: {
            "auto_open_pm": false,
            "nick_ov_status": true,
            "accept_service_invites": true,
            "use_hiddenhost": true,
            "lastpos_line": true,
            "nick_colours": false,
            "hide_joinparts": false,
            "show_nicklist": !Browser.isMobile,
            "show_timestamps": true,
            "font_size": 12,
            "volume": 100, //0-100

            "completer": {
                "intrusive": Browser.isDecent,
                "store": !Browser.isMobile
            },

            "dn_state": false,
            "dn_duration": 4000,

            "highlight": true,
            "highlight_mentioned": true,

            "style_hue": 210,
            "style_saturation": 0,
            "style_brightness": 0,

            "standard_notices": [
                {
                    type: "^(?!SERVER)+NOTICE+$",//notice not server notice
                    classes: '',
                    beep: true,
                    tabhl: ui.HIGHLIGHT.speech,
                    id: 'notice'
                },
                {
                    type: "PRIVMSG$",
                    flash: true,
                    beep: true,
                    pm: true,
                    tabhl: ui.HIGHLIGHT.speech,
                    id: 'pm'
                },
                {
                    type: "^OUR",
                    classes: 'our-msg',
                    id: 'ourmsg'
                },
                {//match bots
                    nick: "(^tf2)|((serv|bot)$)",
                    classes: 'bot',
                    types: [ui.WINDOW.channel],
                    "case": true,
                    id: 'bot'
                },
                {
                    msg: "^\\!",
                    classes: 'command',
                    types: [ui.WINDOW.channel],
                    id: 'cmd'
                },
                {
                    mentioned: true,
                    highlight: 'mentioned',
                    notus: true,
                    tabhl: ui.HIGHLIGHT.us,
                    id: 'mention'
                },
                {
                    nick: "^((?!(^tf2|bot$|serv$)).)*$",
                    mentioned: true,
                    classes: '',
                    beep: true,
                    pm: true,
                    notus: true,
                    "case": true,
                    id: 'onmention'
                },
                {
                    nick: "^((?!(^tf2|bot$|serv$)).)*$",
                    msg: "^((?!(^\\!)).)*$", //dont hl commands
                    classes: '',
                    highlight: true,
                    notus: true,
                    "case": true,
                    tabhl: ui.HIGHLIGHT.activity,
                    types: [ui.WINDOW.channel],
                    id: 'hl'
                }
            ],

            "custom_notices": []
        },
        key: cookies.options,
        minimize: true
    },

    defaultNotice: function() {//default custom notice
        return {
                // nick: '',
                // msg: '',
                // type: '',
                // flash: false,
                // beep: false,
                // pm: false,
                id: String.uniqueID(),
                autoescape: true,
                description: ''
            };
    },

    notice_filter: function(data) {
        return !(!data.msg || data.msg.trim() === "") || !(!data.nick || data.nick.trim() === "") || !(!data.type || data.type.trim() === "") || data.notus;
    },

    //storing procedures
    save: function() {
        this.set("custom_notices", _.filter(this.get("custom_notices"), this.notice_filter));//cleanup
        this.set("standard_notices", _.filter(this.get("standard_notices"), this.notice_filter));//cleanup
        return this.parent();
    },


    set: function(key, data) {
        var props = key.split(".");
        if(props.length > 1) {
            var item = this.get(props[0]);
            return this.parent(props[0], _.assign(item, key, data));
        } else {
            this.parent(key, data);
        }
    }.overloadSetter()
});
