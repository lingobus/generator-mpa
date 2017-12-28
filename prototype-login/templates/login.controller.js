module.exports = function (router) {
  router.get('/login', function (req, res) {
    res.render('login')
  })
}