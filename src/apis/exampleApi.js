import request from '@/utils/request'
/**
 * 获取example数据
 * @param {string} id
 */
export const getExampleDetail = ({ id }) => request.$get('/example/detail', {
  id
})

export default {
  getExampleDetail
}
