import * as React from 'react'
import style from './style.module.scss'
import { Column } from 'src/request'
import { Link } from 'react-router-dom'
import { witchParentClass, WitchParentAttachProps } from 'src/hoc'


function ColumnItem(props: Column & WitchParentAttachProps) {
  const articles = props.articles.map(({title, id, time}, i) =>(
    <li key={i}>
      <Link to={id.toString()}>{title}</Link>
      <span>{time.toUTCString()}</span>
    </li>
  ))

  return (
    <div className={props.className + style.layer}>
      <h2 className={style.title}>{props.title}</h2>
      { props.desc && <p className={style.desc}>{props.desc}</p>  }
      <ul className={style['articles']}>
        { articles }
      </ul>
    </div>
  )
}

export default witchParentClass(ColumnItem)