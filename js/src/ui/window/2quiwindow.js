//mae view and qui and controller
ui.QUI.Window = new Class({
    Extends: ui.Window,
    Binds: ["close"],
    options: {
        events: {
            // "click:relay(.input .send)": "sendInput",
            "dblclick:relay(.input .nickname)": "setNickname",
            "dblclick:relay(.topic)": "editTopic",

            "contextmenu:relay(.lines .nick)": "nickLinesMenu",
            "click:relay(.nick-menu li)": "menuClick",

            "click:relay(.nicklist .user .nick)": "nickListMenu",

            "click:relay(.detached-window .attach)": "attach",
            "click:relay(.detached-window .tab-close)": "close",

            "click": "setActive"
        }
    },

    detached: false,

    initialize: function(parentObject, $par, client, type, name, identifier) {
        var self = this;
        self.parent.apply(self, arguments);

        self.tab = parentObject.newTab(self, name);

        self.nicksColoured = self.getOption("nick_colours");
    },

    render: function() {
        var self = this;
        var type = self.type;
        var hasInput = util.windowNeedsInput(type);
        self.element.empty()
            .html(self.template({
                mobile: Browser.isMobile,
                isChannel: util.isChannelType(self.type),
                channel: self.name,
                name: self.name,
                id: self.name.clean().replace(" ", "-"),
                topic: false,
                needsInput: hasInput,
                nick: self.client ? self.client.nickname : "/*",
                splitPane: false//feature in development having issue with resizes {{link to repo}}*/
            }));
        var $win = self.window = self.element.getElement(".window").store("window", self);

        var $content = self.content = $win.getElement(".content");
        var lines = self.lines = $content.getElement(".lines");
        lines.store("window", self);

        if (type === ui.WINDOW.channel) {
            $win.addClass("channel");
            self.toggleNickList();
            self.updateTopic("");
        }

        if(hasInput) {
            $win.addClass("ircwindow");
            self.fxscroll = new Fx.AutoScroll(lines, {
                start: false
            });
            self.$input = $win.getElement(".input .irc-input");

            $win.getElement("form")
                .addEvent("submit", self.sendInput);
        }
        return self;
    },

    close: function(e) {
        if(e) e.stop();
        if (this.closed) return;

        if (util.isChannelType(this.type) && !util.isBaseWindow(this.name)) {
            this.client.exec("/PART " + this.name);
        }

        if(this.fxscroll)
            this.fxscroll.stop();
        if(this.resizable)
            this.resizable.detach().stop();
        if(this.drag)
            this.drag.detach().stop();
        if(this.completer)
            this.completer.detach();

        return this.parent();
    },

    attach: function(e) {
        this.detached = false;

        util.resetGrid(this.element).removeClass("detached");

        this.window.replaces(this.wrapper);
        this.wrapper.destroy();

        this.drag.detach().stop();
        this.resizable.detach().stop();
        this.wrapper = this.resizable = this.drag = null;

        this.parentObject.nav.toggleTab(this.tab.removeClass("detached"), true);
        this.select();

        this.fireEvent("attached");
    },

    detach: function(e) {
        var self = this,
            win = self.window,
            po = self.parentObject,

            wrapper = self.wrapper = Element.from(templates.detachedWindow({
                "channel": self.name,
                "base": util.isBaseWindow(self.name)
            })),
            //header = wrapper.getElement(".header"),

            // resizeWrapper = Element.from(templates.resizeHandle()),
            // resizeHandle = resizeWrapper.getElement(".resize-handle");
            resizeHandle = wrapper.getElement(".resize-handle");

        var size = util.percentToPixel({x:40, y:60}, win.getParent(".qwebirc"));
        
        //as to not mess with other window remove grid
        util.removeGrid(self.element).addClass("detached").show();
        
        //set size and add detach wrapper to dom
        wrapper.setStyles({
            "width": size.x,
            "height": size.y
        }).replaces(win);

        win.addEvent("mousedown", function(e) {
            var tag = e.target.tagName.toLowerCase();
            if(!(tag == "div" || tag == "form"))//prevent dragging if not on container
                e.stopPropagation();
        }).inject(wrapper.getElement(".body"));

        self.resizable = wrapper.makeResizable({
            limit: {//min/max
                x: [400, null],
                y: [200, null]
            },
            handle: resizeHandle,
            stopPropagation: true
        });
        self.drag = wrapper.makeDraggable({
            handle: wrapper,
            includeMargins: true
        });

        /*** update windows and center detached window ****/
        if(self.active) po.nextWindow();//change window if we"re active
        self.detached = true;
        _.defer(function() {
            self.setActive();
            self._selectUpdates();
            wrapper.position();
        });

        //keeps order
        po.nav.toggleTab(self.tab.addClass("detached"), false);
        self.fireEvent("detached");
    },

    setActive: _.throttle(function(e) {//sets this window as the most active
        // if(!this.element.hasClass("active")) {
        this.element.addClass("active")
                    .getSiblings(".active").removeClass("active");
        // }
    }, 1000, true),

    select: function() {//change window elements
        if(this.active || this.closed) return;
        this.parent();

        this.tab.addClass("selected");
        this._selectUpdates();
        this.setActive();
        this.fireEvent("selected");
    },

    deselect: function() {
        if(this.active && !this.detached) {
            this.tab.removeClasses("selected");
            if(this.fxscroll) this.fxscroll.stop();//save some work as reasonably intense
            this.parent();
        }
    },

    //styles and ui things to update
    _selectUpdates: function() {
        var self = this;

        if(self.fxscroll) {//scroll to bottom
            self.fxscroll.start();
        }
        if(!self.completer && self.type === ui.WINDOW.channel) {
            self.completer = new Completer(self.window.getElement(".input .tt-ahead"), self.history.get(self.name), {
                autocomplete: self.getOption("completer").intrusive
            });
            self.completer.$hint.addClass("decorated");
            self.$input.removeClass("decorated");
        }

        if(util.isChannelType(self.type)) {
            var colour = self.getOption("nick_colours");
            if (self.nicksColoured !== colour) {
                self.nicksColoured = colour;
                var nodes = self.nicklist.childNodes;
                if (colour) {
                    _.each(nodes, function(node) {
                        var colour = util.toHSBColour(node.get("data-nick"), self.client);
                        if (colour != null) {
                            node.firstChild.setStyle("color", colour.rgbToHex());
                        }
                    });
                } else {
                    _.each(nodes, function(node) {
                        node.firstChild.setStyle("color", null);
                    });
                }
            }
            _.delay(self.updatePrefix, 1000, self);//takes a little while to recieve on some servers
        }

    },

    __dirtyFixes: function() {
        if(this.completer) this.completer.update(); //ugly but necessary to resize the completer hover box
    },

    editTopic: function() {
        var self = this;
        if (!self.client.nickOnChanHasPrefix(self.client.nickname, self.name, constants.prefixes.op)) {
            new ui.Alert({
                text: lang.changeTopicNeedsOp
            });
        } else {
            new ui.Dialog({
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
            new ui.Dialog({
                title: "Set nickname",
                text: "Enter a new nickname",
                placeholder: self.nickname,
                onSubmit: function(data) {//screw validating
                    self.client.exec("/NICK " + data.value);
                }
            });
        }
    },

    updatePrefix: function (data) {
        if(data && (!data.thisclient || data.channel !== this.name)) return;
        var prefix = data ? data.prefix : this.client.getNickStatus(this.name, this.client.nickname);
        this.window.getElements(".input .user .status")
                    .removeClasses("op", "voice")
                    .addClass((prefix === constants.prefixes.op) ? "op" : (prefix === constants.prefixes.voice) ? "voice" : "");
        this.__dirtyFixes();
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

    updateTopic: function(topic) {
        var $topic = this.window.getElement(".topic").empty();
        if (topic) {
            this.parentObject.theme.formatTopic(topic, $topic);
        } else {
            $topic.html(templates.topicText({topic: lang.noTopic, empty:true}));
        }
    },

    addLine: function(type, data, colourClass) {
        var $msg = Element.from(templates.ircMessage({ type: type.hyphenate().replace(" ", "-") }));

        if(colourClass)
            $msg.addClass(colourClass);
        if(data.colourClass)
            $msg.addClass(data.colourClass);

        this.parent(type.toUpperCase(), data, colourClass, $msg);
    },

    highlightTab: function(state) {
        if (state != this.highlight) {
            this.tab.removeClasses("hilight-activity", "hilight-us", "hilight-speech");

            switch (state) {
            case ui.HIGHLIGHT.us:
                this.tab.addClass("hilight-us");
                break;
            case ui.HIGHLIGHT.speech:
                this.tab.addClass("hilight-speech");
                break;
            case ui.HIGHLIGHT.activity:
                this.tab.addClass("hilight-activity");
                break;
            }
            this.parent(state);
        }
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

        _.difference(_.keys(lnh), nicks).each(function(nick) {
            lnh[nick].element.dispose();
            delete lnh[nick];
        });
    },

    nickListAdd: function(nickobj, position) {
        var nickele = Element.from(templates.nickbtn(nickobj));
        var span = nickele.getElement("span");

        if (this.getOption("nick_colours")) {
            var colour = util.toHSBColour(nickobj.nick, this.client);
            if (colour != null) {
                span.setStyle("color", colour.rgbToHex());
            }
        }

        this.nicklist.insertAt(nickele, position);

        return _.extend({
            element: nickele
        }, nickobj);
    },

    setProperties: function(name) {
        this.window.getElement(".channel-name").text(name);
        return this;
    }
});
