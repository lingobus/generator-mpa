const Generator = require('../_utils/base-generator.js')

module.exports = class extends Generator {
  prompting() {
    const prompts = [{
      type: 'input',
      name: 'name',
      message: 'Please input store name:',
    }];

    return this.prompt(prompts).then(answers => {
      this.answers = answers
    });
  }

  writing() {
    var name = this.getName()
    this.cp([
      ['index.js', `src/js/store/_${name}.store.js`, this.answers]
    ])

    this.log(`1) import create page in src/js/store/index.js:`.red.bold)
    this.log(`import ${name} from './_${name}.store.js'`.green.bold)
    this.log('')
    this.log(`2) export:`.red.bold)
    this.log(`
      export default {
        ${name}
      }
    `.green.bold)
  }
};