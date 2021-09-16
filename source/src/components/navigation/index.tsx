import * as React from 'react'
import style from './style.module.scss'
import { witchParentClass, WitchParentAttachProps } from 'src/hoc'

type NavItem<T> = {
  [Key in keyof T]: T[Key]
} & {
  // [Key: string]: any,
  title: string,
  children?: Navs<T>
}
type Navs<T> = Array<NavItem<T>>
type onClick<T> = (args: NavItem<T>) => any
type NavigationItemProps<T> = { list: Navs<T>, onClick: onClick<T> }
type NavigationProps<T> = {
  title: string,
  onClick?: (args: NavItem<T>) => any,
  list: Navs<T>
}
const onDefaultClick = (item: any) => {}

const NavigationItem = <T extends Object>(
  { list, onClick }: NavigationItemProps<T>
) => {
  return (
    <ul>
      {list.map(item => (
        <li>
          {item.children && <NavigationItem list={item.children} onClick={onClick} />}
          <span onClick={() => onClick(item)}>{item.title}</span>
        </li>
      ))}
    </ul>
  )
}

const Navigation = <T extends Object>({
  title, 
  onClick = onDefaultClick,
  list,
  className
}: NavigationProps<T> & WitchParentAttachProps) => {
  return (
    <div>
      <h4 className={style.title + className}>{title}</h4>
      <NavigationItem list={list} onClick={onClick} />
    </div>
  )
}

export default witchParentClass(Navigation)