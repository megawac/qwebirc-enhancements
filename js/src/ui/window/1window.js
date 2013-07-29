
ui.Window = new Class({
    Implements: [Events],
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

        if (this.type & parentObject.uiOptions2.get("lastpos_line")) {
            this.lastPositionLine = Element.from(templates.messageLine());
            this.lastPositionLineInserted = false;
        }

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
            this.lines.disown(this.lastPositionLine);
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

        // this.setScrollPos();
        // if ($defined(this.scrolltimer)) {
        //     $clear(this.scrolltimer);
        //     this.scrolltimer = null;
        // }

        if (this.type & ui.WINDOW_LASTLINE)
            this.replaceLastPositionLine();

        this.active = false;
    },

    resetScrollPos: function() {
        // if (this.scrolleddown) {
        //     this.scrollToBottom();
        // } else if ($defined(this.scrollpos)) {
        //     this.getScrollParent().scrollTo(this.scrollpos.x, this.scrollpos.y);
        // }
    },
    setScrollPos: function() {
        // if (!this.parentObject.singleWindow) {
        //     this.scrolleddown = this.scrolledDown();
        //     this.scrollpos = this.lines.getScroll();
        // }
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
        var hilight = ui.HILIGHT_NONE,
            hl_line = false;

        if (type && data) {
        //regexs
            var isbot = /^TF2/.test(data.n), //works for pugna(hl), mix(hl)
                ismsg = /(NOTICE|ACTION|MSG)$/.test(type),
                regNotice = /NOTICE$/,
                sentByUs = /^OUR/.test(type),//ignore
                containsNick = util.testForNick(self.client.nickname);

            var notice = function() {
                if (!(self.active && uiobj.windowFocused) && data.c !== BROUHAHA) {
                    uiobj.beep();
                    uiobj.flash();
                }
            };

            hilight = ui.HILIGHT_ACTIVITY;

            if (ismsg) {
                //highlighting
                if (data.n && data.m && self.type === ui.WINDOW_CHANNEL) {
                    $ele.addClass('message');
                    if(isbot)
                        $ele.addClass('bot');
                    else if(sentByUs)
                        $ele.addClass('our');
                    if(!isbot && data.m.startsWith("!"))
                        $ele.addClass('command');
                }

                if (self.type === ui.WINDOW_QUERY || self.type === ui.WINDOW_MESSAGES) {
                    if (sentByUs || regNotice.test(type)) {
                        hilight = ui.HILIGHT_ACTIVITY;
                    } else {
                        hilight = ui.HILIGHT_US;
                        notice(); //private message
                    }
                }
                else if (regNotice.test(type) && self.type === ui.WINDOW_CHANNEL) {
                    $ele.style.color = "red";
                    notice();
                }
                else if (!sentByUs && containsNick(data.m)) { //dont beep if bot says our name
                    if(isbot) {
                        $ele.addClass('bot@us')
                    }
                    else {
                        hl_line = true;
                        hilight = ui.HILIGHT_US;
                        notice();//name mention in chan
                    }
                }
                else if (hilight !== ui.HILIGHT_US) {
                    hilight = ui.HILIGHT_SPEECH;
                }
            }
        }

        if (!self.active && (hilight !== ui.HILIGHT_NONE))
            self.highlightTab(hilight);

        var tsE = templates.timestamp({time:util.IRCTimestamp(new Date())});
        $ele.insertAdjacentHTML('afterbegin', tsE);
        // $ele.appendChild($ele.from(tsE));

        // var themed = type ? uiobj.theme.message(type, data, hl_line) : data;
        // ui.Colourise(themed, $ele, self);

        var formatted = uiobj.theme.formatMessage($ele, type, data, hl_line);
        // self.scrollAdd($ele);
        self.lines.adopt($ele);
    },
    errorMessage: function(message) {
        this.addLine("", message, "warncolour");
    },
    infoMessage: function(message) {
        this.addLine("", message, "infocolour");
    },
    highlightTab: function(state) {
        if (state == ui.HILIGHT_NONE || state >= this.hilighted)
            this.hilighted = state;
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

    nickListAdd: function(nick, position) {},
    nickListRemove: function(nick, stored) {},
    historyExec: function(line) {
        this.commandhistory.addLine(line);
        this.client.exec(line, this.currentChannel);
    },
    focusChange: function(newValue) {
        if (!(newValue !== true || (this.type & ui.WINDOW_LASTLINE)))
            this.replaceLastPositionLine();
    },
    replaceLastPositionLine: function() {
        if (this.parentObject.uiOptions2.get("lastpos_line")) {
            if (!this.lastPositionLineInserted) {
                // this.scrollAdd(this.lastPositionLine);
            } else if (this.lines.lastChild !== this.lastPositionLine) {
                try {
                    this.lines.disown(this.lastPositionLine);
                } catch (e) { /* IGNORE, /clear removes lastPositionLine from the dom without resetting it. */
                }
                // this.scrollAdd(this.lastPositionLine);
            }
        } else {
            if (this.lastPositionLineInserted)
                this.lines.disown(this.lastPositionLine);
        }

        this.lastPositionLineInserted = this.parentObject.uiOptions2.get("lastpos_line");
    }
});
