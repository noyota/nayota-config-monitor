<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="listQuery.label"
        :placeholder="$t('table.search_label')"
        clearable
        class="filter-item"
        style="width: 130px"
      >
        <el-option v-for="item in fieldOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-input
        v-model="listQuery.search"
        :placeholder="$t('table.search_message')"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t(&#x27;table.search&#x27;) }}
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        {{ $t(&#x27;table.add&#x27;) }}
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-delete" @click="handleDeleteCheck">
        {{ $t(&#x27;table.delete&#x27;) }}
      </el-button>
    </div>
    <div class="tree_style">
      <el-input
        v-model="filterText"
        :placeholder="$t('rules.filter_text')"
      />
      <el-tree
        ref="tree2"
        :data="treedata|setChildNullArray"
        :props="defaultProps"
        default-expand-all
        :filter-node-method="filterNode"
        @node-click="handleNodeClick"
      />
    </div>
    <div style="width:84%;float:right;">
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        @sort-change="sortChange"
        @selection-change="handleSelectionChange"
      >
        <el-table-column prop="_id" type="selection" align="center" width="50px" fixed />
        <el-table-column prop="name" fixed="left" :label="$t('table.name')" sortable="custom" align="center" width="180" />
        <el-table-column
          prop="wordType"
          :label="$t('word.wordType')"
          sortable="custom"
          align="center"
          min-width="150px"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.wordType?scope.row.wordType.name:'' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="key" :label="$t('word.key')" align="center" width="80" />
        <el-table-column prop="value" :label="$t('word.value')" align="center" width="120" />
        <!--<el-table-column prop="flag" :label="$t('word.state')" sortable="custom" align="center" width="100" />-->
        <el-table-column prop="sort" :label="$t('table.sort')" sortable="custom" align="center" width="80" />
        <el-table-column prop="remark" :label="$t('table.remarks')" sortable="custom" align="center" min-width="180" />
        <el-table-column
          :label="$t('table.actions')"
          fixed="right"
          align="center"
          min-width="140"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">
              {{ $t(&#x27;table.edit&#x27;) }}
            </el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row._id)">
              {{ $t(&#x27;table.delete&#x27;) }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getList"
      />
      <edit-form ref="EditFrom" @reload="getList" />
    </div>
  </div>
</template>

<script>
import { list, deleteOne, deleteMany } from '@/api/words'
import { list as wordTypeList } from '@/api/wordTypes'
import Pagination from '@/components/Pagination' // 分页组件Secondary package based on el-pagination
import editForm from './edit'
import waves from '@/directive/waves' // Waves directive

export default {
  name: 'WordList',
  components: { Pagination, editForm },
  directives: { waves }, // 一个按钮的动画效果
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      fieldOptions: [
        { key: 'name', label: this.$t('table.name') }
      ],
      listQuery: {
        label: 'name',
        search: '',
        page: 1,
        limit: 10,
        sort: '_id',
        wordType: undefined
      },
      treeQuery: {
        fieldName: 'name' // 字段名称 可指定显示字段
      },
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      filterText: '',
      treedata: [],
      multipleSelection: []
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },
  created() {
    this.getList()
    this.getTreeData()
  },
  methods: {
    getList() {
      this.listLoading = true
      list(this.listQuery).then(response => {
        this.list = response.data.rows
        this.total = response.data.total
        this.listLoading = false
      })
    },
    getTreeData() {
      wordTypeList({}).then(response => {
        this.treedata.push({ name: this.$t('word.treeName'), children: response.data.rows })
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    sortChange(data) { // 排序
      const { prop, order } = data
      if (order === 'ascending') {
        this.listQuery.sort = prop
      } else {
        this.listQuery.sort = '-' + prop
      }
      this.handleFilter()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val.map(v => v._id)
    },
    handleDelete(_id) { // 删除
      deleteOne(_id).then(() => {
        this.getList()
        this.$notify({
          title: this.$t('messages.success_title'),
          message: this.$t('messages.del_success'),
          type: 'success',
          duration: 2000
        })
      })
    },
    handleDeleteCheck() {
      deleteMany(this.multipleSelection).then(() => {
        this.getList()
        this.$notify({
          title: this.$t('messages.success_title'),
          message: this.$t('messages.del_check_success'),
          type: 'success',
          duration: 2000
        })
      })
    },
    handleUpdate(row) {
      this.$refs.EditFrom.handleUpdate(row)
    },
    handleCreate() {
      this.$refs.EditFrom.handleCreate()
    },
    handleNodeClick(data) {
      if (data.children === undefined && data._id !== undefined) {
        this.listQuery.wordType = data._id
      } else {
        this.listQuery.wordType = undefined
      }
      this.getList()
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    }
  }
}
</script>
