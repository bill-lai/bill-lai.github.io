import axios from 'src/request'
import * as config from 'src/request/config'
import { strToParams } from 'src/util'
import { 
  getStoreTokenConfig, 
  makerHist, 
  setStoreTokenConfig 
} from './cache'
import {
  clientId,
  clientSecret,
  owner,
  redirectUri,
  repo,
  scope,
  issuesLabel
} from 'src/constant'



// 本地是否已授权
export const isLocalAuth = () => {
  const tokenConfig = getStoreTokenConfig()
  return !!(tokenConfig && tokenConfig.token)
}

// 获取授权链接
export const getAuthLink = () => {
  makerHist()

  return axios.getUri({
    url: config.authorize,
    params: {
      client_id: clientId,
      redirect_uri: redirectUri,
      scope,
    }
  })
}

// 跳转到授权
export const auth = () => {
  window.location.href = getAuthLink()
}


// 获取token
export const getToken = (code?: string) => {
  const tokenConfig = getStoreTokenConfig()
  if (tokenConfig) {
    if (!code && tokenConfig.code === code) {
      return Promise.resolve(tokenConfig.token)
    }
  } 
  
  if (code) {
    return axios.post(config.token, {
      client_id: clientId,
      client_secret: clientSecret,
      code
    }).then((res) => {
      
      const { access_token } = strToParams(res)
      if (access_token) {
        setStoreTokenConfig({code, token: access_token})
        return access_token 
      } else {
        return null
      }
    })
  } else {
    return Promise.resolve(null)
  }
}

// 接口附加拦截
export const authIntercept = {
  reqHandler() {
    const tokenConfig = getStoreTokenConfig()
    if (!tokenConfig) {
      throw new Error('未登录')
    } else {
      return {
        headers: {
          Authorization: `token ${tokenConfig.token}`
        }
      }
    }
  },
  urls: [
    config.userInfo,
    [config.comments, 'POST'],
    [config.comment, 'DELETE'],
    [config.comment, 'PATCH'],
    [config.articleReactions, 'POST'],
    [config.articleReaction, 'DELETE'],
    [config.commentReactions, 'POST'],
    [config.commentReaction, 'DELETE'],
  ] as const
}

// 路径拦截器
export const pathIntercepet = {
  reqHandler: () => ({ paths: { owner, repo } }),
  urls: [
    config.comments,
    config.articleReactions,
    config.articleReaction,
    config.commentReactions,
    config.commentReaction,
    config.comment
  ] as const
}

export const commentIntercepet = {
  reqHandler: (config: any) => {
    if (config.method.toUpperCase() === 'GET') {
      return {
        params: {
          labels: issuesLabel
        }
      }
    } else if (config.method.toUpperCase() === 'POST') {
      config.data.labels.push(issuesLabel)
    }
  },
  urls: [
    config.comments
  ] as const
}