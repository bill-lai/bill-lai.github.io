export * from './withParentClass'
export * from './withScreenShow'


export type Component<P = {}> = (props: P, ...args: any) => React.ReactElement | null