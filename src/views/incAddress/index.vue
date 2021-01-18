<template>
  <div class="app-container">
    <div class="filter-container">
      <!--<el-select-->
      <!--v-model="listQuery.label"-->
      <!--:placeholder="$t('table.search_label')"-->
      <!--clearable-->
      <!--class="filter-item"-->
      <!--style="width: 130px"-->
      <!--&gt;-->
      <!--<el-option v-for="item in fieldOptions" :key="item.key" :label="item.label" :value="item.key" />-->
      <!--</el-select>-->
      <!--<el-input-->
      <!--v-model="listQuery.search"-->
      <!--:placeholder="$t('table.search_message')"-->
      <!--style="width: 200px;"-->
      <!--class="filter-item"-->
      <!--@keyup.enter.native="handleFilter"-->
      <!--/>-->
      <!--<el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">-->
      <!--{{ $t(&#x27;table.search&#x27;) }}-->
      <!--</el-button>-->
      <!--<el-button-->
      <!--class="filter-item"-->
      <!--style="margin-left: 10px;"-->
      <!--type="primary"-->
      <!--icon="el-icon-edit"-->
      <!--@click="handleCreate"-->
      <!--&gt;-->
      <!--{{ $t(&#x27;table.add&#x27;) }}-->
      <!--</el-button>-->
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-delete" @click="handleDeleteCheck">
        {{ $t(&#x27;table.delete&#x27;) }}
      </el-button>
    </div>

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

      <el-table-column prop="_id" type="selection" align="center" width="50" fixed />
      <el-table-column :label="$t('HardWareWord.type')" align="center" prop="type" min-width="180px">
        <template slot-scope="scope">
          <span>{{ scope.row.type===0 ? $t('HardWareWord.equ'):scope.row.type===1?'LORA':scope.row.type===2?'HTTP':scope.row.type===4?'LORAWAN':scope.row.type===5?'云网关设备':scope.row.type===6?'TCP/UDP设备':'设备配置' }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('HardWareWord.code')" align="center" sortable="custom" prop="address" min-width="180px" />
      <el-table-column
        :label="$t('table.actions')"
        fixed="right"
        align="center"
        min-width="160px"
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
</template>

<script>

import { list, deleteOne, deleteMany } from '@/api/incAddress'
import Pagination from '@/components/Pagination' // 分页组件Secondary package based on el-pagination
import editForm from './edit'
import waves from '@/directive/waves' // Waves directive
export default {
  name: 'List',
  components: { Pagination, editForm },
  directives: { waves }, // 一个按钮的动画效果
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      },
      multipleSelection: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
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
      this.multipleSelection = val.map(v => v._id)
    },
    handleDelete(_id) { // 删除
      this.$confirm(this.$t('messages.delete'), this.$t('messages.title'), {
        confirmButtonText: this.$t('messages.confirm'),
        cancelButtonText: this.$t('messages.cancel'),
        type: 'warning'
      }).then(() => {
        deleteOne(_id).then(() => {
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
      if (this.multipleSelection.length <= 0) {
        this.$message({
          message: this.$t('messages.del_message'),
          type: 'warning'
        })
      } else {
        this.$confirm(this.$t('messages.delete'), this.$t('messages.title'), {
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
    }
  }
}
</script>
