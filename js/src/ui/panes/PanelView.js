//class to be inheritted
/**
 * Base view
 *
 * @depends ../../util/uihelpers.js
 */
var PanelView = ui.PanelView = new Class({
    Extends: Epitome.View,
    options: {
        pane: "",

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

        //dream of promises here
        getTemplate(self.options.pane, function(template) {
            var eles = Elements.from(template(self.getData()));
            self.element.adopt(eles);//not inject because it can have text nodes
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