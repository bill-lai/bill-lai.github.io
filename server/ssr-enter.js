import collection from './collection'
import getRenderString from '../source/src/server'
import { router } from '../source/src/router'
import { gendUrl } from '../source/src/util'
import config from './config'
import paths from '../config/paths'
import path from 'path'
import fs from 'fs-extra'

const template = fs.readFileSync(paths.appBuildHTML).toString()

const getColumnList = () => 
  collection.getColumnList()
    .then(collection.genColumnListData)

const getArticles = () =>
  collection.getColumnList()
    .then(columns => 
      columns.reduce((t, {articles}) => t.concat(articles), [])
    )
    .then(articles => 
      articles
        .filter(({template}) => !template)
        .map(collection.genArticleData)
    )


const genPages = async () => {
  const [columns, articles] = await Promise.all([
    getColumnList(),
    getArticles()
  ])
  const articleRoute = router.find(({name}) => name === 'article')
  const otherRouter = router.filter(({name}) => name !== 'article')
  const genPageData = (path, data) => 
    getRenderString(path, data)
      .then(html => ({ path, html, data}))

  const pages = await Promise.all([
    ...otherRouter.map(route => genPageData(route.path, { columns })),
    ...articles.map(article => 
      genPageData(
        gendUrl(articleRoute.path, article), 
        { [`article/${article.id}`]: article }
      )
    )
  ])

  return Promise.all(
    pages.map(({path: localPath, html, data}) => {
      console.log(`正在生成${localPath}`)
      return fs.outputFile(
        path.resolve(config.output, localPath.substr(1), './index.html'),
        template.replace(
          /<div\s+id=["|']root["|']\s*>\s*<\/div>/,
          `<div id="root">${html}</div>
           <script>var globalState = ${JSON.stringify(data)}</script>`
        )
      )
    })
  )
}

export default genPages