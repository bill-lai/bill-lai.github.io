

const genPages = () => {
  require('ignore-styles')
  process.env.BABEL_ENV = 'development';
  process.env.NODE_ENV = 'development';

  const configFactory = require('../config/webpack.config');
  const config = configFactory(process.env.NODE_ENV)
  const enter = "../server/ssr-enter"

  require('babel-preset-react-app')
  require('@babel/register')({
    extensions: ['.js', '.mjs', '.jsx', '.ts', '.tsx'],
    ignore: [/\/(node_modules)\//],
    presets: [require.resolve('babel-preset-react-app')],
    root: enter,
    plugins: [
      '@babel/plugin-syntax-dynamic-import',
      'dynamic-import-node',
      [
        'module-resolver', 
        {
          root: ['../source'],
          alias: config.resolve.alias
        }
      ]
    ],
    cache: true
  })


  return require(enter).default()
}

const collection = require('../server/collection')

;(async () => {
  let code = 0

  try {
    await collection.collData()
    await genPages()
    console.log('文章数据生成成功！')
  } catch (e) {
    console.error('文章生成失败错误信息：', e)
    code = -1
  }

  process.exit(code)
})();