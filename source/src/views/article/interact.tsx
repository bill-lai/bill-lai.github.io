import * as React from 'react'
import { witchParentClass } from 'src/hoc'
import style from './style.module.scss'
import { useGlobalState } from 'src/state'
import { Link } from 'react-router-dom'
import { queryRoutePath } from 'src/router'
import { CommitInput, Comments, InputRef } from './comment'
import { auth, getAuthLink, isLocalAuth } from 'src/github'
import { LoadRef, Loading } from 'src/components/loading'
import { LoadEle } from './index'
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
  Comment,
  axios, 
  config, 
  CommentList
} from 'src/request'


type ArticleReactionsProps = {
  "reactions"?: Reactions,
  "userInfo"?: UserInfo,
  "comment": number,
  "view": number,
  "onIncrement"?: onIncrement,
  "gotoComment"?: () => void,
  "defaultEnableds"?: Array<ReactionContent>
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
        <ReactionItem count={props.comment} isActive={false} onClick={props.gotoComment}>
          {iconMaps.commoent}
        </ReactionItem>
        {/* <ReactionItem count={props.view} isActive={false} >
          {iconMaps.view}
        </ReactionItem> */}
      </div>
    </div>
  )
)

// const JoinColumns = witchParentClass((props: Article['column']) => {
//   return (
//     <div className={style['join-columns']}>
//       <Link to={queryRoutePath('special')}>{props.title}</Link>
//     </div>
//   )
// })

export type InteractProp = {
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
    null
  )
  const [editComments, setEditComments] = React.useState<CommentList>([])
  const [reactions, onIncrement] = ReactionServeFactory({
    user: userInfo,
    allApi: config.articleReactions,
    delApi: config.articleReaction,
    addApi: config.articleReactions,
    namespace: `${props.issues.number}/reactions`,
    paths: { id:props.issues.number }
  })

  const [editTxt, setEditTxt] = React.useState('')
  const editRef: InputRef = React.createRef()
  const editLoadRef: LoadRef = React.createRef()

  const submitComment = (body: string) => {
    if (!comments) return;

    editLoadRef.current?.startLoading()
    axios.post(config.comments, { body }, { paths } )
      .then(comment => {
        editLoadRef.current?.stopLoading()
        setComments([
          {
            ...comment,
            reactions: { ...initReactionSimples, url: '' }
          },
          ...comments
        ])
        setEditTxt('')
      })
  }

  const commentOper = (marker: string, comment: Comment, args?: string) => {
    if (!userInfo) return auth()

    switch(marker) {
      case 'quote':
        setEditTxt(`> ${comment.body.split(/(?:\n)|(?:\r\n)/).join('\n> ')}\n\n`)
        break;
      case 'reply':
        setEditTxt(`@${comment.user.login} `)
        break;
      case 'update':
        setEditComments([...editComments, comment])
        break;
      case 'cacelUpdate':
        setEditComments(editComments.filter(fc => fc !== comment))
        break;
      case 'enterUpdate':
        if (args && comments) {
          axios.request({
            url: config.comment,
            method: 'PATCH',
            paths: { commentId: comment.id },
            data: { body: args },
          })
          setComments(
            comments.map(
              fc => fc === comment
                ? { ...comment, body: args }
                : fc
            )
          )
          commentOper('cacelUpdate', comment)
        }
        break;
      case 'delete':
        if (!window.confirm('确定要删除此评论吗？')) return;

        setComments(
          (comments as CommentList).filter(fc => fc.id !== comment.id)
        )
        axios.delete(
          config.comment, 
          { paths: { commentId: comment.id } }
        ).catch(() => setComments(comments))
        break;
    }
  }

  React.useEffect(() => {
    isAuth &&
      axios.get(config.userInfo).then(setUserInfo)
  }, [isAuth])

  console.log(props)
  return (
    <div className={style['interact-layer'] + ' ' + style['variable']}>
      {/* <JoinColumns {...props.column} className={style.section} /> */}
      <ArticleReactions 
        onIncrement={ onIncrement }
        className={style.section} 
        reactions={reactions}
        userInfo={userInfo}
        comment={comments ? comments.length : 0} 
        gotoComment={ () => userInfo ? editRef.current?.focus() : auth() }
        defaultEnableds={['+1']}
        view={8}
      />
      <div className={style['boundary']}>
        {userInfo 
          ? <React.Fragment>
              <Loading ref={editLoadRef} />
              <CommitInput 
                forwardRef={editRef}
                userInfo={userInfo} 
                onChange={setEditTxt} 
                value={editTxt}>

                <button 
                  {...editTxt ? {} : {disabled: true}} 
                  onClick={() => submitComment(editTxt)}
                  className='primary'>
                    发表
                </button>
              </CommitInput>
            </React.Fragment>
          : <div className={style.unauth}>
              暂未授权登录，<a href={getAuthLink()}>授权跟博主互动</a>
            </div>
        }
      </div>
      { comments 
        ? <Comments
          edits={editComments}
          onOper={commentOper}
          className={style['boundary']} 
          comments={comments} 
          user={userInfo} 
        />
        : <LoadEle />
      }
    </div>
  )
})

export default Interact