/**
 * Handles hotkeys for a standardUI
 *
 * @depends [util/lang, util/constants, util/utils, util/uihelpers, ui/IWindows]
 * @provides [ui/IKeyboard]
 */
ui.IKeyboard = new Class({
    hotkeys: {
        keyboard: {
            nextWindow: {
                keys: "right",
                description: "",
                handler: function() {
                    this.scope.nextWindow();
                }
            },
            next: {
                keys: "tab",
                description: "",
                handler: function() {
                    this.scope.nextWindow();
                }
            },
            prevWindow: {
                keys: "left",
                description: "",
                handler: function() {
                    this.scope.prevWindow();
                }
            }
        },

        input: {
            bold: {
                keys: "ctrl+b",
                description: "",
                handler: _.partial(util.wrapSelected, ".window:not(.hidden) .input .irc-input", util.getStyleByName("bold").bbcode)
            },
            italic: {
                keys: "ctrl+i",
                description: "",
                handler: _.partial(util.wrapSelected, ".window:not(.hidden) .input .irc-input", util.getStyleByName("italic").bbcode)
            },
            underline: {
                keys: "ctrl+u",
                description: "",
                handler: _.partial(util.wrapSelected, ".window:not(.hidden) .input .irc-input", util.getStyleByName("underline").bbcode)
            },
            colour: {
                keys: "ctrl+c",
                description: "",
                handler: _.partial(util.wrapSelected, ".window:not(.hidden) .input .irc-input", util.getStyleByName("colour").bbcode)
            }
        }
    },

    /* global Keyboard */
    makeKeyboard: function () {
        if(Browser.isMobile) return;
        var self = this,
            keyboard = self.keyboard = new Keyboard({active: true}).addShortcuts(self.hotkeys.keyboard),
            ircKeyboard = self.ircKeyboard = new Keyboard({active: false}).addShortcuts(self.hotkeys.input);
        
        keyboard.scope = self;

        function isChar(code) {//http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
            return code === 32 || (code > 46 && !(code >= 91 && code <= 123) && code !== 144 && code !== 145) ;
        }

        self._keyboardEvents = {
            "blur:relay(input)": function() {
                keyboard.activate();
            },
            "focus:relay(input)": function() {
                ircKeyboard.activate();
            }
        };

        self.element.addEvents(self._keyboardEvents);

        self._keyboardHandler = {
            "keydown": function(e) { // pressing 1 2 3 4 etc will change tab
                if(keyboard.isActive() && e.nodeName !== "INPUT") {
                    if(e.alt && !isNaN(e.key) && e.key <= self.windowArray.length) {
                        self.selectWindow(e.key - 1);
                    } else if(self.active.$input &&
                                !(e.alt||e.meta) && //focus input on a character input or ctrl+[xxx]
                                !(e.ctrl && ["c", "x"].contains(e.key)) && //but allow copying
                                isChar(e.code) ) {
                        self.active.$input.focus();
                    }
                }
            }
        };

        document.addEvents(self._keyboardHandler);
        return self;
    },

    killKeyboard: function() {
        document.removeEvents(this._keyboardHandler);
        this.element.removeEvents(this._keyboardEvents);
        this.keyboard.deactivate().stop();
        this.ircKeyboard.deactivate().stop();
        this.keyboard = this.ircKeyboard = null;
        return this;
    }
});