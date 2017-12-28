<template lang="jade">
  mixin paginator ()
    el-row.paginator-row
      el-select.per-page(v-model="perPage", @change="refresh", size="small", style="float:right")
        el-option(:value="10", label="10/page")
        el-option(:value="20", label="20/page")
        el-option(:value="50", label="50/page")
        el-option(:value="100", label="100/page")
      el-pagination(
        layout="total, prev, pager, next, jumper",
        :current-page.sync="currentPage",
        :page-size="perPage",
        :total="totalItem",
        @current-change="onPageChanged")

  .<%=dir%>-page
    //- breadcrumb
    el-breadcrumb(separator='/')
      el-breadcrumb-item Location:
      el-breadcrumb-item(:to="{ path: '/<%=dir%>' }") <%=camelizedName%>

    //- query bar
    query-bar(id="field-query-bar",
      ref="querybar",
      :query-params="queryParams",
      :input-states-disabled="inputStatesDisabled",
      :query-params-config="queryParamsConfig",
      :buttons="queryBarButtons",
      :search-on-enterKey="true",
      :on-button-clicked="onQuerybarButtonClicked")

    //- paginator
    +paginator()

    //- data table
    el-table(:data="tableData", style="width:100%", stripe="stripe", v-loading="loading")

      //- simple row
      el-table-column(label="<%=dir%> Id", prop="<%=dir%>Id", width="80")

      //- row with template
      el-table-column(label="Name")
        template(scope)
          a.link(:href="`/<%=dir%>/${scope.row.<%=dir%>Id}`", :label="scope.row.name", v-text="scope.row.name")

      //- row with for-loop inside
      el-table-column(label="Items")
        template(scope)
          .child.link(v-for="c in scope.row.items")
            a(:href="`/item/${c.id}`", v-text="c.name")
    +paginator()
</template>

<script>
// element-ui components
import ElBreadcrumb from 'element-ui/lib/breadcrumb'
import ElBreadcrumbItem from 'element-ui/lib/breadcrumb-item'
import ElPagination from 'element-ui/lib/pagination'
import ElTable from 'element-ui/lib/table'
import ElTableColumn from 'element-ui/lib/table-column'
import ElRow from 'element-ui/lib/row'
import ElSelect from 'element-ui/lib/select'
import ElOption from 'element-ui/lib/option'
import ElTooltip from 'element-ui/lib/tooltip'
import ElButton from 'element-ui/lib/button'

// custom components
import QueryBar from 'components/query-bar.vue'

// misc
import SearchResultPageUtils from 'utils/_search-result-page-utils.js'
import MessageMixin from 'utils/_elementui-mixin.js'

// TODO: this is a demo api
// change to your *.api.js files
import API from 'api/_mpa-<%=dir%>.api.js'

const Page = API.SearchResultPage

export default {
  name: 'Users',
  mixins: [
    MessageMixin,
    SearchResultPageUtils.mixin,
    QueryBar.Mixins.Search
  ],
  components: {
    ElButton,
    ElBreadcrumb,
    ElBreadcrumbItem,
    ElPagination,
    ElTable,
    ElTableColumn,
    ElRow,
    ElSelect,
    ElOption,
    ElTooltip,
    QueryBar
  },
  data () {
    return SearchResultPageUtils.getCommonData({
      queryParamsConfig: Page.queryParamsConfig,
      queryBarButtons: QueryBar.Buttons
    })
  },
  mounted () {
    this.API = API
    this.Page = API.SearchResultPage
    this.search()
  },
  methods: {
    search (page) {
      this.doSearch(page, 'Loading <%=dir%> list failed!', true)
    }
  }
}
</script>

<style lang="stylus" scoped>
.link
  text-decoration: underline
.content .el-breadcrumb
  margin-bottom: 1em
.el-row.paginator-row
    margin: 1em 0
</style>

<style lang="stylus">
.<%=dir%>-page
  .el-table th > .cell
      white-space nowrap
</style>

