interface content{ 
  [key: string]: any 
}

declare module '*.scss' {
  export default content
}

declare module '*.css' {
  export default content
}