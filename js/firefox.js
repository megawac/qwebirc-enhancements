// Import the page-mod API
var pageMod = require("sdk/page-mod");
// Import the self API
var self = require("sdk/self");

pageMod.PageMod({
  include: "atf2.org/*",
  contentStyleFile: self.data.url("css/tfircgui.css")
});

// Create a page mod
// It will run a script whenever a ".org" URL is loaded
// The script replaces the page contents with a message
pageMod.PageMod({
  include: "atf2.org/*",
  contentScript: self.data.url("js/hacks.js")
});