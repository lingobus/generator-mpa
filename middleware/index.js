const Generator = require('yeoman-generator')

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
      name: 'controllerName',
      message: 'Please input middelware name:',
    }];

    return this.prompt(prompts).then(answers => {
      this.controllerName = answers.controllerName;
    });
  }

  writing() {
    var name = this.controllerName + '.js'
    this.fs.copyTpl(
      this.templatePath('index.js'),
      this.destinationPath('middlewares/' + name), {
        name: name
      }
    )
  }
};