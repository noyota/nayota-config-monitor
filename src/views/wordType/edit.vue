<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" @open="dialogOpen">
    <fieldset class="fieldset-dialog">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="padding-top:10px"
      >
        <el-form-item :label="$t('table.name')" prop="name" class="form-item">
          <el-input v-model="temp.name" :placeholder="$t('table.inputName')" />
        </el-form-item>
        <el-form-item :label="$t('table.sort')" prop="sort" class="form-item">
          <el-input-number v-model="temp.sort" :min="1" />
        </el-form-item>
        <el-form-item :label="$t('table.remarks')" prop="remark" class="form-item">
          <el-input
            v-model="temp.remark"
            :placeholder="$t('table.inputRemarks')"
          />
        </el-form-item>
        <el-form-item :label="$t('wordType.state')" prop="flag" class="form-item">
          <el-switch
            v-model="temp.flag"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </el-form-item>
      </el-form>
    </fieldset>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">
        {{ $t(&#x27;table.cancel&#x27;) }}
      </el-button>
      <el-button type="primary" :loading="dialogLoading" @click="dialogStatus==='create'?createData():updateData()">
        {{ $t(&#x27;table.confirm&#x27;) }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { create, updateOne } from '@/api/wordTypes'

export default {
  name: 'WordTypeForm',
  data() {
    return {
      textMap: {
        update: this.$t('dialog.update'),
        create: this.$t('dialog.create')
      },
      temp: {},
      createTemp: {
        sort: 1,
        flag: true,
        level: 0
      },
      listQuery: {
        page: 1,
        limit: 100,
        sort: '_id'
      },
      treeQuery: {
        fieldName: ''
      },
      regionList: undefined, // 查询字典类型列表
      dialogFormVisible: false,
      dialogStatus: undefined,
      rules: {
        name: [{ required: true, message: this.$t('rules.name'), trigger: 'blur' }]
      },
      dialogLoading: false
    }
  },
  methods: {
    dialogOpen() {
      // if (this.regionList === undefined) {
      //   getSelectTreeData(this.treeQuery).then(response => {
      //     this.regionList = []
      //     if (response.data) {
      //       response.data.map(child => {
      //         if (child.children !== null && child.children !== undefined && child.children.length === 0) {
      //           delete child.children
      //         }
      //         this.regionList.push(child)
      //       })
      //     }
      //     console.log('regionList', JSON.stringify(this.regionList))
      //   })
      // }
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
            this.$emit('reload') // 组件触发绑定的reload方法
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
    handleUpdate(row) {
      this.temp = { ...row } // 复制一个
      if (this.temp.children) this.temp.children = this.temp.children.map(child => child._id)
      delete this.temp._parent
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() { // 更新
      this.dialogLoading = true
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateOne(tempData).then(() => {
            this.$emit('reload') // 组件触发绑定的reload方法
            this.dialogFormVisible = false
            this.dialogLoading = false
            this.$notify({
              title: this.$t('messages.success_title'),
              message: this.$t('messages.update_success'),
              type: 'success',
              duration: 2000
            })
          })
        } else {
          this.dialogLoading = false
        }
      })
    },
    // getCascaderLabel(value, list) {
    //   const values = value || []
    //   const labels = []
    //   const matchCascaderData = function(index, list) {
    //     const val = values[index]
    //     if (list && values.length > index) {
    //       list.forEach(item => {
    //         if (item.value === val) {
    //           labels.push(item.label)
    //           matchCascaderData(++index, item.children)
    //         }
    //       })
    //     }
    //   }
    //   matchCascaderData(0, list)
    //   return labels.join(' / ')
    // },
    handleChange(value) {
      console.log(value)
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
