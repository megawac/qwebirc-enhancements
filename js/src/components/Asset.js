/**
 * Based on Mootools/More/Assets
 * Promised based implementation
 * @depends [components, patches]
 * @provides [components/Loader]
 */
(function() {
    //hash of urls that have already loaded successfully
    var loaded = {};
    components.loader = {
        javascript: function(source, properties) {
            return new Promise(function(fullfil, reject) {
                if(source in loaded) fullfil();
                if (!properties) properties = {};

                var script = new Element("script", {
                    src: source,
                    async: ""
                });
                var doc = properties.document || document;
                var success = true;
                var onload = function() {
                    if(success) fullfil();
                    loaded[source] = success;
                    script.destroy();
                };
                var onerror = function() {
                    reject();
                    success = false;
                    script.destroy();
                };

                delete properties.document;

                if (!script.addEventListener){
                    script.addEvent("readystatechange", function(){
                        if (["loaded", "complete"].contains(this.readyState)) onload();
                    });
                } else {
                    script.addEvent("load", onload);
                }
                script
                    .addEvent("error", onerror)
                    .set(properties)
                    .inject(doc.head);
            });
        },

        load: function(sources, properties) {
            if(!Type.isArray(sources)) sources = Array.from(arguments);
            if(!Type.isObject(properties)) {
                if(Type.isObject(_.last(sources))) properties = sources.pop();
            }
            var promises = sources.map(function(source) {
                return components.loader.javascript(source, properties);
            });
            return Promise.all(promises);
        }
    };

})();