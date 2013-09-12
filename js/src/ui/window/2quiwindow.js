
//mae view and qui and controller
ui.QUI.Window = new Class({
    Extends: ui.Window,
    Binds: ['close'],
    options: {
        events: {
            'click:relay(.input .send)': 'sendInput',
            'dblclick:relay(.input .nickname)': 'setNickname',
            'dblclick:relay(.topic)': 'editTopic',

            'click:relay(.nicklist .user .nick)': 'nickClick',
            'click:relay(.nicklist .menu span)': 'menuClick',

            'click:relay(.detached-window .attach)': 'attach',
            'click:relay(.detached-window .close)': 'close',
            'click:relay(.detached-window)': 'setActive'
        }
    },

    events: {
        client: {}
    },

    detached: false,

    initialize: function(parentObject, $par, client, type, name, identifier) {
        var self = this;
        self.parent.apply(self, arguments);

        self.tab = parentObject.newTab(self, name);

        self.nicksColoured = self.parentObject.uiOptions2.get("nick_colours");
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
                nick: self.client ? self.client.nickname : ""
            }))
        var $win = self.window = self.element.getElement('.window').store("window", self);

        var $content = self.content = $win.getElement('.content');
        var lines = self.lines = $content.getElement('.lines');
        lines.store("window", self);

        if (type !== ui.WINDOW.custom && type !== ui.WINDOW.connect) {
            $win.addClass('ircwindow');
            self.fxscroll = new Fx.AutoScroll(lines);
        }

        if (type === ui.WINDOW.channel) {
            $win.addClass('channel');
            self.toggleNickList();
            self.updateTopic("");
        }

        if(hasInput) {
            self.$input = $win.getElement('.input .input-field');
        }
        return self;
    },

    close: function(e) {
        if(e) e.stop();
        if (this.closed) return;

        if (isChannelType(this.type) && (!util.isBaseWindow(this.name))) {
            var client = this.client,
                channels = util.removeChannel(client.channels, this.name);

            client.exec("/PART " + this.name);
            client.storeChannels(channels);
        }
        if(this.client instanceof irc.IRCClient) 
            this.client.removeEvents(this.events.client);

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
        var win = this.window,
            wrapper = this.wrapper,
            po = this.parentObject;

        this.detached = false;
        this.element.removeClass('detached');

        win.replaces(wrapper);
        wrapper.destroy();

        this.drag.detach().stop();
        this.resizable.detach().stop();
        this.wrapper = this.resizable = this.drag = null;

        this.tab.show()
                .removeClass("detached");
        this.select();

        this.fireEvent('attached');
    },

    detach: function(e) {
        var self = this,
            win = self.window,
            po = self.parentObject,

            wrapper = self.wrapper = Element.from(templates.detachedWindow({
                                                    'channel': this.name,
                                                    'base': util.isBaseWindow(this.name)
                                                })),
            header = wrapper.getElement('.header'),

            // resizeWrapper = Element.from(templates.resizeHandle()),
            // resizeHandle = resizeWrapper.getElement('.resize-handle');
            resizeHandle = wrapper.getElement('.resize-handle');
        self.element.addClass('detached');


        //change window if we're active
        if(self.active)
            po.nextWindow(1, self);

        var size = util.percentToPixel({x:40, y:60}, win.getParent('qwebirc'));
        wrapper.setStyles({
                "width": size.x,
                "height": size.y
            })
            .replaces(win); //*** adds wrapper to dom;
        win.show()
            .addEvent("mousedown", function(e) {
                var tag = e.target.tagName.toLowerCase();
                if(!(tag == "div" || tag == "form"))//prevent dragging if not on container
                    e.stopPropagation();
            })
            .replaces(wrapper.getElement('.content'));
        self.setActive();

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


        self._selectUpdates();

        wrapper.position();

        self.detached = true;
        self.active = false;

        //keeps order
        self.tab.hide()
                .addClass("detached");

        self.fireEvent('detached');
    },

    setActive: function(e) {
        if(this.detached) {
            this.element.addClass('active')
                        .getSiblings('.detached').removeClass('active');
        } else {
            this.select();
        }
    },

    select: function() {//change window elements
        if(this.active || this.closed) return;
        this.parent();

        this.tab.addClass("selected");
        this._selectUpdates();
        this.fireEvent("selected");
    },

    //styles and ui things to update
    _selectUpdates: function() {
        var self = this,
            parentObject = self.parentObject;

        if(self.nicklist && !self.split) {
            _.delay(function() { //wait a sec for the styles to be calculated
                self.split = new Drag.SplitPane(self.window.getElement('.content .handle'), {
                    limits: {
                        min: 0,
                        max: 0
                    }
                });
            }, 50);
        }

        if(self.fxscroll) {//scroll to bottom
            self.fxscroll.autoScroll();
        }
        if(!self.completer && util.windowNeedsInput(self.type)) {
            self.completer = new Completer(self.window.getElement('.input .tt-ahead'), self.history.get(self.name));
        }

        if(util.isChannelType(self.type)) {
            var colour = parentObject.uiOptions2.get("nick_colours");
            if (self.nicksColoured !== colour) {
                self.nicksColoured = colour;
                var nodes = self.nicklist.childNodes;
                if (colour) {
                    _.each(nodes, function(node) {
                        var colour = util.toHSBColour(node.retrieve("nick"), self.client);
                        if ($defined(colour))
                            node.firstChild.setStyle("color", colour.rgbToHex());
                    });
                } else {
                    _.each(nodes, function(node) {
                        node.firstChild.setStyle("color", null);
                    });
                }
            }

            _.delay(self.updatePrefix, 200, self);
        }

    },

    deselect: function() {
        this.tab.removeClass("selected");
        this.parent();
    },

    editTopic: function() {
        var self = this;
        if (!self.client.nickOnChanHasPrefix(self.client.nickname, self.name, "@")) {
            new ui.Alert({
                text: lang.needOp.message
            });
        } else {
            new ui.Dialog({
                title: "Set Topic",
                text: util.format(lang.changeTopicConfirm.message, {channel: self.name}),
                value: self.topic,
                onSubmit: function(data) {
                    var topic = data.value;
                    if (_.isString(topic)) {
                        self.client.exec("/TOPIC " + topic);
                    }
                }
            });
        }
    },

    setNickname: function() {
        var self = this;
        new ui.Dialog({
            title: "Set nickname",
            text: "Enter a new nickname",
            value: self.nickname,
            onSubmit: function(data) {
                var nick = qwebirc.global.nicknameValidator.validate(data.value);
                if(nick) {
                    self.client.exec("/nick " + nick);
                }
            }
        });
    },

    updatePrefix: function (data) {
        if(data && (!data.thisclient || data.channel !== this.name)) return;
        var prefix = data ? data.prefix : this.client.getNickStatus(this.name, this.client.nickname);
        this.window.getElement('.input .nickname .status')
                        .removeClasses('op', 'voice')
                        .addClass((prefix === OPSTATUS) ? "op" : (prefix === VOICESTATUS) ? "voice" : "");
        if(this.completer) this.completer.update(); //ugly but necessary to resize the completer hover box
    },

    nickClick: function(evt, $tar) { //delegation to nick items
        var $par = $tar.getParent('.user').toggleClass("selected");
        var $menu = $par.getElement('.menu'),
            self = this;

        this.removePrevMenu($par);

        if($menu) {
            $menu.toggle();
        } else {
            $menu = Element.from(templates.nickMenu()).inject($par);
            _.each(ui.MENU_ITEMS, function(item) {
                if(_.isFunction(item.predicate) ? item.predicate.call(self, $par.retrieve('nick')) : !!item.predicate) {
                    Element.from(templates.nickmenubtn(item))
                            .store("action", item.fn)//could also just do _.find to get the action but still need to store the name somewhere
                            .inject($menu);
                }
            });
        }
    },

    menuClick: function(e, target) {
        e.stop();
        var fn = target.retrieve("action");
        var selected = target.getParent('.user');
        fn.call(this, selected.retrieve("nick"));
        this.removePrevMenu();
    },

    removePrevMenu: function($tar) {
        var $sel = $tar ? $tar.getSiblings('.selected') : this.nicklist.getElements('.selected');
        $sel.removeClass("selected")
            .getElement('.menu').each(Element.dispose);
    },

    updateTopic: function(topic) {
        var $topic = this.window.getElement('.topic').empty();
        this.topic = topic;
        if (topic) {
            var $top = Element.from(templates.topicText({empty:false})).inject($topic);
            this.parentObject.theme.formatElement(topic, $top.getElement('span'));
        } else {
            $topic.html(templates.topicText({topic:lang.noTopic.message, empty:true}));
        }
    },

    addLine: function(type, data, colourClass) {
        var $msg = Element.from(templates.ircMessage({ type: type.hyphenate() }));

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

    getNickList: function() {
        if(!this.nicklist && this.parentObject.uiOptions.get('show_nicklist')) {
            this.nicklist = this.window.getElement('.rightpanel')
                                    .addClass("nicklist");
        }
        return this.nicklist;
    },

    toggleNickList: function(state) { //returns this
        if(this.type === ui.WINDOW.channel) {
            state = state != null ? !!state : this.parentObject.uiOptions.get('show_nicklist');
            var nicklist = this.getNickList();
            nicklist && nicklist.toggle(state) && this.window.toggleClass('show-nicklist', state);
        }
    },

    //holy shit i got this to actually make sense
    // takes nicks (sorted array)
    updateNickList: function(nicks) {
        var self = this;
        if(!self.nicklist) return false;
        var lnh = self.lastNickHash,
            oldnames = _.keys(lnh),

            added = _.difference(nicks, oldnames),//users who joined
            left = _.difference(oldnames, nicks); //users who left

        _.each(left, function(nick) {
            var element = lnh[nick];
            self.nickListRemove(nick, element);
            delete lnh[nick];
        });

        _.each(added, function(nick) {
            var index = nicks.indexOf(nick); //indx in sorted array
            lnh[nick] = self.nickListAdd(nick, index) || 1;
        });
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
    }
});
