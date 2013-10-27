
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

        self.theme = theme;
        self.config();

        self.element = self.parentElement = $(parentElement).addClasses("qwebirc", "qwebirc-" + uiName);
        self.commandhistory = new irc.CommandHistory({
            store: self.uiOptions.get("completer").store
        });
        self.windows[ui.CUSTOM_CLIENT] = this.customWindows;

        getTemplate("topPane", function(template) {
            self.outerTabs = Element.from(template()).inject(parentElement);
        });
        getTemplate("windowsPane", function(template) {
            self.windowsPanel = Element.from(template()).inject(parentElement);
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
            console.log("Route: %s Formatted: %s", data.request, request);

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
            // routes definition will proxy the events
            // routes: {
            //     '': 'index',
            //     '#!options': 'options',
            //     "#!feedback": 'feedback',
            //     "#!about": "about",
            //     "#!faq": "faq",
            //     "#!embedded": 'embedded',
            //     "#!privacy": "privacy"
            // },
            // // no route event was found, though route was defined
            // onError: function(error){
            //     if(DEBUG) console.error(error);
            //     // recover by going default route
            //     this.navigate('');
            // },
            // 'onIndex': function() {
            //     //update options with query string?
            // },
            // 'onOptions': self.optionsWindow,
            // 'onFaq': self.faqWindow,
            // 'onPrivacy': self.privacyWindow,
            // 'onAbout': self.aboutWindow,
            // 'onFeedback': self.feedbackWindow,
            // 'onEmbedded': self.embeddedWindow,
            //try to select the window if it exists
            // onUndefined: function(data) {
            //     var request = util.unformatURL(data.request);
            //     if(request) {
            //         var win = _.findWhere(self.windowArray, {identifier:request});
            //         if(win) {
            //             win.select();
            //         } else if(util.isChannel(request)) {
            //             _.each(self.clients, function(client) {
            //                 client.exec("/JOIN " + request);
            //             });
            //         }
            //     }
            // }
            onUndefined: checkRoute
        });

        return this;
    },

    updateURI: function(url) {
        // hasher.setHash(util.formatURL(url || this.active.identifier));
        if(this.router) this.router.navigate(util.formatURL(url || this.active.identifier));
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
                self.beep();
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
