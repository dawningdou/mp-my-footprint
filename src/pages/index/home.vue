<template>
  <div class = "page">
    <map
      v-if="latitude"
      class="map"
      theme="handDraw"
      id="my-map"
      :longitude = "longitude"
      :latitude = "latitude"
      :scale = "scale"
      :markers = "markers"
      :show-location="true"
      :polyline = "polyline"
      @markertap="markerTap"
      @regionchange="regionChange"
      @tap="onTapMap"
    >
    </map>
    <div class = "search-container" v-if="showSearch">
      <input class = "input" placeholder-style='color: #BFBFBF;' placeholder="想找点什么..." confirm-type='search' @input="onInput" @confirm="onChangeSearch" />
      <div v-if="suggestion && suggestion.length" class ="suggestion-container">
        <div class = "suggestion-item" v-for="(item, ind) in suggestion" :key="ind" @tap="onSelectSuggestion(item)">
          <span>{{item.title}}</span><span style="font-size:20rpx;color: #666666;margin-left:20rpx;">{{item.address}}</span>
        </div>
      </div>
    </div>
    <div class="poi-menu" v-if="showPoiMenu">
      <div class = "menu-item" @tap="onAddMark">添加到我的目的地</div>
      <div class = "menu-item" @tap="onClockIn">{{curActivePoi.visited ? '取消' : ''}}打卡</div>
      <div v-if="curActivePoi._id" class = "menu-item" @tap="onDelete">删除</div>
    </div>
    <div class = "round-button" @tap="onSearchMap" style ="top: 200rpx;right: 20rpx;">
      <image style ="width: 100%;height:100%;" src="/static/images/map/search.png" />
    </div>

    <div class = "round-button location" @tap="onLocationSelf" style ="bottom: 200rpx;right: 20rpx;">
      <image style ="width: 100%;height:100%;" src="/static/images/map/target.png" />
    </div>
    <div class = "bottom-button" >
      <div class = "item" @tap="onShowMark">我的目的地</div>
      <div class = "line"></div>
      <div class = "item" @tap="onShowVisited">我的打卡</div>
    </div>
    <div :class= "['filter', filtered ? 'active' : '']" @tap="onFilter">只展示未打卡</div>
    <div class = "page-shadow"></div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      mapKey: 'JTWBZ-P2EWQ-NZW5Y-GXEKO-DNPWS-E4F6Z',
      latitude: '',
      longitude: '',
      scale: 14,
      markers: [],
      curActivePoi: null,
      polyline: [],
      showSearch: false,
      suggestion: [],
      showPoiMenu: false,
      filtered: false
    }
  },
  computed: {
  },
  methods: {
    ...mapActions([
      'getLocation'
    ]),
    onTapMap () {
      this.curActivePoi = null
      this.showPoiMenu = null
      setTimeout(() => {
        this.markers = this._getPoiMarkers()
      }, 500)
    },
    onLocationSelf () {
      this.map.moveToLocation()
    },
    onClockIn () {
      // 使用云函数
      wx.cloud.callFunction({
        name: 'updateMark',
        data: {
          ...this.curActivePoi,
          visited: this.curActivePoi.visited ? 0 : 1
        }
      }).then((res) => {
        this.showPoiMenu = false
        uni.hideLoading()
        if (res.result.errorCode) {
          uni.showToast({
            icon: 'none',
            title: res.result.errorMessage
          })
        } else { // 更新
          this.curActivePoi = null
          uni.showLoading()
          this.markers = []
          // 使用云函数
          wx.cloud.callFunction({
            name: 'getMarks',
            data: {
              city: this.cityInfo.city
            }
          }).then((res) => {
            this.poiList = res.result.data
            this.markers = this._getPoiMarkers()
            uni.hideLoading()
          })
        }
      })
    },
    onAddMark () {
      uni.showLoading()
      // 使用云函数
      wx.cloud.callFunction({
        name: 'addMark',
        data: {
          ...this.curActivePoi
        }
      }).then((res) => {
        console.log(res)
        this.showPoiMenu = false
        uni.hideLoading()
        if (res.result.errorCode) {
          uni.showToast({
            icon: 'none',
            title: res.result.errorMessage
          })
        } else {
          uni.showLoading()
          wx.cloud.callFunction({
            name: 'getMarks',
            data: {
              city: this.cityInfo.city
            }
          }).then((res) => {
            this.poiList = res.result.data
            this.markers = this._getPoiMarkers()
            uni.hideLoading()
          })
        }
      })
    },
    onDelete () {
      uni.showLoading()
      // 使用云函数
      wx.cloud.callFunction({
        name: 'deleteMark',
        data: {
          ...this.curActivePoi
        }
      }).then((res) => {
        console.log(res)
        this.showPoiMenu = false
        uni.hideLoading()
        if (res.result.errorCode) {
          uni.showToast({
            icon: 'none',
            title: res.result.errorMessage
          })
        } else {
          this.curActivePoi = null
          uni.showLoading()
          wx.cloud.callFunction({
            name: 'getMarks',
            data: {
              city: this.cityInfo.city
            }
          }).then((res) => {
            this.poiList = res.result.data
            this.markers = this._getPoiMarkers()
            uni.hideLoading()
          })
        }
      })
    },
    // 展示我的marks
    onShowMark () {
      uni.showLoading()
      this.markers = []
      // 使用云函数
      wx.cloud.callFunction({
        name: 'getMarks',
        data: {
          city: this.cityInfo.city
        }
      }).then((res) => {
        this.poiList = res.result.data
        this.markers = this._getPoiMarkers()
        uni.hideLoading()
        this.map.includePoints({
          points: this.markers,
          padding: [80]
        })
      })
    },
    onShowVisited () {
      uni.showLoading()
      this.markers = []
      // 使用云函数
      wx.cloud.callFunction({
        name: 'getVisited',
        data: {
          city: this.cityInfo.city
        }
      }).then((res) => {
        this.poiList = res.result.data
        this.markers = this._getPoiMarkers()
        uni.hideLoading()
        this.map.includePoints({
          points: this.markers,
          padding: [80]
        })
      })
    },
    onFilter () {
      this.filtered = !this.filtered
      let filterList = this.poiList
      if (this.filtered) {
        filterList = this.poiList.filter(item => !item.visited)
      }
      this.markers = this._getPoiMarkers(filterList)
    },
    onSearchMap () {
      this.showSearch = !this.showSearch
      this.suggestion = []
      this.curActivePoi = null
      this.poiList = []
      this.markers = []
      this.showPoiMenu = false
    },
    onChangeSearch (e) {
      const keyword = e.detail.value
      if (!String(keyword)) {
        this.suggestion = []
        return
      }
      uni.$request.$get('https://apis.map.qq.com/ws/place/v1/search', {
        boundary: `region(${this.cityInfo.city},0)`,
        keyword,
        key: this.mapKey,
        page_size: 20,
        page_index: 1,
        orderby: '_distance'
      }).then((res) => {
        console.log('search', res)
        this.poiList = res
        this.markers = this._getPoiMarkers()
        this.map.includePoints({
          points: this.markers,
          padding: [80]
        })
        this.showSearch = false
      })
    },
    onInput (e) {
      const keyword = e.detail.value
      if (!String(keyword)) {
        this.suggestion = []
        return
      }
      uni.$request.$get('https://apis.map.qq.com/ws/place/v1/suggestion/', {
        region: this.cityInfo.city,
        keyword,
        key: this.mapKey
      }).then((res) => {
        console.log('suggestion', res)
        this.suggestion = res
      })
    },
    onSelectSuggestion (item) {
      this.poiList = [item]
      this.curActivePoi = item
      this.markers = this._getPoiMarkers()
      setTimeout(() => {
        this.map.moveToLocation({
          latitude: this.curActivePoi.location.lat,
          longitude: this.curActivePoi.location.lng
        })
      }, 500)
      this.showSearch = false
    },
    markerTap (e) {
      const marker = this.markers[e.detail.markerId]
      console.log(this.poiList, marker)
      this.curActivePoi = this.poiList.find(item => item.id === marker.dataId)
      console.log(this.curActivePoi)
      this.map.moveToLocation({
        latitude: this.curActivePoi.location.lat,
        longitude: this.curActivePoi.location.lng
      })
      this.showPoiMenu = true
      setTimeout(() => {
        this.markers = this._getPoiMarkers()
      }, 500)
    },
    regionChange (e) {
      if (e.causedBy === 'scale') { // 缩放时重置
        this.map.getCenterLocation({
          success: (res) => {
            if (Math.abs(this.latitude - res.latitude) < 0.00001 && Math.abs(this.longitude - res.longitude) < 0.00001) { // android bug
              return
            }
            this.latitude = res.latitude
            this.longitude = res.longitude
          }
        })
      }
      if (e.causedBy === 'drag') { // 用户手动拖动
        this.map.getCenterLocation({
          success: (res) => {
            if (Math.abs(this.latitude - res.latitude) < 0.00001 && Math.abs(this.longitude - res.longitude) < 0.00001) { // android bug
              return
            }
            this.latitude = res.latitude
            this.longitude = res.longitude
          }
        })
      }
    },
    _getPoiMarkers (poiList) {
      poiList = poiList || this.poiList
      const ret = []
      if (poiList && poiList.length) {
        let ind = 0
        poiList.forEach((item) => {
          if (!this.curActivePoi || item.id !== this.curActivePoi.id) {
            const marker = this._formatPoiMarker(item, ind)
            ret.push(marker)
            ind++
          }
        })
        if (this.curActivePoi && this.curActivePoi.id) {
          console.log('有active')
          const lastMarker = this._formatPoiMarker(this.curActivePoi, ind, 'active')
          ret.push(lastMarker)
        }
      }
      console.log('poiList', ret)
      return ret
    },
    _formatPoiMarker (dataObj, ind, styleType = 'normal') {
      const markerWidth = 20
      const markerHeight = 20
      const activeWidth = 40
      const activeHeight = 40
      const padding = 2
      const result = {
        id: ind,
        iconPath: dataObj.visited ? '/static/images/map/pin_visited.png' : '/static/images/map/pin.png',
        dataId: dataObj.id,
        latitude: dataObj.location.lat,
        longitude: dataObj.location.lng,
        width: styleType === 'active' ? activeWidth : markerWidth,
        height: styleType === 'active' ? activeHeight : markerHeight,
        label: {
          anchorX: 0,
          fontSize: 11,
          content: dataObj.title,
          textAlign: 'center',
          borderWidth: 1,
          borderRadius: 2,
          padding,
          zIndex: 1,
          anchorY: 2,
          borderColor: '#FF8901',
          bgColor: '#FFFFFF',
          color: '#FF8901'
        }
      }
      return result
    }
  },
  async onLoad () {
    wx.cloud.init()
    wx.cloud.callFunction({
      name: 'login'
    }).then((res) => {
      this.openid = res.result.OPENID
    })
  },
  async onReady () {
    const { latitude, longitude } = await this.getLocation()
    this.latitude = Number(latitude)
    this.longitude = Number(longitude)
    console.log(latitude, longitude)
    setTimeout(async () => {
      this.map = uni.createMapContext('my-map', this)
      const address = await uni.$request.$get('https://apis.map.qq.com/ws/geocoder/v1/', {
        location: `${latitude},${longitude}`,
        key: this.mapKey
      })
      console.log('address', address)
      this.cityInfo = address.ad_info
    }, 500)
  },
  onShareAppMessage () {
    return {
      path: `/pages/index/friend?openid=${this.openid}&city=${this.cityInfo.city}`
    }
  }
}
</script>
<style rel="stylesheet/scss" lang='scss' scoped>
@import "~@/common/styles/page-shadow.scss";
.page {
  width: 100%;
  height: 100%;
}
.map {
  width: 100%;
  height: 100%;
}
.round-button {
  position: fixed;
  z-index: 999;
  width: 68rpx;
  height: 68rpx;
  background:#fff;
  box-shadow:0px 4rpx 12rpx 0px rgba(0,0,0,0.15);
  border-radius:34rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  &.location {
    bottom: 264rpx;
    right: 20rpx;
  }
  &.search {
    top: 200rpx;
    right: 20rpx;
  }
}
.bottom-button {
  width: 360rpx;
  height: 80rpx;
  background: #fedd55;
  border-radius: 10rpx;
  position: fixed;
  bottom: 20rpx;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9;
  text-align: center;
  line-height: 80rpx;
  box-shadow:0px 4rpx 12rpx 0px rgba(0,0,0,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  .item {
    font-size: 28rpx;
    color: #57555c;
    @extend .f-medium;
  }
  .line {
    width: 2rpx;
    height: 30rpx;
    margin: 20rpx;
    background:rgba(87,85,92,0.3);
  }
}
.search-container {
  width: 660rpx;
  padding-right: 90rpx;
  position: fixed;
  z-index: 999;
  top: 200rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  .input {
    padding: 0 40rpx;
    width: 500rpx;
    height: 68rpx;
    line-height: 68rpx;
    border: 1px solid #eee;
    border-radius: 68rpx;
    background: #fff;
    box-shadow:0px 4rpx 12rpx 0px rgba(0,0,0,0.15);
  }
  .suggestion-container {
    background: #fff;
    width: 500rpx;
    padding: 0 40rpx;
    margin-top: 20rpx;
    box-shadow:0px 4rpx 12rpx 0px rgba(0,0,0,0.15);
    .suggestion-item {
      border-bottom: 1rpx solid #eee;
      line-height: 40rpx;
    }
  }
}
.poi-menu {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  box-shadow:0px 4rpx 12rpx 0px rgba(0,0,0,0.15);
  border-radius: 10rpx;
  z-index: 9;
  padding: 20rpx;
  margin-top: 50rpx;
  .menu-item {
    height: 60rpx;
    line-height: 60rpx;
    border-bottom: 1rpx solid #eee;
    &:last-child {
      border-bottom: none;
    }
  }
}
.filter {
  position: fixed;
  bottom: 40rpx;
  right: 20rpx;
  z-index: 9;
  font-size: 24rpx;
  text-decoration: underline;
  color: #999;
  &.active {
    color: #333;
  }
  @extend .f-medium;
}
</style>
