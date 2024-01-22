// @符号表示根路径
import { getToken, setToken, removeToken } from '@/utils/auth'
import { login, getUserInfo } from '@/api/user'
// State理解为数据源,像极了我们之前学的data,用来存放数据
const state = {
  // 这样就算我们给state.token赋值之后，但刷新页面后仍然是null，所以此时永远不能取到我们缓存的token值
  // token: null
  // 从缓存中读取初始值
  token: getToken(),
  // 存储用户基本资料状态
  userInfo: {}
}

// Mutations类似java中的数据层，只对数据进行操作，不对业务操作（比如数据加减乘除）
const mutations = {
  // 修改token
  setToken(state, token) {
    state.token = token
    // console.log(state.token)
    // 将token值同步到缓存
    setToken(token)
  },
  removeToken(state) {
    // 删除vuex的token
    state.token = null
    // 删除缓存中的token
    removeToken()
  },
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo
  }
}

/**
 * actions似java中的业务逻辑层，对逻辑操作，然后向mutations发送数据，在这个业务逻辑中也可以互相调用
 * actions可以做异步操作
 */
const actions = {
  /**
   * 参数1： context上下文对象，有commit和dispatch方法
   * 参数2：我们要传入的参数
   */
  async login(context, data) {
    // 只有后台返回的success的值为true时才走await，如果是false的话就走了axios响应拦截器中的reject，就不会向下走了
    const token = await login(data)
    // 假设登录成功之后就会返回一个token，我们要将此token实现共享就要存储在state中
    // vuex中想修改state中数据必须通过mutations，不能直接修改state中属性
    // 运行到这里说明登录已经成功了
    context.commit('setToken', token)
  },
  // 获取用户基本资料
  async getUserInfo(context) {
    console.log('打印用户基本信息')
    // 获取用户基本资料
    const result = await getUserInfo()
    console.log(result)
    context.commit('setUserInfo', result)
  },
  // 退出登录的action
  logout(context) {
    // 删除用户token
    context.commit('removeToken')
    // 删除用户信息(设置用户信息为空对象)
    context.commit('setUserInfo', {})
  }
}

// 对三个变量进行一个默认的导出
export default {
  // 开启命名空间。表示之后调用state/mutations/actions时必须带上模块名称
  namespaced: true,
  state,
  mutations,
  actions
}

