<template>
    <div id="settings">
        <b-container class="bv-example-row" fluid>
            <b-row>
                <b-form-col>
                    <b-nav vertical pills>
                        <b-nav-item :active="selectedSection == 'General'" @click="selectedSection = 'General'">General</b-nav-item>
                        <b-nav-item :active="selectedSection == 'Slack'" @click="selectedSection = 'Slack'">Slack</b-nav-item>
                    </b-nav>
                </b-form-col>
                <b-col>
                    <template v-if="selectedSection == 'General'">
                        GENERAL
                    </template>
                    <template v-if="selectedSection == 'Slack'">
                        SLACK
                    </template>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script scoped>
</script>

<style scoped>
    #settings {
        padding: 8px;
    }
</style>
