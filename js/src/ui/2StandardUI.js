ui.StandardUI = new Class({
    // Extends: ui.NotificationUI,
    Implements: [Options, ui.IIRCClient, ui.IWindows, ui.ILogin, ui.IUIOptions, ui.INotifiers],
    Binds: ["whoisURL", "updateStylesheet",
            "nextWindow", "prevWindow",
            //custom windows
            "optionsWindow", "faqWindow", "privacyWindow", "aboutWindow", "feedbackWindow", "embeddedWindow"],
    options: {
        routerPrefix: "!"//eg webchat.freenode.net#!login - valid url chars only
    },
    initialize: function(parentElement, theme, uiName, options) {
        var self = this.setOptions(options);

        document.addEvent("domready", function() {
            self.theme = theme;
            self.config();

            parentElement = self.element = self.parentElement = $(parentElement).addClasses("qwebirc", "qwebirc-" + uiName);
            self.commandhistory = new irc.CommandHistory({
                store: self.uiOptions.get("completer").store
            });
            self.windows[ui.CUSTOM_CLIENT] = self.customWindows;

            getTemplate("topPane", function(template) {
                self.outerTabs = Element.from(template()).inject(parentElement);
            });
            getTemplate("windowsPane", function(template) {
                self.windowsPanel = Element.from(template()).inject(parentElement);
            });

            self.postInitialize();
            self.fireEvent("ready");
        });
    },

    postInitialize: function() {
        var self = this,
            rprefix = self.options.routerPrefix;

        self.nav = new ui.NavBar({
            element: self.outerTabs,
            menuElement: self.element
        });
        self.nav.on({
            "selectWindow": function(e, target) {
                e.stop();
                target.retrieve('window').select();
            },
            "closeWindow": function(e, target) {
                e.stop();
                target.getParent('.tab').retrieve('window').close();
            },
            "nextWindow": self.nextWindow,
            "prevWindow": self.prevWindow
        });
        
        self.element.addEvent("click:relay(.internal)", function(e, $tar) {
            e.preventDefault();
            self.updateURI($tar.get("href"));
        });

        function checkRoute(data) {
            var request = util.unformatURL(data.request).toLowerCase();
            // if(self.options.debug) console.log("Route: %s Formatted: %s", data.request, request);

            if(self.active && request === self.active.identifier) {
                return;
            }

            switch(request) {
                case "options":
                    self.optionsWindow();
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
        }

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
        if(this.router && (url != "login" || location.hash)) this.router.navigate(util.formatURL(url));
    },

    whoisURL: function(e, target) {
        var client = target.getParent('.window').retrieve('window').client,
            nick = target.get('data-user');
        /*if (this.uiOptions.get("query_on_nick_click")) {
            client.exec("/QUERY " + nick);
        } else {*/
        client.exec("/WHOIS " + nick);
        //}
    },

    optionsWindow: function() {
        var self = this;
        return self.addCustomWindow("Options", ui.OptionView, "options", {
            model: self.uiOptions,
            onNoticeTest: function() {
                self.flash(true);
                self.login();
                self.showNotice({}, true);
            },
            getUI: function() {
                return self;
            }
        });
    },
    embeddedWindow: function() {
        return this.addCustomWindow("Add webchat to your site", ui.EmbedWizard, "embedded-wizard");
    },
    aboutWindow: function() {
        return this.addCustomWindow("About", ui.AboutPane, "about");
    },
    privacyWindow: function() {
        return this.addCustomWindow("Privacy policy", ui.PrivacyPolicyPane, "privacypolicy");
    },
    feedbackWindow: function() {
        return this.addCustomWindow("Feedback", ui.FeedbackPane, "feedback");
    },
    faqWindow: function() {
        return this.addCustomWindow("FAQ", ui.FAQPane, "faq");
    }
});
