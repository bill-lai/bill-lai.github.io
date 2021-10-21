import { equalUrl, gendUrl } from 'src/util'
import axios, {
  Method as BaseMethod,
  AxiosRequestConfig as BaseAxiosReqConfig,
  AxiosStatic as BaseAxiosStatic,
  AxiosResponse as BaseAxiosResponse,
  AxiosInterceptorManager as BaseAxiosInterceptorManager,
} from 'axios'

// 提取对象的值
export type ExtractValue<T, K extends string> = 
  T extends { [key in K]: any } ? T[K] : never

  // 排除基本类型
export type OmitBasic<
  T extends string | number | symbol, K
> = keyof {
  [key in T as key extends K ? never: key]: any
}

// 去除对象中值为never的keyValue
export type OmitNever<T> = {
  [key in keyof T as T[key] extends never ? never: key]: 
    T[key] extends never ? never: T[key]
}

export type defVoid = void | undefined | null

// 接口配置值
export type InterfaceConfig = BaseAxiosReqConfig & {
  url: string,
  paths?: BaseAxiosReqConfig['params'],
  params?: BaseAxiosReqConfig['params'],
  data?: BaseAxiosReqConfig['data'],
  response?: any
}

// 配置值
export type InterfaceConfigArray = Array<InterfaceConfig>

// 接口配置
export type InterfacesConfig = { 
  [key in BaseMethod]?: InterfaceConfigArray 
}

type ExtractInterfacesMethodMap<T> = {
  [key in keyof T as key extends BaseMethod ? key : never]: key
}

// 提取所有Methods
export type ExtractInterfacesMethod<T> = 
  ExtractInterfacesMethodMap<T>[keyof ExtractInterfacesMethodMap<T>]


// 提取数组中的所有URL
export type ExtractInterfaceArrayURL<T> = 
  T extends Array<{url: infer U}> ? U : never

// 提取接口某个method的所有url
export type ExtractInterfacesMethodURL<T, M> = 
  M extends ExtractInterfacesMethod<T>
    ? T[M] extends InterfaceConfigArray 
      ? ExtractInterfaceArrayURL<T[M]>
      : T[M]
    : never

// 提取接口所有url
export type ExtractInterfacesAllURL<T> = {
  [key in keyof T]: 
    T[key] extends InterfaceConfigArray 
      ? ExtractInterfaceArrayURL<T[key]>
      : never
}[keyof T]

// 提取全部或者method的所有url
export type ExtractInterfacesURL<T, M = defVoid> = 
  M extends defVoid
    ? ExtractInterfacesAllURL<T>
    : M extends ExtractInterfacesMethod<T> 
      ? ExtractInterfacesMethodURL<T, M>
      : never

// 根据具体的method url 抽取有配置
export type ExtractInterfaceByMethodURL<
  T, 
  M extends ExtractInterfacesMethod<T>, 
  U extends ExtractInterfacesURL<T, M>
> = {
  [key in keyof T[M]]: 
    T[M][key] extends InterfaceConfig
      ? T[M][key]['url'] extends U 
        ? T[M][key] & { method: M }
        : never
      : never
}[keyof T[M]]

// 根据URL提取完整接口参数
export type ExtractInterface<T, U, M = defVoid> = 
  M extends defVoid 
    ? {
        [Method in keyof T] : 
          Method extends ExtractInterfacesMethod<T>
            ? U extends ExtractInterfacesURL<T, Method> 
              ? ExtractInterfaceByMethodURL<T, Method, U>
              : never
            : never
      }[keyof T]
    : M extends ExtractInterfacesMethod<T>
      ? U extends ExtractInterfacesURL<T, M> 
        ? ExtractInterfaceByMethodURL<T, M, U>
        : never 
      : never

// 根据url method 获取axios需要的所有参数
export type InstanceConfig<
  T, 
  U, 
  M = defVoid, 
  Config = ExtractInterface<T, U, M>
