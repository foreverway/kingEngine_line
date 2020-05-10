import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import { UserModule } from '@/store/modules/user'
import { initConfig } from '@/utils/xmlConfig'

const baseURL = sessionStorage.getItem('baseURL')
const service: any = axios.create({
  baseURL: baseURL || undefined,
  timeout: 50000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 读取配置文件
if (!baseURL) {
  initConfig().then((configData) => {
    service.defaults.baseURL = configData.WebService
    sessionStorage.setItem('baseURL', configData.WebService)
    sessionStorage.setItem('gisLayer', configData.GisLayer)
  }).catch((err) => {
    Message({
      message: '读取配置文件失败！',
      type: 'error',
      duration: 5 * 1000
    })
  })
}

service.interceptors.request.use(
  (config: any) => {
    if (UserModule.token) {
      config.headers['X-Access-Token'] = UserModule.token
    }
    return config
  },
  (error: any) => {
    Promise.reject(error)
  }
)
service.interceptors.response.use(
  (response: any) => {
    const res = response.data
    // if (res.code !== '1' && res.code !== 1 && res.code !== 200) {
    // return Promise.reject(new Error(res.msg || 'Error1'))
    // }
    return response.data
  },
  (error: any) => {
    console.log(error)
    return Promise.reject(error)
  }
)

export default service
