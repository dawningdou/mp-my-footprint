import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export const GET_LOCATION_SUCCESS = 'GET_LOCATION_SUCCESS'
export const GET_LOCATION_FAILURE = 'GET_LOCATION_FAILURE'
export const GET_LOCATION_CACHED = 'GET_LOCATION_CACHED'
export const CLEAR_LOCATION = 'CLEAR_LOCATION'
export default {
  state: {
    location: {
      latitude: '',
      longitude: '',
      update: ''
    }
  },
  mutations: {
    [GET_LOCATION_SUCCESS] (state, payload) {
      const { location } = payload
      state.location = {
        ...location,
        update: new Date().getTime()
      }
    },
    [GET_LOCATION_FAILURE] (state) {},
    [GET_LOCATION_CACHED] (state) {
      state.location = {
        ...state.location,
        update: new Date().getTime()
      }
    },
    [CLEAR_LOCATION] (state) {
      state.location = {
        latitude: '',
        longitude: '',
        update: ''
      }
    }
  },
  actions: {
    async getLocation ({ state, commit }, refresh) {
      if ((!state.location.latitude) || refresh) { // 强制刷新或不存在初始值
        let location = {}
        const [err, ret] = await uni.getLocation({ type: 'gcj02' })
        if (err) {
          console.log('用户拒绝地理位置授权', err)
          commit(GET_LOCATION_FAILURE)
          return { latitude: '', longitude: '' }
        } else {
          console.log('用户地理位置授权', ret)
          location = ret
        }
        // 使用testLocation
        if (uni.$env === 'development' && location.latitude) {
          const testLocation = uni.getStorageSync('testLocation')
          if (testLocation && testLocation.latitude) {
            console.log('使用测试location: ', testLocation)
            location = testLocation
          }
        }
        commit(GET_LOCATION_SUCCESS, { location })
        return { ...location }
      } else {
        commit(GET_LOCATION_CACHED)
        return state.location
      }
    },
    clearLocation ({ commit }) {
      commit(CLEAR_LOCATION)
    }
  }
}
