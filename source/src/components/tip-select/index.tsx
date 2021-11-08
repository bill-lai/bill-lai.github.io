import * as React from 'react';
import style from './style.module.scss'
import { createPortal } from 'react-dom'
import { getPostionByTarget } from 'src/util';

export type TipSelectProps = {
  children: any
}

export type TipProps = {
  children: any,
  parent?: HTMLElement,
  target: HTMLElement
}
export const Tip = ({
  children,
  parent = document.documentElement,
  target
}: TipProps) => {
  const { x, y } = getPostionByTarget(target, parent, true)
  const width = 140

  const selectEle = createPortal(
    <div 
      className={style['tip-layer']} 
      style={{
        width: width + 'px',
        left: x - width + 'px', 
        top: y + 'px'
      }}>
      { children }
    </div>,
    parent
  )
  
  return selectEle
}

export type SelectOption = { 
  label: string, 
  value: string,
  warn?: boolean
}
export type SelectProps = {
  options: Array<SelectOption>
  onSelect?: (option: SelectOption) => void
}
export const Select = ({
  options,
  onSelect
}: SelectProps) => {
  return (
    <div className={style['select-layer']}>
      {options.map(option => 
        <div 
          key={option.value}
          onClick={() => onSelect && onSelect(option)}
          className={option.warn ? style['warn'] : ''}>
          {option.label}
        </div>
      )}
    </div>
  )
}

export const TipSelect = ({
  children,
  options,
  onSelect
}: TipSelectProps & SelectProps) => {
  const parent = document.body
  const [placeDOM, setPlaceDOM] = React.useState<HTMLSpanElement | null>(null)
  const [showSelect, setShowSelect] = React.useState(false)
  const placeClickHanlder = (ev: React.MouseEvent<HTMLSpanElement>) => {
    setShowSelect(true)
    ev.stopPropagation()
  }

  React.useEffect(() => {
    let isUninstall = false
    const clickHandler = () => {
      setTimeout(() => {
        isUninstall || setShowSelect(false)
      })
    }

    parent.addEventListener('click', clickHandler)
    return () => {
      parent.removeEventListener('click', clickHandler)
      isUninstall = true
    }
  }, [parent])

  return (
    <React.Fragment>
      <span 
        className={style.place} 
        onClick={placeClickHanlder} 
        ref={el => setPlaceDOM(el)}>
          {children}
      </span>
      { showSelect && placeDOM
        ? <Tip parent={parent} target={placeDOM} >
            <Select options={options} onSelect={onSelect} />
          </Tip> 
        : null 
      }
    </React.Fragment>
  )
}