//made a couple bug fixes and changes such as for issue #1205

// MooTools: the javascript framework.
// Load this file's selection again by visiting: http://mootools.net/more/35e6a5fbeab78380421c63debfce3b7c 
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

    var getTime = Date.now;

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
    _.delay = function(func, delay, bind, args) {
        return func.delay(delay, bind, args);
    };

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
      previous = options.leading === false ? 0 : getTime();
      timeout = null;
      result = func.apply(context, args);
    };
    return function() {
      var now = getTime();
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
    var timeout, args, context, timestamp, result;
    return function() {
      context = this;
      args = arguments;
      timestamp = getTime();
      var later = function() {
        var last = getTime() - timestamp;
        if (last < wait) {
          timeout = setTimeout(later, wait - last);
        } else {
          timeout = null;
          if (!immediate) result = func.apply(context, args);
        }
      };
      var callNow = immediate && !timeout;
      if (!timeout) {
        timeout = setTimeout(later, wait);
      }
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
//???
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
                    var args = prev_args.concat(slice.call(arguments));
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

        clean: function(xs) {
            return _.reject(xs, function(val) {
                return val == null;
            });
        },

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
(function() {

    //okay this is mainly just for preference - didnt like merges behaviour with classes particularly with Options.setOptions and this was the easiest way to reimplemnt it
    //https://github.com/mootools/mootools-core/issues/2526
    var mergeOne = function(source, key, current){
        switch (typeOf(current)){
            case 'object':
                if(current.$constructor && "$caller" in current) source[key] = current;//class instance check (only change)
                else if (typeOf(source[key]) == 'object') Object.merge(source[key], current);
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
        }
    });


    var strp = String.prototype;
    ["startsWith", "endsWith", "trimLeft", "trimRight"].each(function(method) {
        try{strp[method] && strp[method].protect();}catch(o_O){}
    });

    String.implement({

        //replaces all occurences of the tofind string in this string with
        //alternatively call replace with a regex global
        //http://jsperf.com/replaceall-escape
        replaceAll: function(tofind, torep) {
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
        splitMax: function(by, max) {
            max = max || 1;
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
        },

        trimRight: function (){
            return String(this).replace(/~+$/, '');
        },

        trimLeft: function() {
            return String(this).replace(/^\s+/, '');
        }
    });

    Element.Properties.val = Element.Properties.value = {
        get: function() {
            return this[(this.get('type') == 'checkbox') ? 'checked' : 'value'];
        },
        set: function(val) {
            this[(this.get('type') == 'checkbox') ? 'checked' : 'value'] = val;
        }
    };

    ["html", "text", "val"].each(function(fn) {
            Element.implement(fn, function(data) {
                if (typeof data !== 'undefined') return this.set(fn, data);
                return this.get(fn);
            });
        });

    _.extend(Element.NativeEvents, {
        adopt: 2,
        disown: 2
    });

    Class.refactor(Element, {
        adopt: function() {
            //just mootools adopt method which fires an event when called
            return this.previous.apply(this, arguments).fireEvent("adopt", arguments);
        },
        inject: function(el) {
            var ret = this.previous.apply(this, arguments);
            el.fireEvent("adopt", [this]);
            return ret;
        }
    })
    .implement({

        //removes all elements in arguments from array if found - opposite of adopt
        disown: function() {
            Array.each(arguments, function(element) {
                element = document.id(element, true);
                if (element) element.dispose();
            });
            this.fireEvent("disown", arguments);
            return this;
        },

        maxChildren: function(n) {
            for (var ele, c = this.children; c.length >= n && (ele = this.firstChild);) {
                ele.dispose();
            }
            return this;
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



// Begin: Source/Class/Class.Occlude.js
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


// Begin: Source/Types/String.QueryString.js
/*
---

script: String.QueryString.js

name: String.QueryString

description: Methods for dealing with URI query strings.

license: MIT-style license

authors:
  - Sebastian Markbåge
  - Aaron Newton
  - Lennart Pilon
  - Valerio Proietti

requires:
  - Core/Array
  - Core/String
  - /MooTools.More

provides: [String.QueryString]

...
*/

String.implement({

    parseQueryString: function(decodeKeys, decodeValues){
        if (decodeKeys == null) decodeKeys = true;
        if (decodeValues == null) decodeValues = true;

        var vars = this.split(/[&;]/),
            object = {};
        if (!vars.length) return object;

        vars.each(function(val){
            var index = val.indexOf('=') + 1,
                value = index ? val.substr(index) : '',
                keys = index ? val.substr(0, index - 1).match(/([^\]\[]+|(\B)(?=\]))/g) : [val],
                obj = object;
            if (!keys) return;
            if (decodeValues) value = decodeURIComponent(value);
            keys.each(function(key, i){
                if (decodeKeys) key = decodeURIComponent(key);
                var current = obj[key];

                if (i < keys.length - 1) obj = obj[key] = current || {};
                else if (typeOf(current) == 'array') current.push(value);
                else obj[key] = current != null ? [current, value] : value;
            });
        });

        return object;
    },

    cleanQueryString: function(method){
        return this.split('&').filter(function(val){
            var index = val.indexOf('='),
                key = index < 0 ? '' : val.substr(0, index),
                value = val.substr(index + 1);

            return method ? method.call(null, key, value) : (value || value === 0);
        }).join('&');
    }

});


// Begin: Source/Utilities/Table.js
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


// Begin: Source/Utilities/IframeShim.js
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


// Begin: Source/Interface/Mask.js
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


/**
 *
 *  Base64 encode / decode
 *  http://www.webtoolkit.info/
 *
 **/
window.Base64 = (function() {
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
    Lightweight basic autocompleter?
    WIP: goal is to create typeaheadesque (https://github.com/twitter/typeahead.js/) input box. Only going to support local data and no drop down for now..
*/
(function() {
    var keyboardBinds = {
        "down": "next",
        "up": "previous",
        "tab": "finish",
        "right": "finish",
        "left": "stop",
        "esc": "stop",
        "enter": "complete"
    };
    
    function hinter() {
        if(this.options.autocomplete) {
            var text = this.$input.get("value");
            var full = "";
            if(text.length >= this.options.minlen) {
                full = _.find(this.data, function(txt) {
                    return txt.startsWith(text);
                });
            }
            this.seth(full || "");
        }
    }

    this.Completer = new Class({
        Implements: [Options],
        Binds: ["process", "update"],
        index: -1,
        options: {
            stopPropogation: false,
            //autostyle -todo for now templated,
            autoPosition: true,//autopositon hint
            autocomplete: true,
            selectors: {
                hint: '.tt-hint',
                input: '.tt-query'
            },
            minlen: 1,
            delay: 400 //throttle time
        },

        //expects to be given a container with 2 inputs. One for actual input and a disabled one for offering possible completion.
        //Future can also contain a container for menu
        initialize: function(target, data, options) {
            options = this.setOptions(options).options;
            target = document.id(target);
            this.data = data;

            this.$events = {
                "keydown": this.process,
                "input": _.throttle(hinter.bind(this), options.delay)
            };
            this.$input = target.getElement(options.selectors.input)
                                .addEvents(this.$events);
            this.$hint = target.getElement(options.selectors.hint)
                                .show();
            if(options.autoPosition) {
                this.$hint.setStyle("position", "absolute");
                this.update.delay(50);
                window.addEvent("resize", this.update);
            }
        },

        toggleAutocomplete: function(state) {
            this.options.autocomplete = state != null ? !!state : !this.options.autocomplete;
        },

        process: function(evt) {
            var method = keyboardBinds[evt.key];
            if(this[method]) {
                if(this.options.stopPropogation) evt.stopPropagation();
                this[method]();
            }
            //cant do hinting here as this is fired before input
        },

        next: function() {
            this.stop();
            if(this.index > 0) {
                this.set(this.data[--this.index]);
            } else {
                this.set("");
                this.index = -1;
            }
        },

        previous: function() {
            this.stop();
            if(this.index + 1 < this.data.length) {
                this.set(this.data[++this.index]);
            } else {
                this.set("");
                this.index = this.data.length;
            }
        },

        complete: function() {
            // this.finish();
            this.reset();
        },

        finish: function() {
            var text = this.$hint.get("value") || null;
            this.set(text);
        },

        stop: function() {
            this.seth("");
        },

        set: function(text) {
            if(_.isString(text)) this.$input.set("value", text);
        },

        seth: function(text) {
            if(_.isString(text)) this.$hint.set("value", text);
        },

        reset: function() {
            this.stop();
            this.index = -1;
        },

        update: function() {
            this.$hint.setStyles(this.$input.getCoordinates(this.$input.getParent()));
        },

        detach: function() {
            this.$input.removeEvents(this.$events);
            this.$hint.hide();
            window.removeEvent("resize", this.update);
        }
    });
})();

/*
---

script: Elements.From.js

name: Elements.From

description: Returns a collection of elements from a string of html.

license: MIT-style license

authors:
  - Aaron Newton
  - adapted by Graeme Yeates

requires:
  - Core/String
  - Core/Element
  - /MooTools.More

provides: [Elements.from, Elements.From]

...
*/
window.addEvent("domready", function(){
    "use strict";
    function $filter($e) {return $e.nodeType !== 3 || $e.nodeValue !== ""}//filter empty text nodes
    function getChildren($ele) {//fix for #2527
        return new Elements($ele.childNodes).filter($filter);
    }
    function tableFix(match, text) {
        var container = new Element('table');
        var tag = match[1].toLowerCase();
        if (['td', 'th', 'tr'].contains(tag)){
            container = new Element('tbody').inject(container);
            if (tag != 'tr') container = new Element('tr').inject(container);
        }
        return getChildren(container.set('html', text));
    }
    var table_re = /^\s*<(t[dhr]|tbody|tfoot|thead)/i;
    var range = document.createRange && document.createRange();
    if(range && range.createContextualFragment) {
        var reference = document.getElement("div");
        range.selectNode(reference);

        Elements.from = function(text, excludeScripts) {
            if (excludeScripts || excludeScripts == null) text = text.stripScripts();

            var match = text.match(table_re);
            if(match) return tableFix(match,text);

            return getChildren(range.createContextualFragment(text));
        };

    } else { //fall back for ie<9
        Elements.from = function(text, excludeScripts){
            if (excludeScripts || excludeScripts == null) text = text.stripScripts();

            var match = text.match(table_re);
            if(match) return tableFix(match,text);

            return getChildren(new Element('div').set('html', text));
        };
    }
});

Element.extend({
    from: function(text, es) {
        return Elements.from(text, es)[0];
    }
});



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

// //https://raw.github.com/megawac/MutationObserver.js
// (function(window) {
//     "use strict";
//     /*
//     prefix bugs:
//         -https://bugs.webkit.org/show_bug.cgi?id=85161
//         -https://bugzilla.mozilla.org/show_bug.cgi?id=749920
//     */ 
//     window.MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
//     if (!window.MutationObserver) {
//         var arrayProto = Array.prototype;
//         var push = arrayProto.push;
//         var map = arrayProto.map;
//         var has = Object.hasOwnProperty;
//         var each = function (object, fn, bind){
//             for (var key in object){
//                 if (has.call(object, key)) fn.call(bind, object[key], key, object);
//             }
//         };

//         var MutationRecord = window.MutationRecord = function(data) {
//             each(data, function(v,k) {
//                 this[k] = v;
//             }, this);
//         }
//         MutationRecord.prototype = {
//             target: null,
//             type: null,
//             addedNodes: [],
//             removedNodes: [],
//             attributeName: null,
//             oldValue: null
//         };

//         var getChildren = function($e) {
//             return map.call($e.childNodes, function(e) {return e});
//         };
//         var getAttributes = function($e, filter) { //store dynamic attributes in a object
//             var attrs = {};
//             var attributes = $e.attributes;
//             for (var i = attributes.length - 1; i >= 0; i--) {
//                 if(!filter || filter[attributes[i].name]) {
//                     attrs[attributes[i].name] = attributes[i].value;
//                 }
//             }
//             return attrs;
//         };
//         var noop = function() {};
//         var patches = {
//             attributes: function(element, filter) {
//                 if(filter && filter.reduce) {
//                     filter = filter.reduce(function(a, b) {a[b] = true; return a;}, {});
//                 } else {
//                     filter = null;
//                 }
//                 var $old = getAttributes(element, filter);
//                 return function() {
//                     var changed = [];
//                     var old = $old;
//                     var attr = getAttributes(element, filter);
//                     $old = attr;

//                     each(attr, function(val, prop) {
//                         if (old[prop] !== val) {
//                             changed.push(new MutationRecord({
//                                 target: element,
//                                 type: 'attributes',
//                                 attributeName: prop,
//                                 oldValue: old[prop]
//                             }));
//                         }
//                         delete old[prop];
//                     });
//                     each(old, function(val, prop) {
//                         changed.push(new MutationRecord({
//                             target: element,
//                             type: 'attributes',
//                             attributeName: prop,
//                             oldValue: old[prop]
//                         }));
//                     });
//                     return changed;
//                 };
//             },

//             attributeFilter: noop,
//             attributeOldValue: noop,

//             childList: function(element) {
//                 var $old = getChildren(element);
//                 return function() {
//                     var changed = [];
//                     var old = $old;
//                     var kids = getChildren(element);
//                     $old = kids;

//                     kids.forEach(function($e) {
//                         var index = old.indexOf($e);
//                         if (index !== -1) {
//                             old.splice(index, 1);
//                         } else {
//                             changed.push(new MutationRecord({
//                                 target: element,
//                                 type: 'childList',
//                                 addedNodes: [$e]
//                             }));
//                         }
//                     });
//                     //rest are clearly removed
//                     old.forEach(function($e) {
//                         changed.push(new MutationRecord({
//                             target: element,
//                             type: 'childList',
//                             removedNodes: [$e]
//                         }));
//                     });
//                     return changed;
//                 };
//             }
//         };

//         window.MutationObserver = function(listener) {
//             this._listener = listener;
//             this._intervals = [];
//             this._watched = [];
//         };

//         MutationObserver.prototype = {
//             options: {
//                 period: 25 //recheck interval
//             },

//             observe: function(target, config) {
//                 var self = this;

//                 if(config.attributeFilter && config.attributes) {
//                     config.attributes = config.attributeFilter;
//                 }

//                 each(config, function(use, type) {
//                     if (use) {
//                         var patch = patches[type].call(self, target, use);
//                         if(patch) self._watched.push(patch);
//                     }
//                 });

//                 this._intervals.push(setInterval(this._watch.bind(this), this.options.period));
//             },

//             _watch: function() {
//                 var changed = [];

//                 this._watched.forEach(function(watcher) {
//                     var data = watcher();//expected array
//                     if(data) push.apply(changed, data);
//                 });

//                 if (changed.length > 0) { //fire away
//                     this._listener(changed, this);
//                 }
//             },

//             disconnect: function() {
//                 this._intervals.forEach(function(t) {clearInterval(t);});//ie throws a fit if u dont wrap clear
//             }
//         };
//     }
// })(window);
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
            } else if (Browser.ie && Browser.version < 8) { //IE < 8
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
                    pattern: /[a-z0-9]{2,}\.[a-z]{2,4}/i,//i think this should pass tests on all valid urls... will also pick up things like test.test
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
                funcs = _.filter(self.patterns, function(pat) {
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


// //scrolls an elemenet as new items are added. will stop scrolling if user manually scrolls
// //Requires some element refactoring see nativemods so adopting and disowning elements causes an event to be fired
// // Author: Graeme Yeates
// //Requires: 
// // - Fx.Scroll
// // - Element.Event.Pseudos
// Fx.AutoScroll = new Class({
//     Extends: Fx.Scroll,
//     Binds: ["updatePosition"],
//     options: {
//         // direction: 'Bottom',
//         interval: 100,//time to debounce scroll event checks to save some processing
//         duration: 0, //ms to execute effect
//         threshold: 5,//px - how close to bottom to start scrolling
//         wheelStops: true,
//         link: 'cancel',
//         start: true
//     },

//     initialize: function(ele, options) {
//         this.parent(ele, options);

//         var self = this,
//             opts = self.options,
//             timer;
//         self.threshold = this.options.threshold;

//         this.$events = {
//             element: {
//                 // "adopt": self.updatePosition,
//                 // "disown": self.updatePosition
//             },
//             window: {
//                 "resize": self.updatePosition//pretty light function doesnt need to be throttled
//             }
//         };

//         this.observer = new MutationObserver(self.updatePosition);

//         // this.$events.element["scroll:pause(" + opts.interval + ")"] = function() {
//         //     self.toggleScroll();
//         // };
//         this.$events.element.scroll = _.debounce(function() {//underscore debounce uses much less memory than pause
//             self.toggleScroll();
//         }, opts.interval);

//         //begin autoscrolling
//         if(opts.start) this.start();
//     },

//     autoScroll: function() {
//         this._scroll = true;
//         return this.updatePosition();
//     },

//     stopScroll: function() {
//         this._scroll = false;
//         this.observer.disconnect();
//     },

//     toggleScroll: function() {
//         this._scroll = false;

//         var $ele = this.element,
//             pxFromBottom = Math.abs($ele.getScrollHeight() - ($ele.getHeight() + $ele.getScrollTop()));

//         if(pxFromBottom <= this.threshold) {//bottom of element + offset - begin autoscrolling
//             this.autoScroll();
//         }
//         else { //stop autoscrolling
//             this.stopScroll();
//         }
//         return this;
//     },

//     updatePosition: function() {
//         var $ele = this.element;
//         if(this._scroll  &&
//           /*bug fix for a off by one one in Fx.Scroll*/ Math.abs($ele.getScrollHeight() - $ele.getHeight() - $ele.getScrollTop()) > 2) {
//             if(this.options.duration === 0) {
//                 this.set($ele.scrollLeft, $ele.scrollHeight); //place at bottom instantly
//             } else {
//                 this.toBottom();
//             }
//         }
//         return this;
//     },

//     start: function() {
//         this.element.addEvents(this.$events.element);
//         window.addEvents(this.$events.window);
//         this.observer.observe(this.element, {
//             childList: true
//         });
//         return this.autoScroll();
//     },

//     stop: function() {
//         window.removeEvents(this.$events.window);
//         this.element.removeEvents(this.$events.element);
//         this.stopScroll();
//         return this.parent();
//     }
// });

//scrolls an elemenet as new items are added. will stop scrolling if user manually scrolls
//Requires some element refactoring see nativemods so adopting and disowning elements causes an event to be fired
// Author: Graeme Yeates
//Requires: 
// - Fx.Scroll
// - Element.Event.Pseudos
Fx.AutoScroll = new Class({
    Extends: Fx.Scroll,
    Binds: ["updatePosition"],
    options: {
        // direction: 'Bottom',
        interval: 100,//time to debounce scroll event checks to save some processing
        duration: 0, //ms to execute effect
        threshold: 5,//px - how close to bottom to start scrolling
        wheelStops: true,
        link: 'cancel',
        start: true
    },

    initialize: function(ele, options) {
        this.parent(ele, options);

        var self = this,
            opts = self.options,
            timer;
        self.threshold = this.options.threshold;

        this.$events = {
            element: {
                "adopt": self.updatePosition,
                "disown": self.updatePosition
            },
            window: {
                "resize": self.updatePosition//pretty light function doesnt need to be throttled
            }
        };
        // this.$events.element["scroll:pause(" + opts.interval + ")"] = function() {
        //     self.toggleScroll();
        // };
        this.$events.element.scroll = _.debounce(function() {//underscore debounce uses much less memory than pause
            self.toggleScroll();
        }, opts.interval);

        //begin autoscrolling
        if(opts.start) this.start();
    },

    autoScroll: function() {
        this._scroll = true;
        return this.updatePosition();
    },

    stopScroll: function() {
        this._scroll = false;
    },

    toggleScroll: function() {
        this._scroll = false;

        var $ele = this.element,
            pxFromBottom = Math.abs($ele.getScrollHeight() - ($ele.getHeight() + $ele.getScrollTop()));

        if(pxFromBottom <= this.threshold) {//bottom of element + offset - begin autoscrolling
            this.autoScroll();
        }
        else { //stop autoscrolling
            this.stopScroll();
        }
        return this;
    },

    updatePosition: function(target) {
        var $ele = this.element;
        if(this._scroll  &&
          /*bug fix for a off by one one in Fx.Scroll*/ Math.abs($ele.getScrollHeight() - $ele.getHeight() - $ele.getScrollTop()) > 2) {
            if(this.options.duration === 0) {
                this.set($ele.scrollLeft, $ele.scrollHeight); //place at bottom instantly
            } else {
                this.toBottom();
            }
            if(target) {
                this.threshold = this.options.threshold || target.getHeight();
            }
        }
        return this;
    },

    start: function() {
        this.element.addEvents(this.$events.element);
        window.addEvents(this.$events.window);
        return this.autoScroll();
    },

    stop: function() {
        window.removeEvents(this.$events.window);
        this.element.removeEvents(this.$events.element);
        this.stopScroll();
        return this.parent();
    }
});


//This library: http://dev.clientcide.com/depender/build?download=true&version=MooTools+Bootstrap&excludeLibs=Core&require=Bootstrap%2FBehavior.BS.Alert&require=Bootstrap%2FBehavior.BS.Dropdown&require=Bootstrap%2FBehavior.BS.Tabs&require=Bootstrap%2FPopup&excludeLibs=More
//Contents: Behavior:Source/Event.Mock.js, Behavior:Source/Element.Data.js, Behavior:Source/BehaviorAPI.js, Behavior:Source/Behavior.js, Behavior:Source/Delegator.js, More-Behaviors:Source/Delegators/Delegator.FxReveal.js, Bootstrap:Source/Behaviors/Behavior.BS.Alert.js, Bootstrap:Source/UI/CSSEvents.js, Bootstrap:Source/UI/Bootstrap.js, Bootstrap:Source/UI/Bootstrap.Popup.js, Bootstrap:Source/UI/Bootstrap.Dropdown.js, Bootstrap:Source/Behaviors/Behavior.BS.Dropdown.js, Clientcide:Source/Layout/TabSwapper.js, Clientcide:Source/3rdParty/MooHashChange.js, Clientcide:Source/Layout/TabSwapper.Hash.js, Clientcide:Source/Behaviors/Behavior.Tabs.js, Bootstrap:Source/Behaviors/Behavior.BS.Tabs.js

// Begin: Source/Event.Mock.js
/*
---
name: Event.Mock

description: Supplies a Mock Event object for use on fireEvent

license: MIT-style

authors:
- Arieh Glazer

requires: Core/Event

provides: [Event.Mock]

...
*/

(function(Event){

/**
 * creates a Mock event to be used with fire event
 * @param Element target an element to set as the target of the event - not required
 *  @param string type the type of the event to be fired. Will not be used by IE - not required.
 *
 */
Event.Mock = function(target,type){
    type = type || 'click';

    var e = {
        type: type,
        target: target
    };

    if (document.createEvent){
        e = document.createEvent('HTMLEvents');
        e.initEvent(
            type //event type
            , false //bubbles - set to false because the event should like normal fireEvent
            , true //cancelable
        );
    }

    e = new Event(e);

    e.target = target;

    return e;
};

})(window.Event = window.Event || function(){});

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

    var GetAPI = new Class({
        _getAPI: function(element, filter){
            var api = new this.API(element, filter.name);
            api.getElement = function(apiKey, breakIfNotFound){
                var elements = api.getElements(apiKey, breakIfNotFound);
                return elements ? elements[0] : null;
            };
            api.getElements = function(apiKey, warnOrFail){
                var method = warnOrFail || "fail";
                var selector = api.get(apiKey);
                if (!selector){
                    api[method]("Could not find selector for " + apiKey);
                    return;
                }

                if (selector == 'window') return window;
                else if (selector == 'self') return element;

                var targets = element.getElements(selector);
                if (!targets.length) api[method]("Could not find any elements for target '" + apiKey + "' using selector '" + selector + "'");
                return targets;
            };
            return api;
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

        Implements: [Options, Events, PassMethods, GetAPI],

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
            var self = this;
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
            var api = this._getAPI(element, filter);
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
                var api = this._getAPI(element, filter);

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
    Behavior.GetAPI = GetAPI;


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


// Begin: Source/Delegator.js
/*
---
name: Delegator
description: Allows for the registration of delegated events on a container.
requires: [Core/Element.Delegation, Core/Options, Core/Events, /Event.Mock, /Behavior]
provides: [Delegator]
...
*/
(function(){

    var spaceOrCommaRegex = /\s*,\s*|\s+/g;

    var checkEvent = function(trigger, element, event){
        if (!event) return true;
        return trigger.types.some(function(type){
            var elementEvent = Element.Events[type];
            if (elementEvent && elementEvent.condition){
                return elementEvent.condition.call(element, event, type);
            } else {
                var eventType = elementEvent && elementEvent.base ? elementEvent.base : event.type;
                return eventType == type;
            }
        });
    };

    window.Delegator = new Class({

        Implements: [Options, Events, Behavior.PassMethods, Behavior.GetAPI],

        options: {
            // breakOnErrors: false,
            // onTrigger: function(trigger, element, event, result){},
            getBehavior: function(){},
            onLog: Behavior.getLog('info'),
            onError: Behavior.getLog('error'),
            onWarn: Behavior.getLog('warn')
        },

        initialize: function(options){
            this.setOptions(options);
            this._bound = {
                eventHandler: this._eventHandler.bind(this)
            };
            Delegator._instances.push(this);
            Object.each(Delegator._triggers, function(trigger){
                this._eventTypes.combine(trigger.types);
            }, this);
            this.API = new Class({ Extends: BehaviorAPI });
            this.passMethods({
                addEvent: this.addEvent.bind(this),
                removeEvent: this.removeEvent.bind(this),
                addEvents: this.addEvents.bind(this),
                removeEvents: this.removeEvents.bind(this),
                fireEvent: this.fireEvent.bind(this),
                attach: this.attach.bind(this),
                trigger: this.trigger.bind(this),
                error: function(){ this.fireEvent('error', arguments); }.bind(this),
                fail: function(){
                    var msg = Array.join(arguments, ' ');
                    throw new Error(msg);
                },
                warn: function(){
                    this.fireEvent('warn', arguments);
                }.bind(this),
                getBehavior: function(){
                    return this.options.getBehavior();
                }.bind(this)
            });

            this.bindToBehavior(this.options.getBehavior());
        },

        bindToBehavior: function(behavior){
            if (!behavior) return;
            this.unbindFromBehavior();
            this._behavior = behavior;
            if (this._behavior.options.verbose) this.options.verbose = true;
            if (!this._behaviorEvents){
                var self = this;
                this._behaviorEvents = {
                    destroyDom: function(elements){
                        Array.from(elements).each(function(element){
                            self._behavior.cleanup(element);
                            self._behavior.fireEvent('destroyDom', element);
                        });
                    },
                    ammendDom: function(container){
                        self._behavior.apply(container);
                        self._behavior.fireEvent('ammendDom', container);
                    }
                };
            }
            this.addEvents(this._behaviorEvents);
        },

        getBehavior: function(){
            return this._behavior;
        },

        unbindFromBehavior: function(){
            if (this._behaviorEvents && this._behavior){
                this._behavior.removeEvents(this._behaviorEvents);
                delete this._behavior;
            }
        },

        attach: function(target, _method){
            _method = _method || 'addEvent';
            target = document.id(target);
            if ((_method == 'addEvent' && this._attachedTo.contains(target)) ||
                (_method == 'removeEvent') && !this._attachedTo.contains(target)) return this;
            this._eventTypes.each(function(event){
                target[_method](event + ':relay([data-trigger])', this._bound.eventHandler);
            }, this);
            this._attachedTo.push(target);
            return this;
        },

        detach: function(target){
            if (target){
                this.attach(target, 'removeEvent');
            } else {
                this._attachedTo.each(this.detach, this);
            }
            return this;
        },

        trigger: function(name, element, event){
            var e = event;
            if (!e || typeOf(e) == "string") e = new Event.Mock(element, e);
            if (this.options.verbose) this.fireEvent('log', ['Applying trigger: ', name, element, event]);
            var result,
                    trigger = this.getTrigger(name);
            if (!trigger){
                this.fireEvent('warn', 'Could not find a trigger by the name of ' + name);
            } else if (checkEvent(trigger, element, e)) {
                if (this.options.breakOnErrors){
                    result = this._trigger(trigger, element, e);
                } else {
                    try {
                        result = this._trigger(trigger, element, e);
                    } catch(error) {
                        this.fireEvent('error', ['Could not apply the trigger', name, error.message]);
                    }
                }
            }
            if (this.options.verbose && result) this.fireEvent('log', ['Successfully applied trigger: ', name, element, event]);
            else if (this.options.verbose) this.fireEvent('log', ['Trigger applied, but did not return a result: ', name, element, event]);
            return result;
        },

        getTrigger: function(name){
            return this._triggers[name] || Delegator._triggers[name];
        },

        addEventTypes: function(triggerName, types){
            this.getTrigger(triggerName).types.combine(Array.from(types));
            return this;
        },

        /******************
         * PRIVATE METHODS
         ******************/

        _trigger: function(trigger, element, event){
            var api = this._getAPI(element, trigger);
            if (trigger.requireAs){
                api.requireAs(trigger.requireAs);
            } else if (trigger.require){
                api.require.apply(api, Array.from(trigger.require));
            } if (trigger.defaults){
                api.setDefault(trigger.defaults);
            }
            if (Delegator.debugging && Delegator.debugging.contains(name)) debugger;
            var result = trigger.handler.apply(this, [event, element, api]);
            this.fireEvent('trigger', [trigger, element, event, result]);
            return result;
        },

        _eventHandler: function(event, target){
            var triggers = target.getTriggers();
            if (triggers.contains('Stop')) event.stop();
            if (triggers.contains('PreventDefault')) event.preventDefault();
            triggers.each(function(trigger){
                if (trigger != "Stop" && trigger != "PreventDefault") this.trigger(trigger, target, event);
            }, this);
        },

        _onRegister: function(eventTypes){
            eventTypes.each(function(eventType){
                if (!this._eventTypes.contains(eventType)){
                    this._attachedTo.each(function(element){
                        element.addEvent(eventType + ':relay([data-trigger])', this._bound.eventHandler);
                    }, this);
                }
                this._eventTypes.include(eventType);
            }, this);
        },

        _attachedTo: [],
        _eventTypes: [],
        _triggers: {}

    });

    Delegator._triggers = {};
    Delegator._instances = [];
    Delegator._onRegister = function(eventType){
        this._instances.each(function(instance){
            instance._onRegister(eventType);
        });
    };

    Delegator.register = function(eventTypes, name, handler, overwrite /** or eventType, obj, overwrite */){
        eventTypes = Array.from(eventTypes);
        if (typeOf(name) == "object"){
            var obj = name;
            for (name in obj){
                this.register.apply(this, [eventTypes, name, obj[name], handler]);
            }
            return this;
        }
        if (!this._triggers[name] || overwrite){
            if (typeOf(handler) == "function"){
                handler = {
                    handler: handler
                };
            }
            handler.types = eventTypes;
            handler.name = name;
            this._triggers[name] = handler;
            this._onRegister(eventTypes);
        } else {
            throw new Error('Could add the trigger "' + name +'" as a previous trigger by that same name exists.');
        }
        return this;
    };

    Delegator.getTrigger = function(name){
        return this._triggers[name];
    };

    Delegator.addEventTypes = function(triggerName, types){
        this.getTrigger(triggerName).types.combine(Array.from(types));
        return this;
    };

    Delegator.debug = function(name){
        if (!Delegator.debugging) Delegator.debugging = [];
        Delegator.debugging.push(name);
    };


    Delegator.implement('register', Delegator.register);

    Element.implement({

        addTrigger: function(name){
            return this.setData('trigger', this.getTriggers().include(name).join(' '));
        },

        removeTrigger: function(name){
            return this.setData('trigger', this.getTriggers().erase(name).join(' '));
        },

        getTriggers: function(){
            var triggers = this.getData('trigger');
            if (!triggers) return [];
            return triggers.trim().split(spaceOrCommaRegex);
        },

        hasTrigger: function(name){
            return this.getTriggers().contains(name);
        }

    });

})();

// Begin: Source/Delegators/Delegator.FxReveal.js
/*
---
description: Provides methods to reveal, dissolve, nix, and toggle using Fx.Reveal.
provides: [Delegator.FxReveal, Delegator.Reveal, Delegator.ToggleReveal, Delegator.Dissolve, Delegator.Nix]
requires: [Behavior/Delegator, More/Fx.Reveal]
script: Delegator.FxReveal.js
name: Delegator.FxReveal

...
*/
(function(){

    var triggers = {};

    ['reveal', 'toggleReveal', 'dissolve', 'nix'].each(function(action){

        triggers[action] = {
            handler: function(event, link, api){
                var targets;
                if (api.get('target')){
                    targets = new Elements([link.getElement(api.get('target'))]);
                    if (!targets) api.fail('could not locate target element to ' + action, link);
                } else if (api.get('targets')){
                    targets = link.getElements(api.get('targets'));
                    if (!targets.length) api.fail('could not locate target elements to ' + action, link);
                } else {
                    targets = new Elements([link]);
                }

                var fxOptions = api.getAs(Object, 'fxOptions');
                if (fxOptions){
                    targets.each(function(target){
                        target.get('reveal').setOptions(fxOptions);
                    });
                }
                if (action == 'toggleReveal') targets.get('reveal').invoke('toggle');
                else targets[action]();
                if (!api.getAs(Boolean, 'allowEvent')) event.preventDefault();
            }
        };

    });

    Delegator.register('click', triggers);

})();

// Begin: Source/Behaviors/Behavior.BS.Alert.js
/*
---

name: Behavior.BS.Alert

description: This file just depends on the Fx.Reveal delegator in More-Behaviors to ensure you get it if you load the entire Bootstrap JS package.

license: MIT-style license.

authors: [Aaron Newton]

requires:
 - More-Behaviors/Delegator.Nix

provides: [Behavior.BS.Alert]

...
*/

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
var Bootstrap = {
    version: 3
};

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
                if (this.element == e.target) this.hide();
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

        if (Bootstrap.version > 2){
            if (this.options.closeOnClickOut){
                this.element.addEvent('click', this.bound.bodyClick);
            }
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
        this.element.addEvent('click:relay(.close, .dismiss, [data-dismiss=modal])', this.bound.hide);
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

        if (Bootstrap.version == 2) document.id(document.body).removeEvent('click', this.bound.hide);
        document.removeEvent('keyup', this.bound.keyMonitor);
        this.element.removeEvent('click:relay(.close, .dismiss, [data-dismiss=modal])', this.bound.hide);

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
                this._mask = new Element('div.modal-backdrop.in');
                if (this._checkAnimate()) this._mask.addClass('fade');
            }
        }
        if (this.options.closeOnClickOut && Bootstrap.version == 2){
            if (this._mask) this._mask.addEvent('click', this.bound.hide);
            else document.id(document.body).addEvent('click', this.bound.hide);
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
        var els = this.element.removeClass('open').getElements('.open').removeClass('open');
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
            var parent;
            if (el.match('[data-toggle="dropdown"]') || el.getParent('[data-toggle="dropdown"] !')){
                parent = el.getParent('.dropdown, .btn-group');
            }
            // backwards compatibility
            if (!parent) parent = el.match('.dropdown-toggle') ? el.getParent() : el.getParent('.dropdown-toggle !');
            if (parent){
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

requires: [Core/Element.Event, Core/Fx.Tween, Core/Fx.Morph, Core/Element.Dimensions, Core/Cookie, More/Element.Shortcuts, More/Element.Measure]

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


// Begin: Source/3rdParty/MooHashChange.js
/*
---
name: MooHashChange

description: Added the onhashchange event

license: MIT-style

authors:
- sdf1981cgn
- Greggory Hernandez

requires:
- Core/Element.Event

provides: [Element.Events.hashchange]

...
*/
Element.Events.hashchange = {
  onAdd: function () {
    var hash = location.hash;

    var hashchange = function () {
      if (hash == location.hash) return;
      else hash = location.hash;

      var value = (hash.indexOf('#') == 0 ? hash.substr(1) : hash);
      window.fireEvent('hashchange', value);
      document.fireEvent('hashchange', value);
    };

    if (("onhashchange" in window) && ((document.documentMode != 5) && (document.documentMode != 7))) {
      window.onhashchange = hashchange;
    }
    else {
      hashchange.periodical(50);
    }
  }
};

// Begin: Source/Layout/TabSwapper.Hash.js
/*
---

name: TabSwapper.Hash

description: Stores tab selection in the window.hash

license: MIT-Style License

requires: [/TabSwapper, More/String.QueryString, More/Object.Extras, /Element.Events.hashchange]

provides: TabSwapper.Hash

...
*/

var getHash = function(){
  return window.location.hash.substring(1, window.location.hash.length).parseQueryString();
};

TabSwapper.Hash = new Class({
  Extends: TabSwapper,
  options: {
    hash: null // the hash value to store the state in
  },
  initialize: function(options){
    this.setOptions(options);
    // delete the hash option on startup so that the call to show(0) doesn't change the location hash
    hash = this.options.hash;
    if (hash){
      delete options.hash;
      delete this.options.hash;
      options.preventDefault = true;
    }
    this.parent(options);
    if (hash){
      // put the hash back
      this.options.hash = hash;
      this.bound = {
        showByHash: this.showByHash.bind(this)
      };
      // watch hashchange for changes
      window.addEvent('hashchange', this.bound.showByHash);
      this.showByHash();
    }
  },
  // shows a section based on the window location hash value
  showByHash: function(){
    var i = this.getIndexByHash();
    if (i || i===0) this.show(i);
    return this;
  },
  // gets the index to show based on an elementID
  // returns NULL if nothing is found
  getIndexById: function(id){
    var target = document.id(id);
    if (target && this.tabs.contains(target)) return this.tabs.indexOf(target);
    else if (target && this.sections.contains(target)) return this.sections.indexOf(target);
    return null;
  },
  // gets the hash value and returns the index to be shown
  // returns UNDEFINED if there was no hash value
  // returns NULL if no element was found and the value wasn't an int already
  // NOTE: hash value may be an int or a string; int if the tab/section had no id
  getIndexByHash: function(){
    var hash = getHash();
    if (!hash) return this;
    var value = hash[this.options.hash];
    if (value && isNaN(value.toInt())){
      var i = this.getIndexById(value);
      if (i !== null) value = i;
      else return null;
    }
    return value;
  },
  // for optimization purposes, we store the sections, the base class doesn't do this
  addTab: function(tab, section, clicker, index){
    this.parent.apply(this, arguments);
    this.sections[this.tabs.indexOf(tab)] = section;
  },
  // on show, update the hash
  show: function(i){
    this.parent.apply(this, arguments);
    if (this.options.hash) {
      var hash = getHash() || {};
      hash[this.options.hash] = this.tabs[i].get('id') || this.sections[i].get('id') || i;
      window.location.hash = Object.cleanValues(Object.toQueryString(hash));
    }
  },
  destroy: function(){
    if (this.bound) window.removeEvent('hashchange', this.bound.showByHash);
    this.tabs.each(function(el){
      el.removeEvents();
    });
    this.tabs = null;
    this.sections = null;
  }
});

// Begin: Source/Behaviors/Behavior.Tabs.js
/*
---
name: Behavior.Tabs
description: Adds a tab interface (TabSwapper instance) for elements with .css-tab_ui. Matched with tab elements that are .tabs and sections that are .tab_sections.
provides: [Behavior.Tabs]
requires: [Behavior/Behavior, /TabSwapper.Hash]
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

            var ts = new TabSwapper.Hash(
                Object.merge(
                    {
                        tabs: tabs,
                        sections: sections
                    },
                    Object.cleanValues(
                        api.getAs({
                            hash: String,
                            cookieName: String,
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
                api.fireEvent('layout:display', sections[0].getParent());
            });

            // get the element to delegate clicks to - defaults to the container
            var target = element;
            if (api.get('delegationTarget')) target = element.getElement(api.get('delegationTarget'));
            if (!target) api.fail('Could not find delegation target for tabs');

            // delegate watching click events for any element with an #href
            target.addEvent('click:relay([href^=#])', function(event, link){
                if (link.get('href') == "#") return;
                // attempt to find the target for the link within the page
                var target = element.getElement(link.get('href'));
                // if the target IS a tab, do nothing; valid targets are *sections*
                if (ts.tabs.contains(target)) return;
                // if no target was found at all, warn
                if (!target) api.warn('Could not switch tab; no section found for ' + link.get('href'));
                // if the target is a section, show it.
                if (ts.sections.contains(target)) {
                    event.preventDefault();
                    var delegator = api.getDelegator();
                    if (delegator) delegator._eventHandler(event, ts.tabs[ts.sections.indexOf(target)]);
                    ts.show(ts.sections.indexOf(target));
                }
            });

            element.store('TabSwapper', ts);
            api.onCleanup(function(){
                ts.destroy();
                element.eliminate('TabSwapper');
            });
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
 * quick console shim https://gist.github.com/bgrins/5108712
 */


(function() {
    var method;
    var noop = function() {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
})();
/*!

 handlebars v1.0.12

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

@license
*/

// lib/handlebars/browser-prefix.js
(function(undefined) {
  var Handlebars = {};
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
    objectType = '[object Object]';

// Sourced from lodash
// https://github.com/bestiejs/lodash/blob/master/LICENSE.txt
function isFunction(value) {
  return typeof value === 'function';
}
// fallback for older versions of Chrome and Safari
if (isFunction(/x/)) {
  isFunction = function(value) {
    return typeof value === 'function' && toString.call(value) === '[object Function]';
  };
}

function isArray(value) {
  return (value && typeof value === 'object') ? toString.call(value) === '[object Array]' : false;
};

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

  if (isFunction(context)) { context = context.call(this); }

  if(context === true) {
    return fn(this);
  } else if(context === false || context == null) {
    return inverse(this);
  } else if (isArray(context)) {
    if(context.length > 0) {
      return Handlebars.helpers.each(context, options);
    } else {
      return inverse(this);
    }
  } else {
    return fn(context);
  }
});

Handlebars.createFrame = function(object) {
  var obj = {};
  Handlebars.Utils.extend(obj, object);
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

  if (isFunction(context)) { context = context.call(this); }

  if (options.data) {
    data = Handlebars.createFrame(options.data);
  }

  if(context && typeof context === 'object') {
    if (isArray(context)) {
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
  if (isFunction(conditional)) { conditional = conditional.call(this); }

  if(Handlebars.Utils.isEmpty(conditional)) {
    return options.inverse(this);
  } else {
    return options.fn(this);
  }
});

Handlebars.registerHelper('unless', function(conditional, options) {
  return Handlebars.helpers['if'].call(this, conditional, {fn: options.inverse, inverse: options.fn});
});

Handlebars.registerHelper('with', function(context, options) {
  if (isFunction(context)) { context = context.call(this); }

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
  return "" + this.string;
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
    /*jshint eqnull: true */

    // don't escape SafeStrings, since they're already safe
    if (string instanceof Handlebars.SafeString) {
      return string.toString();
    } else if (!string && string !== 0) {
      return "";
    }

    // Force a string conversion as this will be done by the append regardless and
    // the regex test will do this transparently behind the scenes, causing issues if
    // an object's to string has escaped characters in it.
    string = "" + string;

    if(!possible.test(string)) { return string; }
    return string.replace(badChars, escapeChar);
  },

  isEmpty: function(value) {
    if (!value && value !== 0) {
      return true;
    } else if (isArray(value) && value.length === 0) {
      return true;
    } else {
      return false;
    }
  }
};
;
// lib/handlebars/runtime.js

function checkRevision(compilerInfo) {
  var compilerRevision = compilerInfo && compilerInfo[0] || 1,
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
}

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

        if (param && common && (param !== common)) {
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
      var namespace = options.partial ? options : Handlebars,
          helpers,
          partials;

      if (!options.partial) {
        helpers = options.helpers;
        partials = options.partials;
      }
      var result = templateSpec.call(
            container,
            namespace, context,
            helpers,
            partials,
            options.data);

      if (!options.partial) {
        checkRevision(container.compilerInfo);
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
    var options = { partial: true, helpers: helpers, partials: partials, data: data };

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
  if (typeof module === 'object' && module.exports) {
    // CommonJS
    module.exports = Handlebars;

  } else if (typeof define === "function" && define.amd && false) {
    // AMD modules
    define(function() { return Handlebars; });

  } else {
    // other, i.e. browser
    this.Handlebars = Handlebars;
  }
}).call(this);
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
        settings = {
            autoClose: 0
        },
        emptyString = "",
        // external = win.external,
        isSupported = Browser.Features.notifications = (function() {
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
            return!!(/* Safari, Chrome */win.Notification || /* Chrome & ff-html5notifications plugin */win.webkitNotifications || /* Firefox Mobile */navigator.mozNotification /* || IE9+ (external && external.msIsSiteMode() !== undefined)*/);
        }).attempt() || false,
        ieVerification = Math.floor((Math.random() * 10) + 1),
        noop = function () {};
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
        }/* else if (external && external.msIsSiteMode()) { // IE9+ on win7+
            //Clear any previous notifications
            external.msSiteModeClearIconOverlay();
            external.msSiteModeSetIconOverlay((_.isString(options.icon) ? options.icon : options.icon.x16), title);
            external.msSiteModeActivate();
            notification = {
                "ieVerification": ieVerification + 1
            };
        }*/
        return notification;
    }
    function getWrapper(notification) {
        return {
            close: function () {
                if (notification) {
                    if (notification.close) {
                        //http://code.google.com/p/ff-html5notifications/issues/detail?id=58
                        notification.close();
                    }/* else if (external && external.msIsSiteMode()) {
                        if (notification.ieVerification === ieVerification) {
                            external.msSiteModeClearIconOverlay();
                        }
                    }*/
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
        }/* else if (external && (external.msIsSiteMode() !== undefined)) { //keep last 
            //IE9+
            permission = external.msIsSiteMode() ? PERMISSION_GRANTED : PERMISSION_DEFAULT;
        }*/
        return permission;
    }
    /**
     *  
     */
    function config(params) {
        if (_.isObject(params)) {
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

        var script = new Element('script', {
                src: source,
                type: 'text/javascript',
                async: true
            }),
            doc = properties.document || document,
            load = properties.onload || properties.onLoad;

        delete properties.onload;
        delete properties.onLoad;
        delete properties.document;

        if (load){
            if (!script.addEventListener){
                script.addEvent('readystatechange', function(){
                    if (['loaded', 'complete'].contains(this.readyState)) load.call(this);
                });
            } else {
                script.addEvent('load', load);
            }
        }

        return script.set(properties).inject(doc.head);
    }
};

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
;(function(exports){
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
			_set: function(key, value){
				// needs to be bound the the instance.
				if (!key || typeof value === 'undefined') return this;

				// custom setter - see bit further down
				if (this.properties[key] && this.properties[key]['set'])
					return this.properties[key]['set'].call(this, value);

				// no change? this is crude and works for primitives.
				if (this._attributes[key] && isEqual(this._attributes[key], value))
					return this;

				// basic validator support
				var validator = this.validate(key, value);
				if (this.validators[key] && validator !== true){
					var obj = {};
					obj[key] = {
						key: key,
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
					this._attributes[key] = value;
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
				return (key && typeof this._attributes[key] !== 'undefined') ? this._attributes[key] : null;
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
		// requires epitome object only.
		define(['./epitome-isequal', './epitome-events'], wrap);
	}
	else if (typeof module !== 'undefined' && module.exports){
		// CommonJS module is defined
		module.exports = wrap(require('./epitome-isequal'), require('./epitome-events'));
	}
	else {
		exports.Epitome || (exports.Epitome = {isEqual: {}, Events: {}});
		exports.Epitome.Model = wrap(exports.Epitome.isEqual, exports.Epitome.Events);
	}
}(this));
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
                        var data = this.options.minimize ? Object.filter(this._attributes, this._filter, this) : this._attributes;
                        this.properties.storage.set(this.options.key, data);
                        this.trigger('save');
                    }
                    return this;
                },

                _filter: function(val, key) {
                    return !Epitome.isEqual(val, this.options.defaults[key]);//dont store defaults if minimize is true
                },

                clear: function() {
                    this.properties.storage.remove(this.options.key);
                },

                destroy: function() {
                    // destroy the model and the storage space
                    this.clear();
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
						path = hash.split('?')[0].replace(/%20/g, " "),
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

					notfound && self.trigger('undefined', {
						hash: hash,
						request: path.slice(1),
						path: path,
						query: query
					});
					/*jshint loopfunc:false */
				});

				this.trigger('ready');
				this.options.triggerOnLoad && window.fireEvent(hc);
			},

			navigate: function(route, trigger){
				route = route.replace(/\s+/g, "%20");
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
				events: {},

				//Automatically match methods from the instances methods to element events
				//e.g. if view has method removeTask clicking a.task-remove will call removeTask
				autoEvents: true
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
					if(self.options.autoEvents && Type.isFunction(self[method])) {
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
this["qwebirc"] = this["qwebirc"] || {};
this["qwebirc"]["templates"] = this["qwebirc"]["templates"] || {};

this["qwebirc"]["templates"]["modifiablecss"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", escapeExpression=this.escapeExpression;


  buffer += "#ircui {height: 100%;width: 100%;overflow: hidden;font-family: Verdana, sans-serif;}.qui .hidden, .qui .invisible {display: none;}.channel-name {background-color: rgb(255, 255, 191);border: 1px solid #C8D1DB;border-radius: 4px 4px 4px 4px;color: #000000;cursor: default;font-size: 0.8em;padding: 2px;text-decoration: none;white-space: nowrap;float: left;margin: 1px 0px 0px 1px;font-weight: bold;}.qui .widepanel {width: 100%;}.qui .lines {color: black;overflow: auto;font-size: "
    + escapeExpression(helpers.$css.call(depth0, "font_size", 12, {hash:{},data:data}))
    + "px;background: "
    + escapeExpression(helpers.$css.call(depth0, "lines_background", "f2f0ff", "c", {hash:{},data:data}))
    + ";}.qui .lines .timestamp {display: "
    + escapeExpression(helpers.$css.call(depth0, "show_timestamps", "inline", "comp", "none", {hash:{},data:data}))
    + ";}.qui .lines .nick {margin-right: 4px;}.qui .lines .nick .channel {color: rgb(109, 89, 89);}.qui .ircwindow .lines {font-family: Consolas, \"Lucida Console\", monospace;text-indent: 10px;padding-left: 1em;word-wrap: break-word;}.qui .lines .highlight1 {background-color: "
    + escapeExpression(helpers.$css.call(depth0, "lines_highlight1", "f6ff94", "c", {hash:{},data:data}))
    + ";}.qui .lines .highlight2 {background-color: "
    + escapeExpression(helpers.$css.call(depth0, "lines_highlight2", "A4FCCA", "c", {hash:{},data:data}))
    + ";}.qui .lines .highlight3 {background-color: "
    + escapeExpression(helpers.$css.call(depth0, "lines_highlight3", "FAC3D5", "c", {hash:{},data:data}))
    + ";}.qui .lines .mentioned {background-color: "
    + escapeExpression(helpers.$css.call(depth0, "mentioned_colour", "E63772", "c", {hash:{},data:data}))
    + " !important;}.qui .properties {background-color: "
    + escapeExpression(helpers.$css.call(depth0, "menu_background", "f2f0ff", "c", {hash:{},data:data}))
    + ";border-top: 1px solid "
    + escapeExpression(helpers.$css.call(depth0, "menu_border", "c8d2dc", "c", {hash:{},data:data}))
    + ";height: 25px;}.qui .topic .emptytopic {color: gray;}.qui .topic {color: gray;padding-left: 5px;font-size: 0.7em;cursor: default;background-color: "
    + escapeExpression(helpers.$css.call(depth0, "topic_background", "f2f0ff", "c", {hash:{},data:data}))
    + ";border-bottom: 1px dashed "
    + escapeExpression(helpers.$css.call(depth0, "topic_border", "c8d2dc", "c", {hash:{},data:data}))
    + ";}/*tab stuff*/.qui .outertabbar {border-bottom: 1px solid "
    + escapeExpression(helpers.$css.call(depth0, "tabbar_border", "c3cee0", "c", {hash:{},data:data}))
    + ";background: "
    + escapeExpression(helpers.$css.call(depth0, "tabbar_background", "e2ecf9", "c", {hash:{},data:data}))
    + ";height: 26px;line-height: 20px;padding: 2px 0;}.qui .outertabbar > * {vertical-align: top;}.qui .tabbar {color: "
    + escapeExpression(helpers.$css.call(depth0, "tabbar_text", "000000", "c", {hash:{},data:data}))
    + ";display: inline-block;overflow-x: hidden;margin-left: 10px;font-size: 13px;height: 22px;}.qui .tabbar .tab {padding: 2px;cursor: default;margin-right: 3px;white-space: nowrap;font-weight: bold;color: "
    + escapeExpression(helpers.$css.call(depth0, "tab_text", "000000", "c", {hash:{},data:data}))
    + ";border: 1px solid "
    + escapeExpression(helpers.$css.call(depth0, "tab_border", "c8d2dc", "c", {hash:{},data:data}))
    + ";border-radius: 4px;-moz-border-radius: 4px;-webkit-border-radius: 4px;}.qui .tabbar .tab:hover {background: "
    + escapeExpression(helpers.$css.call(depth0, "tab_hover", "ffffff", "c", {hash:{},data:data}))
    + ";border: 1px solid #c8d2dc;-moz-border-radius: 4px;-webkit-border-radius: 4px;}.qui .tabbar .hilight-activity.tab {color: #009900;}.qui .tabbar .hilight-speech.tab {color: #0000ff;}.qui .tabbar .hilight-us.tab {color: #ff0000;background: rgb(216, 216, 138);}.qui .tabbar .selected.tab {background: "
    + escapeExpression(helpers.$css.call(depth0, "tab_selected", "ffffff", "c", {hash:{},data:data}))
    + ";border: 1px solid "
    + escapeExpression(helpers.$css.call(depth0, "tab_selected_border", "c8d2dc", "c", {hash:{},data:data}))
    + ";-moz-border-radius: 4px;-webkit-border-radius: 4px;color: "
    + escapeExpression(helpers.$css.call(depth0, "tab_selected_text", "333333", "c", {hash:{},data:data}))
    + ";}.qui .buttons {display: none;}.qui.signed-in .buttons {display: inline-block;cursor: pointer;}.buttons span {vertical-align: middle;display: inline-block;}/* tab stuff *//*irc input stuff*/.qui .input {background-color: "
    + escapeExpression(helpers.$css.call(depth0, "menu_background", "f2f0ff", "c", {hash:{},data:data}))
    + ";margin: 0;}.qui .input div {border-top: 1px solid "
    + escapeExpression(helpers.$css.call(depth0, "input_border", "c3cee0", "c", {hash:{},data:data}))
    + ";padding: 0 5px 1px;margin: 0;width: 100%;}.qui .input div > .input-group-addon {cursor:pointer;cursor:hand;padding: 2px 5px;}.qui .input div > * {height: 24px;}.qui .input .nickname {color: #524F50;font-size: 14px;}.qui .user .status {border-radius: 50%;display: inline-block;margin-right: 3px;}.qui .user .status.voice {width: 8px;height: 8px;background-color: rgb(223, 187, 47);background-image: radial-gradient(45px 45px 45deg, circle, yellow 0%, orange 100%, red 95%);background-image: -moz-radial-gradient(45px 45px 45deg, circle, yellow 0%, orange 100%, red 95%);background-image: -o-radial-gradient(45px 45px 45deg, circle, yellow 0%, orange 100%, red 95%);background-image: -webkit-radial-gradient(45px 45px, circle, yellow, orange);animation-name: spin;animation-duration: 3s;animation-iteration-count: infinite;animation-timing-function: linear;-webkit-animation-name: spin;-webkit-animation-duration: 3s;-webkit-animation-iteration-count: infinite;-webkit-animation-timing-function: linear;-moz-animation-name: spin;-moz-animation-duration: 3s;-moz-animation-iteration-count: infinite;-moz-animation-timing-function: linear;-o-animation-name: spin;-o-animation-duration: 3s;-o-animation-iteration-count: infinite;-o-animation-timing-function: linear;}.qui .user .status.op {width: 8px;height: 8px;background-color: #7AE60E;background-image: radial-gradient(45px 45px 45deg, circle, #5FFF4A 3%, #7AE60E 76%);background-image: -moz-radial-gradient(45px 45px 45deg, circle, #5FFF4A 3%, #7AE60E 76%);background-image: -o-radial-gradient(45px 45px, circle, #5FFF4A 3%, #7AE60E 76%);background-image: -webkit-radial-gradient(45px 45px, circle, #5FFF4A 3%, #7AE60E 76%);animation-name: spin;animation-duration: 3s;animation-iteration-count: infinite;animation-timing-function: linear;-webkit-animation-name: spin;-webkit-animation-duration: 3s;-webkit-animation-iteration-count: infinite;-webkit-animation-timing-function: linear;-moz-animation-name: spin;-moz-animation-duration: 3s;-moz-animation-iteration-count: infinite;-moz-animation-timing-function: linear;-o-animation-name: spin;-o-animation-duration: 3s;-o-animation-iteration-count: infinite;-o-animation-timing-function: linear;}.qui .input .tt-query {border: 1px solid "
    + escapeExpression(helpers.$css.call(depth0, "input_border", "c3cee0", "c", {hash:{},data:data}))
    + ";padding: 0;height: 26px;text-indent: 5px;}.qui .input .decorated {background-image: linear-gradient(bottom, rgb(235,235,232) 54%, rgb(247,250,240) 66%);background-image: -o-linear-gradient(bottom, rgb(235,235,232) 54%, rgb(247,250,240) 66%);background-image: -moz-linear-gradient(bottom, rgb(235,235,232) 54%, rgb(247,250,240) 66%);background-image: -webkit-linear-gradient(bottom, rgb(235,235,232) 54%, rgb(247,250,240) 66%);background-image: -ms-linear-gradient(bottom, rgb(235,235,232) 54%, rgb(247,250,240) 66%);background-image: -webkit-gradient(linear,left bottom,left top,color-stop(0.54, rgb(235,235,232)),color-stop(0.66, rgb(247,250,240)));}/*twitter typeahead inspired autocomplete using overlay input box*/.qui .tt-hint {position: absolute;top: 0px;left: 0px;padding: 0;text-indent: 5px;border-color: transparent;box-shadow: none;color: #BDBDBD;}.qui .tt-query {position: relative;vertical-align: top;background-color: transparent;}/*end typeahead*/.qui .input .btn.send {color: grey;padding: 2px 10px;}.qui .nicklist {border-left: 1px solid "
    + escapeExpression(helpers.$css.call(depth0, "nicklist_border", "c8d2dc", "c", {hash:{},data:data}))
    + ";width: 140px;overflow: auto;background: "
    + escapeExpression(helpers.$css.call(depth0, "nicklist_background", "f2f0ff", "c", {hash:{},data:data}))
    + ";color: "
    + escapeExpression(helpers.$css.call(depth0, "nicklist_text", "000000", "c", {hash:{},data:data}))
    + ";font-size: 0.7em;}.qui .nicklist .user, .qui .nick-menu {display: block;color: black;text-decoration: none;cursor: default;border-top: 1px solid "
    + escapeExpression(helpers.$css.call(depth0, "nicklist_background", "f2f0ff", "c", {hash:{},data:data}))
    + ";border-bottom: 1px solid "
    + escapeExpression(helpers.$css.call(depth0, "nicklist_background", "f2f0ff", "c", {hash:{},data:data}))
    + ";padding-left: 1px;}.qui .nick-menu {width: initial;}.qui .nick-menu ul {margin: 0;padding-left: 20px;list-style-type: circle;}.qui .nick-menu li {cursor:pointer;cursor:hand;}.qui .nicklist .selected {display: block;color: black;background: white;text-decoration: none;border-bottom: "
    + escapeExpression(helpers.$css.call(depth0, "nicklist_selected_border", "c8d2dc", "c", {hash:{},data:data}))
    + " 1px solid;cursor: default;}.qui .nicklist .selected-middle {border-top: "
    + escapeExpression(helpers.$css.call(depth0, "nicklist_selected_border", "c8d2dc", "c", {hash:{},data:data}))
    + " 1px solid;}.qui .nicklist .menu {margin: 0 0 0 5px;}.qui .nicklist .menu a {border-bottom: 0;border-top: 0;}.hyperlink-whois, .hyperlink-channel {cursor: pointer;cursor: hand;}.hyperlink-whois:hover, .hyperlink-channel:hover {text-decoration: underline;}.qui .outertabbar .dropdown-tab {cursor: pointer; cursor: hand;display: inline-block;padding-left: 4px;width: 30px;}.qui .dropdownmenu {position: absolute;z-index: 100;border: 1px solid "
    + escapeExpression(helpers.$css.call(depth0, "menu_border", "c8d2dc", "c", {hash:{},data:data}))
    + ";background: "
    + escapeExpression(helpers.$css.call(depth0, "menu_background", "f2f0ff", "c", {hash:{},data:data}))
    + ";list-style: none;padding: 5px 10px;font-size: 0.7em;}.qui .dropdownmenu a {color: black;cursor: pointer;cursor: hand;padding-top: 3px;}.qui .dropdownmenu a:hover {background: "
    + escapeExpression(helpers.$css.call(depth0, "menu_hover_background", "FFFE", "c", {hash:{},data:data}))
    + ";}.qui .dropdownhint {position: relative;left: -500px;z-index: 10;white-space: nowrap;font-size: 0.7em;}.qui .chanmenu {width: 150px;}.qui .chanmenu .hint {float: right;font-size: 75%;color: grey;}.qui hr.lastpos {border: none;border-top: 1px solid "
    + escapeExpression(helpers.$css.call(depth0, "lastpositionbar", "C8D2DC", "c", {hash:{},data:data}))
    + ";margin: .5em 3em;}.qwebirc-init-channels {font-size: 95%;color: #928D8D;text-align: center;}";
  return buffer;
  });

this["qwebirc"]["templates"]["authpage"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  
  return "hidden";
  }

  buffer += "<div class=\"container center\"><form id=\"login\"><h2>Connect to "
    + escapeExpression(((stack1 = depth0.network),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " IRC</h2><div class=\"control-group right\"><label class=\"control-label\" for=\"nickname\">Nickname:<input type=\"text\" class=\"form-control\" data-validate=\"nick\" name=\"basic\" id=\"nickname\" value=\""
    + escapeExpression(((stack1 = depth0.nickname),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" placeholder=\"Nickname\" required /></label></div><div class=\"control-group right ";
  stack2 = helpers.unless.call(depth0, depth0.full, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\"><label class=\"control-label\" for=\"username\">"
    + escapeExpression(((stack1 = depth0.network),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " username:<input type=\"text\" class=\"form-control\" data-validate=\"username\" name=\"full\" id=\"username\" value=\""
    + escapeExpression(((stack1 = depth0.username),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" placeholder=\""
    + escapeExpression(((stack1 = depth0.network),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " username\"></label></div><div class=\"control-group right ";
  stack2 = helpers.unless.call(depth0, depth0.full, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\"><label class=\"control-label\" for=\"password\">Password:<input type=\"password\" class=\"form-control\" data-validate=\"password\" name=\"full\" id=\"password\" value=\""
    + escapeExpression(((stack1 = depth0.password),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"></label></div><div class=\"authenticate\"><label for=\"authenticate\">Authenticate (optional)<input type=\"checkbox\" id=\"authenticate\" "
    + escapeExpression(helpers.check.call(depth0, depth0.full, {hash:{},data:data}))
    + "></label></div><div><input type=\"submit\" value=\"Connect\" class=\"btn btn-primary btn-smaller\" /></div></form><div class=\"qwebirc-init-channels\"><span>"
    + escapeExpression(((stack1 = depth0.channels),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span></div></div>";
  return buffer;
  });

this["qwebirc"]["templates"]["chanmenu"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); partials = this.merge(partials, Handlebars.partials); data = data || {};
  var buffer = "", stack1, self=this;

function program1(depth0,data) {
  
  var stack1;
  stack1 = self.invokePartial(partials.menuitem, 'menuitem', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  }

  buffer += "<div class='chanmenu dropdownmenu'>";
  stack1 = helpers.each.call(depth0, depth0.channels, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</div>";
  return buffer;
  });

this["qwebirc"]["templates"]["channelName"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, functionType="function";


  buffer += "<div class='channel-name'>";
  stack2 = ((stack1 = depth0.channel),typeof stack1 === functionType ? stack1.apply(depth0) : stack1);
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "</div>";
  return buffer;
  });

this["qwebirc"]["templates"]["customlink"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, self=this, functionType="function", escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  
  return "internal";
  }

  buffer += "<a class=\"";
  stack1 = helpers['if'].call(depth0, depth0.internal, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\" href=\""
    + escapeExpression(((stack1 = depth0.val),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">"
    + escapeExpression(((stack1 = depth0.val),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</a>";
  return buffer;
  });

this["qwebirc"]["templates"]["detachedWindow"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); partials = this.merge(partials, Handlebars.partials); data = data || {};
  var buffer = "", stack1, stack2, self=this, functionType="function", escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  var stack1;
  stack1 = self.invokePartial(partials.tabClose, 'tabClose', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  }

  buffer += "<div class='detached-window'><div class='header'><span class='title'>"
    + escapeExpression(((stack1 = depth0.channel),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span>";
  stack2 = helpers.unless.call(depth0, depth0.base, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  stack2 = self.invokePartial(partials.tabAttach, 'tabAttach', depth0, helpers, partials, data);
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "</div><div class=\"content\"></div><div><span class=\"resize-handle ui-icon ui-icon-grip-diagonal-se\"></span></div></div>";
  return buffer;
  });

this["qwebirc"]["templates"]["failed-validator"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<p class=\"help-block\">"
    + escapeExpression(((stack1 = depth0.description),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</p>";
  return buffer;
  });

this["qwebirc"]["templates"]["ircInput"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<form class='input'><div class='tt-ahead input-group'><span class='input-group-addon user'><span class='status "
    + escapeExpression(((stack1 = depth0.status),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "'></span><span class=\"nickname\">"
    + escapeExpression(((stack1 = depth0.nick),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span></span>"
    + "<input class='tt-hint hidden' type='text' autocomplete='off' spellcheck='off' disabled>"
    + "<input class='tt-query form-control irc-input decorated' type='text' autocomplete='off' spellcheck='off'><span class='input-group-btn'><button class='btn btn-default send' type='submit'>&gt;</button></span></div></form>";
  return buffer;
  });

this["qwebirc"]["templates"]["ircMessage"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\""
    + escapeExpression(((stack1 = depth0.type),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"></div>";
  return buffer;
  });

this["qwebirc"]["templates"]["ircTab"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); partials = this.merge(partials, Handlebars.partials); data = data || {};
  var buffer = "", stack1, stack2, self=this, functionType="function";

function program1(depth0,data) {
  
  var stack1;
  stack1 = self.invokePartial(partials.tabClose, 'tabClose', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  }

  buffer += "<span class='tab'>";
  stack2 = ((stack1 = depth0.name),typeof stack1 === functionType ? stack1.apply(depth0) : stack1);
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "&nbsp;";
  stack2 = self.invokePartial(partials.tabDetach, 'tabDetach', depth0, helpers, partials, data);
  if(stack2 || stack2 === 0) { buffer += stack2; }
  stack2 = helpers['if'].call(depth0, depth0.closable, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "</span>";
  return buffer;
  });

this["qwebirc"]["templates"]["ircnick"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var stack1, stack2;
  stack2 = ((stack1 = depth0.userid),typeof stack1 === functionType ? stack1.apply(depth0) : stack1);
  if(stack2 || stack2 === 0) { return stack2; }
  else { return ''; }
  }

function program3(depth0,data) {
  
  var stack1;
  return escapeExpression(((stack1 = depth0.nick),typeof stack1 === functionType ? stack1.apply(depth0) : stack1));
  }

function program5(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "<span class=\"channel\">"
    + escapeExpression(((stack1 = depth0.linkedchannel),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span>";
  return buffer;
  }

  buffer += "<span class=\"nick hyperlink-whois\" data-user='";
  stack1 = helpers['if'].call(depth0, depth0.userid, {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "'>&lt;"
    + escapeExpression(((stack1 = depth0.prefix),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "<span>"
    + escapeExpression(((stack1 = depth0.nick),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span>";
  stack2 = helpers['if'].call(depth0, depth0.linkedchannel, {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "&gt;</span>";
  return buffer;
  });

this["qwebirc"]["templates"]["ircstyle"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<span class=\""
    + escapeExpression(((stack1 = depth0.background),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = depth0.colour),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = depth0.style),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">";
  stack2 = ((stack1 = depth0.text),typeof stack1 === functionType ? stack1.apply(depth0) : stack1);
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "</span>";
  return buffer;
  });

this["qwebirc"]["templates"]["mainmenu"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<ul class=\"main-menu dropdownmenu hidden\"><a class=\"internal\" href=\"options\"><li><span>Options</span></li></a><a class=\"internal\" href=\"embedded\"><li><span>Add webchat to your site</span></li></a><a class=\"internal\" href=\"privacy\"><li><span>Privacy policy</span></li></a><a class=\"internal\" href=\"faq\"><li><span>Frequently asked questions</span></li></a><a class=\"internal\" href=\"feedback\"><li><span>Submit feedback</span></li></a><a class=\"internal\" href=\"about\"><li><span>About qwebirc</span></li></a></ul>";
  });

this["qwebirc"]["templates"]["menubtn"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class='dropdown-tab'><img src='"
    + escapeExpression(((stack1 = depth0.icon),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "' title='menu' alt='menu'></div>";
  return buffer;
  });

this["qwebirc"]["templates"]["menuitem"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += " data-value='"
    + escapeExpression(((stack1 = depth0.value),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "'";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "<span class='hint'>"
    + escapeExpression(((stack1 = depth0.hint),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span>";
  return buffer;
  }

  buffer += "<a";
  stack1 = helpers['if'].call(depth0, depth0.value, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "><li><span>"
    + escapeExpression(((stack1 = depth0.text),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span>";
  stack2 = helpers['if'].call(depth0, depth0.hint, {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "</li></a>";
  return buffer;
  });

this["qwebirc"]["templates"]["message"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class='message "
    + escapeExpression(((stack1 = depth0['class']),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "'><span>"
    + escapeExpression(((stack1 = depth0.message),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span></div>";
  return buffer;
  });

this["qwebirc"]["templates"]["navbar"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"main-menu dropdown-tab\"><img src=\"images/icon.png\" title=\"menu\" alt=\"menu\"></div><div class=\"tabbar\"></div><div class=\"buttons\"><span class=\"to-left ui-icon ui-icon-circle-triangle-w hidden\" name=\"tabscroll\"></span><span class=\"to-right ui-icon ui-icon-circle-triangle-e hidden\" name=\"tabscroll\"></span><span class=\"add-chan ui-icon ui-icon-circle-plus\" title=\"Join a channel\"></span></div>";
  });

this["qwebirc"]["templates"]["nickMenu"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "<h5>"
    + escapeExpression(((stack1 = depth0.nick),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</h5>";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "<li data-exec=\"/QUERY "
    + escapeExpression(((stack1 = depth0.nick),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">query</li>";
  return buffer;
  }

function program5(depth0,data) {
  
  var stack1;
  stack1 = helpers.unless.call(depth0, depth0.theyOped, {hash:{},inverse:self.noop,fn:self.program(6, program6, data),data:data});
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  }
function program6(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "<li data-exec=\"/KICK "
    + escapeExpression(((stack1 = depth0.channel),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = depth0.nick),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">kick</li>";
  return buffer;
  }

function program8(depth0,data) {
  
  var stack1;
  stack1 = helpers['if'].call(depth0, depth0.weOped, {hash:{},inverse:self.noop,fn:self.program(9, program9, data),data:data});
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  }
function program9(depth0,data) {
  
  var stack1;
  stack1 = helpers.unless.call(depth0, depth0.theyOped, {hash:{},inverse:self.noop,fn:self.program(10, program10, data),data:data});
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  }
function program10(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "<li data-exec=\"/OP "
    + escapeExpression(((stack1 = depth0.nick),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">op</li>";
  return buffer;
  }

function program12(depth0,data) {
  
  var stack1;
  stack1 = helpers['if'].call(depth0, depth0.weOped, {hash:{},inverse:self.noop,fn:self.program(13, program13, data),data:data});
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  }
function program13(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "<li data-exec=\"/DEOP "
    + escapeExpression(((stack1 = depth0.nick),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">deop</li>";
  return buffer;
  }

function program15(depth0,data) {
  
  var stack1;
  stack1 = helpers['if'].call(depth0, depth0.weOped, {hash:{},inverse:self.noop,fn:self.program(16, program16, data),data:data});
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  }
function program16(depth0,data) {
  
  var stack1;
  stack1 = helpers.unless.call(depth0, depth0.theyVoiced, {hash:{},inverse:self.noop,fn:self.program(17, program17, data),data:data});
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  }
function program17(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "<li data-exec=\"/VOICE "
    + escapeExpression(((stack1 = depth0.nick),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">voice</li>";
  return buffer;
  }

function program19(depth0,data) {
  
  var stack1;
  stack1 = helpers['if'].call(depth0, depth0.weOped, {hash:{},inverse:self.noop,fn:self.program(20, program20, data),data:data});
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  }
function program20(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "<li data-exec=\"/DEVOICE "
    + escapeExpression(((stack1 = depth0.nick),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">devoice</li>";
  return buffer;
  }

  buffer += "<div class='nick-menu'>";
  stack1 = helpers['if'].call(depth0, depth0.showNick, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "<ul><li data-exec=\"/WHOIS "
    + escapeExpression(((stack1 = depth0.nick),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">whois</li>";
  stack2 = helpers['if'].call(depth0, depth0.notus, {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "<li data-exec=\"/ME "
    + escapeExpression(helpers.format.call(depth0, ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.fishSlap), {hash:{},data:data}))
    + "\">slap</li>";
  stack2 = helpers['if'].call(depth0, depth0.weOped, {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  stack2 = helpers['if'].call(depth0, depth0.notus, {hash:{},inverse:self.noop,fn:self.program(8, program8, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  stack2 = helpers['if'].call(depth0, depth0.notus, {hash:{},inverse:self.noop,fn:self.program(12, program12, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  stack2 = helpers['if'].call(depth0, depth0.notus, {hash:{},inverse:self.noop,fn:self.program(15, program15, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  stack2 = helpers['if'].call(depth0, depth0.notus, {hash:{},inverse:self.noop,fn:self.program(19, program19, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "</ul></div>";
  return buffer;
  });

this["qwebirc"]["templates"]["nickbtn"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class='user' data-user=\""
    + escapeExpression(((stack1 = depth0.nick),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"><span class=\"prefix\">"
    + escapeExpression(((stack1 = depth0.prefix),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span><span class='nick'>"
    + escapeExpression(((stack1 = depth0.nick),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span></div>";
  return buffer;
  });

this["qwebirc"]["templates"]["nickmenubtn"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<li>"
    + escapeExpression(((stack1 = depth0.text),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</li>";
  return buffer;
  });

this["qwebirc"]["templates"]["timestamp"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<span class='timestamp'>"
    + escapeExpression(((stack1 = depth0.time),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " </span>";
  return buffer;
  });

this["qwebirc"]["templates"]["topicBar"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); partials = this.merge(partials, Handlebars.partials); data = data || {};
  var buffer = "", stack1, self=this;


  buffer += "<div class='topic qui colourline'>";
  stack1 = self.invokePartial(partials.topicText, 'topicText', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</div>";
  return buffer;
  });

this["qwebirc"]["templates"]["topicText"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<span title=\""
    + escapeExpression(((stack1 = depth0.title),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">[<span>";
  stack2 = ((stack1 = depth0.topic),typeof stack1 === functionType ? stack1.apply(depth0) : stack1);
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "</span>]</span>";
  return buffer;
  });

this["qwebirc"]["templates"]["userlink"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var stack1, stack2;
  stack2 = ((stack1 = depth0.userid),typeof stack1 === functionType ? stack1.apply(depth0) : stack1);
  if(stack2 || stack2 === 0) { return stack2; }
  else { return ''; }
  }

function program3(depth0,data) {
  
  var stack1;
  return escapeExpression(((stack1 = depth0.nick),typeof stack1 === functionType ? stack1.apply(depth0) : stack1));
  }

  buffer += "<span class='hyperlink-whois' data-user='";
  stack1 = helpers['if'].call(depth0, depth0.userid, {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "'>"
    + escapeExpression(((stack1 = depth0.nick),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span>";
  return buffer;
  });

this["qwebirc"]["templates"]["window"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); partials = this.merge(partials, Handlebars.partials); data = data || {};
  var buffer = "", stack1, stack2, self=this, functionType="function", escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  var stack1;
  stack1 = self.invokePartial(partials.topicBar, 'topicBar', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  stack1 = helpers['if'].call(depth0, depth0.splitPane, {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "<div class=\"qui rightpanel\"></div>";
  return buffer;
  }
function program4(depth0,data) {
  
  var stack1;
  stack1 = self.invokePartial(partials.verticalDivider, 'verticalDivider', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  }

function program6(depth0,data) {
  
  var stack1;
  stack1 = self.invokePartial(partials.ircInput, 'ircInput', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  }

  buffer += "<div class=\"window qui\" data-id=\""
    + escapeExpression(((stack1 = depth0.id),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" data-name=\""
    + escapeExpression(((stack1 = depth0.name),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">";
  stack2 = helpers['if'].call(depth0, depth0.isChannel, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "<div class=\"qui content\"><div class=\"qui leftpanel lines\"></div>";
  stack2 = helpers['if'].call(depth0, depth0.isChannel, {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "</div><div class=\"qui properties\">";
  stack2 = self.invokePartial(partials.channelName, 'channelName', depth0, helpers, partials, data);
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "</div><div class=\"qui bottompanel\">";
  stack2 = helpers['if'].call(depth0, depth0.needsInput, {hash:{},inverse:self.noop,fn:self.program(6, program6, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "</div></div>";
  return buffer;
  });
/*
Copyright (c) 2008-2009 the qwebirc project.
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
project name and URL in the about dialog, thanks!
*/

; (function(window, Epitome, undefined) {
    "use strict";
    var DEBUG = true;

    //common globals
    var document = window.document,
        $ = document.id,
        $$ = document.getElements;


    /* qwebirc -- Copyright (C) 2008-2011 Chris Porter and the qwebirc project --- All rights reserved. */

    //global object
    var qwebirc = window.qwebirc = _.merge(window.qwebirc || {}, {
        irc: {},
        ui: {
            themes: {}
        },
        util: {
            crypto: {}
        },
        global: {
            dynamicBaseURL: "/",
            staticBaseURL: "/"
        },
        config: {},
        auth: {},
        sound: {},
        lang: {},
        templates: {},
        cookies: {
            "options": "qweb-options",
            "history": "qweb-hist",
            "settings": "qweb-settings"
        },
        VERSION: "0.93.97"
    });

    var irc = qwebirc.irc,

        util = qwebirc.util,
        crypto = util.crypto,

        config = qwebirc.config,
        auth = qwebirc.auth,

        ui = qwebirc.ui,
        themes = ui.themes,
        style = ui.style,

        cookies = qwebirc.cookies,

        sound = qwebirc.sound,//,

        lang = qwebirc.lang,

        templates = qwebirc.templates;


ui.WINDOW = {
    status: 1,
    query: 2,
    channel: 4,
    custom: 8,
    connect: 16,
    messages: 32
};

ui.CUSTOM_CLIENT = "custom";

ui.HIGHLIGHT = {
    none: 0,
    activity: 1,
    speech: 2,
    us: 3
};


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
    CHANNEL_TYPES = [ui.WINDOW.channel, ui.WINDOW.query, ui.WINDOW.messages],
    INPUT_TYPES = [ui.WINDOW.status, ui.WINDOW.query, ui.WINDOW.channel, ui.WINDOW.messages];

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

//https://www.alien.net.au/irc/irc2numerics.html
irc.Numerics = { // from node-irc
    "001": {
        "name": "RPL_WELCOME",
        "type": "reply"
    },
    "004": {
        "name": "RPL_MYINFO",
        "type": "reply"
    },
    "005": {
        "name": "RPL_ISUPPORT",
        "type": "reply"
    },
    "200": {
        "name": "RPL_TRACELINK",
        "type": "reply"
    },
    "201": {
        "name": "RPL_TRACECONNECTING",
        "type": "reply"
    },
    "202": {
        "name": "RPL_TRACEHANDSHAKE",
        "type": "reply"
    },
    "203": {
        "name": "RPL_TRACEUNKNOWN",
        "type": "reply"
    },
    "204": {
        "name": "RPL_TRACEOPERATOR",
        "type": "reply"
    },
    "205": {
        "name": "RPL_TRACEUSER",
        "type": "reply"
    },
    "206": {
        "name": "RPL_TRACESERVER",
        "type": "reply"
    },
    "208": {
        "name": "RPL_TRACENEWTYPE",
        "type": "reply"
    },
    "211": {
        "name": "RPL_STATSLINKINFO",
        "type": "reply"
    },
    "212": {
        "name": "RPL_STATSCOMMANDS",
        "type": "reply"
    },
    "213": {
        "name": "RPL_STATSCLINE",
        "type": "reply"
    },
    "214": {
        "name": "RPL_STATSNLINE",
        "type": "reply"
    },
    "215": {
        "name": "RPL_STATSILINE",
        "type": "reply"
    },
    "216": {
        "name": "RPL_STATSKLINE",
        "type": "reply"
    },
    "218": {
        "name": "RPL_STATSYLINE",
        "type": "reply"
    },
    "219": {
        "name": "RPL_ENDOFSTATS",
        "type": "reply"
    },
    "221": {
        "name": "RPL_UMODEIS",
        "type": "reply"
    },
    "241": {
        "name": "RPL_STATSLLINE",
        "type": "reply"
    },
    "242": {
        "name": "RPL_STATSUPTIME",
        "type": "reply"
    },
    "243": {
        "name": "RPL_STATSOLINE",
        "type": "reply"
    },
    "244": {
        "name": "RPL_STATSHLINE",
        "type": "reply"
    },
    "250": {
        "name": "RPL_STATSCONN",
        "type": "reply"
    },
    "251": {
        "name": "RPL_LUSERCLIENT",
        "type": "reply"
    },
    "252": {
        "name": "RPL_LUSEROP",
        "type": "reply"
    },
    "253": {
        "name": "RPL_LUSERUNKNOWN",
        "type": "reply"
    },
    "254": {
        "name": "RPL_LUSERCHANNELS",
        "type": "reply"
    },
    "255": {
        "name": "RPL_LUSERME",
        "type": "reply"
    },
    "256": {
        "name": "RPL_ADMINME",
        "type": "reply"
    },
    "257": {
        "name": "RPL_ADMINLOC1",
        "type": "reply"
    },
    "258": {
        "name": "RPL_ADMINLOC2",
        "type": "reply"
    },
    "259": {
        "name": "RPL_ADMINEMAIL",
        "type": "reply"
    },
    "261": {
        "name": "RPL_TRACELOG",
        "type": "reply"
    },
    "265": {
        "name": "RPL_LOCALUSERS",
        "type": "reply"
    },
    "266": {
        "name": "RPL_GLOBALUSERS",
        "type": "reply"
    },
    "300": {
        "name": "RPL_NONE",
        "type": "reply"
    },
    "301": {
        "name": "RPL_AWAY",
        "type": "reply"
    },
    "302": {
        "name": "RPL_USERHOST",
        "type": "reply"
    },
    "303": {
        "name": "RPL_ISON",
        "type": "reply"
    },
    "305": {
        "name": "RPL_UNAWAY",
        "type": "reply"
    },
    "306": {
        "name": "RPL_NOWAWAY",
        "type": "reply"
    },
    "311": {
        "name": "RPL_WHOISUSER",
        "type": "reply"
    },
    "312": {
        "name": "RPL_WHOISSERVER",
        "type": "reply"
    },
    "313": {
        "name": "RPL_WHOISOPERATOR",
        "type": "reply"
    },
    "314": {
        "name": "RPL_WHOWASUSER",
        "type": "reply"
    },
    "315": {
        "name": "RPL_ENDOFWHO",
        "type": "reply"
    },
    "317": {
        "name": "RPL_WHOISIDLE",
        "type": "reply"
    },
    "318": {
        "name": "RPL_ENDOFWHOIS",
        "type": "reply"
    },
    "319": {
        "name": "RPL_WHOISCHANNELS",
        "type": "reply"
    },

    "320": {
        "name": "RPL_WHOISGENERICTEXT",
        "type": "reply"
    },
    "325": {
        "name": "RPL_WHOISWEBIRC",
        "type": "reply"
    },
    "330": {
        "name": "RPL_WHOISACCOUNT",
        "type": "reply"
    },
    "338": {
        "name": "RPL_WHOISACTUALLY",
        "type": "reply"
    },
    "343": {
        "name": "RPL_WHOISOPERNAME",
        "type": "reply"
    },
    "321": {
        "name": "RPL_LISTSTART",
        "type": "reply"
    },
    "322": {
        "name": "RPL_LIST",
        "type": "reply"
    },
    "323": {
        "name": "RPL_LISTEND",
        "type": "reply"
    },
    "324": {
        "name": "RPL_CHANNELMODEIS",
        "type": "reply"
    },
    "329": {
        "name": "RPL_CREATIONTIME",
        "type": "reply"
    },
    "331": {
        "name": "RPL_NOTOPIC",
        "type": "reply"
    },
    "332": {
        "name": "RPL_TOPIC",
        "type": "reply"
    },
    "333": {
        "name": "RPL_TOPICWHOTIME",
        "type": "reply"
    },
    "341": {
        "name": "RPL_INVITING",
        "type": "reply"
    },
    "342": {
        "name": "RPL_SUMMONING",
        "type": "reply"
    },
    "351": {
        "name": "RPL_VERSION",
        "type": "reply"
    },
    "352": {
        "name": "RPL_WHOREPLY",
        "type": "reply"
    },
    "353": {
        "name": "RPL_NAMREPLY",
        "type": "reply"
    },
    "364": {
        "name": "RPL_LINKS",
        "type": "reply"
    },
    "365": {
        "name": "RPL_ENDOFLINKS",
        "type": "reply"
    },
    "366": {
        "name": "RPL_ENDOFNAMES",
        "type": "reply"
    },
    "367": {
        "name": "RPL_BANLIST",
        "type": "reply"
    },
    "368": {
        "name": "RPL_ENDOFBANLIST",
        "type": "reply"
    },
    "369": {
        "name": "RPL_ENDOFWHOWAS",
        "type": "reply"
    },
    "371": {
        "name": "RPL_INFO",
        "type": "reply"
    },
    "372": {
        "name": "RPL_MOTD",
        "type": "reply"
    },
    "374": {
        "name": "RPL_ENDOFINFO",
        "type": "reply"
    },
    "375": {
        "name": "RPL_MOTDSTART",
        "type": "reply"
    },
    "376": {
        "name": "RPL_ENDOFMOTD",
        "type": "reply"
    },
    "381": {
        "name": "RPL_YOUREOPER",
        "type": "reply"
    },
    "382": {
        "name": "RPL_REHASHING",
        "type": "reply"
    },
    "391": {
        "name": "RPL_TIME",
        "type": "reply"
    },
    "392": {
        "name": "RPL_USERSSTART",
        "type": "reply"
    },
    "393": {
        "name": "RPL_USERS",
        "type": "reply"
    },
    "394": {
        "name": "RPL_ENDOFUSERS",
        "type": "reply"
    },
    "395": {
        "name": "RPL_NOUSERS",
        "type": "reply"
    },
    "401": {
        "name": "ERR_NOSUCHNICK",
        "type": "error"
    },
    "402": {
        "name": "ERR_NOSUCHSERVER",
        "type": "error"
    },
    "403": {
        "name": "ERR_NOSUCHCHANNEL",
        "type": "error"
    },
    "404": {
        "name": "ERR_CANNOTSENDTOCHAN",
        "type": "error"
    },
    "405": {
        "name": "ERR_TOOMANYCHANNELS",
        "type": "error"
    },
    "406": {
        "name": "ERR_WASNOSUCHNICK",
        "type": "error"
    },
    "407": {
        "name": "ERR_TOOMANYTARGETS",
        "type": "error"
    },
    "409": {
        "name": "ERR_NOORIGIN",
        "type": "error"
    },
    "411": {
        "name": "ERR_NORECIPIENT",
        "type": "error"
    },
    "412": {
        "name": "ERR_NOTEXTTOSEND",
        "type": "error"
    },
    "413": {
        "name": "ERR_NOTOPLEVEL",
        "type": "error"
    },
    "414": {
        "name": "ERR_WILDTOPLEVEL",
        "type": "error"
    },
    "421": {
        "name": "ERR_UNKNOWNCOMMAND",
        "type": "error"
    },
    "422": {
        "name": "ERR_NOMOTD",
        "type": "error"
    },
    "423": {
        "name": "ERR_NOADMININFO",
        "type": "error"
    },
    "424": {
        "name": "ERR_FILEERROR",
        "type": "error"
    },
    "431": {
        "name": "ERR_NONICKNAMEGIVEN",
        "type": "error"
    },
    "432": {
        "name": "ERR_ERRONEUSNICKNAME",
        "type": "error"
    },
    "433": {
        "name": "ERR_NICKNAMEINUSE",
        "type": "error"
    },
    "436": {
        "name": "ERR_NICKCOLLISION",
        "type": "error"
    },
    "441": {
        "name": "ERR_USERNOTINCHANNEL",
        "type": "error"
    },
    "442": {
        "name": "ERR_NOTONCHANNEL",
        "type": "error"
    },
    "443": {
        "name": "ERR_USERONCHANNEL",
        "type": "error"
    },
    "444": {
        "name": "ERR_NOLOGIN",
        "type": "error"
    },
    "445": {
        "name": "ERR_SUMMONDISABLED",
        "type": "error"
    },
    "446": {
        "name": "ERR_USERSDISABLED",
        "type": "error"
    },
    "451": {
        "name": "ERR_NOTREGISTERED",
        "type": "error"
    },
    "461": {
        "name": "ERR_NEEDMOREPARAMS",
        "type": "error"
    },
    "462": {
        "name": "ERR_ALREADYREGISTRED",
        "type": "error"
    },
    "463": {
        "name": "ERR_NOPERMFORHOST",
        "type": "error"
    },
    "464": {
        "name": "ERR_PASSWDMISMATCH",
        "type": "error"
    },
    "465": {
        "name": "ERR_YOUREBANNEDCREEP",
        "type": "error"
    },
    "467": {
        "name": "ERR_KEYSET",
        "type": "error"
    },
    "471": {
        "name": "ERR_CHANNELISFULL",
        "type": "error"
    },
    "472": {
        "name": "ERR_UNKNOWNMODE",
        "type": "error"
    },
    "473": {
        "name": "ERR_INVITEONLYCHAN",
        "type": "error"
    },
    "474": {
        "name": "ERR_BANNEDFROMCHAN",
        "type": "error"
    },
    "475": {
        "name": "ERR_BADCHANNELKEY",
        "type": "error"
    },
    "481": {
        "name": "ERR_NOPRIVILEGES",
        "type": "error"
    },
    "482": {
        "name": "ERR_CHANOPPRIVSNEEDED",
        "type": "error"
    },
    "483": {
        "name": "ERR_CANTKILLSERVER",
        "type": "error"
    },
    "491": {
        "name": "ERR_NOOPERHOST",
        "type": "error"
    },
    "501": {
        "name": "ERR_UMODEUNKNOWNFLAG",
        "type": "error"
    },
    "502": {
        "name": "ERR_USERSDONTMATCH",
        "type": "error"
    }
}
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

    // restRight = function(xs) {
    //     return xs.slice(0, xs.length - 1);
    // },

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

    // splitBang = _.partial(split, "!"),

    // joinBang = _.partial(join, "!"),

    joinEmpty = _.partial(join, ""),

    // splitEmpty = split(""),
    joinComma = util.joinChans = _.partial(join, ","),

    // splitComma = split(","),
    concatUnique = _.compose(_.uniq, Array.concat),

    concatSep = _.autoCurry(function(sep, s1, s2) {
        if (_.isArray(s1)) {
            s1 = s1.join(sep);
        }
        if (_.isArray(s2)) {
            s2 = s2.join(sep);
        }
        if (s1 !== "" && s2 !== "") {
            return s1 + sep + s2;
        } else {
            return s1 + s2;
        }
    }),

    concatSpace = concatSep(" ");

util.format = util.formatter = function(message, data) {
    return (message.message || message).substitute(data);
};

util.formatSafe = util.formatterSafe = function(str, object, regexp) { //if property not found string is not replaced
    return String(str).replace(regexp || (/\\?\{([^{}]+)\}/g), function(match, name) {
        if (match.charAt(0) == '\\') return match.slice(1);
        return (object[name] != null) ? object[name] : match;
    });
}

//String -> String
// megawac!~megawac@megawac.user.gamesurge -> megawac
// util.hostToNick = _.compose(joinBang, restRight, splitBang);
//megawac!~megawac@megawac.user.gamesurge -> ~megawac@megawac.user.gamesurge
// util.hostToHost = _.compose(Array.getLast, splitBang);


var isChannel = util.isChannel = _.and('.length > 1', _.partial(startsWith, '#')),

    formatChannel = util.formatChannel = function(chan) {
        if (chan.length >= 1 && !isChannel(chan)) {
            chan = '#' + chan;
        }
        return chan;
    },

    unformatChannel = util.unformatChannel = function(chan) {
        if (isChannel(chan)) {
            chan = chan.slice(1);
        }
        return chan;
    },

    appendChannel = function(chans, chan) {
        return $A(chans).concat(chan);
    },

    splitChan = util.splitChans = function(xs) {
        if (_.isArray(xs)) return xs.length > 0 ? xs : [""];
        return xs.split(",");
    },

    //function to determine if a string is one of the stock windows
    isBaseWindow = util.isBaseWindow = _.partial(_.contains, BASE_WINDOWS),

    isChannelType = util.isChannelType = _.partial(_.contains, CHANNEL_TYPES);


util.windowNeedsInput = _.partial(_.contains, INPUT_TYPES);

//String -> String
//formatChannelStrings("test,test2,#test3,#tes#t4,test5,test6") => "#test,#test2,#test3,#tes#t4,#test5,#test6"
util.formatChannelString = _.compose(joinComma, _.uniq, _.partial(_.func.map, formatChannel), splitChan);
util.unformatChannelString = _.compose(_.uniq, _.partial(_.func.map, formatChannel), splitChan);

util.formatURL = function(link) {
    link = util.isChannel(link) ? link.replace("#", "@") : link;
    return '#!' + link;
}

util.unformatURL = function(link) {
    return link.replace(/^!/, "").replace(/^@/, "#");
};

//appends a channel to the end of the list of channels
//string -> string
//could just call Array.include?
util.addChannel = _.compose( /*joinComma,*/ _.uniq, /* splitChan, */ appendChannel);
//adds channel to front of list of channels
util.prependChannel = _.compose( /*joinComma,*/ _.uniq, /* splitChan, */ _.flip(appendChannel));

util.removeChannel = _.compose(_.uniq, function(chans, chan) {
    return _.clone(chans).erase(chan);
});

(function() {
/*
 * taken from https://github.com/martynsmith/node-irc
 * parseMessage(line, stripColors)
 *
 * takes a raw "line" from the IRC server and turns it into an object with
 * useful keys
 * ":OCD!~OCD@76.72.16.142 PRIVMSG #tf2mix :mix servers are down. join mumble for an inhouse pug." => {"prefix":"OCD!~OCD@76.72.16.142","nick":"OCD","user":"~OCD","host":"76.72.16.142","command":"PRIVMSG","rawCommand":"PRIVMSG","commandType":"normal","args":["#tf2mix","mix servers are down. join mumble for an inhouse pug."]}
 */

var prefix_re = /^([_a-zA-Z0-9\[\]\\`^{}|-]*)(!([^@]+)@(.*))?$/,
    hasprefix_re = /^:([^ ]+) +/,
    colonrem_re = /^:[^ ]+ +/,
    command_re = /^([^ ]+) */,
    data_re = /^[^ ]+ +/,
    args_re = /^:|\s+:/,
    argsm_re = /(.*?)(?:^:|\s+:)(.*)/,
    args_split_re = / +/,
    NUMERICS = irc.Numerics;
util.parseIRCData = function(line/*, stripColors*/) {
    var message = {
        'raw': line,
        'prefix': '',
        'commandType': 'normal'
    };
    var match;

    /*if (stripColors) {
        line = line.replace(/[\x02\x1f\x16\x0f]|\x03\d{0,2}(?:,\d{0,2})?/g, "");
    }*/

    // Parse prefix
    if (match = line.match(hasprefix_re)) {
        message.prefix = match[1];
        line = line.replace(colonrem_re, '');
        if (match = message.prefix.match(prefix_re)) {
            message.nick = match[1];
            message.user = match[3];
            message.host = match[4];
        } else {
            message.server = message.prefix;
        }
    }

    // Parse command
    match = line.match(command_re);
    message.command = match[1].toUpperCase();
    message.rawCommand = match[1];
    line = line.replace(data_re, '');

    if (NUMERICS[message.rawCommand]) {
        message.command = NUMERICS[message.rawCommand].name;
        message.commandType = NUMERICS[message.rawCommand].type;
    }

    message.args = [];
    var middle, trailing;

    // Parse parameters
    if (line.search(args_re) != -1) {
        match = line.match(argsm_re);
        middle = match[1].trimRight();
        trailing = match[2];
    } else {
        middle = line;
    }

    if (middle.length) message.args = middle.split(args_split_re);

    if (!_.isUndefined(trailing) && trailing.length) message.args.push(trailing);

    return message;
};
util.processTwistedData = function(data) {
    var message = {
        commandType: 'normal',
        rawCommand: data[1],
        command: data[1],
        args: data[3],
        prefix: data[2]
    },
    match;
    if(NUMERICS[data[1]]) {
        message.command = NUMERICS[data[1]].name;
        message.commandType = NUMERICS[data[1]].type
    }
    if (match = message.prefix.match(prefix_re)) {
        message.nick = match[1];
        message.user = match[3];
        message.host = match[4];
    } else {
        message.server = message.prefix;
    }
    return message;
}
})();

util.formatCommand = function(cmdline) {
    if (cmdline.startsWith("/")) {
        cmdline = cmdline.startsWith("//") ? "SAY /" + cmdline.slice(2) : cmdline.slice(1); //qweb issue #349
    } else {
        cmdline = "SAY " + cmdline; //default just say the msg
    }
    return cmdline.splitMax(" ", 2); //split command from the params
};
util.nickChanComparitor = function(client, nickHash) {
    var _prefixes = client.prefixes,
        _prefixNone = _prefixes.length,
        prefixWeight = function(pre) {
            return pre.length !== 0 ? _prefixes.indexOf(pre) : _prefixNone;
        },
        toLower = client.toIRCLower;
    //compares two nick names by channel status > lexigraphy
    return function(nick1, nick2) {
        var p1weight = prefixWeight(nickHash[nick1].prefixes),
            p2weight = prefixWeight(nickHash[nick2].prefixes);
        return (p1weight !== p2weight) ? (p1weight - p2weight) : toLower(nick1).localeCompare(toLower(nick2));
    };
};

util.validPrefix = _.contains;

util.addPrefix = function(nc, pref, prefs) {
    if (prefs && !util.validPrefix(prefs, pref)) return nc.prefixes;
    return nc.prefixes = concatUnique(nc.prefixes, pref).join("");
};

util.removePrefix = function(nc, pref) {
    return nc.prefixes = nc.prefixes.replaceAll(pref, "");
};

//get prefixs on a nick
util.prefixOnNick = _.autoCurry(function(prefixes, nick) {
    for (var i = 0; i < nick.length; i++) {
        if(!util.validPrefix(prefixes, nick.charAt(i))) break;
    }
    return [nick.slice(0, i), nick.slice(i)];
});

util.getPrefix = _.compose(_.first, util.prefixOnNick);

util.stripPrefix = _.compose(_.lambda('x[1]'), util.prefixOnNick);

util.createWordRegex = function(word) {
    return new RegExp('\\b' + String.escapeRegExp(word) + '\\b', "i");//=> /\bmegawac\b/i
};

util.testForNick = _.autoCurry(function(nick, text) {
    return util.createWordRegex(nick).test(text);
});

util.toHSBColour = function(nick, client) {
    var lower = client.toIRCLower(util.stripPrefix(client.prefixes, nick));
    if (lower == client.lowerNickname) return null;

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
    return _.findWhere(irc.styles, {
        name: name
    });
};

util.getStyleByKey = function(key) {
    return _.findWhere(irc.styles, {
        key: _.toInt(key)
    });
};

util.getColourByName = function(name) {
    return _.findWhere(irc.colours, {
        name: name
    });
};

util.getColourByKey = function(key) {
    return _.findWhere(irc.colours, {
        key: _.toInt(key)
    });
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
//http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
util.randHexString = function(numBytes) {
    var id = "";
    for (; numBytes > 0; numBytes--) {
        id += (((1 + Math.random()) * 0x100) | 0).toString(16).slice(1);
    }
    return id;
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

util.noop = function() {};

Browser.isMobile = !(Browser.Platform.win || Browser.Platform.mac || Browser.Platform.linux);

Browser.isDecent = !Browser.isMobile || !(!Browser.ie || Browser.version < 9);

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
        MESSAGE: 4
    };

    var message = function(msg, type) {
        return {
            message: msg,
            type: type
        };
    };

    //language specific stuff. right now just an object
    // can either be a message or array of messages
    _.extend(lang, {
        TYPES: types,
        message: message,

        loginMessages: [message("Hint #1! When you close a channel this one will be deleted from your favorites and won't come back on the next connection.", types.INFO),
                        message("Hint #2! To join a new channel type this command in the chat box: /j #channel", types.INFO)],
        joinAfterAuth: message("Waiting for login before joining channels...", types.INFO),
        authFailed: [message("Could not auth with IRC network - waited 5 seconds.", types.ERROR),
                    message("Otherwise reattempt authing by sending: \"/AUTH <your username> <your password>\"", types.ERROR),
                    message("To ignore the error and join channels, unauthed, type: \"/autojoin\".", types.ERROR)],
        signOn: message("SIGNON", types.SERVER),
        joinChans: message("Joining channels...", types.INFO),
        noTopic: "(No topic set.)",

        changeTopicNeedsOp: "Sorry, you need to be a channel operator to change the topic!",
        changeTopicConfirm: "Change topic of {channel} to:",

        poorJoinFormat: message("Channel names begin with # (corrected automatically).", types.INFO),
        waitToJoin: message("You recently tried to join {channel}. To prevent join-flooding, please wait {time} seconds before reattempting or type /fjoin {channel} to ignore this warning...", types.ERROR),
        invalidCommand: message("Can't use this command in this window", types.ERROR),
        invalidChanTarget: message("Can't target a channel with this command.", types.ERROR),
        insufficentArgs: message("Insufficient arguments for command.", types.ERROR),

        loadingPage: "Loading . . .",
        fishSlap: "slaps {nick} with a large fishbot",

        copyright: [message("qwebirc v" + qwebirc.VERSION, types.INFO),
                    message("Copyright (C) 2008-2011 Chris Porter and the qwebirc project.", types.INFO),
                    message("Current version by Emanuel \"megawac\" Jackstare", types.INFO),
                    message("http://www.qwebirc.org", types.INFO),
                    message("Licensed under the GNU General Public License, Version 2.", types.INFO)],

        alertNotice: "Alert!",
        activityNotice: "Activity!",
        partChan: "Part",
        logOut: message("Logged out", types.MESSAGE),
        quit: "Page closed",
        disconnected: message("Client has been disconnected", types.INFO),

        uncontrolledFlood: message("ERROR: uncontrolled flood detected -- disconnected.", types.ERROR),
        connError: message("An error occured: {1}", types.ERROR),
        // connRetry: message("Connection lost: retrying in {next} secs", types.ERROR),
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
        SHOW_NICKLIST: "Show nickname list in channels",
        SHOW_TIMESTAMPS: "Show timestamps",
        FONT_SIZE: "Set font size",
        VOLUME: "Volume",


        AUTO_OPEN_PM: "Automatically select window on private message:",
        FLASH: "flash",
        BEEP: "beep",
        PM: "pm",
        MENTION: "mentioned",
        MESSAGE_PLACEHOLDER: ' something ... ',
        NICK_PLACEHOLDER: ' someone ... ',
        TYPE_PLACEHOLDER: 'type test',
        DELETE_NOTICE: 'remove',
        ADD_NOTICE: 'Add notifier',
        USER_NOTICE: 'User:',
        TYPE_NOTICE: 'Type:',
        MESSAGE_NOTICE: 'Message:',
        AUTOESCAPE: 'Escape text',
        MENTIONED: 'Mentioned',
        ESCAPE_HINT: 'This text is transformed into a regular expressions - autoescaping will check for the exact text you entered',
        DESKTOP_NOTICES: 'Allow us to send desktop notifications if supported (on any notice with flash):',
        IGNORE_CASE: 'Case insensitive',
        NOTUS: "Not us",
        NOTUS_HINT: "Not our message",
        HIGHLIGHT: "hl",
        HIGHLIGHT_HINT: "highlight",

        ENABLE: 'Enable',
        DISABLE: 'Disable'
    });

})();

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
var Storer = util.Storer = new Class({
    initialize: function(name, storer) {
        this.name = name;
        this.storage = storer || storage;
    },
    get: function() {
        return this.storage.get(this.name);
    },
    set: function(val) {
        return this.storage.set(this.name, val);
    },
    dispose: function() {
        return this.storage.remove(this.name);
    }
});
ui.Behaviour = (function() {
    var behaviour = new Behavior();
    var delegator = new Delegator({
        getBehavior: function(){ return behaviour; }
    });
    return {
        apply: function($ele) {
            behaviour.apply($ele);
            delegator.attach($ele);
        }
    };
})();
  
var getTemplate = util.getTemplate = function(name, cb, options) {
    /*
        Loads a template. If its already on page call callback immediately otherwise load asyncronously
        Note: Should use deferred if available
        Still need to finish implementing this.
    */
    if(!_.isFunction(cb)) {
        cb = util.noop;
    }
    if(_.isFunction(name)) {
        cb(name);//assume identity
    }
    else if(_.has(templates, name)) {
        cb(_.lookup(templates, name));
    }
    else {
        var path = options && options.path || "js/templates/",
            file = options && options.file || name,
            type = options && options.type || ".js",
            $script;
        if(!path.endsWith("/")) path += "/";
        if(!type.startsWith(".")) type = "." + type;
        $script = Asset.javascript(path + file + type, {onLoad: function() {
            cb(_.lookup(templates, name));
            $script.dispose();
        }});
        //$script.addEvent("error", ..now what?)
    }
    //return deferred
};
  
util.loadTemplate = function(name) {//helper to preload a template
    var template;
    getTemplate(name, function(tmpl) {template = tmpl});
    return function() {return template.apply(this, arguments);};
}
  
ui.setTitle = function(title, options) {
    document.title = title;
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
  
ui.decorateDropdown = function($btn, $ddm, options) {
    options = options || {};
    var evts = {
        "click": hideMenu,
        "keypress": hideMenu
    };
    function hideMenu() {
        if(options.onHide)
            options.onHide.call(this, $ddm);
        document.removeEvents(evts);
        return $ddm.hide();
    }
    function toggleMenu(state) {
        if(options.onShow)
            options.onShow.call(this, $ddm);
  
        if (state===true || !$ddm.isDisplayed()) {
            $ddm.show();
            document.addEvents(evts);
        } else {
           hideMenu();
        }
        return $ddm;
    }
  
    $ddm.store("toggle", toggleMenu)
        .position.delay(50, $ddm, {
            relativeTo: $btn,
            position: {x: 'left', y: 'bottom'},
            edge: {x: 'left', y: 'top'}
        });
  
    if($ddm.isDisplayed()) document.addEvents(evts);
  
    if(options.btnlistener) {
        $btn.addEvent("click", function(e) {
            e.stop();
            toggleMenu();
        });
    }
    return options.autohide ? hideMenu() : $ddm;
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
  
            $ele.getSiblings()
                .each(function(sib) {
                    offset += sib.getSize()[method];
                });
  
            util.calc($ele, style, "100% - " + offset + "px");
        });
    }
  
    _.delay(filler, 20);
    return $ele;
};


// //http://caniuse.com/calc
// Browser.Features.calc = !!((Browser.ie && Browser.version >= 9) ||
//                             (Browser.firefox && Browser.version >= 4) ||
//                             (Browser.chrome && Browser.version >= 19) ||
//                             (Browser.opera && Browser.version >= 15) ||
//                             (Browser.safari && Browser.version > 6));
document.addEvent("domready", function() {//based off https://gist.github.com/Rob-ot/3399053
    Browser.Features.calc = false;//union bool str (-webkit-calc, -moz-calc, calc)
    ["","-webkit-","-moz-","-o-"].some(function(prefix) {
        try {
            var $el = new Element('div', {
                styles: {
                    width: prefix + "calc(5px)"
                }
            });
            if ($el.style.length > 0) return Browser.Features.calc = prefix + "calc";
        } catch(nope){}
    });
});

util.percentToPixel= function(data, par) {
    par = par || $(document.body);
    var size = par.getSize();
    return {
        x: size.x * (data.x * 0.01),
        y: size.y * (data.y * 0.01)
    };
};

//https://gist.github.com/megawac/6525074
//http://www.w3schools.com/cssref/css_units.asp
util.calc = function($ele, style, val) {
    // val = val.replace(/(\(|\))/g, "");
	//simple css calc function polyfill
	//polyfill expects surrounded by brackets <val><unit> <operator> <val><unit> => "33% - 20px + 1em"
    //does not support things like "50%/3 - 5px"
	if(Browser.Features.calc) {
		$ele.setStyle(style, Browser.Features.calc + "(" + val + ")");
	} else {
        var old = $ele.retrieve("calc");
        if(old) {window.removeEvent("resize", old);}
		var split = val.split(" ");
		var op = split.splice(1,1);
        var resize = function() {
            var expr = val.replace(/(\d+)(\S+)/g, function(match, size, unit) {
                size = size.toFloat();
                switch (unit) {//unit
                case "%":
                    var data = {};
                    var dir = style.contains("width") ? "x" : "y";
                    data[dir] = size;
                    return util.percentToPixel(data, $ele.getParent())[dir].round(3);
                case "em":
                    var fsize = $ele.getStyle("font-size").toFloat();
                    return fsize * size;
                // case "px":
                default:
                    return size;
                }
            });
            var size = eval(expr);//safe usage - evals '500-20+12' for example
            $ele.setStyle(style, size);
            return resize;
        };
        window.addEvent("resize", resize);
        $ele.store("calc", resize);
        return resize();
	}
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
// var channame_re = /(#|>|&gt;)[\s\S]*(?=\/)/,
//     chan_re = /#|\/|\\/;

urlifier.leading_punctuation.include(/^([\x00-\x02]|\x016|\x1F)/).include(/^(\x03+(\d{1,2})(?:,\d{1,2})?)/);
urlifier.trailing_punctuation.include(/([\x00-\x03]|\x016|\x1F)$/);

urlifier.addPattern(/qwebirc:\/\/(.*)/, function(word) {
            //given "qwebirc://whois/rushey#tf2mix/"
            if(word.contains("qwebirc://")) {
                var parsed = this.parsePunctuation(word),
                    mid = parsed.mid;

                if(mid.startsWith("qwebirc://") && mid.endsWith("/") && mid.length > 11) {
                    var cmd = mid.slice(10);//remove qwebirc://
                    /*if(cmd.startsWith("whois/")) {
                        var chan_match = cmd.match(channame_re); //matches the chan or user to the dash
                        var chan = chan_match ? chan_match[0] : "";
                        var chanlen = chan_match ? chan_match.index : cmd.length - 1; //chan length or the len -1 to atleast remove the dash
                        var user = cmd.slice(6, chanlen);//whois to channel
                        cmd = templates.userlink({'userid': user, 'username': user + chan});
                    }
                    else */if(["options", "embedded", "privacy"].some(cmd.startsWith.bind(cmd))) {
                        cmd = templates.customlink({
                            val: cmd.match(/\w+\w/),
                            internal: true
                        });
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

            if(util.isChannel(res)) {
                res = templates.customlink({
                    val: res,
                    internal: true
                });
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
    }, true);

})();


(function(engine) {

    //where to store these things
    var source = {},
        compiled = qwebirc.templates || {};

    source.messageLine = "<hr class='lastpos' />";
    // source.ircMessage = "<div class='{{styles}}'></div>";


    //portions:
    source.topPane = "<div class='toppanel outertabbar'></div>";
    // source.detachedPane = "<div class='detached'></div>";
    source.windowsPane = "<div class='windows'></div>";
    // source.windowPane = "<div class='window qui hidden'></div>";
    // source.topicPane = "<div class='qui topic'></div>";
    // source.contentPane = "<div class='qui content'></div>";
    // source.leftPane = "<div class='qui leftpanel lines'></div>";
    // source.nickPane = "<div class='qui rightpanel'></div>";
    // source.propertiesPane = "<div class='qui properties'></div>";
    // source.inputPane = "<div class='qui bottompanel'></div>";

    // source.detachedWindow = [
    // "<div class='detached-window'>",
    //     "<div class='header'>",
    //         "<span class='title'>{{channel}}</span>",
    //         "{{#unless base}}{{> tabClose}}{{/unless}}",//css bug
    //         "{{> tabAttach}}",
    //     "</div>",
    // "</div>"].join("");

    // source.resizeHandle = "<div><span class='resize-handle ui-icon ui-icon-grip-diagonal-se'></span></div>";

    // source.nickMenu = "<div class='menu'></div>";
    // source.menubtn = "<div class='dropdown-tab'><img src='{{icon}}' title='menu' alt='menu'></div>";
    // source.menudrop = "<div class='main-menu dropdownmenu'></div>";
    // source.chanmenu = "<div class='chanmenu dropdownmenu'>{{#each channels}}{{> menuitem}}{{/each}}</div>";
    // source.menuitem = "<a{{#if value}} data-value='{{value}}'{{/if}}><span>{{text}}</span>{{#if hint}}<span class='hint'>{{hint}}</span>{{/if}}</a>";
    source.dropdownhint = "<div class='dropdownhint'>Click the icon for the main menu.</div>";

    source.tabbar = "<div class='tabbar'></div>";
    // source.tabbarbtns = [
    // "<div class='buttons'>",
    //     "<span class='ui-icon ui-icon-circle-triangle-w to-left hidden' name='tabscroll'></span>",
    //     "<span class='ui-icon ui-icon-circle-triangle-e to-right hidden' name='tabscroll'></span>",
    //     "<span class='add-chan ui-icon ui-icon-circle-plus' title='Join a channel'></span>",
    // "</div>"].join("");
    // source.ircTab = "<a href='#' class='tab'>{{{name}}} {{> tabDetach}}</a>";
    source.tabDetach = "<span class='detach ui-icon ui-icon-newwin' title='" + lang.detachWindow + "'></span>";
    source.tabAttach = "<span class='attach ui-icon ui-icon-circle-minus'></span>";
    source.tabClose = "<span class='tab-close ui-icon ui-icon-circle-close' title='" + lang.closeTab + "'></span>";

	source.loadingPage = "<div class='loading'>" + lang.loadingPage + "<img src='images/loading.gif' alt='url'></div>";


    source.verticalDivider = "<div class='ui-icon ui-icon-grip-solid-vertical handle vertical'></div>";
    source.horizontalDivider = "<div class='ui-icon ui-icon-grip-solid-horizontal handle horizontal'></div>";

    /************************
        HELPERS
    ***********************/
    engine.registerHelper('check', function(checked, s2){
        return checked ? 'checked' : '';
    });

    engine.registerHelper('enableDisable', function(x) {
        return x ? lang.DISABLE : lang.ENABLE;//if true shows disable
    });

    engine.registerHelper('$link', util.formatURL);

    //f(property name, type of prop, default val)
    engine.registerHelper('$css', function(prop, def, type, default2) {//this refers to context
        if(type === "c") {//colour
            var x = new Color(def);
            var c = x.setHue(this.style_hue).setSaturation(x.hsb[1] + this.style_saturation).setBrightness(x.hsb[2] + this.style_brightness);
            if (Browser.ie && c == "255,255,255") c = "255,255,254";// IE confuses white with transparent... 
            
            return "rgb(" + c + ")";
        } 
        else if(type === "comp") {
            return this[prop] ? def : default2;
        }
        else {
            return this[prop] || def;
        }
    });

    engine.registerHelper("format", function(prop) {
        return util.format(prop, this);
    });

    engine.registerHelper("lang", function(prop) {
        return lang[prop];
    });

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


//commands are substituted by util.formatter. Please make sure they are the correct command for your server
//eg : https://www.quakenet.org/help/q-commands
config.IRC_COMMANDS = { //maybe make these templates?
    "ACTION": {
        command: "PRIVMSG {target} :\x01ACTION {text}\x01"
    },
    "CTCP": {
        command: "PRIVMSG {target} :\x01{type} {text} \x01"
    },
    "PRIVMSG": {
        command: "PRIVMSG {target} :{message}"
    },
    "JOIN": {
        command: "JOIN {channel} {args}"
    },
    "NICK": {
        command: "NICK {nick}"
    },
    "PART": {
        command: "PART {channel} :{message}"
    },
    "QUIT": {
        command: "QUIT :{message}"
    },
    "TOPIC": {
        command: "TOPIC {channel} :{topic}"
    },
    "AWAY": {
        command: "AWAY :{message}"
    },
    "NOTICE": {
        command: "NOTICE {target} :{message}"
    },
    "MODE": {
        command: "MODE {target} {mode} {args}"
    },
    "AUTH": {
        command: "AUTHSERV AUTH {username} {password}"
    },
    "KICK": {
        command: "KICK {channel} {kickee} :{message}"
    }
};

config.COMMAND_ALIAS = {
    "J": "JOIN",
    "P": "PART",
    "MESSAGE": "PRIVMSG",
    "M": "PRIVMSG",
    "MSG": "PRIVMSG",
    "PM": "PRIVMSG",
    "Q": "QUERY",
    "BACK": "AWAY",
    "PRIVACY": "PRIVACYPOLICY",
    "HOP": "CYCLE",
    "SLAP": "ME"
};

ui["default options"] = {
    "auto_open_pm": false,
    "nick_ov_status": true,
    "accept_service_invites": true,
    "use_hiddenhost": true,
    "lastpos_line": true,
    "nick_colours": false,
    "hide_joinparts": false,
    "show_nicklist": !Browser.isMobile,
    "show_timestamps": true,
    "font_size": 12,
    "volume": 100, //0-100

    "completer": {
        "intrusive": Browser.isDecent,
        "store": !Browser.isMobile
    },

    "dn_state": false,
    "dn_duration": 4000,

    "highlight": true,
    "highlight_mentioned": true,

    "style_hue": 210,
    "style_saturation": 0,
    "style_brightness": 0,

    "standard_notices": [
        {
            type: "^(?!SERVER)+NOTICE+$",//notice not server notice
            classes: '',
            beep: true,
            tabhl: ui.HIGHLIGHT.speech,
            id: 'notice'
        },
        {
            type: "PRIVMSG$",
            flash: true,
            beep: true,
            pm: true,
            tabhl: ui.HIGHLIGHT.speech,
            id: 'pm'
        },
        {
            type: "^OUR",
            classes: 'our-msg',
            id: 'ourmsg'
        },
        {//match bots
            nick: "(^tf2)|((serv|bot)$)",
            classes: 'bot',
            types: [ui.WINDOW.channel],
            "case": true,
            id: 'bot'
        },
        {
            msg: "^\\!",
            classes: 'command',
            types: [ui.WINDOW.channel],
            id: 'cmd'
        },
        {
            mentioned: true,
            highlight: 'mentioned',
            notus: true,
            tabhl: ui.HIGHLIGHT.us,
            id: 'mention'
        },
        {
            nick: "^((?!(^tf2|bot$|serv$)).)*$",
            mentioned: true,
            classes: '',
            beep: true,
            pm: true,
            notus: true,
            "case": true,
            id: 'onmention'
        },
        {
            nick: "^((?!(^tf2|bot$|serv$)).)*$",
            msg: "^((?!(^\\!)).)*$", //dont hl commands
            classes: '',
            highlight: true,
            notus: true,
            "case": true,
            tabhl: ui.HIGHLIGHT.activity,
            types: [ui.WINDOW.channel],
            id: 'hl'
        }
    ],

    "custom_notices": []
}

config.OptionModel = new Class({
    Extends: Epitome.Model.Storage,
    options: {
        defaults: ui["default options"],
        key: cookies.options,
        minimize: true
    },

    defaultNotice: function() {//default custom notice
        return {
                // nick: '',
                // msg: '',
                // type: '',
                // flash: false,
                // beep: false,
                // pm: false,
                id: String.uniqueID(),
                autoescape: true,
                description: ''
            };
    },

    notice_filter: function(data) {
        return !(!data.msg || data.msg.trim() === "") || !(!data.nick || data.nick.trim() === "") || !(!data.type || data.type.trim() === "") || data.notus;
    },

    //storing procedures
    save: function() {
        this.set("custom_notices", _.filter(this.get("custom_notices"), this.notice_filter));//cleanup
        this.set("standard_notices", _.filter(this.get("standard_notices"), this.notice_filter));//cleanup
        return this.parent();
    },


    set: function(key, data) {
        var props = key.split(".");
        if(props.length > 1) {
            var item = this.get(props[0]);
            return this.parent(props[0], _.assign(item, key, data));
        } else {
            this.parent(key, data);
        }
    }.overloadSetter()
});


config.Settings = new Class({
    Extends: Epitome.Model.Storage,
    options: {
        defaults: {
            "channels": "",
            "nickname": "",
            "username": "",
            "password": "",
            "auth": false,
            "newb": true
        },
        key: cookies.settings,
        minimize: false,

        onReady: function() {
            this.loaded = true;
        }
    },

    set: function(key, data) {
        this.parent(key, data);
        if(this.loaded) {//set is called when initing if we save we will lose state
            this.save();
        }
        return this;
    },

    unset: function(key, data) {
        this.parent(key);
        return this.save();
    }
});


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
        key: 8
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

config.ThemeControlCodeMap = { //these are settings for the templates -ie {C} is replaced by irc.styles.colour.key
    "C": irc.styles.colour.key,
    "B": util.getStyleByName('bold').key,
    "U": util.getStyleByName('underline').key,
    "O": irc.styles.colour.key,
    "D": Browser.ie ? "" : irc.styles.normal.key, //address ie bug where /x00 is null character
    //little clever here
    "NN": templates.userlink({'nick':'{N}'}),//nick name
    "CN": templates.userlink({'nick':'{newnick}'}),// change nick
    "P": "{C}4=={O} "
};

config.ThemeIRCTemplates = {
    "SIGNON": "{P}Signed on!",
    "CONNECT": "{P}Connected to server - establishing IRC connection.",

    "INFO": "{m}",
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
    "KICK": "{P}{D}{kickee}{D} was kicked from {c} by {D}{kicker}{D} [{m}]",
    "MODE": "{P}mode/{c} gives [{m}] to {D}{N}{D}",
    "QUIT": "{P}{D}{N}{D} [{h}] has quit [{m}]",
    "NICK": "{P}{D}{n}{D} has changed nick to {CN}",
    "TOPIC": "{P}{D}{N}{D} changed the topic of {c} to: {m}",
    "UMODE": "Usermode change: {m}",
    "INVITE": "{N} invites you to join {c}",

    "HILIGHT": "{C}4",
    "HILIGHTEND": "{O}",

    "CHANMSG": "{D}{nicktmpl}{)}{D} {m}",
    "PRIVMSG": "{(}{nicktmpl}{)} {m}",

    "OURCHANMSG": "{nicktmpl} {m}",
    "OURPRIVMSG": "{nicktmpl} {m}",
    "OURTARGETEDMSG": "*{[}{t}{]}* {m}",
    "OURCHANACTION": " * {N} {m}",
    "OURPRIVACTION": " * {N} {m}",

    "CHANACTION": " * {D}{(}{N}{)}{D} {m}",
    "PRIVACTION": " * {(}{N}{)} {m}",
    "CHANCTCP": "{N} [{h}] requested CTCP {data} from {c}: {m}",
    "PRIVCTCP": "{N} [{h}] requested CTCP {data} from {-}: {m}",
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
    "WHOISEND": "{P}End of whois {N}",

    "AWAY": "{P}{N} is away: {m}",
    "GENERICERROR": "{P}{m}: {t}",
    "GENERICMESSAGE": "{P}{m}",
    "WALLOPS": "{P}WALLOP {n}: {t}",
    "CHANNELCREATIONTIME": "{P}Channel {c} was created at: {m}",
    "CHANNELMODEIS": "{P}Channel modes on {c} are: {m}"
};
(function() {
    var cmd = config.IRC_COMMANDS;
    var format = function(command, data) {
        return util.format(command.command, data);
    };

irc.Commands = new Class({//sort of an abstract class but relies on irc.IRCClient so not really
    // Binds: ["exec"],

    __autojoined: false,

    // routes all outputs with the server
    // this method will call functions in: Commands based on the this scope
    exec: function(line, chan) {
        var self = this,
            allargs = util.formatCommand(line);

        //is it clearer to use a do-while? - anyway allargs var will change each loop
        for (var command, args, cmdopts, activewin, splitargs, minargs, fn, win, target; $defined(allargs); ) {
            command = allargs[0].toUpperCase();
            command = config.COMMAND_ALIAS[command] || command;
            args = allargs[1];
            target = chan;

            cmdopts = self["cmd_" + command];//comand handler

            if (!cmdopts) {
                self.send(command + util.padspace(args));
                break;
            }

            //props from on of the command arrays
            // activewin = cmdopts[0];
            // splitargs = cmdopts[1];
            // minargs = cmdopts[2];
            // fn = cmdopts[3];

           /* //errors in command
            win = chan ? self.windows[chan] : self.getActiveWindow();
            if (activewin && win && !util.isChannelType(win.type)) { //win.type !== ui.WINDOW_CHANNEL) && (win.type !== ui.WINDOW_QUERY) 
                self.writeMessages(lang.invalidCommand);
                break;
            }
            else */if (cmdopts.minargs && cmdopts.minargs > _.size(args)) {
                self.writeMessages(lang.insufficentArgs, {}, {
                    channel: chan
                });
                break;
            }
            if (_.isNumber(cmdopts.splitargs) && _.isString(args)) {
                args = args.splitMax(" ", cmdopts.splitargs);
                if(cmdopts.target/* && util.isChannel(args[0])*/) {
                    target = args.shift();//so you can avoid checks for correct syntax
                }
            }

            allargs = cmdopts.fn.call(self, args, target);
        }
    },


    automode: function(modes, mode, args, channel) {
        args.length.times(function() {
            modes += mode;
        });
        this.send(format(cmd.MODE, {
            target: channel,
            mode: modes,
            args: args.join(" ")
        }));
    },

    /*****************commands ****************/

    /* [require_active_window, splitintoXargs, minargs, function] */
    cmd_ME: {
        fn: function(args, target) {
            args = args || "";

            var msg = format(cmd.ACTION, {
                target: target,
                text: args
            });

            if (this.send(msg)) {
                var nick = this.nickname;
                this.trigger("privAction", {
                    'nick': nick,
                    'message': args,
                    'target': target,
                    'channel': target,
                    "prefix": this.getNickStatus(target, nick)
                });
            }

        }
    },

    cmd_CTCP: {
        target: true,
        splitargs: 3,
        minargs: 2,
        fn: function(args, target) {
            var type = args[0].toUpperCase(),
                message = args[1] || "";

            var msg = format(cmd.CTCP, {
                target: target,
                type: type,
                text: message
            });

            if (this.send(msg)) {
                this.trigger("privCTCP", {
                    'nick': this.nickname,
                    '_type': type,
                    'message': message,
                    'args': args,
                    'type': 'CTCPReply'
                });
            }
        }
    },

    cmd_SAY: {
        minargs: 1,
        fn: function(args, target) { //direct
            return ["PRIVMSG", target + " " + args || ""];//purpose is different split args
        }
    },

    cmd_PRIVMSG: {
        target: true,
        splitargs: 2,
        minargs: 1,
        fn: function(args, target) {
            var message = args[0];
            var nick = this.nickname;
            var msg = format(cmd.PRIVMSG, {
                target: target,
                message: message
            });

            if (util.isChannel(target)) {
                if (this.send(msg)) {
                    this.trigger("chanMessage", {
                        'nick': nick,
                        'channel': target,
                        'message': message,
                        'type': 'chanmsg',
                        "prefix": this.getNickStatus(target, nick)
                    });
                }
            } else {
                return ["QUERY", target + " " + message];
            }
        }
    },

    cmd_NOTICE: {
        target: true,
        splitargs: 2,
        minargs: 1,
        fn: function(args, target) {
            var message = args[0];
            var msg = format(cmd.NOTICE, {
                target: target,
                message: message
            });
            var noticeType = util.isChannel(target) ? "chanNotice" : "privNotice";

            if (this.send(msg)) {
                this.trigger(noticeType, {
                    'nick': this.nickname,
                    'channel': target,
                    'target': target,
                    'message': message
                });
            }
        }
    },

    cmd_QUERY: {
        target: true,
        splitargs: 2,
        minargs: 1,
        fn: function(args, target) {
            var message = args[0];
            if (util.isChannel(target)) {
                return this.writeMessages(lang.invalidChanTarget);
            }
            if(_.size(message) > 1) {
                var msg = format(cmd.PRIVMSG, {
                    target: target,
                    message: message
                });
                this.send(msg);
            }

            this.trigger("query", {
                'nick': this.nickname,
                'channel': target,
                'message': message,
                'type': 'privmsg'/*,
                'open': true*/
            });
        }
    },

    // cmd_OPTIONS: {
    //     fn: function(args) {
    //         this.trigger("openWindow", {
    //             'window': "optionsWindow",
    //             'type': ui.WINDOW.custom
    //         });
    //     }
    // },

    // cmd_EMBED: {
    //     fn: function(args) {
    //         this.trigger("openWindow", {
    //             'window': "embeddedWindow",
    //             'type': ui.WINDOW.custom
    //         });
    //     }
    // },

    // cmd_PRIVACYPOLICY: {
    //     fn: function(args) {
    //         this.trigger("openWindow", {
    //             'window': "privacyWindow",
    //             'type': ui.WINDOW.custom
    //         });
    //     }
    // },

    // cmd_ABOUT: {
    //     fn: function(args) {
    //         this.trigger("openWindow", {
    //             'window': "aboutWindow",
    //             'type': ui.WINDOW.custom
    //         });
    //     }
    // },

    cmd_QUOTE: {
        minargs: 1,
        fn: function(args) {
            this.send(args);
        }
    },

    cmd_KICK: {
        target: true,
        splitargs: 3,
        minargs: 1,
        fn: function(args, target) {
            this.send(format(cmd.KICK, {
                channel: target,
                kickee: args[0],
                message: args[1] || ""
            }));
        }
    },

    cmd_OP: {
        target: true,
        splitargs: 6,
        minargs: 1, 
        fn: function(args, target) {
            this.automode("+", "o", args, target);
        }
    },
    cmd_DEOP: {
        target: true,
        splitargs: 6,
        minargs: 1,
        fn: function(args, target) {
            this.automode("-", "o", args, target);
        }
    },
    cmd_AUTH: {//must be configured per server in config.irc_commands
        splitargs: 2,
        minargs: 2,
        fn: function(args) {
            var msg = format(cmd.AUTH, {
                username: args[0],
                password: args[1]
            });
            this.send(msg);
        }
    },
    cmd_VOICE: {
        target: true,
        splitargs: 6,
        minargs: 1,
        fn: function(args, target) {
            this.automode("+", "v", args, target);
        }
    },
    cmd_DEVOICE: {
        target: true,
        splitargs: 6,
        minargs: 1,
        fn: function(args, target) {
            this.automode("-", "v", args, target);
        }
    },
    cmd_TOPIC: {
        target: true,
        splitargs: 2,
        minargs: 1,
        fn: function(args, channel) {
            var msg = format(cmd.TOPIC, {
                channel: channel,
                topic: args[0]
            });
            this.send(msg);
        }
    },
    cmd_AWAY: {
        splitargs: 1,
        minargs: 0,
        fn: function(args) {
            var msg = format(cmd.AWAY, {
                message: args[0] || ""
            })
            this.send(msg);
        }
    },
    cmd_QUIT: {
        splitargs: 1,
        minargs: 0,
        fn: function(args) {
            this.quit(args[0] || "", true);
        }
    },
    // cmd_CYCLE: {
    //     splitargs: 1,
    //     minargs: 0,
    //     fn: function(args, channel) {
    //         channel = channel;

    //         this.send("PART " + channel + " :" + (args ? args[0] : "rejoining. . ."));
    //         this.send("JOIN " + channel);
    //     }
    // },
    cmd_FJOIN: {
        splitargs: 1,
        minargs: 1,
        fn: function(args) {
            if(_.isEmpty(args)) return;
            var channels = Array.from(args).flatten(),
                formatted = util.formatChannelString(channels);

            if (!_.isEqual(channels, util.splitChans(formatted) )) {
                this.writeMessages(lang.poorJoinFormat);
            }
            if(formatted) {
                this.send(format(cmd.JOIN, {
                    channel: formatted/*,
                    args : args.join(" ")*/
                }));
            }
        }
    },
    cmd_JOIN: {
        splitargs: 1,
        minargs: 1,
        fn: function(args) {//accepts string or array
            var channels = Array.from(args).map(util.splitChans).flatten().filter(this.canJoinChannel, this);
            this.cmd_FJOIN.fn.call(this, channels);//join channels into a single comma sep string then join
        }
    },
    cmd_PART: {
        target: true,
        splitargs: 2,
        minargs: 0,
        fn: function(args, channel) {
            this.storeChannels(util.removeChannel(this.channels, channel));
            this.send(format(cmd.PART, {
                channel: args[0] || channel,
                message: args[1] || lang.partChan
            }));
        }
    },
    cmd_UMODE: {
        splitargs: 1,
        minargs: 0,
        fn: function(args) {
            this.send(format(cmd.MODE, {
                target: this.nickname,
                mode: args[0] || ""
            }));
        }
    },
    cmd_AUTOJOIN: {
        fn: function(args) {
            if(!this.__autojoined) {
                this.__autojoined = true;
                this.currentChannel = BROUHAHA;
                return ["JOIN", this.getChannels()];
            }
        }
    }
});

irc.CommandHistory = new Class({
    Extends: Epitome.Model.Storage,
    Implements: [Options],
    options: {
        lines: 20,
        minlen: 2,
        storage: {
            fallback: false//dont save on shit browsers
        },
        store: !Browser.isMobile,
        key: cookies.history
    },

    addLine: function(name, line) {
        var data = this.get(name).erase(line);
        if(line.length > this.options.minlen) {
            data.unshift(line);
            if (data.length > this.options.lines) {
                data.pop();
            }
            this.set(name, data);
            this.save();
        }
    },

    addChannel: function(name) {
        if(!this.get(name)) this.set(name, []);
    },

    removeChannel: function(name) {
        this.unset(name);
        if(this.options.store) this.save();
    },

    _filter: _.not(_.isEmpty)
});


irc.NodeConnection = new Class({
    Implements: [Options, Events],
    Binds: ["_recv", "_error"],
    options: {
        socket_connect: document.location.hostname,
        nickname: '',
        password: '',
        serverPassword: null,
        autoConnect: true,
        debug: true,
        floodProtection: false,
        /*server: xxx,
        nick: nick,
        password: null,
        userName: 'nodebot',
        realName: 'nodeJS IRC client',
        port: 6667,
        debug: false,
        showErrors: false,
        autoRejoin: true,
        autoConnect: true,
        channels: [],
        retryCount: null,
        retryDelay: 2000,
        secure: false,
        selfSigned: false,
        certExpired: false,
        floodProtection: false,
        floodProtectionDelay: 1000,
        stripColors: false,
        channelPrefixes: "&#",
        messageSplit: 512*/
        autoretry: true,
        retryInterval: 5000,
        // retryAttempts: 30,//retry for 60 seconds

        clientID: util.randHexString(16)
    },
    connected: false,

    initialize: function(options) {
        var self = this;
        options = self.setOptions(options).options;

        var socket = self.socket = io.connect(options.socket_connect, {
          'reconnect': options.autoretry,
          'reconnection delay': options.retryInterval,
          'max reconnection attempts': options.retryAttempts
        });

        var $evts = {
            "raw": self._recv,

            "connected": function() {
                self.connected = true;
                self.attempts = 0;
                self.fireEvent("connected");
                // this.__retry = this.options.retryInterval;
            },
            "disconnect": function() {
                self.connected = false;
            },
            "reconnect": function() {
                console.log("reconnected");
                self.socket.emit("reconnect", options);
            },
            "reconnecting": function() {
                console.log("reattempt");
                self.fireEvent("retry", {
                    next: options.retryInterval
                });
            },

            "lostConnection": function() {
                self.fireEvent("lostConnection", self.attempts++);
                self.connected = false;
            },
            "abort": function() {
                new ui.Alert({
                    title: "Lost connection to IRC server",
                    text: "Server lost connection to the IRC server"
                });
                self.connected = false;
            },

            "max_connections": function() {
                new ui.Alert({
                    title: 'Maximum connections reached',
                    text: 'Maximum synchronous connections for this server have been reached. If we let you in we may crash/get g-lined. Try again later...',
                    onHide: function() {
                        location.reload();
                    }
                });
            },
            "echo": _.log,
            "error": self._error
        };

        _.each($evts, function(fn, key) {
            if(fn) {
                socket.on(key, fn);
            }
            else {
                socket.on(key, function() {//pass
                    self.fireEvent(key);
                });
            }
        });

        self.connect();
    },

    connect: function() {
        this.socket.emit("irc", this.options);
    },

    disconnect: function() {
        this.socket.emit("quit");
        this.socket.disconnect();
    },

    _recv: function(data) {
        var processed = util.parseIRCData(data.raw);
        this.fireEvent("recv", processed);
    },

    send: function(data) {
        if(this.connected) {
            this.socket.emit("send", data);
            return true;
        }
        else {
            console.error("disconnected dude");
        }
    },

    _error: function() {
        console.error(arguments);
        this.fireEvent("error", arguments);
    }/*,

    autoretry: function() {
        if(this.connected) {return;}
        var next = this.__retry *= this.options.retryScalar;
        this.fireEvent("retry", {
            next: next
        });
        this.socket.emit("retry", this.options);
        return _.delay(this.autoretry, next, this);
    }*/
});


auth.loggedin = false;
auth.enabled = false;

auth.passAuth = $lambda(true);
auth.bouncerAuth = $lambda(false);

// //ircclient with added event support
irc.IRCClient = new Class({
    Implements: [Options, Events, irc.Commands],
    Binds: ["lostConnection", "send", "quit", "connected",  "retry", "dispatch", "_tdispatch"],
    options: {
        minRejoinTime: [0],
        networkServices: [],
        loginRegex: /^$/ //always fail
    },
    lastNicks: [],
    inviteChanList: [],
    channels: [],
    activeTimers: {},
    prefixes: "@+",//heirarchy of prefixes - "@"(operator), "+"(voice) - will be overriden by server
    modeprefixes: "ov",
    __signedOn: false,
    authed: false,
    nextctcp: 0,
    pmodes: {
        b: irc.PMODE_LIST,
        l: irc.PMODE_SET_ONLY,
        k: irc.PMODE_SET_UNSET,
        o: irc.PMODE_SET_UNSET,
        v: irc.PMODE_SET_UNSET
    },
    toIRCLower: irc.RFC1459toIRCLower,//default text codec
    
    initialize: function(options) {
        var self = this;
        options = self.setOptions(options).options;

        self.nickname = options.nickname;
        self.lowerNickname = self.toIRCLower(self.nickname);

        if(options.node) {
            var conn = self.connection = new irc.NodeConnection({
                account: options.account,
                nickname: self.nickname,
                password: options.password,
                serverPassword: options.serverPassword
            });
            conn.addEvents({
                "recv": self.dispatch,
                "quit": self.quit,
                // "retry": self.retry,
                "connected": self.connected,
                "lostConnection": self.lostConnection
            });
        } else {
            self.connection = new irc.TwistedConnection({
                nickname: self.nickname,
                serverPassword: options.serverPassword,
            });
            self.connection.addEvents({
                "recv": self._tdispatch,
                // "retry": self.retry,
                "lostConnection": self.lostConnection
            });
        }

        // self.commandparser = new irc.Commands(self);
        // self.exec = self.commandparser.exec;
        self.tracker = new irc.IRCTracker(self);
    },

    //connection methods
    connect: function() {
        this.connection.connect();
        return this;
    },

    connected: function() {
        this.trigger("connect", {});
    },

    send: function(data) {
        return this.connection.send(data);
    },

    disconnect: function() {
        this.connection.disconnect();
        return this;
    },

    disconnected: function(message) {
        delete this.tracker;
        this.trigger("disconnect", {
            message: message
        });
    },

    quit: function(message, notify) {
        if(this.isConnected()) {
            this.send("QUIT :" + (message || lang.quit), false);//
            if(notify) {//time to go
                _.each(this.activeTimers, $clear);
                this.activeTimers = {};
                this.writeMessages(lang.disconnected, {}, {channels: "ALL"});
                this.disconnect();
                this.trigger("disconnect");
                this.__signedOn = false;
            }
        }
        return this;
    },

    lostConnection: function(attempt) {
        this.writeMessages(lang.connTimeOut, {
            retryAttempts: attempt
        }, {
            channels: "ALL"
        });
    },

    // retry: function(data) {
    //     this.trigger("retry", data);
    //     this.writeMessages(lang.connRetry, {
    //         next: (data.next/1000).round(1)
    //     }, {
    //         channels: "ALL"
    //     });
    // },
    /***********************************************
    *           General helpers                    *
    ************************************************/
    trigger: function(type, data) { //just a kind helper so i can get the type easily on the ui
        if(!data) data = {};
        data["-"] = this.nickname;
        return this.fireEvent(type, [type, data]);
    },

    isConnected: function() {
        return this.__signedOn && this.connection.connected;
    },

    isNetworkService: function(host) {//is host registered network service
        return this.options.networkServices.contains(host);
    },

    inChannel: function(name) {
        return this.channels.contains(name);
    },

    storeChannels: function(channels) {
        this.channels = channels = channels || this.channels;
        var store = util.removeChannel(channels, BROUHAHA);
        this.options.settings.set("channels", store);
        return this;
    },

    getChannels: function() {
        var chans = this.channels = util.prependChannel(this.options.settings.get("channels") || [], BROUHAHA);
        return chans;
    },

    nickOnChanHasPrefix: function(nick, channel, prefix) {
        var entry = this.tracker.getNickOnChannel(nick, channel);
        if (!$defined(entry)) return false; /* shouldn't happen */

        return (entry.prefixes).contains(prefix);
    },

    getNickStatus: function(channel, nick) {
        var nickchan = this.tracker.getNickOnChannel(nick, channel);
        if (!$defined(nickchan) || nickchan.prefixes.length === 0)
            return "";

        return nickchan.prefixes.charAt(0);
    },

    nickOnChanHasAtLeastPrefix: function(nick, channel, prefix) {
        var entry = this.tracker.getNickOnChannel(nick, channel);
        if (!$defined(entry))
            return false; /* shouldn't happen */

        /* this array is sorted */
        var pos = this.prefixes.indexOf(prefix);
        if (pos === -1) return false; /* shouldn't happen */

        var prefixes = this.prefixes.slice(0, pos + 1);

        //true if any of entry.prefix is part of prefixes string
        return _.some(entry.prefixes, function(prefix) {
            return util.validPrefix(prefixes, prefix);
        });
    },

    //needs a rewrite with a proper list implementation
    getPopularChannels: function(cb, minUsers) {
        this.hidelistout = true;
        this.exec('/list >' + (minUsers || 75)); //request chans with more than 75 users
        this.addEvent("listend:once", function() {
            var chans = _.chain(this.listedChans)
                        .clone()
                        .sortBy(function(chan) {return -chan.users}) //neg to sort descending
                        .value();
            cb(chans);
            this.hidelistout = false;
        });
    },

    canJoinChannel: function(chan) {//currently not implemented due to comments. Uncomment if desired
        //check if already on channel
        // if(chan === BROUHAHA) return true;
        // else if(this.tracker.getChannel(chan)) return false;

        // var chansets = session.get(chan) || [], //oldest -> newest
        //     currTime = Date.now(),
        //     rejoinT = this.options.minRejoinTime,
        //     minTime = Math.max.apply(null, rejoinT.slice(0, chansets.length)) * 1000;//max min applicable time
        // chan = util.formatChannel(chan);

        // var broken = chansets.filter(function(time) {
        //     return currTime - time <= minTime;
        // });

        // if(broken.length === 0) {
        //     chansets.push(currTime);
        //     var n = (chansets.length - rejoinT.length).limit(0, chansets.length);
        //     session.set(chan, chansets.slice(n));
        // } else {
        //     var maxTime = Math.max.apply(null, chansets.map(function(time, i) {
        //         return ((minTime - (currTime - time))/1000).round(1); //to secs/10
        //     }));
        //     this.writeMessages(lang.waitToJoin, {channel: chan, time: maxTime});
        // }

        // return broken.length === 0;
        return chan === BROUHAHA || !this.tracker.getChannel(chan);
    },

    /*************************************************
    *   Process server/network data & call method    *
    **************************************************/
    dispatch: function(data) {
        var fn = this[this.IRC_COMMAND_MAP[data.command] || "irc_" + data.command];

        if (!(fn && fn.call(this, data))) {//fn dne or does not return true
            this.rawNumeric(data);
        }
    },

    _tdispatch: function(data) {
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
                var _data = util.processTwistedData(data);
                this.dispatch(_data);
            break;
        }
    },

    /*************************************************
    *               message helpers                  *
    **************************************************/
    writeMessages: function(messages, args, data) {
        data = _.extend({
            type: "info",
            colourClass: "",
            channel: STATUS,
            message: []
        }, data);
        data.channels = data.channels === "ALL" ? [STATUS, BROUHAHA].concat(this.channels) : data.channels;
        var client = this,
            types = lang.TYPES;

        function write(message) {
            var msg = args ? util.formatter(message.message, args) :
                            message.message; //replaces values like {replaceme} if args has a key like that
            data.message.push(msg);

            switch (message.type) {
            case types.ERROR:
                data.colourClass = "warn";
                break;
            case types.INFO:
                data.colourClass = "info";
                break;
            }
        }

        if(_.isArray(messages)){
            messages.each(write);
        }else {
            write(messages);
        }
        return this.trigger("info", data);
    },

    genericError: function(data) {
        var target = data.args[1],
            message = _.last(data.args);
        this.trigger("error", {
            target: target,
            channel: target,
            message: message,
            type: "genericError"
        });
        return true;
    },
    genericQueryError: function(data) {
        var target = data.args[1],
            message = _.last(data.args);

        this.trigger("error", {
            target: target,
            channel: target,
            message: message,
            type: "genericError"
        });
        return true;
    },

    /*************************************************
    *       private server event handlers             *
    **************************************************/
    _signOn: function(/*data*/) {
        if(this.__signedOn) {//server/client crashed reconnect
            console.log("REjoining " + util.formatChannelString(this.channels));
            return this.send(format(cmd.JOIN, {
                channel: util.formatChannelString(this.channels)
            }));
        }

        var options = this.options,
            channels;

        this.writeMessages(lang.signOn);
        this.writeMessages(lang.loginMessages, {}, {channel: BROUHAHA});

        if (!this.authed && auth.enabled) {
            this.exec(util.format("/AUTH {username} {password}", this.options));

            // if the user is authed they will be set to +x... however as most users arent authed...
            //wait a hundreth of a second to see if the auth server authed you
            this.writeMessages.delay(100, this, lang.joinAfterAuth);

            this.activeTimers.autojoin = (function() {
                if (!this.authed) {
                    this.writeMessages(lang.authFailed);
                }
            }).delay(5000, this);
        } else {
            this.exec("/AUTOJOIN");
        }

        this.trigger("logon", {
            'nickname': this.nickname,
            'channels': channels
        });
    },

    _supported: function(key, value) {
        var self = this;
        switch(key) {
            case "CASEMAPPING":
                if (value === "ascii") {
                    self.toIRCLower = irc.ASCIItoIRCLower;
                } else if (value === "rfc1459") {
                    //default
                } else if(DEBUG) {
                    // TODO: warn 
                    console.log('unsupported codec');
                }
                self.lowerNickname = self.toIRCLower(self.nickname); //why does self happen here
            break;
            case "CHANMODES":
                _.each(value.split(","), function(mode, inx) {
                    _.each(mode, function(letter) {
                        self.pmodes[letter] = inx;
                    });
                });
            break;
            case "PREFIX":
                var len = (value.length - 2) / 2,
                    modeprefixes = self.modeprefixes = value.substr(1, len);
                self.prefixes = value.substr(len + 2, len);
                _.each(modeprefixes, function(modeprefix) {
                    self.pmodes[modeprefix] = irc.PMODE_SET_UNSET;
                });
            break;
        }
    },

    _joinInvited: _.debounce(function() {
        this.exec("/JOIN " + this.inviteChanList.join(","));
        this.inviteChanList.empty();
    }, 100),

    processCTCP: function(message) {
        if (message.charAt(0) !== "\x01") return;

        if (_.last(message) === "\x01") {
            message = message.slice(1, message.length - 2);
        } else {
            message = message.slice(1);
        }
        return message.splitMax(" ", 2);
    },

    rawNumeric: function(data) {
        this.trigger("raw", {
            "numeric": data.command,
            "message": data.args.slice(1).join(" ")
        });
    },

    updateNickList: function(channel) {
        this.trigger("updateNicklist", {
            nicks: this.tracker.getSortedNicksForChannel(channel),
            channel: channel
        });
    },

    _pushLastNick: function(nick) {
        var i = this.lastNicks.indexOf(nick);
        if (i != -1) {
            this.lastNicks.splice(i, 1);
        }
        this.lastNicks.unshift(nick);
    },

    _initChanTopic: function(channel, topic) {
        this.trigger("chanTopic", {
            'channel': channel,
            'topic': topic,
            'initial': true
        });
    },

    _initChanUsers: function(channel, names) {
        if (names.length === 0) { //occurs on channel join
            this.updateNickList(channel);
            return;
        }
        var getPrefixes = util.prefixOnNick(this.prefixes);
        _.each(names, function(prenick) {
            var prefixNick = getPrefixes(prenick),
                prefixes = prefixNick[0],
                nick = prefixNick[1];

            if (channel !== BROUHAHA) {
                this.tracker.addNickToChannel(nick, BROUHAHA);
            }
            var nc = this.tracker.addNickToChannel(nick, channel);

            _.each(prefixes, function(p) {
                util.addPrefix(nc, p, this.prefixes);
            }, this);
        }, this);
    },

    onAuthenticated: function(data) {
        this.authed = true;
        this.exec("/UMODE +x");
        if (!this.__autojoined) {
            this.writeMessages(lang.joinChans);
            this.exec("/AUTOJOIN");
        }

        this.fireEvent("auth", {
            nick: data.nick,
            message: _.last(data.args),
            host: data.host,
            username: _.first(data.args)
        });
    },

    _whois: function(nick, type, data) {
        var ndata = {
            "n": nick,
            channel: ACTIVE,
            msgs: []
        };
        var mtype = type.toUpperCase();
        var msgs = ndata.msgs;

        switch(type.toLowerCase()) {
            case "user":
                msgs.push({
                    type: "whoisUser",
                    h: data.ident + "@" + data.hostname
                });

                msgs.push({
                    type: "whoisRealname",
                    m: data.realname
                });
            break;
            case "server":
                msgs.push({
                    x: data.server,
                    message: data.serverdesc,
                    type: "whoisServer"
                });
            break;
            case "channels":
                msgs.push({
                    message: data.channels,
                    type: "whoisChannels"
                });
            break;
            case "account":
                msgs.push({
                    message: data.account,
                    type: "whoisAccount"
                });
            break;
            case "away":
                msgs.push({
                    message: data.away,
                    type: "whoisAway"
                });
            break;
            case "opername":
                msgs.push({
                    message: data.opername,
                    type: "whoisOpername"
                });
            break;
            case "actually":
                msgs.push({
                    message: data.hostname,
                    x: data.ip,
                    type: "whoisActually"
                });
            break;
            case "generictext":
                msgs.push({
                    message: data.text,
                    type: "whoisGenericText"
                });
            break;
            default:
                msgs.push({
                    type: "whois" + type.toLowerCase().capitalize()
                });
        }

        this.trigger("whois", ndata);
        return true;
    },

    /*********************************************************************
    *                                                                    *
    *                BEGIN STANDARD IRC HANDLERS                         *
    *                                                                    *
    **********************************************************************/
    IRC_COMMAND_MAP: {// function router see dispatch
        // "ERROR": "",
        // "INVITE": "",
        // "JOIN": "",
        // "KICK": "",
        // "MODE": "",
        // "NICK": "",
        // "NOTICE": "",
        // "PART": "",
        // "PING": "",
        // "TOPIC": "",
        // "PRIVMSG": "",
        // "QUIT": "",
        // "WALLOPS": "",

        "ERR_CANNOTSENDTOCHAN": "genericError",
        "ERR_CHANOPPRIVSNEEDED": "genericError",
        // "ERR_NICKNAMEINUSE": "",
        "ERR_NOSUCHNICK": "genericQueryError"//,

        // "RPL_AWAY": "",
        // "RPL_CHANNELMODEIS": "",
        // "RPL_CREATIONTIME": "",
        // "RPL_ENDOFNAMES": "",
        // "RPL_ISUPPORT": "",
        // "RPL_LIST": "",
        // "RPL_LISTSTART": "",
        // "RPL_LISTEND": "",
        // "RPL_NAMREPLY": "",
        // "RPL_NOTOPIC": "",
        // "RPL_NOWAWAY": "",
        // "RPL_TOPIC": "",
        // "RPL_TOPICWHOTIME": "",
        // "RPL_UNAWAY": "",
        // "RPL_WELCOME": "",

        // "RPL_WHOISACCOUNT": "",
        // "RPL_WHOISACTUALLY": "",
        // "RPL_WHOISCHANNELS": "",
        // "RPL_WHOISGENERICTEXT": "",
        // "RPL_WHOISIDLE": "",
        // "RPL_WHOISOPERATOR": "",
        // "RPL_WHOISOPERNAME": "",
        // "RPL_WHOISSECURE": "",
        // "RPL_WHOISSERVER": "",
        // "RPL_WHOISUSER": "",
        // "RPL_WHOISWEBIRC": "",
        // "RPL_ENDOFWHOIS": "",
    },

    irc_PING: function(data) {
        this.send("PONG :" + _.last(data.args));
        return true;
    },

    irc_RPL_WELCOME: function(data) {
        var self = this;
        self.nickname = data.args[0];
        data.message = data.args[1];
        self.lowerNickname = self.toIRCLower(self.nickname);
        self._signOn(data);
        _.delay(function() {
            self.__signedOn = true; //so auto join channels arent selected immediately - brouhaha window is
        }, 2000);
    },

    irc_NICK: function(data) {
        var self = this,
            newnick = data.args[0],
            oldnick = data.nick,
            wasus = this.nickname === oldnick;

        if (wasus) { //shouldnt this always be true?
            this.nickname = newnick;
            this.lowerNickname = this.toIRCLower(this.nickname);
        }

        if (wasus) {
            self.nickname = newnick;
            self.options.settings.set("nickname", newnick);
        }

        self.tracker.renameNick(oldnick, newnick);

        var channels = self.tracker.getNick(newnick);

        _.each(channels, function(obj, chan) {
            self.updateNickList(chan);
        });

        self.trigger("nickChange", {
            'nick': oldnick,
            'newnick': newnick,
            'channels': channels,
            'thisclient': wasus,
            'type': 'nick'
        });

        return true;
    },

    irc_JOIN: function(data) {
        var channel = data.args[0],
            nick = data.nick,
            wasus = (nick === this.nickname),
            type = wasus ? "OURJOIN" : "JOIN"

        if(wasus) {
            if(!isBaseWindow(channel)) {
                this.storeChannels(util.addChannel(this.getChannels(), channel));
            }
            if(this.__signedOn) {
                this.currentChannel = channel;
            }
        }
        var windowSelected = (channel === this.currentChannel || channel === BROUHAHA);



        this.tracker.addNickToChannel(nick, BROUHAHA);
        this.tracker.addNickToChannel(nick, channel);
        this.updateNickList(BROUHAHA);
        this.updateNickList(channel);

        this.trigger("userJoined", {
            'nick': nick,
            'host': data.host,
            'channel': channel,
            'thisclient': wasus,
            'select': windowSelected
        });

        return true;
    },

    irc_QUIT: function(data) {
        var self = this,
            message = _.last(data.args),
            nick = data.nick,
            channels = self.tracker.getNick(nick);

        self.tracker.removeNick(nick);
        _.each(channels, function(nick, chan) {
            self.updateNickList(chan);
        });

        self.trigger("quit", {
            'host': data.host,
            'nick': nick,
            'channels': channels,
            'message': message
        });

        return true;
    },

    irc_PART: function(data) {
        var channel = data.args[0],
            message = data.args[1],
            nick = data.nick,
            wasus = (nick === this.nickname);

        this.partHandler(nick, channel);

        if (wasus) {
            this.tracker.removeChannel(channel);
        } else {
            this.tracker.removeNickFromChannel(nick, BROUHAHA);
            this.tracker.removeNickFromChannel(nick, channel);
            this.updateNickList(BROUHAHA);
            this.updateNickList(channel);
        }

        this.trigger("part", {
            'nick': nick,
            'host': data.host,
            'channel': channel,
            'message': message,
            'thisclient': wasus
        });

        return true;
    },

    irc_KICK: function(data) {
        var kicker = data.prefix,
            channel = data.args[0],
            kickee = data.args[1],
            message = data.args[2],
            wasus = kickee === this.nickname;

        this.partHandler(kickee, channel);
        if (wasus) {
            this.tracker.removeChannel(channel);
        } else {
            this.tracker.removeNickFromChannel(kickee, channel);
            this.updateNickList(channel);
        }

        this.trigger("kick", {
            'kicker': kicker,
            'channel': channel,
            'kickee': kickee,
            'message': message,
            'thisclient': wasus
        });

        return true;
    },

    partHandler: function(nick, chan) {
        var wasus = nick === this.nickname;
        if(wasus && this.inChannel(chan)) {
            this.channels.erase(chan);
        }
        return wasus;
    },

    irc_TOPIC: function(data) {
        var channel = data.args[0],
            topic = _.last(data.args);

        this.trigger("chanTopic", {
            'nick': data.nick,
            'channel': channel,
            'topic': topic
        });

        return true;
    },

    //todo buffer messages
    irc_PRIVMSG: function(data) {
        var nick = data.nick,
            target = data.args[0],
            message = _.last(data.args);

        var ctcp = this.processCTCP(message);
        if (ctcp) {
            var type = ctcp[0].toUpperCase();
            var replyfn = irc.RegisteredCTCPs[type];
            if (replyfn) {
                var t = Date.now() / 1000;//prevent flood
                if (t > this.nextctcp) {
                    this.send(format(cmd.CTCP, {
                        target: data.user,
                        type: type,
                        text: replyfn(ctcp[1])
                    }));
                }
                this.nextctcp = t + 5;
            }

            if (target === this.nickname) {
                var ctcptype = type == "ACTION" ? "privAction" : "privCTCP";
                this.trigger(ctcptype, {
                    'nick': nick,
                    'host': data.host,
                    'message': ctcp[1] || "",
                    'data': type
                });
            } else {
                var context = {
                        'nick': nick,
                        'channel': target,
                        'message': ctcp[1] || "",
                        "prefix": this.getNickStatus(target, nick)
                    };
                if (type == "ACTION") {
                    this.tracker.updateLastSpoke(nick, target, Date.now());
                    this.trigger("chanAction", context);
                }
                else {
                    this.trigger("chanCTCP", context);
                }
            }
        } else {
            if (target === this.nickname) {
                this._pushLastNick(nick);
                this.trigger("query", {
                    'nick': nick,
                    'host': data.host,
                    'channel': nick,
                    'message': message,
                    'type': 'privmsg'
                });
            } else {
                this.tracker.updateLastSpoke(nick, target, Date.now());
                this.trigger("chanMessage", {
                    'nick': nick,
                    'channel': target,
                    'message': message,
                    'type': 'chanmsg',
                    "prefix": this.getNickStatus(target, nick)
                });
            }
        }
        return true;
    },

    irc_NOTICE: function(data) {
        var target = data.args[0],
            message = _.last(data.args),
            options = this.options;


        if (this.isNetworkService(data.host) || !$chk(data.nick)) {
            if(options.loginRegex.test(message)){
                this.onAuthenticated(data);
            }
            this.trigger("serverNotice", {
                'nick': data.nick,
                'message': message,
                'channel': STATUS
            });
        } else if (target === this.nickname) {
            var ctcp = this.processCTCP(message);
            if (ctcp) {
                this.trigger("ctcpReply", {
                    'nick': data.nick,
                    'host': data.host,
                    'ctcptype': ctcp[0],
                    'args': ctcp[1] || ""
                });
            } else {
                this.trigger("privNotice", {
                    'message': message,
                    'host': data.host,
                    'nick': data.nick,
                    'channel': data.nick
                });
            }
        } else {
            this.trigger("chanNotice", {
                'nick': data.nick,
                'channel': target,
                'message': message,
                "prefix": this.getNickStatus(target, data.nick)
            });
        }

        return true;
    },

    irc_INVITE: function(data) {
        var channel = _.last(data.args);
        var accept = this.ui.uiOptions2.get("accept_service_invites") && this.isNetworkService(host);

        if (accept) {
            if (this.activeTimers.serviceInvite) {
                $clear(this.activeTimers.serviceInvite);
            }
            // we do this so we can batch the joins
            this.activeTimers.serviceInvite = this._joinInvited();
            this.inviteChanList.push(channel);
        }

        this.trigger("invite", {
            'channel': channel,
            'accept': accept,
            'nick': data.nick,
            'host': data.host
        });

        return true;
    },


    irc_ERR_NICKNAMEINUSE: function(data) {//add some number to the nick and resend
        this.genericError(data);

        if (this.__signedOn) {
            return true;
        }

        var nick = data.args[1],
            newnick = nick + Number.random(0, 9);

        this.send(format(cmd.NICK, {nick: newnick}));
        this.lastnick = newnick;
        return true;
    },

    irc_ERROR: function(data) {
        var message = _.last(data.args);

        this.trigger("error", {
            message: message,
            type: "genericError"
        });

        return true;
    },

    irc_MODE: function(data) {//http://tools.ietf.org/html/rfc1459.html#section-4.2.3
        var self = this,
            target = data.args[0],
            args = data.args.slice(1);

        if (target == this.nickname) {
            this.trigger("userMode", {
                'modes': args,
                'message': args.join(""),
                'type': "UMODE",
                'n': this.nickname
            });
        } else {//target is channel
            var modes = args[0].split(""),
                nick = _.last(args),//note: not bothering for ban mask case 

                cmode = OPED;

            modes.filter(function(mode) {
                var dir = (mode === OPED) || (mode === DEOPED);
                if (dir) {
                    cmode = mode;
                }
                return !dir;
            }).each(function(mode) {
                var pmode = self.pmodes[mode],
                    _nick = pmode === irc.PMODE_LIST || pmode === irc.PMODE_SET_UNSET ? nick : null;

                var prefixindex = self.modeprefixes.indexOf(mode);
                if (prefixindex === -1) return;

                var nc = self.tracker.getOrCreateNickOnChannel(nick, target),
                    added = cmode === OPED;

                var prefix = self.prefixes.charAt(self.modeprefixes.indexOf(mode));

                var prefixchar = added ? util.addPrefix(nc, prefix, self.prefixes) :
                                        util.removePrefix(nc, prefix);

                self.trigger("mode", {
                    "added": added,
                    "prefix": prefixchar,
                    "message": prefixchar,
                    "nick": _nick,
                    "channel": target,
                    "thisclient": _nick === self.nickname,
                    "nickchan": nc
                });
            });

            self.updateNickList(target);
        }

        return true;
    },

    irc_RPL_ISUPPORT: function(data) {
        var supported = data.args.slice(1, -1); //everything but nick and server msg
        var ms;

        if(supported.contains("CHANMODES") && supported.contains("PREFIX")) { //nasty hack - don't understand purpose 
            this.pmodes = {}; //might invalidate things
        }

        supported.each(function(mode) {
            ms = mode.splitMax("=", 2);
            this._supported(ms[0], ms[1]);
        }, this);
    },

    irc_RPL_NAMREPLY: function(data) {
        var channel = data.args[2],
            names = data.args[3];

        this._initChanUsers(channel, names.split(" "));

        return true;
    },

    irc_RPL_ENDOFNAMES: function(data) {
        var channel = data.args[1];

        this._initChanUsers(channel, []);
        return true;
    },

    irc_RPL_NOTOPIC: function(data) {
        var channel = data.args[1];

        if (this.inChannel(channel)) {
            this._initChanTopic(channel, "");
            return true;
        }
    },

    irc_RPL_TOPIC: function(data) {
        var channel = data.args[1],
            topic = _.last(data.args);

        if (this.inChannel(channel)) {
            this._initChanTopic(channel, topic);
            return true;
        }
    },

    irc_RPL_TOPICWHOTIME: $lambda(true),

    irc_RPL_WHOISUSER: function(data) {
        var nick = data.args[1];
        this._whoisNick = nick;

        return this._whois(nick, "user", {
            ident: data.args[2],
            hostname: data.args[3],
            realname: _.last(data.args)
        });
    },

    irc_RPL_WHOISSERVER: function(data) {
        var nick = data.args[1],
            server = data.args[2],
            serverdesc = _.last(data.args);

        return this._whois(nick, "server", {
            server: data.args[2],
            serverdesc: _.last(data.args)
        });
    },

    irc_RPL_WHOISOPERATOR: function(data) {
        var nick = data.args[1],
            text = _.last(data.args);

        return this._whois(nick, "oper", {
            opertext: _.last(data.args)
        });
    },

    irc_RPL_WHOISIDLE: function(data) {
        var nick = data.args[1];

        return this._whois(nick, "idle", {
            idle: data.args[2],
            connected: data.args[3]
        });
    },

    irc_RPL_WHOISCHANNELS: function(data) {
        var nick = data.args[1];

        return this._whois(nick, "channels", {
            channels: _.last(data.args)
        });
    },

    irc_RPL_WHOISACCOUNT: function(data) {
        var nick = data.args[1];

        return this._whois(nick, "account", {
            account: data.args[2]
        });
    },

    irc_RPL_WHOISACTUALLY: function(data) {
        var nick = data.args[1];

        return this._whois(nick, "actually", {
            hostmask: data.args[2],
            ip: data.args[3]
        });
    },

    irc_RPL_WHOISOPERNAME: function(data) {
        var nick = data.args[1],
            opername = data.args[2];

        return this._whois(nick, "opername", {
            opername: data.args[2]
        });
    },

    irc_RPL_WHOISGENERICTEXT: function(data) {
        var nick = data.args[1],
            text = _.last(data.args);

        return this._whois(nick, "generictext", {
            text: text
        });
    },

    irc_RPL_WHOISWEBIRC: function(data) {
        var nick = data.args[1],
            text = _.last(data.args);

        return this._whois(nick, "generictext", {
            text: text
        });
    },

    irc_RPL_WHOISSECURE: function(data) {
        var nick = data.args[1],
            text = _.last(data.args);

        return this._whois(nick, "generictext", {
            text: text
        });
    },

    irc_RPL_ENDOFWHOIS: function(data) {
        var nick = data.args[1],
            text = _.last(data.args);
        delete this._whoisNick;

        return this._whois(nick, "end", {});
    },

    irc_RPL_AWAY: function(data) {
        var nick = data.args[1],
            message = _.last(data.args);

        if (this._whoisNick == nick) {
            return this._whois(nick, "away", {
                "away": message
            });
        }
        this.trigger("away", {
            "nick": nick,
            "message": message
        });
        return true;
    },

    irc_RPL_NOWAWAY: function(data) {
        this.trigger("error", {
            state: true,
            message: _.last(data.args),
            type: "genericError"
        });
        return true;
    },

    irc_RPL_UNAWAY: function(data) {
        this.trigger("error", {
            state: false,
            message: _.last(data.args),
            type: "genericError"
        })
        return true;
    },

    irc_WALLOPS: function(data) {
        this.trigger("wallops", {
            message: message,
            nick: data.nick,
            host: data.host
        });
        return true;
    },

    irc_RPL_CREATIONTIME: function(data) {
        var channel = data.args[1],
            time = data.args[2];

        this.trigger("serverMessage", {
            channel: channel || ACTIVE,
            message: util.IRCDate(new Date(time * 1000)),
            type: "channelCreationTime"
        });
        return true;
    },

    irc_RPL_CHANNELMODEIS: function(data) {
        var channel = data.args[1],
            modes = data.args.slice(2);

        this.trigger("serverMessage", {
            channel: channel || ACTIVE,
            message: modes.join(" "),
            type: "channelModeIs"
        });
        return true;
    },


    irc_RPL_LISTSTART: function() {
        this.listedChans = [];//should have a make list command in command utils
        return !this.hidelistout;
    },

    irc_RPL_LIST: function(data) {
        this.listedChans.push({
            channel: data.args[1],
            users: _.toInt(data.args[2]),
            topic: data.args[3]
        });
        return !this.hidelistout;
    },

    irc_RPL_LISTEND: function() {
        this.trigger("listend", this.listedChans);
        return !this.hidelistout;
    }
});
/*************************
   Whewh.. end irc client
***************************/
// /* This could do with a rewrite from scratch. */
//going to rewrite using socket.io commet.
// //uris = dict(p=push, n=newConnection, s=subscribe)
(function() {
    //http://blog.mibbit.com/?p=143
    // moved browser specific headers to be removed here so it doesnt have to be computed each connection.
    // header nullables are browser dependent
    var killBit = "";
    var killHeaders = {//http://www.w3.org/TR/XMLHttpRequest/#dom-xmlhttprequest-setrequestheader
        // "User-Agent": killBit,
        "Accept": killBit,
        "Accept-Language": killBit
        /*,
        "Content-Type": "M"*/
    };

    irc.TwistedConnection = new Class({
        Implements: [Events, Options],
        Binds: ["send"],
        options: {
            nickname: "",
            minTimeout: 45000,
            maxTimeout: 5 * 60000,
            timeoutIncrement: 10000,
            initialTimeout: 65000,
            floodInterval: 200,
            floodMax: 10,
            floodReset: 5000,
            errorAlert: true,
            maxRetries: 5,
            serverPassword: null
        },
        connected: false,
        counter: 0,

        __sendQueue: [],
        __lastActiveRequest: null,
        __activeRequest: null,
        __sendQueueActive: false,

        __floodLastRequest: 0,
        __retryAttempts: 0,
        __floodCounter: 0,
        __floodLastFlood: 0,
        __timeoutId: null,


        initialize: function(options) {
            this.setOptions(options);
            this.__timeout = this.options.initialTimeout;
        },

        connect: function() {
            var self = this;
            self.connected = true;
            self.cacheAvoidance = util.randHexString(16);
            var request = self.newRequest("n");

            request.addEvent("complete", function(stream) {
                if (!stream) {
                    self.lostConnection(lang.connectionFail);
                    return;
                } else if (!stream[0]) {
                    self.disconnect();
                    self.lostConnection(lang.connError, stream);
                    return;
                }
                self.sessionid = stream[1];
                self.recv();
            });

            var postdata = "nick=" + encodeURIComponent(self.options.nickname);
            if (self.options.serverPassword != null) {
                postdata += "&password=" + encodeURIComponent(self.options.serverPassword);
            }
            request.send(postdata);
        },

        disconnect: function() {
            this.connected = false;
            this.__cancelTimeout();
            this.__cancelRequests();
        },

        newRequest: function(url, floodProtection, synchronous) {
            var self = this;
            //check if request should proceed
            if (!self.connected) {
                return null;
            } else if (floodProtection && self.__isFlooding()) {
                self.disconnect();
                self.__error(lang.uncontrolledFlood);
            }
            var request = new Request.JSON({
                url: qwebirc.global.dynamicBaseURL + "e/" + url + "?r=" + self.cacheAvoidance + "&t=" + self.counter++,
                async: !synchronous
            });

            // try to minimise the amount of headers 
            request.headers = {};//{X-Requested-With: "XMLHttpRequest", Accept: "application/json", X-Request: "JSON"}
            request.addEvent("request", function() {
                Object.each(killHeaders, function(val, key) {
                    try {
                        request.xhr.setRequestHeader(key, val);
                    } catch (o_O) {
                        delete killHeaders[key];//cant set header on this browser
                    }
                });
            });

            if (Browser.ie && Browser.version < 8) {
                request.setHeader("If-Modified-Since", "Sat, 01 Jan 2000 00:00:00 GMT");
            }
            return request;
        },

        recv: function() {
            var self = this,
                request = self.newRequest("s", true);
            if (request == null) {
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
                    if (self.connected && self.__checkRetries()) {
                        self.recv();
                    }
                    return;
                } else if (self.__processData(stream)) {
                    self.recv();
                }
            };
            request.addEvent("complete", onComplete);
            self.__scheduleTimeout();
            request.send("s=" + self.sessionid);
        },

        send: function(data, synchronous) {
            if (!this.connected) {
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
            if (request == null) {
                return;
            }
            request.addEvent("complete", this.__completeRequest.bind(this, async))
                    .send("s=" + this.sessionid + "&c=" + encodeURIComponent(data));
        },

        __completeRequest: function(async, stream) {
            if (async) {
                this.__sendQueueActive = false;
            }
            if (!stream || (!stream[0])) {
                this.__sendQueue = [];
                if (this.connected) {
                    this.lostConnection(lang.connError, stream)
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
            if (++this.__retryAttempts > this.options.maxRetries && this.connected) {
                this.disconnect();
                this.__error(lang.connTimeOut, {
                    retryAttempts: this.__retryAttempts
                });
                this.fireEvent("lostConnection", this.__retryAttempts);
                return false;
            }
            var to = this.__timeout - this.options.timeoutIncrement;
            if (to >= this.options.minTimeout) {
                this.__timeout = to;
            }
            return true;
        },

        __cancelRequests: function() {
            if (this.__lastActiveRequest != null) {
                this.__lastActiveRequest.cancel();
                this.__lastActiveRequest = null;
            }
            if (this.__activeRequest != null) {
                this.__activeRequest.cancel();
                this.__activeRequest = null;
            }
        },

        __processData: function(payload) {
            var self = this;
            if (payload[0] == false) {
                if (self.connected) {
                    self.lostConnection(lang.connError, payload);
                }
                return false;
            }

            self.__retryAttempts = 0;
            payload.each(function(data) {
                self.fireEvent("recv", [data]);//array because mootools fire event is broken for arrays
            });

            return true;
        },


        __scheduleTimeout: function() {
            this.__timeoutId = this.__timeoutEvent.delay(this.__timeout, this);
        },

        __cancelTimeout: function() {
            if (this.__timeoutId != null) {
                $clear(this.__timeoutId);
                this.__timeoutId = null;
            }
        },

        __timeoutEvent: function() {
            this.__timeoutId = null;
            if (this.__activeRequest == null) {
                return;
            } else if (this.__lastActiveRequest) {
                this.__lastActiveRequest.cancel();
            }
            // this.fireEvent("retry", {
            //     duration: this.__timeout
            // });
            this.__activeRequest.__replaced = true;
            this.__lastActiveRequest = this.__activeRequest;
            var to = this.__timeout + this.options.timeoutIncrement;
            if (to <= this.options.maxTimeout) {
                this.__timeout = to;
            }
            this.recv();
        },

        lostConnection: function(reason) {
            this.connected = false;
            this.fireEvent("lostConnection", this.__retryAttempts);
            this.__error.apply(this, arguments);
        },

        __error: function(message, context) {
            var msg = context ? util.formatter(message.message, context) : message.message;
            this.fireEvent("error", msg);
            new ui.Alert({
                title: "Connection Error",
                text: msg
            });
        }
    });
})();


irc.IRCTracker = new Class({
    channels: {},
    nicknames: {},
    initialize: function(owner) {
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
        if (nickchan){
            _.each(nickchan, function(data, chan) {
                var lchannel = this.toIRCLower(chan),
                    channel = this.channels[lchannel];

                delete channel[nick];
                if (_.isEmpty(channel)) {
                    delete this.channels[lchannel];
                }
            }, this);
            delete this.nicknames[nick];
        }
    },

    removeChannel: function(channel) {
        var chan = this.getChannel(channel);
        if (chan) {
            var lchannel = this.toIRCLower(channel);
            _.each(_.keys(chan), function(nick) {
                var nc = this.nicknames[nick];
                delete nc[lchannel];
                if (_.isEmpty(nc)) { //in no more channels
                    delete this.nicknames[nick];
                }
            }, this);
            delete this.channels[lchannel];
        }
    },

    removeNickFromChannel: function(nick, channel) {
        var lchannel = this.toIRCLower(channel);

        var nickchan = this.getNick(nick);
        var chan = this.getChannel(lchannel);
        if (!nickchan || !chan) return;

        delete nickchan[lchannel];
        delete chan[nick];

        if (_.isEmpty(nickchan)) {
            delete this.nicknames[nick];
        }
        if (_.isEmpty(chan)) {
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
        var nickHash = this.getChannel(channel);
        if (!nickHash) return;

        return _.chain(nickHash)
                .values()
                .sortBy(function(nick) {
                    return -nick.lastSpoke;//reverse
                })
                .value();
    },

    getSortedNicksForChannel: function(channel, sorter) {
        var nickHash = this.getChannel(channel);
        if(_.isEmpty(nickHash)) return [];
        if(!sorter) {
            //sorts nicks by status > lexigraphy
            //then add the prefix in front of the name
            sorter = util.nickChanComparitor(this.owner, nickHash);
        }
        return _.keys(nickHash).sort(sorter).map(function(nick, index) {
            return {
                prefix: nickHash[nick].prefixes,
                nick: nick,
                index: index//in array
            };
        });
    }
});

irc.RegisteredCTCPs = {
    "VERSION": $lambda("qwebirc v" + qwebirc.VERSION + ", copyright (C) 2008-2011 Chris Porter and the qwebirc project -- " + navigator.userAgent),
    "USERINFO": $lambda("qwebirc"),
    "TIME": function(x) {
        return util.IRCDate(new Date());
    },
    "PING": $lambda,
    "CLIENTINFO": $lambda("PING VERSION TIME USERINFO CLIENTINFO WEBSITE"),
    "WEBSITE": $lambda(((window == window.top) ? "direct" : document.referrer))
};
})();

ui.WINDOW_ID_MAP = [
    {
        id: "privacy",
        keys: ["privacy policy"]
    },
    {
        id: "embedded",
        keys: ["add webchat to your site"]
    },
    {
        id: "login",
        keys: ["connection details"]
    }
];

ui.IWindows = new Class({
    windows: {},
    customWindows: {},
    windowArray: [],
    Window: ui.Window,//OVERRIDE!
    nav: null,

    getWindowIdentifier: function(name) {
        var id = name.toLowerCase()
        var wid = _.find(qwebirc.ui.WINDOW_ID_MAP, function(val) {return val.keys.contains(id);});
        return wid && wid.id || id;
    },

    getClientId: function(client) {
        return client === ui.CUSTOM_CLIENT || !client ? ui.CUSTOM_CLIENT : client.id;
    },

    newWindow: function(client, type, name) {
        var win = this.getWindow(client, name);
        if (!$defined(win)) {
            if(util.windowNeedsInput(type)) {
                this.commandhistory.addChannel(name);
            }
            var wId = this.getWindowIdentifier(name);
            var $wrapper = new Element('div.hidden').inject(this.windowsPanel);//for delegation - this is not how i should do it
            win = this.windows[this.getClientId(client)][wId] = new this.Window(this, $wrapper, client, type, name, wId);
            this.windowArray.push(win);
        }

        return win;
    },

    getWindow: function(client, name) {
        if(_.isString(client)) name = client;
        var wins = this.getWindows(client);
        if (_.isObject(wins)) 
            return wins[this.getWindowIdentifier(name)];
    },

    getWindows: function(client) {
        return this.windows[this.getClientId(client)] || this.customWindows;
    },

    getActiveWindow: function() {
        return this.active;
    },
    getActiveIRCWindow: function(client) {
        if (!this.active || this.active.type == ui.WINDOW.custom) {
            return this.windows[this.getClientId(client)][this.getWindowIdentifier(STATUS)];
        } else {
            return this.active;
        }
    },
    selectWindow: function(win) {
        if(_.isNumber(win))
            win = this.windowArray[win];
        else if(_.isString(win))
            win = this.getWindow(win);
        if(win !== this.active) {
            if (this.active) {
                this.active.deselect();
            }
            win.select();
            this.setWindow(win);
            ui.setTitle(win.name + " - " + this.options.appTitle);
            this.updateURI();
        }
        return win;
    },
    updateURI: util.noop,
    setWindow: function(win) {
        if(!this.active || (win !== this.active && !this.active.closed)) {
            this.last = this.active;
        }
        this.active = win;
    },
    __closed: function(win) {
        var winarr = this.windowArray;
        var isActive = win === this.active;

        this.commandhistory.removeChannel(win.name);
        this.nav.removeTab(win.tab);
        var index = winarr.indexOf(win);
        winarr = this.windowArray.erase(win);
        delete this.windows[this.getClientId(win.client)][win.identifier];

        if (isActive) {
            delete this.active;
            if(this.last) {//select last active window
                this.last.select();
            }
            else if (!_.isEmpty(winarr)) {//case for 2 consecutive closes
                _.nextItem(winarr, index).select();
            }
        }
    },
    nextWindow: function(direction, fromWin) {
        var windows = _.where(this.windowArray, {detached:false}),
            win = _.nextItem(windows, windows.indexOf(fromWin || this.active), direction); //get window from array
        if(win) win.select();

        return win;
    },
    prevWindow: function() {
        this.nextWindow(-1);
    },

    newCustomWindow: function(name, select, type) {
        type = type || ui.WINDOW.custom;

        var win = this.newWindow(ui.CUSTOM_CLIENT, type, name);

        if (select) this.selectWindow(win);

        return win;
    },

    addCustomWindow: function(windowName, CustomView, cssClass, options) {
        var wid = this.getWindowIdentifier(windowName);
        if (_.has(this.customWindows, wid)) {
            return this.selectWindow(this.customWindows[wid]);
        }

        var win = this.newCustomWindow(windowName, true);
        this.customWindows[wid] = win;

        win.addEvent("destroy", function() {
            delete this.customWindows[wid];
        }.bind(this));

        if(_.isString(cssClass)) {
            win.lines.addClass(cssClass);
        }

        options = _.extend({
            element: win.lines
        }, options);
        new CustomView(options)
            .addEvent("close", win.close);


        return win;
    }
});

(function() {

//expects to be implemented with windowsui
ui.IIRCClient = new Class({
    Implements: [ui.IWindows],

    clients: {},
    clientId: 0,

    newClient: function(client) {
        client.id = this.clientId++;

        var windows = this.windows[client.id] = {};
        this.clients[client.id] = client;
        var win = this.newWindow(client, ui.WINDOW.status, STATUS);
        this.selectWindow(win);

        addClientEvents.call(this, client, windows);

        return win;
    },
    /*logout: function() {
        if (!auth.loggedin)
            return;
        if (confirm("Log out?")) {
            _.each(this.clients, function(client) {
                client.quit(lang.logOut.message);
            });

            (function() {
                document.location = qwebirc.global.dynamicBaseURL + "auth?logout=1";
            }).delay(500);
        }
    },*/
    nickChange: util.noop
});
var broadcast_re = /MSG|TOPIC|(CHAN|PRIV)NOTICE/i;
function formatChans(data) {
    var chans = data.channels;
    return chans && _.isObject(chans) ? _.keys(chans) : Array.from(chans || data.channel);
}
function addClientEvents(client, windows) { // mi gusta xD
    if(! client instanceof irc.IRCClient) return;
    var ui_ = this;
    function formatData(type, _data) {
        var data = _.extend({
            c: _data.channel || STATUS,
            n: _data.nick,
            m: _data.message,
            h: _data.host,
            t: type,
            type: type,
            "@": _data.prefix
        }, _data);
        data.channel = data.c;
        if (!(ui_.uiOptions2.get("nick_ov_status"))){
            delete data["@"];
        }
        return data;
    }

    function lineParser(type, data) {
        data = formatData(type, data);
        
        _.each(formatChans(data), function(channel) {
            data.channel = data.c = channel;
            var win = (data.c === ACTIVE) ? ui_.getActiveWindow() : ui_.getWindow(client, channel);
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

    function formatBChannelName(data) {
        if(util.isChannel(channel)) {
            return nick + channel;
        } else {//pm
            nick = client.nickname
            if(channel === nick) {//so it always shows speaker>target
                return channel + ">" + nick;
            } else {
                return nick + ">" + channel;
            }
        }
    }

    function parser(type, data, win, channel) {
        type = data.type || data.t || type;
        channel = data.channel || STATUS;

        win.addLine(data.type, data);

        if(!util.isBaseWindow(data.channel) && broadcast_re.test(type)) {
            var data2 = _.clone(data);
            var nick = data2.nick;
            if(!util.isChannel(channel)) {//pm
                if(channel === nick) {//so it always shows speaker>target
                    channel = ">" + client.nickname;
                } else {
                    channel = ">" + channel;
                    data2.nick = nick;
                }
            }
            data2.linkedchannel = channel;

            ui_.windows.brouhaha.addLine(data2.type, data2);
        }
    }

    function updateTopic(type, data) {
        ui_.getWindow(client, data.channel).updateTopic(data.topic);
        if(!data.initial) {
            data.message = data.topic;
            lineParser("topic", data);
        }
    }

    function joinPart(type, data) {
        if ((data.thisclient && data.type != "PART" && data.type != "QUIT") ||
                !(ui_.uiOptions2.get("hide_joinparts"))) {
            data = _.clone(data);
            data.channels = _.reject(formatChans(data),  util.isBaseWindow);
            lineParser(type, data);
        }
    }

    function partKick(type, data) {
        if(data.thisclient) {
            var win = ui_.getWindow(client, data.channel);
            if(win) win.close();
        } else {
            joinPart(type,data);
        }
    }

    function queried(type, data) {//queries and private notices
        data = formatData(type, data);
        var win = ui_.newWindow(client, ui.WINDOW.query, data.channel); //get or create
        if(data.nick === client.nickname || ui_.uiOptions2.get("auto_open_pm")) {
            ui_.selectWindow(win);
        }
        if(data.message) parser(type, data, win);
    }

    client.addEvents({
        "connect": lineParser,
        // "disconnect": lineParser,
        "error": lineParser,
        "info": lineParser,
        "auth:once": function() {
            ui_.beep();
            ui_.showNotice({
                title: "Successful auth",
                body: "Successfully authed with server and set your hostmask"
            });
        },

        "chanAction": lineParser,
        "chanTopic": updateTopic,
        "chanMessage": lineParser,
        "chanNotice": lineParser,
        "chanCTCP": lineParser,

        "userJoined": function(type, data) {
            if(data.thisclient) {
                var win = ui_.newWindow(client, ui.WINDOW.channel, data.channel);//this is client scope
                if(data.select) {
                    win.select();
                }
            }
            joinPart(data.thisclient ? "ourJoin" : "join", data);
        },

        "openWindow": function(type, data) {//create? and select window
            var win = ui_.getWindow(data.window);
            if(!win) {
                if(data.type === ui.WINDOW.custom) {
                    win = ui_[data.window]();
                } else {
                    win = ui_.newWindow(client, data.type, data.window);
                }
            }
            win.select();
        },

        "updateNicklist": function(type, data) {
            var win = ui_.getWindow(client, data.channel);
            if(win) win.updateNickList(data.nicks);
        },

        "away": lineParser,
        "part": partKick,
        "quit": partKick,
        "kick": partKick,
        "invite": lineParser,
        "privAction": lineParser,
        "privCTCP": lineParser,
        "ctcpReply": lineParser,
        "userMode": lineParser,
        "nickChange": function(type, data) {
            ui_.nickChange(data, client);
            lineParser(type, data);
        },

        "privNotice": queried,
        "query": queried,

        "awayStatus": lineParser,
        "mode": function(type, data) {
            var win = ui_.getWindow(client, data.channel);
            if(win) {
                win.updatePrefix(data);
            }
            lineParser(type, data);
        },
        "serverMessage": lineParser,
        "serverNotice": lineParser,
        "whois": function(type, data) {
            _.each(data.msgs, function(msg) {
                lineParser(type, _.extend({}, data, msg));
            });
        },
        "wallops": lineParser,
        "raw": lineParser
    });
}

})();
(function() {
    function validate($ele, validators) {
        if(_.isEmpty(validators)) return;
        var text = $ele.val();
        var failed = _.find(validators, function(validator) {
            return !validator.test(text, $ele);
        });
        var failbool = !!failed;
        var $controlpar = $ele.getParent('.control-group')
                            .toggleClass('has-error', failbool);
        if (failbool) {
            if($controlpar.getElements(".help-block").filter(function(ele) {return ele.html() === failed.description}).length === 0) {
                getTemplate("failed-validator", function(template) {
                    Elements.from(template(failed)).inject($controlpar);
                    // $ele.focus();
                });
            }
        } else {
            $controlpar.getElements('.help-block').dispose();
        }
        return !failed;
    }


var LoginBox = function(parentElement, callback, settings, networkName, validators) {
    var nickname = settings.get("nickname"),
        username = Base64.decode(settings.get("username")),
        password = Base64.decode(settings.get("password")),
        eauth = auth.enabled || settings.get("auth");

    getTemplate("authpage", function(template) {
        var page = Element.from(template({
            'network': networkName,
            'nickname': nickname,
            'username': username,
            'password': password,
            'full': eauth, //whether to show the extra auth options (check the checkbox)
            'channels': settings.get("channels").join()
        })).inject(parentElement);

        var $form = page.getElement('#login'),
            $nickBox = page.getElement('#nickname'),
            $usernameBox = page.getElement('#username'),
            $passwordBox = page.getElement('#password'),
            $chkAddAuth = page.getElement('#authenticate');

        $form.addEvents({
            "blur:relay([data-validate])": function(e, target) {
                validate(target, validators[target.get("data-validate")]);
            }
        });

        $chkAddAuth.addEvent('click', function () {
            $form.getElements('[name="full"]').getParent('div').toggle();
        });

        $form.addEvent("submit", function(e) {
            e.stop();

            if(!validate($nickBox, validators.nick) ||
                    !validate($usernameBox, validators.username) ||
                    !validate($passwordBox, validators.password)) {
                return;
            }

            var nickname = $nickBox.val();

            /****
            * Valid*
            ****/

            var data = {
                "nickname": nickname
            };

            settings.set("nickname", nickname);// nicks valid

            if (auth.enabled || $chkAddAuth.val()) {
                data.username = username = $usernameBox.val();
                data.realname = username || "";
                data.password = password = $passwordBox.val();

                if (auth.bouncerAuth()) {
                    data.serverPassword = password;
                }
                else if(auth.passAuth()){
                    data.serverPassword = username + " " + password;
                }

                settings.set("username", Base64.encode(username));
                settings.set("password", Base64.encode(password));
                settings.set("auth", true);
                auth.enabled = true;
            } else {
                settings.unset("auth");
            }

            parentElement.empty();

            auth.loggedin = true;

            callback(data);
        });

        if (window === window.top) $nickBox.focus();

        ui.Behaviour.apply(page);
    });
};

ui.ILogin = new Class({
    Implements: [Events],
    LoginBox: LoginBox,
    loginBox: function() {
        var self = this;
        var win = this.newCustomWindow(CONNECTION_DETAILS, true, ui.WINDOW.connect);
        var callback = function(data) {
                win.close();
                self.fireEvent("login", data);
            };
        this.LoginBox(win.lines, callback, this.options.settings, this.options.networkName, this.options.validators);
        return win;
    },
    welcome: function() {
        ui.WelcomePane.show(this.ui, _.extend({
            element: this.element,
            firstvisit: true
        }, this.options));
    }
});
})();

ui.IUIOptions = new Class({
    theme: ui.Theme,

    config: function() {
        var self = this;
        var options = self.options;
        if(self.uiOptions instanceof config.OptionModel) return this;
        var uiOptions = self.uiOptions = self.uiOptions2 = new config.OptionModel({}, {
            defaults: options.uiOptions
        });
        function setNotices() {
            var notices = uiOptions.get("standard_notices").concat(uiOptions.get("custom_notices"));
            var notifiers = _.chain(notices)
                .filter(uiOptions.notice_filter)
                .map(function(notice) {
                    var onotice = {
                        beep: notice.beep,
                        flash: notice.flash,
                        pm: notice.pm,

                        mentioned: notice.mentioned,
                        notus: notice.notus,
                        highlight: notice.highlight,
                        tabhl: notice.tabhl,
                        classes: notice.classes,
                        types: notice.types
                    };
                    _.each(["msg", "nick", "type"], function(type) {
                        if(notice[type]) {
                            onotice[type] = new RegExp(notice.autoescape ? String.escapeRegExp(notice[type]) : notice[type],//format regex
                                        notice.case ? "i" : "");//set flag
                        }
                    });

                    return _.clean(onotice);
                })
                .value();
            
            self.theme.messageParsers.empty().combine(notifiers);
            self.theme.config = uiOptions;
        }

        uiOptions.on({
            "change:style_hue": function(style_hue) {
                self.updateStylesheet();
            },
            "change:font_size": self.updateStylesheet,
            "change:custom_notices": setNotices,
            "change:standard_notices": setNotices,
            "change:show_nicklist": function(state) {
                _.each(self.windowArray, function(win){win.toggleNickList()});
            },
            "change:completer": function(completer) {
                self.commandhistory.options.store = completer.store;
                if(!completer.store) self.commandhistory.clear();
                _.each(self.windowArray, function(win) {
                    win.toggleAutocomplete(completer.intrusive);
                });
            }
        });
        setNotices();

        self.setModifiableStylesheet({
            style_hue: options.hue || self.uiOptions.get("style_hue"),
            style_saturation: options.saturation || self.uiOptions.get("style_saturation"),
            style_brightness: options.brightness || self.uiOptions.get("style_brightness")
        });
        return self;
    },

    setModifiableStylesheet: function(vals) {
        this._styleSheet = new Element("style", {
                                type: "text/css",
                                media: "all"
                            }).inject(document.head);
        this.updateStylesheet(vals);
    },
    updateStylesheet: function(values) {//todo calculate all the values and just sub in
        var self = this;
        getTemplate("modifiablecss", function(template) {
            var styles = _.extend({}, Browser, self.uiOptions.toJSON(), values);
            var stylesheet = template(styles);
            var node = self._styleSheet;

            if (node.styleSheet) { /* ie */
                node.styleSheet.cssText = stylesheet;
            } else {
                node.empty()
                    .appendText(stylesheet);
            }
        });
    }
});
(function() {
var favIcons = {};
    document.store("favicon", favIcons);
    document.addEvent("domready", function() {
        var favIcon = $(document.head).getElement("link[rel^='shortcut'][rel$='icon']");
        if (favIcon) {
            favIcons.normal = favIcon;
            favIcons.empty = new Element("link", {
                rel: 'shortcut icon',
                type: 'image/x-icon',
                href: "images/empty_favicon.ico"
            });
        }
    });
// ui.NotificationUI = new Class({
//     Binds: ["beep", "flash", "cancelFlash"],

//     options: {
//         minSoundRepeatInterval: 1000,

//         notificationOptions: {//https://github.com/ttsvetko/HTML5-Desktop-Notifications
//             icon: "images/qwebircsmall.png",
//             title: "IRC Alert",
//             body: "New notification!"
//         },

//         sounds: {
//             sounds: [{
//                 id: "beep",
//                 url: ['beep3.ogg', 'beep3.mp3']
//             }]//files in sounds/
//         }/*,
//         icons: {
//             empty_favicon: "images/empty_favicon.ico"
//         }*/
//     },
//     lastSound: 0,
//     titleText: document.title,

//     initialize: function(options) {
//         this.setOptions(options);
//     },
//     beep: function() {
//         this.playSound('beep');
//     },
//     playSound: function(alias) {
//         if(!this.soundPlayer) {
//             this.soundInit();
//             this.soundPlayer.addEvent("ready", this.playSound.bind(this, alias));
//         }
//         else if (this.soundPlayer.isReady() && (Date.now() - this.lastSound > this.options.sounds.minSoundRepeatInterval)) {
//             this.lastSound = Date.now();
//             this.soundPlayer.play(alias, {
//                 volume: this.uiOptions.get("volume")
//             });
//         }
//     },
//     soundInit: function() {
//         //used to have a bunch of flash checks. going to let the sm handle it
//         if(!(this.soundPlayer instanceof sound.SoundPlayer)) {
//             this.soundPlayer = new sound.SoundPlayer(this.options.sounds);
//         }
//     },

//     flash: function(force) {
//         var self = this;
//         if ((!force && document.hasFocus()) || !favIcons.normal || self.flashing)
//             return;

//         self.titleText = document.title;

//         var flash = function() {
//             var vis = self.toggleFavIcon();
//             ui.setTitle(vis ? self.titleText : lang.activityNotice.message);
//         };

//         self.flashing = true;
//         // flashA();
//         self.__flasher = _.periodical(flash, 750);
//         window.addEvents({//whatever comes first
//             "mousedown:once": self.cancelFlash,
//             "keydown:once": self.cancelFlash,
//             "focus:once": self.cancelFlash
//         });
//     },

//     showNotice: function(options, force) {
//         var self = this;
//         if((force || !document.hasFocus()) && self.uiOptions.get("dn_state")) {
//             var opts = _.extend({/*timeout: self.uiOptions.get("dn_duration")*/}, self.options.notificationOptions, options);
//             self.__notice = notify.createNotification(opts.title, opts);
//             self.__notice.waiter = (function() { self.__notice.close(); self.__notice = null; }).delay(self.uiOptions.get("dn_duration"));
//         }
//     },

//     cancelFlash: function() {
//         this.flashing = false;

//         if(this.__flasher){
//             clearInterval(this.__flasher);
//             this.__flasher = null;
//         }

//         if(this.__notice) {
//             clearTimeout(this.__notice.waiter);
//             this.__notice.close();
//             this.__notice = null;
//         }

//         this.toggleFavIcon(true);
//         ui.setTitle(this.titleText);
//     },
//     //not sure if changing the favicon is a good idea - messes with peoples bookmarks
//     toggleFavIcon: function(state) {
//         var isNormalVis = !!favIcons.normal.getParent();
//         var vis = _.isBoolean(state) ? state : !isNormalVis;
//         if(vis && !isNormalVis) {
//             favIcons.normal.replaces(favIcons.empty);
//         }
//         else if (!vis && isNormalVis) {
//             favIcons.empty.replaces(favIcons.normal);
//         }
//         return vis;
//     }
// });

ui.INotifiers = new Class({
    Implements: [ui.IUIOptions],
    // Binds: ["beep", "flash", "cancelFlash"],
    options: {

        notificationOptions: {//https://github.com/ttsvetko/HTML5-Desktop-Notifications
            icon: "images/qwebircsmall.png",
            title: "IRC Alert",
            body: "New notification!"
        },

        sounds: {
            minSoundRepeatInterval: 1000,
            sounds: [{
                id: "beep",
                url: ['beep3.ogg', 'beep3.mp3']
            }]//files in sounds/
        }
    },
    _notices: [],
    canFlash: false,
    lastSound: 0,
    titleText: document.title,


    beep: function() {
        return this.playSound('beep');
    },
    playSound: function(alias) {
        if(!this.soundPlayer) {
            this.soundInit();
            this.soundPlayer.addEvent("ready:once", this.playSound.bind(this, alias));
        }
        else if (this.soundPlayer.isReady() && (Date.now() - this.lastSound > this.options.sounds.minSoundRepeatInterval)) {
            this.lastSound = Date.now();
            this.soundPlayer.play(alias, {
                volume: this.uiOptions.get("volume")
            });
        }
        return this;
    },
    soundInit: function() {
        //used to have a bunch of flash checks. going to let the sm handle it
        if(!(this.soundPlayer instanceof sound.SoundPlayer)) {
            this.soundPlayer = new sound.SoundPlayer(this.options.sounds);
        }
    },

    flash: function(force) {
        var self = this;
        if ((!force && document.hasFocus()) || !self.canFlash || self.flashing)
            return;

        self.titleText = document.title;

        var flash = function() {
            var vis = self.toggleFavIcon();
            ui.setTitle(vis ? self.titleText : lang.activityNotice);
        };

        self.flashing = true;
        // flashA();
        self.__flasher = _.periodical(flash, 750);
        window.addEvents({//whatever comes first
            "mousedown:once": self.cancelFlash,
            "keydown:once": self.cancelFlash,
            "focus:once": self.cancelFlash
        });
        return self;
    },

    showNotice: function(options, force) {
        var self = this;
        if((force || !document.hasFocus()) && self.uiOptions.get("dn_state")) {
            var opts = _.extend({/*timeout: self.uiOptions.get("dn_duration")*/}, self.options.notificationOptions, options);
            var notice = notify.createNotification(opts.title, opts);
            var timer = _.delay(notice.close, self.uiOptions.get("dn_duration"), notice);
            self._notices.push({
                waiter: timer,
                close: notice.close
            });
        }
        return self;
    },

    cancelFlash: function() {
        this.flashing = false;

        if(this.__flasher){
            clearInterval(this.__flasher);
            this.__flasher = null;
        }

        this._notices.each(function(notice) {
            clearTimeout(notice.waiter);
            notice.close();
        }).empty();

        this.toggleFavIcon(true);
        ui.setTitle(this.titleText);
    },
    //not sure if changing the favicon is a good idea - messes with peoples bookmarks
    toggleFavIcon: function(state) {
        var isNormalVis = !!favIcons.normal.getParent();
        var vis = _.isBoolean(state) ? state : !isNormalVis;
        if(vis && !isNormalVis) {
            favIcons.normal.replaces(favIcons.empty);
        }
        else if (!vis && isNormalVis) {
            favIcons.empty.replaces(favIcons.normal);
        }
        return vis;
    }
});
})();
ui.StandardUI = new Class({
    // Extends: ui.NotificationUI,
    Implements: [Options, ui.IIRCClient, ui.IWindows, ui.ILogin, ui.IUIOptions, ui.INotifiers],
    Binds: ["whoisURL", "updateStylesheet",
            "nextWindow", "prevWindow",
            //custom windows
            "optionsWindow", "faqWindow", "privacyWindow", "aboutWindow", "feedbackWindow", "embeddedWindow"],
    options: {
        routerPrefix: "!"//eg webchat.freenode.net#!login - valid url chars only
    },
    initialize: function(parentElement, theme, uiName, options) {
        var self = this.setOptions(options);

        document.addEvent("domready", function() {
            self.theme = theme;
            self.config();

            parentElement = self.element = self.parentElement = $(parentElement).addClasses("qwebirc", "qwebirc-" + uiName);
            self.commandhistory = new irc.CommandHistory({
                store: self.uiOptions.get("completer").store
            });
            self.windows[ui.CUSTOM_CLIENT] = self.customWindows;

            getTemplate("topPane", function(template) {
                self.outerTabs = Element.from(template()).inject(parentElement);
            });
            getTemplate("windowsPane", function(template) {
                self.windowsPanel = Element.from(template()).inject(parentElement);
            });

            self.postInitialize();
            self.fireEvent("ready");
        });
    },

    postInitialize: function() {
        var self = this,
            rprefix = self.options.routerPrefix;

        self.nav = new ui.NavBar({
            element: self.outerTabs,
            menuElement: self.element
        });
        self.nav.on({
            "selectWindow": function(e, target) {
                e.stop();
                target.retrieve('window').select();
            },
            "closeWindow": function(e, target) {
                e.stop();
                target.getParent('.tab').retrieve('window').close();
            },
            "nextWindow": self.nextWindow,
            "prevWindow": self.prevWindow
        });
        
        self.element.addEvent("click:relay(.internal)", function(e, $tar) {
            e.preventDefault();
            self.updateURI($tar.get("href"));
        });

        function checkRoute(data) {
            var request = util.unformatURL(data.request).toLowerCase();
            // if(self.options.debug) console.log("Route: %s Formatted: %s", data.request, request);

            if(self.active && request === self.active.identifier) {
                return;
            }

            switch(request) {
                case "options":
                    self.optionsWindow();
                    break;
                case "privacy":
                    self.privacyWindow();
                    break;
                case "faq":
                    self.faqWindow();
                    break;
                case "about":
                    self.aboutWindow();
                    break;
                case "embedded":
                    self.embeddedWindow();
                    break;
                case "feedback":
                    self.feedbackWindow();
                    break;
                default:
                    var win = _.findWhere(self.windowArray, {identifier:request});
                    if(win) {
                        win.select();
                    } else if(util.isChannel(request)) {
                        _.each(self.clients, function(client) {
                            client.exec("/JOIN " + request);
                        });
                    }
            }
        }

        // hasher.initialized.add(checkRoute); // parse initial hash
        // hasher.changed.add(checkRoute); //parse hash changes
        // hasher.init(); //start listening for history change
        // hasher.prependHash = "~";
        self.router = new Epitome.Router({
            onUndefined: checkRoute
        });

        return this;
    },

    updateURI: function(url) {
        url = url || this.active.identifier;
        if(this.router && (url != "login" || location.hash)) this.router.navigate(util.formatURL(url));
    },

    whoisURL: function(e, target) {
        var client = target.getParent('.window').retrieve('window').client,
            nick = target.get('data-user');
        /*if (this.uiOptions.get("query_on_nick_click")) {
            client.exec("/QUERY " + nick);
        } else {*/
        client.exec("/WHOIS " + nick);
        //}
    },

    optionsWindow: function() {
        var self = this;
        return self.addCustomWindow("Options", ui.OptionView, "options", {
            model: self.uiOptions,
            onNoticeTest: function() {
                self.flash(true);
                self.login();
                self.showNotice({}, true);
            },
            getUI: function() {
                return self;
            }
        });
    },
    embeddedWindow: function() {
        return this.addCustomWindow("Add webchat to your site", ui.EmbedWizard, "embedded-wizard");
    },
    aboutWindow: function() {
        return this.addCustomWindow("About", ui.AboutPane, "about");
    },
    privacyWindow: function() {
        return this.addCustomWindow("Privacy policy", ui.PrivacyPolicyPane, "privacypolicy");
    },
    feedbackWindow: function() {
        return this.addCustomWindow("Feedback", ui.FeedbackPane, "feedback");
    },
    faqWindow: function() {
        return this.addCustomWindow("FAQ", ui.FAQPane, "faq");
    }
});


var defaults = {
    debug: false,

    appTitle: ""/*Quake Net Web IRC*/,
    networkName: "" /* Quake Net */,

    validators: {//test is a helper from ircutils
        nick: [{
            test: test(/^[\s\S]{1,9}$/),//max 9 by spec some servers implement different rules
            description: "Nick must be between 1 and 9 characters"
        }],
        password: [{
            test: function(pass, $ele) {
                return pass.length > 0 || !$ele.isVisible();
            },
            description: "Missing password"
        }],
        username: [{
            test: function(pass, $ele) {
                return pass.length > 0 || !$ele.isVisible();
            },
            description: "Missing username"
        }]
    },
    theme: undefined,

    uiOptions: {/*see config/options.js*/},
    settings: {/*see config/settings.js*/},
    client: {/*see irc/IRCClient.js*/
        networkServices: [],//registered hosts to treat as a server admin eg ["Services.Quakenet.net"]
        // minRejoinTime: [5, 20, 300], //array - secs between consecutive joins to a single channel - see js/src/irc/ircclient@canjoinchan
        loginRegex: /I recogni[sz]e you\./,//network service response when auth successful
        node: false
    }
};

qwebirc.createInstance = function(element_id, UIclass, options) {
    options = _.merge({}, defaults, options);
    var settings = options.settings = new config.Settings({}, {
        defaults: options.settings
    });
    
    //parse query string
    // it will override any non cached (localstorage/cookie) options for uiOptions and settings
    //so ?nickname=test&style_saturation=30 will set the saturation to 30 and the initial nickname to test
    var query = window.location.search;
    if(query) {
        var parsed = query.slice(1).parseQueryString();

        if(parsed.channels) {//append query string channels to saved channels
            parsed.channels = concatUnique(settings.get("channels"), util.unformatChannelString(parsed.channels));
        }

        var softextend = function(obj) {//only sets vals if they exist on the object
            _.each(parsed, function(val, key) {
                if(_.has(obj, key)) {
                    obj[key] = +val == val ? +val : val;//coerce nums
                }
            });
        };

        softextend(options.uiOptions = _.merge({}, ui["default options"], options.uiOptions));
        softextend(options.client);
        softextend(options.settings._attributes);//poor practice
    }

    //create instance
    var instance = new UIclass(element_id, new ui.Theme(options.theme), options); //unconventional naming scheme
    instance.addEvents({
        "ready:once": function() {
            instance.loginBox();
            //cleans up old properties
            if(settings.get("newb")) {
                instance.welcome();
                settings.set("newb", false);
            } 
        },
        "login:once": function(loginopts) {
            var ircopts = _.extend({settings: settings}, options.client, loginopts);

            var client = new irc.IRCClient(ircopts);
            instance.newClient(client);
            client.writeMessages(lang.copyright);
            client.connect();
            client.addEvent("auth", function(data) {
                instance.showNotice({
                    title: 'Authenticated with network!',
                    body: util.format("{nick}: {message}", data)
                }, true);
            });
            window.onbeforeunload = function(e) {
                if (client.isConnected()) {//has gotten passed the IRC gate
                    e = e || window.event;
                    e.preventDefault = true;
                    var message = "This action will close all active IRC connections.";
                    e.returnValue = message;//legacy ie
                    return message;
                }
            };
            window.addEvent("unload", client.quit);
        }
    });

    return instance;
};


ui.QUI = new Class({
    Extends: ui.StandardUI,
    Binds: ["__createChannelMenu"],
    initialize: function(parentElement, theme, options) {
        this.Window = ui.QUI.Window;
        this.parent(parentElement, theme, "qui", options);
    },
    postInitialize: function() {
        var self = this.parent();
        self.element.addClasses('qui', 'signed-out')
            .addEvent("click:relay(.lines .hyperlink-whois)", this.whoisURL);
        self.setHotKeys();
        self.nav.on({
            "selectTab": function(e,tab) {
                self.selectTab(tab);
            },
            "detachWindow": function(e, target) {
                e.stop();
                target.getParent('.tab').retrieve('window').detach();
            },
            "addChannel": self.__createChannelMenu
        });

        return self;
    },

    selectTab: function(tab) {
        var active = this.active;
        var win = tab.retrieve("window");
        var isChannel = util.isChannelType(win.type);
        if(!active || !isChannel || (isChannel && active.name !== BROUHAHA)) {
            win.select();
        }
        if(!util.isBaseWindow(win.name) && isChannel) {//update brouhaha window attrs
            var brouhaha = this.windows.brouhaha;
            brouhaha.currentChannel = win.name;
            brouhaha.window.getElement('.channel-name').text(win.name);
            tab.addClass('selected');
        }
        tab.removeClasses("hilight-activity", "hilight-us", "hilight-speech")
            .getSiblings(".selected:not(.detached,.brouhaha)").removeClass("selected");//remove last selection
    },

    selectWindow: function(win) {
        win = this.parent(win);
        this.selectTab(win.tab);
    },

    newTab: function(win, name) {
        var self = this;
        var isBrouhaha = (name === BROUHAHA);
        var $tab = Element.from(templates.ircTab({
                'name': isBrouhaha ? '&nbsp;' : name,
                closable: !isBaseWindow(name)
            }));
        this.nav.addTab($tab);

        if(isBrouhaha) {
            $tab.addClass('brouhaha');
            _.delay(function() {
                _.some(self.windowArray, function(otherwin) {
                    if(util.isChannelType(otherwin.type) && !util.isBaseWindow(otherwin.name)) {
                        win.properties.text(otherwin.name); //update current channel in brouhaha
                        win.currentChannel = otherwin.name;
                        return true;
                    }
                });
            }, 1000);
        }

        $tab.store("window", win);

        return $tab;
    },

    hotkeys: {
        keyboard: {
            nextWindow: {
                keys: 'right',
                description: '',
                handler: function() {
                    this.scope.nextWindow();
                }
            },
            next: {
                keys: 'tab',
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
                handler: _.partial(util.wrapSelected, '.window:not(.hidden) .input .irc-input', util.getStyleByName('bold').bbcode)
            },
            italic: {
                keys: 'ctrl+i',
                description: '',
                handler: _.partial(util.wrapSelected, '.window:not(.hidden) .input .irc-input', util.getStyleByName('italic').bbcode)
            },
            underline: {
                keys: 'ctrl+u',
                description: '',
                handler: _.partial(util.wrapSelected, '.window:not(.hidden) .input .irc-input', util.getStyleByName('underline').bbcode)
            },
            colour: {
                keys: 'ctrl+c',
                description: '',
                handler: _.partial(util.wrapSelected, '.window:not(.hidden) .input .irc-input', util.getStyleByName('colour').bbcode)
            }/*,
            submitInput: {
                keys: 'enter',
                description: '',
                handler: function(e) {
                    var $tar = e.target;
                    if($tar.hasClass('irc-input'))  {
                        $tar.getParent('.window').retrieve('window').sendInput(e, $tar);
                    }
                }
            }*/
        }
    },

    setHotKeys: function () {
        if(Browser.isMobile) return;
        var self = this,
            keyboard = this.keyboard = new Keyboard({active: true}).addShortcuts(self.hotkeys.keyboard),
            inputKeyboard = new Keyboard({active: false}).addShortcuts(self.hotkeys.input);
            keyboard.scope = self;

        function isChar(code) {//http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
            return code === 32 || (code > 46 && !(code >= 91 && code <= 123) && code !== 144 && code !== 145) ;
        }

        document.addEvents({
            "blur:relay(input)": function() {
                keyboard.activate();
            },
            "focus:relay(input)": function() {
                inputKeyboard.activate();
            },
            "keydown": function(e) { // pressing 1 2 3 4 etc will change tab
                if(keyboard.isActive()) {
                    if(e.alt && !isNaN(e.key) && e.key <= self.windowArray.length) {
                        self.selectWindow(e.key - 1);
                    } else if(self.active.$input && !(e.alt||e.control||e.meta) && isChar(e.code) ) {
                        self.active.$input.focus();
                    }
                }
            }
        });
    },

    //todo use other dropdown menu code
    __createChannelMenu: function(e) {
        if(e) e.stop();
        var self = this,
            client = self.getActiveIRCWindow().client,

            $btn = self.outerTabs.getElement('.add-chan'),
            $oldmen = self.parentElement.getElement('.chanmenu.dropdownmenu');
        $oldmen = $oldmen && $oldmen.getParent();

        if(!$oldmen || Date.now() - $btn.retrieve('time') > 60000) {//getting pop channels is expensive dontif unnecc
            client.getPopularChannels(function(chans) {
                chans = _.chain(chans).take(self.options.maxChansMenu || 10)
                            .map(function(chan) {
                                return {
                                    text: chan.channel,
                                    value: chan.channel,
                                    hint: chan.users
                                };
                            })
                            .value();
                var $menu = Element.from(templates.chanmenu({
                        channels: chans
                    }));

                var wrapper = new Element('div').inject(self.parentElement)
                                                .adopt($menu);
                ui.decorateDropdown($btn, wrapper);
                wrapper.addEvent("click:relay(a)", function(e, target) {
                    var chan = target.get('data-value');
                    client.exec("/JOIN " + chan);
                });
                $btn.store('time', Date.now());//so we dont have to refresh maybe
            });
        } else if (!$oldmen.isDisplayed()) { //show old menu
            $oldmen.retrieve("toggle")();
            $oldmen.position({
                    relativeTo: $btn,
                    position: {x: 'left', y: 'bottom'},
                    edge: {x: 'left', y: 'top'}
                });
        }
    },

    newClient: function(client) {
        this.parentElement.swapClass('signed-out','signed-in');
        var status = this.parent(client);
        //load brouhaha window (b4 connecting)
        this.windows.brouhaha = this.newWindow(client, ui.WINDOW.channel, BROUHAHA);
        return status;
    },

    setWindow: function(win) {
        this.parent(win);
        win.element.show().addClass('active')
                    .getSiblings('.active:not(.detached)')
                    .hide().removeClass('active');
    },

    nickChange: function(data, client) {
        if(data.thisclient) {
            _.each(this.getWindows(client), function(win) {
                win.setNickname(data.newnick);
            });
        }
    }
});


ui.NavBar = new Class({
    Extends: Epitome.View,
    Binds: ['adjust'],
    options: {
        template: util.loadTemplate("navbar"),
        events: {
            'click:relay(.tabbar .tab)': 'selectTab',
            'dblclick:relay(.tabbar .tab)': 'selectWindow',
            'click:relay(.tabbar .tab .tab-close)': 'closeWindow',
            'click:relay(.tabbar .tab .detach)': 'detachWindow',
            'adopt:relay(.tabbar)': 'adjust',
            'disown:relay(.tabbar)': 'adjust',
            'mousewheel:relay(.tabbar)': 'scrollTabs',

            'click:relay(.main-menu a)': 'openMenu',
            'click:relay(.buttons .to-left)': 'scrollLeft',
            'click:relay(.buttons .to-right)': 'scrollRight',
            'click:relay(.buttons .add-chan)': 'addChannel'
        },
        onReady: function() {
            this.render();
            window.addEvent('resize', this.adjust);
            this.tabs.addEvent('adopt', this.adjust);
        },
        onScrollTabs: function(evt) {
            evt.stop();
            if (evt.wheel > 0) {//mwup
                this.nextWindow();
            } else if (evt.wheel < 0) {
                this.prevWindow();
            }
        }
    },
    render: function() {
        Elements.from(this.template({lang: lang})).filter(Type.isElement)//strip random text nodes
                                                .inject(this.element);
        this.tabs = this.element.getElement('.tabbar');
        this.scroller = new Fx.Scroll(this.tabs);
        this.adjust();

        var self = this,
            dropdownMenu = Element.from(templates.mainmenu({
                lang: lang
            })).inject(self.options.menuElement);

        var dropdownbtn = this.element.getElement('.main-menu');

        ui.decorateDropdown(dropdownbtn, dropdownMenu, {
            onShow: function() {
                if(self.hideHint)
                    self.hideHint();
                delete self.hideHint;
            },
            btnlistener: true,
            autohide: true
        });

        var dropdownEffect = new Fx.Tween(dropdownbtn, {
            duration: "long",
            property: "opacity",
            link: "chain"
        });
        var dropdownhint = Element.from(templates.dropdownhint())
                    .inject(this.element)
                    .position({
                        relativeTo: this.element,
                        position: {'y': 'bottom'},
                        offset: {y:10}
                    });

        dropdownEffect.start(0.25)
                    .start(1)
                    .start(0.33)
                    .start(1);

        new Fx.Morph(dropdownhint, {
            duration: "normal",
            transition: Fx.Transitions.Sine.easeOut
        }).start({
            left: [900, 5]
        });

        (function() {
            new Fx.Morph(dropdownhint, {
                duration: "long"
            }).start({
                left: [5, -900]
            });
        }).delay(4000);

        var hider2 = _.once(_.partial(Element.destroy, dropdownhint));

        _.delay(hider2, 4000);

        document.addEvents({
            "mousedown:once": hider2,
            "keydown:once": hider2
        });
    },

    adjust: function() {
        var wid = this.tabs.getWidth(),
            swid = this.tabs.getScrollWidth(),
            scrollers = this.element.getElements('[name="tabscroll"]');

        if(swid > wid) {
            scrollers.show();
        }
        else {
            scrollers.hide();
        }

        util.fillContainer(this.tabs, {style: 'max-width'});
    },

    addTab: function(tab) {
        if(_.isString(tab)) tab = Element.from(tab);
        this.tabs.adopt(tab);
        return this;
    },

    removeTab: function(tab) {
        this.tabs.disown(tab);
        return this;
    },

    toggleTab: function(tab, state) {
        this.tabs.getElement(tab).toggle(state);
        return this;
    },

    scrollLeft: function(e, target) {
        e.stop();
        var pos = this.tabs.getScrollLeft(),
            $ele = util.elementAtScrollPos(this.tabs, pos);

        this.scroller.toElement($ele, 'x');
    },
    scrollRight: function(e) {
        e.stop();
        var pos = this.tabs.getScrollLeft() + this.tabs.getWidth(),
            $ele = util.elementAtScrollPos(this.tabs, pos);

        this.scroller.toElementEdge($ele, 'x');
    },
    nextWindow: function() {
        this.trigger('nextWindow');
    },
    prevWindow: function() {
        this.trigger('prevWindow');
    },
    destroy: function() {
        window.removeEvent('resize', this.adjust);
        return this.parent();
    }

});


(function() {
    function checkKeys(fn, keys, type) {//or just use pseudos.keys
        keys = keys || [];
        var ret = {};
        ret[type || "keydown"] = function(e) {
            if(keys.contains(e.key)) {
                fn.apply(this, arguments);
            }
        };
        return ret;
    }

//http://anutron.github.io/mootools-bootstrap/#modals - changed closeOnEsc to closeOnKeys using Element.psuedo.keys
ui.Dialog = new Class({
    Extends: Bootstrap.Popup,
    options: {//mainly defaults
        popup_template: "popup-dialog",
        template: null,
        persist: false,
        closeOnEsc: 'esc',
        closeOnClickOut: false,
        focusOnShow: "input[type='text']",
        inputType: "input[type='text'",
        title: lang.alertNotice
    },
    initialize: function(options) {
        var self = this,
            $par = $(options.parent || document.body),
            $caller = self.$caller;
        options = self.setOptions(options).options;

        getTemplate(options.popup_template, function(popuptmpl) {
            if(options.template) {//expected to be loaded
                options.content = options.template(options);
            }
            var $pop = Element.from(popuptmpl(options));
            $par.adopt($pop);
            self.$caller = $caller;
            self.parent($pop, options);
            self.bound.submit = function() {
                var vals = self.$input.val();
                self.fireEvent("submit", {
                    value: vals[0],
                    values: vals
                });
                self.hide();
            };
            self.$input = $pop.getElements(options.inputType);
            $pop.addEvent("click:relay(.submit)", self.bound.submit);
            var listen = self.$listeners = checkKeys(self.bound.submit, ['enter']);
            document.addEvents(listen);
            ui.Behaviour.apply($pop);
        });
    },
    hide: function(evt, clicked) {
        if(evt) evt.stopPropagation();
        document.removeEvents(this.$listeners);
        return this.parent(evt, clicked);
    }
});

ui.Alert = new Class({
    Extends: Bootstrap.Popup,
    options: {
        popup_template: "popup-alert",
        persist: false,
        closeOnKeys: 'esc,enter',
        closeOnClickOut: true,
        focusOnShow: '[data-dismiss="modal"]',
        title: lang.alertNotice,
        text: ''
    },
    initialize: function(options) {
        var self = this,
            $par = $(options.parent || document.body),
            $caller = self.$caller;//dirty hack for async
        options = self.setOptions(options).options;

        if(!options.text) {
            throw "needs text";
        }

        getTemplate(options.popup_template, function(popuptmpl) {
            var $pop = Element.from(popuptmpl(options));
            $par.adopt($pop);
            self.$caller = $caller;
            self.parent($pop, options);
            var listen = self.$listeners = checkKeys(self.bound.hide, ['enter']);
            document.addEvents(listen);
            ui.Behaviour.apply($pop);
        });
    },
    hide: function(evt, clicked) {
        if(evt) evt.stopPropagation();
        document.removeEvents(this.$listeners);
        this.fireEvent("hide");
        return this.parent(evt, clicked);
    }
});

})();


//http://indiegamr.com/the-state-of-audio-in-html5-games/

sound.SoundPlayer = new Class({
    Implements: [Options, Events],
    options: {
        soundManagersrc: "//cdn.jsdelivr.net/soundmanager2/2.97a.20130512/soundmanager2-nodebug-jsmin.js",
        soundsurl: "/sound/",//directory of sounds for sm
        swfurl: "/swf",
        flashVersion: 8,
        sounds: [],
        preferFlash: false//use html5 if possible
    },
    loadingSM: false,

    initialize: function(options) {
        this.setOptions(options);
        var self = this,
            opts = this.options;

        window.addEvent("domready", function() {//load soundmanager ->
            if (self.loadingSM !== false)
                return;
            self.loadingSM = true;
            if ($defined(self.sm)) {
                self.fireEvent("ready");
                return;
            }

            var soundinit = function() {
                var sm = self.sm = window.soundManager;
                //https://www.scirra.com/blog/44/on-html5-audio-formats-aac-and-ogg
                sm.setup({
                    url: opts.swfurl,
                    preferFlash: opts.preferFlash,
                    onready: function() {
                        _.each(opts.sounds, function(sound) {//load all sounds here
                            // self.register(sound.id, opts.soundsurl + sound.url + extension);
                            sound = _.clone(sound);
                            sound.url = _.map(sound.url, function(path) {
                                return path.contains('/') ? path : opts.soundsurl + path;
                            });
                            self.sm.createSound(sound);
                        })
                        self.loadingSM = false;
                        self.fireEvent("ready");
                    }
                }).beginDelayedInit();
                self.play = sm.play;
            };

            //load sound manager
            if(window.soundManager) {
                soundinit();
            }
            else {
                Asset.javascript(opts.soundManagersrc, {onLoad: soundinit});
            }
        });
    },
    register: function(alias,src) {
        this.sm.createSound(alias, src);
    },

    isReady: function() {
        return this.sm && this.loadingSM === false;
    }
});


ui.Theme = new Class({
    initialize: function(themeDict) {
        var self = this,
            defaults = _.extend({}, config.ThemeIRCTemplates, themeDict);
        
        var thememap = _.map(config.ThemeControlCodeMap, function(str) {
            return util.formatSafe(str, config.ThemeControlCodeMap);
        });
        self.__theme = _.map(defaults, function(str) {
            return util.formatSafe(str, thememap);
        });

        self.highlightClasses.channels = {};
        self.config = config;
    },

    //I'm under the assumption i dont need to strip tags as handlebars should escape them for me
    formatMessage: function($ele, type, _data, highlight) {
        var self = this,
            isobj = _.isObject(_data),
            data = isobj ? _.clone(_data) : _data; //sometimes an internal reference

        if(isobj) {
            if (_.has(data, "n")) {
                //works slightly harder than it has too :/
                data.N = templates.userlink(data);
                data.nicktmpl = templates.ircnick(data);
            }
            //now all we have to do is format the data as desired and pass to theme
            _.each(["m", "c"], function(key) {//urlerize message and nick
                var val = data[key];
                if(val) {
                    if(_.isArray(val)) { //modes are given as an array so we need to fold
                        val = val.join("");
                    }
                    data[key] = self.urlerize(val);
                }
            });
        }


        var themed = type ? self.formatText(type, data, highlight) : data;
        var result = self.colourise(themed);
        var timestamp = self.config && self.config.get("show_timestamps") ? templates.timestamp({time:util.IRCTimestamp(new Date())}) : "";
        $ele.addClass('colourline')
            .insertAdjacentHTML('beforeend', timestamp + result);//insertAdjacentHTML may render escaped chars incorrectly
        return result;
    },

    formatTopic: function(topic, $ele) {
        var result = this.colourise(this.urlerize(topic));
        $ele.addClass('colourline')
            .adopt(Elements.from(templates.topicText({
                title: topic,
                topic: result
            })));
        return result;
    },

    formatText: function(type, data, highlight) {
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

    messageParsers: [],

    highlightClasses: ['highlight1', 'highlight2'/*, 'highlight3'*/],

    highlightAndNotice: function(data, type, win, $ele) {
        var self = this,
            tabHighlight = ui.HIGHLIGHT.none,
            highlights = self.highlightClasses,
            nick = win.client.nickname,
            notus = data.n !== nick;

        if(data && type && /(NOTICE|ACTION|MSG)$/.test(type)) {
            if(data.m) {
                $ele.addClass('message');
            }
            _.each( self.messageParsers , function(parser) {
                //sorry little crazy :)
                if( (!parser.notus || notus) &&//implications - organized them by complexity
                    (!parser.types || parser.types.contains(win.type)) &&
                    (!parser.type || parser.type.test(type)) &&
                    (!parser.msg || parser.msg.test(data.m)) &&
                    (!parser.nick || parser.nick.test(data.n)) &&
                    (!parser.mentioned || util.testForNick(nick, data.m)) )
                {
                    if((!win.active && win.name !== BROUHAHA) || (!document.hasFocus()) ) {
                        if(parser.flash) {
                            win.parentObject.flash();
                        }
                        if(parser.beep) {
                            win.parentObject.beep();
                        }
                        if(parser.pm) {
                            win.parentObject.showNotice({
                                title: 'IRC ' + type + '!',
                                body: util.format("{nick}({channel}): {message}", data)
                            });
                        }
                    }   
                    if(parser.highlight) {
                        if(!highlights.channels[win.name]) highlights.channels[win.name] = 0;
                        $ele.addClass(_.isBoolean(parser.highlight) ? _.nextItem(highlights, highlights.channels[win.name]++, 1) : parser.highlight);
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


ui.Window = new Class({
    Extends: Epitome.View,
    Binds: ["sendInput"],
    options: {
        events: {

        },

        onReady: function() {
            this.render();
        },
        maxLines: 1000
    },
    template: util.loadTemplate('window'),

    active: false,
    closed: false,
    highlight: ui.HIGHLIGHT.none,
    lastNickHash: {},

    initialize: function(parentObject, $par, client, type, name, identifier) {
        this.parentObject = parentObject;
        this.type = type;
        this.currentChannel = this.name = name;
        this.client = client;
        this.identifier = identifier;
        this.history = this.parentObject.commandhistory;
        this.parent({
            element: $par
        });
    },

    isActive: function() {
        return this.element.hasClass("active");
    },

    getOption: function(option) {
        return this.parentObject.uiOptions.get(option);
    },

    close: function() {
        this.closed = true;
        this.parentObject.__closed(this);
        this.destroy();
        return this;
    },

    select: function() {
        if(this.active || this.closed) return;
        this.active = true;
        this.parentObject.selectWindow(this);
        if (this.highlight)
            this.highlightTab(ui.HIGHLIGHT.none);

        this.fireEvent("selected");
    },

    deselect: function() {
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
            parent = self.parentObject;
        var highlight =  this.name !== BROUHAHA ? parent.theme.highlightAndNotice(data, type, self, $ele) : ui.HIGHLIGHT.none,
            hl_line = false;

        if (!self.active && (highlight !== ui.HIGHLIGHT.none)) {
            self.highlightTab(highlight);
        }

        var formatted = parent.theme.formatMessage($ele, type, data, hl_line);
        self.lines.adopt($ele)
                .maxChildren(this.options.maxLines);//remove lines if > maxLines

        if(self.getOption("lastpos_line") && type.endsWith("CHANMSG")) {
            this.lastLine = (this.lastLine || Element.from(templates.messageLine())).inject(this.lines);
        }
    },
    errorMessage: function(message) {
        this.addLine("", message, "warn");
    },
    infoMessage: function(message) {
        this.addLine("", message, "info");
    },
    highlightTab: function(state) {
        if (state == ui.HIGHLIGHT.none || state >= this.highlight) {
            this.highlight = state;
        }
    },

    sendInput: function(e/*, $tar*/) {
        if(e) e.stop();
        // if(!$tar || !$tar.hasClass('input-field')) {
        var $tar = this.$input;
        //}
        var unparsed = $tar.val(),
            parsed = util.inputParser.parse(unparsed);
        if (parsed !== "") {
            this.history.addLine(this.name, unparsed || parsed);
            this.client.exec(parsed, this.currentChannel);
            $tar.val("");
        }
        $tar.blur();//in case a new channel is created
    }
});


//mae view and qui and controller
ui.QUI.Window = new Class({
    Extends: ui.Window,
    Binds: ['close'],
    options: {
        events: {
            // 'click:relay(.input .send)': 'sendInput',
            'dblclick:relay(.input .nickname)': 'setNickname',
            'dblclick:relay(.topic)': 'editTopic',

            'contextmenu:relay(.lines .nick)': 'nickLinesMenu',
            'click:relay(.nick-menu li)': 'menuClick',

            'click:relay(.nicklist .user .nick)': 'nickListMenu',

            'click:relay(.detached-window .attach)': 'attach',
            'click:relay(.detached-window .tab-close)': 'close',

            'click': 'setActive'
        }
    },

    detached: false,

    initialize: function(parentObject, $par, client, type, name, identifier) {
        var self = this;
        self.parent.apply(self, arguments);

        self.tab = parentObject.newTab(self, name);

        self.nicksColoured = self.getOption("nick_colours");
    },

    render: function() {
        var self = this;
        var type = self.type;
        var hasInput = util.windowNeedsInput(type);
        self.element.empty()
            .html(self.template({
                mobile: Browser.isMobile,
                isChannel: util.isChannelType(self.type),
                channel: self.name,
                name: self.name,
                id: self.name.clean().replace(" ", "-"),
                topic: false,
                needsInput: hasInput,
                nick: self.client ? self.client.nickname : ""/*,
                splitPane: false//feature in development having issue with resizes {{link to repo}}*/
            }));
        var $win = self.window = self.element.getElement('.window').store("window", self);

        var $content = self.content = $win.getElement('.content');
        var lines = self.lines = $content.getElement('.lines');
        lines.store("window", self);

        if (type === ui.WINDOW.channel) {
            $win.addClass('channel');
            self.toggleNickList();
            self.updateTopic("");
        }

        if(hasInput) {
            $win.addClass('ircwindow');
            self.fxscroll = new Fx.AutoScroll(lines, {
                start: false
            });
            self.$input = $win.getElement('.input .irc-input');

            $win.getElement('form')
                .addEvent("submit", self.sendInput);
        }
        return self;
    },

    close: function(e) {
        if(e) e.stop();
        if (this.closed) return;

        if (util.isChannelType(this.type) && !util.isBaseWindow(this.name)) {
            this.client.exec("/PART " + this.name);
        }

        if(this.fxscroll)
            this.fxscroll.stop();
        if(this.resizable)
            this.resizable.detach().stop();
        if(this.drag)
            this.drag.detach().stop();
        if(this.completer)
            this.completer.detach();

        return this.parent();
    },

    attach: function(e) {
        this.detached = false;
        this.element.removeClass('detached');

        this.window.replaces(this.wrapper);
        this.wrapper.destroy();

        this.drag.detach().stop();
        this.resizable.detach().stop();
        this.wrapper = this.resizable = this.drag = null;

        this.parentObject.nav.toggleTab(this.tab.removeClass('detached'), true);
        this.select();

        this.fireEvent('attached');
    },

    detach: function(e) {
        var self = this,
            win = self.window,
            po = self.parentObject,

            wrapper = self.wrapper = Element.from(templates.detachedWindow({
                                                    'channel': this.name,
                                                    'base': util.isBaseWindow(this.name)
                                                })),
            header = wrapper.getElement('.header'),

            // resizeWrapper = Element.from(templates.resizeHandle()),
            // resizeHandle = resizeWrapper.getElement('.resize-handle');
            resizeHandle = wrapper.getElement('.resize-handle');
        self.element.addClass('detached');

        var size = util.percentToPixel({x:40, y:60}, win.getParent('qwebirc'));
        wrapper.setStyles({
                "width": size.x,
                "height": size.y
            })
            .replaces(win); //*** adds wrapper to dom;
        win.show()
            .addEvent("mousedown", function(e) {
                var tag = e.target.tagName.toLowerCase();
                if(!(tag == "div" || tag == "form"))//prevent dragging if not on container
                    e.stopPropagation();
            })
            .replaces(wrapper.getElement('.content'));

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

        /*** update windows and center detached window ****/
        if(self.active) po.nextWindow();//change window if we're active
        self.detached = true;
        _.defer(function() {
            self.setActive();
            self._selectUpdates();
            wrapper.position();
        });

        //keeps order
        po.nav.toggleTab(self.tab.addClass('detached'), false);
        self.fireEvent('detached');
    },

    setActive: _.throttle(function(e) {//sets this window as the most active
        // if(!this.element.hasClass('active')) {
        this.element.addClass('active')
                .getSiblings('.active').removeClass('active');
        // }
    }, 1000, true),

    select: function() {//change window elements
        if(this.active || this.closed) return;
        this.parent();

        this.tab.addClass("selected");
        this._selectUpdates();
        this.setActive();
        this.fireEvent("selected");
    },


    deselect: function() {
        if(this.active && !this.detached) {
            this.tab.removeClasses("selected");
            if(this.fxscroll) this.fxscroll.stop();//save a couple resources
            this.parent();
        }
    },

    //styles and ui things to update
    _selectUpdates: function() {
        var self = this,
            parentObject = self.parentObject;

        if(self.fxscroll) {//scroll to bottom
            self.fxscroll.start();
        }
        if(!self.completer && self.type === ui.WINDOW.channel) {
            self.completer = new Completer(self.window.getElement('.input .tt-ahead'), self.history.get(self.name), {
                autocomplete: self.getOption("completer").intrusive
            });
            self.completer.$hint.addClass('decorated');
            self.$input.removeClass('decorated');
        }

        if(util.isChannelType(self.type)) {
            var colour = self.getOption("nick_colours");
            if (self.nicksColoured !== colour) {
                self.nicksColoured = colour;
                var nodes = self.nicklist.childNodes;
                if (colour) {
                    _.each(nodes, function(node) {
                        var colour = util.toHSBColour(node.get("data-nick"), self.client);
                        if ($defined(colour))
                            node.firstChild.setStyle("color", colour.rgbToHex());
                    });
                } else {
                    _.each(nodes, function(node) {
                        node.firstChild.setStyle("color", null);
                    });
                }
            }
            _.delay(self.updatePrefix, 1000, self);//takes a little while to recieve on some servers
        }

    },

    __dirtyFixes: function() {
        if(this.completer) this.completer.update(); //ugly but necessary to resize the completer hover box
    },

    editTopic: function() {
        var self = this;
        if (!self.client.nickOnChanHasPrefix(self.client.nickname, self.name, OPSTATUS)) {
            new ui.Alert({
                text: lang.changeTopicNeedsOp
            });
        } else {
            new ui.Dialog({
                title: "Set Topic",
                text: util.format(lang.changeTopicConfirm, {channel: self.name}),
                placeholder: this.window.getElement('.topic').text(),
                onSubmit: function(data) {
                    if (_.isString(data.value)) {
                        self.client.exec("/TOPIC " + self.name + " " + data.value, self.name);
                    }
                }
            });
        }
    },

    setNickname: function(nick) {
        var self = this;
        if(_.isString(nick)) {
            var $nick = self.window.getElement('.input .user .nickname');
            if($nick) {
                $nick.text(nick);
                self.__dirtyFixes();
            }
        } else {
            new ui.Dialog({
                title: "Set nickname",
                text: "Enter a new nickname",
                placeholder: self.nickname,
                onSubmit: function(data) {
                    var nick = qwebirc.global.nicknameValidator.validate(data.value);
                    if(nick) {
                        self.client.exec("/nick " + nick);
                    }
                }
            });
        }
    },

    updatePrefix: function (data) {
        if(data && (!data.thisclient || data.channel !== this.name)) return;
        var prefix = data ? data.prefix : this.client.getNickStatus(this.name, this.client.nickname);
        this.window.getElements('.input .user .status')
                    .removeClasses('op', 'voice')
                    .addClass((prefix === OPSTATUS) ? "op" : (prefix === VOICESTATUS) ? "voice" : "");
        this.__dirtyFixes();
    },

    createNickMenu: function(nick, $par, options) {
        var $menu = $par.getElement('.nick-menu'),
            self = this;

        if($menu) {
            $menu.toggle();
        } else {
            var _nick = self.client.nickname,
                _chan = self.name;
            $menu = Element.from(templates.nickMenu(_.extend({
                nick: nick,
                channel: _chan,
                weOped: self.client.nickOnChanHasAtLeastPrefix(_nick, _chan, OPSTATUS),
                // weVoiced: self.client.nickOnChanHasPrefix(_nick, _chan, VOICESTATUS),
                notus: _nick !== nick,
                theyOped: self.client.nickOnChanHasPrefix(nick, _chan, OPSTATUS),
                theyVoiced: self.client.nickOnChanHasPrefix(nick, _chan, VOICESTATUS),

                lang: lang
            }, options))).inject($par);
            _.defer(function() {
                document.addEvent("click:once", function() {
                    $menu.dispose();
                    if(options.close) options.close();
                });
            });
        }
        return $menu;
    },

    nickLinesMenu: function(evt, $tar) {
        evt.stop();
        var $menu = this.createNickMenu($tar.get("data-user"), this.window, {showNick: true});
        $menu.addClass("dropdownmenu")
            .setPosition(evt.client);
    },

    nickListMenu: function(evt, $tar) { //delegation to nick items
        var $par = $tar.getParent('.user').toggleClass("selected");
        var $menu = this.createNickMenu($par.get('data-user'), $par, {close: function() {$par.removeClass("selected")}});
    },

    menuClick: function(e, $tar) {
        var action = $tar.get("data-exec");
        this.client.exec(action, this.name);
    },

    updateTopic: function(topic) {
        var $topic = this.window.getElement('.topic').empty();
        if (topic) {
            this.parentObject.theme.formatTopic(topic, $topic);
        } else {
            $topic.html(templates.topicText({topic: lang.noTopic, empty:true}));
        }
    },

    addLine: function(type, data, colourClass) {
        var $msg = Element.from(templates.ircMessage({ type: type.hyphenate().replace(" ", "-") }));

        if(colourClass)
            $msg.addClass(colourClass);
        if(data.colourClass)
            $msg.addClass(data.colourClass);

        this.parent(type.toUpperCase(), data, colourClass, $msg);
    },
    highlightTab: function(state) {
        if (state != this.highlight) {
            this.tab.removeClasses("hilight-activity", "hilight-us", "hilight-speech");

            switch (state) {
            case ui.HIGHLIGHT.us:
                this.tab.addClass("hilight-us");
                break;
            case ui.HIGHLIGHT.speech:
                this.tab.addClass("hilight-speech");
                break;
            case ui.HIGHLIGHT.activity:
                this.tab.addClass("hilight-activity");
                break;
            }
            this.parent(state);
        }
    },

    getNickList: function() {
        if(!this.nicklist && this.getOption('show_nicklist')) {
            this.nicklist = this.window.getElement('.rightpanel')
                                    .addClass("nicklist");
        }
        return this.nicklist;
    },

    toggleAutocomplete: function(state) {
        if(this.completer) {
            state = !!state;
            this.completer.toggleAutocomplete(state);

            this.completer.$hint.toggleClass('decorated', state);
            this.$input.toggleClass('decorated', !state);
        }
    },

    toggleNickList: function(state) { //returns this
        if(this.type === ui.WINDOW.channel) {
            state = state != null ? !!state : this.getOption('show_nicklist');
            var nicklist = this.getNickList();
            nicklist && nicklist.toggle(state) && this.window.toggleClass('show-nicklist', state);
        }
    },

    //holy shit i got this to actually make sense
    // takes nicks (sorted array)
    updateNickList: function(nicklist) {
        var self = this;
        if(!self.nicklist) return false;
        var lnh = self.lastNickHash,
            nicks = []; //users who left

        //used to just take the difference and then do an each on that but changes to the array made it nec to do it like this for efficency
        nicklist.each(function(nickobj, index) {
            var nick = nickobj.nick;
            var old = lnh[nick];
            nicks.push(nick);

            if(!old || old.prefix !== nickobj.prefix) {
                if(old && old.element) old.element.dispose();//or update it jeez
                lnh[nick] = self.nickListAdd(nickobj, index);
            }
        });

        _.each(_.difference(_.keys(lnh), nicks), function(nick) {
            lnh[nick].element.dispose();
            delete lnh[nick];
        });
    },

    nickListAdd: function(nickobj, position) {
        var nickele = Element.from(templates.nickbtn(nickobj));
        var span = nickele.getElement('span');

        if (this.getOption("nick_colours")) {
            var colour = util.toHSBColour(nickobj.nick, this.client);
            if ($defined(colour))
                span.setStyle("color", colour.rgbToHex());
        }

        this.nicklist.insertAt(nickele, position);

        return _.extend({
            element: nickele
        }, nickobj);
    }
});


(function() {
//class to be inheritted
var PanelView = new Class({
    Extends: Epitome.View,
    options: {
        pane: '',

        events: {
            'click:relay([data-event="close"])': '_close'
        },

        onReady: function() {
            return this.render();
        }
    },

    getData: function() {
        return this.model && this.model.toJSON() || this.options && this.options.data || {};
    },

    render: function() {
        var self = this.empty();
        var pane = self.options.pane;
        var $loader = Element.from(templates.loadingPage()).inject(self.element);

        getTemplate(pane, function(template) {
            var eles = Elements.from(template(self.getData()));
            self.element.adopt(eles);//not inject because it can have text nodes
            $loader.dispose();
            self.postRender();
        });
        return self.parent();
    },

    postRender: function() {
        ui.Behaviour.apply(this.element);
        return this;
    },

    empty: function() {
        return this.parent(true);
    },

    _close: function() {
        this.trigger('close');
        return this.destroy();
    }
});
function toggleNotifications(model, state, save) {
    if(notify.permissionLevel() !== notify.PERMISSION_GRANTED) {
        notify.requestPermission(function() {
            toggleNotifications(model, notify.permissionLevel() === notify.PERMISSION_GRANTED, save);
        });
    }
    else {
        model.set('dn_state', state != null ? !!state : !model.get('dn_state'));
    }
    if(save) model.save();
}
ui.PrivacyPolicyPane = new Class({
    Extends: PanelView,
    options: {
        pane: 'privacypolicy'
    }
});
ui.AboutPane = new Class({
    Extends: PanelView,
    options: {
        pane: 'about',
        data: {
            version: qwebirc.VERSION
        }
    }
});
ui.FAQPane = new Class({
    Extends: PanelView,
    options: {
        pane: 'faq'
    }
});
ui.FeedbackPane = new Class({
    Extends: PanelView,
    options: {
        pane: 'feedback'
    }
});

ui.OptionView = new Class({
    Extends: PanelView,
    Binds: ['save', 'reset'],
    options: {
        pane: 'options',
        events: {
            'change:relay(#options input)': 'inputChange',
            'change:relay(#options .notice-group input)': 'noticeChange',
            'click:relay(#options #add-notice)': 'addNotifier',
            'click:relay(#options .remove-notice)': 'removeNotifier',
            'click:relay(#options #dn_state)': 'dnToggle',
            'click:relay(#options #notice-test)': 'noticeTest'
        },
        
        onDnToggle: function(e, target) {
            toggleNotifications(this.model);
            target.val(this.model.get('dn_state') ? lang.DISABLE : lang.ENABLE);
        },

        onReady: function() {
            return this.render();
        }

        //get ui
    },

    /*********LISTENERS**************/

    inputChange: function(e, target) {//set model values when inputs are clicked
        var id = target.get('id');

        //handle sub props
        if(id && $defined(this.model.get(id))) {
            this.model.set(id, target.val());
        }
    },

    addNotifier: function(data) {
        if(!data || Type.isDOMEvent(data)) {
            data = this.model.defaultNotice();
            var n = _.clone(this.model.get("custom_notices"));
            n.push(data);
            this.model.set("custom_notices", n);
        }

        var $addbtn = this.element.getElement('#add-notice'/*'#custom_notices .panel-body'*/);

        var _data = _.clone(data);
        _data.lang = lang;

        var temp = templates.customNotice(_data);

        $addbtn.insertAdjacentHTML('beforebegin', temp);//insert before btn
    },

    removeNotifier: function(e, target) {
        e.stop();
        var type = target.getParent('.notice-group').id;
        var par = target.getParent('.controls').dispose();
        var id = par.get("data-id");
        this.model.set('custom_notices', (_.reject(this.model.get(type), function(xs) {return xs.id === id})));
    },

    noticeChange: function(e, target) {
        e.stop();
        var type = target.getParent('.notice-group').id;
        var notices = _.clone(this.model.get(type));
        var par = target.getParent('.controls');
        var notice = _.findWhere(notices, {id: par.get("data-id")});
        notice[target.get('data-id')] = target.val();
        this.model.set('custom_notices', notices);
    },
    /*********LISTENERS**************/

    postRender: function() {
        var model = this.model,
            options = this.options;

        // _.each(model.get("custom_notices"), function(notice) {
        //     notice.lang = lang;
        //     this.addNotifier(notice);
        // }, this);

        this.element.getElements(".slider").each(function(slider) {
            var id = slider.get('id'),
                knob = slider.getElement('.knob');
                new Slider(slider, knob, {
                    steps: 36,
                    range: [0, 369],
                    wheel: true
                }).addEvent("change", function(val) {
                    model.set(id, val);
                })
                .set(model.get(id));
        });

        this.element.getElement('#options').addEvents({ //default will fire before bubble
            'submit': this.save,
            'reset': this.reset
        });

        if(_.isFunction(options.getUI)) {
            ui.WelcomePane.show(options.getUI(), {
                element: this.element
            });
        }

        return this.parent();
    },

    getData: function() {
        var data = this.model.toJSON();
        // data.lang = lang;
        return data;
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
ui.WelcomePane = new Class({
    Extends: PanelView,
    options: {
        pane: 'welcome-pane',
        events: {
            'click:relay(.enable-notifications)': 'enableNotifications',
            'click:relay(.controls)': 'controlClick'
        },
        onEnableNotifications: function() {
            toggleNotifications(this.ui.uiOptions2, true, true);
        },
        onControlClick: function(e, controls) {
            controls.dispose();
            if(!this.element.getElement('.controls')) this._close();
        }
    },
    initialize: function(ui, options) {
        this.ui = ui;
        this.parent(options);
    },
    getData: function() {
        return _.extend({}, this.options, {
            Browser: window.Browser
        });
    }
})
.extend({
    show: function(_ui, options) {//determines if needs to be shown and shows
        if(options.firstvisit || notify.permissionLevel() !== notify.PERMISSION_GRANTED) {
            options.element = new Element("div.welcome").inject(options.element);
            return new ui.WelcomePane(_ui, options);
        }
        return false;
    }
});
ui.EmbedWizard = new Class({
    Extends: PanelView,
    options: {
        pane: 'wizard'
    }
});
})();

//close the iife and call with this
    return qwebirc;
})(window, Epitome);
