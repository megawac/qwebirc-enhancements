
ui.OptionView = new Class({
    Extends: PanelView,
    Binds: ['save', 'reset'],
    options: {
        pane: 'options',
        events: {
            'change:relay(#options input)': 'inputChange',
            'change:relay(#options .notice-group input)': 'noticeChange',
            'click:relay(#options #add-notice)': 'addNotifier',
            'click:relay(#options .remove-notice)': 'removeNotifier',
            'click:relay(#options #dn_state)': 'dnToggle',
            'click:relay(#options #notice-test)': 'noticeTest'
        },
        
        onDnToggle: function(e, target) {
            toggleNotifications(this.model);
            target.val(this.model.get('dn_state') ? lang.DISABLE : lang.ENABLE);
        },

        onReady: function() {
            return this.render();
        }

        //get ui
    },

    /*********LISTENERS**************/

    inputChange: function(e, target) {//set model values when inputs are clicked
        var id = target.get('id');

        //handle sub props
        if(id && $defined(this.model.get(id))) {
            this.model.set(id, target.val());
        }
    },

    addNotifier: function(data) {
        if(!data || Type.isDOMEvent(data)) {
            data = this.model.defaultNotice();
            var n = _.clone(this.model.get("custom_notices"));
            n.push(data);
            this.model.set("custom_notices", n);
        }

        var $addbtn = this.element.getElement('#add-notice'/*'#custom_notices .panel-body'*/);

        var _data = _.clone(data);
        _data.lang = lang;

        var temp = templates.customNotice(_data);

        $addbtn.insertAdjacentHTML('beforebegin', temp);//insert before btn
    },

    removeNotifier: function(e, target) {
        e.stop();
        var type = target.getParent('.notice-group').id;
        var par = target.getParent('.controls').dispose();
        var id = par.get("data-id");
        this.model.set('custom_notices', (_.reject(this.model.get(type), function(xs) {return xs.id === id})));
    },

    noticeChange: function(e, target) {
        e.stop();
        var type = target.getParent('.notice-group').id;
        var notices = _.clone(this.model.get(type));
        var par = target.getParent('.controls');
        var notice = _.findWhere(notices, {id: par.get("data-id")});
        notice[target.get('data-id')] = target.val();
        this.model.set('custom_notices', notices);
    },
    /*********LISTENERS**************/

    postRender: function() {
        var model = this.model,
            options = this.options;

        // _.each(model.get("custom_notices"), function(notice) {
        //     notice.lang = lang;
        //     this.addNotifier(notice);
        // }, this);

        this.element.getElements(".slider").each(function(slider) {
            var id = slider.get('id'),
                knob = slider.getElement('.knob');
                new Slider(slider, knob, {
                    steps: 36,
                    range: [0, 369],
                    wheel: true
                }).addEvent("change", function(val) {
                    model.set(id, val);
                })
                .set(model.get(id));
        });

        this.element.getElement('#options').addEvents({ //default will fire before bubble
            'submit': this.save,
            'reset': this.reset
        });

        if(_.isFunction(options.getUI)) {
            ui.WelcomePane.show(options.getUI(), {
                element: this.element
            });
        }

        return this.parent();
    },

    getData: function() {
        var data = this.model.toJSON();
        // data.lang = lang;
        return data;
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