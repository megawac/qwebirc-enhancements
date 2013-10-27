
irc.CommandHistory = new Class({
    Extends: Epitome.Model.Storage,
    Implements: [Options],
    options: {
        lines: 20,
        minlen: 2,
        storage: {
            fallback: false//dont save on shit browsers
        },
        store: !Browser.isMobile,
        key: cookies.history
    },

    addLine: function(name, line) {
        var data = this.get(name).erase(line);
        if(line.length > this.options.minlen) {
            data.unshift(line);
            if (data.length > this.options.lines) {
                data.pop();
            }
            this.set(name, data);
            this.save();
        }
    },

    addChannel: function(name) {
        if(!this.get(name)) this.set(name, []);
    },

    removeChannel: function(name) {
        this.unset(name);
        if(this.options.store) this.save();
    },

    _filter: _.not(_.isEmpty)
});
