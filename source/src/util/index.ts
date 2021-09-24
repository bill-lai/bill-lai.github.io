// 节流
export const throttle = (fn: Function, delay: number = 160) => {
  let previous = 0

  return function<Args extends Array<any>, This>(
    this: This, ...args: Args
  ) {
    const now = Date.now()
    if (now - previous >= delay) {
      fn.apply(this, args)
      previous = now
    }
  }
}

// 防抖
export const debounce = (fn: Function, delay: number = 160) => {
  let timeout: NodeJS.Timeout

  return function<Args extends Array<any>, This>(
    this: This, ...args: Args
  ) {
    clearTimeout(timeout)
    setTimeout(() => {
      fn.apply(this, ...args)
    }, delay)
  }
}
