import * as React from 'react'
import { witchParentClass } from 'src/hoc'
import style from './style.module.scss'
import { analysisMarked } from 'src/util'
import * as SimpleMDE from 'simplemde'
import { 
  UserInfo, 
  Comment as CommentType, 
  CommentList,
  config
} from 'src/request'
import {
  ReactionItems, 
  ReactionServeFactory
} from '../reactions'

type UserInfoProps = {
  userInfo: UserInfo
}

type ChatProps = UserInfoProps & {
  children: any,
  head: any
}
export const ChatBox = witchParentClass((props: ChatProps) => {
  return (
    <div className={style['chat']}>
      <div className={style.head}>
        <div className={style.avatar}>
          <a href={props.userInfo.html_url} target="_blank" rel="noreferrer">
            <img src={props.userInfo.avatar_url} alt={props.userInfo.login} />
          </a>
        </div>
        {props.head}
      </div>
      <div className={style.body}>
        {props.children}
      </div>
    </div>
  )
})

enum modeEnum { EDIT, VIEW }
const modeDesc = { 
  [modeEnum.EDIT]: '编写', 
  [modeEnum.VIEW]: '预览' 
} as const

type InputProps = UserInfoProps & {
  onChange?: (newValue: string, oldValue: string) => void
  onSubmit: (value: string) => void, 
  value?: string
}
export const CommitInput = witchParentClass(
  ({ userInfo, onSubmit, onChange, value = '' }: InputProps) => {
    const editRef = React.useRef(null)
    const [currMode, setCurrMode] = React.useState(modeEnum.EDIT)
    const [simplemde, setSimplemde] = React.useState<SimpleMDE | null>(null)
    
    React.useEffect(() => {
      const lemde = new SimpleMDE({
        element: editRef.current as unknown as HTMLElement,
        spellChecker: false,
        status: false,
        initialValue: value,
        toolbar: [
          'code', 'link', 'image', 'table', '|',
          'bold', 'italic', 'strikethrough', '|',
          'heading-1', 'heading-2', 'heading-3', '|',
          'quote', 'unordered-list', 'ordered-list', 'horizontal-rule', '|',
          'fullscreen', 'guide'
        ],
        previewRender: (mdtext) =>
          `<div class="marked-body input-marked">${analysisMarked(mdtext)}</div>`
      })
      setSimplemde(lemde)

      return () => {
        lemde.toTextArea()
      }
    }, [editRef])

    if (simplemde && simplemde.value() !== value) {
      simplemde.value(value)
    }

    const tabChange = (mode: modeEnum) => {
      if (!simplemde) return;
      if ((mode === modeEnum.VIEW && !simplemde.isPreviewActive())
        || (mode === modeEnum.EDIT && simplemde.isPreviewActive())
      ) {
        SimpleMDE.togglePreview(simplemde)
      }
      setCurrMode(mode)
    }

    const head = (
      <div className={style['mode-tabs']}>
        {Object.keys(modeDesc).map(mode => (
          <span 
            key={mode}
            className={currMode === Number(mode) ? style.active : ''}
            onClick={() => tabChange(Number(mode))}>
            {modeDesc[mode as unknown as modeEnum]}
          </span>
        ))}
      </div>
    )

    if (onChange) {
      simplemde?.codemirror.on('change', () => {
        onChange(simplemde.value(), value)
      })
    }

    return (
      <ChatBox userInfo={userInfo} head={head} className={style['md-edit']}>
        <textarea ref={editRef} className={style['input']}></textarea>
        <div className={style.btns}>
          <button {...value ? {} : {disabled: true}} onClick={() => onSubmit(value)}>发表</button>
        </div>
      </ChatBox>
      )
  }
)

export const CommitItem = witchParentClass(
  (props: CommentType & { currentUser?: UserInfo }) => {
    const [reactions, onIncrement] = props.currentUser
      ? ReactionServeFactory({
          allApi: config.commentReactions,
          delApi: config.commentReaction,
          addApi: config.commentReactions,
          namespace: `${props.id}/reactions`,
          paths: { id: props.id }
        })
      : [props.reactions]
      
    return (
      <ChatBox 
        className={style['commit-item']}
        userInfo={props.user}
        head={
          <React.Fragment>
            <strong>{props.user.login}</strong>
            <span>评论于{props.created_at}</span>
          </React.Fragment>
        }
      >
        <div 
          className='marked-body'
          dangerouslySetInnerHTML={{__html: analysisMarked(props.body)}} 
        />
        <div className={style.reactions}>
          <ReactionItems 
            data={reactions} 
            onIncrement={onIncrement} 
            userInfo={props.currentUser}
            defaultEnableds={['+1', '-1']}
          />
        </div>
      </ChatBox>
    )
})

export const Comments = witchParentClass(
  ({ comments, user }: { comments: CommentList, user: UserInfo | undefined }) => (
    comments.length 
      ? <div>
          {comments.map(item => 
            <CommitItem 
              {...item}
              currentUser={user}
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

