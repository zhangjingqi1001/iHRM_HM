import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/**
 *  Layout @/在vue中代表路径别名
 *  @ 符号表示当前目录的src
 *  @/ 表示src下的layout,而layout又是一个目录，所以会拉取index.vue文件
 *  即index.vue组件就是我们的路由组件，会实现二级路由
 * */
import Layout from '@/layout'
import departmentRouter from '@/router/modules/department'
import approvalRouter from '@/router/modules/approval'
import attendanceRouter from '@/router/modules/attendance'
import employeeRouter from '@/router/modules/employee'
import permissionRouter from '@/router/modules/permission'
import roleRouter from '@/router/modules/role'
import salaryRouter from '@/router/modules/salary'
import socialRouter from '@/router/modules/social'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    // 不展示在左侧菜单栏
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    // 不展示在左侧菜单栏
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  departmentRouter,
  roleRouter,
  employeeRouter,
  permissionRouter,
  attendanceRouter,
  approvalRouter,
  salaryRouter,
  socialRouter,
  // 404 page must be placed at the end !!!
  // 下面这行路由是兜底的方案，如果找不到页面，就会匹配最后的*，然后跳转到404页面
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
