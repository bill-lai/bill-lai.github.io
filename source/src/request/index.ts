import setup from './setup'
import * as urls from './config'
import Interfaces from './interface'
import { githubReqHandler, handlerUrls } from './github-api'



export const axios = setup<Interfaces, typeof githubReqHandler>(
  githubReqHandler
)

export * from './model'
export * from './interface'
export * as githubApi from './github-api'
export const config = urls
export * from './setup'
export * from './interface'

export default axios