import * as React from 'react'
import style from './style.module.scss'
import { Column } from 'src/request'
import { Link } from 'react-router-dom'
import { witchParentClass } from 'src/hoc'


function ColumnItem(props: Column) {
  const articles = props.articles.map(({title, id, time}, i) =>(
    <li key={i}>
      <Link to={id.toString()}>{title}</Link>
      <span>{time.toUTCString()}</span>
    </li>
  ))

  return (
    <div className={style.layer}>
      <h2 className={style.title} id={`${props.id}`}>{props.title}</h2>
      { props.desc && <p className={style.desc}>{props.desc}</p>  }
      <ul className={style['articles']}>
        { articles }
      </ul>
    </div>
  )
}

export default witchParentClass(ColumnItem)