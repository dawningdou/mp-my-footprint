/*
 * @Author: your name
 * @Date: 2019-10-14 11:12:36
 * @LastEditTime: 2020-03-26 22:57:01
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /mp-consul/Users/douning/Desktop/git/preset-mp-tourism/template/common/src/apis/userApi.js
 */
import request from '@/utils/request'
/** 用户相关接口 */
/**
 * 获取登录获取sessionid
 * @param {number} latitude
 */
export const userLogin = ({ wxaCode }) => request.$get('/xn/wxapp/api/login', {
  wxa_code: wxaCode
})

export const isBind = () => request.$get('/xn/wxapp/api/is_bind', {})

export const bindMobile = (data) => request.$post('/xn/wxapp/api/bind_mobile_v2', data)
export const unbindMobile = (data) => request.$get('/xn/wxapp/api/delete_user', data)
export default {
  userLogin,
  isBind,
  bindMobile,
  unbindMobile
}
