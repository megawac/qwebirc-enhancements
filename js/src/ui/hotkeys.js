
var keys;
if(!util.isMobile) {
    keys = new Keyboard();
} else {
    delete window.Keyboard;
}
