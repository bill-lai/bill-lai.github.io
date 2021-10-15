import setupFactory from './setup'
import * as urls from './config'
import Interfaces from './interface'
import { githubReqHandler } from './github-api'


// type a = {
//   client_id: string,
//   redirect_uri: string,
//   scope: string
// }

// let handler = () => {
//   return { client_id: '123' }
// }

// type Extract

export const axios = setupFactory<Interfaces>()(githubReqHandler)

export * from './model'
export * from './interface'
export * as githubApi from './github-api'
export const config = urls
export * from './setup'
export * from './interface'

export default axios