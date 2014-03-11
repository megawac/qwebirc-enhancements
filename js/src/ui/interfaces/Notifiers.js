/**
 * Implements all the notification features desktop notifications/flashing/beeps
 *
 * @depends [util/uihelpers, util/utils, util/lang, ui/UIOptions, sound/Player]
 * @provides [ui/Notifiers]
 */
(function() {
    /* global sound, notify */
    var favIcons = {};
    document.store("favicon", favIcons);
    document.addEvent("domready", function() {
        var favIcon = document.getElement("link[rel^='shortcut'][rel$='icon']");
        if (favIcon) {
            favIcons.normal = favIcon;
            favIcons.empty = new Element("link", {
                rel: "shortcut icon",
                type: "image/x-icon",
                href: "images/empty_favicon.ico"
            });
        }
    });
    ui.INotifiers = new Class({
        options: {
            notificationOptions: { //https://github.com/ttsvetko/HTML5-Desktop-Notifications
                icon: "images/qwebircsmall.png",
                title: lang.getter("ircAlert"),
                body: "New notification!"
            },

            sounds: { //files in sounds/
                minSoundRepeatInterval: 1000,
                sounds: [{
                    id: "beep",
                    url: ["beep3.ogg", "beep3.mp3"]
                }]
            }
        },
        _notices: [],
        canFlash: false,
        lastSound: 0,
        titleText: document.title,

        beep: function() {
            return this.playSound("beep");
        },
        playSound: function(alias) {
            if(!this.soundPlayer) {
                this.soundInit();
                this.soundPlayer.addEvent("ready:once", this.playSound.bind(this, alias));
            }
            else if (this.soundPlayer.isReady() && ((Date.now() - this.lastSound) > this.options.sounds.minSoundRepeatInterval)) {
                this.lastSound = Date.now();
                this.soundPlayer.play(alias, {
                    volume: this.uiOptions.get("volume")
                });
            }
            return this;
        },
        soundInit: function() {
            //used to have a bunch of flash checks. going to let the sm handle it
            if(!(this.soundPlayer instanceof sound.SoundPlayer)) {
                this.soundPlayer = new sound.SoundPlayer(this.options.sounds);
            }
        },

        flash: function(force) {
            var self = this;
            if ((!force && document.hasFocus()) || !self.canFlash || self.flashing)
                return;

            self.titleText = document.title;

            var flash = function() {
                var vis = self.toggleFavIcon();
                ui.setTitle(vis ? self.titleText : lang.activityNotice);
            };

            var flasher = self._flasher = {
                timer: setInterval(flash, 750),
                evt: {//whatever comes first
                    "mousedown": self.cancelFlash,
                    "keydown": self.cancelFlash,
                    "focus": self.cancelFlash
                }
            };
            self.flashing = true;
            window.addEvents(flasher.evt);
            return self;
        },

        cancelFlash: function() {
            this.flashing = false;

            clearInterval(this._flasher.timer);
            window.removeEvents(this._flasher.evt);
            this._flasher = null;

            this._notices.each(function(notice) {
                clearTimeout(notice.waiter);
                notice.close();
            }).empty();

            this.toggleFavIcon(true);
            ui.setTitle(this.titleText);
        },

        showNotice: function(options, force) {
            var self = this;
            if((force || !document.hasFocus()) && self.uiOptions.get("dn_state")) {
                var opts = _.extend({/*timeout: self.uiOptions.get("dn_duration")*/}, self.options.notificationOptions, options);
                var notice = notify.createNotification(_.result(opts, "title"), opts);
                var timer = notice.close.delay(self.uiOptions.get("dn_duration"), notice);
                self._notices.push({
                    waiter: timer,
                    close: notice.close
                });
            }
            return self;
        },

        //not sure if changing the favicon is a good idea - messes with peoples bookmarks
        toggleFavIcon: function(state) {
            var isNormalVis = !!favIcons.normal.parentNode;
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
