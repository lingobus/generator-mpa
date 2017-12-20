const Generator = require('yeoman-generator')
require('colors')

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
  }

  initializing() {
    this.pkg = require('../package.json');
  }

  prompting() {

    const prompts = [{
      type: 'input',
      name: 'name',
      message: 'Please input api module name:',
    }];

    return this.prompt(prompts).then(answers => {
      this.name = answers.name;
    });
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('index.js'),
      this.destinationPath(`src/js/api/_${this.name}.api.js`), {
        name: this.name
      }
    )
  }
};