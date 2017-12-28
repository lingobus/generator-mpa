const Generator = require('../_utils/base-generator.js')

module.exports = class extends Generator {
  prompting() {
    const prompts = [{
      type: 'input',
      name: 'name',
      message: 'Please input component name:',
    }];

    return this.prompt(prompts).then(answers => {
      this.answers = answers;
    });
  }

  writing() {
    const name = this.answers.name
    const compName = this.camelize(name)
    this.log('Import this component where needed:'.red.bold)
    this.log(`
    import ${compName} from '@components/${name}.vue'
    `.green.bold)
    this.cp([
      ['index.vue', this.getName('.vue', 'src/js/components/'), this.answers]
    ])
  }
};