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
      message: 'Please input store name:',
    }];

    return this.prompt(prompts).then(answers => {
      this.name = answers.name;
    });
  }

  writing() {
    var capitalizedName = this.name[0].toUpperCase() + this.name.slice(1)
    this.fs.copyTpl(
      this.templatePath('index.js'),
      this.destinationPath(`src/js/store/_${this.name}.store.js`), {
        name: this.name
      }
    )
    this.log(`1) import create page in src/js/store/index.js:`.red.bold)
    this.log(`import ${this.name} from './_${this.name}.store.js'`)
    this.log('')
    this.log(`2) export:`.red.bold)
    this.log(`
      export default {
        ${this.name}
      }
    `)
  }
};