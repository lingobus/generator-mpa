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
              throw new Error('sfc-editor:Can not found export default declaration!')
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
  this.parts.script.content = babel.transform(js, {
    plugins: [{
      visitor: {
        ExportDefaultDeclaration(path, state) {
          if(t.isObjectExpression(path.node.declaration)) {
            const props = path.node.declaration.properties
            const methodsNode = props.filter(p => t.isObjectProperty(p) && p.key.name === 'methods').shift()
            const argus = args.split(',').map(arg => t.Identifier(arg))
            const m = t.objectMethod('method', t.Identifier(name), argus, t.BlockStatement([]))
            if (methodsNode) {
              methodsNode.value.properties.push(m)
            } else {
              props.push(t.objectProperty(t.Identifier('methods'), t.objectExpression([m])))
            }
          } else {
            throw new Error('sfc-editor:export default declaration is not a object expression')
          }
        }
      }
    }]
  }).code
  this._update('script')
  return this
}

SfcEditor.prototype.appendComponent = function (tag, comp) {
  if (arguments.length === 1) comp = tag
  const js = this.parts.script.content
  this.parts.script.content = babel.transform(js, {
    plugins: [{
      visitor: {
        ExportDefaultDeclaration(path) {
          if(t.isObjectExpression(path.node.declaration)) {
            const props = path.node.declaration.properties
            const node = props.filter(p => t.isObjectProperty(p) && p.key.name === 'components').shift()
            const c = t.ObjectProperty(t.StringLiteral(tag), t.Identifier(comp))
            if (node) {
              node.value.properties.push(c)
            } else {
              props.push(t.ObjectProperty(t.Identifier('components'), t.objectExpression([c])))
            }
          } else {
            throw new Error('sfc-editor:export default declaration is not a object expression')
          }
        }
      }
    }]
  }).code
  this._update('script')
  return this
}


SfcEditor.prototype.addDataFields = function (fields) {
  const js = this.parts.script.content
  this.parts.script.content = babel.transform(js, {
    plugins: [{
      visitor: {
        ExportDefaultDeclaration(path) {
          if(t.isObjectExpression(path.node.declaration)) {
            const props = path.node.declaration.properties
            var node = props.filter(p => t.isObjectMethod(p) && p.key.name === 'data').shift()
            if (!node) {
              node = props.filter(p => t.isObjectProperty(p) && p.key.name === 'data').shift()
              if (node) {
                throw new Error('sfd-editor:data should be a function, got an object ')
              }
            }
            const retSta = node.body.body.filter(n => t.isReturnStatement(n)).shift()
            if (!retSta || retSta.argument === null || !t.isObjectExpression(retSta.argument)) {
              throw new Error('sfc-editor:data function did not return an object!')
            }
            const retObjProps = retSta.argument.properties
            for(let k in fields) {
              let v = fields[k]
              const val = getNodeFromValue(v)
              retObjProps.push(t.ObjectProperty(t.Identifier(k), val))
            }
          } else {
            throw new Error('sfc-editor:export default declaration is not a object expression')
          }
        }
      }
    }]
  }).code
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

/**
 * create babel node from given value
 * @param  {any} val
 * @return {BabelNode}
 * @remark
 * RegExpLiteral
 *   | NullLiteral
 *   | StringLiteral
 *   | BooleanLiteral
 *   | NumericLiteral
 */
function getNodeFromValue (val) {
  const type = typeof val
  if (val === null || type === 'undefined') {
    return t.NullLiteral()
  } else if (type === 'number' || val instanceof Number) {
    return t.NumericLiteral(val)
  } else if (type === 'boolean' || val instanceof Boolean) {
    return t.BooleanLiteral(val)
  } else if (type === 'string' || val instanceof String) {
    return t.StringLiteral(val)
  } else if (val instanceof RegExp) {
    return t.RegExpLiteral(val.source, val.flags)
  } else if (type === 'function') {
    // anonymouse function expression can not be parsed
    // make a var declaration from it
    const code = 'var a = ' + val.toString()
    const ast = template(code, {sourceType: 'module'})()
    return ast.declarations[0].init
  }
  return t.NullLiteral()
}

module.exports = SfcEditor