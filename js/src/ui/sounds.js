
//http://indiegamr.com/the-state-of-audio-in-html5-games/
//consider switching to soundjs
//http://www.createjs.com/Docs/SoundJS/modules/SoundJS.html

sound.SoundPlayer = new Class({
    Implements: [Options, Events],
    options: {
        soundManagersrc: "//cdnjs.cloudflare.com/ajax/libs/SoundJS/0.4.1/soundjs.min.js",
        sounds: "/sound/",
        beepsrc: "beep.mp3"
    },
    initialize: function(options) {
        this.setOptions(options);
        this.loadingSWF = false;
		this.sm = undefined; //sound manager
        this.sounds = {};
    },
    load: function() {
        window.addEvent("domready", this.loadSoundManager.bind(this));
        return this;
    },
    loadSoundManager: function() {
        var self = this,
			opts = self.options;
        if (self.loadingSWF !== false)
            return;
        self.loadingSWF = true;
        if ($defined(self.sm)) { //... ugh
            self.fireEvent("ready");
            return;
        }

        var soundinit = function() {
			//var sm = self.sm = window.soundManager;
			var sm = self.sm = window.createjs.Sound;
            sm.url = opts.sounds;

            //load all sounds here
            self.register("beep", opts.sounds + opts.beepsrc);
            sm.addEventListener("fileload", self.fireEvent.bind(self, "ready"));
            self.loadingSWF = undefined;
        };

		//load sound manager
        Asset.javascript(opts.soundManagersrc, {onLoad: soundinit});
    },
	register: function(alias,src) {
		this.sm.registerSound(src, alias);
		this.sounds[alias] = _.partial(this.sm.play, alias);
	},
    play: function(src) {
        this.sm.play(src);
        return this;
    },

    isReady: function() {
        return this.sm.isReady();
    }
});
