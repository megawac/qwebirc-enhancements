
ui.WINDOW_ID_MAP = [
    {
        id: "privacy",
        keys: ["privacy policy"]
    },
    {
        id: "embedded",
        keys: ["add webchat to your site"]
    },
    {
        id: "login",
        keys: ["connection details"]
    }
];

ui.IWindows = new Class({
    windows: {},
    customWindows: {},
    windowArray: [],
    Window: ui.Window,//OVERRIDE!
    nav: null,

    getWindowIdentifier: function(name) {
        var id = name.toLowerCase()
        var wid = _.find(qwebirc.ui.WINDOW_ID_MAP, function(val) {return val.keys.contains(id);});
        return wid && wid.id || id;
    },

    getClientId: function(client) {
        return client === ui.CUSTOM_CLIENT || !client ? ui.CUSTOM_CLIENT : client.id;
    },

    newWindow: function(client, type, name) {
        var win = this.getWindow(client, name);
        if (!$defined(win)) {
            if(util.windowNeedsInput(type)) {
                this.commandhistory.addChannel(name);
            }
            var wId = this.getWindowIdentifier(name);
            var $wrapper = new Element('div.hidden').inject(this.windowsPanel);//for delegation - this is not how i should do it
            win = this.windows[this.getClientId(client)][wId] = new this.Window(this, $wrapper, client, type, name, wId);
            this.windowArray.push(win);
        }

        return win;
    },

    getWindow: function(client, name) {
        if(_.isString(client)) name = client;
        var wins = this.getWindows(client);
        if (_.isObject(wins)) 
            return wins[this.getWindowIdentifier(name)];
    },

    getWindows: function(client) {
        return this.windows[this.getClientId(client)] || this.customWindows;
    },

    getActiveWindow: function() {
        return this.active;
    },
    getActiveIRCWindow: function(client) {
        if (!this.active || this.active.type == ui.WINDOW.custom) {
            return this.windows[this.getClientId(client)][this.getWindowIdentifier(STATUS)];
        } else {
            return this.active;
        }
    },
    selectWindow: function(win) {
        if(_.isNumber(win))
            win = this.windowArray[win];
        else if(_.isString(win))
            win = this.getWindow(win);
        if(win !== this.active) {
            if (this.active) {
                this.active.deselect();
            }
            win.select();
            this.setWindow(win);
            ui.setTitle(win.name + " - " + this.options.appTitle);
            this.updateURI();
        }
        return win;
    },
    updateURI: util.noop,
    setWindow: function(win) {
        if(!this.active || (win !== this.active && !this.active.closed)) {
            this.last = this.active;
        }
        this.active = win;
    },
    __closed: function(win) {
        var winarr = this.windowArray;
        var isActive = win === this.active;

        this.commandhistory.removeChannel(win.name);
        this.nav.removeTab(win.tab);
        var index = winarr.indexOf(win);
        winarr = this.windowArray.erase(win);
        delete this.windows[this.getClientId(win.client)][win.identifier];

        if (isActive) {
            delete this.active;
            if(this.last) {//select last active window
                this.last.select();
            }
            else if (!_.isEmpty(winarr)) {//case for 2 consecutive closes
                _.nextItem(winarr, index).select();
            }
        }
    },
    nextWindow: function(direction, fromWin) {
        var windows = _.where(this.windowArray, {detached:false}),
            win = _.nextItem(windows, windows.indexOf(fromWin || this.active), direction); //get window from array
        if(win) win.select();

        return win;
    },
    prevWindow: function() {
        this.nextWindow(-1);
    },

    newCustomWindow: function(name, select, type) {
        type = type || ui.WINDOW.custom;

        var win = this.newWindow(ui.CUSTOM_CLIENT, type, name);

        if (select) this.selectWindow(win);

        return win;
    },

    addCustomWindow: function(windowName, CustomView, cssClass, options) {
        var wid = this.getWindowIdentifier(windowName);
        if (_.has(this.customWindows, wid)) {
            return this.selectWindow(this.customWindows[wid]);
        }

        var win = this.newCustomWindow(windowName, true);
        this.customWindows[wid] = win;

        win.addEvent("destroy", function() {
            delete this.customWindows[wid];
        }.bind(this));

        if(_.isString(cssClass)) {
            win.lines.addClass(cssClass);
        }

        options = _.extend({
            element: win.lines
        }, options);
        new CustomView(options)
            .addEvent("close", win.close);


        return win;
    }
});