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
      message: 'Please input SPA name:',
    }, {
      type: 'confirm',
      name: 'useStore',
      message: 'Include Vuex?'
    }];

    return this.prompt(prompts).then(answers => {
      this.name = answers.name;
      this.useStore = answers.useStore
    });
  }

  writing() {
    const locals = {name: this.name, useStore: this.useStore}
    this.fs.copyTpl(
      this.templatePath('spa.js'),
      this.destinationPath(`src/js/${name}.js`), locals
    )
    this.log(`New Webpack entry created, you need to restart the devserver!`.red.bold)
  }
};