// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database({
  env: cloud.DYNAMIC_CURRENT_ENV
})
// 云函数入口函数
exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  const { city, openid } = event
  return db.collection('marks').where({
    'ad_info.city': city,
    openid: openid || OPENID,
    visited: 1
  }).get()
    .then((res) => {
      console.log(res)
      return {
        code: 0,
        data: res.data
      }
    }).catch((err) => {
      return err
    })
}
