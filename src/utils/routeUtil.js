import routeConfig from '@/config/routeConfig'
// type =['navigate', 'redirect', 'switchTab', 'reLaunch']
let pageArray = [] // 多余页面缓存
export function routeTo ({ name, params = {}, type = 'navigate' }) {
  console.log(type, 'to', name)
  if (!name) {
    console.error('name不可以为空')
    return
  }
  const route = routeConfig[name]
  if (!route) {
    console.error(`name为${name}的路由不存在，请确认name是否正确`)
    return
  }
  let paramsStr = ''
  Object.keys(params).forEach((key) => {
    paramsStr += `${key}=${params[key]}&`
  })
  if (paramsStr) {
    paramsStr = '?' + paramsStr
  }
  if (route.type === 'tab') {
    type = (type === 'switchTab' || type === 'reLaunch') ? type : 'switchTab'
  }

  const pageNumber = getCurrentPages().length
  if (pageNumber < 9 || type === 'reLaunch' || type === 'switchTab') {
    pageArray = []
  } else if (pageNumber === 9 && type === 'navigate') { // 超过层数
    console.log('9层', 'navigate')
    pageArray.push({
      name,
      params,
      type
    })
  } else if (pageNumber === 10) {
    console.log('10层')
    if (type === 'redirect' && pageArray.length) {
      pageArray.pop()
    }
    type = 'redirect'
    pageArray.push({
      name,
      params,
      type
    })
  }

  switch (type) {
    case 'navigate':
      uni.navigateTo({ url: route.path + paramsStr })
      break
    case 'redirect':
      uni.redirectTo({ url: route.path + paramsStr })
      break
    case 'switchTab':
      if (paramsStr) {
        console.warn('switchTab无法传参')
      }
      uni.switchTab({ url: route.path })
      break
    case 'reLaunch':
      uni.reLaunch({ url: route.path + paramsStr })
      break
    default:
      break
  }
}

export function routeBack (params) {
  params = params || { delta: 1 }
  const { delta } = params
  const len = pageArray.length
  if (len > delta) {
    for (let i = 0; i < delta; i++) {
      pageArray.pop()
    }
    const routePage = pageArray.pop()
    routeTo(routePage)
  } else {
    pageArray = []
    uni.navigateBack({ delta: delta - (len ? len - 1 : 0) })
  }
}

export default { routeTo, routeBack }
