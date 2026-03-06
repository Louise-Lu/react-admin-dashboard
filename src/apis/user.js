// 把项目中的所有接口按照业务模块以函数的形式统一封装到apis模块中
// request.js -> apis

// 用户相关的所有网络请求
// const request: AxiosInstance 有 baseurl 和 timeout
import { request } from "@/utils"

// 1. 登录请求
//  const res = await request.post('authorizations', loginForm)
export function loginAPI(formData) {
  return request({
    url: '/authorizations',
    method: 'POST',
    data: formData  // 请求参数
  })
}

// 2. 获取用户信息
// const res = await request.get('user/profile')

export function getProfileAPI() {
  return request({
    url: '/user/profile',
    method: 'GET'
  })
}