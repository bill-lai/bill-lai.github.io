import { AxiosStatic } from './setup'


import * as config from './config'
import { ConfigType } from './config'
export type url = typeof config[keyof typeof config]
  
  

export default axios as AxiosStatic<ConfigType>