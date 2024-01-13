// 我们使用了一个cookie的包，其实和localStorage都可以实现前端缓存数据
import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'

// 获取token
export function getToken() {
  return Cookies.get(TokenKey)
}

// 设置token
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

// 移除token.退出场景时会用到此函数
export function removeToken() {
  return Cookies.remove(TokenKey)
}
