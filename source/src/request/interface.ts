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
    params: { id: string },
    response: Article
  },
  [getColumnList]: {
    method: 'GET',
    response: ColumnList
  }
}

export default Interface