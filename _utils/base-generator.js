require('colors')
const $path = require('path')
const glob = require('glob')
const cp = require('../_utils/cp.js')
const string = require('../_utils/string.js')
const installPkgs = require('../_utils/install-pkgs.js')
const JsonEditor = require('../_utils/json-editor.js')
const Generator = require('yeoman-generator')

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts)
    this.babelrc = new JsonEditor(this.destinationPath('.babelrc'), true)
    this._log = this.log
  }

  initializing() {
    this.log = function () {
      this._log.apply(this, arguments)
      return this
    }
    this.pkg = require('../package.json')
  }

  restart() {
    this.log('Please restart the dev server!'.red.bold)
    return this
  }

  cp(config) {
    cp(this, config)
    return this
  }

  camelize(s) {
    return string.camelize(s)
  }

  getName (suffix, prefix) {
    prefix = prefix || ''
    suffix = suffix || ''
    const n = this.name || this.answers.name
    return prefix + n + suffix
  }
  compName () {
    const name = this.getName()
    return this.camelize(name)
  }

  installPkgs(pkgs) {
    installPkgs(this, pkgs)
    return this
  }

  getPages (reload) {
    if (this.pages && !reload) return this.pages
    const root = this.destinationRoot()
    return this.pages = glob.sync(`${root}/src/js/pages/*/`).reduce(function (all, page) {
      const name = $path.basename(page)
      all.push({
        name: name,
        value: name,
        short: name
      })
      return all
    }, [])
  }
}