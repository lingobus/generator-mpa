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
    this.log(`Why we introduce the api layer(*.api.js):`.bold.red)
    this.log(`
      By putting ajax parameters transform and response data transform in your *.api.js,
      we can make the view layer more thin and more easy to maintain.
    `.green.bold)
  }
};