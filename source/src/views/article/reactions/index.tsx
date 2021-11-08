import * as React from "react"
import { witchParentClass } from "src/hoc"
import * as icons from './icons'
import style from './style.module.scss'
import { useGlobalState } from "src/state"
import {
  axios, 
  Reactions, 
  UserInfo, 
  ReactionContent, 
  config,
  ReactionSimples,
  Reaction
} from "src/request"

type TReactionInfo = {
  userId: number,
  id: number
}
type TReaction = {
  [key in ReactionContent]: {
    count: number,
    owner?: TReactionInfo
  }
}

export const iconMaps: {
  [key in ReactionContent | 'commoent' | 'view']: typeof icons.Clap
} = {
  '+1': icons.Clap,
  '-1': icons.Clap,
  'commoent': icons.Comment,
  'view': icons.View,
  "laugh": icons.Clap,
  "confused": icons.Clap,
  "heart": icons.Clap,
  "hooray": icons.Clap,
  "rocket": icons.Clap,
  "eyes": icons.Clap
}


export type TransformReactionsArgs = {
  reactions: Reactions,
  defaultEnableds?: Array<ReactionContent>,
  userInfo?: UserInfo, 
}
function transformReactions({
  reactions,
  defaultEnableds = [],
  userInfo, 
}: TransformReactionsArgs) {
  const treaction = {} as TReaction

  defaultEnableds.forEach(key => {
    treaction[key] = { count: 0 }
  })

  for (let item of reactions) {
    if (!treaction[item.content]) {
      treaction[item.content] = { count: 0 }
    }

    if (userInfo && item.user.id === userInfo.id) {
      treaction[item.content].owner = {
        userId: userInfo.id,
        id: item.id
      }
    }

    treaction[item.content].count++
  }

  return treaction
}


type SupportType = keyof typeof iconMaps
type ReactionProps<T extends SupportType> = {
  count: number,
  isActive: boolean,
  children: (typeof iconMaps)[T],
  onClick?: () => void
}
export const ReactionItem = witchParentClass(
  <T extends SupportType> ({children: Icon, ...props}: ReactionProps<T>) =>
    <span
      className={`${style.reaction} ${props.isActive ? style.active: ''}`} 
      { 
        ...props.onClick 
          ? { onClick: () => props.onClick!() }
          : { }
      }
    >
      { Icon({}) }
      { props.count }
    </span>
)

export type onIncrement = (
  key: ReactionContent, 
  info?: TReactionInfo
) => void

export const ReactionItems = witchParentClass(
  (
    props: { 
      data: Reactions | ReactionSimples,
      userInfo?: UserInfo,
      onIncrement?: onIncrement,
      defaultEnableds?: TransformReactionsArgs['defaultEnableds']
    }
  ) => {
    const treaction = Array.isArray(props.data)
      ? transformReactions({ 
        reactions: props.data, 
        userInfo: props.userInfo,
        defaultEnableds: props.defaultEnableds
      })
      : Object.keys(props.data).reduce(
        (t, k) => ({
          ...t,
          [k]: { count: (props.data as ReactionSimples)[k as ReactionContent] }
        }),
        {} as TReaction
      )
    const items = (Object.keys(treaction) as Array<keyof typeof treaction>)
      .filter(
        key => iconMaps[key] && (
            treaction[key].count > 0 || 
            props.defaultEnableds?.includes(key)
          )
      )
      .map(key => (
        <ReactionItem 
          key={key}
          count={treaction[key].count}
          isActive={!!treaction[key].owner}
          {
            ...props.onIncrement 
              ? { onClick: () => props.onIncrement!(key, treaction[key].owner) }
              : {}
          }>
          {iconMaps[key]}
        </ReactionItem>
      ))
      
    return <React.Fragment>{items}</React.Fragment>
  }
)

type URL = typeof config
export type ReactionOperProp = {
  delApi?: URL['articleReaction'] | URL['commentReaction'],
  addApi?: URL['articleReactions'] | URL['commentReactions'],
  allApi: URL['articleReactions'] | URL['commentReactions'],
  paths: { id: any }
  namespace: string,
  user?: UserInfo
}

export type UpdateReaction = (content: ReactionContent, model?: TReactionInfo) => void

export function ReactionServeFactory(
  config: Required<ReactionOperProp>
    | Omit<Required<ReactionOperProp>, 'addApi' | 'user'>
    | Omit<Required<ReactionOperProp>, 'delApi' | 'user'>
): [Reactions, UpdateReaction]
export function ReactionServeFactory(
  config: Omit<ReactionOperProp, 'delApi' | 'addApi'>
): [Reactions]
export function ReactionServeFactory({
  delApi, 
  allApi, 
  addApi, 
  paths,
  user,
  namespace = allApi
}: ReactionOperProp) {
  const [reactions, setReactions] = useGlobalState(
    namespace,
    () => axios.get(allApi, { paths }),
    []
  )
  const [isReqing, setIsReqing] = React.useState(false);

  const updateReaction: UpdateReaction = (content, model) => {
    if (isReqing || !user) return;
    let promise: Promise<any> | null = null

    setIsReqing(true)

    if (model && delApi) {
      setReactions(
        reactions.filter(oReaction => oReaction.id !== model.id)
      )
      promise = axios.delete(delApi, {
        paths: {
          ...paths,
          reactionId: model.id
        }
      })
    } else if (!model && addApi) {
      const temporary: Reaction = {
        content: content,
        created_at: new Date().toISOString(),
        id: 0,
        user
      }
      setReactions(reactions.concat(temporary))

      promise = axios.request({
        url: addApi,
        method: 'POST',
        paths,
        data: { content }
      }).then(addReaction => {
        setReactions(
          reactions
            .filter(reaction => reaction !== temporary)
            .concat(addReaction)
        )
      })
    }

    promise
      ?.catch(() => setReactions(reactions))
       .then(() => setIsReqing(false))
  }

  return [reactions, updateReaction]
}