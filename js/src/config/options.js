/**
 * ui options model
 * @depends [util/lang, util/constants, config]
 * @provides [config/OptionModel]
 */
ui["default options"] = {
    "auto_open_pm": false,
    "nick_ov_status": true,
    "accept_service_invites": true,
    "use_hiddenhost": true,
    "lastpos_line": true,
    "hide_joinparts": false,
    "show_nicklist": !Browser.isMobile,
    "show_timestamps": true,
    "image_popovers": !Browser.isMobile,
    "font_size": 12,
    "volume": 100, //0-100

    "completer": {
        "intrusive": Browser.isDecent,
        "store": !Browser.isMobile
    },

    "brouhaha": {
        //"local": true,//don't join #brouhaha
        "enabled": true
    },

    "dn_state": false,
    "dn_duration": 4000,

    "beep_sound": "beep", //classic facebook beep notification by default see Notifiers.js

    "highlight": true,
    "highlight_mentioned": true,

    "colour": {
        //hex format (note # infront is optional)
        "background": "f0f7ff",
        "font": "000"
    },

    "quit_msg": "Page closed",

    "standard_notices": [
        {
            type: "(?!SERVER)NOTICE$",//notice not server notice
            beep: true,
            tabhl: constants.hl.speech,
            id: "notice"
        },
        {
            type: "PRIVMSG$",
            flash: true,
            beep: true,
            pm: true,
            tabhl: constants.hl.speech,
            id: "pm"
        },
        {
            type: "^OUR",
            classes: "our-msg",
            id: "ourmsg"
        },
        {
            msg: "^\\!",
            classes: "command",
            types: [ui.WINDOW.channel],
            id: "cmd"
        },
        {
            mentioned: true,
            highlight: "mentioned",
            notus: true,
            tabhl: constants.hl.us,
            id: "mention"
        },
        {//match bots
            nick: "(serv|bot)$",
            classes: "bot",
            types: [ui.WINDOW.channel],
            "case": true,
            id: "bot"
        },
        {
            nick: "^((?!((serv|bot)$)).)*$",
            mentioned: true,
            beep: true,
            pm: true,
            notus: true,
            "case": true,
            id: "onmention"
        },
        {
            nick: "^((?!((serv|bot)$)).)*$",
            msg: "^((?!(^\\!)).)*$", //dont hl commands
            highlight: true,
            notus: true,
            "case": true,
            tabhl: constants.hl.activity,
            types: [ui.WINDOW.channel],
            id: "hl"
        }
    ],

    "custom_notices": []
};

config.OptionModel = new Class({
    Extends: Epitome.Model.Storage,
    options: {
        defaults: ui["default options"],
        key: cookies.options,
        minimize: true
    },

    properties: {
        colour: {
            set: function(colours) {
                return Object.map(colours, function(val) {
                    return new Color(val);
                });
            }
        }
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
                description: ""
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
