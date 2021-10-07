import * as React from 'react'
import style from './style.module.scss'
import { witchParentClass, WithScreenAttachProps, WithScreenRef, withScreenShow } from 'src/hoc'

export type NavItem<T> = {
  [Key in keyof T]: T[Key]
} & {
  title: string,
  children?: Navs<T>
}
export type Navs<T> = Array<NavItem<T>>
export type baseNavProps<T> = {
  active?: NavItem<T> | null,
  onClick?: (args: NavItem<T>) => void,
  isChildren?: boolean
}
export type navArgs<T> = NavItem<T> | null
export type NavContentProps<T> = baseNavProps<T> & { item: NavItem<T>, parent: HTMLDivElement }
export type NavsContentProps<T> = baseNavProps<T> & { list: Navs<T>, attachHeight?: boolean, parent?: HTMLDivElement }
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
  const Suffix = !isChildren && item.children && !!item.children.length
    && <i className="iconfont icon-arrow_down" />

  // console.log(active, item, active === item, isActive)

  return (
    <li className={isActive ? style.active : ''}>
      <span onClick={clickHandle}>
        {item.title} {Suffix}
      </span>
      {item.children && !!item.children.length &&
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


type WithNavContent = <T extends object>({ onShowChange, forwardRef, ...props }: baseNavProps<T> & {
  item: NavItem<T>;
  parent: HTMLDivElement;
} & WithScreenAttachProps<void>, ref?: any) => React.ReactElement<any, string | React.JSXElementConstructor<any>> | null

const getNavContent = (dom: HTMLElement & { __scrollComponent?: WithNavContent }) => {
  if (!dom.__scrollComponent) {
    dom.__scrollComponent = withScreenShow(NavContent, dom) as WithNavContent
  }
  return dom.__scrollComponent
}

const NavsContent = witchParentClass(
  <T extends object>(
    { 
      list,
      attachHeight = false,
      parent,
      active,
      ...props
    }: NavsContentProps<T>
  ) => {
    const refs: Array<WithScreenRef> = []

    React.useEffect(() => {
      let index 
      if (active && (index = list.indexOf(active)) > -1 && refs[index]) {
        refs[index].current?.goto({y: 'center'})
      }
    })


    const ItemContent = parent ? getNavContent(parent) : NavContent
    const children = list.map((item, i) => {
      const itemRef: WithScreenRef = React.createRef()
      refs.push(itemRef)
      return <ItemContent {...props} active={active} parent={parent as any} key={i} item={item} forwardRef={itemRef} />
    })

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



export const Navigation = witchParentClass(<T extends object>({
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
    const el = ref.current
    el && setEl(el)
  }, [ref])

  const content = NavsContent({
    active: active,
    list: list,
    parent: el,
    onClick: clickHandle,
    className: style['top-navs']
  })

  return (
    <div ref={ref}>
      <h4 className={style.title}>{title}</h4>
      {content}
    </div>
  )
})

export default Navigation