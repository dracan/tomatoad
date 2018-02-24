const fetch = require('node-fetch')
const keytar = require('keytar')

let _authTokens = {}

module.exports = {
    loadAuthTokens: function(successCallback) {
        keytar.findCredentials("Tomatoad_Slack").then(creds => {
            _authTokens = {}

            let remaining = creds.length

            if(creds.length === 0) {
                successCallback()
            }

            creds.forEach(cred => {
                // Note that I'm re-looking up the password using getPassword rather than just
                // using the cred.password field because of this bug ...
                // https://github.com/atom/node-keytar/issues/96
                // Once released, I can remove the getPassword call and just use cred.password.

                keytar.getPassword("Tomatoad_Slack", cred.account).then(pw => {
                    _authTokens[cred.account] = pw;
                    if(--remaining === 0) {
                        successCallback()
                    }
                })
            })
        })
    },

    setAuthCode: function (teamName, authToken) {
        _authTokens[teamName] = authToken;

        keytar.setPassword("Tomatoad_Slack", teamName, authToken)
    },

    getTeams: function() {
        return Object.getOwnPropertyNames(_authTokens)
    },

    revokeTeam: function(teamName) {
        delete _authTokens[teamName]
        keytar.deletePassword("Tomatoad_Slack", teamName)
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
