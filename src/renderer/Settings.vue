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
                        <div>
                            <h3>Existing Slack Teams</h3>

                            <ul>
                                <li v-for="x in settings.slackTeams" :key="x">
                                    {{x}} (<a href="#" @click="revokeSlackTeam(x)">revoke</a>)
                                </li>
                            </ul>
                        </div>

                        <a href="https://slack.com/oauth/authorize?client_id=2917912883.305906288866&scope=users.profile:write,dnd:write">
                            <img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" />
                        </a>
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
            slackTeams: [],
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
        methods: {
            revokeSlackTeam: function(teamName) {
                let index = data.settings.slackTeams.indexOf(teamName)
                if(index > -1) {
                    data.settings.slackTeams.splice(index, 1)
                }

                ipcRenderer.send("revoke-slack-team", teamName)
            }
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
