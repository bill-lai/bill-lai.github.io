import * as React from "react"
import { witchParentClass } from "src/hoc"
import { Reactions, UserInfo } from "src/request"
import * as icons from './icons'

type TReaction<T extends Array<string>> = {
  [key in T extends Array<infer K> ? K : never]: {
    count: number,
    owner?: boolean
  }
}

export const transformReactions = (reactions: Reactions, userInfo: UserInfo | void) => {
  const treaction: TReaction<['+1', '-1']> = {
    '+1': { count: 0, owner: false },
    '-1': { count: 0, owner: false },
  }

  for (let item of reactions) {
    treaction[item.content].count++
    if (userInfo && item.user.id === userInfo.id) {
      treaction[item.content].owner = true
    }
  }

  return treaction
}


type ReactionProps<T extends string> = TReaction<[T]>[T] & {
  children: (typeof icons)[keyof typeof icons],
  onClick?: (increment: 1 | -1) => void
}
export const ReactionItem = witchParentClass(
  <T extends string> (props: ReactionProps<T>) => 
    <span
      className={props.owner ? 'active': ''} 
      { 
        ...props.onClick 
          ? { onclick: () => (props.onClick as any)(props.owner ? -1 : 1) }
          : { }
      }
    >
      { props.children }
      { props.count }
    </span>
)

const iconMaps = {
  '+1': icons.Clap,
  '-1': icons.Comment
}

export const ReactionItems = witchParentClass(
  (props: { data: Reactions }) => {
    const treaction = transformReactions(props.data);
    const items = (Object.keys(treaction) as Array<keyof typeof treaction>)
      .map(key => (
        <ReactionItem {...treaction[key]} key={key}>
          {iconMaps[key]}
        </ReactionItem>
      ))
      
    return <React.Fragment>{items}</React.Fragment>
  }
)