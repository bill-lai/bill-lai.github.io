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
      return prismjs.highlight(code, prismjs.languages[lang], lang)
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