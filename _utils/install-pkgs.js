const $fs = require('fs')
module.exports = function install (generator, pkgs) {
  const notInstall = pkgs.reduce(function (all, pkg) {
    const pkgPath = generator.destinationPath('node_modules/' + pkg)
    if(!$fs.existsSync(pkgPath)) all.push(pkg)
    return all
  }, [])
  if (notInstall.length) {
    generator.yarnInstall(notInstall)
  }
}