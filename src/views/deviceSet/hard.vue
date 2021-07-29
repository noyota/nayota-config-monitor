<template>
  <div class="app-container">
    <div style="margin-top:10px;width: 100%">
      <el-button @click="masterConnect"> {{ connected?$t('loraMaster.offConnected'):$t('loraMaster.onConnected') }}</el-button>
    </div>
    <fieldset class="fieldset-dialog" style="margin-top:10px;">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="88px" style="padding-top:10px">
        <el-row style="width:49%;float: left">
          <el-col>
            <el-form-item label="设备类型" class="form-item" style="width: 90%;margin-right: 1%;">
              <el-select v-model="set.hardset" placeholder="设备类型" value-key="_id" @change="changeSet">
                <el-option
                  v-for="item in sets"
                  :key="item._id"
                  :label="item.name"
                  :value="item"
                >
                  <span style="float: left">{{ item.name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item v-if="set.changeAddr" label="新地址" prop="newAddr" class="form-item" style="width:90%;margin-right: 1%;">
              <el-input v-model="set.newAddr" placeholder="新地址" style="width:100%;float: left;" />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="设备字典" prop="type" class="form-item" style="width: 90%;margin-right: 1%;">
              <el-select v-model="set.hardwareWord" placeholder="设备字典" disabled>
                <el-option
                  v-for="item in hardwareWords"
                  :key="item._id"
                  :label="item.name"
                  :value="item._id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="数据格式" prop="address" class="form-item">
              <el-select v-model="datatype" filterable :placeholder="$t('rules.types')">
                <el-option
                  v-for="word in datatypes"
                  :key="word.value"
                  :label="word.name"
                  :value="word.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-button v-if="set.changeAddr" style="margin-left:20px" type="primary" :loading="loading" @click="writeConfig()">
            配置设备
          </el-button>
          <el-button type="primary" :loading="loading" @click="scanCode()">
            手动生成二维码
          </el-button>
        </el-row>
        <el-row style="width:49%;float: left">
          <el-col style="margin:0px 0 20px 20px">
            <el-link type="primary" style="font-size:12px;color:blue" name="1" @click="changeModel">{{ super_model===true?'隐藏高级配置':'高级配置' }}</el-link>
          </el-col>
          <el-col v-if="super_model">
            <el-form-item label="搜索地址" prop="startAddr" class="form-item" style="width: 79%;margin-right: 1%;">
              <el-input v-model="set.startAddr" style="width:45%;float: left;" placeholder="开始地址" />
              <span style="width: 10%;text-align: center;float: left;">-</span>
              <el-input v-model="set.endAddr" style="width:45%;float: left;" placeholder="结束地址" />
            </el-form-item>
            <el-button type="primary" style="margin-left: 1%" @click="find">搜索</el-button>
          </el-col>
          <el-col v-if="super_model">
            <el-form-item label="老地址" prop="oldAddr" class="form-item" style="width: 90%;margin-right: 1%;">
              <el-input v-model="set.oldAddr" placeholder="老地址" style="width:100%;float: left;" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <vxe-table
        ref="serialTable"
        border
        class="vxe-table-element"
        :data.sync="serialList"
        style="margin-top: 20px;"
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
        <el-checkbox v-model="print.checked" style="margin-left:10px">勾选时设定相同2张为一份</el-checkbox><br>
        <el-input-number v-model="print.num" :min="1" label="打印份数" />
      </div>
      <el-button style="margin-top: 10px" type="primary" @click="PrintBegin()">打印</el-button>
      <el-button style="margin-top: 10px" type="primary" @click="PrintBeginAndNext()">打印并配置累加地址</el-button>
    </el-dialog>
  </div>
</template>

<script>
import { list } from '@/api/deviceword'
import QRCode from 'qrcodejs2'
import { list as wordList } from '@/api/words'
import { list as hardwareWordList } from '@/api/hardwareword'
import { list as IncList, create, updateOne } from '@/api/incAddress'
import { BAUD_RATES, CHECKS, STOP_BITS, DATA_BITS, SFS, BANDWIDTHS, CODERATE, FREQUENCY, SERIAL_PORTS } from '@/utils/constant'
// import DebugPorts from './components/DebugPorts'
export default {
  name: 'Hard',
  components: { },
  data() {
    return {
      connected: false, // 主站是否连接
      loading: false,
      dialogStatus: 'create',
      message1: '',
      temp: {},
      set: {
        changeAddr: true,
        oldAddr: '',
        newAddr: ''
      },
      print: {
        checked: true,
        num: 1
      },
      logger: '',
      message2: '',
      sets: [], // lora配置
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
      hardwareWords: [],
      super_model: false,
      next: false,
      dataJSON: '',
      datatypes: [{ value: 'string', name: '配置' }, { value: 'json', name: '参数' }],
      datatype: 'json'
    }
  },
  watch: {
    dialogVisible(val) {
      if (val) {
        this.$nextTick(() => {
          if (this.datatype === 'json') {
            var address = this.set.newAddr
            while (address.length < this.temp.addressLength) {
              address = '0' + address
            }
            this.setQrcode(this.dataJSON + address)
          } else {
            this.setQrcode(this.text)
          }
        })
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
    'hard-set.open': function(data) {
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
    'hard-set.close': function(data) {
      this.loading = false
      if (data.code === 0) {
        this.connected = false
        this.$message({ message: this.$t('loraMaster.message5'), type: 'success' })
      }
    },
    'hard-set.find': function(data) {
      if (data.code === 0) {
        const res = data.data
        this.set.changeAddr = res.changeAddr
        this.set.oldAddr = res.shortAddress
      } else {
        this.$message({ message: `${data.code}:${data.message}`, type: 'error' })
      }
    },
    'hard-set.write-config': function(data) {
      if (data.code === 0) {
        const res = data.data
        this.set.changeAddr = res.changeAddr
        this.set.oldAddr = res.shortAddress
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
      } else {
        this.$message({ message: `${data.code}:${data.message}`, type: 'error' })
      }
    },
    'hard-set.message': function(data) {
      let type = '收到'
      try {
        const m = JSON.parse(data)
        if (m.send !== undefined) {
          type = '发送'
        }
        const time = this.getTime()
        const body = '<div style="width:100%;">' + time + type + ':' + data + '</div>'
        this.logger = this.logger + body
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
    changeModel() {
      this.super_model = !this.super_model
    },
    masterConnect(force = false) { // 开启串口连接
      if (this.set.hardset === undefined) {
        this.$message({ message: '请选择设备配置项', type: 'error' })
        return
      }
      this.loading = true
      if (!this.connected) {
        const serial = this.serialList[0]
        this.$socket.emit('hard-set.open', { force, serialData: serial, hardwareWordId: this.set.hardwareWord })
      } else {
        this.$socket.emit('hard-set.close')
      }
    },
    find() {
      if (!this.connected) {
        this.$message({ message: '请先开启串口连接', type: 'error' })
        return
      }
      this.$socket.emit('hard-set.find', {
        startAddr: this.set.startAddr,
        endAddr: this.set.endAddr
      })
    },
    writeConfig() {
      if (this.set.newAddr === undefined) {
        this.$message({ message: '请输入设备新地址', type: 'error' })
        return
      }
      if (this.set.oldAddr === undefined) {
        this.$message({ message: '请输入设备地址', type: 'error' })
        return
      }
      while (this.set.oldAddr.length < 2) {
        this.set.oldAddr = '0' + this.set.oldAddr
      }
      while (this.set.newAddr.length < 2) {
        this.set.newAddr = '0' + this.set.newAddr
      }
      this.$socket.emit('hard-set.write-config', { 'oldAddr': this.set.oldAddr, 'shortAddress': this.set.newAddr })
    },
    read() {
      if (!this.connected) {
        this.$message({ message: '请先开启串口连接', type: 'error' })
        return
      }
      this.$socket.emit('hard-set.read', { _id: this.temp._id })
    },
    cleanWrite() {
      this.logger = ''
    },
    async getList() {
      this.sets = (await list({ type: 0 })).data.rows
      this.hardwareWords = (await hardwareWordList({ autopopulate: false })).data.rows
      this.words = (await wordList({ wordType: '5d2e7a2974e7fa0b8fed48a5' })).data.rows
      const words = (await wordList({ wordType: '6066ac0976587221d6f69b68' })).data.rows
      if (words.length > 0) {
        words.forEach(item => {
          item.label = item.name
        })
        this.frequencyList = words
      }
    },
    async changeSet(loraMaster) {
      this.temp = loraMaster
      if (loraMaster.hardwareWord && loraMaster.hardwareWord._id) {
        this.set.hardwareWord = loraMaster.hardwareWord._id
        this.set.type = loraMaster.hardwareWord.code
      }
      const incs = (await IncList({ type: 2, deviceWord: this.temp.address })).data.rows
      if (incs.length > 0) {
        this.inc = incs[0]
        this.set.newAddr = (parseInt(incs[0].address, 16) + 1).toString(16)
      } else {
        this.set.newAddr = '1'
      }
      if (this.temp.addressLength === undefined) {
        this.temp.addressLength = 2
      }
      while (this.set.newAddr.length < this.temp.addressLength) {
        this.set.newAddr = '0' + this.set.newAddr
      }
      if (this.temp.serialData != null && this.temp.serialData !== undefined) {
        this.serialList.forEach(item => {
          item.baud = this.temp.serialData.baud
          item.verification = this.temp.serialData.verification
          item.stopBit = this.temp.serialData.stopBit
          item.dataBit = this.temp.serialData.dataBit
        })
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
    async outConfig() {
      const message = {
        'STATE': 1
      }
      const time = this.getTime()
      const body = '<div style="width:100%;">' + time + '&nbsp;&nbsp;:&nbsp;&nbsp;发出:' + JSON.stringify(message) + '</div>'
      this.logger = this.logger + body
      this.$socket.emit('hard-set.port-write', { hex: true, message: JSON.stringify(message) })
    },
    scanCode() {
      if (this.set.hardset === undefined) {
        this.$message({ message: '请选择设备配置项', type: 'error' })
        return
      }
      if (this.set.newAddr === undefined) {
        this.$message({ message: '设备地址不能为空', type: 'error' })
        return
      }
      let l = (this.set.newAddr.length / 2).toString(16)
      while (l.length < 2) {
        l = '0' + l
      }
      this.dataJSON = this.getDY() + 'H#'
      if (this.set.hardset.hardwareWord) {
        this.dataJSON += this.set.hardset.hardwareWord.code + '#'
      }
      this.dataJSON += this.set.hardset.type + '#'
      this.dataJSON += this.set.hardset.serialData.baud + '#'
      this.dataJSON += this.set.hardset.serialData.verification + '#'
      this.dataJSON += this.set.hardset.serialData.stopBit + '#'
      this.dataJSON += this.set.hardset.serialData.dataBit + '#'
      this.text = this.getDY() + this.set.hardset.code + l + this.set.newAddr
      this.dialogVisible = true
    },
    setQrcode(text) {
      if (this.qrcode === '') {
        this.qrcode = new QRCode(this.$refs.qrcode, {
          text: text, // 二维码内容
          width: 200,
          height: 200,
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
      let address = this.set.newAddr
      if (this.print.checked) {
        var _this = this
        // eslint-disable-next-line no-unused-vars
        const print = function(i) {
          if (i < _this.print.num) {
            address = (parseInt(_this.set.newAddr, 16) + i).toString(16)
            while (address.length < _this.temp.addressLength) {
              address = '0' + address
            }
            let l = (address.length / 2).toString(16)
            while (l.length < 2) {
              l = '0' + l
            }
            let text1 = this.getDY() + _this.set.hardset.code + l + address
            let text2 = ''
            var size = 5
            if (this.datatype === 'json') {
              text1 = this.dataJSON + address
              size = 3
            } else {
              size = 5
            }
            text2 = text1
            let message = '^XA^JMA^LL320^PW460^MD0^PR3^POI^LRN^LH0,0^CI26'
            if (text2.length > 48) {
              text2 = text2.substring(0, 48)
            }
            if (text2.length > 24) {
              var t1 = text2.substr(0, 24)
              const t1_l = parseInt((322 - t1.length * 12) / 2)
              var t2 = text2.substr(24, text2.length)
              const t2_l = parseInt((322 - t2.length * 12) / 2)
              message += '^FO0,' + t2_l + '^A0R,28,28^FD' + t2 + '^FS'
              message += '^FO25,' + t1_l + '^A0R,28,28^FD' + t1 + '^FS'
              message += '^FO60,92^BQN,2,' + size + '^FDHM,B0200 ' + text2 + '^FS'
              message += '^FO270,' + t2_l + '^A0R,28,28^FD' + t2 + '^FS'
              message += '^FO295,' + t1_l + '^A0R,28,28^FD' + t1 + '^FS'
              message += '^FO340,92^BQN,2,' + size + '^FDHM,B0200 ' + text2 + '^FS'
            } else {
              const t_l = parseInt((322 - text2.length * 12) / 2)
              message += '^FO10,' + t_l + '^A0R,28,28^FD' + text2 + '^FS'
              message += '^FO270,' + t_l + '^A0R,28,28^FD' + text2 + '^FS'
              message += '^FO45,92^BQN,2,' + size + '^FDHM,B0200 ' + text2 + '^FS'
              message += '^FO305,92^BQN,2,' + size + '^FDHM,B0200 ' + text2 + '^FS'
            }
            message += '^XZ'
            this.$socket.emit('qrcode.write', { message })
            i++
            setTimeout(() => {
              print(i)
            }, 2000)
          } else {
            // alert('打印完成')
            _this.printEnd()
          }
        }
        print(0)
      } else {
        const _this = this
        // eslint-disable-next-line no-unused-vars
        const print = function(i) {
          if (i < _this.print.num) {
            address = (parseInt(_this.set.newAddr, 16) + i).toString(16)
            while (address.length < _this.temp.addressLength) {
              address = '0' + address
            }
            let l = (address.length / 2).toString(16)
            while (l.length < 2) {
              l = '0' + l
            }
            let text1 = this.getDY() + this.set.hardset.code + l + address
            let text1_ = ''
            if (this.datatype === 'json') {
              text1 = this.dataJSON + address
            }
            text1_ = text1
            address = (parseInt(address, 16) + i + 1).toString(16)
            while (address.length < this.temp.addressLength) {
              address = '0' + address
            }
            let text2 = this.getDY() + this.set.hardset.code + l + address
            let text2_ = ''
            if (this.datatype === 'json') {
              text2 = this.dataJSON + address
            }
            text2_ = text2
            let size = 5
            if (this.datatype === 'json') {
              size = 3
            } else {
              size = 5
            }
            let message = '^XA^JMA^LL320^PW460^MD0^PR3^PON^LRN^LH0,0^CI26'
            if (text1_.length > 48) {
              text1_ = text1_.substring(0, 48)
            }
            if (text2_.length > 48) {
              text2_ = text2_.substring(0, 48)
            }
            if (text1_.length > 24) {
              var t11_ = text1_.substr(0, 24)
              const t11_l = parseInt((322 - t11_.length * 12) / 2)
              var t12_ = text1_.substr(24, text1_.length)
              const t12_l = parseInt((322 - t12_.length * 12) / 2)
              message += '^FO0,' + t12_l + '^A0R,28,28^FD' + t12_ + '^FS'
              message += '^FO25,' + t11_l + '^A0R,28,28^FD' + t11_ + '^FS'
              message += '^FO60,92^BQN,2,' + size + '^FDHM,B0200 ' + text1 + '^FS'
            } else {
              const t_l = parseInt((322 - text1_.length * 12) / 2)
              message += '^FO10,' + t_l + '^A0R,28,28^FD' + text1_ + '^FS'
              message += '^FO45,92^BQN,2,' + size + '^FDHM,B0200 ' + text1 + '^FS'
            }
            if (text2_.length > 24) {
              var t21_ = text2_.substr(0, 24)
              const t21_l = parseInt((322 - t21_.length * 12) / 2)
              var t22_ = text2.substr(24, text2_.length)
              const t22_l = parseInt((322 - t22_.length * 12) / 2)
              message += '^FO270,' + t22_l + '^A0R,28,28^FD' + t22_ + '^FS'
              message += '^FO295,' + t21_l + '^A0R,28,28^FD' + t21_ + '^FS'
              message += '^FO340,92^BQN,2,' + size + '^FDHM,B0200 ' + text2 + '^FS'
            } else {
              const t2_l = parseInt((322 - text2_.length * 12) / 2)
              message += '^FO270,' + t2_l + '^A0R,28,28^FD' + text2_ + '^FS'
              message += '^FO305,92^BQN,2,' + size + '^FDHM,B0200 ' + text2 + '^FS'
            }
            message += '^XZ'
            // console.log('message2', message)
            this.$socket.emit('qrcode.write', { message })
            i = i + 2
            setTimeout(() => {
              print(i)
            }, 2000)
          } else {
            // alert('打印完成')
            _this.printEnd()
          }
        }
        print(0)
      }
    },
    PrintBegin() {
      if (this.connected) {
        this.$socket.emit('hard-set.close')
      }
      this.printConnect()
    },
    async printEnd() {
      this.$socket.emit('qrcode.close')
      this.dialogVisible = false
      if (this.next === true) {
        this.set.newAddr = (parseInt(this.set.newAddr, 16) + 1).toString(16)
        if (this.temp.addressLength === undefined) {
          this.temp.addressLength = 2
        }
        while (this.set.newAddr.length < this.temp.addressLength) {
          this.set.newAddr = '0' + this.set.newAddr
        }
        this.next = false
      }
      this.masterConnect()
    },
    async PrintBeginAndNext() {
      this.next = true
      if (this.connected) {
        this.$socket.emit('hard-set.close')
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
