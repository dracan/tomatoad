'use strict'

import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import Overlay from './Overlay'
import About from './About'
import Settings from './Settings'
import NotesBefore from './NotesBefore'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

require('../../node_modules/font-awesome/css/font-awesome.min.css')

// Vue.config.devtools = false
Vue.config.productionTip = false

const routes = {
    '#overlay': Overlay,
    '#about': About,
    '#settings': Settings,
    '#notes-before': NotesBefore,
}

Vue.use(BootstrapVue);

const app = new Vue({
    computed: {
        ViewComponent() {
            const matchingView = routes[window.location.hash]

            if (!matchingView) {
                throw new `No matching view for ${this.currentRoute}`
            }

            return matchingView
        }
    },
    render(h) {
        return h(this.ViewComponent)
    }
}).$mount('#app')
