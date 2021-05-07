<script>
// 判断ipx
function ltIpx (model) {
  const ret = model.match(/IPHONE ([^ ]*)/)
  if (ret && ret[1]) {
    if (ret[1] === 'X' || Number(ret[1]) > 10) {
      return true
    }
  }
}
// 判断ipx
function checkiPhoneX (systemInfo) {
  if (uni.$platform === 'h5') { // todo
    systemInfo.isiPhoneX = false
    systemInfo.ipxClass = ''
    systemInfo.platform = ''
  } else {
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
  }
  return systemInfo
}
// 赋值menubutton
function setMenuButton (systemInfo) {
  if (uni.$platform === 'h5') {
    systemInfo.menuButton = {
      bottom: 48,
      top: 5,
      height: 48
    }
    systemInfo.navHeight = systemInfo.menuButton.bottom + 10
    systemInfo.navigationCustomed = true
  } else {
    // 获取菜单按钮（右上角胶囊按钮）的布局位置信息。坐标信息以屏幕左上角为原点。
    const navigationCustomed = compareVersion(systemInfo, '2.4.2') > 0
    try {
      systemInfo.menuButton = navigationCustomed ? uni.getMenuButtonBoundingClientRect() : null
    } catch (err) {
      console.log('err, can not use getMenuButtonBoundingClientRect')
      systemInfo.menuButton = null
    }
    systemInfo.navHeight = systemInfo.menuButton.bottom + 10
    systemInfo.navigationCustomed = navigationCustomed
  }
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

export default {
  onLaunch: function () {
    let systemInfo = uni.getSystemInfoSync()
    systemInfo = checkiPhoneX(systemInfo)
    systemInfo = setMenuButton(systemInfo)
    systemInfo.ratio = systemInfo.windowWidth / 750
    uni.$globalData = {
      systemInfo,
      isH5: uni.$platform === 'h5'
    }
    uni.$env = process.env.NODE_ENV
    uni.$userEnv = uni.$env === 'production' ? 'prod' : (uni.getStorageSync('userEnv') || 'dev') // dev下默认接口环境
    console.log('app created', uni.$globalData)
    if (uni.$platform === 'mp') {
      this.$store.dispatch('getLocalUserInfo')
      this.$store.dispatch('userLogin').then(res => {
        console.log('userlogin ok')
        this.$store.dispatch('checkBind')
      })
    }
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  }
}
</script>

<style rel="stylesheet/scss" lang='scss'>
@import "~@/common/styles/parse.scss";
page {
  height: 100%;
}
.page-iphonex::after {
  content: ' ';
  width: 100%;
  height: 68rpx;
  display: block;
}
</style>
