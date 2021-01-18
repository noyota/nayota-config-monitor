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
      uploadURL: process.env.VUE_APP_BASE_API + '/uploads',
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
      // this.deleteImage(this.value)
      if (typeof this.value === 'string' || this.type === 'string') {
        this.name = file.data.name
        return this.$emit('input', file.data.path)
      }
      this.$emit('input', file.data)
    },
    deleteImage(file) {
      if (file._id) { deleteOne(file._id) }
    }
  }
}
</script>
