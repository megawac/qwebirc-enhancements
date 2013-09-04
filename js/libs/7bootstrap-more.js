

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
