
(function() {
    var favIcons = {};
    document.store("favicon", favIcons);
    document.addEvent("domready", function() {
        var favIcon = document.head.getElement("link[rel^='shortcut'][rel$='icon']");
        if (favIcon) {
            favIcons.normal = favIcon;
        }
    });
ui.NotificationUI = new Class({
    Implements: [Options],

    Binds: ["beep", "flash", "cancelFlash"],

    options: {
        minSoundRepeatInterval: 1000,

        notificationOptions: {//https://github.com/ttsvetko/HTML5-Desktop-Notifications
            icon: "images/qwebircsmall.png",
            title: "IRC Alert",
            body: "New notification!"
        },

        sounds: {
            sounds: [{
                id: "beep",
                url: ['beep3.ogg', 'beep3.mp3']
            }]//files in sounds/
        },
        icons: {
            empty_favicon: "images/empty_favicon.ico"
        }
    },
    canFlash: false,
    lastSound: 0,
    titleText: document.title,

    initialize: function(options) {
        this.setOptions(options);

        this.soundInit();

        if (favIcons.normal) {
            favIcons.empty = new Element("link", {
                        rel: 'shortcut icon',
                        type: 'image/x-icon',
                        href: this.options.icons.empty_favicon
                    });
            this.flashing = false;
            this.canFlash = true;
        }
    },
    beep: function() {
        this.playSound('beep');
    },
    playSound: function(alias) {
        if (this.soundPlayer.isReady() && (Date.now() - this.lastSound > this.options.sounds.minSoundRepeatInterval)) {
            this.lastSound = Date.now();
            this.soundPlayer.play(alias, {
                volume: this.uiOptions2.get("volume")
            });
        }
    },
    soundInit: function() {
        //used to have a bunch of flash checks. going to let the sm handle it
        if(!(this.soundPlayer instanceof sound.SoundPlayer)) {
            this.soundPlayer = new sound.SoundPlayer(this.options.sounds);
        }
    },

    flash: function(options) {
        var self = this;
        if ((!options.force && document.hasFocus()) || !self.canFlash || self.flashing)
            return;

        self.titleText = document.title;

        var flash = function() {
            var vis = self.toggleFavIcon();
            ui.setTitle(vis ? self.titleText : lang.activityNotice.message);
        };

        if(self.uiOptions2.get("dn_state")) {
            var opts = _.extend({/*timeout: self.uiOptions2.get("dn_duration")*/}, self.options.notificationOptions, options);
            self.__notice = notify.createNotification(opts.title, opts);
            self.__notice.waiter = (function() { self.__notice.close(); self.__notice = null; }).delay(self.uiOptions2.get("dn_duration"));
        }

        self.flashing = true;
        // flashA();
        self.__flasher = _.periodical(flash, 750);
        window.addEvents({//whatever comes first
            "mousedown:once": self.cancelFlash,
            "keydown:once": self.cancelFlash,
            "focus:once": self.cancelFlash
        });
    },
    cancelFlash: function() {
        this.flashing = false;

        if(this.__flasher){
            $clear(this.__flasher);
            this.__flasher = null;
        }

        if(this.__notice) {
            $clear(this.__notice.waiter);
            this.__notice.close();
            this.__notice = null;
        }

        this.toggleFavIcon(true);
        ui.setTitle(this.titleText);
    },
    //not sure if changing the favicon is a good idea - messes with peoples bookmarks
    toggleFavIcon: function(state) {
        var isNormalVis = !!favIcons.normal.getParent();
        var vis = _.isBoolean(state) ? state : !isNormalVis;
        if(vis && !isNormalVis) {
            favIcons.normal.replaces(favIcons.empty);
        }
        else if (!vis && isNormalVis) {
            favIcons.empty.replaces(favIcons.normal);
        }
        return vis;
    }
});
})();