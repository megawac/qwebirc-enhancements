this["qwebirc"] = this["qwebirc"] || {};
this["qwebirc"]["templates"] = this["qwebirc"]["templates"] || {};

this["qwebirc"]["templates"]["modifiablecss"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", escapeExpression=this.escapeExpression;


  buffer += "#ircui {height: 100%;width: 100%;overflow: hidden;font-family: Verdana, sans-serif;}.qui .hidden, .qui .invisible {display: none;}.channel-name {background-color: rgb(255, 255, 191);border: 1px solid #C8D1DB;border-radius: 4px 4px 4px 4px;color: #000000;cursor: default;font-size: 0.8em;padding: 2px;text-decoration: none;white-space: nowrap;float: left;margin: 1px 0px 0px 1px;font-weight: bold;}.qui .widepanel {width: 100%;}.qui .lines {color: black;overflow: auto;font-size: "
    + escapeExpression(helpers.$css.call(depth0, "font_size", 12, {hash:{},data:data}))
    + "px;background: "
    + escapeExpression(helpers.$css.call(depth0, "lines_background", "f2f0ff", "c", {hash:{},data:data}))
    + ";}.qui .lines .timestamp {display: "
    + escapeExpression(helpers.$css.call(depth0, "show_timestamps", "inline", "comp", "none", {hash:{},data:data}))
    + ";}.qui .lines .nick {margin-right: 4px;}.qui .lines .nick .channel {color: rgb(109, 89, 89);}.qui .ircwindow .lines {font-family: Consolas, \"Lucida Console\", monospace;text-indent: 10px;padding-left: 1em;word-wrap: break-word;}.qui .lines .highlight1 {background-color: "
    + escapeExpression(helpers.$css.call(depth0, "lines_highlight1", "f6ff94", "c", {hash:{},data:data}))
    + ";}.qui .lines .highlight2 {background-color: "
    + escapeExpression(helpers.$css.call(depth0, "lines_highlight2", "A4FCCA", "c", {hash:{},data:data}))
    + ";}.qui .lines .highlight3 {background-color: "
    + escapeExpression(helpers.$css.call(depth0, "lines_highlight3", "FAC3D5", "c", {hash:{},data:data}))
    + ";}.qui .lines .mentioned {background-color: "
    + escapeExpression(helpers.$css.call(depth0, "mentioned_colour", "E63772", "c", {hash:{},data:data}))
    + " !important;}.qui .properties {background-color: "
    + escapeExpression(helpers.$css.call(depth0, "menu_background", "f2f0ff", "c", {hash:{},data:data}))
    + ";border-top: 1px solid "
    + escapeExpression(helpers.$css.call(depth0, "menu_border", "c8d2dc", "c", {hash:{},data:data}))
    + ";height: 25px;}.qui .topic .emptytopic {color: gray;}.qui .topic {color: gray;padding-left: 5px;font-size: 0.7em;cursor: default;background-color: "
    + escapeExpression(helpers.$css.call(depth0, "topic_background", "f2f0ff", "c", {hash:{},data:data}))
    + ";border-bottom: 1px dashed "
    + escapeExpression(helpers.$css.call(depth0, "topic_border", "c8d2dc", "c", {hash:{},data:data}))
    + ";}/*tab stuff*/.qui .outertabbar {border-bottom: 1px solid "
    + escapeExpression(helpers.$css.call(depth0, "tabbar_border", "c3cee0", "c", {hash:{},data:data}))
    + ";background: "
    + escapeExpression(helpers.$css.call(depth0, "tabbar_background", "e2ecf9", "c", {hash:{},data:data}))
    + ";height: 26px;line-height: 20px;padding: 2px 0;}.qui .outertabbar > * {vertical-align: top;}.qui .tabbar {color: "
    + escapeExpression(helpers.$css.call(depth0, "tabbar_text", "000000", "c", {hash:{},data:data}))
    + ";display: inline-block;overflow-x: hidden;margin-left: 10px;font-size: 13px;height: 22px;}.qui .tabbar .tab {padding: 2px;cursor: default;margin-right: 3px;white-space: nowrap;font-weight: bold;color: "
    + escapeExpression(helpers.$css.call(depth0, "tab_text", "000000", "c", {hash:{},data:data}))
    + ";border: 1px solid "
    + escapeExpression(helpers.$css.call(depth0, "tab_border", "c8d2dc", "c", {hash:{},data:data}))
    + ";border-radius: 4px;-moz-border-radius: 4px;-webkit-border-radius: 4px;}.qui .tabbar .tab:hover {background: "
    + escapeExpression(helpers.$css.call(depth0, "tab_hover", "ffffff", "c", {hash:{},data:data}))
    + ";border: 1px solid #c8d2dc;-moz-border-radius: 4px;-webkit-border-radius: 4px;}.qui .tabbar .hilight-activity.tab {color: #009900;}.qui .tabbar .hilight-speech.tab {color: #0000ff;}.qui .tabbar .hilight-us.tab {color: #ff0000;background: rgb(216, 216, 138);}.qui .tabbar .selected.tab {background: "
    + escapeExpression(helpers.$css.call(depth0, "tab_selected", "ffffff", "c", {hash:{},data:data}))
    + ";border: 1px solid "
    + escapeExpression(helpers.$css.call(depth0, "tab_selected_border", "c8d2dc", "c", {hash:{},data:data}))
    + ";-moz-border-radius: 4px;-webkit-border-radius: 4px;color: "
    + escapeExpression(helpers.$css.call(depth0, "tab_selected_text", "333333", "c", {hash:{},data:data}))
    + ";}.qui .buttons {display: none;}.qui.signed-in .buttons {display: inline-block;cursor: pointer;}.buttons span {vertical-align: middle;display: inline-block;}/* tab stuff *//*irc input stuff*/.qui .input {background-color: "
    + escapeExpression(helpers.$css.call(depth0, "menu_background", "f2f0ff", "c", {hash:{},data:data}))
    + ";margin: 0;}.qui .input div {border-top: 1px solid "
    + escapeExpression(helpers.$css.call(depth0, "input_border", "c3cee0", "c", {hash:{},data:data}))
    + ";padding: 0 5px 1px;margin: 0;width: 100%;}.qui .input div > .input-group-addon {cursor:pointer;cursor:hand;padding: 2px 5px;}.qui .input div > * {height: 24px;}.qui .input .nickname {color: #524F50;font-size: 14px;}.qui .user .status {border-radius: 50%;display: inline-block;margin-right: 3px;}.qui .user .status.voice {width: 8px;height: 8px;background-color: rgb(223, 187, 47);background-image: radial-gradient(45px 45px 45deg, circle, yellow 0%, orange 100%, red 95%);background-image: -moz-radial-gradient(45px 45px 45deg, circle, yellow 0%, orange 100%, red 95%);background-image: -o-radial-gradient(45px 45px 45deg, circle, yellow 0%, orange 100%, red 95%);background-image: -webkit-radial-gradient(45px 45px, circle, yellow, orange);animation-name: spin;animation-duration: 3s;animation-iteration-count: infinite;animation-timing-function: linear;-webkit-animation-name: spin;-webkit-animation-duration: 3s;-webkit-animation-iteration-count: infinite;-webkit-animation-timing-function: linear;-moz-animation-name: spin;-moz-animation-duration: 3s;-moz-animation-iteration-count: infinite;-moz-animation-timing-function: linear;-o-animation-name: spin;-o-animation-duration: 3s;-o-animation-iteration-count: infinite;-o-animation-timing-function: linear;}.qui .user .status.op {width: 8px;height: 8px;background-color: #7AE60E;background-image: radial-gradient(45px 45px 45deg, circle, #5FFF4A 3%, #7AE60E 76%);background-image: -moz-radial-gradient(45px 45px 45deg, circle, #5FFF4A 3%, #7AE60E 76%);background-image: -o-radial-gradient(45px 45px, circle, #5FFF4A 3%, #7AE60E 76%);background-image: -webkit-radial-gradient(45px 45px, circle, #5FFF4A 3%, #7AE60E 76%);animation-name: spin;animation-duration: 3s;animation-iteration-count: infinite;animation-timing-function: linear;-webkit-animation-name: spin;-webkit-animation-duration: 3s;-webkit-animation-iteration-count: infinite;-webkit-animation-timing-function: linear;-moz-animation-name: spin;-moz-animation-duration: 3s;-moz-animation-iteration-count: infinite;-moz-animation-timing-function: linear;-o-animation-name: spin;-o-animation-duration: 3s;-o-animation-iteration-count: infinite;-o-animation-timing-function: linear;}.qui .input .tt-query {border: 1px solid "
    + escapeExpression(helpers.$css.call(depth0, "input_border", "c3cee0", "c", {hash:{},data:data}))
    + ";padding: 0;height: 26px;text-indent: 5px;}.qui .input .decorated {background-image: linear-gradient(bottom, rgb(235,235,232) 54%, rgb(247,250,240) 66%);background-image: -o-linear-gradient(bottom, rgb(235,235,232) 54%, rgb(247,250,240) 66%);background-image: -moz-linear-gradient(bottom, rgb(235,235,232) 54%, rgb(247,250,240) 66%);background-image: -webkit-linear-gradient(bottom, rgb(235,235,232) 54%, rgb(247,250,240) 66%);background-image: -ms-linear-gradient(bottom, rgb(235,235,232) 54%, rgb(247,250,240) 66%);background-image: -webkit-gradient(linear,left bottom,left top,color-stop(0.54, rgb(235,235,232)),color-stop(0.66, rgb(247,250,240)));}/*twitter typeahead inspired autocomplete using overlay input box*/.qui .tt-hint {position: absolute;top: 0px;left: 0px;padding: 0;text-indent: 5px;border-color: transparent;box-shadow: none;color: #BDBDBD;}.qui .tt-query {position: relative;vertical-align: top;background-color: transparent;}/*end typeahead*/.qui .input .btn.send {color: grey;padding: 2px 10px;}.qui .nicklist {border-left: 1px solid "
    + escapeExpression(helpers.$css.call(depth0, "nicklist_border", "c8d2dc", "c", {hash:{},data:data}))
    + ";width: 140px;overflow: auto;background: "
    + escapeExpression(helpers.$css.call(depth0, "nicklist_background", "f2f0ff", "c", {hash:{},data:data}))
    + ";color: "
    + escapeExpression(helpers.$css.call(depth0, "nicklist_text", "000000", "c", {hash:{},data:data}))
    + ";font-size: 0.7em;}.qui .nicklist .user, .qui .nick-menu {display: block;color: black;text-decoration: none;cursor: default;border-top: 1px solid "
    + escapeExpression(helpers.$css.call(depth0, "nicklist_background", "f2f0ff", "c", {hash:{},data:data}))
    + ";border-bottom: 1px solid "
    + escapeExpression(helpers.$css.call(depth0, "nicklist_background", "f2f0ff", "c", {hash:{},data:data}))
    + ";padding-left: 1px;}.qui .nick-menu {width: initial;}.qui .nick-menu ul {margin: 0;padding-left: 20px;list-style-type: circle;}.qui .nick-menu li {cursor:pointer;cursor:hand;}.qui .nicklist .selected {display: block;color: black;background: white;text-decoration: none;border-bottom: "
    + escapeExpression(helpers.$css.call(depth0, "nicklist_selected_border", "c8d2dc", "c", {hash:{},data:data}))
    + " 1px solid;cursor: default;}.qui .nicklist .selected-middle {border-top: "
    + escapeExpression(helpers.$css.call(depth0, "nicklist_selected_border", "c8d2dc", "c", {hash:{},data:data}))
    + " 1px solid;}.qui .nicklist .menu {margin: 0 0 0 5px;}.qui .nicklist .menu a {border-bottom: 0;border-top: 0;}.hyperlink-whois, .hyperlink-channel {cursor: pointer;cursor: hand;}.hyperlink-whois:hover, .hyperlink-channel:hover {text-decoration: underline;}.qui .outertabbar .dropdown-tab {cursor: pointer; cursor: hand;display: inline-block;padding-left: 4px;width: 30px;}.qui .dropdownmenu {position: absolute;z-index: 100;border: 1px solid "
    + escapeExpression(helpers.$css.call(depth0, "menu_border", "c8d2dc", "c", {hash:{},data:data}))
    + ";background: "
    + escapeExpression(helpers.$css.call(depth0, "menu_background", "f2f0ff", "c", {hash:{},data:data}))
    + ";list-style: none;padding: 5px 10px;font-size: 0.7em;}.qui .dropdownmenu a {color: black;cursor: pointer;cursor: hand;padding-top: 3px;}.qui .dropdownmenu a:hover {background: "
    + escapeExpression(helpers.$css.call(depth0, "menu_hover_background", "FFFE", "c", {hash:{},data:data}))
    + ";}.qui .dropdownhint {position: relative;left: -500px;z-index: 10;white-space: nowrap;font-size: 0.7em;}.qui .chanmenu {width: 150px;}.qui .chanmenu .hint {float: right;font-size: 75%;color: grey;}.qui hr.lastpos {border: none;border-top: 1px solid "
    + escapeExpression(helpers.$css.call(depth0, "lastpositionbar", "C8D2DC", "c", {hash:{},data:data}))
    + ";margin: .5em 3em;}.qwebirc-init-channels {font-size: 95%;color: #928D8D;text-align: center;}";
  return buffer;
  });

