/**
 *  wizard view
 *
 *  @depends [panes/PanelView]
 *  @provides [panes/Wizard]
 */
ui.EmbedWizard = new Class({
    Extends: PanelView,
    options: {
        pane: "wizard"
    }
});