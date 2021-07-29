<template>
  <div class="app-container">
    <fieldset class="fieldset-dialog" style="margin-top:10px;">
      <el-form ref="dataForm" :model="set" label-position="left" label-width="88px" style="padding-top:10px">
        <el-row>
          <el-input v-model="set.label" placeholder="未输入则默认生成" />
          <el-button type="primary" :loading="loading" style="margin-top: 20px;" @click="scanCode()">
            手动生成二维码
          </el-button>
          <el-button style="margin-top: 10px" type="primary" @click="PrintBegin()">打印</el-button>
        </el-row>
      </el-form>
    </fieldset>
    <el-dialog
      title="二维码"
      :visible.sync="dialogVisible"
      width="50%"
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
      <el-button style="margin-top: 10px" type="primary" @click="PrintBegin()">打印</el-button>
    </el-dialog>
  </div>
</template>

<script>
import QRCode from 'qrcodejs2'
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
        oldAddr: ''
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
      serialList: [{ comName: '/dev/uart1', baud: 9600, verification: 'none', stopBit: 1, dataBit: 8 }],
      qr_serial: [{ comName: '/dev/uart1', baud: 9600, verification: 'none', stopBit: 1, dataBit: 8 }],
      qrcode: '',
      text: '',
      dialogVisible: false,
      inc: undefined,
      address: '',
      hardwareWords: []
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
  },
  destroyed() {
    this.$socket.close() // 关闭 socket
  },
  sockets: {
    'qrcode.open': function(data) {
      if (data.code === 0) {
        this.printWrite()
      } else {
        this.$message({ message: `${data.code}:${data.message}`, type: 'error' })
      }
    }
  },
  methods: {
    scanCode() {
      if (this.set.label === undefined) {
        this.$message({ message: '请输入', type: 'error' })
        return
      }
      this.text = this.set.label
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
    printWrite() {
      let message = '^XA^JMA^LL320^PW460^MD0^PR3^PON^LRN^LH0,0^CI26'
      const t_l = parseInt((320 - this.text.length * 12) / 2)
      if (this.text.length > 40) {
        this.text = this.text.substring(0, 40)
      }
      if (this.text.length > 20) {
        var t1 = this.text.substr(0, 20)
        const t1_l = parseInt((320 - t1.length * 12) / 2)
        var t2 = this.text.substr(20, this.text.length)
        const t2_l = parseInt((320 - t2.length * 12) / 2)
        message += '^FO0,' + t2_l + '^A0R,28,28^FD' + t2 + '^FS'
        message += '^FO25,' + t1_l + '^A0R,28,28^FD' + t1 + '^FS'
        message += '^FO60,92^BQN,2,3^FDHM,B0200 ' + this.text + '^FS'
        message += '^FO270,' + t2_l + '^A0R,28,28^FD' + t2 + '^FS'
        message += '^FO295,' + t1_l + '^A0R,28,28^FD' + t1 + '^FS'
        message += '^FO340,92^BQN,2,3^FDHM,B0200 ' + this.text + '^FS'
      } else {
        message += '^FO10,' + t_l + '^A0R,28,28^FD' + this.text + '^FS'
        message += '^FO270,' + t_l + '^A0R,28,28^FD' + this.text + '^FS'
        message += '^FO45,92^BQN,2,5^FDHM,B0200 ' + this.text + '^FS'
        message += '^FO305,92^BQN,2,5^FDHM,B0200 ' + this.text + '^FS'
      }
      message += '^XZ'
      this.$socket.emit('qrcode.write', { message })
      this.$socket.emit('qrcode.close')
    },
    PrintBegin() {
      if (this.set.label === undefined) {
        this.$message({ message: '请输入', type: 'error' })
        return
      }
      this.text = this.set.label
      this.printConnect()
    },
    printEnd() {
      this.$socket.emit('qrcode.close')
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
