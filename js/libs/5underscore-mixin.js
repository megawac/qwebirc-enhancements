/*
 A collection of functional helpers for underscore

*/

; (function(_, undefined) {

    var //+ ECMAsplit :: String -> Int -> String
    // ECMAsplit is an ECMAScript-compliant `split`, although only for
    // one argument.
    //uses the function if String.prototype.split isnt compliant
    ECMAspit = ('ab'.split(/a*/).length) > 1 ? String.prototype.split : function(separator, limit) {
            if (typeof limit != 'undefined') {
                throw "ECMAsplit: limit is unimplemented";
            }
            var result = this.split.apply(this, arguments),
                re = RegExp(separator),
                savedIndex = re.lastIndex,
                match = re.exec(this);
            if (match && match.index == 0) {
                result.unshift('');
            }
            re.lastIndex = savedIndex;
            return result;
        },

        //+ stringLambda :: _ -> f
        stringLambda = function(str) {
            var params = [],
                expr = str,
                sections = ECMAspit.call(expr, /\s*->\s*/m);
            if (sections.length > 1) {
                while (sections.length) {
                    expr = sections.pop();
                    params = sections.pop().split(/\s*,\s*|\s+/m);
                    sections.length && sections.push('(function(' + params + '){return (' + expr + ')})');
                }
            } else if (expr.match(/\b_\b/)) {
                params = '_';
            } else {
                var leftSection = expr.match(/^\s*(?:[+*\/%&|\^\.=<>]|!=)/m),
                    rightSection = expr.match(/[+\-*\/%&|\^\.=<>!]\s*$/m);
                if (leftSection || rightSection) {
                    if (leftSection) {
                        params.push('$1');
                        expr = '$1' + expr;
                    }
                    if (rightSection) {
                        params.push('$2');
                        expr = expr + '$2';
                    }
                } else {
                    var regex = /(?:\b[A-Z]|\.[a-zA-Z_$])[a-zA-Z_$\d]*|[a-zA-Z_$][a-zA-Z_$\d]*\s*:|this|arguments|'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"/g,
                        vars = str.replace(regex, '').match(/([a-z_$][a-z_$\d]*)/gi) || [];
                    for (var i = 0, v; v = vars[i++];)
                    params.indexOf(v) >= 0 || params.push(v);
                }
            }
            return new Function(params, 'return (' + expr + ')');
        },

        //+ stringToFunction :: _ -> f
        stringToFunction = function(str) {
            if (str.match(/\breturn\b/)) {
                return new Function(str);
            }
            return stringLambda(str);
        };

    var functional = _.func = {},
        slice = Array.prototype.slice,
        concat = Array.prototype.concat;

    _.each(['each', 'map', 'filter', 'some', 'every', 'find', 'sortBy', 'groupBy', 'invoke', 'lookup'], function(name) { //useful for partials
        functional[name] = function(fn, list) {
            return _[name].apply(this, [list, fn].concat(slice.call(arguments, 2))); //could just call _.flip
        };
    });

    _.mixin({
        autoCurry: function(fn, numArgs) {
            numArgs = numArgs || fn.length;
            return function wrapper(prev_args) {
                return function() {
                    var args = concat.call(prev_args, slice.call(arguments));
                    return args.length < numArgs ? wrapper(args) : fn.apply(this, args);
                };
            }([]);
        },

        //+ until :: a -> f -> (b -> c)
        //keep calling til a test passes
        until: function(pred, fn) {
            fn = _.lambda(fn);
            pred = _.lambda(pred);
            return function(value) {
                while (!pred.call(this, value)) {
                    value = fn.call(this, value);
                }
                return value;
            };
        },

        periodical: function(fn, period, bind, args) {
            return fn.periodical(period, bind, args);
        },

        merge: Object.merge,

        //f(a,b//) -> f(b,a..)
        flip: function(f) {
            return function() {
                var args = Array.from(arguments);
                args = args.slice(1, 2).concat(args.slice(0, 1)).concat(args.slice(2));
                return f.apply(null, args);
            };
        },

        //+ and :: _ -> (_ -> Bool)
        and: function() {
            var args = arguments;
            return function() {
                var theseargs = arguments;
                return _.every(args, function(arg) {
                    return _.lambda(arg).apply(this, theseargs);
                }, this);
            };
        },

        //+ or :: _ -> (_ -> Bool)
        or: function() {
            var args = _.map(arguments, _.identity);
            return function() {
                var theseargs = arguments;
                return _.some(args, function(arg) {
                    return _.lambda(arg).apply(this, theseargs);
                }, this);
            };
        },

        //+ not :: f -> (_ -> Bool)
        not: function(fn) {
            fn = _.lambda(fn);
            return function() {
                return !fn.apply(this, arguments);
            };
        },

        lambda: function(obj) {
            if (_.isFunction(obj)) return obj;
            else if (_.isString(obj)) return stringToFunction(obj);
            else return _.toFunction(obj);
        },

        toFunction: Function.from,

        arrayarize: Array.from,

        toInt: Number.toInt,

        log: function() {console.log(arguments)},

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
            var keys = key.split('.'),
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
            if (type == 'string' || type == "number") key = (""+key).split('.');
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