ui.WelcomePane = new Class({
    Extends: PanelView,
    options: {
        pane: 'welcome-pane',
        events: {
            'click:relay(.enable-notifications)': 'enableNotifications',
            'click:relay(.options)': 'openOptions'
        },
        onOpenOptions: function() {
            this.ui.optionsWindow();
            if(this.clicked) this._close();
        },
        onEnableNotifications: function() {
            toggleNotifications(this.ui.uiOptions2, true);
            this.clicked = true;
            if(!this.options.firstvisit) this._close();
        }
    },
    initialize: function(ui, options) {
        this.ui = ui;
        this.parent(options);
    },
    getData: function() {
        return _.extend({
            options: this.ui.options,
            Browser: window.Browser
        }, this.options);
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