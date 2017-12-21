<i18n>
{
 "en-US": {
    "logout": "Logout"
  },
  "zh-CN": {
    "logout": "退出"
  }
}
</i18n>
<template lang="jade">
  .navbar
    a(href="/")
      img.logo(src="~@/img/logo.png")
    .pull-right
      span.separator
      el-dropdown.user-info-menu
        span.userinfo
          el-button(v-if="username", size="small", type="text").username
            span {{username}}
            i(class="el-icon-caret-bottom el-icon-right", style="margin-left:16px")
        el-dropdown-menu.arrow-menu.user-menu(slot="dropdown")
          el-dropdown-item
            a(href="javascript:;", @click="action('logout')") {{$t('logout')}}
</template>
<style lang="stylus" scoped>
  .navbar
    color: #27272c
  .navbar:after
    clear: both
    content: ''
    display: block
    height: 0
  .user-menu
    width: 182px
    transform: translate(-10px, 15px)
  .navbar
    font-size: 16px
    .pull-right
      float: right
      & > *
        margin-right: 18px
    border-bottom: solid 1px #eaeaea
    box-sizing: border-box
    clear: both
    font-size: 14px
    height: 40px
    padding: 5px 0
    width: 100%
    .logo
      width: 140px
      margin-left: 20px
    .user-info-menu
      font-size: 16px
      position: relative
      margin-right: 0
      padding-right: 32px
    .userinfo
      cursor: pointer
      &:hover
          color: #887bd7
      .avatar
        border-radius: 50%
        width: 32px
        height: 32px
        display: inline-block
        vertical-align: middle
        margin: 0 14px 0 30px
      .username
        color: #28272c
        font-size: 16px
</style>
<script>
import ElButton from 'element-ui/lib/button'
import ElDropdown from 'element-ui/lib/dropdown'
import ElDropdownMenu from 'element-ui/lib/dropdown-menu'
import ElDropdownItem from 'element-ui/lib/dropdown-item'
import Settings from 'api/_settings.api.js'
import UserAPI from 'api/_user.api.js'

export default {
  components: {
    ElButton,
    ElDropdown,
    ElDropdownMenu,
    ElDropdownItem
  },
  data() {
    return {
      username: Settings.get('sys.username')
    }
  },
  mounted () {
  },
  methods: {
    action(act) {
      if (act === 'logout') {
        UserAPI.logout().then(_ => location.href = '/login')
        return
      }
      this.$emit('action', act)
    }
  }
}
</script>
