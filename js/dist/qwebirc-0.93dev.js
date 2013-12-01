/*!
qwebirc-WebIRC-client ::: Version 0.93.97 :::
Built on 2013-12-01
Description: webirc client - See qwebirc.org
Authors: Graeme Yeates (www.github.com/megawac)
Repository: www.github.com/megawac/qwebirc-enhancements

This project is a fork of qwebirc (www.qwebirc.org) by Chris Porter


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
});

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
    var root = this, previousUnderscore = root._, ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype, getTime = Date.now, push = ArrayProto.push, slice = ArrayProto.slice, concat = ArrayProto.concat, toString = ObjProto.toString, hasOwnProperty = ObjProto.hasOwnProperty, nativeIndexOf = ArrayProto.indexOf, nativeLastIndexOf = ArrayProto.lastIndexOf, nativeBind = FuncProto.bind, _ = function(obj) {
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
        return nativeBind.apply(fn, slice.call(arguments, 1));
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
            previous = options.leading === !1 ? 0 : getTime(), timeout = null, result = func.apply(context, args);
        };
        return function() {
            var now = getTime();
            previous || options.leading !== !1 || (previous = now);
            var remaining = wait - (now - previous);
            return context = this, args = arguments, 0 >= remaining ? (clearTimeout(timeout), 
            timeout = null, previous = now, result = func.apply(context, args)) : timeout || options.trailing === !1 || (timeout = setTimeout(later, remaining)), 
            result;
        };
    }, _.debounce = function(func, wait, immediate) {
        var timeout, args, context, timestamp, result;
        return function() {
            context = this, args = arguments, timestamp = getTime();
            var later = function() {
                var last = getTime() - timestamp;
                wait > last ? timeout = setTimeout(later, wait - last) : (timeout = null, immediate || (result = func.apply(context, args)));
            }, callNow = immediate && !timeout;
            return timeout || (timeout = setTimeout(later, wait)), callNow && (result = func.apply(context, args)), 
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
    }, functional = _.func = {}, slice = Array.prototype.slice;
    Array.prototype.concat, _.each([ "each", "map", "filter", "some", "every", "find", "sortBy", "groupBy", "invoke", "lookup" ], function(name) {
        functional[name] = function(fn, list) {
            return _[name].apply(this, [ list, fn ].concat(slice.call(arguments, 2)));
        };
    }), _.mixin({
        autoCurry: function(fn, numArgs) {
            return numArgs = numArgs || fn.length, function wrapper(prev_args) {
                return function() {
                    var args = prev_args.concat(slice.call(arguments));
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
        clean: function(xs) {
            return _.reject(xs, function(val) {
                return null == val;
            });
        },
        log: function() {
            console.log(arguments);
        },
        nextItem: function(xs, pos, dir) {
            pos = pos || _.size(xs);
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
    var mergeOne = function(source, key, current) {
        switch (typeOf(current)) {
          case "object":
            current.$constructor && "$caller" in current ? source[key] = current : "object" == typeOf(source[key]) ? Object.merge(source[key], current) : source[key] = Object.clone(current);
            break;

          case "array":
            source[key] = current.clone();
            break;

          default:
            source[key] = current;
        }
        return source;
    };
    Object.extend({
        merge: function(source, k, v) {
            if ("string" == typeOf(k)) return mergeOne(source, k, v);
            for (var i = 1, l = arguments.length; l > i; i++) {
                var object = arguments[i];
                for (var key in object) mergeOne(source, key, object[key]);
            }
            return source;
        }
    });
    var strp = String.prototype;
    if ([ "startsWith", "endsWith", "trimLeft", "trimRight" ].each(function(method) {
        try {
            strp[method] && strp[method].protect();
        } catch (o_O) {}
    }), String.implement({
        replaceAll: function(tofind, torep) {
            for (var ns = this; ns.indexOf(tofind) > -1; ) ns = ns.replace(tofind, torep);
            return ns;
        },
        splitMax: function(by, max) {
            max = max || 1;
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
    }), Element.Properties.val = Element.Properties.value = {
        get: function() {
            return this["checkbox" == this.get("type") ? "checked" : "value"];
        },
        set: function(val) {
            this["checkbox" == this.get("type") ? "checked" : "value"] = val;
        }
    }, [ "html", "text", "val" ].each(function(fn) {
        Element.implement(fn, function(data) {
            return "undefined" != typeof data ? this.set(fn, data) : this.get(fn);
        });
    }), _.extend(Element.NativeEvents, {
        adopt: 2,
        disown: 2
    }), Class.refactor(Element, {
        adopt: function() {
            return this.previous.apply(this, arguments).fireEvent("adopt", arguments);
        },
        inject: function(el) {
            var ret = this.previous.apply(this, arguments);
            return el.fireEvent("adopt", [ this ]), ret;
        }
    }).implement({
        disown: function() {
            return Array.each(arguments, function(element) {
                element = document.id(element, !0), element && element.dispose();
            }), this.fireEvent("disown", arguments), this;
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
        if (this.options.autocomplete) {
            var text = this.$input.get("value"), full = "";
            text.length >= this.options.minlen && (full = _.find(this.data, function(txt) {
                return txt.startsWith(text);
            })), this.seth(full || "");
        }
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
            autocomplete: !0,
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
            this.$hint = target.getElement(options.selectors.hint).show(), options.autoPosition && (this.$hint.setStyle("position", "absolute"), 
            this.update.delay(50), window.addEvent("resize", this.update));
        },
        toggleAutocomplete: function(state) {
            this.options.autocomplete = !!state;
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
            this.$input.removeEvents(this.$events), this.$hint.hide(), window.removeEvent("resize", this.update);
        }
    });
}(), window.addEvent("domready", function() {
    "use strict";
    function $filter($e) {
        return 3 !== $e.nodeType || "" !== $e.nodeValue;
    }
    function getChildren($ele) {
        return new Elements($ele.childNodes).filter($filter);
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
}), function() {
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
}, /*!
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
                pattern: /[a-z0-9]{2,}\.[a-z]{2,4}/i,
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
        interval: 100,
        duration: 0,
        threshold: 5,
        wheelStops: !0,
        link: "cancel",
        start: !0
    },
    initialize: function(ele, options) {
        this.parent(ele, options);
        var self = this, opts = self.options;
        self.threshold = this.options.threshold, this.$events = {
            element: {
                adopt: self.updatePosition,
                disown: self.updatePosition
            },
            window: {
                resize: self.updatePosition
            }
        }, this.$events.element.scroll = _.debounce(function() {
            self.toggleScroll();
        }, opts.interval), opts.start && this.start();
    },
    autoScroll: function() {
        return this._scroll = !0, this.updatePosition();
    },
    stopScroll: function() {
        this._scroll = !1;
    },
    toggleScroll: function() {
        this._scroll = !1;
        var $ele = this.element, pxFromBottom = Math.abs($ele.getScrollHeight() - ($ele.getHeight() + $ele.getScrollTop()));
        return pxFromBottom <= this.threshold ? this.autoScroll() : this.stopScroll(), this;
    },
    updatePosition: function(target) {
        var $ele = this.element;
        return this._scroll && Math.abs($ele.getScrollHeight() - $ele.getHeight() - $ele.getScrollTop()) > 2 && (0 === this.options.duration ? this.set($ele.scrollLeft, $ele.scrollHeight) : this.toBottom(), 
        target && (this.threshold = this.options.threshold || target.getHeight())), this;
    },
    start: function() {
        return this.element.addEvents(this.$events.element), window.addEvents(this.$events.window), 
        this.autoScroll();
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
}(), function() {
    for (var method, noop = function() {}, methods = [ "assert", "clear", "count", "debug", "dir", "dirxml", "error", "exception", "group", "groupCollapsed", "groupEnd", "info", "log", "markTimeline", "profile", "profileEnd", "table", "time", "timeEnd", "timeStamp", "trace", "warn" ], length = methods.length, console = window.console = window.console || {}; length--; ) method = methods[length], 
    console[method] || (console[method] = noop);
}(), /*!

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
function(undefined) {
    function isFunction(value) {
        return "function" == typeof value;
    }
    function isArray(value) {
        return value && "object" == typeof value ? "[object Array]" === toString.call(value) : !1;
    }
    function checkRevision(compilerInfo) {
        var compilerRevision = compilerInfo && compilerInfo[0] || 1, currentRevision = Handlebars.COMPILER_REVISION;
        if (compilerRevision !== currentRevision) {
            if (currentRevision > compilerRevision) {
                var runtimeVersions = Handlebars.REVISION_CHANGES[currentRevision], compilerVersions = Handlebars.REVISION_CHANGES[compilerRevision];
                throw "Template was precompiled with an older version of Handlebars than the current runtime. Please update your precompiler to a newer version (" + runtimeVersions + ") or downgrade your runtime to an older version (" + compilerVersions + ").";
            }
            throw "Template was precompiled with a newer version of Handlebars than the current runtime. Please update your runtime to a newer version (" + compilerInfo[1] + ").";
        }
    }
    var Handlebars = {};
    Handlebars.VERSION = "1.0.0", Handlebars.COMPILER_REVISION = 4, Handlebars.REVISION_CHANGES = {
        1: "<= 1.0.rc.2",
        2: "== 1.0.0-rc.3",
        3: "== 1.0.0-rc.4",
        4: ">= 1.0.0"
    }, Handlebars.helpers = {}, Handlebars.partials = {};
    var toString = Object.prototype.toString, objectType = "[object Object]";
    isFunction(/x/) && (isFunction = function(value) {
        return "function" == typeof value && "[object Function]" === toString.call(value);
    }), Handlebars.registerHelper = function(name, fn, inverse) {
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
        var inverse = options.inverse || function() {}, fn = options.fn;
        return isFunction(context) && (context = context.call(this)), context === !0 ? fn(this) : context === !1 || null == context ? inverse(this) : isArray(context) ? context.length > 0 ? Handlebars.helpers.each(context, options) : inverse(this) : fn(context);
    }), Handlebars.createFrame = function(object) {
        var obj = {};
        return Handlebars.Utils.extend(obj, object), obj;
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
        var data, fn = options.fn, inverse = options.inverse, i = 0, ret = "";
        if (isFunction(context) && (context = context.call(this)), options.data && (data = Handlebars.createFrame(options.data)), 
        context && "object" == typeof context) if (isArray(context)) for (var j = context.length; j > i; i++) data && (data.index = i), 
        ret += fn(context[i], {
            data: data
        }); else for (var key in context) context.hasOwnProperty(key) && (data && (data.key = key), 
        ret += fn(context[key], {
            data: data
        }), i++);
        return 0 === i && (ret = inverse(this)), ret;
    }), Handlebars.registerHelper("if", function(conditional, options) {
        return isFunction(conditional) && (conditional = conditional.call(this)), Handlebars.Utils.isEmpty(conditional) ? options.inverse(this) : options.fn(this);
    }), Handlebars.registerHelper("unless", function(conditional, options) {
        return Handlebars.helpers["if"].call(this, conditional, {
            fn: options.inverse,
            inverse: options.fn
        });
    }), Handlebars.registerHelper("with", function(context, options) {
        return isFunction(context) && (context = context.call(this)), Handlebars.Utils.isEmpty(context) ? void 0 : options.fn(context);
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
        return "" + this.string;
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
            return string instanceof Handlebars.SafeString ? string.toString() : string || 0 === string ? (string = "" + string, 
            possible.test(string) ? string.replace(badChars, escapeChar) : string) : "";
        },
        isEmpty: function(value) {
            return value || 0 === value ? isArray(value) && 0 === value.length ? !0 : !1 : !0;
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
                    return param && common && param !== common && (ret = {}, Handlebars.Utils.extend(ret, common), 
                    Handlebars.Utils.extend(ret, param)), ret;
                },
                programWithDepth: Handlebars.VM.programWithDepth,
                noop: Handlebars.VM.noop,
                compilerInfo: null
            };
            return function(context, options) {
                options = options || {};
                var helpers, partials, namespace = options.partial ? options : Handlebars;
                options.partial || (helpers = options.helpers, partials = options.partials);
                var result = templateSpec.call(container, namespace, context, helpers, partials, options.data);
                return options.partial || checkRevision(container.compilerInfo), result;
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
                partial: !0,
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
    }, Handlebars.template = Handlebars.VM.template, "object" == typeof module && module.exports ? module.exports = Handlebars : this.Handlebars = Handlebars;
}.call(this), function(win) {
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
}(window);

var Asset = {
    javascript: function(source, properties) {
        properties || (properties = {});
        var script = new Element("script", {
            src: source,
            type: "text/javascript",
            async: !0
        }), doc = properties.document || document, load = properties.onload || properties.onLoad;
        return delete properties.onload, delete properties.onLoad, delete properties.document, 
        load && (script.addEventListener ? script.addEvent("load", load) : script.addEvent("readystatechange", function() {
            [ "loaded", "complete" ].contains(this.readyState) && load.call(this);
        })), script.set(properties).inject(doc.head);
    }
};

(function() {
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
}).call(this), function() {
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
            clear: function() {
                this.properties.storage.remove(this.options.key);
            },
            destroy: function() {
                return this.clear(), this.parent();
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
}.call(this), this.qwebirc = this.qwebirc || {}, this.qwebirc.templates = this.qwebirc.templates || {}, 
this.qwebirc.templates.modifiablecss = Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
    this.compilerInfo = [ 4, ">= 1.0.0" ], helpers = this.merge(helpers, Handlebars.helpers), 
    data = data || {};
    var buffer = "", escapeExpression = this.escapeExpression;
    return buffer += "#ircui {height: 100%;width: 100%;overflow: hidden;font-family: Verdana, sans-serif;}.qui .hidden, .qui .invisible {display: none;}.channel-name {background-color: rgb(255, 255, 191);border: 1px solid #C8D1DB;border-radius: 4px 4px 4px 4px;color: #000000;cursor: default;font-size: 0.8em;padding: 2px;text-decoration: none;white-space: nowrap;float: left;margin: 1px 0px 0px 1px;font-weight: bold;}.qui .widepanel {width: 100%;}.qui .lines {color: black;overflow: auto;font-size: " + escapeExpression(helpers.$css.call(depth0, "font_size", 12, {
        hash: {},
        data: data
    })) + "px;background: " + escapeExpression(helpers.$css.call(depth0, "lines_background", "f2f0ff", "c", {
        hash: {},
        data: data
    })) + ";}.qui .lines .timestamp {display: " + escapeExpression(helpers.$css.call(depth0, "show_timestamps", "inline", "comp", "none", {
        hash: {},
        data: data
    })) + ';}.qui .lines .nick {margin-right: 4px;}.qui .lines .nick .channel {color: rgb(109, 89, 89);}.qui .ircwindow .lines {font-family: Consolas, "Lucida Console", monospace;text-indent: 10px;padding-left: 1em;word-wrap: break-word;}.qui .lines .highlight1 {background-color: ' + escapeExpression(helpers.$css.call(depth0, "lines_highlight1", "f6ff94", "c", {
        hash: {},
        data: data
    })) + ";}.qui .lines .highlight2 {background-color: " + escapeExpression(helpers.$css.call(depth0, "lines_highlight2", "A4FCCA", "c", {
        hash: {},
        data: data
    })) + ";}.qui .lines .highlight3 {background-color: " + escapeExpression(helpers.$css.call(depth0, "lines_highlight3", "FAC3D5", "c", {
        hash: {},
        data: data
    })) + ";}.qui .lines .mentioned {background-color: " + escapeExpression(helpers.$css.call(depth0, "mentioned_colour", "E63772", "c", {
        hash: {},
        data: data
    })) + " !important;}.qui .properties {background-color: " + escapeExpression(helpers.$css.call(depth0, "menu_background", "f2f0ff", "c", {
        hash: {},
        data: data
    })) + ";border-top: 1px solid " + escapeExpression(helpers.$css.call(depth0, "menu_border", "c8d2dc", "c", {
        hash: {},
        data: data
    })) + ";height: 25px;}.qui .topic .emptytopic {color: gray;}.qui .topic {color: gray;padding-left: 5px;font-size: 0.7em;cursor: default;background-color: " + escapeExpression(helpers.$css.call(depth0, "topic_background", "f2f0ff", "c", {
        hash: {},
        data: data
    })) + ";border-bottom: 1px dashed " + escapeExpression(helpers.$css.call(depth0, "topic_border", "c8d2dc", "c", {
        hash: {},
        data: data
    })) + ";}/*tab stuff*/.qui .outertabbar {border-bottom: 1px solid " + escapeExpression(helpers.$css.call(depth0, "tabbar_border", "c3cee0", "c", {
        hash: {},
        data: data
    })) + ";background: " + escapeExpression(helpers.$css.call(depth0, "tabbar_background", "e2ecf9", "c", {
        hash: {},
        data: data
    })) + ";height: 26px;line-height: 20px;padding: 2px 0;}.qui .outertabbar > * {vertical-align: top;}.qui .tabbar {color: " + escapeExpression(helpers.$css.call(depth0, "tabbar_text", "000000", "c", {
        hash: {},
        data: data
    })) + ";display: inline-block;overflow-x: hidden;margin-left: 10px;font-size: 13px;height: 22px;}.qui .tabbar .tab {padding: 2px;cursor: default;margin-right: 3px;white-space: nowrap;font-weight: bold;color: " + escapeExpression(helpers.$css.call(depth0, "tab_text", "000000", "c", {
        hash: {},
        data: data
    })) + ";border: 1px solid " + escapeExpression(helpers.$css.call(depth0, "tab_border", "c8d2dc", "c", {
        hash: {},
        data: data
    })) + ";border-radius: 4px;-moz-border-radius: 4px;-webkit-border-radius: 4px;}.qui .tabbar .tab:hover {background: " + escapeExpression(helpers.$css.call(depth0, "tab_hover", "ffffff", "c", {
        hash: {},
        data: data
    })) + ";border: 1px solid #c8d2dc;-moz-border-radius: 4px;-webkit-border-radius: 4px;}.qui .tabbar .hilight-activity.tab {color: #009900;}.qui .tabbar .hilight-speech.tab {color: #0000ff;}.qui .tabbar .hilight-us.tab {color: #ff0000;background: rgb(216, 216, 138);}.qui .tabbar .selected.tab {background: " + escapeExpression(helpers.$css.call(depth0, "tab_selected", "ffffff", "c", {
        hash: {},
        data: data
    })) + ";border: 1px solid " + escapeExpression(helpers.$css.call(depth0, "tab_selected_border", "c8d2dc", "c", {
        hash: {},
        data: data
    })) + ";-moz-border-radius: 4px;-webkit-border-radius: 4px;color: " + escapeExpression(helpers.$css.call(depth0, "tab_selected_text", "333333", "c", {
        hash: {},
        data: data
    })) + ";}.qui .buttons {display: none;}.qui.signed-in .buttons {display: inline-block;cursor: pointer;}.buttons span {vertical-align: middle;display: inline-block;}/* tab stuff *//*irc input stuff*/.qui .input {background-color: " + escapeExpression(helpers.$css.call(depth0, "menu_background", "f2f0ff", "c", {
        hash: {},
        data: data
    })) + ";margin: 0;}.qui .input div {border-top: 1px solid " + escapeExpression(helpers.$css.call(depth0, "input_border", "c3cee0", "c", {
        hash: {},
        data: data
    })) + ";padding: 0 5px 1px;margin: 0;width: 100%;}.qui .input div > .input-group-addon {cursor:pointer;cursor:hand;padding: 2px 5px;}.qui .input div > * {height: 24px;}.qui .input .nickname {color: #524F50;font-size: 14px;}.qui .user .status {border-radius: 50%;display: inline-block;margin-right: 3px;}.qui .user .status.voice {width: 8px;height: 8px;background-color: rgb(223, 187, 47);background-image: radial-gradient(45px 45px 45deg, circle, yellow 0%, orange 100%, red 95%);background-image: -moz-radial-gradient(45px 45px 45deg, circle, yellow 0%, orange 100%, red 95%);background-image: -o-radial-gradient(45px 45px 45deg, circle, yellow 0%, orange 100%, red 95%);background-image: -webkit-radial-gradient(45px 45px, circle, yellow, orange);animation-name: spin;animation-duration: 3s;animation-iteration-count: infinite;animation-timing-function: linear;-webkit-animation-name: spin;-webkit-animation-duration: 3s;-webkit-animation-iteration-count: infinite;-webkit-animation-timing-function: linear;-moz-animation-name: spin;-moz-animation-duration: 3s;-moz-animation-iteration-count: infinite;-moz-animation-timing-function: linear;-o-animation-name: spin;-o-animation-duration: 3s;-o-animation-iteration-count: infinite;-o-animation-timing-function: linear;}.qui .user .status.op {width: 8px;height: 8px;background-color: #7AE60E;background-image: radial-gradient(45px 45px 45deg, circle, #5FFF4A 3%, #7AE60E 76%);background-image: -moz-radial-gradient(45px 45px 45deg, circle, #5FFF4A 3%, #7AE60E 76%);background-image: -o-radial-gradient(45px 45px, circle, #5FFF4A 3%, #7AE60E 76%);background-image: -webkit-radial-gradient(45px 45px, circle, #5FFF4A 3%, #7AE60E 76%);animation-name: spin;animation-duration: 3s;animation-iteration-count: infinite;animation-timing-function: linear;-webkit-animation-name: spin;-webkit-animation-duration: 3s;-webkit-animation-iteration-count: infinite;-webkit-animation-timing-function: linear;-moz-animation-name: spin;-moz-animation-duration: 3s;-moz-animation-iteration-count: infinite;-moz-animation-timing-function: linear;-o-animation-name: spin;-o-animation-duration: 3s;-o-animation-iteration-count: infinite;-o-animation-timing-function: linear;}.qui .input .tt-query {border: 1px solid " + escapeExpression(helpers.$css.call(depth0, "input_border", "c3cee0", "c", {
        hash: {},
        data: data
    })) + ";padding: 0;height: 26px;text-indent: 5px;}.qui .input .decorated {background-image: linear-gradient(bottom, rgb(235,235,232) 54%, rgb(247,250,240) 66%);background-image: -o-linear-gradient(bottom, rgb(235,235,232) 54%, rgb(247,250,240) 66%);background-image: -moz-linear-gradient(bottom, rgb(235,235,232) 54%, rgb(247,250,240) 66%);background-image: -webkit-linear-gradient(bottom, rgb(235,235,232) 54%, rgb(247,250,240) 66%);background-image: -ms-linear-gradient(bottom, rgb(235,235,232) 54%, rgb(247,250,240) 66%);background-image: -webkit-gradient(linear,left bottom,left top,color-stop(0.54, rgb(235,235,232)),color-stop(0.66, rgb(247,250,240)));}/*twitter typeahead inspired autocomplete using overlay input box*/.qui .tt-hint {position: absolute;top: 0px;left: 0px;padding: 0;text-indent: 5px;border-color: transparent;box-shadow: none;color: #BDBDBD;}.qui .tt-query {position: relative;vertical-align: top;background-color: transparent;}/*end typeahead*/.qui .input .btn.send {color: grey;padding: 2px 10px;}.qui .nicklist {border-left: 1px solid " + escapeExpression(helpers.$css.call(depth0, "nicklist_border", "c8d2dc", "c", {
        hash: {},
        data: data
    })) + ";width: 140px;overflow: auto;background: " + escapeExpression(helpers.$css.call(depth0, "nicklist_background", "f2f0ff", "c", {
        hash: {},
        data: data
    })) + ";color: " + escapeExpression(helpers.$css.call(depth0, "nicklist_text", "000000", "c", {
        hash: {},
        data: data
    })) + ";font-size: 0.7em;}.qui .nicklist .user, .qui .nick-menu {display: block;color: black;text-decoration: none;cursor: default;border-top: 1px solid " + escapeExpression(helpers.$css.call(depth0, "nicklist_background", "f2f0ff", "c", {
        hash: {},
        data: data
    })) + ";border-bottom: 1px solid " + escapeExpression(helpers.$css.call(depth0, "nicklist_background", "f2f0ff", "c", {
        hash: {},
        data: data
    })) + ";padding-left: 1px;}.qui .nick-menu {width: initial;}.qui .nick-menu ul {margin: 0;padding-left: 20px;list-style-type: circle;}.qui .nick-menu li {cursor:pointer;cursor:hand;}.qui .nicklist .selected {display: block;color: black;background: white;text-decoration: none;border-bottom: " + escapeExpression(helpers.$css.call(depth0, "nicklist_selected_border", "c8d2dc", "c", {
        hash: {},
        data: data
    })) + " 1px solid;cursor: default;}.qui .nicklist .selected-middle {border-top: " + escapeExpression(helpers.$css.call(depth0, "nicklist_selected_border", "c8d2dc", "c", {
        hash: {},
        data: data
    })) + " 1px solid;}.qui .nicklist .menu {margin: 0 0 0 5px;}.qui .nicklist .menu a {border-bottom: 0;border-top: 0;}.hyperlink-whois, .hyperlink-channel {cursor: pointer;cursor: hand;}.hyperlink-whois:hover, .hyperlink-channel:hover {text-decoration: underline;}.qui .outertabbar .dropdown-tab {cursor: pointer; cursor: hand;display: inline-block;padding-left: 4px;width: 30px;}.qui .dropdownmenu {position: absolute;z-index: 100;border: 1px solid " + escapeExpression(helpers.$css.call(depth0, "menu_border", "c8d2dc", "c", {
        hash: {},
        data: data
    })) + ";background: " + escapeExpression(helpers.$css.call(depth0, "menu_background", "f2f0ff", "c", {
        hash: {},
        data: data
    })) + ";list-style: none;padding: 5px 10px;font-size: 0.7em;}.qui .dropdownmenu a {color: black;cursor: pointer;cursor: hand;padding-top: 3px;}.qui .dropdownmenu a:hover {background: " + escapeExpression(helpers.$css.call(depth0, "menu_hover_background", "FFFE", "c", {
        hash: {},
        data: data
    })) + ";}.qui .dropdownhint {position: relative;left: -500px;z-index: 10;white-space: nowrap;font-size: 0.7em;}.qui .chanmenu {width: 150px;}.qui .chanmenu .hint {float: right;font-size: 75%;color: grey;}.qui hr.lastpos {border: none;border-top: 1px solid " + escapeExpression(helpers.$css.call(depth0, "lastpositionbar", "C8D2DC", "c", {
        hash: {},
        data: data
    })) + ";margin: .5em 3em;}.qwebirc-init-channels {font-size: 95%;color: #928D8D;text-align: center;}";
}), this.qwebirc.templates.authpage = Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
    function program1() {
        return "hidden";
    }
    this.compilerInfo = [ 4, ">= 1.0.0" ], helpers = this.merge(helpers, Handlebars.helpers), 
    data = data || {};
    var stack1, stack2, buffer = "", functionType = "function", escapeExpression = this.escapeExpression, self = this;
    return buffer += '<div class="container center"><form id="login"><h2>Connect to ' + escapeExpression((stack1 = depth0.network, 
    typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + ' IRC</h2><div class="control-group right"><label class="control-label" for="nickname">Nickname:<input type="text" class="form-control" data-validate="nick" name="basic" id="nickname" value="' + escapeExpression((stack1 = depth0.nickname, 
    typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '" placeholder="Nickname" required /></label></div><div class="control-group right ', 
    stack2 = helpers.unless.call(depth0, depth0.full, {
        hash: {},
        inverse: self.noop,
        fn: self.program(1, program1, data),
        data: data
    }), (stack2 || 0 === stack2) && (buffer += stack2), buffer += '"><label class="control-label" for="username">' + escapeExpression((stack1 = depth0.network, 
    typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + ' username:<input type="text" class="form-control" data-validate="username" name="full" id="username" value="' + escapeExpression((stack1 = depth0.username, 
    typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '" placeholder="' + escapeExpression((stack1 = depth0.network, 
    typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + ' username"></label></div><div class="control-group right ', 
    stack2 = helpers.unless.call(depth0, depth0.full, {
        hash: {},
        inverse: self.noop,
        fn: self.program(1, program1, data),
        data: data
    }), (stack2 || 0 === stack2) && (buffer += stack2), buffer += '"><label class="control-label" for="password">Password:<input type="password" class="form-control" data-validate="password" name="full" id="password" value="' + escapeExpression((stack1 = depth0.password, 
    typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '"></label></div><div class="authenticate"><label for="authenticate">Authenticate (optional)<input type="checkbox" id="authenticate" ' + escapeExpression(helpers.check.call(depth0, depth0.full, {
        hash: {},
        data: data
    })) + '></label></div><div><input type="submit" value="Connect" class="btn btn-primary btn-smaller" /></div></form><div class="qwebirc-init-channels"><span>' + escapeExpression((stack1 = depth0.channels, 
    typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + "</span></div></div>";
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
    var stack1, stack2, buffer = "", functionType = "function";
    return buffer += "<div class='channel-name'>", stack1 = depth0.channel, stack2 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1, 
    (stack2 || 0 === stack2) && (buffer += stack2), buffer += "</div>";
}), this.qwebirc.templates.customlink = Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
    function program1() {
        return "internal";
    }
    this.compilerInfo = [ 4, ">= 1.0.0" ], helpers = this.merge(helpers, Handlebars.helpers), 
    data = data || {};
    var stack1, buffer = "", self = this, functionType = "function", escapeExpression = this.escapeExpression;
    return buffer += '<a class="', stack1 = helpers["if"].call(depth0, depth0.internal, {
        hash: {},
        inverse: self.noop,
        fn: self.program(1, program1, data),
        data: data
    }), (stack1 || 0 === stack1) && (buffer += stack1), buffer += '" href="' + escapeExpression((stack1 = depth0.val, 
    typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '">' + escapeExpression((stack1 = depth0.val, 
    typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + "</a>";
}), this.qwebirc.templates.detachedWindow = Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
    function program1(depth0, data) {
        var stack1;
        return stack1 = self.invokePartial(partials.tabClose, "tabClose", depth0, helpers, partials, data), 
        stack1 || 0 === stack1 ? stack1 : "";
    }
    this.compilerInfo = [ 4, ">= 1.0.0" ], helpers = this.merge(helpers, Handlebars.helpers), 
    partials = this.merge(partials, Handlebars.partials), data = data || {};
    var stack1, stack2, buffer = "", self = this, functionType = "function", escapeExpression = this.escapeExpression;
    return buffer += "<div class='detached-window'><div class='header'><span class='title'>" + escapeExpression((stack1 = depth0.channel, 
    typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + "</span>", stack2 = helpers.unless.call(depth0, depth0.base, {
        hash: {},
        inverse: self.noop,
        fn: self.program(1, program1, data),
        data: data
    }), (stack2 || 0 === stack2) && (buffer += stack2), stack2 = self.invokePartial(partials.tabAttach, "tabAttach", depth0, helpers, partials, data), 
    (stack2 || 0 === stack2) && (buffer += stack2), buffer += '</div><div class="content"></div><div><span class="resize-handle ui-icon ui-icon-grip-diagonal-se"></span></div></div>';
}), this.qwebirc.templates["failed-validator"] = Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
    this.compilerInfo = [ 4, ">= 1.0.0" ], helpers = this.merge(helpers, Handlebars.helpers), 
    data = data || {};
    var stack1, buffer = "", functionType = "function", escapeExpression = this.escapeExpression;
    return buffer += '<p class="help-block">' + escapeExpression((stack1 = depth0.description, 
    typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + "</p>";
}), this.qwebirc.templates.ircInput = Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
    this.compilerInfo = [ 4, ">= 1.0.0" ], helpers = this.merge(helpers, Handlebars.helpers), 
    data = data || {};
    var stack1, buffer = "", functionType = "function", escapeExpression = this.escapeExpression;
    return buffer += "<form class='input'><div class='tt-ahead input-group'><span class='input-group-addon user'><span class='status " + escapeExpression((stack1 = depth0.status, 
    typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '\'></span><span class="nickname">' + escapeExpression((stack1 = depth0.nick, 
    typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + "</span></span>" + "<input class='tt-hint hidden' type='text' autocomplete='off' spellcheck='off' disabled>" + "<input class='tt-query form-control irc-input decorated' type='text' autocomplete='off' spellcheck='off'><span class='input-group-btn'><button class='btn btn-default send' type='submit'>&gt;</button></span></div></form>";
}), this.qwebirc.templates.ircMessage = Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
    this.compilerInfo = [ 4, ">= 1.0.0" ], helpers = this.merge(helpers, Handlebars.helpers), 
    data = data || {};
    var stack1, buffer = "", functionType = "function", escapeExpression = this.escapeExpression;
    return buffer += '<div class="' + escapeExpression((stack1 = depth0.type, typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '"></div>';
}), this.qwebirc.templates.ircTab = Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
    function program1(depth0, data) {
        var stack1;
        return stack1 = self.invokePartial(partials.tabClose, "tabClose", depth0, helpers, partials, data), 
        stack1 || 0 === stack1 ? stack1 : "";
    }
    this.compilerInfo = [ 4, ">= 1.0.0" ], helpers = this.merge(helpers, Handlebars.helpers), 
    partials = this.merge(partials, Handlebars.partials), data = data || {};
    var stack1, stack2, buffer = "", self = this, functionType = "function";
    return buffer += "<span class='tab'>", stack1 = depth0.name, stack2 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1, 
    (stack2 || 0 === stack2) && (buffer += stack2), buffer += "&nbsp;", stack2 = self.invokePartial(partials.tabDetach, "tabDetach", depth0, helpers, partials, data), 
    (stack2 || 0 === stack2) && (buffer += stack2), stack2 = helpers["if"].call(depth0, depth0.closable, {
        hash: {},
        inverse: self.noop,
        fn: self.program(1, program1, data),
        data: data
    }), (stack2 || 0 === stack2) && (buffer += stack2), buffer += "</span>";
}), this.qwebirc.templates.ircnick = Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
    function program1(depth0) {
        var stack1, stack2;
        return stack1 = depth0.userid, stack2 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1, 
        stack2 || 0 === stack2 ? stack2 : "";
    }
    function program3(depth0) {
        var stack1;
        return escapeExpression((stack1 = depth0.nick, typeof stack1 === functionType ? stack1.apply(depth0) : stack1));
    }
    function program5(depth0) {
        var stack1, buffer = "";
        return buffer += '<span class="channel">' + escapeExpression((stack1 = depth0.linkedchannel, 
        typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + "</span>";
    }
    this.compilerInfo = [ 4, ">= 1.0.0" ], helpers = this.merge(helpers, Handlebars.helpers), 
    data = data || {};
    var stack1, stack2, buffer = "", functionType = "function", escapeExpression = this.escapeExpression, self = this;
    return buffer += '<span class="nick hyperlink-whois" data-user=\'', stack1 = helpers["if"].call(depth0, depth0.userid, {
        hash: {},
        inverse: self.program(3, program3, data),
        fn: self.program(1, program1, data),
        data: data
    }), (stack1 || 0 === stack1) && (buffer += stack1), buffer += "'>&lt;" + escapeExpression((stack1 = depth0.prefix, 
    typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + "<span>" + escapeExpression((stack1 = depth0.nick, 
    typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + "</span>", stack2 = helpers["if"].call(depth0, depth0.linkedchannel, {
        hash: {},
        inverse: self.noop,
        fn: self.program(5, program5, data),
        data: data
    }), (stack2 || 0 === stack2) && (buffer += stack2), buffer += "&gt;</span>";
}), this.qwebirc.templates.ircstyle = Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
    this.compilerInfo = [ 4, ">= 1.0.0" ], helpers = this.merge(helpers, Handlebars.helpers), 
    data = data || {};
    var stack1, stack2, buffer = "", functionType = "function", escapeExpression = this.escapeExpression;
    return buffer += '<span class="' + escapeExpression((stack1 = depth0.background, 
    typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + " " + escapeExpression((stack1 = depth0.colour, 
    typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + " " + escapeExpression((stack1 = depth0.style, 
    typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '">', stack1 = depth0.text, 
    stack2 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1, (stack2 || 0 === stack2) && (buffer += stack2), 
    buffer += "</span>";
}), this.qwebirc.templates.mainmenu = Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
    return this.compilerInfo = [ 4, ">= 1.0.0" ], helpers = this.merge(helpers, Handlebars.helpers), 
    data = data || {}, '<ul class="main-menu dropdownmenu hidden"><a class="internal" href="options"><li><span>Options</span></li></a><a class="internal" href="embedded"><li><span>Add webchat to your site</span></li></a><a class="internal" href="privacy"><li><span>Privacy policy</span></li></a><a class="internal" href="faq"><li><span>Frequently asked questions</span></li></a><a class="internal" href="feedback"><li><span>Submit feedback</span></li></a><a class="internal" href="about"><li><span>About qwebirc</span></li></a></ul>';
}), this.qwebirc.templates.menubtn = Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
    this.compilerInfo = [ 4, ">= 1.0.0" ], helpers = this.merge(helpers, Handlebars.helpers), 
    data = data || {};
    var stack1, buffer = "", functionType = "function", escapeExpression = this.escapeExpression;
    return buffer += "<div class='dropdown-tab'><img src='" + escapeExpression((stack1 = depth0.icon, 
    typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + "' title='menu' alt='menu'></div>";
}), this.qwebirc.templates.menuitem = Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
    function program1(depth0) {
        var stack1, buffer = "";
        return buffer += " data-value='" + escapeExpression((stack1 = depth0.value, typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + "'";
    }
    function program3(depth0) {
        var stack1, buffer = "";
        return buffer += "<span class='hint'>" + escapeExpression((stack1 = depth0.hint, 
        typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + "</span>";
    }
    this.compilerInfo = [ 4, ">= 1.0.0" ], helpers = this.merge(helpers, Handlebars.helpers), 
    data = data || {};
    var stack1, stack2, buffer = "", functionType = "function", escapeExpression = this.escapeExpression, self = this;
    return buffer += "<a", stack1 = helpers["if"].call(depth0, depth0.value, {
        hash: {},
        inverse: self.noop,
        fn: self.program(1, program1, data),
        data: data
    }), (stack1 || 0 === stack1) && (buffer += stack1), buffer += "><li><span>" + escapeExpression((stack1 = depth0.text, 
    typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + "</span>", stack2 = helpers["if"].call(depth0, depth0.hint, {
        hash: {},
        inverse: self.noop,
        fn: self.program(3, program3, data),
        data: data
    }), (stack2 || 0 === stack2) && (buffer += stack2), buffer += "</li></a>";
}), this.qwebirc.templates.message = Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
    this.compilerInfo = [ 4, ">= 1.0.0" ], helpers = this.merge(helpers, Handlebars.helpers), 
    data = data || {};
    var stack1, buffer = "", functionType = "function", escapeExpression = this.escapeExpression;
    return buffer += "<div class='message " + escapeExpression((stack1 = depth0["class"], 
    typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + "'><span>" + escapeExpression((stack1 = depth0.message, 
    typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + "</span></div>";
}), this.qwebirc.templates.navbar = Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
    return this.compilerInfo = [ 4, ">= 1.0.0" ], helpers = this.merge(helpers, Handlebars.helpers), 
    data = data || {}, '<div class="main-menu dropdown-tab"><img src="images/icon.png" title="menu" alt="menu"></div><div class="tabbar"></div><div class="buttons"><span class="to-left ui-icon ui-icon-circle-triangle-w hidden" name="tabscroll"></span><span class="to-right ui-icon ui-icon-circle-triangle-e hidden" name="tabscroll"></span><span class="add-chan ui-icon ui-icon-circle-plus" title="Join a channel"></span></div>';
}), this.qwebirc.templates.nickMenu = Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
    function program1(depth0) {
        var stack1, buffer = "";
        return buffer += "<h5>" + escapeExpression((stack1 = depth0.nick, typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + "</h5>";
    }
    function program3(depth0) {
        var stack1, buffer = "";
        return buffer += '<li data-exec="/QUERY ' + escapeExpression((stack1 = depth0.nick, 
        typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '">query</li>';
    }
    function program5(depth0, data) {
        var stack1;
        return stack1 = helpers.unless.call(depth0, depth0.theyOped, {
            hash: {},
            inverse: self.noop,
            fn: self.program(6, program6, data),
            data: data
        }), stack1 || 0 === stack1 ? stack1 : "";
    }
    function program6(depth0) {
        var stack1, buffer = "";
        return buffer += '<li data-exec="/KICK ' + escapeExpression((stack1 = depth0.channel, 
        typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + " " + escapeExpression((stack1 = depth0.nick, 
        typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '">kick</li>';
    }
    function program8(depth0, data) {
        var stack1;
        return stack1 = helpers["if"].call(depth0, depth0.weOped, {
            hash: {},
            inverse: self.noop,
            fn: self.program(9, program9, data),
            data: data
        }), stack1 || 0 === stack1 ? stack1 : "";
    }
    function program9(depth0, data) {
        var stack1;
        return stack1 = helpers.unless.call(depth0, depth0.theyOped, {
            hash: {},
            inverse: self.noop,
            fn: self.program(10, program10, data),
            data: data
        }), stack1 || 0 === stack1 ? stack1 : "";
    }
    function program10(depth0) {
        var stack1, buffer = "";
        return buffer += '<li data-exec="/OP ' + escapeExpression((stack1 = depth0.nick, 
        typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '">op</li>';
    }
    function program12(depth0, data) {
        var stack1;
        return stack1 = helpers["if"].call(depth0, depth0.weOped, {
            hash: {},
            inverse: self.noop,
            fn: self.program(13, program13, data),
            data: data
        }), stack1 || 0 === stack1 ? stack1 : "";
    }
    function program13(depth0) {
        var stack1, buffer = "";
        return buffer += '<li data-exec="/DEOP ' + escapeExpression((stack1 = depth0.nick, 
        typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '">deop</li>';
    }
    function program15(depth0, data) {
        var stack1;
        return stack1 = helpers["if"].call(depth0, depth0.weOped, {
            hash: {},
            inverse: self.noop,
            fn: self.program(16, program16, data),
            data: data
        }), stack1 || 0 === stack1 ? stack1 : "";
    }
    function program16(depth0, data) {
        var stack1;
        return stack1 = helpers.unless.call(depth0, depth0.theyVoiced, {
            hash: {},
            inverse: self.noop,
            fn: self.program(17, program17, data),
            data: data
        }), stack1 || 0 === stack1 ? stack1 : "";
    }
    function program17(depth0) {
        var stack1, buffer = "";
        return buffer += '<li data-exec="/VOICE ' + escapeExpression((stack1 = depth0.nick, 
        typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '">voice</li>';
    }
    function program19(depth0, data) {
        var stack1;
        return stack1 = helpers["if"].call(depth0, depth0.weOped, {
            hash: {},
            inverse: self.noop,
            fn: self.program(20, program20, data),
            data: data
        }), stack1 || 0 === stack1 ? stack1 : "";
    }
    function program20(depth0) {
        var stack1, buffer = "";
        return buffer += '<li data-exec="/DEVOICE ' + escapeExpression((stack1 = depth0.nick, 
        typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '">devoice</li>';
    }
    this.compilerInfo = [ 4, ">= 1.0.0" ], helpers = this.merge(helpers, Handlebars.helpers), 
    data = data || {};
    var stack1, stack2, buffer = "", functionType = "function", escapeExpression = this.escapeExpression, self = this;
    return buffer += "<div class='nick-menu'>", stack1 = helpers["if"].call(depth0, depth0.showNick, {
        hash: {},
        inverse: self.noop,
        fn: self.program(1, program1, data),
        data: data
    }), (stack1 || 0 === stack1) && (buffer += stack1), buffer += '<ul><li data-exec="/WHOIS ' + escapeExpression((stack1 = depth0.nick, 
    typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '">whois</li>', 
    stack2 = helpers["if"].call(depth0, depth0.notus, {
        hash: {},
        inverse: self.noop,
        fn: self.program(3, program3, data),
        data: data
    }), (stack2 || 0 === stack2) && (buffer += stack2), buffer += '<li data-exec="/ME ' + escapeExpression(helpers.format.call(depth0, (stack1 = depth0.lang, 
    null == stack1 || stack1 === !1 ? stack1 : stack1.fishSlap), {
        hash: {},
        data: data
    })) + '">slap</li>', stack2 = helpers["if"].call(depth0, depth0.weOped, {
        hash: {},
        inverse: self.noop,
        fn: self.program(5, program5, data),
        data: data
    }), (stack2 || 0 === stack2) && (buffer += stack2), stack2 = helpers["if"].call(depth0, depth0.notus, {
        hash: {},
        inverse: self.noop,
        fn: self.program(8, program8, data),
        data: data
    }), (stack2 || 0 === stack2) && (buffer += stack2), stack2 = helpers["if"].call(depth0, depth0.notus, {
        hash: {},
        inverse: self.noop,
        fn: self.program(12, program12, data),
        data: data
    }), (stack2 || 0 === stack2) && (buffer += stack2), stack2 = helpers["if"].call(depth0, depth0.notus, {
        hash: {},
        inverse: self.noop,
        fn: self.program(15, program15, data),
        data: data
    }), (stack2 || 0 === stack2) && (buffer += stack2), stack2 = helpers["if"].call(depth0, depth0.notus, {
        hash: {},
        inverse: self.noop,
        fn: self.program(19, program19, data),
        data: data
    }), (stack2 || 0 === stack2) && (buffer += stack2), buffer += "</ul></div>";
}), this.qwebirc.templates.nickbtn = Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
    this.compilerInfo = [ 4, ">= 1.0.0" ], helpers = this.merge(helpers, Handlebars.helpers), 
    data = data || {};
    var stack1, buffer = "", functionType = "function", escapeExpression = this.escapeExpression;
    return buffer += "<div class='user' data-user=\"" + escapeExpression((stack1 = depth0.nick, 
    typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '"><span class="prefix">' + escapeExpression((stack1 = depth0.prefix, 
    typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + "</span><span class='nick'>" + escapeExpression((stack1 = depth0.nick, 
    typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + "</span></div>";
}), this.qwebirc.templates.nickmenubtn = Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
    this.compilerInfo = [ 4, ">= 1.0.0" ], helpers = this.merge(helpers, Handlebars.helpers), 
    data = data || {};
    var stack1, buffer = "", functionType = "function", escapeExpression = this.escapeExpression;
    return buffer += "<li>" + escapeExpression((stack1 = depth0.text, typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + "</li>";
}), this.qwebirc.templates.timestamp = Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
    this.compilerInfo = [ 4, ">= 1.0.0" ], helpers = this.merge(helpers, Handlebars.helpers), 
    data = data || {};
    var stack1, buffer = "", functionType = "function", escapeExpression = this.escapeExpression;
    return buffer += "<span class='timestamp'>" + escapeExpression((stack1 = depth0.time, 
    typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + " </span>";
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
    }), (stack1 || 0 === stack1) && (buffer += stack1), buffer += "' title=\"" + escapeExpression((stack1 = depth0.topic, 
    typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '">[<span>' + escapeExpression((stack1 = depth0.topic, 
    typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + "</span>]</span>";
}), this.qwebirc.templates.userlink = Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
    function program1(depth0) {
        var stack1, stack2;
        return stack1 = depth0.userid, stack2 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1, 
        stack2 || 0 === stack2 ? stack2 : "";
    }
    function program3(depth0) {
        var stack1;
        return escapeExpression((stack1 = depth0.nick, typeof stack1 === functionType ? stack1.apply(depth0) : stack1));
    }
    this.compilerInfo = [ 4, ">= 1.0.0" ], helpers = this.merge(helpers, Handlebars.helpers), 
    data = data || {};
    var stack1, buffer = "", functionType = "function", escapeExpression = this.escapeExpression, self = this;
    return buffer += "<span class='hyperlink-whois' data-user='", stack1 = helpers["if"].call(depth0, depth0.userid, {
        hash: {},
        inverse: self.program(3, program3, data),
        fn: self.program(1, program1, data),
        data: data
    }), (stack1 || 0 === stack1) && (buffer += stack1), buffer += "'>" + escapeExpression((stack1 = depth0.nick, 
    typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + "</span>";
}), this.qwebirc.templates.window = Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
    function program1(depth0, data) {
        var stack1;
        return stack1 = self.invokePartial(partials.topicBar, "topicBar", depth0, helpers, partials, data), 
        stack1 || 0 === stack1 ? stack1 : "";
    }
    function program3(depth0, data) {
        var stack1, buffer = "";
        return stack1 = helpers["if"].call(depth0, depth0.splitPane, {
            hash: {},
            inverse: self.noop,
            fn: self.program(4, program4, data),
            data: data
        }), (stack1 || 0 === stack1) && (buffer += stack1), buffer += '<div class="qui rightpanel"></div>';
    }
    function program4(depth0, data) {
        var stack1;
        return stack1 = self.invokePartial(partials.verticalDivider, "verticalDivider", depth0, helpers, partials, data), 
        stack1 || 0 === stack1 ? stack1 : "";
    }
    function program6(depth0, data) {
        var stack1;
        return stack1 = self.invokePartial(partials.ircInput, "ircInput", depth0, helpers, partials, data), 
        stack1 || 0 === stack1 ? stack1 : "";
    }
    this.compilerInfo = [ 4, ">= 1.0.0" ], helpers = this.merge(helpers, Handlebars.helpers), 
    partials = this.merge(partials, Handlebars.partials), data = data || {};
    var stack1, stack2, buffer = "", self = this, functionType = "function", escapeExpression = this.escapeExpression;
    return buffer += '<div class="window qui" data-id="' + escapeExpression((stack1 = depth0.id, 
    typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '" data-name="' + escapeExpression((stack1 = depth0.name, 
    typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '">', stack2 = helpers["if"].call(depth0, depth0.isChannel, {
        hash: {},
        inverse: self.noop,
        fn: self.program(1, program1, data),
        data: data
    }), (stack2 || 0 === stack2) && (buffer += stack2), buffer += '<div class="qui content"><div class="qui leftpanel lines"></div>', 
    stack2 = helpers["if"].call(depth0, depth0.isChannel, {
        hash: {},
        inverse: self.noop,
        fn: self.program(3, program3, data),
        data: data
    }), (stack2 || 0 === stack2) && (buffer += stack2), buffer += '</div><div class="qui properties">', 
    stack2 = self.invokePartial(partials.channelName, "channelName", depth0, helpers, partials, data), 
    (stack2 || 0 === stack2) && (buffer += stack2), buffer += '</div><div class="qui bottompanel">', 
    stack2 = helpers["if"].call(depth0, depth0.needsInput, {
        hash: {},
        inverse: self.noop,
        fn: self.program(6, program6, data),
        data: data
    }), (stack2 || 0 === stack2) && (buffer += stack2), buffer += "</div></div>";
}), function(Epitome, undefined) {
    "use strict";
    var DEBUG = !0, document = window.document, $ = document.id, $$ = document.getElements, QWEBIRC_BUILD = "bbc577ad5cb78d946ac1", qwebirc = _.merge(window.qwebirc || {}, {
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
            options: "qweb-options",
            history: "qweb-hist",
            settings: "qweb-settings"
        },
        BUILD: QWEBIRC_BUILD,
        FILE_SUFFIX: "-" + QWEBIRC_BUILD,
        VERSION: "0.93-dev"
    }), irc = qwebirc.irc, util = qwebirc.util, crypto = util.crypto, config = qwebirc.config, auth = qwebirc.auth, ui = qwebirc.ui, themes = ui.themes, style = ui.style, cookies = qwebirc.cookies, sound = qwebirc.sound, lang = qwebirc.lang, templates = qwebirc.templates;
    ui.WINDOW = {
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
    }, test = _.autoCurry(function(reg, str) {
        return str.test(reg);
    }), replace = _.autoCurry(function(reg, rep, str) {
        return str.replace(reg, rep);
    }), startsWith = function(what, str) {
        return str.startsWith(what);
    }, $identity = _.identity, joinEmpty = _.partial(join, ""), joinComma = util.joinChans = _.partial(join, ","), concatUnique = _.compose(_.uniq, Array.concat), concatSep = _.autoCurry(function(sep, s1, s2) {
        return _.isArray(s1) && (s1 = s1.join(sep)), _.isArray(s2) && (s2 = s2.join(sep)), 
        "" !== s1 && "" !== s2 ? s1 + sep + s2 : s1 + s2;
    }), concatSpace = concatSep(" ");
    util.format = util.formatter = function(message, data) {
        return (message.message || message).substitute(data);
    }, util.formatSafe = util.formatterSafe = function(str, object, regexp) {
        return String(str).replace(regexp || /\\?\{([^{}]+)\}/g, function(match, name) {
            return "\\" == match.charAt(0) ? match.slice(1) : null != object[name] ? object[name] : match;
        });
    };
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
    util.unformatChannelString = _.compose(_.uniq, _.partial(_.func.map, formatChannel), splitChan), 
    util.formatURL = function(link) {
        return link = util.isChannel(link) ? link.replace("#", "@") : link, "#!" + link;
    }, util.unformatURL = function(link) {
        return link.replace(/^!/, "").replace(/^@/, "#");
    }, util.addChannel = _.compose(_.uniq, appendChannel), util.prependChannel = _.compose(_.uniq, _.flip(appendChannel)), 
    util.removeChannel = _.compose(_.uniq, function(chans, chan) {
        return _.clone(chans).erase(chan);
    }), function() {
        var prefix_re = /^([_a-zA-Z0-9\[\]\\`^{}|-]*)(!([^@]+)@(.*))?$/, hasprefix_re = /^:([^ ]+) +/, colonrem_re = /^:[^ ]+ +/, command_re = /^([^ ]+) */, data_re = /^[^ ]+ +/, args_re = /^:|\s+:/, argsm_re = /(.*?)(?:^:|\s+:)(.*)/, args_split_re = / +/, NUMERICS = irc.Numerics;
        util.parseIRCData = function(line) {
            var match, message = {
                raw: line,
                prefix: "",
                commandType: "normal"
            };
            (match = line.match(hasprefix_re)) && (message.prefix = match[1], line = line.replace(colonrem_re, ""), 
            (match = message.prefix.match(prefix_re)) ? (message.nick = match[1], message.user = match[3], 
            message.host = match[4]) : message.server = message.prefix), match = line.match(command_re), 
            message.command = match[1].toUpperCase(), message.rawCommand = match[1], line = line.replace(data_re, ""), 
            NUMERICS[message.rawCommand] && (message.command = NUMERICS[message.rawCommand].name, 
            message.commandType = NUMERICS[message.rawCommand].type), message.args = [];
            var middle, trailing;
            return -1 != line.search(args_re) ? (match = line.match(argsm_re), middle = match[1].trimRight(), 
            trailing = match[2]) : middle = line, middle.length && (message.args = middle.split(args_split_re)), 
            !_.isUndefined(trailing) && trailing.length && message.args.push(trailing), message;
        }, util.processTwistedData = function(data) {
            var match, message = {
                commandType: "normal",
                rawCommand: data[1],
                command: data[1],
                args: data[3],
                prefix: data[2]
            };
            return NUMERICS[data[1]] && (message.command = NUMERICS[data[1]].name, message.commandType = NUMERICS[data[1]].type), 
            (match = message.prefix.match(prefix_re)) ? (message.nick = match[1], message.user = match[3], 
            message.host = match[4]) : message.server = message.prefix, message;
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
    }, util.validPrefix = _.contains, util.addPrefix = function(nc, pref, prefs) {
        return prefs && !util.validPrefix(prefs, pref) ? nc.prefixes : nc.prefixes = concatUnique(nc.prefixes, pref).join("");
    }, util.removePrefix = function(nc, pref) {
        return nc.prefixes = nc.prefixes.replaceAll(pref, "");
    }, util.prefixOnNick = _.autoCurry(function(prefixes, nick) {
        for (var i = 0; i < nick.length && util.validPrefix(prefixes, nick.charAt(i)); i++) ;
        return [ nick.slice(0, i), nick.slice(i) ];
    }), util.getPrefix = _.compose(_.first, util.prefixOnNick), util.stripPrefix = _.compose(_.lambda("x[1]"), util.prefixOnNick), 
    util.createWordRegex = function(word) {
        return new RegExp("\\b" + String.escapeRegExp(word) + "\\b", "i");
    }, util.testForNick = _.autoCurry(function(nick, text) {
        return util.createWordRegex(nick).test(text);
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
    }, util.longtoduration = function(l) {
        var seconds = l % 60, minutes = Math.floor(l % 3600 / 60), hours = Math.floor(l % 86400 / 3600), days = Math.floor(l / 86400);
        return days + " days " + hours + " hours " + minutes + " minutes " + seconds + " seconds";
    };
    var pad = util.pad = _.autoCurry(function(cond, padding, str) {
        return str = String(str), cond(str) ? padding + str : str;
    });
    util.padzero = pad(_.lambda(".length<=1"), "0"), util.padspace = pad(_.lambda(".length!==0"), " "), 
    util.getEnclosedWord = function(str, pos) {
        pos >>>= 0;
        var left = str.slice(0, pos + 1).search(notwhitespace), right = str.slice(pos).search(whitespace), word = 0 > right ? str.slice(left) : str.slice(left, right + pos);
        return [ left, word ];
    }, util.randHexString = function(numBytes) {
        for (var id = ""; numBytes > 0; numBytes--) id += (0 | 256 * (1 + Math.random())).toString(16).slice(1);
        return id;
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
            MESSAGE: 4
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
            authFailed: [ message("Could not auth with IRC network - waited 5 seconds.", types.ERROR), message('Otherwise reattempt authing by sending: "/AUTH <your username> <your password>"', types.ERROR), message('To ignore the error and join channels, unauthed, type: "/autojoin".', types.ERROR) ],
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
            copyright: [ message("qwebirc v" + qwebirc.VERSION, types.INFO), message("Copyright (C) 2008-2011 Chris Porter and the qwebirc project.", types.INFO), message('Current version by Emanuel "megawac" Jackstare', types.INFO), message("http://www.qwebirc.org", types.INFO), message("Licensed under the GNU General Public License, Version 2.", types.INFO) ],
            alertNotice: "Alert!",
            activityNotice: "Activity!",
            partChan: "Part",
            logOut: message("Logged out", types.MESSAGE),
            quit: "Page closed",
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
            MESSAGE_PLACEHOLDER: " something ... ",
            NICK_PLACEHOLDER: " someone ... ",
            TYPE_PLACEHOLDER: "type test",
            DELETE_NOTICE: "remove",
            ADD_NOTICE: "Add notifier",
            USER_NOTICE: "User:",
            TYPE_NOTICE: "Type:",
            MESSAGE_NOTICE: "Message:",
            AUTOESCAPE: "Escape text",
            MENTIONED: "Mentioned",
            ESCAPE_HINT: "This text is transformed into a regular expressions - autoescaping will check for the exact text you entered",
            DESKTOP_NOTICES: "Allow us to send desktop notifications if supported (on any notice with flash):",
            IGNORE_CASE: "Case insensitive",
            NOTUS: "Not us",
            NOTUS_HINT: "Not our message",
            HIGHLIGHT: "hl",
            HIGHLIGHT_HINT: "highlight",
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
        debug: DEBUG
    }), session = util.sessionStorage = new Storage({
        storageType: "sessionStorage",
        duration: 1,
        debug: DEBUG,
        fallback: !1
    }), Storer = util.Storer = new Class({
        initialize: function(name, storer) {
            this.name = name, this.storage = storer || storage;
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
    }, document.addEvent("domready", function() {
        Browser.Features.calc = !1, [ "", "-webkit-", "-moz-", "-o-" ].some(function(prefix) {
            try {
                var $el = new Element("div", {
                    styles: {
                        width: prefix + "calc(5px)"
                    }
                });
                if ($el.style.length > 0) return Browser.Features.calc = prefix + "calc";
            } catch (nope) {}
        });
    }), util.percentToPixel = function(data, par) {
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
        $ele.setStyle(style, Browser.Features.calc + "(" + val + ")");
    }, util.elementAtScrollPos = function($ele, pos, dir, offset) {
        dir = (dir || "width").capitalize(), offset = offset || 10;
        var $res = $ele.lastChild;
        return Array.some($ele.childNodes, function($kid) {
            return offset += $kid["get" + dir](), offset >= pos ? ($res = $kid, !0) : void 0;
        }), $res;
    }, function() {
        var urlifier = util.urlifier = new Urlerizer({
            target: "_blank"
        });
        urlifier.leading_punctuation.include(/^([\x00-\x02]|\x016|\x1F)/).include(/^(\x03+(\d{1,2})(?:,\d{1,2})?)/), 
        urlifier.trailing_punctuation.include(/([\x00-\x03]|\x016|\x1F)$/), urlifier.addPattern(/qwebirc:\/\/(.*)/, function(word) {
            if (word.contains("qwebirc://")) {
                var parsed = this.parsePunctuation(word), mid = parsed.mid;
                if (mid.startsWith("qwebirc://") && mid.endsWith("/") && mid.length > 11) {
                    var cmd = mid.slice(10);
                    [ "options", "embedded", "privacy" ].some(cmd.startsWith.bind(cmd)) && (cmd = templates.customlink({
                        val: cmd.match(/\w+\w/),
                        internal: !0
                    })), word = parsed.lead + cmd + parsed.end;
                }
            }
            return word;
        }).addPattern(/\B#+(?![\._#-+])/, function(word) {
            var parsed = this.parsePunctuation(word), res = parsed.mid;
            return util.isChannel(res) && (res = templates.customlink({
                val: res,
                internal: !0
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
        source.windowsPane = "<div class='windows'></div>", source.dropdownhint = "<div class='dropdownhint'>Click the icon for the main menu.</div>", 
        source.tabbar = "<div class='tabbar'></div>", source.tabDetach = "<span class='detach ui-icon ui-icon-newwin' title='" + lang.detachWindow + "'></span>", 
        source.tabAttach = "<span class='attach ui-icon ui-icon-circle-minus'></span>", 
        source.tabClose = "<span class='tab-close ui-icon ui-icon-circle-close' title='" + lang.closeTab + "'></span>", 
        source.loadingPage = "<div class='loading'>" + lang.loadingPage + "<img src='images/loading.gif' alt='url'></div>", 
        source.verticalDivider = "<div class='ui-icon ui-icon-grip-solid-vertical handle vertical'></div>", 
        source.horizontalDivider = "<div class='ui-icon ui-icon-grip-solid-horizontal handle horizontal'></div>", 
        engine.registerHelper("check", function(checked) {
            return checked ? "checked" : "";
        }), engine.registerHelper("enableDisable", function(x) {
            return x ? lang.DISABLE : lang.ENABLE;
        }), engine.registerHelper("$link", util.formatURL), engine.registerHelper("$css", function(prop, def, type, default2) {
            if ("c" === type) {
                var x = new Color(def), c = x.setHue(this.style_hue).setSaturation(x.hsb[1] + this.style_saturation).setBrightness(x.hsb[2] + this.style_brightness);
                return Browser.ie && "255,255,255" == c && (c = "255,255,254"), "rgb(" + c + ")";
            }
            return "comp" === type ? this[prop] ? def : default2 : this[prop] || def;
        }), engine.registerHelper("format", function(prop) {
            return util.format(prop, this);
        }), engine.registerHelper("lang", function(prop) {
            return lang[prop];
        }), compileAll(source, compiled), engine.partials = compiled;
    }(Handlebars), config.IRC_COMMANDS = {
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
            command: "MODE {target} {mode} {args}"
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
    }, ui["default options"] = {
        auto_open_pm: !1,
        nick_ov_status: !0,
        accept_service_invites: !0,
        use_hiddenhost: !0,
        lastpos_line: !0,
        nick_colours: !1,
        hide_joinparts: !1,
        show_nicklist: !Browser.isMobile,
        show_timestamps: !0,
        font_size: 12,
        volume: 100,
        completer: {
            intrusive: Browser.isDecent,
            store: !Browser.isMobile
        },
        dn_state: !1,
        dn_duration: 4e3,
        highlight: !0,
        highlight_mentioned: !0,
        style_hue: 210,
        style_saturation: 0,
        style_brightness: 0,
        standard_notices: [ {
            type: "^(?!SERVER)+NOTICE+$",
            classes: "",
            beep: !0,
            tabhl: ui.HIGHLIGHT.speech,
            id: "notice"
        }, {
            type: "PRIVMSG$",
            flash: !0,
            beep: !0,
            pm: !0,
            tabhl: ui.HIGHLIGHT.speech,
            id: "pm"
        }, {
            type: "^OUR",
            classes: "our-msg",
            id: "ourmsg"
        }, {
            nick: "(^tf2)|((serv|bot)$)",
            classes: "bot",
            types: [ ui.WINDOW.channel ],
            "case": !0,
            id: "bot"
        }, {
            msg: "^\\!",
            classes: "command",
            types: [ ui.WINDOW.channel ],
            id: "cmd"
        }, {
            mentioned: !0,
            highlight: "mentioned",
            notus: !0,
            tabhl: ui.HIGHLIGHT.us,
            id: "mention"
        }, {
            nick: "^((?!(^tf2|bot$|serv$)).)*$",
            mentioned: !0,
            classes: "",
            beep: !0,
            pm: !0,
            notus: !0,
            "case": !0,
            id: "onmention"
        }, {
            nick: "^((?!(^tf2|bot$|serv$)).)*$",
            msg: "^((?!(^\\!)).)*$",
            classes: "",
            highlight: !0,
            notus: !0,
            "case": !0,
            tabhl: ui.HIGHLIGHT.activity,
            types: [ ui.WINDOW.channel ],
            id: "hl"
        } ],
        custom_notices: []
    }, config.OptionModel = new Class({
        Extends: Epitome.Model.Storage,
        options: {
            defaults: ui["default options"],
            key: cookies.options,
            minimize: !0
        },
        defaultNotice: function() {
            return {
                id: String.uniqueID(),
                autoescape: !0,
                description: ""
            };
        },
        notice_filter: function(data) {
            return !(!data.msg || "" === data.msg.trim()) || !(!data.nick || "" === data.nick.trim()) || !(!data.type || "" === data.type.trim()) || data.notus;
        },
        save: function() {
            return this.set("custom_notices", _.filter(this.get("custom_notices"), this.notice_filter)), 
            this.set("standard_notices", _.filter(this.get("standard_notices"), this.notice_filter)), 
            this.parent();
        },
        set: function(key, data) {
            var props = key.split(".");
            if (props.length > 1) {
                var item = this.get(props[0]);
                return this.parent(props[0], _.assign(item, key, data));
            }
            this.parent(key, data);
        }.overloadSetter()
    }), config.Settings = new Class({
        Extends: Epitome.Model.Storage,
        options: {
            defaults: {
                channels: "",
                nickname: "",
                username: "",
                password: "",
                auth: !1,
                newb: !0
            },
            key: cookies.settings,
            minimize: !1,
            onReady: function() {
                this.loaded = !0;
            }
        },
        set: function(key, data) {
            return this.parent(key, data), this.loaded && this.save(), this;
        },
        unset: function(key) {
            return this.parent(key), this.save();
        }
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
            nick: "{N}"
        }),
        CN: templates.userlink({
            nick: "{newnick}"
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
        CHANMSG: "{D}{nicktmpl}{)}{D} {m}",
        PRIVMSG: "{(}{nicktmpl}{)} {m}",
        OURCHANMSG: "{nicktmpl} {m}",
        OURPRIVMSG: "{nicktmpl} {m}",
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
        WHOISEND: "{P}End of whois {N}",
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
        irc.Commands = new Class({
            __autojoined: !1,
            exec: function(line, chan) {
                for (var command, args, cmdopts, target, self = this, allargs = util.formatCommand(line); $defined(allargs); ) {
                    if (command = allargs[0].toUpperCase(), command = config.COMMAND_ALIAS[command] || command, 
                    args = allargs[1], target = chan, cmdopts = self["cmd_" + command], !cmdopts) {
                        self.send(command + util.padspace(args));
                        break;
                    }
                    if (cmdopts.minargs && cmdopts.minargs > _.size(args)) {
                        self.writeMessages(lang.insufficentArgs, {}, {
                            channel: chan
                        });
                        break;
                    }
                    _.isNumber(cmdopts.splitargs) && _.isString(args) && (args = args.splitMax(" ", cmdopts.splitargs), 
                    cmdopts.target && (target = args.shift())), allargs = cmdopts.fn.call(self, args, target);
                }
            },
            automode: function(modes, mode, args, channel) {
                args.length.times(function() {
                    modes += mode;
                }), this.send(format(cmd.MODE, {
                    target: channel,
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
                        var nick = this.nickname;
                        this.trigger("privAction", {
                            nick: nick,
                            message: args,
                            target: target,
                            channel: target,
                            prefix: this.getNickStatus(target, nick)
                        });
                    }
                }
            },
            cmd_CTCP: {
                target: !0,
                splitargs: 3,
                minargs: 2,
                fn: function(args, target) {
                    var type = args[0].toUpperCase(), message = args[1] || "", msg = format(cmd.CTCP, {
                        target: target,
                        type: type,
                        text: message
                    });
                    this.send(msg) && this.trigger("privCTCP", {
                        nick: this.nickname,
                        _type: type,
                        message: message,
                        args: args,
                        type: "CTCPReply"
                    });
                }
            },
            cmd_SAY: {
                minargs: 1,
                fn: function(args, target) {
                    return [ "PRIVMSG", target + " " + args || "" ];
                }
            },
            cmd_PRIVMSG: {
                target: !0,
                splitargs: 2,
                minargs: 1,
                fn: function(args, target) {
                    var message = args[0], nick = this.nickname, msg = format(cmd.PRIVMSG, {
                        target: target,
                        message: message
                    });
                    return util.isChannel(target) ? (this.send(msg) && this.trigger("chanMessage", {
                        nick: nick,
                        channel: target,
                        message: message,
                        type: "chanmsg",
                        prefix: this.getNickStatus(target, nick)
                    }), void 0) : [ "QUERY", target + " " + message ];
                }
            },
            cmd_NOTICE: {
                target: !0,
                splitargs: 2,
                minargs: 1,
                fn: function(args, target) {
                    var message = args[0], msg = format(cmd.NOTICE, {
                        target: target,
                        message: message
                    }), noticeType = util.isChannel(target) ? "chanNotice" : "privNotice";
                    this.send(msg) && this.trigger(noticeType, {
                        nick: this.nickname,
                        channel: target,
                        target: target,
                        message: message
                    });
                }
            },
            cmd_QUERY: {
                target: !0,
                splitargs: 2,
                minargs: 1,
                fn: function(args, target) {
                    var message = args[0];
                    if (util.isChannel(target)) return this.writeMessages(lang.invalidChanTarget);
                    if (_.size(message) > 1) {
                        var msg = format(cmd.PRIVMSG, {
                            target: target,
                            message: message
                        });
                        this.send(msg);
                    }
                    this.trigger("query", {
                        nick: this.nickname,
                        channel: target,
                        message: message,
                        type: "privmsg"
                    });
                }
            },
            cmd_QUOTE: {
                minargs: 1,
                fn: function(args) {
                    this.send(args);
                }
            },
            cmd_KICK: {
                target: !0,
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
                target: !0,
                splitargs: 6,
                minargs: 1,
                fn: function(args, target) {
                    this.automode("+", "o", args, target);
                }
            },
            cmd_DEOP: {
                target: !0,
                splitargs: 6,
                minargs: 1,
                fn: function(args, target) {
                    this.automode("-", "o", args, target);
                }
            },
            cmd_AUTH: {
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
                target: !0,
                splitargs: 6,
                minargs: 1,
                fn: function(args, target) {
                    this.automode("+", "v", args, target);
                }
            },
            cmd_DEVOICE: {
                target: !0,
                splitargs: 6,
                minargs: 1,
                fn: function(args, target) {
                    this.automode("-", "v", args, target);
                }
            },
            cmd_TOPIC: {
                target: !0,
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
                    });
                    this.send(msg);
                }
            },
            cmd_QUIT: {
                splitargs: 1,
                minargs: 0,
                fn: function(args) {
                    this.quit(args[0] || "", !0);
                }
            },
            cmd_FJOIN: {
                splitargs: 1,
                minargs: 1,
                fn: function(args) {
                    if (!_.isEmpty(args)) {
                        var channels = Array.from(args).flatten(), formatted = util.formatChannelString(channels);
                        _.isEqual(channels, util.splitChans(formatted)) || this.writeMessages(lang.poorJoinFormat), 
                        formatted && this.send(format(cmd.JOIN, {
                            channel: formatted
                        }));
                    }
                }
            },
            cmd_JOIN: {
                splitargs: 1,
                minargs: 1,
                fn: function(args) {
                    var channels = Array.from(args).map(util.splitChans).flatten().filter(this.canJoinChannel, this);
                    this.cmd_FJOIN.fn.call(this, channels);
                }
            },
            cmd_PART: {
                target: !0,
                splitargs: 2,
                minargs: 0,
                fn: function(args, channel) {
                    this.storeChannels(util.removeChannel(this.channels, channel)), this.send(format(cmd.PART, {
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
                fn: function() {
                    return this.__autojoined ? void 0 : (this.__autojoined = !0, this.currentChannel = BROUHAHA, 
                    [ "JOIN", this.getChannels() ]);
                }
            }
        }), irc.CommandHistory = new Class({
            Extends: Epitome.Model.Storage,
            Implements: [ Options ],
            options: {
                lines: 20,
                minlen: 2,
                storage: {
                    fallback: !1
                },
                store: !Browser.isMobile,
                key: cookies.history
            },
            addLine: function(name, line) {
                var data = this.get(name).erase(line);
                line.length > this.options.minlen && (data.unshift(line), data.length > this.options.lines && data.pop(), 
                this.set(name, data), this.save());
            },
            addChannel: function(name) {
                this.get(name) || this.set(name, []);
            },
            removeChannel: function(name) {
                this.unset(name), this.options.store && this.save();
            },
            _filter: _.not(_.isEmpty)
        }), irc.NodeConnection = new Class({
            Implements: [ Options, Events ],
            Binds: [ "_recv", "_error" ],
            options: {
                socket_connect: document.location.hostname,
                nickname: "",
                password: "",
                serverPassword: null,
                autoConnect: !0,
                debug: !0,
                floodProtection: !1,
                autoretry: !0,
                retryInterval: 5e3,
                clientID: util.randHexString(16)
            },
            connected: !1,
            initialize: function(options) {
                var self = this;
                options = self.setOptions(options).options;
                var socket = self.socket = io.connect(options.socket_connect, {
                    reconnect: options.autoretry,
                    "reconnection delay": options.retryInterval,
                    "max reconnection attempts": options.retryAttempts
                }), $evts = {
                    raw: self._recv,
                    connected: function() {
                        self.connected = !0, self.attempts = 0, self.fireEvent("connected");
                    },
                    disconnect: function() {
                        self.connected = !1;
                    },
                    reconnect: function() {
                        console.log("reconnected"), self.socket.emit("reconnect", options);
                    },
                    reconnecting: function() {
                        console.log("reattempt"), self.fireEvent("retry", {
                            next: options.retryInterval
                        });
                    },
                    lostConnection: function() {
                        self.fireEvent("lostConnection", self.attempts++), self.connected = !1;
                    },
                    abort: function() {
                        new ui.Alert({
                            title: "Lost connection to IRC server",
                            text: "Server lost connection to the IRC server"
                        }), self.connected = !1;
                    },
                    max_connections: function() {
                        new ui.Alert({
                            title: "Maximum connections reached",
                            text: "Maximum synchronous connections for this server have been reached. If we let you in we may crash/get g-lined. Try again later...",
                            onHide: function() {
                                location.reload();
                            }
                        });
                    },
                    echo: _.log,
                    error: self._error
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
            disconnect: function() {
                this.socket.emit("quit"), this.socket.disconnect();
            },
            _recv: function(data) {
                var processed = util.parseIRCData(data.raw);
                this.fireEvent("recv", processed);
            },
            send: function(data) {
                return this.connected ? (this.socket.emit("send", data), !0) : (console.error("disconnected dude"), 
                void 0);
            },
            _error: function() {
                console.error(arguments), this.fireEvent("error", arguments);
            }
        }), auth.loggedin = !1, auth.enabled = !1, auth.passAuth = $lambda(!0), auth.bouncerAuth = $lambda(!1), 
        irc.IRCClient = new Class({
            Implements: [ Options, Events, irc.Commands ],
            Binds: [ "lostConnection", "send", "quit", "connected", "retry", "dispatch", "_tdispatch" ],
            options: {
                minRejoinTime: [ 0 ],
                networkServices: [],
                loginRegex: /^$/
            },
            lastNicks: [],
            inviteChanList: [],
            channels: [],
            activeTimers: {},
            prefixes: "@+",
            modeprefixes: "ov",
            __signedOn: !1,
            authed: !1,
            nextctcp: 0,
            pmodes: {
                b: irc.PMODE_LIST,
                l: irc.PMODE_SET_ONLY,
                k: irc.PMODE_SET_UNSET,
                o: irc.PMODE_SET_UNSET,
                v: irc.PMODE_SET_UNSET
            },
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
                        recv: self.dispatch,
                        quit: self.quit,
                        connected: self.connected,
                        lostConnection: self.lostConnection
                    });
                } else self.connection = new irc.TwistedConnection({
                    nickname: self.nickname,
                    serverPassword: options.serverPassword
                }), self.connection.addEvents({
                    recv: self._tdispatch,
                    lostConnection: self.lostConnection
                });
                self.tracker = new irc.IRCTracker(self);
            },
            connect: function() {
                return this.connection.connect(), this;
            },
            connected: function() {
                this.trigger("connect", {});
            },
            send: function(data) {
                return this.connection.send(data);
            },
            disconnect: function() {
                return this.connection.disconnect(), this;
            },
            disconnected: function(message) {
                delete this.tracker, this.trigger("disconnect", {
                    message: message
                });
            },
            quit: function(message, notify) {
                return this.isConnected() && (this.send("QUIT :" + (message || lang.quit), !1), 
                notify && (_.each(this.activeTimers, $clear), this.activeTimers = {}, this.writeMessages(lang.disconnected, {}, {
                    channels: "ALL"
                }), this.disconnect(), this.trigger("disconnect"), this.__signedOn = !1)), this;
            },
            lostConnection: function(attempt) {
                this.writeMessages(lang.connTimeOut, {
                    retryAttempts: attempt
                }, {
                    channels: "ALL"
                });
            },
            trigger: function(type, data) {
                return data || (data = {}), data["-"] = this.nickname, this.fireEvent(type, [ type, data ]);
            },
            isConnected: function() {
                return this.__signedOn && this.connection.connected;
            },
            isNetworkService: function(host) {
                return this.options.networkServices.contains(host);
            },
            inChannel: function(name) {
                return this.channels.contains(name);
            },
            storeChannels: function(channels) {
                this.channels = channels = channels || this.channels;
                var store = util.removeChannel(channels, BROUHAHA);
                return this.options.settings.set("channels", store), this;
            },
            getChannels: function() {
                var chans = this.channels = util.prependChannel(this.options.settings.get("channels") || [], BROUHAHA);
                return chans;
            },
            nickOnChanHasPrefix: function(nick, channel, prefix) {
                var entry = this.tracker.getNickOnChannel(nick, channel);
                return $defined(entry) ? entry.prefixes.contains(prefix) : !1;
            },
            getNickStatus: function(channel, nick) {
                var nickchan = this.tracker.getNickOnChannel(nick, channel);
                return $defined(nickchan) && 0 !== nickchan.prefixes.length ? nickchan.prefixes.charAt(0) : "";
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
            getPopularChannels: function(cb, minUsers) {
                this.hidelistout = !0, this.exec("/list >" + (minUsers || 75)), this.addEvent("listend:once", function() {
                    var chans = _.chain(this.listedChans).clone().sortBy(function(chan) {
                        return -chan.users;
                    }).value();
                    cb(chans), this.hidelistout = !1;
                });
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
            dispatch: function(data) {
                var fn = this[this.IRC_COMMAND_MAP[data.command] || "irc_" + data.command];
                fn && fn.call(this, data) || this.rawNumeric(data);
            },
            _tdispatch: function(data) {
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
                    var _data = util.processTwistedData(data);
                    this.dispatch(_data);
                }
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
                return _.isArray(messages) ? messages.each(write) : write(messages), this.trigger("info", data);
            },
            genericError: function(data) {
                var target = data.args[1], message = _.last(data.args);
                return this.trigger("error", {
                    target: target,
                    channel: target,
                    message: message,
                    type: "genericError"
                }), !0;
            },
            genericQueryError: function(data) {
                var target = data.args[1], message = _.last(data.args);
                return this.trigger("error", {
                    target: target,
                    channel: target,
                    message: message,
                    type: "genericError"
                }), !0;
            },
            _signOn: function() {
                if (this.__signedOn) return console.log("REjoining " + util.formatChannelString(this.channels)), 
                this.send(format(cmd.JOIN, {
                    channel: util.formatChannelString(this.channels)
                }));
                var channels;
                this.options, this.writeMessages(lang.signOn), this.writeMessages(lang.loginMessages, {}, {
                    channel: BROUHAHA
                }), !this.authed && auth.enabled ? (this.exec(util.format("/AUTH {username} {password}", this.options)), 
                this.writeMessages.delay(100, this, lang.joinAfterAuth), this.activeTimers.autojoin = function() {
                    this.authed || this.writeMessages(lang.authFailed);
                }.delay(5e3, this)) : this.exec("/AUTOJOIN"), this.trigger("logon", {
                    nickname: this.nickname,
                    channels: channels
                });
            },
            _supported: function(key, value) {
                var self = this;
                switch (key) {
                  case "CASEMAPPING":
                    "ascii" === value ? self.toIRCLower = irc.ASCIItoIRCLower : "rfc1459" === value || DEBUG && console.log("unsupported codec"), 
                    self.lowerNickname = self.toIRCLower(self.nickname);
                    break;

                  case "CHANMODES":
                    _.each(value.split(","), function(mode, inx) {
                        _.each(mode, function(letter) {
                            self.pmodes[letter] = inx;
                        });
                    });
                    break;

                  case "PREFIX":
                    var len = (value.length - 2) / 2, modeprefixes = self.modeprefixes = value.substr(1, len);
                    self.prefixes = value.substr(len + 2, len), _.each(modeprefixes, function(modeprefix) {
                        self.pmodes[modeprefix] = irc.PMODE_SET_UNSET;
                    });
                }
            },
            _joinInvited: _.debounce(function() {
                this.exec("/JOIN " + this.inviteChanList.join(",")), this.inviteChanList.empty();
            }, 100),
            processCTCP: function(message) {
                return "" === message.charAt(0) ? (message = "" === _.last(message) ? message.slice(1, message.length - 2) : message.slice(1), 
                message.splitMax(" ", 2)) : void 0;
            },
            rawNumeric: function(data) {
                this.trigger("raw", {
                    numeric: data.command,
                    message: data.args.slice(1).join(" ")
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
                -1 != i && this.lastNicks.splice(i, 1), this.lastNicks.unshift(nick);
            },
            _initChanTopic: function(channel, topic) {
                this.trigger("chanTopic", {
                    channel: channel,
                    topic: topic,
                    initial: !0
                });
            },
            _initChanUsers: function(channel, names) {
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
            onAuthenticated: function(data) {
                this.authed = !0, this.exec("/UMODE +x"), this.__autojoined || (this.writeMessages(lang.joinChans), 
                this.exec("/AUTOJOIN")), this.fireEvent("auth", {
                    nick: data.nick,
                    message: _.last(data.args),
                    host: data.host,
                    username: _.first(data.args)
                });
            },
            _whois: function(nick, type, data) {
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
                        type: "whoisUser",
                        h: data.ident + "@" + data.hostname
                    }), msgs.push({
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
                return this.trigger("whois", ndata), !0;
            },
            IRC_COMMAND_MAP: {
                ERR_CANNOTSENDTOCHAN: "genericError",
                ERR_CHANOPPRIVSNEEDED: "genericError",
                ERR_NOSUCHNICK: "genericQueryError"
            },
            irc_PING: function(data) {
                return this.send("PONG :" + _.last(data.args)), !0;
            },
            irc_RPL_WELCOME: function(data) {
                var self = this;
                self.nickname = data.args[0], data.message = data.args[1], self.lowerNickname = self.toIRCLower(self.nickname), 
                self._signOn(data), _.delay(function() {
                    self.__signedOn = !0;
                }, 2e3);
            },
            irc_NICK: function(data) {
                var self = this, newnick = data.args[0], oldnick = data.nick, wasus = this.nickname === oldnick;
                wasus && (this.nickname = newnick, this.lowerNickname = this.toIRCLower(this.nickname)), 
                wasus && (self.nickname = newnick, self.options.settings.set("nickname", newnick)), 
                self.tracker.renameNick(oldnick, newnick);
                var channels = self.tracker.getNick(newnick);
                return _.each(channels, function(obj, chan) {
                    self.updateNickList(chan);
                }), self.trigger("nickChange", {
                    nick: oldnick,
                    newnick: newnick,
                    channels: channels,
                    thisclient: wasus,
                    type: "nick"
                }), !0;
            },
            irc_JOIN: function(data) {
                var channel = data.args[0], nick = data.nick, wasus = nick === this.nickname;
                wasus && (isBaseWindow(channel) || this.storeChannels(util.addChannel(this.getChannels(), channel)), 
                this.__signedOn && (this.currentChannel = channel));
                var windowSelected = channel === this.currentChannel || channel === BROUHAHA;
                return this.tracker.addNickToChannel(nick, BROUHAHA), this.tracker.addNickToChannel(nick, channel), 
                this.updateNickList(BROUHAHA), this.updateNickList(channel), this.trigger("userJoined", {
                    nick: nick,
                    host: data.host,
                    channel: channel,
                    thisclient: wasus,
                    select: windowSelected
                }), !0;
            },
            irc_QUIT: function(data) {
                var self = this, message = _.last(data.args), nick = data.nick, channels = self.tracker.getNick(nick);
                return self.tracker.removeNick(nick), _.each(channels, function(nick, chan) {
                    self.updateNickList(chan);
                }), self.trigger("quit", {
                    host: data.host,
                    nick: nick,
                    channels: channels,
                    message: message
                }), !0;
            },
            irc_PART: function(data) {
                var channel = data.args[0], message = data.args[1], nick = data.nick, wasus = nick === this.nickname;
                return this.partHandler(nick, channel), wasus ? this.tracker.removeChannel(channel) : (this.tracker.removeNickFromChannel(nick, BROUHAHA), 
                this.tracker.removeNickFromChannel(nick, channel), this.updateNickList(BROUHAHA), 
                this.updateNickList(channel)), this.trigger("part", {
                    nick: nick,
                    host: data.host,
                    channel: channel,
                    message: message,
                    thisclient: wasus
                }), !0;
            },
            irc_KICK: function(data) {
                var kicker = data.prefix, channel = data.args[0], kickee = data.args[1], message = data.args[2], wasus = kickee === this.nickname;
                return this.partHandler(kickee, channel), wasus ? this.tracker.removeChannel(channel) : (this.tracker.removeNickFromChannel(kickee, channel), 
                this.updateNickList(channel)), this.trigger("kick", {
                    kicker: kicker,
                    channel: channel,
                    kickee: kickee,
                    message: message,
                    thisclient: wasus
                }), !0;
            },
            partHandler: function(nick, chan) {
                var wasus = nick === this.nickname;
                return wasus && this.inChannel(chan) && this.channels.erase(chan), wasus;
            },
            irc_TOPIC: function(data) {
                var channel = data.args[0], topic = _.last(data.args);
                return this.trigger("chanTopic", {
                    nick: data.nick,
                    channel: channel,
                    topic: topic
                }), !0;
            },
            irc_PRIVMSG: function(data) {
                var nick = data.nick, target = data.args[0], message = _.last(data.args), ctcp = this.processCTCP(message);
                if (ctcp) {
                    var type = ctcp[0].toUpperCase(), replyfn = irc.RegisteredCTCPs[type];
                    if (replyfn) {
                        var t = Date.now() / 1e3;
                        t > this.nextctcp && this.send(format(cmd.CTCP, {
                            target: data.user,
                            type: type,
                            text: replyfn(ctcp[1])
                        })), this.nextctcp = t + 5;
                    }
                    if (target === this.nickname) {
                        var ctcptype = "ACTION" == type ? "privAction" : "privCTCP";
                        this.trigger(ctcptype, {
                            nick: nick,
                            host: data.host,
                            message: ctcp[1] || "",
                            data: type
                        });
                    } else {
                        var context = {
                            nick: nick,
                            channel: target,
                            message: ctcp[1] || "",
                            prefix: this.getNickStatus(target, nick)
                        };
                        "ACTION" == type ? (this.tracker.updateLastSpoke(nick, target, Date.now()), this.trigger("chanAction", context)) : this.trigger("chanCTCP", context);
                    }
                } else target === this.nickname ? (this._pushLastNick(nick), this.trigger("query", {
                    nick: nick,
                    host: data.host,
                    channel: nick,
                    message: message,
                    type: "privmsg"
                })) : (this.tracker.updateLastSpoke(nick, target, Date.now()), this.trigger("chanMessage", {
                    nick: nick,
                    channel: target,
                    message: message,
                    type: "chanmsg",
                    prefix: this.getNickStatus(target, nick)
                }));
                return !0;
            },
            irc_NOTICE: function(data) {
                var target = data.args[0], message = _.last(data.args), options = this.options;
                if (this.isNetworkService(data.host) || !$chk(data.nick)) options.loginRegex.test(message) && this.onAuthenticated(data), 
                this.trigger("serverNotice", {
                    nick: data.nick,
                    message: message,
                    channel: STATUS
                }); else if (target === this.nickname) {
                    var ctcp = this.processCTCP(message);
                    ctcp ? this.trigger("ctcpReply", {
                        nick: data.nick,
                        host: data.host,
                        ctcptype: ctcp[0],
                        args: ctcp[1] || ""
                    }) : this.trigger("privNotice", {
                        message: message,
                        host: data.host,
                        nick: data.nick,
                        channel: data.nick
                    });
                } else this.trigger("chanNotice", {
                    nick: data.nick,
                    channel: target,
                    message: message,
                    prefix: this.getNickStatus(target, data.nick)
                });
                return !0;
            },
            irc_INVITE: function(data) {
                var channel = _.last(data.args), accept = this.ui.uiOptions2.get("accept_service_invites") && this.isNetworkService(host);
                return accept && (this.activeTimers.serviceInvite && $clear(this.activeTimers.serviceInvite), 
                this.activeTimers.serviceInvite = this._joinInvited(), this.inviteChanList.push(channel)), 
                this.trigger("invite", {
                    channel: channel,
                    accept: accept,
                    nick: data.nick,
                    host: data.host
                }), !0;
            },
            irc_ERR_NICKNAMEINUSE: function(data) {
                if (this.genericError(data), this.__signedOn) return !0;
                var nick = data.args[1], newnick = nick + Number.random(0, 9);
                return this.send(format(cmd.NICK, {
                    nick: newnick
                })), this.lastnick = newnick, !0;
            },
            irc_ERROR: function(data) {
                var message = _.last(data.args);
                return this.trigger("error", {
                    message: message,
                    type: "genericError"
                }), !0;
            },
            irc_MODE: function(data) {
                var self = this, target = data.args[0], args = data.args.slice(1);
                if (target == this.nickname) this.trigger("userMode", {
                    modes: args,
                    message: args.join(""),
                    type: "UMODE",
                    n: this.nickname
                }); else {
                    var modes = args[0].split(""), nick = _.last(args), cmode = OPED;
                    modes.filter(function(mode) {
                        var dir = mode === OPED || mode === DEOPED;
                        return dir && (cmode = mode), !dir;
                    }).each(function(mode) {
                        var pmode = self.pmodes[mode], _nick = pmode === irc.PMODE_LIST || pmode === irc.PMODE_SET_UNSET ? nick : null, prefixindex = self.modeprefixes.indexOf(mode);
                        if (-1 !== prefixindex) {
                            var nc = self.tracker.getOrCreateNickOnChannel(nick, target), added = cmode === OPED, prefix = self.prefixes.charAt(self.modeprefixes.indexOf(mode)), prefixchar = added ? util.addPrefix(nc, prefix, self.prefixes) : util.removePrefix(nc, prefix);
                            self.trigger("mode", {
                                added: added,
                                prefix: prefixchar,
                                message: prefixchar,
                                nick: _nick,
                                channel: target,
                                thisclient: _nick === self.nickname,
                                nickchan: nc
                            });
                        }
                    }), self.updateNickList(target);
                }
                return !0;
            },
            irc_RPL_ISUPPORT: function(data) {
                var ms, supported = data.args.slice(1, -1);
                supported.contains("CHANMODES") && supported.contains("PREFIX") && (this.pmodes = {}), 
                supported.each(function(mode) {
                    ms = mode.splitMax("=", 2), this._supported(ms[0], ms[1]);
                }, this);
            },
            irc_RPL_NAMREPLY: function(data) {
                var channel = data.args[2], names = data.args[3];
                return this._initChanUsers(channel, names.split(" ")), !0;
            },
            irc_RPL_ENDOFNAMES: function(data) {
                var channel = data.args[1];
                return this._initChanUsers(channel, []), !0;
            },
            irc_RPL_NOTOPIC: function(data) {
                var channel = data.args[1];
                return this.inChannel(channel) ? (this._initChanTopic(channel, ""), !0) : void 0;
            },
            irc_RPL_TOPIC: function(data) {
                var channel = data.args[1], topic = _.last(data.args);
                return this.inChannel(channel) ? (this._initChanTopic(channel, topic), !0) : void 0;
            },
            irc_RPL_TOPICWHOTIME: $lambda(!0),
            irc_RPL_WHOISUSER: function(data) {
                var nick = data.args[1];
                return this._whoisNick = nick, this._whois(nick, "user", {
                    ident: data.args[2],
                    hostname: data.args[3],
                    realname: _.last(data.args)
                });
            },
            irc_RPL_WHOISSERVER: function(data) {
                var nick = data.args[1];
                return data.args[2], _.last(data.args), this._whois(nick, "server", {
                    server: data.args[2],
                    serverdesc: _.last(data.args)
                });
            },
            irc_RPL_WHOISOPERATOR: function(data) {
                var nick = data.args[1];
                return _.last(data.args), this._whois(nick, "oper", {
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
                var nick = data.args[1];
                return data.args[2], this._whois(nick, "opername", {
                    opername: data.args[2]
                });
            },
            irc_RPL_WHOISGENERICTEXT: function(data) {
                var nick = data.args[1], text = _.last(data.args);
                return this._whois(nick, "generictext", {
                    text: text
                });
            },
            irc_RPL_WHOISWEBIRC: function(data) {
                var nick = data.args[1], text = _.last(data.args);
                return this._whois(nick, "generictext", {
                    text: text
                });
            },
            irc_RPL_WHOISSECURE: function(data) {
                var nick = data.args[1], text = _.last(data.args);
                return this._whois(nick, "generictext", {
                    text: text
                });
            },
            irc_RPL_ENDOFWHOIS: function(data) {
                var nick = data.args[1];
                return _.last(data.args), delete this._whoisNick, this._whois(nick, "end", {});
            },
            irc_RPL_AWAY: function(data) {
                var nick = data.args[1], message = _.last(data.args);
                return this._whoisNick == nick ? this._whois(nick, "away", {
                    away: message
                }) : (this.trigger("away", {
                    nick: nick,
                    message: message
                }), !0);
            },
            irc_RPL_NOWAWAY: function(data) {
                return this.trigger("error", {
                    state: !0,
                    message: _.last(data.args),
                    type: "genericError"
                }), !0;
            },
            irc_RPL_UNAWAY: function(data) {
                return this.trigger("error", {
                    state: !1,
                    message: _.last(data.args),
                    type: "genericError"
                }), !0;
            },
            irc_WALLOPS: function(data) {
                return this.trigger("wallops", {
                    message: message,
                    nick: data.nick,
                    host: data.host
                }), !0;
            },
            irc_RPL_CREATIONTIME: function(data) {
                var channel = data.args[1], time = data.args[2];
                return this.trigger("serverMessage", {
                    channel: channel || ACTIVE,
                    message: util.IRCDate(new Date(1e3 * time)),
                    type: "channelCreationTime"
                }), !0;
            },
            irc_RPL_CHANNELMODEIS: function(data) {
                var channel = data.args[1], modes = data.args.slice(2);
                return this.trigger("serverMessage", {
                    channel: channel || ACTIVE,
                    message: modes.join(" "),
                    type: "channelModeIs"
                }), !0;
            },
            irc_RPL_LISTSTART: function() {
                return this.listedChans = [], !this.hidelistout;
            },
            irc_RPL_LIST: function(data) {
                return this.listedChans.push({
                    channel: data.args[1],
                    users: _.toInt(data.args[2]),
                    topic: data.args[3]
                }), !this.hidelistout;
            },
            irc_RPL_LISTEND: function() {
                return this.trigger("listend", this.listedChans), !this.hidelistout;
            }
        }), function() {
            var killBit = "", killHeaders = {
                Accept: killBit,
                "Accept-Language": killBit
            };
            irc.TwistedConnection = new Class({
                Implements: [ Events, Options ],
                Binds: [ "send" ],
                options: {
                    nickname: "",
                    minTimeout: 45e3,
                    maxTimeout: 3e5,
                    timeoutIncrement: 1e4,
                    initialTimeout: 65e3,
                    floodInterval: 200,
                    floodMax: 10,
                    floodReset: 5e3,
                    errorAlert: !0,
                    maxRetries: 5,
                    serverPassword: null
                },
                connected: !1,
                counter: 0,
                __sendQueue: [],
                __lastActiveRequest: null,
                __activeRequest: null,
                __sendQueueActive: !1,
                __floodLastRequest: 0,
                __retryAttempts: 0,
                __floodCounter: 0,
                __floodLastFlood: 0,
                __timeoutId: null,
                initialize: function(options) {
                    this.setOptions(options), this.__timeout = this.options.initialTimeout;
                },
                connect: function() {
                    var self = this;
                    self.connected = !0, self.cacheAvoidance = util.randHexString(16);
                    var request = self.newRequest("n");
                    request.addEvent("complete", function(stream) {
                        return stream ? stream[0] ? (self.sessionid = stream[1], self.recv(), void 0) : (self.disconnect(), 
                        self.lostConnection(lang.connError, stream), void 0) : (self.lostConnection(lang.connectionFail), 
                        void 0);
                    });
                    var postdata = "nick=" + encodeURIComponent(self.options.nickname);
                    null != self.options.serverPassword && (postdata += "&password=" + encodeURIComponent(self.options.serverPassword)), 
                    request.send(postdata);
                },
                disconnect: function() {
                    this.connected = !1, this.__cancelTimeout(), this.__cancelRequests();
                },
                newRequest: function(url, floodProtection, synchronous) {
                    var self = this;
                    if (!self.connected) return null;
                    floodProtection && self.__isFlooding() && (self.disconnect(), self.__error(lang.uncontrolledFlood));
                    var request = new Request.JSON({
                        url: qwebirc.global.dynamicBaseURL + "e/" + url + "?r=" + self.cacheAvoidance + "&t=" + self.counter++,
                        async: !synchronous
                    });
                    return request.headers = {}, request.addEvent("request", function() {
                        Object.each(killHeaders, function(val, key) {
                            try {
                                request.xhr.setRequestHeader(key, val);
                            } catch (o_O) {
                                delete killHeaders[key];
                            }
                        });
                    }), Browser.ie && Browser.version < 8 && request.setHeader("If-Modified-Since", "Sat, 01 Jan 2000 00:00:00 GMT"), 
                    request;
                },
                recv: function() {
                    var self = this, request = self.newRequest("s", !0);
                    if (null != request) {
                        self.__activeRequest = request, request.__replaced = !1;
                        var onComplete = function(stream) {
                            return request.__replaced ? (self.__lastActiveRequest = null, stream && self.__processData(stream), 
                            void 0) : (self.__activeRequest = null, self.__cancelTimeout(), stream ? (self.__processData(stream) && self.recv(), 
                            void 0) : (self.connected && self.__checkRetries() && self.recv(), void 0));
                        };
                        request.addEvent("complete", onComplete), self.__scheduleTimeout(), request.send("s=" + self.sessionid);
                    }
                },
                send: function(data, synchronous) {
                    return this.connected ? (synchronous ? this.__send(data, !1) : (this.__sendQueue.push(data), 
                    this.__processSendQueue()), !0) : !1;
                },
                __processSendQueue: function() {
                    this.__sendQueueActive || 0 === this.__sendQueue.length || (this.sendQueueActive = !0, 
                    this.__send(this.__sendQueue.shift(), !0));
                },
                __send: function(data, async) {
                    var request = this.newRequest("p", !1, !async);
                    null != request && request.addEvent("complete", this.__completeRequest.bind(this, async)).send("s=" + this.sessionid + "&c=" + encodeURIComponent(data));
                },
                __completeRequest: function(async, stream) {
                    return async && (this.__sendQueueActive = !1), stream && stream[0] ? (this.__processSendQueue(), 
                    void 0) : (this.__sendQueue = [], this.connected && this.lostConnection(lang.connError, stream), 
                    !1);
                },
                __isFlooding: function() {
                    var t = Date.now(), floodt = t - this.__floodLastRequest;
                    return floodt < this.options.floodInterval && (0 !== this.__floodLastFlood && floodt > this.options.floodReset && (this.__floodCounter = 0), 
                    this.__floodLastFlood = t, ++this.__floodCounter > this.options.floodMax) ? !0 : (this.__floodLastRequest = t, 
                    !1);
                },
                __checkRetries: function() {
                    if (++this.__retryAttempts > this.options.maxRetries && this.connected) return this.disconnect(), 
                    this.__error(lang.connTimeOut, {
                        retryAttempts: this.__retryAttempts
                    }), this.fireEvent("lostConnection", this.__retryAttempts), !1;
                    var to = this.__timeout - this.options.timeoutIncrement;
                    return to >= this.options.minTimeout && (this.__timeout = to), !0;
                },
                __cancelRequests: function() {
                    null != this.__lastActiveRequest && (this.__lastActiveRequest.cancel(), this.__lastActiveRequest = null), 
                    null != this.__activeRequest && (this.__activeRequest.cancel(), this.__activeRequest = null);
                },
                __processData: function(payload) {
                    var self = this;
                    return 0 == payload[0] ? (self.connected && self.lostConnection(lang.connError, payload), 
                    !1) : (self.__retryAttempts = 0, payload.each(function(data) {
                        self.fireEvent("recv", [ data ]);
                    }), !0);
                },
                __scheduleTimeout: function() {
                    this.__timeoutId = this.__timeoutEvent.delay(this.__timeout, this);
                },
                __cancelTimeout: function() {
                    null != this.__timeoutId && ($clear(this.__timeoutId), this.__timeoutId = null);
                },
                __timeoutEvent: function() {
                    if (this.__timeoutId = null, null != this.__activeRequest) {
                        this.__lastActiveRequest && this.__lastActiveRequest.cancel(), this.__activeRequest.__replaced = !0, 
                        this.__lastActiveRequest = this.__activeRequest;
                        var to = this.__timeout + this.options.timeoutIncrement;
                        to <= this.options.maxTimeout && (this.__timeout = to), this.recv();
                    }
                },
                lostConnection: function() {
                    this.connected = !1, this.fireEvent("lostConnection", this.__retryAttempts), this.__error.apply(this, arguments);
                },
                __error: function(message, context) {
                    var msg = context ? util.formatter(message.message, context) : message.message;
                    this.fireEvent("error", msg), new ui.Alert({
                        title: "Connection Error",
                        text: msg
                    });
                }
            });
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
                nickchan && (_.each(nickchan, function(data, chan) {
                    var lchannel = this.toIRCLower(chan), channel = this.channels[lchannel];
                    delete channel[nick], _.isEmpty(channel) && delete this.channels[lchannel];
                }, this), delete this.nicknames[nick]);
            },
            removeChannel: function(channel) {
                var chan = this.getChannel(channel);
                if (chan) {
                    var lchannel = this.toIRCLower(channel);
                    _.each(_.keys(chan), function(nick) {
                        var nc = this.nicknames[nick];
                        delete nc[lchannel], _.isEmpty(nc) && delete this.nicknames[nick];
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
                var nickHash = this.getChannel(channel);
                if (nickHash) return _.chain(nickHash).values().sortBy(function(nick) {
                    return -nick.lastSpoke;
                }).value();
            },
            getSortedNicksForChannel: function(channel, sorter) {
                var nickHash = this.getChannel(channel);
                return _.isEmpty(nickHash) ? [] : (sorter || (sorter = util.nickChanComparitor(this.owner, nickHash)), 
                _.keys(nickHash).sort(sorter).map(function(nick, index) {
                    return {
                        prefix: nickHash[nick].prefixes,
                        nick: nick,
                        index: index
                    };
                }));
            }
        }), irc.RegisteredCTCPs = {
            VERSION: $lambda("qwebirc v" + qwebirc.VERSION + ", copyright (C) 2008-2011 Chris Porter and the qwebirc project -- " + navigator.userAgent),
            USERINFO: $lambda("qwebirc"),
            TIME: function() {
                return util.IRCDate(new Date());
            },
            PING: $lambda,
            CLIENTINFO: $lambda("PING VERSION TIME USERINFO CLIENTINFO WEBSITE"),
            WEBSITE: $lambda(window == window.top ? "direct" : document.referrer)
        };
    }(), ui.WINDOW_ID_MAP = [ {
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
            return client !== ui.CUSTOM_CLIENT && client ? client.id : ui.CUSTOM_CLIENT;
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
            var wins = this.getWindows(client);
            return _.isObject(wins) ? wins[this.getWindowIdentifier(name)] : void 0;
        },
        getWindows: function(client) {
            return this.windows[this.getClientId(client)] || this.customWindows;
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
            var windows = _.where(this.windowArray, {
                detached: !1
            }), win = _.nextItem(windows, windows.indexOf(fromWin || this.active), direction);
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
                    type: type,
                    "@": _data.prefix
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
                    var data2 = _.clone(data), nick = data2.nick;
                    util.isChannel(channel) || (channel === nick ? channel = ">" + client.nickname : (channel = ">" + channel, 
                    data2.nick = nick)), data2.linkedchannel = channel, ui_.windows.brouhaha.addLine(data2.type, data2);
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
            function queried(type, data) {
                data = formatData(type, data);
                var win = ui_.newWindow(client, ui.WINDOW.query, data.channel);
                (data.nick === client.nickname || ui_.uiOptions2.get("auto_open_pm")) && ui_.selectWindow(win), 
                data.message && parser(type, data, win);
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
                    updateNicklist: function(type, data) {
                        var win = ui_.getWindow(client, data.channel);
                        win && win.updateNickList(data.nicks);
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
                        ui_.nickChange(data, client), lineParser(type, data);
                    },
                    privNotice: queried,
                    query: queried,
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
                    raw: lineParser
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
            nickChange: util.noop
        });
        var broadcast_re = /MSG|TOPIC|(CHAN|PRIV)NOTICE/i;
    }(), function() {
        function validate($ele, validators) {
            if (!_.isEmpty(validators)) {
                var text = $ele.val(), failed = _.find(validators, function(validator) {
                    return !validator.test(text, $ele);
                }), failbool = !!failed, $controlpar = $ele.getParent(".control-group").toggleClass("has-error", failbool);
                return failbool ? 0 === $controlpar.getElements(".help-block").filter(function(ele) {
                    return ele.html() === failed.description;
                }).length && getTemplate("failed-validator", function(template) {
                    Elements.from(template(failed)).inject($controlpar);
                }) : $controlpar.getElements(".help-block").dispose(), !failed;
            }
        }
        var LoginBox = function(parentElement, callback, settings, networkName, validators) {
            var nickname = settings.get("nickname"), username = Base64.decode(settings.get("username")), password = Base64.decode(settings.get("password")), eauth = auth.enabled || settings.get("auth");
            getTemplate("authpage", function(template) {
                var page = Element.from(template({
                    network: networkName,
                    nickname: nickname,
                    username: username,
                    password: password,
                    full: eauth,
                    channels: settings.get("channels").join()
                })).inject(parentElement), $form = page.getElement("#login"), $nickBox = page.getElement("#nickname"), $usernameBox = page.getElement("#username"), $passwordBox = page.getElement("#password"), $chkAddAuth = page.getElement("#authenticate");
                $form.addEvents({
                    "blur:relay([data-validate])": function(e, target) {
                        validate(target, validators[target.get("data-validate")]);
                    }
                }), $chkAddAuth.addEvent("click", function() {
                    $form.getElements('[name="full"]').getParent("div").toggle();
                }), $form.addEvent("submit", function(e) {
                    if (e.stop(), validate($nickBox, validators.nick) && validate($usernameBox, validators.username) && validate($passwordBox, validators.password)) {
                        var nickname = $nickBox.val(), data = {
                            nickname: nickname
                        };
                        settings.set("nickname", nickname), auth.enabled || $chkAddAuth.val() ? (data.username = username = $usernameBox.val(), 
                        data.realname = username || "", data.password = password = $passwordBox.val(), auth.bouncerAuth() ? data.serverPassword = password : auth.passAuth() && (data.serverPassword = username + " " + password), 
                        settings.set("username", Base64.encode(username)), settings.set("password", Base64.encode(password)), 
                        settings.set("auth", !0), auth.enabled = !0) : settings.unset("auth"), parentElement.empty(), 
                        auth.loggedin = !0, callback(data);
                    }
                }), window === window.top && $nickBox.focus(), ui.Behaviour.apply(page);
            });
        };
        ui.ILogin = new Class({
            Implements: [ Events ],
            LoginBox: LoginBox,
            loginBox: function() {
                var self = this, win = this.newCustomWindow(CONNECTION_DETAILS, !0, ui.WINDOW.connect), callback = function(data) {
                    win.close(), self.fireEvent("login", data);
                };
                return this.LoginBox(win.lines, callback, this.options.settings, this.options.networkName, this.options.validators), 
                win;
            },
            welcome: function() {
                ui.WelcomePane.show(this.ui, _.extend({
                    element: this.element,
                    firstvisit: !0
                }, this.options));
            }
        });
    }(), ui.IUIOptions = new Class({
        theme: ui.Theme,
        config: function() {
            function setNotices() {
                var notices = uiOptions.get("standard_notices").concat(uiOptions.get("custom_notices")), notifiers = _.chain(notices).filter(uiOptions.notice_filter).map(function(notice) {
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
                    return _.each([ "msg", "nick", "type" ], function(type) {
                        notice[type] && (onotice[type] = new RegExp(notice.autoescape ? String.escapeRegExp(notice[type]) : notice[type], notice.case ? "i" : ""));
                    }), _.clean(onotice);
                }).value();
                self.theme.messageParsers.empty().combine(notifiers), self.theme.config = uiOptions;
            }
            var self = this, options = self.options;
            if (self.uiOptions instanceof config.OptionModel) return this;
            var uiOptions = self.uiOptions = self.uiOptions2 = new config.OptionModel({}, {
                defaults: options.uiOptions
            });
            return uiOptions.on({
                "change:style_hue": function() {
                    self.updateStylesheet();
                },
                "change:font_size": self.updateStylesheet,
                "change:custom_notices": setNotices,
                "change:standard_notices": setNotices,
                "change:show_nicklist": function() {
                    _.each(self.windowArray, function(win) {
                        win.toggleNickList();
                    });
                },
                "change:completer": function(completer) {
                    self.commandhistory.options.store = completer.store, completer.store || self.commandhistory.clear(), 
                    _.each(self.windowArray, function(win) {
                        win.toggleAutocomplete(completer.intrusive);
                    });
                }
            }), setNotices(), self.setModifiableStylesheet({
                style_hue: options.hue || self.uiOptions.get("style_hue"),
                style_saturation: options.saturation || self.uiOptions.get("style_saturation"),
                style_brightness: options.brightness || self.uiOptions.get("style_brightness")
            }), self;
        },
        setModifiableStylesheet: function(vals) {
            this._styleSheet = new Element("style", {
                type: "text/css",
                media: "all"
            }).inject(document.head), this.updateStylesheet(vals);
        },
        updateStylesheet: function(values) {
            var self = this;
            getTemplate("modifiablecss", function(template) {
                var styles = _.extend({}, Browser, self.uiOptions.toJSON(), values), stylesheet = template(styles), node = self._styleSheet;
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
                return this.playSound("beep");
            },
            playSound: function(alias) {
                return this.soundPlayer ? this.soundPlayer.isReady() && Date.now() - this.lastSound > this.options.sounds.minSoundRepeatInterval && (this.lastSound = Date.now(), 
                this.soundPlayer.play(alias, {
                    volume: this.uiOptions.get("volume")
                })) : (this.soundInit(), this.soundPlayer.addEvent("ready:once", this.playSound.bind(this, alias))), 
                this;
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
                        ui.setTitle(vis ? self.titleText : lang.activityNotice);
                    };
                    return self.flashing = !0, self.__flasher = _.periodical(flash, 750), window.addEvents({
                        "mousedown:once": self.cancelFlash,
                        "keydown:once": self.cancelFlash,
                        "focus:once": self.cancelFlash
                    }), self;
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
                return self;
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
        Binds: [ "whoisURL", "updateStylesheet", "nextWindow", "prevWindow", "optionsWindow", "faqWindow", "privacyWindow", "aboutWindow", "feedbackWindow", "embeddedWindow" ],
        options: {
            routerPrefix: "!"
        },
        initialize: function(parentElement, theme, uiName, options) {
            var self = this.setOptions(options);
            document.addEvent("domready", function() {
                self.theme = theme, self.config(), parentElement = self.element = self.parentElement = $(parentElement).addClasses("qwebirc", "qwebirc-" + uiName), 
                self.commandhistory = new irc.CommandHistory({
                    store: self.uiOptions.get("completer").store
                }), self.windows[ui.CUSTOM_CLIENT] = self.customWindows, getTemplate("topPane", function(template) {
                    self.outerTabs = Element.from(template()).inject(parentElement);
                }), getTemplate("windowsPane", function(template) {
                    self.windowsPanel = Element.from(template()).inject(parentElement);
                }), self.postInitialize(), self.fireEvent("ready");
            });
        },
        postInitialize: function() {
            function checkRoute(data) {
                var request = util.unformatURL(data.request).toLowerCase();
                if (!self.active || request !== self.active.identifier) switch (request) {
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
                    var win = _.findWhere(self.windowArray, {
                        identifier: request
                    });
                    win ? win.select() : util.isChannel(request) && _.each(self.clients, function(client) {
                        client.exec("/JOIN " + request);
                    });
                }
            }
            var self = this;
            return self.options.routerPrefix, self.nav = new ui.NavBar({
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
            }), self.element.addEvent("click:relay(.internal)", function(e, $tar) {
                e.preventDefault(), self.updateURI($tar.get("href"));
            }), self.router = new Epitome.Router({
                onUndefined: checkRoute
            }), this;
        },
        updateURI: function(url) {
            url = url || this.active.identifier, this.router && ("login" != url || location.hash) && this.router.navigate(util.formatURL(url));
        },
        whoisURL: function(e, target) {
            var client = target.getParent(".window").retrieve("window").client, nick = target.get("data-user");
            client.exec("/WHOIS " + nick);
        },
        optionsWindow: function() {
            var self = this;
            return self.addCustomWindow("Options", ui.OptionView, "options", {
                model: self.uiOptions,
                onNoticeTest: function() {
                    self.flash(!0), self.login(), self.showNotice({}, !0);
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
        debug: !1,
        appTitle: "",
        networkName: "",
        validators: {
            nick: [ {
                test: test(/^[\s\S]{1,9}$/),
                description: "Nick must be between 1 and 9 characters"
            } ],
            password: [ {
                test: function(pass, $ele) {
                    return pass.length > 0 || !$ele.isVisible();
                },
                description: "Missing password"
            } ],
            username: [ {
                test: function(pass, $ele) {
                    return pass.length > 0 || !$ele.isVisible();
                },
                description: "Missing username"
            } ]
        },
        theme: undefined,
        uiOptions: {},
        settings: {},
        client: {
            networkServices: [],
            minRejoinTime: [ 5, 20, 300 ],
            loginRegex: /I recogni[sz]e you\./,
            node: !1
        }
    };
    return qwebirc.createInstance = function(element_id, UIclass, options) {
        options = _.merge({}, defaults, options);
        var settings = options.settings = new config.Settings({}, {
            defaults: options.settings
        }), query = window.location.search;
        if (query) {
            var parsed = query.slice(1).parseQueryString();
            parsed.channels && (parsed.channels = concatUnique(settings.get("channels"), util.unformatChannelString(parsed.channels)));
            var softextend = function(obj) {
                _.each(parsed, function(val, key) {
                    _.has(obj, key) && (obj[key] = +val == val ? +val : val);
                });
            };
            softextend(options.uiOptions = _.merge({}, ui["default options"], options.uiOptions)), 
            softextend(options.client), softextend(options.settings._attributes);
        }
        var instance = new UIclass(element_id, new ui.Theme(options.theme), options);
        return instance.addEvents({
            "ready:once": function() {
                instance.loginBox(), settings.get("newb") && (instance.welcome(), settings.set("newb", !1));
            },
            "login:once": function(loginopts) {
                var ircopts = _.extend({
                    settings: settings
                }, options.client, loginopts), client = new irc.IRCClient(ircopts);
                instance.newClient(client), client.writeMessages(lang.copyright), client.connect(), 
                client.addEvent("auth", function(data) {
                    instance.showNotice({
                        title: "Authenticated with network!",
                        body: util.format("{nick}: {message}", data)
                    }, !0);
                }), window.onbeforeunload = function(e) {
                    if (client.isConnected()) {
                        e = e || window.event, e.preventDefault = !0;
                        var message = "This action will close all active IRC connections.";
                        return e.returnValue = message, message;
                    }
                }, window.addEvent("unload", client.quit);
            }
        }), instance;
    }, ui.QUI = new Class({
        Extends: ui.StandardUI,
        Binds: [ "__createChannelMenu" ],
        initialize: function(parentElement, theme, options) {
            this.Window = ui.QUI.Window, this.parent(parentElement, theme, "qui", options);
        },
        postInitialize: function() {
            var self = this.parent();
            return self.element.addClasses("qui", "signed-out").addEvent("click:relay(.lines .hyperlink-whois)", this.whoisURL), 
            self.setHotKeys(), self.nav.on({
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
                next: {
                    keys: "tab",
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
                    handler: _.partial(util.wrapSelected, ".window:not(.hidden) .input .irc-input", util.getStyleByName("bold").bbcode)
                },
                italic: {
                    keys: "ctrl+i",
                    description: "",
                    handler: _.partial(util.wrapSelected, ".window:not(.hidden) .input .irc-input", util.getStyleByName("italic").bbcode)
                },
                underline: {
                    keys: "ctrl+u",
                    description: "",
                    handler: _.partial(util.wrapSelected, ".window:not(.hidden) .input .irc-input", util.getStyleByName("underline").bbcode)
                },
                colour: {
                    keys: "ctrl+c",
                    description: "",
                    handler: _.partial(util.wrapSelected, ".window:not(.hidden) .input .irc-input", util.getStyleByName("colour").bbcode)
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
            this.parent(win), win.element.show().addClass("active").getSiblings(".active:not(.detached)").hide().removeClass("active");
        },
        nickChange: function(data, client) {
            data.thisclient && _.each(this.getWindows(client), function(win) {
                win.setNickname(data.newnick);
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
                this.render(), window.addEvent("resize", this.adjust), this.tabs.addEvent("adopt", this.adjust);
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
        toggleTab: function(tab, state) {
            return this.tabs.getElement(tab).toggle(state), this;
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
    }), function() {
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
                return evt && evt.stopPropagation(), document.removeEvents(this.$listeners), this.fireEvent("hide"), 
                this.parent(evt, clicked);
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
            }), self.highlightClasses.channels = {}, self.config = config;
        },
        formatMessage: function($ele, type, _data, highlight) {
            var self = this, isobj = _.isObject(_data), data = isobj ? _.clone(_data) : _data;
            isobj && (_.has(data, "n") && (data.N = templates.userlink(data), data.nicktmpl = templates.ircnick(data)), 
            _.each([ "m", "c" ], function(key) {
                var val = data[key];
                val && (_.isArray(val) && (val = val.join("")), data[key] = self.urlerize(val));
            }));
            var themed = type ? self.formatText(type, data, highlight) : data, result = self.colourise(themed), timestamp = self.config && self.config.get("show_timestamps") ? templates.timestamp({
                time: util.IRCTimestamp(new Date())
            }) : "";
            return $ele.addClass("colourline").insertAdjacentHTML("beforeend", timestamp + result), 
            result;
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
        messageParsers: [],
        highlightClasses: [ "highlight1", "highlight2" ],
        highlightAndNotice: function(data, type, win, $ele) {
            var self = this, tabHighlight = ui.HIGHLIGHT.none, highlights = self.highlightClasses, nick = win.client.nickname, notus = data.n !== nick;
            return data && type && /(NOTICE|ACTION|MSG)$/.test(type) && (data.m && $ele.addClass("message"), 
            _.each(self.messageParsers, function(parser) {
                parser.notus && !notus || parser.types && !parser.types.contains(win.type) || parser.type && !parser.type.test(type) || parser.msg && !parser.msg.test(data.m) || parser.nick && !parser.nick.test(data.n) || parser.mentioned && !util.testForNick(nick, data.m) || ((!win.active && win.name !== BROUHAHA || !document.hasFocus()) && (parser.flash && win.parentObject.flash(), 
                parser.beep && win.parentObject.beep(), parser.pm && win.parentObject.showNotice({
                    title: "IRC " + type + "!",
                    body: util.format("{nick}({channel}): {message}", data)
                })), parser.highlight && (highlights.channels[win.name] || (highlights.channels[win.name] = 0), 
                $ele.addClass(_.isBoolean(parser.highlight) ? _.nextItem(highlights, highlights.channels[win.name]++, 1) : parser.highlight)), 
                $chk(parser.classes) && $ele.addClass(parser.classes), tabHighlight = Math.max(tabHighlight, parser.tabhl));
            })), tabHighlight;
        }
    }), ui.Window = new Class({
        Extends: Epitome.View,
        Binds: [ "sendInput" ],
        options: {
            events: {},
            onReady: function() {
                this.render();
            },
            maxLines: 1e3
        },
        template: util.loadTemplate("window"),
        active: !1,
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
        getOption: function(option) {
            return this.parentObject.uiOptions.get(option);
        },
        close: function() {
            return this.closed = !0, this.parentObject.__closed(this), this.destroy(), this;
        },
        select: function() {
            this.active || this.closed || (this.active = !0, this.parentObject.selectWindow(this), 
            this.highlight && this.highlightTab(ui.HIGHLIGHT.none), this.fireEvent("selected"));
        },
        deselect: function() {
            this.active = !1;
        },
        addLine: function(type, data, colour, $ele) {
            var self = this, parent = self.parentObject, highlight = this.name !== BROUHAHA ? parent.theme.highlightAndNotice(data, type, self, $ele) : ui.HIGHLIGHT.none, hl_line = !1;
            self.active || highlight === ui.HIGHLIGHT.none || self.highlightTab(highlight), 
            parent.theme.formatMessage($ele, type, data, hl_line), self.lines.adopt($ele).maxChildren(this.options.maxLines), 
            self.getOption("lastpos_line") && type.endsWith("CHANMSG") && (this.lastLine = (this.lastLine || Element.from(templates.messageLine())).inject(this.lines));
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
                "dblclick:relay(.input .nickname)": "setNickname",
                "dblclick:relay(.topic)": "editTopic",
                "contextmenu:relay(.lines .nick)": "nickLinesMenu",
                "click:relay(.nick-menu li)": "menuClick",
                "click:relay(.nicklist .user .nick)": "nickListMenu",
                "click:relay(.detached-window .attach)": "attach",
                "click:relay(.detached-window .tab-close)": "close",
                click: "setActive"
            }
        },
        detached: !1,
        initialize: function(parentObject, $par, client, type, name) {
            var self = this;
            self.parent.apply(self, arguments), self.tab = parentObject.newTab(self, name), 
            self.nicksColoured = self.getOption("nick_colours");
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
            return lines.store("window", self), type === ui.WINDOW.channel && ($win.addClass("channel"), 
            self.toggleNickList(), self.updateTopic("")), hasInput && ($win.addClass("ircwindow"), 
            self.fxscroll = new Fx.AutoScroll(lines, {
                start: !1
            }), self.$input = $win.getElement(".input .irc-input"), $win.getElement("form").addEvent("submit", self.sendInput)), 
            self;
        },
        close: function(e) {
            return e && e.stop(), this.closed ? void 0 : (util.isChannelType(this.type) && !util.isBaseWindow(this.name) && this.client.exec("/PART " + this.name), 
            this.fxscroll && this.fxscroll.stop(), this.resizable && this.resizable.detach().stop(), 
            this.drag && this.drag.detach().stop(), this.completer && this.completer.detach(), 
            this.parent());
        },
        attach: function() {
            this.detached = !1, this.element.removeClass("detached"), this.window.replaces(this.wrapper), 
            this.wrapper.destroy(), this.drag.detach().stop(), this.resizable.detach().stop(), 
            this.wrapper = this.resizable = this.drag = null, this.parentObject.nav.toggleTab(this.tab.removeClass("detached"), !0), 
            this.select(), this.fireEvent("attached");
        },
        detach: function() {
            var self = this, win = self.window, po = self.parentObject, wrapper = self.wrapper = Element.from(templates.detachedWindow({
                channel: this.name,
                base: util.isBaseWindow(this.name)
            })), resizeHandle = (wrapper.getElement(".header"), wrapper.getElement(".resize-handle"));
            self.element.addClass("detached");
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
            }).replaces(wrapper.getElement(".content")), self.resizable = wrapper.makeResizable({
                limit: {
                    x: [ 400, null ],
                    y: [ 200, null ]
                },
                handle: resizeHandle,
                stopPropagation: !0
            }), self.drag = wrapper.makeDraggable({
                handle: wrapper,
                includeMargins: !0
            }), self.active && po.nextWindow(), self.detached = !0, self.active = !1, _.defer(function() {
                self.setActive(), self._selectUpdates(), wrapper.position();
            }), po.nav.toggleTab(self.tab.addClass("detached"), !1), self.fireEvent("detached");
        },
        setActive: _.throttle(function() {
            this.element.addClass("active").getSiblings(".active").removeClass("active");
        }, 1e3, !0),
        select: function() {
            this.active || this.closed || (this.parent(), this.tab.addClass("selected"), this._selectUpdates(), 
            this.setActive(), this.fireEvent("selected"));
        },
        deselect: function() {
            this.active && (this.tab.removeClass("selected"), this.fxscroll && this.fxscroll.stop(), 
            this.parent());
        },
        _selectUpdates: function() {
            var self = this;
            if (self.parentObject, self.fxscroll && self.fxscroll.start(), self.completer || self.type !== ui.WINDOW.channel || (self.completer = new Completer(self.window.getElement(".input .tt-ahead"), self.history.get(self.name), {
                autocomplete: self.getOption("completer").intrusive
            }), self.completer.$hint.addClass("decorated"), self.$input.removeClass("decorated")), 
            util.isChannelType(self.type)) {
                var colour = self.getOption("nick_colours");
                if (self.nicksColoured !== colour) {
                    self.nicksColoured = colour;
                    var nodes = self.nicklist.childNodes;
                    colour ? _.each(nodes, function(node) {
                        var colour = util.toHSBColour(node.get("data-nick"), self.client);
                        $defined(colour) && node.firstChild.setStyle("color", colour.rgbToHex());
                    }) : _.each(nodes, function(node) {
                        node.firstChild.setStyle("color", null);
                    });
                }
                _.delay(self.updatePrefix, 1e3, self);
            }
        },
        __dirtyFixes: function() {
            this.completer && this.completer.update();
        },
        editTopic: function() {
            var self = this;
            self.client.nickOnChanHasPrefix(self.client.nickname, self.name, OPSTATUS) ? new ui.Dialog({
                title: "Set Topic",
                text: util.format(lang.changeTopicConfirm, {
                    channel: self.name
                }),
                value: self.topic,
                onSubmit: function(data) {
                    var topic = data.val();
                    _.isString(topic) && self.client.exec("/TOPIC " + self.name + " " + topic, self.name);
                }
            }) : new ui.Alert({
                text: lang.changeTopicNeedsOp
            });
        },
        setNickname: function(nick) {
            var self = this;
            if (_.isString(nick)) {
                var $nick = self.window.getElement(".input .user .nickname");
                $nick && ($nick.text(nick), self.__dirtyFixes());
            } else new ui.Dialog({
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
                this.window.getElements(".input .user .status").removeClasses("op", "voice").addClass(prefix === OPSTATUS ? "op" : prefix === VOICESTATUS ? "voice" : ""), 
                this.__dirtyFixes();
            }
        },
        createNickMenu: function(nick, $par, options) {
            var $menu = $par.getElement(".nick-menu"), self = this;
            if ($menu) $menu.toggle(); else {
                var _nick = self.client.nickname, _chan = self.name;
                $menu = Element.from(templates.nickMenu(_.extend({
                    nick: nick,
                    channel: _chan,
                    weOped: self.client.nickOnChanHasAtLeastPrefix(_nick, _chan, OPSTATUS),
                    notus: _nick !== nick,
                    theyOped: self.client.nickOnChanHasPrefix(nick, _chan, OPSTATUS),
                    theyVoiced: self.client.nickOnChanHasPrefix(nick, _chan, VOICESTATUS),
                    lang: lang
                }, options))).inject($par), _.defer(function() {
                    document.addEvent("click:once", function() {
                        $menu.dispose(), options.close && options.close();
                    });
                });
            }
            return $menu;
        },
        nickLinesMenu: function(evt, $tar) {
            evt.stop();
            var $menu = this.createNickMenu($tar.get("data-user"), this.window, {
                showNick: !0
            });
            $menu.addClass("dropdownmenu").setPosition(evt.client);
        },
        nickListMenu: function(evt, $tar) {
            var $par = $tar.getParent(".user").toggleClass("selected");
            this.createNickMenu($par.get("data-user"), $par, {
                close: function() {
                    $par.removeClass("selected");
                }
            });
        },
        menuClick: function(e, $tar) {
            var action = $tar.get("data-exec");
            this.client.exec(action, this.name);
        },
        updateTopic: function(topic) {
            var $topic = this.window.getElement(".topic").empty();
            if (this.topic = topic, topic) {
                var $top = Element.from(templates.topicText({
                    empty: !1
                })).inject($topic);
                this.parentObject.theme.formatElement(topic, $top.getElement("span"));
            } else $topic.html(templates.topicText({
                topic: lang.noTopic,
                empty: !0
            }));
        },
        addLine: function(type, data, colourClass) {
            var $msg = Element.from(templates.ircMessage({
                type: type.hyphenate().replace(" ", "-")
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
            return !this.nicklist && this.getOption("show_nicklist") && (this.nicklist = this.window.getElement(".rightpanel").addClass("nicklist")), 
            this.nicklist;
        },
        toggleAutocomplete: function(state) {
            this.completer && (state = !!state, this.completer.toggleAutocomplete(state), this.completer.$hint.toggleClass("decorated", state), 
            this.$input.toggleClass("decorated", !state));
        },
        toggleNickList: function(state) {
            if (this.type === ui.WINDOW.channel) {
                state = null != state ? !!state : this.getOption("show_nicklist");
                var nicklist = this.getNickList();
                nicklist && nicklist.toggle(state) && this.window.toggleClass("show-nicklist", state);
            }
        },
        updateNickList: function(nicklist) {
            var self = this;
            if (!self.nicklist) return !1;
            var lnh = self.lastNickHash, nicks = [];
            nicklist.each(function(nickobj, index) {
                var nick = nickobj.nick, old = lnh[nick];
                nicks.push(nick), old && old.prefix === nickobj.prefix || (old && old.element && old.element.dispose(), 
                lnh[nick] = self.nickListAdd(nickobj, index));
            }), _.each(_.difference(_.keys(lnh), nicks), function(nick) {
                lnh[nick].element.dispose(), delete lnh[nick];
            });
        },
        nickListAdd: function(nickobj, position) {
            var nickele = Element.from(templates.nickbtn(nickobj)), span = nickele.getElement("span");
            if (this.getOption("nick_colours")) {
                var colour = util.toHSBColour(nickobj.nick, this.client);
                $defined(colour) && span.setStyle("color", colour.rgbToHex());
            }
            return this.nicklist.insertAt(nickele, position), _.extend({
                element: nickele
            }, nickobj);
        }
    }), function() {
        function toggleNotifications(model, state, save) {
            notify.permissionLevel() !== notify.PERMISSION_GRANTED ? notify.requestPermission(function() {
                toggleNotifications(model, notify.permissionLevel() === notify.PERMISSION_GRANTED, save);
            }) : model.set("dn_state", null != state ? !!state : !model.get("dn_state")), save && model.save();
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
                    "change:relay(#options .notice-group input)": "noticeChange",
                    "click:relay(#options #add-notice)": "addNotifier",
                    "click:relay(#options .remove-notice)": "removeNotifier",
                    "click:relay(#options #dn_state)": "dnToggle",
                    "click:relay(#options #notice-test)": "noticeTest"
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
                if (!data || Type.isDOMEvent(data)) {
                    data = this.model.defaultNotice();
                    var n = _.clone(this.model.get("custom_notices"));
                    n.push(data), this.model.set("custom_notices", n);
                }
                var $addbtn = this.element.getElement("#add-notice"), _data = _.clone(data);
                _data.lang = lang;
                var temp = templates.customNotice(_data);
                $addbtn.insertAdjacentHTML("beforebegin", temp);
            },
            removeNotifier: function(e, target) {
                e.stop();
                var type = target.getParent(".notice-group").id, par = target.getParent(".controls").dispose(), id = par.get("data-id");
                this.model.set("custom_notices", _.reject(this.model.get(type), function(xs) {
                    return xs.id === id;
                }));
            },
            noticeChange: function(e, target) {
                e.stop();
                var type = target.getParent(".notice-group").id, notices = _.clone(this.model.get(type)), par = target.getParent(".controls"), notice = _.findWhere(notices, {
                    id: par.get("data-id")
                });
                notice[target.get("data-id")] = target.val(), this.model.set("custom_notices", notices);
            },
            postRender: function() {
                var model = this.model, options = this.options;
                return this.element.getElements(".slider").each(function(slider) {
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
                return data;
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
                return _.extend({}, this.options, {
                    Browser: window.Browser
                });
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
    }(), qwebirc;
}(Epitome);