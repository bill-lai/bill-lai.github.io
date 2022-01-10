import * as React from 'react'
import style from './style.module.scss'

export type ContentLayerProps = {
  main: React.ReactElement,
  right?: React.ReactElement,
  bottom?: React.ReactElement
}

export const ContentLayer = (props: ContentLayerProps) => {
  const [showRight, setShowRight] = React.useState(false)
  const rightClass = showRight ? style.active : ''

  return (
    <div className={style.layer}>
      <div className={`${style.main}`}>
        <div> {props.main} </div>
        { props.bottom }
      </div>
      <div className={style['right-layer'] + ' ' + rightClass} onClick={() => setShowRight(!showRight)}>
        <div className={style.right}>
          <div className={style['right-content']}>
            { props.right }
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContentLayer