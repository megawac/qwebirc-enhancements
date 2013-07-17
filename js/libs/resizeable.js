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
