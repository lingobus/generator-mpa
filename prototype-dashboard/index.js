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
      message: 'Please input system name, for example: CRM System',
    }];

    return this.prompt(prompts).then(answers => {
      this.sysname = answers.name;
    });
  }

  writing() {
    const locals = {}
    // main files
    this._cp('App.vue', 'src/js/App.vue')
    this._cp('index.jade', 'src/html/index.jade')
    this._cp('index.js', 'src/js/index.js')
    this._cp('index.styl', 'src/css/index.styl')
    this._cp('logo.png', 'src/img/logo.png')

    // components
    this._cp('sidebar.vue', `src/js/components/sidebar.vue`)
    this._cp('_sidebar-menu.js', `src/js/components/_sidebar-menu.js`)
    this._cp('navbar.vue', `src/js/components/navbar.vue`)

    // apis
    this._cp('_settings.api.js', `src/js/api/_settings.api.js`)

    // extra code
    this.log(`add following code to controllers/index.js:`.red.bold)
    this.log(`
    router.get('/', function (req, res) {
      res.render('index')
    })
    `)

    // install dependencies
    this.yarnInstall(['vue-awesome'])

    // restart alert
    this.log(`New Webpack entry created, you need to restart the devserver!`.red.bold)
  }

  _cp (from, to) {
    this.fs.copy(
      this.templatePath(from),
      this.destinationPath(to)
    )
  }
};