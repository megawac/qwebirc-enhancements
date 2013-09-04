this["qwebirc"] = this["qwebirc"] || {};
this["qwebirc"]["templates"] = this["qwebirc"]["templates"] || {};

this["qwebirc"]["templates"]["wizard"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"header\">\r\n<table>\r\n<tr>\r\n<td><img src=\"images/qwebircsmall.png\" alt=\"qwebirc\" title=\"qwebirc\"/></td>\r\n<td>&nbsp;&nbsp;&nbsp;&nbsp;</td>\r\n<td><div class=\"title\">qwebirc</div><div class=\"version\">Add qwebirc to your site</div></td>\r\n</tr>\r\n</table>\r\n</div>\r\n<div class=\"mainbody\">\r\n<p>I currently do not support the embedded wizard but you can form qwebirc from <a href=\"https://github.com/megawac/qwebirc-enhancements\">my github repo</a></p>\r\n<input type=\"button\" value=\"Close\" data-event=\"close\" class=\"btn btn-default btn-small\" />\r\n</div>";
  });