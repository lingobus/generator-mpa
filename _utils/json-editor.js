const $fs = require('fs')
const $set = require('lodash/set')
const $get = require('lodash/get')

const defaultBabelRc = {
  "presets": ["es2015"],
  "plugins": ["transform-runtime"]
}

function JsonEditor(path, create, defaultJson) {
  if (!$fs.existsSync(path)) {
    $fs.writeFileSync(path, JSON.stringify(defaultJson || defaultBabelRc))
  }
  this.load(this.path = path)
}

JsonEditor.prototype = {
  constructor: JsonEditor,
  load () {
    this.json = JSON.parse($fs.readFileSync(this.path).toString())
    return this
  },
  set (path, val) {
    $set(this.json, path, val)
    return this
  },
  get (path, val) {
    return $get(this.json, path, val)
  },
  push (arrayKey, val) {
    if (arguments.length === 1) {
      val = arrayKey
      arrayKey = null
    }
    const ary = arrayKey == null ? this.json : this.get(arrayKey)
    if (Array.isArray(ary)) {
      if (ary.indexOf(val) < 0) ary.push(val)
    } else {
      this.set(arrayKey + '.0', val)
    }
    return this
  },
  save (callback) {
    var json = JSON.stringify(this.json, null, 2)
    if (typeof callback === 'function') {
      json = callback(json)
    }
    $fs.writeFileSync(this.path, json, 'utf8')
  }
}

module.exports = JsonEditor