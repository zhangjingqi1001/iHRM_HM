<template>
  <!--:visible用来控制显示和隐藏,由于我们是一个组件，所以我们需要外部传入一个参数来控制显示还是隐藏-->
  <!--@close用于监视关闭弹层（点击右上角×号的时候，就会执行此函数）-->
  <el-dialog title="新增部门" :visible="showDialog" @close="close">
    <!--放置弹层内容-->
    <!--label-width设置文本的宽度，这样文本框左边的字就能对其了-->
    <el-form label-width="120px">
      <el-form-item label="部门名称">
        <!--place-holder是文本提示信息-->
        <el-input place-holder="2-10个字符" style="width: 80%" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="部门编码">
        <el-input place-holder="2-10个字符" style="width: 80%" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="部门负责人">
        <!--这个地方是一个下拉菜单-->
        <el-select place-holder="请选择负责人" style="width: 80%" size="mini"></el-select>
      </el-form-item>
      <el-form-item label="部门介绍">
        <!--文本域,4行-->
        <el-input type="textarea" :rows="4" place-holder="1-100个字符" style="width: 80%" size="mini"></el-input>
      </el-form-item>
      <!--按钮部分，并且要实现居中-->
      <el-form-item>
        <!--我们可以使用行和列实现居中布局-->
        <!--justify="center" 水平方式居中-->
        <el-row type="flex" justify="center">
          <el-col :span="12">
            <el-button type="primary" size="mini">确定</el-button>
            <el-button size="mini">取消</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  // 接收外部传输过来的值
  props: {
    // 参数showDialog，类型限制为Boolean，默认值为false
    showDialog: { type: Boolean, default: false }
  },
  methods: {
    close() {
      // 修改父组件的值，子传给父亲
      // this.$emit可以触发一个自定义事件（父组件需要接收这个时间），然后把false这个值传出去
      // this.$emit(''，false) 但是我们先不用这个方法
      // 这里我们使用了 sync修饰，表示会接受子组件的事件，也就是update:showDialog这个事件，然后会把值赋值给showDialog
      this.$emit('update:showDialog', false)
    }
  }
}
</script>
