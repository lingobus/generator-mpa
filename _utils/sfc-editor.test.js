const $path = require('path')
const SfcEditor = require('./sfc-editor.js')
const editor = new SfcEditor($path.resolve('../page/templates/index.vue'))
// editor.appendImport('//\nimport Dialog from "./dialog.vue"')
editor.appendMethod('hehe', 'a,b,c')
console.log(editor.source)