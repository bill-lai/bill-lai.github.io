const crypto = require('crypto')
const marked = require('marked')
const prismjs = require('prismjs')
const fs = require('fs-extra')
const path = require('path')


// 拷贝文件夹内的所有文件到目标文件加
const copyDirFiles = (originDir, targetDir, exclude) => {
  if (!fs.existsSync(originDir)) return Promise.resolve()

  return Promise.all([
    fs.readdirSync(originDir)
      .filter(filename => !exclude || !exclude.test(filename))
      .map(filename => {
        const filepath = path.resolve(originDir, filename)
        const targetpath = path.resolve(targetDir, filename)

        if (fs.statSync(filepath).isDirectory()) {
          return copyDirFiles(filepath, targetpath, exclude)
        } else {
          return fs.copy(filepath, targetpath)
        }
      })
  ])
}

// 生成唯一id码
const gendNewId = () => crypto.randomBytes(10).toString('hex')

// 解析mardown文本
const analysisMarked = (markedStr, baseUrl = '/') => {
  const headLeaveRG = /^(#*)/
  const navs = []
  const addNav = (navs, targetNav) => {
    const lastNav = navs[navs.length - 1]
    
    if (lastNav && lastNav.leave < targetNav.leave) {
      addNav(lastNav.children, targetNav)
    } else {
      navs.push(targetNav)
    }
  }

  marked.setOptions({
    baseUrl: baseUrl,
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

  return { 
    html: marked(markedStr), 
    navs 
  }
};
// 数据缓存
const cache = (api) => {
  const cache = new Map()

  return function(...args) {
    for (const cArgs of cache.keys()) {
      if (cArgs.length !== args.length) {
        continue;
      }
      let i = 0
      for (; i < cArgs.length; i++) {
        if (cArgs[i] !== args[i]) {
          break;
        }
      }
      if (i === cArgs.length) {
        return cache.get(cArgs)
      }
    }

    const ret = api.call(this, ...args)
    cache.set(args, ret)
    return ret
  }
};

module.exports = {
  cache,
  analysisMarked,
  gendNewId,
  copyDirFiles
}