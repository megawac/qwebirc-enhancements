this["qwebirc"] = this["qwebirc"] || {};
this["qwebirc"]["templates"] = this["qwebirc"]["templates"] || {};

this["qwebirc"]["templates"]["popup-dialog"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var stack1, stack2;
  stack2 = ((stack1 = depth0.content),typeof stack1 === functionType ? stack1.apply(depth0) : stack1);
  if(stack2 || stack2 === 0) { return stack2; }
  else { return ''; }
  }

function program3(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "<div class=\"controls\"><label>"
    + escapeExpression(((stack1 = depth0.text),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</label><input class=\"form-control input-block-level\" type=\"text\" ";
  stack2 = helpers['if'].call(depth0, depth0.placeholder, {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += " ";
  stack2 = helpers['if'].call(depth0, depth0.value, {hash:{},inverse:self.noop,fn:self.program(6, program6, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "></div>";
  return buffer;
  }
function program4(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "placeholder=\""
    + escapeExpression(((stack1 = depth0.placeholder),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"";
  return buffer;
  }

function program6(depth0,data) {
  
  var stack1;
  return escapeExpression(((stack1 = depth0.value),typeof stack1 === functionType ? stack1.apply(depth0) : stack1));
  }

function program8(depth0,data) {
  
  var stack1, stack2;
  stack2 = ((stack1 = depth0.footer),typeof stack1 === functionType ? stack1.apply(depth0) : stack1);
  if(stack2 || stack2 === 0) { return stack2; }
  else { return ''; }
  }

function program10(depth0,data) {
  
  
  return "<input type=\"button\" class=\"cancel btn btn-warning btn-small\" data-dismiss=\"modal\" value=\"Cancel\"><input type=\"button\" class=\"submit btn btn-primary btn-small\" data-dismiss=\"modal\" value=\"Submit\">";
  }

  buffer += "<div class=\"modal fade in\" style=\"display: block;\"><div class=\"modal-dialog\"><div class=\"modal-content\"><div class=\"modal-header\"><button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">×</button><h4 class=\"modal-title\">"
    + escapeExpression(((stack1 = depth0.title),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</h4></div><div class=\"modal-body alert-info\">";
  stack2 = helpers['if'].call(depth0, depth0.content, {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "</div><div class=\"modal-footer\">";
  stack2 = helpers['if'].call(depth0, depth0.footer, {hash:{},inverse:self.program(10, program10, data),fn:self.program(8, program8, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "</div></div></div></div>";
  return buffer;
  });