<!-- 图片组件 -->
<template>
  <image class="image"
    :style="tStyle"
    @load="imgLoaded"
    @error="imgError"
    :src="src"
    :mode="mode"
    :lazy-load="lazyLoad"  />
</template>

<script>
import { ImageTimout } from '@/config/timeoutConfig'
export default {
  props: {
    src: {
      type: String,
      default: ''
    },
    mode: {
      type: String,
      default: 'scaleToFill'
    },
    'lazy-load': {
      type: Boolean,
      default: false
    },
    't-style': {
      type: String,
      default: ''
    }
  },
  watch: {
    src (newVal, oldVal) {
      if (newVal && newVal !== oldVal) {
        this.clock = new Date().getTime()
      }
    }
  },
  data () {
    return {
      clock: null
    }
  },
  methods: {
    imgError () {
      console.error('图片加载失败', this.src)
      uni.reportAnalytics('img-timeout', {
        type: 'fail',
        src: this.src
      })
    },
    imgLoaded () {
      const time = (new Date().getTime() - this.clock)
      // 如果超过warnTime 加个warn 如果超过errorTime 报个错
      const warnTime = ImageTimout.warning
      const errorTime = ImageTimout.error
      if (time > errorTime) {
        console.error(`图片加载时间超过${errorTime}ms，耗时${time}ms!`, this.src)
        uni.reportAnalytics('img-timeout', {
          type: 'warning',
          time: time,
          src: this.src
        })
      } else if (time > warnTime) {
        console.warn(`图片加载时间超过${warnTime}ms，耗时${time}ms`, this.src)
        uni.reportAnalytics('img-timeout', {
          type: 'error',
          time: time,
          src: this.src
        })
      }
    }
  },
  mounted () {
    this.clock = new Date().getTime()
  }
}
</script>

<style rel="stylesheet/scss" lang='scss' scoped>
.image {
  width: 100%;
  height: 100%;
}
</style>
