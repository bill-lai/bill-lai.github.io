import axios from 'axios'
import {
  AxiosRequestConfig as BaseAxiosReqConfig,
  AxiosStatic as BaseAxiosStatic
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

// 不需要loadding的加载
export const notLoadUrls: Array<string> = []

const stopRequest = () => {
  const source = axios.CancelToken.source()
  source.cancel('Illegal request')
}

axios.interceptors.request.use(config => {
  if (!config.url) {
    return stopRequest();
  }

  if (notLoadUrls.includes(config.url)) {
    return config
  } else {
    return stopRequest()
  }
})


axios.interceptors.response.use(res => {
  if (res.status !== 200) {
    alert('请求错误')
  } else {
    return res.data
  }
})
