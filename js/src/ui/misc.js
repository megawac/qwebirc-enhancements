

//not a class?
ui.MENU_ITEMS = (function() {
    function isOpped(nick) {
        var channel = this.name; /* window name */
        var myNick = this.client.nickname;

        return this.client.nickOnChanHasAtLeastPrefix(myNick, channel, "@");
    }

    function isVoiced(nick) {
        var channel = this.name;
        var myNick = this.client.nickname;

        return this.client.nickOnChanHasPrefix(myNick, channel, "+");
    }

    function targetOpped(nick) {
        var channel = this.name;
        return this.client.nickOnChanHasPrefix(nick, channel, "@");
    }

    function targetVoiced(nick) {
        var channel = this.name;
        return this.client.nickOnChanHasPrefix(nick, channel, "+");
    }

    function command(cmd) {
        return function(nick) {
            this.client.exec("/" + cmd + " " + nick);
        };
    }

    return [{
        text: "whois",
        fn: command("whois"),
        predicate: true
    }, {
        text: "query",
        fn: command("query"),
        predicate: true
    }, {
        text: "slap",
        fn: function(nick) {
            this.client.exec("/ME " + util.formatter(lang.fishbot, {
                'nick': nick
            }));
        },
        predicate: true
    }, {
        text: "kick",
        /* TODO: disappear when we're deopped */
        fn: function(nick) {
            this.client.exec("/KICK " + nick + " wibble");
        },
        predicate: isOpped
    }, {
        text: "op",
        fn: command("op"),
        predicate: prelude.andand(isOpped, Functional.not(targetOpped))
    }, {
        text: "deop",
        fn: command("deop"),
        predicate: prelude.andand(isOpped, targetOpped)
    }, {
        text: "voice",
        fn: command("voice"),
        predicate: prelude.andand(isOpped, Functional.not(targetVoiced))
    }, {
        text: "devoice",
        fn: command("devoice"),
        predicate: prelude.andand(isOpped, targetVoiced)
    }];
})();


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

        self.windowFocused = true;

        if (Browser.Engine.trident) {
            var checkFocus = function() {
                    var hasFocus = document.hasFocus();
                    if (hasFocus !== self.windowFocused) {
                        self.windowFocused = hasFocus;
                        self.focusChange(hasFocus);
                    }
                };

            checkFocus.periodical(100, self);
        } else {
            var blur = function() {
                    if (self.windowFocused) {
                        self.windowFocused = false;
                        self.focusChange(false);
                    }
                },
                focus = function() {
                    if (!self.windowFocused) {
                        self.windowFocused = true;
                        self.focusChange(true);
                    }
                };

            /* firefox requires both */

            document.addEvent("blur", blur);
            window.addEvent("blur", blur);
            document.addEvent("focus", focus);
            window.addEvent("focus", focus);
        }
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
        if (this.active)
            this.active.deselect();
        win.select();
        this.updateTitle(win.name + " - " + this.options.appTitle);
    },
    updateTitle: function(text) {
        ui.setTitle(text);
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
    },
    focusChange: function(newValue) {
        window.ctrl = 0;
        var win = this.getActiveWindow();
        if ($defined(win))
            win.focusChange(newValue);
    }
});

ui.StandardUI = new Class({
    Extends: ui.BaseUI,
    Binds: ["__handleHotkey", "optionsWindow", "embeddedWindow", "urlDispatcher", "resetTabComplete"],

    UICommands: ui.UI_COMMANDS,
    initialize: function(parentElement, windowClass, uiName, options) {
        this.parent(parentElement, windowClass, uiName, options);

        this.tabCompleter = new ui.TabCompleterFactory(this);
        this.uiOptions = new ui.DefaultOptionsClass(this, options.uiOptionsArg);
        this.customWindows = {};

        this.__styleValues = {
            hue: this.uiOptions.STYLE_HUE,
            saturation: 0,
            lightness: 0
        };
        if ($defined(this.options.hue))
            this.__styleValues.hue = this.options.hue;
        if ($defined(this.options.saturation))
            this.__styleValues.saturation = this.options.saturation;
        if ($defined(this.options.lightness))
            this.__styleValues.lightness = this.options.lightness;

        var ev;
        if (Browser.Engine.trident) {
            ev = "keydown";
        } else {
            ev = "keypress";
        }
        document.addEvent(ev, this.__handleHotkey);
    },
    __handleHotkey: function(x) {
        if (!x.alt || x.control) {
            if (x.key === "backspace" || x.key === "/")
                if (!this.getInputFocused(x))
                    x.stop();
            return;
        }
        var success = false;
        if (x.key.match(/a/i)) {
            var highestNum = 0;
            var highestIndex = -1;
            success = true;

            x.stop();
            //good place for foldr no?
            this.windowArray.each(function(win, indx){
                var h = win.hilighted;
                if (h > highestNum) {
                    highestIndex = indx;
                    highestNum = h;
                }
            });
            if (highestIndex !== -1)
                this.selectWindow(this.windowArray[highestIndex]);
        } else if (prelude.isNumber(x.key)) { /*x.key >= '0' && x.key <= '9'*/
            success = true;

            //number = x.key - '0'; //ridiculously stupid
            number = (Number.toInt(x.key) || 10) - 1;

            if (number >= this.windowArray.length)
                return;

            this.selectWindow(this.windowArray[number]);
        } else if (x.key == "left") {
            this.prevWindow();
            success = true;
        } else if (x.key == "right") {
            this.nextWindow();
            success = true;
        }
        if (success)
            x.stop();
    },
    getInputFocused: function(x) {
        //wtf? (x.target.TYPE =="INPUT") or something work?
        var focused = !($$("input").contains(x.target) && $$("textarea").contains(x.target));
        return focused;
    },
    newCustomWindow: function(name, select, type) {
        if (!type)
            type = ui.WINDOW_CUSTOM;

        var win = this.newWindow(ui.CUSTOM_CLIENT, type, name);
        win.addEvent("close", function(win) {
            delete this.windows[ui.CUSTOM_CLIENT][win.identifier];
        }.bind(this));

        if (select)
            this.selectWindow(win);

        return win;
    },
    addCustomWindow: function(windowName, class_, cssClass, options) {
        if (!$defined(options))
            options = {};

        if (this.customWindows[windowName]) {
            this.selectWindow(this.customWindows[windowName]);
            return;
        }

        var win = this.newCustomWindow(windowName, true);
        this.customWindows[windowName] = win;

        win.addEvent("close", function() {
            this.customWindows[windowName] = null;
        }.bind(this));

        if (cssClass)
            win.lines.addClass("qwebirc-" + cssClass);

        var ew = new class_(win.lines, options);
        ew.addEvent("close", win.close/*.bind(win)*/); //already bound

        win.setSubWindow(ew);
    },
    embeddedWindow: function() {
        this.addCustomWindow("Add webchat to your site", ui.EmbedWizard, "embeddedwizard", {
            baseURL: this.options.baseURL,
            uiOptions: this.uiOptions,
            optionsCallback: this.optionsWindow
        });
    },
    optionsWindow: function() {
        this.addCustomWindow("Options", ui.OptionsPane, "optionspane", this.uiOptions);
    },
    aboutWindow: function() {
        this.addCustomWindow("About", ui.AboutPane, "aboutpane", this.uiOptions);
    },
    privacyWindow: function() {
        this.addCustomWindow("Privacy policy", ui.PrivacyPolicyPane, "privacypolicypane", this.uiOptions);
    },
    feedbackWindow: function() {
        this.addCustomWindow("Feedback", ui.FeedbackPane, "feedbackpane", this.uiOptions);
    },
    faqWindow: function() {
        this.addCustomWindow("FAQ", ui.FAQPane, "faqpane", this.uiOptions);
    },
    urlDispatcher: function(name, window) {
        if (name == "embedded") {
            return ["a", this.embeddedWindow];
        }
        else if (name == "options"){
            return ["a", this.optionsWindow];
        }
        /* doesn't really belong here */
        else if (name === "whois") {
            var uiOptions = this.uiOptions;
            ///this method is dumb
            return ["span", function(nick) {
                if (uiOptions.QUERY_ON_NICK_CLICK) {
                    window.client.exec("/QUERY " + nick);
                } else {
                    if (isChannel(nick)) {
                        nick = util.unformatChannel(nick);
                    } else {
                        if (nick.search(window.client.nickname + '>') >= 0) {
                            nick = nick.substr(nick.search('>') + 1, nick.length);
                        } else {
                            nick = nick.substr(0, nick.search('>'));
                        }
                    }
                    // window.properties.text(nick);
                    window.client.exec("/WHOIS " + nick);
                }
            }];
        }
        else
            return null;
    },
    tabComplete: function(element) {
        // this.tabCompleter.tabComplete(element);
    },
    resetTabComplete: function() {
        // this.tabCompleter.reset();
    },
    setModifiableStylesheet: function(name) {
        this.__styleSheet = new ui.style.ModifiableStylesheet(this.options.modifiableStylesheet);
        this.setModifiableStylesheetValues({});
    },
    setModifiableStylesheetValues: function(values) {
        // for (var k in values)
        //     this.__styleValues[k] = values[k];
        $extend(this.__styleValues, values);

        if (!$defined(this.__styleSheet))
            return;

        var hue = this.__styleValues.hue,
            lightness = this.__styleValues.lightness,
            saturation = this.__styleValues.saturation,
            uiOptions = this.uiOptions;

        this.__styleSheet.set(function(mode, col) {
            if (mode == "c") {
                var x = new Color(col);
                var c = x.setHue(hue).setSaturation(x.hsb[1] + saturation).setBrightness(x.hsb[2] + lightness);
                if (c == "255,255,255") // IE confuses white with transparent... 
                c = "255,255,254";

                return "rgb(" + c + ")";
            } else if (mode == "o") {
                return uiOptions[arguments[1]] ? arguments[2] : arguments[3];
            }
        });
    }
});

