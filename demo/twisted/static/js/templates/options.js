this["qwebirc"] = this["qwebirc"] || {};
this["qwebirc"]["templates"] = this["qwebirc"]["templates"] || {};

this["qwebirc"]["templates"]["options"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;


  buffer += "\r\n<form id=\"options\" class=\"form-horizontal\">\r\n<ul class=\"option-tabs tabs nav nav-tabs\" data-behavior=\"BS.Tabs\">\r\n<li class=\"ui-options\"><a href=\"#\">Interface</a></li>\r\n<li class=\"irc-options\"><a href=\"#\">Chat Preferences</a></li>\r\n<li class=\"alert-options\"><a href=\"#\">Notifications</a></li>\r\n<li class=\"hotkeys disabled\"><a href=\"#\">Hot Keys(TODO)</a></li>\r\n</ul>\r\n<div class=\"tab-content\">\r\n<div class=\"ui-options control-group well active\">\r\n<div class=\"controls\">\r\n<label class=\"checkbox\" for=\"auto_open_pm\">\r\n"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.AUTO_OPEN_PM)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n<input type=\"checkbox\" id=\"auto_open_pm\" ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.check || depth0.check),stack1 ? stack1.call(depth0, depth0.auto_open_pm, options) : helperMissing.call(depth0, "check", depth0.auto_open_pm, options)))
    + ">\r\n</label>\r\n</div>\r\n<div class=\"controls\">\r\n<label class=\"checkbox\" for=\"nick_colours\">\r\n"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.NICK_COLOURS)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n<input type=\"checkbox\" id=\"nick_colours\" ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.check || depth0.check),stack1 ? stack1.call(depth0, depth0.nick_colours, options) : helperMissing.call(depth0, "check", depth0.nick_colours, options)))
    + ">\r\n</label>\r\n</div>\r\n<div class=\"controls\">\r\n<label class=\"checkbox\" for=\"nick_ov_status\">\r\n"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.NICK_OV_STATUS)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n<input type=\"checkbox\" id=\"nick_ov_status\" ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.check || depth0.check),stack1 ? stack1.call(depth0, depth0.nick_ov_status, options) : helperMissing.call(depth0, "check", depth0.nick_ov_status, options)))
    + ">\r\n</label>\r\n</div>\r\n<div class=\"controls\">\r\n<label class=\"checkbox\" for=\"show_timestamps\">\r\n"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.SHOW_TIMESTAMPS)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n<input type=\"checkbox\" id=\"show_timestamps\" ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.check || depth0.check),stack1 ? stack1.call(depth0, depth0.show_timestamps, options) : helperMissing.call(depth0, "check", depth0.show_timestamps, options)))
    + ">\r\n</label>\r\n</div>\r\n<div class=\"controls\">\r\n<label class=\"checkbox\" for=\"lastpos_line\">\r\n"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.LASTPOS_LINE)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n<input type=\"checkbox\" id=\"lastpos_line\" ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.check || depth0.check),stack1 ? stack1.call(depth0, depth0.lastpos_line, options) : helperMissing.call(depth0, "check", depth0.lastpos_line, options)))
    + ">\r\n</label>\r\n</div>\r\n<div class=\"controls\">\r\n<label class=\"checkbox\" for=\"hide_joinparts\">\r\n"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.HIDE_JOINPARTS)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n<input type=\"checkbox\" id=\"hide_joinparts\" ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.check || depth0.check),stack1 ? stack1.call(depth0, depth0.hide_joinparts, options) : helperMissing.call(depth0, "check", depth0.hide_joinparts, options)))
    + ">\r\n</label>\r\n</div>\r\n<div class=\"controls\">\r\n<label class=\"checkbox\" for=\"query_on_nick_click\">\r\n"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.QUERY_ON_NICK_CLICK)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n<input type=\"checkbox\" id=\"query_on_nick_click\" ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.check || depth0.check),stack1 ? stack1.call(depth0, depth0.query_on_nick_click, options) : helperMissing.call(depth0, "check", depth0.query_on_nick_click, options)))
    + ">\r\n</label>\r\n</div>\r\n<div class=\"controls\">\r\n<label class=\"checkbox\" for=\"font_size\">\r\n"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.FONT_SIZE)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n<input type=\"number\" id=\"font_size\" value=";
  if (stack2 = helpers.font_size) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.font_size; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + ">\r\n</label>\r\n</div>\r\n<div class=\"controls\">\r\n<label for=\"style_hue\">\r\n"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.STYLE_HUE)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n<div id=\"style_hue\" class=\"slider hue-slider\"><div class=\"knob\"></div></div>\r\n</label>\r\n</div>\r\n</div>\r\n<div class=\"irc-options control-group well\">\r\n<div class=\"controls\">\r\n<label class=\"checkbox\" for=\"use_hiddenhost\">\r\n"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.USE_HIDDENHOST)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n<input type=\"checkbox\" id=\"use_hiddenhost\" ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.check || depth0.check),stack1 ? stack1.call(depth0, depth0.use_hiddenhost, options) : helperMissing.call(depth0, "check", depth0.use_hiddenhost, options)))
    + ">\r\n</label>\r\n</div>\r\n<div class=\"controls\">\r\n<label class=\"checkbox\" for=\"accept_service_invites\">\r\n"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.ACCEPT_SERVICE_INVITES)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n<input type=\"checkbox\" id=\"accept_service_invites\" ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.check || depth0.check),stack1 ? stack1.call(depth0, depth0.accept_service_invites, options) : helperMissing.call(depth0, "check", depth0.accept_service_invites, options)))
    + ">\r\n</label>\r\n</div>\r\n</div>\r\n<div class=\"alert-options control-group well\">\r\n<div class=\"controls\">\r\n<label class=\"control-label-inline\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.DESKTOP_NOTICES)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n<input type=\"button\" value=\"";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.enableDisable || depth0.enableDisable),stack1 ? stack1.call(depth0, depth0.dn_state, options) : helperMissing.call(depth0, "enableDisable", depth0.dn_state, options)))
    + "\" id=\"dn_state\">\r\n</label>\r\n<label class=\"control-label-inline\" for=\"dn_duration\">Notification duration:\r\n<input type=\"number\" id=\"dn_duration\" value=\"";
  if (stack2 = helpers.dn_duration) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.dn_duration; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\">ms\r\n</label>\r\n<input type=\"button\" value=\"Test\" id=\"notice-test\">\r\n<a href=\"http://caniuse.com/notifications\">Notification Support</a>\r\n</div>\r\n<div id=\"standard-notices\">\r\n<div class=\"controls\">\r\n<label class=\"control-label\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.NOTIFY_ON_MENTION)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n<label class=\"checkbox-inline\" for=\"on_mention.beep\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.BEEP)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n<input type=\"checkbox\" id=\"on_mention.beep\" ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.check || depth0.check),stack1 ? stack1.call(depth0, ((stack1 = ((stack1 = depth0.notices),stack1 == null || stack1 === false ? stack1 : stack1.on_mention)),stack1 == null || stack1 === false ? stack1 : stack1.beep), options) : helperMissing.call(depth0, "check", ((stack1 = ((stack1 = depth0.notices),stack1 == null || stack1 === false ? stack1 : stack1.on_mention)),stack1 == null || stack1 === false ? stack1 : stack1.beep), options)))
    + ">\r\n</label>\r\n<label class=\"checkbox-inline\" for=\"on_mention.flash\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.FLASH)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n<input type=\"checkbox\" id=\"on_mention.flash\" ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.check || depth0.check),stack1 ? stack1.call(depth0, ((stack1 = ((stack1 = depth0.notices),stack1 == null || stack1 === false ? stack1 : stack1.on_mention)),stack1 == null || stack1 === false ? stack1 : stack1.flash), options) : helperMissing.call(depth0, "check", ((stack1 = ((stack1 = depth0.notices),stack1 == null || stack1 === false ? stack1 : stack1.on_mention)),stack1 == null || stack1 === false ? stack1 : stack1.flash), options)))
    + ">\r\n</label>\r\n</label>\r\n</div>\r\n<div class=\"controls\">\r\n<label class=\"control-label\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.NOTIFY_ON_PM)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n<label class=\"checkbox-inline\" for=\"on_pm.beep\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.BEEP)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n<input type=\"checkbox\" id=\"on_pm.beep\" ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.check || depth0.check),stack1 ? stack1.call(depth0, ((stack1 = ((stack1 = depth0.notices),stack1 == null || stack1 === false ? stack1 : stack1.on_pm)),stack1 == null || stack1 === false ? stack1 : stack1.beep), options) : helperMissing.call(depth0, "check", ((stack1 = ((stack1 = depth0.notices),stack1 == null || stack1 === false ? stack1 : stack1.on_pm)),stack1 == null || stack1 === false ? stack1 : stack1.beep), options)))
    + ">\r\n</label>\r\n<label class=\"checkbox-inline\" for=\"on_pm.flash\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.FLASH)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n<input type=\"checkbox\" id=\"on_pm.flash\" ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.check || depth0.check),stack1 ? stack1.call(depth0, ((stack1 = ((stack1 = depth0.notices),stack1 == null || stack1 === false ? stack1 : stack1.on_pm)),stack1 == null || stack1 === false ? stack1 : stack1.flash), options) : helperMissing.call(depth0, "check", ((stack1 = ((stack1 = depth0.notices),stack1 == null || stack1 === false ? stack1 : stack1.on_pm)),stack1 == null || stack1 === false ? stack1 : stack1.flash), options)))
    + ">\r\n</label>\r\n</label>\r\n</div>\r\n<div class=\"controls\">\r\n<label class=\"control-label\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.NOTIFY_ON_NOTICE)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n<label class=\"checkbox-inline\" for=\"on_notice.beep\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.BEEP)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n<input type=\"checkbox\" id=\"on_notice.beep\" ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.check || depth0.check),stack1 ? stack1.call(depth0, ((stack1 = ((stack1 = depth0.notices),stack1 == null || stack1 === false ? stack1 : stack1.on_notice)),stack1 == null || stack1 === false ? stack1 : stack1.beep), options) : helperMissing.call(depth0, "check", ((stack1 = ((stack1 = depth0.notices),stack1 == null || stack1 === false ? stack1 : stack1.on_notice)),stack1 == null || stack1 === false ? stack1 : stack1.beep), options)))
    + ">\r\n</label>\r\n<label class=\"checkbox-inline\" for=\"on_notice.flash\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.FLASH)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n<input type=\"checkbox\" id=\"on_notice.flash\" ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.check || depth0.check),stack1 ? stack1.call(depth0, ((stack1 = ((stack1 = depth0.notices),stack1 == null || stack1 === false ? stack1 : stack1.on_notice)),stack1 == null || stack1 === false ? stack1 : stack1.flash), options) : helperMissing.call(depth0, "check", ((stack1 = ((stack1 = depth0.notices),stack1 == null || stack1 === false ? stack1 : stack1.on_notice)),stack1 == null || stack1 === false ? stack1 : stack1.flash), options)))
    + ">\r\n</label>\r\n</label>\r\n</div>\r\n</div>\r\n<h3>Custom Notices</h3>\r\n<div id=\"custom-notices\" class=\"controls\">\r\n\r\n</div>\r\n<input type=\"button\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.ADD_NOTICE)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" id=\"add-notice\" class=\"btn btn-default btn-small\">\r\n</div>\r\n<div class=\"hotkeys control-group well\">\r\n\r\n</div>\r\n</div>\r\n<div class=\"actions\">\r\n<button type=\"submit\" class=\"btn btn-small btn-primary\" value=\"save\">Save Changes</button>\r\n<button type=\"reset\" class=\"btn btn-small btn-warning\" value=\"reset\">Revert</button>\r\n</div>\r\n</form>";
  return buffer;
  });