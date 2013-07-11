
/*
---

name: Overlay

authors:
  - David Walsh (http://davidwalsh.name)

license:
  - MIT-style license

requires: [Core/Class, Core/Element.Style, Core/Element.Event, Core/Element.Dimensions, Core/Fx.Tween]

provides:
  - Overlay
...
*/

var Overlay = new Class({

    Implements: [Options, Events],

    Binds: ['resize', 'scroll', 'overlayClick', 'tweenStart', 'tweenComplete'],

    options: {
        id: 'overlay',
        color: '#000',
        duration: 500,
        opacity: 0.5,
        zIndex: 5000
/*,
        onClick: function(){},
        onClose: function(){},
        onHide: function(){},
        onOpen: function(){},
        onShow: function(){}
        */
    },

    initialize: function(container, options) {
        this.setOptions(options);
        this.container = document.id(container);

        this.bound = {
            'window': {
                resize: this.resize,
                scroll: this.scroll
            },
            overlayClick: this.overlayClick,
            tweenStart: this.tweenStart,
            tweenComplete: this.tweenComplete
        };

        this.build().attach();
    },

    build: function() {
        this.overlay = new Element('div', {
            id: this.options.id,
            styles: {
                position: (Browser.ie6) ? 'absolute' : 'fixed',
                background: this.options.color,
                left: 0,
                top: 0,
                'z-index': this.options.zIndex,
                opacity: 0
            }
        }).inject(this.container);
        this.tween = new Fx.Tween(this.overlay, {
            duration: this.options.duration,
            link: 'cancel',
            property: 'opacity'
        });
        return this;
    }.protect(),

    attach: function() {
        window.addEvents(this.bound.window);
        this.overlay.addEvent('click', this.bound.overlayClick);
        this.tween.addEvents({
            onStart: this.bound.tweenStart,
            onComplete: this.bound.tweenComplete
        });
        return this;
    },

    detach: function() {
        var args = Array.prototype.slice.call(arguments);
        args.each(function(item) {
            if (item == 'window') window.removeEvents(this.bound.window);
            if (item == 'overlay') this.overlay.removeEvent('click', this.bound.overlayClick);
        }, this);
        return this;
    },

    overlayClick: function() {
        this.fireEvent('click');
        return this;
    },

    tweenStart: function() {
        this.overlay.setStyles({
            width: '100%',
            height: this.container.getScrollSize().y,
            visibility: 'visible'
        });
        return this;
    },

    tweenComplete: function() {
        var event = this.overlay.getStyle('opacity') == this.options.opacity ? 'show' : 'hide';
        if (event == 'hide') this.overlay.setStyle('visibility', 'hidden');
        return this;
    },

    open: function() {
        this.fireEvent('open');
        this.tween.start(this.options.opacity);
        return this;
    },

    close: function() {
        this.fireEvent('close');
        this.tween.start(0);
        return this;
    },

    resize: function() {
        this.fireEvent('resize');
        this.overlay.setStyle('height', this.container.getScrollSize().y);
        return this;
    },

    scroll: function() {
        this.fireEvent('scroll');
        if (Browser.ie6) this.overlay.setStyle('left', window.getScroll().x);
        return this;
    }

});

/*
---
name: MooDialog
description: The base class of MooDialog
authors: Arian Stolwijk
license:  MIT-style license
requires: [Core/Class, Core/Element, Core/Element.Style, Core/Element.Event]
provides: [MooDialog, Element.MooDialog]
...
*/


