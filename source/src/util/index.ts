// 节流
export const throttle = (fn: Function, delay: number = 160) => {
  let previous = 0

  return function<Args extends Array<any>, This>(
    this: This, ...args: Args
  ) {
    const now = Date.now()
    if (now - previous >= delay) {
      fn.apply(this, args)
      previous = now
    }
  }
}

// 防抖
export const debounce = (fn: Function, delay: number = 160) => {
  let timeout: NodeJS.Timeout

  return function<Args extends Array<any>, This>(
    this: This, ...args: Args
  ) {
    clearTimeout(timeout)
    setTimeout(() => {
      fn.apply(this, ...args)
    }, delay)
  }
}




const place = /(?::([^/]*))/g
// 匹配 /:id 是否匹配某个url
export const equalUrl = (tempUrl: string, url: string) => {
  const urlRgStr = tempUrl.replace(/\//g,'\\/')
    .replace(place, () => `(?:[^/]*)`)
  
  return new RegExp(urlRgStr).test(url)
}

// 生成/:id 类真实url
export const gendUrl = (tempUrl: string, params: { [key: string]: any}) => {
  let url = ''
  let preIndex = 0
  let m
  while ((m = place.exec(tempUrl))) {
    url += tempUrl.substring(preIndex, m.index) + (params[m[1]] || 'null')
    preIndex = m.index + m[0].length
  }
  url += tempUrl.substr(preIndex)
  return url
}