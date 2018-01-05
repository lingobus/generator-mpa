const Generator = require('../_utils/base-generator.js')
const glob = require('glob')
const path = require('path')

module.exports = class extends Generator {
  prompting() {
    const prompts = [{
      type: 'list',
      name: 'pageName',
      message: 'which page?',
      choices : this.getPages()
    }, {
      type: 'input',
      name: 'name',
      default: 'component',
      message: 'component name, dash-separated'
    }]

    return this.prompt(prompts).then(answers => {
      this.answers = answers
    })
  }

  writing() {
    const name = this.answers.name
    const pageName = this.answers.pageName

    var dest = `src/js/pages/${pageName}/${name}.vue`
    this.cp([
      ['index.vue', dest, this.answers]
    ])

    this.log('Import this component where needed:'.red.bold)
    this.log(`
    import ${this.compName()} from './${name}.vue'
    `.green.bold)

  }
}