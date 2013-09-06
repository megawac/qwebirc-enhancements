(function() {
var LoginBox = function(parentElement, callback, initialNickname, initialChannels, networkName) {
    var Base64 = window.Base64;
    var _nick = new Storer(cookies.nickname),//initial nick
        _user = new Storer(cookies.username),//auth username
        _pass = new Storer(cookies.password),//auth password
        _auth = new Storer(cookies.auth);//enable full auth
    var nickname = _nick.get() || initialNickname,
        username = Base64.decode(_user.get()),
        password = Base64.decode(_pass.get()),
        eauth = auth.enabled || _auth.get();

    getTemplate("authpage", function(template) {
        var page = Element.from(template({
            'network': networkName,
            'nickname': nickname,
            'username': username,
            'password': password,
            'full': eauth, //whether to show the extra auth options (check the checkbox)
            'channels': initialChannels.join()
        })).inject(parentElement);

        var $form = page.getElement('#login'),
            $nickBox = page.getElement('#nickname'),
            $usernameBox = page.getElement('#username'),
            $passwordBox = page.getElement('#password'),
            $chkAddAuth = page.getElement('#authenticate');

        $chkAddAuth.addEvent('click', function () {
            $form.getElements('[name="full"]').getParent('div').toggle();
        });

        $form.addEvent("submit", function(e) {
            e.stop();

            var nickname = $nickBox.val();

            //validate nick
            if (!nickname) {
                new ui.Alert({
                    text: lang.missingNick,
                    onClose: $nickBox.focus.bind($nickBox)
                });
                return;
            }
            var stripped = qwebirc.global.nicknameValidator.validate(nickname);
            if (stripped !== nickname) {
                $nickBox.val(stripped);
                new ui.Alert({
                    text: lang.invalidNick,
                    onClose: $nickBox.focus.bind($nickBox)
                });
                return;
            }

            var data = {
                "nickname": nickname
            };

            _nick.set(nickname);// nicks valid

            if ($chkAddAuth.val() || auth.enabled) {
                data.username = username = $usernameBox.val();
                data.realname = username || "";
                data.password = password = $passwordBox.val();
                if (auth.bouncerAuth()) {
                    if (!$chk(password)) {
                        new ui.Alert({
                            text: lang.missingPass,
                            onClose: $passwordBox.focus.bind($passwordBox)
                        });
                        return;
                    }
                    data.serverPassword = password;
                }
                if (!username || !password) {
                    new ui.Alert({
                        text: lang.missingAuthInfo,
                        onClose: function() {
                            if (!$chk(username)) {
                                $usernameBox.focus();
                            } else {
                                $passwordBox.focus();
                            }
                        }
                    });                    
                    return;
                } else if(auth.passAuth()){
                    data.serverPassword = username + " " + password;
                }

                _user.set(Base64.encode(username));
                _pass.set(Base64.encode(password));
                _auth.set(true);
                auth.enabled = true;
            } else {
                _auth.dispose();
            }

            parentElement.empty();

            auth.loggedin = true;

            callback(data);
        });

        if (window === window.top) $nickBox.focus();

        ui.Behaviour.apply(page);
    });
};

ui.ILogin = new Class({
    Implements: [Events],
    LoginBox: LoginBox,
    loginBox: function(initialNickname, initialChannels, autoConnect, autoNick, network) {
        this.postInitialize();
        var self = this;
        var win = this.newCustomWindow(CONNECTION_DETAILS, true, ui.WINDOW.connect);
        var callback = function(data) {
                win.close();
                self.fireEvent("login", data);
            };
        this.LoginBox(win.lines, callback, initialNickname, initialChannels, network || this.options.networkName);
        return win;
    }
});
})();