ui.NotificationUI = new Class({
    Extends: ui.StandardUI,
    initialize: function(/*parentElement, windowClass, uiName, options*/) {
        // this.parent(parentElement, windowClass, uiName, options);
        this.parent.apply(this, arguments);

        var beeper = this.__beeper = new ui.Beeper(this.uiOptions),
            flasher = this.__flasher = new ui.Flasher(this.uiOptions);

        this.beep = beeper.beep;

        this.flash = flasher.flash;
        this.cancelFlash = flasher.cancelFlash;
    },
    setBeepOnMention: function(value) {
        if (value)
            this.__beeper.soundInit();
    },
    updateTitle: function(text) {
        if (this.__flasher.updateTitle(text))
            this.parent(text);
    },
    focusChange: function(value) {
        this.parent(value);
        this.__flasher.focusChange(value);
    }
});


ui.NewLoginUI = new Class({
    Extends: ui.NotificationUI,
    loginBox: function(callbackfn, initialNickname, initialChannels, autoConnect, autoNick, network, storage) {
        this.postInitialize();

        var win = this.newCustomWindow(CONNECTION_DETAILS, true, ui.WINDOW_CONNECT);
        var callback = function() {
                win.close();
                callbackfn.apply(this, arguments);
            };
        ui.GenericLoginBox(win.lines, callback, initialNickname, initialChannels, autoConnect, autoNick, network || this.options.networkName, storage);
    }
});


ui.QuakeNetUI = new Class({
    Extends: ui.NewLoginUI,
    urlDispatcher: function(name, window) {
        if (name == "qwhois") {
            return ["span", function(auth) {
                this.client.exec("/MSG Q whois #" + auth);
            }.bind(window)];
        }
        return this.parent(name, window);
    },
    logout: function() {
        if (!auth.loggedin)
            return;
        if (confirm("Log out?")) {
            Object.each(this.clients, function(client) {
                client.quit(lang.logOut.message);
            });

            (function() {
                document.location = qwebirc.global.dynamicBaseURL + "auth?logout=1";
            }).delay(500);
        }
    }
});

ui.RootUI = ui.QuakeNetUI;

ui.RequestTransformHTML = function(options) {
    var HREF_ELEMENTS = ["IMG"];

    var $update = options.update;
    var onSuccess = options.onSuccess;

    var fixUp = function(node) {
            if (node.nodeType !== Node.ELEMENT_NODE)
                return;

            if (HREF_ELEMENTS.contains(node.nodeName.toUpperCase())) {
                var attr = node.getAttribute("transform_attr");
                var value = node.getAttribute("transform_value");
                if ($defined(attr) && $defined(value)) {
                    node.removeProperties("transform_attr", "transform_value")
                        .setProperty(attr, qwebirc.global.staticBaseURL + value);
                }
            }

            Array.each(node.childNodes, fixUp);
        };

    delete options["update"];
    options.onSuccess = function(tree, elements, html, js) {
        var container = new Element("div", {'html': html});
        fixUp(container);
        $update.empty();

        Array.each(container.childNodes, function(node) {
            node.swapParent($update);
        });
        onSuccess();
    };

    return new Request.HTML(options);
};


