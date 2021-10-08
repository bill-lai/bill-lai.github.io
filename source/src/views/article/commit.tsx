import * as React from 'react'
import { CommitList, githubApi, UserInfo, Commit as CommitType, Article } from 'src/request'
import { witchParentClass } from 'src/hoc'
import style from './style.module.scss'
import { useGlobalState } from 'src/state'
import { analysisMarked } from 'src/util'


const CommitInput = witchParentClass(() => {
  const [isAuth] = React.useState(githubApi.isLocalAuth())
  const [userInfo, setUserInfo] = React.useState<UserInfo | void>(undefined)

  React.useEffect(() => {
    if (isAuth) {
      githubApi.getUserInfo()
        .then(setUserInfo)
    }
  }, [isAuth])

  return userInfo 
    ? (<div>
        { userInfo.login }
      </div>)
    : (<div className={style.unauth}>
        暂未授权登录，<a href={githubApi.getAuthLink()}>授权以发表评论</a>
      </div>)
})


const CommitItem = witchParentClass((props: CommitType) => {
  return (
    <div className={style['commit-item']}>
      <div className={style.head}>
        <div className={style.avatar}>
          <img src={props.user.avatar_url} />
        </div>
        <strong>{props.user.login}</strong>
        <span>评论于{props.created_at}</span>
      </div>
      <div 
        className={style.body + ' marked-body'} 
        dangerouslySetInnerHTML={{__html: analysisMarked(props.body)}} 
      />
    </div>
  )
})



const Commit = witchParentClass(({ commentsUrl }: Article['issues']) => {
  const [commits] = useGlobalState(
    commentsUrl,
    () => githubApi.getCommits(commentsUrl),
    []
  )

  const commitBody = commits.length 
    ? (<div className="">
        {commits.map(item => <CommitItem {...item} key={item.id} className={style['commit-item-layer']} />)}
      </div>)
    : <div className=""> <p>暂无评论</p> </div>

  return (
    <div>
      <CommitInput />
      {commitBody}
    </div>
  )
})

export default Commit