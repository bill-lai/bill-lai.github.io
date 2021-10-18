import { equalUrl, gendUrl } from 'src/util'
import axios, {
  Method as BaseMethod,
  AxiosRequestConfig as BaseAxiosReqConfig,
  AxiosStatic as BaseAxiosStatic,
  AxiosResponse as BaseAxiosResponse
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
  [P in keyof T as T[P] extends never ? never : P]: 
    T[P] extends object ? OmitNever<T[P]> : P extends never ? P : T[P]
}


type defMethod = null
type defVoid = void | undefined | null

// 接口配置值
export type InterfaceConfig = {
  url: string,
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
      : never
    : never

// 提取接口所有url
export type ExtractInterfacesAllURL<T> = {
  [key in keyof T]: 
    T[key] extends InterfaceConfigArray 
      ? ExtractInterfaceArrayURL<T[key]>
      : never
}[keyof T]

// 提取全部或者method的所有url
export type ExtractInterfacesURL<T, M = defMethod> = 
  M extends defMethod
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
export type ExtractInterface<T, U, M = defMethod> = 
  M extends defMethod 
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
  M = defMethod, 
  Config = ExtractInterface<T, U, M>
> = {
  config: ExtractInterface<T, U>,
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
> = 
  {} extends ExtractValue<instance, 'givenReqConfig'> 
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
  getUri<URL extends ExtractInterfacesURL<T, GETURIM>, >( 
    config: ExtractValue<
        InstanceConfig<T, URL, GETURIM>, 
        'getUriConfig'
      > 
      & { url: URL } 
  ): string;

  request<
    URL extends ExtractInterfacesURL<T, Method>,
    Method extends ExtractInterfacesMethod<T> | 
      defMethod = defMethod
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
}

// 抽取拦截参数的接口定义
export type ExtractInstanceConfig<T, U, M = defMethod> = 
  M extends ExtractInterfacesMethod<T> | defMethod
    ? U extends ExtractInterfacesURL<T, M>
      ? InstanceConfig<T, U, M>
      : never
    : never

// 拦截urls参数
export type InterceptURL<T extends InterfacesConfig> = 
  string | readonly [string, ExtractInterfacesMethod<T>]
export type InterceptURLS<T> = readonly InterceptURL<T>[]
export type InterceptsURLS<T> = readonly InterceptURLS<T>[]

// 获取多个URL共有的config
export type ExtractInterceptInstance<
  T, 
  URLS extends InterceptURLS<T>
> = {
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
}

// 拦截数组选项声明
export type InterceptAtom<
  T extends InterfacesConfig, 
  URLS extends InterceptURLS<T>
> = {
  reqHandler?: (
    config: ExtractValue<
        ExtractInterceptInstance<T, URLS>[keyof URLS], 
        'config'
      >
  ) => Partial<ExtractValue<
        ExtractInterceptInstance<T, URLS>[keyof URLS], 
        'config'
      >> | void,
  errHandler?: (res?: BaseAxiosResponse) => void,
  resHandler?: (
    res: ExtractValue<
        ExtractInterceptInstance<T, URLS>[keyof URLS], 
        'resData'
      >
  ) => any
  urls: URLS
}

// 拦截对象数组声明
export type InterceptsConfig<
  T extends InterfacesConfig, 
  R extends InterceptsURLS<T>
> = {
  [index in keyof R]: 
    R[index] extends InterceptURLS<T>
      ? InterceptAtom<T, R[index]>
      : index extends keyof []
        ? [][index]
        : undefined
}

// 抽取指定url或 method跟url的拦截器
export type ExtractInterceptConfig<
  T extends InterfacesConfig,
  R extends InterceptsURLS<T>,
  C extends InterceptsConfig<T, R>,
  U extends InterceptURL<T>
> = OmitNever<{
  [key in keyof C]: 
    C[key] extends ExtractPubIntercept<T, C>
      ? U extends C[key]['urls'][number]
        ? C[key]
        : never
      : never
}>

// 抽取共有配置
export type ExtractPubIntercept<
  T extends InterfacesConfig, 
  R extends InterceptsConfig<T, InterceptsURLS<T>>
> = InterceptAtom<
    T, 
    R extends InterceptsConfig<T, infer P> ? P[number] : never
  > 

// 加工后axios对象
export type AxiosStatic<T> = 
  Omit<BaseAxiosStatic, keyof AxiosInstance<T>> & AxiosInstance<T>

// 指定记接口加入指定拦截函数加工
export type ProcessInterfaceConfig<
  T extends InterfacesConfig,
  R extends InterceptsURLS<T>,
  C extends InterceptsConfig<T, R>,
  TI extends InterfaceConfig,
  CI extends ExtractPubIntercept<T, C>
> = CI['reqHandler'] extends (...args: any) => any
? ReturnType<CI['reqHandler']> extends defVoid
  ? CI['resHandler'] extends (...args: any) => any
    ? Exclude<TI, 'response'> & { response: ReturnType<CI['resHandler']> }
    : TI
  : CI['resHandler'] extends (...args: any) => any
    ? Exclude<TI, keyof ReturnType<CI['reqHandler']> | 'response'>
        & { response: ReturnType<CI['reqHandler']> }
    : Exclude<TI, keyof ReturnType<CI['reqHandler']>>
: CI['resHandler'] extends (...args: any) => any
  ? Exclude<TI, 'response'> & { response: ReturnType<CI['resHandler']> }
  : TI

// 将拦截函数的加工并入接口声明
export type ProcessInterfacesConfig<
  T extends InterfacesConfig,
  R extends InterceptsURLS<T>,
  C extends InterceptsConfig<T, R>,
> = R extends InterceptsURLS<T>
  ? {
    [M in keyof T]: {
      [I in OmitBasic<keyof T[M], keyof []>]: 
        T[M][I] extends InterfaceConfig
          ? ExtractInterceptConfig<T, R, C, T[M][I]['url']> extends InterceptAtom<T, readonly [T[M][I]['url']]>[]
            ? 123
            // ? ProcessInterfaceConfig<
            //     T, 
            //     R, 
            //     C, 
            //     T[M][I],  
            //     ExtractInterceptConfig<T, R, C, T[M][I]['url']>
            //   >
            : ExtractInterceptConfig<T, R, C, T[M][I]['url']>
          : T[M][I]
    }
  }
  : T

export const setupFactory = <T extends InterfacesConfig> () => {
  let isSetup = false

  return <
    interceptsURLS extends InterceptsURLS<T>,
    R extends InterceptsConfig<T, interceptsURLS>
  >( needs?: R )  => {
    type ProcessIntercepts = R extends never 
      ? 123
      : ProcessInterfacesConfig<
        T, 
        interceptsURLS, 
        R
      >

    type processAxios = AxiosStatic<ProcessIntercepts> & {
      test: ProcessIntercepts
    }

    if (isSetup) return axios as processAxios

    // 拦截处理函数
    const tapIntercept = (
      url: string, 
      method: BaseMethod | undefined,
      handler: (need: ExtractPubIntercept<T, R>) => void
    ) => {
      if (needs) {
        for (let need of needs) {
          const wise = need.urls.some(temp => 
            typeof temp === 'string'
              ? equalUrl(temp, url)
              : equalUrl(temp[1], url) && method === temp[0]
          )
          wise && handler(need as any)
        }
      }
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
          res.config.method,
          ({errHandler}) => errHandler && errHandler()
        )
      }
      return Promise.reject(res)
    }

    axios.interceptors.request.use(config => {
      if (config.url) {
        config.url = gendUrl(config.url, config.params)

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
        return ret
      } else {
        return config
      }
    })

    axios.interceptors.response.use(res => {
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

    return axios as processAxios
  }

}

export default setupFactory
