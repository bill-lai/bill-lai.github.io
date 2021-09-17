import * as React from 'react'

export type WitchParentAttachProps = {
  className?: string
}

type functionComponent<P> = (props: P) => React.ReactElement<any, any>

export const witchParentClass = <
  P extends object = {},
> (Component: functionComponent<P>)  => {
  type PropsType = P & WitchParentAttachProps
  
  const fn = ({ className = '', ...props }: PropsType)  => {
    const instance = React.cloneElement(Component(props as P))
    const type = (instance as any).type

    if (type === React.Fragment) {

    }
    console.log(instance)
    return instance
  }
    // <Component className={className ? className + ' ' : className} {...props as P} />

  // return fn as functionComponent<P>
  return fn
}
