/**
 * Home of future localization.... Its gonna be a rough road...
 * todo request local.json and ready qwebirc only after its loaded
 *
 * @depend [qwebirc]
 * @provides [lang, util/lang]
 */

/* global readyPromises */

_.extend(lang, {
    TYPES: {
        ERROR: 0,
        INFO: 1,
        SERVER: 2,
        CHAN: 3,
        MESSAGE: 4
    }
});


lang.getter = function(prop) {
    return function() {
        return lang[prop];
    };
};

lang.getFormatter = function(prop, data) {
    return function() {
        return util.format(lang[prop], data);
    };
};

lang.load = function(item) {
    return new Request.JSON({
        url: qwebirc.global.dynamicBaseURL + "lang",
        method: "GET"
    }).send(item ? "path=" + encodeURIComponent(item) : "")
    .then(function(json) {
        _.merge(lang, json);
        return json;
    });
};

var langRequest = lang.load();

langRequest.then(function() {
    //language specific stuff. right now just an object
    // can either be a message or array of messages
    function setLangType(type) {
        return function(prop) {
            if (_.isArray(lang[prop])) {
                lang[prop].type = type;
            } else {
                lang[prop] = {
                    message: lang[prop],
                    type: type
                };
            }
        };
    }

    [
        "poorJoinFormat"
    ].each(setLangType(lang.TYPES.INFO));

    [
        "invalidCommand", "invalidChanTarget", "insufficentArgs",
        "uncontrolledFlood", "connError", "connTimeOut", "connFail"
    ].each(setLangType(lang.TYPES.ERROR));
});

readyPromises.push(langRequest);