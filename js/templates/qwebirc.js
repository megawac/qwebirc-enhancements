this["qwebirc"] = this["qwebirc"] || {};
this["qwebirc"]["templates"] = this["qwebirc"]["templates"] || {};

this["qwebirc"]["templates"]["modifiablecss"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  buffer += "#ircui {height: 100%;width: 100%;overflow: hidden;font-family: Verdana, sans-serif;}.qui .hidden, .qui .invisible {display: none;}.channel-name {background-color: rgb(255, 255, 191);border: 1px solid #C8D1DB;border-radius: 4px 4px 4px 4px;color: #000000;cursor: default;font-size: 0.8em;padding: 2px;text-decoration: none;white-space: nowrap;float: left;margin: 1px 0px 0px 1px;font-weight: bold;}.qui .widepanel {width: 100%;}.qui .bottompanel {color: red;}.qui .lines {color: black;overflow: auto;font-size: ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.$css || depth0.$css),stack1 ? stack1.call(depth0, "font_size", 12, options) : helperMissing.call(depth0, "$css", "font_size", 12, options)))
    + "px;background: ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.$css || depth0.$css),stack1 ? stack1.call(depth0, "lines_background", "f2f0ff", "c", options) : helperMissing.call(depth0, "$css", "lines_background", "f2f0ff", "c", options)))
    + ";}.qui .lines .timestamp {display: ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.$css || depth0.$css),stack1 ? stack1.call(depth0, "show_timestamps", "inline", "comp", "none", options) : helperMissing.call(depth0, "$css", "show_timestamps", "inline", "comp", "none", options)))
    + ";}.qui .ircwindow .lines {font-family: Consolas, \"Lucida Console\", monospace;text-indent: 10px;padding-left: 1em;word-wrap: break-word;}.qui .lines .highlight1 {background-color: ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.$css || depth0.$css),stack1 ? stack1.call(depth0, "lines_highlight1", "f6ff94", "c", options) : helperMissing.call(depth0, "$css", "lines_highlight1", "f6ff94", "c", options)))
    + ";}.qui .lines .highlight2 {background-color: ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.$css || depth0.$css),stack1 ? stack1.call(depth0, "lines_highlight2", "A4FCCA", "c", options) : helperMissing.call(depth0, "$css", "lines_highlight2", "A4FCCA", "c", options)))
    + ";}.qui .lines .highlight3 {background-color: ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.$css || depth0.$css),stack1 ? stack1.call(depth0, "lines_highlight3", "FAC3D5", "c", options) : helperMissing.call(depth0, "$css", "lines_highlight3", "FAC3D5", "c", options)))
    + ";}.qui .lines .mentioned {background-color: ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.$css || depth0.$css),stack1 ? stack1.call(depth0, "mentioned_colour", "E63772", "c", options) : helperMissing.call(depth0, "$css", "mentioned_colour", "E63772", "c", options)))
    + " !important;}.qui .properties {background-color: ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.$css || depth0.$css),stack1 ? stack1.call(depth0, "menu_background", "f2f0ff", "c", options) : helperMissing.call(depth0, "$css", "menu_background", "f2f0ff", "c", options)))
    + ";border-top: 1px solid ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.$css || depth0.$css),stack1 ? stack1.call(depth0, "menu_border", "c8d2dc", "c", options) : helperMissing.call(depth0, "$css", "menu_border", "c8d2dc", "c", options)))
    + ";height: 25px;}.qui .topic .emptytopic {color: gray;}.qui .topic {color: gray;padding-left: 5px;font-size: 0.7em;cursor: default;background-color: ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.$css || depth0.$css),stack1 ? stack1.call(depth0, "topic_background", "f2f0ff", "c", options) : helperMissing.call(depth0, "$css", "topic_background", "f2f0ff", "c", options)))
    + ";border-bottom: 1px dashed ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.$css || depth0.$css),stack1 ? stack1.call(depth0, "topic_border", "c8d2dc", "c", options) : helperMissing.call(depth0, "$css", "topic_border", "c8d2dc", "c", options)))
    + ";}/*tab stuff*/.qui .outertabbar {border-bottom: 1px solid ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.$css || depth0.$css),stack1 ? stack1.call(depth0, "tabbar_border", "c3cee0", "c", options) : helperMissing.call(depth0, "$css", "tabbar_border", "c3cee0", "c", options)))
    + ";background: ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.$css || depth0.$css),stack1 ? stack1.call(depth0, "tabbar_background", "e2ecf9", "c", options) : helperMissing.call(depth0, "$css", "tabbar_background", "e2ecf9", "c", options)))
    + ";height: 26px;line-height: 20px;padding: 2px 0;}.qui .outertabbar > * {vertical-align: top;}.qui .tabbar {color: ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.$css || depth0.$css),stack1 ? stack1.call(depth0, "tabbar_text", "000000", "c", options) : helperMissing.call(depth0, "$css", "tabbar_text", "000000", "c", options)))
    + ";display: inline-block;overflow-x: hidden;margin-left: 10px;font-size: 13px;height: 22px;}.qui .tabbar .tab {padding: 2px;cursor: default;margin-right: 3px;white-space: nowrap;font-weight: bold;color: ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.$css || depth0.$css),stack1 ? stack1.call(depth0, "tab_text", "000000", "c", options) : helperMissing.call(depth0, "$css", "tab_text", "000000", "c", options)))
    + ";border: 1px solid ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.$css || depth0.$css),stack1 ? stack1.call(depth0, "tab_border", "c8d2dc", "c", options) : helperMissing.call(depth0, "$css", "tab_border", "c8d2dc", "c", options)))
    + ";border-radius: 4px;-moz-border-radius: 4px;-webkit-border-radius: 4px;}.qui .tabbar .tab:hover {background: ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.$css || depth0.$css),stack1 ? stack1.call(depth0, "tab_hover", "ffffff", "c", options) : helperMissing.call(depth0, "$css", "tab_hover", "ffffff", "c", options)))
    + ";border: 1px solid #c8d2dc;-moz-border-radius: 4px;-webkit-border-radius: 4px;}.qui .tabbar .hilight-activity.tab {color: #009900;}.qui .tabbar .hilight-speech.tab {color: #0000ff;}.qui .tabbar .hilight-us.tab {color: #ff0000;background: rgb(216, 216, 138);}.qui .tabbar .brouhaha {padding-left: 75px;background-image: -moz-linear-gradient(45deg, #666 25%, transparent 25%),-moz-linear-gradient(-45deg, #666 25%, transparent 25%),-moz-linear-gradient(45deg, transparent 75%, #666 75%),-moz-linear-gradient(-45deg, transparent 75%, #666 75%);background-image: -webkit-gradient(linear, 0 100%, 100% 0, color-stop(.25, #666), color-stop(.25, transparent)),-webkit-gradient(linear, 0 0, 100% 100%, color-stop(.25, #666), color-stop(.25, transparent)),-webkit-gradient(linear, 0 100%, 100% 0, color-stop(.75, transparent), color-stop(.75, #666)),-webkit-gradient(linear, 0 0, 100% 100%, color-stop(.75, transparent), color-stop(.75, #666));background-image: -webkit-linear-gradient(45deg, #666 25%, transparent 25%),-webkit-linear-gradient(-45deg, #666 25%, transparent 25%),-webkit-linear-gradient(45deg, transparent 75%, #666 75%),-webkit-linear-gradient(-45deg, transparent 75%, #666 75%);background-image: -o-linear-gradient(45deg, #666 25%, transparent 25%),-o-linear-gradient(-45deg, #666 25%, transparent 25%),-o-linear-gradient(45deg, transparent 75%, #666 75%),-o-linear-gradient(-45deg, transparent 75%, #666 75%);background-image: linear-gradient(45deg, #666 25%, transparent 25%),linear-gradient(-45deg, #666 25%, transparent 25%),linear-gradient(45deg, transparent 75%, #666 75%),linear-gradient(-45deg, transparent 75%, #666 75%);-moz-background-size: 2px 2px;background-size: 2px 2px;-webkit-background-size: 2px 2.1px; /* override value for webkit */background-position: 0 0, 1px 0, 1px -1px, 0px 1px;}.qui .tabbar .brouhaha.selected {/* background: rgb(255,214,94); Old browsersbackground: -moz-radial-gradient(center, ellipse cover,  rgba(255,214,94,1) 0%, rgba(254,191,4,1) 100%); FF3.6+background: -webkit-gradient(radial, center center, 0px, center center, 100%, color-stop(0%,rgba(255,214,94,1)), color-stop(100%,rgba(254,191,4,1))); Chrome,Safari4+background: -webkit-radial-gradient(center, ellipse cover,  rgba(255,214,94,1) 0%,rgba(254,191,4,1) 100%); Chrome10+,Safari5.1+background: -o-radial-gradient(center, ellipse cover,  rgba(255,214,94,1) 0%,rgba(254,191,4,1) 100%); Opera 12+background: -ms-radial-gradient(center, ellipse cover,  rgba(255,214,94,1) 0%,rgba(254,191,4,1) 100%); IE10+background: radial-gradient(ellipse at center,  rgba(255,214,94,1) 0%,rgba(254,191,4,1) 100%); W3Cfilter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#ffd65e', endColorstr='#febf04',GradientType=1 ); IE6-9 fallback on horizontal gradient */}.qui .tabbar .brouhaha.unselected {/* background-image: -moz-linear-gradient(45deg, #666 25%, transparent 25%),-moz-linear-gradient(-45deg, #666 25%, transparent 25%),-moz-linear-gradient(45deg, transparent 75%, #666 75%),-moz-linear-gradient(-45deg, transparent 75%, #666 75%);background-image: -webkit-gradient(linear, 0 100%, 100% 0, color-stop(.25, #666), color-stop(.25, transparent)),-webkit-gradient(linear, 0 0, 100% 100%, color-stop(.25, #666), color-stop(.25, transparent)),-webkit-gradient(linear, 0 100%, 100% 0, color-stop(.75, transparent), color-stop(.75, #666)),-webkit-gradient(linear, 0 0, 100% 100%, color-stop(.75, transparent), color-stop(.75, #666));background-image: -webkit-linear-gradient(45deg, #666 25%, transparent 25%),-webkit-linear-gradient(-45deg, #666 25%, transparent 25%),-webkit-linear-gradient(45deg, transparent 75%, #666 75%),-webkit-linear-gradient(-45deg, transparent 75%, #666 75%);background-image: -o-linear-gradient(45deg, #666 25%, transparent 25%),-o-linear-gradient(-45deg, #666 25%, transparent 25%),-o-linear-gradient(45deg, transparent 75%, #666 75%),-o-linear-gradient(-45deg, transparent 75%, #666 75%);background-image: linear-gradient(45deg, #666 25%, transparent 25%),linear-gradient(-45deg, #666 25%, transparent 25%),linear-gradient(45deg, transparent 75%, #666 75%),linear-gradient(-45deg, transparent 75%, #666 75%);-moz-background-size: 2px 2px;background-size: 2px 2px;-webkit-background-size: 2px 2.1px; override value for webkitbackground-position: 0 0, 1px 0, 1px -1px, 0px 1px; */}.qui .tabbar .selected.tab {background: ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.$css || depth0.$css),stack1 ? stack1.call(depth0, "tab_selected", "ffffff", "c", options) : helperMissing.call(depth0, "$css", "tab_selected", "ffffff", "c", options)))
    + ";border: 1px solid ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.$css || depth0.$css),stack1 ? stack1.call(depth0, "tab_selected_border", "c8d2dc", "c", options) : helperMissing.call(depth0, "$css", "tab_selected_border", "c8d2dc", "c", options)))
    + ";-moz-border-radius: 4px;-webkit-border-radius: 4px;color: ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.$css || depth0.$css),stack1 ? stack1.call(depth0, "tab_selected_text", "333333", "c", options) : helperMissing.call(depth0, "$css", "tab_selected_text", "333333", "c", options)))
    + ";}.qui .buttons {display: none;}.qui.signed-in .buttons {display: inline-block;cursor: pointer;}.buttons span {vertical-align: middle;display: inline-block;}/* tab stuff *//*irc input stuff*/.qui form.input {background-color: ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.$css || depth0.$css),stack1 ? stack1.call(depth0, "menu_background", "f2f0ff", "c", options) : helperMissing.call(depth0, "$css", "menu_background", "f2f0ff", "c", options)))
    + ";margin: 0;}.qui .input div {border-top: 1px solid ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.$css || depth0.$css),stack1 ? stack1.call(depth0, "input_border", "c3cee0", "c", options) : helperMissing.call(depth0, "$css", "input_border", "c3cee0", "c", options)))
    + ";padding: 0 5px 1px;margin: 0;width: 100%;}.qui .input div > .input-group-addon {cursor:pointer;cursor:hand;padding: 2px 5px;}.qui .input div > * {height: 24px;}.qui .input .nickname {color: #524F50;font-size: 14px;}.qui .input .nickname .status {border-radius: 50%;display: inline-block;margin-right: 3px;}.qui .input .nickname:hover {}.qui .input .nickname .status.voice {width: 8px;height: 8px;background-color: rgb(223, 187, 47);background-image: radial-gradient(45px 45px 45deg, circle, yellow 0%, orange 100%, red 95%);background-image: -moz-radial-gradient(45px 45px 45deg, circle, yellow 0%, orange 100%, red 95%);background-image: -o-radial-gradient(45px 45px 45deg, circle, yellow 0%, orange 100%, red 95%);background-image: -webkit-radial-gradient(45px 45px, circle, yellow, orange);animation-name: spin;animation-duration: 3s;animation-iteration-count: infinite;animation-timing-function: linear;-webkit-animation-name: spin;-webkit-animation-duration: 3s;-webkit-animation-iteration-count: infinite;-webkit-animation-timing-function: linear;-moz-animation-name: spin;-moz-animation-duration: 3s;-moz-animation-iteration-count: infinite;-moz-animation-timing-function: linear;-o-animation-name: spin;-o-animation-duration: 3s;-o-animation-iteration-count: infinite;-o-animation-timing-function: linear;}.qui .input .nickname .status.op {width: 8px;height: 8px;background-color: #7AE60E;background-image: radial-gradient(45px 45px 45deg, circle, #5FFF4A 3%, #7AE60E 76%);background-image: -moz-radial-gradient(45px 45px 45deg, circle, #5FFF4A 3%, #7AE60E 76%);background-image: -o-radial-gradient(45px 45px, circle, #5FFF4A 3%, #7AE60E 76%);background-image: -webkit-radial-gradient(45px 45px, circle, #5FFF4A 3%, #7AE60E 76%);animation-name: spin;animation-duration: 3s;animation-iteration-count: infinite;animation-timing-function: linear;-webkit-animation-name: spin;-webkit-animation-duration: 3s;-webkit-animation-iteration-count: infinite;-webkit-animation-timing-function: linear;-moz-animation-name: spin;-moz-animation-duration: 3s;-moz-animation-iteration-count: infinite;-moz-animation-timing-function: linear;-o-animation-name: spin;-o-animation-duration: 3s;-o-animation-iteration-count: infinite;-o-animation-timing-function: linear;}.qui .input .input-field {border: 1px solid ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.$css || depth0.$css),stack1 ? stack1.call(depth0, "input_border", "c3cee0", "c", options) : helperMissing.call(depth0, "$css", "input_border", "c3cee0", "c", options)))
    + ";padding: 0;height: 26px;text-indent: 5px;}.qui .input .tt-hint {background-image: linear-gradient(bottom, rgb(235,235,232) 54%, rgb(247,250,240) 66%);background-image: -o-linear-gradient(bottom, rgb(235,235,232) 54%, rgb(247,250,240) 66%);background-image: -moz-linear-gradient(bottom, rgb(235,235,232) 54%, rgb(247,250,240) 66%);background-image: -webkit-linear-gradient(bottom, rgb(235,235,232) 54%, rgb(247,250,240) 66%);background-image: -ms-linear-gradient(bottom, rgb(235,235,232) 54%, rgb(247,250,240) 66%);background-image: -webkit-gradient(linear,left bottom,left top,color-stop(0.54, rgb(235,235,232)),color-stop(0.66, rgb(247,250,240)));padding: 0;height: 26px;text-indent: 5px;}/*twitter typeahead inspired autocomplete using overlay input box*/.qui .tt-hint {position: absolute;top: 0px;left: 0px;border-color: transparent;box-shadow: none;color: #BDBDBD;}.qui .tt-query {position: relative;vertical-align: top;background-color: transparent;}/*typeahead*/.qui .input .btn.send {color: grey;padding: 2px 10px;}.qui .nicklist {border-left: 1px solid ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.$css || depth0.$css),stack1 ? stack1.call(depth0, "nicklist_border", "c8d2dc", "c", options) : helperMissing.call(depth0, "$css", "nicklist_border", "c8d2dc", "c", options)))
    + ";width: 140px;overflow: auto;background: ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.$css || depth0.$css),stack1 ? stack1.call(depth0, "nicklist_background", "f2f0ff", "c", options) : helperMissing.call(depth0, "$css", "nicklist_background", "f2f0ff", "c", options)))
    + ";color: ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.$css || depth0.$css),stack1 ? stack1.call(depth0, "nicklist_text", "000000", "c", options) : helperMissing.call(depth0, "$css", "nicklist_text", "000000", "c", options)))
    + ";font-size: 0.7em;}.qui .nicklist .user, .qui .nicklist .menu span {display: block;color: black;text-decoration: none;cursor: default;border-top: 1px solid ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.$css || depth0.$css),stack1 ? stack1.call(depth0, "nicklist_background", "f2f0ff", "c", options) : helperMissing.call(depth0, "$css", "nicklist_background", "f2f0ff", "c", options)))
    + ";border-bottom: 1px solid ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.$css || depth0.$css),stack1 ? stack1.call(depth0, "nicklist_background", "f2f0ff", "c", options) : helperMissing.call(depth0, "$css", "nicklist_background", "f2f0ff", "c", options)))
    + ";padding-left: 1px;}.qui .nicklist .selected {display: block;color: black;background: white;text-decoration: none;border-bottom: ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.$css || depth0.$css),stack1 ? stack1.call(depth0, "nicklist_selected_border", "c8d2dc", "c", options) : helperMissing.call(depth0, "$css", "nicklist_selected_border", "c8d2dc", "c", options)))
    + " 1px solid;cursor: default;}.qui .nicklist .selected-middle {border-top: ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.$css || depth0.$css),stack1 ? stack1.call(depth0, "nicklist_selected_border", "c8d2dc", "c", options) : helperMissing.call(depth0, "$css", "nicklist_selected_border", "c8d2dc", "c", options)))
    + " 1px solid;}#noscript {text-align: center;font-weight: bold;}.qui .nicklist .menu {margin: 0 0 0 5px;}.qui .nicklist .menu a {border-bottom: 0;border-top: 0;}.hyperlink-whois, .hyperlink-channel {cursor: pointer;cursor: hand;}.hyperlink-whois:hover, .hyperlink-channel:hover {text-decoration: underline;}.qui .outertabbar .dropdown-tab {cursor: pointer; cursor: hand;display: inline-block;padding-left: 4px;width: 30px;}.qui .dropdownmenu {z-index: 100;border: 1px solid ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.$css || depth0.$css),stack1 ? stack1.call(depth0, "menu_border", "c8d2dc", "c", options) : helperMissing.call(depth0, "$css", "menu_border", "c8d2dc", "c", options)))
    + ";background: ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.$css || depth0.$css),stack1 ? stack1.call(depth0, "menu_background", "f2f0ff", "c", options) : helperMissing.call(depth0, "$css", "menu_background", "f2f0ff", "c", options)))
    + ";list-style: none;padding: 5px 10px;font-size: 0.7em;}.qui .dropdownmenu a {color: black;cursor: pointer;cursor: hand;padding-top: 3px;}.qui .dropdownmenu a:hover {background: ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.$css || depth0.$css),stack1 ? stack1.call(depth0, "menu_hover_background", "FFFE", "c", options) : helperMissing.call(depth0, "$css", "menu_hover_background", "FFFE", "c", options)))
    + ";}.qui .dropdownhint {position: relative;left: -500px;z-index: 10;white-space: nowrap;font-size: 0.7em;}.qui .chanmenu {width: 150px;}.qui .chanmenu .hint {float: right;font-size: 75%;color: grey;}.qui hr.lastpos {border: none;border-top: 1px solid ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.$css || depth0.$css),stack1 ? stack1.call(depth0, "lastpositionbar", "C8D2DC", "c", options) : helperMissing.call(depth0, "$css", "lastpositionbar", "C8D2DC", "c", options)))
    + ";margin: .5em 3em;}.qwebirc-init-channels {font-size: 95%;color: #928D8D;text-align: center;}";
  return buffer;
  });

