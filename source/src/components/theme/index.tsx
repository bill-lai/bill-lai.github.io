import * as React from 'react'
import ColumnItem from '../column-item'
import style from './style.module.scss'
import { Columns } from 'src/request'
import Layer from '../content-layer'
import Navigation from '../navigation'
import { withScreenShow } from 'src/hoc/index'
import { debounce } from 'src/util'

const ScrollColumnItem = withScreenShow(ColumnItem)

type ThemeProps = {
  title: string,
  desc: string,
  columns: Columns
}

function Theme({ 
  columns, 
  title, 
  desc
}: ThemeProps) {
  const [active, setActive] = React.useState<Columns[0] | null>(null)

  const scrollShowColumns: Columns = []
  React.useEffect(() => () => {
    scrollShowColumns.length = 0
  })
  const setShowColumnsActive = debounce(() => {
    if (scrollShowColumns.length && (!active || !scrollShowColumns.includes(active))) {
      setActive(scrollShowColumns[0])
    }
  })
  const columnShowChange = (column: Columns[0], isShow: boolean) => {
    let index = scrollShowColumns.indexOf(column)
    if (index === -1 && isShow) {
      scrollShowColumns.push(column)
    } else if (index > -1 && !isShow) {
      scrollShowColumns.splice(index, 1)
    }
    setShowColumnsActive()
  }
  const columnEles = columns.map((item, i) => 
    <ScrollColumnItem 
      onShowChange={(isShow) => columnShowChange(item, isShow)} 
      key={i} 
      {...item} 
    />
  )

  return (
    <Layer 
      main={
        <React.Fragment>
          <h1 className={style.title}>{title}</h1>
          <p className={style.desc}>{desc}</p>
          <div className={style.columns}>
            {columnEles}
          </div>
        </React.Fragment>
      }
      right={
        <Navigation
          className={style.navigation}
          title={`${title}列表`}
          active={active}
          list={columns}
          onClick={
            (column) => {
              column && (window.location.hash = column.id.toString())
              setActive(column)
            }
          }
        />
      }
    />
  )
}

export default Theme