import * as React from 'react'
import { witchParentClass } from 'src/hoc'
import style from './style.module.scss'
import { useGlobalState } from 'src/state'
import { Link } from 'react-router-dom'
import { queryRoutePath } from 'src/router'
import { CommitInput, Comments } from './comment'
import { getAuthLink, isLocalAuth } from 'src/github'
import { 
  ReactionItems, 
  ReactionItem, 
  iconMaps, 
  onIncrement,
  ReactionServeFactory
 } from './reactions'
 import { 
  UserInfo, 
  Article, 
  Reactions, 
  ReactionContent, 
  ReactionSimples, 
  axios, 
  config 
} from 'src/request'


type ArticleReactionsProps = {
  "reactions"?: Reactions,
  "userInfo"?: UserInfo,
  "comment": number,
  "view": number,
  "onIncrement"?: onIncrement,
  defaultEnableds?: Array<ReactionContent>
}

type CompoentReactionSimples = Omit<ReactionSimples, 'url'>

const initReactionSimples: CompoentReactionSimples = {
  '+1': 0,
  '-1': 0,
  'confused': 0,
  'eyes': 0,
  'heart': 0,
  'hooray': 0,
  'laugh': 0,
  'rocket': 0
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
  const paths = { issuesId: props.issues.number }
  const [userInfo, setUserInfo] = React.useState<UserInfo | undefined>(undefined)
  const [isAuth] = React.useState(isLocalAuth())
  const [comments, setComments] = useGlobalState(
    `article/comments/${props.issues.number}`,
    () => axios.get(config.comments, { paths }),
    []
  )
  const [reactions, onIncrement] = ReactionServeFactory({
    allApi: config.articleReactions,
    delApi: config.articleReaction,
    addApi: config.articleReactions,
    namespace: `${props.issues.number}/reactions`,
    paths: { id:props.issues.number }
  })

  const [editTxt, setEditTxt] = React.useState('')

  const submitComment = (body: string) => {
    axios.post(config.comments, { body }, { paths } )
      .then(comment => {
        setComments([
          {
            ...comment,
            reactions: { ...initReactionSimples, url: '' }
          },
          ...comments
        ])
      })
  }

  React.useEffect(() => {
    isAuth &&
      axios.get(config.userInfo).then(setUserInfo)
  }, [isAuth])

  return (
    <div className={style['interact-layer'] + ' ' + style['variable']}>
      <JoinColumns {...props.column} className={style.section} />
      <ArticleReactions 
        onIncrement={ onIncrement }
        className={style.section} 
        reactions={reactions}
        userInfo={userInfo}
        comment={comments.length} 
        defaultEnableds={['+1']}
        view={8}
      />
      <div className={style['boundary']}>
        {
          userInfo 
            ? <CommitInput 
                userInfo={userInfo} 
                onChange={setEditTxt} 
                value={editTxt} 
                onSubmit={submitComment}/>
            : <div className={style.unauth}>
                暂未授权登录，<a href={getAuthLink()}>授权跟博主互动</a>
              </div>
        }
      </div>
      <Comments className={style['boundary']} comments={comments} user={userInfo} />
    </div>
  )
})

export default Interact