this["qwebirc"]["templates"]["authpage"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  
  return "hidden";
  }

  buffer += "<div class=\"container center\"><form id=\"login\"><h2>Connect to ";
  if (stack1 = helpers.network) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.network; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " IRC</h2><div class=\"nick right\"><label class=\"control-label\" for=\"nickname\">Nickname:<input type=\"text\" name=\"basic\" id=\"nickname\" value=\"";
  if (stack1 = helpers.nickname) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.nickname; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" placeholder=\"Nickname\" /></label></div><div class=\"username right ";
  stack1 = helpers.unless.call(depth0, depth0.full, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\"><label class=\"control-label\" for=\"username\">";
  if (stack1 = helpers.network) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.network; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " username:<input type=\"text\" name=\"full\" id=\"username\" value=\"";
  if (stack1 = helpers.username) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.username; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" placeholder=\"";
  if (stack1 = helpers.network) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.network; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " username\"></label></div><div class=\"password right ";
  stack1 = helpers.unless.call(depth0, depth0.full, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\"><label class=\"control-label\" for=\"password\">Password:<input type=\"password\" name=\"full\" id=\"password\" value=\"";
  if (stack1 = helpers.password) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.password; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\"></label></div><div class=\"authenticate\"><label for=\"authenticate\">Authenticate (optional)<input type=\"checkbox\" id=\"authenticate\" ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.check || depth0.check),stack1 ? stack1.call(depth0, depth0.full, options) : helperMissing.call(depth0, "check", depth0.full, options)))
    + "></label for=\"authenticate\"></div><div><input type=\"submit\" value=\"Connect\" class=\"btn btn-primary btn-smaller\" /></div></form><div class=\"qwebirc-init-channels\"><span>";
  if (stack2 = helpers.channels) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.channels; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
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
  var buffer = "", stack1, functionType="function";


  buffer += "<div class='channel-name'>";
  if (stack1 = helpers.channel) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.channel; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</div>";
  return buffer;
  });

