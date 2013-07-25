this["Handlebars"] = this["Handlebars"] || {};
this["Handlebars"]["templates"] = this["Handlebars"]["templates"] || {};

this["Handlebars"]["templates"]["authpage"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  
  return "hidden";
  }

  buffer += "<form id='login'>\r\n<h1>Connect to ";
  if (stack1 = helpers.network) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.network; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " IRC</h1>\r\n<div class='nick right'><span>Nickname:</span><input type='text' name='basic' id='nickname' value=";
  if (stack1 = helpers.nickname) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.nickname; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " /></div>\r\n<div class='username right ";
  stack1 = helpers.unless.call(depth0, depth0.full, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "'><span>Gamesurge username:</span><input type='text' name='full' id='username' value='";
  if (stack1 = helpers.username) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.username; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "'></div>\r\n<div class='password right ";
  stack1 = helpers.unless.call(depth0, depth0.full, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "'><span>Password:</span><input type='password' name='full' id='password' value='";
  if (stack1 = helpers.password) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.password; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "'></div>\r\n<div class='authenticate'>\r\n<span>Authenticate (optional)</span><input type='checkbox' id='authenticate' ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.check || depth0.check),stack1 ? stack1.call(depth0, depth0.full, options) : helperMissing.call(depth0, "check", depth0.full, options)))
    + ">\r\n</div>\r\n<div><input type='submit' value='Connect' /></div>\r\n</form>\r\n<div class='qwebirc-init-channels'><span>";
  if (stack2 = helpers.channels) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.channels; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "</span></div>\n";
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
  buffer += "\r\n</div>\n";
  return buffer;
  });

this["Handlebars"]["templates"]["channelName"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function";


  buffer += "<div id='channel-name-id' class='channel-name'>";
  if (stack1 = helpers.channel) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.channel; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</div>\n";
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
    + "</span>\n";
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
  buffer += "\r\n</div>\r\n</div>\n";
  return buffer;
  });

this["Handlebars"]["templates"]["ircInput"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<form class='input'>\r\n<div>\r\n<label class='nickname'><span class='status ";
  if (stack1 = helpers.status) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.status; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "'></span>";
  if (stack1 = helpers.nick) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.nick; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</label>\r\n<input class='";
  if (stack1 = helpers.type) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.type; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " input-field' type='text'>\r\n<input class='input-button' type='button' value='>' />\r\n</div>\r\n</form>\n";
  return buffer;
  });

this["Handlebars"]["templates"]["ircMessage"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class='";
  if (stack1 = helpers['class']) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0['class']; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "'></div>\n";
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
  buffer += "</a>\n";
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
    + "' title='menu' alt='menu'>\r\n</div>\n";
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
  buffer += "\r\n</a>\n";
  return buffer;
  });

this["Handlebars"]["templates"]["message"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, functionType="function";


  buffer += "<div class='message";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.pad || depth0.pad),stack1 ? stack1.call(depth0, depth0['class'], options) : helperMissing.call(depth0, "pad", depth0['class'], options)))
    + "'><span>";
  if (stack2 = helpers.message) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.message; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "</span></div>\n";
  return buffer;
  });

this["Handlebars"]["templates"]["nickbtn"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<a href='#' class='user'><span>";
  if (stack1 = helpers.nick) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.nick; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span></a>\n";
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
    + "</span>\n";
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
    + " </span>\n";
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

  buffer += "<div class='topic tab-invisible qui colourline'>\r\n";
  stack1 = helpers['if'].call(depth0, depth0.topic, {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n</div>\n";
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
  buffer += "'>";
  if (stack1 = helpers.topic) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.topic; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>\n";
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
    + "'>&lt;";
  if (stack1 = helpers.username) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.username; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "&gt;</span>\n";
  return buffer;
  });
/*Copyright (c) 2008-2009 the qwebirc project.
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
project name and URL in the about dialog, thanks!*/


; (function(window, undefined) {
    "use strict";

    //init crap
    var DEBUG = true;

    //common globals
    var document = window.document,
        $ = document.id,
        Functional = window.Functional,
        prelude = window.prelude;

    /* qwebirc -- Copyright (C) 2008-2011 Chris Porter and the qwebirc project --- All rights reserved. */

    window.QWEBIRC_BUILD="bbc577ad5cb78d946ac1";

    //global object
    //var qwebirc = window.qwebirc = {ui: {themes: {}, style: {}}, irc: {}, util: {crypto: {}}, config: {}, auth: {}, sound: {}};

    var qwebirc = window.qwebirc = {},

        irc = qwebirc.irc = {},

        util = qwebirc.util = {},
        crypto = util.crypto = {},

        config = qwebirc.config = {},
        auth = qwebirc.auth = {},

        ui = qwebirc.ui = {},
        themes = ui.themes = {},
        style = ui.style = {},

        sound = qwebirc.sound = {},//,

        lang;// = qwebirc.lang;

    qwebirc.BUILD = QWEBIRC_BUILD;
    qwebirc.FILE_SUFFIX = "-" + QWEBIRC_BUILD;
    qwebirc.VERSION = "0.93-dev";


ui.WINDOW_STATUS = 1;
ui.WINDOW_QUERY = 2;
ui.WINDOW_CHANNEL = 4;
ui.WINDOW_CUSTOM = 8;
ui.WINDOW_CONNECT = 16;
ui.WINDOW_MESSAGES = 32;
ui.CUSTOM_CLIENT = "custom";

ui.HILIGHT_NONE = 0;
ui.HILIGHT_ACTIVITY = 1;
ui.HILIGHT_SPEECH = 2;
ui.HILIGHT_US = 3;
ui.MAXIMUM_LINES_PER_WINDOW = 1000;
ui.WINDOW_LASTLINE = ui.WINDOW_QUERY | ui.WINDOW_MESSAGES | ui.WINDOW_CHANNEL | ui.WINDOW_STATUS;

irc.PMODE_LIST = 0;
irc.PMODE_SET_UNSET = 1;
irc.PMODE_SET_ONLY = 2;
irc.PMODE_REGULAR_MODE = 3;


var BROUHAHA = '#brouhaha',
    CONNECTION_DETAILS = 'Connection details',
    STATUS = 'Status',
    OPTIONS = 'Options',


    BASE_WINDOWS = [BROUHAHA, CONNECTION_DETAILS, STATUS],
    CHANNEL_TYPES = [ui.WINDOW_CHANNEL, ui.WINDOW_QUERY],
    INPUT_TYPES = [ui.WINDOW_STATUS, ui.WINDOW_QUERY, ui.WINDOW_CHANNEL, ui.WINDOW_MESSAGES];

var OPED = "+",
    DEOPED = "-",
    OPSTATUS = "@",
    VOICESTATUS = "+";

irc.IRCLowercaseTable = [ /* x00-x07 */ '\x00', '\x01', '\x02', '\x03', '\x04', '\x05', '\x06', '\x07',
    /* x08-x0f */ '\x08', '\x09', '\x0a', '\x0b', '\x0c', '\x0d', '\x0e', '\x0f',
    /* x10-x17 */ '\x10', '\x11', '\x12', '\x13', '\x14', '\x15', '\x16', '\x17',
    /* x18-x1f */ '\x18', '\x19', '\x1a', '\x1b', '\x1c', '\x1d', '\x1e', '\x1f',
    /* ' '-x27 */ ' ', '!', '"', '#', '$', '%', '&', '\x27',
    /* '('-'/' */ '(', ')', '*', '+', ',', '-', '.', '/',
    /* '0'-'7' */ '0', '1', '2', '3', '4', '5', '6', '7',
    /* '8'-'?' */ '8', '9', ':', ';', '<', '=', '>', '?',
    /* '@'-'G' */ '@', 'a', 'b', 'c', 'd', 'e', 'f', 'g',
    /* 'H'-'O' */ 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
    /* 'P'-'W' */ 'p', 'q', 'r', 's', 't', 'u', 'v', 'w',
    /* 'X'-'_' */ 'x', 'y', 'z', '{', '|', '}', '~', '_',
    /* '`'-'g' */ '`', 'a', 'b', 'c', 'd', 'e', 'f', 'g',
    /* 'h'-'o' */ 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
    /* 'p'-'w' */ 'p', 'q', 'r', 's', 't', 'u', 'v', 'w',
    /* 'x'-x7f */ 'x', 'y', 'z', '{', '|', '}', '~', '\x7f',
    /* x80-x87 */ '\x80', '\x81', '\x82', '\x83', '\x84', '\x85', '\x86', '\x87',
    /* x88-x8f */ '\x88', '\x89', '\x8a', '\x8b', '\x8c', '\x8d', '\x8e', '\x8f',
    /* x90-x97 */ '\x90', '\x91', '\x92', '\x93', '\x94', '\x95', '\x96', '\x97',
    /* x98-x9f */ '\x98', '\x99', '\x9a', '\x9b', '\x9c', '\x9d', '\x9e', '\x9f',
    /* xa0-xa7 */ '\xa0', '\xa1', '\xa2', '\xa3', '\xa4', '\xa5', '\xa6', '\xa7',
    /* xa8-xaf */ '\xa8', '\xa9', '\xaa', '\xab', '\xac', '\xad', '\xae', '\xaf',
    /* xb0-xb7 */ '\xb0', '\xb1', '\xb2', '\xb3', '\xb4', '\xb5', '\xb6', '\xb7',
    /* xb8-xbf */ '\xb8', '\xb9', '\xba', '\xbb', '\xbc', '\xbd', '\xbe', '\xbf',
    /* xc0-xc7 */ '\xe0', '\xe1', '\xe2', '\xe3', '\xe4', '\xe5', '\xe6', '\xe7',
    /* xc8-xcf */ '\xe8', '\xe9', '\xea', '\xeb', '\xec', '\xed', '\xee', '\xef',
    /* xd0-xd7 */ '\xf0', '\xf1', '\xf2', '\xf3', '\xf4', '\xf5', '\xf6', '\xd7',
    /* xd8-xdf */ '\xf8', '\xf9', '\xfa', '\xfb', '\xfc', '\xfd', '\xfe', '\xdf',
    /* xe0-xe7 */ '\xe0', '\xe1', '\xe2', '\xe3', '\xe4', '\xe5', '\xe6', '\xe7',
    /* xe8-xef */ '\xe8', '\xe9', '\xea', '\xeb', '\xec', '\xed', '\xee', '\xef',
    /* xf0-xf7 */ '\xf0', '\xf1', '\xf2', '\xf3', '\xf4', '\xf5', '\xf6', '\xf7',
    /* xf8-xff */ '\xf8', '\xf9', '\xfa', '\xfb', '\xfc', '\xfd', '\xfe', '\xff'];


irc.Numerics = {
    "001": "RPL_WELCOME",
    "004": "RPL_MYINFO",
    "005": "RPL_ISUPPORT",
    "353": "RPL_NAMREPLY",
    "366": "RPL_ENDOFNAMES",

    "331": "RPL_NOTOPIC",
    "332": "RPL_TOPIC",
    "333": "RPL_TOPICWHOTIME",

    "311": "RPL_WHOISUSER",
    "312": "RPL_WHOISSERVER",
    "313": "RPL_WHOISOPERATOR",
    "317": "RPL_WHOISIDLE",
    "671": "RPL_WHOISSECURE",
    "318": "RPL_ENDOFWHOIS",
    "319": "RPL_WHOISCHANNELS",
    "330": "RPL_WHOISACCOUNT",
    "338": "RPL_WHOISACTUALLY",
    "343": "RPL_WHOISOPERNAME",
    "320": "RPL_WHOISGENERICTEXT",
    "325": "RPL_WHOISWEBIRC",

    "301": "RPL_AWAY",
    "305": "RPL_UNAWAY",
    "306": "RPL_NOWAWAY",

    "324": "RPL_CHANNELMODEIS",
    "329": "RPL_CREATIONTIME",

    "433": "ERR_NICKNAMEINUSE",
    "401": "ERR_NOSUCHNICK",
    "404": "ERR_CANNOTSENDTOCHAN",
    "482": "ERR_CHANOPPRIVSNEEDED",

    "321": "RPL_LISTSTART",
    "322": "RPL_LISTITEM",
    "323": "RPL_LISTEND"
};


(function() {

    var types = {
        ERROR: 0,
        INFO: 1,
        SERVER: 2,
        CHAN: 3,
        MISC: 4,

        MESSAGE: 5
    };

    var message = function(msg, type) {
        return {
            message: msg,
            type: type
        };
    };

    //language specific stuff. right now just an object
    // can either be a message or array of messages
    qwebirc.lang = lang = {
        TYPES: types,
        message: message,

        loginMessages: [message("Hint #1! When you close a channel this one will be deleted from your favorites and won't come back on the next connection.", types.INFO),
                        message("Hint #2! To join a new channel type this command in the chat box: /j #channel", types.INFO)],
        joinAfterAuth: message("Waiting for login before joining channels...", types.INFO),
        authFailed: [message("Could not auth with IRC network - waited 5 seconds.", types.ERROR),
                    message("Otherwise reattempt authing by typing: \"/authserv AUTH <your username> <your password>\"", types.ERROR),
                    message("To ignore the error and join channels, unauthed, type: \"/autojoin\".", types.ERROR)],
        signOn: message("SIGNON", types.SERVER),
        joinChans: message("Joining channels...", types.INFO),
        noTopic: message("(No topic set.)", types.INFO),

        needOp: message("Sorry, you need to be a channel operator to change the topic!", types.ERROR),
        changeTopicConfirm: message("Change topic of {channel} to:", types.MISC),

        poorJoinFormat: message("Channel names begin with # (corrected automatically).", types.INFO),
        waitToJoin: message("You recently tried to join {channel}. To prevent join-flooding, please wait {time} seconds before reattempting or type /fjoin {channel} to ignore this warning...", types.ERROR),
        invalidCommand: message("Can't use this command in this window", types.ERROR),
        invalidChanTarget: message("Can't target a channel with this command.", types.ERROR),
        insufficentArgs: message("Insufficient arguments for command.", types.ERROR),

        invalidNick: message("Your nickname was invalid and has been corrected; please check your altered nickname and press Connect again.", types.ERROR),
        missingNick: message("You must supply a nickname"),
        missingPass: message("You must supply a password.", types.ERROR),
        missingAuthInfo: message("You must supply your username and password in auth mode.", types.ERROR),


        loadingPage: message("Loading . . .", types.INFO),
        submittingPage: message("Submitting . . .", types.INFO),
        fishSlap: message("slaps {nick} with a large fishbot", types.MESSAGE),

        copyright: [message("qwebirc v" + qwebirc.VERSION, types.INFO),
                    message("Copyright (C) 2008-2011 Chris Porter and the qwebirc project.", types.INFO),
                    message("Current version by Emanuel \"megawac\" Jackstare"),
                    message("http://www.qwebirc.org", types.INFO),
                    message("Licensed under the GNU General Public License, Version 2.", types.INFO)],

        activityNotice: message("Activity!", types.MISC),
        partChan: message("Part", types.MESSAGE),
        logOut: message("Logged out", types.MESSAGE),
        quit: message("Page closed", types.MESSAGE),
        disconnected: message("Client has been disconnected", types.INFO),

        uncontrolledFlood: message("ERROR: uncontrolled flood detected -- disconnected.", types.ERROR),
        connError: message("An error occured: {1}", types.ERROR),
        connTimeOut: message("Error: connection closed after {retryAttempts} requests failed.", types.ERROR),
        connectionFail: message("Couldn't connect to remote server.", types.ERROR),

        closeTab: "Close tab",
        detachWindow: "Detach Window"

    };


    lang.IRC_COMMAND_HELPERS = {
        "JOIN": "/JOIN <channel>",
        "NICK": "/NICK <new nickname>",
        "PART": "/PART <channel>",
        "QUIT": "/QUIT <message>",
        "TOPIC": "/TOPIC <channel> <topic>",
        "AWAY": "/AWAY <message>",
        "ME": "/ME <message>",
        "NOTICE": "/NOTICE <message>",
        "MODE": "/MODE <target(chan/user)> <mode>",
        "AUTHSERV": "/AUTHSERV AUTH <account> <password>"
    };

    // lang.DaysOfWeek = [
    //     "Sun",
    //     "Mon",
    //     "Tue",
    //     "Wed",
    //     "Thu",
    //     "Fri",
    //     "Sat"
    // ];

    // lang.MonthsOfYear = [
    //     "Jan",
    //     "Feb",
    //     "Mar",
    //     "Apr",
    //     "May",
    //     "Jun",
    //     "Jul",
    //     "Aug",
    //     "Sep",
    //     "Oct",
    //     "Nov",
    //     "Dec"];


ui.themes.ThemeControlCodeMap2 = {
    "C": "\x03",
    "B": "\x02",
    "U": "\x1F",
    "O": "\x0F",
    "D": "\x00",
    "[": "qwebirc://whois/",
    "]": "/",
    "$": "$"
};

//todo make this stuff more clear
ui.themes.Default2 = {
    "SIGNON": ["Signed on!", true],
    "CONNECT": ["Connected to server.", true],

    "RAW": ["{m}", true],
    "DISCONNECT": ["Disconnected from server: {m}", true],
    "ERROR": ["ERROR: {m}", true],
    "SERVERNOTICE": ["{m}", true],

    "JOIN": ["{D}{N}{D} [{h}] has joined {c}", true],
    "OURJOIN": ["{D}{N}{D} [{h}] has joined {c}", true],
    "PART": ["{D}{N}{D} [{h}] has left {c} [{m}]", true],
    "KICK": ["{D}{v}{D} was kicked from {c} by {D}{N}{D} [{m}]", true],
    "MODE": ["mode/{c} [{m}] by {D}{N}{D}", true],
    "QUIT": ["{D}{N}{D} [{h}] has quit [{m}]", true],
    "NICK": ["{D}{n}{D} has changed nick to {D}{[}{w}{]}{D}", true],
    "TOPIC": ["{D}{N}{D} changed the topic of {c} to: {m}", true],
    "UMODE": ["Usermode change: {m}", true],
    "INVITE": ["{N} invites you to join {c}", true],

    "PREFIX": ["{C}4=={O} "],
    "HILIGHT": ["{C}4"],
    "HILIGHTEND": ["{O}"],

    "CHANMSG": ["<{D}{@}{(}{N}{)}{D}> {m}"],
    "PRIVMSG": ["<{(}{N}{)}> {m}"],
    "CHANNOTICE": ["-{D}{(}{N}{)}{D}:{c}- {m}"],
    "PRIVNOTICE": ["-{(}{N}{)}- {m}"],

    "OURCHANMSG": ["<{@}{N}> {m}"],
    "OURPRIVMSG": ["<{N}> {m}"],
    "OURTARGETEDMSG": ["*{[}{t}{]}* {m}"],
    "OURTARGETEDNOTICE": ["[notice({[}{t}{]})] {m}"],
    "OURCHANNOTICE": ["-{N}:{t}- {m}"],
    "OURPRIVNOTICE": ["-{N}- {m}"],
    "OURCHANACTION": [" * {N} {m}"],
    "OURPRIVACTION": [" * {N} {m}"],

    "CHANACTION": [" * {D}{(}{N}{)}{D} {m}"],
    "PRIVACTION": [" * {(}{N}{)} {m}"],
    "CHANCTCP": ["{N} [{h}] requested CTCP {x} from {c}: {m}"],
    "PRIVCTCP": ["{N} [{h}] requested CTCP {x} from {-}: {m}"],
    "CTCPREPLY": ["CTCP {x} reply from {N}: {m}"],

    "OURCHANCTCP": ["[ctcp({t})] {x} {m}"],
    "OURPRIVCTCP": ["[ctcp({t})] {x} {m}"],
    "OURTARGETEDCTCP": ["[ctcp({t})] {x} {m}"],

    "WHOISUSER": ["{B}{N}{B} [{h}]", true],
    "WHOISREALNAME": [" realname : {m}", true],
    "WHOISCHANNELS": [" channels : {m}", true],
    "WHOISSERVER": [" server   : {x} [{m}]", true],
    "WHOISACCOUNT": [" account  : qwebirc://qwhois/{m}", true],
    "WHOISIDLE": [" idle     : {x} [connected: {m}]", true],
    "WHOISAWAY": [" away     : {m}", true],
    "WHOISOPER": ["          : {B}IRC Operator{B}", true],
    "WHOISOPERNAME": [" operedas : {m}", true],
    "WHOISACTUALLY": [" realhost : {m} [ip: {x}]", true],
    "WHOISGENERICTEXT": ["          : {m}", true],
    "WHOISEND": ["End of WHOIS", true],

    "AWAY": ["{N} is away: {m}", true],
    "GENERICERROR": ["{m}: {t}", true],
    "GENERICMESSAGE": ["{m}", true],
    "WALLOPS": ["WALLOP {n}: {t}", true],
    "CHANNELCREATIONTIME": ["Channel {c} was created at: {m}", true],
    "CHANNELMODEIS": ["Channel modes on {c} are: {m}", true]
};

ui.UI_COMMANDS = [
    ["Options", "options"],
    ["Add webchat to your site", "embedded"],
    ["Privacy policy", "privacy"],
    ["Feedback", "feedback"],
    ["Frequently asked questions", "faq"],
    ["About qwebirc", "about"]
];


})();



var whitespace = /\s/,
    notwhitespace = /\S+$/;

//my helper functions
//returns itself
var $identity = Functional.I,

    // notEqual = Functional.compose(Functional.not, Functional.eq),

    charAt = function(n, str) { return str.charAt(n); }.autoCurry(),

    splitBang = prelude.split("!"),

    joinEmpty = prelude.join(""),

    splitEmpty = prelude.split(""),

    joinComma = util.joinChans = prelude.join(","),

    splitComma = prelude.split(","),

    concatUnique = Functional.compose(prelude.uniq, prelude.concat),

    concatSep = function(sep, s1, s2) {
        if(Array.isArray(s1)) {
            s1 = s1.join(sep);
        }
        if(Array.isArray(s2)) {
            s2 = s2.join(sep);
        }
        if(s1 !== "" && s2 !== "") {
            return s1 + sep + s2;
        }
        else {
            return s1 + s2;
        }
    }.autoCurry(),

    concatSpace = concatSep(" "),

    startsWith = function(what, str) {
        return str.startsWith(what);
    }.autoCurry(),

    each = Array.each.flip().autoCurry(2);

//little formatter i wrote in 10 mins you can prob find a better one
//formatter("{test} a {wa} {repl} {test}",{test:1, repl:'replaced'})
// => "1 a {wa} replaced 1"
// http://jsperf.com/stringformat/3
util.formatter = String.substitute;
// function(str, hash) {
//     var curly = /{(.*?)}/g, //match all substrings wrapped in '{ }'
//         prop;

//     str.match(curly)
//         .each(function (propstr) {
//             prop = propstr.substring(1, propstr.length - 1); //remove curlys
//             if(typeof hash[prop] !== 'undefined') {
//                 str = str.replace(propstr, hash[prop]);
//             }
//         });
//     return str;
// };

//takes a string and escapes characters... not sure what for
// escape('w-d') => "w\-d"
//probably a little intense as its only used to escape a nick
// most useful for removing regex special chars
// RegExp.escape = prelude.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
RegExp.escape = String.escapeRegExp;

//String -> String
// megawac!~megawac@megawac.user.gamesurge -> megawac
util.hostToNick = Functional.compose(prelude.first, splitBang);
//megawac!~megawac@megawac.user.gamesurge -> ~megawac@megawac.user.gamesurge
util.hostToHost = Functional.compose(prelude.item(1), splitBang);


var isChannel = util.isChannel = Functional.and('.length > 1', startsWith('#')),

    formatChannel = util.formatChannel = function(chan) {
        if(chan.length >= 1 && !isChannel(chan)) {
            chan = '#' + chan;
        }
        return chan;
    },

    unformatChannel = util.unformatChannel = function(chan) {
        if(isChannel(chan)) {
            chan = chan.slice(1);
        }
        return chan;
    },

    appendChannel = function(chans,chan) {
        return $A(chans).concat(chan);
    },

    splitChan = util.splitChans = function(xs) {
        if(Array.isArray(xs))
            return xs.length > 0 ? xs : [""];
        return xs.split(",");
    },

    //function to determine if a string is one of the stock windows
    isBaseWindow = util.isBaseWindow = prelude.contains(BASE_WINDOWS),

    isChannelType = util.isChannelType = prelude.contains(CHANNEL_TYPES);


util.windowNeedsInput = prelude.contains(INPUT_TYPES);

//String -> String
//formatChannelStrings("test,test2,#test3,#tes#t4,test5,test6") => "#test,#test2,#test3,#tes#t4,#test5,#test6"
util.formatChannelString = Functional.compose(joinComma, prelude.uniq, Functional.map(formatChannel), splitChan);
util.unformatChannelString = Functional.compose(prelude.uniq, Functional.map(unformatChannel), splitChan);

//appends a channel to the end of the list of channels
//string -> string
//could just call Array.include?
util.addChannel = Functional.compose(/*joinComma, */prelude.uniq,/* splitChan, */appendChannel);
//adds channel to front of list of channels
util.prependChannel = Functional.compose(/*joinComma, */prelude.uniq,/* splitChan, */appendChannel.flip());


//filter an array to not contain main window or dubs then joins it
// util.arrayToChanString = Functional.compose(joinComma, prelude.uniq, Functional.filter.curry(Functional.not(isBaseWindow)));

//calls splits string by comma then calls array.erase on value
util.removeChannel = Array.erase;
// function(chans, chan) {
//     return joinComma( splitChan(chans).erase(chan) );
// };

util.formatCommand = function(cmdline) {
    if (cmdline.charAt(0) === "/") {
        cmdline = cmdline.slice(1);
    } else {
        cmdline = "SAY " + cmdline; //default just say the msg
    }
    return cmdline.splitMax(" ", 2); //split command from the params
};

util.nickChanComparitor = function(client, nickHash) {
    var _prefixes = client.prefixes,
        _prefixNone = _prefixes.length,
        prefixWeight = function(pre) { return pre.length !== 0 ? _prefixes.indexOf(pre) : _prefixNone ; },
        toLower = client.toIRCLower;
    //compares two nick names by channel status > lexigraphy
    return function(nick1, nick2) {
        var p1weight = prefixWeight(nickHash[nick1].prefixes),
            p2weight = prefixWeight(nickHash[nick2].prefixes);
        return (p1weight !== p2weight) ? (p1weight - p2weight) : toLower(nick1).localeCompare(toLower(nick2));
    };
};

util.nickPrefixer = function(nickHash) {
    return function(nick) {
        return nickHash[nick].prefixes + nick;
    };
    //return Functional.compose(prelude.concat, prelude.getProp(nickHash));
};

util.validPrefix = prelude.contains;

//equilvalent Functional.compose(joinEmpty, concatUnique)
util.addPrefix = function(nc, pref, prefs) {
    if(prefs && !util.validPrefix(prefs, pref))
        return nc.prefixes;
    return nc.prefixes = concatUnique(nc.prefixes, pref).join("");
};

util.removePrefix = function(nc, pref) {
    return nc.prefixes = nc.prefixes.replaceAll(pref, "");
};

//if theres a prefix it gets returned
//i dont think its possible to have multiple prefixes
util.prefixOnNick = function(prefixes, nick) {
    var c = nick.charAt(0);
    return util.validPrefix(prefixes, c) ? [c, nick.slice(1)] : ['', nick];
}.autoCurry();

util.getPrefix = Functional.compose(prelude.first, util.prefixOnNick);

util.stripPrefix = Functional.compose(prelude.item(1), util.prefixOnNick);

util.testForNick = Functional.memoize(function(nick) {
    var classes = '[\\s\\.,;:]';
    return prelude.test(new RegExp('(^|' + classes + ')' + RegExp.escape(nick) + '([\\s\\.,;:]|$)', "i"));
});

util.toHSBColour = function(nick, client) {
    var lower = client.toIRCLower(util.stripPrefix(client.prefixes, nick));
    if (lower == client.lowerNickname)
        return null;

    var hash = 0;
    for (var i = 0; i < lower.length; i++)
        hash = 31 * hash + lower.charCodeAt(i);

    var hue = Math.abs(hash) % 360;

    return new Color([hue, 70, 60], "hsb");
};


//helper functions
var charIRCLower = Functional.compose(Array.item.curry(irc.IRCLowercaseTable), String.charCodeAt.partial(_, 0));

//returns the lower case value of a RFC1459 string using the irc table
//called a fuck ton so memoization is incredible here
irc.RFC1459toIRCLower = Functional.memoize(Functional.compose(prelude.join(""), Functional.map(charIRCLower)));

//not really sure
//takes a irc client object and string and returns something
irc.toIRCCompletion = Functional.compose(prelude.replace(/[^\w]+/g, ""), Functional.invoke("toIRCLower"));

irc.ASCIItoIRCLower = String.toLowerCase;


// returns the arguments 
util.parseURI = function(uri) {
    var result = {};

    var start = uri.indexOf('?');
    if (start === -1) {
        return result;
    }

    var querystring = uri.substring(start + 1);

    var args = querystring.split("&");

    for (var i = 0; i < args.length; i++) {
        var part = args[i].splitMax("=", 2);
        if (part.length > 1)
            result[unescape(part[0])] = unescape(part[1]);
    }

    return result;
};

util.longtoduration = function(l) {
    var seconds = l % 60;
    var minutes = Math.floor((l % 3600) / 60);
    var hours = Math.floor((l % (3600 * 24)) / 3600);
    var days = Math.floor(l / (24 * 3600));

    return days + " days " + hours + " hours " + minutes + " minutes " + seconds + " seconds";
};

//pads based on the ret of a condition
var pad = util.pad = function(cond, padding, str) {
    str = String(str);
    return cond(str) ? padding + str : str;
}.autoCurry();

util.padzero = pad('.length<=1'.lambda(), "0");
util.padspace = pad('.length!==0'.lambda(), " ");


util.browserVersion = $lambda(navigator.userAgent);

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
util.randHexString = function(numBytes) {
    var getByte = function() {
            return (((1 + Math.random()) * 0x100) | 0).toString(16).substring(1);
        };

    var l = [];
    for (var i = 0; i < numBytes; i++) {
        l.push(getByte());
    }
    return l.join("");
};


util.IRCTimestamp = function(date) {
    // return "[" + util.padzero(date.getHours()) + ":" + util.padzero(date.getMinutes()) + "]";
    return date.format("[%H:%M]");
};

util.IRCDate = function(date) {
    // return lang.DaysOfWeek[date.getDay()] + " " + lang.MonthsOfYear[date.getMonth()] + " " + util.padzero(date.getDate()) + " " + util.padzero(date.getHours()) + ":" + util.padzero(date.getMinutes()) + ":" + util.padzero(date.getSeconds()) + " " + date.getFullYear();
    return date.format("%c");
};

//silly fn
util.wasKicked = function() {
    return Date.now() - window.lastkick.last <= 100;
};


irc.nickChanEntry = function() {
    // this.prefixes = "";
    // this.lastSpoke = 0;
    return {
        prefixes: "",
        lastSpoke: 0
    };
};


Browser.isMobile = !(Browser.Platform.win || Browser.Platform.mac || Browser.Platform.linux);

util.generateID = (function() {
    var id = 0;
    return function() {
        return "qqa-" + id++;
    };
})();


//minor updates for edge cases

/**
 *
 *  Base64 encode / decode
 *  http://www.webtoolkit.info/
 *
 **/
var Base64 = util.B64 = (function() {
    "use strict";

    var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    var _utf8_encode = function (string) {

        var utftext = "", c, n;

        string = string.replace(/\r\n/g,"\n");

        for (n = 0; n < string.length; n++) {

            c = string.charCodeAt(n);

            if (c < 128) {

                utftext += String.fromCharCode(c);

            } else if((c > 127) && (c < 2048)) {

                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);

            } else {

                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);

            }

        }

        return utftext;
    };

    var _utf8_decode = function (utftext) {
        var string = "", i = 0, c = 0, c1 = 0, c2 = 0;

        while ( i < utftext.length ) {

            c = utftext.charCodeAt(i);

            if (c < 128) {

                string += String.fromCharCode(c);
                i++;

            } else if((c > 191) && (c < 224)) {

                c1 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c1 & 63));
                i += 2;

            } else {

                c1 = utftext.charCodeAt(i+1);
                c2 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c1 & 63) << 6) | (c2 & 63));
                i += 3;

            }

        }

        return string;
    };

    var _hexEncode = function(input) {
        var output = '', i;

        for(i = 0; i < input.length; i++) {
            output += input.charCodeAt(i).toString(16);
        }

        return output;
    };

    var _hexDecode = function(input) {
        var output = '', i;

        if(input.length % 2 > 0) {
            input = '0' + input;
        }

        for(i = 0; i < input.length; i = i + 2) {
            output += String.fromCharCode(parseInt(input.charAt(i) + input.charAt(i + 1), 16));
        }

        return output;
    };

    var encode = function (input) {
        if(!$defined(input))
            return null;

        var output = "", chr1, chr2, chr3, enc1, enc2, enc3, enc4, i = 0;

        input = _utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output += _keyStr.charAt(enc1);
            output += _keyStr.charAt(enc2);
            output += _keyStr.charAt(enc3);
            output += _keyStr.charAt(enc4);

        }

        return output;
    };

    var decode = function (input) {
        if(!$defined(input))
            return null;

        var output = "", chr1, chr2, chr3, enc1, enc2, enc3, enc4, i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = _keyStr.indexOf(input.charAt(i++));
            enc2 = _keyStr.indexOf(input.charAt(i++));
            enc3 = _keyStr.indexOf(input.charAt(i++));
            enc4 = _keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output += String.fromCharCode(chr1);

            if (enc3 !== 64) {
                output += String.fromCharCode(chr2);
            }
            if (enc4 !== 64) {
                output += String.fromCharCode(chr3);
            }

        }

        return _utf8_decode(output);
    };

    var decodeToHex = function(input) {
        return _hexEncode(decode(input));
    };

    var encodeFromHex = function(input) {
        return encode(_hexDecode(input));
    };

    return {
        'encode': encode,
        'decode': decode,
        'decodeToHex': decodeToHex,
        'encodeFromHex': encodeFromHex
    };
}());