ui.Window = new Class({
    Implements: [Events],
    initialize: function(parentObject, client, type, name, identifier) {
        this.parentObject = parentObject;
        this.type = type;
        this.name = name;
        this.active = false;
        this.client = client;
        this.identifier = identifier;
        this.hilighted = ui.HILIGHT_NONE;
        // this.scrolltimer = null;
        this.commandhistory = this.parentObject.commandhistory;
        // this.scrolleddown = true;
        // this.scrollpos = null;
        this.lastNickHash = {};
        this.lastSelected = null;
        this.subWindow = null;
        this.closed = false;

        if (this.type & ui.WINDOW_LASTLINE) {
            this.lastPositionLine = Element.from(templates.messageLine());
            this.lastPositionLineInserted = false;
        }

        this.window = this.parentObject.qjsui.createWindow();
    },
    updateTopic: function(topic, element) {
        ui.Colourise("[" + topic + "]", element, this.client.exec, this.parentObject.urlDispatcher, this);
    },
    close: function() {
        this.closed = true;

        // if ($defined(this.scrolltimer)) {
        //     $clear(this.scrolltimer);
        //     this.scrolltimer = null;
        // }

        this.parentObject.__closed(this);
        this.fireEvent("close", this);
    },
    subEvent: function(event) {
        if ($defined(this.subWindow))
            this.subWindow.fireEvent(event);
    },
    setSubWindow: function(win) {
        this.subWindow = win;
    },

    select: function() {
        if (this.lastPositionLineInserted && !this.parentObject.uiOptions.LASTPOS_LINE) {
            this.lines.disown(this.lastPositionLine);
            this.lastPositionLineInserted = false;
        }

        this.active = true;
        this.parentObject.__setActiveWindow(this);
        if (this.hilighted)
            this.highlightTab(ui.HILIGHT_NONE);

        this.subEvent("select");
        // this.resetScrollPos();
        this.lastSelected = new Date();
    },

    deselect: function() {
        this.subEvent("deselect");

        // this.setScrollPos();
        // if ($defined(this.scrolltimer)) {
        //     $clear(this.scrolltimer);
        //     this.scrolltimer = null;
        // }

        if (this.type & ui.WINDOW_LASTLINE)
            this.replaceLastPositionLine();

        this.active = false;
    },

    resetScrollPos: function() {
        // if (this.scrolleddown) {
        //     this.scrollToBottom();
        // } else if ($defined(this.scrollpos)) {
        //     this.getScrollParent().scrollTo(this.scrollpos.x, this.scrollpos.y);
        // }
    },
    setScrollPos: function() {
        // if (!this.parentObject.singleWindow) {
        //     this.scrolleddown = this.scrolledDown();
        //     this.scrollpos = this.lines.getScroll();
        // }
    },


    /* A line is an object of the form:
    -: current nick
    @: opstatus
    c: channel
    f: origin channel
    h: ip of propogater
    m: msg
    n: nick
    */

    addLine: function(type, line, colour, $ele) {
        var self = this,
            uiobj = self.parentObject;
        var hilight = ui.HILIGHT_NONE,
            hl_line = false;

        if (type && line) {
        //regexs
            var isbot = /^TF2/.test(line.n), //works for pugna(hl), mix(hl)
                ismsg = /(NOTICE|ACTION|MSG)$/.test(type),
                regNotice = /NOTICE$/,
                sentByUs = /^OUR/.test(type),//ignore
                containsNick = util.testForNick(self.nickname);

            var notice = function() {
                if (!(self.active && uiobj.windowFocused) && line.c !== BROUHAHA) {
                    uiobj.beep();
                    uiobj.flash();
                }
            };

            hilight = ui.HILIGHT_ACTIVITY;

            if (ismsg) {
                //highlighting
                if (line.n && line.m && self.type === ui.WINDOW_CHANNEL) {
                    $ele.addClass('message');
                    if(isbot)
                        $ele.addClass('bot');
                    else if(sentByUs)
                        $ele.addClass('our');
                    if(!isbot && line.m.startsWith("!"))
                        $ele.addClass('command');
                }

                if (self.type === ui.WINDOW_QUERY || self.type === ui.WINDOW_MESSAGES) {
                    if (sentByUs || regNotice.test(type)) {
                        hilight = ui.HILIGHT_ACTIVITY;
                    } else {
                        hilight = ui.HILIGHT_US;
                        notice(); //private message
                    }
                }
                else if (regNotice.test(type) && self.type === ui.WINDOW_CHANNEL) {
                    $ele.style.color = "red";
                    notice();
                }
                else if (!sentByUs && !isbot && containsNick(line.m)) { //dont beep if bot says our name
                    hl_line = true;
                    hilight = ui.HILIGHT_US;
                    notice();//name mention in chan
                }
                else if (hilight !== ui.HILIGHT_US) {
                    hilight = ui.HILIGHT_SPEECH;
                }
            }
        }

        if (!self.active && (hilight !== ui.HILIGHT_NONE))
            self.highlightTab(hilight);

        if (type)
            line = uiobj.theme.message(type, line, hl_line);

        var tsE = templates.timestamp({time:util.IRCTimestamp(new Date())});
        $ele.insertAdjacentHTML('afterbegin', tsE);
        // $ele.appendChild($ele.from(tsE));

        ui.Colourise(line, $ele, self.client.exec, uiobj.urlDispatcher, self);
        // self.scrollAdd($ele);
        self.lines.adopt($ele);
    },
    errorMessage: function(message) {
        this.addLine("", message, "warncolour");
    },
    infoMessage: function(message) {
        this.addLine("", message, "infocolour");
    },
    highlightTab: function(state) {
        if (state == ui.HILIGHT_NONE || state >= this.hilighted)
            this.hilighted = state;
    },
    // scrolledDown: function() {
        // if (this.scrolltimer)
        //     return true;

        // var parent = this.lines;

        // var prev = parent.getScroll();
        // var prevbottom = parent.getScrollSize().y;
        // var prevheight = parent.clientHeight;

        // /*
        //  * fixes an IE bug: the scrollheight is less than the actual height
        //  * when the div isn't full
        //  */
        // if (prevbottom < prevheight)
        //     prevbottom = prevheight;

        // return ((prev.y + prevheight) - prevbottom).abs() <= 1;
    // },
    // getScrollParent: function() {
        // var scrollparent = this.lines;

        // if ($defined(this.scroller))
        //     scrollparent = this.scroller;
        // return scrollparent;
    // },
    // scrollToBottom: function() {
        // if (this.type === ui.WINDOW_CUSTOM || this.type === ui.WINDOW_CONNECT)
        //     return;

        // var parent = this.lines;
        // var scrollparent = this.getScrollParent();

        // scrollparent.scrollTo(parent.getScroll().x, parent.getScrollSize().y);
    // },
    // scrollAdd: function(element) {
        // var parent = this.lines;

        // /* scroll in bursts, else the browser gets really slow */
        // if ($defined(element)) {
        //     var scrolled = this.scrolledDown();
        //     parent.appendChild(element);

        //     //overflow
        //     // if (parent.childNodes.length > ui.MAXIMUM_LINES_PER_WINDOW) {
        //     //     parent.removeChild(parent.firstChild);
        //     // }
        //     parent.maxChildren(ui.MAXIMUM_LINES_PER_WINDOW);

        //     if (!!scrolled) {
        //         if (this.scrolltimer)
        //             $clear(this.scrolltimer);
        //         //TODO
        //         //http://mootools.net/docs/more/Class/Events.Pseudos#Pseudos:throttle
        //         this.scrolltimer = this.scrollAdd.delay(100, this, [null]);
        //     } else {
        //         //chrome fix - http://hg.qwebirc.org/qwebirc/commits/8361cc5b020d389c7add98a50f539bda96f9465f
        //         this.scrollToBottom();
        //         this.scrolltimer = null;
        //     }
        // } else {
        //     this.scrollToBottom();
        //     this.scrolltimer = null;
        // }
    // },

    //holy shit i got this to actually make sense
    // takes nicks (sorted array)
    updateNickList: function(nicks) {
        var lnh = this.lastNickHash,
            oldnames = Object.keys(lnh),

            added = prelude.difference(nicks, oldnames),//users who joined
            left = prelude.difference(oldnames, nicks); //users who left

        left.each(function(nick) {
            var element = lnh[nick];
            this.nickListRemove(nick, element);
            delete lnh[nick];
        }, this);

        added.each(function(nick) {
            var index = nicks.indexOf(nick); //indx in sorted array
            lnh[nick] = this.nickListAdd(nick, index) || 1;
        }, this);
    },

    nickListAdd: function(nick, position) {},
    nickListRemove: function(nick, stored) {},
    historyExec: function(line) {
        this.commandhistory.addLine(line);
        this.client.exec(line);
    },
    focusChange: function(newValue) {
        if (!(newValue !== true || (this.type & ui.WINDOW_LASTLINE)))
            this.replaceLastPositionLine();
    },
    replaceLastPositionLine: function() {
        if (this.parentObject.uiOptions.LASTPOS_LINE) {
            if (!this.lastPositionLineInserted) {
                // this.scrollAdd(this.lastPositionLine);
            } else if (this.lines.lastChild !== this.lastPositionLine) {
                try {
                    this.lines.disown(this.lastPositionLine);
                } catch (e) { /* IGNORE, /clear removes lastPositionLine from the dom without resetting it. */
                }
                // this.scrollAdd(this.lastPositionLine);
            }
        } else {
            if (this.lastPositionLineInserted)
                this.lines.disown(this.lastPositionLine);
        }

        this.lastPositionLineInserted = this.parentObject.uiOptions.LASTPOS_LINE;
    }
});

