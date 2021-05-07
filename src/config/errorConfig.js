/** 错误页配置 */
export const ErrorType = {
  /** 网络错误 */
  NETWORK_ERR: 'NETWORK_ERR',
  /** 服务器错误 */
  SERVER_ERR: 'SERVER_ERR',
  /** 登录错误 */
  LOGIN_ERR: 'LOGIN_ERR',
  /** 空数据 */
  EMPTY_ANSWER: 'EMPTY_ANSWER',
  /** 空收藏列表 */
  EMPTY_COLLECTION: 'EMPTY_COLLECTION'
}
export const ErrorPage = {
  /** 网络错误 */
  [ErrorType.NETWORK_ERR]: {
    path: '/static/images/error/server-error.png',
    title: '网络异常，检查网络再试试〜',
    button: '刷新重试',
    action: 'refresh'
  },
  /** 服务器错误 */
  [ErrorType.SERVER_ERR]: {
    path: '/static/images/error/server-error.png',
    title: '服务器度假去了，请稍候〜',
    button: '刷新重试',
    action: 'refresh'
  },
  /** 登录错误 */
  [ErrorType.LOGIN_ERR]: {
    path: '/static/images/error/login-error.png',
    title: '你还没有填写旅客信息',
    button: '',
    action: ''
  },
  /** 空回答 */
  [ErrorType.EMPTY_ANSWER]: {
    path: '/static/images/error/empty-data.png',
    title: '没有任何内容，快去回答问题吧！',
    button: '去回答',
    action: 'navigate'
  },
  /** 空收藏列表 */
  [ErrorType.EMPTY_COLLECTION]: {
    path: '/static/images/error/empty-collection.png',
    title: '还没有收藏任何内容，多去逛逛吧！',
    button: '去逛逛',
    action: 'navigate'
  }
}

export default { ErrorType, ErrorPage }
