import Vue from 'vue'
import Vuex from 'vuex'
// import apis from '../apis/index'
Vue.use(Vuex)

// 首页数据
// export const FETCH_LOGIN_REQUEST = 'FETCH_LOGIN_REQUEST'
export const SAVE_USER = 'SAVE_USER'

export default {
  state: {
    wxa_session_id: null,
    wxa_code: null,
    is_bind: null,
    nickName: null,
    avatarUrl: null,
    gender: null,
    mobile: null,
    uid: null,
    hasUserInfo: null
  },
  mutations: {
    [SAVE_USER] (state, payload) {
      if (!payload) return
      // 可能包括 is_bind uid nickName avatarUrl gender mobile
      // 放到store里同时放到localstorage里
      console.log('SAVE_USER', payload)
      for (const key in payload) {
        const val = payload[key]
        if (val !== undefined) {
          state[key] = val
        }
      }
      const user = uni.getStorageSync('user') || {}
      console.log('after SAVE_USER', user)
      uni.setStorageSync('user', { ...user, ...payload })
    }
  },
  actions: {
    async userLogin ({ commit, dispatch, state }, payload) {
      // console.log('userLogin')
      // try {
      //   let wxaCode
      //   if (state.wxa_code) {
      //     const status = await uni.checkSession()
      //     console.log('status', status)
      //   } else {
      //     const res = await uni.login()
      //     wxaCode = res[1].code
      //   }
      //   const data = await apis.userApi.userLogin({ wxaCode })
      //   const sid = data.wxa_session_id
      //   console.log('wxa_session_id', sid)
      //   state.wxa_session_id = sid
      //   await uni.setStorage({
      //     key: 'wxa_session_id',
      //     data: sid
      //   })
      // } catch (err) {
      //   console.log('login fail', err)
      //   // throw (err)
      // }
    },
    async checkBind ({ commit, dispatch, state }, payload) {
      // //   commit(FETCH_ARTICLE_DETAIL_REQUEST)
      // try {
      //   const data = await apis.userApi.isBind()
      //   console.log('checkBind', data)
      //   if (!(data.user_info.nickName && data.user_info.avatarUrl && data.is_bind && data.user_info.uid)) {
      //     console.log('check bind 缺少必要项')
      //   }
      //   const user = { is_bind: data.is_bind, ...data.user_info }
      //   if (data.is_bind) {
      //     user.hasUserInfo = true
      //   }
      //   commit('SAVE_USER', user)
      // } catch (err) {
      //   console.log(err)
      //   // commit(FETCH_ARTICLE_DETAIL_FAILURE, err)
      // }
    },
    async getLocalUserInfo ({ commit, dispatch, state }, payload) {
      // let user
      // try {
      //   user = uni.getStorageSync('user')
      //   if (user) {
      //     if (!user.hasUserInfo) {
      //       throw new Error('empty userInfo')
      //     }
      //     commit('SAVE_USER', user)
      //   } else {
      //     throw Error('empty userInfo')
      //   }
      //   console.log('getLocalUserInfo', user)
      // } catch (err) {
      //   const setting = await uni.getSetting()
      //   if (setting[1].authSetting['scope.userInfo']) {
      //     const res = await uni.getUserInfo()
      //     if (res.userInfo) {
      //       commit('SAVE_USER', { hasUserInfo: true, ...res.userInfo })
      //     }
      //   }
      // }
    },
    async bindMobile ({ commit, dispatch, state }, payload) {
      // try {
      //   console.log('bind', payload)
      //   const data = await apis.userApi.bindMobile({
      //     wxa_session_id: state.wxa_session_id,
      //     user_info: {
      //       nickName: state.nickName,
      //       avatarUrl: state.avatarUrl,
      //       gender: state.gender
      //     },
      //     encrypted_data: payload.encryptedData,
      //     iv: payload.iv
      //   })
      //   console.log('bindMobile', data)
      //   if (!data || !data.uid) {
      //     throw new Error('empty uid')
      //   }
      //   commit('SAVE_USER', { uid: data.uid, is_bind: true, mobile: data.mobile })
      // } catch (err) {
      //   console.log(err)
      //   throw err
      // }
    },
    async unbindMobile ({ commit, dispatch, state }) {
      // try {
      //   console.log('unbind')
      //   await apis.userApi.unbindMobile({})
      //   uni.removeStorageSync('user')
      //   uni.removeStorageSync('wxa_session_id')
      //   commit('SAVE_USER', {
      //     wxa_session_id: null,
      //     wxa_code: null,
      //     is_bind: null,
      //     nickName: null,
      //     avatarUrl: null,
      //     gender: null,
      //     mobile: null,
      //     uid: null,
      //     hasUserInfo: null
      //   })
      //   dispatch('userLogin').then(res => {
      //     console.log('userlogin ok')
      //     dispatch('checkBind', res)
      //   })
      //   uni.showToast({
      //     title: '已解绑',
      //     icon: 'none'
      //   })
      // } catch (err) {
      //   console.log(err)
      //   throw err
      // }
    }
  }
}
