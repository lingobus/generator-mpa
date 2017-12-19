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
      name: 'name',
      message: 'Please input component name:',
    }];

    return this.prompt(prompts).then(answers => {
      this.name = answers.name;
    });
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('index.vue'),
      this.destinationPath('src/js/components/' + this.name + '.vue'), {
        name: this.name
      }
    )
  }
};