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
        <el-form-item :label="$t('table.name')" prop="name" class="form-item">
          <el-input v-model="temp.name" :placeholder="$t('rules.name')" />
        </el-form-item>
        <el-form-item :label="$t('HardWareWord.type')" prop="type" class="form-item">
          <el-select v-model="temp.type" filterable :placeholder="$t('rules.select')">
            <el-option
              v-for="item in [{id:0,name:$t('HardWareWord.equ')},{id:1,name:'LORA'},{id:2,name:'HTTP'},{id:4,name:'LORAWAN'},{id:5,name:'云网关设备'},{id:6,name:'TCP/UDP设备'}]"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <!--<el-form-item label="QA" prop="status" class="form-item">-->
        <!--<el-select v-model="temp.status" filterable :placeholder="$t('rules.select')">-->
        <!--<el-option-->
        <!--v-for="item in [{id:0,name:$t('HardWareWord.LX')},{id:1,name:$t('HardWareWord.JT')},{id:2,name:$t('HardWareWord.QT')}]"-->
        <!--:key="item.id"-->
        <!--:label="item.name"-->
        <!--:value="item.id"-->
        <!--/>-->
        <!--</el-select>-->
        <!--</el-form-item>-->
        <el-form-item :label="$t('HardWareWord.code')" prop="code" class="form-item">
          <el-input v-model="temp.code" :placeholder="$t('rules.code')" />
        </el-form-item>
        <el-form-item :label="$t('HardWareWord.agreement')" prop="agreement" class="form-item">
          <el-select v-model="temp.agreement" filterable :placeholder="$t('rules.select')">
            <el-option
              v-for="item in agreements"
              :key="item._id"
              :label="item.notes"
              :value="item._id"
            >
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.notes }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item label="在离线" prop="line_status" class="form-item">-->
        <!--<el-select v-model="temp.line_status" filterable :placeholder="$t('rules.select')">-->
        <!--<el-option-->
        <!--v-for="item in [{id:0,name:'可检测'},{id:1,name:'不可检测'}]"-->
        <!--:key="item.id"-->
        <!--:label="item.name"-->
        <!--:value="item.id"-->
        <!--/>-->
        <!--</el-select>-->
        <!--</el-form-item>-->
        <!--        <el-form-item :label="$t('HardWareWord.uiTemplate')" prop="uiTemplate" class="form-item">-->
        <!--          <template>-->
        <!--            <el-select-->
        <!--              v-model="temp.uiTemplate"-->
        <!--              :placeholder="$t('rules.select')"-->
        <!--              filterable-->
        <!--              value-key="_id"-->
        <!--            >-->
        <!--              <el-option-->
        <!--                v-for="item in uiTemplateList"-->
        <!--                :key="item._id"-->
        <!--                :label="item.name"-->
        <!--                :value="item"-->
        <!--              >-->
        <!--                <span style="float: left">{{ item.name }}</span>-->
        <!--                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.templateComponentName }}</span>-->
        <!--              </el-option>-->
        <!--            </el-select>-->
        <!--          </template>-->
        <!--        </el-form-item>-->
        <!--<el-form-item label="UI模型" prop="uiModel" class="form-item">-->
        <!--<template>-->
        <!--<el-select-->
        <!--v-model="temp.uiModel"-->
        <!--:placeholder="$t('rules.select')"-->
        <!--filterable-->
        <!--value-key="_id"-->
        <!--&gt;-->
        <!--<el-option-->
        <!--v-for="item in uiModels"-->
        <!--:key="item._id"-->
        <!--:label="item.name"-->
        <!--:value="item"-->
        <!--&gt;-->
        <!--<span style="float: left">{{ item.name }}</span>-->
        <!--</el-option>-->
        <!--</el-select>-->
        <!--</template>-->
        <!--</el-form-item>-->
        <!--<el-form-item :label="$t('HardWareWord.SingleFile')" prop="SingleFile" class="form-item">-->
        <!--<SingleFile v-model="temp.doc" type="string" />-->
        <!--</el-form-item>-->
        <!--<el-form-item :label="$t('HardWareWord.image')" :prop="imageProp" class="form-item">-->
        <!--<SingleImage v-model="temp.image" type="string" />-->
        <!--</el-form-item>-->
        <!--<el-form-item :label="$t('HardWareWord.img_example1')" prop="img_example1" class="form-item">-->
        <!--<SingleImage v-model="temp.img_example1" type="string" />-->
        <!--</el-form-item>-->
        <!--<el-form-item :label="$t('HardWareWord.img_example2')" prop="img_example2" class="form-item">-->
        <!--<SingleImage v-model="temp.img_example2" type="string" />-->
        <!--</el-form-item>-->
      </el-form>
    </fieldset>
    <div v-if="temp.type===0" class="fieldset-dialog" style="margin-top:10px">
      <p style="font-size: 16px;margin-left:10px">{{ $t('HardWareWord.comInfo') }}</p>
      <vxe-table
        ref="serialTable"
        border
        class="vxe-table-element"
        :data.sync="serialDataList"
        :edit-config="{trigger: 'click', mode: 'cell', showStatus: true}"
        style="margin:10px"
      >
        <vxe-table-column field="baud" :title="$t('com.baud')" :edit-render="{name: 'ElSelect', options: baudList}" />
        <vxe-table-column field="verification" :title="$t('com.verification')" :edit-render="{name: 'ElSelect', options: verificaList}" />
        <vxe-table-column field="stopBit" :title="$t('com.stopBit')" :edit-render="{name: 'ElSelect', options: stopBitList}" />
        <vxe-table-column field="dataBit" :title="$t('com.dataBit')" :edit-render="{name: 'ElSelect', options: dataBitList}" />
      </vxe-table>
    </div>
    <div class="fieldset-dialog" style="margin-top:10px">
      <p style="font-size: 16px;margin-left:10px">{{ $t('HardWareWord.parameter') }}</p>
      <div class="click-table1-oper" style="margin-bottom: 10px;margin-left: 10px;">
        <el-button type="success" size="small" @click="insertEvent('attributeTable','key')">{{ $t('table.addC') }}</el-button>
      </div>
      <vxe-table
        ref="attributeTable"
        border
        class="vxe-table-element"
        :data.sync="temp.attribute"
        :edit-config="{trigger: 'click', mode: 'cell', showStatus: true}"
        :edit-rules="attributeRule"
        style="margin:10px"
      >
        <vxe-table-column field="key" title="key" :edit-render="{name: 'ElInput',props:{size:'mini'}}" />
        <vxe-table-column field="value" title="value" :edit-render="{name: 'ElInput',props:{size:'mini'}}" />
        <vxe-table-column field="note" :title="$t('HardWareWord.note')" :edit-render="{name: 'ElInput',props:{size:'mini'}}" />
        <vxe-table-column field="options" :title="$t('HardWareWord.options')" :edit-render="{type: 'visible'}" width="100">
          <template v-slot:edit="{ row }">
            <el-button size="mini" type="danger" @click="removeEvent('attributeTable' , row)">{{ $t('table.delete') }}</el-button>
          </template>
        </vxe-table-column>
      </vxe-table>
    </div>
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
import { create, updateOne } from '@/api/hardwareword'
import { list as agreementList } from '@/api/agreement'
import { BAUD_RATES, CHECKS, STOP_BITS, DATA_BITS, SFS, BANDWIDTHS, CODERATE, FREQUENCY, DEFAUT_PORT } from '@/utils/constant'
export default {
  name: 'Form',
  components: { },
  data() {
    return {
      baudList: BAUD_RATES, // 波特率列表
      verificaList: CHECKS, // 校验列表
      stopBitList: STOP_BITS, // 停止位列表
      dataBitList: DATA_BITS, // 数据位列表
      factorList: SFS, // 扩频因子列表
      bwList: BANDWIDTHS, // 带宽列表
      crList: CODERATE, // 编码率列表
      frequencyList: FREQUENCY, // 频段列表
      textMap: {
        update: this.$t('dialog.update'),
        create: this.$t('dialog.create')
      },
      serialDataList: [],
      agreements: [],
      uiTemplateList: [],
      uiTemplateOption: [],
      uiModels: [], // UI模型
      boardConfigCheckItem: ['rangeMin', 'rangeMax', 'thresholdMin', 'thresholdMax'],
      boardConfigOperateItem: [],
      // control: undefined,
      temp: {},
      createTemp: {
        attribute: [],
        serialData: DEFAUT_PORT
      },
      dialogFormVisible: false,
      dialogStatus: undefined,
      rules: {
        name: [{ required: true, message: this.$t('rules.name'), trigger: 'blur' }],
        type: [{ required: true, message: this.$t('rules.hardtype'), trigger: 'blur' }],
        code: [{ required: true, message: this.$t('rules.code'), trigger: 'blur' }],
        image: [{ required: true, message: this.$t('rules.image'), trigger: 'blur' }],
        agreement: [{ required: true, message: this.$t('rules.agreement'), trigger: 'blur' }]
      },
      attributeRule: {
        key: [{ required: true, message: this.$t('rules.required') }],
        value: [{ required: true, message: this.$t('rules.required') }]
      },
      checkRule: {
        name: [{ required: true, message: this.$t('rules.required') }],
        // company: [{ required: true, message: this.$t('rules.required') }],
        // icon: [{ required: true, message: this.$t('rules.required') }],
        address: [{ required: true, message: this.$t('rules.required') }]
      },
      cleanRule: {
        name: [{ required: true, message: this.$t('rules.required') }],
        shortAddress: [{ required: true, message: this.$t('rules.required') }]
      },
      operateRule: {
        name: [{ required: true, message: this.$t('rules.required') }],
        address: [{ required: true, message: this.$t('rules.required') }]
      },
      rosterModelRule: {
        name: [{ required: true, message: this.$t('rules.required') }]
      },
      chartModel: [],
      showIcon: [],
      buttonIcon: [],
      numericalValue: [],
      imageProp: process.env.VUE_APP_ROLE === 'serve' ? '' : '',
      chartModels: [],
      dialogLoading: false
    }
  },
  methods: {
    dialogOpen() {
    },
    fkBeId(row) { // 外键统一转_id
      if (row.agreement && row.agreement._id) row.agreement = row.agreement._id
    },
    initSubTable() { // 子表单初始化
      if (!this.temp.serialData || this.temp.serialData instanceof Array) this.temp.serialData = DEFAUT_PORT
      this.serialDataList = [this.temp.serialData]
    },
    async loadSelectData() {
      this.agreements = (await agreementList()).data.rows
    },
    async handleCreate() { // 新建
      this.dialogFormVisible = true
      this.loadSelectData()
      this.dialogStatus = 'create'

      this.$nextTick(() => {
        this.temp = { ...this.createTemp }
        this.fkBeId(this.temp)
        this.initSubTable()
        this.$refs['dataForm'].clearValidate()
      })
    },
    async validate() {
      try {
        await this.$refs['dataForm'].validate()
        await this.$refs.attributeTable.fullValidate()
        this.temp.attribute = this.$refs.attributeTable.getTableData().fullData
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
      await this.loadSelectData()
      this.initSubTable()
      this.fkBeId(this.temp)
      for (const item of this.temp.defaultCheck) {
        if (item.boardConfig === undefined) {
          item.boardConfig = {}
        }
      }
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
    },
    removeEvent(table, row) {
      this.$refs[table].remove(row)
    },
    editJS(data) {
      this.$prompt(this.$t('editJS.edit_title'), this.$t('editJS.edit'), {
        showCancelButton: true,
        confirmButtonText: this.$t('messages.confirm'),
        cancelButtonText: this.$t('messages.cancel'),
        inputType: 'textarea',
        inputValue: data.analysis
      }).then(({ value }) => {
        data.analysis = value
      })
    },
    insertEvent(table, field) {
      this.$refs[table].insert({}).then(({ row }) => {
        this.$refs[table].setActiveCell(row, field)
      })
    },
    handleAvatarSuccess(data, row) {
      const r = new FileReader()
      r.readAsDataURL(data.file)
      r.onload = (e) => {
        row.def = e.target.result
      }
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