> = {
  config: Config,
  givenReqConfig: Omit<Config, 'method' | 'url' | 'response'>,
  getUriConfig: Omit<Config, 'method' | 'response'>
  reqConfig: Omit<Config, 'response'>,
  resData: Promise<ExtractValue<Config, 'response'>>,
  reqData: ExtractValue<Config, 'data'>
}

// 特定请求基础参数
type InstanceBaseArgs<
  T, 
  Method, 
  URL, 
  instance = InstanceConfig<T, URL, Method>
> = {} extends ExtractValue<instance, 'givenReqConfig'> 
      ? []
      : ExtractValue<instance, 'givenReqConfig'>  extends never
        ? []
        : [ExtractValue<instance, 'givenReqConfig'>]

// 特定请求返回返回值
type InstanceBaseReturn<T, Method, URL> =
  ExtractValue<InstanceConfig<T, URL, Method>, 'resData'>

// 特定的GET相关接口函数声明
type InstanceGet<T, Method, URL> = (
  ...args: InstanceBaseArgs<T, Method, URL>
) => InstanceBaseReturn<T, Method, URL>

// 特定的POST相关接口函数声明
type InstancePost<
  T, 
  Method, 
  URL, 
  Args extends InstanceBaseArgs<T, Method, URL> = 
    InstanceBaseArgs<T, Method, URL>
> = (
  ...args: Args extends []
    ? []
    : ExtractValue<Args[0], 'data'> extends never
      ? [defVoid, ...Args]
      : {} extends Omit<Args[0], 'data'>
        ? [ExtractValue<Args[0], 'data'>] | [defVoid, ...Args]
        : [
            ExtractValue<Args[0], 'data'>,
            ...[Omit<Args[0], 'data'>, ...Omit<Args, 0>]
          ] | [defVoid, ...Args]
) => InstanceBaseReturn<T, Method, URL>;



// 各个实例上的api定义
type GETURIM = 'GET' | 'DELETE' | 'HEAD' | 'OPTIONS'
export interface AxiosInstance<T> {
  <
    URL extends ExtractInterfacesURL<T, Method>,
    Method extends ExtractInterfacesMethod<T> | 
      defVoid = defVoid
  >(
    config: ExtractValue<
        InstanceConfig<T, URL, Method>, 
        'reqConfig'
      > extends never
        ? { url: URL, method: Method }
        : ExtractValue<InstanceConfig<T, URL, Method>, 'reqConfig'> 
          & { url: URL }
  ):  ExtractValue<InstanceConfig<T, URL, Method>, 'resData'>;
  
  <
    URL extends ExtractInterfacesURL<T>,
    Instance extends InstanceConfig<T, URL>
  >(
    url: URL, 
    config: Omit<ExtractValue<Instance, 'reqConfig'>, 'url' >
  ): ExtractValue<Instance, 'resData'> ;
  
  defaults: InterfaceConfig;

  interceptors: {
    request: BaseAxiosInterceptorManager<InterfaceConfig>;
    response: BaseAxiosInterceptorManager<BaseAxiosResponse>;
  };


  getUri<URL extends ExtractInterfacesURL<T, GETURIM>, >( 
    config: ExtractValue<
              InstanceConfig<T, URL, GETURIM>, 
              'getUriConfig'
            > & { url: URL } 
  ): string;

  request<
    URL extends ExtractInterfacesURL<T, Method>,
    Method extends ExtractInterfacesMethod<T> | 
      defVoid = defVoid
  >( 
    config: ExtractValue<
        InstanceConfig<T, URL, Method>, 
        'reqConfig'
      > extends never
        ? { url: URL, method: Method }
        : ExtractValue<InstanceConfig<T, URL, Method>, 'reqConfig'> 
          & { url: URL }
  ): ExtractValue<InstanceConfig<T, URL, Method>, 'resData'>;

  get<
    URL extends ExtractInterfacesURL<T, 'GET'>
  >(url: URL, ...args: Parameters<InstanceGet<T, 'GET', URL>>): 
    ReturnType<InstanceGet<T, 'GET', URL>>
    
  delete<
    URL extends ExtractInterfacesURL<T, 'DELETE'>
  >(url: URL, ...args: Parameters<InstanceGet<T, 'DELETE', URL>>): 
    ReturnType<InstanceGet<T, 'DELETE', URL>>
    
