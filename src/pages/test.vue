<template>
<div class="test-page">
  <div class="test-item">
    <div class = 'test-item-title'>地理位置</div>
    <div v-if = "realLocation" class="test-location">
      <div>真实坐标:({{realLocation.latitude}}, {{realLocation.longitude}})</div>
      <div v-if="testLocation.latitude">使用中的测试坐标: ({{testLocation.latitude}}, {{testLocation.longitude}})</div>
      <div v-else style="color: red;">不使用测试坐标</div>
      <div class="scale">
        <button class="scale-btn" @tap="setScale('+')">+</button>
        <button class="scale-btn" @tap="setScale('-')" style = "margin-left: 20rpx;">-</button>
      </div>
      <map
        id="mymap"
        class="map"
        :latitude="mapLocation.latitude"
        :longitude="mapLocation.longitude"
        :scale="scale"
        @regionchange="handleRegionChange"
        @end="handleRegionChange"
        @begin="handleRegionChange"
      >
        <cover-view class="cover"></cover-view>
      </map>
      <div class="test-location">地图坐标:({{mapLocation.latitude}}, {{mapLocation.longitude}})</div>

      <div style ="display:flex; width:100%; margin-top:10px;justify-content: center;">
        <button class="btn-enable" @tap="on_setLocation">使用地图坐标</button>
        <button class="btn-disable" @tap="on_disable">禁用测试坐标</button>
      </div>
    </div>
    <div v-else>请开启位置授权</div>
  </div>
  <div class="test-item">
    <div class = 'test-item-title'>接口环境</div>
    <div>当前环境：{{curEnv}}</div>
    <button :class="curEnv === 'dev' ? 'btn-enable':'btn-disable'" @tap="on_changeEnv">切换为{{curEnv === 'prod' ? '测试' : '正式'}}环境</button>
    <div>注意：切换环境后需要退出微信（杀掉微信进程）后，再次进入生效</div>
  </div>
  <div class="test-item">
    <div class = 'test-item-title'>版本号</div>
    <div>v0.0.1</div>
  </div>
</div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      lat: '',
      lng: '',
      scale: 14,
      testLocation: '',
      realLocation: '',
      mapLocation: {},
      curEnv: ''
    }
  },

  methods: {
    ...mapActions([
      'clearLocation',
      'getLocation'
    ]),
    handleRegionChange (e) {
      if (e.type === 'end') {
        this.mapCtx.getCenterLocation({
          success: (res) => {
            // console.log(res)
            this.mapLocation.latitude = res.latitude.toFixed(5)
            this.mapLocation.longitude = res.longitude.toFixed(5)
          }
        })
      }
    },
    on_lavdao () {
      // 直接放在localStorage里面啦
      const lnglnt = [104.04717, 30.57328]
      this.clearLocation()
      uni.setStorageSync('testLocation', {
        latitude: lnglnt[1],
        longitude: lnglnt[0]
      })
      this.testLocation = {
        latitude: lnglnt[1],
        longitude: lnglnt[0]
      }
    },
    on_setLocation () {
      // 直接放在localStorage里面啦
      this.clearLocation()
      uni.setStorageSync('testLocation', {
        latitude: this.mapLocation.latitude,
        longitude: this.mapLocation.longitude
      })
      this.testLocation = {
        ...this.mapLocation
      }
    },
    on_disable () {
      this.clearLocation()
      uni.setStorageSync('testLocation', {})
      this.testLocation = uni.getStorageSync('testLocation')
      this.mapLocation = {
        ...this.realLocation
      }
    },
    on_changeEnv () {
      uni.setStorageSync('userEnv', this.curEnv === 'prod' ? 'dev' : 'prod')
      this.curEnv = uni.getStorageSync('userEnv')
    },
    setScale (sign) {
      const MAX = 14
      const MIN = 6
      let scale = this.scale
      if (sign === '+') {
        scale = scale >= MAX ? MAX : scale + 1
      } else {
        scale = scale <= MIN ? MIN : scale - 1
      }
      this.scale = scale
    }
  },
  async onLoad () {
    // 获取地理位置
    const [err, ret] = await uni.getLocation('gcj02')
    if (err) {
      console.log('用户拒绝地理位置授权', err)
    } else {
      console.log('用户地理位置授权', ret)
      this.realLocation = ret
    }
    this.testLocation = uni.getStorageSync('testLocation')
    if (this.testLocation && this.testLocation.latitude) {
      this.mapLocation = {
        ...this.testLocation
      }
    } else if (this.realLocation) {
      this.mapLocation = {
        ...this.realLocation
      }
    }
    this.curEnv = uni.$userEnv
  },
  onReady () {
    this.mapCtx = wx.createMapContext('mymap')
  }
}
</script>
<style rel="stylesheet/scss" lang='scss' scoped>
.test-page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #4A4A4A;
  font-size: 28rpx;
  .test-item {
    border-bottom: 10rpx solid rgba(0,0,0,0.03);
    width: 100%;
    margin-bottom: 20rpx;
    padding-bottom: 20rpx;
  }
  .test-item-title {
    margin: 10rpx 0;
    font-size: 32rpx;
  }
  .scale {
    display: flex;
    margin-bottom: 20rpx;
    .scale-btn {
      width: 80rpx;
      height: 80rpx;
      padding: 0;
      line-height: 80rpx;
    }
  }
  .map {
    width: 375 * 2rpx;
    height: 250 * 2rpx;
    .cover {
      width: 16rpx;
      height: 16rpx;
      border-radius: 8rpx;
      background-color: red;
      opacity: 0.5;
      margin-left: 367rpx;
      margin-top: 242rpx;
    }
  }
  .btn-enable, .btn-disable, .btn-zero {
    width: 300rpx;
    height: 80rpx;
    line-height: 80rpx;
    font-size: 28rpx;
    // margin-top: 60rpx;
  }
  .btn-enable {
    color: green;
  }
  .btn-disable {
    color: red;
  }
  .btn-zero {
    color: black;
  }
  .btn-relaunch {
    margin-top: 60rpx;
    width: 630rpx;
    color: #333333;
  }
}
</style>
