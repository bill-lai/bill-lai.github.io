// -------------文章----------------
export const getArticle = `/${process.env.outputArticleDir}/:id/${process.env.outputDataFileName}.${process.env.suffix}` as 'getArticle'

// -------------类别-----------------
export const getColumnList = `/${process.env.outputColumnDir}/${process.env.outputDataFileName}.${process.env.suffix}` as 'getColumnList'

// -------------评论-------------------
export const getComment = `c`

console.log(process.env)