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
