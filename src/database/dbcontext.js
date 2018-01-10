const electron = require('electron')
const ipc = electron.ipcRenderer
const database = require('./database')

ipc.on('pomodoro-start', (evt, count) => {
    console.log("Saving new pomodoro")
    database.saveNewPomodoro()
})
