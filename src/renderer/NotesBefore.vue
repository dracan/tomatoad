<template>
    <div id="notes">
        <b-form-textarea id="textarea1"
            v-model="textBefore"
            placeholder="Enter goals for this Pomodoro"
            :rows="3"
            :max-rows="6">
        </b-form-textarea>

        <b-button type="submit" variant="primary">Start</b-button>
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
    }
</script>