this["qwebirc"]["templates"]["channellink"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<span class='hyperlink-channel' data-chan='";
  if (stack1 = helpers.channel) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.channel; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "'>";
  if (stack1 = helpers.channel) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.channel; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>";
  return buffer;
  });

this["qwebirc"]["templates"]["customNotice"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;


  buffer += "<div class=\"controls custom-notice\" id=";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "><label class=\"control-inline\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.USER_NOTICE)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "<input type=\"text\" data-id=\"nick\" placeholder=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.NICK_PLACEHOLDER)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" value=\"";
  if (stack2 = helpers.nick) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.nick; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\"></label><label class=\"control-inline\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.MESSAGE_NOTICE)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "<input type=\"text\" data-id=\"msg\" placeholder=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.MESSAGE_PLACEHOLDER)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" value=\"";
  if (stack2 = helpers.msg) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.msg; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\"></label><label class=\"checkbox-inline\" >"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.BEEP)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "<input type=\"checkbox\" data-id=\"beep\" ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.check || depth0.check),stack1 ? stack1.call(depth0, depth0.beep, options) : helperMissing.call(depth0, "check", depth0.beep, options)))
    + "></label><label class=\"checkbox-inline\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.FLASH)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "<input type=\"checkbox\" data-id=\"flash\" ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.check || depth0.check),stack1 ? stack1.call(depth0, depth0.flash, options) : helperMissing.call(depth0, "check", depth0.flash, options)))
    + "></label><!-- <label class=\"checkbox-inline\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.HIGHLIGHT)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "<input type=\"checkbox\" data-id=\"highlight\" ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.check || depth0.check),stack1 ? stack1.call(depth0, depth0.highlight, options) : helperMissing.call(depth0, "check", depth0.highlight, options)))
    + "></label><label class=\"checkbox-inline\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.MENTIONED)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "<input type=\"checkbox\" data-id=\"mentioned\" ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.check || depth0.check),stack1 ? stack1.call(depth0, depth0.mentioned, options) : helperMissing.call(depth0, "check", depth0.mentioned, options)))
    + "></label> --><label class=\"checkbox-inline\" title=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.ESCAPE_HINT)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.AUTOESCAPE)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "<input type=\"checkbox\" data-id=\"autoescape\" ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.check || depth0.check),stack1 ? stack1.call(depth0, depth0.autoescape, options) : helperMissing.call(depth0, "check", depth0.autoescape, options)))
    + "></label><input type=\"button\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.DELETE_NOTICE)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" class=\"remove-notice btn btn-danger btn-smaller\"></div>";
  return buffer;
  });

