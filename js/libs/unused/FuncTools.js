/*
  Function: $identity
    A function that simply returns the value given to it.
    
  Parameters:
    v - a value.
    
  Returns:
    The passed in value.
    
  (start code)
  $identity(5); // returns 5
  (end)
*/
function $identity(v) { return v; };

/*
  Function: $callable
    Check whether a value is non-null and a function.
    
  Paramters:
    v - a value.
    
  Returns:
    A function which returns boolean.
*/
function $callable(v) { return v && $type(v) == 'function'; }

/*
  Function: $range
    Returns a array of integer values.
  
  Parameters:
    a - an integer value.
    b - an integer, must be greater than a.
  
  Returns:
    An array.
    
  (start code)
  $range(1, 10) // [1, 2, 3, 4, 5, 6, 7, 8, 9]
  (end)
*/
function $range(a, b) {
  var start = (b && a) || 0, end = b || a;
  return $repeat(end-start, function() { return start++; });
};

/*
  Function: $isnull
    Function for checking whether a value is null. Useful
    in function composition.
    
  Parameters:
    v - a value.
    
  Returns:
    boolean.
*/
function $isnull(v) { return v == null; };

/*
  Function: $notnull
    Complement to $isnull
    
  Parameters:
    v - a value.
    
  Returns:
    boolean.
*/
function $notnull(v) { return v != null; };

/*
  Function: $repeat
    Used to repeat a value. Returns an array of the value repeated
    n times.
  
  Parameters:
    n - a integer.
    v - a value.
    
  Returns:
    An array.
    
  (start code)
  $repeat(10, 'x'); // ["x", "x", "x", "x", "x", "x", "x", "x", "x", "x"]
  (end)
*/
function $repeat(n, v) {
  return $lambda(v).iterate(n);
};

/*
  Function: $get
    Get the value from an object. Allows avoiding annoying
    if statements of the form if(object && object.foo && object.bar) fn(object.foo.bar);
    If any of the properties are undefined/null returns right away.
    
  Parameters:
    The first parameters is an object, the following parameters are the properties
    you want to access.
    
  Returns:
    A value.
    
  (start code)
  var obj = {"foo": {"bar": {"baz":42}}};
  $get(obj, "foo", "bar", "baz"); // 42
  $get(obj, "foo", "baj", "baz"); // null
  (end)
*/
function $get(first, prop) {
  if(first == null) return null;
  var args = $A(arguments), rest = args.rest(2), next;
  if(rest.length == 0) return first[prop];
  if(['object', 'array'].contains($type(first))) next = first[prop];
  if($type(next) == 'function') next = first[prop]();
  return (next == null) ? null : $get.apply(null, [next].concat(rest));
};

/*
  Constant: Function._
    To denote a value to be filled in curried function.
  
  See Also:
    <Function.curry>
*/
Function._ = {};
Function.nomemo = {};

