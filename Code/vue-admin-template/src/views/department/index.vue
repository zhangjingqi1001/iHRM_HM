<template>
  <!--为什么这里写container和app-container？ 因为我们最初的时候导入过样式-->
  <div class="container">
    <!--在此容器上加了边距（上下30px，左右140px）-->
    <div class="app-container">
      组织架构

      <!--展示树形结构-->
      <!--此处正好是标签的属性名叫props，和vue框架中组件传递数据不是一个-->
      <!--default-expand-all属性表示默认将所有的树形结构打开，完整写法是 :default-expand-all=“true” (一定带冒号)-->
      <el-tree :data="depts" :props="defaultProps" default-expand-all :expand-on-click-node="false">
        <!--v-slot标签只能使用在template标签上-->
        <!--这个data数据其实是el-tree给的，下面的template模板会不断的去循环，有多少个节点就会循环多少次，把每一个数据都塞到了data里面-->
        <template v-slot="{data}">
          <!--节点结构。使用el-tree组件的插槽-->
          <!--会读取这个节点结构并循环渲染到页面上-->
          <!--我们如果把type布局模式设置为"flex"，就可以用厚民安的两个属性，justify="space-between"表示两头对其,align="middle"表示垂直居中-->
          <el-row type="flex" justify="space-between" align="middle" style="width: 100%;height: 40px">
            <!--一行里面有两列,第一列是组织名称，第二列是管理员和操作（下拉菜单）-->
            <el-col>{{ data.name }}</el-col>
            <!--:span="4"一定带着冒号，因为人家想要一个数字类型-->
            <el-col :span="6">
              <span class="tree-manager">{{ data.managerName }}</span>
              <!--下拉菜单组件-->
              <!--@command是下拉菜单的执行方法，当点击下拉菜单中的某一项的时候，就会执行operateDept方法-->
              <el-dropdown @command="operateDept" >
                <!--显示区域内容-->
                <span class="el-dropdown-link">
                 操作<i class="el-icon-arrow-down el-icon--right"></i>
             </span>
                <!--下拉菜单的选项-->
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="add">添加子部门</el-dropdown-item>
                  <el-dropdown-item command="edit">编辑部门</el-dropdown-item>
                  <el-dropdown-item command="del">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </el-row>
        </template>
      </el-tree>
    </div>
    <!--放置弹层-->
    <!--:show-dialog 是我们在add-dept组件中定义的props-->
    <!--sync修饰，表示会接受子组件的事件，也就是update:showDialog这个事件，然后会把值赋值给下面的showDialog-->
    <add-dept :show-dialog.sync="showDialog"></add-dept>
  </div>
</template>

<script>
import { getDepartment } from '@/api/department'
import { transListToTreeData } from '@/utils'
// 引入封装的弹层组件
import AddDept from './components/add-dept.vue'

export default {
  name: 'Department',
  components: { AddDept },
  // 完成AddDept组件局部注册
  comments: { AddDept },
  data() {
    return {
      // 数组属性
      depts: [''],
      defaultProps: {
        // 当前层级数据（在这里找此层级的显示数据）
        label: 'name',
        // 子层级（其实就是层级结构，在这里找子节点）
        children: 'children'
      },
      // 控制弹层的显示和隐藏
      showDialog: false
    }
  },
  // 页面初始化的时候会调用这个函数
  created() {
    // 获取部门数据，这个方法是下面methods里面的，不是api里面的
    this.getDepartment()
  },
  methods: {
    async getDepartment() {
      // 下面这个方法是import导入的api请求方法
      const result = await getDepartment()
      // 但是我们获取到的数据是列表的形式，没有层级结构，我们要使用递归的方式完成树形结构
      this.depts = transListToTreeData(result, 0)
    },
    operateDept(type) {
      if (type === 'add') {
        // 添加子部门
        // 显示弹层组件
        this.showDialog = true
      }
    }
  }
}
</script>

<style scoped>
.app-container {
  padding: 30px 140px;
}

.tree-manager {
  width: 50px;
  display: inline-block;
//margin: 10px; margin-right: 50px;
}
</style>
