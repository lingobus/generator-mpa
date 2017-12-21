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
    }, {
      type: 'confirm',
      name: 'hasJade',
      message: 'Do you need a jade file for this SPA?'
    }, {
      type: 'confirm',
      name: 'hasStylus',
      message: 'Do you need a stylus file for this SPA?'
    }];

    return this.prompt(prompts).then(answers => {
      this.name = answers.name;
      this.useStore = answers.useStore
      this.hasJade = answers.hasJade
      this.hasStylus = answers.hasStylus
    });
  }

  writing() {
    const name = this.name
    const locals = {name: this.name, useStore: this.useStore}
    this.fs.copyTpl(
      this.templatePath('spa.js'),
      this.destinationPath(`src/js/${name}.js`), locals
    )
    if (this.hasJade) {
      this.fs.copyTpl(
        this.templatePath('spa.jade'),
        this.destinationPath(`src/html/${name}.js`), locals
      )
    }
    if (this.hasStylus) {
      this.fs.copyTpl(
        this.templatePath('spa.styl'),
        this.destinationPath(`src/css/${name}.js`), locals
      )
    }

    if (this.hasJade) {
      this.log(`add following code to controllers/index.js:`.red.bold)
      this.log(`
      router.get('/${name}', function (req, res) {
        res.render('${name}')
      })
      `)
    } else {
      this.log(`add following code to the jade file where you use '${name}.js'`)
      this.log(`script(src="/static/js/${name}.js")`)
    }
    this.log(`New Webpack entry created, you need to restart the devserver!`.red.bold)
  }
};