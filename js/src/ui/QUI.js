/**
 * extended ui
 *
 * @depends [ui/StandardUI, ui/QUIWindow, components/ImagePopover]
 * @provides [ui/QUI]
 */
ui.QUI = new Class({
    Extends: ui.StandardUI,
    // Binds: ["__createChannelMenu"],
    Window: ui.QUIWindow,
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
        self.popovers = new components.ImagePopover(self.element, self.uiOptions.get("image_popovers"));
        self.uiOptions.on("change:image_popovers", self.popovers.toggle.bind(self.popovers));
        return self;
    },

    setBrouhahaChan: function(name) {
        var brouhaha = this.windows.brouhaha;
        brouhaha.currentChannel = name;
        brouhaha.window.getElement(".channel-name").text(name);
        return brouhaha;
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
        var windows = self.windows;
        var status = self.parent(client);
        //load brouhaha window (b4 connecting)
        var makeBrouhaha = function() {
            if(self.uiOptions.get("brouhaha").enabled) {
                windows.brouhaha = self.newWindow(client, ui.WINDOW.channel, windowNames.brouhaha);
            } else if (windows.brouhaha) {
                windows.brouhaha.close();
                delete windows.brouhaha;
            }
        };

        client.addEvent("userJoined:once", function(type, data) {
            if (windows.brouhaha) {
                self.setBrouhahaChan(data.channel).select();
            } else {
                _.result(_.find(self.getWindows(client), function(chan) {
                    return util.isChannel(chan.name);
                }), "select");
            }
        });//no need to wait see IRCClient.__signedOn

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