ui.Theme = new Class({
    initialize: function(themeDict) {
        var self = this,
            theme = self.__theme = Object.clone(ui.themes.Default);

        if (themeDict) {
            // for (var k in themeDict) {
            //     theme[k] = themeDict[k];
            // }
            $extend(theme, themeDict);
        }
        Object.each(theme, function(data, key) {
            if (key === "PREFIX")
                return;

            if (data[1]) {
                theme[key] = theme.PREFIX + data[0];
            } else {
                theme[key] = data[0];
            }
        });

        self.__ccmap = Object.clone(ui.themes.ThemeControlCodeMap);
        self.__ccmaph = Object.clone(self.__ccmap);

        self.__ccmaph["("] = self.message("HILIGHT", {}, self.__ccmap);
        self.__ccmaph[")"] = self.message("HILIGHTEND", {}, self.__ccmap);
        self.__ccmaph["{"] = self.__ccmaph["}"] = "";
    },

    //fuck that this is awful - use String.substitute with a regex
    __dollarSubstitute: function(x, h, mapper) {
        if (x == '-${$($N$)$}:$c- $m' && h['c'] == BROUHAHA)
            x = '-${$($N$)$}- $m';
        var msg = [];

        var n = x.split("");
        //loop of the devil
        for (var i = 0; i < n.length; i++) {
            var c = n[i];
            if (c == "$" && (i <= n.length - 1)) {
                var c2 = n[++i];

                var o = mapper[c2];
                if (!o)
                    o = h[c2];
                if (o)
                    msg.push(o);
            } else {
                msg.push(c);
            }
        }

        return msg.join("");
    },
    message: function(type, data, hilight) {
        var map;
        if (hilight) {
            map = this.__ccmaph;
        } else {
            map = this.__ccmap;
        }

        if (data && data["n"])
            data["N"] = "qwebirc://whois/" + data.n + "/";
        return this.__dollarSubstitute(this.__theme[type], data, map);
    }
});

// ui.HilightController = new Class({
//     initialize: function(parent) {
//         this.parent = parent;
//         this.regex = null;
//         this.prevnick = null;
//     },
//     match: function(text) {
//         var nick = this.parent.nickname;
//         if (nick !== this.prevnick) {
//             var classes = '[\\s\\.,;:]';
//             this.regex = new RegExp('(^|' + classes + ')' + RegExp.escape(nick) + '(' + classes + '|$)', "i");
//         }
//         return this.regex.test(text);
//     }
// });


ui.TabCompleterFactory = new Class({
    initialize: function(ui) {
        this.ui = ui;
        this.reset();
    },
    tabComplete: function(textBox) {
        var text = textBox.value;

        if (!$defined(this.obj)) {
            this.incr = 1;

            var win = this.ui.getActiveWindow();
            if (!win)
                return;

            var startingWord = util.getEnclosedWord(text, util.getCaretPos(textBox));
            var preword = "",
                word = "",
                postword = "";
            if ($defined(startingWord)) {
                preword = text.substring(0, startingWord[0]);
                word = startingWord[1];
                postword = text.substring(startingWord[0] + word.length);
            }

            var ltext = text.toLowerCase(),
                obj;
            if (!text) {
                preword = "/msg ";
                obj = ui.QueryTabCompleter;
            } else if (util.isChannel(word)) {
                obj = ui.ChannelNameTabCompleter;
            } /*else if (false //ltext.match(/^\/(q|query|msg) /i) ) {
                obj = ui.QueryTabCompleter;
            }*/ else if (win.type === ui.WINDOW_QUERY) {
                obj = ui.QueryNickTabCompleter;
            } else if (win.type === ui.WINDOW_CHANNEL) { /* "slug[TAB]" == "slug: " */
                if (!preword) {
                    // if ( !! postword && postword.charAt(0) === " ") {
                    //     postword = ":" + postword; //should i call util.padcolon here?
                    // } else {
                    //     postword = ": " + postword;
                    // }
                    postword = ": " + postword.trimLeft();

                    this.incr++;
                }
                obj = ui.ChannelUsersTabCompleter;
            } else {
                return;
            }

            if (postword === "")
                postword = " ";

            this.obj = new obj(preword, word, postword, win);
            if (!$defined(this.obj))
                return;
        }

        var ret = this.obj.get();
        if (!$defined(ret))
            return;

        textBox.value = ret[1];
        util.setCaretPos(textBox, ret[0] + this.incr);
    },
    reset: function() {
        this.obj = null;
    }
});

ui.TabIterator = new Class({
    initialize: function(client, prefix, list) {
        this.prefix = prefix;
        if (!$defined(list) || list.length === 0) {
            this.list = null;
        } else {
            var prefixes = irc.toIRCCompletion(client, prefix);

            /* convert the nick list to IRC lower case, stripping all non letters
             * before comparisions */
            // for (var i = 0; i < list.length; i++) {
            //     var l2 = irc.toIRCCompletion(client, list[i]);

            //     if (l2.startsWith(prefixes))
            //         l.push(list[i]);
            // }
            var listf = list.filter(Functional.compose(util.prefixOnNick(prefixes), irc.toIRCCompletion.curry(client)));

            this.list = listf;
        }

        this.pos = -1;
    },
    next: function() {
        /*
         * ideally next would do the list gubbins recursively, but no JS engine currently
         * support tail recursion :(
         */
        if (!$defined(this.list))
            return null;

        this.pos = this.pos + 1;
        if (this.pos >= this.list.length)
            this.pos = 0;

        return this.list[this.pos];
    }
});

ui.BaseTabCompleter = new Class({
    initialize: function(client, prefix, existingNick, suffix, list) {
        this.existingNick = existingNick;
        this.prefix = prefix;
        this.suffix = suffix;
        this.iterator = new ui.TabIterator(client, existingNick, list);
    },
    get: function() {
        var n = this.iterator.next();
        if (!$defined(n))
            return null;

        var p = this.prefix + n;
        return [p.length, p + this.suffix];
    }
});

ui.QueryTabCompleter = new Class({
    Extends: ui.BaseTabCompleter,
    initialize: function(prefix, existingNick, suffix, win) {
        this.parent(win.client, prefix, existingNick, suffix, win.client.lastNicks);
    }
});

ui.QueryNickTabCompleter = new Class({
    Extends: ui.BaseTabCompleter,
    initialize: function(prefix, existingText, suffix, win) {
        var chan = win.name;
        this.parent(win.client, prefix, existingText, suffix, [chan]);
    }
});

ui.ChannelNameTabCompleter = new Class({
    Extends: ui.BaseTabCompleter,
    initialize: function(prefix, existingText, suffix, window) {

        var l = [];
        Object.each(window.client.channels, function(chan, name) {
            if($defined(chan)) {
                chan = chan.lastSelected;
            }
            l.push([chan, name]);
        });

        var l2 = l.sort(function(a, b) {
            return b[0] - a[0];
        }).map(prelude.item(1));

        this.parent(window.client, prefix, existingText, suffix, l2);
        // this.parent.apply(this, Array.concat(window.client, arguments, l2));
    }
});

ui.ChannelUsersTabCompleter = new Class({
    Extends: ui.BaseTabCompleter,
    initialize: function(prefix, existingText, suffix, window) {
        var nc = window.client.tracker.getSortedByLastSpoke(irc.activeChannel);

        this.parent(window.client, prefix, existingText, suffix, nc);
    }
});


