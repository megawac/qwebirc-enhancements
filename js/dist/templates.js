this["Handlebars"] = this["Handlebars"] || {};
this["Handlebars"]["templates"] = this["Handlebars"]["templates"] || {};

this["Handlebars"]["templates"]["authpage"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  
  return "hidden";
  }

  buffer += "<div class=\"container center\">\r\n<form id=\"login\">\r\n<h2>Connect to ";
  if (stack1 = helpers.network) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.network; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " IRC</h2>\r\n<div class=\"nick right\">\r\n<label class=\"control-label\" for=\"nickname\">Nickname:\r\n<input type=\"text\" name=\"basic\" id=\"nickname\" value=\"";
  if (stack1 = helpers.nickname) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.nickname; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" placeholder=\"Nickname\" />\r\n</label>\r\n</div>\r\n<div class=\"username right ";
  stack1 = helpers.unless.call(depth0, depth0.full, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\">\r\n<label class=\"control-label\" for=\"username\">";
  if (stack1 = helpers.network) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.network; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " username:\r\n<input type=\"text\" name=\"full\" id=\"username\" value=\"";
  if (stack1 = helpers.username) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.username; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" placeholder=\"";
  if (stack1 = helpers.network) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.network; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " username\">\r\n</label>\r\n</div>\r\n<div class=\"password right ";
  stack1 = helpers.unless.call(depth0, depth0.full, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\">\r\n<label class=\"control-label\" for=\"password\">Password:\r\n<input type=\"password\" name=\"full\" id=\"password\" value=\"";
  if (stack1 = helpers.password) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.password; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\r\n</label>\r\n</div>\r\n<div class=\"authenticate\">\r\n<label for=\"authenticate\">Authenticate (optional)<input type=\"checkbox\" id=\"authenticate\" ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.check || depth0.check),stack1 ? stack1.call(depth0, depth0.full, options) : helperMissing.call(depth0, "check", depth0.full, options)))
    + "></label for=\"authenticate\">\r\n</div>\r\n<div><input type=\"submit\" value=\"Connect\" class=\"btn btn-primary btn-smaller\" /></div>\r\n</form>\r\n<div class=\"qwebirc-init-channels\"><span>";
  if (stack2 = helpers.channels) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.channels; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "</span></div>\r\n</div>";
  return buffer;
  });

this["Handlebars"]["templates"]["chanmenu"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); partials = this.merge(partials, Handlebars.partials); data = data || {};
  var buffer = "", stack1, self=this;

function program1(depth0,data) {
  
  var stack1;
  stack1 = self.invokePartial(partials.menuitem, 'menuitem', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  }

  buffer += "<div class='chanmenu dropdownmenu'>\r\n";
  stack1 = helpers.each.call(depth0, depth0.channels, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n</div>";
  return buffer;
  });

