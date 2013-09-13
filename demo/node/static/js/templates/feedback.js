this["qwebirc"] = this["qwebirc"] || {};
this["qwebirc"]["templates"] = this["qwebirc"]["templates"] || {};

this["qwebirc"]["templates"]["feedback"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"header\"><table><tr><td><img src=\"images/qwebircsmall.png\" alt=\"qwebirc\" title=\"qwebirc\"/></td><td>&nbsp;&nbsp;&nbsp;&nbsp;</td><td><div class=\"title\">qwebirc</div><div>Feedback</div></td></tr></table></div><div class=\"mainbody\"><p>Thank you for taking the time to try to submit feedback. I currently have not updated this part of the project<br/>If you have found an issue please submit it on my <a href=\"https://github.com/megawac/qwebirc-enhancements\">github repo</a><br/>Thanks for using my app!</p><p>To be continued...</p><input type=\"button\" value=\"Close\" data-event=\"close\" class=\"btn btn-default btn-small\" /></div>";
  });