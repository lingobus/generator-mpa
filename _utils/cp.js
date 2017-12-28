module.exports = function cp (generator, config) {
  config.forEach(function (cfg) {
    if (typeof cfg[0] === 'boolean') {
      if (!cfg.shift()) return
    }
    const from = generator.templatePath(cfg[0])
    const to = generator.destinationPath(cfg[1])
    const locals = cfg[2]
    const copyMethod = locals ? 'copyTpl' : 'copy'
    generator.fs[copyMethod](from, to, locals)
  })
}