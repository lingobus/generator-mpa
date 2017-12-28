const Generator = require('../_utils/base-generator.js')

module.exports = class extends Generator {
  prompting() {
    const prompts = [{
      type: 'input',
      name: 'sysname',
      message: 'Please input system name, for example: XXX Management System',
    }];

    return this.prompt(prompts).then(answers => {
      this.answers = answers
    });
  }

  writing() {
    const locals = this.answers
    this.cp([
      ['logo.png', 'src/img/logo.png'],
      ['login.js', 'src/js/login.js', locals],
      ['Login.vue', 'src/js/pages/login/Login.vue', locals],
      ['login.jade', 'src/html/login.jade', locals],
      ['login.styl', 'src/css/login.styl', locals],
      ['login.controller.js', 'controller/login.controller.js', locals]
    ])

    // install dependencies
    this.installPkgs(['lodash', 'promise.prototype.finally'])
  }
};