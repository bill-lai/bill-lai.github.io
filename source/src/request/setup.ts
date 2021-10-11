import { equalUrl, gendUrl } from 'src/util'
import axios, {
  Method as BaseMethod,
  AxiosRequestConfig as BaseAxiosReqConfig,
  AxiosStatic as BaseAxiosStatic,
  AxiosResponse as BaseAxiosResponse
} from 'axios'

// 接口配置值
export type InterfaceConfig = {
  url: BaseAxiosReqConfig['url'],
  params?: BaseAxiosReqConfig['params'],
  data?: BaseAxiosReqConfig['data'],
  response?: any
}

export type InterfaceConfigArray = Array<InterfaceConfig>

// 接口配置
export type InterfacesConfig = {
  [key in BaseMethod]?: InterfaceConfigArray
}

// 提取所有Methods
export type ExtractInterfacesMethods<Interfaces> = keyof Interfaces

// 提取数组中的所有URL
export type ExtractInterfaceArrayURL<
  InterfaceArray extends InterfaceConfigArray
> = InterfaceArray extends Array<{url: infer U}> ? U : never

  // 提取接口所有url
export type ExtractInterfacesURLS<
  Interfaces extends InterfacesConfig
> = {
  [key in keyof Interfaces]: 
    Interfaces[key] extends InterfaceConfigArray 
      ? ExtractInterfaceArrayURL<Interfaces[key]>
      : never
}[keyof Interfaces]

// 提取接口某个method的所有url
export type ExtractInterfacesMethodURLS<
  Interfaces extends InterfacesConfig, 
  T extends ExtractInterfacesMethods<Interfaces>
> = Interfaces[T] extends InterfaceConfigArray 
      ? ExtractInterfaceArrayURL<Interfaces[T]>
      : never

// 根据URL提取完整接口参数
export type ExtractInterface<
  Interfaces extends InterfacesConfig, 
  URL
> = {
  [Method in keyof Interfaces] : 
    Method extends BaseMethod
      ? URL extends ExtractInterfacesMethodURLS<Interfaces, Method> 
        ? {
            [ iteratorkey in keyof Interfaces[Method] ]:
              Interfaces[Method][iteratorkey] extends InterfaceConfig
                ? Interfaces[Method][iteratorkey]['url'] extends URL
                  ? Interfaces[Method][iteratorkey] & { method: Method }
                  : never
                : never
          }[keyof Interfaces[Method]]
        : never
      : never
}[keyof Interfaces]

// 提取参数值
export type ExtractConfigValue<
  Config extends InterfaceConfig, 
  Attr extends string
> = Config extends { [key in Attr]: any }
      ? Config[Attr]
      : never


export type AxiosResData<Config extends InterfaceConfig> = Promise<ExtractConfigValue<Config, 'response'>>
export type ReqConfig<Config extends InterfaceConfig> = Omit<Config, 'response'>
export type GivenReqConfig<Config extends InterfaceConfig> = Omit<ReqConfig<Config>, 'method' | 'url'>
export type ReqData<Config extends InterfaceConfig> = ExtractConfigValue<Config, 'data'>


export type InstanceConfig<
  Interfaces extends InterfacesConfig,
  URL extends ExtractInterfacesURLS<Interfaces>,
  Config extends InterfaceConfig = ExtractInterface<Interfaces, URL>,
  getUriConfig = Omit<Config, 'method' | 'response'>,
  reqConfig =  Omit<Config, 'response'>,
  givenReqConfig = Omit<reqConfig, 'method' | 'url'>,
  resData = Promise<ExtractConfigValue<Config, 'response'>>,
  reqData = ReqData<Config>
> = {
  config: Config,
  givenReqConfig: givenReqConfig,
  getUriConfig: getUriConfig
  reqConfig: reqConfig,
  resData: resData,
  reqData: reqData
}


export interface AxiosInstance<
  Interfaces extends InterfacesConfig, 
  InterfaceURL extends ExtractInterfacesURLS<Interfaces>,
  InterfaceMethod extends ExtractInterfacesMethods<Interfaces> = 
    ExtractInterfacesMethods<Interfaces>
