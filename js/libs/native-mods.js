
(function(){

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
        if(index >= this.length) {
            index %= this.length;
        }
        if(index < 0) {
            index = this.length + (index % this.length);
        }
        return this[index];
    }

    // rest: function(n) {
    //     return this.slice(n || 1 /*, this.length*/ );
    // }
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
        return this.slice(0, what.length) === what;
    }
});


Object.extend({

    isEmpty: function(hash) {
        return Object.getLength(hash) === 0;
    },
    //same as Object.map but maps to an array
    mapA: function (object, fn, bind){
        var results = [];
        for (var key in object){
            if (hasOwnProperty.call(object, key))
                results.push(fn.call(bind, object[key], key, object));
        }
        return results;
    }
});


var adopt = Element.prototype.adopt;
function ad() {
    //just mootools adopt method which fires an event when called
    return adopt.call(this, arguments)
        .fireEvent("adopt", arguments);
}


["html", "text"].each(function(fn) {
    Element.implement(fn, function(data) {
        if(data)
            return this.set(fn, data);
        return this.get(fn);
    });
});

Element.implement({

    adopt: ad,

    //removes all elements in arguments from array if found - opposite of adopt
    disown: function() {
        Array.each(arguments, function(element){
            element = document.id(element, true);
            if (element) element.dispose();
        });
        this.fireEvent("disown", arguments);
        return this;
    },

    maxChildren: function(n) {
        for(var ele, c = this.children; c.length >= n && (ele = this.firstChild);) {
            ele.destroy();
        }
        return this;
    },

    insertAt: function(element, position) {
        //http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-952280727
        return this.insertBefore(element, this.childNodes[position] || null); //return node being inserted
    },

    isDisplayed: function(){
        return !this.hasClass('hidden');
    },

    // normal mootool version uses display property - this way helps with selectors
    show: function() {
        return this.removeClass('hidden');
    },

    hide: function() {
        return this.addClass('hidden');
    },

    toggle: function (state){
        if(!$defined(state))
            state = !this.isDisplayed();
        return this[state ? 'show': 'hide']();
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

    // hasClasses: function() {
    //     Array.every(arguments, this.hasClass, this);
    // }

});

Element.extend({
    from: function() {
        return Elements.from.apply(this, arguments)[0];
    }
});

})();