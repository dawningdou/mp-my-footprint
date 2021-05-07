<template>
  <div class="player-wrap" :style="wrapStyle">
    <div class="player-container" :style="containerStyle">
      <image
        class="audio-player-button"
        :style = "buttonStyle"
        :src="playStatus !== 0 ? playImg : pauseImg"
        mode="scaleToFill"
        @tap = "handlePlayBtnTap"
      />
      <div class = "audio-right-container">
        <div class = "title">
          <div class="left">{{audioTitle}}</div>
          <div v-if="durationTime" class="right">{{currentTime}} / {{durationTime}}</div>
        </div>
        <div class = "slider-wrap" :style="computedSliderWrapStyle" @touchend = "onSliderTouchEnd" @touchmove = "onSliderTouchMove">
          <div class = "process-bar" :style="computedProcessBarStyle">
            <div class = "active-bar" :style="computedActiveBarStyle"></div>
          </div>
          <div class = "dot" :style="computedDotStyle"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      playStatus: -1,
      sliderPosition: 0,
      currentTime: '00:00',
      durationTime: ''
    }
  },
  props: {
    wrapStyle: {
      type: String,
      default: ''
    },
    containerStyle: {
      type: String,
      default: ''
    },
    buttonStyle: {
      type: String,
      default: ''
    },
    playImg: {
      type: String,
      default: '/static/images/components/audio-player/ic-weibofang.png'
    },
    pauseImg: {
      type: String,
      default: '/static/images/components/audio-player/ic-bofang.png'
    },
    audioSrc: {
      type: String,
      default: ''
    },
    audioTitle: {
      type: String,
      default: '语音介绍'
    },
    loop: {
      type: Boolean,
      default: false
    },
    background: {
      type: String,
      default: 'rgba(255, 255, 255, 0.2)'
    },
    activeColor: {
      type: String,
      default: '#fff'
    },
    blockColor: {
      type: String,
      default: 'rgba(255, 255, 255, 1)'
    },
    blockSize: {
      type: Number,
      default: 0
    },
    sliderWrapStyle: {
      type: String,
      default: ''
    },
    processBarStyle: {
      type: String,
      default: ''
    },
    activeBarStyle: {
      type: String,
      default: ''
    },
    processBarHeight: {
      type: String,
      default: '4rpx'
    },
    dotStyle: {
      type: String,
      default: ''
    },
    stopAudio: {
      type: Number,
      default: 0
    }
  },
  watch: {
    stopAudio (cur) {
      // console.log(cur)
      if (cur) {
        this.stop()
      }
    },
    audioSrc (cur) {
      if (cur) {
        this.innerAudioContext.src = this.audioSrc
        this.replay()
      }
    }
  },
  methods: {
    handleSliderChange (e) {
      this.sliderSliding = true
      // 跳转到指定位置
      this.innerAudioContext.seek(e.detail.value / 100 * this.innerAudioContext.duration)
    },
    onSliderTouchMove (e, seek) {
      const { pageX } = e.changedTouches[0]
      let pct = (pageX - this.offsetX) / this.barWidth
      pct = pct > 1 ? 1 : pct
      pct = pct < 0 ? 0 : pct
      if (seek) {
        this.innerAudioContext.seek(pct * this.innerAudioContext.duration)
        this.sliderSliding = false
      } else {
        this.sliderPosition = pct * 100
        this.sliderSliding = true
      }
    },
    onSliderTouchEnd (e) {
      this.onSliderTouchMove(e, true)
    },
    handlePlayBtnTap () {
      if (this.playStatus === 0) {
        // 播放中
        this.innerAudioContext.pause()
      } else if (this.playStatus === 1) {
        // 暂停
        this.play()
      } else if (this.playStatus === 2) {
        // stop
        this.play()
      } else if (this.playStatus === -1) {
        this.replay()
      }
    },
    setupAudio () {
      this.innerAudioContext = wx.createInnerAudioContext()
      console.log(this.innerAudioContext, 'this.innerAudioContext------')
      this.innerAudioContext.onPlay(() => {
        console.log('开始播放')
        this.playStatus = 0
      })
      this.innerAudioContext.onCanplay(() => {
        console.log('can play')
      })
      this.innerAudioContext.onPause(() => {
        console.log('暂停播放')
        this.playStatus = 1
      })
      this.innerAudioContext.onStop(res => {
        console.log('停止播放')
        this.playStatus = 2
        this.durationTime = ''
      })
      this.innerAudioContext.onEnded(res => {
        console.log('结束播放')
        this.playStatus = 2
        this.durationTime = ''
      })
      this.innerAudioContext.onError(res => {
        this.playStatus = -1
        console.log(res)
        uni.showToast({
          title: res.errMsg,
          icon: 'none',
          duration: 2000,
          mask: true
        })
      })
      // 进度更新
      this.innerAudioContext.onTimeUpdate(res => {
        this.duration = this.innerAudioContext.duration
        if (!this.sliderSliding) {
          this.sliderPosition = (this.innerAudioContext.currentTime / this.duration) * 100
          this.onUpdateTime()
        }
      })
      // 监听背景音频完成跳转事件
      this.innerAudioContext.onSeeked(() => {
        console.log('滑块：')
        if (!this.sliderSliding) {
          this.onUpdateTime()
        }
      })
    },
    // 更新 时间
    formatAudioProcess (currentTime) {
      let t = '0:00'
      if (currentTime > -1) {
        const min = parseInt(currentTime / 60)
        let sec = currentTime % 60
        if (sec < 10) {
          sec = '0' + sec
        }
        t = min + ':' + sec
      }
      return t
    },
    onUpdateTime () {
      this.currentTime = this.formatAudioProcess(this.innerAudioContext.currentTime.toFixed(0))
      this.durationTime = this.formatAudioProcess(this.innerAudioContext.duration.toFixed(0))
    },
    // 切换
    replay () {
      this.stop()
      this.play()
    },
    stop () {
      this.innerAudioContext.stop()
    },
    play () {
      this.innerAudioContext.play()
    },
    pause () {
      if (this.innerAudioContext && this.playStatus === 0) {
        this.innerAudioContext.pause()
      }
    }
  },
  computed: {
    computedSliderWrapStyle () {
      return `${this.sliderWrapStyle};height: ${this.blockSize}px;`
    },
    computedProcessBarStyle () {
      return `${this.processBarStyle};background:${this.background};height: ${this.processBarHeight};`
    },
    computedActiveBarStyle () {
      return `${this.activeBarStyle};background: ${this.activeColor};height: ${this.processBarHeight};width:${this.sliderPosition}%;`
    },
    computedDotStyle () {
      return `${this.dotStyle};background:${this.blockColor};width: ${this.blockSize}px;height:${this.blockSize}px;left:${this.sliderPosition}%;`
    }
  },
  created () {
    this.setupAudio()
    this.innerAudioContext.src = this.audioSrc
  },
  mounted () {
    const query = uni.createSelectorQuery().in(this)
    query.select('.slider-wrap').boundingClientRect(rect => {
      console.log(rect)
      this.offsetX = rect.left
      this.barWidth = rect.width
    }).exec()
  },
  beforeDestroy () {
    this.stop()
    this.innerAudioContext.destroy()
  }
}
</script>

