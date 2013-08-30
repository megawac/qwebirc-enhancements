
ui.StandardUI.implement({
    loginBox: function(initialNickname, initialChannels, autoConnect, autoNick, network) {
        this.postInitialize();
        var self = this;
        var win = this.newCustomWindow(CONNECTION_DETAILS, true, ui.WINDOW_CONNECT);
        var callback = function(data) {
                win.close();
                self.fireEvent("login", data);
            };
        ui.GenericLoginBox(win.lines, callback, initialNickname, initialChannels, autoConnect, autoNick, network || this.options.networkName);
        return win;
    }
});


ui.GenericLoginBox = function(parentElement, callback, initialNickname, initialChannels, autoConnect, autoNick, networkName) {
    ui.LoginBox(parentElement, callback, initialNickname, initialChannels, networkName);
};

ui.LoginBox = function(parentElement, callback, initialNickname, initialChannels, networkName) {
    var cookies = {
        nick: new Storer("nickname"),//initial nick
        user: new Storer("gamesurge"),//auth username
        pass: new Storer("password"),//auth password
        auth: new Storer("enableAuth")//enable full auth
    }
    var nickname = cookies.nick.get() || initialNickname,
        username = Base64.decode(cookies.user.get()),
        password = Base64.decode(cookies.pass.get()),
        eauth = auth.enabled || cookies.auth.get();

    

    var page = Element.from(templates.authpage({
        'network': networkName,
        'nickname': nickname,
        'username': username,
        'password': password,
        'full': eauth, //whether to show the extra auth options (check the checkbox)
        'channels': initialChannels.join()
    })).inject(parentElement);

    var form = page.getElement('#login'),
        nickBox = page.getElement('#nickname'),
        usernameBox = page.getElement('#username'),
        passwordBox = page.getElement('#password'),
        chkAddAuth = page.getElement('#authenticate');

    chkAddAuth.addEvent('click', function () {
        form.getElements('[name="full"]').getParent('div').toggle();
    });

    form.addEvent("submit", function(e) {
        e.stop();

        var nickname = nickBox.val();

        //validate nick
        if (!nickname) {
            alert(lang.missingNick);
            nickBox.focus();
            return;
        }
        var stripped = qwebirc.global.nicknameValidator.validate(nickname);
        if (stripped !== nickname) {
            nickBox.val(stripped);
            alert(lang.invalidNick);
            nickBox.focus();
            return;
        }

        var data = {
            "nickname": nickname
        };

        cookies.nick.set(nickname);

        if (chkAddAuth.checked || auth.enabled) {//disabled
            // we're valid - good to go
            data.username = username = usernameBox.val();
            data.realname = storage.get("realname") || username || "";
            data.password = password = passwordBox.val();
            if (auth.bouncerAuth()) {
                if (!$chk(password)) {
                    alert(lang.missingPass);
                    passwordBox.focus();
                    return;
                }

                data.serverPassword = password;
            }
            if (!username || !password) {
                alert(lang.missingAuthInfo);
                if (!$chk(username)) {
                    usernameBox.focus();
                } else {
                    passwordBox.focus();
                }
                return;
            } else {
                if(auth.passAuth()){
                    data.serverPassword = username + " " + password;
                }

            }

            cookies.user.set(Base64.encode(username));
            cookies.pass.set(Base64.encode(password));
            cookies.auth.set(true);
            auth.enabled = true;
        } else {
            cookies.auth.dispose();
        }


        parentElement.empty();

        auth.loggedin = true;

        callback(data);
    });

    if (window === window.top) nickBox.focus();
};
