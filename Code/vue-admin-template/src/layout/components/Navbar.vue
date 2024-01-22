<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar"/>

    <breadcrumb class="breadcrumb-container"/>

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <!--用户头像，v-if判断用户头像是否存在-->
          <img v-if="avatar" :src="avatar" class="user-avatar">
          <!--如果用户头像不存在的时候执行下面的v-else,显示用户名的第一个字-->
          <!--当name时null或者undefined时name.charAt(0)会报错，但是当在name之后加上“?”后，如果name为null或者undefined，就不会执行charAt(0)，也不会报错了-->
          <!-- "name?" 可选操作符，表示验证name是否一定有值。 此语法需要vue2.7.0之后的版本-->
          <span v-else class="username">{{ name?.charAt(0) }}</span>
          <!--用户名称-->
          <span class="name">{{ name }}</span>
          <!--图标（设置图标，是一个齿轮的样式）-->
          <i class="el-icon-setting"/>
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              Home
            </el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://github.com/PanJiaChen/vue-admin-template/">
            <el-dropdown-item>Github</el-dropdown-item>
          </a>
          <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
            <el-dropdown-item>Docs</el-dropdown-item>
          </a>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">Log Out</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    // 辅助函数，自动引入getters中的属性
    // 引入头像和用户名称
    ...mapGetters([
      'sidebar',
      'avatar',
      'name'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
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
  box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
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

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        // 水平居中
        display: flex;
        align-items: center;
        // 用户头像不存在时，默认使用使用用户名的第一个字当做头像
        .username {
          // 垂直居中
          width: 30px;
          height: 30px;
          line-height: 30px;
          // 水平居中
          text-align: center;
          // 背景颜色
          background-color: #04c9be;
          // 字体颜色
          color: #fff;
          // 圆角
          border-radius: 50%;
          // 距离右边距
          margin-right: 4px;
        }

        // 用户名样式
        .name {
          // 用户名称距离右侧一定的距离
          margin-right: 10px;
          // 文字大小
          font-size: 16px;
        }

        // 用户头像样式
        .user-avatar {
          cursor: pointer;
          width: 30px;
          height: 30px;
          // 设置圆角
          border-radius: 50%;
        }

        // 齿轮图标样式
        .el-icon-setting {
          font-size: 20px;
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
</style>
