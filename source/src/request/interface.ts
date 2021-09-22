import {
  getArticle,
  getColumn,
  getColumnList
} from './config'

import {
  Article,
  Column,
  ColumnList
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
    response: Column
  },
  [getColumnList]: {
    method: 'GET',
    response: ColumnList
  }
}

export default Interface