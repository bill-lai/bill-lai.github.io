import Home from '../views/home'
import Column from '../views/column'
import { generatePath as toolGeneratePath } from 'react-router-dom'
import {
  normalize,
  queryRoute as toolQueryRoute,
  queryRoutePath as toolQueryRoutePath
} from './tool'

export const router = normalize([
  {
    main: true,
    name: 'home',
    path: '/home',
    Component: Home,
  },
  {
    name: 'column',
    path: '/column',
    Component: Column
  }
])

export const home = router.find(({main}) => main)
export const homePath = home.path

export const queryRoute = name => toolQueryRoute(router, name) || home

export const queryRoutePath = name => toolQueryRoutePath(router, name) || home.path

export const generatePath = (name, params) => {
  const path = queryRoutePath(name)
  return path ? toolGeneratePath(path, params) : home
}