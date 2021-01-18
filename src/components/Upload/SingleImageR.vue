<template>
  <el-upload
    class="avatar-uploader"
    :action="uploadURL"
    :show-file-list="false"
    accept="image/gif, image/jpeg, image/png"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload"
  >
    <img v-if="imageUrl" :src="imageUrl" class="avatar">
    <i v-else class="el-icon-plus avatar-uploader-icon" />
  </el-upload>
</template>

<script>
import { deleteOne } from '@/api/uploads'
import { fileURL } from '@/utils'

export default {
  props: {
    value: {
      type: [String, Object],
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
      uploadURL: process.env.VUE_APP_RESOURCE_SERVER + '/uploads'
    }
  },
  computed: {
    imageUrl() {
      if (this.value == null) {
        return null
      } else if (typeof this.value === 'string' || this.type === 'string') {
        return fileURL(this.value)
      } else if (this.value.path) {
        return fileURL(this.value.path)
      } else {
        return null
      }
    }
  },
  methods: {
    async handleAvatarSuccess(file) {
      if (file.code === 0) {
        this.$emit('input', process.env.VUE_APP_RESOURCE_SERVER.replace('/api', '') + file.data)
      }
    },
    deleteImage(file) {
      if (file && file._id) { deleteOne(file._id) }
    },
    beforeAvatarUpload(file) {
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!isLt5M) {
        this.$message.error('上传图片大小不能超过 5MB!')
      }
      return isLt5M
    }
  }
}
</script>

<style scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    min-width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    min-width: 178px;
    height: 178px;
    display: block;
  }
</style>
