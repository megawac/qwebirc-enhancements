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

