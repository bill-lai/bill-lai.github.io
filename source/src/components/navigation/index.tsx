import * as React from 'react'
import style from './style.module.scss'
import { witchParentClass } from 'src/hoc'

export type NavItem<T> = {
  [Key in keyof T]: T[Key]
} & {
  title: string,
  children?: Navs<T>
}
export type Navs<T> = Array<NavItem<T>>
export type baseNavProps<T> = {
  active: NavItem<T> | null,
  onClick?: (args: NavItem<T>) => void,
  isChildren?: boolean
}
export type navArgs<T> = NavItem<T> | null
export type NavContentProps<T> = baseNavProps<T> & { item: NavItem<T> }
export type NavsContentProps<T> = baseNavProps<T> & { list: Navs<T>, attachHeight?: boolean }
export type NavigationProps<T> = Omit<NavsContentProps<T>, 'onClick'|'isChildren'> & { 
  title: string, 
  onClick?: (args: navArgs<T>) => void 
}

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

const NavContent = <T extends object>(
  {
    item,
    active,
    isChildren,
    onClick
  }: NavContentProps<T>
) => {
  const clickHandle = onClick && ((ev: React.SyntheticEvent) => {
    onClick(item)
    ev.stopPropagation() 
  })
  const isActive = active
    ? navIsActive(item, active)
    : clickHandle 
      ? null
      : item
  const Suffix = !isChildren && item.children 
    && <i className="iconfont icon-arrow_down" />

  return (
    <li className={isActive ? style.active : ''}>
      <span onClick={clickHandle}>
        {item.title} {Suffix}
      </span>
      {item.children && 
        <NavsContent
          attachHeight={!isChildren}
          list={item.children} 
          isChildren={true}
          active={active}
          onClick={onClick} 
          className={ style['child-navs'] } 
        />
      }
    </li>
  )
}

const NavsContent = witchParentClass(
  <T extends object>(
    { 
      list,
      attachHeight = false,
      ...props
    }: NavsContentProps<T>
  ) => {
    const children = list.map(
      (item, i) => <NavContent {...props} key={i} item={item} />
    )

    if (attachHeight) {
      const ref: React.MutableRefObject<HTMLUListElement | null> = React.useRef(null)
      const [height, setHeight] = React.useState<number | null>(null)
      const attchStyle = height !== null 
        ? { maxHeight: height + 'px' }
        : { }
  
      React.useEffect(() => {
        if (!ref.current || height !== null) return;
        const parent = ref.current.parentElement as HTMLElement
        parent.classList.add(style.active)
        setHeight(ref.current.offsetHeight)
        parent.classList.remove(style.active)
      }, [height])
  
      return <ul ref={ref} style={attchStyle}>{children}</ul>
    } else {
      return <ul>{children}</ul>
    }
  }
)


const Navigation = witchParentClass(<T extends object>({
  title, 
  list,
  active,
  onClick
}: NavigationProps<T>) => {
  const clickHandle = onClick && ((item: NavItem<T>) => {
    onClick(
      list.some(citem => citem === item) && 
        active && 
        navIsActive(item, active)
          ? null
          : item
    )
  })

  return (
    <React.Fragment>
      <h4 className={style.title}>{title}</h4>
      <NavsContent
        active={active}
        list={list} 
        onClick={clickHandle}
        className={style['top-navs']} 
      />
    </React.Fragment>
  )
})

export default Navigation