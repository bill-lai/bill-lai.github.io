import Theme from 'src/app/layout/theme'
import * as React from 'react'
import { axios, config } from 'src/request'
import { useGlobalState } from 'src/state'
import app from 'src/platform'

function Special() {
  const [columns] = useGlobalState(
    'columns', 
    () => axios.get(config.columns),
    []
  )
  columns.forEach(column => {
    column.articles.sort((a, b) => b.mtime - a.mtime)
  })
  const title = `专题`

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