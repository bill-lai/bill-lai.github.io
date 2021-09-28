import {
  getArticle,
  getColumnList
} from './config'

import {
  Article,
  ColumnList
} from './model'

type Interface = {
  [getArticle]: {
    method: 'GET',
    params: { id: number },
    response: Article
  },
  [getColumnList]: {
    method: 'GET',
    response: ColumnList
  }
}

export default Interface