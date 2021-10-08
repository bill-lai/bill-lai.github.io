// -------------文章----------------
export const getArticle = process.env.getArticleApi as 'getArticle'

// -------------类别-----------------
export const getColumnList = process.env.getColumnListApi as 'getColumnList'


// 获取用户信息
export const getUserInfo = `https://api.github.com/user`

// 信息认证
export const authorize = `https://github.com/login/oauth/authorize`

// 获取token
export const getToken = `https://cors-anywhere.azm.workers.dev/https://github.com/login/oauth/access_token`

// -------------评论-------------------

// 创建评论
export const postComment = `https://api.github.com/repos/:owner/:repo/issues` as 'postComment'
// 拉取评论
export const getComment = `https://api.github.com/repos/:owner/:repo/issues` as 'getComment'