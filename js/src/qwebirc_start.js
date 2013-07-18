/*Copyright (c) 2008-2009 the qwebirc project.
http://www.qwebirc.org/

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
version 2 as published by the Free Software Foundation.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.

Though it is not required, we would appreciate public facing
instances leaving a mention of the original author(s) and the
project name and URL in the about dialog, thanks!*/


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