<style rel="stylesheet/scss" lang='scss' scoped>
.player-wrap {
  width: 100%;
  height: 100%;
  margin: auto;
  position: relative;
  .player-container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    .audio-player-button {
      width: 32*2rpx;
      height: 32*2rpx;
    }
    // .audio-player-slider {
    //   flex: 1;
    //   margin: 0;
    //   margin-left: 11*2rpx;
    //   margin-top: 16px;
    // }
    // .audio-player-info {
    //   font-size: 9*2rpx;
    //   position: absolute;
    //   top: 8*2rpx;
    //   right: 0;
    //   color: rgba(255, 255, 255, 0.6);
    //   line-height: 1;
    // }
    // .audio-title {
    //   position: absolute;
    //   top: 8*2rpx;
    //   left: 42*2rpx;
    //   color: #FFFFFF;
    //   font-size: 9*2rpx;
    //   line-height: 1;
    // }
  }
  .audio-right-container {
    flex: 1;
    margin-left: 22rpx;
    .title {
      display:flex;
      justify-content: space-between;
      font-size: 9*2rpx;
      .left{
        color: #FFFFFF;
      }
      .right{
        color: rgba(255, 255, 255, 0.6);
      }
    }
    .slider-wrap {
      width: 100%;
      margin-top: 12rpx;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 10rpx 0;
      .process-bar {
        width: 100%;
      }
    }
    .dot {
      border-radius: 50%;
      position: absolute;
      top: 10rpx;
    }
  }
}
</style>
