import { axios, config } from './index'
import { strToParams } from 'src/util'

const clientId = 'dbac9f422a3f03c121f1'
const clientSecret = '26a67f075778cac68d6d2fc7e4e5086519745009'
const redirectUri = 'https://bill-lai.github.io/auth'
const OriginKey = `originPathname`

// 获取用户信息
export const getUserInfo = () =>
  axios.get(config.getUserInfo)
    .catch(() => {
      sessionStorage.setItem(OriginKey, window.location.pathname)

      window.location.href = axios.getUri({
        url: config.authorize,
        params: {
          client_id: clientId,
          redirect_uri: redirectUri,
        }
      })
    })

export const recoveryHist = () => {
  const pathname = sessionStorage.getItem(OriginKey) || '/'
  if (pathname !== window.location.pathname) {
    window.location.pathname = pathname
  }
}


// 获取token
export const getToken = (code?: string) => {
  const cacheGetToken = sessionStorage.getItem('getToken')
  if (cacheGetToken) {
    const { code: ccode, token: ctoken } = JSON.parse(cacheGetToken)

    if (!code && ccode === code) {
      return Promise.resolve(ctoken)
    }
  } else if (code) {
    return axios.post(config.getToken, {
      client_id: clientId,
      client_secret: clientSecret,
      code
    }).then((res) => {
      const { access_token } = strToParams(res)
      if (access_token) {
        sessionStorage.setItem('getToken', JSON.stringify({code, token: access_token}))
        return access_token 
      } else {
        return null
      }
    })
  }

  return Promise.resolve(null)
}
