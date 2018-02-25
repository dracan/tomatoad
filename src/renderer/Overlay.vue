<template>
    <div id="overlay" v-bind:class="{ breakMode: isBreak }">
        <div id="countdown">25:00</div>
        <div id="buttons">
            <i id="overlay-button-start-stop" class="fa fa-play overlay-button" onclick="onClickStartStop()"></i>
        </div>
    </div>
</template>

<style>
    html, body {
        overflow: hidden;
        height: 100%;
    }
</style>

<style scoped>
    #countdown {
        font-size: 2em;
        font-family: Arial, Helvetica, sans-serif;
        display: inline;
    }

    #buttons {
    }

    #overlay {
        border: 3px solid #800000;
        background-color: black;
        height: 100%;
        color: white;
        cursor: default;
        display: flex;
        justify-content: space-around;
        align-items: center;
    }

    .breakMode {
        border: 3px solid green !important;
    }

    border: 3px solid green; */

    .overlay-button {
        color: grey;
    }
</style>

<script>
    const electron = require('electron')
    const moment = require('moment')
    const path = require('path')

    const ipc = electron.ipcRenderer

    var audio = new Audio(path.join(__static, 'timer.wav'))

    let pomodoroRunning = false

    const data = {
        isBreak: false,
    }

    module.exports = {
        data: function() {
            return data
        },
    }

    const getTimeString = (seconds) => {
        let momentTime = moment.duration(seconds, 'seconds')
        let sec = momentTime.seconds().toString().padStart(2, '0')
        let min = momentTime.minutes().toString().padStart(2, '0')

        return `${min}:${sec}`
    }

    // Respond to events from Main
    ipc.on('pomodoro-start', (evt) => { onStart() })
    ipc.on('pomodoro-stop', (evt) => { onStop() })
    ipc.on('pomodoro-complete', (evt) => { onComplete() })
    ipc.on('break-start', (evt) => { onStart() })
    ipc.on('break-stop', (evt) => { onStop() })
    ipc.on('break-complete', (evt) => { onComplete() })
    ipc.on('countdown', (evt, count) => { document.getElementById('countdown').innerHTML = getTimeString(count); })

    onClickStartStop = function () {
        if(pomodoroRunning) {
            onStop()
            ipc.send(data.isBreak ? "break-stop" : "pomodoro-stop")
            data.isBreak = false
        } else {
            onStart()
            ipc.send(data.isBreak ? "break-start" : "pomodoro-start")
        }
    }

    function onStart() {
        const el = document.getElementById('overlay-button-start-stop')
        el.classList.remove("fa-play")
        el.classList.add("fa-close")
        pomodoroRunning = true
    }

    function onStop() {
        const el = document.getElementById('overlay-button-start-stop')
        el.classList.remove("fa-close")
        el.classList.add("fa-play")
        pomodoroRunning = false
    }

    function onComplete() {
        audio.play();
        onStop()
        data.isBreak = !data.isBreak
    }
</script>
