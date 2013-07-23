/* qwebirc -- Copyright (C) 2008-2011 Chris Porter and the qwebirc project --- All rights reserved. */

QWEBIRC_BUILD="4972564a42c050c0779d";

if(typeof QWEBIRC_BUILD != "undefined") {
  qwebirc.BUILD = QWEBIRC_BUILD;
  qwebirc.FILE_SUFFIX = "-" + QWEBIRC_BUILD;
} else {
  qwebirc.BUILD = null;
  qwebirc.FILE_SUFFIX = "";
}

qwebirc.VERSION = "0.91"

Array.prototype.indexFromEnd = function(d) {
  var p = this;
  
  if(d < 0)
    return p[p.length + d];

  return p[d];
}

qwebirc.util.dictCopy = function(d) {
  var n = {};
  for(var k in d)
    n[k] = d[k];

  return n;
}

/* how horribly inefficient */
String.prototype.replaceAll = function(f, t) {
  //return new RegExp("/" + RegExp.escape(f) + "/g").replace(f, RegExp.escape(t));
  var i = this.indexOf(f);
  var c = this;
 
  while(i > -1) {
    c = c.replace(f, t);
    i = c.indexOf(f);
  }
  return c;
}

/* how horribly inefficient (again) */
String.prototype.splitMax = function(by, max) {
  var items = this.split(by);
  var newitems = items.slice(0, max-1);

  if(items.length >= max)
    newitems.push(items.slice(max-1).join(by));
  
  return newitems;
}

/* returns the arguments */
qwebirc.util.parseURI = function(uri) {
  var result = {}

  var start = uri.indexOf('?');
  if(start == -1)
    return result;
    
  var querystring = uri.substring(start + 1);
  
  var args = querystring.split("&");
  
  for(var i=0;i<args.length;i++) {
    var r = args[i].splitMax("=", 2);
    if(r.length < 2)
      continue;
      
    result[unescape(r[0])] = unescape(r[1]);
  }
  
  return result;
}

qwebirc.util.DaysOfWeek = {
  0: "Sun",
  1: "Mon",
  2: "Tue",
  3: "Wed",
  4: "Thu",
  5: "Fri",
  6: "Sat"
};

qwebirc.util.MonthsOfYear = {
  0: "Jan",
  1: "Feb",
  2: "Mar",
  3: "Apr",
  4: "May",
  5: "Jun",
  6: "Jul",
  7: "Aug",
  8: "Sep",
  9: "Oct",
  10: "Nov",
  11: "Dec"
};

qwebirc.util.NBSPCreate = function(text, element) {
  var e = text.split("  ");
  for(var i=0;i<e.length;i++) {
    var tn = document.createTextNode(e[i]);
    element.appendChild(tn);
    
    if(i != e.length - 1) {
      var e2 = new Element("span");
      e2.set("html", "&nbsp;&nbsp;");
      element.appendChild(e2);
    }
  }
};

qwebirc.util.longtoduration = function(l) {
  var seconds = l % 60;
  var minutes = Math.floor((l % 3600) / 60);
  var hours = Math.floor((l % (3600 * 24)) / 3600);
  var days = Math.floor(l / (24*3600));
  
  return days + " days " + hours + " hours " + minutes + " minutes " + seconds + " seconds";
}

qwebirc.util.pad = function(x) {
  x = "" + x;
  if(x.length == 1)
    return "0" + x;
  return x
}

