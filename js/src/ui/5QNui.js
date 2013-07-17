
ui.QuakeNetUI = new Class({
    Extends: ui.NewLoginUI,
    urlDispatcher: function(name, window) {
        if (name == "qwhois") {
            return ["span", function(auth) {
                this.client.exec("/MSG Q whois #" + auth);
            }.bind(window)];
        }
        return this.parent(name, window);
    },
    logout: function() {
        if (!auth.loggedin)
            return;
        if (confirm("Log out?")) {
            Object.each(this.clients, function(client) {
                client.quit(lang.logOut.message);
            });

            (function() {
                document.location = qwebirc.global.dynamicBaseURL + "auth?logout=1";
            }).delay(500);
        }
    }
});
