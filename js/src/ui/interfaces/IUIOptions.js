ui.IUIOptions = new Class({
    theme: ui.Theme,

    config: function() {
        var self = this;
        var options = self.options;
        if(self.uiOptions instanceof config.OptionModel) return this;
        var uiOptions = self.uiOptions = self.uiOptions2 = new config.OptionModel({}, {
            defaults: options.uiOptions
        });
        function setNotices() {
            var notices = uiOptions.get("standard_notices").concat(uiOptions.get("custom_notices"));
            var notifiers = _.chain(notices)
                .filter(uiOptions.notice_filter)
                .map(function(notice) {
                    var onotice = {
                        beep: notice.beep,
                        flash: notice.flash,
                        pm: notice.pm,

                        mentioned: notice.mentioned,
                        notus: notice.notus,
                        highlight: notice.highlight,
                        tabhl: notice.tabhl,
                        classes: notice.classes,
                        types: notice.types
                    };
                    _.each(["msg", "nick", "type"], function(type) {
                        if(notice[type]) {
                            onotice[type] = new RegExp(notice.autoescape ? String.escapeRegExp(notice[type]) : notice[type],//format regex
                                        notice.case ? "i" : "");//set flag
                        }
                    });

                    return _.clean(onotice);
                })
                .value();
            
            self.theme.messageParsers.empty().combine(notifiers);
            self.theme.config = uiOptions;
        }

        uiOptions.on({
            "change:style_hue": function(style_hue) {
                self.updateStylesheet();
            },
            "change:font_size": self.updateStylesheet,
            "change:custom_notices": setNotices,
            "change:standard_notices": setNotices,
            "change:show_nicklist": function(state) {
                _.each(self.windowArray, function(win){win.toggleNickList()});
            },
            "change:completer": function(completer) {
                self.commandhistory.options.store = completer.store;
                if(!completer.store) self.commandhistory.clear();
                _.each(self.windowArray, function(win) {
                    win.toggleAutocomplete(completer.intrusive);
                });
            }
        });
        setNotices();

        self.setModifiableStylesheet({
            style_hue: options.hue || self.uiOptions.get("style_hue"),
            style_saturation: options.saturation || self.uiOptions.get("style_saturation"),
            style_brightness: options.brightness || self.uiOptions.get("style_brightness")
        });
        return self;
    },

    setModifiableStylesheet: function(vals) {
        this._styleSheet = new Element("style", {
                                type: "text/css",
                                media: "all"
                            }).inject(document.head);
        this.updateStylesheet(vals);
    },
    updateStylesheet: function(values) {//todo calculate all the values and just sub in
        var self = this;
        getTemplate("modifiablecss", function(template) {
            var styles = _.extend({}, Browser, self.uiOptions.toJSON(), values);
            var stylesheet = template(styles);
            var node = self._styleSheet;

            if (node.styleSheet) { /* ie */
                node.styleSheet.cssText = stylesheet;
            } else {
                node.empty()
                    .appendText(stylesheet);
            }
        });
    }
});