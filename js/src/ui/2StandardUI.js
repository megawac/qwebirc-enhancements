
ui.StandardUI = new Class({
    Extends: ui.NotificationUI,
    Implements: [ui.IIRCClient, ui.IWindows, ui.ILogin, ui.IUIOptions],
    Binds: ["urlDispatcher", "whoisURL", "updateStylesheet",
            "nextWindow", "prevWindow",
            //custom windows
            "optionsWindow", "faqWindow", "privacyWindow", "aboutWindow", "feedbackWindow", "embeddedWindow"],
    options: {
        routerPrefix: "!"//eg webchat.freenode.net#!login - valid url chars only
    },
    initialize: function(parentElement, theme, uiName, options) {
        var self = this;
        self.parent(options);

        self.theme = theme;
        self.config();

        self.element = self.parentElement = parentElement.addClasses("qwebirc", "qwebirc-" + uiName);
        self.commandhistory = new irc.CommandHistory();
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

        self.router = new Epitome.Router({
            // routes definition will proxy the events
            routes: {
                '': 'index',
                '#options': 'options',
                "#feedback": 'feedback',
                "#about": "about",
                "#faq": "faq",
                "#embedded": 'embedded',
                // '#add webchat to your site': 'embedded',
                "#privacy": "privacy"//,
                // "#privacy policy": "privacy"
            },
            // no route event was found, though route was defined
            onError: function(error){
                console.error(error);
                // recover by going default route
                this.navigate('');
            },
            //try to select the window if it exists
            onUndefined: function(data) {
                var request = data.request.startsWith(rprefix) && data.request.slice(rprefix.length);
                if(request) {
                    var win = _.findWhere(self.windowArray, {identifier:request}) || _.findWhere(self.windowArray, {identifier:util.formatChannel(request)});
                    if(win) {
                        win.select();
                    }
                }
            },
            'onIndex': function() {
                //update options with query string?
            },
            'onOptions': self.optionsWindow,
            'onFaq': self.faqWindow,
            'onPrivacy': self.privacyWindow,
            'onAbout': self.aboutWindow,
            'onFeedback': self.feedbackWindow,
            'onEmbedded': self.embeddedWindow
        });
        
        return this;
    },
    updateURI: function() {
        if(this.router instanceof Epitome.Router && this.active) {
            this.router.navigate(this.options.routerPrefix + util.unformatChannel(this.active.identifier));
        }
    },

    optionsWindow: function() {
        var self = this;
        return self.addCustomWindow("Options", ui.OptionView, "options", {
            model: self.uiOptions2,
            onNoticeTest: function() {
                self.flash({force:true});
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
        var client = target.getParent('.window').retrieve('window').client,
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
    }
});
