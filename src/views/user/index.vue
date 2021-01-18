<template>
  <div class="app-container">
    <div v-if="app_role==='server'" class="filter-container">
      <el-select v-model="listQuery.label" :placeholder="$t('table.search_label')" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in fieldOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-input v-model="listQuery.search" :placeholder="$t('table.search_message')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        {{ $t('table.add') }}
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-delete" @click="handleDeleteCheck">
        {{ $t('table.delete') }}
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
      <el-table-column :label="$t('users.username')" readonly prop="username" align="center" min-width="120" />
      <el-table-column prop="trueName" :label="$t('users.trueName')" sortable="custom" align="center" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.trueName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('users.roles')" min-width="210" align="center">
        <template slot-scope="scope">
          <el-tag v-for="role in scope.row.roles " :key="role._id">{{ role.name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" :label="$t('table.createdAt')" sortable="custom" align="center" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.createdAt | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="updatedAt" :label="$t('table.updatedAt')" sortable="custom" align="center" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.updatedAt | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" fixed="right" align="center" min-width="180" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">
            {{ $t('table.edit') }}
          </el-button>
          <el-button v-if="userInfo.username!==scope.row.username" size="mini" type="danger" @click="handleDelete(scope.row._id)">
            {{ $t('table.delete') }}
          </el-button>
          <el-button v-if="userInfo.type===0&&scope.row.type===0" type="primary" size="mini" @click="handleCreateChild(scope.row)">
            {{ $t('users.createChild') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <edit-form ref="EditFrom" @reload="getList" />
    <edit-child ref="EditChild" @reload="getList" />
  </div>
</template>

<script>
import { list, deleteUser, deleteUsers, getInfo } from '@/api/user'
import { list as roleList } from '@/api/roles'
import Pagination from '@/components/Pagination' // 分页组件Secondary package based on el-pagination
import waves from '@/directive/waves' // Waves directive
import editForm from './edit'
import editChild from './editChild'
export default {
  name: 'UserList',
  components: { Pagination, editForm, editChild },
  directives: { waves }, // 一个按钮的动画效果
  data() {
    return {
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: true,
      fieldOptions: [
        { key: 'username', label: this.$t('users.username') },
        { key: 'trueName', label: this.$t('users.trueName') }
      ],
      listQuery: {
        label: 'username',
        search: '',
        page: 1,
        limit: 10,
        sort: '_id'
      },
      multipleSelection: [],
      dialogFormVisible: false,
      dialogStatus: '',
      temp: {},
      mqttRoles: [],
      newMqtt: false,
      userInfo: undefined,
      roles: undefined,
      app_role: process.env.VUE_APP_ROLE
    }
  },
  async created() {
    this.getList()
  },
  methods: {
    async getList() {
      if (this.userInfo === undefined) {
        await getInfo({}).then(response => {
          this.userInfo = response.data
        })
      }
      if (this.roles === undefined) {
        await roleList().then(response => {
          this.roles = []
          this.roles = response.data.rows
        })
      }
      this.listLoading = true
      // this.list = []
      list(this.listQuery).then(response => {
        this.list = response.data.rows
        this.list.forEach((item) => {
          item.children.forEach((child) => {
            delete child.children
          })
        })
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
        deleteUser(_id).then(() => {
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
          deleteUsers(this.multipleSelection).then(() => {
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
      if (row.type === 0) {
        this.$refs.EditFrom.handleUpdate(row)
      }
      if (row.type === 1) {
        this.$refs.EditChild.handleUpdate(row)
      }
    },
    handleCreate() {
      this.$refs.EditFrom.handleCreate()
    },
    handleCreateChild(row) {
      this.$refs.EditChild.handleCreate(row)
    }
  }
}
</script>
<style scoped>
  .user-avatar {
    cursor: pointer;
    width: 40px;
    height: 40px;
    border-radius: 10px;
  }
   .form-item{
     float:left;
     width: 50%;
   }
  .form-item label{
    padding-left:20px;
  }
</style>

