// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let { OPENID, APPID, UNIONID } = cloud.getWXContext()
  console.log('event', event)
  console.log('context', context)
  console.log(cloud.getWXContext())
  return {
    OPENID,
    APPID,
    UNIONID
  }
}