  head<
    URL extends ExtractInterfacesURL<T, 'HEAD'>
  >(url: URL, ...args: Parameters<InstanceGet<T, 'HEAD', URL>>): 
    ReturnType<InstanceGet<T, 'HEAD', URL>>
    
  options<
    URL extends ExtractInterfacesURL<T, 'OPTIONS'>
  >(url: URL, ...args: Parameters<InstanceGet<T, 'OPTIONS', URL>>): 
    ReturnType<InstanceGet<T, 'OPTIONS', URL>>

  post<
    URL extends ExtractInterfacesURL<T, 'POST'>
  >(url: URL, ...args: Parameters<InstancePost<T, 'POST', URL>>): 
    ReturnType<InstancePost<T, 'POST', URL>>
    
  put<
    URL extends ExtractInterfacesURL<T, 'PUT'>
  >(url: URL, ...args: Parameters<InstancePost<T, 'PUT', URL>>): 
    ReturnType<InstancePost<T, 'PUT', URL>>
    
  patch<
    URL extends ExtractInterfacesURL<T, 'PATCH'>
  >(url: URL, ...args: Parameters<InstancePost<T, 'PATCH', URL>>): 
    ReturnType<InstancePost<T, 'PATCH', URL>>

  addIntercept: <R extends InterceptURLS<T>, RT, RS> (
    intercept: InterceptAtom<T, R, RT, RS>
  ) => AxiosStatic<
    InterceptAfterInterfaces<T, R, Omit<RT, 'method' | 'url' | 'response'>, RS>
  >
}

// 拦截urls参数
export type InterceptURL<T, U = ExtractInterfacesAllURL<T>> = U | 
  readonly [U, ExtractInterface<T, U>['method']]
export type InterceptURLS<T> = readonly InterceptURL<T>[]
export type InterceptsURLS<T> = readonly InterceptURLS<T>[]

// 抽取拦截参数的接口定义
export type ExtractInstanceConfig<T, U, M = defVoid> = 
  M extends ExtractInterfacesMethod<T> | defVoid
    ? U extends ExtractInterfacesURL<T, M>
      ? InstanceConfig<T, U, M>
      : never
    : never
  
// 获取多个URL共有的config
export type ExtractInterceptInstance<T, URLS, Attr extends string> = 
  ExtractValue<
    OmitNever<{
      [Index in keyof URLS]:
        URLS[Index] extends InterceptURL<T>
          ? URLS[Index] extends string
            ? ExtractInstanceConfig<T, URLS[Index]>
            : ExtractInstanceConfig<
                T, 
                URLS[Index][0], 
                URLS[Index][1]
              >
          : never
    }[keyof URLS]>,
    Attr
  >

// 拦截数组选项声明
export type InterceptAtom<T, URLS, ReqReturn = any, ResReturn = any> = {
  reqHandler?: (
    config: Omit<ExtractInterceptInstance<T, URLS, 'config'>, 'response'>
  ) => ReqReturn,
  errHandler?: (res?: BaseAxiosResponse) => void,
  resHandler?: (
    res: ExtractInterceptInstance<T, URLS, 'resData'> extends Promise<infer P> ? P : any
  ) => ResReturn
  urls: URLS,
}

// 去除所有相同属性
type ExtractPublic<T, R> = OmitNever<{
  [key in keyof T & keyof R]: 
    T[key] extends object
      ? T[key] extends R[key]
        ? R[key] extends T[key]
          ? never
          : ExtractPublic<T[key], R[key]>
        : R[key] extends object
          ? ExtractPublic<T[key], R[key]>
          : never
      : never
} & {
  [key in OmitBasic<keyof T, keyof R>]: T[key]
}>

// 传入请求配置更新接口
type UpdateInterfaceReq<
  T extends InterfaceConfig,
  NV
> = OmitNever<{
  [key in keyof T]: 
    key extends keyof NV 
      ? {} extends ExtractPublic<T[key], NV[key]>
        ? never
        : ExtractPublic<T[key], NV[key]>
      : T[key]
}>