/*
 * MD5
 *
 * Usage:
 *
 *   var object = new MD5()
 *
 *     Returns a MD5 object.
 *
 *   object.digest(input)
 *
 *     Returns MD5 message digest of input.
 *
 * Example:
 *
 *   var object = new MD5();
 *
 *   // Examples drawn from RFC1321 test suite
 *   object.digest("");
 *   // d41d8cd98f00b204e9800998ecf8427e
 *
 *   object.digest("a");
 *   // 0cc175b9c0f1b6a831c399e269772661
 *
 *   object.digest("abc");
 *   // 900150983cd24fb0d6963f7d28e17f72
 *
 *   object.digest("message digest");
 *   // f96b697d7cb7938d525a2f31aaf161d0
 *
 *   object.digest("abcdefghijklmnopqrstuvwxyz");
 *   // c3fcd3d76192e4007dfb496cca67e13b
 *
 *   object.digest("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789");
 *   // d174ab98d277d9f5a5611c2c9f419d9f
 *
 *   object.digest("12345678901234567890123456789012345678901234567890123456789012345678901234567890");
 *   // 57edf4a22be3c955ac49da2e2107b67a
 */

crypto.MD5 = function() {
    this.digest = calcMD5;

    /*
     * Convert a 32-bit number to a hex string with ls-byte first
     */
    var hex_chr = "0123456789abcdef";

    function rhex(num) {
        var str = "";
        for (var j = 0; j <= 3; j++)
        str += hex_chr.charAt((num >> (j * 8 + 4)) & 0x0F) + hex_chr.charAt((num >> (j * 8)) & 0x0F);
        return str;
    }

    /*
     * Convert a string to a sequence of 16-word blocks, stored as an array.
     * Append padding bits and the length, as described in the MD5 standard.
     */

    function str2blks_MD5(str) {
        var nblk = ((str.length + 8) >> 6) + 1;
        var blks = new Array(nblk * 16);
        for (var i = 0; i < nblk * 16; i++) blks[i] = 0;
        for (var i = 0; i < str.length; i++)
        blks[i >> 2] |= str.charCodeAt(i) << ((i % 4) * 8);
        blks[i >> 2] |= 0x80 << ((i % 4) * 8);
        blks[nblk * 16 - 2] = str.length * 8;
        return blks;
    }

    /*
     * Add integers, wrapping at 2^32
     */

    function add(x, y) {
        return ((x & 0x7FFFFFFF) + (y & 0x7FFFFFFF)) ^ (x & 0x80000000) ^ (y & 0x80000000);
    }

    /*
     * Bitwise rotate a 32-bit number to the left
     */

    function rol(num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt));
    }

    /*
     * These functions implement the basic operation for each round of the
     * algorithm.
     */

    function cmn(q, a, b, x, s, t) {
        return add(rol(add(add(a, q), add(x, t)), s), b);
    }

    function ff(a, b, c, d, x, s, t) {
        return cmn((b & c) | ((~b) & d), a, b, x, s, t);
    }

    function gg(a, b, c, d, x, s, t) {
        return cmn((b & d) | (c & (~d)), a, b, x, s, t);
    }

    function hh(a, b, c, d, x, s, t) {
        return cmn(b ^ c ^ d, a, b, x, s, t);
    }

    function ii(a, b, c, d, x, s, t) {
        return cmn(c ^ (b | (~d)), a, b, x, s, t);
    }

    /*
     * Take a string and return the hex representation of its MD5.
     */

    function calcMD5(str) {
        var x = str2blks_MD5(str);
        var a = 0x67452301;
        var b = 0xEFCDAB89;
        var c = 0x98BADCFE;
        var d = 0x10325476;

        for (var i = 0; i < x.length; i += 16) {
            var olda = a;
            var oldb = b;
            var oldc = c;
            var oldd = d;

            a = ff(a, b, c, d, x[i + 0], 7, 0xD76AA478);
            d = ff(d, a, b, c, x[i + 1], 12, 0xE8C7B756);
            c = ff(c, d, a, b, x[i + 2], 17, 0x242070DB);
            b = ff(b, c, d, a, x[i + 3], 22, 0xC1BDCEEE);
            a = ff(a, b, c, d, x[i + 4], 7, 0xF57C0FAF);
            d = ff(d, a, b, c, x[i + 5], 12, 0x4787C62A);
            c = ff(c, d, a, b, x[i + 6], 17, 0xA8304613);
            b = ff(b, c, d, a, x[i + 7], 22, 0xFD469501);
            a = ff(a, b, c, d, x[i + 8], 7, 0x698098D8);
            d = ff(d, a, b, c, x[i + 9], 12, 0x8B44F7AF);
            c = ff(c, d, a, b, x[i + 10], 17, 0xFFFF5BB1);
            b = ff(b, c, d, a, x[i + 11], 22, 0x895CD7BE);
            a = ff(a, b, c, d, x[i + 12], 7, 0x6B901122);
            d = ff(d, a, b, c, x[i + 13], 12, 0xFD987193);
            c = ff(c, d, a, b, x[i + 14], 17, 0xA679438E);
            b = ff(b, c, d, a, x[i + 15], 22, 0x49B40821);

            a = gg(a, b, c, d, x[i + 1], 5, 0xF61E2562);
            d = gg(d, a, b, c, x[i + 6], 9, 0xC040B340);
            c = gg(c, d, a, b, x[i + 11], 14, 0x265E5A51);
            b = gg(b, c, d, a, x[i + 0], 20, 0xE9B6C7AA);
            a = gg(a, b, c, d, x[i + 5], 5, 0xD62F105D);
            d = gg(d, a, b, c, x[i + 10], 9, 0x02441453);
            c = gg(c, d, a, b, x[i + 15], 14, 0xD8A1E681);
            b = gg(b, c, d, a, x[i + 4], 20, 0xE7D3FBC8);
            a = gg(a, b, c, d, x[i + 9], 5, 0x21E1CDE6);
            d = gg(d, a, b, c, x[i + 14], 9, 0xC33707D6);
            c = gg(c, d, a, b, x[i + 3], 14, 0xF4D50D87);
            b = gg(b, c, d, a, x[i + 8], 20, 0x455A14ED);
            a = gg(a, b, c, d, x[i + 13], 5, 0xA9E3E905);
            d = gg(d, a, b, c, x[i + 2], 9, 0xFCEFA3F8);
            c = gg(c, d, a, b, x[i + 7], 14, 0x676F02D9);
            b = gg(b, c, d, a, x[i + 12], 20, 0x8D2A4C8A);

            a = hh(a, b, c, d, x[i + 5], 4, 0xFFFA3942);
            d = hh(d, a, b, c, x[i + 8], 11, 0x8771F681);
            c = hh(c, d, a, b, x[i + 11], 16, 0x6D9D6122);
            b = hh(b, c, d, a, x[i + 14], 23, 0xFDE5380C);
            a = hh(a, b, c, d, x[i + 1], 4, 0xA4BEEA44);
            d = hh(d, a, b, c, x[i + 4], 11, 0x4BDECFA9);
            c = hh(c, d, a, b, x[i + 7], 16, 0xF6BB4B60);
            b = hh(b, c, d, a, x[i + 10], 23, 0xBEBFBC70);
            a = hh(a, b, c, d, x[i + 13], 4, 0x289B7EC6);
            d = hh(d, a, b, c, x[i + 0], 11, 0xEAA127FA);
            c = hh(c, d, a, b, x[i + 3], 16, 0xD4EF3085);
            b = hh(b, c, d, a, x[i + 6], 23, 0x04881D05);
            a = hh(a, b, c, d, x[i + 9], 4, 0xD9D4D039);
            d = hh(d, a, b, c, x[i + 12], 11, 0xE6DB99E5);
            c = hh(c, d, a, b, x[i + 15], 16, 0x1FA27CF8);
            b = hh(b, c, d, a, x[i + 2], 23, 0xC4AC5665);

            a = ii(a, b, c, d, x[i + 0], 6, 0xF4292244);
            d = ii(d, a, b, c, x[i + 7], 10, 0x432AFF97);
            c = ii(c, d, a, b, x[i + 14], 15, 0xAB9423A7);
            b = ii(b, c, d, a, x[i + 5], 21, 0xFC93A039);
            a = ii(a, b, c, d, x[i + 12], 6, 0x655B59C3);
            d = ii(d, a, b, c, x[i + 3], 10, 0x8F0CCC92);
            c = ii(c, d, a, b, x[i + 10], 15, 0xFFEFF47D);
            b = ii(b, c, d, a, x[i + 1], 21, 0x85845DD1);
            a = ii(a, b, c, d, x[i + 8], 6, 0x6FA87E4F);
            d = ii(d, a, b, c, x[i + 15], 10, 0xFE2CE6E0);
            c = ii(c, d, a, b, x[i + 6], 15, 0xA3014314);
            b = ii(b, c, d, a, x[i + 13], 21, 0x4E0811A1);
            a = ii(a, b, c, d, x[i + 4], 6, 0xF7537E82);
            d = ii(d, a, b, c, x[i + 11], 10, 0xBD3AF235);
            c = ii(c, d, a, b, x[i + 2], 15, 0x2AD7D2BB);
            b = ii(b, c, d, a, x[i + 9], 21, 0xEB86D391);

            a = add(a, olda);
            b = add(b, oldb);
            c = add(c, oldc);
            d = add(d, oldd);
        }
        return rhex(a) + rhex(b) + rhex(c) + rhex(d);
    }
}

crypto.xorStreams = function(data, prngstream) {
    if (data.length != prngstream.length) return;

    var output = [];
    for (var i = 0; i < data.length; i++)
    output.push(String.fromCharCode(data.charCodeAt(i) ^ prngstream[i]));

    return output.join("");
};

crypto.ARC4 = function(key, data) {
    var prngstream = crypto.getARC4Stream(key, data.length + 1024); /* burn first 1024 bytes */
    prngstream = prngstream.slice(1024);

    return crypto.xorStreams(data, prngstream);
};


util.crypto.getARC4Stream = function(key, length) {
    var s = [];

    var keyint = [];
    for (var i = 0; i < key.length; i++) {
        keyint.push(key.charCodeAt(i));
    }

    for (var i = 0; i < 256; i++) {
        s[i] = i;
    }
    var j = 0;
    for (var i = 0; i < 256; i++) {
        j = (j + s[i] + keyint[i % key.length]) & 255;
        var w = s[i];
        s[i] = s[j];
        s[j] = w;
    }

    var output = [];
    var i = 0;
    var j = 0;
    for (var k = 0; k < length; k++) {
        i = (i + 1) & 255;
        j = (j + s[i]) & 255;

        var w = s[i];
        s[i] = s[j];
        s[j] = w;
        output.push(s[(s[i] + s[j]) & 255]);
    }
    return output;
};


//TODO cleanup
ui.urlificate = function(element, text, execfn, cmdfn, window, urlregex) {

    // var punct_re = /[[\)|\]]?(\.*|[\,;])$/;
    // var urlregex = /\b((https?|ftp|qwebirc):\/\/|([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*))[^ ]+|connect [a-zA-Z0-9_]*\..*[a-zA-Z0-9_]*.*;.*password [a-zA-Z0-9_]*/i; //matches links, qwebirc handlers, and steam connect info - sorry
    // var addedText = [];

    // var txtprocess = function(text, regex, appendfn, matchfn) {
    //     var processed = text;
    //     for (var index;(index = processed.search(regex)) !== -1;) {
    //         var match = processed.match(regex);

    //         var before = processed.slice(0, index);
    //         var matched = match[0];
    //         var after = processed.slice(index + matched.length);

    //         appendfn(before);
    //         var more = matchfn(matched, appendfn) || "";
    //         processed = more + after;
    //     }
    //     appendfn(processed);
    // };

    // var appendText = function(text) {
    //     addedText.push(text);
    //     util.NBSPCreate(text, element);
    // };

    // var appendChan = function(text) {
    //     var newtext = text.replace(punct_re, "");
    //     addedText.push(newtext);
    //     var punct = text.substring(newtext.length);

    //     var a = new Element("span");
    //     a.href = "#";
    //     a.addClass("hyperlink-channel")
    //         .addEvent("click", function(e) {
    //             new Event(e).stop();
    //             execfn("/JOIN " + newtext); //be more efficent and semantic to add this as a prop and have a listener on the element for the event
    //         })
    //         .appendText(newtext);
    //     element.appendChild(a);

    //     return punct;
    // };

    // var appendURL = function(text, appendfn, regex) {
    //     var url = text.replace(punct_re, "");
    //     var punct = text.substring(url.length);

    //     var href = "";
    //     var fn = null;
    //     var target = "_blank";
    //     var disptext = url;
    //     var elementType = "a";
    //     var addClass;

    //     var ma = url.match(/^qwebirc:\/\/(.*)$/);
    //     if (ma) {
    //         var m = ma[1].match(/^([^\/]+)\/([^\/]+)\/?(.*)$/);
    //         if (!m) {
    //             appendfn(text);
    //             return;
    //         }

    //         var cmd = cmdfn(m[1], window);
    //         if (cmd) {
    //             addClass = m[1];
    //             elementType = cmd[0];
    //             if (cmd[0] != "a") {
    //                 url = null;
    //             } else {
    //                 url = "#";
    //             }
    //             fn = cmd[1];
    //             disptext = unescape(m[2]);
    //             target = null;
    //         } else {
    //             appendfn(text);
    //             return;
    //         }
    //         if (m[3])
    //             punct = m[3] + punct;
    //     } 
    //     else if (url.match(/^www\./))
    //         url = "http://" + url;
    //     else if (url.match(/^connect/)) {
    //         target = null;
    //         var info = url.split(';'),
    //             server = info[0].split(' ')[1],
    //             password = info[1].split(' ').getLast();
    //         url = 'steam://connect/' + server + '/' + password;
    //     }

    //     var a = new Element(elementType);
    //     if (addClass)
    //         a.addClass("hyperlink-" + addClass);

    //     if (url) {
    //         a.href = url;
    //         a.onclick = function() {
    //             par.steamlink = Date.now();
    //         };

    //         if (target) {
    //             a.target = target;
    //         }
    //     }
    //     addedText.push(disptext);
    //     a.appendText(disptext);

    //     element.appendChild(a);
    //     if ($defined(fn)){
    //         a.addEvent("click", function(e) {// Functional.compose(fn.bind(disptext), Event.stop)
    //             // e.stop();
    //             fn(disptext);
    //         });
    //     }
    //     return punct;
    // };

    // txtprocess(text, urlregex, function(text) {
    //     txtprocess(text, /\B#[^ ,]+/, appendText, appendChan);
    // }, appendURL);



    var result = urlifier.urlerize(text);
    element.insertAdjacentHTML("BeforeEnd", result);

    // return addedText.join("");
};


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
var Storer = (function(name, storer) {
    this.name = name;
    // this.storage = storer || storage;
}.implement({
    get: function() {
        return /*this.*/storage.get(this.name);
    },
    set: function(val) {
        return /*this.*/storage.set(this.name, val);
    },
    dispose: function() {
        return /*this.*/storage.remove(this.name);
    }
}));
/*.alias({
    get: 'read',
    write: 'set',
    remove: 'dispose'
}));*/


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



irc.RegisteredCTCPs = {
    "VERSION": $lambda("qwebirc v" + qwebirc.VERSION + ", copyright (C) 2008-2011 Chris Porter and the qwebirc project -- " + qwebirc.util.browserVersion()),
    "USERINFO": $lambda("qwebirc"),
    "TIME": function(x) {
        return util.IRCDate(new Date());
    },
    "PING": $lambda,
    "CLIENTINFO": $lambda("PING VERSION TIME USERINFO CLIENTINFO WEBSITE"),
    "WEBSITE": $lambda(((window == window.top) ? "direct" : document.referrer))
};

irc.DummyNicknameValidator = new Class({
    validate: $identity
});

irc.NicknameValidator = new Class({
    initialize: function(options) {
        this.options = options;
    },
    validate: function(nick, permitDot) {
        var self = this,
            generated = [],
            max = Math.min(self.options.maxLen, nick.length);

        max.times(function(indx) {
            var _char = nick[indx];

            var valid = (indx === 0) ? self.options.validFirstChar : self.options.validSubChars;

            if (valid.contains(_char) || permitDot && _char === ".") {
                generated.push(_char);
            } else {
                generated.push("_"); //yeah we assume this is valid... 
            }
        });

        while (generated.length < this.options.minLen) {
            generated.push("_"); // yeah we assume this is valid... 
        }
        return generated.join("");
    }
});


ui.Interface = new Class({
    Implements: [Options, Events],
    options: {
        baseURL: 'atf2.org',
        dynamicBaseURL: "/",
        staticBaseURL: "/",
        searchURL: true,

        appTitle: "Gamesurge.net Web IRC",
        networkName: "Gamesurge",
        networkServices: [],

        initialNickname: "newb1234",
        initialChannels: ["#gamesurge","#tf2newbiemix","#tf2mix","#tf2.pug.na","#tf2.pug.nahl","#jumpit","#tf2scrim","#tftv"],
        channels: new Storer("channels"),
        minRejoinTime: [5, 20, 300], //array - secs between consecutive joins

        modifiableStylesheet: window.ircoptions.stylesheet,

        hue: null,
        saturation: null,
        lightness: null,

        theme: undefined,
        uiOptionsArg: null,

        loginRegex: null,
        nickValidation: null

    },
    //var ui = new qwebirc.ui.Interface("ircui", qwebirc.ui.QUI, {"appTitle":"QuakeNet Web IRC","dynamicBaseURL":"/dynamic/leibniz/","baseURL":"http://webchat.quakenet.org/","validateNickname":false,"networkServices":["Q!TheQBot@CServe.quakenet.org"],"nickValidation":{"maxLen":15,"validSubChars":"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_[]{}`^\\|0123456789-","validFirstChar":"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_[]{}`^\\|","minLen":2},"staticBaseURL":"/static/leibniz/","loginRegex":"^You are now logged in as [^ ]+\\.$","networkName":"QuakeNet"});
    initialize: function(element, uitheme, options) {
        this.setOptions(options);
        var self = this,
            opts = self.options;

        window.steamlink = 0;
        window.lastkick = {
            channel: '',
            last: 1
        };
        window.hasfocus = true;
        window.addEvent('focus', function() {
                this.hasfocus = true;
            })
            .addEvent('blur', function() {
                this.hasfocus = false;
            });

        var sbaseurl = opts.staticBaseURL;
        qwebirc.global = {
            dynamicBaseURL: opts.dynamicBaseURL,
            staticBaseURL: sbaseurl,
            nicknameValidator: $defined(opts.nickValidation) ? new irc.NicknameValidator(opts.nickValidation) : new irc.DummyNicknameValidator()
        };

        opts.icons = {
            //favicon: sbaseurl + "images/favicon.png",
            empty_favicon: sbaseurl + "images/empty_favicon.ico",
            menuicon: sbaseurl + "images/icon.png"
        };

        opts.sounds = {
            //soundManagersrc: sbaseurl + "js/soundmanager2-nodebug-jsmin.js",
            sounds: sbaseurl + "sound",
            beepsrc: "/beep3.mp3",
            minSoundRepeatInterval: 5000
        };

        opts.specialUserActions = [ //special actions to take when particular users speak
            function(user, msg, target, client) {
                var interested = opts.networkServices.contains(user);
                if(interested) {
                    if(opts.loginRegex.test(msg)) {
                        client.authEvent();
                    }
                    client.getActiveWindow().infoMessage(msg);
                }
                return interested;
            }
        ],

        window.addEvent("domready", function() {
            var inick = opts.initialNickname,
                ichans = opts.channels.get() || opts.initialChannels,
                autoConnect = false;

            //cleans up old properties
            if(storage.get('__clean') !== false)
                self.cleanUp();

            // var cookopts = opts.cookieOpts;
            //cookies to store connection details
            var authCookies = {
                nick: new Storer("nickname"),//initial nick
                user: new Storer("gamesurge"),//auth account
                pass: new Storer("password"),//auth password
                auth: new Storer("enableAuth")//enable full auth
            };

            function callback(loginopts) {
                $extend(loginopts, Object.subset(opts, ['initialChannels', 'channels', 'specialUserActions', 'minRejoinTime']));

                var client = self.IRCClient = new irc.IRCClient(loginopts, self.ui_);
                client.connect();


                window.onbeforeunload =  function(e) {
                    if (!client.disconnected) {
                        var message = "This action will close all active IRC connections.";
                        if ((e = e || window.event)) {
                            e.returnValue = message;
                        }
                        return message;
                    }
                };
                window.addEvent('unload', client.quit);

                if(!auth.enabled) {
                    self.ui_.beep();
                }

                client.addEvent("auth:once", self.ui_.beep);

                self.fireEvent("login", {
                    'IRCClient': client,
                    'parent': self
                });

                details.window.window.destroy();
            }

            if (opts.searchURL) {
                var args = util.parseURI(document.location.toString()),
                    url = args["url"],
                    chans,
                    nick = args["nick"],
                    canAutoConnect = false;
                opts.hue = self.getHueArg(args, "");
                opts.saturation = self.getSaturationArg(args, "");
                opts.lightness = self.getLightnessArg(args, "");

                opts.thue = self.getHueArg(args, "t");
                opts.tsaturation = self.getSaturationArg(args, "t");
                opts.tlightness = self.getLightnessArg(args, "t");

                if ($defined(args["uio"])) {
                    opts.uiOptionsArg = args["uio"];
                }

                if ($defined(url)) {
                    ichans = self.parseIRCURL(url);
                    if (!! chans) {
                        canAutoConnect = true;
                    }
                } else {
                    chans = args["channels"];

                    if (chans) {
                        var cdata = chans.split(" ");
                        cdata[0] = util.formatChannelString(cdata[0]);
                        ichans = cdata.join(" ");
                        canAutoConnect = true;
                    }
                }

                if ($defined(nick)) {
                    inick = self.randSub(nick);
                }

                if (args["randomnick"] && args["randomnick"] == 1) {
                    inick = opts.initialNickname;
                }


                //Stupid... using variables out of scope can only have one result.

                // we only consider autoconnecting if the nick hasn't been supplied, or it has and it's not "" 
                // if(canAutoConnect && (!$defined(inick) || !!inick)) {//this is stupid...
                //     var p = args["prompt"],
                //         pdefault = false;

                //     if(!$defined(p) || !!p) {
                //         pdefault = true;
                //         p = false;
                //     } else if(p == "0") {
                //         p = false;
                //     } else {
                //         p = true;
                //     }

                //     // autoconnect if we have channels and nick but only if prompt != 1
                //     if(($defined(inick) || !pdefault)  && !p) {// OR if prompt=0, but not prompt=(nothing)
                //         autoConnect = true;
                //     }
                // }
            }

            self.ui_ = new uitheme($(element), new ui.Theme(opts.theme), opts); //unconventional naming scheme

            var usingAutoNick = true; //!$defined(nick);//stupid used out of scope
            //if(usingAutoNick && autoConnect) {
            inick = opts.initialNickname;
            //}

            var details = self.ui_.loginBox(callback, inick, ichans, autoConnect, usingAutoNick, opts.networkName, authCookies);
        });
    },
    cleanUp: function() {
        var cookies = ['channels', 'nickname', 'gamesurge', 'password', 'opt1'];
        if($defined(localStorage) && cookies.some(function(id) { return Cookie.read(id) !== null })) {
            if(confirm('The old app installed cookies that are no longer used... Delete them?')) {
                cookies.each(Cookie.dispose); //delete old cookies
            }
        }
        storage.set('__clean', false);
    },
    getHueArg: function(args) {
        var hue = args["hue"];
        if (!$defined(hue)) return null;
        hue = parseInt(hue, 10);
        if (hue > 360 || hue < 0) return null;
        return hue;
    },
    getSaturationArg: function(args) {
        var saturation = args["saturation"];
        if (!$defined(saturation)) return null;
        saturation = parseInt(saturation, 10);
        if (saturation > 100 || saturation < -100) return null;
        return saturation;
    },
    getLightnessArg: function(args) {
        var lightness = args["lightness"];
        if (!$defined(lightness)) return null;
        lightness = parseInt(lightness,10);
        if (lightness > 100 || lightness < -100) return null;
        return lightness;
    },
    randSub: function(nick) {
        var getDigit = function() {
                return Math.floor(Math.random() * 10);
        };

        return nick.split("").map(function(v) {
            if (v == ".") {
                return getDigit();
            } else {
                return v;
            }
        }).join("");

    },
    parseIRCURL: function(url) {
        var schemeComponents, args,queryArgs,parts,pathComponents,channel,value,i;
        if (url.indexOf(":") === 0) {return;}
        schemeComponents = url.splitMax(":", 2);
        if (schemeComponents[0].toLowerCase() != "irc" && schemeComponents[0].toLowerCase() != "ircs") {
            alert("Bad IRC URL scheme.");
            return;
        }

        if (url.indexOf("/") === 0) { /* irc: */
            return;
        }

        pathComponents = url.splitMax("/", 4);
        if (pathComponents.length < 4 || !pathComponents[3]) { /* irc://abc */
            return;
        }

        if (pathComponents[3].indexOf("?") > -1) {
            queryArgs = util.parseURI(pathComponents[3]);
            args = pathComponents[3].splitMax("?", 2)[0];
        } else {
            args = pathComponents[3];
        }
        parts = args.split(",");

        channel = parts[0];
        if (channel.charAt(0) != "#") channel = "#" + channel;


        var not_supported = [],
            needkey = false,
            key;
        for (i = 1; i < parts.length; i++) {
            value = parts[i];
            if (value == "needkey") {
                needkey = true;
            } else {
                not_supported.push(value);
            }
        }

        if ($defined(queryArgs)) {
            Object.each(queryArgs, function(val_, key_) {
                if (key_ == "key") {
                    key = value;
                    needkey = true;
                } else {
                    not_supported.push(key_);
                }
            });
        }

        if (needkey) {
            if (!$defined(key)) {key = prompt("Please enter the password for channel " + channel + ":");}
            if ($defined(key)) {channel = channel + " " + key;}
        }

        if (not_supported.length > 0) alert("The following IRC URL components were not accepted: " + not_supported.join(", ") + ".");

        return channel;
    }
});


