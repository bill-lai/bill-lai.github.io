import * as React from 'react'

let state: { [key: string]: any } = { }

export const statePromises: { [key: string]: Promise<any> } = { }

export const injeState = (data: { [key: string]: any }) => {
  state = {
    ...state,
    ...data
  }
}

export function useGlobalState<T>(
  key: string, 
  getPromise: () => Promise<T>,
): [T | undefined, React.Dispatch<React.SetStateAction<T>>]

export function useGlobalState<T>(
  key: string, 
  getPromise: () => Promise<T>,
  defaultVal: T
): [T, React.Dispatch<React.SetStateAction<T>>]

export function useGlobalState<T, K>(
  key: string, 
  getPromise: () => Promise<T>,
  transform: (data: T) => K,
): [K | undefined, React.Dispatch<React.SetStateAction<K | undefined>>]

export function useGlobalState<T, K>(
  key: string, 
  getPromise: () => Promise<T>,
  transform: (data: T) => K,
  defaultVal: T,
): [K, React.Dispatch<React.SetStateAction<K>>]


export function useGlobalState <T, K>(
  key: string, 
  getPromise: () => Promise<T>, 
  transform?: (data: T) => K,
  defaultVal?: T,
) {
  if (typeof transform !== 'function') {
    defaultVal = transform
    transform = void 0
  }

  if (key in state) {
    defaultVal = state[key]
  } else {
    const promise = statePromises[key] || getPromise()
    const statePromise = promise.then(
      data => {
        setValue(transform ? transform(data) : data)
        state[key] = data
        delete statePromises[key]
        return data
      }
    )

    statePromises[key] = statePromise
    statePromise.catch(() => delete statePromises[key])
  }

  
  const [value, setValue] = React.useState(() => 
    defaultVal && (transform ? transform(defaultVal) : defaultVal)
  )
  return [value, setValue]
}
