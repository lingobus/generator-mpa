<template lang="jade">
  .<%=name%>
</template>

<script>
// framework imports

// components imports

// utils imports

export default {
  name: '<%=name%>',
  components: {},
  props: [],
  data () {
    return {

    }
  },
  mounted () {
    this.init()
  },
  methods: {
    // initializer
    init () {}
    // methods
    // event handlers
  },
  watch: {

  }
}

// private helpers
// function helper() {
//
// }
</script>

<style lang="stylus" scoped>
.<%=name%>
  color: black
</style>