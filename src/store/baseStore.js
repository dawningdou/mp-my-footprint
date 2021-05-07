import { deepMerge, deepCopy, pick } from '@/utils/objectUtil'

/* 清空list */
export const CLEAR_LIST = 'CLEAR_LIST'
/* 开始请求 */
export const FETCH_LIST_REQUEST = 'FETCH_LIST_REQUEST'
/* 请求结果成功 */
export const FETCH_LIST_SUCCESS = 'FETCH_LIST_SUCCESS'
/* 请求失败 */
export const FETCH_LIST_FAILURE = 'FETCH_LIST_FAILURE'

/* detail开始请求 */
export const FETCH_CACHED_DATA_REQUEST = 'FETCH_CACHED_DATA_REQUEST'
/* detail请求结果成功 */
export const FETCH_CACHED_DATA_SUCCESS = 'FETCH_CACHED_DATA_SUCCESS'
/* detail请求失败 */
export const FETCH_CACHED_DATA_FAILURE = 'FETCH_CACHED_DATA_FAILURE'

/* 清空list */
export const CLEAR_CATEGORY_LIST = 'CLEAR_CATEGORY_LIST'
/* 开始请求 */
export const FETCH_CATEGORY_LIST_REQUEST = 'FETCH_CATEGORY_LIST_REQUEST'
/* 请求结果成功 */
export const FETCH_CATEGORY_LIST_SUCCESS = 'FETCH_CATEGORY_LIST_SUCCESS'
/* 请求失败 */
export const FETCH_CATEGORY_LIST_FAILURE = 'FETCH_CATEGORY_LIST_FAILURE'

/* 清空temp data */
export const CLEAR_TEMP_DATA = 'CLEAR_TEMP_DATA'
/* 开始请求 */
export const FETCH_TEMP_DATA_REQUEST = 'FETCH_TEMP_DATA_REQUEST'
/* 请求结果成功 */
export const FETCH_TEMP_DATA_SUCCESS = 'FETCH_TEMP_DATA_SUCCESS'
/* 请求失败 */
export const FETCH_TEMP_DATA_FAILURE = 'FETCH_TEMP_DATA_FAILURE'
/* 开始请求 */
export const UPDATE_TEMP_DATA_REQUEST = 'UPDATE_TEMP_DATA_REQUEST'
/* 请求结果成功 */
export const UPDATE_TEMP_DATA_SUCCESS = 'UPDATE_TEMP_DATA_SUCCESS'
/* 请求失败 */
export const UPDATE_TEMP_DATA_FAILURE = 'UPDATE_TEMP_DATA_FAILURE'

/* 开始删除 */
export const DELETE_TEMP_DATA_REQUEST = 'DELETE_TEMP_DATA_REQUEST'
/* 请求结果成功 */
export const DELETE_TEMP_DATA_SUCCESS = 'DELETE_TEMP_DATA_SUCCESS'
/* 请求失败 */
export const DELETE_TEMP_DATA_FAILURE = 'DELETE_TEMP_DATA_FAILURE'

/* 清空cachedData */
export const CLEAR_CACHED_DATA = 'CLEAR_CACHED_DATA'

/* 默认每页条数 */
const LIST_PAGE_NUM = 20

/* list state结构 */
export function BaseList () {
  return {
    data: null,
    inited: false,
    currentPage: 0,
    status: '',
    error: null
  }
}

/* 分类列表 list state结构 */
export function CategoryList (key) {
  if (!key) {
    console.error('CategoryList 需要定义列表类型字段')
    return
  }
  return {
    key
    // scenic: {
    //   data: [...],
    //   currentPage: 0,
    //   status: '',
    //   error: null
    // }
  }
}
/* cachedDataMap state结构 */
export function BaseCachedDataMap (key = 'id') {
  return {
    key
  }
}

