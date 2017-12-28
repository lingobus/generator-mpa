module.exports = {
  camelize: function (s) {
    return s.replace(/(^[a-z]|[-_]([a-z]))/g, function(_, a, b) {
      return (b || a).toUpperCase()
    })
  }
}