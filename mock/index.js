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
      message: 'Please input mock module name:',
    }];

    return this.prompt(prompts).then(answers => {
      this.name = answers.name;
    });
  }

  writing() {
    var name = this.name + '.js'
    this.fs.copyTpl(
      this.templatePath('index.js'),
      this.destinationPath('mock/' + name), {
        name: name
      }
    )
    this.log(`You need to restart dev server to activate mock code!`.red.bold)
  }
};