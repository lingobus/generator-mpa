
import {
  apiurl,
  throws,
  makeGet,
  makePost
} from './_helper.js'

const api = {}
const _search = makeGet(apiurl('/<%=name%>/list'))
api.search = (currentPage, params, perPage) => {
  // HINT: transform query parameters
  params.pageNum = currentPage
  params.pageSize = perPage

  return _search(params)
    .then(data => {
      // HINT: transform response data
      data.items.map(it => {
        return normalizeUserInfo(it)
      })
      return data
    })
}

function normalizeUserInfo (usr) {
  // TODO: do normalization
  return usr
}

// TODO: change following config to meet your needs
api.SearchResultPage = {
  queryParamsConfig: [{
    name: 'id',
    caption: '<%=camelizedName%> Id',
    inputType: 'text'
  }, {
    name: 'name',
    caption: '<%=name%> Name',
    inputType: 'text'
  }, {
    name: 'time',
    caption: 'Register Time',
    inputType: 'date',
    type: 'daterange'
  }],
  formValidator (formData) {
    var ret = true
    // TODO: form input validation
    return ret
  }
}

export default api
