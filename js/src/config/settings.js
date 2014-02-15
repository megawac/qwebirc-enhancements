/**
 * user settings
 * @depends [config, cookies]
 * @provides [config/Settings]
 */
config.Settings = new Class({
    Extends: Epitome.Model.Storage,
    options: {
        defaults: {
            "channels": [],
            "nickname": "",
            "username": "",
            "password": "",
            "auth": false,
            "newb": true //first visit
        },
        key: cookies.settings,
        minimize: false,

        onReady: function() {
            this.loaded = true;
        }
    },

    set: function(key, data) {
        this.parent(key, data);
        if(this.loaded) {//set is called when initing if we save we will lose state
            this.save();
        }
        return this;
    },

    unset: function(key) {
        this.parent(key);
        return this.save();
    }
});
