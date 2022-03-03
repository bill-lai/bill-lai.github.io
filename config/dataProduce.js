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
  getColumnListApi: `/${outputColumnDir}/${outputDataFileName}.${suffix}`,
  
  clientId: 'dbac9f422a3f03c121f1',
  clientSecret: '26a67f075778cac68d6d2fc7e4e5086519745009',
  redirectUri: 'https://bill-lai.github.io/auth',
  owner: `bill-lai`,
  repo: `bill-lai.github.io`,
  issuesLabel: `bill-lai-blog`,
  token: `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`
}
