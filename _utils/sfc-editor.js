// SFC parser
const parse = require('vue-loader/lib/parser')
// babel
const babylon = require('babylon')
const t = require('babel-types')
const traverse = require('babel-traverse').default
// misc
const prettier = require('prettier')
const fs = require('fs')

/**
 * SfcEditor
 * @param {String} srcPath vue file path
 */
function SfcEditor (srcPath) {
  this.srcPath = srcPath
  const src = fs.readFileSync(srcPath).toString()
  this.parts = parse(src)
}

/**
 * appendImport
 * @param  {String} importCode, import statement
 * @return {SfcEditor}
 */
SfcEditor.prototype.appendImport = function (importCode) {
  const js = this.parts.script.content
  const ast = babylon.parse(js, {
    sourceType: 'module'
  })
  var n
  traverse(ast, {
    ImportDeclaration: {
      exit(path) {
        n = path.node
      }
    }
  })
  if (n) {
    const inserLine = n.loc.start.line
    const code = js.split("\n")
    code.splice(inserLine, 0, importCode)
    parts.script.content = prettier.format(code.join("\n"))
  }
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
  const ast = babylon.parse(js, {
    sourceType: 'module'
  })
  var n
  traverse(ast, {
    ExportDefaultDeclaration: {
      exit(path1) {
        path1.traverse({
          ObjectProperty: {
            exit (path2) {
              if (path2.node.key.name === 'methods') {
                const props = path2.node.value.properties
                n = props[props.length - 1]
              }
            }
          }
        })
      }
    }
  })
  if (n) {
    const inserLine = n.loc.end.line
    const code = js.split("\n")
    code.splice(inserLine, 0, `,${name} (${args}) {\n// TODO:\n}`)
    parts.script.content = prettier.format(code.join("\n"))
  }
  return this
}

SfcEditor.prototype.generate = function () {

}

/**
 * save modified code back to vue file
 */
SfcEditor.prototype.save = function () {
  const newCode = this.generate()
  return fs.writeFileSync(this.srcPath, newCode)
}

module.exports = SfcEditor