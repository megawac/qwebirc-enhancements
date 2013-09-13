/*!
qwebirc WebIRC client ::: Version 0.93.11 :::
Built on 2013-09-13
Description: webirc client - See qwebirc.org
Authors: Graeme Yeates (www.github.com/megawac)
Repository: www.github.com/megawac/qwebirc-enhancements

This project is a form of qwebirc (www.qwebirc.org) by Chris Porter


Licence: GNU - http://www.gnu.org/licenses/gpl.html
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
MooTools.More = {
    version: "1.4.0.1",
    build: "a4244edf2aa97ac8a196fc96082dd35af1abab87"
}, Class.refactor = function(original, refactors) {
    return Object.each(refactors, function(item, name) {
        var origin = original.prototype[name];
        origin = origin && origin.$origin || origin || function() {}, original.implement(name, "function" == typeof item ? function() {
            var old = this.previous;
            this.previous = origin;
            var value = item.apply(this, arguments);
            return this.previous = old, value;
        } : item);
    }), original;
}, Class.Mutators.Binds = function(binds) {
    return this.prototype.initialize || this.implement("initialize", function() {}), 
    Array.from(binds).concat(this.prototype.Binds || []);
}, Class.Mutators.initialize = function(initialize) {
    return function() {
        return Array.from(this.Binds).each(function(name) {
            var original = this[name];
            original && (this[name] = original.bind(this));
        }, this), initialize.apply(this, arguments);
    };
}, function() {
    var special = {
        a: /[àáâãäåăą]/g,
        A: /[ÀÁÂÃÄÅĂĄ]/g,
        c: /[ćčç]/g,
        C: /[ĆČÇ]/g,
        d: /[ďđ]/g,
        D: /[ĎÐ]/g,
        e: /[èéêëěę]/g,
        E: /[ÈÉÊËĚĘ]/g,
        g: /[ğ]/g,
        G: /[Ğ]/g,
        i: /[ìíîï]/g,
        I: /[ÌÍÎÏ]/g,
        l: /[ĺľł]/g,
        L: /[ĹĽŁ]/g,
        n: /[ñňń]/g,
        N: /[ÑŇŃ]/g,
        o: /[òóôõöøő]/g,
        O: /[ÒÓÔÕÖØ]/g,
        r: /[řŕ]/g,
        R: /[ŘŔ]/g,
        s: /[ššş]/g,
        S: /[ŠŞŚ]/g,
        t: /[ťţ]/g,
        T: /[ŤŢ]/g,
        ue: /[ü]/g,
        UE: /[Ü]/g,
        u: /[ùúûůµ]/g,
        U: /[ÙÚÛŮ]/g,
        y: /[ÿý]/g,
        Y: /[ŸÝ]/g,
        z: /[žźż]/g,
        Z: /[ŽŹŻ]/g,
        th: /[þ]/g,
        TH: /[Þ]/g,
        dh: /[ð]/g,
        DH: /[Ð]/g,
        ss: /[ß]/g,
        oe: /[œ]/g,
        OE: /[Œ]/g,
        ae: /[æ]/g,
        AE: /[Æ]/g
    }, tidy = {
        " ": /[\xa0\u2002\u2003\u2009]/g,
        "*": /[\xb7]/g,
        "'": /[\u2018\u2019]/g,
        '"': /[\u201c\u201d]/g,
        "...": /[\u2026]/g,
        "-": /[\u2013]/g,
        "&raquo;": /[\uFFFD]/g
    }, walk = function(string, replacements) {
        var key, result = string;
        for (key in replacements) result = result.replace(replacements[key], key);
        return result;
    }, getRegexForTag = function(tag, contents) {
        tag = tag || "";
        var regstr = contents ? "<" + tag + "(?!\\w)[^>]*>([\\s\\S]*?)</" + tag + "(?!\\w)>" : "</?" + tag + "([^>]+)?>", reg = new RegExp(regstr, "gi");
        return reg;
    };
    String.implement({
        standardize: function() {
            return walk(this, special);
        },
        repeat: function(times) {
            return new Array(times + 1).join(this);
        },
        pad: function(length, str, direction) {
            if (this.length >= length) return this;
            var pad = (null == str ? " " : "" + str).repeat(length - this.length).substr(0, length - this.length);
            return direction && "right" != direction ? "left" == direction ? pad + this : pad.substr(0, (pad.length / 2).floor()) + this + pad.substr(0, (pad.length / 2).ceil()) : this + pad;
        },
        getTags: function(tag, contents) {
            return this.match(getRegexForTag(tag, contents)) || [];
        },
        stripTags: function(tag, contents) {
            return this.replace(getRegexForTag(tag, contents), "");
        },
        tidy: function() {
            return walk(this, tidy);
        },
        truncate: function(max, trail, atChar) {
            var string = this;
            if (null == trail && 1 == arguments.length && (trail = "…"), string.length > max) {
                if (string = string.substring(0, max), atChar) {
                    var index = string.lastIndexOf(atChar);
                    -1 != index && (string = string.substr(0, index));
                }
                trail && (string += trail);
            }
            return string;
        }
    });
}(), function() {
    Events.Pseudos = function(pseudos, addEvent, removeEvent) {
        var storeKey = "_monitorEvents:", storageOf = function(object) {
            return {
                store: object.store ? function(key, value) {
                    object.store(storeKey + key, value);
                } : function(key, value) {
                    (object._monitorEvents || (object._monitorEvents = {}))[key] = value;
                },
                retrieve: object.retrieve ? function(key, dflt) {
                    return object.retrieve(storeKey + key, dflt);
                } : function(key, dflt) {
                    return object._monitorEvents ? object._monitorEvents[key] || dflt : dflt;
                }
            };
        }, splitType = function(type) {
            if (-1 == type.indexOf(":") || !pseudos) return null;
            for (var parsed = Slick.parse(type).expressions[0][0], parsedPseudos = parsed.pseudos, l = parsedPseudos.length, splits = []; l--; ) {
                var pseudo = parsedPseudos[l].key, listener = pseudos[pseudo];
                null != listener && splits.push({
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
            addEvent: function(type, fn, internal) {
                var split = splitType(type);
                if (!split) return addEvent.call(this, type, fn, internal);
                var storage = storageOf(this), events = storage.retrieve(type, []), eventType = split[0].event, args = Array.slice(arguments, 2), stack = fn, self = this;
                return split.each(function(item) {
                    var listener = item.listener, stackFn = stack;
                    0 == listener ? eventType += ":" + item.pseudo + "(" + item.value + ")" : stack = function() {
                        listener.call(self, item, stackFn, arguments, stack);
                    };
                }), events.include({
                    type: eventType,
                    event: fn,
                    monitor: stack
                }), storage.store(type, events), type != eventType && addEvent.apply(this, [ type, fn ].concat(args)), 
                addEvent.apply(this, [ eventType, stack ].concat(args));
            },
            removeEvent: function(type, fn) {
                var split = splitType(type);
                if (!split) return removeEvent.call(this, type, fn);
                var storage = storageOf(this), events = storage.retrieve(type);
                if (!events) return this;
                var args = Array.slice(arguments, 2);
                return removeEvent.apply(this, [ type, fn ].concat(args)), events.each(function(monitor, i) {
                    fn && monitor.event != fn || removeEvent.apply(this, [ monitor.type, monitor.monitor ].concat(args)), 
                    delete events[i];
                }, this), storage.store(type, events), this;
            }
        };
    };
    var pseudos = {
        once: function(split, fn, args, monitor) {
            fn.apply(this, args), this.removeEvent(split.event, monitor).removeEvent(split.original, fn);
        },
        throttle: function(split, fn, args) {
            fn._throttled || (fn.apply(this, args), fn._throttled = setTimeout(function() {
                fn._throttled = !1;
            }, split.value || 250));
        },
        pause: function(split, fn, args) {
            clearTimeout(fn._pause), fn._pause = fn.delay(split.value || 250, this, args);
        }
    };
    Events.definePseudo = function(key, listener) {
        return pseudos[key] = listener, this;
    }, Events.lookupPseudo = function(key) {
        return pseudos[key];
    };
    var proto = Events.prototype;
    Events.implement(Events.Pseudos(pseudos, proto.addEvent, proto.removeEvent)), [ "Request", "Fx" ].each(function(klass) {
        this[klass] && this[klass].implement(Events.prototype);
    });
}(), function() {
    for (var pseudos = {
        relay: !1
    }, copyFromEvents = [ "once", "throttle", "pause" ], count = copyFromEvents.length; count--; ) pseudos[copyFromEvents[count]] = Events.lookupPseudo(copyFromEvents[count]);
    DOMEvent.definePseudo = function(key, listener) {
        return pseudos[key] = listener, this;
    };
    var proto = Element.prototype;
    [ Element, Window, Document ].invoke("implement", Events.Pseudos(pseudos, proto.addEvent, proto.removeEvent));
}(), function() {
    var defined = function(value) {
        return null != value;
    }, hasOwnProperty = Object.prototype.hasOwnProperty;
    Object.extend({
        getFromPath: function(source, parts) {
            "string" == typeof parts && (parts = parts.split("."));
            for (var i = 0, l = parts.length; l > i; i++) {
                if (!hasOwnProperty.call(source, parts[i])) return null;
                source = source[parts[i]];
            }
            return source;
        },
        cleanValues: function(object, method) {
            method = method || defined;
            for (var key in object) method(object[key]) || delete object[key];
            return object;
        },
        erase: function(object, key) {
            return hasOwnProperty.call(object, key) && delete object[key], object;
        },
        run: function(object) {
            var args = Array.slice(arguments, 1);
            for (var key in object) object[key].apply && object[key].apply(object, args);
            return object;
        }
    });
}(), function() {
    var current = null, locales = {}, getSet = function(set) {
        return instanceOf(set, Locale.Set) ? set : locales[set];
    }, Locale = this.Locale = {
        define: function(locale, set, key, value) {
            var name;
            return instanceOf(locale, Locale.Set) ? (name = locale.name, name && (locales[name] = locale)) : (name = locale, 
            locales[name] || (locales[name] = new Locale.Set(name)), locale = locales[name]), 
            set && locale.define(set, key, value), current || (current = locale), locale;
        },
        use: function(locale) {
            return locale = getSet(locale), locale && (current = locale, this.fireEvent("change", locale)), 
            this;
        },
        getCurrent: function() {
            return current;
        },
        get: function(key, args) {
            return current ? current.get(key, args) : "";
        },
        inherit: function(locale, inherits, set) {
            return locale = getSet(locale), locale && locale.inherit(inherits, set), this;
        },
        list: function() {
            return Object.keys(locales);
        }
    };
    Object.append(Locale, new Events()), Locale.Set = new Class({
        sets: {},
        inherits: {
            locales: [],
            sets: {}
        },
        initialize: function(name) {
            this.name = name || "";
        },
        define: function(set, key, value) {
            var defineData = this.sets[set];
            return defineData || (defineData = {}), key && ("object" == typeOf(key) ? defineData = Object.merge(defineData, key) : defineData[key] = value), 
            this.sets[set] = defineData, this;
        },
        get: function(key, args, _base) {
            var value = Object.getFromPath(this.sets, key);
            if (null != value) {
                var type = typeOf(value);
                return "function" == type ? value = value.apply(null, Array.from(args)) : "object" == type && (value = Object.clone(value)), 
                value;
            }
            var index = key.indexOf("."), set = 0 > index ? key : key.substr(0, index), names = (this.inherits.sets[set] || []).combine(this.inherits.locales).include("en-US");
            _base || (_base = []);
            for (var i = 0, l = names.length; l > i; i++) if (!_base.contains(names[i])) {
                _base.include(names[i]);
                var locale = locales[names[i]];
                if (locale && (value = locale.get(key, args, _base), null != value)) return value;
            }
            return "";
        },
        inherit: function(names, set) {
            names = Array.from(names), set && !this.inherits.sets[set] && (this.inherits.sets[set] = []);
            for (var l = names.length; l--; ) (set ? this.inherits.sets[set] : this.inherits.locales).unshift(names[l]);
            return this;
        }
    });
}(), Locale.define("en-US", "Date", {
    months: [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ],
    months_abbr: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ],
    days: [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ],
    days_abbr: [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ],
    dateOrder: [ "month", "date", "year" ],
    shortDate: "%m/%d/%Y",
    shortTime: "%I:%M%p",
    AM: "AM",
    PM: "PM",
    firstDayOfWeek: 0,
    ordinal: function(dayOfMonth) {
        return dayOfMonth > 3 && 21 > dayOfMonth ? "th" : [ "th", "st", "nd", "rd", "th" ][Math.min(dayOfMonth % 10, 4)];
    },
    lessThanMinuteAgo: "less than a minute ago",
    minuteAgo: "about a minute ago",
    minutesAgo: "{delta} minutes ago",
    hourAgo: "about an hour ago",
    hoursAgo: "about {delta} hours ago",
    dayAgo: "1 day ago",
    daysAgo: "{delta} days ago",
    weekAgo: "1 week ago",
    weeksAgo: "{delta} weeks ago",
    monthAgo: "1 month ago",
    monthsAgo: "{delta} months ago",
    yearAgo: "1 year ago",
    yearsAgo: "{delta} years ago",
    lessThanMinuteUntil: "less than a minute from now",
    minuteUntil: "about a minute from now",
    minutesUntil: "{delta} minutes from now",
    hourUntil: "about an hour from now",
    hoursUntil: "about {delta} hours from now",
    dayUntil: "1 day from now",
    daysUntil: "{delta} days from now",
    weekUntil: "1 week from now",
    weeksUntil: "{delta} weeks from now",
    monthUntil: "1 month from now",
    monthsUntil: "{delta} months from now",
    yearUntil: "1 year from now",
    yearsUntil: "{delta} years from now"
}), function() {
    var Date = this.Date, DateMethods = Date.Methods = {
        ms: "Milliseconds",
        year: "FullYear",
        min: "Minutes",
        mo: "Month",
        sec: "Seconds",
        hr: "Hours"
    };
    [ "Date", "Day", "FullYear", "Hours", "Milliseconds", "Minutes", "Month", "Seconds", "Time", "TimezoneOffset", "Week", "Timezone", "GMTOffset", "DayOfYear", "LastMonth", "LastDayOfMonth", "UTCDate", "UTCDay", "UTCFullYear", "AMPM", "Ordinal", "UTCHours", "UTCMilliseconds", "UTCMinutes", "UTCMonth", "UTCSeconds", "UTCMilliseconds" ].each(function(method) {
        Date.Methods[method.toLowerCase()] = method;
    });
    var pad = function(n, digits, string) {
        return 1 == digits ? n : n < Math.pow(10, digits - 1) ? (string || "0") + pad(n, digits - 1, string) : n;
    };
    Date.implement({
        set: function(prop, value) {
            prop = prop.toLowerCase();
            var method = DateMethods[prop] && "set" + DateMethods[prop];
            return method && this[method] && this[method](value), this;
        }.overloadSetter(),
        get: function(prop) {
            prop = prop.toLowerCase();
            var method = DateMethods[prop] && "get" + DateMethods[prop];
            return method && this[method] ? this[method]() : null;
        }.overloadGetter(),
        clone: function() {
            return new Date(this.get("time"));
        },
        increment: function(interval, times) {
            switch (interval = interval || "day", times = null != times ? times : 1, interval) {
              case "year":
                return this.increment("month", 12 * times);

              case "month":
                var d = this.get("date");
                return this.set("date", 1).set("mo", this.get("mo") + times), this.set("date", d.min(this.get("lastdayofmonth")));

              case "week":
                return this.increment("day", 7 * times);

              case "day":
                return this.set("date", this.get("date") + times);
            }
            if (!Date.units[interval]) throw new Error(interval + " is not a supported interval");
            return this.set("time", this.get("time") + times * Date.units[interval]());
        },
        decrement: function(interval, times) {
            return this.increment(interval, -1 * (null != times ? times : 1));
        },
        isLeapYear: function() {
            return Date.isLeapYear(this.get("year"));
        },
        clearTime: function() {
            return this.set({
                hr: 0,
                min: 0,
                sec: 0,
                ms: 0
            });
        },
        diff: function(date, resolution) {
            return "string" == typeOf(date) && (date = Date.parse(date)), ((date - this) / Date.units[resolution || "day"](3, 3)).round();
        },
        getLastDayOfMonth: function() {
            return Date.daysInMonth(this.get("mo"), this.get("year"));
        },
        getDayOfYear: function() {
            return (Date.UTC(this.get("year"), this.get("mo"), this.get("date") + 1) - Date.UTC(this.get("year"), 0, 1)) / Date.units.day();
        },
        setDay: function(day, firstDayOfWeek) {
            null == firstDayOfWeek && (firstDayOfWeek = Date.getMsg("firstDayOfWeek"), "" === firstDayOfWeek && (firstDayOfWeek = 1)), 
            day = (7 + Date.parseDay(day, !0) - firstDayOfWeek) % 7;
            var currentDay = (7 + this.get("day") - firstDayOfWeek) % 7;
            return this.increment("day", day - currentDay);
        },
        getWeek: function(firstDayOfWeek) {
            null == firstDayOfWeek && (firstDayOfWeek = Date.getMsg("firstDayOfWeek"), "" === firstDayOfWeek && (firstDayOfWeek = 1));
            var firstDayOfYear, date = this, dayOfWeek = (7 + date.get("day") - firstDayOfWeek) % 7, dividend = 0;
            if (1 == firstDayOfWeek) {
                var month = date.get("month"), startOfWeek = date.get("date") - dayOfWeek;
                if (11 == month && startOfWeek > 28) return 1;
                0 == month && -2 > startOfWeek && (date = new Date(date).decrement("day", dayOfWeek), 
                dayOfWeek = 0), firstDayOfYear = new Date(date.get("year"), 0, 1).get("day") || 7, 
                firstDayOfYear > 4 && (dividend = -7);
            } else firstDayOfYear = new Date(date.get("year"), 0, 1).get("day");
            return dividend += date.get("dayofyear"), dividend += 6 - dayOfWeek, dividend += (7 + firstDayOfYear - firstDayOfWeek) % 7, 
            dividend / 7;
        },
        getOrdinal: function(day) {
            return Date.getMsg("ordinal", day || this.get("date"));
        },
        getTimezone: function() {
            return this.toString().replace(/^.*? ([A-Z]{3}).[0-9]{4}.*$/, "$1").replace(/^.*?\(([A-Z])[a-z]+ ([A-Z])[a-z]+ ([A-Z])[a-z]+\)$/, "$1$2$3");
        },
        getGMTOffset: function() {
            var off = this.get("timezoneOffset");
            return (off > 0 ? "-" : "+") + pad((off.abs() / 60).floor(), 2) + pad(off % 60, 2);
        },
        setAMPM: function(ampm) {
            ampm = ampm.toUpperCase();
            var hr = this.get("hr");
            return hr > 11 && "AM" == ampm ? this.decrement("hour", 12) : 12 > hr && "PM" == ampm ? this.increment("hour", 12) : this;
        },
        getAMPM: function() {
            return this.get("hr") < 12 ? "AM" : "PM";
        },
        parse: function(str) {
            return this.set("time", Date.parse(str)), this;
        },
        isValid: function(date) {
            return date || (date = this), "date" == typeOf(date) && !isNaN(date.valueOf());
        },
        format: function(format) {
            if (!this.isValid()) return "invalid date";
            if (format || (format = "%x %X"), "string" == typeof format && (format = formats[format.toLowerCase()] || format), 
            "function" == typeof format) return format(this);
            var d = this;
            return format.replace(/%([a-z%])/gi, function($0, $1) {
                switch ($1) {
                  case "a":
                    return Date.getMsg("days_abbr")[d.get("day")];

                  case "A":
                    return Date.getMsg("days")[d.get("day")];

                  case "b":
                    return Date.getMsg("months_abbr")[d.get("month")];

                  case "B":
                    return Date.getMsg("months")[d.get("month")];

                  case "c":
                    return d.format("%a %b %d %H:%M:%S %Y");

                  case "d":
                    return pad(d.get("date"), 2);

                  case "e":
                    return pad(d.get("date"), 2, " ");

                  case "H":
                    return pad(d.get("hr"), 2);

                  case "I":
                    return pad(d.get("hr") % 12 || 12, 2);

                  case "j":
                    return pad(d.get("dayofyear"), 3);

                  case "k":
                    return pad(d.get("hr"), 2, " ");

                  case "l":
                    return pad(d.get("hr") % 12 || 12, 2, " ");

                  case "L":
                    return pad(d.get("ms"), 3);

                  case "m":
                    return pad(d.get("mo") + 1, 2);

                  case "M":
                    return pad(d.get("min"), 2);

                  case "o":
                    return d.get("ordinal");

                  case "p":
                    return Date.getMsg(d.get("ampm"));

                  case "s":
                    return Math.round(d / 1e3);

                  case "S":
                    return pad(d.get("seconds"), 2);

                  case "T":
                    return d.format("%H:%M:%S");

                  case "U":
                    return pad(d.get("week"), 2);

                  case "w":
                    return d.get("day");

                  case "x":
                    return d.format(Date.getMsg("shortDate"));

                  case "X":
                    return d.format(Date.getMsg("shortTime"));

                  case "y":
                    return d.get("year").toString().substr(2);

                  case "Y":
                    return d.get("year");

                  case "z":
                    return d.get("GMTOffset");

                  case "Z":
                    return d.get("Timezone");
                }
                return $1;
            });
        },
        toISOString: function() {
            return this.format("iso8601");
        }
    }).alias({
        toJSON: "toISOString",
        compare: "diff",
        strftime: "format"
    });
    var rfcDayAbbr = [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ], rfcMonthAbbr = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ], formats = {
        db: "%Y-%m-%d %H:%M:%S",
        compact: "%Y%m%dT%H%M%S",
        "short": "%d %b %H:%M",
        "long": "%B %d, %Y %H:%M",
        rfc822: function(date) {
            return rfcDayAbbr[date.get("day")] + date.format(", %d ") + rfcMonthAbbr[date.get("month")] + date.format(" %Y %H:%M:%S %Z");
        },
        rfc2822: function(date) {
            return rfcDayAbbr[date.get("day")] + date.format(", %d ") + rfcMonthAbbr[date.get("month")] + date.format(" %Y %H:%M:%S %z");
        },
        iso8601: function(date) {
            return date.getUTCFullYear() + "-" + pad(date.getUTCMonth() + 1, 2) + "-" + pad(date.getUTCDate(), 2) + "T" + pad(date.getUTCHours(), 2) + ":" + pad(date.getUTCMinutes(), 2) + ":" + pad(date.getUTCSeconds(), 2) + "." + pad(date.getUTCMilliseconds(), 3) + "Z";
        }
    }, parsePatterns = [], nativeParse = Date.parse, parseWord = function(type, word, num) {
        var ret = -1, translated = Date.getMsg(type + "s");
        switch (typeOf(word)) {
          case "object":
            ret = translated[word.get(type)];
            break;

          case "number":
            if (ret = translated[word], !ret) throw new Error("Invalid " + type + " index: " + word);
            break;

          case "string":
            var match = translated.filter(function(name) {
                return this.test(name);
            }, new RegExp("^" + word, "i"));
            if (!match.length) throw new Error("Invalid " + type + " string");
            if (match.length > 1) throw new Error("Ambiguous " + type);
            ret = match[0];
        }
        return num ? translated.indexOf(ret) : ret;
    }, startCentury = 1900, startYear = 70;
    Date.extend({
        getMsg: function(key, args) {
            return Locale.get("Date." + key, args);
        },
        units: {
            ms: Function.from(1),
            second: Function.from(1e3),
            minute: Function.from(6e4),
            hour: Function.from(36e5),
            day: Function.from(864e5),
            week: Function.from(6084e5),
            month: function(month, year) {
                var d = new Date();
                return 864e5 * Date.daysInMonth(null != month ? month : d.get("mo"), null != year ? year : d.get("year"));
            },
            year: function(year) {
                return year = year || new Date().get("year"), Date.isLeapYear(year) ? 316224e5 : 31536e6;
            }
        },
        daysInMonth: function(month, year) {
            return [ 31, Date.isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ][month];
        },
        isLeapYear: function(year) {
            return 0 === year % 4 && 0 !== year % 100 || 0 === year % 400;
        },
        parse: function(from) {
            var t = typeOf(from);
            if ("number" == t) return new Date(from);
            if ("string" != t) return from;
            if (from = from.clean(), !from.length) return null;
            var parsed;
            return parsePatterns.some(function(pattern) {
                var bits = pattern.re.exec(from);
                return bits ? parsed = pattern.handler(bits) : !1;
            }), parsed && parsed.isValid() || (parsed = new Date(nativeParse(from)), parsed && parsed.isValid() || (parsed = new Date(from.toInt()))), 
            parsed;
        },
        parseDay: function(day, num) {
            return parseWord("day", day, num);
        },
        parseMonth: function(month, num) {
            return parseWord("month", month, num);
        },
        parseUTC: function(value) {
            var localDate = new Date(value), utcSeconds = Date.UTC(localDate.get("year"), localDate.get("mo"), localDate.get("date"), localDate.get("hr"), localDate.get("min"), localDate.get("sec"), localDate.get("ms"));
            return new Date(utcSeconds);
        },
        orderIndex: function(unit) {
            return Date.getMsg("dateOrder").indexOf(unit) + 1;
        },
        defineFormat: function(name, format) {
            return formats[name] = format, this;
        },
        defineParser: function(pattern) {
            return parsePatterns.push(pattern.re && pattern.handler ? pattern : build(pattern)), 
            this;
        },
        defineParsers: function() {
            return Array.flatten(arguments).each(Date.defineParser), this;
        },
        define2DigitYearStart: function(year) {
            return startYear = year % 100, startCentury = year - startYear, this;
        }
    }).extend({
        defineFormats: Date.defineFormat.overloadSetter()
    });
    var regexOf = function(type) {
        return new RegExp("(?:" + Date.getMsg(type).map(function(name) {
            return name.substr(0, 3);
        }).join("|") + ")[a-z]*");
    }, replacers = function(key) {
        switch (key) {
          case "T":
            return "%H:%M:%S";

          case "x":
            return (1 == Date.orderIndex("month") ? "%m[-./]%d" : "%d[-./]%m") + "([-./]%y)?";

          case "X":
            return "%H([.:]%M)?([.:]%S([.:]%s)?)? ?%p? ?%z?";
        }
        return null;
    }, keys = {
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
    keys.m = keys.I, keys.S = keys.M;
    var currentLanguage, recompile = function(language) {
        currentLanguage = language, keys.a = keys.A = regexOf("days"), keys.b = keys.B = regexOf("months"), 
        parsePatterns.each(function(pattern, i) {
            pattern.format && (parsePatterns[i] = build(pattern.format));
        });
    }, build = function(format) {
        if (!currentLanguage) return {
            format: format
        };
        var parsed = [], re = (format.source || format).replace(/%([a-z])/gi, function($0, $1) {
            return replacers($1) || $0;
        }).replace(/\((?!\?)/g, "(?:").replace(/ (?!\?|\*)/g, ",? ").replace(/%([a-z%])/gi, function($0, $1) {
            var p = keys[$1];
            return p ? (parsed.push($1), "(" + p.source + ")") : $1;
        }).replace(/\[a-z\]/gi, "[a-z\\u00c0-\\uffff;&]");
        return {
            format: format,
            re: new RegExp("^" + re + "$", "i"),
            handler: function(bits) {
                bits = bits.slice(1).associate(parsed);
                var date = new Date().clearTime(), year = bits.y || bits.Y;
                null != year && handle.call(date, "y", year), "d" in bits && handle.call(date, "d", 1), 
                ("m" in bits || bits.b || bits.B) && handle.call(date, "m", 1);
                for (var key in bits) handle.call(date, key, bits[key]);
                return date;
            }
        };
    }, handle = function(key, value) {
        if (!value) return this;
        switch (key) {
          case "a":
          case "A":
            return this.set("day", Date.parseDay(value, !0));

          case "b":
          case "B":
            return this.set("mo", Date.parseMonth(value, !0));

          case "d":
            return this.set("date", value);

          case "H":
          case "I":
            return this.set("hr", value);

          case "m":
            return this.set("mo", value - 1);

          case "M":
            return this.set("min", value);

          case "p":
            return this.set("ampm", value.replace(/\./g, ""));

          case "S":
            return this.set("sec", value);

          case "s":
            return this.set("ms", 1e3 * ("0." + value));

          case "w":
            return this.set("day", value);

          case "Y":
            return this.set("year", value);

          case "y":
            return value = +value, 100 > value && (value += startCentury + (startYear > value ? 100 : 0)), 
            this.set("year", value);

          case "z":
            "Z" == value && (value = "+00");
            var offset = value.match(/([+-])(\d{2}):?(\d{2})?/);
            return offset = (offset[1] + "1") * (60 * offset[2] + (+offset[3] || 0)) + this.getTimezoneOffset(), 
            this.set("time", this - 6e4 * offset);
        }
        return this;
    };
    Date.defineParsers("%Y([-./]%m([-./]%d((T| )%X)?)?)?", "%Y%m%d(T%H(%M%S?)?)?", "%x( %X)?", "%d%o( %b( %Y)?)?( %X)?", "%b( %d%o)?( %Y)?( %X)?", "%Y %b( %d%o( %X)?)?", "%o %b %d %X %z %Y", "%T", "%H:%M( ?%p)?"), 
    Locale.addEvent("change", function(language) {
        Locale.get("Date") && recompile(language);
    }).fireEvent("change", Locale.getCurrent());
}(), Elements.from = function(text, excludeScripts) {
    (excludeScripts || null == excludeScripts) && (text = text.stripScripts());
    var container, match = text.match(/^\s*<(t[dhr]|tbody|tfoot|thead)/i);
    if (match) {
        container = new Element("table");
        var tag = match[1].toLowerCase();
        [ "td", "th", "tr" ].contains(tag) && (container = new Element("tbody").inject(container), 
        "tr" != tag && (container = new Element("tr").inject(container)));
    }
    return (container || new Element("div")).set("html", text).getChildren();
}, function() {
    var getStylesList = function(styles, planes) {
        var list = [];
        return Object.each(planes, function(directions) {
            Object.each(directions, function(edge) {
                styles.each(function(style) {
                    list.push(style + "-" + edge + ("border" == style ? "-width" : ""));
                });
            });
        }), list;
    }, calculateEdgeSize = function(edge, styles) {
        var total = 0;
        return Object.each(styles, function(value, style) {
            style.test(edge) && (total += value.toInt());
        }), total;
    }, isVisible = function(el) {
        return !(el && !el.offsetHeight && !el.offsetWidth);
    };
    Element.implement({
        measure: function(fn) {
            if (isVisible(this)) return fn.call(this);
            for (var parent = this.getParent(), toMeasure = []; !isVisible(parent) && parent != document.body; ) toMeasure.push(parent.expose()), 
            parent = parent.getParent();
            var restore = this.expose(), result = fn.call(this);
            return restore(), toMeasure.each(function(restore) {
                restore();
            }), result;
        },
        expose: function() {
            if ("none" != this.getStyle("display")) return function() {};
            var before = this.style.cssText;
            return this.setStyles({
                display: "block",
                position: "absolute",
                visibility: "hidden"
            }), function() {
                this.style.cssText = before;
            }.bind(this);
        },
        getDimensions: function(options) {
            options = Object.merge({
                computeSize: !1
            }, options);
            var dim = {
                x: 0,
                y: 0
            }, getSize = function(el, options) {
                return options.computeSize ? el.getComputedSize(options) : el.getSize();
            }, parent = this.getParent("body");
            if (parent && "none" == this.getStyle("display")) dim = this.measure(function() {
                return getSize(this, options);
            }); else if (parent) try {
                dim = getSize(this, options);
            } catch (e) {}
            return Object.append(dim, dim.x || 0 === dim.x ? {
                width: dim.x,
                height: dim.y
            } : {
                x: dim.width,
                y: dim.height
            });
        },
        getComputedSize: function(options) {
            options = Object.merge({
                styles: [ "padding", "border" ],
                planes: {
                    height: [ "top", "bottom" ],
                    width: [ "left", "right" ]
                },
                mode: "both"
            }, options);
            var dimensions, styles = {}, size = {
                width: 0,
                height: 0
            };
            return "vertical" == options.mode ? (delete size.width, delete options.planes.width) : "horizontal" == options.mode && (delete size.height, 
            delete options.planes.height), getStylesList(options.styles, options.planes).each(function(style) {
                styles[style] = this.getStyle(style).toInt();
            }, this), Object.each(options.planes, function(edges, plane) {
                var capitalized = plane.capitalize(), style = this.getStyle(plane);
                "auto" != style || dimensions || (dimensions = this.getDimensions()), style = styles[plane] = "auto" == style ? dimensions[plane] : style.toInt(), 
                size["total" + capitalized] = style, edges.each(function(edge) {
                    var edgesize = calculateEdgeSize(edge, styles);
                    size["computed" + edge.capitalize()] = edgesize, size["total" + capitalized] += edgesize;
                });
            }, this), Object.append(size, styles);
        }
    });
}(), Element.implement({
    tidy: function() {
        this.set("value", this.get("value").tidy());
    },
    getTextInRange: function(start, end) {
        return this.get("value").substring(start, end);
    },
    getSelectedText: function() {
        return this.setSelectionRange ? this.getTextInRange(this.getSelectionStart(), this.getSelectionEnd()) : document.selection.createRange().text;
    },
    getSelectedRange: function() {
        if (null != this.selectionStart) return {
            start: this.selectionStart,
            end: this.selectionEnd
        };
        var pos = {
            start: 0,
            end: 0
        }, range = this.getDocument().selection.createRange();
        if (!range || range.parentElement() != this) return pos;
        var duplicate = range.duplicate();
        if ("text" == this.type) pos.start = 0 - duplicate.moveStart("character", -1e5), 
        pos.end = pos.start + range.text.length; else {
            var value = this.get("value"), offset = value.length;
            duplicate.moveToElementText(this), duplicate.setEndPoint("StartToEnd", range), duplicate.text.length && (offset -= value.match(/[\n\r]*$/)[0].length), 
            pos.end = offset - duplicate.text.length, duplicate.setEndPoint("StartToStart", range), 
            pos.start = offset - duplicate.text.length;
        }
        return pos;
    },
    getSelectionStart: function() {
        return this.getSelectedRange().start;
    },
    getSelectionEnd: function() {
        return this.getSelectedRange().end;
    },
    setCaretPosition: function(pos) {
        return "end" == pos && (pos = this.get("value").length), this.selectRange(pos, pos), 
        this;
    },
    getCaretPosition: function() {
        return this.getSelectedRange().start;
    },
    selectRange: function(start, end) {
        if (this.setSelectionRange) this.focus(), this.setSelectionRange(start, end); else {
            var value = this.get("value"), diff = value.substr(start, end - start).replace(/\r/g, "").length;
            start = value.substr(0, start).replace(/\r/g, "").length;
            var range = this.createTextRange();
            range.collapse(!0), range.moveEnd("character", start + diff), range.moveStart("character", start), 
            range.select();
        }
        return this;
    },
    insertAtCursor: function(value, select) {
        var pos = this.getSelectedRange(), text = this.get("value");
        return this.set("value", text.substring(0, pos.start) + value + text.substring(pos.end, text.length)), 
        select !== !1 ? this.selectRange(pos.start, pos.start + value.length) : this.setCaretPosition(pos.start + value.length), 
        this;
    },
    insertAroundCursor: function(options, select) {
        options = Object.append({
            before: "",
            defaultMiddle: "",
            after: ""
        }, options);
        var value = this.getSelectedText() || options.defaultMiddle, pos = this.getSelectedRange(), text = this.get("value");
        if (pos.start == pos.end) this.set("value", text.substring(0, pos.start) + options.before + value + options.after + text.substring(pos.end, text.length)), 
        this.selectRange(pos.start + options.before.length, pos.end + options.before.length + value.length); else {
            var current = text.substring(pos.start, pos.end);
            this.set("value", text.substring(0, pos.start) + options.before + current + options.after + text.substring(pos.end, text.length));
            var selStart = pos.start + options.before.length;
            select !== !1 ? this.selectRange(selStart, selStart + current.length) : this.setCaretPosition(selStart + text.length);
        }
        return this;
    }
}), Fx.Elements = new Class({
    Extends: Fx.CSS,
    initialize: function(elements, options) {
        this.elements = this.subject = $$(elements), this.parent(options);
    },
    compute: function(from, to, delta) {
        var now = {};
        for (var i in from) {
            var iFrom = from[i], iTo = to[i], iNow = now[i] = {};
            for (var p in iFrom) iNow[p] = this.parent(iFrom[p], iTo[p], delta);
        }
        return now;
    },
    set: function(now) {
        for (var i in now) if (this.elements[i]) {
            var iNow = now[i];
            for (var p in iNow) this.render(this.elements[i], p, iNow[p], this.options.unit);
        }
        return this;
    },
    start: function(obj) {
        if (!this.check(obj)) return this;
        var from = {}, to = {};
        for (var i in obj) if (this.elements[i]) {
            var iProps = obj[i], iFrom = from[i] = {}, iTo = to[i] = {};
            for (var p in iProps) {
                var parsed = this.prepare(this.elements[i], p, iProps[p]);
                iFrom[p] = parsed.from, iTo[p] = parsed.to;
            }
        }
        return this.parent(from, to);
    }
}), Fx.Accordion = new Class({
    Extends: Fx.Elements,
    options: {
        fixedHeight: !1,
        fixedWidth: !1,
        display: 0,
        show: !1,
        height: !0,
        width: !1,
        opacity: !0,
        alwaysHide: !1,
        trigger: "click",
        initialDisplayFx: !0,
        resetHeight: !0
    },
    initialize: function() {
        var defined = function(obj) {
            return null != obj;
        }, params = Array.link(arguments, {
            container: Type.isElement,
            options: Type.isObject,
            togglers: defined,
            elements: defined
        });
        this.parent(params.elements, params.options);
        var options = this.options, togglers = this.togglers = $$(params.togglers);
        this.previous = -1, this.internalChain = new Chain(), options.alwaysHide && (this.options.link = "chain"), 
        (options.show || 0 === this.options.show) && (options.display = !1, this.previous = options.show), 
        options.start && (options.display = !1, options.show = !1);
        var effects = this.effects = {};
        options.opacity && (effects.opacity = "fullOpacity"), options.width && (effects.width = options.fixedWidth ? "fullWidth" : "offsetWidth"), 
        options.height && (effects.height = options.fixedHeight ? "fullHeight" : "scrollHeight");
        for (var i = 0, l = togglers.length; l > i; i++) this.addSection(togglers[i], this.elements[i]);
        this.elements.each(function(el, i) {
            if (options.show === i) this.fireEvent("active", [ togglers[i], el ]); else for (var fx in effects) el.setStyle(fx, 0);
        }, this), (options.display || 0 === options.display || options.initialDisplayFx === !1) && this.display(options.display, options.initialDisplayFx), 
        options.fixedHeight !== !1 && (options.resetHeight = !1), this.addEvent("complete", this.internalChain.callChain.bind(this.internalChain));
    },
    addSection: function(toggler, element) {
        toggler = document.id(toggler), element = document.id(element), this.togglers.include(toggler), 
        this.elements.include(element);
        var togglers = this.togglers, options = this.options, test = togglers.contains(toggler), idx = togglers.indexOf(toggler), displayer = this.display.pass(idx, this);
        if (toggler.store("accordion:display", displayer).addEvent(options.trigger, displayer), 
        options.height && element.setStyles({
            "padding-top": 0,
            "border-top": "none",
            "padding-bottom": 0,
            "border-bottom": "none"
        }), options.width && element.setStyles({
            "padding-left": 0,
            "border-left": "none",
            "padding-right": 0,
            "border-right": "none"
        }), element.fullOpacity = 1, options.fixedWidth && (element.fullWidth = options.fixedWidth), 
        options.fixedHeight && (element.fullHeight = options.fixedHeight), element.setStyle("overflow", "hidden"), 
        !test) for (var fx in this.effects) element.setStyle(fx, 0);
        return this;
    },
    removeSection: function(toggler, displayIndex) {
        var togglers = this.togglers, idx = togglers.indexOf(toggler), element = this.elements[idx], remover = function() {
            togglers.erase(toggler), this.elements.erase(element), this.detach(toggler);
        }.bind(this);
        return this.now == idx || null != displayIndex ? this.display(null != displayIndex ? displayIndex : idx - 1 >= 0 ? idx - 1 : 0).chain(remover) : remover(), 
        this;
    },
    detach: function(toggler) {
        var remove = function(toggler) {
            toggler.removeEvent(this.options.trigger, toggler.retrieve("accordion:display"));
        }.bind(this);
        return toggler ? remove(toggler) : this.togglers.each(remove), this;
    },
    display: function(index, useFx) {
        if (!this.check(index, useFx)) return this;
        var obj = {}, elements = this.elements, options = this.options, effects = this.effects;
        if (null == useFx && (useFx = !0), "element" == typeOf(index) && (index = elements.indexOf(index)), 
        index == this.previous && !options.alwaysHide) return this;
        if (options.resetHeight) {
            var prev = elements[this.previous];
            if (prev && !this.selfHidden) for (var fx in effects) prev.setStyle(fx, prev[effects[fx]]);
        }
        return this.timer && "chain" == options.link || index === this.previous && !options.alwaysHide ? this : (this.previous = index, 
        this.selfHidden = !1, elements.each(function(el, i) {
            obj[i] = {};
            var hide;
            i != index ? hide = !0 : options.alwaysHide && (el.offsetHeight > 0 && options.height || el.offsetWidth > 0 && options.width) && (hide = !0, 
            this.selfHidden = !0), this.fireEvent(hide ? "background" : "active", [ this.togglers[i], el ]);
            for (var fx in effects) obj[i][fx] = hide ? 0 : el[effects[fx]];
            useFx || hide || !options.resetHeight || (obj[i].height = "auto");
        }, this), this.internalChain.clearChain(), this.internalChain.chain(function() {
            if (options.resetHeight && !this.selfHidden) {
                var el = elements[index];
                el && el.setStyle("height", "auto");
            }
        }.bind(this)), useFx ? this.start(obj) : this.set(obj).internalChain.callChain());
    }
}), function(original) {
    var local = Element.Position = {
        options: {
            relativeTo: document.body,
            position: {
                x: "center",
                y: "center"
            },
            offset: {
                x: 0,
                y: 0
            }
        },
        getOptions: function(element, options) {
            return options = Object.merge({}, local.options, options), local.setPositionOption(options), 
            local.setEdgeOption(options), local.setOffsetOption(element, options), local.setDimensionsOption(element, options), 
            options;
        },
        setPositionOption: function(options) {
            options.position = local.getCoordinateFromValue(options.position);
        },
        setEdgeOption: function(options) {
            var edgeOption = local.getCoordinateFromValue(options.edge);
            options.edge = edgeOption ? edgeOption : "center" == options.position.x && "center" == options.position.y ? {
                x: "center",
                y: "center"
            } : {
                x: "left",
                y: "top"
            };
        },
        setOffsetOption: function(element, options) {
            var parentOffset = {
                x: 0,
                y: 0
            }, offsetParent = element.measure(function() {
                return document.id(this.getOffsetParent());
            }), parentScroll = offsetParent.getScroll();
            offsetParent && offsetParent != element.getDocument().body && (parentOffset = offsetParent.measure(function() {
                var position = this.getPosition();
                if ("fixed" == this.getStyle("position")) {
                    var scroll = window.getScroll();
                    position.x += scroll.x, position.y += scroll.y;
                }
                return position;
            }), options.offset = {
                parentPositioned: offsetParent != document.id(options.relativeTo),
                x: options.offset.x - parentOffset.x + parentScroll.x,
                y: options.offset.y - parentOffset.y + parentScroll.y
            });
        },
        setDimensionsOption: function(element, options) {
            options.dimensions = element.getDimensions({
                computeSize: !0,
                styles: [ "padding", "border", "margin" ]
            });
        },
        getPosition: function(element, options) {
            var position = {};
            options = local.getOptions(element, options);
            var relativeTo = document.id(options.relativeTo) || document.body;
            local.setPositionCoordinates(options, position, relativeTo), options.edge && local.toEdge(position, options);
            var offset = options.offset;
            return position.left = (position.x >= 0 || offset.parentPositioned || options.allowNegative ? position.x : 0).toInt(), 
            position.top = (position.y >= 0 || offset.parentPositioned || options.allowNegative ? position.y : 0).toInt(), 
            local.toMinMax(position, options), (options.relFixedPosition || "fixed" == relativeTo.getStyle("position")) && local.toRelFixedPosition(relativeTo, position), 
            options.ignoreScroll && local.toIgnoreScroll(relativeTo, position), options.ignoreMargins && local.toIgnoreMargins(position, options), 
            position.left = Math.ceil(position.left), position.top = Math.ceil(position.top), 
            delete position.x, delete position.y, position;
        },
        setPositionCoordinates: function(options, position, relativeTo) {
            var offsetY = options.offset.y, offsetX = options.offset.x, calc = relativeTo == document.body ? window.getScroll() : relativeTo.getPosition(), top = calc.y, left = calc.x, winSize = window.getSize();
            switch (options.position.x) {
              case "left":
                position.x = left + offsetX;
                break;

              case "right":
                position.x = left + offsetX + relativeTo.offsetWidth;
                break;

              default:
                position.x = left + (relativeTo == document.body ? winSize.x : relativeTo.offsetWidth) / 2 + offsetX;
            }
            switch (options.position.y) {
              case "top":
                position.y = top + offsetY;
                break;

              case "bottom":
                position.y = top + offsetY + relativeTo.offsetHeight;
                break;

              default:
                position.y = top + (relativeTo == document.body ? winSize.y : relativeTo.offsetHeight) / 2 + offsetY;
            }
        },
        toMinMax: function(position, options) {
            var value, xy = {
                left: "x",
                top: "y"
            };
            [ "minimum", "maximum" ].each(function(minmax) {
                [ "left", "top" ].each(function(lr) {
                    value = options[minmax] ? options[minmax][xy[lr]] : null, null != value && ("minimum" == minmax ? position[lr] < value : position[lr] > value) && (position[lr] = value);
                });
            });
        },
        toRelFixedPosition: function(relativeTo, position) {
            var winScroll = window.getScroll();
            position.top += winScroll.y, position.left += winScroll.x;
        },
        toIgnoreScroll: function(relativeTo, position) {
            var relScroll = relativeTo.getScroll();
            position.top -= relScroll.y, position.left -= relScroll.x;
        },
        toIgnoreMargins: function(position, options) {
            position.left += "right" == options.edge.x ? options.dimensions["margin-right"] : "center" != options.edge.x ? -options.dimensions["margin-left"] : -options.dimensions["margin-left"] + (options.dimensions["margin-right"] + options.dimensions["margin-left"]) / 2, 
            position.top += "bottom" == options.edge.y ? options.dimensions["margin-bottom"] : "center" != options.edge.y ? -options.dimensions["margin-top"] : -options.dimensions["margin-top"] + (options.dimensions["margin-bottom"] + options.dimensions["margin-top"]) / 2;
        },
        toEdge: function(position, options) {
            var edgeOffset = {}, dimensions = options.dimensions, edge = options.edge;
            switch (edge.x) {
              case "left":
                edgeOffset.x = 0;
                break;

              case "right":
                edgeOffset.x = -dimensions.x - dimensions.computedRight - dimensions.computedLeft;
                break;

              default:
                edgeOffset.x = -Math.round(dimensions.totalWidth / 2);
            }
            switch (edge.y) {
              case "top":
                edgeOffset.y = 0;
                break;

              case "bottom":
                edgeOffset.y = -dimensions.y - dimensions.computedTop - dimensions.computedBottom;
                break;

              default:
                edgeOffset.y = -Math.round(dimensions.totalHeight / 2);
            }
            position.x += edgeOffset.x, position.y += edgeOffset.y;
        },
        getCoordinateFromValue: function(option) {
            return "string" != typeOf(option) ? option : (option = option.toLowerCase(), {
                x: option.test("left") ? "left" : option.test("right") ? "right" : "center",
                y: option.test(/upper|top/) ? "top" : option.test("bottom") ? "bottom" : "center"
            });
        }
    };
    Element.implement({
        position: function(options) {
            if (options && (null != options.x || null != options.y)) return original ? original.apply(this, arguments) : this;
            var position = this.setStyle("position", "absolute").calculatePosition(options);
            return options && options.returnPos ? position : this.setStyles(position);
        },
        calculatePosition: function(options) {
            return local.getPosition(this, options);
        }
    });
}(Element.prototype.position), Fx.Move = new Class({
    Extends: Fx.Morph,
    options: {
        relativeTo: document.body,
        position: "center",
        edge: !1,
        offset: {
            x: 0,
            y: 0
        }
    },
    start: function(destination) {
        var element = this.element, topLeft = element.getStyles("top", "left");
        return ("auto" == topLeft.top || "auto" == topLeft.left) && element.setPosition(element.getPosition(element.getOffsetParent())), 
        this.parent(element.position(Object.merge({}, this.options, destination, {
            returnPos: !0
        })));
    }
}), Element.Properties.move = {
    set: function(options) {
        return this.get("move").cancel().setOptions(options), this;
    },
    get: function() {
        var move = this.retrieve("move");
        return move || (move = new Fx.Move(this, {
            link: "cancel"
        }), this.store("move", move)), move;
    }
}, Element.implement({
    move: function(options) {
        return this.get("move").start(options), this;
    }
}), Element.implement({
    isDisplayed: function() {
        return "none" != this.getStyle("display");
    },
    isVisible: function() {
        var w = this.offsetWidth, h = this.offsetHeight;
        return 0 == w && 0 == h ? !1 : w > 0 && h > 0 ? !0 : "none" != this.style.display;
    },
    toggle: function() {
        return this[this.isDisplayed() ? "hide" : "show"]();
    },
    hide: function() {
        var d;
        try {
            d = this.getStyle("display");
        } catch (e) {}
        return "none" == d ? this : this.store("element:_originalDisplay", d || "").setStyle("display", "none");
    },
    show: function(display) {
        return !display && this.isDisplayed() ? this : (display = display || this.retrieve("element:_originalDisplay") || "block", 
        this.setStyle("display", "none" == display ? "block" : display));
    },
    swapClass: function(remove, add) {
        return this.removeClass(remove).addClass(add);
    }
}), Document.implement({
    clearSelection: function() {
        if (window.getSelection) {
            var selection = window.getSelection();
            selection && selection.removeAllRanges && selection.removeAllRanges();
        } else if (document.selection && document.selection.empty) try {
            document.selection.empty();
        } catch (e) {}
    }
}), function() {
    var hideTheseOf = function(object) {
        var hideThese = object.options.hideInputs;
        if (window.OverText) {
            var otClasses = [ null ];
            OverText.each(function(ot) {
                otClasses.include("." + ot.options.labelClass);
            }), otClasses && (hideThese += otClasses.join(", "));
        }
        return hideThese ? object.element.getElements(hideThese) : null;
    };
    Fx.Reveal = new Class({
        Extends: Fx.Morph,
        options: {
            link: "cancel",
            styles: [ "padding", "border", "margin" ],
            transitionOpacity: !Browser.ie6,
            mode: "vertical",
            display: function() {
                return "tr" != this.element.get("tag") ? "block" : "table-row";
            },
            opacity: 1,
            hideInputs: Browser.ie ? "select, input, textarea, object, embed" : null
        },
        dissolve: function() {
            if (this.hiding || this.showing) "chain" == this.options.link ? this.chain(this.dissolve.bind(this)) : "cancel" != this.options.link || this.hiding || (this.cancel(), 
            this.dissolve()); else if ("none" != this.element.getStyle("display")) {
                this.hiding = !0, this.showing = !1, this.hidden = !0, this.cssText = this.element.style.cssText;
                var startStyles = this.element.getComputedSize({
                    styles: this.options.styles,
                    mode: this.options.mode
                });
                this.options.transitionOpacity && (startStyles.opacity = this.options.opacity);
                var zero = {};
                Object.each(startStyles, function(style, name) {
                    zero[name] = [ style, 0 ];
                }), this.element.setStyles({
                    display: Function.from(this.options.display).call(this),
                    overflow: "hidden"
                });
                var hideThese = hideTheseOf(this);
                hideThese && hideThese.setStyle("visibility", "hidden"), this.$chain.unshift(function() {
                    this.hidden && (this.hiding = !1, this.element.style.cssText = this.cssText, this.element.setStyle("display", "none"), 
                    hideThese && hideThese.setStyle("visibility", "visible")), this.fireEvent("hide", this.element), 
                    this.callChain();
                }.bind(this)), this.start(zero);
            } else this.callChain.delay(10, this), this.fireEvent("complete", this.element), 
            this.fireEvent("hide", this.element);
            return this;
        },
        reveal: function() {
            if (this.showing || this.hiding) "chain" == this.options.link ? this.chain(this.reveal.bind(this)) : "cancel" != this.options.link || this.showing || (this.cancel(), 
            this.reveal()); else if ("none" == this.element.getStyle("display")) {
                this.hiding = !1, this.showing = !0, this.hidden = !1, this.cssText = this.element.style.cssText;
                var startStyles;
                this.element.measure(function() {
                    startStyles = this.element.getComputedSize({
                        styles: this.options.styles,
                        mode: this.options.mode
                    });
                }.bind(this)), null != this.options.heightOverride && (startStyles.height = this.options.heightOverride.toInt()), 
                null != this.options.widthOverride && (startStyles.width = this.options.widthOverride.toInt()), 
                this.options.transitionOpacity && (this.element.setStyle("opacity", 0), startStyles.opacity = this.options.opacity);
                var zero = {
                    height: 0,
                    display: Function.from(this.options.display).call(this)
                };
                Object.each(startStyles, function(style, name) {
                    zero[name] = 0;
                }), zero.overflow = "hidden", this.element.setStyles(zero);
                var hideThese = hideTheseOf(this);
                hideThese && hideThese.setStyle("visibility", "hidden"), this.$chain.unshift(function() {
                    this.element.style.cssText = this.cssText, this.element.setStyle("display", Function.from(this.options.display).call(this)), 
                    this.hidden || (this.showing = !1), hideThese && hideThese.setStyle("visibility", "visible"), 
                    this.callChain(), this.fireEvent("show", this.element);
                }.bind(this)), this.start(startStyles);
            } else this.callChain(), this.fireEvent("complete", this.element), this.fireEvent("show", this.element);
            return this;
        },
        toggle: function() {
            return "none" == this.element.getStyle("display") ? this.reveal() : this.dissolve(), 
            this;
        },
        cancel: function() {
            return this.parent.apply(this, arguments), null != this.cssText && (this.element.style.cssText = this.cssText), 
            this.hiding = !1, this.showing = !1, this;
        }
    }), Element.Properties.reveal = {
        set: function(options) {
            return this.get("reveal").cancel().setOptions(options), this;
        },
        get: function() {
            var reveal = this.retrieve("reveal");
            return reveal || (reveal = new Fx.Reveal(this), this.store("reveal", reveal)), reveal;
        }
    }, Element.Properties.dissolve = Element.Properties.reveal, Element.implement({
        reveal: function(options) {
            return this.get("reveal").setOptions(options).reveal(), this;
        },
        dissolve: function(options) {
            return this.get("reveal").setOptions(options).dissolve(), this;
        },
        nix: function(options) {
            var params = Array.link(arguments, {
                destroy: Type.isBoolean,
                options: Type.isObject
            });
            return this.get("reveal").setOptions(options).dissolve().chain(function() {
                this[params.destroy ? "destroy" : "dispose"]();
            }.bind(this)), this;
        },
        wink: function() {
            var params = Array.link(arguments, {
                duration: Type.isNumber,
                options: Type.isObject
            }), reveal = this.get("reveal").setOptions(params.options);
            reveal.reveal().chain(function() {
                (function() {
                    reveal.dissolve();
                }).delay(params.duration || 2e3);
            });
        }
    });
}(), function() {
    function isBody(element) {
        return /^(?:body|html)$/i.test(element.tagName);
    }
    Fx.Scroll = new Class({
        Extends: Fx,
        options: {
            offset: {
                x: 0,
                y: 0
            },
            wheelStops: !0
        },
        initialize: function(element, options) {
            if (this.element = this.subject = document.id(element), this.parent(options), "element" != typeOf(this.element) && (this.element = document.id(this.element.getDocument().body)), 
            this.options.wheelStops) {
                var stopper = this.element, cancel = this.cancel.pass(!1, this);
                this.addEvent("start", function() {
                    stopper.addEvent("mousewheel", cancel);
                }, !0), this.addEvent("complete", function() {
                    stopper.removeEvent("mousewheel", cancel);
                }, !0);
            }
        },
        set: function() {
            var now = Array.flatten(arguments);
            return Browser.firefox && (now = [ Math.round(now[0]), Math.round(now[1]) ]), this.element.scrollTo(now[0], now[1]), 
            this;
        },
        compute: function(from, to, delta) {
            return [ 0, 1 ].map(function(i) {
                return Fx.compute(from[i], to[i], delta);
            });
        },
        start: function(x, y) {
            if (!this.check(x, y)) return this;
            var scroll = this.element.getScroll();
            return this.parent([ scroll.x, scroll.y ], [ x, y ]);
        },
        calculateScroll: function(x, y) {
            var element = this.element, scrollSize = element.getScrollSize(), scroll = element.getScroll(), size = element.getSize(), offset = this.options.offset, values = {
                x: x,
                y: y
            };
            for (var z in values) values[z] || 0 === values[z] || (values[z] = scroll[z]), "number" != typeOf(values[z]) && (values[z] = scrollSize[z] - size[z]), 
            values[z] += offset[z];
            return [ values.x, values.y ];
        },
        toTop: function() {
            return this.start.apply(this, this.calculateScroll(!1, 0));
        },
        toLeft: function() {
            return this.start.apply(this, this.calculateScroll(0, !1));
        },
        toRight: function() {
            return this.start.apply(this, this.calculateScroll("right", !1));
        },
        toBottom: function() {
            return this.start.apply(this, this.calculateScroll(!1, "bottom"));
        },
        toElement: function(el, axes) {
            axes = axes ? Array.from(axes) : [ "x", "y" ];
            var scroll = isBody(this.element) ? {
                x: 0,
                y: 0
            } : this.element.getScroll(), position = Object.map(document.id(el).getPosition(this.element), function(value, axis) {
                return axes.contains(axis) ? value + scroll[axis] : !1;
            });
            return this.start.apply(this, this.calculateScroll(position.x, position.y));
        },
        toElementEdge: function(el, axes, offset) {
            axes = axes ? Array.from(axes) : [ "x", "y" ], el = document.id(el);
            var to = {}, coords = el.getCoordinates(this.element), scroll = this.element.getScroll(), containerSize = this.element.getSize(), edge = {
                x: coords.right + scroll.x,
                y: coords.bottom + scroll.y
            };
            return [ "x", "y" ].each(function(axis) {
                axes.contains(axis) && edge[axis] > scroll[axis] + containerSize[axis] && (to[axis] = edge[axis] - containerSize[axis]), 
                null == to[axis] && (to[axis] = scroll[axis]), offset && offset[axis] && (to[axis] = to[axis] + offset[axis]);
            }), to.x != scroll.x || to.y != scroll.y ? this.start(to.x, to.y) : this;
        },
        toElementCenter: function(el, axes, offset) {
            axes = axes ? Array.from(axes) : [ "x", "y" ], el = document.id(el);
            var to = {}, position = el.getPosition(this.element), size = el.getSize(), scroll = this.element.getScroll(), containerSize = this.element.getSize();
            return [ "x", "y" ].each(function(axis) {
                axes.contains(axis) && (to[axis] = position[axis] - (containerSize[axis] - size[axis]) / 2), 
                null == to[axis] && (to[axis] = scroll[axis]), offset && offset[axis] && (to[axis] = to[axis] + offset[axis]);
            }, this), (to.x != scroll.x || to.y != scroll.y) && this.start(to.x, to.y), this;
        }
    });
}(), Fx.Slide = new Class({
    Extends: Fx,
    options: {
        mode: "vertical",
        wrapper: !1,
        hideOverflow: !0,
        resetHeight: !1
    },
    initialize: function(element, options) {
        element = this.element = this.subject = document.id(element), this.parent(options), 
        options = this.options;
        var wrapper = element.retrieve("wrapper"), styles = element.getStyles("margin", "position", "overflow");
        options.hideOverflow && (styles = Object.append(styles, {
            overflow: "hidden"
        })), options.wrapper && (wrapper = document.id(options.wrapper).setStyles(styles)), 
        wrapper || (wrapper = new Element("div", {
            styles: styles
        }).wraps(element)), element.store("wrapper", wrapper).setStyle("margin", 0), "visible" == element.getStyle("overflow") && element.setStyle("overflow", "hidden"), 
        this.now = [], this.open = !0, this.wrapper = wrapper, this.addEvent("complete", function() {
            this.open = 0 != wrapper["offset" + this.layout.capitalize()], this.open && this.options.resetHeight && wrapper.setStyle("height", "");
        }, !0);
    },
    vertical: function() {
        this.margin = "margin-top", this.layout = "height", this.offset = this.element.offsetHeight;
    },
    horizontal: function() {
        this.margin = "margin-left", this.layout = "width", this.offset = this.element.offsetWidth;
    },
    set: function(now) {
        return this.element.setStyle(this.margin, now[0]), this.wrapper.setStyle(this.layout, now[1]), 
        this;
    },
    compute: function(from, to, delta) {
        return [ 0, 1 ].map(function(i) {
            return Fx.compute(from[i], to[i], delta);
        });
    },
    start: function(how, mode) {
        if (!this.check(how, mode)) return this;
        this[mode || this.options.mode]();
        var start, margin = this.element.getStyle(this.margin).toInt(), layout = this.wrapper.getStyle(this.layout).toInt(), caseIn = [ [ margin, layout ], [ 0, this.offset ] ], caseOut = [ [ margin, layout ], [ -this.offset, 0 ] ];
        switch (how) {
          case "in":
            start = caseIn;
            break;

          case "out":
            start = caseOut;
            break;

          case "toggle":
            start = 0 == layout ? caseIn : caseOut;
        }
        return this.parent(start[0], start[1]);
    },
    slideIn: function(mode) {
        return this.start("in", mode);
    },
    slideOut: function(mode) {
        return this.start("out", mode);
    },
    hide: function(mode) {
        return this[mode || this.options.mode](), this.open = !1, this.set([ -this.offset, 0 ]);
    },
    show: function(mode) {
        return this[mode || this.options.mode](), this.open = !0, this.set([ 0, this.offset ]);
    },
    toggle: function(mode) {
        return this.start("toggle", mode);
    }
}), Element.Properties.slide = {
    set: function(options) {
        return this.get("slide").cancel().setOptions(options), this;
    },
    get: function() {
        var slide = this.retrieve("slide");
        return slide || (slide = new Fx.Slide(this, {
            link: "cancel"
        }), this.store("slide", slide)), slide;
    }
}, Element.implement({
    slide: function(how, mode) {
        how = how || "toggle";
        var toggle, slide = this.get("slide");
        switch (how) {
          case "hide":
            slide.hide(mode);
            break;

          case "show":
            slide.show(mode);
            break;

          case "toggle":
            var flag = this.retrieve("slide:flag", slide.open);
            slide[flag ? "slideOut" : "slideIn"](mode), this.store("slide:flag", !flag), toggle = !0;
            break;

          default:
            slide.start(how, mode);
        }
        return toggle || this.eliminate("slide:flag"), this;
    }
});

var Drag = new Class({
    Implements: [ Events, Options ],
    options: {
        snap: 6,
        unit: "px",
        grid: !1,
        style: !0,
        limit: !1,
        handle: !1,
        invert: !1,
        preventDefault: !1,
        stopPropagation: !1,
        modifiers: {
            x: "left",
            y: "top"
        }
    },
    initialize: function() {
        var params = Array.link(arguments, {
            options: Type.isObject,
            element: function(obj) {
                return null != obj;
            }
        });
        this.element = document.id(params.element), this.document = this.element.getDocument(), 
        this.setOptions(params.options || {});
        var htype = typeOf(this.options.handle);
        this.handles = ("array" == htype || "collection" == htype ? $$(this.options.handle) : document.id(this.options.handle)) || this.element, 
        this.mouse = {
            now: {},
            pos: {}
        }, this.value = {
            start: {},
            now: {}
        }, this.selection = Browser.ie ? "selectstart" : "mousedown", Browser.ie && !Drag.ondragstartFixed && (document.ondragstart = Function.from(!1), 
        Drag.ondragstartFixed = !0), this.bound = {
            start: this.start.bind(this),
            check: this.check.bind(this),
            drag: this.drag.bind(this),
            stop: this.stop.bind(this),
            cancel: this.cancel.bind(this),
            eventStop: Function.from(!1)
        }, this.attach();
    },
    attach: function() {
        return this.handles.addEvent("mousedown", this.bound.start), this;
    },
    detach: function() {
        return this.handles.removeEvent("mousedown", this.bound.start), this;
    },
    start: function(event) {
        var options = this.options;
        if (!event.rightClick) {
            options.preventDefault && event.preventDefault(), options.stopPropagation && event.stopPropagation(), 
            this.mouse.start = event.page, this.fireEvent("beforeStart", this.element);
            var limit = options.limit;
            this.limit = {
                x: [],
                y: []
            };
            var z, coordinates;
            for (z in options.modifiers) if (options.modifiers[z]) {
                var style = this.element.getStyle(options.modifiers[z]);
                if (style && !style.match(/px$/) && (coordinates || (coordinates = this.element.getCoordinates(this.element.getOffsetParent())), 
                style = coordinates[options.modifiers[z]]), this.value.now[z] = options.style ? (style || 0).toInt() : this.element[options.modifiers[z]], 
                options.invert && (this.value.now[z] *= -1), this.mouse.pos[z] = event.page[z] - this.value.now[z], 
                limit && limit[z]) for (var i = 2; i--; ) {
                    var limitZI = limit[z][i];
                    (limitZI || 0 === limitZI) && (this.limit[z][i] = "function" == typeof limitZI ? limitZI() : limitZI);
                }
            }
            "number" == typeOf(this.options.grid) && (this.options.grid = {
                x: this.options.grid,
                y: this.options.grid
            });
            var events = {
                mousemove: this.bound.check,
                mouseup: this.bound.cancel
            };
            events[this.selection] = this.bound.eventStop, this.document.addEvents(events);
        }
    },
    check: function(event) {
        this.options.preventDefault && event.preventDefault();
        var distance = Math.round(Math.sqrt(Math.pow(event.page.x - this.mouse.start.x, 2) + Math.pow(event.page.y - this.mouse.start.y, 2)));
        distance > this.options.snap && (this.cancel(), this.document.addEvents({
            mousemove: this.bound.drag,
            mouseup: this.bound.stop
        }), this.fireEvent("start", [ this.element, event ]).fireEvent("snap", this.element));
    },
    drag: function(event) {
        var options = this.options;
        options.preventDefault && event.preventDefault(), this.mouse.now = event.page;
        for (var z in options.modifiers) options.modifiers[z] && (this.value.now[z] = this.mouse.now[z] - this.mouse.pos[z], 
        options.invert && (this.value.now[z] *= -1), options.limit && this.limit[z] && ((this.limit[z][1] || 0 === this.limit[z][1]) && this.value.now[z] > this.limit[z][1] ? this.value.now[z] = this.limit[z][1] : (this.limit[z][0] || 0 === this.limit[z][0]) && this.value.now[z] < this.limit[z][0] && (this.value.now[z] = this.limit[z][0])), 
        options.grid[z] && (this.value.now[z] -= (this.value.now[z] - (this.limit[z][0] || 0)) % options.grid[z]), 
        options.style ? this.element.setStyle(options.modifiers[z], this.value.now[z] + options.unit) : this.element[options.modifiers[z]] = this.value.now[z]);
        this.fireEvent("drag", [ this.element, event ]);
    },
    cancel: function(event) {
        this.document.removeEvents({
            mousemove: this.bound.check,
            mouseup: this.bound.cancel
        }), event && (this.document.removeEvent(this.selection, this.bound.eventStop), this.fireEvent("cancel", this.element));
    },
    stop: function(event) {
        var events = {
            mousemove: this.bound.drag,
            mouseup: this.bound.stop
        };
        events[this.selection] = this.bound.eventStop, this.document.removeEvents(events), 
        event && this.fireEvent("complete", [ this.element, event ]);
    }
});

Element.implement({
    makeResizable: function(options) {
        var drag = new Drag(this, Object.merge({
            modifiers: {
                x: "width",
                y: "height"
            }
        }, options));
        return this.store("resizer", drag), drag.addEvent("drag", function() {
            this.fireEvent("resize", drag);
        }.bind(this));
    }
}), Drag.Move = new Class({
    Extends: Drag,
    options: {
        droppables: [],
        container: !1,
        precalculate: !1,
        includeMargins: !0,
        checkDroppables: !0
    },
    initialize: function(element, options) {
        if (this.parent(element, options), element = this.element, this.droppables = $$(this.options.droppables), 
        this.container = document.id(this.options.container), this.container && "element" != typeOf(this.container) && (this.container = document.id(this.container.getDocument().body)), 
        this.options.style) {
            if ("left" == this.options.modifiers.x && "top" == this.options.modifiers.y) {
                var parent = element.getOffsetParent(), styles = element.getStyles("left", "top");
                !parent || "auto" != styles.left && "auto" != styles.top || element.setPosition(element.getPosition(parent));
            }
            "static" == element.getStyle("position") && element.setStyle("position", "absolute");
        }
        this.addEvent("start", this.checkDroppables, !0), this.overed = null;
    },
    start: function(event) {
        this.container && (this.options.limit = this.calculateLimit()), this.options.precalculate && (this.positions = this.droppables.map(function(el) {
            return el.getCoordinates();
        })), this.parent(event);
    },
    calculateLimit: function() {
        var element = this.element, container = this.container, offsetParent = document.id(element.getOffsetParent()) || document.body, containerCoordinates = container.getCoordinates(offsetParent), elementMargin = {}, elementBorder = {}, containerMargin = {}, containerBorder = {}, offsetParentPadding = {};
        [ "top", "right", "bottom", "left" ].each(function(pad) {
            elementMargin[pad] = element.getStyle("margin-" + pad).toInt(), elementBorder[pad] = element.getStyle("border-" + pad).toInt(), 
            containerMargin[pad] = container.getStyle("margin-" + pad).toInt(), containerBorder[pad] = container.getStyle("border-" + pad).toInt(), 
            offsetParentPadding[pad] = offsetParent.getStyle("padding-" + pad).toInt();
        }, this);
        var width = element.offsetWidth + elementMargin.left + elementMargin.right, height = element.offsetHeight + elementMargin.top + elementMargin.bottom, left = 0, top = 0, right = containerCoordinates.right - containerBorder.right - width, bottom = containerCoordinates.bottom - containerBorder.bottom - height;
        if (this.options.includeMargins ? (left += elementMargin.left, top += elementMargin.top) : (right += elementMargin.right, 
        bottom += elementMargin.bottom), "relative" == element.getStyle("position")) {
            var coords = element.getCoordinates(offsetParent);
            coords.left -= element.getStyle("left").toInt(), coords.top -= element.getStyle("top").toInt(), 
            left -= coords.left, top -= coords.top, "relative" != container.getStyle("position") && (left += containerBorder.left, 
            top += containerBorder.top), right += elementMargin.left - coords.left, bottom += elementMargin.top - coords.top, 
            container != offsetParent && (left += containerMargin.left + offsetParentPadding.left, 
            top += (Browser.ie6 || Browser.ie7 ? 0 : containerMargin.top) + offsetParentPadding.top);
        } else left -= elementMargin.left, top -= elementMargin.top, container != offsetParent && (left += containerCoordinates.left + containerBorder.left, 
        top += containerCoordinates.top + containerBorder.top);
        return {
            x: [ left, right ],
            y: [ top, bottom ]
        };
    },
    getDroppableCoordinates: function(element) {
        var position = element.getCoordinates();
        if ("fixed" == element.getStyle("position")) {
            var scroll = window.getScroll();
            position.left += scroll.x, position.right += scroll.x, position.top += scroll.y, 
            position.bottom += scroll.y;
        }
        return position;
    },
    checkDroppables: function() {
        var overed = this.droppables.filter(function(el, i) {
            el = this.positions ? this.positions[i] : this.getDroppableCoordinates(el);
            var now = this.mouse.now;
            return now.x > el.left && now.x < el.right && now.y < el.bottom && now.y > el.top;
        }, this).getLast();
        this.overed != overed && (this.overed && this.fireEvent("leave", [ this.element, this.overed ]), 
        overed && this.fireEvent("enter", [ this.element, overed ]), this.overed = overed);
    },
    drag: function(event) {
        this.parent(event), this.options.checkDroppables && this.droppables.length && this.checkDroppables();
    },
    stop: function(event) {
        return this.checkDroppables(), this.fireEvent("drop", [ this.element, this.overed, event ]), 
        this.overed = null, this.parent(event);
    }
}), Element.implement({
    makeDraggable: function(options) {
        var drag = new Drag.Move(this, options);
        return this.store("dragger", drag), drag;
    }
});

var Slider = new Class({
    Implements: [ Events, Options ],
    Binds: [ "clickedElement", "draggedKnob", "scrolledElement" ],
    options: {
        onTick: function(position) {
            this.setKnobPosition(position);
        },
        initialStep: 0,
        snap: !1,
        offset: 0,
        range: !1,
        wheel: !1,
        steps: 100,
        mode: "horizontal"
    },
    initialize: function(element, knob, options) {
        this.setOptions(options), options = this.options, this.element = document.id(element), 
        knob = this.knob = document.id(knob), this.previousChange = this.previousEnd = this.step = -1;
        var limit = {}, modifiers = {
            x: !1,
            y: !1
        };
        switch (options.mode) {
          case "vertical":
            this.axis = "y", this.property = "top", this.offset = "offsetHeight";
            break;

          case "horizontal":
            this.axis = "x", this.property = "left", this.offset = "offsetWidth";
        }
        this.setSliderDimensions(), this.setRange(options.range), "static" == knob.getStyle("position") && knob.setStyle("position", "relative"), 
        knob.setStyle(this.property, -options.offset), modifiers[this.axis] = this.property, 
        limit[this.axis] = [ -options.offset, this.full - options.offset ];
        var dragOptions = {
            snap: 0,
            limit: limit,
            modifiers: modifiers,
            onDrag: this.draggedKnob,
            onStart: this.draggedKnob,
            onBeforeStart: function() {
                this.isDragging = !0;
            }.bind(this),
            onCancel: function() {
                this.isDragging = !1;
            }.bind(this),
            onComplete: function() {
                this.isDragging = !1, this.draggedKnob(), this.end();
            }.bind(this)
        };
        options.snap && this.setSnap(dragOptions), this.drag = new Drag(knob, dragOptions), 
        this.attach(), null != options.initialStep && this.set(options.initialStep);
    },
    attach: function() {
        return this.element.addEvent("mousedown", this.clickedElement), this.options.wheel && this.element.addEvent("mousewheel", this.scrolledElement), 
        this.drag.attach(), this;
    },
    detach: function() {
        return this.element.removeEvent("mousedown", this.clickedElement).removeEvent("mousewheel", this.scrolledElement), 
        this.drag.detach(), this;
    },
    autosize: function() {
        return this.setSliderDimensions().setKnobPosition(this.toPosition(this.step)), this.drag.options.limit[this.axis] = [ -this.options.offset, this.full - this.options.offset ], 
        this.options.snap && this.setSnap(), this;
    },
    setSnap: function(options) {
        return options || (options = this.drag.options), options.grid = Math.ceil(this.stepWidth), 
        options.limit[this.axis][1] = this.full, this;
    },
    setKnobPosition: function(position) {
        return this.options.snap && (position = this.toPosition(this.step)), this.knob.setStyle(this.property, position), 
        this;
    },
    setSliderDimensions: function() {
        return this.full = this.element.measure(function() {
            return this.half = this.knob[this.offset] / 2, this.element[this.offset] - this.knob[this.offset] + 2 * this.options.offset;
        }.bind(this)), this;
    },
    set: function(step) {
        return this.range > 0 ^ step < this.min || (step = this.min), this.range > 0 ^ step > this.max || (step = this.max), 
        this.step = Math.round(step), this.checkStep().fireEvent("tick", this.toPosition(this.step)).end();
    },
    setRange: function(range, pos) {
        return this.min = Array.pick([ range[0], 0 ]), this.max = Array.pick([ range[1], this.options.steps ]), 
        this.range = this.max - this.min, this.steps = this.options.steps || this.full, 
        this.stepSize = Math.abs(this.range) / this.steps, this.stepWidth = this.stepSize * this.full / Math.abs(this.range), 
        range && this.set(Array.pick([ pos, this.step ]).floor(this.min).max(this.max)), 
        this;
    },
    clickedElement: function(event) {
        if (!this.isDragging && event.target != this.knob) {
            var dir = this.range < 0 ? -1 : 1, position = event.page[this.axis] - this.element.getPosition()[this.axis] - this.half;
            position = position.limit(-this.options.offset, this.full - this.options.offset), 
            this.step = Math.round(this.min + dir * this.toStep(position)), this.checkStep().fireEvent("tick", position).end();
        }
    },
    scrolledElement: function(event) {
        var mode = "horizontal" == this.options.mode ? event.wheel < 0 : event.wheel > 0;
        this.set(this.step + (mode ? -1 : 1) * this.stepSize), event.stop();
    },
    draggedKnob: function() {
        var dir = this.range < 0 ? -1 : 1, position = this.drag.value.now[this.axis];
        position = position.limit(-this.options.offset, this.full - this.options.offset), 
        this.step = Math.round(this.min + dir * this.toStep(position)), this.checkStep();
    },
    checkStep: function() {
        var step = this.step;
        return this.previousChange != step && (this.previousChange = step, this.fireEvent("change", step)), 
        this;
    },
    end: function() {
        var step = this.step;
        return this.previousEnd !== step && (this.previousEnd = step, this.fireEvent("complete", step + "")), 
        this;
    },
    toStep: function(position) {
        var step = (position + this.options.offset) * this.stepSize / this.full * this.steps;
        return this.options.steps ? Math.round(step -= step % this.stepSize) : step;
    },
    toPosition: function(step) {
        return this.full * Math.abs(this.min - step) / (this.steps * this.stepSize) - this.options.offset;
    }
}), Asset = {
    javascript: function(source, properties) {
        properties || (properties = {});
        var script = new Element("script", {
            src: source,
            type: "text/javascript"
        }), doc = properties.document || document, load = properties.onload || properties.onLoad;
        return delete properties.onload, delete properties.onLoad, delete properties.document, 
        load && ("undefined" != typeof script.onreadystatechange ? script.addEvent("readystatechange", function() {
            [ "loaded", "complete" ].contains(this.readyState) && load.call(this);
        }) : script.addEvent("load", load)), script.set(properties).inject(doc.head);
    },
    css: function(source, properties) {
        properties || (properties = {});
        var link = new Element("link", {
            rel: "stylesheet",
            media: "screen",
            type: "text/css",
            href: source
        }), load = properties.onload || properties.onLoad, doc = properties.document || document;
        return delete properties.onload, delete properties.onLoad, delete properties.document, 
        load && link.addEvent("load", load), link.set(properties).inject(doc.head);
    },
    image: function(source, properties) {
        properties || (properties = {});
        var image = new Image(), element = document.id(image) || new Element("img");
        return [ "load", "abort", "error" ].each(function(name) {
            var type = "on" + name, cap = "on" + name.capitalize(), event = properties[type] || properties[cap] || function() {};
            delete properties[cap], delete properties[type], image[type] = function() {
                image && (element.parentNode || (element.width = image.width, element.height = image.height), 
                image = image.onload = image.onabort = image.onerror = null, event.delay(1, element, element), 
                element.fireEvent(name, element, 1));
            };
        }), image.src = element.src = source, image && image.complete && image.onload.delay(1), 
        element.set(properties);
    },
    images: function(sources, options) {
        sources = Array.from(sources);
        var fn = function() {}, counter = 0;
        return options = Object.merge({
            onComplete: fn,
            onProgress: fn,
            onError: fn,
            properties: {}
        }, options), new Elements(sources.map(function(source, index) {
            return Asset.image(source, Object.append(options.properties, {
                onload: function() {
                    counter++, options.onProgress.call(this, counter, index, source), counter == sources.length && options.onComplete();
                },
                onerror: function() {
                    counter++, options.onError.call(this, counter, index, source), counter == sources.length && options.onComplete();
                }
            }));
        }));
    }
};

!function() {
    var Color = this.Color = new Type("Color", function(color, type) {
        switch (arguments.length >= 3 ? (type = "rgb", color = Array.slice(arguments, 0, 3)) : "string" == typeof color && (color = color.match(/rgb/) ? color.rgbToHex().hexToRgb(!0) : color.match(/hsb/) ? color.hsbToRgb() : color.hexToRgb(!0)), 
        type = type || "rgb") {
          case "hsb":
            var old = color;
            color = color.hsbToRgb(), color.hsb = old;
            break;

          case "hex":
            color = color.hexToRgb(!0);
        }
        return color.rgb = color.slice(0, 3), color.hsb = color.hsb || color.rgbToHsb(), 
        color.hex = color.rgbToHex(), Object.append(color, this);
    });
    Color.implement({
        mix: function() {
            var colors = Array.slice(arguments), alpha = "number" == typeOf(colors.getLast()) ? colors.pop() : 50, rgb = this.slice();
            return colors.each(function(color) {
                color = new Color(color);
                for (var i = 0; 3 > i; i++) rgb[i] = Math.round(rgb[i] / 100 * (100 - alpha) + color[i] / 100 * alpha);
            }), new Color(rgb, "rgb");
        },
        invert: function() {
            return new Color(this.map(function(value) {
                return 255 - value;
            }));
        },
        setHue: function(value) {
            return new Color([ value, this.hsb[1], this.hsb[2] ], "hsb");
        },
        setSaturation: function(percent) {
            return new Color([ this.hsb[0], percent, this.hsb[2] ], "hsb");
        },
        setBrightness: function(percent) {
            return new Color([ this.hsb[0], this.hsb[1], percent ], "hsb");
        }
    }), this.$RGB = function(r, g, b) {
        return new Color([ r, g, b ], "rgb");
    }, this.$HSB = function(h, s, b) {
        return new Color([ h, s, b ], "hsb");
    }, this.$HEX = function(hex) {
        return new Color(hex, "hex");
    }, Array.implement({
        rgbToHsb: function() {
            var red = this[0], green = this[1], blue = this[2], hue = 0, max = Math.max(red, green, blue), min = Math.min(red, green, blue), delta = max - min, brightness = max / 255, saturation = 0 != max ? delta / max : 0;
            if (0 != saturation) {
                var rr = (max - red) / delta, gr = (max - green) / delta, br = (max - blue) / delta;
                hue = red == max ? br - gr : green == max ? 2 + rr - br : 4 + gr - rr, hue /= 6, 
                0 > hue && hue++;
            }
            return [ Math.round(360 * hue), Math.round(100 * saturation), Math.round(100 * brightness) ];
        },
        hsbToRgb: function() {
            var br = Math.round(255 * (this[2] / 100));
            if (0 == this[1]) return [ br, br, br ];
            var hue = this[0] % 360, f = hue % 60, p = Math.round(255 * (this[2] * (100 - this[1]) / 1e4)), q = Math.round(255 * (this[2] * (6e3 - this[1] * f) / 6e5)), t = Math.round(255 * (this[2] * (6e3 - this[1] * (60 - f)) / 6e5));
            switch (Math.floor(hue / 60)) {
              case 0:
                return [ br, t, p ];

              case 1:
                return [ q, br, p ];

              case 2:
                return [ p, br, t ];

              case 3:
                return [ p, q, br ];

              case 4:
                return [ t, p, br ];

              case 5:
                return [ br, p, q ];
            }
            return !1;
        }
    }), String.implement({
        rgbToHsb: function() {
            var rgb = this.match(/\d{1,3}/g);
            return rgb ? rgb.rgbToHsb() : null;
        },
        hsbToRgb: function() {
            var hsb = this.match(/\d{1,3}/g);
            return hsb ? hsb.hsbToRgb() : null;
        }
    });
}(), function() {
    var Keyboard = this.Keyboard = new Class({
        Extends: Events,
        Implements: [ Options ],
        options: {
            defaultEventType: "keydown",
            active: !1,
            manager: null,
            events: {},
            nonParsedEvents: [ "activate", "deactivate", "onactivate", "ondeactivate", "changed", "onchanged" ]
        },
        initialize: function(options) {
            options && options.manager && (this._manager = options.manager, delete options.manager), 
            this.setOptions(options), this._setup();
        },
        addEvent: function(type, fn, internal) {
            return this.parent(Keyboard.parse(type, this.options.defaultEventType, this.options.nonParsedEvents), fn, internal);
        },
        removeEvent: function(type, fn) {
            return this.parent(Keyboard.parse(type, this.options.defaultEventType, this.options.nonParsedEvents), fn);
        },
        toggleActive: function() {
            return this[this.isActive() ? "deactivate" : "activate"]();
        },
        activate: function(instance) {
            if (instance) {
                if (instance.isActive()) return this;
                this._activeKB && instance != this._activeKB && (this.previous = this._activeKB, 
                this.previous.fireEvent("deactivate")), this._activeKB = instance.fireEvent("activate"), 
                Keyboard.manager.fireEvent("changed");
            } else this._manager && this._manager.activate(this);
            return this;
        },
        isActive: function() {
            return this._manager ? this._manager._activeKB == this : Keyboard.manager == this;
        },
        deactivate: function(instance) {
            return instance ? instance === this._activeKB && (this._activeKB = null, instance.fireEvent("deactivate"), 
            Keyboard.manager.fireEvent("changed")) : this._manager && this._manager.deactivate(this), 
            this;
        },
        relinquish: function() {
            return this.isActive() && this._manager && this._manager.previous ? this._manager.activate(this._manager.previous) : this.deactivate(), 
            this;
        },
        manage: function(instance) {
            return instance._manager && instance._manager.drop(instance), this._instances.push(instance), 
            instance._manager = this, this._activeKB || this.activate(instance), this;
        },
        drop: function(instance) {
            return instance.relinquish(), this._instances.erase(instance), this._activeKB == instance && (this.previous && this._instances.contains(this.previous) ? this.activate(this.previous) : this._activeKB = this._instances[0]), 
            this;
        },
        trace: function() {
            Keyboard.trace(this);
        },
        each: function(fn) {
            Keyboard.each(this, fn);
        },
        _instances: [],
        _disable: function(instance) {
            this._activeKB == instance && (this._activeKB = null);
        },
        _setup: function() {
            this.addEvents(this.options.events), Keyboard.manager && !this._manager && Keyboard.manager.manage(this), 
            this.options.active ? this.activate() : this.relinquish();
        },
        _handle: function(event, type) {
            if (!event.preventKeyboardPropagation) {
                var bubbles = !!this._manager;
                bubbles && this._activeKB && (this._activeKB._handle(event, type), event.preventKeyboardPropagation) || (this.fireEvent(type, event), 
                !bubbles && this._activeKB && this._activeKB._handle(event, type));
            }
        }
    }), parsed = {}, modifiers = [ "shift", "control", "alt", "meta" ], regex = /^(?:shift|control|ctrl|alt|meta)$/;
    Keyboard.parse = function(type, eventType, ignore) {
        if (ignore && ignore.contains(type.toLowerCase())) return type;
        if (type = type.toLowerCase().replace(/^(keyup|keydown):/, function($0, $1) {
            return eventType = $1, "";
        }), !parsed[type]) {
            var key, mods = {};
            type.split("+").each(function(part) {
                regex.test(part) ? mods[part] = !0 : key = part;
            }), mods.control = mods.control || mods.ctrl;
            var keys = [];
            modifiers.each(function(mod) {
                mods[mod] && keys.push(mod);
            }), key && keys.push(key), parsed[type] = keys.join("+");
        }
        return eventType + ":keys(" + parsed[type] + ")";
    }, Keyboard.each = function(keyboard, fn) {
        for (var current = keyboard || Keyboard.manager; current; ) fn.run(current), current = current._activeKB;
    }, Keyboard.stop = function(event) {
        event.preventKeyboardPropagation = !0;
    }, Keyboard.manager = new Keyboard({
        active: !0
    }), Keyboard.trace = function(keyboard) {
        keyboard = keyboard || Keyboard.manager;
        var hasConsole = window.console && console.log;
        hasConsole && console.log("the following items have focus: "), Keyboard.each(keyboard, function(current) {
            hasConsole && console.log(document.id(current.widget) || current.wiget || current);
        });
    };
    var handler = function(event) {
        var keys = [];
        modifiers.each(function(mod) {
            event[mod] && keys.push(mod);
        }), regex.test(event.key) || keys.push(event.key), Keyboard.manager._handle(event, event.type + ":keys(" + keys.join("+") + ")");
    };
    document.addEvents({
        keyup: handler,
        keydown: handler
    });
}(), Keyboard.prototype.options.nonParsedEvents.combine([ "rebound", "onrebound" ]), 
Keyboard.implement({
    addShortcut: function(name, shortcut) {
        return this._shortcuts = this._shortcuts || [], this._shortcutIndex = this._shortcutIndex || {}, 
        shortcut.getKeyboard = Function.from(this), shortcut.name = name, this._shortcutIndex[name] = shortcut, 
        this._shortcuts.push(shortcut), shortcut.keys && this.addEvent(shortcut.keys, shortcut.handler), 
        this;
    },
    addShortcuts: function(obj) {
        for (var name in obj) this.addShortcut(name, obj[name]);
        return this;
    },
    removeShortcut: function(name) {
        var shortcut = this.getShortcut(name);
        return shortcut && shortcut.keys && (this.removeEvent(shortcut.keys, shortcut.handler), 
        delete this._shortcutIndex[name], this._shortcuts.erase(shortcut)), this;
    },
    removeShortcuts: function(names) {
        return names.each(this.removeShortcut, this), this;
    },
    getShortcuts: function() {
        return this._shortcuts || [];
    },
    getShortcut: function(name) {
        return (this._shortcutIndex || {})[name];
    }
}), Keyboard.rebind = function(newKeys, shortcuts) {
    Array.from(shortcuts).each(function(shortcut) {
        shortcut.getKeyboard().removeEvent(shortcut.keys, shortcut.handler), shortcut.getKeyboard().addEvent(newKeys, shortcut.handler), 
        shortcut.keys = newKeys, shortcut.getKeyboard().fireEvent("rebound");
    });
}, Keyboard.getActiveShortcuts = function(keyboard) {
    var activeKBS = [], activeSCS = [];
    return Keyboard.each(keyboard, [].push.bind(activeKBS)), activeKBS.each(function(kb) {
        activeSCS.extend(kb.getShortcuts());
    }), activeSCS;
}, Keyboard.getShortcut = function(name, keyboard, opts) {
    opts = opts || {};
    var shortcuts = opts.many ? [] : null, set = opts.many ? function(kb) {
        var shortcut = kb.getShortcut(name);
        shortcut && shortcuts.push(shortcut);
    } : function(kb) {
        shortcuts || (shortcuts = kb.getShortcut(name));
    };
    return Keyboard.each(keyboard, set), shortcuts;
}, Keyboard.getShortcuts = function(name, keyboard) {
    return Keyboard.getShortcut(name, keyboard, {
        many: !0
    });
};

var Handlebars = {};

!function(Handlebars, undefined) {
    Handlebars.VERSION = "1.0.0", Handlebars.COMPILER_REVISION = 4, Handlebars.REVISION_CHANGES = {
        1: "<= 1.0.rc.2",
        2: "== 1.0.0-rc.3",
        3: "== 1.0.0-rc.4",
        4: ">= 1.0.0"
    }, Handlebars.helpers = {}, Handlebars.partials = {};
    var toString = Object.prototype.toString, functionType = "[object Function]", objectType = "[object Object]";
    Handlebars.registerHelper = function(name, fn, inverse) {
        if (toString.call(name) === objectType) {
            if (inverse || fn) throw new Handlebars.Exception("Arg not supported with multiple helpers");
            Handlebars.Utils.extend(this.helpers, name);
        } else inverse && (fn.not = inverse), this.helpers[name] = fn;
    }, Handlebars.registerPartial = function(name, str) {
        toString.call(name) === objectType ? Handlebars.Utils.extend(this.partials, name) : this.partials[name] = str;
    }, Handlebars.registerHelper("helperMissing", function(arg) {
        if (2 === arguments.length) return undefined;
        throw new Error("Missing helper: '" + arg + "'");
    }), Handlebars.registerHelper("blockHelperMissing", function(context, options) {
        var inverse = options.inverse || function() {}, fn = options.fn, type = toString.call(context);
        return type === functionType && (context = context.call(this)), context === !0 ? fn(this) : context === !1 || null == context ? inverse(this) : "[object Array]" === type ? context.length > 0 ? Handlebars.helpers.each(context, options) : inverse(this) : fn(context);
    }), Handlebars.K = function() {}, Handlebars.createFrame = Object.create || function(object) {
        Handlebars.K.prototype = object;
        var obj = new Handlebars.K();
        return Handlebars.K.prototype = null, obj;
    }, Handlebars.logger = {
        DEBUG: 0,
        INFO: 1,
        WARN: 2,
        ERROR: 3,
        level: 3,
        methodMap: {
            0: "debug",
            1: "info",
            2: "warn",
            3: "error"
        },
        log: function(level, obj) {
            if (Handlebars.logger.level <= level) {
                var method = Handlebars.logger.methodMap[level];
                "undefined" != typeof console && console[method] && console[method].call(console, obj);
            }
        }
    }, Handlebars.log = function(level, obj) {
        Handlebars.logger.log(level, obj);
    }, Handlebars.registerHelper("each", function(context, options) {
        var data, fn = options.fn, inverse = options.inverse, i = 0, ret = "", type = toString.call(context);
        if (type === functionType && (context = context.call(this)), options.data && (data = Handlebars.createFrame(options.data)), 
        context && "object" == typeof context) if (context instanceof Array) for (var j = context.length; j > i; i++) data && (data.index = i), 
        ret += fn(context[i], {
            data: data
        }); else for (var key in context) context.hasOwnProperty(key) && (data && (data.key = key), 
        ret += fn(context[key], {
            data: data
        }), i++);
        return 0 === i && (ret = inverse(this)), ret;
    }), Handlebars.registerHelper("if", function(conditional, options) {
        var type = toString.call(conditional);
        return type === functionType && (conditional = conditional.call(this)), !conditional || Handlebars.Utils.isEmpty(conditional) ? options.inverse(this) : options.fn(this);
    }), Handlebars.registerHelper("unless", function(conditional, options) {
        return Handlebars.helpers["if"].call(this, conditional, {
            fn: options.inverse,
            inverse: options.fn
        });
    }), Handlebars.registerHelper("with", function(context, options) {
        var type = toString.call(context);
        return type === functionType && (context = context.call(this)), Handlebars.Utils.isEmpty(context) ? void 0 : options.fn(context);
    }), Handlebars.registerHelper("log", function(context, options) {
        var level = options.data && null != options.data.level ? parseInt(options.data.level, 10) : 1;
        Handlebars.log(level, context);
    });
    var errorProps = [ "description", "fileName", "lineNumber", "message", "name", "number", "stack" ];
    Handlebars.Exception = function() {
        for (var tmp = Error.prototype.constructor.apply(this, arguments), idx = 0; idx < errorProps.length; idx++) this[errorProps[idx]] = tmp[errorProps[idx]];
    }, Handlebars.Exception.prototype = new Error(), Handlebars.SafeString = function(string) {
        this.string = string;
    }, Handlebars.SafeString.prototype.toString = function() {
        return this.string.toString();
    };
    var escape = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#x27;",
        "`": "&#x60;"
    }, badChars = /[&<>"'`]/g, possible = /[&<>"'`]/, escapeChar = function(chr) {
        return escape[chr] || "&amp;";
    };
    Handlebars.Utils = {
        extend: function(obj, value) {
            for (var key in value) value.hasOwnProperty(key) && (obj[key] = value[key]);
        },
        escapeExpression: function(string) {
            return string instanceof Handlebars.SafeString ? string.toString() : null == string || string === !1 ? "" : (string = string.toString(), 
            possible.test(string) ? string.replace(badChars, escapeChar) : string);
        },
        isEmpty: function(value) {
            return value || 0 === value ? "[object Array]" === toString.call(value) && 0 === value.length ? !0 : !1 : !0;
        }
    }, Handlebars.VM = {
        template: function(templateSpec) {
            var container = {
                escapeExpression: Handlebars.Utils.escapeExpression,
                invokePartial: Handlebars.VM.invokePartial,
                programs: [],
                program: function(i, fn, data) {
                    var programWrapper = this.programs[i];
                    return data ? programWrapper = Handlebars.VM.program(i, fn, data) : programWrapper || (programWrapper = this.programs[i] = Handlebars.VM.program(i, fn)), 
                    programWrapper;
                },
                merge: function(param, common) {
                    var ret = param || common;
                    return param && common && (ret = {}, Handlebars.Utils.extend(ret, common), Handlebars.Utils.extend(ret, param)), 
                    ret;
                },
                programWithDepth: Handlebars.VM.programWithDepth,
                noop: Handlebars.VM.noop,
                compilerInfo: null
            };
            return function(context, options) {
                options = options || {};
                var result = templateSpec.call(container, Handlebars, context, options.helpers, options.partials, options.data), compilerInfo = container.compilerInfo || [], compilerRevision = compilerInfo[0] || 1, currentRevision = Handlebars.COMPILER_REVISION;
                if (compilerRevision !== currentRevision) {
                    if (currentRevision > compilerRevision) {
                        var runtimeVersions = Handlebars.REVISION_CHANGES[currentRevision], compilerVersions = Handlebars.REVISION_CHANGES[compilerRevision];
                        throw "Template was precompiled with an older version of Handlebars than the current runtime. Please update your precompiler to a newer version (" + runtimeVersions + ") or downgrade your runtime to an older version (" + compilerVersions + ").";
                    }
                    throw "Template was precompiled with a newer version of Handlebars than the current runtime. Please update your runtime to a newer version (" + compilerInfo[1] + ").";
                }
                return result;
            };
        },
        programWithDepth: function(i, fn, data) {
            var args = Array.prototype.slice.call(arguments, 3), program = function(context, options) {
                return options = options || {}, fn.apply(this, [ context, options.data || data ].concat(args));
            };
            return program.program = i, program.depth = args.length, program;
        },
        program: function(i, fn, data) {
            var program = function(context, options) {
                return options = options || {}, fn(context, options.data || data);
            };
            return program.program = i, program.depth = 0, program;
        },
        noop: function() {
            return "";
        },
        invokePartial: function(partial, name, context, helpers, partials, data) {
            var options = {
                helpers: helpers,
                partials: partials,
                data: data
            };
            if (partial === undefined) throw new Handlebars.Exception("The partial " + name + " could not be found");
            if (partial instanceof Function) return partial(context, options);
            if (Handlebars.compile) return partials[name] = Handlebars.compile(partial, {
                data: data !== undefined
            }), partials[name](context, options);
            throw new Handlebars.Exception("The partial " + name + " could not be compiled when running in runtime-only mode");
        }
    }, Handlebars.template = Handlebars.VM.template;
}(Handlebars), function() {
    var root = this, previousUnderscore = root._, ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype, push = ArrayProto.push, slice = ArrayProto.slice, concat = ArrayProto.concat, toString = ObjProto.toString, hasOwnProperty = ObjProto.hasOwnProperty, nativeIndexOf = ArrayProto.indexOf, nativeLastIndexOf = ArrayProto.lastIndexOf;
    FuncProto.bind;
    var _ = function(obj) {
        return obj instanceof _ ? obj : this instanceof _ ? (this._wrapped = obj, void 0) : new _(obj);
    };
    "undefined" != typeof exports ? ("undefined" != typeof module && module.exports && (exports = module.exports = _), 
    exports._ = _) : root._ = _, _.VERSION = "1.5.1";
    var isEnumerable = _.isEnumerable = Type.isEnumerable, each = _.each = _.forEach = function(obj, iterator, context) {
        return (isEnumerable(obj) ? Array : Object).forEach(obj, iterator, context);
    };
    _.map = _.collect = function(obj, iterator, context) {
        return (isEnumerable(obj) ? Array : Object).map(obj, iterator, context);
    }, _.reduce = _.foldl = _.inject = Array.reduce, _.reduceRight = _.foldr = Array.reduceRight, 
    _.find = _.detect = function(obj, iterator, context) {
        var result;
        return any(obj, function(value, index, list) {
            return iterator.call(context, value, index, list) ? (result = value, !0) : void 0;
        }), result;
    }, _.filter = _.select = function(obj, iterator, context) {
        return (isEnumerable(obj) ? Array : Object).filter(obj, iterator, context);
    }, _.reject = function(obj, iterator, context) {
        return _.filter(obj, function(value, index, list) {
            return !iterator.call(context, value, index, list);
        }, context);
    }, _.every = _.all = function(obj, iterator, context) {
        return (isEnumerable(obj) ? Array : Object).every(obj, iterator, context);
    };
    var any = _.some = _.any = function(obj, iterator, context) {
        return (isEnumerable(obj) ? Array : Object).some(obj, iterator, context);
    };
    _.contains = _.include = function(obj, target) {
        return null == obj ? !1 : nativeIndexOf && obj.indexOf === nativeIndexOf ? -1 != obj.indexOf(target) : any(obj, function(value) {
            return value === target;
        });
    }, _.invoke = function(obj, method) {
        var args = slice.call(arguments, 2), isFunc = _.isFunction(method);
        return _.map(obj, function(value) {
            return (isFunc ? method : value[method]).apply(value, args);
        });
    }, _.pluck = function(obj, key) {
        return _.map(obj, function(value) {
            return value[key];
        });
    }, _.where = function(obj, attrs, first) {
        return _.isEmpty(attrs) ? first ? void 0 : [] : _[first ? "find" : "filter"](obj, function(value) {
            for (var key in attrs) if (attrs[key] !== value[key]) return !1;
            return !0;
        });
    }, _.findWhere = function(obj, attrs) {
        return _.where(obj, attrs, !0);
    }, _.max = function(obj, iterator, context) {
        if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) return Math.max.apply(Math, obj);
        if (!iterator && _.isEmpty(obj)) return -1/0;
        var result = {
            computed: -1/0,
            value: -1/0
        };
        return each(obj, function(value, index, list) {
            var computed = iterator ? iterator.call(context, value, index, list) : value;
            computed > result.computed && (result = {
                value: value,
                computed: computed
            });
        }), result.value;
    }, _.min = function(obj, iterator, context) {
        if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) return Math.min.apply(Math, obj);
        if (!iterator && _.isEmpty(obj)) return 1/0;
        var result = {
            computed: 1/0,
            value: 1/0
        };
        return each(obj, function(value, index, list) {
            var computed = iterator ? iterator.call(context, value, index, list) : value;
            computed < result.computed && (result = {
                value: value,
                computed: computed
            });
        }), result.value;
    }, _.shuffle = function(obj) {
        var rand, index = 0, shuffled = [];
        return each(obj, function(value) {
            rand = _.random(index++), shuffled[index - 1] = shuffled[rand], shuffled[rand] = value;
        }), shuffled;
    };
    var lookupIterator = function(value) {
        return _.isFunction(value) ? value : function(obj) {
            return obj[value];
        };
    };
    _.sortBy = function(obj, value, context) {
        var iterator = lookupIterator(value);
        return _.pluck(_.map(obj, function(value, index, list) {
            return {
                value: value,
                index: index,
                criteria: iterator.call(context, value, index, list)
            };
        }).sort(function(left, right) {
            var a = left.criteria, b = right.criteria;
            if (a !== b) {
                if (a > b || void 0 === a) return 1;
                if (b > a || void 0 === b) return -1;
            }
            return left.index < right.index ? -1 : 1;
        }), "value");
    };
    var group = function(behavior) {
        return function(obj, value, context) {
            var result = {}, iterator = null == value ? _.identity : lookupIterator(value);
            return each(obj, function(value, index) {
                var key = iterator.call(context, value, index, obj);
                behavior(result, key, value);
            }), result;
        };
    };
    _.groupBy = group(function(result, key, value) {
        (_.has(result, key) ? result[key] : result[key] = []).push(value);
    }), _.indexBy = group(function(result, key, value) {
        result[key] = value;
    }), _.countBy = group(function(result, key) {
        _.has(result, key) ? result[key]++ : result[key] = 1;
    }), _.sortedIndex = function(array, obj, iterator, context) {
        iterator = null == iterator ? _.identity : lookupIterator(iterator);
        for (var value = iterator.call(context, obj), low = 0, high = array.length; high > low; ) {
            var mid = low + high >>> 1;
            iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
        }
        return low;
    }, _.toArray = function(obj) {
        return obj ? _.isArray(obj) ? slice.call(obj) : obj.length === +obj.length ? _.map(obj, _.identity) : _.values(obj) : [];
    }, _.size = function(obj) {
        return null == obj ? 0 : obj.length === +obj.length ? obj.length : _.keys(obj).length;
    }, _.first = _.head = _.take = function(array, n, guard) {
        return null == array ? void 0 : null == n || guard ? array[0] : slice.call(array, 0, n);
    }, _.initial = function(array, n, guard) {
        return slice.call(array, 0, array.length - (null == n || guard ? 1 : n));
    }, _.last = function(array, n, guard) {
        return null == array ? void 0 : null == n || guard ? array[array.length - 1] : slice.call(array, Math.max(array.length - n, 0));
    }, _.rest = _.tail = _.drop = function(array, n, guard) {
        return slice.call(array, null == n || guard ? 1 : n);
    }, _.compact = function(array) {
        return _.filter(array, _.identity);
    };
    var flatten = function(input, shallow, output) {
        return shallow && _.every(input, _.isArray) ? concat.apply(output, input) : (each(input, function(value) {
            _.isArray(value) || _.isArguments(value) ? shallow ? push.apply(output, value) : flatten(value, shallow, output) : output.push(value);
        }), output);
    };
    _.flatten = function(array, shallow) {
        return flatten(array, shallow, []);
    }, _.without = function(array) {
        return _.difference(array, slice.call(arguments, 1));
    }, _.uniq = _.unique = function(array, isSorted, iterator, context) {
        _.isFunction(isSorted) && (context = iterator, iterator = isSorted, isSorted = !1);
        var initial = iterator ? _.map(array, iterator, context) : array, results = [], seen = [];
        return each(initial, function(value, index) {
            (isSorted ? index && seen[seen.length - 1] === value : _.contains(seen, value)) || (seen.push(value), 
            results.push(array[index]));
        }), results;
    }, _.union = function() {
        return _.uniq(_.flatten(arguments, !0));
    }, _.intersection = function(array) {
        var rest = slice.call(arguments, 1);
        return _.filter(_.uniq(array), function(item) {
            return _.every(rest, function(other) {
                return _.indexOf(other, item) >= 0;
            });
        });
    }, _.difference = function(array) {
        var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
        return _.filter(array, function(value) {
            return !_.contains(rest, value);
        });
    }, _.zip = function() {
        for (var length = _.max(_.pluck(arguments, "length").concat(0)), results = new Array(length), i = 0; length > i; i++) results[i] = _.pluck(arguments, "" + i);
        return results;
    }, _.object = function(list, values) {
        if (null == list) return {};
        for (var result = {}, i = 0, length = list.length; length > i; i++) values ? result[list[i]] = values[i] : result[list[i][0]] = list[i][1];
        return result;
    }, _.indexOf = function(array, item, isSorted) {
        if (null == array) return -1;
        var i = 0, length = array.length;
        if (isSorted) {
            if ("number" != typeof isSorted) return i = _.sortedIndex(array, item), array[i] === item ? i : -1;
            i = 0 > isSorted ? Math.max(0, length + isSorted) : isSorted;
        }
        if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
        for (;length > i; i++) if (array[i] === item) return i;
        return -1;
    }, _.lastIndexOf = function(array, item, from) {
        if (null == array) return -1;
        var hasIndex = null != from;
        if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
        for (var i = hasIndex ? from : array.length; i--; ) if (array[i] === item) return i;
        return -1;
    }, _.range = function(start, stop, step) {
        arguments.length <= 1 && (stop = start || 0, start = 0), step = arguments[2] || 1;
        for (var length = Math.max(Math.ceil((stop - start) / step), 0), idx = 0, range = new Array(length); length > idx; ) range[idx++] = start, 
        start += step;
        return range;
    }, _.bind = function(fn) {
        return fn.bind(slice.call(arguments, 1));
    }, _.partial = function(func) {
        var args = slice.call(arguments, 1);
        return function() {
            return func.apply(this, args.concat(slice.call(arguments)));
        };
    }, _.bindAll = function(obj) {
        var funcs = slice.call(arguments, 1);
        if (0 === funcs.length) throw new Error("bindAll must be passed function names");
        return each(funcs, function(f) {
            obj[f] = _.bind(obj[f], obj);
        }), obj;
    }, _.memoize = function(func, hasher) {
        var memo = {};
        return hasher || (hasher = _.identity), function() {
            var key = hasher.apply(this, arguments);
            return _.has(memo, key) ? memo[key] : memo[key] = func.apply(this, arguments);
        };
    }, _.delay = function(func, delay, bind, args) {
        return func.delay(delay, bind, args);
    }, _.defer = function(func) {
        return _.delay.apply(_, [ func, 1 ].concat(slice.call(arguments, 1)));
    }, _.throttle = function(func, wait, options) {
        var context, args, result, timeout = null, previous = 0;
        options || (options = {});
        var later = function() {
            previous = options.leading === !1 ? 0 : new Date(), timeout = null, result = func.apply(context, args);
        };
        return function() {
            var now = new Date();
            previous || options.leading !== !1 || (previous = now);
            var remaining = wait - (now - previous);
            return context = this, args = arguments, 0 >= remaining ? (clearTimeout(timeout), 
            timeout = null, previous = now, result = func.apply(context, args)) : timeout || options.trailing === !1 || (timeout = setTimeout(later, remaining)), 
            result;
        };
    }, _.debounce = function(func, wait, immediate) {
        var result, timeout = null;
        return function() {
            var context = this, args = arguments, later = function() {
                timeout = null, immediate || (result = func.apply(context, args));
            }, callNow = immediate && !timeout;
            return clearTimeout(timeout), timeout = setTimeout(later, wait), callNow && (result = func.apply(context, args)), 
            result;
        };
    }, _.once = function(func) {
        var memo, ran = !1;
        return function() {
            return ran ? memo : (ran = !0, memo = func.apply(this, arguments), func = null, 
            memo);
        };
    }, _.wrap = function(func, wrapper) {
        return function() {
            var args = [ func ];
            return push.apply(args, arguments), wrapper.apply(this, args);
        };
    }, _.compose = function() {
        var funcs = arguments;
        return function() {
            for (var args = arguments, i = funcs.length - 1; i >= 0; i--) args = [ funcs[i].apply(this, args) ];
            return args[0];
        };
    }, _.after = function(times, func) {
        return function() {
            return --times < 1 ? func.apply(this, arguments) : void 0;
        };
    }, _.keys = Object.keys, _.values = Object.values, _.pairs = function(obj) {
        for (var keys = _.keys(obj), length = keys.length, pairs = new Array(length), i = 0; length > i; i++) pairs[i] = [ keys[i], obj[keys[i]] ];
        return pairs;
    }, _.invert = function(obj) {
        for (var result = {}, keys = _.keys(obj), i = 0, length = keys.length; length > i; i++) result[obj[keys[i]]] = keys[i];
        return result;
    }, _.functions = _.methods = function(obj) {
        var names = [];
        for (var key in obj) _.isFunction(obj[key]) && names.push(key);
        return names.sort();
    }, _.extend = Object.append, _.pick = function(obj) {
        return Object.subset(obj, slice.call(arguments, 1));
    }, _.omit = function(obj) {
        var copy = {}, keys = concat.apply(ArrayProto, slice.call(arguments, 1));
        for (var key in obj) _.contains(keys, key) || (copy[key] = obj[key]);
        return copy;
    }, _.defaults = function(obj) {
        return each(slice.call(arguments, 1), function(source) {
            if (source) for (var prop in source) void 0 === obj[prop] && (obj[prop] = source[prop]);
        }), obj;
    }, _.clone = function(obj) {
        return (isEnumerable(obj) ? Array : Object).clone(obj);
    }, _.tap = function(obj, interceptor) {
        return interceptor(obj), obj;
    };
    var eq = function(a, b, aStack, bStack) {
        if (a === b) return 0 !== a || 1 / a == 1 / b;
        if (null == a || null == b) return a === b;
        a instanceof _ && (a = a._wrapped), b instanceof _ && (b = b._wrapped);
        var className = toString.call(a);
        if (className != toString.call(b)) return !1;
        switch (className) {
          case "[object String]":
            return a == String(b);

          case "[object Number]":
            return a != +a ? b != +b : 0 == a ? 1 / a == 1 / b : a == +b;

          case "[object Date]":
          case "[object Boolean]":
            return +a == +b;

          case "[object RegExp]":
            return a.source == b.source && a.global == b.global && a.multiline == b.multiline && a.ignoreCase == b.ignoreCase;
        }
        if ("object" != typeof a || "object" != typeof b) return !1;
        for (var length = aStack.length; length--; ) if (aStack[length] == a) return bStack[length] == b;
        var aCtor = a.constructor, bCtor = b.constructor;
        if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor && _.isFunction(bCtor) && bCtor instanceof bCtor)) return !1;
        aStack.push(a), bStack.push(b);
        var size = 0, result = !0;
        if ("[object Array]" == className) {
            if (size = a.length, result = size == b.length) for (;size-- && (result = eq(a[size], b[size], aStack, bStack)); ) ;
        } else {
            for (var key in a) if (_.has(a, key) && (size++, !(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack)))) break;
            if (result) {
                for (key in b) if (_.has(b, key) && !size--) break;
                result = !size;
            }
        }
        return aStack.pop(), bStack.pop(), result;
    };
    _.isEqual = function(a, b) {
        return eq(a, b, [], []);
    }, _.isEmpty = function(obj) {
        if (null == obj) return !0;
        if (_.isArray(obj) || _.isString(obj)) return 0 === obj.length;
        for (var key in obj) if (_.has(obj, key)) return !1;
        return !0;
    }, each([ "Arguments", "Function", "String", "Number", "Date", "RegExp" ], function(name) {
        _["is" + name] = function(obj) {
            return toString.call(obj) == "[object " + name + "]";
        };
    }), each([ "Arguments", "Function", "String", "Number", "Date", "RegExp", "Element", "Array", "Object", "Boolean" ], function(name) {
        _["is" + name] = Type["is" + name];
    }), each([ "Finite", "NaN" ], function(name) {
        _["is" + name] = Number["is" + name];
    }), _.isNull = function(obj) {
        return null === obj;
    }, _.isUndefined = function(obj) {
        return void 0 === obj;
    }, _.has = function(obj, key) {
        return hasOwnProperty.call(obj, key);
    }, _.noConflict = function() {
        return root._ = previousUnderscore, this;
    }, _.identity = function(value) {
        return value;
    }, _.times = Number.times, _.random = Number.random;
    var entityMap = {
        escape: {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#x27;"
        }
    };
    entityMap.unescape = _.invert(entityMap.escape);
    var entityRegexes = {
        escape: new RegExp("[" + _.keys(entityMap.escape).join("") + "]", "g"),
        unescape: new RegExp("(" + _.keys(entityMap.unescape).join("|") + ")", "g")
    };
    _.each([ "escape", "unescape" ], function(method) {
        _[method] = function(string) {
            return null == string ? "" : ("" + string).replace(entityRegexes[method], function(match) {
                return entityMap[method][match];
            });
        };
    }), _.result = function(object, property) {
        if (null == object) return void 0;
        var value = object[property];
        return _.isFunction(value) ? value.call(object) : value;
    }, _.mixin = function(obj) {
        each(_.functions(obj), function(name) {
            var func = _[name] = obj[name];
            _.prototype[name] = function() {
                var args = [ this._wrapped ];
                return push.apply(args, arguments), result.call(this, func.apply(_, args));
            };
        });
    }, _.uniqueId = String.uniqueID, _.templateSettings = {
        evaluate: /<%([\s\S]+?)%>/g,
        interpolate: /<%=([\s\S]+?)%>/g,
        escape: /<%-([\s\S]+?)%>/g
    };
    var noMatch = /(.)^/, escapes = {
        "'": "'",
        "\\": "\\",
        "\r": "r",
        "\n": "n",
        "	": "t",
        "\u2028": "u2028",
        "\u2029": "u2029"
    }, escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;
    _.template = function(text, data, settings) {
        var render;
        settings = _.defaults({}, settings, _.templateSettings);
        var matcher = new RegExp([ (settings.escape || noMatch).source, (settings.interpolate || noMatch).source, (settings.evaluate || noMatch).source ].join("|") + "|$", "g"), index = 0, source = "__p+='";
        text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
            return source += text.slice(index, offset).replace(escaper, function(match) {
                return "\\" + escapes[match];
            }), escape && (source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'"), 
            interpolate && (source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'"), 
            evaluate && (source += "';\n" + evaluate + "\n__p+='"), index = offset + match.length, 
            match;
        }), source += "';\n", settings.variable || (source = "with(obj||{}){\n" + source + "}\n"), 
        source = "var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n" + source + "return __p;\n";
        try {
            render = new Function(settings.variable || "obj", "_", source);
        } catch (e) {
            throw e.source = source, e;
        }
        if (data) return render(data, _);
        var template = function(data) {
            return render.call(this, data, _);
        };
        return template.source = "function(" + (settings.variable || "obj") + "){\n" + source + "}", 
        template;
    }, _.chain = function(obj) {
        return _(obj).chain();
    };
    var result = function(obj) {
        return this._chain ? _(obj).chain() : obj;
    };
    _.mixin(_), each([ "pop", "push", "reverse", "shift", "sort", "splice", "unshift" ], function(name) {
        var method = ArrayProto[name];
        _.prototype[name] = function() {
            var obj = this._wrapped;
            return method.apply(obj, arguments), "shift" != name && "splice" != name || 0 !== obj.length || delete obj[0], 
            result.call(this, obj);
        };
    }), each([ "concat", "join", "slice" ], function(name) {
        var method = ArrayProto[name];
        _.prototype[name] = function() {
            return result.call(this, method.apply(this._wrapped, arguments));
        };
    }), _.extend(_.prototype, {
        chain: function() {
            return this._chain = !0, this;
        },
        value: function() {
            return this._wrapped;
        }
    });
}.call(this), function(_, undefined) {
    var ECMAspit = "ab".split(/a*/).length > 1 ? String.prototype.split : function(separator, limit) {
        if ("undefined" != typeof limit) throw "ECMAsplit: limit is unimplemented";
        var result = this.split.apply(this, arguments), re = RegExp(separator), savedIndex = re.lastIndex, match = re.exec(this);
        return match && 0 == match.index && result.unshift(""), re.lastIndex = savedIndex, 
        result;
    }, stringLambda = function(str) {
        var params = [], expr = str, sections = ECMAspit.call(expr, /\s*->\s*/m);
        if (sections.length > 1) for (;sections.length; ) expr = sections.pop(), params = sections.pop().split(/\s*,\s*|\s+/m), 
        sections.length && sections.push("(function(" + params + "){return (" + expr + ")})"); else if (expr.match(/\b_\b/)) params = "_"; else {
            var leftSection = expr.match(/^\s*(?:[+*\/%&|\^\.=<>]|!=)/m), rightSection = expr.match(/[+\-*\/%&|\^\.=<>!]\s*$/m);
            if (leftSection || rightSection) leftSection && (params.push("$1"), expr = "$1" + expr), 
            rightSection && (params.push("$2"), expr += "$2"); else for (var v, regex = /(?:\b[A-Z]|\.[a-zA-Z_$])[a-zA-Z_$\d]*|[a-zA-Z_$][a-zA-Z_$\d]*\s*:|this|arguments|'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"/g, vars = str.replace(regex, "").match(/([a-z_$][a-z_$\d]*)/gi) || [], i = 0; v = vars[i++]; ) params.indexOf(v) >= 0 || params.push(v);
        }
        return new Function(params, "return (" + expr + ")");
    }, stringToFunction = function(str) {
        return str.match(/\breturn\b/) ? new Function(str) : stringLambda(str);
    }, functional = _.func = {}, slice = Array.prototype.slice, concat = Array.prototype.concat;
    _.each([ "each", "map", "filter", "some", "every", "find", "sortBy", "groupBy", "invoke", "lookup" ], function(name) {
        functional[name] = function(fn, list) {
            return _[name].apply(this, [ list, fn ].concat(slice.call(arguments, 2)));
        };
    }), _.mixin({
        autoCurry: function(fn, numArgs) {
            return numArgs = numArgs || fn.length, function wrapper(prev_args) {
                return function() {
                    var args = concat.call(prev_args, slice.call(arguments));
                    return args.length < numArgs ? wrapper(args) : fn.apply(this, args);
                };
            }([]);
        },
        until: function(pred, fn) {
            return fn = _.lambda(fn), pred = _.lambda(pred), function(value) {
                for (;!pred.call(this, value); ) value = fn.call(this, value);
                return value;
            };
        },
        periodical: function(fn, period, bind, args) {
            return fn.periodical(period, bind, args);
        },
        merge: Object.merge,
        flip: function(f) {
            return function() {
                var args = Array.from(arguments);
                return args = args.slice(1, 2).concat(args.slice(0, 1)).concat(args.slice(2)), f.apply(null, args);
            };
        },
        and: function() {
            var args = arguments;
            return function() {
                var theseargs = arguments;
                return _.every(args, function(arg) {
                    return _.lambda(arg).apply(this, theseargs);
                }, this);
            };
        },
        or: function() {
            var args = _.map(arguments, _.identity);
            return function() {
                var theseargs = arguments;
                return _.some(args, function(arg) {
                    return _.lambda(arg).apply(this, theseargs);
                }, this);
            };
        },
        not: function(fn) {
            return fn = _.lambda(fn), function() {
                return !fn.apply(this, arguments);
            };
        },
        lambda: function(obj) {
            return _.isFunction(obj) ? obj : _.isString(obj) ? stringToFunction(obj) : _.toFunction(obj);
        },
        toFunction: Function.from,
        arrayarize: Array.from,
        toInt: Number.toInt,
        log: function() {
            console.log(arguments);
        },
        nextItem: function(xs, pos, dir) {
            pos = Math.min(_.size(xs), pos);
            var index = pos + (dir || 1);
            return index >= xs.length && (index %= xs.length), 0 > index && (index = xs.length + index % xs.length), 
            xs[index];
        },
        assign: function(obj, key, value) {
            for (var cur, keys = key.split("."), ptr = obj; (cur = keys.shift()) && keys.length; ) _.isObject(ptr[cur]) || (ptr[cur] = {}), 
            ptr = ptr[cur];
            return ptr[cur] = value, obj;
        },
        lookup: function(obj, key) {
            var type = typeof key;
            ("string" == type || "number" == type) && (key = ("" + key).split("."));
            for (var i = 0, l = key.length; l > i; i++) {
                if (!_.has(obj, key[i])) return undefined;
                obj = obj[key[i]];
            }
            return obj;
        },
        item: function(xs, n) {
            return null == xs ? null : xs[n];
        },
        last: Array.getLast,
        alias: function(obj, aliases, force) {
            function makeAliases(alias, key) {
                _.has(obj, key) && (_.isArray(alias) ? _.each(alias, function(alias) {
                    makeAliases(alias, key);
                }) : !_.isString(alias) || !force && _.has(obj, alias) || (obj[alias] = obj[key]));
            }
            return _.each(aliases, makeAliases), obj;
        }
    });
}(this._), function() {
    Array.implement({});
    var strp = String.prototype;
    [ "startsWith", "endsWith", "trimLeft", "trimRight" ].each(function(method) {
        try {
            strp[method] && strp[method].protect();
        } catch (o_O) {}
    }), String.implement({
        replaceAll: function(tofind, torep) {
            for (var ns = this; ns.indexOf(tofind) > -1; ) ns = ns.replace(tofind, torep);
            return ns;
        },
        splitMax: function(by, max) {
            var items = this.split(by), len = max - 1, newitems = items.slice(0, len);
            return items.length >= max && newitems.push(items.slice(len).join(by)), newitems;
        },
        startsWith: function(what, pos) {
            return this.slice(pos || 0, what.length) == what;
        },
        endsWith: function(what, pos) {
            return this.slice(this.length - what.length - (pos || 0)) == what;
        },
        trimRight: function() {
            return String(this).replace(/~+$/, "");
        },
        trimLeft: function() {
            return String(this).replace(/^\s+/, "");
        }
    }).extend({
        escapeHTML: _.escape
    }), Element.Properties.val = Element.Properties.value = {
        get: function() {
            return this["checkbox" == this.get("type") ? "checked" : "value"];
        },
        set: function(val) {
            this["checkbox" == this.get("type") ? "checked" : "value"] = val;
        }
    };
    var adopt = Element.prototype.adopt, inject = Element.prototype.inject;
    if ([ "html", "text", "val" ].each(function(fn) {
        Element.implement(fn, function(data) {
            return "undefined" != typeof data ? this.set(fn, data) : this.get(fn);
        });
    }), Element.implement({
        adopt: function() {
            return adopt.apply(this, arguments).fireEvent("adopt", arguments);
        },
        disown: function() {
            return Array.each(arguments, function(element) {
                element = document.id(element, !0), element && element.dispose();
            }), this.fireEvent("disown", arguments), this;
        },
        inject: function(el) {
            var ret = inject.apply(this, arguments);
            return el.fireEvent("adopt", arguments), ret;
        },
        maxChildren: function(n) {
            for (var ele, c = this.children; c.length >= n && (ele = this.firstChild); ) ele.dispose();
            return this;
        },
        insertAt: function(element, position) {
            return this.insertBefore(element, this.childNodes[position] || null);
        },
        isDisplayed: function() {
            return !this.hasClass("hidden");
        },
        show: function() {
            return this.removeClass("hidden");
        },
        hide: function() {
            return this.addClass("hidden");
        },
        toggle: function(state) {
            return null == state && (state = !this.isDisplayed()), this[state ? "show" : "hide"]();
        },
        swapParent: function(parent) {
            return this.dispose(), parent.adopt(this);
        },
        addClasses: function() {
            return Array.each(arguments, this.addClass, this), this;
        },
        removeClasses: function() {
            return Array.each(arguments, this.removeClass, this), this;
        },
        hasClasses: function() {
            Array.every(arguments, this.hasClass, this);
        }
    }), this.document && !Type.isFunction(document.hasFocus)) {
        var focus = !0;
        window.addEvents({
            focus: function() {
                focus = !0;
            },
            blur: function() {
                focus = !1;
            }
        }), document.hasFocus = function() {
            return focus;
        };
    }
    this.$lambda = Function.from, this.$chk = function(obj) {
        return !(!obj && 0 !== obj);
    }, this.$clear = function(timer) {
        return clearTimeout(timer), clearInterval(timer), null;
    }, this.$defined = function(obj) {
        return null != obj;
    }, this.$A = Array.from;
}(), Class.Occlude = new Class({
    occlude: function(property, element) {
        element = document.id(element || this.element);
        var instance = element.retrieve(property || this.property);
        return instance && !this.occluded ? this.occluded = instance : (this.occluded = !1, 
        element.store(property || this.property, this), this.occluded);
    }
}), String.implement({
    parseQueryString: function(decodeKeys, decodeValues) {
        null == decodeKeys && (decodeKeys = !0), null == decodeValues && (decodeValues = !0);
        var vars = this.split(/[&;]/), object = {};
        return vars.length ? (vars.each(function(val) {
            var index = val.indexOf("=") + 1, value = index ? val.substr(index) : "", keys = index ? val.substr(0, index - 1).match(/([^\]\[]+|(\B)(?=\]))/g) : [ val ], obj = object;
            keys && (decodeValues && (value = decodeURIComponent(value)), keys.each(function(key, i) {
                decodeKeys && (key = decodeURIComponent(key));
                var current = obj[key];
                i < keys.length - 1 ? obj = obj[key] = current || {} : "array" == typeOf(current) ? current.push(value) : obj[key] = null != current ? [ current, value ] : value;
            }));
        }), object) : object;
    },
    cleanQueryString: function(method) {
        return this.split("&").filter(function(val) {
            var index = val.indexOf("="), key = 0 > index ? "" : val.substr(0, index), value = val.substr(index + 1);
            return method ? method.call(null, key, value) : value || 0 === value;
        }).join("&");
    }
}), function() {
    var Table = this.Table = function() {
        this.length = 0;
        var keys = [], values = [];
        this.set = function(key, value) {
            var index = keys.indexOf(key);
            if (-1 == index) {
                var length = keys.length;
                keys[length] = key, values[length] = value, this.length++;
            } else values[index] = value;
            return this;
        }, this.get = function(key) {
            var index = keys.indexOf(key);
            return -1 == index ? null : values[index];
        }, this.erase = function(key) {
            var index = keys.indexOf(key);
            return -1 != index ? (this.length--, keys.splice(index, 1), values.splice(index, 1)[0]) : null;
        }, this.each = this.forEach = function(fn, bind) {
            for (var i = 0, l = this.length; l > i; i++) fn.call(bind, keys[i], values[i], this);
        };
    };
    this.Type && new Type("Table", Table);
}();

var IframeShim = new Class({
    Implements: [ Options, Events, Class.Occlude ],
    options: {
        className: "iframeShim",
        src: 'javascript:false;document.write("");',
        display: !1,
        zIndex: null,
        margin: 0,
        offset: {
            x: 0,
            y: 0
        },
        browsers: Browser.ie6 || Browser.firefox && Browser.version < 3 && Browser.Platform.mac
    },
    property: "IframeShim",
    initialize: function(element, options) {
        return this.element = document.id(element), this.occlude() ? this.occluded : (this.setOptions(options), 
        this.makeShim(), this);
    },
    makeShim: function() {
        if (this.options.browsers) {
            var zIndex = this.element.getStyle("zIndex").toInt();
            if (!zIndex) {
                zIndex = 1;
                var pos = this.element.getStyle("position");
                "static" != pos && pos || this.element.setStyle("position", "relative"), this.element.setStyle("zIndex", zIndex);
            }
            zIndex = (null != this.options.zIndex || 0 === this.options.zIndex) && zIndex > this.options.zIndex ? this.options.zIndex : zIndex - 1, 
            0 > zIndex && (zIndex = 1), this.shim = new Element("iframe", {
                src: this.options.src,
                scrolling: "no",
                frameborder: 0,
                styles: {
                    zIndex: zIndex,
                    position: "absolute",
                    border: "none",
                    filter: "progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)"
                },
                "class": this.options.className
            }).store("IframeShim", this);
            var inject = function() {
                this.shim.inject(this.element, "after"), this[this.options.display ? "show" : "hide"](), 
                this.fireEvent("inject");
            }.bind(this);
            IframeShim.ready ? inject() : window.addEvent("load", inject);
        } else this.position = this.hide = this.show = this.dispose = Function.from(this);
    },
    position: function() {
        if (!IframeShim.ready || !this.shim) return this;
        var size = this.element.measure(function() {
            return this.getSize();
        });
        return void 0 != this.options.margin && (size.x = size.x - 2 * this.options.margin, 
        size.y = size.y - 2 * this.options.margin, this.options.offset.x += this.options.margin, 
        this.options.offset.y += this.options.margin), this.shim.set({
            width: size.x,
            height: size.y
        }).position({
            relativeTo: this.element,
            offset: this.options.offset
        }), this;
    },
    hide: function() {
        return this.shim && this.shim.setStyle("display", "none"), this;
    },
    show: function() {
        return this.shim && this.shim.setStyle("display", "block"), this.position();
    },
    dispose: function() {
        return this.shim && this.shim.dispose(), this;
    },
    destroy: function() {
        return this.shim && this.shim.destroy(), this;
    }
});

window.addEvent("load", function() {
    IframeShim.ready = !0;
});

var Mask = new Class({
    Implements: [ Options, Events ],
    Binds: [ "position" ],
    options: {
        style: {},
        "class": "mask",
        maskMargins: !1,
        useIframeShim: !0,
        iframeShimOptions: {}
    },
    initialize: function(target, options) {
        this.target = document.id(target) || document.id(document.body), this.target.store("mask", this), 
        this.setOptions(options), this.render(), this.inject();
    },
    render: function() {
        this.element = new Element("div", {
            "class": this.options["class"],
            id: this.options.id || "mask-" + String.uniqueID(),
            styles: Object.merge({}, this.options.style, {
                display: "none"
            }),
            events: {
                click: function(event) {
                    this.fireEvent("click", event), this.options.hideOnClick && this.hide();
                }.bind(this)
            }
        }), this.hidden = !0;
    },
    toElement: function() {
        return this.element;
    },
    inject: function(target, where) {
        where = where || (this.options.inject ? this.options.inject.where : "") || this.target == document.body ? "inside" : "after", 
        target = target || this.options.inject && this.options.inject.target || this.target, 
        this.element.inject(target, where), this.options.useIframeShim && (this.shim = new IframeShim(this.element, this.options.iframeShimOptions), 
        this.addEvents({
            show: this.shim.show.bind(this.shim),
            hide: this.shim.hide.bind(this.shim),
            destroy: this.shim.destroy.bind(this.shim)
        }));
    },
    position: function() {
        return this.resize(this.options.width, this.options.height), this.element.position({
            relativeTo: this.target,
            position: "topLeft",
            ignoreMargins: !this.options.maskMargins,
            ignoreScroll: this.target == document.body
        }), this;
    },
    resize: function(x, y) {
        var opt = {
            styles: [ "padding", "border" ]
        };
        this.options.maskMargins && opt.styles.push("margin");
        var dim = this.target.getComputedSize(opt);
        if (this.target == document.body) {
            this.element.setStyles({
                width: 0,
                height: 0
            });
            var win = window.getScrollSize();
            dim.totalHeight < win.y && (dim.totalHeight = win.y), dim.totalWidth < win.x && (dim.totalWidth = win.x);
        }
        return this.element.setStyles({
            width: Array.pick([ x, dim.totalWidth, dim.x ]),
            height: Array.pick([ y, dim.totalHeight, dim.y ])
        }), this;
    },
    show: function() {
        return this.hidden ? (window.addEvent("resize", this.position), this.position(), 
        this.showMask.apply(this, arguments), this) : this;
    },
    showMask: function() {
        this.element.setStyle("display", "block"), this.hidden = !1, this.fireEvent("show");
    },
    hide: function() {
        return this.hidden ? this : (window.removeEvent("resize", this.position), this.hideMask.apply(this, arguments), 
        this.options.destroyOnHide ? this.destroy() : this);
    },
    hideMask: function() {
        this.element.setStyle("display", "none"), this.hidden = !0, this.fireEvent("hide");
    },
    toggle: function() {
        this[this.hidden ? "show" : "hide"]();
    },
    destroy: function() {
        this.hide(), this.element.destroy(), this.fireEvent("destroy"), this.target.eliminate("mask");
    }
});

Element.Properties.mask = {
    set: function(options) {
        var mask = this.retrieve("mask");
        return mask && mask.destroy(), this.eliminate("mask").store("mask:options", options);
    },
    get: function() {
        var mask = this.retrieve("mask");
        return mask || (mask = new Mask(this, this.retrieve("mask:options")), this.store("mask", mask)), 
        mask;
    }
}, Element.implement({
    mask: function(options) {
        return options && this.set("mask", options), this.get("mask").show(), this;
    },
    unmask: function() {
        return this.get("mask").hide(), this;
    }
}), window.Base64 = function() {
    "use strict";
    var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", _utf8_encode = function(string) {
        var c, n, utftext = "";
        for (string = string.replace(/\r\n/g, "\n"), n = 0; n < string.length; n++) c = string.charCodeAt(n), 
        128 > c ? utftext += String.fromCharCode(c) : c > 127 && 2048 > c ? (utftext += String.fromCharCode(192 | c >> 6), 
        utftext += String.fromCharCode(128 | 63 & c)) : (utftext += String.fromCharCode(224 | c >> 12), 
        utftext += String.fromCharCode(128 | 63 & c >> 6), utftext += String.fromCharCode(128 | 63 & c));
        return utftext;
    }, _utf8_decode = function(utftext) {
        for (var string = "", i = 0, c = 0, c1 = 0, c2 = 0; i < utftext.length; ) c = utftext.charCodeAt(i), 
        128 > c ? (string += String.fromCharCode(c), i++) : c > 191 && 224 > c ? (c1 = utftext.charCodeAt(i + 1), 
        string += String.fromCharCode((31 & c) << 6 | 63 & c1), i += 2) : (c1 = utftext.charCodeAt(i + 1), 
        c2 = utftext.charCodeAt(i + 2), string += String.fromCharCode((15 & c) << 12 | (63 & c1) << 6 | 63 & c2), 
        i += 3);
        return string;
    }, _hexEncode = function(input) {
        var i, output = "";
        for (i = 0; i < input.length; i++) output += input.charCodeAt(i).toString(16);
        return output;
    }, _hexDecode = function(input) {
        var i, output = "";
        for (input.length % 2 > 0 && (input = "0" + input), i = 0; i < input.length; i += 2) output += String.fromCharCode(parseInt(input.charAt(i) + input.charAt(i + 1), 16));
        return output;
    }, encode = function(input) {
        if (!$defined(input)) return null;
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4, output = "", i = 0;
        for (input = _utf8_encode(input); i < input.length; ) chr1 = input.charCodeAt(i++), 
        chr2 = input.charCodeAt(i++), chr3 = input.charCodeAt(i++), enc1 = chr1 >> 2, enc2 = (3 & chr1) << 4 | chr2 >> 4, 
        enc3 = (15 & chr2) << 2 | chr3 >> 6, enc4 = 63 & chr3, isNaN(chr2) ? enc3 = enc4 = 64 : isNaN(chr3) && (enc4 = 64), 
        output += _keyStr.charAt(enc1), output += _keyStr.charAt(enc2), output += _keyStr.charAt(enc3), 
        output += _keyStr.charAt(enc4);
        return output;
    }, decode = function(input) {
        if (!$defined(input)) return null;
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4, output = "", i = 0;
        for (input = input.replace(/[^A-Za-z0-9\+\/\=]/g, ""); i < input.length; ) enc1 = _keyStr.indexOf(input.charAt(i++)), 
        enc2 = _keyStr.indexOf(input.charAt(i++)), enc3 = _keyStr.indexOf(input.charAt(i++)), 
        enc4 = _keyStr.indexOf(input.charAt(i++)), chr1 = enc1 << 2 | enc2 >> 4, chr2 = (15 & enc2) << 4 | enc3 >> 2, 
        chr3 = (3 & enc3) << 6 | enc4, output += String.fromCharCode(chr1), 64 !== enc3 && (output += String.fromCharCode(chr2)), 
        64 !== enc4 && (output += String.fromCharCode(chr3));
        return _utf8_decode(output);
    }, decodeToHex = function(input) {
        return _hexEncode(decode(input));
    }, encodeFromHex = function(input) {
        return encode(_hexDecode(input));
    };
    return {
        encode: encode,
        decode: decode,
        decodeToHex: decodeToHex,
        encodeFromHex: encodeFromHex
    };
}(), function() {
    function hinter() {
        var text = this.$input.get("value"), full = "";
        text.length >= this.options.minlen && (full = _.find(this.data, function(txt) {
            return txt.startsWith(text);
        })), this.seth(full || "");
    }
    var keyboardBinds = {
        down: "next",
        up: "previous",
        tab: "finish",
        right: "finish",
        left: "stop",
        esc: "stop",
        enter: "complete"
    };
    this.Completer = new Class({
        Implements: [ Options ],
        Binds: [ "process", "update" ],
        index: -1,
        options: {
            stopPropogation: !1,
            autoPosition: !0,
            selectors: {
                hint: ".tt-hint",
                input: ".tt-query"
            },
            minlen: 1,
            delay: 400
        },
        initialize: function(target, data, options) {
            options = this.setOptions(options).options, target = document.id(target), this.data = data, 
            this.$events = {
                keydown: this.process,
                input: _.throttle(hinter.bind(this), options.delay)
            }, this.$input = target.getElement(options.selectors.input).addEvents(this.$events), 
            this.$hint = target.getElement(options.selectors.hint), options.autoPosition && (this.$hint.setStyle("position", "absolute"), 
            this.update.delay(50), window.addEvent("resize", this.update));
        },
        process: function(evt) {
            var method = keyboardBinds[evt.key];
            this[method] && (this.options.stopPropogation && evt.stopPropagation(), this[method]());
        },
        next: function() {
            this.stop(), this.index > 0 ? this.set(this.data[--this.index]) : (this.set(""), 
            this.index = -1);
        },
        previous: function() {
            this.stop(), this.index + 1 < this.data.length ? this.set(this.data[++this.index]) : (this.set(""), 
            this.index = this.data.length);
        },
        complete: function() {
            this.finish(), this.reset();
        },
        finish: function() {
            var text = this.$hint.get("value") || null;
            this.set(text);
        },
        stop: function() {
            this.seth("");
        },
        set: function(text) {
            _.isString(text) && this.$input.set("value", text);
        },
        seth: function(text) {
            _.isString(text) && this.$hint.set("value", text);
        },
        reset: function() {
            this.stop(), this.index = -1;
        },
        update: function() {
            this.$hint.setStyles(this.$input.getCoordinates(this.$input.getParent()));
        },
        detach: function() {
            this.$input.removeEvents(this.$events), window.removeEvents({
                resize: this.update
            });
        }
    });
}(), window.addEvent("domready", function() {
    function getChildren($ele) {
        return new Elements($ele.childNodes);
    }
    function tableFix(match, text) {
        var container = new Element("table"), tag = match[1].toLowerCase();
        return [ "td", "th", "tr" ].contains(tag) && (container = new Element("tbody").inject(container), 
        "tr" != tag && (container = new Element("tr").inject(container))), getChildren(container.set("html", text));
    }
    var table_re = /^\s*<(t[dhr]|tbody|tfoot|thead)/i, range = document.createRange && document.createRange();
    if (range && range.createContextualFragment) {
        var reference = document.getElement("div");
        range.selectNode(reference), Elements.from = function(text, excludeScripts) {
            (excludeScripts || null == excludeScripts) && (text = text.stripScripts());
            var match = text.match(table_re);
            return match ? tableFix(match, text) : getChildren(range.createContextualFragment(text));
        };
    } else Elements.from = function(text, excludeScripts) {
        (excludeScripts || null == excludeScripts) && (text = text.stripScripts());
        var match = text.match(table_re);
        return match ? tableFix(match, text) : getChildren(new Element("div").set("html", text));
    };
}), Element.extend({
    from: function(text, es) {
        return Elements.from(text, es)[0];
    }
}), /*!
Copyright (c) 2010 Arieh Glazer
*/
function(window) {
    "use strict";
    window.Storage = new Class({
        Implements: [ Options ],
        options: {
            path: "/",
            name: window.location.hostname,
            duration: 100,
            debug: !1,
            storageType: "localStorage",
            fallback: !0
        },
        storage: null,
        initialize: function(options) {
            this.setOptions(options);
            var $this = this, storageType = this.options.storageType, fallback = this.options.fallback;
            if (window[storageType]) this.options.debug && console.log("using " + storageType), 
            this.storage = window[storageType]; else if (Browser.ie && Browser.version < 8) this.options.debug && console.log("using behavior Storage"), 
            this.storage = function() {
                var storage = document.createElement("span");
                return storage.style.behavior = "url(#default#userData)", document.body.adopt(storage), 
                storage.load($this.options.name), {
                    setItem: function(name, value) {
                        storage.setAttribute(name, value), storage.save($this.options.name);
                    },
                    getItem: function(name) {
                        return storage.getAttribute(name);
                    },
                    removeItem: function(name) {
                        storage.removeAttribute(name), storage.save($this.options.name);
                    }
                };
            }(); else if (window.globalStorage) this.options.debug && console.log("using globalStorage"), 
            this.storage = function() {
                return storage = globalStorage[$this.options.name], {
                    setItem: function(name, value) {
                        storage[name] = value;
                    },
                    getItem: function(name) {
                        return "value" in storage[name] ? storage[name].value : null;
                    },
                    removeItem: function(name) {
                        delete storage[name];
                    }
                };
            }(); else if (fallback) this.options.debug && console.log("using cookies"), this.usingCookies = !0, 
            this.storage = function() {
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
            }(); else {
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
            return this.storage.setItem(name, JSON.encode(value)), this;
        },
        get: function(name) {
            return JSON.decode(this.storage.getItem(name));
        },
        remove: function(name) {
            return this.storage.removeItem(name), this;
        }
    });
}(this), function(self) {
    function getTrailing(text, punc) {
        if (Type.isRegExp(punc)) {
            var match = text.match(punc);
            if (match) return match[0];
        } else if (text.endsWith(punc)) return punc;
    }
    function getLeading(text, punc) {
        if (Type.isRegExp(punc)) {
            var match = text.match(punc);
            if (match) return match[0];
        } else if (text.startsWith(punc)) return punc;
    }
    var urlerizer = self.Urlerizer = new Class({
        Implements: [ Options ],
        options: {
            nofollow: !1,
            autoescape: !0,
            trim_url_limit: !1,
            target: !1,
            default_parser: !0,
            hide_servers: !0
        },
        leading_punctuation: [],
        trailing_punctuation: [ /[.,.)]$/ ],
        wrapping_punctuation: [ [ "(", ")" ], [ "<", ">" ], [ "&lt;", "&gt;" ], [ "“", "”" ], [ "‘", "’" ], [ "'", "'" ], [ "[", "]" ] ],
        initialize: function(opts) {
            this.setOptions(opts), this.options.default_parser && this.patterns.push({
                pattern: /[a-z0-9]\.[a-z]{2,4}/i,
                entireStr: !1,
                parse: function(text) {
                    var options = this.options, word = text;
                    if ((word.contains(".") || word.contains("@") || word.contains(":")) && (!options.hide_servers || !urlerizer.regexs.server.test(word))) {
                        var parsed = this.parsePunctuation(word), middle = parsed.mid, url = void 0, nofollow_attr = options.nofollow ? ' rel="nofollow"' : "", target_attr = options.target ? ' target="' + options.target + '"' : "";
                        if (middle.match(urlerizer.regexs.simple_url) ? url = this.urlquote(middle) : middle.match(urlerizer.regexs.url_improved) ? url = this.urlquote("http://" + middle) : middle.contains(":") && middle.match(urlerizer.regexs.simple_email) && (url = "mailto:" + middle, 
                        nofollow_attr = ""), url) {
                            var trimmed = options.trim_url_limit ? String.truncate(middle, options.trim_url_limit) : middle;
                            middle = '<a href="' + url + '"' + nofollow_attr + target_attr + ">" + trimmed + "</a>", 
                            word = parsed.lead + middle + parsed.end;
                        }
                    }
                    return word;
                }
            });
        },
        urlquote: function(url) {
            return -1 == url.indexOf("%") || url.match(urlerizer.regexs.unquoted_percents) ? encodeURI(url) : url;
        },
        parse: function(text) {
            function parseWord(pattern) {
                return item = result[i], pattern.pattern.test(item) ? (result[i] = pattern.parse.call(self, item), 
                result[i] !== item) : void 0;
            }
            for (var item, self = this, result = (self.options.autoescape ? _.escape(text) : text).split(" "), funcs = _.filter(self.patterns, function(pat) {
                return !pat.entireStr;
            }), i = result.length - 1; i >= 0; i--) funcs.some(parseWord);
            return result = result.join(" "), self.patterns.each(function(pattern) {
                pattern.entireStr && pattern.pattern.test(result) && (result = pattern.parse.call(self, result));
            }), result;
        },
        parsePunctuation: function(text) {
            function leader(punc) {
                var lead = getLeading(mid, punc);
                lead && (mid = mid.slice(lead.length), lead += lead);
            }
            function trailer(punc) {
                var trail = getTrailing(mid, punc);
                trail && (mid = mid.slice(0, mid.length - trail.length), end = trail + end);
            }
            function wrapper(puncs) {
                var trail, lead = getLeading(mid, puncs[0]);
                return lead && (trail = getTrailing(mid, puncs[1])) ? (mid = mid.slice(lead.length, mid.length - trail.length), 
                lead += lead, end = trail + end, !0) : void 0;
            }
            for (var lead = "", mid = text, end = ""; this.leading_punctuation.some(leader); ) ;
            for (;this.trailing_punctuation.some(trailer); ) ;
            for (;this.wrapping_punctuation.some(wrapper); ) ;
            return {
                lead: lead,
                mid: mid,
                end: end
            };
        },
        patterns: [],
        addPattern: function(reg, action, whole) {
            return this.patterns.push({
                pattern: reg,
                parse: action,
                entireStr: whole || !1
            }), this;
        }
    });
    urlerizer.regexs = {
        simple_url: /^https?:\/\/\w/,
        url_improved: /^www\.|^(?!http)\w[^@]+\.[a-zA-Z]{2,4}/,
        simple_email: /^\S+@\S+\.\S+$/,
        unquoted_percents: /%(?![0-9A-Fa-f]{2})/,
        server: /(\:(\d{2}))|(qwebirc\:\/)/
    };
}(this), Fx.AutoScroll = new Class({
    Extends: Fx.Scroll,
    Binds: [ "updatePosition" ],
    options: {
        interval: 500,
        duration: 0,
        threshold: 5,
        wheelStops: !0,
        link: "cancel"
    },
    lastUpdate: 0,
    initialize: function(ele, options) {
        this.parent(ele, options);
        var self = this, opts = self.options, interval = opts.interval / 2, timers = self.$timers = {}, toggler = function() {
            Date.now() > self.lastUpdate + opts.duration + 20 && (clearTimeout(timers.throttle), 
            timers.throttle = self.toggleScroll.delay(interval - opts.duration, self));
        };
        this.$events = {
            element: {
                adopt: self.updatePosition
            },
            window: {
                resize: self.updatePosition
            }
        }, this.$events.element["scroll:throttle(" + interval + ")"] = toggler, this.element.addEvents(this.$events.element), 
        window.addEvents(this.$events.window), self.autoScroll();
    },
    autoScroll: function() {
        return this.scroll = !0, this.updatePosition();
    },
    stopScroll: function() {
        var timers = this.$timers;
        clearTimeout(timers.throttle), clearInterval(timers.autoscroll), timers.autoscroll = null;
    },
    toggleScroll: function() {
        this.scroll = !1;
        var $ele = this.element, timers = this.$timers, pxFromBottom = Math.abs($ele.getScrollHeight() - ($ele.getHeight() + $ele.getScrollTop()));
        return clearTimeout(timers.throttle), clearInterval(timers.autoscroll), pxFromBottom <= this.threshold ? this.autoScroll() : this.stopScroll(), 
        this;
    },
    updatePosition: function(target) {
        var $ele = this.element;
        return this.scroll && Math.abs($ele.getScrollHeight() - $ele.getHeight() - $ele.getScrollTop()) > 2 && (this.lastUpdate = Date.now(), 
        0 === this.options.duration ? this.set($ele.scrollLeft, $ele.scrollHeight) : this.toBottom(), 
        target && (this.threshold = this.options.threshold || target.getHeight())), this;
    },
    stop: function() {
        return window.removeEvents(this.$events.window), this.element.removeEvents(this.$events.element), 
        this.stopScroll(), this.parent();
    }
}), function(Event) {
    Event.Mock = function(target, type) {
        type = type || "click";
        var e = {
            type: type,
            target: target
        };
        return document.createEvent && (e = document.createEvent("HTMLEvents"), e.initEvent(type, !1, !0)), 
        e = new Event(e), e.target = target, e;
    };
}(window.Event = window.Event || function() {}), function() {
    JSON.isSecure = function(string) {
        return /^[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]*$/.test(string.replace(/\\./g, "@").replace(/"[^"\\\n\r]*"/g, "").replace(/'[^'\\\n\r]*'/g, ""));
    }, Element.implement({
        setData: function(name, value) {
            return this.set("data-" + name.hyphenate(), value);
        },
        getData: function(name, defaultValue) {
            var value = this.get("data-" + name.hyphenate());
            return void 0 != value ? value : void 0 != defaultValue ? (this.setData(name, defaultValue), 
            defaultValue) : void 0;
        },
        setJSONData: function(name, value) {
            return this.setData(name, JSON.encode(value));
        },
        getJSONData: function(name, strict, defaultValue) {
            var value = this.get("data-" + name);
            return void 0 != value ? value && JSON.isSecure(value) ? JSON.decode(value, strict) : value : void 0 != defaultValue ? (this.setJSONData(name, defaultValue), 
            defaultValue) : void 0;
        }
    });
}(), function() {
    var reggy = /[^a-z0-9\-]/gi, dots = /\./g;
    window.BehaviorAPI = new Class({
        element: null,
        prefix: "",
        defaults: {},
        initialize: function(element, prefix) {
            this.element = element, this.prefix = prefix.toLowerCase().replace(dots, "-").replace(reggy, "");
        },
        get: function() {
            return arguments.length > 1 ? this._getObj(Array.from(arguments)) : this._getValue(arguments[0]);
        },
        getAs: function() {
            return "object" == typeOf(arguments[0]) ? this._getValuesAs.apply(this, arguments) : this._getValueAs.apply(this, arguments);
        },
        require: function() {
            for (var i = 0; i < arguments.length; i++) if (void 0 == this._getValue(arguments[i])) throw new Error("Could not retrieve " + this.prefix + "-" + arguments[i] + " option from element.");
            return this;
        },
        requireAs: function(returnType, name) {
            var val;
            if ("object" == typeOf(arguments[0])) {
                for (var objName in arguments[0]) if (val = this._getValueAs(arguments[0][objName], objName), 
                void 0 === val || null === val) throw new Error("Could not retrieve " + this.prefix + "-" + objName + " option from element.");
            } else if (val = this._getValueAs(returnType, name), void 0 === val || null === val) throw new Error("Could not retrieve " + this.prefix + "-" + name + " option from element.");
            return this;
        },
        setDefault: function(name, value) {
            if ("object" != typeOf(arguments[0])) {
                if (name = name.camelCase(), this.defaults[name] = value, null == this._getValue(name)) {
                    var options = this._getOptions();
                    options[name] = value;
                }
                return this;
            }
            for (var objName in arguments[0]) this.setDefault(objName, arguments[0][objName]);
        },
        refreshAPI: function() {
            delete this.options, this.setDefault(this.defaults);
        },
        _getObj: function(names) {
            var obj = {};
            return names.each(function(name) {
                var value = this._getValue(name);
                void 0 !== value && (obj[name] = value);
            }, this), obj;
        },
        _getOptions: function() {
            try {
                if (!this.options) {
                    var options = this.element.getData(this.prefix + "-options", "{}");
                    if ("" === options) return this.options = {};
                    options && "{" != options.substring(0, 1) && (options = "{" + options + "}");
                    var isSecure = JSON.isSecure(options);
                    if (!isSecure) throw new Error("warning, options value for element is not parsable, check your JSON format for quotes, etc.");
                    this.options = isSecure ? JSON.decode(options) : {};
                    for (option in this.options) this.options[option.camelCase()] = this.options[option];
                }
            } catch (e) {
                throw new Error("Could not get options from element; check your syntax. " + this.prefix + '-options: "' + this.element.getData(this.prefix + "-options", "{}") + '"');
            }
            return this.options;
        },
        _getValue: function(name) {
            name = name.camelCase();
            var options = this._getOptions();
            if (!options.hasOwnProperty(name)) {
                var inline = this.element.getData(this.prefix + "-" + name.hyphenate());
                inline && (options[name] = inline);
            }
            return options[name];
        },
        _getValueAs: function(returnType, name, defaultValue) {
            var value = this._getValue(name);
            if (null == value || void 0 == value) return defaultValue;
            var coerced = this._coerceFromString(returnType, value);
            if (null == coerced) throw new Error("Could not retrieve value '" + name + "' as the specified type. Its value is: " + value);
            return coerced;
        },
        _getValuesAs: function(obj) {
            var returnObj = {};
            for (var name in obj) returnObj[name] = this._getValueAs(obj[name], name);
            return returnObj;
        },
        _coerceFromString: function(toType, value) {
            return "string" == typeOf(value) && toType != String && JSON.isSecure(value) && (value = JSON.decode(value)), 
            instanceOf(value, toType) ? value : null;
        }
    });
}(), function() {
    var getLog = function(method) {
        return function() {
            window.console && console[method] && (console[method].apply ? console[method].apply(console, arguments) : console[method](Array.from(arguments).join(" ")));
        };
    }, PassMethods = new Class({
        passMethod: function(method, fn) {
            if (this.API.prototype[method]) throw new Error("Cannot overwrite API method " + method + " as it already exists");
            return this.API.implement(method, fn), this;
        },
        passMethods: function(methods) {
            for (method in methods) this.passMethod(method, methods[method]);
            return this;
        }
    }), GetAPI = new Class({
        _getAPI: function(element, filter) {
            var api = new this.API(element, filter.name);
            return api.getElement = function(apiKey, breakIfNotFound) {
                var elements = api.getElements(apiKey, breakIfNotFound);
                return elements ? elements[0] : null;
            }, api.getElements = function(apiKey, warnOrFail) {
                var method = warnOrFail || "fail", selector = api.get(apiKey);
                if (!selector) return api[method]("Could not find selector for " + apiKey), void 0;
                if ("window" == selector) return window;
                if ("self" == selector) return element;
                var targets = element.getElements(selector);
                return targets.length || api[method]("Could not find any elements for target '" + apiKey + "' using selector '" + selector + "'"), 
                targets;
            }, api;
        }
    }), spaceOrCommaRegex = /\s*,\s*|\s+/g;
    BehaviorAPI.implement({
        deprecate: function(deprecated, asJSON) {
            var set, values = {};
            return Object.each(deprecated, function(prop, key) {
                var value = this.element[asJSON ? "getJSONData" : "getData"](prop);
                void 0 !== value && (set = !0, values[key] = value);
            }, this), this.setDefault(values), this;
        }
    }), this.Behavior = new Class({
        Implements: [ Options, Events, PassMethods, GetAPI ],
        options: {
            onLog: getLog("info"),
            onError: getLog("error"),
            onWarn: getLog("warn"),
            enableDeprecation: !0,
            selector: "[data-behavior]"
        },
        initialize: function(options) {
            this.setOptions(options), this.API = new Class({
                Extends: BehaviorAPI
            }), this.passMethods({
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
                getContainerSize: function() {
                    return this.getContentElement().measure(function() {
                        return this.getSize();
                    });
                }.bind(this),
                error: function() {
                    this.fireEvent("error", arguments);
                }.bind(this),
                fail: function() {
                    var msg = Array.join(arguments, " ");
                    throw new Error(msg);
                },
                warn: function() {
                    this.fireEvent("warn", arguments);
                }.bind(this)
            });
        },
        getDelegator: function() {
            return this.delegator;
        },
        setDelegator: function(delegator) {
            if (!instanceOf(delegator, Delegator)) throw new Error("Behavior.setDelegator only accepts instances of Delegator.");
            return this.delegator = delegator, this;
        },
        getContentElement: function() {
            return this.options.container || document.body;
        },
        apply: function(container, force) {
            return this._getElements(container).each(function(element) {
                var plugins = [];
                element.getBehaviors().each(function(name) {
                    var filter = this.getFilter(name);
                    if (filter) {
                        var config = filter.config;
                        void 0 !== config.delay ? this.applyFilter.delay(filter.config.delay, this, [ element, filter, force ]) : config.delayUntil ? this._delayFilterUntil(element, filter, force) : config.initializer ? this._customInit(element, filter, force) : plugins.append(this.applyFilter(element, filter, force, !0));
                    } else this.fireEvent("error", [ "There is no filter registered with this name: ", name, element ]);
                }, this), plugins.each(function(plugin) {
                    this.options.verbose && this.fireEvent("log", [ "Firing plugin..." ]), plugin();
                }, this);
            }, this), this;
        },
        _getElements: function(container) {
            return "function" == typeOf(this.options.selector) ? this.options.selector(container) : document.id(container).getElements(this.options.selector);
        },
        _delayFilterUntil: function(element, filter, force) {
            var events = filter.config.delayUntil.split(","), attached = {}, inited = !1, clear = function() {
                events.each(function(event) {
                    element.removeEvent(event, attached[event]);
                }), clear = function() {};
            };
            events.each(function(event) {
                var init = function(e) {
                    if (clear(), !inited) {
                        inited = !0;
                        var setup = filter.setup;
                        filter.setup = function(element, api, _pluginResult) {
                            return api.event = e, setup.apply(filter, [ element, api, _pluginResult ]);
                        }, this.applyFilter(element, filter, force), filter.setup = setup;
                    }
                }.bind(this);
                element.addEvent(event, init), attached[event] = init;
            }, this);
        },
        _customInit: function(element, filter, force) {
            var api = this._getAPI(element, filter);
            api.runSetup = this.applyFilter.pass([ element, filter, force ], this), filter.config.initializer(element, api);
        },
        applyFilter: function(element, filter, force, _returnPlugins) {
            var pluginsToReturn = [];
            if (this.options.breakOnErrors) pluginsToReturn = this._applyFilter.apply(this, arguments); else try {
                pluginsToReturn = this._applyFilter.apply(this, arguments);
            } catch (e) {
                this.fireEvent("error", [ "Could not apply the behavior " + filter.name, e.message ]);
            }
            return _returnPlugins ? pluginsToReturn : this;
        },
        _applyFilter: function(element, filter, force, _returnPlugins, _pluginTargetResult) {
            var pluginsToReturn = [];
            element = document.id(element);
            var applied = getApplied(element);
            if (!applied[filter.name] || force) {
                this.options.verbose && this.fireEvent("log", [ "Applying behavior: ", filter.name, element ]), 
                applied[filter.name] && applied[filter.name].cleanup(element);
                var api = this._getAPI(element, filter);
                api.markForCleanup = filter.markForCleanup.bind(filter), api.onCleanup = function(fn) {
                    filter.markForCleanup(element, fn);
                }, filter.config.deprecated && this.options.enableDeprecation && api.deprecate(filter.config.deprecated), 
                filter.config.deprecateAsJSON && this.options.enableDeprecation && api.deprecate(filter.config.deprecatedAsJSON, !0), 
                filter.config.requireAs ? api.requireAs(filter.config.requireAs) : filter.config.require && api.require.apply(api, Array.from(filter.config.require)), 
                filter.config.defaults && api.setDefault(filter.config.defaults), Behavior.debugging && Behavior.debugging.contains(filter.name);
                var result = filter.setup(element, api, _pluginTargetResult);
                if (filter.config.returns && !instanceOf(result, filter.config.returns)) throw new Error("Filter " + filter.name + " did not return a valid instance.");
                element.store("Behavior Filter result:" + filter.name, result), this.options.verbose && (result && !_pluginTargetResult ? this.fireEvent("log", [ "Successfully applied behavior: ", filter.name, element, result ]) : this.fireEvent("warn", [ "Behavior applied, but did not return result: ", filter.name, element, result ])), 
                applied[filter.name] = filter;
                var plugins = this.getPlugins(filter.name);
                if (plugins) for (var name in plugins) _returnPlugins ? pluginsToReturn.push(this.applyFilter.pass([ element, plugins[name], force, null, result ], this)) : this.applyFilter(element, plugins[name], force, null, result);
            }
            return pluginsToReturn;
        },
        getFilter: function(name) {
            return this._registered[name] || Behavior.getFilter(name);
        },
        getPlugins: function(name) {
            return this._plugins[name] || Behavior._plugins[name];
        },
        cleanup: function(element, ignoreChildren) {
            element = document.id(element);
            var applied = getApplied(element);
            for (var filter in applied) applied[filter].cleanup(element), element.eliminate("Behavior Filter result:" + filter), 
            delete applied[filter];
            return ignoreChildren || this._getElements(element).each(this.cleanup, this), this;
        }
    }), Behavior.getLog = getLog, Behavior.PassMethods = PassMethods, Behavior.GetAPI = GetAPI;
    var getApplied = function(el) {
        return el.retrieve("_appliedBehaviors", {});
    }, addFilter = function(name, fn, overwrite) {
        if (this._registered[name] && !overwrite) throw new Error('Could not add the Behavior filter "' + name + '" as a previous trigger by that same name exists.');
        this._registered[name] = new Behavior.Filter(name, fn);
    }, addFilters = function(obj, overwrite) {
        for (var name in obj) addFilter.apply(this, [ name, obj[name], overwrite ]);
    }, addPlugin = function(filterName, name, setup, overwrite) {
        if (this._plugins[filterName] || (this._plugins[filterName] = {}), this._plugins[filterName][name] && !overwrite) throw new Error('Could not add the Behavior filter plugin "' + name + '" as a previous trigger by that same name exists.');
        this._plugins[filterName][name] = new Behavior.Filter(name, setup);
    }, addPlugins = function(obj, overwrite) {
        for (var name in obj) addPlugin.apply(this, [ obj[name].fitlerName, obj[name].name, obj[name].setup ], overwrite);
    }, setFilterDefaults = function(name, defaults) {
        var filter = this.getFilter(name);
        filter.config.defaults || (filter.config.defaults = {}), Object.append(filter.config.defaults, defaults);
    };
    Object.append(Behavior, {
        _registered: {},
        _plugins: {},
        addGlobalFilter: addFilter,
        addGlobalFilters: addFilters,
        addGlobalPlugin: addPlugin,
        addGlobalPlugins: addPlugins,
        setFilterDefaults: setFilterDefaults,
        getFilter: function(name) {
            return this._registered[name];
        }
    }), Behavior.implement({
        _registered: {},
        _plugins: {},
        addFilter: addFilter,
        addFilters: addFilters,
        addPlugin: addPlugin,
        addPlugins: addPlugins,
        setFilterDefaults: setFilterDefaults
    }), Behavior.Filter = new Class({
        config: {},
        initialize: function(name, setup) {
            this.name = name, "function" == typeOf(setup) ? this.setup = setup : (Object.append(this.config, setup), 
            this.setup = this.config.setup), this._cleanupFunctions = new Table();
        },
        markForCleanup: function(element, fn) {
            var functions = this._cleanupFunctions.get(element);
            return functions || (functions = []), functions.include(fn), this._cleanupFunctions.set(element, functions), 
            this;
        },
        cleanup: function(element) {
            var marks = this._cleanupFunctions.get(element);
            return marks && (marks.each(function(fn) {
                fn();
            }), this._cleanupFunctions.erase(element)), this;
        }
    }), Behavior.debug = function(name) {
        Behavior.debugging || (Behavior.debugging = []), Behavior.debugging.push(name);
    }, Behavior.elementDataProperty = "behavior", Element.implement({
        addBehaviorFilter: function(name) {
            return this.setData(Behavior.elementDataProperty, this.getBehaviors().include(name).join(" "));
        },
        removeBehaviorFilter: function(name) {
            return this.setData(Behavior.elementDataProperty, this.getBehaviors().erase(name).join(" "));
        },
        getBehaviors: function() {
            var filters = this.getData(Behavior.elementDataProperty);
            return filters ? filters.trim().split(spaceOrCommaRegex) : [];
        },
        hasBehavior: function(name) {
            return this.getBehaviors().contains(name);
        },
        getBehaviorResult: function(name) {
            return this.retrieve("Behavior Filter result:" + name);
        }
    });
}(), function() {
    var spaceOrCommaRegex = /\s*,\s*|\s+/g, checkEvent = function(trigger, element, event) {
        return event ? trigger.types.some(function(type) {
            var elementEvent = Element.Events[type];
            if (elementEvent && elementEvent.condition) return elementEvent.condition.call(element, event, type);
            var eventType = elementEvent && elementEvent.base ? elementEvent.base : event.type;
            return eventType == type;
        }) : !0;
    };
    window.Delegator = new Class({
        Implements: [ Options, Events, Behavior.PassMethods, Behavior.GetAPI ],
        options: {
            getBehavior: function() {},
            onLog: Behavior.getLog("info"),
            onError: Behavior.getLog("error"),
            onWarn: Behavior.getLog("warn")
        },
        initialize: function(options) {
            this.setOptions(options), this._bound = {
                eventHandler: this._eventHandler.bind(this)
            }, Delegator._instances.push(this), Object.each(Delegator._triggers, function(trigger) {
                this._eventTypes.combine(trigger.types);
            }, this), this.API = new Class({
                Extends: BehaviorAPI
            }), this.passMethods({
                addEvent: this.addEvent.bind(this),
                removeEvent: this.removeEvent.bind(this),
                addEvents: this.addEvents.bind(this),
                removeEvents: this.removeEvents.bind(this),
                fireEvent: this.fireEvent.bind(this),
                attach: this.attach.bind(this),
                trigger: this.trigger.bind(this),
                error: function() {
                    this.fireEvent("error", arguments);
                }.bind(this),
                fail: function() {
                    var msg = Array.join(arguments, " ");
                    throw new Error(msg);
                },
                warn: function() {
                    this.fireEvent("warn", arguments);
                }.bind(this),
                getBehavior: function() {
                    return this.options.getBehavior();
                }.bind(this)
            }), this.bindToBehavior(this.options.getBehavior());
        },
        bindToBehavior: function(behavior) {
            if (behavior) {
                if (this.unbindFromBehavior(), this._behavior = behavior, this._behavior.options.verbose && (this.options.verbose = !0), 
                !this._behaviorEvents) {
                    var self = this;
                    this._behaviorEvents = {
                        destroyDom: function(elements) {
                            Array.from(elements).each(function(element) {
                                self._behavior.cleanup(element), self._behavior.fireEvent("destroyDom", element);
                            });
                        },
                        ammendDom: function(container) {
                            self._behavior.apply(container), self._behavior.fireEvent("ammendDom", container);
                        }
                    };
                }
                this.addEvents(this._behaviorEvents);
            }
        },
        getBehavior: function() {
            return this._behavior;
        },
        unbindFromBehavior: function() {
            this._behaviorEvents && this._behavior && (this._behavior.removeEvents(this._behaviorEvents), 
            delete this._behavior);
        },
        attach: function(target, _method) {
            return _method = _method || "addEvent", target = document.id(target), "addEvent" == _method && this._attachedTo.contains(target) || "removeEvent" == _method && !this._attachedTo.contains(target) ? this : (this._eventTypes.each(function(event) {
                target[_method](event + ":relay([data-trigger])", this._bound.eventHandler);
            }, this), this._attachedTo.push(target), this);
        },
        detach: function(target) {
            return target ? this.attach(target, "removeEvent") : this._attachedTo.each(this.detach, this), 
            this;
        },
        trigger: function(name, element, event) {
            var e = event;
            e && "string" != typeOf(e) || (e = new Event.Mock(element, e)), this.options.verbose && this.fireEvent("log", [ "Applying trigger: ", name, element, event ]);
            var result, trigger = this.getTrigger(name);
            if (trigger) {
                if (checkEvent(trigger, element, e)) if (this.options.breakOnErrors) result = this._trigger(trigger, element, e); else try {
                    result = this._trigger(trigger, element, e);
                } catch (error) {
                    this.fireEvent("error", [ "Could not apply the trigger", name, error.message ]);
                }
            } else this.fireEvent("warn", "Could not find a trigger by the name of " + name);
            return this.options.verbose && result ? this.fireEvent("log", [ "Successfully applied trigger: ", name, element, event ]) : this.options.verbose && this.fireEvent("log", [ "Trigger applied, but did not return a result: ", name, element, event ]), 
            result;
        },
        getTrigger: function(name) {
            return this._triggers[name] || Delegator._triggers[name];
        },
        addEventTypes: function(triggerName, types) {
            return this.getTrigger(triggerName).types.combine(Array.from(types)), this;
        },
        _trigger: function(trigger, element, event) {
            var api = this._getAPI(element, trigger);
            trigger.requireAs ? api.requireAs(trigger.requireAs) : trigger.require && api.require.apply(api, Array.from(trigger.require)), 
            trigger.defaults && api.setDefault(trigger.defaults), Delegator.debugging && Delegator.debugging.contains(name);
            var result = trigger.handler.apply(this, [ event, element, api ]);
            return this.fireEvent("trigger", [ trigger, element, event, result ]), result;
        },
        _eventHandler: function(event, target) {
            var triggers = target.getTriggers();
            triggers.contains("Stop") && event.stop(), triggers.contains("PreventDefault") && event.preventDefault(), 
            triggers.each(function(trigger) {
                "Stop" != trigger && "PreventDefault" != trigger && this.trigger(trigger, target, event);
            }, this);
        },
        _onRegister: function(eventTypes) {
            eventTypes.each(function(eventType) {
                this._eventTypes.contains(eventType) || this._attachedTo.each(function(element) {
                    element.addEvent(eventType + ":relay([data-trigger])", this._bound.eventHandler);
                }, this), this._eventTypes.include(eventType);
            }, this);
        },
        _attachedTo: [],
        _eventTypes: [],
        _triggers: {}
    }), Delegator._triggers = {}, Delegator._instances = [], Delegator._onRegister = function(eventType) {
        this._instances.each(function(instance) {
            instance._onRegister(eventType);
        });
    }, Delegator.register = function(eventTypes, name, handler, overwrite) {
        if (eventTypes = Array.from(eventTypes), "object" == typeOf(name)) {
            var obj = name;
            for (name in obj) this.register.apply(this, [ eventTypes, name, obj[name], handler ]);
            return this;
        }
        if (this._triggers[name] && !overwrite) throw new Error('Could add the trigger "' + name + '" as a previous trigger by that same name exists.');
        return "function" == typeOf(handler) && (handler = {
            handler: handler
        }), handler.types = eventTypes, handler.name = name, this._triggers[name] = handler, 
        this._onRegister(eventTypes), this;
    }, Delegator.getTrigger = function(name) {
        return this._triggers[name];
    }, Delegator.addEventTypes = function(triggerName, types) {
        return this.getTrigger(triggerName).types.combine(Array.from(types)), this;
    }, Delegator.debug = function(name) {
        Delegator.debugging || (Delegator.debugging = []), Delegator.debugging.push(name);
    }, Delegator.implement("register", Delegator.register), Element.implement({
        addTrigger: function(name) {
            return this.setData("trigger", this.getTriggers().include(name).join(" "));
        },
        removeTrigger: function(name) {
            return this.setData("trigger", this.getTriggers().erase(name).join(" "));
        },
        getTriggers: function() {
            var triggers = this.getData("trigger");
            return triggers ? triggers.trim().split(spaceOrCommaRegex) : [];
        },
        hasTrigger: function(name) {
            return this.getTriggers().contains(name);
        }
    });
}(), function() {
    var triggers = {};
    [ "reveal", "toggleReveal", "dissolve", "nix" ].each(function(action) {
        triggers[action] = {
            handler: function(event, link, api) {
                var targets;
                api.get("target") ? (targets = new Elements([ link.getElement(api.get("target")) ]), 
                targets || api.fail("could not locate target element to " + action, link)) : api.get("targets") ? (targets = link.getElements(api.get("targets")), 
                targets.length || api.fail("could not locate target elements to " + action, link)) : targets = new Elements([ link ]);
                var fxOptions = api.getAs(Object, "fxOptions");
                fxOptions && targets.each(function(target) {
                    target.get("reveal").setOptions(fxOptions);
                }), "toggleReveal" == action ? targets.get("reveal").invoke("toggle") : targets[action](), 
                api.getAs(Boolean, "allowEvent") || event.preventDefault();
            }
        };
    }), Delegator.register("click", triggers);
}(), Browser.Features.getCSSTransition = function() {
    Browser.Features.cssTransition = function() {
        var thisBody = document.body || document.documentElement, thisStyle = thisBody.style, support = void 0 !== thisStyle.transition || void 0 !== thisStyle.WebkitTransition || void 0 !== thisStyle.MozTransition || void 0 !== thisStyle.MsTransition || void 0 !== thisStyle.OTransition;
        return support;
    }(), Browser.Features.cssTransition && (Browser.Features.transitionEnd = "TransitionEnd", 
    Browser.safari || Browser.chrome ? Browser.Features.transitionEnd = "webkitTransitionEnd" : Browser.firefox ? Browser.Features.transitionEnd = "transitionend" : Browser.opera && (Browser.Features.transitionEnd = "oTransitionEnd")), 
    Browser.Features.getCSSTransition = Function.from(Browser.Features.transitionEnd);
}, window.addEvent("domready", Browser.Features.getCSSTransition);

var Bootstrap = {
    version: 3
};

Bootstrap.Popup = new Class({
    Implements: [ Options, Events ],
    options: {
        persist: !0,
        closeOnClickOut: !0,
        closeOnEsc: !0,
        mask: !0,
        animate: !0,
        changeDisplayValue: !0
    },
    initialize: function(element, options) {
        this.element = document.id(element).store("Bootstrap.Popup", this), this.setOptions(options), 
        this.bound = {
            hide: this.hide.bind(this),
            bodyClick: function(e) {
                this.element == e.target && this.hide();
            }.bind(this),
            keyMonitor: function(e) {
                "esc" == e.key && this.hide();
            }.bind(this),
            animationEnd: this._animationEnd.bind(this)
        }, (this.element.hasClass("fade") && this.element.hasClass("in") || !this.element.hasClass("hide") && !this.element.hasClass("fade")) && (this.element.hasClass("fade") && this.element.removeClass("in"), 
        this.show()), Bootstrap.version > 2 && this.options.closeOnClickOut && this.element.addEvent("click", this.bound.bodyClick);
    },
    toElement: function() {
        return this.element;
    },
    _checkAnimate: function() {
        var check = this.options.animate !== !1 && Browser.Features.getCSSTransition() && (this.options.animate || this.element.hasClass("fade"));
        return check ? check && (this.element.addClass("fade").removeClass("hide"), this._mask && this._mask.addClass("fade").removeClass("hide")) : (this.element.removeClass("fade").addClass("hide"), 
        this._mask && this._mask.removeClass("fade").addClass("hide")), check;
    },
    show: function() {
        this.visible || this.animating || (this.element.addEvent("click:relay(.close, .dismiss, [data-dismiss=modal])", this.bound.hide), 
        this.options.closeOnEsc && document.addEvent("keyup", this.bound.keyMonitor), this._makeMask(), 
        this._mask && this._mask.inject(document.body), this.animating = !0, this.options.changeDisplayValue && this.element.show(), 
        this._checkAnimate() ? (this.element.offsetWidth, this.element.addClass("in"), this._mask && this._mask.addClass("in")) : (this.element.show(), 
        this._mask && this._mask.show()), this.visible = !0, this._watch());
    },
    _watch: function() {
        this._checkAnimate() ? this.element.addEventListener(Browser.Features.getCSSTransition(), this.bound.animationEnd) : this._animationEnd();
    },
    _animationEnd: function() {
        Browser.Features.getCSSTransition() && this.element.removeEventListener(Browser.Features.getCSSTransition(), this.bound.animationEnd), 
        this.animating = !1, this.visible ? this.fireEvent("show", this.element) : (this.fireEvent("hide", this.element), 
        this.options.changeDisplayValue && this.element.hide(), this.options.persist ? this._mask && this._mask.dispose() : this.destroy());
    },
    destroy: function() {
        this._mask && this._mask.destroy(), this.fireEvent("destroy", this.element), this.element.destroy(), 
        this._mask = null, this.destroyed = !0;
    },
    hide: function(event, clicked) {
        if (clicked) {
            var immediateParentPopup = clicked.getParent("[data-behavior~=BS.Popup]");
            if (immediateParentPopup && immediateParentPopup != this.element) return;
        }
        this.visible && !this.animating && (this.animating = !0, event && clicked && clicked.hasClass("stopEvent") && event.preventDefault(), 
        2 == Bootstrap.version && document.id(document.body).removeEvent("click", this.bound.hide), 
        document.removeEvent("keyup", this.bound.keyMonitor), this.element.removeEvent("click:relay(.close, .dismiss, [data-dismiss=modal])", this.bound.hide), 
        this._checkAnimate() ? (this.element.removeClass("in"), this._mask && this._mask.removeClass("in")) : (this.element.hide(), 
        this._mask && this._mask.hide()), this.visible = !1, this._watch());
    },
    _makeMask: function() {
        this.options.mask && (this._mask || (this._mask = new Element("div.modal-backdrop.in"), 
        this._checkAnimate() && this._mask.addClass("fade"))), this.options.closeOnClickOut && 2 == Bootstrap.version && (this._mask ? this._mask.addEvent("click", this.bound.hide) : document.id(document.body).addEvent("click", this.bound.hide));
    }
}), Bootstrap.Dropdown = new Class({
    Implements: [ Options, Events ],
    options: {
        ignore: "input, select, label"
    },
    initialize: function(container, options) {
        this.element = document.id(container), this.setOptions(options), this.boundHandle = this._handle.bind(this), 
        document.id(document.body).addEvent("click", this.boundHandle);
    },
    hideAll: function() {
        var els = this.element.removeClass("open").getElements(".open").removeClass("open");
        return this.fireEvent("hide", els), this;
    },
    show: function(subMenu) {
        return this.hideAll(), this.fireEvent("show", subMenu), subMenu.addClass("open"), 
        this;
    },
    destroy: function() {
        return this.hideAll(), document.body.removeEvent("click", this.boundHandle), this;
    },
    _handle: function(e) {
        var el = e.target, open = el.getParent(".open");
        if (el.match(this.options.ignore) && open || this.hideAll(), this.element.contains(el)) {
            var parent;
            (el.match('[data-toggle="dropdown"]') || el.getParent('[data-toggle="dropdown"] !')) && (parent = el.getParent(".dropdown, .btn-group")), 
            parent || (parent = el.match(".dropdown-toggle") ? el.getParent() : el.getParent(".dropdown-toggle !")), 
            parent && (e.preventDefault(), open || this.show(parent));
        }
    }
}), Behavior.addGlobalFilters({
    "BS.Dropdown": {
        returns: Bootstrap.Dropdown,
        setup: function(el) {
            return new Bootstrap.Dropdown(el);
        }
    }
});

var TabSwapper = new Class({
    Implements: [ Options, Events ],
    options: {
        preventDefault: !0,
        selectedClass: "tabSelected",
        mouseoverClass: "tabOver",
        deselectedClass: "",
        rearrangeDOM: !0,
        effectOptions: {
            duration: 500
        },
        cookieDays: 999
    },
    tabs: [],
    sections: [],
    clickers: [],
    sectionFx: [],
    initialize: function(options) {
        this.setOptions(options);
        var prev = this.setup();
        return prev ? prev : (null != this.options.initPanel ? this.show(this.options.initPanel) : this.options.cookieName && this.recall() ? this.show(this.recall().toInt()) : this.show(0), 
        void 0);
    },
    setup: function() {
        var opt = this.options, sections = $$(opt.sections), tabs = $$(opt.tabs);
        if (tabs[0] && tabs[0].retrieve("tabSwapper")) return tabs[0].retrieve("tabSwapper");
        var clickers = $$(opt.clickers);
        tabs.each(function(tab, index) {
            this.addTab(tab, sections[index], clickers[index], index);
        }, this);
    },
    addTab: function(tab, section, clicker, index) {
        return tab = document.id(tab), clicker = document.id(clicker), section = document.id(section), 
        this.tabs.indexOf(tab) >= 0 && tab.retrieve("tabbered") && this.tabs.indexOf(tab) != index && this.options.rearrangeDOM ? (this.moveTab(this.tabs.indexOf(tab), index), 
        this) : (null == index && (index = this.tabs.length), index > 0 && this.tabs[index - 1] && this.options.rearrangeDOM && (tab.inject(this.tabs[index - 1], "after"), 
        section.inject(this.tabs[index - 1].retrieve("section"), "after")), this.tabs.splice(index, 0, tab), 
        clicker = clicker || tab, tab.addEvents({
            mouseout: function() {
                tab.removeClass(this.options.mouseoverClass);
            }.bind(this),
            mouseover: function() {
                tab.addClass(this.options.mouseoverClass);
            }.bind(this)
        }), clicker.addEvent("click", function(e) {
            this.options.preventDefault && e.preventDefault(), this.show(index);
        }.bind(this)), tab.store("tabbered", !0), tab.store("section", section), tab.store("clicker", clicker), 
        this.hideSection(index), this);
    },
    removeTab: function(index) {
        var now = this.tabs[this.now];
        return this.now == index && (index > 0 ? this.show(index - 1) : index < this.tabs.length && this.show(index + 1)), 
        this.now = this.tabs.indexOf(now), this;
    },
    moveTab: function(from, to) {
        var tab = this.tabs[from], clicker = tab.retrieve("clicker"), section = tab.retrieve("section"), toTab = this.tabs[to], toClicker = toTab.retrieve("clicker"), toSection = toTab.retrieve("section");
        return this.tabs.erase(tab).splice(to, 0, tab), tab.inject(toTab, "before"), clicker.inject(toClicker, "before"), 
        section.inject(toSection, "before"), this;
    },
    show: function(i) {
        return null == this.now && this.tabs.each(function(tab, idx) {
            i != idx && this.hideSection(idx);
        }, this), this.showSection(i).save(i), this;
    },
    save: function(index) {
        return this.options.cookieName && Cookie.write(this.options.cookieName, index, {
            duration: this.options.cookieDays
        }), this;
    },
    recall: function() {
        return this.options.cookieName ? Cookie.read(this.options.cookieName) : !1;
    },
    hideSection: function(idx) {
        var tab = this.tabs[idx];
        if (!tab) return this;
        var sect = tab.retrieve("section");
        return sect ? ("none" != sect.getStyle("display") && (this.lastHeight = sect.getSize().y, 
        sect.setStyle("display", "none"), tab.swapClass(this.options.selectedClass, this.options.deselectedClass), 
        this.fireEvent("onBackground", [ idx, sect, tab ])), this) : this;
    },
    showSection: function(idx) {
        var tab = this.tabs[idx];
        if (!tab) return this;
        var sect = tab.retrieve("section");
        if (!sect) return this;
        var smoothOk = this.options.smooth && !Browser.ie;
        if (this.now != idx) {
            tab.retrieve("tabFx") || tab.store("tabFx", new Fx.Morph(sect, this.options.effectOptions));
            var overflow = sect.getStyle("overflow"), start = {
                display: "block",
                overflow: "hidden"
            };
            smoothOk && (start.opacity = 0);
            var effect = !1;
            if (smoothOk ? effect = {
                opacity: 1
            } : sect.getStyle("opacity").toInt() < 1 && (sect.setStyle("opacity", 1), this.options.smoothSize || this.fireEvent("onActiveAfterFx", [ idx, sect, tab ])), 
            this.options.smoothSize) {
                var size = sect.getDimensions().height;
                null != this.options.maxSize && this.options.maxSize < size && (size = this.options.maxSize), 
                effect || (effect = {}), effect.height = size;
            }
            null != this.now && this.hideSection(this.now), this.options.smoothSize && this.lastHeight && (start.height = this.lastHeight), 
            sect.setStyles(start);
            var finish = function() {
                this.fireEvent("onActiveAfterFx", [ idx, sect, tab ]), sect.setStyles({
                    height: this.options.maxSize == effect.height ? this.options.maxSize : "auto",
                    overflow: overflow
                }), sect.getElements("input, textarea").setStyle("opacity", 1);
            }.bind(this);
            effect ? tab.retrieve("tabFx").start(effect).chain(finish) : finish(), this.now = idx, 
            this.fireEvent("onActive", [ idx, sect, tab ]);
        }
        return tab.swapClass(this.options.deselectedClass, this.options.selectedClass), 
        this;
    }
});

Element.Events.hashchange = {
    onAdd: function() {
        var hash = location.hash, hashchange = function() {
            if (hash != location.hash) {
                hash = location.hash;
                var value = 0 == hash.indexOf("#") ? hash.substr(1) : hash;
                window.fireEvent("hashchange", value), document.fireEvent("hashchange", value);
            }
        };
        "onhashchange" in window && 5 != document.documentMode && 7 != document.documentMode ? window.onhashchange = hashchange : hashchange.periodical(50);
    }
};

var getHash = function() {
    return window.location.hash.substring(1, window.location.hash.length).parseQueryString();
};

TabSwapper.Hash = new Class({
    Extends: TabSwapper,
    options: {
        hash: null
    },
    initialize: function(options) {
        this.setOptions(options), hash = this.options.hash, hash && (delete options.hash, 
        delete this.options.hash, options.preventDefault = !0), this.parent(options), hash && (this.options.hash = hash, 
        this.bound = {
            showByHash: this.showByHash.bind(this)
        }, window.addEvent("hashchange", this.bound.showByHash), this.showByHash());
    },
    showByHash: function() {
        var i = this.getIndexByHash();
        return (i || 0 === i) && this.show(i), this;
    },
    getIndexById: function(id) {
        var target = document.id(id);
        return target && this.tabs.contains(target) ? this.tabs.indexOf(target) : target && this.sections.contains(target) ? this.sections.indexOf(target) : null;
    },
    getIndexByHash: function() {
        var hash = getHash();
        if (!hash) return this;
        var value = hash[this.options.hash];
        if (value && isNaN(value.toInt())) {
            var i = this.getIndexById(value);
            if (null === i) return null;
            value = i;
        }
        return value;
    },
    addTab: function(tab, section) {
        this.parent.apply(this, arguments), this.sections[this.tabs.indexOf(tab)] = section;
    },
    show: function(i) {
        if (this.parent.apply(this, arguments), this.options.hash) {
            var hash = getHash() || {};
            hash[this.options.hash] = this.tabs[i].get("id") || this.sections[i].get("id") || i, 
            window.location.hash = Object.cleanValues(Object.toQueryString(hash));
        }
    },
    destroy: function() {
        this.bound && window.removeEvent("hashchange", this.bound.showByHash), this.tabs.each(function(el) {
            el.removeEvents();
        }), this.tabs = null, this.sections = null;
    }
}), Behavior.addGlobalFilters({
    Tabs: {
        defaults: {
            "tabs-selector": ".tabs>li",
            "sections-selector": ".tab_sections>li",
            smooth: !0,
            smoothSize: !0,
            rearrangeDOM: !1,
            preventDefault: !0
        },
        setup: function(element, api) {
            var tabs = element.getElements(api.get("tabs-selector")), sections = element.getElements(api.get("sections-selector"));
            (tabs.length != sections.length || 0 == tabs.length) && api.fail("warning; sections and sections are not of equal number. tabs: " + tabs.length + ", sections: " + sections.length);
            var ts = new TabSwapper.Hash(Object.merge({
                tabs: tabs,
                sections: sections
            }, Object.cleanValues(api.getAs({
                hash: String,
                cookieName: String,
                smooth: Boolean,
                smoothSize: Boolean,
                rearrangeDOM: Boolean,
                selectedClass: String,
                initPanel: Number,
                preventDefault: Boolean
            }))));
            ts.addEvent("active", function() {
                api.fireEvent("layout:display", sections[0].getParent());
            });
            var target = element;
            return api.get("delegationTarget") && (target = element.getElement(api.get("delegationTarget"))), 
            target || api.fail("Could not find delegation target for tabs"), target.addEvent("click:relay([href^=#])", function(event, link) {
                if ("#" != link.get("href")) {
                    var target = element.getElement(link.get("href"));
                    if (!ts.tabs.contains(target) && (target || api.warn("Could not switch tab; no section found for " + link.get("href")), 
                    ts.sections.contains(target))) {
                        event.preventDefault();
                        var delegator = api.getDelegator();
                        delegator && delegator._eventHandler(event, ts.tabs[ts.sections.indexOf(target)]), 
                        ts.show(ts.sections.indexOf(target));
                    }
                }
            }), element.store("TabSwapper", ts), api.onCleanup(function() {
                ts.destroy(), element.eliminate("TabSwapper");
            }), ts;
        }
    }
}), function() {
    var tabs = Object.clone(Behavior.getFilter("Tabs"));
    Behavior.addGlobalFilters({
        "BS.Tabs": tabs.config
    }), Behavior.setFilterDefaults("BS.Tabs", {
        "tabs-selector": "a:not(.dropdown-toggle)",
        "sections-selector": "+.tab-content >",
        selectedClass: "active",
        smooth: !1,
        smoothSize: !1
    }), Behavior.addGlobalPlugin("BS.Tabs", "BS.Tabs.CSS", function(el, api, instance) {
        instance.addEvent("active", function(index, section, tab) {
            el.getElements(".active").removeClass("active"), tab.getParent("li").addClass("active");
            var dropdown = tab.getParent(".dropdown");
            dropdown && dropdown.addClass("active");
        });
        var now = instance.now, tab = instance.tabs[now], section = tab.retrieve("section");
        instance.fireEvent("active", [ now, section, tab ]);
    }), Behavior.addGlobalPlugin("BS.Tabs", "BS.Tabs.TargetLinks", function(el, api, instance) {
        instance.addEvent("active", function(index, section, tab) {
            document.body.getElements(".active-section-link").removeClass("active-section-link"), 
            tab.get("data-tab-group") && document.id(tab.get("data-tab-group")).addClass("active-section-link");
        });
        var now = instance.now, tab = instance.tabs[now], section = tab.retrieve("section");
        instance.fireEvent("active", [ now, section, tab ]);
    });
}(), function(win) {
    function getNotification(title, options) {
        var notification;
        return win.Notification ? notification = new win.Notification(title, {
            icon: _.isString(options.icon) ? options.icon : options.icon.x32,
            body: options.body || emptyString,
            tag: options.tag || emptyString
        }) : win.webkitNotifications ? (notification = win.webkitNotifications.createNotification(options.icon, title, options.body), 
        notification.show()) : navigator.mozNotification && (notification = navigator.mozNotification.createNotification(title, options.body, options.icon), 
        notification.show()), notification;
    }
    function getWrapper(notification) {
        return {
            close: function() {
                notification && notification.close && notification.close();
            }
        };
    }
    function requestPermission(callback) {
        if (isSupported) {
            var callbackFunction = _.isFunction(callback) ? callback : noop;
            win.webkitNotifications && win.webkitNotifications.checkPermission ? win.webkitNotifications.requestPermission(callbackFunction) : win.Notification && win.Notification.requestPermission && win.Notification.requestPermission(callbackFunction);
        }
    }
    function permissionLevel() {
        var permission;
        if (isSupported) return win.Notification && win.Notification.permissionLevel ? permission = win.Notification.permissionLevel() : win.webkitNotifications && win.webkitNotifications.checkPermission ? permission = PERMISSION[win.webkitNotifications.checkPermission()] : navigator.mozNotification ? permission = PERMISSION_GRANTED : win.Notification && win.Notification.permission && (permission = win.Notification.permission), 
        permission;
    }
    function config(params) {
        return _.isObject(params) && _.extend(settings, params), settings;
    }
    function createNotification(title, options) {
        var notification, notificationWrapper;
        return isSupported && _.isString(title) && options && (_.isString(options.icon) || _.isObject(options.icon)) && permissionLevel() === PERMISSION_GRANTED && (notification = getNotification(title, options)), 
        notificationWrapper = getWrapper(notification), settings.autoClose && notification && !notification.ieVerification && notification.addEventListener && notification.addEventListener("show", function() {
            var notification = notificationWrapper;
            _.delay(function() {
                notification.close();
            }, settings.autoClose);
        }), notificationWrapper;
    }
    var PERMISSION_DEFAULT = "default", PERMISSION_GRANTED = "granted", PERMISSION_DENIED = "denied", PERMISSION = [ PERMISSION_GRANTED, PERMISSION_DEFAULT, PERMISSION_DENIED ], settings = {
        autoClose: 0
    }, emptyString = "", isSupported = Browser.Features.notifications = function() {
        return !!(win.Notification || win.webkitNotifications || navigator.mozNotification);
    }.attempt() || !1, noop = (Math.floor(10 * Math.random() + 1), function() {});
    win.notify = {
        PERMISSION_DEFAULT: PERMISSION_DEFAULT,
        PERMISSION_GRANTED: PERMISSION_GRANTED,
        PERMISSION_DENIED: PERMISSION_DENIED,
        isSupported: isSupported,
        config: config,
        createNotification: createNotification,
        permissionLevel: permissionLevel,
        requestPermission: requestPermission
    }, _.isFunction(Object.seal) && Object.seal(win.notify);
}(window), Drag.VERT = "y", Drag.HORZ = "x", Drag.SplitPane = new Class({
    Extends: Drag,
    Binds: [ "collapse" ],
    options: {
        direction: Drag.HORZ,
        unit: "px",
        style: !1,
        limits: {}
    },
    initialize: function(divider, options) {
        this.parent(divider, options);
        var opts = this.options, dir = opts.direction, wh = dir === Drag.HORZ ? "width" : "height", selectMod = function(style, e) {
            return isNaN(e.getStyle(style).toInt()) ? wh : style;
        }, div = this.div = document.id(divider), prev = this.prev = div.previousElementSibling, aft = this.aft = div.nextElementSibling, prevSize = this.prevSize = this.origPrevSize = prev.getSize()[dir], aftSize = this.aftSize = this.origAftSize = aft.getSize()[dir], changeDir = prevSize > aftSize, mods = this.modifiers = {
            prev: selectMod("right", prev),
            div: changeDir ? "right" : "left",
            aft: selectMod("left", aft),
            dir: changeDir,
            wh: wh
        };
        if (opts.store) {
            var change = opts.store.get();
            change && this.adjust(change);
        }
        div.setStyle(mods.div, this[changeDir ? "aftSize" : "prevSize"] + opts.unit).addEvent("dblclick", this.collapse), 
        this.addEvents({
            drag: this.drag
        });
    },
    adjust: function(change) {
        var opts = this.options, dir = opts.direction, mods = this.modifiers, unit = opts.unit, prev = this.prev, div = this.div, aft = this.aft, min = prev.getStyle(mods.prev).toInt() + change, max = aft.getStyle(mods.aft).toInt() + change, valmin = opts.limits.min, valmax = opts.limits.max;
        return !valmin && Type.isFunction(valmin) && !valmin(min) || valmin > min || !valmax && Type.isFunction(valmax) && !valmax(max) || valmax > max ? void 0 : (prev.setStyle(mods.prev, min + unit), 
        div.setStyle(mods.div, div.getStyle(mods.div).toInt() + change + unit), aft.setStyle(mods.aft, max + unit), 
        this.prevSize = prev.getSize()[dir], this.aftSize = aft.getSize()[dir], this.store(change), 
        this);
    },
    drag: function(evt) {
        if (!this.adjusting) {
            this.adjusting = !0;
            var dir = this.options.direction, mods = this.modifiers, change = "right" === mods.div || "bottom" === mods.div ? this.prev.parentElement["get" + mods.wh.capitalize()]() - evt.client[dir] - this.aftSize : evt.client[dir] - this.prevSize;
            this.adjust(change), this.adjusting = !1;
        }
        return this;
    },
    collapse: function() {
        var size = this.aft.getStyle(this.modifiers.aft).toInt();
        return 0 === size ? this.adjust((this.modifiers.dir ? 1 : -1) * (this.collAftSize || this.origAftSize)) : (this.collAftSize = size, 
        this.adjust((this.modifiers.dir ? -1 : 1) * size)), this;
    },
    store: function(change) {
        var store = this.options.store;
        return store && store.set(change), this;
    }
});

/*! Socket.IO.min.js build:0.9.16, production. Copyright(c) 2011 LearnBoost <dev@learnboost.com> MIT Licensed */
var io = "undefined" == typeof module ? {} : module.exports;

!function() {
    if (function(a, b) {
        var c = a;
        c.version = "0.9.16", c.protocol = 1, c.transports = [], c.j = [], c.sockets = {}, 
        c.connect = function(a, d) {
            var f, g, e = c.util.parseUri(a);
            b && b.location && (e.protocol = e.protocol || b.location.protocol.slice(0, -1), 
            e.host = e.host || (b.document ? b.document.domain : b.location.hostname), e.port = e.port || b.location.port), 
            f = c.util.uniqueUri(e);
            var h = {
                host: e.host,
                secure: "https" == e.protocol,
                port: e.port || ("https" == e.protocol ? 443 : 80),
                query: e.query || ""
            };
            return c.util.merge(h, d), (h["force new connection"] || !c.sockets[f]) && (g = new c.Socket(h)), 
            !h["force new connection"] && g && (c.sockets[f] = g), g = g || c.sockets[f], g.of(e.path.length > 1 ? e.path : "");
        };
    }("object" == typeof module ? module.exports : this.io = {}, this), function(a, b) {
        var c = a.util = {}, d = /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/, e = [ "source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor" ];
        c.parseUri = function(a) {
            for (var b = d.exec(a || ""), c = {}, f = 14; f--; ) c[e[f]] = b[f] || "";
            return c;
        }, c.uniqueUri = function(a) {
            var c = a.protocol, d = a.host, e = a.port;
            return "document" in b ? (d = d || document.domain, e = e || ("https" == c && "https:" !== document.location.protocol ? 443 : document.location.port)) : (d = d || "localhost", 
            !e && "https" == c && (e = 443)), (c || "http") + "://" + d + ":" + (e || 80);
        }, c.query = function(a, b) {
            var d = c.chunkQuery(a || ""), e = [];
            c.merge(d, c.chunkQuery(b || ""));
            for (var f in d) d.hasOwnProperty(f) && e.push(f + "=" + d[f]);
            return e.length ? "?" + e.join("&") : "";
        }, c.chunkQuery = function(a) {
            for (var f, b = {}, c = a.split("&"), d = 0, e = c.length; e > d; ++d) f = c[d].split("="), 
            f[0] && (b[f[0]] = f[1]);
            return b;
        };
        var f = !1;
        c.load = function(a) {
            return "document" in b && "complete" === document.readyState || f ? a() : (c.on(b, "load", a, !1), 
            void 0);
        }, c.on = function(a, b, c, d) {
            a.attachEvent ? a.attachEvent("on" + b, c) : a.addEventListener && a.addEventListener(b, c, d);
        }, c.request = function(a) {
            if (a && "undefined" != typeof XDomainRequest && !c.ua.hasCORS) return new XDomainRequest();
            if ("undefined" != typeof XMLHttpRequest && (!a || c.ua.hasCORS)) return new XMLHttpRequest();
            if (!a) try {
                return new (window[[ "Active" ].concat("Object").join("X")])("Microsoft.XMLHTTP");
            } catch (b) {}
            return null;
        }, "undefined" != typeof window && c.load(function() {
            f = !0;
        }), c.defer = function(a) {
            return c.ua.webkit && "undefined" == typeof importScripts ? (c.load(function() {
                setTimeout(a, 100);
            }), void 0) : a();
        }, c.merge = function(b, d, e, f) {
            var i, g = f || [], h = "undefined" == typeof e ? 2 : e;
            for (i in d) d.hasOwnProperty(i) && c.indexOf(g, i) < 0 && ("object" == typeof b[i] && h ? c.merge(b[i], d[i], h - 1, g) : (b[i] = d[i], 
            g.push(d[i])));
            return b;
        }, c.mixin = function(a, b) {
            c.merge(a.prototype, b.prototype);
        }, c.inherit = function(a, b) {
            function c() {}
            c.prototype = b.prototype, a.prototype = new c();
        }, c.isArray = Array.isArray || function(a) {
            return "[object Array]" === Object.prototype.toString.call(a);
        }, c.intersect = function(a, b) {
            for (var d = [], e = a.length > b.length ? a : b, f = a.length > b.length ? b : a, g = 0, h = f.length; h > g; g++) ~c.indexOf(e, f[g]) && d.push(f[g]);
            return d;
        }, c.indexOf = function(a, b, c) {
            for (var d = a.length, c = 0 > c ? 0 > c + d ? 0 : c + d : c || 0; d > c && a[c] !== b; c++) ;
            return c >= d ? -1 : c;
        }, c.toArray = function(a) {
            for (var b = [], c = 0, d = a.length; d > c; c++) b.push(a[c]);
            return b;
        }, c.ua = {}, c.ua.hasCORS = "undefined" != typeof XMLHttpRequest && function() {
            try {
                var a = new XMLHttpRequest();
            } catch (b) {
                return !1;
            }
            return void 0 != a.withCredentials;
        }(), c.ua.webkit = "undefined" != typeof navigator && /webkit/i.test(navigator.userAgent), 
        c.ua.iDevice = "undefined" != typeof navigator && /iPad|iPhone|iPod/i.test(navigator.userAgent);
    }("undefined" != typeof io ? io : module.exports, this), function(a, b) {
        function c() {}
        a.EventEmitter = c, c.prototype.on = function(a, c) {
            return this.$events || (this.$events = {}), this.$events[a] ? b.util.isArray(this.$events[a]) ? this.$events[a].push(c) : this.$events[a] = [ this.$events[a], c ] : this.$events[a] = c, 
            this;
        }, c.prototype.addListener = c.prototype.on, c.prototype.once = function(a, b) {
            function d() {
                c.removeListener(a, d), b.apply(this, arguments);
            }
            var c = this;
            return d.listener = b, this.on(a, d), this;
        }, c.prototype.removeListener = function(a, c) {
            if (this.$events && this.$events[a]) {
                var d = this.$events[a];
                if (b.util.isArray(d)) {
                    for (var e = -1, f = 0, g = d.length; g > f; f++) if (d[f] === c || d[f].listener && d[f].listener === c) {
                        e = f;
                        break;
                    }
                    if (0 > e) return this;
                    d.splice(e, 1), d.length || delete this.$events[a];
                } else (d === c || d.listener && d.listener === c) && delete this.$events[a];
            }
            return this;
        }, c.prototype.removeAllListeners = function(a) {
            return void 0 === a ? (this.$events = {}, this) : (this.$events && this.$events[a] && (this.$events[a] = null), 
            this);
        }, c.prototype.listeners = function(a) {
            return this.$events || (this.$events = {}), this.$events[a] || (this.$events[a] = []), 
            b.util.isArray(this.$events[a]) || (this.$events[a] = [ this.$events[a] ]), this.$events[a];
        }, c.prototype.emit = function(a) {
            if (!this.$events) return !1;
            var c = this.$events[a];
            if (!c) return !1;
            var d = Array.prototype.slice.call(arguments, 1);
            if ("function" == typeof c) c.apply(this, d); else {
                if (!b.util.isArray(c)) return !1;
                for (var e = c.slice(), f = 0, g = e.length; g > f; f++) e[f].apply(this, d);
            }
            return !0;
        };
    }("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports), 
    function(exports, nativeJSON) {
        function f(a) {
            return 10 > a ? "0" + a : a;
        }
        function date(a) {
            return isFinite(a.valueOf()) ? a.getUTCFullYear() + "-" + f(a.getUTCMonth() + 1) + "-" + f(a.getUTCDate()) + "T" + f(a.getUTCHours()) + ":" + f(a.getUTCMinutes()) + ":" + f(a.getUTCSeconds()) + "Z" : null;
        }
        function quote(a) {
            return escapable.lastIndex = 0, escapable.test(a) ? '"' + a.replace(escapable, function(a) {
                var b = meta[a];
                return "string" == typeof b ? b : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' : '"' + a + '"';
        }
        function str(a, b) {
            var c, d, e, f, h, g = gap, i = b[a];
            switch (i instanceof Date && (i = date(a)), "function" == typeof rep && (i = rep.call(b, a, i)), 
            typeof i) {
              case "string":
                return quote(i);

              case "number":
                return isFinite(i) ? String(i) : "null";

              case "boolean":
              case "null":
                return String(i);

              case "object":
                if (!i) return "null";
                if (gap += indent, h = [], "[object Array]" === Object.prototype.toString.apply(i)) {
                    for (f = i.length, c = 0; f > c; c += 1) h[c] = str(c, i) || "null";
                    return e = 0 === h.length ? "[]" : gap ? "[\n" + gap + h.join(",\n" + gap) + "\n" + g + "]" : "[" + h.join(",") + "]", 
                    gap = g, e;
                }
                if (rep && "object" == typeof rep) for (f = rep.length, c = 0; f > c; c += 1) "string" == typeof rep[c] && (d = rep[c], 
                e = str(d, i), e && h.push(quote(d) + (gap ? ": " : ":") + e)); else for (d in i) Object.prototype.hasOwnProperty.call(i, d) && (e = str(d, i), 
                e && h.push(quote(d) + (gap ? ": " : ":") + e));
                return e = 0 === h.length ? "{}" : gap ? "{\n" + gap + h.join(",\n" + gap) + "\n" + g + "}" : "{" + h.join(",") + "}", 
                gap = g, e;
            }
        }
        if (nativeJSON && nativeJSON.parse) return exports.JSON = {
            parse: nativeJSON.parse,
            stringify: nativeJSON.stringify
        };
        var JSON = exports.JSON = {}, cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, gap, indent, meta = {
            "\b": "\\b",
            "	": "\\t",
            "\n": "\\n",
            "\f": "\\f",
            "\r": "\\r",
            '"': '\\"',
            "\\": "\\\\"
        }, rep;
        JSON.stringify = function(a, b, c) {
            var d;
            if (gap = "", indent = "", "number" == typeof c) for (d = 0; c > d; d += 1) indent += " "; else "string" == typeof c && (indent = c);
            if (rep = b, !b || "function" == typeof b || "object" == typeof b && "number" == typeof b.length) return str("", {
                "": a
            });
            throw new Error("JSON.stringify");
        }, JSON.parse = function(text, reviver) {
            function walk(a, b) {
                var c, d, e = a[b];
                if (e && "object" == typeof e) for (c in e) Object.prototype.hasOwnProperty.call(e, c) && (d = walk(e, c), 
                void 0 !== d ? e[c] = d : delete e[c]);
                return reviver.call(a, b, e);
            }
            var j;
            if (text = String(text), cx.lastIndex = 0, cx.test(text) && (text = text.replace(cx, function(a) {
                return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
            })), /^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) return j = eval("(" + text + ")"), 
            "function" == typeof reviver ? walk({
                "": j
            }, "") : j;
            throw new SyntaxError("JSON.parse");
        };
    }("undefined" != typeof io ? io : module.exports, "undefined" != typeof JSON ? JSON : void 0), 
    function(a, b) {
        var c = a.parser = {}, d = c.packets = [ "disconnect", "connect", "heartbeat", "message", "json", "event", "ack", "error", "noop" ], e = c.reasons = [ "transport not supported", "client not handshaken", "unauthorized" ], f = c.advice = [ "reconnect" ], g = b.JSON, h = b.util.indexOf;
        c.encodePacket = function(a) {
            var b = h(d, a.type), c = a.id || "", i = a.endpoint || "", j = a.ack, k = null;
            switch (a.type) {
              case "error":
                var l = a.reason ? h(e, a.reason) : "", m = a.advice ? h(f, a.advice) : "";
                ("" !== l || "" !== m) && (k = l + ("" !== m ? "+" + m : ""));
                break;

              case "message":
                "" !== a.data && (k = a.data);
                break;

              case "event":
                var n = {
                    name: a.name
                };
                a.args && a.args.length && (n.args = a.args), k = g.stringify(n);
                break;

              case "json":
                k = g.stringify(a.data);
                break;

              case "connect":
                a.qs && (k = a.qs);
                break;

              case "ack":
                k = a.ackId + (a.args && a.args.length ? "+" + g.stringify(a.args) : "");
            }
            var o = [ b, c + ("data" == j ? "+" : ""), i ];
            return null !== k && void 0 !== k && o.push(k), o.join(":");
        }, c.encodePayload = function(a) {
            var b = "";
            if (1 == a.length) return a[0];
            for (var c = 0, d = a.length; d > c; c++) {
                var e = a[c];
                b += "�" + e.length + "�" + a[c];
            }
            return b;
        };
        var i = /([^:]+):([0-9]+)?(\+)?:([^:]+)?:?([\s\S]*)?/;
        c.decodePacket = function(a) {
            var b = a.match(i);
            if (!b) return {};
            var c = b[2] || "", a = b[5] || "", h = {
                type: d[b[1]],
                endpoint: b[4] || ""
            };
            switch (c && (h.id = c, h.ack = b[3] ? "data" : !0), h.type) {
              case "error":
                var b = a.split("+");
                h.reason = e[b[0]] || "", h.advice = f[b[1]] || "";
                break;

              case "message":
                h.data = a || "";
                break;

              case "event":
                try {
                    var j = g.parse(a);
                    h.name = j.name, h.args = j.args;
                } catch (k) {}
                h.args = h.args || [];
                break;

              case "json":
                try {
                    h.data = g.parse(a);
                } catch (k) {}
                break;

              case "connect":
                h.qs = a || "";
                break;

              case "ack":
                var b = a.match(/^([0-9]+)(\+)?(.*)/);
                if (b && (h.ackId = b[1], h.args = [], b[3])) try {
                    h.args = b[3] ? g.parse(b[3]) : [];
                } catch (k) {}
                break;

              case "disconnect":
              case "heartbeat":            }
            return h;
        }, c.decodePayload = function(a) {
            if ("�" == a.charAt(0)) {
                for (var b = [], d = 1, e = ""; d < a.length; d++) "�" == a.charAt(d) ? (b.push(c.decodePacket(a.substr(d + 1).substr(0, e))), 
                d += Number(e) + 1, e = "") : e += a.charAt(d);
                return b;
            }
            return [ c.decodePacket(a) ];
        };
    }("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports), 
    function(a, b) {
        function c(a, b) {
            this.socket = a, this.sessid = b;
        }
        a.Transport = c, b.util.mixin(c, b.EventEmitter), c.prototype.heartbeats = function() {
            return !0;
        }, c.prototype.onData = function(a) {
            if (this.clearCloseTimeout(), (this.socket.connected || this.socket.connecting || this.socket.reconnecting) && this.setCloseTimeout(), 
            "" !== a) {
                var c = b.parser.decodePayload(a);
                if (c && c.length) for (var d = 0, e = c.length; e > d; d++) this.onPacket(c[d]);
            }
            return this;
        }, c.prototype.onPacket = function(a) {
            return this.socket.setHeartbeatTimeout(), "heartbeat" == a.type ? this.onHeartbeat() : ("connect" == a.type && "" == a.endpoint && this.onConnect(), 
            "error" == a.type && "reconnect" == a.advice && (this.isOpen = !1), this.socket.onPacket(a), 
            this);
        }, c.prototype.setCloseTimeout = function() {
            if (!this.closeTimeout) {
                var a = this;
                this.closeTimeout = setTimeout(function() {
                    a.onDisconnect();
                }, this.socket.closeTimeout);
            }
        }, c.prototype.onDisconnect = function() {
            return this.isOpen && this.close(), this.clearTimeouts(), this.socket.onDisconnect(), 
            this;
        }, c.prototype.onConnect = function() {
            return this.socket.onConnect(), this;
        }, c.prototype.clearCloseTimeout = function() {
            this.closeTimeout && (clearTimeout(this.closeTimeout), this.closeTimeout = null);
        }, c.prototype.clearTimeouts = function() {
            this.clearCloseTimeout(), this.reopenTimeout && clearTimeout(this.reopenTimeout);
        }, c.prototype.packet = function(a) {
            this.send(b.parser.encodePacket(a));
        }, c.prototype.onHeartbeat = function() {
            this.packet({
                type: "heartbeat"
            });
        }, c.prototype.onOpen = function() {
            this.isOpen = !0, this.clearCloseTimeout(), this.socket.onOpen();
        }, c.prototype.onClose = function() {
            this.isOpen = !1, this.socket.onClose(), this.onDisconnect();
        }, c.prototype.prepareUrl = function() {
            var a = this.socket.options;
            return this.scheme() + "://" + a.host + ":" + a.port + "/" + a.resource + "/" + b.protocol + "/" + this.name + "/" + this.sessid;
        }, c.prototype.ready = function(a, b) {
            b.call(this);
        };
    }("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports), 
    function(a, b, c) {
        function d(a) {
            if (this.options = {
                port: 80,
                secure: !1,
                document: "document" in c ? document : !1,
                resource: "socket.io",
                transports: b.transports,
                "connect timeout": 1e4,
                "try multiple transports": !0,
                reconnect: !0,
                "reconnection delay": 500,
                "reconnection limit": 1/0,
                "reopen delay": 3e3,
                "max reconnection attempts": 10,
                "sync disconnect on unload": !1,
                "auto connect": !0,
                "flash policy port": 10843,
                manualFlush: !1
            }, b.util.merge(this.options, a), this.connected = !1, this.open = !1, this.connecting = !1, 
            this.reconnecting = !1, this.namespaces = {}, this.buffer = [], this.doBuffer = !1, 
            this.options["sync disconnect on unload"] && (!this.isXDomain() || b.util.ua.hasCORS)) {
                var d = this;
                b.util.on(c, "beforeunload", function() {
                    d.disconnectSync();
                }, !1);
            }
            this.options["auto connect"] && this.connect();
        }
        function e() {}
        a.Socket = d, b.util.mixin(d, b.EventEmitter), d.prototype.of = function(a) {
            return this.namespaces[a] || (this.namespaces[a] = new b.SocketNamespace(this, a), 
            "" !== a && this.namespaces[a].packet({
                type: "connect"
            })), this.namespaces[a];
        }, d.prototype.publish = function() {
            this.emit.apply(this, arguments);
            var a;
            for (var b in this.namespaces) this.namespaces.hasOwnProperty(b) && (a = this.of(b), 
            a.$emit.apply(a, arguments));
        }, d.prototype.handshake = function(a) {
            function f(b) {
                b instanceof Error ? (c.connecting = !1, c.onError(b.message)) : a.apply(null, b.split(":"));
            }
            var c = this, d = this.options, g = [ "http" + (d.secure ? "s" : "") + ":/", d.host + ":" + d.port, d.resource, b.protocol, b.util.query(this.options.query, "t=" + +new Date()) ].join("/");
            if (this.isXDomain() && !b.util.ua.hasCORS) {
                var h = document.getElementsByTagName("script")[0], i = document.createElement("script");
                i.src = g + "&jsonp=" + b.j.length, h.parentNode.insertBefore(i, h), b.j.push(function(a) {
                    f(a), i.parentNode.removeChild(i);
                });
            } else {
                var j = b.util.request();
                j.open("GET", g, !0), this.isXDomain() && (j.withCredentials = !0), j.onreadystatechange = function() {
                    4 == j.readyState && (j.onreadystatechange = e, 200 == j.status ? f(j.responseText) : 403 == j.status ? c.onError(j.responseText) : (c.connecting = !1, 
                    !c.reconnecting && c.onError(j.responseText)));
                }, j.send(null);
            }
        }, d.prototype.getTransport = function(a) {
            for (var f, c = a || this.transports, e = 0; f = c[e]; e++) if (b.Transport[f] && b.Transport[f].check(this) && (!this.isXDomain() || b.Transport[f].xdomainCheck(this))) return new b.Transport[f](this, this.sessionid);
            return null;
        }, d.prototype.connect = function(a) {
            if (this.connecting) return this;
            var c = this;
            return c.connecting = !0, this.handshake(function(d, e, f, g) {
                function h(a) {
                    return c.transport && c.transport.clearTimeouts(), c.transport = c.getTransport(a), 
                    c.transport ? (c.transport.ready(c, function() {
                        c.connecting = !0, c.publish("connecting", c.transport.name), c.transport.open(), 
                        c.options["connect timeout"] && (c.connectTimeoutTimer = setTimeout(function() {
                            if (!c.connected && (c.connecting = !1, c.options["try multiple transports"])) {
                                for (var a = c.transports; a.length > 0 && a.splice(0, 1)[0] != c.transport.name; ) ;
                                a.length ? h(a) : c.publish("connect_failed");
                            }
                        }, c.options["connect timeout"]));
                    }), void 0) : c.publish("connect_failed");
                }
                c.sessionid = d, c.closeTimeout = 1e3 * f, c.heartbeatTimeout = 1e3 * e, c.transports || (c.transports = c.origTransports = g ? b.util.intersect(g.split(","), c.options.transports) : c.options.transports), 
                c.setHeartbeatTimeout(), h(c.transports), c.once("connect", function() {
                    clearTimeout(c.connectTimeoutTimer), a && "function" == typeof a && a();
                });
            }), this;
        }, d.prototype.setHeartbeatTimeout = function() {
            if (clearTimeout(this.heartbeatTimeoutTimer), !this.transport || this.transport.heartbeats()) {
                var a = this;
                this.heartbeatTimeoutTimer = setTimeout(function() {
                    a.transport.onClose();
                }, this.heartbeatTimeout);
            }
        }, d.prototype.packet = function(a) {
            return this.connected && !this.doBuffer ? this.transport.packet(a) : this.buffer.push(a), 
            this;
        }, d.prototype.setBuffer = function(a) {
            this.doBuffer = a, !a && this.connected && this.buffer.length && (this.options.manualFlush || this.flushBuffer());
        }, d.prototype.flushBuffer = function() {
            this.transport.payload(this.buffer), this.buffer = [];
        }, d.prototype.disconnect = function() {
            return (this.connected || this.connecting) && (this.open && this.of("").packet({
                type: "disconnect"
            }), this.onDisconnect("booted")), this;
        }, d.prototype.disconnectSync = function() {
            var a = b.util.request(), c = [ "http" + (this.options.secure ? "s" : "") + ":/", this.options.host + ":" + this.options.port, this.options.resource, b.protocol, "", this.sessionid ].join("/") + "/?disconnect=1";
            a.open("GET", c, !1), a.send(null), this.onDisconnect("booted");
        }, d.prototype.isXDomain = function() {
            var a = c.location.port || ("https:" == c.location.protocol ? 443 : 80);
            return this.options.host !== c.location.hostname || this.options.port != a;
        }, d.prototype.onConnect = function() {
            this.connected || (this.connected = !0, this.connecting = !1, this.doBuffer || this.setBuffer(!1), 
            this.emit("connect"));
        }, d.prototype.onOpen = function() {
            this.open = !0;
        }, d.prototype.onClose = function() {
            this.open = !1, clearTimeout(this.heartbeatTimeoutTimer);
        }, d.prototype.onPacket = function(a) {
            this.of(a.endpoint).onPacket(a);
        }, d.prototype.onError = function(a) {
            a && a.advice && "reconnect" === a.advice && (this.connected || this.connecting) && (this.disconnect(), 
            this.options.reconnect && this.reconnect()), this.publish("error", a && a.reason ? a.reason : a);
        }, d.prototype.onDisconnect = function(a) {
            var b = this.connected, c = this.connecting;
            this.connected = !1, this.connecting = !1, this.open = !1, (b || c) && (this.transport.close(), 
            this.transport.clearTimeouts(), b && (this.publish("disconnect", a), "booted" != a && this.options.reconnect && !this.reconnecting && this.reconnect()));
        }, d.prototype.reconnect = function() {
            function e() {
                if (a.connected) {
                    for (var b in a.namespaces) a.namespaces.hasOwnProperty(b) && "" !== b && a.namespaces[b].packet({
                        type: "connect"
                    });
                    a.publish("reconnect", a.transport.name, a.reconnectionAttempts);
                }
                clearTimeout(a.reconnectionTimer), a.removeListener("connect_failed", f), a.removeListener("connect", f), 
                a.reconnecting = !1, delete a.reconnectionAttempts, delete a.reconnectionDelay, 
                delete a.reconnectionTimer, delete a.redoTransports, a.options["try multiple transports"] = c;
            }
            function f() {
                return a.reconnecting ? a.connected ? e() : a.connecting && a.reconnecting ? a.reconnectionTimer = setTimeout(f, 1e3) : (a.reconnectionAttempts++ >= b ? a.redoTransports ? (a.publish("reconnect_failed"), 
                e()) : (a.on("connect_failed", f), a.options["try multiple transports"] = !0, a.transports = a.origTransports, 
                a.transport = a.getTransport(), a.redoTransports = !0, a.connect()) : (a.reconnectionDelay < d && (a.reconnectionDelay *= 2), 
                a.connect(), a.publish("reconnecting", a.reconnectionDelay, a.reconnectionAttempts), 
                a.reconnectionTimer = setTimeout(f, a.reconnectionDelay)), void 0) : void 0;
            }
            this.reconnecting = !0, this.reconnectionAttempts = 0, this.reconnectionDelay = this.options["reconnection delay"];
            var a = this, b = this.options["max reconnection attempts"], c = this.options["try multiple transports"], d = this.options["reconnection limit"];
            this.options["try multiple transports"] = !1, this.reconnectionTimer = setTimeout(f, this.reconnectionDelay), 
            this.on("connect", f);
        };
    }("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports, this), 
    function(a, b) {
        function c(a, b) {
            this.socket = a, this.name = b || "", this.flags = {}, this.json = new d(this, "json"), 
            this.ackPackets = 0, this.acks = {};
        }
        function d(a, b) {
            this.namespace = a, this.name = b;
        }
        a.SocketNamespace = c, b.util.mixin(c, b.EventEmitter), c.prototype.$emit = b.EventEmitter.prototype.emit, 
        c.prototype.of = function() {
            return this.socket.of.apply(this.socket, arguments);
        }, c.prototype.packet = function(a) {
            return a.endpoint = this.name, this.socket.packet(a), this.flags = {}, this;
        }, c.prototype.send = function(a, b) {
            var c = {
                type: this.flags.json ? "json" : "message",
                data: a
            };
            return "function" == typeof b && (c.id = ++this.ackPackets, c.ack = !0, this.acks[c.id] = b), 
            this.packet(c);
        }, c.prototype.emit = function(a) {
            var b = Array.prototype.slice.call(arguments, 1), c = b[b.length - 1], d = {
                type: "event",
                name: a
            };
            return "function" == typeof c && (d.id = ++this.ackPackets, d.ack = "data", this.acks[d.id] = c, 
            b = b.slice(0, b.length - 1)), d.args = b, this.packet(d);
        }, c.prototype.disconnect = function() {
            return "" === this.name ? this.socket.disconnect() : (this.packet({
                type: "disconnect"
            }), this.$emit("disconnect")), this;
        }, c.prototype.onPacket = function(a) {
            function d() {
                c.packet({
                    type: "ack",
                    args: b.util.toArray(arguments),
                    ackId: a.id
                });
            }
            var c = this;
            switch (a.type) {
              case "connect":
                this.$emit("connect");
                break;

              case "disconnect":
                "" === this.name ? this.socket.onDisconnect(a.reason || "booted") : this.$emit("disconnect", a.reason);
                break;

              case "message":
              case "json":
                var e = [ "message", a.data ];
                "data" == a.ack ? e.push(d) : a.ack && this.packet({
                    type: "ack",
                    ackId: a.id
                }), this.$emit.apply(this, e);
                break;

              case "event":
                var e = [ a.name ].concat(a.args);
                "data" == a.ack && e.push(d), this.$emit.apply(this, e);
                break;

              case "ack":
                this.acks[a.ackId] && (this.acks[a.ackId].apply(this, a.args), delete this.acks[a.ackId]);
                break;

              case "error":
                a.advice ? this.socket.onError(a) : "unauthorized" == a.reason ? this.$emit("connect_failed", a.reason) : this.$emit("error", a.reason);
            }
        }, d.prototype.send = function() {
            this.namespace.flags[this.name] = !0, this.namespace.send.apply(this.namespace, arguments);
        }, d.prototype.emit = function() {
            this.namespace.flags[this.name] = !0, this.namespace.emit.apply(this.namespace, arguments);
        };
    }("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports), 
    function(a, b, c) {
        function d() {
            b.Transport.apply(this, arguments);
        }
        a.websocket = d, b.util.inherit(d, b.Transport), d.prototype.name = "websocket", 
        d.prototype.open = function() {
            var e, a = b.util.query(this.socket.options.query), d = this;
            return e || (e = c.MozWebSocket || c.WebSocket), this.websocket = new e(this.prepareUrl() + a), 
            this.websocket.onopen = function() {
                d.onOpen(), d.socket.setBuffer(!1);
            }, this.websocket.onmessage = function(a) {
                d.onData(a.data);
            }, this.websocket.onclose = function() {
                d.onClose(), d.socket.setBuffer(!0);
            }, this.websocket.onerror = function(a) {
                d.onError(a);
            }, this;
        }, d.prototype.send = b.util.ua.iDevice ? function(a) {
            var b = this;
            return setTimeout(function() {
                b.websocket.send(a);
            }, 0), this;
        } : function(a) {
            return this.websocket.send(a), this;
        }, d.prototype.payload = function(a) {
            for (var b = 0, c = a.length; c > b; b++) this.packet(a[b]);
            return this;
        }, d.prototype.close = function() {
            return this.websocket.close(), this;
        }, d.prototype.onError = function(a) {
            this.socket.onError(a);
        }, d.prototype.scheme = function() {
            return this.socket.options.secure ? "wss" : "ws";
        }, d.check = function() {
            return "WebSocket" in c && !("__addTask" in WebSocket) || "MozWebSocket" in c;
        }, d.xdomainCheck = function() {
            return !0;
        }, b.transports.push("websocket");
    }("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports, this), 
    function(a, b) {
        function c() {
            b.Transport.websocket.apply(this, arguments);
        }
        a.flashsocket = c, b.util.inherit(c, b.Transport.websocket), c.prototype.name = "flashsocket", 
        c.prototype.open = function() {
            var a = this, c = arguments;
            return WebSocket.__addTask(function() {
                b.Transport.websocket.prototype.open.apply(a, c);
            }), this;
        }, c.prototype.send = function() {
            var a = this, c = arguments;
            return WebSocket.__addTask(function() {
                b.Transport.websocket.prototype.send.apply(a, c);
            }), this;
        }, c.prototype.close = function() {
            return WebSocket.__tasks.length = 0, b.Transport.websocket.prototype.close.call(this), 
            this;
        }, c.prototype.ready = function(a, d) {
            function e() {
                var b = a.options, e = b["flash policy port"], g = [ "http" + (b.secure ? "s" : "") + ":/", b.host + ":" + b.port, b.resource, "static/flashsocket", "WebSocketMain" + (a.isXDomain() ? "Insecure" : "") + ".swf" ];
                c.loaded || ("undefined" == typeof WEB_SOCKET_SWF_LOCATION && (WEB_SOCKET_SWF_LOCATION = g.join("/")), 
                843 !== e && WebSocket.loadFlashPolicyFile("xmlsocket://" + b.host + ":" + e), WebSocket.__initialize(), 
                c.loaded = !0), d.call(f);
            }
            var f = this;
            return document.body ? e() : (b.util.load(e), void 0);
        }, c.check = function() {
            return "undefined" != typeof WebSocket && "__initialize" in WebSocket && swfobject ? swfobject.getFlashPlayerVersion().major >= 10 : !1;
        }, c.xdomainCheck = function() {
            return !0;
        }, "undefined" != typeof window && (WEB_SOCKET_DISABLE_AUTO_INITIALIZATION = !0), 
        b.transports.push("flashsocket");
    }("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports), 
    "undefined" != typeof window) var swfobject = function() {
        function A() {
            if (!t) {
                try {
                    var a = i.getElementsByTagName("body")[0].appendChild(Q("span"));
                    a.parentNode.removeChild(a);
                } catch (b) {
                    return;
                }
                t = !0;
                for (var c = l.length, d = 0; c > d; d++) l[d]();
            }
        }
        function B(a) {
            t ? a() : l[l.length] = a;
        }
        function C(b) {
            if (typeof h.addEventListener != a) h.addEventListener("load", b, !1); else if (typeof i.addEventListener != a) i.addEventListener("load", b, !1); else if (typeof h.attachEvent != a) R(h, "onload", b); else if ("function" == typeof h.onload) {
                var c = h.onload;
                h.onload = function() {
                    c(), b();
                };
            } else h.onload = b;
        }
        function D() {
            k ? E() : F();
        }
        function E() {
            var c = i.getElementsByTagName("body")[0], d = Q(b);
            d.setAttribute("type", e);
            var f = c.appendChild(d);
            if (f) {
                var g = 0;
                !function() {
                    if (typeof f.GetVariable != a) {
                        var b = f.GetVariable("$version");
                        b && (b = b.split(" ")[1].split(","), y.pv = [ parseInt(b[0], 10), parseInt(b[1], 10), parseInt(b[2], 10) ]);
                    } else if (10 > g) return g++, setTimeout(arguments.callee, 10), void 0;
                    c.removeChild(d), f = null, F();
                }();
            } else F();
        }
        function F() {
            var b = m.length;
            if (b > 0) for (var c = 0; b > c; c++) {
                var d = m[c].id, e = m[c].callbackFn, f = {
                    success: !1,
                    id: d
                };
                if (y.pv[0] > 0) {
                    var g = P(d);
                    if (g) if (!S(m[c].swfVersion) || y.wk && y.wk < 312) if (m[c].expressInstall && H()) {
                        var h = {};
                        h.data = m[c].expressInstall, h.width = g.getAttribute("width") || "0", h.height = g.getAttribute("height") || "0", 
                        g.getAttribute("class") && (h.styleclass = g.getAttribute("class")), g.getAttribute("align") && (h.align = g.getAttribute("align"));
                        for (var i = {}, j = g.getElementsByTagName("param"), k = j.length, l = 0; k > l; l++) "movie" != j[l].getAttribute("name").toLowerCase() && (i[j[l].getAttribute("name")] = j[l].getAttribute("value"));
                        I(h, i, d, e);
                    } else J(g), e && e(f); else U(d, !0), e && (f.success = !0, f.ref = G(d), e(f));
                } else if (U(d, !0), e) {
                    var n = G(d);
                    n && typeof n.SetVariable != a && (f.success = !0, f.ref = n), e(f);
                }
            }
        }
        function G(c) {
            var d = null, e = P(c);
            if (e && "OBJECT" == e.nodeName) if (typeof e.SetVariable != a) d = e; else {
                var f = e.getElementsByTagName(b)[0];
                f && (d = f);
            }
            return d;
        }
        function H() {
            return !u && S("6.0.65") && (y.win || y.mac) && !(y.wk && y.wk < 312);
        }
        function I(b, c, d, e) {
            u = !0, r = e || null, s = {
                success: !1,
                id: d
            };
            var g = P(d);
            if (g) {
                "OBJECT" == g.nodeName ? (p = K(g), q = null) : (p = g, q = d), b.id = f, (typeof b.width == a || !/%$/.test(b.width) && parseInt(b.width, 10) < 310) && (b.width = "310"), 
                (typeof b.height == a || !/%$/.test(b.height) && parseInt(b.height, 10) < 137) && (b.height = "137"), 
                i.title = i.title.slice(0, 47) + " - Flash Player Installation";
                var j = y.ie && y.win ? [ "Active" ].concat("").join("X") : "PlugIn", k = "MMredirectURL=" + h.location.toString().replace(/&/g, "%26") + "&MMplayerType=" + j + "&MMdoctitle=" + i.title;
                if (typeof c.flashvars != a ? c.flashvars += "&" + k : c.flashvars = k, y.ie && y.win && 4 != g.readyState) {
                    var l = Q("div");
                    d += "SWFObjectNew", l.setAttribute("id", d), g.parentNode.insertBefore(l, g), g.style.display = "none", 
                    function() {
                        4 == g.readyState ? g.parentNode.removeChild(g) : setTimeout(arguments.callee, 10);
                    }();
                }
                L(b, c, d);
            }
        }
        function J(a) {
            if (y.ie && y.win && 4 != a.readyState) {
                var b = Q("div");
                a.parentNode.insertBefore(b, a), b.parentNode.replaceChild(K(a), b), a.style.display = "none", 
                function() {
                    4 == a.readyState ? a.parentNode.removeChild(a) : setTimeout(arguments.callee, 10);
                }();
            } else a.parentNode.replaceChild(K(a), a);
        }
        function K(a) {
            var c = Q("div");
            if (y.win && y.ie) c.innerHTML = a.innerHTML; else {
                var d = a.getElementsByTagName(b)[0];
                if (d) {
                    var e = d.childNodes;
                    if (e) for (var f = e.length, g = 0; f > g; g++) (1 != e[g].nodeType || "PARAM" != e[g].nodeName) && 8 != e[g].nodeType && c.appendChild(e[g].cloneNode(!0));
                }
            }
            return c;
        }
        function L(c, d, f) {
            var g, h = P(f);
            if (y.wk && y.wk < 312) return g;
            if (h) if (typeof c.id == a && (c.id = f), y.ie && y.win) {
                var i = "";
                for (var j in c) c[j] != Object.prototype[j] && ("data" == j.toLowerCase() ? d.movie = c[j] : "styleclass" == j.toLowerCase() ? i += ' class="' + c[j] + '"' : "classid" != j.toLowerCase() && (i += " " + j + '="' + c[j] + '"'));
                var k = "";
                for (var l in d) d[l] != Object.prototype[l] && (k += '<param name="' + l + '" value="' + d[l] + '" />');
                h.outerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' + i + ">" + k + "</object>", 
                n[n.length] = c.id, g = P(c.id);
            } else {
                var m = Q(b);
                m.setAttribute("type", e);
                for (var o in c) c[o] != Object.prototype[o] && ("styleclass" == o.toLowerCase() ? m.setAttribute("class", c[o]) : "classid" != o.toLowerCase() && m.setAttribute(o, c[o]));
                for (var p in d) d[p] != Object.prototype[p] && "movie" != p.toLowerCase() && M(m, p, d[p]);
                h.parentNode.replaceChild(m, h), g = m;
            }
            return g;
        }
        function M(a, b, c) {
            var d = Q("param");
            d.setAttribute("name", b), d.setAttribute("value", c), a.appendChild(d);
        }
        function N(a) {
            var b = P(a);
            b && "OBJECT" == b.nodeName && (y.ie && y.win ? (b.style.display = "none", function() {
                4 == b.readyState ? O(a) : setTimeout(arguments.callee, 10);
            }()) : b.parentNode.removeChild(b));
        }
        function O(a) {
            var b = P(a);
            if (b) {
                for (var c in b) "function" == typeof b[c] && (b[c] = null);
                b.parentNode.removeChild(b);
            }
        }
        function P(a) {
            var b = null;
            try {
                b = i.getElementById(a);
            } catch (c) {}
            return b;
        }
        function Q(a) {
            return i.createElement(a);
        }
        function R(a, b, c) {
            a.attachEvent(b, c), o[o.length] = [ a, b, c ];
        }
        function S(a) {
            var b = y.pv, c = a.split(".");
            return c[0] = parseInt(c[0], 10), c[1] = parseInt(c[1], 10) || 0, c[2] = parseInt(c[2], 10) || 0, 
            b[0] > c[0] || b[0] == c[0] && b[1] > c[1] || b[0] == c[0] && b[1] == c[1] && b[2] >= c[2] ? !0 : !1;
        }
        function T(c, d, e, f) {
            if (!y.ie || !y.mac) {
                var g = i.getElementsByTagName("head")[0];
                if (g) {
                    var h = e && "string" == typeof e ? e : "screen";
                    if (f && (v = null, w = null), !v || w != h) {
                        var j = Q("style");
                        j.setAttribute("type", "text/css"), j.setAttribute("media", h), v = g.appendChild(j), 
                        y.ie && y.win && typeof i.styleSheets != a && i.styleSheets.length > 0 && (v = i.styleSheets[i.styleSheets.length - 1]), 
                        w = h;
                    }
                    y.ie && y.win ? v && typeof v.addRule == b && v.addRule(c, d) : v && typeof i.createTextNode != a && v.appendChild(i.createTextNode(c + " {" + d + "}"));
                }
            }
        }
        function U(a, b) {
            if (x) {
                var c = b ? "visible" : "hidden";
                t && P(a) ? P(a).style.visibility = c : T("#" + a, "visibility:" + c);
            }
        }
        function V(b) {
            var c = /[\\\"<>\.;]/, d = null != c.exec(b);
            return d && typeof encodeURIComponent != a ? encodeURIComponent(b) : b;
        }
        var p, q, r, s, v, w, a = "undefined", b = "object", c = "Shockwave Flash", d = "ShockwaveFlash.ShockwaveFlash", e = "application/x-shockwave-flash", f = "SWFObjectExprInst", g = "onreadystatechange", h = window, i = document, j = navigator, k = !1, l = [ D ], m = [], n = [], o = [], t = !1, u = !1, x = !0, y = function() {
            var f = typeof i.getElementById != a && typeof i.getElementsByTagName != a && typeof i.createElement != a, g = j.userAgent.toLowerCase(), l = j.platform.toLowerCase(), m = l ? /win/.test(l) : /win/.test(g), n = l ? /mac/.test(l) : /mac/.test(g), o = /webkit/.test(g) ? parseFloat(g.replace(/^.*webkit\/(\d+(\.\d+)?).*$/, "$1")) : !1, p = !1, q = [ 0, 0, 0 ], r = null;
            if (typeof j.plugins != a && typeof j.plugins[c] == b) r = j.plugins[c].description, 
            r && (typeof j.mimeTypes == a || !j.mimeTypes[e] || !!j.mimeTypes[e].enabledPlugin) && (k = !0, 
            p = !1, r = r.replace(/^.*\s+(\S+\s+\S+$)/, "$1"), q[0] = parseInt(r.replace(/^(.*)\..*$/, "$1"), 10), 
            q[1] = parseInt(r.replace(/^.*\.(.*)\s.*$/, "$1"), 10), q[2] = /[a-zA-Z]/.test(r) ? parseInt(r.replace(/^.*[a-zA-Z]+(.*)$/, "$1"), 10) : 0); else if (typeof h[[ "Active" ].concat("Object").join("X")] != a) try {
                var s = new (window[[ "Active" ].concat("Object").join("X")])(d);
                s && (r = s.GetVariable("$version"), r && (p = !0, r = r.split(" ")[1].split(","), 
                q = [ parseInt(r[0], 10), parseInt(r[1], 10), parseInt(r[2], 10) ]));
            } catch (t) {}
            return {
                w3: f,
                pv: q,
                wk: o,
                ie: p,
                win: m,
                mac: n
            };
        }();
        return !function() {
            y.w3 && ((typeof i.readyState != a && "complete" == i.readyState || typeof i.readyState == a && (i.getElementsByTagName("body")[0] || i.body)) && A(), 
            t || (typeof i.addEventListener != a && i.addEventListener("DOMContentLoaded", A, !1), 
            y.ie && y.win && (i.attachEvent(g, function() {
                "complete" == i.readyState && (i.detachEvent(g, arguments.callee), A());
            }), h == top && function() {
                if (!t) {
                    try {
                        i.documentElement.doScroll("left");
                    } catch (a) {
                        return setTimeout(arguments.callee, 0), void 0;
                    }
                    A();
                }
            }()), y.wk && function() {
                return t ? void 0 : /loaded|complete/.test(i.readyState) ? (A(), void 0) : (setTimeout(arguments.callee, 0), 
                void 0);
            }(), C(A)));
        }(), function() {
            y.ie && y.win && window.attachEvent("onunload", function() {
                for (var a = o.length, b = 0; a > b; b++) o[b][0].detachEvent(o[b][1], o[b][2]);
                for (var c = n.length, d = 0; c > d; d++) N(n[d]);
                for (var e in y) y[e] = null;
                y = null;
                for (var f in swfobject) swfobject[f] = null;
                swfobject = null;
            });
        }(), {
            registerObject: function(a, b, c, d) {
                if (y.w3 && a && b) {
                    var e = {};
                    e.id = a, e.swfVersion = b, e.expressInstall = c, e.callbackFn = d, m[m.length] = e, 
                    U(a, !1);
                } else d && d({
                    success: !1,
                    id: a
                });
            },
            getObjectById: function(a) {
                return y.w3 ? G(a) : void 0;
            },
            embedSWF: function(c, d, e, f, g, h, i, j, k, l) {
                var m = {
                    success: !1,
                    id: d
                };
                y.w3 && !(y.wk && y.wk < 312) && c && d && e && f && g ? (U(d, !1), B(function() {
                    e += "", f += "";
                    var n = {};
                    if (k && typeof k === b) for (var o in k) n[o] = k[o];
                    n.data = c, n.width = e, n.height = f;
                    var p = {};
                    if (j && typeof j === b) for (var q in j) p[q] = j[q];
                    if (i && typeof i === b) for (var r in i) typeof p.flashvars != a ? p.flashvars += "&" + r + "=" + i[r] : p.flashvars = r + "=" + i[r];
                    if (S(g)) {
                        var s = L(n, p, d);
                        n.id == d && U(d, !0), m.success = !0, m.ref = s;
                    } else {
                        if (h && H()) return n.data = h, I(n, p, d, l), void 0;
                        U(d, !0);
                    }
                    l && l(m);
                })) : l && l(m);
            },
            switchOffAutoHideShow: function() {
                x = !1;
            },
            ua: y,
            getFlashPlayerVersion: function() {
                return {
                    major: y.pv[0],
                    minor: y.pv[1],
                    release: y.pv[2]
                };
            },
            hasFlashPlayerVersion: S,
            createSWF: function(a, b, c) {
                return y.w3 ? L(a, b, c) : void 0;
            },
            showExpressInstall: function(a, b, c, d) {
                y.w3 && H() && I(a, b, c, d);
            },
            removeSWF: function(a) {
                y.w3 && N(a);
            },
            createCSS: function(a, b, c, d) {
                y.w3 && T(a, b, c, d);
            },
            addDomLoadEvent: B,
            addLoadEvent: C,
            getQueryParamValue: function(a) {
                var b = i.location.search || i.location.hash;
                if (b) {
                    if (/\?/.test(b) && (b = b.split("?")[1]), null == a) return V(b);
                    for (var c = b.split("&"), d = 0; d < c.length; d++) if (c[d].substring(0, c[d].indexOf("=")) == a) return V(c[d].substring(c[d].indexOf("=") + 1));
                }
                return "";
            },
            expressInstallCallback: function() {
                if (u) {
                    var a = P(f);
                    a && p && (a.parentNode.replaceChild(p, a), q && (U(q, !0), y.ie && y.win && (p.style.display = "block")), 
                    r && r(s)), u = !1;
                }
            }
        };
    }();
    !function() {
        if ("undefined" != typeof window && !window.WebSocket) {
            var a = window.console;
            return a && a.log && a.error || (a = {
                log: function() {},
                error: function() {}
            }), swfobject.hasFlashPlayerVersion("10.0.0") ? ("file:" == location.protocol && a.error("WARNING: web-socket-js doesn't work in file:///... URL unless you set Flash Security Settings properly. Open the page via Web server i.e. http://..."), 
            WebSocket = function(a, b, c, d, e) {
                var f = this;
                f.__id = WebSocket.__nextId++, WebSocket.__instances[f.__id] = f, f.readyState = WebSocket.CONNECTING, 
                f.bufferedAmount = 0, f.__events = {}, b ? "string" == typeof b && (b = [ b ]) : b = [], 
                setTimeout(function() {
                    WebSocket.__addTask(function() {
                        WebSocket.__flash.create(f.__id, a, b, c || null, d || 0, e || null);
                    });
                }, 0);
            }, WebSocket.prototype.send = function(a) {
                if (this.readyState == WebSocket.CONNECTING) throw "INVALID_STATE_ERR: Web Socket connection has not been established";
                var b = WebSocket.__flash.send(this.__id, encodeURIComponent(a));
                return 0 > b ? !0 : (this.bufferedAmount += b, !1);
            }, WebSocket.prototype.close = function() {
                this.readyState != WebSocket.CLOSED && this.readyState != WebSocket.CLOSING && (this.readyState = WebSocket.CLOSING, 
                WebSocket.__flash.close(this.__id));
            }, WebSocket.prototype.addEventListener = function(a, b) {
                a in this.__events || (this.__events[a] = []), this.__events[a].push(b);
            }, WebSocket.prototype.removeEventListener = function(a, b) {
                if (a in this.__events) for (var d = this.__events[a], e = d.length - 1; e >= 0; --e) if (d[e] === b) {
                    d.splice(e, 1);
                    break;
                }
            }, WebSocket.prototype.dispatchEvent = function(a) {
                for (var b = this.__events[a.type] || [], c = 0; c < b.length; ++c) b[c](a);
                var d = this["on" + a.type];
                d && d(a);
            }, WebSocket.prototype.__handleEvent = function(a) {
                "readyState" in a && (this.readyState = a.readyState), "protocol" in a && (this.protocol = a.protocol);
                var b;
                if ("open" == a.type || "error" == a.type) b = this.__createSimpleEvent(a.type); else if ("close" == a.type) b = this.__createSimpleEvent("close"); else {
                    if ("message" != a.type) throw "unknown event type: " + a.type;
                    var c = decodeURIComponent(a.message);
                    b = this.__createMessageEvent("message", c);
                }
                this.dispatchEvent(b);
            }, WebSocket.prototype.__createSimpleEvent = function(a) {
                if (document.createEvent && window.Event) {
                    var b = document.createEvent("Event");
                    return b.initEvent(a, !1, !1), b;
                }
                return {
                    type: a,
                    bubbles: !1,
                    cancelable: !1
                };
            }, WebSocket.prototype.__createMessageEvent = function(a, b) {
                if (document.createEvent && window.MessageEvent && !window.opera) {
                    var c = document.createEvent("MessageEvent");
                    return c.initMessageEvent("message", !1, !1, b, null, null, window, null), c;
                }
                return {
                    type: a,
                    data: b,
                    bubbles: !1,
                    cancelable: !1
                };
            }, WebSocket.CONNECTING = 0, WebSocket.OPEN = 1, WebSocket.CLOSING = 2, WebSocket.CLOSED = 3, 
            WebSocket.__flash = null, WebSocket.__instances = {}, WebSocket.__tasks = [], WebSocket.__nextId = 0, 
            WebSocket.loadFlashPolicyFile = function(a) {
                WebSocket.__addTask(function() {
                    WebSocket.__flash.loadManualPolicyFile(a);
                });
            }, WebSocket.__initialize = function() {
                if (!WebSocket.__flash) {
                    if (WebSocket.__swfLocation && (window.WEB_SOCKET_SWF_LOCATION = WebSocket.__swfLocation), 
                    !window.WEB_SOCKET_SWF_LOCATION) return a.error("[WebSocket] set WEB_SOCKET_SWF_LOCATION to location of WebSocketMain.swf"), 
                    void 0;
                    var b = document.createElement("div");
                    b.id = "webSocketContainer", b.style.position = "absolute", WebSocket.__isFlashLite() ? (b.style.left = "0px", 
                    b.style.top = "0px") : (b.style.left = "-100px", b.style.top = "-100px");
                    var c = document.createElement("div");
                    c.id = "webSocketFlash", b.appendChild(c), document.body.appendChild(b), swfobject.embedSWF(WEB_SOCKET_SWF_LOCATION, "webSocketFlash", "1", "1", "10.0.0", null, null, {
                        hasPriority: !0,
                        swliveconnect: !0,
                        allowScriptAccess: "always"
                    }, null, function(b) {
                        b.success || a.error("[WebSocket] swfobject.embedSWF failed");
                    });
                }
            }, WebSocket.__onFlashInitialized = function() {
                setTimeout(function() {
                    WebSocket.__flash = document.getElementById("webSocketFlash"), WebSocket.__flash.setCallerUrl(location.href), 
                    WebSocket.__flash.setDebug(!!window.WEB_SOCKET_DEBUG);
                    for (var a = 0; a < WebSocket.__tasks.length; ++a) WebSocket.__tasks[a]();
                    WebSocket.__tasks = [];
                }, 0);
            }, WebSocket.__onFlashEvent = function() {
                return setTimeout(function() {
                    try {
                        for (var b = WebSocket.__flash.receiveEvents(), c = 0; c < b.length; ++c) WebSocket.__instances[b[c].webSocketId].__handleEvent(b[c]);
                    } catch (d) {
                        a.error(d);
                    }
                }, 0), !0;
            }, WebSocket.__log = function(b) {
                a.log(decodeURIComponent(b));
            }, WebSocket.__error = function(b) {
                a.error(decodeURIComponent(b));
            }, WebSocket.__addTask = function(a) {
                WebSocket.__flash ? a() : WebSocket.__tasks.push(a);
            }, WebSocket.__isFlashLite = function() {
                if (!window.navigator || !window.navigator.mimeTypes) return !1;
                var a = window.navigator.mimeTypes["application/x-shockwave-flash"];
                return a && a.enabledPlugin && a.enabledPlugin.filename ? a.enabledPlugin.filename.match(/flashlite/i) ? !0 : !1 : !1;
            }, window.WEB_SOCKET_DISABLE_AUTO_INITIALIZATION || (window.addEventListener ? window.addEventListener("load", function() {
                WebSocket.__initialize();
            }, !1) : window.attachEvent("onload", function() {
                WebSocket.__initialize();
            })), void 0) : (a.error("Flash Player >= 10.0.0 is required."), void 0);
        }
    }(), function(a, b, c) {
        function d(a) {
            a && (b.Transport.apply(this, arguments), this.sendBuffer = []);
        }
        function e() {}
        a.XHR = d, b.util.inherit(d, b.Transport), d.prototype.open = function() {
            return this.socket.setBuffer(!1), this.onOpen(), this.get(), this.setCloseTimeout(), 
            this;
        }, d.prototype.payload = function(a) {
            for (var c = [], d = 0, e = a.length; e > d; d++) c.push(b.parser.encodePacket(a[d]));
            this.send(b.parser.encodePayload(c));
        }, d.prototype.send = function(a) {
            return this.post(a), this;
        }, d.prototype.post = function(a) {
            function d() {
                4 == this.readyState && (this.onreadystatechange = e, b.posting = !1, 200 == this.status ? b.socket.setBuffer(!1) : b.onClose());
            }
            function f() {
                this.onload = e, b.socket.setBuffer(!1);
            }
            var b = this;
            this.socket.setBuffer(!0), this.sendXHR = this.request("POST"), c.XDomainRequest && this.sendXHR instanceof XDomainRequest ? this.sendXHR.onload = this.sendXHR.onerror = f : this.sendXHR.onreadystatechange = d, 
            this.sendXHR.send(a);
        }, d.prototype.close = function() {
            return this.onClose(), this;
        }, d.prototype.request = function(a) {
            var c = b.util.request(this.socket.isXDomain()), d = b.util.query(this.socket.options.query, "t=" + +new Date());
            if (c.open(a || "GET", this.prepareUrl() + d, !0), "POST" == a) try {
                c.setRequestHeader ? c.setRequestHeader("Content-type", "text/plain;charset=UTF-8") : c.contentType = "text/plain";
            } catch (e) {}
            return c;
        }, d.prototype.scheme = function() {
            return this.socket.options.secure ? "https" : "http";
        }, d.check = function(a, d) {
            try {
                var e = b.util.request(d), f = c.XDomainRequest && e instanceof XDomainRequest, g = a && a.options && a.options.secure ? "https:" : "http:", h = c.location && g != c.location.protocol;
                if (e && (!f || !h)) return !0;
            } catch (i) {}
            return !1;
        }, d.xdomainCheck = function(a) {
            return d.check(a, !0);
        };
    }("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports, this), 
    function(a, b) {
        function c() {
            b.Transport.XHR.apply(this, arguments);
        }
        a.htmlfile = c, b.util.inherit(c, b.Transport.XHR), c.prototype.name = "htmlfile", 
        c.prototype.get = function() {
            this.doc = new (window[[ "Active" ].concat("Object").join("X")])("htmlfile"), this.doc.open(), 
            this.doc.write("<html></html>"), this.doc.close(), this.doc.parentWindow.s = this;
            var a = this.doc.createElement("div");
            a.className = "socketio", this.doc.body.appendChild(a), this.iframe = this.doc.createElement("iframe"), 
            a.appendChild(this.iframe);
            var c = this, d = b.util.query(this.socket.options.query, "t=" + +new Date());
            this.iframe.src = this.prepareUrl() + d, b.util.on(window, "unload", function() {
                c.destroy();
            });
        }, c.prototype._ = function(a, b) {
            a = a.replace(/\\\//g, "/"), this.onData(a);
            try {
                var c = b.getElementsByTagName("script")[0];
                c.parentNode.removeChild(c);
            } catch (d) {}
        }, c.prototype.destroy = function() {
            if (this.iframe) {
                try {
                    this.iframe.src = "about:blank";
                } catch (a) {}
                this.doc = null, this.iframe.parentNode.removeChild(this.iframe), this.iframe = null, 
                CollectGarbage();
            }
        }, c.prototype.close = function() {
            return this.destroy(), b.Transport.XHR.prototype.close.call(this);
        }, c.check = function(a) {
            if ("undefined" != typeof window && [ "Active" ].concat("Object").join("X") in window) try {
                var c = new (window[[ "Active" ].concat("Object").join("X")])("htmlfile");
                return c && b.Transport.XHR.check(a);
            } catch (d) {}
            return !1;
        }, c.xdomainCheck = function() {
            return !1;
        }, b.transports.push("htmlfile");
    }("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports), 
    function(a, b, c) {
        function d() {
            b.Transport.XHR.apply(this, arguments);
        }
        function e() {}
        a["xhr-polling"] = d, b.util.inherit(d, b.Transport.XHR), b.util.merge(d, b.Transport.XHR), 
        d.prototype.name = "xhr-polling", d.prototype.heartbeats = function() {
            return !1;
        }, d.prototype.open = function() {
            var a = this;
            return b.Transport.XHR.prototype.open.call(a), !1;
        }, d.prototype.get = function() {
            function b() {
                4 == this.readyState && (this.onreadystatechange = e, 200 == this.status ? (a.onData(this.responseText), 
                a.get()) : a.onClose());
            }
            function d() {
                this.onload = e, this.onerror = e, a.retryCounter = 1, a.onData(this.responseText), 
                a.get();
            }
            function f() {
                a.retryCounter++, !a.retryCounter || a.retryCounter > 3 ? a.onClose() : a.get();
            }
            if (this.isOpen) {
                var a = this;
                this.xhr = this.request(), c.XDomainRequest && this.xhr instanceof XDomainRequest ? (this.xhr.onload = d, 
                this.xhr.onerror = f) : this.xhr.onreadystatechange = b, this.xhr.send(null);
            }
        }, d.prototype.onClose = function() {
            if (b.Transport.XHR.prototype.onClose.call(this), this.xhr) {
                this.xhr.onreadystatechange = this.xhr.onload = this.xhr.onerror = e;
                try {
                    this.xhr.abort();
                } catch (a) {}
                this.xhr = null;
            }
        }, d.prototype.ready = function(a, c) {
            var d = this;
            b.util.defer(function() {
                c.call(d);
            });
        }, b.transports.push("xhr-polling");
    }("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports, this), 
    function(a, b, c) {
        function e() {
            b.Transport["xhr-polling"].apply(this, arguments), this.index = b.j.length;
            var c = this;
            b.j.push(function(a) {
                c._(a);
            });
        }
        var d = c.document && "MozAppearance" in c.document.documentElement.style;
        a["jsonp-polling"] = e, b.util.inherit(e, b.Transport["xhr-polling"]), e.prototype.name = "jsonp-polling", 
        e.prototype.post = function(a) {
            function i() {
                j(), c.socket.setBuffer(!1);
            }
            function j() {
                c.iframe && c.form.removeChild(c.iframe);
                try {
                    h = document.createElement('<iframe name="' + c.iframeId + '">');
                } catch (a) {
                    h = document.createElement("iframe"), h.name = c.iframeId;
                }
                h.id = c.iframeId, c.form.appendChild(h), c.iframe = h;
            }
            var c = this, d = b.util.query(this.socket.options.query, "t=" + +new Date() + "&i=" + this.index);
            if (!this.form) {
                var h, e = document.createElement("form"), f = document.createElement("textarea"), g = this.iframeId = "socketio_iframe_" + this.index;
                e.className = "socketio", e.style.position = "absolute", e.style.top = "0px", e.style.left = "0px", 
                e.style.display = "none", e.target = g, e.method = "POST", e.setAttribute("accept-charset", "utf-8"), 
                f.name = "d", e.appendChild(f), document.body.appendChild(e), this.form = e, this.area = f;
            }
            this.form.action = this.prepareUrl() + d, j(), this.area.value = b.JSON.stringify(a);
            try {
                this.form.submit();
            } catch (k) {}
            this.iframe.attachEvent ? h.onreadystatechange = function() {
                "complete" == c.iframe.readyState && i();
            } : this.iframe.onload = i, this.socket.setBuffer(!0);
        }, e.prototype.get = function() {
            var a = this, c = document.createElement("script"), e = b.util.query(this.socket.options.query, "t=" + +new Date() + "&i=" + this.index);
            this.script && (this.script.parentNode.removeChild(this.script), this.script = null), 
            c.async = !0, c.src = this.prepareUrl() + e, c.onerror = function() {
                a.onClose();
            };
            var f = document.getElementsByTagName("script")[0];
            f.parentNode.insertBefore(c, f), this.script = c, d && setTimeout(function() {
                var a = document.createElement("iframe");
                document.body.appendChild(a), document.body.removeChild(a);
            }, 100);
        }, e.prototype._ = function(a) {
            return this.onData(a), this.isOpen && this.get(), this;
        }, e.prototype.ready = function(a, c) {
            var e = this;
            return d ? (b.util.load(function() {
                c.call(e);
            }), void 0) : c.call(this);
        }, e.check = function() {
            return "document" in c;
        }, e.xdomainCheck = function() {
            return !0;
        }, b.transports.push("jsonp-polling");
    }("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports, this), 
    "function" == typeof define && define.amd && define([], function() {
        return io;
    });
}(), function() {
    "use strict";
    var removeOn = function(string) {
        return string.replace(/^on([A-Z])/, function(full, first) {
            return first.toLowerCase();
        });
    }, addEvent = function(type, fn) {
        type = removeOn(type);
        var types = type.split(/\s+/), self = this;
        return types.each(function(type) {
            self.$events[type] = (self.$events[type] || []).include(fn);
        }), this;
    }.overloadSetter(), removeEvent = function(type, fn) {
        type = removeOn(type);
        var events = this.$events[type];
        if (events) if (fn) {
            var index = events.indexOf(fn);
            -1 !== index && delete events[index];
        } else delete this.$events[type];
        return this;
    }.overloadSetter(), fireEvent = function(type, args) {
        type = removeOn(type);
        var events = this.$events[type] || [], subs = type in this.$subscribers ? this.$subscribers[type] : all in this.$subscribers ? this.$subscribers[all] : [], self = this;
        return events || subs ? (args = Type.isArguments(args) ? Array.slice(args) : [ args ], 
        events.each(function(fn) {
            fn.apply(self, args);
        }), subs.each(function(sub) {
            sub.fn ? sub.fn.apply(sub.context, args) : sub.subscriber.trigger(type, Array.flatten([ self, args ]));
        }), this) : this;
    }, all = "*", func = "function", EpitomeEvents = new Class({
        $events: {},
        $subscribers: {},
        on: addEvent,
        off: removeEvent,
        trigger: fireEvent,
        addEvent: addEvent,
        removeEvent: removeEvent,
        fireEvent: fireEvent,
        listenTo: function(obj, type, fn) {
            var t = typeof type, event = {
                context: obj,
                subscriber: this
            };
            return t === func ? (fn = type, type = all) : "undefined" === t && (type = all), 
            fn && (event.fn = fn), obj.$subscribers[type] = (obj.$subscribers[type] || []).include(event), 
            this;
        },
        stopListening: function(obj, type, fn) {
            var len;
            return Object.each(obj.$subscribers, function(value, key) {
                if (len = value.length, "undefined" != typeof type) {
                    if (key === type) for (;len--; ) (fn && fn === value[len].fn || !fn) && value[len].context === obj && value.splice(len, 1);
                } else for (;len--; ) value[len].context === obj && value.splice(len, 1);
            }), this;
        },
        setOptions: function() {
            var option, options = this.options = Object.merge.apply(null, [ {}, this.options ].append(arguments));
            for (option in options) typeOf(options[option]) === func && /^on[A-Z]/.test(option) && (this.on(option, options[option]), 
            delete options[option]);
            return this;
        }
    });
    "function" == typeof define && define.amd ? define(function() {
        return EpitomeEvents;
    }) : "undefined" != typeof module && module.exports ? module.exports = EpitomeEvents : (this.Epitome || (this.Epitome = {}), 
    this.Epitome.Events = EpitomeEvents);
}.call(this), function() {
    "use strict";
    var obj, wrap = function(Events) {
        var e = new Events();
        return e.Events = Events, e;
    };
    "function" == typeof define && define.amd ? define([ "./epitome-events" ], wrap) : "undefined" != typeof module && module.exports ? (require("mootools"), 
    obj = wrap(require("./epitome-events")), obj.Model = require("./epitome-model"), 
    obj.Collection = require("./epitome-collection"), obj.isEqual = require("./epitome-isequal"), 
    obj.Template = require("./epitome-template"), module.exports = obj) : this.Epitome = wrap(this.Epitome.Events);
}.call(this), function() {
    "use strict";
    var wrap = function() {
        return _.isEqual;
    };
    "function" == typeof define && define.amd ? define([ "./epitome" ], wrap) : "undefined" != typeof module && module.exports ? (require("mootools"), 
    module.exports = wrap()) : (this.Epitome || (this.Epitome = {}), this.Epitome.isEqual = wrap(this.Epitome));
}.call(this), function(exports) {
    "use strict";
    var wrap = function(isEqual, Events) {
        return new Class({
            Implements: [ Events ],
            _attributes: {},
            properties: {
                id: {
                    get: function() {
                        var id = this._attributes.id || String.uniqueID();
                        return this.cid || (this.cid = id), this._attributes.id;
                    }
                }
            },
            validators: {},
            options: {
                defaults: {}
            },
            collections: [],
            initialize: function(obj, options) {
                return options && options.defaults && (this.options.defaults = Object.merge(this.options.defaults, options.defaults)), 
                obj = obj && "object" === typeOf(obj) ? obj : {}, this.set(Object.merge(this.options.defaults, obj)), 
                this.setOptions(options), this.trigger("ready");
            },
            set: function() {
                this.propertiesChanged = [], this.validationFailed = [], this._set.apply(this, arguments), 
                this.propertiesChanged.length && this.trigger("change", this.get(this.propertiesChanged)), 
                this.validationFailed.length && this.trigger("error", [ this.validationFailed ]);
            },
            _set: function(key, value) {
                if (!key || "undefined" == typeof value) return this;
                if (this.properties[key] && this.properties[key].set) return this.properties[key].set.call(this, value);
                if (this._attributes[key] && isEqual(this._attributes[key], value)) return this;
                var validator = this.validate(key, value);
                if (this.validators[key] && validator !== !0) {
                    var obj = {};
                    return obj[key] = {
                        key: key,
                        value: value,
                        error: validator
                    }, this.validationFailed.push(obj), this.trigger("error:" + key, obj[key]), this;
                }
                return null === value ? delete this._attributes[key] : this._attributes[key] = value, 
                this.trigger("change:" + key, value), this.propertiesChanged.push(key), this;
            }.overloadSetter(),
            get: function(key) {
                return key && this.properties[key] && this.properties[key].get ? this.properties[key].get.call(this) : key && "undefined" != typeof this._attributes[key] ? this._attributes[key] : null;
            }.overloadGetter(),
            unset: function() {
                var keys = Array.prototype.slice.apply(arguments), obj = {}, len = keys.length;
                return len ? (Array.each(Array.flatten(keys), function(key) {
                    obj[key] = null;
                }), this.set(obj), this) : this;
            },
            toJSON: function() {
                return Object.clone(this._attributes);
            },
            empty: function() {
                var keys = Object.keys(this.toJSON()), self = this;
                this.trigger("change", [ keys ]), Array.each(keys, function(key) {
                    self.trigger("change:" + key, null);
                }, this), this._attributes = {}, this.trigger("empty");
            },
            destroy: function() {
                this._attributes = {}, this.trigger("destroy");
            },
            validate: function(key, value) {
                return key in this.validators ? this.validators[key].call(this, value) : !0;
            }
        });
    };
    "function" == typeof define && define.amd ? define([ "./epitome-isequal", "./epitome-events" ], wrap) : "undefined" != typeof module && module.exports ? module.exports = wrap(require("./epitome-isequal"), require("./epitome-events")) : (exports.Epitome || (exports.Epitome = {
        isEqual: {},
        Events: {}
    }), exports.Epitome.Model = wrap(exports.Epitome.isEqual, exports.Epitome.Events));
}(this), function() {
    "use strict";
    var wrap = function(Model, Events, Slick) {
        var methodMap = [ "forEach", "each", "invoke", "filter", "map", "some", "indexOf", "contains", "getRandom", "getLast" ];
        Slick || (Slick = this.Slick);
        var collection = new Class({
            Implements: [ Events ],
            model: Model,
            _models: [],
            length: 0,
            initialize: function(models, options) {
                return this.setOptions(options), models && this.reset(models), this.id = this.options.id || String.uniqueID(), 
                this.trigger("ready");
            },
            reset: function(models, quiet) {
                return this.removeModel(this._models, !0), models = Array.from(models), Array.each(models, this.addModel.bind(this)), 
                this.on("destroy", this.removeModel.bind(this)), quiet || this.trigger("reset"), 
                this;
            },
            addModel: function(model, replace) {
                var exists;
                return "object" !== typeOf(model) || instanceOf(model, this.model) || (model = new this.model(model)), 
                model.cid = model.cid || model.get("id") || String.uniqueID(), exists = this.getModelByCID(model.cid), 
                exists && replace !== !0 ? this.trigger("add:error", model) : (exists && replace === !0 && (this._models[this._models.indexOf(model)] = model), 
                this.listenTo(model), this._models.push(model), model.collections.include(this), 
                this.length = this._models.length, this.trigger("add", [ model, model.cid ]).trigger("reset", [ model, model.cid ]));
            },
            removeModel: function(models, quiet) {
                var self = this;
                return models = Array.from(models).slice(), Array.each(models, function(model) {
                    model.collections.erase(self), model.collections.length || delete model.fireEvent, 
                    Array.erase(self._models, model), self.length = self._models.length, quiet || self.trigger("remove", [ model, model.cid ]);
                }), this.trigger("reset", [ models ]);
            },
            get: function(what) {
                return this[what];
            },
            getModelByCID: function(cid) {
                var last = null;
                return this.some(function(el) {
                    return el.cid === cid && (last = el);
                }), last;
            },
            getModelById: function(id) {
                var last = null;
                return this.some(function(el) {
                    return el.get("id") === id && (last = el);
                }), last;
            },
            getModel: function(index) {
                return this._models[index];
            },
            toJSON: function() {
                var getJSON = function(model) {
                    return model.toJSON();
                };
                return Array.map(this._models, getJSON);
            },
            empty: function(quiet) {
                return this.removeModel(this._models, quiet), this.trigger("empty");
            },
            sort: function(how) {
                if (!how) return this._models.sort(), this.trigger("sort");
                if ("function" == typeof how) return this.model.sort(how), this.trigger("sort");
                var type = "asc", conds = how.split(","), c = function(a, b) {
                    return b > a ? -1 : a > b ? 1 : 0;
                };
                return this._models.sort(function(a, b) {
                    var ret = 0;
                    return Array.some(conds, function(cond) {
                        cond = cond.trim();
                        var pseudos = cond.split(":"), key = pseudos[0], sortType = pseudos[1] ? pseudos[1] : type, ak = a.get(key), bk = b.get(key), cm = c(ak, bk), map = {
                            asc: cm,
                            desc: -cm
                        };
                        return "undefined" == typeof map[sortType] && (sortType = type), ret = map[sortType], 
                        0 !== ret;
                    }), ret;
                }), this.trigger("sort");
            },
            reverse: function() {
                return Array.reverse(this._models), this.trigger("sort");
            },
            find: function(expression) {
                var parsed = Slick.parse(expression), exported = [], found = this, map = {
                    "=": function(a, b) {
                        return a == b;
                    },
                    "!=": function(a, b) {
                        return a != b;
                    },
                    "^=": function(a, b) {
                        return 0 === a.indexOf(b);
                    },
                    "*=": function(a, b) {
                        return -1 !== a.indexOf(b);
                    },
                    "$=": function(a, b) {
                        return a.indexOf(b) == a.length - b.length;
                    },
                    "*": function(a) {
                        return "undefined" != typeof a;
                    }
                }, fixOperator = function(operator) {
                    return operator && map[operator] ? map[operator] : null;
                }, finder = function(attributes) {
                    var attr = attributes.key, value = attributes.value || null, tag = attributes.tag || null, operator = fixOperator(attributes.operator);
                    found = found.filter(function(el) {
                        var t, a;
                        return tag && attr ? (t = el.get(tag), a = t ? t[attr] : null) : a = tag ? el.get(tag) : el.get(attr), 
                        null !== a && null !== value && null !== operator ? operator(a, value) : null != a;
                    });
                };
                if (parsed.expressions.length) {
                    var j, i, attributes, currentExpression, currentBit, id, t, tag, expressions = parsed.expressions, cb = function(a) {
                        return a.tag = tag, a;
                    };
                    search: for (i = 0; currentExpression = expressions[i]; i++) {
                        for (j = 0; currentBit = currentExpression[j]; j++) {
                            if (attributes = currentBit.attributes, id = currentBit.id, id && (t = {
                                key: "id",
                                value: id,
                                operator: "="
                            }, attributes || (attributes = []), attributes.push(t)), tag = currentBit.tag, tag && "*" != tag && (attributes || (attributes = [ {
                                key: null,
                                value: "",
                                operator: "*"
                            } ]), attributes = Array.map(attributes, cb)), !attributes) continue search;
                            Array.each(attributes, finder);
                        }
                        exported[i] = found, found = this;
                    }
                }
                return [].combine(Array.flatten(exported));
            },
            findOne: function(expression) {
                var results = this.find(expression);
                return results.length ? results[0] : null;
            }
        });
        return Array.each(methodMap, function(method) {
            collection.implement(method, function() {
                return Array.prototype[method].apply(this._models, arguments);
            });
        }), collection;
    };
    "function" == typeof define && define.amd ? define([ "./epitome-model", "./epitome-events" ], wrap) : "undefined" != typeof module && module.exports ? module.exports = wrap(require("./epitome-model"), require("./epitome-events"), require("slicker")) : (this.Epitome || (this.Epitome = {
        Model: {},
        Events: {}
    }), this.Epitome.Collection = wrap.call(this, this.Epitome.Model, this.Epitome.Events, this.Slick));
}.call(this), function() {
    "use strict";
    var wrap = function(Model) {
        return new Class({
            Extends: Model,
            properties: {},
            options: {
                storage: {
                    duration: 365,
                    domain: "/",
                    fallback: !0,
                    storageType: "localStorage"
                },
                key: void 0,
                minimize: !1
            },
            initialize: function(obj, options) {
                if (this.setOptions(options), !this.options.key) throw "Initiated without storage key (options.key)";
                this.properties.storage || (this.properties.storage = new Storage(this.options.storage)), 
                this.parent(obj, this.options), this.setupSync();
            },
            sync: function() {
                var oldattrs = this._attributes, attrs = Object.append({}, this.options.defaults, this.properties.storage.get(this.options.key));
                return Object.each(attrs, function(val, key) {
                    Epitome.isEqual(oldattrs[key], val) || this.set(key, val);
                }, this), Object.keys(oldattrs).each(function(key) {
                    attrs.hasOwnProperty(key) || this.unset(key);
                }), this.trigger("sync"), this;
            },
            setupSync: function() {
                return this._attributes = Object.append(this._attributes, this.properties.storage.get(this.options.key)), 
                this.fireEvent("init"), this;
            },
            save: function() {
                if (this.validate()) {
                    var data = this.options.minimize ? Object.filter(this._attributes, this._filter, this) : this._attributes;
                    this.properties.storage.set(this.options.key, data), this.trigger("save");
                }
                return this;
            },
            _filter: function(val, key) {
                return !Epitome.isEqual(val, this.options.defaults[key]);
            },
            destroy: function() {
                return this.properties.storage.remove(this.options.key), this.parent();
            }
        });
    };
    "function" == typeof define && define.amd ? define([ "./epitome-model" ], wrap) : (this.Epitome || (this.Epitome = {
        Model: {}
    }), this.Epitome.Model.Storage = wrap(this.Epitome.Model));
}.call(this), function() {
    "use strict";
    var wrap = function(Events) {
        var timer, hc = "hashchange", hcSupported = "on" + hc in window, eventHosts = [ window, document ], getQueryString = function(queryString) {
            for (var m, result = {}, re = /([^&=]+)=([^&]*)/g; m = re.exec(queryString); ) result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
            return result;
        };
        return Element.Events.hashchange = {
            onAdd: function() {
                var hash = location.hash, check = function() {
                    hash !== location.hash && (hash = location.hash, eventHosts.invoke("fireEvent", hc, 0 === hash.indexOf("#") ? hash.substr(1) : hash));
                };
                hcSupported && (window.onhashchange = check) || (timer = check.periodical(100));
            },
            onRemove: function() {
                hcSupported && (window.onhashchange = null) || clearInterval(timer);
            }
        }, new Class({
            Implements: [ Events ],
            options: {
                triggerOnLoad: !0
            },
            routes: {},
            boundEvents: {},
            initialize: function(options) {
                var self = this;
                this.setOptions(options), this.options.routes && (this.routes = this.options.routes), 
                window.addEvent(hc, function() {
                    var route, hash = location.hash, path = hash.split("?")[0].replace(/%20/g, " "), query = hash.split("?")[1] || "", notfound = !0;
                    for (route in self.routes) {
                        var keys = [], regex = self.normalize(route, keys, !0, !1), found = regex.exec(path), routeEvent = !1;
                        if (found) {
                            notfound = !1, self.req = found[0];
                            var args = found.slice(1), param = {};
                            Array.each(args, function(a, i) {
                                "undefined" != typeof keys[i] && (param[keys[i].name] = a);
                            }), self.route = route, self.param = param || {}, self.query = query && getQueryString(query), 
                            routeEvent = self.routes[route], self.trigger("before", routeEvent), routeEvent && self.$events[routeEvent] ? (self.trigger(routeEvent + ":before"), 
                            self.trigger(routeEvent, Object.values(self.param))) : self.trigger("error", [ "Route", routeEvent, "is undefined" ].join(" ")), 
                            self.trigger("after", routeEvent), routeEvent && self.trigger(routeEvent + ":after");
                            break;
                        }
                    }
                    notfound && self.trigger("undefined", {
                        hash: hash,
                        request: path.slice(1),
                        path: path,
                        query: query
                    });
                }), this.trigger("ready"), this.options.triggerOnLoad && window.fireEvent(hc);
            },
            navigate: function(route, trigger) {
                route = route.replace(/\s+/g, "%20"), location.hash === route && trigger ? window.fireEvent(hc) : location.hash = route;
            },
            normalize: function(path, keys, sensitive, strict) {
                return path instanceof RegExp ? path : (path = path.concat(strict ? "" : "/?").replace(/\/\(/g, "(?:/").replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, function(_, slash, format, key, capture, optional) {
                    return keys.push({
                        name: key,
                        optional: !!optional
                    }), slash = slash || "", [ optional ? "" : slash, "(?:", optional ? slash : "", (format || "") + (capture || format && "([^/.]+?)" || "([^/]+?)") + ")", optional || "" ].join("");
                }).replace(/([\/.])/g, "\\$1").replace(/\*/g, "(.*)"), new RegExp("^" + path + "$", sensitive ? "" : "i"));
            },
            addRoute: function(obj) {
                return obj && obj.route && obj.id && obj.events ? obj.id.length ? this.routes[obj.route] ? this.trigger("error", 'Route "{route}" or id "{id}" already exists, aborting'.substitute(obj)) : (this.routes[obj.route] = obj.id, 
                this.on(this.boundEvents[obj.route] = obj.events), this.trigger("route:add", obj)) : this.trigger("error", "Route id cannot be empty, aborting") : this.trigger("error", "Please include route, id and events in the argument object when adding a route");
            },
            removeRoute: function(route) {
                return route && this.routes[route] && this.boundEvents[route] ? (this.off(this.boundEvents[route]), 
                delete this.routes[route], delete this.boundEvents[route], this.trigger("route:remove", route)) : this.trigger("error", "Could not find route or route is not removable");
            }
        });
    };
    "function" == typeof define && define.amd ? define([ "./epitome-events" ], wrap) : (this.Epitome || (this.Epitome = {
        Events: {}
    }), this.Epitome.Router = wrap(this.Epitome.Events));
}.call(this), function() {
    var wrap = function(Template, Model, Collection, Events) {
        return new Class({
            Implements: [ Events ],
            element: null,
            collection: null,
            model: null,
            options: {
                template: "",
                events: {},
                autoEvents: !0
            },
            initialize: function(options) {
                return options && options.collection && (this.setCollection(options.collection), 
                delete options.collection), options && options.model && (this.setModel(options.model), 
                delete options.model), this.setOptions(options), this.options.element && (this.setElement(this.options.element, this.options.events), 
                delete this.options.element), this.trigger("ready");
            },
            setElement: function(el, events) {
                return this.element && this.detachEvents() && this.destroy(), this.element = document.id(el), 
                events && this.attachEvents(events), this;
            },
            setCollection: function(collection) {
                var self = this, eventProxy = function(type) {
                    return function() {
                        self.trigger(type + ":collection", arguments);
                    };
                };
                return instanceOf(collection, Collection) && (this.collection = collection, this.collection.on({
                    change: eventProxy("change"),
                    fetch: eventProxy("fetch"),
                    add: eventProxy("add"),
                    remove: eventProxy("remove"),
                    sort: eventProxy("sort"),
                    reset: eventProxy("reset"),
                    error: eventProxy("error")
                })), this;
            },
            setModel: function(model) {
                var self = this, eventProxy = function(type) {
                    return function() {
                        self.trigger(type + ":model", arguments);
                    };
                };
                return instanceOf(model, Model) && (this.model = model, this.model.on({
                    change: eventProxy("change"),
                    destroy: eventProxy("destroy"),
                    empty: eventProxy("empty"),
                    error: eventProxy("error")
                })), this;
            },
            attachEvents: function(events) {
                var self = this;
                return Object.each(events, function(method, type) {
                    self.options.autoEvents && Type.isFunction(self[method]) && (self.$events[method] = [ self[method] ]), 
                    self.element.addEvent(type, function() {
                        self.trigger(method, arguments);
                    });
                }), this.element.store("attachedEvents", events), this;
            },
            detachEvents: function() {
                var events = this.element.retrieve("attachedEvents");
                return events && this.element.removeEvents(events).eliminate("attachedEvents"), 
                this;
            },
            template: function(data, template) {
                template = template || this.options.template;
                var compiler = this.Template || (this.Template = new Template());
                return compiler.template(template, data);
            },
            render: function() {
                return this.trigger("render");
            },
            empty: function(soft) {
                return soft ? this.element.empty() : this.element.set("html", ""), this.trigger("empty");
            },
            dispose: function() {
                return this.element.dispose(), this.trigger("dispose");
            },
            destroy: function() {
                return this.element.destroy(), this.trigger("destroy");
            }
        });
    };
    "function" == typeof define && define.amd ? define([ "./epitome-template", "./epitome-model", "./epitome-collection", "./epitome-events" ], wrap) : (this.Epitome || (this.Epitome = {
        Template: {},
        Model: {},
        Collection: {},
        Events: {}
    }), this.Epitome.View = wrap(this.Epitome.Template, this.Epitome.Model, this.Epitome.Collection, this.Epitome.Events));
}.call(this), function(undefined) {
    "use strict";
    var window = this, document = window.document, $ = document.id, $$ = document.getElements, QWEBIRC_BUILD = "bbc577ad5cb78d946ac1", qwebirc = window.qwebirc = _.extend(window.qwebirc || {}, {
        irc: {},
        ui: {
            themes: {}
        },
        util: {
            crypto: {}
        },
        config: {},
        auth: {},
        sound: {},
        lang: {},
        templates: {},
        cookies: {
            channels: "qweb-channels",
            nickname: "qweb-nickname",
            username: "qweb-account",
            password: "qweb-password",
            auth: "qweb-auth",
            newb: "qweb-new",
            options: "qweb-options",
            history: "qweb-hist"
        },
        BUILD: QWEBIRC_BUILD,
        FILE_SUFFIX: "-" + QWEBIRC_BUILD,
        VERSION: "0.93-dev"
    }), irc = qwebirc.irc, util = qwebirc.util, crypto = util.crypto, config = qwebirc.config, auth = qwebirc.auth, ui = qwebirc.ui, themes = ui.themes, style = ui.style, cookies = qwebirc.cookies, sound = qwebirc.sound, lang = qwebirc.lang, templates = qwebirc.templates;
    this.qwebirc = this.qwebirc || {}, this.qwebirc.templates = this.qwebirc.templates || {}, 
    this.qwebirc.templates.modifiablecss = Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 4, ">= 1.0.0" ], helpers = this.merge(helpers, Handlebars.helpers), 
        data = data || {};
        var stack1, options, buffer = "", helperMissing = helpers.helperMissing, escapeExpression = this.escapeExpression;
        return buffer += "#ircui {height: 100%;width: 100%;overflow: hidden;font-family: Verdana, sans-serif;}.qui .hidden, .qui .invisible {display: none;}.channel-name {background-color: rgb(255, 255, 191);border: 1px solid #C8D1DB;border-radius: 4px 4px 4px 4px;color: #000000;cursor: default;font-size: 0.8em;padding: 2px;text-decoration: none;white-space: nowrap;float: left;margin: 1px 0px 0px 1px;font-weight: bold;}.qui .widepanel {width: 100%;}.qui .bottompanel {color: red;}.qui .lines {color: black;overflow: auto;font-size: ", 
        options = {
            hash: {},
            data: data
        }, buffer += escapeExpression((stack1 = helpers.$css || depth0.$css, stack1 ? stack1.call(depth0, "font_size", 12, options) : helperMissing.call(depth0, "$css", "font_size", 12, options))) + "px;background: ", 
        options = {
            hash: {},
            data: data
        }, buffer += escapeExpression((stack1 = helpers.$css || depth0.$css, stack1 ? stack1.call(depth0, "lines_background", "f2f0ff", "c", options) : helperMissing.call(depth0, "$css", "lines_background", "f2f0ff", "c", options))) + ";}.qui .lines .timestamp {display: ", 
        options = {
            hash: {},
            data: data
        }, buffer += escapeExpression((stack1 = helpers.$css || depth0.$css, stack1 ? stack1.call(depth0, "show_timestamps", "inline", "comp", "none", options) : helperMissing.call(depth0, "$css", "show_timestamps", "inline", "comp", "none", options))) + ';}.qui .ircwindow .lines {font-family: Consolas, "Lucida Console", monospace;text-indent: 10px;padding-left: 1em;word-wrap: break-word;}.qui .lines .highlight1 {background-color: ', 
        options = {
            hash: {},
            data: data
        }, buffer += escapeExpression((stack1 = helpers.$css || depth0.$css, stack1 ? stack1.call(depth0, "lines_highlight1", "f6ff94", "c", options) : helperMissing.call(depth0, "$css", "lines_highlight1", "f6ff94", "c", options))) + ";}.qui .lines .highlight2 {background-color: ", 
        options = {
            hash: {},
            data: data
        }, buffer += escapeExpression((stack1 = helpers.$css || depth0.$css, stack1 ? stack1.call(depth0, "lines_highlight2", "A4FCCA", "c", options) : helperMissing.call(depth0, "$css", "lines_highlight2", "A4FCCA", "c", options))) + ";}.qui .lines .highlight3 {background-color: ", 
        options = {
            hash: {},
            data: data
        }, buffer += escapeExpression((stack1 = helpers.$css || depth0.$css, stack1 ? stack1.call(depth0, "lines_highlight3", "FAC3D5", "c", options) : helperMissing.call(depth0, "$css", "lines_highlight3", "FAC3D5", "c", options))) + ";}.qui .lines .mentioned {background-color: ", 
        options = {
            hash: {},
            data: data
        }, buffer += escapeExpression((stack1 = helpers.$css || depth0.$css, stack1 ? stack1.call(depth0, "mentioned_colour", "E63772", "c", options) : helperMissing.call(depth0, "$css", "mentioned_colour", "E63772", "c", options))) + " !important;}.qui .properties {background-color: ", 
        options = {
            hash: {},
            data: data
        }, buffer += escapeExpression((stack1 = helpers.$css || depth0.$css, stack1 ? stack1.call(depth0, "menu_background", "f2f0ff", "c", options) : helperMissing.call(depth0, "$css", "menu_background", "f2f0ff", "c", options))) + ";border-top: 1px solid ", 
        options = {
            hash: {},
            data: data
        }, buffer += escapeExpression((stack1 = helpers.$css || depth0.$css, stack1 ? stack1.call(depth0, "menu_border", "c8d2dc", "c", options) : helperMissing.call(depth0, "$css", "menu_border", "c8d2dc", "c", options))) + ";height: 25px;}.qui .topic .emptytopic {color: gray;}.qui .topic {color: gray;padding-left: 5px;font-size: 0.7em;cursor: default;background-color: ", 
        options = {
            hash: {},
            data: data
        }, buffer += escapeExpression((stack1 = helpers.$css || depth0.$css, stack1 ? stack1.call(depth0, "topic_background", "f2f0ff", "c", options) : helperMissing.call(depth0, "$css", "topic_background", "f2f0ff", "c", options))) + ";border-bottom: 1px dashed ", 
        options = {
            hash: {},
            data: data
        }, buffer += escapeExpression((stack1 = helpers.$css || depth0.$css, stack1 ? stack1.call(depth0, "topic_border", "c8d2dc", "c", options) : helperMissing.call(depth0, "$css", "topic_border", "c8d2dc", "c", options))) + ";}/*tab stuff*/.qui .outertabbar {border-bottom: 1px solid ", 
        options = {
            hash: {},
            data: data
        }, buffer += escapeExpression((stack1 = helpers.$css || depth0.$css, stack1 ? stack1.call(depth0, "tabbar_border", "c3cee0", "c", options) : helperMissing.call(depth0, "$css", "tabbar_border", "c3cee0", "c", options))) + ";background: ", 
        options = {
            hash: {},
            data: data
        }, buffer += escapeExpression((stack1 = helpers.$css || depth0.$css, stack1 ? stack1.call(depth0, "tabbar_background", "e2ecf9", "c", options) : helperMissing.call(depth0, "$css", "tabbar_background", "e2ecf9", "c", options))) + ";height: 26px;line-height: 20px;padding: 2px 0;}.qui .outertabbar > * {vertical-align: top;}.qui .tabbar {color: ", 
        options = {
            hash: {},
            data: data
        }, buffer += escapeExpression((stack1 = helpers.$css || depth0.$css, stack1 ? stack1.call(depth0, "tabbar_text", "000000", "c", options) : helperMissing.call(depth0, "$css", "tabbar_text", "000000", "c", options))) + ";display: inline-block;overflow-x: hidden;margin-left: 10px;font-size: 13px;height: 22px;}.qui .tabbar .tab {padding: 2px;cursor: default;margin-right: 3px;white-space: nowrap;font-weight: bold;color: ", 
        options = {
            hash: {},
            data: data
        }, buffer += escapeExpression((stack1 = helpers.$css || depth0.$css, stack1 ? stack1.call(depth0, "tab_text", "000000", "c", options) : helperMissing.call(depth0, "$css", "tab_text", "000000", "c", options))) + ";border: 1px solid ", 
        options = {
            hash: {},
            data: data
        }, buffer += escapeExpression((stack1 = helpers.$css || depth0.$css, stack1 ? stack1.call(depth0, "tab_border", "c8d2dc", "c", options) : helperMissing.call(depth0, "$css", "tab_border", "c8d2dc", "c", options))) + ";border-radius: 4px;-moz-border-radius: 4px;-webkit-border-radius: 4px;}.qui .tabbar .tab:hover {background: ", 
        options = {
            hash: {},
            data: data
        }, buffer += escapeExpression((stack1 = helpers.$css || depth0.$css, stack1 ? stack1.call(depth0, "tab_hover", "ffffff", "c", options) : helperMissing.call(depth0, "$css", "tab_hover", "ffffff", "c", options))) + ";border: 1px solid #c8d2dc;-moz-border-radius: 4px;-webkit-border-radius: 4px;}.qui .tabbar .hilight-activity.tab {color: #009900;}.qui .tabbar .hilight-speech.tab {color: #0000ff;}.qui .tabbar .hilight-us.tab {color: #ff0000;background: rgb(216, 216, 138);}.qui .tabbar .brouhaha {padding-left: 75px;background-image: -moz-linear-gradient(45deg, #666 25%, transparent 25%),-moz-linear-gradient(-45deg, #666 25%, transparent 25%),-moz-linear-gradient(45deg, transparent 75%, #666 75%),-moz-linear-gradient(-45deg, transparent 75%, #666 75%);background-image: -webkit-gradient(linear, 0 100%, 100% 0, color-stop(.25, #666), color-stop(.25, transparent)),-webkit-gradient(linear, 0 0, 100% 100%, color-stop(.25, #666), color-stop(.25, transparent)),-webkit-gradient(linear, 0 100%, 100% 0, color-stop(.75, transparent), color-stop(.75, #666)),-webkit-gradient(linear, 0 0, 100% 100%, color-stop(.75, transparent), color-stop(.75, #666));background-image: -webkit-linear-gradient(45deg, #666 25%, transparent 25%),-webkit-linear-gradient(-45deg, #666 25%, transparent 25%),-webkit-linear-gradient(45deg, transparent 75%, #666 75%),-webkit-linear-gradient(-45deg, transparent 75%, #666 75%);background-image: -o-linear-gradient(45deg, #666 25%, transparent 25%),-o-linear-gradient(-45deg, #666 25%, transparent 25%),-o-linear-gradient(45deg, transparent 75%, #666 75%),-o-linear-gradient(-45deg, transparent 75%, #666 75%);background-image: linear-gradient(45deg, #666 25%, transparent 25%),linear-gradient(-45deg, #666 25%, transparent 25%),linear-gradient(45deg, transparent 75%, #666 75%),linear-gradient(-45deg, transparent 75%, #666 75%);-moz-background-size: 2px 2px;background-size: 2px 2px;-webkit-background-size: 2px 2.1px; /* override value for webkit */background-position: 0 0, 1px 0, 1px -1px, 0px 1px;}.qui .tabbar .brouhaha.selected {/* background: rgb(255,214,94); Old browsersbackground: -moz-radial-gradient(center, ellipse cover,  rgba(255,214,94,1) 0%, rgba(254,191,4,1) 100%); FF3.6+background: -webkit-gradient(radial, center center, 0px, center center, 100%, color-stop(0%,rgba(255,214,94,1)), color-stop(100%,rgba(254,191,4,1))); Chrome,Safari4+background: -webkit-radial-gradient(center, ellipse cover,  rgba(255,214,94,1) 0%,rgba(254,191,4,1) 100%); Chrome10+,Safari5.1+background: -o-radial-gradient(center, ellipse cover,  rgba(255,214,94,1) 0%,rgba(254,191,4,1) 100%); Opera 12+background: -ms-radial-gradient(center, ellipse cover,  rgba(255,214,94,1) 0%,rgba(254,191,4,1) 100%); IE10+background: radial-gradient(ellipse at center,  rgba(255,214,94,1) 0%,rgba(254,191,4,1) 100%); W3Cfilter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#ffd65e', endColorstr='#febf04',GradientType=1 ); IE6-9 fallback on horizontal gradient */}.qui .tabbar .brouhaha.unselected {/* background-image: -moz-linear-gradient(45deg, #666 25%, transparent 25%),-moz-linear-gradient(-45deg, #666 25%, transparent 25%),-moz-linear-gradient(45deg, transparent 75%, #666 75%),-moz-linear-gradient(-45deg, transparent 75%, #666 75%);background-image: -webkit-gradient(linear, 0 100%, 100% 0, color-stop(.25, #666), color-stop(.25, transparent)),-webkit-gradient(linear, 0 0, 100% 100%, color-stop(.25, #666), color-stop(.25, transparent)),-webkit-gradient(linear, 0 100%, 100% 0, color-stop(.75, transparent), color-stop(.75, #666)),-webkit-gradient(linear, 0 0, 100% 100%, color-stop(.75, transparent), color-stop(.75, #666));background-image: -webkit-linear-gradient(45deg, #666 25%, transparent 25%),-webkit-linear-gradient(-45deg, #666 25%, transparent 25%),-webkit-linear-gradient(45deg, transparent 75%, #666 75%),-webkit-linear-gradient(-45deg, transparent 75%, #666 75%);background-image: -o-linear-gradient(45deg, #666 25%, transparent 25%),-o-linear-gradient(-45deg, #666 25%, transparent 25%),-o-linear-gradient(45deg, transparent 75%, #666 75%),-o-linear-gradient(-45deg, transparent 75%, #666 75%);background-image: linear-gradient(45deg, #666 25%, transparent 25%),linear-gradient(-45deg, #666 25%, transparent 25%),linear-gradient(45deg, transparent 75%, #666 75%),linear-gradient(-45deg, transparent 75%, #666 75%);-moz-background-size: 2px 2px;background-size: 2px 2px;-webkit-background-size: 2px 2.1px; override value for webkitbackground-position: 0 0, 1px 0, 1px -1px, 0px 1px; */}.qui .tabbar .selected.tab {background: ", 
        options = {
            hash: {},
            data: data
        }, buffer += escapeExpression((stack1 = helpers.$css || depth0.$css, stack1 ? stack1.call(depth0, "tab_selected", "ffffff", "c", options) : helperMissing.call(depth0, "$css", "tab_selected", "ffffff", "c", options))) + ";border: 1px solid ", 
        options = {
            hash: {},
            data: data
        }, buffer += escapeExpression((stack1 = helpers.$css || depth0.$css, stack1 ? stack1.call(depth0, "tab_selected_border", "c8d2dc", "c", options) : helperMissing.call(depth0, "$css", "tab_selected_border", "c8d2dc", "c", options))) + ";-moz-border-radius: 4px;-webkit-border-radius: 4px;color: ", 
        options = {
            hash: {},
            data: data
        }, buffer += escapeExpression((stack1 = helpers.$css || depth0.$css, stack1 ? stack1.call(depth0, "tab_selected_text", "333333", "c", options) : helperMissing.call(depth0, "$css", "tab_selected_text", "333333", "c", options))) + ";}.qui .buttons {display: none;}.qui.signed-in .buttons {display: inline-block;cursor: pointer;}.buttons span {vertical-align: middle;display: inline-block;}/* tab stuff *//*irc input stuff*/.qui form.input {background-color: ", 
        options = {
            hash: {},
            data: data
        }, buffer += escapeExpression((stack1 = helpers.$css || depth0.$css, stack1 ? stack1.call(depth0, "menu_background", "f2f0ff", "c", options) : helperMissing.call(depth0, "$css", "menu_background", "f2f0ff", "c", options))) + ";margin: 0;}.qui .input div {border-top: 1px solid ", 
        options = {
            hash: {},
            data: data
        }, buffer += escapeExpression((stack1 = helpers.$css || depth0.$css, stack1 ? stack1.call(depth0, "input_border", "c3cee0", "c", options) : helperMissing.call(depth0, "$css", "input_border", "c3cee0", "c", options))) + ";padding: 0 5px 1px;margin: 0;width: 100%;}.qui .input div > .input-group-addon {cursor:pointer;cursor:hand;padding: 2px 5px;}.qui .input div > * {height: 24px;}.qui .input .nickname {color: #524F50;font-size: 14px;}.qui .input .nickname .status {border-radius: 50%;display: inline-block;margin-right: 3px;}.qui .input .nickname:hover {}.qui .input .nickname .status.voice {width: 8px;height: 8px;background-color: rgb(223, 187, 47);background-image: radial-gradient(45px 45px 45deg, circle, yellow 0%, orange 100%, red 95%);background-image: -moz-radial-gradient(45px 45px 45deg, circle, yellow 0%, orange 100%, red 95%);background-image: -o-radial-gradient(45px 45px 45deg, circle, yellow 0%, orange 100%, red 95%);background-image: -webkit-radial-gradient(45px 45px, circle, yellow, orange);animation-name: spin;animation-duration: 3s;animation-iteration-count: infinite;animation-timing-function: linear;-webkit-animation-name: spin;-webkit-animation-duration: 3s;-webkit-animation-iteration-count: infinite;-webkit-animation-timing-function: linear;-moz-animation-name: spin;-moz-animation-duration: 3s;-moz-animation-iteration-count: infinite;-moz-animation-timing-function: linear;-o-animation-name: spin;-o-animation-duration: 3s;-o-animation-iteration-count: infinite;-o-animation-timing-function: linear;}.qui .input .nickname .status.op {width: 8px;height: 8px;background-color: #7AE60E;background-image: radial-gradient(45px 45px 45deg, circle, #5FFF4A 3%, #7AE60E 76%);background-image: -moz-radial-gradient(45px 45px 45deg, circle, #5FFF4A 3%, #7AE60E 76%);background-image: -o-radial-gradient(45px 45px, circle, #5FFF4A 3%, #7AE60E 76%);background-image: -webkit-radial-gradient(45px 45px, circle, #5FFF4A 3%, #7AE60E 76%);animation-name: spin;animation-duration: 3s;animation-iteration-count: infinite;animation-timing-function: linear;-webkit-animation-name: spin;-webkit-animation-duration: 3s;-webkit-animation-iteration-count: infinite;-webkit-animation-timing-function: linear;-moz-animation-name: spin;-moz-animation-duration: 3s;-moz-animation-iteration-count: infinite;-moz-animation-timing-function: linear;-o-animation-name: spin;-o-animation-duration: 3s;-o-animation-iteration-count: infinite;-o-animation-timing-function: linear;}.qui .input .input-field {border: 1px solid ", 
        options = {
            hash: {},
            data: data
        }, buffer += escapeExpression((stack1 = helpers.$css || depth0.$css, stack1 ? stack1.call(depth0, "input_border", "c3cee0", "c", options) : helperMissing.call(depth0, "$css", "input_border", "c3cee0", "c", options))) + ";padding: 0;height: 26px;text-indent: 5px;}.qui .input .tt-hint {background-image: linear-gradient(bottom, rgb(235,235,232) 54%, rgb(247,250,240) 66%);background-image: -o-linear-gradient(bottom, rgb(235,235,232) 54%, rgb(247,250,240) 66%);background-image: -moz-linear-gradient(bottom, rgb(235,235,232) 54%, rgb(247,250,240) 66%);background-image: -webkit-linear-gradient(bottom, rgb(235,235,232) 54%, rgb(247,250,240) 66%);background-image: -ms-linear-gradient(bottom, rgb(235,235,232) 54%, rgb(247,250,240) 66%);background-image: -webkit-gradient(linear,left bottom,left top,color-stop(0.54, rgb(235,235,232)),color-stop(0.66, rgb(247,250,240)));padding: 0;height: 26px;text-indent: 5px;}/*twitter typeahead inspired autocomplete using overlay input box*/.qui .tt-hint {position: absolute;top: 0px;left: 0px;border-color: transparent;box-shadow: none;color: #BDBDBD;}.qui .tt-query {position: relative;vertical-align: top;background-color: transparent;}/*typeahead*/.qui .input .btn.send {color: grey;padding: 2px 10px;}.qui .nicklist {border-left: 1px solid ", 
        options = {
            hash: {},
            data: data
        }, buffer += escapeExpression((stack1 = helpers.$css || depth0.$css, stack1 ? stack1.call(depth0, "nicklist_border", "c8d2dc", "c", options) : helperMissing.call(depth0, "$css", "nicklist_border", "c8d2dc", "c", options))) + ";width: 140px;overflow: auto;background: ", 
        options = {
            hash: {},
            data: data
        }, buffer += escapeExpression((stack1 = helpers.$css || depth0.$css, stack1 ? stack1.call(depth0, "nicklist_background", "f2f0ff", "c", options) : helperMissing.call(depth0, "$css", "nicklist_background", "f2f0ff", "c", options))) + ";color: ", 
        options = {
            hash: {},
            data: data
        }, buffer += escapeExpression((stack1 = helpers.$css || depth0.$css, stack1 ? stack1.call(depth0, "nicklist_text", "000000", "c", options) : helperMissing.call(depth0, "$css", "nicklist_text", "000000", "c", options))) + ";font-size: 0.7em;}.qui .nicklist .user, .qui .nicklist .menu span {display: block;color: black;text-decoration: none;cursor: default;border-top: 1px solid ", 
        options = {
            hash: {},
            data: data
        }, buffer += escapeExpression((stack1 = helpers.$css || depth0.$css, stack1 ? stack1.call(depth0, "nicklist_background", "f2f0ff", "c", options) : helperMissing.call(depth0, "$css", "nicklist_background", "f2f0ff", "c", options))) + ";border-bottom: 1px solid ", 
        options = {
            hash: {},
            data: data
        }, buffer += escapeExpression((stack1 = helpers.$css || depth0.$css, stack1 ? stack1.call(depth0, "nicklist_background", "f2f0ff", "c", options) : helperMissing.call(depth0, "$css", "nicklist_background", "f2f0ff", "c", options))) + ";padding-left: 1px;}.qui .nicklist .selected {display: block;color: black;background: white;text-decoration: none;border-bottom: ", 
        options = {
            hash: {},
            data: data
        }, buffer += escapeExpression((stack1 = helpers.$css || depth0.$css, stack1 ? stack1.call(depth0, "nicklist_selected_border", "c8d2dc", "c", options) : helperMissing.call(depth0, "$css", "nicklist_selected_border", "c8d2dc", "c", options))) + " 1px solid;cursor: default;}.qui .nicklist .selected-middle {border-top: ", 
        options = {
            hash: {},
            data: data
        }, buffer += escapeExpression((stack1 = helpers.$css || depth0.$css, stack1 ? stack1.call(depth0, "nicklist_selected_border", "c8d2dc", "c", options) : helperMissing.call(depth0, "$css", "nicklist_selected_border", "c8d2dc", "c", options))) + " 1px solid;}#noscript {text-align: center;font-weight: bold;}.qui .nicklist .menu {margin: 0 0 0 5px;}.qui .nicklist .menu a {border-bottom: 0;border-top: 0;}.hyperlink-whois, .hyperlink-channel {cursor: pointer;cursor: hand;}.hyperlink-whois:hover, .hyperlink-channel:hover {text-decoration: underline;}.qui .outertabbar .dropdown-tab {cursor: pointer; cursor: hand;display: inline-block;padding-left: 4px;width: 30px;}.qui .dropdownmenu {z-index: 100;border: 1px solid ", 
        options = {
            hash: {},
            data: data
        }, buffer += escapeExpression((stack1 = helpers.$css || depth0.$css, stack1 ? stack1.call(depth0, "menu_border", "c8d2dc", "c", options) : helperMissing.call(depth0, "$css", "menu_border", "c8d2dc", "c", options))) + ";background: ", 
        options = {
            hash: {},
            data: data
        }, buffer += escapeExpression((stack1 = helpers.$css || depth0.$css, stack1 ? stack1.call(depth0, "menu_background", "f2f0ff", "c", options) : helperMissing.call(depth0, "$css", "menu_background", "f2f0ff", "c", options))) + ";list-style: none;padding: 5px 10px;font-size: 0.7em;}.qui .dropdownmenu a {color: black;cursor: pointer;cursor: hand;padding-top: 3px;}.qui .dropdownmenu a:hover {background: ", 
        options = {
            hash: {},
            data: data
        }, buffer += escapeExpression((stack1 = helpers.$css || depth0.$css, stack1 ? stack1.call(depth0, "menu_hover_background", "FFFE", "c", options) : helperMissing.call(depth0, "$css", "menu_hover_background", "FFFE", "c", options))) + ";}.qui .dropdownhint {position: relative;left: -500px;z-index: 10;white-space: nowrap;font-size: 0.7em;}.qui .chanmenu {width: 150px;}.qui .chanmenu .hint {float: right;font-size: 75%;color: grey;}.qui hr.lastpos {border: none;border-top: 1px solid ", 
        options = {
            hash: {},
            data: data
        }, buffer += escapeExpression((stack1 = helpers.$css || depth0.$css, stack1 ? stack1.call(depth0, "lastpositionbar", "C8D2DC", "c", options) : helperMissing.call(depth0, "$css", "lastpositionbar", "C8D2DC", "c", options))) + ";margin: .5em 3em;}.qwebirc-init-channels {font-size: 95%;color: #928D8D;text-align: center;}";
    }), this.qwebirc.templates.authpage = Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
        function program1() {
            return "hidden";
        }
        this.compilerInfo = [ 4, ">= 1.0.0" ], helpers = this.merge(helpers, Handlebars.helpers), 
        data = data || {};
        var stack1, stack2, options, buffer = "", functionType = "function", escapeExpression = this.escapeExpression, self = this, helperMissing = helpers.helperMissing;
        return buffer += '<div class="container center"><form id="login"><h2>Connect to ', 
        (stack1 = helpers.network) ? stack1 = stack1.call(depth0, {
            hash: {},
            data: data
        }) : (stack1 = depth0.network, stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1), 
        buffer += escapeExpression(stack1) + ' IRC</h2><div class="nick right"><label class="control-label" for="nickname">Nickname:<input type="text" name="basic" id="nickname" value="', 
        (stack1 = helpers.nickname) ? stack1 = stack1.call(depth0, {
            hash: {},
            data: data
        }) : (stack1 = depth0.nickname, stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1), 
        buffer += escapeExpression(stack1) + '" placeholder="Nickname" /></label></div><div class="username right ', 
        stack1 = helpers.unless.call(depth0, depth0.full, {
            hash: {},
            inverse: self.noop,
            fn: self.program(1, program1, data),
            data: data
        }), (stack1 || 0 === stack1) && (buffer += stack1), buffer += '"><label class="control-label" for="username">', 
        (stack1 = helpers.network) ? stack1 = stack1.call(depth0, {
            hash: {},
            data: data
        }) : (stack1 = depth0.network, stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1), 
        buffer += escapeExpression(stack1) + ' username:<input type="text" name="full" id="username" value="', 
        (stack1 = helpers.username) ? stack1 = stack1.call(depth0, {
            hash: {},
            data: data
        }) : (stack1 = depth0.username, stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1), 
        buffer += escapeExpression(stack1) + '" placeholder="', (stack1 = helpers.network) ? stack1 = stack1.call(depth0, {
            hash: {},
            data: data
        }) : (stack1 = depth0.network, stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1), 
        buffer += escapeExpression(stack1) + ' username"></label></div><div class="password right ', 
        stack1 = helpers.unless.call(depth0, depth0.full, {
            hash: {},
            inverse: self.noop,
            fn: self.program(1, program1, data),
            data: data
        }), (stack1 || 0 === stack1) && (buffer += stack1), buffer += '"><label class="control-label" for="password">Password:<input type="password" name="full" id="password" value="', 
        (stack1 = helpers.password) ? stack1 = stack1.call(depth0, {
            hash: {},
            data: data
        }) : (stack1 = depth0.password, stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1), 
        buffer += escapeExpression(stack1) + '"></label></div><div class="authenticate"><label for="authenticate">Authenticate (optional)<input type="checkbox" id="authenticate" ', 
        options = {
            hash: {},
            data: data
        }, buffer += escapeExpression((stack1 = helpers.check || depth0.check, stack1 ? stack1.call(depth0, depth0.full, options) : helperMissing.call(depth0, "check", depth0.full, options))) + '></label for="authenticate"></div><div><input type="submit" value="Connect" class="btn btn-primary btn-smaller" /></div></form><div class="qwebirc-init-channels"><span>', 
        (stack2 = helpers.channels) ? stack2 = stack2.call(depth0, {
            hash: {},
            data: data
        }) : (stack2 = depth0.channels, stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2), 
        buffer += escapeExpression(stack2) + "</span></div></div>";
    }), this.qwebirc.templates.chanmenu = Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
        function program1(depth0, data) {
            var stack1;
            return stack1 = self.invokePartial(partials.menuitem, "menuitem", depth0, helpers, partials, data), 
            stack1 || 0 === stack1 ? stack1 : "";
        }
        this.compilerInfo = [ 4, ">= 1.0.0" ], helpers = this.merge(helpers, Handlebars.helpers), 
        partials = this.merge(partials, Handlebars.partials), data = data || {};
        var stack1, buffer = "", self = this;
        return buffer += "<div class='chanmenu dropdownmenu'>", stack1 = helpers.each.call(depth0, depth0.channels, {
            hash: {},
            inverse: self.noop,
            fn: self.program(1, program1, data),
            data: data
        }), (stack1 || 0 === stack1) && (buffer += stack1), buffer += "</div>";
    }), this.qwebirc.templates.channelName = Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 4, ">= 1.0.0" ], helpers = this.merge(helpers, Handlebars.helpers), 
        data = data || {};
        var stack1, buffer = "", functionType = "function";
        return buffer += "<div class='channel-name'>", (stack1 = helpers.channel) ? stack1 = stack1.call(depth0, {
            hash: {},
            data: data
        }) : (stack1 = depth0.channel, stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1), 
        (stack1 || 0 === stack1) && (buffer += stack1), buffer += "</div>";
    }), this.qwebirc.templates.channellink = Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 4, ">= 1.0.0" ], helpers = this.merge(helpers, Handlebars.helpers), 
        data = data || {};
        var stack1, buffer = "", functionType = "function", escapeExpression = this.escapeExpression;
        return buffer += "<span class='hyperlink-channel' data-chan='", (stack1 = helpers.channel) ? stack1 = stack1.call(depth0, {
            hash: {},
            data: data
        }) : (stack1 = depth0.channel, stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1), 
        buffer += escapeExpression(stack1) + "'>", (stack1 = helpers.channel) ? stack1 = stack1.call(depth0, {
            hash: {},
            data: data
        }) : (stack1 = depth0.channel, stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1), 
        buffer += escapeExpression(stack1) + "</span>";
    }), this.qwebirc.templates.detachedWindow = Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
        function program1(depth0, data) {
            var stack1;
            return stack1 = self.invokePartial(partials.tabClose, "tabClose", depth0, helpers, partials, data), 
            stack1 || 0 === stack1 ? stack1 : "";
        }
        this.compilerInfo = [ 4, ">= 1.0.0" ], helpers = this.merge(helpers, Handlebars.helpers), 
        partials = this.merge(partials, Handlebars.partials), data = data || {};
        var stack1, buffer = "", self = this, functionType = "function", escapeExpression = this.escapeExpression;
        return buffer += "<div class='detached-window'><div class='header'><span class='title'>", 
        (stack1 = helpers.channel) ? stack1 = stack1.call(depth0, {
            hash: {},
            data: data
        }) : (stack1 = depth0.channel, stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1), 
        buffer += escapeExpression(stack1) + "</span>", stack1 = helpers.unless.call(depth0, depth0.base, {
            hash: {},
            inverse: self.noop,
            fn: self.program(1, program1, data),
            data: data
        }), (stack1 || 0 === stack1) && (buffer += stack1), stack1 = self.invokePartial(partials.tabAttach, "tabAttach", depth0, helpers, partials, data), 
        (stack1 || 0 === stack1) && (buffer += stack1), buffer += '</div><div class="content"></div><div><span class="resize-handle ui-icon ui-icon-grip-diagonal-se"></span></div></div>';
    }), this.qwebirc.templates.ircInput = Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 4, ">= 1.0.0" ], helpers = this.merge(helpers, Handlebars.helpers), 
        data = data || {};
        var stack1, buffer = "", functionType = "function", escapeExpression = this.escapeExpression;
        return buffer += "<div class='input'><div class='tt-ahead input-group'><span class='input-group-addon nickname'><span class='status ", 
        (stack1 = helpers.status) ? stack1 = stack1.call(depth0, {
            hash: {},
            data: data
        }) : (stack1 = depth0.status, stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1), 
        buffer += escapeExpression(stack1) + "'></span>", (stack1 = helpers.nick) ? stack1 = stack1.call(depth0, {
            hash: {},
            data: data
        }) : (stack1 = depth0.nick, stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1), 
        buffer += escapeExpression(stack1) + "</span>" + "<input class='tt-hint' type='text' autocomplete='off' spellcheck='off' disabled><input class='tt-query input-field form-control' type='text' autocomplete='off' spellcheck='off'><span class='input-group-btn'><button class='btn btn-default send' type='button'>&gt;</button></span></div></div>";
    }), this.qwebirc.templates.ircMessage = Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 4, ">= 1.0.0" ], helpers = this.merge(helpers, Handlebars.helpers), 
        data = data || {};
        var stack1, buffer = "", functionType = "function", escapeExpression = this.escapeExpression;
        return buffer += '<div class="', (stack1 = helpers.type) ? stack1 = stack1.call(depth0, {
            hash: {},
            data: data
        }) : (stack1 = depth0.type, stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1), 
        buffer += escapeExpression(stack1) + '"></div>';
    }), this.qwebirc.templates.ircTab = Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
        function program1(depth0, data) {
            var stack1;
            return stack1 = self.invokePartial(partials.tabClose, "tabClose", depth0, helpers, partials, data), 
            stack1 || 0 === stack1 ? stack1 : "";
        }
        this.compilerInfo = [ 4, ">= 1.0.0" ], helpers = this.merge(helpers, Handlebars.helpers), 
        partials = this.merge(partials, Handlebars.partials), data = data || {};
        var stack1, buffer = "", self = this, functionType = "function";
        return buffer += "<span class='tab'>", (stack1 = helpers.name) ? stack1 = stack1.call(depth0, {
            hash: {},
            data: data
        }) : (stack1 = depth0.name, stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1), 
        (stack1 || 0 === stack1) && (buffer += stack1), buffer += "&nbsp;", stack1 = self.invokePartial(partials.tabDetach, "tabDetach", depth0, helpers, partials, data), 
        (stack1 || 0 === stack1) && (buffer += stack1), stack1 = helpers["if"].call(depth0, depth0.closable, {
            hash: {},
            inverse: self.noop,
            fn: self.program(1, program1, data),
            data: data
        }), (stack1 || 0 === stack1) && (buffer += stack1), buffer += "</span>";
    }), this.qwebirc.templates.ircstyle = Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 4, ">= 1.0.0" ], helpers = this.merge(helpers, Handlebars.helpers), 
        data = data || {};
        var stack1, buffer = "", functionType = "function", escapeExpression = this.escapeExpression;
        return buffer += '<span class="', (stack1 = helpers.background) ? stack1 = stack1.call(depth0, {
            hash: {},
            data: data
        }) : (stack1 = depth0.background, stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1), 
        buffer += escapeExpression(stack1) + " ", (stack1 = helpers.colour) ? stack1 = stack1.call(depth0, {
            hash: {},
            data: data
        }) : (stack1 = depth0.colour, stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1), 
        buffer += escapeExpression(stack1) + " ", (stack1 = helpers.style) ? stack1 = stack1.call(depth0, {
            hash: {},
            data: data
        }) : (stack1 = depth0.style, stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1), 
        buffer += escapeExpression(stack1) + '">', (stack1 = helpers.text) ? stack1 = stack1.call(depth0, {
            hash: {},
            data: data
        }) : (stack1 = depth0.text, stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1), 
        (stack1 || 0 === stack1) && (buffer += stack1), buffer += "</span>";
    }), this.qwebirc.templates.mainmenu = Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
        return this.compilerInfo = [ 4, ">= 1.0.0" ], helpers = this.merge(helpers, Handlebars.helpers), 
        data = data || {}, '<div class="hidden"><ul class="main-menu dropdownmenu"><a href="#!options"><li><span>Options</span></li></a><a href="#!embedded"><li><span>Add webchat to your site</span></li></a><a href="#!privacy"><li><span>Privacy policy</span></li></a><a href="#!faq"><li><span>Frequently asked questions</span></li></a><a href="#!feedback"><li><span>Submit feedback</span></li></a><a href="#!about"><li><span>About qwebirc</span></li></a></ul></div>';
    }), this.qwebirc.templates.menubtn = Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 4, ">= 1.0.0" ], helpers = this.merge(helpers, Handlebars.helpers), 
        data = data || {};
        var stack1, buffer = "", functionType = "function", escapeExpression = this.escapeExpression;
        return buffer += "<div class='dropdown-tab'><img src='", (stack1 = helpers.icon) ? stack1 = stack1.call(depth0, {
            hash: {},
            data: data
        }) : (stack1 = depth0.icon, stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1), 
        buffer += escapeExpression(stack1) + "' title='menu' alt='menu'></div>";
    }), this.qwebirc.templates.menuitem = Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
        function program1(depth0, data) {
            var stack1, buffer = "";
            return buffer += " data-value='", (stack1 = helpers.value) ? stack1 = stack1.call(depth0, {
                hash: {},
                data: data
            }) : (stack1 = depth0.value, stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1), 
            buffer += escapeExpression(stack1) + "'";
        }
        function program3(depth0, data) {
            var stack1, buffer = "";
            return buffer += "<span class='hint'>", (stack1 = helpers.hint) ? stack1 = stack1.call(depth0, {
                hash: {},
                data: data
            }) : (stack1 = depth0.hint, stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1), 
            buffer += escapeExpression(stack1) + "</span>";
        }
        this.compilerInfo = [ 4, ">= 1.0.0" ], helpers = this.merge(helpers, Handlebars.helpers), 
        data = data || {};
        var stack1, buffer = "", functionType = "function", escapeExpression = this.escapeExpression, self = this;
        return buffer += "<a", stack1 = helpers["if"].call(depth0, depth0.value, {
            hash: {},
            inverse: self.noop,
            fn: self.program(1, program1, data),
            data: data
        }), (stack1 || 0 === stack1) && (buffer += stack1), buffer += "><li><span>", (stack1 = helpers.text) ? stack1 = stack1.call(depth0, {
            hash: {},
            data: data
        }) : (stack1 = depth0.text, stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1), 
        buffer += escapeExpression(stack1) + "</span>", stack1 = helpers["if"].call(depth0, depth0.hint, {
            hash: {},
            inverse: self.noop,
            fn: self.program(3, program3, data),
            data: data
        }), (stack1 || 0 === stack1) && (buffer += stack1), buffer += "</li></a>";
    }), this.qwebirc.templates.message = Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 4, ">= 1.0.0" ], helpers = this.merge(helpers, Handlebars.helpers), 
        data = data || {};
        var stack1, buffer = "", functionType = "function", escapeExpression = this.escapeExpression;
        return buffer += "<div class='message ", (stack1 = helpers["class"]) ? stack1 = stack1.call(depth0, {
            hash: {},
            data: data
        }) : (stack1 = depth0["class"], stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1), 
        buffer += escapeExpression(stack1) + "'><span>", (stack1 = helpers.message) ? stack1 = stack1.call(depth0, {
            hash: {},
            data: data
        }) : (stack1 = depth0.message, stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1), 
        buffer += escapeExpression(stack1) + "</span></div>";
    }), this.qwebirc.templates.navbar = Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
        return this.compilerInfo = [ 4, ">= 1.0.0" ], helpers = this.merge(helpers, Handlebars.helpers), 
        data = data || {}, '<div class="main-menu dropdown-tab"><img src="images/icon.png" title="menu" alt="menu"></div><div class="tabbar"></div><div class="buttons"><span class="to-left ui-icon ui-icon-circle-triangle-w hidden" name="tabscroll"></span><span class="to-right ui-icon ui-icon-circle-triangle-e hidden" name="tabscroll"></span><span class="add-chan ui-icon ui-icon-circle-plus" title="Join a channel"></span></div>';
    }), this.qwebirc.templates.nickbtn = Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 4, ">= 1.0.0" ], helpers = this.merge(helpers, Handlebars.helpers), 
        data = data || {};
        var stack1, buffer = "", functionType = "function", escapeExpression = this.escapeExpression;
        return buffer += "<div class='user'><span class='nick'>", (stack1 = helpers.nick) ? stack1 = stack1.call(depth0, {
            hash: {},
            data: data
        }) : (stack1 = depth0.nick, stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1), 
        buffer += escapeExpression(stack1) + "</span></div>";
    }), this.qwebirc.templates.nickmenubtn = Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 4, ">= 1.0.0" ], helpers = this.merge(helpers, Handlebars.helpers), 
        data = data || {};
        var stack1, buffer = "", functionType = "function", escapeExpression = this.escapeExpression;
        return buffer += "<span>- ", (stack1 = helpers.text) ? stack1 = stack1.call(depth0, {
            hash: {},
            data: data
        }) : (stack1 = depth0.text, stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1), 
        buffer += escapeExpression(stack1) + "</span>";
    }), this.qwebirc.templates.qweblink = Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 4, ">= 1.0.0" ], helpers = this.merge(helpers, Handlebars.helpers), 
        data = data || {};
        var stack1, buffer = "", functionType = "function", escapeExpression = this.escapeExpression;
        return buffer += "<span class='hyperlink-page' data-page='", (stack1 = helpers.page) ? stack1 = stack1.call(depth0, {
            hash: {},
            data: data
        }) : (stack1 = depth0.page, stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1), 
        buffer += escapeExpression(stack1) + "'>", (stack1 = helpers.page) ? stack1 = stack1.call(depth0, {
            hash: {},
            data: data
        }) : (stack1 = depth0.page, stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1), 
        buffer += escapeExpression(stack1) + "</span>";
    }), this.qwebirc.templates.spanURL = Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 4, ">= 1.0.0" ], helpers = this.merge(helpers, Handlebars.helpers), 
        data = data || {};
        var stack1, buffer = "", functionType = "function", escapeExpression = this.escapeExpression;
        return buffer += "<span class='hyperlink-channel'>", (stack1 = helpers.message) ? stack1 = stack1.call(depth0, {
            hash: {},
            data: data
        }) : (stack1 = depth0.message, stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1), 
        buffer += escapeExpression(stack1) + "</span>";
    }), this.qwebirc.templates.timestamp = Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 4, ">= 1.0.0" ], helpers = this.merge(helpers, Handlebars.helpers), 
        data = data || {};
        var stack1, buffer = "", functionType = "function", escapeExpression = this.escapeExpression;
        return buffer += "<span class='timestamp'>", (stack1 = helpers.time) ? stack1 = stack1.call(depth0, {
            hash: {},
            data: data
        }) : (stack1 = depth0.time, stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1), 
        buffer += escapeExpression(stack1) + " </span>";
    }), this.qwebirc.templates.topicBar = Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
        function program1(depth0, data) {
            var stack1;
            return stack1 = self.invokePartial(partials.topicText, "topicText", depth0, helpers, partials, data), 
            stack1 || 0 === stack1 ? stack1 : "";
        }
        function program3() {
            return "&nbsp;";
        }
        this.compilerInfo = [ 4, ">= 1.0.0" ], helpers = this.merge(helpers, Handlebars.helpers), 
        partials = this.merge(partials, Handlebars.partials), data = data || {};
        var stack1, buffer = "", self = this;
        return buffer += "<div class='topic qui colourline'>", stack1 = helpers["if"].call(depth0, depth0.topic, {
            hash: {},
            inverse: self.program(3, program3, data),
            fn: self.program(1, program1, data),
            data: data
        }), (stack1 || 0 === stack1) && (buffer += stack1), buffer += "</div>";
    }), this.qwebirc.templates.topicText = Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
        function program1() {
            return "emptytopic";
        }
        this.compilerInfo = [ 4, ">= 1.0.0" ], helpers = this.merge(helpers, Handlebars.helpers), 
        data = data || {};
        var stack1, buffer = "", self = this, functionType = "function", escapeExpression = this.escapeExpression;
        return buffer += "<span class='", stack1 = helpers["if"].call(depth0, depth0.empty, {
            hash: {},
            inverse: self.noop,
            fn: self.program(1, program1, data),
            data: data
        }), (stack1 || 0 === stack1) && (buffer += stack1), buffer += "' title=\"", (stack1 = helpers.topic) ? stack1 = stack1.call(depth0, {
            hash: {},
            data: data
        }) : (stack1 = depth0.topic, stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1), 
        buffer += escapeExpression(stack1) + '">[<span>', (stack1 = helpers.topic) ? stack1 = stack1.call(depth0, {
            hash: {},
            data: data
        }) : (stack1 = depth0.topic, stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1), 
        buffer += escapeExpression(stack1) + "</span>]</span>";
    }), this.qwebirc.templates.userlink = Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 4, ">= 1.0.0" ], helpers = this.merge(helpers, Handlebars.helpers), 
        data = data || {};
        var stack1, buffer = "", functionType = "function";
        return buffer += "<span class='hyperlink-whois' data-user='", (stack1 = helpers.userid) ? stack1 = stack1.call(depth0, {
            hash: {},
            data: data
        }) : (stack1 = depth0.userid, stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1), 
        (stack1 || 0 === stack1) && (buffer += stack1), buffer += "'>", (stack1 = helpers.username) ? stack1 = stack1.call(depth0, {
            hash: {},
            data: data
        }) : (stack1 = depth0.username, stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1), 
        (stack1 || 0 === stack1) && (buffer += stack1), buffer += "</span>";
    }), this.qwebirc.templates.window = Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
        function program1(depth0, data) {
            var stack1;
            return stack1 = self.invokePartial(partials.topicBar, "topicBar", depth0, helpers, partials, data), 
            stack1 || 0 === stack1 ? stack1 : "";
        }
        function program3(depth0, data) {
            var stack1, buffer = "";
            return stack1 = self.invokePartial(partials.verticalDivider, "verticalDivider", depth0, helpers, partials, data), 
            (stack1 || 0 === stack1) && (buffer += stack1), buffer += '<div class="qui rightpanel"></div>';
        }
        function program5(depth0, data) {
            var stack1;
            return stack1 = self.invokePartial(partials.ircInput, "ircInput", depth0, helpers, partials, data), 
            stack1 || 0 === stack1 ? stack1 : "";
        }
        this.compilerInfo = [ 4, ">= 1.0.0" ], helpers = this.merge(helpers, Handlebars.helpers), 
        partials = this.merge(partials, Handlebars.partials), data = data || {};
        var stack1, buffer = "", self = this, functionType = "function", escapeExpression = this.escapeExpression;
        return buffer += '<div class="window qui" data-id="', (stack1 = helpers.id) ? stack1 = stack1.call(depth0, {
            hash: {},
            data: data
        }) : (stack1 = depth0.id, stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1), 
        buffer += escapeExpression(stack1) + '" data-name="', (stack1 = helpers.name) ? stack1 = stack1.call(depth0, {
            hash: {},
            data: data
        }) : (stack1 = depth0.name, stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1), 
        buffer += escapeExpression(stack1) + '">', stack1 = helpers["if"].call(depth0, depth0.isChannel, {
            hash: {},
            inverse: self.noop,
            fn: self.program(1, program1, data),
            data: data
        }), (stack1 || 0 === stack1) && (buffer += stack1), buffer += '<div class="qui content"><div class="qui leftpanel lines"></div>', 
        stack1 = helpers["if"].call(depth0, depth0.isChannel, {
            hash: {},
            inverse: self.noop,
            fn: self.program(3, program3, data),
            data: data
        }), (stack1 || 0 === stack1) && (buffer += stack1), buffer += '</div><div class="qui properties">', 
        stack1 = self.invokePartial(partials.channelName, "channelName", depth0, helpers, partials, data), 
        (stack1 || 0 === stack1) && (buffer += stack1), buffer += '</div><div class="qui bottompanel">', 
        stack1 = helpers["if"].call(depth0, depth0.needsInput, {
            hash: {},
            inverse: self.noop,
            fn: self.program(5, program5, data),
            data: data
        }), (stack1 || 0 === stack1) && (buffer += stack1), buffer += "</div></div>";
    }), ui.WINDOW = {
        status: 1,
        query: 2,
        channel: 4,
        custom: 8,
        connect: 16,
        messages: 32
    }, ui.CUSTOM_CLIENT = "custom", ui.HIGHLIGHT = {
        none: 0,
        activity: 1,
        speech: 2,
        us: 3
    }, irc.PMODE_LIST = 0, irc.PMODE_SET_UNSET = 1, irc.PMODE_SET_ONLY = 2, irc.PMODE_REGULAR_MODE = 3;
    var BROUHAHA = "#brouhaha", CONNECTION_DETAILS = "Connection details", STATUS = "Status", OPTIONS = "Options", ACTIVE = "	ACTIVE", BASE_WINDOWS = [ BROUHAHA, CONNECTION_DETAILS, STATUS ], CHANNEL_TYPES = [ ui.WINDOW.channel, ui.WINDOW.query, ui.WINDOW.messages ], INPUT_TYPES = [ ui.WINDOW.status, ui.WINDOW.query, ui.WINDOW.channel, ui.WINDOW.messages ], OPED = "+", DEOPED = "-", OPSTATUS = "@", VOICESTATUS = "+";
    irc.IRCLowercaseTable = [ "\x00", "", "", "", "", "", "", "", "\b", "	", "\n", "", "\f", "\r", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", " ", "!", '"', "#", "$", "%", "&", "'", "(", ")", "*", "+", ",", "-", ".", "/", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ":", ";", "<", "=", ">", "?", "@", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "{", "|", "}", "~", "_", "`", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "{", "|", "}", "~", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", " ", "¡", "¢", "£", "¤", "¥", "¦", "§", "¨", "©", "ª", "«", "¬", "­", "®", "¯", "°", "±", "²", "³", "´", "µ", "¶", "·", "¸", "¹", "º", "»", "¼", "½", "¾", "¿", "à", "á", "â", "ã", "ä", "å", "æ", "ç", "è", "é", "ê", "ë", "ì", "í", "î", "ï", "ð", "ñ", "ò", "ó", "ô", "õ", "ö", "×", "ø", "ù", "ú", "û", "ü", "ý", "þ", "ß", "à", "á", "â", "ã", "ä", "å", "æ", "ç", "è", "é", "ê", "ë", "ì", "í", "î", "ï", "ð", "ñ", "ò", "ó", "ô", "õ", "ö", "÷", "ø", "ù", "ú", "û", "ü", "ý", "þ", "ÿ" ], 
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
        "322": "RPL_LIST",
        "323": "RPL_LISTEND"
    }, irc.Numerics2 = {
        "001": {
            name: "RPL_WELCOME",
            type: "reply"
        },
        "004": {
            name: "RPL_MYINFO",
            type: "reply"
        },
        "005": {
            name: "RPL_ISUPPORT",
            type: "reply"
        },
        "200": {
            name: "RPL_TRACELINK",
            type: "reply"
        },
        "201": {
            name: "RPL_TRACECONNECTING",
            type: "reply"
        },
        "202": {
            name: "RPL_TRACEHANDSHAKE",
            type: "reply"
        },
        "203": {
            name: "RPL_TRACEUNKNOWN",
            type: "reply"
        },
        "204": {
            name: "RPL_TRACEOPERATOR",
            type: "reply"
        },
        "205": {
            name: "RPL_TRACEUSER",
            type: "reply"
        },
        "206": {
            name: "RPL_TRACESERVER",
            type: "reply"
        },
        "208": {
            name: "RPL_TRACENEWTYPE",
            type: "reply"
        },
        "211": {
            name: "RPL_STATSLINKINFO",
            type: "reply"
        },
        "212": {
            name: "RPL_STATSCOMMANDS",
            type: "reply"
        },
        "213": {
            name: "RPL_STATSCLINE",
            type: "reply"
        },
        "214": {
            name: "RPL_STATSNLINE",
            type: "reply"
        },
        "215": {
            name: "RPL_STATSILINE",
            type: "reply"
        },
        "216": {
            name: "RPL_STATSKLINE",
            type: "reply"
        },
        "218": {
            name: "RPL_STATSYLINE",
            type: "reply"
        },
        "219": {
            name: "RPL_ENDOFSTATS",
            type: "reply"
        },
        "221": {
            name: "RPL_UMODEIS",
            type: "reply"
        },
        "241": {
            name: "RPL_STATSLLINE",
            type: "reply"
        },
        "242": {
            name: "RPL_STATSUPTIME",
            type: "reply"
        },
        "243": {
            name: "RPL_STATSOLINE",
            type: "reply"
        },
        "244": {
            name: "RPL_STATSHLINE",
            type: "reply"
        },
        "250": {
            name: "RPL_STATSCONN",
            type: "reply"
        },
        "251": {
            name: "RPL_LUSERCLIENT",
            type: "reply"
        },
        "252": {
            name: "RPL_LUSEROP",
            type: "reply"
        },
        "253": {
            name: "RPL_LUSERUNKNOWN",
            type: "reply"
        },
        "254": {
            name: "RPL_LUSERCHANNELS",
            type: "reply"
        },
        "255": {
            name: "RPL_LUSERME",
            type: "reply"
        },
        "256": {
            name: "RPL_ADMINME",
            type: "reply"
        },
        "257": {
            name: "RPL_ADMINLOC1",
            type: "reply"
        },
        "258": {
            name: "RPL_ADMINLOC2",
            type: "reply"
        },
        "259": {
            name: "RPL_ADMINEMAIL",
            type: "reply"
        },
        "261": {
            name: "RPL_TRACELOG",
            type: "reply"
        },
        "265": {
            name: "RPL_LOCALUSERS",
            type: "reply"
        },
        "266": {
            name: "RPL_GLOBALUSERS",
            type: "reply"
        },
        "300": {
            name: "RPL_NONE",
            type: "reply"
        },
        "301": {
            name: "RPL_AWAY",
            type: "reply"
        },
        "302": {
            name: "RPL_USERHOST",
            type: "reply"
        },
        "303": {
            name: "RPL_ISON",
            type: "reply"
        },
        "305": {
            name: "RPL_UNAWAY",
            type: "reply"
        },
        "306": {
            name: "RPL_NOWAWAY",
            type: "reply"
        },
        "311": {
            name: "RPL_WHOISUSER",
            type: "reply"
        },
        "312": {
            name: "RPL_WHOISSERVER",
            type: "reply"
        },
        "313": {
            name: "RPL_WHOISOPERATOR",
            type: "reply"
        },
        "314": {
            name: "RPL_WHOWASUSER",
            type: "reply"
        },
        "315": {
            name: "RPL_ENDOFWHO",
            type: "reply"
        },
        "317": {
            name: "RPL_WHOISIDLE",
            type: "reply"
        },
        "318": {
            name: "RPL_ENDOFWHOIS",
            type: "reply"
        },
        "319": {
            name: "RPL_WHOISCHANNELS",
            type: "reply"
        },
        "320": {
            name: "RPL_WHOISGENERICTEXT",
            type: "reply"
        },
        "325": {
            name: "RPL_WHOISWEBIRC",
            type: "reply"
        },
        "330": {
            name: "RPL_WHOISACCOUNT",
            type: "reply"
        },
        "338": {
            name: "RPL_WHOISACTUALLY",
            type: "reply"
        },
        "343": {
            name: "RPL_WHOISOPERNAME",
            type: "reply"
        },
        "321": {
            name: "RPL_LISTSTART",
            type: "reply"
        },
        "322": {
            name: "RPL_LIST",
            type: "reply"
        },
        "323": {
            name: "RPL_LISTEND",
            type: "reply"
        },
        "324": {
            name: "RPL_CHANNELMODEIS",
            type: "reply"
        },
        "329": {
            name: "RPL_CREATIONTIME",
            type: "reply"
        },
        "331": {
            name: "RPL_NOTOPIC",
            type: "reply"
        },
        "332": {
            name: "RPL_TOPIC",
            type: "reply"
        },
        "333": {
            name: "RPL_TOPICWHOTIME",
            type: "reply"
        },
        "341": {
            name: "RPL_INVITING",
            type: "reply"
        },
        "342": {
            name: "RPL_SUMMONING",
            type: "reply"
        },
        "351": {
            name: "RPL_VERSION",
            type: "reply"
        },
        "352": {
            name: "RPL_WHOREPLY",
            type: "reply"
        },
        "353": {
            name: "RPL_NAMREPLY",
            type: "reply"
        },
        "364": {
            name: "RPL_LINKS",
            type: "reply"
        },
        "365": {
            name: "RPL_ENDOFLINKS",
            type: "reply"
        },
        "366": {
            name: "RPL_ENDOFNAMES",
            type: "reply"
        },
        "367": {
            name: "RPL_BANLIST",
            type: "reply"
        },
        "368": {
            name: "RPL_ENDOFBANLIST",
            type: "reply"
        },
        "369": {
            name: "RPL_ENDOFWHOWAS",
            type: "reply"
        },
        "371": {
            name: "RPL_INFO",
            type: "reply"
        },
        "372": {
            name: "RPL_MOTD",
            type: "reply"
        },
        "374": {
            name: "RPL_ENDOFINFO",
            type: "reply"
        },
        "375": {
            name: "RPL_MOTDSTART",
            type: "reply"
        },
        "376": {
            name: "RPL_ENDOFMOTD",
            type: "reply"
        },
        "381": {
            name: "RPL_YOUREOPER",
            type: "reply"
        },
        "382": {
            name: "RPL_REHASHING",
            type: "reply"
        },
        "391": {
            name: "RPL_TIME",
            type: "reply"
        },
        "392": {
            name: "RPL_USERSSTART",
            type: "reply"
        },
        "393": {
            name: "RPL_USERS",
            type: "reply"
        },
        "394": {
            name: "RPL_ENDOFUSERS",
            type: "reply"
        },
        "395": {
            name: "RPL_NOUSERS",
            type: "reply"
        },
        "401": {
            name: "ERR_NOSUCHNICK",
            type: "error"
        },
        "402": {
            name: "ERR_NOSUCHSERVER",
            type: "error"
        },
        "403": {
            name: "ERR_NOSUCHCHANNEL",
            type: "error"
        },
        "404": {
            name: "ERR_CANNOTSENDTOCHAN",
            type: "error"
        },
        "405": {
            name: "ERR_TOOMANYCHANNELS",
            type: "error"
        },
        "406": {
            name: "ERR_WASNOSUCHNICK",
            type: "error"
        },
        "407": {
            name: "ERR_TOOMANYTARGETS",
            type: "error"
        },
        "409": {
            name: "ERR_NOORIGIN",
            type: "error"
        },
        "411": {
            name: "ERR_NORECIPIENT",
            type: "error"
        },
        "412": {
            name: "ERR_NOTEXTTOSEND",
            type: "error"
        },
        "413": {
            name: "ERR_NOTOPLEVEL",
            type: "error"
        },
        "414": {
            name: "ERR_WILDTOPLEVEL",
            type: "error"
        },
        "421": {
            name: "ERR_UNKNOWNCOMMAND",
            type: "error"
        },
        "422": {
            name: "ERR_NOMOTD",
            type: "error"
        },
        "423": {
            name: "ERR_NOADMININFO",
            type: "error"
        },
        "424": {
            name: "ERR_FILEERROR",
            type: "error"
        },
        "431": {
            name: "ERR_NONICKNAMEGIVEN",
            type: "error"
        },
        "432": {
            name: "ERR_ERRONEUSNICKNAME",
            type: "error"
        },
        "433": {
            name: "ERR_NICKNAMEINUSE",
            type: "error"
        },
        "436": {
            name: "ERR_NICKCOLLISION",
            type: "error"
        },
        "441": {
            name: "ERR_USERNOTINCHANNEL",
            type: "error"
        },
        "442": {
            name: "ERR_NOTONCHANNEL",
            type: "error"
        },
        "443": {
            name: "ERR_USERONCHANNEL",
            type: "error"
        },
        "444": {
            name: "ERR_NOLOGIN",
            type: "error"
        },
        "445": {
            name: "ERR_SUMMONDISABLED",
            type: "error"
        },
        "446": {
            name: "ERR_USERSDISABLED",
            type: "error"
        },
        "451": {
            name: "ERR_NOTREGISTERED",
            type: "error"
        },
        "461": {
            name: "ERR_NEEDMOREPARAMS",
            type: "error"
        },
        "462": {
            name: "ERR_ALREADYREGISTRED",
            type: "error"
        },
        "463": {
            name: "ERR_NOPERMFORHOST",
            type: "error"
        },
        "464": {
            name: "ERR_PASSWDMISMATCH",
            type: "error"
        },
        "465": {
            name: "ERR_YOUREBANNEDCREEP",
            type: "error"
        },
        "467": {
            name: "ERR_KEYSET",
            type: "error"
        },
        "471": {
            name: "ERR_CHANNELISFULL",
            type: "error"
        },
        "472": {
            name: "ERR_UNKNOWNMODE",
            type: "error"
        },
        "473": {
            name: "ERR_INVITEONLYCHAN",
            type: "error"
        },
        "474": {
            name: "ERR_BANNEDFROMCHAN",
            type: "error"
        },
        "475": {
            name: "ERR_BADCHANNELKEY",
            type: "error"
        },
        "481": {
            name: "ERR_NOPRIVILEGES",
            type: "error"
        },
        "482": {
            name: "ERR_CHANOPPRIVSNEEDED",
            type: "error"
        },
        "483": {
            name: "ERR_CANTKILLSERVER",
            type: "error"
        },
        "491": {
            name: "ERR_NOOPERHOST",
            type: "error"
        },
        "501": {
            name: "ERR_UMODEUNKNOWNFLAG",
            type: "error"
        },
        "502": {
            name: "ERR_USERSDONTMATCH",
            type: "error"
        }
    };
    var whitespace = /\s/, notwhitespace = /\S+$/, join = function(by, xs) {
        return xs.join(by);
    }, split = function(by, str) {
        return str.split(by);
    }, restRight = _.autoCurry(function(xs) {
        return xs.slice(0, xs.length - 1);
    }), test = _.autoCurry(function(reg, str) {
        return str.test(reg);
    }), replace = _.autoCurry(function(reg, rep, str) {
        return str.replace(reg, rep);
    }), startsWith = function(what, str) {
        return str.startsWith(what);
    }, $identity = _.identity, splitBang = _.partial(split, "!"), joinBang = _.partial(join, "!"), joinEmpty = _.partial(join, ""), joinComma = util.joinChans = _.partial(join, ","), concatUnique = _.compose(_.uniq, Array.concat), concatSep = _.autoCurry(function(sep, s1, s2) {
        return _.isArray(s1) && (s1 = s1.join(sep)), _.isArray(s2) && (s2 = s2.join(sep)), 
        "" !== s1 && "" !== s2 ? s1 + sep + s2 : s1 + s2;
    }), concatSpace = concatSep(" ");
    util.format = util.formatter = function(message, data) {
        return (message.message || message).substitute(data);
    }, util.formatSafe = util.formatterSafe = function(str, object, regexp) {
        return String(str).replace(regexp || /\\?\{([^{}]+)\}/g, function(match, name) {
            return "\\" == match.charAt(0) ? match.slice(1) : null != object[name] ? object[name] : match;
        });
    }, util.hostToNick = _.compose(joinBang, restRight, splitBang), util.hostToHost = _.compose(Array.getLast, splitBang);
    var isChannel = util.isChannel = _.and(".length > 1", _.partial(startsWith, "#")), formatChannel = util.formatChannel = function(chan) {
        return chan.length >= 1 && !isChannel(chan) && (chan = "#" + chan), chan;
    }, unformatChannel = util.unformatChannel = function(chan) {
        return isChannel(chan) && (chan = chan.slice(1)), chan;
    }, appendChannel = function(chans, chan) {
        return $A(chans).concat(chan);
    }, splitChan = util.splitChans = function(xs) {
        return _.isArray(xs) ? xs.length > 0 ? xs : [ "" ] : xs.split(",");
    }, isBaseWindow = util.isBaseWindow = _.partial(_.contains, BASE_WINDOWS), isChannelType = util.isChannelType = _.partial(_.contains, CHANNEL_TYPES);
    util.windowNeedsInput = _.partial(_.contains, INPUT_TYPES), util.formatChannelString = _.compose(joinComma, _.uniq, _.partial(_.func.map, formatChannel), splitChan), 
    util.unformatChannelString = _.compose(_.uniq, _.partial(_.func.map, unformatChannel), splitChan), 
    util.addChannel = _.compose(_.uniq, appendChannel), util.prependChannel = _.compose(_.uniq, _.flip(appendChannel)), 
    util.removeChannel = Array.erase, function() {
        var prefix_re = /^([_a-zA-Z0-9\[\]\\`^{}|-]*)(!([^@]+)@(.*))?$/, hasprefix_re = /^:([^ ]+) +/, colonrem_re = /^:[^ ]+ +/, command_re = /^([^ ]+) */, data_re = /^[^ ]+ +/;
        util.parseIRCData = function(line) {
            var match, message = {
                raw: line,
                prefix: ""
            };
            (match = line.match(hasprefix_re)) && (message.prefix = match[1], line = line.replace(colonrem_re, ""), 
            (match = message.prefix.match(prefix_re)) ? (message.nick = match[1], message.user = match[3], 
            message.host = match[4]) : message.server = message.prefix), match = line.match(command_re), 
            message.command = match[1].toUpperCase(), message.rawCommand = match[1], message.commandType = "normal", 
            line = line.replace(data_re, ""), irc.Numerics2[message.rawCommand] && (message.command = irc.Numerics2[message.rawCommand].name.toUpperCase(), 
            message.commandType = irc.Numerics2[message.rawCommand].type), message.args = [];
            var middle, trailing;
            return -1 != line.search(/^:|\s+:/) ? (match = line.match(/(.*?)(?:^:|\s+:)(.*)/), 
            middle = match[1].trimRight(), trailing = match[2]) : middle = line, middle.length && (message.args = middle.split(/ +/)), 
            "undefined" != typeof trailing && trailing.length && message.args.push(trailing), 
            message;
        };
    }(), util.formatCommand = function(cmdline) {
        return cmdline = cmdline.startsWith("/") ? cmdline.startsWith("//") ? "SAY /" + cmdline.slice(2) : cmdline.slice(1) : "SAY " + cmdline, 
        cmdline.splitMax(" ", 2);
    }, util.nickChanComparitor = function(client, nickHash) {
        var _prefixes = client.prefixes, _prefixNone = _prefixes.length, prefixWeight = function(pre) {
            return 0 !== pre.length ? _prefixes.indexOf(pre) : _prefixNone;
        }, toLower = client.toIRCLower;
        return function(nick1, nick2) {
            var p1weight = prefixWeight(nickHash[nick1].prefixes), p2weight = prefixWeight(nickHash[nick2].prefixes);
            return p1weight !== p2weight ? p1weight - p2weight : toLower(nick1).localeCompare(toLower(nick2));
        };
    }, util.nickPrefixer = function(nickHash) {
        return function(nick) {
            return nickHash[nick].prefixes + nick;
        };
    }, util.validPrefix = _.contains, util.addPrefix = function(nc, pref, prefs) {
        return prefs && !util.validPrefix(prefs, pref) ? nc.prefixes : nc.prefixes = concatUnique(nc.prefixes, pref).join("");
    }, util.removePrefix = function(nc, pref) {
        return nc.prefixes = nc.prefixes.replaceAll(pref, "");
    }, util.prefixOnNick = _.autoCurry(function(prefixes, nick) {
        var c = nick.charAt(0);
        return util.validPrefix(prefixes, c) ? [ c, nick.slice(1) ] : [ "", nick ];
    }), util.getPrefix = _.compose(_.first, util.prefixOnNick), util.stripPrefix = _.compose(_.lambda("x[1]"), util.prefixOnNick), 
    util.createNickRegex = _.memoize(function(nick) {
        return new RegExp("(^|[s.,;:'\"])" + String.escapeRegExp(nick) + "([s.,;:'\"]|$)", "i");
    }), util.testForNick = _.autoCurry(function(nick, text) {
        return util.createNickRegex(nick).test(text);
    }), util.toHSBColour = function(nick, client) {
        var lower = client.toIRCLower(util.stripPrefix(client.prefixes, nick));
        if (lower == client.lowerNickname) return null;
        for (var hash = 0, i = 0; i < lower.length; i++) hash = 31 * hash + lower.charCodeAt(i);
        var hue = Math.abs(hash) % 360;
        return new Color([ hue, 70, 60 ], "hsb");
    };
    var charIRCLower = _.compose(_.partial(_.item, irc.IRCLowercaseTable), _.lambda("x.charCodeAt(0)"));
    irc.RFC1459toIRCLower = _.memoize(_.compose(joinEmpty, _.partial(_.func.map, charIRCLower))), 
    irc.toIRCCompletion = _.compose(replace(/[^\w]+/g, ""), _.partial(_.func.invoke, "toIRCLower")), 
    irc.ASCIItoIRCLower = String.toLowerCase, util.getStyleByName = function(name) {
        return _.findWhere(irc.styles, {
            name: name
        });
    }, util.getStyleByKey = function(key) {
        return _.findWhere(irc.styles, {
            key: _.toInt(key)
        });
    }, util.getColourByName = function(name) {
        return _.findWhere(irc.colours, {
            name: name
        });
    }, util.getColourByKey = function(key) {
        return _.findWhere(irc.colours, {
            key: _.toInt(key)
        });
    }, util.parseURI = function(uri) {
        var result = {}, start = uri.indexOf("?");
        if (-1 === start) return result;
        for (var querystring = uri.substring(start + 1), args = querystring.split("&"), i = 0; i < args.length; i++) {
            var part = args[i].splitMax("=", 2);
            part.length > 1 && (result[unescape(part[0])] = unescape(part[1]));
        }
        return result;
    }, util.longtoduration = function(l) {
        var seconds = l % 60, minutes = Math.floor(l % 3600 / 60), hours = Math.floor(l % 86400 / 3600), days = Math.floor(l / 86400);
        return days + " days " + hours + " hours " + minutes + " minutes " + seconds + " seconds";
    };
    var pad = util.pad = _.autoCurry(function(cond, padding, str) {
        return str = String(str), cond(str) ? padding + str : str;
    });
    util.padzero = pad(_.lambda(".length<=1"), "0"), util.padspace = pad(_.lambda(".length!==0"), " "), 
    util.browserVersion = $lambda(navigator.userAgent), util.getEnclosedWord = function(str, pos) {
        pos >>>= 0;
        var left = str.slice(0, pos + 1).search(notwhitespace), right = str.slice(pos).search(whitespace), word = 0 > right ? str.slice(left) : str.slice(left, right + pos);
        return [ left, word ];
    }, util.randHexString = function(numBytes) {
        function getByte() {
            return (0 | 256 * (1 + Math.random())).toString(16).substring(1);
        }
        for (var l = [], i = 0; numBytes > i; i++) l.push(getByte());
        return l.join("");
    }, util.IRCTimestamp = function(date) {
        return date.format("[%H:%M]");
    }, util.IRCDate = function(date) {
        return date.format("%c");
    }, irc.nickChanEntry = function(p, l) {
        return {
            prefixes: p || "",
            lastSpoke: l || 0
        };
    }, util.noop = function() {}, Browser.isMobile = !(Browser.Platform.win || Browser.Platform.mac || Browser.Platform.linux), 
    Browser.isDecent = !Browser.isMobile || !(!Browser.ie || Browser.version < 9), util.generateID = function() {
        var id = 0;
        return function() {
            return "qqa-" + id++;
        };
    }(), function() {
        var types = {
            ERROR: 0,
            INFO: 1,
            SERVER: 2,
            CHAN: 3,
            MISC: 4,
            MESSAGE: 5
        }, message = function(msg, type) {
            return {
                message: msg,
                type: type
            };
        };
        _.extend(lang, {
            TYPES: types,
            message: message,
            loginMessages: [ message("Hint #1! When you close a channel this one will be deleted from your favorites and won't come back on the next connection.", types.INFO), message("Hint #2! To join a new channel type this command in the chat box: /j #channel", types.INFO) ],
            joinAfterAuth: message("Waiting for login before joining channels...", types.INFO),
            authFailed: [ message("Could not auth with IRC network - waited 5 seconds.", types.ERROR), message('Otherwise reattempt authing by typing: "/authserv AUTH <your username> <your password>"', types.ERROR), message('To ignore the error and join channels, unauthed, type: "/autojoin".', types.ERROR) ],
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
            fishSlap: "slaps {nick} with a large fishbot",
            copyright: [ message("qwebirc v" + qwebirc.VERSION, types.INFO), message("Copyright (C) 2008-2011 Chris Porter and the qwebirc project.", types.INFO), message('Current version by Emanuel "megawac" Jackstare', types.INFO), message("http://www.qwebirc.org", types.INFO), message("Licensed under the GNU General Public License, Version 2.", types.INFO) ],
            alertNotice: "Alert!",
            activityNotice: message("Activity!", types.MISC),
            partChan: "Part",
            logOut: message("Logged out", types.MESSAGE),
            quit: "Page closed",
            disconnected: message("Client has been disconnected", types.INFO),
            uncontrolledFlood: message("ERROR: uncontrolled flood detected -- disconnected.", types.ERROR),
            connError: message("An error occured: {1}", types.ERROR),
            connRetry: message("Connection lost: retrying in {next} secs", types.ERROR),
            connTimeOut: message("Error: connection closed after {retryAttempts} requests failed.", types.ERROR),
            connectionFail: message("Couldn't connect to remote server.", types.ERROR),
            closeTab: "Close tab",
            detachWindow: "Detach Window",
            invalidNick: "Your nickname was invalid and has been corrected; please check your altered nickname and press Connect again.",
            missingNick: "You must supply a nickname",
            missingPass: "You must supply a password.",
            missingAuthInfo: "You must supply your username and password in auth mode.",
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
            AUTO_OPEN_PM: "Automatically select window on private message:",
            FLASH: "flash",
            BEEP: "beep",
            MESSAGE_PLACEHOLDER: " something ... ",
            NICK_PLACEHOLDER: " someone ... ",
            DELETE_NOTICE: "remove",
            ADD_NOTICE: "Add notifier",
            USER_NOTICE: "User:",
            MESSAGE_NOTICE: "Message:",
            AUTOESCAPE: "Escape text",
            HIGHLIGHT: "Highlight",
            MENTIONED: "Mentioned",
            ESCAPE_HINT: "This text is transformed into a regular expressions - autoescaping will check for the exact text you entered",
            DESKTOP_NOTICES: "Allow us to send desktop notifications if supported (on any notice with flash):",
            ENABLE: "Enable",
            DISABLE: "Disable"
        });
    }(), Epitome.View.implement({
        template: function(data, template) {
            return template = template || this.options.template, template(data);
        }
    });
    var storage = util.storage = new Storage({
        duration: 365,
        domain: "/",
        debug: !0
    }), session = util.sessionStorage = new Storage({
        storageType: "sessionStorage",
        duration: 1,
        debug: !0,
        fallback: !1
    }), Storer = function(name) {
        this.name = name;
    }.implement({
        get: function() {
            return storage.get(this.name);
        },
        set: function(val) {
            return storage.set(this.name, val);
        },
        dispose: function() {
            return storage.remove(this.name);
        }
    });
    ui.Behaviour = function() {
        var behaviour = new Behavior(), delegator = new Delegator({
            getBehavior: function() {
                return behaviour;
            }
        });
        return {
            apply: function($ele) {
                behaviour.apply($ele), delegator.attach($ele);
            }
        };
    }();
    var getTemplate = util.getTemplate = function(name, cb, options) {
        if (_.isFunction(cb) || (cb = util.noop), _.isFunction(name)) cb(name); else if (_.has(templates, name)) cb(_.lookup(templates, name)); else {
            var $script, path = options && options.path || "js/templates/", file = options && options.file || name, type = options && options.type || ".js";
            path.endsWith("/") || (path += "/"), type.startsWith(".") || (type = "." + type), 
            $script = Asset.javascript(path + file + type, {
                onLoad: function() {
                    cb(_.lookup(templates, name)), $script.dispose();
                }
            });
        }
    };
    util.loadTemplate = function(name) {
        var template;
        return getTemplate(name, function(tmpl) {
            template = tmpl;
        }), function() {
            return template.apply(this, arguments);
        };
    }, ui.setTitle = function(title) {
        document.title = title;
    }, util.setCaretPos = Element.setCaretPosition, util.setAtEnd = function($el) {
        $el.setCaretPosition($el.value.length);
    }, util.getCaretPos = Element.getCaretPosition, util.wrapSelected = function($eles, wrap) {
        $eles = $$($eles);
        var start = Array.isArray(wrap) ? wrap[0] : wrap, end = Array.isArray(wrap) ? wrap[1] : wrap;
        $eles.each(function($ele) {
            var range = $ele.getSelectedRange();
            if (range.start != range.end) {
                var text = $ele.val();
                $ele.val(text.slice(0, range.start) + start + text.slice(range.start, range.end) + end + text.slice(range.end)).setCaretPosition(range.end + start.length + end.length);
            }
        });
    }, ui.decorateDropdown = function($btn, $ddm, options) {
        function hideMenu() {
            return options.onHide && options.onHide.call(this, $ddm), document.removeEvents(evts), 
            $ddm.hide();
        }
        function toggleMenu(state) {
            return options.onShow && options.onShow.call(this, $ddm), state !== !0 && $ddm.isDisplayed() ? hideMenu() : ($ddm.show(), 
            document.addEvents(evts)), $ddm;
        }
        options = options || {};
        var evts = {
            click: hideMenu,
            keypress: hideMenu
        };
        return $ddm.store("toggle", toggleMenu).position.delay(50, $ddm, {
            relativeTo: $btn,
            position: {
                x: "left",
                y: "bottom"
            },
            edge: {
                x: "left",
                y: "top"
            }
        }), $ddm.isDisplayed() && document.addEvents(evts), options.btnlistener && $btn.addEvent("click", function(e) {
            e.stop(), toggleMenu();
        }), options.autohide ? hideMenu() : $ddm;
    }, util.fillContainer = function($ele, options) {
        options = Object.append({
            style: [ "width" ],
            offset: 20
        }, options);
        var filler = function() {
            $ele.getSize(), Array.from(options.style).each(function(style) {
                var method = style.contains("width") ? "x" : "y", offset = options.offset;
                $ele.getSiblings().each(function(sib) {
                    offset += sib.getSize()[method];
                }), util.calc($ele, style, "100% - " + offset + "px");
            });
        };
        return _.delay(filler, 20), $ele;
    }, Browser.Features.calc = !!(Browser.ie && Browser.version >= 9 || Browser.firefox && Browser.version >= 4 || Browser.chrome && Browser.version >= 19 || Browser.opera && Browser.version >= 15 || Browser.safari && Browser.version > 6), 
    util.percentToPixel = function(data, par) {
        par = par || $(document.body);
        var size = par.getSize();
        return {
            x: size.x * .01 * data.x,
            y: size.y * .01 * data.y
        };
    }, util.calc = function($ele, style, val) {
        if (!Browser.Features.calc) {
            var old = $ele.retrieve("calc");
            old && window.removeEvent("resize", old);
            var split = val.split(" "), op = split.splice(1, 1), resize = function() {
                var expr = val.replace(/(\d+)(\S+)/g, function(match, size, unit) {
                    switch (size = size.toFloat(), unit) {
                      case "%":
                        var data = {}, dir = style.contains("width") ? "x" : "y";
                        return data[dir] = size, util.percentToPixel(data, $ele.getParent())[dir].round(3);

                      case "em":
                        var fsize = $ele.getStyle("font-size").toFloat();
                        return fsize * size;

                      default:
                        return size;
                    }
                }), size = eval(expr);
                return $ele.setStyle(style, size), resize;
            };
            return window.addEvent("resize", resize), $ele.store("calc", resize), resize();
        }
        val = "calc(" + val + ")", $ele.setStyle(style, val).setStyle(style, "-moz-" + val).setStyle(style, "-webkit-" + val);
    }, util.elementAtScrollPos = function($ele, pos, dir, offset) {
        dir = (dir || "width").capitalize(), offset = offset || 10;
        var $res = $ele.lastChild;
        return Array.some($ele.childNodes, function($kid) {
            return offset += $kid["get" + dir](), offset >= pos ? ($res = $kid, !0) : void 0;
        }), $res;
    }, function() {
        var urlifier = util.urlifier = new Urlerizer({
            target: "_blank"
        }), channame_re = /(#|>|&gt;)[\s\S]*(?=\/)/;
        urlifier.leading_punctuation.include(/^([\x00-\x02]|\x016|\x1F)/).include(/^(\x03+(\d{1,2})(?:,\d{1,2})?)/), 
        urlifier.trailing_punctuation.include(/([\x00-\x03]|\x016|\x1F)$/), urlifier.addPattern(/qwebirc:\/\/(.*)/, function(word) {
            if (word.contains("qwebirc://")) {
                var parsed = this.parsePunctuation(word), mid = parsed.mid;
                if (mid.startsWith("qwebirc://") && mid.endsWith("/") && mid.length > 11) {
                    var cmd = mid.slice(10);
                    if (cmd.startsWith("whois/")) {
                        var chan_match = cmd.match(channame_re), chan = chan_match ? chan_match[0] : "", chanlen = chan_match ? chan_match.index : cmd.length - 1, user = cmd.slice(6, chanlen);
                        cmd = templates.userlink({
                            userid: user,
                            username: user + chan
                        });
                    } else (cmd.startsWith("options") || cmd.startsWith("embedded")) && (cmd = cmd.match(/.*\//)[0], 
                    cmd = cmd.slice(0, cmd.length));
                    word = parsed.lead + cmd + parsed.end;
                }
            }
            return word;
        }).addPattern(/\B#+(?![\._#-+])/, function(word) {
            var parsed = this.parsePunctuation(word), res = parsed.mid;
            return !isChannel(res) || res.startsWith("#mode") || res.slice(1).test() || (res = templates.channellink({
                channel: util.formatChannel(res)
            })), parsed.lead + res + parsed.end;
        });
        var inputurl = util.inputParser = new Urlerizer({
            default_parser: !1,
            autoescape: !1
        }), bbmatch = /\[.+?\].+\[\/.+?\]/i, colour_re = /\[colo(u)?r+(.*?)\](.*?)\[\/colo(u)?r\b\]/gi;
        inputurl.addPattern(bbmatch, function parsebb(_text) {
            var tag_m, tag, bb, style, endTag_re, end_indx, inner, stac = [], tag_re = /\[.+?\]/i, text = _text, colours = irc.styles.colour;
            for (text = text.replace(colour_re, function(match, zZz, attributes, text) {
                var fore, bac, attrs = attributes.clean().split(" "), attrso = {};
                return attrs.each(function(attr) {
                    attr.contains("=") && (attr = attr.split("="), attrso[attr[0]] = attr[1]);
                }), attrso.fore || attrso.bac ? (fore = util.getColourByName(attrso.fore) || util.getColourByKey(attrso.fore) || util.getColourByName("black"), 
                bac = util.getColourByName(attrso.back) || util.getColourByKey(attrso.back) || util.getColourByName("white"), 
                colours.format.substitute({
                    f: fore.key,
                    b: bac.key,
                    t: text
                })) : match;
            }); tag_m = text.match(tag_re); ) tag = tag_m[0], stac.push(text.slice(0, tag_m.index)), 
            text = text.slice(tag_m.index), style = _.find(irc.styles.special, function(sty) {
                return sty.bbcode[0] === tag;
            }), style && (bb = style.bbcode, endTag_re = new RegExp(String.escapeRegExp(bb[1]), "i"), 
            end_indx = text.search(endTag_re), -1 !== end_indx) ? (inner = text.slice(tag.length, end_indx), 
            bbmatch.test(inner) && (inner = parsebb(inner)), stac.push(style.key + inner + style.key), 
            text = text.slice(end_indx + bb[1].length)) : (stac.push(tag), text = text.slice(tag.length));
            return stac.join("") + text;
        }, !0);
    }(), irc.RegisteredCTCPs = {
        VERSION: $lambda("qwebirc v" + qwebirc.VERSION + ", copyright (C) 2008-2011 Chris Porter and the qwebirc project -- " + qwebirc.util.browserVersion()),
        USERINFO: $lambda("qwebirc"),
        TIME: function() {
            return util.IRCDate(new Date());
        },
        PING: $lambda,
        CLIENTINFO: $lambda("PING VERSION TIME USERINFO CLIENTINFO WEBSITE"),
        WEBSITE: $lambda(window == window.top ? "direct" : document.referrer)
    }, irc.DummyNicknameValidator = new Class({
        validate: function(name) {
            return _.isString(name) && name.length > 1 && name;
        }
    }), irc.NicknameValidator = new Class({
        initialize: function(options) {
            this.options = options;
        },
        validate: function(nick, permitDot) {
            if (!_.isString(nick)) return !1;
            var self = this, generated = "", max = Math.min(self.options.maxLen, nick.length);
            return max.times(function(indx) {
                var _char = nick[indx], valid = 0 === indx ? self.options.validFirstChar : self.options.validSubChars;
                generated += valid.contains(_char) || permitDot && "." === _char ? _char : "_";
            }), String.pad(generated, this.options.minLen, "_");
        }
    }), config.IRC_COMMANDS = {
        ACTION: {
            command: "PRIVMSG {target} :ACTION {text}"
        },
        CTCP: {
            command: "PRIVMSG {target} :{type} {text} "
        },
        PRIVMSG: {
            command: "PRIVMSG {target} :{message}"
        },
        JOIN: {
            command: "JOIN {channel} {args}"
        },
        NICK: {
            command: "NICK {nick}"
        },
        PART: {
            command: "PART {channel} :{message}"
        },
        QUIT: {
            command: "QUIT :{message}"
        },
        TOPIC: {
            command: "TOPIC {channel} :{topic}"
        },
        AWAY: {
            command: "AWAY :{message}"
        },
        NOTICE: {
            command: "NOTICE {target} :{message}"
        },
        MODE: {
            command: "MODE {nick} {mode} {args}"
        },
        AUTH: {
            command: "AUTHSERV AUTH {username} {password}"
        },
        KICK: {
            command: "KICK {channel} {kickee} :{message}"
        }
    }, config.COMMAND_ALIAS = {
        J: "JOIN",
        P: "PART",
        MESSAGE: "PRIVMSG",
        M: "PRIVMSG",
        MSG: "PRIVMSG",
        PM: "PRIVMSG",
        Q: "QUERY",
        BACK: "AWAY",
        PRIVACY: "PRIVACYPOLICY",
        HOP: "CYCLE",
        SLAP: "ME"
    }, config.OptionModel = new Class({
        Extends: Epitome.Model.Storage,
        options: {
            defaults: {
                auto_open_pm: !0,
                nick_ov_status: !0,
                accept_service_invites: !0,
                use_hiddenhost: !0,
                lastpos_line: !0,
                nick_colours: !1,
                hide_joinparts: !1,
                query_on_nick_click: !0,
                show_nicklist: !Browser.isMobile,
                show_timestamps: !0,
                font_size: 12,
                volume: 10,
                dn_state: !1,
                dn_duration: 4e3,
                highlight: !0,
                highlight_mentioned: !0,
                style_hue: 210,
                style_saturation: 0,
                style_brightness: 0,
                notices: {
                    on_mention: {
                        flash: !0,
                        beep: !0
                    },
                    on_pm: {
                        flash: !0,
                        beep: !0
                    },
                    on_notice: {
                        flash: !1,
                        beep: !0
                    }
                },
                custom_notices: [],
                default_notice: function() {
                    return {
                        nick: null,
                        msg: "",
                        flash: !1,
                        beep: !1,
                        id: String.uniqueID(),
                        autoescape: !0
                    };
                }
            },
            key: cookies.options,
            minimize: !0
        },
        save: function() {
            return this.set("custom_notices", _.reject(this.get("custom_notices"), function(data) {
                return "" === data.msg.trim();
            })), this.parent();
        },
        set: function(key, data) {
            var props = key.split(".");
            if (props.length > 1) {
                var item = this.get(props[0]);
                return this.parent(props[0], _.assign(item, key, data));
            }
            this.parent(key, data);
        }.overloadSetter()
    }), irc.styles = [ {
        name: "normal",
        style: "",
        key: "\x00"
    }, {
        name: "underline",
        style: "underline",
        key: "",
        keyregex: /\x1F(.*?)\x1F/,
        bbcode: [ "[u]", "[/u]" ]
    }, {
        name: "bold",
        style: "bold",
        key: "",
        keyregex: /\x02(.*?)\x02/,
        bbcode: [ "[b]", "[/b]" ]
    }, {
        name: "italic",
        style: "italic",
        key: "",
        keyregex: /\x16(.*?)\x16/,
        bbcode: [ "[i]", "[/i]" ]
    }, {
        name: "colour",
        style: "",
        key: "",
        fore_re: /^(\d{1,2})/,
        back_re: /^((\d{1,2})+,+(\d{1,2}))/,
        format: "{f},{b}{t}",
        bbcode: [ "[colour fore={f} back={b}]", "[/colour]" ]
    } ], irc.styles.special = _.reject(irc.styles, function(sty) {
        return "normal" == sty.name || "colour" == sty.name;
    }), irc.styles.colour = _.findWhere(irc.styles, {
        name: "colour"
    }), irc.styles.normal = _.findWhere(irc.styles, {
        name: "normal"
    }), irc.colours = [ {
        name: "white",
        fore: "col0",
        back: "back0",
        key: 0
    }, {
        name: "black",
        fore: "col1",
        back: "back1",
        key: 1
    }, {
        name: "navy",
        fore: "col2",
        back: "back2",
        key: 2
    }, {
        name: "green",
        fore: "col3",
        back: "back3",
        key: 3
    }, {
        name: "red",
        fore: "col4",
        back: "back4",
        key: 4
    }, {
        name: "brown",
        fore: "col5",
        back: "back5",
        key: 5
    }, {
        name: "purple",
        fore: "col6",
        back: "back6",
        key: 6
    }, {
        name: "olive",
        fore: "col7",
        back: "back7",
        key: 7
    }, {
        name: "yellow",
        fore: "col8",
        back: "back8",
        key: 8
    }, {
        name: "lightgreen",
        fore: "col9",
        back: "back9",
        key: 9
    }, {
        name: "teal",
        fore: "col10",
        back: "back10",
        key: 10
    }, {
        name: "cyan",
        fore: "col11",
        back: "back11",
        key: 11
    }, {
        name: "blue",
        fore: "col12",
        back: "back12",
        key: 12
    }, {
        name: "pink",
        fore: "col13",
        back: "back13",
        key: 13
    }, {
        name: "gray",
        fore: "col14",
        back: "back14",
        key: 14
    }, {
        name: "lightgrey",
        fore: "col15",
        back: "back15",
        key: 15
    } ], config.ThemeControlCodeMap = {
        C: irc.styles.colour.key,
        B: util.getStyleByName("bold").key,
        U: util.getStyleByName("underline").key,
        O: irc.styles.colour.key,
        D: Browser.ie ? "" : irc.styles.normal.key,
        NN: templates.userlink({
            userid: "{N}",
            username: "{N}"
        }),
        CN: templates.userlink({
            userid: "{newnick}",
            username: "{newnick}"
        }),
        P: "{C}4=={O} "
    }, config.ThemeIRCTemplates = {
        SIGNON: "{P}Signed on!",
        CONNECT: "{P}Connected to server - establishing IRC connection.",
        INFO: "{m}",
        RAW: "{P}{m}",
        DISCONNECT: "{P}Disconnected from server: {m}",
        ERROR: "{P}ERROR: {m}",
        SERVERNOTICE: "{P}{m}",
        OURTARGETEDNOTICE: "[notice({[}{t}{]})] {m}",
        OURCHANNOTICE: "-{N}:{t}- {m}",
        OURPRIVNOTICE: "-{N}- {m}",
        CHANNOTICE: "-{D}{(}{N}{)}{D}:{c}- {m}",
        PRIVNOTICE: "-{(}{N}{)}- {m}",
        JOIN: "{P}{D}{N}{D} [{h}] has joined {c}",
        OURJOIN: "{P}{D}{N}{D} [{h}] has joined {c}",
        PART: "{P}{D}{N}{D} [{h}] has left {c} [{m}]",
        KICK: "{P}{D}{kickee}{D} was kicked from {c} by {D}{kicker}{D} [{m}]",
        MODE: "{P}mode/{c} gives [{m}] to {D}{N}{D}",
        QUIT: "{P}{D}{N}{D} [{h}] has quit [{m}]",
        NICK: "{P}{D}{n}{D} has changed nick to {CN}",
        TOPIC: "{P}{D}{N}{D} changed the topic of {c} to: {m}",
        UMODE: "Usermode change: {m}",
        INVITE: "{N} invites you to join {c}",
        HILIGHT: "{C}4",
        HILIGHTEND: "{O}",
        CHANMSG: "{D}&lt;{@}{(}{N}&gt;{)}{D} {m}",
        PRIVMSG: "{(}&lt;{N}&gt;{)} {m}",
        OURCHANMSG: "&lt;{@}{N}&gt; {m}",
        OURPRIVMSG: "&lt;{N}&gt; {m}",
        OURTARGETEDMSG: "*{[}{t}{]}* {m}",
        OURCHANACTION: " * {N} {m}",
        OURPRIVACTION: " * {N} {m}",
        CHANACTION: " * {D}{(}{N}{)}{D} {m}",
        PRIVACTION: " * {(}{N}{)} {m}",
        CHANCTCP: "{N} [{h}] requested CTCP {data} from {c}: {m}",
        PRIVCTCP: "{N} [{h}] requested CTCP {data} from {-}: {m}",
        CTCPREPLY: "CTCP {x} reply from {N}: {m}",
        OURCHANCTCP: "[ctcp({t})] {x} {m}",
        OURPRIVCTCP: "[ctcp({t})] {x} {m}",
        OURTARGETEDCTCP: "[ctcp({t})] {x} {m}",
        WHOISUSER: "{P}{B}{N}{B} [{h}]",
        WHOISREALNAME: "{P} realname : {m}",
        WHOISCHANNELS: "{P} channels : {m}",
        WHOISSERVER: "{P} server   : {x} [{m}]",
        WHOISACCOUNT: "{P} account : m",
        WHOISIDLE: "{P} idle     : {x} [connected: {m}]",
        WHOISAWAY: "{P} away     : {m}",
        WHOISOPER: "{P}          : {B}IRC Operator{B}",
        WHOISOPERNAME: "{P} operedas : {m}",
        WHOISACTUALLY: "{P} realhost : {m} [ip: {x}]",
        WHOISGENERICTEXT: "{P} note  : {m}",
        WHOISEND: "{P}End of WHOIS",
        AWAY: "{P}{N} is away: {m}",
        GENERICERROR: "{P}{m}: {t}",
        GENERICMESSAGE: "{P}{m}",
        WALLOPS: "{P}WALLOP {n}: {t}",
        CHANNELCREATIONTIME: "{P}Channel {c} was created at: {m}",
        CHANNELMODEIS: "{P}Channel modes on {c} are: {m}"
    }, function() {
        var cmd = config.IRC_COMMANDS, format = function(command, data) {
            return util.format(command.command, data);
        };
        irc.CommandHistory = new Class({
            Extends: Epitome.Model.Storage,
            Implements: [ Options ],
            options: {
                lines: 20,
                minlen: 2,
                storage: {
                    fallback: !1
                },
                key: cookies.history
            },
            addLine: function(name, line) {
                var data = this.get(name);
                line.length > this.options.minlen && !data.contains(line) && (data.unshift(line), 
                data.length > this.options.lines && data.pop(), this.set(name, data), this.save());
            },
            addChannel: function(name) {
                this.get(name) || this.set(name, []);
            },
            removeChannel: function(name) {
                this.unset(name), this.save();
            },
            _filter: function(val) {
                return 0 !== _.size(val);
            }
        }), irc.NodeConnection = new Class({
            Implements: [ Options, Events ],
            Binds: [ "recv", "error", "_connected", "_disconnected" ],
            options: {
                socket: {
                    url: document.location.hostname
                },
                nickname: "ircconnX",
                password: "",
                serverPassword: null,
                autoConnect: !0,
                autoRejoin: !1,
                debug: !0,
                floodProtection: !1,
                retryInterval: 5e3,
                retryScalar: 2
            },
            connected: !1,
            initialize: function(options) {
                var self = this;
                self.setOptions(options);
                var ip = util.formatter("{url}", self.options.socket), socket = self.socket = io.connect(ip), $evts = {
                    raw: self.recv,
                    echo: _.log,
                    connected: self._connected,
                    disconnect: self._disconnected,
                    error: self.error
                };
                _.each($evts, function(fn, key) {
                    fn ? socket.on(key, fn) : socket.on(key, function() {
                        self.fireEvent(key);
                    });
                }), self.connect();
            },
            connect: function() {
                this.socket.emit("irc", this.options);
            },
            _connected: function() {
                this.connected = !0, this.fireEvent("connected"), this.__retry = this.options.retryInterval;
            },
            disconnect: function() {
                this.socket.emit("quit"), this.socket.disconnect();
            },
            _disconnected: function() {
                this.connected = !1, this.autoretry();
            },
            recv: function(data) {
                var processed = util.parseIRCData(data.raw);
                this.fireEvent("recv", processed);
            },
            send: function(data) {
                return this.connected ? (this.socket.emit("send", data), !0) : (console.error("disconnected dude"), 
                void 0);
            },
            error: function() {
                console.error(arguments), this.fireEvent("error");
            },
            autoretry: function() {
                if (!this.connected) {
                    var next = this.__retry *= this.options.retryScalar;
                    return this.fireEvent("retry", {
                        next: next
                    }), this.socket.emit("retry", "please"), _.delay(this.autoretry, next, this);
                }
            }
        }), auth.loggedin = !1, auth.enabled = !1, auth.authed = !1, auth.signedIn = !1, 
        auth.quakeNetAuth = $lambda(!1), auth.passAuth = $lambda(!0), auth.bouncerAuth = $lambda(!1), 
        ui.AuthLogin = function(e) {
            Cookie.write("redirect", document.location), document.location = qwebirc.global.dynamicBaseURL + "auth/", 
            new Event(e).stop();
        }, function() {
            function genericError(prefix, params) {
                var target = params[1], message = params.getLast();
                return this.genericError(target, message), !0;
            }
            function genericQueryError(prefix, params) {
                var target = params[1], message = params.getLast();
                return this.genericQueryError(target, message), !0;
            }
            irc.BaseIRCClient = new Class({
                Implements: [ Options, Events ],
                Binds: [ "lostConnection", "send", "connected", "retry", "ndispatch", "tdispatch" ],
                toIRCLower: irc.RFC1459toIRCLower,
                initialize: function(options) {
                    var self = this;
                    if (options = self.setOptions(options).options, self.nickname = options.nickname, 
                    self.lowerNickname = self.toIRCLower(self.nickname), options.node) {
                        var conn = self.connection = new irc.NodeConnection({
                            account: options.account,
                            nickname: self.nickname,
                            password: options.password,
                            serverPassword: options.serverPassword
                        });
                        conn.addEvents({
                            recv: self.ndispatch,
                            quit: self.quit,
                            retry: self.retry,
                            connected: self.connected,
                            lostConnection: self.lostConnection
                        });
                    } else self.connection = new irc.TwistedConnection({
                        account: options.account,
                        initialNickname: self.nickname,
                        password: options.password,
                        serverPassword: options.serverPassword
                    }), self.connection.addEvent("recv", self.tdispatch);
                },
                trigger: function(type, data) {
                    return data || (data = {}), data["-"] = this.nickname, this.fireEvent(type, [ type, data ]);
                },
                isConnected: function() {
                    return this.__signedOn && this.connection.connected;
                },
                retry: util.noop,
                lostConnection: function() {},
                send: function(data) {
                    return this.connection.send(data);
                },
                ndispatch: function(data) {
                    var fn = this["irc_" + data.command];
                    fn && fn.call(this, data.prefix, data.args) || this.rawNumeric(data.command, data.prefix, data.args);
                },
                tdispatch: function(data) {
                    var message = data[0];
                    switch (message) {
                      case "connect":
                        this.connected();
                        break;

                      case "disconnect":
                        0 === data.length ? this.disconnected("No error!") : this.disconnected(data[1]), 
                        this.disconnect();
                        break;

                      case "c":
                        var command = data[1].toUpperCase(), prefix = data[2], sl = data[3], fn = this["irc_" + (irc.Numerics[command] || command)];
                        if (fn) {
                            var result = fn.call(this, prefix, sl);
                            if (result) return;
                        }
                        this.rawNumeric(command, prefix, sl);
                    }
                },
                supported: function(key, value) {
                    var self = this;
                    switch (key) {
                      case "CASEMAPPING":
                        "ascii" === value ? self.toIRCLower = irc.ASCIItoIRCLower : "rfc1459" === value || console.log("unsupported codec"), 
                        self.lowerNickname = self.toIRCLower(self.nickname);
                        break;

                      case "CHANMODES":
                        value.split(",").each(function(mode, inx) {
                            _.each(mode, function(letter) {
                                self.pmodes[letter] = inx;
                            });
                        });
                        break;

                      case "PREFIX":
                        var len = (value.length - 2) / 2, modeprefixes = value.substr(1, len);
                        _.each(modeprefixes, function(modeprefix) {
                            self.pmodes[modeprefix] = irc.PMODE_SET_UNSET;
                        });
                    }
                },
                __inChannel: function(name) {
                    return this.channels.contains(name);
                },
                __killChannel: function(name) {
                    return this.channels.erase(name);
                },
                processCTCP: function(message) {
                    return "" === message.charAt(0) ? (message = "" === Array.getLast(message) ? message.substr(1, message.length - 2) : message.substr(1), 
                    message.splitMax(" ", 2)) : void 0;
                },
                getChannels: function() {
                    return this.channels;
                },
                storeChannels: function(c) {
                    return this.channels = c, c;
                },
                canJoinChannel: $lambda(!0),
                irc_RPL_WELCOME: function(prefix, params) {
                    var self = this;
                    self.nickname = params[0], self.lowerNickname = self.toIRCLower(self.nickname), 
                    self.signedOn(self.nickname), _.delay(function() {
                        self.__signedOn = !0;
                    }, 2e3);
                },
                irc_ERR_NICKNAMEINUSE: function(prefix, params) {
                    if (this.genericError(params[1], params.getLast()), this.__signedOn) return !0;
                    var nick = params[1], newnick = nick + Number.random(0, 9);
                    return this.send(format(cmd.NICK, {
                        nick: newnick
                    })), this.lastnick = newnick, !0;
                },
                irc_NICK: function(prefix, params) {
                    var user = prefix, oldnick = util.hostToNick(user), newnick = params[0], wasus = this.nickname === oldnick;
                    return wasus && (this.nickname = newnick, this.lowerNickname = this.toIRCLower(this.nickname)), 
                    this.nickChanged(user, newnick, wasus), !0;
                },
                irc_QUIT: function(prefix, params) {
                    var user = prefix, message = params.getLast();
                    return this.userQuit(user, message), !0;
                },
                irc_PART: function(prefix, params) {
                    var user = prefix, channel = params[0], message = params[1], nick = util.hostToNick(user);
                    return this.partHandler(nick, channel), this.userPart(user, channel, message), !0;
                },
                irc_KICK: function(prefix, params) {
                    var kicker = prefix, channel = params[0], kickee = params[1], message = params[2];
                    return this.partHandler(kickee, channel), this.userKicked(kicker, channel, kickee, message), 
                    !0;
                },
                partHandler: function(nick, chan) {
                    var wasus = nick === this.nickname;
                    return wasus && this.__inChannel(chan) && this.__killChannel(chan), wasus;
                },
                irc_PING: function(prefix, params) {
                    return this.send("PONG :" + params.getLast()), !0;
                },
                irc_JOIN: function(user, params) {
                    var newchan = params[0], nick = util.hostToNick(user), wasus = nick === this.nickname;
                    return wasus && (isBaseWindow(newchan) || this.storeChannels(util.addChannel(this.getChannels(), newchan)), 
                    this.__signedOn && (this.currentChannel = newchan)), this.userJoined(user, newchan), 
                    !0;
                },
                irc_TOPIC: function(prefix, params) {
                    var user = prefix, channel = params[0], topic = params.getLast();
                    return this.channelTopic(user, channel, topic), !0;
                },
                irc_PRIVMSG: function(prefix, params) {
                    var user = prefix, target = params[0], message = params.getLast(), ctcp = this.processCTCP(message);
                    if (ctcp) {
                        var type = ctcp[0].toUpperCase(), replyfn = irc.RegisteredCTCPs[type];
                        if (replyfn) {
                            var t = Date.now() / 1e3;
                            if (t > this.nextctcp) {
                                var repctcp = replyfn(ctcp[1]);
                                this.send(format(cmd.CTCP, {
                                    target: util.hostToNick(user),
                                    type: type,
                                    text: repctcp
                                }));
                            }
                            this.nextctcp = t + 5;
                        }
                        target === this.nickname ? this.userCTCP(user, type, ctcp[1]) : this.channelCTCP(user, target, type, ctcp[1]);
                    } else target === this.nickname ? this.userPrivmsg(user, message) : this.channelPrivmsg(user, target, message);
                    return !0;
                },
                irc_NOTICE: function(host, params) {
                    var user = util.hostToNick(host), target = params[0], message = params.getLast(), options = this.options, isNetworkService = options.networkServices.contains(host);
                    if (isNetworkService && options.loginRegex.test(message) && this.authEvent(), isNetworkService || "" == user || user.contains("!")) this.serverNotice(host, message, target); else if (target === this.nickname) {
                        var ctcp = this.processCTCP(message);
                        ctcp ? this.userCTCPReply(host, ctcp[0], ctcp[1]) : this.userNotice(host, message);
                    } else this.channelNotice(host, target, message);
                    return !0;
                },
                irc_INVITE: function(prefix, params) {
                    var user = prefix, channel = params.getLast();
                    return this.userInvite(user, channel), !0;
                },
                irc_ERROR: function(prefix, params) {
                    var message = params.getLast();
                    return this.serverError(message), !0;
                },
                irc_MODE: function(prefix, params) {
                    var user = prefix, target = params[0], args = params.slice(1);
                    if (target == this.nickname) this.userMode(args); else {
                        var modes = args[0].split(""), xargs = args.slice(1), argindx = 0, cmode = OPED, data = modes.filter(function(mode) {
                            var dir = mode === OPED || mode === DEOPED;
                            return dir && (cmode = mode), !dir;
                        }).map(function(mode) {
                            var pmode = this.pmodes[mode], m = pmode === irc.PMODE_LIST || pmode === irc.PMODE_SET_UNSET ? [ cmode, mode, xargs[argindx++] ] : [ cmode, mode ];
                            return m;
                        }, this);
                        this.channelMode(user, target, data, args);
                    }
                    return !0;
                },
                irc_RPL_ISUPPORT: function(prefix, params) {
                    var ms, supported = params.slice(1, -1);
                    supported.contains("CHANMODES") && supported.contains("PREFIX") && (this.pmodes = {}), 
                    supported.each(function(mode) {
                        ms = mode.splitMax("=", 2), this.supported(ms[0], ms[1]);
                    }, this);
                },
                irc_RPL_NAMREPLY: function(prefix, params) {
                    var channel = params[2], names = params[3];
                    return this.channelNames(channel, names.split(" ")), !0;
                },
                irc_RPL_ENDOFNAMES: function(prefix, params) {
                    var channel = params[1];
                    return this.channelNames(channel, []), !0;
                },
                irc_RPL_NOTOPIC: function(prefix, params) {
                    var channel = params[1];
                    return this.__inChannel(channel) ? (this.initialTopic(channel, ""), !0) : void 0;
                },
                irc_RPL_TOPIC: function(prefix, params) {
                    var channel = params[1], topic = params.getLast();
                    return this.__inChannel(channel) ? (this.initialTopic(channel, topic), !0) : void 0;
                },
                irc_RPL_TOPICWHOTIME: $lambda(!0),
                irc_RPL_WHOISUSER: function(prefix, params) {
                    var nick = params[1];
                    return this.whoisNick = nick, this.whois(nick, "user", {
                        ident: params[2],
                        hostname: params[3],
                        realname: params.getLast()
                    });
                },
                irc_RPL_WHOISSERVER: function(prefix, params) {
                    var nick = params[1];
                    return params[2], params.getLast(), this.whois(nick, "server", {
                        server: params[2],
                        serverdesc: params.getLast()
                    });
                },
                irc_RPL_WHOISOPERATOR: function(prefix, params) {
                    var nick = params[1];
                    return params.getLast(), this.whois(nick, "oper", {
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
                    var nick = params[1];
                    return params[2], this.whois(nick, "opername", {
                        opername: params[2]
                    });
                },
                irc_RPL_WHOISGENERICTEXT: function(prefix, params) {
                    var nick = params[1], text = params.getLast();
                    return this.whois(nick, "generictext", {
                        text: text
                    });
                },
                irc_RPL_WHOISWEBIRC: function(prefix, params) {
                    var nick = params[1], text = params.getLast();
                    return this.whois(nick, "generictext", {
                        text: text
                    });
                },
                irc_RPL_WHOISSECURE: function(prefix, params) {
                    var nick = params[1], text = params.getLast();
                    return this.whois(nick, "generictext", {
                        text: text
                    });
                },
                irc_RPL_ENDOFWHOIS: function(prefix, params) {
                    var nick = params[1];
                    return params.getLast(), this.whoisNick = null, this.whois(nick, "end", {});
                },
                irc_genericError: genericError,
                irc_ERR_CHANOPPRIVSNEEDED: genericError,
                irc_ERR_CANNOTSENDTOCHAN: genericError,
                irc_genericQueryError: genericQueryError,
                irc_ERR_NOSUCHNICK: genericQueryError,
                irc_RPL_AWAY: function(prefix, params) {
                    var nick = params[1], text = params.getLast();
                    return this.whoisNick && this.whoisNick == nick ? this.whois(nick, "away", {
                        away: text
                    }) : (this.awayMessage(nick, text), !0);
                },
                irc_RPL_NOWAWAY: function(prefix, params) {
                    return this.awayStatus(!0, params.getLast()), !0;
                },
                irc_RPL_UNAWAY: function(prefix, params) {
                    return this.awayStatus(!1, params.getLast()), !0;
                },
                irc_WALLOPS: function(prefix, params) {
                    var user = prefix, text = params.getLast();
                    return this.wallops(user, text), !0;
                },
                irc_RPL_CREATIONTIME: function(prefix, params) {
                    var channel = params[1], time = params[2];
                    return this.channelCreationTime(channel, time), !0;
                },
                irc_RPL_CHANNELMODEIS: function(prefix, params) {
                    var channel = params[1], modes = params.slice(2);
                    return this.channelModeIs(channel, modes), !0;
                },
                irc_RPL_LISTSTART: function() {
                    return this.listedChans = [], !this.hidelistout;
                },
                irc_RPL_LIST: function(bot, args) {
                    return this.listedChans.push({
                        channel: args[1],
                        users: _.toInt(args[2]),
                        topic: args[3]
                    }), !this.hidelistout;
                },
                irc_RPL_LISTEND: function() {
                    return this.trigger("listend", this.listedChans), !this.hidelistout;
                }
            });
        }(), irc.Commands = new Class({
            Binds: [ "dispatch" ],
            initialize: function(parentObject) {
                this.parentObject = parentObject, this.send = parentObject.send;
            },
            buildExtra: function(extra, target, message) {
                return extra || (extra = {}), extra.n = this.parentObject.nickname, extra.m = message, 
                extra.t = target, extra;
            },
            trigger: function(type, data) {
                return this.parentObject.trigger(type, data);
            },
            format: format,
            dispatch: function(line, chan) {
                for (var command, args, cmdopts, self = this, allargs = util.formatCommand(line), par = self.parentObject; $defined(allargs); ) {
                    if (command = allargs[0].toUpperCase(), command = config.COMMAND_ALIAS[command] || command, 
                    args = allargs[1], cmdopts = self["cmd_" + command], !cmdopts) {
                        self.send(command + util.padspace(args));
                        break;
                    }
                    if (cmdopts.minargs && cmdopts.minargs > _.size(args)) {
                        par.writeMessages(lang.insufficentArgs, {}, {
                            channel: chan
                        });
                        break;
                    }
                    cmdopts.splitargs && args && (args = args.splitMax(" ", cmdopts.splitargs)), allargs = cmdopts.fn.call(self, args, chan);
                }
            },
            automode: function(modes, mode, args, channel) {
                args.length.times(function() {
                    modes += mode;
                }), this.send(format(cmd.MODE, {
                    nick: channel,
                    mode: modes,
                    args: args.join(" ")
                }));
            },
            cmd_ME: {
                fn: function(args, target) {
                    args = args || "";
                    var msg = format(cmd.ACTION, {
                        target: target,
                        text: args
                    });
                    if (this.send(msg)) {
                        var nick = this.parentObject.nickname;
                        this.trigger("privAction", {
                            nick: nick,
                            message: args,
                            target: target,
                            channel: target,
                            "@": this.parentObject.getNickStatus(target, nick)
                        });
                    }
                }
            },
            cmd_CTCP: {
                splitargs: 3,
                minargs: 2,
                fn: function(args, target) {
                    target = args[0] || target;
                    var type = args[1].toUpperCase(), message = args[2] || "", msg = format(cmd.CTCP, {
                        target: target,
                        type: type,
                        text: message
                    });
                    this.send(msg) && this.trigger("privCTCP", {
                        nick: this.parentObject.nickname,
                        _type: type,
                        message: message,
                        args: args,
                        type: "CTCPReply"
                    });
                }
            },
            cmd_SAY: {
                splitargs: 1,
                minargs: 1,
                fn: function(args, target) {
                    return [ "PRIVMSG", target + " " + args.join(" ") ];
                }
            },
            cmd_PRIVMSG: {
                splitargs: 2,
                minargs: 1,
                fn: function(args, target) {
                    var message;
                    args.length > 1 ? (target = args[0], message = args[1]) : message = args[0];
                    var parentObj = this.parentObject, nick = parentObj.nickname, msg = format(cmd.PRIVMSG, {
                        target: target,
                        message: message
                    });
                    return util.isChannel(target) ? (this.send(msg) && this.trigger("chanMessage", {
                        nick: nick,
                        channel: target,
                        message: message,
                        type: "chanmsg",
                        "@": parentObj.getNickStatus(target, nick)
                    }), void 0) : [ "QUERY", target + " " + message ];
                }
            },
            cmd_NOTICE: {
                splitargs: 2,
                minargs: 2,
                fn: function(args) {
                    var target = args[0], message = args[1], msg = format(cmd.NOTICE, {
                        target: target,
                        message: message
                    });
                    this.send(msg) && this.trigger("chanNotice", {
                        nick: this.parentObject.nickname,
                        channel: target,
                        target: target,
                        message: message
                    });
                }
            },
            cmd_QUERY: {
                splitargs: 2,
                minargs: 1,
                fn: function(args, target) {
                    var target = args[0], message = args[1];
                    if (util.isChannel(target)) return this.writeMessages(lang.invalidChanTarget);
                    if (_.size(message) > 1) {
                        var msg = format(cmd.PRIVMSG, {
                            target: target,
                            message: message
                        });
                        this.send(msg);
                    }
                    this.trigger("query", {
                        nick: this.parentObject.nickname,
                        channel: target,
                        message: message,
                        type: "privmsg"
                    });
                }
            },
            cmd_LOGOUT: {
                fn: function() {
                    this.parentObject.ui.logout();
                }
            },
            cmd_OPTIONS: {
                fn: function() {
                    this.trigger("openWindow", {
                        window: "optionsWindow",
                        type: ui.WINDOW.custom
                    });
                }
            },
            cmd_QUOTE: {
                splitargs: 1,
                minargs: 1,
                fn: function(args) {
                    this.send(args[0]);
                }
            },
            cmd_KICK: {
                splitargs: 2,
                minargs: 1,
                fn: function(args, channel) {
                    var target = args[0], message = args.length >= 2 ? args[1] : "", msg = format(cmd.KICK, {
                        channel: channel,
                        kickee: target,
                        message: message
                    });
                    this.send(msg);
                }
            },
            cmd_OP: {
                splitargs: 6,
                minargs: 1,
                fn: function(args) {
                    this.automode("+", "o", args);
                }
            },
            cmd_DEOP: {
                splitargs: 6,
                minargs: 1,
                fn: function(args) {
                    this.automode("-", "o", args);
                }
            },
            cmd_AUTH: {
                splitargs: 2,
                minargs: 2,
                fn: function(args) {
                    var msg = format(irc.AUTH, {
                        username: args[0],
                        password: args[1]
                    });
                    this.send(msg);
                }
            },
            cmd_VOICE: {
                splitargs: 6,
                minargs: 1,
                fn: function(args) {
                    this.automode("+", "v", args);
                }
            },
            cmd_DEVOICE: {
                splitargs: 6,
                minargs: 1,
                fn: function(args) {
                    this.automode("-", "v", args);
                }
            },
            cmd_TOPIC: {
                splitargs: 1,
                minargs: 1,
                fn: function(args, channel) {
                    var topic;
                    args.length > 1 ? (channel = args[0], topic = args[1]) : topic = args[0];
                    var msg = format(cmd.TOPIC, {
                        channel: channel,
                        topic: topic
                    });
                    this.send(msg);
                }
            },
            cmd_AWAY: {
                splitargs: 1,
                minargs: 0,
                fn: function(args) {
                    var msg = format(cmd.AWAY, {
                        message: args ? args[0] : ""
                    });
                    this.send(msg);
                }
            },
            cmd_QUIT: {
                splitargs: 1,
                minargs: 0,
                fn: function(args) {
                    this.parentObject.quit(args ? args[0] : "");
                }
            },
            cmd_FJOIN: {
                splitargs: 2,
                minargs: 1,
                fn: function(args) {
                    if (!_.isEmpty(args)) {
                        var channels = args.shift(), formatted = util.formatChannelString(channels);
                        channels !== formatted && this.parentObject.writeMessages(lang.poorJoinFormat), 
                        formatted && this.send(format(cmd.JOIN, {
                            channel: formatted,
                            args: args.join(" ")
                        }));
                    }
                }
            },
            cmd_JOIN: {
                splitargs: 2,
                minargs: 1,
                fn: function(args) {
                    var channels = args.shift(), chans = util.splitChans(channels).filter(this.parentObject.canJoinChannel, this.parentObject);
                    this.cmd_FJOIN.fn.call(this, Array.from(util.joinChans(chans)).concat(args));
                }
            },
            cmd_UMODE: {
                splitargs: 1,
                minargs: 0,
                fn: function(args) {
                    var msg = format(cmd.MODE, {
                        nick: this.parentObject.nickname,
                        mode: args ? args[0] : ""
                    });
                    this.send(msg);
                }
            },
            cmd_BEEP: {
                fn: function() {
                    this.parentObject.ui.beep();
                }
            },
            cmd_AUTOJOIN: {
                fn: function() {
                    return auth.signedIn ? void 0 : (auth.signedIn = !0, [ "JOIN", this.parentObject.options.autojoin.join(",") ]);
                }
            },
            cmd_PART: {
                splitargs: 2,
                minargs: 0,
                fn: function(args, channel) {
                    var msg = format(cmd.PART, {
                        channel: args[0] || channel,
                        message: args[1] || lang.partChan
                    });
                    this.send(msg);
                }
            }
        }), irc.IRCClient = new Class({
            Extends: irc.BaseIRCClient,
            Binds: [ "quit", "writeMessages", "newTargetOrActiveLine" ],
            options: {
                nickname: "qwebirc",
                autojoin: "",
                prefixes: "@+",
                minRejoinTime: [ 0 ],
                networkServices: [],
                loginRegex: /^$/
            },
            lastNicks: [],
            inviteChanList: [],
            activeTimers: {},
            windows: {},
            modeprefixes: "ov",
            __signedOn: !1,
            channels: {},
            nextctcp: 0,
            pmodes: {
                b: irc.PMODE_LIST,
                l: irc.PMODE_SET_ONLY,
                k: irc.PMODE_SET_UNSET,
                o: irc.PMODE_SET_UNSET,
                v: irc.PMODE_SET_UNSET
            },
            initialize: function(options, ui) {
                var self = this;
                self.parent(options), self.ui = ui, self.prefixes = self.options.prefixes, self.commandparser = new irc.Commands(self), 
                self.exec = self.commandparser.dispatch, self.ui.newClient(self), self.tracker = new irc.IRCTracker(self), 
                self.writeMessages(lang.copyright);
            },
            connect: function() {
                return this.connection.connect();
            },
            connected: function() {
                this.trigger("connect", {});
            },
            quit: function(message) {
                return this.__signedOn && (this.send("QUIT :" + (message || lang.quit), !0), _.each(this.activeTimers, $clear), 
                this.activeTimers = {}, this.writeMessages(lang.disconnected, {}, {
                    channels: "ALL"
                }), this.trigger("disconnect"), this.connection.disconnect(), this.__signedOn = !1), 
                this;
            },
            disconnected: function(message) {
                _.each(this.windows, function(win) {
                    util.isChannelType(win.type) && win.close();
                }), delete this.tracker, this.trigger("disconnect", {
                    message: message
                });
            },
            retry: function(data) {
                this.trigger("retry", data), this.writeMessages(lang.connRetry, {
                    next: (data.next / 1e3).round(1)
                }, {
                    channels: "ALL"
                });
            },
            updateNickList: function(channel) {
                var nickHash = this.tracker.getChannel(channel), names2 = $defined(nickHash) ? _.keys(nickHash) : [], comparitor = util.nickChanComparitor(this, nickHash), prefixer = util.nickPrefixer(nickHash), sorted = names2.sort(comparitor).map(prefixer), win = this.ui.getWindow(this, channel);
                win && win.updateNickList(sorted);
            },
            writeMessages: function(messages, args, data) {
                function write(message) {
                    var msg = args ? util.formatter(message.message, args) : message.message;
                    switch (data.message.push(msg), message.type) {
                      case types.ERROR:
                        data.colourClass = "warn";
                        break;

                      case types.INFO:
                        data.colourClass = "info";
                    }
                }
                data = _.extend({
                    type: "info",
                    colourClass: "",
                    channel: STATUS,
                    message: []
                }, data), data.channels = "ALL" === data.channels ? [ STATUS, BROUHAHA ].concat(this.channels) : data.channels;
                var types = lang.TYPES;
                _.isArray(messages) ? messages.each(write) : write(messages), this.trigger("info", data);
            },
            rawNumeric: function(numeric, prefix, params) {
                this.trigger("raw", {
                    numeric: numeric,
                    message: params.slice(1).join(" ")
                });
            },
            signedOn: function(nickname) {
                var channels, options = this.options;
                this.nickname = nickname, this.writeMessages(lang.signOn), channels = this.getChannels(), 
                channels.length > 0 ? options.autojoin = channels : (options.autojoin = channels = options.initialChannels, 
                this.storeChannels(channels)), channels = options.autojoin = util.prependChannel(channels, BROUHAHA), 
                this.currentChannel = BROUHAHA, this.writeMessages(lang.loginMessages, {}, {
                    channel: BROUHAHA
                }), !auth.authed && auth.enabled ? this.attemptAuth() : this.exec("/AUTOJOIN"), 
                this.trigger("logon", {
                    nickname: nickname,
                    channels: channels
                });
            },
            attemptAuth: function() {
                !auth.authed && auth.enabled && (this.send(util.formatter("AUTHSERV AUTH {account} {password}", this.options)), 
                this.writeMessages.delay(100, this, lang.joinAfterAuth), this.activeTimers.autojoin = function() {
                    auth.authed || this.writeMessages(lang.authFailed);
                }.delay(5e3, this));
            },
            authEvent: function() {
                auth.authed = !0, this.exec("/UMODE +x"), auth.signedIn || (this.writeMessages(lang.joinChans), 
                this.exec("/AUTOJOIN")), this.trigger("auth");
            },
            userJoined: function(user, channel) {
                var nick = util.hostToNick(user), host = util.hostToHost(user), wasus = nick === this.nickname, windowSelected = channel === this.currentChannel || channel === BROUHAHA;
                this.tracker.addNickToChannel(nick, BROUHAHA), this.tracker.addNickToChannel(nick, channel), 
                this.updateNickList(BROUHAHA), this.updateNickList(channel), this.trigger("userJoined", {
                    user: user,
                    nick: nick,
                    host: host,
                    channel: channel,
                    thisclient: wasus,
                    select: windowSelected
                });
            },
            userPart: function(user, channel, message) {
                var nick = util.hostToNick(user), host = util.hostToHost(user), wasus = nick === this.nickname;
                wasus ? this.tracker.removeChannel(channel) : (this.tracker.removeNickFromChannel(nick, BROUHAHA), 
                this.tracker.removeNickFromChannel(nick, channel), this.updateNickList(BROUHAHA), 
                this.updateNickList(channel)), this.trigger("part", {
                    user: user,
                    nick: nick,
                    host: host,
                    channel: channel,
                    message: message,
                    thisclient: wasus
                });
            },
            userKicked: function(kicker, channel, kickee, message) {
                var wasus = kickee === this.nickname;
                wasus ? this.tracker.removeChannel(channel) : (this.tracker.removeNickFromChannel(kickee, channel), 
                this.updateNickList(channel)), this.trigger("kick", {
                    kicker: kicker,
                    channel: channel,
                    kickee: kickee,
                    message: message,
                    thisclient: wasus
                });
            },
            userPrivmsg: function(user, message) {
                var nick = util.hostToNick(user), host = util.hostToHost(user);
                this.pushLastNick(nick), this.trigger("query", {
                    user: user,
                    nick: nick,
                    host: host,
                    channel: nick,
                    message: message,
                    type: "privmsg"
                });
            },
            userInvite: function(user, channel) {
                var nick = util.hostToNick(user), host = util.hostToHost(user), accept = this.ui.uiOptions2.get("accept_service_invites") && this.isNetworkService(user);
                accept && (this.activeTimers.serviceInvite && $clear(this.activeTimers.serviceInvite), 
                this.activeTimers.serviceInvite = this.__joinInvited.delay(100, this), this.inviteChanList.push(channel)), 
                this.trigger("invite", {
                    user: user,
                    channel: channel,
                    accept: accept,
                    nick: nick,
                    host: host
                });
            },
            userNotice: function(user, message) {
                var nick = util.hostToNick(user), host = util.hostToHost(user);
                this.trigger("privNotice", {
                    user: user,
                    message: message,
                    host: host,
                    nick: nick
                });
            },
            userQuit: function(user, message) {
                var self = this, nick = util.hostToNick(user), channels = self.tracker.getNick(nick);
                self.tracker.removeNick(nick), _.keys(channels).each(function(chan) {
                    self.updateNickList(chan);
                }), self.trigger("quit", {
                    user: user,
                    host: util.hostToHost(user),
                    nick: nick,
                    channels: channels,
                    message: message
                });
            },
            userMode: function(modes) {
                this.trigger("userMode", {
                    modes: modes,
                    message: modes.join(""),
                    type: "UMODE",
                    n: this.nickname
                });
            },
            nickChanged: function(user, newnick, wasus) {
                var self = this, oldnick = util.hostToNick(user);
                wasus && (self.nickname = newnick, storage.set(cookies.nickname, newnick)), self.tracker.renameNick(oldnick, newnick);
                var channels = self.tracker.getNick(newnick);
                _.size(channels) > 0, _.each(channels, function(obj, chan) {
                    self.updateNickList(chan);
                }), self.trigger("nickChange", {
                    user: user,
                    nick: util.hostToNick(user),
                    newnick: newnick,
                    channels: channels,
                    thisclient: wasus,
                    type: "nick"
                });
            },
            initialTopic: function(channel, topic) {
                this.trigger("chanTopic", {
                    channel: channel,
                    topic: topic,
                    initial: !0
                });
            },
            channelTopic: function(user, channel, topic) {
                this.trigger("chanTopic", {
                    user: user,
                    nick: util.hostToNick(user),
                    channel: channel,
                    topic: topic
                });
            },
            channelPrivmsg: function(user, channel, message) {
                var self = this, nick = util.hostToNick(user);
                self.tracker.updateLastSpoke(nick, channel, Date.now()), self.trigger("chanMessage", {
                    user: user,
                    nick: nick,
                    channel: channel,
                    message: message,
                    type: "chanmsg",
                    "@": self.getNickStatus(channel, nick)
                });
            },
            channelNotice: function(user, channel, message) {
                var nick = util.hostToNick(user);
                this.trigger("chanNotice", {
                    user: user,
                    nick: nick,
                    channel: channel,
                    message: message,
                    "@": this.getNickStatus(channel, nick)
                });
            },
            channelMode: function(user, channel, modes) {
                var self = this;
                _.each(modes, function(mo) {
                    var direction = mo[0], mode = mo[1], prefixindex = self.modeprefixes.indexOf(mode);
                    if (-1 !== prefixindex) {
                        var nick = mo[2], prefixchar = self.prefixes.charAt(prefixindex), nc = self.tracker.getOrCreateNickOnChannel(nick, channel), oped = direction === OPED;
                        prefixchar = oped ? util.addPrefix(nc, prefixchar, self.prefixes) : util.removePrefix(nc, prefixchar), 
                        self.trigger("mode", {
                            added: oped,
                            prefix: prefixchar,
                            message: prefixchar,
                            nick: nick,
                            channel: channel,
                            thisclient: nick === self.nickname,
                            nickchan: nc
                        });
                    }
                }), self.updateNickList(channel);
            },
            channelCTCP: function(user, channel, type, args) {
                args || (args = "");
                var nick = util.hostToNick(user);
                "ACTION" == type ? (this.tracker.updateLastSpoke(nick, channel, Date.now()), this.trigger("chanAction", {
                    user: user,
                    nick: nick,
                    channel: channel,
                    message: args,
                    "@": this.getNickStatus(channel, nick)
                })) : this.trigger("chanCTCP", {
                    user: user,
                    message: args,
                    channel: channel,
                    data: type,
                    args: args,
                    "@": this.getNickStatus(channel, nick)
                });
            },
            userCTCP: function(user, type, args) {
                var nick = util.hostToNick(user), host = util.hostToHost(user);
                args = args || "", "ACTION" == type ? (this.newQueryWindow(nick, !0), this.trigger("privAction", {
                    nick: nick,
                    host: host,
                    message: args,
                    data: type,
                    user: user
                })) : this.trigger("privCTCP", {
                    user: user,
                    nick: nick,
                    type: type,
                    message: args,
                    data: type,
                    host: host
                });
            },
            userCTCPReply: function(user, type, args) {
                var nick = util.hostToNick(user), host = util.hostToHost(user);
                args || (args = ""), this.trigger("ctcpReply", {
                    user: user,
                    nick: nick,
                    host: host,
                    _type: type,
                    args: args
                });
            },
            serverNotice: function(user, message) {
                var data = {
                    user: user,
                    nick: util.hostToNick(user),
                    message: message,
                    channel: STATUS
                };
                this.trigger("serverNotice", data);
            },
            getNickStatus: function(channel, nick) {
                var nickchan = this.tracker.getNickOnChannel(nick, channel);
                return $defined(nickchan) && 0 !== nickchan.prefixes.length ? nickchan.prefixes.charAt(0) : "";
            },
            storeChannels: function(channels) {
                var store = _.uniq(channels);
                this.channels = channels, storage.set(cookies.channels, store);
            },
            getChannels: function() {
                var chans = this.channels = storage.get(cookies.channels) || [];
                return chans;
            },
            canJoinChannel: function(chan) {
                if (chan === BROUHAHA) return !0;
                if (this.tracker.getChannel(chan)) return !1;
                var chansets = session.get(chan) || [], currTime = Date.now(), rejoinT = this.options.minRejoinTime, minTime = 1e3 * Math.max.apply(null, rejoinT.slice(0, chansets.length));
                chan = util.formatChannel(chan);
                var broken = chansets.filter(function(time) {
                    return minTime >= currTime - time;
                });
                if (0 === broken.length) {
                    chansets.push(currTime);
                    var n = (chansets.length - rejoinT.length).limit(0, chansets.length);
                    session.set(chan, chansets.slice(n));
                } else {
                    var maxTime = Math.max.apply(null, chansets.map(function(time) {
                        return ((minTime - (currTime - time)) / 1e3).round(1);
                    }));
                    this.writeMessages(lang.waitToJoin, {
                        channel: chan,
                        time: maxTime
                    });
                }
                return 0 === broken.length;
            },
            isNetworkService: function(x) {
                return this.options.networkServices.contains(x);
            },
            __joinInvited: function() {
                this.exec("/JOIN " + this.inviteChanList.join(",")), this.inviteChanList = [], delete this.activeTimers.serviceInvite;
            },
            channelNames: function(channel, names) {
                if (0 === names.length) return this.updateNickList(channel), void 0;
                var getPrefixes = util.prefixOnNick(this.prefixes);
                _.each(names, function(prenick) {
                    var prefixNick = getPrefixes(prenick), prefixes = prefixNick[0], nick = prefixNick[1];
                    channel !== BROUHAHA && this.tracker.addNickToChannel(nick, BROUHAHA);
                    var nc = this.tracker.addNickToChannel(nick, channel);
                    _.each(prefixes, function(p) {
                        util.addPrefix(nc, p, this.prefixes);
                    }, this);
                }, this);
            },
            nickOnChanHasPrefix: function(nick, channel, prefix) {
                var entry = this.tracker.getNickOnChannel(nick, channel);
                return $defined(entry) ? entry.prefixes.contains(prefix) : !1;
            },
            nickOnChanHasAtLeastPrefix: function(nick, channel, prefix) {
                var entry = this.tracker.getNickOnChannel(nick, channel);
                if (!$defined(entry)) return !1;
                var pos = this.prefixes.indexOf(prefix);
                if (-1 === pos) return !1;
                var prefixes = this.prefixes.slice(0, pos + 1);
                return _.some(entry.prefixes, function(prefix) {
                    return util.validPrefix(prefixes, prefix);
                });
            },
            supported: function(key, value) {
                if ("PREFIX" == key) {
                    var len = (value.length - 2) / 2;
                    this.modeprefixes = value.substr(1, len), this.prefixes = value.substr(len + 2, len);
                }
                this.parent(key, value);
            },
            awayMessage: function(nick, message) {
                this.trigger("away", {
                    nick: nick,
                    message: message
                });
            },
            whois: function(nick, type, data) {
                var ndata = {
                    n: nick,
                    channel: ACTIVE,
                    msgs: []
                };
                type.toUpperCase();
                var msgs = ndata.msgs;
                switch (type.toLowerCase()) {
                  case "user":
                    msgs.push({
                        type: "WHOISUSER",
                        h: data.ident + "@" + data.hostname
                    }), msgs.push({
                        type: "WHOISREALNAME",
                        m: data.realname
                    });
                    break;

                  case "server":
                    msgs.push({
                        x: data.server,
                        message: data.serverdesc,
                        type: "WHOISSERVER"
                    });
                    break;

                  case "channels":
                    msgs.push({
                        message: data.channels,
                        type: "WHOISCHANNELS"
                    });
                    break;

                  case "account":
                    msgs.push({
                        message: data.account,
                        type: "WHOISACCOUNT"
                    });
                    break;

                  case "away":
                    msgs.push({
                        message: data.away,
                        type: "WHOISAWAY"
                    });
                    break;

                  case "opername":
                    msgs.push({
                        message: data.opername,
                        type: "WHOISOPERNAME"
                    });
                    break;

                  case "actually":
                    msgs.push({
                        message: data.hostname,
                        x: data.ip,
                        type: "WHOISACTUALLY"
                    });
                    break;

                  case "generictext":
                    msgs.push({
                        message: data.text,
                        type: "WHOISGENERICTEXT"
                    });
                    break;

                  default:
                    return !1;
                }
                return this.trigger("whois", ndata), !0;
            },
            serverError: function(message) {
                this.trigger("error", {
                    message: message,
                    type: "GENERICERROR"
                });
            },
            genericError: function(target, message) {
                this.trigger("error", {
                    target: target,
                    channel: target,
                    message: message,
                    type: "GENERICERROR"
                });
            },
            genericQueryError: function(target, message) {
                this.trigger("error", {
                    target: target,
                    channel: target,
                    message: message,
                    type: "GENERICERROR"
                });
            },
            awayStatus: function(state, message) {
                this.trigger("error", {
                    state: state,
                    message: message,
                    type: "GENERICERROR"
                });
            },
            pushLastNick: function(nick) {
                var i = this.lastNicks.indexOf(nick);
                -1 != i && this.lastNicks.splice(i, 1), this.lastNicks.unshift(nick);
            },
            wallops: function(user, text) {
                var nick = util.hostToNick(user), host = util.hostToHost(user);
                this.trigger("wallops", {
                    message: text,
                    nick: nick,
                    host: host
                });
            },
            channelModeIs: function(channel, modes) {
                this.trigger("serverMessage", {
                    channel: channel || ACTIVE,
                    message: modes.join(" "),
                    type: "CHANNELMODEIS"
                });
            },
            channelCreationTime: function(channel, time) {
                this.trigger("serverMessage", {
                    channel: channel || ACTIVE,
                    message: util.IRCDate(new Date(1e3 * time)),
                    type: "CHANNELCREATIONTIME"
                });
            },
            getPopularChannels: function(cb, minUsers) {
                this.hidelistout = !0, this.exec("/list >" + (minUsers || 75)), this.addEvent("listend:once", function() {
                    var chans = _.chain(this.listedChans).clone().sortBy(function(chan) {
                        return -chan.users;
                    }).value();
                    cb(chans), this.hidelistout = !1;
                });
            }
        }), irc.TwistedConnection = new Class({
            Implements: [ Events, Options ],
            Binds: [ "send", "__completeRequest" ],
            options: {
                initialNickname: "ircconnX",
                minTimeout: 45e3,
                maxTimeout: 3e5,
                timeoutIncrement: 1e4,
                initialTimeout: 65e3,
                floodInterval: 200,
                floodMax: 10,
                floodReset: 5e3,
                errorAlert: !0,
                maxRetries: 5,
                password: "",
                serverPassword: null
            },
            initialize: function(options) {
                var self = this;
                self.setOptions(options), self.counter = 0, self.disconnected = !1, self.__floodLastRequest = 0, 
                self.__floodCounter = 0, self.__floodLastFlood = 0, self.__retryAttempts = 0, self.__timeoutId = null, 
                self.__timeout = self.options.initialTimeout, self.__lastActiveRequest = null, self.__activeRequest = null, 
                self.__sendQueue = [], self.__sendQueueActive = !1;
            },
            connect: function() {
                var request, self = this;
                self.cacheAvoidance = util.randHexString(16), request = self.newRequest("n"), request.addEvent("complete", function(stream) {
                    return stream ? stream[0] ? (self.sessionid = stream[1], self.recv(), void 0) : (self.disconnect(), 
                    self.__error(lang.connError, stream), void 0) : (self.disconnected = !0, self.__error(lang.connectionFail), 
                    void 0);
                });
                var postdata = "nick=" + encodeURIComponent(self.options.initialNickname);
                $defined(self.options.serverPassword) && (postdata += "&password=" + encodeURIComponent(self.options.serverPassword)), 
                request.send(postdata);
            },
            disconnect: function() {
                this.disconnected = !0, this.__cancelTimeout(), this.__cancelRequests();
            },
            newRequest: function(url, floodProtection, synchronous) {
                var self = this;
                if (self.disconnected) return null;
                floodProtection && !self.disconnected && self.__isFlooding() && (self.disconnect(), 
                self.__error(lang.uncontrolledFlood));
                var request = new Request.JSON({
                    url: qwebirc.global.dynamicBaseURL + "e/" + url + "?r=" + self.cacheAvoidance + "&t=" + self.counter++,
                    async: !synchronous
                });
                return request.headers = {}, request.addEvent("request", _.partial(irc.TwistedConnection.setXHRHeaders, request.xhr)), 
                Browser.ie && Browser.version < 8 && request.setHeader("If-Modified-Since", "Sat, 1 Jan 2000 00:00:00 GMT"), 
                request;
            },
            recv: function() {
                var self = this, request = self.newRequest("s", !0);
                if ($defined(request)) {
                    self.__activeRequest = request, request.__replaced = !1;
                    var onComplete = function(stream) {
                        return request.__replaced ? (self.__lastActiveRequest = null, stream && self.__processData(stream), 
                        void 0) : (self.__activeRequest = null, self.__cancelTimeout(), stream ? (self.__processData(stream) && self.recv(), 
                        void 0) : (!self.disconnected && self.__checkRetries() && self.recv(), void 0));
                    };
                    request.addEvent("complete", onComplete), self.__scheduleTimeout(), request.send("s=" + self.sessionid);
                }
            },
            send: function(data, synchronous) {
                return this.disconnected ? !1 : (synchronous ? this.__send(data, !1) : (this.__sendQueue.push(data), 
                this.__processSendQueue()), !0);
            },
            __processSendQueue: function() {
                this.__sendQueueActive || 0 === this.__sendQueue.length || (this.sendQueueActive = !0, 
                this.__send(this.__sendQueue.shift(), !0));
            },
            __send: function(data, async) {
                var request = this.newRequest("p", !1, !async);
                null !== request && request.addEvent("complete", _.partial(this.__completeRequest, async)).send("s=" + this.sessionid + "&c=" + encodeURIComponent(data));
            },
            __completeRequest: function(async, stream) {
                return async && (this.__sendQueueActive = !1), stream && stream[0] ? (this.__processSendQueue(), 
                void 0) : (this.__sendQueue = [], this.disconnected || (this.disconnected = !0, 
                this.__error(lang.connError, stream)), !1);
            },
            __isFlooding: function() {
                var t = Date.now(), floodt = t - this.__floodLastRequest;
                return floodt < this.options.floodInterval && (0 !== this.__floodLastFlood && floodt > this.options.floodReset && (this.__floodCounter = 0), 
                this.__floodLastFlood = t, ++this.__floodCounter > this.options.floodMax) ? !0 : (this.__floodLastRequest = t, 
                !1);
            },
            __checkRetries: function() {
                if (++this.__retryAttempts > this.options.maxRetries && !this.disconnected) return this.disconnect(), 
                this.__error(lang.connTimeOut, {
                    retryAttempts: this.__retryAttempts
                }), !1;
                var to = this.__timeout - this.options.timeoutIncrement;
                return to >= this.options.minTimeout && (this.__timeout = to), !0;
            },
            __cancelRequests: function() {
                $defined(this.__lastActiveRequest) && (this.__lastActiveRequest.cancel(), this.__lastActiveRequest = null), 
                $defined(this.__activeRequest) && (this.__activeRequest.cancel(), this.__activeRequest = null);
            },
            __processData: function(o) {
                return 0 == o[0] ? (this.disconnected || (this.disconnected = !0, this.__error(lang.connError, o)), 
                !1) : (this.__retryAttempts = 0, o.each(function(x) {
                    this.fireEvent("recv", [ x ]);
                }, this), !0);
            },
            __scheduleTimeout: function() {
                this.__timeoutId = this.__timeoutEvent.delay(this.__timeout, this);
            },
            __cancelTimeout: function() {
                $defined(this.__timeoutId) && ($clear(this.__timeoutId), this.__timeoutId = null);
            },
            __timeoutEvent: function() {
                if (this.__timeoutId = null, $defined(this.__activeRequest)) {
                    this.__lastActiveRequest && this.__lastActiveRequest.cancel(), this.fireEvent("timeout", {
                        duration: this.__timeout
                    }), this.__activeRequest.__replaced = !0, this.__lastActiveRequest = this.__activeRequest;
                    var to = this.__timeout + this.options.timeoutIncrement;
                    to <= this.options.maxTimeout && (this.__timeout = to), this.recv();
                }
            },
            __error: function(message, context) {
                var msg = context ? util.formatter(message.message, context) : message.message;
                this.fireEvent("error", msg), this.options.errorAlert && alert(msg), console.log("had error:" + msg);
            }
        }), function() {
            irc.TwistedConnection.setXHRHeaders = _.identity;
        }(), irc.IRCTracker = new Class({
            channels: {},
            nicknames: {},
            initialize: function(owner) {
                this.owner = owner;
            },
            toIRCLower: function(value) {
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
                return nickchan ? nickchan[this.toIRCLower(channel)] : void 0;
            },
            addNickToChannel: function(nick, channel) {
                var nc = irc.nickChanEntry(), nickchan = this.getOrCreateNick(nick);
                nickchan[this.toIRCLower(channel)] = nc;
                var chan = this.getOrCreateChannel(channel);
                return chan[nick] = nc, nc;
            },
            removeNick: function(nick) {
                var nickchan = this.getNick(nick);
                nickchan && (_.each(_.keys(nickchan), function(chan) {
                    var lchannel = this.toIRCLower(chan), channel = this.channels[lchannel];
                    delete channel[nick], 0 === _.size(channel) && delete this.channels[lchannel];
                }, this), delete this.nicknames[nick]);
            },
            removeChannel: function(channel) {
                var chan = this.getChannel(channel);
                if (chan) {
                    var lchannel = this.toIRCLower(channel);
                    _.each(_.keys(chan), function(nick) {
                        var nc = this.nicknames[nick];
                        delete nc[lchannel], 0 === _.size(nc) && delete this.nicknames[nick];
                    }, this), delete this.channels[lchannel];
                }
            },
            removeNickFromChannel: function(nick, channel) {
                var lchannel = this.toIRCLower(channel), nickchan = this.getNick(nick), chan = this.getChannel(lchannel);
                nickchan && chan && (delete nickchan[lchannel], delete chan[nick], _.isEmpty(nickchan) && delete this.nicknames[nick], 
                _.isEmpty(chan) && delete this.channels[lchannel]);
            },
            renameNick: function(oldnick, newnick) {
                var nickchans = this.getNick(oldnick);
                nickchans && (_.each(_.keys(nickchans), function(channel) {
                    var lchannel = this.toIRCLower(channel);
                    this.channels[lchannel][newnick] = this.channels[lchannel][oldnick], delete this.channels[lchannel][oldnick];
                }, this), this.nicknames[newnick] = this.nicknames[oldnick], delete this.nicknames[oldnick]);
            },
            updateLastSpoke: function(nick, channel, time) {
                var nc = this.getNickOnChannel(nick, channel);
                $defined(nc) && (nc.lastSpoke = time);
            },
            getSortedByLastSpoke: function(channel) {
                var chan = this.getChannel(channel);
                if (chan) {
                    var sorter = function(key1, key2) {
                        return chan[key2].lastSpoke - chan[key1].lastSpoke;
                    }, sorted = _.keys(chan).sort(sorter).map(function(key) {
                        return chan[key];
                    });
                    return sorted;
                }
            }
        });
    }(), function(engine) {
        function compileAll(source, compiled) {
            return _.each(source, function(item, key) {
                try {
                    compiled[key] = Function.from(item);
                } catch (err) {
                    console.log(err);
                }
            }), compiled;
        }
        var source = {}, compiled = qwebirc.templates || {};
        source.messageLine = "<hr class='lastpos' />", source.topPane = "<div class='toppanel outertabbar'></div>", 
        source.windowsPane = "<div class='windows'></div>", source.nickMenu = "<div class='menu'></div>", 
        source.dropdownhint = "<div class='dropdownhint'>Click the icon for the main menu.</div>", 
        source.tabbar = "<div class='tabbar'></div>", source.tabDetach = "<span class='detach ui-icon ui-icon-newwin' title='" + lang.detachWindow + "'></span>", 
        source.tabAttach = "<span class='attach ui-icon ui-icon-circle-minus'></span>", 
        source.tabClose = "<span class='tab-close ui-icon ui-icon-circle-close' title='" + lang.closeTab + "'></span>", 
        source.loadingPage = "<div class='loading'>" + lang.loadingPage + "</div>", source.verticalDivider = "<div class='ui-icon ui-icon-grip-solid-vertical handle vertical'></div>", 
        source.horizontalDivider = "<div class='ui-icon ui-icon-grip-solid-horizontal handle horizontal'></div>", 
        engine.registerHelper("check", function(checked) {
            return checked ? "checked" : "";
        }), engine.registerHelper("enableDisable", function(x) {
            return x ? lang.DISABLE : lang.ENABLE;
        }), engine.registerHelper("$css", function(prop, def, type, default2) {
            if ("c" === type) {
                var x = new Color(def), c = x.setHue(this.style_hue).setSaturation(x.hsb[1] + this.style_saturation).setBrightness(x.hsb[2] + this.style_brightness);
                return Browser.ie && "255,255,255" == c && (c = "255,255,254"), "rgb(" + c + ")";
            }
            return "comp" === type ? this[prop] ? def : default2 : this[prop] || def;
        }), compileAll(source, compiled), engine.partials = compiled;
    }(Handlebars), ui.WINDOW_ID_MAP = [ {
        id: "privacy",
        keys: [ "privacy policy" ]
    }, {
        id: "embedded",
        keys: [ "add webchat to your site" ]
    }, {
        id: "login",
        keys: [ "connection details" ]
    } ], ui.IWindows = new Class({
        windows: {},
        customWindows: {},
        windowArray: [],
        Window: ui.Window,
        nav: null,
        getWindowIdentifier: function(name) {
            var id = name.toLowerCase(), wid = _.find(qwebirc.ui.WINDOW_ID_MAP, function(val) {
                return val.keys.contains(id);
            });
            return wid && wid.id || id;
        },
        getClientId: function(client) {
            return client === ui.CUSTOM_CLIENT ? ui.CUSTOM_CLIENT : client.id;
        },
        newWindow: function(client, type, name) {
            var win = this.getWindow(client, name);
            if (!$defined(win)) {
                util.windowNeedsInput(type) && this.commandhistory.addChannel(name);
                var wId = this.getWindowIdentifier(name), $wrapper = new Element("div.hidden").inject(this.windowsPanel);
                win = this.windows[this.getClientId(client)][wId] = new this.Window(this, $wrapper, client, type, name, wId), 
                this.windowArray.push(win);
            }
            return win;
        },
        getWindow: function(client, name) {
            _.isString(client) && (name = client);
            var wins = this.windows[this.getClientId(client)] || this.customWindows;
            return _.isObject(wins) ? wins[this.getWindowIdentifier(name)] : void 0;
        },
        getActiveWindow: function() {
            return this.active;
        },
        getActiveIRCWindow: function(client) {
            return this.active && this.active.type != ui.WINDOW.custom ? this.active : this.windows[this.getClientId(client)][this.getWindowIdentifier(STATUS)];
        },
        selectWindow: function(win) {
            return _.isNumber(win) ? win = this.windowArray[win] : _.isString(win) && (win = this.getWindow(win)), 
            win !== this.active && (this.active && this.active.deselect(), win.select(), this.setWindow(win), 
            ui.setTitle(win.name + " - " + this.options.appTitle), this.updateURI()), win;
        },
        updateURI: util.noop,
        setWindow: function(win) {
            (!this.active || win !== this.active && !this.active.closed) && (this.last = this.active), 
            this.active = win;
        },
        __closed: function(win) {
            var winarr = this.windowArray, isActive = win === this.active;
            this.commandhistory.removeChannel(win.name), this.nav.removeTab(win.tab);
            var index = winarr.indexOf(win);
            winarr = this.windowArray.erase(win), delete this.windows[this.getClientId(win.client)][win.identifier], 
            isActive && (delete this.active, this.last ? this.last.select() : _.isEmpty(winarr) || _.nextItem(winarr, index).select());
        },
        nextWindow: function(direction, fromWin) {
            var windows = this.windowArray, win = _.nextItem(windows, windows.indexOf(fromWin || this.active), direction);
            return win && win.select(), win;
        },
        prevWindow: function() {
            this.nextWindow(-1);
        },
        newCustomWindow: function(name, select, type) {
            type = type || ui.WINDOW.custom;
            var win = this.newWindow(ui.CUSTOM_CLIENT, type, name);
            return select && this.selectWindow(win), win;
        },
        addCustomWindow: function(windowName, CustomView, cssClass, options) {
            var wid = this.getWindowIdentifier(windowName);
            if (_.has(this.customWindows, wid)) return this.selectWindow(this.customWindows[wid]);
            var win = this.newCustomWindow(windowName, !0);
            return this.customWindows[wid] = win, win.addEvent("destroy", function() {
                delete this.customWindows[wid];
            }.bind(this)), _.isString(cssClass) && win.lines.addClass(cssClass), options = _.extend({
                element: win.lines
            }, options), new CustomView(options).addEvent("close", win.close), win;
        }
    }), function() {
        function formatChans(data) {
            var chans = data.channels;
            return chans && _.isObject(chans) ? _.keys(chans) : Array.from(chans || data.channel);
        }
        function addClientEvents(client) {
            function formatData(type, _data) {
                var data = _.extend({
                    c: _data.channel || STATUS,
                    n: _data.nick,
                    m: _data.message,
                    h: _data.host,
                    t: type,
                    type: type
                }, _data);
                return data.channel = data.c, ui_.uiOptions2.get("nick_ov_status") || delete data["@"], 
                data;
            }
            function lineParser(type, data) {
                data = formatData(type, data), _.each(formatChans(data), function(channel) {
                    data.channel = data.c = channel;
                    var win = data.c === ACTIVE ? ui_.getActiveWindow() : ui_.getWindow(client, channel);
                    win && (_.isArray(data.message) ? _.each(data.message, function(msg) {
                        data.message = data.m = msg, parser(type, data, win);
                    }) : parser(type, data, win));
                });
            }
            function parser(type, data, win, channel) {
                if (type = data.type || data.t || type, channel = data.channel || STATUS, win.addLine(data.type, data), 
                !util.isBaseWindow(data.channel) && broadcast_re.test(type)) {
                    var data2 = _.clone(data);
                    data2.nick = data2.n = util.isChannel(data.c) ? data.n + data.c : data.n + ">" + data.c, 
                    ui_.windows.brouhaha.addLine(data.type, data2);
                }
            }
            function updateTopic(type, data) {
                ui_.getWindow(client, data.channel).updateTopic(data.topic), data.initial || (data.message = data.topic, 
                lineParser("topic", data));
            }
            function joinPart(type, data) {
                (data.thisclient && "PART" != data.type && "QUIT" != data.type || !ui_.uiOptions2.get("hide_joinparts")) && (data = _.clone(data), 
                data.channels = _.reject(formatChans(data), util.isBaseWindow), lineParser(type, data));
            }
            function partKick(type, data) {
                if (data.thisclient) {
                    var win = ui_.getWindow(client, data.channel);
                    win && win.close();
                } else joinPart(type, data);
            }
            if (!(!client instanceof irc.IRCClient)) {
                var ui_ = this;
                client.addEvents({
                    connect: lineParser,
                    error: lineParser,
                    info: lineParser,
                    "auth:once": function() {
                        ui_.beep(), ui_.showNotice({
                            title: "Successful auth",
                            body: "Successfully authed with server and set your hostmask"
                        });
                    },
                    chanAction: lineParser,
                    chanTopic: updateTopic,
                    chanMessage: lineParser,
                    chanNotice: lineParser,
                    chanCTCP: lineParser,
                    userJoined: function(type, data) {
                        if (data.thisclient) {
                            var win = ui_.newWindow(client, ui.WINDOW.channel, data.channel);
                            data.select && win.select();
                        }
                        joinPart(data.thisclient ? "ourJoin" : "join", data);
                    },
                    openWindow: function(type, data) {
                        var win = ui_.getWindow(data.window);
                        win || (win = data.type === ui.WINDOW.custom ? ui_[data.window]() : ui_.newWindow(client, data.type, data.window)), 
                        win.select();
                    },
                    away: lineParser,
                    part: partKick,
                    quit: partKick,
                    kick: partKick,
                    invite: lineParser,
                    privAction: lineParser,
                    privCTCP: lineParser,
                    ctcpReply: lineParser,
                    userMode: lineParser,
                    nickChange: function(type, data) {
                        ui_.nickChange(data), lineParser(type, data);
                    },
                    privNotice: lineParser,
                    query: function(type, data) {
                        data = formatData(type, data);
                        var win = ui_.newWindow(client, ui.WINDOW.query, data.channel);
                        ui_.uiOptions2.get("auto_open_pm") && ui_.selectWindow(win), $chk(data.message) && parser(type, data, win);
                    },
                    awayStatus: lineParser,
                    mode: function(type, data) {
                        var win = ui_.getWindow(client, data.channel);
                        win && win.updatePrefix(data), lineParser(type, data);
                    },
                    serverMessage: lineParser,
                    serverNotice: lineParser,
                    whois: function(type, data) {
                        _.each(data.msgs, function(msg) {
                            lineParser(type, _.extend({}, data, msg));
                        });
                    },
                    wallops: lineParser,
                    raw: function(type, args) {
                        lineParser(type, args);
                    }
                });
            }
        }
        ui.IIRCClient = new Class({
            Implements: [ ui.IWindows ],
            clients: {},
            clientId: 0,
            newClient: function(client) {
                client.id = this.clientId++;
                var windows = this.windows[client.id] = {};
                this.clients[client.id] = client;
                var win = this.newWindow(client, ui.WINDOW.status, STATUS);
                return this.selectWindow(win), addClientEvents.call(this, client, windows), win;
            },
            logout: function() {
                auth.loggedin && confirm("Log out?") && (_.each(this.clients, function(client) {
                    client.quit(lang.logOut.message);
                }), function() {
                    document.location = qwebirc.global.dynamicBaseURL + "auth?logout=1";
                }.delay(500));
            },
            nickChange: util.noop
        });
        var broadcast_re = /MSG|TOPIC|(CHAN|PRIV)NOTICE/i;
    }(), function() {
        var LoginBox = function(parentElement, callback, initialNickname, initialChannels, networkName) {
            var Base64 = window.Base64, _nick = new Storer(cookies.nickname), _user = new Storer(cookies.username), _pass = new Storer(cookies.password), _auth = new Storer(cookies.auth), nickname = _nick.get() || initialNickname, username = Base64.decode(_user.get()), password = Base64.decode(_pass.get()), eauth = auth.enabled || _auth.get();
            getTemplate("authpage", function(template) {
                var page = Element.from(template({
                    network: networkName,
                    nickname: nickname,
                    username: username,
                    password: password,
                    full: eauth,
                    channels: initialChannels.join()
                })).inject(parentElement), $form = page.getElement("#login"), $nickBox = page.getElement("#nickname"), $usernameBox = page.getElement("#username"), $passwordBox = page.getElement("#password"), $chkAddAuth = page.getElement("#authenticate");
                $chkAddAuth.addEvent("click", function() {
                    $form.getElements('[name="full"]').getParent("div").toggle();
                }), $form.addEvent("submit", function(e) {
                    e.stop();
                    var nickname = $nickBox.val();
                    if (!nickname) return new ui.Alert({
                        text: lang.missingNick,
                        onClose: $nickBox.focus.bind($nickBox)
                    }), void 0;
                    var stripped = qwebirc.global.nicknameValidator.validate(nickname);
                    if (stripped !== nickname) return $nickBox.val(stripped), new ui.Alert({
                        text: lang.invalidNick,
                        onClose: $nickBox.focus.bind($nickBox)
                    }), void 0;
                    var data = {
                        nickname: nickname
                    };
                    if (_nick.set(nickname), $chkAddAuth.val() || auth.enabled) {
                        if (data.username = username = $usernameBox.val(), data.realname = username || "", 
                        data.password = password = $passwordBox.val(), auth.bouncerAuth()) {
                            if (!$chk(password)) return new ui.Alert({
                                text: lang.missingPass,
                                onClose: $passwordBox.focus.bind($passwordBox)
                            }), void 0;
                            data.serverPassword = password;
                        }
                        if (!username || !password) return new ui.Alert({
                            text: lang.missingAuthInfo,
                            onClose: function() {
                                $chk(username) ? $passwordBox.focus() : $usernameBox.focus();
                            }
                        }), void 0;
                        auth.passAuth() && (data.serverPassword = username + " " + password), _user.set(Base64.encode(username)), 
                        _pass.set(Base64.encode(password)), _auth.set(!0), auth.enabled = !0;
                    } else _auth.dispose();
                    parentElement.empty(), auth.loggedin = !0, callback(data);
                }), window === window.top && $nickBox.focus(), ui.Behaviour.apply(page);
            });
        };
        ui.ILogin = new Class({
            Implements: [ Events ],
            LoginBox: LoginBox,
            loginBox: function(initialNickname, initialChannels, autoConnect, autoNick, network) {
                this.postInitialize();
                var self = this, win = this.newCustomWindow(CONNECTION_DETAILS, !0, ui.WINDOW.connect), callback = function(data) {
                    win.close(), self.fireEvent("login", data);
                };
                return this.LoginBox(win.lines, callback, initialNickname, initialChannels, network || this.options.networkName), 
                win;
            }
        });
    }(), ui.IUIOptions = new Class({
        theme: ui.Theme,
        config: function() {
            function setCustomNotice(notices) {
                self.theme.customNotices = _.chain(notices).clone().reject(function(data) {
                    return !(data.msg || "" === data.msg.trim() || data.nick && "" !== data.nick.trim());
                }).map(function(notice) {
                    return {
                        msg: new RegExp(notice.autoescape ? String.escapeRegExp(notice.msg) : notice.msg),
                        beep: notice.beep,
                        flash: notice.flash
                    };
                }).value();
            }
            function setStandardNotice(notices) {
                _.each(self.theme.messageParsers, function(parser) {
                    _.has(notices, parser.id) && _.extend(parser, notices[parser.id]);
                });
            }
            var self = this;
            if (self.uiOptions instanceof config.OptionModel) return this;
            var uiOptions = self.uiOptions = self.uiOptions2 = new config.OptionModel({
                defaults: self.options.uiOptionsArg
            });
            return uiOptions.on({
                "change:style_hue": function() {
                    self.updateStylesheet();
                },
                "change:font_size": self.updateStylesheet,
                "change:custom_notices": setCustomNotice,
                "change:notices": setStandardNotice,
                "change:show_nicklist": function() {
                    _.each(this.windowArray, function(win) {
                        win.toggleNickList();
                    });
                }
            }), setCustomNotice(uiOptions.get("custom_notices")), setStandardNotice(uiOptions.get("notices")), 
            self.setModifiableStylesheet({
                style_hue: self.options.hue || self.uiOptions.get("style_hue"),
                style_saturation: self.options.saturation || self.uiOptions.get("style_saturation"),
                style_brightness: self.options.brightness || self.uiOptions.get("style_brightness")
            }), self;
        },
        setModifiableStylesheet: function(vals) {
            this.__styleSheet = new Element("style", {
                type: "text/css",
                media: "all"
            }).inject(document.head), this.updateStylesheet(vals);
        },
        updateStylesheet: function(values) {
            var self = this;
            getTemplate("modifiablecss", function(template) {
                var styles = _.extend({}, Browser, self.uiOptions.toJSON(), values), stylesheet = template(styles), node = self.__styleSheet;
                node.styleSheet ? node.styleSheet.cssText = stylesheet : node.empty().appendText(stylesheet);
            });
        }
    }), function() {
        var favIcons = {};
        document.store("favicon", favIcons), document.addEvent("domready", function() {
            var favIcon = $(document.head).getElement("link[rel^='shortcut'][rel$='icon']");
            favIcon && (favIcons.normal = favIcon, favIcons.empty = new Element("link", {
                rel: "shortcut icon",
                type: "image/x-icon",
                href: "images/empty_favicon.ico"
            }));
        }), ui.INotifiers = new Class({
            Implements: [ ui.IUIOptions ],
            options: {
                notificationOptions: {
                    icon: "images/qwebircsmall.png",
                    title: "IRC Alert",
                    body: "New notification!"
                },
                sounds: {
                    minSoundRepeatInterval: 1e3,
                    sounds: [ {
                        id: "beep",
                        url: [ "beep3.ogg", "beep3.mp3" ]
                    } ]
                }
            },
            _notices: [],
            canFlash: !1,
            lastSound: 0,
            titleText: document.title,
            beep: function() {
                this.playSound("beep");
            },
            playSound: function(alias) {
                this.soundPlayer ? this.soundPlayer.isReady() && Date.now() - this.lastSound > this.options.sounds.minSoundRepeatInterval && (this.lastSound = Date.now(), 
                this.soundPlayer.play(alias, {
                    volume: this.uiOptions.get("volume")
                })) : (this.soundInit(), this.soundPlayer.addEvent("ready:once", this.playSound.bind(this, alias)));
            },
            soundInit: function() {
                this.soundPlayer instanceof sound.SoundPlayer || (this.soundPlayer = new sound.SoundPlayer(this.options.sounds));
            },
            flash: function(force) {
                var self = this;
                if ((force || !document.hasFocus()) && self.canFlash && !self.flashing) {
                    self.titleText = document.title;
                    var flash = function() {
                        var vis = self.toggleFavIcon();
                        ui.setTitle(vis ? self.titleText : lang.activityNotice.message);
                    };
                    self.flashing = !0, self.__flasher = _.periodical(flash, 750), window.addEvents({
                        "mousedown:once": self.cancelFlash,
                        "keydown:once": self.cancelFlash,
                        "focus:once": self.cancelFlash
                    });
                }
            },
            showNotice: function(options, force) {
                var self = this;
                if ((force || !document.hasFocus()) && self.uiOptions.get("dn_state")) {
                    var opts = _.extend({}, self.options.notificationOptions, options), notice = notify.createNotification(opts.title, opts), timer = _.delay(notice.close, self.uiOptions.get("dn_duration"), notice);
                    self._notices.push({
                        waiter: timer,
                        close: notice.close
                    });
                }
            },
            cancelFlash: function() {
                this.flashing = !1, this.__flasher && (clearInterval(this.__flasher), this.__flasher = null), 
                this._notices.each(function(notice) {
                    clearTimeout(notice.waiter), notice.close();
                }).empty(), this.toggleFavIcon(!0), ui.setTitle(this.titleText);
            },
            toggleFavIcon: function(state) {
                var isNormalVis = !!favIcons.normal.getParent(), vis = _.isBoolean(state) ? state : !isNormalVis;
                return vis && !isNormalVis ? favIcons.normal.replaces(favIcons.empty) : !vis && isNormalVis && favIcons.empty.replaces(favIcons.normal), 
                vis;
            }
        });
    }(), ui.StandardUI = new Class({
        Implements: [ Options, ui.IIRCClient, ui.IWindows, ui.ILogin, ui.IUIOptions, ui.INotifiers ],
        Binds: [ "urlDispatcher", "whoisURL", "updateStylesheet", "nextWindow", "prevWindow", "optionsWindow", "faqWindow", "privacyWindow", "aboutWindow", "feedbackWindow", "embeddedWindow" ],
        options: {
            routerPrefix: "!"
        },
        initialize: function(parentElement, theme, uiName, options) {
            var self = this.setOptions(options);
            self.theme = theme, self.config(), self.element = self.parentElement = parentElement.addClasses("qwebirc", "qwebirc-" + uiName), 
            self.commandhistory = new irc.CommandHistory(), self.windows[ui.CUSTOM_CLIENT] = this.customWindows, 
            getTemplate("topPane", function(template) {
                self.outerTabs = Element.from(template()).inject(parentElement);
            }), getTemplate("windowsPane", function(template) {
                self.windowsPanel = Element.from(template()).inject(parentElement);
            });
        },
        postInitialize: function() {
            var self = this, rprefix = self.options.routerPrefix;
            return self.nav = new ui.NavBar({
                element: self.outerTabs,
                menuElement: self.element
            }), self.nav.on({
                selectWindow: function(e, target) {
                    e.stop(), target.retrieve("window").select();
                },
                closeWindow: function(e, target) {
                    e.stop(), target.getParent(".tab").retrieve("window").close();
                },
                nextWindow: self.nextWindow,
                prevWindow: self.prevWindow
            }), self.router = new Epitome.Router({
                routes: {
                    "": "index",
                    "#!options": "options",
                    "#!feedback": "feedback",
                    "#!about": "about",
                    "#!faq": "faq",
                    "#!embedded": "embedded",
                    "#!privacy": "privacy"
                },
                onError: function(error) {
                    console.error(error), this.navigate("");
                },
                onUndefined: function(data) {
                    var request = data.request.startsWith(rprefix) && data.request.slice(rprefix.length);
                    if (request) {
                        var win = _.findWhere(self.windowArray, {
                            identifier: request
                        }) || _.findWhere(self.windowArray, {
                            identifier: util.formatChannel(request)
                        });
                        win && win.select();
                    }
                },
                onIndex: function() {},
                onOptions: self.optionsWindow,
                onFaq: self.faqWindow,
                onPrivacy: self.privacyWindow,
                onAbout: self.aboutWindow,
                onFeedback: self.feedbackWindow,
                onEmbedded: self.embeddedWindow
            }), this;
        },
        updateURI: function() {
            this.router instanceof Epitome.Router && this.active && this.router.navigate(this.options.routerPrefix + util.unformatChannel(this.active.identifier));
        },
        optionsWindow: function() {
            var self = this;
            return self.addCustomWindow("Options", ui.OptionView, "options", {
                model: self.uiOptions2,
                onNoticeTest: function() {
                    self.flash(!0), self.beep(), self.showNotice({}, !0);
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
        },
        urlDispatcher: function(name, window) {
            if ("embedded" == name) return [ "a", this.embeddedWindow ];
            if ("options" == name) return [ "a", this.optionsWindow ];
            if ("whois" === name) {
                var uiOptions2 = this.uiOptions2;
                return [ "span", function(nick) {
                    uiOptions2.QUERY_ON_NICK_CLICK ? window.client.exec("/QUERY " + nick) : (nick = isChannel(nick) ? util.unformatChannel(nick) : nick.search(window.client.nickname + ">") >= 0 ? nick.substr(nick.search(">") + 1, nick.length) : nick.substr(0, nick.search(">")), 
                    window.client.exec("/WHOIS " + nick));
                } ];
            }
            return null;
        },
        whoisURL: function(e, target) {
            var client = target.getParent(".window").retrieve("window").client, nick = target.get("data-user");
            this.uiOptions2.QUERY_ON_NICK_CLICK ? client.exec("/QUERY " + nick) : (isChannel(nick) ? nick = util.unformatChannel(nick) : nick.search(client.nickname + ">") >= 0 && (nick = nick.substr(nick.search(">") + 1, nick.length)), 
            client.exec("/WHOIS " + nick));
        },
        chanURL: function(e, target) {
            var client = target.getParent(".lines").retrieve("client"), chan = target.get("data-chan");
            util.isChannel(chan) && client.exec("/JOIN " + chan);
        }
    }), ui.Interface = new Class({
        Implements: [ Options, Events ],
        options: {
            node: !1,
            debug: !1,
            dynamicBaseURL: "/",
            staticBaseURL: "/",
            searchURL: !0,
            appTitle: "Freenode.net Web IRC",
            networkName: "Freenode",
            networkServices: [],
            initialNickname: "",
            minRejoinTime: [ 5, 20, 300 ],
            hue: null,
            saturation: null,
            lightness: null,
            theme: undefined,
            uiOptionsArg: null,
            icons: {
                empty_favicon: "images/empty_favicon.ico",
                menuicon: "images/icon.png"
            },
            loginRegex: /I recogni[sz]e you\./,
            nickValidation: null
        },
        clients: [],
        initialize: function(element, UI, options) {
            this.setOptions(options);
            var self = this, opts = self.options;
            qwebirc.global = {
                baseURL: opts.dynamicBaseURL,
                staticURL: opts.staticBaseURL,
                nicknameValidator: opts.nickValidation ? new irc.NicknameValidator(opts.nickValidation) : new irc.DummyNicknameValidator()
            }, window.addEvent("domready", function() {
                var inick = opts.initialNickname, ichans = storage.get(cookies.channels) || opts.initialChannels, autoConnect = !1;
                self.element = document.id(element), self.ui = new UI(self.element, new ui.Theme(opts.theme), opts);
                var usingAutoNick = !0;
                //!$defined(nick);//stupid used out of scope
                inick = opts.initialNickname, self.ui.loginBox(inick, ichans, autoConnect, usingAutoNick, opts.networkName), 
                storage.get(cookies.newb) !== !1 && (self.welcome(), storage.set(cookies.newb, !1)), 
                self.ui.addEvent("login:once", function(loginopts) {
                    var ircopts = _.extend(Object.subset(opts, [ "initialChannels", "specialUserActions", "minRejoinTime", "networkServices", "loginRegex", "node" ]), loginopts), client = self.IRCClient = new irc.IRCClient(ircopts, self.ui);
                    client.connect(), window.onbeforeunload = function(e) {
                        if (client.isConnected()) {
                            var message = "This action will close all active IRC connections.";
                            return (e = e || window.event) && (e.returnValue = message), message;
                        }
                    }, window.addEvent("unload", client.quit), window.onunload = client.quit, auth.enabled || self.ui.beep(), 
                    self.fireEvent("login", {
                        IRCClient: client,
                        parent: self
                    });
                });
            });
        },
        welcome: function() {
            ui.WelcomePane.show(this.ui, {
                element: this.element,
                firstvisit: !0
            });
        }
    }), ui.QUI = new Class({
        Extends: ui.StandardUI,
        Binds: [ "__createChannelMenu" ],
        initialize: function(parentElement, theme, options) {
            this.Window = ui.QUI.Window, this.parent(parentElement, theme, "qui", options), 
            parentElement.addClasses("qui", "signed-out"), this.setHotKeys(), this.parentElement.addEvents({
                "click:relay(.lines .hyperlink-whois)": this.whoisURL,
                "click:relay(.lines .hyperlink-channel)": this.chanURL
            });
        },
        postInitialize: function() {
            var self = this.parent();
            return self.nav.on({
                selectTab: function(e, tab) {
                    self.selectTab(tab);
                },
                detachWindow: function(e, target) {
                    e.stop(), target.getParent(".tab").retrieve("window").detach();
                },
                addChannel: self.__createChannelMenu
            }), self;
        },
        selectTab: function(tab) {
            var active = this.active, win = tab.retrieve("window"), isChannel = util.isChannelType(win.type);
            if ((!active || !isChannel || isChannel && active.name !== BROUHAHA) && win.select(), 
            !util.isBaseWindow(win.name) && isChannel) {
                var brouhaha = this.windows.brouhaha;
                brouhaha.currentChannel = win.name, brouhaha.window.getElement(".channel-name").text(win.name), 
                tab.addClass("selected");
            }
            tab.removeClasses("hilight-activity", "hilight-us", "hilight-speech").getSiblings(".selected:not(.detached,.brouhaha)").removeClass("selected");
        },
        selectWindow: function(win) {
            win = this.parent(win), this.selectTab(win.tab);
        },
        newTab: function(win, name) {
            var self = this, isBrouhaha = name === BROUHAHA, $tab = Element.from(templates.ircTab({
                name: isBrouhaha ? "&nbsp;" : name,
                closable: !isBaseWindow(name)
            }));
            return this.nav.addTab($tab), isBrouhaha && ($tab.addClass("brouhaha"), _.delay(function() {
                _.some(self.windowArray, function(otherwin) {
                    return util.isChannelType(otherwin.type) && !util.isBaseWindow(otherwin.name) ? (win.properties.text(otherwin.name), 
                    win.currentChannel = otherwin.name, !0) : void 0;
                });
            }, 1e3)), $tab.store("window", win), $tab;
        },
        hotkeys: {
            keyboard: {
                nextWindow: {
                    keys: "right",
                    description: "",
                    handler: function() {
                        this.scope.nextWindow();
                    }
                },
                prevWindow: {
                    keys: "left",
                    description: "",
                    handler: function() {
                        this.scope.prevWindow();
                    }
                }
            },
            input: {
                bold: {
                    keys: "ctrl+b",
                    description: "",
                    handler: _.partial(util.wrapSelected, ".window:not(.hidden) .input .input-field", util.getStyleByName("bold").bbcode)
                },
                italic: {
                    keys: "ctrl+i",
                    description: "",
                    handler: _.partial(util.wrapSelected, ".window:not(.hidden) .input .input-field", util.getStyleByName("italic").bbcode)
                },
                underline: {
                    keys: "ctrl+u",
                    description: "",
                    handler: _.partial(util.wrapSelected, ".window:not(.hidden) .input .input-field", util.getStyleByName("underline").bbcode)
                },
                colour: {
                    keys: "ctrl+c",
                    description: "",
                    handler: _.partial(util.wrapSelected, ".window:not(.hidden) .input .input-field", util.getStyleByName("colour").bbcode)
                },
                submitInput: {
                    keys: "enter",
                    description: "",
                    handler: function(e) {
                        var $tar = e.target;
                        $tar.hasClass("input-field") && $tar.getParent(".window").retrieve("window").sendInput(e, $tar);
                    }
                }
            }
        },
        setHotKeys: function() {
            function isChar(code) {
                return 32 === code || code > 46 && !(code >= 91 && 123 >= code) && 144 !== code && 145 !== code;
            }
            if (!Browser.isMobile) {
                var self = this, keyboard = this.keyboard = new Keyboard({
                    active: !0
                }).addShortcuts(self.hotkeys.keyboard), inputKeyboard = new Keyboard({
                    active: !1
                }).addShortcuts(self.hotkeys.input);
                keyboard.scope = self, document.addEvents({
                    "blur:relay(input)": function() {
                        keyboard.activate();
                    },
                    "focus:relay(input)": function() {
                        inputKeyboard.activate();
                    },
                    keydown: function(e) {
                        keyboard.isActive() && (e.alt && !isNaN(e.key) && e.key <= self.windowArray.length ? self.selectWindow(e.key - 1) : !self.active.$input || e.alt || e.control || e.meta || !isChar(e.code) || self.active.$input.focus());
                    }
                });
            }
        },
        __createChannelMenu: function(e) {
            e && e.stop();
            var self = this, client = self.getActiveIRCWindow().client, $btn = self.outerTabs.getElement(".add-chan"), $oldmen = self.parentElement.getElement(".chanmenu.dropdownmenu");
            $oldmen = $oldmen && $oldmen.getParent(), !$oldmen || Date.now() - $btn.retrieve("time") > 6e4 ? client.getPopularChannels(function(chans) {
                chans = _.chain(chans).take(self.options.maxChansMenu || 10).map(function(chan) {
                    return {
                        text: chan.channel,
                        value: chan.channel,
                        hint: chan.users
                    };
                }).value();
                var $menu = Element.from(templates.chanmenu({
                    channels: chans
                })), wrapper = new Element("div").inject(self.parentElement).adopt($menu);
                ui.decorateDropdown($btn, wrapper), wrapper.addEvent("click:relay(a)", function(e, target) {
                    var chan = target.get("data-value");
                    client.exec("/JOIN " + chan);
                }), $btn.store("time", Date.now());
            }) : $oldmen.isDisplayed() || ($oldmen.retrieve("toggle")(), $oldmen.position({
                relativeTo: $btn,
                position: {
                    x: "left",
                    y: "bottom"
                },
                edge: {
                    x: "left",
                    y: "top"
                }
            }));
        },
        newClient: function(client) {
            this.parentElement.swapClass("signed-out", "signed-in");
            var status = this.parent(client);
            return this.windows.brouhaha = this.newWindow(client, ui.WINDOW.channel, BROUHAHA), 
            status;
        },
        setWindow: function(win) {
            this.parent(win), win.element.getSiblings(".active:not(.detached)").hide().removeClass("active"), 
            win.element.show().addClass("active");
        },
        nickChange: function(data) {
            data.thisclient && _.each(this.windows, function(win) {
                win.$nicklabel.set("text", data.newnick);
            });
        }
    }), ui.NavBar = new Class({
        Extends: Epitome.View,
        Binds: [ "adjust" ],
        options: {
            template: util.loadTemplate("navbar"),
            events: {
                "click:relay(.tabbar .tab)": "selectTab",
                "dblclick:relay(.tabbar .tab)": "selectWindow",
                "click:relay(.tabbar .tab .tab-close)": "closeWindow",
                "click:relay(.tabbar .tab .detach)": "detachWindow",
                "adopt:relay(.tabbar)": "adjust",
                "disown:relay(.tabbar)": "adjust",
                "mousewheel:relay(.tabbar)": "scrollTabs",
                "click:relay(.main-menu a)": "openMenu",
                "click:relay(.buttons .to-left)": "scrollLeft",
                "click:relay(.buttons .to-right)": "scrollRight",
                "click:relay(.buttons .add-chan)": "addChannel"
            },
            onReady: function() {
                this.render(), window.addEvent("resize", this.adjust);
            },
            onScrollTabs: function(evt) {
                evt.stop(), evt.wheel > 0 ? this.nextWindow() : evt.wheel < 0 && this.prevWindow();
            }
        },
        render: function() {
            Elements.from(this.template({
                lang: lang
            })).filter(Type.isElement).inject(this.element), this.tabs = this.element.getElement(".tabbar"), 
            this.scroller = new Fx.Scroll(this.tabs), this.adjust();
            var self = this, dropdownMenu = Element.from(templates.mainmenu({
                lang: lang
            })).inject(self.options.menuElement), dropdownbtn = this.element.getElement(".main-menu");
            ui.decorateDropdown(dropdownbtn, dropdownMenu, {
                onShow: function() {
                    self.hideHint && self.hideHint(), delete self.hideHint;
                },
                btnlistener: !0,
                autohide: !0
            });
            var dropdownEffect = new Fx.Tween(dropdownbtn, {
                duration: "long",
                property: "opacity",
                link: "chain"
            }), dropdownhint = Element.from(templates.dropdownhint()).inject(this.element).position({
                relativeTo: this.element,
                position: {
                    y: "bottom"
                },
                offset: {
                    y: 10
                }
            });
            dropdownEffect.start(.25).start(1).start(.33).start(1), new Fx.Morph(dropdownhint, {
                duration: "normal",
                transition: Fx.Transitions.Sine.easeOut
            }).start({
                left: [ 900, 5 ]
            }), function() {
                new Fx.Morph(dropdownhint, {
                    duration: "long"
                }).start({
                    left: [ 5, -900 ]
                });
            }.delay(4e3);
            var hider2 = _.once(_.partial(Element.destroy, dropdownhint));
            _.delay(hider2, 4e3), document.addEvents({
                "mousedown:once": hider2,
                "keydown:once": hider2
            });
        },
        adjust: function() {
            var wid = this.tabs.getWidth(), swid = this.tabs.getScrollWidth(), scrollers = this.element.getElements('[name="tabscroll"]');
            swid > wid ? scrollers.show() : scrollers.hide(), util.fillContainer(this.tabs, {
                style: "max-width"
            });
        },
        addTab: function(tab) {
            return _.isString(tab) && (tab = Element.from(tab)), this.tabs.adopt(tab), this;
        },
        removeTab: function(tab) {
            return this.tabs.disown(tab), this;
        },
        scrollLeft: function(e) {
            e.stop();
            var pos = this.tabs.getScrollLeft(), $ele = util.elementAtScrollPos(this.tabs, pos);
            this.scroller.toElement($ele, "x");
        },
        scrollRight: function(e) {
            e.stop();
            var pos = this.tabs.getScrollLeft() + this.tabs.getWidth(), $ele = util.elementAtScrollPos(this.tabs, pos);
            this.scroller.toElementEdge($ele, "x");
        },
        nextWindow: function() {
            this.trigger("nextWindow");
        },
        prevWindow: function() {
            this.trigger("prevWindow");
        },
        destroy: function() {
            return window.removeEvent("resize", this.adjust), this.parent();
        }
    }), ui.MENU_ITEMS = function() {
        function isOpped() {
            var channel = this.name, myNick = this.client.nickname;
            return this.client.nickOnChanHasAtLeastPrefix(myNick, channel, "@");
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
        return [ {
            text: "whois",
            fn: command("whois"),
            predicate: !0
        }, {
            text: "query",
            fn: command("query"),
            predicate: !0
        }, {
            text: "slap",
            fn: function(nick) {
                this.client.exec("/ME " + util.formatter(lang.fishSlap, {
                    nick: nick
                }));
            },
            predicate: !0
        }, {
            text: "kick",
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
        } ];
    }(), function() {
        function checkKeys(fn, keys, type) {
            keys = keys || [];
            var ret = {};
            return ret[type || "keydown"] = function(e) {
                keys.contains(e.key) && fn.apply(this, arguments);
            }, ret;
        }
        ui.Dialog = new Class({
            Extends: Bootstrap.Popup,
            options: {
                popup_template: "popup-dialog",
                template: null,
                persist: !1,
                closeOnEsc: "esc",
                closeOnClickOut: !1,
                focusOnShow: "input[type='text']",
                inputType: "input[type='text'",
                title: lang.alertNotice
            },
            initialize: function(options) {
                var self = this, $par = $(options.parent || document.body), $caller = self.$caller;
                options = self.setOptions(options).options, getTemplate(options.popup_template, function(popuptmpl) {
                    options.template && (options.content = options.template(options));
                    var $pop = Element.from(popuptmpl(options));
                    $par.adopt($pop), self.$caller = $caller, self.parent($pop, options), self.bound.submit = function() {
                        var vals = self.$input.val();
                        self.fireEvent("submit", {
                            value: vals[0],
                            values: vals
                        }), self.hide();
                    }, self.$input = $pop.getElements(options.inputType), $pop.addEvent("click:relay(.submit)", self.bound.submit);
                    var listen = self.$listeners = checkKeys(self.bound.submit, [ "enter" ]);
                    document.addEvents(listen), ui.Behaviour.apply($pop);
                });
            },
            hide: function(evt, clicked) {
                return evt && evt.stopPropagation(), document.removeEvents(this.$listeners), this.parent(evt, clicked);
            }
        }), ui.Alert = new Class({
            Extends: Bootstrap.Popup,
            options: {
                popup_template: "popup-alert",
                persist: !1,
                closeOnKeys: "esc,enter",
                closeOnClickOut: !0,
                focusOnShow: '[data-dismiss="modal"]',
                title: lang.alertNotice,
                text: ""
            },
            initialize: function(options) {
                var self = this, $par = $(options.parent || document.body), $caller = self.$caller;
                if (options = self.setOptions(options).options, !options.text) throw "needs text";
                getTemplate(options.popup_template, function(popuptmpl) {
                    var $pop = Element.from(popuptmpl(options));
                    $par.adopt($pop), self.$caller = $caller, self.parent($pop, options);
                    var listen = self.$listeners = checkKeys(self.bound.hide, [ "enter" ]);
                    document.addEvents(listen), ui.Behaviour.apply($pop);
                });
            },
            hide: function(evt, clicked) {
                return evt && evt.stopPropagation(), document.removeEvents(this.$listeners), this.parent(evt, clicked);
            }
        });
    }(), sound.SoundPlayer = new Class({
        Implements: [ Options, Events ],
        options: {
            soundManagersrc: "//cdn.jsdelivr.net/soundmanager2/2.97a.20130512/soundmanager2-nodebug-jsmin.js",
            soundsurl: "/sound/",
            swfurl: "/swf",
            flashVersion: 8,
            sounds: [],
            preferFlash: !1
        },
        loadingSM: !1,
        initialize: function(options) {
            this.setOptions(options);
            var self = this, opts = this.options;
            window.addEvent("domready", function() {
                if (self.loadingSM === !1) {
                    if (self.loadingSM = !0, $defined(self.sm)) return self.fireEvent("ready"), void 0;
                    var soundinit = function() {
                        var sm = self.sm = window.soundManager;
                        sm.setup({
                            url: opts.swfurl,
                            preferFlash: opts.preferFlash,
                            onready: function() {
                                _.each(opts.sounds, function(sound) {
                                    sound = _.clone(sound), sound.url = _.map(sound.url, function(path) {
                                        return path.contains("/") ? path : opts.soundsurl + path;
                                    }), self.sm.createSound(sound);
                                }), self.loadingSM = !1, self.fireEvent("ready");
                            }
                        }).beginDelayedInit(), self.play = sm.play;
                    };
                    window.soundManager ? soundinit() : Asset.javascript(opts.soundManagersrc, {
                        onLoad: soundinit
                    });
                }
            });
        },
        register: function(alias, src) {
            this.sm.createSound(alias, src);
        },
        isReady: function() {
            return this.sm && this.loadingSM === !1;
        }
    }), ui.Theme = new Class({
        initialize: function(themeDict) {
            var self = this, defaults = _.extend({}, config.ThemeIRCTemplates, themeDict), thememap = _.map(config.ThemeControlCodeMap, function(str) {
                return util.formatSafe(str, config.ThemeControlCodeMap);
            });
            self.__theme = _.map(defaults, function(str) {
                return util.formatSafe(str, thememap);
            }), self.highlightClasses.channels = {};
        },
        formatMessage: function($ele, type, _data, highlight) {
            var self = this, isobj = _.isObject(_data), data = isobj ? _.clone(_data) : _data;
            isobj && (data.n && (data.N = "qwebirc://whois/" + data.n + "/"), _.each([ "N", "m", "c" ], function(key) {
                var val = data[key];
                val && (_.isArray(val) && (val = val.join("")), data[key] = self.urlerize(val));
            }));
            var themed = type ? self.formatText(type, data, highlight) : data, result = self.colourise(themed), $eles = Elements.from(result).filter(function($e) {
                return !Type.isTextNode($e) || "" != $e.nodeValue;
            });
            return $ele.addClass("colourline").adopt($eles), result;
        },
        formatElement: function(line, $ele) {
            var result = this.colourise(this.urlerize(line));
            return $ele.addClass("colourline").adopt(Elements.from(result)), result;
        },
        formatText: function(type, data) {
            return util.formatter(this.__theme[type], data);
        },
        colourise: function(line) {
            var result = line, styles = irc.styles, parseArr = result.split(styles.colour.key).filter($chk), colouredarr = [ [] ];
            return _.each(parseArr, function(str) {
                isNaN(str.slice(0, 2).toInt()) ? colouredarr.push([]) : _.last(colouredarr).push(str);
            }), _.each(colouredarr, function(colourarr) {
                _.each(colourarr, function(str) {
                    var colourMatch = str.match(styles.colour.fore_re), backgroundMatch = str.match(styles.colour.back_re), colour = util.getColourByKey(_.item(colourMatch, 0)), background = util.getColourByKey(_.last(backgroundMatch)), html = templates.ircstyle({
                        colour: colour ? colour.fore : "",
                        background: background ? background.back : "",
                        text: str.slice(backgroundMatch ? backgroundMatch[0].length : colourMatch ? colourMatch[0].length : 0)
                    });
                    result = result.replace(styles.colour.key + str, html);
                });
            }), _.each(styles.special, function(style) {
                result = result.replace(style.keyregex, function(match, text) {
                    return templates.ircstyle({
                        style: style.style,
                        text: text
                    });
                });
            }), result;
        },
        urlerize: function(text) {
            return util.urlifier.parse(text);
        },
        messageParsers: [ {
            type: /NOTICE$/,
            classes: "",
            beep: !0,
            id: "on_notice",
            highlight: ui.HIGHLIGHT.speech
        }, {
            type: /PRIVMSG$/,
            flash: !0,
            beep: !0,
            pm: !0,
            id: "on_pm",
            highlight: ui.HIGHLIGHT.speech
        }, {
            type: /^OUR/,
            classes: "our-msg"
        }, {
            nick: /(^tf2)|((serv|bot)$)/i,
            classes: "bot",
            types: [ ui.WINDOW.channel ]
        }, {
            msg: /^\!/,
            classes: "command",
            types: [ ui.WINDOW.channel ]
        }, {
            mentioned: !0,
            highlight: "mentioned",
            notus: !0,
            tabhl: ui.HIGHLIGHT.us
        }, {
            nick: /^((?!(^tf2|bot$|serv$)).)*$/i,
            mentioned: !0,
            classes: "",
            beep: !0,
            pm: !0,
            notus: !0,
            id: "on_mention"
        }, {
            nick: /(^tf2)|((serv|bot)$)/i,
            msg: /authcookie/i,
            beep: !0,
            pm: !0
        }, {
            nick: /^((?!(^tf2|bot$|serv$)).)*$/i,
            msg: /^((?!(^\!)).)*$/,
            classes: "",
            highlight: !0,
            notus: !0,
            id: "highlighter",
            tabhl: ui.HIGHLIGHT.activity,
            types: [ ui.WINDOW.channel ]
        } ],
        highlightClasses: [ "highlight1", "highlight2" ],
        highlightAndNotice: function(data, type, win, $ele) {
            var self = this, tabHighlight = ui.HIGHLIGHT.none, highlights = self.highlightClasses, notus = !/^OUR/.test(type), parsers = _.clone(self.messageParsers).concat(self.customNotices);
            return data && type && /(NOTICE|ACTION|MSG)$/.test(type) && (data.m && $ele.addClass("message"), 
            _.each(parsers, function(parser) {
                parser.notus && !notus || parser.types && !parser.types.contains(win.type) || parser.type && !parser.type.test(type) || parser.msg && !parser.msg.test(data.m) || parser.nick && !parser.nick.test(data.n) || parser.mentioned && !util.testForNick(win.client.nickname, data.m) || ((!win.active && win.name !== BROUHAHA || !document.hasFocus()) && (parser.flash && win.parentObject.flash(), 
                parser.beep && win.parentObject.beep(), parser.pm && win.parentObject.showNotice({
                    title: "IRC " + type + "!",
                    body: util.format("{nick}({channel}): {message}", data)
                })), parser.highlight && (highlights.channels[win.name] || (highlights.channels[win.name] = 0), 
                $ele.addClass(_.isBoolean(parser.highlight) ? _.nextItem(highlights, highlights.channels[win.name]++) : parser.highlight)), 
                $chk(parser.classes) && $ele.addClass(parser.classes), tabHighlight = Math.max(tabHighlight, parser.tabhl));
            })), tabHighlight;
        }
    }), ui.Window = new Class({
        Extends: Epitome.View,
        options: {
            events: {},
            onReady: function() {
                this.render();
            },
            maxLines: 1e3
        },
        template: util.loadTemplate("window"),
        active: !1,
        lastSelected: null,
        closed: !1,
        highlight: ui.HIGHLIGHT.none,
        lastNickHash: {},
        initialize: function(parentObject, $par, client, type, name, identifier) {
            this.parentObject = parentObject, this.type = type, this.currentChannel = this.name = name, 
            this.client = client, this.identifier = identifier, this.history = this.parentObject.commandhistory, 
            this.parent({
                element: $par
            });
        },
        close: function() {
            return this.closed = !0, this.parentObject.__closed(this), this.destroy(), this;
        },
        select: function() {
            this.active || this.closed || (this.active = !0, this.parentObject.selectWindow(this), 
            this.highlight && this.highlightTab(ui.HIGHLIGHT.none), this.fireEvent("selected"), 
            this.lastSelected = new Date());
        },
        deselect: function() {
            this.active = !1;
        },
        addLine: function(type, data, colour, $ele) {
            var self = this, uiobj = self.parentObject, highlight = this.name !== BROUHAHA ? uiobj.theme.highlightAndNotice(data, type, self, $ele) : ui.HIGHLIGHT.none, hl_line = !1;
            self.active || highlight === ui.HIGHLIGHT.none || self.highlightTab(highlight);
            var tsE = templates.timestamp({
                time: util.IRCTimestamp(new Date())
            });
            $ele.insertAdjacentHTML("afterbegin", tsE), uiobj.theme.formatMessage($ele, type, data, hl_line), 
            self.lines.adopt($ele).maxChildren(this.options.maxLines), uiobj.uiOptions.get("lastpos_line") && type.endsWith("CHANMSG") && (this.lastLine = (this.lastLine || Element.from(templates.messageLine())).inject(this.lines));
        },
        errorMessage: function(message) {
            this.addLine("", message, "warn");
        },
        infoMessage: function(message) {
            this.addLine("", message, "info");
        },
        highlightTab: function(state) {
            (state == ui.HIGHLIGHT.none || state >= this.highlight) && (this.highlight = state);
        },
        sendInput: function(e) {
            e && e.stop();
            var $tar = this.$input, unparsed = $tar.val(), parsed = util.inputParser.parse(unparsed);
            "" !== parsed && (this.history.addLine(this.name, unparsed || parsed), this.client.exec(parsed, this.currentChannel), 
            $tar.val("")), $tar.blur();
        }
    }), ui.QUI.Window = new Class({
        Extends: ui.Window,
        Binds: [ "close" ],
        options: {
            events: {
                "click:relay(.input .send)": "sendInput",
                "dblclick:relay(.input .nickname)": "setNickname",
                "dblclick:relay(.topic)": "editTopic",
                "click:relay(.nicklist .user .nick)": "nickClick",
                "click:relay(.nicklist .menu span)": "menuClick",
                "click:relay(.detached-window .attach)": "attach",
                "click:relay(.detached-window .close)": "close",
                "click:relay(.detached-window)": "setActive"
            }
        },
        events: {
            client: {}
        },
        detached: !1,
        initialize: function(parentObject, $par, client, type, name) {
            var self = this;
            self.parent.apply(self, arguments), self.tab = parentObject.newTab(self, name), 
            self.nicksColoured = self.parentObject.uiOptions2.get("nick_colours");
        },
        render: function() {
            var self = this, type = self.type, hasInput = util.windowNeedsInput(type);
            self.element.empty().html(self.template({
                mobile: Browser.isMobile,
                isChannel: util.isChannelType(self.type),
                channel: self.name,
                name: self.name,
                id: self.name.clean().replace(" ", "-"),
                topic: !1,
                needsInput: hasInput,
                nick: self.client ? self.client.nickname : ""
            }));
            var $win = self.window = self.element.getElement(".window").store("window", self), $content = self.content = $win.getElement(".content"), lines = self.lines = $content.getElement(".lines");
            return lines.store("window", self), type !== ui.WINDOW.custom && type !== ui.WINDOW.connect && ($win.addClass("ircwindow"), 
            self.fxscroll = new Fx.AutoScroll(lines)), type === ui.WINDOW.channel && ($win.addClass("channel"), 
            self.toggleNickList(), self.updateTopic("")), hasInput && (self.$input = $win.getElement(".input .input-field")), 
            self;
        },
        close: function(e) {
            if (e && e.stop(), !this.closed) {
                if (isChannelType(this.type) && !util.isBaseWindow(this.name)) {
                    var client = this.client, channels = util.removeChannel(client.channels, this.name);
                    client.exec("/PART " + this.name), client.storeChannels(channels);
                }
                return this.client instanceof irc.IRCClient && this.client.removeEvents(this.events.client), 
                this.fxscroll && this.fxscroll.stop(), this.resizable && this.resizable.detach().stop(), 
                this.drag && this.drag.detach().stop(), this.completer && this.completer.detach(), 
                this.parent();
            }
        },
        attach: function() {
            var win = this.window, wrapper = this.wrapper;
            this.parentObject, this.detached = !1, this.element.removeClass("detached"), win.replaces(wrapper), 
            wrapper.destroy(), this.drag.detach().stop(), this.resizable.detach().stop(), this.wrapper = this.resizable = this.drag = null, 
            this.tab.show().removeClass("detached"), this.select(), this.fireEvent("attached");
        },
        detach: function() {
            var self = this, win = self.window, po = self.parentObject, wrapper = self.wrapper = Element.from(templates.detachedWindow({
                channel: this.name,
                base: util.isBaseWindow(this.name)
            })), resizeHandle = (wrapper.getElement(".header"), wrapper.getElement(".resize-handle"));
            self.element.addClass("detached"), self.active && po.nextWindow(1, self);
            var size = util.percentToPixel({
                x: 40,
                y: 60
            }, win.getParent("qwebirc"));
            wrapper.setStyles({
                width: size.x,
                height: size.y
            }).replaces(win), win.show().addEvent("mousedown", function(e) {
                var tag = e.target.tagName.toLowerCase();
                "div" != tag && "form" != tag && e.stopPropagation();
            }).replaces(wrapper.getElement(".content")), self.setActive(), self.resizable = wrapper.makeResizable({
                limit: {
                    x: [ 400, null ],
                    y: [ 200, null ]
                },
                handle: resizeHandle,
                stopPropagation: !0
            }), self.drag = wrapper.makeDraggable({
                handle: wrapper,
                includeMargins: !0
            }), self._selectUpdates(), wrapper.position(), self.detached = !0, self.active = !1, 
            self.tab.hide().addClass("detached"), self.fireEvent("detached");
        },
        setActive: function() {
            this.detached ? this.element.addClass("active").getSiblings(".detached").removeClass("active") : this.select();
        },
        select: function() {
            this.active || this.closed || (this.parent(), this.tab.addClass("selected"), this._selectUpdates(), 
            this.fireEvent("selected"));
        },
        _selectUpdates: function() {
            var self = this, parentObject = self.parentObject;
            if (self.nicklist && !self.split && _.delay(function() {
                self.split = new Drag.SplitPane(self.window.getElement(".content .handle"), {
                    limits: {
                        min: 0,
                        max: 0
                    }
                });
            }, 50), self.fxscroll && self.fxscroll.autoScroll(), Browser.isDecent && !self.completer && util.windowNeedsInput(self.type) && (self.completer = new Completer(self.window.getElement(".input .tt-ahead"), self.history.get(self.name))), 
            util.isChannelType(self.type)) {
                var colour = parentObject.uiOptions2.get("nick_colours");
                if (self.nicksColoured !== colour) {
                    self.nicksColoured = colour;
                    var nodes = self.nicklist.childNodes;
                    colour ? _.each(nodes, function(node) {
                        var colour = util.toHSBColour(node.retrieve("nick"), self.client);
                        $defined(colour) && node.firstChild.setStyle("color", colour.rgbToHex());
                    }) : _.each(nodes, function(node) {
                        node.firstChild.setStyle("color", null);
                    });
                }
                _.delay(self.updatePrefix, 200, self);
            }
        },
        deselect: function() {
            this.tab.removeClass("selected"), this.parent();
        },
        editTopic: function() {
            var self = this;
            self.client.nickOnChanHasPrefix(self.client.nickname, self.name, "@") ? new ui.Dialog({
                title: "Set Topic",
                text: util.format(lang.changeTopicConfirm.message, {
                    channel: self.name
                }),
                value: self.topic,
                onSubmit: function(data) {
                    var topic = data.value;
                    _.isString(topic) && self.client.exec("/TOPIC " + topic);
                }
            }) : new ui.Alert({
                text: lang.needOp.message
            });
        },
        setNickname: function() {
            var self = this;
            new ui.Dialog({
                title: "Set nickname",
                text: "Enter a new nickname",
                value: self.nickname,
                onSubmit: function(data) {
                    var nick = qwebirc.global.nicknameValidator.validate(data.value);
                    nick && self.client.exec("/nick " + nick);
                }
            });
        },
        updatePrefix: function(data) {
            if (!data || data.thisclient && data.channel === this.name) {
                var prefix = data ? data.prefix : this.client.getNickStatus(this.name, this.client.nickname);
                this.window.getElement(".input .nickname .status").removeClasses("op", "voice").addClass(prefix === OPSTATUS ? "op" : prefix === VOICESTATUS ? "voice" : ""), 
                this.completer && this.completer.update();
            }
        },
        nickClick: function(evt, $tar) {
            var $par = $tar.getParent(".user").toggleClass("selected"), $menu = $par.getElement(".menu"), self = this;
            this.removePrevMenu($par), $menu ? $menu.toggle() : ($menu = Element.from(templates.nickMenu()).inject($par), 
            _.each(ui.MENU_ITEMS, function(item) {
                (_.isFunction(item.predicate) ? item.predicate.call(self, $par.retrieve("nick")) : !!item.predicate) && Element.from(templates.nickmenubtn(item)).store("action", item.fn).inject($menu);
            }));
        },
        menuClick: function(e, target) {
            e.stop();
            var fn = target.retrieve("action"), selected = target.getParent(".user");
            fn.call(this, selected.retrieve("nick")), this.removePrevMenu();
        },
        removePrevMenu: function($tar) {
            var $sel = $tar ? $tar.getSiblings(".selected") : this.nicklist.getElements(".selected");
            $sel.removeClass("selected").getElement(".menu").each(Element.dispose);
        },
        updateTopic: function(topic) {
            var $topic = this.window.getElement(".topic").empty();
            if (this.topic = topic, topic) {
                var $top = Element.from(templates.topicText({
                    empty: !1
                })).inject($topic);
                this.parentObject.theme.formatElement(topic, $top.getElement("span"));
            } else $topic.html(templates.topicText({
                topic: lang.noTopic.message,
                empty: !0
            }));
        },
        addLine: function(type, data, colourClass) {
            var $msg = Element.from(templates.ircMessage({
                type: type.hyphenate()
            }));
            colourClass && $msg.addClass(colourClass), data.colourClass && $msg.addClass(data.colourClass), 
            this.parent(type.toUpperCase(), data, colourClass, $msg);
        },
        highlightTab: function(state) {
            if (state != this.highlight) {
                switch (this.tab.removeClasses("hilight-activity", "hilight-us", "hilight-speech"), 
                state) {
                  case ui.HIGHLIGHT.us:
                    this.tab.addClass("hilight-us");
                    break;

                  case ui.HIGHLIGHT.speech:
                    this.tab.addClass("hilight-speech");
                    break;

                  case ui.HIGHLIGHT.activity:
                    this.tab.addClass("hilight-activity");
                }
                this.parent(state);
            }
        },
        getNickList: function() {
            return !this.nicklist && this.parentObject.uiOptions.get("show_nicklist") && (this.nicklist = this.window.getElement(".rightpanel").addClass("nicklist")), 
            this.nicklist;
        },
        toggleNickList: function(state) {
            if (this.type === ui.WINDOW.channel) {
                state = null != state ? !!state : this.parentObject.uiOptions.get("show_nicklist");
                var nicklist = this.getNickList();
                nicklist && nicklist.toggle(state) && this.window.toggleClass("show-nicklist", state);
            }
        },
        updateNickList: function(nicks) {
            var self = this;
            if (!self.nicklist) return !1;
            var lnh = self.lastNickHash, oldnames = _.keys(lnh), added = _.difference(nicks, oldnames), left = _.difference(oldnames, nicks);
            _.each(left, function(nick) {
                var element = lnh[nick];
                self.nickListRemove(nick, element), delete lnh[nick];
            }), _.each(added, function(nick) {
                var index = nicks.indexOf(nick);
                lnh[nick] = self.nickListAdd(nick, index) || 1;
            });
        },
        nickListAdd: function(nick, position) {
            var realNick = util.stripPrefix(this.client.prefixes, nick), nickele = Element.from(templates.nickbtn({
                nick: nick
            })), span = nickele.getElement("span");
            if (nickele.store("nick", realNick), this.parentObject.uiOptions2.get("nick_colours")) {
                var colour = util.toHSBColour(realNick, this.client);
                $defined(colour) && span.setStyle("color", colour.rgbToHex());
            }
            return this.nicklist.insertAt(nickele, position), nickele;
        },
        nickListRemove: function(nick, stored) {
            try {
                this.nicklist.removeChild(stored);
            } catch (e) {}
        }
    }), function() {
        function toggleNotifications(model, state, save) {
            notify.permissionLevel() !== notify.PERMISSION_GRANTED ? notify.requestPermission(function() {
                model.set("dn_state", notify.permissionLevel() === notify.PERMISSION_GRANTED);
            }) : model.set("dn_state", state || !model.get("dn_state")), save && model.save();
        }
        var PanelView = new Class({
            Extends: Epitome.View,
            options: {
                pane: "",
                events: {
                    'click:relay([data-event="close"])': "_close"
                },
                onReady: function() {
                    return this.render();
                }
            },
            getData: function() {
                return this.model && this.model.toJSON() || this.options && this.options.data || {};
            },
            render: function() {
                var self = this.empty(), pane = self.options.pane, $loader = Element.from(templates.loadingPage()).inject(self.element);
                return getTemplate(pane, function(template) {
                    var eles = Elements.from(template(self.getData()));
                    self.element.adopt(eles), $loader.dispose(), self.postRender();
                }), self.parent();
            },
            postRender: function() {
                return ui.Behaviour.apply(this.element), this;
            },
            empty: function() {
                return this.parent(!0);
            },
            _close: function() {
                return this.trigger("close"), this.destroy();
            }
        });
        ui.PrivacyPolicyPane = new Class({
            Extends: PanelView,
            options: {
                pane: "privacypolicy"
            }
        }), ui.AboutPane = new Class({
            Extends: PanelView,
            options: {
                pane: "about",
                data: {
                    version: qwebirc.VERSION
                }
            }
        }), ui.FAQPane = new Class({
            Extends: PanelView,
            options: {
                pane: "faq"
            }
        }), ui.FeedbackPane = new Class({
            Extends: PanelView,
            options: {
                pane: "feedback"
            }
        }), ui.OptionView = new Class({
            Extends: PanelView,
            Binds: [ "save", "reset" ],
            options: {
                pane: "options",
                events: {
                    "change:relay(#options input)": "inputChange",
                    "change:relay(#options #standard-notices input)": "snoticeChange",
                    "change:relay(#options #custom-notices input)": "noticeChange",
                    "click:relay(#options #add-notice)": "addNotifier",
                    "click:relay(#options #custom-notices .remove-notice)": "removeNotifier",
                    "click:relay(#options #dn_state)": "dnToggle",
                    "click:relay(#options #notice-test)": "noticeTest"
                },
                onSnoticeChange: function(e, target) {
                    e.stop();
                    var notices = _.clone(this.model.get("notices"));
                    _.assign(notices, target.get("id"), target.val()), this.model.set("notices", notices);
                },
                onAddNotifier: function(e) {
                    e.stop(), this.addNotifier();
                },
                onDnToggle: function(e, target) {
                    toggleNotifications(this.model), target.val(this.model.get("dn_state") ? lang.DISABLE : lang.ENABLE);
                },
                onReady: function() {
                    return this.render();
                }
            },
            inputChange: function(e, target) {
                var id = target.get("id");
                id && $defined(this.model.get(id)) && this.model.set(id, target.val());
            },
            addNotifier: function(data) {
                if (!data) {
                    data = this.model.get("default_notice")();
                    var n = _.clone(this.model.get("custom_notices"));
                    n.push(data), this.model.set("custom_notices", n);
                }
                var parent = this.element.getElement("#custom-notices"), _data = _.clone(data);
                _data.lang = lang;
                var temp = templates.customNotice(_data);
                parent.insertAdjacentHTML("beforeend", temp);
            },
            removeNotifier: function(e, target) {
                e.stop();
                var par = target.getParent(".custom-notice").dispose();
                this.model.set("custom_notices", _.reject(this.model.get("custom_notices"), function(xs) {
                    return xs.id === par.id;
                }));
            },
            noticeChange: function(e, target) {
                e.stop();
                var notices = _.clone(this.model.get("custom_notices")), par = target.getParent(".custom-notice");
                _.findWhere(notices, {
                    id: par.id
                })[target.get("data-id")] = target.val(), this.model.set("custom_notices", notices);
            },
            postRender: function() {
                var model = this.model, options = this.options;
                return _.each(model.get("custom_notices"), function(notice) {
                    notice.lang = lang, this.addNotifier(notice);
                }, this), this.element.getElements(".slider").each(function(slider) {
                    var id = slider.get("id"), knob = slider.getElement(".knob");
                    new Slider(slider, knob, {
                        steps: 36,
                        range: [ 0, 369 ],
                        wheel: !0
                    }).addEvent("change", function(val) {
                        model.set(id, val);
                    }).set(model.get(id));
                }), this.element.getElement("#options").addEvents({
                    submit: this.save,
                    reset: this.reset
                }), _.isFunction(options.getUI) && ui.WelcomePane.show(options.getUI(), {
                    element: this.element
                }), this.parent();
            },
            getData: function() {
                var data = this.model.toJSON();
                return data.lang = lang, data;
            },
            save: function(e) {
                e && e.stop(), this.model.save(), this.destroy();
            },
            reset: function(e) {
                e && e.stop(), this.model.sync(), this.destroy();
            },
            destroy: function() {
                return this.trigger("close"), this.parent();
            }
        }), ui.WelcomePane = new Class({
            Extends: PanelView,
            options: {
                pane: "welcome-pane",
                events: {
                    "click:relay(.enable-notifications)": "enableNotifications",
                    "click:relay(.controls)": "controlClick"
                },
                onEnableNotifications: function() {
                    toggleNotifications(this.ui.uiOptions2, !0, !0);
                },
                onControlClick: function(e, controls) {
                    controls.dispose(), this.element.getElement(".controls") || this._close();
                }
            },
            initialize: function(ui, options) {
                this.ui = ui, this.parent(options);
            },
            getData: function() {
                return {
                    options: this.ui.options,
                    Browser: window.Browser
                };
            }
        }).extend({
            show: function(_ui, options) {
                return options.firstvisit || notify.permissionLevel() !== notify.PERMISSION_GRANTED ? (options.element = new Element("div.welcome").inject(options.element), 
                new ui.WelcomePane(_ui, options)) : !1;
            }
        }), ui.EmbedWizard = new Class({
            Extends: PanelView,
            options: {
                pane: "wizard"
            }
        });
    }();
}.call(this);