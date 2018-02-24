const Datastore = require('nedb')
const path = require('path')

const settingsDbPath = path.dirname(process.execPath) + '/db/settings.json'
const dbSettings = new Datastore({ filename: settingsDbPath, autoload: true });

dbSettings.persistence.compactDatafile()

module.exports = {
    saveSettings: function (settings) {
        let obj = Object.assign({ _id: 'settings' }, settings)

        dbSettings.update({ _id: 'settings' }, obj, { upsert: true }, function (err, numReplaced, upsert) {});
    },

    loadSettings: function (callback) {
        dbSettings.find({ _id: 'settings' }, function (err, docs) {
            callback(docs[0])
        });
    },

    saveNewPomodoro: function (callback) {
        /*
        var pomodoro = {
            _id: new Date().toISOString(),
            completed: false
        }

        db.insert(pomodoro, function (err, newDoc) {   // Callback is optional
            // newDoc is the newly inserted document, including its _id
            // newDoc has no key called notToBeSaved since its value was undefined
        });
        */
    }
}
