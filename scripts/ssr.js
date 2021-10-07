const fs = require('fs-extra')
const path = require('path')

const buildPath = path.resolve(__dirname, '../node_modules/_serve-dist')
const buildFilename = 'server.js'
const buildFilePath = path.resolve(buildPath, buildFilename)

const genServerBuild = () => {
  process.env.BABEL_ENV = 'production';
  process.env.NODE_ENV = 'production';
  const MiniCssExtractPlugin = require('mini-css-extract-plugin');

  const nodeExternals = require('webpack-node-externals')
  const configFactory = require('../config/webpack.config');
  const baseConfig = configFactory('production')

  const config = {
    resolve: baseConfig.resolve,
    resolveLoader: baseConfig.resolveLoader,
    target: 'node',
    externals: [nodeExternals()],
    entry: path.resolve(__dirname, '../source/src/server.tsx'),
    output: {
      path: buildPath,
      publicPath: '/',
      filename: buildFilename,
      library: 'app',
      libraryTarget: 'umd'
    },
    module: baseConfig.module,
    plugins: [
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: 'static/css/[name].[contenthash:8].css',
        chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
      }),

    ]
  }


  const webpack = require('webpack');
  const compile = webpack(config)

  return new Promise(resolve => {
    compile.run()
    compile.hooks.afterEmit.tap('updateImport', () => {
      const content = fs.readFileSync(buildFilePath)
        .toString()
        .replace(/\/helpers\/esm\//g, '/helpers/')
    
      fs.writeFileSync(buildFilePath, content)
      resolve()
    })
  })
}


async function main() {
  if (!fs.existsSync(buildFilePath)) {
    await genServerBuild()
  }
  
  const collection = require('../server/collection')
  const config  = require('../server/config')
  const paths = require('../config/paths')
  const {
    router,
    gendUrl,
    getRenderInfo
  } = require(buildFilePath)

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


  const [columns, articles] = await Promise.all([
    getColumnList(),
    getArticles()
  ])
  const articleRoute = router.find(({name}) => name === 'article')
  const otherRouter = router.filter(({name}) => name !== 'article')
  const genPageData = (path, data) => 
    getRenderInfo(path, data)
      .then(({html, title}) => ({ path, html, data, title}))

  const pages = await Promise.all([
    ...otherRouter.map(route => genPageData(route.path, { columns })),
    ...articles.map(article => 
      genPageData(
        gendUrl(articleRoute.path, article), 
        { [`article/${article.id}`]: article }
      )
    )
  ])

  await Promise.all(
    pages.map(({path: localPath, html, data, title}) => {
      console.log(`正在生成${localPath}`)
      return fs.outputFile(
        path.resolve(config.output, localPath.substr(1), './index.html'),
        template.replace(
          /<div\s+id=["|']root["|']\s*>\s*<\/div>/,
          `<div id="root">${html}</div>
          <script>var globalState = ${JSON.stringify(data)}</script>`
        ).replace(
          /<title.*>.*<\/title>/,
          `<title>${title}</title>`
        )
      )
    })
  )

  process.exit(0)
}


if (process.argv[2] === 'clear') {
  if (fs.existsSync(buildPath)) {
    fs.removeSync(buildPath)
  }
} else {
  main()
}