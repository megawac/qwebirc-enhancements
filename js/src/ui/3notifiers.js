

ui.NotificationUI = new Class({
    Extends: ui.StandardUI,

    Binds: ["beep", "flash", "cancelFlash"],

    options: {
        minSoundRepeatInterval: 1000,

        notificationOptions: {//https://github.com/ttsvetko/HTML5-Desktop-Notifications
            icon: "images/qwebircsmall.png",
            title: "IRC Alert",
            body: "New notification!"
        }
    },
    initialize: function() {
        // this.parent(parentElement, windowClass, uiName, options);
        this.parent.apply(this, arguments);


        this.soundInit();
        this.lastSound = 0;

        this.windowFocused = false;
        this.titleText = document.title;

        var favIcon = document.head.getElement("link[rel^='shortcut'][rel$='icon']");
        if ($defined(favIcon)) {
            this.favIcon = favIcon;
            // this.favIconParent = favIcon.getParent();
            this.favIconVisible = true;
            this.emptyFavIcon = new Element("link", {
                    rel: 'shortcut icon',
                    type: 'image/x-icon',
                    href: this.options.icons.empty_favicon
                });

            this.flashing = false;
            this.canFlash = true;
        } else {
            this.canFlash = false;
        }
    },
    setBeepOnMention: function(value) {
        if (value)
            this.soundInit();
    },
    updateTitle: function(text) {
        ui.setTitle(text);
    },
    beep: function() {
        this.playSound('beep');
    },
    playSound: function(alias) {
        if (this.soundPlayer.isReady() && (Date.now() - this.lastSound > this.options.sounds.minSoundRepeatInterval)) {
            this.lastSound = Date.now();
            this.soundPlayer.sounds[alias]();
        }
    },

    soundInit: function() {
        //used to have a bunch of flash checks. going to let the sm handle it
        if(!$defined(this.soundPlayer)) {
            this.soundPlayer = new sound.SoundPlayer(this.options.sounds).load();
        }
    },
    flash: function(options) {
        var self = this;
        if (document.hasFocus() || !self.canFlash || self.flashing)
            return;

        self.titleText = document.title;

        var flash = function() {
            var vis = self.toggleFavIcon();
            ui.setTitle(vis ? self.titleText : lang.activityNotice.message);
        };

        if(self.uiOptions2.get("dn_state")) {
            var opts = _.extend({/*timeout: self.uiOptions2.get("dn_duration")*/}, self.options.notificationOptions, options);
            self.__notice = notify.createNotification(opts.title, opts);
            (function() { self.__notice.close(); self.__notice = null; }).delay(self.uiOptions2.get("dn_duration"));
        }

        self.flashing = true;
        // flashA();
        self.__flasher = flash.periodical(750);
        window.addEvents({//whatever comes first
            "mousedown:once": self.cancelFlash,
            "keydown:once": self.cancelFlash,
            "focus:once": self.cancelFlash
        });
    },
    cancelFlash: function() {
        this.flashing = false;

        if(this.__flasher)
            $clear(this.__flasher);
        this.__flasher = null;

        if(this.__notice)
            this.__notice.close();
        this.__notice = null;

        this.toggleFavIcon(true);
        ui.setTitle(this.titleText);
    },
    //not sure if changing the favicon is a good idea - messes with peoples bookmarks
    toggleFavIcon: function(state) {
        var vis = $defined(state) ? state : !this.favIconVisible;
        this.favIconVisible = vis;
        if(vis && !this.favIconVisible) {
            this.favIcon.replaces(this.emptyFavIcon);
        }
        else if (!vis && this.favIconVisible) {
            this.emptyFavIcon.replaces(this.favIcon);
        }
        return vis;
    }
});
