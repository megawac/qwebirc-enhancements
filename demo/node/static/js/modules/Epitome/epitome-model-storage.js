; (function() {
    'use strict';

    // wrapper function for requirejs or normal object
    var wrap = function(Model) {

            // decorate the original object by adding a new property Sync
            return new Class({
                Extends: Model,

                properties: {
                    //storage///
                },

                options: {
                    storage: {
                        duration: 365,
                        domain: '/',
                        fallback: true,
                        storageType: "localStorage"
                    },
                    key: undefined,
                    minimize: false
                },

                initialize: function(obj, options) {
                    // needs to happen first before events are added,
                    // in case we have custom accessors in the model object.
                    this.setOptions(options);
                    if(!this.options.key)
                        throw('Initiated without storage key (options.key)');
                    if(!this.properties.storage)
                        this.properties.storage = new Storage(this.options.storage);
                    this.parent(obj, this.options);
                    this.setupSync();
                },

                //revert or update changes to Model
                sync: function(method, model) {
                    var oldattrs = this._attributes,
                        attrs = Object.append({}, this.options.defaults, this.properties.storage.get(this.options.key));

                    //update props
                    Object.each(attrs, function(val, key) {
                        if(!Epitome.isEqual(oldattrs[key], val)) {
                            this.set(key, val);
                        }
                    }, this);

                    //no longer set properties
                    Object.keys(oldattrs).each(function(key) {
                        if(!attrs.hasOwnProperty(key)) {
                            this.unset(key);
                        }
                    });

                    this.trigger('sync');
                    return this;
                },

                setupSync: function() {
                    this._attributes = Object.append(this._attributes, this.properties.storage.get(this.options.key));
                    this.fireEvent("init");
                    return this;
                },

                save: function(val) {
                    if(this.validate()) {
                        var defaults = this.options.defaults,
                            data = this.options.minimize ? Object.filter(this._attributes, function(val, key) {
                                return !Epitome.isEqual(val, defaults[key]);//dont store defaults if minimize is true
                            }) : this._attributes;
                        this.properties.storage.set(this.options.key, data);
                        this.trigger('save');
                    }
                    return this;
                },

                destroy: function() {
                    // destroy the model, send delete to server
                    this.properties.storage.remove(this.options.key);
                    return this.parent();
                }
            });
        }; // end wrap
    if (typeof define === 'function' && define.amd) {
        define(['./epitome-model'], wrap);
    } else {
        this.Epitome || (this.Epitome = {
            Model: {}
        });
        this.Epitome.Model.Storage = wrap(this.Epitome.Model);
    }
}.call(this));