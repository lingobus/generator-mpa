const path = require('path')
const Generator = require('yeoman-generator')
const download = require('download-git-repo')
const ora = require('ora')
require('colors')

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
  }

  prompting() {

    const prompts = [{
      type: 'input',
      name: 'url',
      message: 'Please input user/repo on github:',
    }];

    return this.prompt(prompts).then(answers => {
      this.url = answers.url;
    });
  }

  writing() {
    if (this.url.indexOf('/') <= 0) {
      this.log('There is no slash in the input! name/repo')
    } else {
      const [user, repo] = this.url.split('/')
      if (repo == null || repo.length === 0) {
        this.log('repo name is empty!')
      } else {
        this.repo = repo
        this._downloadAndGenerate(this.url)
      }
    }
  }

  _downloadAndGenerate(template) {
    const dir = this.repo.replace('generator-', '')
    const tmp = path.resolve(__dirname, `../${dir}`)

    const spinner = ora(`Downloading template ${this.url} into ${tmp}`)
    spinner.start()
    download(template, tmp, {
      clone: false
    }, function(err) {
      spinner.stop()
      if (err) console.log('Failed to download repo ' + template + ': ' + err.message.trim())
    })
  }
}