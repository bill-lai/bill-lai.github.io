import setup from './setup'
import * as urls from './config'
import Interface from './interface'
import { githubReqHandler } from './github-api'

export const axios = setup<Interface, typeof urls>(
  urls,
  [githubReqHandler]
)

export * from './model'
export * from './interface'
export * as githubApi from './github-api'
export const config = urls

export default axios