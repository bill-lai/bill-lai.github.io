import * as React from 'react'
import { CommitList, githubApi, UserInfo, Commit as CommitType } from 'src/request'
import { witchParentClass } from 'src/hoc'
import style from './style.module.scss'
import { useGlobalState } from 'src/state'

type Props = {
  articleId: string
}

const CommitInput = witchParentClass(({ articleId }: Props) => {
  const [isAuth] = React.useState(githubApi.isLocalAuth())
  const [userInfo, setUserInfo] = React.useState<UserInfo | void>(undefined)

  React.useEffect(() => {
    if (isAuth) {
      githubApi.getUserInfo()
        .then(setUserInfo)
    }
  }, [isAuth])

  return isAuth 
    ? (<div>
        { JSON.stringify(userInfo) }
      </div>)
    : (<div className={style.unauth}>
        暂未授权登录，<a href={githubApi.getAuthLink()}>授权以发表评论</a>
      </div>)
})


const CommitItem = witchParentClass((props: CommitType) => {
  return (
    <div>
      <div>
        <img src={props.user.avatar_url} />
      </div>
      <div>
        <div>
          <strong>{props.user.login}</strong>
          
        </div>
      </div>
      {props.body}
    </div>
  )
})



const Commit = witchParentClass(({ articleId }: Props) => {
  const [commits] = useGlobalState(
    `${articleId}/commits`,
    () => githubApi.getCommits(articleId),
    []
  )

  const commitBody = commits.length 
    ? (<div className="">
        {commits.map(item => <CommitItem {...item} key={item.id} />)}
      </div>)
    : <div className=""> <p>暂无评论</p> </div>

  return (
    <div>
      <CommitInput articleId={articleId} />
      {commitBody}
    </div>
  )
})

export default Commit