this["Handlebars"]["templates"]["channelName"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
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

this["Handlebars"]["templates"]["channellink"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
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

this["Handlebars"]["templates"]["customNotice"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;


  buffer += "<div class=\"controls custom-notice\" id=";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + ">\r\n<label class=\"control-inline\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.USER_NOTICE)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n<input type=\"text\" data-id=\"nick\" placeholder=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.NICK_PLACEHOLDER)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" value=\"";
  if (stack2 = helpers.nick) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.nick; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\">\r\n</label>\r\n<label class=\"control-inline\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.MESSAGE_NOTICE)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n<input type=\"text\" data-id=\"msg\" placeholder=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.MESSAGE_PLACEHOLDER)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" value=\"";
  if (stack2 = helpers.msg) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.msg; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\">\r\n</label>\r\n<label class=\"checkbox-inline\" >"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.BEEP)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n<input type=\"checkbox\" data-id=\"beep\" ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.check || depth0.check),stack1 ? stack1.call(depth0, depth0.beep, options) : helperMissing.call(depth0, "check", depth0.beep, options)))
    + ">\r\n</label>\r\n<label class=\"checkbox-inline\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.FLASH)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n<input type=\"checkbox\" data-id=\"flash\" ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.check || depth0.check),stack1 ? stack1.call(depth0, depth0.flash, options) : helperMissing.call(depth0, "check", depth0.flash, options)))
    + ">\r\n</label>\r\n<!-- <label class=\"checkbox-inline\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.HIGHLIGHT)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n<input type=\"checkbox\" data-id=\"highlight\" ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.check || depth0.check),stack1 ? stack1.call(depth0, depth0.highlight, options) : helperMissing.call(depth0, "check", depth0.highlight, options)))
    + ">\r\n</label>\r\n<label class=\"checkbox-inline\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.MENTIONED)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n<input type=\"checkbox\" data-id=\"mentioned\" ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.check || depth0.check),stack1 ? stack1.call(depth0, depth0.mentioned, options) : helperMissing.call(depth0, "check", depth0.mentioned, options)))
    + ">\r\n</label> -->\r\n<label class=\"checkbox-inline\" title=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.ESCAPE_HINT)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.AUTOESCAPE)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n<input type=\"checkbox\" data-id=\"autoescape\" ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.check || depth0.check),stack1 ? stack1.call(depth0, depth0.autoescape, options) : helperMissing.call(depth0, "check", depth0.autoescape, options)))
    + ">\r\n</label>\r\n<input type=\"button\" value=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.lang),stack1 == null || stack1 === false ? stack1 : stack1.DELETE_NOTICE)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" class=\"remove-notice btn btn-danger btn-smaller\">\r\n</div>";
  return buffer;
  });

this["Handlebars"]["templates"]["detachedWindow"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); partials = this.merge(partials, Handlebars.partials); data = data || {};
  var buffer = "", stack1, self=this, functionType="function", escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  var stack1;
  stack1 = self.invokePartial(partials.tabClose, 'tabClose', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  }

  buffer += "<div class='detached-window'>\r\n<div class='header'>\r\n<span class='title'>";
  if (stack1 = helpers.channel) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.channel; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>\r\n";
  stack1 = helpers.unless.call(depth0, depth0.base, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n";
  stack1 = self.invokePartial(partials.tabAttach, 'tabAttach', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n</div>\r\n</div>";
  return buffer;
  });

this["Handlebars"]["templates"]["ircInput"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<form class='input'>\r\n<div class='input-group'>\r\n<span class='input-group-addon nickname'><span class='status ";
  if (stack1 = helpers.status) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.status; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "'></span>";
  if (stack1 = helpers.nick) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.nick; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>\r\n<input class='";
  if (stack1 = helpers.type) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.type; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " input-field form-control' type='text'>\r\n<span class='input-group-btn'>\r\n<button class='btn btn-default send' type='button'>&gt;</button>\r\n</span>\r\n<ul class='dropdown-menu'>\r\n<li><a href='#'>Colours</a></li>\r\n<li><a href='#'>Styles</a></li>\r\n<li><a href='#'>IRC Commands</a></li>\r\n<li><a href='#'>Actions</a></li>\r\n</ul>\r\n</div>\r\n</form>";
  return buffer;
  });

this["Handlebars"]["templates"]["ircMessage"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
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

this["Handlebars"]["templates"]["ircTab"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); partials = this.merge(partials, Handlebars.partials); data = data || {};
  var buffer = "", stack1, functionType="function", self=this;


  buffer += "<a href='#' class='tab'>";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "&nbsp;";
  stack1 = self.invokePartial(partials.tabDetach, 'tabDetach', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</a>";
  return buffer;
  });

this["Handlebars"]["templates"]["ircstyle"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
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

this["Handlebars"]["templates"]["menubtn"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class='dropdown-tab'>\r\n<img src='";
  if (stack1 = helpers.icon) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.icon; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "' title='menu' alt='menu'>\r\n</div>";
  return buffer;
  });

