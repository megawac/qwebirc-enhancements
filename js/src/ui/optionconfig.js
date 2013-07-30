

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
            "nick_colours": false,
            "hide_joinparts": true,
            "style_hue": 210,
            "style_saturation": 0,
            "style_brightness": 0,
            "query_on_nick_click": true,
            "show_nicklist": true,
            "show_timestamps": true,
            "font_size": 12
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
    Binds: ['render', 'save', 'reset'],
    options: {
        template: templates.options,
        // 'onChange:model': render,
        events: {
            'change:relay(#options input)': 'inputChange'
        },

        onInputChange: function(e, target) {//set model values when inputs are clicked
            var id = target.get('id');
            if($defined(this.model.get(id))) {
                this.model.set(id, target.val());
            }
        },

        onReady: render
        
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

        this.element.getElement('#options').addEvents({ //default will fire before bubble
            'submit': this.save,
            'reset': this.reset
        })

        this.parent();
        return this;
    },

    empty: function() {
        this.parent(true);
    },

    save: function(e) {
        e.stop();
        this.model.save();
        this.destroy();
        this.trigger('close');
    },

    reset: function(e) {
        e.stop();
        this.model.sync();
        this.destroy();
        this.trigger('close');
    }
});
})()
