<!-- 横向滚动列表组件 -->
<template>
  <div :style="wrapStyle">
    <scroll-view
      scroll-y
      class="scroll-view"
      :style="{height: height}"
      @scrolltolower="scrolltolower"
      lower-threshold="60">
      <slot></slot>
      <LoadMore :status="status" />
    </scroll-view>
  </div>
</template>

<script>
import LoadMore from '@/components/ui/load-more'
export default {
  props: {
    list: {
      type: Array,
      default: []
    },
    tabHeight: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      default: ''
    },
    wrapStyle: {
      type: String,
      default: ''
    },
    listName: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      height: '667px'
    }
  },
  components: {
    LoadMore
  },
  methods: {
    scrolltolower () {
      this.$emit('reachBottom', this.listName)
    }
  },
  beforeMount () {
    const systemInfo = uni.getSystemInfoSync()
    const { windowHeight, windowWidth } = systemInfo
    const tabHeight = this.tabHeight * windowWidth / 750
    this.height = windowHeight - tabHeight + 'px'
  }
}
</script>

<style rel="stylesheet/scss" lang='scss' scoped>
.scroll-view {
  width: 100%;
}
.scroll-container {
  white-space: nowrap;
  padding-left: 25rpx;
  text-align: left;
  .scroll-item {
    display: inline-block;
    &.image-item {
      margin-right: 20rpx;
      width: 320rpx;
      height: 186rpx;
      .image {
        width: 100%;
        height: 100%;
        border-radius: $uni-border-radius-base;
        background: $uni-bg-color-grey;
      }
      &:last-child {
        margin-right: 25rpx;
      }
    }

    &.scenic-item {
      margin-right: 20rpx;
      .image {
        width: 320rpx;
        height: 186rpx;
        border-radius: $uni-border-radius-base;
        background: $uni-bg-color-grey;
      }
      .name {
        font-size: 32rpx;
        line-height: 80rpx;
      }
      &:last-child {
        margin-right: 40rpx;
      }
    }
  }
}
</style>
