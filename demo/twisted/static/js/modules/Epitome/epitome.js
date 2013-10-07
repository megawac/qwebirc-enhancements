;(function(){
	'use strict';

	var obj,
		wrap = function(Events, Model, Storage, View, Router){
			var e = new Events();
			e.Events = Events;
			e.Model = Model;
			Model.Storage = Storage;
			e.View = View;
			e.Router = Router;
			return e;
		};

	// by default, requiring Epitome returns an Epitome.Events instance as a mediator
	if (typeof define === 'function' && define.amd){
		// returns an empty module
		define(['./epitome-events', './epitome-model', './epitome-model-storage', './epitome-view', './epitome-router'], wrap);
	}
}.call(this));