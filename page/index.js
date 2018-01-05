const Generator = require('../_utils/base-generator.js')

module.exports = class extends Generator {
  prompting() {
    const prompts = [{
      type: 'input',
      name: 'dir',
      message: 'Please input dir name:',
    }, {
      type: 'input',
      name: 'name',
      message: 'Please input page name:',
    }, {
      type: 'input',
      name: 'url',
      message: 'Please input url for this page, for example: /user/:id',
    }];

    return this.prompt(prompts).then(answers => {
      this.answers = answers
    });
  }

  writing() {
    const dir = this.answers.dir
    const url = this.answers.url
    const name = this.answers.name
    const camelizedName = this.camelize(name)
    this.cp([
      ['index.vue', `src/js/pages/${dir}/${camelizedName}.vue`, this.answers]
    ])

    this.log(`1) import created page in _routes.js:`.red.bold)
    this.log(`import ${camelizedName} from './pages/${dir}/${camelizedName}.vue'`)
    this.log('')
    this.log(`2) point 'path' to created page component:`.red.bold)
    this.log(`{ path: '/${url}', component: ${camelizedName}, props: {} }`)
  }
}
