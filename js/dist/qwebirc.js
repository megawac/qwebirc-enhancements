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
/*
Copyright (c) 2008-2009 the qwebirc project.
http://www.qwebirc.org/

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
version 2 as published by the Free Software Foundation.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.

Though it is not required, we would appreciate public facing
instances leaving a mention of the original author(s) and the
project name and URL in the about dialog, thanks!
*/

; (function(Epitome, undefined) {
    "use strict";
    var DEBUG = true;

    //common globals
    var document = window.document,
        $ = document.id,
        $$ = document.getElements;


    /* qwebirc -- Copyright (C) 2008-2011 Chris Porter and the qwebirc project --- All rights reserved. */

    var QWEBIRC_BUILD="bbc577ad5cb78d946ac1";

    //global object
    var qwebirc = _.merge(window.qwebirc || {}, {
        irc: {},
        ui: {
            themes: {}
        },
        util: {
            crypto: {}
        },
        global: {
            dynamicBaseURL: "/",
            staticBaseURL: "/"
        },
        config: {},
        auth: {},
        sound: {},
        lang: {},
        templates: {},
        cookies: {
            "options": "qweb-options",
            "history": "qweb-hist",
            "settings": "qweb-settings"
        },
        BUILD: QWEBIRC_BUILD,
        FILE_SUFFIX: "-" + QWEBIRC_BUILD,
        VERSION: "0.93-dev"
    });

    var irc = qwebirc.irc,

        util = qwebirc.util,
        crypto = util.crypto,

        config = qwebirc.config,
        auth = qwebirc.auth,

        ui = qwebirc.ui,
        themes = ui.themes,
        style = ui.style,

        cookies = qwebirc.cookies,

        sound = qwebirc.sound,//,

        lang = qwebirc.lang,

        templates = qwebirc.templates;


ui.WINDOW = {
    status: 1,
    query: 2,
    channel: 4,
    custom: 8,
    connect: 16,
    messages: 32
};

ui.CUSTOM_CLIENT = "custom";

ui.HIGHLIGHT = {
    none: 0,
    activity: 1,
    speech: 2,
    us: 3
};


irc.PMODE_LIST = 0;
irc.PMODE_SET_UNSET = 1;
irc.PMODE_SET_ONLY = 2;
irc.PMODE_REGULAR_MODE = 3;


var BROUHAHA = '#brouhaha',
    CONNECTION_DETAILS = 'Connection details',
    STATUS = 'Status',
    OPTIONS = 'Options',
    ACTIVE = '\x09ACTIVE',


    BASE_WINDOWS = [BROUHAHA, CONNECTION_DETAILS, STATUS],
    CHANNEL_TYPES = [ui.WINDOW.channel, ui.WINDOW.query, ui.WINDOW.messages],
    INPUT_TYPES = [ui.WINDOW.status, ui.WINDOW.query, ui.WINDOW.channel, ui.WINDOW.messages];

var OPED = "+",
    DEOPED = "-",
    OPSTATUS = "@",
    VOICESTATUS = "+";

irc.IRCLowercaseTable = [ /* x00-x07 */ '\x00', '\x01', '\x02', '\x03', '\x04', '\x05', '\x06', '\x07',
    /* x08-x0f */
    '\x08', '\x09', '\x0a', '\x0b', '\x0c', '\x0d', '\x0e', '\x0f',
    /* x10-x17 */
    '\x10', '\x11', '\x12', '\x13', '\x14', '\x15', '\x16', '\x17',
    /* x18-x1f */
    '\x18', '\x19', '\x1a', '\x1b', '\x1c', '\x1d', '\x1e', '\x1f',
    /* ' '-x27 */
    ' ', '!', '"', '#', '$', '%', '&', '\x27',
    /* '('-'/' */
    '(', ')', '*', '+', ',', '-', '.', '/',
    /* '0'-'7' */
    '0', '1', '2', '3', '4', '5', '6', '7',
    /* '8'-'?' */
    '8', '9', ':', ';', '<', '=', '>', '?',
    /* '@'-'G' */
    '@', 'a', 'b', 'c', 'd', 'e', 'f', 'g',
    /* 'H'-'O' */
    'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
    /* 'P'-'W' */
    'p', 'q', 'r', 's', 't', 'u', 'v', 'w',
    /* 'X'-'_' */
    'x', 'y', 'z', '{', '|', '}', '~', '_',
    /* '`'-'g' */
    '`', 'a', 'b', 'c', 'd', 'e', 'f', 'g',
    /* 'h'-'o' */
    'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
    /* 'p'-'w' */
    'p', 'q', 'r', 's', 't', 'u', 'v', 'w',
    /* 'x'-x7f */
    'x', 'y', 'z', '{', '|', '}', '~', '\x7f',
    /* x80-x87 */
    '\x80', '\x81', '\x82', '\x83', '\x84', '\x85', '\x86', '\x87',
    /* x88-x8f */
    '\x88', '\x89', '\x8a', '\x8b', '\x8c', '\x8d', '\x8e', '\x8f',
    /* x90-x97 */
    '\x90', '\x91', '\x92', '\x93', '\x94', '\x95', '\x96', '\x97',
    /* x98-x9f */
    '\x98', '\x99', '\x9a', '\x9b', '\x9c', '\x9d', '\x9e', '\x9f',
    /* xa0-xa7 */
    '\xa0', '\xa1', '\xa2', '\xa3', '\xa4', '\xa5', '\xa6', '\xa7',
    /* xa8-xaf */
    '\xa8', '\xa9', '\xaa', '\xab', '\xac', '\xad', '\xae', '\xaf',
    /* xb0-xb7 */
    '\xb0', '\xb1', '\xb2', '\xb3', '\xb4', '\xb5', '\xb6', '\xb7',
    /* xb8-xbf */
    '\xb8', '\xb9', '\xba', '\xbb', '\xbc', '\xbd', '\xbe', '\xbf',
    /* xc0-xc7 */
    '\xe0', '\xe1', '\xe2', '\xe3', '\xe4', '\xe5', '\xe6', '\xe7',
    /* xc8-xcf */
    '\xe8', '\xe9', '\xea', '\xeb', '\xec', '\xed', '\xee', '\xef',
    /* xd0-xd7 */
    '\xf0', '\xf1', '\xf2', '\xf3', '\xf4', '\xf5', '\xf6', '\xd7',
    /* xd8-xdf */
    '\xf8', '\xf9', '\xfa', '\xfb', '\xfc', '\xfd', '\xfe', '\xdf',
    /* xe0-xe7 */
    '\xe0', '\xe1', '\xe2', '\xe3', '\xe4', '\xe5', '\xe6', '\xe7',
    /* xe8-xef */
    '\xe8', '\xe9', '\xea', '\xeb', '\xec', '\xed', '\xee', '\xef',
    /* xf0-xf7 */
    '\xf0', '\xf1', '\xf2', '\xf3', '\xf4', '\xf5', '\xf6', '\xf7',
    /* xf8-xff */
    '\xf8', '\xf9', '\xfa', '\xfb', '\xfc', '\xfd', '\xfe', '\xff'
];

// irc.Numerics = {
//     "001": "RPL_WELCOME",
//     "004": "RPL_MYINFO",
//     "005": "RPL_ISUPPORT",
//     "353": "RPL_NAMREPLY",
//     "366": "RPL_ENDOFNAMES",

//     "331": "RPL_NOTOPIC",
//     "332": "RPL_TOPIC",
//     "333": "RPL_TOPICWHOTIME",

//     "311": "RPL_WHOISUSER",
//     "312": "RPL_WHOISSERVER",
//     "313": "RPL_WHOISOPERATOR",
//     "317": "RPL_WHOISIDLE",
//     "671": "RPL_WHOISSECURE",
//     "318": "RPL_ENDOFWHOIS",
//     "319": "RPL_WHOISCHANNELS",
//     "330": "RPL_WHOISACCOUNT",
//     "338": "RPL_WHOISACTUALLY",
//     "343": "RPL_WHOISOPERNAME",
//     "320": "RPL_WHOISGENERICTEXT",
//     "325": "RPL_WHOISWEBIRC",

//     "301": "RPL_AWAY",
//     "305": "RPL_UNAWAY",
//     "306": "RPL_NOWAWAY",

//     "324": "RPL_CHANNELMODEIS",
//     "329": "RPL_CREATIONTIME",

//     "433": "ERR_NICKNAMEINUSE",
//     "401": "ERR_NOSUCHNICK",
//     "404": "ERR_CANNOTSENDTOCHAN",
//     "482": "ERR_CHANOPPRIVSNEEDED",

//     "321": "RPL_LISTSTART",
//     "322": "RPL_LIST",
//     "323": "RPL_LISTEND"
// };

//https://www.alien.net.au/irc/irc2numerics.html
irc.Numerics2 = { // from node-irc
    "001": {
        "name": "RPL_WELCOME",
        "type": "reply"
    },
    "004": {
        "name": "RPL_MYINFO",
        "type": "reply"
    },
    "005": {
        "name": "RPL_ISUPPORT",
        "type": "reply"
    },
    "200": {
        "name": "RPL_TRACELINK",
        "type": "reply"
    },
    "201": {
        "name": "RPL_TRACECONNECTING",
        "type": "reply"
    },
    "202": {
        "name": "RPL_TRACEHANDSHAKE",
        "type": "reply"
    },
    "203": {
        "name": "RPL_TRACEUNKNOWN",
        "type": "reply"
    },
    "204": {
        "name": "RPL_TRACEOPERATOR",
        "type": "reply"
    },
    "205": {
        "name": "RPL_TRACEUSER",
        "type": "reply"
    },
    "206": {
        "name": "RPL_TRACESERVER",
        "type": "reply"
    },
    "208": {
        "name": "RPL_TRACENEWTYPE",
        "type": "reply"
    },
    "211": {
        "name": "RPL_STATSLINKINFO",
        "type": "reply"
    },
    "212": {
        "name": "RPL_STATSCOMMANDS",
        "type": "reply"
    },
    "213": {
        "name": "RPL_STATSCLINE",
        "type": "reply"
    },
    "214": {
        "name": "RPL_STATSNLINE",
        "type": "reply"
    },
    "215": {
        "name": "RPL_STATSILINE",
        "type": "reply"
    },
    "216": {
        "name": "RPL_STATSKLINE",
        "type": "reply"
    },
    "218": {
        "name": "RPL_STATSYLINE",
        "type": "reply"
    },
    "219": {
        "name": "RPL_ENDOFSTATS",
        "type": "reply"
    },
    "221": {
        "name": "RPL_UMODEIS",
        "type": "reply"
    },
    "241": {
        "name": "RPL_STATSLLINE",
        "type": "reply"
    },
    "242": {
        "name": "RPL_STATSUPTIME",
        "type": "reply"
    },
    "243": {
        "name": "RPL_STATSOLINE",
        "type": "reply"
    },
    "244": {
        "name": "RPL_STATSHLINE",
        "type": "reply"
    },
    "250": {
        "name": "RPL_STATSCONN",
        "type": "reply"
    },
    "251": {
        "name": "RPL_LUSERCLIENT",
        "type": "reply"
    },
    "252": {
        "name": "RPL_LUSEROP",
        "type": "reply"
    },
    "253": {
        "name": "RPL_LUSERUNKNOWN",
        "type": "reply"
    },
    "254": {
        "name": "RPL_LUSERCHANNELS",
        "type": "reply"
    },
    "255": {
        "name": "RPL_LUSERME",
        "type": "reply"
    },
    "256": {
        "name": "RPL_ADMINME",
        "type": "reply"
    },
    "257": {
        "name": "RPL_ADMINLOC1",
        "type": "reply"
    },
    "258": {
        "name": "RPL_ADMINLOC2",
        "type": "reply"
    },
    "259": {
        "name": "RPL_ADMINEMAIL",
        "type": "reply"
    },
    "261": {
        "name": "RPL_TRACELOG",
        "type": "reply"
    },
    "265": {
        "name": "RPL_LOCALUSERS",
        "type": "reply"
    },
    "266": {
        "name": "RPL_GLOBALUSERS",
        "type": "reply"
    },
    "300": {
        "name": "RPL_NONE",
        "type": "reply"
    },
    "301": {
        "name": "RPL_AWAY",
        "type": "reply"
    },
    "302": {
        "name": "RPL_USERHOST",
        "type": "reply"
    },
    "303": {
        "name": "RPL_ISON",
        "type": "reply"
    },
    "305": {
        "name": "RPL_UNAWAY",
        "type": "reply"
    },
    "306": {
        "name": "RPL_NOWAWAY",
        "type": "reply"
    },
    "311": {
        "name": "RPL_WHOISUSER",
        "type": "reply"
    },
    "312": {
        "name": "RPL_WHOISSERVER",
        "type": "reply"
    },
    "313": {
        "name": "RPL_WHOISOPERATOR",
        "type": "reply"
    },
    "314": {
        "name": "RPL_WHOWASUSER",
        "type": "reply"
    },
    "315": {
        "name": "RPL_ENDOFWHO",
        "type": "reply"
    },
    "317": {
        "name": "RPL_WHOISIDLE",
        "type": "reply"
    },
    "318": {
        "name": "RPL_ENDOFWHOIS",
        "type": "reply"
    },
    "319": {
        "name": "RPL_WHOISCHANNELS",
        "type": "reply"
    },

    "320": {
        "name": "RPL_WHOISGENERICTEXT",
        "type": "reply"
    },
    "325": {
        "name": "RPL_WHOISWEBIRC",
        "type": "reply"
    },
    "330": {
        "name": "RPL_WHOISACCOUNT",
        "type": "reply"
    },
    "338": {
        "name": "RPL_WHOISACTUALLY",
        "type": "reply"
    },
    "343": {
        "name": "RPL_WHOISOPERNAME",
        "type": "reply"
    },
    "321": {
        "name": "RPL_LISTSTART",
        "type": "reply"
    },
    "322": {
        "name": "RPL_LIST",
        "type": "reply"
    },
    "323": {
        "name": "RPL_LISTEND",
        "type": "reply"
    },
    "324": {
        "name": "RPL_CHANNELMODEIS",
        "type": "reply"
    },
    "329": {
        "name": "RPL_CREATIONTIME",
        "type": "reply"
    },
    "331": {
        "name": "RPL_NOTOPIC",
        "type": "reply"
    },
    "332": {
        "name": "RPL_TOPIC",
        "type": "reply"
    },
    "333": {
        "name": "RPL_TOPICWHOTIME",
        "type": "reply"
    },
    "341": {
        "name": "RPL_INVITING",
        "type": "reply"
    },
    "342": {
        "name": "RPL_SUMMONING",
        "type": "reply"
    },
    "351": {
        "name": "RPL_VERSION",
        "type": "reply"
    },
    "352": {
        "name": "RPL_WHOREPLY",
        "type": "reply"
    },
    "353": {
        "name": "RPL_NAMREPLY",
        "type": "reply"
    },
    "364": {
        "name": "RPL_LINKS",
        "type": "reply"
    },
    "365": {
        "name": "RPL_ENDOFLINKS",
        "type": "reply"
    },
    "366": {
        "name": "RPL_ENDOFNAMES",
        "type": "reply"
    },
    "367": {
        "name": "RPL_BANLIST",
        "type": "reply"
    },
    "368": {
        "name": "RPL_ENDOFBANLIST",
        "type": "reply"
    },
    "369": {
        "name": "RPL_ENDOFWHOWAS",
        "type": "reply"
    },
    "371": {
        "name": "RPL_INFO",
        "type": "reply"
    },
    "372": {
        "name": "RPL_MOTD",
        "type": "reply"
    },
    "374": {
        "name": "RPL_ENDOFINFO",
        "type": "reply"
    },
    "375": {
        "name": "RPL_MOTDSTART",
        "type": "reply"
    },
    "376": {
        "name": "RPL_ENDOFMOTD",
        "type": "reply"
    },
    "381": {
        "name": "RPL_YOUREOPER",
        "type": "reply"
    },
    "382": {
        "name": "RPL_REHASHING",
        "type": "reply"
    },
    "391": {
        "name": "RPL_TIME",
        "type": "reply"
    },
    "392": {
        "name": "RPL_USERSSTART",
        "type": "reply"
    },
    "393": {
        "name": "RPL_USERS",
        "type": "reply"
    },
    "394": {
        "name": "RPL_ENDOFUSERS",
        "type": "reply"
    },
    "395": {
        "name": "RPL_NOUSERS",
        "type": "reply"
    },
    "401": {
        "name": "ERR_NOSUCHNICK",
        "type": "error"
    },
    "402": {
        "name": "ERR_NOSUCHSERVER",
        "type": "error"
    },
    "403": {
        "name": "ERR_NOSUCHCHANNEL",
        "type": "error"
    },
    "404": {
        "name": "ERR_CANNOTSENDTOCHAN",
        "type": "error"
    },
    "405": {
        "name": "ERR_TOOMANYCHANNELS",
        "type": "error"
    },
    "406": {
        "name": "ERR_WASNOSUCHNICK",
        "type": "error"
    },
    "407": {
        "name": "ERR_TOOMANYTARGETS",
        "type": "error"
    },
    "409": {
        "name": "ERR_NOORIGIN",
        "type": "error"
    },
    "411": {
        "name": "ERR_NORECIPIENT",
        "type": "error"
    },
    "412": {
        "name": "ERR_NOTEXTTOSEND",
        "type": "error"
    },
    "413": {
        "name": "ERR_NOTOPLEVEL",
        "type": "error"
    },
    "414": {
        "name": "ERR_WILDTOPLEVEL",
        "type": "error"
    },
    "421": {
        "name": "ERR_UNKNOWNCOMMAND",
        "type": "error"
    },
    "422": {
        "name": "ERR_NOMOTD",
        "type": "error"
    },
    "423": {
        "name": "ERR_NOADMININFO",
        "type": "error"
    },
    "424": {
        "name": "ERR_FILEERROR",
        "type": "error"
    },
    "431": {
        "name": "ERR_NONICKNAMEGIVEN",
        "type": "error"
    },
    "432": {
        "name": "ERR_ERRONEUSNICKNAME",
        "type": "error"
    },
    "433": {
        "name": "ERR_NICKNAMEINUSE",
        "type": "error"
    },
    "436": {
        "name": "ERR_NICKCOLLISION",
        "type": "error"
    },
    "441": {
        "name": "ERR_USERNOTINCHANNEL",
        "type": "error"
    },
    "442": {
        "name": "ERR_NOTONCHANNEL",
        "type": "error"
    },
    "443": {
        "name": "ERR_USERONCHANNEL",
        "type": "error"
    },
    "444": {
        "name": "ERR_NOLOGIN",
        "type": "error"
    },
    "445": {
        "name": "ERR_SUMMONDISABLED",
        "type": "error"
    },
    "446": {
        "name": "ERR_USERSDISABLED",
        "type": "error"
    },
    "451": {
        "name": "ERR_NOTREGISTERED",
        "type": "error"
    },
    "461": {
        "name": "ERR_NEEDMOREPARAMS",
        "type": "error"
    },
    "462": {
        "name": "ERR_ALREADYREGISTRED",
        "type": "error"
    },
    "463": {
        "name": "ERR_NOPERMFORHOST",
        "type": "error"
    },
    "464": {
        "name": "ERR_PASSWDMISMATCH",
        "type": "error"
    },
    "465": {
        "name": "ERR_YOUREBANNEDCREEP",
        "type": "error"
    },
    "467": {
        "name": "ERR_KEYSET",
        "type": "error"
    },
    "471": {
        "name": "ERR_CHANNELISFULL",
        "type": "error"
    },
    "472": {
        "name": "ERR_UNKNOWNMODE",
        "type": "error"
    },
    "473": {
        "name": "ERR_INVITEONLYCHAN",
        "type": "error"
    },
    "474": {
        "name": "ERR_BANNEDFROMCHAN",
        "type": "error"
    },
    "475": {
        "name": "ERR_BADCHANNELKEY",
        "type": "error"
    },
    "481": {
        "name": "ERR_NOPRIVILEGES",
        "type": "error"
    },
    "482": {
        "name": "ERR_CHANOPPRIVSNEEDED",
        "type": "error"
    },
    "483": {
        "name": "ERR_CANTKILLSERVER",
        "type": "error"
    },
    "491": {
        "name": "ERR_NOOPERHOST",
        "type": "error"
    },
    "501": {
        "name": "ERR_UMODEUNKNOWNFLAG",
        "type": "error"
    },
    "502": {
        "name": "ERR_USERSDONTMATCH",
        "type": "error"
    }
}
var whitespace = /\s/,
    notwhitespace = /\S+$/;

//my helper functions
//returns itself
var join = function(by, xs) {
        return xs.join(by);
    },

    split = function(by, str) {
        return str.split(by);
    },

    restRight = _.autoCurry(function(xs) {
        return xs.slice(0, xs.length - 1);
    }),

    test = _.autoCurry(function(reg, str) {
        return str.test(reg);
    }),

    replace = _.autoCurry(function(reg, rep, str) {
        return str.replace(reg, rep);
    }),

    startsWith = function(what, str) {
        return str.startsWith(what);
    },

    $identity = _.identity,

    // splitBang = _.partial(split, "!"),

    // joinBang = _.partial(join, "!"),

    joinEmpty = _.partial(join, ""),

    // splitEmpty = split(""),
    joinComma = util.joinChans = _.partial(join, ","),

    // splitComma = split(","),
    concatUnique = _.compose(_.uniq, Array.concat),

    concatSep = _.autoCurry(function(sep, s1, s2) {
        if (_.isArray(s1)) {
            s1 = s1.join(sep);
        }
        if (_.isArray(s2)) {
            s2 = s2.join(sep);
        }
        if (s1 !== "" && s2 !== "") {
            return s1 + sep + s2;
        } else {
            return s1 + s2;
        }
    }),

    concatSpace = concatSep(" ");

util.format = util.formatter = function(message, data) {
    return (message.message || message).substitute(data);
};

util.formatSafe = util.formatterSafe = function(str, object, regexp) { //if property not found string is not replaced
    return String(str).replace(regexp || (/\\?\{([^{}]+)\}/g), function(match, name) {
        if (match.charAt(0) == '\\') return match.slice(1);
        return (object[name] != null) ? object[name] : match;
    });
}

//String -> String
// megawac!~megawac@megawac.user.gamesurge -> megawac
// util.hostToNick = _.compose(joinBang, restRight, splitBang);
//megawac!~megawac@megawac.user.gamesurge -> ~megawac@megawac.user.gamesurge
// util.hostToHost = _.compose(Array.getLast, splitBang);


var isChannel = util.isChannel = _.and('.length > 1', _.partial(startsWith, '#')),

    formatChannel = util.formatChannel = function(chan) {
        if (chan.length >= 1 && !isChannel(chan)) {
            chan = '#' + chan;
        }
        return chan;
    },

    unformatChannel = util.unformatChannel = function(chan) {
        if (isChannel(chan)) {
            chan = chan.slice(1);
        }
        return chan;
    },

    appendChannel = function(chans, chan) {
        return $A(chans).concat(chan);
    },

    splitChan = util.splitChans = function(xs) {
        if (_.isArray(xs)) return xs.length > 0 ? xs : [""];
        return xs.split(",");
    },

    //function to determine if a string is one of the stock windows
    isBaseWindow = util.isBaseWindow = _.partial(_.contains, BASE_WINDOWS),

    isChannelType = util.isChannelType = _.partial(_.contains, CHANNEL_TYPES);


util.windowNeedsInput = _.partial(_.contains, INPUT_TYPES);

//String -> String
//formatChannelStrings("test,test2,#test3,#tes#t4,test5,test6") => "#test,#test2,#test3,#tes#t4,#test5,#test6"
util.formatChannelString = _.compose(joinComma, _.uniq, _.partial(_.func.map, formatChannel), splitChan);
util.unformatChannelString = _.compose(_.uniq, _.partial(_.func.map, unformatChannel), splitChan);

util.formatURL = function(link) {
    link = util.isChannel(link) ? link.replace("#", "@") : link;
    return '#!' + link;
}

util.unformatURL = function(link) {
    return link.replace(/^!/, "").replace(/^@/, "#");
};

//appends a channel to the end of the list of channels
//string -> string
//could just call Array.include?
util.addChannel = _.compose( /*joinComma,*/ _.uniq, /* splitChan, */ appendChannel);
//adds channel to front of list of channels
util.prependChannel = _.compose( /*joinComma,*/ _.uniq, /* splitChan, */ _.flip(appendChannel));

util.removeChannel = _.compose(_.uniq, function(chans, chan) {
    return _.clone(chans).erase(chan);
});

(function() {
/*
 * taken from https://github.com/martynsmith/node-irc
 * parseMessage(line, stripColors)
 *
 * takes a raw "line" from the IRC server and turns it into an object with
 * useful keys
 * ":OCD!~OCD@76.72.16.142 PRIVMSG #tf2mix :mix servers are down. join mumble for an inhouse pug." => {"prefix":"OCD!~OCD@76.72.16.142","nick":"OCD","user":"~OCD","host":"76.72.16.142","command":"PRIVMSG","rawCommand":"PRIVMSG","commandType":"normal","args":["#tf2mix","mix servers are down. join mumble for an inhouse pug."]}
 */

var prefix_re = /^([_a-zA-Z0-9\[\]\\`^{}|-]*)(!([^@]+)@(.*))?$/,
    hasprefix_re = /^:([^ ]+) +/,
    colonrem_re = /^:[^ ]+ +/,
    command_re = /^([^ ]+) */,
    data_re = /^[^ ]+ +/,
    args_re = /^:|\s+:/,
    argsm_re = /(.*?)(?:^:|\s+:)(.*)/,
    args_split_re = / +/,
    NUMERICS = irc.Numerics2;
util.parseIRCData = function(line/*, stripColors*/) {
    var message = {
        'raw': line,
        'prefix': '',
        'commandType': 'normal'
    };
    var match;

    /*if (stripColors) {
        line = line.replace(/[\x02\x1f\x16\x0f]|\x03\d{0,2}(?:,\d{0,2})?/g, "");
    }*/

    // Parse prefix
    if (match = line.match(hasprefix_re)) {
        message.prefix = match[1];
        line = line.replace(colonrem_re, '');
        if (match = message.prefix.match(prefix_re)) {
            message.nick = match[1];
            message.user = match[3];
            message.host = match[4];
        } else {
            message.server = message.prefix;
        }
    }

    // Parse command
    match = line.match(command_re);
    message.command = match[1].toUpperCase();
    message.rawCommand = match[1];
    line = line.replace(data_re, '');

    if (NUMERICS[message.rawCommand]) {
        message.command = NUMERICS[message.rawCommand].name;
        message.commandType = NUMERICS[message.rawCommand].type;
    }

    message.args = [];
    var middle, trailing;

    // Parse parameters
    if (line.search(args_re) != -1) {
        match = line.match(argsm_re);
        middle = match[1].trimRight();
        trailing = match[2];
    } else {
        middle = line;
    }

    if (middle.length) message.args = middle.split(args_split_re);

    if (!_.isUndefined(trailing) && trailing.length) message.args.push(trailing);

    return message;
};
util.processTwistedData = function(data) {
    var message = {
        commandType: 'normal',
        rawCommand: data[1],
        command: data[1],
        args: data[3],
        prefix: data[2]
    },
    match;
    if(NUMERICS[data[1]]) {
        message.command = NUMERICS[data[1]].name;
        message.commandType = NUMERICS[data[1]].type
    }
    if (match = message.prefix.match(prefix_re)) {
        message.nick = match[1];
        message.user = match[3];
        message.host = match[4];
    } else {
        message.server = message.prefix;
    }
    return message;
}
})();

util.formatCommand = function(cmdline) {
    if (cmdline.startsWith("/")) {
        cmdline = cmdline.startsWith("//") ? "SAY /" + cmdline.slice(2) : cmdline.slice(1); //qweb issue #349
    } else {
        cmdline = "SAY " + cmdline; //default just say the msg
    }
    return cmdline.splitMax(" ", 2); //split command from the params
};
util.nickChanComparitor = function(client, nickHash) {
    var _prefixes = client.prefixes,
        _prefixNone = _prefixes.length,
        prefixWeight = function(pre) {
            return pre.length !== 0 ? _prefixes.indexOf(pre) : _prefixNone;
        },
        toLower = client.toIRCLower;
    //compares two nick names by channel status > lexigraphy
    return function(nick1, nick2) {
        var p1weight = prefixWeight(nickHash[nick1].prefixes),
            p2weight = prefixWeight(nickHash[nick2].prefixes);
        return (p1weight !== p2weight) ? (p1weight - p2weight) : toLower(nick1).localeCompare(toLower(nick2));
    };
};

util.validPrefix = _.contains;

util.addPrefix = function(nc, pref, prefs) {
    if (prefs && !util.validPrefix(prefs, pref)) return nc.prefixes;
    return nc.prefixes = concatUnique(nc.prefixes, pref).join("");
};

util.removePrefix = function(nc, pref) {
    return nc.prefixes = nc.prefixes.replaceAll(pref, "");
};

//if theres a prefix it gets returned
//i dont think its possible to have multiple prefixes
util.prefixOnNick = _.autoCurry(function(prefixes, nick) {
    var c = nick.charAt(0);
    return util.validPrefix(prefixes, c) ? [c, nick.slice(1)] : ['', nick];
});

util.getPrefix = _.compose(_.first, util.prefixOnNick);

util.stripPrefix = _.compose(_.lambda('x[1]'), util.prefixOnNick);

util.createWordRegex = function(word) {
    return new RegExp('\\b' + String.escapeRegExp(word) + '\\b', "i");//=> /\bmegawac\b/i
};

util.testForNick = _.autoCurry(function(nick, text) {
    return util.createWordRegex(nick).test(text);
});

util.toHSBColour = function(nick, client) {
    var lower = client.toIRCLower(util.stripPrefix(client.prefixes, nick));
    if (lower == client.lowerNickname) return null;

    var hash = 0;
    for (var i = 0; i < lower.length; i++)
    hash = 31 * hash + lower.charCodeAt(i);

    var hue = Math.abs(hash) % 360;

    return new Color([hue, 70, 60], "hsb");
};


//helper functions
var charIRCLower = _.compose(_.partial(_.item, irc.IRCLowercaseTable), _.lambda('x.charCodeAt(0)'));

//returns the lower case value of a RFC1459 string using the irc table
//called a fuck ton so memoization is incredible here
irc.RFC1459toIRCLower = _.memoize(_.compose(joinEmpty, _.partial(_.func.map, charIRCLower)));

//not really sure
//takes a irc client object and string and returns something
irc.toIRCCompletion = _.compose(replace(/[^\w]+/g, ""), _.partial(_.func.invoke, "toIRCLower"));

irc.ASCIItoIRCLower = String.toLowerCase;

util.getStyleByName = function(name) {
    return _.findWhere(irc.styles, {
        name: name
    });
};

util.getStyleByKey = function(key) {
    return _.findWhere(irc.styles, {
        key: _.toInt(key)
    });
};

util.getColourByName = function(name) {
    return _.findWhere(irc.colours, {
        name: name
    });
};

util.getColourByKey = function(key) {
    return _.findWhere(irc.colours, {
        key: _.toInt(key)
    });
};

util.longtoduration = function(l) {
    var seconds = l % 60;
    var minutes = Math.floor((l % 3600) / 60);
    var hours = Math.floor((l % (3600 * 24)) / 3600);
    var days = Math.floor(l / (24 * 3600));

    return days + " days " + hours + " hours " + minutes + " minutes " + seconds + " seconds";
};

//pads based on the ret of a condition
var pad = util.pad = _.autoCurry(function(cond, padding, str) {
    str = String(str);
    return cond(str) ? padding + str : str;
});

util.padzero = pad(_.lambda('.length<=1'), "0");
util.padspace = pad(_.lambda('.length!==0'), " ");

util.getEnclosedWord = function(str, pos) {
    pos = pos >>> 0; //type safety coerce int
    // Search for the word's beginning and end.
    var left = str.slice(0, pos + 1).search(notwhitespace),
        right = str.slice(pos).search(whitespace),

        // The last word in the string is a special case.
        // Return the word, using the located bounds to extract it from the string.
        word = right < 0 ? str.slice(left) : str.slice(left, right + pos);

    return [left, word];
};

// NOT cryptographically secure! 
//http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
util.randHexString = function(numBytes) {
    var id = "";
    for (; numBytes > 0; numBytes--) {
        id += (((1 + Math.random()) * 0x100) | 0).toString(16).slice(1);
    }
    return id;
};


util.IRCTimestamp = function(date) {
    // return "[" + util.padzero(date.getHours()) + ":" + util.padzero(date.getMinutes()) + "]";
    return date.format("[%H:%M]");
};

util.IRCDate = function(date) {
    return date.format("%c");
};

irc.nickChanEntry = function(p, l) {
    return {
        prefixes: p || "",
        lastSpoke: l || 0
    };
};

util.noop = function() {};

Browser.isMobile = !(Browser.Platform.win || Browser.Platform.mac || Browser.Platform.linux);

Browser.isDecent = !Browser.isMobile || !(!Browser.ie || Browser.version < 9);

util.generateID = (function() {
    var id = 0;
    return function() {
        return "qqa-" + id++;
    };
})();

(function() {

    var types = {
        ERROR: 0,
        INFO: 1,
        SERVER: 2,
        CHAN: 3,
        MESSAGE: 4
    };

    var message = function(msg, type) {
        return {
            message: msg,
            type: type
        };
    };

    //language specific stuff. right now just an object
    // can either be a message or array of messages
    _.extend(lang, {
        TYPES: types,
        message: message,

        loginMessages: [message("Hint #1! When you close a channel this one will be deleted from your favorites and won't come back on the next connection.", types.INFO),
                        message("Hint #2! To join a new channel type this command in the chat box: /j #channel", types.INFO)],
        joinAfterAuth: message("Waiting for login before joining channels...", types.INFO),
        authFailed: [message("Could not auth with IRC network - waited 5 seconds.", types.ERROR),
                    message("Otherwise reattempt authing by sending: \"/AUTH <your username> <your password>\"", types.ERROR),
                    message("To ignore the error and join channels, unauthed, type: \"/autojoin\".", types.ERROR)],
        signOn: message("SIGNON", types.SERVER),
        joinChans: message("Joining channels...", types.INFO),
        noTopic: "(No topic set.)",

        changeTopicNeedsOp: "Sorry, you need to be a channel operator to change the topic!",
        changeTopicConfirm: "Change topic of {channel} to:",

        poorJoinFormat: message("Channel names begin with # (corrected automatically).", types.INFO),
        waitToJoin: message("You recently tried to join {channel}. To prevent join-flooding, please wait {time} seconds before reattempting or type /fjoin {channel} to ignore this warning...", types.ERROR),
        invalidCommand: message("Can't use this command in this window", types.ERROR),
        invalidChanTarget: message("Can't target a channel with this command.", types.ERROR),
        insufficentArgs: message("Insufficient arguments for command.", types.ERROR),

        loadingPage: "Loading . . .",
        fishSlap: "slaps {nick} with a large fishbot",

        copyright: [message("qwebirc v" + qwebirc.VERSION, types.INFO),
                    message("Copyright (C) 2008-2011 Chris Porter and the qwebirc project.", types.INFO),
                    message("Current version by Emanuel \"megawac\" Jackstare", types.INFO),
                    message("http://www.qwebirc.org", types.INFO),
                    message("Licensed under the GNU General Public License, Version 2.", types.INFO)],

        alertNotice: "Alert!",
        activityNotice: "Activity!",
        partChan: "Part",
        logOut: message("Logged out", types.MESSAGE),
        quit: "Page closed",
        disconnected: message("Client has been disconnected", types.INFO),

        uncontrolledFlood: message("ERROR: uncontrolled flood detected -- disconnected.", types.ERROR),
        connError: message("An error occured: {1}", types.ERROR),
        connRetry: message("Connection lost: retrying in {next} secs", types.ERROR),
        connTimeOut: message("Error: connection closed after {retryAttempts} requests failed.", types.ERROR),
        connectionFail: message("Couldn't connect to remote server.", types.ERROR),

        closeTab: "Close tab",
        detachWindow: "Detach Window",

        invalidNick: "Your nickname was invalid and has been corrected; please check your altered nickname and press Connect again.",
        missingNick: "You must supply a nickname",
        missingPass: "You must supply a password.",
        missingAuthInfo: "You must supply your username and password in auth mode.",


        //options
        DEDICATED_MSG_WINDOW: "Send privmsgs to dedicated messages window",
        DEDICATED_NOTICE_WINDOW: "Send notices to dedicated message window",
        NICK_OV_STATUS: "Show status (@/+) before nicknames in channel lines",
        ACCEPT_SERVICE_INVITES: "Automatically join channels when invited",
        USE_HIDDENHOST: "Hide your hostmask when authed (+x)",
        LASTPOS_LINE: "Show a last position indicator for each window",
        NICK_COLOURS: "Automatically colour nicknames",
        HIDE_JOINPARTS: "Hide JOINS/PARTS/QUITS",
        STYLE_HUE: "Adjust user interface hue",
        SHOW_NICKLIST: "Show nickname list in channels",
        SHOW_TIMESTAMPS: "Show timestamps",
        FONT_SIZE: "Set font size",
        VOLUME: "Volume",


        AUTO_OPEN_PM: "Automatically select window on private message:",
        FLASH: "flash",
        BEEP: "beep",
        PM: "pm",
        MENTION: "mentioned",
        MESSAGE_PLACEHOLDER: ' something ... ',
        NICK_PLACEHOLDER: ' someone ... ',
        TYPE_PLACEHOLDER: 'type test',
        DELETE_NOTICE: 'remove',
        ADD_NOTICE: 'Add notifier',
        USER_NOTICE: 'User:',
        TYPE_NOTICE: 'Type:',
        MESSAGE_NOTICE: 'Message:',
        AUTOESCAPE: 'Escape text',
        MENTIONED: 'Mentioned',
        ESCAPE_HINT: 'This text is transformed into a regular expressions - autoescaping will check for the exact text you entered',
        DESKTOP_NOTICES: 'Allow us to send desktop notifications if supported (on any notice with flash):',
        IGNORE_CASE: 'Case insensitive',
        NOTUS: "Not us",
        NOTUS_HINT: "Not our message",
        HIGHLIGHT: "hl",
        HIGHLIGHT_HINT: "highlight",

        ENABLE: 'Enable',
        DISABLE: 'Disable'
    });

})();

Epitome.View.implement({
    template: function(data, template) {
        // refactored for handlebars
        template = template || this.options.template;
        return template(data);
    }
});


var storage = util.storage = new Storage({
    duration: 365,
    domain: '/',
    debug: DEBUG
}),

session = util.sessionStorage = new Storage({
    storageType: 'sessionStorage',
    duration: 1,
    debug: DEBUG,
    fallback: false
});

//simple wrapper class
//object.append breaks prototypes :/
var Storer = util.Storer = new Class({
    initialize: function(name, storer) {
        this.name = name;
        this.storage = storer || storage;
    },
    get: function() {
        return this.storage.get(this.name);
    },
    set: function(val) {
        return this.storage.set(this.name, val);
    },
    dispose: function() {
        return this.storage.remove(this.name);
    }
});
ui.Behaviour = (function() {
    var behaviour = new Behavior();
    var delegator = new Delegator({
        getBehavior: function(){ return behaviour; }
    });
    return {
        apply: function($ele) {
            behaviour.apply($ele);
            delegator.attach($ele);
        }
    };
})();
  
var getTemplate = util.getTemplate = function(name, cb, options) {
    /*
        Loads a template. If its already on page call callback immediately otherwise load asyncronously
        Note: Should use deferred if available
        Still need to finish implementing this.
    */
    if(!_.isFunction(cb)) {
        cb = util.noop;
    }
    if(_.isFunction(name)) {
        cb(name);//assume identity
    }
    else if(_.has(templates, name)) {
        cb(_.lookup(templates, name));
    }
    else {
        var path = options && options.path || "js/templates/",
            file = options && options.file || name,
            type = options && options.type || ".js",
            $script;
        if(!path.endsWith("/")) path += "/";
        if(!type.startsWith(".")) type = "." + type;
        $script = Asset.javascript(path + file + type, {onLoad: function() {
            cb(_.lookup(templates, name));
            $script.dispose();
        }});
        //$script.addEvent("error", ..now what?)
    }
    //return deferred
};
  
util.loadTemplate = function(name) {//helper to preload a template
    var template;
    getTemplate(name, function(tmpl) {template = tmpl});
    return function() {return template.apply(this, arguments);};
}
  
ui.setTitle = function(title, options) {
    document.title = title;
};
  
util.setCaretPos = Element.setCaretPosition;
  
util.setAtEnd = function($el) {
    $el.setCaretPosition($el.value.length);
};
  
util.getCaretPos = Element.getCaretPosition;
  
util.wrapSelected = function($eles, wrap) {
    $eles = $$($eles);
  
    var start = Array.isArray(wrap) ? wrap[0] : wrap,
        end = Array.isArray(wrap) ? wrap[1] : wrap;
  
    $eles.each(function($ele) {
        var range = $ele.getSelectedRange();
        if(range.start != range.end) {
            var text = $ele.val();
            $ele.val(text.slice(0, range.start) + start + text.slice(range.start, range.end) + end + text.slice(range.end))
                .setCaretPosition(range.end + start.length + end.length);
        }
    });
}
  
ui.decorateDropdown = function($btn, $ddm, options) {
    options = options || {};
    var evts = {
        "click": hideMenu,
        "keypress": hideMenu
    };
    function hideMenu() {
        if(options.onHide)
            options.onHide.call(this, $ddm);
        document.removeEvents(evts);
        return $ddm.hide();
    }
    function toggleMenu(state) {
        if(options.onShow)
            options.onShow.call(this, $ddm);
  
        if (state===true || !$ddm.isDisplayed()) {
            $ddm.show();
            document.addEvents(evts);
        } else {
           hideMenu();
        }
        return $ddm;
    }
  
    $ddm.store("toggle", toggleMenu)
        .position.delay(50, $ddm, {
            relativeTo: $btn,
            position: {x: 'left', y: 'bottom'},
            edge: {x: 'left', y: 'top'}
        });
  
    if($ddm.isDisplayed()) document.addEvents(evts);
  
    if(options.btnlistener) {
        $btn.addEvent("click", function(e) {
            e.stop();
            toggleMenu();
        });
    }
    return options.autohide ? hideMenu() : $ddm;
};
  
//dirty function please help with css :(
//dir can be 'width' 'height'
util.fillContainer = function ($ele, options) {
    options = Object.append({style: ['width'], offset: 20}, options);
  
    var filler = function() {
        var size = $ele.getSize();
  
        Array.from( options.style ).each(function(style) {//wait a sec for potential style recalcs
            var method = style.contains('width') ? 'x' : 'y',
                offset = options.offset;
  
            $ele.getSiblings()
                .each(function(sib) {
                    offset += sib.getSize()[method];
                });
  
            util.calc($ele, style, "100% - " + offset + "px");
        });
    }
  
    _.delay(filler, 20);
    return $ele;
};


// //http://caniuse.com/calc
// Browser.Features.calc = !!((Browser.ie && Browser.version >= 9) ||
//                             (Browser.firefox && Browser.version >= 4) ||
//                             (Browser.chrome && Browser.version >= 19) ||
//                             (Browser.opera && Browser.version >= 15) ||
//                             (Browser.safari && Browser.version > 6));
document.addEvent("domready", function() {//based off https://gist.github.com/Rob-ot/3399053
    Browser.Features.calc = false;//union bool str (-webkit-calc, -moz-calc, calc)
    ["","-webkit-","-moz-","-o-"].some(function(prefix) {
        try {
            var $el = new Element('div', {
                styles: {
                    width: prefix + "calc(5px)"
                }
            });
            if ($el.style.length > 0) return Browser.Features.calc = prefix + "calc";
        } catch(nope){}
    });
});

util.percentToPixel= function(data, par) {
    par = par || $(document.body);
    var size = par.getSize();
    return {
        x: size.x * (data.x * 0.01),
        y: size.y * (data.y * 0.01)
    };
};

//https://gist.github.com/megawac/6525074
//http://www.w3schools.com/cssref/css_units.asp
util.calc = function($ele, style, val) {
    // val = val.replace(/(\(|\))/g, "");
	//simple css calc function polyfill
	//polyfill expects surrounded by brackets <val><unit> <operator> <val><unit> => "33% - 20px + 1em"
    //does not support things like "50%/3 - 5px"
	if(Browser.Features.calc) {
		$ele.setStyle(style, Browser.Features.calc + "(" + val + ")");
	} else {
        var old = $ele.retrieve("calc");
        if(old) {window.removeEvent("resize", old);}
		var split = val.split(" ");
		var op = split.splice(1,1);
        var resize = function() {
            var expr = val.replace(/(\d+)(\S+)/g, function(match, size, unit) {
                size = size.toFloat();
                switch (unit) {//unit
                case "%":
                    var data = {};
                    var dir = style.contains("width") ? "x" : "y";
                    data[dir] = size;
                    return util.percentToPixel(data, $ele.getParent())[dir].round(3);
                case "em":
                    var fsize = $ele.getStyle("font-size").toFloat();
                    return fsize * size;
                // case "px":
                default:
                    return size;
                }
            });
            var size = eval(expr);//safe usage - evals '500-20+12' for example
            $ele.setStyle(style, size);
            return resize;
        };
        window.addEvent("resize", resize);
        $ele.store("calc", resize);
        return resize();
	}
};
  
util.elementAtScrollPos = function($ele, pos, dir, offset) {
    dir = (dir || 'width').capitalize();
    offset = offset || 10;
    var $res = $ele.lastChild;
    Array.some($ele.childNodes, function($kid) {
        offset += $kid['get' + dir]();
        if(offset >= pos) {
            $res = $kid;
            return true;
        }
    });
    return $res;
}; 

(function() {

//welcome to my dirty corner. Here we welcome regexs and confusing loops

//Parses messages for url strings and creates hyperlinks
var urlifier = util.urlifier = new Urlerizer({
    target: '_blank'
});
// var channame_re = /(#|>|&gt;)[\s\S]*(?=\/)/,
//     chan_re = /#|\/|\\/;

urlifier.leading_punctuation.include(/^([\x00-\x02]|\x016|\x1F)/).include(/^(\x03+(\d{1,2})(?:,\d{1,2})?)/);
urlifier.trailing_punctuation.include(/([\x00-\x03]|\x016|\x1F)$/);

urlifier.addPattern(/qwebirc:\/\/(.*)/, function(word) {
            //given "qwebirc://whois/rushey#tf2mix/"
            if(word.contains("qwebirc://")) {
                var parsed = this.parsePunctuation(word),
                    mid = parsed.mid;

                if(mid.startsWith("qwebirc://") && mid.endsWith("/") && mid.length > 11) {
                    var cmd = mid.slice(10);//remove qwebirc://
                    /*if(cmd.startsWith("whois/")) {
                        var chan_match = cmd.match(channame_re); //matches the chan or user to the dash
                        var chan = chan_match ? chan_match[0] : "";
                        var chanlen = chan_match ? chan_match.index : cmd.length - 1; //chan length or the len -1 to atleast remove the dash
                        var user = cmd.slice(6, chanlen);//whois to channel
                        cmd = templates.userlink({'userid': user, 'username': user + chan});
                    }
                    else */if(["options", "embedded", "privacy"].some(cmd.startsWith.bind(cmd))) {
                        cmd = templates.customlink({
                            val: cmd.match(/\w+\w/),
                            internal: true
                        });
                    }
                    word = parsed.lead + cmd + parsed.end;
                }
            }
            return word;

            //generates something like <span class="hyperlink-whois">Tristan#tf2mix</span>
        })
        .addPattern(/\B#+(?![\._#-+])/, function(word) {
            var parsed = this.parsePunctuation(word),
                res = parsed.mid;

            if(util.isChannel(res)) {
                res = templates.customlink({
                    val: res,
                    internal: true
                });
            }

            return parsed.lead + res + parsed.end;
        });

var inputurl = util.inputParser = new Urlerizer({
    default_parser: false,
    autoescape: false
});

var bbmatch = /\[.+?\].+\[\/.+?\]/i;
var colour_re = /\[colo(u)?r+(.*?)\](.*?)\[\/colo(u)?r\b\]/ig;
inputurl.addPattern(bbmatch,//this pattern needs to be optimized
    function parsebb(_text) {//see http://patorjk.com/blog/2011/05/07/extendible-bbcode-parser-in-javascript/
        var stac = [],//for colours try somthing like "[b test=a]test[/b] test".match(/\[b+(.*?)\](.*?)\[\/b\b\]/)
            tag_re = /\[.+?\]/i,
            tag_m, col_m,
            tag,
            text = _text,

            bb, style, endTag_re, end_indx, inner;

        var colours = irc.styles.colour; //replacing colours [colour fore=red back=2]ya[/colour] => \x034,2ya\x03
        text = text.replace(colour_re, function(match, zZz, attributes, text) {
            var attrs = attributes.clean().split(" "), //will split into cey value pairs ["te=a", "b=a"]
                attrso = {},
                fore, bac;

            attrs.each(function(attr) { //map the obj
                if(attr.contains("=")) {
                    attr = attr.split("=")
                    attrso[attr[0]] = attr[1]; 
                }
            });

            if(attrso.fore || attrso.bac){
                fore = util.getColourByName(attrso.fore) || util.getColourByKey(attrso.fore) || util.getColourByName('black');
                bac = util.getColourByName(attrso.back) || util.getColourByKey(attrso.back) || util.getColourByName('white');
                return colours.format.substitute({
                    f: fore.key,
                    b: bac.key,
                    t: text
                })
            }
            return match;
        });

        while(tag_m = text.match(tag_re)) { //todo do the matching as above
            tag = tag_m[0];
            //assume everything before has been processed
            stac.push(text.slice(0, tag_m.index));
            text = text.slice(tag_m.index);

            style = _.find(irc.styles.special, function(sty) {
                return sty.bbcode[0] === tag;
            });
            if(style) {
                bb = style.bbcode;

                endTag_re = new RegExp(String.escapeRegExp(bb[1]), "i");
                end_indx = text.search(endTag_re);
                if(end_indx !== -1) {
                    inner = text.slice(tag.length, end_indx);
                    if(bbmatch.test(inner)) {//recurse
                        inner = parsebb(inner);
                    }
                    stac.push(style.key + inner + style.key);
                    text = text.slice(end_indx + bb[1].length);
                    continue;
                }
            }

            stac.push(tag);
            text = text.slice(tag.length);
        }

        return stac.join("") + text;
    }, true);

})();


(function(engine) {

    //where to store these things
    var source = {},
        compiled = qwebirc.templates || {};

    source.messageLine = "<hr class='lastpos' />";
    // source.ircMessage = "<div class='{{styles}}'></div>";


    //portions:
    source.topPane = "<div class='toppanel outertabbar'></div>";
    // source.detachedPane = "<div class='detached'></div>";
    source.windowsPane = "<div class='windows'></div>";
    // source.windowPane = "<div class='window qui hidden'></div>";
    // source.topicPane = "<div class='qui topic'></div>";
    // source.contentPane = "<div class='qui content'></div>";
    // source.leftPane = "<div class='qui leftpanel lines'></div>";
    // source.nickPane = "<div class='qui rightpanel'></div>";
    // source.propertiesPane = "<div class='qui properties'></div>";
    // source.inputPane = "<div class='qui bottompanel'></div>";

    // source.detachedWindow = [
    // "<div class='detached-window'>",
    //     "<div class='header'>",
    //         "<span class='title'>{{channel}}</span>",
    //         "{{#unless base}}{{> tabClose}}{{/unless}}",//css bug
    //         "{{> tabAttach}}",
    //     "</div>",
    // "</div>"].join("");

    // source.resizeHandle = "<div><span class='resize-handle ui-icon ui-icon-grip-diagonal-se'></span></div>";

    // source.nickMenu = "<div class='menu'></div>";
    // source.menubtn = "<div class='dropdown-tab'><img src='{{icon}}' title='menu' alt='menu'></div>";
    // source.menudrop = "<div class='main-menu dropdownmenu'></div>";
    // source.chanmenu = "<div class='chanmenu dropdownmenu'>{{#each channels}}{{> menuitem}}{{/each}}</div>";
    // source.menuitem = "<a{{#if value}} data-value='{{value}}'{{/if}}><span>{{text}}</span>{{#if hint}}<span class='hint'>{{hint}}</span>{{/if}}</a>";
    source.dropdownhint = "<div class='dropdownhint'>Click the icon for the main menu.</div>";

    source.tabbar = "<div class='tabbar'></div>";
    // source.tabbarbtns = [
    // "<div class='buttons'>",
    //     "<span class='ui-icon ui-icon-circle-triangle-w to-left hidden' name='tabscroll'></span>",
    //     "<span class='ui-icon ui-icon-circle-triangle-e to-right hidden' name='tabscroll'></span>",
    //     "<span class='add-chan ui-icon ui-icon-circle-plus' title='Join a channel'></span>",
    // "</div>"].join("");
    // source.ircTab = "<a href='#' class='tab'>{{{name}}} {{> tabDetach}}</a>";
    source.tabDetach = "<span class='detach ui-icon ui-icon-newwin' title='" + lang.detachWindow + "'></span>";
    source.tabAttach = "<span class='attach ui-icon ui-icon-circle-minus'></span>";
    source.tabClose = "<span class='tab-close ui-icon ui-icon-circle-close' title='" + lang.closeTab + "'></span>";

	source.loadingPage = "<div class='loading'>" + lang.loadingPage + "<img src='images/loading.gif' alt='url'></div>";


    source.verticalDivider = "<div class='ui-icon ui-icon-grip-solid-vertical handle vertical'></div>";
    source.horizontalDivider = "<div class='ui-icon ui-icon-grip-solid-horizontal handle horizontal'></div>";

    /************************
        HELPERS
    ***********************/
    engine.registerHelper('check', function(checked, s2){
        return checked ? 'checked' : '';
    });

    engine.registerHelper('enableDisable', function(x) {
        return x ? lang.DISABLE : lang.ENABLE;//if true shows disable
    });

    engine.registerHelper('$link', util.formatURL);

    //f(property name, type of prop, default val)
    engine.registerHelper('$css', function(prop, def, type, default2) {//this refers to context
        if(type === "c") {//colour
            var x = new Color(def);
            var c = x.setHue(this.style_hue).setSaturation(x.hsb[1] + this.style_saturation).setBrightness(x.hsb[2] + this.style_brightness);
            if (Browser.ie && c == "255,255,255") c = "255,255,254";// IE confuses white with transparent... 
            
            return "rgb(" + c + ")";
        } 
        else if(type === "comp") {
            return this[prop] ? def : default2;
        }
        else {
            return this[prop] || def;
        }
    });

    engine.registerHelper("format", function(prop) {
        return util.format(prop, this);
    });

    engine.registerHelper("lang", function(prop) {
        return lang[prop];
    });

    /******************
        Compiliation
    *********************/

    function compileAll(source,compiled) {
        _.each(source, function(item, key) {
            try {
                // compiled[key] = engine.compile(item);
                compiled[key] = Function.from(item);
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


//commands are substituted by util.formatter. Please make sure they are the correct command for your server
//eg : https://www.quakenet.org/help/q-commands
config.IRC_COMMANDS = { //maybe make these templates?
    "ACTION": {
        command: "PRIVMSG {target} :\x01ACTION {text}\x01"
    },
    "CTCP": {
        command: "PRIVMSG {target} :\x01{type} {text} \x01"
    },
    "PRIVMSG": {
        command: "PRIVMSG {target} :{message}"
    },
    "JOIN": {
        command: "JOIN {channel} {args}"
    },
    "NICK": {
        command: "NICK {nick}"
    },
    "PART": {
        command: "PART {channel} :{message}"
    },
    "QUIT": {
        command: "QUIT :{message}"
    },
    "TOPIC": {
        command: "TOPIC {channel} :{topic}"
    },
    "AWAY": {
        command: "AWAY :{message}"
    },
    "NOTICE": {
        command: "NOTICE {target} :{message}"
    },
    "MODE": {
        command: "MODE {target} {mode} {args}"
    },
    "AUTH": {
        command: "AUTHSERV AUTH {username} {password}"
    },
    "KICK": {
        command: "KICK {channel} {kickee} :{message}"
    }
};

config.COMMAND_ALIAS = {
    "J": "JOIN",
    "P": "PART",
    "MESSAGE": "PRIVMSG",
    "M": "PRIVMSG",
    "MSG": "PRIVMSG",
    "PM": "PRIVMSG",
    "Q": "QUERY",
    "BACK": "AWAY",
    "PRIVACY": "PRIVACYPOLICY",
    "HOP": "CYCLE",
    "SLAP": "ME"
};

config.OptionModel = new Class({
    Extends: Epitome.Model.Storage,
    options: {
        defaults: {
            "auto_open_pm": false,
            "nick_ov_status": true,
            "accept_service_invites": true,
            "use_hiddenhost": true,
            "lastpos_line": true,
            "nick_colours": false,
            "hide_joinparts": false,
            "show_nicklist": !Browser.isMobile,
            "show_timestamps": true,
            "font_size": 12,
            "volume": 100, //0-100

            "completer": {
                "intrusive": Browser.isDecent,
                "store": !Browser.isMobile
            },

            "dn_state": false,
            "dn_duration": 4000,

            "highlight": true,
            "highlight_mentioned": true,

            "style_hue": 210,
            "style_saturation": 0,
            "style_brightness": 0,

            "standard_notices": [
                {
                    type: "^(?!SERVER)+NOTICE+$",//notice not server notice
                    classes: '',
                    beep: true,
                    tabhl: ui.HIGHLIGHT.speech,
                    id: 'notice'
                },
                {
                    type: "PRIVMSG$",
                    flash: true,
                    beep: true,
                    pm: true,
                    tabhl: ui.HIGHLIGHT.speech,
                    id: 'pm'
                },
                {
                    type: "^OUR",
                    classes: 'our-msg',
                    id: 'ourmsg'
                },
                {//match bots
                    nick: "(^tf2)|((serv|bot)$)",
                    classes: 'bot',
                    types: [ui.WINDOW.channel],
                    "case": true,
                    id: 'bot'
                },
                {
                    msg: "^\\!",
                    classes: 'command',
                    types: [ui.WINDOW.channel],
                    id: 'cmd'
                },
                {
                    mentioned: true,
                    highlight: 'mentioned',
                    notus: true,
                    tabhl: ui.HIGHLIGHT.us,
                    id: 'mention'
                },
                {
                    nick: "^((?!(^tf2|bot$|serv$)).)*$",
                    mentioned: true,
                    classes: '',
                    beep: true,
                    pm: true,
                    notus: true,
                    "case": true,
                    id: 'onmention'
                },
                {
                    nick: "^((?!(^tf2|bot$|serv$)).)*$",
                    msg: "^((?!(^\\!)).)*$", //dont hl commands
                    classes: '',
                    highlight: true,
                    notus: true,
                    "case": true,
                    tabhl: ui.HIGHLIGHT.activity,
                    types: [ui.WINDOW.channel],
                    id: 'hl'
                }
            ],

            "custom_notices": []
        },
        key: cookies.options,
        minimize: true
    },

    defaultNotice: function() {//default custom notice
        return {
                // nick: '',
                // msg: '',
                // type: '',
                // flash: false,
                // beep: false,
                // pm: false,
                id: String.uniqueID(),
                autoescape: true,
                description: ''
            };
    },

    notice_filter: function(data) {
        return !(!data.msg || data.msg.trim() === "") || !(!data.nick || data.nick.trim() === "") || !(!data.type || data.type.trim() === "") || data.notus;
    },

    //storing procedures
    save: function() {
        this.set("custom_notices", _.filter(this.get("custom_notices"), this.notice_filter));//cleanup
        this.set("standard_notices", _.filter(this.get("standard_notices"), this.notice_filter));//cleanup
        return this.parent();
    },


    set: function(key, data) {
        var props = key.split(".");
        if(props.length > 1) {
            var item = this.get(props[0]);
            return this.parent(props[0], _.assign(item, key, data));
        } else {
            this.parent(key, data);
        }
    }.overloadSetter()
});


config.Settings = new Class({
    Extends: Epitome.Model.Storage,
    options: {
        defaults: {
            "channels": "",
            "nickname": "",
            "username": "",
            "password": "",
            "auth": false,
            "newb": true
        },
        key: cookies.settings,
        minimize: false,

        onReady: function() {
            this.loaded = true;
        }
    },

    set: function(key, data) {
        this.parent(key, data);
        if(this.loaded) {//set is called when initing if we save we will lose state
            this.save();
        }
        return this;
    },

    unset: function(key, data) {
        this.parent(key);
        return this.save();
    }
});


irc.styles = [
    {
        name: 'normal',
        style: '',
        key: '\x00'
    },
    {
        name: 'underline',
        style: 'underline',
        key: '\x1F',
        keyregex: /\x1F(.*?)\x1F/,
        bbcode: ['[u]', '[/u]']
    },
    {
        name: 'bold',
        style: 'bold',
        key: '\x02',
        keyregex: /\x02(.*?)\x02/,
        bbcode: ['[b]', '[/b]']
    },
    {
        name: 'italic',
        style: 'italic',
        key: '\x16',
        keyregex: /\x16(.*?)\x16/,
        bbcode: ['[i]', '[/i]']
    },
    {
        name: 'colour',
        style: '',//see below
        key: '\x03',
        fore_re: /^(\d{1,2})/,
        back_re: /^((\d{1,2})+,+(\d{1,2}))/,
        format: "\x03{f},{b}{t}\x03",
        bbcode: ['[colour fore={f} back={b}]', '[/colour]']
    }
];

//dirty but better than filtering every time?
irc.styles.special = _.reject(irc.styles, function(sty) { return sty.name == 'normal' ||  sty.name == 'colour' } );
irc.styles.colour = _.findWhere(irc.styles, {name: 'colour' } );
irc.styles.normal = _.findWhere(irc.styles, {name: 'normal' } );

irc.colours = [//http://www.mirc.com/colors.html
    {
        name: 'white',
        fore: 'col0',
        back: 'back0',
        key: 0
    },
    {
        name: 'black',
        fore: 'col1',
        back: 'back1',
        key: 1
    },
    {
        name: 'navy',
        fore: 'col2',
        back: 'back2',
        key: 2
    },
    {
        name: 'green',
        fore: 'col3',
        back: 'back3',
        key: 3
    },
    {
        name: 'red',
        fore: 'col4',
        back: 'back4',
        key: 4
    },
    {
        name: 'brown',
        fore: 'col5',
        back: 'back5',
        key: 5
    },
    {
        name: 'purple',
        fore: 'col6',
        back: 'back6',
        key: 6
    },
    {
        name: 'olive',
        fore: 'col7',
        back: 'back7',
        key: 7
    },
    {
        name: 'yellow',
        fore: 'col8',
        back: 'back8',
        key: 8
    },
    {
        name: 'lightgreen',
        fore: 'col9',
        back: 'back9',
        key: 9
    },
    {
        name: 'teal',
        fore: 'col10',
        back: 'back10',
        key: 10
    },
    {
        name: 'cyan',
        fore: 'col11',
        back: 'back11',
        key: 11
    },
    {
        name: 'blue',
        fore: 'col12',
        back: 'back12',
        key: 12
    },
    {
        name: 'pink',
        fore: 'col13',
        back: 'back13',
        key: 13
    },
    {
        name: 'gray',
        fore: 'col14',
        back: 'back14',
        key: 14
    },
    {
        name: 'lightgrey',
        fore: 'col15',
        back: 'back15',
        key: 15
    }
];

config.ThemeControlCodeMap = { //these are settings for the templates -ie {C} is replaced by irc.styles.colour.key
    "C": irc.styles.colour.key,
    "B": util.getStyleByName('bold').key,
    "U": util.getStyleByName('underline').key,
    "O": irc.styles.colour.key,
    "D": Browser.ie ? "" : irc.styles.normal.key, //address ie bug where /x00 is null character
    //little clever here
    "NN": templates.userlink({'nick':'{N}'}),//nick name
    "CN": templates.userlink({'nick':'{newnick}'}),// change nick
    "P": "{C}4=={O} "
};

config.ThemeIRCTemplates = {
    "SIGNON": "{P}Signed on!",
    "CONNECT": "{P}Connected to server - establishing IRC connection.",

    "INFO": "{m}",
    "RAW": "{P}{m}",
    "DISCONNECT": "{P}Disconnected from server: {m}",
    "ERROR": "{P}ERROR: {m}",

    "SERVERNOTICE": "{P}{m}",
    "OURTARGETEDNOTICE": "[notice({[}{t}{]})] {m}",
    "OURCHANNOTICE": "-{N}:{t}- {m}",
    "OURPRIVNOTICE": "-{N}- {m}",
    "CHANNOTICE": "-{D}{(}{N}{)}{D}:{c}- {m}",
    "PRIVNOTICE": "-{(}{N}{)}- {m}",

    "JOIN": "{P}{D}{N}{D} [{h}] has joined {c}",
    "OURJOIN": "{P}{D}{N}{D} [{h}] has joined {c}",
    "PART": "{P}{D}{N}{D} [{h}] has left {c} [{m}]",
    "KICK": "{P}{D}{kickee}{D} was kicked from {c} by {D}{kicker}{D} [{m}]",
    "MODE": "{P}mode/{c} gives [{m}] to {D}{N}{D}",
    "QUIT": "{P}{D}{N}{D} [{h}] has quit [{m}]",
    "NICK": "{P}{D}{n}{D} has changed nick to {CN}",
    "TOPIC": "{P}{D}{N}{D} changed the topic of {c} to: {m}",
    "UMODE": "Usermode change: {m}",
    "INVITE": "{N} invites you to join {c}",

    "HILIGHT": "{C}4",
    "HILIGHTEND": "{O}",

    "CHANMSG": "{D}{nicktmpl}{)}{D} {m}",
    "PRIVMSG": "{(}{nicktmpl}{)} {m}",

    "OURCHANMSG": "{nicktmpl} {m}",
    "OURPRIVMSG": "{nicktmpl} {m}",
    "OURTARGETEDMSG": "*{[}{t}{]}* {m}",
    "OURCHANACTION": " * {N} {m}",
    "OURPRIVACTION": " * {N} {m}",

    "CHANACTION": " * {D}{(}{N}{)}{D} {m}",
    "PRIVACTION": " * {(}{N}{)} {m}",
    "CHANCTCP": "{N} [{h}] requested CTCP {data} from {c}: {m}",
    "PRIVCTCP": "{N} [{h}] requested CTCP {data} from {-}: {m}",
    "CTCPREPLY": "CTCP {x} reply from {N}: {m}",

    "OURCHANCTCP": "[ctcp({t})] {x} {m}",
    "OURPRIVCTCP": "[ctcp({t})] {x} {m}",
    "OURTARGETEDCTCP": "[ctcp({t})] {x} {m}",

    "WHOISUSER": "{P}{B}{N}{B} [{h}]",
    "WHOISREALNAME": "{P} realname : {m}",
    "WHOISCHANNELS": "{P} channels : {m}",
    "WHOISSERVER": "{P} server   : {x} [{m}]",
    "WHOISACCOUNT": "{P} account : m",
    "WHOISIDLE": "{P} idle     : {x} [connected: {m}]",
    "WHOISAWAY": "{P} away     : {m}",
    "WHOISOPER": "{P}          : {B}IRC Operator{B}",
    "WHOISOPERNAME": "{P} operedas : {m}",
    "WHOISACTUALLY": "{P} realhost : {m} [ip: {x}]",
    "WHOISGENERICTEXT": "{P} note  : {m}",
    "WHOISEND": "{P}End of whois {N}",

    "AWAY": "{P}{N} is away: {m}",
    "GENERICERROR": "{P}{m}: {t}",
    "GENERICMESSAGE": "{P}{m}",
    "WALLOPS": "{P}WALLOP {n}: {t}",
    "CHANNELCREATIONTIME": "{P}Channel {c} was created at: {m}",
    "CHANNELMODEIS": "{P}Channel modes on {c} are: {m}"
};
(function() {
    var cmd = config.IRC_COMMANDS;
    var format = function(command, data) {
        return util.format(command.command, data);
    };

irc.Commands = new Class({//sort of an abstract class but relies on irc.IRCClient so not really
    // Binds: ["exec"],

    __autojoined: false,

    // routes all outputs with the server
    // this method will call functions in: Commands based on the this scope
    exec: function(line, chan) {
        var self = this,
            allargs = util.formatCommand(line);

        //is it clearer to use a do-while? - anyway allargs var will change each loop
        for (var command, args, cmdopts, activewin, splitargs, minargs, fn, win, target; $defined(allargs); ) {
            command = allargs[0].toUpperCase();
            command = config.COMMAND_ALIAS[command] || command;
            args = allargs[1];
            target = chan;

            cmdopts = self["cmd_" + command];//comand handler

            if (!cmdopts) {
                self.send(command + util.padspace(args));
                break;
            }

            //props from on of the command arrays
            // activewin = cmdopts[0];
            // splitargs = cmdopts[1];
            // minargs = cmdopts[2];
            // fn = cmdopts[3];

           /* //errors in command
            win = chan ? self.windows[chan] : self.getActiveWindow();
            if (activewin && win && !util.isChannelType(win.type)) { //win.type !== ui.WINDOW_CHANNEL) && (win.type !== ui.WINDOW_QUERY) 
                self.writeMessages(lang.invalidCommand);
                break;
            }
            else */if (cmdopts.minargs && cmdopts.minargs > _.size(args)) {
                self.writeMessages(lang.insufficentArgs, {}, {
                    channel: chan
                });
                break;
            }
            if (_.isNumber(cmdopts.splitargs) && _.isString(args)) {
                args = args.splitMax(" ", cmdopts.splitargs);
                if(cmdopts.target/* && util.isChannel(args[0])*/) {
                    target = args.shift();//so you can avoid checks for correct syntax
                }
            }

            allargs = cmdopts.fn.call(self, args, target);
        }
    },


    automode: function(modes, mode, args, channel) {
        args.length.times(function() {
            modes += mode;
        });
        this.send(format(cmd.MODE, {
            target: channel,
            mode: modes,
            args: args.join(" ")
        }));
    },

    /*****************commands ****************/

    /* [require_active_window, splitintoXargs, minargs, function] */
    cmd_ME: {
        fn: function(args, target) {
            args = args || "";

            var msg = format(cmd.ACTION, {
                target: target,
                text: args
            });

            if (this.send(msg)) {
                var nick = this.nickname;
                this.trigger("privAction", {
                    'nick': nick,
                    'message': args,
                    'target': target,
                    'channel': target,
                    "prefix": this.getNickStatus(target, nick)
                });
            }

        }
    },

    cmd_CTCP: {
        target: true,
        splitargs: 3,
        minargs: 2,
        fn: function(args, target) {
            var type = args[0].toUpperCase(),
                message = args[1] || "";

            var msg = format(cmd.CTCP, {
                target: target,
                type: type,
                text: message
            });

            if (this.send(msg)) {
                this.trigger("privCTCP", {
                    'nick': this.nickname,
                    '_type': type,
                    'message': message,
                    'args': args,
                    'type': 'CTCPReply'
                });
            }
        }
    },

    cmd_SAY: {
        minargs: 1,
        fn: function(args, target) { //direct
            return ["PRIVMSG", target + " " + args || ""];//purpose is different split args
        }
    },

    cmd_PRIVMSG: {
        target: true,
        splitargs: 2,
        minargs: 1,
        fn: function(args, target) {
            var message = args[0];
            var nick = this.nickname;
            var msg = format(cmd.PRIVMSG, {
                target: target,
                message: message
            });

            if (util.isChannel(target)) {
                if (this.send(msg)) {
                    this.trigger("chanMessage", {
                        'nick': nick,
                        'channel': target,
                        'message': message,
                        'type': 'chanmsg',
                        "prefix": this.getNickStatus(target, nick)
                    });
                }
            } else {
                return ["QUERY", target + " " + message];
            }
        }
    },

    cmd_NOTICE: {
        target: true,
        splitargs: 2,
        minargs: 1,
        fn: function(args, target) {
            var message = args[0];
            var msg = format(cmd.NOTICE, {
                target: target,
                message: message
            });
            var noticeType = util.isChannel(target) ? "chanNotice" : "privNotice";

            if (this.send(msg)) {
                this.trigger(noticeType, {
                    'nick': this.nickname,
                    'channel': target,
                    'target': target,
                    'message': message
                });
            }
        }
    },

    cmd_QUERY: {
        target: true,
        splitargs: 2,
        minargs: 1,
        fn: function(args, target) {
            var message = args[0];
            if (util.isChannel(target)) {
                return this.writeMessages(lang.invalidChanTarget);
            }
            if(_.size(message) > 1) {
                var msg = format(cmd.PRIVMSG, {
                    target: target,
                    message: message
                });
                this.send(msg);
            }

            this.trigger("query", {
                'nick': this.nickname,
                'channel': target,
                'message': message,
                'type': 'privmsg'/*,
                'open': true*/
            });
        }
    },

    // cmd_OPTIONS: {
    //     fn: function(args) {
    //         this.trigger("openWindow", {
    //             'window': "optionsWindow",
    //             'type': ui.WINDOW.custom
    //         });
    //     }
    // },

    // cmd_EMBED: {
    //     fn: function(args) {
    //         this.trigger("openWindow", {
    //             'window': "embeddedWindow",
    //             'type': ui.WINDOW.custom
    //         });
    //     }
    // },

    // cmd_PRIVACYPOLICY: {
    //     fn: function(args) {
    //         this.trigger("openWindow", {
    //             'window': "privacyWindow",
    //             'type': ui.WINDOW.custom
    //         });
    //     }
    // },

    // cmd_ABOUT: {
    //     fn: function(args) {
    //         this.trigger("openWindow", {
    //             'window': "aboutWindow",
    //             'type': ui.WINDOW.custom
    //         });
    //     }
    // },

    cmd_QUOTE: {
        minargs: 1,
        fn: function(args) {
            this.send(args);
        }
    },

    cmd_KICK: {
        target: true,
        splitargs: 3,
        minargs: 1,
        fn: function(args, target) {
            this.send(format(cmd.KICK, {
                channel: target,
                kickee: args[0],
                message: args[1] || ""
            }));
        }
    },

    cmd_OP: {
        target: true,
        splitargs: 6,
        minargs: 1, 
        fn: function(args, target) {
            this.automode("+", "o", args, target);
        }
    },
    cmd_DEOP: {
        target: true,
        splitargs: 6,
        minargs: 1,
        fn: function(args, target) {
            this.automode("-", "o", args, target);
        }
    },
    cmd_AUTH: {//must be configured per server in config.irc_commands
        splitargs: 2,
        minargs: 2,
        fn: function(args) {
            var msg = format(cmd.AUTH, {
                username: args[0],
                password: args[1]
            });
            this.send(msg);
        }
    },
    cmd_VOICE: {
        target: true,
        splitargs: 6,
        minargs: 1,
        fn: function(args, target) {
            this.automode("+", "v", args, target);
        }
    },
    cmd_DEVOICE: {
        target: true,
        splitargs: 6,
        minargs: 1,
        fn: function(args, target) {
            this.automode("-", "v", args, target);
        }
    },
    cmd_TOPIC: {
        target: true,
        splitargs: 2,
        minargs: 1,
        fn: function(args, channel) {
            var msg = format(cmd.TOPIC, {
                channel: channel,
                topic: args[0]
            });
            this.send(msg);
        }
    },
    cmd_AWAY: {
        splitargs: 1,
        minargs: 0,
        fn: function(args) {
            var msg = format(cmd.AWAY, {
                message: args[0] || ""
            })
            this.send(msg);
        }
    },
    cmd_QUIT: {
        splitargs: 1,
        minargs: 0,
        fn: function(args) {
            this.quit(args[0] || "");
        }
    },
    // cmd_CYCLE: {
    //     splitargs: 1,
    //     minargs: 0,
    //     fn: function(args, channel) {
    //         channel = channel;

    //         this.send("PART " + channel + " :" + (args ? args[0] : "rejoining. . ."));
    //         this.send("JOIN " + channel);
    //     }
    // },
    cmd_FJOIN: {
        splitargs: 1,
        minargs: 1,
        fn: function(args) {
            if(_.isEmpty(args)) return;
            var channels = Array.from(args).flatten(),
                formatted = util.formatChannelString(channels);

            if (!_.isEqual(channels, util.splitChans(formatted) )) {
                this.writeMessages(lang.poorJoinFormat);
            }
            if(formatted) {
                this.send(format(cmd.JOIN, {
                    channel: formatted/*,
                    args : args.join(" ")*/
                }));
            }
        }
    },
    cmd_JOIN: {
        splitargs: 1,
        minargs: 1,
        fn: function(args) {//accepts string or array
            var channels = Array.from(args).map(util.splitChans).flatten().filter(this.canJoinChannel, this);
            this.cmd_FJOIN.fn.call(this, channels);//join channels into a single comma sep string then join
        }
    },
    cmd_PART: {
        target: true,
        splitargs: 2,
        minargs: 0,
        fn: function(args, channel) {
            this.storeChannels(util.removeChannel(this.channels, channel));
            this.send(format(cmd.PART, {
                channel: args[0] || channel,
                message: args[1] || lang.partChan
            }));
        }
    },
    cmd_UMODE: {
        splitargs: 1,
        minargs: 0,
        fn: function(args) {
            this.send(format(cmd.MODE, {
                target: this.nickname,
                mode: args[0] || ""
            }));
        }
    },
    cmd_AUTOJOIN: {
        fn: function(args) {
            if(!this.__autojoined) {
                this.__autojoined = true;
                this.currentChannel = BROUHAHA;
                return ["JOIN", this.getChannels()];
            }
        }
    }
});

irc.CommandHistory = new Class({
    Extends: Epitome.Model.Storage,
    Implements: [Options],
    options: {
        lines: 20,
        minlen: 2,
        storage: {
            fallback: false//dont save on shit browsers
        },
        store: !Browser.isMobile,
        key: cookies.history
    },

    addLine: function(name, line) {
        var data = this.get(name).erase(line);
        if(line.length > this.options.minlen) {
            data.unshift(line);
            if (data.length > this.options.lines) {
                data.pop();
            }
            this.set(name, data);
            this.save();
        }
    },

    addChannel: function(name) {
        if(!this.get(name)) this.set(name, []);
    },

    removeChannel: function(name) {
        this.unset(name);
        if(this.options.store) this.save();
    },

    _filter: _.not(_.isEmpty)
});


irc.NodeConnection = new Class({
    Implements: [Options, Events],
    Binds: ["_recv", "_error"],
    options: {
        socket_connect: document.location.hostname,
        nickname: "ircconnX",
        password: '',
        serverPassword: null,
        autoConnect: true,
        debug: true,
        floodProtection: false,
        /*server: xxx,
        nick: nick,
        password: null,
        userName: 'nodebot',
        realName: 'nodeJS IRC client',
        port: 6667,
        debug: false,
        showErrors: false,
        autoRejoin: true,
        autoConnect: true,
        channels: [],
        retryCount: null,
        retryDelay: 2000,
        secure: false,
        selfSigned: false,
        certExpired: false,
        floodProtection: false,
        floodProtectionDelay: 1000,
        stripColors: false,
        channelPrefixes: "&#",
        messageSplit: 512*/
        autoretry: true,
        retryInterval: 5000,
        // retryScalar: 2,
        retryAttempts: 30,//retry for 60 seconds

        clientID: util.randHexString(16)
    },
    connected: false,

    initialize: function(options) {
        var self = this;
        options = self.setOptions(options).options;

        var socket = self.socket = io.connect(options.socket_connect, {
          'reconnect': options.autoretry,
          'reconnection delay': options.retryInterval,
          'max reconnection attempts': options.retryAttempts
        });

        var $evts = {
            "raw": self._recv,

            "connected": function() {
                self.connected = true;
                self.attempts = 0;
                self.fireEvent("connected");
                // this.__retry = this.options.retryInterval;
            },
            "disconnect": function() {
                self.connected = false;
            },
            "reconnect": function() {
                console.log("reconnecting");
                self.socket.emit("reconnect", options);
            },
            "reconnecting": function() {
                console.log("reattempt");
                self.fireEvent("retry", {
                    next: options.retryInterval
                });
            },

            "lostConnection": function() {
                self.fireEvent("lostConnection", self.attempts++);
                self.connected = false;
            },
            "abort": function() {
                new ui.Alert({
                    title: "Lost connection to IRC server",
                    text: "Server lost connection to the IRC server"
                });
                self.connected = false;
            },

            "max_connections": function() {
                new ui.Alert({
                    title: 'Maximum connections reached',
                    text: 'Maximum synchronous connections for this server have been reached. If we let you in we may crash/get g-lined. Try again later...',
                    onHide: function() {
                        location.reload();
                    }
                });
            },
            "echo": _.log,
            "error": self._error
        };

        _.each($evts, function(fn, key) {
            if(fn) {
                socket.on(key, fn);
            }
            else {
                socket.on(key, function() {//pass
                    self.fireEvent(key);
                });
            }
        });

        self.connect();
    },

    connect: function() {
        this.socket.emit("irc", this.options);
    },

    disconnect: function() {
        this.socket.emit("quit");
        this.socket.disconnect();
    },

    _recv: function(data) {
        var processed = util.parseIRCData(data.raw);
        this.fireEvent("recv", processed);
    },

    send: function(data) {
        if(this.connected) {
            this.socket.emit("send", data);
            return true;
        }
        else {
            console.error("disconnected dude");
        }
    },

    _error: function() {
        console.error(arguments);
        this.fireEvent("error", arguments);
    }/*,

    autoretry: function() {
        if(this.connected) {return;}
        var next = this.__retry *= this.options.retryScalar;
        this.fireEvent("retry", {
            next: next
        });
        this.socket.emit("retry", this.options);
        return _.delay(this.autoretry, next, this);
    }*/
});


auth.loggedin = false;
auth.enabled = false;

auth.passAuth = $lambda(true);
auth.bouncerAuth = $lambda(false);

// //ircclient with added event support
irc.IRCClient = new Class({
    Implements: [Options, Events, irc.Commands],
    Binds: ["lostConnection", "send", "quit", "connected","retry", "_ndispatch", "_tdispatch"],
    options: {
        minRejoinTime: [0],
        networkServices: [],
        loginRegex: /^$/ //always fail
    },
    lastNicks: [],
    inviteChanList: [],
    activeTimers: {},
    prefixes: "@+",//heirarchy of prefixes - "@"(operator), "+"(voice)
    modeprefixes: "ov",
    __signedOn: false,
    authed: false,
    channels: [],
    nextctcp: 0,
    pmodes: {
        b: irc.PMODE_LIST,
        l: irc.PMODE_SET_ONLY,
        k: irc.PMODE_SET_UNSET,
        o: irc.PMODE_SET_UNSET,
        v: irc.PMODE_SET_UNSET
    },
    toIRCLower: irc.RFC1459toIRCLower,//default text codec
    
    initialize: function(options) {
        var self = this;
        options = self.setOptions(options).options;

        self.nickname = options.nickname;
        self.lowerNickname = self.toIRCLower(self.nickname);

        if(options.node) {
            var conn = self.connection = new irc.NodeConnection({
                account: options.account,
                nickname: self.nickname,
                password: options.password,
                serverPassword: options.serverPassword
            });
            conn.addEvents({
                "recv": self._ndispatch,
                "quit": self.quit,
                "retry": self.retry,
                "connected": self.connected,
                "lostConnection": self.lostConnection
            });
        } else {
            self.connection = new irc.TwistedConnection({
                initialNickname: self.nickname,
                serverPassword: options.serverPassword
            });
            self.connection.addEvent("recv", self._tdispatch);
        }

        // self.commandparser = new irc.Commands(self);
        // self.exec = self.commandparser.exec;
        self.tracker = new irc.IRCTracker(self);
    },

    //connection methods
    connect: function() {
        return this.connection.connect();
    },

    connected: function() {
        this.trigger("connect", {});
    },

    send: function(data) {
        return this.connection.send(data);
    },

    disconnect: function() {
        this.connection.disconnect();
        return this;
    },

    disconnected: function(message) {
        delete this.tracker;
        this.trigger("disconnect", {
            message: message
        });
    },

    quit: function(message) {
        if(this.isConnected()) {    
            this.send("QUIT :" + (message || lang.quit), true);
            _.each(this.activeTimers, $clear);
            this.activeTimers = {};
            this.writeMessages(lang.disconnected, {}, {channels: "ALL"});
            this.disconnect();
            this.trigger("disconnect");
            this.__signedOn = false;
        }
        return this;
    },

    lostConnection: function(attempt) {
        console.log(arguments);
        this.writeMessages(lang.connRetry, {
            retryAttempts: attempt
        }, {
            channels: "ALL"
        });
    },

    retry: function(data) {
        this.trigger("retry", data);
        this.writeMessages(lang.connRetry, {
            next: (data.next/1000).round(1)
        }, {
            channels: "ALL"
        });
    },
    /***********************************************
    *           General helpers                    *
    ************************************************/
    trigger: function(type, data) { //just a kind helper so i can get the type easily on the ui
        if(!data) data = {};
        data["-"] = this.nickname;
        return this.fireEvent(type, [type, data]);
    },

    isConnected: function() {
        return this.__signedOn && this.connection.connected;
    },

    isNetworkService: function(host) {//is host registered network service
        return this.options.networkServices.contains(host);
    },

    inChannel: function(name) {
        return this.channels.contains(name);
    },

    storeChannels: function(channels) {
        this.channels = channels = channels || this.channels;
        var store = util.removeChannel(channels, BROUHAHA);
        this.options.settings.set("channels", store);
        return this;
    },

    getChannels: function() {
        var chans = this.channels = util.prependChannel(this.options.settings.get("channels") || [], BROUHAHA);
        return chans;
    },

    nickOnChanHasPrefix: function(nick, channel, prefix) {
        var entry = this.tracker.getNickOnChannel(nick, channel);
        if (!$defined(entry)) return false; /* shouldn't happen */

        return (entry.prefixes).contains(prefix);
    },

    getNickStatus: function(channel, nick) {
        var nickchan = this.tracker.getNickOnChannel(nick, channel);
        if (!$defined(nickchan) || nickchan.prefixes.length === 0)
            return "";

        return nickchan.prefixes.charAt(0);
    },

    nickOnChanHasAtLeastPrefix: function(nick, channel, prefix) {
        var entry = this.tracker.getNickOnChannel(nick, channel);
        if (!$defined(entry))
            return false; /* shouldn't happen */

        /* this array is sorted */
        var pos = this.prefixes.indexOf(prefix);
        if (pos === -1) return false; /* shouldn't happen */

        var prefixes = this.prefixes.slice(0, pos + 1);

        //true if any of entry.prefix is part of prefixes string
        return _.some(entry.prefixes, function(prefix) {
            return util.validPrefix(prefixes, prefix);
        });
    },

    //needs a rewrite with a proper list implementation
    getPopularChannels: function(cb, minUsers) {
        this.hidelistout = true;
        this.exec('/list >' + (minUsers || 75)); //request chans with more than 75 users
        this.addEvent("listend:once", function() {
            var chans = _.chain(this.listedChans)
                        .clone()
                        .sortBy(function(chan) {return -chan.users})//neg to sort max -> min
                        .value();
            cb(chans);
            this.hidelistout = false;
        });
    },

    canJoinChannel: function(chan) {
        //check if already on channel
        if(chan === BROUHAHA) return true;
        else if(this.tracker.getChannel(chan)) return false;

        var chansets = session.get(chan) || [], //oldest -> newest
            currTime = Date.now(),
            rejoinT = this.options.minRejoinTime,
            minTime = Math.max.apply(null, rejoinT.slice(0, chansets.length)) * 1000;//max min applicable time
        chan = util.formatChannel(chan);

        var broken = chansets.filter(function(time) {
            return currTime - time <= minTime;
        });

        if(broken.length === 0) {
            chansets.push(currTime);
            var n = (chansets.length - rejoinT.length).limit(0, chansets.length);
            session.set(chan, chansets.slice(n));
        } else {
            var maxTime = Math.max.apply(null, chansets.map(function(time, i) {
                return ((minTime - (currTime - time))/1000).round(1); //to secs/10
            }));
            this.writeMessages(lang.waitToJoin, {channel: chan, time: maxTime});
        }

        return broken.length === 0;
    },

    /*************************************************
    *   Process server/network data & call method    *
    **************************************************/
    _ndispatch: function(data) {
        var fn = this[this.IRC_COMMAND_MAP[data.command] || "irc_" + data.command];

        if (!(fn && fn.call(this, data))) {//fn dne or does not return true
            this.rawNumeric(data);
        }
    },

    _tdispatch: function(data) {
        var message = data[0];
        switch(message) {
            case "connect":
                this.connected();
            break;
            case "disconnect":
                if (data.length === 0) {
                    this.disconnected("No error!");
                } else {
                    this.disconnected(data[1]);
                }
                this.disconnect();
            break;
            case "c":
                var _data = util.processTwistedData(data);
                this._ndispatch(_data);
            break;
        }
    },

    /*************************************************
    *               message helpers                  *
    **************************************************/
    writeMessages: function(messages, args, data) {
        data = _.extend({
            type: "info",
            colourClass: "",
            channel: STATUS,
            message: []
        }, data);
        data.channels = data.channels === "ALL" ? [STATUS, BROUHAHA].concat(this.channels) : data.channels;
        var client = this,
            types = lang.TYPES;

        function write(message) {
            var msg = args ? util.formatter(message.message, args) :
                            message.message; //replaces values like {replaceme} if args has a key like that
            data.message.push(msg);

            switch (message.type) {
            case types.ERROR:
                data.colourClass = "warn";
                break;
            case types.INFO:
                data.colourClass = "info";
                break;
            }
        }

        if(_.isArray(messages)){
            messages.each(write);
        }else {
            write(messages);
        }
        return this.trigger("info", data);
    },

    genericError: function(data) {
        var target = data.args[1],
            message = _.last(data.args);
        this.trigger("error", {
            target: target,
            channel: target,
            message: message,
            type: "genericError"
        });
        return true;
    },
    genericQueryError: function(data) {
        var target = data.args[1],
            message = _.last(data.args);

        this.trigger("error", {
            target: target,
            channel: target,
            message: message,
            type: "genericError"
        });
        return true;
    },

    /*************************************************
    *       private server event handlers             *
    **************************************************/
    _signOn: function(/*data*/) {
        var options = this.options,
            channels;

        this.writeMessages(lang.signOn);
        this.writeMessages(lang.loginMessages, {}, {channel: BROUHAHA});

        if (!this.authed && auth.enabled) {
            this.exec(util.format("/AUTH {username} {password}", this.options));

            // if the user is authed they will be set to +x... however as most users arent authed...
            //wait a hundreth of a second to see if the auth server authed you
            this.writeMessages.delay(100, this, lang.joinAfterAuth);

            this.activeTimers.autojoin = (function() {
                if (!this.authed) {
                    this.writeMessages(lang.authFailed);
                }
            }).delay(5000, this);
        } else {
            this.exec("/AUTOJOIN");
        }

        this.trigger("logon", {
            'nickname': this.nickname,
            'channels': channels
        });
    },

    _supported: function(key, value) {
        var self = this;
        switch(key) {
            case "CASEMAPPING":
                if (value === "ascii") {
                    self.toIRCLower = irc.ASCIItoIRCLower;
                } else if (value === "rfc1459") {
                    //default
                } else if(DEBUG) {
                    // TODO: warn 
                    console.log('unsupported codec');
                }
                self.lowerNickname = self.toIRCLower(self.nickname); //why does self happen here
            break;
            case "CHANMODES":
                _.each(value.split(","), function(mode, inx) {
                    _.each(mode, function(letter) {
                        self.pmodes[letter] = inx;
                    });
                });
            break;
            case "PREFIX":
                var len = (value.length - 2) / 2,
                    modeprefixes = self.modeprefixes = value.substr(1, len);
                self.prefixes = value.substr(len + 2, len);
                _.each(modeprefixes, function(modeprefix) {
                    self.pmodes[modeprefix] = irc.PMODE_SET_UNSET;
                });
            break;
        }
    },

    _joinInvited: _.debounce(function() {
        this.exec("/JOIN " + this.inviteChanList.join(","));
        this.inviteChanList.empty();
    }, 100),

    processCTCP: function(message) {
        if (message.charAt(0) !== "\x01") return;

        if (_.last(message) === "\x01") {
            message = message.slice(1, message.length - 2);
        } else {
            message = message.slice(1);
        }
        return message.splitMax(" ", 2);
    },

    rawNumeric: function(data) {
        this.trigger("raw", {
            "numeric": data.command,
            "message": data.args.slice(1).join(" ")
        });
    },

    updateNickList: function(channel) {
        this.trigger("updateNicklist", {
            nicks: this.tracker.getSortedNicksForChannel(channel),
            channel: channel
        });
    },

    _pushLastNick: function(nick) {
        var i = this.lastNicks.indexOf(nick);
        if (i != -1) {
            this.lastNicks.splice(i, 1);
        } /*else if (this.lastNicks.length == this.options.maxnicks) {
            this.lastNicks.pop();
        }*/
        this.lastNicks.unshift(nick);
    },

    _initChanTopic: function(channel, topic) {
        this.trigger("chanTopic", {
            'channel': channel,
            'topic': topic,
            'initial': true
        });
    },

    _initChanUsers: function(channel, names) {
        if (names.length === 0) { //occurs on channel join
            this.updateNickList(channel);
            return;
        }
        var getPrefixes = util.prefixOnNick(this.prefixes);
        _.each(names, function(prenick) {
            var prefixNick = getPrefixes(prenick),
                prefixes = prefixNick[0],
                nick = prefixNick[1];

            if (channel !== BROUHAHA) {
                this.tracker.addNickToChannel(nick, BROUHAHA);
            }
            var nc = this.tracker.addNickToChannel(nick, channel);

            _.each(prefixes, function(p) {
                util.addPrefix(nc, p, this.prefixes);
            }, this);
        }, this);
    },

    onAuthenticated: function(data) {
        this.authed = true;
        this.exec("/UMODE +x");
        if (!this.__autojoined) {
            this.writeMessages(lang.joinChans);
            this.exec("/AUTOJOIN");
        }

        this.fireEvent("auth", {
            nick: data.nick,
            message: _.last(data.args),
            host: data.host,
            username: _.first(data.args)
        });
    },

    _whois: function(nick, type, data) {
        var ndata = {
            "n": nick,
            channel: ACTIVE,
            msgs: []
        };
        var mtype = type.toUpperCase();
        var msgs = ndata.msgs;

        switch(type.toLowerCase()) {
            case "user":
                msgs.push({
                    type: "whoisUser",
                    h: data.ident + "@" + data.hostname
                });

                msgs.push({
                    type: "whoisRealname",
                    m: data.realname
                });
            break;
            case "server":
                msgs.push({
                    x: data.server,
                    message: data.serverdesc,
                    type: "whoisServer"
                });
            break;
            case "channels":
                msgs.push({
                    message: data.channels,
                    type: "whoisChannels"
                });
            break;
            case "account":
                msgs.push({
                    message: data.account,
                    type: "whoisAccount"
                });
            break;
            case "away":
                msgs.push({
                    message: data.away,
                    type: "whoisAway"
                });
            break;
            case "opername":
                msgs.push({
                    message: data.opername,
                    type: "whoisOpername"
                });
            break;
            case "actually":
                msgs.push({
                    message: data.hostname,
                    x: data.ip,
                    type: "whoisActually"
                });
            break;
            case "generictext":
                msgs.push({
                    message: data.text,
                    type: "whoisGenericText"
                });
            break;
            default:
                msgs.push({
                    type: "whois" + type.toLowerCase().capitalize()
                });
        }

        this.trigger("whois", ndata);
        return true;
    },

    /*********************************************************************
    *                                                                    *
    *                BEGIN STANDARD IRC HANDLERS                         *
    *                                                                    *
    **********************************************************************/
    IRC_COMMAND_MAP: {// function router see _ndispatch
        // "ERROR": "",
        // "INVITE": "",
        // "JOIN": "",
        // "KICK": "",
        // "MODE": "",
        // "NICK": "",
        // "NOTICE": "",
        // "PART": "",
        // "PING": "",
        // "TOPIC": "",
        // "PRIVMSG": "",
        // "QUIT": "",
        // "WALLOPS": "",

        "ERR_CANNOTSENDTOCHAN": "genericError",
        "ERR_CHANOPPRIVSNEEDED": "genericError",
        // "ERR_NICKNAMEINUSE": "",
        "ERR_NOSUCHNICK": "genericQueryError"//,

        // "RPL_AWAY": "",
        // "RPL_CHANNELMODEIS": "",
        // "RPL_CREATIONTIME": "",
        // "RPL_ENDOFNAMES": "",
        // "RPL_ISUPPORT": "",
        // "RPL_LIST": "",
        // "RPL_LISTSTART": "",
        // "RPL_LISTEND": "",
        // "RPL_NAMREPLY": "",
        // "RPL_NOTOPIC": "",
        // "RPL_NOWAWAY": "",
        // "RPL_TOPIC": "",
        // "RPL_TOPICWHOTIME": "",
        // "RPL_UNAWAY": "",
        // "RPL_WELCOME": "",

        // "RPL_WHOISACCOUNT": "",
        // "RPL_WHOISACTUALLY": "",
        // "RPL_WHOISCHANNELS": "",
        // "RPL_WHOISGENERICTEXT": "",
        // "RPL_WHOISIDLE": "",
        // "RPL_WHOISOPERATOR": "",
        // "RPL_WHOISOPERNAME": "",
        // "RPL_WHOISSECURE": "",
        // "RPL_WHOISSERVER": "",
        // "RPL_WHOISUSER": "",
        // "RPL_WHOISWEBIRC": "",
        // "RPL_ENDOFWHOIS": "",
    },

    irc_PING: function(data) {
        this.send("PONG :" + _.last(data.args));
        return true;
    },

    irc_RPL_WELCOME: function(data) {
        var self = this;
        self.nickname = data.args[0];
        data.message = data.args[1];
        self.lowerNickname = self.toIRCLower(self.nickname);
        self._signOn(data);
        _.delay(function() {
            self.__signedOn = true; //so auto join channels arent selected immediately - brouhaha window is
        }, 2000);
    },

    irc_NICK: function(data) {
        var self = this,
            newnick = data.args[0],
            oldnick = data.nick,
            wasus = this.nickname === oldnick;

        if (wasus) { //shouldnt this always be true?
            this.nickname = newnick;
            this.lowerNickname = this.toIRCLower(this.nickname);
        }

        if (wasus) {
            self.nickname = newnick;
            self.options.settings.set("nickname", newnick);
        }

        self.tracker.renameNick(oldnick, newnick);

        var channels = self.tracker.getNick(newnick);

        _.each(channels, function(obj, chan) {
            self.updateNickList(chan);
        });

        self.trigger("nickChange", {
            'nick': oldnick,
            'newnick': newnick,
            'channels': channels,
            'thisclient': wasus,
            'type': 'nick'
        });

        return true;
    },

    irc_JOIN: function(data) {
        var channel = data.args[0],
            nick = data.nick,
            wasus = (nick === this.nickname);

        if(wasus) {
            if(!isBaseWindow(channel)) {
                this.storeChannels(util.addChannel(this.getChannels(), channel));
            }
            if(this.__signedOn) {
                this.currentChannel = channel;
            }
        }

        var nick = data.nick,
            host = data.host,
            wasus = (nick === this.nickname),
            type = wasus ? "OURJOIN" : "JOIN",
            windowSelected = (channel === this.currentChannel || channel === BROUHAHA);

        this.tracker.addNickToChannel(nick, BROUHAHA);
        this.tracker.addNickToChannel(nick, channel);
        this.updateNickList(BROUHAHA);
        this.updateNickList(channel);

        this.trigger("userJoined", {
            'nick': nick,
            'host': host,
            'channel': channel,
            'thisclient': wasus,
            'select': windowSelected
        });

        return true;
    },

    irc_QUIT: function(data) {
        var self = this,
            message = _.last(data.args),
            nick = data.nick,
            channels = self.tracker.getNick(nick);

        self.tracker.removeNick(nick);
        _.keys(channels).each(function(chan) {
            self.updateNickList(chan);
        });

        self.trigger("quit", {
            'host': data.host,
            'nick': nick,
            'channels': channels,
            'message': message
        });

        return true;
    },

    irc_PART: function(data) {
        var channel = data.args[0],
            message = data.args[1],
            nick = data.nick,
            wasus = (nick === this.nickname);

        this.partHandler(nick, channel);

        if (wasus) {
            this.tracker.removeChannel(channel);
        } else {
            this.tracker.removeNickFromChannel(nick, BROUHAHA);
            this.tracker.removeNickFromChannel(nick, channel);
            this.updateNickList(BROUHAHA);
            this.updateNickList(channel);
        }

        this.trigger("part", {
            'nick': nick,
            'host': data.host,
            'channel': channel,
            'message': message,
            'thisclient': wasus
        });

        return true;
    },

    irc_KICK: function(data) {
        var kicker = data.prefix,
            channel = data.args[0],
            kickee = data.args[1],
            message = data.args[2],
            wasus = kickee === this.nickname;

        this.partHandler(kickee, channel);
        if (wasus) {
            this.tracker.removeChannel(channel);
        } else {
            this.tracker.removeNickFromChannel(kickee, channel);
            this.updateNickList(channel);
        }

        this.trigger("kick", {
            'kicker': kicker,
            'channel': channel,
            'kickee': kickee,
            'message': message,
            'thisclient': wasus
        });

        return true;
    },

    partHandler: function(nick, chan) {
        var wasus = nick === this.nickname;
        if(wasus && this.inChannel(chan)) {
            this.channels.erase(chan);
        }
        return wasus;
    },

    irc_TOPIC: function(data) {
        var channel = data.args[0],
            topic = _.last(data.args);

        this.trigger("chanTopic", {
            'nick': data.nick,
            'channel': channel,
            'topic': topic
        });

        return true;
    },

    //todo buffer messages
    irc_PRIVMSG: function(data) {
        var nick = data.nick,
            target = data.args[0],
            message = _.last(data.args);

        var ctcp = this.processCTCP(message);
        if (ctcp) {
            var type = ctcp[0].toUpperCase();
            var replyfn = irc.RegisteredCTCPs[type];
            if (replyfn) {
                var t = Date.now() / 1000;//prevent flood
                if (t > this.nextctcp) {
                    this.send(format(cmd.CTCP, {
                        target: data.user,
                        type: type,
                        text: replyfn(ctcp[1])
                    }));
                }
                this.nextctcp = t + 5;
            }

            if (target === this.nickname) {
                var ctcptype = type == "ACTION" ? "privAction" : "privCTCP";
                this.trigger(ctcptype, {
                    'nick': nick,
                    'host': data.host,
                    'message': ctcp[1] || "",
                    'data': type
                });
            } else {
                var data = {
                        'nick': nick,
                        'channel': target,
                        'message': ctcp[1] || "",
                        "prefix": this.getNickStatus(target, nick)
                    };
                if (type == "ACTION") {
                    this.tracker.updateLastSpoke(nick, target, Date.now());
                    this.trigger("chanAction", data);
                }
                else {
                    this.trigger("chanCTCP", data);
                }
            }
        } else {
            if (target === this.nickname) {
                this._pushLastNick(nick);
                this.trigger("query", {
                    'nick': nick,
                    'host': data.host,
                    'channel': nick,
                    'message': message,
                    'type': 'privmsg'
                });
            } else {
                this.tracker.updateLastSpoke(nick, target, Date.now());
                this.trigger("chanMessage", {
                    'nick': nick,
                    'channel': target,
                    'message': message,
                    'type': 'chanmsg',
                    "prefix": this.getNickStatus(target, nick)
                });
            }
        }
        return true;
    },

    irc_NOTICE: function(data) {
        var target = data.args[0],
            message = _.last(data.args),
            options = this.options;


        if (this.isNetworkService(data.host) || !$chk(data.nick)) {
            if(options.loginRegex.test(message)){
                this.onAuthenticated(data);
            }
            this.trigger("serverNotice", {
                'nick': data.nick,
                'message': message,
                'channel': STATUS
            });
        } else if (target === this.nickname) {
            var ctcp = this.processCTCP(message);
            if (ctcp) {
                this.trigger("ctcpReply", {
                    'nick': data.nick,
                    'host': data.host,
                    'ctcptype': ctcp[0],
                    'args': ctcp[1] || ""
                });
            } else {
                this.trigger("privNotice", {
                    'message': message,
                    'host': data.host,
                    'nick': data.nick,
                    'channel': data.nick
                });
            }
        } else {
            this.trigger("chanNotice", {
                'nick': data.nick,
                'channel': target,
                'message': message,
                "prefix": this.getNickStatus(target, data.nick)
            });
        }

        return true;
    },

    irc_INVITE: function(data) {
        var channel = _.last(data.args);
        var accept = this.ui.uiOptions2.get("accept_service_invites") && this.isNetworkService(host);

        if (accept) {
            if (this.activeTimers.serviceInvite) {
                $clear(this.activeTimers.serviceInvite);
            }
            // we do this so we can batch the joins
            this.activeTimers.serviceInvite = this._joinInvited();
            this.inviteChanList.push(channel);
        }

        this.trigger("invite", {
            'channel': channel,
            'accept': accept,
            'nick': data.nick,
            'host': data.host
        });

        return true;
    },


    irc_ERR_NICKNAMEINUSE: function(data) {//add some number to the nick and resend
        this.genericError(data);

        if (this.__signedOn) {
            return true;
        }

        var nick = data.args[1],
            newnick = nick + Number.random(0, 9);

        this.send(format(cmd.NICK, {nick: newnick}));
        this.lastnick = newnick;
        return true;
    },

    irc_ERROR: function(data) {
        var message = _.last(data.args);

        this.trigger("error", {
            message: message,
            type: "genericError"
        });

        return true;
    },

    irc_MODE: function(data) {//http://tools.ietf.org/html/rfc1459.html#section-4.2.3
        var self = this,
            target = data.args[0],
            args = data.args.slice(1);

        if (target == this.nickname) {
            this.trigger("userMode", {
                'modes': args,
                'message': args.join(""),
                'type': "UMODE",
                'n': this.nickname
            });
        } else {//target is channel
            var modes = args[0].split(""),
                nick = _.last(args),//note: not bothering for ban mask case 

                cmode = OPED;

            var modes = modes.filter(function(mode) {
                var dir = (mode === OPED) || (mode === DEOPED);
                if (dir) {
                    cmode = mode;
                }
                return !dir;
            }).each(function(mode) {
                var pmode = self.pmodes[mode],
                    _nick = pmode === irc.PMODE_LIST || pmode === irc.PMODE_SET_UNSET ? nick : null;

                var prefixindex = self.modeprefixes.indexOf(mode);
                if (prefixindex === -1) return;

                var nc = self.tracker.getOrCreateNickOnChannel(nick, target),
                    added = cmode === OPED;

                var prefix = self.prefixes.charAt(self.modeprefixes.indexOf(mode));

                var prefixchar = added ? util.addPrefix(nc, prefix, self.prefixes) :
                                        util.removePrefix(nc, prefix);

                self.trigger("mode", {
                    "added": added,
                    "prefix": prefixchar,
                    "message": prefixchar,
                    "nick": _nick,
                    "channel": target,
                    "thisclient": _nick === self.nickname,
                    "nickchan": nc
                });
            });

            self.updateNickList(target);
        }

        return true;
    },

    irc_RPL_ISUPPORT: function(data) {
        var supported = data.args.slice(1, -1); //everything but nick and server msg
        var ms;

        if(supported.contains("CHANMODES") && supported.contains("PREFIX")) { //nasty hack - don't understand purpose 
            this.pmodes = {}; //might invalidate things
        }

        supported.each(function(mode) {
            ms = mode.splitMax("=", 2);
            this._supported(ms[0], ms[1]);
        }, this);
    },

    irc_RPL_NAMREPLY: function(data) {
        var channel = data.args[2],
            names = data.args[3];

        this._initChanUsers(channel, names.split(" "));

        return true;
    },

    irc_RPL_ENDOFNAMES: function(data) {
        var channel = data.args[1];

        this._initChanUsers(channel, []);
        return true;
    },

    irc_RPL_NOTOPIC: function(data) {
        var channel = data.args[1];

        if (this.inChannel(channel)) {
            this._initChanTopic(channel, "");
            return true;
        }
    },

    irc_RPL_TOPIC: function(data) {
        var channel = data.args[1],
            topic = _.last(data.args);

        if (this.inChannel(channel)) {
            this._initChanTopic(channel, topic);
            return true;
        }
    },

    irc_RPL_TOPICWHOTIME: $lambda(true),

    irc_RPL_WHOISUSER: function(data) {
        var nick = data.args[1];
        this._whoisNick = nick;

        return this._whois(nick, "user", {
            ident: data.args[2],
            hostname: data.args[3],
            realname: _.last(data.args)
        });
    },

    irc_RPL_WHOISSERVER: function(data) {
        var nick = data.args[1],
            server = data.args[2],
            serverdesc = _.last(data.args);

        return this._whois(nick, "server", {
            server: data.args[2],
            serverdesc: _.last(data.args)
        });
    },

    irc_RPL_WHOISOPERATOR: function(data) {
        var nick = data.args[1],
            text = _.last(data.args);

        return this._whois(nick, "oper", {
            opertext: _.last(data.args)
        });
    },

    irc_RPL_WHOISIDLE: function(data) {
        var nick = data.args[1];

        return this._whois(nick, "idle", {
            idle: data.args[2],
            connected: data.args[3]
        });
    },

    irc_RPL_WHOISCHANNELS: function(data) {
        var nick = data.args[1];

        return this._whois(nick, "channels", {
            channels: _.last(data.args)
        });
    },

    irc_RPL_WHOISACCOUNT: function(data) {
        var nick = data.args[1];

        return this._whois(nick, "account", {
            account: data.args[2]
        });
    },

    irc_RPL_WHOISACTUALLY: function(data) {
        var nick = data.args[1];

        return this._whois(nick, "actually", {
            hostmask: data.args[2],
            ip: data.args[3]
        });
    },

    irc_RPL_WHOISOPERNAME: function(data) {
        var nick = data.args[1],
            opername = data.args[2];

        return this._whois(nick, "opername", {
            opername: data.args[2]
        });
    },

    irc_RPL_WHOISGENERICTEXT: function(data) {
        var nick = data.args[1],
            text = _.last(data.args);

        return this._whois(nick, "generictext", {
            text: text
        });
    },

    irc_RPL_WHOISWEBIRC: function(data) {
        var nick = data.args[1],
            text = _.last(data.args);

        return this._whois(nick, "generictext", {
            text: text
        });
    },

    irc_RPL_WHOISSECURE: function(data) {
        var nick = data.args[1],
            text = _.last(data.args);

        return this._whois(nick, "generictext", {
            text: text
        });
    },

    irc_RPL_ENDOFWHOIS: function(data) {
        var nick = data.args[1],
            text = _.last(data.args);
        delete this._whoisNick;

        return this._whois(nick, "end", {});
    },

    irc_RPL_AWAY: function(data) {
        var nick = data.args[1],
            message = _.last(data.args);

        if (this._whoisNick == nick) {
            return this._whois(nick, "away", {
                "away": message
            });
        }
        this.trigger("away", {
            "nick": nick,
            "message": message
        });
        return true;
    },

    irc_RPL_NOWAWAY: function(data) {
        this.trigger("error", {
            state: true,
            message: _.last(data.args),
            type: "genericError"
        });
        return true;
    },

    irc_RPL_UNAWAY: function(data) {
        this.trigger("error", {
            state: false,
            message: _.last(data.args),
            type: "genericError"
        })
        return true;
    },

    irc_WALLOPS: function(data) {
        this.trigger("wallops", {
            message: message,
            nick: data.nick,
            host: data.host
        });
        return true;
    },

    irc_RPL_CREATIONTIME: function(data) {
        var channel = data.args[1],
            time = data.args[2];

        this.trigger("serverMessage", {
            channel: channel || ACTIVE,
            message: util.IRCDate(new Date(time * 1000)),
            type: "channelCreationTime"
        });
        return true;
    },

    irc_RPL_CHANNELMODEIS: function(data) {
        var channel = data.args[1],
            modes = data.args.slice(2);

        this.trigger("serverMessage", {
            channel: channel || ACTIVE,
            message: modes.join(" "),
            type: "channelModeIs"
        });
        return true;
    },


    irc_RPL_LISTSTART: function() {
        this.listedChans = [];//should have a make list command in command utils
        return !this.hidelistout;
    },

    irc_RPL_LIST: function(data) {
        this.listedChans.push({
            channel: data.args[1],
            users: _.toInt(data.args[2]),
            topic: data.args[3]
        });
        return !this.hidelistout;
    },

    irc_RPL_LISTEND: function() {
        this.trigger("listend", this.listedChans);
        return !this.hidelistout;
    }
});
/*************************
   Whewh.. end irc client
***************************/
// /* This could do with a rewrite from scratch. */
//going to rewrite using socket.io commet.
// //COMMANDS = dict(p=push, n=newConnection, s=subscribe)
irc.TwistedConnection = new Class({
    Implements: [Events, Options],
    Binds: ["send","__completeRequest"],
    options: {
        initialNickname: "ircconnX",
        minTimeout: 45000,
        maxTimeout: 5 * 60000,
        timeoutIncrement: 10000,
        initialTimeout: 65000,
        floodInterval: 200,
        floodMax: 10,
        floodReset: 5000,
        errorAlert: true,
        maxRetries: 5,
        serverPassword: null
    },

    initialize: function(options) {
        var self = this;
        self.setOptions(options);
        self.counter = 0;
        self.disconnected = false;
        self.__floodLastRequest = 0;
        self.__floodCounter = 0;
        self.__floodLastFlood = 0;
        self.__retryAttempts = 0;
        self.__timeoutId = null;
        self.__timeout = self.options.initialTimeout;
        self.__lastActiveRequest = null;
        self.__activeRequest = null;
        self.__sendQueue = [];
        self.__sendQueueActive = false;
    },

    connect: function() {
        var self = this;
        self.cacheAvoidance = util.randHexString(16);
        var request = self.newRequest("n");

        request.addEvent("complete", function(stream) {
            if (!stream) {
                self.disconnected = true;
                self.__error(lang.connectionFail);
                return;
            }
            else if (!stream[0]) {
                self.disconnect();
                self.__error(lang.connError, stream);
                return;
            }
            self.sessionid = stream[1];
            self.recv();
        });

        var postdata = "nick=" + encodeURIComponent(self.options.initialNickname);
        if ($defined(self.options.serverPassword)) {
            postdata += "&password=" + encodeURIComponent(self.options.serverPassword);
        }
        request.send(postdata);
    },

    disconnect: function() {
        this.disconnected = true;
        this.__cancelTimeout();
        this.__cancelRequests();
    },

    newRequest: function(url, floodProtection, synchronous) {
        var self = this;
        //check if request should proceed
        if (self.disconnected) {
            return null;
        } else if (floodProtection && !self.disconnected && self.__isFlooding()) {
            self.disconnect();
            self.__error(lang.uncontrolledFlood);
        }
        var request = new Request.JSON({
            url: qwebirc.global.dynamicBaseURL + "e/" + url + "?r=" + self.cacheAvoidance + "&t=" + self.counter++,
            async: !synchronous
        });

        // try to minimise the amount of headers 
        request.headers = {};

        //calls forEach on headers to be removed in the context of the request.xhr on readystatechange.
        //calls setXHRHeaders in the context of the request.xhr object
        // request.addEvent("request", _.partial(irc.TwistedConnection.setXHRHeaders, request.xhr));
        if (Browser.ie && Browser.version < 8) {
            request.setHeader("If-Modified-Since", "Sat, 1 Jan 2000 00:00:00 GMT");
        }
        return request;
    },

    recv: function() {
        var self = this,
            request = self.newRequest("s", true);
        if (!$defined(request)) {
            return;
        }
        self.__activeRequest = request;
        request.__replaced = false;
        var onComplete = function(stream) {
            // replaced requests... 
            if (request.__replaced) {
                self.__lastActiveRequest = null;
                if (stream) {
                    self.__processData(stream);
                }
                return;
            }
            // the main request 
            self.__activeRequest = null;
            self.__cancelTimeout();
            if (!stream) {
                if (!self.disconnected && self.__checkRetries()) {
                    self.recv();
                }
                return;
            }
            else if (self.__processData(stream)) {
                self.recv();
            }
        };
        request.addEvent("complete", onComplete);
        self.__scheduleTimeout();
        request.send("s=" + self.sessionid);
    },

    send: function(data, synchronous) {
        if (this.disconnected) {
            return false;
        }
        if (synchronous) {
            this.__send(data, false);
        } else {
            this.__sendQueue.push(data);
            this.__processSendQueue();
        }
        return true;
    },

    __processSendQueue: function() {
        if (this.__sendQueueActive || this.__sendQueue.length === 0) {
            return;
        }
        this.sendQueueActive = true;
        this.__send(this.__sendQueue.shift(), true);
    },

    __send: function(data, async) {
        var request = this.newRequest("p", false, !async);
        if (request === null) {
            return;
        }
        request.addEvent("complete", _.partial(this.__completeRequest, async))
                .send("s=" + this.sessionid + "&c=" + encodeURIComponent(data));
    },

    __completeRequest: function(async, stream) {
        if (async) {
            this.__sendQueueActive = false;
        }
        if (!stream || (!stream[0])) {
            this.__sendQueue = [];
            if (!this.disconnected) {
                this.disconnected = true;
                this.__error(lang.connError, stream);
            }
            return false;
        }
        this.__processSendQueue();
    },

    __isFlooding: function() {
        var t = Date.now(),
            floodt = t - this.__floodLastRequest;
        if (floodt < this.options.floodInterval) {
            if (this.__floodLastFlood !== 0 && (floodt > this.options.floodReset)) {
                this.__floodCounter = 0;
            }
            this.__floodLastFlood = t;
            if (++this.__floodCounter > this.options.floodMax) {
                return true;
            }
        }
        this.__floodLastRequest = t;
        return false;
    },

    __checkRetries: function() { /* hmm, something went wrong! */
        if (++this.__retryAttempts > this.options.maxRetries && !this.disconnected) {
            this.disconnect();
            this.__error(lang.connTimeOut, {retryAttempts: this.__retryAttempts});
            return false;
        }
        var to = this.__timeout - this.options.timeoutIncrement;
        if (to >= this.options.minTimeout) {
            this.__timeout = to;
        }
        return true;
    },

    __cancelRequests: function() {
        if ($defined(this.__lastActiveRequest)) {
            this.__lastActiveRequest.cancel();
            this.__lastActiveRequest = null;
        }
        if ($defined(this.__activeRequest)) {
            this.__activeRequest.cancel();
            this.__activeRequest = null;
        }
    },

    __processData: function(o) {
        if (o[0] == false) {
            if (!this.disconnected) {
                this.disconnected = true;
                this.__error(lang.connError, o);
            }
            return false;
        }

        this.__retryAttempts = 0;
        o.each(function(x) {
            this.fireEvent("recv", [x]);
        }, this);

        return true;
    },


    __scheduleTimeout: function() {
        this.__timeoutId = this.__timeoutEvent.delay(this.__timeout, this);
    },

    __cancelTimeout: function() {
        if ($defined(this.__timeoutId)) {
            $clear(this.__timeoutId);
            this.__timeoutId = null;
        }
    },

    __timeoutEvent: function() {
        this.__timeoutId = null;
        if (!$defined(this.__activeRequest)) {
            return;
        } else if (this.__lastActiveRequest) {
            this.__lastActiveRequest.cancel();
        }
        this.fireEvent("timeout", {
            duration: this.__timeout
        });
        this.__activeRequest.__replaced = true;
        this.__lastActiveRequest = this.__activeRequest;
        var to = this.__timeout + this.options.timeoutIncrement;
        if (to <= this.options.maxTimeout) {
            this.__timeout = to;
        }
        this.recv();
    },

    __error: function(message, context) {
        var msg = context ? util.formatter(message.message, context) : message.message;
        this.fireEvent("error", msg);
        if (this.options.errorAlert) {
            alert(msg);
        }
        console.log('had error:' + msg);
    }
});

// (function() {//http://blog.mibbit.com/?p=143
//     //moved browser specific headers to be removed here so it doesnt have to be computed each connection.
//     //header nullables are browser dependent
//     //http://www.michael-noll.com/tutorials/cookie-monster-for-xmlhttprequest/
//     // var killBit = null;

//     // var kill = {
//     //     "User-Agent": killBit,
//     //     "Accept": killBit,
//     //     "Accept-Language": killBit,
//     //     "Content-Type": "M",
//     //     "Connection": "keep-alive",
//     //     "Keep-Alive": killBit
//     // };

//     // //removes a header from an xhr object (this instanceof xhr)

//     // function removeHeaders(val, header) {
//     //     try {
//     //         this.setRequestHeader(header, val);
//     //     } catch (e) {console.log(header)}
//     // }



//     //iteratres the headers to be removed with the removeHeaders function
//     //expects a xhr object as the third param 
//     // conn.setXHRHeaders = function(xhr) {
//     //     kill.each(removeHeaders, xhr);
//     //     //remove cookies from xhr
//     //     // new CookieMonster(xhr);
//     // };

//     irc.TwistedConnection.setXHRHeaders = _.identity; //_.partial(_.each, kill, removeHeaders);

//     // conn.setXHRHeaders = function(xhr) {
//     //     kill.each(removeHeaders, xhr);
//     // };
// })();

irc.IRCTracker = new Class({
    channels: {},
    nicknames: {},
    initialize: function(owner) {
        this.owner = owner;
    },

    toIRCLower: function(value) {
        /* proxied because the method can change after we connect */

        return this.owner.toIRCLower(value);
    },

    getNick: function(nick) {
        return this.nicknames[nick];
    },

    getOrCreateNick: function(nick) {
        return this.getNick(nick) || (this.nicknames[nick] = {});
    },

    getChannel: function(channel) {
        return this.channels[this.toIRCLower(channel)];
    },

    getOrCreateChannel: function(channel) {
        return this.getChannel(channel) || (this.channels[this.toIRCLower(channel)] = {});
    },

    getOrCreateNickOnChannel: function(nick, channel) {
        var nc = this.getOrCreateNick(nick);

        return nc[this.toIRCLower(channel)] || this.addNickToChannel(nc, channel);
    },

    getNickOnChannel: function(nick, channel) {
        var nickchan = this.getNick(nick);
        if (!nickchan) {
            return;
        } else {
            return nickchan[this.toIRCLower(channel)];
        }
    },

    addNickToChannel: function(nick, channel) {
        var nc = irc.nickChanEntry();

        var nickchan = this.getOrCreateNick(nick);
        nickchan[this.toIRCLower(channel)] = nc;

        var chan = this.getOrCreateChannel(channel);
        chan[nick] = nc;

        return nc;
    },

    removeNick: function(nick) {
        var nickchan = this.getNick(nick);
        if (nickchan){
            _.each(nickchan, function(data, chan) {
                var lchannel = this.toIRCLower(chan),
                    channel = this.channels[lchannel];

                delete channel[nick];
                if (_.isEmpty(channel)) {
                    delete this.channels[lchannel];
                }
            }, this);
            delete this.nicknames[nick];
        }
    },

    removeChannel: function(channel) {
        var chan = this.getChannel(channel);
        if (chan) {
            var lchannel = this.toIRCLower(channel);
            _.each(_.keys(chan), function(nick) {
                var nc = this.nicknames[nick];
                delete nc[lchannel];
                if (_.isEmpty(nc)) { //in no more channels
                    delete this.nicknames[nick];
                }
            }, this);
            delete this.channels[lchannel];
        }
    },

    removeNickFromChannel: function(nick, channel) {
        var lchannel = this.toIRCLower(channel);

        var nickchan = this.getNick(nick);
        var chan = this.getChannel(lchannel);
        if (!nickchan || !chan) return;

        delete nickchan[lchannel];
        delete chan[nick];

        if (_.isEmpty(nickchan)) {
            delete this.nicknames[nick];
        }
        if (_.isEmpty(chan)) {
            delete this.channels[lchannel];
        }
    },

    renameNick: function(oldnick, newnick) {
        var nickchans = this.getNick(oldnick);
        if (!nickchans)
            return;

        _.each(_.keys(nickchans), function(channel) {
            var lchannel = this.toIRCLower(channel);
            this.channels[lchannel][newnick] = this.channels[lchannel][oldnick];
            delete this.channels[lchannel][oldnick];
        }, this);

        this.nicknames[newnick] = this.nicknames[oldnick];
        delete this.nicknames[oldnick];
    },

    updateLastSpoke: function(nick, channel, time) {
        var nc = this.getNickOnChannel(nick, channel);
        if ($defined(nc)) {
            nc.lastSpoke = time;
        }
    },

    getSortedByLastSpoke: function(channel) {
        var nickHash = this.getChannel(channel);
        if (!nickHash) return;

        return _.chain(nickHash)
                .values()
                .sortBy(function(nick) {
                    return -nick.lastSpoke;//reverse
                })
                .value();
    },

    getSortedNicksForChannel: function(channel, sorter) {
        var nickHash = this.getChannel(channel);
        if(_.isEmpty(nickHash)) return [];
        if(!sorter) {
            //sorts nicks by status > lexigraphy
            //then add the prefix in front of the name
            sorter = util.nickChanComparitor(this.owner, nickHash);
        }
        return _.keys(nickHash).sort(sorter).map(function(nick, index) {
            return {
                prefix: nickHash[nick].prefixes,
                nick: nick,
                index: index//in array
            };
        });
    }
});

irc.RegisteredCTCPs = {
    "VERSION": $lambda("qwebirc v" + qwebirc.VERSION + ", copyright (C) 2008-2011 Chris Porter and the qwebirc project -- " + navigator.userAgent),
    "USERINFO": $lambda("qwebirc"),
    "TIME": function(x) {
        return util.IRCDate(new Date());
    },
    "PING": $lambda,
    "CLIENTINFO": $lambda("PING VERSION TIME USERINFO CLIENTINFO WEBSITE"),
    "WEBSITE": $lambda(((window == window.top) ? "direct" : document.referrer))
};
})();

ui.WINDOW_ID_MAP = [
    {
        id: "privacy",
        keys: ["privacy policy"]
    },
    {
        id: "embedded",
        keys: ["add webchat to your site"]
    },
    {
        id: "login",
        keys: ["connection details"]
    }
];

ui.IWindows = new Class({
    windows: {},
    customWindows: {},
    windowArray: [],
    Window: ui.Window,//OVERRIDE!
    nav: null,

    getWindowIdentifier: function(name) {
        var id = name.toLowerCase()
        var wid = _.find(qwebirc.ui.WINDOW_ID_MAP, function(val) {return val.keys.contains(id);});
        return wid && wid.id || id;
    },

    getClientId: function(client) {
        return client === ui.CUSTOM_CLIENT || !client ? ui.CUSTOM_CLIENT : client.id;
    },

    newWindow: function(client, type, name) {
        var win = this.getWindow(client, name);
        if (!$defined(win)) {
            if(util.windowNeedsInput(type)) {
                this.commandhistory.addChannel(name);
            }
            var wId = this.getWindowIdentifier(name);
            var $wrapper = new Element('div.hidden').inject(this.windowsPanel);//for delegation - this is not how i should do it
            win = this.windows[this.getClientId(client)][wId] = new this.Window(this, $wrapper, client, type, name, wId);
            this.windowArray.push(win);
        }

        return win;
    },

    getWindow: function(client, name) {
        if(_.isString(client)) name = client;
        var wins = this.getWindows(client);
        if (_.isObject(wins)) 
            return wins[this.getWindowIdentifier(name)];
    },

    getWindows: function(client) {
        return this.windows[this.getClientId(client)] || this.customWindows;
    },

    getActiveWindow: function() {
        return this.active;
    },
    getActiveIRCWindow: function(client) {
        if (!this.active || this.active.type == ui.WINDOW.custom) {
            return this.windows[this.getClientId(client)][this.getWindowIdentifier(STATUS)];
        } else {
            return this.active;
        }
    },
    selectWindow: function(win) {
        if(_.isNumber(win))
            win = this.windowArray[win];
        else if(_.isString(win))
            win = this.getWindow(win);
        if(win !== this.active) {
            if (this.active) {
                this.active.deselect();
            }
            win.select();
            this.setWindow(win);
            ui.setTitle(win.name + " - " + this.options.appTitle);
            this.updateURI();
        }
        return win;
    },
    updateURI: util.noop,
    setWindow: function(win) {
        if(!this.active || (win !== this.active && !this.active.closed)) {
            this.last = this.active;
        }
        this.active = win;
    },
    __closed: function(win) {
        var winarr = this.windowArray;
        var isActive = win === this.active;

        this.commandhistory.removeChannel(win.name);
        this.nav.removeTab(win.tab);
        var index = winarr.indexOf(win);
        winarr = this.windowArray.erase(win);
        delete this.windows[this.getClientId(win.client)][win.identifier];

        if (isActive) {
            delete this.active;
            if(this.last) {//select last active window
                this.last.select();
            }
            else if (!_.isEmpty(winarr)) {//case for 2 consecutive closes
                _.nextItem(winarr, index).select();
            }
        }
    },
    nextWindow: function(direction, fromWin) {
        var windows = _.where(this.windowArray, {detached:false}),
            win = _.nextItem(windows, windows.indexOf(fromWin || this.active), direction); //get window from array
        if(win) win.select();

        return win;
    },
    prevWindow: function() {
        this.nextWindow(-1);
    },

    newCustomWindow: function(name, select, type) {
        type = type || ui.WINDOW.custom;

        var win = this.newWindow(ui.CUSTOM_CLIENT, type, name);

        if (select) this.selectWindow(win);

        return win;
    },

    addCustomWindow: function(windowName, CustomView, cssClass, options) {
        var wid = this.getWindowIdentifier(windowName);
        if (_.has(this.customWindows, wid)) {
            return this.selectWindow(this.customWindows[wid]);
        }

        var win = this.newCustomWindow(windowName, true);
        this.customWindows[wid] = win;

        win.addEvent("destroy", function() {
            delete this.customWindows[wid];
        }.bind(this));

        if(_.isString(cssClass)) {
            win.lines.addClass(cssClass);
        }

        options = _.extend({
            element: win.lines
        }, options);
        new CustomView(options)
            .addEvent("close", win.close);


        return win;
    }
});

(function() {

//expects to be implemented with windowsui
ui.IIRCClient = new Class({
    Implements: [ui.IWindows],

    clients: {},
    clientId: 0,

    newClient: function(client) {
        client.id = this.clientId++;

        var windows = this.windows[client.id] = {};
        this.clients[client.id] = client;
        var win = this.newWindow(client, ui.WINDOW.status, STATUS);
        this.selectWindow(win);

        addClientEvents.call(this, client, windows);

        return win;
    },
    /*logout: function() {
        if (!auth.loggedin)
            return;
        if (confirm("Log out?")) {
            _.each(this.clients, function(client) {
                client.quit(lang.logOut.message);
            });

            (function() {
                document.location = qwebirc.global.dynamicBaseURL + "auth?logout=1";
            }).delay(500);
        }
    },*/
    nickChange: util.noop
});
var broadcast_re = /MSG|TOPIC|(CHAN|PRIV)NOTICE/i;
function formatChans(data) {
    var chans = data.channels;
    return chans && _.isObject(chans) ? _.keys(chans) : Array.from(chans || data.channel);
}
function addClientEvents(client, windows) { // mi gusta xD
    if(! client instanceof irc.IRCClient) return;
    var ui_ = this;
    function formatData(type, _data) {
        var data = _.extend({
            c: _data.channel || STATUS,
            n: _data.nick,
            m: _data.message,
            h: _data.host,
            t: type,
            type: type,
            "@": _data.prefix
        }, _data);
        data.channel = data.c;
        if (!(ui_.uiOptions2.get("nick_ov_status"))){
            delete data["@"];
        }
        return data;
    }

    function lineParser(type, data) {
        data = formatData(type, data);
        
        _.each(formatChans(data), function(channel) {
            data.channel = data.c = channel;
            var win = (data.c === ACTIVE) ? ui_.getActiveWindow() : ui_.getWindow(client, channel);
            if(!win) return;
            if(_.isArray(data.message)) {
                _.each(data.message, function(msg) {
                    data.message = data.m = msg;
                    parser(type, data, win);
                });
            }
            else {
                parser(type, data, win);
            }
        });
    }

    function formatBChannelName(data) {
        if(util.isChannel(channel)) {
            return nick + channel;
        } else {//pm
            nick = client.nickname
            if(channel === nick) {//so it always shows speaker>target
                return channel + ">" + nick;
            } else {
                return nick + ">" + channel;
            }
        }
    }

    function parser(type, data, win, channel) {
        type = data.type || data.t || type;
        channel = data.channel || STATUS;

        win.addLine(data.type, data);

        if(!util.isBaseWindow(data.channel) && broadcast_re.test(type)) {
            var data2 = _.clone(data);
            var nick = data2.nick;
            if(!util.isChannel(channel)) {//pm
                if(channel === nick) {//so it always shows speaker>target
                    channel = ">" + client.nickname;
                } else {
                    channel = ">" + channel;
                    data2.nick = nick;
                }
            }
            data2.linkedchannel = channel;

            ui_.windows.brouhaha.addLine(data2.type, data2);
        }
    }

    function updateTopic(type, data) {
        ui_.getWindow(client, data.channel).updateTopic(data.topic);
        if(!data.initial) {
            data.message = data.topic;
            lineParser("topic", data);
        }
    }

    function joinPart(type, data) {
        if ((data.thisclient && data.type != "PART" && data.type != "QUIT") ||
                !(ui_.uiOptions2.get("hide_joinparts"))) {
            data = _.clone(data);
            data.channels = _.reject(formatChans(data),  util.isBaseWindow);
            lineParser(type, data);
        }
    }

    function partKick(type, data) {
        if(data.thisclient) {
            var win = ui_.getWindow(client, data.channel);
            if(win) win.close();
        } else {
            joinPart(type,data);
        }
    }

    function queried(type, data) {//queries and private notices
        data = formatData(type, data);
        var win = ui_.newWindow(client, ui.WINDOW.query, data.channel); //get or create
        if(data.nick === client.nickname || ui_.uiOptions2.get("auto_open_pm")) {
            ui_.selectWindow(win);
        }
        if(data.message) parser(type, data, win);
    }

    client.addEvents({
        "connect": lineParser,
        // "disconnect": lineParser,
        "error": lineParser,
        "info": lineParser,
        "auth:once": function() {
            ui_.beep();
            ui_.showNotice({
                title: "Successful auth",
                body: "Successfully authed with server and set your hostmask"
            });
        },

        "chanAction": lineParser,
        "chanTopic": updateTopic,
        "chanMessage": lineParser,
        "chanNotice": lineParser,
        "chanCTCP": lineParser,

        "userJoined": function(type, data) {
            if(data.thisclient) {
                var win = ui_.newWindow(client, ui.WINDOW.channel, data.channel);//this is client scope
                if(data.select) {
                    win.select();
                }
            }
            joinPart(data.thisclient ? "ourJoin" : "join", data);
        },

        "openWindow": function(type, data) {//create? and select window
            var win = ui_.getWindow(data.window);
            if(!win) {
                if(data.type === ui.WINDOW.custom) {
                    win = ui_[data.window]();
                } else {
                    win = ui_.newWindow(client, data.type, data.window);
                }
            }
            win.select();
        },

        "updateNicklist": function(type, data) {
            var win = ui_.getWindow(client, data.channel);
            if(win) win.updateNickList(data.nicks);
        },

        "away": lineParser,
        "part": partKick,
        "quit": partKick,
        "kick": partKick,
        "invite": lineParser,
        "privAction": lineParser,
        "privCTCP": lineParser,
        "ctcpReply": lineParser,
        "userMode": lineParser,
        "nickChange": function(type, data) {
            ui_.nickChange(data, client);
            lineParser(type, data);
        },

        "privNotice": queried,
        "query": queried,

        "awayStatus": lineParser,
        "mode": function(type, data) {
            var win = ui_.getWindow(client, data.channel);
            if(win) {
                win.updatePrefix(data);
            }
            lineParser(type, data);
        },
        "serverMessage": lineParser,
        "serverNotice": lineParser,
        "whois": function(type, data) {
            _.each(data.msgs, function(msg) {
                lineParser(type, _.extend({}, data, msg));
            });
        },
        "wallops": lineParser,
        "raw": lineParser
    });
}

})();
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


var LoginBox = function(parentElement, callback, settings, networkName, validators) {
    var nickname = settings.get("nickname"),
        username = Base64.decode(settings.get("username")),
        password = Base64.decode(settings.get("password")),
        eauth = auth.enabled || settings.get("auth");

    getTemplate("authpage", function(template) {
        var page = Element.from(template({
            'network': networkName,
            'nickname': nickname,
            'username': username,
            'password': password,
            'full': eauth, //whether to show the extra auth options (check the checkbox)
            'channels': settings.get("channels").join()
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

                settings.set("username", Base64.encode(username));
                settings.set("password", Base64.encode(password));
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

        ui.Behaviour.apply(page);
    });
};

ui.ILogin = new Class({
    Implements: [Events],
    LoginBox: LoginBox,
    loginBox: function() {
        this.postInitialize();
        var self = this;
        var win = this.newCustomWindow(CONNECTION_DETAILS, true, ui.WINDOW.connect);
        var callback = function(data) {
                win.close();
                self.fireEvent("login", data);
            };
        this.LoginBox(win.lines, callback, this.options.settings, this.options.networkName, this.options.validators);
        return win;
    }
});
})();

ui.IUIOptions = new Class({
    theme: ui.Theme,

    config: function() {
        var self = this;
        var options = self.options;
        if(self.uiOptions instanceof config.OptionModel) return this;
        var uiOptions = self.uiOptions = self.uiOptions2 = new config.OptionModel({
            defaults: options.uiOptionsArg
        });
        function setNotices() {
            var notices = uiOptions.get("standard_notices").concat(uiOptions.get("custom_notices"));
            var notifiers = _.chain(notices)
                .filter(uiOptions.notice_filter)
                .map(function(notice) {
                    var onotice = {
                        beep: notice.beep,
                        flash: notice.flash,
                        pm: notice.pm,

                        mentioned: notice.mentioned,
                        notus: notice.notus,
                        highlight: notice.highlight,
                        tabhl: notice.tabhl,
                        classes: notice.classes,
                        types: notice.types
                    }
                    _.each(["msg", "nick", "type"], function(type) {
                        if(notice[type]) {
                            onotice[type] = new RegExp(notice.autoescape ? String.escapeRegExp(notice[type]) : notice[type],//format regex
                                        notice.case ? "i" : "");//set flag
                        }
                    });

                    return _.clean(onotice);
                })
                .value()
            
            self.theme.messageParsers.empty().combine(notifiers);
        }

        uiOptions.on({
            "change:style_hue": function(style_hue) {
                self.updateStylesheet();
            },
            "change:font_size": self.updateStylesheet,
            "change:custom_notices": setNotices,
            "change:standard_notices": setNotices,
            "change:show_nicklist": function(state) {
                _.each(self.windowArray, function(win){win.toggleNickList()});
            },
            "change:completer": function(completer) {
                self.commandhistory.options.store = completer.store;
                if(!completer.store) self.commandhistory.clear();
                _.each(self.windowArray, function(win) {
                    win.toggleAutocomplete(completer.intrusive);
                });
            }
        });
        setNotices();

        self.setModifiableStylesheet({
            style_hue: options.hue || self.uiOptions.get("style_hue"),
            style_saturation: options.saturation || self.uiOptions.get("style_saturation"),
            style_brightness: options.brightness || self.uiOptions.get("style_brightness")
        });
        return self;
    },

    setModifiableStylesheet: function(vals) {
        this._styleSheet = new Element("style", {
                                type: "text/css",
                                media: "all"
                            }).inject(document.head);
        this.updateStylesheet(vals);
    },
    updateStylesheet: function(values) {//todo calculate all the values and just sub in
        var self = this;
        getTemplate("modifiablecss", function(template) {
            var styles = _.extend({}, Browser, self.uiOptions.toJSON(), values);
            var stylesheet = template(styles);//.split("}").join("}\n")
            var node = self._styleSheet;

            if (node.styleSheet) { /* ie */
                node.styleSheet.cssText = stylesheet;
            } else {
                node.empty()
                    .appendText(stylesheet);
            }
        });
    }
});
(function() {
var favIcons = {};
    document.store("favicon", favIcons);
    document.addEvent("domready", function() {
        var favIcon = $(document.head).getElement("link[rel^='shortcut'][rel$='icon']");
        if (favIcon) {
            favIcons.normal = favIcon;
            favIcons.empty = new Element("link", {
                rel: 'shortcut icon',
                type: 'image/x-icon',
                href: "images/empty_favicon.ico"
            });
        }
    });
// ui.NotificationUI = new Class({
//     Binds: ["beep", "flash", "cancelFlash"],

//     options: {
//         minSoundRepeatInterval: 1000,

//         notificationOptions: {//https://github.com/ttsvetko/HTML5-Desktop-Notifications
//             icon: "images/qwebircsmall.png",
//             title: "IRC Alert",
//             body: "New notification!"
//         },

//         sounds: {
//             sounds: [{
//                 id: "beep",
//                 url: ['beep3.ogg', 'beep3.mp3']
//             }]//files in sounds/
//         }/*,
//         icons: {
//             empty_favicon: "images/empty_favicon.ico"
//         }*/
//     },
//     lastSound: 0,
//     titleText: document.title,

//     initialize: function(options) {
//         this.setOptions(options);
//     },
//     beep: function() {
//         this.playSound('beep');
//     },
//     playSound: function(alias) {
//         if(!this.soundPlayer) {
//             this.soundInit();
//             this.soundPlayer.addEvent("ready", this.playSound.bind(this, alias));
//         }
//         else if (this.soundPlayer.isReady() && (Date.now() - this.lastSound > this.options.sounds.minSoundRepeatInterval)) {
//             this.lastSound = Date.now();
//             this.soundPlayer.play(alias, {
//                 volume: this.uiOptions.get("volume")
//             });
//         }
//     },
//     soundInit: function() {
//         //used to have a bunch of flash checks. going to let the sm handle it
//         if(!(this.soundPlayer instanceof sound.SoundPlayer)) {
//             this.soundPlayer = new sound.SoundPlayer(this.options.sounds);
//         }
//     },

//     flash: function(force) {
//         var self = this;
//         if ((!force && document.hasFocus()) || !favIcons.normal || self.flashing)
//             return;

//         self.titleText = document.title;

//         var flash = function() {
//             var vis = self.toggleFavIcon();
//             ui.setTitle(vis ? self.titleText : lang.activityNotice.message);
//         };

//         self.flashing = true;
//         // flashA();
//         self.__flasher = _.periodical(flash, 750);
//         window.addEvents({//whatever comes first
//             "mousedown:once": self.cancelFlash,
//             "keydown:once": self.cancelFlash,
//             "focus:once": self.cancelFlash
//         });
//     },

//     showNotice: function(options, force) {
//         var self = this;
//         if((force || !document.hasFocus()) && self.uiOptions.get("dn_state")) {
//             var opts = _.extend({/*timeout: self.uiOptions.get("dn_duration")*/}, self.options.notificationOptions, options);
//             self.__notice = notify.createNotification(opts.title, opts);
//             self.__notice.waiter = (function() { self.__notice.close(); self.__notice = null; }).delay(self.uiOptions.get("dn_duration"));
//         }
//     },

//     cancelFlash: function() {
//         this.flashing = false;

//         if(this.__flasher){
//             clearInterval(this.__flasher);
//             this.__flasher = null;
//         }

//         if(this.__notice) {
//             clearTimeout(this.__notice.waiter);
//             this.__notice.close();
//             this.__notice = null;
//         }

//         this.toggleFavIcon(true);
//         ui.setTitle(this.titleText);
//     },
//     //not sure if changing the favicon is a good idea - messes with peoples bookmarks
//     toggleFavIcon: function(state) {
//         var isNormalVis = !!favIcons.normal.getParent();
//         var vis = _.isBoolean(state) ? state : !isNormalVis;
//         if(vis && !isNormalVis) {
//             favIcons.normal.replaces(favIcons.empty);
//         }
//         else if (!vis && isNormalVis) {
//             favIcons.empty.replaces(favIcons.normal);
//         }
//         return vis;
//     }
// });

ui.INotifiers = new Class({
    Implements: [ui.IUIOptions],
    // Binds: ["beep", "flash", "cancelFlash"],
    options: {

        notificationOptions: {//https://github.com/ttsvetko/HTML5-Desktop-Notifications
            icon: "images/qwebircsmall.png",
            title: "IRC Alert",
            body: "New notification!"
        },

        sounds: {
            minSoundRepeatInterval: 1000,
            sounds: [{
                id: "beep",
                url: ['beep3.ogg', 'beep3.mp3']
            }]//files in sounds/
        }
    },
    _notices: [],
    canFlash: false,
    lastSound: 0,
    titleText: document.title,


    beep: function() {
        return this.playSound('beep');
    },
    playSound: function(alias) {
        if(!this.soundPlayer) {
            this.soundInit();
            this.soundPlayer.addEvent("ready:once", this.playSound.bind(this, alias));
        }
        else if (this.soundPlayer.isReady() && (Date.now() - this.lastSound > this.options.sounds.minSoundRepeatInterval)) {
            this.lastSound = Date.now();
            this.soundPlayer.play(alias, {
                volume: this.uiOptions.get("volume")
            });
        }
        return this;
    },
    soundInit: function() {
        //used to have a bunch of flash checks. going to let the sm handle it
        if(!(this.soundPlayer instanceof sound.SoundPlayer)) {
            this.soundPlayer = new sound.SoundPlayer(this.options.sounds);
        }
    },

    flash: function(force) {
        var self = this;
        if ((!force && document.hasFocus()) || !self.canFlash || self.flashing)
            return;

        self.titleText = document.title;

        var flash = function() {
            var vis = self.toggleFavIcon();
            ui.setTitle(vis ? self.titleText : lang.activityNotice);
        };

        self.flashing = true;
        // flashA();
        self.__flasher = _.periodical(flash, 750);
        window.addEvents({//whatever comes first
            "mousedown:once": self.cancelFlash,
            "keydown:once": self.cancelFlash,
            "focus:once": self.cancelFlash
        });
        return self;
    },

    showNotice: function(options, force) {
        var self = this;
        if((force || !document.hasFocus()) && self.uiOptions.get("dn_state")) {
            var opts = _.extend({/*timeout: self.uiOptions.get("dn_duration")*/}, self.options.notificationOptions, options);
            var notice = notify.createNotification(opts.title, opts);
            var timer = _.delay(notice.close, self.uiOptions.get("dn_duration"), notice);
            self._notices.push({
                waiter: timer,
                close: notice.close
            });
        }
        return self;
    },

    cancelFlash: function() {
        this.flashing = false;

        if(this.__flasher){
            clearInterval(this.__flasher);
            this.__flasher = null;
        }

        this._notices.each(function(notice) {
            clearTimeout(notice.waiter);
            notice.close();
        }).empty();

        this.toggleFavIcon(true);
        ui.setTitle(this.titleText);
    },
    //not sure if changing the favicon is a good idea - messes with peoples bookmarks
    toggleFavIcon: function(state) {
        var isNormalVis = !!favIcons.normal.getParent();
        var vis = _.isBoolean(state) ? state : !isNormalVis;
        if(vis && !isNormalVis) {
            favIcons.normal.replaces(favIcons.empty);
        }
        else if (!vis && isNormalVis) {
            favIcons.empty.replaces(favIcons.normal);
        }
        return vis;
    }
});
})();

ui.StandardUI = new Class({
    // Extends: ui.NotificationUI,
    Implements: [Options, ui.IIRCClient, ui.IWindows, ui.ILogin, ui.IUIOptions, ui.INotifiers],
    Binds: ["whoisURL", "updateStylesheet",
            "nextWindow", "prevWindow",
            //custom windows
            "optionsWindow", "faqWindow", "privacyWindow", "aboutWindow", "feedbackWindow", "embeddedWindow"],
    options: {
        routerPrefix: "!"//eg webchat.freenode.net#!login - valid url chars only
    },
    initialize: function(parentElement, theme, uiName, options) {
        var self = this.setOptions(options);

        self.theme = theme;
        self.config();

        self.element = self.parentElement = $(parentElement).addClasses("qwebirc", "qwebirc-" + uiName);
        self.commandhistory = new irc.CommandHistory({
            store: self.uiOptions.get("completer").store
        });
        self.windows[ui.CUSTOM_CLIENT] = this.customWindows;

        getTemplate("topPane", function(template) {
            self.outerTabs = Element.from(template()).inject(parentElement);
        });
        getTemplate("windowsPane", function(template) {
            self.windowsPanel = Element.from(template()).inject(parentElement);
        });

    },

    postInitialize: function() {
        var self = this,
            rprefix = self.options.routerPrefix;

        self.nav = new ui.NavBar({
            element: self.outerTabs,
            menuElement: self.element
        });
        self.nav.on({
            "selectWindow": function(e, target) {
                e.stop();
                target.retrieve('window').select();
            },
            "closeWindow": function(e, target) {
                e.stop();
                target.getParent('.tab').retrieve('window').close();
            },
            "nextWindow": self.nextWindow,
            "prevWindow": self.prevWindow
        });
        
        self.element.addEvent("click:relay(.internal)", function(e, $tar) {
            e.preventDefault();
            self.updateURI($tar.get("href"));
        });

        function checkRoute(data) {
            var request = util.unformatURL(data.request).toLowerCase();
            // console.log("Route: %s Formatted: %s", data.request, request);

            if(self.active && request === self.active.identifier) {
                return;
            }

            switch(request) {
                case "options":
                    self.optionsWindow();
                    break;
                case "privacy":
                    self.privacyWindow();
                    break;
                case "faq":
                    self.faqWindow();
                    break;
                case "about":
                    self.aboutWindow();
                    break;
                case "embedded":
                    self.embeddedWindow();
                    break;
                case "feedback":
                    self.feedbackWindow();
                    break;
                default:
                    var win = _.findWhere(self.windowArray, {identifier:request});
                    if(win) {
                        win.select();
                    } else if(util.isChannel(request)) {
                        _.each(self.clients, function(client) {
                            client.exec("/JOIN " + request);
                        });
                    }
            }
        }

        // hasher.initialized.add(checkRoute); // parse initial hash
        // hasher.changed.add(checkRoute); //parse hash changes
        // hasher.init(); //start listening for history change
        // hasher.prependHash = "~";
        self.router = new Epitome.Router({
            // routes definition will proxy the events
            // routes: {
            //     '': 'index',
            //     '#!options': 'options',
            //     "#!feedback": 'feedback',
            //     "#!about": "about",
            //     "#!faq": "faq",
            //     "#!embedded": 'embedded',
            //     "#!privacy": "privacy"
            // },
            // // no route event was found, though route was defined
            // onError: function(error){
            //     if(DEBUG) console.error(error);
            //     // recover by going default route
            //     this.navigate('');
            // },
            // 'onIndex': function() {
            //     //update options with query string?
            // },
            // 'onOptions': self.optionsWindow,
            // 'onFaq': self.faqWindow,
            // 'onPrivacy': self.privacyWindow,
            // 'onAbout': self.aboutWindow,
            // 'onFeedback': self.feedbackWindow,
            // 'onEmbedded': self.embeddedWindow,
            //try to select the window if it exists
            // onUndefined: function(data) {
            //     var request = util.unformatURL(data.request);
            //     if(request) {
            //         var win = _.findWhere(self.windowArray, {identifier:request});
            //         if(win) {
            //             win.select();
            //         } else if(util.isChannel(request)) {
            //             _.each(self.clients, function(client) {
            //                 client.exec("/JOIN " + request);
            //             });
            //         }
            //     }
            // }
            onUndefined: checkRoute
        });

        return this;
    },

    updateURI: function(url) {
        // hasher.setHash(util.formatURL(url || this.active.identifier));
        if(this.router) this.router.navigate(util.formatURL(url || this.active.identifier));
    },

    whoisURL: function(e, target) {
        var client = target.getParent('.window').retrieve('window').client,
            nick = target.get('data-user');
        /*if (this.uiOptions.get("query_on_nick_click")) {
            client.exec("/QUERY " + nick);
        } else {*/
        client.exec("/WHOIS " + nick);
        //}
    },

    optionsWindow: function() {
        var self = this;
        return self.addCustomWindow("Options", ui.OptionView, "options", {
            model: self.uiOptions,
            onNoticeTest: function() {
                self.flash(true);
                self.beep();
                self.showNotice({}, true);
            },
            getUI: function() {
                return self;
            }
        });
    },
    embeddedWindow: function() {
        return this.addCustomWindow("Add webchat to your site", ui.EmbedWizard, "embedded-wizard");
    },
    aboutWindow: function() {
        return this.addCustomWindow("About", ui.AboutPane, "about");
    },
    privacyWindow: function() {
        return this.addCustomWindow("Privacy policy", ui.PrivacyPolicyPane, "privacypolicy");
    },
    feedbackWindow: function() {
        return this.addCustomWindow("Feedback", ui.FeedbackPane, "feedback");
    },
    faqWindow: function() {
        return this.addCustomWindow("FAQ", ui.FAQPane, "faq");
    }
});


ui.Interface = new Class({
    Implements: [Options, Events],
    options: {
        node: false,//use the node implementation with socket.io
        debug: false,

        appTitle: ""/*Quake Net Web IRC*/,
        networkName: "" /* Quake Net */,
        networkServices: [],//registered hosts to treat as a server admin

        initialNickname: "",
        minRejoinTime: [5, 20, 300], //array - secs between consecutive joins to a single channel - see js/src/irc/ircclient@canjoinchan

        validators: {//test is a helper from ircutils
            nick: [{
                test: test(/^[\s\S]{1,9}$/),//max 9 by spec some servers implement different rules
                description: "Nick must be between 1 and 9 characters"
            }],
            password: [{
                test: function(pass, $ele) {
                    return pass.length > 0 || !$ele.isVisible();
                },
                description: "Missing password"
            }],
            username: [{
                test: function(pass, $ele) {
                    return pass.length > 0 || !$ele.isVisible();
                },
                description: "Missing username"
            }]
        },

        hue: null,
        saturation: null,
        lightness: null,

        theme: undefined,
        uiOptionsArg: null,

        socketio: "//cdnjs.cloudflare.com/ajax/libs/socket.io/0.9.16/socket.io.min.js",

        loginRegex: /I recogni[sz]e you\./
    },
    clients: [],


    //Note removed option args to configure router. May support it later.
    initialize: function(element, UI, options) {
        this.setOptions(options);
        var self = this,
            opts = self.options;

        window.addEvent("domready", function() {
            var settings = self.options.settings = new config.Settings(opts.settings);
            self.element = $(element);

            self.ui = new UI(self.element, new ui.Theme(opts.theme), opts); //unconventional naming scheme

            if(opts.node) { Asset.javascript(opts.socketio); }
            //cleans up old properties
            if(settings.get("newb")) {
                self.welcome();
                settings.set("newb", false);
            }
            self.ui.loginBox();

            self.ui.addEvent("login:once", function(loginopts) {
                var ircopts = _.extend(Object.subset(opts, ['settings', 'specialUserActions', 'minRejoinTime', 'networkServices', 'loginRegex', 'node']),
                                        loginopts);

                var client = self.IRCClient = new irc.IRCClient(ircopts/*, self.ui*/);
                self.ui.newClient(client);
                client.writeMessages(lang.copyright);
                client.connect();
                client.addEvent("auth", function(data) {
                    self.ui.showNotice({
                        title: 'Authenticated with network!',
                        body: util.format("{nick}: {message}", data)
                    }, true);
                });

                window.onbeforeunload = function(e) {
                    if (client.isConnected()) {//ie has gotten passed the IRC gate
                        var message = "This action will close all active IRC connections.";
                        if ((e = e || window.event)) {
                            e.returnValue = message;
                        }
                        return message;
                    }
                };
                window.addEvent('unload', client.quit);
                window.onunload = client.quit;

                if(!auth.enabled) {
                    self.ui.beep();
                }

                self.fireEvent("login", {
                    'IRCClient': client,
                    'parent': self
                });
            });
        });
    },
    welcome: function() {
        ui.WelcomePane.show(this.ui, _.extend({
            element: this.element,
            firstvisit: true
        }, this.options));

        var settings = this.options.settings;
        storage.remove("qweb-new");
        ['account', 'password', 'nickname', 'channels'].each(function(key) {
            var skey = "qweb-" + key;
            var val = storage.get(skey);
            if(val) {
                settings.set(key, val);
            }
            storage.remove(skey);
        });
    }
});


ui.QUI = new Class({
    Extends: ui.StandardUI,
    Binds: ["__createChannelMenu"],
    initialize: function(parentElement, theme, options) {
        this.Window = ui.QUI.Window;
        this.parent(parentElement, theme, "qui", options);

        parentElement.addClasses('qui', 'signed-out')
                    .addEvent("click:relay(.lines .hyperlink-whois)", this.whoisURL);
        this.setHotKeys();
    },
    postInitialize: function() {
        var self = this.parent();
        self.nav.on({
            "selectTab": function(e,tab) {
                self.selectTab(tab);
            },
            "detachWindow": function(e, target) {
                e.stop();
                target.getParent('.tab').retrieve('window').detach();
            },
            "addChannel": self.__createChannelMenu
        });

        return self;
    },

    selectTab: function(tab) {
        var active = this.active;
        var win = tab.retrieve("window");
        var isChannel = util.isChannelType(win.type);
        if(!active || !isChannel || (isChannel && active.name !== BROUHAHA)) {
            win.select();
        }
        if(!util.isBaseWindow(win.name) && isChannel) {//update brouhaha window attrs
            var brouhaha = this.windows.brouhaha;
            brouhaha.currentChannel = win.name;
            brouhaha.window.getElement('.channel-name').text(win.name);
            tab.addClass('selected');
        }
        tab.removeClasses("hilight-activity", "hilight-us", "hilight-speech")
            .getSiblings(".selected:not(.detached,.brouhaha)").removeClass("selected");//remove last selection
    },

    selectWindow: function(win) {
        win = this.parent(win);
        this.selectTab(win.tab);
    },

    newTab: function(win, name) {
        var self = this;
        var isBrouhaha = (name === BROUHAHA);
        var $tab = Element.from(templates.ircTab({
                'name': isBrouhaha ? '&nbsp;' : name,
                closable: !isBaseWindow(name)
            }));
        this.nav.addTab($tab);

        if(isBrouhaha) {
            $tab.addClass('brouhaha');
            _.delay(function() {
                _.some(self.windowArray, function(otherwin) {
                    if(util.isChannelType(otherwin.type) && !util.isBaseWindow(otherwin.name)) {
                        win.properties.text(otherwin.name); //update current channel in brouhaha
                        win.currentChannel = otherwin.name;
                        return true;
                    }
                });
            }, 1000);
        }

        $tab.store("window", win);

        return $tab;
    },

    hotkeys: {
        keyboard: {
            nextWindow: {
                keys: 'right',
                description: '',
                handler: function() {
                    this.scope.nextWindow();
                }
            },
            next: {
                keys: 'tab',
                description: '',
                handler: function() {
                    this.scope.nextWindow();
                }
            },
            prevWindow: {
                keys: 'left',
                description: '',
                handler: function() {
                    this.scope.prevWindow();
                }
            }
        },

        input: {
            bold: {
                keys: 'ctrl+b',
                description: '',
                handler: _.partial(util.wrapSelected, '.window:not(.hidden) .input .irc-input', util.getStyleByName('bold').bbcode)
            },
            italic: {
                keys: 'ctrl+i',
                description: '',
                handler: _.partial(util.wrapSelected, '.window:not(.hidden) .input .irc-input', util.getStyleByName('italic').bbcode)
            },
            underline: {
                keys: 'ctrl+u',
                description: '',
                handler: _.partial(util.wrapSelected, '.window:not(.hidden) .input .irc-input', util.getStyleByName('underline').bbcode)
            },
            colour: {
                keys: 'ctrl+c',
                description: '',
                handler: _.partial(util.wrapSelected, '.window:not(.hidden) .input .irc-input', util.getStyleByName('colour').bbcode)
            },
            submitInput: {
                keys: 'enter',
                description: '',
                handler: function(e) {
                    var $tar = e.target;
                    if($tar.hasClass('irc-input'))  {
                        $tar.getParent('.window').retrieve('window').sendInput(e, $tar);
                    }
                }
            }
        }
    },

    setHotKeys: function () {
        if(Browser.isMobile) return;
        var self = this,
            keyboard = this.keyboard = new Keyboard({active: true}).addShortcuts(self.hotkeys.keyboard),
            inputKeyboard = new Keyboard({active: false}).addShortcuts(self.hotkeys.input);
            keyboard.scope = self;

        function isChar(code) {//http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
            return code === 32 || (code > 46 && !(code >= 91 && code <= 123) && code !== 144 && code !== 145) ;
        }

        document.addEvents({
            "blur:relay(input)": function() {
                keyboard.activate();
            },
            "focus:relay(input)": function() {
                inputKeyboard.activate();
            },
            "keydown": function(e) { // pressing 1 2 3 4 etc will change tab
                if(keyboard.isActive()) {
                    if(e.alt && !isNaN(e.key) && e.key <= self.windowArray.length) {
                        self.selectWindow(e.key - 1);
                    } else if(self.active.$input && !(e.alt||e.control||e.meta) && isChar(e.code) ) {
                        self.active.$input.focus();
                    }
                }
            }
        });
    },

    //todo use other dropdown menu code
    __createChannelMenu: function(e) {
        if(e) e.stop();
        var self = this,
            client = self.getActiveIRCWindow().client,

            $btn = self.outerTabs.getElement('.add-chan'),
            $oldmen = self.parentElement.getElement('.chanmenu.dropdownmenu');
        $oldmen = $oldmen && $oldmen.getParent();

        if(!$oldmen || Date.now() - $btn.retrieve('time') > 60000) {//getting pop channels is expensive dontif unnecc
            client.getPopularChannels(function(chans) {
                chans = _.chain(chans).take(self.options.maxChansMenu || 10)
                            .map(function(chan) {
                                return {
                                    text: chan.channel,
                                    value: chan.channel,
                                    hint: chan.users
                                };
                            })
                            .value();
                var $menu = Element.from(templates.chanmenu({
                        channels: chans
                    }));

                var wrapper = new Element('div').inject(self.parentElement)
                                                .adopt($menu);
                ui.decorateDropdown($btn, wrapper);
                wrapper.addEvent("click:relay(a)", function(e, target) {
                    var chan = target.get('data-value');
                    client.exec("/JOIN " + chan);
                });
                $btn.store('time', Date.now());//so we dont have to refresh maybe
            });
        } else if (!$oldmen.isDisplayed()) { //show old menu
            $oldmen.retrieve("toggle")();
            $oldmen.position({
                    relativeTo: $btn,
                    position: {x: 'left', y: 'bottom'},
                    edge: {x: 'left', y: 'top'}
                });
        }
    },

    newClient: function(client) {
        this.parentElement.swapClass('signed-out','signed-in');
        var status = this.parent(client);
        //load brouhaha window (b4 connecting)
        this.windows.brouhaha = this.newWindow(client, ui.WINDOW.channel, BROUHAHA);
        return status;
    },

    setWindow: function(win) {
        this.parent(win);
        win.element.show().addClass('active')
                    .getSiblings('.active:not(.detached)')
                    .hide().removeClass('active');
    },

    nickChange: function(data, client) {
        if(data.thisclient) {
            _.each(this.getWindows(client), function(win) {
                win.setNickname(data.newnick);
            });
        }
    }
});


ui.NavBar = new Class({
    Extends: Epitome.View,
    Binds: ['adjust'],
    options: {
        template: util.loadTemplate("navbar"),
        events: {
            'click:relay(.tabbar .tab)': 'selectTab',
            'dblclick:relay(.tabbar .tab)': 'selectWindow',
            'click:relay(.tabbar .tab .tab-close)': 'closeWindow',
            'click:relay(.tabbar .tab .detach)': 'detachWindow',
            'adopt:relay(.tabbar)': 'adjust',
            'disown:relay(.tabbar)': 'adjust',
            'mousewheel:relay(.tabbar)': 'scrollTabs',

            'click:relay(.main-menu a)': 'openMenu',
            'click:relay(.buttons .to-left)': 'scrollLeft',
            'click:relay(.buttons .to-right)': 'scrollRight',
            'click:relay(.buttons .add-chan)': 'addChannel'
        },
        onReady: function() {
            this.render();
            window.addEvent('resize', this.adjust);
            this.tabs.addEvent('adopt', this.adjust);
        },
        onScrollTabs: function(evt) {
            evt.stop();
            if (evt.wheel > 0) {//mwup
                this.nextWindow();
            } else if (evt.wheel < 0) {
                this.prevWindow();
            }
        }
    },
    render: function() {
        Elements.from(this.template({lang: lang})).filter(Type.isElement)//strip random text nodes
                                                .inject(this.element);
        this.tabs = this.element.getElement('.tabbar');
        this.scroller = new Fx.Scroll(this.tabs);
        this.adjust();

        var self = this,
            dropdownMenu = Element.from(templates.mainmenu({
                lang: lang
            })).inject(self.options.menuElement);

        var dropdownbtn = this.element.getElement('.main-menu');

        ui.decorateDropdown(dropdownbtn, dropdownMenu, {
            onShow: function() {
                if(self.hideHint)
                    self.hideHint();
                delete self.hideHint;
            },
            btnlistener: true,
            autohide: true
        });

        var dropdownEffect = new Fx.Tween(dropdownbtn, {
            duration: "long",
            property: "opacity",
            link: "chain"
        });
        var dropdownhint = Element.from(templates.dropdownhint())
                    .inject(this.element)
                    .position({
                        relativeTo: this.element,
                        position: {'y': 'bottom'},
                        offset: {y:10}
                    });

        dropdownEffect.start(0.25)
                    .start(1)
                    .start(0.33)
                    .start(1);

        new Fx.Morph(dropdownhint, {
            duration: "normal",
            transition: Fx.Transitions.Sine.easeOut
        }).start({
            left: [900, 5]
        });

        (function() {
            new Fx.Morph(dropdownhint, {
                duration: "long"
            }).start({
                left: [5, -900]
            });
        }).delay(4000);

        var hider2 = _.once(_.partial(Element.destroy, dropdownhint));

        _.delay(hider2, 4000);

        document.addEvents({
            "mousedown:once": hider2,
            "keydown:once": hider2
        });
    },

    adjust: function() {
        var wid = this.tabs.getWidth(),
            swid = this.tabs.getScrollWidth(),
            scrollers = this.element.getElements('[name="tabscroll"]');

        if(swid > wid) {
            scrollers.show();
        }
        else {
            scrollers.hide();
        }

        util.fillContainer(this.tabs, {style: 'max-width'});
    },

    addTab: function(tab) {
        if(_.isString(tab)) tab = Element.from(tab);
        this.tabs.adopt(tab);
        return this;
    },

    removeTab: function(tab) {
        this.tabs.disown(tab);
        return this;
    },

    toggleTab: function(tab, state) {
        this.tabs.getElement(tab).toggle(state);
        return this;
    },

    scrollLeft: function(e, target) {
        e.stop();
        var pos = this.tabs.getScrollLeft(),
            $ele = util.elementAtScrollPos(this.tabs, pos);

        this.scroller.toElement($ele, 'x');
    },
    scrollRight: function(e) {
        e.stop();
        var pos = this.tabs.getScrollLeft() + this.tabs.getWidth(),
            $ele = util.elementAtScrollPos(this.tabs, pos);

        this.scroller.toElementEdge($ele, 'x');
    },
    nextWindow: function() {
        this.trigger('nextWindow');
    },
    prevWindow: function() {
        this.trigger('prevWindow');
    },
    destroy: function() {
        window.removeEvent('resize', this.adjust);
        return this.parent();
    }

});


(function() {
    function checkKeys(fn, keys, type) {//or just use pseudos.keys
        keys = keys || [];
        var ret = {};
        ret[type || "keydown"] = function(e) {
            if(keys.contains(e.key)) {
                fn.apply(this, arguments);
            }
        };
        return ret;
    }

//http://anutron.github.io/mootools-bootstrap/#modals - changed closeOnEsc to closeOnKeys using Element.psuedo.keys
ui.Dialog = new Class({
    Extends: Bootstrap.Popup,
    options: {//mainly defaults
        popup_template: "popup-dialog",
        template: null,
        persist: false,
        closeOnEsc: 'esc',
        closeOnClickOut: false,
        focusOnShow: "input[type='text']",
        inputType: "input[type='text'",
        title: lang.alertNotice
    },
    initialize: function(options) {
        var self = this,
            $par = $(options.parent || document.body),
            $caller = self.$caller;
        options = self.setOptions(options).options;

        getTemplate(options.popup_template, function(popuptmpl) {
            if(options.template) {//expected to be loaded
                options.content = options.template(options);
            }
            var $pop = Element.from(popuptmpl(options));
            $par.adopt($pop);
            self.$caller = $caller;
            self.parent($pop, options);
            self.bound.submit = function() {
                var vals = self.$input.val();
                self.fireEvent("submit", {
                    value: vals[0],
                    values: vals
                });
                self.hide();
            };
            self.$input = $pop.getElements(options.inputType);
            $pop.addEvent("click:relay(.submit)", self.bound.submit);
            var listen = self.$listeners = checkKeys(self.bound.submit, ['enter']);
            document.addEvents(listen);
            ui.Behaviour.apply($pop);
        });
    },
    hide: function(evt, clicked) {
        if(evt) evt.stopPropagation();
        document.removeEvents(this.$listeners);
        return this.parent(evt, clicked);
    }
});

ui.Alert = new Class({
    Extends: Bootstrap.Popup,
    options: {
        popup_template: "popup-alert",
        persist: false,
        closeOnKeys: 'esc,enter',
        closeOnClickOut: true,
        focusOnShow: '[data-dismiss="modal"]',
        title: lang.alertNotice,
        text: ''
    },
    initialize: function(options) {
        var self = this,
            $par = $(options.parent || document.body),
            $caller = self.$caller;//dirty hack for async
        options = self.setOptions(options).options;

        if(!options.text) {
            throw "needs text";
        }

        getTemplate(options.popup_template, function(popuptmpl) {
            var $pop = Element.from(popuptmpl(options));
            $par.adopt($pop);
            self.$caller = $caller;
            self.parent($pop, options);
            var listen = self.$listeners = checkKeys(self.bound.hide, ['enter']);
            document.addEvents(listen);
            ui.Behaviour.apply($pop);
        });
    },
    hide: function(evt, clicked) {
        if(evt) evt.stopPropagation();
        document.removeEvents(this.$listeners);
        this.fireEvent("hide");
        return this.parent(evt, clicked);
    }
});

})();


//http://indiegamr.com/the-state-of-audio-in-html5-games/

sound.SoundPlayer = new Class({
    Implements: [Options, Events],
    options: {
        soundManagersrc: "//cdn.jsdelivr.net/soundmanager2/2.97a.20130512/soundmanager2-nodebug-jsmin.js",
        soundsurl: "/sound/",//directory of sounds for sm
        swfurl: "/swf",
        flashVersion: 8,
        sounds: [],
        preferFlash: false//use html5 if possible
    },
    loadingSM: false,

    initialize: function(options) {
        this.setOptions(options);
        var self = this,
            opts = this.options;

        window.addEvent("domready", function() {//load soundmanager ->
            if (self.loadingSM !== false)
                return;
            self.loadingSM = true;
            if ($defined(self.sm)) {
                self.fireEvent("ready");
                return;
            }

            var soundinit = function() {
                var sm = self.sm = window.soundManager;
                //https://www.scirra.com/blog/44/on-html5-audio-formats-aac-and-ogg
                // var extension = self.extension = sm.hasHTML5 && (Browser.firefox || Browser.opera || Browser.chrome) ? ".ogg" : ".mp3";
                sm.setup({
                    url: opts.swfurl,
                    preferFlash: opts.preferFlash,
                    onready: function() {
                        _.each(opts.sounds, function(sound) {//load all sounds here
                            // self.register(sound.id, opts.soundsurl + sound.url + extension);
                            sound = _.clone(sound);
                            sound.url = _.map(sound.url, function(path) {
                                return path.contains('/') ? path : opts.soundsurl + path;
                            });
                            self.sm.createSound(sound);
                        })
                        self.loadingSM = false;
                        self.fireEvent("ready");
                    }
                }).beginDelayedInit();
                self.play = sm.play;
            };

            //load sound manager
            if(window.soundManager) {
                soundinit();
            }
            else {
                Asset.javascript(opts.soundManagersrc, {onLoad: soundinit});
            }
        });
    },
    register: function(alias,src) {
        this.sm.createSound(alias, src);
    },

    isReady: function() {
        return this.sm && this.loadingSM === false;
    }
});


ui.Theme = new Class({
    initialize: function(themeDict) {
        var self = this,
            defaults = _.extend({}, config.ThemeIRCTemplates, themeDict);
        
        var thememap = _.map(config.ThemeControlCodeMap, function(str) {
            return util.formatSafe(str, config.ThemeControlCodeMap);
        });
        self.__theme = _.map(defaults, function(str) {
            return util.formatSafe(str, thememap);
        });

        self.highlightClasses.channels = {};
    },

    //I'm under the assumption i dont need to strip tags as handlebars should escape them for me
    formatMessage: function($ele, type, _data, highlight) {
        var self = this,
            isobj = _.isObject(_data),
            data = isobj ? _.clone(_data) : _data; //sometimes an internal reference

        if(isobj) {
            if (_.has(data, "n")) {
                //works slightly harder than it has too :/
                data.N = templates.userlink(data);
                data.nicktmpl = templates.ircnick(data);
            }
            //now all we have to do is format the data as desired and pass to theme
            _.each(["m", "c"], function(key) {//urlerize message and nick
                var val = data[key];
                if(val) {
                    if(_.isArray(val)) { //modes are given as an array so we need to fold
                        val = val.join("");
                    }
                    data[key] = self.urlerize(val);
                }
            });
        }


        var themed = type ? self.formatText(type, data, highlight) : data;
        var result = self.colourise(themed);
        var timestamp = templates.timestamp({time:util.IRCTimestamp(new Date())});
        var msghtml = timestamp + result;
        $ele.addClass('colourline')
            .insertAdjacentHTML('beforeend', msghtml);//insertAdjacentHTML may render escaped chars incorrectly
        return result;
    },

    formatElement: function(line, $ele) {
        var result = this.colourise(this.urlerize(line));
        $ele.addClass('colourline')
            .adopt(Elements.from(result));
        return result;
    },

    formatText: function(type, data, highlight) {
        return util.formatter(this.__theme[type], data);//most formatting done on init
    },

    colourise: function(line) {//http://www.mirc.com/colors.html http://www.aviran.org/2011/12/stripremove-irc-client-control-characters/
        //regexs are cruel to parse this thing

        var result = line;

        var styles = irc.styles;

        var parseArr = result.split(styles.colour.key).filter( $chk );

        //crude mapper for matching the start of a colour string to its end token may be possible to do with reduce?
        var colouredarr = [[]]; //will be an array of subarrays for each coloured string

        _.each(parseArr, function(str) {//help
            if( isNaN(str.slice(0, 2).toInt()) ) { //^C...
                colouredarr.push([]);
            } else { //^C1***
                _.last(colouredarr).push(str);
            }
        });

        _.each(colouredarr, function(colourarr) {
            _.each(colourarr, function(str) {
                var colourMatch = str.match(styles.colour.fore_re),
                    backgroundMatch = str.match(styles.colour.back_re),
                    colour = util.getColourByKey(_.item(colourMatch, 0)),
                    background = util.getColourByKey(_.last(backgroundMatch));//num aft num + comma

                var html = templates.ircstyle({
                    'colour': (colour ? colour.fore : ""),
                    'background': (background ? background.back : ""),
                    'text': str.slice(backgroundMatch ? backgroundMatch[0].length : colourMatch ? colourMatch[0].length : 0)
                });


                result = result.replace(styles.colour.key + str, html);
            });
        });

        //matching styles (italics bold under)
        _.each(styles.special, function(style) {//i wish colours were this easy
            result = result.replace(style.keyregex, function(match, text) {
                return templates.ircstyle({
                    'style': style.style,
                    'text': text
                });
            });
        });

        return result;
    },

    urlerize: function(text) {
        return util.urlifier.parse(text);
    },

    messageParsers: [],

    highlightClasses: ['highlight1', 'highlight2'/*, 'highlight3'*/],

    highlightAndNotice: function(data, type, win, $ele) {
        var self = this,
            tabHighlight = ui.HIGHLIGHT.none,
            highlights = self.highlightClasses,
            nick = win.client.nickname,
            notus = data.n !== nick;

        if(data && type && /(NOTICE|ACTION|MSG)$/.test(type)) {
            if(data.m) {
                $ele.addClass('message');
            }
            _.each( self.messageParsers , function(parser) {
                //sorry little crazy :)
                if( (!parser.notus || notus) &&//implications - organized them by complexity
                    (!parser.types || parser.types.contains(win.type)) &&
                    (!parser.type || parser.type.test(type)) &&
                    (!parser.msg || parser.msg.test(data.m)) &&
                    (!parser.nick || parser.nick.test(data.n)) &&
                    (!parser.mentioned || util.testForNick(nick, data.m)) )
                {
                    if((!win.active && win.name !== BROUHAHA) || (!document.hasFocus()) ) {
                        if(parser.flash) {
                            win.parentObject.flash();
                        }
                        if(parser.beep) {
                            win.parentObject.beep();
                        }
                        if(parser.pm) {
                            win.parentObject.showNotice({
                                title: 'IRC ' + type + '!',
                                body: util.format("{nick}({channel}): {message}", data)
                            });
                        }
                    }   
                    if(parser.highlight) {
                        if(!highlights.channels[win.name]) highlights.channels[win.name] = 0;
                        $ele.addClass(_.isBoolean(parser.highlight) ? _.nextItem(highlights, highlights.channels[win.name]++, 1) : parser.highlight);
                    }
                    if($chk(parser.classes)) {
                        $ele.addClass(parser.classes);
                    }
                    tabHighlight = Math.max(tabHighlight, parser.tabhl);
                }
            });
        }
        return tabHighlight;
    }
});


ui.Window = new Class({
    Extends: Epitome.View,
    options: {
        events: {

        },

        onReady: function() {
            this.render();
        },
        maxLines: 1000
    },
    template: util.loadTemplate('window'),

    active: false,
    closed: false,
    highlight: ui.HIGHLIGHT.none,
    lastNickHash: {},

    initialize: function(parentObject, $par, client, type, name, identifier) {
        this.parentObject = parentObject;
        this.type = type;
        this.currentChannel = this.name = name;
        this.client = client;
        this.identifier = identifier;
        this.history = this.parentObject.commandhistory;
        this.parent({
            element: $par
        });
    },

    getOption: function(option) {
        return this.parentObject.uiOptions.get(option);
    },

    close: function() {
        this.closed = true;
        this.parentObject.__closed(this);
        this.destroy();
        return this;
    },

    select: function() {
        if(this.active || this.closed) return;
        this.active = true;
        this.parentObject.selectWindow(this);
        if (this.highlight)
            this.highlightTab(ui.HIGHLIGHT.none);

        this.fireEvent("selected");
    },

    deselect: function() {
        this.active = false;
    },


    /* A data is an object of the form:
    -: current nick
    @: opstatus
    c: channel
    f: origin channel
    h: ip of propogater
    m: msg
    n: nick
    */
    addLine: function(type, data, colour, $ele) {
        var self = this,
            parent = self.parentObject;
        var highlight =  this.name !== BROUHAHA ? parent.theme.highlightAndNotice(data, type, self, $ele) : ui.HIGHLIGHT.none,
            hl_line = false;

        if (!self.active && (highlight !== ui.HIGHLIGHT.none)) {
            self.highlightTab(highlight);
        }

        var formatted = parent.theme.formatMessage($ele, type, data, hl_line);
        self.lines.adopt($ele)
                .maxChildren(this.options.maxLines);//remove lines if > maxLines

        if(self.getOption("lastpos_line") && type.endsWith("CHANMSG")) {
            this.lastLine = (this.lastLine || Element.from(templates.messageLine())).inject(this.lines);
        }
    },
    errorMessage: function(message) {
        this.addLine("", message, "warn");
    },
    infoMessage: function(message) {
        this.addLine("", message, "info");
    },
    highlightTab: function(state) {
        if (state == ui.HIGHLIGHT.none || state >= this.highlight) {
            this.highlight = state;
        }
    },

    sendInput: function(e/*, $tar*/) {
        if(e) e.stop();
        // if(!$tar || !$tar.hasClass('input-field')) {
        var $tar = this.$input;
        //}
        var unparsed = $tar.val(),
            parsed = util.inputParser.parse(unparsed);
        if (parsed !== "") {
            this.history.addLine(this.name, unparsed || parsed);
            this.client.exec(parsed, this.currentChannel);
            $tar.val("");
        }
        $tar.blur();//in case a new channel is created
    }
});


//mae view and qui and controller
ui.QUI.Window = new Class({
    Extends: ui.Window,
    Binds: ['close'],
    options: {
        events: {
            'click:relay(.input .send)': 'sendInput',
            'dblclick:relay(.input .nickname)': 'setNickname',
            'dblclick:relay(.topic)': 'editTopic',

            'contextmenu:relay(.lines .nick)': 'nickLinesMenu',
            'click:relay(.nick-menu li)': 'menuClick',

            'click:relay(.nicklist .user .nick)': 'nickListMenu',

            'click:relay(.detached-window .attach)': 'attach',
            'click:relay(.detached-window .tab-close)': 'close',

            'click': 'setActive'
        }
    },

    detached: false,

    initialize: function(parentObject, $par, client, type, name, identifier) {
        var self = this;
        self.parent.apply(self, arguments);

        self.tab = parentObject.newTab(self, name);

        self.nicksColoured = self.getOption("nick_colours");
    },

    render: function() {
        var self = this;
        var type = self.type;
        var hasInput = util.windowNeedsInput(type);
        self.element.empty()
            .html(self.template({
                mobile: Browser.isMobile,
                isChannel: util.isChannelType(self.type),
                channel: self.name,
                name: self.name,
                id: self.name.clean().replace(" ", "-"),
                topic: false,
                needsInput: hasInput,
                nick: self.client ? self.client.nickname : ""/*,
                splitPane: false//feature in development having issue with resizes {{link to repo}}*/
            }));
        var $win = self.window = self.element.getElement('.window').store("window", self);

        var $content = self.content = $win.getElement('.content');
        var lines = self.lines = $content.getElement('.lines');
        lines.store("window", self);

        if (type === ui.WINDOW.channel) {
            $win.addClass('channel');
            self.toggleNickList();
            self.updateTopic("");
        }

        if(hasInput) {
            $win.addClass('ircwindow');
            self.fxscroll = new Fx.AutoScroll(lines, {
                start: false
            });
            self.$input = $win.getElement('.input .irc-input');
        }
        return self;
    },

    close: function(e) {
        if(e) e.stop();
        if (this.closed) return;

        if (util.isChannelType(this.type) && !util.isBaseWindow(this.name)) {
            this.client.exec("/PART " + this.name);
        }

        if(this.fxscroll)
            this.fxscroll.stop();
        if(this.resizable)
            this.resizable.detach().stop();
        if(this.drag)
            this.drag.detach().stop();
        if(this.completer)
            this.completer.detach();

        return this.parent();
    },

    attach: function(e) {
        this.detached = false;
        this.element.removeClass('detached');

        this.window.replaces(this.wrapper);
        this.wrapper.destroy();

        this.drag.detach().stop();
        this.resizable.detach().stop();
        this.wrapper = this.resizable = this.drag = null;

        this.parentObject.nav.toggleTab(this.tab.removeClass('detached'), true);
        this.select();

        this.fireEvent('attached');
    },

    detach: function(e) {
        var self = this,
            win = self.window,
            po = self.parentObject,

            wrapper = self.wrapper = Element.from(templates.detachedWindow({
                                                    'channel': this.name,
                                                    'base': util.isBaseWindow(this.name)
                                                })),
            header = wrapper.getElement('.header'),

            // resizeWrapper = Element.from(templates.resizeHandle()),
            // resizeHandle = resizeWrapper.getElement('.resize-handle');
            resizeHandle = wrapper.getElement('.resize-handle');
        self.element.addClass('detached');

        var size = util.percentToPixel({x:40, y:60}, win.getParent('qwebirc'));
        wrapper.setStyles({
                "width": size.x,
                "height": size.y
            })
            .replaces(win); //*** adds wrapper to dom;
        win.show()
            .addEvent("mousedown", function(e) {
                var tag = e.target.tagName.toLowerCase();
                if(!(tag == "div" || tag == "form"))//prevent dragging if not on container
                    e.stopPropagation();
            })
            .replaces(wrapper.getElement('.content'));

        self.resizable = wrapper.makeResizable({
                                limit: {//min/max
                                    x: [400, null],
                                    y: [200, null]
                                },
                                handle: resizeHandle,
                                stopPropagation: true
                            });
        self.drag = wrapper.makeDraggable({
                                handle: wrapper,
                                includeMargins: true
                            });

        /*** update windows and center detached window ****/
        if(self.active) po.nextWindow();//change window if we're active
        self.detached = true;
        self.active = false;
        _.defer(function() {
            self.setActive();
            self._selectUpdates();
            wrapper.position();
        });

        //keeps order
        po.nav.toggleTab(self.tab.addClass('detached'), false);
        self.fireEvent('detached');
    },

    setActive: _.throttle(function(e) {//sets this window as the most active
        // if(!this.element.hasClass('active')) {
        this.element.addClass('active')
                .getSiblings('.active').removeClass('active');
        // }
    }, 1000, true),

    select: function() {//change window elements
        if(this.active || this.closed) return;
        this.parent();

        this.tab.addClass("selected");
        this._selectUpdates();
        this.setActive();
        this.fireEvent("selected");
    },


    deselect: function() {
        if(this.active) {
            this.tab.removeClass("selected");
            if(this.fxscroll) this.fxscroll.stop();//save a couple resources
            this.parent();
        }
    },

    //styles and ui things to update
    _selectUpdates: function() {
        var self = this,
            parentObject = self.parentObject;

        if(self.fxscroll) {//scroll to bottom
            self.fxscroll.start();
        }
        if(!self.completer && self.type === ui.WINDOW.channel) {
            self.completer = new Completer(self.window.getElement('.input .tt-ahead'), self.history.get(self.name), {
                autocomplete: self.getOption("completer").intrusive
            });
            self.completer.$hint.addClass('decorated');
            self.$input.removeClass('decorated');
        }

        if(util.isChannelType(self.type)) {
            var colour = self.getOption("nick_colours");
            if (self.nicksColoured !== colour) {
                self.nicksColoured = colour;
                var nodes = self.nicklist.childNodes;
                if (colour) {
                    _.each(nodes, function(node) {
                        var colour = util.toHSBColour(node.get("data-nick"), self.client);
                        if ($defined(colour))
                            node.firstChild.setStyle("color", colour.rgbToHex());
                    });
                } else {
                    _.each(nodes, function(node) {
                        node.firstChild.setStyle("color", null);
                    });
                }
            }
            _.delay(self.updatePrefix, 1000, self);//takes a little while to recieve on some servers
        }

    },

    __dirtyFixes: function() {
        if(this.completer) this.completer.update(); //ugly but necessary to resize the completer hover box
    },

    editTopic: function() {
        var self = this;
        if (!self.client.nickOnChanHasPrefix(self.client.nickname, self.name, OPSTATUS)) {
            new ui.Alert({
                text: lang.changeTopicNeedsOp
            });
        } else {
            new ui.Dialog({
                title: "Set Topic",
                text: util.format(lang.changeTopicConfirm, {channel: self.name}),
                value: self.topic,
                onSubmit: function(data) {
                    var topic = data.val();
                    if (_.isString(topic)) {
                        self.client.exec("/TOPIC " + self.name + " " + topic, self.name);
                    }
                }
            });
        }
    },

    setNickname: function(nick) {
        var self = this;
        if(_.isString(nick)) {
            var $nick = self.window.getElement('.input .user .nickname');
            if($nick) {
                $nick.text(nick);
                self.__dirtyFixes();
            }
        } else {
            new ui.Dialog({
                title: "Set nickname",
                text: "Enter a new nickname",
                value: self.nickname,
                onSubmit: function(data) {
                    var nick = qwebirc.global.nicknameValidator.validate(data.value);
                    if(nick) {
                        self.client.exec("/nick " + nick);
                    }
                }
            });
        }
    },

    updatePrefix: function (data) {
        if(data && (!data.thisclient || data.channel !== this.name)) return;
        var prefix = data ? data.prefix : this.client.getNickStatus(this.name, this.client.nickname);
        this.window.getElements('.input .user .status')
                        .removeClasses('op', 'voice')
                        .addClass((prefix === OPSTATUS) ? "op" : (prefix === VOICESTATUS) ? "voice" : "");
        this.__dirtyFixes();
    },

    createNickMenu: function(nick, $par, options) {
        var $menu = $par.getElement('.nick-menu'),
            self = this;

        if($menu) {
            $menu.toggle();
        } else {
            var _nick = self.client.nickname,
                _chan = self.name
            $menu = Element.from(templates.nickMenu(_.extend({
                nick: nick,
                channel: _chan,
                weOped: self.client.nickOnChanHasAtLeastPrefix(_nick, _chan, OPSTATUS),
                // weVoiced: self.client.nickOnChanHasPrefix(_nick, _chan, VOICESTATUS),
                notus: _nick !== nick,
                theyOped: self.client.nickOnChanHasPrefix(nick, _chan, OPSTATUS),
                theyVoiced: self.client.nickOnChanHasPrefix(nick, _chan, VOICESTATUS),

                lang: lang
            }, options))).inject($par);
            _.defer(function() {
                document.addEvent("click:once", function() {
                    $menu.dispose();
                    if(options.close) options.close();
                });
            });
        }
        return $menu;
    },

    nickLinesMenu: function(evt, $tar) {
        evt.stop();
        var $menu = this.createNickMenu($tar.get("data-user"), this.window, {showNick: true});
        $menu.addClass("dropdownmenu")
            .setPosition(evt.client);
    },

    nickListMenu: function(evt, $tar) { //delegation to nick items
        var $par = $tar.getParent('.user').toggleClass("selected");
        var $menu = this.createNickMenu($par.get('data-user'), $par, {close: function() {$par.removeClass("selected")}});
    },

    menuClick: function(e, $tar) {
        var action = $tar.get("data-exec");
        this.client.exec(action, this.name);
    },

    updateTopic: function(topic) {
        var $topic = this.window.getElement('.topic').empty();
        this.topic = topic;
        if (topic) {
            var $top = Element.from(templates.topicText({empty:false})).inject($topic);
            this.parentObject.theme.formatElement(topic, $top.getElement('span'));
        } else {
            $topic.html(templates.topicText({topic: lang.noTopic, empty:true}));
        }
    },

    addLine: function(type, data, colourClass) {
        var $msg = Element.from(templates.ircMessage({ type: type.hyphenate().replace(" ", "-") }));

        if(colourClass)
            $msg.addClass(colourClass);
        if(data.colourClass)
            $msg.addClass(data.colourClass);

        this.parent(type.toUpperCase(), data, colourClass, $msg);
    },
    highlightTab: function(state) {
        if (state != this.highlight) {
            this.tab.removeClasses("hilight-activity", "hilight-us", "hilight-speech");

            switch (state) {
            case ui.HIGHLIGHT.us:
                this.tab.addClass("hilight-us");
                break;
            case ui.HIGHLIGHT.speech:
                this.tab.addClass("hilight-speech");
                break;
            case ui.HIGHLIGHT.activity:
                this.tab.addClass("hilight-activity");
                break;
            }
            this.parent(state);
        }
    },

    getNickList: function() {
        if(!this.nicklist && this.getOption('show_nicklist')) {
            this.nicklist = this.window.getElement('.rightpanel')
                                    .addClass("nicklist");
        }
        return this.nicklist;
    },

    toggleAutocomplete: function(state) {
        if(this.completer) {
            state = !!state;
            this.completer.toggleAutocomplete(state);

            this.completer.$hint.toggleClass('decorated', state);
            this.$input.toggleClass('decorated', !state);
        }
    },

    toggleNickList: function(state) { //returns this
        if(this.type === ui.WINDOW.channel) {
            state = state != null ? !!state : this.getOption('show_nicklist');
            var nicklist = this.getNickList();
            nicklist && nicklist.toggle(state) && this.window.toggleClass('show-nicklist', state);
        }
    },

    //holy shit i got this to actually make sense
    // takes nicks (sorted array)
    updateNickList: function(nicklist) {
        var self = this;
        if(!self.nicklist) return false;
        var lnh = self.lastNickHash,
            nicks = []; //users who left

        //used to just take the difference and then do an each on that but changes to the array made it nec to do it like this for efficency
        nicklist.each(function(nickobj, index) {
            var nick = nickobj.nick;
            var old = lnh[nick];
            nicks.push(nick);

            if(!old || old.prefix !== nickobj.prefix) {
                lnh[nick] = self.nickListAdd(nickobj, index);
            }
        });

        _.each(_.difference(_.keys(lnh), nicks), function(nick) {
            lnh[nick].element.dispose();
            delete lnh[nick];
        });
    },

    nickListAdd: function(nickobj, position) {
        var nickele = Element.from(templates.nickbtn(nickobj));
        var span = nickele.getElement('span');

        if (this.getOption("nick_colours")) {
            var colour = util.toHSBColour(nickobj.nick, this.client);
            if ($defined(colour))
                span.setStyle("color", colour.rgbToHex());
        }

        this.nicklist.insertAt(nickele, position);

        return _.extend({
            element: nickele
        }, nickobj);
    }
});


(function() {
//class to be inheritted
var PanelView = new Class({
    Extends: Epitome.View,
    options: {
        pane: '',

        events: {
            'click:relay([data-event="close"])': '_close'
        },

        onReady: function() {
            return this.render();
        }
    },

    getData: function() {
        return this.model && this.model.toJSON() || this.options && this.options.data || {};
    },

    render: function() {
        var self = this.empty();
        var pane = self.options.pane;
        var $loader = Element.from(templates.loadingPage()).inject(self.element);

        getTemplate(pane, function(template) {
            var eles = Elements.from(template(self.getData()));
            self.element.adopt(eles);//not inject because it can have text nodes
            $loader.dispose();
            self.postRender();
        });
        return self.parent();
    },

    postRender: function() {
        ui.Behaviour.apply(this.element);
        return this;
    },

    empty: function() {
        return this.parent(true);
    },

    _close: function() {
        this.trigger('close');
        return this.destroy();
    }
});
//this must refer to a model
function toggleNotifications(model, state, save) {
    if(notify.permissionLevel() !== notify.PERMISSION_GRANTED) {
        notify.requestPermission(function() {
            model.set('dn_state', notify.permissionLevel() === notify.PERMISSION_GRANTED);
        });
    }
    else {
        model.set('dn_state', state || !model.get('dn_state'));
    }
    if(save) model.save();
}
ui.PrivacyPolicyPane = new Class({
    Extends: PanelView,
    options: {
        pane: 'privacypolicy'
    }
});
ui.AboutPane = new Class({
    Extends: PanelView,
    options: {
        pane: 'about',
        data: {
            version: qwebirc.VERSION
        }
    }
});
ui.FAQPane = new Class({
    Extends: PanelView,
    options: {
        pane: 'faq'
    }
});
ui.FeedbackPane = new Class({
    Extends: PanelView,
    options: {
        pane: 'feedback'
    }
});

ui.OptionView = new Class({
    Extends: PanelView,
    Binds: ['save', 'reset'],
    options: {
        pane: 'options',
        events: {
            'change:relay(#options input)': 'inputChange',
            'change:relay(#options .notice-group input)': 'noticeChange',
            'click:relay(#options #add-notice)': 'addNotifier',
            'click:relay(#options .remove-notice)': 'removeNotifier',
            'click:relay(#options #dn_state)': 'dnToggle',
            'click:relay(#options #notice-test)': 'noticeTest'
        },
        
        onDnToggle: function(e, target) {
            toggleNotifications(this.model);
            target.val(this.model.get('dn_state') ? lang.DISABLE : lang.ENABLE);
        },

        onReady: function() {
            return this.render();
        }

        //get ui
    },

    /*********LISTENERS**************/

    inputChange: function(e, target) {//set model values when inputs are clicked
        var id = target.get('id');

        //handle sub props
        if(id && $defined(this.model.get(id))) {
            this.model.set(id, target.val());
        }
    },

    addNotifier: function(data) {
        if(!data || Type.isDOMEvent(data)) {
            data = this.model.defaultNotice();
            var n = _.clone(this.model.get("custom_notices"));
            n.push(data);
            this.model.set("custom_notices", n);
        }

        var $addbtn = this.element.getElement('#add-notice'/*'#custom_notices .panel-body'*/);

        var _data = _.clone(data);
        _data.lang = lang;

        var temp = templates.customNotice(_data);

        $addbtn.insertAdjacentHTML('beforebegin', temp);//insert before btn
    },

    removeNotifier: function(e, target) {
        e.stop();
        var type = target.getParent('.notice-group').id;
        var par = target.getParent('.controls').dispose();
        var id = par.get("data-id");
        this.model.set('custom_notices', (_.reject(this.model.get(type), function(xs) {return xs.id === id})));
    },

    noticeChange: function(e, target) {
        e.stop();
        var type = target.getParent('.notice-group').id;
        var notices = _.clone(this.model.get(type));
        var par = target.getParent('.controls');
        var notice = _.findWhere(notices, {id: par.get("data-id")});
        notice[target.get('data-id')] = target.val();
        this.model.set('custom_notices', notices);
    },
    /*********LISTENERS**************/

    postRender: function() {
        var model = this.model,
            options = this.options;

        // _.each(model.get("custom_notices"), function(notice) {
        //     notice.lang = lang;
        //     this.addNotifier(notice);
        // }, this);

        this.element.getElements(".slider").each(function(slider) {
            var id = slider.get('id'),
                knob = slider.getElement('.knob');
                new Slider(slider, knob, {
                    steps: 36,
                    range: [0, 369],
                    wheel: true
                }).addEvent("change", function(val) {
                    model.set(id, val);
                })
                .set(model.get(id));
        });

        this.element.getElement('#options').addEvents({ //default will fire before bubble
            'submit': this.save,
            'reset': this.reset
        });

        if(_.isFunction(options.getUI)) {
            ui.WelcomePane.show(options.getUI(), {
                element: this.element
            });
        }

        return this.parent();
    },

    getData: function() {
        var data = this.model.toJSON();
        // data.lang = lang;
        return data;
    },

    save: function(e) {
        if(e) e.stop();
        this.model.save();
        this.destroy();
    },

    reset: function(e) {
        if(e) e.stop();
        this.model.sync();
        this.destroy();
    },

    destroy: function() {
        this.trigger('close');
        return this.parent();
    }
});
ui.WelcomePane = new Class({
    Extends: PanelView,
    options: {
        pane: 'welcome-pane',
        events: {
            'click:relay(.enable-notifications)': 'enableNotifications',
            'click:relay(.controls)': 'controlClick'
        },
        onEnableNotifications: function() {
            toggleNotifications(this.ui.uiOptions2, true, true);
        },
        onControlClick: function(e, controls) {
            controls.dispose();
            if(!this.element.getElement('.controls')) this._close();
        }
    },
    initialize: function(ui, options) {
        this.ui = ui;
        this.parent(options);
    },
    getData: function() {
        return _.extend({}, this.options, {
            Browser: window.Browser
        });
    }
})
.extend({
    show: function(_ui, options) {//determines if needs to be shown and shows
        if(options.firstvisit || notify.permissionLevel() !== notify.PERMISSION_GRANTED) {
            options.element = new Element("div.welcome").inject(options.element);
            return new ui.WelcomePane(_ui, options);
        }
        return false;
    }
});
ui.EmbedWizard = new Class({
    Extends: PanelView,
    options: {
        pane: 'wizard'
    }
});
})();

//close the iife and call with this
    return qwebirc;
})(Epitome);
