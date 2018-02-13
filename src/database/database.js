const Datastore = require('nedb')
const path = require('path')

const dbPath = path.dirname(process.execPath) + '/db/db.json'
const db = new Datastore({ filename: dbPath, autoload: true });

db.persistence.compactDatafile()

module.exports = {
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
