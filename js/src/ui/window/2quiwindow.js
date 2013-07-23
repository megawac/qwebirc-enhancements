
ui.QUI.Window = new Class({
    Extends: ui.Window,
    Binds: ["close", "attach", "detach", "selectTab", "nickChange", "nickClick", "editTopic", "updatePrefix"],

    initialize: function(parentObject, client, type, name, identifier) {
        var self = this;
        self.parent(parentObject, client, type, name, identifier);


        var qwindow = self.window;
        qwindow.detached = self.detached = false;

        var $tab = self.tab = Element.from(templates.ircTab({
                'name': (name === BROUHAHA) ? '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' : name
            })).inject(parentObject.tabs),
            $tabDetach = $tab.getElement('.detach');

        if(name === BROUHAHA) {
            $tab.addClass('brouhaha');
        }



        // var elchanid = document.getElementById('channel-name-id');

        $tab.addEvents({
                focus: $tab.blur,
                click: self.selectTab,
                dblclick: function(e) {
                    e.stop();

                    if (self.closed)
                        return;

                    parentObject.selectWindow(self);
                }
            })
            .store("window", self);

        $tabDetach.addEvent('click', self.detach);

        if (!isBaseWindow(name)) {
            // var tabclose = new Element("span");
            // tabclose.set("text", "X");
            // tabclose.addClass("tabclose");
            var $tabclose = Element.from(templates.tabClose()),
                close = self.close;
            //close window

            $tabclose.addEvent("click", close);
            $tab.addEvent("mouseup", function(e) {
                    var button = Browser.Engine.trident ? 4 : 1;

                    if (e.event.button === button)
                        close(e);
                })
                .adopt($tabclose);
        }

        var lines = self.lines = qwindow.middle;
            lines.store("window", self);
        // self.parentObject.qjsui.applyClasses("middle", self.lines);
        if (type !== ui.WINDOW_CUSTOM && type !== ui.WINDOW_CONNECT) {
            qwindow.window.addClass('ircwindow');
                // .set('id', 'mainircwindow');
            self.fxscroll = new Fx.AutoScroll(lines, {
            });
            self.highlighter = new Highlighter(lines, { //highlight last 5 messages
                filter: function($ele) {
                    return $ele.hasClass('message') &&
                        !$ele.hasClass('bot') &&
                        !$ele.hasClass('command') &&//msg 2 bot
                        !$ele.hasClass('our');//from us
                },
                selector: '.message:not(.bot):not(.command):not(.our)',
                maxHighlight: NaN
            });

            lines.store("fxscroll", self.fxscroll)
                .store("client", self.client);

        } else {
            qwindow.window.addClass(name.capitalize().replace(" ", "-"));//Connection Details -> Connection-Details
        }

        // lines.addEvent("scroll", function() {
        //     self.scrolleddown = self.scrolledDown();
        //     self.scrollpos = self.getScrollParent().getScroll();
        // });

        if (type === ui.WINDOW_CHANNEL) {
            qwindow.window.addClass('channel');

            qwindow.topic.html(templates.topicBar({topic:false}));
            var topic = self.topic = qwindow.topic;
            topic.addEvent("dblclick", self.editTopic);
            self.updateTopic("");

            var $nicklist = self.nicklist = qwindow.right;
            $nicklist.addClass("nicklist")
                    // .addEvent("click", self.removePrevMenu.bind(self))
                    .addEvent("click:relay(a.user)", self.nickClick)
                    .addEvent("focus:relay(a)", $nicklist.blur);


            var $divider = self.divider = Element.from(templates.verticalDivider())
                                                    .inject($nicklist, "before");
            //cant create splitpane here because elements are still hidden
        }

        var properties = self.properties = Element.from(templates.channelName({channel: name}))
                                                    .inject(qwindow.properties);

        if(util.windowNeedsInput(type))
            qwindow.bottom.appendChild(self.createInput());


        self.nicksColoured = self.parentObject.uiOptions.NICK_COLOURS;
        // self.reflow();
    },

    close: function(e) {
        if(e)
            e.stop();

        if (this.closed)
            return;

        if (isChannelType(this.type) && (!isBaseWindow(this.name)) && !util.wasKicked()) {
            var client = this.client,
                channels = util.removeChannel(client.channels, this.name);

            client.exec("/PART " + this.name);
            client.storeChannels(channels);
        }
        this.parent();

        this.parentObject.tabs.disown(this.tab);

        if(this.detached) {
            this.wrapper.destroy();
        } else {
            this.window.window.destroy();
        }

        // this.tab.dispose();
        // this.reflow();
    },

    attach: function(e) {
        var win = this.window.window,
            wrapper = this.wrapper,
            po = this.parentObject;

        this.window.detached = this.detached = false;

        wrapper.hide();
        win.hide();
        // wrapper.removeChild(win);
        win.replaces(wrapper);
        wrapper.destroy();

        this.drag.detach().stop();
        this.resizable.detach().stop();
        this.wrapper = this.resizable = this.drag = undefined;

        this.tab.show();
        this.select();

        this.fireEvent('attach');
    },

    detach: function(e) {
        var self = this,
            win = self.window.window,
            po = self.parentObject,
            qjsui = po.qjsui,

            wrapper = self.wrapper = Element.from(templates.detachedWindow({
                                                                'channel': this.name,
                                                                'base': util.isBaseWindow(this.name)
                                                            })),
            header = wrapper.getElement('.header'),
            attach = header.getElement('.attach'),
            close = header.getElement('.tab-close'),

            resizeWrapper = Element.from(templates.resizeHandle()),
            resizeHandle = resizeWrapper.getElement('.resize-handle'),

            setActive = function(e) {
                po.windowArray.each(function(win) {
                    if(win.detached)
                        win.wrapper.removeClass('active');
                });
                wrapper.addClass('active');
            };

        attach.addEvent('click', self.attach);
        if(close) {
            close.addEvent('click', self.close);
        }

        //change window if we're active
        if(self.active)
            po.nextWindow(1, self);

        var size = util.percentToPixel({x:40, y:60}, qjsui.parent);
        wrapper.setStyles({
                "width": size.x,
                "height": size.y
            })
            .wraps(win) //*** adds wrapper to dom
            .adopt(resizeWrapper);
        win.show()
            .addEvent("mousedown", Event.stopPropagation);//prevent draggin occurring while clickin window
        setActive();

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

        wrapper.addEvents({
            click: setActive
        });


        self.selectUpdates();

        // util.centerElement(wrapper, qjsui.parent);
        wrapper.position();

        self.detached = self.window.detached = true;

        //keeps order
        self.tab.hide();

        self.fireEvent('detach');
    },

    selectTab: function(e) {
        var self = this;
        if(self.name !== BROUHAHA) {
            self.parentObject.windowArray.each(function(win) {
                if(!win.detached && (!e || e.type !== "click" || win.name !== BROUHAHA)) {//keep brouhaha selected if its from a single click
                    win.tab.swapClass("tab-selected", "tab-unselected");
                }
                if(win.name === BROUHAHA) {
                    if(util.isChannelType(self.type)) {
                        win.properties.text(self.name); //update current channel in brouhaha
                        win.currentChannel = self.name;
                    }
                }
            });
        }
        irc.activeChannel = self.name;
        self.tab.removeClasses("tab-hilight-activity", "tab-hilight-us", "tab-hilight-speech")
                .swapClass("tab-unselected", "tab-selected");
    },

    select: function() {
        this.selectTab();

        //changing windows occurs here
        this.parentObject.setWindow(this.window);

        // this.reflow();
        this.parent();

        this.selectUpdates();
    },

    //styles and ui things to update
    selectUpdates: function() {
        var self = this,
            parentObject = self.parentObject;

        if(self.nicklist && !self.split) {
            // (function() { //wait a sec for the styles to be calculated
            //     self.split = new Drag.SplitPane(self.divider, {
            //         // store: new Storage('__panelwidth')
            //     });
            // }).delay(50);
        }

        if(self.fxscroll) {//scroll to bottom
            self.fxscroll.autoScroll();
        }

        if (util.windowNeedsInput(self.type)) {
            util.fillContainer(self.$inputbox);
            self.$inputbox.focus();
        }

        if(util.isChannelType(self.type)) {
            if (self.nicksColoured !== parentObject.uiOptions.NICK_COLOURS) {
                self.nicksColoured = parentObject.uiOptions.NICK_COLOURS;

                var nodes = self.nicklist.childNodes;
                if (parentObject.uiOptions.NICK_COLOURS) {
                    Array.each(nodes, function(node) {
                        var colour = util.toHSBColour(node.retrieve("nick"), self.client);
                        if ($defined(colour))
                            node.firstChild.setStyle("color", colour.rgbToHex());
                    });
                } else {
                    Array.each(nodes, function(node) {
                        node.firstChild.setStyle("color", null);
                    });
                }
            }

            self.updatePrefix();
        }

    },

    deselect: function() {
        this.parent();

        this.tab.swapClass("tab-selected", "tab-unselected");
    },

    editTopic: function() {
        if (!this.client.nickOnChanHasPrefix(this.client.nickname, this.name, "@")) {
/*      var cmodes = this.client.getChannelModes(channel);
      if(cmodes.indexOf("t")) {*/
            return alert(lang.needOp.message); /*}*/
        }
        var newTopic = prompt(util.formatter(lang.changeTopicConfirm.message, {channel: this.name}), this.topic.topicText);
        if (!$defined(newTopic))
            return;

        this.client.exec("/TOPIC " + newTopic);
    },

    //creates the input box on the bottom
    createInput: function() {
        var self = this,
            parentO = self.parentObject,

            inputtype = Browser.isMobile ?  "mobile-input": "keyboard-input",

            nick = self.client.nickname,

            $form = Element.from(templates.ircInput({'nick': nick, 'status': '', type: inputtype})),
            $nicklabel = self.$nicklabel = $form.getElement('.nickname'),
            $inputbox = self.$inputbox = $form.getElement('.input-field'),
            $inputbtn = $form.getElement('.input-button'),

            sendInput = function(e) {
                if(e)
                    e.stop();
                if ($inputbox.value.trim() !== "") {
                    parentO.resetTabComplete();
                    self.historyExec($inputbox.value);
                    $inputbox.value = "";
                }
                $inputbox.focus();
            }

        if (Browser.isMobile) {
            $inputbtn.addClass("mobile-button");
        } else {
            $inputbox.addEvents({
                blur: function() {
                    window.keyboardInputFocus = 0;
                },
                focus: function() {
                    window.keyboardInputFocus = 1;
                }
            });
        }

        var resettab = parentO.resetTabComplete,
            complete = function(e) {
                var resultfn;
                var cvalue = $inputbox.value;

                if (e.key === "up") {
                    resultfn = self.commandhistory.upLine;
                } else if (e.key === "down") {
                    resultfn = self.commandhistory.downLine;
                } else if (e.key === "tab" && !e.ctrl) {
                    e.stop();
                    self.tabComplete($inputbox);
                    return;
                } else { /* ideally alt and other keys wouldn't break self */
                    parentO.resetTabComplete();
                    return;
                }
                e.stop();

                parentO.resetTabComplete();
                if ((!!cvalue) && (self.lastcvalue !== cvalue))
                    self.commandhistory.addLine(cvalue, true);

                var result = resultfn.call(self.commandhistory);//.bind(self.commandhistory)();

                if (!result)
                    result = "";
                self.lastcvalue = result;

                $inputbox.value = result;
                util.setAtEnd($inputbox);
            };

        if(isChannelType(self.type)) {
            self.client.addEvents({
                "mode": self.updatePrefix
            });
        }

        $nicklabel.addEvent("dblclick", function() {
            var nick = prompt("Enter a new nickname", self.nickname);
            if(nick) {
                self.client.exec("/nick " + nick);
            }
        });

        $inputbtn.addEvent("click", sendInput);
        $form.addEvent("submit", sendInput);
        $inputbox.addEvents({
                    "focus": resettab,
                    "mousedown": resettab,
                    "keydown": complete
                    });
        return $form;
    },

    updatePrefix: function (data) {
        var prefix;
        if(data) {
            if(data.channel === this.name)
                prefix = data.prefix;
            else return;
        } else {
            prefix = this.client.getNickStatus(this.name, this.client.nickname)
        }
        this.$nicklabel.getElement('.status')
                        .removeClasses('op', 'voice')
                        .addClass((prefix === OPSTATUS) ? "op" : (prefix === VOICESTATUS) ? "voice" : "")
        util.fillContainer(this.$inputbox);
    },

    nickClick: function(evt, $tar) { //delegation to nick items
        var hasMenu = $tar.hasClass('selected-middle');

        this.removePrevMenu(); //collapse old menus
        if (!hasMenu) {
            this.moveMenuClass($tar);
            $tar.addClass("selected")
                .store("menu", this.createMenu($tar.retrieve("nick"), $tar));
        }
    },

    // - clicking user in nick list
    createMenu: function(nick, $parent) {
        var pmenu = $parent.retrieve('menu');
        if(pmenu) {
            return pmenu.toggle();
        }

        var $menu = Element.from(templates.menuContainer()),
            self = this;

        (ui.MENU_ITEMS.filter(function(item) {
            var pred = item.predicate;

            return ($type(pred) === 'function') ? pred.call(self, nick) : //pred.apply(this, nickArray)
                                                  !!pred;
        })).each(function(item) {
            Element.from(templates.nickbtn({'nick': "- " + item.text}))
                    .store("action", item.fn)
                    .inject($menu);
        });

        $menu.addEvent('click:relay(.user)', function(e, target) {
                e.stop();
                self.menuClick(target.retrieve("action"));
            })
            .addEvent('focus:relay(a)', Element.prototype.blur)
            .inject($parent);

        return $menu;
    },

    menuClick: function(fn) {
        var selected = this.nicklist.getElement('.selected');
        //i dont understand why these arent equivalent
        fn.call(this, selected.retrieve("nick"));
        this.removePrevMenu();
    },

    moveMenuClass: function($sel) {
        $sel = $($sel) || this.nicklist.getElement('.selected-middle, .selected');
        if (!$sel){}
        else if (this.nicklist.firstChild === $sel) {
            $sel.removeClass("selected-middle");
        } else {
            $sel.addClass("selected-middle");
        }
    },

    removePrevMenu: function() {
        var $sel = this.nicklist.getElements('.selected-middle, .selected');
        if ($sel) {
            $sel.removeClasses("selected", "selected-middle");
            var $menu = $sel.retrieve('menu');
            if ($menu) {
                $menu.dispose();
                $sel.eliminate('menu');
            }
        }
    },

    nickListAdd: function(nick, position) {
        var realNick = util.stripPrefix(this.client.prefixes, nick);

        var nickele = Element.from(templates.nickbtn({'nick': nick}));
        var span = nickele.getElement('span');
        nickele.store("nick", realNick);


        if (this.parentObject.uiOptions.NICK_COLOURS) {
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

    updateTopic: function(topic) {
        var topice = this.topic.empty();

        topice.topicText = topic;
        if (topic) {
            this.parent(topic, topice);
        } else {
            topice.html(templates.topicText({topic:lang.noTopic.message, empty:true}));
        }
        // this.reflow();
    },

    //TODO do all processing in template?
    addLine: function(type, line, colourClass) {
        // var e = new Element("div");
        var eclass = colourClass || (this.lastcolour ? "linestyle1" : "linestyle2");

        var msge = Element.from(templates.ircMessage({styles: eclass, message: line}));
        this.lastcolour = !this.lastcolour;

        this.parent(type, line, colourClass, msge);
        // this.reflow();
    },
    highlightTab: function(state) {
        this.parent(state);

        if (state == this.hilighted)
            return;

        //inefficient as fuck
        this.tab.removeClasses("tab-hilight-activity", "tab-hilight-us", "tab-hilight-speech");

        switch (state) {
        case ui.HILIGHT_US:
            this.tab.addClass("tab-hilight-us");
            break;
        case ui.HILIGHT_SPEECH:
            this.tab.addClass("tab-hilight-speech");
            break;
        case ui.HILIGHT_ACTIVITY:
            this.tab.addClass("tab-hilight-activity");
            break;
        }
    }
});
