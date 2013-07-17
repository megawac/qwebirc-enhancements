
ui.NewLoginUI = new Class({
    Extends: ui.NotificationUI,
    loginBox: function(callbackfn, initialNickname, initialChannels, autoConnect, autoNick, network, storage) {
        this.postInitialize();

        var win = this.newCustomWindow(CONNECTION_DETAILS, true, ui.WINDOW_CONNECT);
        var callback = function() {
                win.close();
                callbackfn.apply(this, arguments);
            };
        ui.GenericLoginBox(win.lines, callback, initialNickname, initialChannels, autoConnect, autoNick, network || this.options.networkName, storage);
    }
});

ui.GenericLoginBox = function(parentElement, callback, initialNickname, initialChannels, autoConnect, autoNick, networkName, storage) {
    if (autoConnect) {
        ui.ConfirmBox(parentElement, callback, initialNickname, initialChannels, autoNick, networkName,storage);
    } else {
        ui.LoginBox(parentElement, callback, initialNickname, initialChannels, networkName,storage);
    }
};

ui.LoginBox = function(parentElement, callback, initialNickname, initialChannels, networkName, cookies) {

    // var outerbox = new Element("div");
    // outerbox.addClass('tf-middle');
    // parentElement.appendChild(outerbox);

    parentElement.addClass('qui-center');
    var content = new Element('div');
    parentElement.appendChild(content);

    var nickname = cookies.nick.get() || initialNickname,
        gamesurge = util.B64.decode(cookies.user.get()),
        password = util.B64.decode(cookies.pass.get()),
        eauth = auth.enabled || cookies.auth.get();

    var context = {
        'network':networkName,
        'nickname':nickname,
        'username':gamesurge,
        'password':password,
        'full': eauth, //whether to show the extra auth options (check the checkbox)
        'channels': initialChannels.join()
    };
    content.html(templates.authpage(context));

    var nickBox = content.getElementById('nickname'),
        usernameBox = content.getElementById('username'),
        passwordBox = content.getElementById('password'),
        chkAddAuth = content.getElementById('authenticate'),
        form = content.getElementById('login'),
        fullForm;


    function toggleFull () {
        fullForm = fullForm || form.getElements('[name="full"]').getParent('div');//moootols returns an array for some stupid reason
        fullForm.each(function(e) {
            e.toggle();
        });
    }

    chkAddAuth.addEvent('click', toggleFull);

    form.addEvent("submit", function(e) {
        e.stop();

        var nickname = nickBox.value;

        //validate nick
        if (!nickname) {
            alert(lang.missingNick);
            nickBox.focus();
            return;
        }
        var stripped = qwebirc.global.nicknameValidator.validate(nickname);
        if (stripped !== nickname) {
            nickBox.value = stripped;
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
            data.gamesurge = gamesurge = usernameBox.value;
            data.password = password = passwordBox.value;
            if (auth.bouncerAuth()) {
                if (!password) {
                    alert(lang.missingPass.message);
                    passwordBox.focus();
                    return;
                }

                data.serverPassword = password;
            }
            if (!gamesurge || !password) {
                alert(lang.missingAuthInfo.message);
                if (!usernameBox.value) {
                    usernameBox.focus();
                } else {
                    passwordBox.focus();
                }
                return;
            } else {
                if(auth.passAuth()){
                    data.serverPassword = gamesurge + " " + password;
                }

            }

            cookies.user.set(util.B64.encode(gamesurge));
            cookies.pass.set(util.B64.encode(password));
            cookies.auth.set(true);
            auth.enabled = true;
        } else {
            cookies.auth.dispose();
        }


        parentElement.empty();

        auth.loggedin = true;
        callback.call(this,data);
    }.bind(this));

    // nickBox.set("value", initialNickname);
    //chan.set("value", initialChannels);

    if (window === window.top)
        nickBox.focus();
};


//todo clean this up - not currently implemented
ui.ConfirmBox = function(parentElement, callback, initialNickname, initialChannels, autoNick, networkName) {
    var outerbox = new Element("table");
    outerbox.addClass("qwebirc-centrebox");
    parentElement.appendChild(outerbox);
    var tbody = new Element("tbody");
    outerbox.appendChild(tbody);
    var tr = new Element("tr");
    tbody.appendChild(tr);
    var td = new Element("td");
    tr.appendChild(td);

    var box = new Element("table");
    box.addClass("qwebirc-confirmbox");
    td.appendChild(box);

    var tbody = new Element("tbody");
    box.appendChild(tbody);

    var tr = new Element("tr");
    tbody.appendChild(tr);
    tr.addClass("tr1");

    var text = new Element("td");
    tr.appendChild(text);

    var nick = new Element("b");
    nick.set("text", initialNickname);

    var c = initialChannels.split(" ")[0].split(",");

    text.appendChild(document.createTextNode("To connect to " + networkName + " IRC and join channel" + ((c.length > 1) ? "s" : "") + " "));

    for (var i = 0; i < c.length; i++) {
        if ((c.length > 1) && (i == c.length - 1)) {
            text.appendChild(document.createTextNode(" and "));
        } else if (i > 0) {
            text.appendChild(document.createTextNode(", "));
        }
        text.appendChild(new Element("b").set("text", c[i]));

    }

    if (!autoNick) {
        text.appendChild(document.createTextNode(" as "));
        text.appendChild(nick);
    }

    text.appendChild(document.createTextNode(" click 'Connect'."));
    text.appendChild(new Element("br"));
    if (auth.enabled && auth.quakeNetAuth() && !auth.loggedin)
        text.appendChild(document.createTextNode("If you'd like to connect using your Q auth click 'Log in'."));

    var tr = new Element("tr");
    tbody.appendChild(tr);
    tr.addClass("tr2");

    var td = new Element("td");
    tr.appendChild(td);

    var yes = new Element("input", {
        "type": "submit",
        "value": "Connect"
    });
    td.appendChild(yes);
    yes.addEvent("click", function(e) {
        parentElement.removeChild(outerbox);
        callback({
            "nickname": initialNickname,
            "autojoin": initialChannels
        });
    });

    if (auth.enabled && auth.quakeNetAuth() && !auth.loggedin) {
        var auth = new Element("input", {
            "type": "submit",
            "value": "Log in"
        });
        td.appendChild(auth);
        auth.addEvent("click", ui.AuthLogin);
    }

    if (window == window.top)
        yes.focus();
}

ui.authShowHide = function(checkbox, authRow, usernameBox, usernameRow, passwordRow) {
    var visible = checkbox.checked;
    var display = visible ? null : "none";
    usernameRow.setStyle("display", display);
    passwordRow.setStyle("display", display);

    if (visible) {
        //    authRow.parentNode.setStyle("display", "none");
        usernameBox.focus();
    }
}

