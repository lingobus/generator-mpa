const Generator = require('yeoman-generator')
const glob = require('glob')
const path = require('path')
require('colors')


module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
  }

  initializing() {
    this.pkg = require('../package.json')
    this._readPageDirs()
  }

  prompting() {

    const prompts = [{
      type: 'list',
      name: 'type',
      message: 'Please select',
      choices: [{
        name: 'A common dialog component (src/components):',
        value: 'common',
        short: 'common'
      }, {
        name: 'A dialog for page (src/pages/???/):',
        value: 'page',
        short: 'page'
      }]
    }, {
      type: 'list',
      name: 'pageName',
      message: 'which page?',
      when: answers => answers.type === 'page',
      choices : this.pages
    }, {
      type: 'input',
      name: 'dialogName',
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
      this.type = answers.type
      this.page = answers.pageName
      this.name = answers.dialogName + '-dialog'
      this.size = answers.dialogSize
    })
  }

  writing() {
    const locals = {name: this.name, size: this.size}
    const camelizedName = camelize(this.name)
    var dest = `src/components/${this.name}.vue`
    if (this.type === 'page') {
      dest = `src/js/pages/${this.page}/${this.name}.vue`
    }
    this.fs.copyTpl(
      this.templatePath('dialog.vue'),
      this.destinationPath(dest),
      locals
    )

    this.log(`select part of the following code and insert it to where needed`.red.bold)
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
      import ${camelizedName} from './${this.name}.vue'
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
  _readPageDirs () {
    const root = this.destinationRoot()
    this.pages = glob.sync(`${root}/src/js/pages/*/`).reduce(function (all, page) {
      const name = path.basename(page)
      all.push({
        name: name,
        value: name,
        short: name
      })
      return all
    }, [])
  }
}

function camelize(s) {
  return s.replace(/(^[a-z]|[-_]([a-z]))/g, function(_, a, b) {
    return (b || a).toUpperCase()
  })
}