(function() {
function argmerge(a, b) {
  var result = [];
  for(var i = 0, len = Math.max(a.length, b.length); i < len; i++) {
    result[i] = (b[i] == Function._) ? a[i] || Function._ : (b[i] !== undefined && b[i]) || a[i];
  }
  return result;
};
Function.implement({
  /*
    Function: Function.exec
      Takes a list of arguments a creates a function
      which a takes a function and calls it with those
      arguments. If called with a function as the first
      argument, executes the function immediately.
      
    Parameters:
      The first parameter is bind or a function. The rest 
      are arguments that will passed to the called function
      if the first argument is not a function.
      
    Returns:
      A function.
      
    (start code)
    var obj = {name:"Joe"};
    function sayHello(to) {
      console.log("Hello " + to + " from " + this.name + "!");
    };
    [sayHello, sayHello, sayHello].each(Function.exec(obj, "Bob"));
    (end)
  */
  exec: function(bindorfn){
    if($callable(bindorfn)) return bindorfn();
    var args = $A(arguments).rest();
    return function(fn) {
      return fn.apply(bindorfn, args);
    };
  },
  
  /*
    Function: Function.not
      Returns the complement of a function. Useful when composing
      functions.

    Parameters:
      fn - a function.

    Returns:
      A function which return a boolean value.
      
    (start code)
    function isEven(n) { return n % 2 == 0; };
    var isOdd = isEven.not();
    isOdd(3); // false
    (end code)
  */
  not: function(fn) {
    fn = (fn) ? fn : this;
    return function() {
      return !fn.apply(this, arguments);
    };
  },
  
  /*
    Function: Function.eq
      For testing equality when composing functions. Return
      a function which tests equality against the passed
      in value.

    Parameters:
      a - a value.

    Return:
      boolean.

    (start code)
    var fn = Function.eq(5);
    [1, 2, 3, 4, 5].some(Function.eq(5)); // true
    (end)
  */
  eq: function(a) { 
    return function(b) { 
      return a == b; 
    };
  },
  
  /*
    Function: Function.iterate
      Repeats a function generating an array of values
      from calling this function n times.

    Parameters:
      n - an integer.
      fn - a function.

    Returns:
      An array.

    (start code)
    var ints = (function() { var n = 0; return function() { return n++; }})();
    ints.iterate(10); // [1, 2, 3, 4, 5, 6, 7, 8, 9]
    (end)
  */
  iterate: function(forn, n) {
    var result = [],
        fandn = ($callable(this)) ? [this, forn] : [forn, n],
        fn = fandn[0], n = fandn[1];
    for(var i = 0; i < n; i++) {
      result.push(fn());
    }
    return result;
  },
  
  /*
    Function: Function.decorate
      Decorate a function. Takes a list of decorators and applies
      them to the function.
      
    Parameters:
      A variable list of functions.
      
    Returns:
      The decorated function.
      
    (start code)
    var fib = function (n) {
      return n < 2 ? n : fib(n-1) + fib(n-2);
    }.decorate(Function.memoize);
    fib(100);
    (end)
  */
  decorate: function() {
    var decorators = $A(arguments), orig = resultFn = this, decorator;
    while(decorator = decorators.pop()) resultFn = decorator(resultFn);
    resultFn._arglist = Function.arglist(orig);
    resultFn._decorated = orig;
    return resultFn;
  },

  /*
    Function: Function.comp
      Compose any number of functions.
      
    Parameters:
      A variable list of functions.
      
    Returns:
      A function.
      
    (start code)
    var objects = $repeat(5, {"foo":{"bar":{"baz":42}}});
    objects.map(Function.comp(Function.acc("foo", "bar", "baz"), Function.eq(42))); // [true, true, true, true, true]
    (end)
  */
  comp: function() {
    var fns = $A(arguments), self = this;
    return function() {
      var temp = $A(fns);
      var args = $A(arguments), result = ($callable(self)) ? self.apply(this, args) : null, fn;
      while(fn = temp.shift()) result = fn.apply(null, (result && [result]) || args);
      return result;
    };
  },
  
  /*
    Function: Function.partial
      A simple form of currying. Takes a function and you can bind
      in order the arguments to a function.
      
    Parameters:
      Take a variable list of arguments. The first is the bind
      parameter.
    
    Returns:
      A function.
      
    (start code)
    function abc(a, b, c) { return a + b + c; };
    var partial = abc.partial(null, 1, 2);
    partial(3) // 6
    (end)
  */
  partial: function(bind) {
    var self = this;
    args = $A(arguments).rest();
    return function() {
      return self.apply(bind, args.concat($A(arguments)));
    };
  },
  
  /*
    Function: Function.curry
      A much more powerful version of currying. Any argument may
      supplied. Once an argument has been supplied it cannot be changed.
      
    (start code)
    var _ = Function._;
    function abc(a, b, c) { return a + b + c; };
    var curried = abc.curry(null, _, _, 3);
    curried = curried(1);
    curried(_, 2); // 6
    
    var _ = Function._;
    function append(strA, strB) {
      return strA + strB;
    }
    var fn = append.curry(null, Function._, '!');
    ['Zap', 'Pow', 'Boom'].map(fn);
    (end)
  */
  curry: function(bind) {
    var self = this, arglist = Function.arglist(this), args = $A(arguments).rest();
    if(args.length > arglist.length) args = args.drop(args.length - arglist.length);
    args = argmerge($repeat(arglist.length, Function._), args);
    return function curryFn() {
      var fargs = argmerge($A(arguments), args);
      if(fargs.length > arglist.length) fargs = fargs.drop(fargs.length - arglist.length);
      if(fargs.length >= arglist.length && fargs.every(Function.not(Function.eq(Function._)))) {
        return self.apply(bind, fargs);
      } else {
        return self.curry.apply(self, [bind].extend(fargs));
      }
    };
  },
  
  /*
    Function: Function.memoize
      A memoize decorator. Creates a hash of seen arguments and the
      return values.

    Parameters:
      fn - a function.

    Returns:
      A function.

    (start code)
    var fib = function (n) {
      return n < 2 ? n : fib(n-1) + fib(n-2);
    }.decorate(Function.memoize);
    fib(100);
    (end)
  */
  memoize: function(fn, table) {
    table = table || {};
    return function memoized() {
      var args = $A(arguments);
      var enc = JSON.encode(args);
      if(!table[enc]) {
        var result = fn.apply(this, args);
        if(result != Function.nomemo)
        {
          table[enc] = result;
          return result;
        }
      } else {
        return table[enc];
      }
    };
  },
  
  /*
    Function: Function.pre
      A decorator for supporting preconditions for a function. A predicate
      can be supplied for each argument.

    Parameters:
      conditions - an array of predicate functions.
      error - a boolean or function. If boolean will throw an exception
        on a failed predicate. If a function will call it as an error
        handler with the array containing the list of passed and failed
        predicates.

    Returns:
      A function.

    (start code)
    var isEven = function(n) { return n % 2 == 0; };
    var isOdd = isEven.not();
    var add = function(a, b) { return a + b; }.decorate(Function.pre([isEven, isOdd], true));
    add(2, 3); // 5
    add(2, 2); // throws exception
    (end)
  */
  pre: function(conditions, error) {
    error = error || false;
    return function preDecorator(fn) {
      return function() {
        var args = arguments;
        var passed = conditions.map(function(afn, i) {
          var result = afn(args[i]);
          return result;
        });
        if(passed.indexOf(false) == -1) {
          return fn.apply(this, arguments);
        } else {
          if($type(error) == 'boolean' && error) {
            var err = new Error("Arguments did not match preconditions.");
            err.args = arguments;
            err.passed = passed;
            err.source = fn.toString();
            throw err;
          } else if($type(error) == 'function') {
            error(passed);
          }
        }
      }
    };
  },
  
  /*
    Function: Function.post
      A decorator for supporting postconditions for a function. A predicate
      can be supplied to test the result of the function.

    Parameters:
      condition - a predicate function.
      error - a boolean or function. If boolean will throw an exception
        on a failed predicate. If a function will call it as an error
        handler with the array containing the list of passed and failed
        predicates.

    Returns:
      A function.

    (start code)
    var isSmith = Function.comp(Function.acc('last'), Function.eq('Smith'));

    var fn = function(first, last) {
      return {first:first, last:last}; 
    }.decorate(Function.post(isSmith, true));

    fn("Bob", "Smith");
    fn("Bob", "Howard"); // throws exception
    (end)
  */
  post: function(condition, error) {
    error = error || false;
    return function postDecorator(fn) {
      return function() {
        var result = fn.apply(this, arguments);
        if(condition(result)) {
          return result;
        } else {
          if($type(error) == 'boolean' && error) {
            var err = new Error("Result did not match postcondition.");
            err.args = arguments;
            err.result = result;
            err.source = fn.toString();
            throw err;
          } else if($type(error) == 'function') {
            error(passed);
          }
        }
      };
    };
  },
  
  /*
    Function: Function.arglist
      Get the arglist of a function. Return an array of
      the names of function's parameters.

    Parameters:
      fn - a function.

    Returns:
      An array of strings.

    See Also:
      $arity

    (start code)
    function add(a, b, c) { return a + b + c; };
    Function.arglist(add) // ["a", " b", " c"]
    (end)
  */
  arglist: function(fn) {
    return fn._arglist || fn.toString().match(/function \S*\((.*?)\)/)[1].split(',');
  },
  
  /*
    Function: Function.dispatch
      Support for function dispatch on arity.

    Parameters:
      This function takes any number of functions as it's parameters.
      Each function should take a unique number of parameters.

    See Also:
      $reduce

    (start code)
    var sum = Function.dispatch(
      function(a) { return a; },
      function(a, b) { return a + b }
    );
    sum(5); // 5
    sum(5, 10); // 15
    (end)
  */
  dispatch: function() {
    var fns = $A(arguments);
    var dispatch = [];
    fns.each(function(fn) {
      var arglist = Function.arglist(fn);
      dispatch[arglist.length] = fn;
    });
    return function () {
      var args = $A(arguments).filter($notnull);
      return dispatch[args.length].apply(this, args);
    };
  },
  
  /*
    Function: Function.reduce
      Reduce an array to a single value using a function defined
      with Function.arity.

    Parameters:
      fn - a function.
      ary - an array.

    Returns:
      A value.

    (start code)
    var ary = $range(0, 100);
    var sum = Function.dispatch(
      function(a) { return a; },
      function(a, b) { return a + b.first(); }
    );
    sum.reduce(ary); // 4950
    (end)
  */
  reduce: function(ary) {
    var fn = this, result = ary.first();
    while(ary.rest().length != 0) {
      var rest = ary.rest();
      result = fn(result, rest);
      ary = rest;
    }
    return result;
  },
  
  /*
    Function: Function.acc
      Returns a function that applies $get on it's argument. Useful
      in function composition.

    Parameters:
      A variable list of properties you wish to access in an object.

    Returns:
      A value.

    (start code)
    var objects = $repeat(5, {"foo":{"bar":{"baz":42}}});
    objects.map(Function.acc("foo", "bar", "baz")); // [42, 42, 42, 42, 42]
    (end)
  */
  acc: function() {
    var args = $A(arguments);
    return function(obj) {
      return $get.apply(null, [obj].combine(args));
    };
  },
  
  /*
    Function: Function.msg
      Returns function which will call a function on it's
      argument. Useful when composing functions.

    Parameters:
      The method name to call.

    Returns:
      A function.

    (start code)
    var MyClass = new Class({
      initialize: function(name) { this.name = name; },
      sayHello: function() {
         console.log("Hello from " + this.name)
      }
    });
    var ctorfn = function(name) { return new MyClass(name); };
    ["John", "Mary", "Bob"].map(Function.comp(ctorfn, Function.msg("sayHello")));
    (end)
  */
  msg: function(methodName) {
    var rest = $A(arguments).rest();
    return function(obj) {
      var method = obj[methodName];
      if($callable(method)) {
        return method.apply(obj, rest);
      } else {
        return obj.methodName;
      }
    };
  }
});
})();

