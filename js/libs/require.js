
/*
---

script: Assets.js

name: Assets

description: Provides methods to dynamically load JavaScript, CSS, and Image files into the document.

license: MIT-style license

authors:
  - Valerio Proietti

requires:
  - Core/Element.Event
  - /MooTools.More

provides: [Asset, Assets]

...
*/
(function(window) {
    //hash of urls that have already loaded normally
    var loaded = {};
    window.Asset = {

        javascript: function(source, properties){
            if(source in loaded) return new Element('script');
            if (!properties) properties = {};

            var script = new Element('script', {
                    src: source,
                    type: 'text/javascript',
                    async: ''
                }),
                doc = properties.document || document,
                onload = properties.onload || properties.onLoad,
                load = function() {
                    loaded[source] = true;
                    if(onload) onload.call(this);
                };

            delete properties.onload;
            delete properties.onLoad;
            delete properties.document;

            if (!script.addEventListener){
                script.addEvent('readystatechange', function(){
                    if (['loaded', 'complete'].contains(this.readyState)) load.call(this);
                });
            } else {
                script.addEvent('load', load);
            }

            return script.set(properties).inject(doc.head);
        }
    };

})(this);