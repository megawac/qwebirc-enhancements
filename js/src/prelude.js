//small generic functional helper library
; var prelude = (function(undefined) {

    // Helpers
    //+ equals :: a -> a -> Bool
    var funclib = Functional,

        ret = {},

        //+ nTimes :: Integer -> (-> a) -> [a]
        // nTimes = ret.nTimes = function(times, fun) {
        //     var result = [];
        //     for (var i = 0; i < times; i++) {
        //         result = cons(fun(), result);
        //     }
        //     return result;
        // }.autoCurry(),

        //+ log :: a -> a
        log = ret.log = function(what) {
            console.log(what);
            return what;
        },

        //+ log2 :: String -> a -> a
        // log2 = ret. function(one, two) {
        //     log(one);
        //     return log(two);
        // }.autoCurry(),

        // Conditional
        //+ when :: Boolean -> (? -> a) -> a
        when = ret.when = function(pred, f) {
            return function() {
                if (pred.apply(this, arguments)) return f.apply(this, arguments);
            }
        }.autoCurry(),

        //+ ifelse :: (-> Boolean) -> (-> a) -> (-> b) -> a|b
        ifelse = ret.ifelse = function(pred, f, g) {
            return function() {
                return pred.apply(this, arguments) ? f.apply(this, arguments) : g.apply(this, arguments);
            }
        }.autoCurry(),

        //+ negate :: Boolean -> Boolean
        negate = ret.negate = function(bool) {
            return !bool;
        },

        //+ andand :: a -> b -> Boolean
        andand = ret.andand = function(x, y) {
            return x && y;
        }.autoCurry(),

        //+ oror :: a -> b -> Boolean
        oror = ret.oror = function(x, y) {
            return x || y;
        }.autoCurry(),

        equals = ret.equals = function(x, y) {
            return x === y;
        }.autoCurry(),

        //+ isObj :: a -> Boolean
        isObj = ret.isObj = function(obj) {
            return (typeof obj == "object" && !Array.isArray(obj));
        },

        //+ isNumber :: a -> Boolean
        isNumber = ret.isNumber = function(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        },

        // Array
        //+ take :: Integer -> [a] -> [a]
        take = ret.take = function(n, xs) {
            return xs.slice(0, n);
        }.autoCurry(),

        //+ drop :: Integer -> [a] -> [a]
        drop = ret.drop = function(n, xs) {
            return xs.slice(n);
        }.autoCurry(),

        //+ unshift :: [a] -> b -> [b,a]
        // unshift = ret. function(xs, x) {
        //     return x.concat(xs);
        // }.autoCurry(),
        //+ cons :: a -> [b] -> [a,b]
        cons = ret.cons = function(x, xs) {
            return [x].concat(xs);
        }.autoCurry(),

        //+ concat :: [a] -> [b] -> [a,b]
        concat = ret.concat = function(xs, ys) {
            return xs.concat(ys);
        }.autoCurry(),

        //+ first :: [a] -> a
        first = ret.first = function(xs) {
            return xs[0];
        },

        item = ret.item = function(n, xs) {
            return xs[n];
        }.autoCurry(),

        //+ rest :: [a] -> [a] 
        rest = ret.rest = function(xs) {
            return (typeof xs == "string") ? xs.substr(1 /*, xs.length*/ ) : xs.slice(1 /*, xs.length*/ );
        },

        //+ last :: [a] -> a
        last = ret.last = function(xs) {
            return xs[xs.length - 1];
        },

        //+ join :: String -> [String] -> String
        join = ret.join = function(token, xs) {
            return xs.join(token);
        }.autoCurry(),

        //+ groupsOf :: Integer -> [a] -> [[a]]
        // groupsOf = ret.groupsOf = function(n, xs) {
        //     if (!xs.length) return [];
        //     return cons(take(n, xs), groupsOf(n, drop(n, xs)));
        // }.autoCurry(),

        //+ zipWith :: (a -> b -> c) -> [a] -> [b] -> [c]
        // zipWith = ret. function(f, xs, ys) {
        //     f = ret. f.toFunction();
        //     return xs.reduce(function(result, x, i) {
        //         return result.concat(f(x, ys[i]));
        //     }, []);
        // }.autoCurry(),
        //+ uniq :: [a] -> [a] 
        uniq = ret.uniq = function(xs) {
            var result = [];
            for (var i = 0; i < xs.length; i++) {
                if (result.indexOf(xs[i]) < 0) result.push(xs[i]);
            }
            return result;
        },

        //+ uniqBy :: (a -> b) -> [a] -> [a]
        // uniqBy = ret.uniqBy = function(fun, xs) {
        //     var result = [],
        //         len = xs.length,
        //         fun = ret.fun.toFunction();
        //     for (var i = 0; i < len; i++) {
        //         if (funclib.map(fun)(result).indexOf(fun(xs[i])) < 0) {
        //             result.push(xs[i]);
        //         }
        //     }
        //     return result;
        // }.autoCurry(),

        //+ reverse :: [a] -> [a]
        // reverse = ret.reverse = function(xs) {
        //     var mempty = (typeof xs == "string") ? "" : [];
        //     if (isArray(xs)) {
        //         //destructive
        //         return xs.reverse();
        //     } else {
        //         return funclib.reduce(function(x, acc) {
        //             return acc.concat(x);
        //         }, mempty, xs);
        //     }
        // }.autoCurry(),

        //+ intersect :: [a] [b] -> [a ∩ b]
        intersect = ret.intersect = function(xs1, xs2) {
            return xs1.filter(contains(xs2));
        }.autoCurry(),

        //+ intersect :: [a] [b] -> [a ∂ b]
        difference = ret.difference = function(xs1, xs2) {
            return xs1.filter(funclib.not(contains(xs2)));
        }.autoCurry(),

        //+ intersect :: [a] [b] -> [a u b]
        union = ret.union = function(xs1, xs2) {
            return uniq(concat(xs1, xs2)); //can also call combine
        }.autoCurry(),

        //destructive
        // is_num_array = ret. function(arr) {return reduce(andand, true, funclib.map(isNumber, arr))},
        //+ sort :: [a] -> [a]
        // sort = ret. function(xs) {
        //     num_sort_func = ret. function(a, b) {
        //         return a - b;
        //     };
        //     return is_num_array ? xs.sort(num_sort_func) : xs.sort();
        // },
        //+ element :: [a] -> b -> Boolean
        // element = ret. function(arr, x) {
        //     return arr.indexOf(x) >= 0;
        // }.autoCurry(),
        //+ flatten :: [[a]] -> [a]
        // flatten = ret. funclib.reduce(concat, []),
        //+ sortBy :: (a -> b) -> [a] -> [a]
        // sortBy = ret. function(fun, xs) {
        //     var _sortBy = ret. function(iterator, xs, context) {
        //             return map('.value', map(function(value, index) {
        //                 return {
        //                     value: value,
        //                     criteria: iterator.call(context, value, index)
        //                 };
        //             }, xs).sort(function(left, right) {
        //                 var a = left.criteria,
        //                     b = right.criteria;
        //                 return a < b ? -1 : a > b ? 1 : 0;
        //             }));
        //         }
        //     var f = ret. fun.toFunction();
        //     return _sortBy(f, xs);
        // }.autoCurry(),
        //+ groupBy :: (a -> Boolean) -> [a] -> {false: [a], true: [a]}
        // groupBy = ret. function(fun, xs) {
        //     var f = ret. fun.toFunction();
        //     var _makeHash = ret. function(obj, x) {
        //             var val = ret. f(x);
        //             if (!obj[val]) obj[val] = [];
        //             obj[val].push(x);
        //             return obj;
        //         }
        //     return reduce(_makeHash, {}, xs);
        // }.autoCurry(),

        // String
        //+ strip :: String -> String
        //no whitespace
        strip = ret.strip = function(str) {
            return str.replace(/\s+/g, "");
        },

        //+ split :: String -> String -> [String]
        split = ret.split = function(token, xs) {
            return xs.split(token);
        }.autoCurry(),

        //+ test :: RegEx -> String -> Boolean
        test = ret.test = function(expr, x) {
            return expr.test(x);
        }.autoCurry(),

        //+ match :: RegEx -> String -> [] 
        match = ret.match = function(expr, x) {
            return x.match(expr);
        }.autoCurry(),

        //+ replace :: RegEx -> String -> String -> String
        replace = ret.replace = function(pattern, sub, str) {
            return str.replace(pattern, sub);
        }.autoCurry(),

        indexOf = ret.indexOf = function(par, kid) {
            return par.indexOf(kid);
        }.autoCurry(),

        contains = ret.contains = function(par, kid) {
            return par.indexOf(kid) !== -1;
        }.autoCurry();

    // Object
    //+ setVal :: String -> Object -> a -> a
    // setVal = ret. function(attribute, x, val) {
    //     x[attribute] = val;
    //     return val;
    // }.autoCurry(),
    // //+ getVal :: String -> Object -> a
    // getVal = ret. function(attribute, x) {
    //     return function() {
    //         return x[attribute];
    //     };
    // }.autoCurry(),
    // getProp = ret. function(x, attr) {
    //     return x[attr];
    // }.autoCurry(), //funclib.pluck.flip();
    // setProp = ret. function(x, attr, val) {
    //     x[attr] = val;
    //     return val;
    // }.autoCurry(),

    // Math
    //+ random :: Integer-> Integer
    // random = ret. function(i) {
    //     return Math.floor(Math.random() * i);
    // },
    // //+ subtract :: Number -> Number -> Number
    // subtract = ret. function(x, y) {
    //     return y - x;
    // }.autoCurry(),
    // //+ sum :: [Number] -> Number
    // sum = ret. funclib.reduce('+', 0),
    // //+ div :: Number -> Number -> Number
    // div = ret. function(x, y) {
    //     return x / y;
    // },
    // //+ average :: [Number] -> Number
    // average = ret. function(xs) {
    //     var zerolessArr = ret. filter('!==0', xs);
    //     return div(sum(zerolessArr), zerolessArr.length);
    // },

    // Other
    //+ repeat :: a -> Integer -> [a]
    // repeat = ret. function(arg, n) {
    //     return nTimes(n, funclib.id.curry(arg));
    // }.autoCurry();

    return ret;
}());