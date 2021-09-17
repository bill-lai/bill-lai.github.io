import * as React from 'react'
import ColumnItem from '../column-item'
import style from './style.module.scss'
import { Columns } from 'src/request'
import Navigation from '../navigation'


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
        list={[ { title: '123', age: 18 } ]}
        onClick={item => console.log(item.age)}
      />
    </React.Fragment>
  )
}

export default Theme