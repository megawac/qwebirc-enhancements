
ui.Window = new Class({
    Extends: Epitome.View,
    Binds: ["sendInput"],
    options: {
        events: {

        },

        onReady: function() {
            this.render();
        }
    },
    template: templates.window,

    active: false,
    lastSelected: null,
    closed: false,
    subWindow: null,
    hilighted: ui.HILIGHT_NONE,
    lastNickHash: {},

    initialize: function(parentObject, $par, client, type, name, identifier) {
        this.parentObject = parentObject;
        this.type = type;
        this.currentChannel = this.name = name;
        this.client = client;
        this.identifier = identifier;
        this.commandhistory = this.parentObject.commandhistory;
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
    subEvent: function(event) {
        var sub = this.subWindow
        if ($defined(sub))
            sub.fireEvent.call(sub, event);
    },
    setSubWindow: function(win) {
        this.subWindow = win;
    },

    select: function() {
        if(this.active) return;
        this.active = true;
        this.parentObject.selectWindow(this);
        if (this.hilighted)
            this.highlightTab(ui.HILIGHT_NONE);

        this.subEvent("select");
        this.lastSelected = new Date();
    },

    deselect: function() {
        this.subEvent("deselect");

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
        var highlight = ui.HILIGHT_NONE,
            hl_line = false;

        highlight = uiobj.theme.highlightAndNotice(data, type, self, $ele);

        if (!self.active && (highlight !== ui.HILIGHT_NONE))
            self.highlightTab(highlight);

        var tsE = templates.timestamp({time:util.IRCTimestamp(new Date())});
        $ele.insertAdjacentHTML('afterbegin', tsE);

        var formatted = uiobj.theme.formatMessage($ele, type, data, hl_line);
        self.lines.adopt($ele);

        if(uiobj.uiOptions2.get("lastpos_line") && type.endsWith("CHANMSG")) {
            this.lastLine = (this.lastLine || Element.from(templates.messageLine())).inject(this.lines);
        }
    },
    errorMessage: function(message) {
        this.addLine("", message, "warncolour");
    },
    infoMessage: function(message) {
        this.addLine("", message, "infocolour");
    },
    highlightTab: function(state) {
        if (state == ui.HILIGHT_NONE || state >= this.hilighted) {
            this.hilighted = state;
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
        this.moveMenuClass();

        return nickele;
    },

    nickListRemove: function(nick, stored) {
        try {
            this.nicklist.removeChild(stored);
            this.moveMenuClass();
        } catch (e) {
        }
    },

    sendInput: function(e, target) {
        if(e) e.stop();
        var target = e.target.tagName !== "INPUT" ? e.target.getElement('input[type="text"]') : e.target,
            unparsed = target.val(),
            parsed = util.inputParser.parse(unparsed);
        if (parsed !== "") {
            this.parentObject.resetTabComplete();
            this.commandhistory.addLine(unparsed || parsed);
            this.client.exec(parsed, this.currentChannel);
            target.val("");
        }
        target.focus();
    }
});
