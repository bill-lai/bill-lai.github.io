import { axios, InterceptsConfig, Interfaces } from './index'
import * as config from './config'
import { strToParams } from 'src/util'
import { ReactionContent } from './model'
import { ExtractShareAND, ExtractShareOR } from './share'

const clientId = 'dbac9f422a3f03c121f1'
const clientSecret = '26a67f075778cac68d6d2fc7e4e5086519745009'
const redirectUri = 'https://bill-lai.github.io/auth'
const baseOR = {
  owner: `bill-lai`,
  repo: `bill-lai.github.io`
}
const issuesLabel = [`${baseOR.owner}-blog`]
const retunf = Promise.resolve(undefined)

const scope = `public_repo`
const OriginKey = `originPathname`
const GetTokenKey = `getToken`
const store = sessionStorage

type SessionToken = {
  token: string,
  code: string
}

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

export const handlerUrls = [
  [
    config.getUserInfo,
    config.addArticleReaction,
    config.delArticleReaction
  ] as const,
  [
    config.postComment,
    config.getArticleReactions,
    config.addArticleReaction,
    config.delArticleReaction
  ] as const
] as const


export const githubReqHandler = [
  // 需要token的接口处理
  {
    reqHandler(config) {
      const tokenConfig = getStoreTokenConfig()
      if (tokenConfig) {
        return {
          headers: {
            Authorization: tokenConfig.token
          }
        }
      } else {
        throw '123'
      }
    },
    errHandler: delStoreTokenConfig,
    urls: handlerUrls[0]
  },
  // 需要添加baseOR的链接
  {
    reqHandler(config) {
      return {
        params: baseOR
      }
    },
    urls: handlerUrls[1]
  }
] as const


// 本地是否已授权
export const isLocalAuth = () => {
  const tokenConfig = getStoreTokenConfig()
  return !!(tokenConfig && tokenConfig.token)
}

// 获取授权链接
export const getAuthLink = () => {
  store.setItem(OriginKey, window.location.pathname)

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
axios.test.GET.

// 获取用户信息
export const getUserInfo = async (isAuth = false) => 
  axios.get(config.getUserInfo)
    .catch(() => {
      isAuth && auth()
      return retunf
    })

// 恢复上次跳转授权
export const recoveryHist = () => {
  const pathname = store.getItem(OriginKey) || '/'
  if (pathname !== window.location.pathname) {
    window.location.pathname = pathname
    store.removeItem(OriginKey)
  }
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
    return axios.post(config.getToken, {
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


type AddCommitBody = {
  id: string,
  title: string,
  content: string
}
// 添加评论
export const addCommit = (body: AddCommitBody) => {
  const data = {
    labels: [...issuesLabel, body.id],
    body: body.content
  }


  return axios.post(
    config.postComment,
    data,
    { params: baseOR }
  )
}

// 获取评论列表
export const getCommits = (id: number) => {
  console.log(id)
  return axios.get(config.getComment, {
    params: { ...baseOR, labels: '' }
  }).catch(() => [])
}


export const getArticleReactions = (id: number) => 
  axios.get(config.getArticleReactions, {
    params: { ...baseOR, id }
  })

export const addArticleReaction = (issueId: number, content: ReactionContent) => {
  return axios.post(config.addArticleReaction, 
    { content },
    { params: { ...baseOR, id: issueId } }
  )
}

export const delArticleReaction = (issueId: number, reactionId: number) =>
  axios.delete(config.delArticleReaction, {
    params: {
      ...baseOR,
      id: issueId,
      reactionId
    }
  })