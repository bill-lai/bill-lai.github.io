import * as React from 'react'
import { axios, config, ArticleBase } from 'src/request'
import Layer from 'src/components/content-layer'
import style from './style.module.scss'
import { Link } from 'react-router-dom'
import { queryRoutePath } from 'src/router'
import Navigation from 'src/components/navigation'
import { ScrollGroupMange } from 'src/components/theme'
import { withScreenShow } from 'src/hoc'
import { useGlobalState } from 'src/state'
import app from 'src/platform'

const ArticleItem = withScreenShow((props: ArticleBase) => {
  return (
    <div className={style.layer}>
      <h2 className={`main-title ${style.title}`} id={props.id.toString()}>
        <Link to={queryRoutePath('article', {id: props.id})}>{props.title}</Link>
        <span className="marker">{new Date(props.mtime).toString()}</span>
      </h2>
      <p className="desc">{props.desc}</p>
      <Link className="wlink" to={queryRoutePath('article', {id: props.id})}>继续阅读 »</Link>
    </div>
  )
})

const Home = () => {
  const {
    active,
    setActive,
    columnShowChange
  } = ScrollGroupMange<ArticleBase>()

  const [articles] = useGlobalState(
    'columns', 
    () => axios.get(config.getColumnList),
    columns => 
      columns.reduce(
        (t:Array<ArticleBase>, column) => t.concat(column.articles), 
        []
      ),
    [],
  )

  const main = articles.map(item => (
    <ArticleItem 
      key={item.id} 
      { ...item } 
      onShowChange={(isShow) => columnShowChange(item, isShow)}  
    />
  ));

  app.setAppTitle('')
  
  return <Layer
    main={
      <React.Fragment>{main}</React.Fragment>
    }
    right={
      <Navigation
        className="navigation"
        title="文章列表"
        active={active}
        list={articles}
        onClick={
          (article) => {
            article && (window.location.hash = article.id.toString())
            setActive(article)
          }
        }
      />
    }
  />
}

export default Home