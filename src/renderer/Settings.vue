<template>
    <div id="settings">
        <b-container class="bv-example-row" fluid>
            <b-row>
                <b-col cols="3">
                    <b-nav vertical pills>
                        <b-nav-item :active="selectedSection == 'General'" @click="selectedSection = 'General'">General</b-nav-item>
                        <b-nav-item :active="selectedSection == 'Slack'" @click="selectedSection = 'Slack'">Slack</b-nav-item>
                    </b-nav>
                </b-col>
                <b-col>
                    <template v-if="selectedSection == 'General'">
                        <b-form>
                            <b-form-group id="exampleGroup4">
                                <b-form-checkbox v-model="settings.autoStartBreak">Automatically start the break</b-form-checkbox>
                                <b-form-checkbox v-model="settings.autoStartNextPomodoro">Automatically start next Pomodoro</b-form-checkbox>
                            </b-form-group>
                        </b-form>
                    </template>
                    <template v-if="selectedSection == 'Slack'">
                        SLACK
                    </template>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
    const { ipcRenderer } = require('electron')

    const data = {
        selectedSection: 'General',
        settings: {
            autoStartBreak: true,
            autoStartNextPomodoro: true,
        }
    }

    ipcRenderer.send("get-settings")

    ipcRenderer.on('got-settings', (evt, settings) => {
        Object.assign(data.settings, settings)
    })

    const saveSettings = function() {
        ipcRenderer.send("save-settings", data.settings)
    }

    module.exports = {
        data: function() {
            return data
        },
        watch: {
            'settings.autoStartBreak': function(val, oldVal) {
                saveSettings()
            },
            'settings.autoStartNextPomodoro': function(val, oldVal) {
                saveSettings()
            },
        }
    }
</script>

<style scoped>
    #settings {
        padding: 8px;
    }
</style>