// Optimization
Function.implement({
  arglist: Function.arglist.decorate(Function.memoize)
});

// We need a backreference to wrapper to support decorator usage from within classes - David
Class.extend({
  wrap: function(self, key, method) {
    if (method._origin) method = method._origin;
    var wrapper = function() {
      if (method._protected && this._current == null) throw new Error('The method "' + key + '" cannot be called.');
      var caller = this.caller, current = this._current;
      this.caller = current; this._current = arguments.callee;
      var result = method.apply(this, arguments);
      this._current = current; this.caller = caller;
      return result;
    }.extend({_owner: self, _origin: method, _name: key});
    method._wrapper = wrapper;
    return wrapper;
  }
});


Array.implement({
  /*
    Function: Array.first
      Returns the first item.
  */
  first: function() { return this[0]; },

  /*
    Returns the item at index n
  */
  item: function(n) {return this[n];},

  /*
    Function: Array.rest
      Returns everything but the first item. If the
      Array is empty returns the array.
      
    Parameters:
      n - integer, the start index.
      
    Returns:
      An array.
  */
  rest: function(n) { return this.slice(n || 1, this.length); },
  
  /*
    Function: Array.drop
      Drop n items from the end of an array. Defaults to dropping 1 item.
    
    Parameters:
      n - integer, the number of items to drop.
      
    Returns:
      An array.
  */
  drop: function(n) { return this.slice(0, this.length-(n || 1)); },
  
  /*
    Function: Array.tail
      Returns the tail of the array. If no n specified returns the
      whole array.
      
    Parameters:
      n - integer.
      
    Returns:
      An array.
  */
  tail: function(n) { return this.slice((n || 0), this.length); },
  
  /*
    Function: Array.head
      Returns the head of the array. If no n specified returns the
      whole array.
      
    Parameters:
      n - an integer.
      
    Returns:
      An array.
  */
  head: function(n) { return this.slice(0, (n || this.length)); },
  
  /*
    Function: Array.partition
      Partition an array into an array of subarrays.
    
    Parameters:
      n - the size of the partition.
      
    Returns:
      An array
      
    (start code)
    var ary = $range(10);
    ary.partition(2); // [[0, 1], [2, 3], [4, 5], [6, 7], [8, 9]]
    (end)
  */
  partition: function(n) {
    if(this.length % n != 0) throw Error("The length of this array is not a multiple of " + n);
    var result = [];
    var ary = this;
    while(ary.length > 0) {
      var sub = ary.head(n);
      result.push(sub);
      ary = ary.tail(n);
    }
    return result;
  },
  
  /*
    Function: Array.asFn
      Return a function that takes an index and returns
      that item in the array. Useful when composing functions.
      
    Returns:
      A function.
      
    (start code)
    var ary = ['cat', 'dog', 'bird', 'zebra', 'lion'];
    [1, 3, 2].map(ary.asFn()); // ['dog', 'zebra', 'bird']
    (end)
  */
  asFn: function() {
    var self = this;
    return function (idx) {
      return self[idx];
    };
  },

  /*
    Function: hash
      Takes an array (whose contents should be [[k0, v0], [k1, v1], ..., [kn, vn]])
      and returns a Hash object.

    Returns:
      A Hash object.
  */
  hash: function()
  {
    var result = $H();
    this.each(function(kv) {
      result[kv[0]] = kv[1];
    });
    return result;
  }
});

Hash.implement({
  /*
    Function: Hash.asFn
      Return a function that takes string and returns
      the corresponding value from the hash. Useful
      when composing functions.
      
    Returns:
      A function.
      
    (start code)
    var address = {
       "city": "New York", 
       "state": "New York", 
       "zip": 100018, 
       "street": "350 5th Avenue",
       "building": "Empire State",
       "floor": 32
    };
    ["building", "street", "city"].map($H(address).asFn()); // ["Empire State", "350 5th Avenue", "New York"]
    (end)
  */
  asFn: function() {
    var self = this;
    return function(k) {
      return self[k];
    };
  },
  
  /*
    Function: Hash.extract
      Get a new Hash of only the specified keys.
      
    Parameters:
      keys - an array of keys to extract
      clean - if true, returns a plain object.
      
    Returns:
      hash or object.
  */
  extract: function(keys, clean) {
    var result = keys.map(this.asFn()).associate(keys);
    return (clean) ? result : $H(result);
  }
});
