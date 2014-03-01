/**
 * Based on Mootools/More/Assets
 * Promised based implementation
 * @depends [components, patches]
 * @provides [components/Loader]
 */
(function() {
    //hash of urls that have already loaded successfully
    var loaded = {};
    components.Loader = {
        javascript: function(source, properties) {
            return new Promise(function(fullfil, error) {
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
                    error();
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
        }
    };

})();