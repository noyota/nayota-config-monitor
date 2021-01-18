<template>
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="65%" @open="dialogOpen">
    <fieldset class="fieldset-dialog">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="150px"
        style="padding-top:10px"
      >
        <el-form-item :label="$t('table.type')" prop="type" class="form-item">
          <el-select v-model="temp.type" :placeholder="$t('rules.types')">
            <el-option
              v-for="item in option1"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('router.name')" prop="name" class="form-item">
          <el-input v-model="temp.name" :placeholder="$t('rules.name')" />
        </el-form-item>
        <el-form-item :label="$t('router.path')" prop="path" class="form-item">
          <el-input v-model="temp.path" />
        </el-form-item>
        <el-form-item :label="$t('table.sort')" prop="sort" class="form-item">
          <el-input v-model="temp.sort" />
        </el-form-item>
        <el-form-item :label="$t('router.method')" prop="method" class="form-item">
          <el-select v-model="temp.method" clearable :placeholder="$t('rules.select')">
            <el-option
              v-for="item in option2"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('router.children')" prop="children" class="form-item">
          <el-select v-model="temp.children" multiple clearable filterable remote reserve-keyword placeholder="请选择" disabled="disabled">
            <el-option
              v-for="item in option3"
              :key="item._id"
              :label="(item.name||item.path)+' '+(item.method?item.method:'')"
              :value="item._id"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </fieldset>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">
        {{ $t('table.cancel') }}
      </el-button>
      <el-button type="primary" :loading="dialogLoading" @click="updateData()">
        {{ $t('table.confirm') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { updateOne, list } from '@/api/router'
export default {
  name: 'Edit',
  data() {
    return {
      textMap: {
        update: this.$t('dialog.update'),
        create: this.$t('dialog.create')
      },
      temp: {},
      dialogFormVisible: false,
      dialogStatus: undefined,
      rules: {
        name: [{ required: true, message: this.$t('rules.name'), trigger: 'blur' }]
      }, // 表单验证
      option1: [{ value: 'menu', label: this.$t('router.qUi') }, { value: 'api', label: this.$t('router.hUi') }],
      option2: ['get', 'post', 'put', 'delete'],
      option3: undefined,
      dialogLoading: false
    }
  },
  methods: {
    dialogOpen() {
      list({ autopopulate: false }).then(response => {
        this.option3 = response.data
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
            this.$emit('reload')
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