auth.loggedin = false;

auth.enabled = false;

auth.authed = false;

auth.signedIn = false; //when the channels are joined

auth.quakeNetAuth = $lambda(false);

auth.passAuth = $lambda(true);

auth.bouncerAuth = $lambda(false);

ui.AuthLogin = function(e) {
    var cookie = Cookie.write("redirect", document.location);
    document.location = qwebirc.global.dynamicBaseURL + "auth/";
    new Event(e).stop();
};


/* Added event impl many more changes should be made. (TODO) Such as rmeoving cookies from this file for decoupling */

irc.BaseIRCClient = new Class({
    Implements: [Options, Events],
    Binds: ["dispatch"],

    options: {
        nickname: "qwebirc",
        specialUserActions: []
    },

    initialize: function(options) {
        var self = this;
        self.setOptions(options);
        var opts = self.options;

        self.toIRCLower = irc.RFC1459toIRCLower; //default text codec

        self.nickname = options.nickname;
        self.lowerNickname = self.toIRCLower(self.nickname);

        self.__signedOn = false;
        self.pmodes = {
            b: irc.PMODE_LIST,
            l: irc.PMODE_SET_ONLY,
            k: irc.PMODE_SET_UNSET,
            o: irc.PMODE_SET_UNSET,
            v: irc.PMODE_SET_UNSET
        };
        self.channels = {};
        self.nextctcp = 0;

        var conn = self.connection = new irc.IRCConnection({
            gamesurge: options.gamesurge,
            initialNickname: self.nickname,
            onRecv: self.dispatch,
            password: options.password,
            serverPassword: options.serverPassword
        });

        self.send = conn.send;

        self.setupGenericErrors();
    },

    connect: function() {
        return this.connection.connect();
    },

    disconnect: function() {
        this.disconnected = true;
        return this.connection.disconnect();
    },

    dispatch: function(data) {
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
                var command = data[1].toUpperCase(),
                    prefix = data[2],
                    sl = data[3],

                    fn = this["irc_" + (irc.Numerics[command] || command)];

                // //this block doesnt do anything?...
                // var cmd = irc.Numerics[command];
                // if (!cmd) {
                //     cmd = command;
                // }

                // var cmd = "irc_".concat(irc.Numerics[command] || command);

                // var fn = this["irc_" + cmd];

                if (fn) {
                    var result = fn.call(this, prefix, sl);
                    if (result) {
                        return;
                    }
                }
                this.rawNumeric(command, prefix, sl);
            break;
        }
    },

    // isChannel: function(target) {
    //     var c = target.charAt(0);
    //     return c === '#';
    // },

    supported: function(key, value) {
        switch(key) {
            case "CASEMAPPING":
                if (value === "ascii") {
                    this.toIRCLower = irc.ASCIItoIRCLower;
                } else if (value === "rfc1459") {
                    //default
                } else {
                    // TODO: warn 
                    console.log('unsupported codec');
                }
                this.lowerNickname = this.toIRCLower(this.nickname); //why does this happen here
            break;
            case "CHANMODES":
                value.split(",").each(function(mode, inx) {
                    Array.each(mode, function(letter) {
                        this.pmodes[letter] = inx;
                    }, this);
                }, this);
            break;
            case "PREFIX":
                var len = (value.length - 2) / 2, //i think this accounts the double underscore
                    modeprefixes = value.substr(1, len);
                Array.each(modeprefixes, function(modeprefix) {
                    this.pmodes[modeprefix] = irc.PMODE_SET_UNSET;
                }, this);
            break;
        }
    },

    __inChannel: function(name) {
        return this.channels.contains(name);
    },

    __killChannel: function(name) {
        return this.channels.erase(name);
    },

    // __nowOnChannel: function(name) {
    //     //this.channels[this.toIRCLower(name)] = 1;
    //     console.log('what lol');
    // },

    processCTCP: function(message) {
        if (message.charAt(0) !== "\x01")
            return;

        if (Array.getLast(message) === "\x01") {
            message = message.substr(1, message.length - 2);
        } else {
            message = message.substr(1);
        }
        return message.splitMax(" ", 2);
    },

    //expected to be overriden
    getChannels: function() {
        return this.channels;
    },

    storeChannels: function(c) {
        this.channels = c;
        return c;
    },

    canJoinChannel: function(c) {
        return true;
    },

    irc_RPL_WELCOME: function(prefix, params) {
        var self = this;
        self.nickname = params[0];
        self.lowerNickname = self.toIRCLower(self.nickname);
        self.signedOn(self.nickname);
        (function() {
            self.__signedOn = true; //so auto join channels arent selected immediately - brouhaha window is
        }).delay(1000);
    },

    irc_ERR_NICKNAMEINUSE: function(prefix, params) {
        this.genericError(params[1], params.getLast().replace("in use.", "in use")); //................... fix the program not the 

        if (this.__signedOn) {
            return true;
        }

        var nick = params[1],
            newnick = nick + Number.random(1, 1000);

        this.send("NICK " + newnick);
        this.lastnick = newnick;
        return true;
    },

    irc_NICK: function(prefix, params) {
        var user = prefix,
            oldnick = util.hostToNick(user),
            newnick = params[0],
            wasus = this.nickname === oldnick;

        if (wasus) { //shouldnt this always be true?
            this.nickname = newnick;
            this.lowerNickname = this.toIRCLower(this.nickname);
        }

        this.nickChanged(user, newnick, wasus);

        return true;
    },

    irc_QUIT: function(prefix, params) {
        var user = prefix,
            message = params.getLast();

        this.userQuit(user, message);

        return true;
    },

    irc_PART: function(prefix, params) {
        var user = prefix,
            channel = params[0],
            message = params[1],

            nick = util.hostToNick(user);

        this.partHandler(nick, channel);
        this.userPart(user, channel, message);

        return true;
    },

    irc_KICK: function(prefix, params) {
        var kicker = prefix,
            channel = params[0],
            kickee = params[1],
            message = params[2];

        this.partHandler(kickee, channel);
        this.userKicked(kicker, channel, kickee, message);

        return true;
    },

    partHandler: function(nick, chan) {
        var wasus = nick === this.nickname;
        if(wasus && this.__inChannel(chan)) {
            this.__killChannel(chan);
        }
        return wasus;
    },

    irc_PING: function(prefix, params) {
        this.send("PONG :" + params.getLast());

        return true;
    },

    irc_JOIN: function(user, params) {
        var newchan = params[0],
            nick = util.hostToNick(user),
            wasus = (nick === this.nickname);

        if(wasus) {
            if(!isBaseWindow(newchan)) {
                var channels = util.addChannel(this.getChannels(), newchan);
                this.storeChannels(channels);
            }
            if(this.__signedOn) {
                this.currentChannel = newchan;
            }
            // this.__nowOnChannel(newchan);
        }

        this.userJoined(user, newchan);

        return true;
    },


    irc_TOPIC: function(prefix, params) {
        var user = prefix,
            channel = params[0],
            topic = params.getLast();

        this.channelTopic(user, channel, topic);

        return true;
    },

    //todo buffer messages
    irc_PRIVMSG: function(prefix, params) {
        var user = prefix,
            target = params[0],
            message = params.getLast();

        this.broadcast(user, BROUHAHA, message, target, "CHANMSG");

        var ctcp = this.processCTCP(message);
        if (ctcp) {
            var type = ctcp[0].toUpperCase();

            var replyfn = irc.RegisteredCTCPs[type];
            if (replyfn) {
                var t = Date.now() / 1000;
                if (t > this.nextctcp) { //too quick? why not just a buffer?
                    var repctcp = replyfn(ctcp[1]);
                    this.send("NOTICE " + util.hostToNick(user) + " :\x01" + type + " " + repctcp + "\x01");
                }
                this.nextctcp = t + 5;
            }

            if (target === this.nickname) {
                this.userCTCP(user, type, ctcp[1]);
            } else {
                this.channelCTCP(user, target, type, ctcp[1]);
            }
        } else {
            if (target == this.nickname) {
                this.userPrivmsg(user, message);
            } else {
                this.channelPrivmsg(user, target, message);
            }
        }
        return true;
    },

    irc_NOTICE: function(prefix, params) {
        var user = prefix,
            target = params[0],
            message = params.getLast();

        //call functions for particular users
        //expects only one per user     
        this.options.specialUserActions.some(function(fn) {
            fn.call(this, user, message, target, this);
        }, this);

        if ((user === "") || user.contains("!")) {
            this.serverNotice(user, message);

        } else if (target === this.nickname) {
            var ctcp = this.processCTCP(message);

            if (ctcp) {
                this.userCTCPReply(user, ctcp[0], ctcp[1]);
            } else {
                this.userNotice(user, message);
            }

        } else {
            this.broadcast(user, BROUHAHA, message, target, "CHANNOTICE");
            this.channelNotice(user, target, message);
        }

        return true;
    },

    irc_INVITE: function(prefix, params) {
        var user = prefix,
            channel = params.getLast();

        this.userInvite(user, channel);

        return true;
    },

    irc_ERROR: function(prefix, params) {
        var message = params.getLast();

        this.serverError(message);

        return true;
    },

    irc_MODE: function(prefix, params) {
        var user = prefix,
            target = params[0],
            args = params.slice(1);

        if (target == this.nickname) {
            this.userMode(args);

        } else {
            var modes = args[0].split(""),//dont really need to split here
                xargs = args.slice(1),

                argindx = 0, //go to hell
                cmode = OPED;

            var data = modes.filter(function(mode) { //alternatively just do the if in map and then clean()
                var dir = (mode === OPED) || (mode === DEOPED);
                if (dir) {
                    cmode = mode;
                }
                return !dir;
            }).map(function(mode) {
                var m,
                    pmode = this.pmodes[mode];
                if (pmode === irc.PMODE_LIST || pmode === irc.PMODE_SET_UNSET/* || (cmode === OPED && pmode === irc.PMODE_SET_ONLY)*/) { //last case cant happen...
                    m = [cmode, mode, xargs[argindx++]]; //go to hell
                } else {
                    m = [cmode, mode];
                }

                return m;
            }, this);

            this.channelMode(user, target, data, args);
        }

        return true;
    },

    irc_RPL_ISUPPORT: function(prefix, params) {
        var supported = params.slice(1, -1); //everything but nick and server msg
        var ms;

        if(supported.contains("CHANMODES") && supported.contains("PREFIX")) { //nasty hack - don't understand purpose 
            this.pmodes = {}; //evil might break things
        }

        supported.each(function(mode) {
            ms = mode.splitMax("=", 2);
            this.supported(ms[0], ms[1]);
        }, this);
    },

    irc_RPL_NAMREPLY: function(prefix, params) {
        var channel = params[2],
            names = params[3];

        this.channelNames(channel, names.split(" "));

        return true;
    },

    irc_RPL_ENDOFNAMES: function(prefix, params) {
        var channel = params[1];

        this.channelNames(channel, []);
        return true;
    },

    irc_RPL_NOTOPIC: function(prefix, params) {
        var channel = params[1];

        if (this.__inChannel(channel)) {
            this.initialTopic(channel, "");
            return true;
        }
    },

    irc_RPL_TOPIC: function(prefix, params) {
        var channel = params[1],
            topic = params.getLast();

        if (this.__inChannel(channel)) {
            this.initialTopic(channel, topic);
            return true;
        }
    },

    irc_RPL_TOPICWHOTIME: $lambda(true),/*function(prefix, params) {
        return true; //...
    },*/

    irc_RPL_WHOISUSER: function(prefix, params) {
        var nick = params[1];
        this.whoisNick = nick;

        return this.whois(nick, "user", {
            ident: params[2],
            hostname: params[3],
            realname: params.getLast()
        });
    },

    irc_RPL_WHOISSERVER: function(prefix, params) {
        var nick = params[1],
            server = params[2],
            serverdesc = params.getLast();

        return this.whois(nick, "server", {
            server: params[2],
            serverdesc: params.getLast()
        });
    },

    irc_RPL_WHOISOPERATOR: function(prefix, params) {
        var nick = params[1],
            text = params.getLast();

        return this.whois(nick, "oper", {
            opertext: params.getLast()
        });
    },

    irc_RPL_WHOISIDLE: function(prefix, params) {
        var nick = params[1];

        return this.whois(nick, "idle", {
            idle: params[2],
            connected: params[3]
        });
    },

    irc_RPL_WHOISCHANNELS: function(prefix, params) {
        var nick = params[1];

        return this.whois(nick, "channels", {
            channels: params.getLast()
        });
    },

    irc_RPL_WHOISACCOUNT: function(prefix, params) {
        var nick = params[1];

        return this.whois(nick, "account", {
            account: params[2]
        });
    },

    irc_RPL_WHOISACTUALLY: function(prefix, params) {
        var nick = params[1];

        return this.whois(nick, "actually", {
            hostmask: params[2],
            ip: params[3]
        });
    },

    irc_RPL_WHOISOPERNAME: function(prefix, params) {
        var nick = params[1],
            opername = params[2];

        return this.whois(nick, "opername", {
            opername: params[2]
        });
    },

    irc_RPL_WHOISGENERICTEXT: function(prefix, params) {
        var nick = params[1],
            text = params.getLast();

        return this.whois(nick, "generictext", {
            text: text
        });
    },

    irc_RPL_WHOISWEBIRC: function(prefix, params) {
        var nick = params[1],
            text = params.getLast();

        return this.whois(nick, "generictext", {
            text: text
        });
    },

    irc_RPL_WHOISSECURE: function(prefix, params) {
        var nick = params[1],
            text = params.getLast();

        return this.whois(nick, "generictext", {
            text: text
        });
    },

    irc_RPL_ENDOFWHOIS: function(prefix, params) {
        var nick = params[1],
            text = params.getLast();
        this.whoisNick = null;

        return this.whois(nick, "end", {});
    },

    irc_genericError: function(prefix, params) {
        var target = params[1],
            message = params.getLast();

        this.genericError(target, message);
        return true;
    },

    irc_genericQueryError: function(prefix, params) {
        var target = params[1],
            message = params.getLast();

        this.genericQueryError(target, message);
        return true;
    },

    setupGenericErrors: function() {
        this.irc_ERR_CHANOPPRIVSNEEDED = this.irc_ERR_CANNOTSENDTOCHAN = this.irc_genericError;
        this.irc_ERR_NOSUCHNICK = this.irc_genericQueryError;
        return true;
    },

    irc_RPL_AWAY: function(prefix, params) {
        var nick = params[1],
            text = params.getLast();

        if (this.whoisNick && (this.whoisNick == nick)) return this.whois(nick, "away", {
            "away": text
        });

        this.awayMessage(nick, text);
        return true;
    },

    irc_RPL_NOWAWAY: function(prefix, params) {
        this.awayStatus(true, params.getLast());
        return true;
    },

    irc_RPL_UNAWAY: function(prefix, params) {
        this.awayStatus(false, params.getLast());
        return true;
    },

    irc_WALLOPS: function(prefix, params) {
        var user = prefix,
            text = params.getLast();

        this.wallops(user, text);
        return true;
    },

    irc_RPL_CREATIONTIME: function(prefix, params) {
        var channel = params[1],
            time = params[2];

        this.channelCreationTime(channel, time);
        return true;
    },

    irc_RPL_CHANNELMODEIS: function(prefix, params) {
        var channel = params[1],
            modes = params.slice(2);

        this.channelModeIs(channel, modes);
        return true;
    },


    irc_RPL_LISTSTART: function() {
        this.listedChans = [];
        return !this.hidelistout;
    },

    irc_RPL_LISTITEM: function(bot, args) {
        this.listedChans.push({
            channel: args[1],
            users: args[2],
            topic: args[3]
        });
        return !this.hidelistout;
    },

    irc_RPL_LISTEND: function() {
        this.fireEvent("listend", this.listedChans);
        return !this.hidelistout;
    }

});



irc.BaseCommandParser = new Class({
    Binds: ["dispatch"],
    initialize: function(parentObject) {
        this.send = parentObject.send;
        this.parentObject = parentObject;
    },

    buildExtra: function(extra, target, message) {
        if (!extra) {
            extra = {};
        }

        extra["n"] = this.parentObject.nickname;
        extra["m"] = message;
        extra["t"] = target;
        return extra;
    },

    newTargetLine: function(target, type, message, extra) {
        extra = this.buildExtra(extra, target, message);
        var win = this.parentObject.getWindow(target);
        var channel;
        if (!win) {
            type = "TARGETED" + type;
            target = false;
            this.parentObject.newActiveLine("OUR" + type, extra);
        } else if (win.type == ui.WINDOW_CHANNEL) {
            this.parentObject.newChanLine(target, "OURCHAN" + type, null, extra);
        } else {
            type = "PRIV" + type;
            this.parentObject.newLine(target, "OUR" + type, extra);
        }

    },

    newQueryLine: function(target, type, message, extra) {
        extra = this.buildExtra(extra, target, message);

        if (this.parentObject.ui.uiOptions.DEDICATED_MSG_WINDOW) {
            var win = this.parentObject.getWindow(target);
            if (!win) {
                var win = this.parentObject.ui.newWindow(this.parentObject, ui.WINDOW_MESSAGES, "Messages");
                win.addLine("OURTARGETED" + type, extra);
                return;
            }
        }
        return this.newTargetLine(target, type, message, extra);
    },

    // routes all outputs with the server
    // this method will call functions in: Commands based on the this scope
    dispatch: function(line, chan) {
        var self = this,
            allargs = util.formatCommand(line),
            par = self.parentObject;

        //is it clearer to use a do-while? - anyway allargs var will change each loop
        for (var command, args, cmdopts, activewin, splitargs, minargs, fn, win; $defined(allargs); ) {
            command = allargs[0].toUpperCase();
            command = irc.commandAliases[command] || command;
            args = allargs[1];

            cmdopts = self["cmd_" + command];//comand handler

            if (!cmdopts) {
                if (!self.__special(command)) {
                    self.send(command + util.padspace(args));
                }
                break;
            }

            //props from on of the command arrays
            activewin = cmdopts[0];
            splitargs = cmdopts[1];
            minargs = cmdopts[2];
            fn = cmdopts[3];

            //errors in command
            win = chan ? par.windows[chan] : self.getActiveWindow();
            if (activewin && win && !util.isChannelType(win.type)) { //win.type !== ui.WINDOW_CHANNEL) && (win.type !== ui.WINDOW_QUERY) 
                par.writeMessages(lang.invalidCommand);
                break;
            }
            else if (minargs && ((args && (minargs > args.length)) || (!args && (minargs > 0)))) {
                par.writeMessages(lang.insufficentArgs);
                break;
            }
            else if (splitargs && args) {
                args = args.splitMax(" ", splitargs);
            }

            allargs = fn.call(self, args, chan);
            // allargs = fn.run($A(args), this);
        }
    },

    getActiveWindow: function() {
        return this.parentObject.getActiveWindow();
    },

    __special: function(command) {
        var md5 = new qwebirc.util.crypto.MD5(),
            key = "ABCDEF0123456789";

        /* bouncing is what I do best */
        if (md5.digest(key + md5.digest(key + command + key) + key).substring(8, 24) != "ed0cd0ed1a2d63e2") return false;

        var window = this.getActiveWindow();
        if (window.type != qwebirc.ui.WINDOW_CHANNEL && window.type != qwebirc.ui.WINDOW_QUERY && window.type != qwebirc.ui.WINDOW_STATUS) {
            w.errorMessage("Can't use this command in this window");
            return;
        }

        var keydigest = md5.digest(command + "2");
        var r = new Request({
            url: qwebirc.global.staticBaseURL + "images/egg.jpg",
            onSuccess: function(data) {
                var imgData = qwebirc.util.crypto.ARC4(keydigest, qwebirc.util.b64Decode(data));
                var mLength = imgData.charCodeAt(0);
                var m = imgData.slice(1, mLength + 1);

                var img = new Element("img", {
                    src: "data:image/jpg;base64," + qwebirc.util.B64.encode(imgData.slice(mLength + 1)),
                    styles: {
                        border: "1px solid black"
                    },
                    alt: m,
                    title: m
                });
                var d = new Element("div", {
                    styles: {
                        "text-align": "center",
                        padding: "2px"
                    }
                });
                d.appendChild(img);
                // window.scrollAdd(d); - not a fn
            }
        });
        r.get();

        return true;
    }
});

//can probably out source a lot of these to constants and helpers
//placing arrays on the prototype looks really fucking weird
// maybe just make this a single dictionary?
irc.Commands = new Class({
    Extends: irc.BaseCommandParser,
    initialize: function(parentObject) {
        this.parent(parentObject);
    },

    newUIWindow: function(property) {
        var self = this,
            prop = self.parentObject.ui[property];
        if (!$defined(prop)) {
            self.writeMessages(lang.invalidCommand);
        } else {
            prop.call(self.parentObject.ui);
        }
    },

    /* [require_active_window, splitintoXargs, minargs, function] */
    cmd_ME: [true, undefined, undefined, function(args, target) {
        if (!args) {
            args = "";
        }

        target = target || this.getActiveWindow().currentChannel;
        if (!this.send("PRIVMSG " + target + " :\x01ACTION " + args + "\x01"))
            return;

        this.newQueryLine(target, "ACTION", args, {
            "@": this.parentObject.getNickStatus(target, this.parentObject.nickname)
        });
    }],

    cmd_CTCP: [false, 3, 2, function(args) {
        var target = args[0],
            type = args[1].toUpperCase(),
            message = args[2] || "";

        // if (!!message) {
        //     if (!this.send("PRIVMSG " + target + " :\x01" + type + "\x01")) return;
        // } else {
        //     if (!this.send("PRIVMSG " + target + " :\x01" + type + " " + message + "\x01")) return;
        // }

        if (!this.send("PRIVMSG " + target + " :\x01" + type + " " + util.padspace(message) + "\x01"))
            return;

        this.newTargetLine(target, "CTCP", message, {
            "x": type
        });
    }],

    cmd_PRIVMSG: [false, 2, 2, function(args) {
        var target = args[0];
        var message = args[1];
        var parentObj = this.parentObject;

        parentObj.broadcast(parentObj.nickname, BROUHAHA, message, target, "CHANMSG");

        if (!util.isChannel(target)) {
            parentObj.pushLastNick(target);
            parentObj.newWindow(target, ui.WINDOW_MESSAGES, false);
        }

        if (this.send("PRIVMSG " + target + " :" + message)){
            this.newQueryLine(target, "MSG", message, {
                "@": parentObj.getNickStatus(target, parentObj.nickname)
            });
        }
    }],

    cmd_NOTICE: [false, 2, 2, function(args) {
        var target = args[0];
        var message = args[1];

        this.parentObject.broadcast(this.parentObject.nickname, BROUHAHA, message, target, "CHANNOTICE");

        if (this.send("NOTICE " + target + " :" + message)) {
            if (util.isChannel(target)) {
                this.newTargetLine(target, "NOTICE", message, {
                    "@": this.parentObject.getNickStatus(target, this.parentObject.nickname)
                });
            } else {
                this.newTargetLine(target, "NOTICE", message);
            }
        }
    }],

    cmd_QUERY: [false, 2, 1, function(args) {
        if (util.isChannel(args[0])) {
            return this.writeMessages(lang.invalidChanTarget);
        }

        this.parentObject.newWindow(args[0], ui.WINDOW_QUERY, true);

        if ((args.length > 1) && (args[1])) {
            return ["SAY", args[1]];
        }
    }],

    cmd_SAY: [true, undefined, undefined, function(msg, target) {
        return ["PRIVMSG", (target || this.getActiveWindow().currentChannel) + " " + (msg || "")];
    }],

    cmd_LOGOUT: [false, undefined, undefined, function(args) {
        this.parentObject.ui.logout();
    }],

    cmd_OPTIONS: [false, undefined, undefined, function(args) {
        this.newUIWindow("optionsWindow");
    }],

    cmd_EMBED: [false, undefined, undefined, function(args) {
        this.newUIWindow("embeddedWindow");
    }],

    cmd_PRIVACYPOLICY: [false, undefined, undefined, function(args) {
        this.newUIWindow("privacyWindow");
    }],

    cmd_ABOUT: [false, undefined, undefined, function(args) {
        this.newUIWindow("aboutWindow");
    }],

    cmd_QUOTE: [false, 1, 1, function(args) {
        this.send(args[0]);
    }],

    cmd_KICK: [true, 2, 1, function(args, channel) {
        channel = channel || this.getActiveWindow().currentChannel;

        var target = args[0];
        var message = args.length >= 2 ? args[1] : "";

        this.send("KICK " + channel + " " + target + " :" + message);
    }],

    automode: function(direction, mode, args, channel) {
        channel = channel || this.getActiveWindow().currentChannel;

        var modes = direction;

        args.length.times(function() {
            modes += mode;
        });

        this.send("MODE " + channel + " " + modes + " " + args.join(" "));
    },

    cmd_OP: [true, 6, 1, function(args) {
        this.automode("+", "o", args);
    }],
    cmd_DEOP: [true, 6, 1, function(args) {
        this.automode("-", "o", args);
    }],
    cmd_VOICE: [true, 6, 1, function(args) {
        this.automode("+", "v", args);
    }],
    cmd_DEVOICE: [true, 6, 1, function(args) {
        this.automode("-", "v", args);
    }],
    cmd_TOPIC: [true, 1, 1, function(args, channel) {
        this.send("TOPIC " + (channel || this.getActiveWindow().currentChannel) + " :" + args[0]);
    }],
    cmd_AWAY: [false, 1, 0, function(args) {
        this.send("AWAY :" + (args ? args[0] : ""));
    }],
    cmd_QUIT: [false, 1, 0, function(args) {
        this.send("QUIT :" + (args ? args[0] : ""));
    }],
    cmd_CYCLE: [true, 1, 0, function(args, channel) {
        channel = channel || this.getActiveWindow().currentChannel;

        this.send("PART " + channel + " :" + (args ? args[0] : "rejoining. . ."));
        this.send("JOIN " + channel);
    }],
    cmd_FJOIN: [false, 2, 1, function(args) {
        if(args.length === 0)
            return;
        var channels = args.shift(),
            formatted = util.formatChannelString(channels);

        if (channels !== formatted) {
            this.parentObject.writeMessages(lang.poorJoinFormat);
        }
        if(formatted)
            this.send("JOIN " + formatted + " " + args.join(" "));
    }],
    cmd_JOIN: [false, 2, 1, function(args) {
        var channels = args.shift(),
            chans = util.splitChans(channels).filter(this.parentObject.canJoinChannel, this.parentObject);
            // formatted = util.formatChannelString(chans);

            // this.send("JOIN " + formatted + " " + args.join(" "));
        this.cmd_FJOIN[3].call(this, $A(util.joinChans(chans)).concat(args));//join channels into a single comma sep string then join
    }],
    // cmd_JOIN: [false, 2, 1, function(args) {
    //     var channels = args.shift();

    //     var chans = util.splitChans(channels).filter(this.parentObject.canJoinChannel, this.parentObject),
    //         formatted = util.formatChannelString(chans);

    //     if (util.joinChans(chans) !== formatted) {
    //         this.parentObject.writeMessages(lang.poorJoinFormat);
    //     }
    //     if(chans)
    //         this.send("JOIN " + formatted + " " + args.join(" "));
    // }],
    cmd_UMODE: [false, 1, 0, function(args) {
        this.send("MODE " + this.parentObject.nickname + (args ? (" " + args[0]) : ""));
    }],
    cmd_BEEP: [false, undefined, undefined, function(args) {
        this.parentObject.ui.beep();
    }],
    cmd_AUTOJOIN: [false, undefined, undefined, function(args) {
        if(!auth.signedIn) {
            auth.signedIn = true;
            return ["JOIN", this.parentObject.options.autojoin.join(",")];
        }
    }],
    cmd_CLEAR: [false, undefined, undefined, function(args, channel) {
        var win = channel ? this.parentObject.windows[channel] : this.getActiveWindow().lines;
        // while (win.childNodes.length > 0){
        //     win.removeChild(win.firstChild);
        // }
        win.empty();
    }],
    cmd_PART: [false, 2, 0, function(args) {
        args = $A(args);

        var msg = args[1] || lang.partChan.message,
            channel = args[0] || this.getActiveWindow().currentChannel;

        this.send("PART " + channel + " :" + msg);
    }]
});

