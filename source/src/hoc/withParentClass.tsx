import * as React from 'react'
import Test from 'src/components/column-item'

type AfferentComponent = React.FC<any>
type GetProps<T extends AfferentComponent> = React.ComponentProps<T>

type GetComponent<T> = 
  T extends AfferentComponent 
    ? React.FC<GetProps<T> & AttachProps>
    : React.FC<AttachProps>

type AttachProps = {
  className?: string
}

const witchParentClass = (Component: AfferentComponent): GetComponent<AfferentComponent>  => {
  return (props: GetProps<AfferentComponent>) => {
    return <Component {...props} className="" />
  }
}


const ATest = witchParentClass(Test)

const a = <ATest />

export default witchParentClass