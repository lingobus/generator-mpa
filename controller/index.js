const Generator = require('../_utils/base-generator.js')

module.exports = class extends Generator {
  prompting() {
    const prompts = [{
      type: 'input',
      name: 'url',
      message: 'Please input url name, for example: /user',
    }, {
      type: 'input',
      name: 'tpl',
      message: 'Please input the template to render, for example: user',
    }, {
      type: 'input',
      name: 'name',
      message: 'Please input controller name, for example user:',
    }];

    return this.prompt(prompts).then(answers => {
      this.answers = answers
    });
  }

  writing() {
    const name = this.getName('.controller.js')
    this.cp([
      ['index.js', 'controllers/' + name, this.answers]
    ])
    this.restart()
  }
};