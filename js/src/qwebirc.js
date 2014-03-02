/**
 * qwebirc -- Copyright (C) 2008-2011 Chris Porter and the qwebirc project --- All rights reserved.
 *
 * @provides [qwebirc, irc, util, config, auth, ui, components, cookies, sound, lang, windowNames, templates, constants]
 */

//wrapped in iife during grunt build
/* jshint globalstrict:true */
var DEBUG = "<%= build.debug %>" === true; //will be removed as dead code if false

//cache common globals in scope
var $ = document.id,
    $$ = document.getElements,
    Class = window.Class,
    Options = window.Options,
    Events = window.Events,
    _ = window._,
    Epitome = window.Epitome;


//global object
var qwebirc = window.qwebirc = _.merge(window.qwebirc || {}, {
    irc: {},
    ui: {},
    util: {},
    components: {},
    global: {
        dynamicBaseURL: "/",
        staticBaseURL: "/"
    },
    config: {},
    auth: {
        loggedin: false,
        enabled: false,

        passAuth: Function.from(true),
        bouncerAuth: Function.from(false)
    },
    sound: {},
    lang: {
        windowNames: {}
    },
    constants: {},
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

    config = qwebirc.config,
    auth = qwebirc.auth,

    ui = qwebirc.ui,
    components = qwebirc.comp = qwebirc.components,

    cookies = qwebirc.cookies,

    sound = qwebirc.sound,

    lang = qwebirc.lang,
    windowNames = lang.windowNames,

    templates = qwebirc.templates,

    constants = qwebirc.constants;

//promises indicating qwebirc is ready to load
var readyPromises = [];