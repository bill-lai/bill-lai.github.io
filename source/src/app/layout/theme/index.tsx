import * as React from 'react'
import ColumnItem from 'src/components/column-item'
import style from './style.module.scss'
import { Columns } from 'src/request'
import Layer from '../content'
import Navigation from 'src/components/navigation'
import { withScreenShow } from 'src/hoc/index'
import { debounce } from 'src/util'

const ScrollColumnItem = withScreenShow(ColumnItem)

type ThemeProps = {
  title: string,
  desc: string,
  columns: Columns
}

export const ScrollGroupMange = <T extends object>() => {
  const [active, setActive] = React.useState<T | null>(null)
  
  const scrollShowColumns: Array<T> = []

  React.useEffect(() => () => {
    scrollShowColumns.length = 0
  })

  const setShowColumnsActive = debounce(() => {
    if (scrollShowColumns.length && (!active || !scrollShowColumns.includes(active))) {
      setActive(scrollShowColumns[0])
    }
  })
  
  const columnShowChange = (column: T, isShow: boolean) => {
    let index = scrollShowColumns.indexOf(column)
    if (index === -1 && isShow) {
      scrollShowColumns.push(column)
    } else if (index > -1 && !isShow) {
      scrollShowColumns.splice(index, 1)
    }
    setShowColumnsActive()
  }

  return {
    active,
    setActive,
    columnShowChange
  }
}


export function Theme({ 
  columns, 
  title, 
  desc
}: ThemeProps) {
  const { active, setActive, columnShowChange } = ScrollGroupMange<Columns[0]>()

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
          <h1 className="main-title">{title}</h1>
          <p className="desc">{desc}</p>
          <div className={style.columns}>
            {columnEles}
          </div>
        </React.Fragment>
      }
      right={
        <Navigation
          className="navigation"
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