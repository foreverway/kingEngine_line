/* eslint-disable */
import axios from 'axios'
import { parseString } from 'xml2js'

/**
 * 通过ip port匹配合适的url配置
 * @param {*} params
 */
function parseUrlConfig(params: any) {
  return new Promise((resolve, reject) => {
    parseString(params, { explicitArray: false }, (err: any, result: any) => {
      if (err) {
        reject(err)
      } else {
        try {
          const ip = location.hostname
          const port = location.port
          /**
           * @type {Array}
           */
          const whens = result['configuration']['when']
          let config = null
          while (whens.length) {
            const config_ = whens.shift()
            const { clientIP, port: port_ } = config_['$']
            // 默认匹配localhost
            if ((clientIP === 'localhost' || clientIP === '127.0.0.1') && !config) {
              config = config_
            }
            // 如果ip匹配
            if (ip === clientIP) {
              config = config_
              // 如果端口匹配
              if (port === port_) {
                break
              }
            }
            config = config_
          }
          if (!config) {
            reject(new Error('config.xml: 没有找到合适的配置'))
          }
          resolve(config)
        } catch (err2) {
          reject(err2)
        }
      }
    })
  })
}

/**
 * 请求配置文件
 */
export async function initConfig() {
  const configData = await axios.all([
    axios.get('config.xml')
  ]).then(axios.spread(async({ data: webConfig }) => {
    webConfig = await parseUrlConfig(webConfig)
    const config = Object.assign({}, webConfig)
    return config
  })).catch(err => {
    throw err
  })
  return configData
}
