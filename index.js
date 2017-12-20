const Generator = require('yeoman-generator')

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
  }

  initializing() {
    this.pkg = require('../package.json')
    this.log('mpa')
  }
};