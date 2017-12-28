module.exports = function (router) {
  router.get('<%=url%>', function (req, res) {
    res.render('<%=tpl%>')
  })
}