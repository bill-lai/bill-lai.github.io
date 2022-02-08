const fs = require('fs-extra')
const path = require('path')
const { JSDOM } = require('jsdom')
const paths = require('./config')
const chokidar = require('chokidar')
const { gendNewId, analysisMarked } = require('./util')
const state = require('./state')
const pro = require('../config/dataProduce')
const axios = require('axios').default

const analysisArticleMD = (mdstr, id) => {
  return analysisMarked(mdstr, `/${paths.outputArticleDir}/${id}/`)
}

// 读取文件
const readFile = (() => {
  let cache = {}
  
  if (!paths.fileCache) {
    chokidar.watch(paths.enter).on('all', () => {
      if (!state.autoWrite) {
        cache = {}
      }
    })
  }

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
const writeConfig = (() => {
  const writeStack = []

  const complete = (writePromise) => {
    let index = writeStack.indexOf(writePromise)
    if (index > -1) {
      writeStack.splice(index, 1)
    }
    setTimeout(() => {
      if (!writeStack.length) {
        state.autoWrite = false
      }
    }, 1000)
  }

  return (path, config) => {

    const promise = fs
      .writeFile(path, JSON.stringify(config, 0, 2))
      .then(() => config)

    state.autoWrite = true
    writeStack.push(promise)
    promise.then(() => complete(promise))
      .catch(() => complete(promise))

    return promise
  }
})();

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

  config.template = 'template' in config ? config.template : false
  config.mtime = mtime.getTime()
  config.ctime = config.ctime || ctime.getTime()

  return config
}

// 关联github issues
const articleJoinIssues = (config, body) => {
  if (!config.issues) {
    return axios({
      headers: { 
        Authorization: `token ${pro.token}`,
        Accept: `application/vnd.github.squirrel-girl-preview, application/vnd.github.html+json`
      },
      method: 'POST',
      url: `https://api.github.com/repos/bill-lai/bill-lai.github.io/issues`,
      data: {
        title: config.title,
        labels: [pro.issuesLabel, config.id],
        body: [
          config.head && config.head.md,
          body,
          config.foot && config.foot.md,
        ].filter(Boolean).join('')
      }
    }).then(res => {
      return {
        issues: {
          number: res.data.number,
          commentsUrl: res.data.comments_url,
          reactionsUrl: res.data.reactions.url,
        }
      }
    }).catch(err => {
      // console.error(err)
      return Promise.reject(err)
    })
  } else {
    return Promise.resolve({})
  }
}

// 关联模板文档
const genArticleConfig = (articlePath) => {
  const filename = path.resolve(articlePath, paths.describe)
  const base = readFile(filename) || Promise.resolve(JSON.stringify({}))
  const promise = base.then(readConfig)
    .then(base => perfectArticleData(articlePath, base))

  return promise
    .then(base => {
      if (base.template) return base;
      
      const config = { ...base }
      const tempPromises = []

      for (let key of paths.templates) {
        const tempPath = config[key] && path.resolve(articlePath, config[key])
        const tempPromise = tempPath && readFile(tempPath)

        if (tempPromise) {
          const tempDir = path.resolve(tempPath, '../')
          
          tempPromises.push(
            Promise.all([
              genArticle(tempDir),
              tempPromise
            ]).then(([tempConfig, tempStr]) => {
              const { html, navs } = analysisArticleMD(tempStr, tempConfig.id)
              config[key] = {
                ...tempConfig,
                ...analysisArticleMD(tempStr, tempConfig.id),
                dirs: navs,
                body: html,
                dir: tempDir,
                md: tempStr
              }
            })
          )
        } else {
          config[key] = null
        }
      }

      return Promise.all(tempPromises).then(
        () => ({ config, base })
      )
    })
}

// 生成文章数据
const genArticle = (articlePath) => {
  if (!fs.statSync(articlePath).isDirectory()) {
    return Promise.resolve();
  }

  const readFilePromise = readFile(articlePath, paths.main) || Promise.resolve('')
  const filename = path.resolve(articlePath, paths.describe)

  return Promise.all([
    readFilePromise,
    genArticleConfig(articlePath)
  ])
  .then(([body, data]) => 
    data.config
      ? articleJoinIssues(data.config, body)
          .then(attach => 
            writeConfig(filename, {...data.base, ...attach})
              .then(() => ([body, {...data.config, ...attach}]))
          )
      : writeConfig(filename, data)
          .then(() => [body, data])
  )
  .then(([body, base]) => {
    const { html, navs } = analysisArticleMD(body, base.id)
    const config = { 
      ...base,
      dirs: navs,
      body: html
    }

    config.dir = articlePath

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

  return promise.then(base => writeConfig(filename, base))
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

// 生成所有数据
const genData = (dir = paths.enter) => {
  const columnDirs = fs.readdirSync(dir).filter(atom => atom[0] !== '.')

  const handleColumnDir = async columnDir => {
    let data
    try {
      data = await genColumn(path.resolve(dir, columnDir))
    } catch (err) {
      console.error(err)
    } finally {
      return data
    }
  }

  return Promise.all(columnDirs.map(handleColumnDir).filter(data => data))
    .then(data => {
      return data
    })
}

module.exports = {
  genData,
  genColumn,
  genArticle
}