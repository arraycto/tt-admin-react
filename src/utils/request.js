import axios from 'axios'
import { Modal, notification } from 'antd'

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
window.loginGlobalMessageBoxCount = 0
request.interceptors.response.use(
  response => {
    const res = response.data
    window.requestCount++
    // if the custom code is not 20000, it is judged as an error.
    if (res.status !== 200) {
      if (!window.disableWarning) {
        notification.warning({ message: '警告', description: res.msg, duration: 3 })
      }
      if (res.status === 401) {
        if (window.requestCount === 1) {
          window.location.reload()
        } else if (window.loginGlobalMessageBoxCount === 0) {
          window.loginGlobalMessageBoxCount = 1
          Modal.confirm({
            title: '登录过期',
            content: res.msg,
            onOk: () => {
              window.location.reload()
            },
            onCancel: () => {
              window.loginGlobalMessageBoxCount = 0
            },
            okText: '重新登录',
            cancelText: '取消'
          })
        }
      }
      return Promise.reject(response)
    }
    return Promise.resolve(res)
  },
  error => {
    console.log('err' + error) // for debug
    return Promise.reject(error)
  }
)

export default request
