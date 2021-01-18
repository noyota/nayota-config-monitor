<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <el-dialog
    :title="textMap[dialogStatus]"
    :visible.sync="dialogFormVisible"
    width="65%"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    @open="dialogOpen"
    @close="dialogClose"
  >
    <fieldset v-loading="loading" class="fieldset-dialog">
      <p>{{ $t('loraSlave.message1') }}</p>
      <el-button @click="connect()">{{ connected?$t('loraSlave.off'):$t('loraSlave.on') }}</el-button>
      <el-button v-if="temp.secondMaster" @click="connect(undefined,true)">{{ connected?$t('loraSlave.cOff'):$t('loraSlave.cOn') }}</el-button>
      <el-button @click="writeConfig">{{ $t('loraSlave.message2') }}</el-button>
      <el-button @click="closeConfig">{{ $t('loraSlave.message3') }}</el-button>
      <!--<el-button @click="broadcast">{{ $t('loraSlave.message4') }}</el-button>-->
      <el-button @click="encodeConfig">{{ $t('loraSlave.message_config') }}</el-button>
      <p>{{ $t('loraSlave.message5') }}：{{ temp.status===0?$t('loraSlave.ZC'):$t('loraSlave.PZ') }}</p>
    </fieldset>
    <fieldset class="fieldset-dialog">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="110px" style="padding-top:10px">
        <el-form-item :label="$t('loraSlave.agreement')" prop="agreement" class="form-item">
          <el-select v-model="temp.agreement" filterable @change="changeAgreement(temp.agreement)">
            <el-option
              v-for="agreement in agreements"
              :key="agreement._id"
              :label="agreement.name"
              :value="agreement._id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('loraSlave.hardwareWord')" prop="hardwareWord" class="form-item">
          <el-select v-model="temp.hardwareWord" filterable @change="changeHardWord(temp.hardwareWord)">
            <el-option
              v-for="hardwareWord in hardwareWords"
              :key="hardwareWord._id"
              :label="hardwareWord.name"
              :value="hardwareWord._id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="主站列表" class="form-item">
          <el-select v-model="loraMaster" :placeholder="$t('loraMaster.message')" value-key="_id" @change="changeLoraMaster">
            <el-option
              v-for="item in loraMasters"
              :key="item._id"
              :label="item.name"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="主站编号" prop="loraMaster" class="form-item">
          <el-input v-model="temp.loraMaster" />
        </el-form-item>
        <el-form-item :label="$t('loraSlave.shortAddress')" prop="shortAddress" class="form-item">
          <el-input v-model="temp.shortAddress" :placeholder="$t('loraSlave.inputShortAddress')" />
        </el-form-item>
      </el-form>
    </fieldset>
    <fieldset class="fieldset-dialog" style="margin-top:10px">
      <p style="font-size: 16px;">{{ $t('loraSlave.message6') }}</p>
      <vxe-table
        ref="attributeTable"
        class="vxe-table-element"
        border
        :data.sync="temp.attribute"
        :edit-config="{trigger: 'click', mode: 'cell'}"
      >
        <vxe-table-column field="key" :title="$t('loraSlave.key')" :edit-render="{name: 'ElInput',props:{size:'mini'}}" />
        <vxe-table-column field="value" :title="$t('loraSlave.value')" :edit-render="{name: 'ElInput',props:{size:'mini'}}" />
        <vxe-table-column field="note" :title="$t('loraSlave.note')" :edit-render="{name: 'ElInput',props:{size:'mini'}}" />
      </vxe-table>
    </fieldset>
    <fieldset class="fieldset-dialog" style="margin-top:10px">
      <p style="font-size: 16px;">{{ $t('loraSlave.message7') }}</p>
      <div class="click-table1-oper">
        <el-button type="success" size="small" :disabled="list.length>0" @click="insertEvent">{{ $t('table.addC') }}</el-button>
      </div>
      <vxe-table
        ref="loraDataTable"
        border
        class="vxe-table-element"
        :data.sync="list"
        :edit-config="{trigger: 'click', mode: 'cell'}"
      >
        <vxe-table-column field="frequency" :title="$t('loraSlave.frequency')" :edit-render="{name: 'ElSelect',props:{size:'mini'},options: frequencyList, type: 'visible'}" />
        <vxe-table-column field="bandwidth" :title="$t('loraSlave.bandwidth')" :edit-render="{name: 'ElSelect',props:{size:'mini'},options: bwList, type: 'visible'}" />
        <vxe-table-column field="codingrate" :title="$t('loraSlave.codingrate')" :edit-render="{name: 'ElSelect',props:{size:'mini'},options: crList, type: 'visible'}" />
        <vxe-table-column field="factor" :title="$t('loraSlave.factor')" :edit-render="{name: 'ElSelect',props:{size:'mini'},options: factorList, type: 'visible'}" />
      </vxe-table>
    </fieldset>
  </el-dialog>
