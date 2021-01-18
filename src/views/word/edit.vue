<template>
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" @open="dialogOpen">
    <fieldset class="fieldset-dialog">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="95px"
        style="padding-top:10px"
      >
        <el-form-item :label="$t('word.wordType')" prop="wordType" class="form-item">
          <el-cascader
            v-model="temp.wordType"
            :options="treedata|setChildNullArray"
            :props="defaultProps"
            :show-all-levels="false"
          />
        </el-form-item>
        <el-form-item :label="$t('table.name')" prop="name" class="form-item">
          <el-input v-model="temp.name" :placeholder="$t('table.inputName')" />
        </el-form-item>
        <el-form-item :label="$t('table.sort')" prop="sort" class="form-item">
          <el-input-number v-model="temp.sort" :min="1" label="描述文字" />
        </el-form-item>
        <el-form-item :label="$t('table.remarks')" prop="remark" class="form-item">
          <el-input
            v-model="temp.remark"
            :placeholder="$t('table.inputRemarks')"
          />
        </el-form-item>
        <el-form-item :label="$t('word.key')" prop="key" class="form-item">
          <el-input v-model="temp.key" :placeholder="$t('word.inputKey')" />
        </el-form-item>
        <el-form-item :label="$t('word.value')" prop="value" class="form-item">
          <el-input v-model="temp.value" :placeholder="$t('word.inputValue')" />
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
import { create, updateOne } from '@/api/words'
import { list as wordTypeList } from '@/api/wordTypes'

export default {
  name: 'WordForm',
  data() {
    return {
      textMap: {
        update: this.$t('dialog.update'),
        create: this.$t('dialog.create')
      },
      defaultProps: {
        children: 'children',
        label: 'name',
        value: '_id'
      },
      temp: {},
      createTemp: {},
      treedata: undefined,
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
      if (this.treedata === undefined) {
        this.treedata = []
        wordTypeList({}).then(response => {
          this.treedata = response.data.rows
        })
      }
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
          if (this.temp.wordType) this.temp.wordType = this.temp.wordType.slice(-1)[0]
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
      if (this.temp.wordType) {
        const wordType = this.temp.wordType
        this.temp.wordType = []
        this.temp.wordType.push(wordType._id)
      }
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
