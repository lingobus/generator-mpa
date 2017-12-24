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
      message: 'Please input page name:',
    }];

    return this.prompt(prompts).then(answers => {
      this.name = answers.name;
    });
  }

  writing() {
    var camelizedName = camelize(this.name)
    this.fs.copyTpl(
      this.templatePath('index.vue'),
      this.destinationPath(`src/js/pages/${this.name}/${camelizedName}.vue`), {
        name: this.name
      }
    )
    this.log(`1) import created page in _routes.js:`.red.bold)
    this.log(`import ${camelizedName} from './pages/${this.name}/${camelizedName}.vue'`)
    this.log('')
    this.log(`2) point 'path' to created page component:`.red.bold)
    this.log(`{ path: '/${this.name}', component: ${camelizedName}, props: {} }`)
  }
}

function camelize(s) {
  return s.replace(/(^[a-z]|[-_]([a-z]))/g, function(_, a, b) {
    return (b || a).toUpperCase()
  })
}
