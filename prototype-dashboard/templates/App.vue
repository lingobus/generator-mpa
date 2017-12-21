<template lang="jade">
  .main
    .root-container.clear-fix
      el-row
        el-col(:span="24")
          navbar( action="onNavbarAction")
      sidebar
      .content
        router-view
</template>
<style lang="stylus">
body.shrink .content
  margin-left: 30px
</style>
<style lang="stylus" scoped>
.content
  margin-left: 110px
  padding: 1em
  transition: margin-left 100ms
</style>
<script>
  // layout
  import Navbar from "components/navbar.vue"
  import Sidebar from "components/sidebar.vue"
  import ElRow from "element-ui/lib/row"
  import ElCol from "element-ui/lib/col"
  import MessageMixin from "@/js/utils/_elementui-mixin.js"
  import UserAPI from 'api/_user.api.js'

  export default {
    name: 'app',
    mixins: [
      MessageMixin
    ],
    components: {
      Navbar,
      Sidebar,
      ElRow,
      ElCol
    },
    created() {
      // TODO: fetch data
    },
    methods: {
      onNavbarAction (act) {
        if (act === 'logout') {
          UserAPI.logout().then(_ => location.href = '/login')
        }
      }
    }
  }
</script>
