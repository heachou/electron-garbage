import axios, { AxiosError } from 'axios'
import Service from '../services/service'
import { showErrorMessage } from '.'

const baseURL = import.meta.env.VITE_API_HOST

// 为 AxiosRequestConfig 扩展自定义属性
declare module 'axios' {
  export interface AxiosRequestConfig {
    skipNotification?: boolean
  }
}

const request = axios.create({
  baseURL,
  timeout: 30 * 1000
})

// 添加请求拦截器
request.interceptors.request.use(
  (config) => {
    // 从本地存储获取 token
    const token = Service.getInstance().user.getToken()
    if (token) {
      config.headers['Authorization'] = token
    }
    return config
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
request.interceptors.response.use(
  (response) => {
    const { code } = response.data
    if (code === 200) {
      return response.data
    }
    if (code === 401) {
      Service.getInstance().user.logout()
      // 检查是否跳过通知
      if (!response.config.skipNotification) {
        showErrorMessage('登录已失效，请重新登录')
      }
    }
    // 对于非 200 和 401 的业务错误，也检查 skipNotification
    if (!response.config.skipNotification && response.data.msg) {
      showErrorMessage(response.data.msg)
    }
    // 处理返回的 text 类型
    if (response.config.responseType === 'text') {
      return response.data
    }
    return Promise.reject(response.data)
  },
  (error: AxiosError) => {
    // 明确 error 类型为 AxiosError
    // error.config 可能未定义，需要检查
    if (error.config && !error.config.skipNotification) {
      showErrorMessage(`请求错误：${error.message}`)
    }
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)

export default request
