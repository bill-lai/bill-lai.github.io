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
      return yearColumns
    },
    [],
  )
  const title = `归档`

  app.setAppTitle(title)

  return (
    <Theme 
      title={title}
      desc="博客写了这么多年，数量一直没上去。大部分时候遇上有意思的东西，研究明白之后只是多了几篇收藏，或者是 Evernote 里多了几段零散的记录，又或者是电脑某个文件夹多了几个 Demo 文件。很难再有耐心和精力把整个过程记录一遍。这里把本站部分文章以专题的形式整理出来，一方面方便新同学阅读，另一方面也希望借此激励自己：能在这个浮躁的时代，坚持阅读和写作。"
      columns={columns}
    />
  )
}

export default Special