<template>
    <div id="notes">
        <b-form-group>
            <b-form-textarea
                v-model="textBefore"
                placeholder="Enter goal(s) for this Pomodoro"
                :rows="3"
                :max-rows="6">
            </b-form-textarea>
        </b-form-group>

        <b-button type="submit" class="start-button" variant="primary" @click="onClick()">Start Pomodoro</b-button>
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

    .start-button {
        width: 100%;
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
                ipc.send('pomodoro-start', true, data.textBefore)
            },
        },
    }
</script>
