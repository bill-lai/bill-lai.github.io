import { appName } from './constant'

type Platform = {
  setAppTitle: (title: string) => void,
  getAppTitle: () => string
}

let platform: undefined | Platform

export const injectPlatform = (current: Platform) => platform = current


type ApiNames = Array<keyof Platform>
type Api = {
  [key in keyof Platform]: Platform[key] 
}

const apiNames: ApiNames = [
  'getAppTitle'
]

export const api = {
  setAppTitle(title) {
    if (platform) {
      platform.setAppTitle((title && title + ` | `) + appName)
    }
  }
} as Api
apiNames.forEach(name => {
  (api as any)[name] = (...args: [any]) => 
    platform && platform[name](...args)
})

export default api