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
        isArray: Type.isArray
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
		
		//see es6 spec
        startsWith: function(what, pos) {
            return this.slice((pos || 0), what.length) == what;
        },
        endsWith: function(what, pos) {
            return this.slice(this.length - what.length - (pos || 0)) == what;
        }
    });

    if(!Object.equal) {
        var eq = function(a, b, stack) {//this is Epitome.isEqual I just moved it here
            // this is a modified version of eq func from _.js

            // Identical objects are equal. `0 === -0`, but they aren't identical.
            // See the Harmony `egal` proposal: http://wiki.ecmascript.org/doku.php?id=harmony:egal.
            // stack = stack || [];

            if (a === b) return a !== 0 || 1 / a == 1 / b;

            // A strict comparison is necessary because `null == undefined`.
            if (a == null || b == null) return a === b;

            // use MooTools types instead of toString.call(a),
            // this fixes FF returning [xpconnect wrapped native prototype] for all w/ MooTools
            var typeA = typeOf(a),
                typeB = typeOf(b);

            if (typeA != typeB) return false;

            switch (typeA) {
                // Strings, numbers, dates, and booleans are compared by value.
                case 'string':
                    // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
                    // equivalent to `new String("5")`.
                    return a == String(b);
                case 'number':
                    // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
                    // other numeric values.
                    return a != +a ? b != +b : (a === 0 ? 1 / a == 1 / b : a == +b);
                case 'date':
                case 'boolean':
                    // Coerce dates and booleans to numeric primitive values. Dates are compared by their
                    // millisecond representations. Note that invalid dates with millisecond representations
                    // of `NaN` are not equivalent.
                    return +a == +b;
                    // RegExps are compared by their source patterns and flags.
                case 'regexp':
                    return a.source == b.source &&
                        a.global == b.global &&
                        a.multiline == b.multiline &&
                        a.ignoreCase == b.ignoreCase;
            }

            if (typeof a !== 'object' || typeof b !== 'object') return false;

            // Assume equality for cyclic structures. The algorithm for detecting cyclic
            // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
            var length = stack.length;
            while (length--) {
                // Linear search. Performance is inversely proportional to the number of
                // unique nested structures.
                if (stack[length] == a) return true;
            }

            // Add the first object to the stack of traversed objects.
            stack.push(a);
            var size = 0,
                result = true;
            // Recursively compare objects and arrays.
            if (typeA == 'array') {
                // Compare array lengths to determine if a deep comparison is necessary.
                size = a.length;
                result = size == b.length;
                if (result) {
                    // Deep compare the contents, ignoring non-numeric properties.
                    while (size--) {
                        // Ensure commutative equality for sparse arrays.
                        if (!(result = size in a == size in b && eq(a[size], b[size], stack))) break;
                    }
                }
            } else {
                // Objects with different constructors are not equivalent.
                if ('constructor' in a != 'constructor' in b || a.constructor != b.constructor) return false;
                // Deep compare objects.
                for (var key in a) {
                    if (a.hasOwnProperty(key)) {
                        // Count the expected number of properties.
                        size++;
                        // Deep compare each member.
                        if (!(result = b.hasOwnProperty(key) && eq(a[key], b[key], stack))) break;
                    }
                }
                // Ensure that both objects contain the same number of properties.
                if (result) {
                    for (key in b) {
                        if (b.hasOwnProperty(key) && !(size--)) break;
                    }
                    result = !size;
                }
            }

            // Remove the first object from the stack of traversed objects.
            stack.pop();
            return result;
        }
        Object.equal = function() {
            var args = arguments;
            if(args.length > 1) {
                for (var comp = args[0], stack = [], i = args.length - 1; i >= 0; i--) {
                    if(!eq(args[i], comp, stack))
                        return false;
                }
            }
            return true;
        }
    }


    Object.extend({
        get: Object.getFromPath,

        set: function(object, path, value) {
            path = (typeof path == 'string') ? path.split('.') : path.slice(0);
            var key = path.pop(),
                len = path.length,
                i = 0,
                current;
            while (len--) {
                current = path[i++];
                object = current in object ? object[current] : (object[current] = {});
            }
            object[key] = value;
        },

        isEmpty: function(hash) {
            return Object.getLength(hash) === 0;
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