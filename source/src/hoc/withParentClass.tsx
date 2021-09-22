import * as React from 'react'
import { Component } from './index'

type WitchParentAttachProps = {
  className?: string
}

const cloneAttachElement = (instance: React.ReactElement<any>, attchClass: string): React.ReactElement => {
  const type = instance.type
  let children = instance.props.children
  let className = instance.props.className

  if (type === React.Fragment && children) {
    if (Array.isArray(children)) {
      children = children.map(
        item => cloneAttachElement(item, attchClass)
      )
    } else {
      children = cloneAttachElement(children, attchClass)
    }
  } else {
    className = className ? `${className} ${attchClass}` : attchClass
  }

  return React.cloneElement(
    instance,
    {
      ...instance.props,
      children,
      className
    }
  )
}


export const witchParentClass = <
  P extends object = {},
> (Component: Component<P>)  => {

  return ({ className, ...props }: P & WitchParentAttachProps, ref: any) => {
    const instance = Component(props as P, ref)
    return className && instance
      ? cloneAttachElement(instance, className)
      : instance
  }

}
