const Generator = require('../_utils/base-generator.js')

module.exports = class extends Generator {
  prompting() {
    const prompts = [{
      type: 'input',
      name: 'name',
      message: 'Please input page name:',
    }];

    return this.prompt(prompts).then(answers => {
      this.answers = answers
    });
  }

  writing() {
    const name = this.answers.name
    const camelizedName = this.camelize(name)
    this.cp([
      ['index.vue', `src/js/pages/${name}/${camelizedName}.vue`]
    ])

    this.log(`1) import created page in _routes.js:`.red.bold)
    this.log(`import ${camelizedName} from './pages/${name}/${camelizedName}.vue'`)
    this.log('')
    this.log(`2) point 'path' to created page component:`.red.bold)
    this.log(`{ path: '/${name}', component: ${camelizedName}, props: {} }`)
  }
}
