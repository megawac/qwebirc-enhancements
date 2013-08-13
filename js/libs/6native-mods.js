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

    });

    String.implement({

        //replaces all occurences of the tofind string in this string with
        //alternatively call replace with a regex global
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
	
		//see es6 spec
        startsWith: function(what, pos) {
            return this.slice((pos || 0), what.length) == what;
        },
        endsWith: function(what, pos) {
            return this.slice(this.length - what.length - (pos || 0)) == what;
        }
    })
    .extend({
        escapeHTML: _.escape
    });


    Object.extend({
        // get: Object.getFromPath,

        // set: function(object, path, value) {
        //     path = (typeof path == 'string') ? path.split('.') : path.slice(0);
        //     var key = path.pop(),
        //         len = path.length,
        //         i = 0,
        //         current;
        //     while (len--) {
        //         current = path[i++];
        //         object = current in object ? object[current] : (object[current] = {});
        //     }
        //     object[key] = value;
        // },
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

    if (this.document) {
        //By Eli Grey, https://gist.github.com/eligrey/1276030
        if(!("insertAdjacentHTML" in document.createElementNS("http://www.w3.org/1999/xhtml", "_"))) {
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
        if(!(Type.isFunction(document.hasFocus))) {//crude focus polyfill
            var focus = true;
            window.addEvents({
                focus: function() {focus = true},
                blur: function() {focus = false}
            });
            document.hasFocus = function() {
                return focus;
            };
        }
    }

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

    this.$A = Array.from;

})();
