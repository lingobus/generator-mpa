const Generator = require('../_utils/base-generator.js')
const glob = require('glob')
const path = require('path')

module.exports = class extends Generator {
  prompting() {
    const prompts = [{
      type: 'list',
      name: 'type',
      message: 'Please select',
      choices: [{
        name: 'A common dialog component (src/js/components):',
        value: 'common',
        short: 'common'
      }, {
        name: 'A dialog for page (src/pages/<page-name>/):',
        value: 'page',
        short: 'page'
      }]
    }, {
      type: 'list',
      name: 'pageName',
      message: 'which page?',
      when: answers => answers.type === 'page',
      choices : this.getPages()
    }, {
      type: 'input',
      name: 'dialogName',
      default: 'dialog',
      message: 'dialog name, dash-separated, not "-dialog" suffix:'
    }, {
      type: 'list',
      name: 'dialogSize',
      message: 'dialog size?',
      default: 'small',
      choices: [{
        name: 'tiny',
        value: 'tiny'
      }, {
        name: 'small',
        value: 'small',
      }, {
        name: 'large',
        value: 'large'
      }, {
        name: 'full',
        value: 'full'
      }]
    }]

    return this.prompt(prompts).then(answers => {
      this.answers = answers
      this.type = answers.type
      this.page = answers.pageName
      this.name = answers.dialogName + '-dialog'
      this.size = answers.dialogSize

      answers.name = this.name
    })
  }

  writing() {
    const camelizedName = this.camelize(this.name)

    var dest
    if (this.type === 'page') {
      dest = `src/js/pages/${this.page}/${this.name}.vue`
    } else {
      dest = `src/js/components/${this.name}.vue`
    }
    this.cp([
      ['dialog.vue', dest, this.answers]
    ])

    this.log(`select part of the following code and paste it to where needed`.red.bold)
    this.log(`
      <template>
        <!-- html -->
        <${this.name}
          ref="dialog",
          title="Dialog Title",
          size="${this.size}",
          @action="on${camelizedName}Action">
        </${this.name}>

        <!-- jade -->
        ${this.name}(
          ref="dialog",
          title="Dialog Title",
          size="${this.size}",
          @action="on${camelizedName}Action")
      </template>

      <script>
      import ${camelizedName} from '${this.type === 'page' ? "." : "components"}/${this.name}.vue'
      export default {
        components: {
          Component,
          ${camelizedName}
        },
        methods: {
          method () {
            this.$refs.dialog.open()
          },
          on${camelizedName}Action (act, close) {
            close()
          }
        }
      }
      </script>
    `.green.bold)
  }
}