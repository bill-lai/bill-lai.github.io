import {
  getArticle,
  getColumnList,
  getUserInfo,
  getToken,
  postComment,
  getComment,
  getArticleReactions,
  addArticleReaction,
  delArticleReaction,
  authorize
} from './config'

import {
  Article,
  ColumnList,
  UserInfo,
  CommentList,
  Reaction,
  Reactions,
  ReactionContent
} from './model'

import {
  ExtractInterfacesURL,
  ExtractInterfacesMethodURL,
} from './setup'

type GitHubBaseReq = {
  params: {
    owner: string,
    repo: string,
  }
}

type GithubReactionBaseReq = GitHubBaseReq & {
  params: { id: number }
}

export type Interfaces = {
  GET: [
    {
      url: typeof getArticle,
      params: { id: string },
      response: Article
    },
    {
      url: typeof getColumnList,
      response: ColumnList
    },
    {
      url: typeof getUserInfo,
      response: UserInfo,
      headers: { Authorization: string }
    },
    {
      url: typeof authorize,
      params: {
        client_id: string,
        redirect_uri: string,
        scope: string
      }
    },
    GitHubBaseReq & {
      url: typeof getComment,
      params: { labels: string },
      response: CommentList
    },
    GithubReactionBaseReq & {
      url: typeof getArticleReactions,
      response: Reactions
    },
  ],
  POST: [
    {
      url: typeof getToken,
      data: {
        client_id: string,
        client_secret: string,
        code: string
      },
      response: string
    },
    GitHubBaseReq & {
      url: typeof postComment,
      data: {
        body: string,
        labels: Array<string>
      }
    },
    GithubReactionBaseReq & {
      url: typeof addArticleReaction,
      data: {
        content: ReactionContent
      },
      response: Reaction,
      headers: { Authorization: string }
    },
  ],
  DELETE: [
    GithubReactionBaseReq & {
      url: typeof delArticleReaction,
      method: 'DELETE',
      params: {
        reactionId: number
      },
      headers: { Authorization: string }
    }
  ]
}



export type URL = ExtractInterfacesURL<Interfaces>
export type MethodURL<Method  extends keyof Interfaces> = 
  ExtractInterfacesMethodURL<Interfaces, Method>
  
export default Interfaces