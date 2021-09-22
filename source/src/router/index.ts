import * as React from 'react'
import Home from '../views/home'
import Special from '../views/special'
import Archive from '../views/archive'
import { generatePath as toolGeneratePath } from 'react-router-dom'
import { ExtractRouteParams } from 'react-router'
import {
  normalize,
  queryRoute as toolQueryRoute,
} from './tool'

export type Routes = Array<Route>
export interface Route {
  name: string,
  path: string,
  Component: React.ComponentType,
  main?: boolean,
  children?: Routes
}


export const router: Routes = normalize([
  {
    main: true,
    name: 'home',
    path: '/home',
    Component: Home,
  },
  {
    name: 'special',
    path: '/special',
    Component: Special
  },
  {
    name: 'archive',
    path: '/archive',
    Component: Archive
  },
  
])

export const home = router.find(({main}) => main)
export const homePath = home ? home.path : ''

export const queryRoute = (name: string): Route | undefined => 
  toolQueryRoute(router, name) || home

export const queryRoutePath = (name: string): string => {
  const route = queryRoute(name)
  return route ? route.path : homePath
}

export type paramsType = ExtractRouteParams<string>

export const generatePath = (name: string, params: paramsType) => {
  const path = queryRoutePath(name)
  return path ? toolGeneratePath(path, params) : home
}