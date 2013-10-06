
//scrolls an elemenet as new items are added. will stop scrolling if user manually scrolls
//Requires some element refactoring see nativemods so adopting and disowning elements causes an event to be fired
// Author: Graeme Yeates
//Requires: 
// - Fx.Scroll
// - Element.Event.Pseudos
Fx.AutoScroll = new Class({
    Extends: Fx.Scroll,
    Binds: ["updatePosition"],
    options: {
        // direction: 'Bottom',
        interval: 100,//time to debounce scroll event checks to save some processing
        duration: 0, //ms to execute effect
        threshold: 5,//px - how close to bottom to start scrolling
        wheelStops: true,
        link: 'cancel',
        start: true
    },

    initialize: function(ele, options) {
        this.parent(ele, options);

        var self = this,
            opts = self.options,
            timer;
        self.threshold = this.options.threshold;

        this.$events = {
            element: {
                "adopt": self.updatePosition,
                "disown": self.updatePosition
            },
            window: {
                "resize": self.updatePosition//pretty light function doesnt need to be throttled
            }
        };
        // this.$events.element["scroll:pause(" + opts.interval + ")"] = function() {
        //     self.toggleScroll();
        // };
        this.$events.element.scroll = _.debounce(function() {//underscore debounce uses much less memory than pause
            self.toggleScroll();
        }, opts.interval);

        //begin autoscrolling
        if(opts.start) this.start();
    },

    autoScroll: function() {
        this._scroll = true;
        return this.updatePosition();
    },

    stopScroll: function() {
        this._scroll = false;
    },

    toggleScroll: function() {
        this._scroll = false;

        var $ele = this.element,
            pxFromBottom = Math.abs($ele.getScrollHeight() - ($ele.getHeight() + $ele.getScrollTop()));

        if(pxFromBottom <= this.threshold) {//bottom of element + offset - begin autoscrolling
            this.autoScroll();
        }
        else { //stop autoscrolling
            this.stopScroll();
        }
        return this;
    },

    updatePosition: function(target) {
        var $ele = this.element;
        if(this._scroll  &&
          /*bug fix for a off by one one in Fx.Scroll*/ Math.abs($ele.getScrollHeight() - $ele.getHeight() - $ele.getScrollTop()) > 2) {
            if(this.options.duration === 0) {
                this.set($ele.scrollLeft, $ele.scrollHeight); //place at bottom instantly
            } else {
                this.toBottom();
            }
            if(target) {
                this.threshold = this.options.threshold || target.getHeight();
            }
        }
        return this;
    },

    start: function() {
        this.element.addEvents(this.$events.element);
        window.addEvents(this.$events.window);
        return this.autoScroll();
    },

    stop: function() {
        window.removeEvents(this.$events.window);
        this.element.removeEvents(this.$events.element);
        this.stopScroll();
        return this.parent();
    }
});
