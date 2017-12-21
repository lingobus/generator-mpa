<script>
  // element-ui
  import ElDatePicker from "element-ui/lib/date-picker"
  import ElInput from "element-ui/lib/input"
  import ElInputNumber from "element-ui/lib/input-number"
  import ElOption from "element-ui/lib/option"
  import ElRate from "element-ui/lib/rate"
  import ElSelect from "element-ui/lib/select"
  import InputNumber from 'element-ui/lib/input-number'

  // lodash
  import toPairs from "lodash/toPairs"
  import isObject from "lodash/isObject"
  import isNumber from "lodash/isNumber"
  import range from "lodash/range"

  export default {
    props: {
      inputType: { type: String, default: "input" },
      type: { type: String },
      value: {},
      placeholder: { type: String, default: "" },
      options: { default: () => ({}) },
      style: { type: Object },
      caption: { type: String, default: "" },
      multiple: { type: Boolean },
      disabled: { type: Boolean, default: false },
      allowCreate: { type: Boolean, default: false},
      // 不同表单组件定制化选项
      config: {type: Object }
    },
    methods: {
      handleChange(value) {
        this.$emit("input", value)
      },
      getSelectOptions() {
        const { inputType, options } = this

        if (inputType === "select" && !!options) {
          let _options = []
          if (isNumber(options)) {
            _options = range(options).map(item => [item + 1, item + 1])
          } else if (isObject(options)) {
            _options = toPairs(options)
          }

          return _options.map(item => (
            <ElOption key={item[0]} label={item[1]} value={item[0]} />
          ))
        }
        return ""
      },
      getFormItem() {
        switch (this.inputType) {
          default:
          case "input":
            return (
              <ElInput
                onInput={this.handleChange}
                value={this.value}
                placeholder={this.caption || this.placeholder}
                disabled={this.disabled}
                resize={this.disabled ? 'none' : 'both'}
                type={this.type}
                autosize={true}
                {...this.config}
              />
            )
          case "select":
            return (
              <ElSelect
                onInput={this.handleChange}
                value={this.value || []}
                placeholder={this.caption || this.placeholder}
                multiple={this.multiple}
                disabled={this.disabled}
                allowCreate={this.allowCreate}
                {...this.config}
              >
                {this.captionPlaceHolder && <ElOption label={this.caption} />}
                {this.getSelectOptions()}
              </ElSelect>
            )
          case "date":
            return (
              <ElDatePicker
                onInput={this.handleChange}
                value={this.value}
                type={this.type || "date"}
                placeholder={this.caption || this.placeholder}
                disabled={this.disabled}
                pickerOptions={this.options}
                {...this.config}
              />
            )
          case "rate":
            return (
              <ElRate
                onInput={this.handleChange}
                value={this.value}
                disabled={this.disabled}
                {...this.config}
              />
            )
          case "inputNumber":
            return (
              <InputNumber
                onInput={this.handleChange}
                value={this.value}
                disabled={this.disabled}
                min={1}
                max={100}
                step={1}
                {...this.config}
              />
            )
        }
      }
    },
    render() {
      return (
        <span style={{ ...this.style, display: "inline-block" }}>
          {this.getFormItem() || "empty"}
        </span>
      )
    }
  }
</script>
