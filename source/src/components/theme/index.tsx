import * as React from 'react'
import ColumnItem from '../column-item'
import style from './style.module.scss'
import { Columns } from 'src/request'
import Navigation, { NavigationProps } from '../navigation'


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
  const [testColumns] = React.useState<NavigationProps<Columns[0]>['list']>(() => columns.map(item => {
    return {
      ...item,
      children: JSON.parse(JSON.stringify(columns)).map((item: NavigationProps<Columns[0]>['list']) => {
        return {
          ...item,
          children: JSON.parse(JSON.stringify(columns))
        }
      })
    }
  }))

  return (
    <React.Fragment>
      <div className={`${style.layer}`}>
        <h1 className={style.title}>{title}</h1>
        <p className={style.desc}>{desc}</p>
        <div className={style.columns}>
          {columns.map((item, i) => <ColumnItem key={i} {...item} />)}
        </div>
      </div>
      <Navigation
        title={`${title}列表`}
        active={active}
        list={testColumns}
        onClick={setActive}
      />
    </React.Fragment>
  )
}

export default Theme