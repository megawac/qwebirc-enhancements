

(function(){

config.OptionModel = new Class({
    Extends: Epitome.Model.Storage,
    options: {
        defaults: {
            "beep_on_mention": true,
            "flash_on_mention": ui.supportsFocus().every(Functional.I),
            "dedicated_msg_window": false,
            "dedicated_notice_window": false,
            "nick_ov_status": true,
            "accept_service_invites": true,
            "use_hiddenhost": true,
            "lastpos_line": true,
            "nick_colours": true,
            "hide_joinparts": true,
            "style_hue": 210,
            "style_saturation": 0,
            "style_brightness": 0,
            "query_on_nick_click": true,
            "show_nicklist": true,
            "show_timestamps": true
        },
        key: "qweboptions",
        minimize: true
    }
});

function render() {
    return this.render();
}

ui.OptionView = new Class({
    Extends: Epitome.View,
    Binds: ['render'],
    options: {
        template: templates.options,
        onReady: render,
        // 'onChange:model': render,
        events: {
            'change:relay(#options input)': 'autoEventHandler'
        }
    },

    render: function() {
        var model = this.model,
            data = model.toJSON();
        data.lang = lang;
        this.empty();
        this.element.html(this.template(data));

        this.tabs = new MGFX.Tabs(this.element, {
            tabs: '.option-tabs li',
            content: '.tab-content .control-group'
        });

        this.element.getElements(".slider").each(function(slider) {
            var id = slider.get('id'),
                knob = slider.getElement('.knob'),
                slider = new Slider(slider, knob, {
                    steps: 36,
                    range: [0, 369],
                    wheel: true
                });
            slider.addEvent("change", function(val) {
                    model.set(id, val);
                })
                .set(data[id])
        });

        this.parent();
        return this;
    },

    empty: function() {
        this.parent(true);
    },

    //if left unhandled
    autoEventHandler: function(e, target) {
        var id = target.get('id');
        if($defined(this.model.get(id))) {
            this.model.set(id, target.get('value'));
        }
    }
});
})()
