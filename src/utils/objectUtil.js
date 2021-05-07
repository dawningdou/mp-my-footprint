export function deepMerge (firstOBJ, secondOBJ) {
  for (const key in secondOBJ) {
    firstOBJ[key] = firstOBJ[key] && firstOBJ[key].toString() === '[object Object]'
      ? deepMerge(firstOBJ[key], secondOBJ[key]) : firstOBJ[key] = secondOBJ[key]
  }
  return firstOBJ
}

export function deepCopy (obj) {
  let newobj
  if (obj === null || typeof obj === 'undefined') return
  if (obj.constructor === Object) {
    newobj = new obj.constructor()
  } else {
    newobj = new obj.constructor(obj.valueOf()) // valueOf()方法返回 Array 对象的原始值
  }
  for (const key in obj) {
    if (newobj[key] !== obj[key]) {
      if (typeof obj[key] === 'object') {
        newobj[key] = deepCopy(obj[key])
      } else {
        newobj[key] = obj[key]
      }
    }
  }
  newobj.toString = obj.toString
  newobj.valueOf = obj.valueOf
  return newobj
}

export function pick (obj, keys) {
  const ret = {}
  if (!keys) return ret
  if (typeof keys === 'function') {
    for (const key in obj) {
      const value = obj[key]
      if (keys(value, key, obj)) {
        ret[key] = value
      }
    }
  } else {
    if (typeof keys === 'string') {
      keys = [keys]
    }
    keys.forEach((key) => {
      if (key in obj) {
        ret[key] = obj[key]
      }
    })
  }
  return ret
}

export default { deepMerge, deepCopy, pick }
