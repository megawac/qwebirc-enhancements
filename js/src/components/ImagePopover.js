/**
 * img popovers
 *
 * @depends [components]
 * @provides [components/ImagePopover]
 */

//create an image popover on (img) url hover
//could use BS popovers here but this will be more efficent
var imgRegex = /\.(gif|jpg|jpeg|tiff|png)$/i;
components.ImagePopover = new Class({
    initialize: function(element, enable) {
        this.element = element;
        this.events = {
            "mouseenter:relay(a)": this.show.bind(this),
            "mouseleave:relay(a)": _.debounce(this.hide.bind(this), 100) //throttled to prevent hover being toggled when leaving spaces
        };
        this.toggle(enable);
    },

    show: function(e, $tar) {
        var self = this;
        if (self.hide()) return; //no need already shown
        if (imgRegex.test($tar.href)) {
            self.target = $tar;
            self.current = Element.from(templates["image-popover"]({
                image_url: $tar.href
            }))
            .inject(self.element)
            .setStyle("display", "block");

            var tarPos = $tar.getCoordinates();

            var payload = self.current.getElement(".payload")
            .addEvent("load", function() {
                self.current.getElement(".loading").dispose();
                //set arrow position
                self.current.getElement(".arrow")
                    .setStyle("top", Math.abs(tarPos.top - pos.y) + tarPos.height / 2);
            });

            var maxWidth = payload.getComputedStyle("max-width").toInt();
            var maxHeight = payload.getComputedStyle("max-height").toInt();
            var imgMaxMin = {
                x: {
                    min: 40,
                    max: window.getWidth() - maxWidth - 40
                },
                y: {
                    min: 40,
                    max: window.getHeight() - maxHeight - 40
                }
            };

            var pos = {
                x: Math.min((Math.max(tarPos.right + 10, imgMaxMin.x.min)), imgMaxMin.x.max),
                y: Math.min((Math.max(e.client.y / 2, imgMaxMin.y.min)), imgMaxMin.y.max)
            };

            self.current.setPosition(pos);
        }
    },

    hide: function() {
        if (this.target && this.target.match(":hover")) return true;
        if (this.current) this.current.destroy();
        this.current = this.target = null;
    },

    toggle: function(state) {
        state = _.isBoolean(state) ? state : ! this.state;
        this.hide();
        if (state !== this.state) {
            this.element[(state ? "add" : "remove") + "Events"](this.events);
            this.state = state;
        }
        return this;
    }
});