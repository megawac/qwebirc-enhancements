/**
 *  About view
 *
 *  @depends [panes/PanelView]
 *  @provides [panes/About]
 */
ui.AboutPane = new Class({
    Extends: PanelView,
    options: {
        pane: "about",
        data: {
            version: qwebirc.VERSION
        }
    }
});