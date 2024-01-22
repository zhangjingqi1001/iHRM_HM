// 导入路由实例
import router from '@/router'
// 引入进度条
import nprogress from 'nprogress'
// 引入进度条对应的样式
import 'nprogress/nprogress.css'
// 引入vuex实例对象
import store from '@/store'

// 定义白名单，此路径不需要token就可以访问
const whiteList = ['/login', '/404']
/**
 * 前置守卫
 * 参数：
 *  to：信息要到哪里去
 *  from：信息从哪里来
 *  next：必须要执行的函数。如果不执行next，跳转就不会执行。说白了就是让着通行，如果没有next的话，页面会直接空白
 */
router.beforeEach(async(to, from, next) => {
  // 前置守卫开启进度条
  nprogress.start()
  if (store.getters.token) {
    // 存在token
    // 判断要去的地方是不是登录页面
    if (to.path === '/login') {
      // 此时已经登录了，那就直接跳转到主页而不是登录页
      // next("/") 表示中转页面到主页
      next('/')
      // 当next(地址)时并没有执行后置路由守卫，所以说也不会再后置守卫中关闭进度条了
      nprogress.done()
    } else {
      // 说明访问的不是登录页
      // 首先判断是否获取过用户资料
      if (!store.getters.userId) {
        // 说明没有获取过用户资料
        await store.dispatch('user/getUserInfo')
      }
      // 直接放过就好了
      next()
    }
  } else {
    //   没有token
    // 首先先验证白名单中是否包含路径to.path 使用whiteList.indexOf(to.path) > -1判断也可以
    if (whiteList.includes(to.path)) {
      // 直接放行
      next()
    } else {
      // 中转到登录页
      next('/login')
      // 手动关闭进度条
      nprogress.done()
    }
  }
})

/**
 * 后置守卫
 */
router.afterEach(() => {
  nprogress.done()
})
