import * as React from 'react'
import { UserInfo, Article, Reactions, ReactionContent, axios, config } from 'src/request'
import { witchParentClass } from 'src/hoc'
import style from './style.module.scss'
import { useGlobalState } from 'src/state'
import { Link } from 'react-router-dom'
import { queryRoutePath } from 'src/router'
import { ReactionItems, ReactionItem, iconMaps, onIncrement } from './reactions'
import { CommitInput, Commits } from './comment'
import { isLocalAuth } from 'src/github'


type ArticleReactionsProps = {
  "reactions"?: Reactions,
  "userInfo"?: UserInfo,
  "comment": number,
  "view": number,
  "onIncrement"?: onIncrement,
  defaultEnableds?: Array<ReactionContent>
}


const ArticleReactions = witchParentClass((props: ArticleReactionsProps) => (
    <div className={style['article-reactions']}>
      <div className={style.reactions}>
        {
          props.reactions && 
            <ReactionItems 
              data={props.reactions} 
              onIncrement={props.onIncrement} 
              userInfo={props.userInfo}
              defaultEnableds={props.defaultEnableds}
            />
        }
        <ReactionItem count={props.comment} isActive={false} >
          {iconMaps.commoent}
        </ReactionItem>
        <ReactionItem count={props.view} isActive={false} >
          {iconMaps.view}
        </ReactionItem>
      </div>
    </div>
  )
)

const JoinColumns = witchParentClass((props: Article['column']) => {
  return (
    <div className={style['join-columns']}>
      <Link to={queryRoutePath('special')}>{props.title}</Link>
      <Link to={queryRoutePath('special')}>{props.title}</Link>
    </div>
  )
})

type InteractProp = {
  issues: Article['issues'],
  column: Article['column']
}

const Interact = witchParentClass((props: InteractProp) => {
  const [userInfo, setUserInfo] = React.useState<UserInfo | undefined>(undefined)
  const [isAuth] = React.useState(isLocalAuth())
  const [commits] = useGlobalState(
    `article/commits/${props.issues.number}`,
    () => axios.get(config.comment, { params: { labels: '' } }),
    []
  )
  const [reactions, setReactions] = useGlobalState(
    `${props.issues.number}/reactions`,
    () => axios.get(config.articleReactions, { params: { id:props.issues.number } }) ,
    []
  )

  React.useEffect(() => {
    isAuth &&
      axios.get(config.userInfo).then(setUserInfo)
  }, [isAuth])

  return (
    <div className={style['interact-layer']}>
      <JoinColumns {...props.column} className={style.section} />
      <ArticleReactions 
        onIncrement={
          (content, info) => {
            if (info) {
              axios.delete(config.articleReaction, {
                params: {
                  id: props.issues.number,
                  reactionId: info.reactionId
                }
              }).then(() => {
                setReactions(
                  reactions.filter(oReaction => oReaction.id !== info.reactionId)
                )
              })
            } else {
              axios({
                url: config.articleReactions,
                method: 'POST',
                params: { id: props.issues.number },
                data: { content }
              }).then(addReaction => {
                setReactions(reactions.concat(addReaction as any))
              })
            }
          }
        }
        className={style.section} 
        reactions={reactions}
        userInfo={userInfo}
        comment={commits.length} 
        defaultEnableds={['+1']}
        view={8}
      />
      <CommitInput userInfo={userInfo} />
      <Commits className={style['comment-layer']} commits={commits} />
    </div>
  )
})

export default Interact