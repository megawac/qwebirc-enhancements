/* qwebirc -- Copyright (C) 2008-2011 Chris Porter and the qwebirc project --- All rights reserved. */
; (function(window, Epitome, undefined) {
    "use strict";
    var DEBUG = false;

    //common globals
    var document = window.document,
        $ = document.id,
        $$ = document.getElements;


    //global object
    var qwebirc = window.qwebirc = _.merge(window.qwebirc || {}, {
        irc: {},
        ui: {
            themes: {}
        },
        util: {
            crypto: {}
        },
        global: {
            dynamicBaseURL: "/",
            staticBaseURL: "/"
        },
        config: {},
        auth: {},
        sound: {},
        lang: {},
        templates: {},
        cookies: {
            "options": "qweb-options",
            "history": "qweb-hist",
            "settings": "qweb-settings"
        },
        VERSION: "<%= pkg.version %>"
    });

    var irc = qwebirc.irc,

        util = qwebirc.util,
        crypto = util.crypto,

        config = qwebirc.config,
        auth = qwebirc.auth,

        ui = qwebirc.ui,
        themes = ui.themes,
        style = ui.style,

        cookies = qwebirc.cookies,

        sound = qwebirc.sound,

        lang = qwebirc.lang,

        templates = qwebirc.templates;
