// 引入封装的axios工具
import request from '@/utils/request'

/**
 *  获取组织架构数据
 */
export function getDepartment() {
  // request发送登录请求，会得到一个promise结果并将其返回
  return request({
    // 请求地址
    url: '/company/department',
    // 请求方式
    method: 'GET'
    // 请求参数,但是这里没有请求参数
    // data: Data
    // 在ES6中上面data: Data可以简写为 data
  })
}
