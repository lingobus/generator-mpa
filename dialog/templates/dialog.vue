<template lang="jade">
  .<%=name%>
    el-dialog(v-bind="$vnode.data.attrs")
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

    }
  },
  methods: {
    // initializer
    init () {

    },
    // event handlers
    onButtonClicked (whichButton) {
      this.$emit('action', whichButton)
    }
  },
  watch: {

  }
}
</script>