<template>
  <div id="spritejs" :style="{ width: template.width*template.pcScale+'px',height: template.height*template.pcScale+'px' }" />
</template>

<script>
import SpriteSDK from './SpriteSDK'

export default {
  name: 'SpriteJs',
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    template: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      spriteObj: undefined
    }
  },
  watch: {
    data: {
      handler() {
        this.spriteObj.update()
      },
      deep: true
    }
  },
  mounted() {
    this.loadCanvas()
  },
  methods: {
    async loadCanvas() {
      this.spriteObj = new SpriteSDK(this.data, this.template)
      await this.spriteObj.init()
      this.spriteObj.close = this.close
      this.spriteObj.action = this.action
      const att = document.createElement('script')
      // 设置type属性值
      att.type = 'text/javascript'
      // 设置你需要加载js
      att.src = this.template.js
      // 获取新创建的script节点
      const attScript = document.getElementsByTagName('script')[0]
      // 将新建的节点插入到  当前节点的父节点下面已有子节点之前
      attScript.parentNode.insertBefore(att, attScript)
      att.onload = () => {
        global[this.template.code](this.spriteObj)
      }
    },
    close() {
      this.$emit('close')
    },
    action(data) {
      this.$emit('action', data)
    }
  }
}
</script>

<style scoped>
#spritejs{

}
</style>
