import * as React from 'react'
import ReactLoading from 'react-loading'
import style from './style.module.scss'

export type LoadRef = React.RefObject<{
  startLoading: () => void,
  stopLoading: () => void
}>

export const Loading = React.forwardRef<LoadRef['current'], { status?: boolean }>(
  ({ status = false }, ref) => {
    const [loading, setLoading] = React.useState(status)

    React.useImperativeHandle(ref, () => ({
        startLoading: () => setLoading(true),
        stopLoading: () => setLoading(false)
    }))
    
    return loading 
      ? (
          <div className={style.layer}>
            <ReactLoading 
              type='bubbles' 
              color='var(--vice-color)' 
              height='64px' 
              width='64px' 
            />
          </div>
        )
      : null
    }
)


export default Loading