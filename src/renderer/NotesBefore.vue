<template>
    <div id="notes">
        <b-form-group>
            <b-form-textarea id="textarea1"
                v-model="textBefore"
                placeholder="Enter goal(s) for this Pomodoro"
                :rows="3"
                :max-rows="6">
            </b-form-textarea>
        </b-form-group>

        <b-button type="submit" variant="primary" @click="onClick()">Start</b-button>
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
        textBefore: "",
    }

    module.exports = {
        data: function() {
            return data
        },
        methods: {
            onClick() {
                ipc.send('pomodoro-start', true)
            },
        },
    }
</script>
