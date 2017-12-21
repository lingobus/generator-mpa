var router = require('express').Router()

const data = {
  items: [
  ]
}
for (var i = 1; i < 210; i++) {
  var it = {id: i, name: 'name' + i, items: []}

  it.items.push({id: 100 + i,name: 'item' + 100 + i})
  if (i % 4 === 0) {
    it.items.push({id: 100 + i + 1,name: 'item' + (100 + i + 1)})
  }
  data.items.push(it)
}

const json = {
  "code": 200,
  "msg": "OK",
  "success": true
}

router.get('/list', function (req, res) {
  res.set('Content-Type', 'application/json')
  const n = parseInt(req.query.pageNum, 10) - 1
  const s = parseInt(req.query.pageSize, 10)
  console.log('pageNumber=',n,'pageSize',s)
  const id = parseInt(req.query.id)
  var items = data.items.slice(0)
  if (!isNaN(id)) {
    items = items.filter(it => it.id === id)
  }
  var name = req.query.name
  if (name) {
    items = items.filter(it => it.name.indexOf(name) >=0)
  }
  json.data = {
    items: items.slice(n * s, n * s + s),
    total: items.length
  }
  res.send(json)
})

module.exports = router
