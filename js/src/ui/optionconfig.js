
// /*
//     TODO: Options:
//     - templating get rid of tables
//     - beep/flash/highligh on text infinite regexp list
//     - custom sounds?

// */


// /**
//  * Note that options are settable by the uioptions url arg by default unless you specifiy
//  * settableByURL...
//  */
// config.DEFAULT_OPTIONS = [
//     //option is a structure:
//     // 0: id
//     // 1: alias
//     // 2: description of option
//     // 3: default val
//     // 4: setter
//     [1, "BEEP_ON_MENTION", "Beep when nick mentioned or on query activity (requires Flash or html5)", true,
//     {
//         enabled: $lambda([true]),
//         applyChanges: function(value, ui) {
//             if ($defined(ui.setBeepOnMention))
//                 ui.setBeepOnMention(value);
//         }
//     }],
//     [7, "FLASH_ON_MENTION", "Flash titlebar when nick mentioned or on query activity", true,
//     {
//         enabled: ui.supportsFocus
//     }],
//     [2, "DEDICATED_MSG_WINDOW", "Send privmsgs to dedicated messages window", false],
//     [4, "DEDICATED_NOTICE_WINDOW", "Send notices to dedicated message window", false],
//     [3, "NICK_OV_STATUS", "Show status (@/+) before nicknames in channel lines", true],
//     [5, "ACCEPT_SERVICE_INVITES", "Automatically join channels when invited by Q", true,
//     {
//         settableByURL: false
//     }],
//     [6, "USE_HIDDENHOST", "Hide your hostmask when authed to Q (+x)", true,
//     {
//         settableByURL: false
//     }],
//     [8, "LASTPOS_LINE", "Show a last position indicator for each window", true,
//     {
//         enabled: ui.supportsFocus
//     }],
//     [9, "NICK_COLOURS", "Automatically colour nicknames", false],
//     [10, "HIDE_JOINPARTS", "Hide JOINS/PARTS/QUITS", false],
//     [11, "STYLE_HUE", "Adjust user interface hue", function() {
//         return {
//             class_: config.HueOption,
//             default_: 210
//         };
//     }, {
//         applyChanges: function(value, ui) {
//             ui.setModifiableStylesheetValues({
//                 hue: value
//             });
//         }
//     }],
//     [12, "QUERY_ON_NICK_CLICK", "Query on nickname click in channel", false],
//     [13, "SHOW_NICKLIST", "Show nickname list in channels", true],
//     [14, "SHOW_TIMESTAMPS", "Show timestamps", true] /* we rely on the hue update */ ];

// config.DefaultOptions = null;

// config.Input = new Class({
//     initialize: function(parent, option, position, parentObject) {
//         this.option = option;
//         this.value = option.value;
//         this.enabled = this.option.enabled;
//         this.position = position;
//         this.parentElement = parent;
//         this.parentObject = parentObject;
//         this.render();
//     },

//     createInput: function(type, parent, name, selected, id) {
//         if (!$defined(parent))
//             parent = this.parentElement;

//         return util.createInput(type, parent, name, selected, this.option.id);
//     },

//     FE: function(element, parent) {
//         var n = new Element(element);
//         if (!$defined(parent)) parent = this.parentElement;

//         parent.adopt(n);
//         return n;
//     },

//     focus: function() {
//         this.mainElement.focus();
//     },

//     render: function() {
//         this.event("render", this.mainElement);
//     },

//     applyChanges: function() {
//         this.event("applyChanges", [this.get(), this.parentObject.optionObject.ui]);
//     },

//     event: function(name, x) {
//         if (!$defined(this.option.extras)) return;
//         var t = this.option.extras[name];
//         if (!$defined(t)) return;

//         t.pass(x, this)();
//     },

//     cancel: function() {}
// });

// config.TextInput = new Class({
//     Extends: config.Input,
//     render: function() {
//         var i = this.createInput("text");
//         this.mainElement = i;

//         i.value = this.value;
//         i.disabled = !this.enabled;

//         this.parent();
//     },

//     get: function() {
//         return this.mainElement.value;
//     }
// });

// config.HueInput = new Class({
//     Extends: config.Input,
//     render: function() {
//         var i = new Element("div");
//         i.addClass("qwebirc-optionspane");
//         i.addClass("hue-slider");
//         this.parentElement.appendChild(i);

//         var k = new Element("div");
//         k.addClass("knob");
//         if (Browser.Engine.trident) {
//             k.setStyle("top", "0px");
//             k.setStyle("background-color", "black");
//         }

//         i.appendChild(k);

//         var slider = new Slider(i, k, {
//             steps: 36,
//             range: [0, 369],
//             wheel: true
//         });
//         slider.set(this.value);
//         this.startValue = this.value;

