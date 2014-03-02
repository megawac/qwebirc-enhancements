/**
 * Base view to be inheritted
 *
 * @depends [util/uihelpers]
 * @provides [panes/PanelView]
 */
var PanelView = ui.PanelView = new Class({
    /* global getTemplate */
    Extends: Epitome.View,
    options: {
        pane: "",
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

        Promise.all([getTemplate(self.options.pane), components.loader.load(self.options.deps)])
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
        this.trigger("close");
        return this.destroy();
    }
});