// 传入请求响应配置更新接口
type UpdateInterface<
  T extends InterfaceConfig,
  NV
> = 'response' extends keyof NV
  ? Omit<UpdateInterfaceReq<T, NV>, 'response'> & { response: NV['response'] }
  : UpdateInterfaceReq<T, NV>

// 传入函数配置，更新所有接口
type UpdaeInterfaces<
  T extends InterfacesConfig, 
  US extends InterceptURLS<T>, 
  NV
> = {
  [M in keyof T]: {
    [I in OmitBasic<keyof T[M], keyof []>]: 
        T[M][I] extends InterfaceConfig
          ? T[M][I]['url'] extends US[keyof US]
            ? UpdateInterface<T[M][I], NV>
            : readonly [T[M][I]['url'], M] extends US[OmitBasic<keyof US, keyof []>]
              ? UpdateInterface<T[M][I], NV>
              : T[M][I]
        : T[M][I]
  } & {
    [key in keyof T[M] & keyof []]: T[M][key]
  }
}

// 通过拦截函数得resHandler和reqHandler更新所有接口
type InterceptAfterInterfaces<
  T extends InterfacesConfig, 
  US extends InterceptURLS<T>, 
  RET,
  RES
> = RET extends object | string | number | symbol 
  ? RES extends object | string | number | symbol 
    ? UpdaeInterfaces<T, US, RET & { response: RES }>
    : UpdaeInterfaces<T, US, RET>
  : RES extends object | string | number | symbol 
    ? UpdaeInterfaces<T, US, { response: RES }>
    : T

// 加工后得axios声明
export type AxiosStatic<T> = Omit<BaseAxiosStatic, keyof AxiosInstance<T>> 
  & AxiosInstance<T>

  
export const setupFactory = <T extends InterfacesConfig> () => {
  type NeedAtom<R> = InterceptAtom<T, R>
  type Needs = Array<NeedAtom<InterceptURLS<T>>>

  const needs: Needs = []

  const processAxios = {
    ...axios,
    addIntercept(intercept: any) {
      needs.push(intercept)
      return processAxios as any;
    }
  } as AxiosStatic<T>

  // 拦截处理函数
  const tapIntercept = (
    url: string, 
    method: BaseMethod | undefined,
    handler: (need: NeedAtom<any>) => void
  ) => {
    if (needs) {
      for (let need of needs) {
        const wise = need.urls.some(temp => 
          typeof temp === 'string'
            ? equalUrl(temp, url)
            : equalUrl(temp[1], url) && method === temp[0]
        )
        wise && handler(need)
      }
    }
  }

  const stopRequest = () => {
    const source = processAxios.CancelToken.source()
    source.cancel('Illegal request')
  }

  const errorHandler = (res: BaseAxiosResponse) => {
    if (res.config && res.config.url) {
      tapIntercept( 
        res.config.url, 
        res.config.method,
        ({errHandler}) => errHandler && errHandler()
      )
    }
    return Promise.reject(res)
  }

  processAxios.interceptors.request.use(config => {
    if (config.url && config.paths) {
      config.url = gendUrl(config.url, config.paths)

      let ret = { ...config } as any
      try {
        tapIntercept(ret.url, ret.method, ({reqHandler}) => {
          let attach = reqHandler && reqHandler(ret)
          if (attach) {
            for (let key in attach) {
              ret[key] = ret[key]
                ? { ...ret[key], ...attach[key] }
                : attach[key]
            }
          }
        })
      } catch {
        stopRequest()
      }
      console.log(ret)
      return ret
    } else {
      console.log('11')
      return config
    }
  })

  processAxios.interceptors.response.use(res => {
    if (res.status < 200 || res.status >= 300) {
      return errorHandler(res)
    } else if (res.config.url) {
      tapIntercept(res.config.url, res.config.method, ({resHandler}) => {
        res.data = resHandler && resHandler(res.data)
      })
      return res.data
    } else {
      return res.data
    }
  }, errorHandler)

  return processAxios
}

export default setupFactory
