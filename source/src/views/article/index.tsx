import * as React from 'react'
import { axios, config, ArticleDirs } from 'src/request'
import { useParams } from 'react-router-dom'
import ContentLayer from 'src/app/layout/content'
import './marked.scss'
import { Navigation, Navs } from 'src/components/navigation'
import { withScreenShow } from 'src/hoc'
import { useGlobalState } from 'src/state'
import app from 'src/platform'
import { Loading } from 'src/components/loading'
import style from './style.module.scss'
import { formatDate } from 'src/util'

const Interact = React.lazy(() => import('./interact'))


export const LoadEle = () =>
  <div className={style['article-loading-layer']}>
    <Loading status={ true } /> 
  </div> 
export const ScreenLoadEle = withScreenShow(LoadEle)


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
    className="marked-body" 
    dangerouslySetInnerHTML={{__html: html}} 
  />
)

const ArticleInfo = () => {
  const { id } = useParams() as { id: 'string' }
  const [ showInteract, setShowInteract ] = React.useState(false)
  const [ active, setActive ] = React.useState<NavItem | null>(null)
  const [ article ] = useGlobalState(
    `article/${id}`,
    () => axios
      .get(config.article, { paths: { id } })
      .then(article => ({
        ...article,
        ...[article.head, article, article.foot].reduce(
          (t, c) => c 
            ? {
                html: t.html + c.body,
                dirs: t.dirs.concat(navsToDirs(c.dirs))
              }
            : t, 
          { html: '', dirs: [] as Navs<NavItem> }
        )
      }))
  )
  
  if (!article) return <ContentLayer main={ <LoadEle /> } />

  app.setAppTitle(article.title)

  return (
    <ContentLayer 
      main={ 
        <React.Fragment>
          <h1 className="main-title">
            {article.title}
            <span className="marker">{formatDate(new Date(article.mtime))}</span>
          </h1>
          <MarkerBody 
            html={article.html}
            selector="h2,h3"
            onShowChange={(isShow, dom) => {
              let item;
              if (isShow 
                  && dom.textContent 
                  && (item = findDir(article.dirs, dom.textContent))
                ) {
                setActive(item)
              }
            }}
          />
          { showInteract
            ? <React.Suspense fallback={ <LoadEle /> }>
                <Interact className="commit-layer" {...article} />
              </React.Suspense> 
            : <ScreenLoadEle 
                onShowChange={(isShow) => {
                  console.log('loading', isShow)
                  isShow && !showInteract && setShowInteract(isShow) 
                }
                }
              />
          }
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
