var PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-adapter-idb'))

var db = new PouchDB('tomatoad_test', { adapter: 'idb' })

module.exports = {
    saveNewPomodoro: function (callback) {
        var pomodoro = {
            _id: new Date().toISOString(),
            completed: false
        }

        db.put(pomodoro, function callback(err, result) {
            if (!err) {
                console.log('Successfully saved a pomodoro!');
            }
        })
    }
}
