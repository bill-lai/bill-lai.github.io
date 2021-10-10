import { equalUrl, gendUrl } from 'src/util'
import axios, {
  Method as BaseMethod,
  AxiosRequestConfig as BaseAxiosReqConfig,
  AxiosStatic as BaseAxiosStatic,
  AxiosResponse as BaseAxiosResponse
} from 'axios'


type AxiosConfigArgBase = {
  url: BaseAxiosReqConfig['url'],
  params?: BaseAxiosReqConfig['params'],
  data?: BaseAxiosReqConfig['data'],
  response?: any
}

type AxiosConfigArg<Config, URL> = URL extends keyof Config 
  ? { [K in keyof Config[URL]]: Config[URL][K] } 
  : AxiosConfigArgBase

type AxiosReqConfig<
  Config,
  URL,
  Proc = Omit<AxiosConfigArg<Config, URL>, 'response'>
> = Omit<BaseAxiosReqConfig, keyof Proc | 'url'> & Proc & {
  url?: URL
}

type AxiosResData<Config, URL> = Promise<
  'response' extends keyof AxiosConfigArg<Config, URL> 
    ? AxiosConfigArg<Config, URL>['response'] 
    : any
>

type AxiosReqData<Config, URL> = 'data' extends keyof AxiosConfigArg<Config, URL>
  ? AxiosConfigArg<Config, URL>['data']
  : null
type AxiosGivenReqData<Config, URL> = Omit<AxiosReqConfig<Config, URL>, 'method'>

type GivenUrl<Config, M extends BaseAxiosReqConfig['method']> = {
  [K in keyof Config ]: 'method' extends keyof Config[K] 
    ? Config[K]['method'] extends M 
      ? K 
      : never
    : never
}[keyof Config]


interface AxiosInstance<
  Config, 
  URLS,
> {
  getUri<URL extends URLS>(config?: AxiosReqConfig<Config, URL>): string;
  request<URL extends URLS>(config: AxiosReqConfig<Config, URL>): AxiosResData<Config, URL>;
  get<URL extends GivenUrl<Config, 'GET'>>(url: URL, config?: AxiosGivenReqData<Config, URL>): AxiosResData<Config, URL>;
  delete<URL extends GivenUrl<Config, 'DELETE'>>(url: URL, config?: AxiosGivenReqData<Config, URL>): AxiosResData<Config, URL>;
  head<URL extends GivenUrl<Config, 'HEAD'>>(url: URL, config?: AxiosGivenReqData<Config, URL>): AxiosResData<Config, URL>;
  options<URL extends GivenUrl<Config, 'OPTIONS'>>(url: URL, config?: AxiosGivenReqData<Config, URL>): AxiosResData<Config, URL>;
  post<URL extends GivenUrl<Config, 'POST'>>(url: URL, data: AxiosReqData<Config, URL>, config?: AxiosGivenReqData<Config, URL>): AxiosResData<Config, URL>;
  put<URL extends GivenUrl<Config, 'PUT'>>(url: URL, data?: AxiosReqData<Config, URL>, config?: AxiosGivenReqData<Config, URL>): AxiosResData<Config, URL>;
  patch<URL extends GivenUrl<Config, 'PATCH'>>(url: URL, data?: AxiosReqData<Config, URL>, config?: AxiosGivenReqData<Config, URL>): AxiosResData<Config, URL>;
}

export type AxiosStatic<Config, URLS = keyof Config> = 
  Omit<BaseAxiosStatic, keyof AxiosInstance<Config, URLS>> & AxiosInstance<Config, URLS> & {
    create<T extends URLS>(config?: AxiosReqConfig<Config, T>): AxiosInstance<Config, URLS>;
  }

export type NeedHeadReq<URL> = {
  handler: () => {[key in keyof BaseAxiosReqConfig]: 
    BaseAxiosReqConfig[key]} | undefined,
  errHandler?: (res?: BaseAxiosResponse) => void,
  urls: Array<URL>
}
export type NeedHeadReqs<URL> = Array<NeedHeadReq<URL>> 

export type BaseInterfaces = {
  [key in BaseMethod]?: Array<AxiosConfigArgBase>
}

export type MethodURLS<Interfaces, T extends keyof Interfaces> = 
Interfaces[T] extends Array<{url: infer U}> ? U : string

export type URLS<Interfaces> = Interfaces extends 
  { [key: string]: Array<{url: infer U}> } 
    ? U : string

export type Interface<Interfaces, URL> = {
  [Method in keyof Interfaces] : 
    URL extends MethodURLS<Interfaces, Method> 
      ? {
          [ iteratorkey in keyof Interfaces[Method] ]:
            Interfaces[Method][iteratorkey] extends {url: string}
              ? Interfaces[Method][iteratorkey]['url'] extends URL
                ? Interfaces[Method][iteratorkey] & { method: Method }
                : never
              : never
        }[keyof Interfaces[Method]]
      : never
}[keyof Interfaces]


let isSetup = false
const setupAxios = <
  Interfaces extends BaseInterfaces, 
  URL = Interfaces extends 
    { [key: string]: Array<{url: infer U}> } 
      ? U : string,
  Instance = Interface<Interfaces, URL>,
  RetAxios = AxiosStatic<Instance, URL>,
>(
  urlMaps: { [key: string]: URL }, 
  _needHeadReqs: NeedHeadReqs<URL> | NeedHeadReq<URL> = [],
  notLoadUrls = Object.values(urlMaps)
) => {
  if (isSetup) return axios as unknown as RetAxios

  const urls = Object.values(urlMaps)
  const needHeadReqs = !Array.isArray(_needHeadReqs) 
    ? [_needHeadReqs] 
    : _needHeadReqs

  const includesUrl = (urls: Array<URL>, url: string) =>
    urls.some(tempUrl => equalUrl(tempUrl as unknown as string, url))

  const needHeadHandler = (
    url: string, 
    handler: (config: NeedHeadReq<URL>) => void
  ) => {
    needHeadReqs.forEach(config => {
      includesUrl(config.urls, url) && handler(config)
    })
  }

  const stopRequest = () => {
    const source = axios.CancelToken.source()
    source.cancel('Illegal request')
  }

  const errorHandler = (
    res: BaseAxiosResponse, 
    msg: string = '出了点小问题'
  ) => {
    if (res.config && res.config.url) {
      needHeadHandler(res.config.url, ({errHandler}) => {
        errHandler && errHandler()
      })
    }
    return Promise.reject(res)
  }

  axios.interceptors.request.use(config => {
    if (config.url) {
      config.url = gendUrl(config.url, config.params)
    }

    if (!config.url || !includesUrl(urls, config.url)) {
      stopRequest();
      return config 
    }

    needHeadHandler(config.url, ({handler}) => {
      const addConfig: any = handler()
      if (addConfig) {
        const retConfig: any = config
        for (const key in addConfig) {
          retConfig[key] = retConfig[key]
            ? { 
                ...retConfig[key], 
                ...addConfig[key]
              } 
            : addConfig[key]
        }
        return retConfig
      }
    })

    if (includesUrl(notLoadUrls, config.url)) {
      return config
    } else {
      return config
    }
  })

  axios.interceptors.response.use(res => {
    if (res.status < 200 || res.status >= 300) {
      return errorHandler(res)
    } else {
      return res.data
    }
  }, errorHandler)

  return axios as unknown as RetAxios
}

export default setupAxios
