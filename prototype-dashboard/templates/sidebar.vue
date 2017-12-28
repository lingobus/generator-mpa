<i18n>
{
 "en-US": {
  },
  "zh-CN": {
  }
}
</i18n>
<template lang="jade">
  .sidebar
    .wrapper
      a.toggle(href="javascript:;", @click="toggleMenu()")
        fa-icon(name="bars")
      ul
        li(v-for="(item, key) in sidebarList")
          router-link.link.study(:to="item.to")
            el-tooltip(placement="right-start", :content="$t(item.content)")
              fa-icon(:name="item.icon")
            span.text(v-text="$t(item.content)")
</template>

<style lang="stylus" scoped>
$shrinkWidth = 35px
$expandWidth = 110px
.sidebar.shrink,
.sidebar-fixed.shrink
  width: $shrinkWidth
  .wrapper
    width: $shrinkWidth
  .text
    display: none
.toggle
  display: block
  margin-top: 3px
  text-align: center
.sidebar,
.sidebar-fixed
  transition: margin-left 200ms
  width: $expandWidth
  border-right: 1px solid #eee
  background-color: #fcfcfc
  .wrapper
    width: $expandWidth
  ul
    list-style: none
  .link
    position: relative
    color: #5e5d61
    padding-bottom: 6px
    &:hover
      background-color: #eee
  li a
    width: 100%
    display: inline-block
    font-size: 14px
    padding-left: 1em
    line-height: 3em
    height: 3em
    .fa-icon
      transform: translateX(-5px)
      vertical-align: middle
  .router-link-active
    background-color: #ffe550 !important
    color: black
.sidebar
  position: absolute
  left: 0
  bottom: 0
  top: 40px
.sidebar-fixed
  position: fixed
  top: 0
  left: 0
  bottom: 0
</style>

<script>
  import Settings from 'api/_settings.api.js'
  import ElTooltip from 'element-ui/lib/tooltip'
  import _throttle from 'lodash/throttle'
  //see http://fontawesome.io/icons/ for more icons
  import sidebarList from './sidebar.json'

  export default {
    name: 'Sidebar',
    components: {
      ElTooltip
    },
    data() {
      return {
        wrapper: null,
        sidebarList
      }
    },
    mounted () {
      if (Settings.get('ui.sidebar.status') == 'shrink') {
        this.toggleMenu(false)
      }
      const wrapper = this.wrapper = this.$el.querySelector('.wrapper')
      const offsetTop = this.$el.offsetTop
      window.addEventListener('scroll', _throttle(e => {
        const scrollY = Math.round(window.scrollY)
        const lst = this.$el.classList

        let classToRemove = ""
        let classToAdd = ""
        if (scrollY > offsetTop) {
          if (lst.contains('sidebar')) {
            classToRemove = 'sidebar'
            classToAdd = 'sidebar-fixed'
          }
        } else {
          if (lst.contains('sidebar-fixed')) {
            classToRemove = 'sidebar-fixed'
            classToAdd = 'sidebar'
          }
        }
        if (classToRemove) {
          lst.remove(classToRemove)
        }
        if (classToAdd) {
          lst.add(classToAdd)
        }
      }, 10))
    },
    methods: {
      toggleMenu (forceExpand) {
        const lst = this.$el.classList
        const cls = 'shrink'
        const bdy = document.body.classList
        var method
        if (typeof forceExpand !== 'undefined') {
          method = forceExpand ? 'remove' : 'add'
        } else {
          method = lst.contains(cls) ? 'remove' : 'add'
        }
        lst[method](cls)
        bdy[method](cls)
        Settings.set('ui.sidebar.status', method == 'add' ? cls : '')
      }
    }
  }
</script>
