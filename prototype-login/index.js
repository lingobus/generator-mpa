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
      name: 'sysname',
      message: 'Please input system name, for example: XXX Management System',
    }];

    return this.prompt(prompts).then(answers => {
      this.sysname = answers.name;
    });
  }

  writing() {
    const locals = {sysname: this.sysname}
    this.fs.copy(
      this.templatePath('logo.png'),
      this.destinationPath(`src/css/logo.png`)
    )
    this.fs.copyTpl(
      this.templatePath('login.js'),
      this.destinationPath(`src/js/login.js`), locals
    )
    this.fs.copyTpl(
      this.templatePath('Login.vue'),
      this.destinationPath(`src/js/pages/login/Login.vue`), locals
    )
    this.fs.copyTpl(
      this.templatePath('login.jade'),
      this.destinationPath(`src/html/login.jade`), locals
    )
    this.fs.copyTpl(
      this.templatePath('login.styl'),
      this.destinationPath(`src/css/login.styl`), locals
    )
    // install dependencies
    this.yarnInstall(['lodash','promise.prototype.finally'])

    this.log(`add following code to controllers/index.js`.red.bold)
    this.log(`
      router.get('/login', function (req, res) {
        res.render('login')
      })
    `)
  }
};