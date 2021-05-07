import Vue from 'vue'
import App from './App'
import store from './store'
import platform from '@/common/constants/platform'
import domain from '@/config/domainConfig'
import { routeTo, routeBack } from '@/utils/routeUtil'
import request from '@/utils/request'
import logger from '@/utils/logger'
// const cloud = require('wx-server-sdk')
// cloud.init()

uni.$platform = platform
Vue.config.productionTip = false
App.mpType = 'app'
Vue.prototype.$store = store
const app = new Vue({
  ...App
})
// ====================================================
// 全局方法-路由
uni.$router = {
  routeTo,
  routeBack
}
// 全局方法-请求
uni.$request = request
// 全局变量-编译环境
uni.$env = process.env.NODE_ENV
console.log(`编译环境: ${uni.$env}`)
// 全局变量-接口切换环境
uni.$userEnv = uni.$env === 'production' ? 'prod' : (uni.getStorageSync('userEnv') || 'dev') // dev下默认接口环境
console.log(`接口环境: ${uni.$userEnv}`)
// 全局变量-接口域名
uni.$domain = domain.mp[uni.$userEnv]
console.log('接口域名:', uni.$domain)
// 全局变量-系统信息
let systemInfo = uni.getSystemInfoSync()
systemInfo = checkiPhoneX(systemInfo)
systemInfo = setMenuButton(systemInfo)
systemInfo = setEnableHeightFix(systemInfo)
systemInfo.ratio = systemInfo.windowWidth / 750
uni.$systemInfo = systemInfo
console.log('系统信息:', uni.$systemInfo)
// 全局变量-app平台
uni.$platform = 'mp' // 小程序
// 开发者工具
uni.$isDevTool = uni.getSystemInfoSync().platform// 小程序
// logger
uni.$logger = logger
// 全局变量-数据
uni.$globalData = {}
// ==================================
Vue.mixin({
  computed: {
  },
  onLoad () {
    const { systemInfo } = uni.$globalData
    this.ipxClass = systemInfo.ipxClass
    this.platform = systemInfo.platform
    this.h5Class = uni.$platform === 'h5' ? 'h5Class' : ''
    console.log('onLoad!!!!')
  },
  data () {
    return {
      ipxClass: '',
      platform: '',
      h5Class: ''
    }
  }
})
app.$mount()
// ======================================================
// 判断ipx
function ltIpx (model) {
  const ret = model.match(/IPHONE ([^ ]*)/)
  if (ret && ret[1]) {
    if (ret[1].match(/X/) || Number(ret[1]) > 10) {
      return true
    }
  }
}
// 判断长屏
function checkiPhoneX (systemInfo) {
  const model = systemInfo.model && systemInfo.model.toUpperCase()
  const system = systemInfo.system && systemInfo.system.toLowerCase()
  if (ltIpx(model)) {
    systemInfo.isiPhoneX = true
    systemInfo.ipxClass = 'page-iphonex'
  } else {
    systemInfo.isiPhoneX = false
  }
  if (system.indexOf('ios') !== -1) {
    systemInfo.platform = 'ios'
  }
  return systemInfo
}
// 赋值menubutton
function setMenuButton (systemInfo) {
  if (uni.$platform === 'h5') {
    systemInfo.menuButton = {}
    systemInfo.navigationCustomed = true
  } else {
    // 获取菜单按钮（右上角胶囊按钮）的布局位置信息。坐标信息以屏幕左上角为原点。
    const navigationCustomed = compareVersion(systemInfo, '2.4.2') > 0
    try {
      systemInfo.menuButton = navigationCustomed ? uni.getMenuButtonBoundingClientRect() : null
      if (systemInfo.menuButton.height) {
        console.log('set menu storage', systemInfo.menuButton)
        uni.setStorage({
          key: 'menuButton',
          data: systemInfo.menuButton
        })
      } else {
        throw new Error()
      }
    } catch (err) {
      console.log('err, can not use getMenuButtonBoundingClientRect')
      // 读取localstorage里面的数据
      const rect = uni.getStorageSync('menuButton')
      console.log('使用localstorage里面的数据')
      if (rect) {
        systemInfo.menuButton = rect
      } else {
        systemInfo.menuButton = null
      }
    }
    if (!systemInfo.menuButton.height) {
      systemInfo.menuButton = navigationCustomed ? uni.getMenuButtonBoundingClientRect() : null
    }
    systemInfo.navigationCustomed = !!systemInfo.menuButton
    systemInfo.navHeight = systemInfo.menuButton ? systemInfo.menuButton.bottom + 10 : 0
  }
  return systemInfo
}
function setEnableHeightFix (systemInfo) {
  const heightFix = compareVersion(systemInfo, '2.10.4') >= 0
  systemInfo.enableHeightFix = heightFix
  return systemInfo
}
// 比较sdk版本
function compareVersion (systemInfo, baseV) {
  const v1 = systemInfo.SDKVersion.split('.')
  baseV = baseV.split('.')
  const len = Math.max(v1.length, baseV.length)
  while (v1.length < len) {
    v1.push('0')
  }
  while (baseV.length < len) {
    baseV.push('0')
  }
  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1[i])
    const num2 = parseInt(baseV[i])
    if (num1 > num2) {
      return 1
    } else if (num1 < num2) {
      return -1
    }
  }
  return 0
}