var MooDialog = new Class({

    Implements: [Options, Events],

    Binds: ['close'],

    options: {
        'class': 'MooDialog',
        title: null,
        scroll: true, // IE
        forceScroll: false,
        useEscKey: true,
        destroyOnHide: true,
        autoOpen: true,
        closeButton: true,
        onInitialize: function(){
            this.wrapper.setStyle('display', 'none');
        },
        onBeforeOpen: function(){
            this.wrapper.setStyle('display', 'block');
            this.fireEvent('show');
        },
        onBeforeClose: function(){
            this.wrapper.setStyle('display', 'none');
            this.fireEvent('hide');
        }/*,
        onOpen: function(){},
        onClose: function(){},
        onShow: function(){},
        onHide: function(){},
        onInitialize: function(wrapper){},
        onContentChange: function(content){}*/
    },

    initialize: function(options){
        this.setOptions(options);
        this.options.inject = this.options.inject || document.body;
        options = this.options;

        var wrapper = this.wrapper = new Element('div.' + options['class'].replace(' ', '.')).inject(options.inject);
        this.content = new Element('div.content').inject(wrapper);

        if (options.title){
            this.title = new Element('div.title').set('text', options.title).inject(wrapper);
            wrapper.addClass('MooDialogTitle');
        }

        if (options.closeButton){
            this.closeButton = new Element('a.close', {
                events: {click: this.close}
            }).inject(wrapper);
        }


        /*<ie6>*/// IE 6 scroll
        if ((options.scroll && Browser.ie6) || options.forceScroll){
            wrapper.setStyle('position', 'absolute');
            var position = wrapper.getPosition(options.inject);
            window.addEvent('scroll', function(){
                var scroll = document.getScroll();
                wrapper.setPosition({
                    x: position.x + scroll.x,
                    y: position.y + scroll.y
                });
            });
        }
        /*</ie6>*/

        if (options.useEscKey){
            // Add event for the esc key
            document.addEvent('keydown', function(e){
                if (e.key == 'esc') this.close();
            }.bind(this));
        }

        this.addEvent('hide', function(){
            if (options.destroyOnHide) this.destroy();
        }.bind(this));

        this.fireEvent('initialize', wrapper);
    },

    setContent: function(){
        var content = Array.from(arguments);
        if (content.length == 1) content = content[0];

        this.content.empty();

        var type = typeOf(content);
        if (['string', 'number'].contains(type)) this.content.set('text', content);
        else this.content.adopt(content);

        this.fireEvent('contentChange', this.content);

        return this;
    },

    open: function(){
        this.fireEvent('beforeOpen', this.wrapper).fireEvent('open');
        this.opened = true;
        return this;
    },

    close: function(){
        this.fireEvent('beforeClose', this.wrapper).fireEvent('close');
        this.opened = false;
        return this;
    },

    destroy: function(){
        this.wrapper.destroy();
    },

    toElement: function(){
        return this.wrapper;
    }

});

/*
---
name: MooDialog.Fx
description: Overwrite the default events so the Dialogs are using Fx on open and close
authors: Arian Stolwijk
license: MIT-style license
requires: [Core/Fx.Tween, Overlay]
provides: MooDialog.Fx
...
*/


MooDialog.implement('options', {

    duration: 400,
    closeOnOverlayClick: true,

    onInitialize: function(wrapper){
        this.fx = new Fx.Tween(wrapper, {
            property: 'opacity',
            duration: this.options.duration
        }).set(0);
        this.overlay = new Overlay(this.options.inject, {
            duration: this.options.duration
        });
        if (this.options.closeOnOverlayClick) this.overlay.addEvent('click', this.close);

        this.addEvent('hide', function(){
            if (this.options.destroyOnHide) this.overlay.overlay.destroy();
        }.bind(this));
    },

    onBeforeOpen: function(wrapper){
        this.overlay.open();
        this.fx.start(1).chain(function(){
            this.fireEvent('show');
        }.bind(this));
    },

    onBeforeClose: function(wrapper){
        this.overlay.close();
        this.fx.start(0).chain(function(){
            this.fireEvent('hide');
        }.bind(this));
    }

});

/*
---
name: MooDialog.Alert
description: Creates an Alert dialog
authors: Arian Stolwijk
license:  MIT-style license
requires: MooDialog
provides: MooDialog.Alert
...
*/


