<template>
  <div class="login-container">
    <div class="logo"/>
    <div class="form">
      <h1>登录</h1>
      <el-card shadow="never" class="login-card">
        <!--登录表单-->
        <!--el-form element-ui的表单-->
        <!--el-form-item 表单中的一项-->
        <!--el-input 输入框-->
        <el-form ref="loginFormRef" :model="loginFromModel" :rules="loginFromRules">
          <el-form-item prop="mobile">
            <el-input placeholder="请输入手机号" v-model="loginFromModel.mobile"></el-input>
          </el-form-item>

          <el-form-item prop="password">
            <!-- show-password是el-input属性，表示不展示input框中信息-->
            <el-input show-password placeholder="请输入密码" v-model="loginFromModel.password"></el-input>
          </el-form-item>
          <!--勾选框-->
          <el-form-item prop="isAgree">
            <el-checkbox v-model="loginFromModel.isAgree">用户平台使用协议</el-checkbox>
          </el-form-item>
          <!--登录按钮
          设置一下宽度 style="width: 350px"
          -->
          <el-form-item prop="isAgree">
            <el-button @click="login" type="primary" style="width: 350px">登录</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>
<script>

export default {
  name: 'Login',
  data() {
    return {
      // 登录表单数据结构
      loginFromModel: {
        mobile: process.env.NODE_ENV === 'development' ? '13800000002' : '',
        password: process.env.NODE_ENV === 'development' ? 'hm#qd@23!' : '',
        isAgree: process.env.NODE_ENV === 'development'
      },
      // 登录表单规则,数据字段和loginFromModel一样，只不过值是数组的模式
      // 数组中的每一个对象值就是一个校验规则
      loginFromRules: {
        // 手机号校验规则
        mobile: [
          /**
           *  required: true 必填
           *  trigger触发模式
           *    change表示只要我们不断的写就会触发校验
           *    blur 失去焦点才会触发校验
           */
          { required: true, message: '请输入手机号信息', trigger: 'blur' },
          // 正则表达式检验规则
          { pattern: /^1[3-9]\d{9}$/, message: '手机号输入格式不合规范', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          // 密码长度校验规则
          { min: 6, max: 16, message: '密码长度在 6 到 16 个字符', trigger: 'blur' }
        ],
        /**
         * 说明：required命令检测不了false，只能检测null/undefine/空字符串
         *  所以我们要自定义校验方式，其实是自定义校验方式是一个函数
         *    需要三个参数rule,value,callback
         *    rule:校验规则
         *    value:要校验的值
         *    callback: 一个必须要执行的函数（无论校验成功还是失败都要执行）
         *              如果校验成功的话直接执行callback()函数，如果失败的话执行callback(new Error(错误信息))
         */
        isAgree: [
          {
            validator: (rule, value, callback) => {
              value ? callback() : callback(new Error('您必须勾选用户平台使用协议'))
            }
          }
        ]
      }
    }
  },
  methods: {
    login() {
      /**
       * 通过表单的ref属性获取表单实例对象，并且执行此表单实例对象的validate方法校验一下
       * validate方法可以传入一个回调函数，并且会传入一个参数，我们可以命名为isOK
       */
      this.$refs.loginFormRef.validate(async(isOK) => {
        if (!isOK) {
          // 此时isOK为false，表示校验没有通过
          alert('校验没有通过，请检查您的登录信息')
          return
        }
        /**
         * 此时isOK为true，表示校验通过了,调用vuex中的用户模块
         * 此时因为我们开启了命名空间，传参时要带上模块名，即模块名/actions中方法名
         * dispatch方法是调用vuex中的actions
         * Vuex中的action返回的是一个promise，说明是一个异步，我们必须等到promise执行成功才能继续跳转到主页
         * 只要是用了await表示下方的代码一定是promise执行成功了
         * await 一定要写，因为我们要等待登录成功，如果失败的话就走axios中的reject
         */
        await this.$store.dispatch('user/login', this.loginFromModel)
        // 登录成功后跳转到主页面
        //  this.$router获取到路由的实例对象,push表示我们要跳转到哪里，'/'表示我们的主页
        this.$router.push('/')
      })
    }
  }
}
</script>
<style lang="scss">
.login-container {
  display: flex;
  align-items: stretch;
  height: 100vh;

  .logo {
    flex: 3;
    background: rgba(38, 72, 176) url(../../assets/common/login_back.png) no-repeat center / cover;
    border-top-right-radius: 60px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    padding: 0 100px;

    .icon {
      background: url(../../assets/common/logo.png) no-repeat 70px center /
        contain;
      width: 300px;
      height: 50px;
      margin-bottom: 50px;
    }

    p {
      color: #fff;
      font-size: 18px;
      margin-top: 20px;
      width: 300px;
      text-align: center;
    }
  }

  .form {
    flex: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 176px;

    .el-card {
      border: none;
      padding: 0;
    }

    h1 {
      padding-left: 20px;
      font-size: 24px;
    }

    .el-input {
      width: 350px;
      height: 44px;

      .el-input__inner {
        background: #f4f5fb;
      }
    }

    .el-checkbox {
      color: #606266;
    }
  }
}
</style>
