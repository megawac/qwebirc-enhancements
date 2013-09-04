this["qwebirc"] = this["qwebirc"] || {};
this["qwebirc"]["templates"] = this["qwebirc"]["templates"] || {};

this["qwebirc"]["templates"]["feedback"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"header\">\r\n<table>\r\n<tr>\r\n<td><img src=\"images/qwebircsmall.png\" alt=\"qwebirc\" title=\"qwebirc\"/></td>\r\n<td>&nbsp;&nbsp;&nbsp;&nbsp;</td>\r\n<td><div class=\"title\">qwebirc</div><div>Feedback</div></td>\r\n</tr>\r\n</table>\r\n</div>\r\n<div class=\"mainbody\">\r\n<p>\r\nThank you for taking the time to try to submit feedback. I currently have not updated this part of the project<br/>\r\nIf you have found an issue please submit it on my <a href=\"https://github.com/megawac/qwebirc-enhancements\">github repo</a><br/>\r\nThanks for using my app!\r\n</p>\r\n\r\n<p>To be continued...</p>\r\n<input type=\"button\" value=\"Close\" data-event=\"close\" class=\"btn btn-default btn-small\" />\r\n</div>";
  });