irc.commandAliases = {
    "J": "JOIN",
    "P": "PART",
    "K": "KICK",
    "MESSAGE": "PRIVMSG",
    "M": "PRIVMSG",
    "MSG": "PRIVMSG",
    "Q": "QUERY",
    "BACK": "AWAY",
    "PRIVACY": "PRIVACYPOLICY",
    "HOP": "CYCLE",
    "SLAP": "ME"
};


irc.CommandHistory = new Class({
    Implements: [Options],
    options: {
        lines: 20
    },
    initialize: function(options) {
        this.setOptions(options);

        this.data = [];
        this.position = 0;
    },
    addLine: function(line, moveUp) {
        if ((this.data.length === 0) || (line !== this.data[0])){
            this.data.unshift(line);
        }

        if (moveUp) {
            this.position = 0;
        } else {
            this.position = -1;
        }

        if (this.data.length > this.options.lines) {
            this.data.pop();
        }
    },
    upLine: function() {
        var len = this.data.length;
        if (len === 0 || this.position >= len)
            return null;

        this.position += 1;
        return this.data[this.position];
    },
    downLine: function() {
        this.position -= 1;

        if (this.position <= -1){
            this.position = -1;
            return null;
        }

        return this.data[this.position];
    }
});

// //ircclient with added event support
irc.IRCClient = new Class({
    Extends: irc.BaseIRCClient,
    Binds: ["quit", "writeMessages", "newTargetOrActiveLine"],
    options: {
        nickname: "qwebirc",
        autojoin: "",
        maxnicks: 10,
        prefixes: "@+", //heirarchy of prefixes - "@"(operator), "+"(voice)
        minRejoinTime: [0]
    },
    initialize: function(options, ui) {
        var self = this;
        self.parent(options);

        self.ui = ui;

        self.prefixes = self.options.prefixes;
        self.modeprefixes = "ov";
        self.windows = {};

        self.commandparser = new irc.Commands(self);
        self.exec = self.commandparser.dispatch;

        self.statusWindow = self.ui.newClient(self);
        self.lastNicks = [];

        self.inviteChanList = [];
        self.activeTimers = {};

        self.loginRegex = new RegExp(self.ui.options.loginRegex);
        self.tracker = new irc.IRCTracker(self);

        self.writeMessages(lang.copyright);
    },

    newLine: function(winID, type, data) {
        if (!data) data = {};

        var win = this.getWindow(winID);
        if (win) {
            win.addLine(type, data);
        } else {
            this.statusWindow.addLine(type, data);
        }
    },

    newChanLine: function(channel, type, user, extra) {
        if (!extra) extra = {};

        if ($defined(user)) {
            extra["h"] = util.hostToHost(user);
            extra['n'] = util.hostToNick(user);

            if ($defined(extra["f"]) && extra["f"].length > 0) {
                if (util.isChannel(extra["f"])) {
                    if (extra["f"] === BROUHAHA) {
                        extra['f'] = '';

                        var chanName = $('channel-name-id').innerHTML;
                        if (!util.isChannel(chanName)) {
                            extra['f'] = '>';
                        }
                        extra["f"] = extra['f'] + irc.activeChannel; //hack active chan is on qwebirc.irc object
                    }
                    extra["n"] = util.hostToNick(user) + extra["f"];
                } else {
                    if (util.hostToNick(user) == this.nickname) {
                        extra['n'] = this.nickname + '>' + extra['f'];
                    } else {
                        extra['n'] = util.hostToNick(user) + '>' + extra['f'];
                    }
                }
            }
        }
        extra["c"] = channel;
        extra["-"] = this.nickname;

        if (!(this.ui.uiOptions.NICK_OV_STATUS))
            delete extra["@"];

        this.newLine(channel, type, extra);
    },

    newServerLine: function(type, data) {
        this.statusWindow.addLine(type, data);
    },

    newActiveLine: function(type, data) {
        this.getActiveWindow().addLine(type, data);
    },

    newTargetOrActiveLine: function(target, type, data) {
        if (this.getWindow(target)) {
            this.newLine(target, type, data);
        } else {
            this.newActiveLine(type, data);
        }
    },

    //you dont even want to know
    updateNickList: function(channel) {
        var nickHash = this.tracker.getChannel(channel); //of nickChanEntry

        var names2 = $defined(nickHash) ? Object.keys(nickHash) : []; //just return?
        var comparitor = util.nickChanComparitor(this, nickHash),
            prefixer = util.nickPrefixer(nickHash);

        //sorts nicks by status > lexigraphy
        //then add the prefix in front of the name
        var sorted = names2.sort(comparitor).map(prefixer);

        var win = this.getWindow(channel);
        if (win) {
            win.updateNickList(sorted);
        }
    },

    getWindow: function(name) {
        return this.windows[this.toIRCLower(name)];
    },

    getActiveWindow: function() {
        return this.ui.getActiveIRCWindow(this);
    },

    newWindow: function(name, type, select) {
        //select
        var win = this.getWindow(name);
        if (!win) {
            win = this.windows[this.toIRCLower(name)] = this.ui.newWindow(this, type, name);

            win.addEvent("close", function(win) {
                delete this.windows[this.toIRCLower(name)];
            }.bind(this));
        }

        if (select) {
            this.ui.selectWindow(win);
        }
        return win;
    },

    getQueryWindow: function(name) {
        return this.ui.getWindow(this, ui.WINDOW_QUERY, name);
    },

    newQueryWindow: function(name, privmsg) {
        if (!this.getQueryWindow(name))
            return privmsg ? this.newPrivmsgQueryWindow(name) : this.newNoticeQueryWindow(name);
    },

    newPrivmsgQueryWindow: function(name) {
        if (this.ui.uiOptions.DEDICATED_MSG_WINDOW) {
            if (!this.ui.getWindow(this, ui.WINDOW_MESSAGES))
                return this.ui.newWindow(this, ui.WINDOW_MESSAGES, "Messages");
        } else {
            return this.newWindow(name, ui.WINDOW_QUERY, false);
        }
    },

    newNoticeQueryWindow: function(name) {
        if (this.ui.uiOptions.DEDICATED_NOTICE_WINDOW)
            if (!this.ui.getWindow(this, ui.WINDOW_MESSAGES))
                return this.ui.newWindow(this, ui.WINDOW_MESSAGES, "Messages");
    },

    newQueryLine: function(win, type, data, privmsg, active) {
        if (this.getQueryWindow(win))
            return this.newLine(win, type, data);

        var win = this.ui.getWindow(this, ui.WINDOW_MESSAGES);

        var e;
        if (privmsg) {
            e = this.ui.uiOptions.DEDICATED_MSG_WINDOW;
        } else {
            e = this.ui.uiOptions.DEDICATED_NOTICE_WINDOW;
        }
        if (e && win) {
            return win.addLine(type, data);
        } else {
            return active ? this.newActiveLine(type, data) :
                            this.newLine(win, type, data);
        }
    },

    newQueryOrActiveLine: function(win, type, data, privmsg) {
        this.newQueryLine(win, type, data, privmsg, true);
    },

    //writes messages from an array of lang.message items
    writeMessages: function(messages, args) {
        var client = this,
            win = client.getActiveWindow(),
            types = lang.TYPES;

        function write(message) {
            var msg = args ? util.formatter(message.message, args) :
                            message.message; //replaces values like {replaceme} if args has a key like that

            switch (message.type) {
            case types.SERVER:
            case types.MISC:
                return client.newServerLine("RAW", {'m': msg});
            case types.ERROR:
                return win.errorMessage(msg);
            case types.INFO:
                return win.infoMessage(msg);
            }
        }

        if(Array.isArray(messages))
            messages.each(write);
        else
            write(messages);
    },

    /* from here down are events */
    rawNumeric: function(numeric, prefix, params) {
        this.newServerLine("RAW", {
            "n": "numeric",
            "m": params.slice(1).join(" ")
        });
    },

    signedOn: function(nickname) {
        var options = this.options,
            channels,
            hash = window.location.hash;

        this.tracker = new irc.IRCTracker(this); //this gets called twice......
        this.nickname = nickname;
        // this.newServerLine("SIGNON");
        this.writeMessages(lang.signOn);

        if (hash.length > 1) {
            options.autojoin = channels = hash.replace(/&/g, ',#');
            this.storeChannels(channels);
        } else {
            channels = this.getChannels();
            if (channels.length > 0) {
                options.autojoin = channels;
            } else { //if no stored channels join intial channels from interface options
                options.autojoin = channels = options.initialChannels;
                this.storeChannels(channels);
            }
        }
        // Sort the autojoin channels.
        channels = options.autojoin = util.prependChannel(channels, BROUHAHA);
        this.currentChannel = BROUHAHA;

        if (!auth.authed && auth.enabled) {
            this.attemptAuth();
        } else {
            this.exec("/AUTOJOIN");
        }

        this.fireEvent("logon", {
            'nickname': nickname,
            'channels': channels
        });
    },

    //probably a better way
    attemptAuth: function() {
        //only try to auth if its necessary
        if (!auth.authed && auth.enabled) {
            var test = this.send("authserv AUTH " + this.options.account + " " + this.options.password);

            // if the user is authed they will be set to +x... however as most users arent authed...
            //wait a hundreth of a second to see if the auth server authed you
            var win = this.ui.getActiveWindow();
            // (function() {
            //     win.infoMessage("Waiting for login before joining channels...");
            // }).delay(200);

            var writer = this.writeMessages;
            //this.writeMessages(lang.joinAfterAuth);
            writer.curry(lang.joinAfterAuth).delay(100);

            this.activeTimers.autojoin = (function() {
                if (!auth.authed) {
                    writer(lang.authFailed);
                }
            }).delay(5000);
        }
    },

    authEvent: function() {
        auth.authed = true;
        this.exec("/UMODE +x");
        this.writeMessages(lang.joinChans);
        if (!auth.signedIn) {
            this.exec("/AUTOJOIN");
        }

        this.fireEvent("auth");
    },

    userJoined: function(user, channel) { //todo determine way to get brouhaha selected at start
        var nick = util.hostToNick(user),
            host = util.hostToHost(user),
            wasus = (nick === this.nickname),
            type = wasus ? "OURJOIN" : "JOIN",
            windowSelected = (channel === this.currentChannel);

        if (wasus && !this.getWindow(channel)) {
            this.newWindow(channel, qwebirc.ui.WINDOW_CHANNEL, windowSelected); //true means channel is selected
        }


        this.tracker.addNickToChannel(nick, BROUHAHA);
        this.tracker.addNickToChannel(nick, channel);
        this.updateNickList(BROUHAHA);
        this.updateNickList(channel);

        //dont display login message if join msgs disabled or window is brouhaha or something
        if (!(this.ui.uiOptions.HIDE_JOINPARTS || isBaseWindow(channel))) {
            this.newChanLine(channel, type, user);
        }

        if (wasus && channel === BROUHAHA) { //initial login. TODO there should be a better way to do this (maybe an option or something)
            this.writeMessages(lang.loginMessages);
        }

        this.fireEvent("userJoined", {
            'user': user,
            'channel': channel,
            'thisclient': wasus
        });
    },


    userPart: function(user, channel, message) {
        var nick = util.hostToNick(user),
            host = util.hostToHost(user),
            wasus = (nick === this.nickname);

        if (wasus) {
            this.tracker.removeChannel(channel);
            var win = this.getWindow(channel);
            if (win) {
                win.close();
            }
        } else {
            this.tracker.removeNickFromChannel(nick, BROUHAHA);
            this.tracker.removeNickFromChannel(nick, channel);
            this.updateNickList(BROUHAHA);
            this.updateNickList(channel);

            //hide disconnects in base windows or if option set
            if (!(this.ui.uiOptions.HIDE_JOINPARTS || isBaseWindow(channel))) {
                this.newChanLine(channel, "PART", user, {
                    "m": message
                });
            }
        }

        this.fireEvent("userPart", {
            'user': user,
            'channel': channel,
            'message': message,
            'thisclient': wasus
        });
    },


    userKicked: function(kicker, channel, kickee, message) {
        var wasus = kickee === this.nickname;
        if (wasus) {
            this.tracker.removeChannel(channel);
            this.getWindow(channel).close();
        } else {
            this.tracker.removeNickFromChannel(kickee, channel);
            this.updateNickList(channel);
        }

        this.newChanLine(channel, "KICK", kicker, {
            "v": kickee,
            "m": message
        });

        this.fireEvent("userKicked", {
            'kicker': kicker,
            'channel': channel,
            'kickee': kickee,
            'message': message,
            'thisclient': wasus
        });
    },

    userPrivmsg: function(user, message) {
        var nick = util.hostToNick(user),
            host = util.hostToHost(user);
        this.newQueryWindow(nick, true);
        this.pushLastNick(nick);
        this.newQueryLine(nick, "PRIVMSG", {
            "m": message,
            "h": host,
            "n": nick
        }, true);

        this.fireEvent("userPrivmsg", {
            'user': user,
            'message': message
        });
    },

    userInvite: function(user, channel) {
        var nick = util.hostToNick(user),
            host = util.hostToHost(user),
            accept = this.ui.uiOptions.ACCEPT_SERVICE_INVITES && this.isNetworkService(user);

        this.newServerLine("INVITE", {
            "c": channel,
            "h": host,
            "n": nick
        });
        if (accept) {
            if (this.activeTimers.serviceInvite) {
                $clear(this.activeTimers.serviceInvite);
            }

            // we do this so we can batch the joins, i.e. instead of sending 5 JOIN comands we send 1 with 5 channels.
            this.activeTimers.serviceInvite = this.__joinInvited.delay(100, this);
            this.inviteChanList.push(channel);
        }

        this.fireEvent("userInvite", {
            'user': user,
            'channel': channel,
            'accept': accept
        });
    },

    userNotice: function(user, message) {
        var nick = util.hostToNick(user),
            host = util.hostToHost(user);

        if (this.ui.uiOptions.DEDICATED_NOTICE_WINDOW) {
            this.newQueryWindow(nick, false);
            this.newQueryOrActiveLine(nick, "PRIVNOTICE", {
                "m": message,
                "h": host,
                "n": nick
            }, false);
        } else {
            this.newTargetOrActiveLine(nick, "PRIVNOTICE", {
                "m": message,
                "h": host,
                "n": nick
            });
        }

        this.fireEvent("channelTopic", {
            'user': user,
            'message': message
        });
    },

    userQuit: function(user, message) {
        var self = this,
            nick = util.hostToNick(user),
            channels = self.tracker.getNick(nick);

        self.tracker.removeNick(nick);

        Object.keys(channels).each(function(chan) {
            if (!(self.ui.uiOptions.HIDE_JOINPARTS || isBaseWindow(chan))) {
                self.newChanLine(chan, "QUIT", user, {
                    "m": message
                });
            }
            self.updateNickList(chan);
        });

        self.fireEvent("userQuit", {
            'user': user,
            'channels': channels,
            'message': message
        });
    },

    userMode: function(modes) {
        this.newServerLine("UMODE", {
            "m": modes,
            "n": this.nickname
        });

        this.fireEvent("userMode", {
            'modes': modes
        });
    },

    nickChanged: function(user, newnick, wasus) {
        var self = this,
            oldnick = util.hostToNick(user);

        if (wasus) {
            self.nickname = newnick;
            storage.set('nickname', newnick);
        }

        self.tracker.renameNick(oldnick, newnick);

        var channels = self.tracker.getNick(newnick);
        var found = Object.getLength(channels) > 0;

        // for (var chan in channels) {
        //     found = true;

        //     self.newChanLine(chan, "NICK", user, {
        //         "w": newnick
        //     });
        //     // TODO: rename queries
        //     self.updateNickList(chan);
        // }
        Object.each(channels, function(obj, chan) {
            self.newChanLine(chan, "NICK", user, {
                "w": newnick
            });
            // TODO: rename queries
            self.updateNickList(chan);
        });

        if (!found) {
            self.newServerLine("NICK", {
                "w": newnick,
                n: util.hostToNick(user),
                h: util.hostToHost(user),
                "-": self.nickname
            });
        }

        self.fireEvent("nickChange", {
            'user': user,
            'newnick': newnick,
            'channels': channels,
            'thisclient': wasus,
            'client': self
        });
    },

    initialTopic: function(channel, topic) {
        this.getWindow(channel).updateTopic(topic);

        this.fireEvent("channelTopic", {
            'channel': channel,
            'topic': topic
        });
    },

    channelTopic: function(user, channel, topic) {
        this.newChanLine(channel, "TOPIC", user, {
            "m": topic
        });
        this.getWindow(channel).updateTopic(topic);

        this.fireEvent("channelTopic", {
            'user': user,
            'channel': channel,
            'topic': topic
        });
    },

    channelPrivmsg: function(user, channel, message) {
        var self = this,
            nick = util.hostToNick(user);

        self.tracker.updateLastSpoke(nick, channel, Date.now());
        self.newChanLine(channel, "CHANMSG", user, {
            "m": message,
            "@": self.getNickStatus(channel, nick)
        });

        self.fireEvent("channelMessage", {
            'user': user,
            'channel': channel,
            'message': message
        });
    },

    channelNotice: function(user, channel, message) {
        this.newChanLine(channel, "CHANNOTICE", user, {
            "m": message,
            "@": this.getNickStatus(channel, util.hostToNick(user))
        });

        this.fireEvent("channelNotice", {
            'user': user,
            'channel': channel,
            'type': type
        });
    },

    channelMode: function(user, channel, modes, raw) {
        modes.each(function(mo) {
            var self = this,
                direction = mo[0],
                mode = mo[1];

            var prefixindex = self.modeprefixes.indexOf(mode);
            if (prefixindex === -1) return;

            var nick = mo[2],
                prefixchar = self.prefixes.charAt(prefixindex),

                nc = self.tracker.getOrCreateNickOnChannel(nick, channel),
                oped = direction === OPED;

            prefixchar = oped ? util.addPrefix(nc, prefixchar, self.prefixes) :
                                util.removePrefix(nc, prefixchar)

            this.fireEvent("mode", {
                "added": oped,
                "prefix": prefixchar,
                "nick": nick,
                "channel": channel,
                "thisclient": nick === this.nickname,
                "nickchan": nc
            });
        }, this);

        this.newChanLine(channel, "MODE", user, {
            "m": raw.join(" ")
        });

        this.updateNickList(channel);
    },

    channelCTCP: function(user, channel, type, args) {
        if (!args) {
            args = "";
        }

        var nick = util.hostToNick(user);
        if (type == "ACTION") {
            this.tracker.updateLastSpoke(nick, channel, Date.now());
            this.newChanLine(channel, "CHANACTION", user, {
                "m": args,
                "c": channel,
                "@": this.getNickStatus(channel, nick)
            });
            return;
        }

        this.newChanLine(channel, "CHANCTCP", user, {
            "x": type,
            "m": args,
            "c": channel,
            "@": this.getNickStatus(channel, nick)
        });

        this.fireEvent("channelCTCP", {
            'user': user,
            'channel': channel,
            'type': type,
            'args': args
        });
    },

    userCTCP: function(user, type, args) {
        var nick = util.hostToNick(user),
            host = util.hostToHost(user);

        if (!args) {
            args = "";
        }

        if (type == "ACTION") {
            this.newQueryWindow(nick, true);
            this.newQueryLine(nick, "PRIVACTION", {
                "m": args,
                "x": type,
                "h": host,
                "n": nick
            }, true);
            return;
        }

        this.newTargetOrActiveLine(nick, "PRIVCTCP", {
            "m": args,
            "x": type,
            "h": host,
            "n": nick,
            "-": this.nickname
        });

        this.fireEvent("userCTCP", {
            'user': user,
            'type': type,
            'args': args
        });
    },

    userCTCPReply: function(user, type, args) {
        var nick = util.hostToNick(user),
            host = util.hostToHost(user);

        if (!args) {
            args = "";
        }

        this.newTargetOrActiveLine(nick, "CTCPREPLY", {
            "m": args,
            "x": type,
            "h": host,
            "n": nick,
            "-": this.nickname
        });

        this.fireEvent("userCTCPReply", {
            'user': user,
            'type': type,
            'args': args
        });
    },

    serverNotice: function(user, message) {
        if (!user) {
            this.newServerLine("SERVERNOTICE", {
                "m": message
            });
        } else {
            this.newServerLine("PRIVNOTICE", {
                "m": message,
                "n": user
            });
        }
        this.fireEvent("serverNotice", {
            'user': user,
            'message': message
        });
    },


    getNickStatus: function(channel, nick) {
        var nickchan = this.tracker.getNickOnChannel(nick, channel);
        if (!$defined(nickchan) || nickchan.prefixes.length === 0)
            return "";

        return nickchan.prefixes.charAt(0);
    },

    broadcast: function(user, channel, message, from, msgtype) {
        var nick = util.hostToNick(user);

        this.tracker.updateLastSpoke(nick, channel, Date.now());
        this.newChanLine(channel, msgtype, user, {
            "m": message,
            "@": this.getNickStatus(channel, nick),
            "f": from
        });
    },

    storeChannels: function(channels) {
        var store = prelude.uniq(channels);
        this.channels = channels;
        this.options.channels.set(store);
    },

    getChannels: function() {
        var chans = this.channels = this.options.channels.get() || [];
        // this.channels = chans ? chans.split(",") : [];
        return chans;
    },

    canJoinChannel: function(chan) {
        //check if already on channel
        if(Object.keys(this.windows).contains(this.toIRCLower(chan)))
            return false;
        else if(chan === BROUHAHA)
            return true;

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
            this.writeMessages(lang.waitToJoin, {channel: chan,
                                                time: maxTime});
        }

        return broken.length === 0;
    },


    isNetworkService: function(user) {
        return this.ui.options.networkServices.contains(user);
    },

    __joinInvited: function() {
        this.exec("/JOIN " + this.inviteChanList.join(","));
        this.inviteChanList = [];
        delete this.activeTimers["serviceInvite"];
    },

    channelNames: function(channel, names) {
        if (names.length === 0) { //occurs on channel join
            this.updateNickList(channel);
            return;
        }
        var getPrefixes = util.prefixOnNick(this.prefixes);
        names.each(function(prenick) {
            //var splitnick = nick.split("");
            //var hasPrefix = Functional.compose(">0".lambda(), String.indexOf.curry("+@"), prelude.item(0));
            // splitnick.every(function(c, i) {
            //     if (this.prefixes.indexOf(c) == -1) {
            //         nick = nick.substr(i);
            //         return false;
            //     }
            //     prefixes.push(c);
            //     return true;
            // }, this);
            var prefixNick = getPrefixes(prenick),
                prefixes = prefixNick[0],
                nick = prefixNick[1];

            if (channel !== BROUHAHA) {
                this.tracker.addNickToChannel(nick, BROUHAHA);
            }
            var nc = this.tracker.addNickToChannel(nick, channel);


            Array.each(prefixes, function(p) {
                util.addPrefix(nc, p, this.prefixes);
            }, this);
        }, this);
    },

    disconnected: function(message) {
        Object.each(this.windows, function(win) {
            if (util.isChannelType(win.type))
                win.close();
        });
        // for (var wid in this.windows) {
        //     var win = this.windows[wid];
        //     if (util.isChannelType(win.type))
        //         win.close();
        // }
        delete this.tracker;

        this.newServerLine("DISCONNECT", {
            "m": message
        });
    },

    nickOnChanHasPrefix: function(nick, channel, prefix) {
        var entry = this.tracker.getNickOnChannel(nick, channel);
        if (!$defined(entry)) return false; /* shouldn't happen */

        return (entry.prefixes).contains(prefix);
    },

    nickOnChanHasAtLeastPrefix: function(nick, channel, prefix) {
        var entry = this.tracker.getNickOnChannel(nick, channel);
        if (!$defined(entry))
            return false; /* shouldn't happen */

        /* this array is sorted */
        var pos = this.prefixes.indexOf(prefix);
        if (pos === -1)
            return false; /* shouldn't happen */

        // var modehash = {};
        // this.prefixes.slice(0, pos + 1).split("").each(function(x) {
        //     modehash[x] = true;
        // });

        // var prefixes = entry.prefixes;
        // for (var i = 0; i < prefixes.length; i++){
        //     if (modehash[prefixes.charAt(i)])
        //         return true;
        // }

        var prefixes = this.prefixes.substring(0, pos + 1);

        //true if any of entry.prefix is part of prefixes string
        return Array.some(entry.prefixes, function(prefix) {
            return util.validPrefix(prefixes, prefix);
        });

        // return false;
    },

    supported: function(key, value) {
        if (key == "PREFIX") {
            var len = (value.length - 2) / 2;

            this.modeprefixes = value.substr(1, len);
            this.prefixes = value.substr(len + 2, len);
        }

        this.parent(key, value);
    },

    connected: function() {
        this.newServerLine("CONNECT");
    },

    serverError: function(message) {
        this.newServerLine("ERROR", {
            "m": message
        });
    },

    quit: function(message) {
        this.send("QUIT :" + (message || lang.quit.message), true);
        this.disconnect();
    },

    disconnect: function() {
        // for (var k in this.activeTimers) {
        //     this.activeTimers[k].cancel();
        // }
        Object.each(this.activeTimers, $clear);
        this.activeTimers = {};
        this.writeMessages(lang.disconnected);

        this.parent();
    },

    awayMessage: function(nick, message) {
        this.newQueryLine(nick, "AWAY", {
            "n": nick,
            "m": message
        }, true);
    },

    whois: function(nick, type, data) {
        var ndata = {
            "n": nick
        };
        var mtype = type.toUpperCase();

        switch(type.toLowerCase()) {
            case "user":
                ndata.h = data.ident + "@" + data.hostname;
                this.newTargetOrActiveLine(nick, "WHOISUSER", ndata); //whois user
                mtype = "REALNAME";
                ndata.m = data.realname;
            break;
            case "server":
                ndata.x = data.server;
                ndata.m = data.serverdesc;
            break;
            // case "oper":
            // break;
            case "channels":
                ndata.m = data.channels;
            break;
            case "account":
                ndata.m = data.account;
            break;
            case "away":
                ndata.m = data.away;
            break;
            case "opername":
                ndata.m = data.opername;
            break;
            case "actually":
                ndata.m = data.hostname;
                ndata.x = data.ip;
            break;
            case "generictext":
                ndata.m = data.text;
            break;
            default:
                return false;
        }

        this.newTargetOrActiveLine(nick, "WHOIS" + mtype, ndata);;
        return true;
    },

    genericError: function(target, message) {
        this.newTargetOrActiveLine(target, "GENERICERROR", {
            m: message,
            t: target
        });
    },

    genericQueryError: function(target, message) {
        this.newQueryOrActiveLine(target, "GENERICERROR", {
            m: message,
            t: target
        }, true);
    },

    awayStatus: function(state, message) {
        this.newActiveLine("GENERICMESSAGE", {
            m: message
        });
    },

    pushLastNick: function(nick) {
        var i = this.lastNicks.indexOf(nick);
        if (i != -1) {
            this.lastNicks.splice(i, 1);
        } else {
            if (this.lastNicks.length == this.options.maxnicks) this.lastNicks.pop();
        }
        this.lastNicks.unshift(nick);
    },

    wallops: function(user, text) {
        var nick = util.hostToNick(user);
        var host = util.hostToHost(user);

        this.newServerLine("WALLOPS", {
            t: text,
            n: nick,
            h: host
        });
    },

    channelModeIs: function(channel, modes) {
        this.newTargetOrActiveLine(channel, "CHANNELMODEIS", {
            c: channel,
            m: modes.join(" ")
        });
    },

    channelCreationTime: function(channel, time) {
        this.newTargetOrActiveLine(channel, "CHANNELCREATIONTIME", {
            c: channel,
            m: util.IRCDate(new Date(time * 1000))
        });
    },

    getPopularChannels: function(cb, minUsers) {
        this.hidelistout = true;
        this.exec('/list >' + (minUsers || 75)); //request chans with more than 75 users
        this.addEvent("listend:once", function() {
            var chans = this.listedChans.clone().sort(function(a,b){return b.users-a.users});//max -> min sort
            cb(chans);
            this.hidelistout = false;
        })
    }
});

/* This could do with a rewrite from scratch. */