//         slider.addEvent("change", function(step) {
//             this.value = step;
//             this.applyChanges();
//         }.bind(this));
//         this.mainElement = i;

//         if (!this.enabled) slider.detach();

//         this.parent();
//     },
//     get: function() {
//         return this.value;
//     },
//     cancel: function() {
//         this.value = this.startValue;
//         this.applyChanges();
//     }
// });

// config.CheckInput = new Class({
//     Extends: config.Input,
//     render: function() {
//         var i = this.createInput("checkbox", null, null, null, this.id);
//         this.mainElement = i;

//         i.checked = this.value;
//         i.disabled = !this.enabled;

//         this.parent();
//     },
//     get: function() {
//         return this.mainElement.checked;
//     }
// });

// config.RadioInput = new Class({
//     Extends: config.Input,
//     render: function() {
//         var value = this.option.options;

//         this.elements = [];

//         for (var i = 0; i < value.length; i++) {
//             var d = this.FE("div", this.parentObject);
//             var e = this.createInput("radio", d, "options_radio" + this.position, i == this.option.position);
//             this.elements.push(e);
//             e.disabled = !this.enabled;

//             if (i === 0)
//                 this.mainElement = e;

//             d.appendChild(document.createTextNode(value[i][0]));
//         };
//         this.parent();
//     },
//     get: function() {
//         for (var i = 0; i < this.elements.length; i++) {
//             var x = this.elements[i];
//             if (x.checked) {
//                 this.option.position = i;
//                 return this.option.options[i][1];
//             }
//         }
//     }
// });

// config.Option = new Class({
//     initialize: function(optionId, prefix, label, default_, extras) {
//         this.prefix = prefix;
//         this.label = label;
//         this.default_ = default_;
//         this.optionId = optionId;
//         this.extras = extras;

//         if ($defined(extras) && $defined(extras.enabled)) {
//             var enabledResult = extras.enabled();
//             this.enabled = enabledResult[0];

//             if (!enabledResult[0] && enabledResult.length > 1)
//                 this.default_ = enabledResult[1];
//         } else {
//             this.enabled = true;
//         }

//         if ($defined(extras) && $defined(extras.settableByURL)) {
//             this.settableByURL = extras.settableByURL;
//         } else {
//             this.settableByURL = true;
//         }
//     },
//     setSavedValue: function(x) {
//         if (this.enabled)
//             this.value = x;
//     }
// });

// config.RadioOption = new Class({
//     Extends: config.Option,
//     Element: config.RadioInput,
//     initialize: function(optionId, prefix, label, default_, extras, options) {
//         this.options = options.map(function(x) {
//             return (typeof(x) === "string") ? [x, x] : x;
//         });
//         this.defaultposition = default_;

//         this.parent(optionId, prefix, label, this.options[default_][1], extras);
//     },
//     setSavedValue: function(x) {
//         for (var i = 0; i < this.options.length; i++) {
//             var y = this.options[i][1];
//             if (x === y) {
//                 this.position = i;
//                 this.value = x;
//                 return;
//             }
//         }
//         this.position = this.defaultposition;
//         this.value = this.default_;
//     }
// });

// config.TextOption = new Class({
//     Extends: config.Option,
//     Element: config.TextInput
// });

// config.CheckOption = new Class({
//     Extends: config.Option,
//     Element: config.CheckInput
// });

// config.HueOption = new Class({
//     Extends: config.Option,
//     Element: config.HueInput
// });

// ui.Options = new Class({
//     initialize: function(ui) {
//         if (!$defined(config.DefaultOptions)) this.__configureDefaults();

//         this.optionList = config.DefaultOptions.slice();
//         this.optionHash = {};
//         this.ui = ui;

//         this._setup();
//         this.optionList.each(function(x) {
//             x.setSavedValue(this._get(x));
//             this.optionHash[x.prefix] = x;
//             this[x.prefix] = x.value;
//         }.bind(this));
//     },
//     __configureDefaults: function() {
//         config.DefaultOptions = config.DEFAULT_OPTIONS.map(function(opt) {
//             var optionId = opt[0];
//             var prefix = opt[1];
//             var label = opt[2];
//             var default_ = opt[3];
//             var moreextras = opt[4];
//             var extras = opt[5];

//             var stype = typeof(default_);
//             if (stype == "number") {
//                 return new config.RadioOption(optionId, prefix, label, default_, moreextras, extra);
//             } else {
//                 var type;
//                 if (stype == "boolean") {
//                     type = config.CheckOption;
//                 } else if (stype == "function") {
//                     var options = default_();
//                     type = options.class_;
//                     default_ = options.default_;
//                 } else {
//                     type = config.TextOption;
//                 }
//                 return new type(optionId, prefix, label, default_, moreextras);
//             }
//         });
//     },
//     setValue: function(option, value) {
//         this.optionHash[option.prefix].value = value;
//         this[option.prefix] = value;
//     },
//     getOptionList: function() {
//         return this.optionList;
//     },
//     _get: function(opt) {
//         return opt.default_;
//     },
//     _setup: function() {},
//     flush: function() {}
// });

