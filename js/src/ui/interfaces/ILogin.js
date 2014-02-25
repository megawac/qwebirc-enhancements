/**
 * Login page
 *
 * @depends [panes/Welcome, components/Popups, util/utils, util/utils]
 * @provides [ui/ILogin]
 */
(function() {
    function validate($ele, validators) {
        if(_.isEmpty(validators)) return;
        var text = $ele.val();
        var failed = _.find(validators, function(validator) {
            return !validator.test(text, $ele);
        });
        var failbool = !!failed;
        var $controlpar = $ele.getParent(".control-group")
                            .toggleClass("has-error", failbool);
        if (failbool) {
            if($controlpar.getElements(".help-block").filter(function(ele) {return ele.html() === failed.description}).length === 0) {
                getTemplate("failed-validator", function(template) {
                    Elements.from(template(failed)).inject($controlpar);
                    // $ele.focus();
                });
            }
        } else {
            $controlpar.getElements(".help-block").dispose();
        }
        return !failed;
    }

    var LoginBox = function(parentElement, callback, settings, networkName, validators) {
        var nickname = settings.get("nickname"),
            username = settings.get("username"),//clientside no need for more advanced
            password = settings.get("password"),
            eauth = auth.enabled || settings.get("auth");

        var formatChans = util.formatChannelString;

        getTemplate("authpage", function(template) {
            var $page = Element.from(template({
                "network": networkName,
                "nickname": nickname,
                "username": username,
                "password": password,
                "full": eauth, //whether to show the extra auth options (check the checkbox)
                "channels": formatChans(settings.get("channels"))
            })).inject(parentElement);

            var $form = $page.getElement(".login"),
                $nickBox = $page.getElement("#nickname"),
                $usernameBox = $page.getElement("#username"),
                $passwordBox = $page.getElement("#password"),
                $chkAddAuth = $page.getElement("#authenticate"),
                $chans = $page.getElement(".init-channels");

            $page.addEvents({
                "blur:relay([data-validate])": function(e, target) {
                    validate(target, validators[target.get("data-validate")]);
                }
            });
            $chans.addEvent("dblclick", function() {
                new components.Dialog({
                    title: lang.setChanTitle,
                    text: lang.setChanDialog,
                    value: $chans.text(),
                    onSubmit: function(data) {
                        if(_.isString(data.value)) {
                            data = formatChans(data.value);
                            settings.set("channels", util.splitChans(data));
                        }
                    }
                });
            });

            settings.on("change:channels", function(chans) {
                $chans.text(formatChans(chans));
            });

            function updateChans() {
                $form.getElements("[name='full']").getParent("div").toggle();
            }

            $chkAddAuth.addEvent("click", updateChans);

            $form.addEvent("submit", function(e) {
                e.stop();

                settings.off("change:channels", updateChans);

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

                settings.set("nickname", nickname);// nicks valid

                if (auth.enabled || $chkAddAuth.val()) {
                    data.username = username = $usernameBox.val();
                    data.realname = username || "";
                    data.password = password = $passwordBox.val();

                    if (auth.bouncerAuth()) {
                        data.serverPassword = password;
                    }
                    else if(auth.passAuth()){
                        data.serverPassword = username + " " + password;
                    }

                    settings.set("username", username);
                    settings.set("password", password);
                    settings.set("auth", true);
                    auth.enabled = true;
                } else {
                    settings.unset("auth");
                }

                parentElement.empty();

                auth.loggedin = true;

                callback(data);
            });

            if (window === window.top) $nickBox.focus();

            ui.Behaviour.apply($page);
        });
    };

    ui.ILogin = new Class({
        Implements: [Events],
        LoginBox: LoginBox,
        loginBox: function() {
            var self = this;
            var win = this.newCustomWindow(windowNames.login, true, ui.WINDOW.connect);
            var callback = function(data) {
                win.close();
                self.fireEvent("login", data);
            };
            this.LoginBox(win.lines, callback, this.options.settings, this.options.networkName, this.options.validators);
            return win;
        },
        welcome: function() {
            ui.WelcomePane.show(this, _.extend({
                element: this.element,
                firstvisit: this.settings.get("newb")
            }, this.options));
        }
    });
})();
