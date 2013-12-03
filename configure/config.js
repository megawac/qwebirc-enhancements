/******************************************************************
                    Init config

        To create a new instance call `qwebirc.createInstance([element or id], [ui class (eg qui)], options)

        The configurable options are shown in: https://github.com/megawac/qwebirc-enhancements/blob/master/js/src/ui/Interface.js#L2

        settings (eg nick) are here: https://github.com/megawac/qwebirc-enhancements/blob/master/js/src/config/settings.js#L6

        uiOptions are here: https://github.com/megawac/qwebirc-enhancements/blob/master/js/src/config/options.js#L3

        IRC client options are here: https://github.com/megawac/qwebirc-enhancements/blob/master/js/src/irc/ircclient.js#L5

        You can also make custom changes here such as adjusting the servers commands (eg auth)


        This file will be minified and moved to js/dist/app-version.js on build

******************************************************************/

this.app = qwebirc.createInstance("ircui", qwebirc.ui.QUI, {
    "appTitle": "",//eg Freenode WebIRC
    "networkName": "",//eg Freenode
    "debug": false,
    "settings": {
        //channels: []
        "auth": false
    },
    "uiOptions": {/* eg style_saturation:50 */},
    "client": {
        "loginRegex": /^I recogni[sz]e you/, //authed when irc service sends this string
        "node": false,
        "networkServices": [ /* network hosts ie Services.Quakenet.net */ ],
    }
});

// qwebirc.config.IRC_COMMANDS.AUTH.command = "/msg AUTHServ :identify {username} {password}";