import * as React from 'react'
import ColumnItem from '../column-item'
import style from './style.module.scss'
import { Columns } from 'src/request'
import Layer from '../content-layer'
import Navigation, { navArgs } from '../navigation'
import { withScreenShow, WithScreenRef } from 'src/hoc/index'

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
  let isRunSetActive = false
  const columnRefs: Array<WithScreenRef> = []
  const scrollShowColumns: Columns = []
  const [active, setActive] = React.useState<Columns[0] | null>(null)
  const clickNav = (column: navArgs<Columns[0]>) => {
    if (column) {
      window.location.hash = column.id.toString()
    }
    setActive(column)
  }
  const columnShowChange = (column: Columns[0], isShow: boolean) => {
    let index = scrollShowColumns.indexOf(column)
    if (index === -1 && isShow) {
      scrollShowColumns.push(column)
    } else if (index > -1 && !isShow) {
      scrollShowColumns.splice(index, 1)
    }

    if (!isRunSetActive && column !== active) {
      isRunSetActive = true
      Promise.resolve().then(() => setActive(column))
    }
  }
  const columnEles = columns.map((item, i) => {
    const ref: WithScreenRef = React.createRef()
    columnRefs[i] = ref

    return <ScrollColumnItem 
      onShowChange={(isShow) => columnShowChange(item, isShow)} 
      forwardRef={ref}
      key={i} 
      {...item} 
    />
  })

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
          title={`${title}列表`}
          active={active}
          list={columns}
          onClick={clickNav}
        />
      }
    />
  )
}

export default Theme