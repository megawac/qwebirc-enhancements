
//this is pretty abstract do you really need this on top of the sound player ontop of the sound module
ui.Beeper = new Class({
    Binds: ["beep", "playSound"],

    options: {
        minSoundRepeatInterval: 1000
    },
    initialize: function(uiOptions) {
        $extend(this.options, uiOptions.ui.options.sounds);
        this.uiOptions = uiOptions;

        this.soundInited = false;
        this.soundReady = false;

        if (this.uiOptions.BEEP_ON_MENTION)
            this.soundInit();
    },
    soundInit: function() {
        var self = this;

        //used to have a bunch of flash checks. going to let the sm handle it
        if(self.soundInited) {
            return;
        }
        self.soundInited = true;

        self.soundPlayer = new qwebirc.sound.SoundPlayer(self.options);
        self.soundPlayer.addEvent("ready", function() {
            self.soundReady = true;
        });

        self.soundPlayer.load();
    },
    beep: function() {
        this.playSound('beep');
    },
    playSound: function(alias) {
        if (this.soundReady && this.uiOptions.BEEP_ON_MENTION) {
            this.soundReady = false;
            this.soundPlayer[alias]();
            (function() { //throttle sound intervals
                this.soundReady = true;
            }).delay(this.options.minSoundRepeatInterval, this);
        }
    }
});

ui.Flasher = new Class({
    Binds: ["flash", "cancelFlash"],

    initialize: function(uiOptions) {
        this.uiOptions = uiOptions;

        this.windowFocused = false;
        this.canUpdateTitle = true;
        this.titleText = document.title;

        var favIcon = this._getFavIcon();
        if ($defined(favIcon)) {
            this.favIcon = favIcon;
            this.favIconParent = favIcon.parentNode;
            this.favIconVisible = true;

            // this.emptyFavIcon = new Element("link");
            // this.emptyFavIcon.rel = "shortcut icon";
            // this.emptyFavIcon.href = qwebirc.global.staticBaseURL + "images/empty_favicon.ico";
            // this.emptyFavIcon.type = "image/x-icon";
            this.emptyFavIcon = Element.from(templates.favicon({link: uiOptions.ui.options.icons.empty_favicon}));

            this.flashing = false;

            this.canFlash = true;
            var cancel = this.cancelFlash;
            document.addEvent("mousedown", cancel);
            document.addEvent("keydown", cancel);
        } else {
            this.canFlash = false;
        }
    },
    _getFavIcon: function() {
        return document.head.getElement("link[rel^='shortcut'][rel$='icon']");//should just add an id
    },
    flash: function() {
        var self = this;
        if (!self.uiOptions.FLASH_ON_MENTION || self.windowFocused || !self.canFlash || self.flashing)
            return;

        self.titleText = document.title; /* just in case */

        var flash = function() {
            var vis = self.toggleFavIcon();
            self.canUpdateTitle = vis;
            document.title = vis ? self.titleText : lang.activityNotice.message;
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
        if (!this.canFlash || !$defined(this.flasher))
            return;

        this.flashing = false;

        $clear(this.flasher);
        this.flasher = undefined;

        this.toggleFavIcon(true);
        document.title = this.titleText;
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
