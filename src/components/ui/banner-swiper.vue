<template>
  <div class="image-swiper" :style = "wrapStyle">
    <template v-if = "fmtList && fmtList.length">
      <!-- 多张图片 -->
      <div v-if="fmtList.length > 1" class = "image-container" style ="width: 100%; height: 100%;">
        <!-- <div v-if="lastItemNavigateURL" class = "right-tips" style = "text-align: right;font-size:20rpx;">
          左滑查看更多
        </div> -->
        <!-- 轮播 -->
        <swiper
          :duration = "duration"
          :interval = "interval"
          :autoplay = "!lastItemNavigateURL"
          :circular = "circular"
          class = "swiper-wrap"
          @change = "bindSwiperChange"
          @click="handleTap"
          :style = "swiperStyle"
        >
          <swiper-item class = "swiper-item-container" v-for="(item, ind) in fmtList" :key="ind" :data-ind="ind" @touchstart = "handleTouchStartItem" @touchend = "handleTouchEndItem">
            <div class = "swiper-item" v-if="item.type==='video'" :style = "borderRadiusStyle + swiperItemStyle">
              <image :src="item.cover_img" class="image " mode = "aspectFill"/>
              <image src="/static/images/components/video-player/btn-play.png" class = "btn-play" />
            </div>
            <div class = "swiper-item" v-else :style = "borderRadiusStyle + swiperItemStyle">
              <div v-if = "hasMask" class = "image-mask"></div>
              <image :src="item.src" class="image" mode = "aspectFill"/>
              <div v-if= "item.title" class = "title-container" :style = "titleContianerStyle">
                <div class = "title" :style = "titleStyle">{{item.title}}</div>
                <div class = "subtitle" :style = "subtitleStyle">{{item.subtitle}}</div>
              </div>
            </div>
          </swiper-item>
        </swiper>
        <!-- 页码 -->
        <div v-if = "showIndicator" class = "indicator">
          <div>{{swiperCurIdx}}/{{fmtList.length}}</div>
          <image class="ico" src="/static/images/components/ui/image-swiper/icon-image.png" />
        </div>
        <!-- 进度条 -->
        <div v-if = "showProgress" :class = "['progress-line', progressType]">
          <template v-if = "progressType === 'green-road'" >
            <div :class = "['dot', swiperCurIdx === 1 ? 'active' : 'inactive', swiperCurIdx === fmtList.length? 'long-bar':'']"></div>
            <div v-if="fmtList.length > 2 && swiperCurIdx > 1 && swiperCurIdx < fmtList.length" class = "dot dot-mid"></div>
            <div :class = "['dot', swiperCurIdx === fmtList.length ? 'active' : 'inactive', swiperCurIdx === 1? 'long-bar':'']"></div>
          </template>

          <div v-else v-for="(item, ind) in fmtList.length" :key="ind" :class = "['dot', swiperCurIdx - 1 === ind ? 'active': '', swiperCurIdx === ind ? 'next-active' : '', swiperCurIdx - 2 === ind ? 'pre-active' : '', ind === fmtList.length - 2 ? 'last-inactive' : '', ind === 1 ? 'first-inactive':'']"></div>
        </div>
      </div>
      <div v-else class = "image-container single" @click="handleTap">
        <div class = "swiper-item" v-if="fmtList[0].type==='video'" :style = "borderRadiusStyle + swiperItemStyle">
          <image :src="fmtList[0].cover_img" class="image " mode = "aspectFill"/>
          <image src="/static/images/components/video-player/btn-play.png" class = "btn-play" />
        </div>
        <div class = "swiper-item" v-else :style = "borderRadiusStyle + swiperItemStyle">
          <div v-if = "hasMask" class = "image-mask"></div>
          <image :src="fmtList[0].src" class = "image" mode = "aspectFill"/>
          <div v-if= "fmtList[0].title" class = "title-container" :style = "titleContianerStyle">
            <div class = "title" :style = "titleStyle">{{fmtList[0].title}}</div>
            <div class = "subtitle" :style = "subtitleStyle">{{fmtList[0].subtitle}}</div>
          </div>
        </div>
      </div>
    </template>
    <div v-else class="no-pic-container">
      <image src = "/static/images/components/ui/image-swiper/no-pic.png" class = "no-pic-icon" />
      <div class = "no-pic-text">暂无相关图片</div>
    </div>
</div>

</template>

