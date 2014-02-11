ui.StandardUI = new Class({
    // Extends: ui.NotificationUI,
    Implements: [Options, ui.IIRCClient, ui.IWindows, ui.ILogin, ui.IUIOptions, ui.INotifiers],
    Binds: ["whoisURL", "updateStylesheet",
            "nextWindow", "prevWindow",
            //custom windows
            /*"optionsWindow", "faqWindow", "privacyWindow", "aboutWindow", "feedbackWindow", "embeddedWindow"*/
            ],
    // options: { -TODO
    //     routerPrefix: "!"//eg webchat.freenode.net#!login - valid url chars only
    // },
    initialize: function(parentElement, theme, uiName, options) {
        var self = this.setOptions(options);
        self.settings = options.settings;

        document.addEvent("domready", function() {
            self.theme = theme;
            self.config();

            parentElement = self.element = self.parentElement = $(parentElement).addClasses("qwebirc", "qwebirc-" + uiName);
            self.commandhistory = new irc.CommandHistory({
                store: self.uiOptions.get("completer").store
            });
            self.windows[ui.WINDOW.custom] = self.customWindows;

            getTemplate("qwebirc-layout", function(template) {
                Elements.from(template()).inject(parentElement);
                self.outerTabs = parentElement.getElement(".outertabbar");
                self.windowsPanel = parentElement.getElement(".windows");
            });

            self.postInitialize();
            self.fireEvent("ready");
        });
    },

    postInitialize: function() {
        var self = this;

        self.nav = new ui.NavBar({
            element: self.outerTabs,
            menuElement: self.element
        });
        self.nav.on({
            "selectWindow": function(e, target) {
                e.stop();
                target.retrieve("window").select();
            },
            "closeWindow": function(e, target) {
                e.stop();
                target.getParent(".tab").retrieve("window").close();
            },
            "nextWindow": self.nextWindow,
            "prevWindow": self.prevWindow
        });
        
        self.element.addEvent("click:relay(.internal)", function(e, $tar) {
            e.preventDefault();
            self.updateURI($tar.get("href"));
        });

        /* jshint maxcomplexity:false */
        var checkRoute = _.partial(_.defer, function(data) {
            var request = util.unformatURL(data.request).toLowerCase();
            if(DEBUG) console.log("Route: %s Formatted: %s", data.request, request);

            if(self.active && request === self.active.identifier) {
                return;
            }

            switch(request) {
                case "options":
                    self.optionsWindow();
                    break;
                case "channels":
                    self.channelWindow();
                    break;
                case "privacy":
                    self.privacyWindow();
                    break;
                case "faq":
                    self.faqWindow();
                    break;
                case "about":
                    self.aboutWindow();
                    break;
                case "embedded":
                    self.embeddedWindow();
                    break;
                case "feedback":
                    self.feedbackWindow();
                    break;
                default:
                    var win = _.findWhere(self.windowArray, {identifier:request});
                    if(win) {
                        win.select();
                    } else if(util.isChannel(request)) {
                        _.each(self.clients, function(client) {
                            client.exec("/JOIN " + request);
                        });
                    }
            }
        });

        // hasher.initialized.add(checkRoute); // parse initial hash
        // hasher.changed.add(checkRoute); //parse hash changes
        // hasher.init(); //start listening for history change
        // hasher.prependHash = "~";
        self.router = new Epitome.Router({
            onUndefined: checkRoute
        });

        return this;
    },

    updateURI: function(url) {
        url = url || this.active.identifier;
        if(this.router && (url != constants.login || location.hash)) this.router.navigate(util.formatURL(url));
    },

    whoisURL: function(e, target) {
        var client = target.getParent(".window").retrieve("window").client,
            nick = target.get("data-user");
        /*if (this.uiOptions.get("query_on_nick_click")) {
            client.exec("/QUERY " + nick);
        } else {*/
        client.exec("/WHOIS " + nick);
        //}
    },

    optionsWindow: function() {
        var self = this;
        return self.addCustomWindow("options", ui.OptionView, "options", {
            model: self.uiOptions,
            onNoticeTest: function() {
                self.flash(true);
                self.beep();
                self.showNotice({}, true);
            },
            getUI: function() {
                return self;
            }
        });
    },
    channelWindow: function() {
        var self = this;
        var win = self.addCustomWindow("channels", ui.ChannelList, "channel-list", {
            onAddChannel: function(channel) {
                var settings = self.options.settings;
                if(_.isEmpty(self.clients)) {
                    settings.set("channels", util.addChannel(settings.get("channels"), channel));
                } else {
                    self.clients[self.clientId -1].exec("/JOIN " + channel);
                }
            }
        });
        var sib = self.windows.brouhaha || self.getWindow(constants.login);
        if(sib) self.linkWindows(win, {cols: "col-xl-5 col-md-6 col-sm-12", sibs: [sib] });
        return win;
    },
    embeddedWindow: function() {
        return this.addCustomWindow("embedded", ui.EmbedWizard, "embedded-wizard");
    },
    aboutWindow: function() {
        return this.addCustomWindow("about", ui.AboutPane, "about");
    },
    privacyWindow: function() {
        return this.addCustomWindow("privacy", ui.PrivacyPolicyPane, "privacypolicy");
    },
    feedbackWindow: function() {
        return this.addCustomWindow("feedback", ui.FeedbackPane, "feedback");
    },
    faqWindow: function() {
        return this.addCustomWindow("faq", ui.FAQPane, "faq");
    }
});
