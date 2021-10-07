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


let token: { token: string; type: string; } | null = null
// 获取token
export const getToken = (code: string) => {
  if (token) {
    return Promise.resolve(token)
  } else {
    return axios.post(config.getToken, {
      client_id: clientId,
      client_secret: clientSecret,
      code
    }).then((res) => {
      const { access_token, token_type } = strToParams(res)
      if (access_token) {
        token = { 
          token: access_token, 
          type: token_type 
        }
        return token
      } else {
        return null
      }
    })
  }
}
