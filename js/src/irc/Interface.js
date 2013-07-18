
ui.Interface = new Class({
    Implements: [Options, Events],
    options: {
        baseURL: 'atf2.org',
        dynamicBaseURL: "/",
        staticBaseURL: "/",
        searchURL: true,

        appTitle: "Gamesurge.net Web IRC",
        networkName: "Gamesurge",
        networkServices: [],

        initialNickname: "newb1234",
        initialChannels: ["#tf2newbiemix","#tf2mix","#tf2.pug.na","#tf2.pug.nahl","#jumpit","#tf2scrim","#tf2hlscrim","#tftv"],
        channels: new Storer("channels"),
        minRejoinTime: [5, 20, 300], //array - secs between consecutive joins

        modifiableStylesheet: window.ircoptions.stylesheet,

        hue: null,
        saturation: null,
        lightness: null,

        theme: undefined,
        uiOptionsArg: null,

        loginRegex: null,
        nickValidation: null

    },
    //var ui = new qwebirc.ui.Interface("ircui", qwebirc.ui.QUI, {"appTitle":"QuakeNet Web IRC","dynamicBaseURL":"/dynamic/leibniz/","baseURL":"http://webchat.quakenet.org/","validateNickname":false,"networkServices":["Q!TheQBot@CServe.quakenet.org"],"nickValidation":{"maxLen":15,"validSubChars":"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_[]{}`^\\|0123456789-","validFirstChar":"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_[]{}`^\\|","minLen":2},"staticBaseURL":"/static/leibniz/","loginRegex":"^You are now logged in as [^ ]+\\.$","networkName":"QuakeNet"});
    initialize: function(element, uitheme, options) {
        this.setOptions(options);
        var self = this,
            win = window,
            opts = self.options;

        win.steamlink = 0;
        win.lastkick = {
            channel: '',
            last: 1
        };
        win.hasfocus = true;
        win.addEvent('focus', function() {
                this.hasfocus = true;
            })
            .addEvent('blur', function() {
                this.hasfocus = false;
            });

        var sbaseurl = opts.staticBaseURL;
        qwebirc.global = {
            dynamicBaseURL: opts.dynamicBaseURL,
            staticBaseURL: sbaseurl,
            nicknameValidator: $defined(opts.nickValidation) ? new irc.NicknameValidator(opts.nickValidation) : new irc.DummyNicknameValidator()
        };

        opts.icons = {
            //favicon: sbaseurl + "images/favicon.png",
            empty_favicon: sbaseurl + "images/empty_favicon.ico",
            menuicon: sbaseurl + "images/icon.png"
        };

        opts.sounds = {
            //soundManagersrc: sbaseurl + "js/soundmanager2-nodebug-jsmin.js",
            sounds: sbaseurl + "sound",
            beepsrc: "/beep3.mp3",
            minSoundRepeatInterval: 5000
        };

        opts.specialUserActions = [ //special actions to take when particular users speak
            function(user, msg, target, client) {
                var interested = opts.networkServices.contains(user);
                if(interested) {
                    if(opts.loginRegex.test(msg)) {
                        client.authEvent();
                    }
                    client.getActiveWindow().infoMessage(msg);
                }
                return interested;
            }
        ],

        win.addEvent("domready", function() {
            var inick = opts.initialNickname,
                ichans = opts.channels.get() || opts.initialChannels,
                autoConnect = false;

            //cleans up old properties
            if(storage.get('__clean') !== false)
                self.cleanUp();

            // var cookopts = opts.cookieOpts;
            //cookies to store connection details
            var authCookies = {
                nick: new Storer("nickname"),//initial nick
                user: new Storer("gamesurge"),//auth account
                pass: new Storer("password"),//auth password
                auth: new Storer("enableAuth")//enable full auth
            };

            function callback(loginopts) {
                $extend(loginopts, Object.subset(opts, ['initialChannels', 'channels', 'specialUserActions', 'minRejoinTime']));

                var client = self.IRCClient = new irc.IRCClient(loginopts, self.ui_);
                client.connect();
                win.onbeforeunload = qwebirc_ui_onbeforeunload;
                win.addEvent("unload", function() {
                    client.quit(lang.quit.message);
                });
                if(!auth.enabled) {
                    self.ui_.beep();
                }


                var listener = function() {
                    self.ui_.beep();
                    client.removeEvent("auth", listener);
                };
                client.addEvent("auth", listener);

                self.fireEvent("login", {
                    'IRCClient': client,
                    'parent': self
                });
            }

            if (opts.searchURL) {
                var args = util.parseURI(document.location.toString()),
                    url = args["url"],
                    chans,
                    nick = args["nick"],
                    canAutoConnect = false;
                opts.hue = self.getHueArg(args, "");
                opts.saturation = self.getSaturationArg(args, "");
                opts.lightness = self.getLightnessArg(args, "");

                opts.thue = self.getHueArg(args, "t");
                opts.tsaturation = self.getSaturationArg(args, "t");
                opts.tlightness = self.getLightnessArg(args, "t");

                if ($defined(args["uio"])) {
                    opts.uiOptionsArg = args["uio"];
                }

                if ($defined(url)) {
                    ichans = self.parseIRCURL(url);
                    if (!! chans) {
                        canAutoConnect = true;
                    }
                } else {
                    chans = args["channels"];

                    if (chans) {
                        var cdata = chans.split(" ");
                        cdata[0] = util.formatChannelString(cdata[0]);
                        ichans = cdata.join(" ");
                        canAutoConnect = true;
                    }
                }

                if ($defined(nick)) {
                    inick = self.randSub(nick);
                }

                if (args["randomnick"] && args["randomnick"] == 1) {
                    inick = opts.initialNickname;
                }


                //Stupid... using variables out of scope can only have one result.

                // we only consider autoconnecting if the nick hasn't been supplied, or it has and it's not "" 
                // if(canAutoConnect && (!$defined(inick) || !!inick)) {//this is stupid...
                //     var p = args["prompt"],
                //         pdefault = false;

                //     if(!$defined(p) || !!p) {
                //         pdefault = true;
                //         p = false;
                //     } else if(p == "0") {
                //         p = false;
                //     } else {
                //         p = true;
                //     }

                //     // autoconnect if we have channels and nick but only if prompt != 1
                //     if(($defined(inick) || !pdefault)  && !p) {// OR if prompt=0, but not prompt=(nothing)
                //         autoConnect = true;
                //     }
                // }
            }

            self.ui_ = new uitheme($(element), new ui.Theme(opts.theme), opts); //unconventional naming scheme

            var usingAutoNick = true; //!$defined(nick);//stupid used out of scope
            //if(usingAutoNick && autoConnect) {
            inick = opts.initialNickname;
            //}

            var details = self.ui_.loginBox(callback, inick, ichans, autoConnect, usingAutoNick, opts.networkName, authCookies);
        });
    },
    cleanUp: function() {
        var cook = par.Cookie,
            cookies = ['channels', 'nickname', 'gamesurge', 'password', 'opt1'];
        if($defined(localStorage) && cookies.some(function(id) { return cook.read(id) !== null })) {
            if(confirm('The old app installed cookies that are no longer used... Delete them?')) {
                cookies.each(cook.dispose); //delete old cookies
            }
        }
        storage.set('__clean', false);
    },
    getHueArg: function(args) {
        var hue = args["hue"];
        if (!$defined(hue)) return null;
        hue = parseInt(hue, 10);
        if (hue > 360 || hue < 0) return null;
        return hue;
    },
    getSaturationArg: function(args) {
        var saturation = args["saturation"];
        if (!$defined(saturation)) return null;
        saturation = parseInt(saturation, 10);
        if (saturation > 100 || saturation < -100) return null;
        return saturation;
    },
    getLightnessArg: function(args) {
        var lightness = args["lightness"];
        if (!$defined(lightness)) return null;
        lightness = parseInt(lightness,10);
        if (lightness > 100 || lightness < -100) return null;
        return lightness;
    },
    randSub: function(nick) {
        var getDigit = function() {
                return Math.floor(Math.random() * 10);
        };

        return nick.split("").map(function(v) {
            if (v == ".") {
                return getDigit();
            } else {
                return v;
            }
        }).join("");

    },
    parseIRCURL: function(url) {
        var schemeComponents, args,queryArgs,parts,pathComponents,channel,value,i;
        if (url.indexOf(":") === 0) {return;}
        schemeComponents = url.splitMax(":", 2);
        if (schemeComponents[0].toLowerCase() != "irc" && schemeComponents[0].toLowerCase() != "ircs") {
            alert("Bad IRC URL scheme.");
            return;
        }

        if (url.indexOf("/") === 0) { /* irc: */
            return;
        }

        pathComponents = url.splitMax("/", 4);
        if (pathComponents.length < 4 || !pathComponents[3]) { /* irc://abc */
            return;
        }

        if (pathComponents[3].indexOf("?") > -1) {
            queryArgs = util.parseURI(pathComponents[3]);
            args = pathComponents[3].splitMax("?", 2)[0];
        } else {
            args = pathComponents[3];
        }
        parts = args.split(",");

        channel = parts[0];
        if (channel.charAt(0) != "#") channel = "#" + channel;


        var not_supported = [],
            needkey = false,
            key;
        for (i = 1; i < parts.length; i++) {
            value = parts[i];
            if (value == "needkey") {
                needkey = true;
            } else {
                not_supported.push(value);
            }
        }

        if ($defined(queryArgs)) {
            Object.each(queryArgs, function(val_, key_) {
                if (key_ == "key") {
                    key = value;
                    needkey = true;
                } else {
                    not_supported.push(key_);
                }
            });
        }

        if (needkey) {
            if (!$defined(key)) {key = prompt("Please enter the password for channel " + channel + ":");}
            if ($defined(key)) {channel = channel + " " + key;}
        }

        if (not_supported.length > 0) alert("The following IRC URL components were not accepted: " + not_supported.join(", ") + ".");

        return channel;
    }
});
