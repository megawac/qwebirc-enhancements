/**
 * Navbar
 * @depends [util/uihelpers]
 * @provides [ui/Nav]
 */
ui.NavBar = new Class({
    Extends: Epitome.View,
    Binds: ["adjust"],
    options: {
        template: util.loadTemplate("navbar"),
        events: {
            "click:relay(.tabbar .tab)": "selectTab",
            "dblclick:relay(.tabbar .tab)": "selectWindow",
            "click:relay(.tabbar .tab .tab-close)": "closeWindow",
            "click:relay(.tabbar .tab .detach)": "detachWindow",
            "adopt:relay(.tabbar)": "adjust",
            "disown:relay(.tabbar)": "adjust",
            "mousewheel:relay(.tabbar)": "scrollTabs",

            "click:relay(.main-menu a)": "openMenu",
            "click:relay(.buttons .to-left)": "scrollLeft",
            "click:relay(.buttons .to-right)": "scrollRight",
            "click:relay(.buttons .add-chan)": "addChannel"
        },
        onReady: function() {
            this.render();
            window.addEvent("resize", this.adjust);
            this.tabs.addEvent("adopt", this.adjust);
        },
        onScrollTabs: function(evt) {
            evt.stop();
            if (evt.wheel > 0) {//mwup
                this.nextWindow();
            } else if (evt.wheel < 0) {
                this.prevWindow();
            }
        }
    },
    render: function() {
        var self = this;
        Elements.from(self.template())
                .filter(Type.isElement)//strip random text nodes
                .inject(self.element);
        self.tabs = self.element.getElement(".tabbar");
        self.scroller = new Fx.Scroll(self.tabs);
        self.adjust();

        var dropdownMenu = Element.from(templates.mainmenu({
            atheme: "<%= build.atheme %>" === "true"
        })).inject(self.options.menuElement);

        var dropdownbtn = self.element.getElement(".main-menu");

        ui.decorateDropdown(dropdownbtn, dropdownMenu, {
            onShow: function() {
                if(self.hideHint)
                    self.hideHint();
                delete self.hideHint;
            },
            btnlistener: true,
            autohide: true
        });

        var ddhint = Element.from(templates.dropdownhint())
            .inject(self.element)
            .position({
                relativeTo: self.element,
                position: {"y": "bottom"},
                offset: {y:10}
            });

        var hideHint = _.once(_.partial(Element.destroy, ddhint));

        var dropdownEffect = new Fx.Tween(dropdownbtn, {
            duration: "long",
            property: "opacity",
            link: "chain"
        });
        dropdownEffect
            .start(0.25)
            .start(1)
            .start(0.33)
            .start(1);

        //slide hint accross the screen
        new Fx.Morph(ddhint, {
            duration: "normal",
            transition: Fx.Transitions.Sine.easeOut
        }).start({
            left: [900, 5]
        });

        (function() {
            new Fx.Morph(ddhint, {
                duration: "long"
            }).start({
                left: [5, -900]
            });
        }).delay(4000);

        hideHint.delay(4000);
        document.addEvents({
            "mousedown:once": hideHint,
            "keydown:once": hideHint
        });
    },

    adjust: function() {
        var wid = this.tabs.getWidth(),
            swid = this.tabs.getScrollWidth();

        this.element.getElements("[name='tabscroll']").toggle(swid > wid);

        util.fillContainer(this.tabs, {style: "max-width"});
    },

    addTab: function(tab) {
        if(_.isString(tab)) tab = Element.from(tab);
        this.tabs.adopt(tab);
        return this;
    },

    removeTab: function(tab) {
        this.tabs.disown(tab);
        return this;
    },

    toggleTab: function(tab, state) {
        this.tabs.getElement(tab).toggle(state);
        return this;
    },

    scrollLeft: function(e/*, target*/) {
        e.stop();
        var pos = this.tabs.getScrollLeft(),
            $ele = util.elementAtScrollPos(this.tabs, pos);

        this.scroller.toElement($ele, "x");
    },

    scrollRight: function(e) {
        e.stop();
        var pos = this.tabs.getScrollLeft() + this.tabs.getWidth(),
            $ele = util.elementAtScrollPos(this.tabs, pos);

        this.scroller.toElementEdge($ele, "x");
    },

    nextWindow: function() {
        this.trigger("nextWindow");
    },

    prevWindow: function() {
        this.trigger("prevWindow");
    },

    destroy: function() {
        window.removeEvent("resize", this.adjust);
        return this.parent();
    }
});
