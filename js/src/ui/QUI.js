
ui.QUI = new Class({
    Extends: ui.StandardUI,
    Binds: ["__createChannelMenu"],
    initialize: function(parentElement, theme, options) {
        this.Window = ui.QUI.Window;
        this.parent(parentElement, theme, "qui", options);

        parentElement.addClasses('qui', 'signed-out')
                    .addEvent("click:relay(.lines .hyperlink-whois)", this.whoisURL);
        this.setHotKeys();
    },
    postInitialize: function() {
        var self = this.parent();
        self.nav.on({
            "selectTab": function(e,tab) {
                self.selectTab(tab);
            },
            "detachWindow": function(e, target) {
                e.stop();
                target.getParent('.tab').retrieve('window').detach();
            },
            "addChannel": self.__createChannelMenu
        });

        return self;
    },

    selectTab: function(tab) {
        var active = this.active;
        var win = tab.retrieve("window");
        var isChannel = util.isChannelType(win.type);
        if(!active || !isChannel || (isChannel && active.name !== BROUHAHA)) {
            win.select();
        }
        if(!util.isBaseWindow(win.name) && isChannel) {//update brouhaha window attrs
            var brouhaha = this.windows.brouhaha;
            brouhaha.currentChannel = win.name;
            brouhaha.window.getElement('.channel-name').text(win.name);
            tab.addClass('selected');
        }
        tab.removeClasses("hilight-activity", "hilight-us", "hilight-speech")
            .getSiblings(".selected:not(.detached,.brouhaha)").removeClass("selected");//remove last selection
    },

    selectWindow: function(win) {
        win = this.parent(win);
        this.selectTab(win.tab);
    },

    newTab: function(win, name) {
        var self = this;
        var isBrouhaha = (name === BROUHAHA);
        var $tab = Element.from(templates.ircTab({
                'name': isBrouhaha ? '&nbsp;' : name,
                closable: !isBaseWindow(name)
            }));
        this.nav.addTab($tab);

        if(isBrouhaha) {
            $tab.addClass('brouhaha');
            _.delay(function() {
                _.some(self.windowArray, function(otherwin) {
                    if(util.isChannelType(otherwin.type) && !util.isBaseWindow(otherwin.name)) {
                        win.properties.text(otherwin.name); //update current channel in brouhaha
                        win.currentChannel = otherwin.name;
                        return true;
                    }
                });
            }, 1000);
        }

        $tab.store("window", win);

        return $tab;
    },

    hotkeys: {
        keyboard: {
            nextWindow: {
                keys: 'right',
                description: '',
                handler: function() {
                    this.scope.nextWindow();
                }
            },
            next: {
                keys: 'tab',
                description: '',
                handler: function() {
                    this.scope.nextWindow();
                }
            },
            prevWindow: {
                keys: 'left',
                description: '',
                handler: function() {
                    this.scope.prevWindow();
                }
            }
        },

        input: {
            bold: {
                keys: 'ctrl+b',
                description: '',
                handler: _.partial(util.wrapSelected, '.window:not(.hidden) .input .irc-input', util.getStyleByName('bold').bbcode)
            },
            italic: {
                keys: 'ctrl+i',
                description: '',
                handler: _.partial(util.wrapSelected, '.window:not(.hidden) .input .irc-input', util.getStyleByName('italic').bbcode)
            },
            underline: {
                keys: 'ctrl+u',
                description: '',
                handler: _.partial(util.wrapSelected, '.window:not(.hidden) .input .irc-input', util.getStyleByName('underline').bbcode)
            },
            colour: {
                keys: 'ctrl+c',
                description: '',
                handler: _.partial(util.wrapSelected, '.window:not(.hidden) .input .irc-input', util.getStyleByName('colour').bbcode)
            },
            submitInput: {
                keys: 'enter',
                description: '',
                handler: function(e) {
                    var $tar = e.target;
                    if($tar.hasClass('irc-input'))  {
                        $tar.getParent('.window').retrieve('window').sendInput(e, $tar);
                    }
                }
            }
        }
    },

    setHotKeys: function () {
        if(Browser.isMobile) return;
        var self = this,
            keyboard = this.keyboard = new Keyboard({active: true}).addShortcuts(self.hotkeys.keyboard),
            inputKeyboard = new Keyboard({active: false}).addShortcuts(self.hotkeys.input);
            keyboard.scope = self;

        function isChar(code) {//http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
            return code === 32 || (code > 46 && !(code >= 91 && code <= 123) && code !== 144 && code !== 145) ;
        }

        document.addEvents({
            "blur:relay(input)": function() {
                keyboard.activate();
            },
            "focus:relay(input)": function() {
                inputKeyboard.activate();
            },
            "keydown": function(e) { // pressing 1 2 3 4 etc will change tab
                if(keyboard.isActive()) {
                    if(e.alt && !isNaN(e.key) && e.key <= self.windowArray.length) {
                        self.selectWindow(e.key - 1);
                    } else if(self.active.$input && !(e.alt||e.control||e.meta) && isChar(e.code) ) {
                        self.active.$input.focus();
                    }
                }
            }
        });
    },

    //todo use other dropdown menu code
    __createChannelMenu: function(e) {
        if(e) e.stop();
        var self = this,
            client = self.getActiveIRCWindow().client,

            $btn = self.outerTabs.getElement('.add-chan'),
            $oldmen = self.parentElement.getElement('.chanmenu.dropdownmenu');
        $oldmen = $oldmen && $oldmen.getParent();

        if(!$oldmen || Date.now() - $btn.retrieve('time') > 60000) {//getting pop channels is expensive dontif unnecc
            client.getPopularChannels(function(chans) {
                chans = _.chain(chans).take(self.options.maxChansMenu || 10)
                            .map(function(chan) {
                                return {
                                    text: chan.channel,
                                    value: chan.channel,
                                    hint: chan.users
                                };
                            })
                            .value();
                var $menu = Element.from(templates.chanmenu({
                        channels: chans
                    }));

                var wrapper = new Element('div').inject(self.parentElement)
                                                .adopt($menu);
                ui.decorateDropdown($btn, wrapper);
                wrapper.addEvent("click:relay(a)", function(e, target) {
                    var chan = target.get('data-value');
                    client.exec("/JOIN " + chan);
                });
                $btn.store('time', Date.now());//so we dont have to refresh maybe
            });
        } else if (!$oldmen.isDisplayed()) { //show old menu
            $oldmen.retrieve("toggle")();
            $oldmen.position({
                    relativeTo: $btn,
                    position: {x: 'left', y: 'bottom'},
                    edge: {x: 'left', y: 'top'}
                });
        }
    },

    newClient: function(client) {
        this.parentElement.swapClass('signed-out','signed-in');
        var status = this.parent(client);
        //load brouhaha window (b4 connecting)
        this.windows.brouhaha = this.newWindow(client, ui.WINDOW.channel, BROUHAHA);
        return status;
    },

    setWindow: function(win) {
        this.parent(win);
        win.element.show().addClass('active')
                    .getSiblings('.active:not(.detached)')
                    .hide().removeClass('active');
    },

    nickChange: function(data, client) {
        if(data.thisclient) {
            _.each(this.getWindows(client), function(win) {
                win.setNickname(data.newnick);
            });
        }
    }
});
