/**
 * window interface
 *
 * @depends [ui/Window, util/constants, util/utils, util/uihelpers]
 * @provides [ui/IWindows]
 */
ui.IWindows = new Class({
    windows: {},
    customWindows: {},
    windowArray: [],
    Window: ui.Window,//OVERRIDE!
    nav: null,

    getWindowIdentifier: function(name) {
        for(var wid in windowNames) { //check if base window
            if (windowNames[wid] === name) return wid;
        }
        return name.toLowerCase();
    },

    getClientId: function(client) {
        return !client ? ui.WINDOW.custom : client.id;
    },

    newWindow: function(client, type, name) {
        var win = this.getWindow(client, name);
        if (!win) {
            if (util.windowNeedsInput(type)) {
                this.commandhistory.addChannel(name);
            }
            var wId = this.getWindowIdentifier(name);
            var $wrapper = Element.from(templates["window-container"]({})).inject(this.windowsPanel);//for delegation - this is not how i should do it
            win = this.windows[this.getClientId(client)][wId] = new this.Window(this, $wrapper, client, type, name, wId);
            this.windowArray.push(win);
        }

        return win;
    },

    /* sets a window to take up a set number of cells on the grid - for now just supports 1 window */
    linkWindows: function(win, gridset) {
        gridset = _.extend({element: win.element, fill: false, cols: "", sibs: [this.windowArray[0]]}, gridset);
        var sibs = gridset.sibs;
        var self = this;
        var makeO = function(win) {
            self.selectWindow(win, false);
            return {
                cols: win.element.get("data-col"),
                fill: win.element.get("data-col-fill") != null,
                element: win.element
            };
        };
        var makeGrid = function(win) {//for one ele
            util.createGrid([makeO(win)]);
        };
        var winEvents = {
            "destroy": function() {
                sibs.each(function(sib) {
                    makeGrid(sib);
                    sib.removeEvents(sib._gridEvents);
                    delete sib._gridEvents;
                });
            },
            "selected": function() {
                sibs.each(function(sib) {
                    self.selectWindow(sib, false);
                });
            },
            "deselected": _.debounce(function() {
                _.invoke(sibs, "deselect");
            }, 5),
            "detached": function() {
                sibs.each(makeGrid);
            },
            "attached": function() {
                sibs.each(function(sibWin) {
                    util.createGrid([
                        gridset,
                        makeO(sibWin)
                    ]);
                });
            }
        };

        gridset.sibs.each(function(sibWin) {
            util.createGrid([
                gridset,
                makeO(sibWin)
            ]);

            var events = {
                "destroy": function() {
                    util.createGrid([makeO(win)]);
                    win.removeEvents(winEvents);
                },
                "selected": function() {
                    self.selectWindow(win, false);
                },
                "deselected": _.debounce(win.deselect.bind(win), 5), //hacky to prevent self call
                "detached": function() {
                    makeGrid(win);
                },
                "attached": function() {
                    util.createGrid([
                        gridset,
                        makeO(sibWin)
                    ]);
                }
            };

            sibWin.addEvents(events)._gridEvents = events;
        });

        win.addEvent(winEvents);

        return win;
    },

    getWindow: function(client, name) {
        if (_.isString(client)) name = client;
        var wins = this.getWindows(client);
        if (_.isObject(wins)) {
            return wins[this.getWindowIdentifier(name)];
        }
    },

    getWindows: function(client) {
        return this.windows[this.getClientId(client)] || this.customWindows;
    },

    getActiveWindow: function() {
        return this.active;
    },
    getActiveIRCWindow: function(client) {
        if (!this.active || this.active.type == ui.WINDOW.custom) {
            return this.windows[this.getClientId(client)][this.getWindowIdentifier(constants.status)];
        } else {
            return this.active;
        }
    },
    selectWindow: function(win, deselActive) {
        if (_.isNumber(win)) {
            win = this.windowArray[win];
        }
        else if (_.isString(win)) {
            win = this.getWindow(win);
        }
        if (win !== this.active) {
            if (this.active && (deselActive == null || deselActive)) {
                _.invoke(this.windowArray, "deselect"); //ensure all windows selections are removed
            }
            this.setWindow(win, deselActive);
            win.select();
            ui.setTitle(win.name + " - " + this.options.appTitle);
            this.updateURI();
        }
        return win;
    },
    
    setWindow: function(win/*, deselActive*/) {
        if (!this.active || (win !== this.active && !this.active.closed)) {
            this.last = this.active;
        }
        this.active = win;
    },

    closeWindow: function(win) {
        var winarr = this.windowArray;
        var isActive = win === this.active;

        this.commandhistory.removeChannel(win.name);
        this.nav.removeTab(win.tab);
        var index = winarr.indexOf(win);
        winarr = this.windowArray.erase(win);
        delete this.windows[this.getClientId(win.client)][win.id];

        if (isActive) {
            delete this.active;
            if (this.last) {//select last active window
                this.last.select();
            }
            else if (!_.isEmpty(winarr)) {//case for 2 consecutive closes
                util.nextItem(winarr, index).select();
            }
        }
    },

    nextWindow: function(direction, fromWin) {
        var windows = _.where(this.windowArray, {detached:false});
        var win = util.nextItem(windows, windows.indexOf(fromWin || this.active), direction); //get window from array
        if (win) win.select();

        return win;
    },

    prevWindow: function() {
        this.nextWindow(-1);
    },

    newCustomWindow: function(name, select, type) {
        type = type || ui.WINDOW.custom;

        var win = this.newWindow(null, type, name);

        if (select) this.selectWindow(win);

        return win;
    },

    addCustomWindow: function(windowName, CustomView, cssClass, options) {
        var self = this;
        var wid = self.getWindowIdentifier(windowName);
        if (_.has(self.customWindows, wid)) {
            return self.selectWindow(self.customWindows[wid]);
        }

        var win = self.newCustomWindow(windowName, true);
        self.customWindows[wid] = win;

        win.addEvent("destroy", function() {
            delete self.customWindows[wid];
        });

        win.lines.addClasses(["custom", cssClass || ""]);

        options = _.extend({
            element: win.lines
        }, options);
        new CustomView(options)
            .addEvent("close", win.close);

        return win;
    }
});
