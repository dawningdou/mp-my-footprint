<template>
<div v-if = "errorData" :class = "['error-page', isGlobal ? 'global' : '']">
  <div class="error-page-wrapper">
    <!-- error-icon -->
    <image class = "error-icon" :src="errorData.path"/>
    <!-- error-title-text -->
    <div class ="error-title-text">{{errorData.title}}</div>
    <!-- error-action-btn -->
    <div class = "error-action-btn" @click = "handleTapBtn">{{errorData.button}}</div>
  </div>
</div>
</template>

<script>
import { ErrorPage } from '@/config/errorConfig'
export default {
  data () {
    return {}
  },
  props: {
    error: {
      type: Object,
      default: null
    },
    isGlobal: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    errorData () {
      // console.log(this.error)
      if (this.error && this.error.errorType) {
        return ErrorPage[this.error.errorType]
      } else return null
    }
  },
  methods: {
    handleTapBtn () {
      this.$emit(this.errorData.action)
    }
  }
}
</script>

<style lang='less' scoped>
.error-page {
  width: 100%;
  height: 100%;
  background: #fff;
  position: absolute;
  z-index: 5;
  &.global {
    z-index: 999;
  }
}
.error-page-wrapper {
  // height: 746rpx;
  width: 100%;
  display: flex;
  flex-direction: column;
  // justify-content: space-between;
  align-items: center;
  position: absolute;
  left: 0;
  top: 50%;
  text-align: center;
  transform: translateY(-50%);
  .error-icon {
    width: 280rpx;
    height: 280rpx;
  }
  .error-title-text {
    margin-top: 40rpx;
    font-size:26rpx;
    font-weight:300;
    color:#999999;
  }
  .error-action-btn {
    margin-top: 116rpx;
    width: 320rpx;
    height: 80rpx;
    font-size: 34rpx;
    color: #444444;
    border: 1px solid #d8d8d8;
    border-radius: 40rpx;
    line-height: 80rpx;
  }
}
</style>
