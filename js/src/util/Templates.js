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
        
        tabDetach:      "<span class='detach ui-icon ui-icon-newwin' title='" + lang.detachWindow + "'></span>",
        tabAttach:      "<span class='attach ui-icon ui-icon-circle-minus' title='" + lang.attachWindow + "'></span>",
        tabClose:       "<span class='tab-close ui-icon ui-icon-circle-close' title='" + lang.closeTab + "'></span>"
    };

    // source.verticalDivider = "<div class='ui-icon ui-icon-grip-solid-vertical handle vertical'></div>";
    // source.horizontalDivider = "<div class='ui-icon ui-icon-grip-solid-horizontal handle horizontal'></div>";

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
        "$mix": function(val, colourProp, weight) {
            //this refers to context
            //mix up background or `colourProp` with a  given colour value
            var base = this.colour[_.isString(colourProp) ? colourProp : "background"] || colourProp;
            weight = isFinite(weight) ? +weight : 50; //mix 50% by default
            return (val ? base.mix(val, weight) : base).rgbToHex();
        },
        
        "$saturate": function(percent, colourProp) {
            var base = this.colour[_.isString(colourProp) ? colourProp : "background"] || colourProp;
            return base.setSaturation(percent.toFloat()).rgbToHex();
        },

        "$darken": function(percent, colourProp) {
            var base = this.colour[_.isString(colourProp) ? colourProp : "background"] || colourProp;
            return base.setBrightness(percent.toFloat()).rgbToHex();
        },

        "$invert": function(colourProp) {
            return new Color(this.colour[colourProp] || this.colour.background).invert().rgbToHex();
        },

        //get the hex value of a property
        "$hex": function(colourProp) {
            return new Color(this.colour[colourProp] || this.colour.background).rgbToHex();
        }
    });

    /******************
        Compiliation
    *********************/
    //allows templates to reference eachother (engine.partials)
    engine.partials = _.reduce(source, function(compiled, template, key) {
        // compiled[key] = engine.compile(item);
        compiled[key] = Function.from(template);
        return compiled;
    }, templates || {});
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