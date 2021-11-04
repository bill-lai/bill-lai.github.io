import * as marked from 'marked'
import * as prismjs from 'prismjs'

// 解析mardown文本
export const analysisMarked = (() => {
  marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    breaks: true,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    highlight: function (code,lang) {
      if (prismjs.languages[lang]) {
        return prismjs.highlight(code, prismjs.languages[lang], lang)
      } else {
        return prismjs.highlight(code, prismjs.languages['plaintext'], 'plaintext')
      }
    }
  });

  return (str: string) => marked(str)
})();

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



const place = /(?:\/:([^/]*))/g
// 匹配 /:id 是否匹配某个url
export const equalUrl = (tempUrl: string, url: string) => {
  const urlRgStr = tempUrl.replace(/\/([^:])/g,(_, d) => `\\/${d}`)
    .replace(place, () => `(?:/[^/]*)`)
  
  return new RegExp(urlRgStr).test(url)
}

// 生成/:id 类真实url
export const gendUrl = (tempUrl: string, params: { [key: string]: any}) => {
  let url = ''
  let preIndex = 0
  let m

  while ((m = place.exec(tempUrl))) {
    url += tempUrl.substring(preIndex,  m.index + 1) + (params[m[1]] || 'null')
    preIndex = m.index + m[0].length
  }
  url += tempUrl.substr(preIndex)
  return url
}

export const includesUrl = (tempUrls: Array<string> | readonly string[], url: string) =>
  tempUrls.some(tempUrl => equalUrl(tempUrl, url)) 

  
export const strToParams = (str: string) => {
  if (str[0] === '?') {
    str = str.substr(1)
  }

  const result: { [key: string]: string } = {}
  const splitRG = /([^=&]+)(?:=([^&]*))?&?/

  let rgRet
  while ((rgRet = str.match(splitRG))) {
    result[rgRet[1]] = rgRet[2]
    str = str.substr(rgRet[0].length)
  }
  
  return result
}

export const paramsToStr = (params: { [key: string]: string }) => 
  '?' + Object.keys(params)
    .map(key => `${key}${params[key] == null ? '' : `=${params[key]}`}`)
    .join('&')


export const objectToString = Object.prototype.toString
export const toTypeString = (value: unknown): string =>
  objectToString.call(value)

export const toRawType = (value: unknown): string => {
  // extract "RawType" from strings like "[object RawType]"
  return toTypeString(value).slice(8, -1)
}
    

// 递归复制
export const recursionCopy = <T extends object, R extends object>(from: R, to: T): T & R => {
  if (toRawType(from) !== toRawType(to)) {
    return to as T & R
  }

  const toKeys = Object.keys(to)
  const fromKeys = Object.keys(from)
  const result = { ...from } as T & R

  for (const toKey of toKeys) {
    const toItem = (to as any)[toKey]

    let i = 0;
    for (; i < fromKeys.length; i++) {
      const fromKey = fromKeys[i]
      if (toKey === fromKey) {
        const fromItem = (from as any)[fromKey]
        const fromItemType = toRawType(fromItem)
        const toItemType = toRawType(toItem)

        if (fromItemType === toItemType 
            && (fromItemType === 'Object' 
              || fromItemType === 'Array')
        ) {
          (result as any)[fromKey] = recursionCopy(fromItem, toItem)
        } else {
          (result as any)[fromKey] = toItem
        }

        break;
      }
    }

    if (i === fromKeys.length) {
      (result as any)[toKey] = toItem
    }
  }

  return result
}