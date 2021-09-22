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