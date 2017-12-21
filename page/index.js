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
    var capitalizedName = this.name[0].toUpperCase() + this.name.slice(1)
    this.fs.copyTpl(
      this.templatePath('index.vue'),
      this.destinationPath(`src/js/pages/${this.name}/${capitalizedName}.vue`), {
        name: this.name
      }
    )
    this.log(`1) import created page in _routes.js:`.red.bold)
    this.log(`import ${capitalizedName} from './pages/${this.name}/${capitalizedName}.vue'`)
    this.log('')
    this.log(`2) point 'path' to created page component:`.red.bold)
    this.log(`{ path: '/${this.name}', component: ${capitalizedName}, props: {} }`)
  }
};