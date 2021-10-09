import * as React from 'react'
import { githubApi, UserInfo, Commit as CommitType, Article, CommitList, Reactions } from 'src/request'
import { witchParentClass } from 'src/hoc'
import style from './style.module.scss'
import { useGlobalState } from 'src/state'
import { analysisMarked } from 'src/util'
import { Clap, View, Comment } from './icons'
import { Link } from 'react-router-dom'
import { queryRoutePath } from 'src/router'

type TReaction<T extends Array<string>> = {
  [key in T extends Array<infer K> ? K : never]: {
    count: number,
    owner: boolean
  }
}

const transformReactions = (reactions: Reactions, userInfo: UserInfo | void) => {
  const treaction: TReaction<['+1', '-1']> = {
    '+1': { count: 0, owner: false },
    '-1': { count: 0, owner: false },
  }

  for (let item of reactions) {
    treaction[item.content].count++
    if (userInfo && item.user.id === userInfo.id) {
      treaction[item.content].owner = true
    }
  }

  return treaction
}

type ArticleReactions = {
  "reactions": Reactions,
  "userInfo": UserInfo | void,
  "comment": number,
  "view": number,
  "onChangeCount"?: (key: string, increment: 1 | -1) => void
}


const ArticleReactions = witchParentClass((props: ArticleReactions) => {
  const treaction = transformReactions(props.reactions)

  return (
    <div className={style['article-reactions']}>
      <div className={style.reactions}>
        <span><Clap className={treaction['+1'].owner ? 'active': ''} />{ treaction['+1'].count }</span>
        <span><Comment />{props.comment}</span>
        <span className="disable"><View />{props.view}</span>
      </div>
    </div>
  )
})

const JoinColumns = witchParentClass((props: Article['column']) => {
  return (
    <div className={style['join-columns']}>
      <Link to={queryRoutePath('special')}>{props.title}</Link>
      <Link to={queryRoutePath('special')}>{props.title}</Link>
    </div>
  )
})

const CommitInput = witchParentClass(({ userInfo }: { userInfo: UserInfo | void }) => {
  return userInfo 
    ? (<div>
        { userInfo.login }
      </div>)
    : (<div className={style.unauth}>
        暂未授权登录，<a href={githubApi.getAuthLink()}>授权跟博主互动</a>
      </div>)
})



const CommitItem = witchParentClass((props: CommitType) => {
  return (
    <div className={style['commit-item']}>
      <div className={style.head}>
        <div className={style.avatar}>
          <a href={props.user.html_url} target="_blank">
            <img src={props.user.avatar_url} alt={props.user.login} />
          </a>
        </div>
        <strong>{props.user.login}</strong>
        <span>评论于{props.created_at}</span>
      </div>
      <div 
        className={style.body + ' marked-body'} 
        dangerouslySetInnerHTML={{__html: analysisMarked(props.body)}} 
      />
      <div>
        
      </div>
    </div>
  )
})

const Commits = witchParentClass(({ commits }: { commits: CommitList}) => {
  return commits.length 
    ? <div className={style['commit-layer']}>
        {commits.map(item => 
          <CommitItem 
            {...item}
            key={item.id}
            className={style['commit-item-layer']} 
          />
        )}
      </div>
    : <div className="">
        <p>暂无评论</p> 
      </div>
})


type InteractProp = {
  issues: Article['issues'],
  column: Article['column']
}

const Interact = witchParentClass((props: InteractProp) => {
  const [userInfo, setUserInfo] = React.useState<UserInfo | void>(undefined)
  const [isAuth] = React.useState(githubApi.isLocalAuth())
  const [commits] = useGlobalState(
    `article/commits/${props.issues.number}`,
    () => githubApi.getCommits(props.issues.number),
    []
  )
  const [reactions] = useGlobalState(
    `${props.issues.number}/reactions`,
    () => githubApi.getArticleReactions(props.issues.number),
    []
  )

  React.useEffect(() => {
    if (!isAuth) return

    githubApi.getUserInfo()
      .then(setUserInfo)
  }, [isAuth])




  return (
    <div className={style['interact-layer']}>
      <JoinColumns {...props.column} className={style.section} />
      { reactions && 
        <ArticleReactions 
          className={style.section} 
          reactions={reactions}
          userInfo={userInfo}
          comment={commits.length} 
          view={8}
        />}
      <CommitInput userInfo={userInfo} />
      <Commits className={style['commit-layer']} commits={commits} />
    </div>
  )
})

export default Interact