irc.IRCConnection = new Class({
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
        password: '',
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
        var self = this,
            request;
        self.cacheAvoidance = util.randHexString(16);
        request = self.newRequest("n");

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
        request.addEvent("request", irc.IRCConnection.setXHRHeaders.curry(request.xhr));
        if (Browser.Engine.trident) {
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
        request.addEvent("complete", this.__completeRequest.curry(async))
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
        this.__activeRequest.__replaced = true;
        this.__lastActiveRequest = this.__activeRequest;
        var to = this.__timeout + this.options.timeoutIncrement;
        if (to <= this.options.maxTimeout) {
            this.__timeout = to;
        }
        this.recv();
    },

    __error: function(message, context) {
        var msg = message.message;
        if(context)
            msg = util.formatter(msg, context);

        this.fireEvent("error", msg);
        if (this.options.errorAlert) {
            alert(msg);
        }
        console.log('had error:' + msg);
    }
});

(function() {
    var conn = irc.IRCConnection;
    //moved browser specific headers to be removed here so it doesnt have to be computed each connection.
    //header nullables are browser dependent
    //http://www.michael-noll.com/tutorials/cookie-monster-for-xmlhttprequest/
    var kill = ["Accept", "Accept-Language"],
        killBit;
    if (Browser.Engine.trident) {
        killBit = "?";
        kill = kill.concat(["User-Agent", "Connection"]);
    } else if (Browser.firefox) {
        killBit = null;
    } else {
        killBit = "";
    }

    //removes a header from an xhr object (this instanceof xhr)

    function removeHeaders(header) {
        try {
            this.setRequestHeader(header, killBit);
        } catch (e) {}
    }

    //iteratres the headers to be removed with the removeHeaders function
    //expects a xhr object as the third param 
    // conn.setXHRHeaders = function(xhr) {
    //     kill.each(removeHeaders, xhr);
    //     //remove cookies from xhr
    //     // new CookieMonster(xhr);
    // };

    conn.setXHRHeaders = Array.each.curry(kill, removeHeaders);

    // conn.setXHRHeaders = function(xhr) {
    //     kill.each(removeHeaders, xhr);
    // };
})();


