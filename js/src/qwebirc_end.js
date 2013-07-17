//close the iife and call with this
})(this);

function qwebirc_ui_onbeforeunload(e) { /* IE sucks */
    if (Date.now() - document.window.steamlink > 100) {
        var message = "This action will close all active IRC connections.";
        if ((e = e || window.event)) {
            e.returnValue = message;
        }
        return message;
    }
}
