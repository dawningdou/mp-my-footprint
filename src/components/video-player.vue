<template>
  <div class="player-wrap" :style="wrapStyle + borderRadiusStyle">
    <!-- 有 src 显示 video -->
    <video
      v-if = "liveSrc || videoSrc"
      id = "my-video"
      class="video"
      :style="videoStyle + borderRadiusStyle"
      :src="liveSrc || videoSrc"
      :autoplay="autoplay"
      :controls="controls"
      :loop="loop"
      :show-mute-btn = "showMuteBtn"
      :show-fullscreen-btn = "showFullScreenBtn"
      :custom-cache="false"
      :muted="muted"
      :enable-progress-gesture="enableProgressGesture"
      @play="onPlayHandler"
      @pause="onPauseHandler"
      @stop ="onStopHandler"
      @ended="onEndedHandler"
      @fullscreenchange="onFullScreenChangeHandler"
      @error="onErrorHandler"
      @waiting="onWattingHandler"
    >
      <cover-view v-if="showCover && poster" class="cover"  @click="onClickCoverHandler" >
        <cover-image class="poster" :src="poster"></cover-image>
        <cover-image class="btn-play" :src="playSrc" mode="aspectFill"></cover-image>
      </cover-view>
    </video>

    <!-- 占位图 -->
    <image v-else-if = "placeholder" class="cover" :src="placeholder" mode="aspectFill"/>
  </div>
</template>

<script>
export default {
  data () {
    return {
      showCover: true
    }
  },
  props: {
    wrapStyle: {
      type: String,
      default: ''
    },
    videoStyle: {
      type: String,
      default: ''
    },
    borderRadius: {
      type: String,
      default: ''
    },
    liveSrc: {
      type: String,
      default: ''
    },
    videoSrc: {
      type: String,
      default: ''
    },
    poster: {
      type: String,
      default: ''
    },
    playSrc: {
      type: String,
      default: '/static/images/components/video-player/btn-play.png'
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    loop: {
      type: Boolean,
      default: false
    },
    muted: {
      type: Boolean,
      default: false
    },
    showMuteBtn: {
      type: Boolean,
      default: true
    },
    showFullScreenBtn: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: ''
    },
    enableProgressGesture: {
      type: Boolean,
      default: true
    },
    controls: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    borderRadiusStyle () {
      if (this.borderRadius) {
        return `overflow:hidden;border-radius:${this.borderRadius};`
      } else return ''
    }
  },
  methods: {
    onPlayHandler () {
      this.$emit('play')
    },
    onPauseHandler () {
      this.$emit('pause')
    },
    onStopHandler () {
      this.$emit('stop')
    },
    onEndedHandler () {
      this.$emit('ended')
    },
    onFullScreenChangeHandler (event) {
      this.$emit('fullscreenchange', event)
    },
    onErrorHandler () {
      this.$emit('error')
    },
    onWattingHandler () {
      this.$emit('waiting')
    },
    onClickCoverHandler () {
      if (this.networkType !== 'wifi') {
        uni.showModal({
          title: '提示',
          content: '当前网络为非 Wi-Fi 环境，是否继续播放？',
          showCancel: true
        }).then((res) => {
          console.log(res)
          if (!res[0] && res[1].confirm) {
            this.videoCtx.play()
            this.showCover = false
            uni.showToast({
              title: '正在使用流量播放',
              icon: 'none',
              duration: 3000
            })
          }
        })
      } else {
        this.videoCtx.play()
        this.showCover = false
      }
    }
  },
  created () {
    uni.getNetworkType().then((res) => {
      this.networkType = res[1].networkType
      console.log(`[vplayer] getNetworkType => ${this.networkType}`)
    })
    uni.onNetworkStatusChange((res) => {
      this.networkType = res.networkType
      console.log(`[vplayer] onNetworkStatusChange => ${res.networkType}`)
    })
  },
  mounted () {
    this.videoCtx = uni.createVideoContext('my-video', this)
    if (this.autoPlay && this.networkType === 'wifi') {
      this.videoCtx.play()
      this.showCover = false
    }
  }
}
</script>

<style rel="stylesheet/scss" lang='scss' scoped>
.player-wrap {
  width: 100%;
  height: 100%;
  margin: auto;
  .video {
    width: 100%;
    height: 100%;
  }
  .cover {
    width: 100%;
    height: 100%;
    .poster {
      width: 100%;
    }
    .btn-play {
      position: absolute;
      top: 50%;
      left:50%;
      width:100rpx;
      height:100rpx;
      margin-left: -50rpx;
      margin-top: -50rpx;
    }
  }
}
</style>
