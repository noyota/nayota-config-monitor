<template>
  <el-card shadow="hover" style="width:400px;text-align: center;">
    <p class="text">设定温度：{{ value.operates['4'].value||'-' }}℃ &nbsp;&nbsp;室温：{{ value.checks['0'].value||"-" }}℃</p>
    <el-row style="margin-top: 20px" :gutter="10">
      <el-col :span="8">
        <el-button
          style="float: left"
          class="icon-button"
          type="primary"
          :loading="kgLoading"
          @click="clickBtn(1)"
        >
          <i class="iconfont icon-guanji" />
          <p class="plablename">{{ value.operates['1'].valueStr }}</p>
        </el-button>
      </el-col>
      <el-col :span="8">
        <el-button
          type="primary"
          class="icon-button"
          :loading="wdLoading"
          @click="clickBtn(2)"
        >
          <i class="iconfont icon-jia" />
          <p>温度</p>
        </el-button>
      </el-col>
      <el-col :span="8">
        <el-button
          type="primary"
          class="icon-button"
          :loading="wdLoading"
          @click="clickBtn(3)"
        >
          <i class="iconfont icon-jian" />
          <p>温度</p>
        </el-button>
      </el-col>
    </el-row>
    <el-row style="margin-top: 10px" :gutter="10">
      <el-col :span="12">
        <el-button
          type="primary"
          class="icon-button"
          :loading="msLoading"
          @click="clickBtn(4)"
        >
          <i
            class="iconfont"
            :class="value.operates['2'].value===0?'icon-zhileng':'icon-caozuo_zhire2'"
          />
          {{ value.operates['2'].valueStr }}
        </el-button>
      </el-col>
      <el-col :span="12">
        <el-button
          type="primary"
          class="icon-button"
          :loading="fsLoading"
          @click="clickBtn(5)"
        >
          <i
            class="iconfont"
            :class="value.operates['3'].value===0?'icon-zidong1':value.operates['3'].value===1?'icon-fengsu3':value.operates['3'].value===2?'icon-fengsu2':'icon-fengsu1'"
          />
          {{ value.operates['3'].valueStr }}
        </el-button>
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
export default {
  props: {
    value: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      fsLoading: false,
      msLoading: false,
      wdLoading: false,
      kgLoading: false
    }
  },
  watch: {
    'value.operates.3.value': function() {
      this.fsLoading = false
    },
    'value.operates.2.value': function() {
      this.msLoading = false
    },
    'value.operates.1.value': function() {
      this.kgLoading = false
    },
    'value.operates.4.value': function() {
      this.wdLoading = false
    }
  },
  methods: {
    clickBtn(index) {
      const operates = this.value.operates
      let _id
      let state
      switch (index) {
        case 1:_id = operates['1']._id
          state = operates['1'].value === 0 ? 1 : 0
          this.loading('kgLoading')
          break
        case 2: _id = operates['4']._id
          this.loading('wdLoading')
          state = 0
          break
        case 3: _id = operates['4']._id
          this.loading('wdLoading')
          state = 1
          break
        case 4: _id = operates['2']._id
          state = operates['2'].value === 0 ? 1 : 0
          this.loading('msLoading')
          break
        case 5: _id = operates['3']._id
          state = operates['3'].value === 0 ? 1 : operates['3'].value === 1 ? 2 : operates['3'].value === 2 ? 3 : 0
          this.loading('fsLoading')
          break
      }
      this.$emit('opChange', _id, state)
    },
    loading(key) {
      this[key] = true
      setTimeout(() => {
        this[key] = false
      }, 5000)
    }
  }
}
</script>
<style scoped>
  .icon-button{
    width: 100%;
    height: 70px;
  }
</style>
