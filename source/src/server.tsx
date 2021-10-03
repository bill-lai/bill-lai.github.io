import * as React from 'react';
import App from './app';
import { renderToString } from 'react-dom/server'
import { StaticRouter as Router } from 'react-router-dom'
import { statePromises, injectState } from './state'
import { injectPlatform } from './platform'

let appTitle = ''
injectPlatform({
  setAppTitle: title => appTitle = title,
  getAppTitle: () => appTitle
})

const getRenderInfo = async (url: string, inje: any) => {
  const Element = (
    <Router location={url}>
      <App />
    </Router>
  )

  inje && injectState(inje)

  await Promise.all(Object.values(statePromises))

  return {
    html: renderToString(Element),
    title: appTitle
  }
  
}
export default getRenderInfo