const $path = require('path')
const SfcEditor = require('./sfc-editor.js')
const editor = new SfcEditor($path.resolve(__dirname, '../page/templates/index.vue'))
editor.appendImport('//\nimport Dialog from "./dialog.vue"')
editor.appendMethod('hehe', 'a,b,c')
editor.appendComponent('CreateTeacherDialog')
editor.addDataFields({
  isVisible: false,
  Pi: 3.14,
  pattern: /https?/gi,
  name: 'string',
  f: function (a,b,c) {return a+b+c+123}
})
console.log(editor.source)