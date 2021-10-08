import {
  getArticle,
  getColumnList,
  getUserInfo,
  getToken,
  postComment,
  getComment
} from './config'

import {
  Article,
  ColumnList,
  UserInfo,
  CommitList
} from './model'

type ComponentBaseReq = {
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
  [getComment]: ComponentBaseReq & {
    method: 'GET',
    params: {
      creator: string,
      labels: string
    },
    response: CommitList
  },
  [postComment]: ComponentBaseReq & {
    method: 'POST',
    data: {
      body: string,
      labels: Array<string>
    }
  },
}

export default Interface