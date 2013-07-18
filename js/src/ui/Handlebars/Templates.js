
(function (engine) {

    //where to store these things
    var source = engine.source = engine.source || {},
        compiled = engine.templates = engine.templates || {};

    //Handlebars.templates.stream({class:'scout',added:[{user:'megawac'},{user:'TKO'}]})
    //->
    //"<li id='tfscout'><span class='tf-class'>scout</span><span class='tf-players'><span>megawac</span><span>TKO</span></span></li>"
    // source.stream = [
    // "<li id='tf{{class}}'>",
    //     "<span class='tf-class'>{{class}}</span>",
    //     "<span class='tf-players'>",
    //     "{{#each added}}",
    //         "{{> player this}}",
    //     "{{/each}}",
    //     "</span>",
    // "</li>"
    // ].join("");

    //Templates.compiled.authpage({nickname:'fred',username:'megawac',password:'secret', full:false}) (full shows all fields)
    //"<div id='login'><div><span>Nickname:</span><input type='text' name='basic' id='nickname' value=fred></div><div><span>Auth options</span><input type='checkbox' id='authenticate'></div><div><span>Gamesurge username:</span><input type='text' name='full' id='username' value='megawac'></div><div><span>Password:</span><input type='text' name='full' id='password' value='secret'></div></div>"
    source.authpage = [
    "<form id='login'>",
        //"<div>",
        "<h1>Connect to {{network}} IRC</h1>",
        "<div class='nick right'><span>Nickname:</span><input type='text' name='basic' id='nickname' value={{nickname}}></div>",
        "<div class='username right {{#unless full}}hidden{{/unless}}'><span>Gamesurge username:</span><input type='text' name='full' id='username' value='{{username}}'></div>",
        "<div class='password right {{#unless full}}hidden{{/unless}}'><span>Password:</span><input type='password' name='full' id='password' value='{{password}}'></div>",
        "<div class='authenticate'>",
            "<span>Authenticate (optional)</span><input type='checkbox' id='authenticate' {{check full}}>",
        "</div>",
        "<div><input type='submit' value='Connect' /></div>",
        //"</div>",
    "</form>",
    "<div class='qwebirc-init-channels'><span>{{channels}}</span></div>"
    ].join("");

    source.spanURL = "<span class='hyperlink-channel'>{{message}}</span>";

    source.message = "<div class='message{{pad class}}'><span>{{message}}</span></div>";
    source.timestamp = "<span class='timestamp'>{{time}} </span>";
    source.userlink = "<span class='hyperlink-whois' data-user='{{userid}}'>&lt;{{username}}&gt;</span>";
    source.channellink = "<span class='hyperlink-channel' data-chan='{{channel}}'>{{channel}}</span>";

    source.messageLine = "<hr class='lastpos' />";
    source.ircMessage = "<div class='{{styles}}'></div>";


    //portions:
    source.topPane = "<div class='qui toppanel outertabbar'></div>";
    source.detachedPane = "<div class='detached'></div>";
    source.windowsPane = "<div class='windows qui'></div>";
    source.windowPane = "<div class='window qui hidden'></div>";
    source.topicPane = "<div class='qui topic'></div>";
    source.contentPane = "<div class='qui content'></div>";
    source.leftPane = "<div class='qui leftpanel lines'></div>";
    source.nickPane = "<div class='qui rightpanel'></div>";
    source.propertiesPane = "<div class='qui properties'></div>";
    source.inputPane = "<div class='qui bottompanel'></div>";

    source.detachedWindow = [
    "<div class='detached-window'>",
        "<div class='header'>",
            "<span class='title'>{{channel}}</span>",
            "{{#unless base}}{{> tabClose}}{{/unless}}",//css bug
            "{{> tabAttach}}",
        "</div>",
    "</div>"].join("");

    source.resizeHandle = "<div><span class='resize-handle ui-icon ui-icon-grip-diagonal-se'></span></div>";

    source.menuContainer = "<div class='menu'></div>";
    source.menubtn = "<div class='dropdown-tab'><img src='{{icon}}' title='menu' alt='menu'></div>";
    source.menudrop = "<div class='main-menu dropdownmenu'></div>";
    source.chanmenu = "<div class='chanmenu dropdownmenu'>{{#each channels}}{{> menuitem}}{{/each}}</div>";
    source.menuitem = "<a><span>{{text}}</span>{{#if hint}}<span class='hint'>{{hint}}</span>{{/if}}</a>";
    source.dropdownhint = "<div class='dropdownhint'>Click the icon for the main menu.</div>";

    source.tabbar = "<div class='tabbar'></div>";
    source.addTab = "<div class='add-chan'><span class='ui-icon ui-icon-circle-plus' title='Join a channel'></span></div>";
    source.ircTab = "<a href='#' class='tab'>{{{name}}} {{> tabDetach}}</a>";
    source.tabDetach = "<span class='detach ui-icon ui-icon-newwin' title='" + lang.detachWindow + "'></span>";
    source.tabAttach = "<span class='attach ui-icon ui-icon-circle-minus'></span>";
    source.tabClose = "<span class='tab-close ui-icon ui-icon-circle-close' title='" + lang.closeTab + "'></span>";

    source.channelName = "<div id='channel-name-id' class='channel-name'>{{{channel}}}</div>";

    source.topicBar = ["<div class='topic tab-invisible qui colourline'>",
                            "{{#if topic}}{{> topicText}}{{else}}&nbsp;{{/if}}",
                        "</div>"].join("");
    source.topicText = "<span class='{{#if empty}}emptytopic{{/if}}'>{{topic}}</span>";

    source.nickbtn = "<a href='#' class='user'><span>{{nick}}</span></a>";
    // source.nicklist = "<div class='nicklist tab-invisible qwebirc-qui'></div>";

    source.favicon = "<link rel='shortcut icon' type='image/x-icon' href='{{link}}'>";

    source.ircInput = [
    "<form class='input'><div>",
        "<label class='nickname'><span class='status {{status}}'></span>{{nick}}</label>",
        "<input class='{{type}} input-field' type='text'>",
        "<input class='input-button' type='button' value='>' />",
    "</div></form>"].join("");


    source.verticalDivider = "<div class='ui-icon ui-icon-grip-solid-vertical handle vertical'></div>";
    source.horizontalDivider = "<div class='ui-icon ui-icon-grip-solid-horizontal handle horizontal'></div>";

    /************************
        HELPERS
    ***********************/
    //invert boolean helper
    engine.registerHelper('not', prelude.negate);

    //returns hidden class name if it should be hidden
    engine.registerHelper('hidden', function(hidden) {
        return hidden ? 'hidden' : '';
    });

    engine.registerHelper('check', function(checked){
        return checked ? 'checked' : '';
    });

    engine.registerHelper('pad', function(txt) {
        return txt && txt.length !== 0 ? ' ' + txt : '';
    });

    //https://github.com/wycats/handlebars.js/issues/304
    // engine.registerHelper('chain', function () {
    //     var helpers = [], value;
    //     $each(arguments,function (arg, i) {
    //         if (engine.helpers[arg]) {
    //             helpers.push(engine.helpers[arg]);
    //         } else {
    //             value = arg;
    //             $each(helpers, function (helper, j) {
    //                 value = helper(value, arguments[i + 1]);
    //             });
    //             return false;
    //         }
    //     });
    //     return value;
    // });

    /******************
        Compiliation
    *********************/

    function compileAll(source,compiled) {
        compiled = compiled || {};

        Object.each(source, function(item, key) {
            try {
                compiled[key] = engine.compile(item);
            } catch(err) {
                console.log(err);
            }
        });

        return compiled;
    }

    compileAll(source, compiled);

    //allows templates to reference eachother
    engine.partials = compiled;
})(Handlebars);

var templates = par.Handlebars.templates;
