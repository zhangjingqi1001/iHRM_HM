<template>
  <!--:visible用来控制显示和隐藏,由于我们是一个组件，所以我们需要外部传入一个参数来控制显示还是隐藏-->
  <!--@close用于监视关闭弹层（点击右上角×号的时候，就会执行此函数）-->
  <el-dialog :title="showTitle" :visible="showDialog" @close="close">
    <!--放置弹层内容-->
    <!--label-width设置文本的宽度，这样文本框左边的字就能对其了-->
    <el-form :model="formData" :rules="rules" ref="addDept" label-width="120px">
      <el-form-item prop="name" label="部门名称">
        <!--place-holder是文本提示信息-->
        <el-input v-model="formData.name" placeholder="2-10个字符" style="width: 80%" size="mini"></el-input>
      </el-form-item>
      <el-form-item prop="code" label="部门编码">
        <el-input v-model="formData.code" placeholder="2-10个字符" style="width: 80%" size="mini"></el-input>
      </el-form-item>
      <el-form-item prop="managerId" label="部门负责人">
        <!--这个地方是一个下拉菜单-->
        <el-select v-model="formData.managerId" placeholder="请选择负责人" style="width: 80%" size="mini">
          <!--下拉选项，循环managerList-->
          <!--label其实是下拉选项中所显示的字段名称；v-model的值为当前被选中的el-option的value属性值-->
          <el-option v-for="item in managerList" :key="item.id" :label="item.username" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="introduce" label="部门介绍">
        <!--文本域,4行-->
        <el-input v-model="formData.introduce" type="textarea" :rows="4" placeholder="1-100个字符" style="width: 80%"
                  size="mini"
        >
        </el-input>
      </el-form-item>
      <!--按钮部分，并且要实现居中-->
      <el-form-item>
        <!--我们可以使用行和列实现居中布局-->
        <!--justify="center" 水平方式居中-->
        <el-row type="flex" justify="center">
          <el-col :span="12">
            <el-button @click="btnOK" type="primary" size="mini">确定</el-button>
            <el-button @click="close" size="mini">取消</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { getDepartment, getManagerList, addDepartment, getDepartmentDetail, updateDepartment } from '@/api/department'

export default {
  // 接收外部传输过来的值
  props: {
    // 参数showDialog，类型限制为Boolean，默认值为false
    showDialog: { type: Boolean, default: false },
    currentNodeId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      // 存储负责人的列表
      managerList: [],
      formData: {
        code: '', // 部门编码
        introduce: '', // 部门介绍
        managerId: '', // 部门负责人id
        name: '', // 部门名称,
        pid: '' // 父级部门的id
      },
      rules: {
        // 部门编码
        code: [{ required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 2, max: 10, message: '部门编码的长度2-10个字符' },
          // 自定义业务校验，部门编码不能重复
          {
            trigger: 'blur', validator: async(rule, value, callback) => {
              // value值是输入的编码值
              let result = await getDepartment()
              // 判断此时是编辑模式还是新增模式
              if (this.formData.id) {
                // 存在id，说明是编辑状态,我们要将自身排除掉
                result = result.filter(item => item.id !== this.formData.id)
              }
              // result实际是一个数组，然后查看数组中是否存在用户输入的value值
              // 我们可以使用some()方法，如果存在就返回true，不存在就返回false
              if (result.some(item => item.code === value)) {
                // 校验失败时的错误对象
                callback(new Error('部门中已经有该编码'))
              } else {
                // 校验成功时的对象
                callback()
              }
            }
          }],
        // 部门介绍
        introduce: [{ required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { min: 2, max: 10, message: '部门名称的长度1-100个字符' }],
        // 部门负责人id
        managerId:
          [{ required: true, message: '部门负责人id不能为空', trigger: 'blur' }],
        // 部门名称
        name:
          [{ required: true, message: '部门名称不能为空', trigger: 'blur' },
            { min: 2, max: 10, message: '部门名称的长度2-10个字符' },
            {
              trigger: 'blur', validator: async(rule, value, callback) => {
                // value值是输入的编码值
                let result = await getDepartment()
                // 判断此时是编辑模式还是新增模式
                if (this.formData.id) {
                  // 存在id，说明是编辑状态,我们要将自身排除掉
                  result = result.filter(item => item.id !== this.formData.id)
                }
                // result实际是一个数组，然后查看数组中是否存在用户输入的value值
                // 我们可以使用some()方法，如果存在就返回true，不存在就返回false
                if (result.some(item => item.name === value)) {
                  // 校验失败时的错误对象
                  callback(new Error('部门中已经有该名称'))
                } else {
                  // 校验成功时的对象
                  callback()
                }
              }
            }]
        // pid: '' // 父级部门的id
      }
    }
  },
  created() {
    this.getManagerList()
  },
  methods: {
    close() {
      // 重置表单
      this.formData =
        {
          code: '', // 部门编码
          introduce: '', // 部门介绍
          managerId: '', // 部门负责人id
          name: '', // 部门名称,
          pid: '' // 父级部门的id
        }
      // resetFields重置表单有一个局限性，只能重置在模板中绑定的数据（假如说没有绑定某个字段，那这个字段肯定不能重置）
      this.$refs.addDept.resetFields()
      // 修改父组件的值，子传给父亲
      // this.$emit可以触发一个自定义事件（父组件需要接收这个时间），然后把false这个值传出去
      // this.$emit(''，false) 但是我们先不用这个方法
      // 这里我们使用了 sync修饰，表示会接受子组件的事件，也就是update:showDialog这个事件，然后会把值赋值给showDialog
      this.$emit('update:showDialog', false)
    },
    async getManagerList() {
      this.managerList = await getManagerList()
    },
    // 点击确定时调用此方法
    btnOK() {
      this.$refs.addDept.validate(async isOK => {
        if (isOK) {
          let msg = '新增'
          // 通过formData中是否有id来确认是“编辑”环境还是“增加”环境
          if (this.formData.id) {
            // 编辑场景
            msg = '编辑'
            await updateDepartment(this.formData)
          } else {
            // 新增场景
            // ...this.formData 表示相当于把formData数据进行了拷贝，考到了一个新对象里面
            // pid: this.currentNodeId表示将formData中的pid赋值上currentNodeId
            await addDepartment({ ...this.formData, pid: this.currentNodeId })
          }
          // 校验已经通过
          // 此时可以通知父组件更新，也就是子传父，可以选择触发一个自定义事件(父组件要监听这个事件)
          this.$emit('updateDepartment')
          // 提示消息
          this.$message.success(+`${msg}部门成功`)
          // 关闭
          this.close()
        }
      })
    },
    // 获取组织的详情
    async getDepartmentDetail() {
      const result = await getDepartmentDetail(this.currentNodeId)
      // 完成数据回显
      this.formData = result
    }
  },
  computed: {
    showTitle() {
      return this.formData.id ? '编辑部门' : '新增部门'
    }
  }
}
</script>
