import * as React from 'react'
import { Component } from './index'

type ShowChange = (isShow: boolean) => void
type WithScreenAttachProps = { onShowChange: ShowChange }
type Ele = React.ReactElement<any>
type Ref = React.RefObject<HTMLElement | null>

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
  const viewMapEles = new Map<HTMLElement, Array<HTMLElement>>()
  const scrollHandler = function(this: HTMLElement) {
    if (!viewMapEles.has(this)) return;

    const eles = viewMapEles.get(this)

    console.log(eles)

  }

  return (view: HTMLElement, eles: Array<HTMLElement>) => {
    if (viewMapEles.has(view)) {
      viewMapEles.get(view)!.push(...eles)
    } else {
      view.addEventListener('scroll', scrollHandler)
      viewMapEles.set(view, eles)
    }
    return () => {
      const mapEles = viewMapEles.get(view)
      if (mapEles) {
        for (let i = mapEles.length - 1; i >= 0; i--) {
          if (eles.includes(mapEles[i])) {
            mapEles.splice(i, 1)
          }
        }
        if (mapEles.length) return;
      }
      console.log('remove')
      view.removeEventListener('scroll', scrollHandler)
    }
  }
})();

export const withScreenShow = <P extends object>(
  component: Component<P>, 
  view: HTMLElement = window as unknown as HTMLElement
) => {
  return ({ onShowChange, ...props }: P & WithScreenAttachProps, ref: any) => {
    const instance = component(props as P, ref)
    if (instance) {
      const [newInstance, refs] = GrentRefsAndCloneElement(instance)

      React.useEffect(() => 
        listenElesAppear(
          view, 
          refs.map(ref => ref.current)
            .filter(Boolean) as Array<HTMLElement>
        ) 
      )
      return newInstance
    } else {
      return instance
    }
  }
}
