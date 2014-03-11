/**
 * Some mootools customizations - may break spec
 * @provides [hacks, patches]
 */
(function(window) {
    var stringProto = String.prototype,
        forEach = Array.prototype.forEach;
    //okay this is mainly just for preference - didnt like merges behaviour with classes particularly with Options.setOptions and this was the easiest way to reimplemnt it
    //https://github.com/mootools/mootools-core/issues/2526
    var mergeOne = function(source, key, current){
        switch (typeOf(current)){
            case "object":
                if(current.$constructor && "$caller" in current) source[key] = current;//class instance check (only change)
                else if (typeOf(source[key]) == "object") Object.merge(source[key], current);
                else source[key] = Object.clone(current);
                break;
            case "array":
                source[key] = current.clone();
                break;
            default:
                source[key] = current;
        }
        return source;
    };

    Object.extend({
        merge: function(source, k, v){
            if (typeOf(k) == "string") return mergeOne(source, k, v);
            for (var i = 1, l = arguments.length; i < l; i++){
                var object = arguments[i];
                for (var key in object) mergeOne(source, key, object[key]);
            }
            return source;
        }
    });

    Class.refactor(Request, {
        initialize: function(options) {
            var self = this;
            self.previous(options);
            self.promise = new Promise(function (fulfill, reject) {
                self.addEvents({
                    success: fulfill,
                    failure: reject
                });
            });
        }
    })
    .implement({
        "then": function(success, error) {
            return this.promise.then(success, error);
        },
        "catch": function(error) {
            return this.promise["catch"](error);
        }
    });

    ["startsWith", "endsWith", "trimLeft", "trimRight"].each(function(method) {
        try{
            if(stringProto[method]) stringProto[method].protect();
        }catch(o_O){}
    });

    String.implement({
		//see es6 spec
        startsWith: function(what, pos) {
            return this.slice((pos || 0), what.length) == what;
        },
        endsWith: function(what, pos) {
            return this.slice(this.length - what.length - (pos || 0)) == what;
        },

        trimRight: function (){
            return String(this).replace(/~+$/, "");
        },

        trimLeft: function() {
            return String(this).replace(/^\s+/, "");
        }
    });

    Array.implement("each", function(fn, context) {//optimization avoids some fn calls
        forEach.call(this, fn, context);
        return this;
    });

    Element.Properties.val = Element.Properties.value = {
        get: function() {
            return this[(this.get("type") == "checkbox") ? "checked" : "value"];
        },
        set: function(val) {
            this[(this.get("type") == "checkbox") ? "checked" : "value"] = val;
        }
    };

    ["html", "text", "val"].each(function(fn) {
        Element.implement(fn, function(data) {
            if (typeof data !== "undefined") return this.set(fn, data);
            return this.get(fn);
        });
    });

    _.extend(Element.NativeEvents, {
        adopt: 2,
        disown: 2
    });

    Class.refactor(Element, {
        adopt: function() {
            //just mootools adopt method which fires an event when called
            return this.previous.apply(this, arguments).fireEvent("adopt", arguments);
        },
        inject: function(el) {
            var ret = this.previous.apply(this, arguments);
            el.fireEvent("adopt", [this]);
            return ret;
        }
    })
    .implement({
        //removes all elements in arguments from array if found - opposite of adopt
        disown: function() {
            forEach.call(arguments, function(element) {
                element = document.id(element, true);
                if (element) element.dispose();
            });
            this.fireEvent("disown", arguments);
            return this;
        },

        maxChildren: function(n) {
            for (var ele, c = this.children; c.length >= n && (ele = this.firstChild);) {
                ele.dispose();
            }
            return this;
        },

        insertAt: function(element, position) {
            //http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-952280727
            return this.insertBefore(element, this.childNodes[position] || null); //return node being inserted
        },

        isHovered: function() {
            return !!(this.getElement(":hover") || this.parentNode.getElement(":hover") === this);
        },

        isDisplayed: function() {
            return !this.hasClass("hidden");
        },

        // normal mootool version uses display property - this way helps with selectors
        show: function() {
            return this.removeClass("hidden");
        },

        hide: function() {
            return this.addClass("hidden");
        },

        toggle: function(state) {
            if (state == null) state = !this.isDisplayed();
            return this[state ? "show" : "hide"]();
        },

        swapParent: function(parent) {
            this.dispose();
            return parent.adopt(this);
        },

        addClasses: function() {
            Array.each(arguments, this.addClass, this);
            return this;
        },

        removeClasses: function() {
            Array.each(arguments, this.removeClass, this);
            return this;
        }
    });

    window.$clear = function(timer) {
        clearTimeout(timer);
        clearInterval(timer);
        return null;
    };
})(this);