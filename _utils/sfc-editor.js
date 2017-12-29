// SFC parser
const parse = require('vue-loader/lib/parser')
// babel
const babel = require('babel-core')
const t = require('babel-types')
const template = require('babel-template')
// misc
const fs = require('fs')

/**
 * SfcEditor
 * @param {String} srcPath vue file path
 */
function SfcEditor (srcPath) {
  this.srcPath = srcPath
  const src = this.source = fs.readFileSync(srcPath).toString()
  this.parts = parse(src)
}

/**
 * appendImport
 * @param  {String} importCode, import statement
 * @return {SfcEditor}
 */
SfcEditor.prototype.appendImport = function (importCode) {
  const js = this.parts.script.content
  this.parts.script.content = babel.transform(js, {
    plugins: [{
      visitor: {
        Program(path, state) {
          const body = path.get('body')
          const importDecl = template(importCode, {sourceType: 'module'})()

          if (!tryInsert(body, 'isImportDeclaration', 'After', importDecl)) {
            if (!tryInsert(body, 'isStatement', 'Before', importDecl)) {
              throw new Error('Can not found export default declaration!')
            }
          }
        }
      }
    }]
  }).code
  this._update('script')
  return this
}

/**
 * appendMethod
 * @param  {String} name method name
 * @param  {String} args comma separated args
 * @return {SfcEditor}
 */
SfcEditor.prototype.appendMethod = function (name, args) {
  const js = this.parts.script.content
  babel.transform(js, {
    plugins: [{
      visitor: {
        ExportDefaultDeclaration(path, state) {
          if(t.isObjectExpression(path.node.declaration)) {
            const props = path.node.declaration.properties
            const methodsPath = props.filter(p => t.isObjectProperty(p) && p.key.name === 'methods').shift()
            if (methodsPath) {
              const m = t.objectMethod('method', t.Identifier(name), [], t.BlockStatement([]))
              methodsPath.value.properties.push(m)
            }
          }
        }
      }
    }]
  })
  this._update('script')
  return this
}

/**
 * update this.parts from transformed content
 * @param  {String} which ['styles' | 'template' | 'script']
 * @return {SfcEditor}
 */
SfcEditor.prototype._update= function (which) {
  var src = this.source
  const pos = this.parts[which]
  var before = src.substring(0, pos.start)
  var after = src.substring(pos.end)

  if (which === 'script') {
    let s = this.parts.script
    s.content = s.content
      .split('\n')
      .filter(line => !line.match(/^\/\/$/)).join('\n').trim()
  }

  before = appendNewline(before)
  after = prependNewline(after)

  src = [before, this.parts[which].content, after].join('')
  this.parts = parse(this.source = src)
  return this
}


/**
 * save modified code back to vue file
 */
SfcEditor.prototype.save = function () {
  const newCode = this.generate()
  return fs.writeFileSync(this.srcPath, newCode)
}

function tryInsert(body, insertPointType, where, ast) {
  const insertPoint = body.filter(p => p[insertPointType]()).pop()
  if (insertPoint) {
    insertPoint['insert' + where](ast)
    return true
  }
  return false
}

function appendNewline (s) {
  if (s[s.length - 1] != '\n') return s + '\n'
}

function prependNewline (s) {
  if (s[0] != '\n') return '\n' + s
}

module.exports = SfcEditor