//functional js adapted library. read the comments in the osteels library for better comments on functions and examples
// source: 
/*
 * Author: Oliver Steele
 * Copyright: Copyright 2007 by Oliver Steele.  All rights reserved.
 * License: MIT License
 * Homepage: http://osteele.com/javascripts/functional
 * Created: 2007-07-11
 * Version: 1.0.2
 *
 *
 * This file defines some higher-order methods and functions for
 * functional and function-level programming.
 */
; var Functional = (function(parent, undefined) {
    // TODO see if '_' can be removed without breaking partial() function
    //- _ :: used for partial() function
    var _ = parent._ = Function._ = {},

        //+ slice :: create local reference for faster look-up
        slice = Array.prototype.slice,
        _unshift = Array.prototype.unshift,

        //minor optimizaton 
        //instead of [item].concat(xs)
        unshift = function(xs, item) {
            _unshift.call(xs, item);
            return xs;
        },

        //+ toArray :: a -> [b]
        toArray = function(x) {
            return slice.call(x);
        },

        //- from wu.js <http://fitzgen.github.com/wu.js/>
        //+ curry :: f -> ? -> g
        curry = function(fn /* variadic number of args */ ) {
            var args = slice.call(arguments, 1);
            curried = function() {
                return fn.apply(this, args.concat(toArray(arguments)));
            };
            ////sugar for console
            // curried.toString = function() {
            //     return fn.toString();
            // };
            curried.curried = true;
            return curried;
        },

        //- from wu.js <http://fitzgen.github.com/wu.js/>
        //+ autoCurry :: f -> Int -> g
        autoCurry = function(fn, numArgs, bind) {
            numArgs = numArgs || fn.length;
            curried = function() {
                bind = bind || this;
                if (arguments.length < numArgs) {
                    return numArgs - arguments.length > 0 ? autoCurry(curry.apply(bind, unshift(toArray(arguments), fn)), numArgs - arguments.length) : curry.apply(bind, unshift(toArray(arguments), fn));
                } else {
                    return fn.apply(bind, arguments);
                }
            };
            //sugar for console 
            curried.toString = function() {
                return fn.toString();
            };
            curried.curried = true;
            return curried;
        },

        //+ decorateFunctionPrototypeWithCurry :: IO
        decorateFunctionPrototypeWithCurry = (function() {
            Function.prototype.autoCurry = function(n) {
                return autoCurry(this, n);
            }

            Function.prototype.curry = function( /*args...*/ ) {
                return curry.apply(this, unshift(toArray(arguments), this)); //[this].concat(toArray(arguments)));
            }

        })(),

        //+ map :: f -> [a] -> [b]
        map = function(fn, sequence) {
            var length = sequence.length,
                result = new Array(length),
                i;
            fn = Function.toFunction(fn);
            for (i = 0; i < length; i++) {
                result[i] = fn.apply(null, [sequence[i], i]);
            }
            return result;
        }.autoCurry(),

        //+ compose :: f -> g -> h 
        compose = function() {
            var fns = map(Function.toFunction, arguments),
                arglen = fns.length;
            return function() {
                for (var i = arglen; --i >= 0;) {
                    arguments = [fns[i].apply(this, arguments)];
                }
                return arguments[0];
            };
        },

        //+ sequence :: f -> g -> h
        sequence = function() {
            var fns = map(Function.toFunction, arguments),
                arglen = fns.length;
            return function() {
                var i;
                for (i = 0; i < arglen; i++) {
                    arguments = [fns[i].apply(this, arguments)];
                }
                return arguments[0];
            };
        },

        //+ memoize :: f -> g
        //good shit :D http://jsperf.com/comparison-of-memoization-implementations/28
        memoize = function(fn) {
            return function() {
                var args = toArray(arguments),
                    //Array.prototype.slice.call(arguments),
                    hash = "",
                    i = args.length;
                currentArg = null;
                while (i--) {
                    currentArg = args[i];
                    hash += (currentArg === Object(currentArg)) ? JSON.stringify(currentArg) : currentArg;
                    fn.memoize || (fn.memoize = {});
                }
                return (hash in fn.memoize) ? fn.memoize[hash] : fn.memoize[hash] = fn.apply(this, args);
            };
        },

        //+ reduce :: f -> a -> [a] -> a
        reduce = function(fn, init, sequence) {
            var len = sequence.length,
                result = init,
                i;
            fn = Function.toFunction(fn);
            for (i = 0; i < len; i++) {
                result = fn.apply(null, [result, sequence[i]]);
            }
            return result;
        }.autoCurry(),

        //+ select :: f -> [a] -> [a]
        select = function(fn, sequence) {
            var len = sequence.length,
                result = [],
                i, x;
            fn = Function.toFunction(fn);
            for (i = 0; i < len; i++) {
                x = sequence[i];
                fn.apply(null, [x, i]) && result.push(x);
            }
            return result;
        }.autoCurry(),

        //+ guard :: (_ -> Bool) -> f -> g -> h
        guard = function(guard, fn, otherwise) {
            guard = Function.toFunction(guard || I);
            fn = Function.toFunction(fn);
            otherwise = Function.toFunction(otherwise || I);
            return function() {
                return (guard.apply(this, arguments) ? fn : otherwise).apply(this, arguments);
            };
        }.autoCurry(),

        //+ flip :: f -> g 
        flip = function(f) {
            return function() {
                var args = toArray(arguments);
                args = args.slice(1, 2).concat(args.slice(0, 1)).concat(args.slice(2));
                return f.apply(null, args);
            };
        },

        //+ foldr :: f -> a -> [a] -> a
        foldr = function(fn, init, sequence) {
            var len = sequence.length,
                result = init,
                i;
            fn = Function.toFunction(fn);
            for (i = len; --i >= 0;) {
                result = fn.apply(null, [sequence[i], result]);
            }
            return result;
        }.autoCurry(),

        //+ and :: _ -> (_ -> Bool)
        and = function() {
            var args = map(Function.toFunction, arguments),
                arglen = args.length;
            return function() {
                var value = true,
                    i;
                for (i = 0; i < arglen; i++) {
                    if (!(value = args[i].apply(this, arguments))) break;
                }
                return !!value;
            };
        },

        //+ or :: _ -> (_ -> Bool)
        or = function() {
            var args = map(Function.toFunction, arguments),
                arglen = args.length;
            return function() {
                var value = false,
                    i;
                for (i = 0; i < arglen; i++) {
                    if ((value = args[i].apply(this, arguments))) break;
                }
                return !!value;
            };
        },

        //+ some :: f -> [a] -> Bool
        some = function(fn, sequence) {
            fn = Function.toFunction(fn);
            var len = sequence.length,
                value = false,
                i;
            for (i = 0; i < len; i++) {
                if ((value = fn.call(this, sequence[i]))) break;
            }
            return value;
        }.autoCurry(),

        //+ every :: f -> [a] -> Bool
        every = function(fn, sequence) {
            fn = Function.toFunction(fn);
            var len = sequence.length,
                value = true,
                i;
            for (i = 0; i < len; i++) {
                if (!(value = fn.call(this, sequence[i]))) break;
            }
            return value;
        }.autoCurry(),

        //+ not :: f -> (_ -> Bool)
        not = function(fn) {
            fn = Function.toFunction(fn);
            return function() {
                return !fn.apply(this, arguments);
            };
        },

        //Determines whether all arguments are equal to the first argument x
        //eq(1)(1,2,3) => false
        //eq(1)(1,1,1) => true
        //eq(1,1,1,1,2)=>false
        eq = function(x) {
            var equal = function() {
                    return every(function(t) {
                        return x === t;
                    }, arguments);
                };
            return arguments.length === 1 ? equal : equal.apply(this, arguments); //if 1 arg returns curried function otherwise compares immediately
        },

        //+ equal :: _ -> (_ -> Bool)
        equal = function() {
            var arglen = arguments.length,
                args = map(Function.toFunction, arguments);
            if (!arglen) {
                return K(true);
            }
            return function() {
                var value = args[0].apply(this, arguments),
                    i;
                for (i = 1; i < arglen; i++) {
                    if (value != args[i].apply(this, args)) return false;
                }
                return true;
            };
        },

        //+ lamda :: a -> f
        lambda = function(object) {
            return object.toFunction();
        },

        //+ invoke :: String -> (a -> b)
        invoke = function(methodName) {
            var args = slice.call(arguments, 1);
            return function(object) {
                return object[methodName].apply(object, slice.call(arguments, 1).concat(args));
            };
        },

        //+ pluck :: String -> a -> b
        pluck = function(name, obj) {
            return obj[name];
        }.autoCurry(),

        //+ until :: a -> f -> (b -> c)
        until = function(pred, fn) {
            fn = Function.toFunction(fn);
            pred = Function.toFunction(pred);
            return function(value) {
                while (!pred.call(this, value)) {
                    value = fn.call(this, value);
                }
                return value;
            }
        }.autoCurry(),

        //+ zip :: (List ...) => [a] -> [b] -> ... -> [[a, b, ...]]
        zip = function() {
            var n = Math.min.apply(this, map('.length', arguments)),
                results = new Array(n),
                key, i;
            for (i = 0; i < n; i++) {
                key = String(i);
                results[key] = map(pluck(key), arguments);
            };
            return results;
        },

        //+ I :: a -> a
        I = function(x) {
            return x;
        },

        //+ K :: a -> (_ -> a)
        K = function(x) {
            return function() {
                return x;
            }
        },

        //+ S :: f -> g -> (_ -> b)
        S = function(f, g) {
            var toFunction = Function.toFunction;
            f = toFunction(f);
            g = toFunction(g);
            return function() {
                var return_value_of_g = g.apply(this, arguments),
                    original_args = slice.call(arguments, 0),
                    all_args = unshift(original_args, return_value_of_g);
                return f.apply(this, all_args);
            };
        },

        //+ partial :: _ -> f
        partial = function() {
            var fn = this,
                args = toArray(arguments),
                subpos = [],
                i, value;

            for (i = 0; i < arguments.length; i++) {
                arguments[i] == _ && subpos.push(i);
            }

            return function() {
                var specialized = args.concat(slice.call(arguments, subpos.length)),
                    i;
                for (i = 0; i < Math.min(subpos.length, arguments.length); i++) {
                    specialized[subpos[i]] = arguments[i];
                }
                for (i = 0; i < specialized.length; i++) {
                    if (specialized[i] === _) {
                        return fn.partial.apply(fn, specialized);
                    }
                }
                return fn.apply(this, specialized);
            };
        },

        //+ ECMAsplit :: String -> Int -> String
        // ECMAsplit is an ECMAScript-compliant `split`, although only for
        // one argument.
        //uses the function if String.prototype.split isnt compliant
        ECMAspit = ('ab'.split(/a*/).length) > 1 ? String.prototype.split :
        function(separator, limit) {
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
        stringLambda = function() {
            var params = [],
                expr = this,
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
                        vars = this.replace(regex, '').match(/([a-z_$][a-z_$\d]*)/gi) || [];
                    for (var i = 0, v; v = vars[i++];)
                    params.indexOf(v) >= 0 || params.push(v);
                }
            }
            return new Function(params, 'return (' + expr + ')');
        },

        //+ cacheStringLambda :: IO
        cacheStringLambda = function() {
            var proto = String.prototype,
                cache = {},
                uncached = proto.lambda,
                cached;
            cached = function() {
                var key = '#' + this;
                return cache[key] || (cache[key] = uncached.call(this));
            };
            cached.cached = function() {};
            cached.uncache = function() {
                proto.lambda = uncached
            };
            proto.lambda = cached;
        },

        //+ stringToFunction :: _ -> f
        stringToFunction = function() {
            var body = this;
            if (body.match(/\breturn\b/)) {
                return new Function(this);
            }
            return this.lambda();
        };

    //+ decorateFunctionPrototypeWithPartial :: IO
    Function.prototype.partial = partial;

    Function.prototype.flip = function( /*args...*/ ) {
        return flip.apply(this, unshift(toArray(arguments), this));
    }

    //+ decorateFunctionWithToFunction :: IO
    Function.toFunction = function(value) {
        return value.toFunction();
    }
    Function.prototype.toFunction = function() {
        return this;
    }

    String.prototype.lambda = stringLambda;
    String.prototype.lambda.cache = cacheStringLambda;
    String.prototype.toFunction = stringToFunction;
    // String.prototype.ECMAsplit = ('ab'.split(/a*/).length > 1 ? String.prototype.split : ECMAspit);

    // Add public functions to the module namespace,
    return {
        map: map,
        curry: curry,
        compose: compose,
        sequence: sequence,
        memoize: memoize,

        reduce: reduce,
        foldl: reduce,
        foldr: foldr,

        select: select,
        filter: select,
        guard: guard,
        flip: flip,
        and: and,
        // and_: and, // alias reserved word for coffeescript
        or: or,
        // or_: or, // alias reserved word for coffeescript
        some: some,
        every: every,
        eq: eq,
        not: not,
        // not_: not, // alias reserved word for coffeescript
        equal: equal,
        lambda: lambda,
        invoke: invoke,
        pluck: pluck,
        until: until,
        // until_: until, // alias reserved word for coffeescript
        zip: zip,
        I: I,
        // id: I,
        K: K,
        // konst: K,
        S: S//,

        // install: function(except) {
        //     var source = functional,
        //         target = parent;
        //     for (var name in source)
        //     if (!(name == 'install' || name.charAt(0) == '_' || (except && except.contains(name)))) target[name] = source[name];
        // }
    };
})(this);