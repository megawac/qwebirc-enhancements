
var storage = util.storage = new Storage({
    duration: 365,
    domain: '/',
    debug: DEBUG
}),

session = util.sessionStorage = new Storage({
    storageType: 'sessionStorage',
    duration: 1,
    debug: DEBUG,
    fallback: false
});

//simple wrapper class
//object.append breaks prototypes :/
var Storer = util.Storer = new Class({
    initialize: function(name, storer) {
        this.name = name;
        this.storage = storer || storage;
    },
    get: function() {
        return this.storage.get(this.name);
    },
    set: function(val) {
        return this.storage.set(this.name, val);
    },
    dispose: function() {
        return this.storage.remove(this.name);
    }
});