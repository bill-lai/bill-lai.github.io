import Theme from 'src/app/layout/theme'
import * as React from 'react'
import { axios, config, ColumnList} from 'src/request'
import { useGlobalState } from 'src/state'
import app from 'src/platform'


function Special() {
  const [columns] = useGlobalState(
    'columns', 
    () => axios.get(config.columns),
    columns => {
      const yearColumns: ColumnList = []
      for (const column of columns) {
        for (const article of column.articles) {
          const ident = new Date(article.mtime).getFullYear().toString()
          const yearColumn = yearColumns.find(({id}) => id === ident)

          if (yearColumn) {
            yearColumn.articles.push(article)
          } else {
            yearColumns.push({
              id: ident,
              title: `${ident}年`,
              articles: [article]
            })
          }
        }
      }
      yearColumns.forEach(column => {
        column.articles.sort((a, b) => b.mtime - a.mtime)
      })
      return yearColumns
    },
    [],
  )
  const title = `归档`

  app.setAppTitle(title)

  return (
    <Theme 
      title={title}
      desc=""
      columns={columns}
    />
  )
}

export default Special