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
        if(self.uiOptions instanceof config.OptionModel) return self;
        var uiOptions = self.uiOptions = new config.OptionModel({}, {
            defaults: options.uiOptions
        });
        var updateStylesheet = self.updateStylesheet.bind(self);
        self.theme = new ui.Theme(options.theme);
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
            "change:show_nicklist": function(/*state*/) {
                _.invoke(self.windowArray, "toggleNickList");
            },
            "change:completer": function(completer) {
                self.commandhistory.options.store = completer.store;
                if(!completer.store) self.commandhistory.clear();
                _.invoke(self.windowArray, "toggleAutocomplete", completer.intrusive);
            }
        });
        setNotices();


        self._styleSheet = new Element("style", {
            type: "text/css"
        }).inject(document.head);

        updateStylesheet({
            colour: Object.filter({
                back: options.background,
                font: options.font
            }, Boolean)
        });

        return self;
    },

    updateStylesheet: function(values) {
        var self = this;
        getTemplate("modifiablecss", function(template) {
            var styles = _.merge({}, Browser, self.uiOptions.toJSON(), values);
            var stylesheet = template(styles);
            
            //update stylesheet
            var node = self._styleSheet;
            if ("styleSheet" in node) { /* ol ie */
                node.styleSheet.cssText = stylesheet;
            } else {
                node.empty()
                    .appendText(stylesheet);
            }
        });
    }
});