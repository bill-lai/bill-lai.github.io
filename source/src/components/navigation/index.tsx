import * as React from 'react'
import style from './style.module.scss'
import { witchParentClass, withScreenShow, FuncReturnType } from 'src/hoc'

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
export type NavContentProps<T> = baseNavProps<T> & { item: NavItem<T>, parent: HTMLDivElement }
export type NavsContentProps<T> = baseNavProps<T> & { list: Navs<T>, attachHeight?: boolean, parent: HTMLDivElement }
export type NavigationProps<T> = Omit<NavsContentProps<T>, 'onClick'|'isChildren'|'parent'> & { 
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
    parent,
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
          parent={parent}
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
      parent,
      ...props
    }: NavsContentProps<T>
  ) => {
    const children = list.map(
      (item, i) => <NavContent {...props} parent={parent} key={i} item={item} />
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


const getNavsContent = ((): any => {
  type WithNavsContentType = FuncReturnType<typeof NavsContent>
  
  const map = new Map<HTMLElement, WithNavsContentType>()
  
  return (dom: HTMLElement): WithNavsContentType => {
    let FC = map.get(dom)
    if (FC) {
      return FC
    } else {
      FC = withScreenShow(NavsContent as any)
      map.set(dom, FC)
      return FC
    }
  }
})();


const Navigation = witchParentClass(<T extends object>({
  title, 
  list,
  active,
  onClick
}: NavigationProps<T>) => {
  const ref = React.useRef() as React.MutableRefObject<HTMLDivElement>;
  const [el, setEl] = React.useState(ref.current)

  const clickHandle = onClick && ((item: NavItem<T>) => {
    onClick(
      list.some(citem => citem === item) && 
        active && 
        navIsActive(item, active)
          ? null
          : item
    )
  })

  React.useEffect(() => {
    
  })

  const content = ref.current && NavsContent({
    active: active,
    list: list,
    parent: ref.current,
    onClick: clickHandle,
    className: style['top-navs']
  })

  return (
    <div className={style['navigation-layer']} ref={ref}>
      <div className={style.navigation}>
        <h4 className={style.title}>{title}</h4>
        {content}
      </div>
    </div>
  )
})

export default Navigation