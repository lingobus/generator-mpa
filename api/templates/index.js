import {
  apiurl,
  makeGet,
  makePost
} from './_helper.js'

const api = {}

// constants
api.ItemPerPage = 20

// simple api
api.list = makeGet(apiurl(`/<%=name%>/list`))
api.create = makePost(apiurl(`/<%=name%>/create`))

// validate params
const _delete = makeGet(apiurl(`/<%=name%>/delete`))
api.delete = function (id) {
  if (id != null) return _delete({id})
}

// transform response
const _find = makeGet(apiurl(`/<%=name%>/find`))
api.find = function (params) {
  return _find(params).then(e => {
    e.list.forEach(it => it.fullName = it.firstName + ' ' + it.lastName)
  })
}

export default api
