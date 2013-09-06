
ui.QUI = new Class({
    Extends: ui.StandardUI,
    Binds: ["__createChannelMenu"],
    initialize: function(parentElement, theme, options) {
        this.Window = ui.QUI.Window;
        this.parent(parentElement, theme, "qui", options);

        parentElement.addClasses('qui', 'signed-out');
        this.setHotKeys();

        this.parentElement.addEvents({
           "click:relay(.lines .hyperlink-whois)": this.whoisURL,
            "click:relay(.lines .hyperlink-channel)": this.chanURL
        });
    },
    postInitialize: function() {
        var self = this.parent();

        // var tabs = self.tabs = Element.from(templates.tabbar()),
        //     joinChan =  function(){
        //         new ui.Dialog({
        //             element: self.element,
        //             text: "Enter channel name",
        //             onSubmit: function(data) {
        //                 if(data.val && data.val.trim() !== ""){
        //                     _.each(self.clients, function(client) {
        //                         client.exec("/JOIN " + data.val);
        //                     });
        //                 }
        //             }
        //         });
        //     },
        //     tabbtns = Element.from(templates.tabbarbtns()),
        //     addTab = tabbtns.getElement('.add-chan'),
        //     scrollers = tabbtns.getElements('[name="tabscroll"]'),
        //     scroller = new Fx.Scroll(tabs),
        //     resizeTabs = _.partial(util.fillContainer, tabs, {style: 'max-width'}),
        //     tabsResize = function() {
        //         var wid = tabs.getWidth(),
        //             swid = tabs.getScrollWidth();

        //         if(swid > wid) {
        //             scrollers.show();
        //         }
        //         else {
        //             scrollers.hide();
        //         }

        //         resizeTabs();
        //     };

        // window.addEvent('resize', tabsResize);
        // tabs.addEvents({
        //     'adopt': tabsResize,
        //     'disown': tabsResize
        // });

        // scrollers.filter('.to-left')
        //     .addEvent('click', function(e) {
        //         e.stop();
        //         var pos = tabs.getScrollLeft(),
        //             $ele = util.elementAtScrollPos(tabs, pos);

        //         scroller.toElement($ele, 'x');
        //     });
        // scrollers.filter('.to-right')
        //     .addEvent('click', function(e) {
        //         e.stop();
        //         var pos = tabs.getScrollLeft() + tabs.getWidth(),
        //             $ele = util.elementAtScrollPos(tabs, pos);

        //         scroller.toElementEdge($ele, 'x');
        //         console.log($ele);
        //     });

        // resizeTabs();
        // addTab.addEvents({
        //     'dblclick': joinChan,
        //     'click': self.__createChannelMenu
        // });

        // //for scrolling tabs with mousewhee
        // tabs.addEvent("mousewheel", function(evt) {
        //     evt.stop();
        //     if (evt.wheel > 0) {//mwup
        //         self.nextWindow();
        //     } else if (evt.wheel < 0) {
        //         self.prevWindow();
        //     }
        // });


        // //append menu and tabbar
        // self.outerTabs.adopt(self.__createDropdownMenu(), tabs, tabbtns)
        //     .addEvents({
        //         "click:relay(.tab .tab-close)": function(e, target) {
        //             e.stop();
        //             target.getParent('.tab').retrieve('window').close();
        //         },
        //         "click:relay(.tab .detach)": function(e, target) {
        //             e.stop();
        //             target.getParent('.tab').retrieve('window').detach();
        //         },
        //         "focus:relay(.tab)": Element.prototype.blur,
        //         "click:relay(.tab)": function(e, target) {//can be called when tab is closed
        //             self.selectTab(target);
        //         },
        //         "dblclick:relay(.tab)": function(e, target) {
        //             e.stop();
        //             target.retrieve('window').select();
        //         }
        //     });
        self.nav.on({
            "selectTab": function(e,tab) {
                self.selectTab(tab);
            },
            "detachWindow": function(e, target) {
                e.stop();
                target.getParent('.tab').retrieve('window').detach();
            },
            // promptChan: function(){
            //     new ui.Dialog({
            //         element: self.element,
            //         text: "Enter channel name",
            //         onSubmit: function(data) {
            //             if(data.val && data.val.trim() !== ""){
            //                 _.each(self.clients, function(client) {
            //                     client.exec("/JOIN " + data.val);
            //                 });
            //             }
            //         }
            //     });
            // },
            "addChan": self.__createChannelMenu
        });

        //delay for style recalc
        // self.__createDropdownHint.delay(500, self);

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

    // __createDropdownMenu: function() {
    //     var self = this,
    //         dropdownMenu = Element.from(templates.mainmenu({
    //                 menu: self.UICommands,
    //                 menuclass: "main-menu"
    //             })).inject(self.parentElement);

    //     dropdownMenu.addEvents({
    //         "click:relay(.main-menu a)": function(e, target) {//dont stop event so the menu closes automatically
    //             var method = target.get("data-value");
    //             self[method]();
    //         }
    //     });
    //     var dropdownbtn = Element.from(templates.menubtn({icon: self.options.icons.menuicon}));


    //     var dropdownEffect = new Fx.Tween(dropdownbtn, {
    //         duration: "long",
    //         property: "opacity",
    //         link: "chain"
    //     });
    //     var dropdownhint = Element.from(templates.dropdownhint())
    //                 .inject(this.parentElement)
    //                 .position({
    //                     relativeTo: this.outerTabs,
    //                     position: {'y': 'bottom'},
    //                     offset: {y:10}
    //                 });

    //     dropdownEffect.start(0.25)
    //                 .start(1)
    //                 .start(0.33)
    //                 .start(1);

    //     ui.decorateDropdown(dropdownbtn, dropdownMenu, {
    //         onShow: function() {
    //             if(self.hideHint)
    //                 self.hideHint();
    //             delete self.hideHint;
    //         },
    //         btnlistener: true,
    //         autohide: true
    //     });

    //     new Fx.Morph(dropdownhint, {
    //         duration: "normal",
    //         transition: Fx.Transitions.Sine.easeOut
    //     }).start({
    //         left: [900, 5]
    //     });

    //     var hider = function() {
    //             new Fx.Morph(dropdownhint, {
    //                 duration: "long"
    //             }).start({
    //                 left: [5, -900]
    //             });
    //         }.delay(4000);

    //     var hider2 = this.hideHint = _.once(_.partial(Element.destroy, dropdownhint));

    //     _.delay(hider2, 4000);

    //     document.addEvents({
    //         "mousedown:once": hider2,
    //         "keydown:once": hider2
    //     });
    //     return dropdownbtn;
    //     // return dropdownMenu;
    // },

    hotkeys: {
        keyboard: {
            nextWindow: {
                keys: 'right',
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
                handler: _.partial(util.wrapSelected, '.window:not(.hidden) .input .input-field', util.getStyleByName('bold').bbcode)
            },
            italic: {
                keys: 'ctrl+i',
                description: '',
                handler: _.partial(util.wrapSelected, '.window:not(.hidden) .input .input-field', util.getStyleByName('italic').bbcode)
            },
            underline: {
                keys: 'ctrl+u',
                description: '',
                handler: _.partial(util.wrapSelected, '.window:not(.hidden) .input .input-field', util.getStyleByName('underline').bbcode)
            },
            colour: {
                keys: 'ctrl+c',
                description: '',
                handler: _.partial(util.wrapSelected, '.window:not(.hidden) .input .input-field', util.getStyleByName('colour').bbcode)
            },
            submitInput: {
                keys: 'enter',
                description: '',
                handler: function(e) {
                    var $tar = e.target;
                    if($tar.hasClass('input-field'))  {
                        $tar.getParent('.window').retrieve('window').sendInput(e, $tar);
                    }
                }
            }
        }
    },

    setHotKeys: function () {
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

    //the effect on page load
    // __createDropdownHint: function() {
    //     var dropdownhint = Element.from(templates.dropdownhint())
    //                 .inject(this.parentElement)
    //                 .position({
    //                     relativeTo: this.outerTabs,
    //                     position: {'y': 'bottom'},
    //                     offset: {y:10}
    //                 });

    //     new Fx.Morph(dropdownhint, {
    //         duration: "normal",
    //         transition: Fx.Transitions.Sine.easeOut
    //     }).start({
    //         left: [900, 5]
    //     });

    //     var hider = function() {
    //             new Fx.Morph(dropdownhint, {
    //                 duration: "long"
    //             }).start({
    //                 left: [5, -900]
    //             });
    //         }.delay(4000);

    //     var hider2 = this.hideHint = _.once(_.partial(Element.destroy, dropdownhint));

    //     _.delay(hider2, 4000);

    //     document.addEvents({
    //         "mousedown:once": hider2,
    //         "keydown:once": hider2
    //     });
    // },

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
        win.element.getSiblings('.active:not(.detached)').hide().removeClass('active');
        win.element.show().addClass('active');
    },

    //called in context of irc client
    nickChange: function(data) {
        if(data.thisclient) {
            _.each(this.windows, function(win) {
                win.$nicklabel.set("text", data.newnick);
            });
        }
    }
});
