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
        {{ $t(&#x27;wordType.addFirst&#x27;) }}
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-delete" @click="handleDeleteCheck">
        {{ $t(&#x27;table.delete&#x27;) }}
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      row-key="_id"
      @sort-change="sortChange"
      @selection-change="handleSelectionChange"
    >
      <el-table-column prop="_id" type="selection" align="center" width="50px" fixed />
      <el-table-column prop="name" :label="$t('table.name')" sortable="custom" align="center" min-width="300" />
      <el-table-column prop="sort" :label="$t('table.sort')" sortable="custom" align="center" min-width="100" />
      <el-table-column prop="flag" :label="$t('wordType.state')" sortable="custom" align="center" min-width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.flag"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </template>
      </el-table-column>
      <el-table-column prop="remark" :label="$t('table.remarks')" sortable="custom" align="center" min-width="280" />
      <el-table-column :label="$t('table.actions')" fixed="right" align="center" min-width="350">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="addMenuItem(scope.row,'brother')">
            {{ $t(&#x27;wordType.addT&#x27;) }}
          </el-button>
          <el-button size="mini" type="info" @click="addMenuItem(scope.row,'children')">
            {{ $t(&#x27;wordType.addC&#x27;) }}
          </el-button>
          <el-button size="mini" type="primary" @click="handleUpdate(scope.row)">
            {{ $t(&#x27;table.edit&#x27;) }}
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">
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
</template>

<script>
import { list, deleteOne, deleteMany, create, updateOne } from '@/api/wordTypes'
import Pagination from '@/components/Pagination' // 分页组件Secondary package based on el-pagination
import editForm from './edit'
import waves from '@/directive/waves' // Waves directive

export default {
  name: 'WordTypeList',
  components: { Pagination, editForm },
  directives: { waves }, // 一个按钮的动画效果
  data() {
    return {
      tableKey: 0,
      list: [],
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
        sort: '_id'
      },
      filterText: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      treeData: [],
      treeQuery: {
        fieldName: 'name', // 字段名称 可指定显示字段
        allName: this.$t('wordType.allName') // 用于显示全部
      },
      createTemp: {
        sort: 1,
        flag: true
      },
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
    addBrother(row, data) {
      if (row && row._parent) {
        row._parent.children.push(data)
      } else {
        this.list.push(data)
      }
    },
    addChild(row, data) {
      if (!row.children) {
        this.$set(row, 'children', [])
      }
      row.children.push(data)
    },
    getList() {
      this.listLoading = true
      this.list = []
      this.listQuery.level = 0
      list(this.listQuery).then(response => {
        this.list = response.data.rows
        this.total = response.data.total
        this.listLoading = false
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
      this.multipleSelection = val.map(v => v)
    },
    handleDelete(row) { // 删除
      let remind = ''
      if (row.level < 2) {
        remind = this.$t('messages.deleteAll')
      } else {
        remind = this.$t('messages.delete')
      }
      this.$confirm(remind, this.$t('messages.title'), {
        confirmButtonText: this.$t('messages.confirm'),
        cancelButtonText: this.$t('messages.cancel'),
        type: 'warning'
      }).then(() => {
        deleteOne(row._id).then(() => {
          this.getList()
          this.$notify({
            title: this.$t('messages.success_title'),
            message: this.$t('messages.del_success'),
            type: 'success',
            duration: 2000
          })
        })
      }).catch(() => {

      })
    },
    handleDeleteCheck() {
      let remind = ''
      for (let i = 0; i < this.multipleSelection.length; i++) {
        if (this.multipleSelection[i].level < 2) {
          remind = this.$t('messages.deleteAll')
        } else {
          remind = this.$t('messages.delete')
        }
      }
      if (this.multipleSelection.length <= 0) {
        this.$message({
          message: this.$t('messages.del_message'),
          type: 'warning'
        })
      } else {
        this.$confirm(remind, this.$t('messages.title'), {
          confirmButtonText: this.$t('messages.confirm'),
          cancelButtonText: this.$t('messages.cancel'),
          type: 'warning'
        }).then(() => {
          deleteMany(this.multipleSelection).then(() => {
            this.getList()
            this.$notify({
              title: this.$t('messages.success_title'),
              message: this.$t('messages.del_check_success'),
              type: 'success',
              duration: 2000
            })
          })
        }).catch(() => {

        })
      }
    },
    handleUpdate(row) {
      this.$refs.EditFrom.handleUpdate(row)
    },
    handleCreate() {
      this.$refs.EditFrom.handleCreate()
    },
    getTreeData() {
      list(this.treeQuery).then(response => {
        this.treeData = response.data.rows
        this.listLoading = false
      })
    },
    handleNodeClick(data) {
      this.listQuery.control = data._id
      this.getList()
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    addMenuItem(row, type) {
      const data = { ...this.createTemp }
      if (type === 'children') {
        if (row.level < 2) {
          data.level = row.level + 1
          data.name = row.name + '_' + data.level
          // this.addChild(row, data)
          create({ ...data }).then((res) => {
            data._id = res.data._id
            this.addChild(row, data)
            const children = new Set(row.children.map(child => child._id))
            children.add(res.data._id)
            updateOne({ _id: row._id, children }).then((res) => {
              this.getList()
            })
          })
        } else {
          this.$message({
            message: this.$t('wordType.message'),
            type: 'warning'
          })
        }
      }
      if (type === 'brother') {
        this.addBrother(row, data)
        if (row === undefined || row._parent === null) {
          data.level = 0
        } else {
          data.level = row.level
        }
        data.name = row.name + '_' + data.level
        create(data).then((res) => {
          data._id = res.data._id
          if (row === undefined || row._parent === null && row._parent === undefined) {
            const children = new Set(row._parent.children.map(child => child._id))
            children.push(res.data._id)
            updateOne({ _id: row._parent._id, children }).then((res) => {
              this.getList()
            })
            return
          }
        })
      }
    }
  }
}
</script>
<style scoped>
  .mini {
    width: 70px
  }
</style>
