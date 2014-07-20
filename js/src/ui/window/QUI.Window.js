/**
 * qui window -should implement base not extend
 *
 * @depends [ui/Window, ui/Detachable]
 * @depends [components/AutoScroll, components/Completer, components/Popups]
 * @depends [config/modes]
 * @provides [ui/QUIWindow]
 */
ui.QUIWindow = new Class({
    Extends: ui.Window,
    Implements: [ui.IDetachableWindow],
    options: {
        events: {
            // "click:relay(.input .send)": "sendInput", (its a submit button no need)
    
            "dblclick:relay(.input .nickname)": "setNickname",
            "dblclick:relay(.topic)": "editTopic",

            "contextmenu:relay(.lines .nick)": "nickLinesMenu",
            "click:relay(.nicklist .user .nick)": "nickListMenu",
            "click:relay(.nick-menu li)": "menuClick",

            "click:relay(.lines .hyperlink-whois)": "whoisURL"
        }
    },

    initialize: function(/*parentObject, $par, client, type, name, identifier*/) {
        // > pass
        this.parent.apply(this, arguments);
    },

    render: function() {
        var self = this;
        var type = self.type;
        var hasInput = util.windowNeedsInput(type);

        var data = _.extend( this.getNickStatus() || {}, {
            mobile: Browser.isMobile,
            isChannel: util.isChannelType(self.type),
            isIRCWindow: hasInput,
            channel: self.name,
            name: self.name,
            id: self.id,//self.name.clean().replace(" ", "-"),
            topic: lang.noTopic,
            needsInput: hasInput,
            nick: self.client && self.client.nickname,
            client: self.client
            // splitPane: false//feature in development having issue with resizes {{link to repo}}*/
        });

        self.element.empty()
            .html(self.template(data));
        var $win = self.window = self.element.getElement(".window").store("window", self);

        var $content = self.content = $win.getElement(".content");
        var lines = self.lines = $content.getElement(".lines");
        lines.store("window", self);

        if (type === ui.WINDOW.channel) {
            $win.addClass("channel");
            self.toggleNickList();
        }

        if(hasInput) {
            self.fxscroll = new components.AutoScroll(lines, {
                start: false
            });
            self.$input = $win.getElement(".input .irc-input");

            $win.getElement("form")
                .addEvent("submit", self.sendInput.bind(self));
        }
        return self;
    },

    close: function(e) {
        if(e) e.stop();
        if (this.closed) return;

        if (this.type === ui.WINDOW.channel) {
            this.client.exec("/PART " + this.name);
        }

        if(this.fxscroll)
            this.fxscroll.stop();
        // if(this.resizable)
        //     this.resizable.detach().stop();
        if(this.drag)
            this.drag.detach().stop();
        if(this.completer)
            this.completer.detach();

        return this.parent();
    },


    select: function() {//change window elements
        if(!this.active && !this.closed) {
            this.parent();
            // defer a moment as its hefty
            this._selectUpdates.delay(1, this);
            this.setActive()
                .fireEvent("selected");
        }
        
        return this;
    },

    deselect: function() {
        if(this.active && !this.detached) {
            if(this.fxscroll) this.fxscroll.stop(); // don't autoscroll in the background tyvm
        }
        return this.parent();
    },

    //styles and ui things to update
    _selectUpdates: function() {
        var self = this;

        if(self.fxscroll) {//scroll to bottom
            self.fxscroll.start();
        }
        if(!self.completer && self.type === ui.WINDOW.channel) {
            self.completer = new components.Completer(self.window.getElement(".input .tt-ahead"), null, {
                autocomplete: self.getOption("completer").intrusive,
                getData: function() {
                    return self.history.get(self.id).concat(_.keys(self.lastNickHash));
                }
            });
            self.completer.$hint.addClass("decorated");
            self.$input.removeClass("decorated");
        }

        if (util.isChannelType(self.type)) {
            self.updatePrefix.delay(1000, self);//takes a little while to recieve on some servers
        }
    },

    __dirtyFixes: function() {
        if(this.completer) this.completer.update(); //ugly but necessary to resize the completer hover box
    },

    editTopic: function() {
        var self = this;
        if (!self.client.nickOnChanHasPrefix(self.client.nickname, self.name, constants.prefixes.op)) {
            new components.Alert({
                text: lang.changeTopicNeedsOp
            });
        } else {
            new components.Dialog({
                title: "Set Topic",
                text: util.format(lang.changeTopicConfirm, {channel: self.name}),
                placeholder: this.window.getElement(".topic").text(),
                onSubmit: function(data) {
                    if (_.isString(data.value)) {
                        self.client.exec("/TOPIC " + self.name + " " + data.value, self.name);
                    }
                }
            });
        }
    },

    setNickname: function(nick) {
        var self = this;
        if(_.isString(nick)) {
            var $nick = self.window.getElement(".input .user .nickname");
            if($nick) {
                $nick.text(nick);
                self.__dirtyFixes();
            }
        } else {
            new components.Dialog({
                title: lang.setNick,
                text: lang.setNickDesc,
                placeholder: self.nickname,
                onSubmit: function(data) {//screw validating
                    self.client.exec("/NICK " + data.value);
                }
            });
        }
    },

    updatePrefix: function (data) {
        if(data && (!data.thisclient || data.channel !== this.id)) return;

        Element.from(templates.status(this.getNickStatus())).replaces(this.window.getElement(".input .status"));
        this.__dirtyFixes();
    },

    getNickStatus: function() {
        if(!this.client) return null;
        var nickchan = this.client.tracker.getNickOnChannel(this.client.nickname, this.id);
        if(!nickchan) return null;
        return _.find(config.modes, function(mode) {
            return nickchan.prefixes.contains(mode.prefix);
        });
    },

    createNickMenu: function(nick, $par, options) {
        var $menu = $par.getElement(".nick-menu"),
            self = this;

        if($menu) {
            $menu.toggle();
        } else {
            var _nick = self.client.nickname,
                _chan = self.name;
            $menu = Element.from(templates.nickMenu(_.extend({
                nick: nick,
                channel: _chan,
                weOped: self.client.nickOnChanHasAtLeastPrefix(_nick, _chan, constants.prefixes.op),
                notus: _nick !== nick,
                theyOped: self.client.nickOnChanHasPrefix(nick, _chan, constants.prefixes.op),
                theyVoiced: self.client.nickOnChanHasPrefix(nick, _chan, constants.prefixes.voice),

                lang: lang
            }, options))).inject($par);
            _.defer(function() { //prevent closing immediately
                document.addEvent("click:once", function() {
                    $menu.dispose();
                    if(options.close) options.close();
                });
            });
        }
        return $menu;
    },

    nickLinesMenu: function(evt, $tar) {
        evt.stop();
        var $menu = this.createNickMenu($tar.get("data-user"), this.window, {showNick: true});
        $menu.addClass("dropdownmenu")
            .setPosition(evt.client);
    },

    nickListMenu: function(evt, $tar) { //delegation to nick items
        var $par = $tar.getParent(".user").toggleClass("selected");
        this.createNickMenu($par.get("data-user"), $par, {close: function() {$par.removeClass("selected")}});
    },

    menuClick: function(e, $tar) {
        var action = $tar.get("data-exec");
        this.client.exec(action, this.name);
    },

    toggleAutocomplete: function(state) {
        if(this.completer) {
            state = !!state;
            this.completer.toggleAutocomplete(state);

            this.completer.$hint.toggleClass("decorated", state);
            this.$input.toggleClass("decorated", !state);
        }
    },

    getNickList: function() {
        if(!this.nicklist && this.getOption("show_nicklist")) {
            this.nicklist = this.window.getElement(".rightpanel")
                                        .addClass("nicklist");
        }
        return this.nicklist;
    },

    toggleNickList: function(state) { //returns this
        if(this.type === ui.WINDOW.channel) {
            state = state != null ? !!state : this.getOption("show_nicklist");
            var nicklist = this.getNickList();
            if(nicklist) {
                nicklist.toggle(state);
                this.window.toggleClass("show-nicklist", state);
                /*util.createGrid([this.lines, nicklist].map(function($e) {
                    return {
                        element: $e,
                        fill: $e.get("data-col-fill") != null,
                        cols: $e.get("data-col")
                    };
                }));*/
            }
        }
    },

    whoisURL: function(e, target) {
        /*if (this.uiOptions.get("query_on_nick_click")) {
            client.exec("/QUERY " + nick);
        } else {*/
        this.client.exec("/WHOIS " + target.get("data-user"));
    }
});
