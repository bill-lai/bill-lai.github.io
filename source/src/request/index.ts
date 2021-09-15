import { AxiosStatic } from './setup'
import baseAxios from 'axios'
import * as urls from './config'
import Interface from './interface'

type URLS = typeof urls[keyof typeof urls]

export const axios = baseAxios as AxiosStatic<Interface, URLS>
export const config = urls

export * from './model'
export * from './interface'

export default axios