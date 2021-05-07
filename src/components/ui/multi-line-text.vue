<template>
  <div class = "multi-line-text-wrapper">
    <div class = "multi-line-text-container" >
      <div :class = "[fontClass, 'multi-line-text', showAll ? '' : ('hidden-' + lineNumber)]" :style="showAll ? computedAllTextStyle : computedMultiLineTextStyle">
        <span>{{text}}</span>
        <!-- <image v-if="showArrow" class = "icon-all" :src="unfoldImg" @click = "handleTapArrow"/> -->
        <div v-if="showArrow" :class = "['icon-text-all', fontClass]" @click = "handleTapArrow">收起</div>
      </div>
      <div v-if = "!showAll" class = "multi-line-text-arrow" @click = "handleTapArrow" :style="computedLabelStyle">
        <!-- <image v-if="showArrow" class = "icon" :src="unfoldImg" /> -->
        <div v-if="showArrow" :class = "['icon-text', fontClass]">展开</div>
      </div>
    </div>
    <div class = "multi-line-text-container all" :style="computedAllTextStyle">
      <div id="all" :class = "[fontClass, 'multi-line-text']">{{text}}</div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      showAll: false,
      showArrow: false
    }
  },
  props: {
    text: {
      type: String,
      default: ''
    },
    lineNumber: {
      type: Number,
      default: 2
    },
    initialStatus: {
      type: String,
      default: 'fold'
    },
    unfoldImg: {
      type: String,
      default: '/static/images/components/multi-line-text/unfold.png'
    },
    textStyle: {
      type: String,
      default: ''
    },
    lineHeight: {
      type: Number,
      default: ''
    },
    fontClass: {
      type: String,
      default: 'f-light'
    }
  },
  methods: {
    handleTapArrow () {
      if (this.showAll) {
        this.showAll = false
      } else {
        this.showAll = true
      }
    }
  },
  computed: {
    computedAllTextStyle () {
      return this.textStyle + this.lineHeight ? `line-height:${this.lineHeight}rpx;` : ''
    },
    computedMultiLineTextStyle () {
      return this.textStyle + this.lineHeight ? `line-height:${this.lineHeight}rpx; height:${this.lineHeight * this.lineNumber}rpx;` : ''
    },
    computedLabelStyle () {
      return this.textStyle + this.lineHeight ? `line-height:${this.lineHeight}rpx; height:${this.lineHeight}rpx` : ''
    }
  },
  mounted () {
    this.showAll = false
    const testHeight = () => {
      this.t = setTimeout(() => {
        const query = uni.createSelectorQuery().in(this)
        query.selectAll('.multi-line-text').boundingClientRect(rects => {
          console.log(rects)
          if (!rects.length || !rects[0].height || !rects[1].height) {
            // testHeight()
            return
          }
          const textHeight = rects[0].height
          const allTextHeight = rects[1].height
          // console.log(allTextHeight, textHeight)
          if (allTextHeight > textHeight) {
            this.showAll = false
            this.showArrow = true
          } else {
            this.showAll = true
            this.showArrow = false
          }
        }).exec()
      }, 200)
    }
    testHeight()
  }
}
</script>

<style rel="stylesheet/scss" lang='scss' scoped>
.multi-line-text-wrapper {
  position: relative;
  // overflow: hidden;
  font-size: $uni-font-size-base;
  color: $uni-text-color;
  line-height: 40rpx;
  text-align: justify;
  .multi-line-text-container {
    position: relative;
    &.all {
      position: absolute;
      top: 0;
      opacity: 0;
      z-index: -1;
    }
  }
  .multi-line-text {
    white-space: normal;
    word-break:break-word;
    &.hidden-4 {
      display: -webkit-box;
      overflow: hidden; //超出一行文字自动隐藏
      text-overflow: clip;
      -webkit-text-overflow: clip;
      -webkit-line-clamp: 4; /*这个数字是设置要显示省略号的行数*/
      -webkit-box-orient: vertical;
    }
    &.hidden-3 {
      display: -webkit-box;
      overflow: hidden; //超出一行文字自动隐藏
      text-overflow: clip;
      -webkit-text-overflow: clip;
      -webkit-line-clamp: 3; /*这个数字是设置要显示省略号的行数*/
      -webkit-box-orient: vertical;
    }
    &.hidden-2 {
      display: -webkit-box;
      overflow: hidden; //超出一行文字自动隐藏
      text-overflow: clip;
      -webkit-text-overflow: clip;
      -webkit-line-clamp: 2; /*这个数字是设置要显示省略号的行数*/
      -webkit-box-orient: vertical;
    }
    &.hidden-1 {
      display: -webkit-box;
      overflow: hidden; //超出一行文字自动隐藏
      text-overflow: clip;
      -webkit-text-overflow: clip;
      -webkit-line-clamp: 1; /*这个数字是设置要显示省略号的行数*/
      -webkit-box-orient: vertical;
    }
  }
  .multi-line-text-arrow {
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 9;
    background: linear-gradient(to right, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 1), rgba(255, 255, 255, 1));
    // border: 1px solid red;
    text-align:right;
    .icon {
      width: 20rpx;
      height: 20rpx;
      margin-top: 14rpx;
    }
    .icon-text {
      width: 130rpx;
      height: 58rpx;
      color: $uni-color-theme-green;
    }
  }
  .icon-all {
    display: inline-block;
    width: 20rpx;
    height: 20rpx;
    margin-left: 10rpx;
    margin-top: 14rpx;
    transform: rotate(180deg);
  }
  .icon-text-all {
    color: $uni-color-theme-green;
    display: inline-block;
    margin-left: 10rpx;
    width: 62rpx;
    height: 58rpx;
    line-height: 58rpx;
  }
}

</style>
