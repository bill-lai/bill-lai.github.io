import * as React from 'react'

export type WitchParentAttachProps = {
  className?: string
}

// export const witchParentClass = <
//   P extends object
// > (Component: React.ComponentType<P>)  => {
//   type PropsType = P & WitchParentAttachProps
  
//   return ({ className = '', ...props }: PropsType)  => 
//     <Component className={className ? className + ' ' : className} {...props as P} />
// }


type Component<P> =  {
  (props: React.PropsWithChildren<P>, context?: any): React.ReactElement<any, any> | null;
}


export const witchParentClass = <
  P extends object
> (Component: Component<P>)  => {
    type PropsType = P & WitchParentAttachProps
  
  return (props: P)  => 
    <Component {...props} />
}
