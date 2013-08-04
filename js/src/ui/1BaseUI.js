
ui.BaseUI = new Class({
    Implements: [Events],
    initialize: function(parentElement, windowClass, uiName, options) {
        var self = this;
        self.options = options;

        self.windows = {};
        self.clients = {};
        self.windows[ui.CUSTOM_CLIENT] = {};
        self.windowArray = [];
        self.windowClass = windowClass;
        self.parentElement = parentElement;
        self.parentElement.addClass("qwebirc");
        self.parentElement.addClass("qwebirc-" + uiName);
        self.commandhistory = new irc.CommandHistory();
        self.clientId = 0;
    },
    newClient: function(client) {
        client.id = this.clientId++;
        // client.hilightController = new ui.HilightController(client);

        this.windows[client.id] = {};
        this.clients[client.id] = client;
        var win = this.newWindow(client, ui.WINDOW_STATUS, STATUS);
        this.selectWindow(win);

        client.addEvent("nickChange", this.nickChange);

        return win;
    },
    getClientId: function(client) {
        return client === ui.CUSTOM_CLIENT ? ui.CUSTOM_CLIENT : client.id;
    },
    getWindowIdentifier: function(client, type, name) {
        if (type === ui.WINDOW_MESSAGES)
            return "-M";
        else if (type === ui.WINDOW_STATUS)
            return "";
        else if (client === ui.CUSTOM_CLIENT)
            return "_" + name;
        else
            return "_" + client.toIRCLower(name);
    },
    newWindow: function(client, type, name) {
        var win = this.getWindow(client, type, name);
        if ($defined(win))
            return win;

        var wId = this.getWindowIdentifier(client, type, name);
        win = this.windows[this.getClientId(client)][wId] = new this.windowClass(this, client, type, name, wId);
        this.windowArray.push(win);

        return win;
    },
    nickChange: $empty,

    getWindow: function(client, type, name) {
        var wins = this.windows[this.getClientId(client)];
        if (!$defined(wins))
            return null;

        return wins[this.getWindowIdentifier(client, type, name)];
    },
    getActiveWindow: function() {
        return this.active;
    },
    getActiveIRCWindow: function(client) {
        if (!this.active || this.active.type == ui.WINDOW_CUSTOM) {
            return this.windows[this.getClientId(client)][this.getWindowIdentifier(client, ui.WINDOW_STATUS)];
        } else {
            return this.active;
        }
    },
    __setActiveWindow: function(win) {
        this.active = win;
    },
    selectWindow: function(win) {
        if(Type.isNumber(win))
            win = this.windowArray[win];
        else if(Type.isString(win)) 
            win = this.windows[win];
        if (this.active) {
            if(win === this.active) return;
            this.active.deselect();
        }
        win.select();
        this.updateTitle(win.name + " - " + this.options.appTitle);
    },
    nextWindow: function(direction, fromWin) {
        var windows = this.windowArray,
            win = windows.next(windows.indexOf(fromWin || this.active), direction); //get window from array
        this.selectWindow(win);

        return win;
    },
    prevWindow: function() {
        this.nextWindow(-1);
    },
    __closed: function(win) {
        var winarr = this.windowArray;
        if (win.active) {
            // this.active = undefined;
            if (winarr.length === 1) {
                winarr.empty();
            } else {
                var index = winarr.indexOf(win);
                if(index === -1) {
                    return;
                } else if (index === (winarr.length - 1)) {
                    this.prevWindow();
                } else {
                    this.nextWindow();
                }
            }
        }

        winarr = this.windowArray.erase(win);
        delete this.windows[this.getClientId(win.client)][win.identifier];
    },
/*
      this shouldn't be called by overriding classes!
      they should implement their own!
      some form of user input MUST be received before an
      IRC connection is made, else users are going to get
      tricked into getting themselves glined
    */
    loginBox: function(callback, initialNickname, initialChannels, autoConnect, autoNick, storage) {
        ui.GenericLoginBox(this.parentElement, callback, initialNickname, initialChannels, autoConnect, autoNick, this.options.networkName, storage);
    }
});
