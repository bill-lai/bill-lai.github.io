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
export type ExtractInterfacesAllURL<Interfaces> = {
  [key in keyof Interfaces]: 
    Interfaces[key] extends InterfaceConfigArray 
      ? ExtractInterfaceArrayURL<Interfaces[key]>
      : never
}[keyof Interfaces]

// 提取接口某个method的所有url
export type ExtractInterfacesMethodURL<
  Interfaces, 
  T extends ExtractInterfacesMethod<Interfaces>
> = Interfaces[T] extends InterfaceConfigArray 
      ? ExtractInterfaceArrayURL<Interfaces[T]>
      : never

// 提取全部或者method的所有url
export type ExtractInterfacesURL<
  Interfaces,
  Method
> = Method extends ExtractInterfacesMethod<Interfaces> 
  ? ExtractInterfacesMethodURL<Interfaces, Method>
  : ExtractInterfacesAllURL<Interfaces>

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
  Config extends object, 
  Attr extends string
> = Config extends { [key in Attr]: any }
      ? Config[Attr]
      : never


// 提取两对象得共有key和值
type ExtractPublicAttr<T, R> = OmitNever<{
  [key in keyof T & keyof R]: 
    T[key] extends object
      ? R[key] extends object
        ? {} extends ExtractPublicAttr<T[key], R[key]>
          ? never 
          : ExtractPublicAttr<T[key], R[key]>
        : never
      : T[key] extends R[key]
        ? R[key] extends T[key]
          ? T[key]
          : never
        : never
}>

// 提取一个对象得所有共有参数
type ExtractShare<T, R extends keyof T = keyof T> = {
  [K in R]: { [CK in R]: ExtractPublicAttr<T[K], T[CK]> }[R]
}[R]

// 数组转obj
type ArrayToObject<
  URLS extends readonly any[],
  keys extends string | number | symbol = keyof URLS
> = OmitNever<{
  [key in keys]: key extends keyof []
    ? never
    : key extends keyof URLS 
      ? URLS[key]
      : never
}>


export type AxiosResData<Config extends InterfaceConfig> = Promise<ExtractConfigValue<Config, 'response'>>
export type ReqConfig<Config extends InterfaceConfig> = Omit<Config, 'response'>
export type GivenReqConfig<Config extends InterfaceConfig> = Omit<ReqConfig<Config>, 'method' | 'url'>
export type ReqData<Config extends InterfaceConfig> = ExtractConfigValue<Config, 'data'>
export type OmitNever<T> = {
  [P in keyof T as T[P] extends never ? never : P]: 
    T[P] extends { [key: string]: any } ? OmitNever<T[P]> : T[P]
}

export type OmitUncertain<T> = OmitNever<{
  [ key in keyof T ]-?: undefined extends T[key] 
    ? never 
    : T[key] extends object 
      ? OmitUncertain<T[key]>
      : T[key]
}>

export type InstanceConfig<
  Interfaces extends InterfacesConfig,
  URL extends ExtractInterfacesURL<Interfaces, Method>,
  Method = never,
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
  InterfaceURL extends ExtractInterfacesAllURL<Interfaces>,
  InterfaceMethod extends ExtractInterfacesMethod<Interfaces> = 
    ExtractInterfacesMethod<Interfaces>
> {
  getUri<
    URL extends ExtractInterfacesMethodURL<Interfaces, 'GET'>, 
    instanceConfig extends InstanceConfig<Interfaces, URL, 'GET'> = InstanceConfig<Interfaces, URL>,
  >( config: ExtractConfigValue<instanceConfig, 'getUriConfig'> & { url: URL } ): string;

  request<
    URL extends 
      Method extends InterfaceMethod 
        ? ExtractInterfacesMethodURL<Interfaces, Method> 
        : InterfaceURL, 
    Method extends InterfaceURL, 
    instanceConfig extends InstanceConfig<Interfaces, URL> = InstanceConfig<Interfaces, URL>
  >( config: ExtractConfigValue<instanceConfig, 'reqConfig'> & { url: URL } ): instanceConfig['resData'];

  get<
    URL extends ExtractInterfacesMethodURL<Interfaces, 'GET'>,
    instanceConfig extends InstanceConfig<Interfaces, URL> = InstanceConfig<Interfaces, URL>
  >( url: URL, config?: ExtractConfigValue<instanceConfig, 'givenReqConfig'> ): instanceConfig['resData'];
  delete<
    URL extends ExtractInterfacesMethodURL<Interfaces, 'DELETE'>,
    instanceConfig extends InstanceConfig<Interfaces, URL> = InstanceConfig<Interfaces, URL>
  >( url: URL, config?: ExtractConfigValue<instanceConfig, 'givenReqConfig'> ): instanceConfig['resData'];
  head<
    URL extends ExtractInterfacesMethodURL<Interfaces, 'HEAD'>,
    instanceConfig extends InstanceConfig<Interfaces, URL> = InstanceConfig<Interfaces, URL>
  >( url: URL, config?: ExtractConfigValue<instanceConfig, 'givenReqConfig'> ): instanceConfig['resData'];
  options<
    URL extends ExtractInterfacesMethodURL<Interfaces, 'OPTIONS'>,
    instanceConfig extends InstanceConfig<Interfaces, URL> = InstanceConfig<Interfaces, URL>
  >(url: URL, config?: ExtractConfigValue<instanceConfig, 'givenReqConfig'>): instanceConfig['resData'];
  post<
    URL extends ExtractInterfacesMethodURL<Interfaces, 'POST'>,
    reqData extends ExtractConfigValue<instanceConfig, 'reqData'> | undefined,
    instanceConfig extends InstanceConfig<Interfaces, URL> = InstanceConfig<Interfaces, URL>,
    reqConfig = reqData extends ExtractConfigValue<instanceConfig, 'reqData'>
      ? Omit<ExtractConfigValue<instanceConfig, 'givenReqConfig'>, 'data'> 
      : ExtractConfigValue<instanceConfig, 'givenReqConfig'> 
  >(
    url: URL, 
    data: reqData, 
    config?: reqConfig
  ): instanceConfig['resData'];
  put<
    URL extends ExtractInterfacesMethodURL<Interfaces, 'PUT'>,
    reqData extends ExtractConfigValue<instanceConfig, 'reqData'> | undefined,
    instanceConfig extends InstanceConfig<Interfaces, URL> = InstanceConfig<Interfaces, URL>,
    reqConfig = reqData extends ExtractConfigValue<instanceConfig, 'reqData'> 
      ? Omit<ExtractConfigValue<instanceConfig, 'givenReqConfig'>, 'data'> 
      : ExtractConfigValue<instanceConfig, 'givenReqConfig'>
  >(
    url: URL, 
    data: reqData, 
    config?: reqConfig
  ): instanceConfig['resData'];
  patch<
    URL extends ExtractInterfacesMethodURL<Interfaces, 'PATCH'>,
    reqData extends ExtractConfigValue<instanceConfig, 'reqData'> | undefined,
    instanceConfig extends InstanceConfig<Interfaces, URL> = InstanceConfig<Interfaces, URL>,
    reqConfig = reqData extends ExtractConfigValue<instanceConfig, 'reqData'>
      ? Omit<ExtractConfigValue<instanceConfig, 'givenReqConfig'>, 'data'> 
      : ExtractConfigValue<instanceConfig, 'givenReqConfig'>
  >(
    url: URL, 
    data: reqData, 
    config?: reqConfig
  ): instanceConfig['resData'];
}

