/**
 * Controls options
 *
 * @depends [config/OptionModel, ui/Theme]
 * @provides [ui/UIOptions]
 */
ui.IUIOptions = new Class({
    config: function() {
        var self = this;
        var options = self.options;
        if(self.uiOptions instanceof config.OptionModel) return this;
        var uiOptions = self.uiOptions = self.uiOptions2 = new config.OptionModel({}, {
            defaults: options.uiOptions
        });
        var updateStylesheet = self.updateStylesheet.bind(self);
        self.theme = new ui.Theme(uiOptions, options.theme);
        function setNotices() {
            var notices = uiOptions.get("standard_notices").concat(uiOptions.get("custom_notices"));
            var notifiers = notices
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
                    ["msg", "nick", "type"].each(function(type) {
                        if(notice[type]) {
                            onotice[type] = new RegExp(notice.autoescape ? String.escapeRegExp(notice[type]) : notice[type],//format regex
                                                                           notice["case"] ? "i" : "");//set flag
                        }
                    });

                    return Object.cleanValues(onotice);
                });
            
            self.theme.messageParsers.empty().combine(notifiers);
        }
        uiOptions.on({
            "change:colour": updateStylesheet,
            "change:font_size": updateStylesheet,
            "change:custom_notices": setNotices,
            "change:standard_notices": setNotices,
            "change:show_nicklist": function(state) {
                _.invoke(self.windowArray, "toggleNickList");
            },
            "change:completer": function(completer) {
                self.commandhistory.options.store = completer.store;
                if(!completer.store) self.commandhistory.clear();
                _.invoke(self.windowArray, "toggleAutocomplete", completer.intrusive);
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
            type: "text/css"
        }).inject(document.head);
        this.updateStylesheet(vals);
    },

    updateStylesheet: function(values) {
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