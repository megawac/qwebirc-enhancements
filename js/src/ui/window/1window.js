
ui.Window = new Class({
    Extends: Epitome.View,
    options: {
        events: {

        },

        onReady: function() {
            this.render();
        },
        maxLines: 1000
    },
    template: templates.window,

    active: false,
    lastSelected: null,
    closed: false,
    highlight: ui.HIGHLIGHT.none,
    lastNickHash: {},

    initialize: function(parentObject, $par, client, type, name, identifier) {
        this.parentObject = parentObject;
        this.type = type;
        this.currentChannel = this.name = name;
        this.client = client;
        this.identifier = identifier;
        this.history = this.parentObject.commandhistory;
        this.parent({
            element: $par
        });
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
        if (this.highlight)
            this.highlightTab(ui.HIGHLIGHT.none);

        this.fireEvent("selected");
        this.lastSelected = new Date();
    },

    deselect: function() {
        this.active = false;
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
            uiobj = self.parentObject;
        var highlight = ui.HIGHLIGHT.none,
            hl_line = false;

        highlight = uiobj.theme.highlightAndNotice(data, type, self, $ele);

        if (!self.active && (highlight !== ui.HIGHLIGHT.none))
            self.highlightTab(highlight);

        var tsE = templates.timestamp({time:util.IRCTimestamp(new Date())});
        $ele.insertAdjacentHTML('afterbegin', tsE);

        var formatted = uiobj.theme.formatMessage($ele, type, data, hl_line);
        self.lines.adopt($ele)
                .maxChildren(this.options.maxLines);

        if(uiobj.uiOptions2.get("lastpos_line") && type.endsWith("CHANMSG")) {
            this.lastLine = (this.lastLine || Element.from(templates.messageLine())).inject(this.lines);
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

    //holy shit i got this to actually make sense
    // takes nicks (sorted array)
    updateNickList: function(nicks) {
        var lnh = this.lastNickHash,
            oldnames = Object.keys(lnh),

            added = _.difference(nicks, oldnames),//users who joined
            left = _.difference(oldnames, nicks); //users who left

        _.each(left, function(nick) {
            var element = lnh[nick];
            this.nickListRemove(nick, element);
            delete lnh[nick];
        }, this)

        _.each(added, function(nick) {
            var index = nicks.indexOf(nick); //indx in sorted array
            lnh[nick] = this.nickListAdd(nick, index) || 1;
        }, this);
    },

    
    nickListAdd: function(nick, position) {
        var realNick = util.stripPrefix(this.client.prefixes, nick);

        var nickele = Element.from(templates.nickbtn({'nick': nick}));
        var span = nickele.getElement('span');
        nickele.store("nick", realNick);


        if (this.parentObject.uiOptions2.get("nick_colours")) {
            var colour = util.toHSBColour(realNick, this.client);
            if ($defined(colour))
                span.setStyle("color", colour.rgbToHex());
        }

        this.nicklist.insertAt(nickele, position);

        return nickele;
    },

    nickListRemove: function(nick, stored) {
        try {
            this.nicklist.removeChild(stored);
        } catch (e) {
        }
    },

    sendInput: function(e/*, $tar*/) {
        if(e) e.stop();
        // if(!$tar || !$tar.hasClass('input-field')) {
        var $tar = this.$input;
        //}
        var unparsed = $tar.val(),
            parsed = util.inputParser.parse(unparsed);
        if (parsed !== "") {
            this.history.addLine(this.name, unparsed || parsed);
            this.client.exec(parsed, this.currentChannel);
            $tar.val("");
        }
        $tar.focus();
    }
});
