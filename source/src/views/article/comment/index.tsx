import * as React from 'react'
import { witchParentClass } from 'src/hoc'
import style from './style.module.scss'
import { analysisMarked } from 'src/util'
import { 
  UserInfo, 
  Comment as CommentType, 
  CommentList
} from 'src/request'
import { getAuthLink } from 'src/github'

export const CommitInput = witchParentClass(
  ({ userInfo }: { userInfo: UserInfo | void }) => 
    userInfo 
      ? (<div>
          { userInfo.login }
        </div>)
      : (<div className={style.unauth}>
          暂未授权登录，<a href={getAuthLink()}>授权跟博主互动</a>
        </div>)
)

export const CommitItem = witchParentClass((props: CommentType) => {
  return (
    <div className={style['commit-item']}>
      <div className={style.head}>
        <div className={style.avatar}>
          <a href={props.user.html_url} target="_blank" rel="noreferrer">
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

export const Commits = witchParentClass(
  ({ commits }: { commits: CommentList}) => (
    commits.length 
      ? <div>
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
  )
)

