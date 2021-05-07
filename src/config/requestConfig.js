/*
 * @Author: dawningdou
 * @Date: 2019-11-05 18:26:51
 * @LastEditTime: 2020-03-26 22:32:31
 * @LastEditors: dawningdou
 * @Description: request设置页
 * @FilePath: /preset-mp-tourism/template/common/src/config/requestConfig.js
 */
import h5Utils from '@/utils/h5Utils'
import pf from '@/common/constants/platform'
import domain from '@/config/domainConfig'

const getAppId = () => {
  const accountInfo = uni.getAccountInfoSync()
  return accountInfo.miniProgram.appId
}
let wxaSessionId

const h5Config = {
  platform: 'h5',
  domain: domain.h5,
  url: {
    h5_scene_id: window && h5Utils.getQuery(window.location.href, 'h5_scene_id'),
    preview_type: window && h5Utils.getQuery(window.location.href, 'preview_type')
  },
  header: {
    'content-type': 'application/json'
  }
}
const mpConfig = {
  platform: 'wxapp',
  domain: domain.mp,
  url: {
    wxa_appid: getAppId(),
    wxa_session_id: () => {
      if (!wxaSessionId) {
        wxaSessionId = uni.getStorageSync('wxa_session_id')
      }
      return wxaSessionId
    }
  },
  header: {
    'content-type': 'application/json',
    // latitude: data => data.lat || '',
    // longitude: data => data.lng || '',
    wxa_session_id: () => {
      if (!wxaSessionId) {
        wxaSessionId = uni.getStorageSync('wxa_session_id')
      }
      return wxaSessionId
    }
  }
}

export default pf === 'h5' ? h5Config : mpConfig
