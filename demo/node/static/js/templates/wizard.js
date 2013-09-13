this["qwebirc"] = this["qwebirc"] || {};
this["qwebirc"]["templates"] = this["qwebirc"]["templates"] || {};

this["qwebirc"]["templates"]["wizard"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"header\"><table><tr><td><img src=\"images/qwebircsmall.png\" alt=\"qwebirc\" title=\"qwebirc\"/></td><td>&nbsp;&nbsp;&nbsp;&nbsp;</td><td><div class=\"title\">qwebirc</div><div class=\"version\">Add qwebirc to your site</div></td></tr></table></div><div class=\"mainbody\"><p>I currently do not support the embedded wizard but you can form qwebirc from <a href=\"https://github.com/megawac/qwebirc-enhancements\">my github repo</a></p><input type=\"button\" value=\"Close\" data-event=\"close\" class=\"btn btn-default btn-small\" /></div>";
  });