RegExp.escape = function(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

qwebirc.ui.insertAt = function(position, parent, element) {
  if(!parent.childNodes || (position >= parent.childNodes.length)) {
    parent.appendChild(element);
  } else {
    parent.insertBefore(element, parent.childNodes[position]);
  }
}

qwebirc.util.setCaretPos = function(obj, pos) {
  if($defined(obj.selectionStart)) { 
    obj.focus(); 
    obj.setSelectionRange(pos, pos); 
  } else if(obj.createTextRange) { 
    var range = obj.createTextRange(); 
    range.move("character", pos); 
    range.select();
  }
}

qwebirc.util.setAtEnd = function(obj) {
  qwebirc.util.setCaretPos(obj.value.length);
}

qwebirc.util.getCaretPos = function(element) {
  if($defined(element.selectionStart))
    return element.selectionStart;
    
  if(document.selection) {
    element.focus();
    var sel = document.selection.createRange();
    sel.moveStart("character", -element.value.length);
    return sel.text.length;
  }
}

qwebirc.util.browserVersion = function() {
  //return "engine: " + Browser.Engine.name + " platform: " + Browser.Platform.name + " user agent: " + navigator.userAgent;
  return navigator.userAgent;
}

qwebirc.util.getEnclosedWord = function(text, position) {
  var l = text.split("");
  var buf = [];
  
  if(text == "")
    return;

  var start = position - 1;
  if(start < 0) {
    /* special case: starting with space */    
    start = 0;
  } else {
    /* work back until we find the first space */
    for(;start>=0;start--) {
      if(l[start] == ' ') {
        start = start + 1;
        break;
      }
    }
  }
  
  if(start < 0)
    start = 0;
    
  var s = text.substring(start);
  var pos = s.indexOf(" ");
  if(pos != -1)
    s = s.substring(0, pos);
    
  return [start, s];
}

String.prototype.startsWith = function(what) {
  return this.substring(0, what.length) == what;
}

/* NOT cryptographically secure! */
qwebirc.util.randHexString = function(numBytes) {
  var getByte = function() {
    return (((1+Math.random())*0x100)|0).toString(16).substring(1);
  };
  
  var l = [];
  for(var i=0;i<numBytes;i++)
    l.push(getByte());
  
  return l.join("");
}

qwebirc.util.importJS = function(name, watchFor, onload) {
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = name;
  
  if(Browser.Engine.trident) {
    /* HORRID */
    var checkFn = function() {
      if(eval("typeof " + watchFor) != "undefined") {
        onload();
      } else {
        checkFn.delay(100);
      }
    }
    checkFn();
  } else {
    script.onload = onload;
  }
  document.getElementsByTagName("head")[0].appendChild(script);
}

qwebirc.util.createInput = function(type, parent, name, selected, id) {
  var r;
  if(Browser.Engine.trident) {
    if(name) {
      name = " name=\"" + escape(name) + "\"";
    } else {
      name = "";
    }
    if(id) {
      id = " id=\"" + escape(id) + "\"";
    } else {
      id = "";
    }
    r = $(document.createElement("<input type=\"" + type + "\"" + name + id + " " + (selected?" checked":"") + "/>"));
  } else {    
    r = new Element("input");
    r.type = type;
    if(name)
      r.name = name;
    if(id)
      r.id = id;
      
    if(selected)
      r.checked = true;
  }
    
  parent.appendChild(r);
  return r;
}

/* From: www.webtoolkit.info */
qwebirc.util.b64Table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
qwebirc.util.b64Encode = function(data) {
  var output = [];
  var table = qwebirc.util.b64Table;
  for(var i=0;i<data.length;) {
    var chr1 = data.charCodeAt(i++);
    var chr2 = data.charCodeAt(i++);
    var chr3 = data.charCodeAt(i++);

    var enc1 = chr1 >> 2;
    var enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
    var enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
    var enc4 = chr3 & 63;

    if(isNaN(chr2)) {
      enc3 = enc4 = 64;
    } else if(isNaN(chr3)) {
      enc4 = 64;
    }

    output.push(table.charAt(enc1) + table.charAt(enc2) + table.charAt(enc3) + table.charAt(enc4));
  }
  return output.join("");
}

/* From: www.webtoolkit.info */
qwebirc.util.b64Decode = function(data) {
  data = data.replace(/[^A-Za-z0-9\+\/\=]/g, "");

  var output = [];
  var table = qwebirc.util.b64Table;
  
  /* grossly inefficient... so sue me */
  while(data.length % 4 != 0)
    data = data + "=";
    
  for(var i=0;i<data.length;) {
    var enc1 = table.indexOf(data.charAt(i++));
    var enc2 = table.indexOf(data.charAt(i++));
    var enc3 = table.indexOf(data.charAt(i++));
    var enc4 = table.indexOf(data.charAt(i++));

    var chr1 = (enc1 << 2) | (enc2 >> 4);
    var chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
    var chr3 = ((enc3 & 3) << 6) | enc4;

    output.push(String.fromCharCode(chr1));
    if (enc3 != 64)
      output.push(String.fromCharCode(chr2));
    if (enc4 != 64)
      output.push(String.fromCharCode(chr3));
  }

  return output.join("");
}

qwebirc.util.composeAnd = function() {
 var xargs = arguments;

  return function() {
    for(var i=0;i<xargs.length;i++)
      if(!xargs[i].apply(this, arguments))
        return false;
        
    return true;
  }
}

qwebirc.util.invertFn = function(fn) {
  return function() {
    return !fn.apply(this, arguments);
  }
}

qwebirc.util.deviceHasKeyboard = function() {
  var determine = function() {
    if(Browser.Engine.ipod)
      return true;

    var MOBILE_UAs = ["Nintendo Wii", " PIE", "BlackBerry", "IEMobile", "Windows CE", "Nokia", "Opera Mini", "Mobile", "mobile", "Pocket", "pocket", "Android"];
    /* safari not included because iphones/ipods send that, and we checked for iphone/ipod specifically above */
    var DESKTOP_UAs = ["Chrome", "Firefox", "Camino", "Iceweasel", "K-Meleon", "Konqueror", "SeaMonkey", "Windows NT", "Windows 9"];

    var ua = navigator.userAgent;

    var contains = function(v) {
      return ua.indexOf(v) > -1;
    }

    for(var i=0;i<MOBILE_UAs.length;i++)
      if(contains(MOBILE_UAs[i]))
        return false;
      
    for(var i=0;i<DESKTOP_UAs.length;i++)
      if(contains(DESKTOP_UAs[i]))
        return true;
      
    return false;
  };
  var v = determine();
  
  qwebirc.util.deviceHasKeyboard = function() {
    return v;
  }
  
  return v;
}

qwebirc.util.generateID_ID = 0;
qwebirc.util.generateID = function() {
  return "qqa-" + qwebirc.util.generateID_ID++;
}
qwebirc.util.crypto.getARC4Stream = function(key, length) {
  var s = [];

  var keyint = [];
  for(var i=0;i<key.length;i++)
    keyint.push(key.charCodeAt(i));

  for(var i=0;i<256;i++)
    s[i] = i;
  
  var j = 0;
  for(var i=0;i<256;i++) {
    j = (j + s[i] + keyint[i % key.length]) & 255;
    var w = s[i]; s[i] = s[j]; s[j] = w;
  }

  var output = [];
  var i = 0;
  var j = 0;
  for(var k=0;k<length;k++) {
    i = (i + 1) & 255;
    j = (j + s[i]) & 255;

    var w = s[i]; s[i] = s[j]; s[j] = w;
    output.push(s[(s[i] + s[j]) & 255]);
  }
  return output;
}

qwebirc.util.crypto.xorStreams = function(data, prngstream) {
  if(data.length != prngstream.length)
    return;

  var output = [];
  for(var i=0;i<data.length;i++)
    output.push(String.fromCharCode(data.charCodeAt(i) ^ prngstream[i]));

  return output.join("");
}

qwebirc.util.crypto.ARC4 = function(key, data) {
  var prngstream = qwebirc.util.crypto.getARC4Stream(key, data.length + 1024);
  /* burn first 1024 bytes */
  prngstream = prngstream.slice(1024);

  return qwebirc.util.crypto.xorStreams(data, prngstream);
}

/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Copyright (C) Paul Johnston 1999 - 2000.
 * See http://pajhome.org.uk/site/legal.html for details.
 */

/*
 * Converted freestanding JavaScript code to fully encapsulated object.
 * Andrew Collins, andrewrcollins@yahoo.com, 2000-11-28
 */

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

qwebirc.util.crypto.MD5 = function() {
  this.digest = calcMD5;

/*
 * Convert a 32-bit number to a hex string with ls-byte first
 */
  var hex_chr = "0123456789abcdef";
  function rhex(num)
  {
    var str = "";
    for(var j = 0; j <= 3; j++)
      str += hex_chr.charAt((num >> (j * 8 + 4)) & 0x0F) + hex_chr.charAt((num >> (j * 8)) & 0x0F);
    return str;
  }

/*
 * Convert a string to a sequence of 16-word blocks, stored as an array.
 * Append padding bits and the length, as described in the MD5 standard.
 */
  function str2blks_MD5(str)
  {
    var nblk = ((str.length + 8) >> 6) + 1;
    var blks = new Array(nblk * 16);
    for(var i = 0; i < nblk * 16; i++) blks[i] = 0;
    for(var i = 0; i < str.length; i++)
      blks[i >> 2] |= str.charCodeAt(i) << ((i % 4) * 8);
    blks[i >> 2] |= 0x80 << ((i % 4) * 8);
    blks[nblk * 16 - 2] = str.length * 8;
    return blks;
  }

/*
 * Add integers, wrapping at 2^32
 */
  function add(x, y)
  {
    return ((x&0x7FFFFFFF) + (y&0x7FFFFFFF)) ^ (x&0x80000000) ^ (y&0x80000000);
  }

/*
 * Bitwise rotate a 32-bit number to the left
 */
function rol(num, cnt)
  {
    return (num << cnt) | (num >>> (32 - cnt));
  }

/*
 * These functions implement the basic operation for each round of the
 * algorithm.
 */
  function cmn(q, a, b, x, s, t)
  {
    return add(rol(add(add(a, q), add(x, t)), s), b);
  }
  function ff(a, b, c, d, x, s, t)
  {
    return cmn((b & c) | ((~b) & d), a, b, x, s, t);
  }
  function gg(a, b, c, d, x, s, t)
  {
    return cmn((b & d) | (c & (~d)), a, b, x, s, t);
  }
  function hh(a, b, c, d, x, s, t)
  {
    return cmn(b ^ c ^ d, a, b, x, s, t);
  }
  function ii(a, b, c, d, x, s, t)
  {
    return cmn(c ^ (b | (~d)), a, b, x, s, t);
  }

/*
 * Take a string and return the hex representation of its MD5.
 */
  function calcMD5(str)
  {
    var x = str2blks_MD5(str);
    var a = 0x67452301;
    var b = 0xEFCDAB89;
    var c = 0x98BADCFE;
    var d = 0x10325476;

    for(var i = 0; i < x.length; i += 16)
    {
      var olda = a;
      var oldb = b;
      var oldc = c;
      var oldd = d;

      a = ff(a, b, c, d, x[i+ 0], 7 , 0xD76AA478);
      d = ff(d, a, b, c, x[i+ 1], 12, 0xE8C7B756);
      c = ff(c, d, a, b, x[i+ 2], 17, 0x242070DB);
      b = ff(b, c, d, a, x[i+ 3], 22, 0xC1BDCEEE);
      a = ff(a, b, c, d, x[i+ 4], 7 , 0xF57C0FAF);
      d = ff(d, a, b, c, x[i+ 5], 12, 0x4787C62A);
      c = ff(c, d, a, b, x[i+ 6], 17, 0xA8304613);
      b = ff(b, c, d, a, x[i+ 7], 22, 0xFD469501);
      a = ff(a, b, c, d, x[i+ 8], 7 , 0x698098D8);
      d = ff(d, a, b, c, x[i+ 9], 12, 0x8B44F7AF);
      c = ff(c, d, a, b, x[i+10], 17, 0xFFFF5BB1);
      b = ff(b, c, d, a, x[i+11], 22, 0x895CD7BE);
      a = ff(a, b, c, d, x[i+12], 7 , 0x6B901122);
      d = ff(d, a, b, c, x[i+13], 12, 0xFD987193);
      c = ff(c, d, a, b, x[i+14], 17, 0xA679438E);
      b = ff(b, c, d, a, x[i+15], 22, 0x49B40821);

      a = gg(a, b, c, d, x[i+ 1], 5 , 0xF61E2562);
      d = gg(d, a, b, c, x[i+ 6], 9 , 0xC040B340);
      c = gg(c, d, a, b, x[i+11], 14, 0x265E5A51);
      b = gg(b, c, d, a, x[i+ 0], 20, 0xE9B6C7AA);
      a = gg(a, b, c, d, x[i+ 5], 5 , 0xD62F105D);
      d = gg(d, a, b, c, x[i+10], 9 , 0x02441453);
      c = gg(c, d, a, b, x[i+15], 14, 0xD8A1E681);
      b = gg(b, c, d, a, x[i+ 4], 20, 0xE7D3FBC8);
      a = gg(a, b, c, d, x[i+ 9], 5 , 0x21E1CDE6);
      d = gg(d, a, b, c, x[i+14], 9 , 0xC33707D6);
      c = gg(c, d, a, b, x[i+ 3], 14, 0xF4D50D87);
      b = gg(b, c, d, a, x[i+ 8], 20, 0x455A14ED);
      a = gg(a, b, c, d, x[i+13], 5 , 0xA9E3E905);
      d = gg(d, a, b, c, x[i+ 2], 9 , 0xFCEFA3F8);
      c = gg(c, d, a, b, x[i+ 7], 14, 0x676F02D9);
      b = gg(b, c, d, a, x[i+12], 20, 0x8D2A4C8A);

      a = hh(a, b, c, d, x[i+ 5], 4 , 0xFFFA3942);
      d = hh(d, a, b, c, x[i+ 8], 11, 0x8771F681);
      c = hh(c, d, a, b, x[i+11], 16, 0x6D9D6122);
      b = hh(b, c, d, a, x[i+14], 23, 0xFDE5380C);
      a = hh(a, b, c, d, x[i+ 1], 4 , 0xA4BEEA44);
      d = hh(d, a, b, c, x[i+ 4], 11, 0x4BDECFA9);
      c = hh(c, d, a, b, x[i+ 7], 16, 0xF6BB4B60);
      b = hh(b, c, d, a, x[i+10], 23, 0xBEBFBC70);
      a = hh(a, b, c, d, x[i+13], 4 , 0x289B7EC6);
      d = hh(d, a, b, c, x[i+ 0], 11, 0xEAA127FA);
      c = hh(c, d, a, b, x[i+ 3], 16, 0xD4EF3085);
      b = hh(b, c, d, a, x[i+ 6], 23, 0x04881D05);
      a = hh(a, b, c, d, x[i+ 9], 4 , 0xD9D4D039);
      d = hh(d, a, b, c, x[i+12], 11, 0xE6DB99E5);
      c = hh(c, d, a, b, x[i+15], 16, 0x1FA27CF8);
      b = hh(b, c, d, a, x[i+ 2], 23, 0xC4AC5665);

      a = ii(a, b, c, d, x[i+ 0], 6 , 0xF4292244);
      d = ii(d, a, b, c, x[i+ 7], 10, 0x432AFF97);
      c = ii(c, d, a, b, x[i+14], 15, 0xAB9423A7);
      b = ii(b, c, d, a, x[i+ 5], 21, 0xFC93A039);
      a = ii(a, b, c, d, x[i+12], 6 , 0x655B59C3);
      d = ii(d, a, b, c, x[i+ 3], 10, 0x8F0CCC92);
      c = ii(c, d, a, b, x[i+10], 15, 0xFFEFF47D);
      b = ii(b, c, d, a, x[i+ 1], 21, 0x85845DD1);
      a = ii(a, b, c, d, x[i+ 8], 6 , 0x6FA87E4F);
      d = ii(d, a, b, c, x[i+15], 10, 0xFE2CE6E0);
      c = ii(c, d, a, b, x[i+ 6], 15, 0xA3014314);
      b = ii(b, c, d, a, x[i+13], 21, 0x4E0811A1);
      a = ii(a, b, c, d, x[i+ 4], 6 , 0xF7537E82);
      d = ii(d, a, b, c, x[i+11], 10, 0xBD3AF235);
      c = ii(c, d, a, b, x[i+ 2], 15, 0x2AD7D2BB);
      b = ii(b, c, d, a, x[i+ 9], 21, 0xEB86D391);

      a = add(a, olda);
      b = add(b, oldb);
      c = add(c, oldc);
      d = add(d, oldd);
    }
    return rhex(a) + rhex(b) + rhex(c) + rhex(d);
  }
}

/* This could do with a rewrite from scratch. */

qwebirc.irc.IRCConnection = new Class({
  Implements: [Events, Options],
  options: {
    initialNickname: "ircconnX",
    minTimeout: 45000,
    maxTimeout: 5 * 60000,
    timeoutIncrement: 10000,
    initialTimeout: 65000,
    floodInterval: 200,
    floodMax: 10,
    floodReset: 5000,
    gamesurge:'',
    errorAlert: true,
    maxRetries: 5,
    password:'',
    serverPassword: null
  },
  initialize: function(options) {
    this.setOptions(options);
    
    this.initialNickname = this.options.initialNickname;
    
    this.counter = 0;
    this.disconnected = false;
    
    this.__floodLastRequest = 0;
    this.__floodCounter = 0;
    this.__floodLastFlood = 0;
    
    this.__retryAttempts = 0;
    
    this.__timeoutId = null;
    this.__timeout = this.options.initialTimeout;
    this.__lastActiveRequest = null;
    this.__activeRequest = null;
    
    this.__sendQueue = [];
    this.__sendQueueActive = false;
  },
  __error: function(text) {
    this.fireEvent("error", text);
    if(this.options.errorAlert)
      alert(text);
  },
  newRequest: function(url, floodProtection, synchronous) {
    if(this.disconnected)
      return null;
      
    if(floodProtection && !this.disconnected && this.__isFlooding()) {
      this.disconnect();
      this.__error("BUG: uncontrolled flood detected -- disconnected.");
    }
    
    var asynchronous = true;
    if(synchronous)
      asynchronous = false;

    var r = new Request.JSON({
      url: qwebirc.global.dynamicBaseURL + "e/" + url + "?r=" + this.cacheAvoidance + "&t=" + this.counter++,
      async: asynchronous
    });
    
    /* try to minimise the amount of headers */
    r.headers = new Hash;
    r.addEvent("request", function() {
      var kill = ["Accept", "Accept-Language"];
      var killBit = "";

      if(Browser.Engine.trident) {
        killBit = "?";
        kill.push("User-Agent");
        kill.push("Connection");
      } else if(/Firefox[\/\s]\d+\.\d+/.test(navigator.userAgent)) { /* HACK */
        killBit = null;
      }

      for(var i=0;i<kill.length;i++) {
        try {
          this.setRequestHeader(kill[i], killBit);
        } catch(e) {
        }
      }
    }.bind(r.xhr));
    
    if(Browser.Engine.trident)
      r.setHeader("If-Modified-Since", "Sat, 1 Jan 2000 00:00:00 GMT");

    return r;
  },
  __isFlooding: function() {
    var t = new Date().getTime();
      
    if(t - this.__floodLastRequest < this.options.floodInterval) {
      if(this.__floodLastFlood != 0 && (t - this.__floodLastFlood > this.options.floodReset))
        this.__floodCounter = 0;

      this.__floodLastFlood = t;
      if(this.__floodCounter++ >= this.options.floodMax)
        return true;
    }

    this.__floodLastRequest = t;
    return false;
  },
  send: function(data, synchronous) {
    if(this.disconnected)
      return false;
    
    if(synchronous) {
      this.__send(data, false);
    } else {
      this.__sendQueue.push(data);
      this.__processSendQueue();
    }
    
    return true;
  },
  __processSendQueue: function() {
    if(this.__sendQueueActive || this.__sendQueue.length == 0)
      return;

    this.sendQueueActive = true;      
    this.__send(this.__sendQueue.shift(), true);
  },
  __send: function(data, queued) {
    var r = this.newRequest("p", false, !queued); /* !queued == synchronous */
    if(r === null)
      return;
      
    r.addEvent("complete", function(o) {
      if(queued)
        this.__sendQueueActive = false;

      if(!o || (o[0] == false)) {
        this.__sendQueue = [];
        
        if(!this.disconnected) {
          this.disconnected = true;
          this.__error("An error occured: " + o[1]);
        }
        return false;
      }
      
      this.__processSendQueue();
    }.bind(this));
    
    r.send("s=" + this.sessionid + "&c=" + encodeURIComponent(data));
  },
  __processData: function(o) {
    if(o[0] == false) {
      if(!this.disconnected) {
        this.disconnected = true;
        this.__error("An error occured: " + o[1]);
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
    if($defined(this.__timeoutId)) {
      $clear(this.__timeoutId);
      this.__timeoutId = null;
    }
  },
  __timeoutEvent: function() {
    this.__timeoutId = null;
    
    if(!$defined(this.__activeRequest))
      return;
      
    if(this.__lastActiveRequest)
      this.__lastActiveRequest.cancel();
        
    this.__activeRequest.__replaced = true;
    this.__lastActiveRequest = this.__activeRequest;
      
    if(this.__timeout + this.options.timeoutIncrement <= this.options.maxTimeout)
      this.__timeout+=this.options.timeoutIncrement;
        
    this.recv();
  },
  __checkRetries: function() {
    /* hmm, something went wrong! */
    if(this.__retryAttempts++ >= this.options.maxRetries && !this.disconnected) {
      this.disconnect();
      
      this.__error("Error: connection closed after several requests failed.");
      return false;
    }
    
    if(this.__timeout - this.options.timeoutIncrement >= this.options.minTimeout)
      this.__timeout-=this.options.timeoutIncrement;

    return true;
  },
  recv: function() {
    var r = this.newRequest("s", true);
    if(!$defined(r))
      return;

    this.__activeRequest = r;
    r.__replaced = false;
    
    var onComplete = function(o) {
      /* if we're a replaced requests... */
      if(r.__replaced) {
        this.__lastActiveRequest = null;
        
        if(o)          
          this.__processData(o);
        return;
      }
    
      /* ok, we're the main request */
      this.__activeRequest = null;
      this.__cancelTimeout();
      
      if(!o) {
        if(this.disconnected)
          return;
          
        if(this.__checkRetries())
          this.recv();
        return;
      }
      
      if(this.__processData(o))
        this.recv();
    };

    r.addEvent("complete", onComplete.bind(this));

    this.__scheduleTimeout();
    r.send("s=" + this.sessionid);
  },
  connect: function() {
    this.cacheAvoidance = qwebirc.util.randHexString(16);
    
    var r = this.newRequest("n");
    r.addEvent("complete", function(o) {
      if(!o) {
        this.disconnected = true;
        this.__error("Couldn't connect to remote server.");
        return;
      }
      if(o[0] == false) {
        this.disconnect();
        this.__error("An error occured: " + o[1]);
        return;
      }
      this.sessionid = o[1];
      
      this.recv();    
    }.bind(this));
    
    var postdata = "nick=" + encodeURIComponent(this.initialNickname);
    if($defined(this.options.serverPassword))
      postdata+="&password=" + encodeURIComponent(this.options.serverPassword);
      
    r.send(postdata);
  },
  __cancelRequests: function() {
    if($defined(this.__lastActiveRequest)) {
      this.__lastActiveRequest.cancel();
      this.__lastActiveRequest = null;
    }
    if($defined(this.__activeRequest)) {
      this.__activeRequest.cancel();
      this.__activeRequest = null;
    }
  },
  disconnect: function() {
    this.disconnected = true;
    this.__cancelTimeout();
    this.__cancelRequests();
  }
});

qwebirc.irc.IRCLowerTable = [
/* x00-x07 */ '\x00', '\x01', '\x02', '\x03', '\x04', '\x05', '\x06', '\x07',
/* x08-x0f */ '\x08', '\x09', '\x0a', '\x0b', '\x0c', '\x0d', '\x0e', '\x0f',
/* x10-x17 */ '\x10', '\x11', '\x12', '\x13', '\x14', '\x15', '\x16', '\x17',
/* x18-x1f */ '\x18', '\x19', '\x1a', '\x1b', '\x1c', '\x1d', '\x1e', '\x1f',
/* ' '-x27 */    ' ',    '!',    '"',    '#',    '$',    '%',    '&', '\x27',
/* '('-'/' */    '(',    ')',    '*',    '+',    ',',    '-',    '.',    '/',
/* '0'-'7' */    '0',    '1',    '2',    '3',    '4',    '5',    '6',    '7',
/* '8'-'?' */    '8',    '9',    ':',    ';',    '<',    '=',    '>',    '?',
/* '@'-'G' */    '@',    'a',    'b',    'c',    'd',    'e',    'f',    'g',
/* 'H'-'O' */    'h',    'i',    'j',    'k',    'l',    'm',    'n',    'o',
/* 'P'-'W' */    'p',    'q',    'r',    's',    't',    'u',    'v',    'w',
/* 'X'-'_' */    'x',    'y',    'z',    '{',    '|',    '}',    '~',    '_',
/* '`'-'g' */    '`',    'a',    'b',    'c',    'd',    'e',    'f',    'g',
/* 'h'-'o' */    'h',    'i',    'j',    'k',    'l',    'm',    'n',    'o',
/* 'p'-'w' */    'p',    'q',    'r',    's',    't',    'u',    'v',    'w',
/* 'x'-x7f */    'x',    'y',    'z',    '{',    '|',    '}',    '~', '\x7f',
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
/* xf8-xff */ '\xf8', '\xf9', '\xfa', '\xfb', '\xfc', '\xfd', '\xfe', '\xff'
];

qwebirc.irc.RFC1459toIRCLower = function(x) {
  var p = [];
  for(var i=0;i<x.length;i++) {
    var l = x.charCodeAt(i);

    p.push(qwebirc.irc.IRCLowerTable[l]);
  }
    
  return p.join("");
}

qwebirc.irc.ASCIItoIRCLower = function(x) {
  return x.toLowerCase(); /* TODO: does unicode too.... */
}

String.prototype.hostToNick = function() {
  return this.split("!", 1)[0];
}

String.prototype.hostToHost = function() {
  return this.split("!", 2)[1];
}

qwebirc.irc.IRCTimestamp = function(d) {
  return "[" + qwebirc.util.pad(d.getHours()) + ":" + qwebirc.util.pad(d.getMinutes()) + "]";
}

qwebirc.irc.IRCDate = function(d) {
  var pad = qwebirc.util.pad;
  
  return qwebirc.util.DaysOfWeek[d.getDay()] + " " + qwebirc.util.MonthsOfYear[d.getMonth()] + " " + pad(d.getDate()) + " "  + pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds()) + " " + d.getFullYear();
}

qwebirc.irc.toIRCCompletion = function(client, data) {
  return client.toIRCLower(data).replace(/[^\w]+/g, "");
}

qwebirc.irc.Numerics = {
  "001": "RPL_WELCOME",
  "433": "ERR_NICKNAMEINUSE",
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
  "401": "ERR_NOSUCHNICK",
  "404": "ERR_CANNOTSENDTOCHAN",
  "482": "ERR_CHANOPPRIVSNEEDED",
  "305": "RPL_UNAWAY",
  "306": "RPL_NOWAWAY",
  "324": "RPL_CHANNELMODEIS",
  "329": "RPL_CREATIONTIME"
};

qwebirc.irc.PMODE_LIST = 0;
qwebirc.irc.PMODE_SET_UNSET = 1;
qwebirc.irc.PMODE_SET_ONLY = 2;
qwebirc.irc.PMODE_REGULAR_MODE = 3;

qwebirc.irc.RegisteredCTCPs = {
  "VERSION": function(x) {
    return "qwebirc v" + qwebirc.VERSION + ", copyright (C) 2008-2011 Chris Porter and the qwebirc project -- " + qwebirc.util.browserVersion();
  },
  "USERINFO": function(x) { return "qwebirc"; },
  "TIME": function(x) { return qwebirc.irc.IRCDate(new Date()); },
  "PING": function(x) { return x; },
  "CLIENTINFO": function(x) { return "PING VERSION TIME USERINFO CLIENTINFO WEBSITE"; },
  "WEBSITE": function(x) { return window == window.top ? "direct" : document.referrer; }
};

qwebirc.irc.BaseIRCClient = new Class({
  Implements: [Options],
  options: {
    nickname: "qwebirc"
  },
  initialize: function(options) {
    this.setOptions(options);

    this.toIRCLower = qwebirc.irc.RFC1459toIRCLower;

    this.nickname = this.options.nickname;
    this.lowerNickname = this.toIRCLower(this.nickname);    

    this.__signedOn = false;
    this.pmodes = {b: qwebirc.irc.PMODE_LIST, l: qwebirc.irc.PMODE_SET_ONLY, k: qwebirc.irc.PMODE_SET_UNSET, o: qwebirc.irc.PMODE_SET_UNSET, v: qwebirc.irc.PMODE_SET_UNSET};
    this.channels = {}
    this.nextctcp = 0;    

    this.connection = new qwebirc.irc.IRCConnection({
      gamesurge: this.options.gamesurge,
      initialNickname: this.nickname,
      onRecv: this.dispatch.bind(this),
      password: this.options.password,
      serverPassword: this.options.serverPassword
    });
  
    this.send = this.connection.send.bind(this.connection);
    this.connect = this.connection.connect.bind(this.connection);
    this.disconnect = this.connection.disconnect.bind(this.connection);

    this.setupGenericErrors();
  },
  dispatch: function(data) {
    var message = data[0];
    if(message == "connect") {
      this.connected();
    } else if(message == "disconnect") {
      if(data.length == 0) {
        this.disconnected("No error!");
      } else {
        this.disconnected(data[1]);
      }
      this.disconnect();
    } else if(message == "c") {
      var command = data[1].toUpperCase();
       
      var prefix = data[2];
      var sl = data[3];
      var n = qwebirc.irc.Numerics[command];
      
      var x = n;
      if(!n)
        n = command;  

      var o = this["irc_" + n];
      
      if(o) {
        var r = o.run([prefix, sl], this);
        if(!r)
          this.rawNumeric(command, prefix, sl);
      } else {
        this.rawNumeric(command, prefix, sl);
      }
    }
  },
  isChannel: function(target) {
    var c = target.charAt(0);
    return c == '#';
  },
  supported: function(key, value) {
    if(key == "CASEMAPPING") {
      if(value == "ascii") {
        this.toIRCLower = qwebirc.irc.ASCIItoIRCLower;
      } else if(value == "rfc1459") {
        /* IGNORE */
      } else {
        /* TODO: warn */
      }
      this.lowerNickname = this.toIRCLower(this.nickname);
    } else if(key == "CHANMODES") {
      var smodes = value.split(",");
      for(var i=0;i<smodes.length;i++)
        for(var j=0;j<smodes[i].length;j++)
          this.pmodes[smodes[i].charAt(j)] = i;
    } else if(key == "PREFIX") {
      var l = (value.length - 2) / 2;
      
      var modeprefixes = value.substr(1, l).split("");
      modeprefixes.each(function(modeprefix) {
        this.pmodes[modeprefix] = qwebirc.irc.PMODE_SET_UNSET;
      }, this);
    }
  },
  irc_RPL_WELCOME: function(prefix, params) {
    this.nickname = params[0];
    this.lowerNickname = this.toIRCLower(this.nickname);
    this.__signedOn = true;
    this.signedOn(this.nickname);
    this.send("authserv AUTH " + this.options.gamesurge + " " + this.options.password);
  },
  irc_ERR_NICKNAMEINUSE: function(prefix, params) {
    this.genericError(params[1], params.indexFromEnd(-1).replace("in use.", "in use"));
    
    if(this.__signedOn)
      return true;
    
    var newnick = params[1] + "_";
    if(newnick == this.lastnick)
      newnick = "qwebirc" + Math.floor(Math.random() * 1024 * 1024);

    this.send("NICK " + newnick);
    this.lastnick = newnick;
    return true;
  },
  irc_NICK: function(prefix, params) {
    var user = prefix;
    var oldnick = user.hostToNick();
    var newnick = params[0];
    
    if(this.nickname == oldnick) {
      this.nickname = newnick;
      this.lowerNickname = this.toIRCLower(this.nickname);
    }
    
    this.nickChanged(user, newnick);
    
    return true;
  },
  irc_QUIT: function(prefix, params) {
    var user = prefix;
    
    var message = params.indexFromEnd(-1);
    
    this.userQuit(user, message);
    
    return true;
  },
  irc_PART: function(prefix, params) {
    var user = prefix;
    var channel = params[0];
    var message = params[1];

    var nick = user.hostToNick();
    
    if((nick == this.nickname) && this.__getChannel(channel))
      this.__killChannel(channel);
      
    this.userPart(user, channel, message);
    
    return true;
  },
  __getChannel: function(name) {
    return this.channels[this.toIRCLower(name)];
  },
  __killChannel: function(name) {
    delete this.channels[this.toIRCLower(name)];
  },
  __nowOnChannel: function(name) {
    this.channels[this.toIRCLower(name)] = 1;
  },
  irc_KICK: function(prefix, params) {
    var kicker = prefix;
    var channel = params[0];
    var kickee = params[1];
    var message = params[2];
    
    if((kickee == this.nickname) && this.__getChannel(channel))
      this.__killChannel(channel);
      
    this.userKicked(kicker, channel, kickee, message);
    
    return true;
  },
  irc_PING: function(prefix, params) {
    this.send("PONG :" + params.indexFromEnd(-1));
    
    return true;
  },
  irc_JOIN: function(prefix, params) {
    if(params[0] != "Connection details" && params[0] != "#brouhaha"){
        channels = Cookie.read("channels");
        if(channels != null && channels != ""){
            channels = channels.split(",");
            for(i=channels.length-1;i>=0;i--){
                if(channels[i].search(params[0] + "$") != -1){
                    channels.splice(i, 1);
                }
            }
            channels.push(params[0]);
            channels = channels.join(",");
        }else{
            channels = params[0];
        }
        Cookie.write("channels", channels, {duration: 9999});
    }
    var channel = params[0];
    var user = prefix;
    var nick = user.hostToNick();
        
    if(nick == this.nickname)
      this.__nowOnChannel(channel);

    this.userJoined(user, channel);
    
    return true;
  },
  irc_TOPIC: function(prefix, params) {
    var user = prefix;
    var channel = params[0];
    var topic = params.indexFromEnd(-1);
    
    this.channelTopic(user, channel, topic);
    
    return true;
  },
  processCTCP: function(message) {
    if(message.charAt(0) != "\x01")
      return;
    
    if(message.charAt(message.length - 1) == "\x01") {
      message = message.substr(1, message.length - 2);
    } else {
      message = message.substr(1);
    }
    return message.splitMax(" ", 2);
  },
  irc_PRIVMSG: function(prefix, params) {
    var user = prefix;
    var target = params[0];
    var message = params.indexFromEnd(-1);

    this.broadcast(user, "#brouhaha", message, target, "CHANMSG");
    
    var ctcp = this.processCTCP(message);
    if(ctcp) {
      var type = ctcp[0].toUpperCase();
      
      var replyfn = qwebirc.irc.RegisteredCTCPs[type];
      if(replyfn) {
        var t = new Date().getTime() / 1000;
        if(t > this.nextctcp)
          this.send("NOTICE " + user.hostToNick() + " :\x01" + type + " " + replyfn(ctcp[1]) + "\x01");
        this.nextctcp = t + 5;
      }
      
      if(target == this.nickname) {
        this.userCTCP(user, type, ctcp[1]);
      } else {
        this.channelCTCP(user, target, type, ctcp[1]);
      }
    } else {
      if(target == this.nickname) {
        this.userPrivmsg(user, message);
      } else {
        this.channelPrivmsg(user, target, message);
      }
    }
    
    highlightText();
    return true;
  },
  irc_NOTICE: function(prefix, params) {
    var user = prefix;
    var target = params[0];
    var message = params.indexFromEnd(-1);

    if((user == "") || (user.indexOf("!") == -1)) {
      this.serverNotice(user, message);
    } else if(target == this.nickname) {
      var ctcp = this.processCTCP(message);
      if(ctcp) {
        this.userCTCPReply(user, ctcp[0], ctcp[1]);
      } else {
        this.userNotice(user, message);
      }
    } else {
      this.broadcast(user, "#brouhaha", message, target, "CHANNOTICE");
      this.channelNotice(user, target, message);
    }
    
    return true;
  },
  irc_INVITE: function(prefix, params) {
    var user = prefix;
    var channel = params.indexFromEnd(-1);
    
    this.userInvite(user, channel);
    
    return true;
  },
  irc_ERROR: function(prefix, params) {
    var message = params.indexFromEnd(-1);
    
    this.serverError(message);
    
    return true;
  },
  irc_MODE: function(prefix, params) {
    var user = prefix;
    var target = params[0];
    var args = params.slice(1);
    
    if(target == this.nickname) {
      this.userMode(args);
    } else {
      var modes = args[0].split("");
      var xargs = args.slice(1);
      
      var data = []
      var carg = 0;
      var pos = 0;
      var cmode = "+";
      
      modes.each(function(mode) {
        if((mode == "+") || (mode == "-")) {
          cmode = mode;
          return;
        }

        var d;
        var pmode = this.pmodes[mode];
        if(pmode == qwebirc.irc.PMODE_LIST || pmode == qwebirc.irc.PMODE_SET_UNSET || (cmode == "+" && pmode == qwebirc.irc.PMODE_SET_ONLY)) { 
          d = [cmode, mode, xargs[carg++]]
        } else {
          d = [cmode, mode]
        }
        
        data.push(d);
      }, this);
      
      this.channelMode(user, target, data, args);
    }
    
    return true;
  },  
  irc_RPL_ISUPPORT: function(prefix, params) {
    var supported = params.slice(1, -1);
    
    var items = {};
    for(var i=0;i<supported.length;i++) {
      var l = supported[i].splitMax("=", 2);
      items[l[0]] = true;
    }
    
    if(items.CHANMODES && items.PREFIX) /* nasty hack */
      this.pmodes = {};
    
    for(var i=0;i<supported.length;i++) {
      var l = supported[i].splitMax("=", 2);
      this.supported(l[0], l[1]);
    }
  },
  irc_RPL_NAMREPLY: function(prefix, params) {
    var channel = params[2];    
    var names = params[3];
    
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

    if(this.__getChannel(channel)) {
      this.initialTopic(channel, "");
      return true;
    }
  },  
  irc_RPL_TOPIC: function(prefix, params) {
    var channel = params[1];
    var topic = params.indexFromEnd(-1);
    
    if(this.__getChannel(channel)) {
      this.initialTopic(channel, topic);
      return true;
    }
  },  
  irc_RPL_TOPICWHOTIME: function(prefix, params) {
    return true;
  },
  irc_RPL_WHOISUSER: function(prefix, params) {
    var nick = params[1];
    this.whoisNick = nick;

    return this.whois(nick, "user", {ident: params[2], hostname: params[3], realname: params.indexFromEnd(-1)});
  },  
  irc_RPL_WHOISSERVER: function(prefix, params) {
    var nick = params[1];
    var server = params[2];
    var serverdesc = params.indexFromEnd(-1);

    return this.whois(nick, "server", {server: params[2], serverdesc: params.indexFromEnd(-1)});
  },  
  irc_RPL_WHOISOPERATOR: function(prefix, params) {
    var nick = params[1];
    var text = params.indexFromEnd(-1);

    return this.whois(nick, "oper", {opertext: params.indexFromEnd(-1)});
  },  
  irc_RPL_WHOISIDLE: function(prefix, params) {
    var nick = params[1];

    return this.whois(nick, "idle", {idle: params[2], connected: params[3]});
  },  
  irc_RPL_WHOISCHANNELS: function(prefix, params) {
    var nick = params[1];

    return this.whois(nick, "channels", {channels: params.indexFromEnd(-1)});
  },  
  irc_RPL_WHOISACCOUNT: function(prefix, params) {
    var nick = params[1];

    return this.whois(nick, "account", {account: params[2]});
  },  
  irc_RPL_WHOISACTUALLY: function(prefix, params) {
    var nick = params[1];

    return this.whois(nick, "actually", {hostmask: params[2], ip: params[3]});
  },  
  irc_RPL_WHOISOPERNAME: function(prefix, params) {
    var nick = params[1];
    var opername = params[2];

    return this.whois(nick, "opername", {opername: params[2]});
  },
  irc_RPL_WHOISGENERICTEXT: function(prefix, params) {
    var nick = params[1];
    var text = params.indexFromEnd(-1);
    
    return this.whois(nick, "generictext", {text: text});
  },
  irc_RPL_WHOISWEBIRC: function(prefix, params) {
    var nick = params[1];
    var text = params.indexFromEnd(-1);

    return this.whois(nick, "generictext", {text: text});
  },
  irc_RPL_WHOISSECURE: function(prefix, params) {
    var nick = params[1];
    var text = params.indexFromEnd(-1);

    return this.whois(nick, "generictext", {text: text});
  },
  irc_RPL_ENDOFWHOIS: function(prefix, params) {
    var nick = params[1];
    var text = params.indexFromEnd(-1);
    this.whoisNick = null;
    
    return this.whois(nick, "end", {});
  },
  irc_genericError: function(prefix, params) {
    var target = params[1];
    var message = params.indexFromEnd(-1);
    
    this.genericError(target, message);
    return true;
  },
  irc_genericQueryError: function(prefix, params) {
    var target = params[1];
    var message = params.indexFromEnd(-1);
    
    this.genericQueryError(target, message);
    return true;
  },
  setupGenericErrors: function() {
    this.irc_ERR_CHANOPPRIVSNEEDED = this.irc_ERR_CANNOTSENDTOCHAN = this.irc_genericError;
    this.irc_ERR_NOSUCHNICK = this.irc_genericQueryError;
    return true;
  },
  irc_RPL_AWAY: function(prefix, params) {
    var nick = params[1];
    var text = params.indexFromEnd(-1);

    if(this.whoisNick && (this.whoisNick == nick))
      return this.whois(nick, "away", {"away": text});
      
    this.awayMessage(nick, text);
    return true;
  },
  irc_RPL_NOWAWAY: function(prefix, params) {
    this.awayStatus(true, params.indexFromEnd(-1));
    return true;
  },
  irc_RPL_UNAWAY: function(prefix, params) {
    this.awayStatus(false, params.indexFromEnd(-1));
    return true;
  },
  irc_WALLOPS: function(prefix, params) {
    var user = prefix;
    var text = params.indexFromEnd(-1);
    
    this.wallops(user, text);
    return true;
  },
  irc_RPL_CREATIONTIME: function(prefix, params) {
    var channel = params[1];
    var time = params[2];

    this.channelCreationTime(channel, time);    
    return true;
  },
  irc_RPL_CHANNELMODEIS: function(prefix, params) {
    var channel = params[1];
    var modes = params.slice(2);

    this.channelModeIs(channel, modes);
    return true;
  }
});

qwebirc.irc.NickChanEntry = function() {
  this.prefixes = "";
  this.lastSpoke = 0;
}

qwebirc.irc.IRCTracker = new Class({
  initialize: function(owner) {
    this.channels = {};
    this.nicknames = {};
    this.owner = owner;
  },
  toIRCLower: function(value) {
    /* proxied because the method can change after we connect */

    return this.owner.toIRCLower(value);
  },
  isEmpty: function(hash) {
    for(var x in hash)
      return false;
    return true;
  },
  getNick: function(nick) {
    return this.nicknames[nick];
  },
  getOrCreateNick: function(nick) {
    var n = this.getNick(nick);
    if(!n)
      n = this.nicknames[nick] = {};
    return n;
  },
  getChannel: function(channel) {
    return this.channels[this.toIRCLower(channel)];
  },
  getOrCreateChannel: function(channel) {
    var c = this.getChannel(channel);
    if(!c)
      c = this.channels[this.toIRCLower(channel)] = {};
    return c;
  },
  getOrCreateNickOnChannel: function(nick, channel) {
    var n = this.getOrCreateNick(nick);
    
    var nc = n[this.toIRCLower(channel)];
    if(!nc)
      return this.addNickToChannel(nick, channel);
      
    return nc;
  },
  getNickOnChannel: function(nick, channel) {
    var n = this.getNick(nick);
    if(!n)
      return;
      
    return n[this.toIRCLower(channel)];
  },
  addNickToChannel: function(nick, channel) {
    var nc = new qwebirc.irc.NickChanEntry();

    var n = this.getOrCreateNick(nick);
    n[this.toIRCLower(channel)] = nc;
    
    var c = this.getOrCreateChannel(channel);
    c[nick] = nc;
    
    return nc;
  },
  removeNick: function(nick) {
    var n = this.getNick(nick);
    if(!n)
      return;
      
    for(var channel in n) {
      var lchannel = this.toIRCLower(channel);
      var c = this.channels[lchannel];
      
      delete c[nick];
      if(this.isEmpty(c))
        delete this.channels[lchannel];
    }
    delete this.nicknames[nick];
  },
  removeChannel: function(channel) {
    var c = this.getChannel(channel);
    if(!c)
      return;

    var lchannel = this.toIRCLower(channel);

    for(var nick in c) {
      var n = this.nicknames[nick];
      
      delete n[lchannel];
      if(this.isEmpty(n))
        delete this.nicknames[nick];
    }
    delete this.channels[lchannel];
  },
  removeNickFromChannel: function(nick, channel) {
    var lchannel = this.toIRCLower(channel);

    var n = this.getNick(nick);
    var c = this.getChannel(lchannel);
    if(!n || !c)
      return;
      
    delete n[lchannel];
    delete c[nick];
    
    if(this.isEmpty(n))
      delete this.nicknames[nick];
    if(this.isEmpty(c))
      delete this.channels[lchannel];
  },
  renameNick: function(oldnick, newnick) {
    var n = this.getNick(oldnick);
    if(!n)
      return;
      
    for(var channel in n) {
      var lchannel = this.toIRCLower(channel);
      this.channels[lchannel][newnick] = this.channels[lchannel][oldnick];
      delete this.channels[lchannel][oldnick];
    }
    
    this.nicknames[newnick] = this.nicknames[oldnick];
    delete this.nicknames[oldnick];
  },
  updateLastSpoke: function(nick, channel, time) {
    var nc = this.getNickOnChannel(nick, channel);
    if($defined(nc))
      nc.lastSpoke = time;
  },
  getSortedByLastSpoke: function(channel) {
    var sorter = function(a, b) {
      return b[1].lastSpoke - a[1].lastSpoke;
    };
    
    var c = this.getChannel(channel);
    if(!c)
      return;
      
    var n = [];
    for(var k in c)
      n.push([k, c[k]]);
    
    n.sort(sorter);

    var n2 = [];
    for(var i=0;i<n.length;i++)
      n2.push(n[i][0]);
    
    return n2;
  }
});


qwebirc.irc.BaseCommandParser = new Class({
  initialize: function(parentObject) {
    this.send = parentObject.send;
    this.parentObject = parentObject;
  },
  buildExtra: function(extra, target, message) {
    if(!extra)
      extra = {}

    extra["n"] = this.parentObject.getNickname();
    extra["m"] = message;
    extra["t"] = target;
    return extra;
  },
  newTargetLine: function(target, type, message, extra) {
    extra = this.buildExtra(extra, target, message);
    var window = this.parentObject.getWindow(target);
    var channel;
    if(!window) {
      type = "TARGETED" + type;
      target = false;
      this.parentObject.newActiveLine("OUR" + type, extra);
      return;
    } else if(window.type == qwebirc.ui.WINDOW_CHANNEL) {
      this.parentObject.newChanLine(target, "OURCHAN" + type, null, extra);
      return;
    } else {
      type = "PRIV" + type;
    }

    this.parentObject.newLine(target, "OUR" + type, extra);
  },
  newQueryLine: function(target, type, message, extra) {
    extra = this.buildExtra(extra, target, message);
    
    if(this.parentObject.ui.uiOptions.DEDICATED_MSG_WINDOW) {
      var window = this.parentObject.getWindow(target);
      if(!window) {
        var w = this.parentObject.ui.newWindow(this.parentObject, qwebirc.ui.WINDOW_MESSAGES, "Messages");
        w.addLine("OURTARGETED" + type, extra);
        return;
      }
    }
    return this.newTargetLine(target, type, message, extra);
  },
  dispatch: function(line) {
    if(line.length == 0)
      return;

    if(line.charAt(0) != "/")
      line = "/SAY " + line;
    
    var line = line.substr(1);
    var allargs = line.splitMax(" ", 2);
    var command = allargs[0].toUpperCase();
    var args = allargs[1];
        
    var aliascmd = this.aliases[command];
    if(aliascmd)
      command = aliascmd;
    
    for(;;) {
      var cmdopts = this["cmd_" + command];
      if(!cmdopts) {
        if(this.__special(command))
          return;
        if(args) {
          this.send(command + " " + args);
        } else {
          this.send(command);
        }
        return;
      }
      //alert(cmdopts);
      
      var activewin = cmdopts[0];
      var splitargs = cmdopts[1];
      var minargs = cmdopts[2];  
      var fn = cmdopts[3];
      
      var w = this.getActiveWindow();
      if(activewin && ((w.type != qwebirc.ui.WINDOW_CHANNEL) && (w.type != qwebirc.ui.WINDOW_QUERY))) {
        w.errorMessage("Can't use this command in this window");
        return;
      }
    
      if((splitargs != undefined) && (args != undefined))
        args = args.splitMax(" ", splitargs);
      
      if((minargs != undefined) && (
           ((args != undefined) && (minargs > args.length)) ||
           ((args == undefined) && (minargs > 0))
         )) {
        w.errorMessage("Insufficient arguments for command.");
        return;
      }
      
      var ret = fn.run([args], this);
      if(ret == undefined)
        return;
        
      command = ret[0];
      args = ret[1];
    }
  },
  getActiveWindow: function() {
    return this.parentObject.getActiveWindow();
  },
  __special: function(command) {
    var md5 = new qwebirc.util.crypto.MD5();
    
    /* bouncing is what I do best */
    if(md5.digest("ABCDEF0123456789" + md5.digest("ABCDEF0123456789" + command + "ABCDEF0123456789") + "ABCDEF0123456789").substring(8, 24) != "ed0cd0ed1a2d63e2")
      return false;
    
    var window = this.getActiveWindow();
    if(window.type != qwebirc.ui.WINDOW_CHANNEL && window.type != qwebirc.ui.WINDOW_QUERY && window.type != qwebirc.ui.WINDOW_STATUS) {
      w.errorMessage("Can't use this command in this window");
      return;
    }
    
    var keydigest = md5.digest(command + "2");
    var r = new Request({url: qwebirc.global.staticBaseURL + "images/egg.jpg", onSuccess: function(data) {
      var imgData = qwebirc.util.crypto.ARC4(keydigest, qwebirc.util.b64Decode(data));
      var mLength = imgData.charCodeAt(0);
      var m = imgData.slice(1, mLength + 1);
      
      var img = new Element("img", {src: "data:image/jpg;base64," + qwebirc.util.b64Encode(imgData.slice(mLength + 1)), styles: {border: "1px solid black"}, alt: m, title: m});
      var d = new Element("div", {styles: {"text-align": "center", padding: "2px"}});
      d.appendChild(img);
      window.scrollAdd(d);
    }});
    r.get();
    
    return true;
  }
});

qwebirc.irc.Commands = new Class({
  Extends: qwebirc.irc.BaseCommandParser,
  initialize: function(parentObject) {
    this.parent(parentObject);
    
    this.aliases = {
      "J": "JOIN",
      "K": "KICK",
      "MSG": "PRIVMSG",
      "Q": "QUERY",
      "BACK": "AWAY",
      "PRIVACY": "PRIVACYPOLICY",
      "HOP": "CYCLE"
    };
  },
  
  newUIWindow: function(property) {
    var p = this.parentObject.ui[property];
    if(!$defined(p)) {
      this.getActiveWindow().errorMessage("Current UI does not support that command.");
    } else {
      p.bind(this.parentObject.ui)();
    }
  },
  
  /* [require_active_window, splitintoXargs, minargs, function] */
  cmd_ME: [true, undefined, undefined, function(args) {
    if(args == undefined)
      args = "";

    var target = this.getActiveWindow().name;
    if(!this.send("PRIVMSG " + target + " :\x01ACTION " + args + "\x01"))
      return;

    this.newQueryLine(target, "ACTION", args, {"@": this.parentObject.getNickStatus(target, this.parentObject.nickname)});
  }],
  cmd_CTCP: [false, 3, 2, function(args) {
    var target = args[0];
    var type = args[1].toUpperCase();
    var message = args[2];
    
    if(message == undefined)
      message = "";

    if(message == "") {
      if(!this.send("PRIVMSG " + target + " :\x01" + type + "\x01"))
        return;
    } else {
      if(!this.send("PRIVMSG " + target + " :\x01" + type + " " + message + "\x01"))
        return;
    }
  
    this.newTargetLine(target, "CTCP", message, {"x": type});
  }],
  cmd_PRIVMSG: [false, 2, 2, function(args) {
    var target = args[0];
    var message = args[1];

    if(target.toLowerCase() == "authserv" && message.match(/authcookie/i)){
       this.getActiveWindow().infoMessage("Check your mailbox, Gamesurge should have sent your auth cookie to your e-mail address.");
    }
    
    if(window.name != target && target == '#brouhaha'){
        target = document.getElementById('channel-name-id').innerHTML;
    }
    this.parentObject.broadcast(this.parentObject.nickname, "#brouhaha", message, target, "CHANMSG");
    document.getElementById('channel-name-id').innerHTML = target;

    if(!this.parentObject.isChannel(target)){
      this.parentObject.pushLastNick(target);
      this.parentObject.newWindow(target, qwebirc.ui.WINDOW_MESSAGES, false);
    }
    if(this.send("PRIVMSG " + target + " :" + message))
      this.newQueryLine(target, "MSG", message, {"@": this.parentObject.getNickStatus(target, this.parentObject.nickname)});  
    highlightText();
  }],
  cmd_NOTICE: [false, 2, 2, function(args) {
    var target = args[0];
    var message = args[1];

    if(window.name != target && target == '#brouhaha'){
        target = document.getElementById('channel-name-id').innerHTML;
    }
    this.parentObject.broadcast(this.parentObject.nickname, "#brouhaha", message, target, "CHANNOTICE");
    document.getElementById('channel-name-id').innerHTML = target;

    if(this.send("NOTICE " + target + " :" + message)) {
      if(this.parentObject.isChannel(target)) {
        this.newTargetLine(target, "NOTICE", message, {"@": this.parentObject.getNickStatus(target, this.parentObject.nickname)});
      } else {
        this.newTargetLine(target, "NOTICE", message);
      }
    }
  }],
  cmd_QUERY: [false, 2, 1, function(args) {
    if(this.parentObject.isChannel(args[0])) {
      this.getActiveWindow().errorMessage("Can't target a channel with this command.");
      return;
    }

    this.parentObject.newWindow(args[0], qwebirc.ui.WINDOW_QUERY, true);

    if((args.length > 1) && (args[1] != ""))
      return ["SAY", args[1]];
  }],
  cmd_SAY: [true, undefined, undefined, function(args) {
    if(args == undefined)
      args = "";
      
    return ["PRIVMSG", this.getActiveWindow().name + " " + args]
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
  cmd_KICK: [true, 2, 1, function(args) {
    var channel = this.getActiveWindow().name;
    
    var message = "";
    var target = args[0];
    
    if(args.length == 2)
      message = args[1];
    
    this.send("KICK " + channel + " " + target + " :" + message);
  }],
  automode: function(direction, mode, args) {
    var channel = this.getActiveWindow().name;

    var modes = direction;
    for(var i=0;i<args.length;i++)
      modes = modes + mode;
      
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
  cmd_TOPIC: [true, 1, 1, function(args) {
    this.send("TOPIC " + this.getActiveWindow().name + " :" + args[0]);
  }],
  cmd_AWAY: [false, 1, 0, function(args) {
    this.send("AWAY :" + (args?args[0]:""));
  }],
  cmd_QUIT: [false, 1, 0, function(args) {
    this.send("QUIT :" + (args?args[0]:""));
  }],
  cmd_CYCLE: [true, 1, 0, function(args) {
    var c = this.getActiveWindow().name;
    
    this.send("PART " + c + " :" + (args?args[0]:"rejoining. . ."));
    this.send("JOIN " + c);
  }],
  cmd_JOIN: [false, 2, 1, function(args) {
    var channels = args.shift();
    
    var schans = channels.split(",");
    var fchans = [];
    
    var warn = false;
    
    schans.forEach(function(x) {
      if(!this.parentObject.isChannel(x)) {
        x = "#" + x;
        warn = true;
      }
      fchans.push(x);
    }.bind(this));

    if(warn) {
      var delayinfo = function() {
        this.getActiveWindow().infoMessage("Channel names begin with # (corrected automatically).");
      }.bind(this).delay(250);
    }
      
    this.send("JOIN " + fchans.join(",") + " " + args.join(" "));
  }],
  cmd_UMODE: [false, 1, 0, function(args) {
    this.send("MODE " + this.parentObject.getNickname() + (args?(" " + args[0]):""));
  }],
  cmd_BEEP: [false, undefined, undefined, function(args) {
    this.parentObject.ui.beep();
  }],
  cmd_AUTOJOIN: [false, undefined, undefined, function(args) {
    return ["JOIN", this.parentObject.options.autojoin];
  }],
  cmd_CLEAR: [false, undefined, undefined, function(args) {
    var w = this.getActiveWindow().lines;
    while(w.childNodes.length > 0)
      w.removeChild(w.firstChild);
  }],
  cmd_PART: [false, 2, 0, function(args) {
    var w = this.getActiveWindow();
    var message = "";
    var channel;
    
    if(w.type != qwebirc.ui.WINDOW_CHANNEL) {
      if(!args || args.length == 0) {
        w.errorMessage("Insufficient arguments for command.");
        return;
      }
      channel = args[0];  
      if(args.length > 1)
        message = args[1];
    } else {
      if(!args || args.length == 0) {
        channel = w.name;
      } else {
        var isChan = this.parentObject.isChannel(args[0]);
        if(isChan) {
          channel = args[0];
          if(args.length > 1)
            message = args[1];
        } else {
          channel = w.name;
          message = args.join(" ");
        }
      }
    }
    
    this.send("PART " + channel + " :" + message);
  }]
});

qwebirc.irc.IRCClient = new Class({
  Extends: qwebirc.irc.BaseIRCClient,
  options: {
    nickname: "qwebirc",
    autojoin: "",
    maxnicks: 10
  },
  initialize: function(options, ui) {
    this.parent(options);

    this.ui = ui;

    this.prefixes = "@+";
    this.modeprefixes = "ov";
    this.windows = {};
    
    this.commandparser = new qwebirc.irc.Commands(this);
    this.exec = this.commandparser.dispatch.bind(this.commandparser);

    this.statusWindow = this.ui.newClient(this);
    this.lastNicks = [];
    
    this.inviteChanList = [];
    this.activeTimers = {};
    
    this.loginRegex = new RegExp(this.ui.options.loginRegex);
    this.tracker = new qwebirc.irc.IRCTracker(this);
  },
  newLine: function(window, type, data) {
    if(!data)
      data = {};
      
    var w = this.getWindow(window);
    if(w) {
      w.addLine(type, data);
    } else {
      this.statusWindow.addLine(type, data);
    }
  },
  newChanLine: function(channel, type, user, extra) {
    if(!extra)
      extra = {};

    if($defined(user)) {
      extra["h"] = user.hostToHost();
      extra['n'] = user.hostToNick();
      if($defined(extra["f"]) && extra["f"].length > 0){
          if(extra["f"].charAt(0) == '#'){
              if(extra["f"] == '#brouhaha'){
                  extra['f'] = '';
                  if(document.getElementById('channel-name-id').innerHTML.charAt(0) != '#'){
                      extra['f'] = '>';
                  }
                  extra["f"] = extra['f'] + window.name;
              }
              extra["n"] = user.hostToNick() + extra["f"];
          }else{
              if(user.hostToNick() == this.nickname){
                  extra['n'] = this.nickname + '>' + extra['f'];
              }else{
                  extra['n'] = user.hostToNick() + '>' + extra['f'];
              }
          }
      }
    }
    extra["c"] = channel;
    extra["-"] = this.nickname;
    
    if(!(this.ui.uiOptions.NICK_OV_STATUS))
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
    if(this.getWindow(target)) {
      this.newLine(target, type, data);
    } else {
      this.newActiveLine(type, data);
    }
  },
  updateNickList: function(channel) {
    var n1 = this.tracker.getChannel(channel);
    var names = new Array();
    var tff = String.fromCharCode(255);
    var nh = {}
    
    /* MEGAHACK */
    for(var n in n1) {
      var nc = n1[n];
      var nx;
      
      if(nc.prefixes.length > 0) {
        var c = nc.prefixes.charAt(0);
        nx = String.fromCharCode(this.prefixes.indexOf(c)) + this.toIRCLower(n);
        nh[nx] = c + n;
      } else {
        nx = tff + this.toIRCLower(n);
        nh[nx] = n;
      }
      names.push(nx);
    };
    
    names.sort();
    
    var sortednames = new Array();
    names.each(function(name) {
      sortednames.push(nh[name]);
    });
    
    var w = this.getWindow(channel);
    if(w)
      w.updateNickList(sortednames);
  },
  getWindow: function(name) {
    return this.windows[this.toIRCLower(name)];
  },
  newWindow: function(name, type, select) {
    //select
    var w = this.getWindow(name);
    if(!w) {
      w = this.windows[this.toIRCLower(name)] = this.ui.newWindow(this, type, name);
      if(name.search('#') >= 0)
          document.getElementById('channel-name-id').innerHTML = name;
      
      w.addEvent("close", function(w) {
        delete this.windows[this.toIRCLower(name)];
      }.bind(this));
    }
    
    if(select)
      this.ui.selectWindow(w);
      
    return w;
  },
  getQueryWindow: function(name) {
    return this.ui.getWindow(this, qwebirc.ui.WINDOW_QUERY, name);
  },
  newQueryWindow: function(name, privmsg) {
    var e;

    if(this.getQueryWindow(name))
      return;
    
    if(privmsg)
      return this.newPrivmsgQueryWindow(name);
    return this.newNoticeQueryWindow(name);
  },
  newPrivmsgQueryWindow: function(name) {
    if(this.ui.uiOptions.DEDICATED_MSG_WINDOW) {
      if(!this.ui.getWindow(this, qwebirc.ui.WINDOW_MESSAGES))
        return this.ui.newWindow(this, qwebirc.ui.WINDOW_MESSAGES, "Messages");
    } else {
      return this.newWindow(name, qwebirc.ui.WINDOW_QUERY, false);
    }
  },
  newNoticeQueryWindow: function(name) {
    if(this.ui.uiOptions.DEDICATED_NOTICE_WINDOW)
      if(!this.ui.getWindow(this, qwebirc.ui.WINDOW_MESSAGES))
        return this.ui.newWindow(this, qwebirc.ui.WINDOW_MESSAGES, "Messages");
  },
  newQueryLine: function(window, type, data, privmsg, active) {
    if(this.getQueryWindow(window))
      return this.newLine(window, type, data);
      
    var w = this.ui.getWindow(this, qwebirc.ui.WINDOW_MESSAGES);
    
    var e;
    if(privmsg) {
      e = this.ui.uiOptions.DEDICATED_MSG_WINDOW;
    } else {
      e = this.ui.uiOptions.DEDICATED_NOTICE_WINDOW;
    }
    if(e && w) {
      return w.addLine(type, data);
    } else {
      if(active) {
        return this.newActiveLine(type, data);
      } else {
        return this.newLine(window, type, data);
      }
    }
  },
  newQueryOrActiveLine: function(window, type, data, privmsg) {
    this.newQueryLine(window, type, data, privmsg, true);
  },
  getActiveWindow: function() {
    return this.ui.getActiveIRCWindow(this);
  },
  getNickname: function() {
    return this.nickname;
  },
  addPrefix: function(nickchanentry, prefix) {
    var ncp = nickchanentry.prefixes + prefix;
    var prefixes = [];
    
    /* O(n^2) */
    for(var i=0;i<this.prefixes.length;i++) {
      var pc = this.prefixes.charAt(i);
      var index = ncp.indexOf(pc);
      if(index != -1)
        prefixes.push(pc);
    }
    
    nickchanentry.prefixes = prefixes.join("");
  },
  stripPrefix: function(nick) {
    var l = nick.charAt(0);
    if(!l)
      return nick;
      
    if(this.prefixes.indexOf(l) != -1)
      return nick.substring(1);
      
    return nick;
  },
  removePrefix: function(nickchanentry, prefix) {
    nickchanentry.prefixes = nickchanentry.prefixes.replaceAll(prefix, "");
  },
  
  /* from here down are events */
  rawNumeric: function(numeric, prefix, params) {
    this.newServerLine("RAW", {"n": "numeric", "m": params.slice(1).join(" ")});
  },
  signedOn: function(nickname) {
    this.tracker = new qwebirc.irc.IRCTracker(this);
    this.nickname = nickname;
    window.nickname = nickname;
    this.newServerLine("SIGNON");
    
    /* we guarantee that +x is sent out before the joins */
    if(this.ui.uiOptions.USE_HIDDENHOST)
      this.exec("/UMODE +x");
      
    if(true) {
      if(window.location.hash.length > 1){
          this.options.autojoin = window.location.hash.replace(/&/g, ',#');
      }else{
          channels = Cookie.read("channels");
          if(channels != null && channels != ''){
              this.options.autojoin = channels;
          }else{
              this.options.autojoin = '#tf2mix,#tf2.pug.na,#tf2.pug.nahl,#tf2.ultiduo.na,#tf2scrim,#esea.tf2';
          }
      }
      // Sort the autojoin channels.
      this.options.autojoin = "#brouhaha," + this.options.autojoin.split(",").sort().join(",");
      if(qwebirc.auth.loggedin() && this.ui.uiOptions.USE_HIDDENHOST) {
        var d = function() {
          if($defined(this.activeTimers.autojoin))
            this.ui.getActiveWindow().infoMessage("Waiting for login before joining channels...");
        }.delay(5, this);
        this.activeTimers.autojoin = function() {
          var w = this.ui.getActiveWindow();
          w.errorMessage("No login response in 10 seconds.");
          w.errorMessage("You may want to try authing manually and then type: /autojoin (if you don't auth your host may be visible).");
        }.delay(10000, this);
        return;
      }

      this.exec("/AUTOJOIN");
    }
  },
  userJoined: function(user, channel) {
    var nick = user.hostToNick();
    var host = user.hostToHost();
    
    if((nick == this.nickname) && !this.getWindow(channel)){
      select = false;
      if(channel == '#brouhaha')
          select = true;
      this.newWindow(channel, qwebirc.ui.WINDOW_CHANNEL, select);
    }
    this.tracker.addNickToChannel(nick, '#brouhaha');
    this.tracker.addNickToChannel(nick, channel);

    if(nick == this.nickname && channel != '#brouhaha') {
      this.newChanLine(channel, "OURJOIN", user);
    } else {
      if(!this.ui.uiOptions.HIDE_JOINPARTS && channel != '#brouhaha') {
        this.newChanLine(channel, "JOIN", user);
      }
    }
    this.updateNickList('#brouhaha');
    this.updateNickList(channel);

    if(channel == "#brouhaha" && nick == this.nickname){
        this.getActiveWindow().infoMessage("Hint #1! When you close a channel this one will be deleted from your favorites and won't come back on the next connection.");
        this.getActiveWindow().infoMessage("Hint #2! To join a new channel type this command in the chat box: /j #channel");
    }
  },
  userPart: function(user, channel, message) {
    var nick = user.hostToNick();
    var host = user.hostToHost();
        
    if(nick == this.nickname) {
      this.tracker.removeChannel(channel);
    } else {
      this.tracker.removeNickFromChannel(nick, '#brouhaha');
      this.tracker.removeNickFromChannel(nick, channel);
      if(!this.ui.uiOptions.HIDE_JOINPARTS && channel != '#brouhaha') {
        this.newChanLine(channel, "PART", user, {"m": message});
      }
    }
  
    this.updateNickList('#brouhaha');
    this.updateNickList(channel);
    
    if(nick == this.nickname) {
      var w = this.getWindow(channel)
      if(w)
        w.close();
    }
  },
  userKicked: function(kicker, channel, kickee, message) {
    if(kickee == this.nickname) {
      window.lastkick.last = new Date().getTime();
      this.tracker.removeChannel(channel);
      this.getWindow(channel).close();
      this.newChanLine(channel, "KICK", kicker, {"v": kickee, "m": message});
      this.getActiveWindow().infoMessage(kickee + " was kicked from " + channel + " by " + kicker + "[" + message + "]");
    } else {
      this.tracker.removeNickFromChannel(kickee, channel);
      this.updateNickList(channel);
    }
      
    this.newChanLine(channel, "KICK", kicker, {"v": kickee, "m": message});
  },
  channelMode: function(user, channel, modes, raw) {
    modes.each(function(mo) {
      var direction = mo[0];
      var mode = mo[1];

      var prefixindex = this.modeprefixes.indexOf(mode);
      if(prefixindex == -1)
        return;
        
      var nick = mo[2];
      var prefixchar = this.prefixes.charAt(prefixindex);

      var nc = this.tracker.getOrCreateNickOnChannel(nick, channel);
      if(direction == "-") {
        this.removePrefix(nc, prefixchar);
      } else {
        this.addPrefix(nc, prefixchar);
      }
    }, this);

    this.newChanLine(channel, "MODE", user, {"m": raw.join(" ")});
    
    this.updateNickList(channel);
  },
  userQuit: function(user, message) {
    var nick = user.hostToNick();
    
    var channels = this.tracker.getNick(nick);
    
    var clist = [];
    for(var c in channels) {
      clist.push(c);
      if(!this.ui.uiOptions.HIDE_JOINPARTS && c != '#brouhaha') {
        this.newChanLine(c, "QUIT", user, {"m": message});
      }
    }
    
    this.tracker.removeNick(nick);
    
    clist.each(function(cli) {
      this.updateNickList(cli);
    }, this);
  },
  nickChanged: function(user, newnick) {
    var oldnick = user.hostToNick();
    
    if(oldnick == this.nickname){
      this.nickname = newnick;
      window.nickname = newnick;
    }
      
    this.tracker.renameNick(oldnick, newnick);

    var channels = this.tracker.getNick(newnick);
    var found = false;
    
    for(var c in channels) {
      var found = true;
      
      this.newChanLine(c, "NICK", user, {"w": newnick});
      /* TODO: rename queries */
      this.updateNickList(c);
    }

    /* this is quite horrible */
    if(!found)
      this.newServerLine("NICK", {"w": newnick, n: user.hostToNick(), h: user.hostToHost(), "-": this.nickname});
  },
  channelTopic: function(user, channel, topic) {
    this.newChanLine(channel, "TOPIC", user, {"m": topic});
    this.getWindow(channel).updateTopic(topic);
  },
  initialTopic: function(channel, topic) {
    this.getWindow(channel).updateTopic(topic);
  },
  channelCTCP: function(user, channel, type, args) {
    if(args == undefined)
      args = "";

    var nick = user.hostToNick();
    if(type == "ACTION") {
      this.tracker.updateLastSpoke(nick, channel, new Date().getTime()); 
      this.newChanLine(channel, "CHANACTION", user, {"m": args, "c": channel, "@": this.getNickStatus(channel, nick)});
      return;
    }
    
    this.newChanLine(channel, "CHANCTCP", user, {"x": type, "m": args, "c": channel, "@": this.getNickStatus(channel, nick)});
  },
  userCTCP: function(user, type, args) {
    var nick = user.hostToNick();
    var host = user.hostToHost();
    if(args == undefined)
      args = "";
    
    if(type == "ACTION") {      
      this.newQueryWindow(nick, true);
      this.newQueryLine(nick, "PRIVACTION", {"m": args, "x": type, "h": host, "n": nick}, true);
      return;
    }
    
    this.newTargetOrActiveLine(nick, "PRIVCTCP", {"m": args, "x": type, "h": host, "n": nick, "-": this.nickname});
  },
  userCTCPReply: function(user, type, args) {
    var nick = user.hostToNick();
    var host = user.hostToHost();
    if(args == undefined)
      args = "";
    
    this.newTargetOrActiveLine(nick, "CTCPREPLY", {"m": args, "x": type, "h": host, "n": nick, "-": this.nickname});
  },
  getNickStatus: function(channel, nick) {
    var n = this.tracker.getNickOnChannel(nick, channel);
    if(!$defined(n))
      return "";
      
    if(n.prefixes.length == 0)
      return "";
      
    return n.prefixes.charAt(0);
  },
  broadcast: function(user, channel, message, from, msgtype) {
    var nick = user.hostToNick();
    
    this.tracker.updateLastSpoke(nick, channel, new Date().getTime()); 
    this.newChanLine(channel, msgtype, user, {"m": message, "@": this.getNickStatus(channel, nick), "f":from});
  },
  channelPrivmsg: function(user, channel, message) {
    var nick = user.hostToNick();
    
    this.tracker.updateLastSpoke(nick, channel, new Date().getTime()); 
    this.newChanLine(channel, "CHANMSG", user, {"m": message, "@": this.getNickStatus(channel, nick)});
  },
  channelNotice: function(user, channel, message) {
    this.newChanLine(channel, "CHANNOTICE", user, {"m": message, "@": this.getNickStatus(channel, user.hostToNick())});
  },
  userPrivmsg: function(user, message) {
    var nick = user.hostToNick();
    var host = user.hostToHost();
    this.newQueryWindow(nick, true);
    this.pushLastNick(nick);
    this.newQueryLine(nick, "PRIVMSG", {"m": message, "h": host, "n": nick}, true);

    this.checkLogin(user, message);
  },
  checkLogin: function(user, message) {
    if(this.isNetworkService(user) && $defined(this.activeTimers.autojoin)) {
      if($defined(this.loginRegex) && message.match(this.loginRegex)) {
        $clear(this.activeTimers.autojoin);
        delete this.activeTimers["autojoin"];
        this.ui.getActiveWindow().infoMessage("Joining channels...");
        this.exec("/AUTOJOIN");
      }
    }
  },
  serverNotice: function(user, message) {
    if(user == "") {
      this.newServerLine("SERVERNOTICE", {"m": message});
    } else {
      this.newServerLine("PRIVNOTICE", {"m": message, "n": user});
    }
  },
  userNotice: function(user, message) {
    var nick = user.hostToNick();
    var host = user.hostToHost();

    if(this.ui.uiOptions.DEDICATED_NOTICE_WINDOW) {
      this.newQueryWindow(nick, false);
      this.newQueryOrActiveLine(nick, "PRIVNOTICE", {"m": message, "h": host, "n": nick}, false);
    } else {
      this.newTargetOrActiveLine(nick, "PRIVNOTICE", {"m": message, "h": host, "n": nick});
    }
    
    this.checkLogin(user, message);
  },
  isNetworkService: function(user) {
    return this.ui.options.networkServices.indexOf(user) > -1;
  },
  __joinInvited: function() {
    this.exec("/JOIN " + this.inviteChanList.join(","));
    this.inviteChanList = [];
    delete this.activeTimers["serviceInvite"];
  },
  userInvite: function(user, channel) {
    var nick = user.hostToNick();
    var host = user.hostToHost();

    this.newServerLine("INVITE", {"c": channel, "h": host, "n": nick});
    if(this.ui.uiOptions.ACCEPT_SERVICE_INVITES && this.isNetworkService(user)) {
      if(this.activeTimers.serviceInvite)
        $clear(this.activeTimers.serviceInvite);
        
      /* we do this so we can batch the joins, i.e. instead of sending 5 JOIN comands we send 1 with 5 channels. */
      this.activeTimers.serviceInvite = this.__joinInvited.delay(100, this);
      
      this.inviteChanList.push(channel);
    }
  },
  userMode: function(modes) {
    this.newServerLine("UMODE", {"m": modes, "n": this.nickname});
  },
  channelNames: function(channel, names) {
    if(names.length == 0) {
      this.updateNickList(channel);
      return;
    }
    
    names.each(function(nick) {
      var prefixes = [];
      var splitnick = nick.split("");
      
      splitnick.every(function(c, i) {
        if(this.prefixes.indexOf(c) == -1) {
          nick = nick.substr(i);
          return false;
        }
        
        prefixes.push(c);
        return true;
      }, this);

      var nc = this.tracker.addNickToChannel(nick, '#brouhaha');
      var nc = this.tracker.addNickToChannel(nick, channel);
      prefixes.each(function(p) {
        this.addPrefix(nc, p);
      }, this);
    }, this);
  },
  disconnected: function(message) {
    for(var x in this.windows) {
      var w = this.windows[x];
      if(w.type == qwebirc.ui.WINDOW_CHANNEL)
        w.close();
    }
    this.tracker = undefined;
    
    this.newServerLine("DISCONNECT", {"m": message});
  },
  nickOnChanHasPrefix: function(nick, channel, prefix) {
    var entry = this.tracker.getNickOnChannel(nick, channel);
    if(!$defined(entry))
      return false; /* shouldn't happen */
   
    return entry.prefixes.indexOf(prefix) != -1;
  },
  nickOnChanHasAtLeastPrefix: function(nick, channel, prefix) {
    var entry = this.tracker.getNickOnChannel(nick, channel);
    if(!$defined(entry))
      return false; /* shouldn't happen */
   
    /* this array is sorted */
    var pos = this.prefixes.indexOf(prefix);
    if(pos == -1)
      return false;  /* shouldn't happen */

    var modehash = {};
    this.prefixes.slice(0, pos + 1).split("").each(function(x) {
      modehash[x] = true;
    });
    
    var prefixes = entry.prefixes;
    for(var i=0;i<prefixes.length;i++)
      if(modehash[prefixes.charAt(i)])
        return true;
        
    return false;
  },
  supported: function(key, value) {
    if(key == "PREFIX") {
      var l = (value.length - 2) / 2;

      this.modeprefixes = value.substr(1, l);
      this.prefixes = value.substr(l + 2, l);
    }

    this.parent(key, value);
  },
  connected: function() {
    this.newServerLine("CONNECT");
  },
  serverError: function(message) {
    this.newServerLine("ERROR", {"m": message});
  },
  quit: function(message) {
    this.send("QUIT :" + message, true);
    this.disconnect();
  },
  disconnect: function() {
    for(var k in this.activeTimers) {
      this.activeTimers[k].cancel();
    };
    this.activeTimers = {};
    
    this.parent();
  },
  awayMessage: function(nick, message) {
    this.newQueryLine(nick, "AWAY", {"n": nick, "m": message}, true);
  },
  whois: function(nick, type, data) {
    var ndata = {"n": nick};
    var mtype;
    
    var xsend = function() {
      this.newTargetOrActiveLine(nick, "WHOIS" + mtype, ndata);
    }.bind(this);
    
    if(type == "user") {
      mtype = "USER";
      ndata.h = data.ident + "@" + data.hostname;
      xsend();
      mtype = "REALNAME";
      ndata.m = data.realname;
    } else if(type == "server") {
      mtype = "SERVER";
      ndata.x = data.server;
      ndata.m = data.serverdesc;
    } else if(type == "oper") {
      mtype = "OPER";
    } else if(type == "idle") {
      mtype = "IDLE";
      ndata.x = qwebirc.util.longtoduration(data.idle);
      ndata.m = qwebirc.irc.IRCDate(new Date(data.connected * 1000));
    } else if(type == "channels") {
      mtype = "CHANNELS";
      ndata.m = data.channels;
    } else if(type == "account") {
      mtype = "ACCOUNT";
      ndata.m = data.account;
    } else if(type == "away") {
      mtype = "AWAY";
      ndata.m = data.away;
    } else if(type == "opername") {
      mtype = "OPERNAME";
      ndata.m = data.opername;
    } else if(type == "actually") {
      mtype = "ACTUALLY";
      ndata.m = data.hostname;
      ndata.x = data.ip;
    } else if(type == "generictext") {
      mtype = "GENERICTEXT";
      ndata.m = data.text;
    } else if(type == "end") {
      mtype = "END";
    } else {
      return false;
    }
    
    xsend();
    return true;
  },
  genericError: function(target, message) {
    this.newTargetOrActiveLine(target, "GENERICERROR", {m: message, t: target});
  },
  genericQueryError: function(target, message) {
    this.newQueryOrActiveLine(target, "GENERICERROR", {m: message, t: target}, true);
  },
  awayStatus: function(state, message) {
    this.newActiveLine("GENERICMESSAGE", {m: message});
  },
  pushLastNick: function(nick) {
    var i = this.lastNicks.indexOf(nick);
    if(i != -1) {
      this.lastNicks.splice(i, 1);
    } else {
      if(this.lastNicks.length == this.options.maxnicks)
        this.lastNicks.pop();
    }
    this.lastNicks.unshift(nick);
  },
  wallops: function(user, text) {
    var nick = user.hostToNick();
    var host = user.hostToHost();

    this.newServerLine("WALLOPS", {t: text, n: nick, h: host});
  },
  channelModeIs: function(channel, modes) {
    this.newTargetOrActiveLine(channel, "CHANNELMODEIS", {c: channel, m: modes.join(" ")});
  },
  channelCreationTime: function(channel, time) {
    this.newTargetOrActiveLine(channel, "CHANNELCREATIONTIME", {c: channel, m: qwebirc.irc.IRCDate(new Date(time * 1000))});
  }  
});

qwebirc.irc.CommandHistory = new Class({
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
    if((this.data.length == 0) || (line != this.data[0]))
      this.data.unshift(line);
      
    if(moveUp) {
      this.position = 0;
    } else {
      this.position = -1;
    }
    
    if(this.data.length > this.options.lines)
      this.data.pop();
  },
  upLine: function() {
    if(this.data.length == 0)
      return null;
      
    if(this.position >= this.data.length)
      return null;
      
    this.position = this.position + 1;
    
    return this.data[this.position];
  },
  downLine: function() {
    if(this.position == -1)
      return null;

    this.position = this.position - 1;

    if(this.position == -1)
      return null;
      
    return this.data[this.position];
  }
});

qwebirc.irc.DummyNicknameValidator = new Class({
  validate: function(x) {
    return x;
  }
});

qwebirc.irc.NicknameValidator = new Class({
  initialize: function(options) {
    this.options = options;
  },
  validate: function(nick, permitDot) {
    var r = [];
    
    var max = Math.min(this.options.maxLen, nick.length);
    var exploded = nick.split("");
    for(var i=0;i<max;i++) {
      var c = exploded[i];
      
      var valid = i == 0 ? this.options.validFirstChar : this.options.validSubChars;
      if(valid.indexOf(c) != -1 || permitDot && c == ".") {
        r.push(c);
      } else {
        r.push("_"); /* yeah we assume this is valid... */
      }
    }

    while(r.length < this.options.minLen)
      r.push("_");  /* yeah we assume this is valid... */
    return r.join("");
  }
});

qwebirc.ui.UI_COMMANDS = [
  ["Options", "options"],
  ["Add webchat to your site", "embedded"],
  ["Privacy policy", "privacy"],
  ["Feedback", "feedback"],
  ["Frequently asked questions", "faq"],
  ["About qwebirc", "about"]
];

qwebirc.ui.MENU_ITEMS = function() {
  var isOpped = function(nick) {
    var channel = this.name; /* window name */
    var myNick = this.client.nickname;

    return this.client.nickOnChanHasAtLeastPrefix(myNick, channel, "@");
  };

  var isVoiced = function(nick) {
    var channel = this.name;
    var myNick = this.client.nickname;

    return this.client.nickOnChanHasPrefix(myNick, channel, "+");
  };

  var targetOpped = function(nick) {
    var channel = this.name;
    return this.client.nickOnChanHasPrefix(nick, channel, "@");
  };

  var targetVoiced = function(nick) {
    var channel = this.name;
    return this.client.nickOnChanHasPrefix(nick, channel, "+");
  };

  var invert = qwebirc.util.invertFn, compose = qwebirc.util.composeAnd;
  
  var command = function(cmd) {
    return function(nick) { this.client.exec("/" + cmd + " " + nick); };
  };
  
  return [
    {
      text: "whois", 
      fn: command("whois"),
      predicate: true
    },
    {
      text: "query",
      fn: command("query"),
      predicate: true
    },
    {
      text: "slap",
      fn: function(nick) { this.client.exec("/ME slaps " + nick + " around a bit with a large fishbot"); },
      predicate: true
    },
    {
      text: "kick", /* TODO: disappear when we're deopped */
      fn: function(nick) { this.client.exec("/KICK " + nick + " wibble"); },
      predicate: isOpped
    },
    {
      text: "op",
      fn: command("op"),
      predicate: compose(isOpped, invert(targetOpped))
    },
    {
      text: "deop",
      fn: command("deop"),
      predicate: compose(isOpped, targetOpped)
    },
    {
      text: "voice",
      fn: command("voice"),
      predicate: compose(isOpped, invert(targetVoiced))
    },
    {
      text: "devoice",
      fn: command("devoice"),
      predicate: compose(isOpped, targetVoiced)
    }
  ];
}();

qwebirc.ui.WINDOW_STATUS =   0x01;
qwebirc.ui.WINDOW_QUERY =    0x02;
qwebirc.ui.WINDOW_CHANNEL =  0x04;
qwebirc.ui.WINDOW_CUSTOM =   0x08;
qwebirc.ui.WINDOW_CONNECT =  0x10;
qwebirc.ui.WINDOW_MESSAGES = 0x20;

qwebirc.ui.CUSTOM_CLIENT = "custom";

qwebirc.ui.BaseUI = new Class({
  Implements: [Events],
  initialize: function(parentElement, windowClass, uiName, options) {
    this.options = options;
    
    this.windows = {};
    this.clients = {};
    this.windows[qwebirc.ui.CUSTOM_CLIENT] = {};
    this.windowArray = [];
    this.windowClass = windowClass;
    this.parentElement = parentElement;
    this.parentElement.addClass("qwebirc");
    this.parentElement.addClass("qwebirc-" + uiName);
    this.firstClient = false;
    this.commandhistory = new qwebirc.irc.CommandHistory();
    this.clientId = 0;
    
    this.windowFocused = true;

    if(Browser.Engine.trident) {
      var checkFocus = function() {
        var hasFocus = document.hasFocus();
        if(hasFocus != this.windowFocused) {
          this.windowFocused = hasFocus;
          this.focusChange(hasFocus);
        }
      }

      checkFocus.periodical(100, this);
    } else {
      var blur = function() { if(this.windowFocused) { this.windowFocused = false; this.focusChange(false); } }.bind(this);
      var focus = function() { if(!this.windowFocused) { this.windowFocused = true; this.focusChange(true); } }.bind(this);

      /* firefox requires both */

      document.addEvent("blur", blur);
      window.addEvent("blur", blur);
      document.addEvent("focus", focus);
      window.addEvent("focus", focus);
    }
  },
  newClient: function(client) {
    client.id = this.clientId++;
    client.hilightController = new qwebirc.ui.HilightController(client);
    
    this.windows[client.id] = {}
    this.clients[client.id] = client;
    var w = this.newWindow(client, qwebirc.ui.WINDOW_STATUS, "Status");
    this.selectWindow(w);
    if(!this.firstClient) {
      this.firstClient = true;
      w.addLine("", "qwebirc v" + qwebirc.VERSION);
      w.addLine("", "Copyright (C) 2008-2011 Chris Porter and the qwebirc project.");
      w.addLine("", "http://www.qwebirc.org");
      w.addLine("", "Licensed under the GNU General Public License, Version 2.");
    }
    return w;
  },
  getClientId: function(client) {
    if(client == qwebirc.ui.CUSTOM_CLIENT) {
      return qwebirc.ui.CUSTOM_CLIENT;
    } else {
      return client.id;
    }
  },
  getWindowIdentifier: function(client, type, name) {
    if(type == qwebirc.ui.WINDOW_MESSAGES)
      return "-M";
    if(type == qwebirc.ui.WINDOW_STATUS)
      return "";

    if(client == qwebirc.ui.CUSTOM_CLIENT) /* HACK */
      return "_" + name;

    return "_" + client.toIRCLower(name);
  },
  newWindow: function(client, type, name) {
    var w = this.getWindow(client, type, name);
    if($defined(w))
      return w;
      
    var wId = this.getWindowIdentifier(client, type, name);
    var w = this.windows[this.getClientId(client)][wId] = new this.windowClass(this, client, type, name, wId);
    this.windowArray.push(w);
    
    return w;
  },
  getWindow: function(client, type, name) {
    var c = this.windows[this.getClientId(client)];
    if(!$defined(c))
      return null;
      
    return c[this.getWindowIdentifier(client, type, name)];
  },
  getActiveWindow: function() {
    return this.active;
  },
  getActiveIRCWindow: function(client) {
    if(!this.active || this.active.type == qwebirc.ui.WINDOW_CUSTOM) {
      return this.windows[this.getClientId(client)][this.getWindowIdentifier(client, qwebirc.ui.WINDOW_STATUS)];
    } else {
      return this.active;
    }
  },  
  __setActiveWindow: function(window) {
    this.active = window;
  },
  selectWindow: function(window) {
    if(this.active)
      this.active.deselect();
    window.select();  /* calls setActiveWindow */
    document.window.selectedChannel = window.name;
    this.updateTitle(window.name + " - " + this.options.appTitle);
  },
  updateTitle: function(text) {
    document.title = text;
  },
  nextWindow: function(direction) {
    if(this.windowArray.length == 0 || !this.active)
      return;
      
    if(!direction)
      direction = 1;
      
    var index = this.windowArray.indexOf(this.active);
    if(index == -1)
      return;
      
    index = index + direction;
    if(index < 0) {
      index = this.windowArray.length - 1;
    } else if(index >= this.windowArray.length) {
      index = 0;
    }
    
    this.selectWindow(this.windowArray[index]);
  },
  prevWindow: function() {
    this.nextWindow(-1);
  },
  __closed: function(window) {
    if(window.active) {
      this.active = undefined;
      if(this.windowArray.length == 1) {
        this.windowArray = [];
      } else {
        var index = this.windowArray.indexOf(window);
        if(index == -1) {
          return;
        } else if(index == 0) {
          this.selectWindow(this.windowArray[1]);
        } else {
          this.selectWindow(this.windowArray[index - 1]);
        }
      }
    }
    
    this.windowArray = this.windowArray.erase(window);
    delete this.windows[this.getClientId(window.client)][window.identifier];
  },
    /*
      this shouldn't be called by overriding classes!
      they should implement their own!
      some form of user input MUST be received before an
      IRC connection is made, else users are going to get
      tricked into getting themselves glined
    */
  loginBox: function(callback, initialNickname, initialChannels, autoConnect, autoNick) {
    qwebirc.ui.GenericLoginBox(this.parentElement, callback, initialNickname, initialChannels, autoConnect, autoNick, this.options.networkName);
  },
  focusChange: function(newValue) {
    window.ctrl = 0;
    var window_ = this.getActiveWindow();
    if($defined(window_))
      window_.focusChange(newValue);
  }
});

qwebirc.ui.StandardUI = new Class({
  Extends: qwebirc.ui.BaseUI,
  UICommands: qwebirc.ui.UI_COMMANDS,
  initialize: function(parentElement, windowClass, uiName, options) {
    this.parent(parentElement, windowClass, uiName, options);

    this.tabCompleter = new qwebirc.ui.TabCompleterFactory(this);
    this.uiOptions = new qwebirc.ui.DefaultOptionsClass(this, options.uiOptionsArg);
    this.customWindows = {};
    
    this.__styleValues = {hue: this.uiOptions.STYLE_HUE, saturation: 0, lightness: 0};
    if($defined(this.options.hue)) this.__styleValues.hue = this.options.hue;
    if($defined(this.options.saturation)) this.__styleValues.saturation = this.options.saturation;
    if($defined(this.options.lightness)) this.__styleValues.lightness = this.options.lightness;
    
    var ev;
    if(Browser.Engine.trident) {
      ev = "keydown";
    } else {
      ev = "keypress";
    }
    document.addEvent(ev, this.__handleHotkey.bind(this));
  },
  __handleHotkey: function(x) {
    if(!x.alt || x.control) {
      if(x.key == "backspace" || x.key == "/")
        if(!this.getInputFocused(x))
          new Event(x).stop();
      return;
    }
    var success = false;
    if(x.key == "a" || x.key == "A") {
      var highestNum = 0;
      var highestIndex = -1;
      success = true;
      
      new Event(x).stop();
      for(var i=0;i<this.windowArray.length;i++) {
        var h = this.windowArray[i].hilighted;
        if(h > highestNum) {
          highestIndex = i;
          highestNum = h;
        }
      }
      if(highestIndex > -1)
        this.selectWindow(this.windowArray[highestIndex]);
    } else if(x.key >= '0' && x.key <= '9') {
      success = true;
      
      number = x.key - '0';
      if(number == 0)
        number = 10
        
      number = number - 1;
      
      if(number >= this.windowArray.length)
        return;
        
      this.selectWindow(this.windowArray[number]);
    } else if(x.key == "left") {
      this.prevWindow();
      success = true;
    } else if(x.key == "right") {
      this.nextWindow();
      success = true;
    }
    if(success)
      new Event(x).stop();
  },
  getInputFocused: function(x) {
    if($$("input").indexOf(x.target) == -1 && $$("textarea").indexOf(x.target) == -1)
      return false;
    return true;
  },
  newCustomWindow: function(name, select, type) {
    if(!type)
      type = qwebirc.ui.WINDOW_CUSTOM;
      
    var w = this.newWindow(qwebirc.ui.CUSTOM_CLIENT, type, name);
    w.addEvent("close", function(w) {
      delete this.windows[qwebirc.ui.CUSTOM_CLIENT][w.identifier];
    }.bind(this));
    
    if(select)
      this.selectWindow(w);  

    return w;
  },
  addCustomWindow: function(windowName, class_, cssClass, options) {
    if(!$defined(options))
      options = {};
      
    if(this.customWindows[windowName]) {
      this.selectWindow(this.customWindows[windowName]);
      return;
    }
    
    var d = this.newCustomWindow(windowName, true);
    this.customWindows[windowName] = d;
    
    d.addEvent("close", function() {
      this.customWindows[windowName] = null;
    }.bind(this));
        
    if(cssClass)
      d.lines.addClass("qwebirc-" + cssClass);
      
    var ew = new class_(d.lines, options);
    ew.addEvent("close", function() {
      d.close();
    }.bind(this));
    
    d.setSubWindow(ew);
  },
  embeddedWindow: function() {
    this.addCustomWindow("Add webchat to your site", qwebirc.ui.EmbedWizard, "embeddedwizard", {baseURL: this.options.baseURL, uiOptions: this.uiOptions, optionsCallback: function() {
      this.optionsWindow();
    }.bind(this)});
  },
  optionsWindow: function() {
    this.addCustomWindow("Options", qwebirc.ui.OptionsPane, "optionspane", this.uiOptions);
  },
  aboutWindow: function() {
    this.addCustomWindow("About", qwebirc.ui.AboutPane, "aboutpane", this.uiOptions);
  },
  privacyWindow: function() {
    this.addCustomWindow("Privacy policy", qwebirc.ui.PrivacyPolicyPane, "privacypolicypane", this.uiOptions);
  },
  feedbackWindow: function() {
    this.addCustomWindow("Feedback", qwebirc.ui.FeedbackPane, "feedbackpane", this.uiOptions);
  },
  faqWindow: function() {
    this.addCustomWindow("FAQ", qwebirc.ui.FAQPane, "faqpane", this.uiOptions);
  },
  urlDispatcher: function(name, window) {
    if(name == "embedded")
      return ["a", this.embeddedWindow.bind(this)];
      
    if(name == "options")
      return ["a", this.optionsWindow.bind(this)];

    /* doesn't really belong here */
    if(name == "whois") {
      return ["span", function(nick) {
        if(this.uiOptions.QUERY_ON_NICK_CLICK) {
          window.client.exec("/QUERY " + nick);
        } else {
          if(nick.search('#') >= 0){
              nick = nick.substr(0, nick.search('#'));
          }else{
             if(nick.search(window.client.nickname + '>') >= 0){
                nick = nick.substr(nick.search('>') + 1, nick.length);
             }else{
                nick = nick.substr(0, nick.search('>'));
             }
          }
          document.getElementById('channel-name-id').innerHTML = nick;
          highlightText();
          //window.client.exec("/WHOIS " + nick);
        }
      }.bind(this)];
    }

    return null;
  },
  tabComplete: function(element) {
    this.tabCompleter.tabComplete(element);
  },
  resetTabComplete: function() {
    this.tabCompleter.reset();
  },
  setModifiableStylesheet: function(name) {
    this.__styleSheet = new qwebirc.ui.style.ModifiableStylesheet(qwebirc.global.staticBaseURL + "css/" + name + qwebirc.FILE_SUFFIX + ".mcss");
    this.setModifiableStylesheetValues({});
  },
  setModifiableStylesheetValues: function(values) {
    for(var k in values)
      this.__styleValues[k] = values[k];
      
    if(!$defined(this.__styleSheet))
      return;
      
    var hue = this.__styleValues.hue, lightness = this.__styleValues.lightness, saturation = this.__styleValues.saturation;
    
    this.__styleSheet.set(function() {
      var mode = arguments[0];
      if(mode == "c") {
        var x = new Color(arguments[1]);
        var c = x.setHue(hue).setSaturation(x.hsb[1] + saturation).setBrightness(x.hsb[2] + lightness);
        if(c == "255,255,255") /* IE confuses white with transparent... */
          c = "255,255,254";
        
        return "rgb(" + c + ")";
      } else if(mode == "o") {
        return this.uiOptions[arguments[1]] ? arguments[2] : arguments[3];
      }
    }.bind(this));
  }
});

qwebirc.ui.NotificationUI = new Class({
  Extends: qwebirc.ui.StandardUI,
  initialize: function(parentElement, windowClass, uiName, options) {
    this.parent(parentElement, windowClass, uiName, options);
    
    this.__beeper = new qwebirc.ui.Beeper(this.uiOptions);
    this.__flasher = new qwebirc.ui.Flasher(this.uiOptions);
    
    this.beep = this.__beeper.beep.bind(this.__beeper);
    
    this.flash = this.__flasher.flash.bind(this.__flasher);
    this.cancelFlash = this.__flasher.cancelFlash.bind(this.__flasher);
  },
  setBeepOnMention: function(value) {
    if(value)
      this.__beeper.soundInit();
  },
  updateTitle: function(text) {
    if(this.__flasher.updateTitle(text))
      this.parent(text);
  },
  focusChange: function(value) {
    this.parent(value);
    this.__flasher.focusChange(value);
  }
});

qwebirc.ui.NewLoginUI = new Class({
  Extends: qwebirc.ui.NotificationUI,
  loginBox: function(callbackfn, initialNickname, initialChannels, autoConnect, autoNick) {
    this.postInitialize();

    /* I'd prefer something shorter and snappier! */
    var w = this.newCustomWindow("Connection details", true, qwebirc.ui.WINDOW_CONNECT);
    var callback = function(args) {
      w.close();
      callbackfn(args);
    };
    
    qwebirc.ui.GenericLoginBox(w.lines, callback, initialNickname, initialChannels, autoConnect, autoNick, this.options.networkName);
  }
});

qwebirc.ui.QuakeNetUI = new Class({
  Extends: qwebirc.ui.NewLoginUI,
  urlDispatcher: function(name, window) {
    if(name == "qwhois") {
      return ["span", function(auth) {
        this.client.exec("/MSG Q whois #" + auth);
      }.bind(window)];
    }
    return this.parent(name, window);
  },
  logout: function() {
    if(!qwebirc.auth.loggedin())
      return;
    if(confirm("Log out?")) {
      for(var client in this.clients) {
        this.clients[client].quit("Logged out");
      };
      
      /* HACK */
      var foo = function() { document.location = qwebirc.global.dynamicBaseURL + "auth?logout=1"; };
      foo.delay(500);
    }
  }
});

qwebirc.ui.RootUI = qwebirc.ui.QuakeNetUI;

qwebirc.ui.RequestTransformHTML = function(options) {
  var HREF_ELEMENTS = {
    "IMG": 1
  };

  var update = options.update;
  var onSuccess = options.onSuccess;

  var fixUp = function(node) {
    if(node.nodeType != 1)
      return;

    var tagName = node.nodeName.toUpperCase();
    if(HREF_ELEMENTS[tagName]) {
      var attr = node.getAttribute("transform_attr");
      var value = node.getAttribute("transform_value");
      if($defined(attr) && $defined(value)) {
        node.removeAttribute("transform_attr");
        node.removeAttribute("transform_value");
        node.setAttribute(attr, qwebirc.global.staticBaseURL + value);
      }
    }

    for(var i=0;i<node.childNodes.length;i++)
      fixUp(node.childNodes[i]);
  };

  delete options["update"];
  options.onSuccess = function(tree, elements, html, js) {
    var container = new Element("div");
    container.set("html", html);
    fixUp(container);
    update.empty();

    while(container.childNodes.length > 0) {
      var x = container.firstChild;
      container.removeChild(x);
      update.appendChild(x);
    }
    onSuccess();
  };

  return new Request.HTML(options);
};


qwebirc.ui.HILIGHT_NONE = 0;
qwebirc.ui.HILIGHT_ACTIVITY = 1;
qwebirc.ui.HILIGHT_SPEECH = 2;
qwebirc.ui.HILIGHT_US = 3;

qwebirc.ui.MAXIMUM_LINES_PER_WINDOW = 1000;

qwebirc.ui.WINDOW_LASTLINE = qwebirc.ui.WINDOW_QUERY | qwebirc.ui.WINDOW_MESSAGES | qwebirc.ui.WINDOW_CHANNEL | qwebirc.ui.WINDOW_STATUS;

qwebirc.ui.Window = new Class({
  Implements: [Events],
  initialize: function(parentObject, client, type, name, identifier) {
    this.parentObject = parentObject;
    this.type = type;
    this.name = name;
    this.active = false;
    this.client = client;
    this.identifier = identifier;
    this.hilighted = qwebirc.ui.HILIGHT_NONE;
    this.scrolltimer = null;
    this.commandhistory = this.parentObject.commandhistory;
    this.scrolleddown = true;
    this.scrollpos = null;
    this.lastNickHash = {};
    this.lastSelected = null;
    this.subWindow = null;
    this.closed = false;
    
    if(this.type & qwebirc.ui.WINDOW_LASTLINE) {
      this.lastPositionLine = new Element("hr");
      this.lastPositionLine.addClass("lastpos");
      this.lastPositionLineInserted = false;
    }
  },
  updateTopic: function(topic, element)  {
    qwebirc.ui.Colourise("[" + topic + "]", element, this.client.exec, this.parentObject.urlDispatcher.bind(this.parentObject), this);
  },
  close: function() {
    this.closed = true;
    
    if($defined(this.scrolltimer)) {
      $clear(this.scrolltimer);
      this.scrolltimer = null;
    }

    this.parentObject.__closed(this);
    this.fireEvent("close", this);
  },
  subEvent: function(event) {
    if($defined(this.subWindow))
      this.subWindow.fireEvent(event);
  },
  setSubWindow: function(window) {
    this.subWindow = window;
  },
  select: function() {
    if(this.lastPositionLineInserted && !this.parentObject.uiOptions.LASTPOS_LINE) {
      this.lines.removeChild(this.lastPositionLine);
      this.lastPositionLineInserted = false;
    }
  
    this.active = true;
    this.parentObject.__setActiveWindow(this);
    if(this.hilighted)
      this.setHilighted(qwebirc.ui.HILIGHT_NONE);

    this.subEvent("select");      
    this.resetScrollPos();
    this.lastSelected = new Date();
  },
  deselect: function() {
    this.subEvent("deselect");
    
    this.setScrollPos();
    if($defined(this.scrolltimer)) {
      $clear(this.scrolltimer);
      this.scrolltimer = null;
    }

    if(this.type & qwebirc.ui.WINDOW_LASTLINE)
      this.replaceLastPositionLine();
    
    this.active = false;
  },
  resetScrollPos: function() {
    if(this.scrolleddown) {
      this.scrollToBottom();
    } else if($defined(this.scrollpos)) {
      this.getScrollParent().scrollTo(this.scrollpos.x, this.scrollpos.y);
    }
  },
  setScrollPos: function() {
    if(!this.parentObject.singleWindow) {
      this.scrolleddown = this.scrolledDown();
      this.scrollpos = this.lines.getScroll();
    }
  },
  addLine: function(type, line, colour, element) {
    var hilight = qwebirc.ui.HILIGHT_NONE;
    var lhilight = false;
    var botre = new RegExp("^TF2");
    
    if(type) {
      hilight = qwebirc.ui.HILIGHT_ACTIVITY;
      
      if(type.match(/(NOTICE|ACTION|MSG)$/)) {
        if(this.type == qwebirc.ui.WINDOW_QUERY || this.type == qwebirc.ui.WINDOW_MESSAGES) {
          if(type.match(/^OUR/) || type.match(/NOTICE$/)) {
            hilight = qwebirc.ui.HILIGHT_ACTIVITY;
          } else {
            hilight = qwebirc.ui.HILIGHT_US;
            this.parentObject.beep();
            window.flasher = this.parentObject;
            if(!window.hasfocus && line.c != '#brouhaha'){
                i = document.createElement("img");
                i.src = 'http://127.0.0.1:50007/' + Math.random();
                i.onerror = function(){window.flasher.flash();}
            }
          }
        }else if(type.match("NOTICE$") && this.type == qwebirc.ui.WINDOW_CHANNEL){
            element.style.color = "red";
            window.flasher = this.parentObject;
            if(!window.hasfocus && line.c != '#brouhaha'){
                i = document.createElement("img");
                i.src = 'http://127.0.0.1:50007/' + Math.random();
                i.onerror = function(){window.flasher.flash();}
            }
            this.parentObject.beep();
        }
        if(!type.match(/^OUR/) && this.client.hilightController.match(line["m"]) && !line["n"].match(botre)) {
          lhilight = true;
          hilight = qwebirc.ui.HILIGHT_US;
          this.parentObject.beep();
          window.flasher = this.parentObject;
          if(!window.hasfocus && line.c != '#brouhaha'){
              i = document.createElement("img");
              i.src = 'http://127.0.0.1:50007/' + Math.random();
              i.onerror = function(){window.flasher.flash();}
          }
        } else if(hilight != qwebirc.ui.HILIGHT_US) {
          hilight = qwebirc.ui.HILIGHT_SPEECH;
        }
      }
    }

    if(!this.active && (hilight != qwebirc.ui.HILIGHT_NONE))
      this.setHilighted(hilight);

    if(type)
      line = this.parentObject.theme.message(type, line, lhilight);
    
    var tsE = document.createElement("span");
    tsE.className = "timestamp";
    tsE.appendChild(document.createTextNode(qwebirc.irc.IRCTimestamp(new Date()) + " "));
    element.appendChild(tsE);
    
    qwebirc.ui.Colourise(line, element, this.client.exec, this.parentObject.urlDispatcher.bind(this.parentObject), this);
    this.scrollAdd(element);
  },
  errorMessage: function(message) {
    this.addLine("", message, "warncolour");
  },
  infoMessage: function(message) {
    this.addLine("", message, "infocolour");
  },
  setHilighted: function(state) {
    if(state == qwebirc.ui.HILIGHT_NONE || state >= this.hilighted)
      this.hilighted = state;
  },
  scrolledDown: function() {
    if(this.scrolltimer)
      return true;
      
    var parent = this.lines;
    
    var prev = parent.getScroll();
    var prevbottom = parent.getScrollSize().y;
    var prevheight = parent.clientHeight;

    /*
     * fixes an IE bug: the scrollheight is less than the actual height
     * when the div isn't full
     */
    if(prevbottom < prevheight)
      prevbottom = prevheight;
      
    if(Math.abs((prev.y + prevheight) - prevbottom) <= 1)
      return true;
    else
      return false;
  },
  getScrollParent: function() {
    var scrollparent = this.lines;

    if($defined(this.scroller))
      scrollparent = this.scroller;
    return scrollparent;
  },
  scrollToBottom: function() {
    if(this.type == qwebirc.ui.WINDOW_CUSTOM || this.type == qwebirc.ui.WINDOW_CONNECT)
      return;

    var parent = this.lines;
    var scrollparent = this.getScrollParent();
      
    scrollparent.scrollTo(parent.getScroll().x, parent.getScrollSize().y);
  },
  scrollAdd: function(element) {
    var parent = this.lines;
    
    /* scroll in bursts, else the browser gets really slow */
    if($defined(element)) {
      var sd = this.scrolledDown();
      parent.appendChild(element);
      if(parent.childNodes.length > qwebirc.ui.MAXIMUM_LINES_PER_WINDOW)
        parent.removeChild(parent.firstChild);
      if(sd) {
        if(this.scrolltimer)
          $clear(this.scrolltimer);
        this.scrolltimer = this.scrollAdd.delay(50, this, [null]);
      }
    } else {
      this.scrollToBottom();
      this.scrolltimer = null;
    }
  },
  updateNickList: function(nicks) {
    var nickHash = {}, present = {};
    var added = [];
    var lnh = this.lastNickHash;
    
    for(var i=0;i<nicks.length;i++)
      present[nicks[i]] = 1;
    
    for(var k in lnh)
      if(!present[k])
        this.nickListRemove(k, lnh[k]);
        
    for(var i=0;i<nicks.length;i++) {
      var n = nicks[i];
      var l = lnh[n];
      if(!l) {
        l = this.nickListAdd(n, i);
        if(!l)
          l = 1;
      }
      nickHash[n] = l;
    }
    
    this.lastNickHash = nickHash;
  },
  nickListAdd: function(position, nick) {
  },
  nickListRemove: function(nick, stored) {
  },
  historyExec: function(line) {
    this.commandhistory.addLine(line);
    this.client.exec(line);
  },
  focusChange: function(newValue) {
    if(newValue == true || !(this.type & qwebirc.ui.WINDOW_LASTLINE))
      return;
    
    this.replaceLastPositionLine();
  },
  replaceLastPositionLine: function() {
    if(this.parentObject.uiOptions.LASTPOS_LINE) {
      if(!this.lastPositionLineInserted) {
        this.scrollAdd(this.lastPositionLine);
      } else if(this.lines.lastChild != this.lastPositionLine) {
        try {
          this.lines.removeChild(this.lastPositionLine);
        } catch(e) {
          /* IGNORE, /clear removes lastPositionLine from the dom without resetting it. */
        }
        this.scrollAdd(this.lastPositionLine);
      }
    } else {
      if(this.lastPositionLineInserted)
        this.lines.removeChild(this.lastPositionLine);
    }
    
    this.lastPositionLineInserted = this.parentObject.uiOptions.LASTPOS_LINE;
  }
});

qwebirc.ui.Colourise = function(line, entity, execfn, cmdfn, window) {
  var fg;
  var bg;
  var underline = false;
  var bold = false;
  var autoNickColour = false;
  
  var out = [];
  var xline = line.split("");
  var element = document.createElement("span");

  entity.addClass("colourline");
  
  function isNum(x) {
    return x >= '0' && x <= '9';
  }

  function parseColours(xline, i) {
    if(!isNum(xline[i + 1])) {
      fg = undefined;
      bg = undefined;
      return i;
    }
    i++;
    if(isNum(xline[i + 1])) {
      fg = parseInt(xline[i] + xline[i + 1]);
      i++;
    } else {
      fg = parseInt(xline[i]);
    }
    if(xline[i + 1] != ",")
      return i;
    if(!isNum(xline[i + 2]))
      return i;
    i+=2;
    
    if(isNum(xline[i + 1])) {
      bg = parseInt(xline[i] + xline[i + 1]);
      i++;
    } else {
      bg = parseInt(xline[i]);
    }
    return i;
  }

  function emitEndToken() {
    var data = "";
    if(out.length > 0) {
      var data = qwebirc.ui.urlificate(element, out.join(""), execfn, cmdfn, window);
      entity.appendChild(element);
      out = [];
    }
    element = document.createElement("span");
    return data;
  }  
  
  function emitStartToken() {
    if(autoNickColour)
      return element;
      
    var classes = []
    if(fg != undefined)
      classes.push("Xc" + fg);
    if(bg != undefined)
      classes.push("Xbc" + bg);
    if(bold)
      classes.push("Xb");
    if(underline)
      classes.push("Xu");
    element.className = classes.join(" ");
  }
  
  var nickColouring = window.parentObject.uiOptions.NICK_COLOURS; /* HACK */
  var capturingNick = false;
  for(var i=0;i<xline.length;i++) {
    var lc = xline[i];

    if(nickColouring) {
      if(!capturingNick) {
        if(lc == "\x00") {
          capturingNick = true;
          emitEndToken();
          continue;
        }
      } else {
        if(lc != "\x00") {
          out.push(lc);
        } else {
          autoNickColour = true;
          var e = emitStartToken();
          var text = emitEndToken();
          
          var c = text.toHSBColour(window.client);
          if($defined(c))
            e.style.color = c.rgbToHex();
          capturingNick = autoNickColour = false;
        }
        continue;
      }
    } else if(lc == "\x00") {
      continue;
    }
    
    if(lc == "\x02") {
      emitEndToken();

      bold = !bold;
      
      emitStartToken();
    } else if(lc == "\x1F") {
      emitEndToken();

      underline = !underline;
      
      emitStartToken();
    } else if(lc == "\x0F") {
      emitEndToken();
      
      fg = undefined;
      bg = undefined;
      underline = false;
      bold = false;
    } else if(lc == "\x03") {
      emitEndToken();
      
      i = parseColours(xline, i);
      if(bg > 15)
        bg = undefined;
      if(fg > 15)
        fg = undefined;
        
      emitStartToken();
    } else {
      out.push(lc);
    }
  }
  
  emitEndToken();
}

String.prototype.toHSBColour = function(client) {
  var lower = client.toIRCLower(client.stripPrefix(this));
  if(lower == client.lowerNickname)
    return null;
    
  var hash = 0;
  for(var i=0;i<lower.length;i++)
    hash = 31 * hash + lower.charCodeAt(i);
  
  var hue = Math.abs(hash) % 360;

  return new Color([hue, 70, 60], "hsb");
}

qwebirc.ui.urlificate = function(element, text, execfn, cmdfn, window) {
  var punct_re = /[[\)|\]]?(\.*|[\,;])$/;
  var addedText = [];
  
  var txtprocess = function(text, regex, appendfn, matchfn) {
    for(;;) {
      var index = text.search(regex);
      if(index == -1) {
       appendfn(text);
       break;
      }
      var match = text.match(regex);
      
      var before = text.substring(0, index);
      var matched = match[0];
      var after = text.substring(index + matched.length);
    
      appendfn(before);
      var more = matchfn(matched, appendfn);
      if(!more)
        more = "";
      text = more + after;
    }
  };
  
  var appendText = function(text) {
    addedText.push(text);
    qwebirc.util.NBSPCreate(text, element);
  };
  
  var appendChan = function(text) {
    var newtext = text.replace(punct_re, "");
    addedText.push(newtext);
    var punct = text.substring(newtext.length);

    var a = new Element("span");
    a.href = "#";
    a.addClass("hyperlink-channel");
    a.addEvent("click", function(e) {
      new Event(e).stop();
      execfn("/JOIN " + newtext);
    });
    a.appendChild(document.createTextNode(newtext));
    element.appendChild(a);
    
    return punct;
  };

  var appendURL = function(text, appendfn) {  
    var url = text.replace(punct_re, "");
    var punct = text.substring(url.length);
    
    var href = "";
    var fn = null;
    var target = "_blank";
    var disptext = url;
    var elementType = "a";
    var addClass;
    
    var ma = url.match(/^qwebirc:\/\/(.*)$/);
    if(ma) {
      var m = ma[1].match(/^([^\/]+)\/([^\/]+)\/?(.*)$/);
      if(!m) {
        appendfn(text);
        return; 
      }
      
      var cmd = cmdfn(m[1], window);
      if(cmd) {
        addClass = m[1];
        elementType = cmd[0];
        if(cmd[0] != "a") {
          url = null;
        } else {
          url = "#";
        }
        fn = cmd[1];
        disptext = unescape(m[2]);
        target = null;
      } else {
        appendfn(text);
        return;
      }
      if(m[3])
        punct = m[3] + punct;
    } else {
      if(url.match(/^www\./))
        url = "http://" + url;
      else if(url.match(/^connect/)){
          target = null;
          u = url.split(';');
          server = u[0].split(' ')[1];
          password = u[1].split(' ');
          password = password[password.length - 1];
          url = 'steam://connect/' + server + '/' + password
      }
    }
    
    var a = new Element(elementType);
    if(addClass)
      a.addClass("hyperlink-" + addClass);
      
    if(url) {
      a.href = url;
      a.onclick = function(){document.window.steamlink = new Date().getTime();}
    
      if(target){
        a.target = target;
      }
    }
    addedText.push(disptext);
    a.appendChild(document.createTextNode(disptext));
    
    element.appendChild(a);
    if($defined(fn))
      a.addEvent("click", function(e) { new Event(e).stop(); fn(disptext); });
    
    return punct;
  };

  txtprocess(text, /\b((https?|ftp|qwebirc):\/\/|www\.)[^ ]+|connect [a-zA-Z0-9_]*\..*[a-zA-Z0-9_]*.*;.*password [a-zA-Z0-9_]*/i, function(text) {
    txtprocess(text, /\B#[^ ,]+/, appendText, appendChan);
  }, appendURL);
  
  return addedText.join("");
}

qwebirc.ui.themes.ThemeControlCodeMap = {
  "C": "\x03",
  "B": "\x02",
  "U": "\x1F",
  "O": "\x0F",
  "{": "\x00",
  "}": "\x00",
  "[": "qwebirc://whois/",
  "]": "/",
  "$": "$"
};

qwebirc.ui.themes.Default = {
  "PREFIX": ["$C4==$O "],
  "SIGNON": ["Signed on!", true],
  "CONNECT": ["Connected to server.", true],
  "RAW": ["$m", true],
  "DISCONNECT": ["Disconnected from server: $m", true],
  "ERROR": ["ERROR: $m", true],
  "SERVERNOTICE": ["$m", true],
  "JOIN": ["${$N$} [$h] has joined $c", true],
  "OURJOIN": ["${$N$} [$h] has joined $c", true],
  "PART": ["${$N$} [$h] has left $c [$m]", true],
  "KICK": ["${$v$} was kicked from $c by ${$N$} [$m]", true],
  "MODE": ["mode/$c [$m] by ${$N$}", true],
  "QUIT": ["${$N$} [$h] has quit [$m]", true],
  "NICK": ["${$n$} has changed nick to ${$[$w$]$}", true],
  "TOPIC": ["${$N$} changed the topic of $c to: $m", true],
  "UMODE": ["Usermode change: $m", true],
  "INVITE": ["$N invites you to join $c", true],
  "HILIGHT": ["$C4"],
  "HILIGHTEND": ["$O"],
  "CHANMSG": ["<${$@$($N$)$}> $m"],
  "PRIVMSG": ["<$($N$)> $m"],
  "CHANNOTICE": ["-${$($N$)$}:$c- $m"],
  "PRIVNOTICE": ["-$($N$)- $m"],
  "OURCHANMSG": ["<$@$N> $m"],
  "OURPRIVMSG": ["<$N> $m"],
  "OURTARGETEDMSG": ["*$[$t$]* $m"],
  "OURTARGETEDNOTICE": ["[notice($[$t$])] $m"],
  "OURCHANNOTICE": ["-$N:$t- $m"],
  "OURPRIVNOTICE": ["-$N- $m"],
  "OURCHANACTION": [" * $N $m"],
  "OURPRIVACTION": [" * $N $m"],
  "CHANACTION": [" * ${$($N$)$} $m"],
  "PRIVACTION": [" * $($N$) $m"],
  "CHANCTCP": ["$N [$h] requested CTCP $x from $c: $m"],
  "PRIVCTCP": ["$N [$h] requested CTCP $x from $-: $m"],
  "CTCPREPLY": ["CTCP $x reply from $N: $m"],
  "OURCHANCTCP": ["[ctcp($t)] $x $m"],
  "OURPRIVCTCP": ["[ctcp($t)] $x $m"],
  "OURTARGETEDCTCP": ["[ctcp($t)] $x $m"],
  "WHOISUSER": ["$B$N$B [$h]", true],
  "WHOISREALNAME": [" realname : $m", true],
  "WHOISCHANNELS": [" channels : $m", true],
  "WHOISSERVER": [" server   : $x [$m]", true],
  "WHOISACCOUNT": [" account  : qwebirc://qwhois/$m", true],
  "WHOISIDLE": [" idle     : $x [connected: $m]", true],
  "WHOISAWAY": [" away     : $m", true],
  "WHOISOPER": ["          : $BIRC Operator$B", true],
  "WHOISOPERNAME": [" operedas : $m", true],
  "WHOISACTUALLY": [" realhost : $m [ip: $x]", true],
  "WHOISGENERICTEXT": ["          : $m", true],
  "WHOISEND": ["End of WHOIS", true],
  "AWAY": ["$N is away: $m", true],
  "GENERICERROR": ["$m: $t", true],
  "GENERICMESSAGE": ["$m", true],
  "WALLOPS": ["WALLOP $n: $t", true],
  "CHANNELCREATIONTIME": ["Channel $c was created at: $m", true],
  "CHANNELMODEIS": ["Channel modes on $c are: $m", true]
};

qwebirc.ui.Theme = new Class({
  initialize: function(themeDict) {
    this.__theme = qwebirc.util.dictCopy(qwebirc.ui.themes.Default);
    
    if(themeDict)
      for(var k in themeDict)
        this.__theme[k] = themeDict[k];

    for(var k in this.__theme) {
      if(k == "PREFIX")
        continue;

      var data = this.__theme[k];
      if(data[1]) {
        this.__theme[k] = this.__theme["PREFIX"] + data[0];
      } else {
        this.__theme[k] = data[0];
      }
    }
    
    this.__ccmap = qwebirc.util.dictCopy(qwebirc.ui.themes.ThemeControlCodeMap);
    this.__ccmaph = qwebirc.util.dictCopy(this.__ccmap);

    this.__ccmaph["("] = this.message("HILIGHT", {}, this.__ccmap);
    this.__ccmaph[")"] = this.message("HILIGHTEND", {}, this.__ccmap);
    this.__ccmaph["{"] = this.__ccmaph["}"] = "";
  },
  __dollarSubstitute: function(x, h, mapper) {
    if(x == '-${$($N$)$}:$c- $m' && h['c'] == '#brouhaha')
        x = '-${$($N$)$}- $m'
    var msg = [];

    var n = x.split("");
    for(var i=0;i<n.length;i++) {
      var c = n[i];
      if(c == "$" && (i <= n.length - 1)) {
        var c2 = n[++i];

        var o = mapper[c2];
        if(!o)
          o = h[c2];
        if(o)
          msg.push(o);
      } else {
        msg.push(c);
      }
    }
    
    return msg.join("");
  },
  message: function(type, data, hilight) {
    var map;
    if(hilight) {
      map = this.__ccmaph;
    } else {
      map = this.__ccmap;
    }
    
    if(data && data["n"])
      data["N"] = "qwebirc://whois/" + data.n + "/";
    return this.__dollarSubstitute(this.__theme[type], data, map);
  }
});

qwebirc.ui.HilightController = new Class({
  initialize: function(parent) {
    this.parent = parent;
    this.regex = null;
    this.prevnick = null;
  },
  match: function(text) {
    var nick = this.parent.nickname;
    if(nick != this.prevnick) {
      var classes = '[\\s\\.,;:]';
      this.regex = new RegExp('(^|' + classes + ')' + RegExp.escape(nick) + '(' + classes + '|$)', "i");
    }
    if(text.match(this.regex))
      return true;
    return false;
  }
});

qwebirc.ui.Beeper = new Class({
  initialize: function(uiOptions) {
    this.uiOptions = uiOptions;
    
    this.soundInited = false;
    this.soundReady = false;

    if(this.uiOptions.BEEP_ON_MENTION)
      this.soundInit();
  },
  soundInit: function() {
    if(this.soundInited)
      return;
    if(!$defined(Browser.Plugins.Flash) || Browser.Plugins.Flash.version < 8)
      return;
    this.soundInited = true;
    
    this.soundPlayer = new qwebirc.sound.SoundPlayer();
    this.soundPlayer.addEvent("ready", function() {
      this.soundReady = true;
    }.bind(this));
    
    this.soundPlayer.go();
  },
  beep: function() {
    if(!this.soundReady || !this.uiOptions.BEEP_ON_MENTION)
      return;
      
    this.soundPlayer.beep();
  }
});

qwebirc.ui.Flasher = new Class({
  initialize: function(uiOptions) {
    this.uiOptions = uiOptions;
    
    this.windowFocused = false;
    this.canUpdateTitle = true;
    this.titleText = document.title;

    var favIcon = this._getFavIcon();
    if($defined(favIcon)) {
      this.favIcon = favIcon;
      this.favIconParent = favIcon.parentNode;
      this.favIconVisible = true;
      this.emptyFavIcon = new Element("link");
      this.emptyFavIcon.rel = "shortcut icon";
      this.emptyFavIcon.href = qwebirc.global.staticBaseURL + "images/empty_favicon.ico";
      this.emptyFavIcon.type = "image/x-icon";
      this.flashing = false;
    
      this.canFlash = true;
      document.addEvent("mousedown", this.cancelFlash.bind(this));
      document.addEvent("keydown", this.cancelFlash.bind(this));
    } else {
      this.canFlash = false;
    }
  },
  _getFavIcon: function() {
    var favIcons = $$("head link");
    for(var i=0;i<favIcons.length;i++)
      if(favIcons[i].getAttribute("rel") == "shortcut icon")
        return favIcons[i];
  },
  flash: function() {
    if(!this.uiOptions.FLASH_ON_MENTION || this.windowFocused || !this.canFlash || this.flashing)
      return;

    this.titleText = document.title; /* just in case */      
    var flashA = function() {
      this.hideFavIcon();
      this.canUpdateTitle = false;
      document.title = "Activity!";
      
      this.flasher = flashB.delay(500);
    }.bind(this);
    
    var flashB = function() {
      this.showFavIcon();
      this.canUpdateTitle = true;
      document.title = this.titleText;
      
      this.flasher = flashA.delay(500);
    }.bind(this);

    this.flashing = true;
    flashA();
  },
  cancelFlash: function() {
    if(!this.canFlash || !$defined(this.flasher))
      return;
      
    this.flashing = false;
    
    $clear(this.flasher);
    this.flasher = null;
    
    this.showFavIcon();
    document.title = this.titleText;
    this.canUpdateTitle = true;
  },
  hideFavIcon: function() {
    if(this.favIconVisible) {
      /* only seems to work in firefox */
      this.favIconVisible = false;
      this.favIconParent.removeChild(this.favIcon);
      this.favIconParent.appendChild(this.emptyFavIcon);
    }
  },
  showFavIcon: function() {
    if(!this.favIconVisible) {
      this.favIconVisible = true;
      this.favIconParent.removeChild(this.emptyFavIcon);
      this.favIconParent.appendChild(this.favIcon);
    }
  },
  updateTitle: function(text) {
    this.titleText = text;
    return this.canUpdateTitle;
  },
  focusChange: function(value) {
    this.windowFocused = value;

    if(value)
      this.cancelFlash();
  }
});

qwebirc.ui.TabCompleterFactory = new Class({
  initialize: function(ui) {
    this.ui = ui;
    this.reset();
  },
  tabComplete: function(textBox) {
    var text = textBox.value;
    
    if(!$defined(this.obj)) {
      this.incr = 1;
      
      var w = this.ui.getActiveWindow();
      if(!w)
        return;
        
      var startingWord = qwebirc.util.getEnclosedWord(text, qwebirc.util.getCaretPos(textBox));
      var preword = "", word = "", postword = "";
      if($defined(startingWord)) {
        var preword = text.substring(0, startingWord[0]);
        var word = startingWord[1];
        var postword = text.substring(startingWord[0] + word.length);
      }
      
      var ltext = text.toLowerCase();
      if(text == "") {
        preword = "/msg ";
        obj = qwebirc.ui.QueryTabCompleter;
      } else if(w.client.isChannel(word)) {
        obj = qwebirc.ui.ChannelNameTabCompleter;
      } else if(false/*ltext.match(/^\/(q|query|msg) /i)*/) {
        obj = qwebirc.ui.QueryTabCompleter;
      } else if(w.type == qwebirc.ui.WINDOW_QUERY) {
        obj = qwebirc.ui.QueryNickTabCompleter;
      } else if(w.type == qwebirc.ui.WINDOW_CHANNEL) {
        /* "slug[TAB]" == "slug: " */
        if(preword == "") {
          if((postword != "") && postword.charAt(0) == " ") {
            postword = ":" + postword;
          } else {
            postword = ": " + postword;
          }
          this.incr++;
        }
        obj = qwebirc.ui.ChannelUsersTabCompleter;
      } else {
        return;
      }

      if(postword == "")
        postword = " ";
      
      this.obj = new obj(preword, word, postword, w);
      if(!$defined(this.obj))
        return;
    }
      
    var r = this.obj.get();
    if(!$defined(r))
      return;
      
    textBox.value = r[1];
    qwebirc.util.setCaretPos(textBox, r[0] + this.incr);
  },
  reset: function() {
    this.obj = null;
  }
});

qwebirc.ui.TabIterator = new Class({
  initialize: function(client, prefix, list) {
    this.prefix = prefix;
    if(!$defined(list) || list.length == 0) {
      this.list = null;
    } else {
      var l = [];
      
      var prefixl = qwebirc.irc.toIRCCompletion(client, prefix);
      
      /* convert the nick list to IRC lower case, stripping all non letters
       * before comparisions */
      for(var i=0;i<list.length;i++) {
        var l2 = qwebirc.irc.toIRCCompletion(client, list[i]);
        
        if(l2.startsWith(prefixl))
          l.push(list[i]);
      }
      this.list = l;
    }
    
    this.pos = -1;
  },
  next: function() {
    /*
     * ideally next would do the list gubbins recursively, but no JS engine currently
     * support tail recursion :(
     */
    if(!$defined(this.list))
      return null;
    
    this.pos = this.pos + 1;
    if(this.pos >= this.list.length)
      this.pos = 0;
      
    return this.list[this.pos];
  }
});

qwebirc.ui.BaseTabCompleter = new Class({
  initialize: function(client, prefix, existingNick, suffix, list) {
    this.existingNick = existingNick;
    this.prefix = prefix;
    this.suffix = suffix;
    this.iterator = new qwebirc.ui.TabIterator(client, existingNick, list);
  },
  get: function() {
    var n = this.iterator.next();
    if(!$defined(n))
      return null;
      
    var p = this.prefix + n;
    return [p.length, p + this.suffix];
  }
});

qwebirc.ui.QueryTabCompleter = new Class({
  Extends: qwebirc.ui.BaseTabCompleter,
  initialize: function(prefix, existingNick, suffix, window) {
    this.parent(window.client, prefix, existingNick, suffix, window.client.lastNicks);
  }
});

qwebirc.ui.QueryNickTabCompleter = new Class({
  Extends: qwebirc.ui.BaseTabCompleter,
  initialize: function(prefix, existingText, suffix, window) {
    var nick = window.name
    this.parent(window.client, prefix, existingText, suffix, [nick]);
  }
});

qwebirc.ui.ChannelNameTabCompleter = new Class({
  Extends: qwebirc.ui.BaseTabCompleter,
  initialize: function(prefix, existingText, suffix, window) {

    /* WTB map */
    var l = [];
    var wa = window.parentObject.windows[window.parentObject.getClientId(window.client)];
    
    for(var c in window.client.channels) {
      var w = wa[c];
      
      /* redundant? */
      if($defined(w))
        w = w.lastSelected;
        
      l.push([w, c]);
    }
    
    l.sort(function(a, b) {
      return b[0] - a[0];
    });

    var l2 = [];    
    for(var i=0;i<l.length;i++)
      l2.push(l[i][1]);
    this.parent(window.client, prefix, existingText, suffix, l2);
  }
});

qwebirc.ui.ChannelUsersTabCompleter = new Class({
  Extends: qwebirc.ui.BaseTabCompleter,
  initialize: function(prefix, existingText, suffix, window) {
    var nc = window.client.tracker.getSortedByLastSpoke(window.name);

    this.parent(window.client, prefix, existingText, suffix, nc);
  }
});

qwebirc.ui.style.ModifiableStylesheet = new Class({
  initialize: function(url) {
    var n = this.__parseStylesheet(this.__getStylesheet(url));
    
    this.__cssText = n.cssText;
    this.rules = n.rules;
    
    this.__tag = this.__createTag();
  },
  __createTag: function() {
    var tag = document.createElement("style");
    tag.type = "text/css";
    tag.media = "all";

    document.getElementsByTagName("head")[0].appendChild(tag);
    
    return tag;
  },
  __getStylesheet: function(url) {
    var r = new Request({url: url, async: false});
    var result;
    r.addEvent("complete", function(x) {
      result = x;
    });
    r.get();
    return result;
  },
  __setStylesheet: function(stylesheet) {
    var node = this.__tag;
    
    if(node.styleSheet) { /* IE */
      node.styleSheet.cssText = stylesheet;
    } else {
      var d = document.createTextNode(stylesheet);
      node.appendChild(d);
      while(node.childNodes.length > 1)
        node.removeChild(node.firstChild);
    }
  },
  __parseStylesheet: function(data) {
    var lines = data.replace("\r\n", "\n").split("\n");
    
    var rules = {};
    var i;
    for(i=0;i<lines.length;i++) {
      var line = lines[i];
      if(line.trim() === "")
        break;
        
      var tokens = line.splitMax("=", 2);
      if(tokens.length != 2)
        continue;
        
      rules[tokens[0]] = tokens[1];
    }
    
    var cssLines = []
    for(;i<lines.length;i++)
      cssLines.push(lines[i]);
      
    return {cssText: cssLines.join("\n"), rules: rules};
  },
  set: function(mutator) {
    if(!$defined(mutator))
      mutator = function(x) { return x; };
      
    var text = this.__cssText;
    for(var key in this.rules) {
      var s = this.rules[key].split(",");
      var value = mutator.pass(s);
      
      text = text.replaceAll("$(" + key + ")", value);
    }
    
    this.__setStylesheet(text);
  }
});

qwebirc.ui.GenericLoginBox = function(parentElement, callback, initialNickname, initialChannels, autoConnect, autoNick, networkName) {
  if(autoConnect) {
    qwebirc.ui.ConfirmBox(parentElement, callback, initialNickname, initialChannels, autoNick, networkName);
  } else {
    qwebirc.ui.LoginBox(parentElement, callback, initialNickname, initialChannels, networkName);
  }
}

qwebirc.ui.AuthLogin = function(e) {
  var cookie = Cookie.write("redirect", document.location);
  document.location = qwebirc.global.dynamicBaseURL + "auth/";
  new Event(e).stop();
}

qwebirc.ui.ConfirmBox = function(parentElement, callback, initialNickname, initialChannels, autoNick, networkName) {
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
  
  text.appendChild(document.createTextNode("To connect to " + networkName + " IRC and join channel" + ((c.length>1)?"s":"") + " "));

  for(var i=0;i<c.length;i++) {
    if((c.length > 1) && (i == c.length - 1)) {
      text.appendChild(document.createTextNode(" and "));
    } else if(i > 0) {
      text.appendChild(document.createTextNode(", "));
    }
    text.appendChild(new Element("b").set("text", c[i]));
    
  }
  
  if(!autoNick) {
    text.appendChild(document.createTextNode(" as "));
    text.appendChild(nick);
  }
  
  text.appendChild(document.createTextNode(" click 'Connect'."));
  text.appendChild(new Element("br"));
  if(qwebirc.auth.enabled() && qwebirc.auth.quakeNetAuth() && !qwebirc.auth.loggedin())
    text.appendChild(document.createTextNode("If you'd like to connect using your Q auth click 'Log in'."));

  var tr = new Element("tr");
  tbody.appendChild(tr);
  tr.addClass("tr2");
  
  var td = new Element("td");
  tr.appendChild(td);

  var yes = new Element("input", {"type": "submit", "value": "Connect"});
  td.appendChild(yes);
  yes.addEvent("click", function(e) {
    parentElement.removeChild(outerbox);
    callback({"nickname": initialNickname, "autojoin": initialChannels});
  });
  
  if(qwebirc.auth.enabled() && qwebirc.auth.quakeNetAuth() && !qwebirc.auth.loggedin()) {
    var auth = new Element("input", {"type": "submit", "value": "Log in"});
    td.appendChild(auth);
    auth.addEvent("click", qwebirc.ui.AuthLogin);
  }
  
  if(window == window.top) 
    yes.focus();
}

qwebirc.ui.LoginBox = function(parentElement, callback, initialNickname, initialChannels, networkName) {
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
  box.addClass("qwebirc-loginbox");
  td.appendChild(box);
  
  var tbody = new Element("tbody");
  box.appendChild(tbody);
  
  var tr = new Element("tr");
  tbody.appendChild(tr);
  tr.addClass("tr1");
  
  var td = new Element("td");
  tr.appendChild(td);
  td.set("html", "<h1>Connect to " + networkName + " IRC</h1>");  
    
  var tr = new Element("tr");
  tbody.appendChild(tr);
  tr.addClass("tr2");
  
  var td = new Element("td");
  tr.appendChild(td);
  
  var form = new Element("form");
  td.appendChild(form);

  var boxtable = new Element("table");
  form.appendChild(boxtable);

  var tbody = new Element("tbody");
  boxtable.appendChild(tbody); /* stupid IE */

  function createRow(label, e2, style) {
    var r = new Element("tr");
    tbody.appendChild(r);

    var d1 = new Element("td");
    if(label)
      d1.set("text", label);
    r.appendChild(d1);

    var d2 = new Element("td");
    r.appendChild(d2);
    
    if($defined(e2))
      d2.appendChild(e2);
    if($defined(style)) {
      r.setStyles(style);
      return [r, d2];
    }
    
    return d2;
  }

  var nick = new Element("input");
  var nickname = '';
  var gamesurge = '';
  var password = '';
  if(Cookie.read("nickname") != null)
      nickname = Cookie.read("nickname");
  if(Cookie.read("gamesurge") != null)
      gamesurge = Cookie.read("gamesurge");
  if(Cookie.read("password") != null)
      password = Cookie.read("password");
  nick.id = 'nickname';
  createRow("Nickname:", nick);

  // Create auth box.
  var r = new Element("tr");
  tbody.appendChild(r);
  var d1 = new Element("td");
  d1.colSpan = "2";
  d1.innerHTML = '<input type="checkbox" onmousedown="window.nickname = document.getElementById(' + '\'nickname\'' + ').value;this.parentNode.parentNode.parentNode.innerHTML = \'<tr><td>Nickname:</td><td><input id=nickname  ></td></tr><tr><td>Gamesurge account:</td><td><input id=gamesurge value=' + gamesurge + ' ></td></tr><tr><td>Password:</td><td><input type=password id=password value=' + password + ' ></td></tr><tr><td><td><input type=checkbox checked id=save > Save information</td></tr><tr><td></td><td><input type=submit value=Connect /></td></tr>\';document.getElementById(' + '\'nickname\'' + ').value = window.nickname;"/>Auth options (optional)';
  r.appendChild(d1);
  
  var chanStyle = null;
  if(qwebirc.auth.enabled() && qwebirc.auth.bouncerAuth())
    chanStyle = {display: "none"};
  
  var chan = new Element("input");
  //createRow("Channels:", chan, chanStyle);

  if(qwebirc.auth.enabled()) {
    if(qwebirc.auth.passAuth()) {
      var authRow = createRow("Auth to services:");
      var authCheckBox = qwebirc.util.createInput("checkbox", authRow, "connect_auth_to_services", false);
    
      var usernameBox = new Element("input");
      var usernameRow = createRow("Username:", usernameBox, {display: "none"})[0];
    
      var passwordRow = createRow("Password:", null, {display: "none"});
      var passwordBox = qwebirc.util.createInput("password", passwordRow[1], "connect_auth_password");

      authCheckBox.addEvent("click", function(e) { qwebirc.ui.authShowHide(authCheckBox, authRow, usernameBox, usernameRow, passwordRow[0]) });
    } else if(qwebirc.auth.bouncerAuth()) {
      var passwordRow = createRow("Password:");
      var passwordBox = qwebirc.util.createInput("password", passwordRow, "connect_auth_password");
    }
  }
  
  var connbutton = new Element("input", {"type": "submit"});
  connbutton.set("value", "Connect");
  var r = createRow(undefined, connbutton);
  
  if(qwebirc.auth.enabled() && qwebirc.auth.quakeNetAuth() && !qwebirc.auth.loggedin()) {
    var auth = new Element("input", {"type": "submit", "value": "Log in"});
    r.appendChild(auth);
    auth.addEvent("click", qwebirc.ui.AuthLogin);
  }

  form.addEvent("submit", function(e) {
    new Event(e).stop();
    var nickname = document.getElementById('nickname').value;
    Cookie.write("nickname", nickname, {duration: 9999});
    if(document.getElementById('save') != null){
        if(document.getElementById('save').checked == true){
            Cookie.write("gamesurge", document.getElementById('gamesurge').value, {duration: 9999});
            Cookie.write("password", document.getElementById('password').value, {duration: 9999});
        }else{
            Cookie.write("gamesurge", '', {duration: 9999});
            Cookie.write("password", '', {duration: 9999});
        }
    }
    var chans = chan.value;
    if(chans == "#") /* sorry channel "#" :P */
      chans = "";

    if(!nickname) {
      alert("You must supply a nickname.");
      nick.focus();
      return;
    }
    var stripped = qwebirc.global.nicknameValidator.validate(nickname);
    if(stripped != nickname) {
      nick.value = stripped;
      alert("Your nickname was invalid and has been corrected; please check your altered nickname and press Connect again.");
      nick.focus();
      return;
    }
    
    var data = {"nickname": nickname, "autojoin": chans, "gamesurge":Cookie.read("gamesurge"), "password":Cookie.read("password")};
    if(qwebirc.auth.enabled()) {
      if(qwebirc.auth.passAuth() && authCheckBox.checked) {
          if(!usernameBox.value || !passwordBox.value) {
            alert("You must supply your username and password in auth mode.");
            if(!usernameBox.value) {
              usernameBox.focus();
            } else {
              passwordBox.focus();
            }
            return;
          }
          
          data["serverPassword"] = usernameBox.value + " " + passwordBox.value;
      } else if(qwebirc.auth.bouncerAuth()) {
        if(!passwordBox.value) {
          alert("You must supply a password.");
          passwordBox.focus();
          return;
        }
        
        data["serverPassword"] = passwordBox.value;
      }
    }
    parentElement.removeChild(outerbox);
    
    callback(data);
  }.bind(this));
    
  nick.set("value", initialNickname);
  chan.set("value", initialChannels);

  nick.value = nickname;
  if(window == window.top)
    nick.focus();
}

qwebirc.ui.authShowHide = function(checkbox, authRow, usernameBox, usernameRow, passwordRow) {
  var visible = checkbox.checked;
  var display = visible?null:"none";
  usernameRow.setStyle("display", display);
  passwordRow.setStyle("display", display);
  
  if(visible) {
//    authRow.parentNode.setStyle("display", "none");
    usernameBox.focus();
  }
}

/* NEEDS converting to plain HTML! */
qwebirc.ui.EmbedWizardStep = new Class({
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
    
    while(this.parent.middleRow.childNodes.length > 0)
      this.parent.middleRow.removeChild(this.parent.middleRow.childNodes[0]);
      
    if($defined(this.options.middle))
      this.parent.middleRow.appendChild(this.options.middle);
    
    this.fireEvent("show");
  }
});

qwebirc.ui.EmbedWizard = new Class({
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
    return new qwebirc.ui.EmbedWizardStep(this, options);
  },
  newRadio: function(parent, text, name, selected) {
    var p = new Element("div");
    parent.appendChild(p);

    var id = qwebirc.util.generateID();
    var r = qwebirc.util.createInput("radio", p, name, selected, id);
    
    var label = new Element("label", {"for": id});
    label.appendChild(document.createTextNode(text));
    p.appendChild(label);
      
    return r;
  },
  addSteps: function() {
    var af = function(select) {
      if(Browser.Engine.trident) {
        var f = function() {
          this.focus();
          if(select)
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
        if(this.nicknameBox.value == "") {
          alert("You must supply a nickname.");
          this.nicknameBox.focus();
          return false;
        }
        var v = qwebirc.global.nicknameValidator.validate(this.nicknameBox.value, true);
        if(v != this.nicknameBox.value) {
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

      while(codeDiv.childNodes.length > 0)
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
    
    if(this.presetnick.checked)
      this.steps.push(this.nickname);
      
    this.steps.push(this.chans);
    
    if(this.chanBox.value != "" && !this.choosenick.checked)
      this.steps.push(this.connectdialog);
    
    this.steps.push(this.lookandfeel);
    this.steps.push(this.finish);
  },
  showStep: function() {
    this.backBtn.disabled = !(this.step > 0);
    
    this.nextBtn.value = (this.step >= this.steps.length - 1)?"Close":"Next >";
      
    this.steps[this.step].show();
  },
  next: function() {
    var pm = this.steps[this.step].options.premove;
    
    if(pm && !pm())
      return;
      
    this.updateSteps();
    if(this.step >= this.steps.length - 1) {
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
    if(this.step <= 0)
      return;

      this.step = this.step - 1;
    this.showStep();
  },
  generateURL: function() {
    var chans = this.chanBox.value;
    var nick = this.nicknameBox.value;
    var connectdialog = this.connectdialogr.checked && chans != "" && !this.choosenick.checked;

    var URL = [];
    if(this.presetnick.checked) {
      URL.push("nick=" + escape(nick));
    } else if(!this.choosenick.checked) {
      URL.push("randomnick=1");
    }
    
    if(chans) {
      var d = chans.split(",");
      var d2 = [];
      
      d.forEach(function(x) {
        if(x.charAt(0) == '#')
          x = x.substring(1);
          
        d2.push(x);
      });
      
      URL.push("channels=" + escape(d2.join(",")));
    }
    
    if(connectdialog)
      URL.push("prompt=1");

    if(this.currentLF.checked) {
      var uioptions = this.options.uiOptions.serialise();
      if(uioptions != "")
        URL.push("uio=" + uioptions);
    }
    
    return this.options.baseURL + (URL.length>0?"?":"") + URL.join("&");
  }
});

qwebirc.ui.supportsFocus = function() {
  var ua = navigator.userAgent;
  if(!$defined(ua))
    return [true];
      
  if(Browser.Engine.ipod || ua.indexOf("Konqueror") != -1)
    return [false, false];

  return [true];
}

/**
 * Note that options are settable by the uioptions url arg by default unless you specifiy
 * settableByURL...
 */
qwebirc.config.DEFAULT_OPTIONS = [
  [1, "BEEP_ON_MENTION", "Beep when nick mentioned or on query activity (requires Flash)", true, {
    enabled: function() {
      if(!$defined(Browser.Plugins.Flash) || Browser.Plugins.Flash.version < 8)
        return [false, false]; /* [disabled, default_value] */
      return [true];
    },
    applyChanges: function(value, ui) {
      if(ui.setBeepOnMention)
        ui.setBeepOnMention(value);
    }
  }],
  [7, "FLASH_ON_MENTION", "Flash titlebar when nick mentioned or on query activity", true, {
    enabled: qwebirc.ui.supportsFocus
  }],
  [2, "DEDICATED_MSG_WINDOW", "Send privmsgs to dedicated messages window", false],
  [4, "DEDICATED_NOTICE_WINDOW", "Send notices to dedicated message window", false],
  [3, "NICK_OV_STATUS", "Show status (@/+) before nicknames in channel lines", true],
  [5, "ACCEPT_SERVICE_INVITES", "Automatically join channels when invited by Q", true, {
    settableByURL: false
  }],
  [6, "USE_HIDDENHOST", "Hide your hostmask when authed to Q (+x)", true, {
    settableByURL: false
  }],
  [8, "LASTPOS_LINE", "Show a last position indicator for each window", true, {
    enabled: qwebirc.ui.supportsFocus
  }],
  [9, "NICK_COLOURS", "Automatically colour nicknames", false],
  [10, "HIDE_JOINPARTS", "Hide JOINS/PARTS/QUITS", false],
  [11, "STYLE_HUE", "Adjust user interface hue", function() {
    return {class_: qwebirc.config.HueOption, default_: 210};
  }, {
    applyChanges: function(value, ui) {
      ui.setModifiableStylesheetValues({hue: value});
    }
  }],
  [12, "QUERY_ON_NICK_CLICK", "Query on nickname click in channel", false],
  [13, "SHOW_NICKLIST", "Show nickname list in channels", true],
  [14, "SHOW_TIMESTAMPS", "Show timestamps", true] /* we rely on the hue update */
];

qwebirc.config.DefaultOptions = null;

qwebirc.config.Input = new Class({
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
    if(!$defined(parent))
      parent = this.parentElement;

    return qwebirc.util.createInput(type, parent, name, selected, this.option.id);
  },
  FE: function(element, parent) {
    var n = new Element(element);
    if(!$defined(parent))
      parent = this.parentElement;
      
    parent.appendChild(n);
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
    if(!$defined(this.option.extras))
      return;
    var t = this.option.extras[name];
    if(!$defined(t))
      return;
      
    t.pass(x, this)();
  },
  cancel: function() {
  }
});

qwebirc.config.TextInput = new Class({
  Extends: qwebirc.config.Input,
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

qwebirc.config.HueInput = new Class({
  Extends: qwebirc.config.Input,
  render: function() {
    var i = new Element("div");
    i.addClass("qwebirc-optionspane");
    i.addClass("hue-slider");
    this.parentElement.appendChild(i);
    
    var k = new Element("div");
    k.addClass("knob");
    if(Browser.Engine.trident) {
      k.setStyle("top", "0px");
      k.setStyle("background-color", "black");
    }
    
    i.appendChild(k);
    
    var slider = new Slider(i, k, {steps: 36, range: [0, 369], wheel: true});
    slider.set(this.value);
    this.startValue = this.value;
    
    slider.addEvent("change", function(step) {
      this.value = step;
      this.applyChanges();
    }.bind(this));
    this.mainElement = i;
    
    if(!this.enabled)
      slider.detach();
    
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

qwebirc.config.CheckInput = new Class({
  Extends: qwebirc.config.Input,
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

qwebirc.config.RadioInput = new Class({
  Extends: qwebirc.config.Input,
  render: function() {
    var value = this.option.options;
    
    this.elements = [];
     
    for(var i=0;i<value.length;i++) {
      var d = this.FE("div", this.parentObject);
      var e = this.createInput("radio", d, "options_radio" + this.position, i == this.option.position);
      this.elements.push(e);
      e.disabled = !this.enabled;
   
      if(i == 0)
        this.mainElement = e;
      
      d.appendChild(document.createTextNode(value[i][0]));
    };
    this.parent();
  },
  get: function() {
    for(var i=0;i<this.elements.length;i++) {
      var x = this.elements[i];
      if(x.checked) {
        this.option.position = i;
        return this.option.options[i][1];
      }
    }
  }
});

qwebirc.config.Option = new Class({
  initialize: function(optionId, prefix, label, default_, extras) {
    this.prefix = prefix;
    this.label = label;
    this.default_ = default_;
    this.optionId = optionId;
    this.extras = extras;
    
    if($defined(extras) && $defined(extras.enabled)) {
      var enabledResult = extras.enabled();
      this.enabled = enabledResult[0];
      
      if(!enabledResult[0] && enabledResult.length > 1)
        this.default_ = enabledResult[1];
    } else {
      this.enabled = true;
    }
    
    if($defined(extras) && $defined(extras.settableByURL)) {
      this.settableByURL = extras.settableByURL;
    } else {
      this.settableByURL = true;
    }
  },
  setSavedValue: function(x) {
    if(this.enabled)
      this.value = x;
  }
});

qwebirc.config.RadioOption = new Class({
  Extends: qwebirc.config.Option,
  Element: qwebirc.config.RadioInput,
  initialize: function(optionId, prefix, label, default_, extras, options) {
    this.options = options.map(function(x) {
      if(typeof(x) == "string")
        return [x, x];
      return x;
    });
    this.defaultposition = default_;

    this.parent(optionId, prefix, label, this.options[default_][1], extras);
  },
  setSavedValue: function(x) {
    for(var i=0;i<this.options.length;i++) {
      var y = this.options[i][1];
      if(x == y) {
        this.position = i;
        this.value = x;
        return;
      }
    }
    this.position = this.defaultposition;
    this.value = this.default_;
  }
});

qwebirc.config.TextOption = new Class({
  Extends: qwebirc.config.Option,
  Element: qwebirc.config.TextInput
});

qwebirc.config.CheckOption = new Class({
  Extends: qwebirc.config.Option,
  Element: qwebirc.config.CheckInput
});

qwebirc.config.HueOption = new Class({
  Extends: qwebirc.config.Option,
  Element: qwebirc.config.HueInput
});

qwebirc.ui.Options = new Class({
  initialize: function(ui) {
    if(!$defined(qwebirc.config.DefaultOptions))
      this.__configureDefaults();
    
    this.optionList = qwebirc.config.DefaultOptions.slice();
    this.optionHash = {}
    this.ui = ui;
    
    this._setup();
    this.optionList.forEach(function(x) {
      x.setSavedValue(this._get(x));
      this.optionHash[x.prefix] = x;
      this[x.prefix] = x.value;
    }.bind(this));
  },
  __configureDefaults: function() {
    qwebirc.config.DefaultOptions = qwebirc.config.DEFAULT_OPTIONS.map(function(x) {
      var optionId = x[0];
      var prefix = x[1];
      var label = x[2];
      var default_ = x[3];
      var moreextras = x[4];
      var extras = x[5];
      
      var stype = typeof(default_);
      if(stype == "number") {
        return new qwebirc.config.RadioOption(optionId, prefix, label, default_, moreextras, extra);
      } else {
        var type;
        if(stype == "boolean") {
          type = qwebirc.config.CheckOption;
        } else if(stype == "function") {
          var options = default_();
          type = options.class_;
          default_ = options.default_;
        } else {
          type = qwebirc.config.TextOption;
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
  _get: function(x) {
    return x.default_;
  },
  _setup: function() {
  },
  flush: function() {
  }
});

qwebirc.ui.OptionsPane = new Class({
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
    for(var i=0;i<optList.length;i++) {
      var x = optList[i];
      
      var row = FE("tr", tb);
      var cella = FE("td", row);
      
      x.id = qwebirc.util.generateID();
      var label = new Element("label", {"for": x.id});
      cella.appendChild(label);
      label.set("text", x.label + ":");

      var cellb = FE("td", row);
      this.boxList.push([x, new x.Element(cellb, x, i, this)]);

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
    this.boxList.forEach(function(x) {
      var option = x[0];
      var box = x[1];
      this.optionObject.setValue(option, box.get());
    }.bind(this));
    this.boxList.forEach(function(x) {
      x[1].applyChanges();
    }.bind(this));
    this.optionObject.flush();
  },
  cancel: function() {
    this.boxList.forEach(function(x) {
      x[1].cancel();
    }.bind(this));
  }
});

qwebirc.ui.CookieOptions = new Class({
  Extends: qwebirc.ui.Options,
  _setup: function() {
    this.__cookie = new Hash.Cookie("opt1", {duration: 3650, autoSave: false});
  },
  _get: function(x) {
    var v = this.__cookie.get(x.optionId);
    if(!$defined(v))
      return x.default_;
    
    return v;
  },
  flush: function() {
    this.__cookie.erase();
    this._setup();
    
    this.getOptionList().forEach(function(x) {
      this.__cookie.set(x.optionId, x.value);
    }.bind(this));
    this.__cookie.save();
  }
});

qwebirc.ui.SuppliedArgOptions = new Class({
  Extends: qwebirc.ui.CookieOptions,
  initialize: function(ui, arg) {
    var p = {};
    
    if($defined(arg) && arg != "" && arg.length > 2) {
      var checksum = arg.substr(arg.length - 2, 2);
      var decoded = qwebirc.util.b64Decode(arg.substr(0, arg.length - 2));
      
      if(decoded && (new qwebirc.util.crypto.MD5().digest(decoded).slice(0, 2) == checksum))
        p = qwebirc.util.parseURI("?" + decoded);
    }
    
    this.parsedOptions = p;
    this.parent(ui);
  },
  _get: function(x) {
    if(x.settableByURL !== true)
      return this.parent(x);

    var opt = this.parsedOptions[x.optionId];
    if(!$defined(opt))
      return this.parent(x);
      
    return opt;
  },
  serialise: function() {
    var result = [];
    this.getOptionList().forEach(function(x) {
      if(x.settableByURL && x.default_ != x.value)
        result.push(x.optionId + "=" + x.value);
    }.bind(this));
    
    var raw = result.join("&");
    var checksum = new qwebirc.util.crypto.MD5().digest(raw).slice(0, 2);
    return (qwebirc.util.b64Encode(raw)).replaceAll("=", "") + checksum;
  }
});

qwebirc.ui.DefaultOptionsClass = new Class({
  Extends: qwebirc.ui.SuppliedArgOptions
});

qwebirc.ui.AboutPane = new Class({
  Implements: [Events],
  initialize: function(parent) {
    var delayfn = function() { parent.set("html", "<div class=\"loading\">Loading. . .</div>"); };
    var cb = delayfn.delay(500);
    
    var r = qwebirc.ui.RequestTransformHTML({url: qwebirc.global.staticBaseURL + "panes/about.html", update: parent, onSuccess: function() {
      $clear(cb);
      parent.getElement("input[class=close]").addEvent("click", function() {
        this.fireEvent("close");
      }.bind(this));
      parent.getElement("div[class=version]").set("text", "v" + qwebirc.VERSION);
    }.bind(this)});
    r.get();
  }
});

qwebirc.ui.PrivacyPolicyPane = new Class({
  Implements: [Events],
  initialize: function(parent) {
    var delayfn = function() { parent.set("html", "<div class=\"loading\">Loading. . .</div>"); };
    var cb = delayfn.delay(500);
    
    var r = qwebirc.ui.RequestTransformHTML({url: qwebirc.global.staticBaseURL + "panes/privacypolicy.html", update: parent, onSuccess: function() {
      $clear(cb);
      
      parent.getElement("input[class=close]").addEvent("click", function() {
        this.fireEvent("close");
      }.bind(this));
    }.bind(this)});
    r.get();
  }
});

qwebirc.ui.FeedbackPane = new Class({
  Implements: [Events],
  initialize: function(parent) {
    this.textboxVisible = false;
    var delayfn = function() { parent.set("html", "<div class=\"loading\">Loading. . .</div>"); };
    var cb = delayfn.delay(500);
    
    this.addEvent("select", this.onSelect);
    
    var r = qwebirc.ui.RequestTransformHTML({url: qwebirc.global.staticBaseURL + "panes/feedback.html", update: parent, onSuccess: function() {
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
    }.bind(this)});
    r.get();
  },
  onSelect: function() {
    if(this.textboxVisible)
      this.textbox.focus();
  },
  sendFeedback: function(parent, textbox, text) {
    text = text.replace(/^\s*/, "").replace(/\s*$/, "");
    var mainText = parent.getElement("p[class=maintext]");
    
    if(text.length < 25) {
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
    
    messageText.set("text", "Submitting. . .");
    messageBody.setStyle("display", "");
    
    /* basic checksum to stop really lame kiddies spamming */
    var checksum = 0;
    var esctext = encodeURIComponent(text);
    for(var i=0;i<text.length;i++)
      checksum = ((checksum + 1) % 256) ^ (text.charCodeAt(i) % 256);

    var r = new Request({url: qwebirc.global.dynamicBaseURL + "feedback", onSuccess: function() {
      messageText.set("text", "Submitted successfully, thanks for the feedback!");
      messageClose.setStyle("display", "");
    }, onFailure: function() {
      this.textboxVisible = true;
      messageBody.setStyle("display", "none");
      mainBody.setStyle("display", "");
      mainText.set("text", "Looks like something went wrong submitting :(");
    }.bind(this)}).send("feedback=" + text + "&c=" + checksum);
  }
});

qwebirc.ui.FAQPane = new Class({
  Implements: [Events],
  initialize: function(parent) {
    var delayfn = function() { parent.set("html", "<div class=\"loading\">Loading. . .</div>"); };
    var cb = delayfn.delay(500);
    
    var r = qwebirc.ui.RequestTransformHTML({url: qwebirc.global.staticBaseURL + "panes/faq.html", update: parent, onSuccess: function() {
      $clear(cb);
      parent.getElement("input[class=close]").addEvent("click", function() {
        this.fireEvent("close");
      }.bind(this));
    }.bind(this)});
    r.get();
  }
});

function qwebirc_ui_onbeforeunload(e) { /* IE sucks */
  if(new Date().getTime() - document.window.steamlink > 100){
      var message = "This action will close all active IRC connections.";
      var e = e || window.event;
      if(e)
        e.returnValue = message;
      return message;
  }
}

function highlightText(){
    isChannel = 0;
    if(document.getElementById('channel-name-id').innerHTML.search('#') >= 0){
        isChannel = 1;
    }
    e = document.getElementById('mainircwindow').childNodes;
    invisibleMessagesFromTarget = [];
    last5 = '';
    last5BackgroundColor = '';
    messagesFromTarget = '';
    visibleMessagesFromTarget = 0;
    visibleMark = 0;
    if(e.length > 150){
       visibleMark = e.length - 150;
    }
    for(i = 0; i < e.length; i++){
          s = e[i].getElementsByTagName('span');
          target = '';
          for(j = 0; j < s.length; j++){
              if(s[j].className == 'hyperlink-whois'){
                  target = s[j].innerHTML;
                  j = s.length; // Exit from the for loop.
              }
          }
          if(target != 0){
              e[i].style.fontWeight = '';
              e[i].style.backgroundColor = '';
              if(isChannel){
                  if(target.search('#') >= 0){
                      target = target.substr(target.search('#'));
                      if(target == document.getElementById('channel-name-id').innerHTML){
                          e[i].style.backgroundColor = '#ffffbf';
                          last5BackgroundColor = '#ffffbf';
                          if(i >= visibleMark && (e[i].offsetTop >= document.getElementById('mainircwindow').scrollTop && e[i].offsetTop <= document.getElementById('mainircwindow').offsetHeight + document.getElementById('mainircwindow').scrollTop)){
                              visibleMessagesFromTarget++;
                          }                      }
                  }else if(target.search(window.nickname) >= 0){
                      e[i].style.backgroundColor = '#ffbcaf';
                  }
              }else{
                  if(target.search(document.getElementById('channel-name-id').innerHTML) >= 0){
                      if(target.search('#') >= 0){
                          e[i].style.backgroundColor = '#ffded6';
                      }else{
                          e[i].style.backgroundColor = '#ffbcaf';
                          last5BackgroundColor = '#ffbcaf';
                          if(i >= visibleMark && (e[i].offsetTop >= document.getElementById('mainircwindow').scrollTop && e[i].offsetTop <= document.getElementById('mainircwindow').offsetHeight + document.getElementById('mainircwindow').scrollTop)){
                              visibleMessagesFromTarget++;
                          }                      }
                  }
              }
          }
    }

    if(document.getElementById('last5messages')){
        toDelete = document.getElementById('last5messages');
        toDelete.parentNode.removeChild(toDelete);
    }
    e = 0;
    if(document.getElementById('channel-name-id').innerHTML.toLowerCase() in IRC.windows){
        e = IRC.windows[document.getElementById('channel-name-id').innerHTML.toLowerCase()].lines.getElementsByTagName('div');
    }
    for(i = 0; i < e.length; i++){
        r = new RegExp('<span class="Xc4">==</span><span>');
        if(!r.test(e[i].innerHTML)){
            invisibleMessagesFromTarget[invisibleMessagesFromTarget.length] = e[i].innerHTML;
        }
    }
    if(document.window.selectedChannel == '#brouhaha' && visibleMessagesFromTarget < 5){
        last5 = new Element("div");
        if(last5BackgroundColor == ''){
            r = new RegExp('#');
            if(r.test(document.getElementById('channel-name-id').innerHTML)){
                last5BackgroundColor = '#ffffbf';
            }else{
                last5BackgroundColor = '#ffbcaf';
            }
        }
        last5.style.backgroundColor = last5BackgroundColor;
        main_parent = document.getElementById('mainircwindow');
        main_parent = main_parent.parentNode;
        main_parent.insertBefore(last5, document.getElementById('mainircwindow'));
        messagesFromTarget = '';
        i = 0;
        if(invisibleMessagesFromTarget.length > 5){
            i = invisibleMessagesFromTarget.length - 5;
        }
        for(; i < invisibleMessagesFromTarget.length - visibleMessagesFromTarget; i++){
            messagesFromTarget += '<div>' + invisibleMessagesFromTarget[i] + '</div>';
        }
        last5.innerHTML = messagesFromTarget;
        last5.id = 'last5messages';
    }
}

qwebirc.ui.Interface = new Class({
  Implements: [Options],
  options: {
    initialNickname: "qwebirc" + Math.ceil(Math.random() * 100000),
    initialChannels: "",
    networkName: "ExampleNetwork",
    networkServices: [],
    loginRegex: null,
    appTitle: "ExampleNetwork Web IRC",
    searchURL: true,
    theme: undefined,
    baseURL: null,
    hue: null,
    saturation: null,
    lightness: null,
    uiOptionsArg: null,
    nickValidation: null,
    dynamicBaseURL: "/",
    staticBaseURL: "/"
  },
  initialize: function(element, ui, options) {
    document.window.steamlink = 0;
    document.window.selectedChannel = '';
    window.lastkick = {channel:'', last:1}
    window.hasfocus = 1;
    window.onfocus = function(){
           this.hasfocus = 1;
    }
    window.onblur = function(){
           this.hasfocus = 0;
    }

    this.setOptions(options);
    
    /* HACK */
    qwebirc.global = {
      dynamicBaseURL: options.dynamicBaseURL,
      staticBaseURL: options.staticBaseURL,
      nicknameValidator: $defined(options.nickValidation) ? new qwebirc.irc.NicknameValidator(options.nickValidation) : new qwebirc.irc.DummyNicknameValidator()
    };

    window.addEvent("domready", function() {
      var callback = function(options) {
        var IRC = new qwebirc.irc.IRCClient(options, ui_);
        window.IRC = IRC;
        IRC.connect();
        window.onbeforeunload = qwebirc_ui_onbeforeunload;
        window.addEvent("unload", function() {
          IRC.quit("Page closed");
        });
      };

      var inick = null;
      var ichans = this.options.initialChannels;
      var autoConnect = false;
      
      if(this.options.searchURL) {
        var args = qwebirc.util.parseURI(String(document.location));
        this.options.hue = this.getHueArg(args);
        this.options.saturation = this.getSaturationArg(args);
        this.options.lightness = this.getLightnessArg(args);
        
        if($defined(args["uio"]))
          this.options.uiOptionsArg = args["uio"];

        var url = args["url"];
        var chans, nick = args["nick"];
        
        if($defined(url)) {
          ichans = this.parseIRCURL(url);
          if($defined(chans) && chans != "")
            canAutoConnect = true;
        } else {
          chans = args["channels"];

          var canAutoConnect = false;
        
          if(chans) {
            var cdata = chans.split(" ");
          
            chans = cdata[0].split(",");
            var chans2 = [];
          
            for(var i=0;i<chans.length;i++) {
              chans2[i] = chans[i];
            
              if(chans[i].charAt(0) != '#')
                chans2[i] = "#" + chans2[i]
            }
            cdata[0] = chans2.join(",");
            ichans = cdata.join(" ");
            canAutoConnect = true;
          }
        }
        
        if($defined(nick))
          inick = this.randSub(nick);
          
        if(args["randomnick"] && args["randomnick"] == 1)
          inick = this.options.initialNickname;
          
        /* we only consider autoconnecting if the nick hasn't been supplied, or it has and it's not "" */
        if(canAutoConnect && (!$defined(inick) || ($defined(inick) && (inick != "")))) {
          var p = args["prompt"];
          var pdefault = false;
          
          if(!$defined(p) || p == "") {
            pdefault = true;
            p = false;
          } else if(p == "0") {
            p = false;
          } else {
            p = true;
          }
          
          /* autoconnect if we have channels and nick but only if prompt != 1 */
          if($defined(inick) && !p) {
            autoConnect = true;
          } else if(!pdefault && !p) { /* OR if prompt=0, but not prompt=(nothing) */
            autoConnect = true;
          }
        }
      }
  
      var ui_ = new ui($(element), new qwebirc.ui.Theme(this.options.theme), this.options);

      var usingAutoNick = !$defined(nick);
      if(usingAutoNick && autoConnect)
        inick = this.options.initialNickname;
      
      var details = ui_.loginBox(callback, inick, ichans, autoConnect, usingAutoNick);
    }.bind(this));
  },
  getHueArg: function(args) {
    var hue = args["hue"];
    if(!$defined(hue))
      return null;
    hue = parseInt(hue);
    if(hue > 360 || hue < 0)
      return null;
    return hue;
  },
  getSaturationArg: function(args) {
    var saturation = args["saturation"];
    if(!$defined(saturation))
      return null;
    saturation = parseInt(saturation);
    if(saturation > 100 || saturation < -100)
      return null;
    return saturation;
  },
  getLightnessArg: function(args) {
    var lightness = args["lightness"];
    if(!$defined(lightness))
      return null;
    lightness = parseInt(lightness);
    if(lightness > 100 || lightness < -100)
      return null;
    return lightness;
  },
  randSub: function(nick) {
    var getDigit = function() { return Math.floor(Math.random() * 10); }
    
    return nick.split("").map(function(v) {
      if(v == ".") {
        return getDigit();
      } else {
        return v;
      }
    }).join("");
    
  },
  parseIRCURL: function(url) {
    if(url.indexOf(":") == 0)
      return;
    var schemeComponents = url.splitMax(":", 2);
    if(schemeComponents[0].toLowerCase() != "irc" && schemeComponents[0].toLowerCase() != "ircs") {
      alert("Bad IRC URL scheme.");
      return;
    }

    if(url.indexOf("/") == 0) {
      /* irc: */
      return;
    }
    
    var pathComponents = url.splitMax("/", 4);
    if(pathComponents.length < 4 || pathComponents[3] == "") {
      /* irc://abc */
      return;
    }
    
    var args, queryArgs;
    if(pathComponents[3].indexOf("?") > -1) {
      queryArgs = qwebirc.util.parseURI(pathComponents[3]);
      args = pathComponents[3].splitMax("?", 2)[0];
    } else {
      args = pathComponents[3];
    }
    var parts = args.split(",");

    var channel = parts[0];
    if(channel.charAt(0) != "#")
      channel = "#" + channel;

    var not_supported = [], needkey = false, key;
    for(var i=1;i<parts.length;i++) {
      var value = parts[i];
      if(value == "needkey") {
        needkey = true;
      } else {
        not_supported.push(value);
      }
    }

    if($defined(queryArgs)) {
      for(var key_ in queryArgs) {
        var value = queryArgs[key_];
        
        if(key_ == "key") {
          key = value;
          needkey = true;
        } else {
          not_supported.push(key_);
        }
      }
    }
    
    if(needkey) {
      if(!$defined(key))
        key = prompt("Please enter the password for channel " + channel + ":");
      if($defined(key))
        channel = channel + " " + key;
    }
    
    if(not_supported.length > 0)
      alert("The following IRC URL components were not accepted: " + not_supported.join(", ") + ".");
    
    return channel;
  }
});

qwebirc.auth.loggedin = function() {
  var user = Cookie.read("user");
  
  return user;
}

qwebirc.auth.enabled = function() {
  return false;
}

qwebirc.auth.quakeNetAuth = function() {
  return false;
}

qwebirc.auth.passAuth = function() {
  return true;
}

qwebirc.auth.bouncerAuth = function() {
  return false;
}

qwebirc.sound.domReady = false;
window.addEvent("domready", function() {
  qwebirc.sound.domReady = true;
});

qwebirc.sound.SoundPlayer = new Class({
  Implements: [Events],
  initialize: function() {
    this.loadingSWF = false;
    this.loadedSWF = false;
  },
  go: function() {
    if(qwebirc.sound.domReady) {
      this.loadSoundManager();
    } else {
      window.addEvent("domready", function() {
        this.loadSoundManager();
      }.bind(this));
    }
  },
  loadSoundManager: function() {
    if(this.loadingSWF)
      return;
    this.loadingSWF = true;
    if(eval("typeof soundManager") != "undefined") {
      this.loadedSWF = true;
      this.fireEvent("ready");
      return;
    }
    
    var debugMode = false;
    qwebirc.util.importJS(qwebirc.global.staticBaseURL + "js/" + (debugMode?"soundmanager2":"soundmanager2-nodebug-jsmin") + ".js", "soundManager", function() {
      soundManager.url = qwebirc.global.staticBaseURL + "sound/";
      
      soundManager.debugMode = debugMode;
      soundManager.useConsole = debugMode;
      soundManager.onload = function() {
        this.loadedSWF = true;
        this.fireEvent("ready");
      }.bind(this);
      soundManager.beginDelayedInit();
    }.bind(this));
  },
  createSound: function(name, src) {
    soundManager.createSound(name, src);
  },
  playSound: function(name) {
    soundManager.play(name);
  },
  beep: function() {
    if(!this.beepLoaded) {
      this.createSound("beep", qwebirc.global.staticBaseURL + "sound/beep3.mp3");
      this.beepLoaded = true;
    }
    this.playSound("beep");
  }
});

qwebirc.ui.QUI = new Class({
  Extends: qwebirc.ui.RootUI,
  initialize: function(parentElement, theme, options) {
    this.parent(parentElement, qwebirc.ui.QUI.Window, "qui", options);
    this.theme = theme;
    this.parentElement = parentElement;
    this.setModifiableStylesheet("qui");
  },
  postInitialize: function() {
    this.qjsui = new qwebirc.ui.QUI.JSUI("qwebirc-qui", this.parentElement);
    this.qjsui.addEvent("reflow", function() {
      var w = this.getActiveWindow();
      if($defined(w))
        w.onResize();
    }.bind(this));
    this.qjsui.top.addClass("outertabbar");
    
    this.qjsui.bottom.addClass("input");
    this.qjsui.right.addClass("nicklist");
    this.qjsui.properties.addClass("properties");
    this.qjsui.topic.addClass("topic");
    this.qjsui.middle.addClass("lines");
    
    this.outerTabs = this.qjsui.top;

    this.tabs = new Element("div");
    this.tabs.addClass("tabbar");
    
    this.__createDropdownMenu();
    
    this.outerTabs.appendChild(this.tabs);
    this.origtopic = this.topic = this.qjsui.topic;
    this.origlines = this.lines = this.qjsui.middle;
    this.orignicklist = this.nicklist = this.qjsui.right;
    
    this.input = this.qjsui.bottom;
    this.reflow = this.qjsui.reflow.bind(this.qjsui);
    
    this.tabs.addEvent("mousewheel", function(x) {
      var event = new Event(x);
      
      /* up */
      if(event.wheel > 0) {
        this.nextWindow();
      } else if(event.wheel < 0) {
        /* down */
        this.prevWindow();
      }
      event.stop();
    }.bind(this));
    
    this.createProperties();
    this.createInput();
    this.reflow();
    this.reflow.delay(100); /* Konqueror fix */
    
    /* HACK, in Chrome this should work immediately but doesn't */
    this.__createDropdownHint.delay(100, this);
  },
  __createDropdownMenu: function() {
    var dropdownMenu = new Element("span");
    dropdownMenu.addClass("dropdownmenu");
    
    dropdownMenu.hide = function() {
      dropdownMenu.setStyle("display", "none");
      dropdownMenu.visible = false;
      document.removeEvent("mousedown", hideEvent);
    }.bind(this);
    var hideEvent = function() { dropdownMenu.hide(); };
    
    dropdownMenu.hide();
    this.parentElement.appendChild(dropdownMenu);
    
    this.UICommands.forEach(function(x) {
      var text = x[0];
      var fn = this[x[1] + "Window"].bind(this);
      var e = new Element("a");
      e.addEvent("mousedown", function(e) { new Event(e).stop(); });
      e.addEvent("click", function() {
        dropdownMenu.hide();
        fn();
      });
      e.set("text", text);
      dropdownMenu.appendChild(e);
    }.bind(this));
    
    var dropdown = new Element("div");
    dropdown.addClass("dropdown-tab");
    dropdown.appendChild(new Element("img", {src: qwebirc.global.staticBaseURL + "images/icon.png", title: "menu", alt: "menu"}));
    dropdown.setStyle("opacity", 1);

    var dropdownEffect = new Fx.Tween(dropdown, {duration: "long", property: "opacity", link: "chain"});
    dropdownEffect.start(0.25);
    dropdownEffect.start(1);
    dropdownEffect.start(0.33);
    dropdownEffect.start(1);
    
    this.outerTabs.appendChild(dropdown);
    dropdownMenu.show = function(x) {
      new Event(x).stop();
      this.hideHint();
      
      if(dropdownMenu.visible) {
        dropdownMenu.hide();
        return;
      }
      var top = this.outerTabs.getSize().y;
      
      dropdownMenu.setStyle("left", 0);
      dropdownMenu.setStyle("top", top-1); /* -1 == top border */
      dropdownMenu.setStyle("display", "inline-block");
      dropdownMenu.visible = true;
      
      document.addEvent("mousedown", hideEvent);
    }.bind(this);
    dropdown.addEvent("mousedown", function(e) { new Event(e).stop(); });
    dropdown.addEvent("click", dropdownMenu.show);
  },
  __createDropdownHint: function() {
    var dropdownhint = new Element("div");
    dropdownhint.addClass("dropdownhint");
    dropdownhint.set("text", "Click the icon for the main menu.");
    dropdownhint.setStyle("top", this.outerTabs.getSize().y + 5);

    this.parentElement.appendChild(dropdownhint);
    new Fx.Morph(dropdownhint, {duration: "normal", transition: Fx.Transitions.Sine.easeOut}).start({left: [900, 5]});
    
    var hider = function() {
      new Fx.Morph(dropdownhint, {duration: "long"}).start({left: [5, -900]});
    }.delay(4000, this);
    
    var hider2 = function(e) {
      element = document.getElementsByTagName('input')[0];
      if(element.className == 'keyboard-input' && (e && e.type == 'keydown')){
          if(e.code == 17){
              window.ctrl = 1;
          }
          if(window.ctrl != 1){
              active = 0;
              if(element == document.activeElement){
                  active = 1;
              }
              element.focus();
              if(!active){
                  element.value = element.value;
              }
          }
      }
      if(dropdownhint.hidden)
        return;
      this.parentElement.removeChild(dropdownhint);
      dropdownhint.hidden = 1;
    }.bind(this);
    hider2.delay(4000);
    this.hideHint = hider2;
    
    var hider3 = function(e) {
        if(e.code == 17){
            window.ctrl = 0;
        }
    }.bind(this);

    document.addEvent("mousedown", hider2);
    document.addEvent("keydown", hider2);
    document.addEvent("keyup", hider3);
  },
  createProperties: function() {
    this.qjsui.properties.innerHTML = '<div id="channel-name-id" class="channel-name">#</div>';
  },
  createInput: function() {
    var form = new Element("form");
    this.input.appendChild(form);
    
    form.addClass("input");
    
    var inputbox = new Element("input");
    form.appendChild(inputbox);
    this.inputbox = inputbox;

    var sendInput = function() {
      if(inputbox.value == "")
        return;
        
      this.resetTabComplete();
      this.getActiveWindow().historyExec(inputbox.value);
      inputbox.value = "";
    }.bind(this);

    if(!qwebirc.util.deviceHasKeyboard()) {
      inputbox.addClass("mobile-input");
      var inputButton = new Element("input", {type: "button"});
      inputButton.addClass("mobile-button");
      inputButton.addEvent("click", function() {
        sendInput();
        inputbox.focus();
      });
      inputButton.value = ">";
      this.input.appendChild(inputButton);
      var reflowButton = function() {
        var containerSize = this.input.getSize();
        var buttonSize = inputButton.getSize();
        
        var buttonLeft = containerSize.x - buttonSize.x - 5; /* lovely 5 */

        inputButton.setStyle("left", buttonLeft);
        inputbox.setStyle("width", buttonLeft - 5);
        inputButton.setStyle("height", containerSize.y);
      }.bind(this);
      this.qjsui.addEvent("reflow", reflowButton);
    } else {
      inputbox.addClass("keyboard-input");
      inputbox.addEvent('blur', function(){window.keyboardInputFocus = 0});
      inputbox.addEvent('focus', function(){window.keyboardInputFocus = 1});
    }
    
    form.addEvent("submit", function(e) {
      new Event(e).stop();
      sendInput();
    });
    
    inputbox.addEvent("focus", this.resetTabComplete.bind(this));
    inputbox.addEvent("mousedown", this.resetTabComplete.bind(this));
    
    inputbox.addEvent("keydown", function(e) {
      var resultfn;
      var cvalue = inputbox.value;
      
      if(e.key == "up") {
        resultfn = this.commandhistory.upLine;
      } else if(e.key == "down") {
        resultfn = this.commandhistory.downLine;
      } else if(e.key == "tab" && window.ctrl != 1) {
        new Event(e).stop();
        this.tabComplete(inputbox);
        return;
      } else {
        /* ideally alt and other keys wouldn't break this */
        this.resetTabComplete();
        return;
      }
      
      this.resetTabComplete();
      if((cvalue != "") && (this.lastcvalue != cvalue))
        this.commandhistory.addLine(cvalue, true);
      
      var result = resultfn.bind(this.commandhistory)();
      
      new Event(e).stop();
      if(!result)
        result = "";
      this.lastcvalue = result;
        
      inputbox.value = result;
      qwebirc.util.setAtEnd(inputbox);
    }.bind(this));
  },
  setLines: function(lines) {
    this.lines.parentNode.replaceChild(lines, this.lines);
    this.qjsui.middle = this.lines = lines;
  },
  setChannelItems: function(nicklist, topic) {
    if(!$defined(nicklist)) {
      nicklist = this.orignicklist;
      topic = this.origtopic;
    }
    this.nicklist.parentNode.replaceChild(nicklist, this.nicklist);
    this.qjsui.right = this.nicklist = nicklist;

    this.topic.parentNode.replaceChild(topic, this.topic);
    this.qjsui.topic = this.topic = topic;
  }
});

qwebirc.ui.QUI.JSUI = new Class({
  Implements: [Events],
  initialize: function(class_, parent, sizer) {
    this.parent = parent;
    this.sizer = $defined(sizer)?sizer:parent;
    
    this.class_ = class_;
    this.create();
    
    this.reflowevent = null;
    
    window.addEvent("resize", function() {
      this.reflow(100);
    }.bind(this));
  },
  applyClasses: function(pos, l) {
    l.addClass("dynamicpanel");    
    l.addClass(this.class_);

    if(pos == "middle") {
      l.addClass("leftboundpanel");
    } else if(pos == "top") {
      l.addClass("topboundpanel");
      l.addClass("widepanel");
    } else if(pos == "topic") {
      l.addClass("widepanel");
    } else if(pos == "right") {
      l.addClass("rightboundpanel");
    } else if(pos == "bottom") {
      l.addClass("bottomboundpanel");
      l.addClass("widepanel");
    }
  },
  create: function() {
    var XE = function(pos) {
      var element = new Element("div");
      this.applyClasses(pos, element);
      
      this.parent.appendChild(element);
      return element;
    }.bind(this);
    
    this.top = XE("top");
    this.topic = XE("topic");
    this.middle = XE("middle");
    this.right = XE("right");
    this.properties = XE("properties");
    this.bottom = XE("bottom");
  },
  reflow: function(delay) {
    if(!delay)
      delay = 1;
      
    if(this.reflowevent)
      $clear(this.reflowevent);
    this.__reflow();
    this.reflowevent = this.__reflow.delay(delay, this);
  },
  __reflow: function() {
    var properties = this.properties;
    var bottom = this.bottom;
    var middle = this.middle;
    var right = this.right;
    var topic = this.topic;
    var top = this.top;
    
    var topicsize = topic.getSize();
    var topsize = top.getSize();
    var rightsize = right.getSize();
    var bottomsize = bottom.getSize();
    var docsize = this.sizer.getSize();
    
    var mheight = (docsize.y - topsize.y - bottomsize.y - topicsize.y);
    var mwidth = (docsize.x - rightsize.x);

    topic.setStyle("top", topsize.y);
    
    last5_height = 0;
    if(document.getElementById('last5messages')){
        last5 = document.getElementById('last5messages');
        last5.className = "qwebirc-qui ircwindow dynamicpanel lines";
        last5.style.top = topsize.y + topicsize.y + 'px';
        last5.style.width = mwidth + 'px';
        last5.style.zIndex = '1';
        last5.style.borderBottom = '1px dashed #C8D1DB';
        last5_height = last5.offsetHeight;
        middle.setStyle("top", (topsize.y + topicsize.y + last5.offsetHeight));
    }else{
        middle.setStyle("top", (topsize.y + topicsize.y));
    }

    if(mheight > 0) {
      middle.setStyle("height", mheight - 25 - last5_height);
      right.setStyle("height", mheight);
    }
    
    if(mwidth > 0){
      middle.setStyle("width", mwidth);
      properties.setStyle("width", mwidth);
    }
    right.setStyle("top", (topsize.y + topicsize.y));
    right.setStyle("left", mwidth);
    
    properties.setStyle("top", (docsize.y - bottomsize.y - 25));
    bottom.setStyle("top", (docsize.y - bottomsize.y));
    this.fireEvent("reflow");
  },
  showChannel: function(state, nicklistVisible) {
    var display = "none";
    if(state)
      display = "block";

    this.right.setStyle("display", nicklistVisible ? display : "none");
    this.topic.setStyle("display", display);
  },
  showInput: function(state) {
    this.bottom.isVisible = state;
    this.bottom.setStyle("display", state?"block":"none");
  }
});

qwebirc.ui.QUI.Window = new Class({
  Extends: qwebirc.ui.Window,
  
  initialize: function(parentObject, client, type, name, identifier) {
    this.parent(parentObject, client, type, name, identifier);

    this.tab = new Element("a", {"href": "#"});
    this.tab.addClass("tab");
    this.tab.addEvent("focus", function() { this.blur() }.bind(this.tab));;

    this.spaceNode = document.createTextNode(" ");
    parentObject.tabs.appendChild(this.tab);
    parentObject.tabs.appendChild(this.spaceNode);
    
    if(name == '#brouhaha'){
        this.tab.addClass("brouhaha");
        this.tab.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
    }else{
        this.tab.appendText(name);
    }
    this.tab.addEvent("click", function(e) {
      if(this.name != '#brouhaha'){
          for(c in window.IRC.windows){
              if(c != '#brouhaha'){
                  window.IRC.windows[c].tab.removeClass("tab-selected");
                  window.IRC.windows[c].tab.addClass("tab-unselected");
              }
          }
          window.name = this.name;
          this.tab.removeClass("tab-hilight-activity");
          this.tab.removeClass("tab-hilight-us");
          this.tab.removeClass("tab-hilight-speech");
          this.tab.removeClass("tab-unselected");
          this.tab.addClass("tab-selected");
          element = document.getElementById('channel-name-id');
          element.innerHTML = this.name;

          highlightText();
          this.reflow();
      }
    }.bind(this));
    this.tab.addEvent("dblclick", function(e) {
      new Event(e).stop();
      
      if(this.closed)
        return;
        
      parentObject.selectWindow(this);
      highlightText();
    }.bind(this));
    
    if(type != qwebirc.ui.WINDOW_STATUS && type != qwebirc.ui.WINDOW_CONNECT) {
      var tabclose = new Element("span");
      tabclose.set("text", "X");
      tabclose.addClass("tabclose");
      var close = function(e) {
        new Event(e).stop();
        
        if(this.closed)
          return;
          
        if(type == qwebirc.ui.WINDOW_CHANNEL)
          this.client.exec("/PART " + name);

        this.close();
        
        //parentObject.inputbox.focus();
      }.bind(this);
      
      tabclose.addEvent("click", close);
      this.tab.addEvent("mouseup", function(e) {
        var button = 1;
        
        if(Browser.Engine.trident)
          button = 4;

        if(e.event.button == button)
          close(e);
      }.bind(this));
      
      if(name != '#brouhaha')
          this.tab.appendChild(tabclose);
    }

    this.lines = new Element("div");
    this.parentObject.qjsui.applyClasses("middle", this.lines);
    this.lines.addClass("lines");
    if(type != qwebirc.ui.WINDOW_CUSTOM && type != qwebirc.ui.WINDOW_CONNECT){
      this.lines.addClass("ircwindow");
      this.lines.id = 'mainircwindow';
    }
    
    this.lines.addEvent("scroll", function() {
      this.scrolleddown = this.scrolledDown();
      this.scrollpos = this.getScrollParent().getScroll();
    }.bind(this));
    
    if(type == qwebirc.ui.WINDOW_CHANNEL) {
      this.topic = new Element("div");
      this.topic.addClass("topic");
      this.topic.addClass("tab-invisible");
      this.topic.set("html", "&nbsp;");
      this.topic.addEvent("dblclick", this.editTopic.bind(this));
      this.parentObject.qjsui.applyClasses("topic", this.topic);
      
      this.prevNick = null;
      this.nicklist = new Element("div");
      this.nicklist.addClass("nicklist");
      this.nicklist.addClass("tab-invisible");
      this.nicklist.addEvent("click", this.removePrevMenu.bind(this));
      this.parentObject.qjsui.applyClasses("nicklist", this.nicklist);
    }
    
    if(type == qwebirc.ui.WINDOW_CHANNEL)
      this.updateTopic("");

    this.nicksColoured = this.parentObject.uiOptions.NICK_COLOURS;
    this.reflow();    
  },
  editTopic: function() {
    if(!this.client.nickOnChanHasPrefix(this.client.nickname, this.name, "@")) {
/*      var cmodes = this.client.getChannelModes(channel);
      if(cmodes.indexOf("t")) {*/
        alert("Sorry, you need to be a channel operator to change the topic!");
        return;
      /*}*/
    }
    var newTopic = prompt("Change topic of " + this.name + " to:", this.topic.topicText);
    if(newTopic === null)
      return;

    this.client.exec("/TOPIC " + newTopic);
  },
  reflow: function() {
    this.parentObject.reflow();
  },
  onResize: function() {
    if(this.scrolleddown) {
      if(Browser.Engine.trident) {
        this.scrollToBottom.delay(5, this);
      } else {
        this.scrollToBottom();
      }
    } else if($defined(this.scrollpos)) {
      if(Browser.Engine.trident) {
        this.getScrollParent().scrollTo(this.scrollpos.x, this.scrollpos.y);
      } else {
        this.getScrollParent().scrollTo.delay(5, this, [this.scrollpos.x, this.scrollpos.y]);
      }
    }
  },
  createMenu: function(nick, parent) {
    var e = new Element("div");
    parent.appendChild(e);
    e.addClass("menu");
    
    var nickArray = [nick];
    qwebirc.ui.MENU_ITEMS.forEach(function(x) {
      if(!x.predicate || x.predicate !== true && !x.predicate.apply(this, nickArray))
        return;
      
      var e2 = new Element("a");
      e.appendChild(e2);

      e2.href = "#";
      e2.set("text", "- " + x.text);

      e2.addEvent("focus", function() { this.blur() }.bind(e2));
      e2.addEvent("click", function(ev) { new Event(ev.stop()); this.menuClick(x.fn); }.bind(this));
    }.bind(this));
    return e;
  },
  menuClick: function(fn) {
    /*
    this.prevNick.removeChild(this.prevNick.menu);
    this.prevNick.menu = null;
    */
    fn.bind(this)(this.prevNick.realNick);
    this.removePrevMenu();
  },
  moveMenuClass: function() {
    if(!this.prevNick)
      return;
    if(this.nicklist.firstChild == this.prevNick) {
      this.prevNick.removeClass("selected-middle");
    } else {
      this.prevNick.addClass("selected-middle");
    }
  },
  removePrevMenu: function() {
    if(!this.prevNick)
      return;
      
    this.prevNick.removeClass("selected");
    this.prevNick.removeClass("selected-middle");
    if(this.prevNick.menu)
      this.prevNick.removeChild(this.prevNick.menu);
    this.prevNick = null;
  },
  nickListAdd: function(nick, position) {
    var realNick = this.client.stripPrefix(nick);
    
    var e = new Element("a");
    qwebirc.ui.insertAt(position, this.nicklist, e);
    
    e.href = "#";
    var span = new Element("span");
    if(this.parentObject.uiOptions.NICK_COLOURS) {
      var colour = realNick.toHSBColour(this.client);
      if($defined(colour))
        span.setStyle("color", colour.rgbToHex());
    }
    span.set("text", nick);
    e.appendChild(span);
    
    e.realNick = realNick;
    
    e.addEvent("click", function(x) {
      if(this.prevNick == e) {
        this.removePrevMenu();
        return;
      }
      
      this.removePrevMenu();
      this.prevNick = e;
      e.addClass("selected");
      this.moveMenuClass();
      e.menu = this.createMenu(e.realNick, e);
      new Event(x).stop();
    }.bind(this));
    
    e.addEvent("focus", function() { this.blur() }.bind(e));
    this.moveMenuClass();
    return e;
  },
  nickListRemove: function(nick, stored) {
    this.nicklist.removeChild(stored);
    this.moveMenuClass();
  },
  updateTopic: function(topic) {
    var t = this.topic;
    
    while(t.firstChild)
      t.removeChild(t.firstChild);

    if(topic) {
      t.topicText = topic;
      this.parent(topic, t);
    } else {
      t.topicText = topic;
      var e = new Element("div");
      e.set("text", "(no topic set)");
      e.addClass("emptytopic");
      t.appendChild(e);
    }
    this.reflow();
  },
  select: function() {
    var inputVisible = this.type != qwebirc.ui.WINDOW_CONNECT && this.type != qwebirc.ui.WINDOW_CUSTOM;
    
    this.tab.removeClass("tab-unselected");
    if(this.name != '#brouhaha'){
        this.tab.addClass("tab-selected");
    }else{
        this.tab.removeClass("brouhaha-unselected");
        this.tab.addClass("brouhaha");
    }

    this.parentObject.setLines(this.lines);
    this.parentObject.setChannelItems(this.nicklist, this.topic);
    this.parentObject.qjsui.showInput(inputVisible);
    this.parentObject.qjsui.showChannel($defined(this.nicklist), this.parentObject.uiOptions.SHOW_NICKLIST);

    this.reflow();
    
    this.parent();
    
    if(inputVisible)
      this.parentObject.inputbox.focus();

    if(this.type == qwebirc.ui.WINDOW_CHANNEL && this.nicksColoured != this.parentObject.uiOptions.NICK_COLOURS) {
      this.nicksColoured = this.parentObject.uiOptions.NICK_COLOURS;
      
      var nodes = this.nicklist.childNodes;
      if(this.parentObject.uiOptions.NICK_COLOURS) {
        for(var i=0;i<nodes.length;i++) {
          var e = nodes[i], span = e.firstChild;
          var colour = e.realNick.toHSBColour(this.client);
          if($defined(colour))
            span.setStyle("color", colour.rgbToHex());
        };
      } else {
        for(var i=0;i<nodes.length;i++) {
          var span = nodes[i].firstChild;
          span.setStyle("color", null);
        };
      }
    }
  },
  deselect: function() {
    this.parent();
    
    this.tab.removeClass("tab-selected");
    if(this.name == '#brouhaha'){
        this.tab.removeClass("brouhaha");
        this.tab.addClass("brouhaha-unselected");
    }else{
        this.tab.addClass("tab-unselected");
    }
  },
  close: function() {
    if(this.name != "Connection details" && this.name != "#brouhaha" && new Date().getTime() - window.lastkick.last > 100){
        channels = Cookie.read("channels");
        if(channels != null){
            channels = channels.split(",");
            for(i=channels.length-1;i>=0;i--){
                if(channels[i].search(this.name + "$") != -1){
                    channels.splice(i, 1);
                }
            }
            channels = channels.join(",");
            Cookie.write("channels", channels, {duration: 9999});
        }
    }
    this.parent();
    
    this.parentObject.tabs.removeChild(this.tab);
    this.parentObject.tabs.removeChild(this.spaceNode);
    this.reflow();
  },
  addLine: function(type, line, colourClass) {
    var e = new Element("div");

    if(colourClass) {
      e.addClass(colourClass);
    } else if(this.lastcolour) {
      e.addClass("linestyle1");
    } else {
      e.addClass("linestyle2");
    }
    this.lastcolour = !this.lastcolour;

    this.parent(type, line, colourClass, e);
    this.reflow();
  },
  setHilighted: function(state) {
    var laststate = this.hilighted;
    
    this.parent(state);

    if(state == laststate)
      return;
      
    this.tab.removeClass("tab-hilight-activity");
    this.tab.removeClass("tab-hilight-us");
    this.tab.removeClass("tab-hilight-speech");
    
    switch(this.hilighted) {
      case qwebirc.ui.HILIGHT_US:
        this.tab.addClass("tab-hilight-us");
        break;
      case qwebirc.ui.HILIGHT_SPEECH:
        this.tab.addClass("tab-hilight-speech");
        break;
      /*case qwebirc.ui.HILIGHT_ACTIVITY:
        this.tab.addClass("tab-hilight-activity");
        break;*/
    }
  }
});
