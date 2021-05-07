<template>
  <div class="navBar-wrap" :style="{ opacity: colorBlack ? navBarBgOpacity : 1 - navBarBgOpacity, height: navHeight }">
    <!-- [首页选城市] start -->
    <div v-if="navType === 'home'" :class="['city-switch', colorBlack ? 'black' : '']" @tap="switchCity"
      :style="{ 'margin-top': menuTop, height: menuHeight }">
      <div>{{cityName}}</div>
      <image :src="'/static/images/home/down' + (colorBlack ? '-black' : '') + '.png'" class="triagle" />
    </div>
    <!-- [首页选城市] end -->
    <!-- [普通类型的home按钮和箭头] start -->
    <div v-else class="btns-wrap"
      :style="{ 'margin-top': menuTop, height: menuHeight }">
      <image @tap="goBack" v-if="showBack" class="goback-btn" :src="'/static/images/nav/back' + (colorBlack ? '-black' : '') + '.png'" />
      <image @tap="goHome" v-if="showHome" class="home-btn" :src="'/static/images/nav/home' + (colorBlack ? '-black' : '') + '.png'" />
    </div>
    <!-- [普通类型的箭头] end -->
    <div v-if="title && (colorBlack || alwaysShowTitle)" class="title"
      :style="{ 'margin-top': menuTop, height: menuHeight, width: titleWidth, 'margin-right': titleMargin }" >
      <div class="title-text">{{title}}</div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      showBack: false,
      showHome: false
    }
  },
  props: {
    navType: {
      type: String,
      default: 'default'
    },
    colorBlack: {
      type: Boolean,
      default: true
    },
    navBarBgOpacity: {
      type: Number,
      default: 0
    },
    navHeight: {
      type: String,
      default: '128px'
    },
    menuTop: {
      type: String,
      default: '26px'
    },
    menuHeight: {
      type: String,
      default: '32px'
    },
    cityName: {
      type: String,
      default: '伦敦'
    },
    alwaysShowTitle: {
      type: Boolean,
      default: false
    },
    alwaysShowHome: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    titleMargin: {
      type: String,
      default: '97px'
    },
    titleWidth: {
      type: String,
      default: '181px'
    }
  },
  computed: {
  },
  methods: {
    goBack () {
      this.$emit('goBack')
    },
    goHome () {
      this.$emit('goHome')
      // uni.reLaunch({ url: '/pages/index/home' })
    },
    switchCity () {}
  },
  mounted () {
    const pages = getCurrentPages()
    this.showBack = pages.length > 1
    this.showHome = pages.length === 1 || this.alwaysShowHome
  }
}
</script>

<style rel="stylesheet/scss" lang='scss' scoped>
  .navBar {
    width: 100%;
    position: fixed;
    top: 0;
    z-index: 99999;
    &.absolute {
      position: absolute;
    }
    &-bg {
      width: 100%;
      background: #fff;
      position: absolute;
      top: 0;
      left: 0;
    }
    &-wrap {
      width: 720rpx;
      position: absolute;
      padding-left: 30rpx;
      top: 0;
      left: 0;
      display: flex;
      justify-content: space-between;
      transition: opacity 0.3s;
      &.hidden {
        visibility: hidden;
      }
    }
  }
  .title {
    display: flex;
    align-items: center;
    justify-content: center;
    .title-text {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: center;
    }
  }
  .city-switch {
    color: #fff;
    font-size: 30rpx;
    display: inline-flex;
    align-items: center;
    font-weight: 700;
    &.ios {
      font-family: 'PingFangSC-Medium';
      font-weight: 600;
    }
    &.black {
      color: #4a4a4a;
    }
    .triagle {
      margin: 0 18rpx 0 10rpx;
      width: 24rpx;
      height: 24rpx;
    }
  }
  .btns-wrap {
    display: inline-flex;
    align-items: center;
  }
  .home-btn {
    width: 48rpx;
    height: 48rpx;
  }
  .goback-btn {
    width: 50rpx;
    height: 48rpx;
    margin-right: 25rpx;
  }
</style>
