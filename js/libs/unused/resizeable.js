
/*
---
description: You can resize elements easilly with MooResize

authors:
  - Arian Stolwijk

license:
  - MIT-style license

requires:
  core/1.2.4: [Class.Extras,Element.Style]
  more/1.2.4: [Drag]

provides:
  - [MooResize]
...
*/


var MooResize = new Class({

    Implements: [Options,Events],
    
    options: {
        handleSize: 10/*,
        minSize: false, // object with x and y or false
        maxSize: false, // object with x and y or false
        ratio: false, // false, true or any number (ratio = width/height)
        dragOptions: {},
        handleStyle: {},
        
        onStart: $empty,
        onResize: $empty,
        onComplete: $empty*/
    },
    
    initialize: function(el,options){
        this.setOptions(options);
        this.el = document.id(el);
        this.elCoords = this.el.getCoordinates();
        
        this.origRatio = this.elCoords.width / this.elCoords.height;
        this.setRatio(this.options.ratio);
        
        var handles = this.handles = {
            corner: {
                el: new Element('div').setStyle('cursor','se-resize'),
                dragOptions: {
                    onDrag: function(el,e){
                        this.setSize({
                            x: e.page.x - this.elCoords.left,
                            y: e.page.y - this.elCoords.top
                        });
                    }.bind(this)
                },
                setPosition: function(width,height) {
                    this.handles.corner.el.setStyles({
                        'left': width + this.elCoords.left - this.options.handleSize/2,
                        'top': height + this.elCoords.top - this.options.handleSize/2
                    });
                }.bind(this)
            }
        }

        if(this.options.handles > 1) {
            handles.horz = {
                el: new Element('div').setStyle('cursor','w-resize'),
                dragOptions: {
                    onDrag: function(el,e){
                        this.setSize({x: e.page.x - this.elCoords.left});
                    }.bind(this),
                    modifiers: {x: 'left', y: false}
                },
                setPosition: function(width,height){
                    this.handles.horz.el.setStyles({
                        'left': width + this.elCoords.left - this.options.handleSize/2,
                        'top': height / 2 + this.elCoords.top - this.options.handleSize/2
                    })
                }.bind(handles) 
            }
            handles.vert = {
                el: new Element('div').setStyle('cursor','n-resize'),
                dragOptions: {
                    onDrag: function(el,e){
                        this.setSize({y: e.page.y - this.elCoords.top});
                    }.bind(this),
                    modifiers: {x: false, y: 'top'}
                },
                setPosition: function(width,height){
                    this.handles.vert.el.setStyles({
                        'left': width / 2 + this.elCoords.left - this.options.handleSize/2,
                        'top': height + this.elCoords.top - this.options.handleSize/2
                    });             
                }.bind(handles)
            };
        }
    
        $each(this.handles,function(handle,key){
            handle.el.setStyles($merge({
                border: '1px solid black',
                background: 'white'
            },this.options.handleStyle,{
                position: 'absolute',
                width: this.options.handleSize,
                height: this.options.handleSize
            })).inject(this.el,'after');

            handle.setPosition(this.elCoords.width,this.elCoords.height);
            
            handle.drag = new Drag(
                handle.el,
                $merge(this.options.dragOptions,handle.dragOptions)
            );  

            handle.drag.addEvents({
                'start': function(){
                    this.fireEvent('start',[this.getSize()]);
                }.bind(this),
                'complete': function(){
                    this.fireEvent('complete',[this.getSize()]);
                }.bind(this)
            });
        }.bind(this));
    },
    
    setSize: function(width,height){
        var size = $type(width) == 'object' ? {x: width.x, y: width.y} : {x: width, y: height},
            minSize = $type(this.options.minSize) != 'object' ? {x:0,y:0} : this.options.minSize,
            maxSize = this.options.maxSize;
        
        for(dir in size){
            size[dir] = (function(mag,dir){
                if(!mag && mag !== 0) mag = null;
                if(mag === null) return mag;
                if(mag < minSize[dir]){                 
                    return minSize[dir];
                }else if(maxSize && mag > maxSize[dir]){
                    return maxSize[dir];
                }
                return mag;     
            })(size[dir],dir);
        }

        if (size.x === null && size.y !== null){
            size.x = this.ratio ? size.y * this.ratio : this.elCoords.width;  
        } else if (size.y === null && size.x !== null){
            size.y = this.ratio ? size.x / this.ratio : this.elCoords.height; 
        } else if (size.x !== null && size.y !== null && this.ratio){
            size.y = size.x / this.ratio;
        }
        
        for(dir in size) size[dir] = size[dir].round();

        this.el.setStyles({
            width: size.x,
            height: size.y
        });

        $each(this.handles,function(handle){
            handle.setPosition(size.x,size.y);
        });
        
        this.elCoords = this.el.getCoordinates();
        this.fireEvent('resize',[size,this.el]);
        return this;
    },
    
    getSize: function(){
        return {
            x: this.elCoords.width,
            y: this.elCoords.height
        };
    },
    
    setRatio: function(ratio){
        this.ratio = $type(ratio) == 'boolean' ?
            (ratio ? this.origRatio : false) : ratio;
        return this;
    },
    
    getRatio: function(){
        return this.ratio;
    },
    
    dispose: function(){
        $each(this.handles,function(handle){
            handle.el.dispose();
        });
        this.handles = null;
    },
    
    toElement: function(){
        return this.el;
    }

});