</template>

<script>
import { create, updateOne } from '@/api/loraSlaves'
import { list as wordList } from '@/api/words'
import { list as agreementList } from '@/api/agreement'
import { list as hardwareWordList } from '@/api/hardwareword'
import { SFS, BANDWIDTHS, CODERATE, FREQUENCY } from '@/utils/constant'
import { parseInterval } from '@/utils'
// 控制器和监测器的展示和简单修改 子表单
import { list } from '@/api/loraMasters'
export default {
  name: 'LoraSlaveForm',
  data() {
    return {
      control: undefined, // 中控对象
      loraMaster: undefined, // 主站对象
      connected: false, // 串口连接状态
      loading: false,
      textMap: {
        update: this.$t('dialog.update'),
        create: this.$t('dialog.create')
      },
      list: [],
      factorList: SFS, // 扩频因子列表
      bwList: BANDWIDTHS, // 带宽列表
      crList: CODERATE, // 编码率列表
      frequencyList: FREQUENCY, // 频段列表
      temp: {},
      createTemp: {
        line: false,
        attribute: []
      },
      oldTemp: {},
      hardwareWords: undefined,
      thingModels: undefined,
      loraMasters: undefined,
      secondMasters: undefined,
      words: undefined,
      agreements: undefined,
      dialogFormVisible: false,
      dialogStatus: undefined,
      operates: [],
      checks: [],
      rules: {
        shortAddress: [{ required: true, message: this.$t('rules.name'), trigger: 'blur' }],
        loraMaster: [{ required: true, message: this.$t('rules.loraMaster'), trigger: 'blur' }],
        agreement: [{ required: true, message: this.$t('rules.loraMaster'), trigger: 'blur' }],
        // thingModel: [{ required: true, message: '请选择物模型', trigger: 'blur' }],
        hardwareWord: [{ required: true, message: this.$t('rules.hardwareWord'), trigger: 'blur' }]
      },
      scanCode: '',
      dialogLoading: false
    }
  },
  sockets: {
    'lora-slave.open': function(data) {
      this.loading = false
      if (data.code === 0) {
        this.connected = true
        this.$message({ message: this.$t('messages.open_success'), type: 'success' })
        // 主站进入配置模式 延时2秒 为了躲过PORT_BUSY 因为轮训会有个延时,单条指令最大为2000毫秒
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.$socket.emit('lora-master.change-model', { model: 'dev' })
        }, 2000)
      } else if (data.code === 70001) {
        this.$confirm(this.$t('messages.serial_title'), this.$t('messages.title'), {
          confirmButtonText: this.$t('messages.confirm'),
          cancelButtonText: this.$t('messages.cancel'),
          type: 'warning'
        }).then(() => {
          this.connect(true)
        })
      } else {
        this.$message({ message: `${data.code}:${data.message}`, type: 'error' })
      }
    },
    'lora-slave.close': function(data) {
      this.loading = false
      if (data.code === 0) {
        this.connected = false
        this.$message({ message: this.$t('messages.close_serial'), type: 'success' })
      }
    },
    'lora-slave.lora-node': function(data) {
      console.log(data)
      this.$message({ message: this.$t('messages.lora_node'), type: 'success' })
      if (data.isNew) { // TODO 新设备 两种情况 替换当前设备和新增 根据当前temp的_id和type判断
        if (this.temp._id == null || this.temp.type !== data.type) {
          this.$confirm(this.$t('messages.new_lora_title'), this.$t('messages.title'), {
            confirmButtonText: this.$t('messages.confirm'),
            cancelButtonText: this.$t('messages.cancel'),
            type: 'warning'
          }).then(async() => {
            const code = this.words.filter(item => item.key === data.type)[0]
            const agreement = this.agreements.filter(item => item.name === code.value)[0]
            const hardwareWord = this.hardwareWords.filter(item => item.agreement === agreement._id)[0]
            this.temp = {
              ...this.temp,
              type: data.type,
              loraData: this.loraMaster.loraData,
              agreement: agreement._id,
              hardwareWord: hardwareWord._id,
              attribute: hardwareWord.attribute
            }
            this.list = [this.temp.loraData]
          })
        } else {
          this.$alert(this.$t('messages.change_lora'), this.$t('messages.title'))
        }
      }
    },
    'lora-slave.write-config': function(data) {
      if (data.code === 0) {
        this.$message({ message: this.$t('messages.write_success'), type: 'success' })
      } else {
        this.$message({ message: data.message, type: 'error' })
      }
    },
    'lora-slave.close-config': function(data) {
      if (data.code === 0) {
        this.$message({ message: this.$t('messages.out_serial'), type: 'success' })
        this.temp.status = 0
      } else {
        this.$message({ message: `${data.code}:${data.message}`, type: 'error' })
      }
    },
    'lora-slave.encode-config': function(data) {
      if (data.code === 0) {
        this.$message({ message: this.$t('messages.out_serial'), type: 'success' })
        this.temp.status = 0
      } else {
        this.$message({ message: `${data.code}:${data.message}`, type: 'error' })
      }
    }
  },
  watch: {
    'temp.hardwareWord': function(val, oldVal) {
      this.oldTemp.hardwareWord = oldVal
    }
  },
  methods: {
    parseInterval: parseInterval,
    async dialogOpen() {
      this.operates = []
      this.checks = []
    },
    dialogClose() {
      this.loading = false
      if (this.connected) {
        this.$socket.emit('lora-master.change-model', { model: 'prod' })
        this.$socket.emit('lora-slave.close')
      }
      this.checks.map(item => {
        this.sockets.unsubscribe(item._id) // 页面关闭收必须退订函数中自己加的订阅
      })
      this.operates.map(item => {
        this.sockets.unsubscribe(item._id) // 页面关闭收必须退订函数中自己加的订阅
      })
    },
    connect(force = false, second = false) {
      this.loading = true
      if (this.connected) {
        this.$socket.emit('lora-master.change-model', { model: 'prod' })
        this.$socket.emit('lora-slave.close')
      } else {
        this.$socket.emit('lora-slave.open', { loraMasterId: this.temp.loraMasterId, force })
      }
    },
    changeLoraMaster(loraMaster) {
      this.temp.loraMaster = loraMaster.control
      this.temp.loraMasterId = loraMaster._id
    },
    writeConfig() {
      this.$socket.emit('lora-slave.write-config', this.temp)
    },
    closeConfig() {
      this.$socket.emit('lora-slave.close-config')
    },
    broadcast() {
      this.$socket.emit('lora-slave.broadcast', this.temp)
    },
    encodeConfig() {
      this.$socket.emit('lora-slave.encode-config', this.temp)
    },
    fkBeId(row) { // 外键统一转_id
      if (row.hardwareWord && row.hardwareWord._id) row.hardwareWord = row.hardwareWord._id
      if (row.agreement && row.agreement._id) row.agreement = row.agreement._id
      if (row.loraMaster && row.loraMaster._id) row.loraMaster = row.loraMaster._id
      if (row.secondMaster && row.secondMaster._id) row.secondMaster = row.secondMaster._id
      if (row.control && row.control._id) row.control = row.control._id
      if (row.children && row.children.length > 0) row.children = []
      if (row.children2 && row.children2.length > 0) row.children2 = []
    },
    async loadSelectData() {
      this.words = (await wordList({ wordType: '5d2e7a2974e7fa0b8fed48a5' })).data.rows
      this.hardwareWords = (await hardwareWordList({ type: 1, autopopulate: false })).data.rows
      this.agreements = (await agreementList({ type: 2, autopopulate: false })).data.rows
    },
    async handleCreate() { // 新建
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(async() => {
        this.temp = { ...this.createTemp }
        this.loraMasters = (await list({})).data.rows
        this.loraMasters.forEach((item) => {
          if (item.status === true) {
            this.temp.loraMaster = item.control
            this.loraMaster = item
            this.temp.loraMasterId = item._id
          }
        })
        this.loadSelectData()
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
    async handleUpdate(row) {
      this.temp = { ...row } // 复制一个
      this.loraMasters = [this.temp.loraMaster]
      this.list = [this.temp.loraData]
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.loadSelectData()
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
        this.loraMaster = row.loraMaster
        this.control = row.control
        this.fkBeId(this.temp)
      })
    },
    updateData() { // 更新
      this.dialogLoading = true
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateOne(this.temp).then(() => {
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
    async changeHardWord(row) {
      const obj = this.hardwareWords.filter(item => item._id === row)[0]
      if (obj.agreement !== this.temp.agreement) {
        await this.$alert(this.$t('messages.xy_not_title'), this.$t('messages.err_title'))
        this.temp.hardwareWord = this.oldTemp.hardwareWord
        return
      }
      if (obj !== null && obj.attribute !== undefined && typeof obj.attribute === 'object') {
        this.temp.attribute = obj.attribute
      } else {
        this.temp.attribute = []
      }
    },
    async changeAgreement(row) {
      this.hardwareWords = (await hardwareWordList({ type: 1, agreement: row, autopopulate: false })).data.rows
      this.temp.hardwareWord = null
    },
    insertEvent() {
      this.$refs['loraDataTable'].insert({
      }).then(({ row }) => {
        this.$refs['loraDataTable'].setActiveCell(row, 'frequency')
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
.el-select{
  width: 100%;
}
</style>
