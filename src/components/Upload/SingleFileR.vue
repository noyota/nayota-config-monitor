<template>
  <el-upload
    class="upload-file"
    :action="uploadURL"
    :on-success="handleImageSuccess"
    :show-file-list="false"
  >
    <span>
      {{ imageUrl }}
    </span>
    <el-button size="small" type="primary">点击上传</el-button>
  </el-upload>
</template>
<script>
import { deleteOne } from '@/api/uploads'

export default {
  props: {
    value: {
      type: [Object, String],
      default: () => {
        return null
      }
    },
    type: {
      type: String,
      default: 'object'
    }
  },
  data() {
    return {
      uploadURL: process.env.VUE_APP_RESOURCE_SERVER + '/uploads',
      name: undefined
    }
  },
  computed: {
    imageUrl() {
      if (this.name) return this.name
      if (this.value == null || typeof this.value === 'string' || this.type === 'string') {
        return this.value
      }
      return this.value.name
    }
  },
  methods: {
    handleImageSuccess(file) {
      if (file.code === 0) {
        this.$emit('input', process.env.VUE_APP_RESOURCE_SERVER.replace('/api', '') + file.data)
      }
    },
    deleteImage(file) {
      if (file._id) { deleteOne(file._id) }
    }
  }
}
</script>