<script>
export default {
  data () {
    return {
      swiperCurIdx: 1
    }
  },
  props: {
    wrapStyle: {
      type: String,
      default: ''
    },
    circular: {
      type: Boolean,
      default: false
    },
    duration: {
      type: Number,
      default: 500
    },
    interval: {
      type: Number,
      default: 3000
    },
    swiperItemStyle: {
      type: String,
      default: ''
    },
    swiperStyle: {
      type: String,
      default: ''
    },
    titleContianerStyle: {
      type: String,
      default: ''
    },
    titleStyle: {
      type: String,
      default: ''
    },
    subtitleStyle: {
      type: String,
      default: ''
    },
    borderRadius: {
      type: String,
      default: ''
    },
    list: {
      type: Array,
      default: []
    },
    showProgress: {
      type: Boolean,
      default: false
    },
    progressType: {
      type: String,
      default: 'plain'
    },
    showIndicator: {
      type: Boolean,
      default: false
    },
    indicatorType: {
      type: String,
      default: ''
    },
    hasMask: {
      type: Boolean,
      default: false
    },
    defaultImage: {
      type: String,
      default: ''
    },
    lastItemNavigateURL: {
      type: String,
      default: ''
    }
  },
  computed: {
    borderRadiusStyle () {
      if (this.borderRadius) {
        return `overflow:hidden;border-radius:${this.borderRadius};`
      } else return ''
    },
    fmtList () {
      if (!this.list) return []
      const ret = this.list.map((item) => {
        if (typeof item === 'string') {
          return {
            type: 'image',
            src: item
          }
        } else return item
      })
      return ret
    }
  },
  methods: {
    bindSwiperChange (e) {
      const {
        current
      } = e.target
      this.swiperCurIdx = current + 1
    },
    handleTap () {
      const ind = this.swiperCurIdx - 1
      console.log(this.fmtList)
      const item = this.fmtList[ind]
      console.log('tap')
      this.$emit('tapItem', {
        ind,
        item
      })
    },
    handleTouchStartItem (e) {
      // console.log(e)
      this.startX = e.changedTouches[0].clientX
    },
    handleTouchEndItem (e) {
      const endX = e.changedTouches[0].clientX
      const ind = e.currentTarget.dataset.ind
      if (this.lastItemNavigateURL && ind === this.fmtList.length - 1 && this.startX - endX > 30) {
        this.$emit('beforeNavigate', this.lastItemNavigateURL)
        uni.navigateTo({
          url: this.lastItemNavigateURL
        })
      }
    }
  },
  onLoad () {
    this.swiperCurIdx = 1
  }
}
</script>

<style rel="stylesheet/scss" lang='scss' scoped>
.image-swiper {
  width: 100%;
  height: 100%;
  position: relative;
  background: $uni-bg-color-grey;
  background: #fff;
  .image, .image-container, .swiper-item {
    width: 100%;
    height: 100%;
  }
  .swiper-wrap {
    width: 100%;
    height: 100%;
    position:absolute;
    top: 0;
    .swiper-item-container {
      position:relative;
    }
  }
  .indicator {
    position: absolute;
    bottom: 40rpx;
    right: 40rpx;
    display: flex;
    align-items: center;
    padding: 8rpx 14rpx;
    font-size: 24rpx;
    font-weight:300;
    height: 22rpx;
    color: #ffffff;
    background: rgba(0,0,0,0.4);
    border-radius: 20rpx;
    .ico {
      width: 22rpx;
      height: 22rpx;
      margin-left: 10rpx;
      margin-top: -2rpx;
    }
  }
  .progress-line {
    position: absolute;
    width: 100%;
    bottom: 24rpx;
    display:flex;
    justify-content: center;
    .dot {
      width: 16rpx;
      height: 4rpx;
      background:rgba(255,255,255,0.4);
      border-radius:2rpx;
      margin: 0 2rpx;
      &.active {
        background: #ffffff;
      }
    }
    &.green-road {
      bottom: -40rpx;
      width: 114rpx;
      left: 50%;
      margin-left: -57rpx;
      justify-content: space-between;
      .dot {
        width: 18rpx;
        height: 8rpx;
        background: #DFDFDF;
        border-radius:2;
        margin: 0;
        &.long-bar {
          width: 82rpx;
        }
        &:first-child {
          margin-left:0;
        }
        &:last-child{
          margin-right:0;
        }
        &.dot-mid {
          background: #37384D;
          width: 50rpx;
        }
        &.active {
          background: #37384D;
        }
        // &.pre-active {
        //   border-top-right-radius:2rpx;
        //   border-bottom-right-radius:2rpx;
        //   &.last-inactive {
        //     width: 24rpx;
        //   }
        // }
        // &.next-active {
        //   border-top-left-radius:2rpx;
        //   border-bottom-left-radius:2rpx;
        //   &.first-inactive {
        //     width: 24rpx;
        //   }
        // }
        // &:first-child {
        //   border-top-left-radius:2rpx;
        //   border-bottom-left-radius:2rpx;
        //   margin-left:0;
        // }
        // &:last-child{
        //   border-top-right-radius:2rpx;
        //   border-bottom-right-radius:2rpx;
        //   margin-right:0;
        // }
      }
    }
  }
  .no-pic-container {
    display: flex;
    flex-direction: column;
    justify-content:center;
    height:100%;
    align-items:center;
    .no-pic-icon {
      width: 70rpx;
      height: 70rpx;
    }
    .no-pic-text {
      margin-top: 12rpx;
      height:36rpx;
      font-size:24rpx;
      font-weight:400;
      color:rgba(216,216,216,1);
      line-height:36rpx;
    }
  }
  .title-container {
    position:relative;
    bottom: 60 + 66 + 40rpx;
    padding: 0 36rpx;
    color: #fff;
    .title {
      font-size:48rpx;
      line-height:66rpx;
      font-weight: 600;
      @include single-line-text;
    }
    .subtitle{
      font-size: 28rpx;
      line-height: 40rpx;
      font-weight: 400;
      @include single-line-text;
    }
  }
  // 图片遮罩
  .image-mask {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    opacity:0.25;
    background:linear-gradient(180deg,rgba(0,0,0,0) 0%,rgba(0,0,0,1) 100%);
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
</style>
