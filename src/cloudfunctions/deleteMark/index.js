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
  const { id } = event
  return db.collection('marks').where({
    id,
    openid: OPENID
  }).remove()
    .then((res) => {
      return {
        code: 0,
        data: res._id
      }
    }).catch((err) => {
      return err
    })
}
