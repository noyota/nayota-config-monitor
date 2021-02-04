<template>
  <div class="app-container">
    <div style="margin-top:10px;width: 100%">
      <el-button @click="masterConnect"> {{ connected?$t('loraMaster.offConnected'):$t('loraMaster.onConnected') }}</el-button>
    </div>
    <fieldset class="fieldset-dialog" style="margin-top:10px;">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="100px" style="padding-top:10px">
        <el-form-item label="配置项" class="form-item">
          <el-select v-model="set.loraset" placeholder="LORA配置项" value-key="_id" @change="changeLoraMaster">
            <el-option
              v-for="item in loraSets"
              :key="item._id"
              :label="item.name"
              :value="item"
            >
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="LORA类型" prop="type" class="form-item">
          <el-select v-model="set.type" filterable :placeholder="$t('rules.types')">
            <el-option
              v-for="word in words"
              :key="word.value"
              :label="word.name"
              :value="word.value"
            >
              <span style="float: left">{{ word.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ word.value }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('loraMaster.address')" prop="address" class="form-item">
          <el-input v-model="set.address" placeholder="未输入则默认生成" />
        </el-form-item>
      </el-form>
      <vxe-table
        ref="serialTable"
        border
        class="vxe-table-element"
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
      <vxe-table
        ref="loraTable"
        border
        class="vxe-table-element"
        :data.sync="list"
        :edit-config="{key: '_id', mode: 'cell', showStatus: true}"
      >
        <vxe-table-column field="frequency" :title="$t('loraMaster.frequency')" :edit-render="{name: 'ElSelect',props:{disabled:true},options: frequencyList}" />
        <vxe-table-column field="bandwidth" :title="$t('loraMaster.bandwidth')" :edit-render="{name: 'ElSelect',props:{disabled:true},options: bwList}" />
        <vxe-table-column field="codingrate" :title="$t('loraMaster.codingrate')" :edit-render="{name: 'ElSelect',props:{disabled:true},options: crList}" />
        <vxe-table-column field="factor" :title="$t('loraMaster.factor')" :edit-render="{name: 'ElSelect',props:{disabled:true},options: factorList}" />
      </vxe-table>
      <vxe-table
        ref="attributeTable"
        border
        class="vxe-table-element"
        :data.sync="temp.attribute"
        :edit-config="{mode: 'cell', showStatus: true}"
      >
        <vxe-table-column field="key" title="key" :edit-render="{name: 'ElInput',props:{disabled:true}}" />
        <vxe-table-column field="value" title="value" :edit-render="{name: 'ElInput',props:{disabled:true}}" />
        <vxe-table-column field="note" :title="$t('HardWareWord.note')" :edit-render="{name: 'ElInput',props:{disabled:true}}" />
      </vxe-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="loading" @click="send()">
          配置LORA
        </el-button>
        <el-button type="primary" :loading="loading" @click="outConfig()">
          手动退出配置模式
        </el-button>
        <el-button type="primary" :loading="loading" @click="scanCode()">
          手动生成二维码
        </el-button>
      </div>
    </fieldset>
    <fieldset class="fieldset-dialog" style="margin-top:10px">
      <div style="padding-left: 20px;width: 100%">
        <p>
          配置记录
          <el-button class="filter-item" type="primary" size="mini" @click="cleanWrite()">
            清空
          </el-button>
        </p>
        <div style="height:300px;overflow:auto;width: 98%;padding:10px;border:1px solid #eee;font-size:18px" v-html="logger" />
      </div>
    </fieldset>
    <el-dialog
      title="二维码"
      :visible.sync="dialogVisible"
      width="40%"
      style="text-align: center"
    >
      <vxe-table
        ref="serialTable2"
        border
        class="vxe-table-element"
        :data.sync="qr_serial"
        :edit-config="{key: '_id', trigger: 'click', mode: 'cell', showStatus: true}"
        keep-source="keep-source"
      >
        <vxe-table-column field="comName" :title="$t('com.name')" :edit-render="{name: 'ElSelect',props:{size:'mini'},options: serialports}" />
        <vxe-table-column field="baud" :title="$t('com.baud')" :edit-render="{name: 'ElSelect',props:{size:'mini'},options: baudList}" />
        <vxe-table-column field="verification" :title="$t('com.verification')" :edit-render="{name: 'ElSelect',props:{size:'mini'},options: verificaList}" />
        <vxe-table-column field="stopBit" :title="$t('com.stopBit')" :edit-render="{name: 'ElSelect',props:{size:'mini'},options: stopbitList}" />
        <vxe-table-column field="dataBit" :title="$t('com.dataBit')" :edit-render="{name: 'ElSelect',props:{size:'mini'},options: databitList}" />
      </vxe-table>
      <div ref="qrcode" class="qrcode_I" style="margin-bottom: 10px;" />
      <div>{{ text }}</div>
      <div style="margin:20px">
        <el-input-number v-model="print.num" :min="1" label="描述文字" />
        <el-checkbox v-model="print.checked" style="margin-left:10px">相同<span style="font-size:12px;color: #919191;">勾选时打印两张一样的</span></el-checkbox>
      </div>
      <el-button style="margin-top: 10px" type="primary" @click="PrintBegin()">打印</el-button>
      <el-button style="margin-top: 10px" type="primary" @click="PrintBeginAndNext()">打印并配置累加地址</el-button>
    </el-dialog>
  </div>
</template>

<script>
import { list } from '@/api/deviceword'
import { list as IncList, updateOne, create } from '@/api/incAddress'

import QRCode from 'qrcodejs2'
import { list as wordList } from '@/api/words'
import { BAUD_RATES, CHECKS, STOP_BITS, DATA_BITS, SFS, BANDWIDTHS, CODERATE, FREQUENCY, SERIAL_PORTS } from '@/utils/constant'
// import DebugPorts from './components/DebugPorts'
export default {
  name: 'ConfigControl',
  components: { },
  data() {
    return {
      connected: false, // 主站是否连接
      loading: false,
      dialogStatus: 'create',
      message1: '',
      temp: {},
      set: {
        address: undefined
      },
      print: {
        checked: true,
        num: 3
      },
      logger: '',
      message2: '',
      loraSets: [], // lora配置
      words: [], // lora类型
      serialports: SERIAL_PORTS,
      baudList: BAUD_RATES,
      verificaList: CHECKS,
      stopbitList: STOP_BITS,
      databitList: DATA_BITS, // 数据位列表
      factorList: SFS, // 扩频因子列表
      bwList: BANDWIDTHS, // 带宽列表
      crList: CODERATE, // 编码率列表
      frequencyList: FREQUENCY, // 频段列表
      list: [],
      serialList: [{ comName: '/dev/ttyAMA0', baud: 9600, verification: 'none', stopBit: 1, dataBit: 8 }],
      qr_serial: [{ comName: '/dev/uart1', baud: 9600, verification: 'none', stopBit: 1, dataBit: 8 }],
      qrcode: '',
      text: '',
      dialogVisible: false,
      inc: undefined,
      address: '',
      wordMap: {},
      bwMap: {},
      factorMap: {},
      crMap: {},
      frequencyMap: {},
      next: false
    }
  },
  watch: {
    dialogVisible(val) {
      if (val) {
        this.$nextTick(() => {
          this.setQrcode(this.text)
        })
      }
    }
  },
  async created() {
    this.$socket.open() // 连接socket
    this.loading = false
    this.getList()
    this.getIcs()
    this.bwMap = {}
    this.bwList.forEach(item => {
      this.bwMap[item.value] = item
    })
    this.factorMap = {}
    this.factorList.forEach(item => {
      this.factorMap[item.value] = item
    })
    this.crMap = {}
    this.crList.forEach(item => {
      this.crMap[item.value] = item
    })
    this.frequencyMap = {}
    this.frequencyList.forEach(item => {
      this.frequencyMap[item.value] = item
    })
  },
  destroyed() {
    this.$socket.close() // 关闭 socket
  },
  sockets: {
    'lora-set.open_lora': function(data) {
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
    'lora-set.close': function(data) {
      this.loading = false
      if (data.code === 0) {
        this.connected = false
        this.$message({ message: this.$t('loraMaster.message5'), type: 'success' })
      }
    },
    'lora-set.message': function(data) {
      try {
        const m = JSON.parse(data)
        if (m !== undefined) {
          if (m.TYPE !== undefined) {
            this.set.type = this.wordMap[m.TYPE] !== undefined ? this.wordMap[m.TYPE].value : ''
          } else if (m.RCEV !== undefined && m.RCEV === 'OK') {
            this.outConfig()
          } else if (m.CONFIG !== undefined && m.CONFIG === 'OUT') {
            if (this.inc !== undefined) {
              this.inc.address = this.address
              const tempData = Object.assign({}, this.inc)
              updateOne(tempData)
            } else {
              const incT = {
                type: 1, address: this.address || '0001'
              }
              create(incT)
            }
            this.scanCode()
          }
          const time = this.getTime()
          var msg = []
          if (m.CONFIG !== undefined && m.CONFIG === 'IN') {
            msg.push('设备进入配置模式')
          }
          if (m.CONFIG !== undefined && m.CONFIG === 'OUT') {
            msg.push('设备退出配置模式')
          }
          if (m.RCEV !== undefined && m.RCEV === 'OK') {
            msg.push('配置成功')
          }
          if (m.TYPE !== undefined) {
            msg.push('类型' + this.wordMap[m.TYPE].name)
          }
          if (m.SLA !== undefined) {
            msg.push('地址' + m.SLA)
          }
          if (m.FRE !== undefined) {
            m.FRE = m.FRE.toString(16)
            msg.push('频段' + (this.frequencyMap[m.FRE] !== undefined ? this.frequencyMap[m.FRE].label : m.FRE))
          }
          if (m.BW !== undefined) {
            m.BW = '0' + m.BW
            msg.push('带宽' + (this.bwMap[m.BW] !== undefined ? this.bwMap[m.BW].label : m.BW))
          }
          if (m.SF !== undefined) {
            m.SF = m.SF.toString(16)
            while (m.SF.length < 2) {
              m.SF = '0' + m.SF
            }
            msg.push('扩频因子' + (this.factorMap[m.SF] !== undefined ? this.factorMap[m.SF].label : m.FRE))
          }
          if (m.ERR !== undefined) {
            m.ERR = m.ERR.toString(16)
            while (m.ERR.length < 2) {
              m.ERR = '0' + m.ERR
            }
            msg.push('编码率' + (this.crMap[m.ERR] !== undefined ? this.crMap[m.ERR].label : m.ERR))
          }
          const body = '<div style="width:100%;">' + time + '&nbsp;&nbsp;:&nbsp;&nbsp;收到:' + msg.join(',') + '</div>'
          this.logger = this.logger + body
        } else {
          const time = this.getTime()
          const body = '<div style="width:100%;">' + time + '&nbsp;&nbsp;:&nbsp;&nbsp;收到:' + data + '</div>'
          this.logger = this.logger + body
        }
      } catch (e) {
        console.log(e)
      }
    },
    'qrcode.open': function(data) {
      if (data.code === 0) {
        this.printWrite()
      } else {
        this.$message({ message: `${data.code}:${data.message}`, type: 'error' })
      }
    }
  },
  methods: {
    masterConnect(force = false) { // 开启串口连接
      this.loading = true
      if (!this.connected) {
        const serial = this.serialList[0]
        this.$socket.emit('lora-set.open_lora', { force, serialData: serial })
      } else {
        this.$socket.emit('lora-set.close')
      }
    },
    cleanWrite() {
      this.logger = ''
    },
    async getList() {
      this.loraSets = (await list({ type: 1 })).data.rows
      this.words = (await wordList({ wordType: '5d2e7a2974e7fa0b8fed48a5' })).data.rows
      this.words.forEach(item => {
        this.wordMap[item.key] = item
      })
    },
    async getIcs() {
      const incs = (await IncList({ type: 1 })).data.rows
      if (incs.length > 0) {
        this.inc = incs[0]
        this.set.address = (parseInt(this.inc.address, 16) + 1).toString(16)
        while (this.set.address.length < 4) {
          this.set.address = '0' + this.set.address
        }
      }
    },
    changeLoraMaster(loraMaster) {
      this.temp = loraMaster
      if (this.temp.loraData != null && this.temp.loraData !== undefined) {
        this.list = [this.temp.loraData]
      }
    },
    getTime() {
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
      return hour + ':' + minutes + ':' + seconds
    },
    getDY() {
      const now = new Date()
      let year = now.getFullYear()
      year = year.toString().substr(2, 2)
      let month = now.getMonth() + 1
      if (month < 10) {
        month = '0' + month
      }
      let day = now.getDate()
      if (day < 10) {
        day = '0' + day
      }
      return year + month + day
    },
    async send() {
      if (this.set.address === '' && this.set.address === undefined) {
        try {
          const incs = (await IncList({ type: 1 })).data.rows
          if (incs.length > 0) {
            this.inc = incs[0]
            this.address = (parseInt(this.inc.address, 16) + 1).toString(16)
            while (this.address.length < 4) {
              this.address = '0' + this.address
            }
          } else {
            this.address = '0001'
          }
        } catch (e) {
          this.address = '0001'
        }
      } else {
        this.address = this.set.address
      }
      if (this.temp.loraData === undefined) {
        this.$message({ message: 'lora设定的频段带宽不能为空', type: 'error' })
        return
      }
      const message = {}
      message.SLA = this.address
      message.FRE = parseInt(this.temp.loraData.frequency, 16)
      message.BW = parseInt(this.temp.loraData.bandwidth)
      message.ERR = parseInt(this.temp.loraData.codingrate)
      message.SF = parseInt(this.temp.loraData.factor)
      const time = this.getTime()
      var msg = []
      if (this.temp.loraData.frequency !== undefined) {
        var frequency = this.temp.loraData.frequency
        msg.push('频段' + (this.frequencyMap[frequency] !== undefined ? this.frequencyMap[frequency].label : frequency))
      }
      if (this.temp.loraData.bandwidth !== undefined) {
        var bandwidth = this.temp.loraData.bandwidth
        msg.push('带宽' + (this.bwMap[bandwidth] !== undefined ? this.bwMap[bandwidth].label : bandwidth))
      }
      if (this.temp.loraData.factor !== undefined) {
        var factor = this.temp.loraData.factor
        msg.push('扩频因子' + (this.factorMap[factor] !== undefined ? this.factorMap[factor].label : factor))
      }
      if (this.temp.loraData.codingrate !== undefined) {
        var codingrate = this.temp.loraData.codingrate
        msg.push('编码率' + (this.crMap[codingrate] !== undefined ? this.crMap[codingrate].label : codingrate))
      }
      const body = '<div style="width:100%;">' + time + '&nbsp;&nbsp;:&nbsp;&nbsp;发出:' + msg.join(',') + '</div>'
      this.logger = this.logger + body
      this.$socket.emit('lora-set.port-write', { hex: true, message: JSON.stringify(message) })
    },
    async outConfig() {
      const message = {
        'STATE': 1
      }
      const time = this.getTime()
      const body = '<div style="width:100%;">' + time + '&nbsp;&nbsp;:&nbsp;&nbsp;发出:' + '推出配置模式' + '</div>'
      this.logger = this.logger + body
      this.$socket.emit('lora-set.port-write', { hex: true, message: JSON.stringify(message) })
    },
    scanCode() {
      if (this.set.loraset === undefined) {
        this.$message({ message: '请选择LORA配置项', type: 'error' })
        return
      }
      if (this.set.address !== undefined) {
        this.address = this.set.address
      }
      let l = (this.address.length / 2).toString(16)
      while (l.length < 2) {
        l = '0' + l
      }
      this.text = this.getDY() + this.set.loraset.code + l + this.address
      this.dialogVisible = true
      this.next = false
    },
    setQrcode(text) {
      if (this.qrcode === '') {
        this.qrcode = new QRCode(this.$refs.qrcode, {
          text: text, // 二维码内容
          width: 200,
          height: 200,
          padding: '50',
          colorDark: '#333333', // 二维码颜色
          colorLight: '#ffffff', // 二维码背景色
          correctLevel: QRCode.CorrectLevel.L// 容错率，L/M/H
        })
      } else {
        this.qrcode.clear()
        this.qrcode.makeCode(text)
      }
    },
    printConnect(force = false) {
      const serial = this.qr_serial[0]
      this.$socket.emit('qrcode.open', { force, serialData: serial })
    },
    async printWrite() {
      if (this.print.num === undefined) {
        this.$message({ message: '请输入打印张数', type: 'error' })
        return
      }
      const nums = []
      const i = parseInt(this.print.num / 2)
      for (let m = 0; m < i; m++) {
        nums.push(2)
      }
      if (this.print.num % 2 > 0) {
        nums.push(1)
      }
      let address = this.set.address
      // eslint-disable-next-line no-unused-vars
      for await (const item of nums) {
        console.log(item)
        let message = ''
        if (item === 2) {
          if (this.print.checked) {
            let l = (address.length / 2).toString(16)
            while (l.length < 2) {
              l = '0' + l
            }
            const text1 = this.getDY() + this.set.loraset.code + l + address
            const t_l = parseInt((320 - text1.length * 12) / 2)
            message = '^XA^JMA^LL320^PW460^MD0^PR3^POI^LRN^LH0,0^CI26' +
              '^FO10,' + t_l + '^A0R,28,28^FD' + text1 + '^FS' +
              '^FO45,92^BQN,2,5^FDHM,B0200 ' + text1 + '^FS' +
              '^FO270,' + t_l + '^A0R,28,28^FD' + text1 + '^FS' +
              '^FO305,92^BQN,2,5^FDHM,B0200 ' + text1 + '^FS' +
              '^XZ'
            this.$socket.emit('qrcode.write', { message })
          } else {
            let l = (address.length / 2).toString(16)
            while (l.length < 2) {
              l = '0' + l
            }
            const text1 = this.getDY() + this.set.loraset.code + l + address
            const t_l = parseInt((320 - text1.length * 12) / 2)
            address = (parseInt(address, 16) + 1).toString(16)
            while (address.length < 4) {
              address = '0' + address
            }
            const text2 = this.getDY() + this.set.loraset.code + l + address
            const t_l2 = parseInt((320 - text2.length * 12) / 2)
            message = '^XA^JMA^LL320^PW460^MD0^PR3^POI^LRN^LH0,0^CI26' +
              '^FO10,' + t_l + '^A0R,28,28^FD' + text1 + '^FS' +
              '^FO45,92^BQN,2,5^FDHM,B0200 ' + text1 + '^FS' +
              '^FO270,' + t_l2 + '^A0R,28,28^FD' + text2 + '^FS' +
              '^FO305,92^BQN,2,5^FDHM,B0200 ' + text2 + '^FS' +
              '^XZ'
            this.$socket.emit('qrcode.write', { message })
          }
        } else {
          while (address.length < 4) {
            address = '0' + address
          }
          let l = (address.length / 2).toString(16)
          while (l.length < 2) {
            l = '0' + l
          }
          const text1 = this.getDY() + this.set.loraset.code + l + address
          const t_l = parseInt((320 - text1.length * 12) / 2)
          message = '^XA^JMA^LL320^PW460^MD0^PR3^POI^LRN^LH0,0^CI26' +
            '^FO10,' + t_l + '^A0R,28,28^FD' + text1 + '^FS' +
            '^FO45,92^BQN,2,5^FDHM,B0200 ' + text1 + '^FS' +
            '^XZ'
          this.$socket.emit('qrcode.write', { message })
        }
        address = (parseInt(address, 16) + 1).toString(16)
      }
      this.printEnd()
    },
    async PrintBegin() {
      if (this.connected) {
        this.$socket.emit('lora-set.close')
      }
      this.printConnect()
    },
    async printEnd() {
      this.$socket.emit('qrcode.close')
      this.dialogVisible = false
      if (this.next === true) {
        this.set.address = (parseInt(this.address, 16) + 1).toString(16)
        while (this.set.address.length < 4) {
          this.set.address = '0' + this.set.address
        }
        this.next = false
      }
      this.masterConnect()
    },
    async PrintBeginAndNext() {
      this.next = true
      if (this.connected) {
        this.$socket.emit('lora-set.close')
      }
      this.printConnect()
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
    width: 99%;
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
    float:left;
    margin-left:1%;
  }
</style>
