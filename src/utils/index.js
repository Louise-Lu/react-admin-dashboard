// 统一中转工具模块函数 少写路径 直接 from '@/utils'
// import { request } from '@/utils'

import { request } from './request'
import { setToken, getToken, removeToken } from './token'

export {
  request,
  setToken,
  getToken,
  removeToken
}