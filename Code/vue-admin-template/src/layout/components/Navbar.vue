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
              <!--Home-->
              首页
            </el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://github.com/PanJiaChen/vue-admin-template/">
            <el-dropdown-item>
              <!--Github-->
              项目地址
            </el-dropdown-item>
          </a>
          <!--a标签有一个默认事件(跳出，也就是跳到某个链接)，我们要阻止默认事件的发生，所以添加-->
          <a target="_blank" @click.prevent="updatePassword">
            <el-dropdown-item>
              <!--Docs-->
              修改密码
            </el-dropdown-item>
          </a>
          <!--divided 属性是在列的上面有个分割线，我们去掉-->
          <!--<el-dropdown-item divided @click.native="logout">-->
          <el-dropdown-item @click.native="logout">
            <span style="display:block;">
             <!--Log Out-->
              退出登录
            </span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <!--放置dialog-->
    <!--title是dialog的标题; :visible.sync用来控制是否显示弹出层 sync作用是点击“×”号时能把弹出层关闭掉-->
    <el-dialog title="修改密码" :visible.sync="showDialog" width="450px">
      <!--放置dialog表单-->
      <!--设置完成label-width="120px"后，提示信息就和输入框在同一行了-->
      <el-form label-width="120px">
        <!--label属性其实就是此item的提示信息-->
        <el-form-item label="旧密码">
          <el-input show-password size="small"></el-input>
        </el-form-item>
        <!--show-password 属性表示输入的内容是密文-->
        <el-form-item label="新密码">
          <el-input show-password size="small"></el-input>
        </el-form-item>
        <el-form-item label="重复密码">
          <el-input show-password size="small"></el-input>
        </el-form-item>
        <!--按钮-->
        <el-form-item>
          <el-button size="mini" type="primary">确认修改</el-button>
          <el-button size="mini">取消修改</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
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
  data() {
    return {
      // 控制弹层的显示和隐藏
      showDialog: true
    }
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
    updatePassword() {
      // 弹出层显示
      this.showDialog = true
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      // 清除用户信息
      await this.$store.dispatch('user/logout')
      // await表示等待上面的代码执行完毕后，执行下面的代码，跳转页面到登录界面
      this.$router.push('/login')
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
