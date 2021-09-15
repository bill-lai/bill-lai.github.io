import { Columns } from 'src/request'
import ColumnItem from '../column-item'
import style from './style.module.scss'
import * as React from 'react'

type ThemeProps = {
  title: string,
  desc: string,
  className?: string,
  columns: Columns
}

function Theme({ 
  columns, 
  title, 
  desc,
  className = '',
}: ThemeProps) {

  return (
    <div className={`${className} ${style.layer}`}>
      <h1 className={style.title}>{title}</h1>
      <p className={style.desc}>{desc}</p>
      <div className={style.columns}>
        {columns.map((item, i) => <ColumnItem key={i} {...item} />)}
      </div>
    </div>
  )
}

export default Theme