ui.WelcomePane = new Class({
    Extends: PanelView,
    options: {
        pane: 'welcome-pane',
        events: {
            'click:relay(.enable-notifications)': 'enableNotifications',
            'click:relay(.controls)': 'controlClick'
        },
        onEnableNotifications: function() {
            toggleNotifications(this.ui.uiOptions2, true, true);
        },
        onControlClick: function(e, controls) {
            controls.dispose();
            if(!this.element.getElement('.controls')) this._close();
        }
    },
    initialize: function(ui, options) {
        this.ui = ui;
        this.parent(options);
    },
    getData: function() {
        return _.extend({}, this.options, {
            Browser: window.Browser
        });
    }
})
.extend({
    show: function(_ui, options) {//determines if needs to be shown and shows
        if(options.firstvisit || notify.permissionLevel() !== notify.PERMISSION_GRANTED) {
            options.element = new Element("div.welcome").inject(options.element);
            return new ui.WelcomePane(_ui, options);
        }
        return false;
    }
});