this["qwebirc"]["templates"]["detachedWindow"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); partials = this.merge(partials, Handlebars.partials); data = data || {};
  var buffer = "", stack1, self=this, functionType="function", escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  var stack1;
  stack1 = self.invokePartial(partials.tabClose, 'tabClose', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  }

  buffer += "<div class='detached-window'><div class='header'><span class='title'>";
  if (stack1 = helpers.channel) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.channel; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>";
  stack1 = helpers.unless.call(depth0, depth0.base, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  stack1 = self.invokePartial(partials.tabAttach, 'tabAttach', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</div><div class=\"content\"></div><div><span class=\"resize-handle ui-icon ui-icon-grip-diagonal-se\"></span></div></div>";
  return buffer;
  });

this["qwebirc"]["templates"]["ircInput"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class='input'><div class='tt-ahead input-group'><span class='input-group-addon nickname'><span class='status ";
  if (stack1 = helpers.status) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.status; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "'></span>";
  if (stack1 = helpers.nick) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.nick; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>"
    + "<input class='tt-hint' type='text' autocomplete='off' spellcheck='off' disabled><input class='tt-query input-field form-control' type='text' autocomplete='off' spellcheck='off'><span class='input-group-btn'><button class='btn btn-default send' type='button'>&gt;</button></span></div></div>";
  return buffer;
  });

