<!-- 横向滚动列表组件 -->
<template>
 <view class="title-module f-semibold">
    <view class="title">{{title}}</view>
    <view v-if="showMore" class="more" @tap="tapMore">
      <image class="btn-more" src= "/static/images/components/ui/ic-arrow-right.png" />
    </view>
</view>
</template>

<script>
/**
 * 模块标题组件
 * @module module-title 模块标题
 */
export default {
  /**
   * Props 接受父组件的传值
   * @prop {String} title 必传参数
   * @prop {Boolen} showMore 控制显示
   */
  props: {
    title: {
      type: String,
      default: ''
    },
    showMore: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    tapMore () {
      this.$emit('tapMore')
    }
  }
}
</script>

<style rel="stylesheet/scss" lang='scss' scoped>
.title-module {
  display:flex;
  justify-content: space-between;
  align-items: center;
  font-size: 40rpx;
  text-align: left;
  line-height: 120rpx;
  padding-left: 40rpx;
  color: $uni-text-color-h1;
}
.more {
  width: 90rpx;
  padding-right: 40rpx;
  display:flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
}
.btn-more {
  padding: 10rpx;
  height: 40rpx;
  width: 40rpx;
}
</style>
