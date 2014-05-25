/**
 * Template monkey patches + add helpers
 * @depends [qwebirc, util/utils, util/lang]
 * @provides [utils/templates]
 */
qwebirc.ready(function(engine) {
    //Some simple templates that dont really need to be compiled
    var source = {
        messageLine:    "<hr class='lastpos' />",
        dropdownhint:   "<div class='dropdownhint'>" + lang.dropdownHint + "</div>",
        
        tabDetach:      "<span class='detach entypo' title='" + lang.detachWindow + "'>&#59212;</span>",
        tabAttach:      "<span class='attach entypo' title='" + lang.attachWindow + "'>&#59213;</span>",
        tabClose:       "<span class='tab-close entypo' title='" + lang.closeTab + "'>&#10006;</span>"
    };

    /************************
        HELPERS
    ***********************/
    engine.registerHelper({
        "check": function(checked){
            return checked ? "checked" : "";
        },
        
        "enableDisable": function(x) {
            return x ? lang.DISABLE : lang.ENABLE;//if true shows disable
        },
        
        "$link": util.formatURL,
        
        "format": function(prop) {
            return util.format(prop, this);
        },
        
        "lang": function(prop) {
            var item = _.lookup(lang, prop);
            if (!item && DEBUG) console.error(prop + " is invalid");
            return util.format(_.lookup(lang, prop), this);
        },
        
        "$timestamp": util.IRCTimestamp,

        //Modifiable css helpers!

        //f(property name, default val)
        "$result": function(prop, def) {//this refers to context
            var result = _.result(this, prop);//waiting on https://github.com/jashkenas/underscore/pull/1515
            return result == null ? def : result;
        },

        //attempting to mimic some of these http://lesscss.org/functions/#color-operations
        "$mix": function(val, colourProp) {
            //this refers to context
            //mix up background or `colourProp` with a  given colour value
            var base = this.colour[_.isString(colourProp) ? colourProp : "background"] || colourProp;
            var mixer = one.color(val);
            return new one.color.RGB(mixer.red() * base.red(), mixer.blue() * base.blue(), mixer.green() * base.green(), base.alpha() * mixer.alpha()).hex();
        },
        
        "$saturate": function(val, colourProp) {
            var base = one.color(this.colour[_.isString(colourProp) ? colourProp : "background"] || colourProp);
            return base.saturation(parseFloat(val), true).hex();
        },

        "$lighten": function(val, colourProp) {
            var base = one.color(this.colour[_.isString(colourProp) ? colourProp : "background"] || colourProp);
            return base.lightness(parseFloat(val), true).hex();
        },

        "$hue": function(val, colourProp) {
            var base = one.color(this.colour[_.isString(colourProp) ? colourProp : "background"] || colourProp);
            return base.hue(parseFloat(val), true).hex();
        },

        //get the hex value of a property
        "$hex": function(colourProp) {
            return one.color(this.colour[colourProp] || this.colour.background).hex();
        },

        //block helper
        "vendor-prefix": function(prefixes, options) {
            return prefixes.split(",").map(function(prefix) {
                return util.format(options.fn(this), {
                    prefix: prefix
                });
            }, this).join("");
        }
    });

    /******************
        Compiliation
    *********************/
    //allows templates to reference eachother (engine.partials)
    templates = _.reduce(source, function(compiled, template, key) {
        // compiled[key] = engine.compile(item);
        compiled[key] = Function.from(template);
        return compiled;
    }, templates || {});

    engine.partials = templates;
}, window.Handlebars);

/**
 * @depends: [qwebirc]
 */
Epitome.View.implement({
    template: function(data, template) {
        // refactored for handlebars
        return (template || this.options.template)(data);
    }
});