/**
 * Template monkey patches + add helpers
 * @depends [qwebirc, util/utils, util/lang]
 * @provides [utils/templates]
 */
(function(engine) {
    //Some simple templates that dont really need to be compiled
    var source = {
        messageLine:    "<hr class='lastpos' />",
        dropdownhint:   "<div class='dropdownhint'>Click the icon for the main menu.</div>",
        
        tabbar:         "<div class='tabbar'></div>",
        tabDetach:      "<span class='detach ui-icon ui-icon-newwin' title='" + lang.detachWindow + "'></span>",
        tabAttach:      "<span class='attach ui-icon ui-icon-circle-minus'></span>",
        tabClose:       "<span class='tab-close ui-icon ui-icon-circle-close' title='" + lang.closeTab + "'></span>",

        loadingPage:    "<div class='loading'>" + lang.loadingPage + "<img src='images/loading.gif' alt='url'></div>"
    };

    // source.verticalDivider = "<div class='ui-icon ui-icon-grip-solid-vertical handle vertical'></div>";
    // source.horizontalDivider = "<div class='ui-icon ui-icon-grip-solid-horizontal handle horizontal'></div>";

    /************************
        HELPERS
    ***********************/
    engine.registerHelper("check", function(checked){
        return checked ? "checked" : "";
    });

    engine.registerHelper("enableDisable", function(x) {
        return x ? lang.DISABLE : lang.ENABLE;//if true shows disable
    });

    engine.registerHelper("$link", util.formatURL);

    //f(property name, type of prop, default val)
    engine.registerHelper("$css", function(prop, def, def2) {//this refers to context
        if(typeof def2 !== "object") return this[prop] ? def : def2;
        return this[prop] || def;
    });

    engine.registerHelper("$col", function(val, type) {
        //this refers to context
        //mix up background or `type` with a  given colour value
        var base = this.colour[_.isString(type) ? type : "background"];
        return (val ? base.mix(val) : base).rgbToHex();
    });

    engine.registerHelper("$hex", function(prop) {
        return new Color(this.colour ? this.colour[prop] : prop).rgbToHex();
    });

    engine.registerHelper("format", function(prop) {
        return util.format(prop, this);
    });

    engine.registerHelper("lang", function(prop) {
        return lang[prop];
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
})(window.Handlebars);

/**
 * @depends: [qwebirc]
 */
Epitome.View.implement({
    template: function(data, template) {
        // refactored for handlebars
        return (template || this.options.template)(data);
    }
});