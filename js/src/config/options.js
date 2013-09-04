
config.OptionModel = new Class({
    Extends: Epitome.Model.Storage,
    options: {
        defaults: {
            "auto_open_pm": true,
            "nick_ov_status": true,
            "accept_service_invites": true,
            "use_hiddenhost": true,
            "lastpos_line": true,
            "nick_colours": false,
            "hide_joinparts": false,
            "query_on_nick_click": true,
            // "show_nicklist": true,
            "show_timestamps": true,
            "font_size": 12,
            "volume": 10, //0-10

            "dn_state": false,
            "dn_duration": 4000,

            "highlight": true,
            "highlight_mentioned": true,

            "style_hue": 210,
            "style_saturation": 0,
            "style_brightness": 0,

            "notices": {
                "on_mention": {flash:true, beep:true},
                "on_pm": {flash:true, beep:true},
                "on_notice": {flash:false, beep:true}
            },
            "custom_notices": [],
            "default_notice": function() {
                return {
                        nick: null,
                        msg: '',
                        flash: false,
                        beep: false,
                        id: String.uniqueID(),
                        autoescape: true
                    };
                }
        },
        key: cookies.options,
        minimize: true
    },

    save: function() {
        this.set("custom_notices", _.reject(this.get("custom_notices"), function(data) { return data.msg.trim() === "" }));//cleanup
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