ui.QUI = new Class({
    Extends: ui.RootUI,
    Binds: ["__createChannelMenu"],
    initialize: function(parentElement, theme, options) {
        this.parent(parentElement, ui.QUI.Window, "qui", options);

        parentElement.addClass('qui')
                    .addClass('signed-out');
        this.theme = theme;
        this.parentElement = parentElement;
        this.setModifiableStylesheet("qui");
        this.setHotKeys();
    },
    postInitialize: function() {
        var self = this,
            qjsui = self.qjsui = new ui.QUI.JSUI("qui", self.parentElement);

        // qjsui.addEvent("reflow", function() {
        //     var win = self.getActiveWindow();
        //     if ($defined(win))
        //         win.onResize();
        // });

        self.outerTabs = qjsui.top;
        self.tabs = Element.from(templates.tabbar());
        var joinChan =  function(){
                var chan = prompt("Enter channel name:");
                if(chan.trim() !== ""){
                    Object.each(self.clients, function(client) {
                        client.exec("/JOIN " + chan);
                    });
                }
            },
            addTab = self.addTab = Element.from(templates.addTab());
        addTab.addEvents({
            'dblclick': joinChan,
            'click': self.__createChannelMenu
        });

        //for scrolling tabs with mousewheel
        self.tabs.addEvent("mousewheel", function(event) {
            event.stop();
            /* up */
            if (event.wheel > 0) {
                self.nextWindow();
            } else if (event.wheel < 0) { /* down */
                self.prevWindow();
            }
        });


        //append menu and tabbar
        self.outerTabs.adopt(self.__createDropdownMenu(),
                            self.tabs,
                            addTab);

        var origWin = qjsui.createWindow();
        self.origtopic = self.topic = origWin.topic;
        self.origlines = self.lines = origWin.middle;
        self.orignicklist = self.nicklist = origWin.right;

        self.input = origWin.bottom;
        // self.reflow = qjsui.reflow.bind(qjsui);

        // self.reflow(origWin);
        // self.reflow.delay(100, self, origWin); /* Konqueror fix */


        //For window resizing
        // window.addEvent("resize", function() {
        //     self.getActiveWindow().reflow(100);
        // });


        //delay for style recalc
        self.__createDropdownHint.delay(500, self);
    },
    __createDropdownMenu: function() {
        var self = this,

            dropdownMenu = Element.from(templates.menudrop());

        //     hidemenu = dropdownMenu.hideMenu = function(e) {
        //         if(e)
        //             e.stop();
        //         dropdownMenu.hide();
        //         document.removeEvent("mousedown", hidemenu);
        //     },
        //     showMenu = dropdownMenu.showMenu = function(e) {
        //         e.stop();
        //         self.hideHint();

        //         if (dropdownMenu.isDisplayed()) {
        //            hidemenu();
        //         } else {
        //             dropdownMenu.show()
        //             document.addEvent("mousedown", hidemenu);
        //         }
        //     };

        // hidemenu();

        // dropdownMenu.position.delay(500, dropdownMenu, {
        //             relativeTo: self.outerTabs,
        //             position: {x: 'left', y: 'bottom'},
        //             edge: {x: 'left', y: 'top'}
        //         }

        dropdownMenu.inject(self.parentElement);

        var dropdown = Element.from(templates.menubtn({icon: self.options.icons.menuicon}));
        dropdown.setStyle("opacity", 1);
                // .addEvent("mousedown", Event.stop)
                // .addEvent("click", showMenu);


        self.UICommands.each(function(cmd) {
            var text = cmd[0];
            var fn = self[cmd[1] + "Window"].bind(self);
            var ele = Element.from(templates.menuitem({text:text}));
            ele.addEvent("mousedown", function(e) {
                    e.stop();
                })
                .addEvent("click", function() {
                    dropdownMenu.hideMenu();
                    fn();
                });
            dropdownMenu.appendChild(ele);
        });

        // var dropdown = new Element("div");
        // dropdown.addClass("dropdown-tab");
        // dropdown.appendChild(new Element("img", {
        //     src: qwebirc.global.staticBaseURL + "images/icon.png",
        //     title: "menu",
        //     alt: "menu"
        // }));

        var dropdownEffect = new Fx.Tween(dropdown, {
            duration: "long",
            property: "opacity",
            link: "chain"
        });

        dropdownEffect.start(0.25)
                    .start(1)
                    .start(0.33)
                    .start(1);


        ui.decorateDropdown(dropdown,dropdownMenu, {
            onShow: function() {
                if(self.hideHint)
                    self.hideHint();
                delete self.hideHint;
            }
        });
        return dropdown;
    },

    setHotKeys: function (argument) {
        var events = storage.get('hotkeys');
        console.log('todo');
        if(keys && events) {
            keys.activate();
        }
    },

    //the effect on page load
    __createDropdownHint: function() {
        var dropdownhint = Element.from(templates.dropdownhint());
        dropdownhint.inject(this.parentElement)
                    .position({
                        relativeTo: this.outerTabs,
                        position: {'y': 'bottom'},
                        offset: {y:10}
                    });

        new Fx.Morph(dropdownhint, {
            duration: "normal",
            transition: Fx.Transitions.Sine.easeOut
        }).start({
            left: [900, 5]
        });

        var hider = function() {
                new Fx.Morph(dropdownhint, {
                    duration: "long"
                }).start({
                    left: [5, -900]
                });
            }.delay(4000);

        var hider2 = this.hideHint = Element.destroy.curry(dropdownhint);

        hider2.delay(4000);

        var hider3 = function(e) {
                if (e.code === 17) {
                    window.ctrl = 0;
                }
            };

        document.addEvent("mousedown", hider2)
                .addEvent("keydown", hider2)
                .addEvent("keyup", hider3);
    },

    //todo use other dropdown menu code
    __createChannelMenu: function() {
        var client = this.getActiveIRCWindow().client,
            chans = client.getPopularChannels().map(function(chan) {
                return {
                    text: chan.channel,
                    hint: chan.users
                };
            }),
            menu = Element.from(templates.chanmenu({
                channels: chans
            }));

        menu.inject(this.parentElement);

        ui.decorateDropdown(this.addTab, menu);
        menu.show();
    },

    newClient: function(client) {
        this.parentElement.removeClass('signed-out')
                            .addClass('signed-in');
        return this.parent(client);
    },

    // setLines: function(lines) {
    //     this.lines.parentNode.replaceChild(lines, this.lines);
    //     this.qjsui.middle = this.lines = lines;
    // },
    // setChannelItems: function(nicklist, topic) {
    //     if (!$defined(nicklist)) {
    //         nicklist = this.orignicklist;
    //         topic = this.origtopic;
    //     }
    //     nicklist.replaces(this.nicklist);
    //     this.qjsui.right = this.nicklist = nicklist;

    //     topic.replaces(this.topic);

    //     this.qjsui.topic = this.topic = topic;
    // }
    setWindow: function(win) {
        this.qjsui.setWindow(win);
    },

    //called in context of irc client
    nickChange: function(data) {
        if(data.thisclient) {
            Object.each(this.windows, function(win) {
                win.$nicklabel.set("text", data.newnick);
            });
        }
    }
});

