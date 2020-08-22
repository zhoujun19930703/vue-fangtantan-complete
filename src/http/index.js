import axios from 'axios'
import {getToken} from '../utils/auth'
import store from '../utils/storage'

const env = process.env.NODE_ENV
let baseURL = ''
if (env === 'development') { // 本地环境
  baseURL = '/api'
} else if (env === 'production') { // 生产环境
  baseURL = 'https://test-api.jbh58.com'
} else if (env === 'test') { // 测试环境
  baseURL = 'https://test-api.jbh58.com'
}
const createService = (customization) => {
  // 创建axios
  const service = axios.create({ baseURL })
  // 请求拦截
  service.interceptors.request.use(
    (config) => {
      if (customization) {
        config = { ...config, ...customization }
      }
      // 可以在请求头添加token等值!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      // config.headers['Access-Token'] = 'abd876ad3f6a4108fbd26a27decffca6'
      config.headers['Access-Token'] = getToken()
      // config.headers["utmUis"] = "";
      // config.headers["utmContent"] = "";
      // config.headers["utmTerm"] = "";
      // config.headers["utmPlan"] = "";
      // config.headers["utmUnit"] = "";
      // config.headers["utmSucai"] = "";
      // config.headers["source"] = "";
      // config.headers["platformId"] = "4";
      // config.headers["cityId"] = "1";
      return config
    },
    (error) => {
      Promise.reject(error)
    }
  )
  // 响应拦截
  service.interceptors.response.use(
    (response) => {
      const res = response.data
      // 可以在该处拦截错误信息，如下：!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      // const { code, status, msg } = res
      //
      // if ((code && code === 10114) || (status && status === 10114 || status === '40101' || status === '10114')) {
      //   const errorMsg = msg || 'TOKEN已经过期, 请重新登录!'
      //   return Promise.reject(errorMsg)
      // }
      return res
    },
    (error) => {
      Promise.reject(error)
    }
  )
  return service
}

const createConfig = (config, data) => {
  const type = config.method === 'post' ? 'data' : 'params'
  const result = {
    method: config.method,
    url: config.url,
  }
  if (data && Object.keys(data).length) {
    result[type] = data
  }
  return result
}
/*
 * 封装ajax
 */
const ajaxService = createService()

export function ajax (config, data) {
  return new Promise((resolve, reject) => {
    const _ops = createConfig(config, data)
    ajaxService(_ops)
    .then((res) => {
      resolve(res)
    })
    .catch((err) => {
      reject(err)
    })
  })
}
