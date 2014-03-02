/**
 * Collection of ui related helper functions
 * @depends [qwebirc]
 * @provides [util/uihelpers]
 */

ui.Behaviour = (function() {
    /* global Behavior, Delegator */
    var behaviour = new Behavior();
    var delegator = new Delegator({
        getBehavior: function(){ return behaviour; }
    });
    return {
        apply: function($ele) {
            behaviour.apply($ele);
            delegator.attach($ele);
        }
    };
})();
  
var getTemplate = util.getTemplate = function(name, cb, options) {
    /*
        Loads a template. If its already on page call callback immediately otherwise load asyncronously
        Note: Should use deferred if available
        Still need to finish implementing this.
    */
    var promise = new Promise(function(fulfill, reject) {
        if(_.isFunction(name)) {
            if(DEBUG) console.warn("wtf");
            fulfill(name);//assume identity
        }
        else if(_.has(templates, name)) {
            fulfill(_.lookup(templates, name));
        }
        else {
            var path = options && options.path || "dist/templates/",
                file = options && options.file || name,
                type = options && options.type || ".js";
            if(!path.endsWith("/")) path += "/";
            if(!type.startsWith(".")) type = "." + type;
            components.loader.javascript(path + file + type)
            .then(function() {
                fulfill(_.lookup(templates, name));
            }, reject);
        }
        //return deferred
    });
    if(cb) promise.then(cb);
    return promise;
};
  
util.loadTemplate = function(name) {//helper to preload a template - assumes not called instantly
    var template;
    getTemplate(name, function(tmpl) {template = tmpl});
    return function() {return template.apply(this, arguments);};
};
  
ui.setTitle = function(title) {
    document.title = title;
};
  
// util.setCaretPos = Element.setCaretPosition;
  
// util.setAtEnd = function($el) {
//     $el.setCaretPosition($el.value.length);
// };
  
// util.getCaretPos = Element.getCaretPosition;
  
util.wrapSelected = function($eles, wrap) {
    $eles = $$($eles);
  
    var start = _.isArray(wrap) ? wrap[0] : wrap,
        end = _.isArray(wrap) ? wrap[1] : wrap;
  
    $eles.each(function($ele) {
        var range = $ele.getSelectedRange();
        if(range.start != range.end) {
            var text = $ele.val();
            $ele.val(text.slice(0, range.start) + start + text.slice(range.start, range.end) + end + text.slice(range.end))
                .setCaretPosition(range.end + start.length + end.length);
        }
    });
};
  
ui.decorateDropdown = function($btn, $ddm, options) {
    options = options || {};
    var evts = {
        "click": hideMenu,
        "keypress": hideMenu
    };
    function hideMenu() {
        if(options.onHide)
            options.onHide.call(this, $ddm);
        document.removeEvents(evts);
        return $ddm.hide();
    }
    function toggleMenu(state) {
        if(options.onShow)
            options.onShow.call(this, $ddm);
  
        if (state===true || !$ddm.isDisplayed()) {
            $ddm.show();
            document.addEvents(evts);
        } else {
            hideMenu();
        }
        return $ddm;
    }
  
    $ddm.store("toggle", toggleMenu)
        .position.delay(50, $ddm, {
            relativeTo: $btn,
            position: {x: "left", y: "bottom"},
            edge: {x: "left", y: "top"}
        });
  
    if($ddm.isDisplayed()) document.addEvents(evts);
  
    if(options.btnlistener) {
        $btn.addEvent("click", function(e) {
            e.stop();
            toggleMenu();
        });
    }
    return options.autohide ? hideMenu() : $ddm;
};
  
//dirty function please help with css :(
//dir can be "width" "height"
util.fillContainer = function ($ele, options) {
    options = Object.append({style: ["width"], offset: 20}, options);
  
    var filler = function() {
        Array.from( options.style ).each(function(style) {//wait a sec for potential style recalcs
            var method = style.contains("width") ? "x" : "y",
                offset = options.offset;
  
            $ele.getSiblings()
                .each(function(sib) {
                    offset += sib.getSize()[method];
                });
  
            util.calc($ele, style, "100% - " + offset + "px");
        });
    };
  
    _.defer(filler);
    return $ele;
};


