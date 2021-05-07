import Vue from 'vue'
import Vuex from 'vuex'

import location from './location'
import user from './user'
import example from './example'
Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
    location,
    user,
    example
  }
})

export default store
