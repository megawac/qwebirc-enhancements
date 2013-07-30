(function() {

    Array.implement({
/*
        Function: Array.first
          Returns the first item.
        */
        // first: function() {
        //     return this[0];
        // },
        // last: function() {
        //     return this[this.length - 1];
        // },
/*
        Returns the item at index n
        */
        item: function(n) {
            return this[n];
        },

        //returns next item in array with overflow
        next: function(pos, dir) {
            var index = pos + (dir || 1);
            if (index >= this.length) {
                index %= this.length;
            }
            if (index < 0) {
                index = this.length + (index % this.length);
            }
            return this[index];
        }

        // rest: function(n) {
        //     return this.slice(n || 1 /*, this.length*/ );
        // }
    }).extend({
        isArray: function(xs) {
            return typeOf(xs) == "array";
        }
    });

    String.implement({

        //replaces all occurences of the tofind string in this string with
        //torep
        //torep may be another string or a callback which takes a single string
        //http://jsperf.com/replaceall-escape
        replaceAll: function(tofind, torep) { //gross
            var ns = this;
            while (ns.indexOf(tofind) > -1) {
                ns = ns.replace(tofind, torep); //using regex you end up having todo a bunch of escaping
            }
            return ns;
        },

        //splits string into array of with a max length of max
        // useful for seperating names from messages
        // "test!willsplit!into!1".splitMax('!', 1) => ["test!willsplit!into!1"]
        // "test!willsplit!into!3".splitMax('!', 3) => ["test", "willsplit", "into!3"]
        // "testwillsplitinto1".splitMax('!', 3) => ["testwillsplitinto1"]"
        //http://jsperf.com/string-splitmax-implementations
        splitMax: function(by, max) { //wtf
            var items = this.split(by),
                len = max - 1,
                newitems = items.slice(0, len);
            if (items.length >= max) {
                newitems.push(items.slice(len).join(by));
            }
            return newitems;
        },

        // var items = this.split(by);
        // var newitems = items.slice(0, max - 1);
        // if (items.length >= max) {
        //     newitems.push(items.slice(max - 1).join(by));
        // }
        startsWith: function(what) {
            return this.slice(0, what.length) == what;
        },

        endsWith: function(what) {
            return this.slice(this.length - what.length) == what;
        }
    });


    Object.extend({

        isEmpty: function(hash) {
            return Object.getLength(hash) === 0;
        },
        //same as Object.map but maps to an array
        mapA: function(object, fn, bind) {
            var results = [];
            for (var key in object) {
                if (hasOwnProperty.call(object, key)) results.push(fn.call(bind, object[key], key, object));
            }
            return results;
        }
    });


    var adopt = Element.prototype.adopt,
        inject = Element.prototype.inject;


    ["html", "text"].each(function(fn) {
        Element.implement(fn, function(data) {
            if (data) return this.set(fn, data);
            return this.get(fn);
        });
    });

    Element.implement({

        adopt: function() {
            //just mootools adopt method which fires an event when called
            return adopt.apply(this, arguments).fireEvent("adopt", arguments);
        },

        //removes all elements in arguments from array if found - opposite of adopt
        disown: function() {
            Array.each(arguments, function(element) {
                element = document.id(element, true);
                if (element) element.dispose();
            });
            this.fireEvent("disown", arguments);
            return this;
        },

        inject: function(el) {
            var ret = inject.apply(this, arguments);
            el.fireEvent('adopt', arguments);
            return ret;
        },

        maxChildren: function(n) {
            for (var ele, c = this.children; c.length >= n && (ele = this.firstChild);) {
                ele.destroy();
            }
            return this;
        },

        val: function(val) {
            var key = (this.get('type') == 'checkbox') ? 'checked' : 'value';

            if (val != null) {
                return this.set(key, val);
            }
            return this.get(key);
        },

        insertAt: function(element, position) {
            //http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-952280727
            return this.insertBefore(element, this.childNodes[position] || null); //return node being inserted
        },

        isDisplayed: function() {
            return !this.hasClass('hidden');
        },

        // normal mootool version uses display property - this way helps with selectors
        show: function() {
            return this.removeClass('hidden');
        },

        hide: function() {
            return this.addClass('hidden');
        },

        toggle: function(state) {
            if (state == null) state = !this.isDisplayed();
            return this[state ? 'show' : 'hide']();
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
        },

        hasClasses: function() {
            Array.every(arguments, this.hasClass, this);
        }

    });

    //By Eli Grey, https://gist.github.com/eligrey/1276030
    if (this.document && !("insertAdjacentHTML" in document.createElementNS("http://www.w3.org/1999/xhtml", "_"))) {
        HTMLElement.implement("insertAdjacentHTML", function(position, html) {
            var ref = this,
                container = ref.ownerDocument.createElementNS("http://www.w3.org/1999/xhtml", "_"),
                ref_parent = ref.parentNode,
                node, first_child, next_sibling;

            container.innerHTML = html;

            switch (position.toLowerCase()) {
            case "beforebegin":
                while ((node = container.firstChild)) {
                    ref_parent.insertBefore(node, ref);
                }
                break;
            case "afterbegin":
                first_child = ref.firstChild;
                while ((node = container.lastChild)) {
                    first_child = ref.insertBefore(node, first_child);
                }
                break;
            case "beforeend":
                while ((node = container.firstChild)) {
                    ref.appendChild(node);
                }
                break;
            case "afterend":
                next_sibling = ref.nextSibling;
                while ((node = container.lastChild)) {
                    next_sibling = ref_parent.insertBefore(node, next_sibling);
                }
                break;
            }
        });
    }

    this.$type = function(object) {
        var type = typeOf(object);
        if (type == 'elements') return 'array';
        return (type == 'null') ? false : type;
    };

    this.$lambda = Function.from;

    this.$chk = function(obj) {
        return !!(obj || obj === 0);
    };

    this.$clear = function(timer) {
        clearTimeout(timer);
        clearInterval(timer);
        return null;
    };

    this.$defined = function(obj) {
        return (obj != null);
    };

    this.$each = function(iterable, fn, bind) {
        var type = typeOf(iterable);
        ((type == 'arguments' || type == 'collection' || type == 'array' || type == 'elements') ? Array : Object).each(iterable, fn, bind);
    };

    this.$empty = function() {};

    this.$extend = function(original, extended) {
        return Object.append(original, extended);
    };

    this.$A = Array.from;

})();