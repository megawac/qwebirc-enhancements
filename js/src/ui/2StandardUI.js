
ui.StandardUI = new Class({
    Extends: ui.BaseUI,
    Binds: ["__handleHotkey", "optionsWindow", "embeddedWindow", "urlDispatcher", "resetTabComplete", "whoisURL", "setModifiableStylesheetValues"],

    UICommands: ui.UI_COMMANDS,
    initialize: function(parentElement, theme, windowClass, uiName, options) {
        var self = this;
        self.parent(parentElement, windowClass, uiName, options);

        self.theme = theme;

        self.tabCompleter = new ui.TabCompleterFactory(self);
        // self.uiOptions = new ui.DefaultOptionsClass(self, options.uiOptionsArg);
        self.uiOptions2 = new config.OptionModel({
            defaults: self.options.uiOptionsArg
        }, {
            onInit: function() {//merge where necessary
                var model = this;
                ["notify_on_mention", "notify_on_pm", "notify_on_notice"].each(function(type) {
                    var notifier = self.theme.messageParsers.filter(function(n) { return n.id === type; })[0],
                        set = model.get(type);
                    Object.merge(notifier, set);

                    model.on("change:" + type, function() {
                        Object.merge(notifier, set);
                    });
                });
            }
        });

        function setCustoms(notices) {
            self.theme.customNotices = _.chain(notices).clone()
                .reject(function(data) {
                    return !(data.msg || data.msg.trim() === "") && (!data.nick || data.nick.trim() === "");
                })
                .map(function(notice) {
                    return {
                        msg: new RegExp(notice.autoescape ? String.escapeRegExp(notice.msg) : notice.msg),
                        beep: notice.beep,
                        flash: notice.flash
                    };
                })
                .value();
        }
        function setSNotice(notices) {
            _.each(self.theme.messageParsers, function(parser) {
                if( _.has(notices, parser.id) )
                    _.extend(parser, notices[parser.id]);
            });
        }

        self.uiOptions2.on({
            "change:style_hue": function(hue) {
                self.setModifiableStylesheetValues({
                    hue: hue
                })
            },
            "change:font_size": self.setModifiableStylesheetValues,
            "change:custom_notices": setCustoms,
            "change:notices": setSNotice
        });
        setCustoms(self.uiOptions2.get("custom_notices"));
        setSNotice(self.uiOptions2.get("notices"));

        self.customWindows = {};

        self.__styleValues = {
            hue: self.options.hue || self.uiOptions2.get("style_hue"),
            saturation: self.options.saturation || self.uiOptions2.get("style_saturation"),
            lightness: self.options.lightness || self.uiOptions2.get("style_brightness")
        };
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
        ew.addEvent("close", win.close);

        win.setSubWindow(ew);
    },
    embeddedWindow: function() {
        this.addCustomWindow("Add webchat to your site", ui.EmbedWizard, "embeddedwizard", {
            baseURL: this.options.baseURL,
            uiOptions: this.uiOptions2,
            optionsCallback: this.optionsWindow
        });
    },
    optionsWindow: function() {
        var self = this;
        var constructor = function(element, data) {
            return new ui.OptionView({
                element: element,
                model: data,
                onNoticeTest: function() {
                    self.flash();
                }
            });
        }
        self.addCustomWindow("Options", constructor, "optionspane", self.uiOptions2);
    },
    aboutWindow: function() {
        this.addCustomWindow("About", ui.AboutPane, "aboutpane", this.uiOptions2);
    },
    privacyWindow: function() {
        this.addCustomWindow("Privacy policy", ui.PrivacyPolicyPane, "privacypolicypane", this.uiOptions2);
    },
    feedbackWindow: function() {
        this.addCustomWindow("Feedback", ui.FeedbackPane, "feedbackpane", this.uiOptions2);
    },
    faqWindow: function() {
        this.addCustomWindow("FAQ", ui.FAQPane, "faqpane", this.uiOptions2);
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
            var uiOptions2 = this.uiOptions2;
            ///this method is dumb
            return ["span", function(nick) {
                if (uiOptions2.QUERY_ON_NICK_CLICK) {
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

    whoisURL: function(e, target) {
        var client = target.getParent('.lines').retrieve('client'),
            nick = target.get('data-user');
        if (this.uiOptions2.QUERY_ON_NICK_CLICK) {
            client.exec("/QUERY " + nick);
        } else {
            if (isChannel(nick)) {
                nick = util.unformatChannel(nick);
            } else if (nick.search(client.nickname + '>') >= 0) {
                nick = nick.substr(nick.search('>') + 1, nick.length);
            } 
            client.exec("/WHOIS " + nick);
        }
    },

    chanURL: function(e, target) {
        var client = target.getParent('.lines').retrieve('client'),
            chan = target.get('data-chan');
        if(util.isChannel(chan))
            client.exec("/JOIN " + chan);
    },

    tabComplete: function(element) {
        this.tabCompleter.tabComplete(element);
    },
    resetTabComplete: function() {
        this.tabCompleter.reset();
    },
    setModifiableStylesheet: function(name) {
        this.__styleSheet = new ui.style.ModifiableStylesheet(this.options.modifiableStylesheet);
        this.setModifiableStylesheetValues();
    },
    setModifiableStylesheetValues: function(values) {//todo calculate all the values and just sub in
        Object.append(this.__styleValues, values);

        if (!$defined(this.__styleSheet))
            return;

        var hue = this.__styleValues.hue,
            lightness = this.__styleValues.lightness,
            saturation = this.__styleValues.saturation,
            uiOptions = this.uiOptions2;

        this.__styleSheet.set(function(mode, val, _default) {
            if (mode == "c") {
                var x = new Color(val);
                var c = x.setHue(hue).setSaturation(x.hsb[1] + saturation).setBrightness(x.hsb[2] + lightness);
                if (c == "255,255,255") // IE confuses white with transparent... 
                c = "255,255,254";

                return "rgb(" + c + ")";
            }
            else if (mode == "o") {
                return uiOptions.get(val);
            }
            return _default;
        });
    }
});
