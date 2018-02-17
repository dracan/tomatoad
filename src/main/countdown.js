let timer

module.exports = {
    init: function (initialNumSeconds, intervalCallback, completionCallback) {
        let seconds = initialNumSeconds

        if(timer) {
            clearInterval(timer)
            timer = null
        }

        intervalCallback(seconds--)

        timer = setInterval(_ => {
            intervalCallback(seconds--)

            if (seconds === -1) {
                clearInterval(timer)
                completionCallback()
            }
        }, 1000)
    },

    stop: function() {
        clearInterval(timer)
        timer = null
    }
}
