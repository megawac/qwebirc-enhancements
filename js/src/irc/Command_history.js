
irc.CommandHistory = new Class({
    Extends: Epitome.Model.Storage,
    Implements: [Options],
    options: {
        lines: 20,
        minlen: 2,
        storage: {
            fallback: false//dont save on shit browsers
        },
        key: "cmdhist"
    },

    addLine: function(name, line) {
        var data = this.get(name);
        if(line.length > this.options.minlen && !data.contains(line)) {
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
        this.save();
    }
});
