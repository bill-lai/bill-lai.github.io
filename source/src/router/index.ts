import * as React from 'react'
import Home from '../views/home'
import Special from '../views/special'
import Archive from '../views/archive'
import Article from '../views/article'
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
    path: '/',
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
  {
    name: 'article',
    path: '/article/:id',
    Component: Article
  },
  
])

export const home = router.find(({main}) => main)
export const homePath = home ? home.path : ''

export const queryRoute = (name: string): Route | undefined => 
  toolQueryRoute(router, name) || home

export const queryRoutePath = (name: string, params?: ExtractRouteParams<string>): string => {
  const route = queryRoute(name)
  const path = route ? route.path : homePath

  return params 
    ? toolGeneratePath(path, params)
    : path
}