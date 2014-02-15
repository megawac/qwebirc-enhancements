/**
 * Abstract window
 *
 * @depends [util/uihelpers, util/utils]
 * @provides [ui/Window]
 */
ui.Window = new Class({
    Extends: Epitome.View,
    Binds: ["sendInput"],
    options: {
        onReady: function() {
            this.render();
        },
        maxLines: 1000
    },
    template: util.loadTemplate("window"),

    active: false,
    closed: false,
    highlight: ui.HIGHLIGHT.none,
    lastNickHash: {},

    initialize: function(parentObject, $par, client, type, name, identifier) {
        this.parentObject = parentObject;
        this.type = type;
        this.currentChannel = this.name = name;
        this.client = client;
        this.id = identifier;
        this.history = this.parentObject.commandhistory;
        this.parent({
            element: $par
        });
    },

    isActive: function() {
        return this.element.hasClass("active");
    },

    getOption: function(option) {
        return this.parentObject.uiOptions.get(option);
    },

    close: function() {
        this.closed = true;
        this.parentObject.__closed(this);
        this.destroy();
        return this;
    },

    select: function() {
        if(this.active || this.closed) return;
        this.active = true;
        this.parentObject.selectWindow(this);
        if (this.highlight) this.highlightTab(ui.HIGHLIGHT.none);

        this.fireEvent("selected");
    },

    deselect: function() {
        this.active = false;
        this.fireEvent("deselected");
    },


    /* A data is an object of the form:
    -: current nick
    @: opstatus
    c: channel
    f: origin channel
    h: ip of propogater
    m: msg
    n: nick
    */
    addLine: function(type, data, colour, $ele) {
        var self = this,
            parent = self.parentObject;
        var highlight =  self.id !== "brouhaha" ? parent.theme.highlightAndNotice(data, type, self, $ele) : ui.HIGHLIGHT.none,
            hl_line = false;

        if (!self.active && (highlight !== ui.HIGHLIGHT.none)) {
            self.highlightTab(highlight);
        }

        parent.theme.formatMessage($ele, type, data, hl_line);
        self.lines.adopt($ele)
                .maxChildren(self.options.maxLines);//remove lines if > maxLines

        if(self.getOption("lastpos_line") && type.endsWith("CHANMSG")) {
            self.lastLine = (self.lastLine || Element.from(templates.messageLine())).inject(self.lines);
        }
    },
    errorMessage: function(message) {
        this.addLine("", message, "warn");
    },
    infoMessage: function(message) {
        this.addLine("", message, "info");
    },
    highlightTab: function(state) {
        if (state == ui.HIGHLIGHT.none || state >= this.highlight) {
            this.highlight = state;
        }
    },

    sendInput: function(e/*, $tar*/) {
        if(e) e.stop();
        // if(!$tar || !$tar.hasClass("input-field")) {
        var $tar = this.$input;
        //}
        var unparsed = $tar.val(),
            parsed = util.inputParser.parse(unparsed);
        if (parsed) {
            this.history.addLine(this.name, unparsed || parsed);
            this.client.exec(parsed, this.currentChannel);
            $tar.val("");
        }
        $tar.blur();//in case a new channel is created
    }
});
