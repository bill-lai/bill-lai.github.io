import * as React from 'react'
import { Component } from './index'
import { throttle } from 'src/util'

export type WithScreenRef = React.RefObject<{ goto: (offset?: Offset) => void } | null>
type ShowChange = (isShow: boolean) => void
type WithScreenAttachProps = { onShowChange?: ShowChange, forwardRef?: WithScreenRef }
type Ele = React.ReactElement<any>
type Ref = React.RefObject<HTMLElement | null>
type Offset = { x: number, y: number }
type ViewBox = { width: number, height: number, x: number, y: number }
type View = (Window | HTMLElement) & { __WithScreenViewBox?: ViewBox }

const setSignElement = (
  instance: Ele,
  refs: Array<Ref>,
  children?: Array<Ele>,
) => {
  const [cloneInstance, eleRefs] = GrentRefsAndCloneElement(instance)
  children && children.push(cloneInstance)
  refs.push(...eleRefs)
  return children
}

const GrentRefsAndCloneElement = (instance: Ele): [Ele, Array<Ref>] => {
  const refs: Array<Ref> = []
  const attachProps: any = {}
  const type = instance.type
  
  if (type === React.Fragment || typeof type !== 'string') {
    let children = instance.props.children
    if (children) {
      children = Array.isArray(children)
        ? children.map(ele => setSignElement(ele, refs))
        : setSignElement(children, refs)
    }
    attachProps.children = children
  } else {
    let ref: Ref = React.createRef();
    attachProps.ref = ref
    refs.push(ref)
  }

  const newInstance = React.cloneElement(
    instance, 
    {
      ...instance.props,
      ...attachProps
    }
  )

  return [newInstance, refs]
}


const getBox = (view: View) => view.__WithScreenViewBox
const setBox = (view: View, box: ViewBox)  => {
  view.__WithScreenViewBox = box
  Promise.resolve().then(() => delete view.__WithScreenViewBox)
  return box
}

const getViewBoundingRect = (view: View): ViewBox => 
  getBox(view) || setBox(
    view, 
    view === window 
      ? {
          x: view.scrollX,
          y: view.scrollY,
          width: view.innerWidth,
          height: view.innerHeight
        } 
      : {
        x: (view as HTMLElement).scrollLeft,
        y: (view as HTMLElement).scrollTop,
        width: (view as HTMLElement).clientWidth,
        height: (view as HTMLElement).clientHeight,
      }
  )


const getBoundingPageRect = (view: View, el: HTMLElement) => {
  const base = {
    width: el.offsetWidth,
    height: el.offsetHeight,
  }

  if (view !== window) {
    let parent: HTMLElement | false = el
    let x = 0, y = 0
    while (parent && parent !== view && parent !== document.documentElement) {
      x += parent.offsetLeft
      y += parent.offsetTop
      parent = parent.offsetParent instanceof HTMLElement && parent.offsetParent
    }

    return {
      ...base,
      x,
      y
    }
  } else {
    const elRect = el.getBoundingClientRect()
    const viewRect = getViewBoundingRect(view) 
    return {
      ...base,
      x: viewRect.x + elRect.x,
      y: viewRect.y + elRect.y
    }
  }
}

const isShowViewAppear = (view: View, el: HTMLElement) => {
  const elRect = getBoundingPageRect(view, el)
  const viewRect = getViewBoundingRect(view)

  return !(elRect.x > viewRect.x + viewRect.width || 
    viewRect.x > elRect.x + elRect.width ||
    elRect.y > viewRect.y + viewRect.height ||
    viewRect.y > elRect.y + elRect.height)
}


const listenElesAppear = (() => {
  const viewMaps = new Map<
    View, 
    Array<{ eles: Array<HTMLElement>, cb: ShowChange, previous?: boolean }>
  >()

  const scrollHandler = throttle(
    function (this: View) {
      if (!viewMaps.has(this)) return;
      const maps = viewMaps.get(this)

      maps!.forEach(map => {
        const { eles, cb, previous } = map
        const isShow = eles.some(ele => isShowViewAppear(this, ele))
        if (isShow !== !!previous) {
          cb(isShow)
          map.previous = isShow
        }
      })
    }
  )

  return (view: View, eles: Array<HTMLElement>, onShowChange: ShowChange) => {
    const item = { eles, cb: onShowChange }
    let maps = viewMaps.get(view)
    
    if (!maps) {
      maps = []
      viewMaps.set(view, maps)
      view.addEventListener('scroll', scrollHandler)
    }
    // 自动触发第一次
    Promise.resolve().then(() => scrollHandler.bind(view)())
    maps.push(item)

    return () => {
      const maps = viewMaps.get(view)
      const index = maps!.indexOf(item)
      if (index > -1) {
        maps!.splice(index, 1)
        if (maps!.length) return;
      }
      viewMaps.delete(view)
      view.removeEventListener('scroll', scrollHandler)
    }
  }
})();

export const withScreenShow = <P extends object>(
  component: Component<P>, 
  view: View = window
) => {
  return ({ onShowChange, forwardRef, ...props }: P & WithScreenAttachProps, ref?: any) => {
    const instance = component(props as P, ref)
    if (instance && (onShowChange || forwardRef)) {
      const [newInstance, refs] = GrentRefsAndCloneElement(instance)
      const getEles = () => refs.map(ref => ref.current)
        .filter(Boolean) as Array<HTMLElement>

      if (onShowChange) {
        React.useEffect(() => 
          listenElesAppear(view, getEles(), onShowChange) 
        )
      }

      if (forwardRef) {
        React.useImperativeHandle(forwardRef, () => ({
          goto(offset?: Offset) {
            const eles = getEles()
            if (eles.length) {
              const rect = getBoundingPageRect(view, eles[0])
              if (offset) {
                view.scrollTo(rect.x + offset.x, rect.y + offset.y)
              } else {
                view.scrollTo(rect.x, rect.y)
              }
            }
          }
        }))
      }

      return newInstance
    } else {
      return instance
    }
  }
}

class Helper <T extends object > {
  Return = withScreenShow<T>(() => <div />)
}
export type FuncReturnType<T extends Component<Parameters<T>[0]>> = Helper<Parameters<T>>['Return']