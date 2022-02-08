const store = global.sessionStorage || {
  getItem() {
    return undefined
  },
  setItem() {

  },
  removeItem() {
    
  }
}

type SessionToken = {
  token: string,
  code: string
}
const GetTokenKey = `getToken`

// 获取token配置
export const getStoreTokenConfig = (): SessionToken | null => {
  const token = store.getItem(GetTokenKey)
  if (token) {
    try {
      return JSON.parse(token)
    } catch {
      store.removeItem(GetTokenKey)
    }
  }
  return null
}

// 设置token配置
export const setStoreTokenConfig = (config: SessionToken) => 
  store.setItem(GetTokenKey, JSON.stringify(config))

// 删除token配置
export const delStoreTokenConfig = () =>
  store.removeItem(GetTokenKey)





const Hist = `originPathname`

// 恢复上次跳转授权
export const recoveryHist = () => {
  const pathname = store.getItem(Hist) || '/'
  if (pathname !== window.location.pathname) {
    window.location.pathname = pathname
    store.removeItem(Hist)
  }
}

export const makerHist = (url?: string) =>
  store.setItem(Hist, url || window.location.pathname)