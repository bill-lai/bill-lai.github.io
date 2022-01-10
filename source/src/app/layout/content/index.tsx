import * as React from 'react'
import style from './style.module.scss'
import { ContentLayer, ContentLayerProps } from 'src/components/content-layer'

export type ContentProps = Omit<ContentLayerProps, 'bottom'>
export const Content = (props: ContentProps) => {
  return (
    <ContentLayer
      main={ props.main }
      right={ props.right }
      bottom={
        <div className={style.bottom}>
          <p>
            ©2021 - bill-lai 的小站 - 
            <a rel="noreferrer" href="https://github.com/bill-lai/bill-lai.github.io" target="_blank">站点源码</a>
          </p>
          <p>
            本站使用
            <a rel="noreferrer" target="_blank" href="https://react.docschina.org/docs/hooks-reference.html#usememo">ReactHook</a>
            <a rel="noreferrer" target="_blank" href="https://www.typescriptlang.org/zh/">TypeScript</a>
            <a rel="noreferrer" target="_blank" href="https://docs.github.com/cn/rest">githubAPI</a>
            <a rel="noreferrer" target="_blank" href="https://simplemde.com/">SimpleMDE</a>
            制作
          </p>
        </div>
      }
    />
  )
}

export default Content