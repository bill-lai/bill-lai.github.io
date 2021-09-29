const outputDataFileName = 'config'
const outputArticleDir = 'article'
const outputColumnDir = 'column'
const suffix = 'json'
const paramKey = 'id'

const getArticleStatic = `/${outputArticleDir}/:${paramKey}`


module.exports = {
  outputDataFileName,
  outputArticleDir,
  outputColumnDir,
  suffix,
  paramKey,
  getArticleStatic,
  getArticleApi: `${getArticleStatic}/${outputDataFileName}.${suffix}`,
  getColumnApi: `/${outputColumnDir}/:${paramKey}/${outputDataFileName}.${suffix}`,
  getColumnListApi: `/${outputColumnDir}/${outputDataFileName}.${suffix}` 
}