import Vue from 'vue'
import Vuex from 'vuex'
import apis from '@/apis/index'
import { createStore, BaseCachedDataMap } from './baseStore'
Vue.use(Vuex)

export const FETCH_CACHED_DATA_REQUEST = 'FETCH_CACHED_DATA_REQUEST'
export const FETCH_CACHED_DATA_SUCCESS = 'FETCH_CACHED_DATA_SUCCESS'
export const FETCH_CACHED_DATA_FAILURE = 'FETCH_CACHED_DATA_FAILURE'

export default createStore({
  state: {
    /** detail map */
    exampleDetailMap: new BaseCachedDataMap('id')
  },
  mutations: {},
  actions: {
    async fetchExampleCachedData ({ dispatch }, payload) {
      return dispatch('fetchCachedData', {
        params: { ...payload },
        api: apis.example.getExampleDetail,
        name: 'exampleDetailMap'
      })
    }
  }
})
