/**
 * Lightweight basic autocompleter
 * WIP: goal is to create typeaheadesque (https://github.com/twitter/typeahead.js/) input box. Only going to support local data and no drop down for now..
 * @depends [components]
 * @provides [components/Completer]
 */
(function() {

    function hinter() {
        if (!this.options.autocomplete) return;
        var text = this.$input.get("value");
        var index, curr, lastWord, lastWordIndex;
        if (!text) return this.seth("");
        if (text.length >= this.options.minlen) {
            index = this.data.length;
            while (index--) {
                curr = this.data[index];
                if (curr.length > text.length && curr.startsWith(text)) {
                    return this.seth(curr);
                }
            }
        }
        // look for a partial match
        lastWordIndex = text.lastIndexOf(" ") + 1;
        if (lastWordIndex == text.length) return this.seth("");
        lastWord = text.slice(lastWordIndex);
        index = this.partials.length;
        while (index--) {
            curr = this.partials[index];
            if (curr.startsWith(lastWord)) {
                return this.seth(text.slice(0, lastWordIndex) + curr);
            }
        }
    }

    components.Completer = new Class({
        Implements: [Options],
        Binds: ["process", "update"],
        index: -1,
        options: {
            //autostyle -todo for now templated,
            autoPosition: true,//autopositon hint
            autocomplete: true,
            getData: null,
            getPartials: null,
            selectors: {
                hint: ".tt-hint",
                input: ".tt-query"
            },
            minlen: 1,
            delay: 100 //throttle time
        },
        data: [],
        partials: [],

        keyboardBinds: {
            "down": "next",
            "up": "previous",
            "tab": "finish",
            "right": "finish",
            "left": "stop",
            "esc": "stop",
            "enter": "complete"
        },

        //expects to be given a container with 2 inputs. One for actual input and a disabled one for offering possible completion.
        //Future can also contain a container for menu
        initialize: function(target, options) {
            options = this.setOptions(options).options;
            target = document.id(target);

            this.updateData();

            this.$events = {
                "keydown": this.process,
                "keyup": _.throttle(hinter.bind(this), options.delay)
            };
            this.$input = target.getElement(options.selectors.input)
                                .addEvents(this.$events);
            this.$hint = target.getElement(options.selectors.hint)
                                .show();
            if (options.autoPosition) {
                this.$hint.setStyle("position", "absolute");
                this.update.delay(50);
                window.addEvent("resize", this.update);
            }
        },

        updateData: _.throttle(function() {
            if (this.options.getData) {
                this.data = this.options.getData();
            }
            if (this.options.getPartials) {
                this.partials = this.options.getPartials();
            }
        }, 2500),

        toggleAutocomplete: function(state) {
            this.options.autocomplete = state != null ? !!state : !this.options.autocomplete;
        },

        process: function(evt) {
            this.updateData();
            var method = this.keyboardBinds[evt.key];
            if (this[method]) {
                if (evt.key === "tab") evt.stop(); // don't tab out of input
                this[method]();
            }
            //cant do hinting here as this is fired before input
        },

        next: function() {
            this.stop();
            if (this.index > 0) {
                this.set(this.data[--this.index]);
            } else {
                this.set("");
                this.index = -1;
            }
        },

        previous: function() {
            this.stop();
            if (this.index + 1 < this.data.length) {
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
            var hint = this.$hint.get("value");
            var text = this.$input.get("value");
            if (hint && hint != text) this.set(hint + " ");
        },

        stop: function() {
            this.seth("");
        },

        set: function(text) {
            if (typeof text === "string") this.$input.set("value", text);
        },

        seth: function(text) {
            if (_.isString(text)) this.$hint.set("value", text);
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
