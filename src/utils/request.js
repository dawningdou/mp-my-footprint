/*
 * @Author: dawningdou
 * @Date: 2019-10-15 17:56:56
 * @LastEditTime: 2020-04-30 17:16:15
 * @LastEditors: Please set LastEditors
 * @Description: request方法
 * @FilePath: /mp-consul/src/utils/request.js
 */
import { ErrorType } from '@/config/errorConfig'
import REQUEST_CONFIG from '@/config/requestConfig'
const request = {
  getBaseUrl (module = 'default') {
    return REQUEST_CONFIG.domain[uni.$userEnv][module]
  },

  $get (url, data, config = {}) {
    const requestData = this.$requestPreHandle(url, data, config)
    return this.$requestResHandle('GET', requestData)
  },
  // post
  $post (url, data, config = {}) {
    const requestData = this.$requestPreHandle(url, data, config)
    return this.$requestResHandle('POST', requestData)
  },

  // 处理header
  $requestPreHandleHeader (data, headerConfig, userConfig = {}) {
    const fullHeader = {
      ...headerConfig,
      ...(userConfig.header || {})
    }
    const header = {}
    Object.keys(fullHeader).forEach((key) => {
      key = key.toLowerCase()
      if (typeof fullHeader[key] === 'function') {
        header[key] = fullHeader[key](data)
      } else if (fullHeader[key]) {
        header[key] = fullHeader[key]
      }
    })
    return header
  },

  // 处理url参数
  $requestPreHandleURL (url, urlConfig, userConfig = {}) {
    const fullConfig = {
      ...urlConfig,
      ...(userConfig.header || {})
    }
    Object.keys(fullConfig).forEach((key) => {
      const conj = url.indexOf('?') > 0 ? '&' : '?'
      if (typeof fullConfig[key] === 'function') {
        url += `${conj}${key}=${fullConfig[key]()}`
      } else if (fullConfig[key]) {
        url += `${conj}${key}=${fullConfig[key]}`
      }
    })
    return url
  },

  $requestPreHandle (url, data, config = {}) {
    const header = this.$requestPreHandleHeader(data, REQUEST_CONFIG.header, config)
    const paramsURL = this.$requestPreHandleURL(url, REQUEST_CONFIG.url, config)
    const baseUrl = this.getBaseUrl(config.module)
    return {
      header,
      url: baseUrl + paramsURL,
      data: data || {}
    }
  },
  // 发起request请求，并处理返回结果
  $requestResHandle (method, requestData) {
    console.log('<request>', {
      method: method,
      url: requestData.url,
      header: requestData.header,
      parameter: requestData.data
    })
    return new Promise((resolve, reject) => {
      return uni.request({
        url: requestData.url,
        data: requestData.data,
        header: requestData.header,
        method
      }).then((res) => {
        let [err, ret] = res
        if (err) {
          err = {
            errorCode: -1, // API报错
            errorType: ErrorType.NETWORK_ERR,
            errorMessage: err.errMsg
          }
          reject(err)
          return
        } else if (ret.statusCode !== 200) {
          // 请求接口错误
          err = {
            errorCode: ret.statusCode,
            errorType: ErrorType.SERVER_ERR,
            errorMessage: ret.data
          }
          reject(err)
          return
        }
        ret = ret.data
        console.log('<response>', ret)
        if (ret.status === 0 || ret.code === 0 || ret.ret === 0) { // 返回数据正常
          resolve(ret.data || ret.root || ret.result)
        } else { // 返回信息格式化
          err = {
            errorType: ErrorType.SERVER_ERR,
            errorCode: ret.code || ret.ret,
            errorMessage: ret.errorMessage || ret.errMsg || ret.message || ret.msg
          }
          reject(err)
        }
      }).catch((err) => {
        const error = {
          errorCode: -2, // 未知错误
          errorType: '',
          errorMessage: err.message
        }
        reject(error)
      })
    })
  }
}
export default request
