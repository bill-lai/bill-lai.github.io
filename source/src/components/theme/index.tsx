import * as React from 'react'
import ColumnItem from '../column-item'
import style from './style.module.scss'
import { Columns } from 'src/request'
import Layer from '../content-layer'
import Navigation, { navArgs } from '../navigation'
import { withScreenShow } from 'src/hoc/index'

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
  const clickNav = (column: navArgs<Columns[0]>) => {
    if (column) {
      window.location.hash = column.id.toString()
    }
    setActive(column)
  }
  const columnShowChange = (isShow: boolean) => {

  }

  return (
    <Layer 
      main={
        <React.Fragment>
          <h1 className={style.title}>{title}</h1>
          <p className={style.desc}>{desc}</p>
          <div className={style.columns}>
            {columns.map((item, i) => <ScrollColumnItem onShowChange={columnShowChange} key={i} {...item} />)}
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