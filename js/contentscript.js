(function() {
    var blocked = [];

    //http://stackoverflow.com/questions/3032721/async-load-javascript-files-with-callback/3211647#3211647
    var Loader = function () {};
    Loader.prototype = {
        load: function(element, cb) {
            if(cb)
                element.addEventListener('load', cb, false);
            document.head.appendChild(element);
        },

        loadCSS: function(sty, cb) {
            var link;
            if(typeof sty === "string") {
                link = document.createElement('link');
                link.href = sty;
            } else {
                link = sty;
            }
            link.rel = "stylesheet";
            return this.load(link, cb);
        },
        loadStyle: function(sty, cb) {
            var link;
            if(typeof sty === "string") {
                link = document.createElement('style');
                link.innerHTML = sty;
            } else {
                link = sty;
            }
            link.rel = "stylesheet";
            return this.load(link, cb);
        },
        loadScript: function(src, cb) {
            var s = document.createElement('script');
            s.src = src;
            return this.load(s, cb);
        },
        loadInlineScript: function(script, callback) {
            var s;
            if(typeof script === "string") {
                s = document.createElement('script');
                s.innerHTML = script;
            } else {
                s = script;
            }
            return this.load(s, callback);
        }
    };

    var ready = false;
    document.addEventListener('beforeload', doBeforeLoad, true);
    document.addEventListener('DOMContentLoaded', domReady, true);

    function doBeforeLoad(event){//blocks first script which should be qwebirc
        var src = event.srcElement;
        if(ready)
            document.removeEventListener( "beforeload", doBeforeLoad, false );
        else if ((src.tagName=="SCRIPT" && src.src) || (src.tagName === "LINK" && src.rel === "stylesheet")) { // && event.srcElement.src=='test.js'
            src.name='deleted';
            event.preventDefault();
            blocked.push(src);
            // 
        }
    }

    //im sorry.
    function domReady() {
        ready = true;
        // var qwebirc = document.head.getElementsByTagName('script')[0],//qwebirc script
        var head = document.head,

            loader = new Loader(),

            // guistyle= document.createElement('link'),
            // gui = document.createElement('script'),

            // moo = document.createElement('script'),

            // engine = document.createElement('script'),
            // Templates = document.createElement('script'),

            // mediator = document.createElement('script'), //switch to mootool events if cinq allows changes to source
            // options = document.createElement('script'),
            //qweb=document.createElement('script'),//.cloneNode doesnt make the blocked fire on append... not sure why
            scripts = document.getElementsByTagName('script'),
            init = scripts[scripts.length -1].innerHTML;//script for loading interface from atf2.org
            // startup = document.createElement('script'),

            // icons = document.createElement('style');

        // guistyle.rel = "stylesheet";
        // guistyle.href = chrome.extension.getURL('css/tfircgui.css');

        loader.loadCSS(chrome.extension.getURL('css/bootstrap.css'));
        // loader.loadCSS(chrome.extension.getURL('css/tfircgui.css'));
        loader.loadCSS(chrome.extension.getURL('css/qwebirc.css'));

        // icons.rel = "stylesheet";
        // icons.innerHTML = makeicons();

        loader.loadCSS(chrome.extension.getURL('css/jqueryui_icons.css'));
        // loader.loadStyle(makeicons());

        // engine.src = chrome.extension.getURL('js/Handlebars.js');
        // Templates.src = chrome.extension.getURL('js/src/Templates.js');
        // moo.src = chrome.extension.getURL('js/mootools.min.js');
        // gui.src = chrome.extension.getURL('js/src/ircgui.js');
        // mediator.src = chrome.extension.getURL('js/mediator.js');
        // hack.src = chrome.extension.getURL('js/hacks.js');

        // options.innerHTML = makeOptions();

        loader.loadInlineScript(makeOptions());

        //qweb.src = blocked[0].src;
        // startup.innerHTML = init;

        // head.appendChild(guistyle);
        // head.appendChild(icons);
        // head.appendChild(mediator);

        // head.appendChild(options);
        // head.appendChild(engine);
        //............... :(
        // head.appendChild(hack);

        loader.loadScript(chrome.extension.getURL('js/dist/qwebirc-0.93dev.js'), function() {
            // head.appendChild(startup);
            loader.loadInlineScript(init);
        });


        //extension violation if remove and readd...
        // // head.appendChild(blocked[0]);
        // head.appendChild(qweb);
        // head.appendChild(hack);
        // head.appendChild(startup);
        // head.appendChild(ps[0]);

        //qwebirc.insertAdjacentElement('afterend', hack);//has to be inserted before atf2.org init script

        document.removeEventListener( "DOMContentLoaded", arguments.callee, false );
    }

    function makeOptions() {
        var options = ["window.ircoptions = {",
            "stylesheet: '" + chrome.extension.getURL("css/modifiablecss.mcss") + "'",
        "}"].join("");

        return options;
    }
})();