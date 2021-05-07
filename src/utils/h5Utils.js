export function parseURL (url) {
  const params = url.replace(/.*\?/, '').replace(/#.*/, '').split('&')
  const ret = {}
  params.forEach((s) => {
    if (!s.match(/^http:|^https:/)) {
      const arr = s.split('=')
      const [key, value] = arr
      ret[key] = value
    }
  })
  const i = url.indexOf('?')
  return {
    origin: i === -1 ? url : url.slice(0, i),
    query: ret
  }
}
// 获取url内query
export function getQuery (url, queryName) {
  return parseURL(url).query[queryName]
}
// 拼接域名url，注意：覆盖原URL内的同名参数
export function mergeURL (url, newQuery) {
  const { origin, query } = parseURL(url)
  let ret = origin + '?'
  const retQuery = {
    ...query,
    ...newQuery
  }
  for (const key in retQuery) {
    ret += `${key}=${retQuery[key]}&`
  }
  return ret
}

export default {
  parseURL,
  getQuery,
  mergeURL
}
