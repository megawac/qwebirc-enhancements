(function() {
    function validate($ele, validators) {
        if(_.isEmpty(validators)) return;
        var text = $ele.val();
        var failed = _.find(validators, function(validator) {
            return !validator.test(text, $ele);
        });
        var failbool = !!failed;
        var controlpar = $ele.getParent('.control-group')
                            .toggleClass('has-error', failbool);
        if (failbool) {
            getTemplate("failed-validator", function(template) {
                Elements.from(template(failed)).inject(controlpar);
                // $ele.focus();
            });
        } else {
            controlpar.getElements('.help-block').dispose();
        }
        return !failed;
    }


var LoginBox = function(parentElement, callback, initialNickname, initialChannels, networkName, validators) {
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

        $form.addEvents({
            "blur:relay([data-validate])": function(e, target) {
                validate(target, validators[target.get("data-validate")]);
            }
        });

        $chkAddAuth.addEvent('click', function () {
            $form.getElements('[name="full"]').getParent('div').toggle();
        });

        $form.addEvent("submit", function(e) {
            e.stop();

            if(!validate($nickBox, validators.nick) ||
                    !validate($usernameBox, validators.username) ||
                    !validate($passwordBox, validators.password)) {
                return;
            }

            var nickname = $nickBox.val();

            /****
            * Valid*
            ****/

            var data = {
                "nickname": nickname
            };

            _nick.set(nickname);// nicks valid

            if ($chkAddAuth.val() || auth.enabled) {
                data.username = username = $usernameBox.val();
                data.realname = username || "";
                data.password = password = $passwordBox.val();

                if (auth.bouncerAuth()) {
                    data.serverPassword = password;
                }
                else if(auth.passAuth()){
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
        this.LoginBox(win.lines, callback, initialNickname, initialChannels, network || this.options.networkName, this.options.validators);
        return win;
    }
});
})();
