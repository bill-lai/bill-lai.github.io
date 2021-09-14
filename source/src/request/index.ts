import * as config from './config'
import { ConfigType } from './config'
import {
  AxiosRequestConfig as BaseAxiosReqConfig,
  AxiosStatic as BaseAxiosStatic
} from 'axios'
import axios from 'axios'

export type url = typeof config[keyof typeof config]

type AxiosConfigArgBase = {
  url?: BaseAxiosReqConfig['url'],
  params?: BaseAxiosReqConfig['params'],
  data?: BaseAxiosReqConfig['data'],
  response?: any
}

type AxiosConfigArg<T extends url> = T extends keyof ConfigType 
  ? { [K in keyof ConfigType[T]]: ConfigType[T][K] } 
  : AxiosConfigArgBase

type AxiosReqConfig<
  T extends url,
  Proc = Omit<AxiosConfigArg<T>, 'response'>
> = Omit<BaseAxiosReqConfig, keyof Proc | 'url'> & Proc & {
  url?: T
}

type AxiosResData<T extends url> = Promise<AxiosConfigArg<T>['response']>
type AxiosReqData<T extends url> = 'data' extends keyof AxiosConfigArg<T>
  ? AxiosConfigArg<T>['data']
  : null
type AxiosGivenReqData<T extends url> = Omit<AxiosReqConfig<T>, 'method'>

interface AxiosInstance {
  getUri<T extends url>(config?: AxiosReqConfig<T>): string;
  request<T extends url>(config: AxiosReqConfig<T>): AxiosResData<T>;
  get<T extends url>(url: T, config?: AxiosGivenReqData<T>): AxiosResData<T>;
  delete<T extends url>(url: T, config?: AxiosGivenReqData<T>): AxiosResData<T>;
  head<T extends url>(url: T, config?: AxiosGivenReqData<T>): AxiosResData<T>;
  options<T extends url>(url: T, config?: AxiosGivenReqData<T>): AxiosResData<T>;
  post<T extends url>(url: T, data: AxiosReqData<T>, config?: AxiosGivenReqData<T>): AxiosResData<T>;
  put<T extends url>(url: T, data?: AxiosReqData<T>, config?: AxiosGivenReqData<T>): AxiosResData<T>;
  patch<T extends url>(url: T, data?: AxiosReqData<T>, config?: AxiosGivenReqData<T>): AxiosResData<T>;
}

export type AxiosStatic = Omit<BaseAxiosStatic, keyof AxiosInstance> & AxiosInstance & {
  create<T extends url>(config?: AxiosReqConfig<T>): AxiosInstance;
}

let test: AxiosStatic = axios

test.post('a', null, { params: {id: 1} })
test.request({
  url: 'a',
  method: 'GET',
  params: { id: 2 }
})

export default axios as AxiosStatic