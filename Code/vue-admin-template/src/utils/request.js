// 引入axios
import axios from 'axios'
// 引入vuex可以获取vuex实例对象，
// 我们在vuex实例对象找那个又添加了一个getters.js,其实是为了获取token数据
import store from '@/store/index.js'
// 按需引入element-ui组件,
import { Message } from 'element-ui'
// 引入路由
import router from '@/router'

// 创建一个axios实例
// 根据指定配置创建一个新的axios，也就是每个新的axios都有自己的配置
var service = axios.create({
  // 基地址。因为后端的所有地址都有一个共同路径/api
  // 并且这个地方不能写死，否则生产环境和开发环境都走的一个地址
  baseURL: process.env.VUE_APP_BASE_API,
  // 超时时间，单位为毫秒，10000毫秒为10秒
  timeout: 10000
})

// 创建请求拦截器,并且两个参数都是回调函数
// 请求成功的时候执行第一个成功回调函数
// 请求失败的时候执行第二个失败回调函数，error就是错误对象
service.interceptors.request.use(
  // 成功时执行
  (config) => {
    // 将vuex中的token值放入到请求头里面
    if (store.getters.token) {
      // 存在token，才放入请求头中
      config.headers.Authorization = `Bearer ${store.getters.token}`
    }
    return config
  },
  // 失败时执行
  (error) => {
    // 默认支持promise的,下面语句相当于终止了当前promise的执行
    return Promise.reject(error)
  })

// 创建响应拦截器,并且两个参数都是回调函数
service.interceptors.response.use(
  // 请求成功时响应,此时的响应默认包裹了一层data，即response.data才是后台服务返回的内容
  (response) => {
    // 一次性解析出response.data中的三个属性
    const { data, message, success } = response.data
    if (success) {
      // 此时响应正常
      return data
    } else {
      Message({ type: 'error', message: message })
      return Promise.reject(new Error(message))
    }
  },
  // 请求失败时响应
  async(error) => {
    if (error.response.status === 401) {
      Message({ type: 'warning', message: 'token 超时了，请重新登录' })
      // token超时,调用action退出登录
      // dispatch返回的是一个promise，这里会等dispatch执行完再执行路由跳转
      await store.dispatch('user/logout')
      // 主动跳转到登录页
      router.push('/login')
      return Promise.reject(error)
    }
    // this.$message.warning 不能这么使用，因为此时的this不是组件实例对象
    Message({ type: 'error', message: error.message })
    // 默认支持promise的,下面语句相当于终止了当前promise的执行
    return Promise.reject(error)
  }
)

// 默认导出axios实例对象
export default service

