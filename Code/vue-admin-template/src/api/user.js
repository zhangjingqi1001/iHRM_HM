// 引入封装的axios工具
import request from '@/utils/request'

// 按需暴露一个登录方法
export function login(Data) {
  // request发送登录请求，会得到一个promise结果并将其返回
  return request({
    // 请求地址
    url: '/sys/login',
    // 请求方式
    method: 'POST',
    // 请求参数
    data: Data
    // 在ES6中上面data: Data可以简写为 data
  })
}

// 获取用户基本信息
export function getUserInfo() {
  return request({
    // 请求地址
    url: '/sys/profile',
    // 请求方式
    method: 'GET'
    // 请求参数
    // data: Data
  })
}
