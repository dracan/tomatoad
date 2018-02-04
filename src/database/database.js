var Datastore = require('nedb')

const dbSlack = new Datastore({ filename: __dirname + '/../db/slack.json', autoload: true });

dbSlack.persistence.compactDatafile()

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
    },

    saveSlackAuthTokens(authTokens) {
        dbSlack.update({
            _id: 'slackAuthTokens'
        }, { _id: 'slackAuthTokens', data: authTokens }, { upsert: true }, function (err, numReplaced, upsert) {
        });
    },

    loadSlackAuthTokens(callback) {
        dbSlack.find({ _id: 'slackAuthTokens' }, function (err, docs) {
            callback(docs.length == 0 ? {} : docs[0].data)
        });
    }
}
