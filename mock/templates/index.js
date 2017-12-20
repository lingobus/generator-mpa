var router = require('express').Router()

const data = {
  items: [{id:1},{id:2}]
}

const json = {
  "code": 200,
  "data": data,
  "msg": "OK",
  "success": true
}

router.get('/list', function (req, res) {
  res.set('Content-Type', 'application/json')
  res.send(json)
})

module.exports = router
