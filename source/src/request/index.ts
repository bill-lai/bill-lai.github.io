import { 
  setupFactory, 
  ExtractInterfacesURL, 
  ExtractInterfacesMethodURL, 
  ExtractInterfacesMethod,
  defVoid,
  ExtractInterface
} from './setup'
import * as urls from './config'
import Interfaces from './interface'


// 所有method
export type Method = ExtractInterfacesMethod<Interfaces>

// 获取接口
export type URL<T extends Method | defVoid = defVoid> = 
  T extends defVoid
    ? ExtractInterfacesURL<Interfaces>
    : ExtractInterfacesMethodURL<Interfaces, T>

// 获取指定接口声明
export type Interface<
  T extends URL, 
  R extends Method | defVoid = defVoid
> = ExtractInterface<Interfaces, T, R>
  
    

export const axios = setupFactory<Interfaces>()

export * from './model'
export * from './interface'
export * as githubApi from './github-api'
export const config = urls
export * from './setup'
export * from './interface'

export default axios