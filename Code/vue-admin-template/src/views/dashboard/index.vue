<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  }
  // 初始化之后会执行的一个钩子函数
  // 能进入主页说明是有token的，所以可以在这里调用action
  // 首页调用不合适，不能在这里获取用户信息
  // created() {
  //   this.$store.dispatch('user/getUserInfo')
  // }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
