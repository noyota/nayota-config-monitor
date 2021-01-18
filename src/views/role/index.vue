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
        {{ $t('table.search') }}
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        {{ $t('table.add') }}
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-delete" @click="handleDeleteCheck">
        {{ $t('table.delete') }}
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

      <el-table-column :label="$t('role.name')" prop="name" width="180px" />
      <el-table-column :label="$t('table.sort')" prop="sort" width="80px" />
      <el-table-column :label="$t('table.remarks')" prop="desc" min-width="180px" />
      <el-table-column prop="createdAt" :label="$t('table.createdAt')" sortable="custom" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.createdAt | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="updatedAt" :label="$t('table.updatedAt')" sortable="custom" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.updatedAt | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.actions')"
        fixed="right"
        align="center"
        width="140"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">
            {{ $t('table.edit') }}
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row._id)">
            {{ $t('table.delete') }}
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

    <!-- 表单 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="50%">
      <fieldset class="fieldset-dialog">
        <el-form
          ref="dataForm"
          :rules="rules"
          :model="temp"
          label-position="left"
          label-width="100px"
          style="padding-top:10px"
        >
          <el-form-item :label="$t('role.name')" prop="name">
            <el-input v-model="temp.name" :placeholder="$t('role.inputName')" />
          </el-form-item>
          <el-form-item :label="$t('table.sort')" prop="sort">
            <el-input-number v-model="temp.sort" :placeholder="$t('table.inputSort')" type="number" />
          </el-form-item>
          <el-form-item label="Menus">
            <el-tree
              ref="tree"
              :check-strictly="checkStrictly"
              :data="routes"
              :props="defaultProps"
              show-checkbox
              node-key="_id"
              class="permission-tree"
              :default-checked-keys="checkedKeys"
            >
              <span slot-scope="{ node, data}" class="custom-tree-node">
                <span>{{ data.name+(data.method?' '+data.method:'') }}</span>
              </span>
            </el-tree>
          </el-form-item>
          <el-form-item :label="$t('table.remarks')" prop="desc">
            <el-input v-model="temp.desc" type="textarea" />
          </el-form-item>
        </el-form>
      </fieldset>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button type="primary" :loading="dialogLoading" @click="dialogStatus==='create'?createData():updateData()">
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { list, create, deleteOne, deleteMany, updateOne } from '@/api/roles'
import { updateRoles } from '@/api/router'
import * as routerApi from '@/api/router'
import Pagination from '@/components/Pagination' // 分页组件Secondary package based on el-pagination
import waves from '@/directive/waves' // Waves directive

export default {
  name: 'RoleList',
  components: { Pagination },
  directives: { waves }, // 一个按钮的动画效果
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        label: 'name',
        search: '',
        page: 1,
        limit: 10,
        sort: '_id',
        username: undefined
      },
      fieldOptions: [
        { label: this.$t('role.name'), key: 'name' },
        { label: this.$t('role.remarks'), key: 'remarks' }
      ], // 搜索字段
      textMap: {
        update: this.$t('dialog.update'),
        create: this.$t('dialog.create')
      },
      multipleSelection: [],
      dialogFormVisible: false,
      dialogStatus: '',
      temp: {},
      createTemp: { // 临时表单
        _id: undefined,
        name: '',
        sort: '',
        desc: ''
      },
      rules: {
        name: [{ required: true, message: this.$t('rules.name'), trigger: 'blur' }],
        sort: [{ type: 'number', required: true, message: this.$t('role.sortMessage'), trigger: 'blur' }
        ]
      }, // 表单验证
      checkStrictly: false,
      routes: [],
      checkedKeys: [],
      defaultProps: {
        children: 'children',
        label: '_id'
      },
      dialogLoading: false
    }
  },
  computed: {
    routesData() {
      return this.routes
    }
  },
  created() {
    this.getList()
    this.getRoutes()
  },
  methods: {
    async getRoutes() {
      const res = await routerApi.list({ level: 0 })
      this.routes = res.data
    },
    getList() {
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
    handleCreate() { // 新建
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.temp = { ...this.createTemp }
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.dialogLoading = true
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          create(this.temp).then(() => {
            this.getList()
            this.getRoutes()
            this.dialogFormVisible = false
            this.dialogLoading = false
            this.$notify({
              title: this.$t('messages.success_title'),
              message: this.$t('messages.create_success'),
              type: 'success',
              duration: 2000
            })
          })
        } else {
          this.dialogLoading = false
        }
      })
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
        })
      }
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: this.$t('messages.modify_success'),
        type: 'success'
      })
      row.status = status
    },
    handleUpdate(row) {
      this.temp = { ...row } // 复制一个
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(this.generateRouteRoles(this.routes, row._id))
        this.$refs['dataForm'].clearValidate()
      })
    },
    generateRouteRoles(router, roleId) {
      let data = []
      router.forEach(route => {
        route = { ...route }
        route.roles = route.roles.map(role => role._id)
        if (route.roles.includes(roleId)) {
          data.push(route._id)
        }
        if (route.children) {
          const arr = this.generateRouteRoles(route.children, roleId)
          data = [...data, ...arr]
        }
      })
      return data
    },
    updateData() { // 更新
      this.dialogLoading = true
      this.$refs['dataForm'].validate(async(valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          await updateOne(tempData)
          await updateRoles({ _ids: this.$refs.tree.getCheckedKeys(), roleId: tempData._id })
          for (const v of this.list) {
            if (v._id === this.temp._id) {
              const index = this.list.indexOf(v)
              this.list.splice(index, 1, this.temp)
              break
            }
          }
          this.dialogFormVisible = false
          this.dialogLoading = false
          this.getList()
          this.getRoutes()
          this.$notify({
            title: this.$t('messages.success_title'),
            message: this.$t('messages.update_success'),
            type: 'success',
            duration: 2000
          })
        } else {
          this.dialogLoading = false
        }
      })
    }
  }
}
</script>
<style scoped>
  .form-item{
    float:left;
    width: 50%;
  }
  .form-item label{
    padding-left:20px;
  }
</style>
