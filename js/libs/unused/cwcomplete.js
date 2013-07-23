/*
---
description: CwComplete

authors:
  - Mario Fischer (http://www.chipwreck.de/blog/)

license:
  - MIT-style license

requires:
  core/1.3: '*'
  more/1.3: 'Element.Shortcuts'
  more/1.3: Event.Delegation

provides:
  - CwComplete

...
*/
var CwAutocompleter = new Class({

	Implements: [Options, Events],
	Binds: ['keypressed', 'selectItem', 'hover'],

	options: {
		// ajaxMethod: 'get',
		// use get or post for the request?
		// ajaxParam: 'search',
		// number of characters at which the auto completion starts
		// pause: 0,
		// data url
		// url: '',
		// number of ms before autocomplete starts (set to 0 for immediately)
		maxItems: 5,
		// name of parameter for the request (..url.php?search=..)
		inputMinLength: 2,

		targetfieldForKey: '',
		// if set, the user selected key will be written to this field as value (usually a hidden field)
		targetfieldForValue: '',
		// if set, the user selected item will be written to this field as value (usually a text field)
		suggestionBoxOuterClass: 'cwCompleteOuter',
		// rename css classes here if necessary
		suggestionBoxListClass: 'cwCompleteChoices',
		// rename css classes here if necessary
		suggestionBoxLoadingClass: 'cwCompleteLoading',
		// rename css classes here if necessary
		suggestionBoxHoverClass: 'cwCompleteChoicesHover',
		//position relative (top/bottom)
		relativePosition: 'bottom',


		// rename css classes here if necessary
		clearChoicesOnBlur: true,
		// whether to clear choices when the container loses focus
		clearChoicesOnEsc: true,
		// whether to clear choices when the container loses focus
		clearChoicesOnChoose: true,
		// whether to clear choices when a value is chosen
		setValuesOnChoose: true,
		// whether to set values when a choice is selected
		suggestionContainer: {},
		// an existing element to contain the suggestions
		choiceContainer: 'ul',
		// the element used to encapsulate all choices
		choiceElement: 'li',
		// the element used to encapsulate the actual choice text
		/*      doRetrieveValues: function(input) { return [['1','example'], ['2','something else']]; }, // optional method to provide the values, the url is ignored then */
		onChoose: $empty // function to execute if the user chose an item
	},

	lielems: [],

	// initialization : css class of the input field, url for ajax query, options
	initialize: function(inputfield, options) {
		// prepare options
		this.setOptions(options);
		inputfield = $(inputfield);
		if (!inputfield) {
			return;
		}

		this.textfield = inputfield;
		this.prevlength = 0;
		// this.url = this.options.url;
		this.clickeddoc = false;
		this.edge = this.options.top == 'top' ? 'bottom' : 'top';

		if (this.options.suggestionContainer && $(this.options.suggestionContainer)) {
			this.container = $(this.options.suggestionContainer);
			this.container.addClass(this.options.suggestionBoxOuterClass);
		} else {
			this.container = new Element('div', {
				'class': this.options.suggestionBoxOuterClass,
				'styles': {
					'width': inputfield.getWidth() + 'px'
				}
			})
			.inject(document.body);
			this.updatePos();
		}

		this.choices = new Element(this.options.choiceContainer, {
			'class': this.options.suggestionBoxListClass
		}).inject(this.container, 'inside');


		this.choices.addEvent('click:relay(' + this.options.choiceElement + ')', this.selectItem)
					.addEvent('mouseenter:relay(' + this.options.choiceElement + ')', this.hover); //change selection class on hover

		if (Browser.ie) {
			this.choices.addEvent('mousedown:relay(' + this.options.choiceElement + ')', this.selectItem);
		} else {
			this.choices.addEvent('mousedown', Event.preventDefault);
		}

		this.clearChoices();

		// attach events
		inputfield.setProperty('autocomplete', 'off')
				.addEvents({
					'keydown': this.keypressed,
					'keyup': this.keypressed
				});
		if (this.options.clearChoicesOnBlur) {
			if (!Browser.ie) {
				document.addEvent('click', this.docclick.bind(this));
				this.textfield.addEvents({
					'blur': this.blurLater.bind(this)
				});
			} else {
				this.textfield.addEvents({
					'blur': this.clearChoices.bind(this)
				});
			}
		}

		// prepare ajax
		// if (this.url) {
		// 	this.ajax = new Request({
		// 		url: this.url,
		// 		method: this.options.ajaxMethod
		// 	});
		// 	this.ajax.addEvent('onComplete', this.ajaxComplete.bind(this));
		// }
	},

	updatePos: function() {
		this.container.position({
			relativeTo: this.textfield,
			position: {y: this.options.relativePosition, x: 'left'},
			edge: {y: this.edge, x:'left'}
		});
	},

	// Retrieve values given the textfield input and show "loading..."
	getValues: function(input) {
		var t_input = input;

		if (this.options.doRetrieveValues != null) {
			this.setValues(this.options.doRetrieveValues.call(this, input));
		}// else if (this.ajax) {

		// 	if (this.options.pause === 0) {
		// 		this.choices.hide();
		// 		this.container.addClass(this.options.suggestionBoxLoadingClass).show();
		// 		this.ajax.send(this.options.ajaxParam + "=" + t_input);
		// 	} else {
		// 		// dont spam the lookup script wait to see if typing has stopped
		// 		clearTimeout(this.waiter);
		// 		this.waiter = (function() {
		// 			if (t_input === this.textfield.get('value')) {
		// 				this.choices.hide();
		// 				this.container.addClass(this.options.suggestionBoxLoadingClass).show();
		// 				this.ajax.send(this.options.ajaxParam + "=" + t_input);
		// 			} else {
		// 				this.ajax.cancel();
		// 			}
		// 		}).delay(this.options.pause, this);
		// 	}
		// }
	},

	// Ajax oncomplete, eval response and fill dropdown, remove "loading"-classes
	// ajaxComplete: function(input) {
	// 	if (!input) {
	// 		return;
	// 	}
	// 	var myvalue = JSON.decode(input, true);

	// 	if (myvalue === false || !myvalue.length) {
	// 		this.clearChoices();
	// 	} else {
	// 		this.setValues(myvalue);
	// 	}
	// },

	setValues: function(values) {
		var oldlen = this.lielems.length;
		this.values = values;
		this.clearChoices();

		Math.min(this.options.maxItems, values.length).times(function(i) {
			var val = values[i];
			if (val) {
				this.lielems[i] = new Element(this.options.choiceElement, {
					'html': val[1],
					'value': val[0]
				});
				this.lielems[i].inject(this.choices, 'inside');
			}
		}, this)

		this.container.show();
		this.container.removeClass(this.options.suggestionBoxLoadingClass);
		this.choices.show();
		this.lielems[this.selected].addClass(this.options.suggestionBoxHoverClass);

		if(oldlen !== this.lielems.length && this.options.relativePosition == 'top') {
			this.updatePos();
		}
	},

	// Clear list of choices
	clearChoices: function(obj) {
		this.lielems.empty();
		this.selected = 0;
		this.choices.empty();
		this.container.hide();
	},

	selectItem: function(e, target) {
		e.stop();
		this.enterValue({
			id: target.value,
			value: target.get('html')
		})
	},

	// Enter value from selection into text-field and fire onChoose-event
	enterValue: function(selected) {
		if (this.options.setValuesOnChoose) {
			if (this.options.targetfieldForKey && $(this.options.targetfieldForKey)) {
				$(this.options.targetfieldForKey).value = selected['id'];
			}
			if (this.options.targetfieldForValue && $(this.options.targetfieldForValue)) {
				$(this.options.targetfieldForValue).value = selected['value'];
			} else {
				this.textfield.value = selected['value'];
			}
		}

		this.fireEvent('onChoose', {
			'key': selected['id'],
			'value': selected['value']
		});

		if (this.options.clearChoicesOnChoose) {
			this.clearChoices();
		}
	},

	moveSelection: function(dir) {
			this.lielems[this.selected].removeClass(this.options.suggestionBoxHoverClass);
		if (this.lielems[this.selected + dir]) {
			this.selected += dir;
			this.lielems[this.selected].addClass(this.options.suggestionBoxHoverClass);
		}
	},

	// Text field key handler
	keypressed: function(event) {
		if (event.target.id === this.textfield.id) {
			if (event.type == 'keyup') {
				switch (event.key) {
				case 'enter':
					if (this.lielems[this.selected]) {
						this.lielems[this.selected].fireEvent('click');
					}
					event.preventDefault();
					break;
				case 'down':
					this.moveSelection(+1);
					event.preventDefault();
					break;
				case 'up':
					this.moveSelection(-1);
					event.preventDefault();
					break;
				case 'esc':
					if (this.options.clearChoicesOnEsc) {
						this.clearChoices();
					}
					break;
				default:
					var text = event.target.value;
					if (text.length != this.prevlength) { // text length has changed
						event.preventDefault();
						if (text.length >= this.options.inputMinLength) { // ..and is long enough
							this.prevlength = text.length;
							this.getValues(text);
						} else {
							this.clearChoices();
						}
					}
				}
			} else if (event.key == 'enter' || event.key == 'esc') { // keydown disabled for those
				event.preventDefault();
			} else {
				this.prevlength = event.target.value.length; // any other keydown
			}
		}
	},

	hover: function(event, target) {
		this.lielems[this.selected].removeClass(this.options.suggestionBoxHoverClass);

		this.selected = this.lielems.indexOf(target);
		target.addClass(this.options.suggestionBoxHoverClass);
	},

	// IE6/7 workaround...
	docclick: function(event) {
		if (this.textfield.id !== event.target.id) {
			this.clickeddoc = true;
		}
	},

	// IE6/7 workaround...
	blurLater: function(event) {
		(function() {
			if (this.clickeddoc) {
				this.clickeddoc = false;
				this.clearChoices(event);
			} else {
				this.textfield.focus();
			}
		}).delay(200, this);
	}
});
