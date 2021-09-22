import * as React from 'react'
import { Component } from './index'
import { throttle } from 'src/util'

export type WithScreenRef = React.RefObject<{ goto: Function } | null>
type ShowChange = (isShow: boolean) => void
type WithScreenAttachProps = { onShowChange?: ShowChange, forwardRef?: WithScreenRef }
type Ele = React.ReactElement<any>
type Ref = React.RefObject<HTMLElement | null>
type ViewBox = { width: number, height: number, x?: number, y?: number }
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

const listenElesAppear = (() => {
  const viewMaps = new Map<
    View, 
    Array<{ eles: Array<HTMLElement>, cb: ShowChange, previous?: boolean }>
  >()

  const getBox = (view: View) => view.__WithScreenViewBox
  const setBox = (view: View, box: ViewBox) => {
    view.__WithScreenViewBox = box
    Promise.resolve().then(() => delete view.__WithScreenViewBox)
    return box
  }


  const getBoundingClientRect = (view: HTMLElement, el: HTMLElement) => {
    let parent: HTMLElement | false = el
    let x = 0, y = 0
    while (parent && parent !== view && parent !== document.documentElement) {
      x += parent.offsetTop
      y += parent.offsetLeft
      parent = parent.offsetParent instanceof HTMLElement && parent.offsetParent
    }

    return {
      width: el.offsetWidth,
      height: el.offsetHeight,
      x,
      y
    }
  }

  const isShowViewAppear = (view: View, el: HTMLElement) => {
    if (view === window) {
      const elRect = el.getBoundingClientRect()

      if (elRect.x > -elRect.width && elRect.y > -elRect.height ) {
        if (elRect.x <= 0 && elRect.y <= 0) return true

        const box = getBox(view) || setBox(view, {
          width: view.innerWidth,
          height: view.innerHeight
        });
        return elRect.x < box.width && elRect.y < box.height
      }
    } else {
      // const elRect = getBoundingClientRect(view as HTMLElement, el)

      return false
    }

    return false
  }

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
  return ({ onShowChange, forwardRef, ...props }: P & WithScreenAttachProps, ref: any) => {
    const instance = component(props as P, ref)
    if (instance && (onShowChange || forwardRef)) {
      const [newInstance, refs] = GrentRefsAndCloneElement(instance)

      if (onShowChange) {
        React.useEffect(() => 
          listenElesAppear(
            view, 
            refs.map(ref => ref.current)
              .filter(Boolean) as Array<HTMLElement>,
            onShowChange
          ) 
        )
      }

      if (forwardRef) {
        React.useImperativeHandle(forwardRef, () => ({
          goto() {
            console.log('enen')
          }
        }))
      }

      return newInstance
    } else {
      return instance
    }
  }
}
