<template>
  <div :class="['personal-page', 'page', ipxClass, platform]">
    <div class="info-row" style="margin-top:200rpx;">
      <div class="info-left">
        <div class="user-nickname">
          <AuthBtn :getUserOnly="true" v-on:bindOk="bindUserOk">
            <text :class="['f-medium', 'nick', hasUserInfo ? '' : 'green']">{{hasUserInfo ? (nickName || '游客') : '授权头像/昵称'}} </text>
          </AuthBtn>
        </div>
      </div>
      <div class="user-avartar">
        <AuthBtn :getUserOnly="true" v-on:bindOk="bindUserOk">
          <image class="image" :src="avatarUrl || '/static/images/personal/user.png'" />
        </AuthBtn>
      </div>
    </div>
    <div class="list f-light">
      <!-- <div class="item">
        <AuthBtn style="width: 100%" v-on:bindOk="bindMobileOk" :itemData="collectionData">
          <div class="item-left">
            <image :class="['item-icon', 'collection']" :src="'/static/images/personal/collection.png'" />
            <text>我的收藏</text>
          </div>
          <div class="item-right"><text></text><image class="more-btn" src="/static/images/personal/more.png" /></div>
        </AuthBtn>
      </div> -->
      <div class="item btn" hover-class="btn-hover" @tap="tapAbout">
        <div class="item-left">
          <image class="item-icon about" src="/static/images/personal/about.png" />
          <text>关于</text>
        </div>
        <div class="item-right"><text></text><image class="more-btn" src="/static/images/personal/more.png" /></div>
      </div>
      <navigator v-if="showTestButton" url="../test" style ="position: absolute; bottom: 0;left: 0;width: 700rpx;height: 100rpx;margin-left: 25rpx;line-height: 100rpx;font-size: 40rpx; text-align: center; border: 1rpx solid #222; ">调试页面</navigator>
      <button @tap="tapUnbindMobile" v-if="showTestButton && uid" style ="position: absolute; bottom: 120rpx;left: 0;width: 700rpx;height: 100rpx;margin-left: 25rpx;line-height: 100rpx;font-size: 40rpx; text-align: center; border: 1rpx solid #222; ">解绑手机</button>
    </div>
    <div class = "page-shadow"></div>
  </div>
</template>

<script>
// Use Vuex
import { mapState, mapActions, mapMutations } from 'vuex'
import AuthBtn from '@/components/auth-btn'

export default {
  components: {
    AuthBtn
  },
  data () {
    return {
      showTestButton: false,
      collectionData: {
        name: '我的收藏', url: '/pages/about/my-order', id: 'collection'
      }
    }
  },
  computed: {
    ...mapState({
      nickName: state => state.user.nickName,
      hasUserInfo: state => state.user.hasUserInfo,
      uid: state => state.user.uid,
      mobile: state => state.user.mobile,
      avatarUrl: state => state.user.avatarUrl
    }),
    fmtMobile () {
      const m = this.mobile
      return m ? m.substr(0, 3) + ' **** ' + m.substr(6, 10) : ''
    }
  },
  methods: {
    ...mapActions([
      'bindMobile',
      'unbindMobile'
    ]),
    ...mapMutations({
      saveUser: 'SAVE_USER'
    }),
    tapAbout (e) {
      uni.navigateTo({ url: '/pages/about' })
    },
    bindMobileOk (e) {
      console.log('bindMobileOk', e)
      if (e && e.id) {
        uni.navigateTo({ url: `/pages/index/personal/${e.id}` })
      }
    },
    bindUserOk (e) {
      console.log('bindUserOk', e)
    },
    tapUnbindMobile () {
      uni.showModal({ title: '确认解绑？' }).then(res => {
        if (res) {
          this.unbindMobile().then(res => {
            uni.showToast('已解绑，请刷新')
          })
        }
      })
    }
  },
  onLoad () {
    this.showTestButton = uni.$env === 'development'
  }

}
</script>

<style rel="stylesheet/scss" lang='scss' scoped>
  @import "~@/common/styles/page-shadow.scss";
  .info-row {
    display: flex;
    margin-top: 42rpx;
    margin-bottom: 70rpx;
  }
  .info-left {
    flex: 1;
    display: flex;
    align-items: center;
  }
  .btn-hover {
    -webkit-tap-highlight-color:rgba(0, 0, 0, 0);
  }
  .user-nickname {
    font-size: 44rpx;
    text-align: left;
    margin-left: 60rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .nick {
      margin-bottom: 20rpx;
      height: 60rpx;
    }
    .mobile {
      display: flex;
      font-size: 28rpx;
      color: #999;
      align-items: center;
    }
    .more-icon-small {
      width: 12rpx;
      height: 22rpx;
      margin-left: 14rpx;
    }
  }
  .nickname-text {
    &.green {
      color: #02C160;
    }
    color: #02C160;
  }
  .user-avartar {
    width: 160rpx;
    height: 160rpx;
    border-radius: 50%;
    border: 1rpx solid #eee;
    margin-right: 60rpx;
    .image {
      width: 160rpx;
      height: 160rpx;
      border-radius: 50%;
    }
  }
  .item {
    margin: 0 50rpx;
    height: 136rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1rpx solid #eee;
    -webkit-tap-highlight-color:rgba(0, 0, 0, 0);
  }
  .item-left {
    flex: 1;
    display: flex;
    justify-content: flex-start;
    font-size: 36rpx;
    align-items: center;
  }
  .item-right {
    flex: 0 0 40rpx;
  }
  .item-icon {
    width: 36rpx;
    height: 36rpx;
    margin-right: 20rpx;
  }
  .more-btn {
    width: 14rpx;
    height: 24rpx;
  }
</style>
