<template>
  <div :class="['loadmore', status === 'hidden' ? 'hidden' : '', isiPhoneX ? 'ipx' : '']">
    <div v-if="status === 'loading'" class="loading">
      <image class="loading-icon" src="/static/images/components/ui/loading.png" />
      <div class="loading-text">加载中</div>
    </div>
    <div v-else-if="status === 'finished'">
    已无更多内容
    </div>
    <div v-else-if="status === 'failed'">
    加载失败，请稍后重试
    </div>
    <div v-else-if="status === 'empty'">
    暂无数据
    </div>
  </div>
</template>

<script>
/**
 * 列表底部上滑加载更多组件，放在列表底部，根据传值改变“加载中”，“已无更多内容”等状态
 * @module load-more 加载更多
 */
export default {
  /**
   * Props 接受父组件的传值
   * @prop {String} status 必传参数。5种状态 1. loading: 加载中； 2. finished: 已无更多内容；3. empty:暂无数据；4. failed: 加载失败；5. hidden: 隐藏
   */
  props: ['status'],
  data () {
    return {
    /**
    * 可以自动适配iphonex
    * @prop {String} isiPhoneX 如果是iphonex loading图标会往上30rpx
    */
      isiPhoneX: ''
    }
  },
  watch: {
    status: function (newv, ondv) {
    }
  },
  methods: {
  },

  beforeMount () {
    const { systemInfo } = uni.$globalData
    this.isiPhoneX = systemInfo.isiPhoneX
  }
}
</script>

<style rel="stylesheet/scss" lang='scss' scoped>
@keyframes rotate {
  from { transform: rotate(0deg) }
  to { transform: rotate(360deg) }
}
.loadmore {
  height: 100rpx;
  width: 100%;
  visibility: show;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24rpx;
  text-align: center;
  color: #898989;
  &.hidden {
    visibility: hidden;
  }
  &.ipx {
    padding-bottom: 30rpx;
  }
}
.loading {
  display: flex;
  align-items: center;
  .loading-icon {
    width: 30rpx;
    height: 30rpx;
    margin-right: 10rpx;
    animation: rotate 1s cubic-bezier(0, 0, 0.58, 1) infinite;
  }
  .loading-text {}
}
</style>
