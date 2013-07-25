//replacement for highlight recent
(function (window, $$) {
    "use strict";

    //not necessary ----- just do with css rules [nth-children] :)
    window.Highlighter = new Class({
        Implements: [Options, Events],
        Binds: ["highlight", "removeElement"],
        options: {
            highlightClasses: ["highlight"], //array of classes to iterate
            maxHighlight: NaN,//max elements to highlight at anytime NaN/undef will be ignored
            selector: '> *',
            filter: Function.from(false) // (f -> bool) whether to hl a element
        },
        index: 0,
        highlighted: [],

        initialize: function(element, options) {
            this.setOptions(options);
            this.element = $(element);

            this.element.addEvents({
                adopt: this.highlight,
                disown: this.removeElement
            });
        },

        //can be applied one or more ele
        highlight: function($ele) {
            if(this.options.filter($ele)) {
                var clas = this.options.highlightClasses.next(this.index ++),
                    $$ele = $$($ele),
                    highlighted = this.highlighted.combine($$ele),
                    sel2 = highlighted.length - this.options.maxHighlight;
                $$ele.addClass(clas);

                if(sel2 > 0)
                    this.removeHighlights(highlighted.splice(0, sel2));
            }
        },

        removeElement: function(el) {
            var i = this.highlighted.indexOf(el);
            if(i > 0) {
                this.highlighted.splice(i, 1);
                this.element.getElements(this.selector);
            }
            return this;
        },

        removeHighlights: function(ele, hl) {
            hl = hl || this.options.highlightClasses.join(",.");
            if(!hl.startsWith("."))
                hl = "." + hl;
            var highlighted = $$(ele || this.element.getElements(hl));

            hl.split(",").each(function(clas) {
                highlighted.removeClass(clas.substring(1)); //remove period
            });
        }


    });

})(this, this.$$);
