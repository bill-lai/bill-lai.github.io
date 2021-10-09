import { Reactions } from '.'
import {
  getArticle,
  getColumnList,
  getUserInfo,
  getToken,
  postComment,
  getComment,
  getArticleReactions
} from './config'

import {
  Article,
  ColumnList,
  UserInfo,
  CommitList
} from './model'

type GitHubBaseReq = {
  params: {
    owner: string,
    repo: string,
  }
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
      creator: string,
      labels: string
    },
    response: CommitList
  },
  [postComment]: GitHubBaseReq & {
    method: 'POST',
    data: {
      body: string,
      labels: Array<string>
    }
  },
  [getArticleReactions]: GitHubBaseReq & {
    method: 'GET',
    params: {
      id: number
    },
    response: Reactions
  }
}

export default Interface