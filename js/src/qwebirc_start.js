//memory consumption will be much lower after handlebars templates are precompiled and unused functional helpers are removed
; (function(par, undefined) {
    "use strict";

    //init crap
    var DEBUG = true;

    //common globals
    var window = par,
        document = par.document,
        $ = document.id,
        Functional = par.Functional,
        prelude = par.prelude;

    /* qwebirc -- Copyright (C) 2008-2011 Chris Porter and the qwebirc project --- All rights reserved. */

    par.QWEBIRC_BUILD="bbc577ad5cb78d946ac1";

    //global object
    //var qwebirc = par.qwebirc = {ui: {themes: {}, style: {}}, irc: {}, util: {crypto: {}}, config: {}, auth: {}, sound: {}};

    var qwebirc = par.qwebirc = {},

        irc = qwebirc.irc = {},

        util = qwebirc.util = {},
        crypto = util.crypto = {},

        config = qwebirc.config = {},
        auth = qwebirc.auth = {},

        ui = qwebirc.ui = {},
        themes = ui.themes = {},
        style = ui.style = {},

        sound = qwebirc.sound = {},//,

        lang;// = qwebirc.lang;

    qwebirc.BUILD = QWEBIRC_BUILD;
    qwebirc.FILE_SUFFIX = "-" + QWEBIRC_BUILD;
    qwebirc.VERSION = "0.93-dev";
