

(function(){

config.OptionModel = new Class({
    Extends: Epitome.Model.Storage,
    options: {
        defaults: {
            "flash_on_mention": true,
            "dedicated_msg_window": false,
            "dedicated_notice_window": true,
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
            "font_size": 12,
            "volume": 100,

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
                    }
                }
        },
        key: "qweboptions",
        minimize: true
    },

    save: function() {
        this.set("custom_notices", _.reject(this.get("custom_notices"), function(data) { return data.msg.trim() === "" }));//cleanup
        return this.parent();
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
            'change:relay(#options input)': 'inputChange',
            'change:relay(#options #standard-notices input)': 'snoticeChange',
            'change:relay(#options #custom-notices input)': 'noticeChange',
            'click:relay(#options #add-notice)': 'addNotifier',
            'click:relay(#options #custom-notices .remove-notice)': 'removeNotifier'

        },

        onInputChange: function(e, target) {//set model values when inputs are clicked
            var id = target.get('id');

            //handle sub props
            if(id && $defined(this.model.get(id))) {
                this.model.set(id, target.val());
            }
        },

        onSnoticeChange: function(e, target) {
            e.stop();
            var notices = _.clone(this.model.get('notices'));
            _.assign(notices, target.get('id'), target.val());
            this.model.set('notices', notices);
        },

        onNoticeChange: function(e, target) {
            e.stop();
            var notices = _.clone(this.model.get('custom_notices'));
            var par = target.getParent('.custom-notice');
            _.findWhere(notices, {id: par.id})[target.get('data-id')] = target.val();
            this.model.set('custom_notices', notices);
        },

        onAddNotifier: function(e) {
            e.stop();
            this.addNotifier();
        },

        onRemoveNotifier: function(e, target) {
            e.stop();
            var par = target.getParent('.custom-notice').dispose();
            this.model.set('custom_notices', (_.reject(this.model.get('custom_notices'), function(xs) {return xs.id === par.id})))
        },

        onReady: render
    },

    render: function() {
        var model = this.model,
            data = this.getData();
        this.element.html(this.template(data));

        _.each(data.custom_notices, function(notice) {
            notice.lang = lang;
            this.addNotifier(notice)
        }, this);

        // this.tabs = new MGFX.Tabs(this.element, {
        //     tabs: '.option-tabs li',
        //     content: '.tab-content .control-group'
        // });

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
        });

        self.behavior = new Behavior().apply(this.element);

        this.parent();
        return this;
    },

    addNotifier: function(data) {
        if(!data) {
            data = this.model.get("default_notice")();
            var n = _.clone(this.model.get("custom_notices"));
            n.push(data);
            this.model.set("custom_notices", n);
        }

        var parent = this.element.getElement('#custom-notices');

        var _data = _.clone(data);
        _data.lang = lang;

        var temp = templates.customNotice(_data);

        parent.insertAdjacentHTML('beforeend', temp);
    },

    getData: function() {
        var data = this.model.toJSON();
        data.lang = lang;
        return data;
    },

    empty: function() {
        this.parent(true);
    },

    save: function(e) {
        if(e) e.stop();
        this.model.save();
        this.destroy();
    },

    reset: function(e) {
        if(e) e.stop();
        this.model.sync();
        this.destroy();
    },

    destroy: function() {
        this.trigger('close');
        return this.parent();
    }
});
})();
