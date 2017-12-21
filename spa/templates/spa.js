/* eslint-disable */
import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import VueI18n from 'vue-i18n'
import App from './App.vue'
import routes from './_routes.js'
import modules from './store'
import 'utils/_interceptors.js'

// uncomment following line if you need it
// require('promise.prototype.finally').shim()

window.$LB = window.$LB || {}

// sensorsdata
// import SA from 'utils/_sa-helper.js'
// import { PROJECT } from '../../common/token.js'
// Vue.use(SA, PROJECT)

// Vuex is already installed when import with script tag
// Vue.use(Vuex)

/* eslint-disable no-new */
const router = new VueRouter({
  routes,
  mode: 'history',
  scrollBehavior: function(to, from, savedPosition) {
      if (to.hash) {
          return {selector: to.hash}
      } else {
          return { x: 0, y: 0 }
      }
  },
  saveScrollPosition: true
})

<% if (useStore) { %>
// vuex
const store = new Vuex.Store({
  modules
})
<% } %>


const app = new Vue({
  <% if (useStore) { %>store,<% } %>
  router,
  el: '#root',
  render: h => h(App)
})
