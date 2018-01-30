var fetch = require('node-fetch')

let _authCode

module.exports = {
    setAuthCode: function (authCode) {
        _authCode = authCode;
    },

    setStatus: function (text, emoji) {
        if (_authCode) {
            post("https://slack.com/api/users.profile.set", JSON.stringify({
                "profile": {
                    "status_text": text,
                    "status_emoji": emoji,
                }
            }), 'application/json; charset=utf-8')
        }
    },

    setDoNotDisturb: function(minutes) {
        if (_authCode) {
            post("https://slack.com/api/dnd.setSnooze", "num_minutes=" + minutes, "application/x-www-form-urlencoded");
        }
    }
}

function post(url, data, contentType) {
    fetch(url, {
        method: 'POST',
        body: data,
        headers: {
            'Accept': 'application/json',
            'Content-Type': contentType,
            'Authorization': 'Bearer ' + _authCode,
        },
    }).then(function (res) {
        return res.json();
    }).then(function (json) {
        //(todo) Need to do something on failure somehow
        // console.log(json);
    });
}