this["qwebirc"]["templates"]["authpage"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  
  return "hidden";
  }

  buffer += "<div class=\"container center\"><form id=\"login\"><h2>Connect to "
    + escapeExpression(((stack1 = depth0.network),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " IRC</h2><div class=\"control-group right\"><label class=\"control-label\" for=\"nickname\">Nickname:<input type=\"text\" class=\"form-control\" data-validate=\"nick\" name=\"basic\" id=\"nickname\" value=\""
    + escapeExpression(((stack1 = depth0.nickname),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" placeholder=\"Nickname\" required /></label></div><div class=\"control-group right ";
  stack2 = helpers.unless.call(depth0, depth0.full, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\"><label class=\"control-label\" for=\"username\">"
    + escapeExpression(((stack1 = depth0.network),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " username:<input type=\"text\" class=\"form-control\" data-validate=\"username\" name=\"full\" id=\"username\" value=\""
    + escapeExpression(((stack1 = depth0.username),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" placeholder=\""
    + escapeExpression(((stack1 = depth0.network),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " username\"></label></div><div class=\"control-group right ";
  stack2 = helpers.unless.call(depth0, depth0.full, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\"><label class=\"control-label\" for=\"password\">Password:<input type=\"password\" class=\"form-control\" data-validate=\"password\" name=\"full\" id=\"password\" value=\""
    + escapeExpression(((stack1 = depth0.password),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"></label></div><div class=\"authenticate\"><label for=\"authenticate\">Authenticate (optional)<input type=\"checkbox\" id=\"authenticate\" "
    + escapeExpression(helpers.check.call(depth0, depth0.full, {hash:{},data:data}))
    + "></label></div><div><input type=\"submit\" value=\"Connect\" class=\"btn btn-primary btn-smaller\" /></div></form><div class=\"qwebirc-init-channels\"><span>"
    + escapeExpression(((stack1 = depth0.channels),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span></div></div>";
  return buffer;
  });

this["qwebirc"]["templates"]["chanmenu"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); partials = this.merge(partials, Handlebars.partials); data = data || {};
  var buffer = "", stack1, self=this;

function program1(depth0,data) {
  
  var stack1;
  stack1 = self.invokePartial(partials.menuitem, 'menuitem', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  }

  buffer += "<div class='chanmenu dropdownmenu'>";
  stack1 = helpers.each.call(depth0, depth0.channels, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</div>";
  return buffer;
  });

this["qwebirc"]["templates"]["channelName"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, functionType="function";


  buffer += "<div class='channel-name'>";
  stack2 = ((stack1 = depth0.channel),typeof stack1 === functionType ? stack1.apply(depth0) : stack1);
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "</div>";
  return buffer;
  });

this["qwebirc"]["templates"]["customlink"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, self=this, functionType="function", escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  
  return "internal";
  }

  buffer += "<a class=\"";
  stack1 = helpers['if'].call(depth0, depth0.internal, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\" href=\""
    + escapeExpression(((stack1 = depth0.val),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">"
    + escapeExpression(((stack1 = depth0.val),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</a>";
  return buffer;
  });

this["qwebirc"]["templates"]["detachedWindow"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); partials = this.merge(partials, Handlebars.partials); data = data || {};
  var buffer = "", stack1, stack2, self=this, functionType="function", escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  var stack1;
  stack1 = self.invokePartial(partials.tabClose, 'tabClose', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  }

  buffer += "<div class='detached-window'><div class='header'><span class='title'>"
    + escapeExpression(((stack1 = depth0.channel),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span>";
  stack2 = helpers.unless.call(depth0, depth0.base, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  stack2 = self.invokePartial(partials.tabAttach, 'tabAttach', depth0, helpers, partials, data);
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "</div><div class=\"content\"></div><div><span class=\"resize-handle ui-icon ui-icon-grip-diagonal-se\"></span></div></div>";
  return buffer;
  });

this["qwebirc"]["templates"]["failed-validator"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<p class=\"help-block\">"
    + escapeExpression(((stack1 = depth0.description),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</p>";
  return buffer;
  });

this["qwebirc"]["templates"]["ircInput"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class='input'><div class='tt-ahead input-group'><span class='input-group-addon user'><span class='status "
    + escapeExpression(((stack1 = depth0.status),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "'></span><span class=\"nickname\">"
    + escapeExpression(((stack1 = depth0.nick),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span></span>"
    + "<input class='tt-hint hidden' type='text' autocomplete='off' spellcheck='off' disabled>"
    + "<input class='tt-query form-control irc-input decorated' type='text' autocomplete='off' spellcheck='off'><span class='input-group-btn'><button class='btn btn-default send' type='button'>&gt;</button></span></div></div>";
  return buffer;
  });

this["qwebirc"]["templates"]["ircMessage"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\""
    + escapeExpression(((stack1 = depth0.type),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"></div>";
  return buffer;
  });

this["qwebirc"]["templates"]["ircTab"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); partials = this.merge(partials, Handlebars.partials); data = data || {};
  var buffer = "", stack1, stack2, self=this, functionType="function";

function program1(depth0,data) {
  
  var stack1;
  stack1 = self.invokePartial(partials.tabClose, 'tabClose', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  }

  buffer += "<span class='tab'>";
  stack2 = ((stack1 = depth0.name),typeof stack1 === functionType ? stack1.apply(depth0) : stack1);
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "&nbsp;";
  stack2 = self.invokePartial(partials.tabDetach, 'tabDetach', depth0, helpers, partials, data);
  if(stack2 || stack2 === 0) { buffer += stack2; }
  stack2 = helpers['if'].call(depth0, depth0.closable, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "</span>";
  return buffer;
  });

this["qwebirc"]["templates"]["ircnick"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var stack1, stack2;
  stack2 = ((stack1 = depth0.userid),typeof stack1 === functionType ? stack1.apply(depth0) : stack1);
  if(stack2 || stack2 === 0) { return stack2; }
  else { return ''; }
  }

function program3(depth0,data) {
  
  var stack1;
  return escapeExpression(((stack1 = depth0.nick),typeof stack1 === functionType ? stack1.apply(depth0) : stack1));
  }

function program5(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "<span class=\"channel\">"
    + escapeExpression(((stack1 = depth0.linkedchannel),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span>";
  return buffer;
  }

  buffer += "<span class=\"nick hyperlink-whois\" data-user='";
  stack1 = helpers['if'].call(depth0, depth0.userid, {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "'>&lt;"
    + escapeExpression(((stack1 = depth0.prefix),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "<span>"
    + escapeExpression(((stack1 = depth0.nick),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span>";
  stack2 = helpers['if'].call(depth0, depth0.linkedchannel, {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "&gt;</span>";
  return buffer;
  });

this["qwebirc"]["templates"]["ircstyle"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<span class=\""
    + escapeExpression(((stack1 = depth0.background),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = depth0.colour),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = depth0.style),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">";
  stack2 = ((stack1 = depth0.text),typeof stack1 === functionType ? stack1.apply(depth0) : stack1);
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "</span>";
  return buffer;
  });

this["qwebirc"]["templates"]["mainmenu"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<ul class=\"main-menu dropdownmenu hidden\"><a class=\"internal\" href=\"options\"><li><span>Options</span></li></a><a class=\"internal\" href=\"embedded\"><li><span>Add webchat to your site</span></li></a><a class=\"internal\" href=\"privacy\"><li><span>Privacy policy</span></li></a><a class=\"internal\" href=\"faq\"><li><span>Frequently asked questions</span></li></a><a class=\"internal\" href=\"feedback\"><li><span>Submit feedback</span></li></a><a class=\"internal\" href=\"about\"><li><span>About qwebirc</span></li></a></ul>";
  });

this["qwebirc"]["templates"]["menubtn"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class='dropdown-tab'><img src='"
    + escapeExpression(((stack1 = depth0.icon),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "' title='menu' alt='menu'></div>";
  return buffer;
  });

this["qwebirc"]["templates"]["menuitem"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += " data-value='"
    + escapeExpression(((stack1 = depth0.value),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "'";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "<span class='hint'>"
    + escapeExpression(((stack1 = depth0.hint),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span>";
  return buffer;
  }

  buffer += "<a";
  stack1 = helpers['if'].call(depth0, depth0.value, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "><li><span>"
    + escapeExpression(((stack1 = depth0.text),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span>";
  stack2 = helpers['if'].call(depth0, depth0.hint, {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "</li></a>";
  return buffer;
  });

this["qwebirc"]["templates"]["message"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class='message "
    + escapeExpression(((stack1 = depth0['class']),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "'><span>"
    + escapeExpression(((stack1 = depth0.message),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span></div>";
  return buffer;
  });

this["qwebirc"]["templates"]["navbar"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"main-menu dropdown-tab\"><img src=\"images/icon.png\" title=\"menu\" alt=\"menu\"></div><div class=\"tabbar\"></div><div class=\"buttons\"><span class=\"to-left ui-icon ui-icon-circle-triangle-w hidden\" name=\"tabscroll\"></span><span class=\"to-right ui-icon ui-icon-circle-triangle-e hidden\" name=\"tabscroll\"></span><span class=\"add-chan ui-icon ui-icon-circle-plus\" title=\"Join a channel\"></span></div>";
  });

this["qwebirc"]["templates"]["nickMenu"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "<h5>"
    + escapeExpression(((stack1 = depth0.nick),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</h5>";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "<li data-exec=\"/QUERY "
    + escapeExpression(((stack1 = depth0.nick),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">query</li>";
  return buffer;
  }

function program5(depth0,data) {
  
  var stack1;
  stack1 = helpers.unless.call(depth0, depth0.theyOped, {hash:{},inverse:self.noop,fn:self.program(6, program6, data),data:data});
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  }
function program6(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "<li data-exec=\"/KICK "
    + escapeExpression(((stack1 = depth0.channel),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = depth0.nick),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">kick</li>";
  return buffer;
  }

function program8(depth0,data) {
  
  var stack1;
  stack1 = helpers['if'].call(depth0, depth0.weOped, {hash:{},inverse:self.noop,fn:self.program(9, program9, data),data:data});
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  }
function program9(depth0,data) {
  
  var stack1;
  stack1 = helpers.unless.call(depth0, depth0.theyOped, {hash:{},inverse:self.noop,fn:self.program(10, program10, data),data:data});
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  }
function program10(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "<li data-exec=\"/OP "
    + escapeExpression(((stack1 = depth0.nick),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">op</li>";
  return buffer;
  }

function program12(depth0,data) {
  
  var stack1;
  stack1 = helpers['if'].call(depth0, depth0.weOped, {hash:{},inverse:self.noop,fn:self.program(13, program13, data),data:data});
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  }
function program13(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "<li data-exec=\"/DEOP "
    + escapeExpression(((stack1 = depth0.nick),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">deop</li>";
  return buffer;
  }

function program15(depth0,data) {
  
  var stack1;
  stack1 = helpers['if'].call(depth0, depth0.weOped, {hash:{},inverse:self.noop,fn:self.program(16, program16, data),data:data});
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  }
function program16(depth0,data) {
  
  var stack1;
  stack1 = helpers.unless.call(depth0, depth0.theyVoiced, {hash:{},inverse:self.noop,fn:self.program(17, program17, data),data:data});
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  }
function program17(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "<li data-exec=\"/VOICE "
    + escapeExpression(((stack1 = depth0.nick),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">voice</li>";
  return buffer;
  }

function program19(depth0,data) {
  
  var stack1;
  stack1 = helpers['if'].call(depth0, depth0.weOped, {hash:{},inverse:self.noop,fn:self.program(20, program20, data),data:data});
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  }
function program20(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "<li data-exec=\"/DEVOICE "
    + escapeExpression(((stack1 = depth0.nick),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">devoice</li>";
  return buffer;
  }

  buffer += "<div class='nick-menu'>";
  stack1 = helpers['if'].call(depth0, depth0.showNick, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "<ul><li data-exec=\"/WHOIS "
    + escapeExpression(((stack1 = depth0.nick),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">whois</li>";
  stack2 = helpers['if'].call(depth0, depth0.notus, {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "<li data-exec=\"/ME "
    + escapeExpression(helpers.format.call(depth0, ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.fishSlap), {hash:{},data:data}))
    + "\">slap</li>";
  stack2 = helpers['if'].call(depth0, depth0.weOped, {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  stack2 = helpers['if'].call(depth0, depth0.notus, {hash:{},inverse:self.noop,fn:self.program(8, program8, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  stack2 = helpers['if'].call(depth0, depth0.notus, {hash:{},inverse:self.noop,fn:self.program(12, program12, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  stack2 = helpers['if'].call(depth0, depth0.notus, {hash:{},inverse:self.noop,fn:self.program(15, program15, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  stack2 = helpers['if'].call(depth0, depth0.notus, {hash:{},inverse:self.noop,fn:self.program(19, program19, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "</ul></div>";
  return buffer;
  });

this["qwebirc"]["templates"]["nickbtn"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class='user' data-user=\""
    + escapeExpression(((stack1 = depth0.nick),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"><span class=\"prefix\">"
    + escapeExpression(((stack1 = depth0.prefix),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span><span class='nick'>"
    + escapeExpression(((stack1 = depth0.nick),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span></div>";
  return buffer;
  });

this["qwebirc"]["templates"]["nickmenubtn"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<li>"
    + escapeExpression(((stack1 = depth0.text),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</li>";
  return buffer;
  });

this["qwebirc"]["templates"]["timestamp"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<span class='timestamp'>"
    + escapeExpression(((stack1 = depth0.time),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " </span>";
  return buffer;
  });

this["qwebirc"]["templates"]["topicBar"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); partials = this.merge(partials, Handlebars.partials); data = data || {};
  var buffer = "", stack1, self=this;

function program1(depth0,data) {
  
  var stack1;
  stack1 = self.invokePartial(partials.topicText, 'topicText', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  }

function program3(depth0,data) {
  
  
  return "&nbsp;";
  }

  buffer += "<div class='topic qui colourline'>";
  stack1 = helpers['if'].call(depth0, depth0.topic, {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</div>";
  return buffer;
  });

this["qwebirc"]["templates"]["topicText"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, self=this, functionType="function", escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  
  return "emptytopic";
  }

  buffer += "<span class='";
  stack1 = helpers['if'].call(depth0, depth0.empty, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "' title=\""
    + escapeExpression(((stack1 = depth0.topic),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">[<span>"
    + escapeExpression(((stack1 = depth0.topic),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span>]</span>";
  return buffer;
  });

this["qwebirc"]["templates"]["userlink"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var stack1, stack2;
  stack2 = ((stack1 = depth0.userid),typeof stack1 === functionType ? stack1.apply(depth0) : stack1);
  if(stack2 || stack2 === 0) { return stack2; }
  else { return ''; }
  }

function program3(depth0,data) {
  
  var stack1;
  return escapeExpression(((stack1 = depth0.nick),typeof stack1 === functionType ? stack1.apply(depth0) : stack1));
  }

  buffer += "<span class='hyperlink-whois' data-user='";
  stack1 = helpers['if'].call(depth0, depth0.userid, {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "'>"
    + escapeExpression(((stack1 = depth0.nick),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span>";
  return buffer;
  });

this["qwebirc"]["templates"]["window"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); partials = this.merge(partials, Handlebars.partials); data = data || {};
  var buffer = "", stack1, stack2, self=this, functionType="function", escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  var stack1;
  stack1 = self.invokePartial(partials.topicBar, 'topicBar', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  stack1 = helpers['if'].call(depth0, depth0.splitPane, {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "<div class=\"qui rightpanel\"></div>";
  return buffer;
  }
function program4(depth0,data) {
  
  var stack1;
  stack1 = self.invokePartial(partials.verticalDivider, 'verticalDivider', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  }

function program6(depth0,data) {
  
  var stack1;
  stack1 = self.invokePartial(partials.ircInput, 'ircInput', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  }

  buffer += "<div class=\"window qui\" data-id=\""
    + escapeExpression(((stack1 = depth0.id),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" data-name=\""
    + escapeExpression(((stack1 = depth0.name),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">";
  stack2 = helpers['if'].call(depth0, depth0.isChannel, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "<div class=\"qui content\"><div class=\"qui leftpanel lines\"></div>";
  stack2 = helpers['if'].call(depth0, depth0.isChannel, {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "</div><div class=\"qui properties\">";
  stack2 = self.invokePartial(partials.channelName, 'channelName', depth0, helpers, partials, data);
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "</div><div class=\"qui bottompanel\">";
  stack2 = helpers['if'].call(depth0, depth0.needsInput, {hash:{},inverse:self.noop,fn:self.program(6, program6, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "</div></div>";
  return buffer;
  });