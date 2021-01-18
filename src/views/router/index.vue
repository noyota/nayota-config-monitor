<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="addMenuItem(undefined)"
      >
        {{ $t('router.message1') }}
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="$refs.Gen.formVisible=true"
      >
        {{ $t('router.message2') }}
      </el-button>
      <!--<div class="filter-item" style="margin-left: 10px;">-->
      <!--<el-tag>展开</el-tag>-->
      <!--<el-switch-->
      <!--v-model="defaultExpandAll"-->
      <!--active-color="#13ce66"-->
      <!--inactive-color="#ff4949"-->
      <!--@change="reset"-->
      <!--/>-->
      <!--</div>-->
    </div>
    <el-table
      ref="TreeTable"
      v-loading="listLoading"
      :data="data"
      border
      fit
      highlight-current-row
      row-key="_id"
    >
      <el-table-column prop="name" :label="$t('router.name')" sortable="custom" align="center" width="240" />
      <el-table-column prop="type" :label="$t('table.type')" sortable="custom" align="center" width="100" />
      <el-table-column prop="path" :label="$t('router.path')" sortable="custom" align="center" width="200" />
      <el-table-column prop="method" :label="$t('router.method')" sortable="custom" align="center" width="100" />
      <el-table-column :label="$t('router.roles')" align="center" min-width="240">
        <template slot-scope="scope">
          <el-tag v-for="role in scope.row.roles " :key="role._id">{{ role.name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="level" :label="$t('router.level')" sortable="custom" align="center" width="100" />
      <el-table-column prop="desc" :label="$t('table.remarks')" sortable="custom" align="center" width="200" />
      <el-table-column prop="sort" :label="$t('table.sort')" sortable="custom" align="center" width="120" />
      <el-table-column :label="$t('table.actions')" fixed="right" align="center" width="250">
        <template slot-scope="scope">
          <el-button size="mini" type="info" @click="addMenuItem(scope.row,'children')">
            {{ $t('wordType.addC') }}
          </el-button>
          <el-button size="mini" type="primary" @click="handleUpdate(scope.row)">
            {{ $t(&#x27;table.edit&#x27;) }}
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row._id)">
            {{ $t(&#x27;table.delete&#x27;) }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <edit-form ref="EditFrom" @reload="getList" />
    <generato-router ref="Gen" />
  </div>
</template>

<script>
import { list, create, deleteOne, updateOne } from '@/api/router'
import editForm from './edit'
import generatoRouter from './generator'
import waves from '@/directive/waves' // Waves directive
export default {
  name: 'RouterList',
  components: { editForm, generatoRouter },
  directives: { waves }, // 一个按钮的动画效果
  data() {
    return {
      listLoading: true,
      // defaultExpandAll: false,
      // expandRowKeys: [],
      columns: [
        {
          label: '多选',
          checkbox: true
        },
        {
          label: '名称',
          key: 'name',
          expand: true
        },
        {
          label: '类型',
          key: 'type'
        },
        {
          label: '路径',
          key: 'path',
          width: 200,
          align: 'left'
        },
        {
          label: 'method',
          key: 'method',
          width: 80,
          align: 'left'
        },
        {
          label: '拥有权限的角色',
          key: 'roles'
        },
        {
          label: '操作',
          key: 'operation'
        }
      ],
      data: [],
      createTemp: { // 临时表单
        _id: undefined,
        name: '新路由',
        type: 'menu',
        children: [],
        roles: []
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // reset() {
    //   console.log(this.expandRowKeys)
    //   this.expandRowKeys=[1]
    // },
    getList() {
      this.listLoading = true
      list({ level: 0 }).then(response => {
        this.data = response.data
        this.listLoading = false
      })
    },
    addMenuItem(row) {
      const data = { ...this.createTemp }
      if (row == null) {
        data.level = 0
      }
      // this.$refs.TreeTable.addChild(row, data)
      create({ ...data }).then((res) => {
        data._id = res.data._id
        // const children = new Set(row.children.map(child => child._id))
        if (row) {
          row.children.push(res.data)
          updateOne({ _id: row._id, children: row.children })
        } else {
          this.data.push(res.data)
        }
      })
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
    handleUpdate(row) {
      this.$refs.EditFrom.handleUpdate(row)
    }
  }
}
</script>
