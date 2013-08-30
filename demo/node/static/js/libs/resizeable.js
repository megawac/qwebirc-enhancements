
Drag.VERT = 'y';
Drag.HORZ = 'x';

Drag.SplitPane = new Class({
    Extends: Drag,
    Binds: ["collapse"],

    options: {
        direction: Drag.HORZ,
        unit: 'px',
        style: false,

        limits: {}
        //fold -
        //store - object with a get and set method
    },

    initialize: function(divider, options) {
        this.parent(divider, options);

        var opts = this.options,
            dir = opts.direction,
            wh = (dir === Drag.HORZ) ? "width" : "height",
            selectMod = function (style, e) { return isNaN(e.getStyle(style).toInt()) ? wh : style; },

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
            if(change) this.adjust(change);
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

        var min = prev.getStyle(mods.prev).toInt() +  change;
        var max = aft.getStyle(mods.aft).toInt() + change;

        var valmin = opts.limits.min,
            valmax = opts.limits.max;
        if(!valmin && (Type.isFunction(valmin) && !valmin(min)) || valmin > min) {
            return;
        }
        if(!valmax && (Type.isFunction(valmax) && !valmax(max)) || valmax > max) {
            return;
        }

        prev.setStyle(mods.prev, min + unit);
        div.setStyle(mods.div, (div.getStyle(mods.div).toInt() +  change) + unit);
        aft.setStyle(mods.aft, max + unit);

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
