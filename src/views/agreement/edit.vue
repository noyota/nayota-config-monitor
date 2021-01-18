<template>
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="65%" @open="dialogOpen">
    <!--    <fieldset class="fieldset-dialog">-->
    <el-form
      ref="dataForm"
      :rules="rules"
      :model="temp"
      label-position="left"
      label-width="150px"
      style="margin-left:20px;margin-right:20px;padding-top:10px"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('agreement.name')" prop="name" class="form-item">
            <el-input v-model="temp.name" :placeholder="$t('agreement.ph_name')" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('agreement.type')" prop="type" class="form-item">
            <el-select v-model="temp.type" :placeholder="$t('agreement.ph_type')" @change="xuanze">
              <el-option
                v-for="item in [{id:0,name:'AI'},{id:1,name:$t('agreement.type_device')},{id:2,name:'LORA'},{id:3,name:'HTTP'},{id:4,name:'LORAWAN'},{id:5,name:'云网关设备'},{id:6,name:'TCP/UDP'}]"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('agreement.edition')" prop="edition" class="form-item">
            <el-input v-model="temp.edition" :placeholder="$t('agreement.ph_edition')" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-if="dimension" :label="$t('agreement.dimension')" prop="dimension" class="form-item">
            <el-select v-model="temp.dimension" :placeholder="$t('agreement.dimension')">
              <el-option
                v-for="item in [{id:0,name:$t('agreement.type_dimen')+'1'},{id:1,name:$t('agreement.type_dimen')+'2'}]"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('agreement.notes')" prop="notes" class="form-item">
            <el-input v-model="temp.notes" :placeholder="$t('agreement.ph_notes')" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('agreement.hanShu')" prop="singleFile" class="form-item">
            <SingleFile v-model="temp.hanShu" type="string" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('agreement.compressedCode')" prop="state" class="form-item">
            <el-select v-model="temp.state" :placeholder="$t('agreement.isCompressed')">
              <el-option
                v-for="item in [{id:0,name:this.$t('agreement.compressed')},{id:1,name:this.$t('agreement.unCompressed')}]"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('agreement.doc')" prop="SingleFile" class="form-item">
            <SingleFile v-model="temp.doc" type="string" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item v-show="dialogStatus==='update'" style=" pointer-events: none;" :label="$t('agreement.jsonEditor')" prop="singleFile" class="form-item">
            <js-editor ref="jsonEditor" v-model="value" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!--    </fieldset>-->
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
import { create, updateOne } from '@/api/agreement'
import SingleFile from '@/components/Upload/SingleFile'
import JsEditor from '@/components/JsEditor'
import { fileURL } from '@/utils'
import axios from 'axios'

const jsData = ``

export default {
  name: 'Form',
  components: { JsEditor, SingleFile },
  data() {
    return {
      textMap: {
        update: this.$t('dialog.update'),
        create: this.$t('dialog.create')
      },
      control: undefined,
      temp: {},
      createTemp: {
        type: 1
      },
      dialogFormVisible: false,
      dialogStatus: undefined,
      rules: {
        name: [{ required: true, message: this.$t('rules.name'), trigger: 'blur' }],
        type: [{ required: true, message: this.$t('rules.type'), trigger: 'blur' }]
      },
      value: jsData,
      wordAll: [],
      showWord: false,
      dimension: false,
      dialogLoading: false
    }
  },
  methods: {
    dialogOpen() {
    },
    async handleCreate() { // 新建
      this.xuanze()
      this.temp = {}
      this.value = jsData
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
          try {
            create(this.temp).then(() => {
              // this.temp.hanShu.path =
              this.$emit('reload') // 组件触发绑定的reload方法
              this.dialogLoading = false
              this.dialogFormVisible = false
              this.$notify({
                title: this.$t('messages.success_title'),
                message: this.$t('messages.create_success'),
                type: 'success',
                duration: 2000
              })
            })
          } catch (e) {
            this.dialogLoading = false
          }
        } else {
          this.dialogLoading = false
        }
      })
    },
    async handleUpdate(row) {
      this.temp = { ...row } // // 复制一个
      this.value = jsData
      this.xuanze()
      if (this.temp.children) this.temp.children = this.temp.children.map(child => child._id)
      delete this.temp._parent
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.dialogLoading = false
      this.$nextTick(() => { // tanchu
        axios.get(fileURL(this.temp.hanShu))
          .then(res => {
            this.value = `${res.data}`
          })
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() { // 更新
      this.dialogLoading = true
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          if (this.temp.type === 0) tempData.word = null
          if (this.temp.type === 1) tempData.word = null
          if (this.temp.type === 1) tempData.dimension = null
          if (this.temp.type === 2) tempData.dimension = null
          try {
            updateOne(tempData).then(() => {
              this.$emit('reload') // 组件触发绑定的reload方法
              this.dialogLoading = false
              this.dialogFormVisible = false
              this.$notify({
                title: this.$t('messages.success_title'),
                message: this.$t('messages.update_success'),
                type: 'success',
                duration: 2000
              })
            })
          } catch (e) {
            this.dialogLoading = false
          }
        } else {
          this.dialogLoading = false
        }
      })
    },
    xuanze() {
      if (this.temp.type === 0) { // AI
        this.dimension = true
        this.showWord = false
      }
      if (this.temp.type === 2) { // lora
        this.dimension = false
        this.showWord = true
      }
      if (this.temp.type === 1) { // lora
        this.dimension = false
        this.showWord = false
      }
    }
  }
}
</script>
<style scoped>
  .form-item{
    float:left;
    width: 100%;
  }
  .form-item label{
    padding-left:20px;
  }
</style>

