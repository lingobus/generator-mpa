const Generator = require('../_utils/base-generator.js')
const JsonEditor = require('../_utils/json-editor.js')

module.exports = class extends Generator {
  // constructor(args, opts) {
  //   super(args, opts)
  // }
  prompting() {
    const prompts = [{
      type: 'input',
      name: 'dir',
      message: 'Please input the page dir name, for example: user',
    }, {
      type: 'input',
      name: 'name',
      message: 'Please input page file name, for example: Users',
    }, {
      type: 'confirm',
      name: 'addToSidebar',
      message: 'Add to sidebar menu?'
    }]

    return this.prompt(prompts).then(answers => {
      this.answers = answers
    })
  }

  writing() {
    const locals = this.answers
    const name = this.answers.name // uppercased
    const dir = this.answers.dir
    var camelizedName = locals.camelizedName = this.camelize(name)

    this.cp([
      // components
      ['page.vue', `src/js/pages/${dir}/${camelizedName}.vue`, locals],
      ['query-bar.vue', `src/js/components/query-bar.vue`],
      ['dynamic-form-item.vue', `src/js/components/dynamic-form-item.vue`],

      // utils
      ['_search-result-page-utils.js', `src/js/utils/_search-result-page-utils.js`],

      // apis
      ['_mpa-demo.api.js', 'src/js/api/_mpa-demo.api.js'.replace('demo', dir), locals],

      // mock
      ['mock.js', `mock/${dir}.js`, locals],
    ])

    // install dependencies
    this.installPkgs([
      "babel-plugin-syntax-jsx",
      "babel-plugin-transform-vue-jsx"
    ])

    this.log(`Adding transform-vue-js plugin to .babelrc:`.red.bold)
    this.babelrc.push('plugins', 'transform-vue-jsx')
    this.babelrc.save()


    this.log(`Add following plugins into mock/index.js:`.red.bold)
    this.log(`
      router.use(apiurl('/${dir}'), require('./${dir}'))
    `.green.bold)

    this.log(`Add following code to _routes.js`.red.bold)
    this.log(`
      import ${camelizedName} from './pages/${dir}/${camelizedName}.vue'
      ...
      export default [
        { path: '/${dir}', component: ${camelizedName}, props: {} }
      ]
    `.green.bold)

    this.log(`You may want to edit menu item icon in src/js/components/sidebar.json`.red.bold)
    this.log(`see http://fontawesome.io/icons/ for more icons`.red.bold)
    if (this.answers.addToSidebar) {
      const editor = new JsonEditor(this.destinationPath('src/js/components/sidebar.json'), true, [])
      if (!editor.json.some(it => it.to == `/${dir}`)) {
        editor.push({
          "to": `/${dir}`,
          "content": camelizedName,
          "icon": "question",
          "classList": [dir]
        }).save()
      } else {
        this.log(`There already have a menu item point to /${dir}!`.red)
      }
    }

    this.log(`Following url should be "/${dir}"!`.red)
    this.composeWith(require.resolve('generator-mpa/controller', {
      url: `/${dir}`,
      tpl: 'index',
      name: dir
    }))
  }
}