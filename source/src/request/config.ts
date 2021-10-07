// -------------文章----------------
export const getArticle = process.env.getArticleApi as 'getArticle'

// -------------类别-----------------
export const getColumnList = process.env.getColumnListApi as 'getColumnList'

// -------------评论-------------------
export const getComment = `c`

// 获取用户信息
export const getUserInfo = `https://api.github.com/user`

// 信息认证
export const authorize = `https://github.com/login/oauth/authorize`


export const getToken = `https://cors-anywhere.azm.workers.dev/https://github.com/login/oauth/access_token`