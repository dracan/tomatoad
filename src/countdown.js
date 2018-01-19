let timer

module.exports = {
    init: function (callback) {
        let seconds = 1500 // 25 minutes

        if(timer) {
            clearInterval(timer)
            timer = null
        }

        callback(seconds--)

        timer = setInterval(_ => {
            callback(seconds--)

            if (seconds === -1) {
                clearInterval(timer)
            }
        }, 1000)
    },

    stop: function() {
        clearInterval(timer)
        timer = null
    }
}
