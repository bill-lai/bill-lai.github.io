import * as React from 'react'
import style from './style.module.scss'
import { Column } from 'src/request'
import { Link } from 'react-router-dom'
import { witchParentClass } from 'src/hoc'
import { queryRoutePath } from 'src/router'
import { formatDate } from 'src/util'


function ColumnItem(props: Column) {
  const articles = props.articles.map(({title, id, mtime}, i) =>(
    <li key={i}>
      <Link className="wlink" to={queryRoutePath('article', { id })}>{title}</Link>
      <span className="marker">{formatDate(new Date(mtime))}</span>
    </li>
  ))

  return (
    <div className={style.layer}>
      <h2 className="vice-title" id={`${props.id}`}>{props.title}</h2>
      { props.desc && <p className="desc">{props.desc}</p>  }
      <ul className={style['articles']}>
        { articles }
      </ul>
    </div>
  )
}

export default witchParentClass(ColumnItem)