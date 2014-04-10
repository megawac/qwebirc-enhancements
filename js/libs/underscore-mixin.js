/*
 A collection of functional helpers for underscore

*/
(function(_, undefined) {
    var functional = _.func = {},
        slice = Array.prototype.slice,
        concat = Array.prototype.concat;

    _.each(["each", "map", "filter", "some", "every", "find", "sortBy", "groupBy", "invoke", "lookup"], function(name) { //useful for partials
        functional[name] = function(fn, list) {
            return _[name].apply(this, [list, fn].concat(slice.call(arguments, 2))); //could just call _.flip
        };
    });

    _.mixin({
        autoCurry: function(fn, numArgs) {
            numArgs = numArgs || fn.length;
            return function wrapper(prev_args) {
                return function() {
                    var args = prev_args.concat(slice.call(arguments));
                    return args.length < numArgs ? wrapper(args) : fn.apply(this, args);
                };
            }([]);
        },

        periodical: function(fn, period, bind) {
            return fn.periodical(period, bind, slice.call(arguments, 3));
        },

        merge: Object.merge,

        //f(a,b//) -> f(b,a..)
        flip: function(f) {
            return function() {
                var args = slice.call(arguments);
                args = args.slice(1, 2).concat(args.slice(0, 1)).concat(args.slice(2));
                return f.apply(null, args);
            };
        },

        negate: function(fn) {
            return function() {
                return !fn.apply(this, arguments);
            };
        },

        toFunction: Function.from,

        arrayarize: Array.from,

        toInt: Number.toInt,

        /* jshint devel:true */
        log: function() {if(console && console.log) console.log(arguments)},

        //returns next item in array with overflow
        //xs array
        //pos start index
        //dir ammount direction +/-
        nextItem: function(xs, pos, dir) {//#note: will always returns an item
            pos = pos || _.size(xs);
            var index = pos + (dir || 1);
            if (index >= xs.length) {
                index %= xs.length;
            }
            if (index < 0) {
                index = xs.length + (index % xs.length);
            }
            return xs[index];
        },

        //https://gist.github.com/rjz/2815273
        assign: function(obj, key, value) {
            var keys = key.split("."),
                cur, ptr = obj;

            while ((cur = keys.shift()) && keys.length) {
                if (!_.isObject(ptr[cur])) {
                    ptr[cur] = {};
                }
                ptr = ptr[cur];
            }
            ptr[cur] = value;
            return obj;
        },

        lookup: function (obj, key){
            var type = typeof key;
            if (type == "string" || type == "number") key = (""+key).split(".");
            for (var i = 0, l = key.length; i < l; i++){
                if (_.has(obj, key[i])) obj = obj[key[i]];
                else return undefined;
            }
            return obj;
        },

        item: function(xs, n) {
            return xs == null ? null : xs[n];
        },
        last: Array.getLast,

        //.alias({a:1,b:{alpha:'a'}}, {a: 'test', c: 'rawf'}) => {a: 1, b: Object, test: 1}
        alias: function(obj, aliases, force) {//obj is an object and aliases is a dictionary of (string union listof string)
            function makeAliases(alias, key) {
                if(_.has(obj, key)) {
                    if(_.isArray(alias)) {
                        _.each(alias, function(alias) {makeAliases(alias, key)});
                    } else if(_.isString(alias) && (force || !_.has(obj, alias))) {
                        obj[alias] = obj[key];
                    }
                }
            }
            _.each(aliases, makeAliases);
            return obj;
        }
    });

})(this._);