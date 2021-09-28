const fs = require('fs-extra')
const path = require('path')
const marked = require('marked')
const prismjs = require('prismjs')
const crypto = require('crypto')
const { JSDOM } = require('jsdom')
const config = require('./config')

// 排除解析文件
const paths = {
  enter: path.resolve(__dirname, '../article'),
  main: 'README.md',
  describe: 'config.json'
}

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

// 读取文件
const readFile = (() => {
  const cache = {}

  return (dir, filename) => {
    const filepath = filename ? path.resolve(dir, filename) : dir
    const exists = !!cache[filepath] || fs.existsSync(filepath)

    if (exists) {
      return fs.readFile(filepath)
        .then(buffer => buffer.toString())
        .then(str => cache[filepath] = str)
    } else {
      return false
    }
  }
})();

// 写入config
const writeConfig = (path, config) => {
  return fs.writeFile(path, JSON.stringify(config, 0, 2))
}

// 读取config
const readConfig = (str) => {
  try {
    return JSON.parse(str)
  } catch(e) {
    console.error(e)
    return {}
  }
}

// 文章和栏目基础补全
const perfectBaseData = (path, base = {}) => {
  const config = { ...base }

  if (!config.title) {
    const paths = path.split(/\/|\\|(?:\\\\)/)
    config.title = paths[paths.length - 1]
  }

  config.id = config.id || gendNewId()

  return config
}

// 补全文章数据
const perfectArticleData = (path, base = {}) => {
  const { mtime, ctime } = fs.statSync(path, paths.main)
  const config = perfectBaseData(path, base)

  config.mtime = mtime.getTime()
  config.ctime = config.ctime || ctime.getTime()

  return config
}

// 关联头部底部文档
const genArticleConfig = (articlePath) => {
  const filename = path.resolve(articlePath, paths.describe)
  const base = readFile(filename) || Promise.resolve(JSON.stringify({}))

  const promise = base.then(readConfig)
    .then(base => perfectArticleData(articlePath, base))

  promise.then(base => writeConfig(filename, base))

  return promise.then(base => {
    const config = { ...base }
    const joinPromises = []
    const headPromise = config.head && readFile(articlePath, config.head)
    const footPromise = config.foot && readFile(articlePath, config.foot)

    if (headPromise) {
      joinPromises.push(headPromise.then(str => config.head = str))
    } else {
      config.head = ''
    }

    if (footPromise) {
      joinPromises.push(footPromise.then(str => config.foot = str))
    } else {
      config.foot = ''
    }
    return Promise.all(joinPromises).then(() => config)
  })
}

// 生成文章数据
const genArticle = (articlePath) => {
  const readFilePromise = readFile(articlePath, paths.main)
  if (!readFilePromise) return;

  return Promise.all([
    readFilePromise,
    genArticleConfig(articlePath)
  ]).then(([mainStr, base]) => {
    const body = base.head + mainStr + base.foot
    const { html, navs } = analysisMarked(body)
    const config = { ...base }

    config.navs = navs
    config.html = html

    if (!config.desc) {
      const { window: { document } } = new JSDOM(html)
      config.desc = document.documentElement.textContent.substr(0, 150).trim()
    }

    return config
  })
}

// 读取栏目配置
const genColumnConfig = (dir) => {
  const filename = path.resolve(dir, paths.describe)
  const base = readFile(filename) || Promise.resolve(JSON.stringify({}))

  const promise = base.then(readConfig)
    .then(base => perfectBaseData(dir, base))

  promise.then(base => writeConfig(filename, base))

  return promise
}

// 读取栏目
const genColumn = (dir) => {
  const articleDirs = fs.readdirSync(dir)
    .filter(child => 
      fs.statSync(path.resolve(dir, child)).isDirectory()
    )
  const handleArticleDir = articleDir => genArticle(path.resolve(dir, articleDir))
  const articlesPromise = Promise.all(articleDirs.map(handleArticleDir))

  return Promise.all([
    genColumnConfig(dir),
    articlesPromise
  ]).then(([config, articles]) => {
    config.articles = articles
    return config
  })
}


const genData = (dir) => {
  const columnDirs = fs.readdirSync(dir)
  const handleColumnDir = columnDir => genColumn(path.resolve(dir, columnDir))

  return Promise.all(columnDirs.map(handleColumnDir))
    .then(data => {
      return data
    })
}
