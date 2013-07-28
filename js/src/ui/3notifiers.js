

ui.NotificationUI = new Class({
    Extends: ui.StandardUI,

    Binds: ["beep"],

    options: {
        minSoundRepeatInterval: 1000
    },
    initialize: function(/*parentElement, windowClass, uiName, options*/) {
        // this.parent(parentElement, windowClass, uiName, options);
        this.parent.apply(this, arguments);


        if (this.uiOptions2.get("beep_on_mention")) {
            this.soundInit();
            this.lastSound = 0;
        }


        var flasher = this.__flasher = new ui.Flasher(this.options, this.uiOptions2);

        this.flash = flasher.flash;
        this.cancelFlash = flasher.cancelFlash;
    },
    setBeepOnMention: function(value) {
        if (value)
            this.soundInit();
    },
    updateTitle: function(text) {
        if (this.__flasher.updateTitle(text))
            ui.setTitle(text);
    },
    focusChange: function(value) {
        this.parent(value);
        this.__flasher.focusChange(value);
    },
    beep: function() {
        this.playSound('beep');
    },
    playSound: function(alias) {
        if (this.soundPlayer.isReady() && this.uiOptions2.get("beep_on_mention") &&
                (Date.now() - this.lastSound > this.options.sounds.minSoundRepeatInterval)) {
            this.lastSound = Date.now();
            this.soundPlayer.sounds[alias]();
        }
    },

    soundInit: function() {
        //used to have a bunch of flash checks. going to let the sm handle it
        if(!$defined(this.soundPlayer)) {
            this.soundPlayer = new sound.SoundPlayer(this.options.sounds).load();
        }
    }
});

ui.Flasher = new Class({
    Binds: ["flash", "cancelFlash"],

    initialize: function(opts, uiOptions) {
        this.uiOptions = uiOptions;

        this.windowFocused = false;
        this.canUpdateTitle = true;
        this.titleText = document.title;

        var favIcon = document.head.getElement("link[rel^='shortcut'][rel$='icon']");
        if ($defined(favIcon)) {
            this.favIcon = favIcon;
            this.favIconParent = favIcon.parentNode;
            this.favIconVisible = true;

            // this.emptyFavIcon = new Element("link");
            // this.emptyFavIcon.rel = "shortcut icon";
            // this.emptyFavIcon.href = qwebirc.global.staticBaseURL + "images/empty_favicon.ico";
            // this.emptyFavIcon.type = "image/x-icon";
            this.emptyFavIcon = new Element("link", {
                    rel: 'shortcut icon',
                    type: 'image/x-icon',
                    href: opts.icons.empty_favicon
                });

            this.flashing = false;

            this.canFlash = true;
            document.addEvents({
                "mousedown:once": this.cancelFlash,
                "keydown:once": this.cancelFlash
            });
        } else {
            this.canFlash = false;
        }
    },
    flash: function() {
        var self = this;
        if (!self.uiOptions.get("flash_on_mention") || self.windowFocused || !self.canFlash || self.flashing)
            return;

        self.titleText = document.title; /* just in case */

        var flash = function() {
            var vis = self.toggleFavIcon();
            self.canUpdateTitle = vis;
            ui.setTitle(vis ? self.titleText : lang.activityNotice.message);
        };

        //http://mootools.net/forge/p/tab_alert
        // var ex3 = yourInstance = new tabAlert({
        //         text: lang.activityNotice.message,
        //         ticker: true,
        //         onLoop: flash
        //     });

        self.flashing = true;
        // flashA();
        self.flasher = flash.periodical(750);
    },
    cancelFlash: function() {
        if (!$defined(this.flasher))
            return;

        this.flashing = false;

        $clear(this.flasher);
        this.flasher = undefined;

        this.toggleFavIcon(true);
        ui.setTitle(this.titleText);
        this.canUpdateTitle = true;
    },
    //not sure if changing the favicon is a good idea - messes with peoples bookmarks
    toggleFavIcon: function(state) {
        var vis = $defined(state) ? state : !this.favIconVisible;
        if(vis){
            if (!this.favIconVisible) {
                this.favIcon.replaces(this.emptyFavIcon);
            }
        }
        else{
            if (this.favIconVisible) {
                this.emptyFavIcon.replaces(this.favIcon);
            }
        }
        this.favIconVisible = vis;
        return vis;
    },
    updateTitle: function(text) {
        this.titleText = text;
        return this.canUpdateTitle;
    },
    focusChange: function(value) {
        this.windowFocused = value;

        if (value)
            this.cancelFlash();
    }
});
