const Generator = require('yeoman-generator')
require('colors')

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts)
  }

  initializing() {
    this.pkg = require('../package.json')
  }

  prompting() {

    const prompts = [{
      type: 'input',
      name: 'page',
      message: 'Please input the page name, for example: user',
    }, {
      type: 'input',
      name: 'name',
      message: 'Please input table name, for example: users',
    }]

    return this.prompt(prompts).then(answers => {
      this.name = answers.name
      this.page = answers.page
    })
  }

  writing() {
    var capitalizedName = this.name[0].toUpperCase() + this.name.slice(1)
    const locals = {name: this.name, capitalizedName}

    // components
    this._cpTpl('page.vue', `src/js/pages/${this.page}/${capitalizedName}.vue`, locals)
    this._cp('query-bar.vue', `src/js/components/query-bar.vue`)
    this._cp('dynamic-form-item.vue', `src/js/components/dynamic-form-item.vue`)

    // utils
    this._cp('_search-result-page-utils.js', `src/js/utils/_search-result-page-utils.js`)


    // apis
    this._cpTpl('_mpa-demo.api.js', 'src/js/api/_mpa-demo.api.js', locals)

    // mock
    this._cpTpl('mock.js', `mock/${this.name}.js`, locals)

    // install dependencies
    this.yarnInstall([
      "babel-plugin-syntax-jsx",
      "babel-plugin-transform-vue-jsx"
    ])

    this.log(`add following plugins into .bablerc:`.red.bold)
    this.log(`
    "plugins": ["transform-vue-jsx"]
    `.green.bold)

    this.log(`add following plugins into mock/index.js and restart dev server:`.red.bold)
    this.log(`
      router.use(apiurl('/${this.name}'), require('./${this.name}'))
    `.green.bold)
  }

  _cp (from, to) {
    this.fs.copy(
      this.templatePath(from),
      this.destinationPath(to)
    )
  }
  _cpTpl (from, to, locals) {
    this.fs.copyTpl(
      this.templatePath(from),
      this.destinationPath(to),
      locals
    )
  }
}