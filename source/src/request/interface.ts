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
  ExtractInterfacesURLS,
  ExtractInterfacesMethodURLS,
  ExtractInterface
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

type Interface = {
  [getArticle]: {
    method: 'GET',
    params: { id: string },
    response: Article
  },
  [getColumnList]: {
    method: 'GET',
    response: ColumnList
  },
  [getUserInfo]: {
    method: 'GET',
    response: UserInfo
  },
  [getToken]: {
    method: 'POST',
    data: {
      client_id: string,
      client_secret: string,
      code: string
    },
    response: string
  },
  [getComment]: GitHubBaseReq & {
    method: 'GET',
    params: {
      labels: string
    },
    response: CommentList
  },
  [postComment]: GitHubBaseReq & {
    method: 'POST',
    data: {
      body: string,
      labels: Array<string>
    }
  },
  [getArticleReactions]: GithubReactionBaseReq & {
    method: 'GET',
    response: Reactions
  },
  [addArticleReaction]: GithubReactionBaseReq & {
    method: 'POST',
    data: {
      content: ReactionContent
    },
    response: Reaction
  },
  [delArticleReaction]: GithubReactionBaseReq & {
    method: 'DELETE',
    params: {
      reactionId: number
    }
  }
}

export type _Interfaces = {
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
      response: UserInfo
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
      response: Reaction
    },
  ],
  DELETE: [
    GithubReactionBaseReq & {
      url: typeof delArticleReaction,
      method: 'DELETE',
      params: {
        reactionId: number
      }
    }
  ]
}

export type URLS = ExtractInterfacesURLS<_Interfaces>
export type MethodURLS<Method  extends keyof _Interfaces> = 
  ExtractInterfacesMethodURLS<_Interfaces, Method>
  
export default Interface