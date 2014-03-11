/**
 * Abstract window
 *
 * @depends [util/uihelpers, util/utils]
 * @provides [ui/Window]
 */
ui.Window = new Class({
    Extends: Epitome.View,
    Binds: ["close"],
    options: {
        onReady: function() {
            this.render();
        },
        maxLines: 1000,
        events: {
            "click": "setActive"
        }
    },
    template: util.loadTemplate("window"),

    active: false,
    closed: false,
    highlight: constants.hl.none,
    lastNickHash: {},

    initialize: function(parentObject, $par, client, type, name, identifier) {
        this.parentObject = parentObject;
        this.type = type;
        this.currentChannel = this.name = name;
        this.client = client;
        this.id = identifier;
        this.history = this.parentObject.commandhistory;
        this.tab = parentObject.newTab(this, name);
        this.parent({
            element: $par
        });
    },

    setActive: _.throttle(function(/*e*/) {//sets this window as the most active
        // if(!this.element.hasClass("active")) {
        this.element.addClass("active")
                    .getSiblings(".active").removeClass("active");
        // }
        return this;
    }, 1000, true),

    isActive: function() {
        return this.element.hasClass("active");
    },

    getOption: function(option) {
        return this.parentObject.uiOptions.get(option);
    },

    close: function() {
        this.closed = true;
        this.parentObject.__closed(this);
        return this.destroy();
    },

    select: function() {
        if (!this.active && !this.closed) {
            this.active = true;
            this.parentObject.selectWindow(this);
            if (this.highlight) this.highlightTab(constants.hl.none);
            this.tab.addClass("selected");

            this.fireEvent("selected");
        }
        
        return this;
    },

    deselect: function() {
        if (this.active && !this.detached) {
            this.active = false;
            this.tab.removeClasses("selected");
            this.fireEvent("deselected");
        }
        return this;
    },

    updateTopic: function(topic) {
        var $topic = this.window.getElement(".topic").empty();
        if (topic) {
            this.parentObject.theme.formatTopic(topic, $topic);
        } else {
            $topic.html(templates.topicText({topic: lang.noTopic}));
        }
    },

    //holy shit i got this to actually make sense
    // takes nicks (sorted array)
    updateNickList: function(nicklist) {
        if(!this.nicklist) return false;
        var self = this;
        var lnh = self.lastNickHash;

        //get users who left
        //used to just take the difference and then do an each on that but changes to the array made it nec to do it like this for efficency
        var nicks = nicklist.map(function(nickobj, index) {
            var nick = nickobj.nick;
            var old = lnh[nick];

            if(!old || old.prefix !== nickobj.prefix) {
                if(old && old.element) old.element.dispose();//or update it jeez
                lnh[nick] = self.nickListAdd(nickobj, index);
            }
            return nick;
        });

        _.difference(_.keys(lnh), nicks)
         .each(function(nick) {
            lnh[nick].element.dispose();
            delete lnh[nick];
        });
    },

    nickListAdd: function(nickobj, position) {
        var nickele = Element.from(templates.nickbtn(nickobj));

        this.nicklist.insertAt(nickele, position);

        return _.extend({
            element: nickele
        }, nickobj);
    },

    /* A data is an object of the form (see IRCClientAdapter):
    -: current nick
    @: opstatus
    c: channel
    f: origin channel
    h: ip of propogater
    m: msg
    n: nick
    */
    addLine: function(type, data, colourClass) {
        type = type.toUpperCase();
        var self = this,
            parent = self.parentObject;
        var $msg = Element.from(templates.ircMessage({
            type: type.clean().hyphenate().replace(" ", "-").toLowerCase(),
            colourClass: colourClass
        }));

        var highlight =  self.id !== "brouhaha" ? parent.theme.highlightAndNotice(data, type, self, $msg) : constants.hl.none,
            hl_line = false;

        if (!self.active && (highlight !== constants.hl.none)) {
            self.highlightTab(highlight);
        }

        parent.theme.formatMessage($msg, type, data, hl_line);
        self.lines.adopt($msg)
                .maxChildren(self.options.maxLines);//remove lines if totalLines > maxLines

        if(self.getOption("lastpos_line") && type.endsWith("CHANMSG")) {
            self.lastLine = (self.lastLine || Element.from(templates.messageLine())).inject(self.lines);
        }
    },

    highlightTab: function(state) {
        var hl = "", classes = constants.hl;
        if (state != this.highlight) {

            if (state === classes.us)
                hl = "hilight-us";
            else if (state === classes.speech)
                hl = "hilight-speech";
            else if (state === classes.activity)
                hl = "hilight-activity";
            this.tab.removeClasses("hilight-activity", "hilight-us", "hilight-speech")
                    .addClass(hl);
        }
        if (state == constants.hl.none || state >= this.highlight) {
            this.highlight = state;
        }
        return this;
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
