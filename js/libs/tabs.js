/*
---
script: rotater.js
description: MGFX.Rotater, the base class that provides slides and transitions. 
authors: Sean McArthur (http://seanmonstar.com) 
license: MIT-style license 
requires:
 core/1.3.0: [Event, Element.Event, Fx.CSS]
 more/1.3.0.1: [Fx.Elements]
provides: [MGFX.Rotater]
...
*/

//MGFX.Rotater. Copyright (c) 2008-2010 Sean McArthur <http://seanmonstar.com/>, MIT Style License.

if(!window.MGFX) MGFX = {};

MGFX.Rotater = new Class({
	
	Implements: [Options, Events],
	
	options: {
		slideInterval: 5000,
		transitionDuration: 250,
		startIndex: 0,
		// autoplay: true,
		hover:true,
		hash: true
		/*onAutoPlay: function() {},
		onRotate: function() {},
		onShowSlide: function() {},
		onStop: function() {},
		onPause: function() {},
		onResume: function() {}*/
		//slides
	},
	
	initialize: function(container,options){
		this.setOptions(options);
		this.container = container;
		this.slides = container.getElements(this.options.content);
		this.createFx();
		this.showSlide(this.options.startIndex);
		if(this.slides.length < 2) this.options.autoplay = false;
		// if(this.options.autoplay) this.autoplay();
	},
	
	createFx: function(){
		if (!this.slideFx) this.slideFx = new Fx.Elements(this.slides, {duration: this.options.transitionDuration, link: 'cancel'});
		this.slides.setStyle('opacity', 0);
	}.protect(),
	
	// setupHover: function() {
	// 	var _timeLastRotate = new Date(),
	// 		_timeLastPause,
	// 		_timeTillRotate = this.options.slideInterval;

	// 	this._resumeDelay = null;
			
	// 	var onRotate = this._onRotate = function() {
	// 		if(this.slideshowInt) {
	// 			_timeLastRotate = new Date();
	// 			_timeTillRotate = this.options.slideInterval;
	// 		}
	// 	};
	// 	var onMouseEnter = this._onMouseEnter = function() {
	// 		this.stop();
	// 		_timeLastPause = new Date();
	// 		clearTimeout(this._resumeDelay);
	// 		this.fireEvent('onPause');
	// 	}.bind(this);
		
	// 	var onMouseLeave = this._onMouseLeave = function() {
	// 		var timePassed = (_timeLastPause - _timeLastRotate);
	// 		_timeLastRotate = new Date() - timePassed;
	// 		this._resumeDelay = (function() {
	// 			this.autoplay();
	// 			this.rotate();
	// 			this.fireEvent('onResume');
	// 		}).delay(_timeTillRotate - timePassed, this);			
	// 	}.bind(this);
		
	// 	this.addEvent('onRotate', onRotate);
	// 	this.slides.addEvents({
	// 		'mouseenter': onMouseEnter,
	// 		'mouseleave': onMouseLeave
	// 	});
		
	// 	this._hoverSet = true;
	// }.protect(),
	
	removeHover: function() {
		this.removeEvent('onRotate', this._onRotate);
		this.slides.removeEvents({
			'mouseenter': this._onMouseEnter,
			'mouseleave': this._onMouseLeave
		});
		clearTimeout(this._resumeDelay);
		this._hoverSet = false;
	},
	
	showSlide: function(slideIndex){
		if(slideIndex == this.currentSlide) return this;
		var action = {},
			curSlide = this.currentSlide;
		this.slides.each(function(slide, index){
			if(index == slideIndex && index != curSlide){ //show
				action[index.toString()] = {
					opacity: 1
				};
				slide.getParent().setStyle('height', slide.getHeight());
			} else {
				action[index.toString()] = {
					opacity:0
				};
			}
		});
		this.fireEvent('showSlide', slideIndex);
		this.currentSlide = slideIndex;
		this.slideFx.start(action);
		return this;
	},
	
	// autoplay: function(){
	// 	if(this.slideshowInt) return this;
	// 	if(this.options.hover && !this._hoverSet) this.setupHover();
	// 	this.slideshowInt = this.rotate.periodical(this.options.slideInterval, this);
	// 	this.fireEvent('autoPlay');
	// 	return this;
	// },
	
	stop: function(not_pause){
		clearInterval(this.slideshowInt);
		this.slideshowInt = null;
		this.fireEvent('stop');
		if(not_pause && this.options.hover) this.removeHover();
		return this;
	},
	
	rotate: function(){
		var next = this.getNext();
		this.showSlide(next);
		this.fireEvent('rotate', next);
		return this;
	},
	
	random: function() {
		var index = Number.random(0, this.slides.length);
		index = index == this.currentSlide ? this.getNext() : index;
		this.showSlide(index);
		this.fireEvent('random', index);
		return this;
	},
	getNext: function() {
		var current = this.currentSlide;
		return (current+1 >= this.slides.length) ? 0 : current+1
	}.protect()
	
});

/*
---
script: tabs.js
description: MGFX.Tabs, extension of base class that adds tabs to control the rotater. 
authors: Sean McArthur (http://seanmonstar.com) 
license: MIT-style license 
requires:
 core/1.3.0: [Event, Element.Event, Fx.CSS]
 more/1.3.0.1: [Fx.Elements]
provides: [MGFX.Tabs]
...
*/

//MGFX.Tabs. Copyright (c) 2008-2011 Sean McArthur <http://seanmonstar.com/>, MIT Style License.

// if(!window.MGFX) MGFX = {};

MGFX.Tabs = new Class({
	
	Extends: MGFX.Rotater,
	
	options: {
		autoplay: false,
		onShowSlide: function(slideIndex) {
			this.tabs.removeClass('active');
			this.tabs[slideIndex].addClass('active');
		},
		tabsClass: 'mgfx-tab',
		contentClass: 'mgfx-content'
		// tabs: ... selector
	},
	
	initialize: function(container, options){
		this.setOptions(options);
		this.container = container;
		this.tabs = container.getElements(this.options.tabs);
		this.tabs.getParent().addClass(this.options.tabsClass);
		this.createTabs(container);
		if(options.hash && window.location.hash) {
			this.getHashIndex(options);
		}
		this.parent(container);
		this.slides.getParent().addClass(this.options.contentClass);
	},
	
	createTabs: function() {
		var that = this;
		this.container.addEvent('click:relay(' + this.options.tabs +')', function(event, target) {
			event.preventDefault();
			var index = that.tabs.indexOf(target);
			that.showSlide(index);
			that.stop(true);
		});
	}.protect(),
	
	getHashIndex: function(options) {
		var hash = window.location.hash.substring(1);
		this.tabs.each(function(el, index) {
			if(el.get('id') == hash) {
				options.startIndex = index;
			}
		});
	}.protect()
	
});

if(!window.Tabs) var Tabs = MGFX.Tabs;