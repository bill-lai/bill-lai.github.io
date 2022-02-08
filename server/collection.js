const path = require('path')
const fs = require('fs-extra')
const chokidar = require('chokidar')
const fileManage = require('./file-manage')
const config = require('./config')
const { copyDirFiles } = require('./util')
const state = require('./state')

// 获取源数据
const getData = (() => {
  let dataPromise

  if (!config.fileCache) {
    chokidar.watch(config.enter).on('all', () => {
      if (!state.autoWrite) {
        dataPromise = void 0
      }
    })
  }

  return () => {
    if (!dataPromise) {
      dataPromise = fileManage.genData()
    }
    return dataPromise
  }
})();

// 生成去除无关的文章数据
const genArticleData = article => {
  const data = {
    ...article
  }
  config.templates.forEach(key => {
    if (data[key]) {
      data[key] = {
        body: data[key].body,
        dirs: data[key].dirs
      }
    }
  })
  if (article.column) {
    article.column = {
      id: article.column.id,
      title: article.column.title
    }
  }
  delete data.dir
  delete data.template
  
  return data
}

// 生成去除无关的栏目数据
const genColumnData = column => {
  return {

    ...column,
    articles: column.articles
      .filter(article => !article.template)
      .map(base => {
        const article = genArticleData(base)
        delete article.dirs
        delete article.body
        delete article.issues
        delete article.column
        
        config.templates.forEach(key => {
          delete article[key]
        })
        return article
      })
    }
}

const genColumnListData = columnList => columnList.map(genColumnData)


// 获取文章数据
const getArticle = (queryId) => 
  getData()
    .then(columns => {
      for (let column of columns) {
        const article = column.articles.find(({id}) => id === queryId)
        if (article) {
          article.column = {...column}
          delete article.column.articles
          return article
        }
      }
    })

// 获取栏目数据
const getColumn = (queryId) => 
  getData()
    .then(columns => columns.find(({id}) => id === queryId))

// 获取所有栏目数据
const getColumnList = () => getData()


const collArticle = queryId => 
  getArticle(queryId)
    .then(data => {
      const outputDir = path.resolve(config.output, config.outputArticleDir, queryId)
      const writeData = !data.template && 
        fs.outputFile(
          path.resolve(outputDir, `${config.outputDataFileName}.${config.suffix}`),
          JSON.stringify(genArticleData(data))
        )

      return Promise.all([
        writeData,
        copyDirFiles(data.dir, outputDir, config.copyExclude)
      ]).then(() => data)
    })

const collColumn = queryId => 
  getColumn(queryId)
    .then(data => 
      fs.outputFile(
        path.resolve(config.output, config.outputColumnDir, queryId, `${config.outputDataFileName}.${config.suffix}`),
        JSON.stringify(genColumnData(data))
      ).then(() => data)
    )

const collColumnList = () => 
  getColumnList()
    .then(columns => 
      Promise.all([
        Promise.all(columns.map(({id}) => collColumn(id))),
        fs.outputFile(
          path.resolve(
            config.output, 
            config.outputColumnDir, 
            `${config.outputDataFileName}.${config.suffix}`
          ),
          JSON.stringify(genColumnListData(columns))
        )
      ]).then(() => columns)
    )
    

    
const collData = () => 
  collColumnList()
    .then(columns => {
      const collPromises = []
      for (const {articles} of columns) {
        for (const { id } of articles) {
          collPromises.push(collArticle(id))
        }
      }
      return Promise.all(collPromises)
    })

module.exports = {
  genArticleData,
  genColumnData,
  genColumnListData,
  getArticle,
  getColumn,
  getColumnList,
  collArticle,
  collColumn,
  collColumnList,
  collData
}