
ui.Window = new Class({
    Implements: [Events],
    Binds: ["sendInput"],
    initialize: function(parentObject, client, type, name, identifier) {
        this.parentObject = parentObject;
        this.type = type;
        this.currentChannel = this.name = name;
        this.active = false;
        this.client = client;
        this.identifier = identifier;
        this.hilighted = ui.HILIGHT_NONE;
        // this.scrolltimer = null;
        this.commandhistory = this.parentObject.commandhistory;
        // this.scrolleddown = true;
        // this.scrollpos = null;
        this.lastNickHash = {};
        this.lastSelected = null;
        this.subWindow = null;
        this.closed = false;

        this.window = this.parentObject.qjsui.createWindow();
    },
    updateTopic: function(topic, element) {
        this.parentObject.theme.formatElement("[" + topic + "]", element);
    },
    close: function() {
        this.closed = true;

        // if ($defined(this.scrolltimer)) {
        //     $clear(this.scrolltimer);
        //     this.scrolltimer = null;
        // }

        this.parentObject.__closed(this);
        this.fireEvent("close", this);
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
        if (this.lastPositionLineInserted && !this.parentObject.uiOptions2.get("lastpos_line")) {
            this.lastPositionLineInserted = false;
        }

        this.active = true;
        this.parentObject.__setActiveWindow(this);
        if (this.hilighted)
            this.highlightTab(ui.HILIGHT_NONE);

        this.subEvent("select");
        // this.resetScrollPos();
        this.lastSelected = new Date();
    },

    deselect: function() {
        this.subEvent("deselect");

        this.active = false;
    },


    /* A line is an object of the form:
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
        // $ele.appendChild($ele.from(tsE));

        // var themed = type ? uiobj.theme.message(type, data, hl_line) : data;
        // ui.Colourise(themed, $ele, self);

        var formatted = uiobj.theme.formatMessage($ele, type, data, hl_line);
        // self.scrollAdd($ele);
        self.lines.adopt($ele);

        if(uiobj.uiOptions2.get("lastpos_line")) {
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

            added = prelude.difference(nicks, oldnames),//users who joined
            left = prelude.difference(oldnames, nicks); //users who left

        left.each(function(nick) {
            var element = lnh[nick];
            this.nickListRemove(nick, element);
            delete lnh[nick];
        }, this);

        added.each(function(nick) {
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
        e.stop();
        var target = e.target.tagName !== "INPUT" ? e.target.getElement('input[type="text"]') : e.target,
            unparsed = target.val(),
            parsed = util.inputParser.parse(unparsed);
        if (parsed !== "") {
            this.parentObject.resetTabComplete();
            this.commandhistory.addLine(unparsed || parsed);
            this.client.exec(line, this.currentChannel);
            target.val("");
        }
        target.focus();
    }
});