// ui.OptionsPane = new Class({
//     Implements: [Events],
//     initialize: function(parentElement, optionObject) {
//         this.parentElement = parentElement;
//         this.optionObject = optionObject;

//         this.createElements();
//     },
//     createElements: function() {
//         var FE = function(element, parent) {
//                 var n = new Element(element);
//                 parent.appendChild(n);
//                 return n;
//             };

//         var t = FE("table", this.parentElement);
//         var tb = FE("tbody", t);

//         this.boxList = [];

//         var optList = this.optionObject.getOptionList();
//         for (var i = 0; i < optList.length; i++) {
//             var opt = optList[i];

//             var row = FE("tr", tb);
//             var cella = FE("td", row);

//             opt.id = qwebirc.util.generateID();
//             var label = new Element("label", {
//                 "for": opt.id
//             });
//             cella.appendChild(label);
//             label.set("text", opt.label + ":");

//             var cellb = FE("td", row);
//             this.boxList.push([opt, new opt.Element(cellb, opt, i, this)]);

//         }

//         var r = FE("tr", tb);
//         var cella = FE("td", r);
//         var cellb = FE("td", r);
//         var save = qwebirc.util.createInput("submit", cellb);
//         save.value = "Save";

//         save.addEvent("click", function() {
//             this.save();
//             this.fireEvent("close");
//         }.bind(this));

//         var cancel = qwebirc.util.createInput("submit", cellb);
//         cancel.value = "Cancel";
//         cancel.addEvent("click", function() {
//             this.cancel();
//             this.fireEvent("close");
//         }.bind(this));
//     },
//     save: function() {
//         this.boxList.each(function(opt) {
//             var option = opt[0];
//             var box = opt[1];
//             this.optionObject.setValue(option, box.get());
//         }.bind(this));
//         this.boxList.each(function(opt) {
//             opt[1].applyChanges();
//         }.bind(this));
//         this.optionObject.flush();
//     },
//     cancel: function() {
//         this.boxList.each(function(opt) {
//             opt[1].cancel();
//         }.bind(this));
//     }
// });

// ui.CookieOptions = new Class({
//     Extends: ui.Options,
//     _setup: function() {
//         // this.__cookie = new Hash.Cookie("opt1", {
//         //     duration: 3650,
//         //     autoSave: false
//         // });
//         this.storage = storage;
//         this.__key = "opt1";
//         this.__options = this.storage.get(this.__key) || {};
//     },
//     _get: function(option) {
//         // var v = this.__cookie.get(option.optionId); 
//         var val = this.__options[option.optionId];
//         return $defined(val) ? val : option.default_;
//     },
//     flush: function() {
//         // this.storage.remove(this.__key);
//         // this._setup();

//         // var opts = this.getOptionList().each(function(option) {
//         //     this.__cookie.set(option.optionId, option.value);
//         // }.bind(this));
//         // this.__cookie.save();
//         var opts = {};
//         this.getOptionList().each(function(option) {
//             if(option.value !== option.default_) { //minimize stored data
//                 opts[option.optionId] = option.value;
//             }
//         });
//         this.__options = opts;
//         this.storage.set(this.__key, opts);
//     }
// });

// ui.SuppliedArgOptions = new Class({
//     Extends: ui.CookieOptions,
//     initialize: function(ui, arg) {
//         var p = {};

//         if ($chk(arg) && arg.length > 2) {
//             var checksum = arg.substr(arg.length - 2, 2);
//             var decoded = util.B64.decode(arg.substr(0, arg.length - 2));

//             if (decoded && (new crypto.MD5().digest(decoded).slice(0, 2) == checksum))
//                 p = util.parseURI("?" + decoded);
//         }

//         this.parsedOptions = p;
//         this.parent(ui);
//     },

//     _get: function(opt) {
//         if (opt.settableByURL !== true)
//             return this.parent(opt);

//         var option = this.parsedOptions[opt.optionId];

//         return $defined(option) ? opt : this.parent(opt);
//     },

//     serialise: function() {
//         var result = [];
//         this.getOptionList().each(function(opt) {
//             if (opt.settableByURL && opt.default_ != opt.value)
//                 result.push(opt.optionId + "=" + opt.value);
//         }.bind(this));

//         var raw = result.join("&");
//         var checksum = new crypto.MD5().digest(raw).slice(0, 2);
//         return (qwebirc.util.B64.encode(raw)).replaceAll("=", "") + checksum;
//     }
// });

// ui.DefaultOptionsClass = new Class({
//     Extends: ui.SuppliedArgOptions
// });
