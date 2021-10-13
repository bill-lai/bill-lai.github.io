import setup, { InterceptNeeds } from './setup'
import * as urls from './config'
import Interfaces from './interface'
import { githubReqHandler, handlerUrls } from './github-api'



export const axios = setup<Interfaces, typeof handlerUrls>(
  urls,
  githubReqHandler
)

export * from './model'
export * from './interface'
export * as githubApi from './github-api'
export const config = urls
export * from './setup'
export * from './interface'

export default axios