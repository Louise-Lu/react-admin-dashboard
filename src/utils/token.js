// 封装基于token相关的存取删三个方法

const TOKENKEY = 'token_key'
// 存 token 
function setToken(token) {
  return localStorage.setItem(TOKENKEY, token)
}

// 取 token 
function getToken() {
  return localStorage.getItem(TOKENKEY)
}

// 删 token 
function removeToken() {
  return localStorage.removeItem(TOKENKEY)
}

export {
  setToken,
  getToken,
  removeToken
}