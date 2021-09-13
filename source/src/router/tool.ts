import { resolve } from 'path'
import { Route, Routes } from './index'

export const normalize = (router: Routes, base: string = ''): Routes => {
  const nRouter = []

  for (let route of router) {
    const path = resolve(base, route.path)
    const children = route.children && normalize(route.children, path)
    nRouter.push({
      ...route,
      path,
      children
    })
  }

  return nRouter
}

export const queryRoute = (router: Routes, qname: string): Route | undefined => {
  for (let route of router) {
    let croute

    if (route.name === qname) {
      return route
    } else if (route.children && (croute = queryRoute(route.children, qname))) {
      return croute
    }
  }
}
