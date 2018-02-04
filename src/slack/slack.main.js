const fetch = require('node-fetch')
const database = require('../database/database')

let _authTokens = {}

module.exports = {
    loadAuthTokens: function() {
        database.loadSlackAuthTokens(function(authTokens) {
            _authTokens = authTokens
        })
    },

    setAuthCode: function (teamName, authToken) {
        _authTokens[teamName] = authToken;

        database.saveSlackAuthTokens(_authTokens)
    },

    setStatus: function (text, emoji) {
        for(var key in _authTokens) {
            console.log(`Setting status for team ${key}`)

            post("https://slack.com/api/users.profile.set", JSON.stringify({
                "profile": {
                    "status_text": text,
                    "status_emoji": emoji,
                }
            }), 'application/json; charset=utf-8', _authTokens[key])
        }
    },

    setDoNotDisturb: function(minutes) {
        for(var key in _authTokens) {
            console.log(`Setting DND for team ${key}`)
            post("https://slack.com/api/dnd.setSnooze", "num_minutes=" + minutes, "application/x-www-form-urlencoded", _authTokens[key]);
        }
    }
}

function post(url, data, contentType, authToken) {
    fetch(url, {
        method: 'POST',
        body: data,
        headers: {
            'Accept': 'application/json',
            'Content-Type': contentType,
            'Authorization': 'Bearer ' + authToken,
        },
    }).then(function (res) {
        return res.json();
    }).then(function (json) {
        //(todo) Need to do something on failure somehow
        // console.log(json);
    });
}
