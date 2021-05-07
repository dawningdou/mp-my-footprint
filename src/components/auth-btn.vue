<template>
  <button plain class="btn" hover-class="btn-hover" @tap="tapItem"
    :open-type="btnType"  @getuserinfo="getUserInfo" @getphonenumber="getPhoneNumber">
    <slot></slot>
  </button>
</template>

<script>
/**
  * 授权按钮外框
  * @module auth-btn 授权按钮
  * @example
  * 包裹需要授权的按钮，比如'我的'页面中的'我的收藏'按钮。只需关注授权成功后的逻辑。
  *
  * <AuthBtn v-on:bindOk="openCollect">
  *   <view class='btn'>我的收藏</view>
  * </AuthBtn>
*/
import { mapState, mapActions, mapMutations } from 'vuex'
export default {
  data () {
    return {}
  },
  /**
   * 父组件的传值
   * @prop {Boolean} getUserOnly 是否只需要用户昵称头像
   * @prop {Object} itemData 绑定成功事件原样返回的data，可用于区分不同auth-btn
   */
  props: {
    getUserOnly: {
      type: Boolean,
      default: false
    },
    itemData: {
      type: Object,
      default: {}
    }
  },
  computed: {
    ...mapState({
      hasUserInfo: state => state.user.hasUserInfo,
      isBind: state => state.user.is_bind
    }),
    btnType () {
      if (this.getUserOnly) {
        // 取值： getUserInfo,空
        return this.hasUserInfo ? '' : 'getUserInfo'
      } else if (this.isBind) {
        // 取值： getUserInfo, getPhoneNumber, 空
        return ''
      } else {
        return this.hasUserInfo ? 'getPhoneNumber' : 'getUserInfo'
      }
    }
  },
  methods: {
    ...mapActions([
      'bindMobile'
    ]),
    ...mapMutations({
      saveUser: 'SAVE_USER'
    }),
    tapItem (e) {
      console.log('tapitem', this.itemData)
      if (!this.btnType) {
        this.$emit('bindOk', this.itemData)
      }
    },
    /**
    * @event bindOk 同意授权
    * @return itemData
    */
    getPhoneNumber (e) {
      const { dataset } = e.mp.currentTarget
      console.log('getPhoneNumber', dataset, e.target)
      const bindData = e.target
      if (bindData.encryptedData) {
        this.bindMobile({
          encryptedData: bindData.encryptedData,
          iv: bindData.iv
        }).then(res => {
          this.$emit('bindOk', this.itemData)
        }).catch(err => {
          console.log('绑定失败', err)
          uni.showToast('绑定失败，请稍后重试', 'none')
        })
      }
    },
    getUserInfo (e) {
      console.log('getUserInfo', e.target.userInfo)
      const { userInfo } = e.target
      if (userInfo) {
        this.saveUser({ hasUserInfo: true, ...userInfo })
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang='scss' scoped>
  .btn-hover {
    -webkit-tap-highlight-color:rgba(0, 0, 0, 0);
  }
  .btn {
    border: none;
    padding-left: 0;
    padding-right: 0;
    -webkit-tap-highlight-color:rgba(0, 0, 0, 0);
    display: flex;
    align-items: center;
    width: 100%;
  }
</style>
