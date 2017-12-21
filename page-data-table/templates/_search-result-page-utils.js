/**
 * Search-result page mixin
 *
 * properties required when using this mixin:
 *   this.API.search(currentPage, queryParams, perPage)
 *   this.Page.formValidator(formData)
 * methods required when using this mixin:
 *   function search(pageNumber)
 */
import Settings from 'api/_settings.api.js'

const mixin = {
  mounted () {
    // restore perPage setting from
    const perPage = Settings.get('ui.list.perpage', 10, parseInt)
    if (!isNaN(perPage)) {
      this.perPage = perPage
    } else {
      Settings.del('ul.list.perpage')
    }
  },
  watch: {
    perPage (val) {
      return Settings.set('ui.list.perpage', val)
    }
  },
  methods: {
    /**
     * page changed by paginator
     * @param  {Number} page new page
     */
    onPageChanged (page) {
      this.currentPage = page
      return this.search(page)
    },
    /**
     * search
     * @param  {Number} page
     * @param  {String} defaultErroMsg
     * @param  {Function} onSucc
     */
    doSearch (page, defaultErroMsg, onSucc) {
      this.currentPage = page || 1
      this.loading = true
      this.API.search(this.currentPage, this.queryParams, this.perPage).then(data => {
        if (typeof onSucc === 'function') {
          onSucc(data)
        } else if (onSucc === true) {
          this.tableData = data.items || []
          this.totalItem = data.total
        }
      })
      .finally(_ => this.loading = false)
    },
    /**
     * validate add/edit dialog form data
     * @return {Boolean} return true if pass validation
     */
    doValidate () {
      const error = this.Page.formValidator(this.dialogData)
      if (error) {
        this.$error(error)
        return false
      } else {
        return true
      }
    },
    /**
     * refresh search result
     */
    refresh () {
      this.search(this.currentPage)
    },

    onInputChanged() {
      // interface for querybar input change
    }
  }
}

function getCommonData (data) {
  return Object.assign({
    loading: false,
    tableData: [],
    columns: [],
    queryParamsConfig: {},
    queryParams: {},
    inputStatesDisabled: {},
    queryBarButtons: [],
    perPage: 10,
    currentPage: 1,
    totalItem: 0
  }, data || {})
}


export default {
  mixin,
  getCommonData
}
