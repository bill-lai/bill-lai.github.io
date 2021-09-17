import * as React from 'react'
import style from './style.module.scss'
import { witchParentClass } from 'src/hoc'

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
  onClick?: (args: NavItem<T>) => void,
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
  list
}: NavigationProps<T>) => {
  return (
    <React.Fragment>
      <div>
        <h4 className={style.title}>{title}</h4>
        <NavigationItem list={list} onClick={onClick} />
      </div>
    </React.Fragment>
  )
}

export default witchParentClass(Navigation)