this["qwebirc"] = this["qwebirc"] || {};
this["qwebirc"]["templates"] = this["qwebirc"]["templates"] || {};

this["qwebirc"]["templates"]["feedback"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"header\">\r\n<table>\r\n<tr>\r\n<td><img src=\"images/qwebircsmall.png\" alt=\"qwebirc\" title=\"qwebirc\"/></td>\r\n<td>&nbsp;&nbsp;&nbsp;&nbsp;</td>\r\n<td><div class=\"title\">qwebirc</div><div>Feedback</div></td>\r\n</tr>\r\n</table>\r\n</div>\r\n<div class=\"mainbody\">\r\n<div class=\"enterarea\">\r\n<p class=\"maintext\">We'd love to hear what you think about our web IRC client (in English please):</p>\r\n<p><textarea cols=\"80\" rows=\"10\" class=\"mainarea\"></textarea></p>\r\n<p>Include your name if you'd like us to get back to you!</p>\r\n\r\n<input type=\"submit\" value=\"Submit\" class=\"submitfeedback\" />\r\n<input type=\"button\" value=\"Close\" data-event=\"close\" class=\"btn btn-default btn-small\" />\r\n</div>\r\n<div class=\"messagearea\" style=\"display: none\">\r\n<p class=\"messagetext\"></p>\r\n<input type=\"button\" value=\"Close\" data-event=\"close\" class=\"btn btn-default btn-small hidden\" />\r\n</div>\r\n</div>";
  });