// <% if(pkg.build["atheme"]) { %> only include this code if "atheme" set in package.json
/*!
* Custom query code credit to Atheme (https://github.com/atheme) for the iris project (https://github.com/atheme/iris)
* Copyright (c) 2005-2013 Atheme Project (http://www.atheme.org)
* @depends [irc, util/utils]
* @provides atheme
*/
irc.atheme = {
    /**
     * Build a generic request to Atheme.
     *
     * \param command The command being requested.
     */
    cacheAvoidance: util.randHexString(16),
    newRequest: function(command, data) {
        /* eg New login request. */
        return new Request.JSON({
            url: qwebirc.global.dynamicBaseURL + "a/" + command + "?req=" + irc.atheme.cacheAvoidance,
            data: data
        }).send();
    },
    /**
     * Login to Atheme, getting an authentication token.
     * Callback signature is callback(token), where token is an authentication
     * token for later requests, the empty string to indicate authentication
     * failure, or null to indicate connection failure.
     *
     * \param callback Function to call to inform of results.
     * \param user Username as string.
     * \param pass Password as string.
     */
    login: function(callback, user, pass) {
        return irc.atheme.newRequest("l", {
            u: user,
            p: pass
        })
        .then(function(json) {
            if (json) {
                if (json.success)
                    callback(json.output);
                else
                    callback("");
            } else {
                callback(null);
            }
        }, function(/*xhr*/) {
            callback(null);
        });
    },
    /**
     * Logs out, invalidating an authentication token.
     * Callback signature is callback(removed), where valid is true to indicate
     * successful removal, or the token already being invalid, or null to
     * indicate a connection failure removing it.
     *
     * \param callback Function to call to inform of results.
     * \param user Username as string.
     * \param token Token as string.
     */
    logout: function(callback, user, token) {
        return irc.atheme.newRequest("o", {
            u: user,
            t: token
        })
        .then(function(json) {
            callback(json ? true : null);
        }, function(/*xhr*/) {
            callback(null);
        });
    },
    /**
     * Checks whether an authentication token is valid.
     * Can't be used before a command as an alternative to dealing with failure,
     * as the token can expire between this check and the command, but can be
     * used to decide whether to even prompt the user to login.
     * Callback signature is callback(valid), where valid is either true, false,
     * or null to indicate connection failure.
     *
     * \param callback Function to call to inform of results.
     * \param user Username as string.
     * \param token Token as string.
     */
    checkLogin: function(callback, user, token) {
        return irc.atheme.newRequest("c", {
            u: user,
            t: token,
            s: "NickServ",
            c: "INFO",
            p: user
        })
        .then(function(json) {
            callback(json ? json.success : null);
        }, function(/*xhr*/) {
            callback(null);
        });
    },
    /**
     * Retrieves a channel list.
     * Callback signature is callback(channels, timestamp, more), where channel is
     * null toindicate connection failure, or a list of channel objects, each with
     * "name", "users", and "topic" entries, timestamp is the time this list was
     * retrieved from Atheme, and more is a boolean indicating whether there were
     * more channels to display.
     *
     * \param callback Function to call to inform of results.
     * \param timestamp A list timestamp to request, or 0 for now.
     * \param limit The maximum number of channels to show.
     * \param page The multiple of limit to start at.
     * \param chanmask A channel mask to filter on.
     * \param topicmask A topic mask to filter on.
     */

    channelList: function(callback, timestamp, limit, page, chanmask, topicmask) {
        return irc.atheme.newRequest("li", {
            s: limit * (page - 1),
            l: limit,
            t: timestamp,
            cm: chanmask && chanmask != "*" ? chanmask : undefined,
            tm: topicmask && topicmask != "*" ? topicmask : undefined
        })
        .then(function(json) {
            if (json && json.success) {
                callback(json.list, json.ts, json.total);
            } else {
                callback([], 1, 0);
            }
        }, function(/*xhr*/) {
            callback(null, 1, 1);
        });
    }
};
//<% } %>