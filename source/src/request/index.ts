import setup from './setup'
import * as urls from './config'
import Interface, { _Interfaces } from './interface'
import { githubReqHandler } from './github-api'

export const axios = setup<_Interfaces>(
  urls,
  githubReqHandler
)

export * from './model'
export * from './interface'
export * as githubApi from './github-api'
export const config = urls
export { NeedHeadReq, NeedHeadReqs } from './setup'

export default axios