this["Handlebars"]["templates"]["menuitem"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
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
  buffer += "\r\n<span class='hint'>";
  if (stack1 = helpers.hint) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.hint; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>\r\n";
  return buffer;
  }

  buffer += "<a";
  stack1 = helpers['if'].call(depth0, depth0.value, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += ">\r\n<span>";
  if (stack1 = helpers.text) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.text; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>\r\n";
  stack1 = helpers['if'].call(depth0, depth0.hint, {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n</a>";
  return buffer;
  });

this["Handlebars"]["templates"]["message"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
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

this["Handlebars"]["templates"]["nickbtn"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
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

this["Handlebars"]["templates"]["nickmenubtn"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
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

this["Handlebars"]["templates"]["options"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;


  buffer += "\r\n<form id=\"options\" class=\"form-horizontal\">\r\n<ul class=\"option-tabs tabs nav nav-tabs\" data-behavior=\"BS.Tabs\">\r\n<li class=\"ui-options\"><a href=\"#\">Interface</a></li>\r\n<li class=\"irc-options\"><a href=\"#\">Chat Preferences</a></li>\r\n<li class=\"alert-options\"><a href=\"#\">Notifications</a></li>\r\n<li class=\"hotkeys disabled\"><a href=\"#\">Hot Keys(TODO)</a></li>\r\n</ul>\r\n<div class=\"tab-content\" id=\"my-tab-content\">\r\n<div class=\"ui-options control-group well active\">\r\n<div class=\"controls\">\r\n<label class=\"checkbox\" for=\"auto_open_pm\">\r\n"
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
    + "\">ms\r\n</label>\r\n<input type=\"button\" value=\"Test\" id=\"notice-test\">\r\n</div>\r\n<div id=\"standard-notices\">\r\n<div class=\"controls\">\r\n<label class=\"control-label\">"
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

this["Handlebars"]["templates"]["qweblink"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
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

this["Handlebars"]["templates"]["spanURL"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
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

this["Handlebars"]["templates"]["timestamp"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
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

this["Handlebars"]["templates"]["topicBar"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); partials = this.merge(partials, Handlebars.partials); data = data || {};
  var buffer = "", stack1, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n";
  stack1 = self.invokePartial(partials.topicText, 'topicText', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n";
  return buffer;
  }

function program3(depth0,data) {
  
  
  return "&nbsp;\r\n";
  }

  buffer += "<div class='topic qui colourline'>\r\n";
  stack1 = helpers['if'].call(depth0, depth0.topic, {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n</div>";
  return buffer;
  });

this["Handlebars"]["templates"]["topicText"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, self=this, functionType="function", escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  
  return "emptytopic";
  }

  buffer += "<span class='";
  stack1 = helpers['if'].call(depth0, depth0.empty, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "'>[<span>";
  if (stack1 = helpers.topic) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.topic; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>]</span>";
  return buffer;
  });

this["Handlebars"]["templates"]["userlink"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<span class='hyperlink-whois' data-user='";
  if (stack1 = helpers.userid) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.userid; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "'>";
  if (stack1 = helpers.username) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.username; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>";
  return buffer;
  });

this["Handlebars"]["templates"]["window"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
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
  buffer += "\r\n";
  stack1 = self.invokePartial(partials.verticalDivider, 'verticalDivider', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n<div class=\"qui rightpanel\"></div>\r\n";
  return buffer;
  }

  buffer += "<div class=\"window qui hidden\" data-id=\"";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" data-name=\"";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\r\n";
  stack1 = helpers['if'].call(depth0, depth0.isChannel, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n<div class=\"qui content\">\r\n<div class=\"qui leftpanel lines\"></div>\r\n";
  stack1 = helpers['if'].call(depth0, depth0.isChannel, {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n</div>\r\n<div class=\"qui properties\">\r\n";
  stack1 = self.invokePartial(partials.channelName, 'channelName', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n</div>\r\n<div class=\"qui bottompanel\">\r\n"
    + "\r\n</div>\r\n</div>";
  return buffer;
  });