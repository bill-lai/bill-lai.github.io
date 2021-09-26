import * as React from 'react'
import style from './style.module.scss'
import { axios, config, Article } from 'src/request'
import { useParams } from 'react-router-dom'
import ContentLayer from 'src/components/content-layer'
import { analysisMarked, MarledNavs } from 'src/util'
import './marked.scss'
import { Navigation, Navs } from 'src/components/navigation'

type NavItem = {
  title: string,
  id: string,
  children: Array<NavItem>
}

const navsToDirs = (navs: MarledNavs): Navs<NavItem> => {
  return navs.map(item => ({
    title: item.title,
    id: item.title.toLowerCase(),
    children: navsToDirs(item.children)
  }))
}

const GetArticleState = () => {
  const [markedData, setMarkedData] = React.useState<{ html: string, dirs: Navs<NavItem> } | null>(null)
  const [article, setArticle] = React.useState<Article | null>(null)
  const { id } = useParams() as { id: 'string' }

  React.useEffect(() => {
    axios.get(config.getArticle, { params: { id: Number(id) } })
      .then(article => {
        const { html, navs } = analysisMarked(article.body)

        setArticle(article)
        setMarkedData({
          html: html,
          dirs: navsToDirs(navs)
        })
      })
  }, [ id ])

  return {
    markedData,
    article
  }
}

const ArticleInfo = () => {
  const { article, markedData } = GetArticleState()
  const [active, setActive] = React.useState<NavItem | null>(null)

  if (!article || !markedData) return null;
  
  return (
    <ContentLayer 
      main={ 
        <React.Fragment>
          <h1 className="main-title">
            {article.title}
            <span className="marker">{article.time.toString()}</span>
          </h1>
          <div 
            className="article-body" 
            dangerouslySetInnerHTML={{__html: markedData.html}} 
          />
        </React.Fragment>
       }
      right={ 
        <Navigation
          className="navigation"
          title="文章列表"
          active={active}
          list={markedData.dirs}
          onClick={
            (dir) => {
              dir && (window.location.hash = dir.id.toString())
              setActive(dir)
            }
          }
        />
      }
    />
  )
}

export default ArticleInfo
