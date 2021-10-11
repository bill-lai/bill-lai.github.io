import * as React from "react"
import { witchParentClass } from "src/hoc"
import { Reactions, UserInfo, ReactionContent } from "src/request"
import * as icons from './icons'
import style from './style.module.scss'

type TReactionInfo = {
  userId: number,
  reactionId: number
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
        reactionId: item.id
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
      data: Reactions,
      userInfo?: UserInfo,
      onIncrement?: onIncrement,
      defaultEnableds?: TransformReactionsArgs['defaultEnableds']
    }
  ) => {
    const treaction = transformReactions({ 
      reactions: props.data, 
      userInfo: props.userInfo,
      defaultEnableds: props.defaultEnableds
    });
    const items = (Object.keys(treaction) as Array<keyof typeof treaction>)
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

// type RequestUrls = typeof config
// export const genReaction = (
//   addApi: RequestUrls['addArticleReaction'], 
//   delApi: RequestUrls['delArticleReaction'],
//   getApi: RequestUrls['getArticleReactions'],
//   namespace: string = addApi
// ) => {
//   return (req) => {
//     const [reactions, setReactions] = useGlobalState(
//       `${namespace}/${args.join('/')}/reactions`,
//       () => getApi(...args)
//       () => githubApi.getArticleReactions(props.issues.number)
//         .then(data => data as Reactions),
//       []
//     )
//   }
// }