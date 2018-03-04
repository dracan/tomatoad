const Datastore = require('nedb')
const path = require('path')

const dbPath = path.dirname(process.execPath)
const dbSettings = new Datastore({ filename: dbPath + '/db/settings.json', autoload: true });
const dbPomodoros = new Datastore({ filename: dbPath + '/db/pomodoros.json', autoload: true });

dbSettings.persistence.compactDatafile()
dbPomodoros.persistence.compactDatafile()

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

    savePomodoro: function (pomodoro) {
        if(!pomodoro._id) {
            pomodoro._id = new Date().toISOString()
        }

        dbPomodoros.update({ _id: pomodoro._id }, pomodoro, { upsert: true })

        return pomodoro
    }
}
