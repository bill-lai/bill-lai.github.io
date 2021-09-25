import * as React from 'react'
import { axios, config, ArticleBase} from 'src/request'
import Layer from 'src/components/content-layer'
import style from './style.module.scss'
import { Link } from 'react-router-dom'


function Home() {
  const [articles, setArticles] = React.useState<Array<ArticleBase>>([])

  React.useEffect(() => {
    axios.get(config.getColumnList)
      .then(columns => {
        setArticles(
          columns.reduce(
            (t:Array<ArticleBase>, column) => t.concat(column.articles), 
            []
          )
        )
      })
  }, [])

  const main = articles.map(item => (
    <div key={item.id} className={style.layer}>
      <h2 className={`main-title ${style.title}`}>
        <Link to={item.id.toString()}>{item.title}</Link>
        <span className="marker">{item.time.toString()}</span>
      </h2>
      <p className="desc">{item.desc}</p>
      <Link to={item.id.toString()}>继续阅读 »</Link>
    </div>
  ))

  
  return <Layer
    main={
      <React.Fragment>{main}</React.Fragment>
    }
  />
}

export default Home