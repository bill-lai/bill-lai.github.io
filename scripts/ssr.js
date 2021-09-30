require('ignore-styles')

process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

const configFactory = require('../config/webpack.config');
const config = configFactory(process.env.NODE_ENV)
const enter = "../server/ssr-enter"


require('@babel/register')({
  extensions: ['.js', '.mjs', '.jsx', '.ts', '.tsx'],
  ignore: [/\/(build|node_modules)\//],
  presets: [require.resolve('babel-preset-react-app')],
  root: enter,
  plugins: [
    '@babel/plugin-syntax-dynamic-import',
    'dynamic-import-node',
    [
      'module-resolver', 
      {
        root: ['../source/src'],
        alias: config.resolve.alias
      }
    ]
  ],
})


require(enter)