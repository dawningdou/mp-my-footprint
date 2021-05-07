<template>
  <view :class="['page', ipxClass, platform]">
    <div class="container">
      <image class = "cat" src="/static/images/cat.jpeg" />
      <div>试验作，希望你喜欢～</div>
      <div>by Usagi</div>
    </div>
  </view>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  components: {
  },
  onLoad () {
  },
  methods: {
    tap () {
      this.getLocation()
      console.log('location', this.location)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang='scss' scoped>

.container {
  height: 600rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color:#333;
  .cat {
    width: 200rpx;
    height: 200rpx;
    border-radius: 200rpx;
    margin-bottom: 40rpx;
  }
}
</style>
