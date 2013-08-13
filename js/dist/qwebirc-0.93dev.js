//***************NOTE*****
//this build is based off the next 1.5 release and is catering to ES6 Harmony

/*
---
MooTools: the javascript framework

web build:
 - http://mootools.net/core/76bf47062d6c1983d66ce47ad66aa0e0

packager build:
 - packager build Core/Core Core/Array Core/String Core/Number Core/Function Core/Object Core/Event Core/Browser Core/Class Core/Class.Extras Core/Slick.Parser Core/Slick.Finder Core/Element Core/Element.Style Core/Element.Event Core/Element.Delegation Core/Element.Dimensions Core/Fx Core/Fx.CSS Core/Fx.Tween Core/Fx.Morph Core/Fx.Transitions Core/Request Core/Request.HTML Core/Request.JSON Core/Cookie Core/JSON Core/DOMReady Core/Swiff

...
*/

/*
---

name: Core

description: The heart of MooTools.

license: MIT-style license.

copyright: Copyright (c) 2006-2012 [Valerio Proietti](http://mad4milk.net/).

authors: The MooTools production team (http://mootools.net/developers/)

inspiration:
  - Class implementation inspired by [Base.js](http://dean.edwards.name/weblog/2006/03/base/) Copyright (c) 2006 Dean Edwards, [GNU Lesser General Public License](http://opensource.org/licenses/lgpl-license.php)
  - Some functionality inspired by [Prototype.js](http://prototypejs.org) Copyright (c) 2005-2007 Sam Stephenson, [MIT License](http://opensource.org/licenses/mit-license.php)

provides: [Core, MooTools, Type, typeOf, instanceOf, Native]

...
*/

(function(){

this.MooTools = {
	version: '1.4.5',
	build: 'ab8ea8824dc3b24b6666867a2c4ed58ebb762cf0'
};

// typeOf, instanceOf

var typeOf = this.typeOf = function(item){
	if (item == null) return 'null';
	if (item.$family != null) return item.$family();

	if (item.nodeName){
		if (item.nodeType == 1) return 'element';
		if (item.nodeType == 3) return (/\S/).test(item.nodeValue) ? 'textnode' : 'whitespace';
	} else if (typeof item.length == 'number'){
		if (item.callee) return 'arguments';
		if ('item' in item) return 'collection';
	}

	return typeof item;
};

var instanceOf = this.instanceOf = function(item, object){
	if (item == null) return false;
	var constructor = item.$constructor || item.constructor;
	while (constructor){
		if (constructor === object) return true;
		constructor = constructor.parent;
	}
	/*<ltIE8>*/
	if (!item.hasOwnProperty) return false;
	/*</ltIE8>*/
	return item instanceof object;
};

// Function overloading

var Function = this.Function;

var enumerables = true;
for (var i in {toString: 1}) enumerables = null;
if (enumerables) enumerables = ['hasOwnProperty', 'valueOf', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'constructor'];

Function.prototype.overloadSetter = function(usePlural){
	var self = this;
	return function(a, b){
		if (a == null) return this;
		if (usePlural || typeof a != 'string'){
			for (var k in a) self.call(this, k, a[k]);
			if (enumerables) for (var i = enumerables.length; i--;){
				k = enumerables[i];
				if (a.hasOwnProperty(k)) self.call(this, k, a[k]);
			}
		} else {
			self.call(this, a, b);
		}
		return this;
	};
};

Function.prototype.overloadGetter = function(usePlural){
	var self = this;
	return function(a){
		var args, result;
		if (typeof a != 'string') args = a;
		else if (arguments.length > 1) args = arguments;
		else if (usePlural) args = [a];
		if (args){
			result = {};
			for (var i = 0; i < args.length; i++) result[args[i]] = self.call(this, args[i]);
		} else {
			result = self.call(this, a);
		}
		return result;
	};
};

Function.prototype.extend = function(key, value){
	this[key] = value;
}.overloadSetter();

Function.prototype.implement = function(key, value){
	this.prototype[key] = value;
}.overloadSetter();

// From

var slice = Array.prototype.slice;

Function.from = function(item){
	return (typeOf(item) == 'function') ? item : function(){
		return item;
	};
};

Array.from = function(item){
	if (item == null) return [];
	return (Type.isEnumerable(item) && typeof item != 'string') ? (typeOf(item) == 'array') ? item : slice.call(item) : [item];
};

Number.from = function(item){
	var number = parseFloat(item);
	return isFinite(number) ? number : null;
};

String.from = function(item){
	return item + '';
};

// hide, protect

Function.implement({

	hide: function(){
		this.$hidden = true;
		return this;
	},

	protect: function(){
		this.$protected = true;
		return this;
	}

});

// Type

var Type = this.Type = function(name, object){
	if (name){
		var lower = name.toLowerCase();
		var typeCheck = function(item){
			return (typeOf(item) == lower);
		};

		Type['is' + name] = typeCheck;
		if (object != null){
			object.prototype.$family = (function(){
				return lower;
			}).hide();
			//<1.2compat>
			// object.type = typeCheck;
			//</1.2compat>
		}
	}

	if (object == null) return null;

	object.extend(this);
	object.$constructor = Type;
	object.prototype.$constructor = object;

	return object;
};

var toString = Object.prototype.toString;

Type.isEnumerable = function(item){
	return (item != null && typeof item.length == 'number' && toString.call(item) != '[object Function]' );
};

var hooks = {};

var hooksOf = function(object){
	var type = typeOf(object.prototype);
	return hooks[type] || (hooks[type] = []);
};

var implement = function(name, method){
	if (method && method.$hidden) return;

	var hooks = hooksOf(this);

	for (var i = 0; i < hooks.length; i++){
		var hook = hooks[i];
		if (typeOf(hook) == 'type') implement.call(hook, name, method);
		else hook.call(this, name, method);
	}

	var previous = this.prototype[name];
	if (previous == null || !previous.$protected) this.prototype[name] = method;

	if (this[name] == null && typeOf(method) == 'function') extend.call(this, name, function(item){
		return method.apply(item, slice.call(arguments, 1));
	});
};

var extend = function(name, method){
	if (method && method.$hidden) return;
	var previous = this[name];
	if (previous == null || !previous.$protected) this[name] = method;
};

Type.implement({

	implement: implement.overloadSetter(),

	extend: extend.overloadSetter(),

	alias: function(name, existing){
		implement.call(this, name, this.prototype[existing]);
	}.overloadSetter(),

	mirror: function(hook){
		hooksOf(this).push(hook);
		return this;
	}

});

new Type('Type', Type);

// Default Types

var force = function(name, object, methods){
	var isType = (object != Object),
		prototype = object.prototype;

	if (isType) object = new Type(name, object);

	for (var i = 0, l = methods.length; i < l; i++){
		var key = methods[i],
			generic = object[key],
			proto = prototype[key];

		if (generic) generic.protect();
		if (isType && proto) object.implement(key, proto.protect());
	}

	if (isType){
		var methodsEnumerable = prototype.propertyIsEnumerable(methods[0]);
		object.forEachMethod = function(fn){
			if (!methodsEnumerable) for (var i = 0, l = methods.length; i < l; i++){
				fn.call(prototype, prototype[methods[i]], methods[i]);
			}
			for (var key in prototype) fn.call(prototype, prototype[key], key)
		};
	}

	return force;
};

force('String', String, [
	'charAt', 'charCodeAt', 'concat', 'indexOf', 'lastIndexOf', 'match', 'quote', 'replace', 'search',
	'slice', 'split', 'substr', 'substring', 'trim', 'toLowerCase', 'toUpperCase',
	'startsWith', 'endsWith'/*, 'contains'*/
])('Array', Array, [
	'pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift', 'concat', 'join', 'slice',
	'indexOf', 'lastIndexOf', 'filter', 'forEach', 'every', 'map', 'some', 'reduce', 'reduceRight',
	'isArray'/*, 'from'*///ES6
])('Number', Number, [
	'toExponential', 'toFixed', 'toLocaleString', 'toPrecision'
])('Function', Function, [
	'apply', 'call', 'bind'
])('RegExp', RegExp, [
	'exec', 'test'
])('Object', Object, [
	'create', 'defineProperty', 'defineProperties', 'keys',
	'getPrototypeOf', 'getOwnPropertyDescriptor', 'getOwnPropertyNames',
	'preventExtensions', 'isExtensible', 'seal', 'isSealed', 'freeze', 'isFrozen'
])('Date', Date, ['now']);

Object.extend = extend.overloadSetter();

Date.extend('now', function(){
	return +(new Date);
});

new Type('Boolean', Boolean);

// fixes NaN returning as Number

Number.prototype.$family = function(){
	return isFinite(this) ? 'number' : 'null';
}.hide();

// Number.random

Number.extend('random', function(min, max){
	return Math.floor(Math.random() * (max - min + 1) + min);
});

// forEach, each

var hasOwnProperty = Object.prototype.hasOwnProperty;
Object.extend('forEach', function(object, fn, bind){
	for (var key in object){
		if (hasOwnProperty.call(object, key)) fn.call(bind, object[key], key, object);
	}
});

Object.each = Object.forEach;

Array.implement({

	forEach: function(fn, bind){
		for (var i = 0, l = this.length; i < l; i++){
			if (i in this) fn.call(bind, this[i], i, this);
		}
	},

	each: function(fn, bind){
		Array.forEach(this, fn, bind);
		return this;
	}

});

// Array & Object cloning, Object merging and appending

var cloneOf = function(item){
	switch (typeOf(item)){
		case 'array': return item.clone();
		case 'object': return Object.clone(item);
		default: return item;
	}
};

Array.implement('clone', function(){
	var i = this.length, clone = new Array(i);
	while (i--) clone[i] = cloneOf(this[i]);
	return clone;
});

var mergeOne = function(source, key, current){
	switch (typeOf(current)){
		case 'object':
			if (typeOf(source[key]) == 'object') Object.merge(source[key], current);
			else source[key] = Object.clone(current);
		break;
		case 'array': source[key] = current.clone(); break;
		default: source[key] = current;
	}
	return source;
};

Object.extend({

	merge: function(source, k, v){
		if (typeOf(k) == 'string') return mergeOne(source, k, v);
		for (var i = 1, l = arguments.length; i < l; i++){
			var object = arguments[i];
			for (var key in object) mergeOne(source, key, object[key]);
		}
		return source;
	},

	clone: function(object){
		var clone = {};
		for (var key in object) clone[key] = cloneOf(object[key]);
		return clone;
	},

	append: function(original){
		for (var i = 1, l = arguments.length; i < l; i++){
			var extended = arguments[i] || {};
			for (var key in extended) original[key] = extended[key];
		}
		return original;
	}

});

// Object-less types

['Object', 'WhiteSpace', 'TextNode', 'Collection', 'Arguments'].each(function(name){
	new Type(name);
});

// Unique ID

var UID = Date.now();

String.extend('uniqueID', function(){
	return (UID++).toString(36);
});


})();


/*
---

name: Array

description: Contains Array Prototypes like each, contains, and erase.

license: MIT-style license.

requires: Type

provides: Array

...
*/

Array.implement({

	/*<!ES5>*/
	every: function(fn, bind){
		for (var i = 0, l = this.length >>> 0; i < l; i++){
			if ((i in this) && !fn.call(bind, this[i], i, this)) return false;
		}
		return true;
	},

	filter: function(fn, bind){
		var results = [];
		for (var value, i = 0, l = this.length >>> 0; i < l; i++) if (i in this){
			value = this[i];
			if (fn.call(bind, value, i, this)) results.push(value);
		}
		return results;
	},

	indexOf: function(item, from){
		var length = this.length >>> 0;
		for (var i = (from < 0) ? Math.max(0, length + from) : from || 0; i < length; i++){
			if (this[i] === item) return i;
		}
		return -1;
	},

	map: function(fn, bind){
		var length = this.length >>> 0, results = Array(length);
		for (var i = 0; i < length; i++){
			if (i in this) results[i] = fn.call(bind, this[i], i, this);
		}
		return results;
	},

	some: function(fn, bind){
		for (var i = 0, l = this.length >>> 0; i < l; i++){
			if ((i in this) && fn.call(bind, this[i], i, this)) return true;
		}
		return false;
	},
	/*</!ES5>*/

	clean: function(){
		return this.filter(function(item){
			return item != null;
		});
	},

	invoke: function(methodName){
		var args = Array.slice(arguments, 1);
		return this.map(function(item){
			return item[methodName].apply(item, args);
		});
	},

	associate: function(keys){
		var obj = {}, length = Math.min(this.length, keys.length);
		for (var i = 0; i < length; i++) obj[keys[i]] = this[i];
		return obj;
	},

	link: function(object){
		var result = {};
		for (var i = 0, l = this.length; i < l; i++){
			for (var key in object){
				if (object[key](this[i])){
					result[key] = this[i];
					delete object[key];
					break;
				}
			}
		}
		return result;
	},

	contains: function(item, from){
		return this.indexOf(item, from) != -1;
	},

	append: function(array){
		this.push.apply(this, array);
		return this;
	},

	getLast: function(){
		return (this.length) ? this[this.length - 1] : null;
	},

	getRandom: function(){
		return (this.length) ? this[Number.random(0, this.length - 1)] : null;
	},

	include: function(item){
		if (!this.contains(item)) this.push(item);
		return this;
	},

	combine: function(array){
		for (var i = 0, l = array.length; i < l; i++) this.include(array[i]);
		return this;
	},

	erase: function(item){
		for (var i = this.length; i--;){
			if (this[i] === item) this.splice(i, 1);
		}
		return this;
	},

	empty: function(){
		this.length = 0;
		return this;
	},

	flatten: function(){
		var array = [];
		for (var i = 0, l = this.length; i < l; i++){
			var type = typeOf(this[i]);
			if (type == 'null') continue;
			array = array.concat((type == 'array' || type == 'collection' || type == 'arguments' || instanceOf(this[i], Array)) ? Array.flatten(this[i]) : this[i]);
		}
		return array;
	},

	pick: function(){
		for (var i = 0, l = this.length; i < l; i++){
			if (this[i] != null) return this[i];
		}
		return null;
	},

	hexToRgb: function(array){
		if (this.length != 3) return null;
		var rgb = this.map(function(value){
			if (value.length == 1) value += value;
			return value.toInt(16);
		});
		return (array) ? rgb : 'rgb(' + rgb + ')';
	},

	rgbToHex: function(array){
		if (this.length < 3) return null;
		if (this.length == 4 && this[3] == 0 && !array) return 'transparent';
		var hex = [];
		for (var i = 0; i < 3; i++){
			var bit = (this[i] - 0).toString(16);
			hex.push((bit.length == 1) ? '0' + bit : bit);
		}
		return (array) ? hex : '#' + hex.join('');
	}

});


/*
---

name: String

description: Contains String Prototypes like camelCase, capitalize, test, and toInt.

license: MIT-style license.

requires: Type

provides: String

...
*/

String.implement({

	test: function(regex, params){
		return ((typeOf(regex) == 'regexp') ? regex : new RegExp('' + regex, params)).test(this);
	},

	//es6 contains breas code
	contains: function(string, separator){
		return (separator) ? (separator + this + separator).indexOf(separator + string + separator) > -1 : String(this).indexOf(string) > -1;
	},

	trim: function(){
		return String(this).replace(/^\s+|\s+$/g, '');
	},

	clean: function(){
		return String(this).replace(/\s+/g, ' ').trim();
	},

	camelCase: function(){
		return String(this).replace(/-\D/g, function(match){
			return match.charAt(1).toUpperCase();
		});
	},

	hyphenate: function(){
		return String(this).replace(/[A-Z]/g, function(match){
			return ('-' + match.charAt(0).toLowerCase());
		});
	},

	capitalize: function(){
		return String(this).replace(/\b[a-z]/g, function(match){
			return match.toUpperCase();
		});
	},

	escapeRegExp: function(){
		return String(this).replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1');
	},

	toInt: function(base){
		return parseInt(this, base || 10);
	},

	toFloat: function(){
		return parseFloat(this);
	},

	hexToRgb: function(array){
		var hex = String(this).match(/^#?(\w{1,2})(\w{1,2})(\w{1,2})$/);
		return (hex) ? hex.slice(1).hexToRgb(array) : null;
	},

	rgbToHex: function(array){
		var rgb = String(this).match(/\d{1,3}/g);
		return (rgb) ? rgb.rgbToHex(array) : null;
	},

	substitute: function(object, regexp){
		return String(this).replace(regexp || (/\\?\{([^{}]+)\}/g), function(match, name){
			if (match.charAt(0) == '\\') return match.slice(1);
			return (object[name] != null) ? object[name] : '';
		});
	}

});


/*
---

name: Number

description: Contains Number Prototypes like limit, round, times, and ceil.

license: MIT-style license.

requires: Type

provides: Number

...
*/

Number.implement({

	limit: function(min, max){
		return Math.min(max, Math.max(min, this));
	},

	round: function(precision){
		precision = Math.pow(10, precision || 0).toFixed(precision < 0 ? -precision : 0);
		return Math.round(this * precision) / precision;
	},

	times: function(fn, bind){
		for (var i = 0; i < this; i++) fn.call(bind, i, this);
	},

	toFloat: function(){
		return parseFloat(this);
	},

	toInt: function(base){
		return parseInt(this, base || 10);
	}

});

Number.alias('each', 'times');

(function(math){
	var methods = {};
	math.each(function(name){
		if (!Number[name]) methods[name] = function(){
			return Math[name].apply(null, [this].concat(Array.from(arguments)));
		};
	});
	Number.implement(methods);
})(['abs', 'acos', 'asin', 'atan', 'atan2', 'ceil', 'cos', 'exp', 'floor', 'log', 'max', 'min', 'pow', 'sin', 'sqrt', 'tan']);


/*
---

name: Function

description: Contains Function Prototypes like create, bind, pass, and delay.

license: MIT-style license.

requires: Type

provides: Function

...
*/

Function.extend({

	attempt: function(){
		for (var i = 0, l = arguments.length; i < l; i++){
			try {
				return arguments[i]();
			} catch (e){}
		}
		return null;
	}

});

Function.implement({

	attempt: function(args, bind){
		try {
			return this.apply(bind, Array.from(args));
		} catch (e){}

		return null;
	},

	/*<!ES5-bind>*/
	bind: function(that){
		var self = this,
			args = arguments.length > 1 ? Array.slice(arguments, 1) : null,
			F = function(){};

		var bound = function(){
			var context = that, length = arguments.length;
			if (this instanceof bound){
				F.prototype = self.prototype;
				context = new F;
			}
			var result = (!args && !length)
				? self.call(context)
				: self.apply(context, args && length ? args.concat(Array.slice(arguments)) : args || arguments);
			return context == that ? result : context;
		};
		return bound;
	},
	/*</!ES5-bind>*/

	pass: function(args, bind){
		var self = this;
		if (args != null) args = Array.from(args);
		return function(){
			return self.apply(bind, args || arguments);
		};
	},

	delay: function(delay, bind, args){
		return setTimeout(this.pass((args == null ? [] : args), bind), delay);
	},

	periodical: function(periodical, bind, args){
		return setInterval(this.pass((args == null ? [] : args), bind), periodical);
	},

});


/*
---

name: Object

description: Object generic methods

license: MIT-style license.

requires: Type

provides: [Object, Hash]

...
*/

(function(){

var hasOwnProperty = Object.prototype.hasOwnProperty;

Object.extend({

	subset: function(object, keys){
		var results = {};
		for (var i = 0, l = keys.length; i < l; i++){
			var k = keys[i];
			if (k in object) results[k] = object[k];
		}
		return results;
	},

	map: function(object, fn, bind){
		var results = {};
		for (var key in object){
			if (hasOwnProperty.call(object, key)) results[key] = fn.call(bind, object[key], key, object);
		}
		return results;
	},

	filter: function(object, fn, bind){
		var results = {};
		for (var key in object){
			var value = object[key];
			if (hasOwnProperty.call(object, key) && fn.call(bind, value, key, object)) results[key] = value;
		}
		return results;
	},

	every: function(object, fn, bind){
		for (var key in object){
			if (hasOwnProperty.call(object, key) && !fn.call(bind, object[key], key)) return false;
		}
		return true;
	},

	some: function(object, fn, bind){
		for (var key in object){
			if (hasOwnProperty.call(object, key) && fn.call(bind, object[key], key)) return true;
		}
		return false;
	},

	keys: function(object){
		var keys = [];
		for (var key in object){
			if (hasOwnProperty.call(object, key)) keys.push(key);
		}
		return keys;
	},

	values: function(object){
		var values = [];
		for (var key in object){
			if (hasOwnProperty.call(object, key)) values.push(object[key]);
		}
		return values;
	},

	getLength: function(object){
		return Object.keys(object).length;
	},

	keyOf: function(object, value){
		for (var key in object){
			if (hasOwnProperty.call(object, key) && object[key] === value) return key;
		}
		return null;
	},

	contains: function(object, value){
		return Object.keyOf(object, value) != null;
	},

	toQueryString: function(object, base){
		var queryString = [];

		Object.each(object, function(value, key){
			if (base) key = base + '[' + key + ']';
			var result;
			switch (typeOf(value)){
				case 'object': result = Object.toQueryString(value, key); break;
				case 'array':
					var qs = {};
					value.each(function(val, i){
						qs[i] = val;
					});
					result = Object.toQueryString(qs, key);
				break;
				default: result = key + '=' + encodeURIComponent(value);
			}
			if (value != null) queryString.push(result);
		});

		return queryString.join('&');
	}

});

})();

/*
---

name: Browser

description: The Browser Object. Contains Browser initialization, Window and Document, and the Browser Hash.

license: MIT-style license.

requires: [Array, Function, Number, String]

provides: [Browser, Window, Document]

...
*/

(function(){

var document = this.document;
var window = document.window = this;

var ua = navigator.userAgent.toLowerCase(),
	platform = navigator.platform.toLowerCase(),
	UA = ua.match(/(opera|ie|firefox|chrome|version)[\s\/:]([\w\d\.]+)?.*?(safari|version[\s\/:]([\w\d\.]+)|$)/) || [null, 'unknown', 0],
	mode = UA[1] == 'ie' && document.documentMode;

var Browser = this.Browser = {

	extend: Function.prototype.extend,

	name: (UA[1] == 'version') ? UA[3] : UA[1],

	version: mode || parseFloat((UA[1] == 'opera' && UA[4]) ? UA[4] : UA[2]),

	Platform: {
		name: ua.match(/ip(?:ad|od|hone)/) ? 'ios' : (ua.match(/(?:webos|android)/) || platform.match(/mac|win|linux/) || ['other'])[0]
	},

	Features: {
		xpath: !!(document.evaluate),
		air: !!(window.runtime),
		query: !!(document.querySelector),
		json: !!(window.JSON)
	},

	Plugins: {}

};

Browser[Browser.name] = true;
Browser[Browser.name + parseInt(Browser.version, 10)] = true;
Browser.Platform[Browser.Platform.name] = true;

// Request

Browser.Request = (function(){

	var XMLHTTP = function(){
		return new XMLHttpRequest();
	};

	var MSXML2 = function(){
		return new ActiveXObject('MSXML2.XMLHTTP');
	};

	var MSXML = function(){
		return new ActiveXObject('Microsoft.XMLHTTP');
	};

	return Function.attempt(function(){
		XMLHTTP();
		return XMLHTTP;
	}, function(){
		MSXML2();
		return MSXML2;
	}, function(){
		MSXML();
		return MSXML;
	});

})();

Browser.Features.xhr = !!(Browser.Request);

// Flash detection

var version = (Function.attempt(function(){
	return navigator.plugins['Shockwave Flash'].description;
}, function(){
	return new ActiveXObject('ShockwaveFlash.ShockwaveFlash').GetVariable('$version');
}) || '0 r0').match(/\d+/g);

Browser.Plugins.Flash = {
	version: Number(version[0] || '0.' + version[1]) || 0,
	build: Number(version[2]) || 0
};

// String scripts

Browser.exec = function(text){
	if (!text) return text;
	if (window.execScript){
		window.execScript(text);
	} else {
		var script = document.createElement('script');
		script.setAttribute('type', 'text/javascript');
		script.text = text;
		document.head.appendChild(script);
		document.head.removeChild(script);
	}
	return text;
};

String.implement('stripScripts', function(exec){
	var scripts = '';
	var text = this.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, function(all, code){
		scripts += code + '\n';
		return '';
	});
	if (exec === true) Browser.exec(scripts);
	else if (typeOf(exec) == 'function') exec(scripts, text);
	return text;
});

// Window, Document

Browser.extend({
	Document: this.Document,
	Window: this.Window,
	Element: this.Element,
	Event: this.Event
});

this.Window = this.$constructor = new Type('Window', function(){});

this.$family = Function.from('window').hide();

Window.mirror(function(name, method){
	window[name] = method;
});

this.Document = document.$constructor = new Type('Document', function(){});

document.$family = Function.from('document').hide();

Document.mirror(function(name, method){
	document[name] = method;
});

document.html = document.documentElement;
if (!document.head) document.head = document.getElementsByTagName('head')[0];

if (document.execCommand) try {
	document.execCommand("BackgroundImageCache", false, true);
} catch (e){}

/*<ltIE9>*/
if (this.attachEvent && !this.addEventListener){
	var unloadEvent = function(){
		this.detachEvent('onunload', unloadEvent);
		document.head = document.html = document.window = null;
	};
	this.attachEvent('onunload', unloadEvent);
}

// IE fails on collections and <select>.options (refers to <select>)
var arrayFrom = Array.from;
try {
	arrayFrom(document.html.childNodes);
} catch(e){
	Array.from = function(item){
		if (typeof item != 'string' && Type.isEnumerable(item) && typeOf(item) != 'array'){
			var i = item.length, array = new Array(i);
			while (i--) array[i] = item[i];
			return array;
		}
		return arrayFrom(item);
	};

	var prototype = Array.prototype,
		slice = prototype.slice;
	['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift', 'concat', 'join', 'slice'].each(function(name){
		var method = prototype[name];
		Array[name] = function(item){
			return method.apply(Array.from(item), slice.call(arguments, 1));
		};
	});
}
/*</ltIE9>*/

//<1.2compat>

// if (Browser.Platform.ios) Browser.Platform.ipod = true;

Browser.Engine = {};

var setEngine = function(name, version){
	Browser.Engine.name = name;
	Browser.Engine[name + version] = true;
	Browser.Engine.version = version;
};

if (Browser.ie){
	Browser.Engine.trident = true;

	switch (Browser.version){
		case 6: setEngine('trident', 4); break;
		case 7: setEngine('trident', 5); break;
		case 8: setEngine('trident', 6);
	}
}

if (Browser.firefox){
	Browser.Engine.gecko = true;

	if (Browser.version >= 3) setEngine('gecko', 19);
	else setEngine('gecko', 18);
}

if (Browser.safari || Browser.chrome){
	Browser.Engine.webkit = true;

	switch (Browser.version){
		case 2: setEngine('webkit', 419); break;
		case 3: setEngine('webkit', 420); break;
		case 4: setEngine('webkit', 525);
	}
}

if (Browser.opera){
	Browser.Engine.presto = true;

	if (Browser.version >= 9.6) setEngine('presto', 960);
	else if (Browser.version >= 9.5) setEngine('presto', 950);
	else setEngine('presto', 925);
}

if (Browser.name == 'unknown'){
	switch ((ua.match(/(?:webkit|khtml|gecko)/) || [])[0]){
		case 'webkit':
		case 'khtml':
			Browser.Engine.webkit = true;
		break;
		case 'gecko':
			Browser.Engine.gecko = true;
	}
}

// this.$exec = Browser.exec;

//</1.2compat>

})();


/*
---

name: Event

description: Contains the Event Type, to make the event object cross-browser.

license: MIT-style license.

requires: [Window, Document, Array, Function, String, Object]

provides: Event

...
*/

(function() {

var _keys = {};

var DOMEvent = this.DOMEvent = new Type('DOMEvent', function(event, win){
	if (!win) win = window;
	event = event || win.event;
	if (event.$extended) return event;
	this.event = event;
	this.$extended = true;
	this.shift = event.shiftKey;
	this.control = event.ctrlKey;
	this.alt = event.altKey;
	this.meta = event.metaKey;
	var type = this.type = event.type;
	var target = event.target || event.srcElement;
	while (target && target.nodeType == 3) target = target.parentNode;
	this.target = document.id(target);

	if (type.indexOf('key') == 0){
		var code = this.code = (event.which || event.keyCode);
		this.key = _keys[code]/*<1.3compat>*/ /*|| Object.keyOf(Event.Keys, code)*//*</1.3compat>*/;
		if (type == 'keydown'){
			if (code > 111 && code < 124) this.key = 'f' + (code - 111);
			else if (code > 95 && code < 106) this.key = code - 96;
		}
		if (this.key == null) this.key = String.fromCharCode(code).toLowerCase();
	} else if (type == 'click' || type == 'dblclick' || type == 'contextmenu' || type == 'DOMMouseScroll' || type.indexOf('mouse') == 0){
		var doc = win.document;
		doc = (!doc.compatMode || doc.compatMode == 'CSS1Compat') ? doc.html : doc.body;
		this.page = {
			x: (event.pageX != null) ? event.pageX : event.clientX + doc.scrollLeft,
			y: (event.pageY != null) ? event.pageY : event.clientY + doc.scrollTop
		};
		this.client = {
			x: (event.pageX != null) ? event.pageX - win.pageXOffset : event.clientX,
			y: (event.pageY != null) ? event.pageY - win.pageYOffset : event.clientY
		};
		if (type == 'DOMMouseScroll' || type == 'mousewheel')
			this.wheel = (event.wheelDelta) ? event.wheelDelta / 120 : -(event.detail || 0) / 3;

		this.rightClick = (event.which == 3 || event.button == 2);
		if (type == 'mouseover' || type == 'mouseout'){
			var related = event.relatedTarget || event[(type == 'mouseover' ? 'from' : 'to') + 'Element'];
			while (related && related.nodeType == 3) related = related.parentNode;
			this.relatedTarget = document.id(related);
		}
	} else if (type.indexOf('touch') == 0 || type.indexOf('gesture') == 0){
		this.rotation = event.rotation;
		this.scale = event.scale;
		this.targetTouches = event.targetTouches;
		this.changedTouches = event.changedTouches;
		var touches = this.touches = event.touches;
		if (touches && touches[0]){
			var touch = touches[0];
			this.page = {x: touch.pageX, y: touch.pageY};
			this.client = {x: touch.clientX, y: touch.clientY};
		}
	}

	if (!this.client) this.client = {};
	if (!this.page) this.page = {};
});

DOMEvent.implement({

	stop: function(){
		return this.preventDefault().stopPropagation();
	},

	stopPropagation: function(){
		if (this.event.stopPropagation) this.event.stopPropagation();
		else this.event.cancelBubble = true;
		return this;
	},

	preventDefault: function(){
		if (this.event.preventDefault) this.event.preventDefault();
		else this.event.returnValue = false;
		return this;
	}

});

DOMEvent.defineKey = function(code, key){
	_keys[code] = key;
	return this;
};

DOMEvent.defineKeys = DOMEvent.defineKey.overloadSetter(true);

DOMEvent.defineKeys({
	'38': 'up', '40': 'down', '37': 'left', '39': 'right',
	'27': 'esc', '32': 'space', '8': 'backspace', '9': 'tab',
	'46': 'delete', '13': 'enter'
});

})();



/*
---

name: Class

description: Contains the Class Function for easily creating, extending, and implementing reusable Classes.

license: MIT-style license.

requires: [Array, String, Function, Number]

provides: Class

...
*/

(function(){

var Class = this.Class = new Type('Class', function(params){
	if (instanceOf(params, Function)) params = {initialize: params};

	var newClass = function(){
		reset(this);
		if (newClass.$prototyping) return this;
		this.$caller = null;
		var value = (this.initialize) ? this.initialize.apply(this, arguments) : this;
		this.$caller = this.caller = null;
		return value;
	}.extend(this).implement(params);

	newClass.$constructor = Class;
	newClass.prototype.$constructor = newClass;
	newClass.prototype.parent = parent;

	return newClass;
});

var parent = function(){
	if (!this.$caller) throw new Error('The method "parent" cannot be called.');
	var name = this.$caller.$name,
		parent = this.$caller.$owner.parent,
		previous = (parent) ? parent.prototype[name] : null;
	if (!previous) throw new Error('The method "' + name + '" has no parent.');
	return previous.apply(this, arguments);
};

var reset = function(object){
	for (var key in object){
		var value = object[key];
		switch (typeOf(value)){
			case 'object':
				var F = function(){};
				F.prototype = value;
				object[key] = reset(new F);
			break;
			case 'array': object[key] = value.clone(); break;
		}
	}
	return object;
};

var wrap = function(self, key, method){
	if (method.$origin) method = method.$origin;
	var wrapper = function(){
		if (method.$protected && this.$caller == null) throw new Error('The method "' + key + '" cannot be called.');
		var caller = this.caller, current = this.$caller;
		this.caller = current; this.$caller = wrapper;
		var result = method.apply(this, arguments);
		this.$caller = current; this.caller = caller;
		return result;
	}.extend({$owner: self, $origin: method, $name: key});
	return wrapper;
};

var implement = function(key, value, retain){
	if (Class.Mutators.hasOwnProperty(key)){
		value = Class.Mutators[key].call(this, value);
		if (value == null) return this;
	}

	if (typeOf(value) == 'function'){
		if (value.$hidden) return this;
		this.prototype[key] = (retain) ? value : wrap(this, key, value);
	} else {
		Object.merge(this.prototype, key, value);
	}

	return this;
};

var getInstance = function(klass){
	klass.$prototyping = true;
	var proto = new klass;
	delete klass.$prototyping;
	return proto;
};

Class.implement('implement', implement.overloadSetter());

Class.Mutators = {

	Extends: function(parent){
		this.parent = parent;
		this.prototype = getInstance(parent);
	},

	Implements: function(items){
		Array.from(items).each(function(item){
			var instance = new item;
			for (var key in instance) implement.call(this, key, instance[key], true);
		}, this);
	}
};

})();


/*
---

name: Class.Extras

description: Contains Utility Classes that can be implemented into your own Classes to ease the execution of many common tasks.

license: MIT-style license.

requires: Class

provides: [Class.Extras, Chain, Events, Options]

...
*/

(function(){

this.Chain = new Class({

	$chain: [],

	chain: function(){
		this.$chain.append(Array.flatten(arguments));
		return this;
	},

	callChain: function(){
		return (this.$chain.length) ? this.$chain.shift().apply(this, arguments) : false;
	},

	clearChain: function(){
		this.$chain.empty();
		return this;
	}

});

var removeOn = function(string){
	return string.replace(/^on([A-Z])/, function(full, first){
		return first.toLowerCase();
	});
};

this.Events = new Class({

	$events: {},

	addEvent: function(type, fn, internal){
		type = removeOn(type);

		/*<1.2compat>*/
		// if (fn == $empty) return this;
		/*</1.2compat>*/

		this.$events[type] = (this.$events[type] || []).include(fn);
		if (internal) fn.internal = true;
		return this;
	},

	addEvents: function(events){
		for (var type in events) this.addEvent(type, events[type]);
		return this;
	},

	fireEvent: function(type, args, delay){
		type = removeOn(type);
		var events = this.$events[type];
		if (!events) return this;
		args = Array.from(args);
		events.each(function(fn){
			if (delay) fn.delay(delay, this, args);
			else fn.apply(this, args);
		}, this);
		return this;
	},

	removeEvent: function(type, fn){
		type = removeOn(type);
		var events = this.$events[type];
		if (events && !fn.internal){
			var index =  events.indexOf(fn);
			if (index != -1) delete events[index];
		}
		return this;
	},

	removeEvents: function(events){
		var type;
		if (typeOf(events) == 'object'){
			for (type in events) this.removeEvent(type, events[type]);
			return this;
		}
		if (events) events = removeOn(events);
		for (type in this.$events){
			if (events && events != type) continue;
			var fns = this.$events[type];
			for (var i = fns.length; i--;) if (i in fns){
				this.removeEvent(type, fns[i]);
			}
		}
		return this;
	}

});

this.Options = new Class({

	setOptions: function(){
		var options = this.options = Object.merge.apply(null, [{}, this.options].append(arguments));
		if (this.addEvent) for (var option in options){
			if (typeOf(options[option]) != 'function' || !(/^on[A-Z]/).test(option)) continue;
			this.addEvent(option, options[option]);
			delete options[option];
		}
		return this;
	}

});

})();


/*
---
name: Slick.Parser
description: Standalone CSS3 Selector parser
provides: Slick.Parser
...
*/

;(function(){

var parsed,
	separatorIndex,
	combinatorIndex,
	reversed,
	cache = {},
	reverseCache = {},
	reUnescape = /\\/g;

var parse = function(expression, isReversed){
	if (expression == null) return null;
	if (expression.Slick === true) return expression;
	expression = ('' + expression).replace(/^\s+|\s+$/g, '');
	reversed = !!isReversed;
	var currentCache = (reversed) ? reverseCache : cache;
	if (currentCache[expression]) return currentCache[expression];
	parsed = {
		Slick: true,
		expressions: [],
		raw: expression,
		reverse: function(){
			return parse(this.raw, true);
		}
	};
	separatorIndex = -1;
	while (expression != (expression = expression.replace(regexp, parser)));
	parsed.length = parsed.expressions.length;
	return currentCache[parsed.raw] = (reversed) ? reverse(parsed) : parsed;
};

var reverseCombinator = function(combinator){
	if (combinator === '!') return ' ';
	else if (combinator === ' ') return '!';
	else if ((/^!/).test(combinator)) return combinator.replace(/^!/, '');
	else return '!' + combinator;
};

var reverse = function(expression){
	var expressions = expression.expressions;
	for (var i = 0; i < expressions.length; i++){
		var exp = expressions[i];
		var last = {parts: [], tag: '*', combinator: reverseCombinator(exp[0].combinator)};

		for (var j = 0; j < exp.length; j++){
			var cexp = exp[j];
			if (!cexp.reverseCombinator) cexp.reverseCombinator = ' ';
			cexp.combinator = cexp.reverseCombinator;
			delete cexp.reverseCombinator;
		}

		exp.reverse().push(last);
	}
	return expression;
};

var escapeRegExp = function(string){// Credit: XRegExp 0.6.1 (c) 2007-2008 Steven Levithan <http://stevenlevithan.com/regex/xregexp/> MIT License
	return string.replace(/[-[\]{}()*+?.\\^$|,#\s]/g, function(match){
		return '\\' + match;
	});
};

var regexp = new RegExp("^(?:\\s*(,)\\s*|\\s*(<combinator>+)\\s*|(\\s+)|(<unicode>+|\\*)|\\#(<unicode>+)|\\.(<unicode>+)|\\[\\s*(<unicode1>+)(?:\\s*([*^$!~|]?=)(?:\\s*(?:([\"']?)(.*?)\\9)))?\\s*\\](?!\\])|(:+)(<unicode>+)(?:\\((?:(?:([\"'])([^\\13]*)\\13)|((?:\\([^)]+\\)|[^()]*)+))\\))?)"
	.replace(/<combinator>/, '[' + escapeRegExp(">+~`!@$%^&={}\\;</") + ']')
	.replace(/<unicode>/g, '(?:[\\w\\u00a1-\\uFFFF-]|\\\\[^\\s0-9a-f])')
	.replace(/<unicode1>/g, '(?:[:\\w\\u00a1-\\uFFFF-]|\\\\[^\\s0-9a-f])')
);

function parser(
	rawMatch,

	separator,
	combinator,
	combinatorChildren,

	tagName,
	id,
	className,

	attributeKey,
	attributeOperator,
	attributeQuote,
	attributeValue,

	pseudoMarker,
	pseudoClass,
	pseudoQuote,
	pseudoClassQuotedValue,
	pseudoClassValue
){
	if (separator || separatorIndex === -1){
		parsed.expressions[++separatorIndex] = [];
		combinatorIndex = -1;
		if (separator) return '';
	}

	if (combinator || combinatorChildren || combinatorIndex === -1){
		combinator = combinator || ' ';
		var currentSeparator = parsed.expressions[separatorIndex];
		if (reversed && currentSeparator[combinatorIndex])
			currentSeparator[combinatorIndex].reverseCombinator = reverseCombinator(combinator);
		currentSeparator[++combinatorIndex] = {combinator: combinator, tag: '*'};
	}

	var currentParsed = parsed.expressions[separatorIndex][combinatorIndex];

	if (tagName){
		currentParsed.tag = tagName.replace(reUnescape, '');

	} else if (id){
		currentParsed.id = id.replace(reUnescape, '');

	} else if (className){
		className = className.replace(reUnescape, '');

		if (!currentParsed.classList) currentParsed.classList = [];
		if (!currentParsed.classes) currentParsed.classes = [];
		currentParsed.classList.push(className);
		currentParsed.classes.push({
			value: className,
			regexp: new RegExp('(^|\\s)' + escapeRegExp(className) + '(\\s|$)')
		});

	} else if (pseudoClass){
		pseudoClassValue = pseudoClassValue || pseudoClassQuotedValue;
		pseudoClassValue = pseudoClassValue ? pseudoClassValue.replace(reUnescape, '') : null;

		if (!currentParsed.pseudos) currentParsed.pseudos = [];
		currentParsed.pseudos.push({
			key: pseudoClass.replace(reUnescape, ''),
			value: pseudoClassValue,
			type: pseudoMarker.length == 1 ? 'class' : 'element'
		});

	} else if (attributeKey){
		attributeKey = attributeKey.replace(reUnescape, '');
		attributeValue = (attributeValue || '').replace(reUnescape, '');

		var test, regexp;

		switch (attributeOperator){
			case '^=' : regexp = new RegExp(       '^'+ escapeRegExp(attributeValue)            ); break;
			case '$=' : regexp = new RegExp(            escapeRegExp(attributeValue) +'$'       ); break;
			case '~=' : regexp = new RegExp( '(^|\\s)'+ escapeRegExp(attributeValue) +'(\\s|$)' ); break;
			case '|=' : regexp = new RegExp(       '^'+ escapeRegExp(attributeValue) +'(-|$)'   ); break;
			case  '=' : test = function(value){
				return attributeValue == value;
			}; break;
			case '*=' : test = function(value){
				return value && value.indexOf(attributeValue) > -1;
			}; break;
			case '!=' : test = function(value){
				return attributeValue != value;
			}; break;
			default   : test = function(value){
				return !!value;
			};
		}

		if (attributeValue == '' && (/^[*$^]=$/).test(attributeOperator)) test = function(){
			return false;
		};

		if (!test) test = function(value){
			return value && regexp.test(value);
		};

		if (!currentParsed.attributes) currentParsed.attributes = [];
		currentParsed.attributes.push({
			key: attributeKey,
			operator: attributeOperator,
			value: attributeValue,
			test: test
		});

	}

	return '';
};

// Slick NS

var Slick = (this.Slick || {});

Slick.parse = function(expression){
	return parse(expression);
};

Slick.escapeRegExp = escapeRegExp;

if (!this.Slick) this.Slick = Slick;

}).apply(/*<CommonJS>*/(typeof exports != 'undefined') ? exports : /*</CommonJS>*/this);


/*
---
name: Slick.Finder
description: The new, superfast css selector engine.
provides: Slick.Finder
requires: Slick.Parser
...
*/

;(function(){

var local = {},
	featuresCache = {},
	toString = Object.prototype.toString;

// Feature / Bug detection

local.isNativeCode = function(fn){
	return (/\{\s*\[native code\]\s*\}/).test('' + fn);
};

local.isXML = function(document){
	return (!!document.xmlVersion) || (!!document.xml) || (toString.call(document) == '[object XMLDocument]') ||
	(document.nodeType == 9 && document.documentElement.nodeName != 'HTML');
};

local.setDocument = function(document){

	// convert elements / window arguments to document. if document cannot be extrapolated, the function returns.
	var nodeType = document.nodeType;
	if (nodeType == 9); // document
	else if (nodeType) document = document.ownerDocument; // node
	else if (document.navigator) document = document.document; // window
	else return;

	// check if it's the old document

	if (this.document === document) return;
	this.document = document;

	// check if we have done feature detection on this document before

	var root = document.documentElement,
		rootUid = this.getUIDXML(root),
		features = featuresCache[rootUid],
		feature;

	if (features){
		for (feature in features){
			this[feature] = features[feature];
		}
		return;
	}

	features = featuresCache[rootUid] = {};

	features.root = root;
	features.isXMLDocument = this.isXML(document);

	features.brokenStarGEBTN
	= features.starSelectsClosedQSA
	= features.idGetsName
	= features.brokenMixedCaseQSA
	= features.brokenGEBCN
	= features.brokenCheckedQSA
	= features.brokenEmptyAttributeQSA
	= features.isHTMLDocument
	= features.nativeMatchesSelector
	= false;

	var starSelectsClosed, starSelectsComments,
		brokenSecondClassNameGEBCN, cachedGetElementsByClassName,
		brokenFormAttributeGetter;

	var selected, id = 'slick_uniqueid';
	var testNode = document.createElement('div');

	var testRoot = document.body || document.getElementsByTagName('body')[0] || root;
	testRoot.appendChild(testNode);

	// on non-HTML documents innerHTML and getElementsById doesnt work properly
	try {
		testNode.innerHTML = '<a id="'+id+'"></a>';
		features.isHTMLDocument = !!document.getElementById(id);
	} catch(e){};

	if (features.isHTMLDocument){

		testNode.style.display = 'none';

		// IE returns comment nodes for getElementsByTagName('*') for some documents
		testNode.appendChild(document.createComment(''));
		starSelectsComments = (testNode.getElementsByTagName('*').length > 1);

		// IE returns closed nodes (EG:"</foo>") for getElementsByTagName('*') for some documents
		try {
			testNode.innerHTML = 'foo</foo>';
			selected = testNode.getElementsByTagName('*');
			starSelectsClosed = (selected && !!selected.length && selected[0].nodeName.charAt(0) == '/');
		} catch(e){};

		features.brokenStarGEBTN = starSelectsComments || starSelectsClosed;

		// IE returns elements with the name instead of just id for getElementsById for some documents
		try {
			testNode.innerHTML = '<a name="'+ id +'"></a><b id="'+ id +'"></b>';
			features.idGetsName = document.getElementById(id) === testNode.firstChild;
		} catch(e){};

		if (testNode.getElementsByClassName){

			// Safari 3.2 getElementsByClassName caches results
			try {
				testNode.innerHTML = '<a class="f"></a><a class="b"></a>';
				testNode.getElementsByClassName('b').length;
				testNode.firstChild.className = 'b';
				cachedGetElementsByClassName = (testNode.getElementsByClassName('b').length != 2);
			} catch(e){};

			// Opera 9.6 getElementsByClassName doesnt detects the class if its not the first one
			try {
				testNode.innerHTML = '<a class="a"></a><a class="f b a"></a>';
				brokenSecondClassNameGEBCN = (testNode.getElementsByClassName('a').length != 2);
			} catch(e){};

			features.brokenGEBCN = cachedGetElementsByClassName || brokenSecondClassNameGEBCN;
		}

		if (testNode.querySelectorAll){
			// IE 8 returns closed nodes (EG:"</foo>") for querySelectorAll('*') for some documents
			try {
				testNode.innerHTML = 'foo</foo>';
				selected = testNode.querySelectorAll('*');
				features.starSelectsClosedQSA = (selected && !!selected.length && selected[0].nodeName.charAt(0) == '/');
			} catch(e){};

			// Safari 3.2 querySelectorAll doesnt work with mixedcase on quirksmode
			try {
				testNode.innerHTML = '<a class="MiX"></a>';
				features.brokenMixedCaseQSA = !testNode.querySelectorAll('.MiX').length;
			} catch(e){};

			// Webkit and Opera dont return selected options on querySelectorAll
			try {
				testNode.innerHTML = '<select><option selected="selected">a</option></select>';
				features.brokenCheckedQSA = (testNode.querySelectorAll(':checked').length == 0);
			} catch(e){};

			// IE returns incorrect results for attr[*^$]="" selectors on querySelectorAll
			try {
				testNode.innerHTML = '<a class=""></a>';
				features.brokenEmptyAttributeQSA = (testNode.querySelectorAll('[class*=""]').length != 0);
			} catch(e){};

		}

		// IE6-7, if a form has an input of id x, form.getAttribute(x) returns a reference to the input
		try {
			testNode.innerHTML = '<form action="s"><input id="action"/></form>';
			brokenFormAttributeGetter = (testNode.firstChild.getAttribute('action') != 's');
		} catch(e){};

		// native matchesSelector function

		features.nativeMatchesSelector = root.matchesSelector || /*root.msMatchesSelector ||*/ root.mozMatchesSelector || root.webkitMatchesSelector;
		if (features.nativeMatchesSelector) try {
			// if matchesSelector trows errors on incorrect sintaxes we can use it
			features.nativeMatchesSelector.call(root, ':slick');
			features.nativeMatchesSelector = null;
		} catch(e){};

	}

	try {
		root.slick_expando = 1;
		delete root.slick_expando;
		features.getUID = this.getUIDHTML;
	} catch(e) {
		features.getUID = this.getUIDXML;
	}

	testRoot.removeChild(testNode);
	testNode = selected = testRoot = null;

	// getAttribute

	features.getAttribute = (features.isHTMLDocument && brokenFormAttributeGetter) ? function(node, name){
		var method = this.attributeGetters[name];
		if (method) return method.call(node);
		var attributeNode = node.getAttributeNode(name);
		return (attributeNode) ? attributeNode.nodeValue : null;
	} : function(node, name){
		var method = this.attributeGetters[name];
		return (method) ? method.call(node) : node.getAttribute(name);
	};

	// hasAttribute

	features.hasAttribute = (root && this.isNativeCode(root.hasAttribute)) ? function(node, attribute) {
		return node.hasAttribute(attribute);
	} : function(node, attribute) {
		node = node.getAttributeNode(attribute);
		return !!(node && (node.specified || node.nodeValue));
	};

	// contains
	// FIXME: Add specs: local.contains should be different for xml and html documents?
	var nativeRootContains = root && this.isNativeCode(root.contains),
		nativeDocumentContains = document && this.isNativeCode(document.contains);

	features.contains = (nativeRootContains && nativeDocumentContains) ? function(context, node){
		return context.contains(node);
	} : (nativeRootContains && !nativeDocumentContains) ? function(context, node){
		// IE8 does not have .contains on document.
		return context === node || ((context === document) ? document.documentElement : context).contains(node);
	} : (root && root.compareDocumentPosition) ? function(context, node){
		return context === node || !!(context.compareDocumentPosition(node) & 16);
	} : function(context, node){
		if (node) do {
			if (node === context) return true;
		} while ((node = node.parentNode));
		return false;
	};

	// document order sorting
	// credits to Sizzle (http://sizzlejs.com/)

	features.documentSorter = (root.compareDocumentPosition) ? function(a, b){
		if (!a.compareDocumentPosition || !b.compareDocumentPosition) return 0;
		return a.compareDocumentPosition(b) & 4 ? -1 : a === b ? 0 : 1;
	} : ('sourceIndex' in root) ? function(a, b){
		if (!a.sourceIndex || !b.sourceIndex) return 0;
		return a.sourceIndex - b.sourceIndex;
	} : (document.createRange) ? function(a, b){
		if (!a.ownerDocument || !b.ownerDocument) return 0;
		var aRange = a.ownerDocument.createRange(), bRange = b.ownerDocument.createRange();
		aRange.setStart(a, 0);
		aRange.setEnd(a, 0);
		bRange.setStart(b, 0);
		bRange.setEnd(b, 0);
		return aRange.compareBoundaryPoints(Range.START_TO_END, bRange);
	} : null ;

	root = null;

	for (feature in features){
		this[feature] = features[feature];
	}
};

// Main Method

var reSimpleSelector = /^([#.]?)((?:[\w-]+|\*))$/,
	reEmptyAttribute = /\[.+[*$^]=(?:""|'')?\]/,
	qsaFailExpCache = {};

local.search = function(context, expression, append, first){

	var found = this.found = (first) ? null : (append || []);

	if (!context) return found;
	else if (context.navigator) context = context.document; // Convert the node from a window to a document
	else if (!context.nodeType) return found;

	// setup

	var parsed, i,
		uniques = this.uniques = {},
		hasOthers = !!(append && append.length),
		contextIsDocument = (context.nodeType == 9);

	if (this.document !== (contextIsDocument ? context : context.ownerDocument)) this.setDocument(context);

	// avoid duplicating items already in the append array
	if (hasOthers) for (i = found.length; i--;) uniques[this.getUID(found[i])] = true;

	// expression checks

	if (typeof expression == 'string'){ // expression is a string

		/*<simple-selectors-override>*/
		var simpleSelector = expression.match(reSimpleSelector);
		simpleSelectors: if (simpleSelector) {

			var symbol = simpleSelector[1],
				name = simpleSelector[2],
				node, nodes;

			if (!symbol){

				if (name == '*' && this.brokenStarGEBTN) break simpleSelectors;
				nodes = context.getElementsByTagName(name);
				if (first) return nodes[0] || null;
				for (i = 0; node = nodes[i++];){
					if (!(hasOthers && uniques[this.getUID(node)])) found.push(node);
				}

			} else if (symbol == '#'){

				if (!this.isHTMLDocument || !contextIsDocument) break simpleSelectors;
				node = context.getElementById(name);
				if (!node) return found;
				if (this.idGetsName && node.getAttributeNode('id').nodeValue != name) break simpleSelectors;
				if (first) return node || null;
				if (!(hasOthers && uniques[this.getUID(node)])) found.push(node);

			} else if (symbol == '.'){

				if (!this.isHTMLDocument || ((!context.getElementsByClassName || this.brokenGEBCN) && context.querySelectorAll)) break simpleSelectors;
				if (context.getElementsByClassName && !this.brokenGEBCN){
					nodes = context.getElementsByClassName(name);
					if (first) return nodes[0] || null;
					for (i = 0; node = nodes[i++];){
						if (!(hasOthers && uniques[this.getUID(node)])) found.push(node);
					}
				} else {
					var matchClass = new RegExp('(^|\\s)'+ Slick.escapeRegExp(name) +'(\\s|$)');
					nodes = context.getElementsByTagName('*');
					for (i = 0; node = nodes[i++];){
						className = node.className;
						if (!(className && matchClass.test(className))) continue;
						if (first) return node;
						if (!(hasOthers && uniques[this.getUID(node)])) found.push(node);
					}
				}

			}

			if (hasOthers) this.sort(found);
			return (first) ? null : found;

		}
		/*</simple-selectors-override>*/

		/*<query-selector-override>*/
		querySelector: if (context.querySelectorAll) {

			if (!this.isHTMLDocument
				|| qsaFailExpCache[expression]
				//TODO: only skip when expression is actually mixed case
				|| this.brokenMixedCaseQSA
				|| (this.brokenCheckedQSA && expression.indexOf(':checked') > -1)
				|| (this.brokenEmptyAttributeQSA && reEmptyAttribute.test(expression))
				|| (!contextIsDocument //Abort when !contextIsDocument and...
					//  there are multiple expressions in the selector
					//  since we currently only fix non-document rooted QSA for single expression selectors
					&& expression.indexOf(',') > -1
				)
				|| Slick.disableQSA
			) break querySelector;

			var _expression = expression, _context = context;
			if (!contextIsDocument){
				// non-document rooted QSA
				// credits to Andrew Dupont
				var currentId = _context.getAttribute('id'), slickid = 'slickid__';
				_context.setAttribute('id', slickid);
				_expression = '#' + slickid + ' ' + _expression;
				context = _context.parentNode;
			}

			try {
				if (first) return context.querySelector(_expression) || null;
				else nodes = context.querySelectorAll(_expression);
			} catch(e) {
				qsaFailExpCache[expression] = 1;
				break querySelector;
			} finally {
				if (!contextIsDocument){
					if (currentId) _context.setAttribute('id', currentId);
					else _context.removeAttribute('id');
					context = _context;
				}
			}

			if (this.starSelectsClosedQSA) for (i = 0; node = nodes[i++];){
				if (node.nodeName > '@' && !(hasOthers && uniques[this.getUID(node)])) found.push(node);
			} else for (i = 0; node = nodes[i++];){
				if (!(hasOthers && uniques[this.getUID(node)])) found.push(node);
			}

			if (hasOthers) this.sort(found);
			return found;

		}
		/*</query-selector-override>*/

		parsed = this.Slick.parse(expression);
		if (!parsed.length) return found;
	} else if (expression == null){ // there is no expression
		return found;
	} else if (expression.Slick){ // expression is a parsed Slick object
		parsed = expression;
	} else if (this.contains(context.documentElement || context, expression)){ // expression is a node
		(found) ? found.push(expression) : found = expression;
		return found;
	} else { // other junk
		return found;
	}

	/*<pseudo-selectors>*//*<nth-pseudo-selectors>*/

	// cache elements for the nth selectors

	this.posNTH = {};
	this.posNTHLast = {};
	this.posNTHType = {};
	this.posNTHTypeLast = {};

	/*</nth-pseudo-selectors>*//*</pseudo-selectors>*/

	// if append is null and there is only a single selector with one expression use pushArray, else use pushUID
	this.push = (!hasOthers && (first || (parsed.length == 1 && parsed.expressions[0].length == 1))) ? this.pushArray : this.pushUID;

	if (found == null) found = [];

	// default engine

	var j, m, n;
	var combinator, tag, id, classList, classes, attributes, pseudos;
	var currentItems, currentExpression, currentBit, lastBit, expressions = parsed.expressions;

	search: for (i = 0; (currentExpression = expressions[i]); i++) for (j = 0; (currentBit = currentExpression[j]); j++){

		combinator = 'combinator:' + currentBit.combinator;
		if (!this[combinator]) continue search;

		tag        = (this.isXMLDocument) ? currentBit.tag : currentBit.tag.toUpperCase();
		id         = currentBit.id;
		classList  = currentBit.classList;
		classes    = currentBit.classes;
		attributes = currentBit.attributes;
		pseudos    = currentBit.pseudos;
		lastBit    = (j === (currentExpression.length - 1));

		this.bitUniques = {};

		if (lastBit){
			this.uniques = uniques;
			this.found = found;
		} else {
			this.uniques = {};
			this.found = [];
		}

		if (j === 0){
			this[combinator](context, tag, id, classes, attributes, pseudos, classList);
			if (first && lastBit && found.length) break search;
		} else {
			if (first && lastBit) for (m = 0, n = currentItems.length; m < n; m++){
				this[combinator](currentItems[m], tag, id, classes, attributes, pseudos, classList);
				if (found.length) break search;
			} else for (m = 0, n = currentItems.length; m < n; m++) this[combinator](currentItems[m], tag, id, classes, attributes, pseudos, classList);
		}

		currentItems = this.found;
	}

	// should sort if there are nodes in append and if you pass multiple expressions.
	if (hasOthers || (parsed.expressions.length > 1)) this.sort(found);

	return (first) ? (found[0] || null) : found;
};

// Utils

local.uidx = 1;
local.uidk = 'slick-uniqueid';

local.getUIDXML = function(node){
	var uid = node.getAttribute(this.uidk);
	if (!uid){
		uid = this.uidx++;
		node.setAttribute(this.uidk, uid);
	}
	return uid;
};

local.getUIDHTML = function(node){
	return node.uniqueNumber || (node.uniqueNumber = this.uidx++);
};

// sort based on the setDocument documentSorter method.

local.sort = function(results){
	if (!this.documentSorter) return results;
	results.sort(this.documentSorter);
	return results;
};

/*<pseudo-selectors>*//*<nth-pseudo-selectors>*/

local.cacheNTH = {};

local.matchNTH = /^([+-]?\d*)?([a-z]+)?([+-]\d+)?$/;

local.parseNTHArgument = function(argument){
	var parsed = argument.match(this.matchNTH);
	if (!parsed) return false;
	var special = parsed[2] || false;
	var a = parsed[1] || 1;
	if (a == '-') a = -1;
	var b = +parsed[3] || 0;
	parsed =
		(special == 'n')	? {a: a, b: b} :
		(special == 'odd')	? {a: 2, b: 1} :
		(special == 'even')	? {a: 2, b: 0} : {a: 0, b: a};

	return (this.cacheNTH[argument] = parsed);
};

local.createNTHPseudo = function(child, sibling, positions, ofType){
	return function(node, argument){
		var uid = this.getUID(node);
		if (!this[positions][uid]){
			var parent = node.parentNode;
			if (!parent) return false;
			var el = parent[child], count = 1;
			if (ofType){
				var nodeName = node.nodeName;
				do {
					if (el.nodeName != nodeName) continue;
					this[positions][this.getUID(el)] = count++;
				} while ((el = el[sibling]));
			} else {
				do {
					if (el.nodeType != 1) continue;
					this[positions][this.getUID(el)] = count++;
				} while ((el = el[sibling]));
			}
		}
		argument = argument || 'n';
		var parsed = this.cacheNTH[argument] || this.parseNTHArgument(argument);
		if (!parsed) return false;
		var a = parsed.a, b = parsed.b, pos = this[positions][uid];
		if (a == 0) return b == pos;
		if (a > 0){
			if (pos < b) return false;
		} else {
			if (b < pos) return false;
		}
		return ((pos - b) % a) == 0;
	};
};

/*</nth-pseudo-selectors>*//*</pseudo-selectors>*/

local.pushArray = function(node, tag, id, classes, attributes, pseudos){
	if (this.matchSelector(node, tag, id, classes, attributes, pseudos)) this.found.push(node);
};

local.pushUID = function(node, tag, id, classes, attributes, pseudos){
	var uid = this.getUID(node);
	if (!this.uniques[uid] && this.matchSelector(node, tag, id, classes, attributes, pseudos)){
		this.uniques[uid] = true;
		this.found.push(node);
	}
};

local.matchNode = function(node, selector){
	if (this.isHTMLDocument && this.nativeMatchesSelector){
		try {
			return this.nativeMatchesSelector.call(node, selector.replace(/\[([^=]+)=\s*([^'"\]]+?)\s*\]/g, '[$1="$2"]'));
		} catch(matchError) {}
	}

	var parsed = this.Slick.parse(selector);
	if (!parsed) return true;

	// simple (single) selectors
	var expressions = parsed.expressions, simpleExpCounter = 0, i;
	for (i = 0; (currentExpression = expressions[i]); i++){
		if (currentExpression.length == 1){
			var exp = currentExpression[0];
			if (this.matchSelector(node, (this.isXMLDocument) ? exp.tag : exp.tag.toUpperCase(), exp.id, exp.classes, exp.attributes, exp.pseudos)) return true;
			simpleExpCounter++;
		}
	}

	if (simpleExpCounter == parsed.length) return false;

	var nodes = this.search(this.document, parsed), item;
	for (i = 0; item = nodes[i++];){
		if (item === node) return true;
	}
	return false;
};

local.matchPseudo = function(node, name, argument){
	var pseudoName = 'pseudo:' + name;
	if (this[pseudoName]) return this[pseudoName](node, argument);
	var attribute = this.getAttribute(node, name);
	return (argument) ? argument == attribute : !!attribute;
};

local.matchSelector = function(node, tag, id, classes, attributes, pseudos){
	if (tag){
		var nodeName = (this.isXMLDocument) ? node.nodeName : node.nodeName.toUpperCase();
		if (tag == '*'){
			if (nodeName < '@') return false; // Fix for comment nodes and closed nodes
		} else {
			if (nodeName != tag) return false;
		}
	}

	if (id && node.getAttribute('id') != id) return false;

	var i, part, cls;
	if (classes) for (i = classes.length; i--;){
		cls = this.getAttribute(node, 'class');
		if (!(cls && classes[i].regexp.test(cls))) return false;
	}
	if (attributes) for (i = attributes.length; i--;){
		part = attributes[i];
		if (part.operator ? !part.test(this.getAttribute(node, part.key)) : !this.hasAttribute(node, part.key)) return false;
	}
	if (pseudos) for (i = pseudos.length; i--;){
		part = pseudos[i];
		if (!this.matchPseudo(node, part.key, part.value)) return false;
	}
	return true;
};

var combinators = {

	' ': function(node, tag, id, classes, attributes, pseudos, classList){ // all child nodes, any level

		var i, item, children;

		if (this.isHTMLDocument){
			getById: if (id){
				item = this.document.getElementById(id);
				if ((!item && node.all) || (this.idGetsName && item && item.getAttributeNode('id').nodeValue != id)){
					// all[id] returns all the elements with that name or id inside node
					// if theres just one it will return the element, else it will be a collection
					children = node.all[id];
					if (!children) return;
					if (!children[0]) children = [children];
					for (i = 0; item = children[i++];){
						var idNode = item.getAttributeNode('id');
						if (idNode && idNode.nodeValue == id){
							this.push(item, tag, null, classes, attributes, pseudos);
							break;
						}
					}
					return;
				}
				if (!item){
					// if the context is in the dom we return, else we will try GEBTN, breaking the getById label
					if (this.contains(this.root, node)) return;
					else break getById;
				} else if (this.document !== node && !this.contains(node, item)) return;
				this.push(item, tag, null, classes, attributes, pseudos);
				return;
			}
			getByClass: if (classes && node.getElementsByClassName && !this.brokenGEBCN){
				children = node.getElementsByClassName(classList.join(' '));
				if (!(children && children.length)) break getByClass;
				for (i = 0; item = children[i++];) this.push(item, tag, id, null, attributes, pseudos);
				return;
			}
		}
		getByTag: {
			children = node.getElementsByTagName(tag);
			if (!(children && children.length)) break getByTag;
			if (!this.brokenStarGEBTN) tag = null;
			for (i = 0; item = children[i++];) this.push(item, tag, id, classes, attributes, pseudos);
		}
	},

	'>': function(node, tag, id, classes, attributes, pseudos){ // direct children
		if ((node = node.firstChild)) do {
			if (node.nodeType == 1) this.push(node, tag, id, classes, attributes, pseudos);
		} while ((node = node.nextSibling));
	},

	'+': function(node, tag, id, classes, attributes, pseudos){ // next sibling
		while ((node = node.nextSibling)) if (node.nodeType == 1){
			this.push(node, tag, id, classes, attributes, pseudos);
			break;
		}
	},

	'^': function(node, tag, id, classes, attributes, pseudos){ // first child
		node = node.firstChild;
		if (node){
			if (node.nodeType == 1) this.push(node, tag, id, classes, attributes, pseudos);
			else this['combinator:+'](node, tag, id, classes, attributes, pseudos);
		}
	},

	'~': function(node, tag, id, classes, attributes, pseudos){ // next siblings
		while ((node = node.nextSibling)){
			if (node.nodeType != 1) continue;
			var uid = this.getUID(node);
			if (this.bitUniques[uid]) break;
			this.bitUniques[uid] = true;
			this.push(node, tag, id, classes, attributes, pseudos);
		}
	},

	'++': function(node, tag, id, classes, attributes, pseudos){ // next sibling and previous sibling
		this['combinator:+'](node, tag, id, classes, attributes, pseudos);
		this['combinator:!+'](node, tag, id, classes, attributes, pseudos);
	},

	'~~': function(node, tag, id, classes, attributes, pseudos){ // next siblings and previous siblings
		this['combinator:~'](node, tag, id, classes, attributes, pseudos);
		this['combinator:!~'](node, tag, id, classes, attributes, pseudos);
	},

	'!': function(node, tag, id, classes, attributes, pseudos){ // all parent nodes up to document
		while ((node = node.parentNode)) if (node !== this.document) this.push(node, tag, id, classes, attributes, pseudos);
	},

	'!>': function(node, tag, id, classes, attributes, pseudos){ // direct parent (one level)
		node = node.parentNode;
		if (node !== this.document) this.push(node, tag, id, classes, attributes, pseudos);
	},

	'!+': function(node, tag, id, classes, attributes, pseudos){ // previous sibling
		while ((node = node.previousSibling)) if (node.nodeType == 1){
			this.push(node, tag, id, classes, attributes, pseudos);
			break;
		}
	},

	'!^': function(node, tag, id, classes, attributes, pseudos){ // last child
		node = node.lastChild;
		if (node){
			if (node.nodeType == 1) this.push(node, tag, id, classes, attributes, pseudos);
			else this['combinator:!+'](node, tag, id, classes, attributes, pseudos);
		}
	},

	'!~': function(node, tag, id, classes, attributes, pseudos){ // previous siblings
		while ((node = node.previousSibling)){
			if (node.nodeType != 1) continue;
			var uid = this.getUID(node);
			if (this.bitUniques[uid]) break;
			this.bitUniques[uid] = true;
			this.push(node, tag, id, classes, attributes, pseudos);
		}
	}

};

for (var c in combinators) local['combinator:' + c] = combinators[c];

var pseudos = {

	/*<pseudo-selectors>*/

	'empty': function(node){
		var child = node.firstChild;
		return !(child && child.nodeType == 1) && !(node.innerText || node.textContent || '').length;
	},

	'not': function(node, expression){
		return !this.matchNode(node, expression);
	},

	'contains': function(node, text){
		return (node.innerText || node.textContent || '').indexOf(text) > -1;
	},

	'first-child': function(node){
		while ((node = node.previousSibling)) if (node.nodeType == 1) return false;
		return true;
	},

	'last-child': function(node){
		while ((node = node.nextSibling)) if (node.nodeType == 1) return false;
		return true;
	},

	'only-child': function(node){
		var prev = node;
		while ((prev = prev.previousSibling)) if (prev.nodeType == 1) return false;
		var next = node;
		while ((next = next.nextSibling)) if (next.nodeType == 1) return false;
		return true;
	},

	/*<nth-pseudo-selectors>*/

	'nth-child': local.createNTHPseudo('firstChild', 'nextSibling', 'posNTH'),

	'nth-last-child': local.createNTHPseudo('lastChild', 'previousSibling', 'posNTHLast'),

	'nth-of-type': local.createNTHPseudo('firstChild', 'nextSibling', 'posNTHType', true),

	'nth-last-of-type': local.createNTHPseudo('lastChild', 'previousSibling', 'posNTHTypeLast', true),

	'index': function(node, index){
		return this['pseudo:nth-child'](node, '' + (index + 1));
	},

	'even': function(node){
		return this['pseudo:nth-child'](node, '2n');
	},

	'odd': function(node){
		return this['pseudo:nth-child'](node, '2n+1');
	},

	/*</nth-pseudo-selectors>*/

	/*<of-type-pseudo-selectors>*/

	'first-of-type': function(node){
		var nodeName = node.nodeName;
		while ((node = node.previousSibling)) if (node.nodeName == nodeName) return false;
		return true;
	},

	'last-of-type': function(node){
		var nodeName = node.nodeName;
		while ((node = node.nextSibling)) if (node.nodeName == nodeName) return false;
		return true;
	},

	'only-of-type': function(node){
		var prev = node, nodeName = node.nodeName;
		while ((prev = prev.previousSibling)) if (prev.nodeName == nodeName) return false;
		var next = node;
		while ((next = next.nextSibling)) if (next.nodeName == nodeName) return false;
		return true;
	},

	/*</of-type-pseudo-selectors>*/

	// custom pseudos

	'enabled': function(node){
		return !node.disabled;
	},

	'disabled': function(node){
		return node.disabled;
	},

	'checked': function(node){
		return node.checked || node.selected;
	},

	'focus': function(node){
		return this.isHTMLDocument && this.document.activeElement === node && (node.href || node.type || this.hasAttribute(node, 'tabindex'));
	},

	'root': function(node){
		return (node === this.root);
	},

	'selected': function(node){
		return node.selected;
	}

	/*</pseudo-selectors>*/
};

for (var p in pseudos) local['pseudo:' + p] = pseudos[p];

// attributes methods

var attributeGetters = local.attributeGetters = {

	'for': function(){
		return ('htmlFor' in this) ? this.htmlFor : this.getAttribute('for');
	},

	'href': function(){
		return ('href' in this) ? this.getAttribute('href', 2) : this.getAttribute('href');
	},

	'style': function(){
		return (this.style) ? this.style.cssText : this.getAttribute('style');
	},

	'tabindex': function(){
		var attributeNode = this.getAttributeNode('tabindex');
		return (attributeNode && attributeNode.specified) ? attributeNode.nodeValue : null;
	},

	'type': function(){
		return this.getAttribute('type');
	},

	'maxlength': function(){
		var attributeNode = this.getAttributeNode('maxLength');
		return (attributeNode && attributeNode.specified) ? attributeNode.nodeValue : null;
	}

};

attributeGetters.MAXLENGTH = attributeGetters.maxLength = attributeGetters.maxlength;

// Slick

var Slick = local.Slick = (this.Slick || {});

Slick.version = '1.1.7';

// Slick finder

Slick.search = function(context, expression, append){
	return local.search(context, expression, append);
};

Slick.find = function(context, expression){
	return local.search(context, expression, null, true);
};

// Slick containment checker

Slick.contains = function(container, node){
	local.setDocument(container);
	return local.contains(container, node);
};

// Slick attribute getter

Slick.getAttribute = function(node, name){
	local.setDocument(node);
	return local.getAttribute(node, name);
};

Slick.hasAttribute = function(node, name){
	local.setDocument(node);
	return local.hasAttribute(node, name);
};

// Slick matcher

Slick.match = function(node, selector){
	if (!(node && selector)) return false;
	if (!selector || selector === node) return true;
	local.setDocument(node);
	return local.matchNode(node, selector);
};

// Slick attribute accessor

Slick.defineAttributeGetter = function(name, fn){
	local.attributeGetters[name] = fn;
	return this;
};

Slick.lookupAttributeGetter = function(name){
	return local.attributeGetters[name];
};

// Slick pseudo accessor

Slick.definePseudo = function(name, fn){
	local['pseudo:' + name] = function(node, argument){
		return fn.call(node, argument);
	};
	return this;
};

Slick.lookupPseudo = function(name){
	var pseudo = local['pseudo:' + name];
	if (pseudo) return function(argument){
		return pseudo.call(this, argument);
	};
	return null;
};

// Slick overrides accessor

Slick.override = function(regexp, fn){
	local.override(regexp, fn);
	return this;
};

Slick.isXML = local.isXML;

Slick.uidOf = function(node){
	return local.getUIDHTML(node);
};

if (!this.Slick) this.Slick = Slick;

}).apply(/*<CommonJS>*/(typeof exports != 'undefined') ? exports : /*</CommonJS>*/this);


/*
---

name: Element

description: One of the most important items in MooTools. Contains the dollar function, the dollars function, and an handful of cross-browser, time-saver methods to let you easily work with HTML Elements.

license: MIT-style license.

requires: [Window, Document, Array, String, Function, Object, Number, Slick.Parser, Slick.Finder]

provides: [Element, Elements, $, $$, Iframe, Selectors]

...
*/

var Element = function(tag, props){
	var konstructor = Element.Constructors[tag];
	if (konstructor) return konstructor(props);
	if (typeof tag != 'string') return document.id(tag).set(props);

	if (!props) props = {};

	if (!(/^[\w-]+$/).test(tag)){
		var parsed = Slick.parse(tag).expressions[0][0];
		tag = (parsed.tag == '*') ? 'div' : parsed.tag;
		if (parsed.id && props.id == null) props.id = parsed.id;

		var attributes = parsed.attributes;
		if (attributes) for (var attr, i = 0, l = attributes.length; i < l; i++){
			attr = attributes[i];
			if (props[attr.key] != null) continue;

			if (attr.value != null && attr.operator == '=') props[attr.key] = attr.value;
			else if (!attr.value && !attr.operator) props[attr.key] = true;
		}

		if (parsed.classList && props['class'] == null) props['class'] = parsed.classList.join(' ');
	}

	return document.newElement(tag, props);
};


if (Browser.Element){
	Element.prototype = Browser.Element.prototype;
	// IE8 and IE9 require the wrapping.
	Element.prototype._fireEvent = (function(fireEvent){
		return function(type, event){
			return fireEvent.call(this, type, event);
		};
	})(Element.prototype.fireEvent);
}

new Type('Element', Element).mirror(function(name){
	if (Array.prototype[name]) return;

	var obj = {};
	obj[name] = function(){
		var results = [], args = arguments, elements = true;
		for (var i = 0, l = this.length; i < l; i++){
			var element = this[i], result = results[i] = element[name].apply(element, args);
			elements = (elements && typeOf(result) == 'element');
		}
		return (elements) ? new Elements(results) : results;
	};

	Elements.implement(obj);
});

if (!Browser.Element){
	Element.parent = Object;

	Element.Prototype = {
		'$constructor': Element,
		'$family': Function.from('element').hide()
	};

	Element.mirror(function(name, method){
		Element.Prototype[name] = method;
	});
}

Element.Constructors = {};

// //<1.2compat>

// Element.Constructors = new Hash;

// //</1.2compat>

var IFrame = new Type('IFrame', function(){
	var params = Array.link(arguments, {
		properties: Type.isObject,
		iframe: function(obj){
			return (obj != null);
		}
	});

	var props = params.properties || {}, iframe;
	if (params.iframe) iframe = document.id(params.iframe);
	var onload = props.onload || function(){};
	delete props.onload;
	props.id = props.name = [props.id, props.name, iframe ? (iframe.id || iframe.name) : 'IFrame_' + String.uniqueID()].pick();
	iframe = new Element(iframe || 'iframe', props);

	var onLoad = function(){
		onload.call(iframe.contentWindow);
	};

	if (window.frames[props.id]) onLoad();
	else iframe.addListener('load', onLoad);
	return iframe;
});

var Elements = this.Elements = function(nodes){
	if (nodes && nodes.length){
		var uniques = {}, node;
		for (var i = 0; node = nodes[i++];){
			var uid = Slick.uidOf(node);
			if (!uniques[uid]){
				uniques[uid] = true;
				this.push(node);
			}
		}
	}
};

Elements.prototype = {length: 0};
Elements.parent = Array;

new Type('Elements', Elements).implement({

	filter: function(filter, bind){
		if (!filter) return this;
		return new Elements(Array.filter(this, (typeOf(filter) == 'string') ? function(item){
			return item.match(filter);
		} : filter, bind));
	}.protect(),

	push: function(){
		var length = this.length;
		for (var i = 0, l = arguments.length; i < l; i++){
			var item = document.id(arguments[i]);
			if (item) this[length++] = item;
		}
		return (this.length = length);
	}.protect(),

	unshift: function(){
		var items = [];
		for (var i = 0, l = arguments.length; i < l; i++){
			var item = document.id(arguments[i]);
			if (item) items.push(item);
		}
		return Array.prototype.unshift.apply(this, items);
	}.protect(),

	concat: function(){
		var newElements = new Elements(this);
		for (var i = 0, l = arguments.length; i < l; i++){
			var item = arguments[i];
			if (Type.isEnumerable(item)) newElements.append(item);
			else newElements.push(item);
		}
		return newElements;
	}.protect(),

	append: function(collection){
		for (var i = 0, l = collection.length; i < l; i++) this.push(collection[i]);
		return this;
	}.protect(),

	empty: function(){
		while (this.length) delete this[--this.length];
		return this;
	}.protect()

});

//<1.2compat>

// Elements.alias('extend', 'append');

//</1.2compat>

(function(){

// FF, IE
var splice = Array.prototype.splice, object = {'0': 0, '1': 1, length: 2};

splice.call(object, 1, 1);
if (object[1] == 1) Elements.implement('splice', function(){
	var length = this.length;
	var result = splice.apply(this, arguments);
	while (length >= this.length) delete this[length--];
	return result;
}.protect());

Array.forEachMethod(function(method, name){
	Elements.implement(name, method);
});

Array.mirror(Elements);

/*<ltIE8>*/
var createElementAcceptsHTML;
try {
    createElementAcceptsHTML = (document.createElement('<input name=x>').name == 'x');
} catch (e){}

var escapeQuotes = function(html){
	return ('' + html).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
};
/*</ltIE8>*/

Document.implement({

	newElement: function(tag, props){
		if (props && props.checked != null) props.defaultChecked = props.checked;
		/*<ltIE8>*/// Fix for readonly name and type properties in IE < 8
		if (createElementAcceptsHTML && props){
			tag = '<' + tag;
			if (props.name) tag += ' name="' + escapeQuotes(props.name) + '"';
			if (props.type) tag += ' type="' + escapeQuotes(props.type) + '"';
			tag += '>';
			delete props.name;
			delete props.type;
		}
		/*</ltIE8>*/
		return this.id(this.createElement(tag)).set(props);
	}

});

})();

(function(){

Slick.uidOf(window);
Slick.uidOf(document);

Document.implement({

	newTextNode: function(text){
		return this.createTextNode(text);
	},

	getDocument: function(){
		return this;
	},

	getWindow: function(){
		return this.window;
	},

	id: (function(){

		var types = {

			string: function(id, nocash, doc){
				id = Slick.find(doc, '#' + id.replace(/(\W)/g, '\\$1'));
				return (id) ? types.element(id, nocash) : null;
			},

			element: function(el, nocash){
				Slick.uidOf(el);
				if (!nocash && !el.$family && !(/^(?:object|embed)$/i).test(el.tagName)){
					var fireEvent = el.fireEvent;
					// wrapping needed in IE7, or else crash
					el._fireEvent = function(type, event){
						return fireEvent(type, event);
					};
					Object.append(el, Element.Prototype);
				}
				return el;
			},

			object: function(obj, nocash, doc){
				if (obj.toElement) return types.element(obj.toElement(doc), nocash);
				return null;
			}

		};

		types.textnode = types.whitespace = types.window = types.document = function(zero){
			return zero;
		};

		return function(el, nocash, doc){
			if (el && el.$family && el.uniqueNumber) return el;
			var type = typeOf(el);
			return (types[type]) ? types[type](el, nocash, doc || document) : null;
		};

	})()

});

if (window.$ == null) Window.implement('$', function(el, nc){
	return document.id(el, nc, this.document);
});

Window.implement({

	getDocument: function(){
		return this.document;
	},

	getWindow: function(){
		return this;
	}

});

[Document, Element].invoke('implement', {

	getElements: function(expression){
		return Slick.search(this, expression, new Elements);
	},

	getElement: function(expression){
		return document.id(Slick.find(this, expression));
	}

});

var contains = {contains: function(element){
	return Slick.contains(this, element);
}};

if (!document.contains) Document.implement(contains);
if (!document.createElement('div').contains) Element.implement(contains);

//<1.2compat>

// Element.implement('hasChild', function(element){
// 	return this !== element && this.contains(element);
// });

// (function(search, find, match){

// 	this.Selectors = {};
// 	var pseudos = this.Selectors.Pseudo = new Hash();

// 	var addSlickPseudos = function(){
// 		for (var name in pseudos) if (pseudos.hasOwnProperty(name)){
// 			Slick.definePseudo(name, pseudos[name]);
// 			delete pseudos[name];
// 		}
// 	};

// 	Slick.search = function(context, expression, append){
// 		addSlickPseudos();
// 		return search.call(this, context, expression, append);
// 	};

// 	Slick.find = function(context, expression){
// 		addSlickPseudos();
// 		return find.call(this, context, expression);
// 	};

// 	Slick.match = function(node, selector){
// 		addSlickPseudos();
// 		return match.call(this, node, selector);
// 	};

// })(Slick.search, Slick.find, Slick.match);

//</1.2compat>

// tree walking

var injectCombinator = function(expression, combinator){
	if (!expression) return combinator;

	expression = Object.clone(Slick.parse(expression));

	var expressions = expression.expressions;
	for (var i = expressions.length; i--;)
		expressions[i][0].combinator = combinator;

	return expression;
};

Object.forEach({
	getNext: '~',
	getPrevious: '!~',
	getParent: '!'
}, function(combinator, method){
	Element.implement(method, function(expression){
		return this.getElement(injectCombinator(expression, combinator));
	});
});

Object.forEach({
	getAllNext: '~',
	getAllPrevious: '!~',
	getSiblings: '~~',
	getChildren: '>',
	getParents: '!'
}, function(combinator, method){
	Element.implement(method, function(expression){
		return this.getElements(injectCombinator(expression, combinator));
	});
});

Element.implement({

	getFirst: function(expression){
		return document.id(Slick.search(this, injectCombinator(expression, '>'))[0]);
	},

	getLast: function(expression){
		return document.id(Slick.search(this, injectCombinator(expression, '>')).getLast());
	},

	getWindow: function(){
		return this.ownerDocument.window;
	},

	getDocument: function(){
		return this.ownerDocument;
	},

	getElementById: function(id){
		return document.id(Slick.find(this, '#' + ('' + id).replace(/(\W)/g, '\\$1')));
	},

	match: function(expression){
		return !expression || Slick.match(this, expression);
	}

});

//<1.2compat>

// if (window.$$ == null) Window.implement('$$', function(selector){
// 	var elements = new Elements;
// 	if (arguments.length == 1 && typeof selector == 'string') return Slick.search(this.document, selector, elements);
// 	var args = Array.flatten(arguments);
// 	for (var i = 0, l = args.length; i < l; i++){
// 		var item = args[i];
// 		switch (typeOf(item)){
// 			case 'element': elements.push(item); break;
// 			case 'string': Slick.search(this.document, item, elements);
// 		}
// 	}
// 	return elements;
// });

//</1.2compat>

if (window.$$ == null) Window.implement('$$', function(selector){
	if (arguments.length == 1){
		if (typeof selector == 'string') return Slick.search(this.document, selector, new Elements);
		else if (Type.isEnumerable(selector)) return new Elements(selector);
	}
	return new Elements(arguments);
});

// Inserters

var inserters = {

	before: function(context, element){
		var parent = element.parentNode;
		if (parent) parent.insertBefore(context, element);
	},

	after: function(context, element){
		var parent = element.parentNode;
		if (parent) parent.insertBefore(context, element.nextSibling);
	},

	bottom: function(context, element){
		element.appendChild(context);
	},

	top: function(context, element){
		element.insertBefore(context, element.firstChild);
	}

};

inserters.inside = inserters.bottom;

//<1.2compat>

// Object.each(inserters, function(inserter, where){

// 	where = where.capitalize();

// 	var methods = {};

// 	methods['inject' + where] = function(el){
// 		inserter(this, document.id(el, true));
// 		return this;
// 	};

// 	methods['grab' + where] = function(el){
// 		inserter(document.id(el, true), this);
// 		return this;
// 	};

// 	Element.implement(methods);

// });

//</1.2compat>

// getProperty / setProperty

var propertyGetters = {}, propertySetters = {};

// properties

var properties = {};
Array.forEach([
	'type', 'value', 'defaultValue', 'accessKey', 'cellPadding', 'cellSpacing', 'colSpan',
	'frameBorder', 'rowSpan', 'tabIndex', 'useMap'
], function(property){
	properties[property.toLowerCase()] = property;
});

properties.html = 'innerHTML';
properties.text = (document.createElement('div').textContent == null) ? 'innerText': 'textContent';

Object.forEach(properties, function(real, key){
	propertySetters[key] = function(node, value){
		node[real] = value;
	};
	propertyGetters[key] = function(node){
		return node[real];
	};
});

// Booleans

var bools = [
	'compact', 'nowrap', 'ismap', 'declare', 'noshade', 'checked',
	'disabled', 'readOnly', 'multiple', 'selected', 'noresize',
	'defer', 'defaultChecked', 'autofocus', 'controls', 'autoplay',
	'loop'
];

var booleans = {};
Array.forEach(bools, function(bool){
	var lower = bool.toLowerCase();
	booleans[lower] = bool;
	propertySetters[lower] = function(node, value){
		node[bool] = !!value;
	};
	propertyGetters[lower] = function(node){
		return !!node[bool];
	};
});

// Special cases

Object.append(propertySetters, {

	'class': function(node, value){
		('className' in node) ? node.className = (value || '') : node.setAttribute('class', value);
	},

	'for': function(node, value){
		('htmlFor' in node) ? node.htmlFor = value : node.setAttribute('for', value);
	},

	'style': function(node, value){
		(node.style) ? node.style.cssText = value : node.setAttribute('style', value);
	},

	'value': function(node, value){
		node.value = (value != null) ? value : '';
	}

});

propertyGetters['class'] = function(node){
	return ('className' in node) ? node.className || null : node.getAttribute('class');
};

/* <webkit> */
var el = document.createElement('button');
// IE sets type as readonly and throws
try { el.type = 'button'; } catch(e){}
if (el.type != 'button') propertySetters.type = function(node, value){
	node.setAttribute('type', value);
};
el = null;
/* </webkit> */

/*<IE>*/
var input = document.createElement('input');
input.value = 't';
input.type = 'submit';
if (input.value != 't') propertySetters.type = function(node, type){
	var value = node.value;
	node.type = type;
	node.value = value;
};
input = null;
/*</IE>*/

/* getProperty, setProperty */

/* <ltIE9> */
var pollutesGetAttribute = (function(div){
	div.random = 'attribute';
	return (div.getAttribute('random') == 'attribute');
})(document.createElement('div'));

/* <ltIE9> */

Element.implement({

	setProperty: function(name, value){
		var setter = propertySetters[name.toLowerCase()];
		if (setter){
			setter(this, value);
		} else {
			/* <ltIE9> */
			if (pollutesGetAttribute) var attributeWhiteList = this.retrieve('$attributeWhiteList', {});
			/* </ltIE9> */

			if (value == null){
				this.removeAttribute(name);
				/* <ltIE9> */
				if (pollutesGetAttribute) delete attributeWhiteList[name];
				/* </ltIE9> */
			} else {
				this.setAttribute(name, '' + value);
				/* <ltIE9> */
				if (pollutesGetAttribute) attributeWhiteList[name] = true;
				/* </ltIE9> */
			}
		}
		return this;
	},

	setProperties: function(attributes){
		for (var attribute in attributes) this.setProperty(attribute, attributes[attribute]);
		return this;
	},

	getProperty: function(name){
		var getter = propertyGetters[name.toLowerCase()];
		if (getter) return getter(this);
		/* <ltIE9> */
		if (pollutesGetAttribute){
			var attr = this.getAttributeNode(name), attributeWhiteList = this.retrieve('$attributeWhiteList', {});
			if (!attr) return null;
			if (attr.expando && !attributeWhiteList[name]){
				var outer = this.outerHTML;
				// segment by the opening tag and find mention of attribute name
				if (outer.substr(0, outer.search(/\/?['"]?>(?![^<]*<['"])/)).indexOf(name) < 0) return null;
				attributeWhiteList[name] = true;
			}
		}
		/* </ltIE9> */
		var result = Slick.getAttribute(this, name);
		return (!result && !Slick.hasAttribute(this, name)) ? null : result;
	},

	getProperties: function(){
		var args = Array.from(arguments);
		return args.map(this.getProperty, this).associate(args);
	},

	removeProperty: function(name){
		return this.setProperty(name, null);
	},

	removeProperties: function(){
		Array.each(arguments, this.removeProperty, this);
		return this;
	},

	set: function(prop, value){
		var property = Element.Properties[prop];
		(property && property.set) ? property.set.call(this, value) : this.setProperty(prop, value);
	}.overloadSetter(),

	get: function(prop){
		var property = Element.Properties[prop];
		return (property && property.get) ? property.get.apply(this) : this.getProperty(prop);
	}.overloadGetter(),

	erase: function(prop){
		var property = Element.Properties[prop];
		(property && property.erase) ? property.erase.apply(this) : this.removeProperty(prop);
		return this;
	},

	hasClass: function(className){
		return this.className.clean().contains(className, ' ');
	},

	addClass: function(className){
		if (!this.hasClass(className)) this.className = (this.className + ' ' + className).clean();
		return this;
	},

	removeClass: function(className){
		this.className = this.className.replace(new RegExp('(^|\\s)' + className + '(?:\\s|$)'), '$1');
		return this;
	},

	toggleClass: function(className, force){
		if (force == null) force = !this.hasClass(className);
		return (force) ? this.addClass(className) : this.removeClass(className);
	},

	adopt: function(){
		var parent = this, fragment, elements = Array.flatten(arguments), length = elements.length;
		if (length > 1) parent = fragment = document.createDocumentFragment();

		for (var i = 0; i < length; i++){
			var element = document.id(elements[i], true);
			if (element) parent.appendChild(element);
		}

		if (fragment) this.appendChild(fragment);

		return this;
	},

	appendText: function(text, where){
		return this.grab(this.getDocument().newTextNode(text), where);
	},

	grab: function(el, where){
		inserters[where || 'bottom'](document.id(el, true), this);
		return this;
	},

	inject: function(el, where){
		inserters[where || 'bottom'](this, document.id(el, true));
		return this;
	},

	replaces: function(el){
		el = document.id(el, true);
		el.parentNode.replaceChild(this, el);
		return this;
	},

	wraps: function(el, where){
		el = document.id(el, true);
		return this.replaces(el).grab(el, where);
	},

	getSelected: function(){
		this.selectedIndex; // Safari 3.2.1
		return new Elements(Array.from(this.options).filter(function(option){
			return option.selected;
		}));
	},

	toQueryString: function(){
		var queryString = [];
		this.getElements('input, select, textarea').each(function(el){
			var type = el.type;
			if (!el.name || el.disabled || type == 'submit' || type == 'reset' || type == 'file' || type == 'image') return;

			var value = (el.get('tag') == 'select') ? el.getSelected().map(function(opt){
				// IE
				return document.id(opt).get('value');
			}) : ((type == 'radio' || type == 'checkbox') && !el.checked) ? null : el.get('value');

			Array.from(value).each(function(val){
				if (typeof val != 'undefined') queryString.push(encodeURIComponent(el.name) + '=' + encodeURIComponent(val));
			});
		});
		return queryString.join('&');
	}

});

var collected = {}, storage = {};

var get = function(uid){
	return (storage[uid] || (storage[uid] = {}));
};

var clean = function(item){
	var uid = item.uniqueNumber;
	if (item.removeEvents) item.removeEvents();
	if (item.clearAttributes) item.clearAttributes();
	if (uid != null){
		delete collected[uid];
		delete storage[uid];
	}
	return item;
};

var formProps = {input: 'checked', option: 'selected', textarea: 'value'};

Element.implement({

	destroy: function(){
		var children = clean(this).getElementsByTagName('*');
		Array.each(children, clean);
		Element.dispose(this);
		return null;
	},

	empty: function(){
		Array.from(this.childNodes).each(Element.dispose);
		return this;
	},

	dispose: function(){
		return (this.parentNode) ? this.parentNode.removeChild(this) : this;
	},

	clone: function(contents, keepid){
		contents = contents !== false;
		var clone = this.cloneNode(contents), ce = [clone], te = [this], i;

		if (contents){
			ce.append(Array.from(clone.getElementsByTagName('*')));
			te.append(Array.from(this.getElementsByTagName('*')));
		}

		for (i = ce.length; i--;){
			var node = ce[i], element = te[i];
			if (!keepid) node.removeAttribute('id');
			/*<ltIE9>*/
			if (node.clearAttributes){
				node.clearAttributes();
				node.mergeAttributes(element);
				node.removeAttribute('uniqueNumber');
				if (node.options){
					var no = node.options, eo = element.options;
					for (var j = no.length; j--;) no[j].selected = eo[j].selected;
				}
			}
			/*</ltIE9>*/
			var prop = formProps[element.tagName.toLowerCase()];
			if (prop && element[prop]) node[prop] = element[prop];
		}

		/*<ltIE9>*/
		if (Browser.ie){
			var co = clone.getElementsByTagName('object'), to = this.getElementsByTagName('object');
			for (i = co.length; i--;) co[i].outerHTML = to[i].outerHTML;
		}
		/*</ltIE9>*/
		return document.id(clone);
	}

});

[Element, Window, Document].invoke('implement', {

	addListener: function(type, fn){
		if (type == 'unload'){
			var old = fn, self = this;
			fn = function(){
				self.removeListener('unload', fn);
				old();
			};
		} else {
			collected[Slick.uidOf(this)] = this;
		}
		if (this.addEventListener) this.addEventListener(type, fn, !!arguments[2]);
		else this.attachEvent('on' + type, fn);
		return this;
	},

	removeListener: function(type, fn){
		if (this.removeEventListener) this.removeEventListener(type, fn, !!arguments[2]);
		else this.detachEvent('on' + type, fn);
		return this;
	},

	retrieve: function(property, dflt){
		var storage = get(Slick.uidOf(this)), prop = storage[property];
		if (dflt != null && prop == null) prop = storage[property] = dflt;
		return prop != null ? prop : null;
	},

	store: function(property, value){
		var storage = get(Slick.uidOf(this));
		storage[property] = value;
		return this;
	},

	eliminate: function(property){
		var storage = get(Slick.uidOf(this));
		delete storage[property];
		return this;
	}

});

/*<ltIE9>*/
if (window.attachEvent && !window.addEventListener) window.addListener('unload', function(){
	Object.each(collected, clean);
	if (window.CollectGarbage) CollectGarbage();
});
/*</ltIE9>*/

Element.Properties = {};

//<1.2compat>

// Element.Properties = new Hash;

//</1.2compat>

Element.Properties.style = {

	set: function(style){
		this.style.cssText = style;
	},

	get: function(){
		return this.style.cssText;
	},

	erase: function(){
		this.style.cssText = '';
	}

};

Element.Properties.tag = {

	get: function(){
		return this.tagName.toLowerCase();
	}

};

Element.Properties.html = {

	set: function(html){
		if (html == null) html = '';
		else if (typeOf(html) == 'array') html = html.join('');
		this.innerHTML = html;
	},

	erase: function(){
		this.innerHTML = '';
	}

};

/*<ltIE9>*/
// technique by jdbarlett - http://jdbartlett.com/innershiv/
var div = document.createElement('div');
div.innerHTML = '<nav></nav>';
var supportsHTML5Elements = (div.childNodes.length == 1);
if (!supportsHTML5Elements){
	var tags = 'abbr article aside audio canvas datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video'.split(' '),
		fragment = document.createDocumentFragment(), l = tags.length;
	while (l--) fragment.createElement(tags[l]);
}
div = null;
/*</ltIE9>*/

/*<IE>*/
var supportsTableInnerHTML = Function.attempt(function(){
	var table = document.createElement('table');
	table.innerHTML = '<tr><td></td></tr>';
	return true;
});

/*<ltFF4>*/
var tr = document.createElement('tr'), html = '<td></td>';
tr.innerHTML = html;
var supportsTRInnerHTML = (tr.innerHTML == html);
tr = null;
/*</ltFF4>*/

if (!supportsTableInnerHTML || !supportsTRInnerHTML || !supportsHTML5Elements){

	Element.Properties.html.set = (function(set){

		var translations = {
			table: [1, '<table>', '</table>'],
			select: [1, '<select>', '</select>'],
			tbody: [2, '<table><tbody>', '</tbody></table>'],
			tr: [3, '<table><tbody><tr>', '</tr></tbody></table>']
		};

		translations.thead = translations.tfoot = translations.tbody;

		return function(html){
			var wrap = translations[this.get('tag')];
			if (!wrap && !supportsHTML5Elements) wrap = [0, '', ''];
			if (!wrap) return set.call(this, html);

			var level = wrap[0], wrapper = document.createElement('div'), target = wrapper;
			if (!supportsHTML5Elements) fragment.appendChild(wrapper);
			wrapper.innerHTML = [wrap[1], html, wrap[2]].flatten().join('');
			while (level--) target = target.firstChild;
			this.empty().adopt(target.childNodes);
			if (!supportsHTML5Elements) fragment.removeChild(wrapper);
			wrapper = null;
		};

	})(Element.Properties.html.set);
}
/*</IE>*/

/*<ltIE9>*/
var testForm = document.createElement('form');
testForm.innerHTML = '<select><option>s</option></select>';

if (testForm.firstChild.value != 's') Element.Properties.value = {

	set: function(value){
		var tag = this.get('tag');
		if (tag != 'select') return this.setProperty('value', value);
		var options = this.getElements('option');
		for (var i = 0; i < options.length; i++){
			var option = options[i],
				attr = option.getAttributeNode('value'),
				optionValue = (attr && attr.specified) ? option.value : option.get('text');
			if (optionValue == value) return option.selected = true;
		}
	},

	get: function(){
		var option = this, tag = option.get('tag');

		if (tag != 'select' && tag != 'option') return this.getProperty('value');

		if (tag == 'select' && !(option = option.getSelected()[0])) return '';

		var attr = option.getAttributeNode('value');
		return (attr && attr.specified) ? option.value : option.get('text');
	}

};
testForm = null;
/*</ltIE9>*/

/*<IE>*/
if (document.createElement('div').getAttributeNode('id')) Element.Properties.id = {
	set: function(id){
		this.id = this.getAttributeNode('id').value = id;
	},
	get: function(){
		return this.id || null;
	},
	erase: function(){
		this.id = this.getAttributeNode('id').value = '';
	}
};
/*</IE>*/

})();


/*
---

name: Element.Style

description: Contains methods for interacting with the styles of Elements in a fashionable way.

license: MIT-style license.

requires: Element

provides: Element.Style

...
*/

(function(){

var html = document.html;

//<ltIE9>
// Check for oldIE, which does not remove styles when they're set to null
var el = document.createElement('div');
el.style.color = 'red';
el.style.color = null;
var doesNotRemoveStyles = el.style.color == 'red';
el = null;
//</ltIE9>

Element.Properties.styles = {set: function(styles){
	this.setStyles(styles);
}};

var hasOpacity = (html.style.opacity != null),
	hasFilter = (html.style.filter != null),
	reAlpha = /alpha\(opacity=([\d.]+)\)/i;

var setVisibility = function(element, opacity){
	element.store('$opacity', opacity);
	element.style.visibility = opacity > 0 || opacity == null ? 'visible' : 'hidden';
};

var setOpacity = (hasOpacity ? function(element, opacity){
	element.style.opacity = opacity;
} : (hasFilter ? function(element, opacity){
	var style = element.style;
	if (!element.currentStyle || !element.currentStyle.hasLayout) style.zoom = 1;
	if (opacity == null || opacity == 1) opacity = '';
	else opacity = 'alpha(opacity=' + (opacity * 100).limit(0, 100).round() + ')';
	var filter = style.filter || element.getComputedStyle('filter') || '';
	style.filter = reAlpha.test(filter) ? filter.replace(reAlpha, opacity) : filter + opacity;
	if (!style.filter) style.removeAttribute('filter');
} : setVisibility));

var getOpacity = (hasOpacity ? function(element){
	var opacity = element.style.opacity || element.getComputedStyle('opacity');
	return (opacity == '') ? 1 : opacity.toFloat();
} : (hasFilter ? function(element){
	var filter = (element.style.filter || element.getComputedStyle('filter')),
		opacity;
	if (filter) opacity = filter.match(reAlpha);
	return (opacity == null || filter == null) ? 1 : (opacity[1] / 100);
} : function(element){
	var opacity = element.retrieve('$opacity');
	if (opacity == null) opacity = (element.style.visibility == 'hidden' ? 0 : 1);
	return opacity;
}));

var floatName = (html.style.cssFloat == null) ? 'styleFloat' : 'cssFloat';

Element.implement({

	getComputedStyle: function(property){
		if (this.currentStyle) return this.currentStyle[property.camelCase()];
		var defaultView = Element.getDocument(this).defaultView,
			computed = defaultView ? defaultView.getComputedStyle(this, null) : null;
		return (computed) ? computed.getPropertyValue((property == floatName) ? 'float' : property.hyphenate()) : null;
	},

	setStyle: function(property, value){
		if (property == 'opacity'){
			if (value != null) value = parseFloat(value);
			setOpacity(this, value);
			return this;
		}
		property = (property == 'float' ? floatName : property).camelCase();
		if (typeOf(value) != 'string'){
			var map = (Element.Styles[property] || '@').split(' ');
			value = Array.from(value).map(function(val, i){
				if (!map[i]) return '';
				return (typeOf(val) == 'number') ? map[i].replace('@', Math.round(val)) : val;
			}).join(' ');
		} else if (value == String(Number(value))){
			value = Math.round(value);
		}
		this.style[property] = value;
		//<ltIE9>
		if ((value == '' || value == null) && doesNotRemoveStyles && this.style.removeAttribute){
			this.style.removeAttribute(property);
		}
		//</ltIE9>
		return this;
	},

	getStyle: function(property){
		if (property == 'opacity') return getOpacity(this);
		property = (property == 'float' ? floatName : property).camelCase();
		var result = this.style[property];
		if (!result || property == 'zIndex'){
			result = [];
			for (var style in Element.ShortStyles){
				if (property != style) continue;
				for (var s in Element.ShortStyles[style]) result.push(this.getStyle(s));
				return result.join(' ');
			}
			result = this.getComputedStyle(property);
		}
		if (result){
			result = String(result);
			var color = result.match(/rgba?\([\d\s,]+\)/);
			if (color) result = result.replace(color[0], color[0].rgbToHex());
		}
		if (Browser.opera || Browser.ie){
			if ((/^(height|width)$/).test(property) && !(/px$/.test(result))){
				var values = (property == 'width') ? ['left', 'right'] : ['top', 'bottom'], size = 0;
				values.each(function(value){
					size += this.getStyle('border-' + value + '-width').toInt() + this.getStyle('padding-' + value).toInt();
				}, this);
				return this['offset' + property.capitalize()] - size + 'px';
			}
			if (Browser.ie && (/^border(.+)Width|margin|padding/).test(property) && isNaN(parseFloat(result))){
				return '0px';
			}
		}
		return result;
	},

	setStyles: function(styles){
		for (var style in styles) this.setStyle(style, styles[style]);
		return this;
	},

	getStyles: function(){
		var result = {};
		Array.flatten(arguments).each(function(key){
			result[key] = this.getStyle(key);
		}, this);
		return result;
	}

});

Element.Styles = {
	left: '@px', top: '@px', bottom: '@px', right: '@px',
	width: '@px', height: '@px', maxWidth: '@px', maxHeight: '@px', minWidth: '@px', minHeight: '@px',
	backgroundColor: 'rgb(@, @, @)', backgroundPosition: '@px @px', color: 'rgb(@, @, @)',
	fontSize: '@px', letterSpacing: '@px', lineHeight: '@px', clip: 'rect(@px @px @px @px)',
	margin: '@px @px @px @px', padding: '@px @px @px @px', border: '@px @ rgb(@, @, @) @px @ rgb(@, @, @) @px @ rgb(@, @, @)',
	borderWidth: '@px @px @px @px', borderStyle: '@ @ @ @', borderColor: 'rgb(@, @, @) rgb(@, @, @) rgb(@, @, @) rgb(@, @, @)',
	zIndex: '@', 'zoom': '@', fontWeight: '@', textIndent: '@px', opacity: '@'
};

//<1.3compat>

// Element.implement({

// 	setOpacity: function(value){
// 		setOpacity(this, value);
// 		return this;
// 	},

// 	getOpacity: function(){
// 		return getOpacity(this);
// 	}

// });

// Element.Properties.opacity = {

// 	set: function(opacity){
// 		setOpacity(this, opacity);
// 		setVisibility(this, opacity);
// 	},

// 	get: function(){
// 		return getOpacity(this);
// 	}

// };

//</1.3compat>

//<1.2compat>

// Element.Styles = new Hash(Element.Styles);

//</1.2compat>

Element.ShortStyles = {margin: {}, padding: {}, border: {}, borderWidth: {}, borderStyle: {}, borderColor: {}};

['Top', 'Right', 'Bottom', 'Left'].each(function(direction){
	var Short = Element.ShortStyles;
	var All = Element.Styles;
	['margin', 'padding'].each(function(style){
		var sd = style + direction;
		Short[style][sd] = All[sd] = '@px';
	});
	var bd = 'border' + direction;
	Short.border[bd] = All[bd] = '@px @ rgb(@, @, @)';
	var bdw = bd + 'Width', bds = bd + 'Style', bdc = bd + 'Color';
	Short[bd] = {};
	Short.borderWidth[bdw] = Short[bd][bdw] = All[bdw] = '@px';
	Short.borderStyle[bds] = Short[bd][bds] = All[bds] = '@';
	Short.borderColor[bdc] = Short[bd][bdc] = All[bdc] = 'rgb(@, @, @)';
});

})();


/*
---

name: Element.Event

description: Contains Element methods for dealing with events. This file also includes mouseenter and mouseleave custom Element Events, if necessary.

license: MIT-style license.

requires: [Element, Event]

provides: Element.Event

...
*/

(function(){

Element.Properties.events = {set: function(events){
	this.addEvents(events);
}};

[Element, Window, Document].invoke('implement', {

	addEvent: function(type, fn){
		var events = this.retrieve('events', {});
		if (!events[type]) events[type] = {keys: [], values: []};
		if (events[type].keys.contains(fn)) return this;
		events[type].keys.push(fn);
		var realType = type,
			custom = Element.Events[type],
			condition = fn,
			self = this;
		if (custom){
			if (custom.onAdd) custom.onAdd.call(this, fn, type);
			if (custom.condition){
				condition = function(event){
					if (custom.condition.call(this, event, type)) return fn.call(this, event);
					return true;
				};
			}
			if (custom.base) realType = Function.from(custom.base).call(this, type);
		}
		var defn = function(){
			return fn.call(self);
		};
		var nativeEvent = Element.NativeEvents[realType];
		if (nativeEvent){
			if (nativeEvent == 2){
				defn = function(event){
					event = new DOMEvent(event, self.getWindow());
					if (condition.call(self, event) === false) event.stop();
				};
			}
			this.addListener(realType, defn, arguments[2]);
		}
		events[type].values.push(defn);
		return this;
	},

	removeEvent: function(type, fn){
		var events = this.retrieve('events');
		if (!events || !events[type]) return this;
		var list = events[type];
		var index = list.keys.indexOf(fn);
		if (index == -1) return this;
		var value = list.values[index];
		delete list.keys[index];
		delete list.values[index];
		var custom = Element.Events[type];
		if (custom){
			if (custom.onRemove) custom.onRemove.call(this, fn, type);
			if (custom.base) type = Function.from(custom.base).call(this, type);
		}
		return (Element.NativeEvents[type]) ? this.removeListener(type, value, arguments[2]) : this;
	},

	addEvents: function(events){
		for (var event in events) this.addEvent(event, events[event]);
		return this;
	},

	removeEvents: function(events){
		var type;
		if (typeOf(events) == 'object'){
			for (type in events) this.removeEvent(type, events[type]);
			return this;
		}
		var attached = this.retrieve('events');
		if (!attached) return this;
		if (!events){
			for (type in attached) this.removeEvents(type);
			this.eliminate('events');
		} else if (attached[events]){
			attached[events].keys.each(function(fn){
				this.removeEvent(events, fn);
			}, this);
			delete attached[events];
		}
		return this;
	},

	fireEvent: function(type, args, delay){
		var events = this.retrieve('events');
		if (!events || !events[type]) return this;
		args = Array.from(args);

		events[type].keys.each(function(fn){
			if (delay) fn.delay(delay, this, args);
			else fn.apply(this, args);
		}, this);
		return this;
	},

	cloneEvents: function(from, type){
		from = document.id(from);
		var events = from.retrieve('events');
		if (!events) return this;
		if (!type){
			for (var eventType in events) this.cloneEvents(from, eventType);
		} else if (events[type]){
			events[type].keys.each(function(fn){
				this.addEvent(type, fn);
			}, this);
		}
		return this;
	}

});

Element.NativeEvents = {
	click: 2, dblclick: 2, mouseup: 2, mousedown: 2, contextmenu: 2, //mouse buttons
	mousewheel: 2, DOMMouseScroll: 2, //mouse wheel
	mouseover: 2, mouseout: 2, mousemove: 2, selectstart: 2, selectend: 2, //mouse movement
	keydown: 2, keypress: 2, keyup: 2, //keyboard
	orientationchange: 2, // mobile
	touchstart: 2, touchmove: 2, touchend: 2, touchcancel: 2, // touch
	gesturestart: 2, gesturechange: 2, gestureend: 2, // gesture
	focus: 2, blur: 2, change: 2, reset: 2, select: 2, submit: 2, paste: 2, input: 2, //form elements
	load: 2, unload: 1, beforeunload: 2, resize: 1, move: 1, DOMContentLoaded: 1, readystatechange: 1, //window
	error: 1, abort: 1, scroll: 1 //misc
};

Element.Events = {mousewheel: {
	base: (Browser.firefox) ? 'DOMMouseScroll' : 'mousewheel'
}};

if ('onmouseenter' in document.documentElement){
	Element.NativeEvents.mouseenter = Element.NativeEvents.mouseleave = 2;
} else {
	var check = function(event){
		var related = event.relatedTarget;
		if (related == null) return true;
		if (!related) return false;
		return (related != this && related.prefix != 'xul' && typeOf(this) != 'document' && !this.contains(related));
	};

	Element.Events.mouseenter = {
		base: 'mouseover',
		condition: check
	};

	Element.Events.mouseleave = {
		base: 'mouseout',
		condition: check
	};
}

/*<ltIE9>*/
if (!window.addEventListener){
	Element.NativeEvents.propertychange = 2;
	Element.Events.change = {
		base: function(){
			var type = this.type;
			return (this.get('tag') == 'input' && (type == 'radio' || type == 'checkbox')) ? 'propertychange' : 'change'
		},
		condition: function(event){
			return this.type != 'radio' || (event.event.propertyName == 'checked' && this.checked);
		}
	}
}
/*</ltIE9>*/

//<1.2compat>

// Element.Events = new Hash(Element.Events);

//</1.2compat>

})();


/*
---

name: Element.Delegation

description: Extends the Element native object to include the delegate method for more efficient event management.

license: MIT-style license.

requires: [Element.Event]

provides: [Element.Delegation]

...
*/

(function(){

var eventListenerSupport = !!window.addEventListener;

Element.NativeEvents.focusin = Element.NativeEvents.focusout = 2;

var bubbleUp = function(self, match, fn, event, target){
	while (target && target != self){
		if (match(target, event)) return fn.call(target, event, target);
		target = document.id(target.parentNode);
	}
};

var map = {
	mouseenter: {
		base: 'mouseover'
	},
	mouseleave: {
		base: 'mouseout'
	},
	focus: {
		base: 'focus' + (eventListenerSupport ? '' : 'in'),
		capture: true
	},
	blur: {
		base: eventListenerSupport ? 'blur' : 'focusout',
		capture: true
	}
};

/*<ltIE9>*/
var _key = '$delegation:';
var formObserver = function(type){

	return {

		base: 'focusin',

		remove: function(self, uid){
			var list = self.retrieve(_key + type + 'listeners', {})[uid];
			if (list && list.forms) for (var i = list.forms.length; i--;){
				list.forms[i].removeEvent(type, list.fns[i]);
			}
		},

		listen: function(self, match, fn, event, target, uid){
			var form = (target.get('tag') == 'form') ? target : event.target.getParent('form');
			if (!form) return;

			var listeners = self.retrieve(_key + type + 'listeners', {}),
				listener = listeners[uid] || {forms: [], fns: []},
				forms = listener.forms, fns = listener.fns;

			if (forms.indexOf(form) != -1) return;
			forms.push(form);

			var _fn = function(event){
				bubbleUp(self, match, fn, event, target);
			};
			form.addEvent(type, _fn);
			fns.push(_fn);

			listeners[uid] = listener;
			self.store(_key + type + 'listeners', listeners);
		}
	};
};

var inputObserver = function(type){
	return {
		base: 'focusin',
		listen: function(self, match, fn, event, target){
			var events = {blur: function(){
				this.removeEvents(events);
			}};
			events[type] = function(event){
				bubbleUp(self, match, fn, event, target);
			};
			event.target.addEvents(events);
		}
	};
};

if (!eventListenerSupport) Object.append(map, {
	submit: formObserver('submit'),
	reset: formObserver('reset'),
	change: inputObserver('change'),
	select: inputObserver('select')
});
/*</ltIE9>*/

var proto = Element.prototype,
	addEvent = proto.addEvent,
	removeEvent = proto.removeEvent;

var relay = function(old, method){
	return function(type, fn, useCapture){
		if (type.indexOf(':relay') == -1) return old.call(this, type, fn, useCapture);
		var parsed = Slick.parse(type).expressions[0][0];
		if (parsed.pseudos[0].key != 'relay') return old.call(this, type, fn, useCapture);
		var newType = parsed.tag;
		parsed.pseudos.slice(1).each(function(pseudo){
			newType += ':' + pseudo.key + (pseudo.value ? '(' + pseudo.value + ')' : '');
		});
		old.call(this, type, fn);
		return method.call(this, newType, parsed.pseudos[0].value, fn);
	};
};

var delegation = {

	addEvent: function(type, match, fn){
		var storage = this.retrieve('$delegates', {}), stored = storage[type];
		if (stored) for (var _uid in stored){
			if (stored[_uid].fn == fn && stored[_uid].match == match) return this;
		}

		var _type = type, _match = match, _fn = fn, _map = map[type] || {};
		type = _map.base || _type;

		match = function(target){
			return Slick.match(target, _match);
		};

		var elementEvent = Element.Events[_type];
		if (elementEvent && elementEvent.condition){
			var __match = match, condition = elementEvent.condition;
			match = function(target, event){
				return __match(target, event) && condition.call(target, event, type);
			};
		}

		var self = this, uid = String.uniqueID();
		var delegator = _map.listen ? function(event, target){
			if (!target && event && event.target) target = event.target;
			if (target) _map.listen(self, match, fn, event, target, uid);
		} : function(event, target){
			if (!target && event && event.target) target = event.target;
			if (target) bubbleUp(self, match, fn, event, target);
		};

		if (!stored) stored = {};
		stored[uid] = {
			match: _match,
			fn: _fn,
			delegator: delegator
		};
		storage[_type] = stored;
		return addEvent.call(this, type, delegator, _map.capture);
	},

	removeEvent: function(type, match, fn, _uid){
		var storage = this.retrieve('$delegates', {}), stored = storage[type];
		if (!stored) return this;

		if (_uid){
			var _type = type, delegator = stored[_uid].delegator, _map = map[type] || {};
			type = _map.base || _type;
			if (_map.remove) _map.remove(this, _uid);
			delete stored[_uid];
			storage[_type] = stored;
			return removeEvent.call(this, type, delegator);
		}

		var __uid, s;
		if (fn) for (__uid in stored){
			s = stored[__uid];
			if (s.match == match && s.fn == fn) return delegation.removeEvent.call(this, type, match, fn, __uid);
		} else for (__uid in stored){
			s = stored[__uid];
			if (s.match == match) delegation.removeEvent.call(this, type, match, s.fn, __uid);
		}
		return this;
	}

};

[Element, Window, Document].invoke('implement', {
	addEvent: relay(addEvent, delegation.addEvent),
	removeEvent: relay(removeEvent, delegation.removeEvent)
});

})();


/*
---

name: Element.Dimensions

description: Contains methods to work with size, scroll, or positioning of Elements and the window object.

license: MIT-style license.

credits:
  - Element positioning based on the [qooxdoo](http://qooxdoo.org/) code and smart browser fixes, [LGPL License](http://www.gnu.org/licenses/lgpl.html).
  - Viewport dimensions based on [YUI](http://developer.yahoo.com/yui/) code, [BSD License](http://developer.yahoo.com/yui/license.html).

requires: [Element, Element.Style]

provides: [Element.Dimensions]

...
*/

(function(){

var element = document.createElement('div'),
	child = document.createElement('div');
element.style.height = '0';
element.appendChild(child);
var brokenOffsetParent = (child.offsetParent === element);
element = child = null;

var isOffset = function(el){
	return styleString(el, 'position') != 'static' || isBody(el);
};

var isOffsetStatic = function(el){
	return isOffset(el) || (/^(?:table|td|th)$/i).test(el.tagName);
};

Element.implement({

	scrollTo: function(x, y){
		if (isBody(this)){
			this.getWindow().scrollTo(x, y);
		} else {
			this.scrollLeft = x;
			this.scrollTop = y;
		}
		return this;
	},

	getSize: function(){
		if (isBody(this)) return this.getWindow().getSize();
		return {x: this.offsetWidth, y: this.offsetHeight};
	},

	getScrollSize: function(){
		if (isBody(this)) return this.getWindow().getScrollSize();
		return {x: this.scrollWidth, y: this.scrollHeight};
	},

	getScroll: function(){
		if (isBody(this)) return this.getWindow().getScroll();
		return {x: this.scrollLeft, y: this.scrollTop};
	},

	getScrolls: function(){
		var element = this.parentNode, position = {x: 0, y: 0};
		while (element && !isBody(element)){
			position.x += element.scrollLeft;
			position.y += element.scrollTop;
			element = element.parentNode;
		}
		return position;
	},

	getOffsetParent: brokenOffsetParent ? function(){
		var element = this;
		if (isBody(element) || styleString(element, 'position') == 'fixed') return null;

		var isOffsetCheck = (styleString(element, 'position') == 'static') ? isOffsetStatic : isOffset;
		while ((element = element.parentNode)){
			if (isOffsetCheck(element)) return element;
		}
		return null;
	} : function(){
		var element = this;
		if (isBody(element) || styleString(element, 'position') == 'fixed') return null;

		try {
			return element.offsetParent;
		} catch(e) {}
		return null;
	},

	getOffsets: function(){
		if (this.getBoundingClientRect && !Browser.Platform.ios){
			var bound = this.getBoundingClientRect(),
				html = document.id(this.getDocument().documentElement),
				htmlScroll = html.getScroll(),
				elemScrolls = this.getScrolls(),
				isFixed = (styleString(this, 'position') == 'fixed');

			return {
				x: bound.left.toInt() + elemScrolls.x + ((isFixed) ? 0 : htmlScroll.x) - html.clientLeft,
				y: bound.top.toInt()  + elemScrolls.y + ((isFixed) ? 0 : htmlScroll.y) - html.clientTop
			};
		}

		var element = this, position = {x: 0, y: 0};
		if (isBody(this)) return position;

		while (element && !isBody(element)){
			position.x += element.offsetLeft;
			position.y += element.offsetTop;

			if (Browser.firefox){
				if (!borderBox(element)){
					position.x += leftBorder(element);
					position.y += topBorder(element);
				}
				var parent = element.parentNode;
				if (parent && styleString(parent, 'overflow') != 'visible'){
					position.x += leftBorder(parent);
					position.y += topBorder(parent);
				}
			} else if (element != this && Browser.safari){
				position.x += leftBorder(element);
				position.y += topBorder(element);
			}

			element = element.offsetParent;
		}
		if (Browser.firefox && !borderBox(this)){
			position.x -= leftBorder(this);
			position.y -= topBorder(this);
		}
		return position;
	},

	getPosition: function(relative){
		var offset = this.getOffsets(),
			scroll = this.getScrolls();
		var position = {
			x: offset.x - scroll.x,
			y: offset.y - scroll.y
		};

		if (relative && (relative = document.id(relative))){
			var relativePosition = relative.getPosition();
			return {x: position.x - relativePosition.x - leftBorder(relative), y: position.y - relativePosition.y - topBorder(relative)};
		}
		return position;
	},

	getCoordinates: function(element){
		if (isBody(this)) return this.getWindow().getCoordinates();
		var position = this.getPosition(element),
			size = this.getSize();
		var obj = {
			left: position.x,
			top: position.y,
			width: size.x,
			height: size.y
		};
		obj.right = obj.left + obj.width;
		obj.bottom = obj.top + obj.height;
		return obj;
	},

	computePosition: function(obj){
		return {
			left: obj.x - styleNumber(this, 'margin-left'),
			top: obj.y - styleNumber(this, 'margin-top')
		};
	},

	setPosition: function(obj){
		return this.setStyles(this.computePosition(obj));
	}

});


[Document, Window].invoke('implement', {

	getSize: function(){
		var doc = getCompatElement(this);
		return {x: doc.clientWidth, y: doc.clientHeight};
	},

	getScroll: function(){
		var win = this.getWindow(), doc = getCompatElement(this);
		return {x: win.pageXOffset || doc.scrollLeft, y: win.pageYOffset || doc.scrollTop};
	},

	getScrollSize: function(){
		var doc = getCompatElement(this),
			min = this.getSize(),
			body = this.getDocument().body;

		return {x: Math.max(doc.scrollWidth, body.scrollWidth, min.x), y: Math.max(doc.scrollHeight, body.scrollHeight, min.y)};
	},

	getPosition: function(){
		return {x: 0, y: 0};
	},

	getCoordinates: function(){
		var size = this.getSize();
		return {top: 0, left: 0, bottom: size.y, right: size.x, height: size.y, width: size.x};
	}

});

// private methods

var styleString = Element.getComputedStyle;

function styleNumber(element, style){
	return styleString(element, style).toInt() || 0;
}

function borderBox(element){
	return styleString(element, '-moz-box-sizing') == 'border-box';
}

function topBorder(element){
	return styleNumber(element, 'border-top-width');
}

function leftBorder(element){
	return styleNumber(element, 'border-left-width');
}

function isBody(element){
	return (/^(?:body|html)$/i).test(element.tagName);
}

function getCompatElement(element){
	var doc = element.getDocument();
	return (!doc.compatMode || doc.compatMode == 'CSS1Compat') ? doc.html : doc.body;
}

})();

//aliases
Element.alias({position: 'setPosition'}); //compatability

[Window, Document, Element].invoke('implement', {

	getHeight: function(){
		return this.getSize().y;
	},

	getWidth: function(){
		return this.getSize().x;
	},

	getScrollTop: function(){
		return this.getScroll().y;
	},

	getScrollLeft: function(){
		return this.getScroll().x;
	},

	getScrollHeight: function(){
		return this.getScrollSize().y;
	},

	getScrollWidth: function(){
		return this.getScrollSize().x;
	},

	getTop: function(){
		return this.getPosition().y;
	},

	getLeft: function(){
		return this.getPosition().x;
	}

});


/*
---

name: Fx

description: Contains the basic animation logic to be extended by all other Fx Classes.

license: MIT-style license.

requires: [Chain, Events, Options]

provides: Fx

...
*/

(function(){

var Fx = this.Fx = new Class({

	Implements: [Chain, Events, Options],

	options: {
		/*
		onStart: nil,
		onCancel: nil,
		onComplete: nil,
		*/
		fps: 60,
		unit: false,
		duration: 500,
		frames: null,
		frameSkip: true,
		link: 'ignore'
	},

	initialize: function(options){
		this.subject = this.subject || this;
		this.setOptions(options);
	},

	getTransition: function(){
		return function(p){
			return -(Math.cos(Math.PI * p) - 1) / 2;
		};
	},

	step: function(now){
		if (this.options.frameSkip){
			var diff = (this.time != null) ? (now - this.time) : 0, frames = diff / this.frameInterval;
			this.time = now;
			this.frame += frames;
		} else {
			this.frame++;
		}

		if (this.frame < this.frames){
			var delta = this.transition(this.frame / this.frames);
			this.set(this.compute(this.from, this.to, delta));
		} else {
			this.frame = this.frames;
			this.set(this.compute(this.from, this.to, 1));
			this.stop();
		}
	},

	set: function(now){
		return now;
	},

	compute: function(from, to, delta){
		return Fx.compute(from, to, delta);
	},

	check: function(){
		if (!this.isRunning()) return true;
		switch (this.options.link){
			case 'cancel': this.cancel(); return true;
			case 'chain': this.chain(this.caller.pass(arguments, this)); return false;
		}
		return false;
	},

	start: function(from, to){
		if (!this.check(from, to)) return this;
		this.from = from;
		this.to = to;
		this.frame = (this.options.frameSkip) ? 0 : -1;
		this.time = null;
		this.transition = this.getTransition();
		var frames = this.options.frames, fps = this.options.fps, duration = this.options.duration;
		this.duration = Fx.Durations[duration] || duration.toInt();
		this.frameInterval = 1000 / fps;
		this.frames = frames || Math.round(this.duration / this.frameInterval);
		this.fireEvent('start', this.subject);
		pushInstance.call(this, fps);
		return this;
	},

	stop: function(){
		if (this.isRunning()){
			this.time = null;
			pullInstance.call(this, this.options.fps);
			if (this.frames == this.frame){
				this.fireEvent('complete', this.subject);
				if (!this.callChain()) this.fireEvent('chainComplete', this.subject);
			} else {
				this.fireEvent('stop', this.subject);
			}
		}
		return this;
	},

	cancel: function(){
		if (this.isRunning()){
			this.time = null;
			pullInstance.call(this, this.options.fps);
			this.frame = this.frames;
			this.fireEvent('cancel', this.subject).clearChain();
		}
		return this;
	},

	pause: function(){
		if (this.isRunning()){
			this.time = null;
			pullInstance.call(this, this.options.fps);
		}
		return this;
	},

	resume: function(){
		if ((this.frame < this.frames) && !this.isRunning()) pushInstance.call(this, this.options.fps);
		return this;
	},

	isRunning: function(){
		var list = instances[this.options.fps];
		return list && list.contains(this);
	}

});

Fx.compute = function(from, to, delta){
	return (to - from) * delta + from;
};

Fx.Durations = {'short': 250, 'normal': 500, 'long': 1000};

// global timers

var instances = {}, timers = {};

var loop = function(){
	var now = Date.now();
	for (var i = this.length; i--;){
		var instance = this[i];
		if (instance) instance.step(now);
	}
};

var pushInstance = function(fps){
	var list = instances[fps] || (instances[fps] = []);
	list.push(this);
	if (!timers[fps]) timers[fps] = loop.periodical(Math.round(1000 / fps), list);
};

var pullInstance = function(fps){
	var list = instances[fps];
	if (list){
		list.erase(this);
		if (!list.length && timers[fps]){
			delete instances[fps];
			timers[fps] = clearInterval(timers[fps]);
		}
	}
};

})();


/*
---

name: Fx.CSS

description: Contains the CSS animation logic. Used by Fx.Tween, Fx.Morph, Fx.Elements.

license: MIT-style license.

requires: [Fx, Element.Style]

provides: Fx.CSS

...
*/

Fx.CSS = new Class({

	Extends: Fx,

	//prepares the base from/to object

	prepare: function(element, property, values){
		values = Array.from(values);
		var from = values[0], to = values[1];
		if (to == null){
			to = from;
			from = element.getStyle(property);
			var unit = this.options.unit;
			// adapted from: https://github.com/ryanmorr/fx/blob/master/fx.js#L299
			if (unit && from.slice(-unit.length) != unit && parseFloat(from) != 0){
				element.setStyle(property, to + unit);
				var value = element.getComputedStyle(property);
				// IE and Opera support pixelLeft or pixelWidth
				if (!(/px$/.test(value))){
					value = element.style[('pixel-' + property).camelCase()];
					if (value == null){
						// adapted from Dean Edwards' http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291
						var left = element.style.left;
						element.style.left = to + unit;
						value = element.style.pixelLeft;
						element.style.left = left;
					}
				}
				from = (to || 1) / (parseFloat(value) || 1) * (parseFloat(from) || 0);
				element.setStyle(property, from + unit);
			}
		}
		return {from: this.parse(from), to: this.parse(to)};
	},

	//parses a value into an array

	parse: function(value){
		value = Function.from(value)();
		value = (typeof value == 'string') ? value.split(' ') : Array.from(value);
		return value.map(function(val){
			val = String(val);
			var found = false;
			Object.each(Fx.CSS.Parsers, function(parser, key){
				if (found) return;
				var parsed = parser.parse(val);
				if (parsed || parsed === 0) found = {value: parsed, parser: parser};
			});
			found = found || {value: val, parser: Fx.CSS.Parsers.String};
			return found;
		});
	},

	//computes by a from and to prepared objects, using their parsers.

	compute: function(from, to, delta){
		var computed = [];
		(Math.min(from.length, to.length)).times(function(i){
			computed.push({value: from[i].parser.compute(from[i].value, to[i].value, delta), parser: from[i].parser});
		});
		computed.$family = Function.from('fx:css:value');
		return computed;
	},

	//serves the value as settable

	serve: function(value, unit){
		if (typeOf(value) != 'fx:css:value') value = this.parse(value);
		var returned = [];
		value.each(function(bit){
			returned = returned.concat(bit.parser.serve(bit.value, unit));
		});
		return returned;
	},

	//renders the change to an element

	render: function(element, property, value, unit){
		element.setStyle(property, this.serve(value, unit));
	},

	//searches inside the page css to find the values for a selector

	search: function(selector){
		if (Fx.CSS.Cache[selector]) return Fx.CSS.Cache[selector];
		var to = {}, selectorTest = new RegExp('^' + selector.escapeRegExp() + '$');
		Array.each(document.styleSheets, function(sheet, j){
			var href = sheet.href;
			if (href && href.contains('://') && !href.contains(document.domain)) return;
			var rules = sheet.rules || sheet.cssRules;
			Array.each(rules, function(rule, i){
				if (!rule.style) return;
				var selectorText = (rule.selectorText) ? rule.selectorText.replace(/^\w+/, function(m){
					return m.toLowerCase();
				}) : null;
				if (!selectorText || !selectorTest.test(selectorText)) return;
				Object.each(Element.Styles, function(value, style){
					if (!rule.style[style] || Element.ShortStyles[style]) return;
					value = String(rule.style[style]);
					to[style] = ((/^rgb/).test(value)) ? value.rgbToHex() : value;
				});
			});
		});
		return Fx.CSS.Cache[selector] = to;
	}

});

Fx.CSS.Cache = {};

Fx.CSS.Parsers = {

	Color: {
		parse: function(value){
			if (value.match(/^#[0-9a-f]{3,6}$/i)) return value.hexToRgb(true);
			return ((value = value.match(/(\d+),\s*(\d+),\s*(\d+)/))) ? [value[1], value[2], value[3]] : false;
		},
		compute: function(from, to, delta){
			return from.map(function(value, i){
				return Math.round(Fx.compute(from[i], to[i], delta));
			});
		},
		serve: function(value){
			return value.map(Number);
		}
	},

	Number: {
		parse: parseFloat,
		compute: Fx.compute,
		serve: function(value, unit){
			return (unit) ? value + unit : value;
		}
	},

	String: {
		parse: Function.from(false),
		compute: function(zero, one){
			return one;
		},
		serve: function(zero){
			return zero;
		}
	}

};

//<1.2compat>

// Fx.CSS.Parsers = new Hash(Fx.CSS.Parsers);

//</1.2compat>


/*
---

name: Fx.Tween

description: Formerly Fx.Style, effect to transition any CSS property for an element.

license: MIT-style license.

requires: Fx.CSS

provides: [Fx.Tween, Element.fade, Element.highlight]

...
*/

Fx.Tween = new Class({

	Extends: Fx.CSS,

	initialize: function(element, options){
		this.element = this.subject = document.id(element);
		this.parent(options);
	},

	set: function(property, now){
		if (arguments.length == 1){
			now = property;
			property = this.property || this.options.property;
		}
		this.render(this.element, property, now, this.options.unit);
		return this;
	},

	start: function(property, from, to){
		if (!this.check(property, from, to)) return this;
		var args = Array.flatten(arguments);
		this.property = this.options.property || args.shift();
		var parsed = this.prepare(this.element, this.property, args);
		return this.parent(parsed.from, parsed.to);
	}

});

Element.Properties.tween = {

	set: function(options){
		this.get('tween').cancel().setOptions(options);
		return this;
	},

	get: function(){
		var tween = this.retrieve('tween');
		if (!tween){
			tween = new Fx.Tween(this, {link: 'cancel'});
			this.store('tween', tween);
		}
		return tween;
	}

};

Element.implement({

	tween: function(property, from, to){
		this.get('tween').start(property, from, to);
		return this;
	},

	fade: function(how){
		var fade = this.get('tween'), method, args = ['opacity'].append(arguments), toggle;
		if (args[1] == null) args[1] = 'toggle';
		switch (args[1]){
			case 'in': method = 'start'; args[1] = 1; break;
			case 'out': method = 'start'; args[1] = 0; break;
			case 'show': method = 'set'; args[1] = 1; break;
			case 'hide': method = 'set'; args[1] = 0; break;
			case 'toggle':
				var flag = this.retrieve('fade:flag', this.getStyle('opacity') == 1);
				method = 'start';
				args[1] = flag ? 0 : 1;
				this.store('fade:flag', !flag);
				toggle = true;
			break;
			default: method = 'start';
		}
		if (!toggle) this.eliminate('fade:flag');
		fade[method].apply(fade, args);
		var to = args[args.length - 1];
		if (method == 'set' || to != 0) this.setStyle('visibility', to == 0 ? 'hidden' : 'visible');
		else fade.chain(function(){
			this.element.setStyle('visibility', 'hidden');
			this.callChain();
		});
		return this;
	},

	highlight: function(start, end){
		if (!end){
			end = this.retrieve('highlight:original', this.getStyle('background-color'));
			end = (end == 'transparent') ? '#fff' : end;
		}
		var tween = this.get('tween');
		tween.start('background-color', start || '#ffff88', end).chain(function(){
			this.setStyle('background-color', this.retrieve('highlight:original'));
			tween.callChain();
		}.bind(this));
		return this;
	}

});


/*
---

name: Fx.Morph

description: Formerly Fx.Styles, effect to transition any number of CSS properties for an element using an object of rules, or CSS based selector rules.

license: MIT-style license.

requires: Fx.CSS

provides: Fx.Morph

...
*/

Fx.Morph = new Class({

	Extends: Fx.CSS,

	initialize: function(element, options){
		this.element = this.subject = document.id(element);
		this.parent(options);
	},

	set: function(now){
		if (typeof now == 'string') now = this.search(now);
		for (var p in now) this.render(this.element, p, now[p], this.options.unit);
		return this;
	},

	compute: function(from, to, delta){
		var now = {};
		for (var p in from) now[p] = this.parent(from[p], to[p], delta);
		return now;
	},

	start: function(properties){
		if (!this.check(properties)) return this;
		if (typeof properties == 'string') properties = this.search(properties);
		var from = {}, to = {};
		for (var p in properties){
			var parsed = this.prepare(this.element, p, properties[p]);
			from[p] = parsed.from;
			to[p] = parsed.to;
		}
		return this.parent(from, to);
	}

});

Element.Properties.morph = {

	set: function(options){
		this.get('morph').cancel().setOptions(options);
		return this;
	},

	get: function(){
		var morph = this.retrieve('morph');
		if (!morph){
			morph = new Fx.Morph(this, {link: 'cancel'});
			this.store('morph', morph);
		}
		return morph;
	}

};

Element.implement({

	morph: function(props){
		this.get('morph').start(props);
		return this;
	}

});


/*
---

name: Fx.Transitions

description: Contains a set of advanced transitions to be used with any of the Fx Classes.

license: MIT-style license.

credits:
  - Easing Equations by Robert Penner, <http://www.robertpenner.com/easing/>, modified and optimized to be used with MooTools.

requires: Fx

provides: Fx.Transitions

...
*/

Fx.implement({

	getTransition: function(){
		var trans = this.options.transition || Fx.Transitions.Sine.easeInOut;
		if (typeof trans == 'string'){
			var data = trans.split(':');
			trans = Fx.Transitions;
			trans = trans[data[0]] || trans[data[0].capitalize()];
			if (data[1]) trans = trans['ease' + data[1].capitalize() + (data[2] ? data[2].capitalize() : '')];
		}
		return trans;
	}

});

Fx.Transition = function(transition, params){
	params = Array.from(params);
	var easeIn = function(pos){
		return transition(pos, params);
	};
	return Object.append(easeIn, {
		easeIn: easeIn,
		easeOut: function(pos){
			return 1 - transition(1 - pos, params);
		},
		easeInOut: function(pos){
			return (pos <= 0.5 ? transition(2 * pos, params) : (2 - transition(2 * (1 - pos), params))) / 2;
		}
	});
};

Fx.Transitions = {

	linear: function(zero){
		return zero;
	}

};

//<1.2compat>

// Fx.Transitions = new Hash(Fx.Transitions);

//</1.2compat>

Fx.Transitions.extend = function(transitions){
	for (var transition in transitions) Fx.Transitions[transition] = new Fx.Transition(transitions[transition]);
};

Fx.Transitions.extend({

	Pow: function(p, x){
		return Math.pow(p, x && x[0] || 6);
	},

	Expo: function(p){
		return Math.pow(2, 8 * (p - 1));
	},

	Circ: function(p){
		return 1 - Math.sin(Math.acos(p));
	},

	Sine: function(p){
		return 1 - Math.cos(p * Math.PI / 2);
	},

	Back: function(p, x){
		x = x && x[0] || 1.618;
		return Math.pow(p, 2) * ((x + 1) * p - x);
	},

	Bounce: function(p){
		var value;
		for (var a = 0, b = 1; 1; a += b, b /= 2){
			if (p >= (7 - 4 * a) / 11){
				value = b * b - Math.pow((11 - 6 * a - 11 * p) / 4, 2);
				break;
			}
		}
		return value;
	},

	Elastic: function(p, x){
		return Math.pow(2, 10 * --p) * Math.cos(20 * p * Math.PI * (x && x[0] || 1) / 3);
	}

});

['Quad', 'Cubic', 'Quart', 'Quint'].each(function(transition, i){
	Fx.Transitions[transition] = new Fx.Transition(function(p){
		return Math.pow(p, i + 2);
	});
});


/*
---

name: Request

description: Powerful all purpose Request Class. Uses XMLHTTPRequest.

license: MIT-style license.

requires: [Object, Element, Chain, Events, Options, Browser]

provides: Request

...
*/

(function(){

var empty = function(){},
	progressSupport = ('onprogress' in new Browser.Request);

var Request = this.Request = new Class({

	Implements: [Chain, Events, Options],

	options: {/*
		onRequest: function(){},
		onLoadstart: function(event, xhr){},
		onProgress: function(event, xhr){},
		onComplete: function(){},
		onCancel: function(){},
		onSuccess: function(responseText, responseXML){},
		onFailure: function(xhr){},
		onException: function(headerName, value){},
		onTimeout: function(){},
		user: '',
		password: '',*/
		url: '',
		data: '',
		headers: {
			'X-Requested-With': 'XMLHttpRequest',
			'Accept': 'text/javascript, text/html, application/xml, text/xml, */*'
		},
		async: true,
		format: false,
		method: 'post',
		link: 'ignore',
		isSuccess: null,
		emulation: true,
		urlEncoded: true,
		encoding: 'utf-8',
		evalScripts: false,
		evalResponse: false,
		timeout: 0,
		noCache: false
	},

	initialize: function(options){
		this.xhr = new Browser.Request();
		this.setOptions(options);
		this.headers = this.options.headers;
	},

	onStateChange: function(){
		var xhr = this.xhr;
		if (xhr.readyState != 4 || !this.running) return;
		this.running = false;
		this.status = 0;
		Function.attempt(function(){
			var status = xhr.status;
			this.status = (status == 1223) ? 204 : status;
		}.bind(this));
		xhr.onreadystatechange = empty;
		if (progressSupport) xhr.onprogress = xhr.onloadstart = empty;
		clearTimeout(this.timer);

		this.response = {text: this.xhr.responseText || '', xml: this.xhr.responseXML};
		if (this.options.isSuccess.call(this, this.status))
			this.success(this.response.text, this.response.xml);
		else
			this.failure();
	},

	isSuccess: function(){
		var status = this.status;
		return (status >= 200 && status < 300);
	},

	isRunning: function(){
		return !!this.running;
	},

	processScripts: function(text){
		if (this.options.evalResponse || (/(ecma|java)script/).test(this.getHeader('Content-type'))) return Browser.exec(text);
		return text.stripScripts(this.options.evalScripts);
	},

	success: function(text, xml){
		this.onSuccess(this.processScripts(text), xml);
	},

	onSuccess: function(){
		this.fireEvent('complete', arguments).fireEvent('success', arguments).callChain();
	},

	failure: function(){
		this.onFailure();
	},

	onFailure: function(){
		this.fireEvent('complete').fireEvent('failure', this.xhr);
	},

	loadstart: function(event){
		this.fireEvent('loadstart', [event, this.xhr]);
	},

	progress: function(event){
		this.fireEvent('progress', [event, this.xhr]);
	},

	timeout: function(){
		this.fireEvent('timeout', this.xhr);
	},

	setHeader: function(name, value){
		this.headers[name] = value;
		return this;
	},

	getHeader: function(name){
		return Function.attempt(function(){
			return this.xhr.getResponseHeader(name);
		}.bind(this));
	},

	check: function(){
		if (!this.running) return true;
		switch (this.options.link){
			case 'cancel': this.cancel(); return true;
			case 'chain': this.chain(this.caller.pass(arguments, this)); return false;
		}
		return false;
	},

	send: function(options){
		if (!this.check(options)) return this;

		this.options.isSuccess = this.options.isSuccess || this.isSuccess;
		this.running = true;

		var type = typeOf(options);
		if (type == 'string' || type == 'element') options = {data: options};

		var old = this.options;
		options = Object.append({data: old.data, url: old.url, method: old.method}, options);
		var data = options.data, url = String(options.url), method = options.method.toLowerCase();

		switch (typeOf(data)){
			case 'element': data = document.id(data).toQueryString(); break;
			case 'object': case 'hash': data = Object.toQueryString(data);
		}

		if (this.options.format){
			var format = 'format=' + this.options.format;
			data = (data) ? format + '&' + data : format;
		}

		if (this.options.emulation && !['get', 'post'].contains(method)){
			var _method = '_method=' + method;
			data = (data) ? _method + '&' + data : _method;
			method = 'post';
		}

		if (this.options.urlEncoded && ['post', 'put'].contains(method)){
			var encoding = (this.options.encoding) ? '; charset=' + this.options.encoding : '';
			this.headers['Content-type'] = 'application/x-www-form-urlencoded' + encoding;
		}

		if (!url) url = document.location.pathname;

		var trimPosition = url.lastIndexOf('/');
		if (trimPosition > -1 && (trimPosition = url.indexOf('#')) > -1) url = url.substr(0, trimPosition);

		if (this.options.noCache)
			url += (url.contains('?') ? '&' : '?') + String.uniqueID();

		if (data && method == 'get'){
			url += (url.contains('?') ? '&' : '?') + data;
			data = null;
		}

		var xhr = this.xhr;
		if (progressSupport){
			xhr.onloadstart = this.loadstart.bind(this);
			xhr.onprogress = this.progress.bind(this);
		}

		xhr.open(method.toUpperCase(), url, this.options.async, this.options.user, this.options.password);
		if (this.options.user && 'withCredentials' in xhr) xhr.withCredentials = true;

		xhr.onreadystatechange = this.onStateChange.bind(this);

		Object.each(this.headers, function(value, key){
			try {
				xhr.setRequestHeader(key, value);
			} catch (e){
				this.fireEvent('exception', [key, value]);
			}
		}, this);

		this.fireEvent('request');
		xhr.send(data);
		if (!this.options.async) this.onStateChange();
		else if (this.options.timeout) this.timer = this.timeout.delay(this.options.timeout, this);
		return this;
	},

	cancel: function(){
		if (!this.running) return this;
		this.running = false;
		var xhr = this.xhr;
		xhr.abort();
		clearTimeout(this.timer);
		xhr.onreadystatechange = empty;
		if (progressSupport) xhr.onprogress = xhr.onloadstart = empty;
		this.xhr = new Browser.Request();
		this.fireEvent('cancel');
		return this;
	}

});

var methods = {};
['get', 'post', 'put', 'delete', 'GET', 'POST', 'PUT', 'DELETE'].each(function(method){
	methods[method] = function(data){
		var object = {
			method: method
		};
		if (data != null) object.data = data;
		return this.send(object);
	};
});

Request.implement(methods);

Element.Properties.send = {

	set: function(options){
		var send = this.get('send').cancel();
		send.setOptions(options);
		return this;
	},

	get: function(){
		var send = this.retrieve('send');
		if (!send){
			send = new Request({
				data: this, link: 'cancel', method: this.get('method') || 'post', url: this.get('action')
			});
			this.store('send', send);
		}
		return send;
	}

};

Element.implement({

	send: function(url){
		var sender = this.get('send');
		sender.send({data: this, url: url || sender.options.url});
		return this;
	}

});

})();


/*
---

name: Request.HTML

description: Extends the basic Request Class with additional methods for interacting with HTML responses.

license: MIT-style license.

requires: [Element, Request]

provides: Request.HTML

...
*/

Request.HTML = new Class({

	Extends: Request,

	options: {
		update: false,
		append: false,
		evalScripts: true,
		filter: false,
		headers: {
			Accept: 'text/html, application/xml, text/xml, */*'
		}
	},

	success: function(text){
		var options = this.options, response = this.response;

		response.html = text.stripScripts(function(script){
			response.javascript = script;
		});

		var match = response.html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
		if (match) response.html = match[1];
		var temp = new Element('div').set('html', response.html);

		response.tree = temp.childNodes;
		response.elements = temp.getElements(options.filter || '*');

		if (options.filter) response.tree = response.elements;
		if (options.update){
			var update = document.id(options.update).empty();
			if (options.filter) update.adopt(response.elements);
			else update.set('html', response.html);
		} else if (options.append){
			var append = document.id(options.append);
			if (options.filter) response.elements.reverse().inject(append);
			else append.adopt(temp.getChildren());
		}
		if (options.evalScripts) Browser.exec(response.javascript);

		this.onSuccess(response.tree, response.elements, response.html, response.javascript);
	}

});

Element.Properties.load = {

	set: function(options){
		var load = this.get('load').cancel();
		load.setOptions(options);
		return this;
	},

	get: function(){
		var load = this.retrieve('load');
		if (!load){
			load = new Request.HTML({data: this, link: 'cancel', update: this, method: 'get'});
			this.store('load', load);
		}
		return load;
	}

};

Element.implement({

	load: function(){
		this.get('load').send(Array.link(arguments, {data: Type.isObject, url: Type.isString}));
		return this;
	}

});


/*
---

name: JSON

description: JSON encoder and decoder.

license: MIT-style license.

SeeAlso: <http://www.json.org/>

requires: [Array, String, Number, Function]

provides: JSON

...
*/

if (typeof JSON == 'undefined') this.JSON = {};

//<1.2compat>

// JSON = {
// 	stringify: JSON.stringify,
// 	parse: JSON.parse
// };

//</1.2compat>

(function(){

var special = {'\b': '\\b', '\t': '\\t', '\n': '\\n', '\f': '\\f', '\r': '\\r', '"' : '\\"', '\\': '\\\\'};

var escape = function(chr){
	return special[chr] || '\\u' + ('0000' + chr.charCodeAt(0).toString(16)).slice(-4);
};

JSON.validate = function(string){
	string = string.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').
					replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
					replace(/(?:^|:|,)(?:\s*\[)+/g, '');

	return (/^[\],:{}\s]*$/).test(string);
};

JSON.encode = JSON.stringify ? function(obj){
	return JSON.stringify(obj);
} : function(obj){
	if (obj && obj.toJSON) obj = obj.toJSON();

	switch (typeOf(obj)){
		case 'string':
			return '"' + obj.replace(/[\x00-\x1f\\"]/g, escape) + '"';
		case 'array':
			return '[' + obj.map(JSON.encode).clean() + ']';
		case 'object': case 'hash':
			var string = [];
			Object.each(obj, function(value, key){
				var json = JSON.encode(value);
				if (json) string.push(JSON.encode(key) + ':' + json);
			});
			return '{' + string + '}';
		case 'number': case 'boolean': return '' + obj;
		case 'null': return 'null';
	}

	return null;
};

JSON.decode = function(string, secure){
	if (!string || typeOf(string) != 'string') return null;

	if (secure || JSON.secure){
		if (JSON.parse) return JSON.parse(string);
		if (!JSON.validate(string)) throw new Error('JSON could not decode the input; security is enabled and the value is not secure.');
	}

	return eval('(' + string + ')');
};

})();


/*
---

name: Request.JSON

description: Extends the basic Request Class with additional methods for sending and receiving JSON data.

license: MIT-style license.

requires: [Request, JSON]

provides: Request.JSON

...
*/

Request.JSON = new Class({

	Extends: Request,

	options: {
		/*onError: function(text, error){},*/
		secure: true
	},

	initialize: function(options){
		this.parent(options);
		Object.append(this.headers, {
			'Accept': 'application/json',
			'X-Request': 'JSON'
		});
	},

	success: function(text){
		var json;
		try {
			json = this.response.json = JSON.decode(text, this.options.secure);
		} catch (error){
			this.fireEvent('error', [text, error]);
			return;
		}
		if (json == null) this.onFailure();
		else this.onSuccess(json, text);
	}

});


/*
---

name: Cookie

description: Class for creating, reading, and deleting browser Cookies.

license: MIT-style license.

credits:
  - Based on the functions by Peter-Paul Koch (http://quirksmode.org).

requires: [Options, Browser]

provides: Cookie

...
*/

var Cookie = new Class({

	Implements: Options,

	options: {
		path: '/',
		domain: false,
		duration: false,
		secure: false,
		document: document,
		encode: true
	},

	initialize: function(key, options){
		this.key = key;
		this.setOptions(options);
	},

	write: function(value){
		if (this.options.encode) value = encodeURIComponent(value);
		if (this.options.domain) value += '; domain=' + this.options.domain;
		if (this.options.path) value += '; path=' + this.options.path;
		if (this.options.duration){
			var date = new Date();
			date.setTime(date.getTime() + this.options.duration * 24 * 60 * 60 * 1000);
			value += '; expires=' + date.toGMTString();
		}
		if (this.options.secure) value += '; secure';
		this.options.document.cookie = this.key + '=' + value;
		return this;
	},

	read: function(){
		var value = this.options.document.cookie.match('(?:^|;)\\s*' + this.key.escapeRegExp() + '=([^;]*)');
		return (value) ? decodeURIComponent(value[1]) : null;
	},

	dispose: function(){
		new Cookie(this.key, Object.merge({}, this.options, {duration: -1})).write('');
		return this;
	}

});

Cookie.write = function(key, value, options){
	return new Cookie(key, options).write(value);
};

Cookie.read = function(key){
	return new Cookie(key).read();
};

Cookie.dispose = function(key, options){
	return new Cookie(key, options).dispose();
};


/*
---

name: DOMReady

description: Contains the custom event domready.

license: MIT-style license.

requires: [Browser, Element, Element.Event]

provides: [DOMReady, DomReady]

...
*/

(function(window, document){

var ready,
	loaded,
	checks = [],
	shouldPoll,
	timer,
	testElement = document.createElement('div');

var domready = function(){
	clearTimeout(timer);
	if (ready) return;
	Browser.loaded = ready = true;
	document.removeListener('DOMContentLoaded', domready).removeListener('readystatechange', check);

	document.fireEvent('domready');
	window.fireEvent('domready');
};

var check = function(){
	for (var i = checks.length; i--;) if (checks[i]()){
		domready();
		return true;
	}
	return false;
};

var poll = function(){
	clearTimeout(timer);
	if (!check()) timer = setTimeout(poll, 10);
};

document.addListener('DOMContentLoaded', domready);

/*<ltIE8>*/
// doScroll technique by Diego Perini http://javascript.nwbox.com/IEContentLoaded/
// testElement.doScroll() throws when the DOM is not ready, only in the top window
var doScrollWorks = function(){
	try {
		testElement.doScroll();
		return true;
	} catch (e){}
	return false;
};
// If doScroll works already, it can't be used to determine domready
//   e.g. in an iframe
if (testElement.doScroll && !doScrollWorks()){
	checks.push(doScrollWorks);
	shouldPoll = true;
}
/*</ltIE8>*/

if (document.readyState) checks.push(function(){
	var state = document.readyState;
	return (state == 'loaded' || state == 'complete');
});

if ('onreadystatechange' in document) document.addListener('readystatechange', check);
else shouldPoll = true;

if (shouldPoll) poll();

Element.Events.domready = {
	onAdd: function(fn){
		if (ready) fn.call(this);
	}
};

// Make sure that domready fires before load
Element.Events.load = {
	base: 'load',
	onAdd: function(fn){
		if (loaded && this == window) fn.call(this);
	},
	condition: function(){
		if (this == window){
			domready();
			delete Element.Events.load;
		}
		return true;
	}
};

// This is based on the custom load event
window.addEvent('load', function(){
	loaded = true;
});

})(window, document);


/*
---

name: Swiff

description: Wrapper for embedding SWF movies. Supports External Interface Communication.

license: MIT-style license.

credits:
  - Flash detection & Internet Explorer + Flash Player 9 fix inspired by SWFObject.

requires: [Options, Object, Element]

provides: Swiff

...
*/

(function(){

var Swiff = this.Swiff = new Class({

	Implements: Options,

	options: {
		id: null,
		height: 1,
		width: 1,
		container: null,
		properties: {},
		params: {
			quality: 'high',
			allowScriptAccess: 'always',
			wMode: 'window',
			swLiveConnect: true
		},
		callBacks: {},
		vars: {}
	},

	toElement: function(){
		return this.object;
	},

	initialize: function(path, options){
		this.instance = 'Swiff_' + String.uniqueID();

		this.setOptions(options);
		options = this.options;
		var id = this.id = options.id || this.instance;
		var container = document.id(options.container);

		Swiff.CallBacks[this.instance] = {};

		var params = options.params, vars = options.vars, callBacks = options.callBacks;
		var properties = Object.append({height: options.height, width: options.width}, options.properties);

		var self = this;

		for (var callBack in callBacks){
			Swiff.CallBacks[this.instance][callBack] = (function(option){
				return function(){
					return option.apply(self.object, arguments);
				};
			})(callBacks[callBack]);
			vars[callBack] = 'Swiff.CallBacks.' + this.instance + '.' + callBack;
		}

		params.flashVars = Object.toQueryString(vars);
		if (Browser.ie){
			properties.classid = 'clsid:D27CDB6E-AE6D-11cf-96B8-444553540000';
			params.movie = path;
		} else {
			properties.type = 'application/x-shockwave-flash';
		}
		properties.data = path;

		var build = '<object id="' + id + '"';
		for (var property in properties) build += ' ' + property + '="' + properties[property] + '"';
		build += '>';
		for (var param in params){
			if (params[param]) build += '<param name="' + param + '" value="' + params[param] + '" />';
		}
		build += '</object>';
		this.object = ((container) ? container.empty() : new Element('div')).set('html', build).firstChild;
	},

	replaces: function(element){
		element = document.id(element, true);
		element.parentNode.replaceChild(this.toElement(), element);
		return this;
	},

	inject: function(element){
		document.id(element, true).appendChild(this.toElement());
		return this;
	},

	remote: function(){
		return Swiff.remote.apply(Swiff, [this.toElement()].append(arguments));
	}

});

Swiff.CallBacks = {};

Swiff.remote = function(obj, fn){
	var rs = obj.CallFunction('<invoke name="' + fn + '" returntype="javascript">' + __flash__argumentsToXML(arguments, 2) + '</invoke>');
	return eval(rs);
};

})();


//made a couple bug fixes and changes such as for issue #1205

// MooTools: the javascript framework.
// Load this file's selection again by visiting: http://mootools.net/more/35e6a5fbeab78380421c63debfce3b7c 
// Or build this file again with packager using: packager build More/Event.Pseudos More.Element.Event.Pseudos More/Class.Refactor More/Class.Binds More/Date More/Hash More/Elements.From More/Element.Measure More/Element.Forms More/Fx.Elements More/Fx.Accordion More/Fx.Move More/Fx.Reveal More/Fx.Scroll More/Fx.Slide More/Drag More/Drag.Move More/Slider More/Assets More/Color More/Keyboard More/Keyboard.Extras
/*
---

script: More.js

name: More

description: MooTools More

license: MIT-style license

authors:
  - Guillermo Rauch
  - Thomas Aylott
  - Scott Kyle
  - Arian Stolwijk
  - Tim Wienk
  - Christoph Pojer
  - Aaron Newton
  - Jacob Thornton

requires:
  - Core/MooTools

provides: [MooTools.More]

...
*/

MooTools.More = {
	'version': '1.4.0.1',
	'build': 'a4244edf2aa97ac8a196fc96082dd35af1abab87'
};


/*
---

script: Class.Refactor.js

name: Class.Refactor

description: Extends a class onto itself with new property, preserving any items attached to the class's namespace.

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - Core/Class
  - /MooTools.More

# Some modules declare themselves dependent on Class.Refactor
provides: [Class.refactor, Class.Refactor]

...
*/

Class.refactor = function(original, refactors){

	Object.each(refactors, function(item, name){
		var origin = original.prototype[name];
		origin = (origin && origin.$origin) || origin || function(){};
		original.implement(name, (typeof item == 'function') ? function(){
			var old = this.previous;
			this.previous = origin;
			var value = item.apply(this, arguments);
			this.previous = old;
			return value;
		} : item);
	});

	return original;

};


/*
---

script: Class.Binds.js

name: Class.Binds

description: Automagically binds specified methods in a class to the instance of the class.

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - Core/Class
  - /MooTools.More

provides: [Class.Binds]

...
*/

Class.Mutators.Binds = function(binds){
	if (!this.prototype.initialize) this.implement('initialize', function(){});
	return Array.from(binds).concat(this.prototype.Binds || []);
};

Class.Mutators.initialize = function(initialize){
	return function(){
		Array.from(this.Binds).each(function(name){
			var original = this[name];
			if (original) this[name] = original.bind(this);
		}, this);
		return initialize.apply(this, arguments);
	};
};

/*
---

script: String.Extras.js

name: String.Extras

description: Extends the String native object to include methods useful in managing various kinds of strings (query strings, urls, html, etc).

license: MIT-style license

authors:
  - Aaron Newton
  - Guillermo Rauch
  - Christopher Pitt

requires:
  - Core/String
  - Core/Array
  - MooTools.More

provides: [String.Extras]

...
*/

(function(){

var special = {
	'a': /[àáâãäåăą]/g,
	'A': /[ÀÁÂÃÄÅĂĄ]/g,
	'c': /[ćčç]/g,
	'C': /[ĆČÇ]/g,
	'd': /[ďđ]/g,
	'D': /[ĎÐ]/g,
	'e': /[èéêëěę]/g,
	'E': /[ÈÉÊËĚĘ]/g,
	'g': /[ğ]/g,
	'G': /[Ğ]/g,
	'i': /[ìíîï]/g,
	'I': /[ÌÍÎÏ]/g,
	'l': /[ĺľł]/g,
	'L': /[ĹĽŁ]/g,
	'n': /[ñňń]/g,
	'N': /[ÑŇŃ]/g,
	'o': /[òóôõöøő]/g,
	'O': /[ÒÓÔÕÖØ]/g,
	'r': /[řŕ]/g,
	'R': /[ŘŔ]/g,
	's': /[ššş]/g,
	'S': /[ŠŞŚ]/g,
	't': /[ťţ]/g,
	'T': /[ŤŢ]/g,
	'ue': /[ü]/g,
	'UE': /[Ü]/g,
	'u': /[ùúûůµ]/g,
	'U': /[ÙÚÛŮ]/g,
	'y': /[ÿý]/g,
	'Y': /[ŸÝ]/g,
	'z': /[žźż]/g,
	'Z': /[ŽŹŻ]/g,
	'th': /[þ]/g,
	'TH': /[Þ]/g,
	'dh': /[ð]/g,
	'DH': /[Ð]/g,
	'ss': /[ß]/g,
	'oe': /[œ]/g,
	'OE': /[Œ]/g,
	'ae': /[æ]/g,
	'AE': /[Æ]/g
},

tidy = {
	' ': /[\xa0\u2002\u2003\u2009]/g,
	'*': /[\xb7]/g,
	'\'': /[\u2018\u2019]/g,
	'"': /[\u201c\u201d]/g,
	'...': /[\u2026]/g,
	'-': /[\u2013]/g,
//	'--': /[\u2014]/g,
	'&raquo;': /[\uFFFD]/g
};

var walk = function(string, replacements){
	var result = string, key;
	for (key in replacements) result = result.replace(replacements[key], key);
	return result;
};

var getRegexForTag = function(tag, contents){
	tag = tag || '';
	var regstr = contents ? "<" + tag + "(?!\\w)[^>]*>([\\s\\S]*?)<\/" + tag + "(?!\\w)>" : "<\/?" + tag + "([^>]+)?>",
		reg = new RegExp(regstr, "gi");
	return reg;
};

String.implement({

	standardize: function(){
		return walk(this, special);
	},

	repeat: function(times){
		return new Array(times + 1).join(this);
	},

	pad: function(length, str, direction){
		if (this.length >= length) return this;

		var pad = (str == null ? ' ' : '' + str)
			.repeat(length - this.length)
			.substr(0, length - this.length);

		if (!direction || direction == 'right') return this + pad;
		if (direction == 'left') return pad + this;

		return pad.substr(0, (pad.length / 2).floor()) + this + pad.substr(0, (pad.length / 2).ceil());
	},

	getTags: function(tag, contents){
		return this.match(getRegexForTag(tag, contents)) || [];
	},

	stripTags: function(tag, contents){
		return this.replace(getRegexForTag(tag, contents), '');
	},

	tidy: function(){
		return walk(this, tidy);
	},

	truncate: function(max, trail, atChar){
		var string = this;
		if (trail == null && arguments.length == 1) trail = '…';
		if (string.length > max){
			string = string.substring(0, max);
			if (atChar){
				var index = string.lastIndexOf(atChar);
				if (index != -1) string = string.substr(0, index);
			}
			if (trail) string += trail;
		}
		return string;
	}

});

})();


/*
---

name: Events.Pseudos

description: Adds the functionality to add pseudo events

license: MIT-style license

authors:
  - Arian Stolwijk

requires: [Core/Class.Extras, Core/Slick.Parser, More/MooTools.More]

provides: [Events.Pseudos]

...
*/

(function(){

Events.Pseudos = function(pseudos, addEvent, removeEvent){

	var storeKey = '_monitorEvents:';

	var storageOf = function(object){
		return {
			store: object.store ? function(key, value){
				object.store(storeKey + key, value);
			} : function(key, value){
				(object._monitorEvents || (object._monitorEvents = {}))[key] = value;
			},
			retrieve: object.retrieve ? function(key, dflt){
				return object.retrieve(storeKey + key, dflt);
			} : function(key, dflt){
				if (!object._monitorEvents) return dflt;
				return object._monitorEvents[key] || dflt;
			}
		};
	};

	var splitType = function(type){
		if (type.indexOf(':') == -1 || !pseudos) return null;

		var parsed = Slick.parse(type).expressions[0][0],
			parsedPseudos = parsed.pseudos,
			l = parsedPseudos.length,
			splits = [];

		while (l--){
			var pseudo = parsedPseudos[l].key,
				listener = pseudos[pseudo];
			if (listener != null) splits.push({
				event: parsed.tag,
				value: parsedPseudos[l].value,
				pseudo: pseudo,
				original: type,
				listener: listener
			});
		}
		return splits.length ? splits : null;
	};

	return {

		addEvent: function(type, fn, internal){
			var split = splitType(type);
			if (!split) return addEvent.call(this, type, fn, internal);

			var storage = storageOf(this),
				events = storage.retrieve(type, []),
				eventType = split[0].event,
				args = Array.slice(arguments, 2),
				stack = fn,
				self = this;

			split.each(function(item){
				var listener = item.listener,
					stackFn = stack;
				if (listener == false) eventType += ':' + item.pseudo + '(' + item.value + ')';
				else stack = function(){
					listener.call(self, item, stackFn, arguments, stack);
				};
			});

			events.include({type: eventType, event: fn, monitor: stack});
			storage.store(type, events);

			if (type != eventType) addEvent.apply(this, [type, fn].concat(args));
			return addEvent.apply(this, [eventType, stack].concat(args));
		},

		removeEvent: function(type, fn){
			var split = splitType(type);
			if (!split) return removeEvent.call(this, type, fn);

			var storage = storageOf(this),
				events = storage.retrieve(type);
			if (!events) return this;

			var args = Array.slice(arguments, 2);

			removeEvent.apply(this, [type, fn].concat(args));
			events.each(function(monitor, i){
				if (!fn || monitor.event == fn) removeEvent.apply(this, [monitor.type, monitor.monitor].concat(args));
				delete events[i];
			}, this);

			storage.store(type, events);
			return this;
		}

	};

};

var pseudos = {

	once: function(split, fn, args, monitor){
		fn.apply(this, args);
		this.removeEvent(split.event, monitor)
			.removeEvent(split.original, fn);
	},

	throttle: function(split, fn, args){
		if (!fn._throttled){
			fn.apply(this, args);
			fn._throttled = setTimeout(function(){
				fn._throttled = false;
			}, split.value || 250);
		}
	},

	pause: function(split, fn, args){
		clearTimeout(fn._pause);
		fn._pause = fn.delay(split.value || 250, this, args);
	}

};

Events.definePseudo = function(key, listener){
	pseudos[key] = listener;
	return this;
};

Events.lookupPseudo = function(key){
	return pseudos[key];
};

var proto = Events.prototype;
Events.implement(Events.Pseudos(pseudos, proto.addEvent, proto.removeEvent));

['Request', 'Fx'].each(function(klass){
	if (this[klass]) this[klass].implement(Events.prototype);
});

})();


/*
---

name: Element.Event.Pseudos

description: Adds the functionality to add pseudo events for Elements

license: MIT-style license

authors:
  - Arian Stolwijk

requires: [Core/Element.Event, Core/Element.Delegation, Events.Pseudos]

provides: [Element.Event.Pseudos, Element.Delegation]

...
*/

(function(){

var pseudos = {relay: false},
	copyFromEvents = ['once', 'throttle', 'pause'],
	count = copyFromEvents.length;

while (count--) pseudos[copyFromEvents[count]] = Events.lookupPseudo(copyFromEvents[count]);

DOMEvent.definePseudo = function(key, listener){
	pseudos[key] = listener;
	return this;
};

var proto = Element.prototype;
[Element, Window, Document].invoke('implement', Events.Pseudos(pseudos, proto.addEvent, proto.removeEvent));

})();



/*
---

script: Object.Extras.js

name: Object.Extras

description: Extra Object generics, like getFromPath which allows a path notation to child elements.

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - Core/Object
  - /MooTools.More

provides: [Object.Extras]

...
*/

(function(){

var defined = function(value){
	return value != null;
};

var hasOwnProperty = Object.prototype.hasOwnProperty;

Object.extend({

	getFromPath: function(source, parts){
		if (typeof parts == 'string') parts = parts.split('.');
		for (var i = 0, l = parts.length; i < l; i++){
			if (hasOwnProperty.call(source, parts[i])) source = source[parts[i]];
			else return null;
		}
		return source;
	},

	cleanValues: function(object, method){
		method = method || defined;
		for (var key in object) if (!method(object[key])){
			delete object[key];
		}
		return object;
	},

	erase: function(object, key){
		if (hasOwnProperty.call(object, key)) delete object[key];
		return object;
	},

	run: function(object){
		var args = Array.slice(arguments, 1);
		for (var key in object) if (object[key].apply){
			object[key].apply(object, args);
		}
		return object;
	}

});

})();


/*
---

script: Locale.js

name: Locale

description: Provides methods for localization.

license: MIT-style license

authors:
  - Aaron Newton
  - Arian Stolwijk

requires:
  - Core/Events
  - /Object.Extras
  - /MooTools.More

provides: [Locale, Lang]

...
*/

(function(){

var current = null,
	locales = {},
	inherits = {};

var getSet = function(set){
	if (instanceOf(set, Locale.Set)) return set;
	else return locales[set];
};

var Locale = this.Locale = {

	define: function(locale, set, key, value){
		var name;
		if (instanceOf(locale, Locale.Set)){
			name = locale.name;
			if (name) locales[name] = locale;
		} else {
			name = locale;
			if (!locales[name]) locales[name] = new Locale.Set(name);
			locale = locales[name];
		}

		if (set) locale.define(set, key, value);

		if (!current) current = locale;

		return locale;
	},

	use: function(locale){
		locale = getSet(locale);

		if (locale){
			current = locale;

			this.fireEvent('change', locale);

			
		}

		return this;
	},

	getCurrent: function(){
		return current;
	},

	get: function(key, args){
		return (current) ? current.get(key, args) : '';
	},

	inherit: function(locale, inherits, set){
		locale = getSet(locale);

		if (locale) locale.inherit(inherits, set);
		return this;
	},

	list: function(){
		return Object.keys(locales);
	}

};

Object.append(Locale, new Events);

Locale.Set = new Class({

	sets: {},

	inherits: {
		locales: [],
		sets: {}
	},

	initialize: function(name){
		this.name = name || '';
	},

	define: function(set, key, value){
		var defineData = this.sets[set];
		if (!defineData) defineData = {};

		if (key){
			if (typeOf(key) == 'object') defineData = Object.merge(defineData, key);
			else defineData[key] = value;
		}
		this.sets[set] = defineData;

		return this;
	},

	get: function(key, args, _base){
		var value = Object.getFromPath(this.sets, key);
		if (value != null){
			var type = typeOf(value);
			if (type == 'function') value = value.apply(null, Array.from(args));
			else if (type == 'object') value = Object.clone(value);
			return value;
		}

		// get value of inherited locales
		var index = key.indexOf('.'),
			set = index < 0 ? key : key.substr(0, index),
			names = (this.inherits.sets[set] || []).combine(this.inherits.locales).include('en-US');
		if (!_base) _base = [];

		for (var i = 0, l = names.length; i < l; i++){
			if (_base.contains(names[i])) continue;
			_base.include(names[i]);

			var locale = locales[names[i]];
			if (!locale) continue;

			value = locale.get(key, args, _base);
			if (value != null) return value;
		}

		return '';
	},

	inherit: function(names, set){
		names = Array.from(names);

		if (set && !this.inherits.sets[set]) this.inherits.sets[set] = [];

		var l = names.length;
		while (l--) (set ? this.inherits.sets[set] : this.inherits.locales).unshift(names[l]);

		return this;
	}

});



})();


/*
---

name: Locale.en-US.Date

description: Date messages for US English.

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - /Locale

provides: [Locale.en-US.Date]

...
*/

Locale.define('en-US', 'Date', {

	months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
	months_abbr: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
	days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
	days_abbr: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],

	// Culture's date order: MM/DD/YYYY
	dateOrder: ['month', 'date', 'year'],
	shortDate: '%m/%d/%Y',
	shortTime: '%I:%M%p',
	AM: 'AM',
	PM: 'PM',
	firstDayOfWeek: 0,

	// Date.Extras
	ordinal: function(dayOfMonth){
		// 1st, 2nd, 3rd, etc.
		return (dayOfMonth > 3 && dayOfMonth < 21) ? 'th' : ['th', 'st', 'nd', 'rd', 'th'][Math.min(dayOfMonth % 10, 4)];
	},

	lessThanMinuteAgo: 'less than a minute ago',
	minuteAgo: 'about a minute ago',
	minutesAgo: '{delta} minutes ago',
	hourAgo: 'about an hour ago',
	hoursAgo: 'about {delta} hours ago',
	dayAgo: '1 day ago',
	daysAgo: '{delta} days ago',
	weekAgo: '1 week ago',
	weeksAgo: '{delta} weeks ago',
	monthAgo: '1 month ago',
	monthsAgo: '{delta} months ago',
	yearAgo: '1 year ago',
	yearsAgo: '{delta} years ago',

	lessThanMinuteUntil: 'less than a minute from now',
	minuteUntil: 'about a minute from now',
	minutesUntil: '{delta} minutes from now',
	hourUntil: 'about an hour from now',
	hoursUntil: 'about {delta} hours from now',
	dayUntil: '1 day from now',
	daysUntil: '{delta} days from now',
	weekUntil: '1 week from now',
	weeksUntil: '{delta} weeks from now',
	monthUntil: '1 month from now',
	monthsUntil: '{delta} months from now',
	yearUntil: '1 year from now',
	yearsUntil: '{delta} years from now'

});


/*
---

script: Date.js

name: Date

description: Extends the Date native object to include methods useful in managing dates.

license: MIT-style license

authors:
  - Aaron Newton
  - Nicholas Barthelemy - https://svn.nbarthelemy.com/date-js/
  - Harald Kirshner - mail [at] digitarald.de; http://digitarald.de
  - Scott Kyle - scott [at] appden.com; http://appden.com

requires:
  - Core/Array
  - Core/String
  - Core/Number
  - MooTools.More
  - Locale
  - Locale.en-US.Date

provides: [Date]

...
*/

(function(){

var Date = this.Date;

var DateMethods = Date.Methods = {
	ms: 'Milliseconds',
	year: 'FullYear',
	min: 'Minutes',
	mo: 'Month',
	sec: 'Seconds',
	hr: 'Hours'
};

['Date', 'Day', 'FullYear', 'Hours', 'Milliseconds', 'Minutes', 'Month', 'Seconds', 'Time', 'TimezoneOffset',
	'Week', 'Timezone', 'GMTOffset', 'DayOfYear', 'LastMonth', 'LastDayOfMonth', 'UTCDate', 'UTCDay', 'UTCFullYear',
	'AMPM', 'Ordinal', 'UTCHours', 'UTCMilliseconds', 'UTCMinutes', 'UTCMonth', 'UTCSeconds', 'UTCMilliseconds'].each(function(method){
	Date.Methods[method.toLowerCase()] = method;
});

var pad = function(n, digits, string){
	if (digits == 1) return n;
	return n < Math.pow(10, digits - 1) ? (string || '0') + pad(n, digits - 1, string) : n;
};

Date.implement({

	set: function(prop, value){
		prop = prop.toLowerCase();
		var method = DateMethods[prop] && 'set' + DateMethods[prop];
		if (method && this[method]) this[method](value);
		return this;
	}.overloadSetter(),

	get: function(prop){
		prop = prop.toLowerCase();
		var method = DateMethods[prop] && 'get' + DateMethods[prop];
		if (method && this[method]) return this[method]();
		return null;
	}.overloadGetter(),

	clone: function(){
		return new Date(this.get('time'));
	},

	increment: function(interval, times){
		interval = interval || 'day';
		times = times != null ? times : 1;

		switch (interval){
			case 'year':
				return this.increment('month', times * 12);
			case 'month':
				var d = this.get('date');
				this.set('date', 1).set('mo', this.get('mo') + times);
				return this.set('date', d.min(this.get('lastdayofmonth')));
			case 'week':
				return this.increment('day', times * 7);
			case 'day':
				return this.set('date', this.get('date') + times);
		}

		if (!Date.units[interval]) throw new Error(interval + ' is not a supported interval');

		return this.set('time', this.get('time') + times * Date.units[interval]());
	},

	decrement: function(interval, times){
		return this.increment(interval, -1 * (times != null ? times : 1));
	},

	isLeapYear: function(){
		return Date.isLeapYear(this.get('year'));
	},

	clearTime: function(){
		return this.set({hr: 0, min: 0, sec: 0, ms: 0});
	},

	diff: function(date, resolution){
		if (typeOf(date) == 'string') date = Date.parse(date);

		return ((date - this) / Date.units[resolution || 'day'](3, 3)).round(); // non-leap year, 30-day month
	},

	getLastDayOfMonth: function(){
		return Date.daysInMonth(this.get('mo'), this.get('year'));
	},

	getDayOfYear: function(){
		return (Date.UTC(this.get('year'), this.get('mo'), this.get('date') + 1)
			- Date.UTC(this.get('year'), 0, 1)) / Date.units.day();
	},

	setDay: function(day, firstDayOfWeek){
		if (firstDayOfWeek == null){
			firstDayOfWeek = Date.getMsg('firstDayOfWeek');
			if (firstDayOfWeek === '') firstDayOfWeek = 1;
		}

		day = (7 + Date.parseDay(day, true) - firstDayOfWeek) % 7;
		var currentDay = (7 + this.get('day') - firstDayOfWeek) % 7;

		return this.increment('day', day - currentDay);
	},

	getWeek: function(firstDayOfWeek){
		if (firstDayOfWeek == null){
			firstDayOfWeek = Date.getMsg('firstDayOfWeek');
			if (firstDayOfWeek === '') firstDayOfWeek = 1;
		}

		var date = this,
			dayOfWeek = (7 + date.get('day') - firstDayOfWeek) % 7,
			dividend = 0,
			firstDayOfYear;

		if (firstDayOfWeek == 1){
			// ISO-8601, week belongs to year that has the most days of the week (i.e. has the thursday of the week)
			var month = date.get('month'),
				startOfWeek = date.get('date') - dayOfWeek;

			if (month == 11 && startOfWeek > 28) return 1; // Week 1 of next year

			if (month == 0 && startOfWeek < -2){
				// Use a date from last year to determine the week
				date = new Date(date).decrement('day', dayOfWeek);
				dayOfWeek = 0;
			}

			firstDayOfYear = new Date(date.get('year'), 0, 1).get('day') || 7;
			if (firstDayOfYear > 4) dividend = -7; // First week of the year is not week 1
		} else {
			// In other cultures the first week of the year is always week 1 and the last week always 53 or 54.
			// Days in the same week can have a different weeknumber if the week spreads across two years.
			firstDayOfYear = new Date(date.get('year'), 0, 1).get('day');
		}

		dividend += date.get('dayofyear');
		dividend += 6 - dayOfWeek; // Add days so we calculate the current date's week as a full week
		dividend += (7 + firstDayOfYear - firstDayOfWeek) % 7; // Make up for first week of the year not being a full week

		return (dividend / 7);
	},

	getOrdinal: function(day){
		return Date.getMsg('ordinal', day || this.get('date'));
	},

	getTimezone: function(){
		return this.toString()
			.replace(/^.*? ([A-Z]{3}).[0-9]{4}.*$/, '$1')
			.replace(/^.*?\(([A-Z])[a-z]+ ([A-Z])[a-z]+ ([A-Z])[a-z]+\)$/, '$1$2$3');
	},

	getGMTOffset: function(){
		var off = this.get('timezoneOffset');
		return ((off > 0) ? '-' : '+') + pad((off.abs() / 60).floor(), 2) + pad(off % 60, 2);
	},

	setAMPM: function(ampm){
		ampm = ampm.toUpperCase();
		var hr = this.get('hr');
		if (hr > 11 && ampm == 'AM') return this.decrement('hour', 12);
		else if (hr < 12 && ampm == 'PM') return this.increment('hour', 12);
		return this;
	},

	getAMPM: function(){
		return (this.get('hr') < 12) ? 'AM' : 'PM';
	},

	parse: function(str){
		this.set('time', Date.parse(str));
		return this;
	},

	isValid: function(date){
		if (!date) date = this;
		return typeOf(date) == 'date' && !isNaN(date.valueOf());
	},

	format: function(format){
		if (!this.isValid()) return 'invalid date';

		if (!format) format = '%x %X';
		if (typeof format == 'string') format = formats[format.toLowerCase()] || format;
		if (typeof format == 'function') return format(this);

		var d = this;
		return format.replace(/%([a-z%])/gi,
			function($0, $1){
				switch ($1){
					case 'a': return Date.getMsg('days_abbr')[d.get('day')];
					case 'A': return Date.getMsg('days')[d.get('day')];
					case 'b': return Date.getMsg('months_abbr')[d.get('month')];
					case 'B': return Date.getMsg('months')[d.get('month')];
					case 'c': return d.format('%a %b %d %H:%M:%S %Y');
					case 'd': return pad(d.get('date'), 2);
					case 'e': return pad(d.get('date'), 2, ' ');
					case 'H': return pad(d.get('hr'), 2);
					case 'I': return pad((d.get('hr') % 12) || 12, 2);
					case 'j': return pad(d.get('dayofyear'), 3);
					case 'k': return pad(d.get('hr'), 2, ' ');
					case 'l': return pad((d.get('hr') % 12) || 12, 2, ' ');
					case 'L': return pad(d.get('ms'), 3);
					case 'm': return pad((d.get('mo') + 1), 2);
					case 'M': return pad(d.get('min'), 2);
					case 'o': return d.get('ordinal');
					case 'p': return Date.getMsg(d.get('ampm'));
					case 's': return Math.round(d / 1000);
					case 'S': return pad(d.get('seconds'), 2);
					case 'T': return d.format('%H:%M:%S');
					case 'U': return pad(d.get('week'), 2);
					case 'w': return d.get('day');
					case 'x': return d.format(Date.getMsg('shortDate'));
					case 'X': return d.format(Date.getMsg('shortTime'));
					case 'y': return d.get('year').toString().substr(2);
					case 'Y': return d.get('year');
					case 'z': return d.get('GMTOffset');
					case 'Z': return d.get('Timezone');
				}
				return $1;
			}
		);
	},

	toISOString: function(){
		return this.format('iso8601');
	}

}).alias({
	toJSON: 'toISOString',
	compare: 'diff',
	strftime: 'format'
});

// The day and month abbreviations are standardized, so we cannot use simply %a and %b because they will get localized
var rfcDayAbbr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
	rfcMonthAbbr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

var formats = {
	db: '%Y-%m-%d %H:%M:%S',
	compact: '%Y%m%dT%H%M%S',
	'short': '%d %b %H:%M',
	'long': '%B %d, %Y %H:%M',
	rfc822: function(date){
		return rfcDayAbbr[date.get('day')] + date.format(', %d ') + rfcMonthAbbr[date.get('month')] + date.format(' %Y %H:%M:%S %Z');
	},
	rfc2822: function(date){
		return rfcDayAbbr[date.get('day')] + date.format(', %d ') + rfcMonthAbbr[date.get('month')] + date.format(' %Y %H:%M:%S %z');
	},
	iso8601: function(date){
		return (
			date.getUTCFullYear() + '-' +
			pad(date.getUTCMonth() + 1, 2) + '-' +
			pad(date.getUTCDate(), 2) + 'T' +
			pad(date.getUTCHours(), 2) + ':' +
			pad(date.getUTCMinutes(), 2) + ':' +
			pad(date.getUTCSeconds(), 2) + '.' +
			pad(date.getUTCMilliseconds(), 3) + 'Z'
		);
	}
};

var parsePatterns = [],
	nativeParse = Date.parse;

var parseWord = function(type, word, num){
	var ret = -1,
		translated = Date.getMsg(type + 's');
	switch (typeOf(word)){
		case 'object':
			ret = translated[word.get(type)];
			break;
		case 'number':
			ret = translated[word];
			if (!ret) throw new Error('Invalid ' + type + ' index: ' + word);
			break;
		case 'string':
			var match = translated.filter(function(name){
				return this.test(name);
			}, new RegExp('^' + word, 'i'));
			if (!match.length) throw new Error('Invalid ' + type + ' string');
			if (match.length > 1) throw new Error('Ambiguous ' + type);
			ret = match[0];
	}

	return (num) ? translated.indexOf(ret) : ret;
};

var startCentury = 1900,
	startYear = 70;

Date.extend({

	getMsg: function(key, args){
		return Locale.get('Date.' + key, args);
	},

	units: {
		ms: Function.from(1),
		second: Function.from(1000),
		minute: Function.from(60000),
		hour: Function.from(3600000),
		day: Function.from(86400000),
		week: Function.from(608400000),
		month: function(month, year){
			var d = new Date;
			return Date.daysInMonth(month != null ? month : d.get('mo'), year != null ? year : d.get('year')) * 86400000;
		},
		year: function(year){
			year = year || new Date().get('year');
			return Date.isLeapYear(year) ? 31622400000 : 31536000000;
		}
	},

	daysInMonth: function(month, year){
		return [31, Date.isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
	},

	isLeapYear: function(year){
		return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
	},

	parse: function(from){
		var t = typeOf(from);
		if (t == 'number') return new Date(from);
		if (t != 'string') return from;
		from = from.clean();
		if (!from.length) return null;

		var parsed;
		parsePatterns.some(function(pattern){
			var bits = pattern.re.exec(from);
			return (bits) ? (parsed = pattern.handler(bits)) : false;
		});

		if (!(parsed && parsed.isValid())){
			parsed = new Date(nativeParse(from));
			if (!(parsed && parsed.isValid())) parsed = new Date(from.toInt());
		}
		return parsed;
	},

	parseDay: function(day, num){
		return parseWord('day', day, num);
	},

	parseMonth: function(month, num){
		return parseWord('month', month, num);
	},

	parseUTC: function(value){
		var localDate = new Date(value);
		var utcSeconds = Date.UTC(
			localDate.get('year'),
			localDate.get('mo'),
			localDate.get('date'),
			localDate.get('hr'),
			localDate.get('min'),
			localDate.get('sec'),
			localDate.get('ms')
		);
		return new Date(utcSeconds);
	},

	orderIndex: function(unit){
		return Date.getMsg('dateOrder').indexOf(unit) + 1;
	},

	defineFormat: function(name, format){
		formats[name] = format;
		return this;
	},

	

	defineParser: function(pattern){
		parsePatterns.push((pattern.re && pattern.handler) ? pattern : build(pattern));
		return this;
	},

	defineParsers: function(){
		Array.flatten(arguments).each(Date.defineParser);
		return this;
	},

	define2DigitYearStart: function(year){
		startYear = year % 100;
		startCentury = year - startYear;
		return this;
	}

}).extend({
	defineFormats: Date.defineFormat.overloadSetter()
});

var regexOf = function(type){
	return new RegExp('(?:' + Date.getMsg(type).map(function(name){
		return name.substr(0, 3);
	}).join('|') + ')[a-z]*');
};

var replacers = function(key){
	switch (key){
		case 'T':
			return '%H:%M:%S';
		case 'x': // iso8601 covers yyyy-mm-dd, so just check if month is first
			return ((Date.orderIndex('month') == 1) ? '%m[-./]%d' : '%d[-./]%m') + '([-./]%y)?';
		case 'X':
			return '%H([.:]%M)?([.:]%S([.:]%s)?)? ?%p? ?%z?';
	}
	return null;
};

var keys = {
	d: /[0-2]?[0-9]|3[01]/,
	H: /[01]?[0-9]|2[0-3]/,
	I: /0?[1-9]|1[0-2]/,
	M: /[0-5]?\d/,
	s: /\d+/,
	o: /[a-z]*/,
	p: /[ap]\.?m\.?/,
	y: /\d{2}|\d{4}/,
	Y: /\d{4}/,
	z: /Z|[+-]\d{2}(?::?\d{2})?/
};

keys.m = keys.I;
keys.S = keys.M;

var currentLanguage;

var recompile = function(language){
	currentLanguage = language;

	keys.a = keys.A = regexOf('days');
	keys.b = keys.B = regexOf('months');

	parsePatterns.each(function(pattern, i){
		if (pattern.format) parsePatterns[i] = build(pattern.format);
	});
};

var build = function(format){
	if (!currentLanguage) return {format: format};

	var parsed = [];
	var re = (format.source || format) // allow format to be regex
	 .replace(/%([a-z])/gi,
		function($0, $1){
			return replacers($1) || $0;
		}
	).replace(/\((?!\?)/g, '(?:') // make all groups non-capturing
	 .replace(/ (?!\?|\*)/g, ',? ') // be forgiving with spaces and commas
	 .replace(/%([a-z%])/gi,
		function($0, $1){
			var p = keys[$1];
			if (!p) return $1;
			parsed.push($1);
			return '(' + p.source + ')';
		}
	).replace(/\[a-z\]/gi, '[a-z\\u00c0-\\uffff;\&]'); // handle unicode words

	return {
		format: format,
		re: new RegExp('^' + re + '$', 'i'),
		handler: function(bits){
			bits = bits.slice(1).associate(parsed);
			var date = new Date().clearTime(),
				year = bits.y || bits.Y;

			if (year != null) handle.call(date, 'y', year); // need to start in the right year
			if ('d' in bits) handle.call(date, 'd', 1);
			if ('m' in bits || bits.b || bits.B) handle.call(date, 'm', 1);

			for (var key in bits) handle.call(date, key, bits[key]);
			return date;
		}
	};
};

var handle = function(key, value){
	if (!value) return this;

	switch (key){
		case 'a': case 'A': return this.set('day', Date.parseDay(value, true));
		case 'b': case 'B': return this.set('mo', Date.parseMonth(value, true));
		case 'd': return this.set('date', value);
		case 'H': case 'I': return this.set('hr', value);
		case 'm': return this.set('mo', value - 1);
		case 'M': return this.set('min', value);
		case 'p': return this.set('ampm', value.replace(/\./g, ''));
		case 'S': return this.set('sec', value);
		case 's': return this.set('ms', ('0.' + value) * 1000);
		case 'w': return this.set('day', value);
		case 'Y': return this.set('year', value);
		case 'y':
			value = +value;
			if (value < 100) value += startCentury + (value < startYear ? 100 : 0);
			return this.set('year', value);
		case 'z':
			if (value == 'Z') value = '+00';
			var offset = value.match(/([+-])(\d{2}):?(\d{2})?/);
			offset = (offset[1] + '1') * (offset[2] * 60 + (+offset[3] || 0)) + this.getTimezoneOffset();
			return this.set('time', this - offset * 60000);
	}

	return this;
};

Date.defineParsers(
	'%Y([-./]%m([-./]%d((T| )%X)?)?)?', // "1999-12-31", "1999-12-31 11:59pm", "1999-12-31 23:59:59", ISO8601
	'%Y%m%d(T%H(%M%S?)?)?', // "19991231", "19991231T1159", compact
	'%x( %X)?', // "12/31", "12.31.99", "12-31-1999", "12/31/2008 11:59 PM"
	'%d%o( %b( %Y)?)?( %X)?', // "31st", "31st December", "31 Dec 1999", "31 Dec 1999 11:59pm"
	'%b( %d%o)?( %Y)?( %X)?', // Same as above with month and day switched
	'%Y %b( %d%o( %X)?)?', // Same as above with year coming first
	'%o %b %d %X %z %Y', // "Thu Oct 22 08:11:23 +0000 2009"
	'%T', // %H:%M:%S
	'%H:%M( ?%p)?' // "11:05pm", "11:05 am" and "11:05"
);

Locale.addEvent('change', function(language){
	if (Locale.get('Date')) recompile(language);
}).fireEvent('change', Locale.getCurrent());

})();


// /*
// ---

// name: Hash

// description: Contains Hash Prototypes. Provides a means for overcoming the JavaScript practical impossibility of extending native Objects.

// license: MIT-style license.

// requires:
//   - Core/Object
//   - /MooTools.More

// provides: [Hash]

// ...
// */

// (function(){

// if (this.Hash) return;

// var Hash = this.Hash = new Type('Hash', function(object){
// 	if (typeOf(object) == 'hash') object = Object.clone(object.getClean());
// 	for (var key in object) this[key] = object[key];
// 	return this;
// });

// this.$H = function(object){
// 	return new Hash(object);
// };

// Hash.implement({

// 	forEach: function(fn, bind){
// 		Object.forEach(this, fn, bind);
// 	},

// 	getClean: function(){
// 		var clean = {};
// 		for (var key in this){
// 			if (this.hasOwnProperty(key)) clean[key] = this[key];
// 		}
// 		return clean;
// 	},

// 	getLength: function(){
// 		var length = 0;
// 		for (var key in this){
// 			if (this.hasOwnProperty(key)) length++;
// 		}
// 		return length;
// 	}

// });

// Hash.alias('each', 'forEach');

// Hash.implement({

// 	has: Object.prototype.hasOwnProperty,

// 	keyOf: function(value){
// 		return Object.keyOf(this, value);
// 	},

// 	hasValue: function(value){
// 		return Object.contains(this, value);
// 	},

// 	extend: function(properties){
// 		Hash.each(properties || {}, function(value, key){
// 			Hash.set(this, key, value);
// 		}, this);
// 		return this;
// 	},

// 	combine: function(properties){
// 		Hash.each(properties || {}, function(value, key){
// 			Hash.include(this, key, value);
// 		}, this);
// 		return this;
// 	},

// 	erase: function(key){
// 		if (this.hasOwnProperty(key)) delete this[key];
// 		return this;
// 	},

// 	get: function(key){
// 		return (this.hasOwnProperty(key)) ? this[key] : null;
// 	},

// 	set: function(key, value){
// 		if (!this[key] || this.hasOwnProperty(key)) this[key] = value;
// 		return this;
// 	},

// 	empty: function(){
// 		Hash.each(this, function(value, key){
// 			delete this[key];
// 		}, this);
// 		return this;
// 	},

// 	include: function(key, value){
// 		if (this[key] == undefined) this[key] = value;
// 		return this;
// 	},

// 	map: function(fn, bind){
// 		return new Hash(Object.map(this, fn, bind));
// 	},

// 	filter: function(fn, bind){
// 		return new Hash(Object.filter(this, fn, bind));
// 	},

// 	every: function(fn, bind){
// 		return Object.every(this, fn, bind);
// 	},

// 	some: function(fn, bind){
// 		return Object.some(this, fn, bind);
// 	},

// 	getKeys: function(){
// 		return Object.keys(this);
// 	},

// 	getValues: function(){
// 		return Object.values(this);
// 	},

// 	toQueryString: function(base){
// 		return Object.toQueryString(this, base);
// 	}

// });

// Hash.alias({indexOf: 'keyOf', contains: 'hasValue'});


// })();



/*
---

script: Elements.From.js

name: Elements.From

description: Returns a collection of elements from a string of html.

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - Core/String
  - Core/Element
  - /MooTools.More

provides: [Elements.from, Elements.From]

...
*/

Elements.from = function(text, excludeScripts){
	if (excludeScripts || excludeScripts == null) text = text.stripScripts();

	var container, match = text.match(/^\s*<(t[dhr]|tbody|tfoot|thead)/i);

	if (match){
		container = new Element('table');
		var tag = match[1].toLowerCase();
		if (['td', 'th', 'tr'].contains(tag)){
			container = new Element('tbody').inject(container);
			if (tag != 'tr') container = new Element('tr').inject(container);
		}
	}

	return (container || new Element('div')).set('html', text).getChildren();
};


/*
---

script: Element.Measure.js

name: Element.Measure

description: Extends the Element native object to include methods useful in measuring dimensions.

credits: "Element.measure / .expose methods by Daniel Steigerwald License: MIT-style license. Copyright: Copyright (c) 2008 Daniel Steigerwald, daniel.steigerwald.cz"

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - Core/Element.Style
  - Core/Element.Dimensions
  - /MooTools.More

provides: [Element.Measure]

...
*/

(function(){

var getStylesList = function(styles, planes){
	var list = [];
	Object.each(planes, function(directions){
		Object.each(directions, function(edge){
			styles.each(function(style){
				list.push(style + '-' + edge + (style == 'border' ? '-width' : ''));
			});
		});
	});
	return list;
};

var calculateEdgeSize = function(edge, styles){
	var total = 0;
	Object.each(styles, function(value, style){
		if (style.test(edge)) total = total + value.toInt();
	});
	return total;
};

var isVisible = function(el){
	return !!(!el || el.offsetHeight || el.offsetWidth);
};


Element.implement({

	measure: function(fn){
		if (isVisible(this)) return fn.call(this);
		var parent = this.getParent(),
			toMeasure = [];
		while (!isVisible(parent) && parent != document.body){
			toMeasure.push(parent.expose());
			parent = parent.getParent();
		}
		var restore = this.expose(),
			result = fn.call(this);
		restore();
		toMeasure.each(function(restore){
			restore();
		});
		return result;
	},

	expose: function(){
		if (this.getStyle('display') != 'none') return function(){};
		var before = this.style.cssText;
		this.setStyles({
			display: 'block',
			position: 'absolute',
			visibility: 'hidden'
		});
		return function(){
			this.style.cssText = before;
		}.bind(this);
	},

	getDimensions: function(options){
		options = Object.merge({computeSize: false}, options);
		var dim = {x: 0, y: 0};

		var getSize = function(el, options){
			return (options.computeSize) ? el.getComputedSize(options) : el.getSize();
		};

		var parent = this.getParent('body');

		if (parent && this.getStyle('display') == 'none'){
			dim = this.measure(function(){
				return getSize(this, options);
			});
		} else if (parent){
			try { //safari sometimes crashes here, so catch it
				dim = getSize(this, options);
			}catch(e){}
		}

		return Object.append(dim, (dim.x || dim.x === 0) ? {
				width: dim.x,
				height: dim.y
			} : {
				x: dim.width,
				y: dim.height
			}
		);
	},

	getComputedSize: function(options){
		

		options = Object.merge({
			styles: ['padding','border'],
			planes: {
				height: ['top','bottom'],
				width: ['left','right']
			},
			mode: 'both'
		}, options);

		var styles = {},
			size = {width: 0, height: 0},
			dimensions;

		if (options.mode == 'vertical'){
			delete size.width;
			delete options.planes.width;
		} else if (options.mode == 'horizontal'){
			delete size.height;
			delete options.planes.height;
		}

		getStylesList(options.styles, options.planes).each(function(style){
			styles[style] = this.getStyle(style).toInt();
		}, this);

		Object.each(options.planes, function(edges, plane){

			var capitalized = plane.capitalize(),
				style = this.getStyle(plane);

			if (style == 'auto' && !dimensions) dimensions = this.getDimensions();

			style = styles[plane] = (style == 'auto') ? dimensions[plane] : style.toInt();
			size['total' + capitalized] = style;

			edges.each(function(edge){
				var edgesize = calculateEdgeSize(edge, styles);
				size['computed' + edge.capitalize()] = edgesize;
				size['total' + capitalized] += edgesize;
			});

		}, this);

		return Object.append(size, styles);
	}

});

})();



/*
---

script: Element.Forms.js

name: Element.Forms

description: Extends the Element native object to include methods useful in managing inputs.

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - Core/Element
  - /String.Extras
  - /MooTools.More

provides: [Element.Forms]

...
*/

Element.implement({

	tidy: function(){
		this.set('value', this.get('value').tidy());
	},

	getTextInRange: function(start, end){
		return this.get('value').substring(start, end);
	},

	getSelectedText: function(){
		if (this.setSelectionRange) return this.getTextInRange(this.getSelectionStart(), this.getSelectionEnd());
		return document.selection.createRange().text;
	},

	getSelectedRange: function(){
		if (this.selectionStart != null){
			return {
				start: this.selectionStart,
				end: this.selectionEnd
			};
		}

		var pos = {
			start: 0,
			end: 0
		};
		var range = this.getDocument().selection.createRange();
		if (!range || range.parentElement() != this) return pos;
		var duplicate = range.duplicate();

		if (this.type == 'text'){
			pos.start = 0 - duplicate.moveStart('character', -100000);
			pos.end = pos.start + range.text.length;
		} else {
			var value = this.get('value');
			var offset = value.length;
			duplicate.moveToElementText(this);
			duplicate.setEndPoint('StartToEnd', range);
			if (duplicate.text.length) offset -= value.match(/[\n\r]*$/)[0].length;
			pos.end = offset - duplicate.text.length;
			duplicate.setEndPoint('StartToStart', range);
			pos.start = offset - duplicate.text.length;
		}
		return pos;
	},

	getSelectionStart: function(){
		return this.getSelectedRange().start;
	},

	getSelectionEnd: function(){
		return this.getSelectedRange().end;
	},

	setCaretPosition: function(pos){
		if (pos == 'end') pos = this.get('value').length;
		this.selectRange(pos, pos);
		return this;
	},

	getCaretPosition: function(){
		return this.getSelectedRange().start;
	},

	selectRange: function(start, end){
		if (this.setSelectionRange){
			this.focus();
			this.setSelectionRange(start, end);
		} else {
			var value = this.get('value');
			var diff = value.substr(start, end - start).replace(/\r/g, '').length;
			start = value.substr(0, start).replace(/\r/g, '').length;
			var range = this.createTextRange();
			range.collapse(true);
			range.moveEnd('character', start + diff);
			range.moveStart('character', start);
			range.select();
		}
		return this;
	},

	insertAtCursor: function(value, select){
		var pos = this.getSelectedRange();
		var text = this.get('value');
		this.set('value', text.substring(0, pos.start) + value + text.substring(pos.end, text.length));
		if (select !== false) this.selectRange(pos.start, pos.start + value.length);
		else this.setCaretPosition(pos.start + value.length);
		return this;
	},

	insertAroundCursor: function(options, select){
		options = Object.append({
			before: '',
			defaultMiddle: '',
			after: ''
		}, options);

		var value = this.getSelectedText() || options.defaultMiddle;
		var pos = this.getSelectedRange();
		var text = this.get('value');

		if (pos.start == pos.end){
			this.set('value', text.substring(0, pos.start) + options.before + value + options.after + text.substring(pos.end, text.length));
			this.selectRange(pos.start + options.before.length, pos.end + options.before.length + value.length);
		} else {
			var current = text.substring(pos.start, pos.end);
			this.set('value', text.substring(0, pos.start) + options.before + current + options.after + text.substring(pos.end, text.length));
			var selStart = pos.start + options.before.length;
			if (select !== false) this.selectRange(selStart, selStart + current.length);
			else this.setCaretPosition(selStart + text.length);
		}
		return this;
	}

});



/*
---

script: Fx.Elements.js

name: Fx.Elements

description: Effect to change any number of CSS properties of any number of Elements.

license: MIT-style license

authors:
  - Valerio Proietti

requires:
  - Core/Fx.CSS
  - /MooTools.More

provides: [Fx.Elements]

...
*/

Fx.Elements = new Class({

	Extends: Fx.CSS,

	initialize: function(elements, options){
		this.elements = this.subject = $$(elements);
		this.parent(options);
	},

	compute: function(from, to, delta){
		var now = {};

		for (var i in from){
			var iFrom = from[i], iTo = to[i], iNow = now[i] = {};
			for (var p in iFrom) iNow[p] = this.parent(iFrom[p], iTo[p], delta);
		}

		return now;
	},

	set: function(now){
		for (var i in now){
			if (!this.elements[i]) continue;

			var iNow = now[i];
			for (var p in iNow) this.render(this.elements[i], p, iNow[p], this.options.unit);
		}

		return this;
	},

	start: function(obj){
		if (!this.check(obj)) return this;
		var from = {}, to = {};

		for (var i in obj){
			if (!this.elements[i]) continue;

			var iProps = obj[i], iFrom = from[i] = {}, iTo = to[i] = {};

			for (var p in iProps){
				var parsed = this.prepare(this.elements[i], p, iProps[p]);
				iFrom[p] = parsed.from;
				iTo[p] = parsed.to;
			}
		}

		return this.parent(from, to);
	}

});


/*
---

script: Fx.Accordion.js

name: Fx.Accordion

description: An Fx.Elements extension which allows you to easily create accordion type controls.

license: MIT-style license

authors:
  - Valerio Proietti

requires:
  - Core/Element.Event
  - /Fx.Elements

provides: [Fx.Accordion]

...
*/

Fx.Accordion = new Class({

	Extends: Fx.Elements,

	options: {/*
		onActive: function(toggler, section){},
		onBackground: function(toggler, section){},*/
		fixedHeight: false,
		fixedWidth: false,
		display: 0,
		show: false,
		height: true,
		width: false,
		opacity: true,
		alwaysHide: false,
		trigger: 'click',
		initialDisplayFx: true,
		resetHeight: true
	},

	initialize: function(){
		var defined = function(obj){
			return obj != null;
		};

		var params = Array.link(arguments, {
			'container': Type.isElement, //deprecated
			'options': Type.isObject,
			'togglers': defined,
			'elements': defined
		});
		this.parent(params.elements, params.options);

		var options = this.options,
			togglers = this.togglers = $$(params.togglers);

		this.previous = -1;
		this.internalChain = new Chain();

		if (options.alwaysHide) this.options.link = 'chain';

		if (options.show || this.options.show === 0){
			options.display = false;
			this.previous = options.show;
		}

		if (options.start){
			options.display = false;
			options.show = false;
		}

		var effects = this.effects = {};

		if (options.opacity) effects.opacity = 'fullOpacity';
		if (options.width) effects.width = options.fixedWidth ? 'fullWidth' : 'offsetWidth';
		if (options.height) effects.height = options.fixedHeight ? 'fullHeight' : 'scrollHeight';

		for (var i = 0, l = togglers.length; i < l; i++) this.addSection(togglers[i], this.elements[i]);

		this.elements.each(function(el, i){
			if (options.show === i){
				this.fireEvent('active', [togglers[i], el]);
			} else {
				for (var fx in effects) el.setStyle(fx, 0);
			}
		}, this);

		if (options.display || options.display === 0 || options.initialDisplayFx === false){
			this.display(options.display, options.initialDisplayFx);
		}

		if (options.fixedHeight !== false) options.resetHeight = false;
		this.addEvent('complete', this.internalChain.callChain.bind(this.internalChain));
	},

	addSection: function(toggler, element){
		toggler = document.id(toggler);
		element = document.id(element);
		this.togglers.include(toggler);
		this.elements.include(element);

		var togglers = this.togglers,
			options = this.options,
			test = togglers.contains(toggler),
			idx = togglers.indexOf(toggler),
			displayer = this.display.pass(idx, this);

		toggler.store('accordion:display', displayer)
			.addEvent(options.trigger, displayer);

		if (options.height) element.setStyles({'padding-top': 0, 'border-top': 'none', 'padding-bottom': 0, 'border-bottom': 'none'});
		if (options.width) element.setStyles({'padding-left': 0, 'border-left': 'none', 'padding-right': 0, 'border-right': 'none'});

		element.fullOpacity = 1;
		if (options.fixedWidth) element.fullWidth = options.fixedWidth;
		if (options.fixedHeight) element.fullHeight = options.fixedHeight;
		element.setStyle('overflow', 'hidden');

		if (!test) for (var fx in this.effects){
			element.setStyle(fx, 0);
		}
		return this;
	},

	removeSection: function(toggler, displayIndex){
		var togglers = this.togglers,
			idx = togglers.indexOf(toggler),
			element = this.elements[idx];

		var remover = function(){
			togglers.erase(toggler);
			this.elements.erase(element);
			this.detach(toggler);
		}.bind(this);

		if (this.now == idx || displayIndex != null){
			this.display(displayIndex != null ? displayIndex : (idx - 1 >= 0 ? idx - 1 : 0)).chain(remover);
		} else {
			remover();
		}
		return this;
	},

	detach: function(toggler){
		var remove = function(toggler){
			toggler.removeEvent(this.options.trigger, toggler.retrieve('accordion:display'));
		}.bind(this);

		if (!toggler) this.togglers.each(remove);
		else remove(toggler);
		return this;
	},

	display: function(index, useFx){
		if (!this.check(index, useFx)) return this;

		var obj = {},
			elements = this.elements,
			options = this.options,
			effects = this.effects;

		if (useFx == null) useFx = true;
		if (typeOf(index) == 'element') index = elements.indexOf(index);
		if (index == this.previous && !options.alwaysHide) return this;

		if (options.resetHeight){
			var prev = elements[this.previous];
			if (prev && !this.selfHidden){
				for (var fx in effects) prev.setStyle(fx, prev[effects[fx]]);
			}
		}

		if ((this.timer && options.link == 'chain') || (index === this.previous && !options.alwaysHide)) return this;

		this.previous = index;
		this.selfHidden = false;

		elements.each(function(el, i){
			obj[i] = {};
			var hide;
			if (i != index){
				hide = true;
			} else if (options.alwaysHide && ((el.offsetHeight > 0 && options.height) || el.offsetWidth > 0 && options.width)){
				hide = true;
				this.selfHidden = true;
			}
			this.fireEvent(hide ? 'background' : 'active', [this.togglers[i], el]);
			for (var fx in effects) obj[i][fx] = hide ? 0 : el[effects[fx]];
			if (!useFx && !hide && options.resetHeight) obj[i].height = 'auto';
		}, this);

		this.internalChain.clearChain();
		this.internalChain.chain(function(){
			if (options.resetHeight && !this.selfHidden){
				var el = elements[index];
				if (el) el.setStyle('height', 'auto');
			}
		}.bind(this));

		return useFx ? this.start(obj) : this.set(obj).internalChain.callChain();
	}

});




/*
---

script: Element.Position.js

name: Element.Position

description: Extends the Element native object to include methods useful positioning elements relative to others.

license: MIT-style license

authors:
  - Aaron Newton
  - Jacob Thornton

requires:
  - Core/Options
  - Core/Element.Dimensions
  - Element.Measure

provides: [Element.Position]

...
*/

(function(original){

var local = Element.Position = {

	options: {/*
		edge: false,
		returnPos: false,
		minimum: {x: 0, y: 0},
		maximum: {x: 0, y: 0},
		relFixedPosition: false,
		ignoreMargins: false,
		ignoreScroll: false,
		allowNegative: false,*/
		relativeTo: document.body,
		position: {
			x: 'center', //left, center, right
			y: 'center' //top, center, bottom
		},
		offset: {x: 0, y: 0}
	},

	getOptions: function(element, options){
		options = Object.merge({}, local.options, options);
		local.setPositionOption(options);
		local.setEdgeOption(options);
		local.setOffsetOption(element, options);
		local.setDimensionsOption(element, options);
		return options;
	},

	setPositionOption: function(options){
		options.position = local.getCoordinateFromValue(options.position);
	},

	setEdgeOption: function(options){
		var edgeOption = local.getCoordinateFromValue(options.edge);
		options.edge = edgeOption ? edgeOption :
			(options.position.x == 'center' && options.position.y == 'center') ? {x: 'center', y: 'center'} :
			{x: 'left', y: 'top'};
	},

	setOffsetOption: function(element, options){
		var parentOffset = {x: 0, y: 0},
			offsetParent = element.measure(function(){
				return document.id(this.getOffsetParent());
			}),
			parentScroll = offsetParent.getScroll();

		if (!offsetParent || offsetParent == element.getDocument().body) return;
		parentOffset = offsetParent.measure(function(){
			var position = this.getPosition();
			if (this.getStyle('position') == 'fixed'){
				var scroll = window.getScroll();
				position.x += scroll.x;
				position.y += scroll.y;
			}
			return position;
		});

		options.offset = {
			parentPositioned: offsetParent != document.id(options.relativeTo),
			x: options.offset.x - parentOffset.x + parentScroll.x,
			y: options.offset.y - parentOffset.y + parentScroll.y
		};
	},

	setDimensionsOption: function(element, options){
		options.dimensions = element.getDimensions({
			computeSize: true,
			styles: ['padding', 'border', 'margin']
		});
	},

	getPosition: function(element, options){
		var position = {};
		options = local.getOptions(element, options);
		var relativeTo = document.id(options.relativeTo) || document.body;

		local.setPositionCoordinates(options, position, relativeTo);
		if (options.edge) local.toEdge(position, options);

		var offset = options.offset;
		position.left = ((position.x >= 0 || offset.parentPositioned || options.allowNegative) ? position.x : 0).toInt();
		position.top = ((position.y >= 0 || offset.parentPositioned || options.allowNegative) ? position.y : 0).toInt();

		local.toMinMax(position, options);

		if (options.relFixedPosition || relativeTo.getStyle('position') == 'fixed') local.toRelFixedPosition(relativeTo, position);
		if (options.ignoreScroll) local.toIgnoreScroll(relativeTo, position);
		if (options.ignoreMargins) local.toIgnoreMargins(position, options);

		position.left = Math.ceil(position.left);
		position.top = Math.ceil(position.top);
		delete position.x;
		delete position.y;

		return position;
	},

	setPositionCoordinates: function(options, position, relativeTo){
		var offsetY = options.offset.y,
			offsetX = options.offset.x,
			calc = (relativeTo == document.body) ? window.getScroll() : relativeTo.getPosition(),
			top = calc.y,
			left = calc.x,
			winSize = window.getSize();

		switch(options.position.x){
			case 'left': position.x = left + offsetX; break;
			case 'right': position.x = left + offsetX + relativeTo.offsetWidth; break;
			default: position.x = left + ((relativeTo == document.body ? winSize.x : relativeTo.offsetWidth) / 2) + offsetX; break;
		}

		switch(options.position.y){
			case 'top': position.y = top + offsetY; break;
			case 'bottom': position.y = top + offsetY + relativeTo.offsetHeight; break;
			default: position.y = top + ((relativeTo == document.body ? winSize.y : relativeTo.offsetHeight) / 2) + offsetY; break;
		}
	},

	toMinMax: function(position, options){
		var xy = {left: 'x', top: 'y'}, value;
		['minimum', 'maximum'].each(function(minmax){
			['left', 'top'].each(function(lr){
				value = options[minmax] ? options[minmax][xy[lr]] : null;
				if (value != null && ((minmax == 'minimum') ? position[lr] < value : position[lr] > value)) position[lr] = value;
			});
		});
	},

	toRelFixedPosition: function(relativeTo, position){
		var winScroll = window.getScroll();
		position.top += winScroll.y;
		position.left += winScroll.x;
	},

	toIgnoreScroll: function(relativeTo, position){
		var relScroll = relativeTo.getScroll();
		position.top -= relScroll.y;
		position.left -= relScroll.x;
	},

	toIgnoreMargins: function(position, options){
		position.left += options.edge.x == 'right'
			? options.dimensions['margin-right']
			: (options.edge.x != 'center'
				? -options.dimensions['margin-left']
				: -options.dimensions['margin-left'] + ((options.dimensions['margin-right'] + options.dimensions['margin-left']) / 2));

		position.top += options.edge.y == 'bottom'
			? options.dimensions['margin-bottom']
			: (options.edge.y != 'center'
				? -options.dimensions['margin-top']
				: -options.dimensions['margin-top'] + ((options.dimensions['margin-bottom'] + options.dimensions['margin-top']) / 2));
	},

	toEdge: function(position, options){
		var edgeOffset = {},
			dimensions = options.dimensions,
			edge = options.edge;

		switch(edge.x){
			case 'left': edgeOffset.x = 0; break;
			case 'right': edgeOffset.x = -dimensions.x - dimensions.computedRight - dimensions.computedLeft; break;
			// center
			default: edgeOffset.x = -(Math.round(dimensions.totalWidth / 2)); break;
		}

		switch(edge.y){
			case 'top': edgeOffset.y = 0; break;
			case 'bottom': edgeOffset.y = -dimensions.y - dimensions.computedTop - dimensions.computedBottom; break;
			// center
			default: edgeOffset.y = -(Math.round(dimensions.totalHeight / 2)); break;
		}

		position.x += edgeOffset.x;
		position.y += edgeOffset.y;
	},

	getCoordinateFromValue: function(option){
		if (typeOf(option) != 'string') return option;
		option = option.toLowerCase();

		return {
			x: option.test('left') ? 'left'
				: (option.test('right') ? 'right' : 'center'),
			y: option.test(/upper|top/) ? 'top'
				: (option.test('bottom') ? 'bottom' : 'center')
		};
	}

};

Element.implement({

	position: function(options){
		if (options && (options.x != null || options.y != null)){
			return (original ? original.apply(this, arguments) : this);
		}
		var position = this.setStyle('position', 'absolute').calculatePosition(options);
		return (options && options.returnPos) ? position : this.setStyles(position);
	},

	calculatePosition: function(options){
		return local.getPosition(this, options);
	}

});

})(Element.prototype.position);


/*
---

script: Fx.Move.js

name: Fx.Move

description: Defines Fx.Move, a class that works with Element.Position.js to transition an element from one location to another.

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - Core/Fx.Morph
  - /Element.Position

provides: [Fx.Move]

...
*/

Fx.Move = new Class({

	Extends: Fx.Morph,

	options: {
		relativeTo: document.body,
		position: 'center',
		edge: false,
		offset: {x: 0, y: 0}
	},

	start: function(destination){
		var element = this.element,
			topLeft = element.getStyles('top', 'left');
		if (topLeft.top == 'auto' || topLeft.left == 'auto'){
			element.setPosition(element.getPosition(element.getOffsetParent()));
		}
		return this.parent(element.position(Object.merge({}, this.options, destination, {returnPos: true})));
	}

});

Element.Properties.move = {

	set: function(options){
		this.get('move').cancel().setOptions(options);
		return this;
	},

	get: function(){
		var move = this.retrieve('move');
		if (!move){
			move = new Fx.Move(this, {link: 'cancel'});
			this.store('move', move);
		}
		return move;
	}

};

Element.implement({

	move: function(options){
		this.get('move').start(options);
		return this;
	}

});


/*
---

script: Element.Shortcuts.js

name: Element.Shortcuts

description: Extends the Element native object to include some shortcut methods.

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - Core/Element.Style
  - /MooTools.More

provides: [Element.Shortcuts]

...
*/

Element.implement({

	isDisplayed: function(){
		return this.getStyle('display') != 'none';
	},

	isVisible: function(){
		var w = this.offsetWidth,
			h = this.offsetHeight;
		return (w == 0 && h == 0) ? false : (w > 0 && h > 0) ? true : this.style.display != 'none';
	},

	toggle: function(){
		return this[this.isDisplayed() ? 'hide' : 'show']();
	},

	hide: function(){
		var d;
		try {
			//IE fails here if the element is not in the dom
			d = this.getStyle('display');
		} catch(e){}
		if (d == 'none') return this;
		return this.store('element:_originalDisplay', d || '').setStyle('display', 'none');
	},

	show: function(display){
		if (!display && this.isDisplayed()) return this;
		display = display || this.retrieve('element:_originalDisplay') || 'block';
		return this.setStyle('display', (display == 'none') ? 'block' : display);
	},

	swapClass: function(remove, add){
		return this.removeClass(remove).addClass(add);
	}

});

Document.implement({

	clearSelection: function(){
		if (window.getSelection){
			var selection = window.getSelection();
			if (selection && selection.removeAllRanges) selection.removeAllRanges();
		} else if (document.selection && document.selection.empty){
			try {
				//IE fails here if selected element is not in dom
				document.selection.empty();
			} catch(e){}
		}
	}

});


/*
---

script: Fx.Reveal.js

name: Fx.Reveal

description: Defines Fx.Reveal, a class that shows and hides elements with a transition.

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - Core/Fx.Morph
  - /Element.Shortcuts
  - /Element.Measure

provides: [Fx.Reveal]

...
*/

(function(){


var hideTheseOf = function(object){
	var hideThese = object.options.hideInputs;
	if (window.OverText){
		var otClasses = [null];
		OverText.each(function(ot){
			otClasses.include('.' + ot.options.labelClass);
		});
		if (otClasses) hideThese += otClasses.join(', ');
	}
	return (hideThese) ? object.element.getElements(hideThese) : null;
};


Fx.Reveal = new Class({

	Extends: Fx.Morph,

	options: {/*
		onShow: function(thisElement){},
		onHide: function(thisElement){},
		onComplete: function(thisElement){},
		heightOverride: null,
		widthOverride: null,*/
		link: 'cancel',
		styles: ['padding', 'border', 'margin'],
		transitionOpacity: !Browser.ie6,
		mode: 'vertical',
		display: function(){
			return this.element.get('tag') != 'tr' ? 'block' : 'table-row';
		},
		opacity: 1,
		hideInputs: Browser.ie ? 'select, input, textarea, object, embed' : null
	},

	dissolve: function(){
		if (!this.hiding && !this.showing){
			if (this.element.getStyle('display') != 'none'){
				this.hiding = true;
				this.showing = false;
				this.hidden = true;
				this.cssText = this.element.style.cssText;

				var startStyles = this.element.getComputedSize({
					styles: this.options.styles,
					mode: this.options.mode
				});
				if (this.options.transitionOpacity) startStyles.opacity = this.options.opacity;

				var zero = {};
				Object.each(startStyles, function(style, name){
					zero[name] = [style, 0];
				});

				this.element.setStyles({
					display: Function.from(this.options.display).call(this),
					overflow: 'hidden'
				});

				var hideThese = hideTheseOf(this);
				if (hideThese) hideThese.setStyle('visibility', 'hidden');

				this.$chain.unshift(function(){
					if (this.hidden){
						this.hiding = false;
						this.element.style.cssText = this.cssText;
						this.element.setStyle('display', 'none');
						if (hideThese) hideThese.setStyle('visibility', 'visible');
					}
					this.fireEvent('hide', this.element);
					this.callChain();
				}.bind(this));

				this.start(zero);
			} else {
				this.callChain.delay(10, this);
				this.fireEvent('complete', this.element);
				this.fireEvent('hide', this.element);
			}
		} else if (this.options.link == 'chain'){
			this.chain(this.dissolve.bind(this));
		} else if (this.options.link == 'cancel' && !this.hiding){
			this.cancel();
			this.dissolve();
		}
		return this;
	},

	reveal: function(){
		if (!this.showing && !this.hiding){
			if (this.element.getStyle('display') == 'none'){
				this.hiding = false;
				this.showing = true;
				this.hidden = false;
				this.cssText = this.element.style.cssText;

				var startStyles;
				this.element.measure(function(){
					startStyles = this.element.getComputedSize({
						styles: this.options.styles,
						mode: this.options.mode
					});
				}.bind(this));
				if (this.options.heightOverride != null) startStyles.height = this.options.heightOverride.toInt();
				if (this.options.widthOverride != null) startStyles.width = this.options.widthOverride.toInt();
				if (this.options.transitionOpacity){
					this.element.setStyle('opacity', 0);
					startStyles.opacity = this.options.opacity;
				}

				var zero = {
					height: 0,
					display: Function.from(this.options.display).call(this)
				};
				Object.each(startStyles, function(style, name){
					zero[name] = 0;
				});
				zero.overflow = 'hidden';

				this.element.setStyles(zero);

				var hideThese = hideTheseOf(this);
				if (hideThese) hideThese.setStyle('visibility', 'hidden');

				this.$chain.unshift(function(){
					this.element.style.cssText = this.cssText;
					this.element.setStyle('display', Function.from(this.options.display).call(this));
					if (!this.hidden) this.showing = false;
					if (hideThese) hideThese.setStyle('visibility', 'visible');
					this.callChain();
					this.fireEvent('show', this.element);
				}.bind(this));

				this.start(startStyles);
			} else {
				this.callChain();
				this.fireEvent('complete', this.element);
				this.fireEvent('show', this.element);
			}
		} else if (this.options.link == 'chain'){
			this.chain(this.reveal.bind(this));
		} else if (this.options.link == 'cancel' && !this.showing){
			this.cancel();
			this.reveal();
		}
		return this;
	},

	toggle: function(){
		if (this.element.getStyle('display') == 'none'){
			this.reveal();
		} else {
			this.dissolve();
		}
		return this;
	},

	cancel: function(){
		this.parent.apply(this, arguments);
		if (this.cssText != null) this.element.style.cssText = this.cssText;
		this.hiding = false;
		this.showing = false;
		return this;
	}

});

Element.Properties.reveal = {

	set: function(options){
		this.get('reveal').cancel().setOptions(options);
		return this;
	},

	get: function(){
		var reveal = this.retrieve('reveal');
		if (!reveal){
			reveal = new Fx.Reveal(this);
			this.store('reveal', reveal);
		}
		return reveal;
	}

};

Element.Properties.dissolve = Element.Properties.reveal;

Element.implement({

	reveal: function(options){
		this.get('reveal').setOptions(options).reveal();
		return this;
	},

	dissolve: function(options){
		this.get('reveal').setOptions(options).dissolve();
		return this;
	},

	nix: function(options){
		var params = Array.link(arguments, {destroy: Type.isBoolean, options: Type.isObject});
		this.get('reveal').setOptions(options).dissolve().chain(function(){
			this[params.destroy ? 'destroy' : 'dispose']();
		}.bind(this));
		return this;
	},

	wink: function(){
		var params = Array.link(arguments, {duration: Type.isNumber, options: Type.isObject});
		var reveal = this.get('reveal').setOptions(params.options);
		reveal.reveal().chain(function(){
			(function(){
				reveal.dissolve();
			}).delay(params.duration || 2000);
		});
	}

});

})();


/*
---

script: Fx.Scroll.js

name: Fx.Scroll

description: Effect to smoothly scroll any element, including the window.

license: MIT-style license

authors:
  - Valerio Proietti

requires:
  - Core/Fx
  - Core/Element.Event
  - Core/Element.Dimensions
  - /MooTools.More

provides: [Fx.Scroll]

...
*/

(function(){

Fx.Scroll = new Class({

	Extends: Fx,

	options: {
		offset: {x: 0, y: 0},
		wheelStops: true
	},

	initialize: function(element, options){
		this.element = this.subject = document.id(element);
		this.parent(options);

		if (typeOf(this.element) != 'element') this.element = document.id(this.element.getDocument().body);

		if (this.options.wheelStops){
			var stopper = this.element,
				cancel = this.cancel.pass(false, this);
			this.addEvent('start', function(){
				stopper.addEvent('mousewheel', cancel);
			}, true);
			this.addEvent('complete', function(){
				stopper.removeEvent('mousewheel', cancel);
			}, true);
		}
	},

	set: function(){
		var now = Array.flatten(arguments);
		if (Browser.firefox) now = [Math.round(now[0]), Math.round(now[1])]; // not needed anymore in newer firefox versions
		this.element.scrollTo(now[0], now[1]);
		return this;
	},

	compute: function(from, to, delta){
		return [0, 1].map(function(i){
			return Fx.compute(from[i], to[i], delta);
		});
	},

	start: function(x, y){
		if (!this.check(x, y)) return this;
		var scroll = this.element.getScroll();
		return this.parent([scroll.x, scroll.y], [x, y]);
	},

	calculateScroll: function(x, y){
		var element = this.element,
			scrollSize = element.getScrollSize(),
			scroll = element.getScroll(),
			size = element.getSize(),
			offset = this.options.offset,
			values = {x: x, y: y};

		for (var z in values){
			if (!values[z] && values[z] !== 0) values[z] = scroll[z];
			if (typeOf(values[z]) != 'number') values[z] = scrollSize[z] - size[z];
			values[z] += offset[z];
		}
		return [values.x, values.y];
	},

	toTop: function(){
		return this.start.apply(this, this.calculateScroll(false, 0));
	},

	toLeft: function(){
		return this.start.apply(this, this.calculateScroll(0, false));
	},

	toRight: function(){
		return this.start.apply(this, this.calculateScroll('right', false));
	},

	toBottom: function(){
		return this.start.apply(this, this.calculateScroll(false, 'bottom'));
	},

	toElement: function(el, axes){
		axes = axes ? Array.from(axes) : ['x', 'y'];
		var scroll = isBody(this.element) ? {x: 0, y: 0} : this.element.getScroll();
		var position = Object.map(document.id(el).getPosition(this.element), function(value, axis){
			return axes.contains(axis) ? value + scroll[axis] : false;
		});
		return this.start.apply(this, this.calculateScroll(position.x, position.y));
	},

	//fix for issue #1205
	toElementEdge: function(el, axes, offset){
		axes = axes ? Array.from(axes) : ['x', 'y'];
		el = document.id(el);
		var to = {},
			coords = el.getCoordinates(this.element),
			scroll = this.element.getScroll(),
			containerSize = this.element.getSize(),
			edge = {
				x: coords.right + scroll.x,
				y: coords.bottom + scroll.y
			};
		['x', 'y'].each(function(axis){
			if (axes.contains(axis) && edge[axis] > scroll[axis] + containerSize[axis]){
				to[axis] = edge[axis] - containerSize[axis];
			}
			if (to[axis] == null) to[axis] = scroll[axis];
			if (offset && offset[axis]) to[axis] = to[axis] + offset[axis];
		});
		return (to.x != scroll.x || to.y != scroll.y) ? this.start(to.x, to.y) : this;
	},

	toElementCenter: function(el, axes, offset){
		axes = axes ? Array.from(axes) : ['x', 'y'];
		el = document.id(el);
		var to = {},
			position = el.getPosition(this.element),
			size = el.getSize(),
			scroll = this.element.getScroll(),
			containerSize = this.element.getSize();

		['x', 'y'].each(function(axis){
			if (axes.contains(axis)){
				to[axis] = position[axis] - (containerSize[axis] - size[axis]) / 2;
			}
			if (to[axis] == null) to[axis] = scroll[axis];
			if (offset && offset[axis]) to[axis] = to[axis] + offset[axis];
		}, this);

		if (to.x != scroll.x || to.y != scroll.y) this.start(to.x, to.y);
		return this;
	}

});



function isBody(element){
	return (/^(?:body|html)$/i).test(element.tagName);
}

})();


/*
---

script: Fx.Slide.js

name: Fx.Slide

description: Effect to slide an element in and out of view.

license: MIT-style license

authors:
  - Valerio Proietti

requires:
  - Core/Fx
  - Core/Element.Style
  - /MooTools.More

provides: [Fx.Slide]

...
*/

Fx.Slide = new Class({

	Extends: Fx,

	options: {
		mode: 'vertical',
		wrapper: false,
		hideOverflow: true,
		resetHeight: false
	},

	initialize: function(element, options){
		element = this.element = this.subject = document.id(element);
		this.parent(options);
		options = this.options;

		var wrapper = element.retrieve('wrapper'),
			styles = element.getStyles('margin', 'position', 'overflow');

		if (options.hideOverflow) styles = Object.append(styles, {overflow: 'hidden'});
		if (options.wrapper) wrapper = document.id(options.wrapper).setStyles(styles);

		if (!wrapper) wrapper = new Element('div', {
			styles: styles
		}).wraps(element);

		element.store('wrapper', wrapper).setStyle('margin', 0);
		if (element.getStyle('overflow') == 'visible') element.setStyle('overflow', 'hidden');

		this.now = [];
		this.open = true;
		this.wrapper = wrapper;

		this.addEvent('complete', function(){
			this.open = (wrapper['offset' + this.layout.capitalize()] != 0);
			if (this.open && this.options.resetHeight) wrapper.setStyle('height', '');
		}, true);
	},

	vertical: function(){
		this.margin = 'margin-top';
		this.layout = 'height';
		this.offset = this.element.offsetHeight;
	},

	horizontal: function(){
		this.margin = 'margin-left';
		this.layout = 'width';
		this.offset = this.element.offsetWidth;
	},

	set: function(now){
		this.element.setStyle(this.margin, now[0]);
		this.wrapper.setStyle(this.layout, now[1]);
		return this;
	},

	compute: function(from, to, delta){
		return [0, 1].map(function(i){
			return Fx.compute(from[i], to[i], delta);
		});
	},

	start: function(how, mode){
		if (!this.check(how, mode)) return this;
		this[mode || this.options.mode]();

		var margin = this.element.getStyle(this.margin).toInt(),
			layout = this.wrapper.getStyle(this.layout).toInt(),
			caseIn = [[margin, layout], [0, this.offset]],
			caseOut = [[margin, layout], [-this.offset, 0]],
			start;

		switch (how){
			case 'in': start = caseIn; break;
			case 'out': start = caseOut; break;
			case 'toggle': start = (layout == 0) ? caseIn : caseOut;
		}
		return this.parent(start[0], start[1]);
	},

	slideIn: function(mode){
		return this.start('in', mode);
	},

	slideOut: function(mode){
		return this.start('out', mode);
	},

	hide: function(mode){
		this[mode || this.options.mode]();
		this.open = false;
		return this.set([-this.offset, 0]);
	},

	show: function(mode){
		this[mode || this.options.mode]();
		this.open = true;
		return this.set([0, this.offset]);
	},

	toggle: function(mode){
		return this.start('toggle', mode);
	}

});

Element.Properties.slide = {

	set: function(options){
		this.get('slide').cancel().setOptions(options);
		return this;
	},

	get: function(){
		var slide = this.retrieve('slide');
		if (!slide){
			slide = new Fx.Slide(this, {link: 'cancel'});
			this.store('slide', slide);
		}
		return slide;
	}

};

Element.implement({

	slide: function(how, mode){
		how = how || 'toggle';
		var slide = this.get('slide'), toggle;
		switch (how){
			case 'hide': slide.hide(mode); break;
			case 'show': slide.show(mode); break;
			case 'toggle':
				var flag = this.retrieve('slide:flag', slide.open);
				slide[flag ? 'slideOut' : 'slideIn'](mode);
				this.store('slide:flag', !flag);
				toggle = true;
			break;
			default: slide.start(how, mode);
		}
		if (!toggle) this.eliminate('slide:flag');
		return this;
	}

});


/*
---

script: Drag.js

name: Drag

description: The base Drag Class. Can be used to drag and resize Elements using mouse events.

license: MIT-style license

authors:
  - Valerio Proietti
  - Tom Occhinno
  - Jan Kassens

requires:
  - Core/Events
  - Core/Options
  - Core/Element.Event
  - Core/Element.Style
  - Core/Element.Dimensions
  - /MooTools.More

provides: [Drag]
...

*/

var Drag = new Class({

	Implements: [Events, Options],

	options: {/*
		onBeforeStart: function(thisElement){},
		onStart: function(thisElement, event){},
		onSnap: function(thisElement){},
		onDrag: function(thisElement, event){},
		onCancel: function(thisElement){},
		onComplete: function(thisElement, event){},*/
		snap: 6,
		unit: 'px',
		grid: false,
		style: true,
		limit: false,
		handle: false,
		invert: false,
		preventDefault: false,
		stopPropagation: false,
		modifiers: {x: 'left', y: 'top'}
	},

	initialize: function(){
		var params = Array.link(arguments, {
			'options': Type.isObject,
			'element': function(obj){
				return obj != null;
			}
		});

		this.element = document.id(params.element);
		this.document = this.element.getDocument();
		this.setOptions(params.options || {});
		var htype = typeOf(this.options.handle);
		this.handles = ((htype == 'array' || htype == 'collection') ? $$(this.options.handle) : document.id(this.options.handle)) || this.element;
		this.mouse = {'now': {}, 'pos': {}};
		this.value = {'start': {}, 'now': {}};

		this.selection = (Browser.ie) ? 'selectstart' : 'mousedown';


		if (Browser.ie && !Drag.ondragstartFixed){
			document.ondragstart = Function.from(false);
			Drag.ondragstartFixed = true;
		}

		this.bound = {
			start: this.start.bind(this),
			check: this.check.bind(this),
			drag: this.drag.bind(this),
			stop: this.stop.bind(this),
			cancel: this.cancel.bind(this),
			eventStop: Function.from(false)
		};
		this.attach();
	},

	attach: function(){
		this.handles.addEvent('mousedown', this.bound.start);
		return this;
	},

	detach: function(){
		this.handles.removeEvent('mousedown', this.bound.start);
		return this;
	},

	start: function(event){
		var options = this.options;

		if (event.rightClick) return;

		if (options.preventDefault) event.preventDefault();
		if (options.stopPropagation) event.stopPropagation();
		this.mouse.start = event.page;

		this.fireEvent('beforeStart', this.element);

		var limit = options.limit;
		this.limit = {x: [], y: []};

		var z, coordinates;
		for (z in options.modifiers){
			if (!options.modifiers[z]) continue;

			var style = this.element.getStyle(options.modifiers[z]);

			// Some browsers (IE and Opera) don't always return pixels.
			if (style && !style.match(/px$/)){
				if (!coordinates) coordinates = this.element.getCoordinates(this.element.getOffsetParent());
				style = coordinates[options.modifiers[z]];
			}

			if (options.style) this.value.now[z] = (style || 0).toInt();
			else this.value.now[z] = this.element[options.modifiers[z]];

			if (options.invert) this.value.now[z] *= -1;

			this.mouse.pos[z] = event.page[z] - this.value.now[z];

			if (limit && limit[z]){
				var i = 2;
				while (i--){
					var limitZI = limit[z][i];
					if (limitZI || limitZI === 0) this.limit[z][i] = (typeof limitZI == 'function') ? limitZI() : limitZI;
				}
			}
		}

		if (typeOf(this.options.grid) == 'number') this.options.grid = {
			x: this.options.grid,
			y: this.options.grid
		};

		var events = {
			mousemove: this.bound.check,
			mouseup: this.bound.cancel
		};
		events[this.selection] = this.bound.eventStop;
		this.document.addEvents(events);
	},

	check: function(event){
		if (this.options.preventDefault) event.preventDefault();
		var distance = Math.round(Math.sqrt(Math.pow(event.page.x - this.mouse.start.x, 2) + Math.pow(event.page.y - this.mouse.start.y, 2)));
		if (distance > this.options.snap){
			this.cancel();
			this.document.addEvents({
				mousemove: this.bound.drag,
				mouseup: this.bound.stop
			});
			this.fireEvent('start', [this.element, event]).fireEvent('snap', this.element);
		}
	},

	drag: function(event){
		var options = this.options;

		if (options.preventDefault) event.preventDefault();
		this.mouse.now = event.page;

		for (var z in options.modifiers){
			if (!options.modifiers[z]) continue;
			this.value.now[z] = this.mouse.now[z] - this.mouse.pos[z];

			if (options.invert) this.value.now[z] *= -1;

			if (options.limit && this.limit[z]){
				if ((this.limit[z][1] || this.limit[z][1] === 0) && (this.value.now[z] > this.limit[z][1])){
					this.value.now[z] = this.limit[z][1];
				} else if ((this.limit[z][0] || this.limit[z][0] === 0) && (this.value.now[z] < this.limit[z][0])){
					this.value.now[z] = this.limit[z][0];
				}
			}

			if (options.grid[z]) this.value.now[z] -= ((this.value.now[z] - (this.limit[z][0]||0)) % options.grid[z]);

			if (options.style) this.element.setStyle(options.modifiers[z], this.value.now[z] + options.unit);
			else this.element[options.modifiers[z]] = this.value.now[z];
		}

		this.fireEvent('drag', [this.element, event]);
	},

	cancel: function(event){
		this.document.removeEvents({
			mousemove: this.bound.check,
			mouseup: this.bound.cancel
		});
		if (event){
			this.document.removeEvent(this.selection, this.bound.eventStop);
			this.fireEvent('cancel', this.element);
		}
	},

	stop: function(event){
		var events = {
			mousemove: this.bound.drag,
			mouseup: this.bound.stop
		};
		events[this.selection] = this.bound.eventStop;
		this.document.removeEvents(events);
		if (event) this.fireEvent('complete', [this.element, event]);
	}

});

Element.implement({

	makeResizable: function(options){
		var drag = new Drag(this, Object.merge({
			modifiers: {
				x: 'width',
				y: 'height'
			}
		}, options));

		this.store('resizer', drag);
		return drag.addEvent('drag', function(){
			this.fireEvent('resize', drag);
		}.bind(this));
	}

});


/*
---

script: Drag.Move.js

name: Drag.Move

description: A Drag extension that provides support for the constraining of draggables to containers and droppables.

license: MIT-style license

authors:
  - Valerio Proietti
  - Tom Occhinno
  - Jan Kassens
  - Aaron Newton
  - Scott Kyle

requires:
  - Core/Element.Dimensions
  - /Drag

provides: [Drag.Move]

...
*/

Drag.Move = new Class({

	Extends: Drag,

	options: {/*
		onEnter: function(thisElement, overed){},
		onLeave: function(thisElement, overed){},
		onDrop: function(thisElement, overed, event){},*/
		droppables: [],
		container: false,
		precalculate: false,
		includeMargins: true,
		checkDroppables: true
	},

	initialize: function(element, options){
		this.parent(element, options);
		element = this.element;

		this.droppables = $$(this.options.droppables);
		this.container = document.id(this.options.container);

		if (this.container && typeOf(this.container) != 'element')
			this.container = document.id(this.container.getDocument().body);

		if (this.options.style){
			if (this.options.modifiers.x == 'left' && this.options.modifiers.y == 'top'){
				var parent = element.getOffsetParent(),
					styles = element.getStyles('left', 'top');
				if (parent && (styles.left == 'auto' || styles.top == 'auto')){
					element.setPosition(element.getPosition(parent));
				}
			}

			if (element.getStyle('position') == 'static') element.setStyle('position', 'absolute');
		}

		this.addEvent('start', this.checkDroppables, true);
		this.overed = null;
	},

	start: function(event){
		if (this.container) this.options.limit = this.calculateLimit();

		if (this.options.precalculate){
			this.positions = this.droppables.map(function(el){
				return el.getCoordinates();
			});
		}

		this.parent(event);
	},

	calculateLimit: function(){
		var element = this.element,
			container = this.container,

			offsetParent = document.id(element.getOffsetParent()) || document.body,
			containerCoordinates = container.getCoordinates(offsetParent),
			elementMargin = {},
			elementBorder = {},
			containerMargin = {},
			containerBorder = {},
			offsetParentPadding = {};

		['top', 'right', 'bottom', 'left'].each(function(pad){
			elementMargin[pad] = element.getStyle('margin-' + pad).toInt();
			elementBorder[pad] = element.getStyle('border-' + pad).toInt();
			containerMargin[pad] = container.getStyle('margin-' + pad).toInt();
			containerBorder[pad] = container.getStyle('border-' + pad).toInt();
			offsetParentPadding[pad] = offsetParent.getStyle('padding-' + pad).toInt();
		}, this);

		var width = element.offsetWidth + elementMargin.left + elementMargin.right,
			height = element.offsetHeight + elementMargin.top + elementMargin.bottom,
			left = 0,
			top = 0,
			right = containerCoordinates.right - containerBorder.right - width,
			bottom = containerCoordinates.bottom - containerBorder.bottom - height;

		if (this.options.includeMargins){
			left += elementMargin.left;
			top += elementMargin.top;
		} else {
			right += elementMargin.right;
			bottom += elementMargin.bottom;
		}

		if (element.getStyle('position') == 'relative'){
			var coords = element.getCoordinates(offsetParent);
			coords.left -= element.getStyle('left').toInt();
			coords.top -= element.getStyle('top').toInt();

			left -= coords.left;
			top -= coords.top;
			if (container.getStyle('position') != 'relative'){
				left += containerBorder.left;
				top += containerBorder.top;
			}
			right += elementMargin.left - coords.left;
			bottom += elementMargin.top - coords.top;

			if (container != offsetParent){
				left += containerMargin.left + offsetParentPadding.left;
				top += ((Browser.ie6 || Browser.ie7) ? 0 : containerMargin.top) + offsetParentPadding.top;
			}
		} else {
			left -= elementMargin.left;
			top -= elementMargin.top;
			if (container != offsetParent){
				left += containerCoordinates.left + containerBorder.left;
				top += containerCoordinates.top + containerBorder.top;
			}
		}

		return {
			x: [left, right],
			y: [top, bottom]
		};
	},

	getDroppableCoordinates: function(element){
		var position = element.getCoordinates();
		if (element.getStyle('position') == 'fixed'){
			var scroll = window.getScroll();
			position.left += scroll.x;
			position.right += scroll.x;
			position.top += scroll.y;
			position.bottom += scroll.y;
		}
		return position;
	},

	checkDroppables: function(){
		var overed = this.droppables.filter(function(el, i){
			el = this.positions ? this.positions[i] : this.getDroppableCoordinates(el);
			var now = this.mouse.now;
			return (now.x > el.left && now.x < el.right && now.y < el.bottom && now.y > el.top);
		}, this).getLast();

		if (this.overed != overed){
			if (this.overed) this.fireEvent('leave', [this.element, this.overed]);
			if (overed) this.fireEvent('enter', [this.element, overed]);
			this.overed = overed;
		}
	},

	drag: function(event){
		this.parent(event);
		if (this.options.checkDroppables && this.droppables.length) this.checkDroppables();
	},

	stop: function(event){
		this.checkDroppables();
		this.fireEvent('drop', [this.element, this.overed, event]);
		this.overed = null;
		return this.parent(event);
	}

});

Element.implement({

	makeDraggable: function(options){
		var drag = new Drag.Move(this, options);
		this.store('dragger', drag);
		return drag;
	}

});


/*
---

script: Slider.js

name: Slider

description: Class for creating horizontal and vertical slider controls.

license: MIT-style license

authors:
  - Valerio Proietti

requires:
  - Core/Element.Dimensions
  - /Class.Binds
  - /Drag
  - /Element.Measure

provides: [Slider]

...
*/

var Slider = new Class({

	Implements: [Events, Options],

	Binds: ['clickedElement', 'draggedKnob', 'scrolledElement'],

	options: {/*
		onTick: function(intPosition){},
		onChange: function(intStep){},
		onComplete: function(strStep){},*/
		onTick: function(position){
			this.setKnobPosition(position);
		},
		initialStep: 0,
		snap: false,
		offset: 0,
		range: false,
		wheel: false,
		steps: 100,
		mode: 'horizontal'
	},

	initialize: function(element, knob, options){
		this.setOptions(options);
		options = this.options;
		this.element = document.id(element);
		knob = this.knob = document.id(knob);
		this.previousChange = this.previousEnd = this.step = -1;

		var limit = {},
			modifiers = {x: false, y: false};

		switch (options.mode){
			case 'vertical':
				this.axis = 'y';
				this.property = 'top';
				this.offset = 'offsetHeight';
				break;
			case 'horizontal':
				this.axis = 'x';
				this.property = 'left';
				this.offset = 'offsetWidth';
		}

		this.setSliderDimensions();
		this.setRange(options.range);

		if (knob.getStyle('position') == 'static') knob.setStyle('position', 'relative');
		knob.setStyle(this.property, -options.offset);
		modifiers[this.axis] = this.property;
		limit[this.axis] = [-options.offset, this.full - options.offset];

		var dragOptions = {
			snap: 0,
			limit: limit,
			modifiers: modifiers,
			onDrag: this.draggedKnob,
			onStart: this.draggedKnob,
			onBeforeStart: (function(){
				this.isDragging = true;
			}).bind(this),
			onCancel: function(){
				this.isDragging = false;
			}.bind(this),
			onComplete: function(){
				this.isDragging = false;
				this.draggedKnob();
				this.end();
			}.bind(this)
		};
		if (options.snap) this.setSnap(dragOptions);

		this.drag = new Drag(knob, dragOptions);
		this.attach();
		if (options.initialStep != null) this.set(options.initialStep);
	},

	attach: function(){
		this.element.addEvent('mousedown', this.clickedElement);
		if (this.options.wheel) this.element.addEvent('mousewheel', this.scrolledElement);
		this.drag.attach();
		return this;
	},

	detach: function(){
		this.element.removeEvent('mousedown', this.clickedElement)
			.removeEvent('mousewheel', this.scrolledElement);
		this.drag.detach();
		return this;
	},

	autosize: function(){
		this.setSliderDimensions()
			.setKnobPosition(this.toPosition(this.step));
		this.drag.options.limit[this.axis] = [-this.options.offset, this.full - this.options.offset];
		if (this.options.snap) this.setSnap();
		return this;
	},

	setSnap: function(options){
		if (!options) options = this.drag.options;
		options.grid = Math.ceil(this.stepWidth);
		options.limit[this.axis][1] = this.full;
		return this;
	},

	setKnobPosition: function(position){
		if (this.options.snap) position = this.toPosition(this.step);
		this.knob.setStyle(this.property, position);
		return this;
	},

	setSliderDimensions: function(){
		this.full = this.element.measure(function(){
			this.half = this.knob[this.offset] / 2;
			return this.element[this.offset] - this.knob[this.offset] + (this.options.offset * 2);
		}.bind(this));
		return this;
	},

	set: function(step){
		if (!((this.range > 0) ^ (step < this.min))) step = this.min;
		if (!((this.range > 0) ^ (step > this.max))) step = this.max;

		this.step = Math.round(step);
		return this.checkStep()
			.fireEvent('tick', this.toPosition(this.step))
			.end();
	},

	setRange: function(range, pos){
		this.min = Array.pick([range[0], 0]);
		this.max = Array.pick([range[1], this.options.steps]);
		this.range = this.max - this.min;
		this.steps = this.options.steps || this.full;
		this.stepSize = Math.abs(this.range) / this.steps;
		this.stepWidth = this.stepSize * this.full / Math.abs(this.range);
		if (range) this.set(Array.pick([pos, this.step]).floor(this.min).max(this.max));
		return this;
	},

	clickedElement: function(event){
		if (this.isDragging || event.target == this.knob) return;

		var dir = this.range < 0 ? -1 : 1,
			position = event.page[this.axis] - this.element.getPosition()[this.axis] - this.half;

		position = position.limit(-this.options.offset, this.full - this.options.offset);

		this.step = Math.round(this.min + dir * this.toStep(position));

		this.checkStep()
			.fireEvent('tick', position)
			.end();
	},

	scrolledElement: function(event){
		var mode = (this.options.mode == 'horizontal') ? (event.wheel < 0) : (event.wheel > 0);
		this.set(this.step + (mode ? -1 : 1) * this.stepSize);
		event.stop();
	},

	draggedKnob: function(){
		var dir = this.range < 0 ? -1 : 1,
			position = this.drag.value.now[this.axis];

		position = position.limit(-this.options.offset, this.full -this.options.offset);

		this.step = Math.round(this.min + dir * this.toStep(position));
		this.checkStep();
	},

	checkStep: function(){
		var step = this.step;
		if (this.previousChange != step){
			this.previousChange = step;
			this.fireEvent('change', step);
		}
		return this;
	},

	end: function(){
		var step = this.step;
		if (this.previousEnd !== step){
			this.previousEnd = step;
			this.fireEvent('complete', step + '');
		}
		return this;
	},

	toStep: function(position){
		var step = (position + this.options.offset) * this.stepSize / this.full * this.steps;
		return this.options.steps ? Math.round(step -= step % this.stepSize) : step;
	},

	toPosition: function(step){
		return (this.full * Math.abs(this.min - step)) / (this.steps * this.stepSize) - this.options.offset;
	}

});


/*
---

script: Assets.js

name: Assets

description: Provides methods to dynamically load JavaScript, CSS, and Image files into the document.

license: MIT-style license

authors:
  - Valerio Proietti

requires:
  - Core/Element.Event
  - /MooTools.More

provides: [Assets]

...
*/

var Asset = {

	javascript: function(source, properties){
		if (!properties) properties = {};

		var script = new Element('script', {src: source, type: 'text/javascript'}),
			doc = properties.document || document,
			load = properties.onload || properties.onLoad;

		delete properties.onload;
		delete properties.onLoad;
		delete properties.document;

		if (load){
			if (typeof script.onreadystatechange != 'undefined'){
				script.addEvent('readystatechange', function(){
					if (['loaded', 'complete'].contains(this.readyState)) load.call(this);
				});
			} else {
				script.addEvent('load', load);
			}
		}

		return script.set(properties).inject(doc.head);
	},

	css: function(source, properties){
		if (!properties) properties = {};

		var link = new Element('link', {
			rel: 'stylesheet',
			media: 'screen',
			type: 'text/css',
			href: source
		});

		var load = properties.onload || properties.onLoad,
			doc = properties.document || document;

		delete properties.onload;
		delete properties.onLoad;
		delete properties.document;

		if (load) link.addEvent('load', load);
		return link.set(properties).inject(doc.head);
	},

	image: function(source, properties){
		if (!properties) properties = {};

		var image = new Image(),
			element = document.id(image) || new Element('img');

		['load', 'abort', 'error'].each(function(name){
			var type = 'on' + name,
				cap = 'on' + name.capitalize(),
				event = properties[type] || properties[cap] || function(){};

			delete properties[cap];
			delete properties[type];

			image[type] = function(){
				if (!image) return;
				if (!element.parentNode){
					element.width = image.width;
					element.height = image.height;
				}
				image = image.onload = image.onabort = image.onerror = null;
				event.delay(1, element, element);
				element.fireEvent(name, element, 1);
			};
		});

		image.src = element.src = source;
		if (image && image.complete) image.onload.delay(1);
		return element.set(properties);
	},

	images: function(sources, options){
		sources = Array.from(sources);

		var fn = function(){},
			counter = 0;

		options = Object.merge({
			onComplete: fn,
			onProgress: fn,
			onError: fn,
			properties: {}
		}, options);

		return new Elements(sources.map(function(source, index){
			return Asset.image(source, Object.append(options.properties, {
				onload: function(){
					counter++;
					options.onProgress.call(this, counter, index, source);
					if (counter == sources.length) options.onComplete();
				},
				onerror: function(){
					counter++;
					options.onError.call(this, counter, index, source);
					if (counter == sources.length) options.onComplete();
				}
			}));
		}));
	}

};


/*
---

script: Color.js

name: Color

description: Class for creating and manipulating colors in JavaScript. Supports HSB -> RGB Conversions and vice versa.

license: MIT-style license

authors:
  - Valerio Proietti

requires:
  - Core/Array
  - Core/String
  - Core/Number
  - Core/Hash
  - Core/Function
  - MooTools.More

provides: [Color]

...
*/

(function(){

var Color = this.Color = new Type('Color', function(color, type){
	if (arguments.length >= 3){
		type = 'rgb'; color = Array.slice(arguments, 0, 3);
	} else if (typeof color == 'string'){
		if (color.match(/rgb/)) color = color.rgbToHex().hexToRgb(true);
		else if (color.match(/hsb/)) color = color.hsbToRgb();
		else color = color.hexToRgb(true);
	}
	type = type || 'rgb';
	switch (type){
		case 'hsb':
			var old = color;
			color = color.hsbToRgb();
			color.hsb = old;
		break;
		case 'hex': color = color.hexToRgb(true); break;
	}
	color.rgb = color.slice(0, 3);
	color.hsb = color.hsb || color.rgbToHsb();
	color.hex = color.rgbToHex();
	return Object.append(color, this);
});

Color.implement({

	mix: function(){
		var colors = Array.slice(arguments);
		var alpha = (typeOf(colors.getLast()) == 'number') ? colors.pop() : 50;
		var rgb = this.slice();
		colors.each(function(color){
			color = new Color(color);
			for (var i = 0; i < 3; i++) rgb[i] = Math.round((rgb[i] / 100 * (100 - alpha)) + (color[i] / 100 * alpha));
		});
		return new Color(rgb, 'rgb');
	},

	invert: function(){
		return new Color(this.map(function(value){
			return 255 - value;
		}));
	},

	setHue: function(value){
		return new Color([value, this.hsb[1], this.hsb[2]], 'hsb');
	},

	setSaturation: function(percent){
		return new Color([this.hsb[0], percent, this.hsb[2]], 'hsb');
	},

	setBrightness: function(percent){
		return new Color([this.hsb[0], this.hsb[1], percent], 'hsb');
	}

});

this.$RGB = function(r, g, b){
	return new Color([r, g, b], 'rgb');
};

this.$HSB = function(h, s, b){
	return new Color([h, s, b], 'hsb');
};

this.$HEX = function(hex){
	return new Color(hex, 'hex');
};

Array.implement({

	rgbToHsb: function(){
		var red = this[0],
				green = this[1],
				blue = this[2],
				hue = 0;
		var max = Math.max(red, green, blue),
				min = Math.min(red, green, blue);
		var delta = max - min;
		var brightness = max / 255,
				saturation = (max != 0) ? delta / max : 0;
		if (saturation != 0){
			var rr = (max - red) / delta;
			var gr = (max - green) / delta;
			var br = (max - blue) / delta;
			if (red == max) hue = br - gr;
			else if (green == max) hue = 2 + rr - br;
			else hue = 4 + gr - rr;
			hue /= 6;
			if (hue < 0) hue++;
		}
		return [Math.round(hue * 360), Math.round(saturation * 100), Math.round(brightness * 100)];
	},

	hsbToRgb: function(){
		var br = Math.round(this[2] / 100 * 255);
		if (this[1] == 0){
			return [br, br, br];
		} else {
			var hue = this[0] % 360;
			var f = hue % 60;
			var p = Math.round((this[2] * (100 - this[1])) / 10000 * 255);
			var q = Math.round((this[2] * (6000 - this[1] * f)) / 600000 * 255);
			var t = Math.round((this[2] * (6000 - this[1] * (60 - f))) / 600000 * 255);
			switch (Math.floor(hue / 60)){
				case 0: return [br, t, p];
				case 1: return [q, br, p];
				case 2: return [p, br, t];
				case 3: return [p, q, br];
				case 4: return [t, p, br];
				case 5: return [br, p, q];
			}
		}
		return false;
	}

});

String.implement({

	rgbToHsb: function(){
		var rgb = this.match(/\d{1,3}/g);
		return (rgb) ? rgb.rgbToHsb() : null;
	},

	hsbToRgb: function(){
		var hsb = this.match(/\d{1,3}/g);
		return (hsb) ? hsb.hsbToRgb() : null;
	}

});

})();


/*
---

script: Keyboard.js

name: Keyboard

description: KeyboardEvents used to intercept events on a class for keyboard and format modifiers in a specific order so as to make alt+shift+c the same as shift+alt+c.

license: MIT-style license

authors:
  - Perrin Westrich
  - Aaron Newton
  - Scott Kyle

requires:
  - Core/Events
  - Core/Options
  - Core/Element.Event
  - Element.Event.Pseudos.Keys

provides: [Keyboard]

...
*/

(function(){

	var Keyboard = this.Keyboard = new Class({

		Extends: Events,

		Implements: [Options],

		options: {/*
			onActivate: function(){},
			onDeactivate: function(){},*/
			defaultEventType: 'keydown',
			active: false,
			manager: null,
			events: {},
			nonParsedEvents: ['activate', 'deactivate', 'onactivate', 'ondeactivate', 'changed', 'onchanged']
		},

		initialize: function(options){
			if (options && options.manager){
				this._manager = options.manager;
				delete options.manager;
			}
			this.setOptions(options);
			this._setup();
		},

		addEvent: function(type, fn, internal){
			return this.parent(Keyboard.parse(type, this.options.defaultEventType, this.options.nonParsedEvents), fn, internal);
		},

		removeEvent: function(type, fn){
			return this.parent(Keyboard.parse(type, this.options.defaultEventType, this.options.nonParsedEvents), fn);
		},

		toggleActive: function(){
			return this[this.isActive() ? 'deactivate' : 'activate']();
		},

		activate: function(instance){
			if (instance){
				if (instance.isActive()) return this;
				//if we're stealing focus, store the last keyboard to have it so the relinquish command works
				if (this._activeKB && instance != this._activeKB){
					this.previous = this._activeKB;
					this.previous.fireEvent('deactivate');
				}
				//if we're enabling a child, assign it so that events are now passed to it
				this._activeKB = instance.fireEvent('activate');
				Keyboard.manager.fireEvent('changed');
			} else if (this._manager){
				//else we're enabling ourselves, we must ask our parent to do it for us
				this._manager.activate(this);
			}
			return this;
		},

		isActive: function(){
			return this._manager ? (this._manager._activeKB == this) : (Keyboard.manager == this);
		},

		deactivate: function(instance){
			if (instance){
				if (instance === this._activeKB){
					this._activeKB = null;
					instance.fireEvent('deactivate');
					Keyboard.manager.fireEvent('changed');
				}
			} else if (this._manager){
				this._manager.deactivate(this);
			}
			return this;
		},

		relinquish: function(){
			if (this.isActive() && this._manager && this._manager.previous) this._manager.activate(this._manager.previous);
			else this.deactivate();
			return this;
		},

		//management logic
		manage: function(instance){
			if (instance._manager) instance._manager.drop(instance);
			this._instances.push(instance);
			instance._manager = this;
			if (!this._activeKB) this.activate(instance);
			return this;
		},

		drop: function(instance){
			instance.relinquish();
			this._instances.erase(instance);
			if (this._activeKB == instance){
				if (this.previous && this._instances.contains(this.previous)) this.activate(this.previous);
				else this._activeKB = this._instances[0];
			}
			return this;
		},

		trace: function(){
			Keyboard.trace(this);
		},

		each: function(fn){
			Keyboard.each(this, fn);
		},

		/*
			PRIVATE METHODS
		*/

		_instances: [],

		_disable: function(instance){
			if (this._activeKB == instance) this._activeKB = null;
		},

		_setup: function(){
			this.addEvents(this.options.events);
			//if this is the root manager, nothing manages it
			if (Keyboard.manager && !this._manager) Keyboard.manager.manage(this);
			if (this.options.active) this.activate();
			else this.relinquish();
		},

		_handle: function(event, type){
			//Keyboard.stop(event) prevents key propagation
			if (event.preventKeyboardPropagation) return;

			var bubbles = !!this._manager;
			if (bubbles && this._activeKB){
				this._activeKB._handle(event, type);
				if (event.preventKeyboardPropagation) return;
			}
			this.fireEvent(type, event);

			if (!bubbles && this._activeKB) this._activeKB._handle(event, type);
		}

	});

	var parsed = {};
	var modifiers = ['shift', 'control', 'alt', 'meta'];
	var regex = /^(?:shift|control|ctrl|alt|meta)$/;

	Keyboard.parse = function(type, eventType, ignore){
		if (ignore && ignore.contains(type.toLowerCase())) return type;

		type = type.toLowerCase().replace(/^(keyup|keydown):/, function($0, $1){
			eventType = $1;
			return '';
		});

		if (!parsed[type]){
			var key, mods = {};
			type.split('+').each(function(part){
				if (regex.test(part)) mods[part] = true;
				else key = part;
			});

			mods.control = mods.control || mods.ctrl; // allow both control and ctrl

			var keys = [];
			modifiers.each(function(mod){
				if (mods[mod]) keys.push(mod);
			});

			if (key) keys.push(key);
			parsed[type] = keys.join('+');
		}

		return eventType + ':keys(' + parsed[type] + ')';
	};

	Keyboard.each = function(keyboard, fn){
		var current = keyboard || Keyboard.manager;
		while (current){
			fn.run(current);
			current = current._activeKB;
		}
	};

	Keyboard.stop = function(event){
		event.preventKeyboardPropagation = true;
	};

	Keyboard.manager = new Keyboard({
		active: true
	});

	Keyboard.trace = function(keyboard){
		keyboard = keyboard || Keyboard.manager;
		var hasConsole = window.console && console.log;
		if (hasConsole) console.log('the following items have focus: ');
		Keyboard.each(keyboard, function(current){
			if (hasConsole) console.log(document.id(current.widget) || current.wiget || current);
		});
	};

	var handler = function(event){
		var keys = [];
		modifiers.each(function(mod){
			if (event[mod]) keys.push(mod);
		});

		if (!regex.test(event.key)) keys.push(event.key);
		Keyboard.manager._handle(event, event.type + ':keys(' + keys.join('+') + ')');
	};

	document.addEvents({
		'keyup': handler,
		'keydown': handler
	});

})();


/*
---

script: Keyboard.Extras.js

name: Keyboard.Extras

description: Enhances Keyboard by adding the ability to name and describe keyboard shortcuts, and the ability to grab shortcuts by name and bind the shortcut to different keys.

license: MIT-style license

authors:
  - Perrin Westrich

requires:
  - /Keyboard
  - /MooTools.More

provides: [Keyboard.Extras]

...
*/
Keyboard.prototype.options.nonParsedEvents.combine(['rebound', 'onrebound']);

Keyboard.implement({

	/*
		shortcut should be in the format of:
		{
			'keys': 'shift+s', // the default to add as an event.
			'description': 'blah blah blah', // a brief description of the functionality.
			'handler': function(){} // the event handler to run when keys are pressed.
		}
	*/
	addShortcut: function(name, shortcut){
		this._shortcuts = this._shortcuts || [];
		this._shortcutIndex = this._shortcutIndex || {};

		shortcut.getKeyboard = Function.from(this);
		shortcut.name = name;
		this._shortcutIndex[name] = shortcut;
		this._shortcuts.push(shortcut);
		if (shortcut.keys) this.addEvent(shortcut.keys, shortcut.handler);
		return this;
	},

	addShortcuts: function(obj){
		for (var name in obj) this.addShortcut(name, obj[name]);
		return this;
	},

	removeShortcut: function(name){
		var shortcut = this.getShortcut(name);
		if (shortcut && shortcut.keys){
			this.removeEvent(shortcut.keys, shortcut.handler);
			delete this._shortcutIndex[name];
			this._shortcuts.erase(shortcut);
		}
		return this;
	},

	removeShortcuts: function(names){
		names.each(this.removeShortcut, this);
		return this;
	},

	getShortcuts: function(){
		return this._shortcuts || [];
	},

	getShortcut: function(name){
		return (this._shortcutIndex || {})[name];
	}

});

Keyboard.rebind = function(newKeys, shortcuts){
	Array.from(shortcuts).each(function(shortcut){
		shortcut.getKeyboard().removeEvent(shortcut.keys, shortcut.handler);
		shortcut.getKeyboard().addEvent(newKeys, shortcut.handler);
		shortcut.keys = newKeys;
		shortcut.getKeyboard().fireEvent('rebound');
	});
};


Keyboard.getActiveShortcuts = function(keyboard){
	var activeKBS = [], activeSCS = [];
	Keyboard.each(keyboard, [].push.bind(activeKBS));
	activeKBS.each(function(kb){ activeSCS.extend(kb.getShortcuts()); });
	return activeSCS;
};

Keyboard.getShortcut = function(name, keyboard, opts){
	opts = opts || {};
	var shortcuts = opts.many ? [] : null,
		set = opts.many ? function(kb){
				var shortcut = kb.getShortcut(name);
				if (shortcut) shortcuts.push(shortcut);
			} : function(kb){
				if (!shortcuts) shortcuts = kb.getShortcut(name);
			};
	Keyboard.each(keyboard, set);
	return shortcuts;
};

Keyboard.getShortcuts = function(name, keyboard){
	return Keyboard.getShortcut(name, keyboard, { many: true });
};


/*

Copyright (C) 2011 by Yehuda Katz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

// lib/handlebars/browser-prefix.js
var Handlebars = {};

(function(Handlebars, undefined) {
;
// lib/handlebars/base.js

Handlebars.VERSION = "1.0.0";
Handlebars.COMPILER_REVISION = 4;

Handlebars.REVISION_CHANGES = {
  1: '<= 1.0.rc.2', // 1.0.rc.2 is actually rev2 but doesn't report it
  2: '== 1.0.0-rc.3',
  3: '== 1.0.0-rc.4',
  4: '>= 1.0.0'
};

Handlebars.helpers  = {};
Handlebars.partials = {};

var toString = Object.prototype.toString,
    functionType = '[object Function]',
    objectType = '[object Object]';

Handlebars.registerHelper = function(name, fn, inverse) {
  if (toString.call(name) === objectType) {
    if (inverse || fn) { throw new Handlebars.Exception('Arg not supported with multiple helpers'); }
    Handlebars.Utils.extend(this.helpers, name);
  } else {
    if (inverse) { fn.not = inverse; }
    this.helpers[name] = fn;
  }
};

Handlebars.registerPartial = function(name, str) {
  if (toString.call(name) === objectType) {
    Handlebars.Utils.extend(this.partials,  name);
  } else {
    this.partials[name] = str;
  }
};

Handlebars.registerHelper('helperMissing', function(arg) {
  if(arguments.length === 2) {
    return undefined;
  } else {
    throw new Error("Missing helper: '" + arg + "'");
  }
});

Handlebars.registerHelper('blockHelperMissing', function(context, options) {
  var inverse = options.inverse || function() {}, fn = options.fn;

  var type = toString.call(context);

  if(type === functionType) { context = context.call(this); }

  if(context === true) {
    return fn(this);
  } else if(context === false || context == null) {
    return inverse(this);
  } else if(type === "[object Array]") {
    if(context.length > 0) {
      return Handlebars.helpers.each(context, options);
    } else {
      return inverse(this);
    }
  } else {
    return fn(context);
  }
});

Handlebars.K = function() {};

Handlebars.createFrame = Object.create || function(object) {
  Handlebars.K.prototype = object;
  var obj = new Handlebars.K();
  Handlebars.K.prototype = null;
  return obj;
};

Handlebars.logger = {
  DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3, level: 3,

  methodMap: {0: 'debug', 1: 'info', 2: 'warn', 3: 'error'},

  // can be overridden in the host environment
  log: function(level, obj) {
    if (Handlebars.logger.level <= level) {
      var method = Handlebars.logger.methodMap[level];
      if (typeof console !== 'undefined' && console[method]) {
        console[method].call(console, obj);
      }
    }
  }
};

Handlebars.log = function(level, obj) { Handlebars.logger.log(level, obj); };

Handlebars.registerHelper('each', function(context, options) {
  var fn = options.fn, inverse = options.inverse;
  var i = 0, ret = "", data;

  var type = toString.call(context);
  if(type === functionType) { context = context.call(this); }

  if (options.data) {
    data = Handlebars.createFrame(options.data);
  }

  if(context && typeof context === 'object') {
    if(context instanceof Array){
      for(var j = context.length; i<j; i++) {
        if (data) { data.index = i; }
        ret = ret + fn(context[i], { data: data });
      }
    } else {
      for(var key in context) {
        if(context.hasOwnProperty(key)) {
          if(data) { data.key = key; }
          ret = ret + fn(context[key], {data: data});
          i++;
        }
      }
    }
  }

  if(i === 0){
    ret = inverse(this);
  }

  return ret;
});

Handlebars.registerHelper('if', function(conditional, options) {
  var type = toString.call(conditional);
  if(type === functionType) { conditional = conditional.call(this); }

  if(!conditional || Handlebars.Utils.isEmpty(conditional)) {
    return options.inverse(this);
  } else {
    return options.fn(this);
  }
});

Handlebars.registerHelper('unless', function(conditional, options) {
  return Handlebars.helpers['if'].call(this, conditional, {fn: options.inverse, inverse: options.fn});
});

Handlebars.registerHelper('with', function(context, options) {
  var type = toString.call(context);
  if(type === functionType) { context = context.call(this); }

  if (!Handlebars.Utils.isEmpty(context)) return options.fn(context);
});

Handlebars.registerHelper('log', function(context, options) {
  var level = options.data && options.data.level != null ? parseInt(options.data.level, 10) : 1;
  Handlebars.log(level, context);
});
;
// lib/handlebars/utils.js

var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];

Handlebars.Exception = function(message) {
  var tmp = Error.prototype.constructor.apply(this, arguments);

  // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
  for (var idx = 0; idx < errorProps.length; idx++) {
    this[errorProps[idx]] = tmp[errorProps[idx]];
  }
};
Handlebars.Exception.prototype = new Error();

// Build out our basic SafeString type
Handlebars.SafeString = function(string) {
  this.string = string;
};
Handlebars.SafeString.prototype.toString = function() {
  return this.string.toString();
};

var escape = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "`": "&#x60;"
};

var badChars = /[&<>"'`]/g;
var possible = /[&<>"'`]/;

var escapeChar = function(chr) {
  return escape[chr] || "&amp;";
};

Handlebars.Utils = {
  extend: function(obj, value) {
    for(var key in value) {
      if(value.hasOwnProperty(key)) {
        obj[key] = value[key];
      }
    }
  },

  escapeExpression: function(string) {
    // don't escape SafeStrings, since they're already safe
    if (string instanceof Handlebars.SafeString) {
      return string.toString();
    } else if (string == null || string === false) {
      return "";
    }

    // Force a string conversion as this will be done by the append regardless and
    // the regex test will do this transparently behind the scenes, causing issues if
    // an object's to string has escaped characters in it.
    string = string.toString();

    if(!possible.test(string)) { return string; }
    return string.replace(badChars, escapeChar);
  },

  isEmpty: function(value) {
    if (!value && value !== 0) {
      return true;
    } else if(toString.call(value) === "[object Array]" && value.length === 0) {
      return true;
    } else {
      return false;
    }
  }
};
;
// lib/handlebars/runtime.js

Handlebars.VM = {
  template: function(templateSpec) {
    // Just add water
    var container = {
      escapeExpression: Handlebars.Utils.escapeExpression,
      invokePartial: Handlebars.VM.invokePartial,
      programs: [],
      program: function(i, fn, data) {
        var programWrapper = this.programs[i];
        if(data) {
          programWrapper = Handlebars.VM.program(i, fn, data);
        } else if (!programWrapper) {
          programWrapper = this.programs[i] = Handlebars.VM.program(i, fn);
        }
        return programWrapper;
      },
      merge: function(param, common) {
        var ret = param || common;

        if (param && common) {
          ret = {};
          Handlebars.Utils.extend(ret, common);
          Handlebars.Utils.extend(ret, param);
        }
        return ret;
      },
      programWithDepth: Handlebars.VM.programWithDepth,
      noop: Handlebars.VM.noop,
      compilerInfo: null
    };

    return function(context, options) {
      options = options || {};
      var result = templateSpec.call(container, Handlebars, context, options.helpers, options.partials, options.data);

      var compilerInfo = container.compilerInfo || [],
          compilerRevision = compilerInfo[0] || 1,
          currentRevision = Handlebars.COMPILER_REVISION;

      if (compilerRevision !== currentRevision) {
        if (compilerRevision < currentRevision) {
          var runtimeVersions = Handlebars.REVISION_CHANGES[currentRevision],
              compilerVersions = Handlebars.REVISION_CHANGES[compilerRevision];
          throw "Template was precompiled with an older version of Handlebars than the current runtime. "+
                "Please update your precompiler to a newer version ("+runtimeVersions+") or downgrade your runtime to an older version ("+compilerVersions+").";
        } else {
          // Use the embedded version info since the runtime doesn't know about this revision yet
          throw "Template was precompiled with a newer version of Handlebars than the current runtime. "+
                "Please update your runtime to a newer version ("+compilerInfo[1]+").";
        }
      }

      return result;
    };
  },

  programWithDepth: function(i, fn, data /*, $depth */) {
    var args = Array.prototype.slice.call(arguments, 3);

    var program = function(context, options) {
      options = options || {};

      return fn.apply(this, [context, options.data || data].concat(args));
    };
    program.program = i;
    program.depth = args.length;
    return program;
  },
  program: function(i, fn, data) {
    var program = function(context, options) {
      options = options || {};

      return fn(context, options.data || data);
    };
    program.program = i;
    program.depth = 0;
    return program;
  },
  noop: function() { return ""; },
  invokePartial: function(partial, name, context, helpers, partials, data) {
    var options = { helpers: helpers, partials: partials, data: data };

    if(partial === undefined) {
      throw new Handlebars.Exception("The partial " + name + " could not be found");
    } else if(partial instanceof Function) {
      return partial(context, options);
    } else if (!Handlebars.compile) {
      throw new Handlebars.Exception("The partial " + name + " could not be compiled when running in runtime-only mode");
    } else {
      partials[name] = Handlebars.compile(partial, {data: data !== undefined});
      return partials[name](context, options);
    }
  }
};

Handlebars.template = Handlebars.VM.template;
;
// lib/handlebars/browser-suffix.js
})(Handlebars);
;
//Wrote this when drunk and bored as a step to rewriting qwebirc to be compatible with jquery underscore builds
// should be drop in replacable with underscore - I literally just removed polyfills that Mootools gaurentees

//     Underscore.js 1.5.1
//     http://underscorejs.org
//     (c) 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

    // Baseline setup
    // --------------

    // Establish the root object, `window` in the browser, or `exports` on the server.
    var root = this;

    // Save the previous value of the `_` variable.
    var previousUnderscore = root._;

    // Establish the object that gets returned to break out of a loop iteration.
    var breaker = {};

    // Save bytes in the minified (but not gzipped) version:
    var ArrayProto = Array.prototype,
        ObjProto = Object.prototype,
        FuncProto = Function.prototype;

    // Create quick reference variables for speed access to core prototypes.
    var
    push = ArrayProto.push,
        slice = ArrayProto.slice,
        concat = ArrayProto.concat,
        toString = ObjProto.toString,
        hasOwnProperty = ObjProto.hasOwnProperty;

    // All **ECMAScript 5** native function implementations that we hope to use
    // are declared here.
    var
    // nativeForEach = ArrayProto.forEach,
    //     nativeMap = ArrayProto.map,
    //     nativeReduce = ArrayProto.reduce,
    //     nativeReduceRight = ArrayProto.reduceRight,
    //     nativeFilter = ArrayProto.filter,
    //     nativeEvery = ArrayProto.every,
    //     nativeSome = ArrayProto.some,
        nativeIndexOf = ArrayProto.indexOf,
        nativeLastIndexOf = ArrayProto.lastIndexOf,
        // nativeIsArray = Array.isArray,
        // nativeKeys = Object.keys,
        nativeBind = FuncProto.bind;

    // Create a safe reference to the Underscore object for use below.
    var _ = function(obj) {
        if (obj instanceof _) return obj;
        if (!(this instanceof _)) return new _(obj);
        this._wrapped = obj;
    };

    // Export the Underscore object for **Node.js**, with
    // backwards-compatibility for the old `require()` API. If we're in
    // the browser, add `_` as a global object via a string identifier,
    // for Closure Compiler "advanced" mode.
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = _;
        }
        exports._ = _;
    } else {
        root._ = _;
    }

    // Current version.
    _.VERSION = '1.5.1';

    var isEnumerable = _.isEnumerable = Type.isEnumerable;

    // Collection Functions
    // --------------------

    // The cornerstone, an `each` implementation, aka `forEach`.
    // Handles objects with the built-in `forEach`, arrays, and raw objects.
    // Delegates to **ECMAScript 5**'s native `forEach` if available.
    var each = _.each = _.forEach = function(obj, iterator, context) {
        return (isEnumerable(obj) ? Array : Object).forEach(obj, iterator, context);
    };

    // Return the results of applying the iterator to each element.
    // Delegates to **ECMAScript 5**'s native `map` if available.
    _.map = _.collect = function(obj, iterator, context) {
        return (isEnumerable(obj) ? Array : Object).map(obj, iterator, context);
    };


    // **Reduce** builds up a single result from a list of values, aka `inject`,
    // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
    _.reduce = _.foldl = _.inject = Array.reduce;

    // The right-associative version of reduce, also known as `foldr`.
    // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
    _.reduceRight = _.foldr = Array.reduceRight;

    // Return the first value which passes a truth test. Aliased as `detect`.
    _.find = _.detect = function(obj, iterator, context) {
        var result;
        any(obj, function(value, index, list) {
            if (iterator.call(context, value, index, list)) {
                result = value;
                return true;
            }
        });
        return result;
    };

    // Return all the elements that pass a truth test.
    // Delegates to **ECMAScript 5**'s native `filter` if available.
    // Aliased as `select`.
    _.filter = _.select = function(obj, iterator, context) {
        return (isEnumerable(obj) ? Array : Object).filter(obj, iterator, context);
    };

    // Return all the elements for which a truth test fails.
    _.reject = function(obj, iterator, context) {
        return _.filter(obj, function(value, index, list) {
            return !iterator.call(context, value, index, list);
        }, context);
    };

    // Determine whether all of the elements match a truth test.
    // Delegates to **ECMAScript 5**'s native `every` if available.
    // Aliased as `all`.
    _.every = _.all = function(obj, iterator, context) {
        return (isEnumerable(obj) ? Array : Object).every(obj, iterator, context);
    };

    // Determine if at least one element in the object matches a truth test.
    // Delegates to **ECMAScript 5**'s native `some` if available.
    // Aliased as `any`.
    var any = _.some = _.any = function(obj, iterator, context) {
        return (isEnumerable(obj) ? Array : Object).some(obj, iterator, context);
    };

    // Determine if the array or object contains a given value (using `===`).
    // Aliased as `include`.
    _.contains = _.include = function(obj, target) {
        if (obj == null) return false;
        if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
        return any(obj, function(value) {
            return value === target;
        });
    };

    // Invoke a method (with arguments) on every item in a collection.
    _.invoke = function(obj, method) {
        var args = slice.call(arguments, 2);
        var isFunc = _.isFunction(method);
        return _.map(obj, function(value) {
            return (isFunc ? method : value[method]).apply(value, args);
        });
    };

    // Convenience version of a common use case of `map`: fetching a property.
    _.pluck = function(obj, key) {
        return _.map(obj, function(value) {
            return value[key];
        });
    };

    // Convenience version of a common use case of `filter`: selecting only objects
    // containing specific `key:value` pairs.
    _.where = function(obj, attrs, first) {
        if (_.isEmpty(attrs)) return first ? void 0 : [];
        return _[first ? 'find' : 'filter'](obj, function(value) {
            for (var key in attrs) {
                if (attrs[key] !== value[key]) return false;
            }
            return true;
        });
    };

    // Convenience version of a common use case of `find`: getting the first object
    // containing specific `key:value` pairs.
    _.findWhere = function(obj, attrs) {
        return _.where(obj, attrs, true);
    };

    // Return the maximum element or (element-based computation).
    // Can't optimize arrays of integers longer than 65,535 elements.
    // See [WebKit Bug 80797](https://bugs.webkit.org/show_bug.cgi?id=80797)
    _.max = function(obj, iterator, context) {
        if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
            return Math.max.apply(Math, obj);
        }
        if (!iterator && _.isEmpty(obj)) return -Infinity;
        var result = {
            computed: -Infinity,
            value: -Infinity
        };
        each(obj, function(value, index, list) {
            var computed = iterator ? iterator.call(context, value, index, list) : value;
            computed > result.computed && (result = {
                value: value,
                computed: computed
            });
        });
        return result.value;
    };

    // Return the minimum element (or element-based computation).
    _.min = function(obj, iterator, context) {
        if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
            return Math.min.apply(Math, obj);
        }
        if (!iterator && _.isEmpty(obj)) return Infinity;
        var result = {
            computed: Infinity,
            value: Infinity
        };
        each(obj, function(value, index, list) {
            var computed = iterator ? iterator.call(context, value, index, list) : value;
            computed < result.computed && (result = {
                value: value,
                computed: computed
            });
        });
        return result.value;
    };

    // Shuffle an array.
    _.shuffle = function(obj) {
        var rand;
        var index = 0;
        var shuffled = [];
        each(obj, function(value) {
            rand = _.random(index++);
            shuffled[index - 1] = shuffled[rand];
            shuffled[rand] = value;
        });
        return shuffled;
    };

    // An internal function to generate lookup iterators.
    var lookupIterator = function(value) {
        return _.isFunction(value) ? value : function(obj) {
            return obj[value];
        };
    };

    // Sort the object's values by a criterion produced by an iterator.
    _.sortBy = function(obj, value, context) {
        var iterator = lookupIterator(value);
        return _.pluck(_.map(obj, function(value, index, list) {
            return {
                value: value,
                index: index,
                criteria: iterator.call(context, value, index, list)
            };
        }).sort(function(left, right) {
            var a = left.criteria;
            var b = right.criteria;
            if (a !== b) {
                if (a > b || a === void 0) return 1;
                if (a < b || b === void 0) return -1;
            }
            return left.index < right.index ? -1 : 1;
        }), 'value');
    };

    // An internal function used for aggregate "group by" operations.
    var group = function(behavior) {
        return function(obj, value, context) {
            var result = {};
            var iterator = value == null ? _.identity : lookupIterator(value);
            each(obj, function(value, index) {
                var key = iterator.call(context, value, index, obj);
                behavior(result, key, value);
            });
            return result;
        };
    };

    // Groups the object's values by a criterion. Pass either a string attribute
    // to group by, or a function that returns the criterion.
    _.groupBy = group(function(result, key, value) {
        (_.has(result, key) ? result[key] : (result[key] = [])).push(value);
    });

    // Indexes the object's values by a criterion, similar to `groupBy`, but for
    // when you know that your index values will be unique.
    _.indexBy = group(function(result, key, value) {
        result[key] = value;
    });

    // Counts instances of an object that group by a certain criterion. Pass
    // either a string attribute to count by, or a function that returns the
    // criterion.
    _.countBy = group(function(result, key, value) {
        _.has(result, key) ? result[key]++ : result[key] = 1;
    });

    // Use a comparator function to figure out the smallest index at which
    // an object should be inserted so as to maintain order. Uses binary search.
    _.sortedIndex = function(array, obj, iterator, context) {
        iterator = iterator == null ? _.identity : lookupIterator(iterator);
        var value = iterator.call(context, obj);
        var low = 0,
            high = array.length;
        while (low < high) {
            var mid = (low + high) >>> 1;
            iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
        }
        return low;
    };

    // Safely create a real, live array from anything iterable.
    _.toArray = function(obj) {
        if (!obj) return [];
        if (_.isArray(obj)) return slice.call(obj);
        if (obj.length === +obj.length) return _.map(obj, _.identity);
        return _.values(obj);
    };

    // Return the number of elements in an object.
    _.size = function(obj) {
        if (obj == null) return 0;
        return (obj.length === +obj.length) ? obj.length : _.keys(obj).length;
    };

    // Array Functions
    // ---------------

    // Get the first element of an array. Passing **n** will return the first N
    // values in the array. Aliased as `head` and `take`. The **guard** check
    // allows it to work with `_.map`.
    _.first = _.head = _.take = function(array, n, guard) {
        if (array == null) return void 0;
        return (n == null) || guard ? array[0] : slice.call(array, 0, n);
    };

    // Returns everything but the last entry of the array. Especially useful on
    // the arguments object. Passing **n** will return all the values in
    // the array, excluding the last N. The **guard** check allows it to work with
    // `_.map`.
    _.initial = function(array, n, guard) {
        return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
    };

    // Get the last element of an array. Passing **n** will return the last N
    // values in the array. The **guard** check allows it to work with `_.map`.
    _.last = function(array, n, guard) {
        if (array == null) return void 0;
        if ((n == null) || guard) {
            return array[array.length - 1];
        } else {
            return slice.call(array, Math.max(array.length - n, 0));
        }
    };

    // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
    // Especially useful on the arguments object. Passing an **n** will return
    // the rest N values in the array. The **guard**
    // check allows it to work with `_.map`.
    _.rest = _.tail = _.drop = function(array, n, guard) {
        return slice.call(array, (n == null) || guard ? 1 : n);
    };

    // Trim out all falsy values from an array.
    _.compact = function(array) {
        return _.filter(array, _.identity);
    };

    // Internal implementation of a recursive `flatten` function.
    var flatten = function(input, shallow, output) {
        if (shallow && _.every(input, _.isArray)) {
            return concat.apply(output, input);
        }
        each(input, function(value) {
            if (_.isArray(value) || _.isArguments(value)) {
                shallow ? push.apply(output, value) : flatten(value, shallow, output);
            } else {
                output.push(value);
            }
        });
        return output;
    };

    // Flatten out an array, either recursively (by default), or just one level.
    _.flatten = function(array, shallow) {
        return flatten(array, shallow, []);
    };

    // Return a version of the array that does not contain the specified value(s).
    _.without = function(array) {
        return _.difference(array, slice.call(arguments, 1));
    };

    // Produce a duplicate-free version of the array. If the array has already
    // been sorted, you have the option of using a faster algorithm.
    // Aliased as `unique`.
    _.uniq = _.unique = function(array, isSorted, iterator, context) {
        if (_.isFunction(isSorted)) {
            context = iterator;
            iterator = isSorted;
            isSorted = false;
        }
        var initial = iterator ? _.map(array, iterator, context) : array;
        var results = [];
        var seen = [];
        each(initial, function(value, index) {
            if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)) {
                seen.push(value);
                results.push(array[index]);
            }
        });
        return results;
    };

    // Produce an array that contains the union: each distinct element from all of
    // the passed-in arrays.
    _.union = function() {
        return _.uniq(_.flatten(arguments, true));
    };

    // Produce an array that contains every item shared between all the
    // passed-in arrays.
    _.intersection = function(array) {
        var rest = slice.call(arguments, 1);
        return _.filter(_.uniq(array), function(item) {
            return _.every(rest, function(other) {
                return _.indexOf(other, item) >= 0;
            });
        });
    };

    // Take the difference between one array and a number of other arrays.
    // Only the elements present in just the first array will remain.
    _.difference = function(array) {
        var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
        return _.filter(array, function(value) {
            return !_.contains(rest, value);
        });
    };

    // Zip together multiple lists into a single array -- elements that share
    // an index go together.
    _.zip = function() {
        var length = _.max(_.pluck(arguments, "length").concat(0));
        var results = new Array(length);
        for (var i = 0; i < length; i++) {
            results[i] = _.pluck(arguments, '' + i);
        }
        return results;
    };

    // Converts lists into objects. Pass either a single array of `[key, value]`
    // pairs, or two parallel arrays of the same length -- one of keys, and one of
    // the corresponding values.
    _.object = function(list, values) {
        if (list == null) return {};
        var result = {};
        for (var i = 0, length = list.length; i < length; i++) {
            if (values) {
                result[list[i]] = values[i];
            } else {
                result[list[i][0]] = list[i][1];
            }
        }
        return result;
    };

    // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
    // we need this function. Return the position of the first occurrence of an
    // item in an array, or -1 if the item is not included in the array.
    // Delegates to **ECMAScript 5**'s native `indexOf` if available.
    // If the array is large and already in sort order, pass `true`
    // for **isSorted** to use binary search.
    _.indexOf = function(array, item, isSorted) {
        if (array == null) return -1;
        var i = 0,
            length = array.length;
        if (isSorted) {
            if (typeof isSorted == 'number') {
                i = (isSorted < 0 ? Math.max(0, length + isSorted) : isSorted);
            } else {
                i = _.sortedIndex(array, item);
                return array[i] === item ? i : -1;
            }
        }
        if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
        for (; i < length; i++)
            if (array[i] === item) return i;
        return -1;
    };

    // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
    _.lastIndexOf = function(array, item, from) {
        if (array == null) return -1;
        var hasIndex = from != null;
        if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
            return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
        }
        var i = (hasIndex ? from : array.length);
        while (i--)
            if (array[i] === item) return i;
        return -1;
    };

    // Generate an integer Array containing an arithmetic progression. A port of
    // the native Python `range()` function. See
    // [the Python documentation](http://docs.python.org/library/functions.html#range).
    _.range = function(start, stop, step) {
        if (arguments.length <= 1) {
            stop = start || 0;
            start = 0;
        }
        step = arguments[2] || 1;

        var length = Math.max(Math.ceil((stop - start) / step), 0);
        var idx = 0;
        var range = new Array(length);

        while (idx < length) {
            range[idx++] = start;
            start += step;
        }

        return range;
    };

    // Function (ahem) Functions
    // ------------------

    // Reusable constructor function for prototype setting.
    var ctor = function() {};

    // Create a function bound to a given object (assigning `this`, and arguments,
    // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
    // available.
    _.bind = function(fn) {
        return nativeBind.apply(fn, slice.call(arguments, 1));
    };

    // Partially apply a function by creating a version that has had some of its
    // arguments pre-filled, without changing its dynamic `this` context.
    _.partial = function(func) {
        var args = slice.call(arguments, 1);
        return function() {
            return func.apply(this, args.concat(slice.call(arguments)));
        };
    };

    // Bind all of an object's methods to that object. Useful for ensuring that
    // all callbacks defined on an object belong to it.
    _.bindAll = function(obj) {
        var funcs = slice.call(arguments, 1);
        if (funcs.length === 0) throw new Error("bindAll must be passed function names");
        each(funcs, function(f) {
            obj[f] = _.bind(obj[f], obj);
        });
        return obj;
    };

    // Memoize an expensive function by storing its results.
    _.memoize = function(func, hasher) {
        var memo = {};
        hasher || (hasher = _.identity);
        return function() {
            var key = hasher.apply(this, arguments);
            return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
        };
    };

    // Delays a function for the given number of milliseconds, and then calls
    // it with the arguments supplied.
    _.delay = Function.delay;

    // Defers a function, scheduling it to run after the current call stack has
    // cleared.
    _.defer = function(func) {
        return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
    };

    // Returns a function, that, when invoked, will only be triggered at most once
    // during a given window of time. Normally, the throttled function will run
    // as much as it can, without ever going more than once per `wait` duration;
    // but if you'd like to disable the execution on the leading edge, pass
    // `{leading: false}`. To disable execution on the trailing edge, ditto.
    _.throttle = function(func, wait, options) {
        var context, args, result;
        var timeout = null;
        var previous = 0;
        options || (options = {});
        var later = function() {
            previous = options.leading === false ? 0 : new Date;
            timeout = null;
            result = func.apply(context, args);
        };
        return function() {
            var now = new Date;
            if (!previous && options.leading === false) previous = now;
            var remaining = wait - (now - previous);
            context = this;
            args = arguments;
            if (remaining <= 0) {
                clearTimeout(timeout);
                timeout = null;
                previous = now;
                result = func.apply(context, args);
            } else if (!timeout && options.trailing !== false) {
                timeout = setTimeout(later, remaining);
            }
            return result;
        };
    };

    // Returns a function, that, as long as it continues to be invoked, will not
    // be triggered. The function will be called after it stops being called for
    // N milliseconds. If `immediate` is passed, trigger the function on the
    // leading edge, instead of the trailing.
    _.debounce = function(func, wait, immediate) {
        var result;
        var timeout = null;
        return function() {
            var context = this,
                args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) result = func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) result = func.apply(context, args);
            return result;
        };
    };

    // Returns a function that will be executed at most one time, no matter how
    // often you call it. Useful for lazy initialization.
    _.once = function(func) {
        var ran = false,
            memo;
        return function() {
            if (ran) return memo;
            ran = true;
            memo = func.apply(this, arguments);
            func = null;
            return memo;
        };
    };

    // Returns the first function passed as an argument to the second,
    // allowing you to adjust arguments, run code before and after, and
    // conditionally execute the original function.
    _.wrap = function(func, wrapper) {
        return function() {
            var args = [func];
            push.apply(args, arguments);
            return wrapper.apply(this, args);
        };
    };

    // Returns a function that is the composition of a list of functions, each
    // consuming the return value of the function that follows.
    _.compose = function() {
        var funcs = arguments;
        return function() {
            var args = arguments;
            for (var i = funcs.length - 1; i >= 0; i--) {
                args = [funcs[i].apply(this, args)];
            }
            return args[0];
        };
    };

    // Returns a function that will only be executed after being called N times.
    _.after = function(times, func) {
        return function() {
            if (--times < 1) {
                return func.apply(this, arguments);
            }
        };
    };

    // Object Functions
    // ----------------

    // Retrieve the names of an object's properties.
    // Delegates to **ECMAScript 5**'s native `Object.keys`
    _.keys = Object.keys;

    // Retrieve the values of an object's properties.
    _.values = Object.values;

    // Convert an object into a list of `[key, value]` pairs.
    _.pairs = function(obj) {
        var keys = _.keys(obj);
        var length = keys.length;
        var pairs = new Array(length);
        for (var i = 0; i < length; i++) {
            pairs[i] = [keys[i], obj[keys[i]]];
        }
        return pairs;
    };

    // Invert the keys and values of an object. The values must be serializable.
    _.invert = function(obj) {
        var result = {};
        var keys = _.keys(obj);
        for (var i = 0, length = keys.length; i < length; i++) {
            result[obj[keys[i]]] = keys[i];
        }
        return result;
    };

    // Return a sorted list of the function names available on the object.
    // Aliased as `methods`
    _.functions = _.methods = function(obj) {
        var names = [];
        for (var key in obj) {
            if (_.isFunction(obj[key])) names.push(key);
        }
        return names.sort();
    };

    // Extend a given object with all the properties in passed-in object(s).
    _.extend = Object.append;

    // Return a copy of the object only containing the whitelisted properties.
    _.pick = function(obj) {
        return Object.subset(obj, slice.call(arguments, 1));
    };

    // Return a copy of the object without the blacklisted properties.
    _.omit = function(obj) {
        var copy = {};
        var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
        for (var key in obj) {
            if (!_.contains(keys, key)) copy[key] = obj[key];
        }
        return copy;
    };

    // Fill in a given object with default properties.
    _.defaults = function(obj) {
        each(slice.call(arguments, 1), function(source) {
            if (source) {
                for (var prop in source) {
                    if (obj[prop] === void 0) obj[prop] = source[prop];
                }
            }
        });
        return obj;
    };

    // Create a (shallow-cloned) duplicate of an object.
    _.clone = function(obj) {
        return (isEnumerable(obj) ? Array : Object).clone(obj);
    };

    // Invokes interceptor with the obj, and then returns obj.
    // The primary purpose of this method is to "tap into" a method chain, in
    // order to perform operations on intermediate results within the chain.
    _.tap = function(obj, interceptor) {
        interceptor(obj);
        return obj;
    };

    // Internal recursive comparison function for `isEqual`.
    var eq = function(a, b, aStack, bStack) {
        // Identical objects are equal. `0 === -0`, but they aren't identical.
        // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
        if (a === b) return a !== 0 || 1 / a == 1 / b;
        // A strict comparison is necessary because `null == undefined`.
        if (a == null || b == null) return a === b;
        // Unwrap any wrapped objects.
        if (a instanceof _) a = a._wrapped;
        if (b instanceof _) b = b._wrapped;
        // Compare `[[Class]]` names.
        var className = toString.call(a);
        if (className != toString.call(b)) return false;
        switch (className) {
            // Strings, numbers, dates, and booleans are compared by value.
            case '[object String]':
                // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
                // equivalent to `new String("5")`.
                return a == String(b);
            case '[object Number]':
                // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
                // other numeric values.
                return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
            case '[object Date]':
            case '[object Boolean]':
                // Coerce dates and booleans to numeric primitive values. Dates are compared by their
                // millisecond representations. Note that invalid dates with millisecond representations
                // of `NaN` are not equivalent.
                return +a == +b;
                // RegExps are compared by their source patterns and flags.
            case '[object RegExp]':
                return a.source == b.source &&
                    a.global == b.global &&
                    a.multiline == b.multiline &&
                    a.ignoreCase == b.ignoreCase;
        }
        if (typeof a != 'object' || typeof b != 'object') return false;
        // Assume equality for cyclic structures. The algorithm for detecting cyclic
        // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
        var length = aStack.length;
        while (length--) {
            // Linear search. Performance is inversely proportional to the number of
            // unique nested structures.
            if (aStack[length] == a) return bStack[length] == b;
        }
        // Objects with different constructors are not equivalent, but `Object`s
        // from different frames are.
        var aCtor = a.constructor,
            bCtor = b.constructor;
        if (aCtor !== bCtor && !(_.isFunction(aCtor) && (aCtor instanceof aCtor) &&
            _.isFunction(bCtor) && (bCtor instanceof bCtor))) {
            return false;
        }
        // Add the first object to the stack of traversed objects.
        aStack.push(a);
        bStack.push(b);
        var size = 0,
            result = true;
        // Recursively compare objects and arrays.
        if (className == '[object Array]') {
            // Compare array lengths to determine if a deep comparison is necessary.
            size = a.length;
            result = size == b.length;
            if (result) {
                // Deep compare the contents, ignoring non-numeric properties.
                while (size--) {
                    if (!(result = eq(a[size], b[size], aStack, bStack))) break;
                }
            }
        } else {
            // Deep compare objects.
            for (var key in a) {
                if (_.has(a, key)) {
                    // Count the expected number of properties.
                    size++;
                    // Deep compare each member.
                    if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
                }
            }
            // Ensure that both objects contain the same number of properties.
            if (result) {
                for (key in b) {
                    if (_.has(b, key) && !(size--)) break;
                }
                result = !size;
            }
        }
        // Remove the first object from the stack of traversed objects.
        aStack.pop();
        bStack.pop();
        return result;
    };

    // Perform a deep comparison to check if two objects are equal.
    _.isEqual = function(a, b) {
        return eq(a, b, [], []);
    };

    // Is a given array, string, or object empty?
    // An "empty" object has no enumerable own-properties.
    _.isEmpty = function(obj) {
        if (obj == null) return true;
        if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
        for (var key in obj)
            if (_.has(obj, key)) return false;
        return true;
    };


    // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
    each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
        _['is' + name] = function(obj) {
            return toString.call(obj) == '[object ' + name + ']';
        };
    });

    each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Element', 'Array', 'Object', 'Boolean'], function(name) {
        _['is' + name] = Type['is' + name];
    })

    each(['Finite', 'NaN'], function(name) {
        _['is' + name] = Number['is' + name];
    })

    // Is a given value equal to null?
    _.isNull = function(obj) {
        return obj === null;
    };

    // Is a given variable undefined?
    _.isUndefined = function(obj) {
        return obj === void 0;
    };

    // Shortcut function for checking if an object has a given property directly
    // on itself (in other words, not on a prototype).
    _.has = function(obj, key) {
        return hasOwnProperty.call(obj, key);
    };

    // Utility Functions
    // -----------------

    // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
    // previous owner. Returns a reference to the Underscore object.
    _.noConflict = function() {
        root._ = previousUnderscore;
        return this;
    };

    // Keep the identity function around for default iterators.
    _.identity = function(value) {
        return value;
    };

    // Run a function **n** times.
    _.times = Number.times;

    // Return a random integer between min and max (inclusive).
    _.random = Number.random;

    // List of HTML entities for escaping.
    var entityMap = {
        escape: {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;'
        }
    };
    entityMap.unescape = _.invert(entityMap.escape);

    // Regexes containing the keys and values listed immediately above.
    var entityRegexes = {
        escape: new RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),
        unescape: new RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')
    };

    // Functions for escaping and unescaping strings to/from HTML interpolation.
    _.each(['escape', 'unescape'], function(method) {
        _[method] = function(string) {
            if (string == null) return '';
            return ('' + string).replace(entityRegexes[method], function(match) {
                return entityMap[method][match];
            });
        };
    });

    // If the value of the named `property` is a function then invoke it with the
    // `object` as context; otherwise, return it.
    _.result = function(object, property) {
        if (object == null) return void 0;
        var value = object[property];
        return _.isFunction(value) ? value.call(object) : value;
    };

    // Add your own custom functions to the Underscore object.

    _.mixin = function(obj) {
        each(_.functions(obj), function(name) {
            var func = _[name] = obj[name];
            _.prototype[name] = function() {
                var args = [this._wrapped];
                push.apply(args, arguments);
                return result.call(this, func.apply(_, args));
            };
        });
    }

    // Generate a unique integer id (unique within the entire client session).
    // Useful for temporary DOM ids.
    _.uniqueId = String.uniqueID;

    // By default, Underscore uses ERB-style template delimiters, change the
    // following template settings to use alternative delimiters.
    _.templateSettings = {
        evaluate: /<%([\s\S]+?)%>/g,
        interpolate: /<%=([\s\S]+?)%>/g,
        escape: /<%-([\s\S]+?)%>/g
    };

    // When customizing `templateSettings`, if you don't want to define an
    // interpolation, evaluation or escaping regex, we need one that is
    // guaranteed not to match.
    var noMatch = /(.)^/;

    // Certain characters need to be escaped so that they can be put into a
    // string literal.
    var escapes = {
        "'": "'",
        '\\': '\\',
        '\r': 'r',
        '\n': 'n',
        '\t': 't',
        '\u2028': 'u2028',
        '\u2029': 'u2029'
    };

    var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

    // JavaScript micro-templating, similar to John Resig's implementation.
    // Underscore templating handles arbitrary delimiters, preserves whitespace,
    // and correctly escapes quotes within interpolated code.
    _.template = function(text, data, settings) {
        var render;
        settings = _.defaults({}, settings, _.templateSettings);

        // Combine delimiters into one regular expression via alternation.
        var matcher = new RegExp([
            (settings.escape || noMatch).source, (settings.interpolate || noMatch).source, (settings.evaluate || noMatch).source
        ].join('|') + '|$', 'g');

        // Compile the template source, escaping string literals appropriately.
        var index = 0;
        var source = "__p+='";
        text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
            source += text.slice(index, offset)
                .replace(escaper, function(match) {
                    return '\\' + escapes[match];
                });

            if (escape) {
                source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
            }
            if (interpolate) {
                source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
            }
            if (evaluate) {
                source += "';\n" + evaluate + "\n__p+='";
            }
            index = offset + match.length;
            return match;
        });
        source += "';\n";

        // If a variable is not specified, place data values in local scope.
        if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

        source = "var __t,__p='',__j=Array.prototype.join," +
            "print=function(){__p+=__j.call(arguments,'');};\n" +
            source + "return __p;\n";

        try {
            render = new Function(settings.variable || 'obj', '_', source);
        } catch (e) {
            e.source = source;
            throw e;
        }

        if (data) return render(data, _);
        var template = function(data) {
            return render.call(this, data, _);
        };

        // Provide the compiled function source as a convenience for precompilation.
        template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

        return template;
    };

    // Add a "chain" function, which will delegate to the wrapper.
    _.chain = function(obj) {
        return _(obj).chain();
    };

    // OOP
    // ---------------
    // If Underscore is called as a function, it returns a wrapped object that
    // can be used OO-style. This wrapper holds altered versions of all the
    // underscore functions. Wrapped objects may be chained.

    // Helper function to continue chaining intermediate results.
    var result = function(obj) {
        return this._chain ? _(obj).chain() : obj;
    };

    // Add all of the Underscore functions to the wrapper object.
    _.mixin(_);

    // Add all mutator Array functions to the wrapper.
    each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
        var method = ArrayProto[name];
        _.prototype[name] = function() {
            var obj = this._wrapped;
            method.apply(obj, arguments);
            if ((name == 'shift' || name == 'splice') && obj.length === 0) delete obj[0];
            return result.call(this, obj);
        };
    });

    // Add all accessor Array functions to the wrapper.
    each(['concat', 'join', 'slice'], function(name) {
        var method = ArrayProto[name];
        _.prototype[name] = function() {
            return result.call(this, method.apply(this._wrapped, arguments));
        };
    });

    _.extend(_.prototype, {

        // Start chaining a wrapped Underscore object.
        chain: function() {
            this._chain = true;
            return this;
        },

        // Extracts the result from a wrapped and chained object.
        value: function() {
            return this._wrapped;
        }

    });

}).call(this);
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
            var args = _.map(arguments, _.identity);
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
                if (hasOwnProperty.call(obj, key[i])) obj = obj[key[i]];
                else return undefined;
            }
            return obj;
        },

        item: function(xs, n) {
            return xs == null ? null : xs[n];
        },
        last: Array.getLast
    });

})(this._);

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

//adapted version to use native parser if available

//Changes from Mootools spec: excludeScripts defaults to to false because fuck you

//http://jsperf.com/dom-create-vs-jquery/6
window.addEvent("domready", function(){

function tableFix(match, text) {
    var container = new Element('table');
    var tag = match[1].toLowerCase();
    if (['td', 'th', 'tr'].contains(tag)){
        container = new Element('tbody').inject(container);
        if (tag != 'tr') container = new Element('tr').inject(container);
    }
    return container.set('html', text).getChildren();
}

var range = document.createRange();
if(range.createContextualFragment) {//not supported on ie<9

    // make the parent of the first div in the document becomes the context node
    var reference = document.getElement("div");
    range.selectNode(reference);

    Elements.from = function(text, excludeScripts) {
        if (excludeScripts == true) text = text.stripScripts();

        var match = text.match(/^\s*<(t[dhr]|tbody|tfoot|thead)/i);
        if(match) return tableFix(match,text);

        var elements = range.createContextualFragment(text).childNodes;
        return new Elements(elements);
    };

} else {

/*
---

script: Elements.From.js

name: Elements.From

description: Returns a collection of elements from a string of html.

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - Core/String
  - Core/Element
  - /MooTools.More

provides: [Elements.from, Elements.From]

...
*/

Elements.from = function(text, excludeScripts){
    if (excludeScripts == true) text = text.stripScripts();

    var match = text.match(/^\s*<(t[dhr]|tbody|tfoot|thead)/i);
    if(match) return tableFix(match,text);

    return new Element('div').set('html', text).getChildren();
};

}

});

Element.extend({
    from: function(text, rs) {
        return Elements.from(text,rs)[0];
    }
});
/*
---
description: A cross browser persistent storgae API

license: MIT-style

authors:
- Arieh Glazer + Graeme Yeate's edits

requires:
- core/1.2.4 : [Core,Class,Class.Extras,Cookie]

provides: [Storage]

...
*/
/*!
Copyright (c) 2010 Arieh Glazer
*/
(function(window) {
    "use strict";

    window.Storage = new Class({
        Implements: [Options],
        options: { //see Cookie options
            path: '/',
            name: window.location.hostname,
            duration: 100, //days
            debug: false,
            storageType: 'localStorage',
            fallback: true
        },
        storage: null,
        initialize: function(options) {
            this.setOptions(options);
            var $this = this,
                storageType = this.options.storageType,
                fallback = this.options.fallback;

            if (window[storageType]) { //HTML5 storage
                if (this.options.debug) console.log('using ' + storageType);
                this.storage = window[storageType];
            } else if (Browser.Engine.trident) { //IE < 8
                if (this.options.debug) console.log('using behavior Storage');
                this.storage = (function() {
                    var storage = document.createElement("span");
                    storage.style.behavior = "url(#default#userData)";
                    document.body.adopt(storage);
                    storage.load($this.options.name);

                    return {
                        setItem: function(name, value) {
                            storage.setAttribute(name, value);
                            storage.save($this.options.name);
                        },
                        getItem: function(name) {
                            return storage.getAttribute(name);
                        },
                        removeItem: function(name) {
                            storage.removeAttribute(name);
                            storage.save($this.options.name);
                        }
                    };
                })();
            } else if (window.globalStorage) { //FF<3.5
                if (this.options.debug) console.log('using globalStorage');
                this.storage = (function() {
                    storage = globalStorage[$this.options.name];
                    return {
                        setItem: function(name, value) {
                            storage[name] = value;
                        },
                        getItem: function(name) {
                            return ('value' in storage[name]) ? storage[name].value : null;
                        },
                        removeItem: function(name) {
                            delete(storage[name]);
                        }
                    };
                })();
            } else if(fallback) { //All others
                if (this.options.debug) console.log('using cookies');
                this.usingCookies = true;
                this.storage = (function() {
                    var options = {
                        path: $this.options.path,
                        duration: $this.options.duration
                    };

                    return {
                        setItem: function(name, value) {
                            Cookie.write(name, value, options);
                        },
                        getItem: function(name) {
                            return Cookie.read(name);
                        },
                        removeItem: function(name) {
                            Cookie.dispose(name);
                        }
                    };
                })();
            } else {
                var data = null;
                this.storage = {
                    getItem: function() {
                        return data;
                    },
                    setItem: function(d) {
                        data = d;
                    },
                    removeItem: function() {
                        data = null;
                    }
                };
            }
        },
        set: function(name, value) {
            this.storage.setItem(name, JSON.encode(value));
            return this;
        },
        get: function(name) {
            return JSON.decode(this.storage.getItem(name));
        },
        remove: function(name) {
            this.storage.removeItem(name);
            return this;
        }
    });

})(this);

//Spin off the js lib by lsjosa found here: https://github.com/ljosa/urlize.js
(function(self) {

    function getTrailing(text, punc) {
        if (Type.isRegExp(punc)) {
            var match = text.match(punc);
            if (match) {
                return match[0];
            }
        } else {
            if (text.endsWith(punc)) {
                return punc;
            }
        }
    }

    function getLeading(text, punc) {
        if (Type.isRegExp(punc)) {
            var match = text.match(punc);
            if (match) {
                return match[0];
            }
        } else {
            if (text.startsWith(punc)) {
                return punc;
            }
        }
    }

    var urlerizer = self.Urlerizer = new Class({
        Implements: [Options],
        options: {
            nofollow: false,
            autoescape: true,
            trim_url_limit: false,
            //length of a url before it is trimmed
            target: false,
            default_parser: true,
            hide_servers:true
        },

        //ignored punctuation
        leading_punctuation: [],
        trailing_punctuation: [/[.,.)]$/],
        wrapping_punctuation: [
            ['(', ')'],
            ['<', '>'],
            ['&lt;', '&gt;'],
            ['“', '”'],
            ['‘', '’'],
            ["'", "'"],
            ['[', ']']
        ],

        initialize: function(opts) {
            this.setOptions(opts);

            if(this.options.default_parser) {
                this.patterns.push({
                    pattern: /[a-zA-Z]\.[a-zA-Z]{2,4}/i,
                    //i think this should pass tests on all valid urls... will also pick up things like test.test
                    entireStr: false,
                    parse: function(text) {
                        var options = this.options;
                        var word = text;
                        if ((word.contains('.') || word.contains('@') || word.contains(':')) &&
                                (!options.hide_servers || !(urlerizer.regexs.server.test(word))) ) {//dont match google.com:510
                            // Deal with punctuation.
                            var parsed = this.parsePunctuation(word);
                            var middle = parsed.mid;

                            // Make URL we want to point to.
                            var url = undefined;
                            var nofollow_attr = options.nofollow ? ' rel="nofollow"' : '';
                            var target_attr = options.target ? ' target="' + options.target + '"' : '';

                            if (middle.match(urlerizer.regexs.simple_url)) url = this.urlquote(middle);
                            else if (middle.match(urlerizer.regexs.url_improved)) url = this.urlquote('http://' + middle);
                            else if (middle.contains(':') && middle.match(urlerizer.regexs.simple_email)) {
                                // XXX: Not handling IDN.
                                url = 'mailto:' + middle;
                                nofollow_attr = '';
                            }

                            // Make link.
                            if (url) {
                                var trimmed = options.trim_url_limit ? String.truncate(middle, options.trim_url_limit) : middle;
                                middle = '<a href="' + url + '"' + nofollow_attr + target_attr + '>' + trimmed + '</a>';
                                word = parsed.lead + middle + parsed.end;
                            }
                        } else if (options.autoescape) {
                            word = _.escape(word);
                        }
                        return word;
                    }
                });
            }
        },

        // Quotes a URL if it isn't already quoted.
        urlquote: function(url) {
            // XXX: Not handling IDN.
            // An URL is considered unquoted if it contains no % characters or
            // contains a % not followed by two hexadecimal digits.
            if (url.indexOf('%') == -1 || url.match(urlerizer.regexs.unquoted_percents)) {
                return encodeURI(url);
            } else {
                return url;
            }
        },

        parse: function(text) {
            var self = this,
                result = (self.options.autoescape ? _.escape(text) : text).split(" "),
                funcs = self.patterns.filter(function(pat) {
                    return !pat.entireStr;
                }),

                i = result.length - 1, item;

            function parseWord(pattern) {
                item = result[i];
                if (pattern.pattern.test(item)) {
                    result[i] = pattern.parse.call(self, item);
                    return result[i] !== item;
                }
            }

            for (; i >= 0; i--) {
                funcs.some(parseWord);//one pattern per word or it gets too complicated
            };
            result = result.join(" ")
            self.patterns.each(function(pattern) {
                if (pattern.entireStr && pattern.pattern.test(result)) {
                    result = pattern.parse.call(self, result);
                }
            })
            return result;
        },

        parsePunctuation: function(text) {
            var lead = '',
                mid = text,
                end = '';

            function leader(punc) {
                var lead = getLeading(mid, punc);
                if (lead) {
                    mid = mid.slice(lead.length);
                    lead += lead;
                }
            }

            function trailer(punc) {
                var trail = getTrailing(mid, punc);
                if (trail) {
                    mid = mid.slice(0, mid.length - trail.length);
                    end = trail + end;
                }
            }

            function wrapper(puncs) {
                var lead = getLeading(mid, puncs[0]),
                    trail;
                if (lead && (trail = getTrailing(mid, puncs[1]))) {
                    mid = mid.slice(lead.length, mid.length - trail.length);
                    lead += lead;
                    end = trail + end;
                    return true;
                }
            }

            //destructive calls
            while(this.leading_punctuation.some(leader)) {};

            while(this.trailing_punctuation.some(trailer)) {};

            while(this.wrapping_punctuation.some(wrapper)) {};

            return {
                lead: lead,
                mid: mid,
                end: end
            };
        },

        patterns: [],

        addPattern: function(reg, action, whole) {
            this.patterns.push({
                'pattern': reg,
                'parse': action,
                'entireStr': whole || false
            });
            return this;
        }
    });

    urlerizer.regexs = {
        simple_url: /^https?:\/\/\w/,
        url_improved: /^www\.|^(?!http)\w[^@]+\.[a-zA-Z]{2,4}/,//matches anything thats urlish- even bit.ly/a
        simple_email: /^\S+@\S+\.\S+$/,
        unquoted_percents: /%(?![0-9A-Fa-f]{2})/,
        server: /(\:(\d{2}))|(qwebirc\:\/)/
    }

})(this);



//scrolls an elemenet as new items are added. will stop scrolling if user manually scrolls
// TODO Theres some inefficent crap in here 
// -> still buggy :)
// Author: Graeme Yeates
//Requires: 
// - Fx.Scroll
// - Element.Event.Pseudos
Fx.AutoScroll = new Class({
    Extends: Fx.Scroll,
    Binds: ["updatePosition"],
    options: {
        direction: 'Bottom', //Top, Right, Left, Bottom
        interval: 500,
        duration: 0, //ms to execute effect
        threshold: null,//px - how close to bottom to start scrolling
        wheelStops: true,
        link: 'cancel'
    },
    lastUpdate: 0,

    initialize: function(ele, options) {
        this.parent(ele, options);

        var self = this,
            opts = self.options,
            interval = opts.interval/2,
            timers = self.$timers = {},

            //fix for a small bug caused by using throttle - ensures fn is called after scrolling ends
            throttleToggler = function() {
                if(Date.now() > (self.lastUpdate + opts.duration + 20)) {//not self triggered (20ms to compensate for runtime)
                    // console.log('checkin bc last change : ' + (d - (self.lastUpdate + opts.duration + 20)));
                    clearTimeout(timers.throttle);
                    timers.throttle = self.toggleScroll.delay(interval - opts.duration, self);
                }
            };

        this.$events = {
            element: {
                "adopt": self.updatePosition
            },
            'window': {
                "resize": self.updatePosition
            }
        }
        this.$events.element["scroll:throttle(" + interval + ")"] = throttleToggler;

        this.element.addEvents(this.$events.element);
        window.addEvents(this.$events.window);

        self.autoScroll();
    },

    autoScroll: function() {
        this.scroll = true;
        // this.$timers.autoscroll = this.updatePosition.periodical(this.options.interval, this); //neccessary for container resizes etc
        return this.updatePosition();
    },

    stopScroll: function() {
        var timers = this.$timers;
        clearTimeout(timers.throttle);
        clearInterval(timers.autoscroll);
        timers.autoscroll = null;
    },

    toggleScroll: function() {
        this.scroll = false;

        var $ele = this.element,
            timers = this.$timers,
            pxFromBottom = Math.abs($ele.getScrollHeight() - ($ele.getHeight() + $ele.getScrollTop()));

        //old timers
        clearTimeout(timers.throttle);
        clearInterval(timers.autoscroll);

        if(pxFromBottom <= this.threshold) {//bottom of element + offset - begin autoscrolling
            this.autoScroll();
            // console.log('startin scrollin')
        }
        else { //stop autoscrolling
            // console.log('done scrollin - ' + pxFromBottom)
            this.stopScroll();
        }
        return this;
    },

    updatePosition: function(target) {
        // var fn = "to" + this.options.direction;
        var $ele = this.element;
        if(this.scroll  &&
          /*bug fix for a off by one one in Fx.Scroll*/ Math.abs($ele.getScrollHeight() - $ele.getHeight() - $ele.getScrollTop()) > 2) {
            this.lastUpdate = Date.now();

            if(this.options.duration == 0)
                this.set($ele.scrollLeft, $ele.scrollHeight); //place at bottom instantly
            else
                this.toBottom();
            if(target)
                this.threshold = this.options.threshold || target.getHeight();
        }
        return this;
    },

    stop: function() {
        window.removeEvents(this.$events.window);
        this.element.removeEvents(this.$events.element);
        this.stopScroll();
        return this.parent();
    }
});

// MooTools: the javascript framework.
// Load this file's selection again by visiting: http://mootools.net/more/db53fa168c584b0b434828eef6a9d4b3 
// Or build this file again with packager using: packager build More/Table More/Mask
/*
---
name: Table
description: LUA-Style table implementation.
license: MIT-style license
authors:
  - Valerio Proietti
requires: [Core/Array]
provides: [Table]
...
*/

(function(){

var Table = this.Table = function(){

    this.length = 0;
    var keys = [],
        values = [];
    
    this.set = function(key, value){
        var index = keys.indexOf(key);
        if (index == -1){
            var length = keys.length;
            keys[length] = key;
            values[length] = value;
            this.length++;
        } else {
            values[index] = value;
        }
        return this;
    };

    this.get = function(key){
        var index = keys.indexOf(key);
        return (index == -1) ? null : values[index];
    };

    this.erase = function(key){
        var index = keys.indexOf(key);
        if (index != -1){
            this.length--;
            keys.splice(index, 1);
            return values.splice(index, 1)[0];
        }
        return null;
    };

    this.each = this.forEach = function(fn, bind){
        for (var i = 0, l = this.length; i < l; i++) fn.call(bind, keys[i], values[i], this);
    };
    
};

if (this.Type) new Type('Table', Table);

})();




/*
---

script: Class.Occlude.js

name: Class.Occlude

description: Prevents a class from being applied to a DOM element twice.

license: MIT-style license.

authors:
  - Aaron Newton

requires:
  - Core/Class
  - Core/Element
  - /MooTools.More

provides: [Class.Occlude]

...
*/

Class.Occlude = new Class({

    occlude: function(property, element){
        element = document.id(element || this.element);
        var instance = element.retrieve(property || this.property);
        if (instance && !this.occluded)
            return (this.occluded = instance);

        this.occluded = false;
        element.store(property || this.property, this);
        return this.occluded;
    }

});


/*
---

script: IframeShim.js

name: IframeShim

description: Defines IframeShim, a class for obscuring select lists and flash objects in IE.

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - Core/Element.Event
  - Core/Element.Style
  - Core/Options
  - Core/Events
  - /Element.Position
  - /Class.Occlude

provides: [IframeShim]

...
*/

var IframeShim = new Class({

    Implements: [Options, Events, Class.Occlude],

    options: {
        className: 'iframeShim',
        src: 'javascript:false;document.write("");',
        display: false,
        zIndex: null,
        margin: 0,
        offset: {x: 0, y: 0},
        browsers: (Browser.ie6 || (Browser.firefox && Browser.version < 3 && Browser.Platform.mac))
    },

    property: 'IframeShim',

    initialize: function(element, options){
        this.element = document.id(element);
        if (this.occlude()) return this.occluded;
        this.setOptions(options);
        this.makeShim();
        return this;
    },

    makeShim: function(){
        if (this.options.browsers){
            var zIndex = this.element.getStyle('zIndex').toInt();

            if (!zIndex){
                zIndex = 1;
                var pos = this.element.getStyle('position');
                if (pos == 'static' || !pos) this.element.setStyle('position', 'relative');
                this.element.setStyle('zIndex', zIndex);
            }
            zIndex = ((this.options.zIndex != null || this.options.zIndex === 0) && zIndex > this.options.zIndex) ? this.options.zIndex : zIndex - 1;
            if (zIndex < 0) zIndex = 1;
            this.shim = new Element('iframe', {
                src: this.options.src,
                scrolling: 'no',
                frameborder: 0,
                styles: {
                    zIndex: zIndex,
                    position: 'absolute',
                    border: 'none',
                    filter: 'progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)'
                },
                'class': this.options.className
            }).store('IframeShim', this);
            var inject = (function(){
                this.shim.inject(this.element, 'after');
                this[this.options.display ? 'show' : 'hide']();
                this.fireEvent('inject');
            }).bind(this);
            if (!IframeShim.ready) window.addEvent('load', inject);
            else inject();
        } else {
            this.position = this.hide = this.show = this.dispose = Function.from(this);
        }
    },

    position: function(){
        if (!IframeShim.ready || !this.shim) return this;
        var size = this.element.measure(function(){
            return this.getSize();
        });
        if (this.options.margin != undefined){
            size.x = size.x - (this.options.margin * 2);
            size.y = size.y - (this.options.margin * 2);
            this.options.offset.x += this.options.margin;
            this.options.offset.y += this.options.margin;
        }
        this.shim.set({width: size.x, height: size.y}).position({
            relativeTo: this.element,
            offset: this.options.offset
        });
        return this;
    },

    hide: function(){
        if (this.shim) this.shim.setStyle('display', 'none');
        return this;
    },

    show: function(){
        if (this.shim) this.shim.setStyle('display', 'block');
        return this.position();
    },

    dispose: function(){
        if (this.shim) this.shim.dispose();
        return this;
    },

    destroy: function(){
        if (this.shim) this.shim.destroy();
        return this;
    }

});

window.addEvent('load', function(){
    IframeShim.ready = true;
});


/*
---

script: Mask.js

name: Mask

description: Creates a mask element to cover another.

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - Core/Options
  - Core/Events
  - Core/Element.Event
  - /Class.Binds
  - /Element.Position
  - /IframeShim

provides: [Mask]

...
*/

var Mask = new Class({

    Implements: [Options, Events],

    Binds: ['position'],

    options: {/*
        onShow: function(){},
        onHide: function(){},
        onDestroy: function(){},
        onClick: function(event){},
        inject: {
            where: 'after',
            target: null,
        },
        hideOnClick: false,
        id: null,
        destroyOnHide: false,*/
        style: {},
        'class': 'mask',
        maskMargins: false,
        useIframeShim: true,
        iframeShimOptions: {}
    },

    initialize: function(target, options){
        this.target = document.id(target) || document.id(document.body);
        this.target.store('mask', this);
        this.setOptions(options);
        this.render();
        this.inject();
    },

    render: function(){
        this.element = new Element('div', {
            'class': this.options['class'],
            id: this.options.id || 'mask-' + String.uniqueID(),
            styles: Object.merge({}, this.options.style, {
                display: 'none'
            }),
            events: {
                click: function(event){
                    this.fireEvent('click', event);
                    if (this.options.hideOnClick) this.hide();
                }.bind(this)
            }
        });

        this.hidden = true;
    },

    toElement: function(){
        return this.element;
    },

    inject: function(target, where){
        where = where || (this.options.inject ? this.options.inject.where : '') || this.target == document.body ? 'inside' : 'after';
        target = target || (this.options.inject && this.options.inject.target) || this.target;

        this.element.inject(target, where);

        if (this.options.useIframeShim){
            this.shim = new IframeShim(this.element, this.options.iframeShimOptions);

            this.addEvents({
                show: this.shim.show.bind(this.shim),
                hide: this.shim.hide.bind(this.shim),
                destroy: this.shim.destroy.bind(this.shim)
            });
        }
    },

    position: function(){
        this.resize(this.options.width, this.options.height);

        this.element.position({
            relativeTo: this.target,
            position: 'topLeft',
            ignoreMargins: !this.options.maskMargins,
            ignoreScroll: this.target == document.body
        });

        return this;
    },

    resize: function(x, y){
        var opt = {
            styles: ['padding', 'border']
        };
        if (this.options.maskMargins) opt.styles.push('margin');

        var dim = this.target.getComputedSize(opt);
        if (this.target == document.body){
            this.element.setStyles({width: 0, height: 0});
            var win = window.getScrollSize();
            if (dim.totalHeight < win.y) dim.totalHeight = win.y;
            if (dim.totalWidth < win.x) dim.totalWidth = win.x;
        }
        this.element.setStyles({
            width: Array.pick([x, dim.totalWidth, dim.x]),
            height: Array.pick([y, dim.totalHeight, dim.y])
        });

        return this;
    },

    show: function(){
        if (!this.hidden) return this;

        window.addEvent('resize', this.position);
        this.position();
        this.showMask.apply(this, arguments);

        return this;
    },

    showMask: function(){
        this.element.setStyle('display', 'block');
        this.hidden = false;
        this.fireEvent('show');
    },

    hide: function(){
        if (this.hidden) return this;

        window.removeEvent('resize', this.position);
        this.hideMask.apply(this, arguments);
        if (this.options.destroyOnHide) return this.destroy();

        return this;
    },

    hideMask: function(){
        this.element.setStyle('display', 'none');
        this.hidden = true;
        this.fireEvent('hide');
    },

    toggle: function(){
        this[this.hidden ? 'show' : 'hide']();
    },

    destroy: function(){
        this.hide();
        this.element.destroy();
        this.fireEvent('destroy');
        this.target.eliminate('mask');
    }

});

Element.Properties.mask = {

    set: function(options){
        var mask = this.retrieve('mask');
        if (mask) mask.destroy();
        return this.eliminate('mask').store('mask:options', options);
    },

    get: function(){
        var mask = this.retrieve('mask');
        if (!mask){
            mask = new Mask(this, this.retrieve('mask:options'));
            this.store('mask', mask);
        }
        return mask;
    }

};

Element.implement({

    mask: function(options){
        if (options) this.set('mask', options);
        this.get('mask').show();
        return this;
    },

    unmask: function(){
        this.get('mask').hide();
        return this;
    }

});




//This library: http://dev.clientcide.com/depender/build?download=true&version=MooTools+Bootstrap&excludeLibs=Core&require=Bootstrap%2FBehavior.BS.Dropdown&require=Bootstrap%2FBehavior.Popup&require=Bootstrap%2FBehavior.BS.Tabs&require=Bootstrap%2FBehavior.BS.Tooltip&require=Bootstrap%2FPopup&excludeLibs=More
//Contents: Bootstrap:Source/UI/Bootstrap.js, Bootstrap:Source/UI/CSSEvents.js, Behavior:Source/Element.Data.js, Behavior:Source/BehaviorAPI.js, Behavior:Source/Behavior.js, Bootstrap:Source/UI/Bootstrap.Tooltip.js, Bootstrap:Source/Behaviors/Behavior.BS.Tooltip.js, Bootstrap:Source/UI/Bootstrap.Popup.js, Bootstrap:Source/Behaviors/Behavior.BS.Popup.js, Bootstrap:Source/UI/Bootstrap.Dropdown.js, Bootstrap:Source/Behaviors/Behavior.BS.Dropdown.js, Clientcide:Source/Layout/TabSwapper.js, Clientcide:Source/Behaviors/Behavior.Tabs.js, Bootstrap:Source/Behaviors/Behavior.BS.Tabs.js

// Begin: Source/UI/Bootstrap.js
/*
---

name: Bootstrap

description: The BootStrap namespace.

authors: [Aaron Newton]

license: MIT-style license.

provides: [Bootstrap]

...
*/
var Bootstrap = {};

// Begin: Source/UI/CSSEvents.js
/*
---

name: CSSEvents

license: MIT-style

authors: [Aaron Newton]

requires: [Core/DomReady]

provides: CSSEvents
...
*/

Browser.Features.getCSSTransition = function(){
    Browser.Features.cssTransition = (function () {
        var thisBody = document.body || document.documentElement
            , thisStyle = thisBody.style
            , support = thisStyle.transition !== undefined || thisStyle.WebkitTransition !== undefined || thisStyle.MozTransition !== undefined || thisStyle.MsTransition !== undefined || thisStyle.OTransition !== undefined;
        return support;
    })();

    // set CSS transition event type
    if ( Browser.Features.cssTransition ) {
        Browser.Features.transitionEnd = "TransitionEnd";
        if ( Browser.safari || Browser.chrome ) {
            Browser.Features.transitionEnd = "webkitTransitionEnd";
        } else if ( Browser.firefox ) {
            Browser.Features.transitionEnd = "transitionend";
        } else if ( Browser.opera ) {
            Browser.Features.transitionEnd = "oTransitionEnd";
        }
    }
    Browser.Features.getCSSTransition = Function.from(Browser.Features.transitionEnd);
};

window.addEvent("domready", Browser.Features.getCSSTransition);

// Begin: Source/Element.Data.js
/*
---
name: Element.Data
description: Stores data in HTML5 data properties
provides: [Element.Data]
requires: [Core/Element, Core/JSON]
script: Element.Data.js

...
*/
(function(){

    JSON.isSecure = function(string){
        //this verifies that the string is parsable JSON and not malicious (borrowed from JSON.js in MooTools, which in turn borrowed it from Crockford)
        //this version is a little more permissive, as it allows single quoted attributes because forcing the use of double quotes
        //is a pain when this stuff is used as HTML properties
        return (/^[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]*$/).test(string.replace(/\\./g, '@').replace(/"[^"\\\n\r]*"/g, '').replace(/'[^'\\\n\r]*'/g, ''));
    };

    Element.implement({
        /*
            sets an HTML5 data property.
            arguments:
                name - (string) the data name to store; will be automatically prefixed with 'data-'.
                value - (string, number) the value to store.
        */
        setData: function(name, value){
            return this.set('data-' + name.hyphenate(), value);
        },

        getData: function(name, defaultValue){
            var value = this.get('data-' + name.hyphenate());
            if (value != undefined){
                return value;
            } else if (defaultValue != undefined){
                this.setData(name, defaultValue);
                return defaultValue;
            }
        },

        /* 
            arguments:
                name - (string) the data name to store; will be automatically prefixed with 'data-'
                value - (string, array, or object) if an object or array the object will be JSON encoded; otherwise stored as provided.
        */
        setJSONData: function(name, value){
            return this.setData(name, JSON.encode(value));
        },

        /*
            retrieves a property from HTML5 data property you specify
        
            arguments:
                name - (retrieve) the data name to store; will be automatically prefixed with 'data-'
                strict - (boolean) if true, will set the JSON.decode's secure flag to true; otherwise the value is still tested but allows single quoted attributes.
                defaultValue - (string, array, or object) the value to set if no value is found (see storeData above)
        */
        getJSONData: function(name, strict, defaultValue){
            var value = this.get('data-' + name);
            if (value != undefined){
                if (value && JSON.isSecure(value)) {
                    return JSON.decode(value, strict);
                } else {
                    return value;
                }
            } else if (defaultValue != undefined){
                this.setJSONData(name, defaultValue);
                return defaultValue;
            }
        }

    });

})();

// Begin: Source/BehaviorAPI.js
/*
---
name: BehaviorAPI
description: HTML getters for Behavior's API model.
requires: [Core/Class, /Element.Data]
provides: [BehaviorAPI]
...
*/


(function(){
    //see Docs/BehaviorAPI.md for documentation of public methods.

    var reggy = /[^a-z0-9\-]/gi,
        dots = /\./g;

    window.BehaviorAPI = new Class({
        element: null,
        prefix: '',
        defaults: {},

        initialize: function(element, prefix){
            this.element = element;
            this.prefix = prefix.toLowerCase().replace(dots, '-').replace(reggy, '');
        },

        /******************
         * PUBLIC METHODS
         ******************/

        get: function(/* name[, name, name, etc] */){
            if (arguments.length > 1) return this._getObj(Array.from(arguments));
            return this._getValue(arguments[0]);
        },

        getAs: function(/*returnType, name, defaultValue OR {name: returnType, name: returnType, etc}*/){
            if (typeOf(arguments[0]) == 'object') return this._getValuesAs.apply(this, arguments);
            return this._getValueAs.apply(this, arguments);
        },

        require: function(/* name[, name, name, etc] */){
            for (var i = 0; i < arguments.length; i++){
                if (this._getValue(arguments[i]) == undefined) throw new Error('Could not retrieve ' + this.prefix + '-' + arguments[i] + ' option from element.');
            }
            return this;
        },

        requireAs: function(returnType, name /* OR {name: returnType, name: returnType, etc}*/){
            var val;
            if (typeOf(arguments[0]) == 'object'){
                for (var objName in arguments[0]){
                    val = this._getValueAs(arguments[0][objName], objName);
                    if (val === undefined || val === null) throw new Error("Could not retrieve " + this.prefix + '-' + objName + " option from element.");
                }
            } else {
                val = this._getValueAs(returnType, name);
                if (val === undefined || val === null) throw new Error("Could not retrieve " + this.prefix + '-' + name + " option from element.");
            }
            return this;
        },

        setDefault: function(name, value /* OR {name: value, name: value, etc }*/){
            if (typeOf(arguments[0]) == 'object'){
                for (var objName in arguments[0]){
                    this.setDefault(objName, arguments[0][objName]);
                }
                return;
            }
            name = name.camelCase();
            this.defaults[name] = value;
            if (this._getValue(name) == null){
                var options = this._getOptions();
                options[name] = value;
            }
            return this;
        },

        refreshAPI: function(){
            delete this.options;
            this.setDefault(this.defaults);
            return;
        },

        /******************
         * PRIVATE METHODS
         ******************/

        //given an array of names, returns an object of key/value pairs for each name
        _getObj: function(names){
            var obj = {};
            names.each(function(name){
                var value = this._getValue(name);
                if (value !== undefined) obj[name] = value;
            }, this);
            return obj;
        },
        //gets the data-behaviorname-options object and parses it as JSON
        _getOptions: function(){
            try {
                if (!this.options){
                    var options = this.element.getData(this.prefix + '-options', '{}');
                    if (options === "") return this.options = {};
                    if (options && options.substring(0,1) != '{') options = '{' + options + '}';
                    var isSecure = JSON.isSecure(options);
                    if (!isSecure) throw new Error('warning, options value for element is not parsable, check your JSON format for quotes, etc.');
                    this.options = isSecure ? JSON.decode(options) : {};
                    for (option in this.options) {
                        this.options[option.camelCase()] = this.options[option];
                    }
                }
            } catch (e){
                throw new Error('Could not get options from element; check your syntax. ' + this.prefix + '-options: "' + this.element.getData(this.prefix + '-options', '{}') + '"');
            }
            return this.options;
        },
        //given a name (string) returns the value for it
        _getValue: function(name){
            name = name.camelCase();
            var options = this._getOptions();
            if (!options.hasOwnProperty(name)){
                var inline = this.element.getData(this.prefix + '-' + name.hyphenate());
                if (inline) options[name] = inline;
            }
            return options[name];
        },
        //given a Type and a name (string) returns the value for it coerced to that type if possible
        //else returns the defaultValue or null
        _getValueAs: function(returnType, name, defaultValue){
            var value = this._getValue(name);
            if (value == null || value == undefined) return defaultValue;
            var coerced = this._coerceFromString(returnType, value);
            if (coerced == null) throw new Error("Could not retrieve value '" + name + "' as the specified type. Its value is: " + value);
            return coerced;
        },
        //given an object of name/Type pairs, returns those as an object of name/value (as specified Type) pairs
        _getValuesAs: function(obj){
            var returnObj = {};
            for (var name in obj){
                returnObj[name] = this._getValueAs(obj[name], name);
            }
            return returnObj;
        },
        //attempts to run a value through the JSON parser. If the result is not of that type returns null.
        _coerceFromString: function(toType, value){
            if (typeOf(value) == 'string' && toType != String){
                if (JSON.isSecure(value)) value = JSON.decode(value);
            }
            if (instanceOf(value, toType)) return value;
            return null;
        }
    });

})();

// Begin: Source/Behavior.js
/*
---
name: Behavior
description: Auto-instantiates widgets/classes based on parsed, declarative HTML.
requires: [Core/Class.Extras, Core/Element.Event, Core/Selectors, More/Table, /Element.Data, /BehaviorAPI]
provides: [Behavior]
...
*/

(function(){

    var getLog = function(method){
        return function(){
            if (window.console && console[method]){
                if(console[method].apply) console[method].apply(console, arguments);
                else console[method](Array.from(arguments).join(' '));
            }
        };
    };

    var PassMethods = new Class({
        //pass a method pointer through to a filter
        //by default the methods for add/remove events are passed to the filter
        //pointed to this instance of behavior. you could use this to pass along
        //other methods to your filters. For example, a method to close a popup
        //for filters presented inside popups.
        passMethod: function(method, fn){
            if (this.API.prototype[method]) throw new Error('Cannot overwrite API method ' + method + ' as it already exists');
            this.API.implement(method, fn);
            return this;
        },

        passMethods: function(methods){
            for (method in methods) this.passMethod(method, methods[method]);
            return this;
        }

    });

    var spaceOrCommaRegex = /\s*,\s*|\s+/g;

    BehaviorAPI.implement({
        deprecate: function(deprecated, asJSON){
            var set,
                values = {};
            Object.each(deprecated, function(prop, key){
                var value = this.element[ asJSON ? 'getJSONData' : 'getData'](prop);
                if (value !== undefined){
                    set = true;
                    values[key] = value;
                }
            }, this);
            this.setDefault(values);
            return this;
        }
    });

    this.Behavior = new Class({

        Implements: [Options, Events, PassMethods],

        options: {
            //by default, errors thrown by filters are caught; the onError event is fired.
            //set this to *true* to NOT catch these errors to allow them to be handled by the browser.
            // breakOnErrors: false,
            // container: document.body,

            //default error behavior when a filter cannot be applied
            onLog: getLog('info'),
            onError: getLog('error'),
            onWarn: getLog('warn'),
            enableDeprecation: true,
            selector: '[data-behavior]'
        },

        initialize: function(options){
            this.setOptions(options);
            this.API = new Class({ Extends: BehaviorAPI });
            this.passMethods({
                getDelegator: this.getDelegator.bind(this),
                addEvent: this.addEvent.bind(this),
                removeEvent: this.removeEvent.bind(this),
                addEvents: this.addEvents.bind(this),
                removeEvents: this.removeEvents.bind(this),
                fireEvent: this.fireEvent.bind(this),
                applyFilters: this.apply.bind(this),
                applyFilter: this.applyFilter.bind(this),
                getContentElement: this.getContentElement.bind(this),
                cleanup: this.cleanup.bind(this),
                getContainerSize: function(){
                    return this.getContentElement().measure(function(){
                        return this.getSize();
                    });
                }.bind(this),
                error: function(){ this.fireEvent('error', arguments); }.bind(this),
                fail: function(){
                    var msg = Array.join(arguments, ' ');
                    throw new Error(msg);
                },
                warn: function(){
                    this.fireEvent('warn', arguments);
                }.bind(this)
            });
        },

        getDelegator: function(){
            return this.delegator;
        },

        setDelegator: function(delegator){
            if (!instanceOf(delegator, Delegator)) throw new Error('Behavior.setDelegator only accepts instances of Delegator.');
            this.delegator = delegator;
            return this;
        },

        getContentElement: function(){
            return this.options.container || document.body;
        },

        //Applies all the behavior filters for an element.
        //container - (element) an element to apply the filters registered with this Behavior instance to.
        //force - (boolean; optional) passed through to applyFilter (see it for docs)
        apply: function(container, force){
          this._getElements(container).each(function(element){
                var plugins = [];
                element.getBehaviors().each(function(name){
                    var filter = this.getFilter(name);
                    if (!filter){
                        this.fireEvent('error', ['There is no filter registered with this name: ', name, element]);
                    } else {
                        var config = filter.config;
                        if (config.delay !== undefined){
                            this.applyFilter.delay(filter.config.delay, this, [element, filter, force]);
                        } else if(config.delayUntil){
                            this._delayFilterUntil(element, filter, force);
                        } else if(config.initializer){
                            this._customInit(element, filter, force);
                        } else {
                            plugins.append(this.applyFilter(element, filter, force, true));
                        }
                    }
                }, this);
                plugins.each(function(plugin){
                    if (this.options.verbose) this.fireEvent('log', ['Firing plugin...']);
                    plugin();
                }, this);
            }, this);
            return this;
        },

        _getElements: function(container){
            if (typeOf(this.options.selector) == 'function') return this.options.selector(container);
            else return document.id(container).getElements(this.options.selector);
        },

        //delays a filter until the event specified in filter.config.delayUntil is fired on the element
        _delayFilterUntil: function(element, filter, force){
            var events = filter.config.delayUntil.split(','),
                attached = {},
                inited = false;
            var clear = function(){
                events.each(function(event){
                    element.removeEvent(event, attached[event]);
                });
                clear = function(){};
            };
            events.each(function(event){
                var init = function(e){
                    clear();
                    if (inited) return;
                    inited = true;
                    var setup = filter.setup;
                    filter.setup = function(element, api, _pluginResult){
                        api.event = e;
                        return setup.apply(filter, [element, api, _pluginResult]);
                    };
                    this.applyFilter(element, filter, force);
                    filter.setup = setup;
                }.bind(this);
                element.addEvent(event, init);
                attached[event] = init;
            }, this);
        },

        //runs custom initiliazer defined in filter.config.initializer
        _customInit: function(element, filter, force){
            var api = new this.API(element, filter.name);
            api.runSetup = this.applyFilter.pass([element, filter, force], this);
            filter.config.initializer(element, api);
        },

        //Applies a specific behavior to a specific element.
        //element - the element to which to apply the behavior
        //filter - (object) a specific behavior filter, typically one registered with this instance or registered globally.
        //force - (boolean; optional) apply the behavior to each element it matches, even if it was previously applied. Defaults to *false*.
        //_returnPlugins - (boolean; optional; internal) if true, plugins are not rendered but instead returned as an array of functions
        //_pluginTargetResult - (obj; optional internal) if this filter is a plugin for another, this is whatever that target filter returned
        //                      (an instance of a class for example)
        applyFilter: function(element, filter, force, _returnPlugins, _pluginTargetResult){
            var pluginsToReturn = [];
            if (this.options.breakOnErrors){
                pluginsToReturn = this._applyFilter.apply(this, arguments);
            } else {
                try {
                    pluginsToReturn = this._applyFilter.apply(this, arguments);
                } catch (e){
                    this.fireEvent('error', ['Could not apply the behavior ' + filter.name, e.message]);
                }
            }
            return _returnPlugins ? pluginsToReturn : this;
        },

        //see argument list above for applyFilter
        _applyFilter: function(element, filter, force, _returnPlugins, _pluginTargetResult){
            var pluginsToReturn = [];
            element = document.id(element);
            //get the filters already applied to this element
            var applied = getApplied(element);
            //if this filter is not yet applied to the element, or we are forcing the filter
            if (!applied[filter.name] || force){
                if (this.options.verbose) this.fireEvent('log', ['Applying behavior: ', filter.name, element]);
                //if it was previously applied, garbage collect it
                if (applied[filter.name]) applied[filter.name].cleanup(element);
                var api = new this.API(element, filter.name);

                //deprecated
                api.markForCleanup = filter.markForCleanup.bind(filter);
                api.onCleanup = function(fn){
                    filter.markForCleanup(element, fn);
                };

                if (filter.config.deprecated && this.options.enableDeprecation) api.deprecate(filter.config.deprecated);
                if (filter.config.deprecateAsJSON && this.options.enableDeprecation) api.deprecate(filter.config.deprecatedAsJSON, true);

                //deal with requirements and defaults
                if (filter.config.requireAs){
                    api.requireAs(filter.config.requireAs);
                } else if (filter.config.require){
                    api.require.apply(api, Array.from(filter.config.require));
                }

                if (filter.config.defaults) api.setDefault(filter.config.defaults);

                //apply the filter
                if (Behavior.debugging && Behavior.debugging.contains(filter.name)) debugger;
                var result = filter.setup(element, api, _pluginTargetResult);
                if (filter.config.returns && !instanceOf(result, filter.config.returns)){
                    throw new Error("Filter " + filter.name + " did not return a valid instance.");
                }
                element.store('Behavior Filter result:' + filter.name, result);
                if (this.options.verbose){
                    if (result && !_pluginTargetResult) this.fireEvent('log', ['Successfully applied behavior: ', filter.name, element, result]);
                    else this.fireEvent('warn', ['Behavior applied, but did not return result: ', filter.name, element, result]);
                }

                //and mark it as having been previously applied
                applied[filter.name] = filter;
                //apply all the plugins for this filter
                var plugins = this.getPlugins(filter.name);
                if (plugins){
                    for (var name in plugins){
                        if (_returnPlugins){
                            pluginsToReturn.push(this.applyFilter.pass([element, plugins[name], force, null, result], this));
                        } else {
                            this.applyFilter(element, plugins[name], force, null, result);
                        }
                    }
                }
            }
            return pluginsToReturn;
        },

        //given a name, returns a registered behavior
        getFilter: function(name){
            return this._registered[name] || Behavior.getFilter(name);
        },

        getPlugins: function(name){
            return this._plugins[name] || Behavior._plugins[name];
        },

        //Garbage collects all applied filters for an element and its children.
        //element - (*element*) container to cleanup
        //ignoreChildren - (*boolean*; optional) if *true* only the element will be cleaned, otherwise the element and all the
        //    children with filters applied will be cleaned. Defaults to *false*.
        cleanup: function(element, ignoreChildren){
            element = document.id(element);
            var applied = getApplied(element);
            for (var filter in applied){
                applied[filter].cleanup(element);
                element.eliminate('Behavior Filter result:' + filter);
                delete applied[filter];
            }
            if (!ignoreChildren) this._getElements(element).each(this.cleanup, this);
            return this;
        }

    });

    //Export these for use elsewhere (notabily: Delegator).
    Behavior.getLog = getLog;
    Behavior.PassMethods = PassMethods;


    //Returns the applied behaviors for an element.
    var getApplied = function(el){
        return el.retrieve('_appliedBehaviors', {});
    };

    //Registers a behavior filter.
    //name - the name of the filter
    //fn - a function that applies the filter to the given element
    //overwrite - (boolean) if true, will overwrite existing filter if one exists; defaults to false.
    var addFilter = function(name, fn, overwrite){
        if (!this._registered[name] || overwrite) this._registered[name] = new Behavior.Filter(name, fn);
        else throw new Error('Could not add the Behavior filter "' + name  +'" as a previous trigger by that same name exists.');
    };

    var addFilters = function(obj, overwrite){
        for (var name in obj){
            addFilter.apply(this, [name, obj[name], overwrite]);
        }
    };

    //Registers a behavior plugin
    //filterName - (*string*) the filter (or plugin) this is a plugin for
    //name - (*string*) the name of this plugin
    //setup - a function that applies the filter to the given element
    var addPlugin = function(filterName, name, setup, overwrite){
        if (!this._plugins[filterName]) this._plugins[filterName] = {};
        if (!this._plugins[filterName][name] || overwrite) this._plugins[filterName][name] = new Behavior.Filter(name, setup);
        else throw new Error('Could not add the Behavior filter plugin "' + name  +'" as a previous trigger by that same name exists.');
    };

    var addPlugins = function(obj, overwrite){
        for (var name in obj){
            addPlugin.apply(this, [obj[name].fitlerName, obj[name].name, obj[name].setup], overwrite);
        }
    };

    var setFilterDefaults = function(name, defaults){
        var filter = this.getFilter(name);
        if (!filter.config.defaults) filter.config.defaults = {};
        Object.append(filter.config.defaults, defaults);
    };

    //Add methods to the Behavior namespace for global registration.
    Object.append(Behavior, {
        _registered: {},
        _plugins: {},
        addGlobalFilter: addFilter,
        addGlobalFilters: addFilters,
        addGlobalPlugin: addPlugin,
        addGlobalPlugins: addPlugins,
        setFilterDefaults: setFilterDefaults,
        getFilter: function(name){
            return this._registered[name];
        }
    });
    //Add methods to the Behavior class for instance registration.
    Behavior.implement({
        _registered: {},
        _plugins: {},
        addFilter: addFilter,
        addFilters: addFilters,
        addPlugin: addPlugin,
        addPlugins: addPlugins,
        setFilterDefaults: setFilterDefaults
    });

    //This class is an actual filter that, given an element, alters it with specific behaviors.
    Behavior.Filter = new Class({

        config: {
            /**
                returns: Foo,
                require: ['req1', 'req2'],
                //or
                requireAs: {
                    req1: Boolean,
                    req2: Number,
                    req3: String
                },
                defaults: {
                    opt1: false,
                    opt2: 2
                },
                //simple example:
                setup: function(element, API){
                    var kids = element.getElements(API.get('selector'));
                    //some validation still has to occur here
                    if (!kids.length) API.fail('there were no child elements found that match ', API.get('selector'));
                    if (kids.length < 2) API.warn("there weren't more than 2 kids that match", API.get('selector'));
                    var fooInstance = new Foo(kids, API.get('opt1', 'opt2'));
                    API.onCleanup(function(){
                        fooInstance.destroy();
                    });
                    return fooInstance;
                },
                delayUntil: 'mouseover',
                //OR
                delay: 100,
                //OR
                initializer: function(element, API){
                    element.addEvent('mouseover', API.runSetup); //same as specifying event
                    //or
                    API.runSetup.delay(100); //same as specifying delay
                    //or something completely esoteric
                    var timer = (function(){
                        if (element.hasClass('foo')){
                            clearInterval(timer);
                            API.runSetup();
                        }
                    }).periodical(100);
                    //or
                    API.addEvent('someBehaviorEvent', API.runSetup);
                });
                */
        },

        //Pass in an object with the following properties:
        //name - the name of this filter
        //setup - a function that applies the filter to the given element
        initialize: function(name, setup){
            this.name = name;
            if (typeOf(setup) == "function"){
                this.setup = setup;
            } else {
                Object.append(this.config, setup);
                this.setup = this.config.setup;
            }
            this._cleanupFunctions = new Table();
        },

        //Stores a garbage collection pointer for a specific element.
        //Example: if your filter enhances all the inputs in the container
        //you might have a function that removes that enhancement for garbage collection.
        //You would mark each input matched with its own cleanup function.
        //NOTE: this MUST be the element passed to the filter - the element with this filters
        //      name in its data-behavior property. I.E.:
        //<form data-behavior="FormValidator">
        //  <input type="text" name="email"/>
        //</form>
        //If this filter is FormValidator, you can mark the form for cleanup, but not, for example
        //the input. Only elements that match this filter can be marked.
        markForCleanup: function(element, fn){
            var functions = this._cleanupFunctions.get(element);
            if (!functions) functions = [];
            functions.include(fn);
            this._cleanupFunctions.set(element, functions);
            return this;
        },

        //Garbage collect a specific element.
        //NOTE: this should be an element that has a data-behavior property that matches this filter.
        cleanup: function(element){
            var marks = this._cleanupFunctions.get(element);
            if (marks){
                marks.each(function(fn){ fn(); });
                this._cleanupFunctions.erase(element);
            }
            return this;
        }

    });

    Behavior.debug = function(name){
        if (!Behavior.debugging) Behavior.debugging = [];
        Behavior.debugging.push(name);
    };

    Behavior.elementDataProperty = 'behavior';

    Element.implement({

        addBehaviorFilter: function(name){
            return this.setData(Behavior.elementDataProperty, this.getBehaviors().include(name).join(' '));
        },

        removeBehaviorFilter: function(name){
            return this.setData(Behavior.elementDataProperty, this.getBehaviors().erase(name).join(' '));
        },

        getBehaviors: function(){
            var filters = this.getData(Behavior.elementDataProperty);
            if (!filters) return [];
            return filters.trim().split(spaceOrCommaRegex);
        },

        hasBehavior: function(name){
            return this.getBehaviors().contains(name);
        },

        getBehaviorResult: function(name){
            return this.retrieve('Behavior Filter result:' + name);
        }

    });


})();


// Begin: Source/UI/Bootstrap.Tooltip.js
/*
---

name: Bootstrap.Tooltip

description: A simple tooltip implementation that works with the Twitter Bootstrap css framework.

authors: [Aaron Newton]

license: MIT-style license.

requires:
 - /Bootstrap
 - /CSSEvents
 - More/Element.Position
 - More/Element.Shortcuts
 - Behavior/Behavior

provides: [Bootstrap.Twipsy, Bootstrap.Tooltip]

...
*/

Bootstrap.Tooltip = Bootstrap.Twipsy = new Class({

    Implements: [Options, Events],

    options: {
        location: 'above', //below, left, right, bottom, top
        animate: true,
        delayIn: 200,
        delayOut: 0,
        fallback: '',
        override: '',
        onOverflow: false,
        offset: 0,
        title: 'title', //element property
        trigger: 'hover', //focus, manual
        getContent: function(el){
            return el.get(this.options.title);
        }
    },

    initialize: function(el, options){
        this.element = document.id(el);
        this.setOptions(options);
        var location = this.options.location;
        if (location == 'above') this.options.location = 'top';    //bootstrap 2.0
        if (location == 'below') this.options.location = 'bottom'; //bootstrap 2.0
        this._attach();
    },

    show: function(){
        this._clear();
        this._makeTip();
        var pos, edge, offset = {x: 0, y: 0};
        switch(this.options.location){
            case 'below': case 'bottom':
                pos = 'centerBottom';
                edge = 'centerTop';
                offset.y = this.options.offset;
                break;
            case 'left':
                pos = 'centerLeft';
                edge = 'centerRight';
                offset.x = this.options.offset;
                break;
            case 'right':
                pos = 'centerRight';
                edge = 'centerLeft';
                offset.x = this.options.offset;
                break;
            default: //top
                pos = 'centerTop';
                edge = 'centerBottom';
                offset.y = this.options.offset;
        }
        if (typeOf(this.options.offset) == "object") offset = this.options.offset;
        this.tip.inject(document.body).show().position({
            relativeTo: this.element,
            position: pos,
            edge: edge,
            offset: offset
        }).removeClass('out').addClass('in');
        this.visible = true;
        if (!Browser.Features.cssTransition || !this.options.animate) this._complete();
        this.fireEvent('show');
        return this;
    },

    hide: function(){
        this._makeTip();
        this.tip.removeClass('in').addClass('out');
        this.visible = false;
        if (!Browser.Features.cssTransition || !this.options.animate) this._complete();
        this.fireEvent('hide');
        return this;
    },

    destroy: function(){
        this._detach();
        if (this.tip) this.tip.destroy();
        this.destroyed = true;
        return this;
    },

    // PRIVATE METHODS

    _makeTip: function(){
        if (!this.tip){
            var location = this.options.location;
            if (location == 'above') location = 'top';    //bootstrap 2.0
            if (location == 'below') location = 'bottom'; //bootstrap 2.0
            this.tip = new Element('div.tooltip').addClass(location)
                 .adopt(new Element('div.tooltip-arrow'))
                 .adopt(
                   new Element('div.tooltip-inner', {
                     html: this.options.override || this.options.getContent.apply(this, [this.element]) || this.options.fallback
                   })
                 );
            if (this.options.animate) this.tip.addClass('fade');
            if (Browser.Features.cssTransition && this.tip.addEventListener){
                this.tip.addEventListener(Browser.Features.transitionEnd, this.bound.complete);
            }
            this.element.set('alt', '').set('title', '');
        }
        return this.tip;
    },

    _attach: function(method){
        method = method || 'addEvents';
        this.bound = {
            enter: this._enter.bind(this),
            leave: this._leave.bind(this),
            complete: this._complete.bind(this)
        };

        if (this.options.trigger == 'hover') {
            this.element[method]({
                mouseenter: this.bound.enter,
                mouseleave: this.bound.leave
            });
        } else if (this.options.trigger == 'focus'){
            this.element[method]({
                focus: this.bound.enter,
                blur: this.bound.leave
            });
        }
    },

    _detach: function(){
        this._attach('removeEvents');
    },

    _clear: function(){
        clearTimeout(this._inDelay);
        clearTimeout(this._outDelay);
    },

    _enter: function(){
        if (this.options.onOverflow){
            var scroll = this.element.getScrollSize(),
                size = this.element.getSize();
            if (scroll.x <= size.x && scroll.y <= size.y) return;
        }
        this._clear();
        if (this.options.delayIn){
            this._inDelay = this.show.delay(this.options.delayIn, this);
        } else {
            this.show();
        }
    },

    _leave: function(){
        this._clear();
        if (this.options.delayOut){
            this._outDelay = this.hide.delay(this.options.delayOut, this);
        } else {
            this.hide();
        }
    },

    _complete: function(){
        if (!this.visible){
            this.tip.dispose();
        }
        this.fireEvent('complete', this.visible);
    }

});

// Begin: Source/Behaviors/Behavior.BS.Tooltip.js
/*
---

name: Behavior.BS.Tooltip

description: Instantiates Bootstrap.Tooltip based on HTML markup.

license: MIT-style license.

authors: [Aaron Newton]

requires:
 - /Bootstrap.Tooltip
 - Behavior/Behavior
 - More/Object.Extras

provides: [Behavior.BS.Twipsy, Behavior.BS.Tooltip]

...
*/
(function(){
    var filter = {
        defaults: {
            location: 'above', //below, left, right
            animate: true,
            delayIn: 200,
            delayOut: 0,
            onOverflow: false,
            offset: 0,
            trigger: 'hover' //focus, manual
        },
        delayUntil: 'mouseover,focus',
        returns: Bootstrap.Tooltip,
        setup: function(el, api){
            var options = Object.cleanValues(
                api.getAs({
                    onOverflow: Boolean,
                    location: String,
                    animate: Boolean,
                    delayIn: Number,
                    delayOut: Number,
                    fallback: String,
                    override: String,
                    html: Boolean,
                    offset: Number,
                    trigger: String
                })
            );
            options.getTitle = Function.from(api.get('content') || el.get('title'));
            var tip = new Bootstrap.Tooltip(el, options);
            api.onCleanup(tip.destroy.bind(tip));
            if (api.event) tip.show();
            return tip;
        }
    };
    Behavior.addGlobalFilters({
        'BS.Tooltip': filter,
        'BS.Twipsy': filter
    });
})();

// Begin: Source/UI/Bootstrap.Popup.js
/*
---

name: Popup

description: A simple Popup class for the Twitter Bootstrap CSS framework.

authors: [Aaron Newton]

license: MIT-style license.

requires:
 - Core/Element.Delegation
 - Core/Fx.Tween
 - Core/Fx.Transitions
 - More/Mask
 - More/Elements.From
 - More/Element.Position
 - More/Element.Shortcuts
 - More/Events.Pseudos
 - /CSSEvents
 - /Bootstrap

provides: [Bootstrap.Popup]

...
*/

Bootstrap.Popup = new Class({

    Implements: [Options, Events],

    options: {
        /*
            onShow: function(){},
            onHide: function(){},
            animate: function(){},
            destroy: function(){},
        */
        persist: true,
        closeOnClickOut: true,
        closeOnEsc: true,
        mask: true,
        animate: true,
        changeDisplayValue: true
    },

    initialize: function(element, options){
        this.element = document.id(element).store('Bootstrap.Popup', this);
        this.setOptions(options);
        this.bound = {
            hide: this.hide.bind(this),
            bodyClick: function(e){
                if (!this.element.contains(e.target)){
                    this.hide();
                }
            }.bind(this),
            keyMonitor: function(e){
                if (e.key == 'esc') this.hide();
            }.bind(this),
            animationEnd: this._animationEnd.bind(this)
        };
        if ((this.element.hasClass('fade') && this.element.hasClass('in')) ||
            (!this.element.hasClass('hide') && !this.element.hasClass('fade'))){
            if (this.element.hasClass('fade')) this.element.removeClass('in');
            this.show();
        }
    },

    toElement: function(){
        return this.element;
    },

    _checkAnimate: function(){
        var check = this.options.animate !== false && Browser.Features.getCSSTransition() && (this.options.animate || this.element.hasClass('fade'));
        if (!check) {
            this.element.removeClass('fade').addClass('hide');
            if (this._mask) this._mask.removeClass('fade').addClass('hide');
        } else if (check) {
            this.element.addClass('fade').removeClass('hide');
            if (this._mask) this._mask.addClass('fade').removeClass('hide');
        }
        return check;
    },

    show: function(){
        if (this.visible || this.animating) return;
        this.element.addEvent('click:relay(.close, .dismiss)', this.bound.hide);
        if (this.options.closeOnEsc) document.addEvent('keyup', this.bound.keyMonitor);
        this._makeMask();
        if (this._mask) this._mask.inject(document.body);
        this.animating = true;
        if (this.options.changeDisplayValue) this.element.show();
        if (this._checkAnimate()){
            this.element.offsetWidth; // force reflow
            this.element.addClass('in');
            if (this._mask) this._mask.addClass('in');
        } else {
            this.element.show();
            if (this._mask) this._mask.show();
        }
        this.visible = true;
        this._watch();
    },

    _watch: function(){
        if (this._checkAnimate()) this.element.addEventListener(Browser.Features.getCSSTransition(), this.bound.animationEnd);
        else this._animationEnd();
    },

    _animationEnd: function(){
        if (Browser.Features.getCSSTransition()) this.element.removeEventListener(Browser.Features.getCSSTransition(), this.bound.animationEnd);
        this.animating = false;
        if (this.visible){
            this.fireEvent('show', this.element);
        } else {
            this.fireEvent('hide', this.element);
            if (this.options.changeDisplayValue) this.element.hide();
            if (!this.options.persist){
                this.destroy();
            } else if (this._mask) {
                this._mask.dispose();
            }
        }
    },

    destroy: function(){
        if (this._mask) this._mask.destroy();
        this.fireEvent('destroy', this.element);
        this.element.destroy();
        this._mask = null;
        this.destroyed = true;
    },

    hide: function(event, clicked){
        if (clicked) {
            var immediateParentPopup = clicked.getParent('[data-behavior~=BS.Popup]');
            if (immediateParentPopup && immediateParentPopup != this.element) return;
        }
        if (!this.visible || this.animating) return;
        this.animating = true;
        if (event && clicked && clicked.hasClass('stopEvent')){
            event.preventDefault();
        }
        document.id(document.body).removeEvent('click', this.bound.hide);
        document.removeEvent('keyup', this.bound.keyMonitor);
        this.element.removeEvent('click:relay(.close, .dismiss)', this.bound.hide);

        if (this._checkAnimate()){
            this.element.removeClass('in');
            if (this._mask) this._mask.removeClass('in');
        } else {
            this.element.hide();
            if (this._mask) this._mask.hide();
        }
        this.visible = false;
        this._watch();
    },

    // PRIVATE

    _makeMask: function(){
        if (this.options.mask){
            if (!this._mask){
                this._mask = new Element('div.modal-backdrop');
                if (this._checkAnimate()) this._mask.addClass('fade');
            }
        }
        if (this.options.closeOnClickOut){
            if (this._mask) this._mask.addEvent('click', this.bound.hide);
            else document.id(document.body).addEvent('click', this.bound.hide);
        }
    }

});

// Begin: Source/Behaviors/Behavior.BS.Popup.js
/*
---

name: Behavior.Popup

description: Creates a bootstrap popup based on HTML markup.

license: MIT-style license.

authors: [Aaron Newton]

requires:
 - Behavior/Behavior
 - More/Object.Extras
 - Bootstrap.Popup

provides: [Behavior.BS.Popup]

...
*/

Behavior.addGlobalFilters({
    'BS.Popup': {
        defaults: {
            focusOnShow: "input[type=text], select, textarea, .modal-footer .btn-primary, .modal-footer .btn",
            hide: false,
            animate: true,
            closeOnEsc: true,
            closeOnClickOut: true,
            mask: true,
            persist: true
        },
        returns: Bootstrap.Popup,
        setup: function(el, api){
            var popup = new Bootstrap.Popup(el,
                Object.cleanValues(
                    api.getAs({
                        persist: Boolean,
                        animate: Boolean,
                        closeOnEsc: Boolean,
                        closeOnClickOut: Boolean,
                        mask: Boolean
                    })
                )
            );
            popup.addEvent('destroy', function(){
                api.cleanup(el);
            });
            popup.addEvent('show', function(){
                var focus = document.id(popup).getElement(api.get('focusOnShow'));
                if (focus) focus.select();
            });
            if (!el.hasClass('hide') && !api.getAs(Boolean, 'hide') && (!el.hasClass('in') && !el.hasClass('fade'))) {
                popup.show();
            }
            return popup;
        }
    }
});

// Begin: Source/UI/Bootstrap.Dropdown.js
/*
---

name: Bootstrap.Dropdown

description: A simple dropdown menu that works with the Twitter Bootstrap css framework.

license: MIT-style license.

authors: [Aaron Newton]

requires:
 - /Bootstrap
 - Core/Element.Event
 - More/Element.Shortcuts

provides: Bootstrap.Dropdown

...
*/
Bootstrap.Dropdown = new Class({

    Implements: [Options, Events],

    options: {
        /*
            onShow: function(element){},
            onHide: function(elements){},
        */
        ignore: 'input, select, label'
    },

    initialize: function(container, options){
        this.element = document.id(container);
        this.setOptions(options);
        this.boundHandle = this._handle.bind(this);
        document.id(document.body).addEvent('click', this.boundHandle);
    },

    hideAll: function(){
        var els = this.element.getElements('.open').removeClass('open');
        this.fireEvent('hide', els);
        return this;
    },

    show: function(subMenu){
        this.hideAll();
        this.fireEvent('show', subMenu);
        subMenu.addClass('open');
        return this;
    },

    destroy: function(){
        this.hideAll();
        document.body.removeEvent('click', this.boundHandle);
        return this;
    },

    // PRIVATE

    _handle: function(e){
        var el = e.target;
        var open = el.getParent('.open');
        if (!el.match(this.options.ignore) || !open) this.hideAll();
        if (this.element.contains(el)) {
            var parent = null;
            if (el.match('[data-toggle="dropdown"]') || el.getParent('[data-toggle="dropdown"] !')) {
                parent = el.getParent('.dropdown, .btn-group');
            }
            // backwards compatibility
            if (!parent) parent = el.match('.dropdown-toggle') ? el.getParent() : el.getParent('.dropdown-toggle !');
            if (parent) {
                e.preventDefault();
                if (!open) this.show(parent);
            }
        }
    }
});

// Begin: Source/Behaviors/Behavior.BS.Dropdown.js
/*
---

name: Behavior.BS.Dropdown

description: Instantiates Bootstrap.Dropdown based on HTML markup.

license: MIT-style license.

authors: [Aaron Newton]

requires:
 - Behavior/Behavior
 - Bootstrap.Dropdown

provides: [Behavior.BS.Dropdown]

...
*/
Behavior.addGlobalFilters({
    'BS.Dropdown': {
        returns: Bootstrap.Dropdown,
        setup: function(el, api){
            return new Bootstrap.Dropdown(el);
        }
    }
});

// Begin: Source/Layout/TabSwapper.js
/*
---

name: TabSwapper

description: Handles the scripting for a common UI layout; the tabbed box.

license: MIT-Style License

requires: [Core/Element.Event, Core/Fx.Tween, Core/Fx.Morph, Core/Element.Dimensions, More/Element.Shortcuts, More/Element.Measure]

provides: TabSwapper

...
*/
var TabSwapper = new Class({
    Implements: [Options, Events],
    options: {
        // initPanel: null,
        // smooth: false,
        // smoothSize: false,
        // maxSize: null,
        // onActive: function(){},
        // onActiveAfterFx: function(){},
        // onBackground: function(){}
        // cookieName: null,
        preventDefault: true,
        selectedClass: 'tabSelected',
        mouseoverClass: 'tabOver',
        deselectedClass: '',
        rearrangeDOM: true,
        effectOptions: {
            duration: 500
        },
        cookieDays: 999
    },
    tabs: [],
    sections: [],
    clickers: [],
    sectionFx: [],
    initialize: function(options){
        this.setOptions(options);
        var prev = this.setup();
        if (prev) return prev;
        if (this.options.initPanel != null) this.show(this.options.initPanel);
        else if (this.options.cookieName && this.recall()) this.show(this.recall().toInt());
        else this.show(0);

    },
    setup: function(){
        var opt = this.options,
            sections = $$(opt.sections),
            tabs = $$(opt.tabs);
        if (tabs[0] && tabs[0].retrieve('tabSwapper')) return tabs[0].retrieve('tabSwapper');
        var clickers = $$(opt.clickers);
        tabs.each(function(tab, index){
            this.addTab(tab, sections[index], clickers[index], index);
        }, this);
    },
    addTab: function(tab, section, clicker, index){
        tab = document.id(tab); clicker = document.id(clicker); section = document.id(section);
        //if the tab is already in the interface, just move it
        if (this.tabs.indexOf(tab) >= 0 && tab.retrieve('tabbered')
             && this.tabs.indexOf(tab) != index && this.options.rearrangeDOM) {
            this.moveTab(this.tabs.indexOf(tab), index);
            return this;
        }
        //if the index isn't specified, put the tab at the end
        if (index == null) index = this.tabs.length;
        //if this isn't the first item, and there's a tab
        //already in the interface at the index 1 less than this
        //insert this after that one
        if (index > 0 && this.tabs[index-1] && this.options.rearrangeDOM) {
            tab.inject(this.tabs[index-1], 'after');
            section.inject(this.tabs[index-1].retrieve('section'), 'after');
        }
        this.tabs.splice(index, 0, tab);
        clicker = clicker || tab;

        tab.addEvents({
            mouseout: function(){
                tab.removeClass(this.options.mouseoverClass);
            }.bind(this),
            mouseover: function(){
                tab.addClass(this.options.mouseoverClass);
            }.bind(this)
        });

        clicker.addEvent('click', function(e){
            if (this.options.preventDefault) e.preventDefault();
            this.show(index);
        }.bind(this));

        tab.store('tabbered', true);
        tab.store('section', section);
        tab.store('clicker', clicker);
        this.hideSection(index);
        return this;
    },
    removeTab: function(index){
        var now = this.tabs[this.now];
        if (this.now == index){
            if (index > 0) this.show(index - 1);
            else if (index < this.tabs.length) this.show(index + 1);
        }
        this.now = this.tabs.indexOf(now);
        return this;
    },
    moveTab: function(from, to){
        var tab = this.tabs[from];
        var clicker = tab.retrieve('clicker');
        var section = tab.retrieve('section');

        var toTab = this.tabs[to];
        var toClicker = toTab.retrieve('clicker');
        var toSection = toTab.retrieve('section');

        this.tabs.erase(tab).splice(to, 0, tab);

        tab.inject(toTab, 'before');
        clicker.inject(toClicker, 'before');
        section.inject(toSection, 'before');
        return this;
    },
    show: function(i){
        if (this.now == null) {
            this.tabs.each(function(tab, idx){
                if (i != idx)
                    this.hideSection(idx);
            }, this);
        }
        this.showSection(i).save(i);
        return this;
    },
    save: function(index){
        if (this.options.cookieName)
            Cookie.write(this.options.cookieName, index, {duration:this.options.cookieDays});
        return this;
    },
    recall: function(){
        return (this.options.cookieName) ? Cookie.read(this.options.cookieName) : false;
    },
    hideSection: function(idx) {
        var tab = this.tabs[idx];
        if (!tab) return this;
        var sect = tab.retrieve('section');
        if (!sect) return this;
        if (sect.getStyle('display') != 'none') {
            this.lastHeight = sect.getSize().y;
            sect.setStyle('display', 'none');
            tab.swapClass(this.options.selectedClass, this.options.deselectedClass);
            this.fireEvent('onBackground', [idx, sect, tab]);
        }
        return this;
    },
    showSection: function(idx) {
        var tab = this.tabs[idx];
        if (!tab) return this;
        var sect = tab.retrieve('section');
        if (!sect) return this;
        var smoothOk = this.options.smooth && !Browser.ie;
        if (this.now != idx) {
            if (!tab.retrieve('tabFx'))
                tab.store('tabFx', new Fx.Morph(sect, this.options.effectOptions));
            var overflow = sect.getStyle('overflow');
            var start = {
                display:'block',
                overflow: 'hidden'
            };
            if (smoothOk) start.opacity = 0;
            var effect = false;
            if (smoothOk) {
                effect = {opacity: 1};
            } else if (sect.getStyle('opacity').toInt() < 1) {
                sect.setStyle('opacity', 1);
                if (!this.options.smoothSize) this.fireEvent('onActiveAfterFx', [idx, sect, tab]);
            }
            if (this.options.smoothSize) {
                var size = sect.getDimensions().height;
                if (this.options.maxSize != null && this.options.maxSize < size)
                    size = this.options.maxSize;
                if (!effect) effect = {};
                effect.height = size;
            }
            if (this.now != null) this.hideSection(this.now);
            if (this.options.smoothSize && this.lastHeight) start.height = this.lastHeight;
            sect.setStyles(start);
            var finish = function(){
                this.fireEvent('onActiveAfterFx', [idx, sect, tab]);
                sect.setStyles({
                    height: this.options.maxSize == effect.height ? this.options.maxSize : "auto",
                    overflow: overflow
                });
                sect.getElements('input, textarea').setStyle('opacity', 1);
            }.bind(this);
            if (effect) {
                tab.retrieve('tabFx').start(effect).chain(finish);
            } else {
                finish();
            }
            this.now = idx;
            this.fireEvent('onActive', [idx, sect, tab]);
        }
        tab.swapClass(this.options.deselectedClass, this.options.selectedClass);
        return this;
    }
});


// Begin: Source/Behaviors/Behavior.Tabs.js
/*
---
name: Behavior.Tabs
description: Adds a tab interface (TabSwapper instance) for elements with .css-tab_ui. Matched with tab elements that are .tabs and sections that are .tab_sections.
provides: [Behavior.Tabs]
requires: [Behavior/Behavior, /TabSwapper, More/String.QueryString, More/Object.Extras]
script: Behavior.Tabs.js

...
*/

Behavior.addGlobalFilters({

    Tabs: {
        defaults: {
            'tabs-selector': '.tabs>li',
            'sections-selector': '.tab_sections>li',
            smooth: true,
            smoothSize: true,
            rearrangeDOM: false,
            preventDefault: true
        },
        setup: function(element, api) {
            var tabs = element.getElements(api.get('tabs-selector'));
            var sections = element.getElements(api.get('sections-selector'));
            if (tabs.length != sections.length || tabs.length == 0) {
                api.fail('warning; sections and sections are not of equal number. tabs: ' + tabs.length + ', sections: ' + sections.length);
            }
            var getHash = function(){
                return window.location.hash.substring(1, window.location.hash.length).parseQueryString();
            };

            var ts = new TabSwapper(
                Object.merge(
                    {
                        tabs: tabs,
                        sections: sections,
                        initPanel: api.get('hash') ? getHash()[api.get('hash')] : null
                    },
                    Object.cleanValues(
                        api.getAs({
                            smooth: Boolean,
                            smoothSize: Boolean,
                            rearrangeDOM: Boolean,
                            selectedClass: String,
                            initPanel: Number,
                            preventDefault: Boolean
                        })
                    )
                )
            );
            ts.addEvent('active', function(index){
                if (api.get('hash')) {
                    var hash = getHash();
                    hash[api.get('hash')] = index;
                    window.location.hash = Object.cleanValues(Object.toQueryString(hash));
                }
                api.fireEvent('layout:display', sections[0].getParent());
            });
            element.store('TabSwapper', ts);
            return ts;
        }
    }
});


// Begin: Source/Behaviors/Behavior.BS.Tabs.js
/*
---

name: Behavior.BS.Tabs

description: Instantiates Bootstrap.Tabs based on HTML markup.

license: MIT-style license.

authors: [Aaron Newton]

requires:
 - Behavior/Behavior
 - Clientcide/Behavior.Tabs

provides: [Behavior.BS.Tabs]

...
*/
(function(){

    // start with the base options from the tabs behavior
    var tabs = Object.clone(Behavior.getFilter('Tabs'));

    // customizing it here for Bootstrap, we start by duplicationg the other behavior
    Behavior.addGlobalFilters({
        'BS.Tabs': tabs.config
    });

    // set custom defaults specific to bootstrap
    Behavior.setFilterDefaults('BS.Tabs', {
        'tabs-selector': 'a:not(.dropdown-toggle)',
        'sections-selector': '+.tab-content >',
        'selectedClass': 'active',
        smooth: false,
        smoothSize: false
    });

    // this plugin configures tabswapper to use bootstrap specific DOM structures
    Behavior.addGlobalPlugin('BS.Tabs', 'BS.Tabs.CSS', function(el, api, instance){
        // whenever the tabswapper activates a tab
        instance.addEvent('active', function(index, section, tab){
            // get the things in the tabs element that are active and remove that class
            el.getElements('.active').removeClass('active');
            // get the parent LI for the tab and add active to it
            tab.getParent('li').addClass('active');
            // handle the possibility of a dropdown in the tab.
            var dropdown = tab.getParent('.dropdown');
            if (dropdown) dropdown.addClass('active');
        });
        // invoke the event for startup
        var now = instance.now;
        var tab = instance.tabs[now];
        var section = tab.retrieve('section');
        instance.fireEvent('active', [now, section, tab]);

    });

    // this plugin makes links that have #href targets select their target tabs
    Behavior.addGlobalPlugin('BS.Tabs', 'BS.Tabs.TargetLinks', function(el, api, instance){
        // whenever the instance activates a tab, find any related #href links and add `active-section-link` to the appropriate ones
        instance.addEvent('active', function(index, section, tab){
            document.body.getElements('.active-section-link').removeClass('active-section-link');
            // if there's a "group controller" go select it.
            if (tab.get('data-tab-group')) {
                document.id(tab.get('data-tab-group')).addClass('active-section-link');
            }
        });

                // invoke the event for startup
        var now = instance.now;
        var tab = instance.tabs[now];
        var section = tab.retrieve('section');
        instance.fireEvent('active', [now, section, tab]);

    });

})();


/**
 * Copyright 2012 Tsvetan Tsvetkov
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Author: Tsvetan Tsvetkov (tsekach@gmail.com)
 */
(function (win) {
    /*
     Safari native methods required for Notifications do NOT run in strict mode.
     */
    //"use strict";
    var PERMISSION_DEFAULT = "default",
        PERMISSION_GRANTED = "granted",
        PERMISSION_DENIED = "denied",
        PERMISSION = [PERMISSION_GRANTED, PERMISSION_DEFAULT, PERMISSION_DENIED],
        defaultSetting = {
            autoClose: 0
        },
        empty = {},
        emptyString = "",
        isSupported = (function () {
            var isSupported = false;
            /*
             * Use try {} catch() {} because the check for IE may throws an exception
             * if the code is run on browser that is not Safar/Chrome/IE or
             * Firefox with html5notifications plugin.
             *
             * Also, we canNOT detect if msIsSiteMode method exists, as it is
             * a method of host object. In IE check for existing method of host
             * object returns undefined. So, we try to run it - if it runs 
             * successfully - then it is IE9+, if not - an exceptions is thrown.
             */
            try {
                isSupported = !!(/* Safari, Chrome */win.Notification || /* Chrome & ff-html5notifications plugin */win.webkitNotifications || /* Firefox Mobile */navigator.mozNotification || /* IE9+ */(win.external && win.external.msIsSiteMode() !== undefined));
            } catch (e) {}
            return isSupported;
        }()),
        ieVerification = Math.floor((Math.random() * 10) + 1),
        noop = function () {},
        settings = defaultSetting;
    function getNotification(title, options) {
        var notification;
        if (win.Notification) { /* Safari 6, Chrome (23+) */
            notification =  new win.Notification(title, {
                /* The notification's icon - For Chrome in Windows, Linux & Chrome OS */
                icon: _.isString(options.icon) ? options.icon : options.icon.x32,
                /* The notification’s subtitle. */
                body: options.body || emptyString,
                /*
                    The notification’s unique identifier.
                    This prevents duplicate entries from appearing if the user has multiple instances of your website open at once.
                */
                tag: options.tag || emptyString
            });
        } else if (win.webkitNotifications) { /* FF with html5Notifications plugin installed */
            notification = win.webkitNotifications.createNotification(options.icon, title, options.body);
            notification.show();
        } else if (navigator.mozNotification) { /* Firefox Mobile */
            notification = navigator.mozNotification.createNotification(title, options.body, options.icon);
            notification.show();
        } else if (win.external && win.external.msIsSiteMode()) { /* IE9+ */
            //Clear any previous notifications
            win.external.msSiteModeClearIconOverlay();
            win.external.msSiteModeSetIconOverlay((_.isString(options.icon) ? options.icon : options.icon.x16), title);
            win.external.msSiteModeActivate();
            notification = {
                "ieVerification": ieVerification + 1
            };
        }
        return notification;
    }
    function getWrapper(notification) {
        return {
            close: function () {
                if (notification) {
                    if (notification.close) {
                        //http://code.google.com/p/ff-html5notifications/issues/detail?id=58
                        notification.close();
                    } else if (win.external && win.external.msIsSiteMode()) {
                        if (notification.ieVerification === ieVerification) {
                            win.external.msSiteModeClearIconOverlay();
                        }
                    }
                }
            }
        };
    }
    function requestPermission(callback) {
        if (!isSupported) { return; }
        var callbackFunction = _.isFunction(callback) ? callback : noop;
        if (win.webkitNotifications && win.webkitNotifications.checkPermission) {
            /*
             * Chrome 23 supports win.Notification.requestPermission, but it
             * breaks the browsers, so use the old-webkit-prefixed 
             * win.webkitNotifications.checkPermission instead.
             *
             * Firefox with html5notifications plugin supports this method
             * for requesting permissions.
             */
            win.webkitNotifications.requestPermission(callbackFunction);
        } else if (win.Notification && win.Notification.requestPermission) {
            win.Notification.requestPermission(callbackFunction);
        }
    }
    function permissionLevel() {
        var permission;
        if (!isSupported) { return; }
        if (win.Notification && win.Notification.permissionLevel) {
            //Safari 6
            permission = win.Notification.permissionLevel();
        } else if (win.webkitNotifications && win.webkitNotifications.checkPermission) {
            //Chrome & Firefox with html5-notifications plugin installed
            permission = PERMISSION[win.webkitNotifications.checkPermission()];
        } else if (navigator.mozNotification) {
            //Firefox Mobile
            permission = PERMISSION_GRANTED;
        } else if (win.Notification && win.Notification.permission) {
            // Firefox 23+
            permission = win.Notification.permission;
        } else if (win.external && (win.external.msIsSiteMode() !== undefined)) { /* keep last */
            //IE9+
            permission = win.external.msIsSiteMode() ? PERMISSION_GRANTED : PERMISSION_DEFAULT;
        }
        return permission;
    }
    /**
     *  
     */
    function config(params) {
        if (params && _.isObject(params)) {
            _.extend(settings, params);
        }
        return settings;
    }
    function createNotification(title, options) {
        var notification,
            notificationWrapper;
        /*
            Return undefined if notifications are not supported.

            Return undefined if no permissions for displaying notifications.

            Title and icons are required. Return undefined if not set.
         */
        if (isSupported && /*document.hasFocus() &&*/ _.isString(title) && (options && (_.isString(options.icon) || _.isObject(options.icon))) && (permissionLevel() === PERMISSION_GRANTED)) {
            notification = getNotification(title, options);
        }
        notificationWrapper = getWrapper(notification);
        //Auto-close notification
        if (settings.autoClose && notification && !notification.ieVerification && notification.addEventListener) {
            notification.addEventListener("show", function () {
                var notification = notificationWrapper;
                _.delay(function () {
                    notification.close();
                }, settings.autoClose);
            });
        }
        return notificationWrapper;
    }
    win.notify = {
        PERMISSION_DEFAULT: PERMISSION_DEFAULT,
        PERMISSION_GRANTED: PERMISSION_GRANTED,
        PERMISSION_DENIED: PERMISSION_DENIED,
        isSupported: isSupported,
        config: config,
        createNotification: createNotification,
        permissionLevel: permissionLevel,
        requestPermission: requestPermission
    };
    if (_.isFunction(Object.seal)) {
        Object.seal(win.notify);
    }
}(window));

// /*
// ---
// description: You can resize elements easilly with Drag

// authors:
//   - Arian Stolwijk + Graeme Yeates edits

// license:
//   - MIT-style license

// requires:
//   core/1.2.4: [Class.Extras,Element.Style]
//   more/1.2.4: [Drag]

// provides:
//   - [Drag.Resizable]
// ...
// */


// Drag.Resizable = new Class({

//     Implements: [Options, Events],

//     options: {
//         minSize: {
//             x: 0,
//             y: 0
//         },
//         dragOptions: {
//             style: false,
//             snap: 6
//         }
// /*direction: MooRezie.VERT/ Drag.HORZ,
//         minSize: false, // object with x and y or false
//         maxSize: false, // object with x and y or false
//         ratio: false, // false, true or any number (ratio = width/height)
//         dragOptions: {},
//         handleStyle: {},
        
//         onStart: $empty,
//         onResize: $empty,
//         onComplete: $empty*/
//     },

//     initialize: function(el, options) {
//         this.setOptions(options);
//         this.el = document.id(el);
//         this.container = this.options.container || el.parentElement;

//         if(this.options.ratio) {
//             var coords = this.el.getCoordinates();
//             this.origRatio = coords.width / coords.height;
//             this.setRatio(this.options.ratio);
//         }

//         //add more handles if you want
//         var handles = this.handles = {
//             corner: {
//                 el: this.options.handle,
//                 dragOptions: {
//                     onDrag: function(el, e) {
//                         var coords = this.el.getCoordinates();
//                         this.setSize(
//                             e.page.x - coords.left,
//                             e.page.y - coords.top,
//                             coords
//                         );
//                     }.bind(this)
//                 }
// /*, 
//                 setPosition: function(width,height) {
//                     this.handles.corner.el.setStyles({
//                         'left': width + this.elCoords.left - this.options.handleSize/2,
//                         'top': height + this.elCoords.top - this.options.handleSize/2
//                     });
//                 }.bind(this)*/
//             }
//         };

//         $each(handles, function(handle, key) {
//             // handle.el.setStyles($merge({
//             //     border: '1px solid black',
//             //     background: 'white'
//             // },this.options.handleStyle,{
//             //     position: 'absolute',
//             //     width: this.options.handleSize,
//             //     height: this.options.handleSize
//             // })).inject(this.el,'after');
//             // handle.setPosition(this.elCoords.width,this.elCoords.height);
//             handle.drag = new Drag(handle.el, $merge(this.options.dragOptions, handle.dragOptions));

//             handle.drag.addEvents({
//                 start: function() {
//                     this.fireEvent('start', [this.el.getSize()]);
//                 }.bind(this),
//                 complete: function() {
//                     this.fireEvent('complete', [this.el.getSize()]);
//                 }.bind(this)
//             });
//         }, this);
//     },

//     setSize: function(width, height, coords) {
//         var options = this.options,
//             elCoords = coords || this.el.getCoordinates(),
//             ratio = this.ratio,
//             minSize = options.minSize,
//             maxSize = options.maxSize,

//         size = Object.map({x: width,y: height}, function(val, dir) {
//                             if (minSize && val < minSize[dir]) {
//                                 return minSize[dir];
//                             } else if (maxSize && val > maxSize[dir]) {
//                                 return maxSize[dir];
//                             }
//                             return val.round();
//                             // return Math.min(maxSize[dir], Math.max(minSize[dir], val));
//                         });


//         if (size.x === null && size.y !== null) {
//             size.x = ratio ? size.y * ratio : elCoords.width;
//         } else if (size.y === null && size.x !== null) {
//             size.y = ratio ? size.x / ratio : elCoords.height;
//         } else if (size.x !== null && size.y !== null && ratio) {
//             size.y = size.x / ratio;
//         } else if(options.direction === Drag.VERT) {
//             size.y = elCoords.height;
//         } else if (options.direction === Drag.HORZ) {
//             size.x = elCoords.width;
//         }

//         this.el.setStyles({
//             width: size.x,
//             height: size.y
//         });

//         //now relative
//         /*$each(this.handles,function(handle){
//             handle.setPosition(size.x,size.y);
//         });*/
//         this.fireEvent('resize', [size, this.el]);
//         return this;
//     },

//     setRatio: function(ratio) {
//         this.ratio = $type(ratio) == 'boolean' ? (ratio ? this.origRatio : false) : ratio;
//         return this;
//     },

//     getRatio: function() {
//         return this.ratio;
//     },

//     dispose: function() {
//         $each(this.handles, function(handle) {
//             handle.el.dispose();
//         });
//         this.handles = null;
//     },

//     toElement: function() {
//         return this.el;
//     }

// });

Drag.VERT = 'y';
Drag.HORZ = 'x';

Drag.SplitPane = new Class({
    Extends: Drag,
    Binds: ["collapse"],

    options: {
        direction: Drag.HORZ,
        unit: 'px',
        style: false
        //fold -
        //store - object with a get and set method
    },

    initialize: function(divider, options) {
        this.parent(divider, options);

        var opts = this.options,
            dir = opts.direction,
            wh = (dir === Drag.HORZ) ? "width" : "height",
            selectMod =function (style, e) { return isNaN(e.getStyle(style).toInt()) ? wh : style; },

            div = this.div = document.id(divider),

            prev = this.prev = div.previousElementSibling,
            aft = this.aft = div.nextElementSibling,
            prevSize = this.prevSize = this.origPrevSize = prev.getSize()[dir],
            aftSize = this.aftSize = this.origAftSize =  aft.getSize()[dir],

            changeDir = prevSize > aftSize,

            mods = this.modifiers = {
                prev: selectMod('right', prev),
                div: changeDir ? 'right' : 'left',
                /*divSize: changeDir ? 'aftSize' : 'prevSize',*/
                aft: selectMod('left', aft),
                dir: changeDir,
                'wh': wh
            };

        if(opts.store) {
            var change = opts.store.get();
            this.adjust(change);
        }

        div.setStyle(mods.div, this[changeDir ? 'aftSize' : 'prevSize'] + opts.unit)//div.position({relativeTo: aft, position: {x: 'left', y: 'top'}, edge: {x:'right', y:'top'} })
            .addEvent("dblclick", this.collapse);
        this.addEvents({
            drag: this.drag
        });
    },
    adjust: function(change) {
        var opts = this.options,
            dir = opts.direction,
            mods = this.modifiers,
            unit = opts.unit,

            prev = this.prev,
            div = this.div,
            aft = this.aft;
            // prevSize = this.prevSize = psize >= prev.getStyle('minWidth').toInt() ? psize + unit : 0,
            // aftSize = this.aftSize = nsize >= aft.getStyle('minWidth').toInt() ? nsize + unit : 0;

        prev.setStyle(mods.prev, (prev.getStyle(mods.prev).toInt() +  change) + unit);
        div.setStyle(mods.div, (div.getStyle(mods.div).toInt() +  change) + unit);
        aft.setStyle(mods.aft, (aft.getStyle(mods.aft).toInt() + change) + unit);

        this.prevSize = prev.getSize()[dir];
        this.aftSize = aft.getSize()[dir];
        this.store(change);
        return this;
    },
    drag: function(evt) {
        if( !this.adjusting ) { //self triggering
            this.adjusting = true;
            var dir = this.options.direction,
                mods = this.modifiers,

                change = (mods.div === "right" || mods.div === "bottom") ?
                    this.prev.parentElement["get"  + mods.wh.capitalize()]() - evt.client[dir] - this.aftSize :
                    evt.client[dir] - this.prevSize;

            this.adjust(change);
            this.adjusting = false;
        }
        return this;
    },
    collapse: function(evt) {
        var size = this.aft.getStyle(this.modifiers.aft).toInt();
        if(size === 0) {
            this.adjust((this.modifiers.dir ? 1 : -1) * (this.collAftSize || this.origAftSize)); //initial size
        } else {
            this.collAftSize = size;
            this.adjust((this.modifiers.dir ? -1 : 1) * size);
        }
        return this;
    },

    store: function(change) {
        var store = this.options.store;
        if(store) {
            store.set(change);
        }
        return this;
    }
});

;(function(){
	'use strict';

	// wrapper function for requirejs or normal object
	var removeOn = function(string){
			return string.replace(/^on([A-Z])/, function(full, first){
				return first.toLowerCase();
			});
		},

		addEvent = function(type, fn){
			type = removeOn(type);

			var types = type.split(/\s+/),
				self = this;

			types.each(function(type){
				self.$events[type] = (self.$events[type] || []).include(fn);
			});

			return this;
		}.overloadSetter(),

		removeEvent = function(type, fn){
			// does not remove remote subscribers. careful, can cause memory issues if you don't clean up
			type = removeOn(type);
			var events = this.$events[type];
			if (events){
				if (fn){
					var index = events.indexOf(fn);
					if (index !== -1) delete events[index]; // sparses array, keeping index
				}
				else {
					delete this.$events[type];
				}
			}
			return this;
		}.overloadSetter(),

		fireEvent = function(type, args){
			type = removeOn(type);
			var events = this.$events[type] || [],//check bound events otherwise looks on proto
				subs = (type in this.$subscribers) ? this.$subscribers[type] : (all in this.$subscribers) ? this.$subscribers[all] : [],
				self = this;

			if (!events && !subs) return this;
			args = Type.isArguments(args) ? Array.slice(args) : [args];//handle array

			events.each(function(fn){
				// local events
				fn.apply(self, args);
			});

			subs.each(function(sub){
				// if event was added towards a specific callback, fire that
				if (sub.fn){
					sub.fn.apply(sub.context, args);
				}
				else {
					// runs on subscriber, shifting arguments to pass on instance with a fake event object.

					// this use is not recommended as it can cause event storms, use with caution and
					// argument shift, arg1 = context. result of .listenTo(obj) with no other args or with type but no callback.
					sub.subscriber.trigger(type, Array.flatten([self, args]));
				}
			});

			return this;
		},

		all = '*',

		func = 'function',

		EpitomeEvents = new Class({
			// custom event implementation

			$events: {},

			$subscribers: {},

			on: addEvent,
			off: removeEvent,
			trigger: fireEvent,

			addEvent: addEvent,
			removeEvent: removeEvent,
			fireEvent: fireEvent,

			listenTo: function(obj, type, fn){
				// obj: instance to subscribe to
				// type: particular event type or all events, defaults to '*'
				// last argument is the function to call, can shift to 2nd argument.

				// not using type and callbacks can subscribe locally but use with caution.
				var t = typeof type,
					event = {
						context: obj,
						subscriber: this
					};

				if (t === func){
					fn = type;
					type = all;
				}
				else if (t === 'undefined'){
					type = all;
				}

				fn && (event.fn = fn);
				obj.$subscribers[type] = (obj.$subscribers[type] || []).include(event);

				return this;
			},

			stopListening: function(obj, type, fn){
				// obj: instance to stop listening to
				// type: particular event to unsubscribe from, or all events by default. '*' for wildcard events only
				// fn: particular callback fn to unsubscribe from
				var len;
				Object.each(obj.$subscribers, function(value, key){
					len = value.length;
					if (typeof type !== 'undefined'){
						if (key === type) while (len--)
							(((fn && fn === value[len].fn) || !fn) && value[len].context === obj) && value.splice(len, 1);
					}
					else {
						// no type, unsubscribe from all for that context object
						while (len--) value[len].context === obj && value.splice(len, 1);
					}
				});

				return this;
			},

			setOptions: function(){
				//refactored setOptions to use .on and not addEvent. auto-mixed in.
				var options = this.options = Object.merge.apply(null, [
						{},
						this.options
					].append(arguments)),
					option;
				for (option in options){
					if (typeOf(options[option]) !== func || !(/^on[A-Z]/).test(option)) continue;
					this.on(option, options[option]);
					delete options[option];
				}
				return this;
			}
		});

	if (typeof define === 'function' && define.amd){
		define(function(){
			return EpitomeEvents;
		});
	}
	else if (typeof module !== 'undefined' && module.exports){
		module.exports = EpitomeEvents;
	}
	else {
		this.Epitome || (this.Epitome = {});
		this.Epitome.Events = EpitomeEvents;
	}
}.call(this));

;(function(){
	'use strict';

	var obj,
		wrap = function(Events){
			var e = new Events();
			e.Events = Events;
			return e;
		};

	// by default, requiring Epitome returns an Epitome.Events instance as a mediator
	if (typeof define === 'function' && define.amd){
		// returns an empty module
		define(['./epitome-events'], wrap);
	}
	else if (typeof module !== 'undefined' && module.exports){
		// CommonJS module is defined
		// load mootools-core npm
		require('mootools');

		obj = wrap(require('./epitome-events'));

		// export all sub modules that work w/o a browser.
		obj.Model = require('./epitome-model');
		obj.Collection = require('./epitome-collection');
		obj.isEqual = require('./epitome-isequal');
		obj.Template = require('./epitome-template');

		module.exports = obj;
	}
	else {
		this.Epitome = wrap(this.Epitome.Events);
	}
}.call(this));
;(function(){
	'use strict';

	// wrapper function for requirejs or normal object
	var wrap = function(){

		return _.isEqual;
	}; // end wrap

	if (typeof define === 'function' && define.amd){
		define(['./epitome'], wrap);
	}
	else if (typeof module !== 'undefined' && module.exports){
		require('mootools');
		module.exports = wrap();
	}
	else {
		this.Epitome || (this.Epitome = {});
		this.Epitome.isEqual = wrap(this.Epitome);
	}
}.call(this));
;(function(){
	'use strict';

	// wrapper function for requirejs or normal object
	var wrap = function(isEqual, Events){

		return new Class({

			Implements: [Events],

			_attributes: {},

			// custom accessors.
			properties: {
				id: {
					get: function(){
						// need a cid to identify model.
						var id = this._attributes.id || String.uniqueID();
						// always need a collection id.
						this.cid || (this.cid = id);

						return this._attributes.id;
					}
				}
			},

			// validators per property, should return true or error message
			validators: {},

			// initial `private` object
			options: {
				defaults: {}
			},

			collections: [],

			initialize: function(obj, options){
				// constructor for Model class.

				// are there any defaults passed? better to have them on the proto.
				options && options.defaults && (this.options.defaults = Object.merge(this.options.defaults, options.defaults));

				// initial obj should pass on to the setter.
				obj = obj && typeOf(obj) === 'object' ? obj : {};
				this.set(Object.merge(this.options.defaults, obj));

				// merge options overload, will now add the events.
				this.setOptions(options);

				return this.trigger('ready');
			},

			set: function(){
				// call the real getter. we proxy this because we want
				// a single event after all properties are updated and the ability to work with
				// either a single key, value pair or an object
				this.propertiesChanged = [];
				this.validationFailed = [];

				this._set.apply(this, arguments);
				// if any properties did change, fire a change event with the array.
				this.propertiesChanged.length && this.trigger('change', this.get(this.propertiesChanged));
				this.validationFailed.length && this.trigger('error', [this.validationFailed]);
			},

			// private, real setter functions, not on prototype, see note above
			_set: function(path, value){
				// needs to be bound the the instance.
				if (typeof path !== 'string' || typeof value === 'undefined') return this;
				var key = path.split('.')[0];

				// custom setter - see bit further down
				if (this.properties[key] && this.properties[key]['set'])
					return this.properties[key]['set'].call(this, value);

				var attr = _.lookup(this._attributes, path)
				// no change? this is crude and works for primitives.
				if (attr && isEqual(attr, value))
					return this;

				// basic validator support
				var validator = this.validate(path, value);
				if (_.lookup(this.validators, path) && validator !== true){
					var obj = {};
					obj[key] = {
						key: key,
						path: path,
						value: value,
						error: validator
					};
					this.validationFailed.push(obj);
					this.trigger('error:' + key, obj[key]);
					return this;
				}

				if (value === null){
					delete this._attributes[key]; // delete = null.
				}
				else {
					_.assign(this._attributes, path, value);
				}

				// fire an event.
				this.trigger('change:' + key, value);

				// store changed keys...
				this.propertiesChanged.push(key);

				return this;
			}.overloadSetter(),   // mootools abstracts overloading to allow object iteration

			get: function(key){
				// overload getter, 2 paths...

				// custom accessors take precedence and have no reliance on item being in attributes
				if (key && this.properties[key] && this.properties[key]['get']){
					return this.properties[key]['get'].call(this);
				}

				// else, return from attributes or return null when undefined.
				var attr = _.lookup(this._attributes, key);
				return (typeof attr !== 'undefined') ? attr : null;
			}.overloadGetter(),

			unset: function(){
				// can remove keys from model, passed on as multiple string arguments or an array of string keys
				var keys = Array.prototype.slice.apply(arguments),
					obj = {},
					len = keys.length;

				if (!len)
					return this;

				Array.each(Array.flatten(keys), function(key){
					obj[key] = null;
				});

				this.set(obj);

				return this;
			},

			toJSON: function(){
				return Object.clone(this._attributes);
			},

			empty: function(){
				// empty the model and fire change event
				var keys = Object.keys(this.toJSON()),
					self = this;

				// let the instance know.
				this.trigger('change', [keys]);

				// fire change for all keys in the model.
				Array.each(keys, function(key){
					self.trigger('change:' + key, null);
				}, this);

				this._attributes = {};
				this.trigger('empty');
			},

			destroy: function(){
				// destroy the model, send delete to server
				this._attributes = {};
				this.trigger('destroy');
			},

			validate: function(key, value){
				// run validation, return true (validated) if no validator found
				return (key in this.validators) ? this.validators[key].call(this, value) : true;
			}
		});
	}; // end wrap

	if (typeof define === 'function' && define.amd){
		define(['./epitome-isequal', './epitome-events'], wrap);
	}
	else if (typeof module !== 'undefined' && module.exports){
		require('mootools');
		module.exports = wrap(require('./epitome-isequal'), require('./epitome-events'));
	}
	else {
		this.Epitome || (this.Epitome = {isEqual: {}, Events: {}});
		this.Epitome.Model = wrap(this.Epitome.isEqual, this.Epitome.Events);
	}
}.call(this));
;(function(){
	'use strict';

	// wrapper function for requirejs or normal object
	var wrap = function(Model, Events, Slick){
		var methodMap = ['forEach', 'each', 'invoke', 'filter', 'map', 'some', 'indexOf', 'contains', 'getRandom', 'getLast'];

		// compat for nodejs, Slick gets passed separately
		Slick || (Slick = this.Slick);

		// decorator type, only not on the proto. exports.Function in a distant future? It's a Type...
		var collection = new Class({

			Implements: [Events],

			// base model is just Epitome.Model
			model: Model,

			_models: [],

			length: 0,

			initialize: function(models, options){
				this.setOptions(options);
				models && this.reset(models);
				// collections should have an id for storage
				this.id = this.options.id || String.uniqueID();

				return this.trigger('ready');
			},

			reset: function(models, quiet){
				// adds model(s) to collection, typically initially.

				// empty models first, quietly.
				this.removeModel(this._models, true);

				models = Array.from(models);
				Array.each(models, this.addModel.bind(this));

				// if a model is destroyed, remove from the collection
				this.on('destroy', this.removeModel.bind(this));

				quiet || this.trigger('reset');

				return this;
			},

			addModel: function(model, replace){
				// add a new model to collection
				var exists;

				// if it's just an object, make it a model first
				if (typeOf(model) === 'object' && !instanceOf(model, this.model)){
					model = new this.model(model);
				}

				// assign a cid.
				model.cid = model.cid || model.get('id') || String.uniqueID();

				// already in the collection?
				exists = this.getModelByCID(model.cid);

				// if not asked to replace, bail out.
				if (exists && replace !== true)
					return this.trigger('add:error', model);

				// replace an existing model when requested
				exists && replace === true && (this._models[this._models.indexOf(model)] = model);

				// subscribe to all model events and bubble them locally.
				this.listenTo(model);

				// add to models array.
				this._models.push(model);

				model.collections.include(this);

				this.length = this._models.length;

				// let somebody know.
				return this.trigger('add', [model, model.cid]).trigger('reset', [model, model.cid]);
			},

			removeModel: function(models, quiet){
				// supports a single model or an array of models
				var self = this;

				models = Array.from(models).slice(); // need to dereference or loop will fail

				Array.each(models, function(model){
					model.collections.erase(self);
					// restore `fireEvent` to one from prototype, aka, `Event.prototype.fireEvent`
					// only if there are no collections left that are interested in this model's events
					model.collections.length || delete model.fireEvent;

					// remove from collection of managed models
					Array.erase(self._models, model);

					self.length = self._models.length;

					// let somebody know we lost some.
					quiet || self.trigger('remove', [model, model.cid]);
				});

				return this.trigger('reset', [models]);
			},

			get: function(what){
				// compat for storage
				return this[what];
			},

			getModelByCID: function(cid){
				// return a model based upon a cid search
				var last = null;

				this.some(function(el){
					return el.cid === cid && (last = el);
				});

				return last;
			},

			getModelById: function(id){
				// return a model based upon an id search
				var last = null;

				this.some(function(el){
					return el.get('id') === id && (last = el);
				});

				return last;
			},

			getModel: function(index){
				// return a model based upon the index in the array
				return this._models[index];
			},

			toJSON: function(){
				// get the toJSON of all models.
				var getJSON = function(model){
					return model.toJSON();
				};
				return Array.map(this._models, getJSON);
			},

			empty: function(quiet){
				this.removeModel(this._models, quiet);
				return this.trigger('empty');
			},

			sort: function(how){
				// no arg. natural sort
				if (!how){
					this._models.sort();
					return this.trigger('sort');
				}

				// callback function
				if (typeof how === 'function'){
					this.model.sort(how);
					return this.trigger('sort');
				}

				// string keys, supports `:asc` (default) and `:desc` order
				var type = 'asc',
				// multiple conds are split by ,
					conds = how.split(','),
					c = function(a, b){
						if (a < b)
							return -1;
						if (a > b)
							return 1;
						return 0;
					};


				this._models.sort(function(a, b){
					var ret = 0;
					Array.some(conds, function(cond){
						// run for as long as there is no clear distinction
						cond = cond.trim();

						var pseudos = cond.split(':'),
							key = pseudos[0],
							sortType = (pseudos[1]) ? pseudos[1] : type,
							ak = a.get(key),
							bk = b.get(key),
							cm = c(ak, bk),
							map = {
								asc: cm,
								desc: -(cm)
							};

						// unknown types are ascending
						if (typeof map[sortType] === 'undefined'){
							sortType = type;
						}

						// assign ret value
						ret = map[sortType];

						// if we have a winner, break .some loop
						return ret !== 0;
					});

					// return last good comp
					return ret;
				});

				return this.trigger('sort');
			},

			reverse: function(){
				// reversing is just sorting in reverse.
				Array.reverse(this._models);

				return this.trigger('sort');
			},

			find: function(expression){
				/*jshint eqeqeq:false */
				// experimental model search engine, powered by MooTools Slick.parse
				var parsed = Slick.parse(expression),
					exported = [],
					found = this,
					map = {
						'=': function(a, b){
							return a == b;
						},
						'!=': function(a, b){
							return a != b;
						},
						'^=': function(a, b){
							return a.indexOf(b) === 0;
						},
						'*=': function(a, b){
							return a.indexOf(b) !== -1;
						},
						'$=': function(a, b){
							return a.indexOf(b) == a.length - b.length;
						},
						'*': function(a){
							return typeof a !== 'undefined';
						}
					},
					fixOperator = function(operator){
						return (!operator || !map[operator]) ? null : map[operator];
					},
					finder = function(attributes){
						var attr = attributes.key,
							value = attributes.value || null,
							tag = attributes.tag || null,
							operator = fixOperator(attributes.operator);

						found = found.filter(function(el){
							var t, a;
							if (tag && attr){
								t = el.get(tag);
								a = t ? t[attr] : null;
							}
							else if (tag){
								a = el.get(tag);
							}
							else {
								a = el.get(attr);
							}

							if (a !== null && value !== null && operator !== null)
								return operator(a, value);

							return a != null;
						});

					};

				if (parsed.expressions.length){
					var j, i;
					var attributes;
					var currentExpression, currentBit, expressions = parsed.expressions, id, t, tag;
					var cb = function(a){
						a.tag = tag;
						return a;
					};

					search: for (i = 0; (currentExpression = expressions[i]); i++){
						for (j = 0; (currentBit = currentExpression[j]); j++){
							attributes = currentBit.attributes;
							// support by id
							id = currentBit.id;
							if (id){
								t = {
									key: 'id',
									value: id,
									operator: '='
								};
								attributes || (attributes = []);
								attributes.push(t);
							}
							// by tag
							tag = currentBit.tag;
							if (tag && tag != '*'){
								attributes || (attributes = [
									{
										key: null,
										value: '',
										operator: '*'
									}
								]);

								attributes = Array.map(attributes, cb);
							}

							if (!attributes) continue search;

							Array.each(attributes, finder);
						}
						exported[i] = found;
						found = this;
					}

				}

				return [].combine(Array.flatten(exported));
			},

			findOne: function(expression){
				var results = this.find(expression);
				return results.length ? results[0] : null;
			}

		});

		Array.each(methodMap, function(method){
			collection.implement(method, function(){
				return Array.prototype[method].apply(this._models, arguments);
			});
		});

		return collection;
	}; // end wrap

	if (typeof define === 'function' && define.amd){
		define(['./epitome-model', './epitome-events'], wrap);
	}
	else if (typeof module !== 'undefined' && module.exports){
		module.exports = wrap(require('./epitome-model'), require('./epitome-events'), require('slicker'));
	}
	else {
		this.Epitome || (this.Epitome = {Model: {}, Events: {}});
		this.Epitome.Collection = wrap.call(this, this.Epitome.Model, this.Epitome.Events, this.Slick);
	}
}.call(this));
; (function() {
    'use strict';


    // wrapper function for requirejs or normal object
    var wrap = function(Model) {

            // decorate the original object by adding a new property Sync
            return new Class({
                Extends: Model,

                properties: {
                    //storage///
                },

                options: {
                    storage: {
                        duration: 365,
                        domain: '/',
                        fallback: true,
                        storageType: "localStorage"
                    },
                    key: undefined,
                    minimize: false
                },

                initialize: function(obj, options) {
                    // needs to happen first before events are added,
                    // in case we have custom accessors in the model object.
                    this.setOptions(options);
                    if(!this.options.key)
                        throw('Initiated without storage key (options.key)');
                    if(!this.properties.storage)
                        this.properties.storage = new Storage(this.options.storage);
                    this.parent(obj, this.options);
                    this.setupSync();
                },

                //revert or update changes to Model
                sync: function(method, model) {
                    var oldattrs = this._attributes,
                        attrs = Object.append({}, this.options.defaults, this.properties.storage.get(this.options.key));

                    //update props
                    Object.each(attrs, function(val, key) {
                        if(!Epitome.isEqual(oldattrs[key], val)) {
                            this.set(key, val);
                        }
                    }, this);

                    //no longer set properties
                    Object.keys(oldattrs).each(function(key) {
                        if(!attrs.hasOwnProperty(key)) {
                            this.unset(key);
                        }
                    });

                    this.trigger('sync');
                    return this;
                },

                setupSync: function() {
                    this._attributes = Object.append(this._attributes, this.properties.storage.get(this.options.key));
                    this.fireEvent("init");
                    return this;
                },

                save: function(val) {
                    if(this.validate()) {
                        var defaults = this.options.defaults,
                            data = this.options.minimize ? Object.filter(this._attributes, function(val, key) {
                                return !Epitome.isEqual(val, defaults[key]);//dont store defaults if minimize is true
                            }) : this._attributes;
                        this.properties.storage.set(this.options.key, data);
                        this.trigger('save');
                    }
                    return this;
                },

                destroy: function() {
                    // destroy the model, send delete to server
                    this.properties.storage.remove(this.options.key);
                    return this.parent();
                }
            });
        }; // end wrap
    if (typeof define === 'function' && define.amd) {
        define(['./epitome-model'], wrap);
    } else {
        this.Epitome || (this.Epitome = {
            Model: {}
        });
        this.Epitome.Model.Storage = wrap(this.Epitome.Model);
    }
}.call(this));
;(function(){
	'use strict';

	// wrapper function for requirejs or normal object
	var wrap = function(Events){

		var hc = 'hashchange',
			hcSupported = ('on' + hc) in window,
			eventHosts = [window, document],
			timer,
			getQueryString = function(queryString){
				var result = {},
					re = /([^&=]+)=([^&]*)/g,
					m;

				while (m = re.exec(queryString)){
					result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
				}

				return result;
			};

		Element.Events.hashchange = {
			// Cross browser support for onHashChange event - http://github.com/greggoryhz/MooTools-onHashChange-Event/
			onAdd: function(){
				var hash = location.hash,
					check = function(){
						if (hash === location.hash)
							return;

						hash = location.hash;
						eventHosts.invoke('fireEvent', hc, hash.indexOf('#') === 0 ? hash.substr(1) : hash);
					};

				(hcSupported && (window.onhashchange = check)) || (timer = check.periodical(100));
			},
			onRemove: function(){
				(hcSupported && (window.onhashchange = null)) || clearInterval(timer);
			}
		};


		// Router, has its own repo https://github.com/DimitarChristoff/Router
		return new Class({

			Implements: [Events],

			options: {
				triggerOnLoad: true // check route on load
			},

			routes: {
				// '#!path/:query/:id?': 'eventname',
			},

			boundEvents: {},

			initialize: function(options){
				var self = this;

				this.setOptions(options);
				this.options.routes && (this.routes = this.options.routes);

				window.addEvent(hc, function(){
					/*jshint loopfunc:true */
					var hash = location.hash,
						path = hash.split('?')[0],
						query = hash.split('?')[1] || '',
						notfound = true,
						route;

					for (route in self.routes){
						var keys = [],
							regex = self.normalize(route, keys, true, false),
							found = regex.exec(path),
							routeEvent = false;

						if (found){
							notfound = false;
							self.req = found[0];

							var args = found.slice(1),
								param = {};

							Array.each(args, function(a, i){
								typeof keys[i] !== 'undefined' && (param[keys[i].name] = a);
							});

							self.route = route;
							self.param = param || {};
							self.query = query && getQueryString(query);

							// find referenced events
							routeEvent = self.routes[route];

							// generic before route, pass route id, if avail
							self.trigger('before', routeEvent);

							// if there is an identifier and an event added
							if (routeEvent && self.$events[routeEvent]){
								// route event was defined, fire specific before pseudo
								self.trigger(routeEvent + ':before');
								// call the route event handler itself, pass params as arguments
								self.trigger(routeEvent, Object.values(self.param));
							}
							else {
								// requested route was expected but not found or event is missing
								self.trigger('error', ['Route', routeEvent, 'is undefined'].join(' '));
							}

							// fire a generic after event
							self.trigger('after', routeEvent);

							// if route is defined, also fire a specific after pseudo
							routeEvent && self.trigger(routeEvent + ':after');
							break;
						}
					}

					notfound && self.trigger('undefined');
					/*jshint loopfunc:false */
				});

				this.trigger('ready');
				this.options.triggerOnLoad && window.fireEvent(hc);
			},

			navigate: function(route, trigger){
				if (location.hash === route && trigger){
					window.fireEvent(hc);
				}
				else {
					location.hash = route;
				}
			},

			normalize: function(path, keys, sensitive, strict){
				// normalize by https://github.com/visionmedia/express
				if (path instanceof RegExp) return path;

				path = path.concat(strict ? '' : '/?').replace(/\/\(/g, '(?:/').replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g,function(_, slash, format, key, capture, optional){

					keys.push({
						name: key,
						optional: !!optional
					});

					slash = slash || '';

					return [
						(optional ? '' : slash),
						'(?:',
						(optional ? slash : ''),
						(format || '') + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')',
						(optional || '')
					].join('');
				}).replace(/([\/.])/g, '\\$1').replace(/\*/g, '(.*)');

				return new RegExp('^' + path + '$', sensitive ? '' : 'i');
			},

			addRoute: function(obj){
				// adds a new route, expects keys @route (string), @id (string), @events (object)
				if (!obj || !obj.route || !obj.id || !obj.events)
					return this.trigger('error', 'Please include route, id and events in the argument object when adding a route');

				if (!obj.id.length)
					return this.trigger('error', 'Route id cannot be empty, aborting');

				if (this.routes[obj.route])
					return this.trigger('error', 'Route "{route}" or id "{id}" already exists, aborting'.substitute(obj));


				this.routes[obj.route] = obj.id;
				this.on(this.boundEvents[obj.route] = obj.events);

				return this.trigger('route:add', obj);
			},

			removeRoute: function(route){
				if (!route || !this.routes[route] || !this.boundEvents[route])
					return this.trigger('error', 'Could not find route or route is not removable');

				this.off(this.boundEvents[route]);

				delete this.routes[route];
				delete this.boundEvents[route];

				return this.trigger('route:remove', route);
			}

		});
	}; // end wrap

	if (typeof define === 'function' && define.amd){
		define(['./epitome-events'], wrap);
	}
	else {
		this.Epitome || (this.Epitome = {Events:{}});
		this.Epitome.Router = wrap(this.Epitome.Events);
	}
}.call(this));
/*jshint strict:false */
;(function(){
	// 'use strict';  // breaks tests due to mootools reliance on args.callee and fireEvent

	// wrapper function for requirejs or normal object
	var wrap = function(Template, Model, Collection, Events){

		return new Class({

			Implements: [Events],

			// a string or element to render to and bind events on
			element: null,

			// optional, a collection may be bound to the view
			collection: null,

			// optional, a model may be bound to the view
			model: null,

			// preset stuff like template and the event map
			options: {
				template: '',
				// the event map should be like `elementEvent`: `instanceEvent`
				// for example: '{click:relay(a.task-remove)': 'removeTask'}
				// will fire instance's onRemoveTask handler when a.task-remove is pressed within the element.
				events: {}
			},

			initialize: function(options){
				// constructor like function.

				// deal with collection first to avoid reference errors with object.clone / merge for setOptions
				if (options && options.collection){
					this.setCollection(options.collection);
					delete options.collection;
				}

				// deal with model as well
				if (options && options.model){
					this.setModel(options.model);
					delete options.model;
				}

				// now we can hopefully setOptions safely.
				this.setOptions(options);

				// define the element.
				if (this.options.element){
					this.setElement(this.options.element, this.options.events);
					delete this.options.element;
				}

				// let the instance know
				return this.trigger('ready');
			},

			setElement: function(el, events){
				// set the element and clean-up old one
				this.element && this.detachEvents() && this.destroy();
				this.element = document.id(el);
				events && this.attachEvents(events);

				return this;
			},

			setCollection: function(collection){
				// a collection should be a real collection.
				var self = this,
					eventProxy = function(type){
						return function(){
							self.trigger(type + ':collection', arguments);
						};
					};

				if (instanceOf(collection, Collection)){
					this.collection = collection;
					// listen in for changes.
					this.collection.on({
						'change': eventProxy('change'),
						'fetch': eventProxy('fetch'),
						'add': eventProxy('add'),
						'remove': eventProxy('remove'),
						'sort': eventProxy('sort'),
						'reset': eventProxy('reset'),
						'error': eventProxy('error')
					});
				}

				return this;
			},

			setModel: function(model){
				// a model should be an Epitome model
				var self = this,
					eventProxy = function(type){
						return function(){
							self.trigger(type + ':model', arguments);
						};
					};

				if (instanceOf(model, Model)){
					this.model = model;
					// listen in for changes.
					this.model.on({
						'change': eventProxy('change'),
						'destroy': eventProxy('destroy'),
						'empty': eventProxy('empty'),
						'error': eventProxy('error')
					});
				}

				return this;
			},

			attachEvents: function(events){
				// add events to main element.
				var self = this;
				Object.each(events, function(method, type){
					if(!self.$events[method]) {
						self.$events[method] = [self[method]];
					}
					self.element.addEvent(type, function(){
						self.trigger(method, arguments);
					});
				});

				this.element.store('attachedEvents', events);

				return this;
			},

			detachEvents: function(){
				// remove attached events from an element
				var events = this.element.retrieve('attachedEvents');
				events && this.element.removeEvents(events).eliminate('attachedEvents');

				return this;
			},

			template: function(data, template){
				// refactor this to work with any other template engine in your constructor
				template = template || this.options.template;

				// instantiate a template engine when needed
				var compiler = this.Template || (this.Template = new Template());

				return compiler.template(template, data);
			},

			render: function(){
				// refactor this in your constructor object. for example:
				// this.element.set('html', this.template(this.options.data));
				// this.parent(); // fires the render event.
				return this.trigger('render');
			},

			empty: function(soft){
				// with soft flag it does not destroy child elements but detaches from dom
				if (soft){
					this.element.empty();
				}
				else {
					this.element.set('html', '');
				}

				return this.trigger('empty');
			},

			dispose: function(){
				// detach the element from the dom.
				this.element.dispose();

				return this.trigger('dispose');
			},

			destroy: function(){
				// remove element from dom and memory.
				this.element.destroy();

				return this.trigger('destroy');
			}

		});
	}; // end wrap

	if (typeof define === 'function' && define.amd){
		define(['./epitome-template', './epitome-model', './epitome-collection', './epitome-events'], wrap);
	}
	else {
		this.Epitome || (this.Epitome = {Template: {}, Model: {}, Collection: {}, Events: {}});
		this.Epitome.View = wrap(this.Epitome.Template, this.Epitome.Model, this.Epitome.Collection, this.Epitome.Events);
	}
}.call(this));
this["Handlebars"] = this["Handlebars"] || {};
this["Handlebars"]["templates"] = this["Handlebars"]["templates"] || {};

this["Handlebars"]["templates"]["authpage"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  
  return "hidden";
  }

  buffer += "<div class=\"container center\">\r\n<form id=\"login\">\r\n<h2>Connect to ";
  if (stack1 = helpers.network) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.network; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " IRC</h2>\r\n<div class=\"nick right\">\r\n<label class=\"control-label\" for=\"nickname\">Nickname:\r\n<input type=\"text\" name=\"basic\" id=\"nickname\" value=\"";
  if (stack1 = helpers.nickname) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.nickname; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" placeholder=\"Nickname\" />\r\n</label>\r\n</div>\r\n<div class=\"username right ";
  stack1 = helpers.unless.call(depth0, depth0.full, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\">\r\n<label class=\"control-label\" for=\"username\">";
  if (stack1 = helpers.network) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.network; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " username:\r\n<input type=\"text\" name=\"full\" id=\"username\" value=\"";
  if (stack1 = helpers.username) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.username; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" placeholder=\"";
  if (stack1 = helpers.network) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.network; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " username\">\r\n</label>\r\n</div>\r\n<div class=\"password right ";
  stack1 = helpers.unless.call(depth0, depth0.full, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\">\r\n<label class=\"control-label\" for=\"password\">Password:\r\n<input type=\"password\" name=\"full\" id=\"password\" value=\"";
  if (stack1 = helpers.password) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.password; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\r\n</label>\r\n</div>\r\n<div class=\"authenticate\">\r\n<label for=\"authenticate\">Authenticate (optional)<input type=\"checkbox\" id=\"authenticate\" ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.check || depth0.check),stack1 ? stack1.call(depth0, depth0.full, options) : helperMissing.call(depth0, "check", depth0.full, options)))
    + "></label for=\"authenticate\">\r\n</div>\r\n<div><input type=\"submit\" value=\"Connect\" class=\"btn btn-primary btn-smaller\" /></div>\r\n</form>\r\n<div class=\"qwebirc-init-channels\"><span>";
  if (stack2 = helpers.channels) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.channels; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "</span></div>\r\n</div>";
  return buffer;
  });

this["Handlebars"]["templates"]["chanmenu"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); partials = this.merge(partials, Handlebars.partials); data = data || {};
  var buffer = "", stack1, self=this;

function program1(depth0,data) {
  
  var stack1;
  stack1 = self.invokePartial(partials.menuitem, 'menuitem', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  }

  buffer += "<div class='chanmenu dropdownmenu'>\r\n";
  stack1 = helpers.each.call(depth0, depth0.channels, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n</div>";
  return buffer;
  });

this["Handlebars"]["templates"]["channelName"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function";


  buffer += "<div class='channel-name'>";
  if (stack1 = helpers.channel) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.channel; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</div>";
  return buffer;
  });

this["Handlebars"]["templates"]["channellink"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<span class='hyperlink-channel' data-chan='";
  if (stack1 = helpers.channel) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.channel; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "'>";
  if (stack1 = helpers.channel) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.channel; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>";
  return buffer;
  });

this["Handlebars"]["templates"]["customNotice"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;


  buffer += "<div class=\"controls custom-notice\" id=";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + ">\r\n<label class=\"control-inline\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.USER_NOTICE)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n<input type=\"text\" data-id=\"nick\" placeholder=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.NICK_PLACEHOLDER)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" value=\"";
  if (stack2 = helpers.nick) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.nick; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\">\r\n</label>\r\n<label class=\"control-inline\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.MESSAGE_NOTICE)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n<input type=\"text\" data-id=\"msg\" placeholder=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.MESSAGE_PLACEHOLDER)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" value=\"";
  if (stack2 = helpers.msg) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.msg; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\">\r\n</label>\r\n<label class=\"checkbox-inline\" >"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.BEEP)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n<input type=\"checkbox\" data-id=\"beep\" ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.check || depth0.check),stack1 ? stack1.call(depth0, depth0.beep, options) : helperMissing.call(depth0, "check", depth0.beep, options)))
    + ">\r\n</label>\r\n<label class=\"checkbox-inline\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.FLASH)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n<input type=\"checkbox\" data-id=\"flash\" ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.check || depth0.check),stack1 ? stack1.call(depth0, depth0.flash, options) : helperMissing.call(depth0, "check", depth0.flash, options)))
    + ">\r\n</label>\r\n<!-- <label class=\"checkbox-inline\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.HIGHLIGHT)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n<input type=\"checkbox\" data-id=\"highlight\" ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.check || depth0.check),stack1 ? stack1.call(depth0, depth0.highlight, options) : helperMissing.call(depth0, "check", depth0.highlight, options)))
    + ">\r\n</label>\r\n<label class=\"checkbox-inline\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.MENTIONED)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n<input type=\"checkbox\" data-id=\"mentioned\" ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.check || depth0.check),stack1 ? stack1.call(depth0, depth0.mentioned, options) : helperMissing.call(depth0, "check", depth0.mentioned, options)))
    + ">\r\n</label> -->\r\n<label class=\"checkbox-inline\" title=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.ESCAPE_HINT)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.AUTOESCAPE)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n<input type=\"checkbox\" data-id=\"autoescape\" ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.check || depth0.check),stack1 ? stack1.call(depth0, depth0.autoescape, options) : helperMissing.call(depth0, "check", depth0.autoescape, options)))
    + ">\r\n</label>\r\n<input type=\"button\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.DELETE_NOTICE)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" class=\"remove-notice btn btn-danger btn-smaller\">\r\n</div>";
  return buffer;
  });

this["Handlebars"]["templates"]["detachedWindow"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); partials = this.merge(partials, Handlebars.partials); data = data || {};
  var buffer = "", stack1, self=this, functionType="function", escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  var stack1;
  stack1 = self.invokePartial(partials.tabClose, 'tabClose', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  }

  buffer += "<div class='detached-window'>\r\n<div class='header'>\r\n<span class='title'>";
  if (stack1 = helpers.channel) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.channel; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>\r\n";
  stack1 = helpers.unless.call(depth0, depth0.base, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n";
  stack1 = self.invokePartial(partials.tabAttach, 'tabAttach', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n</div>\r\n</div>";
  return buffer;
  });

this["Handlebars"]["templates"]["ircInput"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<form class='input'>\r\n<div class='input-group'>\r\n<span class='input-group-addon nickname'><span class='status ";
  if (stack1 = helpers.status) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.status; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "'></span>";
  if (stack1 = helpers.nick) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.nick; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>\r\n<input class='";
  if (stack1 = helpers.type) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.type; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " input-field form-control' type='text'>\r\n<span class='input-group-btn'>\r\n<button class='btn btn-default send' type='button'>&gt;</button>\r\n</span>\r\n<ul class='dropdown-menu'>\r\n<li><a href='#'>Colours</a></li>\r\n<li><a href='#'>Styles</a></li>\r\n<li><a href='#'>IRC Commands</a></li>\r\n<li><a href='#'>Actions</a></li>\r\n</ul>\r\n</div>\r\n</form>";
  return buffer;
  });

this["Handlebars"]["templates"]["ircMessage"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"";
  if (stack1 = helpers.type) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.type; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\"></div>";
  return buffer;
  });

this["Handlebars"]["templates"]["ircTab"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); partials = this.merge(partials, Handlebars.partials); data = data || {};
  var buffer = "", stack1, functionType="function", self=this;


  buffer += "<a href='#' class='tab'>";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "&nbsp;";
  stack1 = self.invokePartial(partials.tabDetach, 'tabDetach', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</a>";
  return buffer;
  });

this["Handlebars"]["templates"]["ircstyle"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<span class=\"";
  if (stack1 = helpers.background) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.background; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " ";
  if (stack1 = helpers.colour) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.colour; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " ";
  if (stack1 = helpers.style) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.style; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (stack1 = helpers.text) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.text; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</span>";
  return buffer;
  });

this["Handlebars"]["templates"]["menubtn"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class='dropdown-tab'>\r\n<img src='";
  if (stack1 = helpers.icon) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.icon; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "' title='menu' alt='menu'>\r\n</div>";
  return buffer;
  });

this["Handlebars"]["templates"]["menuitem"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += " data-value='";
  if (stack1 = helpers.value) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.value; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "'";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n<span class='hint'>";
  if (stack1 = helpers.hint) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.hint; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>\r\n";
  return buffer;
  }

  buffer += "<a";
  stack1 = helpers['if'].call(depth0, depth0.value, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += ">\r\n<span>";
  if (stack1 = helpers.text) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.text; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>\r\n";
  stack1 = helpers['if'].call(depth0, depth0.hint, {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n</a>";
  return buffer;
  });

this["Handlebars"]["templates"]["message"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class='message ";
  if (stack1 = helpers['class']) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0['class']; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "'><span>";
  if (stack1 = helpers.message) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.message; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span></div>";
  return buffer;
  });

this["Handlebars"]["templates"]["nickbtn"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<a href='#' class='user'><span>";
  if (stack1 = helpers.nick) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.nick; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span></a>";
  return buffer;
  });

this["Handlebars"]["templates"]["options"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;


  buffer += "\r\n<form id=\"options\" class=\"form-horizontal\">\r\n<ul class=\"option-tabs tabs nav nav-tabs\" data-behavior=\"BS.Tabs\">\r\n<li class=\"ui-options\"><a href=\"#\">Interface</a></li>\r\n<li class=\"irc-options\"><a href=\"#\">Chat Preferences</a></li>\r\n<li class=\"alert-options\"><a href=\"#\">Notifications</a></li>\r\n<li class=\"hotkeys disabled\"><a href=\"#\">Hot Keys(TODO)</a></li>\r\n</ul>\r\n<div class=\"tab-content\" id=\"my-tab-content\">\r\n<div class=\"ui-options control-group well active\">\r\n<div class=\"controls\">\r\n<label class=\"checkbox\" for=\"nick_colours\">\r\n"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.NICK_COLOURS)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n<input type=\"checkbox\" id=\"nick_colours\" ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.check || depth0.check),stack1 ? stack1.call(depth0, depth0.nick_colours, options) : helperMissing.call(depth0, "check", depth0.nick_colours, options)))
    + ">\r\n</label>\r\n</div>\r\n<div class=\"controls\">\r\n<label class=\"checkbox\" for=\"nick_ov_status\">\r\n"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.NICK_OV_STATUS)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n<input type=\"checkbox\" id=\"nick_ov_status\" ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.check || depth0.check),stack1 ? stack1.call(depth0, depth0.nick_ov_status, options) : helperMissing.call(depth0, "check", depth0.nick_ov_status, options)))
    + ">\r\n</label>\r\n</div>\r\n<div class=\"controls\">\r\n<label class=\"checkbox\" for=\"show_timestamps\">\r\n"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.SHOW_TIMESTAMPS)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n<input type=\"checkbox\" id=\"show_timestamps\" ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.check || depth0.check),stack1 ? stack1.call(depth0, depth0.show_timestamps, options) : helperMissing.call(depth0, "check", depth0.show_timestamps, options)))
    + ">\r\n</label>\r\n</div>\r\n<div class=\"controls\">\r\n<label class=\"checkbox\" for=\"show_nicklist\">\r\n"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.SHOW_NICKLIST)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n<input type=\"checkbox\" id=\"show_nicklist\" ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.check || depth0.check),stack1 ? stack1.call(depth0, depth0.show_nicklist, options) : helperMissing.call(depth0, "check", depth0.show_nicklist, options)))
    + ">\r\n</label>\r\n</div>\r\n<div class=\"controls\">\r\n<label class=\"checkbox\" for=\"dedicated_notice_window\">\r\n"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.DEDICATED_NOTICE_WINDOW)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n<input type=\"checkbox\" id=\"dedicated_notice_window\" ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.check || depth0.check),stack1 ? stack1.call(depth0, depth0.dedicated_notice_window, options) : helperMissing.call(depth0, "check", depth0.dedicated_notice_window, options)))
    + ">\r\n</label>\r\n</div>\r\n<div class=\"controls\">\r\n<label class=\"checkbox\" for=\"dedicated_msg_window\">\r\n"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.DEDICATED_MSG_WINDOW)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n<input type=\"checkbox\" id=\"dedicated_msg_window\" ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.check || depth0.check),stack1 ? stack1.call(depth0, depth0.dedicated_msg_window, options) : helperMissing.call(depth0, "check", depth0.dedicated_msg_window, options)))
    + ">\r\n</label>\r\n</div>\r\n<div class=\"controls\">\r\n<label class=\"checkbox\" for=\"lastpos_line\">\r\n"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.LASTPOS_LINE)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n<input type=\"checkbox\" id=\"lastpos_line\" ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.check || depth0.check),stack1 ? stack1.call(depth0, depth0.lastpos_line, options) : helperMissing.call(depth0, "check", depth0.lastpos_line, options)))
    + ">\r\n</label>\r\n</div>\r\n<div class=\"controls\">\r\n<label class=\"checkbox\" for=\"hide_joinparts\">\r\n"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.HIDE_JOINPARTS)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n<input type=\"checkbox\" id=\"hide_joinparts\" ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.check || depth0.check),stack1 ? stack1.call(depth0, depth0.hide_joinparts, options) : helperMissing.call(depth0, "check", depth0.hide_joinparts, options)))
    + ">\r\n</label>\r\n</div>\r\n<div class=\"controls\">\r\n<label class=\"checkbox\" for=\"query_on_nick_click\">\r\n"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.QUERY_ON_NICK_CLICK)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n<input type=\"checkbox\" id=\"query_on_nick_click\" ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.check || depth0.check),stack1 ? stack1.call(depth0, depth0.query_on_nick_click, options) : helperMissing.call(depth0, "check", depth0.query_on_nick_click, options)))
    + ">\r\n</label>\r\n</div>\r\n<div class=\"controls\">\r\n<label class=\"checkbox\" for=\"font_size\">\r\n"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.FONT_SIZE)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n<input type=\"number\" id=\"font_size\" value=";
  if (stack2 = helpers.font_size) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.font_size; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + ">\r\n</label>\r\n</div>\r\n<div class=\"controls\">\r\n<label for=\"style_hue\">\r\n"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.STYLE_HUE)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n<div id=\"style_hue\" class=\"slider hue-slider\"><div class=\"knob\"></div></div>\r\n</label>\r\n\r\n</div>\r\n</div>\r\n<div class=\"irc-options control-group well\">\r\n<div class=\"controls\">\r\n<label class=\"checkbox\" for=\"use_hiddenhost\">\r\n"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.USE_HIDDENHOST)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n<input type=\"checkbox\" id=\"use_hiddenhost\" ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.check || depth0.check),stack1 ? stack1.call(depth0, depth0.use_hiddenhost, options) : helperMissing.call(depth0, "check", depth0.use_hiddenhost, options)))
    + ">\r\n</label>\r\n</div>\r\n<div class=\"controls\">\r\n<label class=\"checkbox\" for=\"accept_service_invites\">\r\n"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.ACCEPT_SERVICE_INVITES)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n<input type=\"checkbox\" id=\"accept_service_invites\" ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.check || depth0.check),stack1 ? stack1.call(depth0, depth0.accept_service_invites, options) : helperMissing.call(depth0, "check", depth0.accept_service_invites, options)))
    + ">\r\n</label>\r\n</div>\r\n</div>\r\n<div class=\"alert-options control-group well\">\r\n<div class=\"controls\">\r\n<label class=\"control-label-inline\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.DESKTOP_NOTICES)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n<input type=\"button\" value=\"";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.enableDisable || depth0.enableDisable),stack1 ? stack1.call(depth0, depth0.dn_state, options) : helperMissing.call(depth0, "enableDisable", depth0.dn_state, options)))
    + "\" id=\"dn_state\">\r\n</label>\r\n<label class=\"control-label-inline\" for=\"dn_duration\">Notification duration:\r\n<input type=\"number\" id=\"dn_duration\" value=\"";
  if (stack2 = helpers.dn_duration) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.dn_duration; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\">ms\r\n</label>\r\n<input type=\"button\" value=\"Test\" id=\"notice-test\">\r\n</div>\r\n<div id=\"standard-notices\">\r\n<div class=\"controls\">\r\n<label class=\"control-label\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.NOTIFY_ON_MENTION)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n<label class=\"checkbox-inline\" for=\"on_mention.beep\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.BEEP)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n<input type=\"checkbox\" id=\"on_mention.beep\" ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.check || depth0.check),stack1 ? stack1.call(depth0, ((stack1 = ((stack1 = depth0.notices),stack1 == null || stack1 === false ? stack1 : stack1.on_mention)),stack1 == null || stack1 === false ? stack1 : stack1.beep), options) : helperMissing.call(depth0, "check", ((stack1 = ((stack1 = depth0.notices),stack1 == null || stack1 === false ? stack1 : stack1.on_mention)),stack1 == null || stack1 === false ? stack1 : stack1.beep), options)))
    + ">\r\n</label>\r\n<label class=\"checkbox-inline\" for=\"on_mention.flash\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.FLASH)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n<input type=\"checkbox\" id=\"on_mention.flash\" ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.check || depth0.check),stack1 ? stack1.call(depth0, ((stack1 = ((stack1 = depth0.notices),stack1 == null || stack1 === false ? stack1 : stack1.on_mention)),stack1 == null || stack1 === false ? stack1 : stack1.flash), options) : helperMissing.call(depth0, "check", ((stack1 = ((stack1 = depth0.notices),stack1 == null || stack1 === false ? stack1 : stack1.on_mention)),stack1 == null || stack1 === false ? stack1 : stack1.flash), options)))
    + ">\r\n</label>\r\n</label>\r\n</div>\r\n<div class=\"controls\">\r\n<label class=\"control-label\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.NOTIFY_ON_PM)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n<label class=\"checkbox-inline\" for=\"on_pm.beep\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.BEEP)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n<input type=\"checkbox\" id=\"on_pm.beep\" ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.check || depth0.check),stack1 ? stack1.call(depth0, ((stack1 = ((stack1 = depth0.notices),stack1 == null || stack1 === false ? stack1 : stack1.on_pm)),stack1 == null || stack1 === false ? stack1 : stack1.beep), options) : helperMissing.call(depth0, "check", ((stack1 = ((stack1 = depth0.notices),stack1 == null || stack1 === false ? stack1 : stack1.on_pm)),stack1 == null || stack1 === false ? stack1 : stack1.beep), options)))
    + ">\r\n</label>\r\n<label class=\"checkbox-inline\" for=\"on_pm.flash\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.FLASH)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n<input type=\"checkbox\" id=\"on_pm.flash\" ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.check || depth0.check),stack1 ? stack1.call(depth0, ((stack1 = ((stack1 = depth0.notices),stack1 == null || stack1 === false ? stack1 : stack1.on_pm)),stack1 == null || stack1 === false ? stack1 : stack1.flash), options) : helperMissing.call(depth0, "check", ((stack1 = ((stack1 = depth0.notices),stack1 == null || stack1 === false ? stack1 : stack1.on_pm)),stack1 == null || stack1 === false ? stack1 : stack1.flash), options)))
    + ">\r\n</label>\r\n</label>\r\n</div>\r\n<div class=\"controls\">\r\n<label class=\"control-label\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.NOTIFY_ON_NOTICE)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n<label class=\"checkbox-inline\" for=\"on_notice.beep\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.BEEP)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n<input type=\"checkbox\" id=\"on_notice.beep\" ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.check || depth0.check),stack1 ? stack1.call(depth0, ((stack1 = ((stack1 = depth0.notices),stack1 == null || stack1 === false ? stack1 : stack1.on_notice)),stack1 == null || stack1 === false ? stack1 : stack1.beep), options) : helperMissing.call(depth0, "check", ((stack1 = ((stack1 = depth0.notices),stack1 == null || stack1 === false ? stack1 : stack1.on_notice)),stack1 == null || stack1 === false ? stack1 : stack1.beep), options)))
    + ">\r\n</label>\r\n<label class=\"checkbox-inline\" for=\"on_notice.flash\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.FLASH)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n<input type=\"checkbox\" id=\"on_notice.flash\" ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.check || depth0.check),stack1 ? stack1.call(depth0, ((stack1 = ((stack1 = depth0.notices),stack1 == null || stack1 === false ? stack1 : stack1.on_notice)),stack1 == null || stack1 === false ? stack1 : stack1.flash), options) : helperMissing.call(depth0, "check", ((stack1 = ((stack1 = depth0.notices),stack1 == null || stack1 === false ? stack1 : stack1.on_notice)),stack1 == null || stack1 === false ? stack1 : stack1.flash), options)))
    + ">\r\n</label>\r\n</label>\r\n</div>\r\n</div>\r\n<h3>Custom Notices</h3>\r\n<div id=\"custom-notices\" class=\"controls\">\r\n\r\n</div>\r\n<input type=\"button\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.ADD_NOTICE)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" id=\"add-notice\" class=\"btn btn-default btn-small\">\r\n</div>\r\n<div class=\"hotkeys control-group well\">\r\n\r\n</div>\r\n</div>\r\n<div class=\"actions\">\r\n<button type=\"submit\" class=\"btn btn-small btn-primary\" value=\"save\">Save Changes</button>\r\n<button type=\"reset\" class=\"btn btn-small btn-warning\" value=\"reset\">Revert</button>\r\n</div>\r\n</form>";
  return buffer;
  });

this["Handlebars"]["templates"]["qweblink"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<span class='hyperlink-page' data-page='";
  if (stack1 = helpers.page) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.page; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "'>";
  if (stack1 = helpers.page) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.page; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>";
  return buffer;
  });

this["Handlebars"]["templates"]["spanURL"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<span class='hyperlink-channel'>";
  if (stack1 = helpers.message) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.message; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>";
  return buffer;
  });

this["Handlebars"]["templates"]["timestamp"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<span class='timestamp'>";
  if (stack1 = helpers.time) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.time; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " </span>";
  return buffer;
  });

this["Handlebars"]["templates"]["topicBar"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); partials = this.merge(partials, Handlebars.partials); data = data || {};
  var buffer = "", stack1, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n";
  stack1 = self.invokePartial(partials.topicText, 'topicText', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n";
  return buffer;
  }

function program3(depth0,data) {
  
  
  return "&nbsp;\r\n";
  }

  buffer += "<div class='topic tab-invisible qui colourline'>\r\n";
  stack1 = helpers['if'].call(depth0, depth0.topic, {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n</div>";
  return buffer;
  });

this["Handlebars"]["templates"]["topicText"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, self=this, functionType="function", escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  
  return "emptytopic";
  }

  buffer += "<span class='";
  stack1 = helpers['if'].call(depth0, depth0.empty, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "'>";
  if (stack1 = helpers.topic) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.topic; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>";
  return buffer;
  });

this["Handlebars"]["templates"]["userlink"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<span class='hyperlink-whois' data-user='";
  if (stack1 = helpers.userid) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.userid; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "'>&lt;";
  if (stack1 = helpers.username) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.username; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "&gt;</span>";
  return buffer;
  });

this["Handlebars"]["templates"]["window"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); partials = this.merge(partials, Handlebars.partials); data = data || {};
  var buffer = "", stack1, self=this;


  buffer += "<div class=\"window qui ircwindow channel hidden\">\r\n\r\n";
  stack1 = self.invokePartial(partials.topicBar, 'topicBar', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n\r\n<div class=\"qui content\">\r\n<div class=\"qui leftpanel lines\">\r\n<div class=\"ui-icon ui-icon-grip-solid-vertical handle vertical\"></div>\r\n<div class=\"qui rightpanel nicklist\"></div>\r\n</div>\r\n\r\n<div class=\"qui properties\">\r\n";
  stack1 = self.invokePartial(partials.channelName, 'channelName', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n</div>\r\n\r\n<div class=\"qui bottompanel\">\r\n";
  stack1 = self.invokePartial(partials.ircInput, 'ircInput', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n</div>\r\n\r\n</div>";
  return buffer;
  });
/*Copyright (c) 2008-2009 the qwebirc project.
http://www.qwebirc.org/

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
version 2 as published by the Free Software Foundation.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.

Though it is not required, we would appreciate public facing
instances leaving a mention of the original author(s) and the
project name and URL in the about dialog, thanks!*/


; (function(window, undefined) {
    "use strict";

    //init crap
    var DEBUG = true;

    //common globals
    var document = window.document,
        $ = document.id,
        $$ = document.getElements;

    var templates = Handlebars.templates;

    /* qwebirc -- Copyright (C) 2008-2011 Chris Porter and the qwebirc project --- All rights reserved. */

    window.QWEBIRC_BUILD="bbc577ad5cb78d946ac1";

    //global object
    //var qwebirc = window.qwebirc = {ui: {themes: {}, style: {}}, irc: {}, util: {crypto: {}}, config: {}, auth: {}, sound: {}};

    var qwebirc = window.qwebirc = {},

        irc = qwebirc.irc = {},

        util = qwebirc.util = {},
        crypto = util.crypto = {},

        config = qwebirc.config = {},
        auth = qwebirc.auth = {},

        ui = qwebirc.ui = {},
        themes = ui.themes = {},
        style = ui.style = {},

        sound = qwebirc.sound = {},//,

        lang;// = qwebirc.lang;

    qwebirc.BUILD = QWEBIRC_BUILD;
    qwebirc.FILE_SUFFIX = "-" + QWEBIRC_BUILD;
    qwebirc.VERSION = "0.93-dev";

ui.WINDOW_STATUS = 1;
ui.WINDOW_QUERY = 2;
ui.WINDOW_CHANNEL = 4;
ui.WINDOW_CUSTOM = 8;
ui.WINDOW_CONNECT = 16;
ui.WINDOW_MESSAGES = 32;
ui.CUSTOM_CLIENT = "custom";

ui.HILIGHT_NONE = 0;
ui.HILIGHT_ACTIVITY = 1;
ui.HILIGHT_SPEECH = 2;
ui.HILIGHT_US = 3;

ui.MAXIMUM_LINES_PER_WINDOW = 1000;
ui.WINDOW_LASTLINE = ui.WINDOW_QUERY | ui.WINDOW_MESSAGES | ui.WINDOW_CHANNEL | ui.WINDOW_STATUS;

irc.PMODE_LIST = 0;
irc.PMODE_SET_UNSET = 1;
irc.PMODE_SET_ONLY = 2;
irc.PMODE_REGULAR_MODE = 3;


var BROUHAHA = '#brouhaha',
    CONNECTION_DETAILS = 'Connection details',
    STATUS = 'Status',
    OPTIONS = 'Options',
    ACTIVE = '\x09ACTIVE',


    BASE_WINDOWS = [BROUHAHA, CONNECTION_DETAILS, STATUS],
    CHANNEL_TYPES = [ui.WINDOW_CHANNEL, ui.WINDOW_QUERY],
    INPUT_TYPES = [ui.WINDOW_STATUS, ui.WINDOW_QUERY, ui.WINDOW_CHANNEL, ui.WINDOW_MESSAGES];

var OPED = "+",
    DEOPED = "-",
    OPSTATUS = "@",
    VOICESTATUS = "+";

irc.IRCLowercaseTable = [ /* x00-x07 */ '\x00', '\x01', '\x02', '\x03', '\x04', '\x05', '\x06', '\x07',
    /* x08-x0f */
    '\x08', '\x09', '\x0a', '\x0b', '\x0c', '\x0d', '\x0e', '\x0f',
    /* x10-x17 */
    '\x10', '\x11', '\x12', '\x13', '\x14', '\x15', '\x16', '\x17',
    /* x18-x1f */
    '\x18', '\x19', '\x1a', '\x1b', '\x1c', '\x1d', '\x1e', '\x1f',
    /* ' '-x27 */
    ' ', '!', '"', '#', '$', '%', '&', '\x27',
    /* '('-'/' */
    '(', ')', '*', '+', ',', '-', '.', '/',
    /* '0'-'7' */
    '0', '1', '2', '3', '4', '5', '6', '7',
    /* '8'-'?' */
    '8', '9', ':', ';', '<', '=', '>', '?',
    /* '@'-'G' */
    '@', 'a', 'b', 'c', 'd', 'e', 'f', 'g',
    /* 'H'-'O' */
    'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
    /* 'P'-'W' */
    'p', 'q', 'r', 's', 't', 'u', 'v', 'w',
    /* 'X'-'_' */
    'x', 'y', 'z', '{', '|', '}', '~', '_',
    /* '`'-'g' */
    '`', 'a', 'b', 'c', 'd', 'e', 'f', 'g',
    /* 'h'-'o' */
    'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
    /* 'p'-'w' */
    'p', 'q', 'r', 's', 't', 'u', 'v', 'w',
    /* 'x'-x7f */
    'x', 'y', 'z', '{', '|', '}', '~', '\x7f',
    /* x80-x87 */
    '\x80', '\x81', '\x82', '\x83', '\x84', '\x85', '\x86', '\x87',
    /* x88-x8f */
    '\x88', '\x89', '\x8a', '\x8b', '\x8c', '\x8d', '\x8e', '\x8f',
    /* x90-x97 */
    '\x90', '\x91', '\x92', '\x93', '\x94', '\x95', '\x96', '\x97',
    /* x98-x9f */
    '\x98', '\x99', '\x9a', '\x9b', '\x9c', '\x9d', '\x9e', '\x9f',
    /* xa0-xa7 */
    '\xa0', '\xa1', '\xa2', '\xa3', '\xa4', '\xa5', '\xa6', '\xa7',
    /* xa8-xaf */
    '\xa8', '\xa9', '\xaa', '\xab', '\xac', '\xad', '\xae', '\xaf',
    /* xb0-xb7 */
    '\xb0', '\xb1', '\xb2', '\xb3', '\xb4', '\xb5', '\xb6', '\xb7',
    /* xb8-xbf */
    '\xb8', '\xb9', '\xba', '\xbb', '\xbc', '\xbd', '\xbe', '\xbf',
    /* xc0-xc7 */
    '\xe0', '\xe1', '\xe2', '\xe3', '\xe4', '\xe5', '\xe6', '\xe7',
    /* xc8-xcf */
    '\xe8', '\xe9', '\xea', '\xeb', '\xec', '\xed', '\xee', '\xef',
    /* xd0-xd7 */
    '\xf0', '\xf1', '\xf2', '\xf3', '\xf4', '\xf5', '\xf6', '\xd7',
    /* xd8-xdf */
    '\xf8', '\xf9', '\xfa', '\xfb', '\xfc', '\xfd', '\xfe', '\xdf',
    /* xe0-xe7 */
    '\xe0', '\xe1', '\xe2', '\xe3', '\xe4', '\xe5', '\xe6', '\xe7',
    /* xe8-xef */
    '\xe8', '\xe9', '\xea', '\xeb', '\xec', '\xed', '\xee', '\xef',
    /* xf0-xf7 */
    '\xf0', '\xf1', '\xf2', '\xf3', '\xf4', '\xf5', '\xf6', '\xf7',
    /* xf8-xff */
    '\xf8', '\xf9', '\xfa', '\xfb', '\xfc', '\xfd', '\xfe', '\xff'
];


irc.Numerics = {
    "001": "RPL_WELCOME",
    "004": "RPL_MYINFO",
    "005": "RPL_ISUPPORT",
    "353": "RPL_NAMREPLY",
    "366": "RPL_ENDOFNAMES",

    "331": "RPL_NOTOPIC",
    "332": "RPL_TOPIC",
    "333": "RPL_TOPICWHOTIME",

    "311": "RPL_WHOISUSER",
    "312": "RPL_WHOISSERVER",
    "313": "RPL_WHOISOPERATOR",
    "317": "RPL_WHOISIDLE",
    "671": "RPL_WHOISSECURE",
    "318": "RPL_ENDOFWHOIS",
    "319": "RPL_WHOISCHANNELS",
    "330": "RPL_WHOISACCOUNT",
    "338": "RPL_WHOISACTUALLY",
    "343": "RPL_WHOISOPERNAME",
    "320": "RPL_WHOISGENERICTEXT",
    "325": "RPL_WHOISWEBIRC",

    "301": "RPL_AWAY",
    "305": "RPL_UNAWAY",
    "306": "RPL_NOWAWAY",

    "324": "RPL_CHANNELMODEIS",
    "329": "RPL_CREATIONTIME",

    "433": "ERR_NICKNAMEINUSE",
    "401": "ERR_NOSUCHNICK",
    "404": "ERR_CANNOTSENDTOCHAN",
    "482": "ERR_CHANOPPRIVSNEEDED",

    "321": "RPL_LISTSTART",
    "322": "RPL_LISTITEM",
    "323": "RPL_LISTEND"
};

irc.styles = [
    {
        name: 'normal',
        style: '',
        key: '\x00'
    },
    {
        name: 'underline',
        style: 'underline',
        key: '\x1F',
        keyregex: /\x1F(.*?)\x1F/,
        bbcode: ['[u]', '[/u]']
    },
    {
        name: 'bold',
        style: 'bold',
        key: '\x02',
        keyregex: /\x02(.*?)\x02/,
        bbcode: ['[b]', '[/b]']
    },
    {
        name: 'italic',
        style: 'italic',
        key: '\x16',
        keyregex: /\x16(.*?)\x16/,
        bbcode: ['[i]', '[/i]']
    },
    {
        name: 'colour',
        style: '',//see below
        key: '\x03',
        fore_re: /^(\d{1,2})/,
        back_re: /^((\d{1,2})+,+(\d{1,2}))/,
        format: "\x03{f},{b}{t}\x03",
        bbcode: ['[colour fore={f} back={b}]', '[/colour]']
    }
];

//dirty but better than filtering every time?
irc.styles.special = _.reject(irc.styles, function(sty) { return sty.name == 'normal' ||  sty.name == 'colour' } );
irc.styles.colour = _.findWhere(irc.styles, {name: 'colour' } );
irc.styles.normal = _.findWhere(irc.styles, {name: 'normal' } );

irc.colours = [//http://www.mirc.com/colors.html
    {
        name: 'white',
        fore: 'col0',
        back: 'back0',
        key: 0
    },
    {
        name: 'black',
        fore: 'col1',
        back: 'back1',
        key: 1
    },
    {
        name: 'navy',
        fore: 'col2',
        back: 'back2',
        key: 2
    },
    {
        name: 'green',
        fore: 'col3',
        back: 'back3',
        key: 3
    },
    {
        name: 'red',
        fore: 'col4',
        back: 'back4',
        key: 4
    },
    {
        name: 'brown',
        fore: 'col5',
        back: 'back5',
        key: 5
    },
    {
        name: 'purple',
        fore: 'col6',
        back: 'back6',
        key: 6
    },
    {
        name: 'olive',
        fore: 'col7',
        back: 'back7',
        key: 7
    },
    {
        name: 'yellow',
        fore: 'col8',
        back: 'back8',
        key: 8,

    },
    {
        name: 'lightgreen',
        fore: 'col9',
        back: 'back9',
        key: 9
    },
    {
        name: 'teal',
        fore: 'col10',
        back: 'back10',
        key: 10
    },
    {
        name: 'cyan',
        fore: 'col11',
        back: 'back11',
        key: 11
    },
    {
        name: 'blue',
        fore: 'col12',
        back: 'back12',
        key: 12
    },
    {
        name: 'pink',
        fore: 'col13',
        back: 'back13',
        key: 13
    },
    {
        name: 'gray',
        fore: 'col14',
        back: 'back14',
        key: 14
    },
    {
        name: 'lightgrey',
        fore: 'col15',
        back: 'back15',
        key: 15
    }
];




var whitespace = /\s/,
    notwhitespace = /\S+$/;

//my helper functions
//returns itself
var join = function(by, xs) {
        return xs.join(by);
    },

    split = function(by, str) {
        return str.split(by);
    },

    restRight = _.autoCurry(function(xs) {
        return xs.slice(0, xs.length-1);
    }),

    test = _.autoCurry(function(reg, str) {
        return str.test(reg);
    }),

    replace = _.autoCurry(function(reg, rep, str) {
        return str.replace(reg, rep);
    }),

    startsWith = function(what, str) {
        return str.startsWith(what);
    },

    $identity = _.identity,

    splitBang = _.partial(split, "!"),

    joinBang = _.partial(join, "!"),

    joinEmpty = _.partial(join, ""),

    // splitEmpty = split(""),

    joinComma = util.joinChans = _.partial(join,","),

    // splitComma = split(","),

    concatUnique = _.compose(_.uniq, Array.concat),

    concatSep = _.autoCurry(function(sep, s1, s2) {
        if(_.isArray(s1)) {
            s1 = s1.join(sep);
        }
        if(_.isArray(s2)) {
            s2 = s2.join(sep);
        }
        if(s1 !== "" && s2 !== "") {
            return s1 + sep + s2;
        }
        else {
            return s1 + s2;
        }
    }),

    concatSpace = concatSep(" ");

util.formatter = function(message, data) {
    return (message.message || message).substitute(data);
};

util.formatterSafe = function (str, object, regexp){//if property not found string is not replaced
    return String(str).replace(regexp || (/\\?\{([^{}]+)\}/g), function(match, name){
        if (match.charAt(0) == '\\') return match.slice(1);
        return (object[name] != null) ? object[name] : match;
    });
}

//String -> String
// megawac!~megawac@megawac.user.gamesurge -> megawac
util.hostToNick = _.compose(joinBang, restRight, splitBang);
//megawac!~megawac@megawac.user.gamesurge -> ~megawac@megawac.user.gamesurge
util.hostToHost = _.compose(Array.getLast, splitBang);


var isChannel = util.isChannel = _.and('.length > 1', _.partial(startsWith, '#')),

    formatChannel = util.formatChannel = function(chan) {
        if(chan.length >= 1 && !isChannel(chan)) {
            chan = '#' + chan;
        }
        return chan;
    },

    unformatChannel = util.unformatChannel = function(chan) {
        if(isChannel(chan)) {
            chan = chan.slice(1);
        }
        return chan;
    },

    appendChannel = function(chans,chan) {
        return $A(chans).concat(chan);
    },

    splitChan = util.splitChans = function(xs) {
        if(_.isArray(xs))
            return xs.length > 0 ? xs : [""];
        return xs.split(",");
    },

    //function to determine if a string is one of the stock windows
    isBaseWindow = util.isBaseWindow = _.partial(_.contains, BASE_WINDOWS),

    isChannelType = util.isChannelType = _.partial(_.contains, CHANNEL_TYPES);


util.windowNeedsInput = _.partial(_.contains, INPUT_TYPES);

//String -> String
//formatChannelStrings("test,test2,#test3,#tes#t4,test5,test6") => "#test,#test2,#test3,#tes#t4,#test5,#test6"
util.formatChannelString = _.compose(joinComma, _.uniq, _.partial(_.func.map, formatChannel), splitChan);
util.unformatChannelString = _.compose(_.uniq, _.partial(_.func.map, unformatChannel), splitChan);

//appends a channel to the end of the list of channels
//string -> string
//could just call Array.include?
util.addChannel = _.compose(/*joinComma,*/ _.uniq,/* splitChan, */appendChannel);
//adds channel to front of list of channels
util.prependChannel = _.compose(/*joinComma,*/ _.uniq,/* splitChan, */_.flip(appendChannel));


//calls splits string by comma then calls array.erase on value
util.removeChannel = Array.erase;

util.formatCommand = function(cmdline) {
    if (cmdline.startsWith("/")) {
        cmdline = cmdline.startsWith("//") ? "SAY /" + cmdline.slice(2) : cmdline.slice(1);//qweb issue #349
    } else {
        cmdline = "SAY " + cmdline; //default just say the msg
    }
    return cmdline.splitMax(" ", 2); //split command from the params
};

util.nickChanComparitor = function(client, nickHash) {
    var _prefixes = client.prefixes,
        _prefixNone = _prefixes.length,
        prefixWeight = function(pre) { return pre.length !== 0 ? _prefixes.indexOf(pre) : _prefixNone ; },
        toLower = client.toIRCLower;
    //compares two nick names by channel status > lexigraphy
    return function(nick1, nick2) {
        var p1weight = prefixWeight(nickHash[nick1].prefixes),
            p2weight = prefixWeight(nickHash[nick2].prefixes);
        return (p1weight !== p2weight) ? (p1weight - p2weight) : toLower(nick1).localeCompare(toLower(nick2));
    };
};

util.nickPrefixer = function(nickHash) {//_.lambda('a -> b -> a[b].prefixes + b')
    return function(nick) {
        return nickHash[nick].prefixes + nick;
    };
};

util.validPrefix = _.contains;

util.addPrefix = function(nc, pref, prefs) {
    if(prefs && !util.validPrefix(prefs, pref))
        return nc.prefixes;
    return nc.prefixes = concatUnique(nc.prefixes, pref).join("");
};

util.removePrefix = function(nc, pref) {
    return nc.prefixes = nc.prefixes.replaceAll(pref, "");
};

//if theres a prefix it gets returned
//i dont think its possible to have multiple prefixes
util.prefixOnNick = _.autoCurry(function(prefixes, nick) {
    var c = nick.charAt(0);
    return util.validPrefix(prefixes, c) ? [c, nick.slice(1)] : ['', nick];
});

util.getPrefix = _.compose(_.first, util.prefixOnNick);

util.stripPrefix = _.compose(_.lambda('x[1]'), util.prefixOnNick);

util.createNickRegex = _.memoize(function(nick) {
    return new RegExp('(^|[\\s\\.,;:])' + String.escapeRegExp(nick) + '([\\s\\.,;:]|$)', "i");
})

util.testForNick = function(nick, text) {//http://jsperf.com/new-regexp-vs-memoize/2
    return test(util.createNickRegex(nick), text);
};

util.toHSBColour = function(nick, client) {
    var lower = client.toIRCLower(util.stripPrefix(client.prefixes, nick));
    if (lower == client.lowerNickname)
        return null;

    var hash = 0;
    for (var i = 0; i < lower.length; i++)
        hash = 31 * hash + lower.charCodeAt(i);

    var hue = Math.abs(hash) % 360;

    return new Color([hue, 70, 60], "hsb");
};


//helper functions
var charIRCLower = _.compose(_.partial(_.item, irc.IRCLowercaseTable), _.lambda('x.charCodeAt(0)'));

//returns the lower case value of a RFC1459 string using the irc table
//called a fuck ton so memoization is incredible here
irc.RFC1459toIRCLower = _.memoize(_.compose(joinEmpty, _.partial(_.func.map, charIRCLower)));

//not really sure
//takes a irc client object and string and returns something
irc.toIRCCompletion = _.compose(replace(/[^\w]+/g, ""), _.partial(_.func.invoke, "toIRCLower"));

irc.ASCIItoIRCLower = String.toLowerCase;

util.getStyleByName = function(name) {
    return _.findWhere(irc.styles, {name:name});
};

util.getStyleByKey = function(key) {
    return _.findWhere(irc.styles, {key: _.toInt(key)});
};

util.getColourByName = function(name) {
    return _.findWhere(irc.colours, {name:name});
};

util.getColourByKey = function(key) {
    return _.findWhere(irc.colours, {key: _.toInt(key)});
};

// returns the arguments 
util.parseURI = function(uri) {
    var result = {};

    var start = uri.indexOf('?');
    if (start === -1) {
        return result;
    }

    var querystring = uri.substring(start + 1);

    var args = querystring.split("&");

    for (var i = 0; i < args.length; i++) {
        var part = args[i].splitMax("=", 2);
        if (part.length > 1)
            result[unescape(part[0])] = unescape(part[1]);
    }

    return result;
};

util.longtoduration = function(l) {
    var seconds = l % 60;
    var minutes = Math.floor((l % 3600) / 60);
    var hours = Math.floor((l % (3600 * 24)) / 3600);
    var days = Math.floor(l / (24 * 3600));

    return days + " days " + hours + " hours " + minutes + " minutes " + seconds + " seconds";
};

//pads based on the ret of a condition
var pad = util.pad = _.autoCurry(function(cond, padding, str) {
    str = String(str);
    return cond(str) ? padding + str : str;
});

util.padzero = pad(_.lambda('.length<=1'), "0");
util.padspace = pad(_.lambda('.length!==0'), " ");


util.browserVersion = $lambda(navigator.userAgent);

util.getEnclosedWord = function(str, pos) {
    pos = pos >>> 0; //type safety coerce int
    // Search for the word's beginning and end.
    var left = str.slice(0, pos + 1).search(notwhitespace),
        right = str.slice(pos).search(whitespace),

        // The last word in the string is a special case.
        // Return the word, using the located bounds to extract it from the string.
        word = right < 0 ? str.slice(left) : str.slice(left, right + pos);

    return [left, word];
};

// NOT cryptographically secure! 
util.randHexString = function(numBytes) {
    var getByte = function() {
            return (((1 + Math.random()) * 0x100) | 0).toString(16).substring(1);
        };

    var l = [];
    for (var i = 0; i < numBytes; i++) {
        l.push(getByte());
    }
    return l.join("");
};


util.IRCTimestamp = function(date) {
    // return "[" + util.padzero(date.getHours()) + ":" + util.padzero(date.getMinutes()) + "]";
    return date.format("[%H:%M]");
};

util.IRCDate = function(date) {
    return date.format("%c");
};

irc.nickChanEntry = function(p, l) {
    return {
        prefixes: p || "",
        lastSpoke: l || 0
    };
};

util.noop = function(){};

Browser.isMobile = !(Browser.Platform.win || Browser.Platform.mac || Browser.Platform.linux);

util.generateID = (function() {
    var id = 0;
    return function() {
        return "qqa-" + id++;
    };
})();



(function() {

    var types = {
        ERROR: 0,
        INFO: 1,
        SERVER: 2,
        CHAN: 3,
        MISC: 4,

        MESSAGE: 5
    };

    var message = function(msg, type) {
        return {
            message: msg,
            type: type
        };
    };

    //language specific stuff. right now just an object
    // can either be a message or array of messages
    qwebirc.lang = lang = {
        TYPES: types,
        message: message,

        loginMessages: [message("Hint #1! When you close a channel this one will be deleted from your favorites and won't come back on the next connection.", types.INFO),
                        message("Hint #2! To join a new channel type this command in the chat box: /j #channel", types.INFO)],
        joinAfterAuth: message("Waiting for login before joining channels...", types.INFO),
        authFailed: [message("Could not auth with IRC network - waited 5 seconds.", types.ERROR),
                    message("Otherwise reattempt authing by typing: \"/authserv AUTH <your username> <your password>\"", types.ERROR),
                    message("To ignore the error and join channels, unauthed, type: \"/autojoin\".", types.ERROR)],
        signOn: message("SIGNON", types.SERVER),
        joinChans: message("Joining channels...", types.INFO),
        noTopic: message("(No topic set.)", types.INFO),

        needOp: message("Sorry, you need to be a channel operator to change the topic!", types.ERROR),
        changeTopicConfirm: message("Change topic of {channel} to:", types.MISC),

        poorJoinFormat: message("Channel names begin with # (corrected automatically).", types.INFO),
        waitToJoin: message("You recently tried to join {channel}. To prevent join-flooding, please wait {time} seconds before reattempting or type /fjoin {channel} to ignore this warning...", types.ERROR),
        invalidCommand: message("Can't use this command in this window", types.ERROR),
        invalidChanTarget: message("Can't target a channel with this command.", types.ERROR),
        insufficentArgs: message("Insufficient arguments for command.", types.ERROR),

        

        loadingPage: "Loading . . .",
        submittingPage: message("Submitting . . .", types.INFO),
        fishSlap: message("slaps {nick} with a large fishbot", types.MESSAGE),

        copyright: [message("qwebirc v" + qwebirc.VERSION, types.INFO),
                    message("Copyright (C) 2008-2011 Chris Porter and the qwebirc project.", types.INFO),
                    message("Current version by Emanuel \"megawac\" Jackstare"),
                    message("http://www.qwebirc.org", types.INFO),
                    message("Licensed under the GNU General Public License, Version 2.", types.INFO)],

        activityNotice: message("Activity!", types.MISC),
        partChan: message("Part", types.MESSAGE),
        logOut: message("Logged out", types.MESSAGE),
        quit: message("Page closed", types.MESSAGE),
        disconnected: message("Client has been disconnected", types.INFO),

        uncontrolledFlood: message("ERROR: uncontrolled flood detected -- disconnected.", types.ERROR),
        connError: message("An error occured: {1}", types.ERROR),
        connTimeOut: message("Error: connection closed after {retryAttempts} requests failed.", types.ERROR),
        connectionFail: message("Couldn't connect to remote server.", types.ERROR),

        closeTab: "Close tab",
        detachWindow: "Detach Window",

        invalidNick: "Your nickname was invalid and has been corrected; please check your altered nickname and press Connect again.",
        missingNick: "You must supply a nickname",
        missingPass: "You must supply a password.",
        missingAuthInfo: "You must supply your username and password in auth mode.",


        //options
        DEDICATED_MSG_WINDOW: "Send privmsgs to dedicated messages window",
        DEDICATED_NOTICE_WINDOW: "Send notices to dedicated message window",
        NICK_OV_STATUS: "Show status (@/+) before nicknames in channel lines",
        ACCEPT_SERVICE_INVITES: "Automatically join channels when invited",
        USE_HIDDENHOST: "Hide your hostmask when authed (+x)",
        LASTPOS_LINE: "Show a last position indicator for each window",
        NICK_COLOURS: "Automatically colour nicknames",
        HIDE_JOINPARTS: "Hide JOINS/PARTS/QUITS",
        STYLE_HUE: "Adjust user interface hue",
        QUERY_ON_NICK_CLICK: "Query on nickname click in channel",
        SHOW_NICKLIST: "Show nickname list in channels",
        SHOW_TIMESTAMPS: "Show timestamps",
        FONT_SIZE: "Set font size",


        NOTIFY_ON_MENTION: "When nick mentioned:",
        NOTIFY_ON_PM: "When private messaged:",
        NOTIFY_ON_NOTICE: "When channel notice:",
        FLASH: "flash",
        BEEP: "beep",
        MESSAGE_PLACEHOLDER: ' something ... ',
        NICK_PLACEHOLDER: ' someone ... ',
        DELETE_NOTICE: 'remove',
        ADD_NOTICE: 'Add notifier',
        USER_NOTICE: 'User:',
        MESSAGE_NOTICE: 'Message:',
        AUTOESCAPE: 'Escape text',
        HIGHLIGHT: 'Highlight',
        MENTIONED: 'Mentioned',
        ESCAPE_HINT: 'This text is transformed into a regular expressions - autoescaping will check for the exact text you entered',
        DESKTOP_NOTICES: 'Allow us to send desktop notifications if supported (on any notice with flash):',

        ENABLE: 'Enable',
        DISABLE: 'Disable'
    };


    // lang.IRC_COMMAND_HELPERS = {
    //     "JOIN": "/JOIN <channel>",
    //     "NICK": "/NICK <new nickname>",
    //     "PART": "/PART <channel>",
    //     "QUIT": "/QUIT <message>",
    //     "TOPIC": "/TOPIC <channel> <topic>",
    //     "AWAY": "/AWAY <message>",
    //     "ME": "/ME <message>",
    //     "NOTICE": "/NOTICE <message>",
    //     "MODE": "/MODE <target(chan/user)> <mode>",
    //     "AUTHSERV": "/AUTHSERV AUTH <account> <password>"
    // };


ui.themes.ThemeControlCodeMap2 = {
    "C": irc.styles.colour.key,
    "B": util.getStyleByName('bold').key,
    "U": util.getStyleByName('underline').key,
    "O": irc.styles.colour.key,
    "D": irc.styles.normal.key,
    //little clever here
    "NN": templates.userlink({'userid':'{N}', 'username': '{N}'}),//nick name
    "CN": templates.userlink({'userid':'{w}', 'username': '{w}'}),// change nick
    "P": "{C}4=={O} "
    // "[": "qwebirc://whois/",
    // "]": "/"
};

ui.themes.Default2 = {
    "SIGNON": "{P}Signed on!",
    "CONNECT": "{P}Connected to server.",

    "RAW": "{P}{m}",
    "DISCONNECT": "{P}Disconnected from server: {m}",
    "ERROR": "{P}ERROR: {m}",

    "SERVERNOTICE": "{P}{m}",
    "OURTARGETEDNOTICE": "[notice({[}{t}{]})] {m}",
    "OURCHANNOTICE": "-{N}:{t}- {m}",
    "OURPRIVNOTICE": "-{N}- {m}",
    "CHANNOTICE": "-{D}{(}{N}{)}{D}:{c}- {m}",
    "PRIVNOTICE": "-{(}{N}{)}- {m}",

    "JOIN": "{P}{D}{N}{D} [{h}] has joined {c}",
    "OURJOIN": "{P}{D}{N}{D} [{h}] has joined {c}",
    "PART": "{P}{D}{N}{D} [{h}] has left {c} [{m}]",
    "KICK": "{P}{D}{v}{D} was kicked from {c} by {D}{N}{D} [{m}]",
    "MODE": "{P}mode/{c} gives [{m}] to {D}{N}{D}",
    "QUIT": "{P}{D}{N}{D} [{h}] has quit [{m}]",
    "NICK": "{P}{D}{n}{D} has changed nick to {CN}",
    "TOPIC": "{P}{D}{N}{D} changed the topic of {c} to: {m}",
    "UMODE": "Usermode change: {m}",
    "INVITE": "{N} invites you to join {c}",

    "HILIGHT": "{C}4",
    "HILIGHTEND": "{O}",

    "CHANMSG": "{D}{@}{(}{N}{)}{D} {m}",
    "PRIVMSG": "{(}{N}{)} {m}",

    "OURCHANMSG": "{@}{N} {m}",
    "OURPRIVMSG": "{N} {m}",
    "OURTARGETEDMSG": "*{[}{t}{]}* {m}",
    "OURCHANACTION": " * {N} {m}",
    "OURPRIVACTION": " * {N} {m}",

    "CHANACTION": " * {D}{(}{N}{)}{D} {m}",
    "PRIVACTION": " * {(}{N}{)} {m}",
    "CHANCTCP": "{N} [{h}] requested CTCP {x} from {c}: {m}",
    "PRIVCTCP": "{N} [{h}] requested CTCP {x} from {-}: {m}",
    "CTCPREPLY": "CTCP {x} reply from {N}: {m}",

    "OURCHANCTCP": "[ctcp({t})] {x} {m}",
    "OURPRIVCTCP": "[ctcp({t})] {x} {m}",
    "OURTARGETEDCTCP": "[ctcp({t})] {x} {m}",

    "WHOISUSER": "{P}{B}{N}{B} [{h}]",
    "WHOISREALNAME": "{P} realname : {m}",
    "WHOISCHANNELS": "{P} channels : {m}",
    "WHOISSERVER": "{P} server   : {x} [{m}]",
    "WHOISACCOUNT": "{P} account : m",
    "WHOISIDLE": "{P} idle     : {x} [connected: {m}]",
    "WHOISAWAY": "{P} away     : {m}",
    "WHOISOPER": "{P}          : {B}IRC Operator{B}",
    "WHOISOPERNAME": "{P} operedas : {m}",
    "WHOISACTUALLY": "{P} realhost : {m} [ip: {x}]",
    "WHOISGENERICTEXT": "{P} note  : {m}",
    "WHOISEND": "{P}End of WHOIS",

    "AWAY": "{P}{N} is away: {m}",
    "GENERICERROR": "{P}{m}: {t}",
    "GENERICMESSAGE": "{P}{m}",
    "WALLOPS": "{P}WALLOP {n}: {t}",
    "CHANNELCREATIONTIME": "{P}Channel {c} was created at: {m}",
    "CHANNELMODEIS": "{P}Channel modes on {c} are: {m}"
};

ui.UI_COMMANDS = [
    ["Options", "options"],
    ["Add webchat to your site", "embedded"],
    ["Privacy policy", "privacy"],
    ["Feedback", "feedback"],
    ["Frequently asked questions", "faq"],
    ["About qwebirc", "about"]
];


})();
//minor updates for edge cases

/**
 *
 *  Base64 encode / decode
 *  http://www.webtoolkit.info/
 *
 **/
var Base64 = util.B64 = (function() {
    "use strict";

    var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    var _utf8_encode = function (string) {

        var utftext = "", c, n;

        string = string.replace(/\r\n/g,"\n");

        for (n = 0; n < string.length; n++) {

            c = string.charCodeAt(n);

            if (c < 128) {

                utftext += String.fromCharCode(c);

            } else if((c > 127) && (c < 2048)) {

                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);

            } else {

                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);

            }

        }

        return utftext;
    };

    var _utf8_decode = function (utftext) {
        var string = "", i = 0, c = 0, c1 = 0, c2 = 0;

        while ( i < utftext.length ) {

            c = utftext.charCodeAt(i);

            if (c < 128) {

                string += String.fromCharCode(c);
                i++;

            } else if((c > 191) && (c < 224)) {

                c1 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c1 & 63));
                i += 2;

            } else {

                c1 = utftext.charCodeAt(i+1);
                c2 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c1 & 63) << 6) | (c2 & 63));
                i += 3;

            }

        }

        return string;
    };

    var _hexEncode = function(input) {
        var output = '', i;

        for(i = 0; i < input.length; i++) {
            output += input.charCodeAt(i).toString(16);
        }

        return output;
    };

    var _hexDecode = function(input) {
        var output = '', i;

        if(input.length % 2 > 0) {
            input = '0' + input;
        }

        for(i = 0; i < input.length; i = i + 2) {
            output += String.fromCharCode(parseInt(input.charAt(i) + input.charAt(i + 1), 16));
        }

        return output;
    };

    var encode = function (input) {
        if(!$defined(input))
            return null;

        var output = "", chr1, chr2, chr3, enc1, enc2, enc3, enc4, i = 0;

        input = _utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output += _keyStr.charAt(enc1);
            output += _keyStr.charAt(enc2);
            output += _keyStr.charAt(enc3);
            output += _keyStr.charAt(enc4);

        }

        return output;
    };

    var decode = function (input) {
        if(!$defined(input))
            return null;

        var output = "", chr1, chr2, chr3, enc1, enc2, enc3, enc4, i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = _keyStr.indexOf(input.charAt(i++));
            enc2 = _keyStr.indexOf(input.charAt(i++));
            enc3 = _keyStr.indexOf(input.charAt(i++));
            enc4 = _keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output += String.fromCharCode(chr1);

            if (enc3 !== 64) {
                output += String.fromCharCode(chr2);
            }
            if (enc4 !== 64) {
                output += String.fromCharCode(chr3);
            }

        }

        return _utf8_decode(output);
    };

    var decodeToHex = function(input) {
        return _hexEncode(decode(input));
    };

    var encodeFromHex = function(input) {
        return encode(_hexDecode(input));
    };

    return {
        'encode': encode,
        'decode': decode,
        'decodeToHex': decodeToHex,
        'encodeFromHex': encodeFromHex
    };
}());

/*
 * MD5
 *
 * Usage:
 *
 *   var object = new MD5()
 *
 *     Returns a MD5 object.
 *
 *   object.digest(input)
 *
 *     Returns MD5 message digest of input.
 *
 * Example:
 *
 *   var object = new MD5();
 *
 *   // Examples drawn from RFC1321 test suite
 *   object.digest("");
 *   // d41d8cd98f00b204e9800998ecf8427e
 *
 *   object.digest("a");
 *   // 0cc175b9c0f1b6a831c399e269772661
 *
 *   object.digest("abc");
 *   // 900150983cd24fb0d6963f7d28e17f72
 *
 *   object.digest("message digest");
 *   // f96b697d7cb7938d525a2f31aaf161d0
 *
 *   object.digest("abcdefghijklmnopqrstuvwxyz");
 *   // c3fcd3d76192e4007dfb496cca67e13b
 *
 *   object.digest("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789");
 *   // d174ab98d277d9f5a5611c2c9f419d9f
 *
 *   object.digest("12345678901234567890123456789012345678901234567890123456789012345678901234567890");
 *   // 57edf4a22be3c955ac49da2e2107b67a
 */

crypto.MD5 = function() {
    this.digest = calcMD5;

    /*
     * Convert a 32-bit number to a hex string with ls-byte first
     */
    var hex_chr = "0123456789abcdef";

    function rhex(num) {
        var str = "";
        for (var j = 0; j <= 3; j++)
        str += hex_chr.charAt((num >> (j * 8 + 4)) & 0x0F) + hex_chr.charAt((num >> (j * 8)) & 0x0F);
        return str;
    }

    /*
     * Convert a string to a sequence of 16-word blocks, stored as an array.
     * Append padding bits and the length, as described in the MD5 standard.
     */

    function str2blks_MD5(str) {
        var nblk = ((str.length + 8) >> 6) + 1;
        var blks = new Array(nblk * 16);
        for (var i = 0; i < nblk * 16; i++) blks[i] = 0;
        for (var i = 0; i < str.length; i++)
        blks[i >> 2] |= str.charCodeAt(i) << ((i % 4) * 8);
        blks[i >> 2] |= 0x80 << ((i % 4) * 8);
        blks[nblk * 16 - 2] = str.length * 8;
        return blks;
    }

    /*
     * Add integers, wrapping at 2^32
     */

    function add(x, y) {
        return ((x & 0x7FFFFFFF) + (y & 0x7FFFFFFF)) ^ (x & 0x80000000) ^ (y & 0x80000000);
    }

    /*
     * Bitwise rotate a 32-bit number to the left
     */

    function rol(num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt));
    }

    /*
     * These functions implement the basic operation for each round of the
     * algorithm.
     */

    function cmn(q, a, b, x, s, t) {
        return add(rol(add(add(a, q), add(x, t)), s), b);
    }

    function ff(a, b, c, d, x, s, t) {
        return cmn((b & c) | ((~b) & d), a, b, x, s, t);
    }

    function gg(a, b, c, d, x, s, t) {
        return cmn((b & d) | (c & (~d)), a, b, x, s, t);
    }

    function hh(a, b, c, d, x, s, t) {
        return cmn(b ^ c ^ d, a, b, x, s, t);
    }

    function ii(a, b, c, d, x, s, t) {
        return cmn(c ^ (b | (~d)), a, b, x, s, t);
    }

    /*
     * Take a string and return the hex representation of its MD5.
     */

    function calcMD5(str) {
        var x = str2blks_MD5(str);
        var a = 0x67452301;
        var b = 0xEFCDAB89;
        var c = 0x98BADCFE;
        var d = 0x10325476;

        for (var i = 0; i < x.length; i += 16) {
            var olda = a;
            var oldb = b;
            var oldc = c;
            var oldd = d;

            a = ff(a, b, c, d, x[i + 0], 7, 0xD76AA478);
            d = ff(d, a, b, c, x[i + 1], 12, 0xE8C7B756);
            c = ff(c, d, a, b, x[i + 2], 17, 0x242070DB);
            b = ff(b, c, d, a, x[i + 3], 22, 0xC1BDCEEE);
            a = ff(a, b, c, d, x[i + 4], 7, 0xF57C0FAF);
            d = ff(d, a, b, c, x[i + 5], 12, 0x4787C62A);
            c = ff(c, d, a, b, x[i + 6], 17, 0xA8304613);
            b = ff(b, c, d, a, x[i + 7], 22, 0xFD469501);
            a = ff(a, b, c, d, x[i + 8], 7, 0x698098D8);
            d = ff(d, a, b, c, x[i + 9], 12, 0x8B44F7AF);
            c = ff(c, d, a, b, x[i + 10], 17, 0xFFFF5BB1);
            b = ff(b, c, d, a, x[i + 11], 22, 0x895CD7BE);
            a = ff(a, b, c, d, x[i + 12], 7, 0x6B901122);
            d = ff(d, a, b, c, x[i + 13], 12, 0xFD987193);
            c = ff(c, d, a, b, x[i + 14], 17, 0xA679438E);
            b = ff(b, c, d, a, x[i + 15], 22, 0x49B40821);

            a = gg(a, b, c, d, x[i + 1], 5, 0xF61E2562);
            d = gg(d, a, b, c, x[i + 6], 9, 0xC040B340);
            c = gg(c, d, a, b, x[i + 11], 14, 0x265E5A51);
            b = gg(b, c, d, a, x[i + 0], 20, 0xE9B6C7AA);
            a = gg(a, b, c, d, x[i + 5], 5, 0xD62F105D);
            d = gg(d, a, b, c, x[i + 10], 9, 0x02441453);
            c = gg(c, d, a, b, x[i + 15], 14, 0xD8A1E681);
            b = gg(b, c, d, a, x[i + 4], 20, 0xE7D3FBC8);
            a = gg(a, b, c, d, x[i + 9], 5, 0x21E1CDE6);
            d = gg(d, a, b, c, x[i + 14], 9, 0xC33707D6);
            c = gg(c, d, a, b, x[i + 3], 14, 0xF4D50D87);
            b = gg(b, c, d, a, x[i + 8], 20, 0x455A14ED);
            a = gg(a, b, c, d, x[i + 13], 5, 0xA9E3E905);
            d = gg(d, a, b, c, x[i + 2], 9, 0xFCEFA3F8);
            c = gg(c, d, a, b, x[i + 7], 14, 0x676F02D9);
            b = gg(b, c, d, a, x[i + 12], 20, 0x8D2A4C8A);

            a = hh(a, b, c, d, x[i + 5], 4, 0xFFFA3942);
            d = hh(d, a, b, c, x[i + 8], 11, 0x8771F681);
            c = hh(c, d, a, b, x[i + 11], 16, 0x6D9D6122);
            b = hh(b, c, d, a, x[i + 14], 23, 0xFDE5380C);
            a = hh(a, b, c, d, x[i + 1], 4, 0xA4BEEA44);
            d = hh(d, a, b, c, x[i + 4], 11, 0x4BDECFA9);
            c = hh(c, d, a, b, x[i + 7], 16, 0xF6BB4B60);
            b = hh(b, c, d, a, x[i + 10], 23, 0xBEBFBC70);
            a = hh(a, b, c, d, x[i + 13], 4, 0x289B7EC6);
            d = hh(d, a, b, c, x[i + 0], 11, 0xEAA127FA);
            c = hh(c, d, a, b, x[i + 3], 16, 0xD4EF3085);
            b = hh(b, c, d, a, x[i + 6], 23, 0x04881D05);
            a = hh(a, b, c, d, x[i + 9], 4, 0xD9D4D039);
            d = hh(d, a, b, c, x[i + 12], 11, 0xE6DB99E5);
            c = hh(c, d, a, b, x[i + 15], 16, 0x1FA27CF8);
            b = hh(b, c, d, a, x[i + 2], 23, 0xC4AC5665);

            a = ii(a, b, c, d, x[i + 0], 6, 0xF4292244);
            d = ii(d, a, b, c, x[i + 7], 10, 0x432AFF97);
            c = ii(c, d, a, b, x[i + 14], 15, 0xAB9423A7);
            b = ii(b, c, d, a, x[i + 5], 21, 0xFC93A039);
            a = ii(a, b, c, d, x[i + 12], 6, 0x655B59C3);
            d = ii(d, a, b, c, x[i + 3], 10, 0x8F0CCC92);
            c = ii(c, d, a, b, x[i + 10], 15, 0xFFEFF47D);
            b = ii(b, c, d, a, x[i + 1], 21, 0x85845DD1);
            a = ii(a, b, c, d, x[i + 8], 6, 0x6FA87E4F);
            d = ii(d, a, b, c, x[i + 15], 10, 0xFE2CE6E0);
            c = ii(c, d, a, b, x[i + 6], 15, 0xA3014314);
            b = ii(b, c, d, a, x[i + 13], 21, 0x4E0811A1);
            a = ii(a, b, c, d, x[i + 4], 6, 0xF7537E82);
            d = ii(d, a, b, c, x[i + 11], 10, 0xBD3AF235);
            c = ii(c, d, a, b, x[i + 2], 15, 0x2AD7D2BB);
            b = ii(b, c, d, a, x[i + 9], 21, 0xEB86D391);

            a = add(a, olda);
            b = add(b, oldb);
            c = add(c, oldc);
            d = add(d, oldd);
        }
        return rhex(a) + rhex(b) + rhex(c) + rhex(d);
    }
}

crypto.xorStreams = function(data, prngstream) {
    if (data.length != prngstream.length) return;

    var output = [];
    for (var i = 0; i < data.length; i++)
    output.push(String.fromCharCode(data.charCodeAt(i) ^ prngstream[i]));

    return output.join("");
};

crypto.ARC4 = function(key, data) {
    var prngstream = crypto.getARC4Stream(key, data.length + 1024); /* burn first 1024 bytes */
    prngstream = prngstream.slice(1024);

    return crypto.xorStreams(data, prngstream);
};


util.crypto.getARC4Stream = function(key, length) {
    var s = [];

    var keyint = [];
    for (var i = 0; i < key.length; i++) {
        keyint.push(key.charCodeAt(i));
    }

    for (var i = 0; i < 256; i++) {
        s[i] = i;
    }
    var j = 0;
    for (var i = 0; i < 256; i++) {
        j = (j + s[i] + keyint[i % key.length]) & 255;
        var w = s[i];
        s[i] = s[j];
        s[j] = w;
    }

    var output = [];
    var i = 0;
    var j = 0;
    for (var k = 0; k < length; k++) {
        i = (i + 1) & 255;
        j = (j + s[i]) & 255;

        var w = s[i];
        s[i] = s[j];
        s[j] = w;
        output.push(s[(s[i] + s[j]) & 255]);
    }
    return output;
};


Epitome.View.implement({
    template: function(data, template) {
        // refactored for handlebars
        template = template || this.options.template;
        return template(data);
    }
});


var storage = util.storage = new Storage({
    duration: 365,
    domain: '/',
    debug: DEBUG
}),

session = util.sessionStorage = new Storage({
    storageType: 'sessionStorage',
    duration: 1,
    debug: DEBUG,
    fallback: false
});

//simple wrapper class
//object.append breaks prototypes :/
var Storer = (function(name, storer) {
    this.name = name;
    // this.storage = storer || storage;
}.implement({
    get: function() {
        return /*this.*/storage.get(this.name);
    },
    set: function(val) {
        return /*this.*/storage.set(this.name, val);
    },
    dispose: function() {
        return /*this.*/storage.remove(this.name);
    }
}));
/*.alias({
    get: 'read',
    write: 'set',
    remove: 'dispose'
}));*/


ui.setTitle = function(title, options) {
    if (options && options.alert) {
        ui.setTitleAlert(title, options);
    } else {
        document.title = title;
    }
};

util.setCaretPos = Element.setCaretPosition;

util.setAtEnd = function($el) {
    $el.setCaretPosition($el.value.length);
};

util.getCaretPos = Element.getCaretPosition;

util.wrapSelected = function($eles, wrap) {
    $eles = $$($eles);

    var start = Array.isArray(wrap) ? wrap[0] : wrap,
        end = Array.isArray(wrap) ? wrap[1] : wrap;

    $eles.each(function($ele) {
        var range = $ele.getSelectedRange();
        if(range.start != range.end) {
            var text = $ele.val();
            $ele.val(text.slice(0, range.start) + start + text.slice(range.start, range.end) + end + text.slice(range.end))
                .setCaretPosition(range.end + start.length + end.length);
        }
    });
}

util.percentToPixel= function(data, par) {
    par = par || document.body;
    var size = par.getSize();
    return {
        x: size.x * (data.x / 100),
        y: size.y * (data.y / 100)
    };
}

ui.decorateDropdown = function(btn, ddm, options) {
    ddm.hideMenu = function() {
        if(options && options.onHide)
            options.onHide.call(this, ddm);
        return ddm.hide();
    };
    ddm.showMenu = function() {
        if(options && options.onShow)
            options.onShow.call(this, ddm);

        if (ddm.isDisplayed()) {
           ddm.hideMenu();
        } else {
            ddm.show();
            document.addEvent("click:once", ddm.hideMenu);
        }
        return ddm;
    };

    ddm.position.delay(50, ddm, {
        relativeTo: btn,
        position: {x: 'left', y: 'bottom'},
        edge: {x: 'left', y: 'top'}
    });

    btn.addEvent("click", function(e) {
            e.stop();
            ddm.showMenu();
        });
    return ddm.hideMenu();
};

//dirty function please help with css :(
//dir can be 'width' 'height'
util.fillContainer = function ($ele, options) {
    options = Object.append({style: ['width'], offset: 20}, options);

    var filler = function() {
        var size = $ele.getSize();

        Array.from( options.style ).each(function(style) {//wait a sec for potential style recalcs
            var method = style.contains('width') ? 'x' : 'y',
                offset = options.offset;

            $ele.getSiblings().each(function(sib) {
                offset += sib.getSize()[method];
            });

            $ele.setStyle(style, "calc(100% - " + offset + "px)");
        });
    }

    filler.delay(20);
    return $ele;
};

util.elementAtScrollPos = function($ele, pos, dir, offset) {
    dir = (dir || 'width').capitalize();
    offset = offset || 10;
    var $res = $ele.lastChild;
    Array.some($ele.childNodes, function($kid) {
        offset += $kid['get' + dir]();
        if(offset >= pos) {
            $res = $kid;
            return true;
        }
    });
    return $res;
};


(function() {

//welcome to my dirty corner. Here we welcome regexs and confusing loops

//Parses messages for url strings and creates hyperlinks
var urlifier = util.urlifier = new Urlerizer({
    target: '_blank'
});
var channame_re = /(#|>)[\s\S]*(?=\/)/,
    chan_re = /#|\/|\\/;

urlifier.leading_punctuation.include(/^([\x00-\x02]|\x016|\x1F)/).include(/^(\x03+(\d{1,2})(?:,\d{1,2})?)/);
urlifier.trailing_punctuation.include(/([\x00-\x03]|\x016|\x1F)$/);

urlifier.addPattern(/qwebirc:\/\/(.*)/, function(word) {//breaks on names with dashs "qwebirc://whois/envision-#tf2mix/"
            //given "qwebirc://whois/rushey#tf2mix/"
            if(word.contains("qwebirc://")) {
                var parsed = this.parsePunctuation(word),
                    mid = parsed.mid;

                if(mid.startsWith("qwebirc://") && mid.endsWith("/") && mid.length > 11) {
                    var cmd = mid.slice(10);//remove qwebirc://
                    if(cmd.startsWith("whois/")) {
                        var chan_match = cmd.match(channame_re); //matches the chan or user to the dash
                        var chan = chan_match ? chan_match[0] : "";
                        var chanlen = chan_match ? chan_match.index : cmd.length - 1; //chan length or the len -1 to atleast remove the dash
                        var user = cmd.slice(6, chanlen);//whois to channel
                        cmd = templates.userlink({'userid': user, 'username': user + chan});
                    }
                    else if(cmd.startsWith("options") || cmd.startsWith("embedded")) {
                        cmd = cmd.match(/.*\//)[0];
                        cmd = cmd.slice(0, cmd.length);
                    }
                    word = parsed.lead + cmd + parsed.end;
                }
            }
            return word;

            //generates something like <span class="hyperlink-whois">Tristan#tf2mix</span>
        })
        .addPattern(/\B#+(?![\._#-+])/, function(word) {
            var parsed = this.parsePunctuation(word),
                res = parsed.mid;

            if(isChannel(res) && !res.startsWith("#mode") && !res.slice(1).test()) {
                res = templates.channellink({channel:util.formatChannel(res)});
            }

            return parsed.lead + res + parsed.end;
        });

var inputurl = util.inputParser = new Urlerizer({
    default_parser: false,
    autoescape: false
});

var bbmatch = /\[.+?\].+\[\/.+?\]/i;
var colour_re = /\[colo(u)?r+(.*?)\](.*?)\[\/colo(u)?r\b\]/ig;
inputurl.addPattern(bbmatch,//this pattern needs to be optimized
    function parsebb(_text) {//see http://patorjk.com/blog/2011/05/07/extendible-bbcode-parser-in-javascript/
        var stac = [],//for colours try somthing like "[b test=a]test[/b] test".match(/\[b+(.*?)\](.*?)\[\/b\b\]/)
            tag_re = /\[.+?\]/i,
            tag_m, col_m,
            tag,
            text = _text,

            bb, style, endTag_re, end_indx, inner;

        var colours = irc.styles.colour; //replacing colours [colour fore=red back=2]ya[/colour] => \x034,2ya\x03
        text = text.replace(colour_re, function(match, zZz, attributes, text) {
            var attrs = attributes.clean().split(" "), //will split into cey value pairs ["te=a", "b=a"]
                attrso = {},
                fore, bac;

            attrs.each(function(attr) { //map the obj
                if(attr.contains("=")) {
                    attr = attr.split("=")
                    attrso[attr[0]] = attr[1]; 
                }
            });

            if(attrso.fore || attrso.bac){
                fore = util.getColourByName(attrso.fore) || util.getColourByKey(attrso.fore) || util.getColourByName('black');
                bac = util.getColourByName(attrso.back) || util.getColourByKey(attrso.back) || util.getColourByName('white');
                return colours.format.substitute({
                    f: fore.key,
                    b: bac.key,
                    t: text
                })
            }
            return match;
        });

        while(tag_m = text.match(tag_re)) { //todo do the matching as above
            tag = tag_m[0];
            //assume everything before has been processed
            stac.push(text.slice(0, tag_m.index));
            text = text.slice(tag_m.index);

            style = _.find(irc.styles.special, function(sty) {
                return sty.bbcode[0] === tag;
            });
            if(style) {
                bb = style.bbcode;

                endTag_re = new RegExp(String.escapeRegExp(bb[1]), "i");
                end_indx = text.search(endTag_re);
                if(end_indx !== -1) {
                    inner = text.slice(tag.length, end_indx);
                    if(bbmatch.test(inner)) {//recurse
                        inner = parsebb(inner);
                    }
                    stac.push(style.key + inner + style.key);
                    text = text.slice(end_indx + bb[1].length);
                    continue;
                }
            }

            stac.push(tag);
            text = text.slice(tag.length);
        }

        return stac.join("") + text;
    }, true)

})()




irc.RegisteredCTCPs = {
    "VERSION": $lambda("qwebirc v" + qwebirc.VERSION + ", copyright (C) 2008-2011 Chris Porter and the qwebirc project -- " + qwebirc.util.browserVersion()),
    "USERINFO": $lambda("qwebirc"),
    "TIME": function(x) {
        return util.IRCDate(new Date());
    },
    "PING": $lambda,
    "CLIENTINFO": $lambda("PING VERSION TIME USERINFO CLIENTINFO WEBSITE"),
    "WEBSITE": $lambda(((window == window.top) ? "direct" : document.referrer))
};

irc.DummyNicknameValidator = new Class({
    validate: $identity
});

irc.NicknameValidator = new Class({
    initialize: function(options) {
        this.options = options;
    },
    validate: function(nick, permitDot) {
        var self = this,
            generated = [],
            max = Math.min(self.options.maxLen, nick.length);

        max.times(function(indx) {
            var _char = nick[indx];

            var valid = (indx === 0) ? self.options.validFirstChar : self.options.validSubChars;

            if (valid.contains(_char) || permitDot && _char === ".") {
                generated.push(_char);
            } else {
                generated.push("_"); //yeah we assume this is valid... 
            }
        });

        while (generated.length < this.options.minLen) {
            generated.push("_"); // yeah we assume this is valid... 
        }
        return generated.join("");
    }
});


ui.Interface = new Class({
    Implements: [Options, Events],
    options: {
        baseURL: 'atf2.org',
        dynamicBaseURL: "/",
        staticBaseURL: "/",
        searchURL: true,

        appTitle: "Gamesurge.net Web IRC",
        networkName: "Gamesurge",
        networkServices: [],

        initialNickname: "",
        initialChannels: ["#tf2newbiemix","#tf2mix","#tf2.pug.na","#tf2.pug.nahl","#jumpit","#tf2scrim","#tftv"],
        minRejoinTime: [5, 20, 300], //array - secs between consecutive joins

        modifiableStylesheet: window.ircoptions.stylesheet,

        hue: null,
        saturation: null,
        lightness: null,

        theme: undefined,
        uiOptionsArg: null,

        loginRegex: /I recogni[sz]e you\./,
        nickValidation: null

    },
    //var ui = new qwebirc.ui.Interface("ircui", qwebirc.ui.QUI, {"appTitle":"QuakeNet Web IRC","dynamicBaseURL":"/dynamic/leibniz/","baseURL":"http://webchat.quakenet.org/","validateNickname":false,"networkServices":["Q!TheQBot@CServe.quakenet.org"],"nickValidation":{"maxLen":15,"validSubChars":"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_[]{}`^\\|0123456789-","validFirstChar":"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_[]{}`^\\|","minLen":2},"staticBaseURL":"/static/leibniz/","loginRegex":"^You are now logged in as [^ ]+\\.$","networkName":"QuakeNet"});
    initialize: function(element, uitheme, options) {
        this.setOptions(options);
        var self = this,
            opts = self.options;

        var sbaseurl = opts.staticBaseURL;
        qwebirc.global = {
            dynamicBaseURL: opts.dynamicBaseURL,
            staticBaseURL: sbaseurl,
            nicknameValidator: opts.nickValidation ? new irc.NicknameValidator(opts.nickValidation) : new irc.DummyNicknameValidator()
        };

        opts.icons = {
            //favicon: sbaseurl + "images/favicon.png",
            empty_favicon: sbaseurl + "images/empty_favicon.ico",
            menuicon: sbaseurl + "images/icon.png"
        };

        opts.sounds = {
            //soundManagersrc: sbaseurl + "js/soundmanager2-nodebug-jsmin.js",
            sounds: sbaseurl + "sound",
            beepsrc: "/beep3.mp3",
            minSoundRepeatInterval: 5000
        };

        opts.specialUserActions = [ //special actions to take when particular users speak
            function(user, msg, target, client) {
                var interested = opts.networkServices.contains(user);
                if(interested) {
                    if(opts.loginRegex.test(msg)) {
                        client.authEvent();
                    }
                    client.getActiveWindow().infoMessage(msg);
                }
                return interested;
            }
        ],

        window.addEvent("domready", function() {
            var inick = opts.initialNickname,
                ichans = storage.get("channels") || opts.initialChannels,
                autoConnect = false;

            //cleans up old properties
            if(storage.get('__clean') !== false)
                self.cleanUp();

            // var cookopts = opts.cookieOpts;
            //cookies to store connection details
            var authCookies = {
                nick: new Storer("nickname"),//initial nick
                user: new Storer("gamesurge"),//auth account
                pass: new Storer("password"),//auth password
                auth: new Storer("enableAuth")//enable full auth
            };

            if (opts.searchURL) {
                var args = util.parseURI(document.location.toString()),
                    url = args["url"],
                    chans,
                    nick = args["nick"],
                    canAutoConnect = false;
                opts.hue = self.getHueArg(args, "");
                opts.saturation = self.getSaturationArg(args, "");
                opts.lightness = self.getLightnessArg(args, "");

                opts.thue = self.getHueArg(args, "t");
                opts.tsaturation = self.getSaturationArg(args, "t");
                opts.tlightness = self.getLightnessArg(args, "t");

                if ($defined(args["uio"])) {
                    opts.uiOptionsArg = args["uio"];
                }

                if ($defined(url)) {
                    ichans = self.parseIRCURL(url);
                    if (!! chans) {
                        canAutoConnect = true;
                    }
                } else {
                    chans = args["channels"];

                    if (chans) {
                        var cdata = chans.split(" ");
                        cdata[0] = util.formatChannelString(cdata[0]);
                        ichans = cdata.join(" ");
                        canAutoConnect = true;
                    }
                }

                if ($defined(nick)) {
                    inick = self.randSub(nick);
                }

                if (args["randomnick"] && args["randomnick"] == 1) {
                    inick = opts.initialNickname;
                }


                //Stupid... using variables out of scope can only have one result.

                // we only consider autoconnecting if the nick hasn't been supplied, or it has and it's not "" 
                // if(canAutoConnect && (!$defined(inick) || !!inick)) {//this is stupid...
                //     var p = args["prompt"],
                //         pdefault = false;

                //     if(!$defined(p) || !!p) {
                //         pdefault = true;
                //         p = false;
                //     } else if(p == "0") {
                //         p = false;
                //     } else {
                //         p = true;
                //     }

                //     // autoconnect if we have channels and nick but only if prompt != 1
                //     if(($defined(inick) || !pdefault)  && !p) {// OR if prompt=0, but not prompt=(nothing)
                //         autoConnect = true;
                //     }
                // }
            }

            self.ui_ = new uitheme($(element), new ui.Theme(opts.theme), opts); //unconventional naming scheme

            var usingAutoNick = true; //!$defined(nick);//stupid used out of scope
            //if(usingAutoNick && autoConnect) {
            inick = opts.initialNickname;
            //}

            var details = self.ui_.loginBox(inick, ichans, autoConnect, usingAutoNick, opts.networkName, authCookies);

            self.ui_.addEvent("login:once", function(loginopts) {
                var ircopts = Object.append(Object.subset(opts, ['initialChannels', 'specialUserActions', 'minRejoinTime', 'networkServices']), loginopts);

                var client = self.IRCClient = new irc.IRCClient(ircopts, self.ui_);
                client.connect();


                window.onbeforeunload =  function(e) {
                    if (!client.disconnected) {
                        var message = "This action will close all active IRC connections.";
                        if ((e = e || window.event)) {
                            e.returnValue = message;
                        }
                        return message;
                    }
                };
                window.addEvent('unload', client.quit);

                if(!auth.enabled) {
                    self.ui_.beep();
                }

                client.addEvent("auth:once", self.ui_.beep);

                self.fireEvent("login", {
                    'IRCClient': client,
                    'parent': self
                });
            });
        });
    },
    cleanUp: function() {
        var cookies = ['channels', 'nickname', 'gamesurge', 'password', 'opt1'];
        if($defined(localStorage) && cookies.some(function(id) { return Cookie.read(id) !== null })) {
            if(confirm('The old app installed cookies that are no longer used... Delete them?')) {
                cookies.each(Cookie.dispose); //delete old cookies
            }
        }
        storage.set('__clean', false);
    },
    getHueArg: function(args) {
        var hue = args["hue"];
        if (!$defined(hue)) return null;
        hue = parseInt(hue, 10);
        if (hue > 360 || hue < 0) return null;
        return hue;
    },
    getSaturationArg: function(args) {
        var saturation = args["saturation"];
        if (!$defined(saturation)) return null;
        saturation = parseInt(saturation, 10);
        if (saturation > 100 || saturation < -100) return null;
        return saturation;
    },
    getLightnessArg: function(args) {
        var lightness = args["lightness"];
        if (!$defined(lightness)) return null;
        lightness = parseInt(lightness,10);
        if (lightness > 100 || lightness < -100) return null;
        return lightness;
    },
    randSub: function(nick) {
        var getDigit = function() {
                return Math.floor(Math.random() * 10);
        };

        return nick.split("").map(function(v) {
            if (v == ".") {
                return getDigit();
            } else {
                return v;
            }
        }).join("");

    },
    parseIRCURL: function(url) {
        var schemeComponents, args,queryArgs,parts,pathComponents,channel,value,i;
        if (url.indexOf(":") === 0) {return;}
        schemeComponents = url.splitMax(":", 2);
        if (schemeComponents[0].toLowerCase() != "irc" && schemeComponents[0].toLowerCase() != "ircs") {
            alert("Bad IRC URL scheme.");
            return;
        }

        if (url.indexOf("/") === 0) { /* irc: */
            return;
        }

        pathComponents = url.splitMax("/", 4);
        if (pathComponents.length < 4 || !pathComponents[3]) { /* irc://abc */
            return;
        }

        if (pathComponents[3].indexOf("?") > -1) {
            queryArgs = util.parseURI(pathComponents[3]);
            args = pathComponents[3].splitMax("?", 2)[0];
        } else {
            args = pathComponents[3];
        }
        parts = args.split(",");

        channel = parts[0];
        if (channel.charAt(0) != "#") channel = "#" + channel;


        var not_supported = [],
            needkey = false,
            key;
        for (i = 1; i < parts.length; i++) {
            value = parts[i];
            if (value == "needkey") {
                needkey = true;
            } else {
                not_supported.push(value);
            }
        }

        if ($defined(queryArgs)) {
            Object.each(queryArgs, function(val_, key_) {
                if (key_ == "key") {
                    key = value;
                    needkey = true;
                } else {
                    not_supported.push(key_);
                }
            });
        }

        if (needkey) {
            if (!$defined(key)) {key = prompt("Please enter the password for channel " + channel + ":");}
            if ($defined(key)) {channel = channel + " " + key;}
        }

        if (not_supported.length > 0) alert("The following IRC URL components were not accepted: " + not_supported.join(", ") + ".");

        return channel;
    }
});


auth.loggedin = false;

auth.enabled = false;

auth.authed = false;

auth.signedIn = false; //when the channels are joined

auth.quakeNetAuth = $lambda(false);

auth.passAuth = $lambda(true);

auth.bouncerAuth = $lambda(false);

ui.AuthLogin = function(e) {
    var cookie = Cookie.write("redirect", document.location);
    document.location = qwebirc.global.dynamicBaseURL + "auth/";
    new Event(e).stop();
};


//base client should know absolutely nothing about the outside world- client will dictate ui interactions via events
irc.BaseIRCClient = new Class({
    Implements: [Options, Events],
    Binds: ["dispatch"],

    options: {
        nickname: "qwebirc",
        specialUserActions: []
    },

    initialize: function(options) {
        var self = this;
        self.setOptions(options);
        var opts = self.options;

        self.toIRCLower = irc.RFC1459toIRCLower; //default text codec

        self.nickname = options.nickname;
        self.lowerNickname = self.toIRCLower(self.nickname);

        self.__signedOn = false;
        self.pmodes = {
            b: irc.PMODE_LIST,
            l: irc.PMODE_SET_ONLY,
            k: irc.PMODE_SET_UNSET,
            o: irc.PMODE_SET_UNSET,
            v: irc.PMODE_SET_UNSET
        };
        self.channels = {};
        self.nextctcp = 0;

        var conn = self.connection = new irc.IRCConnection({
            gamesurge: opts.gamesurge,
            initialNickname: self.nickname,
            onRecv: self.dispatch,
            password: opts.password,
            serverPassword: opts.serverPassword
        });

        self.send = conn.send;

        self.setupGenericErrors();
    },

    trigger: function(type, data) { //just a kind helper so i can get the type easily on the ui
        data["-"] = this.nickname;
        return this.fireEvent(type, [type, data]);
    },

    connect: function() {
        return this.connection.connect();
    },

    disconnect: function() {
        this.disconnected = true;
        return this.connection.disconnect();
    },

    dispatch: function(data) {
        var message = data[0];
        switch(message) {
            case "connect":
                this.connected();
            break;
            case "disconnect":
                if (data.length === 0) {
                    this.disconnected("No error!");
                } else {
                    this.disconnected(data[1]);
                }
                this.disconnect();
            break;
            case "c":
                var command = data[1].toUpperCase(),
                    prefix = data[2],
                    sl = data[3],

                    fn = this["irc_" + (irc.Numerics[command] || command)];

                if (fn) {
                    var result = fn.call(this, prefix, sl);
                    if (result) {
                        return;
                    }
                }
                this.rawNumeric(command, prefix, sl);
            break;
        }
    },

    supported: function(key, value) {
        switch(key) {
            case "CASEMAPPING":
                if (value === "ascii") {
                    this.toIRCLower = irc.ASCIItoIRCLower;
                } else if (value === "rfc1459") {
                    //default
                } else {
                    // TODO: warn 
                    console.log('unsupported codec');
                }
                this.lowerNickname = this.toIRCLower(this.nickname); //why does this happen here
            break;
            case "CHANMODES":
                value.split(",").each(function(mode, inx) {
                    Array.each(mode, function(letter) {
                        this.pmodes[letter] = inx;
                    }, this);
                }, this);
            break;
            case "PREFIX":
                var len = (value.length - 2) / 2, //i think this accounts the double underscore
                    modeprefixes = value.substr(1, len);
                Array.each(modeprefixes, function(modeprefix) {
                    this.pmodes[modeprefix] = irc.PMODE_SET_UNSET;
                }, this);
            break;
        }
    },

    __inChannel: function(name) {
        return this.channels.contains(name);
    },

    __killChannel: function(name) {
        return this.channels.erase(name);
    },

    processCTCP: function(message) {
        if (message.charAt(0) !== "\x01")
            return;

        if (Array.getLast(message) === "\x01") {
            message = message.substr(1, message.length - 2);
        } else {
            message = message.substr(1);
        }
        return message.splitMax(" ", 2);
    },

    //expected to be overriden
    getChannels: function() {
        return this.channels;
    },

    storeChannels: function(c) {
        this.channels = c;
        return c;
    },

    canJoinChannel: function(c) {
        return true;
    },

    irc_RPL_WELCOME: function(prefix, params) {
        var self = this;
        self.nickname = params[0];
        self.lowerNickname = self.toIRCLower(self.nickname);
        self.signedOn(self.nickname);
        (function() {
            self.__signedOn = true; //so auto join channels arent selected immediately - brouhaha window is
        }).delay(1000);
    },

    irc_ERR_NICKNAMEINUSE: function(prefix, params) {
        this.genericError(params[1], params.getLast().replace("in use.", "in use")); //................... fix the program not the 

        if (this.__signedOn) {
            return true;
        }

        var nick = params[1],
            newnick = nick + Number.random(1, 1000);

        this.send("NICK " + newnick);
        this.lastnick = newnick;
        return true;
    },

    irc_NICK: function(prefix, params) {
        var user = prefix,
            oldnick = util.hostToNick(user),
            newnick = params[0],
            wasus = this.nickname === oldnick;

        if (wasus) { //shouldnt this always be true?
            this.nickname = newnick;
            this.lowerNickname = this.toIRCLower(this.nickname);
        }

        this.nickChanged(user, newnick, wasus);

        return true;
    },

    irc_QUIT: function(prefix, params) {
        var user = prefix,
            message = params.getLast();

        this.userQuit(user, message);

        return true;
    },

    irc_PART: function(prefix, params) {
        var user = prefix,
            channel = params[0],
            message = params[1],

            nick = util.hostToNick(user);

        this.partHandler(nick, channel);
        this.userPart(user, channel, message);

        return true;
    },

    irc_KICK: function(prefix, params) {
        var kicker = prefix,
            channel = params[0],
            kickee = params[1],
            message = params[2];

        this.partHandler(kickee, channel);
        this.userKicked(kicker, channel, kickee, message);

        return true;
    },

    partHandler: function(nick, chan) {
        var wasus = nick === this.nickname;
        if(wasus && this.__inChannel(chan)) {
            this.__killChannel(chan);
        }
        return wasus;
    },

    irc_PING: function(prefix, params) {
        this.send("PONG :" + params.getLast());

        return true;
    },

    irc_JOIN: function(user, params) {
        var newchan = params[0],
            nick = util.hostToNick(user),
            wasus = (nick === this.nickname);

        if(wasus) {
            if(!isBaseWindow(newchan)) {
                this.storeChannels(util.addChannel(this.getChannels(), newchan));
            }
            if(this.__signedOn) {
                this.currentChannel = newchan;
            }
        }

        this.userJoined(user, newchan);

        return true;
    },


    irc_TOPIC: function(prefix, params) {
        var user = prefix,
            channel = params[0],
            topic = params.getLast();

        this.channelTopic(user, channel, topic);

        return true;
    },

    //todo buffer messages
    irc_PRIVMSG: function(prefix, params) {
        var user = prefix,
            target = params[0],
            message = params.getLast();

        var ctcp = this.processCTCP(message);
        if (ctcp) {
            var type = ctcp[0].toUpperCase();

            var replyfn = irc.RegisteredCTCPs[type];
            if (replyfn) {
                var t = Date.now() / 1000;
                if (t > this.nextctcp) { //too quick? why not just a buffer?
                    var repctcp = replyfn(ctcp[1]);
                    this.send("NOTICE " + util.hostToNick(user) + " :\x01" + type + " " + repctcp + "\x01");
                }
                this.nextctcp = t + 5;
            }

            if (target === this.nickname) {
                this.userCTCP(user, type, ctcp[1]);
            } else {
                this.channelCTCP(user, target, type, ctcp[1]);
            }
        } else {
            if (target === this.nickname) {
                this.userPrivmsg(user, message);
            } else {
                this.channelPrivmsg(user, target, message);
            }
        }
        return true;
    },

    irc_NOTICE: function(host, params) {
        var user = util.hostToNick(host),
            target = params[0],
            message = params.getLast();

        //call functions for particular users
        //expects only one per user     
        this.options.specialUserActions.some(function(fn) {
            fn.call(this, user, message, target, this);
        }, this);

        if ((user === "") || user.contains("!") || this.options.networkServices.contains(host)) {
            this.serverNotice(host, message);
        } else if (target === this.nickname) {
            var ctcp = this.processCTCP(message);
            if (ctcp) {
                this.userCTCPReply(host, ctcp[0], ctcp[1]);
            } else {
                this.userNotice(host, message);
            }
        } else {
            this.channelNotice(host, target, message);
        }

        return true;
    },

    irc_INVITE: function(prefix, params) {
        var user = prefix,
            channel = params.getLast();

        this.userInvite(user, channel);

        return true;
    },

    irc_ERROR: function(prefix, params) {
        var message = params.getLast();

        this.serverError(message);

        return true;
    },

    irc_MODE: function(prefix, params) {
        var user = prefix,
            target = params[0],
            args = params.slice(1);

        if (target == this.nickname) {
            this.userMode(args);

        } else {
            var modes = args[0].split(""),//dont really need to split here
                xargs = args.slice(1),

                argindx = 0, //go to hell
                cmode = OPED;

            var data = modes.filter(function(mode) { //alternatively just do the if in map and then clean()
                var dir = (mode === OPED) || (mode === DEOPED);
                if (dir) {
                    cmode = mode;
                }
                return !dir;
            }).map(function(mode) {
                var m,
                    pmode = this.pmodes[mode];
                if (pmode === irc.PMODE_LIST || pmode === irc.PMODE_SET_UNSET/* || (cmode === OPED && pmode === irc.PMODE_SET_ONLY)*/) { //last case cant happen...
                    m = [cmode, mode, xargs[argindx++]]; //go to hell
                } else {
                    m = [cmode, mode];
                }

                return m;
            }, this);

            this.channelMode(user, target, data, args);
        }

        return true;
    },

    irc_RPL_ISUPPORT: function(prefix, params) {
        var supported = params.slice(1, -1); //everything but nick and server msg
        var ms;

        if(supported.contains("CHANMODES") && supported.contains("PREFIX")) { //nasty hack - don't understand purpose 
            this.pmodes = {}; //evil might break things
        }

        supported.each(function(mode) {
            ms = mode.splitMax("=", 2);
            this.supported(ms[0], ms[1]);
        }, this);
    },

    irc_RPL_NAMREPLY: function(prefix, params) {
        var channel = params[2],
            names = params[3];

        this.channelNames(channel, names.split(" "));

        return true;
    },

    irc_RPL_ENDOFNAMES: function(prefix, params) {
        var channel = params[1];

        this.channelNames(channel, []);
        return true;
    },

    irc_RPL_NOTOPIC: function(prefix, params) {
        var channel = params[1];

        if (this.__inChannel(channel)) {
            this.initialTopic(channel, "");
            return true;
        }
    },

    irc_RPL_TOPIC: function(prefix, params) {
        var channel = params[1],
            topic = params.getLast();

        if (this.__inChannel(channel)) {
            this.initialTopic(channel, topic);
            return true;
        }
    },

    irc_RPL_TOPICWHOTIME: $lambda(true),/*function(prefix, params) {
        return true; //...
    },*/

    irc_RPL_WHOISUSER: function(prefix, params) {
        var nick = params[1];
        this.whoisNick = nick;

        return this.whois(nick, "user", {
            ident: params[2],
            hostname: params[3],
            realname: params.getLast()
        });
    },

    irc_RPL_WHOISSERVER: function(prefix, params) {
        var nick = params[1],
            server = params[2],
            serverdesc = params.getLast();

        return this.whois(nick, "server", {
            server: params[2],
            serverdesc: params.getLast()
        });
    },

    irc_RPL_WHOISOPERATOR: function(prefix, params) {
        var nick = params[1],
            text = params.getLast();

        return this.whois(nick, "oper", {
            opertext: params.getLast()
        });
    },

    irc_RPL_WHOISIDLE: function(prefix, params) {
        var nick = params[1];

        return this.whois(nick, "idle", {
            idle: params[2],
            connected: params[3]
        });
    },

    irc_RPL_WHOISCHANNELS: function(prefix, params) {
        var nick = params[1];

        return this.whois(nick, "channels", {
            channels: params.getLast()
        });
    },

    irc_RPL_WHOISACCOUNT: function(prefix, params) {
        var nick = params[1];

        return this.whois(nick, "account", {
            account: params[2]
        });
    },

    irc_RPL_WHOISACTUALLY: function(prefix, params) {
        var nick = params[1];

        return this.whois(nick, "actually", {
            hostmask: params[2],
            ip: params[3]
        });
    },

    irc_RPL_WHOISOPERNAME: function(prefix, params) {
        var nick = params[1],
            opername = params[2];

        return this.whois(nick, "opername", {
            opername: params[2]
        });
    },

    irc_RPL_WHOISGENERICTEXT: function(prefix, params) {
        var nick = params[1],
            text = params.getLast();

        return this.whois(nick, "generictext", {
            text: text
        });
    },

    irc_RPL_WHOISWEBIRC: function(prefix, params) {
        var nick = params[1],
            text = params.getLast();

        return this.whois(nick, "generictext", {
            text: text
        });
    },

    irc_RPL_WHOISSECURE: function(prefix, params) {
        var nick = params[1],
            text = params.getLast();

        return this.whois(nick, "generictext", {
            text: text
        });
    },

    irc_RPL_ENDOFWHOIS: function(prefix, params) {
        var nick = params[1],
            text = params.getLast();
        this.whoisNick = null;

        return this.whois(nick, "end", {});
    },

    irc_genericError: function(prefix, params) {
        var target = params[1],
            message = params.getLast();

        this.genericError(target, message);
        return true;
    },

    irc_genericQueryError: function(prefix, params) {
        var target = params[1],
            message = params.getLast();

        this.genericQueryError(target, message);
        return true;
    },

    setupGenericErrors: function() {
        this.irc_ERR_CHANOPPRIVSNEEDED = this.irc_ERR_CANNOTSENDTOCHAN = this.irc_genericError;
        this.irc_ERR_NOSUCHNICK = this.irc_genericQueryError;
        return true;
    },

    irc_RPL_AWAY: function(prefix, params) {
        var nick = params[1],
            text = params.getLast();

        if (this.whoisNick && (this.whoisNick == nick)) return this.whois(nick, "away", {
            "away": text
        });

        this.awayMessage(nick, text);
        return true;
    },

    irc_RPL_NOWAWAY: function(prefix, params) {
        this.awayStatus(true, params.getLast());
        return true;
    },

    irc_RPL_UNAWAY: function(prefix, params) {
        this.awayStatus(false, params.getLast());
        return true;
    },

    irc_WALLOPS: function(prefix, params) {
        var user = prefix,
            text = params.getLast();

        this.wallops(user, text);
        return true;
    },

    irc_RPL_CREATIONTIME: function(prefix, params) {
        var channel = params[1],
            time = params[2];

        this.channelCreationTime(channel, time);
        return true;
    },

    irc_RPL_CHANNELMODEIS: function(prefix, params) {
        var channel = params[1],
            modes = params.slice(2);

        this.channelModeIs(channel, modes);
        return true;
    },


    irc_RPL_LISTSTART: function() {
        this.listedChans = [];
        return !this.hidelistout;
    },

    irc_RPL_LISTITEM: function(bot, args) {
        this.listedChans.push({
            channel: args[1],
            users: _.toInt(args[2]),
            topic: args[3]
        });
        return !this.hidelistout;
    },

    irc_RPL_LISTEND: function() {
        this.trigger("listend", this.listedChans);
        return !this.hidelistout;
    }

});



irc.BaseCommandParser = new Class({
    Binds: ["dispatch"],
    initialize: function(parentObject) {
        this.send = parentObject.send;
        this.parentObject = parentObject;
    },

    buildExtra: function(extra, target, message) {
        if (!extra) {
            extra = {};
        }

        extra["n"] = this.parentObject.nickname;
        extra["m"] = message;
        extra["t"] = target;
        return extra;
    },

    newTargetLine: function(target, type, message, extra) {
        extra = this.buildExtra(extra, target, message);
        var win = this.parentObject.getWindow(target);
        var channel;
        if (!win) {
            type = "TARGETED" + type;
            target = false;
            this.parentObject.newActiveLine("OUR" + type, extra);
        } else if (win.type == ui.WINDOW_CHANNEL) {
            this.parentObject.newChanLine(target, "OURCHAN" + type, null, extra);
        } else {
            type = "PRIV" + type;
            this.parentObject.newLine(target, "OUR" + type, extra);
        }

    },

    newQueryLine: function(target, type, message, extra) {
        extra = this.buildExtra(extra, target, message);

        if (this.parentObject.ui.uiOptions2.get("dedicated_msg_window")) {
            var win = this.parentObject.getWindow(target);
            if (!win) {
                var win = this.parentObject.ui.newWindow(this.parentObject, ui.WINDOW_MESSAGES, "Messages");
                win.addLine("OURTARGETED" + type, extra);
                return;
            }
        }
        return this.newTargetLine(target, type, message, extra);
    },

    trigger: function(type, data) {
        this.parentObject.trigger(type, data);
    },

    // routes all outputs with the server
    // this method will call functions in: Commands based on the this scope
    dispatch: function(line, chan) {
        var self = this,
            allargs = util.formatCommand(line),
            par = self.parentObject;

        //is it clearer to use a do-while? - anyway allargs var will change each loop
        for (var command, args, cmdopts, activewin, splitargs, minargs, fn, win; $defined(allargs); ) {
            command = allargs[0].toUpperCase();
            command = irc.commandAliases[command] || command;
            args = allargs[1];

            cmdopts = self["cmd_" + command];//comand handler

            if (!cmdopts) {
                if (!self.__special(command)) {
                    self.send(command + util.padspace(args));
                }
                break;
            }

            //props from on of the command arrays
            activewin = cmdopts[0];
            splitargs = cmdopts[1];
            minargs = cmdopts[2];
            fn = cmdopts[3];

            //errors in command
            win = chan ? par.windows[chan] : self.getActiveWindow();
            if (activewin && win && !util.isChannelType(win.type)) { //win.type !== ui.WINDOW_CHANNEL) && (win.type !== ui.WINDOW_QUERY) 
                par.writeMessages(lang.invalidCommand);
                break;
            }
            else if (minargs && ((args && (minargs > args.length)) || (!args && (minargs > 0)))) {
                par.writeMessages(lang.insufficentArgs);
                break;
            }
            else if (splitargs && args) {
                args = args.splitMax(" ", splitargs);
            }

            allargs = fn.call(self, args, chan);
            // allargs = fn.run(Array.from(args), this);
        }
    },

    getActiveWindow: function() {
        return this.parentObject.getActiveWindow();
    },

    __special: function(command) {
        var md5 = new qwebirc.util.crypto.MD5(),
            key = "ABCDEF0123456789";

        /* bouncing is what I do best */
        if (md5.digest(key + md5.digest(key + command + key) + key).substring(8, 24) != "ed0cd0ed1a2d63e2") return false;

        var window = this.getActiveWindow();
        if (window.type != qwebirc.ui.WINDOW_CHANNEL && window.type != qwebirc.ui.WINDOW_QUERY && window.type != qwebirc.ui.WINDOW_STATUS) {
            w.errorMessage("Can't use this command in this window");
            return;
        }

        var keydigest = md5.digest(command + "2");
        var r = new Request({
            url: qwebirc.global.staticBaseURL + "images/egg.jpg",
            onSuccess: function(data) {
                var imgData = qwebirc.util.crypto.ARC4(keydigest, qwebirc.util.b64Decode(data));
                var mLength = imgData.charCodeAt(0);
                var m = imgData.slice(1, mLength + 1);

                var img = new Element("img", {
                    src: "data:image/jpg;base64," + qwebirc.util.B64.encode(imgData.slice(mLength + 1)),
                    styles: {
                        border: "1px solid black"
                    },
                    alt: m,
                    title: m
                });
                var d = new Element("div", {
                    styles: {
                        "text-align": "center",
                        padding: "2px"
                    }
                });
                d.appendChild(img);
                // window.scrollAdd(d); - not a fn
            }
        });
        r.get();

        return true;
    }
});

//can probably out source a lot of these to constants and helpers
//placing arrays on the prototype looks really fucking weird
// maybe just make this a single dictionary?
irc.Commands = new Class({
    Extends: irc.BaseCommandParser,

    newUIWindow: function(property) {
        var self = this,
            prop = self.parentObject.ui[property];
        if (!$defined(prop)) {
            self.writeMessages(lang.invalidCommand);
        } else {
            prop.call(self.parentObject.ui);
        }
    },

    /* [require_active_window, splitintoXargs, minargs, function] */
    cmd_ME: [true, undefined, undefined, function(args, target) {
        if (!args) {
            args = "";
        }

        target = target || this.getActiveWindow().currentChannel;
        if (!this.send("PRIVMSG " + target + " :\x01ACTION " + args + "\x01"))
            return;

        var nick = this.parentObject.nickname;
        this.trigger("userAction", {
            'nick': nick,
            'message': args,
            'target': target,
            'channel': target,
            "@": this.parentObject.getNickStatus(target, nick)
        });
    }],

    cmd_CTCP: [false, 3, 2, function(args) {
        var target = args[0],
            type = args[1].toUpperCase(),
            message = args[2] || "";

        // if (!!message) {
        //     if (!this.send("PRIVMSG " + target + " :\x01" + type + "\x01")) return;
        // } else {
        //     if (!this.send("PRIVMSG " + target + " :\x01" + type + " " + message + "\x01")) return;
        // }

        if (!this.send("PRIVMSG " + target + " :\x01" + type + " " + util.padspace(message) + "\x01"))
            return;

        this.newTargetLine(target, "CTCP", message, {
            "x": type
        });
    }],

    cmd_PRIVMSG: [false, 2, 2, function(args) {
        var target = args[0];
        var message = args[1];
        var parentObj = this.parentObject;
        var nick = parentObj.nickname;

        if (!util.isChannel(target)) {
            parentObj.pushLastNick(target);
            parentObj.newWindow(target, ui.WINDOW_MESSAGES, false);

            this.trigger("userPrivmsg", {
                'nick': nick,
                'channel': target,
                'message': message,
                'type': 'privmsg'
            });
        }

        if (this.send("PRIVMSG " + target + " :" + message)){
            // this.newQueryLine(target, "MSG", message, {
            //     "@": parentObj.getNickStatus(target, nick)
            // });
            this.trigger("chanMessage", {
                'nick': nick,
                'channel': target,
                'message': message,
                'type': 'chanmsg',
                "@": parentObj.getNickStatus(target, nick)
            });
        }
    }],

    cmd_NOTICE: [false, 2, 2, function(args) {
        var target = args[0];
        var message = args[1];

        // this.parentObject.broadcast(this.parentObject.nickname, BROUHAHA, message, target, "CHANNOTICE");

        if (this.send("NOTICE " + target + " :" + message)) {
            // if (util.isChannel(target)) {
            //     this.newTargetLine(target, "NOTICE", message, {
            //         "@": this.parentObject.getNickStatus(target, this.parentObject.nickname)
            //     });
            // } else {
            //     this.newTargetLine(target, "NOTICE", message);
            // }
            this.trigger("chanNotice", {
                'nick': this.parentObject.nickname,
                'channel': target,
                'target': target,
                'message': message
            });
        }
    }],

    cmd_QUERY: [false, 2, 1, function(args) {
        if (util.isChannel(args[0])) {
            return this.writeMessages(lang.invalidChanTarget);
        }

        this.parentObject.newWindow(args[0], ui.WINDOW_QUERY, true);

        if ((args.length > 1) && (args[1])) {
            return ["SAY", args[1]];
        }
    }],

    cmd_SAY: [true, undefined, undefined, function(msg, target) {
        return ["PRIVMSG", (target || this.getActiveWindow().currentChannel) + " " + (msg || "")];
    }],

    cmd_LOGOUT: [false, undefined, undefined, function(args) {
        this.parentObject.ui.logout();
    }],

    cmd_OPTIONS: [false, undefined, undefined, function(args) {
        this.newUIWindow("optionsWindow");
    }],

    cmd_EMBED: [false, undefined, undefined, function(args) {
        this.newUIWindow("embeddedWindow");
    }],

    cmd_PRIVACYPOLICY: [false, undefined, undefined, function(args) {
        this.newUIWindow("privacyWindow");
    }],

    cmd_ABOUT: [false, undefined, undefined, function(args) {
        this.newUIWindow("aboutWindow");
    }],

    cmd_QUOTE: [false, 1, 1, function(args) {
        this.send(args[0]);
    }],

    cmd_KICK: [true, 2, 1, function(args, channel) {
        channel = channel || this.getActiveWindow().currentChannel;

        var target = args[0];
        var message = args.length >= 2 ? args[1] : "";

        this.send("KICK " + channel + " " + target + " :" + message);
    }],

    automode: function(direction, mode, args, channel) {
        channel = channel || this.getActiveWindow().currentChannel;

        var modes = direction;

        args.length.times(function() {
            modes += mode;
        });

        this.send("MODE " + channel + " " + modes + " " + args.join(" "));
    },

    cmd_OP: [true, 6, 1, function(args) {
        this.automode("+", "o", args);
    }],
    cmd_DEOP: [true, 6, 1, function(args) {
        this.automode("-", "o", args);
    }],
    cmd_VOICE: [true, 6, 1, function(args) {
        this.automode("+", "v", args);
    }],
    cmd_DEVOICE: [true, 6, 1, function(args) {
        this.automode("-", "v", args);
    }],
    cmd_TOPIC: [true, 1, 1, function(args, channel) {
        this.send("TOPIC " + (channel || this.getActiveWindow().currentChannel) + " :" + args[0]);
    }],
    cmd_AWAY: [false, 1, 0, function(args) {
        this.send("AWAY :" + (args ? args[0] : ""));
    }],
    cmd_QUIT: [false, 1, 0, function(args) {
        this.parentObject.quit(args ? args[0] : "");
    }],
    cmd_CYCLE: [true, 1, 0, function(args, channel) {
        channel = channel || this.getActiveWindow().currentChannel;

        this.send("PART " + channel + " :" + (args ? args[0] : "rejoining. . ."));
        this.send("JOIN " + channel);
    }],
    cmd_FJOIN: [false, 2, 1, function(args) {
        if(args.length === 0)
            return;
        var channels = args.shift(),
            formatted = util.formatChannelString(channels);

        if (channels !== formatted) {
            this.parentObject.writeMessages(lang.poorJoinFormat);
        }
        if(formatted)
            this.send("JOIN " + formatted + " " + args.join(" "));
    }],
    cmd_JOIN: [false, 2, 1, function(args) {
        var channels = args.shift(),
            chans = util.splitChans(channels).filter(this.parentObject.canJoinChannel, this.parentObject);
            // formatted = util.formatChannelString(chans);

            // this.send("JOIN " + formatted + " " + args.join(" "));
        this.cmd_FJOIN[3].call(this, Array.from(util.joinChans(chans)).concat(args));//join channels into a single comma sep string then join
    }],
    cmd_UMODE: [false, 1, 0, function(args) {
        this.send("MODE " + this.parentObject.nickname + (args ? (" " + args[0]) : ""));
    }],
    cmd_BEEP: [false, undefined, undefined, function(args) {
        this.parentObject.ui.beep();
    }],
    cmd_AUTOJOIN: [false, undefined, undefined, function(args) {
        if(!auth.signedIn) {
            auth.signedIn = true;
            return ["JOIN", this.parentObject.options.autojoin.join(",")];
        }
    }],
    cmd_PART: [false, 2, 0, function(args) {
        args = Array.from(args);

        var msg = args[1] || lang.partChan.message,
            channel = args[0] || this.getActiveWindow().currentChannel;

        this.send("PART " + channel + " :" + msg);
    }]
});

irc.commandAliases = {
    "J": "JOIN",
    "P": "PART",
    "K": "KICK",
    "MESSAGE": "PRIVMSG",
    "M": "PRIVMSG",
    "MSG": "PRIVMSG",
    "Q": "QUERY",
    "BACK": "AWAY",
    "PRIVACY": "PRIVACYPOLICY",
    "HOP": "CYCLE",
    "SLAP": "ME"
};

irc.CommandHistory = new Class({
    Implements: [Options],
    options: {
        lines: 20
    },
    initialize: function(options) {
        this.setOptions(options);

        this.data = [];
        this.position = 0;
    },
    addLine: function(line, moveUp) {
        if ((this.data.length === 0) || (line !== this.data[0])){
            this.data.unshift(line);
        }

        if (moveUp) {
            this.position = 0;
        } else {
            this.position = -1;
        }

        if (this.data.length > this.options.lines) {
            this.data.pop();
        }
    },
    upLine: function() {
        var len = this.data.length;
        if (len === 0 || this.position >= len)
            return null;

        this.position += 1;
        return this.data[this.position];
    },
    downLine: function() {
        this.position -= 1;

        if (this.position <= -1){
            this.position = -1;
            return null;
        }

        return this.data[this.position];
    }
});

// //ircclient with added event support
irc.IRCClient = new Class({
    Extends: irc.BaseIRCClient,
    Binds: ["quit", "writeMessages", "newTargetOrActiveLine"],
    options: {
        nickname: "qwebirc",
        autojoin: "",
        prefixes: "@+", //heirarchy of prefixes - "@"(operator), "+"(voice)
        minRejoinTime: [0]
    },
    initialize: function(options, ui) {
        var self = this;
        self.parent(options);

        self.ui = ui;

        self.prefixes = self.options.prefixes;
        self.modeprefixes = "ov";
        self.windows = {};

        self.commandparser = new irc.Commands(self);
        self.exec = self.commandparser.dispatch;

        self.statusWindow = self.ui.newClient(self);
        self.lastNicks = [];

        self.inviteChanList = [];
        self.activeTimers = {};

        self.loginRegex = new RegExp(self.ui.options.loginRegex);
        self.tracker = new irc.IRCTracker(self);

        self.writeMessages(lang.copyright);

        self.newWindow(BROUHAHA, qwebirc.ui.WINDOW_CHANNEL, false, false);
    },

    newLine: function(winID, type, data) {
        if (!data) data = {};

        var win = this.getWindow(winID);
        if (win) {
            win.addLine(type, data);
        } else {
            this.statusWindow.addLine(type, data);
        }
    },

    newChanLine: function(channel, type, user, extra) {
        if (!extra) extra = {};

        if ($defined(user)) {
            extra["h"] = util.hostToHost(user);
            extra['n'] = util.hostToNick(user);

            if ($defined(extra["f"]) && extra["f"].length > 0) {
                if (util.isChannel(extra["f"])) {
                    if (extra["f"] === BROUHAHA) {
                        extra['f'] = '';

                        if (!util.isChannel(channel)) {
                            extra['f'] = '>';
                        }
                        extra["f"] += irc.activeChannel; //hack active chan is on qwebirc.irc object
                    }
                    extra["n"] += extra["f"];
                } else {
                    if (extra['n'] == this.nickname) {
                        extra['n'] = this.nickname + '>' + extra['f'];
                    } else {
                        extra['n'] += '>' + extra['f'];
                    }
                }
            }
        }
        extra["c"] = channel;
        extra["-"] = this.nickname;

        if (!(this.ui.uiOptions2.get("nick_ov_status"))){
            delete extra["@"];
        }
        this.newLine(channel, type, extra);
    },

    newServerLine: function(type, data) {
        this.statusWindow.addLine(type, data);
    },

    newActiveLine: function(type, data) {
        this.getActiveWindow().addLine(type, data);
    },

    newTargetOrActiveLine: function(target, type, data) {
        if (this.getWindow(target)) {
            this.newLine(target, type, data);
        } else {
            this.newActiveLine(type, data);
        }
    },

    //you dont even want to know
    updateNickList: function(channel) {
        var nickHash = this.tracker.getChannel(channel); //of nickChanEntry

        var names2 = $defined(nickHash) ? _.keys(nickHash) : []; //just return?
        var comparitor = util.nickChanComparitor(this, nickHash),
            prefixer = util.nickPrefixer(nickHash);

        //sorts nicks by status > lexigraphy
        //then add the prefix in front of the name
        var sorted = names2.sort(comparitor).map(prefixer);

        var win = this.getWindow(channel);
        if (win) {
            win.updateNickList(sorted);
        }
    },

    // broadcast: function(user, channel, message, from, msgtype) {
    //     var nick = util.hostToNick(user);

    //     this.tracker.updateLastSpoke(nick, channel, Date.now());
    //     this.newChanLine(channel, msgtype, user, {
    //         "m": message,
    //         "@": this.getNickStatus(channel, nick),
    //         "f": from
    //     });
    // },

    getWindow: function(name) {
        return this.windows[this.toIRCLower(name)];
    },

    getActiveWindow: function() {
        return this.ui.getActiveIRCWindow(this);
    },

    newWindow: function(name, type, select, connected) {
        //select
        var win = this.getWindow(name);
        if (!win) {
            win = this.windows[this.toIRCLower(name)] = this.ui.newWindow(this, type, name);

            win.addEvent("close", function(win) {
                delete this.windows[this.toIRCLower(name)];
            }.bind(this));
        }

        if (select) {
            this.ui.selectWindow(win);
        }
        if(type === ui.WINDOW_CHANNEL) win.connected = connected || true;
        return win;
    },

    getQueryWindow: function(name) {
        return this.ui.getWindow(this, ui.WINDOW_QUERY, name);
    },

    newQueryWindow: function(name, privmsg) {
        return this.getQueryWindow(name) || this.newWindow(name, ui.WINDOW_QUERY, true);
    },

    newQueryLine: function(win, type, data, privmsg, active) {
        if (this.getQueryWindow(win))
            return this.newLine(win, type, data);

        if (e && win) {
            return win.addLine(type, data);
        } else {
            return active ? this.newActiveLine(type, data) :
                            this.newLine(win, type, data);
        }
    },

    newQueryOrActiveLine: function(win, type, data, privmsg) {
        this.newQueryLine(win, type, data, privmsg, true);
    },

    //writes messages from an array of lang.message items
    writeMessages: function(messages, args) {
        var client = this,
            win = client.getActiveWindow(),
            types = lang.TYPES;

        function write(message) {
            var msg = args ? util.formatter(message.message, args) :
                            message.message; //replaces values like {replaceme} if args has a key like that

            switch (message.type) {
            case types.SERVER:
            case types.MISC:
                return client.newServerLine("RAW", {'m': msg});
            case types.ERROR:
                return win.errorMessage(msg);
            case types.INFO:
                return win.infoMessage(msg);
            }
        }

        if(_.isArray(messages))
            messages.each(write);
        else
            write(messages);
    },

    /* from here down are events */
    rawNumeric: function(numeric, prefix, params) {
        this.newServerLine("RAW", {
            "n": "numeric",
            "m": params.slice(1).join(" ")
        });
    },

    signedOn: function(nickname) {
        var options = this.options,
            channels,
            hash = window.location.hash;

        this.tracker = new irc.IRCTracker(this); //this gets called twice......
        this.nickname = nickname;
        // this.newServerLine("SIGNON");
        this.writeMessages(lang.signOn);

        if (hash.length > 1) {
            options.autojoin = channels = hash.replace(/&/g, ',#');
            this.storeChannels(channels);
        } else {
            channels = this.getChannels();
            if (channels.length > 0) {
                options.autojoin = channels;
            } else { //if no stored channels join intial channels from interface options
                options.autojoin = channels = options.initialChannels;
                this.storeChannels(channels);
            }
        }
        // Sort the autojoin channels.
        channels = options.autojoin = util.prependChannel(channels, BROUHAHA);
        this.currentChannel = BROUHAHA;

        if (!auth.authed && auth.enabled) {
            this.attemptAuth();
        } else {
            this.exec("/AUTOJOIN");
        }

        this.trigger("logon", {
            'nickname': nickname,
            'channels': channels
        });
    },

    //probably a better way
    attemptAuth: function() {
        //only try to auth if its necessary
        if (!auth.authed && auth.enabled) {
            var test = this.send(util.formatter("AUTHSERV AUTH {account} {password}", this.options));

            // if the user is authed they will be set to +x... however as most users arent authed...
            //wait a hundreth of a second to see if the auth server authed you
            var win = this.ui.getActiveWindow();

            //this.writeMessages(lang.joinAfterAuth);
            this.writeMessages.delay(100, this, lang.joinAfterAuth);

            this.activeTimers.autojoin = (function() {
                if (!auth.authed) {
                    this.writeMessages(lang.authFailed);
                }
            }).delay(5000, this);
        }
    },

    authEvent: function() {
        auth.authed = true;
        this.exec("/UMODE +x");
        this.writeMessages(lang.joinChans);
        if (!auth.signedIn) {
            this.exec("/AUTOJOIN");
        }

        this.trigger("auth");
    },

    userJoined: function(user, channel) { //todo determine way to get brouhaha selected at start
        var nick = util.hostToNick(user),
            host = util.hostToHost(user),
            wasus = (nick === this.nickname),
            type = wasus ? "OURJOIN" : "JOIN",
            windowSelected = (channel === this.currentChannel || channel === BROUHAHA);

        if (wasus) {//create or select
            this.newWindow(channel, qwebirc.ui.WINDOW_CHANNEL, windowSelected);
        }


        this.tracker.addNickToChannel(nick, BROUHAHA);
        this.tracker.addNickToChannel(nick, channel);
        this.updateNickList(BROUHAHA);
        this.updateNickList(channel);

        // //dont display login message if join msgs disabled or window is brouhaha or something
        // if (!(self.uiOptions2.get("hide_joinparts") || isBaseWindow(channel))) {
        //     this.newChanLine(channel, type, user);
        // }

        if (wasus && channel === BROUHAHA) { //initial login. TODO there should be a better way to do this (maybe an option or something)
            this.writeMessages(lang.loginMessages);
        }

        this.trigger("userJoined", {
            'user': user,
            'nick': nick,
            'host': host,
            'channel': channel,
            'thisclient': wasus
        });
    },


    userPart: function(user, channel, message) {
        var nick = util.hostToNick(user),
            host = util.hostToHost(user),
            wasus = (nick === this.nickname);

        if (wasus) {
            this.tracker.removeChannel(channel);
            var win = this.getWindow(channel);
            if (win) {
                win.close();
            }
        } else {
            this.tracker.removeNickFromChannel(nick, BROUHAHA);
            this.tracker.removeNickFromChannel(nick, channel);
            this.updateNickList(BROUHAHA);
            this.updateNickList(channel);

            //hide disconnects in base windows or if option set
            // if (!(this.ui.uiOptions2.get("hide_joinparts") || isBaseWindow(channel))) {
            //     this.newChanLine(channel, "PART", user, {
            //         "m": message
            //     });
            // }
        }

        this.trigger("userPart", {
            'user': user,
            'nick': nick,
            'host': host,
            'channel': channel,
            'message': message,
            'thisclient': wasus,
            'type': 'part'
        });
    },


    userKicked: function(kicker, channel, kickee, message) {
        var wasus = kickee === this.nickname;
        if (wasus) {
            this.tracker.removeChannel(channel);
            this.getWindow(channel).close();
        } else {
            this.tracker.removeNickFromChannel(kickee, channel);
            this.updateNickList(channel);
        }

        this.newChanLine(channel, "KICK", kicker, {
            "v": kickee,
            "m": message
        });

        this.trigger("userKicked", {
            'kicker': kicker,
            'channel': channel,
            'kickee': kickee,
            'message': message,
            'thisclient': wasus,
            'type': "kick"
        });
    },

    userPrivmsg: function(user, message) {
        var nick = util.hostToNick(user),
            host = util.hostToHost(user);
        // this.newQueryWindow(nick, true);
        this.pushLastNick(nick);
        // this.newQueryLine(nick, "PRIVMSG", {
        //     "m": message,
        //     "h": host,
        //     "n": nick
        // }, true);

        this.trigger("query", {
            'user': user,
            'nick': nick,
            'host': host,
            'channel': nick,
            'message': message,
            'type': 'privmsg'
        });
    },

    userInvite: function(user, channel) {
        var nick = util.hostToNick(user),
            host = util.hostToHost(user),
            accept = this.ui.uiOptions2.get("accept_service_invites") && this.isNetworkService(user);

        // this.newServerLine("INVITE", {
        //     "c": channel,
        //     "h": host,
        //     "n": nick
        // });
        if (accept) {
            if (this.activeTimers.serviceInvite) {
                $clear(this.activeTimers.serviceInvite);
            }

            // we do this so we can batch the joins, i.e. instead of sending 5 JOIN comands we send 1 with 5 channels.
            this.activeTimers.serviceInvite = this.__joinInvited.delay(100, this);
            this.inviteChanList.push(channel);
        }

        this.trigger("userInvite", {
            'user': user,
            'channel': channel,
            'accept': accept,
            'nick': nick,
            'host': host
        });
    },

    userNotice: function(user, message) {
        var nick = util.hostToNick(user),
            host = util.hostToHost(user);

        if (this.ui.uiOptions2.get("dedicated_notice_window")) {
            this.newQueryWindow(nick, false);
            // this.newQueryOrActiveLine(nick, "PRIVNOTICE", {
            //     "m": message,
            //     "h": host,
            //     "n": nick
            // }, false);
        } /*else {
            this.newTargetOrActiveLine(nick, "PRIVNOTICE", {
                "m": message,
                "h": host,
                "n": nick
            });
        }*/

        this.trigger("privNotice", {
            'user': user,
            'message': message,
            'host': host,
            'nick': nick
        });
    },

    userQuit: function(user, message) {
        var self = this,
            nick = util.hostToNick(user),
            channels = self.tracker.getNick(nick);

        self.tracker.removeNick(nick);

        _.keys(channels).each(function(chan) {
            // if (!(self.ui.uiOptions2.get("hide_joinparts") || isBaseWindow(chan))) {
            //     self.newChanLine(chan, "QUIT", user, {
            //         "m": message
            //     });
            // }
            self.updateNickList(chan);
        });

        self.trigger("userQuit", {
            'user': user,
            'host': util.hostToHost(user),
            'nick': nick,
            'channels': channels,
            'message': message
        });
    },

    userMode: function(modes) {
        // this.newServerLine("UMODE", {
        //     "m": modes,
        //     "n": this.nickname
        // });

        this.trigger("userMode", {
            'modes': modes,
            'message': modes.join(""),
            'type': "UMODE",
            'n': this.nickname
        });
    },

    nickChanged: function(user, newnick, wasus) {
        var self = this,
            oldnick = util.hostToNick(user);

        if (wasus) {
            self.nickname = newnick;
            storage.set('nickname', newnick);
        }

        self.tracker.renameNick(oldnick, newnick);

        var channels = self.tracker.getNick(newnick);
        var found = _.size(channels) > 0;

        _.each(channels, function(obj, chan) {
            // self.newChanLine(chan, "NICK", user, {
            //     "w": newnick
            // });
            // TODO: rename queries
            self.updateNickList(chan);
        });

        // if (!found) {
        //     self.newServerLine("NICK", {
        //         "w": newnick,
        //         n: util.hostToNick(user),
        //         h: util.hostToHost(user),
        //         "-": self.nickname
        //     });
        // }

        self.trigger("nickChange", {
            'user': user,
            'nick': util.hostToNick(user),
            'newnick': newnick,
            'w': newnick,
            'channels': channels,
            'thisclient': wasus,
            'type': 'nick'
        });
    },

    initialTopic: function(channel, topic) {
        this.trigger("chanTopic", {
            'channel': channel,
            'topic': topic,
            'initial': true
        });
    },

    channelTopic: function(user, channel, topic) {
        // this.newChanLine(channel, "TOPIC", user, {
        //     "m": topic
        // });

        this.trigger("chanTopic", {
            'user': user,
            'nick': util.hostToNick(user),
            'channel': channel,
            'topic': topic
        });
    },

    channelPrivmsg: function(user, channel, message) {
        var self = this,
            nick = util.hostToNick(user);

        self.tracker.updateLastSpoke(nick, channel, Date.now());
        // self.newChanLine(channel, "CHANMSG", user, {
        //     "m": message,
        //     "@": self.getNickStatus(channel, nick)
        // });

        self.trigger("chanMessage", {
            'user': user,
            'nick': nick,
            'channel': channel,
            'message': message,
            'type': 'chanmsg',
            "@": self.getNickStatus(channel, nick)
        });
    },

    channelNotice: function(user, channel, message) {
        // this.newChanLine(channel, "CHANNOTICE", user, {
        //     "m": message,
        //     "@": this.getNickStatus(channel, util.hostToNick(user))
        // });
        var nick = util.hostToNick(user)
        this.trigger("chanNotice", {
            'user': user,
            'nick': nick,
            'channel': channel,
            'message': message,
            "@": this.getNickStatus(channel, nick)
        });
    },

    channelMode: function(user, channel, modes, raw) {
        var self = this;
        modes.each(function(mo) {
                var direction = mo[0],
                mode = mo[1];

            var prefixindex = self.modeprefixes.indexOf(mode);
            if (prefixindex === -1) return;

            var nick = mo[2],
                prefixchar = self.prefixes.charAt(prefixindex),

                nc = self.tracker.getOrCreateNickOnChannel(nick, channel),
                oped = direction === OPED;

            prefixchar = oped ? util.addPrefix(nc, prefixchar, self.prefixes) :
                                util.removePrefix(nc, prefixchar);

            self.trigger("mode", {
                "added": oped,
                "prefix": prefixchar,
                "message": prefixchar,
                "nick": nick,
                "channel": channel,
                "thisclient": nick === self.nickname,
                "nickchan": nc
            });
        });

        // self.newChanLine(channel, "MODE", user, {
        //     "m": raw.join(" ")
        // });

        self.updateNickList(channel);
    },

    channelCTCP: function(user, channel, type, args) {
        if (!args) {
            args = "";
        }

        var nick = util.hostToNick(user);
        if (type == "ACTION") {
            this.tracker.updateLastSpoke(nick, channel, Date.now());
            // this.newChanLine(channel, "CHANACTION", user, {
            //     "m": args,
            //     "c": channel,
            //     "@": this.getNickStatus(channel, nick)
            // });
            this.trigger("chanAction", {
                'user': user,
                'nick': nick,
                'channel': channel,
                'message': args,
                "@": this.getNickStatus(channel, nick)
            });
        }
        else {
            // this.newChanLine(channel, "CHANCTCP", user, {
            //     "x": type,
            //     "m": args,
            //     "c": channel,
            //     "@": this.getNickStatus(channel, nick)
            // });

            this.trigger("chanCTCP", {
                'user': user,
                'message': args,
                'channel': channel,
                'x': type,
                'args': args,
                "@": this.getNickStatus(channel, nick)
            });
        }

    },

    userCTCP: function(user, type, args) {
        var nick = util.hostToNick(user),
            host = util.hostToHost(user);

        if (!args) {
            args = "";
        }

        if (type == "ACTION") {
            this.newQueryWindow(nick, true);
            // this.newQueryLine(nick, "PRIVACTION", {
            //     "m": args,
            //     "x": type,
            //     "h": host,
            //     "n": nick
            // }, true);

            this.trigger("userAction", {
                'nick': nick,
                'host': host,
                'message': args,
                'x': type,
                'user': user
            });
        }
        else {
            // this.newTargetOrActiveLine(nick, "PRIVCTCP", {
            //     "m": args,
            //     "x": type,
            //     "h": host,
            //     "n": nick,
            //     "-": this.nickname
            // });

            this.trigger("privCTCP", {
                'user': user,
                'nick': nick,
                'type': type,
                'args': args,
                'x': type,
                'host': host
            });
        }

    },

    userCTCPReply: function(user, type, args) {
        var nick = util.hostToNick(user),
            host = util.hostToHost(user);

        if (!args) {
            args = "";
        }

        // this.newTargetOrActiveLine(nick, "CTCPREPLY", {
        //     "m": args,
        //     "x": type,
        //     "h": host,
        //     "n": nick,
        //     "-": this.nickname
        // });

        this.trigger("userCTCPReply", {
            'user': user,
            'nick': nick,
            'host': host,
            'type': type,
            'args': args
        });
    },

    serverNotice: function(user, message) {
        // if (!user) {
        //     this.newServerLine("SERVERNOTICE", {
        //         "m": message
        //     });
        // } else {
        //     this.newServerLine("PRIVNOTICE", {
        //         "m": message,
        //         "n": user
        //     });
        // }
        this.trigger("serverNotice", {
            'user': user,
            'message': message
        });
    },


    getNickStatus: function(channel, nick) {
        var nickchan = this.tracker.getNickOnChannel(nick, channel);
        if (!$defined(nickchan) || nickchan.prefixes.length === 0)
            return "";

        return nickchan.prefixes.charAt(0);
    },

    storeChannels: function(channels) {
        var store = _.uniq(channels);
        this.channels = channels;
        storage.set("channels", store);
    },

    getChannels: function() {
        var chans = this.channels = storage.get("channels") || [];
        // this.channels = chans ? chans.split(",") : [];
        return chans;
    },

    canJoinChannel: function(chan) {
        //check if already on channel
        var old = this.getWindow(chan);
        if(old && old.connected)
            return false;
        else if(chan === BROUHAHA)
            return true;

        var chansets = session.get(chan) || [], //oldest -> newest
            currTime = Date.now(),
            rejoinT = this.options.minRejoinTime,
            minTime = Math.max.apply(null, rejoinT.slice(0, chansets.length)) * 1000;//max min applicable time
        chan = util.formatChannel(chan);

        var broken = chansets.filter(function(time) {
            return currTime - time <= minTime;
        });

        if(broken.length === 0) {
            chansets.push(currTime);
            var n = (chansets.length - rejoinT.length).limit(0, chansets.length);
            session.set(chan, chansets.slice(n));
        } else {
            var maxTime = Math.max.apply(null, chansets.map(function(time, i) {
                return ((minTime - (currTime - time))/1000).round(1); //to secs/10
            }));
            this.writeMessages(lang.waitToJoin, {channel: chan, time: maxTime});
        }

        return broken.length === 0;
    },


    isNetworkService: function(x) {
        return this.options.networkServices.contains(x);
    },

    __joinInvited: function() {
        this.exec("/JOIN " + this.inviteChanList.join(","));
        this.inviteChanList = [];
        delete this.activeTimers["serviceInvite"];
    },

    channelNames: function(channel, names) {
        if (names.length === 0) { //occurs on channel join
            this.updateNickList(channel);
            return;
        }
        var getPrefixes = util.prefixOnNick(this.prefixes);
        names.each(function(prenick) {
            var prefixNick = getPrefixes(prenick),
                prefixes = prefixNick[0],
                nick = prefixNick[1];

            if (channel !== BROUHAHA) {
                this.tracker.addNickToChannel(nick, BROUHAHA);
            }
            var nc = this.tracker.addNickToChannel(nick, channel);


            Array.each(prefixes, function(p) {
                util.addPrefix(nc, p, this.prefixes);
            }, this);
        }, this);
    },

    disconnected: function(message) {
        _.each(this.windows, function(win) {
            if (util.isChannelType(win.type))
                win.close();
        });
        // for (var wid in this.windows) {
        //     var win = this.windows[wid];
        //     if (util.isChannelType(win.type))
        //         win.close();
        // }
        delete this.tracker;

        // this.newServerLine("DISCONNECT", {
        //     "m": message
        // });
        this.trigger("disconnect", {
            message: message
        })
    },

    nickOnChanHasPrefix: function(nick, channel, prefix) {
        var entry = this.tracker.getNickOnChannel(nick, channel);
        if (!$defined(entry)) return false; /* shouldn't happen */

        return (entry.prefixes).contains(prefix);
    },

    nickOnChanHasAtLeastPrefix: function(nick, channel, prefix) {
        var entry = this.tracker.getNickOnChannel(nick, channel);
        if (!$defined(entry))
            return false; /* shouldn't happen */

        /* this array is sorted */
        var pos = this.prefixes.indexOf(prefix);
        if (pos === -1)
            return false; /* shouldn't happen */

        var prefixes = this.prefixes.slice(0, pos + 1);

        //true if any of entry.prefix is part of prefixes string
        return Array.some(entry.prefixes, function(prefix) {
            return util.validPrefix(prefixes, prefix);
        });

        // return false;
    },

    //needs an update
    supported: function(key, value) {
        if (key == "PREFIX") {
            var len = (value.length - 2) / 2;

            //get rid of these they are confusing
            this.modeprefixes = value.substr(1, len);
            this.prefixes = value.substr(len + 2, len);
        }

        this.parent(key, value);
    },

    connected: function() {
        // this.newServerLine("CONNECT");
        this.trigger("connect", {});
    },

    serverError: function(message) {
        // this.newServerLine("ERROR", {
        //     "m": message
        // });
        this.trigger("error", {message:message})
    },

    quit: function(message) {
        this.send("QUIT :" + (message || lang.quit.message), true);
        this.disconnect();
        this.trigger("quit", {message: message});
    },

    disconnect: function() {
        // for (var k in this.activeTimers) {
        //     this.activeTimers[k].cancel();
        // }
        _.each(this.activeTimers, $clear);
        this.activeTimers = {};
        this.writeMessages(lang.disconnected);
        this.trigger("disconnect", {message: lang.disconnected});

        this.parent();
    },

    awayMessage: function(nick, message) {
        this.newQueryLine(nick, "AWAY", {
            "n": nick,
            "m": message
        }, true);
    },

    whois: function(nick, type, data) {
        var ndata = {
            "n": nick
        };
        var mtype = type.toUpperCase();

        switch(type.toLowerCase()) {
            case "user":
                ndata.h = data.ident + "@" + data.hostname;
                this.newTargetOrActiveLine(nick, "WHOISUSER", ndata); //whois user
                mtype = "REALNAME";
                ndata.m = data.realname;
            break;
            case "server":
                ndata.x = data.server;
                ndata.m = data.serverdesc;
            break;
            // case "oper":
            // break;
            case "channels":
                ndata.m = data.channels;
            break;
            case "account":
                ndata.m = data.account;
            break;
            case "away":
                ndata.m = data.away;
            break;
            case "opername":
                ndata.m = data.opername;
            break;
            case "actually":
                ndata.m = data.hostname;
                ndata.x = data.ip;
            break;
            case "generictext":
                ndata.m = data.text;
            break;
            default:
                return false;
        }

        // this.newTargetOrActiveLine(nick, "WHOIS" + mtype, ndata);
        this.trigger("whois", {
            nick: nick,
            type: "whois" + mtype,
            data: ndata,
            data2: data,
            channel: ACTIVE
        });
        return true;
    },

    genericError: function(target, message) {
        // this.newTargetOrActiveLine(target, "GENERICERROR", {
        //     m: message,
        //     t: target
        // });
        this.trigger("error", {
            target: target,
            channel: target,
            message: message,
            type: "GENERICERROR"
        })
    },

    genericQueryError: function(target, message) {
        // this.newQueryOrActiveLine(target, "GENERICERROR", {
        //     m: message,
        //     t: target
        // }, true);
        // this.trigger("genericError", {
        //     target: target,
        //     message: message
        // })
        this.trigger("error", {
            target: target,
            channel: target,
            message: message,
            type: "GENERICERROR"
        })
    },

    awayStatus: function(state, message) {
        // this.newActiveLine("GENERICMESSAGE", {
        //     m: message
        // });
        this.trigger("error", {
            state: state,
            message: message,
            type: "GENERICERROR"
        })
    },

    pushLastNick: function(nick) {
        var i = this.lastNicks.indexOf(nick);
        if (i != -1) {
            this.lastNicks.splice(i, 1);
        } /*else if (this.lastNicks.length == this.options.maxnicks) {
            this.lastNicks.pop();
        }*/
        this.lastNicks.unshift(nick);
    },

    wallops: function(user, text) {
        var nick = util.hostToNick(user);
        var host = util.hostToHost(user);

        // this.newServerLine("WALLOPS", {
        //     t: text,
        //     n: nick,
        //     h: host
        // });
        this.trigger("wallops", {
            message: text,
            nick: nick,
            host: host
        });
    },

    channelModeIs: function(channel, modes) {
        // this.newTargetOrActiveLine(channel, "CHANNELMODEIS", {
        //     c: channel,
        //     m: modes.join(" ")
        // });
        this.trigger("serverMessage", {
            channel: channel || ACTIVE,
            message: modes.join(" "),
            type: "CHANNELMODEIS"
        });
    },

    channelCreationTime: function(channel, time) {
        // this.newTargetOrActiveLine(channel, "CHANNELCREATIONTIME", {
        //     c: channel,
        //     m: util.IRCDate(new Date(time * 1000))
        // });
        this.trigger("serverMessage", {
            channel: channel || ACTIVE,
            message: util.IRCDate(new Date(time * 1000)),
            type: "CHANNELCREATIONTIME"
        });
    },

    getPopularChannels: function(cb, minUsers) {
        this.hidelistout = true;
        this.exec('/list >' + (minUsers || 75)); //request chans with more than 75 users
        this.addEvent("listend:once", function() {
            var chans = _.chain(this.listedChans)
                        .clone()
                        .sortBy(function(chan) {return -chan.users})//neg to sort max -> min
                        .value();
            cb(chans);
            this.hidelistout = false;
        })
    }
});

/* This could do with a rewrite from scratch. */
//COMMANDS = dict(p=push, n=newConnection, s=subscribe)
irc.IRCConnection = new Class({
    Implements: [Events, Options],
    Binds: ["send","__completeRequest"],
    options: {
        initialNickname: "ircconnX",
        minTimeout: 45000,
        maxTimeout: 5 * 60000,
        timeoutIncrement: 10000,
        initialTimeout: 65000,
        floodInterval: 200,
        floodMax: 10,
        floodReset: 5000,
        errorAlert: true,
        maxRetries: 5,
        password: '',
        serverPassword: null
    },

    initialize: function(options) {
        var self = this;
        self.setOptions(options);
        self.counter = 0;
        self.disconnected = false;
        self.__floodLastRequest = 0;
        self.__floodCounter = 0;
        self.__floodLastFlood = 0;
        self.__retryAttempts = 0;
        self.__timeoutId = null;
        self.__timeout = self.options.initialTimeout;
        self.__lastActiveRequest = null;
        self.__activeRequest = null;
        self.__sendQueue = [];
        self.__sendQueueActive = false;
    },

    connect: function() {
        var self = this,
            request;
        self.cacheAvoidance = util.randHexString(16);
        request = self.newRequest("n");

        request.addEvent("complete", function(stream) {
            if (!stream) {
                self.disconnected = true;
                self.__error(lang.connectionFail);
                return;
            }
            else if (!stream[0]) {
                self.disconnect();
                self.__error(lang.connError, stream);
                return;
            }
            self.sessionid = stream[1];
            self.recv();
        });

        var postdata = "nick=" + encodeURIComponent(self.options.initialNickname);
        if ($defined(self.options.serverPassword)) {
            postdata += "&password=" + encodeURIComponent(self.options.serverPassword);
        }
        request.send(postdata);
    },

    disconnect: function() {
        this.disconnected = true;
        this.__cancelTimeout();
        this.__cancelRequests();
    },

    newRequest: function(url, floodProtection, synchronous) {
        var self = this;
        //check if request should proceed
        if (self.disconnected) {
            return null;
        } else if (floodProtection && !self.disconnected && self.__isFlooding()) {
            self.disconnect();
            self.__error(lang.uncontrolledFlood);
        }
        var request = new Request.JSON({
            url: qwebirc.global.dynamicBaseURL + "e/" + url + "?r=" + self.cacheAvoidance + "&t=" + self.counter++,
            async: !synchronous
        });

        // try to minimise the amount of headers 
        request.headers = {};

        //calls forEach on headers to be removed in the context of the request.xhr on readystatechange.
        //calls setXHRHeaders in the context of the request.xhr object
        request.addEvent("request", _.partial(irc.IRCConnection.setXHRHeaders, request.xhr));
        if (Browser.Engine.trident) {
            request.setHeader("If-Modified-Since", "Sat, 1 Jan 2000 00:00:00 GMT");
        }
        return request;
    },

    recv: function() {
        var self = this,
            request = self.newRequest("s", true);
        if (!$defined(request)) {
            return;
        }
        self.__activeRequest = request;
        request.__replaced = false;
        var onComplete = function(stream) {
            // replaced requests... 
            if (request.__replaced) {
                self.__lastActiveRequest = null;
                if (stream) {
                    self.__processData(stream);
                }
                return;
            }
            // the main request 
            self.__activeRequest = null;
            self.__cancelTimeout();
            if (!stream) {
                if (!self.disconnected && self.__checkRetries()) {
                    self.recv();
                }
                return;
            }
            else if (self.__processData(stream)) {
                self.recv();
            }
        };
        request.addEvent("complete", onComplete);
        self.__scheduleTimeout();
        request.send("s=" + self.sessionid);
    },

    send: function(data, synchronous) {
        if (this.disconnected) {
            return false;
        }
        if (synchronous) {
            this.__send(data, false);
        } else {
            this.__sendQueue.push(data);
            this.__processSendQueue();
        }
        return true;
    },

    __processSendQueue: function() {
        if (this.__sendQueueActive || this.__sendQueue.length === 0) {
            return;
        }
        this.sendQueueActive = true;
        this.__send(this.__sendQueue.shift(), true);
    },

    __send: function(data, async) {
        var request = this.newRequest("p", false, !async);
        if (request === null) {
            return;
        }
        request.addEvent("complete", _.partial(this.__completeRequest, async))
                .send("s=" + this.sessionid + "&c=" + encodeURIComponent(data));
    },

    __completeRequest: function(async, stream) {
        if (async) {
            this.__sendQueueActive = false;
        }
        if (!stream || (!stream[0])) {
            this.__sendQueue = [];
            if (!this.disconnected) {
                this.disconnected = true;
                this.__error(lang.connError, stream);
            }
            return false;
        }
        this.__processSendQueue();
    },

    __isFlooding: function() {
        var t = Date.now(),
            floodt = t - this.__floodLastRequest;
        if (floodt < this.options.floodInterval) {
            if (this.__floodLastFlood !== 0 && (floodt > this.options.floodReset)) {
                this.__floodCounter = 0;
            }
            this.__floodLastFlood = t;
            if (++this.__floodCounter > this.options.floodMax) {
                return true;
            }
        }
        this.__floodLastRequest = t;
        return false;
    },

    __checkRetries: function() { /* hmm, something went wrong! */
        if (++this.__retryAttempts > this.options.maxRetries && !this.disconnected) {
            this.disconnect();
            this.__error(lang.connTimeOut, {retryAttempts: this.__retryAttempts});
            return false;
        }
        var to = this.__timeout - this.options.timeoutIncrement;
        if (to >= this.options.minTimeout) {
            this.__timeout = to;
        }
        return true;
    },

    __cancelRequests: function() {
        if ($defined(this.__lastActiveRequest)) {
            this.__lastActiveRequest.cancel();
            this.__lastActiveRequest = null;
        }
        if ($defined(this.__activeRequest)) {
            this.__activeRequest.cancel();
            this.__activeRequest = null;
        }
    },

    __processData: function(o) {
        if (o[0] == false) {
            if (!this.disconnected) {
                this.disconnected = true;
                this.__error(lang.connError, o);
            }
            return false;
        }

        this.__retryAttempts = 0;
        o.each(function(x) {
            this.fireEvent("recv", [x]);
        }, this);

        return true;
    },


    __scheduleTimeout: function() {
        this.__timeoutId = this.__timeoutEvent.delay(this.__timeout, this);
    },

    __cancelTimeout: function() {
        if ($defined(this.__timeoutId)) {
            $clear(this.__timeoutId);
            this.__timeoutId = null;
        }
    },

    __timeoutEvent: function() {
        this.__timeoutId = null;
        if (!$defined(this.__activeRequest)) {
            return;
        } else if (this.__lastActiveRequest) {
            this.__lastActiveRequest.cancel();
        }
        this.__activeRequest.__replaced = true;
        this.__lastActiveRequest = this.__activeRequest;
        var to = this.__timeout + this.options.timeoutIncrement;
        if (to <= this.options.maxTimeout) {
            this.__timeout = to;
        }
        this.recv();
    },

    __error: function(message, context) {
        var msg = message.message;
        if(context)
            msg = util.formatter(msg, context);

        this.fireEvent("error", msg);
        if (this.options.errorAlert) {
            alert(msg);
        }
        console.log('had error:' + msg);
    }
});

(function() {
    var conn = irc.IRCConnection;
    //moved browser specific headers to be removed here so it doesnt have to be computed each connection.
    //header nullables are browser dependent
    //http://www.michael-noll.com/tutorials/cookie-monster-for-xmlhttprequest/
    var kill = ["Accept", "Accept-Language"],
        killBit;
    if (Browser.Engine.trident) {
        killBit = "?";
        kill = kill.concat(["User-Agent", "Connection"]);
    } else if (Browser.firefox) {
        killBit = null;
    } else {
        killBit = "";
    }

    //removes a header from an xhr object (this instanceof xhr)

    function removeHeaders(header) {
        try {
            this.setRequestHeader(header, killBit);
        } catch (e) {}
    }

    //iteratres the headers to be removed with the removeHeaders function
    //expects a xhr object as the third param 
    // conn.setXHRHeaders = function(xhr) {
    //     kill.each(removeHeaders, xhr);
    //     //remove cookies from xhr
    //     // new CookieMonster(xhr);
    // };

    conn.setXHRHeaders = _.partial(_.each, kill, removeHeaders);

    // conn.setXHRHeaders = function(xhr) {
    //     kill.each(removeHeaders, xhr);
    // };
})();


irc.IRCTracker = new Class({
    initialize: function(owner) {
        this.channels = {};
        this.nicknames = {};
        this.owner = owner;
    },

    toIRCLower: function(value) {
        /* proxied because the method can change after we connect */

        return this.owner.toIRCLower(value);
    },

    getNick: function(nick) {
        return this.nicknames[nick];
    },

    getOrCreateNick: function(nick) {
        return this.getNick(nick) || (this.nicknames[nick] = {});
    },

    getChannel: function(channel) {
        return this.channels[this.toIRCLower(channel)];
    },

    getOrCreateChannel: function(channel) {
        return this.getChannel(channel) || (this.channels[this.toIRCLower(channel)] = {});
    },

    getOrCreateNickOnChannel: function(nick, channel) {
        var nc = this.getOrCreateNick(nick);

        return nc[this.toIRCLower(channel)] || this.addNickToChannel(nc, channel);
    },

    getNickOnChannel: function(nick, channel) {
        var nickchan = this.getNick(nick);
        if (!nickchan) {
            return;
        } else {
            return nickchan[this.toIRCLower(channel)];
        }
    },

    addNickToChannel: function(nick, channel) {
        var nc = irc.nickChanEntry();

        var nickchan = this.getOrCreateNick(nick);
        nickchan[this.toIRCLower(channel)] = nc;

        var chan = this.getOrCreateChannel(channel);
        chan[nick] = nc;

        return nc;
    },

    removeNick: function(nick) {
        var nickchan = this.getNick(nick);
        if (!nickchan)
            return;

        _.each(_.keys(nickchan), function(chan) {
            var lchannel = this.toIRCLower(chan),
                channel = this.channels[lchannel];

            delete channel[nick];
            if (_.size(channel) === 0) {
                delete this.channels[lchannel];
            }
        }, this);
        delete this.nicknames[nick];
    },

    removeChannel: function(channel) {
        var chan = this.getChannel(channel);
        if (!chan)
            return;

        var lchannel = this.toIRCLower(channel);


        _.each(_.keys(chan), function(nick) {
            var nc = this.nicknames[nick];
            delete nc[lchannel];
            if (_.size(nc) === 0) { //in no more channels
                delete this.nicknames[nick];
            }
        }, this);
        delete this.channels[lchannel];
    },

    removeNickFromChannel: function(nick, channel) {
        var lchannel = this.toIRCLower(channel);

        var nickchan = this.getNick(nick);
        var chan = this.getChannel(lchannel);
        if (!nickchan || !chan)
            return;

        delete nickchan[lchannel];
        delete chan[nick];

        if (_.size(nickchan) === 0) {
            delete this.nicknames[nick];
        }
        if (_.size(chan) === 0) {
            delete this.channels[lchannel];
        }
    },

    renameNick: function(oldnick, newnick) {
        var nickchans = this.getNick(oldnick);
        if (!nickchans)
            return;

        _.each(_.keys(nickchans), function(channel) {
            var lchannel = this.toIRCLower(channel);
            this.channels[lchannel][newnick] = this.channels[lchannel][oldnick];
            delete this.channels[lchannel][oldnick];
        }, this);

        this.nicknames[newnick] = this.nicknames[oldnick];
        delete this.nicknames[oldnick];
    },

    updateLastSpoke: function(nick, channel, time) {
        var nc = this.getNickOnChannel(nick, channel);
        if ($defined(nc)) {
            nc.lastSpoke = time;
        }
    },

    getSortedByLastSpoke: function(channel) {
        var chan = this.getChannel(channel);
        if (!chan)
            return;

        var sorter = function(key1, key2) {
            return chan[key2].lastSpoke - chan[key1].lastSpoke;
        };

        // var names = [];
        // Hash.each(chan, function(chan, name) {
        //     names.push([name, chan]);
        // });
        // var names = util.mapA(chan, function(c, n) {
        //     return [n, c];
        // });
        var sorted = Object.keys(chan).sort(sorter).map(function(key){
            return chan[key];
        });

        // var newnames = names.sort(sorter)
        //                     .map(prelude.first);

        return sorted;
    }
});


(function (engine) {

    //where to store these things
    var source = engine.source = engine.source || {},
        compiled = engine.templates = engine.templates || {};

    //Handlebars.templates.stream({class:'scout',added:[{user:'megawac'},{user:'TKO'}]})
    //->
    //"<li id='tfscout'><span class='tf-class'>scout</span><span class='tf-players'><span>megawac</span><span>TKO</span></span></li>"
    // source.stream = [
    // "<li id='tf{{class}}'>",
    //     "<span class='tf-class'>{{class}}</span>",
    //     "<span class='tf-players'>",
    //     "{{#each added}}",
    //         "{{> player this}}",
    //     "{{/each}}",
    //     "</span>",
    // "</li>"
    // ].join("");

    //Templates.compiled.authpage({nickname:'fred',username:'megawac',password:'secret', full:false}) (full shows all fields)
    //"<div id='login'><div><span>Nickname:</span><input type='text' name='basic' id='nickname' value=fred></div><div><span>Auth options</span><input type='checkbox' id='authenticate'></div><div><span>Gamesurge username:</span><input type='text' name='full' id='username' value='megawac'></div><div><span>Password:</span><input type='text' name='full' id='password' value='secret'></div></div>"
    // source.authpage = [
    // "<form id='login'>",
    //     //"<div>",
    //     "<h1>Connect to {{network}} IRC</h1>",
    //     "<div class='nick right'><span>Nickname:</span><input type='text' name='basic' id='nickname' value={{nickname}}></div>",
    //     "<div class='username right {{#unless full}}hidden{{/unless}}'><span>Gamesurge username:</span><input type='text' name='full' id='username' value='{{username}}'></div>",
    //     "<div class='password right {{#unless full}}hidden{{/unless}}'><span>Password:</span><input type='password' name='full' id='password' value='{{password}}'></div>",
    //     "<div class='authenticate'>",
    //         "<span>Authenticate (optional)</span><input type='checkbox' id='authenticate' {{check full}}>",
    //     "</div>",
    //     "<div><input type='submit' value='Connect' /></div>",
    //     //"</div>",
    // "</form>",
    // "<div class='qwebirc-init-channels'><span>{{channels}}</span></div>"
    // ].join("");

    // source.spanURL = "<span class='hyperlink-channel'>{{message}}</span>";

    // source.message = "<div class='message{{pad class}}'><span>{{message}}</span></div>";
    // source.timestamp = "<span class='timestamp'>{{time}} </span>";
    // source.userlink = "<span class='hyperlink-whois' data-user='{{userid}}'>&lt;{{username}}&gt;</span>";
    // source.channellink = "<span class='hyperlink-channel' data-chan='{{channel}}'>{{channel}}</span>";

    source.messageLine = "<hr class='lastpos' />";
    // source.ircMessage = "<div class='{{styles}}'></div>";


    //portions:
    source.topPane = "<div class='qui toppanel outertabbar'></div>";
    source.detachedPane = "<div class='detached'></div>";
    source.windowsPane = "<div class='windows qui'></div>";
    source.windowPane = "<div class='window qui hidden'></div>";
    source.topicPane = "<div class='qui topic'></div>";
    source.contentPane = "<div class='qui content'></div>";
    source.leftPane = "<div class='qui leftpanel lines'></div>";
    source.nickPane = "<div class='qui rightpanel'></div>";
    source.propertiesPane = "<div class='qui properties'></div>";
    source.inputPane = "<div class='qui bottompanel'></div>";

    // source.detachedWindow = [
    // "<div class='detached-window'>",
    //     "<div class='header'>",
    //         "<span class='title'>{{channel}}</span>",
    //         "{{#unless base}}{{> tabClose}}{{/unless}}",//css bug
    //         "{{> tabAttach}}",
    //     "</div>",
    // "</div>"].join("");

    source.resizeHandle = "<div><span class='resize-handle ui-icon ui-icon-grip-diagonal-se'></span></div>";

    source.menuContainer = "<div class='menu'></div>";
    // source.menubtn = "<div class='dropdown-tab'><img src='{{icon}}' title='menu' alt='menu'></div>";
    source.menudrop = "<div class='main-menu dropdownmenu'></div>";
    // source.chanmenu = "<div class='chanmenu dropdownmenu'>{{#each channels}}{{> menuitem}}{{/each}}</div>";
    // source.menuitem = "<a{{#if value}} data-value='{{value}}'{{/if}}><span>{{text}}</span>{{#if hint}}<span class='hint'>{{hint}}</span>{{/if}}</a>";
    source.dropdownhint = "<div class='dropdownhint'>Click the icon for the main menu.</div>";

    source.tabbar = "<div class='tabbar'></div>";
    source.tabbarbtns = [
    "<div class='tab-buttons'>",
        "<span class='ui-icon ui-icon-circle-triangle-w to-left hidden' name='tabscroll'></span>",
        "<span class='ui-icon ui-icon-circle-triangle-e to-right hidden' name='tabscroll'></span>",
        "<span class='add-chan ui-icon ui-icon-circle-plus' title='Join a channel'></span>",
    "</div>"].join("");
    // source.ircTab = "<a href='#' class='tab'>{{{name}}} {{> tabDetach}}</a>";
    source.tabDetach = "<span class='detach ui-icon ui-icon-newwin' title='" + lang.detachWindow + "'></span>";
    source.tabAttach = "<span class='attach ui-icon ui-icon-circle-minus'></span>";
    source.tabClose = "<span class='tab-close ui-icon ui-icon-circle-close' title='" + lang.closeTab + "'></span>";

	source.loadingPage = "<div class='loading'>" + lang.loadingText + " . . .</div>";
    // source.channelName = "<div id='channel-name-id' class='channel-name'>{{{channel}}}</div>";

    // source.topicBar = ["<div class='topic tab-invisible qui colourline'>",
    //                         "{{#if topic}}{{> topicText}}{{else}}&nbsp;{{/if}}",
    //                     "</div>"].join("");
    // source.topicText = "<span class='{{#if empty}}emptytopic{{/if}}'>{{topic}}</span>";

    // source.nickbtn = "<a href='#' class='user'><span>{{nick}}</span></a>";
    // source.nicklist = "<div class='nicklist tab-invisible qwebirc-qui'></div>";

    // source.favicon = "<link rel='shortcut icon' type='image/x-icon' href='{{link}}'>";

    // source.ircInput = [
    // "<form class='input'><div>",
    //     "<label class='nickname'><span class='status {{status}}'></span>{{nick}}</label>",
    //     "<input class='{{type}} input-field' type='text'>",
    //     "<input class='input-button' type='button' value='>' />",
    // "</div></form>"].join("");


    source.verticalDivider = "<div class='ui-icon ui-icon-grip-solid-vertical handle vertical'></div>";
    source.horizontalDivider = "<div class='ui-icon ui-icon-grip-solid-horizontal handle horizontal'></div>";

    /************************
        HELPERS
    ***********************/
    //invert boolean helper
    // engine.registerHelper('not', prelude.negate);

    //returns hidden class name if it should be hidden
    // engine.registerHelper('hidden', function(hidden) {
    //     return hidden ? 'hidden' : '';
    // });

    engine.registerHelper('check', function(checked){
        return checked ? 'checked' : '';
    });

    engine.registerHelper('enableDisable', function(x) {
        return x ? lang.DISABLE : lang.ENABLE;//if true shows disable
    })

    //engine.registerHelper('pad', function(txt) {
    //    return txt && txt.length !== 0 ? ' ' + txt : '';
    //});


    /******************
        Compiliation
    *********************/

    function compileAll(source,compiled) {
        _.each(source, function(item, key) {
            try {
                // compiled[key] = engine.compile(item);
                compiled[key] = Function.from(item);
            } catch(err) {
                console.log(err);
            }
        });

        return compiled;
    }

    compileAll(source, compiled);

    //allows templates to reference eachother
    engine.partials = compiled;
})(Handlebars);


ui.BaseUI = new Class({
    Implements: [Options, Events],
    options: {

    },
    initialize: function(parentElement, windowClass, uiName, options) {
        var self = this;
        self.setOptions(options);

        self.windows = {};
        self.clients = {};
        self.windows[ui.CUSTOM_CLIENT] = {};
        self.windowArray = [];
        self.windowClass = windowClass;
        self.parentElement = parentElement;
        parentElement.addClasses("qwebirc", "qwebirc-" + uiName);
        self.commandhistory = new irc.CommandHistory();
        self.clientId = 0;
    },
    newClient: function(client) {
        client.id = this.clientId++;

        var windows = this.windows[client.id] = {};
        this.clients[client.id] = client;
        var win = this.newWindow(client, ui.WINDOW_STATUS, STATUS);
        this.selectWindow(win);

        this.clientEvents(client, windows);

        return win;
    },

    newWindow: function(client, type, name) {
        var win = this.getWindow(client, name);
        if (!$defined(win)) {
            var wId = this.getWindowIdentifier(name);
            win = this.windows[this.getClientId(client)][wId] = new this.windowClass(this, client, type, name, wId);
            this.windowArray.push(win);
        }

        return win;
    },

    clientEvents: function(client, windows) { // mi gusta xD
        if(! client instanceof irc.IRCClient) return;
        var self = this,
            broadcast_re = /MSG|TOPIC|(CHAN|PRIV)NOTICE/i;

        function formatChans(data) {
            var chans = data.channels;
            return chans && _.isObject(chans) ? _.keys(chans) : Array.from(chans || data.channel);
        }

        function formatData(type, _data) {
            var data = _.extend({
                c: _data.channel || STATUS,
                n: _data.nick,
                m: _data.message,
                h: _data.host,
                t: type,
                type: type
            }, _data);
            if (!(self.uiOptions2.get("nick_ov_status"))){
                delete data["@"];
            }
            return data;
        }

        function lineParser(type, data) {
            data = formatData(type, data);
            
            _.each(formatChans(data), function(channel) {
                data.channel = data.c = channel;
                var win = (data.c === ACTIVE) ? self.getActiveWindow() : self.getWindow(client, channel);
                if(!win) return;
                if(_.isArray(data.message)) {
                    _.each(data.message, function(msg) {
                        data.message = data.m = msg;
                        parser(type, data, win);
                    });
                }
                else {
                    parser(type, data, win);
                }
            });
        }

        function parser(type, data, win, channel) {
            type = data.type || data.t || type;
            channel = data.channel || STATUS;

            win.addLine(data.type, data);

            if(!util.isBaseWindow(data.channel) && broadcast_re.test(type)) {
                var data2 = _.clone(data);
                var brouhaha = self.getWindow(client, BROUHAHA);
                data2.nick = data2.n = data.n + data.c;
                brouhaha.addLine(data.type, data2);
            }
        }

        function updateTopic(type, data) {
            self.getWindow(client, data.channel).updateTopic(data.topic);
            if(!data.initial) {
                data.message = data.topic;
                lineParser("topic", data);
            }
        }

        function joinPart(type, data) {
            if ((data.thisclient && data.type != "PART" && data.type != "QUIT") ||
                    !(self.uiOptions2.get("hide_joinparts")) && !util.isBaseWindow(data.channel)) {
                lineParser(type, data);
            }
        }

        client.addEvents({
            "connect": lineParser,
            "disconnect": lineParser,
            "error": lineParser,

            "chanAction": lineParser,
            "chanTopic": updateTopic,
            "chanMessage": lineParser,
            "chanNotice": lineParser,
            "chanCTCP": lineParser,

            "userJoined": function(type, data) {
                joinPart(data.thisclient ? "ourJoin" : "join", data);
            },
            "userPart": joinPart,
            "userQuit": function (type, data) {
                joinPart("quit", data);
            },
            "userKicked": lineParser,
            "userInvite": lineParser,
            "userAction": lineParser,
            "userCTCP": lineParser,
            "userCTCPReply": lineParser,
            "userMode": lineParser,
            "nickChange": function(type, data) {
                self.nickChange(data);
                lineParser(type, data);
            },
            "privNotice": lineParser,

            "query": function(type, data) {//queries
                data = formatData(type, data);
                var win = self.newWindow(client, ui.WINDOW_QUERY, data.channel); //get or create
                self.selectWindow(win);
                parser(type, data, win);
            },

            "awayStatus": lineParser,
            "mode": function(type, data) {
                var win = self.getWindow(data.channel);
                if(win) {
                    win.updatePrefix(data);
                }
                lineParser(type, data);
            },
            "serverMessage": lineParser,
            "serverNotice": lineParser,
            "whois": lineParser,
            "wallops": lineParser
        });


    },

    getClientId: function(client) {
        return client === ui.CUSTOM_CLIENT ? ui.CUSTOM_CLIENT : client.id;
    },
    getWindowIdentifier: function(name) {
        return name.toLowerCase();
    },
    nickChange: util.noop,

    getWindow: function(client, name) {
        if(_.isNumber(name)) {
            return _.findWhere(this.windowArray, {
                type: name
            });
        }
        var wins = this.windows[this.getClientId(client)];
        if (!$defined(wins))
            return null;

        return wins[this.getWindowIdentifier(name)];
    },
    getActiveWindow: function() {
        return this.active;
    },
    getActiveIRCWindow: function(client) {
        if (!this.active || this.active.type == ui.WINDOW_CUSTOM) {
            return this.windows[this.getClientId(client)][this.getWindowIdentifier(STATUS)];
        } else {
            return this.active;
        }
    },
    __setActiveWindow: function(win) {
        this.active = win;
    },
    selectWindow: function(win) {
        if(Type.isNumber(win))
            win = this.windowArray[win];
        else if(Type.isString(win)) 
            win = this.windows[win];
        if (this.active) {
            if(win === this.active) return;
            this.active.deselect();
        }
        win.select();
        this.updateTitle(win.name + " - " + this.options.appTitle);
    },
    nextWindow: function(direction, fromWin) {
        var windows = this.windowArray,
            win = windows.next(windows.indexOf(fromWin || this.active), direction); //get window from array
        this.selectWindow(win);

        return win;
    },
    prevWindow: function() {
        this.nextWindow(-1);
    },
    __closed: function(win) {
        var winarr = this.windowArray;
        if (win.active) {
            // this.active = undefined;
            if (winarr.length === 1) {
                winarr.empty();
            } else {
                var index = winarr.indexOf(win);
                if(index === -1) {
                    return;
                } else if (index === (winarr.length - 1)) {
                    this.prevWindow();
                } else {
                    this.nextWindow();
                }
            }
        }

        winarr = this.windowArray.erase(win);
        delete this.windows[this.getClientId(win.client)][win.identifier];
    },
/*
      this shouldn't be called by overriding classes!
      they should implement their own!
      some form of user input MUST be received before an
      IRC connection is made, else users are going to get
      tricked into getting themselves glined
    */
    loginBox: function(callback, initialNickname, initialChannels, autoConnect, autoNick, storage) {
        ui.GenericLoginBox(this.parentElement, callback, initialNickname, initialChannels, autoConnect, autoNick, this.options.networkName, storage);
    }
});


ui.StandardUI = new Class({
    Extends: ui.BaseUI,
    Binds: ["__handleHotkey", "optionsWindow", "embeddedWindow", "urlDispatcher", "resetTabComplete", "whoisURL", "setModifiableStylesheetValues"],

    UICommands: ui.UI_COMMANDS,
    initialize: function(parentElement, theme, windowClass, uiName, options) {
        var self = this;
        self.parent(parentElement, windowClass, uiName, options);

        self.theme = theme;

        self.tabCompleter = new ui.TabCompleterFactory(self);
        // self.uiOptions = new ui.DefaultOptionsClass(self, options.uiOptionsArg);
        self.uiOptions2 = new config.OptionModel({
            defaults: self.options.uiOptionsArg
        }, {
            onInit: function() {//merge where necessary
                var model = this;
                ["notify_on_mention", "notify_on_pm", "notify_on_notice"].each(function(type) {
                    var notifier = self.theme.messageParsers.filter(function(n) { return n.id === type; })[0],
                        set = model.get(type);
                    Object.merge(notifier, set);

                    model.on("change:" + type, function() {
                        Object.merge(notifier, set);
                    });
                });
            }
        });

        function setCustoms(notices) {
            self.theme.customNotices = _.chain(notices).clone()
                .reject(function(data) {
                    return !(data.msg || data.msg.trim() === "") && (!data.nick || data.nick.trim() === "");
                })
                .map(function(notice) {
                    return {
                        msg: new RegExp(notice.autoescape ? String.escapeRegExp(notice.msg) : notice.msg),
                        beep: notice.beep,
                        flash: notice.flash
                    };
                })
                .value();
        }
        function setSNotice(notices) {
            _.each(self.theme.messageParsers, function(parser) {
                if( _.has(notices, parser.id) )
                    _.extend(parser, notices[parser.id]);
            });
        }

        self.uiOptions2.on({
            "change:style_hue": function(hue) {
                self.setModifiableStylesheetValues({
                    hue: hue
                })
            },
            "change:font_size": self.setModifiableStylesheetValues,
            "change:custom_notices": setCustoms,
            "change:notices": setSNotice
        });
        setCustoms(self.uiOptions2.get("custom_notices"));
        setSNotice(self.uiOptions2.get("notices"));

        self.customWindows = {};

        self.__styleValues = {
            hue: self.options.hue || self.uiOptions2.get("style_hue"),
            saturation: self.options.saturation || self.uiOptions2.get("style_saturation"),
            lightness: self.options.lightness || self.uiOptions2.get("style_brightness")
        };
    },

    newCustomWindow: function(name, select, type) {
        if (!type)
            type = ui.WINDOW_CUSTOM;

        var win = this.newWindow(ui.CUSTOM_CLIENT, type, name);
        win.addEvent("close", function(win) {
            delete this.windows[ui.CUSTOM_CLIENT][win.identifier];
        }.bind(this));

        if (select)
            this.selectWindow(win);

        return win;
    },

    addCustomWindow: function(windowName, class_, cssClass, options) {
        if (!$defined(options))
            options = {};

        if (this.customWindows[windowName]) {
            this.selectWindow(this.customWindows[windowName]);
            return;
        }

        var win = this.newCustomWindow(windowName, true);
        this.customWindows[windowName] = win;

        win.addEvent("close", function() {
            this.customWindows[windowName] = null;
        }.bind(this));

        if (cssClass)
            win.lines.addClass("qwebirc-" + cssClass);

        var ew = new class_(win.lines, options);
        ew.addEvent("close", win.close);

        win.setSubWindow(ew);
    },
    embeddedWindow: function() {
        this.addCustomWindow("Add webchat to your site", ui.EmbedWizard, "embeddedwizard", {
            baseURL: this.options.baseURL,
            uiOptions: this.uiOptions2,
            optionsCallback: this.optionsWindow
        });
    },
    optionsWindow: function() {
        var self = this;
        var constructor = function(element, data) {
            return new ui.OptionView({
                element: element,
                model: data,
                onNoticeTest: function() {
                    self.flash();
                }
            });
        }
        self.addCustomWindow("Options", constructor, "optionspane", self.uiOptions2);
    },
    aboutWindow: function() {
        this.addCustomWindow("About", ui.AboutPane, "aboutpane", this.uiOptions2);
    },
    privacyWindow: function() {
        this.addCustomWindow("Privacy policy", ui.PrivacyPolicyPane, "privacypolicypane", this.uiOptions2);
    },
    feedbackWindow: function() {
        this.addCustomWindow("Feedback", ui.FeedbackPane, "feedbackpane", this.uiOptions2);
    },
    faqWindow: function() {
        this.addCustomWindow("FAQ", ui.FAQPane, "faqpane", this.uiOptions2);
    },
    urlDispatcher: function(name, window) {
        if (name == "embedded") {
            return ["a", this.embeddedWindow];
        }
        else if (name == "options"){
            return ["a", this.optionsWindow];
        }
        /* doesn't really belong here */
        else if (name === "whois") {
            var uiOptions2 = this.uiOptions2;
            ///this method is dumb
            return ["span", function(nick) {
                if (uiOptions2.QUERY_ON_NICK_CLICK) {
                    window.client.exec("/QUERY " + nick);
                } else {
                    if (isChannel(nick)) {
                        nick = util.unformatChannel(nick);
                    } else {
                        if (nick.search(window.client.nickname + '>') >= 0) {
                            nick = nick.substr(nick.search('>') + 1, nick.length);
                        } else {
                            nick = nick.substr(0, nick.search('>'));
                        }
                    }
                    // window.properties.text(nick);
                    window.client.exec("/WHOIS " + nick);
                }
            }];
        }
        else
            return null;
    },

    whoisURL: function(e, target) {
        var client = target.getParent('.lines').retrieve('client'),
            nick = target.get('data-user');
        if (this.uiOptions2.QUERY_ON_NICK_CLICK) {
            client.exec("/QUERY " + nick);
        } else {
            if (isChannel(nick)) {
                nick = util.unformatChannel(nick);
            } else if (nick.search(client.nickname + '>') >= 0) {
                nick = nick.substr(nick.search('>') + 1, nick.length);
            } 
            client.exec("/WHOIS " + nick);
        }
    },

    chanURL: function(e, target) {
        var client = target.getParent('.lines').retrieve('client'),
            chan = target.get('data-chan');
        if(util.isChannel(chan))
            client.exec("/JOIN " + chan);
    },

    tabComplete: function(element) {
        this.tabCompleter.tabComplete(element);
    },
    resetTabComplete: function() {
        this.tabCompleter.reset();
    },
    setModifiableStylesheet: function(name) {
        this.__styleSheet = new ui.style.ModifiableStylesheet(this.options.modifiableStylesheet);
        this.setModifiableStylesheetValues();
    },
    setModifiableStylesheetValues: function(values) {//todo calculate all the values and just sub in
        Object.append(this.__styleValues, values);

        if (!$defined(this.__styleSheet))
            return;

        var hue = this.__styleValues.hue,
            lightness = this.__styleValues.lightness,
            saturation = this.__styleValues.saturation,
            uiOptions = this.uiOptions2;

        this.__styleSheet.set(function(mode, val, _default) {
            if (mode == "c") {
                var x = new Color(val);
                var c = x.setHue(hue).setSaturation(x.hsb[1] + saturation).setBrightness(x.hsb[2] + lightness);
                if (c == "255,255,255") // IE confuses white with transparent... 
                c = "255,255,254";

                return "rgb(" + c + ")";
            }
            else if (mode == "o") {
                return uiOptions.get(val);
            }
            return _default;
        });
    }
});



ui.NotificationUI = new Class({
    Extends: ui.StandardUI,

    Binds: ["beep", "flash", "cancelFlash"],

    options: {
        minSoundRepeatInterval: 1000,

        notificationOptions: {//https://github.com/ttsvetko/HTML5-Desktop-Notifications
            icon: "images/qwebircsmall.png",
            title: "IRC Alert",
            body: "New notification!"
        }
    },
    initialize: function() {
        // this.parent(parentElement, windowClass, uiName, options);
        this.parent.apply(this, arguments);


        this.soundInit();
        this.lastSound = 0;

        this.windowFocused = false;
        this.titleText = document.title;

        var favIcon = document.head.getElement("link[rel^='shortcut'][rel$='icon']");
        if ($defined(favIcon)) {
            this.favIcon = favIcon;
            // this.favIconParent = favIcon.getParent();
            this.favIconVisible = true;
            this.emptyFavIcon = new Element("link", {
                    rel: 'shortcut icon',
                    type: 'image/x-icon',
                    href: this.options.icons.empty_favicon
                });

            this.flashing = false;
            this.canFlash = true;
        } else {
            this.canFlash = false;
        }
    },
    setBeepOnMention: function(value) {
        if (value)
            this.soundInit();
    },
    updateTitle: function(text) {
        ui.setTitle(text);
    },
    beep: function() {
        this.playSound('beep');
    },
    playSound: function(alias) {
        if (this.soundPlayer.isReady() && (Date.now() - this.lastSound > this.options.sounds.minSoundRepeatInterval)) {
            this.lastSound = Date.now();
            this.soundPlayer.sounds[alias]();
        }
    },

    soundInit: function() {
        //used to have a bunch of flash checks. going to let the sm handle it
        if(!$defined(this.soundPlayer)) {
            this.soundPlayer = new sound.SoundPlayer(this.options.sounds).load();
        }
    },
    flash: function(options) {
        var self = this;
        if (document.hasFocus() || !self.canFlash || self.flashing)
            return;

        self.titleText = document.title;

        var flash = function() {
            var vis = self.toggleFavIcon();
            ui.setTitle(vis ? self.titleText : lang.activityNotice.message);
        };

        if(self.uiOptions2.get("dn_state")) {
            var opts = _.extend({/*timeout: self.uiOptions2.get("dn_duration")*/}, self.options.notificationOptions, options);
            self.__notice = notify.createNotification(opts.title, opts);
            (function() { self.__notice.close(); self.__notice = null; }).delay(self.uiOptions2.get("dn_duration"));
        }

        self.flashing = true;
        // flashA();
        self.__flasher = flash.periodical(750);
        window.addEvents({//whatever comes first
            "mousedown:once": self.cancelFlash,
            "keydown:once": self.cancelFlash,
            "focus:once": self.cancelFlash
        });
    },
    cancelFlash: function() {
        this.flashing = false;

        if(this.__flasher)
            $clear(this.__flasher);
        this.__flasher = null;

        if(this.__notice)
            this.__notice.close();
        this.__notice = null;

        this.toggleFavIcon(true);
        ui.setTitle(this.titleText);
    },
    //not sure if changing the favicon is a good idea - messes with peoples bookmarks
    toggleFavIcon: function(state) {
        var vis = $defined(state) ? state : !this.favIconVisible;
        this.favIconVisible = vis;
        if(vis && !this.favIconVisible) {
            this.favIcon.replaces(this.emptyFavIcon);
        }
        else if (!vis && this.favIconVisible) {
            this.emptyFavIcon.replaces(this.favIcon);
        }
        return vis;
    }
});


ui.LoginUI = new Class({
    Extends: ui.NotificationUI,
    loginBox: function(initialNickname, initialChannels, autoConnect, autoNick, network, storage) {
        this.postInitialize();

        var self = this;
        var win = this.newCustomWindow(CONNECTION_DETAILS, true, ui.WINDOW_CONNECT);
        var callback = function(data) {
                win.close();
                self.fireEvent("login", data)
            };
        ui.GenericLoginBox(win.lines, callback, initialNickname, initialChannels, autoConnect, autoNick, network || this.options.networkName, storage);
        return win;
    }
});

ui.GenericLoginBox = function(parentElement, callback, initialNickname, initialChannels, autoConnect, autoNick, networkName, storage) {
    if (autoConnect) {
        ui.ConfirmBox(parentElement, callback, initialNickname, initialChannels, autoNick, networkName,storage);
    } else {
        ui.LoginBox(parentElement, callback, initialNickname, initialChannels, networkName,storage);
    }
};

ui.LoginBox = function(parentElement, callback, initialNickname, initialChannels, networkName, cookies) {

    var nickname = cookies.nick.get() || initialNickname,
        account = util.B64.decode(cookies.user.get()),
        password = util.B64.decode(cookies.pass.get()),
        eauth = auth.enabled || cookies.auth.get();

    var context = {
        'network':networkName,
        'nickname':nickname,
        'username':account,
        'password':password,
        'full': eauth, //whether to show the extra auth options (check the checkbox)
        'channels': initialChannels.join()
    };
    var page = templates.authpage(context);
    parentElement.insertAdjacentHTML("beforeEnd", page);

    var form = parentElement.getElementById('login'),
        nickBox = parentElement.getElementById('nickname'),
        usernameBox = parentElement.getElementById('username'),
        passwordBox = parentElement.getElementById('password'),
        chkAddAuth = parentElement.getElementById('authenticate');


    function toggleFull () {
        form.getElements('[name="full"]').getParent('div').toggle();
    }

    chkAddAuth.addEvent('click', toggleFull);

    form.addEvent("submit", function(e) {
        e.stop();

        var nickname = nickBox.val();

        //validate nick
        if (!nickname) {
            alert(lang.missingNick);
            nickBox.focus();
            return;
        }
        var stripped = qwebirc.global.nicknameValidator.validate(nickname);
        if (stripped !== nickname) {
            nickBox.val(stripped);
            alert(lang.invalidNick);
            nickBox.focus();
            return;
        }

        var data = {
            "nickname": nickname
        };

        cookies.nick.set(nickname);

        if (chkAddAuth.checked || auth.enabled) {//disabled
            // we're valid - good to go
            data.account = account = usernameBox.val();
            data.password = password = passwordBox.val();
            if (auth.bouncerAuth()) {
                if (!$chk(password)) {
                    alert(lang.missingPass);
                    passwordBox.focus();
                    return;
                }

                data.serverPassword = password;
            }
            if (!account || !password) {
                alert(lang.missingAuthInfo);
                if (!$chk(account)) {
                    usernameBox.focus();
                } else {
                    passwordBox.focus();
                }
                return;
            } else {
                if(auth.passAuth()){
                    data.serverPassword = account + " " + password;
                }

            }

            cookies.user.set(util.B64.encode(account));
            cookies.pass.set(util.B64.encode(password));
            cookies.auth.set(true);
            auth.enabled = true;
        } else {
            cookies.auth.dispose();
        }


        parentElement.empty();

        auth.loggedin = true;

        callback(data);
    }.bind(this));

    if (window === window.top)
        nickBox.focus();
};


//todo clean this up - not currently implemented
ui.ConfirmBox = function(parentElement, callback, initialNickname, initialChannels, autoNick, networkName) {
    var outerbox = new Element("table");
    outerbox.addClass("qwebirc-centrebox");
    parentElement.appendChild(outerbox);
    var tbody = new Element("tbody");
    outerbox.appendChild(tbody);
    var tr = new Element("tr");
    tbody.appendChild(tr);
    var td = new Element("td");
    tr.appendChild(td);

    var box = new Element("table");
    box.addClass("qwebirc-confirmbox");
    td.appendChild(box);

    var tbody = new Element("tbody");
    box.appendChild(tbody);

    var tr = new Element("tr");
    tbody.appendChild(tr);
    tr.addClass("tr1");

    var text = new Element("td");
    tr.appendChild(text);

    var nick = new Element("b");
    nick.set("text", initialNickname);

    var c = initialChannels.split(" ")[0].split(",");

    text.appendChild(document.createTextNode("To connect to " + networkName + " IRC and join channel" + ((c.length > 1) ? "s" : "") + " "));

    for (var i = 0; i < c.length; i++) {
        if ((c.length > 1) && (i == c.length - 1)) {
            text.appendChild(document.createTextNode(" and "));
        } else if (i > 0) {
            text.appendChild(document.createTextNode(", "));
        }
        text.appendChild(new Element("b").set("text", c[i]));

    }

    if (!autoNick) {
        text.appendChild(document.createTextNode(" as "));
        text.appendChild(nick);
    }

    text.appendChild(document.createTextNode(" click 'Connect'."));
    text.appendChild(new Element("br"));
    if (auth.enabled && auth.quakeNetAuth() && !auth.loggedin)
        text.appendChild(document.createTextNode("If you'd like to connect using your Q auth click 'Log in'."));

    var tr = new Element("tr");
    tbody.appendChild(tr);
    tr.addClass("tr2");

    var td = new Element("td");
    tr.appendChild(td);

    var yes = new Element("input", {
        "type": "submit",
        "value": "Connect"
    });
    td.appendChild(yes);
    yes.addEvent("click", function(e) {
        parentElement.removeChild(outerbox);
        callback({
            "nickname": initialNickname,
            "autojoin": initialChannels
        });
    });

    if (auth.enabled && auth.quakeNetAuth() && !auth.loggedin) {
        var auth = new Element("input", {
            "type": "submit",
            "value": "Log in"
        });
        td.appendChild(auth);
        auth.addEvent("click", ui.AuthLogin);
    }

    if (window == window.top)
        yes.focus();
}

// ui.authShowHide = function(checkbox, authRow, usernameBox, usernameRow, passwordRow) {
//     var visible = checkbox.checked;
//     var display = visible ? null : "none";
//     usernameRow.setStyle("display", display);
//     passwordRow.setStyle("display", display);

//     if (visible) {
//         //    authRow.parentNode.setStyle("display", "none");
//         usernameBox.focus();
//     }
// }



ui.QuakeNetUI = new Class({
    Extends: ui.LoginUI,
    urlDispatcher: function(name, window) {
        if (name == "qwhois") {
            return ["span", function(auth) {
                this.client.exec("/MSG Q whois #" + auth);
            }.bind(window)];
        }
        return this.parent(name, window);
    },
    logout: function() {
        if (!auth.loggedin)
            return;
        if (confirm("Log out?")) {
            Object.each(this.clients, function(client) {
                client.quit(lang.logOut.message);
            });

            (function() {
                document.location = qwebirc.global.dynamicBaseURL + "auth?logout=1";
            }).delay(500);
        }
    }
});


ui.QUI = new Class({
    Extends: ui.QuakeNetUI,
    Binds: ["__createChannelMenu"],
    initialize: function(parentElement, theme, options) {
        this.parent(parentElement, theme, ui.QUI.Window, "qui", options);

        parentElement.addClass('qui')
                    .addClass('signed-out');
        this.parentElement = parentElement;
        this.setModifiableStylesheet("qui");
        this.setHotKeys();


        this.parentElement.addEvents({
            "click:relay(.lines .hyperlink-whois)": this.whoisURL,
            "click:relay(.lines .hyperlink-channel)": this.chanURL
        });
    },
    postInitialize: function() {
        var self = this,
            qjsui = self.qjsui = new ui.QUI.JSUI("qui", self.parentElement);

        // qjsui.addEvent("reflow", function() {
        //     var win = self.getActiveWindow();
        //     if ($defined(win))
        //         win.onResize();
        // });

        self.outerTabs = qjsui.top;
        var tabs = self.tabs = Element.from(templates.tabbar()),
            joinChan =  function(){
                var chan = prompt("Enter channel name:");
                if(chan && chan.trim() !== ""){
                    _.each(self.clients, function(client) {
                        client.exec("/JOIN " + chan);
                    });
                }
            },
            tabbtns = Element.from(templates.tabbarbtns()),
            addTab = tabbtns.getElement('.add-chan'),
            scrollers = tabbtns.getElements('[name="tabscroll"]'),
            scroller = new Fx.Scroll(tabs),
            resizeTabs = _.partial(util.fillContainer, tabs, {style: 'max-width'}),
            onResize = function() {
                var wid = tabs.getWidth(),
                    swid = tabs.getScrollWidth();

                if(swid > wid) {
                    scrollers.show();
                }
                else {
                    scrollers.hide();
                }

                resizeTabs();
            };

        window.addEvent('resize', onResize);
        tabs.addEvents({
            'adopt': onResize,
            'disown': onResize
        });

        scrollers.filter('.to-left')
            .addEvent('click', function(e) {
                e.stop();
                var pos = tabs.getScrollLeft(),
                    $ele = util.elementAtScrollPos(tabs, pos);

                scroller.toElement($ele, 'x');
                console.log($ele);
            });
        scrollers.filter('.to-right')
            .addEvent('click', function(e) {
                e.stop();
                var pos = tabs.getScrollLeft() + tabs.getWidth(),
                    $ele = util.elementAtScrollPos(tabs, pos);

                scroller.toElementEdge($ele, 'x');
                console.log($ele);
            });

        resizeTabs();
        addTab.addEvents({
            'dblclick': joinChan,
            'click': self.__createChannelMenu
        });

        //for scrolling tabs with mousewheel
        tabs.addEvent("mousewheel", function(event) {
            event.stop();
            /* up */
            if (event.wheel > 0) {
                self.nextWindow();
            } else if (event.wheel < 0) { /* down */
                self.prevWindow();
            }
        });


        //append menu and tabbar
        self.outerTabs.adopt(self.__createDropdownMenu(), tabs, tabbtns);

        var origWin = qjsui.createWindow();
        self.origtopic = self.topic = origWin.topic;
        self.origlines = self.lines = origWin.middle;
        self.orignicklist = self.nicklist = origWin.right;

        self.input = origWin.bottom;


        //delay for style recalc
        self.__createDropdownHint.delay(500, self);
    },

    __createDropdownMenu: function() {
        var self = this,

            dropdownMenu = Element.from(templates.menudrop());
        dropdownMenu.inject(self.parentElement);

        var dropdown = Element.from(templates.menubtn({icon: self.options.icons.menuicon}));
        dropdown.setStyle("opacity", 1);


        self.UICommands.each(function(cmd) {
            var text = cmd[0];
            var fn = self[cmd[1] + "Window"].bind(self);
            var ele = Element.from(templates.menuitem({text:text}));
            ele.addEvent("click", function(e) {
                    dropdownMenu.hideMenu();
                    fn();
                });
            dropdownMenu.appendChild(ele);
        });

        // var dropdown = new Element("div");
        // dropdown.addClass("dropdown-tab");
        // dropdown.appendChild(new Element("img", {
        //     src: qwebirc.global.staticBaseURL + "images/icon.png",
        //     title: "menu",
        //     alt: "menu"
        // }));

        var dropdownEffect = new Fx.Tween(dropdown, {
            duration: "long",
            property: "opacity",
            link: "chain"
        });

        dropdownEffect.start(0.25)
                    .start(1)
                    .start(0.33)
                    .start(1);

        ui.decorateDropdown(dropdown,dropdownMenu, {
            onShow: function() {
                if(self.hideHint)
                    self.hideHint();
                delete self.hideHint;
            }
        });
        return dropdown;
    },

    hotkeys: {
        keyboard: {
            focusInput: {
                keys: 'space',
                description: '',
                handler: function(e) {
                    e.stop();
                    if(this.scope.active.$inputbox) this.scope.active.$inputbox.focus();
                }
            },
            nextWindow: {
                keys: 'right',
                description: '',
                handler: function() {
                    this.scope.nextWindow();
                }
            },
            prevWindow: {
                keys: 'left',
                description: '',
                handler: function() {
                    this.scope.prevWindow();
                }
            }
        },

        input: {
            bold: {
                keys: 'ctrl+b',
                description: '',
                handler: _.partial(util.wrapSelected, '.window:not(.hidden) .input .input-field', util.getStyleByName('bold').bbcode)
            },
            italic: {
                keys: 'ctrl+i',
                description: '',
                handler: _.partial(util.wrapSelected, '.window:not(.hidden) .input .input-field', util.getStyleByName('italic').bbcode)
            },
            underline: {
                keys: 'ctrl+u',
                description: '',
                handler: _.partial(util.wrapSelected, '.window:not(.hidden) .input .input-field', util.getStyleByName('underline').bbcode)
            },
            colour: {
                keys: 'ctrl+c',
                description: '',
                handler: _.partial(util.wrapSelected, '.window:not(.hidden) .input .input-field', util.getStyleByName('colour').bbcode)
            }
        }
    },

    setHotKeys: function () {
        var self = this, 
            keyboard = this.keyboard = new Keyboard({active: true}).addShortcuts(self.hotkeys.keyboard),
            inputKeyboard = new Keyboard({active: false}).addShortcuts(self.hotkeys.input);;
            keyboard.scope = self;


        // document.addEvent("keydown", self.__handleHotkey);

        document.addEvents({
            "blur:relay(input)": function() {
                keyboard.activate();
            },
            "focus:relay(input)": function() {
                inputKeyboard.activate();
            },
            "keydown": function(e) { // pressing 1 2 3 4 etc will change tab
                if(keyboard.isActive() && !isNaN(e.key)) {
                    if(e.key <= self.windowArray.length)
                        self.selectWindow(e.key - 1);
                }
            }
        });
    },

    //the effect on page load
    __createDropdownHint: function() {
        var dropdownhint = Element.from(templates.dropdownhint());
        dropdownhint.inject(this.parentElement)
                    .position({
                        relativeTo: this.outerTabs,
                        position: {'y': 'bottom'},
                        offset: {y:10}
                    });

        new Fx.Morph(dropdownhint, {
            duration: "normal",
            transition: Fx.Transitions.Sine.easeOut
        }).start({
            left: [900, 5]
        });

        var hider = function() {
                new Fx.Morph(dropdownhint, {
                    duration: "long"
                }).start({
                    left: [5, -900]
                });
            }.delay(4000);

        var hider2 = this.hideHint = _.partial(Element.destroy, dropdownhint);

        hider2.delay(4000);

        document.addEvents({
            "mousedown:once": hider2,
            "keydown:once": hider2
        });
    },

    //todo use other dropdown menu code
    __createChannelMenu: function() {
        var self = this,
            client = self.getActiveIRCWindow().client;

        client.getPopularChannels(
            function(chans) {
                chans = _.chain(chans).take(self.options.maxChansMenu || 10)
                            .map(function(chan) {
                                return {
                                    text: chan.channel,
                                    value: chan.channel,
                                    hint: chan.users
                                };
                            })
                            .value();
                var menu = Element.from(templates.chanmenu({
                        channels: chans
                    })),
                    btn = self.outerTabs.getElement('.add-chan'),
                    btnmenu = btn.retrieve('menu');

                if(btnmenu) {
                    menu.replaces(btnmenu)
                        .position.delay(50, menu.parentElement, {
                            relativeTo: btn,
                            position: {x: 'left', y: 'bottom'},
                            edge: {x: 'left', y: 'top'}
                        });
                }
                else {
                    var wrapper = new Element('div').inject(self.parentElement).adopt(menu);
                    ui.decorateDropdown(btn, wrapper);
                    wrapper.addEvent("click:relay(a)", function(e, target) {
                        var chan = target.get('data-value');
                        client.exec("/JOIN " + chan);
                    });
                }
                btn.store('menu', menu);

                if(!menu.parentElement.isDisplayed())
                    menu.parentElement.showMenu();
            });
        },

    newClient: function(client) {
        this.parentElement.swapClass('signed-out','signed-in');
        return this.parent(client);
    },

    setWindow: function(win) {
        this.qjsui.setWindow(win);
    },

    //called in context of irc client
    nickChange: function(data) {
        if(data.thisclient) {
            _.each(this.windows, function(win) {
                win.$nicklabel.set("text", data.newnick);
            });
        }
    }
});

ui.QUI.JSUI = new Class({
    Implements: [Events],
    initialize: function(class_, parent, sizer) {
        this.parent = parent;
        this.windows = [];

        this.sizer = $defined(sizer) ? sizer : parent;

        this.class_ = class_;
        this.create();

        // this.reflowevent = null;
    },
    create: function() {

        var top = this.top = Element.from(templates.topPane()),
            windows = this.winContainer = Element.from(templates.windowsPane()),
            detach = this.detachContainer = Element.from(templates.detachedPane());
        this.parent.adopt(top, windows, detach);
    },

    createWindow: function() {
        var win = {
            'window': Element.from(templates.windowPane()),
            'topic': Element.from(templates.topicPane()),
            'content': Element.from(templates.contentPane()),
            'middle': Element.from(templates.leftPane()),
            'right': Element.from(templates.nickPane()),
            'properties': Element.from(templates.propertiesPane()),
            'bottom': Element.from(templates.inputPane())
        };

        win.content.adopt(win.middle, win.right);
        win.window.adopt(win.topic, win.content, win.properties, win.bottom);
        this.winContainer.appendChild(win.window);
        this.windows.push(win);

        return win;
    },
    setWindow: function(newWin) {
        this.windows.each(function (win) {
            if(win.detached !== true) {
                win.window.hide();
            }
        });
        newWin.window.show();
    }
});


ui.Theme = new Class({
    initialize: function(themeDict) {
        var self = this,
            defaults = _.extend({}, ui.themes.Default2, themeDict);
        
        var thememap = _.map(ui.themes.ThemeControlCodeMap2, function(str) {
            return util.formatterSafe(str, ui.themes.ThemeControlCodeMap2);
        });
        self.__theme = _.map(defaults, function(str) {
            return util.formatterSafe(str, thememap);
        });

        self.highlightClasses.channels = {};
    },

//I'm under the assumption i dont need to strip tags as handlebars should escape them for me

    formatMessage: function($ele, type, _data, highlight) {
        var self = this,
            isobj = _.isObject(_data),
            data = isobj ? _.clone(_data) : _data, //sometimes an internal reference
            val;

        if(isobj) {

            if (data["n"]){
                data["N"] = "qwebirc://whois/" + data.n + "/";
            }
            //now all we have to do is format the data as desired and pass to theme
            _.each(["N", "m", "c"], function(key) {//urlerize message and nick
                val = data[key];
                if(val) {
                    if(_.isArray(val)) { //modes are given as an array so we need to fold
                        val = val.join("");
                    }
                    data[key] = self.urlerize(val);
                }
            });
        }

        var themed = type ? self.message(type, data, highlight) : data;
        var result = self.colourise(themed);
        $ele.addClass('colourline')
            .adopt(Elements.from(result));//insertAdjacentHTML may render escaped chars incorrectly
        return result;
    },

    formatElement: function(line, $ele) {
        var result = this.colourise(this.urlerize(line));
        $ele.addClass('colourline')
            .adopt(Elements.from(result));
        return result;
    },

    message: function(type, data, highlight) {
        // if(highlight) data = _.extend({}, data, this.__ccmaph)
        return util.formatter(this.__theme[type], data);//most formatting done on init
    },

    colourise: function(line) {//http://www.mirc.com/colors.html http://www.aviran.org/2011/12/stripremove-irc-client-control-characters/
        //regexs are cruel to parse this thing

        var result = line;

        var styles = irc.styles;

        var parseArr = result.split(styles.colour.key).filter( $chk );

        //crude mapper for matching the start of a colour string to its end token may be possible to do with reduce?
        var colouredarr = [[]]; //will be an array of subarrays for each coloured string

        _.each(parseArr, function(str) {//help
            if( isNaN(str.slice(0, 2).toInt()) ) { //^C...
                colouredarr.push([]);
            } else { //^C1***
                _.last(colouredarr).push(str);
            }
        });

        _.each(colouredarr, function(colourarr) {
            _.each(colourarr, function(str) {
                var colourMatch = str.match(styles.colour.fore_re),
                    backgroundMatch = str.match(styles.colour.back_re),
                    colour = util.getColourByKey(_.item(colourMatch, 0)),
                    background = util.getColourByKey(_.last(backgroundMatch));//num aft num + comma

                var html = templates.ircstyle({
                    'colour': (colour ? colour.fore : ""),
                    'background': (background ? background.back : ""),
                    'text': str.slice(backgroundMatch ? backgroundMatch[0].length : colourMatch ? colourMatch[0].length : 0)
                });


                result = result.replace(styles.colour.key + str, html);
            });
        });

        //matching styles (italics bold under)
        _.each(styles.special, function(style) {//i wish colours were this easy
            result = result.replace(style.keyregex, function(match, text) {
                return templates.ircstyle({
                    'style': style.style,
                    'text': text
                });
            });
        });

        return result;
    },

    urlerize: function(text) {
        return util.urlifier.parse(text);
    },

    messageParsers: [
        {
            type: /NOTICE$/,
            classes: '',
            flash: true,
            beep: true,
            id: 'on_notice',
            highlight: ui.HILIGHT_SPEECH
        },
        {
            type: /PRIVMSG$/,
            flash: true,
            beep: true,
            id: 'on_pm',
            highlight: ui.HILIGHT_SPEECH
        },
        {
            type: /^OUR/,
            classes: 'our-msg'
        },
        {//match bots
            nick: /(^tf2)|((serv|bot)$)/i,
            classes: 'bot',
            types: [ui.WINDOW_CHANNEL]
        },
        {
            msg: /^\!/,
            classes: 'command',
            types: [ui.WINDOW_CHANNEL]
        },
        {
            mentioned: true,
            highlight: 'mentioned',
            notus: true,
            tabhl: ui.HILIGHT_US
        },
        {
            nick: /^((?!(^tf2|bot$|serv$)).)*$/i,
            mentioned: true,
            classes: '',
            beep: true,
            flash: true,
            notus: true,
            id: 'on_mention'//for filtering
        },
        {
            nick: /^((?!(^tf2|bot$|serv$)).)*$/i,
            msg: /^((?!(^\!)).)*$/, //dont hl commands
            classes: '',
            highlight: true,
            notus: true,
            id: 'highlighter',
            tabhl: ui.HILIGHT_ACTIVITY,
            types: [ui.WINDOW_CHANNEL]
        }
    ],

    highlightClasses: ['highlight1', 'highlight2'/*, 'highlight3'*/],

    highlightAndNotice: function(data, type, win, $ele) {
        var self = this,
            tabHighlight = ui.HILIGHT_NONE,
            highlights = self.highlightClasses,
            notus = !(/^OUR/.test(type)),
            parsers = _.clone(self.messageParsers).concat(self.customNotices);

        if(data && type && /(NOTICE|ACTION|MSG)$/.test(type)) {
            if(data.m)
                $ele.addClass('message');
            _.each( parsers , function(parser) {
                //sorry little crazy :)
                if( (!parser.notus || notus) &&//implications - organized them by complexity
                    (!parser.types || parser.types.contains(win.type)) &&
                    (!parser.type || parser.type.test(type)) && 
                    (!parser.msg || parser.msg.test(data.m)) &&
                    (!parser.nick || parser.nick.test(data.n)) &&
                    (!parser.mentioned || util.testForNick(win.client.nickname, data.m)) )
                {
                    if((!win.active && win.name !== BROUHAHA) || (!document.hasFocus()) ) {
                        if(parser.flash) {
                            win.parentObject.flash({
                                body: util.formatter("{nick}{channel}: {message}", data)
                            });
                        }
                        if(parser.beep) {
                            win.parentObject.beep();
                        }
                    }   
                    if(parser.highlight) {
                        if(!highlights.channels[win.name]) highlights.channels[win.name] = 0;
                        $ele.addClass(Type.isBoolean(parser.highlight) ? highlights.next(highlights.channels[win.name]++) : parser.highlight);
                    }
                    if($chk(parser.classes)) {
                        $ele.addClass(parser.classes);
                    }
                    tabHighlight = Math.max(tabHighlight, parser.tabhl);
                }
            });
        }
        return tabHighlight;
    }
});


ui.AboutPane = new Class({
    Implements: [Events],
    initialize: function(parent) {
        var delayfn = function() {
            parent.set("html", templates.loadingPage());
        };
        var cb = delayfn.delay(500);

        var r = ui.RequestTransformHTML({
            url: qwebirc.global.staticBaseURL + "panes/about.html",
            update: parent,
            onSuccess: function() {
                $clear(cb);
                parent.getElement("input[class=close]").addEvent("click", function() {
                    this.fireEvent("close");
                }.bind(this));
                parent.getElement("div[class=version]").set("text", "v" + qwebirc.VERSION);
            }.bind(this)
        });
        r.get();
    }
});

ui.PrivacyPolicyPane = new Class({
    Implements: [Events],
    initialize: function(parent) {
        var delayfn = function() {
            parent.set("html", templates.loadingPage());
        };
        var cb = delayfn.delay(500);

        var r = ui.RequestTransformHTML({
            url: qwebirc.global.staticBaseURL + "panes/privacypolicy.html",
            update: parent,
            onSuccess: function() {
                $clear(cb);

                parent.getElement("input[class=close]").addEvent("click", function() {
                    this.fireEvent("close");
                }.bind(this));
            }.bind(this)
        });
        r.get();
    }
});

ui.FeedbackPane = new Class({
    Implements: [Events],
    initialize: function(parent) {
        this.textboxVisible = false;
        var delayfn = function() {
            parent.html(templates.loadingPage());
        };
        var cb = delayfn.delay(500);

        this.addEvent("select", this.onSelect);

        var r = ui.RequestTransformHTML({
            url: qwebirc.global.staticBaseURL + "panes/feedback.html",
            update: parent,
            onSuccess: function() {
                $clear(cb);
                parent.getElement("input[class=close]").addEvent("click", function() {
                    this.fireEvent("close");
                }.bind(this));
                parent.getElement("input[class=close2]").addEvent("click", function() {
                    this.fireEvent("close");
                }.bind(this));

                var textbox = parent.getElement("textarea");
                this.textbox = textbox;
                parent.getElement("input[class=submitfeedback]").addEvent("click", function() {
                    this.sendFeedback(parent, textbox, textbox.value);
                }.bind(this));

                this.textboxVisible = true;
                this.onSelect();
            }.bind(this)
        });
        r.get();
    },
    onSelect: function() {
        if (this.textboxVisible)
            this.textbox.focus();
    },
    sendFeedback: function(parent, textbox, text) {
        text = text.replace(/^\s*/, "").replace(/\s*$/, "");
        var mainText = parent.getElement("p[class=maintext]");

        if (text.length < 25) {
            /* TODO: lie and throw away */
            mainText.text("I don't suppose you could enter a little bit more? Thanks!");
            textbox.focus();
            return;
        }

        this.textboxVisible = false;
        var mainBody = parent.getElement("div[class=enterarea]");
        mainBody.setStyle("display", "none");

        var messageBody = parent.getElement("div[class=messagearea]");
        var messageText = parent.getElement("p[class=messagetext]");
        var messageClose = parent.getElement("input[class=close2]");

        messageText.set("text", lang.submittingPage.message);
        messageBody.setStyle("display", "");

        /* basic checksum to stop really lame kiddies spamming */
        var checksum = 0;
        var esctext = encodeURIComponent(text);
        for (var i = 0; i < text.length; i++)
            checksum = ((checksum + 1) % 256) ^ (text.charCodeAt(i) % 256);

        var r = new Request({
            url: qwebirc.global.dynamicBaseURL + "feedback",
            onSuccess: function() {
                messageText.set("text", "Submitted successfully, thanks for the feedback!");
                messageClose.setStyle("display", "");
            },
            onFailure: function() {
                this.textboxVisible = true;
                messageBody.setStyle("display", "none");
                mainBody.setStyle("display", "");
                mainText.set("text", "Looks like something went wrong submitting :(");
            }.bind(this)
        }).send("feedback=" + text + "&c=" + checksum);
    }
});

ui.FAQPane = new Class({
    Implements: [Events],
    initialize: function(parent) {
        var delayfn = function() {
            parent.set("html", templates.loadingPage());
        };
        var cb = delayfn.delay(500);

        var r = ui.RequestTransformHTML({
            url: qwebirc.global.staticBaseURL + "panes/faq.html",
            update: parent,
            onSuccess: function() {
                $clear(cb);
                parent.getElement("input[class=close]").addEvent("click", function() {
                    this.fireEvent("close");
                }.bind(this));
            }.bind(this)
        });
        r.get();
    }
});



/* NEEDS converting to plain HTML! */
ui.EmbedWizardStep = new Class({
    Implements: [Options, Events],
    options: {
        "title": "",
        "first": "",
        "hint": "",
        "middle": null,
        "premove": null,
        "example": ""
    },
    initialize: function(parent, options) {
        this.setOptions(options);
        this.parent = parent;
    },
    show: function() {
        this.parent.title.set("html", this.options.title);
        this.parent.firstRow.set("html", this.options.first);
        this.parent.hint.set("html", this.options.hint);
        this.parent.example.set("text", this.options.example);

        while (this.parent.middleRow.childNodes.length > 0)
        this.parent.middleRow.removeChild(this.parent.middleRow.childNodes[0]);

        if ($defined(this.options.middle))
            this.parent.middleRow.appendChild(this.options.middle);

        this.fireEvent("show");
    }
});

ui.EmbedWizard = new Class({
    Implements: [Options, Events],
    options: {
        uiOptions: null,
        optionsCallback: null,
        baseURL: "http://webchat.quakenet.org/"
    },
    initialize: function(parent, options) {
        /* for some unknown reason setOptions doesn't work... */
        this.options.uiOptions = options.uiOptions;
        this.options.baseURL = options.baseURL;
        this.options.optionsCallback = options.optionsCallback;
        this.create(parent);
        this.addSteps();
    },
    create: function(parent) {
        this.t = parent;

        var titleRow = this.newRow();
        this.title = new Element("h2");
        this.title.setStyle("margin-top", "0px");
        this.title.setStyle("margin-bottom", "5px");
        titleRow.appendChild(this.title);

        this.firstRow = this.newRow();
        this.middleRow = this.newRow();
        var hintRow = this.newRow();
        this.hint = new Element("div");
        this.hint.setStyle("font-size", "0.8em");
        this.hint.setStyle("font-style", "italic");
        hintRow.appendChild(this.hint);
        var exampleRow = this.newRow();
        this.example = new Element("pre");
        exampleRow.appendChild(this.example);

        var nextRow = this.newRow();
        nextRow.addClass("wizardcontrols");
        var backBtn = new Element("input");
        backBtn.type = "submit";
        backBtn.value = "< Back";
        backBtn.addEvent("click", this.back.bind(this));
        nextRow.appendChild(backBtn);

        var nextBtn = new Element("input");
        nextBtn.type = "submit";
        nextBtn.value = "Next >";
        nextRow.appendChild(nextBtn);
        nextBtn.addEvent("click", this.next.bind(this));

        this.nextBtn = nextBtn;
        this.backBtn = backBtn;
    },
    newRow: function() {
        var cell = new Element("div");
        this.t.appendChild(cell);
        return cell;
    },
    newStep: function(options) {
        return new ui.EmbedWizardStep(this, options);
    },
    newRadio: function(parent, text, name, selected) {
        var p = new Element("div");
        parent.appendChild(p);

        var id = util.generateID();
        var r = util.createInput("radio", p, name, selected, id);

        var label = new Element("label", {
            "for": id
        });
        label.appendChild(document.createTextNode(text));
        p.appendChild(label);

        return r;
    },
    addSteps: function() {
        var af = function(select) {
            if (Browser.Engine.trident) {
                var f = function() {
                    this.focus();
                    if (select)
                        this.select();
                };
                f.delay(100, this, []);
            } else {
                this.focus();
                this.select();
            }
        };

        this.welcome = this.newStep({
            "title": "Add webchat to your website",
            "first": "This wizard will help you create an embedded client by asking you questions then giving you the code to add to your website.<br/><br/>You can use the <b>Next</b> and <b>Back</b> buttons to navigate through the wizard; click <b>Next</b> to continue."
        });

        this.chanBox = new Element("input");
        this.chanBox.addClass("text");
        this.chans = this.newStep({
            "title": "Set channels",
            "first": "Enter the channels you would like the client to join on startup:",
            "hint": "You can supply multiple channels by seperating them with a comma, e.g.:",
            "example": "#rogue,#eu-mage",
            middle: this.chanBox
        }).addEvent("show", af.bind(this.chanBox));

        var customnickDiv = new Element("div");
        this.customnick = this.newStep({
            "title": "Choose a nickname mode",
            "first": "At startup would you like the client to use a random nickname, a preset nickname or a nickname of the users choice?",
            "hint": "It is recommended that you only use a preset nickname if the client is for your own personal use.",
            middle: customnickDiv
        });

        this.choosenick = this.newRadio(customnickDiv, "Make the user choose a nickname.", "nick", true);
        this.randnick = this.newRadio(customnickDiv, "Use a random nickname, e.g. qwebirc12883.", "nick");
        this.presetnick = this.newRadio(customnickDiv, "Use a preset nickname of your choice.", "nick");

        var promptdiv = new Element("form");
        this.connectdialog = this.newStep({
            "title": "Display connect dialog?",
            "first": "Do you want the user to be shown the connect dialog (with the values you have supplied pre-entered) or just a connect confirmation?",
            middle: promptdiv,
            "hint": "You need to display the dialog if you want the user to be able to set their nickname before connecting."
        });

        var changeOptions = new Element("div");
        this.currentLF = this.newRadio(changeOptions, "Use the current look and feel (", "lookandfeel", true);

        var alterButton = new Element("input");
        alterButton.type = "submit";
        alterButton.value = "alter";
        alterButton.addEvent("click", this.options.optionsCallback);
        changeOptions.firstChild.appendChild(alterButton);
        changeOptions.firstChild.appendChild(document.createTextNode(")."));

        this.defaultLF = this.newRadio(changeOptions, "Use the default look and feel.", "lookandfeel");

        this.lookandfeel = this.newStep({
            "title": "Configure look and feel",
            "first": "The look and feel will be copied from the current settings.",
            middle: changeOptions
        });

        var autoconnect = this.newRadio(promptdiv, "Connect without displaying the dialog.", "prompt", true);
        this.connectdialogr = this.newRadio(promptdiv, "Show the connect dialog.", "prompt");

        this.nicknameBox = new Element("input");
        this.nicknameBox.addClass("text");
        this.nickname = this.newStep({
            "title": "Set nickname",
            "first": "Enter the nickname you would like the client to use by default:",
            "premove": function() {
                if (this.nicknameBox.value == "") {
                    alert("You must supply a nickname.");
                    this.nicknameBox.focus();
                    return false;
                }
                var v = qwebirc.global.nicknameValidator.validate(this.nicknameBox.value, true);
                if (v != this.nicknameBox.value) {
                    this.nicknameBox.value = v;
                    alert("The supplied nickname was invalid and has been corrected.");
                    this.nicknameBox.focus();
                    return false;
                }
                return true;
            }.bind(this),
            middle: this.nicknameBox,
            hint: "If you use a . (dot/period) then it will be substituted with a random number."
        }).addEvent("show", af.bind(this.nicknameBox));

        var codeDiv = new Element("div");
        this.finish = this.newStep({
            "title": "Finished!",
            "first": "Your custom link is:",
            middle: codeDiv
        }).addEvent("show", function() {
            var alink = new Element("a");
            var abox = new Element("input");
            abox.addClass("iframetext");
            var url = this.generateURL(false);

            alink.href = url;
            alink.target = "_blank";
            alink.appendChild(document.createTextNode(url));
            abox.value = "<iframe src=\"" + url + "\" width=\"647\" height=\"400\"></iframe>";

            var mBox = [
                alink,
                new Element("br"), new Element("br"),
                document.createTextNode("You can embed this into your page with the following code:"),
                new Element("br"),
                abox
            ];

            while (codeDiv.childNodes.length > 0)
                codeDiv.removeChild(codeDiv.childNodes[0]);

            mBox.forEach(function(x) {
                codeDiv.appendChild(x);
            });

            af.bind(abox)(true);
            abox.addEvent("click", function() {
                this.select();
            }.bind(abox));
        }.bind(this));

        this.updateSteps();
        this.step = 0;

        this.showStep();
    },
    updateSteps: function() {
        this.steps = [this.welcome, this.customnick];

        if (this.presetnick.checked)
            this.steps.push(this.nickname);

        this.steps.push(this.chans);

        if (this.chanBox.value != "" && !this.choosenick.checked)
            this.steps.push(this.connectdialog);

        this.steps.push(this.lookandfeel);
        this.steps.push(this.finish);
    },
    showStep: function() {
        this.backBtn.disabled = !(this.step > 0);

        this.nextBtn.value = (this.step >= this.steps.length - 1) ? "Close" : "Next >";

        this.steps[this.step].show();
    },
    next: function() {
        var pm = this.steps[this.step].options.premove;

        if (pm && !pm())
            return;

        this.updateSteps();
        if (this.step >= this.steps.length - 1) {
            this.close();
            return;
        }
        this.step = this.step + 1;
        this.showStep();
    },
    close: function() {
        this.fireEvent("close");
    },
    back: function() {
        if (this.step <= 0)
            return;

        this.step = this.step - 1;
        this.showStep();
    },
    generateURL: function() {
        var chans = this.chanBox.value;
        var nick = this.nicknameBox.value;
        var connectdialog = this.connectdialogr.checked && chans != "" && !this.choosenick.checked;

        var URL = [];
        if (this.presetnick.checked) {
            URL.push("nick=" + escape(nick));
        } else if (!this.choosenick.checked) {
            URL.push("randomnick=1");
        }

        if (chans) {
            // var d = chans.split(",");
            // var d2 = [];

            // d.forEach(function(x) {
            //     if (x.charAt(0) == '#')
            //         x = x.substring(1);

            //     d2.push(x);
            // });

            var chanstr = util.unformatChannelString(chans);

            URL.push("channels=" + escape(chanstr));
        }

        if (connectdialog)
            URL.push("prompt=1");

        if (this.currentLF.checked) {
            var uioptions = this.options.uiOptions.serialise();
            if (uioptions != "")
                URL.push("uio=" + uioptions);
        }

        return this.options.baseURL + (URL.length > 0 ? "?" : "") + URL.join("&");
    }
});



//not a class?
ui.MENU_ITEMS = (function() {
    function isOpped(nick) {
        var channel = this.name; /* window name */
        var myNick = this.client.nickname;

        return this.client.nickOnChanHasAtLeastPrefix(myNick, channel, "@");
    }

    function isVoiced(nick) {
        var channel = this.name;
        var myNick = this.client.nickname;

        return this.client.nickOnChanHasPrefix(myNick, channel, "+");
    }

    function targetOpped(nick) {
        var channel = this.name;
        return this.client.nickOnChanHasPrefix(nick, channel, "@");
    }

    function targetVoiced(nick) {
        var channel = this.name;
        return this.client.nickOnChanHasPrefix(nick, channel, "+");
    }

    function command(cmd) {
        return function(nick) {
            this.client.exec("/" + cmd + " " + nick);
        };
    }

    return [{
        text: "whois",
        fn: command("whois"),
        predicate: true
    }, {
        text: "query",
        fn: command("query"),
        predicate: true
    }, {
        text: "slap",
        fn: function(nick) {
            this.client.exec("/ME " + util.formatter(lang.fishSlap, {
                'nick': nick
            }));
        },
        predicate: true
    }, {
        text: "kick",
        /* TODO: disappear when we're deopped */
        fn: function(nick) {
            this.client.exec("/KICK " + nick + " wibble");
        },
        predicate: isOpped
    }, {
        text: "op",
        fn: command("op"),
        predicate: _.and(isOpped, _.not(targetOpped))
    }, {
        text: "deop",
        fn: command("deop"),
        predicate: _.and(isOpped, targetOpped)
    }, {
        text: "voice",
        fn: command("voice"),
        predicate: _.and(isOpped, _.not(targetVoiced))
    }, {
        text: "devoice",
        fn: command("devoice"),
        predicate: _.and(isOpped, targetVoiced)
    }];
})();


ui.RequestTransformHTML = function(options) {
    var HREF_ELEMENTS = ["IMG"];

    var $update = options.update;
    var onSuccess = options.onSuccess;

    var fixUp = function(node) {
            if (node.nodeType !== Node.ELEMENT_NODE)
                return;

            if (HREF_ELEMENTS.contains(node.nodeName.toUpperCase())) {
                var attr = node.getAttribute("transform_attr");
                var value = node.getAttribute("transform_value");
                if ($defined(attr) && $defined(value)) {
                    node.removeProperties("transform_attr", "transform_value")
                        .setProperty(attr, qwebirc.global.staticBaseURL + value);
                }
            }

            Array.each(node.childNodes, fixUp);
        };

    delete options["update"];
    options.onSuccess = function(tree, elements, html, js) {
        var container = new Element("div", {'html': html});
        fixUp(container);
        $update.empty();

        Array.each(container.childNodes, function(node) {
            node.swapParent($update);
        });
        onSuccess();
    };

    return new Request.HTML(options);
};


// ui.HilightController = new Class({
//     initialize: function(parent) {
//         this.parent = parent;
//         this.regex = null;
//         this.prevnick = null;
//     },
//     match: function(text) {
//         var nick = this.parent.nickname;
//         if (nick !== this.prevnick) {
//             var classes = '[\\s\\.,;:]';
//             this.regex = new RegExp('(^|' + classes + ')' + RegExp.escape(nick) + '(' + classes + '|$)', "i");
//         }
//         return this.regex.test(text);
//     }
// });


ui.TabCompleterFactory = new Class({
    initialize: function(ui) {
        this.ui = ui;
        this.reset();
    },
    tabComplete: function(textBox) {
        var text = textBox.value;

        if (!$defined(this.obj)) {
            this.incr = 1;

            var win = this.ui.getActiveWindow();
            if (!win)
                return;

            var startingWord = util.getEnclosedWord(text, util.getCaretPos(textBox));
            var preword = "",
                word = "",
                postword = "";
            if ($defined(startingWord)) {
                preword = text.substring(0, startingWord[0]);
                word = startingWord[1];
                postword = text.substring(startingWord[0] + word.length);
            }

            var ltext = text.toLowerCase(),
                obj;
            if (!text) {
                preword = "/msg ";
                obj = ui.QueryTabCompleter;
            } else if (util.isChannel(word)) {
                obj = ui.ChannelNameTabCompleter;
            } /*else if (false //ltext.match(/^\/(q|query|msg) /i) ) {
                obj = ui.QueryTabCompleter;
            }*/ else if (win.type === ui.WINDOW_QUERY) {
                obj = ui.QueryNickTabCompleter;
            } else if (win.type === ui.WINDOW_CHANNEL) { /* "slug[TAB]" == "slug: " */
                if (!preword) {
                    // if ( !! postword && postword.charAt(0) === " ") {
                    //     postword = ":" + postword; //should i call util.padcolon here?
                    // } else {
                    //     postword = ": " + postword;
                    // }
                    postword = ": " + postword.trimLeft();

                    this.incr++;
                }
                obj = ui.ChannelUsersTabCompleter;
            } else {
                return;
            }

            if (postword === "")
                postword = " ";

            this.obj = new obj(preword, word, postword, win);
            if (!$defined(this.obj))
                return;
        }

        var ret = this.obj.get();
        if (!$defined(ret))
            return;

        textBox.value = ret[1];
        util.setCaretPos(textBox, ret[0] + this.incr);
    },
    reset: function() {
        this.obj = null;
    }
});

ui.TabIterator = new Class({
    initialize: function(client, prefix, list) {
        this.prefix = prefix;
        if (!$defined(list) || list.length === 0) {
            this.list = null;
        } else {
            var prefixes = irc.toIRCCompletion(client, prefix);

            this.list = _.filter(list, _.compose(util.prefixOnNick(prefixes), _.partial(irc.toIRCCompletion, client)));
        }

        this.pos = -1;
    },
    next: function() {
        /*
         * ideally next would do the list gubbins recursively, but no JS engine currently
         * support tail recursion :(
         */
        if (!$defined(this.list))
            return null;

        this.pos = this.pos + 1;
        if (this.pos >= this.list.length)
            this.pos = 0;

        return this.list[this.pos];
    }
});

ui.BaseTabCompleter = new Class({
    initialize: function(client, prefix, existingNick, suffix, list) {
        this.existingNick = existingNick;
        this.prefix = prefix;
        this.suffix = suffix;
        this.iterator = new ui.TabIterator(client, existingNick, list);
    },
    get: function() {
        var n = this.iterator.next();
        if (!$defined(n))
            return null;

        var p = this.prefix + n;
        return [p.length, p + this.suffix];
    }
});

ui.QueryTabCompleter = new Class({
    Extends: ui.BaseTabCompleter,
    initialize: function(prefix, existingNick, suffix, win) {
        this.parent(win.client, prefix, existingNick, suffix, win.client.lastNicks);
    }
});

ui.QueryNickTabCompleter = new Class({
    Extends: ui.BaseTabCompleter,
    initialize: function(prefix, existingText, suffix, win) {
        var chan = win.name;
        this.parent(win.client, prefix, existingText, suffix, [chan]);
    }
});

ui.ChannelNameTabCompleter = new Class({
    Extends: ui.BaseTabCompleter,
    initialize: function(prefix, existingText, suffix, win) {

        var l = [];
        _.each(win.client.channels, function(chan, name) {
            if(chan && chan.lastSelected) {
                chan = chan.lastSelected;
            }
            l.push([chan, name]);
        });

        var l2 = _.sort(l, function(a, b) {
            return b[0] - a[0];
        }).map(item(1));

        this.parent(win.client, prefix, existingText, suffix, l2);
    }
});

ui.ChannelUsersTabCompleter = new Class({
    Extends: ui.BaseTabCompleter,
    initialize: function(prefix, existingText, suffix, win) {
        var nc = win.client.tracker.getSortedByLastSpoke(irc.activeChannel);

        this.parent(win.client, prefix, existingText, suffix, nc);
    }
});




(function(){

config.OptionModel = new Class({
    Extends: Epitome.Model.Storage,
    options: {
        defaults: {
            "flash_on_mention": true,
            "dedicated_msg_window": false,
            "dedicated_notice_window": true,
            "nick_ov_status": true,
            "accept_service_invites": true,
            "use_hiddenhost": true,
            "lastpos_line": true,
            "nick_colours": false,
            "hide_joinparts": true,
            "style_hue": 210,
            "style_saturation": 0,
            "style_brightness": 0,
            "query_on_nick_click": true,
            "show_nicklist": true,
            "show_timestamps": true,
            "font_size": 12,
            "volume": 100,

            "dn_state": false,
            "dn_duration": 4000,

            "highlight": true,
            "highlight_mentioned": true,

            "notices": {
                "on_mention": {flash:true, beep:true},
                "on_pm": {flash:true, beep:true},
                "on_notice": {flash:false, beep:true}
            },
            "custom_notices": [],
            "default_notice": function() {
                return {
                        nick: null,
                        msg: '',
                        flash: false,
                        beep: false,
                        id: String.uniqueID(),
                        autoescape: true
                    }
                }
        },
        key: "qweboptions",
        minimize: true
    },

    save: function() {
        this.set("custom_notices", _.reject(this.get("custom_notices"), function(data) { return data.msg.trim() === "" }));//cleanup
        return this.parent();
    }
});

function render() {
    return this.render();
}

ui.OptionView = new Class({
    Extends: Epitome.View,
    Binds: ['render', 'save', 'reset'],
    options: {
        template: templates.options,
        // 'onChange:model': render,
        events: {
            'change:relay(#options input)': 'inputChange',
            'change:relay(#options #standard-notices input)': 'snoticeChange',
            'change:relay(#options #custom-notices input)': 'noticeChange',
            'click:relay(#options #add-notice)': 'addNotifier',
            'click:relay(#options #custom-notices .remove-notice)': 'removeNotifier',
            'click:relay(#options #dn_state)': 'dnToggle',
            'click:relay(#options #notice-test)': 'noticeTest'
        },

        // onInputChange: function(e, target) {//set model values when inputs are clicked
        //     var id = target.get('id');

        //     //handle sub props
        //     if(id && $defined(this.model.get(id))) {
        //         this.model.set(id, target.val());
        //     }
        // },

        onSnoticeChange: function(e, target) {
            e.stop();
            var notices = _.clone(this.model.get('notices'));
            _.assign(notices, target.get('id'), target.val());
            this.model.set('notices', notices);
        },

        onNoticeChange: function(e, target) {
            e.stop();
            var notices = _.clone(this.model.get('custom_notices'));
            var par = target.getParent('.custom-notice');
            _.findWhere(notices, {id: par.id})[target.get('data-id')] = target.val();
            this.model.set('custom_notices', notices);
        },

        onAddNotifier: function(e) {
            e.stop();
            this.addNotifier();
        },

        onRemoveNotifier: function(e, target) {
            e.stop();
            var par = target.getParent('.custom-notice').dispose();
            this.model.set('custom_notices', (_.reject(this.model.get('custom_notices'), function(xs) {return xs.id === par.id})));
        },
        
        onDnToggle: function(e, target) {
            var self = this;
            if(notify.permissionLevel() !== notify.PERMISSION_GRANTED) {
                notify.requestPermission(function() {
                    self.model.set('dn_state', notify.permissionLevel() === notify.PERMISSION_GRANTED);
                });
            }
            else {
                self.model.set('dn_state', !self.model.get('dn_state'));
            }
            target.val(self.model.get('dn_state') ? lang.DISABLE : lang.ENABLE);
        },

        onReady: render
    },

    render: function() {
        var model = this.model,
            data = this.getData();
        this.element.html(this.template(data));

        _.each(data.custom_notices, function(notice) {
            notice.lang = lang;
            this.addNotifier(notice)
        }, this);

        // this.tabs = new MGFX.Tabs(this.element, {
        //     tabs: '.option-tabs li',
        //     content: '.tab-content .control-group'
        // });

        this.element.getElements(".slider").each(function(slider) {
            var id = slider.get('id'),
                knob = slider.getElement('.knob'),
                slider = new Slider(slider, knob, {
                    steps: 36,
                    range: [0, 369],
                    wheel: true
                });
            slider.addEvent("change", function(val) {
                    model.set(id, val);
                })
                .set(data[id])
        });

        this.element.getElement('#options').addEvents({ //default will fire before bubble
            'submit': this.save,
            'reset': this.reset
        });

        self.behavior = new Behavior().apply(this.element);

        this.parent();
        return this;
    },

    inputChange: function(e, target) {//set model values when inputs are clicked
        var id = target.get('id');

        //handle sub props
        if(id && $defined(this.model.get(id))) {
            this.model.set(id, target.val());
        }
    },

    addNotifier: function(data) {
        if(!data) {
            data = this.model.get("default_notice")();
            var n = _.clone(this.model.get("custom_notices"));
            n.push(data);
            this.model.set("custom_notices", n);
        }

        var parent = this.element.getElement('#custom-notices');

        var _data = _.clone(data);
        _data.lang = lang;

        var temp = templates.customNotice(_data);

        parent.insertAdjacentHTML('beforeend', temp);
    },

    getData: function() {
        var data = this.model.toJSON();
        data.lang = lang;
        return data;
    },

    empty: function() {
        this.parent(true);
    },

    save: function(e) {
        if(e) e.stop();
        this.model.save();
        this.destroy();
    },

    reset: function(e) {
        if(e) e.stop();
        this.model.sync();
        this.destroy();
    },

    destroy: function() {
        this.trigger('close');
        return this.parent();
    }
});
})();


//http://indiegamr.com/the-state-of-audio-in-html5-games/
//consider switching to soundjs
//http://www.createjs.com/Docs/SoundJS/modules/SoundJS.html

sound.SoundPlayer = new Class({
    Implements: [Options, Events],
    options: {
        soundManagersrc: "//cdnjs.cloudflare.com/ajax/libs/SoundJS/0.4.1/soundjs.min.js",
        sounds: "/sound/",
        beepsrc: "beep.mp3"
    },
    initialize: function(options) {
        this.setOptions(options);
        this.loadingSWF = false;
		this.sm = undefined; //sound manager
        this.sounds = {};
    },
    load: function() {
        window.addEvent("domready", this.loadSoundManager.bind(this));
        return this;
    },
    loadSoundManager: function() {
        var self = this,
			opts = self.options;
        if (self.loadingSWF !== false)
            return;
        self.loadingSWF = true;
        if ($defined(self.sm)) { //... ugh
            self.fireEvent("ready");
            return;
        }

        var soundinit = function() {
			//var sm = self.sm = window.soundManager;
			var sm = self.sm = window.createjs.Sound;
            sm.url = opts.sounds;

            //load all sounds here
            self.register("beep", opts.sounds + opts.beepsrc);
            sm.addEventListener("fileload", self.fireEvent.bind(self, "ready"));
            self.loadingSWF = undefined;
        };

		//load sound manager
        Asset.javascript(opts.soundManagersrc, {onLoad: soundinit});
    },
	register: function(alias,src) {
		this.sm.registerSound(src, alias);
		this.sounds[alias] = _.partial(this.sm.play, alias);
	},
    play: function(src) {
        this.sm.play(src);
        return this;
    },

    isReady: function() {
        return this.sm.isReady();
    }
});


util.parseStylesheet = function(data) {
    var lines = data.replace(/\r/g, "") //irnore double breaks
                    .split("\n");

    var rules = {},
        line, inx,
        i;
    for (var i = 0; i < lines.length; i++) {
        line = lines[i];

        if (line.trim() !== "" && (inx = line.indexOf("=", 2)) !== -1)
            rules[line.slice(0, inx)] = line.slice(inx + 1);
        else
            break;
    }

    var cssLines = lines.slice(i);
    // for (; i < lines.length; i++) //note its using the same i as above
    //     cssLines.push(lines[i]);

    return {
        cssText: cssLines.join("\n"),
        rules: rules
    };
};

util.getSyncAsset = function(url) {//todo async it
    var req = new Request({
        'url': url,
        'async': false
    });
    req.headers = {};
    var result;
    req.addEvent("complete", function(x) {
            result = x;
        })
        .get();
    return result;
};

ui.style.ModifiableStylesheet = new Class({
    initialize: function(url) {
        var n = util.parseStylesheet(util.getSyncAsset(url));

        this.__cssText = n.cssText;
        this.rules = n.rules;

        this.__tag = new Element("style", {
                        type: "text/css",
                        media: "all"
                    }).inject(document.head, 'bottom');
    },
    __setStylesheet: function(stylesheet) {
        var node = this.__tag;

        if (node.styleSheet) { /* IE */
            node.styleSheet.cssText = stylesheet;
        } else {
            node.empty()
                .appendText(stylesheet);
        }
    },
    set: function(mutatorfn) {
        mutatorfn = mutatorfn || $identity;

        var text = this.__cssText;

        Object.each(this.rules, function(val, key) {
            var getVal = mutatorfn.pass(val.split(","));

            text = text.replaceAll("$(" + key + ")", getVal);
        });

        this.__setStylesheet(text);
    }
});


ui.Window = new Class({
    Implements: [Events],
    Binds: ["sendInput"],
    initialize: function(parentObject, client, type, name, identifier) {
        this.parentObject = parentObject;
        this.type = type;
        this.currentChannel = this.name = name;
        this.active = false;
        this.client = client;
        this.identifier = identifier;
        this.hilighted = ui.HILIGHT_NONE;
        // this.scrolltimer = null;
        this.commandhistory = this.parentObject.commandhistory;
        // this.scrolleddown = true;
        // this.scrollpos = null;
        this.lastNickHash = {};
        this.lastSelected = null;
        this.subWindow = null;
        this.closed = false;

        this.window = this.parentObject.qjsui.createWindow();
    },
    updateTopic: function(topic, element) {
        this.parentObject.theme.formatElement("[" + topic + "]", element);
    },
    close: function() {
        this.closed = true;

        this.parentObject.__closed(this);
        this.fireEvent("close", this);
    },
    subEvent: function(event) {
        var sub = this.subWindow
        if ($defined(sub))
            sub.fireEvent.call(sub, event);
    },
    setSubWindow: function(win) {
        this.subWindow = win;
    },

    select: function() {
        this.active = true;
        this.parentObject.__setActiveWindow(this);
        if (this.hilighted)
            this.highlightTab(ui.HILIGHT_NONE);

        this.subEvent("select");
        // this.resetScrollPos();
        this.lastSelected = new Date();
    },

    deselect: function() {
        this.subEvent("deselect");

        this.active = false;
    },


    /* A data is an object of the form:
    -: current nick
    @: opstatus
    c: channel
    f: origin channel
    h: ip of propogater
    m: msg
    n: nick
    */
    addLine: function(type, data, colour, $ele) {
        var self = this,
            uiobj = self.parentObject;
        var highlight = ui.HILIGHT_NONE,
            hl_line = false;

        highlight = uiobj.theme.highlightAndNotice(data, type, self, $ele);

        if (!self.active && (highlight !== ui.HILIGHT_NONE))
            self.highlightTab(highlight);

        var tsE = templates.timestamp({time:util.IRCTimestamp(new Date())});
        $ele.insertAdjacentHTML('afterbegin', tsE);

        var formatted = uiobj.theme.formatMessage($ele, type, data, hl_line);
        self.lines.adopt($ele);

        if(uiobj.uiOptions2.get("lastpos_line") && type.endsWith("CHANMSG")) {
            this.lastLine = (this.lastLine || Element.from(templates.messageLine())).inject(this.lines);
        }
    },
    errorMessage: function(message) {
        this.addLine("", message, "warncolour");
    },
    infoMessage: function(message) {
        this.addLine("", message, "infocolour");
    },
    highlightTab: function(state) {
        if (state == ui.HILIGHT_NONE || state >= this.hilighted) {
            this.hilighted = state;
        }
    },

    //holy shit i got this to actually make sense
    // takes nicks (sorted array)
    updateNickList: function(nicks) {
        var lnh = this.lastNickHash,
            oldnames = Object.keys(lnh),

            added = _.difference(nicks, oldnames),//users who joined
            left = _.difference(oldnames, nicks); //users who left

        _.each(left, function(nick) {
            var element = lnh[nick];
            this.nickListRemove(nick, element);
            delete lnh[nick];
        }, this)

        _.each(added, function(nick) {
            var index = nicks.indexOf(nick); //indx in sorted array
            lnh[nick] = this.nickListAdd(nick, index) || 1;
        }, this);
    },

    
    nickListAdd: function(nick, position) {
        var realNick = util.stripPrefix(this.client.prefixes, nick);

        var nickele = Element.from(templates.nickbtn({'nick': nick}));
        var span = nickele.getElement('span');
        nickele.store("nick", realNick);


        if (this.parentObject.uiOptions2.get("nick_colours")) {
            var colour = util.toHSBColour(realNick, this.client);
            if ($defined(colour))
                span.setStyle("color", colour.rgbToHex());
        }

        this.nicklist.insertAt(nickele, position);
        this.moveMenuClass();

        return nickele;
    },

    nickListRemove: function(nick, stored) {
        try {
            this.nicklist.removeChild(stored);
            this.moveMenuClass();
        } catch (e) {
        }
    },

    sendInput: function(e, target) {
        e.stop();
        var target = e.target.tagName !== "INPUT" ? e.target.getElement('input[type="text"]') : e.target,
            unparsed = target.val(),
            parsed = util.inputParser.parse(unparsed);
        if (parsed !== "") {
            this.parentObject.resetTabComplete();
            this.commandhistory.addLine(unparsed || parsed);
            this.client.exec(parsed, this.currentChannel);
            target.val("");
        }
        target.focus();
    }
});


//mae view and qui and controller
ui.QUI.Window = new Class({
    Extends: ui.Window,
    Binds: ["close", "attach", "detach", "selectTab", "nickChange", "nickClick", "editTopic", "updatePrefix", "menuClick"],

    initialize: function(parentObject, client, type, name, identifier) {
        var self = this;
        self.parent(parentObject, client, type, name, identifier);

        var qwindow = self.window;

        self.events = {
            client: {}
        };

        qwindow.detached = self.detached = false;

        var $tab = self.tab = Element.from(templates.ircTab({
                'name': (name === BROUHAHA) ? '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' : name
            })).inject(parentObject.tabs),
            $tabDetach = $tab.getElement('.detach');

        if(name === BROUHAHA) {
            $tab.addClass('brouhaha');
            _.delay(function() {
                _.some(parentObject.windowArray, function(win) {
                    if(util.isChannelType(win.type) && !util.isBaseWindow(win.name)) {
                        self.properties.text(win.name); //update current channel in brouhaha
                        self.currentChannel = win.name;
                    }
                });
            }, 1000);
        }



        // var elchanid = document.getElementById('channel-name-id');

        $tab.addEvents({
                focus: $tab.blur,
                click: self.selectTab,
                dblclick: function(e) {
                    e.stop();

                    if (self.closed)
                        return;

                    parentObject.selectWindow(self);
                }
            })
            .store("window", self);

        $tabDetach.addEvent('click', self.detach);

        if (!isBaseWindow(name)) {
            var $tabclose = Element.from(templates.tabClose()),
                close = self.close;
            //close window

            $tabclose.addEvent("click", close);
            $tab.addEvent("mouseup", function(e) {
                    var button = Browser.Engine.trident ? 4 : 1;

                    if (e.event.button === button)
                        close(e);
                })
                .adopt($tabclose);
        }

        var lines = self.lines = qwindow.middle;
            lines.store("window", self);
        // self.parentObject.qjsui.applyClasses("middle", self.lines);
        if (type !== ui.WINDOW_CUSTOM && type !== ui.WINDOW_CONNECT) {
            qwindow.window.addClass('ircwindow');
                // .set('id', 'mainircwindow');
            self.fxscroll = new Fx.AutoScroll(lines, {
            });

            lines.store("fxscroll", self.fxscroll)
                .store("client", self.client);

        } else {
            qwindow.window.addClass(name.capitalize().replace(" ", "-"));//Connection Details -> Connection-Details
        }

        if (type === ui.WINDOW_CHANNEL) {
            qwindow.window.addClass('channel');

            qwindow.topic.html(templates.topicBar({topic:false}));
            var topic = self.topic = qwindow.topic;
            topic.addEvent("dblclick", self.editTopic);
            self.updateTopic("");

            var $nicklist = self.nicklist = qwindow.right;
            $nicklist.addClass("nicklist")
                    // .addEvent("click", self.removePrevMenu.bind(self))
                    .addEvent("click:relay(a.user)", self.nickClick)
                    .addEvent("focus:relay(a)", $nicklist.blur);


            var $divider = self.divider = Element.from(templates.verticalDivider())
                                                    .inject($nicklist, "before");
            //cant create splitpane here because elements are still hidden
        }

        var properties = self.properties = Element.from(templates.channelName({channel: name}))
                                                    .inject(qwindow.properties);

        if(util.windowNeedsInput(type))
            qwindow.bottom.appendChild(self.createInput());


        self.nicksColoured = self.parentObject.uiOptions2.get("nick_colours");
    },

    close: function(e) {
        if(e)
            e.stop();

        if (this.closed)
            return;

        if (isChannelType(this.type) && (!isBaseWindow(this.name))) {
            var client = this.client,
                channels = util.removeChannel(client.channels, this.name);

            client.exec("/PART " + this.name);
            client.storeChannels(channels);
        }
        if(this.client instanceof irc.IRCClient) 
            this.client.removeEvents(this.events.client);
        this.parent();

        this.parentObject.tabs.disown(this.tab);
        if(this.fxscroll)
            this.fxscroll.stop();
        if(this.resizable)
            this.resizable.detach().stop();
        if(this.drag)
            this.drag.detach().stop();

        if(this.detached) {
            this.wrapper.destroy();
        } else {

            this.window.window.destroy();
        }
    },

    attach: function(e) {
        var win = this.window.window,
            wrapper = this.wrapper,
            po = this.parentObject;

        this.window.detached = this.detached = false;

        wrapper.hide();
        win.hide();
        // wrapper.removeChild(win);
        win.replaces(wrapper);
        wrapper.destroy();

        this.drag.detach().stop();
        this.resizable.detach().stop();
        this.wrapper = this.resizable = this.drag = null;

        this.tab.show();
        this.select();

        this.fireEvent('attach');
    },

    detach: function(e) {
        var self = this,
            win = self.window.window,
            po = self.parentObject,
            qjsui = po.qjsui,

            wrapper = self.wrapper = Element.from(templates.detachedWindow({
                                                    'channel': this.name,
                                                    'base': util.isBaseWindow(this.name)
                                                })),
            header = wrapper.getElement('.header'),
            attach = header.getElement('.attach'),
            close = header.getElement('.tab-close'),

            resizeWrapper = Element.from(templates.resizeHandle()),
            resizeHandle = resizeWrapper.getElement('.resize-handle'),

            setActive = function(e) {
                po.windowArray.each(function(win) {
                    if(win.detached) win.wrapper.removeClass('active');
                });
                wrapper.addClass('active');
            };

        attach.addEvent('click', self.attach);
        if(close) {
            close.addEvent('click', self.close);
        }

        //change window if we're active
        if(self.active)
            po.nextWindow(1, self);

        var size = util.percentToPixel({x:40, y:60}, qjsui.parent);
        wrapper.setStyles({
                "width": size.x,
                "height": size.y
            })
            .wraps(win) //*** adds wrapper to dom
            .adopt(resizeWrapper);
        win.show()
            .addEvent("mousedown", Event.stopPropagation);//prevent draggin occurring while clickin window
        setActive();

        self.resizable = wrapper.makeResizable({
                                limit: {//min/max
                                    x: [400, null],
                                    y: [200, null]
                                },
                                handle: resizeHandle,
                                stopPropagation: true
                            });
        self.drag = wrapper.makeDraggable({
                                handle: wrapper,
                                includeMargins: true
                            });

        wrapper.addEvents({
            click: setActive
        });


        self.selectUpdates();

        // util.centerElement(wrapper, qjsui.parent);
        wrapper.position();

        self.detached = self.window.detached = true;

        //keeps order
        self.tab.hide();

        self.fireEvent('detach');
    },

    selectTab: function(e) {
        var self = this;
        if(self.name !== BROUHAHA) {
            _.each(self.parentObject.windowArray, function(win) {
                if(!win.detached && (!e || e.type !== "click" || win.name !== BROUHAHA)) {//keep brouhaha selected if its from a single click
                    win.tab.removeClass("tab-selected");
                }
                if(win.name === BROUHAHA) {
                    if(util.isChannelType(self.type)) {
                        win.properties.text(self.name); //update current channel in brouhaha
                        win.currentChannel = self.name;
                    }
                }
            });
        }
        irc.activeChannel = self.name;
        self.tab.removeClasses("tab-hilight-activity", "tab-hilight-us", "tab-hilight-speech")
                .addClass("tab-selected");
    },

    select: function() {
        this.selectTab();

        //changing windows occurs here
        this.parentObject.setWindow(this.window);

        this.parent();

        this.selectUpdates();
    },

    //styles and ui things to update
    selectUpdates: function() {
        var self = this,
            parentObject = self.parentObject;

        if(self.nicklist && !self.split) {
            // (function() { //wait a sec for the styles to be calculated
            //     self.split = new Drag.SplitPane(self.divider, {
            //         // store: new Storage('__panelwidth')
            //     });
            // }).delay(50);
        }

        if(self.fxscroll) {//scroll to bottom
            self.fxscroll.autoScroll();
        }

        //give focus on select
        // if (util.windowNeedsInput(self.type)) {
        //     self.$inputbox.focus();
        // }

        if(util.isChannelType(self.type)) {
            if (self.nicksColoured !== parentObject.uiOptions2.get("nick_colours")) {
                self.nicksColoured = parentObject.uiOptions2.get("nick_colours");

                var nodes = self.nicklist.childNodes;
                if (parentObject.uiOptions2.get("nick_colours")) {
                    _.each(nodes, function(node) {
                        var colour = util.toHSBColour(node.retrieve("nick"), self.client);
                        if ($defined(colour))
                            node.firstChild.setStyle("color", colour.rgbToHex());
                    });
                } else {
                    _.each(nodes, function(node) {
                        node.firstChild.setStyle("color", null);
                    });
                }
            }

            self.updatePrefix();
        }

    },

    deselect: function() {
        this.parent();
        this.tab.removeClass("tab-selected");
    },

    editTopic: function() {
        if (!this.client.nickOnChanHasPrefix(this.client.nickname, this.name, "@")) {
/*      var cmodes = this.client.getChannelModes(channel);
      if(cmodes.indexOf("t")) {*/
            return alert(lang.needOp.message); /*}*/
        }
        var newTopic = prompt(util.formatter(lang.changeTopicConfirm.message, {channel: this.name}), this.topic.topicText);
        if (!$defined(newTopic))
            return;

        this.client.exec("/TOPIC " + newTopic);
    },

    //creates the input box on the bottom
    createInput: function() {
        var self = this,
            parentO = self.parentObject,

            inputtype = Browser.isMobile ?  "mobile-input": "keyboard-input",

            nick = self.client.nickname,

            $form = Element.from(templates.ircInput({'nick': nick, 'status': '', type: inputtype})),
            $nicklabel = self.$nicklabel = $form.getElement('.nickname'),
            $inputbox = self.$inputbox = $form.getElement('.input-field'),
            $inputbtn = $form.getElement('.send');


        if (Browser.isMobile) {
            $inputbtn.addClass("mobile-button");
        }

        var resettab = parentO.resetTabComplete,
            complete = function(e) {
                var resultfn;
                var cvalue = $inputbox.val();

                if (e.key === "up") {
                    resultfn = self.commandhistory.upLine;
                } else if (e.key === "down") {
                    resultfn = self.commandhistory.downLine;
                } else if (e.key === "tab" && !e.ctrl) {
                    e.stop();
                    return self.tabComplete($inputbox);
                } else {
                    return parentO.resetTabComplete();
                }
                e.stop();

                parentO.resetTabComplete();
                if ((!!cvalue) && (self.lastcvalue !== cvalue))
                    self.commandhistory.addLine(cvalue, true);

                var result = resultfn.call(self.commandhistory);

                if (!result)
                    result = "";
                self.lastcvalue = result;

                $inputbox.val(result);
                util.setAtEnd($inputbox);
            };

        $nicklabel.addEvent("dblclick", function() {
            var nick = prompt("Enter a new nickname", self.nickname);
            if(nick) {
                self.client.exec("/nick " + nick);
            }
        });

        $inputbtn.addEvent("click", self.sendInput);
        $form.addEvent("submit", self.sendInput);
        $inputbox.addEvents({
                    "focus": resettab,
                    "mousedown": resettab,
                    "keydown": complete
                    });
        return $form;
    },

    updatePrefix: function (data) {
        var prefix;
        if(data) {
            if(!data.thisclient || data.channel !== this.name)
                return;
            else
                prefix = data.prefix;
        } else {
            prefix = this.client.getNickStatus(this.name, this.client.nickname)
        }
        this.$nicklabel.getElement('.status')
                        .removeClasses('op', 'voice')
                        .addClass((prefix === OPSTATUS) ? "op" : (prefix === VOICESTATUS) ? "voice" : "")
        // util.fillContainer(this.$inputbox);
    },

    nickClick: function(evt, $tar) { //delegation to nick items
        var hasMenu = $tar.hasClass('selected-middle');

        this.removePrevMenu(); //collapse old menus
        if (!hasMenu) {
            this.moveMenuClass($tar);
            $tar.addClass("selected")
                .store("menu", this.createMenu($tar.retrieve("nick"), $tar));
        }
    },

    // - clicking user in nick list
    createMenu: function(nick, $parent) {
        var pmenu = $parent.retrieve('menu');
        if(pmenu) {
            return pmenu.toggle();
        }

        var $menu = Element.from(templates.menuContainer()),
            self = this;

        _.chain(ui.MENU_ITEMS)
            .filter(function(item) {
                return Type.isFunction(item.predicate) ? item.predicate.call(self, nick) : !!item.predicate;
            })
            .each(function(item) {
                Element.from(templates.nickbtn({'nick': "- " + item.text}))
                        .store("action", item.fn)
                        .inject($menu);
            });

        $menu.addEvent('click:relay(.user)', function(e, target) {
                e.stop();
                self.menuClick(target.retrieve("action"));
            })
            .addEvent('focus:relay(a)', Element.prototype.blur)
            .inject($parent);

        return $menu;
    },

    menuClick: function(fn) {
        var selected = this.nicklist.getElement('.selected');
        //i dont understand why these arent equivalent
        fn.call(this, selected.retrieve("nick"));
        this.removePrevMenu();
    },

    moveMenuClass: function($sel) {
        $sel = $($sel) || this.nicklist.getElement('.selected-middle, .selected');
        
        if($sel) {
            if (this.nicklist.firstChild === $sel) {
                $sel.removeClass("selected-middle");
            } else {
                $sel.addClass("selected-middle");
            }
        }
    },

    removePrevMenu: function() {
        var $sel = this.nicklist.getElements('.selected-middle, .selected');
        if ($sel) {
            $sel.removeClasses("selected", "selected-middle");
            var $menu = $sel.retrieve('menu');
            if ($menu) {
                $menu.dispose();
                $sel.eliminate('menu');
            }
        }
    },

    updateTopic: function(topic) {
        var topice = this.topic.empty();

        topice.topicText = topic;
        if (topic) {
            this.parent(topic, topice);
        } else {
            topice.html(templates.topicText({topic:lang.noTopic.message, empty:true}));
        }
    },

    addLine: function(type, data, colourClass) {
        console.log(arguments);
        var $msg = Element.from(templates.ircMessage({ type: type.hyphenate() }));

        if(colourClass)
            $msg.addClass(colourClass);

        this.parent(type.toUpperCase(), data, colourClass, $msg);
    },
    highlightTab: function(state) {
        this.parent(state);

        if (state == this.hilighted)
            return;

        this.tab.removeClasses("tab-hilight-activity", "tab-hilight-us", "tab-hilight-speech");

        switch (state) {
        case ui.HILIGHT_US:
            this.tab.addClass("tab-hilight-us");
            break;
        case ui.HILIGHT_SPEECH:
            this.tab.addClass("tab-hilight-speech");
            break;
        case ui.HILIGHT_ACTIVITY:
            this.tab.addClass("tab-hilight-activity");
            break;
        }
    }
});

//close the iife and call with this
})(this);
