const Generator = require('../_utils/base-generator.js')
const glob = require('glob')
const path = require('path')

module.exports = class extends Generator {
  prompting() {
    const compDir = this.getComponentsDir(false)
    const pagesDir = this.getPagesDir(false)
    const prompts = [{
      type: 'list',
      name: 'type',
      message: 'Please select',
      choices: [{
        name: `A common dialog component (${compDir}):`,
        value: 'common',
        short: 'common'
      }, {
        name: `A dialog for page (${pagesDir}/<page-name>/):`,
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
    }, {
      type: 'list',
      name: 'isInDir',
      message: 'create single file or in directory?',
      choices: ['single file', 'dir']
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

    var dest, dir, isInDir = this.answers.isInDir === 'dir'
    this.isInDir = isInDir
    if (this.type === 'page') {
      dir = this.getPagesDir(false)
      if (isInDir) {
        dest = `${dir}/${this.page}/${this.name}/index.vue`
      } else {
        dest = `${dir}/${this.page}/${this.name}.vue`
      }
    } else {
      dir = this.getComponentsDir(false)
      if (isInDir) {
        dest = `${dir}/${this.name}/index.vue`
      } else {
        dest = `${dir}/${this.name}.vue`
      }
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
      import ${camelizedName} from '${this.type === 'page' ? "." : "components"}/${isInDir ? (this.name + '/index') : this.name}.vue'
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
