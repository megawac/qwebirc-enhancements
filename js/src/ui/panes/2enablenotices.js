function toggleNotifications(model, state, save) {
    if(notify.permissionLevel() !== notify.PERMISSION_GRANTED) {
        notify.requestPermission(function() {
            toggleNotifications(model, notify.permissionLevel() === notify.PERMISSION_GRANTED, save);
        });
    }
    else {
        model.set('dn_state', state != null ? !!state : !model.get('dn_state'));
    }
    if(save) model.save();
}