this["qwebirc"]["templates"]["ircMessage"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"";
  if (stack1 = helpers.type) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.type; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\"></div>";
  return buffer;
  });

this["qwebirc"]["templates"]["ircTab"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); partials = this.merge(partials, Handlebars.partials); data = data || {};
  var buffer = "", stack1, self=this, functionType="function";

function program1(depth0,data) {
  
  var stack1;
  stack1 = self.invokePartial(partials.tabClose, 'tabClose', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  }

  buffer += "<span class='tab'>";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "&nbsp;";
  stack1 = self.invokePartial(partials.tabDetach, 'tabDetach', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  stack1 = helpers['if'].call(depth0, depth0.closable, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</span>";
  return buffer;
  });

this["qwebirc"]["templates"]["ircstyle"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<span class=\"";
  if (stack1 = helpers.background) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.background; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " ";
  if (stack1 = helpers.colour) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.colour; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " ";
  if (stack1 = helpers.style) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.style; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (stack1 = helpers.text) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.text; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</span>";
  return buffer;
  });

this["qwebirc"]["templates"]["mainmenu"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"hidden\"><ul class=\"main-menu dropdownmenu\"><a href=\"#!options\"><li><span>Options</span></li></a><a href=\"#!embedded\"><li><span>Add webchat to your site</span></li></a><a href=\"#!privacy\"><li><span>Privacy policy</span></li></a><a href=\"#!faq\"><li><span>Frequently asked questions</span></li></a><a href=\"#!feedback\"><li><span>Submit feedback</span></li></a><a href=\"#!about\"><li><span>About qwebirc</span></li></a></ul></div>";
  });

