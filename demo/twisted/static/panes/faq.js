this["qwebirc"] = this["qwebirc"] || {};
this["qwebirc"]["templates"] = this["qwebirc"]["templates"] || {};

this["qwebirc"]["templates"]["faq"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"header\">\r\n<table>\r\n<tr>\r\n<td><img src=\"images/qwebircsmall.png\" alt=\"qwebirc\" title=\"qwebirc\"/></td>\r\n<td>&nbsp;&nbsp;&nbsp;&nbsp;</td>\r\n<td><div class=\"title\">qwebirc</div><div class=\"version\">Frequently Asked Questions</div></td>\r\n</tr>\r\n</table>\r\n</div>\r\n<div class=\"mainbody\">\r\n<h2>Can I make the widget autoconnect?</h2>\r\n<p>No, if this was allowed then bad people could IFRAME lots and lots of copies, which would get you glined for having too many clones.<br/>However you can prefill the channel/nickname information (type /EMBED in the main window).</p>\r\n\r\n<p>To be continued...</p>\r\n<input type=\"button\" value=\"Close\" data-event=\"close\" class=\"btn btn-default btn-small\" />\r\n</div>";
  });