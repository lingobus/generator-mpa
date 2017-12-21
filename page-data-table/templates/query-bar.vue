<template lang="jade">
  .querybar-v3.clear-fix(:id="id")
    form.navbar-form(role='search')
      .form-group.show
        //- 各种查询条件
        span.extra-query-params
          slot(name="extraQueryParam0")
        dynamic-form-item(v-for="(config, index) in queryParamsConfig",
          :inputType="config.inputType",
          :item-name="config.name",
          :type="config.type",
          :placeholder="config.caption",
          :multiple="config.multiple",
          :options="config.options",
          :disabled="_isDisabled(config.name)",
          @input="_refresh(config, $event)",
          v-model="queryParams[config.name]",
          :key="config.name")
        span.extra-query-params
          slot(name="extraQueryParam1")
        //- 按钮
        span.btn-toolbar.btn-group(:style="{'order': fieldCount}")
          slot(name="extraButtons0")
          el-button(v-for="(btn,i) in buttons",
            :key="i",
            :type="btn.type",
            :icon="btn.icon",
            @click="_onButtonClicked(btn.name, btn)") {{btn.caption}}
          slot(name="extraButtons1")
</template>
<style lang="stylus" scoped>
  .querybar-v3
    line-height: 2.5em
    .form-group > span
      margin-right: 4px
      margin-bottom: 1em
    .el-input
      text-align: center
      margin-right: 2px
    .form-group
      display: flex
      flex-wrap: wrap
      align-items: center
</style>
<script>
  import DynamicFormItem from '../components/dynamic-form-item.vue'

  import _get from 'lodash/get'

  const Buttons = [{
    name: 'search',
    icon: 'search',
    caption: 'Search',
    type: 'primary'
  }, {
    name: 'reset',
    icon: 'circle-cross',
    caption: 'Reset'
  }]

  let QueryBar = {
    name: 'query-bar',
    VERSION: 'v3 for vue2 no jquery',
    Mixins: {},
    props: {
      id: {},
      queryParams: {}, // 查询参数
      queryParamsConfig: {}, // 查询项配置{caption,inputType}
      buttons: {
        type: Array,
        default: () => Buttons
      },// 按钮配置，见上面的Buttons
      onButtonClicked: {}, // 按钮点击处理函数
      searchOnEnterKey: {}, // 是否按回车触发搜索，可选
      inputStatesDisabled: {},
      captionPlaceholder: {},
    }, // 下拉菜单第一项是否是value为空，文字为config.caption，可选
    components: {
      DynamicFormItem
    },
    computed: {
      fieldCount() {
        return this.queryParamsConfig.length
      }
    },
    mounted() {
      // Input fields in above template will not get updated in Vue2
      // we have to call _refresh at appropriate timing to force a update
      document.body.addEventListener('mouseup', e => {
        if (e.target.tagName.toLowerCase() === 'td') {
          setTimeout(_ => this._refresh())
        }
      })
      if (typeof this.searchOnEnterKey !== false) {
        this.$el.addEventListener('keydown', e => {
          if (e.keyCode === 13/*Enter*/ && e.target.tagName.toLowerCase() === 'input') {
            this.onButtonClicked('search', this)
          }
        })
      }
    },
    methods: {
      _refresh(configOrEventName, value) {
        // 目前只 监听select 元素改变事件, 来通知外界触发关联操作
        if (typeof configOrEventName === 'object' && configOrEventName.inputType === 'select') {
          this.$emit('inputChanged', configOrEventName, value)
        }
        this.$forceUpdate()
      },
      /**
       * fore update all inputs
       */
      _reset() {
        const inputs = Array.from(this.$el.querySelectorAll('input[type=text]'))
        inputs.forEach(ele => ele.value = "")
        this.queryParamsConfig.forEach(config => {
          if (config.clearOnReset) {
            config.options = {}
          }
        })
        this._refresh("reset")
      },
      _isDisabled(name) {
        return _get(this.inputStatesDisabled, name, false)
      },
      _onButtonClicked(op, btnConfig) {
        if (op === 'reset') {
          for (let key in this.queryParams) {
            const isArray = Array.isArray(this.queryParams[key])
            this.queryParams[key] = isArray ? [] : ""
          }
          this._reset()
          this.$emit('reset')
        }
        if (typeof this.onButtonClicked === 'function') {
          this.onButtonClicked(op, this)
          this.$emit('search')
        }
      },
    }
  }

  QueryBar.Mixins.Search = {
    methods: {
      onQuerybarButtonClicked(op, params) {
        if (typeof this.search !== 'function') {
          throw new Error('Missing search method!')
        }
        if (op === 'search') {
          this.search()
        } else if (op === 'reset') {
          this.search(1)
        }
      }
    },
    components: {
      QueryBar
    }
  }
  let Self = QueryBar
  export default QueryBar
</script>
