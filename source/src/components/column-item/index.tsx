import * as React from 'react'
import * as style from './style.module.scss'
import { Link } from 'react-router-dom'
import { ArticleSimpleType } from '../article-item'

export interface ColumnType {
  id: number,
  title: string,
  desc?: string,
  articles: Array<ArticleSimpleType>
}

type ColumnItemProp = {
  className?: string
} & ColumnType


function ColumnItem(props: ColumnItemProp) {
  const articles = props.articles.map(({title, link, time}, i) =>(
    <li className={style['article-item']} key={i}>
      <Link to={link}>{title}</Link>
      <span>{time}</span>
    </li>
  ))

  return (
    <div className={style.layer}>
      <h2 className={style.title}>{props.title}</h2>
      { props.desc && <p>{props.desc}</p>  }
      <ul>
        { articles }
      </ul>
    </div>
  )
}

export default ColumnItem