this["qwebirc"]["templates"]["menubtn"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class='dropdown-tab'><img src='";
  if (stack1 = helpers.icon) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.icon; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "' title='menu' alt='menu'></div>";
  return buffer;
  });

this["qwebirc"]["templates"]["menuitem"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += " data-value='";
  if (stack1 = helpers.value) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.value; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "'";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "<span class='hint'>";
  if (stack1 = helpers.hint) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.hint; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>";
  return buffer;
  }

  buffer += "<a";
  stack1 = helpers['if'].call(depth0, depth0.value, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "><li><span>";
  if (stack1 = helpers.text) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.text; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>";
  stack1 = helpers['if'].call(depth0, depth0.hint, {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</li></a>";
  return buffer;
  });

this["qwebirc"]["templates"]["message"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class='message ";
  if (stack1 = helpers['class']) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0['class']; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "'><span>";
  if (stack1 = helpers.message) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.message; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span></div>";
  return buffer;
  });

this["qwebirc"]["templates"]["navbar"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"main-menu dropdown-tab\"><img src=\"images/icon.png\" title=\"menu\" alt=\"menu\"></div><div class=\"tabbar\"></div><div class=\"buttons\"><span class=\"to-left ui-icon ui-icon-circle-triangle-w hidden\" name=\"tabscroll\"></span><span class=\"to-right ui-icon ui-icon-circle-triangle-e hidden\" name=\"tabscroll\"></span><span class=\"add-chan ui-icon ui-icon-circle-plus\" title=\"Join a channel\"></span></div>";
  });

