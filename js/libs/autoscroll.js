

//scrolls an elemenet as new items are added. will stop scrolling if user manually scrolls
// TODO Theres some inefficent crap in here 
// -> still buggy :)
// Author: Graeme Yeates
//Requires: 
// - Fx.Scroll
// - Element.Event.Pseudos
Fx.AutoScroll = new Class({
    Extends: Fx.Scroll,
    Binds: ["updatePosition"],
    options: {
        direction: 'Bottom', //Top, Right, Left, Bottom
        interval: 500,
        duration: 0, //ms to execute effect
        threshold: null,//px - how close to bottom to start scrolling
        wheelStops: true,
        link: 'cancel'
    },
    lastUpdate: 0,

    initialize: function(ele, options) {
        this.parent(ele, options);

        var self = this,
            opts = self.options,
            interval = opts.interval/2,
            timers = self.$timers = {},

            //fix for a small bug caused by using throttle - ensures fn is called after scrolling ends
            throttleToggler = function() {
                if(Date.now() > (self.lastUpdate + opts.duration + 20)) {//not self triggered (20ms to compensate for runtime)
                    // console.log('checkin bc last change : ' + (d - (self.lastUpdate + opts.duration + 20)));
                    clearTimeout(timers.throttle);
                    timers.throttle = self.toggleScroll.delay(interval - opts.duration, self);
                }
            };

        this.element.addEvent("scroll:throttle(" + interval + ")", throttleToggler) //TODO: self toggling - find a fix
            // .addEvent("selectstart:throttle(" + interval + ")", throttleToggler)
            .addEvent("adopt", self.updatePosition); //new elements appended to container
        window.addEvent("resize:throttle(" + opts.duration + ")", self.updatePosition);

        self.autoScroll();
    },

    autoScroll: function() {
        this.scroll = true;
        // this.$timers.autoscroll = this.updatePosition.periodical(this.options.interval, this); //neccessary for container resizes etc
        return this.updatePosition();
    },

    stopScroll: function() {
        delete this.$timers.autoscroll;
    },

    toggleScroll: function() {
        this.scroll = false;

        var $ele = this.element,
            timers = this.$timers,
            pxFromBottom = Math.abs($ele.getScrollHeight() - ($ele.getHeight() + $ele.getScrollTop()));

        //old timers
        clearTimeout(timers.throttle);
        clearInterval(timers.autoscroll);

        if(pxFromBottom <= this.threshold) {//bottom of element + offset - begin autoscrolling
            this.autoScroll();
            // console.log('startin scrollin')
        }
        else { //stop autoscrolling
            // console.log('done scrollin - ' + pxFromBottom)
            this.stopScroll();
        }
        return this;
    },

    updatePosition: function(target) {
        // var fn = "to" + this.options.direction;
        var $ele = this.element;
        if(this.scroll  &&
          /*bug fix for a off by one one in Fx.Scroll*/ Math.abs($ele.getScrollHeight() - $ele.getHeight() - $ele.getScrollTop()) > 2) {
            this.lastUpdate = Date.now();

            if(this.options.duration == 0)
                $ele.scrollTop = $ele.scrollHeight;
            else
                this.toBottom();
            if(target)
                this.threshold = this.options.threshold || target.getHeight();
        }
        return this;
    }
});
