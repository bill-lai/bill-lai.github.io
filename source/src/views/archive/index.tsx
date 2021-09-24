import Theme from 'src/components/theme'
import * as React from 'react'
import { axios, config, ColumnList} from 'src/request'

function Special() {
  const [columns, setColumns] = React.useState<ColumnList>([])

  React.useEffect(() => {
    axios.get(config.getColumnList)
      .then(setColumns)
  }, [columns])

  return (
    <Theme 
      title="专题"
      desc="博客写了这么多年，数量一直没上去。大部分时候遇上有意思的东西，研究明白之后只是多了几篇收藏，或者是 Evernote 里多了几段零散的记录，又或者是电脑某个文件夹多了几个 Demo 文件。很难再有耐心和精力把整个过程记录一遍。这里把本站部分文章以专题的形式整理出来，一方面方便新同学阅读，另一方面也希望借此激励自己：能在这个浮躁的时代，坚持阅读和写作。"
      columns={columns}
    />
  )
}

export default Special