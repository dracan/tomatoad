'use strict'

import Vue from 'vue'
import Overlay from './Overlay'
import About from './About'

require('../../node_modules/font-awesome/css/font-awesome.min.css')

// Vue.config.devtools = false
Vue.config.productionTip = false

const routes = {
    '#overlay': Overlay,
    '#about': About,
}

const settings = require('../main/settings.json')

const data = {
    version: settings.version
}

const app = new Vue({
    data: function() {
        return data2
    },
    computed: {
        ViewComponent() {
            const matchingView = routes[window.location.hash]

            if (!matchingView) {
                throw new `No matching view for ${this.currentRoute}`
            }

            matchingView.data = function() {
                return data
            }

            return matchingView
        }
    },
    render(h) {
        return h(this.ViewComponent)
    }
}).$mount('#app')
