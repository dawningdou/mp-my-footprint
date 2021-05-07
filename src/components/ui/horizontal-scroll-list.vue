<!-- 横向滚动列表组件 -->
<template>
  <div :style="wrapStyle">
    <scroll-view scroll-x style = "width: 100%">
      <div class = "scroll-container" :style="containerStyle">
        <slot></slot>
      </div>
    </scroll-view>
  </div>
</template>

<script>
export default {
  props: {
    wrapStyle: {
      type: String,
      default: ''
    },
    containerStyle: {
      type: String,
      default: ''
    }
  }
}
</script>

<style rel="stylesheet/scss" lang='scss' scoped>
.scroll-container {
  white-space: nowrap;
  text-align: left;
}
</style>
