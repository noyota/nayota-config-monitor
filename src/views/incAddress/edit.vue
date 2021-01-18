<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">

  <el-dialog
    :title="textMap[dialogStatus]"
    width="65%"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    @open="dialogOpen"
  >
    <fieldset class="fieldset-dialog">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="padding-top:10px">
        <el-form-item :label="$t('HardWareWord.type')" prop="type" class="form-item">
          <el-select v-model="temp.type" filterable :placeholder="$t('rules.select')" @change="initSubTable">
            <el-option
              v-for="item in [{id:0,name:$t('HardWareWord.equ')},{id:1,name:'LORA'},{id:2,name:'HTTP'},{id:4,name:'LORAWAN'},{id:5,name:'云网关设备'},{id:6,name:'TCP/UDP设备'}]"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('HardWareWord.code')" prop="address" class="form-item">
          <el-input v-model="temp.address" maxlength="4" :placeholder="$t('rules.code')" />
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
import { create, updateOne } from '@/api/incAddress'
export default {
  name: 'Form',
  components: { },
  data() {
    return {
      textMap: {
        update: this.$t('dialog.update'),
        create: this.$t('dialog.create')
      },
      temp: {},
      createTemp: {
      },
      dialogFormVisible: false,
      dialogStatus: undefined,
      rules: {
        type: [{ required: true, message: this.$t('rules.hardtype'), trigger: 'blur' }],
        address: [{ required: true, message: this.$t('rules.code'), trigger: 'blur' }]
      },
      dialogLoading: false
    }
  },
  methods: {
    dialogOpen() {
    },
    async handleCreate() { // 新建
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
      this.$nextTick(() => {
        this.temp = { ...this.createTemp }
        this.$refs['dataForm'].clearValidate()
      })
    },
    async validate() {
      try {
        await this.$refs['dataForm'].validate()
        return true
      } catch (e) {
        return false
      }
    },
    async createData() {
      this.dialogLoading = true
      if (!await this.validate()) {
        this.dialogLoading = false
        return this.$message.error(this.$t('messages.validate_error'))
      }
      await create(this.temp)
      this.$emit('reload') // 组件触发绑定的reload方法
      this.dialogFormVisible = false
      this.dialogLoading = false
      this.$notify({
        title: this.$t('messages.success_title'),
        message: this.$t('messages.create_success'),
        type: 'success',
        duration: 2000
      })
    },
    async handleUpdate(row) {
      this.temp = { ...row } // // 复制一个
      this.dialogFormVisible = true
      this.dialogStatus = 'update'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    async updateData() { // 更新
      this.dialogLoading = true
      if (!await this.validate()) {
        this.dialogLoading = false
        return this.$message.error(this.$t('messages.validate_error'))
      }
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
    }
  }
}
</script>
<style scoped>
div.fieldset-dialog{
  padding: 0.35em 0.75em 0.625em;
}
.click-table1-oper {
   margin-bottom: 18px;
 }
.form-item{
  float:left;
  width: 50%;
}
.form-item label{
  padding-left:20px;
}
.el-select{
  width: 100%;
}
</style>