// 拦截urls参数
export type InterceptMURL<T> = readonly [string, ExtractInterfacesMethod<T>]
export type InterceptURL<T> = InterceptMURL<T> | string
export type ExtractInstanceConfig<
  Interfaces extends InterfacesConfig,
  URL extends string,
  Method = any
> = Method extends ExtractInterfacesMethod<Interfaces>
      ? URL extends ExtractInterfacesMethodURL<Interfaces, Method>
        ? InstanceConfig<Interfaces, URL>
        : never
      : URL extends ExtractInterfacesAllURL<Interfaces>
        ? InstanceConfig<Interfaces, URL>
        : never

// 拦截对象声明
export type InterceptNeed<
  Interfaces extends InterfacesConfig,
  URLS extends readonly InterceptURL<Interfaces>[],
  ObjURLS = ArrayToObject<URLS>,
  publicConfig = ExtractShare<{
    [Index in keyof ObjURLS]:
      ObjURLS[Index] extends InterceptMURL<Interfaces>
        ? ExtractInstanceConfig<Interfaces, ObjURLS[Index][0], ObjURLS[Index][1]>
        : ObjURLS[Index] extends string 
          ? ExtractInstanceConfig<Interfaces, ObjURLS[Index]>
          : never
  }>,
  reqConfig = publicConfig extends object 
    ? ExtractConfigValue<publicConfig, 'config'>
    : never
> = {
  reqHandler?: (config: reqConfig) => reqConfig | void,
  errHandler?: (res?: BaseAxiosResponse) => void,
  resHandler?: (res: publicConfig extends { resData: any } ? publicConfig['resData'] : never) => any
  urls: URLS
}

// 拦截对象数组声明
export type InterceptNeeds<
  Interfaces extends InterfacesConfig,
  ArrayURLS extends readonly (readonly string[])[]
> = {
  [index in keyof ArrayURLS]: 
    ArrayURLS[index] extends readonly string[]
      ? InterceptNeed<Interfaces, ArrayURLS[index]>
      : index extends keyof []
        ? [][index]
        : undefined
}

// type ExtractInterceptNeedsReqResult<
//   Interfaces extends InterfacesConfig,
//   ArrayURLS extends readonly (readonly string[])[],
//   URL extends string,
//   Intercepts = InterceptNeeds<Interfaces, ArrayURLS>
// > = {
//   {

//   }
// }

export type AxiosStatic<
  Interfaces extends InterfacesConfig, 
  URL extends ExtractInterfacesAllURL<Interfaces>
> = Omit<BaseAxiosStatic, keyof AxiosInstance<Interfaces, URL>> & AxiosInstance<Interfaces, URL>



let isSetup = false
const setupAxios = <
  Interfaces extends InterfacesConfig, 
  NeedsArrayURLS extends readonly (readonly string[])[],
  URL extends ExtractInterfacesAllURL<Interfaces> = ExtractInterfacesAllURL<Interfaces>,
  Axios = AxiosStatic<Interfaces, URL>
>(
  urlMaps: { [key: string]: URL }, 
  interceptNeeds: InterceptNeeds<Interfaces, NeedsArrayURLS>
) => {
  type Intercept = InterceptNeed<Interfaces, NeedsArrayURLS[0]>

  if (isSetup) return axios as unknown as Axios

  const urls = Object.values(urlMaps)

  const tapIntercept = (
    url: string, 
    handler: (need: Intercept) => void
  ) => {
    interceptNeeds.forEach((need, index) => {
      if (includesUrl(need.urls, url)) {
        handler(need as unknown as Intercept)
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
      let addConfig = reqHandler && reqHandler(config as any)
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
