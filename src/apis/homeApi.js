import request from '@/utils/request'

/**
 * 获取首页数据
 * @param {number} latitude
 * @param {number} longitude
 */
export const getHomeData = ({ latitude, longitude }) => request.$get('/index/detail', {
  latitude,
  longitude
})
/**
 * 获取article数据
 * @param {number} id
 */
export const getArticleDetail = ({ id }) => request.$get('/article/detail', { articleId: id })

export default {
  getHomeData,
  getArticleDetail
}