ui.QUI.JSUI = new Class({
    Implements: [Events],
    initialize: function(class_, parent, sizer) {
        this.parent = parent;
        this.windows = [];

        this.sizer = $defined(sizer) ? sizer : parent;

        this.class_ = class_;
        this.create();

        // this.reflowevent = null;
    },
    // applyClasses: function(pos, el) {
    //     el.addClass("dynamicpanel")
    //         .addClass(this.class_);

    //     switch(pos) {
    //         case "middle":
    //             el.addClass("leftboundpanel");
    //             break;
    //         case "top":
    //             el.addClass("topboundpanel")
    //                 .addClass("widepanel");
    //             break;
    //         case "right":
    //             el.addClass("rightboundpanel");
    //             break;
    //         case "topic":
    //             el.addClass("widepanel");
    //             break;
    //         case "bottom":
    //             el.addClass("bottomboundpanel")
    //                 .addClass("widepanel");
    //             break;
    //     }
    // },
    create: function() {
        // var XE = function(pos) {
        //         var element = new Element("div");
        //         this.applyClasses(pos, element);

        //         this.parent.appendChild(element);
        //         return element;
        //     }.bind(this);

        // this.top = XE("top");
        // this.topic = XE("topic");
        // this.middle = XE("middle");
        // this.right = XE("right");
        // this.properties = XE("properties");
        // this.bottom = XE("bottom");

        var top = this.top = Element.from(templates.topPane()),
            windows = this.winContainer = Element.from(templates.windowsPane()),
            detach = this.detachContainer = Element.from(templates.detachedPane());
        this.parent.adopt(top, windows, detach);
    },

    createWindow: function() {
        var win = {
            'window': Element.from(templates.windowPane()),
            'topic': Element.from(templates.topicPane()),
            'content': Element.from(templates.contentPane()),
            'middle': Element.from(templates.leftPane()),
            'right': Element.from(templates.nickPane()),
            'properties': Element.from(templates.propertiesPane()),
            'bottom': Element.from(templates.inputPane())
        };

        win.content.adopt(win.middle, win.right);
        win.window.adopt(win.topic, win.content, win.properties, win.bottom);
        this.winContainer.appendChild(win.window);
        this.windows.push(win);

        return win;
    },

    reflow: function(win, delay) {
        console.log('dummy');
        // if (!delay)
        //     delay = 1;

        // if (this.reflowevent)
        //     $clear(this.reflowevent);
        // this.__reflow(win);
        // this.reflowevent = this.__reflow.delay(delay, this, win);
    },
    __reflow: function(win) {
        // var properties = win.properties,
        //     bottom = win.bottom,
        //     middle = win.middle,
        //     right = win.right,
        //     topic = win.topic,
        //     top = this.top,

        //     topicsize = topic.getSize(),
        //     topsize = top.getSize(),
        //     rightsize = right.getSize(),
        //     bottomsize = bottom.getSize(),
        //     docsize = this.sizer.getSize();

        // var mheight = (docsize.y - topsize.y - bottomsize.y - topicsize.y),
        //     mwidth = (docsize.x - rightsize.x);

        // topic.setStyle("top", topsize.y);

        // var last5_height = 0;
        // var last5msg = $('last5messages');
        // if (last5msg) {
        //     last5msg.className = "qwebirc-qui ircwindow dynamicpanel lines";
        //     last5msg.style.top = topsize.y + topicsize.y + 'px';
        //     last5msg.style.width = mwidth + 'px';
        //     last5msg.style.zIndex = '1';
        //     last5msg.style.borderBottom = '1px dashed #C8D1DB';
        //     last5_height = last5msg.offsetHeight;
        //     middle.setStyle("top", (topsize.y + topicsize.y + last5msg.offsetHeight));
        // } else {
        //     middle.setStyle("top", (topsize.y + topicsize.y));
        // }

        // if (mheight > 0) {
        //     middle.setStyle("height", mheight - 25 - last5_height);
        //     right.setStyle("height", mheight);
        // }

        // if (mwidth > 0) {
        //     middle.setStyle("width", mwidth);
        //     properties.setStyle("width", mwidth);
        // }
        // right.setStyle("top", (topsize.y + topicsize.y))
        //     .setStyle("left", mwidth);

        // properties.setStyle("top", (docsize.y - bottomsize.y - 25));
        // bottom.setStyle("top", (docsize.y - bottomsize.y));
        // this.fireEvent("reflow", win);
    },
    // showChannel: function(win, state, nicklistVisible) {
    //     // var display = state ? "block" : "none";
    //     // this.right.setStyle("display", nicklistVisible ? display : "none");
    //     // this.topic.setStyle("display", display);
    //     win.right.toggle(state && nicklistVisible);
    //     win.topic.toggle(state);
    // },
    // showInput: function(win, state) {
    //     // this.bottom.setStyle("display", state ? "block" : "none");
    //     win.bottom.isVisible = state;
    //     win.bottom.toggle(state);
    // }
    setWindow: function(newWin) {
        this.windows.each(function (win) {
            if(win.detached !== true) {
                win.window.hide();
            }
        });
        newWin.window.show();
    }
});

