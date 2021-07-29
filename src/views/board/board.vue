<template>
  <div class="app-container">
    <div style="margin-top:10px;width: 100%">
      <el-button @click="masterConnect"> {{ connected?$t('loraMaster.offConnected'):$t('loraMaster.onConnected') }}</el-button>
      <el-button @click="masterDev"> {{ $t('control.title1') }}</el-button>
      <el-button @click="masterProd"> {{ $t('control.title2') }}</el-button>
      <el-button @click="writeConfig"> {{ $t('control.title3') }}</el-button>
      <el-button @click="writeConfig2"> 配置第二主站</el-button>
      <el-button @click="useConfig">当前状态:{{ useType===0?'监测':'扫描' }}</el-button>
      <el-button @click="loraSlaveConfig">从站配置</el-button>
      <!--<el-button> {{ $t('control.title4') }}</el-button>-->
      <!--<el-button> {{ $t('control.title5') }}</el-button>-->
      <!--<el-button> {{ $t('control.title6') }}</el-button>-->
    </div>
    <fieldset class="fieldset-dialog" style="margin-top:10px;">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="90px" style="padding-top:10px">
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
        <el-form-item label="主站名称" prop="name" class="form-item">
          <el-input v-model="temp.name" :placeholder="$t('rules.name')" />
        </el-form-item>
        <el-form-item :label="$t('loraMaster.address')" prop="address" class="form-item">
          <el-input v-model="temp.address" :placeholder="$t('loraMaster.inputAddress')" />
        </el-form-item>
        <!--<el-form-item :label="$t('loraMaster.comName')" prop="comName" class="form-item">-->
        <!--<el-select v-model="temp.comName" :disabled="dialogStatus==='show'" :placeholder="$t('loraMaster.inputComName')" @change="setSerialList(temp.comName)">-->
        <!--<el-option-->
        <!--v-for="item in serialports"-->
        <!--:key="item.value"-->
        <!--:label="item.label"-->
        <!--:value="item.value"-->
        <!--/>-->
        <!--</el-select>-->
        <!--</el-form-item>-->
        <el-form-item label="网关编号" prop="control" class="form-item">
          <el-input v-model="temp.control" />
        </el-form-item>
        <el-form-item label="主站类型" prop="type" class="form-item">
          <el-select v-model="temp.type" filterable :placeholder="$t('rules.types')">
            <el-option
              v-for="type in typeOptions"
              :key="type.value"
              :label="type.label"
              :value="type.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <vxe-table
        ref="loraTable"
        border
        class="vxe-table-element"
        :data.sync="list"
        :edit-config="{key: '_id', trigger: 'click', mode: 'cell', showStatus: true}"
      >
        <vxe-table-column field="frequency" :title="$t('loraMaster.frequency')" :edit-render="{name: 'ElSelect',props:{size:'mini',filterable:true},options: frequencyList, type: 'visible'}" />
        <vxe-table-column field="bandwidth" :title="$t('loraMaster.bandwidth')" :edit-render="{name: 'ElSelect',props:{size:'mini'},options: bwList, type: 'visible'}" />
        <vxe-table-column field="codingrate" :title="$t('loraMaster.codingrate')" :edit-render="{name: 'ElSelect',props:{size:'mini'},options: crList, type: 'visible'}" />
        <vxe-table-column field="factor" :title="$t('loraMaster.factor')" :edit-render="{name: 'ElSelect',props:{size:'mini'},options: factorList, type: 'visible'}" />
      </vxe-table>
      <vxe-table
        ref="loraSecondTable"
        border
        class="vxe-table-element"
        :data.sync="secondList"
        :edit-config="{key: '_id', trigger: 'click', mode: 'cell', showStatus: true}"
      >
        <vxe-table-column field="frequency" :title="$t('loraMaster.frequency')" :edit-render="{name: 'ElSelect',props:{size:'mini'},options: frequencyList, type: 'visible'}" />
        <vxe-table-column field="bandwidth" :title="$t('loraMaster.bandwidth')" :edit-render="{name: 'ElSelect',props:{size:'mini'},options: bwList, type: 'visible'}" />
        <vxe-table-column field="codingrate" :title="$t('loraMaster.codingrate')" :edit-render="{name: 'ElSelect',props:{size:'mini'},options: crList, type: 'visible'}" />
        <vxe-table-column field="factor" :title="$t('loraMaster.factor')" :edit-render="{name: 'ElSelect',props:{size:'mini'},options: factorList, type: 'visible'}" />
      </vxe-table>
      <div style="clear: both" />
      <vxe-table
        ref="serialTable"
        border
        class="vxe-table-element2"
        :data.sync="serialList"
        :edit-config="{key: '_id', trigger: 'click', mode: 'cell', showStatus: true}"
        keep-source="keep-source"
      >
        <vxe-table-column field="comName" :title="$t('com.name')" :edit-render="{name: 'ElSelect',props:{size:'mini'},options: serialports}" />
        <vxe-table-column field="baud" :title="$t('com.baud')" :edit-render="{name: 'ElSelect',props:{size:'mini'},options: baudList}" />
        <vxe-table-column field="verification" :title="$t('com.verification')" :edit-render="{name: 'ElSelect',props:{size:'mini'},options: verificaList}" />
        <vxe-table-column field="stopBit" :title="$t('com.stopBit')" :edit-render="{name: 'ElSelect',props:{size:'mini'},options: stopbitList}" />
        <vxe-table-column field="dataBit" :title="$t('com.dataBit')" :edit-render="{name: 'ElSelect',props:{size:'mini'},options: databitList}" />
      </vxe-table>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="temp._id!==undefined" type="primary" :loading="loading" @click="updateData()">
          {{ $t(&#x27;table.confirm&#x27;) }}
        </el-button>
        <el-button type="primary" :loading="loading" @click="createData()">
          {{ $t(&#x27;table.add&#x27;) }}
        </el-button>
      </div>
    </fieldset>
    <fieldset class="fieldset-dialog" style="margin-top:10px">
      <span style="color:orange">02</span>
      <span style="color:rgb(250,0,255)">82</span>
      <span style="color:green">03</span>
      <span style="color:blue">83</span>
      <el-form ref="form" label-width="90px">
        <el-form-item :label="$t('control.receive')">
          <div style="height:400px;overflow:auto;width: 100%;max-width: 1480px;border:1px solid #eee;padding-left: 20px;font-size:18px" v-html="logger" />
          <!--<el-input-->
          <!--v-model="logger"-->
          <!--type="textarea"-->
          <!--:rows="15"-->
          <!--clearable-->
          <!--:placeholder="$t('control.receive')"-->
          <!--/>-->
        </el-form-item>
        <el-form-item :label="$t('control.sends')">
          <el-row :gutter="20">
            <el-col :span="3">
              <el-checkbox v-model="checkedHex">hex</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-input
                v-model="message1"
                type="textarea"
                :placeholder="$t('control.inputOne')"
              />
            </el-col>
            <el-col :span="2">
              <el-button class="filter-item" type="primary" @click="portWrite(message1)">
                {{ $t('control.sends') }}
              </el-button>
              <el-button class="filter-item" type="primary" @click="cleanWrite()">
                清空
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </fieldset>
    <edit-form ref="EditFrom" />
  </div>
</template>

<script>
import { list, updateOne, create } from '@/api/loraMasters'
import { list as wordList } from '@/api/words'
import { BAUD_RATES, CHECKS, STOP_BITS, DATA_BITS, SFS, BANDWIDTHS, CODERATE, FREQUENCY, SERIAL_PORTS } from '@/utils/constant'
// import DebugPorts from './components/DebugPorts'
import editForm from './edit'
export default {
  name: 'ConfigControl',
  components: { editForm },
  data() {
    return {
      connected: false, // 主站是否连接
      loading: true,
      dialogStatus: 'create',
      controls: [],
      clientId: undefined,
      username: undefined,
      controlId: undefined,
      message1: '',
      temp: {
        type: 3
      },
      checkedHex: true,
      logger: '',
      message2: '',
      loraMasters: [],
      loraMaster: undefined,
      serialports: SERIAL_PORTS,
      typeOptions: [{
        value: 0,
        label: this.$t('loraMaster.LX')
      }, {
        value: 1,
        label: this.$t('loraMaster.JT')
      }, {
        value: 2,
        label: this.$t('loraMaster.WG')
      }, {
        value: 3,
        label: this.$t('loraMaster.SM')
      }],
      serialList: [{ comName: '/dev/ttyAMA0', baud: 9600, verification: 'none', stopBit: 1, dataBit: 8 }],
      baudList: BAUD_RATES,
      verificaList: CHECKS,
      stopbitList: STOP_BITS,
      databitList: DATA_BITS, // 数据位列表
      factorList: SFS, // 扩频因子列表
      bwList: BANDWIDTHS, // 带宽列表
      crList: CODERATE, // 编码率列表
      frequencyList: FREQUENCY, // 频段列表
      list: [{ frequency: '1c222600', bandwidth: '07', factor: '07', codingrate: '01' }],
      secondList: [{ frequency: '1a03a180', bandwidth: '07', factor: '07', codingrate: '01' }],
      useType: 0,
      colorMap: {
        '03': 'green',
        '83': 'blue',
        '02': 'orange',
        '82': 'rgb(250,0,255)'
      }
    }
  },
  async created() {
    this.$socket.open() // 连接socket
    this.loading = false
    this.getList()
  },
  destroyed() {
    this.$socket.close() // 关闭 socket
  },
  sockets: {
    'lora-master.open': function(data) {
      this.loading = false
      if (data.code === 0) {
        this.connected = true
        this.$message({ message: this.$t('loraMaster.message4'), type: 'success' })
      } else if (data.code === 70001) {
        this.$confirm(this.$t('loraMaster.message3'), this.$t('messages.title'), {
          confirmButtonText: this.$t('messages.confirm'),
          cancelButtonText: this.$t('messages.cancel'),
          type: 'warning'
        }).then(() => {
          this.masterConnect(true)
        })
      } else {
        this.$message({ message: `${data.code}:${data.message}`, type: 'error' })
      }
    },
    'lora-master.close': function(data) {
      this.loading = false
      if (data.code === 0) {
        this.connected = false
        this.$message({ message: this.$t('loraMaster.message5'), type: 'success' })
      }
    },
    'lora-master.change-model': function(data) {
      this.loading = false
      if (data.code === 0) {
        this.temp.model = data.data
        this.$message({ message: this.$t('loraMaster.message6') + data.data, type: 'success' })
      } else {
        this.$message({ message: data.message, type: 'error' })
      }
    },
    'lora-master.write-config': function(data) {
      this.loading = false
      if (data.code === 0) {
        this.$message({ message: this.$t('loraMaster.message7'), type: 'success' })
      } else {
        this.$message({ message: data.message, type: 'error' })
      }
    },
    'lora-master.write-config2': function(data) {
      this.loading = false
      if (data.code === 0) {
        this.$message({ message: this.$t('loraMaster.message7'), type: 'success' })
      } else {
        this.$message({ message: data.message, type: 'error' })
      }
    },
    'lora-master.force-close': function(data) {
      this.connected = false
      alert(data.message)
    },
    'lora-master.message': function(data) {
      // const body = `${new Date()}:${data}\n`
      const code = data.substr(12, 2)
      const now = new Date()
      let hour = now.getHours()
      if (hour < 10) {
        hour = '0' + hour
      }
      let minutes = now.getMinutes()
      if (minutes < 10) {
        minutes = '0' + minutes
      }
      let seconds = now.getSeconds()
      if (seconds < 10) {
        seconds = '0' + seconds
      }
      const time = hour + ':' + minutes + ':' + seconds
      console.log(this.colorMap[code])
      const body = '<div style="width:100%;color:' + this.colorMap[code] + '">' + time + '&nbsp;&nbsp;:&nbsp;&nbsp;' + data + '</div>'
      this.logger = body + this.logger
    },
    'lora-slave.lora-node': function(data) {
      console.log(data)
    }
  },
  methods: {
    masterConnect(force = false) { // 开启串口连接
      this.loading = true
      if (!this.connected) {
        this.$socket.emit('lora-master.open', { force, loraMasterId: this.temp._id })
      } else {
        this.$socket.emit('lora-master.close')
      }
    },
    masterDev() {
      this.loading = true
      this.$socket.emit('lora-master.change-model', { model: 'dev' })
    },
    masterProd() {
      this.loading = true
      this.$socket.emit('lora-master.change-model', { model: 'prod' })
    },
    writeConfig() {
      this.loading = true
      this.$socket.emit('lora-master.write-config', { lora: this.list[0], loraMasterId: this.temp._id })
    },
    writeConfig2() {
      this.loading = true
      this.$socket.emit('lora-master.write-config2', { lora: this.secondList[0], loraMasterId: this.temp._id })
    },
    cleanWrite() {
      this.logger = ''
    },
    async useConfig() {
      if (this.useType === 0) {
        this.temp.useType = this.useType = 1
      } else {
        this.temp.useType = this.useType = 0
      }
      await updateOne(this.temp)
      this.$notify({
        title: this.$t('messages.success_title'),
        message: this.$t('messages.update_success'),
        type: 'success',
        duration: 2000
      })
      this.$socket.emit('lora-master.use-config', { force: false, loraMasterId: this.temp._id })
    },
    async getList() {
      const words = (await wordList({ wordType: '6066ac0976587221d6f69b68' })).data.rows
      if (words.length > 0) {
        words.forEach(item => {
          item.label = item.name
        })
        this.frequencyList = words
      }
      this.loraMasters = (await list({})).data.rows
      this.loraMasters.forEach((item) => {
        if (item.status === true) {
          this.temp = item
          this.loraMaster = item
        }
      })
      if (this.temp.loraData != null && this.temp.loraData !== undefined) {
        this.list = [this.temp.loraData]
      }
      if (this.temp.secondLoraData != null && this.temp.secondLoraData !== undefined) {
        this.secondList = [this.temp.secondLoraData]
      }
      if (this.temp.serialData != null && this.temp.serialData !== undefined) {
        this.serialList = [this.temp.serialData]
      }
      this.useType = this.temp.useType
    },
    async updateData() {
      try {
        this.temp.loraData = this.list[0]
        this.temp.secondLoraData = this.secondList[0]
        this.temp.serialData = this.serialList[0]
        await updateOne(this.temp)
        this.getList()
        this.$notify({
          title: this.$t('messages.success_title'),
          message: this.$t('messages.update_success'),
          type: 'success',
          duration: 2000
        })
      } catch (e) {
        console.log(e)
      }
    },
    async createData() {
      try {
        this.temp.loraData = this.list[0]
        this.temp.secondLoraData = this.secondList[0]
        this.temp.serialData = this.serialList[0]
        delete this.temp._id
        create(this.temp).then(() => {
          this.getList()
          this.$notify({
            title: this.$t('messages.success_title'),
            message: this.$t('messages.create_success'),
            type: 'success',
            duration: 2000
          })
        })
      } catch (e) {
        console.log(e)
      }
    },
    changeLoraMaster(loraMaster) {
      this.temp = loraMaster
    },
    async portWrite(message) {
      const match = /^([0-9A-Fa-f]{2})+$/
      if (this.checkedHex) {
        message = message.replace(/\s/g, '')
        if (!match.test(message)) {
          return console.log(this.$t('messages.err_title'))
        }
      }
      this.$socket.emit('lora-master.port-write', { hex: this.checkedHex, message })
    },
    loraSlaveConfig() {
      this.$refs.EditFrom.handleCreate()
    }
  }
}
</script>
<style scoped>
  .form-item{
    float:left;
    width: 33%;
  }
  .vxe-table-element{
    float:left;
    width: 49%;
    margin-bottom:10px;
    margin-left:1%;
  }
  .vxe-table-element2{
    width: 99%;
    margin-bottom:10px;
    margin-left:1%;
  }
  .form-item label{
    padding-left:20px;
  }
  .dialog-footer{
    float:right
  }
</style>
