const Generator = require('../_utils/base-generator.js')

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts)
  }
  writing() {
    // const locals = {}
    this.cp([
      // main files
      ['App.vue', 'src/js/App.vue'],
      ['index.jade', 'src/html/index.jade'],
      ['index.js', 'src/js/index.js'],
      ['index.styl', 'src/css/index.styl'],
      ['logo.png', 'src/img/logo.png'],

      // components
      ['sidebar.vue', `src/js/components/sidebar.vue`],
      ['sidebar.json', `src/js/components/sidebar.json`],
      ['navbar.vue', `src/js/components/navbar.vue`],

      // apis
      ['_settings.api.js', `src/js/api/_settings.api.js`]
    ])

    // extra code
    this.log(`You may need to add following code to controllers/index.js:`.red.bold)
    this.log(`
    router.get('/', function (req, res) {
      res.render('index')
    })
    `)

    // install dependencies
    this.installPkgs([
      "vue-awesome",
      "babel-plugin-syntax-jsx",
      "babel-plugin-transform-vue-jsx"
    ])

    this.log(`adding transform-vue-js plugin to .babelrc:`.red.bold)
    this.babelrc.push('plugins', 'transform-vue-jsx')
    this.babelrc.save()
    this.restart()
  }
};