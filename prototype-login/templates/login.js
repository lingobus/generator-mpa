/* eslint-disable */
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import 'utils/_interceptors.js'

// element-ui component
import MessageMixin from "utils/_elementui-mixin.js"

// custom component
window.$LB = window.$LB || {}

// i18n
Vue.use(VueI18n)
import en from 'element-ui/lib/locale/lang/en.js'
import elementLocale from 'element-ui/lib/locale'

const loginPageMessages = {
  "en-US": {
  },
  "zh-CN": {
  }
}

const locale = $LB.locale || 'en-US'
loginPageMessages['en-US'].el = en.el
Object.assign($LB[locale], loginPageMessages[locale])
const i18n = new VueI18n({
  locale,
  fallbackLocale: 'en-US',
  messages: $LB,
  silentTranslationWarn: process.env.NODE_ENV === 'development'
})
elementLocale.use(en)
elementLocale.i18n(key => {
  return i18n.t(key)
})
import LoginForm from "./pages/login/Login.vue"

new Vue({
  i18n,
  el: '#root',
  name: 'Login',
  mixins: [
    MessageMixin
  ],
  components: {
    LoginForm
  },
  data() {
    return {
      logined: false,
      userInfo: null
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
    }
  }
})
