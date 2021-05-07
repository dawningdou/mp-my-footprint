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
  const { address, title, location, category, id, ad_info, adcode, city, district, province } = event
  return db.collection('marks').where({
    id: id,
    openid: OPENID
  }).get().then((res) => {
    console.log('查找', res)
    if (res && res.data && res.data.length) {
      throw new Error({
        errorCode: -1,
        errorMessage: '已存在此记录'
      })
    }
  }).then(() => {
    return db.collection('marks').add({
      data: {
        id,
        ad_info: ad_info || {
          ad_info, adcode, city, district, province
        },
        title,
        address,
        category,
        timeStamp: new Date().getTime(),
        location,
        openid: OPENID,
        visited: 0
      }
    })
  }).then((res) => {
    return {
      code: 0,
      data: res._id
    }
  }).catch((err) => {
    return err
  })
}