// //http://caniuse.com/calc
// Browser.Features.calc = !!((Browser.ie && Browser.version >= 9) ||
//                             (Browser.firefox && Browser.version >= 4) ||
//                             (Browser.chrome && Browser.version >= 19) ||
//                             (Browser.opera && Browser.version >= 15) ||
//                             (Browser.safari && Browser.version > 6));
document.addEvent("domready", function() {//based off https://gist.github.com/Rob-ot/3399053
    Browser.Features.calc = false;//union bool str (-webkit-calc, -moz-calc, calc)
    ["","-webkit-","-moz-","-o-"].some(function(prefix) {
        try {
            var $el = new Element("div", {
                styles: {
                    width: prefix + "calc(5px)"
                }
            });
            if ($el.style.length > 0) return (Browser.Features.calc = prefix + "calc");
        } catch(nope){}
    });
});

util.percentToPixel= function(data, par) {
    par = par || $(document.body);
    var size = par.getSize();
    return {
        x: size.x * (data.x * 0.01),
        y: size.y * (data.y * 0.01)
    };
};

//https://gist.github.com/megawac/6525074
//http://www.w3schools.com/cssref/css_units.asp
util.calc = function($ele, style, val) {
    // val = val.replace(/(\(|\))/g, "");
	//simple css calc function polyfill
	//polyfill expects surrounded by brackets <val><unit> <operator> <val><unit> => "33% - 20px + 1em"
    //does not support things like "50%/3 - 5px"
	if(Browser.Features.calc) {
		$ele.setStyle(style, Browser.Features.calc + "(" + val + ")");
	} else {
        var old = $ele.retrieve("calc");
        if(old) window.removeEvent("resize", old);
		var split = val.split(" ");
		split.splice(1, 1); //first operator
        var resize = function() {
            var expr = val.replace(/(\d+)(\S+)/g, function(match, size, unit) {
                size = size.toFloat();
                switch (unit) {//unit
                    case "%":
                        var data = {};
                        var dir = style.contains("width") ? "x" : "y";
                        data[dir] = size;
                        return util.percentToPixel(data, $ele.getParent())[dir].round(3);
                    case "em":
                        var fsize = $ele.getStyle("font-size").toFloat();
                        return fsize * size;
                    // case "px":
                    default:
                        return size;
                }
            });
            /* jshint evil:true */
            var size = _.exec(expr); //safe usage - evals "500-20+12" for example
            $ele.setStyle(style, size);
            return resize;
        };
        window.addEvent("resize", resize);
        $ele.store("calc", resize);
        return resize();
	}
};
  
util.elementAtScrollPos = function($ele, pos, dir, offset) {
    dir = (dir || "width").capitalize();
    offset = offset || 10;
    var $res = $ele.lastChild;
    _.some($ele.childNodes, function($kid) {
        offset += $kid["get" + dir]();
        if(offset >= pos) {
            $res = $kid;
            return true;
        }
    });
    return $res;
};

(function() {
    var GRID_SIZE = 12;//grid cols sum to this num
    var grid_re = /(col\-\w+\-)(\d+)/g;
    /*
    * items is an array of objects
    * fill: bool, - take remaining rows first comefirst serve
    * cols: space seperated column classes
    * element: ele in question
    */
    util.createGrid = function(items) {
        var cols = {};
        var expando;

        items.each(function(item) {
            var $e = util.removeGrid(item.element);
            
            if(item.fill) {
                expando = item;//dont set grid cols for this ele
            }
            if(item.cols) {
                item.cols.replace(grid_re, function(match, type, num) {//[match, type, size]
                    $e.addClass(match);
                    cols[type] = (cols[type] || 0) + num.toInt();
                });
            }
        });

        if(expando) {
            _.each(cols, function(taken, col) {
                var size = (GRID_SIZE - taken);
                if(!new RegExp("^" + col).test(expando.element.get("class"))) {
                    expando.element.addClass(col + (size > 0 ? size : GRID_SIZE));//new row if <= 0
                }
            });
        }
    };

    util.resetGrid = function($e) {
        return $e.addClass($e.get("data-col")); //set default grid again
    };

    util.removeGrid = function($e) {
        return $e.set("class", $e.get("class").replace(grid_re, ""));//remove old classes
    };
})();
