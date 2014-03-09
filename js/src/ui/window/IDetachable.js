/**
 * detachable component
 *
 * @depends [ui/Window]
 * @provides [ui/Detachable]
 */
ui.IDetachableWindow = new Class({
    options: {
        events: {
            "click:relay(.detached-window .attach)": "attach",
            "click:relay(.detached-window .tab-close)": "close"
        }
    },

    detached: false,

    attach: function(/*e*/) {
        this.detached = false;

        util.resetGrid(this.element).removeClass("detached");

        this.window.replaces(this.wrapper);
        this.wrapper.destroy();

        this.drag.detach().stop();
        this.resizable.detach().stop();
        this.wrapper = this.resizable = this.drag = null;

        this.parentObject.nav.toggleTab(this.tab.removeClass("detached"), true);
        this.select();

        this.fireEvent("attached");
    },

    detach: function(/*e*/) {
        var self = this,
            win = self.window,
            po = self.parentObject,

            wrapper = self.wrapper = Element.from(templates.detachedWindow({
                "channel": self.name,
                "base": util.isBaseWindow(self.id)
            })),
            //header = wrapper.getElement(".header"),

            // resizeWrapper = Element.from(templates.resizeHandle()),
            // resizeHandle = resizeWrapper.getElement(".resize-handle");
            resizeHandle = wrapper.getElement(".resize-handle");

        var size = util.percentToPixel({x:40, y:60}, win.getParent(".qwebirc"));
        
        //as to not mess with other window remove grid
        util.removeGrid(self.element).addClass("detached").show();
        
        //set size and add detach wrapper to dom
        wrapper.setStyles({
            "width": size.x,
            "height": size.y
        }).replaces(win);

        win.addEvent("mousedown", function(e) {
            var tag = e.target.tagName.toLowerCase();
            if(!(tag == "div" || tag == "form"))//prevent dragging if not on container
                e.stopPropagation();
        }).inject(wrapper.getElement(".body"));

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
        if(self.active) po.nextWindow();//change window if we"re active
        self.detached = true;
        _.defer(function() {
            self.setActive();
            self._selectUpdates();
            wrapper.position();
        });

        //keeps order
        po.nav.toggleTab(self.tab.addClass("detached"), false);
        self.fireEvent("detached");
    }
});
