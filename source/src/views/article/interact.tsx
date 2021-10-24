import * as React from 'react'
import { UserInfo, Article, Reactions, ReactionContent, axios, config } from 'src/request'
import { witchParentClass } from 'src/hoc'
import style from './style.module.scss'
import { useGlobalState } from 'src/state'
import { Link } from 'react-router-dom'
import { queryRoutePath } from 'src/router'
import { CommitInput, Commits } from './comment'
import { isLocalAuth } from 'src/github'
import { 
  ReactionItems, 
  ReactionItem, 
  iconMaps, 
  onIncrement,
  ReactionServeFactory
 } from './reactions'


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
  const [reactions, onIncrement] = ReactionServeFactory({
    allApi: config.articleReactions,
    delApi: config.articleReaction,
    addApi: config.articleReactions,
    namespace: `${props.issues.number}/reactions`,
    paths: { id:props.issues.number }
  })

  React.useEffect(() => {
    isAuth &&
      axios.get(config.userInfo).then(setUserInfo)
  }, [isAuth])

  return (
    <div className={style['interact-layer']}>
      <JoinColumns {...props.column} className={style.section} />
      <ArticleReactions 
        onIncrement={ onIncrement }
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