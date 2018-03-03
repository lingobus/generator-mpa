<template lang="jade">
  .<%=name%>
    el-dialog(ref="dlg", :visible.sync="isOpen", v-bind="$vnode.data.attrs", @close="close")
      .content TODO: Dialog content here
      span.dialog-footer(slot="footer")
        el-button(@click="onButtonClicked('cancel')") Cancel
        el-button(type="primary", @click="onButtonClicked('ok')") OK
</template>

<style lang="stylus" scoped>

</style>

<script>
// framework imports
import ElDialog from 'element-ui/lib/dialog'
import ElButton from 'element-ui/lib/button'
// components imports

// utils imports

export default {
  name: '<%=name%>',
  components: {
    ElDialog,
    ElButton
  },
  props: [
    // 'data'
  ],
  data () {
    return {
      isOpen: false
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    // initializer
    init () {
      // this.data = {}
    },
    open (json) {
      this.json = json
      this.isOpen = true
      this.$refs.dlg.open()
      this.init()
    },
    close () {
      this.isOpen = false
      this.$refs.dlg.close()
    },
    handleClose () {
      this.isOpen = false
    },
    // event handlers
    onButtonClicked (whichButton) {
      this.$emit('action', whichButton, () => this.close())
    }  },
  watch: {

  }
}
</script>
