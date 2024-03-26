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
              <!--$event实参表示类型，也就是下面command中的值，表示事件所携带的默认参数，如果不传data.id的话，默认传入的就是$event实参-->
              <el-dropdown @command="operateDept($event,data.id)">
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
    <!--自定义事件updateDepartment，子组件触发，父组件执行getDepartment方法，刷新组织结构-->
    <!--ref可以获取dom的实例对象，也可以获取自定义组件的实例对象-->
    <add-dept ref="addDept" @updateDepartment="getDepartment" :current-node-id="currentNodeId"
              :show-dialog.sync="showDialog"
    ></add-dept>
  </div>
</template>

<script>
import { getDepartment, delDepartment } from '@/api/department'
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
      // 存储当前点击id
      currentNodeId: null,
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
    operateDept($event, id) {
      if ($event === 'add') {
        // 添加子部门
        // 显示弹层组件
        this.showDialog = true
        // 当前点击节点的id
        this.currentNodeId = id
      } else if ($event === 'edit') {
        // 编辑部门的场景
        this.showDialog = true
        // 当前点击节点的id，后面要用他获取数据，获取数据的最终目的就是数据回显
        // 下面的代码存在问题：
        // 我们点击编辑的时候，会提示我们“找不到对应的部门”，然后我们发现下面传到add-dept组件中的id为null
        // 下面这行代码更新了子组件add-dept中的props，然后又直接调用了子组件add-dept中的getDepartmentDetail方法（同步方法）
        // 但是我们的更新props是一个异步的方法，所以存在一种可能，先执行了getDepartmentDetail方法又刷新的props
        this.currentNodeId = id
        // 要在子组件获取数据
        // 父组件调用子组件的方法来获取数据
        // 此时this.$refs.addDept等同于子组件的this
        // this.$refs.addDept.getDepartmentDetail() 在这里调用会和props产生同步异步的问题
        // 有没有办法等到props更新之后再去调用getDepartmentDetail方法呢？
        // this.$nextTick会等到我们数据更新完毕，执行回调函数
        this.$nextTick(() => {
          this.$refs.addDept.getDepartmentDetail()
        })
      } else if ($event === 'del') {
        // 删除部门
        // 假如用户点击了“取消”，我们这里是不需要管的
        this.$confirm('您确定要删除该部门吗?').then(async() => {
          // 进入到这里，说明用户点击了确认按钮
          await delDepartment(id)
          // 提示消息
          this.$message.success('删除部门成功')
          // 重新拉取数据
          getDepartment()
        })
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
