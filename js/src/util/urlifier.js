
//Parses messages for url strings and creates hyperlinks
var urlifier = util.urlifier = new Urlerizer({
    target: '_blank'
});

urlifier.addPattern(/qwebirc:\/\/(.*)/, function(text) {
            //given "qwebirc://whois/rushey#tf2mix/"

            var words = text.split(" ");

            for (var i = words.length - 1, word = ""; i >= 0; i--) {
                word = words[i];
                if(word.contains("qwebirc://")) {
                    var res = word.match(/qwebirc:\/\/(.*)(\/)(?!.*\/)/g)//matches a valid qweb tag like qwebirc://options/ removes anything outside off qweb- and the last dash

                    if(res)
                        res = res[0].slice(10);//remove qwebirc://
                    else continue;
                    if(res.contains("whois/")) {
                        var chan_match = res.match(/#[\s\S]*(?=\/)/); //matches the chan to the dash
                        var chan = chan_match ? chan_match[0] : "";
                        var chanlen = chan_match ? chan_match.index : res.length - 1; //chan length or the len -1 to atleast remove the dash
                        var user = res.slice(6,  chanlen);
                        res = templates.userlink({'userid': user, 'username': user + chan});
                    }
                    else if(res.contains("options") || res.contains("embedded")) {
                        console.log("called yo");
                        console.log(res);
                    }
                    words[i] = res;
                }
            }
            return words.join(" ");

            //generates something like <span class="hyperlink-whois">Tristan#tf2mix</span>
        })
