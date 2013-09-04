//this must refer to a model
function toggleNotifications(model, state) {
    if(notify.permissionLevel() !== notify.PERMISSION_GRANTED) {
        notify.requestPermission(function() {
            model.set('dn_state', notify.permissionLevel() === notify.PERMISSION_GRANTED);
        });
    }
    else {
        model.set('dn_state', state || !model.get('dn_state'));
    }
}