<i18n>
{
  "en-US": {
    "username": "User Name",
    "password": "Password",
    "login": "Login",
    "loginFailed": "Login failed, incorrect user name or password!"
  }
}
</i18n>
<template lang="jade">
  .login-form
    .title
      //- img(src="~@/img/logo.png")
    el-card.box-card
      .sys-name <%=sysname%>
      el-form
        el-form-item
          el-input.username(:placeholder="$t('username')", v-model="username")
        el-form-item
          el-input.password(type="password", :placeholder="$t('password')", v-model="password")
        el-form-item
          el-button.login-btn(type="primary", @click="doLogin", :disabled="!isEnableLoginButton()") {{$t('login')}} &nbsp;
            i.el-icon-right.el-icon-d-arrow-right
</template>

<style lang="stylus" scoped>
.login-form
  width: 300px
  margin: 10em auto 0
.sys-name
  font-size: 25px
  color: #887bd7
  margin-bottom: 10px
.title, .sys-name
  text-align: center
  img
    transform: translateX(48px)
  img.run
    transform: translateX(-48px)
    transition: all 10s ease
    transition-delay: 1s
.login-btn
  width: 100%
</style>

<script>
import ElButton from "element-ui/lib/button"
import ElCard from "element-ui/lib/card"
import ElForm from "element-ui/lib/form"
import ElFormItem from "element-ui/lib/form-item"
import ElInput from "element-ui/lib/input"
// import UserAPI from 'api/_user.api.js';
import ElementUIMixin from 'utils/_elementui-mixin.js'

export default {
  name: 'LoginForm',
  mixins: [ ElementUIMixin ],
  components: {
    ElButton,
    ElCard,
    ElForm,
    ElFormItem,
    ElInput
  },
  mounted () {
    this.$el.querySelector('.username input').focus()
  },
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    doLogin () {
      // TODO: remove following code after you rewrite doLogin()
      if (typeof UserAPI === 'undefined') {
        alert('You need to to import login api and rewrite Login.vue#doLogin!')
      }
      UserAPI.login(this.username, this.password).then(isOK => {
        // TODO: redirect to index page if login successfully
        location = '/index'
      }).catch(e => {
        this.$error(this.$t('loginFailed'))
      })
    },
    isEnableLoginButton () {
      return this.username && this.password
    }
  }
}
</script>
