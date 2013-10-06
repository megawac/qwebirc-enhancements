/*
    Lightweight basic autocompleter?
    WIP: goal is to create typeaheadesque (https://github.com/twitter/typeahead.js/) input box. Only going to support local data and no drop down for now..
*/
(function() {
    var keyboardBinds = {
        "down": "next",
        "up": "previous",
        "tab": "finish",
        "right": "finish",
        "left": "stop",
        "esc": "stop",
        "enter": "complete"
    };
    
    function hinter() {
        if(this.options.autocomplete) {
            var text = this.$input.get("value");
            var full = "";
            if(text.length >= this.options.minlen) {
                full = _.find(this.data, function(txt) {
                    return txt.startsWith(text);
                });
            }
            this.seth(full || "");
        }
    }

    this.Completer = new Class({
        Implements: [Options],
        Binds: ["process", "update"],
        index: -1,
        options: {
            stopPropogation: false,
            //autostyle -todo for now templated,
            autoPosition: true,//autopositon hint
            autocomplete: true,
            selectors: {
                hint: '.tt-hint',
                input: '.tt-query'
            },
            minlen: 1,
            delay: 400 //throttle time
        },

        //expects to be given a container with 2 inputs. One for actual input and a disabled one for offering possible completion.
        //Future can also contain a container for menu
        initialize: function(target, data, options) {
            options = this.setOptions(options).options;
            target = document.id(target);
            this.data = data;

            this.$events = {
                "keydown": this.process,
                "input": _.throttle(hinter.bind(this), options.delay)
            };
            this.$input = target.getElement(options.selectors.input)
                                .addEvents(this.$events);
            this.$hint = target.getElement(options.selectors.hint)
                                .show();
            if(options.autoPosition) {
                this.$hint.setStyle("position", "absolute");
                this.update.delay(50);
                window.addEvent("resize", this.update);
            }
        },

        toggleAutocomplete: function(state) {
            this.options.autocomplete = !!state;
        },

        process: function(evt) {
            var method = keyboardBinds[evt.key];
            if(this[method]) {
                if(this.options.stopPropogation) evt.stopPropagation();
                this[method]();
            }
            //cant do hinting here as this is fired before input
        },

        next: function() {
            this.stop();
            if(this.index > 0) {
                this.set(this.data[--this.index]);
            } else {
                this.set("");
                this.index = -1;
            }
        },

        previous: function() {
            this.stop();
            if(this.index + 1 < this.data.length) {
                this.set(this.data[++this.index]);
            } else {
                this.set("");
                this.index = this.data.length;
            }
        },

        complete: function() {
            // this.finish();
            this.reset();
        },

        finish: function() {
            var text = this.$hint.get("value") || null;
            this.set(text);
        },

        stop: function() {
            this.seth("");
        },

        set: function(text) {
            if(_.isString(text)) this.$input.set("value", text);
        },

        seth: function(text) {
            if(_.isString(text)) this.$hint.set("value", text);
        },

        reset: function() {
            this.stop();
            this.index = -1;
        },

        update: function() {
            this.$hint.setStyles(this.$input.getCoordinates(this.$input.getParent()));
        },

        detach: function() {
            this.$input.removeEvents(this.$events);
            this.$hint.hide();
            window.removeEvent("resize", this.update);
        }
    });
})();
