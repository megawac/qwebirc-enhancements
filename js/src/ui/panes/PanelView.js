/**
 * Base view to be inheritted
 *
 * @depends [components/loader, util/uihelpers]
 * @provides [panes/PanelView]
 */
/* exported PanelView */
var PanelView = ui.PanelView = new Class({
    Extends: Epitome.View,
    options: {
        pane: "",
        // i18n: "mypanel",
        deps: [],

        events: {
            "click:relay([data-event='close'])": "_close"
        },

        onReady: function() {
            return this.render();
        }
    },

    getData: function() {
        return this.model && this.model.toJSON() || this.options && this.options.data || {};
    },

    render: function() {
        var self = this.empty();
        var $loader = Element.from(templates.loadingPage()).inject(self.element);
        var loadPromises = [util.getTemplate(self.options.pane), components.loader.load(self.options.deps)];
        if (self.options.i18n) {
            loadPromises.push(lang.load("panes/" + self.options.i18n));
        }

        Promise.all(loadPromises)
        .then(function(results) {
            //results[0] is the template
            self.element.adopt(Elements.from(results[0](self.getData())));//not inject because it can have text nodes
            $loader.dispose();
            self.postRender();
        });
        return self.parent();
    },

    postRender: function() {
        ui.Behaviour.apply(this.element); //note not native apply (gotcha)
        return this;
    },

    empty: function() {
        return this.parent(true);
    },

    _close: function() {
        return this.trigger("close").destroy();
    }
});