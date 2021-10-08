import axios from 'axios'
import { gendUrl } from 'src/util'
import {
  AxiosRequestConfig as BaseAxiosReqConfig,
  AxiosStatic as BaseAxiosStatic,
  AxiosResponse as BaseAxiosResponse
} from 'axios'


type AxiosConfigArgBase = {
  url?: BaseAxiosReqConfig['url'],
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

type needHeadReq = {
  getHeader: () => {[key: string]: any} | void,
  errHandle?: (res?: BaseAxiosResponse) => void,
  urls: Array<string>
}
type needHeadReqs = Array<needHeadReq> 

let isSetup = false
const setupAxios = <
  Interface, 
  URLS extends {[key: string]: string}, 
  URL = URLS[keyof URLS], 
  RetAxios = AxiosStatic<Interface, URL>
>(
  urlMaps: URLS, 
  _needHeadReqs: needHeadReqs | needHeadReq = [],
  notLoadUrls: Array<string> = Object.values(urlMaps)
) => {
  if (isSetup) return axios as unknown as RetAxios

  const urls = Object.values(urlMaps)
  
  const needHeadReqs = !Array.isArray(_needHeadReqs) 
    ? [_needHeadReqs] 
    : _needHeadReqs

  const needHeadHandler = (
    url: string, 
    handler: (config: needHeadReq) => void
  ) => {
    needHeadReqs.forEach(config => {
      urls.includes(url) && handler(config)
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
      needHeadHandler(res.config.url, ({errHandle}) => {
        errHandle && errHandle()
      })
    }
    return Promise.reject(res)
  }

  axios.interceptors.request.use(config => {
    if (config.url) {
      config.url = gendUrl(config.url, config.params)
    }

    if (!config.url || !urls.includes(config.url)) {
      stopRequest();
      return config 
    }

    needHeadHandler(config.url, ({getHeader}) => {
      const head = getHeader()
      if (head) {
        config.headers = config.headers 
          ? { ...config.headers, ...head }
          : head
      }
    })

    if (notLoadUrls.includes(config.url)) {
      return config
    } else {
      return config
    }
  })

  axios.interceptors.response.use(res => {
    if (res.status !== 200) {
      return errorHandler(res)
    } else {
      return res.data
    }
  }, errorHandler)

  return axios as unknown as RetAxios
}

export default setupAxios
