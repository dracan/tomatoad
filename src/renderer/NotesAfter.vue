<template>
    <div id="notes">
        <h3>Pomodoro Complete</h3>
        <hr>
        <b-form-group label="Rate your Pomodoro ...">
            <b-form-checkbox v-model="goalComplete">Did you complete your goal?</b-form-checkbox>
            <b-form-checkbox v-model="goodFocus">Did you feel focused throughout?</b-form-checkbox>
        </b-form-group>

        <hr>

        <b-form-group label="Your Goal Notes..." v-if="textBefore">
            <b-form-textarea
                plaintext
                v-model="textBefore"
                placeholder="Enter goal(s) for this Pomodoro"
                :rows="3"
                :max-rows="6">
            </b-form-textarea>
        </b-form-group>

        <b-button type="submit" variant="primary" @click="onClick()">Save Pomodora and Start Break</b-button>
    </div>
</template>

<style>
    html, body {
        overflow: hidden;
    }
</style>

<style scoped>
    #notes {
        background-color: white;
        color: black;
        margin: 10px;
    }
</style>

<script>
    const electron = require('electron')
    const ipc = electron.ipcRenderer

    const data = {
        textBefore: "(none entered)",
        goalComplete: false,
        goodFocus: false,
    }

    ipc.on('init-data', (evt, pomodoro) => {
        data.textBefore = pomodoro.textBefore
    })

    module.exports = {
        data: function() {
            return data
        },
        methods: {
            onClick() {
                ipc.send('save-completed-pomodoro', data)
                ipc.send('break-start')
                ipc.send('close-notes-after')
            },
        },
    }
</script>
