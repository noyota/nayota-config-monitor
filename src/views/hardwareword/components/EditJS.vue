<template>
  <el-input v-model="js" />
</template>

<script>
export default {
  name: 'EditJS',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      js: ''
    }
  },
  created() {
    this.js = this.value
  }
}
</script>

<style scoped>

</style>
