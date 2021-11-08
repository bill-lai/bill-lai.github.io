// -------------文章----------------
export const article = process.env.getArticleApi as 'getArticle'

// -------------类别-----------------
export const columns = process.env.getColumnListApi as 'getColumnList'


// ------------获取用户信息--------------
// 获取用户信息
export const userInfo = `https://api.github.com/user`
// 信息认证
export const authorize = `https://github.com/login/oauth/authorize`
// 获取token
export const token = `https://cors-anywhere.azm.workers.dev/https://github.com/login/oauth/access_token`


// --------------文章互动-------------------
// 文章互动数据
export const articleReactions = `https://api.github.com/repos/:owner/:repo/issues/:id/reactions`
// 删除文章互动数据
export const articleReaction = `https://api.github.com/repos/:owner/:repo/issues/:id/reactions/:reactionId`




// -------------评论-------------------
// 评论数据
export const comments = `https://api.github.com/repos/:owner/:repo/issues/:issuesId/comments`
export const comment = `https://api.github.com/repos/:owner/:repo/issues/comments/:commentId`


// -------------评论互动----------------
// 评论互动数据
export const commentReactions = `https://api.github.com/repos/:owner/:repo/issues/comments/:id/reactions`
// 删除评论互动数据
export const commentReaction = `https://api.github.com/repos/:owner/:repo/issues/comments/:id/reactions/:reactionId`