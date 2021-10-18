
// 排除基本类型
export type OmitBasic<T extends string | number | symbol, K> = keyof {
  [key in T as key extends K ? never: key]: any
}
// 排除基本类型根据值
export type OmitValue<T, V> = {
  [key in keyof T as T[key] extends V ? never: key]: T[key]
}

// 提取对象的值
export type ExtractValue<T, K extends string> = 
  T extends { [key in K]: any } ? T[K] : never


// 抽取一个数组中所有子项的共同参数
export type ExtractArrayEle<
  T, 
  keys extends string | number | symbol, 
  tkeys = OmitBasic<keyof T, keyof []>
> = 
  tkeys extends keys
    ? {
        [key in keys]: 
          key extends keyof T 
            ? ExtractArrayEle<T[key], keys> 
            : never
      }[tkeys]
    : T

// 提取两对象得共有key和值，如果没有共有则都可
export type ExtractPublicOR<T, R> = {
  [key in keyof T | keyof R]: 
    key extends keyof T 
      ? key extends keyof R 
        ? T[key] extends object
          ? R[key] extends object
            ? {} extends ExtractPublicOR<T[key], R[key]>
              ? T[key] | R[key] 
              : ExtractPublicOR<T[key], R[key]>
            : T[key] | R[key]
          : T[key] extends R[key]
            ? R[key] extends T[key]
              ? T[key]
              : T[key] | R[key]
            : T[key] | R[key]
        : T[key] | undefined
      : key extends keyof R
        ? R[key] | undefined
        : never
}


// 提取两对象得共有key和值
export type ExtractPublicAnd<T, R> = {
  [key in keyof T | keyof R]: 
    key extends keyof T 
      ? key extends keyof R 
        ? T[key] extends object
          ? R[key] extends object
            ? {} extends ExtractPublicAnd<T[key], R[key]>
              ? never 
              : ExtractPublicAnd<T[key], R[key]>
            : never
          : T[key] extends R[key]
            ? R[key] extends T[key]
              ? T[key]
              : never
            : never
        : never
      : never
}


type defNever = '_def_never'

// 提取一个对象得所有共有参数不同则|
type ExtractShareORAuxiliary<
  T, 
  C = defNever,
  UNReadKeys extends string | number | symbol | never = defNever,
  R extends keyof T = UNReadKeys extends defNever 
    ? OmitBasic<keyof T, keyof []> 
    : OmitBasic<keyof T, keyof []> & UNReadKeys,
> = {
  [K in R]: 
    C extends defNever 
      ? ExtractShareORAuxiliary<T, T[K], OmitBasic<R, K>>
      : OmitBasic<R, K> extends never 
        ? ExtractPublicOR<C, T[K]>
        : ExtractShareORAuxiliary<T, ExtractPublicOR<C, T[K]>, OmitBasic<UNReadKeys, K>>
}


// 提取一个对象得所有共有参数
type ExtractShareANDAuxiliary<
  T, 
  C = defNever,
  UNReadKeys extends string | number | symbol | never = defNever,
  R extends keyof T = UNReadKeys extends defNever 
    ? OmitBasic<keyof T, keyof []> 
    : OmitBasic<keyof T, keyof []> & UNReadKeys,
> = {
  [K in R]: 
    C extends defNever 
      ? ExtractShareANDAuxiliary<T, T[K], OmitBasic<R, K>>
      : OmitBasic<R, K> extends never 
        ? ExtractPublicAnd<C, T[K]>
        : ExtractShareANDAuxiliary<T, ExtractPublicAnd<C, T[K]>, OmitBasic<UNReadKeys, K>>
}

// 抽取数组中所有共享参数
export type ExtractShareOR<T extends object> = 
  ExtractArrayEle<
    OmitValue<ExtractShareORAuxiliary<T>, defNever>,
    T extends any[] 
      ? OmitBasic<keyof T, keyof []> 
      : keyof T
  >

// 抽取数组中所有共享参数
export type ExtractShareAND<T extends object> = 
  ExtractArrayEle<
    OmitValue<ExtractShareANDAuxiliary<T>, defNever>,
    T extends any[] 
      ? OmitBasic<keyof T, keyof []> 
      : keyof T
  >



// 去除对象中值为never的keyValue
export type OmitNever<T> = {
  [P in keyof T as T[P] extends never ? never : P]: 
    T[P] extends object ? OmitNever<T[P]> : T[P]
}

