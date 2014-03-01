/**
 * Some mootools customizations - may break spec
 * @provides [hacks, patches]
 */
(function(window) {
    var strp = String.prototype,
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

    ["startsWith", "endsWith", "trimLeft", "trimRight"].each(function(method) {
        try{
            if(strp[method]) strp[method].protect();
        }catch(o_O){}
    });

    String.implement({

        //replaces all occurences of the tofind string in this string with
        //alternatively call replace with a regex global
        //http://jsperf.com/replaceall-escape/3
        replaceAll: function(tofind, torep) {
            var temp, str = this;
            while ((temp = str.replace(tofind, torep)) !== str) { //using regex you end up having todo a bunch of escaping) {
                str = temp;
            }
            return str;
        },

        //splits string into array of with a max length of max
        // useful for seperating names from messages
        // "test!willsplit!into!1".splitMax("!", 1) => ["test!willsplit!into!1"]
        // "test!willsplit!into!3".splitMax("!", 3) => ["test", "willsplit", "into!3"]
        // "testwillsplitinto1".splitMax("!", 3) => ["testwillsplitinto1"]"
        //http://jsperf.com/string-splitmax-implementations
        splitMax: function(by, max) {
            max = (max || 1) - 1;
            var items = this.split(by),
                newitems = items.slice(0, max);
            if (items.length > max) {
                newitems.push(items.slice(max).join(by));
            }
            return newitems;
        },

        // var items = this.split(by);
        // var newitems = items.slice(0, max - 1);
        // if (items.length >= max) {
        //     newitems.push(items.slice(max - 1).join(by));
        // }
	
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

    //https://github.com/tildeio/rsvp.js/blob/18ee5722b63e4266ab68d40e9c5a1062d621e546/lib/rsvp/all-settled.js
    util.allSettled = function(entries, label) {
        return new Promise(function(resolve, reject) {
            if (!_.isArray(entries)) {
                throw new TypeError("You must pass an array to allSettled.");
            }

            var remaining = entries.length;

            if (remaining === 0) {
                resolve([]);
                return;
            }

            var results = new Array(remaining);

            function fulfilledResolver(index) {
                return function(value) {
                    resolveAll(index, fulfilled(value));
                };
            }

            function rejectedResolver(index) {
                return function(reason) {
                    resolveAll(index, rejected(reason));
                };
            }

            function resolveAll(index, value) {
                results[index] = value;
                if (--remaining === 0) {
                    resolve(results);
                }
            }

            for (var index = 0; index < entries.length; index++) {
                Promise.resolve(entries[index]).then(fulfilledResolver(index), rejectedResolver(index));
            }
        }, label);
    };

    function fulfilled(value) {
        return {
            state: "fulfilled",
            value: value
        };
    }

    function rejected(reason) {
        return {
            state: "rejected",
            reason: reason
        };
    }

    if (window.document) {
        if (!(Type.isFunction(document.hasFocus))) { //crude focus polyfill
            var focus = true;
            window.addEvents({
                focus: function() {
                    focus = true;
                },
                blur: function() {
                    focus = false;
                }
            });
            document.hasFocus = function() {
                return focus;
            };
        }
    }

    window.$lambda = Function.from;

    window.$clear = function(timer) {
        clearTimeout(timer);
        clearInterval(timer);
        return null;
    };
})(this);