<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <!-- 表单 -->
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="65%" @open="dialogOpen">
    <fieldset class="fieldset-dialog">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="130px"
        style="padding-top:10px"
      >
        <el-form-item :label="$t('users.username')" prop="username" class="form-item">
          <el-input v-model="temp.username" :placeholder="$t('users.ph_username')" />
        </el-form-item>
        <el-form-item :label="$t('users.trueName')" prop="trueName" class="form-item">
          <el-input v-model="temp.trueName" :placeholder="$t('users.ph_trueName')" />
        </el-form-item>
        <el-form-item :label="$t('users.email')" prop="email" class="form-item">
          <el-input v-model="temp.email" :placeholder="$t('users.ph_email')" />
        </el-form-item>
        <el-form-item :label="$t('users.password')" prop="password" class="form-item">
          <el-input v-model="temp.password" type="password" />
        </el-form-item>
        <el-form-item :label="$t('users.repeatPassword')" prop="repeatPassword" class="form-item">
          <el-input v-model="temp.repeatPassword" type="password" />
        </el-form-item>
        <!--<el-form-item v-if="envType === 'serve'" :label="$t('users.mqtt_role')" prop="mqttRole" class="form-item">-->
        <!--<el-select-->
        <!--v-model="temp.mqttRole"-->
        <!--disabled="disabled"-->
        <!--:placeholder="$t('users.ph_mqtt_role')"-->
        <!--filterable-->
        <!--value-key="_id"-->
        <!--&gt;-->
        <!--<el-option-->
        <!--v-for="item in mqttRoles"-->
        <!--:key="item._id"-->
        <!--:label="item.rolename"-->
        <!--:value="item._id"-->
        <!--&gt;-->
        <!--<span style="float: left">{{ item.rolename }}</span>-->
        <!--</el-option>-->
        <!--</el-select>-->
        <!--</el-form-item>-->
        <el-form-item :label="$t('users.roles')" prop="roles" class="form-item">
          <el-select
            v-model="temp.roles"
            disabled="disabled"
            multiple
            :placeholder="$t('users.ph_role')"
            value-key="_id"
          >
            <el-option
              v-for="item in roles"
              :key="item._id"
              :label="item.name"
              :value="item._id"
            />
          </el-select>
        </el-form-item>
        <!--<el-form-item :label="$t('users.mqtt_user')" prop="mqttUsername" class="form-item">-->
        <!--<el-input v-model="temp.mqttUsername" readonly="readonly" :placeholder="$t('users.ph_mqtt_user')" />-->
        <!--</el-form-item>-->
        <el-form-item v-if="temp.type===0" :label="$t('users.emails')" prop="emails" class="form-item">
          <el-input v-model="temp.emails" type="textarea" :rows="2" :placeholder="$t('users.ph_emails')" />
          <p style="font-size:12px;line-height: 14px;color: #919191;">{{ $t(&#x27;users.ph_more_title&#x27;) }}</p>
        </el-form-item>
        <el-form-item v-if="temp.type===0" :label="$t('users.phones')" prop="phones" class="form-item">
          <el-input v-model="temp.phones" type="textarea" :rows="2" :placeholder="$t('users.ph_phones')" />
          <p style="font-size:12px;line-height: 14px;color: #919191;">{{ $t(&#x27;users.ph_more_title&#x27;) }}</p>
        </el-form-item>
        <el-form-item v-if="temp.type===1" :label="$t('displayAreaClass.name')" prop="hardwareWord" class="form-item">
          <template>
            <el-select
              v-model="temp.displayAreaClass"
              :placeholder="$t('displayAreaClass.namePlaceholder')"
              filterable
              multiple
              value-key="_id"
            >
              <el-option
                v-for="item in displayAreaClasss"
                :key="item._id"
                :label="item.name"
                :value="item"
              >
                <span style="float: left">{{ item.name }}</span>
              </el-option>
            </el-select>
          </template>
        </el-form-item>
      </el-form>
    </fieldset>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">
        {{ $t('table.cancel') }}
      </el-button>
      <el-button type="primary" :loading="dialogLoading" @click="dialogStatus==='create'?createData():updateData()">
        {{ $t('table.confirm') }}
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import { list, updateUser, createUser } from '@/api/user'
import { list as roleList } from '@/api/roles'
import { list as displayAreaList } from '@/api/displayAreaClasss'
import waves from '@/directive/waves' // Waves directive
import { getMqttRoleList, mqttUserUniqueness } from '@/api/seneca'
export default {
  name: 'UserList',
  components: { },
  directives: { waves }, // 一个按钮的动画效果
  data() {
    const validatePass = (rule, value, callback) => {
      const reg = /^[a-zA-Z0-9]{6,20}$/
      value = value || ''
      if (value === '') {
        if (this.dialogStatus === 'create') {
          callback(this.$t('users.ph_pwd'))
        } else {
          callback()
        }
      } else {
        if (value === this.temp.username || !reg.test(value)) {
          return callback(this.$t('register.ph_reg_password1') + ',' + this.$t('register.ph_reg_password2'))
        } else if (this.temp.repeatPassword !== '') {
          this.$refs.dataForm.validateField('repeatPassword')
        }
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      value = value || ''
      if (value === '' && (this.temp.password !== undefined && this.temp.password !== '')) {
        callback(new Error(this.$t('users.ph_repwd')))
      } else if (this.temp.password != null && value !== this.temp.password) {
        callback(new Error(this.$t('users.ph_errpwd')))
      } else {
        callback()
      }
    }

    const emailUnique = (rule, value, callback) => { // 邮箱验证
      if (value === undefined || value === '') {
        callback()
      } else {
        list({ email: value }).then(res => {
          if (res.data.total > 0 && res.data.rows[0]._id !== this.temp._id) {
            callback(new Error(this.$t('users.ph_email_err')))
          } else {
            callback()
          }
        })
      }
    }
    const emailsUnique = (rule, value, callback) => { // 邮箱验证
      if (value === undefined || value === '') {
        callback()
      } else {
        var checkEmail = function(str) {
          const reg = /^^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
          if (reg.test(str)) {
            return true
          }
          return false
        }
        var data = value.indexOf(',')
        for (var i = 0; i < data.length; i++) {
          if (!checkEmail(data[i])) {
            callback(new Error(this.$t('users.email_title')))
            break
          }
        }
        callback()
      }
    }
    const phonesUnique = (rule, value, callback) => { // 手机号码验证
      if (value === undefined || value === '') {
        callback()
      } else {
        var checkPhone = function(str) {
          const reg = /^^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/
          if (reg.test(str)) {
            return true
          }
          return false
        }
        var data = value.indexOf(',')
        for (var i = 0; i < data.length; i++) {
          if (!checkPhone(data[i])) {
            callback(new Error(this.$t('users.phone_title')))
            break
          }
        }
        callback()
      }
    }
    const mqttUsernameUnique = (rule, value, callback) => {
      if (value === undefined || value === '') {
        callback()
      } else {
        mqttUserUniqueness({ username: value }).then(res => {
          if (!res.data.use) {
            callback(new Error(this.$t('users.ph_mqttuser_err')))
          } else {
            if (res.data.mqttUser) { // 如果是
              this.newMqtt = false
            } else {
              this.newMqtt = true
            }
            callback()
          }
        })
      }
    }
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      textMap: {
        update: this.$t('dialog.update'),
        create: this.$t('dialog.create')
      },
      multipleSelection: [],
      dialogFormVisible: false,
      dialogStatus: '',
      temp: {},
      mqttRoles: [],
      displayAreaClasss: [],
      newMqtt: false,
      envType: undefined,
      createTemp: { // 临时表单
        _id: undefined,
        username: '',
        email: '',
        password: '',
        repeatPassword: '',
        roles: undefined,
        type: 0
      },
      roles: undefined,
      rules: {
        trueName: [{ required: true, message: this.$t('users.ph_true_err'), trigger: 'blur' }],
        email: [{ type: 'email', required: true, message: this.$t('users.ph_email_true'), trigger: 'blur' },
          { validator: emailUnique, trigger: 'blur' }
        ],
        password: [{ validator: validatePass, trigger: 'blur' }],
        repeatPassword: [{ validator: validatePass2, trigger: 'blur' }],
        emails: [{ validator: emailsUnique, trigger: 'blur' }],
        phones: [{ validator: phonesUnique, trigger: 'blur' }],
        mqttUsername: [{ required: true, message: this.$t('users.ph_mqttuser_null'), trigger: 'blur' },
          { validator: mqttUsernameUnique, trigger: 'blur' }]
      }, // 表单验证
      dialogLoading: false
    }
  },
  created() {
  },
  methods: {
    async dialogOpen() {
      this.envType = process.env.VUE_APP_ROLE
      if (process.env.VUE_APP_ROLE === 'serve') { // 服务端才能获取新设备信息
        const res = await getMqttRoleList()
        this.mqttRoles = res.data.rows
      }
      if (this.roles === undefined) {
        roleList().then(response => {
          this.roles = []
          this.roles = response.data.rows
        })
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val.map(v => v._id)
    },
    handleCreate() { // 新建
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
          createUser(this.temp).then(() => {
            this.getList()
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
      this.temp.roles = this.temp.roles.map(role => role._id)
      await displayAreaList().then(response => {
        this.displayAreaClasss = response.data.rows
      })
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
          updateUser(tempData).then(() => {
            this.dialogFormVisible = false
            this.dialogLoading = false
            this.$emit('reload')
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
  .user-avatar {
    cursor: pointer;
    width: 40px;
    height: 40px;
    border-radius: 10px;
  }
  .form-item{
    float:left;
    width: 50%;
  }
  .form-item label{
    padding-left:20px;
  }
</style>
