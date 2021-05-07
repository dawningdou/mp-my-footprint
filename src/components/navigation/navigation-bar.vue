<template>
  <div class="outter">
    <div class="padding" v-if="navType === 'static'" :style="{ height: navHeight }"></div>
    <div :class="['navBar', customNav ? 'fixed' : 'absolute']" :style="{ height: navHeight }">
      <!-- 底色 start -->
      <div v-if="customNav" class='navBar-bg' :style="{ opacity: navBarBgOpacity, height: navHeight, backgroundColor: backgroundColor }"></div>
      <!-- 底色 end -->
      <!-- 导航内容 黑色字 向下滚动一部分后显示 start -->
      <NavInner v-if="customNav"
        :navBarBgOpacity="navBarBgOpacity"
        :colorBlack="true"
        :navType="navType"
        :alwaysShowHome="alwaysShowHome"
        :navHeight="navHeight"
        :menuTop="menuTop"
        :menuHeight="menuHeight"
        :cityName="cityName"
        :alwaysShowTitle="alwaysShowTitle"
        :title="title"
        :titleWidth="titleWidth"
        :titleMargin="titleMargin"
        @goBack="goBack"
        @goHome="goHome"
       />
      <!-- 导航内容 黑色字 end -->
      <!-- 导航内容 白色字 start -->
      <NavInner v-if="navType !== 'static'"
        :navBarBgOpacity="navBarBgOpacity"
        :colorBlack="false"
        :navType="navType"
        :alwaysShowHome="alwaysShowHome"
        :navHeight="navHeight"
        :menuTop="menuTop"
        :menuHeight="menuHeight"
        :alwaysShowTitle="alwaysShowTitle"
        :cityName="cityName"
        :title="title"
        :titleWidth="titleWidth"
        :titleMargin="titleMargin"
        @goBack="goBack"
        @goHome="goHome"
       />
      <!-- 导航内容 白色字 end -->
    </div>
    <div id="nav-anchor" class="nav-anchor"></div>
  </div>
</template>

<script>
// navType三种类型： home, static, default 默认default
import NavInner from '@/components/navigation/nav-inner'
import { routeBack, routeTo } from '@/utils/routeUtil'
export default {
  components: {
    NavInner
  },
  data () {
    return {
      customNav: false,
      navBarBgOpacity: 0,
      obAnchor: null,
      navHeight: '128px',
      menuTop: '26px',
      menuHeight: '32px',
      cityName: '伦敦',
      titleMargin: '97px',
      titleWidth: '181px'
    }
  },
  props: {
    navType: {
      type: String,
      default: 'default'
    },
    alwaysShowHome: {
      type: Boolean,
      default: false
    },
    customBackHandler: {
      type: String,
      default: null
    },
    title: {
      type: String,
      default: ''
    },
    backgroundColor: {
      type: String,
      default: '#ffffff'
    },
    alwaysShowTitle: {
      type: Boolean,
      default: false
    }
  },
  computed: {
  },
  methods: {
    initAnchor (disableAnchor) {
      const { navigationCustomed, menuButton, windowWidth } = uni.$globalData.systemInfo
      if (!navigationCustomed) return
      try {
        const { bottom, top, height, left } = menuButton
        const titleMargin = windowWidth - left
        this.titleMargin = titleMargin + 'px'
        this.titleWidth = windowWidth - titleMargin * 2 + 'px'
        this.menuHeight = height + 'px'
        this.menuTop = top + 'px'
        this.navHeight = bottom + 10 + 'px'
        const obAnchor = uni.createIntersectionObserver(this)
        if (disableAnchor) {
          this.navBarBgOpacity = 1
        } else {
          obAnchor.relativeToViewport({ top: -30 })
            .observe('#nav-anchor', (res) => {
              const { intersectionRatio } = res
              if (intersectionRatio === 0) {
                console.log('navBarBgOpacity', 1)
                this.navBarBgOpacity = 1
                wx.setNavigationBarColor({
                  frontColor: '#000000',
                  backgroundColor: '#ffffff',
                  animation: {
                    duration: 300,
                    timingFunc: 'easeIn'
                  }
                })
                this.$emit('pageLeaveTop')
              } else {
                console.log('navBarBgOpacity', 0)
                this.navBarBgOpacity = 0
                wx.setNavigationBarColor({
                  frontColor: '#ffffff',
                  backgroundColor: '#ffffff',
                  animation: {
                    duration: 300,
                    timingFunc: 'easeIn'
                  }
                })
                this.$emit('pageReachTop')
              }
            })
        }
        this.customNav = true
      } catch (err) {
        console.log('can not createIntersectionObserver', err)
      }
    },
    goBack () {
      if (this.customBackHandler) {
        this.$emit('customBack', this.customBackHandler)
      } else {
        // 处理了大于10层的情况
        routeBack()
      }
    },
    goHome () {
      routeTo({
        name: 'home'
      })
    }
  },
  mounted () {
    this.initAnchor(this.navType === 'static')
  }
}
</script>

<style rel="stylesheet/scss" lang='scss' scoped>
  .nav-anchor {
    width: 1rpx;
    height: 100rpx;
    position: absolute;
    background: transparent;
    z-index: -999;
  }
  .navBar {
    width: 100%;
    top: 0;
    z-index: 9999;
    &.fixed {
      position: fixed;
    }
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
  }
</style>