export function TempData () {
  return {
    data: null,
    inited: false,
    status: '',
    error: null
  }
}
/* BASPE_STORE */
const BASE_STORE = {
  // 限定namespace，防止污染其他store
  namespaced: true,
  state: {
  },
  mutations: {
    [FETCH_LIST_REQUEST] (state, payload) {
      const { name } = payload
      state[name] = {
        ...state[name],
        status: state[name].inited ? state[name].status : 'loading',
        error: null
      }
    },
    [FETCH_LIST_SUCCESS] (state, payload) {
      const { data, name, pickKeys, listName, format } = payload
      const list = data[listName || 'list']
      const pickData = pick(data, pickKeys)
      /** 未设置分页项时，认为一页内包含全部数据 */
      // const pagination = data.pagination || {
      //   current_page: 1,
      //   total_page: 1
      // }
      const pagination = {
        current_page: data.pn || 1,
        total_page: data.total_page || 1
      }
      // const pagination = data.pagination || {
      //   current_page: 1,
      //   total_page: 1
      // }
      let prevList = []
      if (Number(pagination.current_page) !== 1) {
        prevList = state[name].data || []
      }
      const newData = prevList.concat(list)
      const formatData = typeof format === 'function' ? format(newData) : newData
      // const newData = prevList.concat(list).concat(list)
      const status = newData.length === 0 ? 'empty' : (Number(pagination.current_page) < Number(pagination.total_page) ? 'more' : 'finished')
      state[name] = {
        data: formatData,
        inited: true,
        currentPage: Number(pagination.current_page),
        status,
        error: null,
        ...pickData
      }
    },
    [FETCH_LIST_FAILURE] (state, payload) {
      const { error, name } = payload
      state[name] = {
        ...state[name],
        status: state[name].inited ? state[name].status : 'error',
        error
      }
    },
    [CLEAR_LIST] (state, payload) {
      const { name } = payload
      state[name] = {
        data: null,
        inited: false,
        currentPage: 0,
        status: '',
        error: null
      }
    },
    [FETCH_CATEGORY_LIST_REQUEST] (state, payload) {
      const { name, params } = payload
      const key = state[name].key
      const id = params[key]
      const cachedData = state[name][id] || {}
      state[name] = {
        ...state[name],
        [id]: {
          ...cachedData,
          status: cachedData.inited ? cachedData.status : 'loading',
          error: null
        }
      }
    },
    [FETCH_CATEGORY_LIST_SUCCESS] (state, payload) {
      const { data, name, pickKeys, listName, format, params } = payload
      const key = state[name].key
      const id = params[key]
      const cachedData = state[name][id]
      const list = data[listName || 'list']
      const pickData = pick(data, pickKeys)
      /** 未设置分页项时，认为一页内包含全部数据 */
      // const pagination = data.pagination || {
      //   current_page: 1,
      //   total_page: 1
      // }
      const pagination = {
        current_page: data.pn || 1,
        total_page: data.total_page || 1
      }
      let prevList = []
      if (Number(pagination.current_page) !== 1) {
        prevList = cachedData.data || []
      }
      const newData = prevList.concat(list)
      const formatData = typeof format === 'function' ? format(newData) : newData
      const status = newData.length === 0 ? 'empty' : (Number(pagination.current_page) < Number(pagination.total_page) ? 'more' : 'finished')
      state[name] = {
        ...state[name],
        [id]: {
          ...cachedData,
          data: formatData,
          currentPage: Number(pagination.current_page),
          status,
          inited: true,
          error: null
        },
        ...pickData
      }
    },
    [FETCH_CATEGORY_LIST_FAILURE] (state, payload) {
      const { name, params, error } = payload
      const key = state[name].key
      const id = params[key]
      const cachedData = state[name][id]

      state[name] = {
        ...state[name],
        [id]: {
          ...cachedData,
          status: 'error',
          error
        }
      }
    },
    [CLEAR_CATEGORY_LIST] (state, payload) {
      const { name } = payload
      state[name] = {
        key: state[name].key
      }
    },
    [FETCH_CACHED_DATA_REQUEST] (state, payload) {
      const { name, params } = payload
      const key = state[name].key
      const id = params[key]
      const cachedData = state[name][id] || {}
      state[name] = {
        ...state[name],
        [id]: {
          ...cachedData,
          status: cachedData.inited ? cachedData.status : 'loading',
          error: null
        }
      }
    },
    [FETCH_CACHED_DATA_SUCCESS] (state, payload) {
      const { data, name, format, params } = payload
      const key = state[name].key
      const id = params[key]
      const cachedData = state[name][id]
      const formatData = typeof format === 'function' ? format(data) : data
      state[name] = {
        ...state[name],
        [id]: {
          ...cachedData,
          data: formatData,
          status: 'success',
          inited: true,
          error: null
        }
      }
    },
    [FETCH_CACHED_DATA_FAILURE] (state, payload) {
      const { name, params, error } = payload
      const key = state[name].key
      const id = params[key]
      const cachedData = state[name][id]
      state[name] = {
        ...state[name],
        [id]: {
          ...cachedData,
          status: 'error',
          error
        }
      }
    },
    [CLEAR_CACHED_DATA] (state, payload) {
      const { name, params } = payload
      const key = state[name].key
      const id = params[key]
      state[name] = {
        ...state[name],
        [id]: {
          data: null,
          inited: false,
          status: '',
          error: null
        }
      }
    },
    // 拉数据temp data
    [FETCH_TEMP_DATA_REQUEST] (state, payload) {
      const { name } = payload
      state[name] = {
        ...state[name],
        status: state[name].inited ? state[name].status : 'loading',
        error: null
      }
    },
    [FETCH_TEMP_DATA_SUCCESS] (state, payload) {
      const { data, name, format } = payload
      const formatData = typeof format === 'function' ? format(data) : data
      state[name] = {
        ...state[name],
        data: formatData,
        status: 'success',
        inited: true,
        error: null
      }
    },
    [FETCH_TEMP_DATA_FAILURE] (state, payload) {
      const { error, name } = payload
      state[name] = {
        ...state[name],
        status: state[name].inited ? state[name].status : 'error',
        error
      }
    },
    // 更新数据
    [UPDATE_TEMP_DATA_REQUEST] (state, payload) {
      const { name } = payload
      state[name] = {
        ...state[name],
        status: state[name].inited ? state[name].status : 'loading',
        error: null
      }
    },
    [UPDATE_TEMP_DATA_SUCCESS] (state, payload) {
      const { data, format, name } = payload
      const formatData = typeof format === 'function' ? format(data) : data
      state[name] = {
        ...state[name],
        data: formatData,
        status: 'success',
        inited: true,
        error: null
      }
    },
    [UPDATE_TEMP_DATA_FAILURE] (state, payload) {
      const { error, name } = payload
      state[name] = {
        ...state[name],
        status: state[name].inited ? state[name].status : 'error',
        error
      }
    },
    [CLEAR_TEMP_DATA] (state, payload) {
      const { name } = payload
      state[name] = {
        data: null,
        inited: false,
        status: '',
        error: null
      }
    },
    // delete temp data
    [DELETE_TEMP_DATA_REQUEST] (state, payload) {
      const { name } = payload
      state[name] = {
        ...state[name],
        deleting: true
      }
    },
    [DELETE_TEMP_DATA_SUCCESS] (state, payload) {
      const { name } = payload
      state[name] = {
        data: null,
        inited: false,
        status: '',
        error: null
      }
    },
    [DELETE_TEMP_DATA_FAILURE] (state, payload) {
      const { name } = payload
      state[name] = {
        ...state[name],
        deleting: false
      }
    }
  },
  actions: {
    async fetchList ({ state, commit }, payload = {}) {
      const { name, api, config } = payload
      // 指定list
      const list = state[name]
      if (!list) {
        console.error('fetchList 传入name的state不存在，请先定义state')
        return
      }
      if (!api) {
        console.error('fetchList 需要传入api方法')
        return
      }
      // 开始请求
      commit(FETCH_LIST_REQUEST, payload)
      let { params } = payload
      params = params || {}
      const p = 1
      const pn = LIST_PAGE_NUM
      try {
        const data = await api({ p, pn, ...params }, config)
        commit(FETCH_LIST_SUCCESS, { data, ...payload })
        return data
      } catch (error) {
        console.error(error)
        commit(FETCH_LIST_FAILURE, { error, ...payload })
        return error
      }
    },
    async fetchListNextPage ({ commit, state }, payload = {}) {
      const { name, api, config } = payload
      const list = state[name]
      if (!list) {
        console.error('fetchList 传入name的state不存在，请先定义state')
        return
      }
      // 请求未完成，退出
      if (list.status === 'loading' || list.status === 'finished') return
      if (!api) {
        console.error('fetchList 需要传入api方法')
        return
      }
      // 开始请求
      let { params } = payload
      params = params || {}
      const p = list.currentPage + 1
      const pn = LIST_PAGE_NUM
      commit(FETCH_LIST_REQUEST, payload)
      try {
        const data = await api({ p, pn, ...params }, config)
        commit(FETCH_LIST_SUCCESS, { data, ...payload })
        return data
      } catch (error) {
        console.error(error)
        commit(FETCH_LIST_FAILURE, { error, ...payload })
        return error
      }
    },
    clearList ({ commit, state }, payload = {}) {
      const { name } = payload
      const list = state[name]
      if (!list) {
        console.error('clearList 传入name的state不存在，请先定义state')
        return
      }
      commit(CLEAR_LIST, payload)
    },
    async fetchCategoryList ({ state, commit }, payload = {}) {
      const { name, api, config, params } = payload
      // 指定list
      const list = state[name]
      if (!list) {
        console.error('fetchCategoryList 传入name的state不存在，请先定义state')
        return
      }
      if (!api) {
        console.error('fetchCategoryList 需要传入api方法')
        return
      }
      const { key } = list
      if (!params || typeof params[key] === 'undefined') {
        console.error('fetchCategoryList 需要传入请求类型值')
        return
      }
      // 开始请求
      commit(FETCH_CATEGORY_LIST_REQUEST, payload)
      const p = 1
      const pn = LIST_PAGE_NUM
      try {
        const data = await api({ p, pn, ...params }, config)
        commit(FETCH_CATEGORY_LIST_SUCCESS, { data, ...payload })
        return data
      } catch (error) {
        console.error(error)
        commit(FETCH_CATEGORY_LIST_FAILURE, { error, ...payload })
        return error
      }
    },
    async fetchCategoryListNextPage ({ commit, state }, payload = {}) {
      const { name, api, config, params } = payload
      const list = state[name]
      if (!list) {
        console.error('fetchList 传入name的state不存在，请先定义state')
        return
      }
      const { key } = list
      const id = params[key]
      if (!params || typeof params[key] === 'undefined') {
        console.error('fetchCategoryListNextPage 需要传入请求类型值')
        return
      }
      const cachedData = list[id]
      // 请求未完成/无更多数据，退出
      if (cachedData.status === 'loading' || cachedData.status === 'finished') return
      if (!api) {
        console.error('fetchList 需要传入api方法')
        return
      }
      // 开始请求
      const p = cachedData.currentPage + 1
      const pn = LIST_PAGE_NUM
      commit(FETCH_CATEGORY_LIST_REQUEST, payload)
      try {
        const data = await api({ p, pn, ...params }, config)
        commit(FETCH_CATEGORY_LIST_SUCCESS, { data, ...payload })
        return data
      } catch (error) {
        console.error(error)
        commit(FETCH_CATEGORY_LIST_FAILURE, { error, ...payload })
        return error
      }
    },
    clearCategoryList ({ commit, state }, payload = {}) {
      const { name } = payload
      const list = state[name]
      if (!list) {
        console.error('clearCategoryList 传入name的state不存在，请先定义state')
        return
      }
      commit(CLEAR_CATEGORY_LIST, payload)
    },
    // 获取详情数据
    async fetchCachedData ({ state, commit }, payload = {}) {
      const { name, api, config, validator, validateError } = payload
      const data = state[name]
      if (!data) {
        console.error('fetchCachedData 传入name的state不存在，请先定义state')
        return
      }
      commit(FETCH_CACHED_DATA_REQUEST, payload)
      const { params } = payload
      try {
        // 发起请求
        const data = await api({ ...params }, config)
        if (!validator || (validator && validator(data))) {
          commit(FETCH_CACHED_DATA_SUCCESS, { data, ...payload })
          return data || {}
        } else {
          console.error('validate error')
          commit(FETCH_CACHED_DATA_FAILURE, { error: validateError, ...payload })
          return validateError
        }
      } catch (error) {
        console.error(error)
        commit(FETCH_CACHED_DATA_FAILURE, { error, ...payload })
        return error
      }
    },
    // 获取详情数据
    async clearCachedData ({ state, commit }, payload = {}) {
      const { name } = payload
      const cachedData = state[name]
      if (!cachedData) {
        console.error('clearTempData 传入name的state不存在，请先定义state')
        return
      }
      commit(CLEAR_CACHED_DATA, payload)
    },
    // 获取临时详情数据
    async fetchTempData ({ state, commit }, payload = {}) {
      const { name, api, config, validator, validateError } = payload
      const data = state[name]
      if (!data) {
        console.error('fetchTempData 传入name的state不存在，请先定义state')
        return
      }
      commit(FETCH_TEMP_DATA_REQUEST, payload)
      const { params } = payload
      try {
        // 发起请求
        const data = await api({ ...params }, config)
        if (!validator || (validator && validator(data))) {
          commit(FETCH_TEMP_DATA_SUCCESS, { data, ...payload })
          return data || {}
        } else {
          console.error('validate error')
          commit(FETCH_TEMP_DATA_FAILURE, { error: validateError, ...payload })
          return validateError
        }
      } catch (error) {
        console.error(error)
        commit(FETCH_TEMP_DATA_FAILURE, { error, ...payload })
        return error
      }
    },
    async deleteTempData ({ commit, state, dispatch }, payload = {}) {
      const { name } = payload
      const tempData = state[name]
      if (!tempData) {
        console.error('clearTempData 传入name的state不存在，请先定义state')
        return
      }
      const { params, config, api } = payload
      commit(DELETE_TEMP_DATA_REQUEST, payload)
      try {
        // 发起请求
        const ret = await api({ ...params }, config)
        commit(DELETE_TEMP_DATA_SUCCESS, payload)
        return ret || {}
      } catch (error) {
        console.error(error)
        commit(DELETE_TEMP_DATA_FAILURE, { error, ...payload })
        return error
      }
    },
    // 获取临时详情数据
    async updateTempData ({ state, commit }, payload = {}) {
      const { name, api, config, validator, validateError } = payload
      const data = state[name]
      if (!data) {
        console.error('fetchTempData 传入name的state不存在，请先定义state')
        return
      }
      commit(UPDATE_TEMP_DATA_REQUEST, payload)
      const { params } = payload
      try {
        // 发起请求
        const data = await api({ ...params }, config)
        if (!validator || (validator && validator(data))) {
          commit(UPDATE_TEMP_DATA_SUCCESS, { data, ...payload })
          return data || {}
        } else {
          console.error('validate error')
          commit(UPDATE_TEMP_DATA_FAILURE, { error: validateError, ...payload })
          return validateError
        }
      } catch (error) {
        console.error(error)
        commit(UPDATE_TEMP_DATA_FAILURE, { error, ...payload })
        return error
      }
    },
    clearTempData ({ commit, state }, payload = {}) {
      const { name } = payload
      const tempData = state[name]
      if (!tempData) {
        console.error('clearTempData 传入name的state不存在，请先定义state')
        return
      }
      commit(CLEAR_TEMP_DATA, payload)
    }
  }
}

export function createStore (store) {
  const newStore = deepCopy(BASE_STORE)
  return deepMerge(newStore, store)
}

export default { createStore, BaseList, BaseCachedDataMap }
