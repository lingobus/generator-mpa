const Generator = require('../_utils/base-generator.js')

module.exports = class extends Generator {
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
      this.answers = answers
    });
  }

  writing() {
    const name = this.answersname
    const locals = this.answers
    this.cp([
      ['spa.js',`src/js/${name}.js`, locals],
      [this.hasJade, 'spa.jade', `src/html/${name}.js`, locals],
      [this.hasStylus, 'spa.styl', `src/css/${name}.js`, locals]
    ])

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