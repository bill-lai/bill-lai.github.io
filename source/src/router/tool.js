import { resolve } from 'path'

export const normalize = (router, base = '') => {
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

export const queryRoute = (router, qname) => {
  for (let route of router) {
    let croute

    if (route.name === qname) {
      return route
    } else if (route.children && (croute = queryRoute(qname))) {
      return croute
    }
  }
}

export const queryRoutePath = (router, qname) => {
  let route = queryRoute(router, qname)
  return route ? route.path : null
}