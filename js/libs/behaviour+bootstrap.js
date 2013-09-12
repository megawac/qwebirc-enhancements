
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

