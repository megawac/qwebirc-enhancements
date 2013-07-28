
// hacky... todo simplify
// ui.Colourise = function(line, entity, execfn, cmdfn, win) {
//     var fg;
//     var bg;
//     var underline = false;
//     var bold = false;
//     var autoNickColour = false;

//     var out = [];
//     var xline = line.split("");
//     var element = new Element("span");

//     entity.addClass("colourline");

//     function parseColours(xline, i) {
//         if(isNaN(xline[i + 1])) {
//             fg = undefined;
//             bg = undefined;
//             return i;
//         }
//         i++;
//         if(prelude.isNumber(xline[i + 1])) {
//             fg = parseInt(xline[i] + xline[i + 1]);
//             i++;
//         } else {
//             fg = parseInt(xline[i]);
//         }
//         if(xline[i + 1] != ",")
//             return i;
//         else if(isNaN(xline[i + 2]))
//             return i;
//         i+=2;

//         if(prelude.isNumber(xline[i + 1])) {
//             bg = parseInt(xline[i] + xline[i + 1]);
//             i++;
//         } else {
//             bg = parseInt(xline[i]);
//         }
//         return i;
//     }

//     function emitEndToken() {
//         var data = "";
//         if (out.length > 0) {
//             data = ui.urlificate(element, out.join(""), execfn, cmdfn, win);
//             entity.appendChild(element);
//             out.empty();
//         }
//         element = document.createElement("span"); //?
//         return data;
//     }

//     function emitStartToken() {
//         if(autoNickColour)
//             return element;

//         var classes = "";
//         if(fg !== undefined)
//             classes = concatSpace(classes, "Xc" + fg); //text colour
//         if(bg !== undefined)
//             classes = concatSpace(classes, "Xbc" + bg); //background
//         if(bold)
//             classes = concatSpace(classes, "Xb"); //style
//         if(underline)
//             classes = concatSpace(classes, "Xu");
//         element.className = classes;
//         // element.className = classes.join(" ");
//   }

//     var nickColouring = win.parentObject.uiOptions2.get("nick_colours"); /* HACK */
//     var capturingNick = false;

//     //evil confusing loop
//     for (var i = 0; i < xline.length; i++) {
//         var lc = xline[i];

//         if (nickColouring) {
//             if (!capturingNick) {
//                 if (lc == "\x00") {
//                     capturingNick = true;
//                     emitEndToken();
//                     continue;
//                 }
//             } else {
//                 if (lc != "\x00") {
//                     out.push(lc);
//                 } else {
//                     autoNickColour = true;
//                     var e = emitStartToken();
//                     var text = emitEndToken();

//                     var c = util.toHSBColour(text, win.client);
//                     if ($defined(c)) e.style.color = c.rgbToHex();
//                     capturingNick = autoNickColour = false;
//                 }
//                 continue;
//             }
//         } else if (lc == "\x00") {
//             continue;
//         }

//         if (lc == "\x02") {
//             emitEndToken();

//             bold = !bold;

//             emitStartToken();
//         } else if (lc == "\x1F") {
//             emitEndToken();

//             underline = !underline;

//             emitStartToken();
//         } else if (lc == "\x0F") {
//             emitEndToken();

//             fg = undefined;
//             bg = undefined;
//             underline = false;
//             bold = false;
//         } else if (lc == "\x03") {
//             emitEndToken();

//             i = parseColours(xline, i);
//             if (bg > 15) bg = undefined;
//             if (fg > 15) fg = undefined;

//             emitStartToken();
//         } else {
//             out.push(lc);
//         }
//     }

//     emitEndToken();
// };
