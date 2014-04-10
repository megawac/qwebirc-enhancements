/**
 * see http://indiegamr.com/the-state-of-audio-in-html5-games/
 * @depends [sound]
 * @provides [sound/Player]
 */
sound.SoundPlayer = new Class({
    Implements: [Options, Events],
    options: {
        soundsurl: "/sound/",//directory of sounds for sm
        swfurl: "/swf",
        flashVersion: 8,
        sounds: [],
        preferFlash: false//use html5 if possible
    },
    loadingSM: false,

    initialize: function(options) {
        var self = this.setOptions(options);
        var opts = this.options;

        if (self.loadingSM !== false) return;
        self.loadingSM = true;
        if (self.sm) {
            self.fireEvent("ready");
            return;
        }

        var soundinit = function() {
            var sm = self.sm = window.soundManager;
            self.play = sm.play;
            //https://www.scirra.com/blog/44/on-html5-audio-formats-aac-and-ogg
            sm.setup({
                url: opts.swfurl,
                preferFlash: opts.preferFlash,
                onready: function() {
                    opts.sounds.each(function(sound) {//load all sounds here
                        // self.register(sound.id, opts.soundsurl + sound.url + extension);
                        sound = _.clone(sound);
                        sound.url = _.map(sound.url, function(path) {
                            return path.contains("/") ? path : opts.soundsurl + path;
                        });
                        sm.createSound(sound);
                    });
                    self.loadingSM = false;
                    self.fireEvent("ready");
                }
            }).beginDelayedInit();
        };

        //load sound manager
        if(window.soundManager) {
            soundinit();
        }
        else {//lazy load
            components.loader.javascript("<%= getFileURL('soundManager') %>").then(soundinit);//see gruntfile
        }
    },

    register: function(alias,src) {
        this.sm.createSound(alias, src);
    },

    isReady: function() {
        return this.sm && this.loadingSM === false;
    }
});
