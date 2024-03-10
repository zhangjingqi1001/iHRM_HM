// 这个相当于一级路由
import layout from '@/layout/index.vue'

// 默认导出
export default {
  // 路由信息
  path: '/department',
  // 一级路由
  component: layout,
  // 二级路由
  children: [
    {
      // 二级路由path为空，表示'/department'路径时显示一级路由+二级路由
      // 并且按需导入department文件下的组件
      path: '',
      component: () => import('@/views/department'),
      // name属性在这里可以用来跳转，也可以用来标记路由
      // 为什么要标记路由？因为我们后面要做权限的控制，对权限做细分化，
      name: 'department',
      // 路由的元信息，其实就是用来存储数据的，比如说图标信息
      // 在我们的基础模板里面读取了meta的icon和title，并显示在了页面左侧菜单上
      meta: {
        icon: 'tree', // 菜单的图标
        title: '组织' // 菜单的标题
      }
    }
  ]
}
