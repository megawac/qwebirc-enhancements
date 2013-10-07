ui.IUIOptions = new Class({
    theme: ui.Theme,

    config: function() {
        var self = this;
        if(self.uiOptions instanceof config.OptionModel) return this;
        var uiOptions = self.uiOptions = self.uiOptions2 = new config.OptionModel({
            defaults: self.options.uiOptionsArg
        });
        function setCustomNotice(notices) {
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
        function setStandardNotice(notices) {
            _.each(self.theme.messageParsers, function(parser) {
                if(_.has(notices, parser.id) )
                    _.extend(parser, notices[parser.id]);
            });
        }

        uiOptions.on({
            "change:style_hue": function(style_hue) {
                self.updateStylesheet();
            },
            "change:font_size": self.updateStylesheet,
            "change:custom_notices": setCustomNotice,
            "change:notices": setStandardNotice,
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
        setCustomNotice(uiOptions.get("custom_notices"));
        setStandardNotice(uiOptions.get("notices"));

        self.setModifiableStylesheet({
            style_hue: self.options.hue || self.uiOptions.get("style_hue"),
            style_saturation: self.options.saturation || self.uiOptions.get("style_saturation"),
            style_brightness: self.options.brightness || self.uiOptions.get("style_brightness")
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
            var stylesheet = template(styles);//.split("}").join("}\n")
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