this["qwebirc"]["templates"]["nickbtn"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class='user'><span class='nick'>";
  if (stack1 = helpers.nick) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.nick; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span></div>";
  return buffer;
  });

this["qwebirc"]["templates"]["nickmenubtn"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<span>- ";
  if (stack1 = helpers.text) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.text; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>";
  return buffer;
  });

this["qwebirc"]["templates"]["qweblink"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<span class='hyperlink-page' data-page='";
  if (stack1 = helpers.page) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.page; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "'>";
  if (stack1 = helpers.page) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.page; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>";
  return buffer;
  });

this["qwebirc"]["templates"]["spanURL"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<span class='hyperlink-channel'>";
  if (stack1 = helpers.message) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.message; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>";
  return buffer;
  });

this["qwebirc"]["templates"]["timestamp"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<span class='timestamp'>";
  if (stack1 = helpers.time) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.time; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
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
  buffer += "' title=\"";
  if (stack1 = helpers.topic) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.topic; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">[<span>";
  if (stack1 = helpers.topic) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.topic; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>]</span>";
  return buffer;
  });

this["qwebirc"]["templates"]["userlink"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function";


  buffer += "<span class='hyperlink-whois' data-user='";
  if (stack1 = helpers.userid) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.userid; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "'>";
  if (stack1 = helpers.username) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.username; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</span>";
  return buffer;
  });

this["qwebirc"]["templates"]["window"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); partials = this.merge(partials, Handlebars.partials); data = data || {};
  var buffer = "", stack1, self=this, functionType="function", escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  var stack1;
  stack1 = self.invokePartial(partials.topicBar, 'topicBar', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  stack1 = self.invokePartial(partials.verticalDivider, 'verticalDivider', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "<div class=\"qui rightpanel\"></div>";
  return buffer;
  }

function program5(depth0,data) {
  
  var stack1;
  stack1 = self.invokePartial(partials.ircInput, 'ircInput', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  }

  buffer += "<div class=\"window qui\" data-id=\"";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" data-name=\"";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">";
  stack1 = helpers['if'].call(depth0, depth0.isChannel, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "<div class=\"qui content\"><div class=\"qui leftpanel lines\"></div>";
  stack1 = helpers['if'].call(depth0, depth0.isChannel, {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</div><div class=\"qui properties\">";
  stack1 = self.invokePartial(partials.channelName, 'channelName', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</div><div class=\"qui bottompanel\">";
  stack1 = helpers['if'].call(depth0, depth0.needsInput, {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</div></div>";
  return buffer;
  });