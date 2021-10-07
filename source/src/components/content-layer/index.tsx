import * as React from 'react'
import style from './style.module.scss'

type Layer = {
  main: React.ReactElement,
  right?: React.ReactElement,
  bottom?: React.ReactElement
}

const ContentLayer = (props: Layer) => {
  const [showRight, setShowRight] = React.useState(false)
  const rightClass = showRight ? style.active : ''

  return (
    <div className={style.layer}>
      <div className={`${style.main}`}>
        {props.main}
      </div>
      <div className={style['right-layer'] + ' ' + rightClass} onClick={() => setShowRight(!showRight)}>
        <div className={style.right}>
          <div className={style['right-content']}>
            { props.right }
          </div>
        </div>
      </div>
      {
        props.bottom && 
          <div className={style.bottom}></div>
      }
    </div>
  )
}

export default ContentLayer