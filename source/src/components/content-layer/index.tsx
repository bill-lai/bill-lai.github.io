import * as React from 'react'
import style from './style.module.scss'

type Layer = {
  main: React.ReactElement,
  right: React.ReactElement,
  bottom?: React.ReactElement
}

const ContentLayer = (props: Layer) => {
  return (
    <div className={style.layer}>
      <div className={`${style.main}`}>
        {props.main}
      </div>
      <div className={style.right}>
        { props.right }
      </div>
      {
        props.bottom && 
          <div className={style.bottom}></div>
      }
    </div>
  )
}

export default ContentLayer