import * as React from 'react'
import { axios, config, Article, ArticleDirs } from 'src/request'
import { useParams } from 'react-router-dom'
import ContentLayer from 'src/components/content-layer'
import { debounce } from 'src/util'
import './marked.scss'
import { Navigation, Navs } from 'src/components/navigation'
import { withScreenShow } from 'src/hoc'

type NavItem = {
  title: string,
  id: string,
  children: Array<NavItem>
}

const navsToDirs = (navs: ArticleDirs): Navs<NavItem> => {
  return navs.map(item => ({
    title: item.title,
    id: item.title.toLowerCase(),
    children: navsToDirs(item.children)
  }))
}
const findDir = (dirs: Array<NavItem>, title: string): NavItem | null => {
  for (let dir of dirs) {
    if (dir.title === title) {
      return dir
    } else {
      const cdir = findDir(dir.children, title)
      if (cdir) {
        return cdir
      }
    }
  }
  return null
}

const GetArticleState = () => {
  const [markedData, setMarkedData] = React.useState<{ html: string, dirs: Navs<NavItem> } | null>(null)
  const [article, setArticle] = React.useState<Article | null>(null)
  const { id } = useParams() as { id: 'string' }

  React.useEffect(() => {
    axios.get(config.getArticle, { params: { id } })
      .then(article => {
        setArticle(article)
        setMarkedData({
          html: article.body,
          dirs: navsToDirs(article.dirs)
        })
      })
  }, [ id ])

  return {
    markedData,
    article
  }
}

const MarkerBody = withScreenShow(({html}: { html: string }) => 
  <div 
    className="article-body" 
    dangerouslySetInnerHTML={{__html: html}} 
  />
)

const ArticleInfo = () => {
  const { article, markedData } = GetArticleState()
  const [ active, setActive ] = React.useState<NavItem | null>(null)
  let isDestroy = false

  React.useEffect(() => () => {
    isDestroy = true
  })

  if (!article || !markedData) return null;
  
  const showTitleEls: Array<HTMLElement> = []
  const scrollChangeActive = debounce(() => {
    if (showTitleEls.length) {
      const title = showTitleEls[0].textContent
      const item = title && findDir(markedData.dirs, title)
      !isDestroy && item && setActive(item)
      showTitleEls.length = 0
    }
  })

  const titleShowScreenChange = (isShow: boolean, dom: HTMLElement) => {
    if (isShow) {
      showTitleEls.push(dom)
    } else {
      const index = showTitleEls.indexOf(dom)
      index > -1 && showTitleEls.splice(index, 1)
    }
    scrollChangeActive()
  }


  return (
    <ContentLayer 
      main={ 
        <React.Fragment>
          <h1 className="main-title">
            {article.title}
            <span className="marker">{new Date(article.mtime).toString()}</span>
          </h1>
          <MarkerBody 
            html={markedData.html}
            selector="h2,h3"
            onShowChange={titleShowScreenChange}
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
