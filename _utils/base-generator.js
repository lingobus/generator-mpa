require('colors')
const $fs = require('fs')
const $path = require('path')
const glob = require('glob')
const cp = require('../_utils/cp.js')
const string = require('../_utils/string.js')
const installPkgs = require('../_utils/install-pkgs.js')
const JsonEditor = require('../_utils/json-editor.js')
const Generator = require('yeoman-generator')

const mpaConfigPath = $path.resolve(process.cwd(), 'mpa.config.js')

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts)
    this.babelrc = new JsonEditor(this.destinationPath('.babelrc'), true)
    this._log = this.log

    if ($fs.existsSync(mpaConfigPath)) {
      this._conf = require(mpaConfigPath)
      if (!this._conf.dirs) {
        this._conf.dirs = {}
      }
      console.log('found mpa.config.js', this._conf)
    } else {
      this._conf = {
        dirs: {
          pages: 'src/js/pages',
          components: 'src/js/components'
        }
      }
    }
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

  getComponentsDir (prefixRoot = true) {
    const root = this.destinationRoot()
    const dir = this._conf.dirs.components || 'src/js/components'
    return  prefixRoot ? `${root}/${dir}` : dir
  }

  getPagesDir (prefixRoot = true) {
    const root = this.destinationRoot()
    const dir = this._conf.dirs.pages || 'src/js/pages'
    return  prefixRoot ? `${root}/${dir}` : dir
  }

  getPages (reload) {
    if (this.pages && !reload) return this.pages
    const root = this.destinationRoot()
    const pagesDir = this._conf.dirs.pages || 'src/js/pages'
    this.pages = glob.sync(`${root}/${pagesDir}/*/`).reduce(function (all, page) {
      const name = $path.basename(page)
      all.push({
        name: name,
        value: name,
        short: name
      })
      return all
    }, [])
    if (!this.pages.length) {
      this.pages.push({
        name: '<pages>',
        value: '',
        short: ''
      })
    }
    return this.pages
  }
}
