<template>
    <div id="notes">
        <h3>Rate your Pomodoro!</h3>

        <div>
            <div class="horz-container">
                <div class="item1">
                    <h4>Goal Completion</h4>
                    <star-rating
                        v-model="goalRating"
                        show-rating="false"
                        active-color="#cc3300"
                        item-size=30></star-rating>

                    <h4>Focus</h4>
                    <star-rating
                        v-model="focusRating"
                        show-rating="false"
                        active-color="#cc3300"
                        item-size=30></star-rating>
                </div>
                <div class="item1">
                    <b-form-group label="Your Goal Notes..." v-if="textBefore">
                        <b-form-textarea
                            plaintext
                            v-model="textBefore"
                            placeholder="Enter goal(s) for this Pomodoro"
                            :rows="3"
                            :max-rows="6">
                        </b-form-textarea>
                        <b-form-textarea
                            v-model="textAfter"
                            placeholder="Enter notes about this Pomodoro"
                            :rows="3"
                            :max-rows="6">
                        </b-form-textarea>
                    </b-form-group>
                </div>
            </div>
        </div>

        <b-button type="submit" variant="primary" @click="onClick()">Save Pomodora and Start Break</b-button>
    </div>
</template>

<style>
    html, body {
        overflow: hidden;
        height: 100%;
    }
</style>

<style scoped>
    #notes {
        background-color: white;
        color: black;
        margin: 10px;
        height: 95%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .horz-container {
        display: flex;
    }

    .item1 { flex: 1; }
</style>

<script>
    const electron = require('electron')
    const ipc = electron.ipcRenderer

    const data = {
        textBefore: "(none entered)",
        textAfter: "",
        goalRating: 0,
        focusRating: 0,
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
