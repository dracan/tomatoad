const electron = require('electron')
const moment = require('moment')

const ipc = electron.ipcRenderer

const getTimeString = (seconds) => {
    let momentTime = moment.duration(seconds, 'seconds')
    let sec = momentTime.seconds().toString().padStart(2, '0')
    let min = momentTime.minutes().toString().padStart(2, '0')

    return `${min}:${sec}`
}

ipc.on('countdown', (evt, count) => {
    document.getElementById('countdown').innerHTML = getTimeString(count);
})
