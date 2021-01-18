<template>
  <div class="app-container">
    <div v-for="item of files" :key="item">
      <div class="icon-item" @click="openURL(item)">
        <svg-icon icon-class="documentation" class-name="disabled" />
        <span style="font-size:12px;">{{ item }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { files } from '@/api/loraMasters'
import { fileURL } from '@/utils'
export default {
  name: 'ConfigControl',
  components: { },
  data() {
    return {
      connected: false, // 主站是否连接
      loading: true,
      files: []
    }
  },
  async created() {
    this.loading = false
    this.getList()
  },
  destroyed() {
  },
  sockets: {
  },
  methods: {
    async getList() {
      this.files = (await files({})).data
    },
    openURL(url) {
      window.open(fileURL(url))
    }
  }
}
</script>
<style lang="scss" scoped>
  .icon-item {
    margin: 20px;
    height: 85px;
    text-align: center;
    width: 100px;
    float: left;
    font-size: 30px;
    color: #24292e;
    cursor: pointer;
  }

  span {
    display: block;
    font-size: 16px;
    margin-top: 10px;
  }

  .disabled {
    pointer-events: none;
  }
</style>
