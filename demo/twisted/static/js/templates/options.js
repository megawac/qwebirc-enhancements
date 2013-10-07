this["qwebirc"] = this["qwebirc"] || {};
this["qwebirc"]["templates"] = this["qwebirc"]["templates"] || {};

this["qwebirc"]["templates"]["options"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<form id=\"options\" class=\"form-horizontal\"><ul class=\"option-tabs tabs nav nav-tabs\" data-behavior=\"BS.Tabs\"><li class=\"ui-options\"><a href=\"#\">Interface</a></li><li class=\"irc-options\"><a href=\"#\">Chat Preferences</a></li><li class=\"alert-options\"><a href=\"#\">Notifications</a></li><li class=\"hotkeys disabled\"><a href=\"#\">Hot Keys(TODO)</a></li></ul><div class=\"tab-content\"><div class=\"ui-options control-group well active\"><div class=\"controls\"><label class=\"checkbox\" for=\"auto_open_pm\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.AUTO_OPEN_PM)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "<input type=\"checkbox\" id=\"auto_open_pm\" "
    + escapeExpression(helpers.check.call(depth0, depth0.auto_open_pm, {hash:{},data:data}))
    + "></label></div><div class=\"controls\"><label class=\"checkbox\" for=\"nick_colours\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.NICK_COLOURS)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "<input type=\"checkbox\" id=\"nick_colours\" "
    + escapeExpression(helpers.check.call(depth0, depth0.nick_colours, {hash:{},data:data}))
    + "></label></div><div class=\"controls\"><label class=\"checkbox\" for=\"nick_ov_status\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.NICK_OV_STATUS)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "<input type=\"checkbox\" id=\"nick_ov_status\" "
    + escapeExpression(helpers.check.call(depth0, depth0.nick_ov_status, {hash:{},data:data}))
    + "></label></div><div class=\"controls\"><label class=\"checkbox\" for=\"show_timestamps\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.SHOW_TIMESTAMPS)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "<input type=\"checkbox\" id=\"show_timestamps\" "
    + escapeExpression(helpers.check.call(depth0, depth0.show_timestamps, {hash:{},data:data}))
    + "></label></div><div class=\"controls\"><label class=\"checkbox\" for=\"show_nicklist\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.SHOW_NICKLIST)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "<input type=\"checkbox\" id=\"show_nicklist\" "
    + escapeExpression(helpers.check.call(depth0, depth0.show_nicklist, {hash:{},data:data}))
    + "></label></div><div class=\"controls\"><label class=\"checkbox\" for=\"lastpos_line\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.LASTPOS_LINE)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "<input type=\"checkbox\" id=\"lastpos_line\" "
    + escapeExpression(helpers.check.call(depth0, depth0.lastpos_line, {hash:{},data:data}))
    + "></label></div><div class=\"controls\"><label class=\"checkbox\" for=\"hide_joinparts\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.HIDE_JOINPARTS)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "<input type=\"checkbox\" id=\"hide_joinparts\" "
    + escapeExpression(helpers.check.call(depth0, depth0.hide_joinparts, {hash:{},data:data}))
    + "></label></div><div class=\"controls\"><label class=\"checkbox\" for=\"font_size\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.FONT_SIZE)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "<input type=\"number\" id=\"font_size\" value="
    + escapeExpression(((stack1 = depth0.font_size),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "></label></div><div class=\"controls\"><label for=\"style_hue\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.STYLE_HUE)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "<div id=\"style_hue\" class=\"slider hue-slider\"><div class=\"knob\"></div></div></label></div></div><div class=\"irc-options control-group well\"><div class=\"controls\"><label class=\"checkbox\" for=\"use_hiddenhost\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.USE_HIDDENHOST)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "<input type=\"checkbox\" id=\"use_hiddenhost\" "
    + escapeExpression(helpers.check.call(depth0, depth0.use_hiddenhost, {hash:{},data:data}))
    + "></label></div><div class=\"controls\"><label class=\"checkbox\" for=\"accept_service_invites\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.ACCEPT_SERVICE_INVITES)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "<input type=\"checkbox\" id=\"accept_service_invites\" "
    + escapeExpression(helpers.check.call(depth0, depth0.accept_service_invites, {hash:{},data:data}))
    + "></label></div></div><div class=\"alert-options control-group well\"><div class=\"controls\"><label class=\"control-label-inline\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.DESKTOP_NOTICES)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "<input type=\"button\" value=\""
    + escapeExpression(helpers.enableDisable.call(depth0, depth0.dn_state, {hash:{},data:data}))
    + "\" id=\"dn_state\"></label><label class=\"control-label-inline\" for=\"dn_duration\">Notification duration:<input type=\"number\" id=\"dn_duration\" value=\""
    + escapeExpression(((stack1 = depth0.dn_duration),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">ms</label><input type=\"button\" value=\"Test\" id=\"notice-test\"><a href=\"http://caniuse.com/notifications\" target=\"_blank\">Notification Support</a></div><div id=\"standard-notices\"><div class=\"controls\"><label class=\"control-label\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.NOTIFY_ON_MENTION)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "<label class=\"checkbox-inline\" for=\"on_mention.beep\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.BEEP)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "<input type=\"checkbox\" id=\"on_mention.beep\" "
    + escapeExpression(helpers.check.call(depth0, ((stack1 = ((stack1 = depth0.notices),stack1 == null || stack1 === false ? stack1 : stack1.on_mention)),stack1 == null || stack1 === false ? stack1 : stack1.beep), {hash:{},data:data}))
    + "></label><label class=\"checkbox-inline\" for=\"on_mention.flash\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.FLASH)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "<input type=\"checkbox\" id=\"on_mention.flash\" "
    + escapeExpression(helpers.check.call(depth0, ((stack1 = ((stack1 = depth0.notices),stack1 == null || stack1 === false ? stack1 : stack1.on_mention)),stack1 == null || stack1 === false ? stack1 : stack1.flash), {hash:{},data:data}))
    + "></label><label class=\"checkbox-inline\" for=\"on_mention.pm\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.PM)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "<input type=\"checkbox\" id=\"on_mention.pm\" "
    + escapeExpression(helpers.check.call(depth0, ((stack1 = ((stack1 = depth0.notices),stack1 == null || stack1 === false ? stack1 : stack1.on_mention)),stack1 == null || stack1 === false ? stack1 : stack1.pm), {hash:{},data:data}))
    + "></label></label></div><div class=\"controls\"><label class=\"control-label\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.NOTIFY_ON_PM)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "<label class=\"checkbox-inline\" for=\"on_pm.beep\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.BEEP)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "<input type=\"checkbox\" id=\"on_pm.beep\" "
    + escapeExpression(helpers.check.call(depth0, ((stack1 = ((stack1 = depth0.notices),stack1 == null || stack1 === false ? stack1 : stack1.on_pm)),stack1 == null || stack1 === false ? stack1 : stack1.beep), {hash:{},data:data}))
    + "></label><label class=\"checkbox-inline\" for=\"on_pm.flash\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.FLASH)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "<input type=\"checkbox\" id=\"on_pm.flash\" "
    + escapeExpression(helpers.check.call(depth0, ((stack1 = ((stack1 = depth0.notices),stack1 == null || stack1 === false ? stack1 : stack1.on_pm)),stack1 == null || stack1 === false ? stack1 : stack1.flash), {hash:{},data:data}))
    + "></label><label class=\"checkbox-inline\" for=\"on_pm.pm\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.PM)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "<input type=\"checkbox\" id=\"on_pm.pm\" "
    + escapeExpression(helpers.check.call(depth0, ((stack1 = ((stack1 = depth0.notices),stack1 == null || stack1 === false ? stack1 : stack1.on_pm)),stack1 == null || stack1 === false ? stack1 : stack1.pm), {hash:{},data:data}))
    + "></label></label></div><div class=\"controls\"><label class=\"control-label\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.NOTIFY_ON_NOTICE)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "<label class=\"checkbox-inline\" for=\"on_notice.beep\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.BEEP)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "<input type=\"checkbox\" id=\"on_notice.beep\" "
    + escapeExpression(helpers.check.call(depth0, ((stack1 = ((stack1 = depth0.notices),stack1 == null || stack1 === false ? stack1 : stack1.on_notice)),stack1 == null || stack1 === false ? stack1 : stack1.beep), {hash:{},data:data}))
    + "></label><label class=\"checkbox-inline\" for=\"on_notice.flash\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.FLASH)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "<input type=\"checkbox\" id=\"on_notice.flash\" "
    + escapeExpression(helpers.check.call(depth0, ((stack1 = ((stack1 = depth0.notices),stack1 == null || stack1 === false ? stack1 : stack1.on_notice)),stack1 == null || stack1 === false ? stack1 : stack1.flash), {hash:{},data:data}))
    + "></label><label class=\"checkbox-inline\" for=\"on_notice.pm\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.PM)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "<input type=\"checkbox\" id=\"on_notice.pm\" "
    + escapeExpression(helpers.check.call(depth0, ((stack1 = ((stack1 = depth0.notices),stack1 == null || stack1 === false ? stack1 : stack1.on_notice)),stack1 == null || stack1 === false ? stack1 : stack1.pm), {hash:{},data:data}))
    + "></label></label></div></div><h3>Custom Notices</h3><div id=\"custom-notices\" class=\"controls\"></div><input type=\"button\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.ADD_NOTICE)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" id=\"add-notice\" class=\"btn btn-default btn-small\"></div><div class=\"hotkeys control-group well\"></div></div><div class=\"actions\"><button type=\"submit\" class=\"btn btn-small btn-primary\" value=\"save\">Save Changes</button><button type=\"reset\" class=\"btn btn-small btn-warning\" value=\"reset\">Revert</button></div></form>";
  return buffer;
  });

this["qwebirc"]["templates"]["customNotice"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"controls custom-notice\" id="
    + escapeExpression(((stack1 = depth0.id),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "><label class=\"control-inline\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.USER_NOTICE)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "<input type=\"text\" data-id=\"nick\" placeholder=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.NICK_PLACEHOLDER)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" value=\""
    + escapeExpression(((stack1 = depth0.nick),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"></label><label class=\"control-inline\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.MESSAGE_NOTICE)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "<input type=\"text\" data-id=\"msg\" placeholder=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.MESSAGE_PLACEHOLDER)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" value=\""
    + escapeExpression(((stack1 = depth0.msg),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"></label><label class=\"checkbox-inline\" >"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.BEEP)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "<input type=\"checkbox\" data-id=\"beep\" "
    + escapeExpression(helpers.check.call(depth0, depth0.beep, {hash:{},data:data}))
    + "></label><label class=\"checkbox-inline\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.FLASH)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "<input type=\"checkbox\" data-id=\"flash\" "
    + escapeExpression(helpers.check.call(depth0, depth0.flash, {hash:{},data:data}))
    + "></label><label class=\"checkbox-inline\" >"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.PM)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "<input type=\"checkbox\" data-id=\"pm\" "
    + escapeExpression(helpers.check.call(depth0, depth0.pm, {hash:{},data:data}))
    + "></label><!-- <label class=\"checkbox-inline\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.HIGHLIGHT)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "<input type=\"checkbox\" data-id=\"highlight\" "
    + escapeExpression(helpers.check.call(depth0, depth0.highlight, {hash:{},data:data}))
    + "></label><label class=\"checkbox-inline\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.MENTIONED)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "<input type=\"checkbox\" data-id=\"mentioned\" "
    + escapeExpression(helpers.check.call(depth0, depth0.mentioned, {hash:{},data:data}))
    + "></label> --><label class=\"checkbox-inline\" title=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.ESCAPE_HINT)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.AUTOESCAPE)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "<input type=\"checkbox\" data-id=\"autoescape\" "
    + escapeExpression(helpers.check.call(depth0, depth0.autoescape, {hash:{},data:data}))
    + "></label><input type=\"button\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.DELETE_NOTICE)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" class=\"remove-notice btn btn-danger btn-smaller\"></div>";
  return buffer;
  });