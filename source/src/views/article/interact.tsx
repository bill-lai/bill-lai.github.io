import * as React from 'react'
import { githubApi, UserInfo, Article, Reactions, ReactionContent } from 'src/request'
import { witchParentClass } from 'src/hoc'
import style from './style.module.scss'
import { useGlobalState } from 'src/state'
import { Link } from 'react-router-dom'
import { queryRoutePath } from 'src/router'
import { ReactionItems, ReactionItem, iconMaps, onIncrement } from './reactions'
import { CommitInput, Commits } from './comment'


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
  const [isAuth] = React.useState(githubApi.isLocalAuth())
  const [commits] = useGlobalState(
    `article/commits/${props.issues.number}`,
    () => githubApi.getCommits(props.issues.number),
    []
  )
  const [reactions, setReactions] = useGlobalState(
    `${props.issues.number}/reactions`,
    () => githubApi.getArticleReactions(props.issues.number),
    []
  )

  // const genOnIncrement = (isArticle: boolean) => {
  //   const delReaction = githubApi.delArticleReaction
  //   const addReaction = githubApi.addArticleReaction


  // }

  React.useEffect(() => {
    isAuth &&
      githubApi.getUserInfo().then(setUserInfo)
  }, [isAuth])

  return (
    <div className={style['interact-layer']}>
      <JoinColumns {...props.column} className={style.section} />
      <ArticleReactions 
        onIncrement={
          (content, info) => {
            if (info) {
              githubApi.delArticleReaction(props.issues.number, info.reactionId)
                .then(() => {
                  setReactions(
                    reactions.filter(oReaction => oReaction.id !== info.reactionId)
                  )
                })
            } else {
              githubApi.addArticleReaction(props.issues.number, content)
                .then(addReaction => {
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