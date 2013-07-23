
//Parses messages for url strings and creates hyperlinks
var urlifier = util.urlifier = new Urlerizer({
    target: '_blank'
});

urlifier.addPattern(/qwebirc:\/\/(.*)/, function(word) {//breaks on names with dashs qwebirc://whois/hi-#tf2mix/
            //given "qwebirc://whois/rushey#tf2mix/"
            if(word.contains("qwebirc://")) {
                var res = word.match(/qwebirc:\/\/(.*)(\/)(?!.*\/)/g);//matches a valid qweb tag like qwebirc://options/ removes anything outside off qweb- and the last dash

                if(res) {
                    res = res[0].slice(10);//remove qwebirc://
                    if(res.contains("whois/")) {
                        var chan_match = res.match(/(#|>)[\s\S]*(?=\/)/); //matches the chan or user to the dash
                        var chan = chan_match ? chan_match[0] : "";
                        var chanlen = chan_match ? chan_match.index : res.length - 1; //chan length or the len -1 to atleast remove the dash
                        var user = res.slice(6,  chanlen);
                        res = templates.userlink({'userid': user, 'username': user + chan});
                    }
                    else if(res.contains("options") || res.contains("embedded")) {
                        console.log("called yo");
                        console.log(res);
                    }
                    word = res;
                }
            }
            return word;

            //generates something like <span class="hyperlink-whois">Tristan#tf2mix</span>
        })
        .addPattern(/\B#+(?![\._#-+])/, function(word) {
            var res = word;

                if(isChannel(word) && !res.startsWith("#mode") && !res.slice(1).test(/#|\/|\\/)) {
                    res = templates.channellink({channel:util.formatChannel(word)});
                }

            return res;
        })
        .addPattern(/connect [a-zA-Z0-9_]*\..*[a-zA-Z0-9_]*.*;.*password [a-zA-Z0-9_]*/i, function(word) {
            return word;
        });