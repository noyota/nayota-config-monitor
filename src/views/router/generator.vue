<template>
  <el-dialog title="路由生成" :visible.sync="formVisible" @open="dialogOpen">
    <fieldset class="fieldset-dialog"><el-form
      ref="dataForm"
      :model="temp"

      :rules="rules"
      label-position="left"
      label-width="150px"
      style="padding-top:10px"
    >
      <el-form-item :label="$t('upload.fatherName')" prop="name" class="form-item">
        <el-select v-model="temp.fatherId" filterable :placeholder="$t('upload.inputFatherName')">
          <el-option
            v-for="item in menus"
            :key="item._id"
            :label="item.name"
            :value="item._id"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('upload.sName')" prop="name" class="form-item">
        <el-input v-model="temp.name" :placeholder="$t('upload.inputSName')" />
      </el-form-item>
      <el-form-item :label="$t('upload.filepath')" prop="filepath" class="form-item">
        <el-input v-model="temp.filepath" :placeholder="$t('upload.inputFilepath')" />
      </el-form-item>
    </el-form></fieldset>
    <div slot="footer" class="dialog-footer">
      <el-button @click="formVisible = false">
        {{ $t('table.cancel') }}
      </el-button>
      <el-button type="primary" :loading="dialogLoading" @click="createData()">
        {{ $t('table.confirm') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { generator, list } from '@/api/router'

export default {
  name: 'Generator',
  data() {
    return {
      menus: [],
      formVisible: false,
      temp: {
        filepath: ''
      },
      rules: {
        name: [{ required: true, message: this.$t('rules.name'), trigger: 'blur' }],
        filepath: [{ required: true, message: this.$t('rules.filepath'), trigger: 'blur' }]
      }, // 表单验证
      dialogLoading: false
    }
  },
  methods: {
    dialogOpen() {
      list({ type: 'menu', autopopulate: false }).then(response => {
        this.menus = response.data
      })
    },
    createData() {
      this.dialogLoading = true
      generator(this.temp).then(res => {
        this.formVisible = false
        this.dialogLoading = false
        this.$notify({
          title: '成功',
          message: '生成成功',
          type: 'success',
          duration: 2000
        })
      }).catch(err => {
        this.dialogLoading = false
        this.$notify({
          title: '失败',
          message: err.response.data.message,
          type: 'error',
          duration: 2000
        })
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
