// 和用户相关的状态管理

import { createSlice } from '@reduxjs/toolkit'
import { setToken as _setToken, getToken, removeToken } from '@/utils'
import { loginAPI, getProfileAPI } from '@/apis/user'

const userStore = createSlice({
  name: "user",
  // 数据状态
  initialState: {
    token: getToken() || '',
    userInfo: {} // 从后端API fetch: user/profile
  },
  // 同步修改方法
  reducers: {
    setToken(state, action) {
      state.token = action.payload
      _setToken(action.payload)
    },
    storeUserInfo(state, action) {
      state.userInfo = action.payload
    },
    clearUserInfo(state) {
      state.userInfo = {}
      state.token = ''
      removeToken()
    }
  }
})


// 解构出actionCreater

const { setToken, storeUserInfo, clearUserInfo } = userStore.actions

// 获取reducer函数

const userReducer = userStore.reducer

// 登录获取token异步方法封装
const fetchLogin = (loginForm) => {
  return async (dispatch) => {
    // 1. 发送异步请求 把loginForm写入后端API'/authorizations' 拿到后端返回的数据
    // const res = await request.post('authorizations', loginForm)
    const res = await loginAPI(loginForm)
    // 2. 提交同步action 存入 token
    dispatch(setToken(res.data.token))
  }
}

// 获取个人用户信息异步方法
const fetchUserInfo = () => {
  return async (dispatch) => {
    // request会通过拦截器自动注入之前存储的token
    // const res = await request.get('user/profile')
    const res = await getProfileAPI()
    dispatch(storeUserInfo(res.data))
  }
}

export { fetchLogin, setToken, fetchUserInfo, clearUserInfo }

export default userReducer