MooDialog.Alert = new Class({

    Extends: MooDialog,

    options: {
        okText: 'Ok',
        focus: true,
        textPClass: 'MooDialogAlert'
    },

    initialize: function(msg, options){
        this.parent(options);

        var okButton = new Element('button', {
            events: {
                click: this.close
            },
            text: this.options.okText
        });

        this.setContent(
            new Element('p.' + this.options.textPClass, {text: msg}),
            new Element('div.buttons').adopt(okButton)
        );
        if (this.options.autoOpen) this.open();

        if (this.options.focus) this.addEvent('show', function(){
            okButton.focus()
        });

    }
});

/*
---
name: MooDialog.Error
description: Creates an Error dialog
authors: Arian Stolwijk
license:  MIT-style license
requires: MooDialog
provides: MooDialog.Error
...
*/


MooDialog.Error = new Class({

    Extends: MooDialog.Alert,

    options: {
        textPClass: 'MooDialogError'
    }

});


/*
---
name: MooDialog.Confirm
description: Creates an Confirm Dialog
authors: Arian Stolwijk
license:  MIT-style license
requires: MooDialog
provides: [MooDialog.Confirm, Element.confirmLinkClick, Element.confirmFormSubmit]
...
*/


MooDialog.Confirm = new Class({

    Extends: MooDialog,

    options: {
        okText: 'Ok',
        cancelText: 'Cancel',
        focus: true,
        textPClass: 'MooDialogConfirm'
    },

    initialize: function(msg, fn, fn1, options){
        this.parent(options);
        var emptyFn = function(){},
            self = this;

        var buttons = [
            {fn: fn || emptyFn, txt: this.options.okText},
            {fn: fn1 || emptyFn, txt: this.options.cancelText}
        ].map(function(button){
            return new Element('button', {
                events: {
                    click: function(){
                        button.fn();
                        self.close();
                    }
                },
                text: button.txt
            });
        });

        this.setContent(
            new Element('p.' + this.options.textPClass, {text: msg}),
            new Element('div.buttons').adopt(buttons)
        );
        if (this.options.autoOpen) this.open();

        if(this.options.focus) this.addEvent('show', function(){
            buttons[1].focus();
        });

    }
});


Element.implement({

    confirmLinkClick: function(msg, options){
        this.addEvent('click', function(e){
            e.stop();
            new MooDialog.Confirm(msg, function(){
                location.href = this.get('href');
            }.bind(this), null, options)
        });
        return this;
    },

    confirmFormSubmit: function(msg, options){
        this.addEvent('submit', function(e){
            e.stop();
            new MooDialog.Confirm(msg, function(){
                this.submit();
            }.bind(this), null, options)
        }.bind(this));
        return this;
    }

});

/*
---
name: MooDialog.Prompt
description: Creates a Prompt dialog
authors: Arian Stolwijk
license:  MIT-style license
requires: MooDialog
provides: MooDialog.Prompt
...
*/


MooDialog.Prompt = new Class({

    Extends: MooDialog,

    Binds: ['submit'],

    options: {
        okText: 'Ok',
        focus: true,
        textPClass: 'MooDialogPrompt',
        defaultValue: ''
    },

    initialize: function(msg, fn, options){
        this.parent(options);
        if (!fn) fn = function(){};

        var textInput = new Element('input.textInput', {type: 'text', value: this.options.defaultValue}),
            submitButton = new Element('input[type=submit]', {value: this.options.okText}),
            formEvents = {
                submit: this.submit
            };

        this.setContent(
            new Element('p.' + this.options.textPClass, {text: msg}),
            new Element('form.buttons', {events: formEvents}).adopt(textInput, submitButton)
        );
        if (this.options.autoOpen) this.open();

        if (this.options.focus) this.addEvent('show', function(){
            textInput.focus();
        });
    },

    submit: function(e){
        e.stop();
        fn(textInput.get('value'));
        this.close();
    }
});
