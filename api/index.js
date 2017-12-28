const Generator = require('../_utils/base-generator.js')

module.exports = class extends Generator {
  prompting() {
    const prompts = [{
      type: 'input',
      name: 'name',
      message: 'Please input api module name:',
    }];

    return this.prompt(prompts).then(answers => {
      this.answers = answers
    });
  }

  writing() {
    this.cp([
      ['index.js', this.getName('.api.js', 'src/js/api/_'), this.answers]
    ])
  }
};