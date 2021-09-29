const path = require('path')
const paths = require('../config/paths')
const base = require('../config/dataProduce')

const output = paths.appBuild
const describe = `${base.outputDataFileName}.${base.suffix}`

// 排除解析文件
module.exports = {
  ...base,
  enter: path.resolve(__dirname, '../article'),
  main: 'README.md',
  // 可引用模板key
  templates: ['head', 'foot'],

  describe,
  fileCache: false,
  
  output,
  copyExclude: new RegExp(`.*(.md|${describe})$`)


}