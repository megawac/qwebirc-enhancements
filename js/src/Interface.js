/**
 * Creates an instance of Qwebirc. Start of the road
 * Default config will be extended by whatever settings are given in app.js
 *
 * @depends [qwebirc, util/utils, config/Settings]
 * @depends [ui/QUI, ui/Theme, irc/Client]
 */
var DEFAULT_QWEBIRC_CONFIG = {
    appTitle: "" /* Quake Net Web IRC */,
    networkName: "" /* Quake Net */,

    validators: { //test is a helper from ircutils
        nick: [{
            test: util.test(/^[\s\S]{1,30}$/), //30 to 31 characters is an IRCd standard. Worse to worse, the ircd will reject.
            description: lang.getFormatter("nickWrongLen", {min: 1, max: 30})
        }],
        password: [{
            test: function(pass, $ele) {
                return pass || !$ele.isVisible();
            },
            description: lang.getter("missingPass")
        }],
        username: [{
            test: function(user, $ele) {
                return user || !$ele.isVisible();
            },
            description: lang.getter("missingNick")
        }]
    },
    parseQueryString: true,

    uiOptions: {/*see config/options.js*/},
    settings: {/*see config/settings.js*/},
    client: {/*see irc/IRCClient.js*/}
};

// createInstance: (element|str id), [qwebircUI], options -> qwebirc instance
qwebirc.createInstance = function(element_id, UIclass, options) {
    if(!options) {
        options = UIclass;
        UIclass = ui.QUI;
    }
    options = _.merge({}, DEFAULT_QWEBIRC_CONFIG, options);
    var settings = options.settings = new config.Settings({}, {
        defaults: options.settings
    });
    
    //parse query string
    // it will override any non cached (localstorage/cookie) options for uiOptions and settings
    //so ?nickname=test&style_saturation=30 will set the saturation to 30 and the initial nickname to test
    var query = window.location.search;
    if(query && options.parseQueryString) {
        var parsed = query.slice(1).parseQueryString();

        if(parsed.channels) {//append query string channels to saved channels
            parsed.channels = util.concatUnique(settings.get("channels"), util.unformatChannelString(parsed.channels));
        }

        softextend(parsed, options.uiOptions = _.merge({}, ui["default options"], options.uiOptions));
        softextend(parsed, options.client);
        softextend(parsed, options.settings._attributes);//poor practice
    }

    //create instance
    var instance = new UIclass(element_id, options); //unconventional naming scheme
    instance.addEvents({
        "ready:once": function() {
            instance.loginBox();
            //cleans up old properties
            if(settings.get("newb")) {
                instance.welcome();
                settings.set("newb", false);
            }
        },
        "login:once": function(loginopts) {
            var ircopts = _.extend({settings: settings, uiOptions: instance.uiOptions}, loginopts, options.client);

            var client = new irc.Client(ircopts);
            instance.newClient(client);
            client.connect();
            window.onbeforeunload = function(e) {
                if (client.isConnected()) { //has gotten passed the IRC gate
                    e = e || window.event;
                    e.preventDefault();
                    e.returnValue = lang.dontLeave; //legacy ie
                    return lang.dontLeave;
                }
            };
            window.addEvent("unload", client.quit);
        }
    });

    return instance;
};

function softextend(origin, obj) {//only sets vals if they exist on the object
    _.each(origin, function(val, key) {
        if(_.has(obj, key)) {
            obj[key] = +val == val ? +val : val;//coerce nums
        }
    });
}
