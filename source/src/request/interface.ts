import {
  getArticle,
  getColumnList,
  getUserInfo,
  getToken
} from './config'

import {
  Article,
  ColumnList
} from './model'

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
  },
  [getToken]: {
    method: 'POST',
    data: {
      client_id: string,
      client_secret: string,
      code: string
    },
    response: string
  }
}

export default Interface