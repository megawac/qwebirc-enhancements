/**
 * extended ui
 *
 * @depends [ui/StandardUI, ui/QUIWindow]
 * @provides [ui/QUI]
 */
ui.QUI = new Class({
    Extends: ui.StandardUI,
    // Binds: ["__createChannelMenu"],
    Window: ui.QUIWindow,
    options: {
        imageRegex: /\.(gif|jpg|jpeg|tiff|png)$/i
    },
    initialize: function($par, options) {
        this.parent($par, options);
    },
    postInitialize: function() {
        var self = this.parent();
        self.nav.on({
            "selectTab": function(e, tab) {
                self.selectTab(tab);
            },
            "detachWindow": function(e, target) {
                e.stop();
                target.getParent(".tab").retrieve("window").detach();
            }
        });

        self.element.addClasses(["qui", "signed-out"]);

        //create an image popover on (img) url hover
        //could use BS popovers here but this will be more efficent
        var currentPopover, currentTarget; //popover currently being shown
        var destroyPopover = function() {
            if(currentTarget && currentTarget.isHovered()) return true;
            if(currentPopover) currentPopover.destroy();
            currentPopover = currentTarget = null;
        };
        var imgEvents = {
            "mouseenter:relay(a)": function(e, $tar) {
                if(destroyPopover()) return; //no need already shown
                if(self.options.imageRegex.test($tar.href)) {
                    util.getTemplate("image-popover", function(template) {
                        currentTarget = $tar;
                        currentPopover = Element.from(template({
                            image_url: $tar.href
                        }))
                        .inject(self.element)
                        .setStyle("display", "block");

                        var tarPos = $tar.getCoordinates();

                        var payload = currentPopover.getElement(".payload")
                            .addEvent("load", function() {
                                currentPopover.getElement(".loading").dispose();
                                //set arrow position
                                currentPopover.getElement(".arrow")
                                    .setStyle("top", Math.abs(tarPos.top - pos.y) + tarPos.height/2);
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

                        currentPopover.setPosition(pos);
                    });
                }
            },
            "mouseleave:relay(a)": _.debounce(destroyPopover, 100) //throttled to prevent hover being toggled when leaving spaces
        };
        var togglePopovers = function() {
            if(self.uiOptions.get("image_popovers")) {
                self.element.addEvents(imgEvents);
            } else {
                self.element.removeEvents(imgEvents);
            }
        };
        self.uiOptions.on("change:image_popovers", togglePopovers);
        togglePopovers();
        
        return self;
    },

    setBrouhahaChan: function(name) {
        var brouhaha = this.windows.brouhaha;
        brouhaha.currentChannel = name;
        brouhaha.window.getElement(".channel-name").text(name);
    },

    selectTab: function(tab) {
        var active = this.active;
        var win = tab.retrieve("window");
        var isChannel = util.isChannelType(win.type);
        if(!active || !isChannel || (isChannel && active.id !== constants.brouhaha)) {
            win.select();
        }
        if(this.windows.brouhaha && isChannel && !util.isBaseWindow(win.id)) {//update brouhaha window attrs
            this.setBrouhahaChan(win.name);
            tab.addClass("selected");
        }
        tab.removeClasses(["hilight-activity", "hilight-us", "hilight-speech"])
            .getSiblings(".selected:not(.detached,.brouhaha)").removeClass("selected");//remove last selection
    },

    selectWindow: function(win, deselActive) {
        win = this.parent(win, deselActive);
        this.selectTab(win.tab);
    },

    newTab: function(win, name) {
        var self = this;
        var isBrouhaha = win.id === constants.brouhaha;
        var $tab = Element.from(templates.ircTab({
            "name": isBrouhaha ? " " : name,
            closable: !util.isBaseWindow(win.id)
        }));
        self.nav.addTab($tab);
        if(isBrouhaha) $tab.addClass("brouhaha");
        $tab.store("window", win);

        return $tab;
    },

    newClient: function(client) {
        var self = this;
        var status = self.parent(client);
        //load brouhaha window (b4 connecting)
        var makeBrouhaha = function() {
            if(self.uiOptions.get("brouhaha").enabled) {
                var brouhaha = self.windows.brouhaha = self.newWindow(client, ui.WINDOW.channel, windowNames.brouhaha);
                if(!client.isConnected()) {
                    client.addEvent("userJoined:once", function(type, data) {
                        self.setBrouhahaChan(data.channel);
                        brouhaha.select();
                    });//no need to wait see IRCClient.__signedOn
                }
            } else if(self.windows.brouhaha) {
                self.windows.brouhaha.close();
                delete self.windows.brouhaha;
            }
        };

        makeBrouhaha();
        self.uiOptions.on("change:brouhaha", makeBrouhaha);

        self.parentElement.swapClass("signed-out", "signed-in");
        return status;
    },

    setWindow: function(win, hideOld) {
        this.parent(win);
        win.element.show().addClass("active")
                    .getSiblings(".active,:not(.hidden)").filter(":not(.detached)")
                    .toggle(hideOld != null && !hideOld).removeClass("active");
    },

    nickChange: function(data, client) {
        if(data.thisclient) {
            // this.getWindows(client).each(function(win) {
            //     win.setNickname(data.newnick);
            // });
            _.invoke(this.getWindows(client), "setNickname", data.newnick);
        }
    }
});
