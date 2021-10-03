import * as React from 'react';
import App from './app';
import { renderToString } from 'react-dom/server'
import { StaticRouter as Router } from 'react-router-dom'
import { statePromises, injeState } from './state'

const getRenderString = (url: string, inje: any) => {
  const Element = (
    <Router location={url}>
      <App />
    </Router>
  )

  inje && injeState(inje)

  const promises = Object.values(statePromises)
  if (promises.length) {
    return Promise.all(promises)
      .then(() => renderToString(Element))
  } else {
    return Promise.resolve(renderToString(Element))
  }
}
export default getRenderString