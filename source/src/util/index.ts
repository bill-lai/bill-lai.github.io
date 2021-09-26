import * as marked from 'marked'
import * as prismjs from 'prismjs'

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


// 解析mardown文本
export type MarkedNav = { leave: number, title: string, children: MarledNavs }
export type MarledNavs = Array<MarkedNav>
export const analysisMarked = (() => {
  const headLeaveRG = /^(\#*)/
  const navs: MarledNavs = []

  const addNav = (navs: MarledNavs, targetNav: MarkedNav) => {
    const lastNav = navs[navs.length - 1]
    
    if (lastNav && lastNav.leave < targetNav.leave) {
      addNav(lastNav.children, targetNav)
    } else {
      navs.push(targetNav)
    }
  }

  marked.setOptions({
    baseUrl: "/",
    renderer: new marked.Renderer(),
    gfm: true,
    breaks: true,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    highlight: function (code,lang) {
      return prismjs.highlight(code, prismjs.languages[lang], lang)
    },
    walkTokens: function(token) {
      let rgRet
      if (token.type === 'heading' && 
        (rgRet = token.raw.match(headLeaveRG))) {

        const cleave = rgRet[1].length
        addNav(
          navs, 
          {
            leave: cleave,
            title: token.text,
            children: []
          }
        )
      }
    }
  });

  return (markedStr: string) => {
    const html = marked(markedStr)
    const rNavs = [...navs]

    navs.length = 0

    return {
      html: html,
      navs: rNavs
    }
  }
})();