ui.QUI.Window = new Class({
    Extends: ui.Window,
    Binds: ["close", "attach", "detach", "selectTab", "nickChange", "nickClick", "editTopic"],

    initialize: function(parentObject, client, type, name, identifier) {
        var self = this;
        self.parent(parentObject, client, type, name, identifier);

        var tabname, tabclass,
            qwindow = self.window;

        qwindow.detached = self.detached = false;

        if (name === BROUHAHA) {
            tabclass = "brouhaha";
            tabname = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
        } else {
            tabname = name;
        }

        var $tab = self.tab = Element.from(templates.ircTab({
                'class': tabclass,
                'name': tabname
            })),
            $tabDetach = $tab.getElement('.detach');

        parentObject.tabs.appendChild($tab);


        // var elchanid = document.getElementById('channel-name-id');

        $tab.addEvents({
            focus: $tab.blur,
            click: self.selectTab,
            dblclick: function(e) {
                e.stop();

                if (self.closed)
                    return;

                parentObject.selectWindow(self);
            }
        });
        $tabDetach.addEvent('click', self.detach);

        if (!isBaseWindow(name)) {
            // var tabclose = new Element("span");
            // tabclose.set("text", "X");
            // tabclose.addClass("tabclose");
            var $tabclose = Element.from(templates.tabClose()),
                close = self.close;
            //close window

            $tabclose.addEvent("click", close);
            $tab.addEvent("mouseup", function(e) {
                    var button = Browser.Engine.trident ? 4 : 1;

                    if (e.event.button === button)
                        close(e);
                })
                .appendChild($tabclose);
        }

        var lines = self.lines = qwindow.middle;
        // self.parentObject.qjsui.applyClasses("middle", self.lines);
        if (type !== ui.WINDOW_CUSTOM && type !== ui.WINDOW_CONNECT) {
            qwindow.window.addClass('ircwindow');
                // .set('id', 'mainircwindow');
            self.fxscroll = new Fx.AutoScroll(lines, {
                wheelStops: false
            });
            self.highlighter = new Highlighter(lines, { //highlight last 5 messages
                filter: function($ele) {
                    return $ele.hasClass('message') &&
                        !$ele.hasClass('bot') &&
                        !$ele.hasClass('command') &&//msg 2 bot
                        !$ele.hasClass('our');//from us
                },
                selector: '.message:not(.bot):not(.command):not(.our)',
                maxHighlight: 15
            });

            lines.store("fxscroll", self.fxscroll);

        } else {
            qwindow.window.addClass(name.capitalize().replace(" ", "-"));//Connection Details -> Connection-Details
        }

        // lines.addEvent("scroll", function() {
        //     self.scrolleddown = self.scrolledDown();
        //     self.scrollpos = self.getScrollParent().getScroll();
        // });

        if (type === ui.WINDOW_CHANNEL) {
            qwindow.window.addClass('channel');

            qwindow.topic.html(templates.topicBar({topic:false}));
            var topic = self.topic = qwindow.topic;
            topic.addEvent("dblclick", self.editTopic);
            self.updateTopic("");

            var $nicklist = self.nicklist = qwindow.right;
            $nicklist.addClass("nicklist")
                    // .addEvent("click", self.removePrevMenu.bind(self))
                    .addEvent("click:relay(a.user)", self.nickClick)
                    .addEvent("focus:relay(a)", Element.prototype.blur);


            var $divider = self.divider = Element.from(templates.verticalDivider())
                                                    .inject($nicklist, "before");
            //cant create splitpane here because elements are still hidden
        }

        var properties = self.properties = Element.from(templates.channelName({channel: name}));
        qwindow.properties.appendChild(properties);

        if(util.windowNeedsInput(type))
            qwindow.bottom.appendChild(self.createInput());


        self.nicksColoured = self.parentObject.uiOptions.NICK_COLOURS;
        // self.reflow();
    },

    close: function(e) {
        if(e)
            e.stop();

        if (this.closed)
            return;

        if (isChannelType(this.type) && (!isBaseWindow(this.name)) && !util.wasKicked()) {
            var client = this.client,
                channels = util.removeChannel(client.channels, this.name);

            client.exec("/PART " + this.name);
            client.storeChannels(channels);
        }
        this.parent();

        this.parentObject.tabs.removeChild(this.tab);

        if(this.detached) {
            this.wrapper.destroy();
        } else {
            this.window.window.destroy();
        }

        // this.tab.dispose();
        // this.reflow();
    },

    attach: function(e) {
        var win = this.window.window,
            wrapper = this.wrapper,
            po = this.parentObject;

        this.window.detached = this.detached = false;

        wrapper.hide();
        win.hide();
        // wrapper.removeChild(win);
        win.replaces(wrapper);
        wrapper.destroy();

        this.drag.detach().stop();
        this.resizable.detach().stop();
        this.wrapper = this.resizable = this.drag = undefined;

        this.tab.show();
        this.select();
    },

    detach: function(e) {
        var self = this,
            win = self.window.window,
            po = self.parentObject,
            qjsui = po.qjsui,

            wrapper = self.wrapper = Element.from(templates.detachedWindow({
                                                                'channel': this.name,
                                                                'base': util.isBaseWindow(this.name)
                                                            })),
            header = wrapper.getElement('.header'),
            attach = header.getElement('.attach'),
            close = header.getElement('.tab-close'),

            resizeWrapper = Element.from(templates.resizeHandle()),
            resizeHandle = resizeWrapper.getElement('.resize-handle'),

            setActive = function(e) {
                po.windowArray.each(function(win) {
                    if(win.detached)
                        win.wrapper.removeClass('active');
                });
                wrapper.addClass('active');
            };

        attach.addEvent('click', self.attach);
        if(close) {
            close.addEvent('click', self.close);
        }

        //change window if we're active
        if(self.active)
            po.nextWindow(1, self);


        var size = util.percentToPixel({x:40, y:60}, qjsui.parent);
        wrapper.setStyles({
                "width": size.x,
                "height": size.y
            })
            .wraps(win) //*** adds wrapper to dom
            .appendChild(resizeWrapper);
        win.show();
        setActive();

        self.resizable = wrapper.makeResizable({
                                limit: {//min/max
                                    x: [400, null],
                                    y: [200, null]
                                },
                                'handle': resizeHandle
                            });
        self.drag = wrapper.makeDraggable({
                                            container: document,
                                            handle: header,
                                            includeMargins: false
                                        });

        wrapper.addEvents({
            click: setActive
        });

        if(self.nicklist && !self.split) {
            (function() { //wait a sec for the styles to be calculated
                self.split = new Drag.SplitPane(self.divider, {
                    store: new Storage('__panelwidth')
                });
            }).delay(500);
        }
        if(self.fxscroll)
            self.fxscroll.autoScroll();

        // util.centerElement(wrapper, qjsui.parent);
        wrapper.position();

        self.detached = self.window.detached = true;

        //keeps order
        self.tab.hide();
    },

    selectTab: function() {
        if (this.name !== BROUHAHA) { //so you can still type in last channel
            this.parentObject.windowArray.each(function(win) {
                if(!win.detached) {
                    win.tab.removeClass("tab-selected")
                            .addClass("tab-unselected");
                }
                else if(win.name === BROUHAHA) {
                    if(util.isChannelType(self.type))
                        win.properties.text(self.name); //update current channel in brouhaha
                }
            });
            irc.activeChannel = self.name;
            this.tab.removeClass("tab-hilight-activity")
                    .removeClass("tab-hilight-us")
                    .removeClass("tab-hilight-speech")
                    .removeClass("tab-unselected")
                    .addClass("tab-selected");
        }
    },

    select: function() {
        var inputVisible = util.isChannelType(this.type),
            parentObject = this.parentObject;

        if (this.name === BROUHAHA) {
            this.tab.removeClass("brouhaha-unselected")
                    .addClass("brouhaha");
        } else {
            this.selectTab();
        }

        //changing windows occurs here
        parentObject.setWindow(this.window);

        // this.reflow();
        this.parent();

        if (inputVisible)
            this.$inputbox.focus();

        if (this.type === ui.WINDOW_CHANNEL && this.nicksColoured !== parentObject.uiOptions.NICK_COLOURS) {
            this.nicksColoured = parentObject.uiOptions.NICK_COLOURS;

            var nodes = this.nicklist.childNodes;
            if (parentObject.uiOptions.NICK_COLOURS) {
                Array.each(nodes, function(node) {
                    var colour = util.toHSBColour(node.retrieve("nick"), this.client);
                    if ($defined(colour))
                        node.firstChild.setStyle("color", colour.rgbToHex());
                }, this);
            } else {
                Array.each(nodes, function(node) {
                    node.firstChild.setStyle("color", null);
                });
            }
        }
        if(this.nicklist && !this.split) {
            (function() { //wait a sec for the styles to be calculated
                this.split = new Drag.SplitPane(this.divider);
            }).delay(500, this);
        }

        if(this.fxscroll) //scroll to bottom
            this.fxscroll.autoScroll();
    },

    deselect: function() {
        this.parent();

        this.tab.removeClass("tab-selected");
        if (this.name === BROUHAHA) {
            this.tab.removeClass("brouhaha")
                    .addClass("brouhaha-unselected");
        } else {
            this.tab.addClass("tab-unselected");
        }
    },

    editTopic: function() {
        if (!this.client.nickOnChanHasPrefix(this.client.nickname, this.name, "@")) {
/*      var cmodes = this.client.getChannelModes(channel);
      if(cmodes.indexOf("t")) {*/
            return alert(lang.needOp.message); /*}*/
        }
        var newTopic = prompt(util.formatter(lang.changeTopicConfirm.message, {channel: this.name}), this.topic.topicText);
        if ($defined(newTopic))
            return;

        this.client.exec("/TOPIC " + newTopic);
    },
    // reflow: function() {
    //     this.parentObject.reflow(this.window);
    // },
    onResize: function() {
        // if (this.scrolleddown) {
        //     if (Browser.Engine.trident) {
        //         this.scrollToBottom.delay(5, this);
        //     } else {
        //         this.scrollToBottom();
        //     }
        // } else if ($defined(this.scrollpos)) {
        //     if (Browser.Engine.trident) {
        //         this.getScrollParent().scrollTo(this.scrollpos.x, this.scrollpos.y);
        //     } else {
        //         this.getScrollParent().scrollTo.delay(5, this, [this.scrollpos.x, this.scrollpos.y]);
        //     }
        // }
    },

    //creates the input box on the bottom
    createInput: function() {
        var self = this,
            parentO = self.parentObject,

            inputtype = Browser.isMobile ?  "mobile-input": "keyboard-input",

            nick = self.client.nickname,

            $form = Element.from(templates.ircInput({'nick': nick, 'status': '', type: inputtype})),
            $nicklabel = self.$nicklabel = $form.getElement('.nickname'),
            $inputbox = self.$inputbox = $form.getElement('.input-field'),
            $inputbtn = $form.getElement('.input-button'),

            sendInput = function(e) {
                if(e)
                    e.stop();
                if ($inputbox.value.trim() !== "") {
                    parentO.resetTabComplete();
                    self.historyExec($inputbox.value);
                    $inputbox.value = "";
                }
                $inputbox.focus();
            };

        if (Browser.isMobile) {
            $inputbtn.addClass("mobile-button");
        } else {
            $inputbox.addEvents({
                blur: function() {
                    window.keyboardInputFocus = 0;
                },
                focus: function() {
                    window.keyboardInputFocus = 1;
                }
            });
        }

        var resettab = parentO.resetTabComplete,
            complete = function(e) {
                var resultfn;
                var cvalue = $inputbox.value;

                if (e.key === "up") {
                    resultfn = self.commandhistory.upLine;
                } else if (e.key === "down") {
                    resultfn = self.commandhistory.downLine;
                } else if (e.key === "tab" && window.ctrl != 1) {
                    e.stop();
                    self.tabComplete($inputbox);
                    return;
                } else { /* ideally alt and other keys wouldn't break self */
                    parentO.resetTabComplete();
                    return;
                }
                e.stop();

                parentO.resetTabComplete();
                if ((!!cvalue) && (self.lastcvalue !== cvalue))
                    self.commandhistory.addLine(cvalue, true);

                var result = resultfn.call(self.commandhistory);//.bind(self.commandhistory)();

                if (!result)
                    result = "";
                self.lastcvalue = result;

                $inputbox.value = result;
                util.setAtEnd($inputbox);
            };

        self.client.addEvents({
            "mode": function(data) {
                if(data.thisclient) {
                    var statusclass = (data.prefix === OPSTATUS) ? "op" : (data.prefix === VOICESTATUS) ? "voice" : "";
                    $nicklabel.getElement('.status')
                                .removeClass('op')
                                .removeClass('voice')
                                .addClass(statusclass);
                }
            }
        });

        (function() { //have to delay to get from server :/
            var status = (util.isChannel(self.name) && util.isChannelType(self.type)) ? self.client.getNickStatus(self.name, nick) : "", //for this channel (self.name)
                c = (status === OPSTATUS) ? "op" : (status === VOICESTATUS) ? "voice" : "";
            $nicklabel.getElement('.status').addClass(c);
        }).delay(5000);

        $nicklabel.addEvent("click", function() {
            var nick = prompt("Enter a new nickname", self.nickname);
            if(nick) {
                self.client.exec("/nick " + nick);
            }
        });

        $inputbtn.addEvent("click", sendInput);
        $form.addEvent("submit", sendInput);
        $inputbox.addEvents({
                    "focus": resettab,
                    "mousedown": resettab,
                    "keydown": complete
                    });
        return $form;
    },

    nickClick: function(evt, $tar) { //delegation to nick items
        var $tar2 = evt.target.getParent('a.user') || evt.target,//cant gaurentee what was clicked
            hasMenu = $tar.hasClass('selected-middle');

        console.log($tar2)
        console.log($tar);

        this.removePrevMenu(); //collapse old menus
        if (!hasMenu) {
            this.moveMenuClass($tar);
            $tar.addClass("selected")
                .store("menu", this.createMenu($tar.retrieve("nick"), $tar));
        }
    },

    // - clicking user in nick list
    createMenu: function(nick, $parent) {
        var pmenu = $parent.retrieve('menu');
        if(pmenu) {
            return pmenu.toggle();
        }

        var $menu = Element.from(templates.menuContainer()),
            self = this;

        (ui.MENU_ITEMS.filter(function(item) {
            var pred = item.predicate;

            return ($type(pred) === 'function') ? pred.call(self, nick) : //pred.apply(this, nickArray)
                                                  !!pred;
        })).each(function(item) {
            var e2 = Element.from(templates.nickbtn({'nick': "- " + item.text}));
            // var e2 = new Element("a");
            // e2.href = "#";
            // e2.set("text", "- " + item.text)
            e2.addEvents({
                focus: e2.blur,
                click: function(e) {
                    e.stop();
                    self.menuClick(item.fn);
                }
            });

            $menu.appendChild(e2);
        });
        $parent.appendChild($menu);

        return $menu;
    },

    menuClick: function(fn) {
        var selected = this.nicklist.getElement('.selected');
        //i dont understand why these arent equivalent
        fn.call(this, selected.retrieve("nick"));
        this.removePrevMenu();
    },

    moveMenuClass: function($sel) {
        $sel = $($sel) || this.nicklist.getElement('.selected-middle, .selected');
        if (!$sel){}
        else if (this.nicklist.firstChild === $sel) {
            $sel.removeClass("selected-middle");
        } else {
            $sel.addClass("selected-middle");
        }
    },

    removePrevMenu: function() {
        var $sel = this.nicklist.getElements('.nicklist .selected-middle', '.nicklist .selected');
        if ($sel) {
            $sel.removeClass("selected")
                .removeClass("selected-middle");
            var $menu = $sel.retrieve('menu');
            if ($menu) {
                $menu.dispose();
                $sel.eliminate('menu');
            }
        }
    },

    nickListAdd: function(nick, position) {
        var realNick = util.stripPrefix(this.client.prefixes, nick);

        var nickele = Element.from(templates.nickbtn({'nick': nick}));
        var span = nickele.getElement('span');
        nickele.store("nick", realNick);


        if (this.parentObject.uiOptions.NICK_COLOURS) {
            var colour = util.toHSBColour(realNick, this.client);
            if ($defined(colour))
                span.setStyle("color", colour.rgbToHex());
        }

        this.nicklist.insertAt(nickele, position);
        this.moveMenuClass();

        return nickele;
    },

    nickListRemove: function(nick, stored) {
        try {
            this.nicklist.removeChild(stored);
            this.moveMenuClass();
        } catch (e) {
        }
    },
    updateTopic: function(topic) {
        var topice = this.topic;
        topice.empty();

        topice.topicText = topic;
        if (topic) {
            this.parent(topic, topice);
        } else {
            topice.html(templates.topicText({topic:lang.noTopic.message, empty:true}));
        }
        // this.reflow();
    },

    //TODO do all processing in template?
    addLine: function(type, line, colourClass) {
        // var e = new Element("div");
        var eclass;

        if (colourClass) {
            eclass = colourClass;
        } else if (this.lastcolour) {
            eclass = "linestyle1";
        } else {
            eclass = "linestyle2";
        }
        var msge = Element.from(templates.ircMessage({styles: eclass, message: line}));
        this.lastcolour = !this.lastcolour;

        this.parent(type, line, colourClass, msge);
        // this.reflow();
    },
    highlightTab: function(state) {
        this.parent(state);

        if (state == this.hilighted)
            return;

        //inefficient as fuck
        this.tab.removeClass("tab-hilight-activity")
                .removeClass("tab-hilight-us")
                .removeClass("tab-hilight-speech");

        switch (state) {
        case ui.HILIGHT_US:
            this.tab.addClass("tab-hilight-us");
            break;
        case ui.HILIGHT_SPEECH:
            this.tab.addClass("tab-hilight-speech");
            break;
        case ui.HILIGHT_ACTIVITY:
            this.tab.addClass("tab-hilight-activity");
            break;
        }
    }
});
