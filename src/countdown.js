module.exports = {
    init: function (callback) {
        let seconds = 1500 // 25 minutes

        let timer = setInterval(_ => {
            callback(seconds--);

            if (seconds === -1) {
                clearInterval(timer)
            }
        }, 1000)
    }
}
