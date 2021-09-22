import setup from './setup'
import * as urls from './config'
import Interface from './interface'


export const axios = setup<Interface, typeof urls>(urls)
export const config = urls

export * from './model'
export * from './interface'

export default axios