> {
  getUri<
    URL extends ExtractInterfacesMethodURLS<Interfaces, 'GET'>, 
    iaConfig extends InstanceConfig<Interfaces, URL> = InstanceConfig<Interfaces, URL>
  >( config: iaConfig['getUriConfig'] & { url: URL } ): string;

  request<
    URL extends InterfaceURL, 
    Method extends InterfaceMethod, 
    iaConfig extends InstanceConfig<Interfaces, URL> = InstanceConfig<Interfaces, URL>
  >(
    config: iaConfig['reqConfig'] & 
      {
        url: Method extends InterfaceMethod 
          ? ExtractInterfacesMethodURLS<Interfaces, Method> : URL,
        method: Method
      }
  ): iaConfig['resData'];

  get<
    URL extends ExtractInterfacesMethodURLS<Interfaces, 'GET'>,
    iaConfig extends InstanceConfig<Interfaces, URL> = InstanceConfig<Interfaces, URL>
  >( url: URL, config?: iaConfig['givenReqConfig'] ): iaConfig['resData'];
  delete<
    URL extends ExtractInterfacesMethodURLS<Interfaces, 'DELETE'>,
    iaConfig extends InstanceConfig<Interfaces, URL> = InstanceConfig<Interfaces, URL>
  >( url: URL, config?: iaConfig['givenReqConfig'] ): iaConfig['resData'];
  head<
    URL extends ExtractInterfacesMethodURLS<Interfaces, 'HEAD'>,
    iaConfig extends InstanceConfig<Interfaces, URL> = InstanceConfig<Interfaces, URL>
  >( url: URL, config?: iaConfig['givenReqConfig'] ): iaConfig['resData'];
  options<
    URL extends ExtractInterfacesMethodURLS<Interfaces, 'OPTIONS'>,
    iaConfig extends InstanceConfig<Interfaces, URL> = InstanceConfig<Interfaces, URL>
  >(url: URL, config?: iaConfig['givenReqConfig']): iaConfig['resData'];
  post<
    URL extends ExtractInterfacesMethodURLS<Interfaces, 'POST'>,
    reqData extends iaConfig['reqData'] | undefined,
    iaConfig extends InstanceConfig<Interfaces, URL> = InstanceConfig<Interfaces, URL>,
  >(url: URL, data: reqData, config?: reqData extends iaConfig['reqData'] ? Omit<iaConfig['givenReqConfig'], 'data'> : iaConfig['givenReqConfig']  ): iaConfig['resData'];
  put<
    URL extends ExtractInterfacesMethodURLS<Interfaces, 'PUT'>,
    iaConfig extends InstanceConfig<Interfaces, URL> = InstanceConfig<Interfaces, URL>
  >(url: URL, data?: iaConfig['reqData'], config?: iaConfig['givenReqConfig']): iaConfig['resData'];
  patch<
    URL extends ExtractInterfacesMethodURLS<Interfaces, 'PATCH'>,
    iaConfig extends InstanceConfig<Interfaces, URL> = InstanceConfig<Interfaces, URL>
  >(url: URL, data?: iaConfig['reqData'], config?: iaConfig['givenReqConfig']): iaConfig['resData'];
}

export type AxiosStatic<
  Interfaces extends InterfacesConfig, 
  URLS extends ExtractInterfacesURLS<Interfaces>
> = Omit<BaseAxiosStatic, keyof AxiosInstance<Interfaces, URLS>> & AxiosInstance<Interfaces, URLS>

export type InterceptNeed<
  Interfaces extends InterfacesConfig,
  URL extends ExtractInterfacesURLS<Interfaces> = ExtractInterfacesURLS<Interfaces>,
  Config extends ExtractInterface<Interfaces, URL> = ExtractInterface<Interfaces, URL>,
  iaConfig extends InstanceConfig<Interfaces, URL, Config> = InstanceConfig<Interfaces, URL, Config>
> = {
  reqHandler?: () => Partial<iaConfig['config']> | undefined,
  errHandler?: (res?: BaseAxiosResponse) => void,
  resHandler?: (res: iaConfig['resData']) => any
  urls: Array<URL>
}

export type InterceptNeeds<Interfaces extends InterfacesConfig> = Array<InterceptNeed<Interfaces>> 


let isSetup = false
const setupAxios = <
  Interfaces extends InterfacesConfig, 
  URL extends ExtractInterfacesURLS<Interfaces> = ExtractInterfacesURLS<Interfaces>,
  Axios = AxiosStatic<Interfaces, URL>,
>(
  urlMaps: { [key: string]: URL }, 
  interceptNeeds: InterceptNeeds<Interfaces>
) => {
  if (isSetup) return axios as unknown as Axios

  const urls = Object.values(urlMaps)
  const includesUrl = (urls: Array<URL>, url: string) =>
    urls.some(tempUrl => equalUrl(tempUrl as unknown as string, url))

  const interceptHandler = (
    url: URL, 
    handler: (config: InterceptNeed<Interfaces, URL>) => void
  ) => {
    interceptNeeds.forEach(config => {
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

    return config
  })

  axios.interceptors.response.use(res => {
    if (res.status < 200 || res.status >= 300) {
      return errorHandler(res)
    } else {
      return res.data
    }
  }, errorHandler)

  return axios as unknown as Axios
}

export default setupAxios
