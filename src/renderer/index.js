'use strict'

import Vue from 'vue'
import App from './App'

// Vue.config.devtools = false
Vue.config.productionTip = false

new Vue({
    components: { App },
    template: `<App/>`
}).$mount('#app')
