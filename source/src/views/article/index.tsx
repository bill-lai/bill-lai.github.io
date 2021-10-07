import * as React from 'react'
import { axios, config, ArticleDirs, ArticleTemp, githubApi } from 'src/request'
import { useParams } from 'react-router-dom'
import ContentLayer from 'src/components/content-layer'
import { debounce } from 'src/util'
import './marked.scss'
import { Navigation, Navs } from 'src/components/navigation'
import { withScreenShow } from 'src/hoc'
import { useGlobalState } from 'src/state'
import app from 'src/platform'

// githubApi.getUserInfo()

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

const MarkerBody = withScreenShow(({html}: { html: string }) => 
  <div 
    className="article-body" 
    dangerouslySetInnerHTML={{__html: html}} 
  />
)

const ArticleInfo = () => {
  const { id } = useParams() as { id: 'string' }
  const [ article ] = useGlobalState(
    `article/${id}`,
    () => axios.get(config.getArticle, { params: { id } }),
    article => {
      let html = ''
      let dirs: Navs<NavItem> = []
  
      const joinTemp = (temp: ArticleTemp) => {
        if (temp) {
          html += temp.body
          dirs.push(...navsToDirs(temp.dirs))
        }
      }
  
      joinTemp(article.head)
      joinTemp(article)
      joinTemp(article.foot)
  
      return {
        ...article,
        html, 
        dirs
      }
    }
  )
  const [ active, setActive ] = React.useState<NavItem | null>(null)
  
  let isDestroy = false
  React.useEffect(() => () => {
    isDestroy = true
  })

  if (!article) return null;
  
  const showTitleEls: Array<HTMLElement> = []
  const scrollChangeActive = debounce(() => {
    if (showTitleEls.length) {
      const title = showTitleEls[0].textContent
      const item = title && findDir(article.dirs, title)
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

  app.setAppTitle(article.title)

  return (
    <ContentLayer 
      main={ 
        <React.Fragment>
          <h1 className="main-title">
            {article.title}
            <span className="marker">{new Date(article.mtime).toString()}</span>
          </h1>
          <MarkerBody 
            html={article.html}
            selector="h2,h3"
            onShowChange={titleShowScreenChange}
          />
        </React.Fragment>
       }
      right={ 
        <Navigation
          className="navigation"
          title="目录列表"
          active={active}
          list={article.dirs}
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
