import * as React from 'react'
import style from './style.module.scss'
import { witchParentClass } from 'src/hoc'

type NavItem<T> = {
  [Key in keyof T]: T[Key]
} & {
  title: string,
  children?: Navs<T>
}
type Navs<T> = Array<NavItem<T>>
type NavContentProps<T> = { 
  list: Navs<T>, 
  active: NavItem<T> | null,
  isChildren?: boolean,
  onClick: (args: NavItem<T>) => void
}
export type NavigationProps<T> = Omit<NavContentProps<T>, 'onClick'> & {
  title: string,
  onClick: (args: NavItem<T> | null) => void
}
const onDefaultClick = (item: any) => {}

const navIsActive = <T extends Object>(item: NavItem<T>, activeItem: NavItem<T>) => {
  if (item === activeItem) {
    return true
  } else if (item.children) {
    for (let cItem of item.children) {
      if (navIsActive(cItem, activeItem)) {
        return true
      }
    }
  }
  return false
}

const NavsContent = React.forwardRef(<T extends object>(
  { 
    list, 
    active, 
    isChildren = false,
    onClick 
  }: NavContentProps<T>
) => {
  const childrenEles = list.map((item, i) => {
    const isActive = active && navIsActive(item, active)
    const clickHandle = (ev: React.SyntheticEvent) => {
      onClick(item)
      ev.stopPropagation() 
    }

    return (
      <li key={i} className={isActive ? style.active : ''}>
        <span onClick={clickHandle}>
          {item.title}
          { !isChildren && item.children && <i className="iconfont icon-arrow_down" /> }
        </span>
        {item.children && 
          <NavsContent
            list={item.children} 
            isChildren={true}
            active={active}
            onClick={onClick} 
            // className={ style['child-navs'] } 
          />
        }
      </li>
    )
  })

  return <ul>{childrenEles}</ul>
})


const Navigation = <T extends object>({
  title, 
  list,
  active,
  onClick = onDefaultClick
}: NavigationProps<T>) => {
  const clickHandle = (item: NavItem<T>) => {
    if (list.some(citem => citem === item) && active && navIsActive(item, active)) {
      onClick(null)
    } else {
      onClick(item)
    }
  }

  return (
    <div>
      <h4 className={style.title}>{title}</h4>
      <NavsContent
        // ref={navContent}
        active={active}
        list={list} 
        onClick={clickHandle}
        // className={style['top-navs']} 
      />
    </div>
  )
}

export default Navigation