import { gendUrl, includesUrl } from 'src/util'
import axios, {
  Method as BaseMethod,
  AxiosRequestConfig as BaseAxiosReqConfig,
  AxiosStatic as BaseAxiosStatic,
  AxiosResponse as BaseAxiosResponse
} from 'axios'

// 接口配置值
export type InterfaceConfig = {
  url: string,
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
export type ExtractInterfacesMethod<Interfaces> = keyof Interfaces

// 提取数组中的所有URL
export type ExtractInterfaceArrayURL<
  InterfaceArray extends InterfaceConfigArray
> = InterfaceArray extends Array<{url: infer U}> ? U : never

  // 提取接口所有url
export type ExtractInterfacesURL<
  Interfaces extends InterfacesConfig
> = {
  [key in keyof Interfaces]: 
    Interfaces[key] extends InterfaceConfigArray 
      ? ExtractInterfaceArrayURL<Interfaces[key]>
      : never
}[keyof Interfaces]

// 提取接口某个method的所有url
export type ExtractInterfacesMethodURL<
  Interfaces extends InterfacesConfig, 
  T extends ExtractInterfacesMethod<Interfaces>
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
      ? URL extends ExtractInterfacesMethodURL<Interfaces, Method> 
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
  URL extends ExtractInterfacesURL<Interfaces>,
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
  InterfaceURL extends ExtractInterfacesURL<Interfaces>,
  InterfaceMethod extends ExtractInterfacesMethod<Interfaces> = 
    ExtractInterfacesMethod<Interfaces>
> {
  getUri<
    URL extends ExtractInterfacesMethodURL<Interfaces, 'GET'>, 
    instanceConfig extends InstanceConfig<Interfaces, URL> = InstanceConfig<Interfaces, URL>
  >( config: instanceConfig['getUriConfig'] & { url: URL } ): string;

  request<
    URL extends InterfaceURL, 
    Method extends InterfaceMethod, 
    instanceConfig extends InstanceConfig<Interfaces, URL> = InstanceConfig<Interfaces, URL>
  >(
    config: instanceConfig['reqConfig'] & 
      {
        url: Method extends InterfaceMethod 
          ? ExtractInterfacesMethodURL<Interfaces, Method> : URL,
        method: Method
      }
  ): instanceConfig['resData'];

  get<
    URL extends ExtractInterfacesMethodURL<Interfaces, 'GET'>,
    instanceConfig extends InstanceConfig<Interfaces, URL> = InstanceConfig<Interfaces, URL>
  >( url: URL, config?: instanceConfig['givenReqConfig'] ): instanceConfig['resData'];
  delete<
    URL extends ExtractInterfacesMethodURL<Interfaces, 'DELETE'>,
    instanceConfig extends InstanceConfig<Interfaces, URL> = InstanceConfig<Interfaces, URL>
  >( url: URL, config?: instanceConfig['givenReqConfig'] ): instanceConfig['resData'];
  head<
    URL extends ExtractInterfacesMethodURL<Interfaces, 'HEAD'>,
    instanceConfig extends InstanceConfig<Interfaces, URL> = InstanceConfig<Interfaces, URL>
  >( url: URL, config?: instanceConfig['givenReqConfig'] ): instanceConfig['resData'];
  options<
    URL extends ExtractInterfacesMethodURL<Interfaces, 'OPTIONS'>,
    instanceConfig extends InstanceConfig<Interfaces, URL> = InstanceConfig<Interfaces, URL>
  >(url: URL, config?: instanceConfig['givenReqConfig']): instanceConfig['resData'];
  post<
    URL extends ExtractInterfacesMethodURL<Interfaces, 'POST'>,
    reqData extends instanceConfig['reqData'] | undefined,
    instanceConfig extends InstanceConfig<Interfaces, URL> = InstanceConfig<Interfaces, URL>,
  >(
    url: URL, 
    data: reqData, 
    config?: reqData extends instanceConfig['reqData'] 
              ? Omit<instanceConfig['givenReqConfig'], 'data'> 
              : instanceConfig['givenReqConfig']  
  ): instanceConfig['resData'];
  put<
    URL extends ExtractInterfacesMethodURL<Interfaces, 'PUT'>,
    reqData extends instanceConfig['reqData'] | undefined,
    instanceConfig extends InstanceConfig<Interfaces, URL> = InstanceConfig<Interfaces, URL>
  >(
    url: URL, 
    data: reqData, 
    config?: reqData extends instanceConfig['reqData'] 
              ? Omit<instanceConfig['givenReqConfig'], 'data'> 
              : instanceConfig['givenReqConfig']  
  ): instanceConfig['resData'];
  patch<
    URL extends ExtractInterfacesMethodURL<Interfaces, 'PATCH'>,
    reqData extends instanceConfig['reqData'] | undefined,
    instanceConfig extends InstanceConfig<Interfaces, URL> = InstanceConfig<Interfaces, URL>
  >(
    url: URL, 
    data: reqData, 
    config?: reqData extends instanceConfig['reqData'] 
              ? Omit<instanceConfig['givenReqConfig'], 'data'> 
              : instanceConfig['givenReqConfig']  
  ): instanceConfig['resData'];
}

export type AxiosStatic<
  Interfaces extends InterfacesConfig, 
  URL extends ExtractInterfacesURL<Interfaces>
> = Omit<BaseAxiosStatic, keyof AxiosInstance<Interfaces, URL>> & AxiosInstance<Interfaces, URL>

export type InterceptNeed<
  Interfaces extends InterfacesConfig,
  URLS extends Array<string> = Array<ExtractInterfacesURL<Interfaces>> ,
  publicConfig = {
    [Index in keyof URLS]: URLS[Index] extends ExtractInterfacesURL<Interfaces>
      ? InstanceConfig<Interfaces, URLS[Index]>
      : never
  }[keyof URLS],
> = {
  reqHandler?: () => publicConfig extends { config: any } ? Partial<publicConfig['config']> | undefined : never,
  errHandler?: (res?: BaseAxiosResponse) => void,
  resHandler?: (res: publicConfig extends { resData: any } ? publicConfig['resData'] : never) => any
  urls: URLS
}


export type InterceptNeeds<
  Interfaces extends InterfacesConfig,
> = Array<InterceptNeed<Interfaces>> 

export type ExtractArrayElement<T extends Array<any>> = T extends Array<infer E> ? E : never

let isSetup = false
const setupAxios = <
  Interfaces extends InterfacesConfig, 
  URL extends ExtractInterfacesURL<Interfaces> = ExtractInterfacesURL<Interfaces>,
  Axios = AxiosStatic<Interfaces, URL>,
  Intercepts extends InterceptNeeds<Interfaces> = InterceptNeeds<Interfaces>
>(
  urlMaps: { [key: string]: URL }, 
  interceptNeeds: Intercepts
) => {
  if (isSetup) return axios as unknown as Axios

  const urls = Object.values(urlMaps)

  const tapIntercept = (
    url: string, 
    handler: <index extends number>(config: Intercepts[index]) => void
  ) => {
    interceptNeeds.forEach((need, index) => {
      if (includesUrl(need.urls, url)) {
        handler<typeof index>(need)
      }
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
      tapIntercept(
        res.config.url, 
        ({errHandler}) => errHandler && errHandler()
      )
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

    tapIntercept(config.url, ({reqHandler}) => {
      let addConfig = reqHandler && reqHandler()
      if (addConfig) {
        const retConfig = config as typeof config & typeof addConfig
        for (const key in addConfig) {
          retConfig[key] = retConfig[key]
            ? { 
                ...retConfig[key], 
                ...addConfig[key]
              } 
            : addConfig[key] as any
        }
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
