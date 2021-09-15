import {
  getArticle,
  getColumn
} from './config'

import {
  Article,
  Column
} from './model'

type Interface = {
  [getArticle]: {
    method: 'GET',
    params: { id: number },
    response: Article
  },
  [getColumn]: {
    method: 'GET',
    params: { id: number },
    data: Column
  }
}

export default Interface