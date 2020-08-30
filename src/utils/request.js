import axios from 'axios'

const request = axios.create({
  headers: {
    'Content-Type': 'application/json'
  }
})

request.interceptors.request.use(
  config => {
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
// issue-3 登录过期时,只弹出一个框
window.loginGlobalMessageBoxCount = 0
request.interceptors.response.use(
  response => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.status !== 200) {
      if (res.status === 401 && window.loginGlobalMessageBoxCount === 0) {
        window.loginGlobalMessageBoxCount = 1
      }
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return response
    }
  },
  error => {
    console.log('err' + error) // for debug
    return Promise.reject(error)
  }
)

export default request
