this["qwebirc"] = this["qwebirc"] || {};
this["qwebirc"]["templates"] = this["qwebirc"]["templates"] || {};

this["qwebirc"]["templates"]["options"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); partials = this.merge(partials, Handlebars.partials); data = data || {};
  var buffer = "", stack1, stack2, self=this, escapeExpression=this.escapeExpression, functionType="function";

function program1(depth0,data) {
  
  var stack1;
  stack1 = self.invokePartial(partials.customNotice, 'customNotice', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  }

  buffer += "<form id=\"options\" class=\"form-horizontal\"><ul class=\"option-tabs tabs nav nav-tabs\" data-behavior=\"BS.Tabs\"><li class=\"ui-options\"><a href=\"#\">Interface</a></li><li class=\"irc-options\"><a href=\"#\">Chat Preferences</a></li><li class=\"alert-options\"><a href=\"#\">Notifications</a></li><li class=\"hotkeys disabled\"><a href=\"#\">Hot Keys(TODO)</a></li></ul><div class=\"tab-content\"><div class=\"ui-options control-group well active\"><div class=\"controls\"><label class=\"checkbox\" for=\"auto_open_pm\">"
    + escapeExpression(helpers.lang.call(depth0, "AUTO_OPEN_PM", {hash:{},data:data}))
    + "<input type=\"checkbox\" id=\"auto_open_pm\" "
    + escapeExpression(helpers.check.call(depth0, depth0.auto_open_pm, {hash:{},data:data}))
    + "></label></div><div class=\"controls\"><label class=\"checkbox\" for=\"nick_colours\">"
    + escapeExpression(helpers.lang.call(depth0, "NICK_COLOURS", {hash:{},data:data}))
    + "<input type=\"checkbox\" id=\"nick_colours\" "
    + escapeExpression(helpers.check.call(depth0, depth0.nick_colours, {hash:{},data:data}))
    + "></label></div><div class=\"controls\"><label class=\"checkbox\" for=\"nick_ov_status\">"
    + escapeExpression(helpers.lang.call(depth0, "NICK_OV_STATUS", {hash:{},data:data}))
    + "<input type=\"checkbox\" id=\"nick_ov_status\" "
    + escapeExpression(helpers.check.call(depth0, depth0.nick_ov_status, {hash:{},data:data}))
    + "></label></div><div class=\"controls\"><label class=\"checkbox\" for=\"show_timestamps\">"
    + escapeExpression(helpers.lang.call(depth0, "SHOW_TIMESTAMPS", {hash:{},data:data}))
    + "<input type=\"checkbox\" id=\"show_timestamps\" "
    + escapeExpression(helpers.check.call(depth0, depth0.show_timestamps, {hash:{},data:data}))
    + "></label></div><div class=\"controls\"><label class=\"checkbox\" for=\"show_nicklist\">"
    + escapeExpression(helpers.lang.call(depth0, "SHOW_NICKLIST", {hash:{},data:data}))
    + "<input type=\"checkbox\" id=\"show_nicklist\" "
    + escapeExpression(helpers.check.call(depth0, depth0.show_nicklist, {hash:{},data:data}))
    + "></label></div><div class=\"controls\"><label class=\"checkbox\" for=\"lastpos_line\">"
    + escapeExpression(helpers.lang.call(depth0, "LASTPOS_LINE", {hash:{},data:data}))
    + "<input type=\"checkbox\" id=\"lastpos_line\" "
    + escapeExpression(helpers.check.call(depth0, depth0.lastpos_line, {hash:{},data:data}))
    + "></label></div><div class=\"controls\"><label class=\"checkbox\" for=\"hide_joinparts\">"
    + escapeExpression(helpers.lang.call(depth0, "HIDE_JOINPARTS", {hash:{},data:data}))
    + "<input type=\"checkbox\" id=\"hide_joinparts\" "
    + escapeExpression(helpers.check.call(depth0, depth0.hide_joinparts, {hash:{},data:data}))
    + "></label></div><div class=\"controls\"><label for=\"font_size\">"
    + escapeExpression(helpers.lang.call(depth0, "FONT_SIZE", {hash:{},data:data}))
    + "<input type=\"number\" id=\"font_size\" value="
    + escapeExpression(((stack1 = depth0.font_size),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "></label></div><div class=\"controls\"><label for=\"volume\">"
    + escapeExpression(helpers.lang.call(depth0, "VOLUME", {hash:{},data:data}))
    + "<input type=\"number\" id=\"volume\" value="
    + escapeExpression(((stack1 = depth0.volume),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "></label></div><div class=\"controls\"><label for=\"style_hue\">"
    + escapeExpression(helpers.lang.call(depth0, "STYLE_HUE", {hash:{},data:data}))
    + "<div id=\"style_hue\" class=\"slider hue-slider\"><div class=\"knob\"></div></div></label></div></div><div class=\"irc-options control-group well\"><div class=\"controls\"><label class=\"checkbox\" for=\"use_hiddenhost\">"
    + escapeExpression(helpers.lang.call(depth0, "USE_HIDDENHOST", {hash:{},data:data}))
    + "<input type=\"checkbox\" id=\"use_hiddenhost\" "
    + escapeExpression(helpers.check.call(depth0, depth0.use_hiddenhost, {hash:{},data:data}))
    + "></label></div><div class=\"controls\"><label class=\"checkbox\" for=\"accept_service_invites\">"
    + escapeExpression(helpers.lang.call(depth0, "ACCEPT_SERVICE_INVITES", {hash:{},data:data}))
    + "<input type=\"checkbox\" id=\"accept_service_invites\" "
    + escapeExpression(helpers.check.call(depth0, depth0.accept_service_invites, {hash:{},data:data}))
    + "></label></div></div><div class=\"alert-options control-group well\"><div class=\"controls\"><label class=\"control-label-inline\">"
    + escapeExpression(helpers.lang.call(depth0, "DESKTOP_NOTICES", {hash:{},data:data}))
    + "<input type=\"button\" value=\""
    + escapeExpression(helpers.enableDisable.call(depth0, depth0.dn_state, {hash:{},data:data}))
    + "\" id=\"dn_state\"></label><label class=\"control-label-inline\" for=\"dn_duration\">Notification duration:<input type=\"number\" id=\"dn_duration\" value=\""
    + escapeExpression(((stack1 = depth0.dn_duration),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">ms</label><input type=\"button\" value=\"Test\" id=\"notice-test\"><a href=\"http://caniuse.com/notifications\" target=\"_blank\">Notification Support</a></div><div><div id=\"standard_notices\" class=\"controls notice-group panel panel-default\"><div class=\"panel-heading\" data-trigger=\"toggleReveal\" data-togglereveal-target=\"~.panel-body\" data-togglereveal-options=\"{}\"><h4><a>Standard Notices</a></h4></div><div class=\"panel-body\" "
    + ">";
  stack2 = helpers.each.call(depth0, depth0.standard_notices, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "</div></div><div id=\"custom_notices\" class=\"controls notice-group panel panel-default\"><div class=\"panel-heading\"><h4><a>Custom Notices</a></h4></div><div class=\"panel-body\">";
  stack2 = helpers.each.call(depth0, depth0.custom_notices, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "<input type=\"button\" value=\""
    + escapeExpression(helpers.lang.call(depth0, "ADD_NOTICE", {hash:{},data:data}))
    + "\" id=\"add-notice\" class=\"btn btn-default btn-small\"></div></div></div></div><div class=\"hotkeys control-group well\"></div></div><div class=\"actions\"><button type=\"submit\" class=\"btn btn-small btn-primary\" value=\"save\">Save Changes</button><button type=\"reset\" class=\"btn btn-small btn-warning\" value=\"reset\">Revert</button></div></form>";
  return buffer;
  });

this["qwebirc"]["templates"]["customNotice"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"controls\" data-id=\""
    + escapeExpression(((stack1 = depth0.id),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"><label class=\"control-inline\">"
    + escapeExpression(helpers.lang.call(depth0, "USER_NOTICE", {hash:{},data:data}))
    + "<input type=\"text\" data-id=\"nick\" placeholder=\""
    + escapeExpression(helpers.lang.call(depth0, "NICK_PLACEHOLDER", {hash:{},data:data}))
    + "\" value=\""
    + escapeExpression(((stack1 = depth0.nick),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"></label><label class=\"control-inline\">"
    + escapeExpression(helpers.lang.call(depth0, "MESSAGE_NOTICE", {hash:{},data:data}))
    + "<input type=\"text\" data-id=\"msg\" placeholder=\""
    + escapeExpression(helpers.lang.call(depth0, "MESSAGE_PLACEHOLDER", {hash:{},data:data}))
    + "\" value=\""
    + escapeExpression(((stack1 = depth0.msg),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"></label><label class=\"control-inline\">"
    + escapeExpression(helpers.lang.call(depth0, "TYPE_NOTICE", {hash:{},data:data}))
    + "<input type=\"text\" data-id=\"type\" placeholder=\""
    + escapeExpression(helpers.lang.call(depth0, "TYPE_PLACEHOLDER", {hash:{},data:data}))
    + "\" value=\""
    + escapeExpression(((stack1 = depth0.type),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"></label><label class=\"checkbox-inline\">"
    + escapeExpression(helpers.lang.call(depth0, "MENTIONED", {hash:{},data:data}))
    + "<input type=\"checkbox\" data-id=\"mentioned\" "
    + escapeExpression(helpers.check.call(depth0, depth0.mentioned, {hash:{},data:data}))
    + "></label><label class=\"checkbox-inline\" title=\""
    + escapeExpression(helpers.lang.call(depth0, "NOTUS_HINT", {hash:{},data:data}))
    + "\">"
    + escapeExpression(helpers.lang.call(depth0, "NOTUS", {hash:{},data:data}))
    + "<input type=\"checkbox\" data-id=\"notus\" "
    + escapeExpression(helpers.check.call(depth0, depth0.notus, {hash:{},data:data}))
    + "></label><label class=\"checkbox-inline\" >"
    + escapeExpression(helpers.lang.call(depth0, "BEEP", {hash:{},data:data}))
    + "<input type=\"checkbox\" data-id=\"beep\" "
    + escapeExpression(helpers.check.call(depth0, depth0.beep, {hash:{},data:data}))
    + "></label><label class=\"checkbox-inline\">"
    + escapeExpression(helpers.lang.call(depth0, "FLASH", {hash:{},data:data}))
    + "<input type=\"checkbox\" data-id=\"flash\" "
    + escapeExpression(helpers.check.call(depth0, depth0.flash, {hash:{},data:data}))
    + "></label><label class=\"checkbox-inline\">"
    + escapeExpression(helpers.lang.call(depth0, "PM", {hash:{},data:data}))
    + "<input type=\"checkbox\" data-id=\"pm\" "
    + escapeExpression(helpers.check.call(depth0, depth0.pm, {hash:{},data:data}))
    + "></label><label class=\"checkbox-inline\" title=\""
    + escapeExpression(helpers.lang.call(depth0, "HIGHLIGHT_HINT", {hash:{},data:data}))
    + "\">"
    + escapeExpression(helpers.lang.call(depth0, "HIGHLIGHT", {hash:{},data:data}))
    + "<input type=\"checkbox\" data-id=\"highlight\" "
    + escapeExpression(helpers.check.call(depth0, depth0.highlight, {hash:{},data:data}))
    + "></label><!-- <label class=\"checkbox-inline\">"
    + escapeExpression(helpers.lang.call(depth0, "HIGHLIGHT", {hash:{},data:data}))
    + "<input type=\"checkbox\" data-id=\"highlight\" "
    + escapeExpression(helpers.check.call(depth0, depth0.highlight, {hash:{},data:data}))
    + "></label><label class=\"checkbox-inline\">"
    + escapeExpression(helpers.lang.call(depth0, "MENTIONED", {hash:{},data:data}))
    + "<input type=\"checkbox\" data-id=\"mentioned\" "
    + escapeExpression(helpers.check.call(depth0, depth0.mentioned, {hash:{},data:data}))
    + "></label> --><label class=\"checkbox-inline\">"
    + escapeExpression(helpers.lang.call(depth0, "IGNORE_CASE", {hash:{},data:data}))
    + "<input type=\"checkbox\" data-id=\"case\" "
    + escapeExpression(helpers.check.call(depth0, depth0['case'], {hash:{},data:data}))
    + "></label><label class=\"checkbox-inline\" title=\""
    + escapeExpression(helpers.lang.call(depth0, "ESCAPE_HINT", {hash:{},data:data}))
    + "\">"
    + escapeExpression(helpers.lang.call(depth0, "AUTOESCAPE", {hash:{},data:data}))
    + "<input type=\"checkbox\" data-id=\"autoescape\" "
    + escapeExpression(helpers.check.call(depth0, depth0.autoescape, {hash:{},data:data}))
    + "></label><input type=\"button\" value=\""
    + escapeExpression(helpers.lang.call(depth0, "DELETE_NOTICE", {hash:{},data:data}))
    + "\" class=\"remove-notice btn btn-danger btn-smaller\"><div class=\"description\">"
    + escapeExpression(((stack1 = depth0.description),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div></div>";
  return buffer;
  });