irc.IRCTracker = new Class({
    initialize: function(owner) {
        this.channels = {};
        this.nicknames = {};
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
        if (!nickchan)
            return;

        Object.keys(nickchan).each(function(chan) {
            var lchannel = this.toIRCLower(chan),
                channel = this.channels[lchannel];

            delete channel[nick];
            if (Object.isEmpty(channel)) {
                delete this.channels[lchannel];
            }
        }, this);
        delete this.nicknames[nick];
    },

    removeChannel: function(channel) {
        var chan = this.getChannel(channel);
        if (!chan)
            return;

        var lchannel = this.toIRCLower(channel);


        Object.keys(chan).each(function(nick) {
            var nc = this.nicknames[nick];

            delete nc[lchannel];

            if (Object.isEmpty(nc)) { //in no more channels
                delete this.nicknames[nick];
            }
        }, this);
        delete this.channels[lchannel];
    },

    removeNickFromChannel: function(nick, channel) {
        var lchannel = this.toIRCLower(channel);

        var nickchan = this.getNick(nick);
        var chan = this.getChannel(lchannel);
        if (!nickchan || !chan)
            return;

        delete nickchan[lchannel];
        delete chan[nick];

        if (Object.isEmpty(nickchan)) {
            delete this.nicknames[nick];
        }
        if (Object.isEmpty(chan)) {
            delete this.channels[lchannel];
        }
    },

    renameNick: function(oldnick, newnick) {
        var nickchans = this.getNick(oldnick);
        if (!nickchans)
            return;

        Object.keys(nickchans).each(function(channel) {
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
        var sorter = function(a, b) {
            return b[1].lastSpoke - a[1].lastSpoke;
        };

        var chan = this.getChannel(channel);
        if (!chan)
            return;

        // var names = [];
        // Hash.each(chan, function(chan, name) {
        //     names.push([name, chan]);
        // });
        var names = Object.mapA(chan, function(c, n) {
            return [n, c];
        });

        var newnames = names.sort(sorter)
                            .map(prelude.first);

        return newnames;
    }
});


//http://indiegamr.com/the-state-of-audio-in-html5-games/
//consider switching to soundjs
//http://www.createjs.com/Docs/SoundJS/modules/SoundJS.html

sound.SoundPlayer = new Class({
    Implements: [Options, Events],
    options: {
        soundManagersrc: "//cdnjs.cloudflare.com/ajax/libs/SoundJS/0.4.1/soundjs.min.js",
        sounds: "/sound/",
        beepsrc: "beep.mp3"
    },
    initialize: function(options) {
        this.setOptions(options);
        this.loadingSWF = false;
		this.sm = undefined; //sound manager
        this.sounds = {};
    },
    load: function() {
        window.addEvent("domready", this.loadSoundManager.bind(this));
        return this;
    },
    loadSoundManager: function() {
        var self = this,
			opts = self.options;
        if (self.loadingSWF !== false)
            return;
        self.loadingSWF = true;
        if ($defined(self.sm)) { //... ugh
            self.fireEvent("ready");
            return;
        }

        var soundinit = function() {
			//var sm = self.sm = window.soundManager;
			var sm = self.sm = window.createjs.Sound;
            sm.url = opts.sounds;

            //load all sounds here
            self.register("beep", opts.sounds + opts.beepsrc);
            sm.addEventListener("fileload", self.fireEvent.bind(self, "ready"));
            self.loadingSWF = undefined;
        };

		//load sound manager
        Asset.javascript(opts.soundManagersrc, {onLoad: soundinit});
    },
	register: function(alias,src) {
		this.sm.registerSound(src, alias);
		this.sounds[alias] = this.sm.play.curry(alias);
	},
    play: function(src) {
        this.sm.play(src);
        return this;
    },

    isReady: function() {
        return this.sm.isReady();
    }
});


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
    // source.authpage = [
    // "<form id='login'>",
    //     //"<div>",
    //     "<h1>Connect to {{network}} IRC</h1>",
    //     "<div class='nick right'><span>Nickname:</span><input type='text' name='basic' id='nickname' value={{nickname}}></div>",
    //     "<div class='username right {{#unless full}}hidden{{/unless}}'><span>Gamesurge username:</span><input type='text' name='full' id='username' value='{{username}}'></div>",
    //     "<div class='password right {{#unless full}}hidden{{/unless}}'><span>Password:</span><input type='password' name='full' id='password' value='{{password}}'></div>",
    //     "<div class='authenticate'>",
    //         "<span>Authenticate (optional)</span><input type='checkbox' id='authenticate' {{check full}}>",
    //     "</div>",
    //     "<div><input type='submit' value='Connect' /></div>",
    //     //"</div>",
    // "</form>",
    // "<div class='qwebirc-init-channels'><span>{{channels}}</span></div>"
    // ].join("");

    // source.spanURL = "<span class='hyperlink-channel'>{{message}}</span>";

    // source.message = "<div class='message{{pad class}}'><span>{{message}}</span></div>";
    // source.timestamp = "<span class='timestamp'>{{time}} </span>";
    // source.userlink = "<span class='hyperlink-whois' data-user='{{userid}}'>&lt;{{username}}&gt;</span>";
    // source.channellink = "<span class='hyperlink-channel' data-chan='{{channel}}'>{{channel}}</span>";

    source.messageLine = "<hr class='lastpos' />";
    // source.ircMessage = "<div class='{{styles}}'></div>";


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

    // source.detachedWindow = [
    // "<div class='detached-window'>",
    //     "<div class='header'>",
    //         "<span class='title'>{{channel}}</span>",
    //         "{{#unless base}}{{> tabClose}}{{/unless}}",//css bug
    //         "{{> tabAttach}}",
    //     "</div>",
    // "</div>"].join("");

    source.resizeHandle = "<div><span class='resize-handle ui-icon ui-icon-grip-diagonal-se'></span></div>";

    source.menuContainer = "<div class='menu'></div>";
    // source.menubtn = "<div class='dropdown-tab'><img src='{{icon}}' title='menu' alt='menu'></div>";
    source.menudrop = "<div class='main-menu dropdownmenu'></div>";
    // source.chanmenu = "<div class='chanmenu dropdownmenu'>{{#each channels}}{{> menuitem}}{{/each}}</div>";
    // source.menuitem = "<a{{#if value}} data-value='{{value}}'{{/if}}><span>{{text}}</span>{{#if hint}}<span class='hint'>{{hint}}</span>{{/if}}</a>";
    source.dropdownhint = "<div class='dropdownhint'>Click the icon for the main menu.</div>";

    source.tabbar = "<div class='tabbar'></div>";
    source.tabbarbtns = [
    "<div class='tab-buttons'>",
        "<span class='ui-icon ui-icon-circle-triangle-w to-left hidden' name='tabscroll'></span>",
        "<span class='ui-icon ui-icon-circle-triangle-e to-right hidden' name='tabscroll'></span>",
        "<span class='add-chan ui-icon ui-icon-circle-plus' title='Join a channel'></span>",
    "</div>"].join("");
    // source.ircTab = "<a href='#' class='tab'>{{{name}}} {{> tabDetach}}</a>";
    source.tabDetach = "<span class='detach ui-icon ui-icon-newwin' title='" + lang.detachWindow + "'></span>";
    source.tabAttach = "<span class='attach ui-icon ui-icon-circle-minus'></span>";
    source.tabClose = "<span class='tab-close ui-icon ui-icon-circle-close' title='" + lang.closeTab + "'></span>";

    // source.channelName = "<div id='channel-name-id' class='channel-name'>{{{channel}}}</div>";

    // source.topicBar = ["<div class='topic tab-invisible qui colourline'>",
    //                         "{{#if topic}}{{> topicText}}{{else}}&nbsp;{{/if}}",
    //                     "</div>"].join("");
    // source.topicText = "<span class='{{#if empty}}emptytopic{{/if}}'>{{topic}}</span>";

    // source.nickbtn = "<a href='#' class='user'><span>{{nick}}</span></a>";
    // source.nicklist = "<div class='nicklist tab-invisible qwebirc-qui'></div>";

    // source.favicon = "<link rel='shortcut icon' type='image/x-icon' href='{{link}}'>";

    // source.ircInput = [
    // "<form class='input'><div>",
    //     "<label class='nickname'><span class='status {{status}}'></span>{{nick}}</label>",
    //     "<input class='{{type}} input-field' type='text'>",
    //     "<input class='input-button' type='button' value='>' />",
    // "</div></form>"].join("");


    source.verticalDivider = "<div class='ui-icon ui-icon-grip-solid-vertical handle vertical'></div>";
    source.horizontalDivider = "<div class='ui-icon ui-icon-grip-solid-horizontal handle horizontal'></div>";

    /************************
        HELPERS
    ***********************/
    //invert boolean helper
    // engine.registerHelper('not', prelude.negate);

    //returns hidden class name if it should be hidden
    // engine.registerHelper('hidden', function(hidden) {
    //     return hidden ? 'hidden' : '';
    // });

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
        Object.each(source, function(item, key) {
            try {
                // compiled[key] = engine.compile(item);
                compiled[key] = Function.from(item)
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

var templates = Handlebars.templates;


ui.BaseUI = new Class({
    Implements: [Events],
    initialize: function(parentElement, windowClass, uiName, options) {
        var self = this;
        self.options = options;

        self.windows = {};
        self.clients = {};
        self.windows[ui.CUSTOM_CLIENT] = {};
        self.windowArray = [];
        self.windowClass = windowClass;
        self.parentElement = parentElement;
        self.parentElement.addClass("qwebirc");
        self.parentElement.addClass("qwebirc-" + uiName);
        self.commandhistory = new irc.CommandHistory();
        self.clientId = 0;

        self.windowFocused = true;

        if (Browser.Engine.trident) {
            var checkFocus = function() {
                    var hasFocus = document.hasFocus();
                    if (hasFocus !== self.windowFocused) {
                        self.windowFocused = hasFocus;
                        self.focusChange(hasFocus);
                    }
                };

            checkFocus.periodical(100, self);
        } else {
            var blur = function() {
                    if (self.windowFocused) {
                        self.windowFocused = false;
                        self.focusChange(false);
                    }
                },
                focus = function() {
                    if (!self.windowFocused) {
                        self.windowFocused = true;
                        self.focusChange(true);
                    }
                };

            /* firefox requires both */

            document.addEvent("blur", blur);
            window.addEvent("blur", blur);
            document.addEvent("focus", focus);
            window.addEvent("focus", focus);
        }
    },
    newClient: function(client) {
        client.id = this.clientId++;
        // client.hilightController = new ui.HilightController(client);

        this.windows[client.id] = {};
        this.clients[client.id] = client;
        var win = this.newWindow(client, ui.WINDOW_STATUS, STATUS);
        this.selectWindow(win);

        client.addEvent("nickChange", this.nickChange);

        return win;
    },
    getClientId: function(client) {
        return client === ui.CUSTOM_CLIENT ? ui.CUSTOM_CLIENT : client.id;
    },
    getWindowIdentifier: function(client, type, name) {
        if (type === ui.WINDOW_MESSAGES)
            return "-M";
        else if (type === ui.WINDOW_STATUS)
            return "";
        else if (client === ui.CUSTOM_CLIENT)
            return "_" + name;
        else
            return "_" + client.toIRCLower(name);
    },
    newWindow: function(client, type, name) {
        var win = this.getWindow(client, type, name);
        if ($defined(win))
            return win;

        var wId = this.getWindowIdentifier(client, type, name);
        win = this.windows[this.getClientId(client)][wId] = new this.windowClass(this, client, type, name, wId);
        this.windowArray.push(win);

        return win;
    },
    nickChange: $empty,

    getWindow: function(client, type, name) {
        var wins = this.windows[this.getClientId(client)];
        if (!$defined(wins))
            return null;

        return wins[this.getWindowIdentifier(client, type, name)];
    },
    getActiveWindow: function() {
        return this.active;
    },
    getActiveIRCWindow: function(client) {
        if (!this.active || this.active.type == ui.WINDOW_CUSTOM) {
            return this.windows[this.getClientId(client)][this.getWindowIdentifier(client, ui.WINDOW_STATUS)];
        } else {
            return this.active;
        }
    },
    __setActiveWindow: function(win) {
        this.active = win;
    },
    selectWindow: function(win) {
        if (this.active)
            this.active.deselect();
        win.select();
        this.updateTitle(win.name + " - " + this.options.appTitle);
    },
    nextWindow: function(direction, fromWin) {
        var windows = this.windowArray,
            win = windows.next(windows.indexOf(fromWin || this.active), direction); //get window from array
        this.selectWindow(win);

        return win;
    },
    prevWindow: function() {
        this.nextWindow(-1);
    },
    __closed: function(win) {
        var winarr = this.windowArray;
        if (win.active) {
            // this.active = undefined;
            if (winarr.length === 1) {
                winarr.empty();
            } else {
                var index = winarr.indexOf(win);
                if(index === -1) {
                    return;
                } else if (index === (winarr.length - 1)) {
                    this.prevWindow();
                } else {
                    this.nextWindow();
                }
            }
        }

        winarr = this.windowArray.erase(win);
        delete this.windows[this.getClientId(win.client)][win.identifier];
    },
/*
      this shouldn't be called by overriding classes!
      they should implement their own!
      some form of user input MUST be received before an
      IRC connection is made, else users are going to get
      tricked into getting themselves glined
    */
    loginBox: function(callback, initialNickname, initialChannels, autoConnect, autoNick, storage) {
        ui.GenericLoginBox(this.parentElement, callback, initialNickname, initialChannels, autoConnect, autoNick, this.options.networkName, storage);
    },
    focusChange: function(newValue) {
        var win = this.getActiveWindow();
        if ($defined(win))
            win.focusChange(newValue);
    }
});


ui.StandardUI = new Class({
    Extends: ui.BaseUI,
    Binds: ["__handleHotkey", "optionsWindow", "embeddedWindow", "urlDispatcher", "resetTabComplete", "whoisURL"],

    UICommands: ui.UI_COMMANDS,
    initialize: function(parentElement, windowClass, uiName, options) {
        this.parent(parentElement, windowClass, uiName, options);

        this.tabCompleter = new ui.TabCompleterFactory(this);
        this.uiOptions = new ui.DefaultOptionsClass(this, options.uiOptionsArg);
        this.customWindows = {};

        this.__styleValues = {
            hue: this.uiOptions.STYLE_HUE,
            saturation: 0,
            lightness: 0
        };
        if ($defined(this.options.hue))
            this.__styleValues.hue = this.options.hue;
        if ($defined(this.options.saturation))
            this.__styleValues.saturation = this.options.saturation;
        if ($defined(this.options.lightness))
            this.__styleValues.lightness = this.options.lightness;

        var ev;
        if (Browser.Engine.trident) {
            ev = "keydown";
        } else {
            ev = "keypress";
        }
        document.addEvent(ev, this.__handleHotkey);
    },
    __handleHotkey: function(x) {
        if (!x.alt || x.control) {
            if (x.key === "backspace" || x.key === "/")
                if (!this.getInputFocused(x))
                    x.stop();
            return;
        }
        var success = false;
        if (x.key.match(/a/i)) {
            var highestNum = 0;
            var highestIndex = -1;
            success = true;

            x.stop();
            //good place for foldr no?
            this.windowArray.each(function(win, indx){
                var h = win.hilighted;
                if (h > highestNum) {
                    highestIndex = indx;
                    highestNum = h;
                }
            });
            if (highestIndex !== -1)
                this.selectWindow(this.windowArray[highestIndex]);
        } else if (prelude.isNumber(x.key)) { /*x.key >= '0' && x.key <= '9'*/
            success = true;

            //number = x.key - '0'; //ridiculously stupid
            number = (Number.toInt(x.key) || 10) - 1;

            if (number >= this.windowArray.length)
                return;

            this.selectWindow(this.windowArray[number]);
        } else if (x.key == "left") {
            this.prevWindow();
            success = true;
        } else if (x.key == "right") {
            this.nextWindow();
            success = true;
        }
        if (success)
            x.stop();
    },
    getInputFocused: function(x) {
        //wtf? (x.target.TYPE =="INPUT") or something work?
        var focused = !($$("input").contains(x.target) && $$("textarea").contains(x.target));
        return focused;
    },
    newCustomWindow: function(name, select, type) {
        if (!type)
            type = ui.WINDOW_CUSTOM;

        var win = this.newWindow(ui.CUSTOM_CLIENT, type, name);
        win.addEvent("close", function(win) {
            delete this.windows[ui.CUSTOM_CLIENT][win.identifier];
        }.bind(this));

        if (select)
            this.selectWindow(win);

        return win;
    },
    addCustomWindow: function(windowName, class_, cssClass, options) {
        if (!$defined(options))
            options = {};

        if (this.customWindows[windowName]) {
            this.selectWindow(this.customWindows[windowName]);
            return;
        }

        var win = this.newCustomWindow(windowName, true);
        this.customWindows[windowName] = win;

        win.addEvent("close", function() {
            this.customWindows[windowName] = null;
        }.bind(this));

        if (cssClass)
            win.lines.addClass("qwebirc-" + cssClass);

        var ew = new class_(win.lines, options);
        ew.addEvent("close", win.close/*.bind(win)*/); //already bound

        win.setSubWindow(ew);
    },
    embeddedWindow: function() {
        this.addCustomWindow("Add webchat to your site", ui.EmbedWizard, "embeddedwizard", {
            baseURL: this.options.baseURL,
            uiOptions: this.uiOptions,
            optionsCallback: this.optionsWindow
        });
    },
    optionsWindow: function() {
        this.addCustomWindow("Options", ui.OptionsPane, "optionspane", this.uiOptions);
    },
    aboutWindow: function() {
        this.addCustomWindow("About", ui.AboutPane, "aboutpane", this.uiOptions);
    },
    privacyWindow: function() {
        this.addCustomWindow("Privacy policy", ui.PrivacyPolicyPane, "privacypolicypane", this.uiOptions);
    },
    feedbackWindow: function() {
        this.addCustomWindow("Feedback", ui.FeedbackPane, "feedbackpane", this.uiOptions);
    },
    faqWindow: function() {
        this.addCustomWindow("FAQ", ui.FAQPane, "faqpane", this.uiOptions);
    },
    urlDispatcher: function(name, window) {
        if (name == "embedded") {
            return ["a", this.embeddedWindow];
        }
        else if (name == "options"){
            return ["a", this.optionsWindow];
        }
        /* doesn't really belong here */
        else if (name === "whois") {
            var uiOptions = this.uiOptions;
            ///this method is dumb
            return ["span", function(nick) {
                if (uiOptions.QUERY_ON_NICK_CLICK) {
                    window.client.exec("/QUERY " + nick);
                } else {
                    if (isChannel(nick)) {
                        nick = util.unformatChannel(nick);
                    } else {
                        if (nick.search(window.client.nickname + '>') >= 0) {
                            nick = nick.substr(nick.search('>') + 1, nick.length);
                        } else {
                            nick = nick.substr(0, nick.search('>'));
                        }
                    }
                    // window.properties.text(nick);
                    window.client.exec("/WHOIS " + nick);
                }
            }];
        }
        else
            return null;
    },

    whoisURL: function(e, target) {
        var client = target.getParent('.lines').retrieve('client'),
            nick = target.get('data-user');
        if (this.uiOptions.QUERY_ON_NICK_CLICK) {
            client.exec("/QUERY " + nick);
        } else {
            if (isChannel(nick)) {
                nick = util.unformatChannel(nick);
            } else if (nick.search(client.nickname + '>') >= 0) {
                nick = nick.substr(nick.search('>') + 1, nick.length);
            } 
            client.exec("/WHOIS " + nick);
        }
    },

    chanURL: function(e, target) {
        var client = target.getParent('.lines').retrieve('client'),
            chan = target.get('data-chan');
        if(util.isChannel(chan))
            client.exec("/JOIN " + chan);
    },

    tabComplete: function(element) {
        this.tabCompleter.tabComplete(element);
    },
    resetTabComplete: function() {
        this.tabCompleter.reset();
    },
    setModifiableStylesheet: function(name) {
        this.__styleSheet = new ui.style.ModifiableStylesheet(this.options.modifiableStylesheet);
        this.setModifiableStylesheetValues({});
    },
    setModifiableStylesheetValues: function(values) {
        // for (var k in values)
        //     this.__styleValues[k] = values[k];
        $extend(this.__styleValues, values);

        if (!$defined(this.__styleSheet))
            return;

        var hue = this.__styleValues.hue,
            lightness = this.__styleValues.lightness,
            saturation = this.__styleValues.saturation,
            uiOptions = this.uiOptions;

        this.__styleSheet.set(function(mode, col) {
            if (mode == "c") {
                var x = new Color(col);
                var c = x.setHue(hue).setSaturation(x.hsb[1] + saturation).setBrightness(x.hsb[2] + lightness);
                if (c == "255,255,255") // IE confuses white with transparent... 
                c = "255,255,254";

                return "rgb(" + c + ")";
            } else if (mode == "o") {
                return uiOptions[arguments[1]] ? arguments[2] : arguments[3];
            }
        });
    }
});



ui.NotificationUI = new Class({
    Extends: ui.StandardUI,

    Binds: ["beep"],

    options: {
        minSoundRepeatInterval: 1000
    },
    initialize: function(/*parentElement, windowClass, uiName, options*/) {
        // this.parent(parentElement, windowClass, uiName, options);
        this.parent.apply(this, arguments);


        if (this.uiOptions.BEEP_ON_MENTION) {
            this.soundInit();
            this.lastSound = 0;
        }


        var flasher = this.__flasher = new ui.Flasher(this.uiOptions);

        this.flash = flasher.flash;
        this.cancelFlash = flasher.cancelFlash;
    },
    setBeepOnMention: function(value) {
        if (value)
            this.soundInit();
    },
    updateTitle: function(text) {
        if (this.__flasher.updateTitle(text))
            ui.setTitle(text);
    },
    focusChange: function(value) {
        this.parent(value);
        this.__flasher.focusChange(value);
    },
    beep: function() {
        this.playSound('beep');
    },
    playSound: function(alias) {
        if (this.soundPlayer.isReady() && this.uiOptions.BEEP_ON_MENTION &&
                (Date.now() - this.lastSound > this.options.sounds.minSoundRepeatInterval)) {
            this.lastSound = Date.now();
            this.soundPlayer.sounds[alias]();
        }
    },

    soundInit: function() {
        //used to have a bunch of flash checks. going to let the sm handle it
        if(!$defined(this.soundPlayer)) {
            this.soundPlayer = new sound.SoundPlayer(this.options.sounds).load();
        }
    }
});

ui.Flasher = new Class({
    Binds: ["flash", "cancelFlash"],

    initialize: function(uiOptions) {
        this.uiOptions = uiOptions;

        this.windowFocused = false;
        this.canUpdateTitle = true;
        this.titleText = document.title;

        var favIcon = document.head.getElement("link[rel^='shortcut'][rel$='icon']");
        if ($defined(favIcon)) {
            this.favIcon = favIcon;
            this.favIconParent = favIcon.parentNode;
            this.favIconVisible = true;

            // this.emptyFavIcon = new Element("link");
            // this.emptyFavIcon.rel = "shortcut icon";
            // this.emptyFavIcon.href = qwebirc.global.staticBaseURL + "images/empty_favicon.ico";
            // this.emptyFavIcon.type = "image/x-icon";
            this.emptyFavIcon = new Element("link", {
                    rel: 'shortcut icon',
                    type: 'image/x-icon',
                    href: uiOptions.ui.options.icons.empty_favicon
                });

            this.flashing = false;

            this.canFlash = true;
            document.addEvents({
                "mousedown:once": this.cancelFlash,
                "keydown:once": this.cancelFlash
            });
        } else {
            this.canFlash = false;
        }
    },
    flash: function() {
        var self = this;
        if (!self.uiOptions.FLASH_ON_MENTION || self.windowFocused || !self.canFlash || self.flashing)
            return;

        self.titleText = document.title; /* just in case */

        var flash = function() {
            var vis = self.toggleFavIcon();
            self.canUpdateTitle = vis;
            ui.setTitle(vis ? self.titleText : lang.activityNotice.message);
        };

        //http://mootools.net/forge/p/tab_alert
        // var ex3 = yourInstance = new tabAlert({
        //         text: lang.activityNotice.message,
        //         ticker: true,
        //         onLoop: flash
        //     });

        self.flashing = true;
        // flashA();
        self.flasher = flash.periodical(750);
    },
    cancelFlash: function() {
        if (!$defined(this.flasher))
            return;

        this.flashing = false;

        $clear(this.flasher);
        this.flasher = undefined;

        this.toggleFavIcon(true);
        ui.setTitle(this.titleText);
        this.canUpdateTitle = true;
    },
    //not sure if changing the favicon is a good idea - messes with peoples bookmarks
    toggleFavIcon: function(state) {
        var vis = $defined(state) ? state : !this.favIconVisible;
        if(vis){
            if (!this.favIconVisible) {
                this.favIcon.replaces(this.emptyFavIcon);
            }
        }
        else{
            if (this.favIconVisible) {
                this.emptyFavIcon.replaces(this.favIcon);
            }
        }
        this.favIconVisible = vis;
        return vis;
    },
    updateTitle: function(text) {
        this.titleText = text;
        return this.canUpdateTitle;
    },
    focusChange: function(value) {
        this.windowFocused = value;

        if (value)
            this.cancelFlash();
    }
});


ui.NewLoginUI = new Class({
    Extends: ui.NotificationUI,
    loginBox: function(callbackfn, initialNickname, initialChannels, autoConnect, autoNick, network, storage) {
        this.postInitialize();

        var win = this.newCustomWindow(CONNECTION_DETAILS, true, ui.WINDOW_CONNECT);
        var callback = function() {
                win.close();
                callbackfn.apply(this, arguments);
            };
        ui.GenericLoginBox(win.lines, callback, initialNickname, initialChannels, autoConnect, autoNick, network || this.options.networkName, storage);
        return win;
    }
});

ui.GenericLoginBox = function(parentElement, callback, initialNickname, initialChannels, autoConnect, autoNick, networkName, storage) {
    if (autoConnect) {
        ui.ConfirmBox(parentElement, callback, initialNickname, initialChannels, autoNick, networkName,storage);
    } else {
        ui.LoginBox(parentElement, callback, initialNickname, initialChannels, networkName,storage);
    }
};

ui.LoginBox = function(parentElement, callback, initialNickname, initialChannels, networkName, cookies) {

    var content = new Element('div').inject(parentElement),
        recenter = content.position.bind(content);

    var nickname = cookies.nick.get() || initialNickname,
        account = util.B64.decode(cookies.user.get()),
        password = util.B64.decode(cookies.pass.get()),
        eauth = auth.enabled || cookies.auth.get();

    var context = {
        'network':networkName,
        'nickname':nickname,
        'username':account,
        'password':password,
        'full': eauth, //whether to show the extra auth options (check the checkbox)
        'channels': initialChannels.join()
    };
    content.html(templates.authpage(context));

    var nickBox = content.getElementById('nickname'),
        usernameBox = content.getElementById('username'),
        passwordBox = content.getElementById('password'),
        chkAddAuth = content.getElementById('authenticate'),
        form = content.getElementById('login');


    function toggleFull () {
        form.getElements('[name="full"]').getParent('div').toggle();
    }

    chkAddAuth.addEvent('click', toggleFull);

    form.addEvent("submit", function(e) {
        e.stop();

        var nickname = nickBox.value;

        //validate nick
        if (!nickname) {
            alert(lang.missingNick);
            nickBox.focus();
            return;
        }
        var stripped = qwebirc.global.nicknameValidator.validate(nickname);
        if (stripped !== nickname) {
            nickBox.value = stripped;
            alert(lang.invalidNick);
            nickBox.focus();
            return;
        }

        var data = {
            "nickname": nickname
        };

        cookies.nick.set(nickname);


        if (chkAddAuth.checked || auth.enabled) {//disabled
            // we're valid - good to go
            data.account = account = usernameBox.value;
            data.password = password = passwordBox.value;
            if (auth.bouncerAuth()) {
                if (!password) {
                    alert(lang.missingPass.message);
                    passwordBox.focus();
                    return;
                }

                data.serverPassword = password;
            }
            if (!account || !password) {
                alert(lang.missingAuthInfo.message);
                if (!usernameBox.value) {
                    usernameBox.focus();
                } else {
                    passwordBox.focus();
                }
                return;
            } else {
                if(auth.passAuth()){
                    data.serverPassword = account + " " + password;
                }

            }

            cookies.user.set(util.B64.encode(account));
            cookies.pass.set(util.B64.encode(password));
            cookies.auth.set(true);
            auth.enabled = true;
        } else {
            cookies.auth.dispose();
        }


        parentElement.empty();

        auth.loggedin = true;

        window.removeEvent('resize', recenter);
        parentElement.retrieve('window').removeEvents({
            'attach': recenter,
            'detach': recenter
        });

        callback.call(this,data);
    }.bind(this));

    // nickBox.set("value", initialNickname);
    //chan.set("value", initialChannels);

    if (window === window.top)
        nickBox.focus();


    //center everything... 
    recenter();
    window.addEvent('resize', recenter);
    parentElement.retrieve('window').addEvents({
        'attach': recenter,
        'detach': recenter
    });


    window.content = content;
};


//todo clean this up - not currently implemented
ui.ConfirmBox = function(parentElement, callback, initialNickname, initialChannels, autoNick, networkName) {
    var outerbox = new Element("table");
    outerbox.addClass("qwebirc-centrebox");
    parentElement.appendChild(outerbox);
    var tbody = new Element("tbody");
    outerbox.appendChild(tbody);
    var tr = new Element("tr");
    tbody.appendChild(tr);
    var td = new Element("td");
    tr.appendChild(td);

    var box = new Element("table");
    box.addClass("qwebirc-confirmbox");
    td.appendChild(box);

    var tbody = new Element("tbody");
    box.appendChild(tbody);

    var tr = new Element("tr");
    tbody.appendChild(tr);
    tr.addClass("tr1");

    var text = new Element("td");
    tr.appendChild(text);

    var nick = new Element("b");
    nick.set("text", initialNickname);

    var c = initialChannels.split(" ")[0].split(",");

    text.appendChild(document.createTextNode("To connect to " + networkName + " IRC and join channel" + ((c.length > 1) ? "s" : "") + " "));

    for (var i = 0; i < c.length; i++) {
        if ((c.length > 1) && (i == c.length - 1)) {
            text.appendChild(document.createTextNode(" and "));
        } else if (i > 0) {
            text.appendChild(document.createTextNode(", "));
        }
        text.appendChild(new Element("b").set("text", c[i]));

    }

    if (!autoNick) {
        text.appendChild(document.createTextNode(" as "));
        text.appendChild(nick);
    }

    text.appendChild(document.createTextNode(" click 'Connect'."));
    text.appendChild(new Element("br"));
    if (auth.enabled && auth.quakeNetAuth() && !auth.loggedin)
        text.appendChild(document.createTextNode("If you'd like to connect using your Q auth click 'Log in'."));

    var tr = new Element("tr");
    tbody.appendChild(tr);
    tr.addClass("tr2");

    var td = new Element("td");
    tr.appendChild(td);

    var yes = new Element("input", {
        "type": "submit",
        "value": "Connect"
    });
    td.appendChild(yes);
    yes.addEvent("click", function(e) {
        parentElement.removeChild(outerbox);
        callback({
            "nickname": initialNickname,
            "autojoin": initialChannels
        });
    });

    if (auth.enabled && auth.quakeNetAuth() && !auth.loggedin) {
        var auth = new Element("input", {
            "type": "submit",
            "value": "Log in"
        });
        td.appendChild(auth);
        auth.addEvent("click", ui.AuthLogin);
    }

    if (window == window.top)
        yes.focus();
}

ui.authShowHide = function(checkbox, authRow, usernameBox, usernameRow, passwordRow) {
    var visible = checkbox.checked;
    var display = visible ? null : "none";
    usernameRow.setStyle("display", display);
    passwordRow.setStyle("display", display);

    if (visible) {
        //    authRow.parentNode.setStyle("display", "none");
        usernameBox.focus();
    }
}



ui.QuakeNetUI = new Class({
    Extends: ui.NewLoginUI,
    urlDispatcher: function(name, window) {
        if (name == "qwhois") {
            return ["span", function(auth) {
                this.client.exec("/MSG Q whois #" + auth);
            }.bind(window)];
        }
        return this.parent(name, window);
    },
    logout: function() {
        if (!auth.loggedin)
            return;
        if (confirm("Log out?")) {
            Object.each(this.clients, function(client) {
                client.quit(lang.logOut.message);
            });

            (function() {
                document.location = qwebirc.global.dynamicBaseURL + "auth?logout=1";
            }).delay(500);
        }
    }
});


ui.QUI = new Class({
    Extends: ui.QuakeNetUI,
    Binds: ["__createChannelMenu"],
    initialize: function(parentElement, theme, options) {
        this.parent(parentElement, ui.QUI.Window, "qui", options);

        parentElement.addClass('qui')
                    .addClass('signed-out');
        this.theme = theme;
        this.parentElement = parentElement;
        this.setModifiableStylesheet("qui");
        this.setHotKeys();


        this.parentElement.addEvents({
            "click:relay(.lines .hyperlink-whois)": this.whoisURL,
            "click:relay(.lines .hyperlink-channel)": this.chanURL
        });
    },
    postInitialize: function() {
        var self = this,
            qjsui = self.qjsui = new ui.QUI.JSUI("qui", self.parentElement);

        // qjsui.addEvent("reflow", function() {
        //     var win = self.getActiveWindow();
        //     if ($defined(win))
        //         win.onResize();
        // });

        self.outerTabs = qjsui.top;
        var tabs = self.tabs = Element.from(templates.tabbar()),
            joinChan =  function(){
                var chan = prompt("Enter channel name:");
                if(chan.trim() !== ""){
                    Object.each(self.clients, function(client) {
                        client.exec("/JOIN " + chan);
                    });
                }
            },
            tabbtns = Element.from(templates.tabbarbtns()),
            addTab = tabbtns.getElement('.add-chan'),
            scrollers = tabbtns.getElements('[name="tabscroll"]'),
            scroller = new Fx.Scroll(tabs),
            resizeTabs = util.fillContainer.curry(tabs, {style: 'max-width'}),
            onResize = function() {
                var wid = tabs.getWidth(),
                    swid = tabs.getScrollWidth();

                if(swid > wid) {
                    scrollers.show();
                }
                else {
                    scrollers.hide();
                }

                resizeTabs();
            };

        window.addEvent('resize', onResize);
        tabs.addEvents({
            'adopt': onResize,
            'disown': onResize
        });

        scrollers.filter('.to-left')
            .addEvent('click', function(e) {
                e.stop();
                var pos = tabs.getScrollLeft(),
                    $ele = util.elementAtScrollPos(tabs, pos);

                scroller.toElement($ele, 'x');
                console.log($ele);
            });
        scrollers.filter('.to-right')
            .addEvent('click', function(e) {
                e.stop();
                var pos = tabs.getScrollLeft() + tabs.getWidth(),
                    $ele = util.elementAtScrollPos(tabs, pos);

                scroller.toElementEdge($ele, 'x');
                console.log($ele);
            });

        resizeTabs();
        addTab.addEvents({
            'dblclick': joinChan,
            'click': self.__createChannelMenu
        });

        //for scrolling tabs with mousewheel
        tabs.addEvent("mousewheel", function(event) {
            event.stop();
            /* up */
            if (event.wheel > 0) {
                self.nextWindow();
            } else if (event.wheel < 0) { /* down */
                self.prevWindow();
            }
        });


        //append menu and tabbar
        self.outerTabs.adopt(self.__createDropdownMenu(), tabs, tabbtns);

        var origWin = qjsui.createWindow();
        self.origtopic = self.topic = origWin.topic;
        self.origlines = self.lines = origWin.middle;
        self.orignicklist = self.nicklist = origWin.right;

        self.input = origWin.bottom;
        // self.reflow = qjsui.reflow.bind(qjsui);

        // self.reflow(origWin);
        // self.reflow.delay(100, self, origWin); /* Konqueror fix */


        //For window resizing
        // window.addEvent("resize", function() {
        //     self.getActiveWindow().reflow(100);
        // });


        //delay for style recalc
        self.__createDropdownHint.delay(500, self);
    },
    __createDropdownMenu: function() {
        var self = this,

            dropdownMenu = Element.from(templates.menudrop());
        dropdownMenu.inject(self.parentElement);

        var dropdown = Element.from(templates.menubtn({icon: self.options.icons.menuicon}));
        dropdown.setStyle("opacity", 1);


        self.UICommands.each(function(cmd) {
            var text = cmd[0];
            var fn = self[cmd[1] + "Window"].bind(self);
            var ele = Element.from(templates.menuitem({text:text}));
            ele.addEvent("click", function(e) {
                    dropdownMenu.hideMenu();
                    fn();
                });
            dropdownMenu.appendChild(ele);
        });

        // var dropdown = new Element("div");
        // dropdown.addClass("dropdown-tab");
        // dropdown.appendChild(new Element("img", {
        //     src: qwebirc.global.staticBaseURL + "images/icon.png",
        //     title: "menu",
        //     alt: "menu"
        // }));

        var dropdownEffect = new Fx.Tween(dropdown, {
            duration: "long",
            property: "opacity",
            link: "chain"
        });

        dropdownEffect.start(0.25)
                    .start(1)
                    .start(0.33)
                    .start(1);

        ui.decorateDropdown(dropdown,dropdownMenu, {
            onShow: function() {
                if(self.hideHint)
                    self.hideHint();
                delete self.hideHint;
            }
        });
        return dropdown;
    },

    setHotKeys: function (argument) {
        var events = storage.get('hotkeys');
        console.log('todo');
        if(keys && events) {
            keys.activate();
        }
    },

    //the effect on page load
    __createDropdownHint: function() {
        var dropdownhint = Element.from(templates.dropdownhint());
        dropdownhint.inject(this.parentElement)
                    .position({
                        relativeTo: this.outerTabs,
                        position: {'y': 'bottom'},
                        offset: {y:10}
                    });

        new Fx.Morph(dropdownhint, {
            duration: "normal",
            transition: Fx.Transitions.Sine.easeOut
        }).start({
            left: [900, 5]
        });

        var hider = function() {
                new Fx.Morph(dropdownhint, {
                    duration: "long"
                }).start({
                    left: [5, -900]
                });
            }.delay(4000);

        var hider2 = this.hideHint = Element.destroy.curry(dropdownhint);

        hider2.delay(4000);

        document.addEvents({
                "mousedown": hider2,
                "keydown": hider2
            });
    },

    //todo use other dropdown menu code
    __createChannelMenu: function() {
        var self = this,
            client = self.getActiveIRCWindow().client;

        client.getPopularChannels(
            function(chans) {
                chans = chans.slice(0, (self.options.maxChansMenu || 10))
                            .map(function(chan) {
                                return {
                                    text: chan.channel,
                                    value: chan.channel,
                                    hint: chan.users
                                };
                            });
                var menu = Element.from(templates.chanmenu({
                        channels: chans
                    })),
                    btn = self.outerTabs.getElement('.add-chan'),
                    btnmenu = btn.retrieve('menu');

                if(btnmenu) {
                    menu.replaces(btnmenu);
                }
                else {
                    var wrapper = new Element('div').inject(self.parentElement).adopt(menu);
                    ui.decorateDropdown(btn, wrapper);
                    wrapper.addEvent("click:relay(a)", function(e, target) {
                        var chan = target.get('data-value');
                        client.exec("/JOIN " + chan);
                    });
                }
                btn.store('menu', menu);

                menu.parentElement.showMenu();
            });
        },

    newClient: function(client) {
        this.parentElement.swapClass('signed-out','signed-in');
        return this.parent(client);
    },

    // setLines: function(lines) {
    //     this.lines.parentNode.replaceChild(lines, this.lines);
    //     this.qjsui.middle = this.lines = lines;
    // },
    // setChannelItems: function(nicklist, topic) {
    //     if (!$defined(nicklist)) {
    //         nicklist = this.orignicklist;
    //         topic = this.origtopic;
    //     }
    //     nicklist.replaces(this.nicklist);
    //     this.qjsui.right = this.nicklist = nicklist;

    //     topic.replaces(this.topic);

    //     this.qjsui.topic = this.topic = topic;
    // }
    setWindow: function(win) {
        this.qjsui.setWindow(win);
    },

    //called in context of irc client
    nickChange: function(data) {
        if(data.thisclient) {
            Object.each(this.windows, function(win) {
                win.$nicklabel.set("text", data.newnick);
            });
        }
    }
});

ui.QUI.JSUI = new Class({
    Implements: [Events],
    initialize: function(class_, parent, sizer) {
        this.parent = parent;
        this.windows = [];

        this.sizer = $defined(sizer) ? sizer : parent;

        this.class_ = class_;
        this.create();

        // this.reflowevent = null;
    },
    // applyClasses: function(pos, el) {
    //     el.addClass("dynamicpanel")
    //         .addClass(this.class_);

    //     switch(pos) {
    //         case "middle":
    //             el.addClass("leftboundpanel");
    //             break;
    //         case "top":
    //             el.addClass("topboundpanel")
    //                 .addClass("widepanel");
    //             break;
    //         case "right":
    //             el.addClass("rightboundpanel");
    //             break;
    //         case "topic":
    //             el.addClass("widepanel");
    //             break;
    //         case "bottom":
    //             el.addClass("bottomboundpanel")
    //                 .addClass("widepanel");
    //             break;
    //     }
    // },
    create: function() {
        // var XE = function(pos) {
        //         var element = new Element("div");
        //         this.applyClasses(pos, element);

        //         this.parent.appendChild(element);
        //         return element;
        //     }.bind(this);

        // this.top = XE("top");
        // this.topic = XE("topic");
        // this.middle = XE("middle");
        // this.right = XE("right");
        // this.properties = XE("properties");
        // this.bottom = XE("bottom");

        var top = this.top = Element.from(templates.topPane()),
            windows = this.winContainer = Element.from(templates.windowsPane()),
            detach = this.detachContainer = Element.from(templates.detachedPane());
        this.parent.adopt(top, windows, detach);
    },

    createWindow: function() {
        var win = {
            'window': Element.from(templates.windowPane()),
            'topic': Element.from(templates.topicPane()),
            'content': Element.from(templates.contentPane()),
            'middle': Element.from(templates.leftPane()),
            'right': Element.from(templates.nickPane()),
            'properties': Element.from(templates.propertiesPane()),
            'bottom': Element.from(templates.inputPane())
        };

        win.content.adopt(win.middle, win.right);
        win.window.adopt(win.topic, win.content, win.properties, win.bottom);
        this.winContainer.appendChild(win.window);
        this.windows.push(win);

        return win;
    },

    reflow: function(win, delay) {
        console.log('dummy');
        // if (!delay)
        //     delay = 1;

        // if (this.reflowevent)
        //     $clear(this.reflowevent);
        // this.__reflow(win);
        // this.reflowevent = this.__reflow.delay(delay, this, win);
    },
    __reflow: function(win) {
        // var properties = win.properties,
        //     bottom = win.bottom,
        //     middle = win.middle,
        //     right = win.right,
        //     topic = win.topic,
        //     top = this.top,

        //     topicsize = topic.getSize(),
        //     topsize = top.getSize(),
        //     rightsize = right.getSize(),
        //     bottomsize = bottom.getSize(),
        //     docsize = this.sizer.getSize();

        // var mheight = (docsize.y - topsize.y - bottomsize.y - topicsize.y),
        //     mwidth = (docsize.x - rightsize.x);

        // topic.setStyle("top", topsize.y);

        // var last5_height = 0;
        // var last5msg = $('last5messages');
        // if (last5msg) {
        //     last5msg.className = "qwebirc-qui ircwindow dynamicpanel lines";
        //     last5msg.style.top = topsize.y + topicsize.y + 'px';
        //     last5msg.style.width = mwidth + 'px';
        //     last5msg.style.zIndex = '1';
        //     last5msg.style.borderBottom = '1px dashed #C8D1DB';
        //     last5_height = last5msg.offsetHeight;
        //     middle.setStyle("top", (topsize.y + topicsize.y + last5msg.offsetHeight));
        // } else {
        //     middle.setStyle("top", (topsize.y + topicsize.y));
        // }

        // if (mheight > 0) {
        //     middle.setStyle("height", mheight - 25 - last5_height);
        //     right.setStyle("height", mheight);
        // }

        // if (mwidth > 0) {
        //     middle.setStyle("width", mwidth);
        //     properties.setStyle("width", mwidth);
        // }
        // right.setStyle("top", (topsize.y + topicsize.y))
        //     .setStyle("left", mwidth);

        // properties.setStyle("top", (docsize.y - bottomsize.y - 25));
        // bottom.setStyle("top", (docsize.y - bottomsize.y));
        // this.fireEvent("reflow", win);
    },
    // showChannel: function(win, state, nicklistVisible) {
    //     // var display = state ? "block" : "none";
    //     // this.right.setStyle("display", nicklistVisible ? display : "none");
    //     // this.topic.setStyle("display", display);
    //     win.right.toggle(state && nicklistVisible);
    //     win.topic.toggle(state);
    // },
    // showInput: function(win, state) {
    //     // this.bottom.setStyle("display", state ? "block" : "none");
    //     win.bottom.isVisible = state;
    //     win.bottom.toggle(state);
    // }
    setWindow: function(newWin) {
        this.windows.each(function (win) {
            if(win.detached !== true) {
                win.window.hide();
            }
        });
        newWin.window.show();
    }
});


// hacky... todo simplify
ui.Colourise = function(line, entity, execfn, cmdfn, win) {
    var fg;
    var bg;
    var underline = false;
    var bold = false;
    var autoNickColour = false;

    var out = [];
    var xline = line.split("");
    var element = new Element("span");

    entity.addClass("colourline");

    function parseColours(xline, i) {
        if(isNaN(xline[i + 1])) {
            fg = undefined;
            bg = undefined;
            return i;
        }
        i++;
        if(prelude.isNumber(xline[i + 1])) {
            fg = parseInt(xline[i] + xline[i + 1]);
            i++;
        } else {
            fg = parseInt(xline[i]);
        }
        if(xline[i + 1] != ",")
            return i;
        else if(isNaN(xline[i + 2]))
            return i;
        i+=2;

        if(prelude.isNumber(xline[i + 1])) {
            bg = parseInt(xline[i] + xline[i + 1]);
            i++;
        } else {
            bg = parseInt(xline[i]);
        }
        return i;
    }

    function emitEndToken() {
        var data = "";
        if (out.length > 0) {
            data = ui.urlificate(element, out.join(""), execfn, cmdfn, win);
            entity.appendChild(element);
            out.empty();
        }
        element = document.createElement("span"); //?
        return data;
    }

    function emitStartToken() {
        if(autoNickColour)
            return element;

        var classes = "";
        if(fg !== undefined)
            classes = concatSpace(classes, "Xc" + fg); //text colour
        if(bg !== undefined)
            classes = concatSpace(classes, "Xbc" + bg); //background
        if(bold)
            classes = concatSpace(classes, "Xb"); //style
        if(underline)
            classes = concatSpace(classes, "Xu");
        element.className = classes;
        // element.className = classes.join(" ");
  }

    var nickColouring = win.parentObject.uiOptions.NICK_COLOURS; /* HACK */
    var capturingNick = false;

    //evil confusing loop
    for (var i = 0; i < xline.length; i++) {
        var lc = xline[i];

        if (nickColouring) {
            if (!capturingNick) {
                if (lc == "\x00") {
                    capturingNick = true;
                    emitEndToken();
                    continue;
                }
            } else {
                if (lc != "\x00") {
                    out.push(lc);
                } else {
                    autoNickColour = true;
                    var e = emitStartToken();
                    var text = emitEndToken();

                    var c = util.toHSBColour(text, win.client);
                    if ($defined(c)) e.style.color = c.rgbToHex();
                    capturingNick = autoNickColour = false;
                }
                continue;
            }
        } else if (lc == "\x00") {
            continue;
        }

        if (lc == "\x02") {
            emitEndToken();

            bold = !bold;

            emitStartToken();
        } else if (lc == "\x1F") {
            emitEndToken();

            underline = !underline;

            emitStartToken();
        } else if (lc == "\x0F") {
            emitEndToken();

            fg = undefined;
            bg = undefined;
            underline = false;
            bold = false;
        } else if (lc == "\x03") {
            emitEndToken();

            i = parseColours(xline, i);
            if (bg > 15) bg = undefined;
            if (fg > 15) fg = undefined;

            emitStartToken();
        } else {
            out.push(lc);
        }
    }

    emitEndToken();
};


ui.AboutPane = new Class({
    Implements: [Events],
    initialize: function(parent) {
        var delayfn = function() {
            //parent.set("html", "<div class=\"loading\">Loading. . .</div>");
            parent.set("html", templates.message(Object.clone(lang.loadingPage, {'class': 'loading'})));
        };
        var cb = delayfn.delay(500);

        var r = ui.RequestTransformHTML({
            url: qwebirc.global.staticBaseURL + "panes/about.html",
            update: parent,
            onSuccess: function() {
                $clear(cb);
                parent.getElement("input[class=close]").addEvent("click", function() {
                    this.fireEvent("close");
                }.bind(this));
                parent.getElement("div[class=version]").set("text", "v" + qwebirc.VERSION);
            }.bind(this)
        });
        r.get();
    }
});

ui.PrivacyPolicyPane = new Class({
    Implements: [Events],
    initialize: function(parent) {
        var delayfn = function() {
            //parent.set("html", "<div class=\"loading\">Loading. . .</div>");
            parent.set("html", templates.message(Object.clone(lang.loadingPage, {'class': 'loading'})));
        };
        var cb = delayfn.delay(500);

        var r = ui.RequestTransformHTML({
            url: qwebirc.global.staticBaseURL + "panes/privacypolicy.html",
            update: parent,
            onSuccess: function() {
                $clear(cb);

                parent.getElement("input[class=close]").addEvent("click", function() {
                    this.fireEvent("close");
                }.bind(this));
            }.bind(this)
        });
        r.get();
    }
});

ui.FeedbackPane = new Class({
    Implements: [Events],
    initialize: function(parent) {
        this.textboxVisible = false;
        var delayfn = function() {
            //parent.set("html", "<div class=\"loading\">Loading. . .</div>");
            parent.set("html", templates.message(Object.clone(lang.loadingPage, {'class': 'loading'})));
        };
        var cb = delayfn.delay(500);

        this.addEvent("select", this.onSelect);

        var r = ui.RequestTransformHTML({
            url: qwebirc.global.staticBaseURL + "panes/feedback.html",
            update: parent,
            onSuccess: function() {
                $clear(cb);
                parent.getElement("input[class=close]").addEvent("click", function() {
                    this.fireEvent("close");
                }.bind(this));
                parent.getElement("input[class=close2]").addEvent("click", function() {
                    this.fireEvent("close");
                }.bind(this));

                var textbox = parent.getElement("textarea");
                this.textbox = textbox;
                parent.getElement("input[class=submitfeedback]").addEvent("click", function() {
                    this.sendFeedback(parent, textbox, textbox.value);
                }.bind(this));

                this.textboxVisible = true;
                this.onSelect();
            }.bind(this)
        });
        r.get();
    },
    onSelect: function() {
        if (this.textboxVisible)
            this.textbox.focus();
    },
    sendFeedback: function(parent, textbox, text) {
        text = text.replace(/^\s*/, "").replace(/\s*$/, "");
        var mainText = parent.getElement("p[class=maintext]");

        if (text.length < 25) {
            /* TODO: lie and throw away */
            mainText.set("text", "I don't suppose you could enter a little bit more? Thanks!");
            textbox.focus();
            return;
        }

        this.textboxVisible = false;
        var mainBody = parent.getElement("div[class=enterarea]");
        mainBody.setStyle("display", "none");

        var messageBody = parent.getElement("div[class=messagearea]");
        var messageText = parent.getElement("p[class=messagetext]");
        var messageClose = parent.getElement("input[class=close2]");

        messageText.set("text", lang.submittingPage.message);
        messageBody.setStyle("display", "");

        /* basic checksum to stop really lame kiddies spamming */
        var checksum = 0;
        var esctext = encodeURIComponent(text);
        for (var i = 0; i < text.length; i++)
            checksum = ((checksum + 1) % 256) ^ (text.charCodeAt(i) % 256);

        var r = new Request({
            url: qwebirc.global.dynamicBaseURL + "feedback",
            onSuccess: function() {
                messageText.set("text", "Submitted successfully, thanks for the feedback!");
                messageClose.setStyle("display", "");
            },
            onFailure: function() {
                this.textboxVisible = true;
                messageBody.setStyle("display", "none");
                mainBody.setStyle("display", "");
                mainText.set("text", "Looks like something went wrong submitting :(");
            }.bind(this)
        }).send("feedback=" + text + "&c=" + checksum);
    }
});

ui.FAQPane = new Class({
    Implements: [Events],
    initialize: function(parent) {
        var delayfn = function() {
            //parent.set("html", "<div class=\"loading\">Loading. . .</div>");
            parent.set("html", templates.message(Object.clone(lang.loadingPage, {'class': 'loading'})));
        };
        var cb = delayfn.delay(500);

        var r = ui.RequestTransformHTML({
            url: qwebirc.global.staticBaseURL + "panes/faq.html",
            update: parent,
            onSuccess: function() {
                $clear(cb);
                parent.getElement("input[class=close]").addEvent("click", function() {
                    this.fireEvent("close");
                }.bind(this));
            }.bind(this)
        });
        r.get();
    }
});



/* NEEDS converting to plain HTML! */
ui.EmbedWizardStep = new Class({
    Implements: [Options, Events],
    options: {
        "title": "",
        "first": "",
        "hint": "",
        "middle": null,
        "premove": null,
        "example": ""
    },
    initialize: function(parent, options) {
        this.setOptions(options);
        this.parent = parent;
    },
    show: function() {
        this.parent.title.set("html", this.options.title);
        this.parent.firstRow.set("html", this.options.first);
        this.parent.hint.set("html", this.options.hint);
        this.parent.example.set("text", this.options.example);

        while (this.parent.middleRow.childNodes.length > 0)
        this.parent.middleRow.removeChild(this.parent.middleRow.childNodes[0]);

        if ($defined(this.options.middle))
            this.parent.middleRow.appendChild(this.options.middle);

        this.fireEvent("show");
    }
});

ui.EmbedWizard = new Class({
    Implements: [Options, Events],
    options: {
        uiOptions: null,
        optionsCallback: null,
        baseURL: "http://webchat.quakenet.org/"
    },
    initialize: function(parent, options) {
        /* for some unknown reason setOptions doesn't work... */
        this.options.uiOptions = options.uiOptions;
        this.options.baseURL = options.baseURL;
        this.options.optionsCallback = options.optionsCallback;
        this.create(parent);
        this.addSteps();
    },
    create: function(parent) {
        this.t = parent;

        var titleRow = this.newRow();
        this.title = new Element("h2");
        this.title.setStyle("margin-top", "0px");
        this.title.setStyle("margin-bottom", "5px");
        titleRow.appendChild(this.title);

        this.firstRow = this.newRow();
        this.middleRow = this.newRow();
        var hintRow = this.newRow();
        this.hint = new Element("div");
        this.hint.setStyle("font-size", "0.8em");
        this.hint.setStyle("font-style", "italic");
        hintRow.appendChild(this.hint);
        var exampleRow = this.newRow();
        this.example = new Element("pre");
        exampleRow.appendChild(this.example);

        var nextRow = this.newRow();
        nextRow.addClass("wizardcontrols");
        var backBtn = new Element("input");
        backBtn.type = "submit";
        backBtn.value = "< Back";
        backBtn.addEvent("click", this.back.bind(this));
        nextRow.appendChild(backBtn);

        var nextBtn = new Element("input");
        nextBtn.type = "submit";
        nextBtn.value = "Next >";
        nextRow.appendChild(nextBtn);
        nextBtn.addEvent("click", this.next.bind(this));

        this.nextBtn = nextBtn;
        this.backBtn = backBtn;
    },
    newRow: function() {
        var cell = new Element("div");
        this.t.appendChild(cell);
        return cell;
    },
    newStep: function(options) {
        return new ui.EmbedWizardStep(this, options);
    },
    newRadio: function(parent, text, name, selected) {
        var p = new Element("div");
        parent.appendChild(p);

        var id = util.generateID();
        var r = util.createInput("radio", p, name, selected, id);

        var label = new Element("label", {
            "for": id
        });
        label.appendChild(document.createTextNode(text));
        p.appendChild(label);

        return r;
    },
    addSteps: function() {
        var af = function(select) {
            if (Browser.Engine.trident) {
                var f = function() {
                    this.focus();
                    if (select)
                        this.select();
                };
                f.delay(100, this, []);
            } else {
                this.focus();
                this.select();
            }
        };

        this.welcome = this.newStep({
            "title": "Add webchat to your website",
            "first": "This wizard will help you create an embedded client by asking you questions then giving you the code to add to your website.<br/><br/>You can use the <b>Next</b> and <b>Back</b> buttons to navigate through the wizard; click <b>Next</b> to continue."
        });

        this.chanBox = new Element("input");
        this.chanBox.addClass("text");
        this.chans = this.newStep({
            "title": "Set channels",
            "first": "Enter the channels you would like the client to join on startup:",
            "hint": "You can supply multiple channels by seperating them with a comma, e.g.:",
            "example": "#rogue,#eu-mage",
            middle: this.chanBox
        }).addEvent("show", af.bind(this.chanBox));

        var customnickDiv = new Element("div");
        this.customnick = this.newStep({
            "title": "Choose a nickname mode",
            "first": "At startup would you like the client to use a random nickname, a preset nickname or a nickname of the users choice?",
            "hint": "It is recommended that you only use a preset nickname if the client is for your own personal use.",
            middle: customnickDiv
        });

        this.choosenick = this.newRadio(customnickDiv, "Make the user choose a nickname.", "nick", true);
        this.randnick = this.newRadio(customnickDiv, "Use a random nickname, e.g. qwebirc12883.", "nick");
        this.presetnick = this.newRadio(customnickDiv, "Use a preset nickname of your choice.", "nick");

        var promptdiv = new Element("form");
        this.connectdialog = this.newStep({
            "title": "Display connect dialog?",
            "first": "Do you want the user to be shown the connect dialog (with the values you have supplied pre-entered) or just a connect confirmation?",
            middle: promptdiv,
            "hint": "You need to display the dialog if you want the user to be able to set their nickname before connecting."
        });

        var changeOptions = new Element("div");
        this.currentLF = this.newRadio(changeOptions, "Use the current look and feel (", "lookandfeel", true);

        var alterButton = new Element("input");
        alterButton.type = "submit";
        alterButton.value = "alter";
        alterButton.addEvent("click", this.options.optionsCallback);
        changeOptions.firstChild.appendChild(alterButton);
        changeOptions.firstChild.appendChild(document.createTextNode(")."));

        this.defaultLF = this.newRadio(changeOptions, "Use the default look and feel.", "lookandfeel");

        this.lookandfeel = this.newStep({
            "title": "Configure look and feel",
            "first": "The look and feel will be copied from the current settings.",
            middle: changeOptions
        });

        var autoconnect = this.newRadio(promptdiv, "Connect without displaying the dialog.", "prompt", true);
        this.connectdialogr = this.newRadio(promptdiv, "Show the connect dialog.", "prompt");

        this.nicknameBox = new Element("input");
        this.nicknameBox.addClass("text");
        this.nickname = this.newStep({
            "title": "Set nickname",
            "first": "Enter the nickname you would like the client to use by default:",
            "premove": function() {
                if (this.nicknameBox.value == "") {
                    alert("You must supply a nickname.");
                    this.nicknameBox.focus();
                    return false;
                }
                var v = qwebirc.global.nicknameValidator.validate(this.nicknameBox.value, true);
                if (v != this.nicknameBox.value) {
                    this.nicknameBox.value = v;
                    alert("The supplied nickname was invalid and has been corrected.");
                    this.nicknameBox.focus();
                    return false;
                }
                return true;
            }.bind(this),
            middle: this.nicknameBox,
            hint: "If you use a . (dot/period) then it will be substituted with a random number."
        }).addEvent("show", af.bind(this.nicknameBox));

        var codeDiv = new Element("div");
        this.finish = this.newStep({
            "title": "Finished!",
            "first": "Your custom link is:",
            middle: codeDiv
        }).addEvent("show", function() {
            var alink = new Element("a");
            var abox = new Element("input");
            abox.addClass("iframetext");
            var url = this.generateURL(false);

            alink.href = url;
            alink.target = "_blank";
            alink.appendChild(document.createTextNode(url));
            abox.value = "<iframe src=\"" + url + "\" width=\"647\" height=\"400\"></iframe>";

            var mBox = [
                alink,
                new Element("br"), new Element("br"),
                document.createTextNode("You can embed this into your page with the following code:"),
                new Element("br"),
                abox
            ];

            while (codeDiv.childNodes.length > 0)
                codeDiv.removeChild(codeDiv.childNodes[0]);

            mBox.forEach(function(x) {
                codeDiv.appendChild(x);
            });

            af.bind(abox)(true);
            abox.addEvent("click", function() {
                this.select();
            }.bind(abox));
        }.bind(this));

        this.updateSteps();
        this.step = 0;

        this.showStep();
    },
    updateSteps: function() {
        this.steps = [this.welcome, this.customnick];

        if (this.presetnick.checked)
            this.steps.push(this.nickname);

        this.steps.push(this.chans);

        if (this.chanBox.value != "" && !this.choosenick.checked)
            this.steps.push(this.connectdialog);

        this.steps.push(this.lookandfeel);
        this.steps.push(this.finish);
    },
    showStep: function() {
        this.backBtn.disabled = !(this.step > 0);

        this.nextBtn.value = (this.step >= this.steps.length - 1) ? "Close" : "Next >";

        this.steps[this.step].show();
    },
    next: function() {
        var pm = this.steps[this.step].options.premove;

        if (pm && !pm())
            return;

        this.updateSteps();
        if (this.step >= this.steps.length - 1) {
            this.close();
            return;
        }
        this.step = this.step + 1;
        this.showStep();
    },
    close: function() {
        this.fireEvent("close");
    },
    back: function() {
        if (this.step <= 0)
            return;

        this.step = this.step - 1;
        this.showStep();
    },
    generateURL: function() {
        var chans = this.chanBox.value;
        var nick = this.nicknameBox.value;
        var connectdialog = this.connectdialogr.checked && chans != "" && !this.choosenick.checked;

        var URL = [];
        if (this.presetnick.checked) {
            URL.push("nick=" + escape(nick));
        } else if (!this.choosenick.checked) {
            URL.push("randomnick=1");
        }

        if (chans) {
            // var d = chans.split(",");
            // var d2 = [];

            // d.forEach(function(x) {
            //     if (x.charAt(0) == '#')
            //         x = x.substring(1);

            //     d2.push(x);
            // });

            var chanstr = util.unformatChannelString(chans);

            URL.push("channels=" + escape(chanstr));
        }

        if (connectdialog)
            URL.push("prompt=1");

        if (this.currentLF.checked) {
            var uioptions = this.options.uiOptions.serialise();
            if (uioptions != "")
                URL.push("uio=" + uioptions);
        }

        return this.options.baseURL + (URL.length > 0 ? "?" : "") + URL.join("&");
    }
});



ui.setTitle = function(title, options) {
    if (options && options.alert) {
        ui.setTitleAlert(title, options);
    } else {
        document.title = title;
    }
};

ui.supportsFocus = function() {
    var result = (util.isMobile || Browser.name === "Konqueror") ?  [false, false] : [true];

    ui.supportsFocus = $lambda(result);
    return result;
};

util.NBSPCreate = function(text, element) {
    var e = text.split("  ");
    e.each(function(txt, i) {
        var tn = document.createTextNode(txt);
        element.appendChild(tn);

        if (i != e.length - 1) {
            var e2 = new Element("span", {"html": "&nbsp;&nbsp;"});
            element.appendChild(e2);
        }
    });
};

util.setCaretPos = Element.setCaretPosition;

util.setAtEnd = function($el) {
    util.setCaretPos($el, $el.value.length);
};

util.getCaretPos = Element.getCaretPosition;

//....
//TODO this is garbage
util.createInput = function(type, parent, name, selected, id) {
    var r;
    if (Browser.Engine.trident) {
        if (name) {
            name = " name=\"" + escape(name) + "\"";
        } else {
            name = "";
        }
        if (id) {
            id = " id=\"" + escape(id) + "\"";
        } else {
            id = "";
        }
        r = $(document.createElement("<input type=\"" + type + "\"" + name + id + " " + (selected ? " checked" : "") + "/>"));
    } else {
        r = new Element("input");
        r.type = type;
        if (name) r.name = name;
        if (id) r.id = id;

        if (selected) r.checked = true;
    }

    parent.appendChild(r);
    return r;
};

util.percentToPixel= function(data, par) {
    par = par || document.body;
    var size = par.getSize();
    return {
        x: size.x * (data.x / 100),
        y: size.y * (data.y / 100)
    };
}


ui.decorateDropdown = function(btn, ddm, options) {
    ddm.hideMenu = function() {
        if(options && options.onHide)
            options.onHide.call(this, ddm);
        return ddm.hide();
    };
    ddm.showMenu = function() {
        if(options && options.onShow)
            options.onShow.call(this, ddm);

        if (ddm.isDisplayed()) {
           ddm.hideMenu();
        } else {
            ddm.show();
            document.addEvent("click:once", ddm.hideMenu);
        }
        return ddm;
    };

    ddm.position.delay(50, ddm, {
        relativeTo: btn,
        position: {x: 'left', y: 'bottom'},
        edge: {x: 'left', y: 'top'}
    });

    btn.addEvent("click", function(e) {
            e.stop();
            ddm.showMenu();
        });
    return ddm.hideMenu();
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

            $ele.getSiblings().each(function(sib) {
                offset += sib.getSize()[method];
            });

            $ele.setStyle(style, "calc(100% - " + offset + "px)");
        });
    }

    filler.delay(20);
    return $ele;
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


var keys;
if(!util.isMobile) {
    keys = new Keyboard();
} else {
    delete window.Keyboard;
}



//not a class?
ui.MENU_ITEMS = (function() {
    function isOpped(nick) {
        var channel = this.name; /* window name */
        var myNick = this.client.nickname;

        return this.client.nickOnChanHasAtLeastPrefix(myNick, channel, "@");
    }

    function isVoiced(nick) {
        var channel = this.name;
        var myNick = this.client.nickname;

        return this.client.nickOnChanHasPrefix(myNick, channel, "+");
    }

    function targetOpped(nick) {
        var channel = this.name;
        return this.client.nickOnChanHasPrefix(nick, channel, "@");
    }

    function targetVoiced(nick) {
        var channel = this.name;
        return this.client.nickOnChanHasPrefix(nick, channel, "+");
    }

    function command(cmd) {
        return function(nick) {
            this.client.exec("/" + cmd + " " + nick);
        };
    }

    return [{
        text: "whois",
        fn: command("whois"),
        predicate: true
    }, {
        text: "query",
        fn: command("query"),
        predicate: true
    }, {
        text: "slap",
        fn: function(nick) {
            this.client.exec("/ME " + util.formatter(lang.fishbot, {
                'nick': nick
            }));
        },
        predicate: true
    }, {
        text: "kick",
        /* TODO: disappear when we're deopped */
        fn: function(nick) {
            this.client.exec("/KICK " + nick + " wibble");
        },
        predicate: isOpped
    }, {
        text: "op",
        fn: command("op"),
        predicate: prelude.andand(isOpped, Functional.not(targetOpped))
    }, {
        text: "deop",
        fn: command("deop"),
        predicate: prelude.andand(isOpped, targetOpped)
    }, {
        text: "voice",
        fn: command("voice"),
        predicate: prelude.andand(isOpped, Functional.not(targetVoiced))
    }, {
        text: "devoice",
        fn: command("devoice"),
        predicate: prelude.andand(isOpped, targetVoiced)
    }];
})();


ui.RequestTransformHTML = function(options) {
    var HREF_ELEMENTS = ["IMG"];

    var $update = options.update;
    var onSuccess = options.onSuccess;

    var fixUp = function(node) {
            if (node.nodeType !== Node.ELEMENT_NODE)
                return;

            if (HREF_ELEMENTS.contains(node.nodeName.toUpperCase())) {
                var attr = node.getAttribute("transform_attr");
                var value = node.getAttribute("transform_value");
                if ($defined(attr) && $defined(value)) {
                    node.removeProperties("transform_attr", "transform_value")
                        .setProperty(attr, qwebirc.global.staticBaseURL + value);
                }
            }

            Array.each(node.childNodes, fixUp);
        };

    delete options["update"];
    options.onSuccess = function(tree, elements, html, js) {
        var container = new Element("div", {'html': html});
        fixUp(container);
        $update.empty();

        Array.each(container.childNodes, function(node) {
            node.swapParent($update);
        });
        onSuccess();
    };

    return new Request.HTML(options);
};


ui.Theme = new Class({
    initialize: function(themeDict) {
        var self = this,
            theme = self.__theme = Object.clone(ui.themes.Default2);

        if (themeDict) {
            // for (var k in themeDict) {
            //     theme[k] = themeDict[k];
            // }
            $extend(theme, themeDict);
        }
        Object.each(theme, function(data, key) {
            if (key === "PREFIX")
                return;

            if (data[1]) {
                theme[key] = theme.PREFIX + data[0];
            } else {
                theme[key] = data[0];
            }
        });

        self.__ccmap = Object.clone(ui.themes.ThemeControlCodeMap2);
        self.__ccmaph = Object.clone(self.__ccmap);

        self.__ccmaph["("] = self.message("HILIGHT", {}, self.__ccmap);
        self.__ccmaph[")"] = self.message("HILIGHTEND", {}, self.__ccmap);
        self.__ccmaph["{"] = self.__ccmaph["}"] = "";
    },

    //fuck that this is awful - use String.substitute with a regex
    __dollarSubstitute: function(x, h, mapper) {
        // if (x == '-${$($N$)$}:$c- $m' && h['c'] == BROUHAHA)
        //     x = '-${$($N$)$}- $m';
        // var msg = [];

        // var n = x.split("");
        // //loop of the devil
        // for (var i = 0; i < n.length; i++) {
        //     var c = n[i];
        //     if (c == "$" && (i <= n.length - 1)) {
        //         var c2 = n[++i];

        //         var o = mapper[c2];
        //         if (!o)
        //             o = h[c2];
        //         if (o)
        //             msg.push(o);
        //     } else {
        //         msg.push(c);
        //     }
        // }

        // return msg.join("");

        return x.substitute(Object.append(h||{}, mapper||{}))
    },
    message: function(type, data, hilight) {
        var map;
        if (hilight) {
            map = this.__ccmaph;
        } else {
            map = this.__ccmap;
        }

        if (data && data["n"])
            data["N"] = "qwebirc://whois/" + data.n + "/";
        return this.__dollarSubstitute(this.__theme[type], data, map);
    }
});

// ui.HilightController = new Class({
//     initialize: function(parent) {
//         this.parent = parent;
//         this.regex = null;
//         this.prevnick = null;
//     },
//     match: function(text) {
//         var nick = this.parent.nickname;
//         if (nick !== this.prevnick) {
//             var classes = '[\\s\\.,;:]';
//             this.regex = new RegExp('(^|' + classes + ')' + RegExp.escape(nick) + '(' + classes + '|$)', "i");
//         }
//         return this.regex.test(text);
//     }
// });


ui.TabCompleterFactory = new Class({
    initialize: function(ui) {
        this.ui = ui;
        this.reset();
    },
    tabComplete: function(textBox) {
        var text = textBox.value;

        if (!$defined(this.obj)) {
            this.incr = 1;

            var win = this.ui.getActiveWindow();
            if (!win)
                return;

            var startingWord = util.getEnclosedWord(text, util.getCaretPos(textBox));
            var preword = "",
                word = "",
                postword = "";
            if ($defined(startingWord)) {
                preword = text.substring(0, startingWord[0]);
                word = startingWord[1];
                postword = text.substring(startingWord[0] + word.length);
            }

            var ltext = text.toLowerCase(),
                obj;
            if (!text) {
                preword = "/msg ";
                obj = ui.QueryTabCompleter;
            } else if (util.isChannel(word)) {
                obj = ui.ChannelNameTabCompleter;
            } /*else if (false //ltext.match(/^\/(q|query|msg) /i) ) {
                obj = ui.QueryTabCompleter;
            }*/ else if (win.type === ui.WINDOW_QUERY) {
                obj = ui.QueryNickTabCompleter;
            } else if (win.type === ui.WINDOW_CHANNEL) { /* "slug[TAB]" == "slug: " */
                if (!preword) {
                    // if ( !! postword && postword.charAt(0) === " ") {
                    //     postword = ":" + postword; //should i call util.padcolon here?
                    // } else {
                    //     postword = ": " + postword;
                    // }
                    postword = ": " + postword.trimLeft();

                    this.incr++;
                }
                obj = ui.ChannelUsersTabCompleter;
            } else {
                return;
            }

            if (postword === "")
                postword = " ";

            this.obj = new obj(preword, word, postword, win);
            if (!$defined(this.obj))
                return;
        }

        var ret = this.obj.get();
        if (!$defined(ret))
            return;

        textBox.value = ret[1];
        util.setCaretPos(textBox, ret[0] + this.incr);
    },
    reset: function() {
        this.obj = null;
    }
});

ui.TabIterator = new Class({
    initialize: function(client, prefix, list) {
        this.prefix = prefix;
        if (!$defined(list) || list.length === 0) {
            this.list = null;
        } else {
            var prefixes = irc.toIRCCompletion(client, prefix);

            /* convert the nick list to IRC lower case, stripping all non letters
             * before comparisions */
            // for (var i = 0; i < list.length; i++) {
            //     var l2 = irc.toIRCCompletion(client, list[i]);

            //     if (l2.startsWith(prefixes))
            //         l.push(list[i]);
            // }
            var listf = list.filter(Functional.compose(util.prefixOnNick(prefixes), irc.toIRCCompletion.curry(client)));

            this.list = listf;
        }

        this.pos = -1;
    },
    next: function() {
        /*
         * ideally next would do the list gubbins recursively, but no JS engine currently
         * support tail recursion :(
         */
        if (!$defined(this.list))
            return null;

        this.pos = this.pos + 1;
        if (this.pos >= this.list.length)
            this.pos = 0;

        return this.list[this.pos];
    }
});

ui.BaseTabCompleter = new Class({
    initialize: function(client, prefix, existingNick, suffix, list) {
        this.existingNick = existingNick;
        this.prefix = prefix;
        this.suffix = suffix;
        this.iterator = new ui.TabIterator(client, existingNick, list);
    },
    get: function() {
        var n = this.iterator.next();
        if (!$defined(n))
            return null;

        var p = this.prefix + n;
        return [p.length, p + this.suffix];
    }
});

ui.QueryTabCompleter = new Class({
    Extends: ui.BaseTabCompleter,
    initialize: function(prefix, existingNick, suffix, win) {
        this.parent(win.client, prefix, existingNick, suffix, win.client.lastNicks);
    }
});

ui.QueryNickTabCompleter = new Class({
    Extends: ui.BaseTabCompleter,
    initialize: function(prefix, existingText, suffix, win) {
        var chan = win.name;
        this.parent(win.client, prefix, existingText, suffix, [chan]);
    }
});

ui.ChannelNameTabCompleter = new Class({
    Extends: ui.BaseTabCompleter,
    initialize: function(prefix, existingText, suffix, window) {

        var l = [];
        Object.each(window.client.channels, function(chan, name) {
            if($defined(chan)) {
                chan = chan.lastSelected;
            }
            l.push([chan, name]);
        });

        var l2 = l.sort(function(a, b) {
            return b[0] - a[0];
        }).map(prelude.item(1));

        this.parent(window.client, prefix, existingText, suffix, l2);
        // this.parent.apply(this, Array.concat(window.client, arguments, l2));
    }
});

ui.ChannelUsersTabCompleter = new Class({
    Extends: ui.BaseTabCompleter,
    initialize: function(prefix, existingText, suffix, window) {
        var nc = window.client.tracker.getSortedByLastSpoke(irc.activeChannel);

        this.parent(window.client, prefix, existingText, suffix, nc);
    }
});



/*
    TODO: Options:
    - templating get rid of tables
    - beep/flash/highligh on text infinite regexp list
    - custom sounds?

*/


/**
 * Note that options are settable by the uioptions url arg by default unless you specifiy
 * settableByURL...
 */
config.DEFAULT_OPTIONS = [
    //option is a structure:
    // 0: id
    // 1: alias
    // 2: description of option
    // 3: default val
    // 4: setter
    [1, "BEEP_ON_MENTION", "Beep when nick mentioned or on query activity (requires Flash or html5)", true,
    {
        enabled: $lambda([true]),
        applyChanges: function(value, ui) {
            if ($defined(ui.setBeepOnMention))
                ui.setBeepOnMention(value);
        }
    }],
    [7, "FLASH_ON_MENTION", "Flash titlebar when nick mentioned or on query activity", true,
    {
        enabled: ui.supportsFocus
    }],
    [2, "DEDICATED_MSG_WINDOW", "Send privmsgs to dedicated messages window", false],
    [4, "DEDICATED_NOTICE_WINDOW", "Send notices to dedicated message window", false],
    [3, "NICK_OV_STATUS", "Show status (@/+) before nicknames in channel lines", true],
    [5, "ACCEPT_SERVICE_INVITES", "Automatically join channels when invited by Q", true,
    {
        settableByURL: false
    }],
    [6, "USE_HIDDENHOST", "Hide your hostmask when authed to Q (+x)", true,
    {
        settableByURL: false
    }],
    [8, "LASTPOS_LINE", "Show a last position indicator for each window", true,
    {
        enabled: ui.supportsFocus
    }],
    [9, "NICK_COLOURS", "Automatically colour nicknames", false],
    [10, "HIDE_JOINPARTS", "Hide JOINS/PARTS/QUITS", false],
    [11, "STYLE_HUE", "Adjust user interface hue", function() {
        return {
            class_: config.HueOption,
            default_: 210
        };
    }, {
        applyChanges: function(value, ui) {
            ui.setModifiableStylesheetValues({
                hue: value
            });
        }
    }],
    [12, "QUERY_ON_NICK_CLICK", "Query on nickname click in channel", false],
    [13, "SHOW_NICKLIST", "Show nickname list in channels", true],
    [14, "SHOW_TIMESTAMPS", "Show timestamps", true] /* we rely on the hue update */ ];

config.DefaultOptions = null;

config.Input = new Class({
    initialize: function(parent, option, position, parentObject) {
        this.option = option;
        this.value = option.value;
        this.enabled = this.option.enabled;
        this.position = position;
        this.parentElement = parent;
        this.parentObject = parentObject;
        this.render();
    },

    createInput: function(type, parent, name, selected, id) {
        if (!$defined(parent))
            parent = this.parentElement;

        return util.createInput(type, parent, name, selected, this.option.id);
    },

    FE: function(element, parent) {
        var n = new Element(element);
        if (!$defined(parent)) parent = this.parentElement;

        parent.adopt(n);
        return n;
    },

    focus: function() {
        this.mainElement.focus();
    },

    render: function() {
        this.event("render", this.mainElement);
    },

    applyChanges: function() {
        this.event("applyChanges", [this.get(), this.parentObject.optionObject.ui]);
    },

    event: function(name, x) {
        if (!$defined(this.option.extras)) return;
        var t = this.option.extras[name];
        if (!$defined(t)) return;

        t.pass(x, this)();
    },

    cancel: function() {}
});

config.TextInput = new Class({
    Extends: config.Input,
    render: function() {
        var i = this.createInput("text");
        this.mainElement = i;

        i.value = this.value;
        i.disabled = !this.enabled;

        this.parent();
    },

    get: function() {
        return this.mainElement.value;
    }
});

config.HueInput = new Class({
    Extends: config.Input,
    render: function() {
        var i = new Element("div");
        i.addClass("qwebirc-optionspane");
        i.addClass("hue-slider");
        this.parentElement.appendChild(i);

        var k = new Element("div");
        k.addClass("knob");
        if (Browser.Engine.trident) {
            k.setStyle("top", "0px");
            k.setStyle("background-color", "black");
        }

        i.appendChild(k);

        var slider = new Slider(i, k, {
            steps: 36,
            range: [0, 369],
            wheel: true
        });
        slider.set(this.value);
        this.startValue = this.value;

        slider.addEvent("change", function(step) {
            this.value = step;
            this.applyChanges();
        }.bind(this));
        this.mainElement = i;

        if (!this.enabled) slider.detach();

        this.parent();
    },
    get: function() {
        return this.value;
    },
    cancel: function() {
        this.value = this.startValue;
        this.applyChanges();
    }
});

config.CheckInput = new Class({
    Extends: config.Input,
    render: function() {
        var i = this.createInput("checkbox", null, null, null, this.id);
        this.mainElement = i;

        i.checked = this.value;
        i.disabled = !this.enabled;

        this.parent();
    },
    get: function() {
        return this.mainElement.checked;
    }
});

config.RadioInput = new Class({
    Extends: config.Input,
    render: function() {
        var value = this.option.options;

        this.elements = [];

        for (var i = 0; i < value.length; i++) {
            var d = this.FE("div", this.parentObject);
            var e = this.createInput("radio", d, "options_radio" + this.position, i == this.option.position);
            this.elements.push(e);
            e.disabled = !this.enabled;

            if (i === 0)
                this.mainElement = e;

            d.appendChild(document.createTextNode(value[i][0]));
        };
        this.parent();
    },
    get: function() {
        for (var i = 0; i < this.elements.length; i++) {
            var x = this.elements[i];
            if (x.checked) {
                this.option.position = i;
                return this.option.options[i][1];
            }
        }
    }
});

config.Option = new Class({
    initialize: function(optionId, prefix, label, default_, extras) {
        this.prefix = prefix;
        this.label = label;
        this.default_ = default_;
        this.optionId = optionId;
        this.extras = extras;

        if ($defined(extras) && $defined(extras.enabled)) {
            var enabledResult = extras.enabled();
            this.enabled = enabledResult[0];

            if (!enabledResult[0] && enabledResult.length > 1)
                this.default_ = enabledResult[1];
        } else {
            this.enabled = true;
        }

        if ($defined(extras) && $defined(extras.settableByURL)) {
            this.settableByURL = extras.settableByURL;
        } else {
            this.settableByURL = true;
        }
    },
    setSavedValue: function(x) {
        if (this.enabled)
            this.value = x;
    }
});

config.RadioOption = new Class({
    Extends: config.Option,
    Element: config.RadioInput,
    initialize: function(optionId, prefix, label, default_, extras, options) {
        this.options = options.map(function(x) {
            return (typeof(x) === "string") ? [x, x] : x;
        });
        this.defaultposition = default_;

        this.parent(optionId, prefix, label, this.options[default_][1], extras);
    },
    setSavedValue: function(x) {
        for (var i = 0; i < this.options.length; i++) {
            var y = this.options[i][1];
            if (x === y) {
                this.position = i;
                this.value = x;
                return;
            }
        }
        this.position = this.defaultposition;
        this.value = this.default_;
    }
});

config.TextOption = new Class({
    Extends: config.Option,
    Element: config.TextInput
});

config.CheckOption = new Class({
    Extends: config.Option,
    Element: config.CheckInput
});

config.HueOption = new Class({
    Extends: config.Option,
    Element: config.HueInput
});

ui.Options = new Class({
    initialize: function(ui) {
        if (!$defined(config.DefaultOptions)) this.__configureDefaults();

        this.optionList = config.DefaultOptions.slice();
        this.optionHash = {};
        this.ui = ui;

        this._setup();
        this.optionList.each(function(x) {
            x.setSavedValue(this._get(x));
            this.optionHash[x.prefix] = x;
            this[x.prefix] = x.value;
        }.bind(this));
    },
    __configureDefaults: function() {
        config.DefaultOptions = config.DEFAULT_OPTIONS.map(function(opt) {
            var optionId = opt[0];
            var prefix = opt[1];
            var label = opt[2];
            var default_ = opt[3];
            var moreextras = opt[4];
            var extras = opt[5];

            var stype = typeof(default_);
            if (stype == "number") {
                return new config.RadioOption(optionId, prefix, label, default_, moreextras, extra);
            } else {
                var type;
                if (stype == "boolean") {
                    type = config.CheckOption;
                } else if (stype == "function") {
                    var options = default_();
                    type = options.class_;
                    default_ = options.default_;
                } else {
                    type = config.TextOption;
                }
                return new type(optionId, prefix, label, default_, moreextras);
            }
        });
    },
    setValue: function(option, value) {
        this.optionHash[option.prefix].value = value;
        this[option.prefix] = value;
    },
    getOptionList: function() {
        return this.optionList;
    },
    _get: function(opt) {
        return opt.default_;
    },
    _setup: function() {},
    flush: function() {}
});

ui.OptionsPane = new Class({
    Implements: [Events],
    initialize: function(parentElement, optionObject) {
        this.parentElement = parentElement;
        this.optionObject = optionObject;

        this.createElements();
    },
    createElements: function() {
        var FE = function(element, parent) {
                var n = new Element(element);
                parent.appendChild(n);
                return n;
            };

        var t = FE("table", this.parentElement);
        var tb = FE("tbody", t);

        this.boxList = [];

        var optList = this.optionObject.getOptionList();
        for (var i = 0; i < optList.length; i++) {
            var opt = optList[i];

            var row = FE("tr", tb);
            var cella = FE("td", row);

            opt.id = qwebirc.util.generateID();
            var label = new Element("label", {
                "for": opt.id
            });
            cella.appendChild(label);
            label.set("text", opt.label + ":");

            var cellb = FE("td", row);
            this.boxList.push([opt, new opt.Element(cellb, opt, i, this)]);

        }

        var r = FE("tr", tb);
        var cella = FE("td", r);
        var cellb = FE("td", r);
        var save = qwebirc.util.createInput("submit", cellb);
        save.value = "Save";

        save.addEvent("click", function() {
            this.save();
            this.fireEvent("close");
        }.bind(this));

        var cancel = qwebirc.util.createInput("submit", cellb);
        cancel.value = "Cancel";
        cancel.addEvent("click", function() {
            this.cancel();
            this.fireEvent("close");
        }.bind(this));
    },
    save: function() {
        this.boxList.each(function(opt) {
            var option = opt[0];
            var box = opt[1];
            this.optionObject.setValue(option, box.get());
        }.bind(this));
        this.boxList.each(function(opt) {
            opt[1].applyChanges();
        }.bind(this));
        this.optionObject.flush();
    },
    cancel: function() {
        this.boxList.each(function(opt) {
            opt[1].cancel();
        }.bind(this));
    }
});

ui.CookieOptions = new Class({
    Extends: ui.Options,
    _setup: function() {
        // this.__cookie = new Hash.Cookie("opt1", {
        //     duration: 3650,
        //     autoSave: false
        // });
        this.storage = storage;
        this.__key = "opt1";
        this.__options = this.storage.get(this.__key) || {};
    },
    _get: function(option) {
        // var v = this.__cookie.get(option.optionId); 
        var val = this.__options[option.optionId];
        return $defined(val) ? val : option.default_;
    },
    flush: function() {
        // this.storage.remove(this.__key);
        // this._setup();

        // var opts = this.getOptionList().each(function(option) {
        //     this.__cookie.set(option.optionId, option.value);
        // }.bind(this));
        // this.__cookie.save();
        var opts = {};
        this.getOptionList().each(function(option) {
            if(option.value !== option.default_) { //minimize stored data
                opts[option.optionId] = option.value;
            }
        });
        this.__options = opts;
        this.storage.set(this.__key, opts);
    }
});

ui.SuppliedArgOptions = new Class({
    Extends: ui.CookieOptions,
    initialize: function(ui, arg) {
        var p = {};

        if ($chk(arg) && arg.length > 2) {
            var checksum = arg.substr(arg.length - 2, 2);
            var decoded = util.B64.decode(arg.substr(0, arg.length - 2));

            if (decoded && (new crypto.MD5().digest(decoded).slice(0, 2) == checksum))
                p = util.parseURI("?" + decoded);
        }

        this.parsedOptions = p;
        this.parent(ui);
    },

    _get: function(opt) {
        if (opt.settableByURL !== true)
            return this.parent(opt);

        var option = this.parsedOptions[opt.optionId];

        return $defined(option) ? opt : this.parent(opt);
    },

    serialise: function() {
        var result = [];
        this.getOptionList().each(function(opt) {
            if (opt.settableByURL && opt.default_ != opt.value)
                result.push(opt.optionId + "=" + opt.value);
        }.bind(this));

        var raw = result.join("&");
        var checksum = new crypto.MD5().digest(raw).slice(0, 2);
        return (qwebirc.util.B64.encode(raw)).replaceAll("=", "") + checksum;
    }
});

ui.DefaultOptionsClass = new Class({
    Extends: ui.SuppliedArgOptions
});


util.parseStylesheet = function(data) {
    var lines = data.replace(/\r/g, "") //irnore double breaks
                    .split("\n");

    var rules = {},
        line, inx,
        i;
    for (var i = 0; i < lines.length; i++) {
        line = lines[i];

        if (line.trim() !== "" && (inx = line.indexOf("=", 2)) !== -1)
            rules[line.slice(0, inx)] = line.slice(inx + 1);
        else
            break;
    }

    var cssLines = lines.slice(i);
    // for (; i < lines.length; i++) //note its using the same i as above
    //     cssLines.push(lines[i]);

    return {
        cssText: cssLines.join("\n"),
        rules: rules
    };
};

util.getSyncAsset = function(url) {
    var req = new Request({
        'url': url,//'http://atf2.org/css/qui-bbc577ad5cb78d946ac1.mcss',
        'async': false
    });
    req.headers = {};
    var result;
    req.addEvent("complete", function(x) {
            result = x;
        })
        .get();
    return result;
};

ui.style.ModifiableStylesheet = new Class({
    initialize: function(url) {
        var n = util.parseStylesheet(util.getSyncAsset(url));

        this.__cssText = n.cssText;
        this.rules = n.rules;

        this.__tag = new Element("style", {
                        type: "text/css",
                        media: "all"
                    }).inject(document.head, 'bottom');
    },
    __setStylesheet: function(stylesheet) {
        var node = this.__tag;

        if (node.styleSheet) { /* IE */
            node.styleSheet.cssText = stylesheet;
        } else {
            node.empty()
                .appendText(stylesheet);
        }
    },
    set: function(mutatorfn) {
        mutatorfn = mutatorfn || $identity;

        var text = this.__cssText;

        Object.each(this.rules, function(val, key) {
            var s = val.split(","),
                value = mutatorfn.pass(s);

            text = text.replaceAll("$(" + key + ")", value);
        });

        this.__setStylesheet(text);
    }
});


ui.Window = new Class({
    Implements: [Events],
    initialize: function(parentObject, client, type, name, identifier) {
        this.parentObject = parentObject;
        this.type = type;
        this.currentChannel = this.name = name;
        this.active = false;
        this.client = client;
        this.identifier = identifier;
        this.hilighted = ui.HILIGHT_NONE;
        // this.scrolltimer = null;
        this.commandhistory = this.parentObject.commandhistory;
        // this.scrolleddown = true;
        // this.scrollpos = null;
        this.lastNickHash = {};
        this.lastSelected = null;
        this.subWindow = null;
        this.closed = false;

        if (this.type & ui.WINDOW_LASTLINE) {
            this.lastPositionLine = Element.from(templates.messageLine());
            this.lastPositionLineInserted = false;
        }

        this.window = this.parentObject.qjsui.createWindow();
    },
    updateTopic: function(topic, element) {
        ui.Colourise("[" + topic + "]", element, this.client.exec, this.parentObject.urlDispatcher, this);
    },
    close: function() {
        this.closed = true;

        // if ($defined(this.scrolltimer)) {
        //     $clear(this.scrolltimer);
        //     this.scrolltimer = null;
        // }

        this.parentObject.__closed(this);
        this.fireEvent("close", this);
    },
    subEvent: function(event) {
        if ($defined(this.subWindow))
            this.subWindow.fireEvent(event);
    },
    setSubWindow: function(win) {
        this.subWindow = win;
    },

    select: function() {
        if (this.lastPositionLineInserted && !this.parentObject.uiOptions.LASTPOS_LINE) {
            this.lines.disown(this.lastPositionLine);
            this.lastPositionLineInserted = false;
        }

        this.active = true;
        this.parentObject.__setActiveWindow(this);
        if (this.hilighted)
            this.highlightTab(ui.HILIGHT_NONE);

        this.subEvent("select");
        // this.resetScrollPos();
        this.lastSelected = new Date();
    },

    deselect: function() {
        this.subEvent("deselect");

        // this.setScrollPos();
        // if ($defined(this.scrolltimer)) {
        //     $clear(this.scrolltimer);
        //     this.scrolltimer = null;
        // }

        if (this.type & ui.WINDOW_LASTLINE)
            this.replaceLastPositionLine();

        this.active = false;
    },

    resetScrollPos: function() {
        // if (this.scrolleddown) {
        //     this.scrollToBottom();
        // } else if ($defined(this.scrollpos)) {
        //     this.getScrollParent().scrollTo(this.scrollpos.x, this.scrollpos.y);
        // }
    },
    setScrollPos: function() {
        // if (!this.parentObject.singleWindow) {
        //     this.scrolleddown = this.scrolledDown();
        //     this.scrollpos = this.lines.getScroll();
        // }
    },


    /* A line is an object of the form:
    -: current nick
    @: opstatus
    c: channel
    f: origin channel
    h: ip of propogater
    m: msg
    n: nick
    */

    addLine: function(type, line, colour, $ele) {
        var self = this,
            uiobj = self.parentObject;
        var hilight = ui.HILIGHT_NONE,
            hl_line = false;

        if (type && line) {
        //regexs
            var isbot = /^TF2/.test(line.n), //works for pugna(hl), mix(hl)
                ismsg = /(NOTICE|ACTION|MSG)$/.test(type),
                regNotice = /NOTICE$/,
                sentByUs = /^OUR/.test(type),//ignore
                containsNick = util.testForNick(self.client.nickname);

            var notice = function() {
                if (!(self.active && uiobj.windowFocused) && line.c !== BROUHAHA) {
                    uiobj.beep();
                    uiobj.flash();
                }
            };

            hilight = ui.HILIGHT_ACTIVITY;

            if (ismsg) {
                //highlighting
                if (line.n && line.m && self.type === ui.WINDOW_CHANNEL) {
                    $ele.addClass('message');
                    if(isbot)
                        $ele.addClass('bot');
                    else if(sentByUs)
                        $ele.addClass('our');
                    if(!isbot && line.m.startsWith("!"))
                        $ele.addClass('command');
                }

                if (self.type === ui.WINDOW_QUERY || self.type === ui.WINDOW_MESSAGES) {
                    if (sentByUs || regNotice.test(type)) {
                        hilight = ui.HILIGHT_ACTIVITY;
                    } else {
                        hilight = ui.HILIGHT_US;
                        notice(); //private message
                    }
                }
                else if (regNotice.test(type) && self.type === ui.WINDOW_CHANNEL) {
                    $ele.style.color = "red";
                    notice();
                }
                else if (!sentByUs && containsNick(line.m)) { //dont beep if bot says our name
                    if(isbot) {
                        $ele.addClass('bot@us')
                    }
                    else {
                        hl_line = true;
                        hilight = ui.HILIGHT_US;
                        notice();//name mention in chan
                    }
                }
                else if (hilight !== ui.HILIGHT_US) {
                    hilight = ui.HILIGHT_SPEECH;
                }
            }
        }

        if (!self.active && (hilight !== ui.HILIGHT_NONE))
            self.highlightTab(hilight);

        if (type)
            line = uiobj.theme.message(type, line, hl_line);

        var tsE = templates.timestamp({time:util.IRCTimestamp(new Date())});
        $ele.insertAdjacentHTML('afterbegin', tsE);
        // $ele.appendChild($ele.from(tsE));

        ui.Colourise(line, $ele, self.client.exec, uiobj.urlDispatcher, self);
        // self.scrollAdd($ele);
        self.lines.adopt($ele);
    },
    errorMessage: function(message) {
        this.addLine("", message, "warncolour");
    },
    infoMessage: function(message) {
        this.addLine("", message, "infocolour");
    },
    highlightTab: function(state) {
        if (state == ui.HILIGHT_NONE || state >= this.hilighted)
            this.hilighted = state;
    },

    //holy shit i got this to actually make sense
    // takes nicks (sorted array)
    updateNickList: function(nicks) {
        var lnh = this.lastNickHash,
            oldnames = Object.keys(lnh),

            added = prelude.difference(nicks, oldnames),//users who joined
            left = prelude.difference(oldnames, nicks); //users who left

        left.each(function(nick) {
            var element = lnh[nick];
            this.nickListRemove(nick, element);
            delete lnh[nick];
        }, this);

        added.each(function(nick) {
            var index = nicks.indexOf(nick); //indx in sorted array
            lnh[nick] = this.nickListAdd(nick, index) || 1;
        }, this);
    },

    nickListAdd: function(nick, position) {},
    nickListRemove: function(nick, stored) {},
    historyExec: function(line) {
        this.commandhistory.addLine(line);
        this.client.exec(line, this.currentChannel);
    },
    focusChange: function(newValue) {
        if (!(newValue !== true || (this.type & ui.WINDOW_LASTLINE)))
            this.replaceLastPositionLine();
    },
    replaceLastPositionLine: function() {
        if (this.parentObject.uiOptions.LASTPOS_LINE) {
            if (!this.lastPositionLineInserted) {
                // this.scrollAdd(this.lastPositionLine);
            } else if (this.lines.lastChild !== this.lastPositionLine) {
                try {
                    this.lines.disown(this.lastPositionLine);
                } catch (e) { /* IGNORE, /clear removes lastPositionLine from the dom without resetting it. */
                }
                // this.scrollAdd(this.lastPositionLine);
            }
        } else {
            if (this.lastPositionLineInserted)
                this.lines.disown(this.lastPositionLine);
        }

        this.lastPositionLineInserted = this.parentObject.uiOptions.LASTPOS_LINE;
    }
});


ui.QUI.Window = new Class({
    Extends: ui.Window,
    Binds: ["close", "attach", "detach", "selectTab", "nickChange", "nickClick", "editTopic", "updatePrefix"],

    initialize: function(parentObject, client, type, name, identifier) {
        var self = this;
        self.parent(parentObject, client, type, name, identifier);


        var qwindow = self.window;
        qwindow.detached = self.detached = false;

        var $tab = self.tab = Element.from(templates.ircTab({
                'name': (name === BROUHAHA) ? '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' : name
            })).inject(parentObject.tabs),
            $tabDetach = $tab.getElement('.detach');

        if(name === BROUHAHA) {
            $tab.addClass('brouhaha');
        }



        // var elchanid = document.getElementById('channel-name-id');

        $tab.addEvents({
                focus: $tab.blur,
                click: self.selectTab,
                dblclick: function(e) {
                    e.stop();

                    if (self.closed)
                        return;

                    parentObject.selectWindow(self);
                }
            })
            .store("window", self);

        $tabDetach.addEvent('click', self.detach);

        if (!isBaseWindow(name)) {
            // var tabclose = new Element("span");
            // tabclose.set("text", "X");
            // tabclose.addClass("tabclose");
            var $tabclose = Element.from(templates.tabClose()),
                close = self.close;
            //close window

            $tabclose.addEvent("click", close);
            $tab.addEvent("mouseup", function(e) {
                    var button = Browser.Engine.trident ? 4 : 1;

                    if (e.event.button === button)
                        close(e);
                })
                .adopt($tabclose);
        }

        var lines = self.lines = qwindow.middle;
            lines.store("window", self);
        // self.parentObject.qjsui.applyClasses("middle", self.lines);
        if (type !== ui.WINDOW_CUSTOM && type !== ui.WINDOW_CONNECT) {
            qwindow.window.addClass('ircwindow');
                // .set('id', 'mainircwindow');
            self.fxscroll = new Fx.AutoScroll(lines, {
            });
            self.highlighter = new Highlighter(lines, { //highlight last 5 messages
                filter: function($ele) {
                    return $ele.hasClass('message') &&
                        !$ele.hasClass('bot') &&
                        !$ele.hasClass('command') &&//msg 2 bot
                        !$ele.hasClass('our');//from us
                },
                selector: '.message:not(.bot):not(.command):not(.our)',
                maxHighlight: NaN
            });

            lines.store("fxscroll", self.fxscroll)
                .store("client", self.client);

        } else {
            qwindow.window.addClass(name.capitalize().replace(" ", "-"));//Connection Details -> Connection-Details
        }

        // lines.addEvent("scroll", function() {
        //     self.scrolleddown = self.scrolledDown();
        //     self.scrollpos = self.getScrollParent().getScroll();
        // });

        if (type === ui.WINDOW_CHANNEL) {
            qwindow.window.addClass('channel');

            qwindow.topic.html(templates.topicBar({topic:false}));
            var topic = self.topic = qwindow.topic;
            topic.addEvent("dblclick", self.editTopic);
            self.updateTopic("");

            var $nicklist = self.nicklist = qwindow.right;
            $nicklist.addClass("nicklist")
                    // .addEvent("click", self.removePrevMenu.bind(self))
                    .addEvent("click:relay(a.user)", self.nickClick)
                    .addEvent("focus:relay(a)", $nicklist.blur);


            var $divider = self.divider = Element.from(templates.verticalDivider())
                                                    .inject($nicklist, "before");
            //cant create splitpane here because elements are still hidden
        }

        var properties = self.properties = Element.from(templates.channelName({channel: name}))
                                                    .inject(qwindow.properties);

        if(util.windowNeedsInput(type))
            qwindow.bottom.appendChild(self.createInput());


        self.nicksColoured = self.parentObject.uiOptions.NICK_COLOURS;
        // self.reflow();
    },

    close: function(e) {
        if(e)
            e.stop();

        if (this.closed)
            return;

        if (isChannelType(this.type) && (!isBaseWindow(this.name)) && !util.wasKicked()) {
            var client = this.client,
                channels = util.removeChannel(client.channels, this.name);

            client.exec("/PART " + this.name);
            client.storeChannels(channels);
        }
        this.parent();

        this.parentObject.tabs.disown(this.tab);

        if(this.detached) {
            this.wrapper.destroy();
        } else {
            this.window.window.destroy();
        }

        // this.tab.dispose();
        // this.reflow();
    },

    attach: function(e) {
        var win = this.window.window,
            wrapper = this.wrapper,
            po = this.parentObject;

        this.window.detached = this.detached = false;

        wrapper.hide();
        win.hide();
        // wrapper.removeChild(win);
        win.replaces(wrapper);
        wrapper.destroy();

        this.drag.detach().stop();
        this.resizable.detach().stop();
        this.wrapper = this.resizable = this.drag = undefined;

        this.tab.show();
        this.select();

        this.fireEvent('attach');
    },

    detach: function(e) {
        var self = this,
            win = self.window.window,
            po = self.parentObject,
            qjsui = po.qjsui,

            wrapper = self.wrapper = Element.from(templates.detachedWindow({
                                                                'channel': this.name,
                                                                'base': util.isBaseWindow(this.name)
                                                            })),
            header = wrapper.getElement('.header'),
            attach = header.getElement('.attach'),
            close = header.getElement('.tab-close'),

            resizeWrapper = Element.from(templates.resizeHandle()),
            resizeHandle = resizeWrapper.getElement('.resize-handle'),

            setActive = function(e) {
                po.windowArray.each(function(win) {
                    if(win.detached)
                        win.wrapper.removeClass('active');
                });
                wrapper.addClass('active');
            };

        attach.addEvent('click', self.attach);
        if(close) {
            close.addEvent('click', self.close);
        }

        //change window if we're active
        if(self.active)
            po.nextWindow(1, self);

        var size = util.percentToPixel({x:40, y:60}, qjsui.parent);
        wrapper.setStyles({
                "width": size.x,
                "height": size.y
            })
            .wraps(win) //*** adds wrapper to dom
            .adopt(resizeWrapper);
        win.show()
            .addEvent("mousedown", Event.stopPropagation);//prevent draggin occurring while clickin window
        setActive();

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

        wrapper.addEvents({
            click: setActive
        });


        self.selectUpdates();

        // util.centerElement(wrapper, qjsui.parent);
        wrapper.position();

        self.detached = self.window.detached = true;

        //keeps order
        self.tab.hide();

        self.fireEvent('detach');
    },

    selectTab: function(e) {
        var self = this;
        if(self.name !== BROUHAHA) {
            self.parentObject.windowArray.each(function(win) {
                if(!win.detached && (!e || e.type !== "click" || win.name !== BROUHAHA)) {//keep brouhaha selected if its from a single click
                    win.tab.swapClass("tab-selected", "tab-unselected");
                }
                if(win.name === BROUHAHA) {
                    if(util.isChannelType(self.type)) {
                        win.properties.text(self.name); //update current channel in brouhaha
                        win.currentChannel = self.name;
                    }
                }
            });
        }
        irc.activeChannel = self.name;
        self.tab.removeClasses("tab-hilight-activity", "tab-hilight-us", "tab-hilight-speech")
                .swapClass("tab-unselected", "tab-selected");
    },

    select: function() {
        this.selectTab();

        //changing windows occurs here
        this.parentObject.setWindow(this.window);

        // this.reflow();
        this.parent();

        this.selectUpdates();
    },

    //styles and ui things to update
    selectUpdates: function() {
        var self = this,
            parentObject = self.parentObject;

        if(self.nicklist && !self.split) {
            // (function() { //wait a sec for the styles to be calculated
            //     self.split = new Drag.SplitPane(self.divider, {
            //         // store: new Storage('__panelwidth')
            //     });
            // }).delay(50);
        }

        if(self.fxscroll) {//scroll to bottom
            self.fxscroll.autoScroll();
        }

        if (util.windowNeedsInput(self.type)) {
            util.fillContainer(self.$inputbox);
            self.$inputbox.focus();
        }

        if(util.isChannelType(self.type)) {
            if (self.nicksColoured !== parentObject.uiOptions.NICK_COLOURS) {
                self.nicksColoured = parentObject.uiOptions.NICK_COLOURS;

                var nodes = self.nicklist.childNodes;
                if (parentObject.uiOptions.NICK_COLOURS) {
                    Array.each(nodes, function(node) {
                        var colour = util.toHSBColour(node.retrieve("nick"), self.client);
                        if ($defined(colour))
                            node.firstChild.setStyle("color", colour.rgbToHex());
                    });
                } else {
                    Array.each(nodes, function(node) {
                        node.firstChild.setStyle("color", null);
                    });
                }
            }

            self.updatePrefix();
        }

    },

    deselect: function() {
        this.parent();

        this.tab.swapClass("tab-selected", "tab-unselected");
    },

    editTopic: function() {
        if (!this.client.nickOnChanHasPrefix(this.client.nickname, this.name, "@")) {
/*      var cmodes = this.client.getChannelModes(channel);
      if(cmodes.indexOf("t")) {*/
            return alert(lang.needOp.message); /*}*/
        }
        var newTopic = prompt(util.formatter(lang.changeTopicConfirm.message, {channel: this.name}), this.topic.topicText);
        if (!$defined(newTopic))
            return;

        this.client.exec("/TOPIC " + newTopic);
    },

    //creates the input box on the bottom
    createInput: function() {
        var self = this,
            parentO = self.parentObject,

            inputtype = Browser.isMobile ?  "mobile-input": "keyboard-input",

            nick = self.client.nickname,

            $form = Element.from(templates.ircInput({'nick': nick, 'status': '', type: inputtype})),
            $nicklabel = self.$nicklabel = $form.getElement('.nickname'),
            $inputbox = self.$inputbox = $form.getElement('.input-field'),
            $inputbtn = $form.getElement('.input-button'),

            sendInput = function(e) {
                if(e)
                    e.stop();
                if ($inputbox.value.trim() !== "") {
                    parentO.resetTabComplete();
                    self.historyExec($inputbox.value);
                    $inputbox.value = "";
                }
                $inputbox.focus();
            }

        if (Browser.isMobile) {
            $inputbtn.addClass("mobile-button");
        } else {
            $inputbox.addEvents({
                blur: function() {
                    window.keyboardInputFocus = 0;
                },
                focus: function() {
                    window.keyboardInputFocus = 1;
                }
            });
        }

        var resettab = parentO.resetTabComplete,
            complete = function(e) {
                var resultfn;
                var cvalue = $inputbox.value;

                if (e.key === "up") {
                    resultfn = self.commandhistory.upLine;
                } else if (e.key === "down") {
                    resultfn = self.commandhistory.downLine;
                } else if (e.key === "tab" && !e.ctrl) {
                    e.stop();
                    self.tabComplete($inputbox);
                    return;
                } else { /* ideally alt and other keys wouldn't break self */
                    parentO.resetTabComplete();
                    return;
                }
                e.stop();

                parentO.resetTabComplete();
                if ((!!cvalue) && (self.lastcvalue !== cvalue))
                    self.commandhistory.addLine(cvalue, true);

                var result = resultfn.call(self.commandhistory);//.bind(self.commandhistory)();

                if (!result)
                    result = "";
                self.lastcvalue = result;

                $inputbox.value = result;
                util.setAtEnd($inputbox);
            };

        if(isChannelType(self.type)) {
            self.client.addEvents({
                "mode": self.updatePrefix
            });
        }

        $nicklabel.addEvent("dblclick", function() {
            var nick = prompt("Enter a new nickname", self.nickname);
            if(nick) {
                self.client.exec("/nick " + nick);
            }
        });

        $inputbtn.addEvent("click", sendInput);
        $form.addEvent("submit", sendInput);
        $inputbox.addEvents({
                    "focus": resettab,
                    "mousedown": resettab,
                    "keydown": complete
                    });
        return $form;
    },

    updatePrefix: function (data) {
        var prefix;
        if(data) {
            if(data.channel === this.name)
                prefix = data.prefix;
            else return;
        } else {
            prefix = this.client.getNickStatus(this.name, this.client.nickname)
        }
        this.$nicklabel.getElement('.status')
                        .removeClasses('op', 'voice')
                        .addClass((prefix === OPSTATUS) ? "op" : (prefix === VOICESTATUS) ? "voice" : "")
        util.fillContainer(this.$inputbox);
    },

    nickClick: function(evt, $tar) { //delegation to nick items
        var hasMenu = $tar.hasClass('selected-middle');

        this.removePrevMenu(); //collapse old menus
        if (!hasMenu) {
            this.moveMenuClass($tar);
            $tar.addClass("selected")
                .store("menu", this.createMenu($tar.retrieve("nick"), $tar));
        }
    },

    // - clicking user in nick list
    createMenu: function(nick, $parent) {
        var pmenu = $parent.retrieve('menu');
        if(pmenu) {
            return pmenu.toggle();
        }

        var $menu = Element.from(templates.menuContainer()),
            self = this;

        (ui.MENU_ITEMS.filter(function(item) {
            var pred = item.predicate;

            return ($type(pred) === 'function') ? pred.call(self, nick) : //pred.apply(this, nickArray)
                                                  !!pred;
        })).each(function(item) {
            Element.from(templates.nickbtn({'nick': "- " + item.text}))
                    .store("action", item.fn)
                    .inject($menu);
        });

        $menu.addEvent('click:relay(.user)', function(e, target) {
                e.stop();
                self.menuClick(target.retrieve("action"));
            })
            .addEvent('focus:relay(a)', Element.prototype.blur)
            .inject($parent);

        return $menu;
    },

    menuClick: function(fn) {
        var selected = this.nicklist.getElement('.selected');
        //i dont understand why these arent equivalent
        fn.call(this, selected.retrieve("nick"));
        this.removePrevMenu();
    },

    moveMenuClass: function($sel) {
        $sel = $($sel) || this.nicklist.getElement('.selected-middle, .selected');
        if (!$sel){}
        else if (this.nicklist.firstChild === $sel) {
            $sel.removeClass("selected-middle");
        } else {
            $sel.addClass("selected-middle");
        }
    },

    removePrevMenu: function() {
        var $sel = this.nicklist.getElements('.selected-middle, .selected');
        if ($sel) {
            $sel.removeClasses("selected", "selected-middle");
            var $menu = $sel.retrieve('menu');
            if ($menu) {
                $menu.dispose();
                $sel.eliminate('menu');
            }
        }
    },

    nickListAdd: function(nick, position) {
        var realNick = util.stripPrefix(this.client.prefixes, nick);

        var nickele = Element.from(templates.nickbtn({'nick': nick}));
        var span = nickele.getElement('span');
        nickele.store("nick", realNick);


        if (this.parentObject.uiOptions.NICK_COLOURS) {
            var colour = util.toHSBColour(realNick, this.client);
            if ($defined(colour))
                span.setStyle("color", colour.rgbToHex());
        }

        this.nicklist.insertAt(nickele, position);
        this.moveMenuClass();

        return nickele;
    },

    nickListRemove: function(nick, stored) {
        try {
            this.nicklist.removeChild(stored);
            this.moveMenuClass();
        } catch (e) {
        }
    },

    updateTopic: function(topic) {
        var topice = this.topic.empty();

        topice.topicText = topic;
        if (topic) {
            this.parent(topic, topice);
        } else {
            topice.html(templates.topicText({topic:lang.noTopic.message, empty:true}));
        }
        // this.reflow();
    },

    //TODO do all processing in template?
    addLine: function(type, line, colourClass) {
        // var e = new Element("div");
        var eclass = colourClass || (this.lastcolour ? "linestyle1" : "linestyle2");

        var msge = Element.from(templates.ircMessage({class: eclass}));
        this.lastcolour = !this.lastcolour;

        this.parent(type, line, colourClass, msge);
        // this.reflow();
    },
    highlightTab: function(state) {
        this.parent(state);

        if (state == this.hilighted)
            return;

        //inefficient as fuck
        this.tab.removeClasses("tab-hilight-activity", "tab-hilight-us", "tab-hilight-speech");

        switch (state) {
        case ui.HILIGHT_US:
            this.tab.addClass("tab-hilight-us");
            break;
        case ui.HILIGHT_SPEECH:
            this.tab.addClass("tab-hilight-speech");
            break;
        case ui.HILIGHT_ACTIVITY:
            this.tab.addClass("tab-hilight-activity");
            break;
        }
    }
});

//close the iife and call with this
})(this);
