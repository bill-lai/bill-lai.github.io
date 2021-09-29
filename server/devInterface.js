const config = require('./config')
const collection = require('./collection')
const path = require('path')
const fs = require('fs-extra')
const mime = require('mime.json')

module.exports = app => {
  app.get(config.getArticleApi, async (req, res) => {
    const article = await collection.getArticle(
      req.params[config.paramKey]
    )

    if (!article) {
      res.status = 404
      res.end('not fount')
    } else {
      res.json(
        collection.genArticleData(article)
      );
    }
  });
  
  app.use(config.getArticleStatic, async (req, res, next) => {
    const article = await collection.getArticle(
      req.params[config.paramKey]
    )

    if (article && req.url !== '/') {
      try {
        const filepath = path.resolve(article.dir, req.url.substr(1))
        const extname = path.extname(filepath).substr(1)
        const buffer = await fs.readFile(filepath)
        res.type(mime[extname])
        res.end(buffer)
      } catch(e) {
        next()
      }
    } else {
      next()
    }
    // next()
  })

  app.get(config.getColumnApi, async (req, res) => {
    const column = await collection.getColumn(
      req.params[config.paramKey]
    )

    if (!column) {
      res.status = 404
      res.end('not fount')
    } else {
      res.json(
        collection.genColumnData(column)
      );
    }
  })

  app.get(config.getColumnListApi, async (req, res) => {
    const columnList = await collection.getColumnList()

    res.json(
      collection.genColumnListData(columnList)
    )
  })
}