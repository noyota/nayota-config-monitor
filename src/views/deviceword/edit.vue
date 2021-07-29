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
          <el-select v-model="temp.type" filterable :placeholder="$t('rules.select')" @change="initSubTable">
            <el-option
              v-for="item in [{id:0,name:$t('HardWareWord.equ')},{id:1,name:'LORA'},{id:2,name:'HTTP'},{id:4,name:'LORAWAN'},{id:5,name:'云网关设备'},{id:6,name:'TCP/UDP设备'}]"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('HardWareWord.code')" prop="code" class="form-item">
          <el-input v-model="temp.code" maxlength="10" :placeholder="$t('rules.code')" />
        </el-form-item>
        <el-form-item label="地址长度" prop="code" class="form-item">
          <el-input v-model="temp.addressLength" :placeholder="$t('rules.code')" />
        </el-form-item>
        <el-form-item label="设备字典" prop="hardwareWord" class="form-item">
          <el-select v-model="temp.hardwareWord" filterable @change="changeHardware">
            <el-option
              v-for="item in hardwareWords"
              :key="item._id"
              :label="item.name"
              :value="item._id"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </fieldset>
    <div v-show="temp.type===1" class="fieldset-dialog" style="margin-top:10px">
      <p style="font-size: 16px;">{{ $t('loraSlave.message7') }}</p>
      <vxe-table
        ref="loraDataTable"
        border
        class="vxe-table-element"
        :data.sync="loraDataList"
        :edit-config="{trigger: 'click', mode: 'cell', showStatus: true}"
        style="margin:10px"
        :edit-rules="loraDataRule"
      >
        <vxe-table-column field="frequency" :title="$t('loraSlave.frequency')" :edit-render="{name: 'ElSelect',options: frequencyList}" />
        <vxe-table-column field="bandwidth" :title="$t('loraSlave.bandwidth')" :edit-render="{name: 'ElSelect',options: bwList}" />
        <vxe-table-column field="codingrate" :title="$t('loraSlave.codingrate')" :edit-render="{name: 'ElSelect',options: crList}" />
        <vxe-table-column field="factor" :title="$t('loraSlave.factor')" :edit-render="{name: 'ElSelect',options: factorList}" />
      </vxe-table>
    </div>
    <div v-show="temp.type===0" class="fieldset-dialog" style="margin-top:10px">
      <p style="font-size: 16px;margin-left:10px">{{ $t('HardWareWord.comInfo') }}</p>
      <vxe-table
        ref="serialTable"
        border
        class="vxe-table-element"
        :data.sync="serialDataList"
        :edit-config="{trigger: 'click', mode: 'cell', showStatus: true}"
        style="margin:10px"
        :edit-rules="serialRule"
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
          <template #edit="{ row }">
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
import { create, updateOne } from '@/api/deviceword'
import { list as IncList, create as createInc, updateOne as updateInc } from '@/api/incAddress'
import { list as hardwareWordList } from '@/api/hardwareword'
import { BAUD_RATES, CHECKS, STOP_BITS, DATA_BITS, SFS, BANDWIDTHS, CODERATE, FREQUENCY, DEFAUT_PORT, DEFAUT_LORA } from '@/utils/constant'
import { list as wordList } from '@/api/words'
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
      loraDataList: [],
      temp: {},
      createTemp: {
        attribute: [],
        serialData: DEFAUT_PORT,
        type: 0
      },
      dialogFormVisible: false,
      dialogStatus: undefined,
      rules: {
        name: [{ required: true, message: this.$t('rules.name'), trigger: 'blur' }],
        type: [{ required: true, message: this.$t('rules.hardtype'), trigger: 'blur' }],
        code: [{ required: true, message: this.$t('rules.code'), trigger: 'blur' }]
      },
      attributeRule: {
        key: [{ required: true, message: this.$t('rules.required') }],
        value: [{ required: true, message: this.$t('rules.required') }]
      },
      serialRule: {
        baud: [{ required: true, message: this.$t('rules.required') }],
        verification: [{ required: true, message: this.$t('rules.required') }],
        stopBit: [{ required: true, message: this.$t('rules.required') }],
        dataBit: [{ required: true, message: this.$t('rules.required') }]
      },
      loraDataRule: {
        frequency: [{ required: true, message: this.$t('rules.required') }],
        bandwidth: [{ required: true, message: this.$t('rules.required') }],
        codingrate: [{ required: true, message: this.$t('rules.required') }],
        factor: [{ required: true, message: this.$t('rules.required') }]
      },
      dialogLoading: false,
      hardwareWords: [],
      inc: undefined,
      code: '0001'
    }
  },
  methods: {
    dialogOpen() {
    },
    async init() {
      this.hardwareWords = (await hardwareWordList({ autopopulate: false })).data.rows
      const words = (await wordList({ wordType: '6066ac0976587221d6f69b68' })).data.rows
      if (words.length > 0) {
        words.forEach(item => {
          item.label = item.name
        })
        this.frequencyList = words
      }
    },
    changeHardware() {
      const hardwareWords = this.hardwareWords.filter(item => item._id === this.temp.hardwareWord)
      if (hardwareWords.length > 0) {
        const hardwareWord = hardwareWords[0]
        this.temp.serialData = hardwareWord.serialData
        this.temp.loraData = hardwareWord.loraData
        this.temp.attribute = hardwareWord.attribute
      }
      if (this.temp.type === 0) {
        if (!this.temp.serialData || this.temp.serialData instanceof Array) this.temp.serialData = DEFAUT_PORT
        this.serialDataList = [this.temp.serialData]
        this.temp.code = 'H' + this.code
      } else if (this.temp.type === 1) {
        if (!this.temp.loraData || this.temp.loraData instanceof Array) this.temp.loraData = DEFAUT_LORA
        this.loraDataList = [this.temp.loraData]
        this.temp.code = 'L' + this.code
      }
    },
    async initSubTable() { // 子表单初始化
      this.hardwareWords = this.hardwareWords.filter(item => item.type === this.temp.type)
      if (this.temp.type === 0) {
        if (!this.temp.serialData || this.temp.serialData instanceof Array) this.temp.serialData = DEFAUT_PORT
        this.serialDataList = [this.temp.serialData]
      } else if (this.temp.type === 1) {
        if (!this.temp.loraData || this.temp.loraData instanceof Array) this.temp.loraData = DEFAUT_LORA
        this.loraDataList = [this.temp.loraData]
      }
    },
    async handleCreate() { // 新建
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
      this.$nextTick(() => {
        this.temp = { ...this.createTemp }
        this.init()
        this.initSubTable()
        this.getIncAddress()
        this.$refs['dataForm'].clearValidate()
      })
    },
    async getIncAddress() {
      const incs = (await IncList({ type: 100 })).data.rows
      if (incs.length > 0) {
        this.inc = incs[0]
        this.code = (parseInt(this.inc.address, 16) + 1).toString(16)
        while (this.code.length < 4) {
          this.code = '0' + this.code
        }
      } else {
        this.code = '0001'
      }
      if (this.temp.type === 0) {
        this.temp.code = 'H' + this.code
      } else if (this.temp.type === 1) {
        this.temp.code = 'L' + this.code
      }
    },
    async saveIncAddress() {
      if (this.inc !== undefined) {
        this.inc.address = this.code
        const tempData = Object.assign({}, this.inc)
        updateInc(tempData)
      } else {
        const incT = {
          type: 100, address: this.code || '0001'
        }
        createInc(incT)
      }
    },
    async validate() {
      try {
        await this.$refs['dataForm'].validate()
        await this.$refs.attributeTable.fullValidate()
        this.temp.attribute = this.$refs.attributeTable.getTableData().fullData
        if (this.temp.type === 0) {
          await this.$refs.serialTable.fullValidate()
        } else if (this.temp.type === 1) {
          await this.$refs.loraDataTable.fullValidate()
        }
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
      if (this.temp.type === 0) {
        delete this.temp.loraData
      } else if (this.temp.type === 1) {
        delete this.temp.serialData
      }
      await create(this.temp)
      await this.saveIncAddress()
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
      if (this.temp.hardwareWord && this.temp.hardwareWord._id) {
        this.temp.hardwareWord = this.temp.hardwareWord._id
      }
      this.dialogFormVisible = true
      this.dialogStatus = 'update'
      this.init()
      this.initSubTable()
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
      if (this.temp.type === 0) {
        delete this.temp.loraData
      } else if (this.temp.type === 1) {
        delete this.temp.serialData
      }
      const tempData = Object.assign({}, this.temp)
      updateOne(tempData).then(() => {
        this.saveIncAddress()
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
    insertEvent(table, field) {
      this.$refs[table].insert({}).then(({ row }) => {
        this.$refs[table].setActiveCell(row, field)
      })
    },
    removeEvent(table, row) {
      this.$refs[table].remove(row)
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
