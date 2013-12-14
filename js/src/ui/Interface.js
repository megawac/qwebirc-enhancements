
var defaults = {
    debug: false,

    appTitle: ""/*Quake Net Web IRC*/,
    networkName: "" /* Quake Net */,

    validators: {//test is a helper from ircutils
        nick: [{
            test: util.test(/^[\s\S]{1,9}$/),//max 9 by spec some servers implement different rules
            description: "Nick must be between 1 and 9 characters"
        }],
        password: [{
            test: function(pass, $ele) {
                return pass.length > 0 || !$ele.isVisible();
            },
            description: "Missing password"
        }],
        username: [{
            test: function(pass, $ele) {
                return pass.length > 0 || !$ele.isVisible();
            },
            description: "Missing username"
        }]
    },
    theme: undefined,
    parseQueryString: true,

    uiOptions: {/*see config/options.js*/},
    settings: {/*see config/settings.js*/},
    client: {/*see irc/IRCClient.js*/
        networkServices: [],//registered hosts to treat as a server admin eg ["Services.Quakenet.net"]
        // minRejoinTime: [5, 20, 300], //array - secs between consecutive joins to a single channel - see js/src/irc/ircclient@canjoinchan
        loginRegex: /I recogni[sz]e you\./,//network service response when auth successful
        node: false
    }
};

qwebirc.createInstance = function(element_id, UIclass, options) {
    options = _.merge({}, defaults, options);
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

        var softextend = function(obj) {//only sets vals if they exist on the object
            _.each(parsed, function(val, key) {
                if(_.has(obj, key)) {
                    obj[key] = +val == val ? +val : val;//coerce nums
                }
            });
        };

        softextend(options.uiOptions = _.merge({}, ui["default options"], options.uiOptions));
        softextend(options.client);
        softextend(options.settings._attributes);//poor practice
    }

    //create instance
    var instance = new UIclass(element_id, new ui.Theme(options.theme), options); //unconventional naming scheme
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
            var ircopts = _.extend({settings: settings, uiOptions: instance.uiOptions}, options.client, loginopts);

            var client = new irc.IRCClient(ircopts);
            instance.newClient(client);
            client.writeMessages(lang.copyright);
            client.connect();
            client.addEvent("auth", function(data) {
                instance.showNotice({
                    title: "Authenticated with network!",
                    body: util.format("{nick}: {message}", data)
                }, true);
            });
            window.onbeforeunload = function(e) {
                if (client.isConnected()) {//has gotten passed the IRC gate
                    e = e || window.event;
                    e.preventDefault = true;
                    var message = "This action will close all active IRC connections.";
                    e.returnValue = message;//legacy ie
                    return message;
                }
            };
            window.addEvent("unload", client.quit);
        }
    });

    return instance;
};
