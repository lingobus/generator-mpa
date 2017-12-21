/* eslint-disable */
import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import VueI18n from 'vue-i18n'
import App from './App.vue'
import routes from './_routes.js'
import modules from './store'
import 'utils/_interceptors.js'
import { Notification } from 'element-ui'

window.$LB = window.$LB || {}

import Icon from 'vue-awesome'
Vue.component('fa-icon', Icon)
import ElLoading from 'element-ui/lib/loading'
ElLoading.install(Vue)

Vue.prototype.notify = Notification
// Vuex is already installed when import with script tag
// Vue.use(Vuex)

/* eslint-disable no-new */
const router = new VueRouter({
  routes,
  mode: 'history',
  saveScrollPosition: true
})

// vuex
const store = new Vuex.Store({
  state: {},
  modules,
})

// i18n
import en from 'element-ui/lib/locale/lang/en.js'
import elementLocale from 'element-ui/lib/locale'
Vue.use(VueI18n)
const locale = $LB.locale || 'en-US'
const messages = Object.assign($LB, { [locale]: en || {} })
const i18n = new VueI18n({
  locale,
  fallbackLocale: 'en-US',
  messages: messages,
  silentTranslationWarn: process.env.NODE_ENV === 'development'
})
elementLocale.use(en)

const app = new Vue({
  i18n,
  store,
  router,
  el: '#root',
  render: h => h(App)
})
