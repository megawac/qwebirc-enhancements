ui.Behaviour = (function() {
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
    if(!_.isFunction(cb)) {
        cb = util.noop;
    }
    if(_.isFunction(name)) {
        cb(name);//assume identity
    }
    else if(_.has(templates, name)) {
        cb(_.lookup(templates, name));
    }
    else {
        var path = options && options.path || "js/templates/",
            file = options && options.file || name,
            type = options && options.type || ".js",
            $script;
        if(!path.endsWith("/")) path += "/";
        if(!type.startsWith(".")) type = "." + type;
        $script = Asset.javascript(path + file + type, {onLoad: function() {
            cb(_.lookup(templates, name));
            $script.dispose();
        }});
        //$script.addEvent("error", ..now what?)
    }
    //return deferred
};
  
util.loadTemplate = function(name) {//helper to preload a template
    var template;
    getTemplate(name, function(tmpl) {template = tmpl});
    return function() {return template.apply(this, arguments);};
}
  
ui.setTitle = function(title, options) {
    document.title = title;
};
  
util.setCaretPos = Element.setCaretPosition;
  
util.setAtEnd = function($el) {
    $el.setCaretPosition($el.value.length);
};
  
util.getCaretPos = Element.getCaretPosition;
  
util.wrapSelected = function($eles, wrap) {
    $eles = $$($eles);
  
    var start = Array.isArray(wrap) ? wrap[0] : wrap,
        end = Array.isArray(wrap) ? wrap[1] : wrap;
  
    $eles.each(function($ele) {
        var range = $ele.getSelectedRange();
        if(range.start != range.end) {
            var text = $ele.val();
            $ele.val(text.slice(0, range.start) + start + text.slice(range.start, range.end) + end + text.slice(range.end))
                .setCaretPosition(range.end + start.length + end.length);
        }
    });
}
  
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
            position: {x: 'left', y: 'bottom'},
            edge: {x: 'left', y: 'top'}
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
//dir can be 'width' 'height'
util.fillContainer = function ($ele, options) {
    options = Object.append({style: ['width'], offset: 20}, options);
  
    var filler = function() {
        var size = $ele.getSize();
  
        Array.from( options.style ).each(function(style) {//wait a sec for potential style recalcs
            var method = style.contains('width') ? 'x' : 'y',
                offset = options.offset;
  
            $ele.getSiblings()
                .each(function(sib) {
                    offset += sib.getSize()[method];
                });
  
            util.calc($ele, style, "100% - " + offset + "px");
        });
    }
  
    _.delay(filler, 20);
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
            var $el = new Element('div', {
                styles: {
                    width: prefix + "calc(5px)"
                }
            });
            if ($el.style.length > 0) return Browser.Features.calc = prefix + "calc";
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
        if(old) {window.removeEvent("resize", old);}
		var split = val.split(" ");
		var op = split.splice(1,1);
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
            var size = eval(expr);//safe usage - evals '500-20+12' for example
            $ele.setStyle(style, size);
            return resize;
        };
        window.addEvent("resize", resize);
        $ele.store("calc", resize);
        return resize();
	}
};
  
util.elementAtScrollPos = function($ele, pos, dir, offset) {
    dir = (dir || 'width').capitalize();
    offset = offset || 10;
    var $res = $ele.lastChild;
    Array.some($ele.childNodes, function($kid) {
        offset += $kid['get' + dir]();
        if(offset >= pos) {
            $res = $kid;
            return true;
        }
    });
    return $res;
}; 