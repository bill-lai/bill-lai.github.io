process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const path = require('path')
const nodeExternals = require('webpack-node-externals')
const configFactory = require('../config/webpack.config');
const baseConfig = configFactory('production')

const rules = baseConfig.module.rules[1].oneOf
rules.splice(2, 2)

const config = {
  // ...configFactory('production'),
  resolve: baseConfig.resolve,
  resolveLoader: baseConfig.resolveLoader,
  target: 'node',
  externals: [nodeExternals()],
  entry: path.resolve(__dirname, '../source/src/server.tsx'),
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/',
    filename: 'server.js',
    library: 'app',
    libraryTarget: 'commonjs2'
  },
  // module: baseConfig.module,
  module: {
    rules: [
      baseConfig.module.rules[0],
      {
        oneOf: [
          ...rules,
          {
            test: /\.(js|mjs|jsx|ts|tsx)$/,
            loader: require.resolve('babel-loader')
          }
        ]
      }
    ]
  },
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
webpack(config).run((err, stats) => {
  console.error(err, stats)
})