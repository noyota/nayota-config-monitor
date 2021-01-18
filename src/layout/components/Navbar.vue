<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <!--<search id="header-search" class="right-menu-item" />-->

        <error-log class="errLog-container right-menu-item hover-effect" />

        <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <el-tooltip :content="$t('navbar.size')" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>
        <el-dropdown class="right-menu-item hover-effect push_top" trigger="click">
          <el-badge :is-dot="pushlist.length>0">
            <i class="el-icon-message-solid" />
          </el-badge>
          <el-dropdown-menu slot="dropdown" class="dropdown_w_300">
            <el-dropdown-item disabled class="dropdown_title">
              {{ $t('pushrecords.notice') }}
            </el-dropdown-item>
            <el-dropdown-item v-show="pushlist.length<=0" disabled class="dropdown_content_null">
              {{ $t('pushrecords.content_null') }}
            </el-dropdown-item>
            <el-dropdown-item v-for="pushrecord in pushlist" :key="pushrecord._id" class="dropdown_content">
              {{ pushrecord.content }}<br>
              {{ pushrecord.pushTime | parseTime(&#x27;{y}-{m}-{d} {h}:{i}&#x27;) }}
            </el-dropdown-item>
            <router-link to="/datarecords/pushRecord">
              <el-dropdown-item class="dropdown_foot">
                <span style="display:block;">{{ $t('navbar.watch_more') }}</span>
              </el-dropdown-item>
            </router-link>
          </el-dropdown-menu>
        </el-dropdown>
        <lang-select class="right-menu-item hover-effect" />

      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          {{ userInfo!=undefined?userInfo.trueName:'' }}
          <i class="el-icon-caret-bottom" />
        </div>

        <el-dropdown-menu slot="dropdown" class="dropdown_w_200">
          <el-dropdown-item disabled class="dropdown_title">
            {{ userInfo!=undefined?userInfo.trueName:'' }}
          </el-dropdown-item>
          <el-dropdown-item disabled class="dropdown_content">
            <svg-icon icon-class="user" style="margin-right:10px" />{{ userInfo!=undefined?userInfo.username:'' }}
          </el-dropdown-item>
          <el-dropdown-item disabled class="dropdown_content">
            <svg-icon icon-class="email" style="margin-right:10px" />{{ userInfo!=undefined?userInfo.email:'' }}
          </el-dropdown-item>
          <el-dropdown-item class="dropdown_foot">
            <span class="foot_account" @click="handleUpdate">{{ $t('users.account') }}</span>
            <span class="foot_logout" @click="logout">{{ $t('navbar.logOut') }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <edit-form ref="EditFrom" @reload="getInfo" />
      <edit-child ref="EditChild" @reload="getInfo" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import LangSelect from '@/components/LangSelect'
// import Search from '@/components/HeaderSearch'
import { list } from '../../api/pushRecords'
import { getInfo } from '../../api/user'
import editForm from '../../views/user/edit'
import editChild from '../../views/user/editChild'
export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
    LangSelect,
    editForm,
    editChild
    // Search
  },
  data() {
    return {
      pushlist: [],
      userInfo: undefined
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'avatar',
      'device'
    ])
  },
  created() {
    this.getInfo()
    // this.getList()
  },
  methods: {
    getInfo() {
      getInfo({}).then(response => {
        this.userInfo = response.data
      })
    },
    getList() {
      list({ sort: '-pushTime', page: 1, limit: 5, status: false }).then(response => {
        this.pushlist = response.data.rows
      })
    },
    handleUpdate() {
      if (this.userInfo.type === 0) {
        this.$refs.EditFrom.handleUpdate(this.userInfo)
      }
      if (this.userInfo.type === 1) {
        this.$refs.EditChild.handleUpdate(this.userInfo)
      }
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }
    .item {
      margin-top: 10px;
      margin-right: 40px;
    }
    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
.dropdown_w_300{
  width:300px;padding:0px;top: 35px!important;
}
.dropdown_w_200{
  width:200px;padding:0px;top: 35px!important;
}
.dropdown_w_300 .dropdown_title,.dropdown_w_200 .dropdown_title{
  background-color:#f7f7f7;font-size:14px;border-bottom:1px solid #e6ebf5;line-height:30px;padding: 5px 17px;color:#303133
}
.dropdown_w_300 .dropdown_content_null{
  font-size:14px;border-bottom:1px solid #e6ebf5;line-height:30px;padding: 5px 17px;color:#303133
}
.dropdown_w_300 .dropdown_content,.dropdown_w_200 .dropdown_content{
  font-size:12px;border-bottom:1px solid #e6ebf5;line-height:20px;padding: 5px 17px;color:#303133
}
.dropdown_w_300 .dropdown_foot{
  text-align: center;padding: 5px 17px;color:#303133
}
.dropdown_w_200 .dropdown_foot{
  font-size:12px;text-align: center;color:#303133;padding:0px;
}
.foot_account{
  display:block;width:47%;float: left;margin:2% 0 2% 2%
}
.foot_logout{
  display:block;width:47%;float: right;margin:2% 2% 2% 0
}
</style>
