import * as React from 'react'
import * as SimpleMDE from 'simplemde'
import style from './style.module.scss'
import { ReactionItems, ReactionServeFactory, ReactSimleFactory } from '../reactions'
import { analysisMarked, formatDate } from 'src/util'
import { witchParentClass } from 'src/hoc'
import { TipSelect } from 'src/components/tip-select'
import { More } from '../reactions/icons'
import { 
  UserInfo, 
  Comment as CommentType, 
  CommentList,
  config
} from 'src/request'

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

export type InputRef = React.RefObject<{focus: () => void}>
type InputProps = UserInfoProps & {
  forwardRef?: InputRef
  onChange?: (newValue: string, oldValue: string) => void
  children?: any,
  value?: string
}

const simpleLastFocus = (simplemde: SimpleMDE) => {
  const value = simplemde.value()
  const lines = value.split('\n')
  simplemde.codemirror.focus()
  simplemde.codemirror.setCursor(
    lines.length,
    lines[lines.length - 1].length
  )
}

export const CommitInput = witchParentClass(
  ({ userInfo, onChange, children, value = '', forwardRef }: InputProps) => {
    const editRef = React.useRef(null)
    const [currMode, setCurrMode] = React.useState(modeEnum.EDIT)
    const [simplemde, setSimplemde] = React.useState<SimpleMDE | null>(null)
    
    React.useEffect(() => {
      const lemde = new SimpleMDE({
        element: editRef.current as unknown as HTMLElement,
        spellChecker: false,
        status: false,
        initialValue: '',
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

    React.useEffect(() => {
      if (simplemde && simplemde.value() !== value) {
        simplemde.value(value)
        simpleLastFocus(simplemde)
      }
    }, [value, simplemde])

    React.useImperativeHandle(forwardRef, () => ({
      focus() {
        simplemde?.codemirror.focus()
      }
    }))

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
          { children }
        </div>
      </ChatBox>
      )
  }
)

export type CommentItemProps = CommentType & {
  mode: 'ready' | 'write',
  currentUser?: UserInfo, 
  onOper?: (oper: string, args?: any) => void
}
export const CommentItem = witchParentClass(
  (props: CommentItemProps) => {
    const [ body, setBody ] = React.useState(props.body)
    const [ reactions, onIncrement ] = 
      props.currentUser
        ? ReactionServeFactory({
            allApi: config.commentReactions,
            delApi: config.commentReaction,
            addApi: config.commentReactions,
            user: props.currentUser,
            namespace: `${props.id}/reactions`,
            paths: { id: props.id }
          })
        : ReactSimleFactory(props.reactions)

    const options = [
      { label: '引用', value: 'quote' },
      { label: '回复', value: 'reply' },
      ...props.currentUser?.id === props.user.id
        ? [
            { label: '修改', value: 'update' },
            { label: '删除', value: 'delete', warn: true }
          ]
        : []
    ]


    return props.mode === 'ready' 
      ? <ChatBox 
          className={style['commit-item']}
          userInfo={props.user}
          head={
            <React.Fragment>
              <strong>{props.user.login}</strong>
              <div className={style.oper}>
                <span className={style.time}>
                  评论于{formatDate(new Date(props.created_at))}
                </span>
                <TipSelect 
                  options={options} 
                  onSelect={option => props.onOper && props.onOper(option.value)}>
                  <More />
                </TipSelect>
              </div>
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
      : <CommitInput 
          value={body} 
          userInfo={props.currentUser as UserInfo} 
          onChange={nbody => setBody(nbody)}>
          <button 
            className='primary'
            {...body ? {} : {disabled: true}} 
            onClick={ () => props.onOper && props.onOper('enterUpdate', body) }>
            修改
          </button>
          <button 
            className='cancel'
            onClick={() => props.onOper && props.onOper('cacelUpdate')}>
            取消
          </button>
        </CommitInput>
})

export type CommentsProps = { 
  comments: CommentList, 
  edits: CommentList,
  user: UserInfo | undefined,
  onOper: (marker: string, comment: CommentType, args?: any) => void
}
export const Comments = witchParentClass(
  ({ comments, user, onOper, edits }: CommentsProps) => (
    comments.length 
      ? <div>
          {comments.map(item => 
            <CommentItem 
              {...item}
              mode={edits.includes(item) ? 'write' : 'ready'}
              currentUser={user}
              key={item.id}
              className={style['commit-item-layer']} 
              onOper={(marker, args) => onOper(marker, item, args)}
            />
          )}
        </div>
      : <div className={style['un-comments']}>
          <p>暂无评论</p> 
        </div>
  )
)

